"""A 24-second cinematic film made from the one Himalaya photo, in 4K
portrait (2160 x 3840, 30 fps), with a score:

  himalaya-cinematic-4k.mp4   the 4K master
  himalaya-cinematic.mp4      1080 x 1920, to share

  1. The base. enhance.py clears, sharpens and grades the photo at 3x (with
     no vignette or grain: those belong to the frame, not the picture), so
     the camera can move in and still downscale.
  2. Two layers. The foreground (the leaves, and the roofs among them) is
     lifted onto a layer of its own, out of focus as with a lens focused on
     the mountain: the nearest leaves a lot, the trees down the slope less.
     The sky and haze seen between the leaves stay behind. Under the leaves,
     LaMa (from ../old-photo/deep_clean.py) paints in the hills and sky
     they hid, so that when the leaves move against the view, there is
     something behind them.
  3. The camera rises from the forest and pulls back to the whole view,
     then pushes slowly in towards the peak. Everything moves by its
     distance: the sky not at all, the snow barely, the hills more the
     nearer they are, the forest ridge more, and the leaves most. The
     leaves also sway in a light wind.
  4. Life in the view: cloud shadows drift over the hills; thin cloud over
     the snow clears and the massif comes into full golden light; mist
     drifts in the valleys between the ranges; a few birds cross the sky,
     behind the tree.
  5. The frame: a vignette and film grain fixed to the screen, a fade in and
     out.
  6. The score (with ../invitation/music.py): a held string pad that
     swells as the view opens, a low tanpura, a sparse santoor line in raga
     Bhupali, a low gong as the whole view is revealed, wind and a few
     distant birds.

    pip install numpy opencv-python-headless onnx onnxruntime imageio-ffmpeg
    python3 media/himalaya-view/make_video.py               # about 15 minutes on CPU
    python3 media/himalaya-view/make_video.py stills 2 11 21  # check frames first
"""

import subprocess
import sys
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "old-photo"))
sys.path.insert(0, str(HERE.parent / "invitation"))
import enhance as e  # noqa: E402
import music  # noqa: E402
from deep_clean import Lama  # noqa: E402

VIDEO = HERE / "himalaya-cinematic-4k.mp4"
SHARE = HERE / "himalaya-cinematic.mp4"
CACHE = Path.home() / ".cache" / "himalaya-view"
SCALE = 3                   # the base: the photo at 3x
SIZE = (2160, 3840)         # the film's frame
FPS = 30
DUR = 24.0
DEFOCUS = (4.5, 9.0)        # leaves' defocus radius in base pixels: trees down the slope, nearest leaves


# ------------------------------------------------------------------ base ----

def depth(img, sky, snow):
    """How far each layer moves with the camera (its parallax), per pixel of
    the photo: 0 for the sky, at infinity; 1 for the nearest leaves."""
    h, w = img.shape[:2]
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    x = np.linspace(0, 1, w, dtype=np.float32)[None, :]
    land = 0.03 + 0.42 * e.smooth(y, 0.45, 0.80)                 # the hills: the lower, the nearer
    bg = land * (1 - sky) * (1 - snow) + 0.015 * snow
    bg = cv2.GaussianBlur(np.broadcast_to(bg, (h, w)).astype(np.float32), (0, 0), 8)
    ridge = 0.55 + 0.35 * e.smooth(y, 0.74, 0.88)                 # the trees below the forest ridge, nearer lower down
    tree = (1 - e.smooth(x, 0.18, 0.34)) * e.smooth(y, 0.18, 0.28)  # the tree on the left, nearest of all
    fg = np.maximum(np.broadcast_to(ridge, (h, w)), tree)
    fg = cv2.GaussianBlur(fg.astype(np.float32), (0, 0), 40)
    return bg, fg


