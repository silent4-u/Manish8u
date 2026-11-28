"""From the chair to the window, and on to the Himalaya.

window-before.mp4 is a phone clip zooming from a chair towards the window
grill: trees, roofs, and a hazy horizon with faint hills. This script puts
the snow massif from ../himalaya-view/himalaya-before.jpg on that horizon
and carries the zoom on past the end of the clip, until the peak fills the
frame:

  window-to-himalaya.mp4   1080 x 1920, about 28 s, with the clip's own sound

  1. Tracking. The camera's zoom, drift and shake are measured on the view
     outside only (the bars, curtain and mosquito net are near, and slide
     across it as the phone moves): corners tracked frame to frame, each
     frame lined up again with a recent reference frame so small errors do
     not pile up, and any frame that stands out from the smooth path put
     back on it.
  2. The mountain in the clip. The massif is placed in the last frame's
     sky, its foot behind the faint hills, and moved with the camera into
     every earlier frame. It is drawn only where the clip shows sky, so the
     bars, the leaves and the curtain stay in front of it. The clip's sky
     is washed out nearly white, so it is made the clearer, deeper blue of
     a day the mountain can be seen on, with the faint hills under it. The
     mountain is drawn relative to that sky: sunlit snow brighter than the
     sky, its faces and ridges in blue shadow, the forested ranges under
     it as darker haze, and its foot fading into the haze. It is drawn at
     the film's full size from the photo enlarged 4x with
     RealESRGAN_x4plus, so it is as sharp as the frame allows.
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
    python3 media/window-view/zoom_to_himalaya.py      # about 20 minutes on CPU
"""

import re
import subprocess
import sys
import urllib.request
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
SNOW_LIFT = 8.75             # how much brighter than the sky sunlit snow is
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


