"""The quote poster with the phone photo: the sitter at a wooden table with a
glass of chiya and an old radio in front of him, on the mustard wall.

Reuses the wall, light, bulb and illustration of make_poster.py. The sitter is
cut out with U2-Net's human segmentation model, which keeps his arms and hands
(IS-Net drops them here). Below the table edge the café table, coffee cup,
water glass and tissue box are replaced by a painted tabletop; the radio and
the tea glass are drawn, not copied from any artwork.

    pip install numpy opencv-python-headless onnxruntime pillow
    python3 media/poster/make_poster_tea.py [fonts_dir]
"""

import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw

import make_poster as mp

HERE = Path(__file__).resolve().parent
PHOTO = HERE / "cafe-phone.jpg"
OUTPUT = HERE / "poster-tea.jpg"
U2NET = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_human_seg.onnx"

W, H = mp.W, mp.H
XX, YY = mp.XX, mp.YY
TABLE_Y = 1842          # the table's front edge in cafe-phone.jpg

mp.TITLE = "ME  &  MY  CHIYA"
mp.QUOTE = [
    "Spent years scrolling for happiness.",
    "Turns out it was just a cup of chiya",
    "and an old song away.",
]


# ------------------------------------------------------------------ cut-out ----

def u2net(session, bgr):
    x = cv2.resize(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB), (320, 320), interpolation=cv2.INTER_AREA)
    x = (x.astype(np.float32) / 255 - np.array([0.485, 0.456, 0.406], np.float32)) \
        / np.array([0.229, 0.224, 0.225], np.float32)
    p = session.run(None, {"input.1": x.transpose(2, 0, 1)[None]})[0][0, 0]
    p = (p - p.min()) / (p.max() - p.min() + 1e-6)
    return cv2.resize(p, (bgr.shape[1], bgr.shape[0]), interpolation=cv2.INTER_CUBIC)


