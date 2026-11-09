"""The rangoli photo, made more attractive and still real.

photo.webp is a phone photo (1848 x 4000) of a powder rangoli on a concrete
floor, taken from above, with the photographer's feet at the bottom. The
rangoli itself is not redrawn: every grain of powder is the photo's own.

  1. Frame. Cut to 4:5 (1800 x 2250), centred on the rangoli, from just
     above the sandals, so the rangoli stands on its own.
  2. Floor. The white flecks of spilled powder, a flake and a stray thread
     on the bare floor are filled in by LaMa (../old-photo/deep_clean.py)
     from the floor round them; the concrete's own grain is left. The concrete's blotches are evened out by about half, so
     it reads as a calm grey ground; its texture stays.
  3. Colour. The photo was a little cool: the white powder was bluish and
     the concrete greenish. A small warm shift makes the white powder clean
     and the floor a neutral grey.
  4. Rangoli. Richer colour: every colour a fifth deeper, the softer ones
     more, and each pixel only as far as it stays a colour a screen can
     show, so the strong yellows and blues keep their grain instead of
     turning into flat blobs. The white powder is left white. A little
     local contrast, so the combed ridges and the grain of the powder stand
     out. The whites are lifted a touch.
  5. Light. A soft vignette darkens the floor towards the corners, so the
     eye goes to the rangoli. A light sharpening on lightness alone.

  rangoli.jpg        the rangoli, 1800 x 2250
  before-after.jpg   the photo and the new one side by side

    pip install numpy opencv-python-headless onnxruntime
    python3 media/rangoli/enhance.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "old-photo"))
from deep_clean import Lama  # noqa: E402

SOURCE = HERE / "photo.webp"
CROP = (48, 677, 1848, 2927)       # x0, y0, x1, y1: 4:5, centred on the rangoli, above the sandals
WARM = (1.5, 3.5)                  # added to Lab a and b
EVEN = 0.5                         # how much of the floor's blotchiness is evened out
SATURATION = 0.2                   # every colour of the rangoli this much deeper
VIBRANCE = 0.4                     # and the softer colours up to this much more
CLARITY = 0.35
VIGNETTE = 0.2


def to_lab(bgr):
    return cv2.split(cv2.cvtColor(bgr.astype(np.float32) / 255, cv2.COLOR_BGR2LAB))


def from_lab(L, A, B):
    out = cv2.cvtColor(np.dstack([L, A, B]).astype(np.float32), cv2.COLOR_LAB2BGR)
    return np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8)


def rangoli_mask(bgr):
    """The rangoli: coloured or white powder, the largest such shape, holes
    filled. The floor is a low-chroma, mid grey."""
    L, A, B = to_lab(bgr)
    art = ((np.hypot(A, B) > 18) | (L > 78)).astype(np.uint8)
    art = cv2.morphologyEx(art, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
    n, lab, st, _ = cv2.connectedComponentsWithStats(art)
    art = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    h, w = art.shape
    flood = art.copy()
    cv2.floodFill(flood, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 1)
    return (art | (1 - flood)) > 0


def clean_floor(bgr, art, lama):
    """Bright flecks and a stray thread on the bare floor, filled in from
    the floor. The concrete's own grain (specks under 20 px) is left."""
    L = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)[..., 0]
    lift = L.astype(np.int16) - cv2.medianBlur(L, 41).astype(np.int16)
    floor = ~cv2.dilate(art.astype(np.uint8), np.ones((25, 25), np.uint8)).astype(bool)
    # The bright cores of flecks, then grown out into their fainter edges.
    n, lab, st, _ = cv2.connectedComponentsWithStats(((lift > 40) & floor).astype(np.uint8))
    cores = np.isin(lab, [i for i in range(1, n) if 20 <= st[i, cv2.CC_STAT_AREA] < 3000])
    n, lab, st, _ = cv2.connectedComponentsWithStats(((lift > 15) & floor).astype(np.uint8))
    keep = [i for i in np.unique(lab[cores]) if i and st[i, cv2.CC_STAT_AREA] < 8000]
    flecks = np.isin(lab, keep) | cores
    flecks = cv2.dilate(flecks.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))) > 0
    print(f"floor flecks: {flecks.sum()} px filled")
    return lama.fill(bgr, flecks) if flecks.any() else bgr