def foreground(img, fol_hard):
    """What in the leaf mask is foreground: the leaves, and the roofs and
    trunks among them. The mask also holds the sky and haze seen between
    the leaves, and the pale rims the phone's sharpening drew round them;
    those are bluish and light, belong to the view behind, and must not
    move with the leaves."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, B = lab[..., 0], lab[..., 2] - 128
    behind = (B < -3) & (L > 90)
    near = (fol_hard > 0) & ~behind
    return cv2.morphologyEx(near.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)).astype(np.float32)


def lens(f, mask, radius):
    """The leaves seen through a lens focused far beyond them: their colour,
    disc-blurred from the leaves alone, and how much they cover each pixel
    once blurred (as in enhance.defocus)."""
    r = int(np.ceil(radius))
    disc = np.zeros((2 * r + 1, 2 * r + 1), np.float32)
    cv2.circle(disc, (r, r), r, 1.0, -1, cv2.LINE_AA)
    disc = cv2.GaussianBlur(disc, (0, 0), 0.6)
    disc /= disc.sum()
    grow = max(1, int(round(radius * 0.4)))
    m = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * grow + 1, 2 * grow + 1)))
    spread = cv2.filter2D(m, -1, disc)
    leaf = cv2.filter2D(f * m[..., None], -1, disc) / (spread[..., None] + 1e-4)
    return leaf, np.clip(spread * 1.5, 0, 1)


def spread(f, valid):
    """`f` (h x w x c) filled in where not `valid` from the valid pixels
    around: normalised blurs from coarse to fine, each used where it has
    enough valid pixels to go on, so the fill is sharpest near the edge."""
    v = valid.astype(np.float32)
    out = None
    for sigma in (240, 100, 40, 16, 6):
        wt = cv2.GaussianBlur(v, (0, 0), sigma)
        avg = cv2.GaussianBlur(f * v[..., None], (0, 0), sigma).reshape(f.shape) / np.maximum(wt, 1e-6)[..., None]
        a = np.clip(wt / 0.25, 0, 1)[..., None]
        out = avg if out is None else avg * a + out * (1 - a)
    return np.where(valid[..., None], f, out)


def prepare():
    """The background plate and the leaf layer (colour and cover), at 3x,
    plus the per-pixel parallax and the masks the effects need, at the
    photo's size. Cached: this takes a few minutes."""
    path = CACHE / "layers.npz"
    if path.exists():
        z = np.load(path)
        return {k: z[k] for k in z.files}
    img = cv2.imread(str(e.SOURCE))
    h, w = img.shape[:2]
    big = (w * SCALE, h * SCALE)
    sky, fol, snow, dist, fol_hard, band = e.regions(img)
    clear, _, _ = e.dehaze(img, sky, snow, dist, fol_hard, band)
    rows = np.broadcast_to(np.linspace(0, 1, h, dtype=np.float32)[:, None], (h, w))
    masks = dict(sky=sky, fol=fol, snow=snow, dist=dist, band=band, rows=rows)
    done = CACHE / "base.npy"
    if done.exists():
        base = np.load(done).astype(np.float32)
    else:
        base = e.render(clear, masks, (0, 0, w, h), big, blur=0.0, finish=False).astype(np.float32)
        CACHE.mkdir(parents=True, exist_ok=True)
        np.save(done, base.astype(np.float16))
    p_bg, p_fg = depth(img, sky, snow)
    # The leaves, out of focus: the nearest a lot, those down the slope less.
    near = cv2.resize(e.smooth(p_fg, 0.62, 0.85), big, interpolation=cv2.INTER_LINEAR)[..., None]
    near_px = foreground(img, fol_hard)
    real = cv2.resize(near_px, big, interpolation=cv2.INTER_LINEAR)
    leaf_mid, cover_mid = lens(base, real, DEFOCUS[0])
    leaf_near, cover_near = lens(base, real, DEFOCUS[1])
    leaf = leaf_mid * (1 - near) + leaf_near * near
    cover = cover_mid * (1 - near[..., 0]) + cover_near * near[..., 0]
    del leaf_mid, leaf_near
    # What the leaves hid, painted in by LaMa at the photo's size: under
    # them and their rims (3 px round them). The sky seen between leaves
    # beyond that is real, and stays.
    hole = cv2.dilate(near_px, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))) > 0
    small = np.clip(cv2.resize(base, (w, h), interpolation=cv2.INTER_AREA), 0, 1)
    filled = Lama().fill((small * 255 + 0.5).astype(np.uint8), hole).astype(np.float32) / 255
    # With nothing beyond the photo's left edge to go on, LaMa paints a dark
    # smudge behind the tree there. So the colour is spread in from the sky
    # and hills around the hole, and LaMa gives only its texture, and none
    # in the sky, which has none.
    texture = np.clip(filled - cv2.GaussianBlur(filled, (0, 0), 4), -0.04, 0.04)
    texture *= 1 - spread(sky[..., None], ~hole)
    filled = np.where(hole[..., None], spread(small, ~hole) + texture, small)
    fill = cv2.resize(filled, big, interpolation=cv2.INTER_LANCZOS4)
    a = cv2.resize(hole.astype(np.float32), big, interpolation=cv2.INTER_LINEAR)
    a = np.clip(cv2.GaussianBlur(a, (0, 0), 3) * 2, 0, 1)[..., None]
    plate = base * (1 - a) + fill * a
    # A touch of softening, so the camera's resampling does not shimmer.
    plate = cv2.GaussianBlur(plate, (0, 0), 0.5)
    leaf = cv2.GaussianBlur(leaf, (0, 0), 0.5)
    out = dict(plate=plate.astype(np.float16), leaf=np.dstack([leaf, cover]).astype(np.float16),
               p_bg=p_bg, p_fg=p_fg, sky=sky.astype(np.float32), snow=snow.astype(np.float32),
               dist=dist.astype(np.float32), fol=fol_hard.astype(np.float32), filled=filled, hole=hole)
    CACHE.mkdir(parents=True, exist_ok=True)
    np.savez(path, **out)
    return out


