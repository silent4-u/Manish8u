"""Restore the print of six friends for printing and framing.

A second, more careful restoration than restore.py. It cleans damage only
where damage is, keeps every face exactly as the print shows it, and leaves
the cloth's own folds and texture in place instead of repainting whole
garments:

  1. Spots. Mould spots found automatically everywhere but on the faces;
     on the faces they are listed by hand (FACE_HEAL) after checking each
     face at 5x, so no eye, brow, nostril or the fourth boy's glasses frame
     is touched. Every fill is done by LaMa from the surrounding texture.
  2. Speckle. Mould speckle and cracks on the pale clothes (small, sharp,
     darker than the cloth around them), brown strands on the sky, the near
     black spots on the checked shirts and dark trousers, and the spots on
     arms and hands, each with its own test, again filled by LaMa.
  3. Stains. Broad water marks are lifted back toward the garment's clean
     level, one garment at a time. Gentle shading is left alone, and the
     fine grain of the cloth is put back unchanged.
  4. Colour. The violet is taken out of the blacks, the yellow out of the
     whites, the pink out of the skin, the teal sky turned back toward blue,
     and the tone range restored with a gentle curve.
  5. Print. Cropped inside the print's edges, enlarged with a 50/50 blend
     of Real-ESRGAN (realesr-general-x4v3) and a plain Lanczos enlargement,
     which keeps edges crisp without the glassy eyes a GAN gives on its own,
     then given a fine grain and saved at 300 dpi with an sRGB profile:

       friends-print-7x5.jpg   4200 x 3000  14x10 in at 300 dpi; 7x5, 10x7, A4
       friends-print-3x2.jpg   3600 x 2400  12x8 in at 300 dpi; 6x4, 9x6

    pip install numpy opencv-python-headless onnx onnxruntime pillow
    python3 media/old-photo/restore_print.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageCms

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
sys.path.insert(0, str(HERE))
import upscale as sr  # noqa: E402
from deep_clean import Lama, ellipse, from_lab, normconv, person_mask, to_lab  # noqa: E402
from garments import GARMENTS, KEEP, SMEARS  # noqa: E402
from restore import detect_faces, protect_mask, spot_mask  # noqa: E402

SOURCE = HERE / "friends-b.jpg"
CLEANED = HERE / "friends-print-cleaned.jpg"
PRINT_7X5 = HERE / "friends-print-7x5.jpg"
PRINT_3X2 = HERE / "friends-print-3x2.jpg"

# Mould spots on the faces, checked one by one at 5x on friends-b.jpg:
# (x, y, radius). Nostrils, moles, the brows and the glasses frame are not
# in this list.
FACE_HEAL = [
    (392, 286, 3),                                                    # first: between the brows
    (568, 239, 8), (565, 223, 3), (577, 234, 3),                      # second: forehead
    (513, 258, 3), (497, 273, 3), (518, 305, 4), (511, 301, 3),       # second: temple and cheek
    (784, 325, 3),                                                    # third: chin
    (922, 243, 3), (960, 232, 2),                                     # fourth: forehead
    (1088, 312, 3), (1132, 328, 9), (1091, 352, 4),                   # fifth: brow, cheek, nose
    (1159, 383, 8), (1161, 405, 8), (1166, 408, 10),                  # fifth: jaw and neck
    (1325, 213, 4), (1353, 198, 3), (1372, 187, 3), (1376, 195, 2),   # sixth: nose and eye
]

# The picture inside the print's edges (the pink border and the frame show
# beyond x = 1525), at 7:5.
CROP = (16, 6, 1510, 1073)


def poly(shape, pts):
    m = np.zeros(shape, np.uint8)
    cv2.fillPoly(m, [np.array(pts, np.int32)], 1)
    return m > 0


def face_zones(shape, faces, grow=0.58):
    z = np.zeros(shape, bool)
    for box, _, _ in faces:
        x0, y0, x1, y1 = box
        cx, cy, hw, hh = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) * grow, (y1 - y0) * grow
        z[max(int(cy - hh), 0):int(cy + hh), max(int(cx - hw), 0):int(cx + hw)] = True
    return z


def keep_mask(shape, which=KEEP, grow=9):
    k = np.zeros(shape, bool)
    for pts in which:
        k |= poly(shape, pts)
    return cv2.dilate(k.astype(np.uint8), ellipse(grow)) > 0


def components(cand, min_area, max_area, max_aspect, min_fill):
    n, lab, st, _ = cv2.connectedComponentsWithStats(cand.astype(np.uint8), 8)
    m = np.zeros(cand.shape, bool)
    for i in range(1, n):
        x, y, w, h, area = st[i]
        if min_area <= area <= max_area and max(w, h) / max(1, min(w, h)) < max_aspect \
                and area / (w * h) > min_fill:
            m[y:y + h, x:x + w] |= lab[y:y + h, x:x + w] == i
    return m


# --------------------------------------------------------------- 1. spots ----

def spots(img, faces):
    protect = protect_mask(img.shape, faces) | face_zones(img.shape[:2], faces)
    out, m = img, np.zeros(img.shape[:2], np.uint8)
    for _ in range(5):          # clearing one spot leaves its neighbours isolated
        mi = spot_mask(out, protect)
        if mi.sum() == 0:
            break
        out = cv2.inpaint(out, mi * 255, 4, cv2.INPAINT_TELEA)
        m |= mi
    for x, y, r in FACE_HEAL:
        cv2.circle(m, (x, y), r + 1, 1, -1)
    return m > 0


# ------------------------------------------------------------ 2. speckle ----

def speckle(img, faces, person):
    """Mould speckle and cracks on pale cloth, and brown marks on the sky."""
    h, w = img.shape[:2]
    shape = (h, w)
    zone = face_zones(shape, faces)
    keep = keep_mask(shape, grow=1)
    pale = np.zeros(shape, bool)
    for name, (kind, pts) in GARMENTS.items():
        if kind == "plain" and name not in ("second_trousers", "fifth_trousers", "third_tshirt"):
            pale |= poly(shape, pts)
    checks = poly(shape, GARMENTS["fifth_shirt"][1]) | poly(shape, GARMENTS["sixth_shirt"][1])
    L, A, B = to_lab(img)
    env = cv2.GaussianBlur(cv2.morphologyEx(L, cv2.MORPH_CLOSE, ellipse(11)), (0, 0), 1.0)
    d = env - L
    envA, envB = cv2.GaussianBlur(A, (0, 0), 6), cv2.GaussianBlur(B, (0, 0), 6)
    m = pale & ~keep & ~zone & (env > 130) & (d > 7)
    sky = ~(cv2.dilate(person.astype(np.uint8), ellipse(9)) > 0) & (envA < -4)
    m |= sky & (d > 6) & ((A - envA > 3) | (B - envB > 5))
    m |= checks & ~keep & ~zone & (d > 9) & (B - envB > 4)
    for pts in SMEARS:
        m |= poly(shape, pts)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, ellipse(2))
    return cv2.dilate(m, ellipse(5)) > 0


def dark_spots(img, faces):
    """Near-black spots on the checked shirts and dark trousers, mould on the
    sky between the painted trees, and a few marks found by eye."""
    h, w = img.shape[:2]
    shape = (h, w)
    zone = face_zones(shape, faces)
    keep = keep_mask(shape)
    L, A, B = to_lab(img)
    cloth = np.zeros(shape, bool)
    for name in ("fifth_shirt", "sixth_shirt", "second_trousers", "fifth_trousers"):
        cloth |= poly(shape, GARMENTS[name][1])
    env15 = cv2.morphologyEx(L, cv2.MORPH_CLOSE, ellipse(15))
    m = components(cloth & ~keep & ~zone & (env15 - L > 22) & (B > -4) & (L < 110), 4, 400, 2.8, 0.3)
    env9 = cv2.GaussianBlur(cv2.morphologyEx(L, cv2.MORPH_CLOSE, ellipse(9)), (0, 0), 1)
    envA = cv2.GaussianBlur(A, (0, 0), 8)
    ys, xs = np.mgrid[0:h, 0:w]
    sky = (envA < -5) & (env9 > 120) & (xs > 560) & (xs < 1440) & (ys < 300) & ~zone
    m |= sky & (env9 - L > 7)
    hand = np.zeros(shape, np.uint8)
    cv2.line(hand, (378, 1022), (377, 1073), 1, 9)                 # a purple crack down the first boy's trousers
    cv2.circle(hand, (373, 1004), 10, 1, -1)                       # and the blot above it
    cv2.line(hand, (386, 914), (387, 958), 1, 10)                  # a brown drip down his belt
    cv2.polylines(hand, [np.array([(1020, 98), (1040, 104), (1060, 106), (1080, 104), (1100, 99),
                                   (1112, 98)], np.int32)], False, 1, 7)   # a curved scratch on the sky
    cv2.line(hand, (1076, 76), (1076, 106), 1, 6)
    cv2.circle(hand, (1190, 112), 6, 1, -1)
    m |= hand > 0
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, ellipse(2))
    return cv2.dilate(m, ellipse(7)) > 0


def skin_spots(img, faces):
    """Dark spots on arms and hands: warm skin only, not the knuckles."""
    h, w = img.shape[:2]
    zone = face_zones((h, w), faces, grow=0.62)
    L, A, B = to_lab(img)
    Ab, Bb = cv2.GaussianBlur(A, (0, 0), 4), cv2.GaussianBlur(B, (0, 0), 4)
    env = cv2.GaussianBlur(cv2.morphologyEx(L, cv2.MORPH_CLOSE, ellipse(13)), (0, 0), 1)
    skin = cv2.morphologyEx(((Ab > 9) & (Bb > 8) & (env > 110)).astype(np.uint8), cv2.MORPH_CLOSE, ellipse(9)) > 0
    skin[400:510, 670:880] = False          # the T-shirt lettering
    skin[:, :160] = False                   # the painted building, and an arm's edge
    skin[650:720, 240:300] = False          # the first boy's knuckles
    m = components(skin & ~zone & (env - L > 16), 3, 160, 2.2, 0.4)
    return cv2.dilate(m.astype(np.uint8), ellipse(7)) > 0


def black_spots(img, faces):
    """Near-black spots beside the dark checks and on dark trousers, which the
    earlier passes leave because their surroundings are dark too; and the
    mould along the first boy's shirt hem, just above his belt."""
    h, w = img.shape[:2]
    L, A, B = to_lab(img)
    ctx = cv2.medianBlur(np.clip(L, 0, 255).astype(np.uint8), 31).astype(np.float32)
    cloth = np.zeros((h, w), bool)
    for name in ("fifth_shirt", "sixth_shirt", "second_trousers", "fifth_trousers"):
        cloth |= poly((h, w), GARMENTS[name][1])
    cloth[740:, 930:1050] = True            # the fourth boy's dark trousers
    cloth[700:790, 925:965] = False         # the gap at the fifth boy's elbow
    cand = cloth & (L < 40) & (L < 0.6 * ctx) & (B > -14) & ~face_zones((h, w), faces, 0.75) & ~keep_mask((h, w))
    m = components(cand, 10, 500, 2.5, 0.35)
    hem = np.zeros((h, w), np.uint8)
    cv2.polylines(hem, [np.array([(268, 942), (300, 935), (350, 921), (385, 914), (420, 905), (455, 897)],
                                 np.int32)], False, 1, 13)
    cv2.ellipse(hem, (300, 962), (14, 16), 0, 0, 360, 1, -1)
    return cv2.dilate((m | (hem > 0)).astype(np.uint8), ellipse(9)) > 0


