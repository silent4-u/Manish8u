"""Five alternative ground-floor plans for one plot, with the same rooms.

The plot (from the drawing sent): 28'-0" wide; 57'-0" deep on the left and
53'-6½" on the right. The house keeps the drawing's footprint and setbacks:
24'-0" x 35'-6", with 3'-0" open on the left, 1'-0" on the right and
17'-4½" open at the front.

Every plan has the drawing's rooms: 2 bedrooms, a living room, a kitchen,
a toilet, a verandah and a stair.
  - Bedrooms stay on the left, where the 3'-0" gap allows real windows; the
    1'-0" gap on the right only allows ventilators.
  - Outer walls are 9", partitions 4½", columns 12" x 12" (shown at likely
    positions; the structural engineer confirms them).
  - Sizes are clear inside sizes.

    python3 media/house-plans/plans.py    # plan-1.png ... plan-5.png, all-plans.png, house-plans.pdf
"""

import textwrap
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.backends.backend_pdf import PdfPages  # noqa: E402
from matplotlib.patches import Arc, Circle, Ellipse, FancyBboxPatch, Polygon, Rectangle  # noqa: E402

HERE = Path(__file__).resolve().parent
W, D = 24.0, 35.5                      # the house, outside
OUT_WALL, PART = 0.75, 0.375           # 9" and 4½"
FRONT_OPEN, LEFT_GAP, RIGHT_GAP = 17.375, 3.0, 1.0
PLOT_LEFT, PLOT_RIGHT = 57.0, 53.0 + 6.5 / 12

WALL = "#3b3b3b"
INK = "#222222"
FURN = "#6a6a6a"
COLOR = {
    "bed": "#dbe9f6", "living": "#fdf0c4", "kitchen": "#fde0c6", "toilet": "#d3efec",
    "stair": "#e7e7e7", "verandah": "#e2f1d8", "lobby": "#f3f3f3", "hall": "#fdf0c4",
}


def fi(ft):
    """Feet as 12'-1½"."""
    inches = round(ft * 24) / 2
    feet, rest = divmod(inches, 12)
    rest_s = f"{int(rest)}" + ("½" if rest % 1 else "")
    return f"{int(feet)}'-{rest_s}\""


# ---- drawing primitives -------------------------------------------------------

def rect(ax, x0, y0, x1, y1, fc, ec="none", lw=0, z=1, **kw):
    ax.add_patch(Rectangle((x0, y0), x1 - x0, y1 - y0, facecolor=fc, edgecolor=ec, lw=lw, zorder=z, **kw))


def door(ax, kind, lo, hi, a, b, into, hinge="lo", fc="white"):
    """A door in a wall. kind 'v': the wall spans x lo..hi, the opening y a..b;
    kind 'h': the wall spans y lo..hi, the opening x a..b. into=+1 swings to
    the higher side."""
    w = b - a
    face = hi if into > 0 else lo
    h = a if hinge == "lo" else b
    other = b if hinge == "lo" else a
    if kind == "v":
        rect(ax, lo - 0.01, a, hi + 0.01, b, fc, z=3)
        tip = (face + into * w, h)
        ax.plot([face, tip[0]], [h, tip[1]], color=INK, lw=0.9, zorder=6)
        t1 = 0 if into > 0 else 180
        span = 90 if (other > h) == (into > 0) else -90
        start, end = sorted([t1, t1 + span])
        ax.add_patch(Arc((face, h), 2 * w, 2 * w, theta1=start, theta2=end, color=INK, lw=0.5, ls=(0, (3, 2)), zorder=6))
    else:
        rect(ax, a, lo - 0.01, b, hi + 0.01, fc, z=3)
        tip = (h, face + into * w)
        ax.plot([h, tip[0]], [face, tip[1]], color=INK, lw=0.9, zorder=6)
        t1 = 90 if into > 0 else 270
        span = -90 if (other > h) == (into > 0) else 90
        start, end = sorted([t1, t1 + span])
        ax.add_patch(Arc((h, face), 2 * w, 2 * w, theta1=start, theta2=end, color=INK, lw=0.5, ls=(0, (3, 2)), zorder=6))


def window(ax, kind, lo, hi, a, b):
    if kind == "v":
        rect(ax, lo, a, hi, b, "white", z=3)
        for f in (0.2, 0.5, 0.8):
            x = lo + f * (hi - lo)
            ax.plot([x, x], [a, b], color=INK, lw=0.6, zorder=4)
        ax.plot([lo, hi], [a, a], color=INK, lw=0.6, zorder=4)
        ax.plot([lo, hi], [b, b], color=INK, lw=0.6, zorder=4)
    else:
        rect(ax, a, lo, b, hi, "white", z=3)
        for f in (0.2, 0.5, 0.8):
            y = lo + f * (hi - lo)
            ax.plot([a, b], [y, y], color=INK, lw=0.6, zorder=4)
        ax.plot([a, a], [lo, hi], color=INK, lw=0.6, zorder=4)
        ax.plot([b, b], [lo, hi], color=INK, lw=0.6, zorder=4)


def column(ax, x, y):
    rect(ax, x, y, x + 1, y + 1, "black", z=7)


