"""Turn the café photo into an illustrated quote poster: a mustard wall with
soft leaf shadows and a hanging bulb, the sitter painted as an illustration,
a small spaced title and a handwritten-style quote.

The sitter keeps his own face: no generative model redraws him. He is cut
out with IS-Net (rembg's isnet-general-use), and the illustration is an
edge-preserving paint pass, soft cel steps on lightness, mid-frequency detail
kept for the beard and folds, and thin ink lines traced from the photo.

    pip install numpy opencv-python-headless onnxruntime pillow
    python3 media/poster/make_poster.py [fonts_dir]
"""

import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
PHOTO = HERE / "cafe.jpg"
OUTPUT = HERE / "poster.jpg"
FONTS = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "fonts"
CACHE = Path.home() / ".cache" / "rembg"
ISNET = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx"

W, H = 2160, 2700                       # 4:5
WALL = np.array([52, 160, 214], np.float32) / 255   # mustard, BGR
INK = np.array([0.09, 0.11, 0.17], np.float32)      # warm near-black, BGR
TEXT_RGB = (31, 26, 18)

TITLE = "ME  &  MY  COFFEE"
QUOTE = [
    "Been so busy chasing the big moments,",
    "I almost forgot how good",
    "the quiet ones feel.",
]
TABLE_Y = 1752      # the table's front edge in cafe.jpg; everything below is kept


# ------------------------------------------------------------------ cut-out ----

def isnet(session, bgr):
    h, w = bgr.shape[:2]
    x = cv2.resize(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB), (1024, 1024), interpolation=cv2.INTER_AREA)
    x = x.astype(np.float32) / 255 - np.array([0.485, 0.456, 0.406], np.float32)
    p = session.run(None, {"input_image": x.transpose(2, 0, 1)[None]})[0][0, 0]
    p = (p - p.min()) / (p.max() - p.min() + 1e-6)
    return cv2.resize(p, (w, h), interpolation=cv2.INTER_CUBIC)


def solid(mask, min_area):
    """A colour mask made whole: closed, holes filled, specks dropped."""
    m = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    m = np.isin(lab, [i for i in range(1, n) if st[i, 4] >= min_area]).astype(np.uint8)
    holes = m.copy()
    ff = np.zeros((m.shape[0] + 2, m.shape[1] + 2), np.uint8)
    cv2.floodFill(holes, ff, (0, 0), 1)
    return (m | (1 - holes)).astype(np.float32)