# ---------------------------------------------------------------- camera ----

# Through the film the camera passes these marks, at a progress u (0..1):
# where it looks (a fraction of the photo across and down), its zoom (1 shows
# the whole photo), how far it has slid sideways and up (in base pixels; it
# moves the leaves most and the sky not at all), and how far it has pushed
# forward (the near leaves grow by this much more than the far view).
MARKS = [
    # u     look at          zoom   slide          push
    (0.00, (0.555, 0.615), 1.40, (-40.0, 75.0), 0.07),   # low, among the leaves and forest
    (0.47, (0.515, 0.505), 1.10, (0.0, 0.0), 0.00),      # risen and pulled back: the whole view
    (1.00, (0.555, 0.425), 1.42, (35.0, -45.0), 0.05),   # pushed in towards the peak
]


def hermite(u, us, vs):
    """Smooth curve through (us, vs): Catmull-Rom tangents, uneven spacing."""
    vs = np.asarray(vs, np.float64)
    n = len(us)
    tan = []
    for i in range(n):
        a, b = max(i - 1, 0), min(i + 1, n - 1)
        tan.append((vs[b] - vs[a]) / (us[b] - us[a]))
    i = min(np.searchsorted(us, u, side="right") - 1, n - 2)
    d = us[i + 1] - us[i]
    s = (u - us[i]) / d
    h00, h10 = 2 * s ** 3 - 3 * s ** 2 + 1, s ** 3 - 2 * s ** 2 + s
    h01, h11 = -2 * s ** 3 + 3 * s ** 2, s ** 3 - s ** 2
    return h00 * vs[i] + h10 * d * tan[i] + h01 * vs[i + 1] + h11 * d * tan[i + 1]


def camera(t, wb, hb):
    """Where the camera is at time t: centre (base px), zoom, slide, push."""
    tau = np.clip(t / DUR, 0, 1)
    u = 0.75 * (0.5 - 0.5 * np.cos(np.pi * tau)) + 0.25 * tau     # eased, but never quite still
    us = [m[0] for m in MARKS]
    cx, cy = hermite(u, us, [m[1] for m in MARKS])
    z = np.exp(hermite(u, us, [np.log(m[2]) for m in MARKS]))
    tx, ty = hermite(u, us, [m[3] for m in MARKS])
    push = hermite(u, us, [m[4] for m in MARKS])
    return (float(cx * wb - 0.5), float(cy * hb - 0.5)), float(z), (float(tx), float(ty)), float(push)


# --------------------------------------------------------------- effects ----