def outdoors(frame):
    """Where the clip shows the view outside: coloured, lit trees and roofs.
    Not the bars and the curtain (dark), nor the mosquito net (grey, its
    moire moving with the net): they are near, and as the phone moves they
    slide across the view."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    out = (hsv[..., 1] > 45) & (hsv[..., 2] > 70)
    dark = cv2.dilate((frame.max(2) < 95).astype(np.uint8), np.ones((11, 11), np.uint8)) > 0
    keep = cv2.morphologyEx((out & ~dark).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return keep * 255


def follow(g0, g1, mask):
    """Corners in g0 (within mask) and where they went in g1, kept only if
    tracking them back lands where they started."""
    p0 = cv2.goodFeaturesToTrack(g0, 800, 0.005, 5, mask=mask)
    if p0 is None or len(p0) < 8:
        return None, None
    p1, st, _ = cv2.calcOpticalFlowPyrLK(g0, g1, p0, None, winSize=(25, 25), maxLevel=4)
    pb, st2, _ = cv2.calcOpticalFlowPyrLK(g1, g0, p1, None, winSize=(25, 25), maxLevel=4)
    ok = (st[:, 0] == 1) & (st2[:, 0] == 1) & (np.linalg.norm(pb - p0, axis=2)[:, 0] < 0.5)
    return p0[ok], p1[ok]


def similarity(p0, p1, thr):
    m, inl = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC, ransacReprojThreshold=thr,
                                         maxIters=4000, confidence=0.999)
    return (None, 0) if m is None else (np.vstack([m, [0, 0, 1]]), int(inl.sum()))


def despike(x, floor, k=7):
    """x with single bad estimates replaced: each point is checked against a
    straight line fitted, robustly, to its neighbours (the camera's path is
    smooth; a misjudged frame stands out from it)."""
    n = len(x)
    out = x.copy()
    for i in range(n):
        idx = np.arange(max(0, i - k), min(n, i + k + 1))
        keep = idx != i
        for _ in range(3):
            a = np.vstack([idx[keep] - i, np.ones(keep.sum())]).T
            coef = np.linalg.lstsq(a, x[idx[keep]], rcond=None)[0]
            r = x[idx] - (coef[0] * (idx - i) + coef[1])
            mad = np.median(np.abs(r[keep])) * 1.4826
            keep &= np.abs(r) <= max(3 * mad, np.median(floor[idx]))
            keep[idx == i] = False
        if abs(x[i] - coef[1]) > max(3 * mad, floor[i]):
            out[i] = coef[1]
    return out


def track(frames):
    """For every frame, the similarity taking it onto the last frame, as the
    view outside moves (the mountain is part of that view).

    Frame-to-frame steps alone pile up their small errors over hundreds of
    frames, and the mountain would slide across the trees. So, working back
    from the last frame, each frame is also lined up directly with a recent
    reference frame (a new one whenever the zoom has changed by a quarter),
    and finally any frame that stands out from the smooth path is put back
    on it."""
    n = len(frames)
    h, w = frames.shape[1:3]
    gray = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in frames]
    masks = [outdoors(f) for f in frames]
    steps = []
    for i in range(n - 1):
        a, b = follow(gray[i], gray[i + 1], masks[i])
        m = similarity(a, b, 1.0)[0] if a is not None and len(a) >= 8 else None
        if m is None:
            a, b = follow(gray[i], gray[i + 1], None)
            m = similarity(a, b, 1.0)[0]
        steps.append(m)
    T = [None] * n
    T[-1] = np.eye(3)
    ref = n - 1
    whole = np.ones((h, w), np.uint8)
    for i in range(n - 2, -1, -1):
        g = np.linalg.inv(T[ref]) @ T[i + 1] @ steps[i]          # frame i onto the reference, first guess
        warped = cv2.warpAffine(gray[i], g[:2].astype(np.float32), (w, h))
        inside = cv2.erode(cv2.warpAffine(whole, g[:2].astype(np.float32), (w, h)), np.ones((15, 15), np.uint8))
        a, b = follow(gray[ref], warped, cv2.bitwise_and(masks[ref], masks[ref], mask=inside))
        if a is not None and len(a) >= 20:
            r, good = similarity(a, b, 0.8)
            if r is not None and good >= 15:
                g = np.linalg.inv(r) @ g
        T[i] = T[ref] @ g
        if abs(np.log(np.sqrt(abs(np.linalg.det(g[:2, :2]))))) > 0.22 or i % 45 == 0:
            ref = i
    # Back onto the smooth path: scale, turn, and where the frame's centre lands.
    c0 = np.array([w / 2, h / 2, 1.0])
    s = np.array([np.sqrt(abs(np.linalg.det(t[:2, :2]))) for t in T])
    path = [np.log(s), np.array([np.arctan2(t[1, 0], t[0, 0]) for t in T]),
            np.array([(t @ c0)[0] for t in T]), np.array([(t @ c0)[1] for t in T])]
    floors = [np.full(n, 0.004), np.full(n, 0.002), s, s]           # a frame pixel, in the last frame's
    ls, turn, cx, cy = (despike(p, f) for p, f in zip(path, floors))
    out = []
    for i in range(n):
        k = np.exp(ls[i])
        a, b = k * np.cos(turn[i]), k * np.sin(turn[i])
        out.append(np.array([[a, -b, cx[i] - a * c0[0] + b * c0[1]], [b, a, cy[i] - b * c0[0] - a * c0[1]],
                             [0, 0, 1]]))
    out[-1] = np.eye(3)
    return np.array(out)


# --------------------------------------------------------------- mountain ----

def mountain(scale):
    """The massif, as colour relative to the sky behind it, at `scale` times
    the photo's size (rows CROP): lightness against sunlit snow, colour
    against daylight, and its cover, which thins at the far ends and the
    foot, where it fades into the haze."""
    path = CACHE / f"mountain-{scale}.npy"
    if path.exists():
        return np.load(path)
    img = cv2.imread(str(e.SOURCE))
    sky, fol, snow, dist, fol_hard, band = e.regions(img)
    clear, _, _ = e.dehaze(img, sky, snow, dist, fol_hard, band)      # the ranges' haze partly cleared
    y0, y1 = CROP
    f = clear[y0:y1].astype(np.float32)
    h, w = f.shape[:2]
    size = (w * scale, h * scale)
    if scale > 1:
        # RealESRGAN_x4plus, for the crispest ridges and rock; then the
        # snow's faces given more shape. Its finest detail is sharpened only
        # a little: pushed harder, the photo's JPEG noise turns into a mottle.
        f = cv2.resize(x4plus(f), size, interpolation=cv2.INTER_AREA)
        f = e.sharpen(f, cv2.resize(0.2 * snow[y0:y1], size), cv2.resize(0.45 * snow[y0:y1], size), k=scale / 2)

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
    # Crisper ridges and faces on the snow, as a long lens on a clear day
    # shows them.
    on_snow = up(snow[y0:y1])
    lab[..., 0] += 0.6 * (lab[..., 0] - cv2.GaussianBlur(lab[..., 0], (0, 0), 6 * scale)) * on_snow
    d = lab[..., 0] - SNOW_WHITE
    dL = np.where(d > -20, d, -20 + 0.25 * (d + 20))     # the darkest rock and forest, barely seen
    # Sunlit snow stands brighter than the sky (by SNOW_LIFT at kL = 1);
    # the forested ranges under it are seen as darker haze, not dark ridges.
    dL = on_snow * (dL + SNOW_LIFT) + (1 - on_snow) * 0.3 * dL
    yy = np.arange(h * scale, dtype=np.float32)[:, None] / scale + y0
    xx = np.arange(w * scale, dtype=np.float32)[None, :] / scale
    # Seen through more air, the foot and the far ends fade into the sky.
    fade = (1 - 0.4 * e.smooth(yy, 700, 935)) * (1 - e.smooth(yy, 930, 990)) * \
        e.smooth(xx, 170, 300) * (1 - e.smooth(xx, 960, 1075))
    cover = np.clip((0.4 - sky) / 0.4, 0, 1) * (1 - fol) * e.smooth(yy, 560, 600) * fade
    out = np.dstack([dL, lab[..., 1] - DAYLIGHT[0], lab[..., 2] - DAYLIGHT[1], cover]).astype(np.float32)
    CACHE.mkdir(parents=True, exist_ok=True)
    np.save(path, out)
    return out


def x4plus(f):
    """f (0..1 BGR) enlarged 4x with RealESRGAN_x4plus, in tiles, on the CPU."""
    path = sr.CACHE / sr.X4PLUS[1]
    if not path.exists():
        sr.CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(sr.X4PLUS[0] + sr.X4PLUS[1], path)
    sess = ort.InferenceSession(sr.build_rrdb(sr.load_pth(path)).SerializeToString(),
                                providers=["CPUExecutionProvider"])
    return sr.upscale_tiled(sess, (np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8)).astype(np.float32) / 255


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
    """The faint hills on the last frame's horizon: for each column, the
    row they start at. The massif's foot goes behind them."""
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
    return cv2.GaussianBlur(line.astype(np.float32).reshape(1, -1), (0, 0), 3).ravel()


