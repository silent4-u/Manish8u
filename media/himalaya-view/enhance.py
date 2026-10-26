"""The Himalaya over the foothills: clear the haze from the middle hills,
bring out their forests and ridges, and give the whole view a natural,
cinematic finish, at twice the size (2160 x 3840).

  1. Regions. The sky is the smooth blue connected to the top edge; the
     foreground foliage is the saturated green; the snow is the bright,
     neutral massif. Everything else is hazy distance: the middle hills
     and the forest ridge.
  2. Haze. The haze is estimated with the dark channel prior against the
     airlight (the horizon sky), refined with a guided filter so it follows
     the ridgelines, and then only partly removed: the haze kept is t^0.5
     of the haze there, so far hills are cleared most but still sit
     lighter and bluer than near ones. Aerial perspective, and so the
     depth, survives.
  3. Detail. Real-ESRGAN (realesr-general-x4v3, with its weak-denoise twin
     blended in, from ../sunset/upscale.py) enlarges 4x in tiles and cleans
     the JPEG noise the dehaze has lifted. It is then brought to 2x, and the
     hills' forest texture and ridgelines are sharpened at two scales.
  4. Grade. The snow gets local contrast and a touch of warm morning light
     in its highlights, with cool shadows. The sky deepens towards the top
     like a polariser. The near ridge turns a little greener than the far
     hills. The foreground leaves are calmed and slightly darkened to frame
     the view. Then a gentle filmic curve, a soft vignette and a fine grain.

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/himalaya-view/enhance.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
import upscale as sr  # noqa: E402

SOURCE = HERE / "himalaya-before.jpg"
OUTPUT = HERE / "himalaya-cinematic.jpg"
COMPARE = HERE / "himalaya-before-after.jpg"
KEEP_HAZE = 0.5          # haze kept = t ** KEEP_HAZE; 1 keeps all of it, 0 removes it
NEAR_PEAK = (850, 1010, 1085)   # rows (in the photo) of the two ranges under the snow: full, then fading out
NEAR_PEAK_KEEP = 0.32    # how much less haze those two ranges keep
NEAR_PEAK_GAIN = 4.4     # and their stretch limit
MAX_GAIN = 3.2           # never stretch a hazy pixel more than this


# --------------------------------------------------------------- helpers ----

def box(x, r):
    return cv2.boxFilter(x, -1, (2 * r + 1, 2 * r + 1), borderType=cv2.BORDER_REFLECT)


def guided(I, p, r=24, eps=1e-3):
    """He's guided filter, grey guide: p smoothed so its edges follow I's."""
    mI, mp = box(I, r), box(p, r)
    cov = box(I * p, r) - mI * mp
    var = box(I * I, r) - mI * mI
    a = cov / (var + eps)
    b = mp - a * mI
    return box(a, r) * I + box(b, r)


def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def to_lab(bgr):
    lab = cv2.cvtColor(np.clip(bgr, 0, 1).astype(np.float32), cv2.COLOR_BGR2LAB)
    return lab[..., 0], lab[..., 1], lab[..., 2]


def from_lab(L, A, B):
    return cv2.cvtColor(np.dstack([L, A, B]).astype(np.float32), cv2.COLOR_LAB2BGR)


# --------------------------------------------------------------- regions ----

def regions(img):
    """Soft masks (0..1): sky, foreground foliage, snow, and the hazy distance."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab[..., 0], lab[..., 1] - 128, lab[..., 2] - 128
    g = cv2.GaussianBlur(L, (0, 0), 1.5)
    grad = np.hypot(cv2.Sobel(g, cv2.CV_32F, 1, 0), cv2.Sobel(g, cv2.CV_32F, 0, 1))
    cand = cv2.morphologyEx(((grad < 6) & (B < -22)).astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    _, lab_ = cv2.connectedComponents(cand, connectivity=4)
    sky = np.isin(lab_, list(set(np.unique(lab_[0:3, :])) - {0})).astype(np.uint8)
    sky = cv2.morphologyEx(sky, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    fol = cv2.morphologyEx((((A < -8) & (B > 4)) | (L < 70)).astype(np.uint8), cv2.MORPH_CLOSE,
                           np.ones((7, 7), np.uint8))
    # Snow: bright and near-neutral, in the upper part of the frame, not sky.
    h = img.shape[0]
    rows = np.arange(h, dtype=np.float32)[:, None]
    snow = ((L > 168) & (B > -14) & (A > -6) & (np.hypot(A, B) < 20) & (rows < h * 0.55) & (sky == 0))
    snow = cv2.morphologyEx(snow.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    n, lab_s, st, _ = cv2.connectedComponentsWithStats(snow, 8)
    snow = (lab_s == 1 + np.argmax(st[1:, 4])).astype(np.uint8)       # the massif: the largest bright piece
    snow = cv2.morphologyEx(snow, cv2.MORPH_CLOSE, np.ones((31, 31), np.uint8))
    snow = cv2.dilate(snow, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17))) * (1 - sky)
    # The pale fringe the phone's sharpening left between sky and mountain
    # belongs with the sky.
    near_sky = cv2.dilate(sky, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21))) > 0
    fringe = near_sky & (B < -14) & (sky == 0) & (snow < 0.5)
    sky = (sky | fringe).astype(np.uint8)
    sky_s = cv2.GaussianBlur(sky.astype(np.float32), (0, 0), 1.2)
    fol_s = cv2.GaussianBlur(fol.astype(np.float32), (0, 0), 2.0)
    snow_s = cv2.GaussianBlur(snow.astype(np.float32), (0, 0), 3.0) * (1 - sky_s)
    dist = np.clip(1 - sky_s - snow_s - fol_s, 0, 1)
    # The two ranges just under the snow, the farthest and haziest hills:
    # cleared and sharpened more than the rest.
    top, full, end = NEAR_PEAK
    band = smooth(rows, top - 30, top) * (1 - smooth(rows, full, end))
    band = np.broadcast_to(band, L.shape).astype(np.float32)
    return sky_s, fol_s, snow_s, dist, fol, band


