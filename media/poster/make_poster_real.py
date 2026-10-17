"""The tea-and-radio poster in a realistic finish rather than an illustrated one.

The sitter is the photograph itself, graded to the room's warm light, with a
little light wrap at his edges. The radio, the glass of chiya and the books
are drawn as shapes and then lit: a height field from each shape's distance
to its edge gives surface normals, so wood, brass, chrome, cloth and glass
catch a bulb hanging to the upper left, with specular highlights, contact
shadows and soft reflections in a varnished tabletop. The tea is shaded by
how much of it light passes through, and the clear glass refracts the scene
behind it.

    pip install numpy opencv-python-headless onnxruntime pillow
    python3 media/poster/make_poster_real.py [fonts_dir]
"""

from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

import make_poster as mp
import make_poster_tea as tp

HERE = Path(__file__).resolve().parent
OUTPUT = HERE / "poster-real.jpg"
W, H = mp.W, mp.H
XX, YY = mp.XX, mp.YY
TOP = int(tp.TABLE_Y * 1.44 - 180)      # the tabletop's back edge on the canvas
EDGE = 2652                             # its rounded front edge

LIGHT = np.array([-0.55, -0.65, 0.52])
LIGHT /= np.linalg.norm(LIGHT)
HALF = (LIGHT + [0, 0, 1]) / np.linalg.norm(LIGHT + [0, 0, 1])
WARM = np.array([0.80, 0.93, 1.0], np.float32)          # BGR of the bulb's light


def bgr(rgb):
    return np.array(rgb[::-1], np.float32) / 255


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def mask(size, fn, ss=3):
    w, h = size
    im = Image.new("L", (w * ss, h * ss), 0)
    fn(ImageDraw.Draw(im), ss)
    return np.asarray(im.resize((w, h), Image.LANCZOS), np.float32) / 255