# ------------------------------------------------------------- 3. stains ----

def even_out(L, A, B, region, k_env=31, alpha=0.75, soft=6.0, chroma=0.8):
    """Lift blotches on one garment toward its clean level. Dips shallower
    than `soft` are the cloth's own shading and are left alone; the fine
    grain is put back unchanged."""
    r = region.astype(np.float32)
    Lf = np.where(region, L, normconv(L, r, 6))      # outside the garment: its own values
    fine = L - cv2.GaussianBlur(L, (0, 0), 1.6)
    Lmid = cv2.GaussianBlur(Lf, (0, 0), 1.6)
    env = normconv(cv2.morphologyEx(Lmid, cv2.MORPH_CLOSE, ellipse(k_env)), r, k_env / 3)
    deficit = np.maximum(env - Lmid, 0)
    g = deficit * np.clip((deficit - soft) / (2 * soft), 0, 1)
    Lnew = Lmid + alpha * g + fine
    clean_w = r * np.clip(1 - g / 20, 0, 1)
    s = np.clip(g / 15, 0, 1) * chroma
    Anew = A + (normconv(A, clean_w, 14) - A) * s
    Bnew = B + (normconv(B, clean_w, 14) - B) * s
    edge = cv2.GaussianBlur(r, (0, 0), 2.0)
    return L + (Lnew - L) * edge, A + (Anew - A) * edge, B + (Bnew - B) * edge