# ------------------------------------------------------------------ haze ----

def dehaze(img, sky, snow, dist, fol, band):
    """Partial, depth-aware haze removal on the distance mask."""
    f = img.astype(np.float32) / 255
    h, w = f.shape[:2]
    # The airlight: the horizon sky just above the mountains.
    band = (sky > 0.9)
    rows = np.nonzero(band.any(1))[0]
    low_sky = band & (np.arange(h)[:, None] > rows.max() - 120)
    A = np.median(f[low_sky], axis=0)
    ratio = (f / A[None, None]).min(2)
    ratio[fol > 0] = 1.0                       # leaves would pull the haze estimate down beside them
    ratio[sky > 0.5] = 1.0
    dark = cv2.erode(ratio, cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15)))
    t = np.clip(1 - 0.97 * dark, 0.05, 1)
    gray = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    t = np.clip(guided(gray, t.astype(np.float32), r=12, eps=1e-3), 0.05, 1)
    gain = np.minimum(t ** (KEEP_HAZE - NEAR_PEAK_KEEP * band - 1), MAX_GAIN + (NEAR_PEAK_GAIN - MAX_GAIN) * band)
    gain = 1 + (gain - 1) * dist
    L, Ac, Bc = to_lab(f)
    LA, AA, BA = (v.ravel()[0] for v in to_lab(A[None, None].astype(np.float32)))
    Ac = Ac * (1 - dist) + cv2.GaussianBlur(Ac, (0, 0), 5.0) * dist      # JPEG colour noise, before it is lifted
    Bc = Bc * (1 - dist) + cv2.GaussianBlur(Bc, (0, 0), 5.0) * dist
    cg = 1 + 0.25 * (gain - 1)
    out = from_lab(np.clip(LA + (L - LA) * gain, 0, 100), AA + (Ac - AA) * cg, BA + (Bc - BA) * cg)
    return np.clip(out, 0, 1), t, A


# --------------------------------------------------------------- detail ----