def cutout(photo):
    model = mp.CACHE / "u2net_human_seg.onnx"
    if not model.exists():
        mp.CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(U2NET, model)
    s = ort.InferenceSession(str(model), providers=["CPUExecutionProvider"])
    a = u2net(s, photo)
    # A second, closer look at the lower half, where the arms and hands are.
    y0 = 1100
    a[y0:] = np.maximum(a[y0:], u2net(s, photo[y0:]))
    a = np.clip((a - 0.4) / 0.25, 0, 1)
    a[TABLE_Y + 4:] = 0           # the painted table takes over below its edge
    # The water glass and the tissue at his left elbow are café, not him.
    hsv = cv2.cvtColor(photo, cv2.COLOR_BGR2HSV).astype(np.int32)
    tissue = (hsv[..., 2] > 185) & (hsv[..., 1] < 50)
    tissue[:1600] = False
    tissue[:, 340:] = False
    a[cv2.dilate(tissue.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0] = 0
    # Beyond the books and the glass, the forearm's underside: a slanted, soft
    # edge rather than the café glass it was seen through.
    cut = np.zeros(a.shape, np.uint8)
    cv2.fillPoly(cut, [np.array([(0, 1548), (120, 1606), (120, 2000), (0, 2000)], np.int32)], 1)
    a *= 1 - cv2.GaussianBlur(cut.astype(np.float32), (0, 0), 2.5)
    n, lab, st, _ = cv2.connectedComponentsWithStats((a > 0.5).astype(np.uint8), 8)
    keep = max(range(1, n), key=lambda i: st[i, 4])
    a[lab != keep] = 0            # just the sitter: no stray café furniture
    a = cv2.erode(a, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(a, (0, 0), 1.0)


# ------------------------------------------------------------------- props ----

def layer(draw_fn):
    """Draw RGBA with PIL at 2x and return (bgr float, alpha float) at 1x."""
    big = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(big), 2)
    a = np.asarray(big.resize((W, H), Image.LANCZOS), np.float32) / 255
    return a[..., 2::-1].copy(), a[..., 3:4].copy()


def over(img, rgb, a):
    return img * (1 - a) + rgb * a


INK_RGB = (43, 28, 23)


def table(img):
    """A wooden tabletop: surface, then the darker front edge."""
    top, edge = int(TABLE_Y * 1.44 - 180), 2652
    rng = np.random.default_rng(21)
    rows = np.arange(H, dtype=np.float32)
    grain = cv2.resize(rng.normal(0, 1, (H // 6, 8)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
    streak = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), sigmaX=40, sigmaY=1.2)
    wood = np.array([40, 74, 128], np.float32) / 255 * (1 + 0.06 * grain[..., None] + 0.10 * streak[..., None])
    light = (1.08 - 0.22 * (XX / W))[..., None]           # the bulb is on the left
    surface = wood * light * (1 + 0.12 * ((rows - top) / (edge - top)))[:, None, None]
    front = wood * 0.62 * light
    out = img.copy()
    band = (rows[:, None] >= top) & np.ones((1, W), bool)
    out[band & (rows[:, None] < edge)] = surface[band & (rows[:, None] < edge)]
    out[rows >= edge] = front[rows >= edge]
    # A lit rim along the back edge and the front edge, and ink lines.
    for y, c, t in ((top, (0.55, 0.72, 0.86), 4), (edge, (0.36, 0.52, 0.70), 5)):
        out[y:y + t] = out[y:y + t] * 0.4 + np.array(c, np.float32) * 0.6
    out[top - 2:top] = mp.INK
    out[edge - 2:edge] = mp.INK
    return out


def contact_shadow(img, cx, y, rx, ry, strength):
    d = ((XX - cx) / rx) ** 2 + ((YY - y) / ry) ** 2
    sh = cv2.GaussianBlur(np.clip(1 - d, 0, 1), (0, 0), 14)[..., None]
    return img * (1 - strength * sh)


def radio(img, cx, base, w, h):
    """A vintage table radio: wooden case, cloth grille, dial strip, two knobs."""
    def draw(d, k):
        x0, x1, y0, y1 = (cx - w / 2) * k, (cx + w / 2) * k, (base - h) * k, (base - 14) * k
        r = 58 * k
        # Feet.
        for fx in (x0 + 70 * k, x1 - 110 * k):
            d.rounded_rectangle((fx, y1 - 6 * k, fx + 40 * k, base * k), 8 * k, fill=(35, 24, 20, 255))
        # Case.
        d.rounded_rectangle((x0, y0, x1, y1), r, fill=(112, 52, 30, 255), outline=INK_RGB + (255,), width=5 * k)
        d.rounded_rectangle((x0 + 12 * k, y0 + 10 * k, x1 - 12 * k, y0 + 34 * k), 12 * k, fill=(150, 78, 46, 255))
        # Grille: cloth behind a brass frame.
        gx0, gx1, gy0, gy1 = x0 + 46 * k, x1 - 46 * k, y0 + 48 * k, y0 + h * 0.58 * k
        d.rounded_rectangle((gx0 - 8 * k, gy0 - 8 * k, gx1 + 8 * k, gy1 + 8 * k), 22 * k, fill=(196, 160, 98, 255))
        d.rounded_rectangle((gx0, gy0, gx1, gy1), 16 * k, fill=(58, 40, 30, 255))
        step = 11 * k
        y = gy0 + step
        while y < gy1 - 4 * k:
            d.line((gx0 + 10 * k, y, gx1 - 10 * k, y), fill=(92, 68, 50, 255), width=3 * k)
            y += step
        x = gx0 + step
        while x < gx1 - 4 * k:
            d.line((x, gy0 + 8 * k, x, gy1 - 8 * k), fill=(74, 54, 40, 255), width=1 * k)
            x += step
        # Dial strip with ticks and a red needle.
        dy0, dy1 = gy1 + 26 * k, gy1 + 82 * k
        dx0, dx1 = x0 + 140 * k, x1 - 140 * k
        d.rounded_rectangle((dx0, dy0, dx1, dy1), 10 * k, fill=(236, 222, 186, 255),
                            outline=(120, 90, 60, 255), width=3 * k)
        n = 22
        for i in range(n + 1):
            tx = dx0 + 18 * k + (dx1 - dx0 - 36 * k) * i / n
            ln = 22 * k if i % 5 == 0 else 12 * k
            d.line((tx, dy0 + 10 * k, tx, dy0 + 10 * k + ln), fill=(70, 50, 40, 255), width=2 * k)
        nx = dx0 + (dx1 - dx0) * 0.62
        d.line((nx, dy0 + 6 * k, nx, dy1 - 6 * k), fill=(196, 40, 30, 255), width=4 * k)
        # Knobs either side of the dial.
        for kx in (x0 + 80 * k, x1 - 80 * k):
            ky = (dy0 + dy1) / 2
            for rr, col in ((40, (60, 44, 34)), (34, (214, 200, 172)), (26, (178, 160, 130)), (10, (90, 70, 56))):
                d.ellipse((kx - rr * k, ky - rr * k, kx + rr * k, ky + rr * k), fill=col + (255,))
        # A row of keys.
        ky0 = dy1 + 18 * k
        for i in range(5):
            kx0 = cx * k - 2.5 * 46 * k + i * 46 * k
            d.rounded_rectangle((kx0 + 4 * k, ky0, kx0 + 40 * k, ky0 + 26 * k), 5 * k,
                                fill=(232, 220, 196, 255), outline=(110, 84, 60, 255), width=2 * k)
    rgb, a = layer(draw)
    img = contact_shadow(img, cx, base - 4, w * 0.52, 26, 0.45)
    return over(img, rgb, a)


def tea(img, cx, base, w_top, w_bot, h, fill):
    """A glass of tea on a wooden coaster, with a little steam."""
    top = base - h

    def draw(d, k):
        # Coaster.
        d.ellipse(((cx - w_bot * 0.85) * k, (base - 20) * k, (cx + w_bot * 0.85) * k, (base + 26) * k),
                  fill=(102, 60, 36, 255), outline=INK_RGB + (255,), width=4 * k)
        d.ellipse(((cx - w_bot * 0.78) * k, (base - 22) * k, (cx + w_bot * 0.78) * k, (base + 14) * k),
                  fill=(140, 88, 54, 255))
        # Tea: deepest at the foot, glowing amber near the top, lit from the left.
        tea_top = base - h * fill
        steps = 60
        for i in range(steps):
            t0 = i / steps
            y0 = tea_top + (base - 10 - tea_top) * t0
            y1 = tea_top + (base - 10 - tea_top) * (t0 + 1 / steps) + 1
            wl = w_top + (w_bot - w_top) * ((y0 - top) / h)
            col = np.array([214, 118, 38]) * (1 - t0) ** 1.5 + np.array([124, 50, 16]) * (1 - (1 - t0) ** 1.5)
            d.rectangle(((cx - wl / 2) * k, y0 * k, (cx + wl / 2) * k, y1 * k),
                        fill=tuple(int(c) for c in col) + (246,))
        # Tea surface.
        ws = w_top + (w_bot - w_top) * ((tea_top - top) / h)
        d.ellipse(((cx - ws / 2) * k, (tea_top - 14) * k, (cx + ws / 2) * k, (tea_top + 14) * k),
                  fill=(226, 150, 72, 252))
        d.ellipse(((cx - ws / 2 + 14) * k, (tea_top - 8) * k, (cx + ws / 2 - 14) * k, (tea_top + 8) * k),
                  outline=(246, 196, 130, 220), width=3 * k)
        # Glass: the empty part above the tea is a faint sheen.
        d.polygon([((cx - w_top / 2) * k, top * k), ((cx + w_top / 2) * k, top * k),
                   ((cx + ws / 2) * k, tea_top * k), ((cx - ws / 2) * k, tea_top * k)],
                  fill=(255, 250, 240, 70))
        # Highlights and outline.
        d.line(((cx - w_top / 2 + 26) * k, (top + 30) * k, (cx - w_bot / 2 + 26) * k, (base - 40) * k),
               fill=(255, 245, 230, 150), width=10 * k)
        d.line(((cx + w_top / 2 - 34) * k, (top + 40) * k, (cx + w_bot / 2 - 30) * k, (base - 60) * k),
               fill=(255, 245, 230, 90), width=5 * k)
        d.polygon([((cx - w_top / 2) * k, top * k), ((cx + w_top / 2) * k, top * k),
                   ((cx + w_bot / 2) * k, (base - 10) * k), ((cx - w_bot / 2) * k, (base - 10) * k)],
                  outline=INK_RGB + (230,), width=4 * k)
        d.ellipse(((cx - w_top / 2) * k, (top - 14) * k, (cx + w_top / 2) * k, (top + 14) * k),
                  outline=(255, 250, 240, 220), width=4 * k)
    rgb, a = layer(draw)
    img = contact_shadow(img, cx, base + 6, w_bot * 0.95, 22, 0.40)
    img = over(img, rgb, a)
    # Steam: three wisps rising and fading.
    steam = np.zeros((H, W), np.float32)
    rng = np.random.default_rng(5)
    for j, dx in enumerate((-40, 6, 48)):
        ys = np.linspace(top - 10, top - 300 - 40 * j, 80)
        ph = rng.uniform(0, 6)
        xs = cx + dx + 26 * np.sin((ys - top) / 55 + ph) * np.linspace(0.4, 1.2, 80)
        pts = np.stack([xs, ys], 1).astype(np.int32)
        for i in range(len(pts) - 1):
            fade = (1 - i / len(pts)) ** 1.4
            cv2.line(steam, tuple(pts[i]), tuple(pts[i + 1]), float(fade), 11, cv2.LINE_AA)
    steam = cv2.GaussianBlur(steam, (0, 0), 6)[..., None] * 0.7
    return 1 - (1 - img) * (1 - steam * np.array([0.95, 0.97, 1.0], np.float32))


def books(img, x0, base):
    """Two hardbacks lying on the table, spines toward us."""
    specs = [  # (left offset, width, height, cover rgb, band rgb)
        (0, 470, 74, (46, 84, 92), (196, 160, 98)),
        (30, 410, 62, (128, 46, 40), (220, 190, 130)),
    ]

    def draw(d, k):
        y = base
        for dx, w, h, cover, band in specs:
            bx0, bx1, by0, by1 = (x0 + dx) * k, (x0 + dx + w) * k, (y - h) * k, y * k
            d.rounded_rectangle((bx0, by0, bx1, by1), 10 * k, fill=cover + (255,), outline=INK_RGB + (255,), width=4 * k)
            d.rectangle((bx0 + 8 * k, by0 + 6 * k, bx1 - 8 * k, by0 + 14 * k), fill=tuple(min(255, c + 40) for c in cover) + (255,))
            for bx in (bx0 + 34 * k, bx1 - 52 * k):
                d.rectangle((bx, by0 + 8 * k, bx + 14 * k, by1 - 8 * k), fill=band + (255,))
            d.line((bx0 + 70 * k, (by0 + by1) / 2, bx0 + 70 * k + w * 0.45 * k, (by0 + by1) / 2), fill=band + (255,), width=4 * k)
            y -= h
    rgb, a = layer(draw)
    img = contact_shadow(img, x0 + 235, base + 2, 270, 22, 0.40)
    return over(img, rgb, a)


# -------------------------------------------------------------------- main ----

def main():
    photo = cv2.imread(str(PHOTO))
    ph, pw = photo.shape[:2]
    print("cutting out")
    alpha = cutout(photo)
    print("illustrating")
    art = mp.illustrate(photo)
    lum = (art @ np.array([0.114, 0.587, 0.299], np.float32))[..., None]
    art = art * np.array([0.93, 0.99, 1.04], np.float32) + mp.WALL * 0.06 * (1 - lum)
    core = (alpha > 0.97).astype(np.float32)[..., None]
    inside = cv2.GaussianBlur(art * core, (0, 0), 4) / (cv2.GaussianBlur(core, (0, 0), 4)[..., None] + 1e-4)
    edge = np.clip((1 - alpha) * 4, 0, 1)[..., None] * (alpha > 0.02)[..., None]
    art = art * (1 - edge) + inside * edge

    s = W / pw
    m = np.float32([[s, 0, 0], [0, s, H - ph * s]])
    art_c = cv2.warpAffine(art, m, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
    a_c = cv2.warpAffine(alpha, m, (W, H), flags=cv2.INTER_LINEAR)[..., None]

    print("painting")
    img = mp.wall()
    img *= 1 - 0.20 * mp.leaf_shadows()[..., None]
    shadow = cv2.GaussianBlur(np.roll(np.roll(a_c[..., 0], 40, 1), 22, 0), (0, 0), 28)
    img *= 1 - 0.22 * shadow[..., None]
    img = img * (1 - a_c) + art_c * a_c
    img = table(img)
    img = radio(img, cx=1340, base=2600, w=680, h=390)
    img = books(img, x0=24, base=2612)
    img = tea(img, cx=262, base=2478, w_top=274, w_bot=236, h=336, fill=0.84)
    v = 1 - 0.16 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2) ** 1.6
    img *= np.clip(v, 0.7, 1)[..., None]
    img = mp.bulb(img)
    img = mp.text(img)
    img += np.random.default_rng(1).normal(0, 0.008, img.shape).astype(np.float32)
    cv2.imwrite(str(OUTPUT), (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 96])
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
