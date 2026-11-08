"""A festival night: clearer, sharper and warmer, still a real photo.

photo.webp is a phone photo (1848 x 3460) of a courtyard at night: fairy
lights hanging from the eaves, a woman in a blue saree lighting a diya by a
red curtain, a rangoli ringed with diyas, and dark steps in front. The
phone's night mode has smoothed it: fine detail and her face are soft, and
the steps are nearly black.

  0. Clean. A blue lens-flare dot on the dark step, a reflection inside the
     phone's lens, is filled in by LaMa (../old-photo/deep_clean.py) from
     the step round it.
  1. Sharper. Real-ESRGAN (../sunset/upscale.py) enlarges it 4x, blended
     half and half with a plain Lanczos enlargement, then down to 3840 px
     tall. It runs in strips of 346 rows, which map to exactly 384 rows out,
     so the strips meet without a seam.
  2. Her face. It is only about 60 px across in the photo. CodeFormer
     (../old-photo/regenerate_faces.py) redraws it at high fidelity (0.9),
     so her eyes, brows and lips come out clear while the face stays hers.
  3. Light. The shadows are opened up, most in the darkest parts, so the
     steps and the banana plant come out of the black, and the mid-tones
     get a gentle S-curve so it does not go flat. The harsh bulb over the
     curtain is softened. Local contrast brings out the carved vent, the
     pillars and the curtain's pattern.
  4. Colour. A warm shift, for a festive evening rather than the cold
     white of the bulb, with a little more depth in the softer colours.
  5. Glow. Each small light (the fairy-light bulbs, the coiled light
     strings, the diya flames) gets a soft warm glow, as the eye sees them.
     The big bulb gets none.
  6. Finish. A soft vignette, a light sharpening on lightness alone, and a
     fine grain, so it reads as a photo.

  diya-night.jpg     the photo, 2051 x 3840
  before-after.jpg   the photo and the new one side by side

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/diya-night/enhance.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
sys.path.insert(0, str(HERE.parent / "old-photo"))
import regenerate_faces as rf  # noqa: E402
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402
from restore import detect_faces  # noqa: E402

SOURCE = HERE / "photo.webp"
FLARE = (1066, 2731, 22)           # the lens-flare dot: centre and radius, in the photo
STRIP, STRIP_OUT = 346, 384        # input rows per strip, and the rows they become (3460 -> 3840)
CONTEXT = 24                       # rows of context above and below each strip
GAN_SHARE = 0.5                    # Real-ESRGAN's share of the enlargement
WOMAN = (1000, 2000, 1470, 2520)   # where she sits, in the photo (x0, y0, x1, y1)
FACE_FIDELITY = 0.9
SHADOWS = 0.9                      # how far the shadows are opened up
CONTRAST = 0.25                    # the mid-tones' S-curve
WARM = (1.0, 4.0)                  # added to Lab a and b
VIBRANCE = 0.25
CLARITY = 0.35
GLOW = 0.5
VIGNETTE = 0.15


def unflare(bgr):
    """The lens-flare dot filled in from the step round it."""
    x, y, r = FLARE
    hole = np.zeros(bgr.shape[:2], np.uint8)
    cv2.circle(hole, (x, y), r, 1, -1)
    return Lama().fill(bgr, hole > 0)


def enlarge(bgr):
    """Real-ESRGAN 4x blended with Lanczos, strip by strip, each strip of
    STRIP rows taken down to exactly STRIP_OUT rows."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    h, w = bgr.shape[:2]
    out_w = round(w * STRIP_OUT / STRIP)
    strips = []
    for y0 in range(0, h, STRIP):
        y1 = min(y0 + STRIP, h)
        a, b = max(0, y0 - CONTEXT), min(h, y1 + CONTEXT)
        gan = sr.upscale_tiled(sess, bgr[a:b])[4 * (y0 - a):4 * (y1 - a)].astype(np.float32)
        plain = cv2.resize(bgr[a:b], (w * 4, (b - a) * 4), interpolation=cv2.INTER_LANCZOS4)
        plain = plain[4 * (y0 - a):4 * (y1 - a)].astype(np.float32)
        rows = round((y1 - y0) * STRIP_OUT / STRIP)
        strips.append(cv2.resize(GAN_SHARE * gan + (1 - GAN_SHARE) * plain, (out_w, rows), interpolation=cv2.INTER_AREA))
        print(f"  rows {y0}-{y1} done")
    return np.clip(np.vstack(strips), 0, 255).astype(np.uint8)


