"""Colour schemes for the relief boundary wall and gate, painted into the photo.

The wall is bare cement with a relief of arcs and steps. Each scheme paints
it the way a painter would, by zone:

  field    the main relief panel, where the arcs are
  frame    the raised border round each panel, its top band and the plinth
  grooves  the cut lines of the relief, picked out in a contrasting colour
           so the whole motif reads from the road
  pillars  the two gate pillars and the end pillar
  canopy   the gate canopy: its diamond-tiled top and its scalloped valance

Each panel is flat, so it is rectified to a straight-on rectangle, where its
zones are rectangles and its grooves are found as thin dark lines (a
black-hat of the flattened brightness); both are warped back to the photo.

Paint is applied in linear light as paint colour x the cement's own shading
(its brightness over that of sunlit cement), so the relief, the sun and the
tree's dappled shadows stay exactly as they are. Plants, flowers, the fence
sticks and the gate are left untouched: only near-neutral cement is painted.

    pip install numpy opencv-python-headless pillow
    python3 media/wall-colours/wall_colours.py [fonts_dir]
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "wall-before.jpg"
FONTS = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "fonts"

# Panels: corners in the photo, the size of their straight-on view, and their
# zones in that view (x0, y0, x1, y1).
PANELS = {
    "right": dict(quad=[(948, 364), (1452, 322), (1468, 742), (962, 768)], size=(1000, 800),
                  field=(36, 160, 964, 614), frame_in=34),
    "left": dict(quad=[(102, 424), (424, 404), (446, 786), (128, 796)], size=(640, 760),
                 field=(34, 150, 606, 592), frame_in=32),
}
PILLARS = [
    [(425, 350), (505, 350), (532, 792), (448, 794)],
    [(878, 322), (946, 320), (962, 772), (902, 776)],
    [(1446, 318), (1535, 318), (1540, 748), (1456, 748)],
]
CANOPY_TOP = [(390, 320), (418, 268), (935, 226), (947, 240), (946, 286), (400, 314)]
CANOPY_VALANCE = [(386, 314), (946, 284), (948, 330), (396, 354)]

SCHEMES = [
    dict(key="sky-white", name="Sky Blue & White", note="matches the house: calm and unified",
         field="#F2EFE6", frame="#5B9BD5", grooves="#3F7DBB", pillars="#F2EFE6", top="#C9473E",
         valance="#F2EFE6"),
    dict(key="cream-maroon", name="Cream & Maroon", note="warm and elegant, matches the gate",
         field="#EFDFBE", frame="#7B2E2A", grooves="#7B2E2A", pillars="#EFDFBE", top="#7B2E2A",
         valance="#EFDFBE"),
    dict(key="sand-terracotta", name="Sand & Terracotta", note="earthy, warm against the blue house",
         field="#E3CCA2", frame="#B5573C", grooves="#B5573C", pillars="#B5573C", top="#B5573C",
         valance="#E3CCA2"),
    dict(key="grey-green", name="Stone Grey & Leaf Green", note="modern, picks up the green trims",
         field="#D8D8D2", frame="#3F7D4E", grooves="#3F7D4E", pillars="#D8D8D2", top="#3F7D4E",
         valance="#D8D8D2"),
    dict(key="blue-gold", name="Royal Blue & Gold", note="rich and festive",
         field="#2F5E9C", frame="#F1E6CC", grooves="#C9A040", pillars="#F1E6CC", top="#B98A2E",
         valance="#F1E6CC"),
]


def lin(hexstr):
    """sRGB hex to linear BGR."""
    h = hexstr.lstrip("#")
    c = np.array([int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16)], np.float32) / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_lin(img):
    c = img.astype(np.float32) / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(c):
    c = np.clip(c, 0, 1)
    return (np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055) * 255 + 0.5).astype(np.uint8)


def poly(shape, pts):
    m = np.zeros(shape[:2], np.uint8)
    cv2.fillPoly(m, [np.array(pts, np.int32)], 1, cv2.LINE_AA)
    return m.astype(np.float32)


def soft_clip(x, knee=0.85):
    """Compress highlights instead of clipping them."""
    over = np.maximum(x - knee, 0)
    return np.minimum(x, knee) + (1 - knee) * (1 - np.exp(-over / (1 - knee)))


class Wall:
    def __init__(self, img):
        self.img = img
        h, w = img.shape[:2]
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
        L, A, B = lab[..., 0], lab[..., 1] - 128, lab[..., 2] - 128
        chroma = np.hypot(A, B)
        # Only cement takes paint: grey or the warmer fresh cement of the
        # pillars, but not leaves (green), the white flowers or anything
        # strongly coloured.
        cement = np.clip((30 - chroma) / 6, 0, 1) * np.clip((A + 4) / 3, 0, 1) * np.clip((A - B + 30) / 6, 0, 1) * np.clip((L - 20) / 10, 0, 1) \
            * np.clip((238 - L) / 8, 0, 1)
        self.cement = cv2.GaussianBlur(cement.astype(np.float32), (0, 0), 0.8)
        self.Y = cv2.cvtColor(to_lin(img), cv2.COLOR_BGR2GRAY)
        self.zones = {k: np.zeros((h, w), np.float32) for k in ("field", "frame", "grooves", "pillars", "top", "valance")}
        for p in PANELS.values():
            self.add_panel(p)
        for q in PILLARS:
            self.zones["pillars"] = np.maximum(self.zones["pillars"], poly(img.shape, q))
        self.zones["top"] = poly(img.shape, CANOPY_TOP)
        self.zones["valance"] = poly(img.shape, CANOPY_VALANCE)
        # Grooves on the canopy too: the diamond lines and the scallops.
        canopy = np.maximum(self.zones["top"], self.zones["valance"])
        g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
        bh = cv2.morphologyEx(g, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        cg = np.clip((bh / (cv2.GaussianBlur(g, (0, 0), 10) + 1) - 0.07) / 0.06, 0, 1) * canopy
        self.zones["grooves"] = np.maximum(self.zones["grooves"], cv2.GaussianBlur(cg, (0, 0), 0.7))
        # Pillars sit in front of the panels' ends; the canopy over the pillars.
        for k in ("field", "frame", "grooves"):
            self.zones[k] *= 1 - self.zones["pillars"]
        self.zones["pillars"] *= 1 - canopy
        self.paintable = np.clip(sum(self.zones[k] for k in ("field", "frame", "pillars", "top", "valance")), 0, 1)
        # Shading: brightness over that of sunlit cement, per element, with
        # the cement's own blotches calmed a little (paint is more even).
        ref = np.percentile(self.Y[(self.paintable > 0.5) & (self.cement > 0.5)], 88)
        broad = cv2.GaussianBlur(self.Y, (0, 0), 6)
        fine = self.Y / (broad + 1e-4)
        self.shade = (broad / ref) * fine ** 0.85

    def add_panel(self, p):
        h, w = self.img.shape[:2]
        pw, ph = p["size"]
        dst = np.float32([(0, 0), (pw, 0), (pw, ph), (0, ph)])
        Hm = cv2.getPerspectiveTransform(np.float32(p["quad"]), dst)
        Hinv = np.linalg.inv(Hm)
        field = np.zeros((ph, pw), np.float32)
        x0, y0, x1, y1 = p["field"]
        field[y0:y1, x0:x1] = 1
        whole = np.ones((ph, pw), np.float32)
        frame = whole - field
        # Grooves: thin dark lines in the flattened panel.
        rect = cv2.warpPerspective(self.img, Hm, (pw, ph), flags=cv2.INTER_LINEAR)
        g = cv2.cvtColor(rect, cv2.COLOR_BGR2GRAY).astype(np.float32)
        flat = g / (cv2.GaussianBlur(g, (0, 0), 12) + 1)
        bh = cv2.morphologyEx(flat, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
        grooves = np.clip((bh - 0.07) / 0.06, 0, 1)
        n, lab, st, _ = cv2.connectedComponentsWithStats((grooves > 0.3).astype(np.uint8), 8)
        keep = np.isin(lab, [i for i in range(1, n) if max(st[i, 2], st[i, 3]) > 40])   # lines, not specks
        grooves = cv2.GaussianBlur(grooves * keep, (0, 0), 0.8)
        for name, m in (("field", field), ("frame", frame), ("grooves", grooves)):
            back = cv2.warpPerspective(m, Hinv, (w, h), flags=cv2.INTER_LINEAR)
            self.zones[name] = np.maximum(self.zones[name], back)

    def paint(self, scheme):
        base = to_lin(self.img)
        out = base.copy()
        for zone in ("field", "frame", "pillars", "top", "valance", "grooves"):
            a = (self.zones[zone] * self.cement)[..., None]
            if zone == "grooves":
                a = a * 0.85
            col = lin(scheme[zone]) * self.shade[..., None] * 0.94
            out = out * (1 - a) + soft_clip(col) * a
        return to_srgb(out)


def font(name, size, fallback="DejaVuSans.ttf"):
    try:
        f = ImageFont.truetype(str(FONTS / name), size, layout_engine=ImageFont.Layout.RAQM)
        try:
            f.set_variation_by_axes([600])
        except OSError:
            pass
        return f
    except OSError:
        return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{fallback}", size)


def label(img, title, sub, swatches):
    """The image with its scheme's name and paint swatches along the bottom."""
    h, w = img.shape[:2]
    bar = 150
    canvas = Image.new("RGB", (w, h + bar), (246, 241, 232))
    canvas.paste(Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)), (0, 0))
    d = ImageDraw.Draw(canvas)
    d.text((40, h + 22), title, font=font("CormorantGaramond[wght].ttf", 58, "DejaVuSerif.ttf"), fill=(50, 40, 40))
    d.text((42, h + 96), sub, font=font("Montserrat[wght].ttf", 28), fill=(110, 100, 100))
    x = w - 40
    for name, hexstr in reversed(swatches):
        sw = 92
        x -= sw
        rgb = tuple(int(hexstr.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4))
        d.rounded_rectangle((x, h + 22, x + sw, h + 22 + 70), 10, fill=rgb, outline=(200, 190, 180))
        f = font("Montserrat[wght].ttf", 20)
        d.text((x + sw / 2 - d.textlength(name, font=f) / 2, h + 100), name, font=f, fill=(110, 100, 100))
        x -= 18
    return cv2.cvtColor(np.array(canvas), cv2.COLOR_RGB2BGR)


