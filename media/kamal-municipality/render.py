"""Render "Monumental Horizon", a 10-second cinematic shot of the Kamal Rural
Municipality office, from the single still photo beside this script.

There is no footage and no depth map, so the drone move is a virtual camera
over the photo: a spline-driven crop that pushes in low, cranes up to the
portico and flag, then drifts back to the full facade. Life is added on top:
the flag ripples, the tree sways, out-of-focus foliage slides past the lens in
the opening, and an anamorphic flare sweeps the roofline at the end. The
soundtrack (wind, birdsong, strings, brass/cello rise, piano) is synthesised
here too, so the whole piece is reproducible from this file and the photo.

    pip install numpy pillow imageio-ffmpeg
    python3 media/kamal-municipality/render.py
"""

import subprocess
import wave
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "source.jpg"
OUTPUT = HERE / "monumental-horizon.mp4"
AUDIO = HERE / "monumental-horizon.wav"

W, H = 1920, 1080
FPS = 24
DURATION = 10.0
FRAMES = int(FPS * DURATION)
LETTERBOX = 2.0  # widescreen frame inside the 16:9 container; wider cuts the flag off the final wide
SR = 48000

rng = np.random.default_rng(2083)


# ---------------------------------------------------------------- camera ----

# (time, centre x, centre y, crop width) with x, y, width as fractions of the
# photo's width/height. Crop height follows from the 16:9 output.
KEYS = [
    (0.0, 0.330, 0.745, 0.560),  # low, behind the tree, courtyard and ground floor
    (3.0, 0.415, 0.650, 0.500),  # pushed forward, tilting up past the canopy
    (5.0, 0.455, 0.520, 0.500),  # pedestal up: portico pillars and signboard
    (6.8, 0.465, 0.445, 0.540),  # crane top: flag against the sky
    (10.0, 0.500, 0.600, 1.000),  # drift back to the full symmetric facade
]


def _hermite(t):
    """Catmull-Rom through KEYS, so the move never stops between beats."""
    ts = [k[0] for k in KEYS]
    vals = np.array([k[1:] for k in KEYS])
    i = max(0, min(len(ts) - 2, np.searchsorted(ts, t, side="right") - 1))
    t0, t1 = ts[i], ts[i + 1]
    p0, p1 = vals[i], vals[i + 1]

    def slope(j):
        if j == 0 or j == len(ts) - 1:
            return np.zeros(3)  # ease in at the start, settle at the end
        return (vals[j + 1] - vals[j - 1]) / (ts[j + 1] - ts[j - 1])

    m0, m1 = slope(i) * (t1 - t0), slope(i + 1) * (t1 - t0)
    u = (t - t0) / (t1 - t0)
    h00 = 2 * u**3 - 3 * u**2 + 1
    h10 = u**3 - 2 * u**2 + u
    h01 = -2 * u**3 + 3 * u**2
    h11 = u**3 - u**2
    return h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1


def camera(t, sw, sh):
    """Crop box (left, top, right, bottom) in source pixels at time t."""
    cx, cy, cw = _hermite(t)
    # A little handheld-free "gimbal float": very slow, sub-percent drift.
    cx += 0.0025 * np.sin(t * 0.9)
    cy += 0.0020 * np.sin(t * 0.7 + 1.3)
    w = min(cw * sw, sw)
    h = w * H / W
    x = np.clip(cx * sw, w / 2, sw - w / 2)
    y = np.clip(cy * sh, h / 2, sh - h / 2)
    return x - w / 2, y - h / 2, x + w / 2, y + h / 2


# ------------------------------------------------------------ living photo ----