def restore_face(big, scale):
    """Her face, found in a crop round her and redrawn by CodeFormer."""
    x0, y0, x1, y1 = (int(round(v * scale)) for v in WOMAN)
    crop = big[y0:y1, x0:x1].copy()
    faces = detect_faces(crop, threshold=0.3)
    print(f"faces: {len(faces)}")
    if faces:
        rf.FIDELITY = FACE_FIDELITY
        big[y0:y1, x0:x1] = rf.regenerate_faces(crop, faces, np.ones(2, np.float32), np.zeros(2, np.float32))
    return big


def grade(bgr):
    f = bgr.astype(np.float32) / 255
    lab = cv2.cvtColor(f, cv2.COLOR_BGR2LAB)
    L, A, B = lab[..., 0] / 100, lab[..., 1], lab[..., 2]
    h, w = L.shape
    # Light: the shadows opened up, the brightest highlights eased.
    L = L + SHADOWS * L * (1 - L) ** 3
    L = L + CONTRAST * (L * L * (3 - 2 * L) - L)
    L = np.where(L > 0.88, 0.88 + (L - 0.88) * 0.7, L)
    L = L + CLARITY * (L - cv2.bilateralFilter(L.astype(np.float32), 0, 0.08, 8))
    # Colour: warmer, the softer colours a little deeper.
    A, B = A + WARM[0], B + WARM[1]
    k = 1 + VIBRANCE * (1 - np.clip(np.hypot(A, B) / 70, 0, 1))
    A, B = A * k, B * k
    # Vignette, from the middle of the frame.
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot((xx - w / 2) / w, (yy - h / 2) / h) / 0.5
    t = np.clip((r - 0.6) / 0.6, 0, 1)
    L = L * (1 - VIGNETTE * t * t * (3 - 2 * t))
    out = cv2.cvtColor(np.dstack([np.clip(L, 0, 1) * 100, A, B]).astype(np.float32), cv2.COLOR_LAB2BGR)
    return np.clip(out, 0, 1)


def glow(f, src):
    """A soft warm glow round each small light. `src` is the picture before
    grading, where the lights are found: small, near-white spots."""
    v = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)[..., 2]
    bright = (v > 235).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(bright)
    small = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] < 3000])
    light = f * small[..., None]
    halo = 0.6 * cv2.GaussianBlur(light, (0, 0), 6) + 0.4 * cv2.GaussianBlur(light, (0, 0), 22)
    halo = halo * np.array([0.55, 0.85, 1.0], np.float32)          # warm: BGR
    return 1 - (1 - f) * (1 - np.clip(GLOW * 2.2 * halo, 0, 1))


def finish(f):
    lab = cv2.cvtColor(f.astype(np.float32), cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    L = L + 0.25 * (L - cv2.GaussianBlur(L, (0, 0), 1.2))
    rng = np.random.default_rng(5)
    L = L + cv2.GaussianBlur(rng.standard_normal(L.shape).astype(np.float32), (0, 0), 0.7) * 0.7
    lab[..., 0] = np.clip(L, 0, 100)
    return np.clip(cv2.cvtColor(lab, cv2.COLOR_LAB2BGR) * 255 + 0.5, 0, 255).astype(np.uint8)


def side_by_side(before, after, height=1800, gap=24):
    fit = lambda x: cv2.resize(x, (round(x.shape[1] * height / x.shape[0]), height), interpolation=cv2.INTER_AREA)
    return np.hstack([fit(before), np.full((height, gap, 3), 255, np.uint8), fit(after)])


def main():
    img = cv2.imread(str(SOURCE))
    print("enlarging")
    big = enlarge(unflare(img))
    big = restore_face(big, STRIP_OUT / STRIP)
    out = finish(glow(grade(big), big))
    cv2.imwrite(str(HERE / "diya-night.jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 95])
    cv2.imwrite(str(HERE / "before-after.jpg"), side_by_side(img, out), [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"wrote diya-night.jpg ({out.shape[1]} x {out.shape[0]}) and before-after.jpg")


if __name__ == "__main__":
    main()