def main():
    img = cv2.imread(str(SOURCE))
    wall = Wall(img)
    tiles = [label(img, "As it is", "bare cement", [])]
    for s in SCHEMES:
        out = wall.paint(s)
        sw = [("Panel", s["field"]), ("Frame", s["frame"]), ("Lines", s["grooves"]), ("Pillars", s["pillars"]),
              ("Canopy", s["top"])]
        lab = label(out, s["name"], s["note"], sw)
        cv2.imwrite(str(HERE / f"wall-{s['key']}.jpg"), lab, [cv2.IMWRITE_JPEG_QUALITY, 92])
        tiles.append(lab)
        print(f"wrote wall-{s['key']}.jpg")
    # All six on one board, two across.
    small = [cv2.resize(t, (t.shape[1] // 2, t.shape[0] // 2), interpolation=cv2.INTER_AREA) for t in tiles]
    gap = 16
    rows = []
    for i in range(0, len(small), 2):
        row = [small[i], np.full((small[i].shape[0], gap, 3), 255, np.uint8), small[i + 1]]
        rows.append(np.hstack(row))
        rows.append(np.full((gap, rows[-1].shape[1], 3), 255, np.uint8))
    cv2.imwrite(str(HERE / "wall-colour-options.jpg"), np.vstack(rows[:-1]), [cv2.IMWRITE_JPEG_QUALITY, 90])
    print("wrote wall-colour-options.jpg")


if __name__ == "__main__":
    main()
