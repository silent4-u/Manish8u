"""Upscale the three WhatsApp-compressed sunset shots 4x with Real-ESRGAN, on
the CPU, without PyTorch. Two models, used together by merge_sunset.py:

  -x4.png      realesr-general-x4v3: light, natural, keeps some texture
  -x4plus.png  RealESRGAN_x4plus (RRDBNet, 23 residual-in-residual dense
               blocks): the crispest edges and cleanest surfaces

The released weights are a PyTorch checkpoint, read here with a small
unpickler; the network (SRVGGNetCompact: 34 convolutions, PReLU, a pixel
shuffle and a nearest-neighbour skip) is rebuilt as an ONNX graph and run
with onnxruntime. As in Real-ESRGAN's own script, the general model and its
weak-denoise twin are interpolated to set how hard JPEG blocking and noise
are cleaned up.

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/sunset/upscale.py   # writes sunset-*-x4.png and -x4plus.png
"""

import collections
import io
import pickle
import urllib.request
import zipfile
from pathlib import Path

import cv2
import numpy as np
import onnx
import onnxruntime as ort
from onnx import TensorProto, helper, numpy_helper

HERE = Path(__file__).resolve().parent
CACHE = Path.home() / ".cache" / "realesrgan"
RELEASE = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/"
MODELS = ("realesr-general-x4v3.pth", "realesr-general-wdn-x4v3.pth")
SHOTS = ("sunset-tower.jpg", "sunset-sun.jpg", "sunset-wide.jpg")
DENOISE = 0.6  # 0 keeps the grain, 1 cleans hardest
NUM_CONV, SCALE = 32, 4
X4PLUS = ("https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/", "RealESRGAN_x4plus.pth")
RRDB_BLOCKS, TILE, PAD = 23, 160, 12


# ------------------------------------------------- read a .pth, no torch ----

def load_pth(path):
    zf = zipfile.ZipFile(path)
    root = next(n for n in zf.namelist() if n.endswith("data.pkl")).rsplit("/", 1)[0]
    dtypes = {"FloatStorage": np.float32, "HalfStorage": np.float16, "DoubleStorage": np.float64}

    def rebuild(storage, offset, size, stride, *_):
        item = storage.itemsize
        return np.lib.stride_tricks.as_strided(
            storage[offset:], shape=tuple(size), strides=tuple(s * item for s in stride)).copy()

    class Unpickler(pickle.Unpickler):
        def find_class(self, module, name):
            if name == "_rebuild_tensor_v2":
                return rebuild
            if name == "_rebuild_parameter":
                return lambda data, *_: data
            if module == "collections" and name == "OrderedDict":
                return collections.OrderedDict
            if name.endswith("Storage"):
                return name
            return super().find_class(module, name)

        def persistent_load(self, pid):
            _, storage_type, key, _, _ = pid
            raw = zf.read(f"{root}/data/{key}")
            return np.frombuffer(raw, dtypes[storage_type])

    state = Unpickler(io.BytesIO(zf.read(f"{root}/data.pkl"))).load()
    for k in ("params_ema", "params"):
        if k in state:
            return state[k]
    return state


def weights():
    CACHE.mkdir(parents=True, exist_ok=True)
    for name in MODELS:
        if not (CACHE / name).exists():
            urllib.request.urlretrieve(RELEASE + name, CACHE / name)
    strong, weak = (load_pth(CACHE / n) for n in MODELS)
    return {k: (DENOISE * strong[k] + (1 - DENOISE) * weak[k]).astype(np.float32) for k in strong}


# --------------------------------------------------- the network as ONNX ----

def build(params):
    nodes, inits = [], []
    x = "input"
    convs = [i for i in range(0, 2 * NUM_CONV + 3, 2)]  # body.0, 2, ... 66
    for n, i in enumerate(convs):
        wname, bname = f"body.{i}.weight", f"body.{i}.bias"
        inits += [numpy_helper.from_array(params[wname], wname), numpy_helper.from_array(params[bname], bname)]
        y = f"conv{i}"
        nodes.append(helper.make_node("Conv", [x, wname, bname], [y], kernel_shape=[3, 3], pads=[1, 1, 1, 1]))
        x = y
        if n < len(convs) - 1:  # every conv but the last is followed by a PReLU
            sname = f"body.{i + 1}.weight"
            inits.append(numpy_helper.from_array(params[sname].reshape(-1, 1, 1), sname))
            y = f"act{i}"
            nodes.append(helper.make_node("PRelu", [x, sname], [y]))
            x = y
    nodes.append(helper.make_node("DepthToSpace", [x], ["shuffled"], blocksize=SCALE, mode="CRD"))
    inits.append(numpy_helper.from_array(np.array([1, 1, SCALE, SCALE], np.float32), "scales"))
    nodes.append(helper.make_node("Resize", ["input", "", "scales"], ["base"], mode="nearest"))
    nodes.append(helper.make_node("Add", ["shuffled", "base"], ["output"]))
    graph = helper.make_graph(
        nodes, "SRVGGNetCompact",
        [helper.make_tensor_value_info("input", TensorProto.FLOAT, [1, 3, None, None])],
        [helper.make_tensor_value_info("output", TensorProto.FLOAT, [1, 3, None, None])],
        inits)
    model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 17)], ir_version=8)
    onnx.checker.check_model(model)
    return model


