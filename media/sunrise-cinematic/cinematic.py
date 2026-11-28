"""A misty sunrise, sharpened and graded like a film still.

photo.webp is a phone photo (1848 x 4000): an orange sky, the sun rising
red through mist between two trees, two power lines across the top, and a
dark field filling the bottom 40%. A filter had already been put on it:
its darkest tone is a lifted grey (L 54 of 255), so it looks faded.

  0. Clean. A faint red ghost of the sun on the dark field, a reflection
     inside the phone's lens, is filled in by LaMa (../old-photo/deep_clean.py).
  1. Frame. Two frames, each leaving out the empty dark field:
     - portrait 4:5, from just below the power lines, for a feed post;
     - a 2.39:1 movie frame round the sun, set in 4K (3840 x 2160) between
       black bars.
  2. Sharper. Real-ESRGAN (../sunset/upscale.py) enlarges each frame 4x,
     blended half and half with a plain Lanczos enlargement, then takes it
     down to its size. The portrait runs in strips of 231 rows, which map
     to exactly 270 rows out, so the strips meet without a seam.
  3. Grade.
     - The faded grey blacks are set back to near black, and the mid-tones
       get an S-curve, for depth.
     - Split toning: the shadows and the mist go a cool teal, the sky and
       the sun a deeper orange, the classic film palette.
     - A little local contrast, so the leaves and branches against the
       mist come out crisp. It is eased in the darkest parts, so the dark
       leaves do not take on a painted sheen.
  4. Light. A soft warm glow (halation) round the sun and the bright sky
     near it, as film gives a strong light. A vignette, centred a little
     towards the sun.
  5. Finish. A light sharpening on lightness alone, and a film grain,
     which also keeps the smooth sky from banding.

  sunrise-cinematic.jpg       portrait 4:5, 2160 x 2700
  sunrise-cinematic-wide.jpg  2.39:1 in 4K, 3840 x 2160, with black bars
  before-after.jpg            the photo and the two frames side by side

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/sunrise-cinematic/cinematic.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
sys.path.insert(0, str(HERE.parent / "old-photo"))
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402

SOURCE = HERE / "photo.webp"
GAN_SHARE = 0.5
# Frames in the photo (x0, y0, x1, y1), and their sizes out.
PORTRAIT = ((0, 600, 1848, 2910), (2160, 2700), (231, 270))    # strips: 231 rows in -> 270 out
SCOPE = ((0, 1472, 1848, 2245), (3840, 1606), None)
FRAME_4K = (3840, 2160)
SUN = (920, 1820)                  # the sun's centre, in the photo
GHOST = (1086, 2494, 1208, 2590)   # the sun's lens-flare ghost on the dark field (x0, y0, x1, y1)

BLACK = 0.19                       # the lifted black, in Lab L / 100, set back to near black
CONTRAST = 0.2
COOL = (-2.0, -7.0)                # Lab a, b added in the shadows and mist
WARM = (2.0, 5.0)                  # and in the sky and sun
CLARITY = 0.25
HALATION = 0.35
VIGNETTE = 0.25
GRAIN = 1.2


def unghost(bgr):
    """The sun's lens-flare ghost filled in from the dark field round it."""
    x0, y0, x1, y1 = GHOST
    hole = np.zeros(bgr.shape[:2], bool)
    hole[y0:y1, x0:x1] = True
    return Lama().fill(bgr, hole)


