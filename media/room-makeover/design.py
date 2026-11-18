"""The bedroom designed in full, drawn into the three photos, and a design
board that shows the result with its palette and its list of pieces.

The scheme is warm modern-rustic, built around the ceiling:

  Ceiling   pine ply fixed under the rafters and inclined with the roof
            (makeover.py, finish "ply-trim"), its joints covered by slim
            walnut strips; the big beams and wall plates polished walnut.
  Walls     warm white, with the wall beside the curtains in sage green.
  Light     layered and warm (2700 K): a hidden LED cove on top of the wall
            plates washing up the ply, recessed downlights in the ply, a
            rattan pendant over the framed photo, and brass wall sconces in
            place of the bare bulbs.
  Living    linen curtains in sand, a hanging planter with a trailing money
            plant, a floating walnut shelf with a pothos, books and a
            terracotta pot, and the restored photo of the six friends.

Everything is drawn as shapes and lit: objects first, then the evening grade,
then each light as it falls on the surfaces around it.

    pip install numpy opencv-python-headless onnx onnxruntime pillow
    python3 media/room-makeover/design.py [fonts_dir]

`fonts_dir` must hold CormorantGaramond[wght].ttf and Montserrat[wght].ttf
(Google Fonts); the board falls back to DejaVu without them.
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / "old-photo"))
sys.path.insert(0, str(HERE.parent / "sunset"))
import makeover as mk  # noqa: E402
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402

FONTS = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "fonts"
BOARD = HERE / "room-design-board.jpg"

WARM = np.array([0.62, 0.84, 1.0], np.float32)      # BGR of 2700 K light, relative
SAGE = (-9.0, 10.0)                                  # Lab a, b of the accent wall: a soft grey-green
WALNUT = (38, 60, 88)                                # BGR
TERRACOTTA = (70, 110, 176)
BRASS = (70, 150, 200)
CREAM = (205, 222, 232)

# Where each piece goes, in the photos' own pixels (1280 x 591).
DESIGN = {
    "room-main": {
        "accent": [(255, 170), (548, 170), (548, 591), (255, 591)],
        "remove": [[(1222, 232), (1280, 232), (1280, 292), (1222, 292)]],          # the bare bulb
        "downlights": [(170, 138), (515, 190), (1015, 200)],
        "pendant": (760, 132, 214),                     # x, where it hangs from the beam, bottom of the cord
        "planter": (418, 86, 232),
        "sconces": [(1205, 300)],
        "shelf": ((928, 486), (1092, 482)),
    },
    "room-door": {
        "accent": None,
        "remove": [[(503, 395), (560, 395), (560, 442), (503, 442)]],
        "downlights": [(390, 105), (735, 115), (1070, 105), (120, 292)],
        "pendant": None,
        "planter": None,
        "sconces": [(530, 425)],
        "shelf": None,
    },
    "room-window": {
        "accent": [(1112, 380), (1280, 380), (1280, 591), (1112, 591)],
        "remove": [[(760, 408), (808, 408), (808, 455), (760, 455)]],
        "lines": [((1140, 416), (1280, 502), 7), ((1100, 418), (1170, 485), 5)],    # loose wires
        "downlights": [(240, 105), (560, 150), (880, 115)],
        "pendant": None,
        "planter": None,
        "sconces": [(783, 432)],
        "shelf": None,
    },
}


# ---------------------------------------------------------------- helpers ----

def soft(mask, sigma):
    return cv2.GaussianBlur(mask.astype(np.float32), (0, 0), sigma)


def light_up(img, weight, gain):
    """Light falling on surfaces: brightens what is there, in warm light."""
    return np.clip(img * (1 + gain * weight[..., None] * WARM), 0, 255)


def bloom(img, weight, gain):
    """Glow in the air around a bright source: added light."""
    return np.clip(img + gain * 255 * weight[..., None] * WARM, 0, 255)


def blend(img, colour_img, alpha):
    a = alpha[..., None] if alpha.ndim == 2 else alpha
    return img * (1 - a) + colour_img * a


def accent_wall(img, zone, ceiling_region, curtain):
    """Repaint a wall in sage, keeping its light and shade."""
    m = mk.poly_mask(img.shape, zone) & ~ceiling_region
    if curtain:
        m &= ~mk.poly_mask(img.shape, curtain)
    L, A, B = mk.to_lab(img)
    a = soft(m, 1.2)
    # A mid-light paint: half the wall's own shading, half an even sage.
    Lp = 0.5 * L + 0.5 * 168
    painted = mk.from_lab(Lp, np.full_like(L, SAGE[0]), np.full_like(L, SAGE[1])).astype(np.float32)
    return blend(img.astype(np.float32), painted, a)


# ----------------------------------------------------------------- plants ----

def leaf(canvas, base, angle, size, colour, rng):
    """A pothos leaf: broad at the stalk, pointed at the tip, a lighter
    upper half and a darker midrib."""
    t = np.linspace(0, np.pi, 14)
    x = size * (1 - np.cos(t)) / 2
    y = size * 0.36 * np.sin(t) * (1 - 0.45 * (1 - np.cos(t)) / 2)
    pts = np.concatenate([np.stack([x, y], 1), np.stack([x[::-1], -y[::-1]], 1)])
    c, s = np.cos(angle), np.sin(angle)
    rot = pts @ np.array([[c, s], [-s, c]]) + base
    shade = rng.uniform(0.85, 1.12)
    col = tuple(float(np.clip(v * shade, 0, 255)) for v in colour)
    cv2.fillPoly(canvas, [rot.astype(np.int32)], col, cv2.LINE_AA)
    upper = np.concatenate([np.stack([x, y], 1), [[size, 0], [0, 0]]]) @ np.array([[c, s], [-s, c]]) + base
    cv2.fillPoly(canvas, [upper.astype(np.int32)], tuple(min(v * 1.18, 255) for v in col), cv2.LINE_AA)
    tip = base + size * 0.92 * np.array([c, s])
    cv2.line(canvas, tuple(base.astype(int)), tuple(tip.astype(int)), tuple(v * 0.7 for v in col), 1, cv2.LINE_AA)


def vine(canvas, start, length, sway, seed, leaf_size=8.0):
    """A trailing stem hanging under its own weight, leaves on both sides."""
    rng = np.random.default_rng(seed)
    s = np.linspace(0, 1, 60)
    phase = rng.uniform(0, 6.3)
    xs = start[0] + sway * s ** 1.3 + 4 * np.sin(6 * s + phase) * s
    ys = start[1] + length * s
    pts = np.stack([xs, ys], 1)
    cv2.polylines(canvas, [pts.astype(np.int32)], False, (40, 80, 45), 1, cv2.LINE_AA)
    green = (58, 122, 72)
    for k, i in enumerate(range(3, 60, 4)):
        side = 1 if k % 2 else -1
        d = pts[min(i + 1, 59)] - pts[i - 1]
        ang = np.arctan2(d[1], d[0]) + side * rng.uniform(0.7, 1.2)
        leaf(canvas, pts[i], ang, leaf_size * rng.uniform(0.8, 1.15) * (1 - 0.25 * s[i]), green, rng)


def pot(canvas, cx, top, w, h):
    """A terracotta pot, lit from the left."""
    pts = np.array([(cx - w / 2, top), (cx + w / 2, top), (cx + w * 0.38, top + h), (cx - w * 0.38, top + h)], np.int32)
    m = np.zeros(canvas.shape[:2], np.uint8)
    cv2.fillPoly(m, [pts], 1)
    xx = np.arange(canvas.shape[1], dtype=np.float32)[None, :]
    shade = (1.15 - 0.45 * np.clip((xx - (cx - w / 2)) / w, 0, 1))[..., None]
    col = np.array(TERRACOTTA, np.float32) * shade
    canvas[m > 0] = np.broadcast_to(col, canvas.shape)[m > 0]
    cv2.rectangle(canvas, (int(cx - w / 2 - 2), int(top - 5)), (int(cx + w / 2 + 2), int(top + 3)),
                  tuple(v * 1.1 for v in TERRACOTTA), -1, cv2.LINE_AA)


def hanging_planter(canvas, x, hook_y, pot_top, seed=1):
    """A macramé hanger from the beam: three cords to the pot's rim, a knotted
    band round the pot, and a money plant trailing from it."""
    pw, ph = 46, 34
    for dx in (-pw // 2, 0, pw // 2):
        cv2.line(canvas, (x, hook_y), (x + dx, pot_top + 2), CREAM, 1, cv2.LINE_AA)
    pot(canvas, x, pot_top, pw, ph)
    for k in range(-3, 4):                                      # the knotted band
        cv2.circle(canvas, (x + k * 6, pot_top + 15), 2, CREAM, -1, cv2.LINE_AA)
    cv2.line(canvas, (x - pw // 2 + 2, pot_top + 15), (x + pw // 2 - 2, pot_top + 15), CREAM, 1, cv2.LINE_AA)
    rng = np.random.default_rng(seed)
    for k in range(7):                                          # leaves over the rim
        leaf(canvas, np.array([x - 18 + 6 * k, pot_top - 1.0]), -np.pi / 2 + rng.uniform(-1.2, 1.2),
             11 * rng.uniform(0.8, 1.1), (58, 122, 72), rng)
    for k, (dx, ln, sw) in enumerate(((-20, 130, -20), (-9, 175, 6), (6, 105, 10), (19, 150, 24))):
        vine(canvas, (x + dx, pot_top + ph - 6), ln, sw, seed * 10 + k, leaf_size=10.0)


# ------------------------------------------------------------------ lamps ----

def pendant(canvas, x, hook_y, cord_end, w=92, h=50):
    """A rattan dome pendant: the cord from the beam, the woven shade."""
    cv2.line(canvas, (x, hook_y), (x, cord_end), (30, 30, 34), 2, cv2.LINE_AA)
    cy = cord_end + h
    m = np.zeros(canvas.shape[:2], np.uint8)
    cv2.ellipse(m, (x, cy), (w // 2, h), 0, 180, 360, 1, -1, cv2.LINE_AA)
    yy, xx = np.mgrid[0:canvas.shape[0], 0:canvas.shape[1]].astype(np.float32)
    across = np.clip((xx - x) / (w / 2), -1, 1)
    shade = 0.55 + 0.45 * np.sqrt(1 - across ** 2)                # rounder in the middle
    weave = (((xx + yy) % 7 < 1.3) | ((xx - yy) % 7 < 1.3)).astype(np.float32)
    base = np.array([95, 150, 196], np.float32)                   # rattan, BGR
    col = base[None, None] * (shade * (1 - 0.35 * weave))[..., None]
    canvas[m > 0] = col[m > 0]
    cv2.ellipse(canvas, (x, cy), (w // 2, 8), 0, 0, 360, (90, 140, 185), -1, cv2.LINE_AA)
    cv2.ellipse(canvas, (x, cy), (w // 2 - 6, 5), 0, 0, 360, (215, 240, 255), -1, cv2.LINE_AA)
    return m > 0, weave, (x, cy)


def sconce(canvas, x, y):
    """A brass wall sconce: a short open cylinder on a round back plate."""
    cv2.circle(canvas, (x, y + 4), 7, tuple(v * 0.8 for v in BRASS), -1, cv2.LINE_AA)
    xx = np.arange(-11, 12)
    for i, dx in enumerate(xx):
        k = 0.55 + 0.6 * np.exp(-((dx + 3) / 5.0) ** 2)            # a highlight left of centre
        cv2.line(canvas, (x + dx, y - 14), (x + dx, y + 14), tuple(min(v * k, 255) for v in BRASS), 1)
    cv2.ellipse(canvas, (x, y - 14), (11, 3), 0, 0, 360, (220, 245, 255), -1, cv2.LINE_AA)
    cv2.ellipse(canvas, (x, y + 14), (11, 3), 0, 0, 360, (220, 245, 255), -1, cv2.LINE_AA)


def shelf(canvas, p0, p1, seed=3):
    """A floating walnut shelf seen from below, with what stands on it."""
    (x0, y0), (x1, y1) = p0, p1
    front = np.array([(x0, y0), (x1, y1), (x1, y1 + 9), (x0, y0 + 9)], np.int32)
    under = np.array([(x0, y0 + 9), (x1, y1 + 9), (x1 - 6, y1 + 14), (x0 + 6, y0 + 14)], np.int32)
    # Its shadow on the wall first.
    sh = np.zeros(canvas.shape[:2], np.uint8)
    cv2.fillPoly(sh, [under + np.array([4, 10])], 1)
    canvas *= (1 - 0.45 * soft(sh, 7))[..., None]
    # Books, a pot with a pothos.
    rng = np.random.default_rng(seed)
    bx = x0 + 92
    for w, h, col in ((9, 34, (60, 80, 150)), (7, 30, CREAM), (10, 37, (95, 125, 110)), (8, 28, (50, 60, 70))):
        cv2.rectangle(canvas, (bx, y0 - h), (bx + w, y0), col, -1)
        cv2.line(canvas, (bx, y0 - h), (bx + w, y0 - h), tuple(min(v * 1.2, 255) for v in col), 1)
        bx += w + 1
    pot(canvas, x0 + 45, y0 - 26, 30, 26)
    for k in range(6):
        leaf(canvas, np.array([x0 + 34 + 4.5 * k, y0 - 28.0]), -np.pi / 2 + rng.uniform(-1.2, 1.2), 9, (58, 122, 72), rng)
    cv2.fillPoly(canvas, [front], tuple(v * 1.15 for v in WALNUT), cv2.LINE_AA)
    cv2.fillPoly(canvas, [under], tuple(v * 0.7 for v in WALNUT), cv2.LINE_AA)
    cv2.line(canvas, (x0, y0), (x1, y1), tuple(v * 1.6 for v in WALNUT), 1, cv2.LINE_AA)
    for k, (dx, ln, sw) in enumerate(((-12, 85, -8), (-3, 120, 4), (8, 70, 12))):
        vine(canvas, (x0 + 45 + dx, y0 + 4), ln, sw, seed * 10 + k, leaf_size=7.5)


# ---------------------------------------------------------------- one view ----

def design_view(name, lama):
    v, d = mk.VIEWS[name], DESIGN[name]
    src = cv2.imread(str(HERE / mk.PHOTOS[name]))
    # Clear the room, and take the bare bulbs down.
    m = mk.clutter(src, v["clutter"])
    for pts in v["remove"] + d["remove"]:
        m |= mk.poly_mask(src.shape, pts)
    lines = np.zeros(src.shape[:2], np.uint8)
    for p0, p1, t in v["lines"] + d.get("lines", []):
        cv2.line(lines, p0, p1, 1, t)
    img = lama.fill(src, m | (lines > 0))
    # The ply ceiling, the curtains, the sage wall.
    img, cover = mk.ceiling(img, v["ceiling"], v["beams"], v.get("fixtures", ()), "ply-trim", with_cover=True)
    region = mk.poly_mask(img.shape, v["ceiling"])
    if v["curtain"]:
        img = mk.curtain(img, v["curtain"])
    img = img.astype(np.float32)
    if d["accent"]:
        img = accent_wall(img.astype(np.uint8), d["accent"], region, v["curtain"])
    if v["frame"]:
        img = mk.hang_photo(img.astype(np.uint8), *v["frame"]).astype(np.float32)
    # The pieces.
    if d["shelf"]:
        shelf(img, *d["shelf"])
    if d["planter"]:
        hanging_planter(img, *d["planter"])
    shade = None
    if d["pendant"]:
        shade = pendant(img, *d["pendant"])
    for x, y in d["sconces"]:
        sconce(img, x, y)
    # Evening, and then the lights.
    img = mk.warm_grade(np.clip(img, 0, 255).astype(np.uint8)).astype(np.float32) * 0.92
    h, w = img.shape[:2]
    # The cove: LEDs hidden on the wall plates wash up the ply from its lower edge.
    below = np.zeros_like(region)
    below[:-22] = ~region[22:]
    edge = cover & below
    wash = soft(edge, 22)
    img = light_up(img, cover * wash / (wash.max() + 1e-6), 0.9)
    # Downlights: a bright disc in the ply, a halo, light spread around.
    for x, y in d["downlights"]:
        disc = np.zeros((h, w), np.uint8)
        cv2.ellipse(disc, (x, y), (9, 6), 0, 0, 360, 1, -1, cv2.LINE_AA)
        img = light_up(img, soft(disc, 40) * 6, 0.35)
        cv2.ellipse(img, (x, y), (10, 7), 0, 0, 360, (225, 232, 236), -1, cv2.LINE_AA)
        cv2.ellipse(img, (x, y), (7, 4), 0, 0, 360, (225, 248, 255), -1, cv2.LINE_AA)
        img = bloom(img, soft(disc, 5), 0.9)
    # Sconces: light up and down the wall, a scallop each way.
    for x, y in d["sconces"]:
        cone = np.zeros((h, w), np.uint8)
        cv2.fillPoly(cone, [np.array([(x - 9, y - 14), (x + 9, y - 14), (x + 45, y - 125), (x - 45, y - 125)], np.int32)], 1)
        cv2.fillPoly(cone, [np.array([(x - 9, y + 14), (x + 9, y + 14), (x + 40, y + 110), (x - 40, y + 110)], np.int32)], 1)
        img = light_up(img, soft(cone, 14), 0.9)
        dot = np.zeros((h, w), np.uint8)
        cv2.circle(dot, (x, y), 12, 1, -1)
        img = bloom(img, soft(dot, 10), 0.35)
    # The pendant: light through the weave, a pool on the wall and photo below.
    if shade:
        mask, weave, (x, cy) = shade
        pool = np.zeros((h, w), np.uint8)
        cv2.ellipse(pool, (x, cy + 120), (160, 120), 0, 0, 360, 1, -1)
        img = light_up(img, soft(pool, 50), 0.55)
        glints = mask & (weave < 0.5) & (np.random.default_rng(4).random((h, w)) < 0.12)
        glints &= np.mgrid[0:h, 0:w][0] > cy - 30
        img = bloom(img, soft(glints, 0.8) * 1.5, 0.6)
        under = np.zeros((h, w), np.uint8)
        cv2.ellipse(under, (x, cy), (40, 6), 0, 0, 360, 1, -1)
        img = bloom(img, soft(under, 6) * 1.6, 0.8)
        img = bloom(img, soft(under, 30) * 1.2, 0.25)
    return src, np.clip(img, 0, 255).astype(np.uint8)


# ------------------------------------------------------------------ board ----

def font(name, size, fallback):
    try:
        f = ImageFont.truetype(str(FONTS / name), size)
        if "[wght]" in name:
            try:
                f.set_variation_by_axes([fallback[1]])
            except OSError:
                pass
        return f
    except OSError:
        return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{fallback[0]}", int(size * 0.85))


def sharpen_up(img, width):
    """Enlarge a view for the board with Real-ESRGAN (general model)."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    big = sr.upscale(sess, img)
    return cv2.resize(big, (width, int(round(img.shape[0] * width / img.shape[1]))), interpolation=cv2.INTER_AREA)