def stair(ax, box, axis, landing, first, foyer_side=None, n=8):
    """A U-stair: two flights side by side and a landing at one end.
    axis: the direction the flights run ('x' or 'y'). landing: 'lo'/'hi' end.
    first: which half the first (upward) flight is in, 'a' (lower) or 'b'."""
    x0, y0, x1, y1 = box
    t = 10 / 12
    run = n * t
    if axis == "y":
        s0, s1, c0, c1 = y0, y1, x0, x1
    else:
        s0, s1, c0, c1 = x0, x1, y0, y1
    land = (s1 - s0) - run if foyer_side is None else 3.2
    if landing == "lo":
        land_lo, land_hi = s0, s0 + land
        f_lo, f_hi = land_hi, land_hi + run
    else:
        land_lo, land_hi = s1 - land, s1
        f_lo, f_hi = land_lo - run, land_lo
    cm = (c0 + c1) / 2
    halves = {"a": (c0, cm - 0.19), "b": (cm + 0.19, c1)}

    def seg(s_a, c_a, s_b, c_b, **kw):
        if axis == "y":
            ax.plot([c_a, c_b], [s_a, s_b], **kw)
        else:
            ax.plot([s_a, s_b], [c_a, c_b], **kw)

    # central wall between the flights
    if axis == "y":
        rect(ax, cm - 0.19, f_lo, cm + 0.19, f_hi, "#9a9a9a", z=4)
    else:
        rect(ax, f_lo, cm - 0.19, f_hi, cm + 0.19, "#9a9a9a", z=4)
    for h in ("a", "b"):
        ca, cb = halves[h]
        for k in range(n + 1):
            s = f_lo + k * t
            seg(s, ca, s, cb, color=FURN, lw=0.55, zorder=4)
    seg(land_lo if landing == "hi" else land_hi, c0, land_lo if landing == "hi" else land_hi, c1, color=FURN, lw=0.55, zorder=4)
    # the arrow: up the first flight, across the landing, up the second
    other = "b" if first == "a" else "a"
    ca = sum(halves[first]) / 2
    cb = sum(halves[other]) / 2
    start = f_hi if landing == "lo" else f_lo
    turn = (land_lo + land_hi) / 2
    end = f_hi - 0.5 if landing == "lo" else f_lo + 0.5
    pts = [(start, ca), (turn, ca), (turn, cb), (end, cb)]
    xs, ys = ([p[1] for p in pts], [p[0] for p in pts]) if axis == "y" else ([p[0] for p in pts], [p[1] for p in pts])
    ax.plot(xs, ys, color=INK, lw=0.8, zorder=5)
    ax.annotate("", xy=(xs[-1], ys[-1]), xytext=(xs[-2], ys[-2]),
                arrowprops=dict(arrowstyle="-|>", color=INK, lw=0.8, mutation_scale=7), zorder=5)
    tx, ty = (ca, start) if axis == "y" else (start, ca)
    ax.text(tx, ty, "UP", ha="center", va="center", fontsize=5.5, color=INK, zorder=6,
            bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="none"))


# ---- furniture ----------------------------------------------------------------

def bed(ax, x0, y0, x1, y1, head):
    rect(ax, x0, y0, x1, y1, "white", ec=FURN, lw=0.7, z=5)
    w, h = x1 - x0, y1 - y0
    if head in ("bottom", "top"):
        py = y0 + 0.3 if head == "bottom" else y1 - 1.3
        for k in range(2):
            px = x0 + 0.35 + k * (w - 0.7) / 2
            ax.add_patch(FancyBboxPatch((px, py), (w - 0.7) / 2 - 0.25, 1.0, boxstyle="round,pad=0,rounding_size=0.25",
                                        fc="white", ec=FURN, lw=0.6, zorder=6))
        fy = y0 + 0.45 * h if head == "bottom" else y1 - 0.45 * h
        ax.plot([x0, x1], [fy, fy], color=FURN, lw=0.6, zorder=6)
    else:
        px = x0 + 0.3 if head == "left" else x1 - 1.3
        for k in range(2):
            py = y0 + 0.35 + k * (h - 0.7) / 2
            ax.add_patch(FancyBboxPatch((px, py), 1.0, (h - 0.7) / 2 - 0.25, boxstyle="round,pad=0,rounding_size=0.25",
                                        fc="white", ec=FURN, lw=0.6, zorder=6))
        fx = x0 + 0.45 * w if head == "left" else x1 - 0.45 * w
        ax.plot([fx, fx], [y0, y1], color=FURN, lw=0.6, zorder=6)


def wardrobe(ax, x0, y0, x1, y1):
    rect(ax, x0, y0, x1, y1, "white", ec=FURN, lw=0.7, z=5)
    ax.plot([x0, x1], [y0, y1], color=FURN, lw=0.4, zorder=6)
    ax.plot([x0, x1], [y1, y0], color=FURN, lw=0.4, zorder=6)


def sofa(ax, x0, y0, x1, y1, back):
    rect(ax, x0, y0, x1, y1, "white", ec=FURN, lw=0.7, z=5)
    d = 0.7
    if back == "right":
        rect(ax, x1 - d, y0, x1, y1, "#ececec", ec=FURN, lw=0.6, z=6)
        for k in (1, 2):
            yy = y0 + k * (y1 - y0) / 3
            ax.plot([x0, x1 - d], [yy, yy], color=FURN, lw=0.4, zorder=6)
    elif back == "left":
        rect(ax, x0, y0, x0 + d, y1, "#ececec", ec=FURN, lw=0.6, z=6)
        for k in (1, 2):
            yy = y0 + k * (y1 - y0) / 3
            ax.plot([x0 + d, x1], [yy, yy], color=FURN, lw=0.4, zorder=6)
    elif back == "top":
        rect(ax, x0, y1 - d, x1, y1, "#ececec", ec=FURN, lw=0.6, z=6)
        for k in (1, 2):
            xx = x0 + k * (x1 - x0) / 3
            ax.plot([xx, xx], [y0, y1 - d], color=FURN, lw=0.4, zorder=6)
    else:
        rect(ax, x0, y0, x1, y0 + d, "#ececec", ec=FURN, lw=0.6, z=6)
        for k in (1, 2):
            xx = x0 + k * (x1 - x0) / 3
            ax.plot([xx, xx], [y0 + d, y1], color=FURN, lw=0.4, zorder=6)


def table(ax, x0, y0, x1, y1, chairs=4):
    rect(ax, x0, y0, x1, y1, "white", ec=FURN, lw=0.7, z=6)
    w, h = x1 - x0, y1 - y0
    c = 1.2
    long_y = h >= w
    per = chairs // 2
    for k in range(per):
        if long_y:
            yy = y0 + (k + 0.5) * h / per - c / 2
            rect(ax, x0 - c - 0.1, yy, x0 - 0.1, yy + c, "white", ec=FURN, lw=0.6, z=5)
            rect(ax, x1 + 0.1, yy, x1 + c + 0.1, yy + c, "white", ec=FURN, lw=0.6, z=5)
        else:
            xx = x0 + (k + 0.5) * w / per - c / 2
            rect(ax, xx, y0 - c - 0.1, xx + c, y0 - 0.1, "white", ec=FURN, lw=0.6, z=5)
            rect(ax, xx, y1 + 0.1, xx + c, y1 + c + 0.1, "white", ec=FURN, lw=0.6, z=5)


def counter(ax, *rects):
    for r in rects:
        rect(ax, *r, "#d9d9d9", ec=FURN, lw=0.6, z=5)


def sink(ax, x0, y0, x1, y1):
    rect(ax, x0, y0, x1, y1, "white", ec=FURN, lw=0.6, z=6)
    ax.add_patch(FancyBboxPatch((x0 + 0.2, y0 + 0.2), x1 - x0 - 0.4, y1 - y0 - 0.4,
                                boxstyle="round,pad=0,rounding_size=0.2", fc="white", ec=FURN, lw=0.5, zorder=7))