def stains(img, person):
    h, w = img.shape[:2]
    shape = (h, w)
    keep = keep_mask(shape)
    keep7 = keep_mask(shape, grow=7)
    L, A, B = to_lab(img)
    Lb, Ab, Bb = (cv2.GaussianBlur(c, (0, 0), 3) for c in (L, A, B))
    not_skin = ~(cv2.dilate(((Ab > 9.5) & (Lb < 200)).astype(np.uint8), ellipse(5)) > 0)

    def cream(outline, k_close=21):
        reg = (outline & (Lb > 115) & (Bb > 3) & (Ab < 9.5) & (Ab > -3) & not_skin).astype(np.uint8)
        reg = cv2.morphologyEx(reg, cv2.MORPH_OPEN, ellipse(5))
        # Take in the darker stains inside the cloth, not the gaps beside it.
        reg = (cv2.morphologyEx(reg, cv2.MORPH_CLOSE, ellipse(k_close)) > 0) & outline & not_skin & (Ab > -3)
        return cv2.erode(reg.astype(np.uint8), ellipse(3)) > 0

    # Pale garments: the cream shirts and trousers.
    for name, k, a in (("first_shirt_trousers", 51, 0.85), ("third_trousers", 41, 0.75),
                       ("fourth_shirt", 31, 0.65), ("sixth_trousers", 121, 0.9)):
        reg = cream(poly(shape, GARMENTS[name][1]) & ~keep7)
        L, A, B = even_out(L, A, B, reg, k, a, soft=5.0 if k > 100 else 6.0, chroma=1.0 if k > 100 else 0.8)
    Lb, Ab, Bb = (cv2.GaussianBlur(c, (0, 0), 3) for c in (L, A, B))

    # The sky between the trees: teal, above the shoulders, off the people.
    ys, xs = np.mgrid[0:h, 0:w]
    hue = np.degrees(np.arctan2(Bb, Ab))
    off = ~(cv2.dilate(person.astype(np.uint8), ellipse(7)) > 0)
    sky = (hue > 110) & (hue < 200) & (np.hypot(Ab, Bb) > 6) & (Lb > 90) & (ys < 330) & (xs > 430) & (xs < 1480) & off
    sky = cv2.morphologyEx(sky.astype(np.uint8), cv2.MORPH_OPEN, ellipse(5))
    sky = (cv2.morphologyEx(sky, cv2.MORPH_CLOSE, ellipse(25)) > 0) & off & (Lb > 70)
    L, A, B = even_out(L, A, B, sky, 81, 0.85, soft=4.0, chroma=1.0)

    # The fifth boy's purple trousers: dark water marks.
    purple = poly(shape, GARMENTS["fifth_trousers"][1]) & (Ab > 2) & (Bb < 4) & ~keep
    purple = cv2.morphologyEx(purple.astype(np.uint8), cv2.MORPH_OPEN, ellipse(5)) > 0
    L, A, B = even_out(L, A, B, purple, 51, 0.6, soft=6.0, chroma=0.6)

    # Checked shirts: only their light squares, which carry the olive and
    # grey marks; the navy checks keep their own tone. The sixth shirt's
    # water mark also bleached its checks, so it is taken out gently: mostly
    # its olive colour, so it reads as a fold's shadow, not a patch.
    for name, lmin, amax, amax_filled, a, c in (("sixth_shirt", 140, 9, np.inf, 0.35, 1.0),
                                                ("fifth_shirt", 125, 6, 8, 0.55, 0.8)):
        shirt = poly(shape, GARMENTS[name][1]) & ~keep
        light = shirt & (Lb > lmin) & (Ab < amax)
        light = (cv2.morphologyEx(light.astype(np.uint8), cv2.MORPH_CLOSE, ellipse(9)) > 0) & shirt \
            & (Lb > lmin - 25) & (Ab < amax_filled)
        L, A, B = even_out(L, A, B, light, 41, a, soft=6.0, chroma=c)

    # The first boy's cream outfit once more, at a larger scale for the broad mottling.
    outline = poly(shape, GARMENTS["first_shirt_trousers"][1]) & ~keep
    reg = outline & (Lb > 115) & (Bb > 3) & (Ab < 9.5) & (Ab > -3)
    reg = (cv2.morphologyEx(reg.astype(np.uint8), cv2.MORPH_CLOSE, ellipse(21)) > 0) & outline & (Ab < 9.5)
    L, A, B = even_out(L, A, B, cv2.erode(reg.astype(np.uint8), ellipse(3)) > 0, 91, 0.6, soft=6.0, chroma=0.8)
    return from_lab(L, A, B)


