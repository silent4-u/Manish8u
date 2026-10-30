"""Render a 15-second drone shot over inauguration-clean.jpg (the tent removed
by remove_tent.py).

The camera is a real one moving through a depth model of the photo, not a
flat zoom, so the two women, the paving and the building separate the way
they would under a drone:

  * the building, trees and sky are one far plane;
  * the ground in front of it comes closer row by row, as a flat ground does;
  * the two women stand near the camera, cut out with GrabCut.

The camera only ever moves forward of where the photo was taken, so nearer
things only grow over farther ones and nothing hidden behind the women is
ever uncovered. Tilt and framing do the rest of the move.

    pip install numpy pillow opencv-python-headless imageio-ffmpeg
    python3 media/kamal-municipality/render_inauguration.py
"""

import subprocess
import wave
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np

import render  # the soundtrack helpers of the first film

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "inauguration-clean.jpg"
OUTPUT = HERE / "inauguration-drone.mp4"
AUDIO = HERE / "inauguration-drone.wav"

W, H = 1920, 1080
FPS = 24
DURATION = 15.0
FRAMES = int(FPS * DURATION)
SR = render.SR

# Depth, in units of the building's distance. Ground depth follows a flat
# plane: z = K / (y - HORIZON), 1.0 at the building's foot (y 1300) and
# about 0.35 at the bottom edge.
BASE_Y, HORIZON, K = 1300.0, 1005.0, 295.0
WOMEN_Z = 0.42
# The drone flies toward this point (between the two women, at chest
# height). With the direction of travel inside the nearest subject, every
# edge of it opens away from that point faster than what is behind it, so
# nothing hidden behind them is ever uncovered.
FLIGHT_TARGET = (1880.0, 1350.0)

# Camera keys: (time, dolly forward, pan x, pan y, zoom) where pan is the
# frame centre as a fraction of the photo and zoom is output px per photo px
# at the start distance.
KEYS = [
    (0.0, 0.000, 0.500, 0.500, 0.585),  # wide: the whole square, flag to paving
    (4.5, 0.070, 0.485, 0.585, 0.700),  # push in, tilting down to the entrance
    (8.0, 0.115, 0.472, 0.600, 0.760),  # close on the two women, portico behind
    (11.0, 0.110, 0.472, 0.235, 0.950),  # crane up to the name, clear of their heads
    (15.0, 0.010, 0.500, 0.500, 0.590),  # drift back to the whole building
]


def smooth_keys(t):
    ts = [k[0] for k in KEYS]
    vals = np.array([k[1:] for k in KEYS])
    i = max(0, min(len(ts) - 2, np.searchsorted(ts, t, side="right") - 1))
    t0, t1 = ts[i], ts[i + 1]

    def slope(j):
        if j == 0 or j == len(ts) - 1:
            return np.zeros(vals.shape[1])
        return (vals[j + 1] - vals[j - 1]) / (ts[j + 1] - ts[j - 1])

    m0, m1 = slope(i) * (t1 - t0), slope(i + 1) * (t1 - t0)
    u = (t - t0) / (t1 - t0)
    return ((2 * u**3 - 3 * u**2 + 1) * vals[i] + (u**3 - 2 * u**2 + u) * m0
            + (-2 * u**3 + 3 * u**2) * vals[i + 1] + (u**3 - u**2) * m1)


def ground_depth(y):
    return np.where(y > BASE_Y, K / np.maximum(y - HORIZON, 1.0), 1.0)


def women_matte(img):
    h, w = img.shape[:2]
    x0, y0, x1, y1 = 1500, 1080, 2260, h
    roi = img[y0:y1, x0:x1]
    mask = np.full(roi.shape[:2], cv2.GC_BGD, np.uint8)
    outline = np.array([
        (1560, 1848), (1545, 1500), (1560, 1380), (1640, 1220), (1690, 1160), (1760, 1150),
        (1830, 1190), (1860, 1260), (1900, 1180), (1945, 1105), (2045, 1100), (2100, 1200),
        (2110, 1330), (2210, 1400), (2225, 1600), (2230, 1848)])
    cv2.fillPoly(mask, [outline - [x0, y0]], cv2.GC_PR_FGD)
    sure = [
        [(1700, 1250), (1800, 1250), (1820, 1848), (1640, 1848), (1620, 1500)],
        [(1960, 1200), (2040, 1200), (2080, 1400), (2150, 1848), (1900, 1848), (1920, 1400)],
        [(1965, 1125), (2030, 1122), (2045, 1180), (1955, 1185)],  # top of her hair
    ]
    for poly in sure:
        cv2.fillPoly(mask, [np.array(poly) - [x0, y0]], cv2.GC_FGD)
    bgm, fgm = np.zeros((1, 65)), np.zeros((1, 65))
    cv2.grabCut(roi, mask, None, bgm, fgm, 6, cv2.GC_INIT_WITH_MASK)
    m = np.isin(mask, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8) * 255
    full = np.zeros((h, w), np.uint8)
    full[y0:y1, x0:x1] = m
    full = cv2.morphologyEx(full, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return cv2.GaussianBlur(full, (0, 0), 1.2).astype(np.float32) / 255.0


# ------------------------------------------------------------------ grade ----

YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = np.clip(1 - 0.30 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2) ** 1.4, 0.55, 1)[..., None]