def above(line, m, shape, lower=0.0, soft=2.0):
    """1 above the horizon's hills (moved `lower` px down, with an edge
    `soft` px wide), 0 below, in a frame whose pixels go onto the last frame
    by the affine m; beyond the last frame's sides the hills carry on
    level."""
    h, w = shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    lx = m[0, 0] * xs + m[0, 1] * ys + m[0, 2]
    ly = m[1, 0] * xs + m[1, 1] * ys + m[1, 2]
    s = np.sqrt(abs(np.linalg.det(m[:2, :2])))
    return np.clip((np.interp(lx, np.arange(len(line)), line) + lower - ly) / (soft * s) + 0.5, 0, 1).astype(np.float32)


def clearer(lab, sky, up):
    """The clip's sky, washed out nearly white, made the clearer, deeper
    blue of a day the mountain can be seen on: the sky and the faint hills
    on the horizon (`up`), not the white walls below them."""
    w = sky * up * e.smooth(lab[..., 0], 72, 82)
    return lab + np.float32(CLEARER) * w[..., None]


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


def draw(model, rel, kL, kc):
    """The mountain's colour, given the sky behind it and the haze; the
    brightest snow rolls off rather than clipping."""
    L = model[..., 0] + kL * rel[..., 0]
    L = np.where(L > 93, 93 + 4 * np.tanh((L - 93) / 4), L)
    lab = np.dstack([L, model[..., 1] + kc * rel[..., 1], model[..., 2] + kc * rel[..., 2]])
    return cv2.cvtColor(lab.astype(np.float32), cv2.COLOR_LAB2BGR)


HAZE = dict(kL=0.95, kc=0.45)                # how the mountain shows through the clip's haze
CLEAR = dict(kL=1.15, kc=0.6)                # and once the exposure has settled on it
DETAIL = 4                                   # the mountain is drawn from the photo enlarged this much
CLEARER = (-7.0, -0.5, -9.0)                 # the sky made a clearer, deeper blue (Lab)
HORIZON = (40.0, 40.0)                       # and the faint hills with it: how far below their tops, how softly


# ---------------------------------------------------------------- part 1 ----

def unsharp(img, amount=0.35, sigma=1.6):
    return img + amount * (img - cv2.GaussianBlur(img, (0, 0), sigma))