def hob(ax, cx, cy):
    for dx in (-0.45, 0.45):
        ax.add_patch(Circle((cx + dx, cy), 0.32, fc="white", ec=FURN, lw=0.6, zorder=7))


def fridge(ax, x0, y0, x1, y1):
    rect(ax, x0, y0, x1, y1, "white", ec=FURN, lw=0.7, z=5)
    ax.text((x0 + x1) / 2, (y0 + y1) / 2, "F", ha="center", va="center", fontsize=5, color=FURN, zorder=6)


def wc(ax, x, y, facing):
    """A WC whose cistern is against a wall; (x, y) is the cistern's centre on the wall."""
    if facing == "up":
        rect(ax, x - 0.75, y, x + 0.75, y + 0.6, "white", ec=FURN, lw=0.6, z=6)
        ax.add_patch(Ellipse((x, y + 1.45), 1.2, 1.7, fc="white", ec=FURN, lw=0.6, zorder=6))
    elif facing == "down":
        rect(ax, x - 0.75, y - 0.6, x + 0.75, y, "white", ec=FURN, lw=0.6, z=6)
        ax.add_patch(Ellipse((x, y - 1.45), 1.2, 1.7, fc="white", ec=FURN, lw=0.6, zorder=6))
    elif facing == "left":
        rect(ax, x - 0.6, y - 0.75, x, y + 0.75, "white", ec=FURN, lw=0.6, z=6)
        ax.add_patch(Ellipse((x - 1.45, y), 1.7, 1.2, fc="white", ec=FURN, lw=0.6, zorder=6))
    else:
        rect(ax, x, y - 0.75, x + 0.6, y + 0.75, "white", ec=FURN, lw=0.6, z=6)
        ax.add_patch(Ellipse((x + 1.45, y), 1.7, 1.2, fc="white", ec=FURN, lw=0.6, zorder=6))


def basin(ax, x0, y0, x1, y1):
    rect(ax, x0, y0, x1, y1, "white", ec=FURN, lw=0.6, z=6)
    ax.add_patch(Ellipse(((x0 + x1) / 2, (y0 + y1) / 2), (x1 - x0) * 0.65, (y1 - y0) * 0.6, fc="white", ec=FURN, lw=0.5, zorder=7))


def shower(ax, x0, y0, x1, y1):
    rect(ax, x0, y0, x1, y1, "none", ec=FURN, lw=0.5, z=5, ls=(0, (2, 2)))
    ax.plot([x0, x1], [y0, y1], color=FURN, lw=0.35, zorder=5)
    ax.plot([x0, x1], [y1, y0], color=FURN, lw=0.35, zorder=5)


def tv(ax, x0, y0, x1, y1):
    rect(ax, x0, y0, x1, y1, "#cfcfcf", ec=FURN, lw=0.6, z=5)


def chair(ax, x0, y0, s=1.5):
    rect(ax, x0, y0, x0 + s, y0 + s, "white", ec=FURN, lw=0.6, z=5)


def car(ax, x0, y0, w=6.0, l=14.0):
    ax.add_patch(FancyBboxPatch((x0, y0), w, l, boxstyle="round,pad=0,rounding_size=1.2", fc="none", ec="#9a9a9a", lw=0.8, zorder=2))
    ax.add_patch(FancyBboxPatch((x0 + 0.6, y0 + 4.0), w - 1.2, 5.6, boxstyle="round,pad=0,rounding_size=0.6",
                                fc="none", ec="#b5b5b5", lw=0.6, zorder=2))


# ---- the plans ------------------------------------------------------------------
#
# Coordinates in feet, from the house's rear-left outside corner: x to the
# right, y towards the front (road side at the top of the page).

L0, L1 = 0.75, 12.75          # left bay (bedroom side), clear 12'-0"
R0, R1 = 13.125, 23.25        # right bay, clear 10'-1½"
WL = (12.75, 13.125)          # the wall between the bays
FRONT_IN = 34.75              # inside face of the front wall


def plan1(ax):
    rooms = [
        ("STAIR", "stair", (L0, 27.75, L1, FRONT_IN), None),
        ("VERANDAH", "verandah", (R0, 27.75, R1, D), "open"),
        ("LIVING ROOM", "living", (R0, 17.0, R1, 27.0), None, (16.9, 22.4)),
        ("LOBBY", "lobby", (R0, 9.0, 18.0, 16.625), None),
        ("TOILET", "toilet", (18.375, 9.0, R1, 16.625), None),
        ("KITCHEN", "kitchen", (R0, 0.75, R1, 8.625), None),
        ("BEDROOM 1", "bed", (L0, 13.0, L1, 27.0), None),
        ("BEDROOM 2", "bed", (L0, 0.75, L1, 12.625), None),
    ]
    draw_rooms(ax, rooms)
    rect(ax, 14.0, 16.6, 17.5, 17.025, COLOR["lobby"], z=3)               # arch, living to lobby
    stair(ax, (L0, 27.75, L1, FRONT_IN), "x", "lo", "b", foyer_side="hi")
    door(ax, "h", 27.0, 27.75, 14.5, 18.0, -1, fc=COLOR["living"])         # main door
    door(ax, "v", *WL, 31.25, 34.25, -1, hinge="hi", fc=COLOR["stair"])    # stair's own door
    door(ax, "v", *WL, 13.375, 16.375, -1, fc=COLOR["bed"])
    door(ax, "v", *WL, 9.375, 12.375, -1, hinge="hi", fc=COLOR["bed"])
    door(ax, "v", 18.0, 18.375, 9.5, 12.0, +1, fc=COLOR["toilet"])
    door(ax, "h", 8.625, 9.0, 13.5, 16.5, -1, fc=COLOR["kitchen"])
    window(ax, "v", 0, 0.75, 18.0, 23.0)
    window(ax, "v", 0, 0.75, 4.0, 9.0)
    window(ax, "h", 0, 0.75, 8.5, 11.5)
    window(ax, "v", 0, 0.75, 29.5, 32.5)
    window(ax, "h", FRONT_IN, D, 4.0, 8.0)
    window(ax, "h", 0, 0.75, 15.5, 19.5)
    window(ax, "v", 23.25, 24, 3.5, 5.5)
    window(ax, "v", 23.25, 24, 13.0, 15.0)
    window(ax, "v", 23.25, 24, 21.0, 23.0)
    window(ax, "h", 27.0, 27.75, 19.0, 22.5)
    for x in (0, 12.44, 23):
        for y in (0, 12.31, 26.875, 34.5):
            column(ax, x, y)
    # furniture
    bed(ax, 3.5, 13.0, 8.5, 19.5, "bottom"); wardrobe(ax, 1.0, 25.0, 7.5, 27.0)
    bed(ax, 2.0, 0.75, 7.0, 7.25, "bottom"); wardrobe(ax, 1.0, 10.625, 7.0, 12.625)
    sofa(ax, 20.25, 17.5, 23.0, 24.0, "right"); table(ax, 17.6, 17.9, 19.4, 20.9, chairs=0); tv(ax, R0, 19.5, 13.75, 24.0)
    basin(ax, 16.6, 13.4, 18.0, 14.8)
    wc(ax, R1, 10.5, "left"); shower(ax, 19.2, 13.8, R1, 16.625)
    counter(ax, (R0, 0.75, R1, 2.75), (21.25, 2.75, R1, 8.0)); sink(ax, 15.6, 0.95, 17.6, 2.55); hob(ax, 22.25, 5.2)
    fridge(ax, 18.6, 6.6, 20.8, 8.5)
    chair(ax, 15.0, 31.5); chair(ax, 17.2, 31.5)