def bevel(m, radius):
    """Diffuse and half-vector terms for a shape whose edges round over."""
    d = cv2.distanceTransform((m > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    hgt = np.sin(np.clip(d / radius, 0, 1) * np.pi / 2) * radius
    hgt = cv2.GaussianBlur(hgt, (0, 0), max(0.8, radius * 0.08))
    gy, gx = np.gradient(hgt)
    n = np.dstack([-gx, -gy, np.ones_like(gx)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    return np.clip(n @ LIGHT, 0, 1), np.clip(n @ HALF, 0, 1)


def noise(shape, sigma, seed, sx=None):
    rng = np.random.default_rng(seed)
    n = cv2.GaussianBlur(rng.normal(0, 1, shape).astype(np.float32), (0, 0),
                         sigmaX=sx if sx else sigma, sigmaY=sigma)
    return n / (n.std() + 1e-6)


def wood(shape, seed, base_rgb, period=7.0):
    h, w = shape
    warp = noise(shape, 3, seed, sx=60)
    fine = noise(shape, 0.7, seed + 1, sx=14)
    yy = np.arange(h, dtype=np.float32)[:, None]
    rings = np.sin(2 * np.pi * yy / period + 2.2 * warp)
    g = 0.55 * rings + 0.25 * fine + 0.2 * noise(shape, 12, seed + 2, sx=90)
    return bgr(base_rgb) * (1 + 0.11 * g)[..., None]


def lit(albedo, diff, nh, ambient=0.5, kd=0.85, gloss=35, ks=0.3):
    return albedo * (ambient + kd * diff)[..., None] + (nh ** gloss * ks)[..., None] * WARM


def paste(img, rgb, a, ox, oy):
    h, w = a.shape[:2]
    y0, x0 = max(oy, 0), max(ox, 0)
    y1, x1 = min(oy + h, H), min(ox + w, W)
    sub_a = a[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    sub = rgb[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - sub_a) + sub * sub_a
    return img


def shadow(img, cx, y, rx, ry, strength, blur):
    d = ((XX - cx) / rx) ** 2 + ((YY - y) / ry) ** 2
    s = cv2.GaussianBlur(np.clip(1 - d, 0, 1), (0, 0), blur)[..., None]
    return img * (1 - strength * s)


def reflect(img, rgb, a, ox, oy, base, depth=60, opacity=0.14):
    """A soft mirror image of a prop in the varnish below its foot."""
    rows = base - oy
    flip_rgb = rgb[:rows][::-1][:depth]
    flip_a = a[:rows][::-1][:depth] * np.linspace(1, 0, min(depth, rows))[:, None, None] ** 1.5
    flip_rgb = cv2.GaussianBlur(flip_rgb, (0, 0), 2.5)
    return paste(img, flip_rgb, flip_a * opacity, ox, base)


# ------------------------------------------------------------------ props ----

def radio(img, cx, base, w, h):
    pad = 30
    RW, RH = w + 2 * pad, h + 2 * pad
    ox, oy = int(cx - w / 2 - pad), int(base - h - pad)
    x0, y0, x1, y1 = pad, pad, pad + w, pad + h - 14
    yy, xx = np.mgrid[0:RH, 0:RW].astype(np.float32)

    body = mask((RW, RH), lambda d, k: d.rounded_rectangle((x0 * k, y0 * k, x1 * k, y1 * k), 58 * k, fill=255))
    feet = mask((RW, RH), lambda d, k: [d.rounded_rectangle(((fx) * k, (y1 - 8) * k, (fx + 40) * k, (pad + h) * k),
                                                             8 * k, fill=255) for fx in (x0 + 70, x1 - 110)])
    gx0, gx1, gy0, gy1 = x0 + 46, x1 - 46, y0 + 48, y0 + int(h * 0.58)
    frame = mask((RW, RH), lambda d, k: d.rounded_rectangle(((gx0 - 11) * k, (gy0 - 11) * k, (gx1 + 11) * k,
                                                             (gy1 + 11) * k), 26 * k, fill=255))
    cloth = mask((RW, RH), lambda d, k: d.rounded_rectangle((gx0 * k, gy0 * k, gx1 * k, gy1 * k), 16 * k, fill=255))
    dy0, dy1, dx0, dx1 = gy1 + 26, gy1 + 82, x0 + 140, x1 - 140
    bezel = mask((RW, RH), lambda d, k: d.rounded_rectangle(((dx0 - 6) * k, (dy0 - 6) * k, (dx1 + 6) * k,
                                                             (dy1 + 6) * k), 13 * k, fill=255))
    dial = mask((RW, RH), lambda d, k: d.rounded_rectangle((dx0 * k, dy0 * k, dx1 * k, dy1 * k), 10 * k, fill=255))
    ky0 = dy1 + 18
    keys = mask((RW, RH), lambda d, k: [d.rounded_rectangle(((pad + w / 2 - 115 + i * 46 + 4) * k, ky0 * k,
                                                             (pad + w / 2 - 115 + i * 46 + 40) * k, (ky0 + 26) * k),
                                                            5 * k, fill=255) for i in range(5)])

    # Walnut case, lit from the upper left, varnished.
    alb = wood((RH, RW), 31, (96, 44, 22), period=6.5)
    alb *= (1.06 - 0.14 * (yy - y0) / h)[..., None] * (1.05 - 0.10 * xx / RW)[..., None]
    diff, nh = bevel(body, 30)
    out = lit(alb, diff, nh, gloss=45, ks=0.45)
    # Brass frame and bezel.
    gold = bgr((206, 166, 96))
    for m, r in ((frame, 9), (bezel, 5)):
        dg, hg = bevel(m, r)
        g = lit(gold * (0.85 + 0.15 * noise(m.shape, 1, 3))[..., None], dg, hg, ambient=0.35, kd=0.9, gloss=70, ks=0.9)
        out = out * (1 - m[..., None]) + g * m[..., None]
    # Speaker cloth, recessed: the frame's lip shades its upper-left edges.
    weave = 0.07 * np.sin(2 * np.pi * xx / 4.2) * np.sin(2 * np.pi * yy / 4.2) + 0.06 * noise(cloth.shape, 0.7, 5)
    weave = 0.10 * np.sin(2 * np.pi * xx / 6) * np.sin(2 * np.pi * yy / 6) + 0.08 * noise(cloth.shape, 0.9, 5)
    fab = bgr((84, 62, 46)) * (1 + weave)[..., None]
    fab *= (1 + 0.10 * np.cos(2 * np.pi * (yy - gy0) / 12) ** 8)[..., None]   # faint ribs
    lip = cv2.GaussianBlur(1 - np.roll(np.roll(cloth, 10, 0), 8, 1), (0, 0), 6) * cloth
    fab *= (1 - 0.55 * lip)[..., None]
    out = out * (1 - cloth[..., None]) + fab * cloth[..., None]
    # Three wooden bars across the cloth.
    for i in range(1, 4):
        by = gy0 + (gy1 - gy0) * i / 4
        bar = mask((RW, RH), lambda d, k, by=by: d.rounded_rectangle(((gx0 + 6) * k, (by - 7) * k, (gx1 - 6) * k,
                                                                      (by + 7) * k), 7 * k, fill=255))
        db, hb = bevel(bar, 7)
        out = out * (1 - bar[..., None]) + lit(alb * 1.05, db, hb, gloss=45, ks=0.5) * bar[..., None]
        drop = cv2.GaussianBlur(np.roll(bar, 6, 0), (0, 0), 3) * cloth * (1 - bar)
        out *= (1 - 0.45 * drop)[..., None]
    # Dial: cream scale, ticks, needle, under glass.
    scale = Image.new("RGB", (RW * 3, RH * 3), (226, 212, 176))
    d = ImageDraw.Draw(scale)
    for i in range(23):
        tx = (dx0 + 18 + (dx1 - dx0 - 36) * i / 22) * 3
        ln = (22 if i % 5 == 0 else 12) * 3
        d.line((tx, (dy0 + 10) * 3, tx, (dy0 + 10) * 3 + ln), fill=(78, 58, 46), width=6)
    nxp = (dx0 + (dx1 - dx0) * 0.62) * 3
    d.line((nxp, (dy0 + 5) * 3, nxp, (dy1 - 5) * 3), fill=(190, 36, 26), width=10)
    sc = np.asarray(scale.resize((RW, RH), Image.LANCZOS), np.float32)[..., ::-1] / 255
    sc *= (1.0 - 0.18 * smooth(dy0, dy1, yy))[..., None]
    dlip = cv2.GaussianBlur(1 - np.roll(np.roll(dial, 6, 0), 5, 1), (0, 0), 4) * dial
    sc *= (1 - 0.45 * dlip)[..., None]
    glare = np.exp(-((xx - yy * 1.6 - (dx0 + 40 - dy0 * 1.6)) / 26) ** 2) * 0.35
    sc = 1 - (1 - sc) * (1 - glare[..., None] * WARM)
    out = out * (1 - dial[..., None]) + sc * dial[..., None]
    # Chrome knobs: domes reflecting the mustard wall above and dark wood below.
    for kx in (x0 + 80, x1 - 80):
        ky = (dy0 + dy1) / 2
        for rad, tone in ((40, 0.85), (22, 0.55)):
            r = np.sqrt((xx - kx) ** 2 + (yy - ky) ** 2) / rad
            inside = np.clip((1 - r) * rad, 0, 1)
            nx, ny = (xx - kx) / rad, (yy - ky) / rad
            nz = np.sqrt(np.clip(1 - nx ** 2 - ny ** 2, 0, 1))
            n = np.dstack([nx, ny, nz])
            dk, hk = np.clip(n @ LIGHT, 0, 1), np.clip(n @ HALF, 0, 1)
            env = mp.WALL * (1 - smooth(-0.6, 0.6, ny))[..., None] + bgr((40, 28, 22)) * smooth(-0.6, 0.6, ny)[..., None]
            c = (env * 0.55 + 0.30 * dk[..., None]) * tone + (hk ** 80 * 1.2)[..., None] * WARM
            ring = np.clip(1 - np.abs(r - 0.96) * 30, 0, 1)
            c = c * (1 - 0.5 * ring[..., None])
            out = out * (1 - inside[..., None]) + c * inside[..., None]
    # Ivory keys.
    dk, hk = bevel(keys, 5)
    out = out * (1 - keys[..., None]) + lit(bgr((232, 222, 200)), dk, hk, gloss=40, ks=0.5) * keys[..., None]
    # Feet.
    out = out * (1 - feet[..., None] * (1 - body[..., None])) + bgr((28, 20, 16)) * (feet * (1 - body))[..., None]
    a = np.maximum(body, feet)[..., None]
    out = cv2.GaussianBlur(out, (0, 0), 0.6)

    img = shadow(img, cx + 0.18 * w, base - 2, 0.62 * w, 30, 0.45, 20)
    img = shadow(img, cx, base - 3, 0.5 * w, 9, 0.6, 4)
    img = reflect(img, out, a, ox, oy, base, depth=EDGE - base)
    return paste(img, out, a, ox, oy)


def books(img, x0, base):
    specs = [(0, 470, 74, (36, 76, 84)), (30, 410, 62, (112, 36, 32))]
    pad = 20
    RW, RH = 470 + 2 * pad, 136 + 2 * pad
    ox, oy = x0 - pad, base - 136 - pad
    yy, xx = np.mgrid[0:RH, 0:RW].astype(np.float32)
    out = np.zeros((RH, RW, 3), np.float32)
    a = np.zeros((RH, RW), np.float32)
    yb = 136 + pad
    for dx, w, h, cover in specs:
        bx0, by0, by1 = pad + dx, yb - h, yb
        m = mask((RW, RH), lambda d, k: d.rounded_rectangle((bx0 * k, by0 * k, (bx0 + w) * k, by1 * k), 9 * k, fill=255))
        v = np.clip((yy - by0) / h, 0, 1)
        # A rounded spine: light across its top third, darker under.
        shade = 0.62 + 0.42 * np.sin(np.pi * np.clip(v * 0.9 + 0.08, 0, 1)) ** 0.8 - 0.18 * v
        spec = np.exp(-((v - 0.28) / 0.08) ** 2) * 0.12
        cloth = bgr(cover) * (1 + 0.05 * noise(m.shape, 0.6, 7) + 0.03 * noise(m.shape, 3, 8))[..., None]
        col = cloth * shade[..., None] * (1.06 - 0.12 * (xx - bx0) / w)[..., None] + spec[..., None] * WARM
        # Gold foil: two bands and a title rule.
        foil = np.zeros_like(m)
        for fx in (bx0 + 34, bx0 + w - 52):
            foil[by0 + 8:by1 - 8, int(fx):int(fx) + 14] = 1
        foil[int((by0 + by1) / 2) - 2:int((by0 + by1) / 2) + 2, bx0 + 70:int(bx0 + 70 + w * 0.45)] = 1
        foil = cv2.GaussianBlur(foil, (0, 0), 0.7)
        gold = bgr((214, 176, 98)) * (0.55 + 0.55 * shade)[..., None] + (np.exp(-((v - 0.3) / 0.1) ** 2) * 0.5)[..., None] * WARM
        col = col * (1 - foil[..., None]) + gold * foil[..., None]
        out = out * (1 - m[..., None]) + col * m[..., None]
        a = np.maximum(a, m)
        # The upper book darkens the top of the one beneath.
        yb = by0
    gap = np.exp(-((yy - (136 + pad - 74)) / 4) ** 2) * 0.45
    out *= (1 - gap * (a > 0.5))[..., None]
    out = cv2.GaussianBlur(out, (0, 0), 0.6)
    img = shadow(img, x0 + 290, base - 1, 300, 26, 0.45, 18)
    img = shadow(img, x0 + 235, base - 2, 240, 8, 0.6, 4)
    img = reflect(img, out, a[..., None], ox, oy, base, depth=EDGE - base)
    return paste(img, out, a[..., None], ox, oy)


def tea(img, cx, base, w_top, w_bot, h, fill):
    """A clear glass of chiya: refracting the room above the tea, glowing in it."""
    top = base - h
    tea_top = base - h * fill
    x0, x1 = int(cx - w_top / 2 - 6), int(cx + w_top / 2 + 6)
    y0, y1 = int(top - 16), int(base + 2)
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    hw = w_top / 2 + (w_bot - w_top) / 2 * np.clip((yy - top) / h, 0, 1)
    u = (xx - cx) / hw
    inside = np.clip(hw - np.abs(xx - cx) + 0.5, 0, 1) * np.clip(yy - top + 0.5, 0, 1) * np.clip(base - yy + 0.5, 0, 1)
    bg = img[y0:y1, x0:x1].copy()
    # What the glass bends: the scene behind, pulled toward the middle.
    src_x = (cx + u * hw * 0.80).astype(np.float32)
    bgref = cv2.remap(img, src_x, yy.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    bgref = cv2.GaussianBlur(bgref, (0, 0), 1.2)
    th = np.sqrt(np.clip(1 - u ** 2, 0, 1))[..., None]
    light, dark = bgr((232, 146, 62)), bgr((134, 56, 18))
    tea_col = light * (1 - th ** 0.7) + dark * th ** 0.7
    tea_col = tea_col * 0.80 + bgref * light * 0.30
    tea_col *= (1 - 0.14 * np.clip((yy - tea_top) / (base - tea_top), 0, 1))[..., None]
    tea_col += (0.30 * smooth(0.15, 0.95, u) * th[..., 0])[..., None] * light   # light passing through
    col = np.where((yy >= tea_top)[..., None], tea_col, bgref * 0.92 + 0.05)
    # Thick base.
    base_band = smooth(base - 18, base - 14, yy)[..., None]
    col = col * (1 - base_band) + (light * 0.85 + 0.08) * base_band
    # Tea surface: a lit meniscus and the bulb reflected in it.
    hw_t = w_top / 2 + (w_bot - w_top) / 2 * (tea_top - top) / h
    surf = np.clip(1 - ((xx - cx) / hw_t) ** 2 - ((yy - tea_top) / 9) ** 2, 0, 1)
    surf = smooth(0, 0.08, surf)[..., None]
    col = col * (1 - surf) + (light * 0.75 + bgr((250, 200, 140)) * 0.25) * surf
    glint = np.exp(-(((xx - (cx - 0.45 * hw_t)) / 9) ** 2 + ((yy - tea_top) / 4) ** 2))[..., None]
    col = col + glint * 0.8 * WARM
    # The glass itself: bright walls, the bulb reflected as a streak, a rim.
    wall = smooth(0.90, 0.99, np.abs(u))[..., None]
    col = col * (1 - 0.25 * wall) + wall * 0.25 * np.where((u < 0)[..., None], 1.0, 0.6)
    streak = (np.exp(-((u + 0.68) / 0.07) ** 2) * 0.42 + np.exp(-((u - 0.74) / 0.04) ** 2) * 0.16)[..., None]
    streak *= smooth(top, top + 30, yy)[..., None] * (1 - smooth(base - 40, base - 10, yy))[..., None]
    col = 1 - (1 - col) * (1 - streak * WARM)
    rim = np.clip(1 - np.abs(np.sqrt(((xx - cx) / (w_top / 2)) ** 2 + ((yy - top) / 11) ** 2) - 1) * 9, 0, 1)
    rim *= np.where(yy > top, 0.75, 0.45)
    col = col * (1 - rim[..., None] * 0.6) + rim[..., None] * 0.6 * WARM
    a = np.maximum(inside, rim * (yy <= top + 1))[..., None]
    col = cv2.GaussianBlur(col, (0, 0), 0.5)
    out = bg * (1 - a) + col * a

    img = shadow(img, cx + 0.32 * w_bot, base - 1, 0.62 * w_bot, 13, 0.40, 10)
    # Caustic: a warm patch of light thrown through the tea onto the book.
    cz = np.exp(-(((XX - (cx + 0.55 * w_bot)) / 50) ** 2 + ((YY - (base - 4)) / 6) ** 2))[..., None]
    img = 1 - (1 - img) * (1 - cz * 0.35 * bgr((255, 170, 80)))
    img[y0:y1, x0:x1] = out

    # Steam: wisps that rise, curl and thin out.
    st = np.zeros((H, W), np.float32)
    rng = np.random.default_rng(13)
    for j, dx in enumerate((-46, -8, 30, 62)):
        n = 120
        ys = np.linspace(top - 6, top - 280 - 36 * j, n)
        t = np.linspace(0, 1, n)
        xs = cx + dx + 22 * np.sin(t * (5 + j) + rng.uniform(0, 6)) * (0.3 + t) + 30 * t * (j - 1.5) / 2
        pts = np.stack([xs, ys], 1).astype(np.int32)
        for i in range(n - 1):
            cv2.line(st, tuple(pts[i]), tuple(pts[i + 1]), float((1 - t[i]) ** 1.6 * (t[i] * 8).clip(0, 1)),
                     int(5 + 10 * t[i]), cv2.LINE_AA)
    st = cv2.GaussianBlur(st, (0, 0), 4.5) * np.clip(0.55 + 0.6 * noise((H, W), 10, 17), 0, 1)
    return 1 - (1 - img) * (1 - st[..., None] * 0.55)


def mp_np_mix(alb):
    """More legible grain for the big tabletop."""
    m = alb.mean(axis=(0, 1), keepdims=True)
    return m + (alb - m) * 1.7


# -------------------------------------------------------------- the room ----

def table(img):
    out = img.copy()
    v = np.clip((YY - TOP) / (EDGE - TOP), 0, 1)
    alb = wood((H, W), 41, (124, 74, 40), period=9.0)
    alb = mp_np_mix(alb)
    # Varnish: the bulb's sheen near the back, a little darker toward us.
    sheen = np.exp(-(((XX - 420) / 520) ** 2 + ((YY - (TOP + 30)) / 60) ** 2))
    top_col = alb * (1.04 - 0.16 * v)[..., None] * (1.08 - 0.20 * XX / W)[..., None] + (sheen * 0.16)[..., None] * WARM
    face = alb * 0.55 * (1.06 - 0.18 * XX / W)[..., None]
    roll = np.exp(-((YY - EDGE) / 5) ** 2)[..., None]                   # the rounded edge catches light
    face = face + roll * 0.22 * WARM
    sel_top = ((YY >= TOP) & (YY < EDGE))[..., None]
    out = np.where(sel_top, top_col, out)
    out = np.where((YY >= EDGE)[..., None], face, out)
    out = out * (1 - roll * 0.0) + 0
    back = np.exp(-((YY - TOP) / 2.5) ** 2)[..., None]
    return out * (1 - 0.35 * back)


def bulb(img):
    x, y = mp.BULB
    out = img.copy()
    # Cord and a bronze socket.
    cord = np.clip(1 - np.abs(XX - x) / 3.2, 0, 1) * (YY < y - 120)
    out = out * (1 - cord[..., None]) + bgr((30, 26, 24)) * cord[..., None]
    sock = np.clip(1 - np.maximum(np.abs(XX - x) - 24, 0), 0, 1) * smooth(y - 132, y - 128, YY) * (1 - smooth(y - 66, y - 62, YY))
    cyl = np.clip(1 - ((XX - x + 8) / 24) ** 2, 0, 1) ** 0.5
    out = out * (1 - sock[..., None]) + (bgr((70, 52, 34)) * (0.4 + 0.8 * cyl)[..., None]) * sock[..., None]
    # Glass globe: warm, brightest at the filament, a highlight on the left.
    r = np.sqrt(((XX - x) / 78) ** 2 + ((YY - y) / 92) ** 2)
    globe = np.clip((1 - r) * 40, 0, 1)
    core = np.exp(-(((XX - x) / 30) ** 2 + ((YY - y + 4) / 34) ** 2))
    gcol = bgr((255, 214, 150)) * (0.62 + 0.38 * core)[..., None] + (core ** 3)[..., None] * 0.3
    gcol = gcol * (1 - 0.18 * smooth(0.7, 1.0, r))[..., None]
    hl = np.exp(-(((XX - (x - 34)) / 10) ** 2 + ((YY - (y - 30)) / 24) ** 2))[..., None] * 0.5
    gcol = gcol + hl
    out = out * (1 - globe[..., None]) + gcol * globe[..., None]
    fil = np.zeros((H, W), np.float32)
    cv2.ellipse(fil, (x, y + 2), (16, 11), 0, 180, 360, 1.0, 2, cv2.LINE_AA)
    cv2.line(fil, (x - 16, y + 2), (x - 10, y - 50), 1.0, 1, cv2.LINE_AA)
    cv2.line(fil, (x + 16, y + 2), (x + 10, y - 50), 1.0, 1, cv2.LINE_AA)
    out = out + cv2.GaussianBlur(fil, (0, 0), 1.0)[..., None] * 0.7 * bgr((255, 230, 180))
    # Bloom: the light spills into the lens.
    glow = np.exp(-(np.sqrt((XX - x) ** 2 + (YY - y) ** 2) / 120) ** 2) * 0.45 \
        + np.exp(-(np.sqrt((XX - x) ** 2 + (YY - y) ** 2) / 380) ** 2) * 0.16
    return 1 - (1 - np.clip(out, 0, 1)) * (1 - glow[..., None] * bgr((255, 200, 130)))


def grade_person(photo):
    p = photo.astype(np.float32) / 255
    p = p * np.array([0.88, 0.97, 1.07], np.float32)               # into the bulb's warmth
    p = np.clip(p, 0, 1)
    p = p + 0.10 * p * (1 - p) * (2 * p - 1)
    h, w = p.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    p *= (1.06 - 0.10 * xx / w - 0.04 * yy / h)[..., None]          # light from the upper left
    return np.clip(p, 0, 1)


def main():
    photo = cv2.imread(str(tp.PHOTO))
    ph, pw = photo.shape[:2]
    print("cutting out")
    alpha = tp.cutout(photo)
    person = grade_person(photo)
    # Edge colours from well inside the outline: the café window behind him
    # is blue, and none of it should rim his ear or shoulders.
    alpha = cv2.erode(alpha, np.ones((3, 3), np.uint8))
    core = cv2.erode((alpha > 0.99).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(np.float32)[..., None]
    inside = cv2.GaussianBlur(person * core, (0, 0), 6) / (cv2.GaussianBlur(core, (0, 0), 6)[..., None] + 1e-4)
    band = (1 - core[..., 0]) * (alpha > 0.02)
    band = cv2.GaussianBlur(band, (0, 0), 1.5)[..., None]
    person = person * (1 - band) + inside * band

    s = W / pw
    m = np.float32([[s, 0, 0], [0, s, H - ph * s]])
    p_c = cv2.warpAffine(person, m, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
    a_c = cv2.warpAffine(alpha, m, (W, H), flags=cv2.INTER_LINEAR)[..., None]

    print("lighting the room")
    room = mp.wall()
    room *= 1 + 0.014 * noise((H, W), 0.9, 51)[..., None]                 # plaster tooth
    leaves = cv2.GaussianBlur(mp.leaf_shadows(), (0, 0), 3)
    room *= 1 - 0.14 * leaves[..., None]
    cast = cv2.GaussianBlur(np.roll(np.roll(a_c[..., 0], 70, 1), 36, 0), (0, 0), 45)
    room *= 1 - 0.30 * cast[..., None]
    # Light wrap: the warm wall bleeds a little over his outline.
    wrap = cv2.GaussianBlur(room, (0, 0), 14)
    rim = (a_c[..., 0] * (1 - cv2.GaussianBlur(a_c[..., 0], (0, 0), 5)))[..., None]
    p_c = p_c * (1 - 0.35 * rim) + wrap * 0.35 * rim
    img = room * (1 - a_c) + p_c * a_c

    img = table(img)
    # His forearms rest on the table: a soft contact shadow beneath them.
    band = a_c[..., 0] * ((YY > TOP - 40) & (YY < TOP))
    img *= 1 - 0.5 * cv2.GaussianBlur(np.roll(band, 26, 0), (0, 0), 12)[..., None] * (YY >= TOP)[..., None]
    print("props")
    img = radio(img, cx=1340, base=2600, w=680, h=390)
    img = books(img, x0=24, base=2612)
    img = tea(img, cx=284, base=2478, w_top=296, w_bot=254, h=340, fill=0.84)

    v = 1 - 0.22 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H / 2) / (H / 2)) ** 2) ** 1.5
    img = np.clip(img * np.clip(v, 0.62, 1)[..., None], 0, 1)
    img = bulb(img)
    # A whisper of bloom on every highlight, as a lens would.
    bright = np.clip(img - 0.78, 0, 1) / 0.22
    img = 1 - (1 - img) * (1 - cv2.GaussianBlur(bright, (0, 0), 22) * 0.18)
    img = mp.text(img)
    grain = noise((H, W), 0.6, 99)[..., None] * 0.008
    img = np.clip(img + grain, 0, 1)
    cv2.imwrite(str(OUTPUT), (img * 255 + 0.5).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 96])
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
