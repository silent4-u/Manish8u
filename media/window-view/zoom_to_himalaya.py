"""From the chair to the window, and on to the Himalaya.

window-before.mp4 is a phone clip zooming from a chair towards the window
grill: trees, roofs, and a hazy horizon with faint hills. This script puts
the snow massif from ../himalaya-view/himalaya-before.jpg on that horizon
and carries the zoom on past the end of the clip, until the peak fills the
frame:

  window-to-himalaya.mp4   1080 x 1920, about 28 s, with the clip's own sound

  1. Tracking. The camera's zoom, drift and shake are measured frame to
     frame (corner tracking, with the dark bars left out, and a similarity
     fitted with RANSAC), and chained to the clip's last frame.
  2. The mountain in the clip. The massif is placed in the last frame's
     sky, its foot behind the faint hills, and moved with the camera into
     every earlier frame. It is drawn only where the clip shows sky, so the
     bars, the leaves and the curtain stay in front of it. A mountain that
     far away is seen through a lot of air: it is drawn relative to the
     clip's own sky colour, its shading weakened, its foot fading into the
     haze, so it looks as pale as the faint hills do.
  3. The zoom carries on. The last frame is split into the grill (and the
     sill) and the view behind it, where LaMa paints in what the bars hid.
     The camera zooms on towards the peak, and moves up to the grill: the
     bars grow faster than the view, go out of focus and slide out of the
     frame, as they do when a phone is brought up to a window. The hand's
     small shake goes on. The mountain is drawn from the photo enlarged
     with Real-ESRGAN, so it gains detail as it fills the frame. With the
     dark room gone from the frame, the exposure settles lower and the
     mountain stands out more clearly from the sky.
  4. Sound: the clip's own ambience, carried on by crossfading pieces of it.

    pip install numpy opencv-python-headless onnx onnxruntime imageio-ffmpeg
    python3 media/window-view/zoom_to_himalaya.py      # about 10 minutes on CPU
"""

import re
import subprocess
import sys
import wave
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "himalaya-view"))
sys.path.insert(0, str(HERE.parent / "old-photo"))
sys.path.insert(0, str(HERE.parent / "sunset"))
import enhance as e  # noqa: E402
import onnxruntime as ort  # noqa: E402
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402
from make_video import spread  # noqa: E402

SOURCE = HERE / "window-before.mp4"
OUTPUT = HERE / "window-to-himalaya.mp4"
CACHE = Path.home() / ".cache" / "window-view"
SIZE = (1080, 1920)          # the film's frame
FPS = 30
MORE = 13.0                  # seconds of zoom after the clip ends
SUMMIT = (680, 628)          # the main summit in the photo (px)
PLACE = (345, 128, 0.45)     # where it sits in the clip's last frame, and photo px per frame px
CROP = (520, 1110)           # the photo's rows holding the massif
SNOW_WHITE = 88.0            # lightness of the photo's sunlit snow
DAYLIGHT = (0.0, -8.0)       # a*, b* the snow's colour is taken against: sunlit snow a touch warmer than the sky
END = ((345, 185), 3.7)      # the last view: its centre in the last frame, and its zoom
GRILL = (300, 120)           # the point of the grill the phone is brought up to


# ------------------------------------------------------------------- clip ----