def plan2(ax):
    rooms = [
        ("STAIR", "stair", (L0, 27.75, L1, FRONT_IN), None),
        ("VERANDAH", "verandah", (R0, 27.75, R1, D), "open"),
        ("BEDROOM 1", "bed", (L0, 16.0, L1, 27.0), None),
        ("TOILET", "toilet", (L0, 10.625, 6.75, 15.625), None),
        ("PASSAGE", "lobby", (7.125, 10.625, L1, 15.625), None),
        ("BEDROOM 2", "bed", (L0, 0.75, L1, 10.25), None),
        ("", "hall", (R0, 0.75, R1, 27.0), None),
    ]
    draw_rooms(ax, rooms)
    rect(ax, WL[0] - 0.01, 10.625, WL[1] + 0.01, 15.625, COLOR["lobby"], z=3)   # passage open to the hall
    rect(ax, 16.5, 8.625, R1, 9.0, "#8a8a8a", z=4)                          # breakfast counter (half wall)
    label(ax, "LIVING", (R0, 17.0, R1, 27.0), dims=f"{fi(R1 - R0)} × 10'-0\"", at=(16.9, 22.2))
    label(ax, "DINING", (R0, 9.0, R1, 17.0), dims=f"{fi(R1 - R0)} × 8'-0\"", at=(18.2, 16.3))
    label(ax, "OPEN KITCHEN", (R0, 0.75, R1, 8.625), dims=f"{fi(R1 - R0)} × 7'-10½\"", at=(17.0, 5.6))
    stair(ax, (L0, 27.75, L1, FRONT_IN), "x", "lo", "b", foyer_side="hi")
    door(ax, "h", 27.0, 27.75, 14.5, 18.0, -1, fc=COLOR["hall"])
    door(ax, "v", *WL, 31.25, 34.25, -1, hinge="hi", fc=COLOR["stair"])
    door(ax, "h", 15.625, 16.0, 8.5, 11.5, +1, hinge="hi", fc=COLOR["bed"])
    door(ax, "h", 10.25, 10.625, 8.5, 11.5, -1, hinge="hi", fc=COLOR["bed"])
    door(ax, "v", 6.75, 7.125, 11.75, 14.25, -1, fc=COLOR["toilet"])
    window(ax, "v", 0, 0.75, 19.0, 24.0)
    window(ax, "v", 0, 0.75, 11.75, 14.25)
    window(ax, "v", 0, 0.75, 3.0, 8.0)
    window(ax, "h", 0, 0.75, 8.5, 11.5)
    window(ax, "v", 0, 0.75, 29.5, 32.5)
    window(ax, "h", FRONT_IN, D, 4.0, 8.0)
    window(ax, "h", 0, 0.75, 15.5, 19.5)
    window(ax, "v", 23.25, 24, 3.0, 5.0)
    window(ax, "v", 23.25, 24, 12.0, 14.0)
    window(ax, "v", 23.25, 24, 21.0, 23.0)
    window(ax, "h", 27.0, 27.75, 19.0, 22.5)
    for x in (0, 12.44, 23):
        for y in (0, 9.94, 15.31, 26.875, 34.5):
            column(ax, x, y)
    bed(ax, 3.5, 20.5, 8.5, 27.0, "top"); wardrobe(ax, 1.0, 16.0, 7.5, 18.0)
    bed(ax, 2.0, 0.75, 7.0, 7.25, "bottom"); wardrobe(ax, 10.75, 1.0, L1, 6.5)
    wc(ax, L0, 12.3, "right"); basin(ax, 3.6, 14.3, 5.0, 15.625)
    sofa(ax, 20.25, 18.0, 23.0, 24.5, "right"); table(ax, 17.6, 17.6, 19.4, 20.6, chairs=0); tv(ax, R0, 19.5, 13.75, 24.0)
    table(ax, 16.6, 11.0, 19.8, 15.2, chairs=4)
    counter(ax, (R0, 0.75, R1, 2.75), (21.25, 2.75, R1, 8.625)); sink(ax, 16.6, 0.95, 18.6, 2.55); hob(ax, 22.25, 5.4)
    fridge(ax, R0 + 0.1, 3.2, 15.3, 5.4)
    chair(ax, 15.0, 31.5); chair(ax, 17.2, 31.5)


