"""Upscale the three WhatsApp-compressed sunset shots 4x with Real-ESRGAN
(realesr-general-x4v3, the model trained for real-world photos with JPEG and
sensor noise), on the CPU, without PyTorch.

The released weights are a PyTorch checkpoint, read here with a small
unpickler; the network (SRVGGNetCompact: 34 convolutions, PReLU, a pixel
shuffle and a nearest-neighbour skip) is rebuilt as an ONNX graph and run
with onnxruntime. As in Real-ESRGAN's own script, the general model and its
weak-denoise twin are interpolated to set how hard JPEG blocking and noise
are cleaned up.

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/sunset/upscale.py          # writes sunset-*-x4.png
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


def main():
    model = build(weights())
    session = ort.InferenceSession(model.SerializeToString(), providers=["CPUExecutionProvider"])
    for name in SHOTS:
        src = cv2.imread(str(HERE / name))
        out = upscale(session, src)
        dst = HERE / name.replace(".jpg", "-x4.png")
        cv2.imwrite(str(dst), out)
        print(f"{name} {src.shape[1]}x{src.shape[0]} -> {dst.name} {out.shape[1]}x{out.shape[0]}")


if __name__ == "__main__":
    main()
