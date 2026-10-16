"""Render "Above the Himalaya" in 4K (2160 x 3840 portrait, 30 fps, ~23 s).

Built from the original material, not from the 1080p cut:

  window.jpg   the window photo: upscaled 4x with RealESRGAN_x4plus
  flight.mp4   the phone clip (478 x 850, 60 fps): every frame used is
               cleaned (window-dirt spots healed, haze lifted with a
               dark-channel dehaze), upscaled 4x with realesr-general-x4v3,
               stabilised, and slowed with optical-flow in-betweens, so even
               quarter speed stays smooth

Shots: the window photo pushing in; the window and wing; a long passage over
the Himalayan range on a speed ramp that slows to about a quarter speed in the
middle; back to the window and wing to close. Dissolves bloom with light. The
grade lifts the window haze, deepens the blue, warms the sunlit snow and lets
the highlights glow. The score is synthesised over the clip's own cabin hum.

    pip install numpy opencv-python-headless onnx onnxruntime imageio-ffmpeg
    python3 media/flight/render_4k.py              # the film
    python3 media/flight/render_4k.py --preview    # a few graded stills
"""

import subprocess
import sys
import wave
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "kamal-municipality"))
sys.path.insert(0, str(HERE.parent / "sunset"))
import render as synth  # noqa: E402  soundtrack helpers
import upscale as sr  # noqa: E402  Real-ESRGAN on ONNX

PHOTO = HERE / "window.jpg"
CLIP = HERE / "flight.mp4"
OUTPUT = HERE / "above-the-himalaya-4k.mp4"
AUDIO = HERE / "above-the-himalaya-4k.wav"

W, H = 2160, 3840
FPS = 30
SR_SCALE = 4
STEP = 2            # upscale every 2nd 60 fps frame; optical flow fills between
XFADE = 0.9

# (start, length, kind, source start s, speed curve(u) -> speed, tracking roi)
# Speeds are fractions of real time; the clip runs at 60 fps.
SHOTS = [
    dict(start=0.0, length=3.6, kind="photo"),
    dict(start=2.8, length=4.6, kind="video", src=0.25,
         speed=lambda u: 0.45 + 0 * u, roi=(0.0, 0.0, 1.0, 0.62)),
    dict(start=6.6, length=14.0, kind="video", src=10.0,
         speed=lambda u: 0.48 - 0.26 * np.sin(np.pi * u), roi=(0.0, 0.0, 1.0, 1.0)),
    dict(start=19.8, length=3.6, kind="video", src=26.5,
         speed=lambda u: 0.38 + 0 * u, roi=(0.0, 0.08, 0.65, 0.75)),
]
DURATION = max(s["start"] + s["length"] for s in SHOTS)


# ------------------------------------------------------------ source time ----

_trapz = getattr(np, "trapezoid", None) or np.trapz

def source_time(shot, t):
    """Seconds into the clip at timeline time t (the speed curve integrated)."""
    u = np.clip((t - shot["start"]) / shot["length"], 0, 1)
    us = np.linspace(0, u, 64)
    return shot["src"] + shot["length"] * _trapz(shot["speed"](us), us)


# ------------------------------------------------- clean the source frames ----

def _box(x, r):
    return cv2.blur(x, (2 * r + 1, 2 * r + 1))


def _guided(guide, p, r, eps):
    mi, mp = _box(guide, r), _box(p, r)
    a = (_box(guide * p, r) - mi * mp) / (_box(guide * guide, r) - mi * mi + eps)
    b = mp - a * mi
    return _box(a, r) * guide + _box(b, r)


def airlight(bgr):
    """The haze colour: the brightest pixels of the dark channel."""
    i = bgr.astype(np.float32) / 255
    dark = cv2.erode(i.min(2), np.ones((15, 15), np.uint8))
    idx = np.argsort(dark.ravel())[-int(dark.size * 0.002):]
    return i.reshape(-1, 3)[idx].mean(0)