def grade(img):
    """A restrained, realistic grade: a touch of contrast and warmth."""
    a = img.astype(np.float32) / 255.0
    lum = a @ np.array([0.114, 0.587, 0.299], np.float32)  # BGR
    lum = lum[..., None]
    a = lum + (a - lum) * 1.12
    hi = np.clip((lum - 0.5) / 0.5, 0, 1)
    lo = 1 - np.clip(lum / 0.35, 0, 1)
    a += hi * np.array([-0.025, 0.005, 0.03]) + lo * np.array([0.02, 0.008, -0.01])
    a = np.clip(a, 0, 1)
    a = a + 0.16 * a * (1 - a) * (2 * a - 1)
    a *= VIGNETTE
    a += np.random.default_rng().normal(0, 0.008, a.shape).astype(np.float32)
    return np.clip(a, 0, 1)


# ----------------------------------------------------------------- camera ----

def project_maps(t, sw, sh, depth_fn):
    """Source coordinates for every output pixel, for a scene layer."""
    dz, px, py, zoom = smooth_keys(t)
    # Gentle drone float and a whisper of bank.
    px += 0.0015 * np.sin(t * 0.8)
    py += 0.0012 * np.sin(t * 0.6 + 1.0)
    roll = np.radians(0.35 * np.sin(t * 0.45))
    cx0, cy0 = FLIGHT_TARGET
    # Output pixel -> ray in the moved camera's image plane (photo px units).
    ox, oy = XX - W / 2, YY - H / 2
    rx = (ox * np.cos(roll) - oy * np.sin(roll)) / zoom
    ry = (ox * np.sin(roll) + oy * np.cos(roll)) / zoom
    u = rx + (px * sw - cx0)
    v = ry + (py * sh - cy0)
    # A point at depth z seen by the moved camera at (u, v) projects into
    # the photo at (u, v) * (z - dz) / z. Solve for z by fixed point.
    sx, sy = u + cx0, v + cy0
    for _ in range(4):
        z = depth_fn(sy)
        s = (z - dz) / z
        sx, sy = u * s + cx0, v * s + cy0
    return sx.astype(np.float32), sy.astype(np.float32)


