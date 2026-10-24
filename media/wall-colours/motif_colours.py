"""The wall in the house's own sky blue, with its relief motif picked out in
jewel colours.

The relief is two sets of concentric arcs with a staircase between them, on
each panel. Its shapes are traced in each panel's straight-on view
(wall_colours.PANELS): every arc is fitted as a circle through a few points
on its groove, then snapped to the groove itself (the ridges of a Hessian
line filter); the staircase's treads and risers are straight lines. Those
curves split the panel into its bands, steps and corner pieces, and each
piece gets a role (`band1`..`band3`, `step1`..`step3`, `thin`, `block`,
`bg`) from a point inside it, so the roles stay put if the tracing changes.

The frame, top band and plinth are painted the house's sky blue; the motif
by role from the scheme; the grooves in a fine line of gold or white; the
pillars ivory; the canopy the roof's red with an ivory valance.

    python3 media/wall-colours/motif_colours.py [fonts_dir]
"""

import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import wall_colours as wc  # noqa: E402

HOUSE_BLUE = "#5B9BD5"
IVORY = "#F4EFE4"
ROOF_RED = "#C9473E"

MOTIF = {
    "right": dict(arcs=[
        [(38, 238), (144, 281), (206, 346), (262, 409), (300, 465)],
        [(95, 337), (144, 384), (181, 434), (210, 470)],
        [(178, 197), (231, 246), (281, 296), (338, 358), (388, 470)],
        [(312, 190), (380, 300), (450, 420), (495, 520)],
        [(492, 186), (517, 346), (574, 465), (655, 577)],
        [(580, 186), (592, 327), (649, 434), (780, 540), (955, 571)],
        [(620, 186), (630, 315), (686, 402), (805, 490), (955, 502)],
        [(667, 186), (674, 296), (724, 371), (830, 452), (955, 465)],
        [(699, 186), (730, 302), (780, 365), (892, 421)],
    ], lines=[
        [(340, 242), (492, 242)], [(492, 186), (492, 242)], [(395, 318), (505, 318)],
        [(440, 412), (540, 412)], [(497, 521), (606, 521)],
        [(700, 237), (892, 237)], [(892, 237), (892, 421)],
    ], roles={
        "bg": [(110, 490), (400, 198), (585, 570), (930, 200), (790, 380)],
        "band1": [(190, 430), (640, 250)], "band2": [(250, 370), (597, 250)], "band3": [(355, 370), (640, 435)],
        "thin": [(686, 250)], "step1": [(420, 280)], "step2": [(470, 365)], "step3": [(520, 470)],
        "block": [(815, 310)],
    }),
    "left": dict(arcs=[
        [(40, 268), (150, 300), (230, 390), (270, 480), (275, 585)],
        [(40, 340), (120, 355), (180, 430), (205, 540), (208, 585)],
        [(78, 410), (115, 460), (140, 510), (148, 548)],
        [(415, 180), (440, 300), (520, 400), (612, 440)],
        [(485, 180), (500, 280), (560, 340), (612, 360)],
        [(125, 222), (215, 300), (275, 400), (300, 500), (305, 585)],
    ], lines=[
        [(100, 222), (328, 222)], [(200, 288), (335, 288)], [(260, 395), (380, 395)], [(290, 497), (460, 497)],
        [(328, 222), (335, 288)], [(335, 288), (357, 352)], [(357, 352), (380, 395)], [(380, 395), (422, 455)],
        [(422, 455), (460, 497)], [(460, 497), (606, 557)],
    ], roles={
        "bg": [(75, 505), (435, 548)], "band1": [(135, 455)], "band2": [(175, 410), (495, 310)],
        "band3": [(165, 325), (390, 330)], "step1": [(245, 250)], "step2": [(295, 340)], "step3": [(355, 450)],
        "block": [(548, 250)],
    }),
}

