"""A digital wedding invitation video for Manish and Sushmita: 1080 x 1920,
30 fps, about 44 seconds, with its own music (music.py).

Every picture in it is drawn here; there are no photos or stock images:

  1. Envelope   an ivory envelope on silk, sealed with red wax stamped M&S.
                The seal splits, the flap opens on a maroon lining, and the
                card rises out.
  2. Blessing   ॥ श्री गणेशाय नमः ॥ over a lit brass diya, शुभ विवाह, and the
                parents' blessing, on a card with a gold double border.
  3. Names      a gold arch onto the Himalaya at sunset with a pagoda below,
                marigold garlands dropping in, and the names written on in
                gold script, with मनीष र सुस्मिता under them.
  4. Invitation the invitation in English and Nepali, line by line.
  5. Programme  Haldi, Mehendi, Shubh Vivah and Pritibhoj on four cards.
  6. Save the date
                the couple in silhouette in the arch, rim-lit by the sunset.
  7. Close      the M&S seal again and "Manish weds Sushmita".

Gold is shaded as metal: each shape's alpha is blurred into a height field,
lit from the upper left, and swept by a moving sheen. Rose and marigold
petals fall through the open scenes, and gold dust drifts.

The dates and venues go in DETAILS below; until they are filled in, the
cards say they are to follow.

    pip install numpy opencv-python-headless pillow imageio-ffmpeg
    python3 media/invitation/make_invitation.py [fonts_dir]

`fonts_dir` holds Great Vibes, Cinzel Decorative and Tiro Devanagari Hindi
(the @fontsource packages on npm), and Cormorant Garamond, Cinzel and Noto
Serif Devanagari (Google Fonts).
"""

import subprocess
import sys
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import music  # noqa: E402

FONTS = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "fonts"
OUT = HERE / "manish-sushmita-invitation.mp4"
W, H, FPS = 1080, 1920, 30

DETAILS = {
    "groom": "Manish", "bride": "Sushmita",
    "groom_ne": "मनीष", "bride_ne": "सुस्मिता",
    # Each event: English name, Nepali name, "date · time", "venue". None
    # until known; the card then says the details are to follow.
    "events": [
        ("Haldi", "हल्दी", None, None),
        ("Mehendi", "मेहेन्दी", None, None),
        ("Shubh Vivah", "शुभ विवाह", None, None),
        ("Pritibhoj", "प्रीतिभोज", None, None),
    ],
    "save_the_date": None,          # e.g. "Mangsir 15, 2083  ·  1 December 2026"
}

# Colours, BGR in 0..1.
def bgr(hexstr):
    h = hexstr.lstrip("#")
    return np.array([int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16)], np.float32) / 255


IVORY = bgr("#FBF3E6")
GOLD_DARK, GOLD, GOLD_LIGHT = bgr("#8A5A1C"), bgr("#C99A3E"), bgr("#F6E2A6")
MAROON, MAROON_DARK = bgr("#7A1424"), bgr("#4A0A14")
INK = bgr("#5A2A1E")

SCRIPT = "great-vibes-latin-400-normal.woff"
DECO = "cinzel-decorative-latin-700-normal.woff"
SERIF = "CormorantGaramond[wght].ttf"
CAPS = "Cinzel[wght].ttf"
DEVA_HEAD = "tiro-devanagari-hindi-devanagari-400-normal.woff"
DEVA = "NotoSerifDevanagari[wdth,wght].ttf"

YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)


# ----------------------------------------------------------------- basics ----

def clip01(x):
    return np.clip(x, 0, 1)


def ramp(t, a, b):
    return float(np.clip((t - a) / (b - a), 0, 1))


def ease(x):
    x = float(np.clip(x, 0, 1))
    return x * x * (3 - 2 * x)


def ease_out(x):
    x = float(np.clip(x, 0, 1))
    return 1 - (1 - x) ** 3


def font(name, size, weight=None):
    f = ImageFont.truetype(str(FONTS / name), size, layout_engine=ImageFont.Layout.RAQM)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight] if "wdth" not in name else [100, weight])
        except OSError:
            pass
    return f


def text_mask(text, name, size, weight=None, tracking=0, italic=False):
    """The text as an alpha mask (float, 0..1), tightly cropped with a margin."""
    f = font(name, size, weight)
    probe = ImageDraw.Draw(Image.new("L", (8, 8)))
    if tracking:
        widths = [probe.textlength(c, font=f) for c in text]
        tw = int(sum(widths) + tracking * (len(text) - 1)) + 1
    else:
        tw = int(probe.textlength(text, font=f)) + 1
    asc, desc = f.getmetrics()
    pad = size // 2
    img = Image.new("L", (tw + 2 * pad, asc + desc + 2 * pad), 0)
    d = ImageDraw.Draw(img)
    if tracking:
        x = pad
        for c, w_c in zip(text, widths):
            d.text((x, pad), c, font=f, fill=255)
            x += w_c + tracking
    else:
        d.text((pad, pad), text, font=f, fill=255)
    if italic:
        img = img.transform(img.size, Image.AFFINE, (1, 0.18, -0.09 * img.size[1], 0, 1, 0), Image.BICUBIC)
    a = np.asarray(img, np.float32) / 255
    ys, xs = np.nonzero(a > 0.01)
    m = 6
    return a[max(ys.min() - m, 0):ys.max() + m + 1, max(xs.min() - m, 0):xs.max() + m + 1]


class Layer:
    def __init__(self, rgb, alpha):
        self.rgb = rgb.astype(np.float32)
        self.a = alpha.astype(np.float32)

    @property
    def shape(self):
        return self.a.shape


def solid(mask, colour):
    return Layer(np.broadcast_to(colour, mask.shape + (3,)).copy(), mask)


def gold(mask, bevel=1.6, depth=6.0, base=None):
    """Mask shaded as polished gold: a bevel lit from the upper left, darker
    toward the bottom, with a bright specular edge."""
    h = cv2.GaussianBlur(mask, (0, 0), bevel)
    gy, gx = np.gradient(h * depth)
    n = np.dstack([-gx, -gy, np.ones_like(h)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    light = np.array([-0.5, -0.65, 0.58])
    light /= np.linalg.norm(light)
    lam = clip01((n * light).sum(2))
    half = light + np.array([0, 0, 1.0])
    half /= np.linalg.norm(half)
    spec = clip01((n * half).sum(2)) ** 28
    rows = np.linspace(0, 1, mask.shape[0], dtype=np.float32)[:, None, None]
    lo, hi = (GOLD_DARK, GOLD_LIGHT) if base is None else base
    col = hi * (1 - rows) * 0.55 + GOLD * 0.45 + lo * rows * 0.35
    col = col * (0.45 + 0.75 * lam[..., None]) + spec[..., None] * 0.9
    return Layer(np.clip(col, 0, 1.2), mask)


def put(frame, layer, cx, cy, scale=1.0, opacity=1.0, angle=0.0, sheen=None, alpha_mul=None):
    """Composite a layer centred at (cx, cy)."""
    if opacity <= 0.002:
        return
    rgb, a = layer.rgb, layer.a
    if alpha_mul is not None:
        a = a * alpha_mul
    if scale != 1.0 or angle != 0.0:
        h, w = a.shape
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, scale)
        nw, nh = int(w * scale * 1.0 + abs(np.sin(np.radians(angle))) * h * scale) + 2, \
            int(h * scale + abs(np.sin(np.radians(angle))) * w * scale) + 2
        M[0, 2] += nw / 2 - w / 2
        M[1, 2] += nh / 2 - h / 2
        rgb = cv2.warpAffine(rgb, M, (nw, nh), flags=cv2.INTER_LINEAR)
        a = cv2.warpAffine(a, M, (nw, nh), flags=cv2.INTER_LINEAR)
    if sheen is not None:
        h, w = a.shape
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        s = (xx + 0.45 * yy) / (w + 0.45 * h)
        band = np.exp(-((s - sheen) / 0.07) ** 2)
        rgb = rgb + band[..., None] * np.array([0.55, 0.6, 0.55], np.float32)
    h, w = a.shape
    x0, y0 = int(round(cx - w / 2)), int(round(cy - h / 2))
    fx0, fy0, fx1, fy1 = max(x0, 0), max(y0, 0), min(x0 + w, W), min(y0 + h, H)
    if fx1 <= fx0 or fy1 <= fy0:
        return
    sub_a = a[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0, None] * opacity
    sub = rgb[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0]
    region = frame[fy0:fy1, fx0:fx1]
    region *= 1 - sub_a
    region += sub * sub_a


def reveal(layer, p, soft=40.0):
    """A left-to-right write-on mask for a layer, p from 0 to 1."""
    h, w = layer.shape
    x = np.arange(w, dtype=np.float32)[None, :]
    return np.clip(((w + soft) * p - x) / soft, 0, 1)


# -------------------------------------------------------------- materials ----

def silk():
    """Ivory silk with soft vertical folds, lit from the upper left."""
    rng = np.random.default_rng(1)
    folds = np.zeros((H, W), np.float32)
    for lam, amp in ((310, 1.0), (170, 0.55), (95, 0.3)):
        ph = rng.uniform(0, 6.3)
        wob = 26 * np.sin(2 * np.pi * YY / rng.uniform(900, 1500) + rng.uniform(0, 6.3))
        folds += amp * np.sin(2 * np.pi * (XX + wob) / lam + ph)
    folds /= np.abs(folds).max()
    light = 1.02 - 0.12 * ((XX / W - 0.2) ** 2 + (YY / H - 0.15) ** 2)
    shade = (0.94 + 0.05 * folds + 0.04 * np.maximum(folds, 0) ** 6) * light
    col = IVORY[None, None] * shade[..., None]
    col = col * np.array([0.97, 0.99, 1.0], np.float32)              # warm
    return np.clip(col, 0, 1).astype(np.float32)


def paper(w, h, tint=IVORY, seed=2):
    rng = np.random.default_rng(seed)
    n = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 1.2)
    fib = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), sigmaX=6, sigmaY=0.8)
    s = 1 + 0.012 * n + 0.01 * fib
    return np.clip(tint[None, None] * s[..., None], 0, 1).astype(np.float32)