def enlarge(bgr, size, strip=None):
    """Real-ESRGAN 4x blended with Lanczos, down to `size`; in strips of
    `strip` = (rows in, rows out) when given."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    h, w = bgr.shape[:2]
    step, step_out = strip or (h, size[1])
    pad = 24
    parts = []
    for y0 in range(0, h, step):
        y1 = min(y0 + step, h)
        a, b = max(0, y0 - pad), min(h, y1 + pad)
        gan = sr.upscale_tiled(sess, bgr[a:b])[4 * (y0 - a):4 * (y1 - a)].astype(np.float32)
        plain = cv2.resize(bgr[a:b], (w * 4, (b - a) * 4), interpolation=cv2.INTER_LANCZOS4)
        plain = plain[4 * (y0 - a):4 * (y1 - a)].astype(np.float32)
        rows = round((y1 - y0) * step_out / step)
        parts.append(cv2.resize(GAN_SHARE * gan + (1 - GAN_SHARE) * plain, (size[0], rows), interpolation=cv2.INTER_AREA))
    return np.clip(np.vstack(parts), 0, 255) / 255


def grade(f, sun):
    """Film grade on float BGR; `sun` is the sun's centre in this frame."""
    lab = cv2.cvtColor(f.astype(np.float32), cv2.COLOR_BGR2LAB)
    L, A, B = lab[..., 0] / 100, lab[..., 1], lab[..., 2]
    h, w = L.shape
    # Blacks back to near black; an S-curve in the mid-tones.
    L = 0.02 + 0.98 * np.clip((L - BLACK) / (1 - BLACK), 0, 1)
    L = L + CONTRAST * (L * L * (3 - 2 * L) - L)
    # Split toning: cool shadows and mist, warm sky and sun.
    cool = np.clip(1 - L / 0.6, 0, 1)
    warm = np.clip((L - 0.45) / 0.55, 0, 1) ** 1.2
    A = A + COOL[0] * cool + WARM[0] * warm
    B = B + COOL[1] * cool + WARM[1] * warm
    # Local contrast: leaves and branches crisp against the mist.
    ease = np.clip(L / 0.35, 0, 1)
    L = L + CLARITY * ease * (L - cv2.bilateralFilter(L.astype(np.float32), 0, 0.08, 6))
    # Vignette, centred a little towards the sun.
    cy, cx = 0.5 * h + 0.3 * (sun[1] - 0.5 * h), 0.5 * w + 0.3 * (sun[0] - 0.5 * w)
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot((xx - cx) / w, (yy - cy) / h) / 0.5
    t = np.clip((r - 0.45) / 0.75, 0, 1)
    L = L * (1 - VIGNETTE * t * t * (3 - 2 * t))
    out = cv2.cvtColor(np.dstack([np.clip(L, 0, 1) * 100, A, B]).astype(np.float32), cv2.COLOR_LAB2BGR)
    return np.clip(out, 0, 1)


def halation(f):
    """A soft warm glow round the brightest light: the sun and the sky near it."""
    lum = cv2.cvtColor(f.astype(np.float32), cv2.COLOR_BGR2GRAY)
    src = f * np.clip((lum - 0.75) / 0.25, 0, 1)[..., None]
    w = f.shape[1]
    glow = 0.6 * cv2.GaussianBlur(src, (0, 0), 0.01 * w) + 0.4 * cv2.GaussianBlur(src, (0, 0), 0.05 * w)
    glow = glow * np.array([0.35, 0.65, 1.0], np.float32)          # warm: BGR
    return 1 - (1 - f) * (1 - np.clip(HALATION * 2 * glow, 0, 1))


def finish(f, seed):
    lab = cv2.cvtColor(f.astype(np.float32), cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    L = L + 0.3 * (L - cv2.GaussianBlur(L, (0, 0), 1.0))
    rng = np.random.default_rng(seed)
    grain = cv2.GaussianBlur(rng.standard_normal(L.shape).astype(np.float32), (0, 0), 0.6)
    L = L + GRAIN * grain * (1.3 - 0.6 * L / 100)                 # a little more in the shadows
    lab[..., 0] = np.clip(L, 0, 100)
    return np.clip(cv2.cvtColor(lab, cv2.COLOR_LAB2BGR) * 255 + 0.5, 0, 255).astype(np.uint8)


def render(img, frame, seed):
    (x0, y0, x1, y1), size, strip = frame
    f = enlarge(img[y0:y1, x0:x1], size, strip)
    k = size[0] / (x1 - x0)
    sun = ((SUN[0] - x0) * k, (SUN[1] - y0) * k)
    return finish(halation(grade(f, sun)), seed)


def side_by_side(images, height=1600, gap=24):
    fit = lambda x: cv2.resize(x, (round(x.shape[1] * height / x.shape[0]), height), interpolation=cv2.INTER_AREA)
    parts = []
    for im in images:
        parts += [fit(im), np.full((height, gap, 3), 255, np.uint8)]
    return np.hstack(parts[:-1])


def main():
    img = unghost(cv2.imread(str(SOURCE)))
    portrait = render(img, PORTRAIT, 7)
    cv2.imwrite(str(HERE / "sunrise-cinematic.jpg"), portrait, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"wrote sunrise-cinematic.jpg ({portrait.shape[1]} x {portrait.shape[0]})")
    scope = render(img, SCOPE, 8)
    bar = (FRAME_4K[1] - scope.shape[0]) // 2
    wide = cv2.copyMakeBorder(scope, bar, FRAME_4K[1] - scope.shape[0] - bar, 0, 0, cv2.BORDER_CONSTANT, value=0)
    cv2.imwrite(str(HERE / "sunrise-cinematic-wide.jpg"), wide, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"wrote sunrise-cinematic-wide.jpg ({wide.shape[1]} x {wide.shape[0]}, picture 2.39:1)")
    cv2.imwrite(str(HERE / "before-after.jpg"), side_by_side([img, portrait, wide]), [cv2.IMWRITE_JPEG_QUALITY, 90])


if __name__ == "__main__":
    main()