def bilinear(img, xs, ys):
    """Sample img (h, w, c float) at float coordinates."""
    h, w = img.shape[:2]
    xs = np.clip(xs, 0, w - 1.001)
    ys = np.clip(ys, 0, h - 1.001)
    x0, y0 = xs.astype(int), ys.astype(int)
    fx, fy = (xs - x0)[..., None], (ys - y0)[..., None]
    a = img[y0, x0]
    b = img[y0, x0 + 1]
    c = img[y0 + 1, x0]
    d = img[y0 + 1, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


class LivingPhoto:
    def __init__(self, img):
        self.base = img
        sh, sw = img.shape[:2]
        s = sw / 2000.0  # the regions below were measured on a 2000px-wide copy

        # Flag: pole on the right, cloth hanging left of it.
        self.flag_box = tuple(int(v * s) for v in (880, 460, 975, 610))
        fx0, fy0, fx1, fy1 = self.flag_box
        patch = img[fy0:fy1, fx0:fx1]
        red = (patch[..., 0] > 0.35) & (patch[..., 0] > patch[..., 1] * 1.6)
        m = Image.fromarray((red * 255).astype(np.uint8))
        m = m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(3))
        self.flag_mask = np.asarray(m, np.float32) / 255.0
        self.pole_x = 955 * s - fx0

        # Tree crown over the sky, top-left. Sway fades out towards the
        # building so its straight lines never wobble.
        self.tree_box = (0, 0, int(760 * s), int(620 * s))
        tx1, ty1 = self.tree_box[2], self.tree_box[3]
        yy, xx = np.mgrid[0:ty1, 0:tx1].astype(np.float32)
        fade_x = np.clip((tx1 - xx) / (0.35 * tx1), 0, 1)
        fade_y = np.clip((ty1 - yy) / (0.45 * ty1), 0, 1)
        self.tree_weight = fade_x * fade_y
        self.tree_grid = (xx, yy)

    def frame(self, t):
        img = self.base.copy()

        fx0, fy0, fx1, fy1 = self.flag_box
        ph, pw = fy1 - fy0, fx1 - fx0
        yy, xx = np.mgrid[0:ph, 0:pw].astype(np.float32)
        reach = np.clip((self.pole_x - xx) / 45.0, 0, 1)  # still at the pole
        phase = (self.pole_x - xx) * 0.16 - t * 7.0 + yy * 0.03
        dy = 3.2 * reach * np.sin(phase)
        dx = 1.6 * reach * np.sin(phase * 0.7 + 1.1)
        m = self.flag_mask[..., None]
        waved = bilinear(self.base[fy0:fy1, fx0:fx1], xx + dx, yy + dy)
        # The shading of a real ripple: folds darken and catch light.
        shade = 1.0 + 0.10 * reach * np.cos(phase)
        img[fy0:fy1, fx0:fx1] = waved * shade[..., None] * m + img[fy0:fy1, fx0:fx1] * (1 - m)

        xx, yy = self.tree_grid
        wt = self.tree_weight
        gust = 0.6 + 0.4 * np.sin(t * 0.8)
        sx = gust * wt * (2.4 * np.sin(t * 1.7 + yy * 0.012) + 1.0 * np.sin(t * 3.1 + xx * 0.02))
        sy = gust * wt * 1.2 * np.sin(t * 2.3 + xx * 0.015)
        tx1, ty1 = self.tree_box[2], self.tree_box[3]
        img[0:ty1, 0:tx1] = bilinear(self.base[0:ty1, 0:tx1], xx + sx, yy + sy)
        return img


# --------------------------------------------------------- foreground leaves ----

def make_foliage():
    """Out-of-focus leaves, rendered once and slid past the lens in shot 1."""
    fw, fh = int(W * 1.8), int(H * 1.4)
    layer = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(170):
        # Clustered along the left edge and the top, like an overhanging bough.
        if rng.random() < 0.6:
            x = rng.normal(0.18, 0.12) * fw
            y = rng.uniform(0.0, 1.0) * fh
        else:
            x = rng.uniform(0.0, 0.85) * fw
            y = rng.normal(0.08, 0.08) * fh
        r = rng.uniform(40, 120)
        ang = rng.uniform(0, np.pi)
        pts = []
        for a in np.linspace(0, 2 * np.pi, 24, endpoint=False):
            # Leaf outline: a pointed ellipse.
            rr = r * (1 - 0.35 * abs(np.cos(a)) ** 3)
            px = rr * np.cos(a)
            py = 0.45 * rr * np.sin(a)
            pts.append(
                (x + px * np.cos(ang) - py * np.sin(ang), y + px * np.sin(ang) + py * np.cos(ang))
            )
        g = rng.uniform(0.35, 0.75)
        col = (int(28 * g), int(70 * g + 20), int(26 * g), int(rng.uniform(190, 250)))
        d.polygon(pts, fill=col)
    layer = layer.filter(ImageFilter.GaussianBlur(28))
    return np.asarray(layer, np.float32) / 255.0