def upscale(session, bgr):
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    out = session.run(None, {"input": rgb.transpose(2, 0, 1)[None]})[0][0]
    out = np.clip(out.transpose(1, 2, 0), 0, 1)
    return cv2.cvtColor((out * 255 + 0.5).astype(np.uint8), cv2.COLOR_RGB2BGR)


# ------------------------------------------------- RealESRGAN_x4plus -------

def build_rrdb(p):
    """RRDBNet (ESRGAN) as ONNX: conv, 23 RRDBs, conv, two x2 upsamples, out."""
    nodes, inits, n = [], [], [0]

    def name(prefix):
        n[0] += 1
        return f"{prefix}_{n[0]}"

    def conv(x, key, act=False):
        w, b = f"{key}.weight", f"{key}.bias"
        if w not in {i.name for i in inits}:
            inits.extend([numpy_helper.from_array(p[w], w), numpy_helper.from_array(p[b], b)])
        y = name("conv")
        nodes.append(helper.make_node("Conv", [x, w, b], [y], kernel_shape=[3, 3], pads=[1, 1, 1, 1]))
        if act:
            z = name("lrelu")
            nodes.append(helper.make_node("LeakyRelu", [y], [z], alpha=0.2))
            return z
        return y

    def scaled_add(x, res):  # x * 0.2 + res
        y, z = name("mul"), name("add")
        nodes.append(helper.make_node("Mul", [x, "point2"], [y]))
        nodes.append(helper.make_node("Add", [y, res], [z]))
        return z

    def cat(xs):
        y = name("cat")
        nodes.append(helper.make_node("Concat", xs, [y], axis=1))
        return y

    def rdb(x, key):
        feats = [x]
        for i in range(1, 5):
            feats.append(conv(cat(feats) if len(feats) > 1 else x, f"{key}.conv{i}", act=True))
        return scaled_add(conv(cat(feats), f"{key}.conv5"), x)

    def up(x):
        y = name("up")
        nodes.append(helper.make_node("Resize", [x, "", "x2"], [y], mode="nearest"))
        return y

    inits.append(numpy_helper.from_array(np.array(0.2, np.float32), "point2"))
    inits.append(numpy_helper.from_array(np.array([1, 1, 2, 2], np.float32), "x2"))
    feat = conv("input", "conv_first")
    x = feat
    for b in range(RRDB_BLOCKS):
        y = x
        for r in (1, 2, 3):
            y = rdb(y, f"body.{b}.rdb{r}")
        x = scaled_add(y, x)
    body = conv(x, "conv_body")
    nodes.append(helper.make_node("Add", [feat, body], ["trunk"]))
    x = conv(up("trunk"), "conv_up1", act=True)
    x = conv(up(x), "conv_up2", act=True)
    x = conv(conv(x, "conv_hr", act=True), "conv_last")
    nodes.append(helper.make_node("Identity", [x], ["output"]))
    graph = helper.make_graph(
        nodes, "RRDBNet",
        [helper.make_tensor_value_info("input", TensorProto.FLOAT, [1, 3, None, None])],
        [helper.make_tensor_value_info("output", TensorProto.FLOAT, [1, 3, None, None])],
        inits)
    model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 17)], ir_version=8)
    onnx.checker.check_model(model)
    return model


def upscale_tiled(session, bgr):
    """Run in overlapping tiles so the dense blocks fit in memory."""
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    h, w = rgb.shape[:2]
    out = np.zeros((h * SCALE, w * SCALE, 3), np.float32)
    for y0 in range(0, h, TILE):
        for x0 in range(0, w, TILE):
            y1, x1 = min(y0 + TILE, h), min(x0 + TILE, w)
            ya, xa, yb, xb = max(y0 - PAD, 0), max(x0 - PAD, 0), min(y1 + PAD, h), min(x1 + PAD, w)
            tile = rgb[ya:yb, xa:xb].transpose(2, 0, 1)[None]
            res = session.run(None, {"input": np.ascontiguousarray(tile)})[0][0].transpose(1, 2, 0)
            oy, ox = (y0 - ya) * SCALE, (x0 - xa) * SCALE
            out[y0 * SCALE:y1 * SCALE, x0 * SCALE:x1 * SCALE] = \
                res[oy:oy + (y1 - y0) * SCALE, ox:ox + (x1 - x0) * SCALE]
    out = np.clip(out, 0, 1)
    return cv2.cvtColor((out * 255 + 0.5).astype(np.uint8), cv2.COLOR_RGB2BGR)


def main():
    model = build(weights())
    session = ort.InferenceSession(model.SerializeToString(), providers=["CPUExecutionProvider"])
    if not (CACHE / X4PLUS[1]).exists():
        urllib.request.urlretrieve(X4PLUS[0] + X4PLUS[1], CACHE / X4PLUS[1])
    rrdb = build_rrdb(load_pth(CACHE / X4PLUS[1]))
    heavy = ort.InferenceSession(rrdb.SerializeToString(), providers=["CPUExecutionProvider"])
    for name in SHOTS:
        src = cv2.imread(str(HERE / name))
        for suffix, run in (("-x4.png", lambda im: upscale(session, im)),
                            ("-x4plus.png", lambda im: upscale_tiled(heavy, im))):
            dst = HERE / name.replace(".jpg", suffix)
            out = run(src)
            cv2.imwrite(str(dst), out)
            print(f"{name} -> {dst.name} {out.shape[1]}x{out.shape[0]}", flush=True)


if __name__ == "__main__":
    main()