def noise(h, w, scale, seed, octaves=4, stretch=(1.0, 1.0)):
    """Smooth fractal noise, 0..1, features about `scale` pixels across
    (times `stretch` across and down)."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        sx, sy = scale * stretch[0] / 2 ** o, scale * stretch[1] / 2 ** o
        g = rng.random((int(h / sy) + 3, int(w / sx) + 3)).astype(np.float32)
        out += amp * cv2.resize(g, (int((g.shape[1]) * sx), int((g.shape[0]) * sy)),
                                interpolation=cv2.INTER_CUBIC)[:h, :w]
        total += amp
        amp *= 0.5
    out /= total
    return (out - out.mean()) / (out.std() * 4) + 0.5


def shift(tex, dx, w):
    """`tex` slid dx pixels to the right, cut to width w."""
    m = np.float32([[1, 0, -dx], [0, 1, 0]])
    return cv2.warpAffine(tex, m, (w, tex.shape[0]), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


class Weather:
    """Cloud shadows, the shadow over the snow lifting, mist in the valleys
    and leaves in the wind, as fields over the photo at time t."""

    VALLEYS = ((942, 16, 0.75), (1016, 20, 0.8), (1238, 30, 1.0))   # row, spread, strength: where mist lies

    def __init__(self, L):
        self.h, self.w = h, w = L["sky"].shape
        sky, snow, dist, self.p_fg = L["sky"], L["snow"], L["dist"], L["p_fg"]
        y = np.arange(h, dtype=np.float32)[:, None]
        self.land = dist * (0.5 + 0.5 * e.smooth(y / h, 0.50, 0.75))   # far hills show cloud shadow less, through the haze
        self.snow = snow
        self.hills_tex = noise(h, w + 900, 300, 11)
        self.snow_tex = noise(h, w + 900, 220, 12)
        valley = sum(a * np.exp(-0.5 * ((y - r) / s) ** 2) for r, s, a in self.VALLEYS)
        self.valley = (valley * dist).astype(np.float32)
        self.mist_a = noise(h, w + 600, 70, 13, octaves=2, stretch=(3.0, 0.5))
        self.mist_b = noise(h, w + 600, 50, 14, octaves=2, stretch=(4.0, 0.6))
        rng = np.random.default_rng(15)
        self.phase = [cv2.GaussianBlur(rng.uniform(0, 2 * np.pi * 8, (h, w)).astype(np.float32), (0, 0), 30)
                      for _ in range(3)]
        near = e.smooth(self.p_fg, 0.62, 0.85)
        self.sway_amp = (0.25 + 1.9 * near).astype(np.float32)      # photo px: the near leaves move most

    def light(self, t):
        """Colour multiplier (BGR) over the photo, and the mist's opacity."""
        hills = e.smooth(shift(self.hills_tex, 30 * t - 450, self.w), 0.56, 0.74)
        # Thin cloud over the snow: dimmer, cooler light all over the massif,
        # a little patchy, clearing as the view opens.
        lift = 1 - e.smooth(t, 3.0, 12.5)
        over_snow = (0.6 + 0.4 * e.smooth(shift(self.snow_tex, -26 * t - 300, self.w), 0.30, 0.70)) * lift
        sh_land = hills * self.land
        sh_snow = over_snow * self.snow
        warm = self.snow * (1 - over_snow) * e.smooth(t, 6.0, 20.0)  # sunlit snow warms through the film
        mul = np.empty((self.h, self.w, 3), np.float32)
        for c, (land, snow, sun) in enumerate(((0.07, 0.07, -0.012), (0.11, 0.13, 0.004), (0.14, 0.18, 0.035))):
            mul[..., c] = 1 - land * sh_land - snow * sh_snow + sun * warm
        wisp = 0.6 * shift(self.mist_a, 14 * t - 300, self.w) + 0.4 * shift(self.mist_b, 7 * t - 300, self.w)
        mist = 0.2 * self.valley * e.smooth(wisp, 0.40, 0.78)
        return mul, mist

    def sway(self, t):
        """How far the leaves are blown, in photo pixels (x, y)."""
        gust = 0.65 + 0.35 * np.sin(2 * np.pi * t / 8.5) + 0.15 * np.sin(2 * np.pi * t / 3.1)
        p1, p2, p3 = self.phase
        dx = self.sway_amp * gust * (0.7 * np.sin(2 * np.pi * 0.23 * t + p1) + 0.3 * np.sin(2 * np.pi * 0.61 * t + p2))
        dy = self.sway_amp * gust * 0.35 * np.sin(2 * np.pi * 0.31 * t + p3)
        return dx.astype(np.float32), dy.astype(np.float32)


# ----------------------------------------------------------------- birds ----

FLOCK = [  # offset from the leader (base px), wingspan, wingbeats per second
    (0, 0, 34, 3.1), (-70, -26, 31, 2.8), (-84, 30, 32, 3.3), (-150, -52, 29, 2.9),
    (-170, 54, 30, 3.0), (-238, -70, 28, 3.4), (-226, 88, 30, 2.7),
]
BIRDS = (7.5, 17.5, 0.255)       # start and end of their crossing (s), and their height (fraction of the photo)
BIRD_DEPTH = 0.12                # their parallax: far nearer than the peak, far beyond the leaves