def foliage_overlay(frame, foliage, t):
    """Slide the leaves out to the upper left as the camera pushes through."""
    if t > 3.4:
        return frame
    u = np.clip(t / 3.4, 0, 1)
    ease = u * u * (3 - 2 * u)
    fh, fw = foliage.shape[:2]
    scale = 1.0 + 0.5 * ease  # nearer objects grow faster than the building
    ox = -0.05 * W - ease * 1.05 * W
    oy = -0.05 * H - ease * 0.55 * H
    img = Image.fromarray((foliage * 255).astype(np.uint8))
    img = img.resize((int(fw * scale), int(fh * scale)), Image.BILINEAR)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(img, (int(ox), int(oy)))
    fg = np.asarray(canvas, np.float32) / 255.0
    a = fg[..., 3:4] * (1 - ease**4)
    # Sunlight glinting through gaps: rim the leaf edges with warm light.
    edge = np.clip(fg[..., 3:4] * (1 - fg[..., 3:4]) * 4, 0, 1)
    glint = edge * np.array([1.0, 0.82, 0.5]) * 0.35 * (0.6 + 0.4 * np.sin(t * 5.0))
    return frame * (1 - a) + fg[..., :3] * a + glint * (1 - ease)


# ------------------------------------------------------------------ grade ----

YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = 1 - 0.38 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2) ** 1.3
VIGNETTE = np.clip(VIGNETTE, 0.45, 1)[..., None]
# Warm light falling from the upper right, where the sun sits behind the cloud.
SUNWASH = np.exp(-(((XX - W * 0.95) / (W * 0.8)) ** 2 + ((YY + H * 0.2) / (H * 0.9)) ** 2))[..., None]


def grade(img, t):
    lum = img @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    lum = lum[..., None]
    # Saturation, with extra push on greens and on the red window frames.
    sat = 1.28
    out = lum + (img - lum) * sat
    r, g, b = out[..., 0], out[..., 1], out[..., 2]
    green = np.clip((g - np.maximum(r, b)) * 4, 0, 1)
    red = np.clip((r - np.maximum(g, b)) * 3, 0, 1)
    out[..., 1] += green * 0.06
    out[..., 0] -= green * 0.02
    out[..., 0] += red * 0.05
    out[..., 2] -= red * 0.03

    # Split tone: teal shadows, golden highlights.
    hi = np.clip((lum - 0.45) / 0.5, 0, 1)
    lo = 1 - np.clip(lum / 0.4, 0, 1)
    out += hi * np.array([0.075, 0.035, -0.055]) + lo * np.array([-0.02, 0.012, 0.03])

    # Contrast S-curve.
    out = np.clip(out, 0, 1)
    out = out + 0.22 * out * (1 - out) * (2 * out - 1)

    # Golden hour wash, strongest early (morning sun breaking through).
    warm = 0.16 + 0.06 * np.cos(t / DURATION * np.pi)
    out = out + SUNWASH * warm * np.array([1.0, 0.72, 0.32])

    # Soft atmospheric haze low in the frame during the opening.
    haze = np.clip((YY[..., None] / H - 0.55) * 1.6, 0, 1) * 0.08 * np.clip(1 - t / 5, 0, 1)
    out = out * (1 - haze) + haze * np.array([0.95, 0.88, 0.78])

    out = out * VIGNETTE
    return out


def flare(img, t, box, sw, sh):
    """Anamorphic flare travelling along the roofline in the final shot."""
    if t < 6.9:
        return img
    u = np.clip((t - 6.9) / 3.1, 0, 1)
    strength = np.sin(np.pi * np.clip(u * 1.1, 0, 1)) ** 1.5
    l, tp, r, b = box
    s = sw / 2000.0
    sx = (400 + 1300 * u) * s  # left to right across the roof
    sy = 545 * s
    px = (sx - l) / (r - l) * W
    py = (sy - tp) / (b - tp) * H

    dx, dy = XX - px, YY - py
    core = np.exp(-(dx**2 + dy**2) / (2 * 55**2))
    streak = np.exp(-(dy**2) / (2 * 5**2)) * np.exp(-np.abs(dx) / (W * 0.45))
    halo = np.exp(-(np.sqrt(dx**2 + dy**2) - 190) ** 2 / (2 * 14**2)) * 0.25
    light = (
        core[..., None] * np.array([1.0, 0.85, 0.6])
        + streak[..., None] * np.array([0.45, 0.65, 1.0]) * 0.9
        + halo[..., None] * np.array([0.6, 0.75, 1.0])
    )
    # Ghosts mirrored through the frame centre.
    for k, rad, col in ((0.55, 60, (0.35, 0.55, 0.9)), (1.25, 35, (0.9, 0.6, 0.3)), (1.7, 90, (0.3, 0.8, 0.6))):
        gx = W / 2 - (px - W / 2) * k
        gy = H / 2 - (py - H / 2) * k
        gd = np.sqrt((XX - gx) ** 2 + (YY - gy) ** 2)
        light += (np.clip(1 - gd / rad, 0, 1) ** 1.5)[..., None] * np.array(col) * 0.12
    light *= strength
    return 1 - (1 - img) * (1 - np.clip(light, 0, 1))  # screen blend