def despot(bgr):
    """Heal the soft dark blobs of dirt on the window, in flat haze only."""
    i = bgr.astype(np.float32)
    lum = i.mean(2)
    d = cv2.GaussianBlur(lum, (0, 0), 16) - cv2.GaussianBlur(lum, (0, 0), 3)
    texture = np.sqrt(cv2.GaussianBlur((lum - cv2.GaussianBlur(lum, (0, 0), 2)) ** 2, (0, 0), 8))
    flat = np.clip(1 - (texture - 1.2) / 1.5, 0, 1)
    m = cv2.GaussianBlur(np.clip((d - 0.6) / 1.2, 0, 1) * flat, (0, 0), 3)[..., None]
    return np.clip(i + d[..., None] * m, 0, 255).astype(np.uint8)


def dehaze(bgr, air, omega=0.55, tmin=0.55, mix=0.75):
    """Dark-channel-prior dehaze (He et al.), guided-filter refined, held back."""
    i = bgr.astype(np.float32) / 255
    t = 1 - omega * cv2.erode((i / air).min(2), np.ones((15, 15), np.uint8))
    t = np.clip(_guided(cv2.cvtColor(i, cv2.COLOR_BGR2GRAY), t, 30, 1e-3), tmin, 1)[..., None]
    j = (i - air) / t + air
    return np.clip((i * (1 - mix) + j * mix) * 255, 0, 255).astype(np.uint8)


# ----------------------------------------------------------------- frames ----