SCHEMES = [
    dict(key="peacock", name="Peacock", note="house blue with peacock teal, emerald and gold",
         bg=IVORY, band1="#D4A23A", band2="#1F8A70", band3="#0E5E6F", thin="#D4A23A",
         step1="#8CC7E8", step2="#3E86C6", step3="#1F4E8C", block="#D4A23A", grooves="#E8C25A"),
    dict(key="sunset", name="Sunset on Sky", note="warm saffron to plum against the cool blue",
         bg=IVORY, band1="#F2A93B", band2="#E36A47", band3="#B23A62", thin="#F2C14E",
         step1="#F6C66B", step2="#EE8E4A", step3="#C9473E", block="#7A3B72", grooves="#FFFFFF"),
    dict(key="royal", name="Royal", note="maroon like the gate, gold and emerald",
         bg=IVORY, band1="#D4A23A", band2="#2E7D4F", band3="#7B2E2A", thin="#D4A23A",
         step1="#E7CF8A", step2="#C9A040", step3="#8E6A22", block="#7B2E2A", grooves="#E8C25A"),
]


def fit_circle(pts):
    p = np.asarray(pts, np.float64)
    A = np.c_[2 * p, np.ones(len(p))]
    cx, cy, c = np.linalg.lstsq(A, (p ** 2).sum(1), rcond=None)[0]
    return np.array([cx, cy]), np.sqrt(c + cx * cx + cy * cy)


def ridges(flat):
    """A line filter: the larger Hessian eigenvalue, positive across a dark line."""
    out = np.zeros_like(flat)
    for sig in (1.4, 2.2):
        g = cv2.GaussianBlur(flat, (0, 0), sig)
        dxx, dyy = cv2.Sobel(g, cv2.CV_32F, 2, 0, ksize=3), cv2.Sobel(g, cv2.CV_32F, 0, 2, ksize=3)
        dxy = cv2.Sobel(g, cv2.CV_32F, 1, 1, ksize=3)
        out = np.maximum(out, ((dxx + dyy) / 2 + np.sqrt(((dxx - dyy) / 2) ** 2 + dxy ** 2)) * sig ** 2)
    return out


def snap(ridge, c, r, pts, band=7):
    """Refit a circle to the strong ridge pixels near it, between its end points."""
    h, w = ridge.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.abs(np.hypot(xx - c[0], yy - c[1]) - r)
    ang = np.arctan2(yy - c[1], xx - c[0])
    a = np.arctan2(np.asarray(pts)[:, 1] - c[1], np.asarray(pts)[:, 0] - c[0])
    sel = (d < band) & (ang > a.min() - 0.05) & (ang < a.max() + 0.05) & (ridge > np.percentile(ridge, 90))
    if sel.sum() < 30:
        return c, r
    wt = np.sqrt(ridge[sel])
    P = np.c_[xx[sel], yy[sel]].astype(np.float64)
    cx, cy, cc = np.linalg.lstsq(np.c_[2 * P, np.ones(len(P))] * wt[:, None], (P ** 2).sum(1) * wt, rcond=None)[0]
    return np.array([cx, cy]), np.sqrt(cc + cx * cx + cy * cy)


def panel_roles(img, name):
    """Role masks for one panel, in its straight-on view."""
    p, M = wc.PANELS[name], MOTIF[name]
    w, h = p["size"]
    Hm = cv2.getPerspectiveTransform(np.float32(p["quad"]), np.float32([(0, 0), (w, 0), (w, h), (0, h)]))
    rect = cv2.warpPerspective(img, Hm, (w, h), flags=cv2.INTER_CUBIC)
    g = cv2.cvtColor(rect, cv2.COLOR_BGR2GRAY).astype(np.float32)
    flat = np.clip((g / (cv2.GaussianBlur(g, (0, 0), 10) + 1) - 1) * 300 + 140, 0, 255) / 255
    ridge = ridges(flat.astype(np.float32))
    x0, y0, x1, y1 = p["field"]
    field = np.zeros((h, w), np.uint8)
    field[y0:y1, x0:x1] = 1
    walls = np.zeros((h, w), np.uint8)
    for pts in M["arcs"]:
        c, r = snap(ridge, *fit_circle(pts), pts)
        a = np.arctan2(np.asarray(pts)[:, 1] - c[1], np.asarray(pts)[:, 0] - c[0])
        t = np.linspace(a.min() - 0.9, a.max() + 0.9, 600)
        q = np.c_[c[0] + r * np.cos(t), c[1] + r * np.sin(t)]
        cv2.polylines(walls, [np.round(q * 4).astype(np.int32)], False, 1, 3, cv2.LINE_8, shift=2)
    for p0, p1 in M["lines"]:
        cv2.line(walls, p0, p1, 1, 3)
    n, lab = cv2.connectedComponents(field & (1 - walls), connectivity=4)
    lab = cv2.dilate(lab.astype(np.float32), np.ones((5, 5), np.uint8)).astype(np.int32) * field
    roles = {}
    for role, probes in M["roles"].items():
        m = np.zeros((h, w), np.float32)
        for (px, py) in probes:
            i = lab[py, px]
            if i > 0:
                m[lab == i] = 1
        roles[role] = cv2.GaussianBlur(m, (0, 0), 0.8)
    # The grooves themselves: thin, long ridge lines.
    t = np.percentile(ridge, 93)
    lines = (ridge > t).astype(np.uint8)
    nn, ll, st, _ = cv2.connectedComponentsWithStats(lines, 8)
    keep = np.isin(ll, [i for i in range(1, nn) if max(st[i, 2], st[i, 3]) > 45])
    roles["grooves"] = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 0.7) * field
    return roles, np.linalg.inv(Hm)