# ------------------------------------------------------------- 4. colour ----

def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def recolour(bgr):
    lab = cv2.cvtColor(bgr.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)    # L 0-100
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    hue, C = np.degrees(np.arctan2(B, A)), np.hypot(A, B)
    # Skin read a touch pink (hue ~47 deg): turn it toward a natural warm brown.
    skin = np.clip(1 - np.abs(hue - 45) / 25, 0, 1) * smooth(C, 6, 12) * smooth(L, 25, 45)
    hue = hue + 9 * skin
    # The painted sky: the yellowed print turned its blue teal-green.
    sky = np.clip(1 - np.abs(hue - 165) / 30, 0, 1) * smooth(C, 5, 10) * smooth(L, 40, 55)
    hue = hue + 14 * sky
    # The dyes faded: a little more colour, but not on skin.
    C = C * (1 + 0.05 * (1 - skin))
    A, B = C * np.cos(np.radians(hue)), C * np.sin(np.radians(hue))
    # Shadows had gone violet (hair and the navy T-shirt): make the blacks black.
    dark = 1 - smooth(L, 15, 45)
    A -= (A - 1.5) * 0.9 * dark
    B -= (B + 2.0) * 0.85 * dark
    # The paper has yellowed: pale cloth back to warm white and cream.
    hi = smooth(L, 55, 85) * (1 - skin)
    B -= 6.0 * hi * smooth(B, 4, 12) + 2.0 * hi
    A -= 0.8 * hi
    # Tone: black and white points, a gentle S-curve and a little local contrast.
    lo, top = np.percentile(L, (0.4, 99.8))
    x = 0.045 + 0.93 * np.clip((L - lo) / (top - lo), 0, 1)
    L = 100 * (x + 0.06 * x * (1 - x) * (2 * x - 1))
    l8 = np.clip(L * 2.55, 0, 255).astype(np.uint8)
    L = L * 0.8 + cv2.createCLAHE(clipLimit=1.2, tileGridSize=(6, 6)).apply(l8).astype(np.float32) / 2.55 * 0.2
    out = cv2.cvtColor(np.dstack([L, A, B]).astype(np.float32), cv2.COLOR_LAB2BGR)
    return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)


