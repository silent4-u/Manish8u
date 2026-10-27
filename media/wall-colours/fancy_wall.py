"""The relief wall made fancy, in the house's own colours.

Beyond paint, each design gives the wall the finishes a fancy boundary wall
has, all matched to the house (sky-blue walls, green ledges, red roof and
skirting, maroon gate):

  frame    the house's sky blue, with an ivory coping along the top and a
           plinth in the house's red skirting colour along the bottom
  strips   the recessed strip above and below each relief, laid with
           patterned encaustic tiles and edged with a gold border line
  relief   the arcs and steps in the scheme's colours (motif_colours.py
           traces them), every groove picked out in metallic gold
  pillars  clad in stacked natural stone, with an ivory cap and gold line
           under the canopy and a red base like the wall's plinth
  canopy   its diamond tiles in the scheme's roof colour, its scalloped
           valance ivory, their lines gold

Tiles and stone are drawn straight on (each panel's and each pillar's own
rectangle) and warped into the photo. Everything is laid in linear light as
material colour x the photo's own shading, so the sun, the relief and the
tree's dappled shadows stay exactly as they are; plants, flowers and the gate
stay in front, untouched.

    python3 media/wall-colours/fancy_wall.py [fonts_dir]
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import motif_colours as mc  # noqa: E402
import wall_colours as wc  # noqa: E402

HOUSE_BLUE = mc.HOUSE_BLUE
IVORY = mc.IVORY
ROOF_RED = mc.ROOF_RED
HOUSE_RED = "#B23A35"
LEAF_GREEN = "#3F7D4E"
MAROON = "#7B2E2A"
GOLD = "#D4A23A"

# Each panel's straight-on view (wall_colours.PANELS): its two recessed
# strips (x0, y0, x1, y1), the rows of its rounded coping, and where its
# plinth (the frame below the lower strip) begins.
STRIPS = {"right": [(34, 40, 956, 156), (48, 640, 962, 745)],
          "left": [(33, 33, 610, 141), (43, 606, 619, 713)]}
COPING = {"right": 18, "left": 11}
PLINTH = {"right": 748, "left": 716}

STONES = {
    "sandstone": ["#D8C3A0", "#C9AE86", "#B8916A", "#A9784F", "#CDBBA0", "#BFA582", "#9E8B76"],
    "slate": ["#8E8F8C", "#7C7F80", "#9A958C", "#6F7275", "#A6A29A", "#857B70", "#5F6466"],
    "travertine": ["#EADBC0", "#E2CDAA", "#D8C09B", "#EFE3CC", "#D3B88F", "#E6D3B2", "#CDB590"],
}

SCHEMES = [
    dict(key="sky-gold", name="Sky & Gold", note="the house's own blue with ivory, deep blue and gold",
         motif=dict(bg=IVORY, band1=GOLD, band2="#3E86C6", band3="#1F4E8C", thin=GOLD,
                    step1="#BFDDF2", step2="#7FB3E0", step3="#3E86C6", block="#1F4E8C"),
         tiles=dict(bg=IVORY, corner="#1F4E8C", star="#5B9BD5", centre=GOLD),
         stone="sandstone", roof=ROOF_RED),
    dict(key="garden", name="Garden", note="house blue with the ledges' green and the roof's red",
         motif=dict(bg=IVORY, band1=GOLD, band2=LEAF_GREEN, band3=ROOF_RED, thin=GOLD,
                    step1="#CFE3C8", step2="#86B77F", step3=LEAF_GREEN, block=ROOF_RED),
         tiles=dict(bg=IVORY, corner=LEAF_GREEN, star=ROOF_RED, centre=GOLD),
         stone="slate", roof=LEAF_GREEN),
    dict(key="royal", name="Royal", note="house blue with the gate's maroon, ivory and gold",
         motif=dict(bg=IVORY, band1=GOLD, band2=MAROON, band3="#1F4E8C", thin=GOLD,
                    step1="#EBD9A6", step2="#D4A23A", step3="#9C7424", block=MAROON),
         tiles=dict(bg=MAROON, corner=GOLD, star=IVORY, centre=GOLD),
         stone="travertine", roof=MAROON),
]


def rgb(hexstr):
    h = hexstr.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lin_rgb_image(rgb_img):
    """An RGB uint8 drawing to linear BGR."""
    return wc.to_lin(cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR))


def tile_strip(w, h, t, ss=4):
    """A row of encaustic tiles filling w x h: quarter circles in the corners
    (so neighbouring tiles join into circles), an eight-point star with a
    gold centre, fine grout joints, and a gold border line round the strip."""
    W, H = w * ss, h * ss
    pad = int(0.09 * H)                                   # the gold border and a margin inside it
    n = max(1, round((W - 2 * pad) / (H - 2 * pad)))
    s = (W - 2 * pad) / n
    im = Image.new("RGB", (W, H), rgb(t["bg"]))
    d = ImageDraw.Draw(im)
    top, bot = pad, H - pad
    th = bot - top
    for i in range(n):
        x0 = pad + i * s
        cx, cy = x0 + s / 2, top + th / 2
        r = 0.36 * min(s, th)
        for (qx, qy) in ((x0, top), (x0 + s, top), (x0, bot), (x0 + s, bot)):
            d.ellipse((qx - r, qy - r, qx + r, qy + r), fill=rgb(t["corner"]))
        a = 0.31 * min(s, th)
        for rot in (0, np.pi / 4):
            pts = [(cx + a * np.cos(rot + k * np.pi / 2), cy + a * np.sin(rot + k * np.pi / 2)) for k in range(4)]
            d.polygon(pts, fill=rgb(t["star"]))
        rc = 0.1 * min(s, th)
        d.ellipse((cx - rc, cy - rc, cx + rc, cy + rc), fill=rgb(t["centre"]))
    # The corner circles stop at the strip's edge: clear what lies beyond it.
    d.rectangle((0, 0, W, top), fill=rgb(GOLD))
    d.rectangle((0, bot, W, H), fill=rgb(GOLD))
    d.rectangle((0, 0, pad, H), fill=rgb(GOLD))
    d.rectangle((W - pad, 0, W, H), fill=rgb(GOLD))
    g = max(2, ss)                                        # grout
    for i in range(n + 1):
        x = pad + i * s
        d.rectangle((x - g / 2, top, x + g / 2, bot), fill=(214, 208, 196))
    d.rectangle((pad - g, top - g, W - pad + g, top), fill=(214, 208, 196))
    d.rectangle((pad - g, bot, W - pad + g, bot + g), fill=(214, 208, 196))
    small = np.array(im.resize((w, h), Image.LANCZOS))
    return lin_rgb_image(small)


def stacked_stone(w, h, palette, rng, ss=3):
    """Ledgestone cladding: courses of thin split stones of random height and
    length, each its own shade and rough grain, set close with deep joints.
    Each stone stands out a little from the wall: lit along its top edge,
    darker along its lower one, and casting a thin shadow onto the course
    below, as in sun from above."""
    W, H = w * ss, h * ss
    unit = W / 8.0
    alb = np.zeros((H, W, 3), np.float32)
    proud = np.zeros((H, W), np.float32)                  # how far each stone stands out
    ids = np.zeros((H, W), np.int32)
    joint = max(2, int(0.07 * unit))
    cols = [np.array(wc.lin(c), np.float32) for c in palette]
    y, k = 0, 0
    while y < H:
        ch = int(rng.uniform(0.45, 1.15) * unit)
        x = -int(rng.uniform(0, 4) * unit)
        while x < W:
            L = int(rng.uniform(1.6, 6.5) * unit)
            k += 1
            c = cols[rng.integers(len(cols))] * rng.uniform(0.92, 1.08)
            y0, y1 = y + joint // 2, min(H, y + ch - joint // 2)
            x0, x1 = max(0, x + joint // 2), min(W, x + L - joint // 2)
            if x1 > x0 and y1 > y0:
                # Split stone: its face tilts a little, so it is lighter at one end.
                ramp = np.linspace(rng.uniform(0.9, 1.0), rng.uniform(1.0, 1.1), x1 - x0, dtype=np.float32)
                alb[y0:y1, x0:x1] = c * ramp[None, :, None]
                proud[y0:y1, x0:x1] = rng.uniform(0.5, 1.0)
                ids[y0:y1, x0:x1] = k
            x += L
        y += ch
    solid = proud > 0
    # Rough grain, finer and coarser, and fine streaks along the bedding.
    grain = np.zeros((H, W), np.float32)
    for sig, amp in ((0.8, 0.07), (2.5, 0.07), (7.0, 0.05)):
        grain += cv2.GaussianBlur(rng.standard_normal((H, W)).astype(np.float32), (0, 0), sig) * amp * sig ** 0.5
    streak = cv2.GaussianBlur(rng.standard_normal((H, W)).astype(np.float32), (0, 0), sigmaX=10, sigmaY=0.7) * 0.15
    tex = np.clip(1 + grain + streak, 0.55, 1.45)
    # Each stone's edges are broken back a little: its face rounds off to them.
    edge = cv2.distanceTransform(solid.astype(np.uint8), cv2.DIST_L2, 3)
    height = proud * np.clip(edge / (0.12 * unit), 0, 1) ** 0.6
    height = cv2.GaussianBlur(height, (0, 0), 0.8)
    dy = cv2.Sobel(height, cv2.CV_32F, 0, 1, ksize=3) / 4
    lit = np.clip(1 + 2.2 * dy * unit / 10, 0.55, 1.35)  # faces turned up catch the sun
    # The shadow each stone casts down onto the one below.
    drop = max(2, int(0.1 * unit))
    above = np.zeros_like(height)
    above[drop:] = height[:-drop]
    shadow = np.where((above > height + 0.15) & (ids != np.roll(ids, drop, axis=0)), 0.6, 1.0).astype(np.float32)
    shadow = cv2.GaussianBlur(shadow, (0, 0), 1.0)
    out = alb * (tex * lit * shadow)[..., None]
    out[~solid] = np.array(wc.lin("#3A3530"), np.float32) * 0.5
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_AREA)


def quad_rect(quad):
    """A quad's straight-on size, and the homography from that rectangle to it."""
    q = np.float32(quad)
    w = int(round((np.linalg.norm(q[1] - q[0]) + np.linalg.norm(q[2] - q[3])) / 2))
    h = int(round((np.linalg.norm(q[3] - q[0]) + np.linalg.norm(q[2] - q[1])) / 2))
    to_photo = cv2.getPerspectiveTransform(np.float32([(0, 0), (w, 0), (w, h), (0, h)]), q)
    return w, h, to_photo