def paint(img, wall, scheme, panel_masks):
    base = wc.to_lin(img)
    out = base.copy()
    cement = wall.cement
    shade = wall.shade[..., None]

    def lay(mask, hexstr, strength=1.0):
        nonlocal out
        a = (mask * cement)[..., None] * strength
        out = out * (1 - a) + wc.soft_clip(wc.lin(hexstr) * shade * 0.94) * a

    lay(wall.zones["field"] + wall.zones["frame"], HOUSE_BLUE)              # the whole panel first
    lay(wall.zones["pillars"], IVORY)
    lay(wall.zones["top"], ROOF_RED)
    lay(wall.zones["valance"], IVORY)
    for role in ("bg", "band1", "band2", "band3", "thin", "step1", "step2", "step3", "block"):
        lay(panel_masks[role] * (1 - wall.zones["pillars"]), scheme[role])
    lay(panel_masks["grooves"] * (1 - wall.zones["pillars"]), scheme["grooves"], 0.8)
    canopy_grooves = wall.zones["grooves"] * np.maximum(wall.zones["top"], wall.zones["valance"])
    lay(canopy_grooves, IVORY, 0.7)
    return wc.to_srgb(out)


def main():
    img = cv2.imread(str(wc.SOURCE))
    wall = wc.Wall(img)
    h, w = img.shape[:2]
    masks = {k: np.zeros((h, w), np.float32) for k in
             ("bg", "band1", "band2", "band3", "thin", "step1", "step2", "step3", "block", "grooves")}
    for name in MOTIF:
        roles, Hinv = panel_roles(img, name)
        for k, m in roles.items():
            masks[k] = np.maximum(masks[k], cv2.warpPerspective(m, Hinv, (w, h), flags=cv2.INTER_LINEAR))
    tiles = []
    for s in SCHEMES:
        out = paint(img, wall, s, masks)
        sw = [("Wall", HOUSE_BLUE), ("Band", s["band1"]), ("Band", s["band2"]), ("Band", s["band3"]),
              ("Steps", s["step2"]), ("Lines", s["grooves"])]
        lab = wc.label(out, s["name"], s["note"], sw)
        cv2.imwrite(str(HERE / f"motif-{s['key']}.jpg"), lab, [cv2.IMWRITE_JPEG_QUALITY, 92])
        tiles.append(lab)
        print(f"wrote motif-{s['key']}.jpg")
    before = wc.label(img, "As it is", "bare cement", [])
    small = [cv2.resize(t, (t.shape[1] // 2, t.shape[0] // 2), interpolation=cv2.INTER_AREA) for t in [before] + tiles]
    gap = 16
    row = lambda a, b: np.hstack([a, np.full((a.shape[0], gap, 3), 255, np.uint8), b])
    top, bottom = row(small[0], small[1]), row(small[2], small[3])
    sheet = np.vstack([top, np.full((gap, top.shape[1], 3), 255, np.uint8), bottom])
    cv2.imwrite(str(HERE / "motif-colour-options.jpg"), sheet, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print("wrote motif-colour-options.jpg")


if __name__ == "__main__":
    main()