def finish(img, t):
    img = img + rng.normal(0, 0.012, img.shape).astype(np.float32)  # film grain
    bar = int(round((H - W / LETTERBOX) / 2))
    img[:bar] = 0
    img[H - bar:] = 0
    # Fade up from black, and a short dip at the very end.
    fade = min(1.0, t / 0.5) * min(1.0, (DURATION - t) / 0.35)
    return np.clip(img * fade, 0, 1)


# ------------------------------------------------------------------ audio ----

def fft_lowpass(x, cutoff, slope=4):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / cutoff) ** (2 * slope))
    return np.fft.irfft(X, len(x))


def fft_bandpass(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (f > lo) & (f < hi)
    return np.fft.irfft(X, len(x))


def env(t, points):
    ts, vs = zip(*points)
    return np.interp(t, ts, vs)


def voice(t, freq, harmonics, bright, vibrato=0.0, detune=(0.0,)):
    out = np.zeros_like(t)
    for d in detune:
        f = freq * (1 + d) * (1 + vibrato * np.sin(2 * np.pi * 5.2 * t + rng.uniform(0, 6)))
        ph = 2 * np.pi * np.cumsum(f) / SR
        for n in range(1, harmonics + 1):
            out += np.sin(n * ph + rng.uniform(0, 6)) / n**bright
    return out / len(detune)


def note(name):
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "F#": -3, "G": -2, "A": 0, "B": 2}
    return 440.0 * 2 ** ((names[name[:-1]] + 12 * (int(name[-1]) - 4)) / 12)