class Fancy:
    def __init__(self, img):
        self.img = img
        h, w = img.shape[:2]
        self.size = (w, h)
        self.wall = wc.Wall(img)
        self.motif = {k: np.zeros((h, w), np.float32) for k in
                      ("bg", "band1", "band2", "band3", "thin", "step1", "step2", "step3", "block", "grooves")}
        for name in mc.MOTIF:
            roles, Hinv = mc.panel_roles(img, name)
            for k, m in roles.items():
                self.motif[k] = np.maximum(self.motif[k], self.warp(m, Hinv))
        self.not_pillar = 1 - self.wall.zones["pillars"]
        # Coping, plinth and the strips, per panel.
        self.coping = np.zeros((h, w), np.float32)
        self.plinth = np.zeros((h, w), np.float32)
        self.strips = []                                  # (panel to photo, rectangle, mask in the photo)
        for name, p in wc.PANELS.items():
            pw, ph = p["size"]
            Hinv = np.linalg.inv(cv2.getPerspectiveTransform(np.float32(p["quad"]),
                                                             np.float32([(0, 0), (pw, 0), (pw, ph), (0, ph)])))
            m = np.zeros((ph, pw), np.float32)
            m[:COPING[name]] = 1
            self.coping = np.maximum(self.coping, self.warp(m, Hinv))
            m = np.zeros((ph, pw), np.float32)
            m[PLINTH[name]:] = 1
            self.plinth = np.maximum(self.plinth, self.warp(m, Hinv))
            for (x0, y0, x1, y1) in STRIPS[name]:
                m = np.zeros((ph, pw), np.float32)
                m[y0:y1, x0:x1] = 1
                self.strips.append((Hinv, (x0, y0, x1, y1), self.warp(m, Hinv)))
        # The pillars' own rectangles.
        self.pillars = [quad_rect(q) for q in wc.PILLARS]
        canopy = np.maximum(self.wall.zones["top"], self.wall.zones["valance"])
        self.under_canopy = 1 - canopy
        # Shading for the textured finishes: the light (sun, the tree's
        # shadows, the relief), with only a trace of the cement's own grain.
        Y = self.wall.Y
        ref = np.percentile(Y[(self.wall.paintable > 0.5) & (self.wall.cement > 0.5)], 88)
        broad = cv2.GaussianBlur(Y, (0, 0), 2.0)
        self.light = (broad / ref) * (Y / (broad + 1e-4)) ** 0.3

    def warp(self, m, to_photo):
        return cv2.warpPerspective(m, to_photo, self.size, flags=cv2.INTER_LINEAR)

    def render(self, s):
        wall = self.wall
        out = wc.to_lin(self.img)
        cement = wall.cement
        shade = wall.shade[..., None]
        light = self.light[..., None]

        def paint(mask, hexstr, strength=1.0):
            nonlocal out
            a = (mask * cement)[..., None] * strength
            out = out * (1 - a) + wc.soft_clip(wc.lin(hexstr) * shade * 0.94) * a

        def lay(mask, albedo, strength=1.0):
            nonlocal out
            a = (mask * cement)[..., None] * strength
            out = out * (1 - a) + wc.soft_clip(albedo * light * 0.94) * a

        def gold(mask, strength=0.9):
            """Metallic gold: deeper in the shade and brighter in the light
            than flat paint, so it gleams."""
            nonlocal out
            a = (mask * cement)[..., None] * strength
            g = np.array(wc.lin(GOLD), np.float32) * 1.08 * np.clip(shade, 0, 2) ** 1.6
            out = out * (1 - a) + wc.soft_clip(g) * a

        panels = (wall.zones["field"] + wall.zones["frame"]) * self.not_pillar
        paint(panels, HOUSE_BLUE)
        paint(self.coping * self.not_pillar, IVORY)
        paint(self.plinth * self.not_pillar, HOUSE_RED)
        for role, col in s["motif"].items():
            paint(self.motif[role] * self.not_pillar, col)
        gold(self.motif["grooves"] * self.not_pillar, 0.85)
        # The tiled strips.
        for Hinv, (x0, y0, x1, y1), mask in self.strips:
            sw, sh = x1 - x0, y1 - y0
            place = Hinv @ np.array([[1, 0, x0], [0, 1, y0], [0, 0, 1]], np.float64)
            albedo = self.warp(tile_strip(sw, sh, s["tiles"]), place)
            cover = self.warp(np.ones((sh, sw), np.float32), place)
            lay(mask * cover * self.not_pillar, albedo)
        # The pillars: stone between an ivory cap (with a gold line) and a red base.
        rng = np.random.default_rng(7)
        for (pw, ph, to_photo) in self.pillars:
            alb = stacked_stone(pw, ph, STONES[s["stone"]], rng)
            cap, line, base = int(0.06 * ph), max(2, int(0.012 * ph)), int(0.075 * ph)
            alb[:cap] = wc.lin(IVORY)
            alb[cap:cap + line] = wc.lin(GOLD)
            alb[ph - base:] = wc.lin(HOUSE_RED)
            alb[ph - base - line:ph - base] = wc.lin(IVORY)
            albedo = self.warp(alb, to_photo)
            cover = self.warp(np.ones((ph, pw), np.float32), to_photo)
            lay(wall.zones["pillars"] * cover * self.under_canopy, albedo)
        # The canopy: one solid coat (nothing stands in front of it, and its
        # rough, blotchy cement would otherwise take the paint in patches),
        # the diamond tiles' lines ivory, the scallops gold.
        top, valance = wall.zones["top"], wall.zones["valance"]
        for zone, col in ((top, s["roof"]), (valance, IVORY)):
            a = (zone * np.clip(1.6 * cement + 0.3, 0, 1))[..., None]
            out = out * (1 - a) + wc.soft_clip(wc.lin(col) * shade * 0.94) * a
        paint(wall.zones["grooves"] * top, IVORY, 0.55)
        gold(wall.zones["grooves"] * valance, 0.75)
        return wc.to_srgb(out)