# -------------------------------------------------------------- 5. print ----

def enlarge(bgr, width):
    session = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    gan = sr.upscale(session, bgr).astype(np.float32)
    plain = cv2.resize(bgr, (gan.shape[1], gan.shape[0]), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    big = 0.5 * gan + 0.5 * plain
    height = int(round(big.shape[0] * width / big.shape[1]))
    big = cv2.resize(big, (width, height), interpolation=cv2.INTER_AREA)
    # A light unsharp mask, then a fine grain so it reads as a photograph.
    big = big + 0.35 * (big - cv2.GaussianBlur(big, (0, 0), 1.4))
    grain = cv2.GaussianBlur(np.random.default_rng(7).normal(0, 2.6, big.shape[:2]).astype(np.float32), (0, 0), 0.8)
    return np.clip(big + grain[..., None], 0, 255).astype(np.uint8)


def save_print(bgr, path):
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
    Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).save(
        path, quality=95, subsampling=0, dpi=(300, 300), icc_profile=srgb)
    print(f"wrote {path.name} {bgr.shape[1]}x{bgr.shape[0]}")


def main():
    src = cv2.imread(str(SOURCE))
    faces = detect_faces(src)
    print(f"{len(faces)} faces")
    lama = Lama()
    print("1. spots")
    img = lama.fill(src, spots(src, faces))
    print("2. speckle and dark spots")
    person = person_mask(img)
    img = lama.fill(img, speckle(img, faces, person))
    img = lama.fill(img, dark_spots(img, faces))
    print("3. stains")
    img = stains(img, person)
    img = lama.fill(img, skin_spots(img, faces) | black_spots(img, faces))
    cv2.imwrite(str(CLEANED), img, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print("4. colour")
    col = recolour(img)
    print("5. print")
    x0, y0, x1, y1 = CROP
    big = enlarge(col[y0:y1, x0:x1], 4200)
    big = cv2.resize(big, (4200, 3000), interpolation=cv2.INTER_AREA)
    save_print(big, PRINT_7X5)
    # 3:2 from the same picture: a little less sky and trouser hem.
    save_print(cv2.resize(big[80:2880], (3600, 2400), interpolation=cv2.INTER_AREA), PRINT_3X2)


if __name__ == "__main__":
    main()