def plan3(ax):
    rooms = [
        ("KITCHEN + DINING", "kitchen", (L0, 22.5, L1, FRONT_IN), None, (7.6, 30.7)),
        ("BEDROOM 1", "bed", (L0, 11.625, L1, 22.125), None),
        ("BEDROOM 2", "bed", (L0, 0.75, L1, 11.25), None),
        ("VERANDAH", "verandah", (R0, 27.75, R1, D), "open"),
        ("LIVING ROOM", "living", (R0, 17.0, R1, 27.0), None, (16.6, 22.6)),
        ("PASSAGE", "lobby", (R0, 0.75, 16.125, 16.625), "vertical"),
        ("STAIR", "stair", (16.5, 6.625, R1, 16.625), "nolabel"),
        ("TOILET", "toilet", (16.5, 0.75, R1, 6.25), None),
    ]
    draw_rooms(ax, rooms)
    rect(ax, R0, 16.6, 16.125, 17.025, COLOR["lobby"], z=3)
    rect(ax, 16.5, 16.6, 19.69, 17.025, COLOR["stair"], z=3)
    stair(ax, (16.5, 6.625, R1, 16.625), "y", "lo", "a")
    label(ax, "STAIR", (19.9, 6.625, R1, 16.625), dims="6'-9\" × 10'-0\"", small=True)
    door(ax, "h", 27.0, 27.75, 17.5, 21.0, -1, fc=COLOR["living"])
    door(ax, "v", *WL, 23.25, 26.25, -1, hinge="hi", fc=COLOR["kitchen"])
    door(ax, "v", *WL, 29.5, 32.25, -1, fc=COLOR["kitchen"])                 # service door from the verandah
    door(ax, "v", *WL, 12.5, 15.5, -1, hinge="hi", fc=COLOR["bed"])
    door(ax, "v", *WL, 6.75, 9.75, -1, hinge="hi", fc=COLOR["bed"])
    door(ax, "v", 16.125, 16.5, 1.75, 4.25, +1, fc=COLOR["toilet"])
    window(ax, "h", FRONT_IN, D, 3.0, 9.0)
    window(ax, "v", 0, 0.75, 25.0, 29.0)
    window(ax, "v", 0, 0.75, 14.0, 19.0)
    window(ax, "v", 0, 0.75, 3.0, 8.0)
    window(ax, "h", 0, 0.75, 8.5, 11.5)
    window(ax, "h", 0, 0.75, 18.5, 21.0)
    window(ax, "v", 23.25, 24, 9.5, 12.0)
    window(ax, "v", 23.25, 24, 20.0, 22.5)
    window(ax, "h", 27.0, 27.75, 13.6, 16.9)
    for x in (0, 12.44, 23):
        for y in (0, 10.94, 21.81, 34.5):
            column(ax, x, y)
    column(ax, 12.44, 26.875); column(ax, 23, 26.875); column(ax, 23, 16.31)
    counter(ax, (L0, 32.75, 10.0, FRONT_IN), (L0, 25.5, 2.75, 32.75)); sink(ax, 4.5, 32.95, 6.5, 34.55); hob(ax, 1.75, 28.5)
    fridge(ax, 10.3, 32.6, 12.6, FRONT_IN)
    table(ax, 5.6, 24.4, 9.0, 28.4, chairs=4)
    bed(ax, 3.0, 15.625, 8.0, 22.125, "top"); wardrobe(ax, 1.0, 11.625, 7.5, 13.625)
    bed(ax, 2.0, 0.75, 7.0, 7.25, "bottom"); wardrobe(ax, 1.0, 9.25, 6.5, 11.25)
    sofa(ax, 20.25, 19.5, 23.0, 26.0, "right"); table(ax, 17.4, 17.9, 19.2, 21.1, chairs=0); tv(ax, R0, 17.8, 13.75, 22.6)
    wc(ax, R1, 2.4, "left"); basin(ax, 17.0, 4.85, 18.4, 6.25)
    chair(ax, 15.0, 31.5); chair(ax, 17.2, 31.5)


def plan4(ax):
    rooms = [
        ("LIVING ROOM", "living", (L0, 24.0, L1, FRONT_IN), None, (6.2, 26.6)),
        ("BEDROOM 1", "bed", (L0, 12.625, L1, 23.625), None),
        ("BEDROOM 2", "bed", (L0, 0.75, L1, 12.25), None),
        ("VERANDAH", "verandah", (R0, 27.75, R1, D), "open"),
        ("FAMILY LOBBY", "lobby", (R0, 9.375, 16.125, 27.0), "vertical"),
        ("STAIR", "stair", (16.5, 17.0, R1, 27.0), "nolabel"),
        ("TOILET", "toilet", (16.5, 9.375, R1, 16.625), None),
        ("KITCHEN", "kitchen", (R0, 0.75, R1, 9.0), None),
    ]
    draw_rooms(ax, rooms)
    rect(ax, 16.115, 17.0, 16.51, 20.0, COLOR["stair"], z=3)
    stair(ax, (16.5, 17.0, R1, 27.0), "y", "hi", "a")
    label(ax, "STAIR", (19.9, 17.0, R1, 27.0), dims="6'-9\" × 10'-0\"", small=True)
    door(ax, "h", 27.0, 27.75, 13.25, 16.0, -1, fc=COLOR["lobby"])          # family door
    door(ax, "v", *WL, 29.0, 32.5, -1, fc=COLOR["living"])                   # guests' door
    door(ax, "v", *WL, 24.125, 26.875, -1, hinge="hi", fc=COLOR["living"])
    door(ax, "v", *WL, 13.5, 16.5, -1, fc=COLOR["bed"])
    door(ax, "v", *WL, 9.375, 12.125, -1, hinge="hi", fc=COLOR["bed"])
    door(ax, "v", 16.125, 16.5, 11.5, 14.0, +1, fc=COLOR["toilet"])
    door(ax, "h", 9.0, 9.375, 13.25, 16.0, -1, fc=COLOR["kitchen"])
    window(ax, "h", FRONT_IN, D, 3.0, 9.0)
    window(ax, "v", 0, 0.75, 27.5, 31.5)
    window(ax, "v", 0, 0.75, 15.5, 20.5)
    window(ax, "v", 0, 0.75, 3.5, 8.5)
    window(ax, "h", 0, 0.75, 8.5, 11.5)
    window(ax, "h", 0, 0.75, 15.5, 19.5)
    window(ax, "v", 23.25, 24, 3.5, 5.5)
    window(ax, "v", 23.25, 24, 12.0, 14.0)
    window(ax, "v", 23.25, 24, 20.5, 23.0)
    for x in (0, 12.44, 23):
        for y in (0, 11.94, 23.31, 34.5):
            column(ax, x, y)
    column(ax, 12.44, 26.875); column(ax, 23, 26.875); column(ax, 23, 16.31)
    sofa(ax, 2.5, 32.0, 9.0, 34.6, "top"); chair(ax, 1.0, 27.8, 1.9); table(ax, 4.0, 28.4, 7.5, 30.4, chairs=0); tv(ax, 3.5, 24.0, 8.0, 24.6)
    bed(ax, 3.0, 17.125, 8.0, 23.625, "top"); wardrobe(ax, 1.0, 12.625, 7.5, 14.625)
    bed(ax, 2.0, 0.75, 7.0, 7.25, "bottom"); wardrobe(ax, 1.0, 10.25, 6.5, 12.25)
    wc(ax, R1, 10.9, "left"); shower(ax, 19.6, 13.6, R1, 16.625); basin(ax, 16.7, 15.1, 18.1, 16.5)
    counter(ax, (R0, 0.75, R1, 2.75), (21.25, 2.75, R1, 8.0)); sink(ax, 15.6, 0.95, 17.6, 2.55); hob(ax, 22.25, 5.3)
    fridge(ax, 18.6, 6.6, 20.8, 8.8)
    chair(ax, 18.0, 31.5); chair(ax, 20.2, 31.5)