def in_clip(frames, T, line):
    """The clip with the mountain on its horizon, at the film's size. The
    clip is enlarged first and the mountain drawn on it at the film's size,
    from the enlarged photo, so it is as sharp as the frame allows."""
    pyr = pyramid(mountain(DETAIL))
    place = placement(DETAIL)
    h, w = frames.shape[1:3]
    W, H = SIZE
    to_film = np.array([[W / w, 0, 0.5 * W / w - 0.5], [0, H / h, 0.5 * H / h - 0.5], [0, 0, 1]])
    rng = np.random.default_rng(3)

    def big(x):
        return cv2.resize(x, SIZE, interpolation=cv2.INTER_LINEAR)

    for i, frame in enumerate(frames):
        lab = cv2.cvtColor(frame.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
        model, near = sky_of(lab)
        up = above(line, T[i], (h, w))
        v = cv2.cvtColor(clearer(lab, near, above(line, T[i], (h, w), *HORIZON)), cv2.COLOR_LAB2BGR)
        out = unsharp(cv2.resize(v, SIZE, interpolation=cv2.INTER_LANCZOS4))
        rel = cv2.GaussianBlur(warp_layer(pyr, to_film @ np.linalg.inv(T[i]) @ place, SIZE), (0, 0), 0.5)
        a = (rel[..., 3] * big(up * near))[..., None]
        out = out * (1 - a) + draw(big(model) + np.float32(CLEARER), rel, **HAZE) * a
        out += rng.normal(0, 1.2 / 255, out.shape).astype(np.float32) * a     # the clip's noise on it too
        yield np.clip(out, 0, 1)


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
    # The hand's shake, steadied by the phone as it zooms, and by the hand
    # as it settles on the mountain.
    steady = 1 - 0.5 * smootherstep(t / 10.0)
    centre = centre + np.array([jx(t), jy(t)]) * steady / z * np.minimum(1.0, room / 3 + 0.2)
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


def after_clip(frames, line, seconds):
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
    fine = unsharp(sr.upscale_tiled(sess, view).astype(np.float32) / 255, 0.4, 2.0)
    view = view.astype(np.float32) / 255
    lab = cv2.cvtColor(view, cv2.COLOR_BGR2LAB)
    model, sky = sky_of(lab)
    up = above(line, np.eye(3), (h, w))
    # The same clearer sky as in the clip, on the view and its enlargement.
    hz = above(line, np.eye(3), (h, w), *HORIZON)
    view = cv2.cvtColor(clearer(lab, sky, hz), cv2.COLOR_LAB2BGR)
    lab_f = cv2.cvtColor(np.clip(fine, 0, 1), cv2.COLOR_BGR2LAB)
    w_f = cv2.resize(sky * hz * e.smooth(lab[..., 0], 72, 82), fine.shape[1::-1], interpolation=cv2.INTER_LINEAR)
    fine = cv2.cvtColor(lab_f + np.float32(CLEARER) * w_f[..., None], cv2.COLOR_LAB2BGR)
    smooth_sky = cv2.cvtColor(clearer(model, np.ones_like(sky), hz), cv2.COLOR_LAB2BGR)
    model = model + np.float32(CLEARER)
    bars = np.dstack([last.astype(np.float32) / 255 * near[..., None], near]).astype(np.float32)
    sky_cover = (sky * up).astype(np.float32)
    pyr = pyramid(mountain(DETAIL))
    place = placement(DETAIL)
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
        rel = cv2.GaussianBlur(warp_layer(pyr, far @ place, SIZE), (0, 0), 0.5)
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
        lin = np.clip(out, 0, 1) ** 2.2 * (1 - 0.15 * k)
        out = lin ** (1 / 2.2)
        lab_o = cv2.cvtColor(out.astype(np.float32), cv2.COLOR_BGR2LAB)
        lab_o[..., 1:] *= 1 + 0.25 * k
        out = cv2.cvtColor(lab_o, cv2.COLOR_LAB2BGR)
        out = unsharp(out, 0.15 * k, 1.2)                 # the phone's own sharpening at full zoom
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
    rate = 44100
    total = len(x) + int(seconds * rate)
    out = np.zeros((total, 2), np.float32)
    out[:len(x)] = x
    rng = np.random.default_rng(9)
    piece, fade = int(4.0 * rate), int(1.0 * rate)
    ramp = np.sin(np.linspace(0, np.pi / 2, fade)) ** 2
    pos = len(x) - fade
    tail = np.ones(len(x))
    tail[-fade:] = ramp[::-1]
    out[:len(x)] *= tail[:, None]
    while pos < total:
        a = rng.integers(int(1.0 * rate), len(x) - piece)
        seg = x[a:a + piece].copy()
        seg[:fade] *= ramp[:, None]
        seg[-fade:] *= ramp[::-1, None]
        b = min(pos + piece, total)
        out[pos:b] += seg[:b - pos]
        pos += piece - fade
    t = np.arange(total) / rate
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
    line = horizon(frames[-1])
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
    for part in (in_clip(frames, T, line), after_clip(frames, line, MORE)):
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