def render_audio():
    n = int(SR * DURATION)
    t = np.arange(n) / SR
    L = np.zeros(n)
    R = np.zeros(n)

    # Wind through leaves: brown-ish noise with gusts, plus a brighter rustle.
    noise = rng.normal(0, 1, n)
    wind = fft_lowpass(noise, 500, 2)
    gust = 0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * t) * np.sin(2 * np.pi * 0.11 * t + 1)
    rustle = fft_bandpass(rng.normal(0, 1, n), 2500, 9000)
    rustle *= np.clip(fft_lowpass(np.abs(rng.normal(0, 1, n)), 6, 1) * 3 - 1.2, 0, None)
    amb = env(t, [(0, 0), (0.4, 1), (4, 0.9), (7, 0.35), (10, 0.2)])
    wind_l = (wind * gust * 0.6 + rustle * 0.25) * amb
    wind_r = (np.roll(wind, 2400) * gust * 0.6 + np.roll(rustle, 5000) * 0.25) * amb
    L += wind_l * 0.35
    R += wind_r * 0.35

    # Birdsong: short FM chirps, scattered in the first half.
    for start in sorted(rng.uniform(0.3, 6.0, 14)):
        dur = rng.uniform(0.05, 0.14)
        reps = rng.integers(1, 4)
        base = rng.uniform(2800, 4600)
        pan = rng.uniform(0.2, 0.8)
        for k in range(reps):
            s0 = int((start + k * dur * 1.3) * SR)
            m = int(dur * SR)
            if s0 + m >= n:
                continue
            tt = np.arange(m) / SR
            f = base * (1 + 0.35 * tt / dur) + 400 * np.sin(2 * np.pi * 38 * tt)
            ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / dur) ** 2
            g = 0.06 * env(start, [(0, 1), (5, 0.6), (6, 0.3)])
            L[s0:s0 + m] += ch * g * (1 - pan)
            R[s0:s0 + m] += ch * g * pan

    # Strings pad: D - G - A - D, swelling in after the first second.
    chords = [
        (0.8, 4.2, ["D3", "A3", "D4", "F#4"]),
        (3.9, 5.8, ["G2", "D3", "B3", "G4"]),
        (5.5, 8.1, ["A2", "E3", "A3", "E4"]),
        (7.8, 10.0, ["D2", "A2", "D3", "F#3", "A3", "D4"]),
    ]
    strings = np.zeros(n)
    for c0, c1, notes in chords:
        e = env(t, [(c0, 0), (c0 + 0.6, 1), (c1 - 0.3, 1), (c1 + 0.4, 0)])
        for nm in notes:
            strings += voice(t, note(nm), 10, 1.15, vibrato=0.004, detune=(-0.003, 0.0, 0.004)) * e
    strings = fft_lowpass(strings, 2200, 2)
    strings *= env(t, [(0, 0), (1, 0.25), (3.5, 0.5), (6.5, 0.8), (8, 1.0), (9.2, 0.7), (10, 0.0)])
    L += strings * 0.05
    R += np.roll(strings, 300) * 0.05

    # Cello and brass rise through the architectural ascent.
    low = voice(t, note("D2"), 12, 1.0, vibrato=0.005) * env(t, [(3.8, 0), (5.0, 0.6), (5.8, 0.6), (6.0, 0), (10, 0)])
    low += voice(t, note("A1") * 2, 12, 1.0, vibrato=0.005) * env(t, [(5.6, 0), (6.4, 0.9), (7.9, 1.0), (8.2, 0)])
    low += voice(t, note("D2"), 12, 1.0, vibrato=0.005) * env(t, [(7.8, 0), (8.2, 1.0), (9.3, 0.6), (10, 0)])
    brass = voice(t, note("A3"), 16, 0.8) * env(t, [(4.5, 0), (7.5, 1.0), (7.9, 0)])
    brass += voice(t, note("D4"), 16, 0.8) * env(t, [(7.7, 0), (8.1, 1.0), (9.0, 0.4), (10, 0)])
    brass += voice(t, note("F#3"), 16, 0.8) * env(t, [(7.7, 0), (8.1, 0.8), (9.0, 0.3), (10, 0)])
    brass = fft_lowpass(brass, 1600, 2)
    L += low * 0.07 + brass * 0.035
    R += low * 0.07 + np.roll(brass, 500) * 0.035

    # Piano fading out the resolve.
    for i, nm in enumerate(["D5", "F#5", "A5", "D6", "A5"]):
        s0 = int((8.05 + i * 0.32) * SR)
        m = n - s0
        tt = np.arange(m) / SR
        f = note(nm)
        tone = sum(
            np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0004 * k * k) * tt) * np.exp(-tt * (1.8 + k * 0.9)) / k
            for k in range(1, 7)
        )
        tone *= np.clip(tt / 0.004, 0, 1)
        g = 0.09 * (1 - i * 0.12)
        L[s0:] += tone * g * (0.6 if i % 2 else 0.4)
        R[s0:] += tone * g * (0.4 if i % 2 else 0.6)

    # Hall reverb: convolve with decaying noise.
    ir_len = int(SR * 1.9)
    it = np.arange(ir_len) / SR
    for ch in (L, R):
        ir = rng.normal(0, 1, ir_len) * np.exp(-it * 3.4)
        ir[0] = 0
        wet = np.fft.irfft(np.fft.rfft(ch, n + ir_len) * np.fft.rfft(ir, n + ir_len))[:n]
        ch += wet * 0.035

    mix = np.stack([L, R], 1)
    mix *= env(t, [(0, 0), (0.3, 1), (9.2, 1), (10, 0)])[:, None]
    mix /= np.max(np.abs(mix)) / 0.89  # about -1 dBFS peak
    pcm = (mix * 32767).astype(np.int16)
    with wave.open(str(AUDIO), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ----------------------------------------------------------------- render ----

def main():
    print("synthesising soundtrack")
    render_audio()

    src = np.asarray(Image.open(SOURCE).convert("RGB"), np.float32) / 255.0
    sh, sw = src.shape[:2]
    living = LivingPhoto(src)
    foliage = make_foliage()

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", str(AUDIO),
        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
        str(OUTPUT),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for i in range(FRAMES):
        t = i / FPS
        box = camera(t, sw, sh)
        live = living.frame(t)
        pil = Image.fromarray((np.clip(live, 0, 1) * 255).astype(np.uint8))
        view = pil.transform((W, H), Image.EXTENT, box, Image.BICUBIC)
        view = view.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
        img = np.asarray(view, np.float32) / 255.0
        img = foliage_overlay(img, foliage, t)
        img = grade(img, t)
        img = flare(img, t, box, sw, sh)
        img = finish(img, t)
        proc.stdin.write((img * 255 + 0.5).astype(np.uint8).tobytes())
        if i % 24 == 0:
            print(f"frame {i}/{FRAMES}")

    proc.stdin.close()
    proc.wait()
    AUDIO.unlink()
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