# Linear sRGB from CIE XYZ (D65), to tell which Lab colours a screen can show.
XYZ_TO_RGB = np.array([[3.2404542, -1.5371385, -0.4985314],
                       [-0.9692660, 1.8760108, 0.0415560],
                       [0.0556434, -0.2040259, 1.0572252]], np.float32)


def in_gamut(L, A, B, eps=0.002):
    fy = (L + 16) / 116
    finv = lambda t: np.where(t > 6 / 29, t ** 3, 3 * (6 / 29) ** 2 * (t - 4 / 29))
    xyz = np.stack([0.950456 * finv(fy + A / 500), finv(fy), 1.088754 * finv(fy - B / 200)], -1)
    rgb = xyz @ XYZ_TO_RGB.T
    return np.all((rgb >= -eps) & (rgb <= 1 + eps), -1)


def richer(L, A, B, k):
    """Chroma scaled by k, each pixel only as far as it stays inside sRGB
    (found by halving), so saturated powder keeps its grain."""
    lo, hi = np.ones_like(k), k.copy()
    for _ in range(7):
        mid = (lo + hi) / 2
        good = in_gamut(L, A * mid, B * mid)
        lo, hi = np.where(good, mid, lo), np.where(good, hi, mid)
    s = np.where(in_gamut(L, A * k, B * k), k, lo)
    return A * s, B * s


def enhance(bgr, art):
    L, A, B = to_lab(bgr)
    h, w = L.shape
    soft_art = cv2.GaussianBlur(art.astype(np.float32), (0, 0), 6)
    floor = 1 - soft_art
    # Colour: a small warm shift.
    A, B = A + WARM[0], B + WARM[1]
    # Floor: its blotches evened out, measured on the floor alone.
    f = (~art).astype(np.float32)
    ill = cv2.GaussianBlur(L * f, (0, 0), 60) / np.maximum(cv2.GaussianBlur(f, (0, 0), 60), 1e-3)
    L = L - EVEN * floor * (ill - np.median(L[~art]))
    # Rangoli: local contrast; whites lifted; richer colour, the white powder kept white.
    base = cv2.bilateralFilter(L.astype(np.float32), 0, 8, 5)
    L = L + CLARITY * soft_art * (L - base)
    L = L + soft_art * 0.25 * np.clip(L - 75, 0, None) * (1 - np.clip((L - 75) / 30, 0, 1))
    C = np.hypot(A, B)
    coloured = np.clip((C - 4) / 10, 0, 1)
    k = 1 + soft_art * coloured * (SATURATION + VIBRANCE * (1 - np.clip(C / 80, 0, 1)))
    A, B = richer(L, A, B, k)
    # Light: a soft vignette on the floor, round the rangoli's centre.
    ys, xs = np.nonzero(art)
    cy, cx = ys.mean(), xs.mean()
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot((xx - cx) / w, (yy - cy) / h) / 0.5
    t = np.clip((r - 0.55) / 0.6, 0, 1)
    L = L * (1 - VIGNETTE * (t * t * (3 - 2 * t)) * (0.4 + 0.6 * floor))
    # A light sharpening on lightness alone.
    L = L + 0.25 * (L - cv2.GaussianBlur(L, (0, 0), 1.2))
    return from_lab(np.clip(L, 0, 100), A, B)


def side_by_side(before, after, height=1600, gap=24):
    fit = lambda x: cv2.resize(x, (round(x.shape[1] * height / x.shape[0]), height), interpolation=cv2.INTER_AREA)
    return np.hstack([fit(before), np.full((height, gap, 3), 255, np.uint8), fit(after)])


def main():
    img = cv2.imread(str(SOURCE))
    x0, y0, x1, y1 = CROP
    page = img[y0:y1, x0:x1]
    art = rangoli_mask(page)
    page = clean_floor(page, art, Lama())
    out = enhance(page, art)
    cv2.imwrite(str(HERE / "rangoli.jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 95])
    cv2.imwrite(str(HERE / "before-after.jpg"), side_by_side(img, out), [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"wrote rangoli.jpg ({out.shape[1]} x {out.shape[0]}) and before-after.jpg")


if __name__ == "__main__":
    main()
