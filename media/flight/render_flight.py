"""Render a 15-second portrait film from a flight over the Himalaya: the window
photo, then two stretches of the phone video, stabilised, in half-speed slow
motion (the clip is 60 fps, so every source frame is used once), with a gentle
haze-lifting grade, the real cabin hum and a soft synthesised score.

    pip install numpy opencv-python-headless imageio-ffmpeg
    python3 media/flight/render_flight.py [fonts_dir]
"""

import subprocess
import sys
import wave
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "kamal-municipality"))
import render as synth  # noqa: E402  the soundtrack helpers of the first film

HERE = Path(__file__).resolve().parent
PHOTO = HERE / "window.jpg"
CLIP = HERE / "flight.mp4"
OUTPUT = HERE / "above-the-himalaya.mp4"
AUDIO = HERE / "above-the-himalaya.wav"
FONTS = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "fonts"

W, H = 1080, 1920
FPS = 30
DURATION = 15.0
SR = synth.SR
XFADE = 0.8

# Shots: (start on the timeline, length, kind, source start in seconds).
# Video shots play at half speed: 60 fps source frames, one per output frame.
SHOTS = [
    (0.0, 3.6, "photo", None),
    (2.8, 4.8, "video", 0.25),   # window frame, wing, the range on the horizon
    (6.8, 8.2, "video", 9.6),    # the snow peaks above the cloud sea
]
TITLE = ("Above the Himalaya", 9.4, 13.6)  # text, fade in, fade out


# ------------------------------------------------------------ stabilise ----

def read_frames(start, count):
    cap = cv2.VideoCapture(str(CLIP))
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(start * cap.get(cv2.CAP_PROP_FPS))))
    frames = []
    while len(frames) < count:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    while len(frames) < count:  # never run short at the clip's end
        frames.append(frames[-1])
    return frames


def stabilise(frames, zoom=1.10):
    """Smooth out hand shake: track the far scene, low-pass the camera path."""
    h, w = frames[0].shape[:2]
    roi = np.zeros((h, w), np.uint8)
    roi[: int(h * 0.62)] = 255  # the sky and the range, not the window frame
    path = [np.zeros(3)]
    prev = cv2.cvtColor(frames[0], cv2.COLOR_BGR2GRAY)
    for f in frames[1:]:
        g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
        pts = cv2.goodFeaturesToTrack(prev, 300, 0.005, 8, mask=roi)
        d = np.zeros(3)
        if pts is not None and len(pts) > 10:
            nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, pts, None)
            good = st.ravel() == 1
            if good.sum() > 10:
                m, _ = cv2.estimateAffinePartial2D(pts[good], nxt[good])
                if m is not None:
                    d = np.array([m[0, 2], m[1, 2], np.arctan2(m[1, 0], m[0, 0])])
        path.append(path[-1] + d)
        prev = g
    path = np.array(path)
    smooth = np.stack([cv2.GaussianBlur(path[:, i].reshape(-1, 1), (1, 0), 18).ravel()
                       for i in range(3)], 1)
    out = []
    for f, p, s in zip(frames, path, smooth):
        dx, dy, da = s - p
        m = cv2.getRotationMatrix2D((w / 2, h / 2), np.degrees(-da), zoom)
        m[:, 2] += (dx, dy)
        out.append(cv2.warpAffine(f, m, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT))
    return out


# ---------------------------------------------------------------- grade ----

YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = np.clip(1 - 0.28 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2) ** 1.5,
                   0.6, 1)[..., None]
SUN = np.exp(-(((XX - W * 1.0) / (W * 0.9)) ** 2 + ((YY - H * 0.12) / (H * 0.35)) ** 2))[..., None]
CLAHE = cv2.createCLAHE(clipLimit=1.25, tileGridSize=(4, 7))


def upscale(img):
    up = cv2.resize(img, (W, H), interpolation=cv2.INTER_LANCZOS4)
    blur = cv2.GaussianBlur(up, (0, 0), 1.6)
    return cv2.addWeighted(up, 1.3, blur, -0.3, 0)