def board(views, before):
    W, M = 2400, 60
    paper, ink, soft_ink = (232, 239, 244), (38, 44, 58), (95, 105, 120)   # BGR
    main = sharpen_up(views["room-main"], W - 2 * M)
    small_w = (W - 3 * M) // 2
    door, window = sharpen_up(views["room-door"], small_w), sharpen_up(views["room-window"], small_w)
    top = 250
    y_small = top + main.shape[0] + 40
    y_palette = y_small + door.shape[0] + 90
    H = y_palette + 1400
    canvas = np.full((H, W, 3), paper, np.uint8)
    canvas[top:top + main.shape[0], M:M + main.shape[1]] = main
    canvas[y_small:y_small + door.shape[0], M:M + small_w] = door
    canvas[y_small:y_small + window.shape[0], 2 * M + small_w:2 * M + small_w + small_w] = window
    pil = Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB))
    dr = ImageDraw.Draw(pil)
    rgb = lambda c: tuple(int(v) for v in c[::-1])
    title = font("CormorantGaramond[wght].ttf", 104, ("DejaVuSerif.ttf", 500))
    sub = font("Montserrat[wght].ttf", 30, ("DejaVuSans.ttf", 400))
    head = font("Montserrat[wght].ttf", 30, ("DejaVuSans-Bold.ttf", 600))
    body = font("Montserrat[wght].ttf", 27, ("DejaVuSans.ttf", 400))
    label = font("Montserrat[wght].ttf", 24, ("DejaVuSans.ttf", 500))
    dr.text((M, 60), "Warm Ply & Sage", font=title, fill=rgb(ink))
    dr.text((M + 4, 185), "BEDROOM DESIGN  ·  INCLINED PINE-PLY CEILING  ·  WALNUT BEAMS  ·  LAYERED WARM LIGHT",
            font=sub, fill=rgb(soft_ink))
    for x, y, t in ((M, y_small + door.shape[0] + 14, "Towards the door"),
                    (2 * M + small_w, y_small + window.shape[0] + 14, "Towards the window")):
        dr.text((x, y), t, font=label, fill=rgb(soft_ink))
    # Palette.
    swatches = [("Pine ply", (120, 175, 214)), ("Walnut", WALNUT), ("Sage", (130, 160, 140)),
                ("Off-white", (222, 232, 238)), ("Linen", (170, 200, 220)), ("Terracotta", TERRACOTTA),
                ("Brass", BRASS)]
    dr.text((M, y_palette), "PALETTE", font=head, fill=rgb(ink))
    sx, sw = M, 116
    for name, col in swatches:
        dr.rounded_rectangle((sx, y_palette + 55, sx + sw, y_palette + 55 + sw), 14, fill=rgb(col))
        dr.text((sx, y_palette + 55 + sw + 12), name, font=label, fill=rgb(soft_ink))
        sx += sw + 33
    # The room as it was, small, under the palette.
    yb = y_palette + 55 + sw + 80
    bw = 1010
    thumb = cv2.resize(before, (bw, int(before.shape[0] * bw / before.shape[1])), interpolation=cv2.INTER_AREA)
    dr.text((M, yb), "BEFORE", font=head, fill=rgb(ink))
    pil.paste(Image.fromarray(cv2.cvtColor(thumb, cv2.COLOR_BGR2RGB)), (M, yb + 50))
    bottom = yb + 50 + thumb.shape[0]
    # The pieces.
    col_x = [M + 1110, M + 1110 + 620]
    dr.text((col_x[0], y_palette), "WHAT GOES WHERE", font=head, fill=rgb(ink))
    items = [
        ("Ceiling", "6 mm pine ply under the rafters, sloping with the roof; walnut strips over the joints"),
        ("Beams", "cleaned, treated for termites, walnut stain and matt varnish"),
        ("Cove light", "warm LED strip hidden on the wall plates, washing up the ply"),
        ("Downlights", "slim 6 W round LEDs, 2700 K, set into the ply"),
        ("Pendant", "rattan dome over the framed photo"),
        ("Sconces", "brass up-and-down lights in place of the bare bulbs"),
        ("Walls", "warm white; sage green on the wall by the curtains"),
        ("Curtains", "plain linen in sand on a wooden rod"),
        ("Plants", "money plant in a macramé hanger; pothos on the shelf"),
        ("Shelf", "floating walnut shelf under the jali vent"),
        ("Photo", "the restored six friends in a walnut frame"),
    ]
    half = (len(items) + 1) // 2
    for col, chunk in enumerate((items[:half], items[half:])):
        x, yy = col_x[col], y_palette + 56
        for k, t in chunk:
            dr.text((x, yy), k.upper(), font=label, fill=rgb(ink))
            words, line, lines = t.split(), "", []
            for wd in words:
                if dr.textlength((line + " " + wd).strip(), font=body) > 560:
                    lines.append(line)
                    line = wd
                else:
                    line = (line + " " + wd).strip()
            lines.append(line)
            for j, ln in enumerate(lines):
                dr.text((x, yy + 32 + j * 34), ln, font=body, fill=rgb(soft_ink))
            yy += 32 + 34 * len(lines) + 24
        bottom = max(bottom, yy)
    out = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    return out[:bottom + 60]


def main():
    lama = Lama()
    views, befores = {}, {}
    for name in DESIGN:
        src, img = design_view(name, lama)
        views[name], befores[name] = img, src
        cv2.imwrite(str(HERE / f"{name}-design.jpg"), img, [cv2.IMWRITE_JPEG_QUALITY, 92])
        cv2.imwrite(str(HERE / f"{name}-design-before-after.jpg"), mk.side_by_side(src, img),
                    [cv2.IMWRITE_JPEG_QUALITY, 88])
        print(f"wrote {name}-design.jpg")
    cv2.imwrite(str(BOARD), board(views, befores["room-main"]), [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(f"wrote {BOARD.name}")


if __name__ == "__main__":
    main()