def enlarge(f, weight):
    """Real-ESRGAN general 4x in tiles, then down to 2x, blended per region
    with a plain Lanczos enlargement: full on the hills, which need it,
    little on leaves the phone had already sharpened, none on the sky."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    img8 = (np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8)
    big = sr.upscale_tiled(sess, img8).astype(np.float32) / 255
    h, w = f.shape[:2]
    gan = cv2.resize(big, (w * 2, h * 2), interpolation=cv2.INTER_AREA)
    plain = cv2.resize(f.astype(np.float32), (w * 2, h * 2), interpolation=cv2.INTER_LANCZOS4)
    wt = cv2.resize(weight.astype(np.float32), (w * 2, h * 2), interpolation=cv2.INTER_LINEAR)[..., None]
    return gan * wt + plain * (1 - wt)


def sharpen(f, amount_fine, amount_mid, amount_broad=0.0):
    """Unsharp on lightness at three scales, amounts given per pixel."""
    L, A, B = to_lab(f)
    fine = L - cv2.GaussianBlur(L, (0, 0), 1.4)
    mid = L - cv2.GaussianBlur(L, (0, 0), 6.0)
    broad = L - cv2.GaussianBlur(L, (0, 0), 22.0)
    fine = np.clip(fine, -6, 6)                        # no halos on the strongest edges
    mid = np.clip(mid, -8, 8)
    broad = np.clip(broad, -10, 10)
    L = L + fine * amount_fine + mid * amount_mid + broad * amount_broad
    return np.clip(from_lab(np.clip(L, 0, 100), A, B), 0, 1)


# ----------------------------------------------------------------- grade ----

def grade(f, sky, fol, snow, dist):
    h, w = f.shape[:2]
    L, A, B = to_lab(f)
    rows = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    # Snow: local contrast in the rock and ridges, warm highlights, cool shadows.
    loc = L - cv2.GaussianBlur(L, (0, 0), 18)
    L = L + 0.55 * loc * snow
    hi = smooth(L, 75, 95) * snow
    B = B + 4.0 * hi
    A = A + 1.0 * hi
    lo = (1 - smooth(L, 60, 85)) * snow
    B = B - 4.0 * lo
    roll = 92 + 8 * np.tanh((L - 92) / 8)              # roll the brightest snow off instead of clipping it
    L = np.where(L > 92, roll, L) * snow + L * (1 - snow)
    # Sky: deeper and richer towards the top, like a polariser.
    deep = sky * (1 - smooth(rows, 0.0, 0.33))
    L = L - 7 * deep
    B = B - 4 * deep
    # Distance: the nearer, lower hills a little greener and richer, the far
    # ones stay blue.
    near = dist * smooth(rows, 0.58, 0.74)
    A = A - 3.5 * near
    B = B + 5.0 * near
    A, B = A * (1 + 0.12 * dist), B * (1 + 0.12 * dist)
    # Foreground leaves: calmer yellow-greens, a touch darker to frame the view.
    B = B - 0.12 * np.maximum(B, 0) * fol
    L = L * (1 - 0.07 * fol)
    out = from_lab(np.clip(L, 0, 100), A, B)
    # Filmic curve.
    x = np.clip(out, 0, 1)
    x = x + 0.06 * x * (1 - x) * (2 * x - 1)
    # Vignette.
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot((xx / w - 0.5) / 0.75, (yy / h - 0.48) / 0.85)
    x = x * (1 - 0.16 * smooth(r, 0.45, 1.05))[..., None]
    # Fine grain, more in the shadows, as film has.
    rng = np.random.default_rng(7)
    grain = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 0.6) * 0.010
    x = x + grain[..., None] * (1.2 - x.mean(2, keepdims=True))
    return np.clip(x, 0, 1)


def side_by_side(before, after, height=1600):
    def fit(im):
        return cv2.resize(im, (int(im.shape[1] * height / im.shape[0]), height), interpolation=cv2.INTER_AREA)
    b, a = fit(before), fit(after)
    out = np.hstack([b, np.full((height, 14, 3), 255, np.uint8), a])
    for x, t in ((24, "BEFORE"), (b.shape[1] + 38, "AFTER")):
        cv2.putText(out, t, (x, 64), cv2.FONT_HERSHEY_DUPLEX, 1.6, (0, 0, 0), 6, cv2.LINE_AA)
        cv2.putText(out, t, (x, 64), cv2.FONT_HERSHEY_DUPLEX, 1.6, (255, 255, 255), 2, cv2.LINE_AA)
    return out


def main(debug=None):
    img = cv2.imread(str(SOURCE))
    sky, fol, snow, dist, fol_hard, band = regions(img)
    clear, t, A = dehaze(img, sky, snow, dist, fol_hard, band)
    print(f"airlight {np.round(A * 255).astype(int)}  haze t in hills {np.median(t[dist > 0.8]):.2f}")
    if debug:
        cv2.imwrite(str(Path(debug) / "dehazed.jpg"), (clear * 255).astype(np.uint8))
    big = enlarge(clear, 0.85 * dist + 0.6 * snow + 0.2 * fol)
    up = lambda m: cv2.resize(m, (big.shape[1], big.shape[0]), interpolation=cv2.INTER_LINEAR)
    sky2, fol2, snow2, dist2, band2 = map(up, (sky, fol, snow, dist, band))
    big = sharpen(big, amount_fine=(0.7 + 0.45 * band2) * dist2 + 0.45 * snow2,
                  amount_mid=(0.25 + 0.9 * band2) * dist2 + 0.15 * snow2,
                  amount_broad=0.6 * band2 * dist2)
    out = grade(big, sky2, fol2, snow2, dist2)
    out8 = (out * 255 + 0.5).astype(np.uint8)
    cv2.imwrite(str(OUTPUT), out8, [cv2.IMWRITE_JPEG_QUALITY, 94])
    cv2.imwrite(str(COMPARE), side_by_side(img, out8), [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"wrote {OUTPUT.name} {out8.shape[1]}x{out8.shape[0]}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