def grade(img, rng):
    """Lift the window haze, deepen the blue, warm the snow; keep it real."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    lab[..., 0] = cv2.addWeighted(CLAHE.apply(lab[..., 0]), 0.6, lab[..., 0], 0.4, 0)
    a = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR).astype(np.float32) / 255.0
    lum = (a @ np.array([0.114, 0.587, 0.299], np.float32))[..., None]
    a = lum + (a - lum) * 1.12
    hi = np.clip((lum - 0.55) / 0.45, 0, 1)
    lo = 1 - np.clip(lum / 0.4, 0, 1)
    a += hi * np.array([-0.03, 0.0, 0.035]) + lo * np.array([0.03, 0.01, -0.01])  # BGR
    a = np.clip(a, 0, 1)
    a = a + 0.14 * a * (1 - a) * (2 * a - 1)
    a = 1 - (1 - a) * (1 - SUN * np.array([0.10, 0.16, 0.22]))  # soft sun from the right
    a *= VIGNETTE
    a += rng.normal(0, 0.010, a.shape).astype(np.float32)
    return np.clip(a, 0, 1)


# ---------------------------------------------------------------- shots ----

def photo_frames(length):
    """Slow push toward the wing and the horizon."""
    img = cv2.imread(str(PHOTO))
    ph, pw = img.shape[:2]
    n = int(round(length * FPS))
    out = []
    for i in range(n):
        u = i / max(n - 1, 1)
        e = u * u * (3 - 2 * u)
        cw = pw * (1.0 - 0.16 * e)  # crop width, 9:16
        ch = cw * 16 / 9
        cx = pw * (0.50 + 0.04 * e)
        cy = ph * (0.47 - 0.02 * e)
        x0, y0 = cx - cw / 2, np.clip(cy - ch / 2, 0, ph - ch)
        m = np.float32([[W / cw, 0, -x0 * W / cw], [0, H / ch, -y0 * H / ch]])
        f = cv2.warpAffine(img, m, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
        blur = cv2.GaussianBlur(f, (0, 0), 1.6)
        out.append(cv2.addWeighted(f, 1.15, blur, -0.15, 0))
    return out


def video_frames(src_start, length):
    n = int(round(length * FPS))  # one 60 fps source frame per output frame
    frames = stabilise(read_frames(src_start, n))
    out = []
    for i, f in enumerate(frames):
        # A slow drift in, on top of the real motion.
        z = 1.0 + 0.06 * i / max(n - 1, 1)
        h, w = f.shape[:2]
        m = cv2.getRotationMatrix2D((w / 2, h * 0.45), 0, z)
        f = cv2.warpAffine(f, m, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        out.append(upscale(f))
    return out


def title_layer(text):
    try:
        f = ImageFont.truetype(str(FONTS / "CormorantGaramond[wght].ttf"), 58)
        f.set_variation_by_axes([500])
    except OSError:
        f = ImageFont.load_default()
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    # Wide letter spacing, drawn letter by letter so it stays centred.
    text, track = text.upper(), 9
    widths = [d.textlength(c, font=f) for c in text]
    x = W / 2 - (sum(widths) + track * (len(text) - 1)) / 2
    for c, cw in zip(text, widths):
        d.text((x, H * 0.70), c, font=f, fill=(255, 250, 240, 235), anchor="lm")
        x += cw + track
    a = np.asarray(layer, np.float32) / 255.0
    glow = cv2.GaussianBlur(a[..., 3], (0, 0), 10)[..., None]
    return a[..., :3][..., ::-1], a[..., 3:4], glow


def main():
    rng = np.random.default_rng(5)
    print("preparing shots")
    shots = []
    for start, length, kind, src in SHOTS:
        frames = photo_frames(length) if kind == "photo" else video_frames(src, length)
        shots.append((start, length, frames))
    txt_rgb, txt_a, txt_glow = title_layer(TITLE[0])

    print("synthesising soundtrack")
    soundtrack()

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    proc = subprocess.Popen([
        ffmpeg, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", str(AUDIO),
        "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(OUTPUT),
    ], stdin=subprocess.PIPE)

    total = int(DURATION * FPS)
    for i in range(total):
        t = i / FPS
        acc, wsum = np.zeros((H, W, 3), np.float32), 0.0
        for start, length, frames in shots:
            if start <= t < start + length:
                k = min(int((t - start) * FPS), len(frames) - 1)
                fade_in = 1.0 if start == 0 else np.clip((t - start) / XFADE, 0, 1)
                fade_out = 1.0 if start + length >= DURATION else np.clip((start + length - t) / XFADE, 0, 1)
                wgt = min(fade_in, fade_out)
                wgt = wgt * wgt * (3 - 2 * wgt)
                acc += frames[k].astype(np.float32) * wgt
                wsum += wgt
        img = grade(np.clip(acc / max(wsum, 1e-6), 0, 255).astype(np.uint8), rng)
        ta = np.clip(min((t - TITLE[1]) / 1.2, (TITLE[2] - t) / 1.2), 0, 1)
        if ta > 0:
            img = img * (1 - txt_glow * 0.25 * ta)  # a soft shadow behind the words
            img = img * (1 - txt_a * ta) + txt_rgb * txt_a * ta
        fade = min(1.0, t / 0.6) * min(1.0, (DURATION - t) / 1.0)
        proc.stdin.write((np.clip(img * fade, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
        if i % 60 == 0:
            print(f"frame {i}/{total}")
    proc.stdin.close()
    proc.wait()
    AUDIO.unlink()
    print(f"wrote {OUTPUT}")


# ---------------------------------------------------------------- audio ----

def cabin_hum(n):
    """The clip's own engine sound, low-passed so it sits under the music."""
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run([ffmpeg, "-loglevel", "error", "-ss", "0.25", "-i", str(CLIP), "-vn",
                          "-ac", "2", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float64) / 32768
    if len(a) < n:
        a = np.concatenate([a, a[::-1]])[:n] if len(a) * 2 >= n else np.resize(a, (n, 2))
    a = a[:n]
    return np.stack([synth.fft_lowpass(a[:, c], 900, 2) for c in range(2)], 1)


def soundtrack():
    rng = np.random.default_rng(1207)
    n = int(SR * DURATION)
    t = np.arange(n) / SR
    env, voice, note = synth.env, synth.voice, synth.note
    L, R = np.zeros(n), np.zeros(n)

    hum = cabin_hum(n)
    hum_env = env(t, [(0, 0), (0.5, 1), (7.5, 0.8), (9.0, 0.45), (15, 0.3)])
    L += hum[:, 0] * hum_env * 0.55
    R += hum[:, 1] * hum_env * 0.55

    # Airy pad: Dmaj9 colours, slowly opening; a sustained high shimmer.
    chords = [
        (0.2, 5.4, ["D3", "A3", "E4", "F#4"]),
        (5.0, 9.4, ["B2", "F#3", "D4", "A4"]),
        (9.0, 15.0, ["G2", "D3", "A3", "B3", "F#4"]),
    ]
    pad = np.zeros(n)
    for c0, c1, notes in chords:
        e = env(t, [(c0, 0), (c0 + 1.2, 1), (c1 - 0.4, 1), (c1 + 0.8, 0)])
        for nm in notes:
            pad += voice(t, note(nm), 7, 1.4, vibrato=0.003, detune=(-0.004, 0.0, 0.005)) * e
    pad = synth.fft_lowpass(pad, 1600, 2)
    pad *= env(t, [(0, 0), (2.0, 0.6), (8, 0.85), (12, 1.0), (15, 0.0)])
    shimmer = voice(t, note("A5"), 3, 2.0, vibrato=0.002) * env(t, [(7.0, 0), (10, 0.5), (15, 0)])
    L += pad * 0.045 + shimmer * 0.012
    R += np.roll(pad, 400) * 0.045 + np.roll(shimmer, 900) * 0.012

    # Piano: a few slow notes, as the window opens onto the range.
    for i, (at, nm) in enumerate([(3.0, "F#5"), (4.2, "A5"), (5.6, "E5"), (8.0, "D5"),
                                  (9.4, "A5"), (10.6, "B5"), (12.2, "F#5"), (13.4, "D5")]):
        s0 = int(at * SR)
        tt = np.arange(n - s0) / SR
        f = note(nm)
        tone = sum(np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0004 * k * k) * tt) * np.exp(-tt * (1.2 + k * 0.8)) / k
                   for k in range(1, 7)) * np.clip(tt / 0.004, 0, 1)
        g = 0.07
        L[s0:] += tone * g * (0.65 if i % 2 else 0.35)
        R[s0:] += tone * g * (0.35 if i % 2 else 0.65)

    ir_len = int(SR * 2.6)
    it = np.arange(ir_len) / SR
    for ch in (L, R):
        ir = rng.normal(0, 1, ir_len) * np.exp(-it * 2.4)
        ir[0] = 0
        ch += np.fft.irfft(np.fft.rfft(ch, n + ir_len) * np.fft.rfft(ir, n + ir_len))[:n] * 0.03

    mix = np.stack([L, R], 1) * env(t, [(0, 0), (0.4, 1), (13.8, 1), (15, 0)])[:, None]
    mix /= np.max(np.abs(mix)) / 0.89
    with wave.open(str(AUDIO), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes((mix * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    main()