def plan5(ax):
    rooms = [
        ("BEDROOM 1", "bed", (L0, 23.0, L1, FRONT_IN), None),
        ("BEDROOM 2", "bed", (L0, 12.0, L1, 22.625), None),
        ("KITCHEN + DINING", "kitchen", (L0, 0.75, L1, 11.625), None, (6.75, 9.9)),
        ("VERANDAH", "verandah", (R0, 27.75, R1, D), "open"),
        ("LIVING ROOM", "living", (R0, 17.0, R1, 27.0), None, (16.6, 22.6)),
        ("PASSAGE", "lobby", (R0, 0.75, 16.125, 16.625), "vertical"),
        ("STAIR", "stair", (16.5, 6.625, R1, 16.625), "nolabel"),
        ("TOILET", "toilet", (16.5, 0.75, R1, 6.25), None),
    ]
    draw_rooms(ax, rooms)
    rect(ax, R0, 16.6, 16.125, 17.025, COLOR["lobby"], z=3)
    rect(ax, 16.5, 16.6, 19.69, 17.025, COLOR["stair"], z=3)
    stair(ax, (16.5, 6.625, R1, 16.625), "y", "lo", "a")
    label(ax, "STAIR", (19.9, 6.625, R1, 16.625), dims="6'-9\" × 10'-0\"", small=True)
    door(ax, "h", 27.0, 27.75, 17.5, 21.0, -1, fc=COLOR["living"])
    door(ax, "v", *WL, 23.5, 26.5, -1, fc=COLOR["bed"])
    door(ax, "v", *WL, 13.0, 16.0, -1, hinge="hi", fc=COLOR["bed"])
    door(ax, "v", *WL, 7.5, 10.5, -1, hinge="hi", fc=COLOR["kitchen"])
    door(ax, "h", 0, 0.75, 9.0, 11.75, +1, hinge="hi", fc=COLOR["kitchen"])  # back door to the rear gap
    door(ax, "v", 16.125, 16.5, 1.75, 4.25, +1, fc=COLOR["toilet"])
    window(ax, "h", FRONT_IN, D, 3.0, 9.0)
    window(ax, "v", 0, 0.75, 26.0, 30.5)
    window(ax, "v", 0, 0.75, 15.0, 20.0)
    window(ax, "v", 0, 0.75, 3.5, 8.5)
    window(ax, "h", 0, 0.75, 3.0, 7.0)
    window(ax, "h", 0, 0.75, 18.5, 21.0)
    window(ax, "v", 23.25, 24, 9.5, 12.0)
    window(ax, "v", 23.25, 24, 20.0, 22.5)
    window(ax, "h", 27.0, 27.75, 13.6, 16.9)
    for x in (0, 12.44, 23):
        for y in (0, 11.31, 22.31, 34.5):
            column(ax, x, y)
    column(ax, 12.44, 26.875); column(ax, 23, 26.875); column(ax, 23, 16.31)
    bed(ax, 3.0, 23.0, 8.0, 29.5, "bottom"); wardrobe(ax, 10.75, 28.5, L1, 34.25)
    bed(ax, 3.0, 16.125, 8.0, 22.625, "top"); wardrobe(ax, 1.0, 12.0, 7.5, 14.0)
    counter(ax, (L0, 0.75, 8.5, 2.75), (L0, 2.75, 2.75, 11.0)); sink(ax, 0.95, 4.6, 2.55, 6.6); hob(ax, 5.2, 1.75)
    fridge(ax, 10.4, 4.0, 12.6, 6.2)
    table(ax, 5.0, 3.6, 8.4, 7.4, chairs=4)
    sofa(ax, 20.25, 19.5, 23.0, 26.0, "right"); table(ax, 17.4, 17.9, 19.2, 21.1, chairs=0); tv(ax, R0, 17.6, 13.75, 22.4)
    wc(ax, R1, 2.4, "left"); basin(ax, 17.0, 4.85, 18.4, 6.25)
    chair(ax, 15.0, 31.5); chair(ax, 17.2, 31.5)


def label(ax, name, box, dims=None, at=None, small=False):
    x0, y0, x1, y1 = box
    cx, cy = at or ((x0 + x1) / 2, (y0 + y1) / 2)
    fs = 5.6 if small else 6.6
    ax.text(cx, cy + (0.55 if dims else 0), name, ha="center", va="center", fontsize=fs, fontweight="bold", color=INK, zorder=9,
            bbox=dict(boxstyle="round,pad=0.12", fc=(1, 1, 1, 0.75), ec="none"))
    if dims:
        ax.text(cx, cy - 0.6, dims, ha="center", va="center", fontsize=fs - 0.8, color=INK, zorder=9,
                bbox=dict(boxstyle="round,pad=0.1", fc=(1, 1, 1, 0.75), ec="none"))


def draw_rooms(ax, rooms):
    rect(ax, 0, 0, W, D, WALL, z=1)
    for name, kind, box, how, *at in rooms:
        x0, y0, x1, y1 = box
        at = at[0] if at else None
        rect(ax, x0, y0, x1, y1, COLOR[kind], z=2)
        if how == "open":                                   # verandah: open at the front
            ax.plot([x0, x1], [D, D], color=INK, lw=0.6, ls=(0, (4, 2)), zorder=5)
            for k in range(3):                              # steps
                yy = D + 0.6 * (k + 1)
                ax.plot([x0 + 3.5 + 0.4 * k, x1 - 2.0 - 0.4 * k], [yy, yy], color=FURN, lw=0.6, zorder=2)
        if not name or how == "nolabel":
            continue
        if how == "vertical":
            ax.text((x0 + x1) / 2, (y0 + y1) / 2, name, rotation=90, ha="center", va="center", fontsize=5.5,
                    fontweight="bold", color=INK, zorder=9)
            continue
        vis_y1 = min(y1, FRONT_IN) if how == "open" else y1
        label(ax, name, (x0, y0, x1, vis_y1), dims=f"{fi(x1 - x0)} × {fi(vis_y1 - y0 if how != 'open' else y1 - y0)}",
              at=at, small=(x1 - x0) < 6 or (y1 - y0) < 6)