def cutout(photo):
    """Alpha for the sitter, his cup, the plant, the tissue box and the table."""
    CACHE.mkdir(parents=True, exist_ok=True)
    model = CACHE / "isnet-general-use.onnx"
    if not model.exists():
        urllib.request.urlretrieve(ISNET, model)
    s = ort.InferenceSession(str(model), providers=["CPUExecutionProvider"])
    h, w = photo.shape[:2]
    a = isnet(s, photo)
    # The things on the table, each found in its own crop so it is the subject.
    for x0, y0, x1, y1 in ((1040, 1180, w, h), (0, 1450, 430, h)):
        crop = isnet(s, photo[y0:y1, x0:x1])
        a[y0:y1, x0:x1] = np.maximum(a[y0:y1, x0:x1], crop)
    a = np.clip((a - 0.45) / 0.25, 0, 1)
    hsv = cv2.cvtColor(photo, cv2.COLOR_BGR2HSV).astype(np.int32)
    hh, ss, vv = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    # The snake plant: its green and yellow leaves, by colour (the network
    # only half-sees them against the pale wall).
    plant = (hh >= 20) & (hh <= 95) & (ss > 60) & (vv > 50)
    plant[:1180] = False
    plant[:, :1080] = False
    a = np.maximum(a, solid(plant, 3000))
    # The tissue: bright, colourless, at the left edge of the table.
    tissue = (vv > 185) & (ss < 50)
    tissue[:1540] = False
    tissue[:, 340:] = False
    a = np.maximum(a, solid(tissue, 3000))
    table = np.clip((np.arange(h, dtype=np.float32)[:, None] - TABLE_Y) / 3 + 0.5, 0, 1)
    a = np.maximum(a, np.repeat(table, w, 1))
    # Tidy: drop specks, then a hair of erosion so no café colour rims the edge.
    n, lab, st, _ = cv2.connectedComponentsWithStats((a > 0.5).astype(np.uint8), 8)
    small = np.isin(lab, [i for i in range(1, n) if st[i, 4] < 4000])
    a[small] = 0
    a = cv2.erode(a, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(a, (0, 0), 1.0)


# ------------------------------------------------------------- illustration ----

def illustrate(bgr):
    p = cv2.edgePreservingFilter(bgr, flags=cv2.RECURS_FILTER, sigma_s=45, sigma_r=0.28)
    p = cv2.edgePreservingFilter(p, flags=cv2.RECURS_FILTER, sigma_s=25, sigma_r=0.22)
    p = p.astype(np.float32) / 255
    g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    # Painted mid-detail (beard, folds), without the fine weave of the shirt.
    p += (cv2.GaussianBlur(g, (0, 0), 1.6) - cv2.GaussianBlur(g, (0, 0), 7))[..., None] * 0.55
    # Soft cel steps on lightness.
    lab = cv2.cvtColor(np.clip(p, 0, 1), cv2.COLOR_BGR2LAB)
    L = lab[..., 0] / 100
    q = L * 6
    s = (np.floor(q) + 1 / (1 + np.exp(-(q - np.floor(q) - 0.5) * 8))) / 6
    lab[..., 0] = np.clip(s * 0.45 + L * 0.55, 0, 1) * 100
    p = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    # Ink: XDoG on a gently smoothed luminance, specks removed.
    gs = cv2.bilateralFilter((g * 255).astype(np.uint8), 9, 40, 6).astype(np.float32) / 255
    d = cv2.GaussianBlur(gs, (0, 0), 1.3) - 0.982 * cv2.GaussianBlur(gs, (0, 0), 2.1)
    e = np.where(d >= -0.006, 1.0, 1 + np.tanh(45 * (d + 0.006))).astype(np.float32)
    n, lab_, st, _ = cv2.connectedComponentsWithStats(((1 - e) > 0.35).astype(np.uint8), 8)
    keep = np.zeros(n, bool)
    keep[1:] = st[1:, 4] >= 40
    e = cv2.GaussianBlur(np.where(keep[lab_], e, 1.0).astype(np.float32), (0, 0), 0.7)
    k = (1 - e)[..., None] * 0.85
    return np.clip(p * (1 - k) + INK * k, 0, 1)


# -------------------------------------------------------------------- wall ----

YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
BULB = (int(W * 0.135), int(H * 0.115))


def wall():
    rng = np.random.default_rng(4)
    # Painted plaster: very low-frequency mottling and a fine tooth.
    mottle = cv2.resize(rng.normal(0, 1, (18, 15)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
    tooth = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), 1.2)
    base = WALL * (1 + 0.035 * mottle[..., None] + 0.018 * tooth[..., None])
    # Warm light pooling around the bulb, deepening toward the floor.
    d = np.sqrt((XX - BULB[0]) ** 2 + ((YY - BULB[1]) * 0.9) ** 2)
    glow = np.exp(-(d / (W * 0.42)) ** 2)[..., None]
    base = base * (0.90 + 0.16 * glow) + np.array([0.02, 0.05, 0.06], np.float32) * glow
    base *= (1 - 0.10 * (YY / H) ** 2)[..., None]
    return base


def leaf_shadows():
    """Dappled shadows of a plant out of frame: clumps of leaves, soft-edged."""
    rng = np.random.default_rng(9)
    sil = Image.new("L", (W // 2, H // 2), 0)
    d = ImageDraw.Draw(sil)
    for cx, cy, spread, count in ((90, 520, (260, 230), 70), (980, 820, (220, 280), 60),
                                  (40, 980, (180, 160), 30)):
        for _ in range(count):
            x = cx + rng.normal(0, spread[0] * 0.55)
            y = cy + rng.normal(0, spread[1] * 0.55)
            ang = rng.uniform(0, np.pi)
            ll, lw = rng.uniform(28, 62), rng.uniform(10, 22)
            leaf = [(t * ll - ll / 2, lw * np.sin(np.pi * t) ** 0.7) for t in np.linspace(0, 1, 16)]
            leaf += [(px, -py) for px, py in reversed(leaf)]
            ca, sa = np.cos(ang), np.sin(ang)
            d.polygon([(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in leaf], fill=255)
        # A few stems through each clump.
        for _ in range(4):
            a = rng.uniform(0, 2 * np.pi)
            r = rng.uniform(120, 220)
            d.line([(cx, cy), (cx + r * np.cos(a), cy + r * np.sin(a))], fill=255, width=3)
    sil = sil.resize((W, H), Image.BICUBIC)
    a = np.asarray(sil, np.float32) / 255
    # Shadows soften with distance from the wall: blur grows away from clump cores.
    near = cv2.GaussianBlur(a, (0, 0), 6)
    far = cv2.GaussianBlur(a, (0, 0), 18)
    t = np.clip(cv2.GaussianBlur(a, (0, 0), 120) * 3, 0, 1)
    return near * t + far * (1 - t)


def bulb(img):
    """A hanging bulb: cord, socket, glowing glass, and the light it throws."""
    x, y = BULB
    out = img
    cord = np.zeros((H, W), np.float32)
    cv2.line(cord, (x, 0), (x, y - 100), 1.0, 6, cv2.LINE_AA)
    sock = np.zeros((H, W), np.float32)
    cv2.rectangle(sock, (x - 24, y - 128), (x + 24, y - 66), 1.0, -1, cv2.LINE_AA)
    k = cv2.GaussianBlur(np.clip(cord + sock, 0, 1), (0, 0), 0.8)[..., None]
    out = out * (1 - k) + np.array([0.06, 0.06, 0.07], np.float32) * k
    # Glow on the wall first, then the glass over it.
    r = np.sqrt((XX - x) ** 2 + (YY - y) ** 2)
    halo = (np.exp(-(r / 150) ** 2) * 0.55 + np.exp(-(r / 420) ** 2) * 0.18)[..., None]
    out = 1 - (1 - out) * (1 - halo * np.array([0.55, 0.88, 1.0], np.float32))
    d = np.sqrt(((XX - x) / 80) ** 2 + ((YY - y) / 96) ** 2)
    glass = np.clip((1.0 - d) * 20, 0, 1)[..., None]
    core = np.exp(-(((XX - x) / 34) ** 2 + ((YY - y + 6) / 40) ** 2))[..., None]
    colour = np.array([0.80, 0.95, 1.0], np.float32) * (0.90 + 0.10 * core)
    out = out * (1 - glass) + colour * glass
    fil = np.zeros((H, W), np.float32)
    cv2.ellipse(fil, (x, y + 4), (16, 10), 0, 180, 360, 1.0, 3, cv2.LINE_AA)
    out = out * (1 - fil[..., None] * 0.6) + np.array([0.55, 0.85, 1.0], np.float32) * fil[..., None] * 0.6
    return np.clip(out, 0, 1)


def text(img):
    pil = Image.fromarray((np.clip(img[..., ::-1], 0, 1) * 255).astype(np.uint8))
    d = ImageDraw.Draw(pil)
    head = ImageFont.truetype(str(FONTS / "Montserrat[wght].ttf"), 46)
    try:
        head.set_variation_by_axes([500])
    except OSError:
        pass
    quote = ImageFont.truetype(str(FONTS / "Delius-Regular.ttf"), 80)
    cx = W // 2 + 30
    # The title, letter-spaced, with a short rule under it.
    track = 22
    widths = [d.textlength(c, font=head) for c in TITLE]
    x = cx - (sum(widths) + track * (len(TITLE) - 1)) / 2
    for c, cw in zip(TITLE, widths):
        d.text((x, 115), c, font=head, fill=TEXT_RGB, anchor="lm")
        x += cw + track
    d.line((cx - 42, 175, cx + 42, 175), fill=TEXT_RGB, width=5)
    for i, line in enumerate(QUOTE):
        d.text((cx, 330 + i * 112), line, font=quote, fill=TEXT_RGB, anchor="mm")
    return np.asarray(pil, np.float32)[..., ::-1] / 255


def main():
    photo = cv2.imread(str(PHOTO))
    ph, pw = photo.shape[:2]
    print("cutting out")
    alpha = cutout(photo)
    print("illustrating")
    art = illustrate(photo)
    # Warm the sitter toward the room's light so he belongs on the wall.
    lum = (art @ np.array([0.114, 0.587, 0.299], np.float32))[..., None]
    art = art * np.array([0.93, 0.99, 1.04], np.float32) + WALL * 0.06 * (1 - lum)

    s = W / pw
    m = np.float32([[s, 0, 0], [0, s, H - ph * s]])
    # Edge colours from inside the outline only, so the café wall cannot rim him.
    core = (alpha > 0.97).astype(np.float32)[..., None]
    inside = cv2.GaussianBlur(art * core, (0, 0), 4) / (cv2.GaussianBlur(core, (0, 0), 4)[..., None] + 1e-4)
    edge = np.clip((1 - alpha) * 4, 0, 1)[..., None] * (alpha > 0.02)[..., None]
    art = art * (1 - edge) + inside * edge
    art_c = cv2.warpAffine(art, m, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
    a_c = cv2.warpAffine(alpha, m, (W, H), flags=cv2.INTER_LINEAR)[..., None]

    print("painting the wall")
    img = wall()
    img *= 1 - 0.20 * leaf_shadows()[..., None]
    shadow = cv2.GaussianBlur(np.roll(np.roll(a_c[..., 0], 40, 1), 22, 0), (0, 0), 28)
    img *= 1 - 0.22 * shadow[..., None]
    img = img * (1 - a_c) + art_c * a_c
    v = 1 - 0.16 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2) ** 1.6
    img *= np.clip(v, 0.7, 1)[..., None]
    img = bulb(img)
    img = text(img)
    img += np.random.default_rng(1).normal(0, 0.008, img.shape).astype(np.float32)
    cv2.imwrite(str(OUTPUT), (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8),
                [cv2.IMWRITE_JPEG_QUALITY, 96])
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