def rounded_rect_mask(w, h, r):
    m = np.zeros((h, w), np.uint8)
    cv2.rectangle(m, (r, 0), (w - r - 1, h - 1), 255, -1)
    cv2.rectangle(m, (0, r), (w - 1, h - r - 1), 255, -1)
    for cx, cy in ((r, r), (w - r - 1, r), (r, h - r - 1), (w - r - 1, h - r - 1)):
        cv2.circle(m, (cx, cy), r, 255, -1, cv2.LINE_AA)
    return m.astype(np.float32) / 255


def border_mask(w, h, inset, thick, r=0):
    outer = np.zeros((h, w), np.uint8)
    cv2.rectangle(outer, (inset, inset), (w - inset - 1, h - inset - 1), 255, thick, cv2.LINE_AA)
    return outer.astype(np.float32) / 255


def flourish(width, seed=0):
    """A gold divider: a fine line swelling to a diamond, with curls."""
    h = 70
    m = np.zeros((h, width), np.uint8)
    c = width // 2
    for side in (-1, 1):
        pts = []
        for i in range(60):
            u = i / 59
            x = c + side * (30 + u * (width / 2 - 50))
            y = h / 2 + 4 * np.sin(u * np.pi) * side
            pts.append((x, y))
        cv2.polylines(m, [np.array(pts, np.int32)], False, 255, 2, cv2.LINE_AA)
        cx = c + side * (width / 2 - 34)
        cv2.ellipse(m, (int(cx), h // 2 - 8), (14, 10), 0, 90 - 90 * side, 360 - 90 * side + 90, 255, 2,
                    cv2.LINE_AA)
        cv2.circle(m, (int(c + side * (width / 2 - 14)), h // 2), 4, 255, -1, cv2.LINE_AA)
    cv2.fillPoly(m, [np.array([(c, h // 2 - 14), (c + 12, h // 2), (c, h // 2 + 14), (c - 12, h // 2)], np.int32)],
                 255, cv2.LINE_AA)
    cv2.circle(m, (c - 24, h // 2), 3, 255, -1, cv2.LINE_AA)
    cv2.circle(m, (c + 24, h // 2), 3, 255, -1, cv2.LINE_AA)
    return gold(m.astype(np.float32) / 255, bevel=1.0, depth=3)


# ---------------------------------------------------------------- the seal ----

def wax_seal(radius=92, seed=5):
    """Red sealing wax with an irregular edge, a raised rim and M&S pressed in."""
    s = radius * 2 + 40
    yy, xx = np.mgrid[0:s, 0:s].astype(np.float32) - s / 2
    ang = np.arctan2(yy, xx)
    rng = np.random.default_rng(seed)
    wobble = sum(rng.uniform(1, 4) * np.sin(k * ang + rng.uniform(0, 6.3)) for k in (3, 5, 7, 11, 17))
    r = np.hypot(xx, yy)
    edge = radius + wobble
    shape = clip01((edge - r) / 1.5)
    # Height: a dome, a raised rim at 0.78 of the radius, the stamp pressed in.
    dome = clip01(1 - (r / edge) ** 2) ** 0.5
    rim = np.exp(-((r - 0.80 * radius) / (0.07 * radius)) ** 2)
    stamp_area = clip01((0.74 * radius - r) / 2)
    mono = text_mask("M&S", DECO, int(radius * 0.62))
    mono_full = np.zeros((s, s), np.float32)
    mh, mw = mono.shape
    y0, x0 = s // 2 - mh // 2 + 4, s // 2 - mw // 2
    mono_full[y0:y0 + mh, x0:x0 + mw] = mono[:min(mh, s - y0), :min(mw, s - x0)]
    height = 6 * dome + 3 * rim - 2.4 * stamp_area + 2.0 * cv2.GaussianBlur(mono_full, (0, 0), 1.2)
    height = cv2.GaussianBlur(height, (0, 0), 1.0) * shape
    gy, gx = np.gradient(height)
    n = np.dstack([-gx * 2.2, -gy * 2.2, np.ones_like(height)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    light = np.array([-0.5, -0.7, 0.5])
    light /= np.linalg.norm(light)
    lam = clip01((n * light).sum(2))
    half = light + np.array([0, 0, 1.0])
    half /= np.linalg.norm(half)
    spec = clip01((n * half).sum(2)) ** 40
    base = bgr("#9E1B26")
    col = base * (0.35 + 0.85 * lam[..., None]) + spec[..., None] * 0.65
    # The pressed letters keep a little gold dust.
    col = col * (1 - 0.5 * mono_full[..., None]) + GOLD * 0.9 * mono_full[..., None] * (0.6 + 0.6 * lam[..., None])
    return Layer(np.clip(col, 0, 1.2), shape)


# --------------------------------------------------------------- envelope ----

ENV = dict(l=130, r=950, t=820, b=1380)
ENV_APEX = 1120


def envelope_parts():
    w, h = ENV["r"] - ENV["l"], ENV["b"] - ENV["t"]
    cream = bgr("#F5EADA")
    front = paper(w, h, cream, seed=3)
    g = gold(np.clip(border_mask(w, h, 14, 2), 0, 1), bevel=0.6, depth=2)
    front = front * (1 - g.a[..., None]) + g.rgb * g.a[..., None]
    # The back of the envelope seen inside: maroon lining with a gold lattice.
    lining = np.broadcast_to(MAROON, (h, w, 3)).copy()
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    lattice = ((np.abs(((xx + yy) % 46) - 23) < 1.0) | (np.abs(((xx - yy) % 46) - 23) < 1.0)).astype(np.float32)
    lining = lining * (0.85 + 0.15 * (yy / h))[..., None] + GOLD * 0.35 * lattice[..., None]
    return front, lining


def card_layer(w=760, h=520):
    """The card that rises from the envelope."""
    rgb = paper(w, h, IVORY, seed=4)
    a = rounded_rect_mask(w, h, 14)
    b = border_mask(w, h, 22, 3) + border_mask(w, h, 32, 1)
    g = gold(np.clip(b, 0, 1), bevel=0.8, depth=2)
    rgb = rgb * (1 - g.a[..., None]) + g.rgb * g.a[..., None]
    lay = Layer(rgb, a)
    t1 = gold(text_mask("शुभ विवाह", DEVA_HEAD, 104))
    t2 = gold(text_mask(f"{DETAILS['groom']} & {DETAILS['bride']}", SCRIPT, 92))
    fl = flourish(420)
    frame = np.zeros((h, w, 3), np.float32)
    frame[:] = lay.rgb
    tmp = frame.copy()
    for layer, cy in ((t1, 120), (fl, 215), (t2, 315)):
        hh, ww = layer.shape
        x0, y0 = w // 2 - ww // 2, cy - hh // 2
        sub = tmp[y0:y0 + hh, x0:x0 + ww]
        sub *= 1 - layer.a[..., None]
        sub += layer.rgb * layer.a[..., None]
    return Layer(tmp, a)


# ------------------------------------------------------------- landscape ----

def ridge(n, base, amp, rough, seed):
    """A mountain ridge line by midpoint displacement."""
    rng = np.random.default_rng(seed)
    size = 1
    pts = np.array([0.0, 0.0])
    scale = 1.0
    while size < n:
        mids = (pts[:-1] + pts[1:]) / 2 + rng.normal(0, scale, len(pts) - 1)
        new = np.empty(len(pts) * 2 - 1)
        new[0::2], new[1::2] = pts, mids
        pts = new
        size = len(pts) - 1
        scale *= rough
    x = np.linspace(0, 1, n)
    y = np.interp(x, np.linspace(0, 1, len(pts)), pts)
    y = (y - y.min()) / (np.ptp(y) + 1e-9)
    return base - amp * y


def pagoda(m, cx, base_y, s, colour):
    """A Nepali tiered temple in silhouette: plinth steps, three roofs, a gajur."""
    for i, (wd, ht) in enumerate(((1.0, 0.10), (0.82, 0.09), (0.66, 0.08))):
        y = base_y - s * (0.10 * i)
        cv2.rectangle(m, (int(cx - s * wd / 2), int(y - s * ht)), (int(cx + s * wd / 2), int(y)), colour, -1)
    y = base_y - s * 0.3
    for k, (rw, bw, h) in enumerate(((0.95, 0.42, 0.16), (0.7, 0.32, 0.14), (0.5, 0.22, 0.12))):
        roof = np.array([(cx - s * rw / 2, y), (cx - s * bw / 2, y - s * h), (cx + s * bw / 2, y - s * h),
                         (cx + s * rw / 2, y)], np.int32)
        cv2.fillPoly(m, [roof], colour, cv2.LINE_AA)
        cv2.rectangle(m, (int(cx - s * bw / 2 * 0.9), int(y - s * h - s * 0.1)), (int(cx + s * bw / 2 * 0.9),
                      int(y - s * h)), colour, -1)
        y = y - s * h - s * 0.1
    cv2.line(m, (int(cx), int(y)), (int(cx), int(y - s * 0.16)), colour, max(2, int(s * 0.02)), cv2.LINE_AA)
    cv2.circle(m, (int(cx), int(y - s * 0.1)), max(2, int(s * 0.025)), colour, -1, cv2.LINE_AA)


def himalaya(w, h):
    """Sunset over the Himalaya, for inside the arch."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    v = yy / h
    sky_top, sky_mid, sky_low = bgr("#8FA8D6"), bgr("#F1CFC0"), bgr("#F8C27E")
    sky = np.where(v[..., None] < 0.32, sky_top + (sky_mid - sky_top) * (v / 0.32)[..., None],
                   sky_mid + (sky_low - sky_mid) * clip01((v - 0.32) / 0.3)[..., None])
    sun = (w * 0.55, h * 0.56)
    d = np.hypot(xx - sun[0], yy - sun[1])
    sky = sky + (np.exp(-(d / 260) ** 2) * 0.35)[..., None] * bgr("#FFE6B0")
    sky = np.where((d < 46)[..., None], bgr("#FFF4D8"), sky)
    img = sky.astype(np.float32)
    # Far range: lit on the slopes facing the sun, snow on the high peaks.
    far = cv2.GaussianBlur(ridge(w, h * 0.62, h * 0.30, 0.47, 11).astype(np.float32)[None, :], (0, 0), 2.5).ravel()
    # Lit by the big faces only: the slope taken over a wide span, so small
    # wiggles in the ridge do not stripe the rock.
    slope = cv2.GaussianBlur(np.gradient(far).astype(np.float32)[None, :], (0, 0), 28).ravel()
    lit = 1 + 0.10 * np.clip(slope / 1.2, -1, 1)
    depth = yy - far[None, :]
    body = clip01(depth + 0.5)
    rng = np.random.default_rng(4)
    snow_line = h * 0.46
    snow_depth = cv2.GaussianBlur(np.clip((snow_line - far) * 0.6, 0, None).astype(np.float32)[None, :], (0, 0), 4).ravel()
    jag = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), sigmaX=1.5, sigmaY=6) * 10
    snow = clip01((snow_depth[None, :] - depth + jag) / 3) * body
    # Darker further down the face, measured from a smoothed ridge so each
    # small peak does not shade its own column.
    far_smooth = cv2.GaussianBlur(far[None, :], (0, 0), 40).ravel()
    shade = (lit[None, :] * (1 - 0.18 * clip01((yy - far_smooth[None, :]) / (h * 0.25))))[..., None]
    rock = bgr("#A8A1C6") * shade
    snow_col = bgr("#FFF2EA") * (0.86 + 0.16 * (lit[None, :, None] - 1) / 0.16 * 0.5 + 0.1)
    mtn = rock * (1 - snow[..., None]) + snow_col * snow[..., None]
    img = img * (1 - body[..., None]) + mtn * body[..., None]
    mid = cv2.GaussianBlur(ridge(w, h * 0.78, h * 0.16, 0.45, 23).astype(np.float32)[None, :], (0, 0), 2).ravel()
    mb = clip01(yy - mid[None, :] + 0.5)[..., None]
    img = img * (1 - mb) + bgr("#7D7AA3") * mb
    mist = np.exp(-((yy - h * 0.80) / (h * 0.05)) ** 2)[..., None]
    img = img * (1 - 0.45 * mist) + bgr("#F6E2D6") * 0.45 * mist
    near = ridge(w, h * 0.93, h * 0.08, 0.45, 31)
    m = np.zeros((h, w), np.uint8)
    for x in range(w):
        m[int(near[x]):, x] = 255
    pagoda(m, w * 0.68, near[int(w * 0.68)] + 6, w * 0.16, 255)
    for k in range(9):                                            # a few trees
        tx = int(w * (0.08 + 0.1 * k + 0.03 * np.sin(k * 3.1)))
        if abs(tx - w * 0.68) < w * 0.1:
            continue
        ty = int(near[min(tx, w - 1)])
        cv2.ellipse(m, (tx, ty - 10), (9, 22), 0, 0, 360, 255, -1, cv2.LINE_AA)
    nm = m.astype(np.float32)[..., None] / 255
    img = img * (1 - nm) + bgr("#3E3E62") * nm
    for k in range(5):                                            # birds
        bx, by = w * (0.22 + 0.07 * k), h * (0.24 + 0.03 * np.sin(k * 2))
        sz = 9 - k
        cv2.polylines(img, [np.array([(bx - sz, by - 3), (bx, by + 2), (bx + sz, by - 3)], np.int32)], False,
                      tuple(float(c) for c in bgr("#4A4060")), 2, cv2.LINE_AA)
    return np.clip(img, 0, 1)


def arch_masks(w, h, band=30):
    """A pointed arch: the opening, and the gold frame around it."""
    def outline(inset):
        spring = h * 0.40
        pts = []
        R = w * 0.78
        for i in range(60):            # left arc up to the apex
            u = i / 59
            a0 = np.arccos((R - (w / 2 - inset)) / R) if R > (w / 2 - inset) else 0
            ang = np.pi - u * (np.pi - (np.pi / 2 + 0.0))
            x = inset + (w / 2 - inset) * (1 - np.cos(u * np.pi / 2)) ** 1.0
            y = spring - (spring - inset) * np.sin(u * np.pi / 2) ** 0.8
            pts.append((x, y))
        right = [(w - x, y) for x, y in reversed(pts)]
        return np.array([(inset, h)] + pts + right + [(w - inset, h)], np.int32)
    opening = np.zeros((h, w), np.uint8)
    frame = np.zeros((h, w), np.uint8)
    cv2.fillPoly(frame, [outline(0)], 255, cv2.LINE_AA)
    cv2.fillPoly(opening, [outline(band)], 255, cv2.LINE_AA)
    inner_line = np.zeros((h, w), np.uint8)
    cv2.polylines(inner_line, [outline(band + 10)], False, 255, 2, cv2.LINE_AA)
    return opening.astype(np.float32) / 255, (frame.astype(np.float32) - opening) / 255, inner_line / 255


ARCH = dict(w=820, h=980, cx=540, cy=720)


def arch_layers():
    w, h = ARCH["w"], ARCH["h"]
    opening, frame, line = arch_masks(w, h)
    scene = himalaya(w, h)
    fr = gold(np.clip(frame + 0, 0, 1), bevel=2.5, depth=9)
    ln = gold(line.astype(np.float32), bevel=0.8, depth=2)
    # A finial at the apex.
    fin = np.zeros((90, 60), np.uint8)
    cv2.ellipse(fin, (30, 55), (16, 20), 0, 0, 360, 255, -1, cv2.LINE_AA)
    cv2.fillPoly(fin, [np.array([(30, 5), (38, 40), (22, 40)], np.int32)], 255, cv2.LINE_AA)
    finial = gold(fin.astype(np.float32) / 255, bevel=1.5, depth=6)
    return scene, opening, fr, ln, finial


# ---------------------------------------------------------------- flowers ----

def marigold_sprite(r, colour, seed):
    s = 2 * r + 6
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:s, 0:s].astype(np.float32) - s / 2
    ang, rad = np.arctan2(yy, xx), np.hypot(xx, yy)
    ruffle = r * (0.88 + 0.12 * np.sin(14 * ang + rng.uniform(0, 6)) * np.sin(5 * ang))
    a = clip01((ruffle - rad) / 1.2)
    rings = 0.75 + 0.25 * np.sin(rad * 1.6 + rng.uniform(0, 6)) * np.sin(9 * ang)
    shade = (1.05 - 0.35 * (rad / r)) * rings * (1 + 0.25 * (-yy - xx) / (2 * r))
    rgb = colour[None, None] * shade[..., None]
    rgb = rgb * (1 - 0.4 * np.exp(-(rad / (0.25 * r)) ** 2))[..., None]
    return Layer(np.clip(rgb, 0, 1), a)


def garland_layer():
    """Swags of marigold across the top, and strands hanging at the sides."""
    h = 420
    rgb = np.zeros((h, W, 3), np.float32)
    a = np.zeros((h, W), np.float32)
    orange, yellow = bgr("#E8731A"), bgr("#F6B520")
    sprites = [marigold_sprite(15, orange, i) for i in range(4)] + [marigold_sprite(15, yellow, 10 + i) for i in range(4)]
    def place(x, y, k):
        sp = sprites[k % len(sprites)]
        hh, ww = sp.shape
        x0, y0 = int(x - ww / 2), int(y - hh / 2)
        if x0 < 0 or y0 < 0 or x0 + ww > W or y0 + hh > h:
            return
        sub_a = sp.a
        a[y0:y0 + hh, x0:x0 + ww] = np.maximum(a[y0:y0 + hh, x0:x0 + ww], sub_a)
        rgb[y0:y0 + hh, x0:x0 + ww] = rgb[y0:y0 + hh, x0:x0 + ww] * (1 - sub_a[..., None]) + sp.rgb * sub_a[..., None]
    k = 0
    for x0, x1, sag in ((-20, 360, 150), (360, 720, 120), (720, 1100, 150)):
        n = int((x1 - x0) / 22)
        for i in range(n + 1):
            u = i / n
            x = x0 + (x1 - x0) * u
            y = 26 + sag * 4 * u * (1 - u)
            band = (i // 4) % 2
            place(x, y, k if band else k + 4)
            k += 1
    for x in (360, 720):                       # hanging strands where the swags meet
        for i in range(12):
            place(x, 36 + 24 * i, i + (4 if (i // 3) % 2 else 0))
    for x in (40, W - 40):
        for i in range(15):
            place(x, 30 + 24 * i, i + (4 if (i // 3) % 2 else 0))
    return Layer(rgb, a)


# ------------------------------------------------------------------ couple ----

def bez(p0, p1, p2, p3, n=24):
    t = np.linspace(0, 1, n)[:, None]
    return ((1 - t) ** 3) * p0 + 3 * ((1 - t) ** 2) * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3


def couple_mask(s=1.0):
    """Groom in daura-suruwal and dhaka topi, bride in a lehenga and veil,
    holding hands; feet on y = 0, about 440 units tall."""
    W_, H_ = int(420 * s), int(470 * s)
    m = np.zeros((H_, W_), np.uint8)
    ox, oy = 130 * s, 460 * s
    P = lambda x, y: (ox + x * s, oy + y * s)
    poly = lambda pts: cv2.fillPoly(m, [np.array([P(x, y) for x, y in pts], np.int32)], 255, cv2.LINE_AA)
    # Groom.
    poly([(-27, -418), (31, -430), (34, -398), (-29, -394)])                    # dhaka topi
    cv2.circle(m, tuple(int(v) for v in P(2, -372)), int(30 * s), 255, -1, cv2.LINE_AA)
    poly([(-11, -346), (13, -346), (14, -322), (-10, -322)])                     # neck
    body = np.concatenate([bez(np.array([-50, -318]), np.array([-60, -260]), np.array([-52, -200]), np.array([-62, -112])),
                           [[62, -112]],
                           bez(np.array([62, -112]), np.array([54, -200]), np.array([62, -260]), np.array([50, -318]))])
    poly([tuple(p) for p in body])                                               # daura to the knee
    poly([(-40, -116), (-6, -116), (-12, 0), (-32, 0)])                          # suruwal
    poly([(6, -116), (40, -116), (32, 0), (12, 0)])
    poly([(-36, -6), (-8, -6), (-4, 2), (-40, 2)])                               # shoes
    poly([(10, -6), (38, -6), (44, 2), (8, 2)])
    poly([(-50, -312), (-34, -308), (-50, -190), (-66, -194)])                   # left arm down
    poly([(44, -314), (58, -300), (84, -214), (70, -206)])                       # right arm to her hand
    # Bride.
    bx = 160
    cv2.circle(m, tuple(int(v) for v in P(bx, -352)), int(27 * s), 255, -1, cv2.LINE_AA)
    cv2.circle(m, tuple(int(v) for v in P(bx + 22, -356)), int(15 * s), 255, -1, cv2.LINE_AA)   # bun
    veil = np.concatenate([bez(np.array([bx - 28, -372]), np.array([bx - 10, -400]), np.array([bx + 40, -392]),
                                np.array([bx + 46, -340])),
                           bez(np.array([bx + 46, -340]), np.array([bx + 70, -250]), np.array([bx + 96, -140]),
                               np.array([bx + 120, -40])),
                           [[bx + 60, -60]]])
    poly([tuple(p) for p in veil])
    poly([(bx - 10, -326), (bx + 10, -326), (bx + 12, -300), (bx - 12, -300)])  # neck
    poly([(bx - 38, -300), (bx + 38, -300), (bx + 26, -214), (bx - 26, -214)])  # blouse
    skirt = np.concatenate([bez(np.array([bx - 28, -218]), np.array([bx - 50, -150]), np.array([bx - 92, -60]),
                                np.array([bx - 104, 0])),
                            bez(np.array([bx - 104, 0]), np.array([bx - 40, 10]), np.array([bx + 40, 10]),
                                np.array([bx + 104, 0])),
                            bez(np.array([bx + 104, 0]), np.array([bx + 92, -60]), np.array([bx + 50, -150]),
                                np.array([bx + 28, -218]))])
    poly([tuple(p) for p in skirt])                                              # lehenga
    poly([(bx - 34, -296), (bx - 20, -290), (bx - 70, -210), (bx - 84, -216)])   # her arm to his hand
    cv2.circle(m, tuple(int(v) for v in P(77, -210)), int(9 * s), 255, -1, cv2.LINE_AA)  # the hands
    return m.astype(np.float32) / 255


def couple_layer(s=1.0):
    m = couple_mask(s)
    inner = cv2.erode((m > 0.5).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32)
    rim = cv2.GaussianBlur(np.clip(m - inner, 0, 1), (0, 0), 1.5)
    rgb = np.broadcast_to(bgr("#3A1C22"), m.shape + (3,)).copy()
    # The bride's lehenga in deep red, so she reads even in silhouette.
    yy, xx = np.mgrid[0:m.shape[0], 0:m.shape[1]].astype(np.float32)
    bride = (xx > 200 * s) & (yy > 240 * s)
    rgb[bride] = bgr("#6A1020")
    rgb = rgb + rim[..., None] * bgr("#FFC878") * 0.9
    return Layer(np.clip(rgb, 0, 1), m)


# ---------------------------------------------------------------- the diya ----

def diya(frame, cx, cy, t, scale=1.0, opacity=1.0, lit=1.0):
    """A brass diya with a flickering flame and its glow."""
    if opacity <= 0:
        return
    s = scale
    w, h = int(240 * s), int(200 * s)
    m = np.zeros((h, w), np.uint8)
    cv2.ellipse(m, (w // 2, int(h * 0.62)), (int(95 * s), int(42 * s)), 0, 0, 180, 255, -1, cv2.LINE_AA)
    cv2.ellipse(m, (w // 2, int(h * 0.62)), (int(95 * s), int(14 * s)), 0, 0, 360, 255, -1, cv2.LINE_AA)
    cv2.fillPoly(m, [np.array([(w // 2 + 80 * s, h * 0.6), (w // 2 + 120 * s, h * 0.52), (w // 2 + 84 * s, h * 0.66)],
                              np.int32)], 255, cv2.LINE_AA)                     # the spout
    cv2.ellipse(m, (w // 2, int(h * 0.92)), (int(40 * s), int(10 * s)), 0, 0, 360, 255, -1, cv2.LINE_AA)
    cv2.rectangle(m, (int(w / 2 - 14 * s), int(h * 0.78)), (int(w / 2 + 14 * s), int(h * 0.9)), 255, -1)
    lay = gold(m.astype(np.float32) / 255, bevel=2.0, depth=8)
    put(frame, lay, cx, cy, opacity=opacity)
    if lit <= 0:
        return
    # The flame at the spout.
    fx, fy = cx + 100 * s, cy + (0.52 - 0.5) * h - 4 * s
    flick = 1 + 0.08 * np.sin(t * 23) + 0.05 * np.sin(t * 37 + 1) + 0.04 * np.sin(t * 11)
    sway = 2.5 * np.sin(t * 7) * s
    fh, fw = 64 * s * flick * lit, 18 * s * lit
    yy, xx = YY - fy, XX - fx - sway * clip01(-(YY - fy) / max(fh, 1))
    shape = np.where(yy < 0, (xx / (fw * (1 + yy / max(fh, 1)) + 1e-3)) ** 2 + (yy / max(fh, 1)) ** 2,
                     (xx / fw) ** 2 + (yy / (fw * 0.9)) ** 2)
    core = clip01(1.2 - shape * 1.2) * opacity
    halo = np.exp(-((XX - fx) ** 2 + (YY - fy + fh * 0.4) ** 2) / (2 * (70 * s) ** 2)) * opacity * lit
    frame += halo[..., None] * bgr("#FFC060") * 0.45
    flame = bgr("#FFB040") * (1 - core[..., None] ** 0.5) + bgr("#FFF6DA") * core[..., None] ** 0.5
    a = clip01(core * 1.6)[..., None]
    frame[:] = frame * (1 - a) + flame * a


# ------------------------------------------------------------- particles ----

class Petals:
    def __init__(self, n=46, seed=8):
        rng = np.random.default_rng(seed)
        self.x0 = rng.uniform(-40, W + 40, n)
        self.t0 = rng.uniform(-12, 44, n)
        self.v = rng.uniform(120, 220, n)
        self.amp = rng.uniform(20, 70, n)
        self.f = rng.uniform(0.6, 1.4, n)
        self.ph = rng.uniform(0, 6.3, n)
        self.rot = rng.uniform(-120, 120, n)
        self.size = rng.uniform(10, 20, n)
        cols = [bgr("#B5122B"), bgr("#D93A55"), bgr("#F07C8C"), bgr("#E8731A"), bgr("#C41E3A")]
        self.col = [cols[i] for i in rng.integers(0, len(cols), n)]

    def draw(self, frame, T, density=1.0):
        n = int(len(self.x0) * density)
        for i in range(n):
            y = -40 + self.v[i] * ((T - self.t0[i]) % 14)
            if y > H + 40:
                continue
            x = self.x0[i] + self.amp[i] * np.sin(self.f[i] * T + self.ph[i])
            ang = self.rot[i] * T + self.ph[i] * 50
            ax, ay = int(self.size[i]), int(self.size[i] * (0.45 + 0.25 * abs(np.sin(T * 2 + self.ph[i]))))
            c = tuple(float(v) for v in self.col[i])
            cv2.ellipse(frame, (int(x), int(y)), (ax, ay), ang, 0, 360, c, -1, cv2.LINE_AA)
            hl = tuple(float(min(v * 1.35, 1)) for v in self.col[i])
            cv2.ellipse(frame, (int(x - ax * 0.2), int(y - ay * 0.2)), (max(ax // 2, 1), max(ay // 2, 1)), ang, 0, 360,
                        hl, -1, cv2.LINE_AA)


class Dust:
    def __init__(self, n=140, seed=9):
        rng = np.random.default_rng(seed)
        self.x = rng.uniform(0, W, n)
        self.y = rng.uniform(0, H, n)
        self.vy = rng.uniform(-25, -8, n)
        self.ph = rng.uniform(0, 6.3, n)
        self.f = rng.uniform(1.5, 4.0, n)
        self.r = rng.uniform(1.0, 2.6, n)

    def draw(self, frame, T, amount=1.0, region=None):
        if amount <= 0:
            return
        small = np.zeros((H // 2, W // 2), np.float32)
        for i in range(len(self.x)):
            b = max(0.0, np.sin(self.f[i] * T + self.ph[i])) ** 3
            if b < 0.05:
                continue
            x = self.x[i] + 6 * np.sin(T * 0.7 + self.ph[i])
            y = (self.y[i] + self.vy[i] * T) % H
            if region is not None and not (region[0] < x < region[2] and region[1] < y < region[3]):
                continue
            cv2.circle(small, (int(x / 2), int(y / 2)), max(1, int(self.r[i] / 2 + 0.5)), float(b), -1, cv2.LINE_AA)
        glow = cv2.GaussianBlur(small, (0, 0), 2.5) * 3 + small
        glow = cv2.resize(glow, (W, H), interpolation=cv2.INTER_LINEAR)
        frame += glow[..., None] * GOLD_LIGHT * 0.7 * amount


def vignette():
    d = ((XX / W - 0.5) ** 2 + (YY / H - 0.5) ** 2 * 0.6)
    return (1 - 0.28 * clip01(d * 2.2) ** 1.5)[..., None]


# ------------------------------------------------------------------ scenes ----

class Assets:
    def __init__(self):
        self.silk = silk()
        self.vig = vignette()
        self.seal = wax_seal()
        self.env_front, self.env_lining = envelope_parts()
        self.card = card_layer()
        self.arch = arch_layers()
        self.garland = garland_layer()
        self.couple = couple_layer(1.0)
        self.petals = Petals()
        self.dust = Dust()
        full = paper(W, H, IVORY, seed=6)
        b = np.clip(border_mask(W, H, 46, 4) + border_mask(W, H, 62, 2), 0, 1)
        g = gold(b, bevel=0.8, depth=3)
        self.blessing_card = full * (1 - g.a[..., None]) + g.rgb * g.a[..., None]
        for (cx, cy) in ((90, 90), (W - 90, 90), (90, H - 90), (W - 90, H - 90)):   # corner rosettes
            m = np.zeros((90, 90), np.uint8)
            for k in range(8):
                ang = k * np.pi / 4
                cv2.ellipse(m, (45, 45), (30, 9), np.degrees(ang), 0, 360, 255, 2, cv2.LINE_AA)
            cv2.circle(m, (45, 45), 7, 255, -1, cv2.LINE_AA)
            put(self.blessing_card, gold(m.astype(np.float32) / 255, bevel=0.8, depth=3), cx, cy)
        T = {}
        T["ganesh"] = gold(text_mask("॥ श्री गणेशाय नमः ॥", DEVA_HEAD, 70))
        T["shubh_big"] = gold(text_mask("शुभ विवाह", DEVA_HEAD, 170), bevel=2.0, depth=8)
        T["bless_ne"] = solid(text_mask("आदरणीय मातापिताको आशीर्वादसहित", DEVA, 50, weight=500), MAROON)
        T["bless_en"] = solid(text_mask("With the blessings of our families", SERIF, 50, weight=500, italic=True), INK)
        T["groom"] = gold(text_mask(DETAILS["groom"], SCRIPT, 190), bevel=1.8, depth=7)
        T["amp"] = gold(text_mask("&", SCRIPT, 120))
        T["bride"] = gold(text_mask(DETAILS["bride"], SCRIPT, 190), bevel=1.8, depth=7)
        T["names_ne"] = solid(text_mask(f"{DETAILS['groom_ne']}  र  {DETAILS['bride_ne']}", DEVA_HEAD, 72), MAROON)
        T["together"] = solid(text_mask("TOGETHER WITH THEIR FAMILIES", CAPS, 34, weight=600, tracking=6), INK)
        T["couple_small"] = gold(text_mask(f"{DETAILS['groom']} & {DETAILS['bride']}", SCRIPT, 120))
        for k, line in enumerate(("joyfully invite you", "to celebrate the beginning of", "their beautiful journey")):
            T[f"inv{k}"] = solid(text_mask(line, SERIF, 60, weight=500, italic=True), INK)
        T["inv_ne0"] = solid(text_mask("हाम्रो नयाँ जीवनको शुभ सुरुवातमा", DEVA, 50, weight=500), MAROON)
        T["inv_ne1"] = solid(text_mask("तपाईंको उपस्थितिको हार्दिक अपेक्षा गर्दछौं", DEVA, 50, weight=500), MAROON)
        T["prog_ne"] = gold(text_mask("शुभ कार्यक्रम", DEVA_HEAD, 110), bevel=1.8, depth=7)
        T["prog_en"] = solid(text_mask("THE CELEBRATIONS", CAPS, 36, weight=600, tracking=8), INK)
        T["std"] = gold(text_mask("Save the Date", DECO, 96), bevel=1.6, depth=6)
        date = DETAILS["save_the_date"] or "Date & venue to follow"
        T["date"] = solid(text_mask(date, SERIF, 54, weight=600), MAROON)
        T["joy0"] = solid(text_mask("With joyful hearts, we welcome you", SERIF, 52, weight=500, italic=True), INK)
        T["joy1"] = solid(text_mask("to our forever", SERIF, 52, weight=500, italic=True), INK)
        T["weds"] = gold(text_mask(f"{DETAILS['groom']}  weds  {DETAILS['bride']}", SCRIPT, 116), bevel=1.6, depth=6)
        T["shubh_small"] = gold(text_mask("शुभ विवाह", DEVA_HEAD, 84))
        self.T = T
        self.flourish = flourish(560)
        self.flourish_small = flourish(380)
        self.events = [self.event_card(i, *e) for i, e in enumerate(DETAILS["events"])]

    def event_card(self, i, name, name_ne, when, where):
        w, h = 900, 300
        tints = [bgr("#FFF1C7"), bgr("#E7F0D6"), bgr("#F7DCDC"), bgr("#F4E8D6")]
        accents = [bgr("#E0A21A"), bgr("#5E8A3A"), MAROON, GOLD_DARK]
        rgb = paper(w, h, tints[i], seed=20 + i)
        a = rounded_rect_mask(w, h, 22)
        b = gold(np.clip(border_mask(w, h, 12, 2), 0, 1), bevel=0.7, depth=2)
        rgb = rgb * (1 - b.a[..., None]) + b.rgb * b.a[..., None]
        canvas = Layer(rgb, a)
        # The emblem: a gold mandala on the event's colour.
        em = np.zeros((220, 220), np.uint8)
        cv2.circle(em, (110, 110), 100, 255, 3, cv2.LINE_AA)
        cv2.circle(em, (110, 110), 84, 255, 1, cv2.LINE_AA)
        for k in range(12):
            ang = k * 30
            cv2.ellipse(em, (110, 110), (62, 16), ang, 0, 360, 255, 2, cv2.LINE_AA)
        cv2.circle(em, (110, 110), 18, 255, -1, cv2.LINE_AA)
        disc = np.zeros((220, 220), np.uint8)
        cv2.circle(disc, (110, 110), 98, 255, -1, cv2.LINE_AA)
        put_local(canvas, solid(disc.astype(np.float32) / 255 * 0.9, accents[i]), 160, h // 2)
        put_local(canvas, gold(em.astype(np.float32) / 255, bevel=0.9, depth=3), 160, h // 2)
        tx = 300
        put_local(canvas, gold(text_mask(name, DECO, 58), bevel=1.0, depth=4), None, 88, left=tx)
        put_local(canvas, solid(text_mask(name_ne, DEVA_HEAD, 48), MAROON), None, 158, left=tx)
        detail = " · ".join(x for x in (when, where) if x) or "Date & venue to follow"
        put_local(canvas, solid(text_mask(detail, SERIF, 40, weight=500, italic=True), INK), None, 228, left=tx)
        return canvas


def put_local(canvas, layer, cx, cy, left=None):
    hh, ww = layer.shape
    x0 = left if left is not None else cx - ww // 2
    y0 = cy - hh // 2
    H_, W_ = canvas.shape
    x1, y1 = min(x0 + ww, W_), min(y0 + hh, H_)
    sub_a = layer.a[:y1 - y0, :x1 - x0, None]
    canvas.rgb[y0:y1, x0:x1] = canvas.rgb[y0:y1, x0:x1] * (1 - sub_a) + layer.rgb[:y1 - y0, :x1 - x0] * sub_a


def camera(frame, scale, cx=W / 2, cy=H / 2, dx=0.0, dy=0.0):
    if abs(scale - 1) < 1e-4 and dx == 0 and dy == 0:
        return frame
    M = cv2.getRotationMatrix2D((cx, cy), 0, scale)
    M[:, 2] += (dx, dy)
    return cv2.warpAffine(frame, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def scene_envelope(A, t, T):
    f = A.silk.copy()
    L, R, Tp, B = ENV["l"], ENV["r"], ENV["t"], ENV["b"]
    w, h = R - L, B - Tp
    # A soft shadow under the envelope.
    sh = np.zeros((H, W), np.float32)
    cv2.rectangle(sh, (L + 10, Tp + 30), (R + 10, B + 34), 1, -1)
    f *= (1 - 0.28 * cv2.GaussianBlur(sh, (0, 0), 22))[..., None]
    open_p = ease(ramp(t, 3.3, 4.3))
    theta = np.pi * open_p
    apex = Tp + (ENV_APEX - Tp) * np.cos(theta)
    # Back and lining.
    f[Tp:B, L:R] = A.env_lining
    if np.cos(theta) < 0:                      # the open flap shows its lining
        flap = np.zeros((H, W), np.uint8)
        cv2.fillPoly(flap, [np.array([(L, Tp), (R, Tp), (W // 2, int(apex))], np.int32)], 255, cv2.LINE_AA)
        a = (flap.astype(np.float32) / 255)[..., None]
        f[:] = f * (1 - a) + (MAROON * 0.9 + 0.0) * a
        edge = np.zeros((H, W), np.uint8)
        cv2.polylines(edge, [np.array([(L, Tp), (W // 2, int(apex)), (R, Tp)], np.int32)], False, 255, 3, cv2.LINE_AA)
        f[:] = f * (1 - (edge / 255.0)[..., None]) + GOLD * (edge / 255.0)[..., None]
    # The card rising.
    rise = ease(ramp(t, 4.3, 6.2))
    card_cy = (Tp + 24 + A.card.shape[0] / 2) - rise * 400
    put(f, A.card, W / 2, card_cy)
    # The front pocket over the card's lower part.
    pocket = np.zeros((H, W), np.uint8)
    cv2.fillPoly(pocket, [np.array([(L, Tp), (W // 2, ENV_APEX - 30), (R, Tp), (R, B), (L, B)], np.int32)], 255,
                 cv2.LINE_AA)
    pa = (pocket[Tp:B, L:R].astype(np.float32) / 255)[..., None]
    region = f[Tp:B, L:R]
    region[:] = region * (1 - pa) + A.env_front * pa
    folds = np.zeros((H, W), np.uint8)
    for p0, p1 in (((L, B), (W // 2, ENV_APEX - 10)), ((R, B), (W // 2, ENV_APEX - 10))):
        cv2.line(folds, p0, p1, 255, 2, cv2.LINE_AA)
    fa = (folds.astype(np.float32) / 255)[..., None] * 0.18
    f[:] = f * (1 - fa)
    if np.cos(theta) >= 0:                     # the closed flap over the front
        flap = np.zeros((H, W), np.uint8)
        cv2.fillPoly(flap, [np.array([(L, Tp), (R, Tp), (W // 2, int(apex))], np.int32)], 255, cv2.LINE_AA)
        a = (flap[Tp:B, L:R].astype(np.float32) / 255)[..., None]
        shade = 0.96 + 0.04 * np.cos(theta)
        region = f[Tp:B, L:R]
        region[:] = region * (1 - a) + A.env_front * shade * a
        edge = np.zeros((H, W), np.uint8)
        cv2.polylines(edge, [np.array([(L, Tp), (W // 2, int(apex)), (R, Tp)], np.int32)], False, 255, 2, cv2.LINE_AA)
        f[:] = f * (1 - 0.25 * (edge / 255.0)[..., None])
    # The seal: glints, then splits and falls away.
    split = ease(ramp(t, 2.6, 3.3))
    if split < 1:
        sheen = (t - 1.2) / 1.2 if 1.2 < t < 2.6 else None
        if split <= 0:
            put(f, A.seal, W / 2, ENV_APEX, sheen=sheen)
        else:
            hh, ww = A.seal.shape
            for side in (-1, 1):
                half = np.zeros((hh, ww), np.float32)
                if side < 0:
                    half[:, :ww // 2] = 1
                else:
                    half[:, ww // 2:] = 1
                put(f, A.seal, W / 2 + side * 70 * split, ENV_APEX + 120 * split ** 2, angle=-side * 24 * split,
                    opacity=1 - split ** 2, alpha_mul=half)
    # Title above.
    put(f, A.T["shubh_small"], W / 2, 420, opacity=ease(ramp(t, 0.5, 1.6)) * (1 - ease(ramp(t, 4.5, 5.2))),
        sheen=(t - 1.0) / 1.5)
    put(f, A.T["couple_small"], W / 2, 560, opacity=ease(ramp(t, 0.9, 2.0)) * (1 - ease(ramp(t, 4.5, 5.2))))
    A.petals.draw(f, T, density=0.6 * ramp(t, 1.0, 2.0))
    A.dust.draw(f, T, amount=0.6)
    f *= A.vig
    zoom = 1 + 0.05 * t / 7 + 0.9 * ease(ramp(t, 6.2, 7.2))
    return camera(f, zoom, W / 2, card_cy - 40)


def scene_blessing(A, t, T):
    f = A.blessing_card.copy()
    put(f, A.T["ganesh"], W / 2, 400, opacity=ease(ramp(t, 0.3, 1.2)), sheen=(t - 0.8) / 1.4)
    put(f, A.flourish_small, W / 2, 500, opacity=ease(ramp(t, 0.6, 1.4)))
    lit = ease(ramp(t, 1.4, 2.0))
    diya(f, W / 2 - 40, 790, T, scale=1.35 * (0.9 + 0.1 * ease(ramp(t, 0.8, 1.8))), opacity=ease(ramp(t, 0.8, 1.6)),
         lit=lit)
    a = ease(ramp(t, 1.9, 2.9))
    put(f, A.T["shubh_big"], W / 2, 1140 + 30 * (1 - a), opacity=a, sheen=(t - 2.6) / 1.6)
    put(f, A.flourish, W / 2, 1290, opacity=ease(ramp(t, 2.4, 3.2)))
    a = ease(ramp(t, 2.8, 3.6))
    put(f, A.T["bless_ne"], W / 2, 1400 + 20 * (1 - a), opacity=a)
    a = ease(ramp(t, 3.2, 4.0))
    put(f, A.T["bless_en"], W / 2, 1480 + 20 * (1 - a), opacity=a)
    a = ease(ramp(t, 3.7, 4.6))
    put(f, A.T["couple_small"], W / 2, 1650 + 20 * (1 - a), opacity=a, sheen=(t - 4.4) / 1.3)
    A.dust.draw(f, T, amount=0.8 * lit, region=(200, 380, 880, 980))
    f *= A.vig
    return camera(f, 1 + 0.03 * t / 6)


def draw_arch(A, f, t, T, drift=True):
    scene, opening, fr, ln, finial = A.arch
    w, h = ARCH["w"], ARCH["h"]
    cx, cy = ARCH["cx"], ARCH["cy"]
    x0, y0 = cx - w // 2, cy - h // 2
    dx = int(10 * np.sin(T * 0.15)) if drift else 0
    sc = np.roll(scene, dx, axis=1)
    region = f[y0:y0 + h, x0:x0 + w]
    o = opening[..., None]
    region[:] = region * (1 - o) + sc * o
    # A soft inner shadow under the frame.
    inner = cv2.GaussianBlur(opening, (0, 0), 12)
    region[:] = region * (1 - 0.25 * (opening - inner).clip(0, 1)[..., None])
    put(f, fr, cx, cy, sheen=((T * 0.18) % 1.6) - 0.2)
    put(f, ln, cx, cy, opacity=0.8)
    put(f, finial, cx, y0 - 30)


def scene_names(A, t, T):
    f = A.silk.copy()
    draw_arch(A, f, t, T)
    drop = ease_out(ramp(t, 0.2, 1.3))
    sway = 3 * np.sin(T * 1.3)
    put(f, A.garland, W / 2, A.garland.shape[0] / 2 - 420 * (1 - drop), angle=0.25 * np.sin(T * 1.1),
        opacity=drop)
    y = 1340
    p = ease(ramp(t, 1.5, 2.8))
    put(f, A.T["groom"], W / 2 - 110, y, alpha_mul=reveal(A.T["groom"], p), sheen=(t - 3.0) / 1.5)
    put(f, A.T["amp"], W / 2, y + 120, opacity=ease(ramp(t, 2.7, 3.2)))
    p = ease(ramp(t, 3.0, 4.4))
    put(f, A.T["bride"], W / 2 + 110, y + 250, alpha_mul=reveal(A.T["bride"], p), sheen=(t - 4.5) / 1.5)
    a = ease(ramp(t, 4.5, 5.3))
    put(f, A.T["names_ne"], W / 2, y + 420 + 20 * (1 - a), opacity=a)
    A.petals.draw(f, T, density=ramp(t, 0.8, 2.0))
    A.dust.draw(f, T, amount=0.9, region=(80, 1150, 1000, 1850))
    f *= A.vig
    return camera(f, 1.04 - 0.04 * t / 8.5)


def scene_invitation(A, t, T):
    f = A.silk.copy()
    glow = np.exp(-(((XX - W / 2) / 520) ** 2 + ((YY - 960) / 700) ** 2))[..., None]
    f = f * (1 - 0.15 * glow) + np.array([0.97, 0.99, 1.0], np.float32) * 0.15 * glow
    put(f, A.flourish, W / 2, 700, opacity=ease(ramp(t, 0.2, 1.0)))
    items = [("together", 820), ("couple_small", 960), ("inv0", 1110), ("inv1", 1190), ("inv2", 1270)]
    for k, (key, y) in enumerate(items):
        a = ease(ramp(t, 0.5 + 0.35 * k, 1.2 + 0.35 * k))
        put(f, A.T[key], W / 2, y + 24 * (1 - a), opacity=a, sheen=(t - 2.0) / 1.5 if key == "couple_small" else None)
    put(f, A.flourish_small, W / 2, 1380, opacity=ease(ramp(t, 2.3, 3.0)))
    for k, key in enumerate(("inv_ne0", "inv_ne1")):
        a = ease(ramp(t, 2.6 + 0.4 * k, 3.4 + 0.4 * k))
        put(f, A.T[key], W / 2, 1490 + 85 * k + 20 * (1 - a), opacity=a)
    put(f, A.flourish, W / 2, 1720, opacity=ease(ramp(t, 3.4, 4.2)))
    A.petals.draw(f, T, density=0.8)
    A.dust.draw(f, T, amount=0.6)
    f *= A.vig
    return camera(f, 1 + 0.03 * t / 6)


def scene_programme(A, t, T):
    f = A.silk.copy()
    a = ease(ramp(t, 0.2, 1.0))
    put(f, A.T["prog_ne"], W / 2, 250 + 20 * (1 - a), opacity=a, sheen=(t - 1.0) / 1.5)
    put(f, A.T["prog_en"], W / 2, 350, opacity=ease(ramp(t, 0.5, 1.2)))
    put(f, A.flourish_small, W / 2, 420, opacity=ease(ramp(t, 0.7, 1.4)))
    for i, card in enumerate(A.events):
        a = ease_out(ramp(t, 0.9 + 0.55 * i, 1.7 + 0.55 * i))
        side = -1 if i % 2 == 0 else 1
        cy = 640 + 340 * i
        sh = np.zeros((H, W), np.float32)
        if a > 0:
            x = W / 2 + side * 500 * (1 - a)
            cv2.rectangle(sh, (int(x - 440), int(cy - 130)), (int(x + 460), int(cy + 170)), 1, -1)
            f *= (1 - 0.18 * a * cv2.GaussianBlur(sh, (0, 0), 18))[..., None]
            put(f, card, x, cy, opacity=a)
    A.dust.draw(f, T, amount=0.5)
    f *= A.vig
    return camera(f, 1 + 0.02 * t / 8)


def scene_date(A, t, T):
    f = A.silk.copy()
    draw_arch(A, f, t, T)
    # The couple in the arch, rising into view.
    a = ease(ramp(t, 0.4, 1.6))
    w, h = ARCH["w"], ARCH["h"]
    ch = A.couple.shape[0]
    put(f, A.couple, ARCH["cx"] + 10, ARCH["cy"] + h / 2 - ch / 2 - 6 + 30 * (1 - a), opacity=a)
    put(f, A.garland, W / 2, A.garland.shape[0] / 2, angle=0.25 * np.sin(T * 1.1))
    a = ease(ramp(t, 1.3, 2.3))
    put(f, A.T["std"], W / 2, 1330 + 20 * (1 - a), opacity=a, sheen=(t - 2.2) / 1.6)
    a = ease(ramp(t, 1.9, 2.7))
    put(f, A.T["date"], W / 2, 1450, opacity=a)
    put(f, A.flourish_small, W / 2, 1530, opacity=a)
    for k, key in enumerate(("joy0", "joy1")):
        a = ease(ramp(t, 2.6 + 0.4 * k, 3.4 + 0.4 * k))
        put(f, A.T[key], W / 2, 1620 + 76 * k + 16 * (1 - a), opacity=a)
    A.petals.draw(f, T, density=0.7)
    A.dust.draw(f, T, amount=0.7)
    f *= A.vig
    return camera(f, 1 + 0.035 * t / 7)


def scene_close(A, t, T):
    f = A.silk.copy()
    glow = np.exp(-(((XX - W / 2) / 420) ** 2 + ((YY - 820) / 420) ** 2))[..., None]
    f = f + 0.08 * glow * GOLD_LIGHT
    a = ease_out(ramp(t, 0.2, 1.2))
    put(f, A.seal, W / 2, 820, scale=0.7 + 0.5 * a, opacity=a, sheen=(t - 1.0) / 1.2)
    a = ease(ramp(t, 1.0, 2.0))
    put(f, A.T["weds"], W / 2, 1080, alpha_mul=reveal(A.T["weds"], a))
    put(f, A.flourish, W / 2, 1210, opacity=ease(ramp(t, 1.6, 2.3)))
    put(f, A.T["shubh_small"], W / 2, 1320, opacity=ease(ramp(t, 1.9, 2.6)), sheen=(t - 2.6) / 1.4)
    A.petals.draw(f, T, density=0.9)
    A.dust.draw(f, T, amount=1.0)
    f *= A.vig
    fade = ease(ramp(t, 3.4, 4.6))
    return f * (1 - fade) + IVORY * 0.0 * fade


SCENES = [  # (start, end, function)
    (0.0, 7.2, scene_envelope),
    (6.6, 12.6, scene_blessing),
    (12.0, 20.6, scene_names),
    (20.0, 26.0, scene_invitation),
    (25.4, 33.6, scene_programme),
    (33.0, 40.4, scene_date),
    (39.8, 44.5, scene_close),
]
DURATION = 44.5
FADE = 0.6


def frame_at(A, T):
    out, total = None, 0.0
    for s, e, fn in SCENES:
        if s <= T < e:
            w = min(1.0, (T - s) / FADE) if s > 0 else 1.0
            w = min(w, (e - T) / FADE) if e < DURATION else w
            w = ease(w)
            img = fn(A, T - s, T)
            out = img * w if out is None else out + img * w
            total += w
    return out / max(total, 1e-6)


def main():
    A = Assets()
    wav = OUT.with_suffix(".wav")
    music.write_wav(wav, music.render(DURATION, bells=(2.7, 13.4, 34.5, 40.3)))
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ffmpeg, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-i", str(wav), "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(OUT)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = int(DURATION * FPS)
    rng = np.random.default_rng(12)
    for i in range(n):
        T = i / FPS
        f = frame_at(A, T)
        grain = rng.normal(0, 0.005, (H // 2, W // 2)).astype(np.float32)
        f = f + cv2.resize(grain, (W, H))[..., None]
        proc.stdin.write((np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
        if i % 60 == 0:
            print(f"frame {i}/{n}", flush=True)
    proc.stdin.close()
    proc.wait()
    wav.unlink()
    print(f"wrote {OUT}")


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[2] == "--stills":
        A = Assets()
        for T in [float(x) for x in sys.argv[3].split(",")]:
            cv2.imwrite(str(Path(sys.argv[4]) / f"still_{T:05.1f}.jpg"), (np.clip(frame_at(A, T), 0, 1) * 255).astype(np.uint8))
    else:
        main()