def dim(ax, p, q, text, off, side, fs=6.2):
    (x0, y0), (x1, y1) = p, q
    if side in ("top", "bottom"):
        y = y0 + off
        ax.plot([x0, x1], [y, y], color=INK, lw=0.6, zorder=8)
        for x in (x0, x1):
            ax.plot([x - 0.35, x + 0.35], [y - 0.35, y + 0.35], color=INK, lw=0.8, zorder=8)
            ax.plot([x, x], [y0, y], color="#888", lw=0.35, zorder=8)
        ax.text((x0 + x1) / 2, y + (0.5 if side == "top" else -0.5), text, ha="center",
                va="bottom" if side == "top" else "top", fontsize=fs, color=INK, zorder=9)
    else:
        x = x0 + off
        ax.plot([x, x], [y0, y1], color=INK, lw=0.6, zorder=8)
        for y in (y0, y1):
            ax.plot([x - 0.35, x + 0.35], [y - 0.35, y + 0.35], color=INK, lw=0.8, zorder=8)
            ax.plot([x0, x], [y, y], color="#888", lw=0.35, zorder=8)
        ax.text(x + (-0.5 if side == "left" else 0.5), (y0 + y1) / 2, text, rotation=90, ha="right" if side == "left" else "left",
                va="center", fontsize=fs, color=INK, zorder=9)


def site(ax, full=True):
    """The plot, its open spaces and the outer dimensions."""
    front = D + FRONT_OPEN
    rl, rr = front - PLOT_LEFT, front - PLOT_RIGHT
    px0, px1 = -LEFT_GAP, W + RIGHT_GAP
    if full:
        ax.add_patch(Polygon([(px0, rl), (px1, rr), (px1, front), (px0, front)], closed=True, fc="#fafaf7", ec=INK, lw=1.1,
                             ls=(0, (6, 3)), zorder=0))
        car(ax, 15.5, D + 2.2)
        ax.text(6.0, D + 9.5, "OPEN SPACE / PARKING", ha="center", va="center", fontsize=7, color="#777", zorder=2)
        ax.text(6.0, D + 7.8, f"28'-0\" × {fi(FRONT_OPEN)}", ha="center", va="center", fontsize=6, color="#777", zorder=2)
        ax.text((px0 + px1) / 2, front + 3.4, "ROAD / FRONT SIDE", ha="center", va="center", fontsize=7.5, fontweight="bold",
                color=INK)
        ax.annotate("", xy=((px0 + px1) / 2, front + 0.3), xytext=((px0 + px1) / 2, front + 2.5),
                    arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.0))
        dim(ax, (px0, front), (px1, front), "28'-0\"", 1.4, "top")
        dim(ax, (px0, rl), (px0, front), "57'-0\"", -2.2, "left")
        dim(ax, (px1, rr), (px1, front), "53'-6½\"", 2.0, "right")
        dim(ax, (W, D), (W, front), fi(FRONT_OPEN), -1.2, "right", fs=5.6)
        ax.text(-1.5, 18, "3'-0\" open", rotation=90, ha="center", va="center", fontsize=5.5, color="#666")
        ax.text(24.5, 6.5, "1'-0\"", rotation=90, ha="center", va="center", fontsize=5.0, color="#666")
    dim(ax, (0, 0), (W, 0), "24'-0\"", -2.4 if full else -1.6, "bottom")
    dim(ax, (W, 0), (W, D), "35'-6\"", 6.4 if full else 1.8, "right")


PLANS = [
    dict(
        draw=plan1, title="Plan 1 · Closest to your drawing",
        idea="Your layout with a proper lobby: every room opens off it, and none through another.",
        rooms=[("Bedroom 1", "12'-0\" × 14'-0\""), ("Bedroom 2", "12'-0\" × 11'-10½\""), ("Living", "10'-1½\" × 10'-0\""),
               ("Kitchen", "10'-1½\" × 7'-10½\""), ("Toilet", "4'-10½\" × 7'-7½\""), ("Lobby", "4'-10½\" × 7'-7½\""),
               ("Verandah", "10'-1½\" × 7'-9\""), ("Stair", "12'-0\" × 7'-0\"")],
        good=["Biggest bedrooms of the five: the same as your drawing.",
              "The main door opens straight into the living room.",
              "Toilet and kitchen open off the lobby, not off the living room, and the toilet door can't be seen from the sofa.",
              "The stair has its own door from the verandah, so the upper floor can be let out separately later."],
        cost="The kitchen is smaller than in your drawing (it gives up space for the lobby) and still gets light only from the narrow rear gap."),
    dict(
        draw=plan2, title="Plan 2 · Open family hall",
        idea="Living, dining and kitchen as one long hall; the bedrooms share a toilet between them.",
        rooms=[("Bedroom 1", "12'-0\" × 11'-0\""), ("Bedroom 2", "12'-0\" × 9'-6\""),
               ("Living + dining + kitchen", "10'-1½\" × 26'-3\""), ("Toilet", "6'-0\" × 5'-0\""),
               ("Verandah", "10'-1½\" × 7'-9\""), ("Stair", "12'-0\" × 7'-0\"")],
        good=["One big family space, about 265 sq ft, with a dining table for 4 and a breakfast counter.",
              "The toilet sits between the bedrooms, with a real window on the 3'-0\" side.",
              "Whoever cooks can see the living room and the children.",
              "The stair has its own door from the verandah."],
        cost="Smaller bedrooms. Smoke and smells from Nepali cooking reach the hall, so fit a strong chimney or a glass partition."),
    dict(
        draw=plan3, title="Plan 3 · Bright kitchen-dining at the front",
        idea="The kitchen moves to the front-left corner: windows on two sides and room for a dining table.",
        rooms=[("Kitchen + dining", "12'-0\" × 12'-3\""), ("Bedroom 1", "12'-0\" × 10'-6\""), ("Bedroom 2", "12'-0\" × 10'-6\""),
               ("Living", "10'-1½\" × 10'-0\""), ("Toilet", "6'-9\" × 5'-6\""), ("Stair", "6'-9\" × 10'-0\""),
               ("Verandah", "10'-1½\" × 7'-9\"")],
        good=["The best kitchen of the five: daylight from the front and the side, with a table for 4.",
              "A service door from the verandah, for vegetables and gas cylinders, so you don't cross the living room.",
              "You can see the gate and the parking from the kitchen.",
              "Toilet at the back, well away from the kitchen."],
        cost="The bedrooms are 10'-6\" deep instead of 14'-0\" and 11'-10½\". The stair is inside the house, for family use."),
    dict(
        draw=plan4, title="Plan 4 · Guest living room + private family side",
        idea="Guests use the living room's own door; the family enters a lobby leading to the rest of the house.",
        rooms=[("Living", "12'-0\" × 10'-9\""), ("Bedroom 1", "12'-0\" × 11'-0\""), ("Bedroom 2", "12'-0\" × 11'-6\""),
               ("Kitchen", "10'-1½\" × 8'-3\""), ("Toilet", "6'-9\" × 7'-3\""), ("Family lobby", "3'-0\" wide"),
               ("Stair", "6'-9\" × 10'-0\""), ("Verandah", "10'-1½\" × 7'-9\"")],
        good=["The brightest living room: windows to the front yard and the side.",
              "Guests never see the bedrooms, the kitchen or the toilet.",
              "The biggest toilet, with room for a shower and a basin.",
              "The stair starts from the family lobby, so the upper floor can be closed off for tenants."],
        cost="The 3'-0\" lobby is a long corridor. The kitchen is at the back, with light only from the narrow rear gap, as in your drawing."),
    dict(
        draw=plan5, title="Plan 5 · Kitchen-dining at the back, bedroom at the front",
        idea="The kitchen takes the rear-left corner, where the open gaps are widest, with a back door for washing.",
        rooms=[("Bedroom 1", "12'-0\" × 11'-9\""), ("Bedroom 2", "12'-0\" × 10'-7½\""), ("Kitchen + dining", "12'-0\" × 10'-10½\""),
               ("Living", "10'-1½\" × 10'-0\""), ("Toilet", "6'-9\" × 5'-6\""), ("Stair", "6'-9\" × 10'-0\""),
               ("Verandah", "10'-1½\" × 7'-9\"")],
        good=["A big kitchen with dining, real windows on the side and the back, and a back door to the 4'-0\" rear gap (washing, gas).",
              "Bedroom 1 gets the front light and a view of the yard.",
              "Toilet and kitchen don't share a wall.",
              "Bedrooms are of a good, even size."],
        cost="Bedroom 1's door opens from the living room, and a bedroom on the front needs curtains for privacy."),
]