def read_clip():
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    info = subprocess.run([ff, "-i", str(SOURCE)], capture_output=True, text=True).stderr
    w, h = (int(v) for v in re.search(r" Video: .*?, (\d+)x(\d+)", info).groups())
    raw = subprocess.run([ff, "-loglevel", "error", "-i", str(SOURCE), "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)


def track(frames):
    """For every frame, the similarity taking it onto the last frame."""
    gray = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in frames]
    steps = []
    for i in range(len(frames) - 1):
        # The bars are near and the view is far; track the view.
        dark = (frames[i].max(2) < 60).astype(np.uint8)
        mask = (cv2.dilate(dark, np.ones((9, 9), np.uint8)) == 0).astype(np.uint8) * 255
        p0 = cv2.goodFeaturesToTrack(gray[i], 600, 0.01, 6, mask=mask)
        if p0 is None or len(p0) < 30:
            p0 = cv2.goodFeaturesToTrack(gray[i], 600, 0.01, 6)
        p1, st, _ = cv2.calcOpticalFlowPyrLK(gray[i], gray[i + 1], p0, None, winSize=(21, 21), maxLevel=3)
        pb, st2, _ = cv2.calcOpticalFlowPyrLK(gray[i + 1], gray[i], p1, None, winSize=(21, 21), maxLevel=3)
        ok = (st[:, 0] == 1) & (st2[:, 0] == 1) & (np.linalg.norm(pb - p0, axis=2)[:, 0] < 0.7)
        m, _ = cv2.estimateAffinePartial2D(p0[ok], p1[ok], method=cv2.RANSAC, ransacReprojThreshold=1.2)
        steps.append(np.vstack([m, [0, 0, 1]]))
    T = [np.eye(3)]
    for m in reversed(steps):
        T.append(T[-1] @ m)
    return np.array(T[::-1])


# --------------------------------------------------------------- mountain ----

def mountain(scale):
    """The massif, as colour relative to the sky behind it, at `scale` times
    the photo's size (rows CROP): lightness against sunlit snow, colour
    against daylight, and its cover. The far ends and the foot fade into
    the haze."""
    path = CACHE / f"mountain-{scale}.npy"
    if path.exists():
        return np.load(path)
    img = cv2.imread(str(e.SOURCE))
    sky, fol, snow, dist, _, _ = e.regions(img)
    y0, y1 = CROP
    f = img[y0:y1].astype(np.float32) / 255
    h, w = f.shape[:2]
    size = (w * scale, h * scale)
    if scale > 1:
        f = e.enlarge(f, 0.6 * snow[y0:y1] + 0.85 * dist[y0:y1], size)
        f = e.sharpen(f, cv2.resize(0.45 * snow[y0:y1], size), cv2.resize(0.15 * snow[y0:y1], size), k=scale / 2)

    def up(m):
        return cv2.resize(m.astype(np.float32), size, interpolation=cv2.INTER_LINEAR)

    # The enhancer's snow mask reaches a few pixels into the sky; there the
    # photo is plain blue sky, which would draw as a dark blue outline. So
    # strong blue beside the sky counts as sky too (the bluest snow shadow
    # is far less blue).
    b = cv2.cvtColor(img[y0:y1].astype(np.float32) / 255, cv2.COLOR_BGR2LAB)[..., 2]
    rows = np.arange(y0, y1, dtype=np.float32)[:, None]
    by_sky = cv2.dilate((sky[y0:y1] > 0.5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
    sky = np.maximum(sky[y0:y1], e.smooth(-b, 16, 21) * by_sky * (1 - e.smooth(rows, 900, 960)))
    sky, fol = up(sky), up(fol[y0:y1])
    lab = cv2.cvtColor(np.clip(f, 0, 1).astype(np.float32), cv2.COLOR_BGR2LAB)
    # Edge pixels hold some of the photo's deep blue sky; take their colour
    # from just inside the mountain instead (or from a little further in
    # where nothing is near), or it gets a dark blue outline.
    inner = cv2.erode(((sky < 0.02) & (fol < 0.5)).astype(np.float32), np.ones((3 * scale, 3 * scale), np.uint8))
    near = [(cv2.GaussianBlur(lab * inner[..., None], (0, 0), r * scale),
             cv2.GaussianBlur(inner, (0, 0), r * scale)[..., None]) for r in (1.5, 5.0)]
    edge = np.where(near[0][1] > 0.05, near[0][0] / np.maximum(near[0][1], 1e-6),
                    near[1][0] / np.maximum(near[1][1], 1e-6))
    lab = np.where(inner[..., None] > 0, lab, edge)
    d = lab[..., 0] - SNOW_WHITE
    dL = np.where(d > -20, d, -20 + 0.25 * (d + 20))     # the darkest rock and forest, barely seen
    yy = np.arange(h * scale, dtype=np.float32)[:, None] / scale + y0
    xx = np.arange(w * scale, dtype=np.float32)[None, :] / scale
    fade = (1 - 0.7 * e.smooth(yy, 700, 935)) * (1 - e.smooth(yy, 930, 990)) * \
        e.smooth(xx, 170, 300) * (1 - e.smooth(xx, 960, 1075))
    cover = np.clip((0.4 - sky) / 0.4, 0, 1) * (1 - fol) * \
        (1 - e.smooth(yy, 1030, 1090)) * e.smooth(yy, 560, 600) * np.ones_like(xx)
    out = np.dstack([dL * fade, (lab[..., 1] - DAYLIGHT[0]) * fade, (lab[..., 2] - DAYLIGHT[1]) * fade,
                     cover]).astype(np.float32)
    CACHE.mkdir(parents=True, exist_ok=True)
    np.save(path, out)
    return out


def placement(scale):
    """Mountain-layer pixels (at `scale`) to the clip's last frame."""
    x, y, k = PLACE
    to_photo = np.array([[1 / scale, 0, 0], [0, 1 / scale, CROP[0]], [0, 0, 1]])
    to_frame = np.array([[k, 0, x - k * SUMMIT[0]], [0, k, y - k * SUMMIT[1]], [0, 0, 1]])
    return to_frame @ to_photo


def pyramid(layer, levels=4):
    out = [layer]
    for _ in range(levels):
        out.append(cv2.pyrDown(out[-1]))
    return out


def warp_layer(pyr, m, size, sharp=True):
    """The mountain layer through the affine m (layer px to output px),
    from the pyramid level matching its scale; `sharp` blends two levels
    so the zoom never steps."""
    s = np.sqrt(abs(np.linalg.det(m[:2, :2])))
    lv = float(np.clip(np.log2(0.75 / s), 0, len(pyr) - 1.001)) if s < 0.75 else 0.0
    lo = int(lv)

    def at(level):
        a = m @ np.diag([2.0 ** level, 2.0 ** level, 1])
        return cv2.warpAffine(pyr[level], a[:2].astype(np.float32), size, flags=cv2.INTER_LINEAR,
                              borderMode=cv2.BORDER_CONSTANT)

    if not sharp or lv == lo:
        return at(lo)
    t = lv - lo
    return at(lo) * (1 - t) + at(lo + 1) * t


def horizon(last):
    """1 above the faint hills on the last frame's horizon, 0 below: the
    massif's foot goes behind them."""
    lab = cv2.cvtColor(last.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
    L = cv2.GaussianBlur(lab[..., 0], (0, 0), 1.5)
    top = 256                                             # just under the grill's middle bar
    ref = np.median(L[top:top + 8], axis=0)
    chroma = np.median(np.hypot(lab[top:top + 8, :, 1], lab[top:top + 8, :, 2]), axis=0)
    sky = (ref > 88.5) & (chroma < 8)                     # columns with open sky under the bar
    w = last.shape[1]
    line = np.empty(w)
    for x in range(w):
        below = L[top:top + 84, x] < ref[x] - 1.6
        line[x] = top + (np.argmax(below) if below.any() else 84)
    xs = np.arange(w)
    line = np.interp(xs, xs[sky], line[sky])
    line = np.median(np.lib.stride_tricks.sliding_window_view(np.pad(line, 4, mode="edge"), 9), axis=1)
    line = cv2.GaussianBlur(line.astype(np.float32).reshape(1, -1), (0, 0), 3).ravel()
    rows = np.arange(last.shape[0], dtype=np.float32)[:, None]
    return np.clip((line[None, :] - rows) / 2 + 0.5, 0, 1).astype(np.float32)


def sky_of(lab):
    """The clip's sky colour everywhere (Lab), from the smooth, light,
    near-neutral pixels, and how much each pixel is sky."""
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    grad = np.hypot(cv2.Sobel(L, cv2.CV_32F, 1, 0), cv2.Sobel(L, cv2.CV_32F, 0, 1))
    cand = (L > 70) & (np.hypot(A, B) < 14) & (grad < 6)
    cand = cv2.erode(cand.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    model = spread(lab, cand)
    near = 1 - e.smooth(np.sqrt(((lab - model) ** 2).sum(2)), 3.0, 8.0)
    return model, near


def draw(model, rel, kL, off, kc):
    """The mountain's colour, given the sky behind it and the haze."""
    lab = np.dstack([model[..., 0] + off + kL * rel[..., 0], model[..., 1] + kc * rel[..., 1],
                     model[..., 2] + kc * rel[..., 2]])
    return cv2.cvtColor(lab.astype(np.float32), cv2.COLOR_LAB2BGR)


HAZE = dict(kL=0.55, off=3.0, kc=0.3)        # how the mountain shows through the clip's haze
CLEAR = dict(kL=1.05, off=3.5, kc=0.5)       # and once the exposure has settled on it


# ---------------------------------------------------------------- part 1 ----

def unsharp(img, amount=0.35, sigma=1.6):
    return img + amount * (img - cv2.GaussianBlur(img, (0, 0), sigma))


def in_clip(frames, T, above):
    """The clip with the mountain on its horizon, at the film's size."""
    pyr = pyramid(mountain(1))
    place = placement(1)
    h, w = frames.shape[1:3]
    rng = np.random.default_rng(3)
    for i, frame in enumerate(frames):
        v = frame.astype(np.float32) / 255
        lab = cv2.cvtColor(v, cv2.COLOR_BGR2LAB)
        model, near = sky_of(lab)
        back = np.linalg.inv(T[i])
        rel = cv2.GaussianBlur(warp_layer(pyr, back @ place, (w, h)), (0, 0), 0.6)
        hills = cv2.warpAffine(above, back[:2].astype(np.float32), (w, h), flags=cv2.INTER_LINEAR, borderValue=1)
        a = (rel[..., 3] * hills * near)[..., None]
        out = v * (1 - a) + draw(model, rel, **HAZE) * a
        out += rng.normal(0, 1.2 / 255, out.shape).astype(np.float32) * a     # the clip's noise on it too
        big = cv2.resize(out, SIZE, interpolation=cv2.INTER_LANCZOS4)
        yield np.clip(unsharp(big), 0, 1)


# ---------------------------------------------------------------- part 2 ----

def grill(last):
    """The bars and the sill (near), and their cover."""
    dark = (last.max(2) < 115).astype(np.uint8)              # the bars are lit greyer against the sky
    rows = cv2.morphologyEx(dark, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (61, 1)))
    cols = cv2.morphologyEx(dark, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (1, 61)))
    near = cv2.dilate(rows | cols, np.ones((3, 3), np.uint8))
    sill = np.zeros_like(near)
    sill[int(last.shape[0] * 0.865):] = 1
    return (near | sill).astype(np.float32)


def smootherstep(x):
    x = np.clip(x, 0, 1)
    return x * x * x * (x * (6 * x - 15) + 10)


def path(t, start, shake):
    """The camera after the clip: zoom (1 = the last frame), centre (last
    frame px), how far the phone has been brought up to the grill (the
    bars' extra magnification) and the point of the grill it heads for."""
    (cx, cy), zoom = END
    lz = np.log(zoom) * smootherstep((t + 0.4) / 10.4) + 0.03 * max(0.0, t - 10.0) / 3
    z = float(np.exp(lz))
    s = smootherstep(t / 10.0)
    free = np.array(start) + (np.array([cx, cy]) - start) * s
    # Stay inside the last frame, easing into its edges rather than
    # stopping at them.
    room = np.array([239.0, 425.0]) * (1 - 1 / z)
    u = np.abs(free - np.array(start)) / np.maximum(room, 1e-6)
    u = np.where(u < 0.7, u, 0.7 + 0.3 * np.tanh((u - 0.7) / 0.3))
    centre = np.array(start) + np.sign(free - np.array(start)) * u * room
    jx, jy = shake
    centre = centre + np.array([jx(t), jy(t)]) * np.sqrt(z) / z * np.minimum(1.0, room / 3 + 0.2)
    g = 1 + 4 * smootherstep((t - 0.8) / 7.7)
    return z, centre, g


def make_shake(rng, rms, seconds):
    """A smooth random hand tremor (frame px), like the clip's own."""
    n = int(seconds * FPS) + 60
    raw = rng.normal(0, 1, n)
    spec = np.fft.rfft(raw)
    f = np.fft.rfftfreq(n, 1 / FPS)
    spec *= np.exp(-0.5 * (f / 1.6) ** 2) * (f > 0.15)
    x = np.fft.irfft(spec, n)
    x *= rms / (x.std() + 1e-9)
    return lambda t: float(np.interp(t * FPS, np.arange(n), x))


def after_clip(frames, above, seconds):
    """The zoom carried on from the last frame to the peak."""
    last = frames[-1]
    h, w = last.shape[:2]
    W, H = SIZE
    near = grill(last)
    hole = cv2.dilate(near, np.ones((11, 11), np.uint8)) > 0
    # The window frame on the right runs down the frame's edge, with
    # nothing beyond it for LaMa to go on; mirror the view beside it there.
    cols = np.nonzero(near[: int(h * 0.8)].mean(0) > 0.5)[0]
    edge = cols[cols > w * 0.8].min() - 6                     # clear of its soft edge
    plate, hole = last.copy(), hole.copy()
    plate[:, edge:] = last[:, 2 * edge - w:edge][:, ::-1]
    hole[:, edge:] = hole[:, 2 * edge - w:edge][:, ::-1]
    view = Lama().fill(plate, hole)
    # The view enlarged 4x with Real-ESRGAN, for the trees the zoom passes;
    # the plain enlargement is kept for the first moments, to match the clip.
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    fine = sr.upscale_tiled(sess, view).astype(np.float32) / 255
    view = view.astype(np.float32) / 255
    lab = cv2.cvtColor(view, cv2.COLOR_BGR2LAB)
    model, sky = sky_of(lab)
    smooth_sky = cv2.cvtColor(model.astype(np.float32), cv2.COLOR_LAB2BGR)
    bars = np.dstack([last.astype(np.float32) / 255 * near[..., None], near]).astype(np.float32)
    sky_cover = (sky * above).astype(np.float32)
    pyr = pyramid(mountain(3))
    place = placement(3)
    rng = np.random.default_rng(5)
    shake = (make_shake(rng, 0.63, seconds), make_shake(rng, 1.4, seconds))
    start = (w / 2, h / 2)
    Z0 = W / w
    for j in range(1, int(seconds * FPS) + 1):
        t = j / FPS
        z, c, g = path(t, start, shake)
        Z = Z0 * z
        far = np.array([[Z, 0, W / 2 - Z * c[0]], [0, Z, H / 2 - Z * c[1]], [0, 0, 1]])
        # The view behind the grill: the clip's last frame, its sky smoothed
        # as the zoom would show its blockiness, sharpened as in part 1.
        ws = smootherstep(t / 3)
        plain = cv2.warpAffine(view, far[:2].astype(np.float32), SIZE, flags=cv2.INTER_LANCZOS4,
                               borderMode=cv2.BORDER_REFLECT)
        to_fine = far @ np.array([[0.25, 0, -0.375], [0, 0.25, -0.375], [0, 0, 1]])
        out = cv2.warpAffine(fine, to_fine[:2].astype(np.float32), SIZE, flags=cv2.INTER_CUBIC,
                             borderMode=cv2.BORDER_REFLECT) if ws > 0 else 0
        out = unsharp(plain) * (1 - ws) + out * ws
        m_sky = cv2.warpAffine(np.dstack([smooth_sky, sky]).astype(np.float32), far[:2].astype(np.float32), SIZE,
                               flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        wsky = ws * m_sky[..., 3:]
        out = out * (1 - wsky) + m_sky[..., :3] * wsky
        m_out = cv2.warpAffine(np.dstack([model, sky_cover]).astype(np.float32), far[:2].astype(np.float32), SIZE,
                               flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        rel = warp_layer(pyr, far @ place, SIZE)
        sigma = 1.7 * (1 - smootherstep(t / 5)) + 0.35
        rel = cv2.GaussianBlur(rel, (0, 0), sigma)
        k = smootherstep((t - 3) / 6)                     # the exposure settling on the bright view
        look = {n: HAZE[n] + (CLEAR[n] - HAZE[n]) * k for n in HAZE}
        a = (rel[..., 3] * m_out[..., 3])[..., None]
        out = out * (1 - a) + draw(m_out[..., :3], rel, **look) * a
        # The grill: magnified more than the view as the phone comes up to
        # it, heading for one pane, and out of focus.
        gp = np.array(c) + (np.array(GRILL) - np.array(c)) * smootherstep((t - 0.8) / 7.7)
        Zn = Z * g
        nm = np.array([[Zn, 0, W / 2 - Zn * gp[0]], [0, Zn, H / 2 - Zn * gp[1]]], np.float32)
        b = cv2.warpAffine(bars, nm, SIZE, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        blur = 0.3 + 14 * (g - 1) / 4
        b = cv2.GaussianBlur(b, (0, 0), blur)
        out = out * (1 - b[..., 3:]) + b[..., :3]
        # Exposure and colour as the camera adapts.
        lin = np.clip(out, 0, 1) ** 2.2 * (1 - 0.25 * k)
        out = lin ** (1 / 2.2)
        lab_o = cv2.cvtColor(out.astype(np.float32), cv2.COLOR_BGR2LAB)
        lab_o[..., 1:] *= 1 + 0.35 * k
        out = cv2.cvtColor(lab_o, cv2.COLOR_LAB2BGR)
        out += rng.normal(0, 1.0 / 255, out.shape).astype(np.float32)
        out *= 1 - smootherstep((t - (seconds - 0.6)) / 0.6)
        yield np.clip(out, 0, 1)


# ----------------------------------------------------------------- sound ----

def sound(seconds):
    """The clip's sound, carried on for `seconds` more with crossfaded
    pieces of its own ambience."""
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run([ff, "-loglevel", "error", "-i", str(SOURCE), "-vn", "-ac", "2", "-ar", "44100",
                          "-f", "s16le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
    sr = 44100
    total = len(x) + int(seconds * sr)
    out = np.zeros((total, 2), np.float32)
    out[:len(x)] = x
    rng = np.random.default_rng(9)
    piece, fade = int(4.0 * sr), int(1.0 * sr)
    ramp = np.sin(np.linspace(0, np.pi / 2, fade)) ** 2
    pos = len(x) - fade
    tail = np.ones(len(x))
    tail[-fade:] = ramp[::-1]
    out[:len(x)] *= tail[:, None]
    while pos < total:
        a = rng.integers(int(1.0 * sr), len(x) - piece)
        seg = x[a:a + piece].copy()
        seg[:fade] *= ramp[:, None]
        seg[-fade:] *= ramp[::-1, None]
        b = min(pos + piece, total)
        out[pos:b] += seg[:b - pos]
        pos += piece - fade
    t = np.arange(total) / sr
    out *= (1 - smootherstep((t - (t[-1] - 1.2)) / 1.2))[:, None]
    return out


def write_wav(path, stereo):
    data = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(44100)
        w.writeframes(data.tobytes())


# ------------------------------------------------------------------ main ----

def main():
    frames = read_clip()
    path_T = CACHE / "track.npy"
    if path_T.exists():
        T = np.load(path_T)
    else:
        T = track(frames)
        CACHE.mkdir(parents=True, exist_ok=True)
        np.save(path_T, T)
    above = horizon(frames[-1])
    wav = CACHE / "sound.wav"
    write_wav(wav, sound(MORE))
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    W, H = SIZE
    proc = subprocess.Popen(
        [ff, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
         "-i", "-", "-i", str(wav), "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", str(OUTPUT)],
        stdin=subprocess.PIPE)
    n = 0
    for part in (in_clip(frames, T, above), after_clip(frames, above, MORE)):
        for f in part:
            proc.stdin.write((f * 255 + 0.5).astype(np.uint8).tobytes())
            n += 1
            if n % 60 == 0:
                print(f"frame {n}", flush=True)
    proc.stdin.close()
    proc.wait()
    print(f"wrote {OUTPUT.name}: {n} frames")


if __name__ == "__main__":
    main()