def main():
    img = cv2.imread(str(wc.SOURCE))
    fancy = Fancy(img)
    tiles = [wc.label(img, "As it is", "bare cement", [])]
    for s in SCHEMES:
        out = fancy.render(s)
        stone = "#" + "".join(f"{v:02X}" for v in np.mean([rgb(c) for c in STONES[s["stone"]]], 0).astype(int))
        sw = [("Wall", HOUSE_BLUE), ("Relief", s["motif"]["band2"]), ("Relief", s["motif"]["band3"]),
              ("Tiles", s["tiles"]["corner"]), ("Stone", stone), ("Lines", GOLD)]
        lab = wc.label(out, s["name"], s["note"], sw)
        cv2.imwrite(str(HERE / f"fancy-{s['key']}.jpg"), lab, [cv2.IMWRITE_JPEG_QUALITY, 92])
        tiles.append(lab)
        print(f"wrote fancy-{s['key']}.jpg")
    small = [cv2.resize(t, (t.shape[1] // 2, t.shape[0] // 2), interpolation=cv2.INTER_AREA) for t in tiles]
    gap = 16
    row = lambda a, b: np.hstack([a, np.full((a.shape[0], gap, 3), 255, np.uint8), b])
    top, bottom = row(small[0], small[1]), row(small[2], small[3])
    sheet = np.vstack([top, np.full((gap, top.shape[1], 3), 255, np.uint8), bottom])
    cv2.imwrite(str(HERE / "fancy-wall-options.jpg"), sheet, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print("wrote fancy-wall-options.jpg")


if __name__ == "__main__":
    main()