def draw_birds(img, t, cam, wb, hb, s):
    """The flock, small dark silhouettes, drawn into the frame before the
    leaves go over it, so they pass behind the tree."""
    t0, t1, height = BIRDS
    if not t0 - 0.5 < t < t1 + 0.5:
        return
    (cx, cy), z, (tx, ty), push = cam
    H, W = img.shape[:2]
    k = (t - t0) / (t1 - t0)
    lx = (-0.06 + 1.14 * k) * wb
    ly = height * hb - 60 * k * SCALE + 6 * SCALE * np.sin(0.5 * t)
    grow = (1 + BIRD_DEPTH * push) * s
    ss = 4
    for i, (ox, oy, span, beat) in enumerate(FLOCK):
        bx = lx + ox * 1.0 + 9 * np.sin(0.7 * t + i)
        by = ly + oy + 5 * np.sin(1.3 * t + 2 * i)
        u = (bx - cx - BIRD_DEPTH * tx) * grow + W / 2
        v = (by - cy - BIRD_DEPTH * ty) * grow + H / 2
        sp = span * grow
        r = int(sp * 0.7) + 4
        if not (-r < u < W + r and -r < v < H + r):
            continue
        glide = np.clip(0.5 + 0.9 * np.sin(2 * np.pi * 0.17 * t + 1.7 * i), 0.12, 1.0)
        flap = np.sin(2 * np.pi * beat * t + 2.1 * i) * glide
        half = sp / 2
        pts = []
        for side in (-1, 1):
            tip = (side * half, -0.55 * half * flap + 0.04 * half)
            elbow = (side * 0.42 * half, -0.22 * half * flap - 0.10 * half)
            pts.append([tip, elbow, (0.0, 0.0)])
        size = 2 * r + 1
        canvas = np.zeros((size * ss, size * ss), np.float32)
        fu, fv = u - int(u), v - int(v)
        poly = [np.int32([((x + r + fu) * ss * 16, (y + r + fv) * ss * 16) for x, y in p]) for p in pts]
        cv2.polylines(canvas, poly, False, 1.0, max(1, int(round(0.085 * sp * ss))), cv2.LINE_AA, shift=4)
        cv2.circle(canvas, (int((r + fu) * ss * 16), int((r + fv + 0.04 * half) * ss * 16)),
                   int(0.07 * sp * ss * 16), 1.0, -1, cv2.LINE_AA, shift=4)
        a = cv2.resize(canvas, (size, size), interpolation=cv2.INTER_AREA)[..., None] * 0.66
        x0, y0 = int(u) - r, int(v) - r
        xa, ya, xb, yb = max(x0, 0), max(y0, 0), min(x0 + size, W), min(y0 + size, H)
        if xa >= xb or ya >= yb:
            continue
        aa = a[ya - y0:yb - y0, xa - x0:xb - x0]
        roi = img[ya:yb, xa:xb]
        roi[:] = roi * (1 - aa) + np.float32([0.17, 0.17, 0.19]) * aa


# ----------------------------------------------------------------- frame ----

