"""Mock-ups of the bedroom made over, from three phone photos.

What each photo gets, the same changes a real makeover would make:

  1. Ceiling, in four finishes:
       paint   the underside of the cement roof sheets painted warm white
               (their ridges still show faintly) and the rafters, battens
               and beams given a polished walnut finish;
       chatai, ply, gypsum
               a false ceiling fixed to the underside of the rafters,
               inclined with the roof, hiding the rafters, battens and
               sheets; the big beams, the fan and the wall plates stay in
               view. Bamboo mat and ply are drawn at the photo's own
               resolution in each roof face's coordinates, their strips or
               grain running down the slope.
     The sheets are found against their own neighbourhood (each pixel
     against the darkest and brightest within 81 px), so sheets in shadow
     still count as sheets.
  2. Clutter out. The saree hammock, the hanging bags and clothes, the box
     and basket, the bundle and the loose wires are removed and the wall
     behind them filled in by LaMa (../old-photo/deep_clean.py).
  3. Curtains. The busy black-and-white print is replaced with plain linen
     in warm sand. The folds are kept: the print is averaged away along
     each fold, so only the folds' own light remains.
  4. Light. A string of warm fairy lights hangs below the main beam, the
     whole room gets a warm evening tone and a soft vignette.
  5. In the main view, the restored photo of the six friends hangs framed
     on the middle wall.

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/room-makeover/makeover.py

Each view is written as <view>-after.jpg (painted), <view>-chatai-after.jpg,
-ply-after.jpg and -gypsum-after.jpg, with before/after pairs, and
<view>-ceilings.jpg compares the three false ceilings.
"""

import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "old-photo"))
from deep_clean import Lama  # noqa: E402

FRIENDS = HERE.parent / "old-photo" / "friends-ai-7x5.jpg"

# Per photo: the ceiling outline, what to remove (polygons and thick lines),
# the curtain outline, and the fairy-light string (start, end, sag in px).
VIEWS = {
    "room-main": {
        "ceiling": [(0, 0), (1280, 0), (1280, 200), (1150, 192), (860, 292), (600, 284), (330, 258), (300, 240),
                    (0, 96)],
        "beams": [[(0, 0), (500, 0), (1280, 110), (1280, 205), (1000, 165), (600, 110), (300, 70), (0, 50)]],
        "clutter": [(0, 140), (1040, 140), (1040, 591), (0, 591)],     # where coloured clutter is looked for
        "remove": [
            [(355, 430), (475, 430), (475, 520), (355, 520)],                     # clothes under the hammock
            [(488, 338), (556, 338), (556, 446), (488, 446)],                     # the bag on the pillar
            [(815, 322), (890, 322), (890, 446), (815, 446)],                     # the red bag
            [(758, 432), (928, 432), (928, 591), (758, 591)],                     # the basket and box
            [(845, 530), (1035, 530), (1035, 591), (845, 591)],                   # the bundle
        ],
        "lines": [((462, 0), (462, 170), 16), ((295, 252), (365, 352), 6), ((452, 390), (520, 268), 6),
                  ((1140, 185), (1160, 210), 8)],
        "curtain": [(0, 150), (60, 170), (130, 205), (205, 240), (258, 262), (255, 591), (0, 591)],
        "fixtures": [[(592, 100), (672, 100), (672, 172), (592, 172)]],       # the ceiling fan
        "lights": ((80, 70), (1240, 214), 80),
        "frame": (642, 330, 170),
    },
    "room-door": {
        "ceiling": [(0, 0), (1280, 0), (1280, 215), (1180, 250), (975, 298), (720, 342), (580, 385), (470, 360),
                    (210, 400), (0, 370)],
        "beams": [[(0, 80), (60, 95), (595, 345), (585, 392), (540, 388), (0, 162)]],
        "clutter": [(100, 420), (260, 420), (260, 591), (100, 591)],
        "remove": [[(118, 434), (230, 434), (230, 582), (118, 582)]],               # the red bag
        "lines": [],
        "curtain": None,
        "lights": ((10, 165), (575, 400), 60),
        "frame": None,
    },
    "room-window": {
        "ceiling": [(0, 0), (1280, 0), (1280, 400), (1100, 405), (830, 360), (740, 362), (700, 345), (390, 330),
                    (90, 262), (0, 230)],
        "beams": [[(752, 330), (1280, 38), (1280, 192), (795, 392)]],
        "clutter": [(900, 380), (1280, 380), (1280, 591), (900, 591)],
        "remove": [[(1150, 60), (1280, 60), (1280, 300), (1200, 300)],              # rope and cloth on the beam
                   [(1125, 445), (1280, 445), (1280, 591), (1125, 591)]],           # the hammock's shaded end
        "lines": [((820, 205), (1170, 95), 9), ((600, 215), (830, 205), 6), ((760, 345), (1280, 470), 8),
                  ((830, 425), (1010, 520), 7), ((1120, 420), (1280, 500), 6)],
        "curtain": [(850, 420), (900, 418), (1000, 430), (1110, 440), (1120, 591), (850, 591)],
        "lights": ((780, 405), (1280, 205), 50),
        "frame": None,
    },
}
PHOTOS = {"room-main": "room-1.jpg", "room-door": "room-2.jpg", "room-window": "room-3.jpg"}