class Clip:
    """Low-res frames, their 4x upscales and flows, cached on demand."""

    def __init__(self, session):
        cap = cv2.VideoCapture(str(CLIP))
        self.fps = cap.get(cv2.CAP_PROP_FPS)
        self.frames = []
        while True:
            ok, f = cap.read()
            if not ok:
                break
            self.frames.append(f)
        self.session = session
        self.sr, self.flow = {}, {}
        # One haze estimate per shot, so the dehaze cannot flicker.
        self.air = []
        for shot in SHOTS:
            if shot["kind"] == "video":
                k = int(shot["src"] * self.fps)
                self.air.append((k, airlight(self.frames[k])))
        self.dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)

    def big(self, k):
        if k not in self.sr:
            for old in [j for j in self.sr if j < k - 2 * STEP]:
                del self.sr[old]
            air = min(self.air, key=lambda ka: abs(ka[0] - k) if ka[0] <= k else 1e9)[1]
            clean = dehaze(despot(self.frames[k]), air)
            self.sr[k] = sr.upscale(self.session, clean).astype(np.float32)
        return self.sr[k]

    def flow_between(self, k):
        if k not in self.flow:
            for old in [j for j in self.flow if j < k - 2 * STEP]:
                del self.flow[old]
            a = cv2.cvtColor(self.frames[k], cv2.COLOR_BGR2GRAY)
            b = cv2.cvtColor(self.frames[k + STEP], cv2.COLOR_BGR2GRAY)
            self.flow[k] = self.dis.calc(a, b, None)
        return self.flow[k]

    def at(self, pos):
        """The upscaled frame at fractional 60 fps position pos."""
        k = int(pos // STEP) * STEP
        k = min(k, len(self.frames) - 1 - STEP)
        f = float(np.clip((pos - k) / STEP, 0, 1))
        a = self.big(k)
        if f < 0.02:
            return a
        b = self.big(k + STEP)
        if f > 0.98:
            return b
        flow = cv2.resize(self.flow_between(k), a.shape[1::-1]) * SR_SCALE
        h, w = a.shape[:2]
        gx, gy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
        wa = cv2.remap(a, gx - f * flow[..., 0], gy - f * flow[..., 1], cv2.INTER_CUBIC,
                       borderMode=cv2.BORDER_REFLECT)
        wb = cv2.remap(b, gx + (1 - f) * flow[..., 0], gy + (1 - f) * flow[..., 1], cv2.INTER_CUBIC,
                       borderMode=cv2.BORDER_REFLECT)
        return wa * (1 - f) + wb * f


def stabilisation(clip, shot):
    """Per-frame correction (dx, dy, angle) at low res for the frames a shot uses."""
    k0 = int(source_time(shot, shot["start"]) * clip.fps) // STEP * STEP
    k1 = min(int(source_time(shot, shot["start"] + shot["length"]) * clip.fps) + 2 * STEP,
             len(clip.frames) - 1)
    ks = list(range(k0, k1 + 1, STEP))
    h, w = clip.frames[0].shape[:2]
    x0, y0, x1, y1 = shot["roi"]
    roi = np.zeros((h, w), np.uint8)
    roi[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 255
    path = [np.zeros(3)]
    prev = cv2.cvtColor(clip.frames[ks[0]], cv2.COLOR_BGR2GRAY)
    for k in ks[1:]:
        g = cv2.cvtColor(clip.frames[k], cv2.COLOR_BGR2GRAY)
        d = np.zeros(3)
        pts = cv2.goodFeaturesToTrack(prev, 400, 0.004, 8, mask=roi)
        if pts is not None and len(pts) > 12:
            nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, pts, None)
            good = st.ravel() == 1
            if good.sum() > 12:
                m, _ = cv2.estimateAffinePartial2D(pts[good], nxt[good])
                if m is not None:
                    d = np.array([m[0, 2], m[1, 2], np.arctan2(m[1, 0], m[0, 0])])
        path.append(path[-1] + d)
        prev = g
    path = np.array(path)
    smooth = np.stack([cv2.GaussianBlur(path[:, i].reshape(-1, 1), (1, 0), 14).ravel()
                       for i in range(3)], 1)
    return np.array(ks), smooth - path


def correction(stab, pos):
    ks, corr = stab
    return np.array([np.interp(pos, ks, corr[:, i]) for i in range(3)])


def frame_matrix(dx, dy, da, zoom, src_w, src_h, scale):
    """SR frame -> output: undo the shake, zoom about the centre, fit to 4K."""
    c, s = np.cos(da), np.sin(da)
    cx, cy = src_w / 2, src_h / 2
    rot = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
    to_c = np.array([[1, 0, -cx], [0, 1, -cy], [0, 0, 1]])
    out = np.array([[scale * zoom, 0, W / 2], [0, scale * zoom, H / 2], [0, 0, 1]])
    shake = np.array([[1, 0, dx * SR_SCALE], [0, 1, dy * SR_SCALE], [0, 0, 1]])
    return (out @ rot @ to_c @ shake)[:2]


# ------------------------------------------------------------------ grade ----

YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = np.clip(1 - 0.22 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2) ** 1.6,
                   0.65, 1)[..., None]
