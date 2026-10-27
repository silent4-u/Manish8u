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

Sky & Gold Deluxe adds gold-edged tiles, a gold stencil of interlocking
circles on the relief's ivory, blue glass mosaic with gold flecks in its outer
arcs and corner pieces, gold lines under the coping and over the plinth, the
gate in deep blue with its border, words, emblem and spear tips gilded, and a
brass lantern on each gate pillar.

Tiles, stone, stencil and mosaic are drawn straight on (each panel's and each
pillar's own rectangle) and warped into the photo. Everything is laid in linear light as
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
# Sky & Gold made richer still: gold-edged tiles, a gold stencil on the
# relief's ivory, blue and gold glass mosaic in its outer arcs and corner
# pieces, gold lines under the coping and over the plinth, the gate in deep
# blue with its details gilded, and a brass lantern on each gate pillar.
DELUXE = dict(SCHEMES[0], key="sky-gold-deluxe", name="Sky & Gold Deluxe",
              note="mosaic, stencil, gilded gate and lanterns",
              tiles=dict(SCHEMES[0]["tiles"], outline=GOLD), stencil=True, lines=True, gate="#1F4E8C",
              lanterns=True, mosaic=dict(roles=("band3", "block"),
                                         colours=["#1F4E8C", "#2A5F9E", "#3E86C6", "#5B9BD5", GOLD],
                                         weights=[4, 3, 2.5, 1.5, 0.5]))


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
    line = t.get("outline")                               # richer tiles: every shape edged in gold
    lw = int(0.025 * th) + 1
    for i in range(n):
        x0 = pad + i * s
        cx, cy = x0 + s / 2, top + th / 2
        r = 0.36 * min(s, th)
        for (qx, qy) in ((x0, top), (x0 + s, top), (x0, bot), (x0 + s, bot)):
            d.ellipse((qx - r, qy - r, qx + r, qy + r), fill=rgb(t["corner"]),
                      outline=rgb(line) if line else None, width=lw)
            if line:
                ri = 0.6 * r
                d.ellipse((qx - ri, qy - ri, qx + ri, qy + ri), outline=rgb(line), width=lw)
        a = 0.31 * min(s, th)
        if line:
            ring = 0.42 * min(s, th)
            d.ellipse((cx - ring, cy - ring, cx + ring, cy + ring), outline=rgb(t["corner"]), width=lw)
        for rot in (0, np.pi / 4):
            pts = [(cx + a * np.cos(rot + k * np.pi / 2), cy + a * np.sin(rot + k * np.pi / 2)) for k in range(4)]
            d.polygon(pts, fill=rgb(t["star"]))
        if line:
            # The star's outline: its points, and the notches between them
            # where the two squares cross.
            notch = a * np.cos(np.pi / 4) / np.cos(np.pi / 8)
            star = [(cx + (a if k % 2 == 0 else notch) * np.cos(k * np.pi / 8),
                     cy + (a if k % 2 == 0 else notch) * np.sin(k * np.pi / 8)) for k in range(16)]
            d.polygon(star, outline=rgb(line), width=lw)
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


def stencil(w, h, period, ss=4):
    """A stencilled pattern for plain painted pieces: interlocking circles
    (each through its neighbours' centres), as fine lines, 0..1."""
    W, H, p = w * ss, h * ss, period * ss
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    lw = max(1, int(0.06 * p))
    for row, y in enumerate(np.arange(-p, H + p, p * np.sqrt(3) / 2)):
        for x in np.arange(-p + (p / 2 if row % 2 else 0), W + p, p):
            d.ellipse((x - p, y - p, x + p, y + p), outline=255, width=lw)
    return np.array(im.resize((w, h), Image.LANCZOS), np.float32) / 255


def mosaic(w, h, cell, colours, weights, rng, ss=3):
    """Glass mosaic: small square tesserae in a few colours, each a little
    lighter or darker, set in pale grout."""
    W, H, c = w * ss, h * ss, cell * ss
    cols = [np.array(wc.lin(x), np.float32) for x in colours]
    pick = rng.choice(len(cols), size=(int(H / c) + 2, int(W / c) + 2), p=np.array(weights) / sum(weights))
    jitter = rng.uniform(0.85, 1.15, size=pick.shape)
    yy, xx = np.mgrid[0:H, 0:W]
    i, j = (yy / c).astype(int), (xx / c).astype(int)
    out = np.stack(cols)[pick[i, j]] * jitter[i, j][..., None]
    grout = (np.mod(yy, c) < 0.14 * c) | (np.mod(xx, c) < 0.14 * c)
    out[grout] = np.array(wc.lin("#D9D4C8"), np.float32)
    return cv2.resize(out.astype(np.float32), (w, h), interpolation=cv2.INTER_AREA)


def lantern(w, ss=8):
    """A small wall lantern seen from the front, w pixels wide: a dark bronze
    cap and finial, amber glass between slim mullions, a drop finial below;
    lit from the upper left. Linear colour and coverage."""
    h = int(w * 2.1)
    W, H = w * ss, h * ss
    u = W / 28.0                                          # drawn on a 28-unit-wide grid
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    bronze, brass, glass = (46, 38, 32, 255), (176, 141, 87, 255), (236, 196, 120, 255)
    d.rounded_rectangle((11 * u, 9 * u, 17 * u, 52 * u), 2 * u, fill=bronze)              # backplate
    d.ellipse((12.2 * u, 0.5 * u, 15.8 * u, 4 * u), fill=brass)                            # finial
    d.polygon([(13.4 * u, 3.5 * u), (14.6 * u, 3.5 * u), (15.2 * u, 7 * u), (12.8 * u, 7 * u)], fill=bronze)
    d.polygon([(8 * u, 7 * u), (20 * u, 7 * u), (26 * u, 14 * u), (2 * u, 14 * u)], fill=bronze)  # cap
    d.rectangle((2 * u, 13.2 * u, 26 * u, 15 * u), fill=brass)
    d.polygon([(4 * u, 15 * u), (24 * u, 15 * u), (21 * u, 42 * u), (7 * u, 42 * u)], fill=glass)  # glass
    for x0, x1 in ((4, 7), (24, 21), (11.7, 11.4), (16.3, 16.6)):                           # mullions
        d.line([(x0 * u, 15 * u), (x1 * u, 42 * u)], fill=bronze, width=int(1.3 * u))
    d.polygon([(6 * u, 42 * u), (22 * u, 42 * u), (18 * u, 47 * u), (10 * u, 47 * u)], fill=bronze)
    d.rectangle((6 * u, 41.5 * u, 22 * u, 43 * u), fill=brass)
    d.ellipse((12.4 * u, 46.5 * u, 15.6 * u, 50.5 * u), fill=brass)                         # drop
    a = np.array(im, np.float32) / 255
    rgb_ = a[..., :3]
    # Light from the upper left: brighter left and top, a glint down the glass.
    yy, xx = np.mgrid[0:H, 0:W] / np.float32(W)
    lightness = np.clip(1.15 - 0.45 * xx - 0.12 * yy / 2.1, 0.55, 1.2)
    glint = np.exp(-0.5 * ((xx - 0.36) / 0.035) ** 2) * ((yy > 15 / 28) & (yy < 41 / 28)) * 0.35
    rgb_ = np.clip(rgb_ * lightness[..., None] + glint[..., None] * a[..., 3:4], 0, 1)
    small = cv2.resize(np.dstack([rgb_ * a[..., 3:4], a[..., 3]]), (w, h), interpolation=cv2.INTER_AREA)
    cover = small[..., 3]
    colour = small[..., :3] / np.maximum(cover, 1e-4)[..., None]
    return wc.to_lin((cv2.cvtColor(np.clip(colour, 0, 1).astype(np.float32), cv2.COLOR_RGB2BGR) * 255)
                     .astype(np.uint8)), cover


# The gate (photo pixels): the door leaf, the rails top and bottom, the left
# post, the band its spear tips stand in, the door's panel where its words
# and emblem are, and the raised border round them.
GATE = dict(leaf=[(689, 393), (886, 391), (903, 762), (689, 762)],
            rails=[[(503, 395), (886, 392), (886, 409), (503, 410)], [(503, 740), (903, 742), (903, 760), (503, 760)]],
            post=[(501, 395), (515, 395), (516, 766), (502, 766)],
            spears=[(503, 372), (886, 370), (886, 393), (503, 396)],
            panel=[(716, 447), (880, 445), (889, 696), (720, 698)],
            border=[(725.7, 475.4), (883.8, 466.9), (879.3, 669.7), (733.3, 679.4)])
# Lanterns: the centre of each, in photo pixels, and its width.
LANTERNS = [((472, 470), 30), ((918, 446), 27)]


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
        self.lines = np.zeros((h, w), np.float32)         # gold lines under the coping and over the plinth
        self.panels = []                                  # (panel to photo, its straight-on size)
        self.strips = []                                  # (panel to photo, rectangle, mask in the photo)
        for name, p in wc.PANELS.items():
            pw, ph = p["size"]
            Hinv = np.linalg.inv(cv2.getPerspectiveTransform(np.float32(p["quad"]),
                                                             np.float32([(0, 0), (pw, 0), (pw, ph), (0, ph)])))
            self.panels.append((Hinv, (pw, ph)))
            m = np.zeros((ph, pw), np.float32)
            m[:COPING[name]] = 1
            self.coping = np.maximum(self.coping, self.warp(m, Hinv))
            m = np.zeros((ph, pw), np.float32)
            m[PLINTH[name]:] = 1
            self.plinth = np.maximum(self.plinth, self.warp(m, Hinv))
            m = np.zeros((ph, pw), np.float32)
            m[COPING[name] + 4:COPING[name] + 9] = 1
            m[PLINTH[name] - 8:PLINTH[name] - 3] = 1
            self.lines = np.maximum(self.lines, self.warp(m, Hinv))
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
        self.gate_masks(img)

    def gate_masks(self, img):
        """The gate's painted metal (dark maroon, within its outline, so the
        courtyard seen through it is left alone), its spear tips, and the
        raised border, words and emblem on its door."""
        h, w = img.shape[:2]
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
        L, A = lab[..., 0] * 100 / 255, lab[..., 1] - 128
        shape = np.maximum.reduce([wc.poly(img.shape, q) for q in [GATE["leaf"], GATE["post"], *GATE["rails"]]])
        metal = shape * np.clip((34 - L) / 4, 0, 1) * np.clip((A - 2) / 2, 0, 1)
        self.gate = cv2.GaussianBlur(metal, (0, 0), 0.7)
        self.spears = cv2.GaussianBlur(self.spear_tips(L, A), (0, 0), 0.6)
        # The raised border is drawn as one clean line (picked out of the
        # photo it breaks up in the sun); the words, the emblem and the
        # corner flourishes are found as the door's fine relief.
        panel = cv2.erode(wc.poly(img.shape, GATE["panel"]), np.ones((7, 7), np.uint8))
        Y = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
        rough = cv2.GaussianBlur(np.abs(Y - cv2.GaussianBlur(Y, (0, 0), 2.5)), (0, 0), 1.2)
        raised = cv2.morphologyEx(np.clip((rough - 3.5) / 3, 0, 1), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
        inner = cv2.erode(wc.poly(img.shape, GATE["border"]), np.ones((5, 5), np.uint8))
        border = np.zeros((h, w), np.uint8)
        cv2.polylines(border, [np.round(np.array(GATE["border"]) * 4).astype(np.int32)], True, 255, 2, cv2.LINE_AA,
                      shift=2)
        self.raised = np.maximum(cv2.GaussianBlur(raised * panel * inner, (0, 0), 0.6), border / 255.0) * self.gate
        # The gate's own shading: its brightness over that of its sunlit paint.
        Yl = self.wall.Y
        self.gate_shade = Yl / np.percentile(Yl[metal > 0.5], 90)

    def spear_tips(self, L, A):
        """The spear tips along the gate's top, gilded: each found as the
        darkest column near the next one along (they stand 24.5 px apart),
        and its shape taken from where it stands dark against the sky, or,
        where the tree behind it is as dark, from a clear one beside it."""
        band = wc.poly(L.shape, GATE["spears"]) > 0.5
        col = np.array([L[band[:, x], x].mean() if band[:, x].any() else 100 for x in range(L.shape[1])])
        xs, x = [], 512.0
        while x < 870:
            lo = int(x) - 5
            xs.append(lo + int(np.argmin(col[lo:lo + 11])))
            x = xs[-1] + 24.5
        found = np.zeros(L.shape, np.float32)
        for xk in xs:
            win = band.copy()
            win[:, :xk - 4] = False
            win[:, xk + 5:] = False
            found[win & (L < np.percentile(L[win], 15) + 14) & (A > -2)] = 1
        # A clear spear (against the sky-blue wall) as the stamp for the rest.
        x1 = xs[1]
        stamp = found[:, x1 - 4:x1 + 5].copy()
        out = found.copy()
        for xk in xs:
            dy = int(round((xk - x1) * -3 / 383))          # the rail rises a little to the right
            out[:, xk - 4:xk + 5] = np.maximum(out[:, xk - 4:xk + 5], np.roll(stamp, dy, axis=0) * (L[:, xk - 4:xk + 5] < 45))
        return out

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
        for Hinv, (pw, ph) in self.panels if s.get("mosaic") else []:
            m = s["mosaic"]
            on = self.warp(np.ones((ph, pw), np.float32), Hinv) * self.not_pillar
            alb = self.warp(mosaic(pw, ph, 9, m["colours"], m["weights"], np.random.default_rng(11)), Hinv)
            for role in m["roles"]:
                lay(self.motif[role] * on, alb)
        for Hinv, (pw, ph) in self.panels if s.get("stencil") else []:
            gold(self.warp(stencil(pw, ph, 46), Hinv) * self.motif["bg"] * self.not_pillar, 0.55)
        gold(self.motif["grooves"] * self.not_pillar, 0.85)
        if s.get("lines"):
            gold(self.lines * self.not_pillar, 0.9)
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
        if s.get("gate"):
            # The gate repainted, its raised border, words and emblem and its
            # spear tips gilded.
            gs = np.clip(self.gate_shade, 0, 2)[..., None]
            a = self.gate[..., None]
            out = out * (1 - a) + wc.soft_clip(wc.lin(s["gate"]) * gs * 0.95) * a
            gilt = wc.soft_clip(np.array(wc.lin(GOLD), np.float32) * 1.15 * gs ** 0.9)
            for m in (self.raised, self.spears):
                a = m[..., None] * 0.92
                out = out * (1 - a) + gilt * a
        for (cx, cy), lw in LANTERNS if s.get("lanterns") else []:
            col, cover = lantern(lw)
            lh = cover.shape[0]
            x0, y0 = int(round(cx - lw / 2)), int(round(cy - lh / 2))
            # Its soft shadow on the pillar, down and to the right of it.
            shadow = np.zeros(out.shape[:2], np.float32)
            shadow[y0 + 5:y0 + 5 + lh, x0 + 3:x0 + 3 + lw] = cover
            shadow = cv2.GaussianBlur(shadow, (0, 0), 2.0) * 0.45 * cv2.GaussianBlur(cement, (0, 0), 2)
            out = out * (1 - shadow[..., None])
            # The lantern itself, as bright as the light where it hangs.
            here = float(np.clip(np.median(self.light[y0:y0 + lh, x0:x0 + lw]), 0.35, 1.15))
            box = out[y0:y0 + lh, x0:x0 + lw]
            out[y0:y0 + lh, x0:x0 + lw] = box * (1 - cover[..., None]) + wc.soft_clip(col * here) * cover[..., None]
        return wc.to_srgb(out)


def board(tiles, name):
    """Four labelled pictures, two across, at half size."""
    small = [cv2.resize(t, (t.shape[1] // 2, t.shape[0] // 2), interpolation=cv2.INTER_AREA) for t in tiles]
    gap = 16
    row = lambda a, b: np.hstack([a, np.full((a.shape[0], gap, 3), 255, np.uint8), b])
    top, bottom = row(small[0], small[1]), row(small[2], small[3])
    sheet = np.vstack([top, np.full((gap, top.shape[1], 3), 255, np.uint8), bottom])
    cv2.imwrite(str(HERE / name), sheet, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"wrote {name}")


def main():
    img = cv2.imread(str(wc.SOURCE))
    fancy = Fancy(img)
    before = wc.label(img, "As it is", "bare cement", [])
    done = {}
    for s in SCHEMES + [DELUXE]:
        out = fancy.render(s)
        stone = "#" + "".join(f"{v:02X}" for v in np.mean([rgb(c) for c in STONES[s["stone"]]], 0).astype(int))
        sw = [("Wall", HOUSE_BLUE), ("Relief", s["motif"]["band2"]), ("Relief", s["motif"]["band3"]),
              ("Tiles", s["tiles"]["corner"]), ("Stone", stone), ("Lines", GOLD)]
        if s.get("gate"):
            sw[1:3] = [("Mosaic", s["mosaic"]["colours"][1]), ("Gate", s["gate"])]
        lab = wc.label(out, s["name"], s["note"], sw)
        cv2.imwrite(str(HERE / f"fancy-{s['key']}.jpg"), lab, [cv2.IMWRITE_JPEG_QUALITY, 92])
        done[s["key"]] = (out, lab)
        print(f"wrote fancy-{s['key']}.jpg")
    board([before] + [done[s["key"]][1] for s in SCHEMES], "fancy-wall-options.jpg")
    # Sky & Gold beside its deluxe version, and the deluxe gate up close.
    out = done[DELUXE["key"]][0]
    close = cv2.resize(out[300:780, 360:1000], (img.shape[1], img.shape[0]), interpolation=cv2.INTER_CUBIC)
    close = wc.label(close, "Deluxe, up close", "the gate, the lanterns, the stone and the tiles", [])
    board([before, done["sky-gold"][1], done[DELUXE["key"]][1], close], "fancy-sky-gold-deluxe-options.jpg")


if __name__ == "__main__":
    main()