def normconv(v, w, s):
    return cv2.GaussianBlur(v * w, (0, 0), s) / (cv2.GaussianBlur(w, (0, 0), s) + 1e-4)


def poly_mask(shape, pts):
    m = np.zeros(shape[:2], np.uint8)
    cv2.fillPoly(m, [np.array(pts, np.int32)], 1)
    return m > 0


def to_lab(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    return lab[..., 0], lab[..., 1] - 128, lab[..., 2] - 128


def from_lab(L, A, B):
    lab = np.dstack([np.clip(L, 0, 255), np.clip(A + 128, 0, 255), np.clip(B + 128, 0, 255)]).astype(np.uint8)
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


# ------------------------------------------------------------ 1. ceiling ----

def ceiling(img, outline, beams, fixtures=(), finish="paint"):
    region = poly_mask(img.shape, outline)
    beam = np.zeros(img.shape[:2], bool)
    for pts in beams:
        beam |= poly_mask(img.shape, pts)
    L, A, B = to_lab(img)
    Lb = cv2.GaussianBlur(L, (0, 0), 1.2)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (81, 81))
    hi = cv2.GaussianBlur(cv2.dilate(Lb, k), (0, 0), 8)
    lo = cv2.GaussianBlur(cv2.erode(Lb, k), (0, 0), 8)
    # Soft weight: 0 on wood, 1 on sheet, following the image's own edges.
    t = np.clip((Lb - (lo + 0.35 * (hi - lo))) / (0.15 * (hi - lo) + 1e-3), 0, 1)
    t = t * t * (3 - 2 * t) * (hi - lo > 25)
    wood = ((t < 0.5) & region).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(wood, 8)
    small = np.isin(lab, [i for i in range(1, n) if st[i, 4] < 1500]).astype(np.uint8)
    small = cv2.GaussianBlur(cv2.dilate(small, np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 1.5)
    t = np.maximum(t, small) * (1 - cv2.GaussianBlur(beam.astype(np.float32), (0, 0), 1.5))
    r = cv2.GaussianBlur(region.astype(np.float32), (0, 0), 2)
    ws, ww = t * r, (1 - t) * r
    sheet = ws > 0.5
    broad = normconv(L, sheet.astype(np.float32), 30)
    light = np.clip(broad / (np.percentile(broad[sheet], 90) + 1e-3), 0, 1.15)
    if finish in ("chatai", "ply", "gypsum"):
        # A false ceiling fixed to the underside of the rafters: one inclined
        # surface following the roof, hiding the rafters, battens and sheets.
        # The big beams below it, anything hanging from them (`fixtures`)
        # and the wall plates along the tops of the walls stay in view.
        wood = (t < 0.5) & region
        shown = (cv2.dilate(beam.astype(np.uint8), np.ones((15, 15), np.uint8)) > 0) & wood
        for pts in fixtures:
            shown |= poly_mask(img.shape, pts) & wood
        wall_plate = cv2.dilate((~region).astype(np.uint8), np.ones((25, 1), np.uint8), anchor=(0, 0)) > 0
        shown |= wall_plate & wood
        shown = cv2.morphologyEx(shown.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        wb = cv2.GaussianBlur(shown.astype(np.float32), (0, 0), 1.0)
        ws, ww = r * (1 - wb), r * wb
        cover = ws > 0.5
        # Light: the sheets' broad light, spread over the whole surface, and a
        # soft shadow along the beams and wall plates.
        light = cv2.GaussianBlur(light, (0, 0), 25)
        shade = 1 - 0.25 * np.exp(-cv2.distanceTransform(cover.astype(np.uint8), cv2.DIST_L2, 3) / 6.0)
        if finish == "gypsum":
            Ls = np.clip(240 * (0.62 + 0.38 * light), 0, 250) * shade
            Ls = Ls + cv2.GaussianBlur(np.random.default_rng(2).normal(0, 0.8, L.shape).astype(np.float32), (0, 0), 1)
            As, Bs = 0.5, 4.0
        else:
            Ls, As, Bs = to_lab(faces_texture(img, cover, region, finish))
            Ls = Ls * (0.55 + 0.45 * light) * shade
    else:
        # Painted warm white: the broad light falloff stays, and a quarter of
        # the ridges' shading.
        ridges = np.clip(L / (normconv(L, sheet.astype(np.float32), 6) + 1e-3), 0.6, 1.3)
        Ls = np.clip(236 * (0.6 + 0.4 * light) * (0.75 + 0.25 * ridges), 0, 250)
        As, Bs = 1.0, 7.0
    # Polished walnut: lift the near-black, warm it, keep the grain.
    Lw = np.clip(L * 1.05 + 16, 0, 190)
    Aw, Bw = 5 + 0.2 * A + 0.05 * Lw, 8 + 0.2 * B + 0.08 * Lw
    keep = 1 - ws - ww
    return from_lab(L * keep + Ls * ws + Lw * ww, A * keep + As * ws + Aw * ww, B * keep + Bs * ws + Bw * ww)


def roof_faces(cover, region):
    """The roof faces: the ceiling's parts as the beams divide them."""
    n, lab, st, _ = cv2.connectedComponentsWithStats(cover.astype(np.uint8), 8)
    return [lab == i for i in range(1, n) if st[i, 4] >= 200]


def rafter_direction(img, face):
    """The direction the rafters run on one face, in degrees (0 = right,
    90 = down). The rafters run steeply in these photos and the battens
    nearly level, so only the edges of steep members are counted: those
    whose brightness changes across, left to right."""
    L = cv2.GaussianBlur(to_lab(img)[0], (0, 0), 1.5)
    gx, gy = cv2.Sobel(L, cv2.CV_32F, 1, 0), cv2.Sobel(L, cv2.CV_32F, 0, 1)
    sel = face & (np.abs(gx) > np.abs(gy))
    if sel.sum() < 50:
        return 90.0
    member = np.arctan2(gy[sel], gx[sel]) + np.pi / 2            # along the member, across the gradient
    w = np.hypot(gx[sel], gy[sel])
    two = np.arctan2((w * np.sin(2 * member)).sum(), (w * np.cos(2 * member)).sum()) / 2
    deg = np.degrees(two) % 180
    return float(deg)


def _noise(seed, sx, sy, size=1024):
    """Tileable smooth noise, unit variance, blurred `sx` by `sy` px."""
    n = np.random.default_rng(seed).normal(0, 1, (size, size)).astype(np.float32)
    n = cv2.GaussianBlur(np.tile(n, (3, 3)), (0, 0), sigmaX=sx, sigmaY=sy)[size:2 * size, size:2 * size]
    return n / (n.std() + 1e-6)


def _sample(img, x, y, cols=1024):
    """`img` at the points (x, y), wrapping; x and y are flat arrays."""
    n = x.size
    rows = -(-n // cols)
    mx, my = np.zeros(rows * cols, np.float32), np.zeros(rows * cols, np.float32)
    mx[:n], my[:n] = x % img.shape[1], y % img.shape[0]
    out = cv2.remap(img, mx.reshape(rows, cols), my.reshape(rows, cols), cv2.INTER_LINEAR,
                    borderMode=cv2.BORDER_WRAP)
    return out.ravel()[:n]


def chatai(u, v, strip=9.0):
    """Woven bamboo mat (chatai) in a 2/2 twill at image scale: flat strips
    over two, under two, shifted one each row, which gives the diagonal ribs.
    `u` runs down the slope, `v` across it, in image pixels."""
    i, j = np.floor(u / strip).astype(np.int64), np.floor(v / strip).astype(np.int64)
    fu, fv = u / strip - i, v / strip - j
    along_u = ((i + j) // 2) % 2 == 0                 # which strip is on top here
    tones = np.random.default_rng(3).normal(0, 1, 4096)
    t = np.where(along_u, tones[j % 4096], tones[(i + 2048) % 4096])   # each strip its own tone
    across = np.where(along_u, fv, fu)
    along = np.where(along_u, fu, fv)
    profile = 1 - 0.15 * (2 * np.abs(across - 0.5)) ** 3                  # strip edges a touch darker
    gap = 0.7 + 0.3 * np.clip(np.minimum(across, 1 - across) / 0.08, 0, 1) ** 0.7
    dive = np.where(((i + j) % 2 == 0) & (along < 0.18) | ((i + j) % 2 == 1) & (along > 0.82), 0.92, 1.0)
    fib = np.where(along_u, _sample(_noise(5, 10, 0.5), u, v), _sample(_noise(5, 10, 0.5), v, u))
    L = np.clip((0.86 + 0.025 * t) * profile * gap * dive * (1 + 0.03 * fib) * 212, 0, 255)
    A = 4 + 0.8 * t + 5 * (1 - gap)
    B = 19 + 2.0 * t + 4 * (1 - gap)
    return L, A, B


def ply(u, v):
    """Thin plywood in a light pine veneer at image scale: grain running down
    the slope (`u`), soft and irregular, with the joints of 8 x 4 ft sheets
    (about 640 x 320 px here, from the rafters' spacing)."""
    warp = 5 * _sample(_noise(6, 70, 20), u, v) + 2 * _sample(_noise(7, 200, 60), u, v)
    period = 9 + 2.5 * _sample(_noise(8, 120, 120), u, v)
    rings = 0.5 + 0.5 * np.sin(2 * np.pi * (v + warp) / period)
    late = np.clip((rings - 0.9) / 0.1, 0, 1)
    pores = _sample(_noise(9, 6, 0.5), u, v)
    tone = _sample(_noise(10, 150, 150), u, v)
    L = 206 + 5 * tone - 3 * rings - 6 * late + 2 * pores
    joint = (np.abs(((v + 160) % 320) - 160) < 1.0) | (np.abs(((u + 320) % 640) - 320) < 1.0)
    L = np.where(joint, L - 35, L)
    return np.clip(L, 0, 255), 8 + 1.2 * tone + 2 * late, 26 + 2 * tone + 3 * late


def faces_texture(img, cover, region, finish):
    """Mat or ply across each roof face, its strips or grain running down
    the slope along the rafters. Drawn at the photo's own resolution in each
    face's coordinates, so nothing is resampled."""
    h, w = cover.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    L = np.zeros((h, w), np.float32)
    A, B = np.zeros_like(L), np.zeros_like(L)
    have = np.zeros((h, w), bool)
    make = chatai if finish == "chatai" else ply
    for n, face in enumerate(roof_faces(cover, region)):
        a = np.radians(rafter_direction(img, face))
        grown = (cv2.dilate(face.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0) & ~have
        x, y = xx[grown], yy[grown]
        u = x * np.cos(a) + y * np.sin(a) + 1000 * n
        v = -x * np.sin(a) + y * np.cos(a) + 1000 * n
        L[grown], A[grown], B[grown] = make(u, v)
        have |= grown
    L[~have], A[~have], B[~have] = 200, 6, 22
    return from_lab(L, A, B)


# ------------------------------------------------------------ 2. clutter ----

def clutter(img, zone):
    """The saree hammock (green-yellow) and the red and pink things, found by
    colour inside `zone`; each large piece is taken with its whole outline,
    so its shaded side goes too."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.int32)
    H, S, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    green = (H >= 22) & (H <= 45) & (S > 60) & (V > 70)
    red = ((H <= 8) | (H >= 165)) & (S > 90) & (V > 60)
    m = cv2.morphologyEx(((green | red) & poly_mask(img.shape, zone)).astype(np.uint8), cv2.MORPH_CLOSE,
                         np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    out = np.zeros(img.shape[:2], np.uint8)
    for i in range(1, n):
        if st[i, 4] > 300:
            hull = cv2.convexHull(np.argwhere(lab == i)[:, ::-1].astype(np.int32))
            cv2.fillPoly(out, [hull], 1)
    return cv2.dilate(out, np.ones((11, 11), np.uint8)) > 0


# ------------------------------------------------------------ 3. curtain ----

def curtain(img, outline):
    """Plain linen in warm sand, hanging in soft vertical folds, lit the way
    the old curtain was."""
    m = poly_mask(img.shape, outline)
    L, _, _ = to_lab(img)
    h, w = L.shape
    light = normconv(L, m.astype(np.float32), 40)
    light = np.clip(light / (np.percentile(light[m], 85) + 1e-3), 0.75, 1.1)
    rng = np.random.default_rng(5)
    x = np.arange(w, dtype=np.float32)
    folds = np.zeros(w, np.float32)
    for period, amp in ((34, 0.55), (21, 0.25), (57, 0.2)):
        folds += amp * np.sin(2 * np.pi * x / period + rng.uniform(0, 6.3))
    folds = 0.5 + 0.5 * folds / 1.0
    shade = 0.80 + 0.2 * np.clip(folds, 0, 1)[None, :].repeat(h, 0)
    weave = cv2.GaussianBlur(rng.normal(0, 2.5, L.shape).astype(np.float32), (0, 0), sigmaX=0.6, sigmaY=2.5)
    Lc = np.clip(212 * shade * light + weave, 0, 245)
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)[..., None]
    sand = from_lab(Lc, np.full_like(Lc, 4.0), np.full_like(Lc, 17.0))
    return (img * (1 - a) + sand * a).astype(np.uint8)


# -------------------------------------------------------------- 4. light ----

def fairy_lights(img, start, end, sag, n=26):
    out = img.astype(np.float32)
    h, w = img.shape[:2]
    glow = np.zeros((h, w), np.float32)
    s = np.linspace(0, 1, 200)
    xs = start[0] + (end[0] - start[0]) * s
    ys = start[1] + (end[1] - start[1]) * s + sag * 4 * s * (1 - s)
    pts = np.stack([xs, ys], 1).astype(np.int32)
    cv2.polylines(out, [pts], False, (40, 45, 50), 1, cv2.LINE_AA)        # the thin wire
    for u in np.linspace(0.03, 0.97, n):
        x = start[0] + (end[0] - start[0]) * u
        y = start[1] + (end[1] - start[1]) * u + sag * 4 * u * (1 - u) + 4
        cv2.circle(glow, (int(x), int(y)), 4, 1.0, -1, cv2.LINE_AA)
    warm = np.array([150, 215, 255], np.float32)                           # BGR, a candle-warm white
    halo = cv2.GaussianBlur(glow, (0, 0), 7) * 6.0 + cv2.GaussianBlur(glow, (0, 0), 28) * 9.0
    out = out + halo[..., None] * warm * 0.55
    core = cv2.GaussianBlur(glow, (0, 0), 1.0)[..., None]
    out = out * (1 - core) + np.array([215, 245, 255], np.float32) * core
    return np.clip(out, 0, 255).astype(np.uint8)


def warm_grade(img):
    L, A, B = to_lab(img)
    # Early evening: a little darker, warm, so the string lights glow.
    L = np.clip(L * 0.86, 0, 255)
    A, B = A + 2.5, B + 10.0
    out = from_lab(L, A, B).astype(np.float32)
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2))
    out *= (1 - 0.18 * np.clip(r - 0.55, 0, 1) ** 1.5)[..., None]
    return np.clip(out, 0, 255).astype(np.uint8)


# -------------------------------------------------------------- 5. frame ----

def hang_photo(img, x, y, width):
    photo = cv2.imread(str(FRIENDS))
    pw, ph = width, int(width * photo.shape[0] / photo.shape[1])
    mat, wood = 7, 6
    fw, fh = pw + 2 * (mat + wood), ph + 2 * (mat + wood)
    out = img.astype(np.float32)
    # Soft shadow down and to the right.
    sh = np.zeros(img.shape[:2], np.float32)
    cv2.rectangle(sh, (x + 4, y + 7), (x + fw + 4, y + fh + 7), 1, -1)
    sh = cv2.GaussianBlur(sh, (0, 0), 6)[..., None]
    out *= 1 - 0.35 * sh
    frame = np.zeros((fh, fw, 3), np.float32)
    frame[:] = (30, 52, 78)                                                  # walnut, BGR
    frame[wood:-wood, wood:-wood] = (226, 236, 242)                          # off-white mat
    frame[wood + mat:wood + mat + ph, wood + mat:wood + mat + pw] = cv2.resize(photo, (pw, ph), interpolation=cv2.INTER_AREA)
    frame[:2, :] *= 1.25                                                     # light catching the top edge
    out[y:y + fh, x:x + fw] = frame
    return np.clip(out, 0, 255).astype(np.uint8)


def compare(tiles):
    """Two by two, each tile labelled."""
    out = []
    for im, label in tiles:
        im = im.copy()
        cv2.putText(im, label, (20, 44), cv2.FONT_HERSHEY_DUPLEX, 1.2, (0, 0, 0), 5, cv2.LINE_AA)
        cv2.putText(im, label, (20, 44), cv2.FONT_HERSHEY_DUPLEX, 1.2, (255, 255, 255), 2, cv2.LINE_AA)
        out.append(im)
    gap_v = np.full((out[0].shape[0], 12, 3), 255, np.uint8)
    rows = [np.hstack([out[0], gap_v, out[1]]), np.hstack([out[2], gap_v, out[3]])]
    return np.vstack([rows[0], np.full((12, rows[0].shape[1], 3), 255, np.uint8), rows[1]])


def side_by_side(before, after):
    gap = np.full((before.shape[0], 12, 3), 255, np.uint8)
    out = np.hstack([before, gap, after])
    for x, t in ((20, "BEFORE"), (before.shape[1] + 32, "AFTER")):
        cv2.putText(out, t, (x, 44), cv2.FONT_HERSHEY_DUPLEX, 1.2, (0, 0, 0), 5, cv2.LINE_AA)
        cv2.putText(out, t, (x, 44), cv2.FONT_HERSHEY_DUPLEX, 1.2, (255, 255, 255), 2, cv2.LINE_AA)
    return out


def main():
    lama = Lama()
    for name, v in VIEWS.items():
        src = cv2.imread(str(HERE / PHOTOS[name]))
        img = src
        m = clutter(src, v["clutter"])
        for pts in v["remove"]:
            m |= poly_mask(src.shape, pts)
        lines = np.zeros(src.shape[:2], np.uint8)
        for p0, p1, t in v["lines"]:
            cv2.line(lines, p0, p1, 1, t)
        m |= lines > 0
        if m.any():
            img = lama.fill(img, m)
        cleared = img
        done = {}
        for finish, suffix in (("paint", ""), ("chatai", "-chatai"), ("ply", "-ply"), ("gypsum", "-gypsum")):
            img = ceiling(cleared, v["ceiling"], v["beams"], v.get("fixtures", ()), finish)
            if v["curtain"]:
                img = curtain(img, v["curtain"])
            if v["frame"]:
                img = hang_photo(img, *v["frame"])
            img = warm_grade(img)
            img = fairy_lights(img, *v["lights"])
            cv2.imwrite(str(HERE / f"{name}{suffix}-after.jpg"), img, [cv2.IMWRITE_JPEG_QUALITY, 92])
            cv2.imwrite(str(HERE / f"{name}{suffix}-before-after.jpg"), side_by_side(src, img),
                        [cv2.IMWRITE_JPEG_QUALITY, 88])
            done[finish] = img
            print(f"wrote {name}{suffix}-after.jpg")
        sheet = compare([(src, "BEFORE"), (done["chatai"], "BAMBOO CHATAI"), (done["ply"], "THIN PLY"),
                         (done["gypsum"], "GYPSUM")])
        cv2.imwrite(str(HERE / f"{name}-ceilings.jpg"), sheet, [cv2.IMWRITE_JPEG_QUALITY, 88])


if __name__ == "__main__":
    main()