TOPGRAD = (np.clip(1 - YY / (H * 0.40), 0, 1) ** 1.8)[..., None]
SUN = np.exp(-(((XX - W * 1.05) / (W * 0.9)) ** 2 + ((YY - H * 0.10) / (H * 0.30)) ** 2))[..., None]
del YY, XX
CLAHE = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(4, 7))
SMALL = (W // 4, H // 4)


def grade(img, rng, glow_boost=0.0):
    """img: float32 BGR 0..255 at 4K -> float32 0..1."""
    a = img.astype(np.float32) * np.float32(1 / 255.0)
    # Lift the window haze: CLAHE worked out at quarter size, applied as a gain.
    small = cv2.resize(a, SMALL, interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(small, cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    L8 = np.clip(L * 2.55, 0, 255).astype(np.uint8)
    Lc = CLAHE.apply(L8).astype(np.float32) / 2.55
    gain = cv2.GaussianBlur((Lc * 0.5 + L * 0.5 + 1) / (L + 1), (0, 0), 6)
    a = a * cv2.resize(gain, (W, H), interpolation=cv2.INTER_CUBIC)[..., None]
    # Colour: a deeper, cleaner blue; warm light on the snow and the clouds.
    lum = a @ np.array([0.114, 0.587, 0.299], np.float32)
    lum = lum[..., None]
    a = lum + (a - lum) * 1.16
    hi = np.clip((lum - 0.62) / 0.38, 0, 1)
    lo = 1 - np.clip(lum / 0.45, 0, 1)
    a += hi * np.array([-0.035, 0.0, 0.03], np.float32) + lo * np.array([0.03, 0.008, -0.012], np.float32)
    a *= 1 - TOPGRAD * np.array([0.03, 0.12, 0.18], np.float32)  # deep blue overhead
    a = np.clip(a, 0, 1)
    a = a + 0.16 * a * (1 - a) * (2 * a - 1)
    # Glow: highlights bloom softly, more during dissolves.
    small = cv2.resize(a, SMALL, interpolation=cv2.INTER_AREA)
    bright = np.clip(small - 0.70, 0, 1) * (1 / 0.30)
    bloom = cv2.GaussianBlur(bright, (0, 0), 18) * (0.22 + glow_boost)
    bloom = cv2.resize(bloom, (W, H), interpolation=cv2.INTER_LINEAR)
    a = 1 - (1 - a) * (1 - bloom * np.array([0.92, 0.97, 1.0], np.float32))
    a = 1 - (1 - a) * (1 - SUN * np.array([0.05, 0.09, 0.13], np.float32))
    a *= VIGNETTE
    a += rng.standard_normal(a.shape, dtype=np.float32) * 0.0045
    return np.clip(a, 0, 1)


# ------------------------------------------------------------------ shots ----

def photo_frame(img, t, length):
    ph, pw = img.shape[:2]
    u = np.clip(t / length, 0, 1)
    e = u * u * (3 - 2 * u)
    cw = pw * (1.0 - 0.16 * e)
    ch = cw * 16 / 9
    cx = pw * (0.50 + 0.04 * e)
    cy = ph * (0.47 - 0.02 * e)
    x0, y0 = cx - cw / 2, np.clip(cy - ch / 2, 0, ph - ch)
    m = np.float32([[W / cw, 0, -x0 * W / cw], [0, H / ch, -y0 * H / ch]])
    flags = cv2.INTER_AREA if W / cw < 1 else cv2.INTER_LANCZOS4
    return cv2.warpAffine(img, m, (W, H), flags=flags, borderMode=cv2.BORDER_REFLECT)


def video_frame(clip, stab, shot, t):
    pos = source_time(shot, t) * clip.fps
    big = clip.at(pos)
    dx, dy, da = correction(stab, pos)
    u = (t - shot["start"]) / shot["length"]
    zoom = 1.10 + 0.07 * (u * u * (3 - 2 * u))  # stabiliser crop, plus a slow push
    m = frame_matrix(dx, dy, da, zoom, big.shape[1], big.shape[0], W / big.shape[1])
    return cv2.warpAffine(big, m, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)


def compose(t, photo, clip, stabs):
    acc, wsum, glow = None, 0.0, 0.0
    for i, shot in enumerate(SHOTS):
        if not (shot["start"] <= t < shot["start"] + shot["length"]):
            continue
        fade_in = 1.0 if shot["start"] == 0 else np.clip((t - shot["start"]) / XFADE, 0, 1)
        end = shot["start"] + shot["length"]
        fade_out = 1.0 if end >= DURATION else np.clip((end - t) / XFADE, 0, 1)
        w = min(fade_in, fade_out)
        w = w * w * (3 - 2 * w)
        if w <= 0:
            continue
        f = (photo_frame(photo, t - shot["start"], shot["length"]).astype(np.float32)
             if shot["kind"] == "photo" else video_frame(clip, stabs[i], shot, t))
        w = np.float32(w)
        acc = f * w if acc is None else acc + f * w
        wsum += w
        if w < 0.999:
            glow = max(glow, 4 * w * (1 - w))  # peaks mid-dissolve
    return (acc / max(wsum, 1e-6)).astype(np.float32), glow * 0.35


def photo_upscaled():
    """The window photo through RealESRGAN_x4plus, cached beside it."""
    cached = HERE / "window-x4plus.png"
    if cached.exists():
        return cv2.imread(str(cached))
    print("upscaling the window photo (RealESRGAN_x4plus)")
    if not (sr.CACHE / sr.X4PLUS[1]).exists():
        import urllib.request
        urllib.request.urlretrieve(sr.X4PLUS[0] + sr.X4PLUS[1], sr.CACHE / sr.X4PLUS[1])
    heavy = ort.InferenceSession(sr.build_rrdb(sr.load_pth(sr.CACHE / sr.X4PLUS[1])).SerializeToString(),
                                 providers=["CPUExecutionProvider"])
    photo = sr.upscale_tiled(heavy, cv2.imread(str(PHOTO)))
    cv2.imwrite(str(cached), photo)
    return photo


def main():
    preview = "--preview" in sys.argv
    print("loading models")
    light = sr.build(sr.weights())
    session = ort.InferenceSession(light.SerializeToString(), providers=["CPUExecutionProvider"])
    clip = Clip(session)
    stabs = {i: stabilisation(clip, s) for i, s in enumerate(SHOTS) if s["kind"] == "video"}

    photo = photo_upscaled()

    rng = np.random.default_rng(11)
    if preview:
        out_dir = Path(sys.argv[sys.argv.index("--preview") + 1]) if len(sys.argv) > 2 else HERE
        for t in (1.5, 4.5, 7.0, 11.0, 14.5, 19.0, 21.5):
            img, glow = compose(t, photo, clip, stabs)
            g = grade(img, rng, glow)
            cv2.imwrite(str(out_dir / f"preview-{t:05.2f}.jpg"), (g * 255 + 0.5).astype(np.uint8),
                        [cv2.IMWRITE_JPEG_QUALITY, 92])
            print("preview", t, flush=True)
        return

    print("synthesising soundtrack")
    soundtrack()
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    proc = subprocess.Popen([
        ffmpeg, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", str(AUDIO),
        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-maxrate", "32M", "-bufsize", "64M",
        "-profile:v", "high", "-level", "5.2", "-pix_fmt", "yuv420p",
        "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
        "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", str(OUTPUT),
    ], stdin=subprocess.PIPE)
    total = int(round(DURATION * FPS))
    for i in range(total):
        t = i / FPS
        img, glow = compose(t, photo, clip, stabs)
        g = grade(img, rng, glow)
        fade = min(1.0, t / 0.7) * min(1.0, (DURATION - t) / 1.4)
        proc.stdin.write((g * fade * 255 + 0.5).astype(np.uint8).tobytes())
        if i % 15 == 0:
            print(f"frame {i}/{total}", flush=True)
    proc.stdin.close()
    proc.wait()
    AUDIO.unlink()
    print(f"wrote {OUTPUT}")


# ------------------------------------------------------------------ audio ----

def cabin_hum(n, start):
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run([ffmpeg, "-loglevel", "error", "-ss", str(start), "-i", str(CLIP), "-vn",
                          "-ac", "2", "-ar", str(synth.SR), "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float64) / 32768
    reps = int(np.ceil(n / len(a))) + 1
    a = np.concatenate([a if i % 2 == 0 else a[::-1] for i in range(reps)])[:n]
    return np.stack([synth.fft_lowpass(a[:, c], 800, 2) for c in range(2)], 1)


def soundtrack():
    SR = synth.SR
    rng = np.random.default_rng(2207)
    n = int(SR * DURATION)
    t = np.arange(n) / SR
    env, voice, note = synth.env, synth.voice, synth.note
    L, R = np.zeros(n), np.zeros(n)

    # The real engine hum: present at the window, receding over the range.
    hum = cabin_hum(n, 0.25)
    he = env(t, [(0, 0), (0.6, 1), (6.0, 0.9), (8.5, 0.35), (19.0, 0.35), (20.8, 0.8), (DURATION, 0.5)])
    L += hum[:, 0] * he * 0.5
    R += hum[:, 1] * he * 0.5

    # Air rushing in each dissolve.
    for at in (2.8, 6.6, 19.8):
        m = int(1.8 * SR)
        s0 = int((at - 0.4) * SR)
        whoosh = synth.fft_bandpass(rng.normal(0, 1, m), 300, 4000)
        whoosh *= np.sin(np.pi * np.linspace(0, 1, m)) ** 2 * 0.06
        L[s0:s0 + m] += whoosh
        R[s0:s0 + m] += np.roll(whoosh, 1200)

    # Pad: D - Bm - G - A over the range, home to D at the window.
    chords = [
        (0.3, 6.9, ["D3", "A3", "E4", "F#4"]),
        (6.5, 11.4, ["B2", "F#3", "D4", "A4"]),
        (11.0, 15.4, ["G2", "D3", "B3", "F#4"]),
        (15.0, 20.2, ["A2", "E3", "A3", "E4"]),
        (19.8, DURATION, ["D2", "A2", "D3", "F#3", "A3", "E4"]),
    ]
    pad = np.zeros(n)
    for c0, c1, notes in chords:
        e = env(t, [(c0, 0), (c0 + 1.4, 1), (c1 - 0.4, 1), (c1 + 1.0, 0)])
        for nm in notes:
            pad += voice(t, note(nm), 8, 1.35, vibrato=0.003, detune=(-0.004, 0.0, 0.005)) * e
    pad = synth.fft_lowpass(pad, 1700, 2)
    pad *= env(t, [(0, 0), (2.0, 0.5), (7.5, 0.8), (13.5, 1.0), (18.0, 0.85), (DURATION, 0.0)])
    L += pad * 0.042
    R += np.roll(pad, 450) * 0.042

    # Shimmer over the snow, swelling to the slowest moment.
    shimmer = (voice(t, note("A5"), 3, 2.0, vibrato=0.002) + voice(t, note("E6"), 2, 2.0, vibrato=0.002) * 0.6)
    shimmer *= env(t, [(6.8, 0), (10.5, 0.6), (13.7, 1.0), (17.5, 0.5), (20.5, 0)])
    L += shimmer * 0.010
    R += np.roll(shimmer, 1100) * 0.010

    # Piano: a slow line that answers the pictures.
    melody = [(3.2, "F#5"), (4.4, "A5"), (5.7, "E5"), (7.4, "D5"), (8.9, "F#5"), (10.2, "B5"),
              (11.8, "A5"), (13.6, "D6"), (15.6, "A5"), (17.2, "E5"),
              (19.9, "F#5"), (20.8, "A5"), (21.7, "D6")]
    for i, (at, nm) in enumerate(melody):
        s0 = int(at * SR)
        tt = np.arange(n - s0) / SR
        f = note(nm)
        tone = sum(np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0004 * k * k) * tt) * np.exp(-tt * (1.1 + k * 0.8)) / k
                   for k in range(1, 7)) * np.clip(tt / 0.004, 0, 1)
        g = 0.065
        L[s0:] += tone * g * (0.62 if i % 2 else 0.38)
        R[s0:] += tone * g * (0.38 if i % 2 else 0.62)

    ir_len = int(SR * 3.0)
    it = np.arange(ir_len) / SR
    for ch in (L, R):
        ir = rng.normal(0, 1, ir_len) * np.exp(-it * 2.2)
        ir[0] = 0
        ch += np.fft.irfft(np.fft.rfft(ch, n + ir_len) * np.fft.rfft(ir, n + ir_len))[:n] * 0.03

    mix = np.stack([L, R], 1) * env(t, [(0, 0), (0.5, 1), (DURATION - 1.6, 1), (DURATION, 0)])[:, None]
    mix /= np.max(np.abs(mix)) / 0.89
    with wave.open(str(AUDIO), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes((mix * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main()