class Film:
    def __init__(self, size=SIZE):
        L = prepare()
        self.W, self.H = W, H = size
        self.plate = L["plate"].astype(np.float32)
        self.leaf = np.ascontiguousarray(L["leaf"][..., :3]).astype(np.float32)
        self.cover = L["leaf"][..., 3].astype(np.float32)
        self.hb, self.wb = self.plate.shape[:2]
        self.p_bg, self.p_fg = L["p_bg"], L["p_fg"]
        self.weather = Weather(L)
        self.mist = np.empty((H, W, 3), np.float32)
        self.mist[:] = (0.90, 0.88, 0.86)
        self.ox = (np.arange(W, dtype=np.float32) + 0.5 - W / 2)[None, :]
        self.oy = (np.arange(H, dtype=np.float32) + 0.5 - H / 2)[:, None]
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.hypot((xx / W - 0.5) / 0.75, (yy / H - 0.48) / 0.85)
        self.vignette = cv2.merge([(1 - 0.22 * e.smooth(r, 0.40, 1.05)).astype(np.float32)] * 3)
        rng = np.random.default_rng(21)
        g = W / SIZE[0]
        self.grain = [cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), 0.65 * g) * 0.010
                      for _ in range(6)]
        self.rng = np.random.default_rng(22)

    def to_photo(self, c, s):
        """The affine map from frame pixels to photo pixels (for warpAffine)."""
        k = 1 / (SCALE * s)
        tx = (c[0] + 0.5) / SCALE - 0.5 + (0.5 - self.W / 2) * k
        ty = (c[1] + 0.5) / SCALE - 0.5 + (0.5 - self.H / 2) * k
        return np.float32([[k, 0, tx], [0, k, ty]])

    def warp(self, f, m):
        return cv2.warpAffine(f, m, (self.W, self.H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP,
                              borderMode=cv2.BORDER_REPLICATE)

    def maps(self, c, s, p, slide, push, extra=None):
        """Where each frame pixel samples the base, for a layer whose
        parallax is p (per pixel): further out the more it is pushed past,
        shifted the more the camera has slid."""
        inv = p * push
        inv += 1
        np.reciprocal(inv, out=inv)
        mx = self.ox * np.float32(1 / s) * inv
        mx += p * np.float32(slide[0]) + np.float32(c[0])
        my = self.oy * np.float32(1 / s) * inv
        my += p * np.float32(slide[1]) + np.float32(c[1])
        if extra is not None:
            mx += extra[0]
            my += extra[1]
        return mx, my

    def frame(self, t):
        cam = camera(t, self.wb, self.hb)
        c, z, slide, push = cam
        s = self.W / self.wb * z
        m = self.to_photo(c, s)
        # The view behind the leaves, each part moving by its distance, with
        # its cloud shadows and mist.
        mx, my = self.maps(c, s, self.warp(self.p_bg, m), slide, push)
        bg = cv2.remap(self.plate, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        mul, mist = self.weather.light(t)
        cv2.multiply(bg, self.warp(mul, m), dst=bg)
        a = self.warp(mist, m)
        bg = cv2.blendLinear(bg, self.mist, 1 - a, a)
        draw_birds(bg, t, cam, self.wb, self.hb, s)
        # The leaves, nearer, moving more, swaying.
        dx, dy = self.weather.sway(t)
        p = self.warp(self.p_fg, m)
        sway = self.warp(np.dstack([dx, dy]) * SCALE, m)
        mx, my = self.maps(c, s, p, slide, push, (sway[..., 0], sway[..., 1]))
        leaf = cv2.remap(self.leaf, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        cover = cv2.remap(self.cover, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        out = cv2.blendLinear(leaf, bg, cover, 1 - cover)
        # The frame: vignette, grain (more in the shadows), fades.
        fade = e.smooth(t, 0.0, 1.5) * (1 - e.smooth(t, DUR - 1.8, DUR))
        g = np.roll(self.grain[int(t * FPS) % len(self.grain)],
                    (self.rng.integers(0, self.H), self.rng.integers(0, self.W)), (0, 1))
        g *= 1.2 - cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)
        out += g[..., None]
        cv2.multiply(out, self.vignette, dst=out, scale=float(fade))
        return cv2.convertScaleAbs(out, alpha=255)


# ----------------------------------------------------------------- score ----

def score(dur, seed=31):
    """Pad, tanpura, a sparse santoor line in Bhupali, a gong at the reveal,
    wind and distant birds. Returns stereo samples."""
    sr = music.SR
    rng = np.random.default_rng(seed)
    n = int(dur * sr)
    t = np.arange(n) / sr
    swell = 0.35 + 0.65 * e.smooth(t, 1.0, 11.0) - 0.25 * e.smooth(t, 14.0, 22.0)
    mix = 0.30 * music.pad(dur) * swell + 0.16 * music.tanpura(dur, rng) * e.smooth(t, 0.5, 4.0)

    def add(sig, at, gain):
        a = int(at * sr)
        b = min(a + len(sig), n)
        if a < n:
            mix[a:b] += gain * sig[:b - a]

    notes = {}

    def santoor(name, at, strokes=1, gain=0.20):
        octave = 2 if name.endswith("'") else 1
        f = music.SA * 2 * music.BHUPALI[name.rstrip("'")] * octave
        if f not in notes:
            notes[f] = music.pluck(f, 2.6, rng)
        for k in range(strokes):
            add(notes[f], at + 0.11 * k, gain * (0.85 ** k))

    line = [("G", 3.6, 1), ("R", 4.5, 1), ("S", 5.1, 3), ("R", 6.6, 1), ("G", 7.2, 1), ("P", 7.9, 3),
            ("G", 9.3, 1), ("R", 9.9, 1), ("G", 10.4, 4),
            ("S'", 12.2, 3), ("D", 13.4, 1), ("P", 14.0, 1), ("G", 14.6, 3), ("R", 15.9, 1), ("G", 16.4, 1),
            ("P", 17.0, 1), ("D", 17.6, 1), ("S'", 18.3, 4), ("D", 19.8, 1), ("P", 20.3, 1), ("G", 20.8, 1),
            ("R", 21.3, 1), ("S", 21.8, 5)]
    for name, at, strokes in line:
        santoor(name, at, strokes)
    add(music.bell(music.SA / 2, 8.0), 11.3, 0.30)                    # the gong as the whole view opens
    add(music.bell(music.SA * 4, 4.0), 21.8, 0.08)
    mix = music.reverb(mix, rng, length=3.2, decay=1.2, wet=0.32)
    mix = mix / np.abs(mix).max()

    def band(lo, hi, size):
        spec = np.fft.rfft(rng.normal(0, 1, size))
        f = np.fft.rfftfreq(size, 1 / sr)
        spec *= np.exp(-0.5 * (np.log(np.maximum(f, 1) / np.sqrt(lo * hi)) / np.log(hi / lo) * 2.2) ** 2)
        x = np.fft.irfft(spec, size)
        return x / np.abs(x).max()

    gusts = 0.55 + 0.30 * np.sin(2 * np.pi * t / 8.5) + 0.15 * np.sin(2 * np.pi * t / 3.1 + 1)
    wind = [band(120, 900, n) * gusts * 0.10 for _ in range(2)]
    stereo = np.stack([mix + wind[0], np.roll(mix, int(0.012 * sr)) + wind[1]], 1)
    for at, pan in ((2.4, 0.3), (6.1, 0.7), (9.8, 0.4), (12.6, 0.8), (14.9, 0.2), (18.7, 0.6)):
        call = np.zeros(int(0.6 * sr))
        for k in range(rng.integers(2, 4)):
            d = rng.uniform(0.05, 0.08)
            tt = np.arange(int(d * sr)) / sr
            f = rng.uniform(2900, 3400) + 1500 * tt / d
            chirp = np.sin(2 * np.pi * np.cumsum(f) / sr) * np.sin(np.pi * tt / d) ** 2
            a = int(k * 0.13 * sr)
            call[a:a + len(chirp)] += chirp
        a = int(at * sr)
        b = min(a + len(call), n)
        stereo[a:b, 0] += 0.035 * (1 - pan) * call[:b - a]
        stereo[a:b, 1] += 0.035 * pan * call[:b - a]
    stereo *= (e.smooth(t, 0.0, 1.5) * (1 - e.smooth(t, dur - 2.5, dur)))[:, None]
    return stereo / np.abs(stereo).max() * 0.8


# ---------------------------------------------------------------- encode ----

def make():
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    CACHE.mkdir(parents=True, exist_ok=True)
    wav = CACHE / "score.wav"
    music.write_wav(wav, score(DUR))
    film = Film()
    W, H = film.W, film.H
    proc = subprocess.Popen(
        [ffmpeg, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
         "-r", str(FPS), "-i", "-", "-i", str(wav), "-c:v", "libx264", "-preset", "slow", "-crf", "19",
         "-maxrate", "15M", "-bufsize", "30M", "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "5.1",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", str(VIDEO)],
        stdin=subprocess.PIPE)
    frames = int(DUR * FPS)
    for i in range(frames):
        proc.stdin.write(film.frame(i / FPS).tobytes())
        if i % 60 == 0:
            print(f"frame {i}/{frames}", flush=True)
    proc.stdin.close()
    proc.wait()
    subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-i", str(VIDEO), "-vf", "scale=1080:1920:flags=lanczos",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "7M", "-bufsize", "14M",
                    "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", str(SHARE)], check=True)
    print(f"wrote {VIDEO.name} and {SHARE.name}")


def stills(times, out=CACHE):
    film = Film()
    out.mkdir(parents=True, exist_ok=True)
    for t in times:
        path = out / f"frame-{t:05.2f}.jpg"
        cv2.imwrite(str(path), film.frame(t), [cv2.IMWRITE_JPEG_QUALITY, 92])
        print(f"wrote {path}")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "stills":
        stills([float(a) for a in sys.argv[2:]])
    else:
        make()