def page(plan, n):
    fig = plt.figure(figsize=(8.27, 11.69), dpi=200)
    fig.patch.set_facecolor("white")
    fig.text(0.04, 0.965, plan["title"], fontsize=15, fontweight="bold", color=INK)
    fig.text(0.04, 0.945, plan["idea"], fontsize=8.5, color="#444")
    ax = fig.add_axes([0.0, 0.06, 0.66, 0.87])
    ax.set_aspect("equal")
    ax.axis("off")
    site(ax)
    plan["draw"](ax)
    ax.set_xlim(-9.0, 33.0)
    ax.set_ylim(-8.0, D + FRONT_OPEN + 5.0)
    x, y = 0.655, 0.905
    fig.text(x, y, "ROOMS (clear sizes)", fontsize=8.5, fontweight="bold", color=INK)
    y -= 0.022
    for name, size in plan["rooms"]:
        fig.text(x, y, name, fontsize=7.6, color=INK)
        fig.text(x + 0.33, y, size, fontsize=7.6, color=INK, ha="right")
        y -= 0.0185
    y -= 0.015
    fig.text(x, y, "WHY THIS PLAN", fontsize=8.5, fontweight="bold", color="#1f6f43")
    y -= 0.02
    for g in plan["good"]:
        lines = textwrap.wrap(g, 40)
        fig.text(x, y, "• " + lines[0], fontsize=7.4, color=INK)
        for ln in lines[1:]:
            y -= 0.016
            fig.text(x + 0.012, y, ln, fontsize=7.4, color=INK)
        y -= 0.022
    y -= 0.008
    fig.text(x, y, "TRADE-OFF", fontsize=8.5, fontweight="bold", color="#a0522d")
    y -= 0.02
    for ln in textwrap.wrap(plan["cost"], 42):
        fig.text(x, y, ln, fontsize=7.4, color=INK)
        y -= 0.016
    y -= 0.02
    fig.text(x, y, "SAME IN ALL FIVE", fontsize=8.5, fontweight="bold", color=INK)
    y -= 0.02
    for ln in textwrap.wrap("Your drawing's footprint (24'-0\" × 35'-6\") and setbacks, so the approved site layout "
                            "still works. 9\" outer walls, 4½\" partitions, 12\" × 12\" columns at likely positions: your "
                            "engineer confirms the structure.", 42):
        fig.text(x, y, ln, fontsize=7.0, color="#555")
        y -= 0.015
    keys = [("Bedroom", "bed"), ("Living", "living"), ("Kitchen", "kitchen"), ("Toilet", "toilet"), ("Stair", "stair"),
            ("Verandah", "verandah"), ("Lobby / passage", "lobby")]
    ky = 0.055
    for i, (name, k) in enumerate(keys):
        kx = 0.04 + i * 0.135
        fig.patches.append(Rectangle((kx, ky), 0.018, 0.011, transform=fig.transFigure, fc=COLOR[k], ec="#999", lw=0.5))
        fig.text(kx + 0.024, ky + 0.002, name, fontsize=6.6, color=INK)
    fig.text(0.04, 0.025, f"Plan {n} of 5 · Ground floor · Not to scale · Sizes in feet and inches", fontsize=6.6, color="#777")
    return fig


def overview():
    fig, axes = plt.subplots(1, 5, figsize=(16, 6.9), dpi=170)
    fig.patch.set_facecolor("white")
    fig.suptitle("Five ground-floor plans for the same footprint (24'-0\" × 35'-6\") · road side at the top", fontsize=13,
                 fontweight="bold", y=0.98)
    for i, (ax, plan) in enumerate(zip(axes, PLANS), 1):
        ax.set_aspect("equal")
        ax.axis("off")
        plan["draw"](ax)
        dim(ax, (0, 0), (W, 0), "24'-0\"", -1.4, "bottom", fs=5)
        ax.set_xlim(-1.0, 25.0)
        ax.set_ylim(-3.2, D + 2.6)
        ax.set_title(textwrap.fill(plan["title"], 26), fontsize=9.5, fontweight="bold", pad=4)
    fig.subplots_adjust(left=0.01, right=0.99, top=0.88, bottom=0.02, wspace=0.05)
    return fig


def main():
    pages = []
    for n, plan in enumerate(PLANS, 1):
        fig = page(plan, n)
        fig.savefig(HERE / f"plan-{n}.png", dpi=200)
        pages.append(fig)
    ov = overview()
    ov.savefig(HERE / "all-plans.png", dpi=170)
    with PdfPages(HERE / "house-plans.pdf") as pdf:
        pdf.savefig(ov)
        for fig in pages:
            pdf.savefig(fig)
    print("wrote plan-1.png ... plan-5.png, all-plans.png, house-plans.pdf")


if __name__ == "__main__":
    main()