def layers(src):
    """The far layer (building, ground) and the near one (the women)."""
    matte = women_matte(src)
    # Under the women the far layer holds a fill, so their colour never
    # bleeds into it at the matte's soft edge.
    hole = cv2.dilate((matte > 0.05).astype(np.uint8), np.ones((15, 15), np.uint8)) * 255
    fill = cv2.inpaint(src, hole, 7, cv2.INPAINT_TELEA)
    bg = src.copy()
    under = cv2.dilate((matte > 0.5).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    bg[under] = fill[under]
    return bg, np.dstack([src, (matte * 255).astype(np.uint8)])


def compose(bg, women, t):
    sh, sw = bg.shape[:2]
    mx, my = project_maps(t, sw, sh, ground_depth)
    frame = cv2.remap(bg, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    wx, wy = project_maps(t, sw, sh, lambda y: np.full_like(y, WOMEN_Z))
    near = cv2.remap(women, wx, wy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT)
    a = near[..., 3:4].astype(np.float32) / 255.0
    return (frame * (1 - a) + near[..., :3] * a).astype(np.uint8)


def main():
    src = cv2.imread(str(SOURCE))
    sh, sw = src.shape[:2]
    bg, women = layers(src)

    print("synthesising soundtrack")
    soundtrack()

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    proc = subprocess.Popen([
        ffmpeg, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", str(AUDIO),
        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(OUTPUT),
    ], stdin=subprocess.PIPE)

    for i in range(FRAMES):
        t = i / FPS
        img = grade(compose(bg, women, t))
        fade = min(1.0, t / 0.6) * min(1.0, (DURATION - t) / 0.5)
        proc.stdin.write((img * fade * 255 + 0.5).astype(np.uint8).tobytes())
        if i % 48 == 0:
            print(f"frame {i}/{FRAMES}")
    proc.stdin.close()
    proc.wait()
    AUDIO.unlink()
    print(f"wrote {OUTPUT}")


# ------------------------------------------------------------------ audio ----

def soundtrack():
    """Open-air ambience and a warm, unhurried score, 15 s."""
    rng = np.random.default_rng(2082)
    n = int(SR * DURATION)
    t = np.arange(n) / SR
    env, voice, note = render.env, render.voice, render.note
    L, R = np.zeros(n), np.zeros(n)

    # Ambience: light breeze and a few distant birds, the murmur of a crowd.
    breeze = render.fft_lowpass(rng.normal(0, 1, n), 400, 2)
    breeze *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.17 * t)
    murmur = render.fft_bandpass(rng.normal(0, 1, n), 250, 1800)
    murmur *= render.fft_lowpass(np.abs(rng.normal(0, 1, n)), 3, 1) * 2
    amb = env(t, [(0, 0), (0.6, 1), (12, 0.8), (15, 0.3)])
    L += (breeze * 0.25 + murmur * 0.05) * amb
    R += (np.roll(breeze, 3000) * 0.25 + np.roll(murmur, 7000) * 0.05) * amb
    for start in sorted(rng.uniform(0.4, 9.0, 12)):
        dur, base, pan = rng.uniform(0.05, 0.12), rng.uniform(3000, 4800), rng.uniform(0.2, 0.8)
        s0, m = int(start * SR), int(dur * SR)
        tt = np.arange(m) / SR
        f = base * (1 + 0.3 * tt / dur) + 350 * np.sin(2 * np.pi * 36 * tt)
        ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / dur) ** 2 * 0.035
        L[s0:s0 + m] += ch * (1 - pan)
        R[s0:s0 + m] += ch * pan

    # Score: strings on D - Bm - G - A - D, a cello line, piano at the close.
    chords = [
        (0.8, 4.4, ["D3", "A3", "D4", "F#4"]),
        (4.0, 7.4, ["B2", "F#3", "B3", "D4"]),
        (7.0, 9.9, ["G2", "D3", "B3", "G4"]),
        (9.5, 12.2, ["A2", "E3", "A3", "E4"]),
        (11.8, 15.0, ["D2", "A2", "D3", "F#3", "A3", "D4"]),
    ]
    strings = np.zeros(n)
    for c0, c1, notes in chords:
        e = env(t, [(c0, 0), (c0 + 0.8, 1), (c1 - 0.3, 1), (c1 + 0.5, 0)])
        for nm in notes:
            strings += voice(t, note(nm), 10, 1.15, vibrato=0.004, detune=(-0.003, 0.0, 0.004)) * e
    strings = render.fft_lowpass(strings, 2000, 2)
    strings *= env(t, [(0, 0), (1.5, 0.3), (7, 0.6), (11.5, 0.9), (13, 1.0), (15, 0.0)])
    L += strings * 0.05
    R += np.roll(strings, 300) * 0.05

    cello = np.zeros(n)
    for c0, c1, nm in [(4.0, 7.4, "B1"), (7.0, 9.9, "G1"), (9.5, 12.2, "A1"), (11.8, 15.0, "D2")]:
        cello += voice(t, note(nm) * 2, 12, 1.0, vibrato=0.005) * env(t, [(c0, 0), (c0 + 0.7, 1), (c1 - 0.2, 0.9), (c1 + 0.4, 0)])
    L += cello * 0.05
    R += cello * 0.05

    for i, (at, nm) in enumerate([(12.0, "D5"), (12.45, "F#5"), (12.9, "A5"), (13.5, "D6"), (14.1, "A5")]):
        s0 = int(at * SR)
        tt = np.arange(n - s0) / SR
        f = note(nm)
        tone = sum(np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0004 * k * k) * tt) * np.exp(-tt * (1.6 + k * 0.9)) / k
                   for k in range(1, 7)) * np.clip(tt / 0.004, 0, 1)
        g = 0.08 * (1 - i * 0.1)
        L[s0:] += tone * g * (0.6 if i % 2 else 0.4)
        R[s0:] += tone * g * (0.4 if i % 2 else 0.6)

    ir_len = int(SR * 2.0)
    it = np.arange(ir_len) / SR
    for ch in (L, R):
        ir = rng.normal(0, 1, ir_len) * np.exp(-it * 3.2)
        ir[0] = 0
        ch += np.fft.irfft(np.fft.rfft(ch, n + ir_len) * np.fft.rfft(ir, n + ir_len))[:n] * 0.035

    mix = np.stack([L, R], 1) * env(t, [(0, 0), (0.4, 1), (14.2, 1), (15, 0)])[:, None]
    mix /= np.max(np.abs(mix)) / 0.89
    with wave.open(str(AUDIO), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes((mix * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main()
