"""Manish & Sushmita, the invitation's second edition: one continuous,
camera-led film, about 49 seconds, 1080 x 1920 at 30 fps.

  A  0-7 s     Dark velvet. A spark falls and lights a diya; its light draws
               a gold mandala ring by ring around M&S, the rings turning
               against each other. The camera dives into the mandala's heart.
  B  7-14 s    An envelope flies up in 3D. Its wax seal bursts into petals
               and gold sparks, the flap opens, the card rises and flies at
               the camera, turning over to show the blessing on its back.
  C  14-24 s   The invitation card's arch window: the camera pushes through
               it into a paper-cut Nepal, every layer at its own depth so the
               Himalaya, the hills, a stupa, a pagoda and prayer flags open
               out with real parallax. Sun rays turn, birds cross, and a
               sparkler writes the names in the sky, shedding glitter.
  D  23-30 s   Dusk falls to night; sky lanterns rise from the valley and
               the invitation is written among the stars.
  E  30-37 s   The programme on a turning prism: Haldi, Mehendi, Shubh
               Vivah, Pritibhoj, one face at a time.
  F  37-44 s   The couple on a hilltop under the moon; fireflies drift in
               from everywhere and gather into a heart above them. Save the
               Date.
  G  43-49 s   The camera tilts up into the stars, which join into M ♥ S;
               Manish weds Sushmita.

Particles (sparks, glitter, petals) are ballistic with drag, worked out in
closed form, so any frame can be rendered on its own. The details and the
fonts are shared with make_invitation.py.

    python3 media/invitation/make_invitation2.py [fonts_dir]
    python3 media/invitation/make_invitation2.py [fonts_dir] --stills 3,10,20 out_dir
"""

import subprocess
import sys
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import make_invitation as mi  # noqa: E402
import music  # noqa: E402
from make_invitation import (CAPS, DECO, DETAILS, DEVA, DEVA_HEAD, FPS, GOLD, GOLD_DARK, GOLD_LIGHT, H,  # noqa: E402
                             INK, IVORY, MAROON, SCRIPT, SERIF, W, XX, YY, Layer, bgr, clip01, ease, ease_out,
                             gold, put, ramp, reveal, solid, text_mask)

OUT = HERE / "manish-sushmita-invitation-2.mp4"
DURATION = 49.0
HW, HH = W // 2, H // 2
WARM = bgr("#FFD9A0")
LIGHT_GOLD = (bgr("#C08A30"), bgr("#FFF0C8"))


# ---------------------------------------------------------------- helpers ----

def blit(rgb, a, layer, cx, cy, opacity=1.0, alpha_mul=None, sheen=None, angle=0.0):
    """mi.put onto a texture that has its own alpha."""
    lay_a = layer.a if alpha_mul is None else layer.a * alpha_mul
    put(rgb, Layer(layer.rgb, lay_a), cx, cy, opacity=opacity, sheen=sheen, angle=angle)
    cover = np.zeros(a.shape + (3,), np.float32)
    put(cover, Layer(np.ones(layer.rgb.shape, np.float32), lay_a), cx, cy, opacity=opacity, angle=angle)
    a[:] = a + cover[..., 0] * (1 - a)


def rot(rx, ry, rz=0.0):
    cx, sx, cy, sy, cz, sz = np.cos(rx), np.sin(rx), np.cos(ry), np.sin(ry), np.cos(rz), np.sin(rz)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Ry @ Rx


def project(pts, cx, cy, scale=1.0, rx=0.0, ry=0.0, rz=0.0, f=2000.0, z=0.0):
    """Points (N x 2, centred texture coordinates) on a plane turned in 3D."""
    P = np.c_[pts * scale, np.zeros(len(pts))] @ rot(rx, ry, rz).T
    Z = P[:, 2] + z
    return np.stack([cx + f * P[:, 0] / (f + Z), cy + f * P[:, 1] / (f + Z)], 1).astype(np.float32)


def quad(w, h):
    return np.array([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], np.float32)


def warp_put(frame, rgb, a, dst, opacity=1.0, shade=1.0, flip=False):
    """Map a texture onto a quadrilateral of the frame."""
    if opacity <= 0.002:
        return
    h, w = a.shape
    src = np.float32([[w, 0], [0, 0], [0, h], [w, h]]) if flip else np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    x0, y0 = np.floor(dst.min(0)).astype(int)
    x1, y1 = np.ceil(dst.max(0)).astype(int)
    x0, y0, x1, y1 = max(x0, 0), max(y0, 0), min(x1, W), min(y1, H)
    if x1 <= x0 or y1 <= y0:
        return
    M = cv2.getPerspectiveTransform(src, (dst - np.float32([x0, y0])).astype(np.float32))
    rw = cv2.warpPerspective(rgb, M, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR)
    aw = cv2.warpPerspective(a, M, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR)[..., None] * opacity
    region = frame[y0:y1, x0:x1]
    region *= 1 - aw
    region += rw * shade * aw


def bloom(f, thresh=0.86, gain=0.45):
    small = cv2.resize(f, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    br = np.clip(small - thresh, 0, None)
    g = cv2.GaussianBlur(br, (0, 0), 5) + 0.7 * cv2.GaussianBlur(br, (0, 0), 16)
    return f + gain * cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)


def glow_points(f, x, y, b, colour, core=1.0, halo=3.5, gain=1.0):
    """Add glowing points (arrays of x, y, brightness) to the frame."""
    if len(x) == 0:
        return
    acc = np.zeros((HH, HW), np.float32)
    xi, yi = np.round(np.asarray(x) / 2).astype(int), np.round(np.asarray(y) / 2).astype(int)
    ok = (xi >= 0) & (xi < HW) & (yi >= 0) & (yi < HH)
    np.add.at(acc, (yi[ok], xi[ok]), np.asarray(b, np.float32)[ok])
    g = cv2.GaussianBlur(acc, (0, 0), core) * 3 + cv2.GaussianBlur(acc, (0, 0), halo) * 6
    f += cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)[..., None] * colour * gain


def ballistic(age, x0, y0, vx, vy, k, g):
    e = (1 - np.exp(-k * age)) / k
    return x0 + vx * e, y0 + vy * e + g * (age - e) / k


class Particles:
    """Particles fired at known times, positions worked out in closed form."""

    def __init__(self, t, x, y, vx, vy, life, k=1.6, g=600.0):
        self.t, self.x, self.y, self.vx, self.vy, self.life = map(np.asarray, (t, x, y, vx, vy, life))
        self.k, self.g = k, g

    def at(self, T):
        age = T - self.t
        alive = (age >= 0) & (age < self.life)
        x, y = ballistic(age[alive], self.x[alive], self.y[alive], self.vx[alive], self.vy[alive], self.k, self.g)
        return x, y, 1 - age[alive] / self.life[alive], alive


def burst(t0, x0, y0, n, speed, rng, up=0.35, life=(0.6, 1.4), k=1.6, g=600.0):
    ang = rng.uniform(0, 2 * np.pi, n)
    sp = rng.uniform(*speed, n)
    vx, vy = np.cos(ang) * sp, np.sin(ang) * sp - up * sp
    return Particles(np.full(n, t0), np.full(n, x0), np.full(n, y0), vx, vy, rng.uniform(*life, n), k, g)


class PetalBurst:
    def __init__(self, t0, x0, y0, n, rng):
        self.p = burst(t0, x0, y0, n, (300, 950), rng, up=0.45, life=(1.8, 3.0), k=1.3, g=700)
        cols = [bgr("#B5122B"), bgr("#D93A55"), bgr("#F07C8C"), bgr("#E8731A"), bgr("#C41E3A")]
        self.col = [cols[i] for i in rng.integers(0, len(cols), n)]
        self.size = rng.uniform(9, 18, n)
        self.spin = rng.uniform(-400, 400, n)

    def draw(self, f, T):
        x, y, fade, alive = self.p.at(T)
        idx = np.nonzero(alive)[0]
        for j, i in enumerate(idx):
            ax = int(self.size[i])
            ay = max(1, int(self.size[i] * (0.45 + 0.3 * abs(np.sin(T * 3 + i)))))
            ang = self.spin[i] * (T - self.p.t[i])
            c = tuple(float(v) for v in self.col[i])
            cv2.ellipse(f, (int(x[j]), int(y[j])), (ax, ay), ang, 0, 360, c, -1, cv2.LINE_AA)


def velvet():
    d = np.sqrt(((XX - W / 2) / (W * 0.8)) ** 2 + ((YY - H * 0.42) / (H * 0.62)) ** 2)
    c0, c1 = bgr("#6E1226"), bgr("#120208")
    col = c0 + (c1 - c0) * (clip01(d) ** 1.1)[..., None]
    rng = np.random.default_rng(3)
    n = cv2.resize(cv2.GaussianBlur(rng.normal(0, 1, (H // 8, W // 8)).astype(np.float32), (0, 0), 3), (W, H))
    return (col * (1 + 0.06 * n)[..., None]).astype(np.float32)


class Bokeh:
    def __init__(self, n=30, seed=4):
        rng = np.random.default_rng(seed)
        self.x, self.y = rng.uniform(0, W, n), rng.uniform(0, H, n)
        self.r = rng.uniform(18, 80, n)
        self.a = rng.uniform(0.05, 0.16, n)
        self.vy = rng.uniform(-18, -5, n)
        self.ph = rng.uniform(0, 6.3, n)

    def draw(self, f, T, amount=1.0, tint=None):
        if amount <= 0:
            return
        tint = WARM if tint is None else tint
        small = np.zeros((H // 4, W // 4), np.float32)
        for i in range(len(self.x)):
            x, y = self.x[i] + 15 * np.sin(T * 0.3 + self.ph[i]), (self.y[i] + self.vy[i] * T) % H
            cv2.circle(small, (int(x / 4), int(y / 4)), int(self.r[i] / 4),
                       float(self.a[i] * (0.7 + 0.3 * np.sin(T * 0.8 + self.ph[i]))), -1, cv2.LINE_AA)
        small = cv2.GaussianBlur(small, (0, 0), 1.2)
        f += cv2.resize(small, (W, H))[..., None] * tint * amount


# ---------------------------------------------------------------- mandala ----

def mandala_strokes():
    """The mandala as strokes, each (points, ring group, radius, thickness)."""
    S = []

    def circle(r, g, th=2, c=(0, 0), n=None):
        n = n or max(12, int(r * 0.9))
        a = np.linspace(0, 2 * np.pi, n + 1)
        S.append((np.c_[c[0] + r * np.cos(a), c[1] + r * np.sin(a)], g, np.hypot(*c) + r * 0.2, th))

    def petal(r0, r1, ang, wid, g, th=2):
        u, p = np.array([np.cos(ang), np.sin(ang)]), np.array([-np.sin(ang), np.cos(ang)])
        B, T, L = r0 * u, r1 * u, r1 - r0
        left = mi.bez(B, B + u * L * 0.3 + p * wid, T - u * L * 0.35 + p * wid * 0.6, T)
        right = mi.bez(T, T - u * L * 0.35 - p * wid * 0.6, B + u * L * 0.3 - p * wid, B)
        S.append((np.concatenate([left, right]), g, (r0 + r1) / 2, th))

    circle(46, 0)
    circle(58, 0)
    for k in range(8):
        petal(60, 112, k * np.pi / 4, 18, 1)
        a = (k + 0.5) * np.pi / 4
        circle(4, 1, 2, (120 * np.cos(a), 120 * np.sin(a)), 10)
    circle(130, 2)
    for k in range(16):
        petal(134, 196, k * np.pi / 8, 14, 3)
    for k in range(32):
        a = k * np.pi / 16
        circle(3.5, 4, 2, (208 * np.cos(a), 208 * np.sin(a)), 8)
    circle(220, 5)
    circle(228, 5, 1)
    for k in range(12):
        petal(232, 330, k * np.pi / 6, 34, 6, 3)
        petal(248, 310, k * np.pi / 6, 15, 6)
    for k in range(36):
        a0 = k * 2 * np.pi / 36
        c = 338 * np.array([np.cos(a0), np.sin(a0)])
        arc = np.linspace(a0 - np.pi / 2, a0 + np.pi / 2, 9)
        S.append((np.c_[c[0] + 9 * np.cos(arc), c[1] + 9 * np.sin(arc)], 7, 338, 2))
    for k in range(24):
        a = k * np.pi / 12 + np.pi / 24
        u = np.array([np.cos(a), np.sin(a)])
        S.append((np.array([352 * u, 396 * u]), 8, 374, 2))
        p = np.array([-u[1], u[0]])
        tip = 404 * u
        S.append((np.array([tip - 8 * u, tip + 7 * p, tip + 8 * u, tip - 7 * p, tip - 8 * u]), 8, 404, 2))
    circle(414, 9)
    for k in range(48):
        a = k * np.pi / 24
        circle(2.5, 9, 2, (426 * np.cos(a), 426 * np.sin(a)), 8)
    return S


MANDALA_SPIN = {1: 6, 3: -4, 6: 3, 8: -2.5}       # degrees a second


def mandala_mask(strokes, t, start=1.6, span=2.6, size=900, full=False):
    m = np.zeros((size, size), np.uint8)
    c = size / 2
    for pts, g, r, th in strokes:
        p = 1.0 if full else clip01((t - start - span * r / 430) / 0.6)
        if p <= 0:
            continue
        ang = np.radians(MANDALA_SPIN.get(g, 0) * t)
        R = np.array([[np.cos(ang), -np.sin(ang)], [np.sin(ang), np.cos(ang)]])
        q = pts @ R.T + c
        n = max(2, int(np.ceil(p * len(q))))
        cv2.polylines(m, [np.round(q[:n] * 4).astype(np.int32)], False, 255, th, cv2.LINE_AA, shift=2)
    return m.astype(np.float32) / 255


# ---------------------------------------------------------------- textures ----

def card_back():
    w, h = 760, 520
    rgb = mi.paper(w, h, IVORY, seed=14)
    a = mi.rounded_rect_mask(w, h, 14)
    b = gold(np.clip(mi.border_mask(w, h, 22, 3) + mi.border_mask(w, h, 32, 1), 0, 1), bevel=0.8, depth=2)
    rgb = rgb * (1 - b.a[..., None]) + b.rgb * b.a[..., None]
    lay = Layer(rgb, a)
    for layer, cy in ((gold(text_mask("॥ श्री गणेशाय नमः ॥", DEVA_HEAD, 56)), 92),
                      (mi.flourish(380), 160),
                      (solid(text_mask("आदरणीय मातापिताको आशीर्वादसहित", DEVA, 40, weight=500), MAROON), 240),
                      (solid(text_mask("With the blessings of our families", SERIF, 40, weight=500, italic=True), INK), 300),
                      (gold(text_mask(f"{DETAILS['groom']} & {DETAILS['bride']}", SCRIPT, 80)), 410)):
        mi.put_local(lay, layer, w // 2, cy)
    return lay


EW, EH = 900, 1400
EL, ER, ET, EB = 40, 860, 820, 1380
EAPEX = ET + 300


def env_texture(A, t):
    """The envelope, flap and rising card on a transparent texture."""
    rgb = np.zeros((EH, EW, 3), np.float32)
    a = np.zeros((EH, EW), np.float32)
    w, h = ER - EL, EB - ET
    theta = np.pi * ease(ramp(t, 2.5, 3.4))
    apex = ET + (EAPEX - ET) * np.cos(theta)
    rgb[ET:EB, EL:ER] = A.env_lining
    a[ET:EB, EL:ER] = 1
    flap_pts = np.array([(EL, ET), (ER, ET), (EW // 2, int(apex))], np.int32)
    if np.cos(theta) < 0:
        fm = np.zeros((EH, EW), np.uint8)
        cv2.fillPoly(fm, [flap_pts], 255, cv2.LINE_AA)
        fa = fm.astype(np.float32) / 255
        rgb[:] = rgb * (1 - fa[..., None]) + MAROON * 0.9 * fa[..., None]
        a[:] = np.maximum(a, fa)
        cv2.polylines(rgb, [flap_pts[[0, 2, 1]]], False, tuple(float(c) for c in GOLD), 3, cv2.LINE_AA)
    if t < 4.6:
        rise = ease(ramp(t, 3.4, 4.6))
        cy = ET + 24 + A.card_front.shape[0] / 2 - rise * 400
        blit(rgb, a, A.card_front, EW / 2, cy)
    pocket = np.zeros((EH, EW), np.uint8)
    cv2.fillPoly(pocket, [np.array([(EL, ET), (EW // 2, EAPEX - 30), (ER, ET), (ER, EB), (EL, EB)], np.int32)], 255,
                 cv2.LINE_AA)
    pa = (pocket[ET:EB, EL:ER].astype(np.float32) / 255)[..., None]
    rgb[ET:EB, EL:ER] = rgb[ET:EB, EL:ER] * (1 - pa) + A.env_front * pa
    for p0, p1 in (((EL, EB), (EW // 2, EAPEX - 10)), ((ER, EB), (EW // 2, EAPEX - 10))):
        cv2.line(rgb, p0, p1, tuple(float(c) for c in bgr("#D8C9B0")), 2, cv2.LINE_AA)
    if np.cos(theta) >= 0:
        fm = np.zeros((EH, EW), np.uint8)
        cv2.fillPoly(fm, [flap_pts], 255, cv2.LINE_AA)
        fa = (fm[ET:EB, EL:ER].astype(np.float32) / 255)[..., None]
        rgb[ET:EB, EL:ER] = rgb[ET:EB, EL:ER] * (1 - fa) + A.env_front * (0.96 + 0.04 * np.cos(theta)) * fa
        cv2.polylines(rgb, [flap_pts[[0, 2, 1]]], False, tuple(float(c) for c in bgr("#CDBE9F")), 2, cv2.LINE_AA)
    split = ease(ramp(t, 2.3, 2.7))
    if split < 1:
        sheen = (t - 1.0) / 1.2 if 1.0 < t < 2.3 else None
        if split <= 0:
            blit(rgb, a, A.seal, EW / 2, EAPEX, sheen=sheen)
        else:
            hh, ww = A.seal.shape
            for side in (-1, 1):
                half = np.zeros((hh, ww), np.float32)
                half[:, :ww // 2] = side < 0
                half[:, ww // 2:] = side > 0
                blit(rgb, a, A.seal, EW / 2 + side * 80 * split, EAPEX + 140 * split ** 2,
                     opacity=1 - split ** 2, alpha_mul=half, angle=-side * 30 * split)
    return rgb, a


# -------------------------------------------------------------- the world ----

V = np.array([540.0, 960.0])            # where the camera flies to


def paper_layer(colour, mask, seed, shadow=(8, 12), shadow_alpha=0.38, blur=10):
    """A paper-cut layer: flat colour with a paper grain, its shadow baked in."""
    h, w = mask.shape
    rng = np.random.default_rng(seed)
    grain = cv2.GaussianBlur(rng.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 1.0)
    rgb = colour[None, None] * (1 + 0.03 * grain)[..., None]
    sh = np.zeros_like(mask)
    sh[shadow[1]:, shadow[0]:] = mask[:h - shadow[1], :w - shadow[0]]
    sh = cv2.GaussianBlur(sh, (0, 0), blur) * shadow_alpha
    a = np.maximum(mask, sh * (1 - mask))
    rgb = rgb * mask[..., None] / np.maximum(a, 1e-4)[..., None]
    return np.clip(rgb, 0, 1).astype(np.float32), a.astype(np.float32)


def smooth_ridge(n, base, amp, rough, seed, sigma):
    r = mi.ridge(n, base, amp, rough, seed).astype(np.float32)
    return cv2.GaussianBlur(r[None, :], (0, 0), sigma).ravel()


def stupa(m, cx, base, s, colour=255):
    """A Nepali stupa in silhouette: plinth, dome, harmika, the thirteen steps."""
    cv2.rectangle(m, (int(cx - 1.1 * s), int(base - 0.12 * s)), (int(cx + 1.1 * s), int(base)), colour, -1)
    cv2.ellipse(m, (int(cx), int(base - 0.12 * s)), (int(0.95 * s), int(0.72 * s)), 0, 180, 360, colour, -1, cv2.LINE_AA)
    top = base - 0.12 * s - 0.72 * s
    cv2.rectangle(m, (int(cx - 0.22 * s), int(top - 0.3 * s)), (int(cx + 0.22 * s), int(top + 2)), colour, -1)
    spire = np.array([(cx - 0.2 * s, top - 0.3 * s), (cx + 0.2 * s, top - 0.3 * s), (cx + 0.05 * s, top - 1.15 * s),
                      (cx - 0.05 * s, top - 1.15 * s)], np.int32)
    cv2.fillPoly(m, [spire], colour, cv2.LINE_AA)
    cv2.ellipse(m, (int(cx), int(top - 1.18 * s)), (int(0.16 * s), int(0.06 * s)), 0, 0, 360, colour, -1, cv2.LINE_AA)
    cv2.line(m, (int(cx), int(top - 1.2 * s)), (int(cx), int(top - 1.4 * s)), colour, max(2, int(0.03 * s)), cv2.LINE_AA)
    return (cx, top - 1.4 * s), (cx, top - 0.15 * s)       # spire tip, the eyes


class World:
    """The paper-cut landscape, its layers at their depths (cam = 0 is the
    view through the card's arch window, every layer at scale 1)."""

    def __init__(self, A):
        self.layers = []
        # Far: the Himalaya, rock and snow cut separately.
        far = smooth_ridge(W, 980, 300, 0.5, 11, 5)
        m = (YY >= far[None, :]).astype(np.float32)
        snow_line = 860
        depth = YY - far[None, :]
        sd = np.clip((snow_line - far) * 0.55, 0, None)
        jag = cv2.GaussianBlur(np.random.default_rng(2).normal(0, 1, (H, W)).astype(np.float32), (0, 0), 3) * 9
        snow = ((depth < sd[None, :] + jag) & (m > 0)).astype(np.float32)
        rock_rgb, rock_a = paper_layer(bgr("#A29CC7"), m, 21, blur=6, shadow_alpha=0.2)
        snow_rgb = mi.paper(W, H, bgr("#FBF1EC"), seed=22)
        rock_rgb = rock_rgb * (1 - snow[..., None]) + snow_rgb * snow[..., None]
        self.layers.append(dict(z=6.0, rgb=rock_rgb, a=rock_a))
        # Mid hills with a mist band.
        mid = smooth_ridge(W, 1200, 140, 0.45, 23, 8)
        m = (YY >= mid[None, :]).astype(np.float32)
        rgb, a = paper_layer(bgr("#625E8E"), m, 24)
        mist = np.exp(-((YY - mid[None, :] - 30) / 40) ** 2)[..., None]
        rgb = rgb * (1 - 0.25 * mist) + bgr("#E9D8E6") * 0.25 * mist
        self.layers.append(dict(z=3.5, rgb=rgb, a=a))
        # Near: plum hills, a stupa, a pagoda, trees.
        near = smooth_ridge(W, 1430, 90, 0.45, 31, 6)
        mm = np.zeros((H, W), np.uint8)
        mm[YY >= near[None, :]] = 255
        self.spire, eyes = stupa(mm, 300, near[300] + 10, 92)
        mi.pagoda(mm, 790, int(near[790]) + 8, 210, 255)
        for tx in (80, 160, 470, 560, 640, 980, 1040):
            ty = int(near[tx])
            cv2.fillPoly(mm, [np.array([(tx - 16, ty + 4), (tx, ty - 58), (tx + 16, ty + 4)], np.int32)], 255,
                         cv2.LINE_AA)
        rgb, a = paper_layer(bgr("#3A2A4C"), mm.astype(np.float32) / 255, 32)
        ex, ey = int(eyes[0]), int(eyes[1])
        for dx in (-10, 10):                                       # the stupa's eyes, in gold
            cv2.ellipse(rgb, (ex + dx, ey), (7, 3), 0, 0, 180, tuple(float(c) for c in GOLD), 2, cv2.LINE_AA)
        self.layers.append(dict(z=2.2, rgb=rgb, a=a))
        self.near_ridge = near
        # Prayer flags: from the stupa's spire down both sides.
        self.flags = [(self.spire, (40, near[40] - 30), 60), (self.spire, (560, near[560] - 60), 80)]
        # The arch, just inside the card's window.
        aw, ah = 680, 1110
        opening, frame, line = mi.arch_masks(aw, ah, band=28)
        g = gold(frame, bevel=2.5, depth=9)
        lg = gold(line.astype(np.float32), bevel=0.8, depth=2)
        rgb = np.zeros((H, W, 3), np.float32)
        a = np.zeros((H, W), np.float32)
        blit(rgb, a, g, 540, 365 + ah / 2)
        blit(rgb, a, lg, 540, 365 + ah / 2, opacity=0.8)
        self.layers.append(dict(z=1.3, rgb=rgb, a=a))
        # The invitation card with its arch window, and the garlands.
        cw, chh = 740, 1170
        win_open, _, _ = mi.arch_masks(cw, chh, band=0)
        win = np.zeros((H, W), np.float32)
        x0, y0 = 540 - cw // 2, 330
        win[y0:y0 + chh, x0:x0 + cw] = win_open
        card = mi.paper(W, H, IVORY, seed=40)
        cm = 1 - win
        rim = np.clip(cv2.dilate(win, np.ones((19, 19), np.uint8)) - win, 0, 1)
        gr = gold(rim, bevel=1.5, depth=5)
        card = card * (1 - gr.a[..., None]) + gr.rgb * gr.a[..., None]
        b = gold(np.clip(mi.border_mask(W, H, 30, 3) + mi.border_mask(W, H, 44, 1), 0, 1), bevel=0.8, depth=2)
        card = card * (1 - b.a[..., None]) + b.rgb * b.a[..., None]
        sh = np.zeros_like(cm)
        sh[14:, 8:] = cm[:-14, :-8]
        sh = cv2.GaussianBlur(sh, (0, 0), 14) * 0.45
        a = np.maximum(cm, sh * (1 - cm))
        rgb = card * (cm / np.maximum(a, 1e-4))[..., None]
        blit(rgb, a, A.garland, W / 2, A.garland.shape[0] / 2)
        blit(rgb, a, gold(text_mask("शुभ विवाह", DEVA_HEAD, 96), bevel=1.6, depth=6), W / 2, 1625)
        blit(rgb, a, solid(text_mask("YOU ARE INVITED", CAPS, 34, weight=600, tracking=9), INK), W / 2, 1735)
        blit(rgb, a, A.flourish_small, W / 2, 1810)
        self.layers.append(dict(z=1.0, rgb=rgb, a=a))
        self.cache = None

    @staticmethod
    def scale(z, cam):
        return z / max(z - cam, 1e-3)

    def draw(self, f, cam, night, T, dy=0.0):
        tint = np.array([1, 1, 1], np.float32) * (1 - night) + bgr("#5A5E8E") * 0.75 * night
        for L in self.layers:                     # far to near
            s = self.scale(L["z"], cam)
            if s > 6:
                continue
            fade = 1 - clip01((s - 2.6) / 1.6) if L["z"] < 1.5 else 1.0
            if fade <= 0:
                continue
            M = np.array([[s, 0, V[0] * (1 - s)], [0, s, V[1] * (1 - s) + dy]], np.float32)
            rgb = cv2.warpAffine(L["rgb"], M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            a = cv2.warpAffine(L["a"], M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
            a = a[..., None] * fade
            col = rgb * (tint if L["z"] > 1.5 else 1.0)
            f *= 1 - a
            f += col * a
            if L["z"] == 2.2:
                self.draw_flags(f, s, night, T, dy)

    def draw_flags(self, f, s, night, T, dy):
        cols = [bgr("#2E6BC9"), bgr("#F4F1EA"), bgr("#C8323A"), bgr("#3E9A4E"), bgr("#F2C230")]
        dark = 1 - 0.65 * night
        for (p0, p1, n) in self.flags:
            p0, p1 = np.array(p0, np.float32), np.array(p1, np.float32)
            for i in range(n):
                u = (i + 0.5) / n
                pt = p0 + (p1 - p0) * u + np.array([0, 30 * 4 * u * (1 - u)])
                pt2 = p0 + (p1 - p0) * (u + 0.7 / n) + np.array([0, 30 * 4 * u * (1 - u)])
                flut = 3 * np.sin(T * 7 + i * 0.9)
                tip = (pt + pt2) / 2 + np.array([flut, 14])
                tri = np.array([pt, pt2, tip])
                tri = V + (tri - V) * s + np.array([0, dy])
                cv2.fillPoly(f, [np.round(tri * 4).astype(np.int32)], tuple(float(c * dark) for c in cols[i % 5]),
                             cv2.LINE_AA, shift=2)
            line = np.array([p0, p1])
            line = V + (line - V) * s + np.array([0, dy])
            cv2.line(f, tuple(np.round(line[0]).astype(int)), tuple(np.round(line[1]).astype(int)),
                     (0.15, 0.12, 0.12), 1, cv2.LINE_AA)


class Sky:
    def __init__(self):
        yy, xx = np.mgrid[0:HH, 0:HW].astype(np.float32)
        self.v = yy / HH
        self.yy, self.xx = yy, xx
        self.sun = np.array([270.0, 440.0])
        self.ang = np.arctan2(yy - self.sun[1], xx - self.sun[0])
        self.dist = np.hypot(yy - self.sun[1], xx - self.sun[0])
        prof = np.random.default_rng(6).random(720).astype(np.float32)
        self.prof = cv2.GaussianBlur(prof[None, :], (0, 0), 3).ravel()
        self.prof = (self.prof - self.prof.min()) / np.ptp(self.prof)
        rng = np.random.default_rng(7)
        n = 520
        self.sx, self.sy = rng.uniform(0, W, n), rng.uniform(0, H * 0.75, n) ** 1.0
        self.sb = rng.uniform(0.15, 1.0, n) ** 2
        self.sp = rng.uniform(0, 6.3, n)
        self.sf = rng.uniform(1, 3, n)

    def palette(self, night):
        day = [bgr("#8DAEDB"), bgr("#F4D3C6"), bgr("#F9C383")]
        dusk = [bgr("#2E2F6B"), bgr("#B0577A"), bgr("#F08A5D")]
        nite = [bgr("#060A1E"), bgr("#121A3E"), bgr("#2A2350")]
        if night < 0.5:
            k = night * 2
            return [d + (u - d) * k for d, u in zip(day, dusk)]
        k = night * 2 - 1
        return [d + (u - d) * k for d, u in zip(dusk, nite)]

    def draw(self, f, T, night, stars_dy=0.0):
        top, mid, low = self.palette(night)
        v = self.v[..., None]
        sky = np.where(v < 0.32, top + (mid - top) * (v / 0.32), mid + (low - mid) * clip01((v - 0.32) / 0.25))
        day = 1 - clip01(night * 1.6)
        sun_y = self.sun[1] + 120 * night
        d = np.hypot(self.yy - sun_y, self.xx - self.sun[0])
        sky = sky + (np.exp(-(d / 110) ** 2) * 0.22 * (1 - night))[..., None] * bgr("#FFE6B0")
        sky = np.where((d < 26)[..., None], sky * (1 - day) + bgr("#FFF4D8") * day, sky)
        if day > 0:                                   # turning sun rays
            idx = ((self.ang + T * 0.05) / (2 * np.pi) * 720).astype(int) % 720
            rays = self.prof[idx] ** 3 * np.exp(-self.dist / 420) * (self.dist > 24)
            sky = sky + (rays * 0.10 * day)[..., None] * bgr("#FFEBC0")
        out = cv2.resize(sky.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
        f[:] = out
        st = clip01((night - 0.45) / 0.4)
        if st > 0:
            b = self.sb * (0.6 + 0.4 * np.sin(T * self.sf + self.sp)) * st
            glow_points(f, self.sx, self.sy + stars_dy, b, bgr("#FFF6E8"), core=0.6, halo=1.6, gain=0.35)
            mx, my = 915, 165 + stars_dy
            moon = clip01(st * 1.4) * (1 - clip01(stars_dy / 160))     # sets as the camera tilts up
            dd = np.hypot(XX - mx, YY - my)
            f += (np.exp(-(dd / 160) ** 2) * 0.18 * moon)[..., None] * bgr("#DDE6FF")
            disc = clip01(34 - dd) * clip01(np.hypot(XX - mx - 15, YY - my + 8) - 32)
            f[:] = f * (1 - disc[..., None] * moon) + bgr("#FFF8E6") * disc[..., None] * moon


class Lanterns:
    def __init__(self, n=54, seed=12):
        rng = np.random.default_rng(seed)
        self.d = np.sort(rng.uniform(0.2, 1.0, n))
        self.x = rng.uniform(40, W - 40, n)
        self.t0 = rng.uniform(0, 7, n)
        self.ph = rng.uniform(0, 6.3, n)

    def draw(self, f, t, amount=1.0, dy=0.0):
        if amount <= 0:
            return
        acc_x, acc_y, acc_b = [], [], []
        for i in range(len(self.d)):
            d = self.d[i]
            age = t - self.t0[i]
            if age < 0:
                continue
            s = 10 + 46 * d * d
            y = H + 60 - (50 + 150 * d) * age + dy
            if y < -80:
                continue
            x = self.x[i] + (12 + 26 * d) * np.sin(age * 0.8 + self.ph[i])
            flick = 0.85 + 0.15 * np.sin(t * 9 + self.ph[i] * 3)
            body = np.array([(x - s * 0.55, y - s * 0.65), (x + s * 0.55, y - s * 0.65), (x + s * 0.42, y + s * 0.6),
                             (x - s * 0.42, y + s * 0.6)])
            col = bgr("#FF8A30") * flick * amount
            cv2.fillPoly(f, [np.round(body * 4).astype(np.int32)], tuple(float(c) for c in col), cv2.LINE_AA, shift=2)
            cv2.ellipse(f, (int(x), int(y + s * 0.3)), (max(1, int(s * 0.32)), max(1, int(s * 0.25))), 0, 0, 360,
                        tuple(float(c) for c in bgr("#FFE6A8") * amount), -1, cv2.LINE_AA)
            acc_x.append(x)
            acc_y.append(y)
            acc_b.append((0.4 + 0.9 * d) * flick * amount)
        glow_points(f, np.array(acc_x), np.array(acc_y), np.array(acc_b), bgr("#FFB060"), core=3, halo=12, gain=0.6)


def draw_birds(f, T, t0, t1, night=0.0):
    if not (t0 <= T <= t1):
        return
    u = (T - t0) / (t1 - t0)
    col = tuple(float(c) for c in bgr("#3A2E4A") * (1 - 0.5 * night))
    for i in range(9):
        off = np.array([(i % 3) * 38 + (i // 3) * 22, (i // 3) * 26 - (i % 3) * 12])
        x = -120 + (W + 240) * u - off[0]
        y = 520 + 40 * np.sin(u * 3 + i) + off[1]
        s = 12 - (i % 4)
        wing = np.sin(T * 9 + i * 1.3)
        pts = np.array([(x - s, y - s * 0.6 * wing), (x - s * 0.4, y - s * 0.2 * wing), (x, y + 2),
                        (x + s * 0.4, y - s * 0.2 * wing), (x + s, y - s * 0.6 * wing)])
        cv2.polylines(f, [np.round(pts * 4).astype(np.int32)], False, col, 2, cv2.LINE_AA, shift=2)


# --------------------------------------------------------------- sparkler ----

class Sparkler:
    """A glowing point that writes a script word, shedding glitter."""

    def __init__(self, layer, cx, cy, t0, t1, seed, rate=170):
        self.layer, self.cx, self.cy, self.t0, self.t1 = layer, cx, cy, t0, t1
        a = layer.a
        h, w = a.shape
        ys = np.arange(h, dtype=np.float32)[:, None]
        wsum = a.sum(0) + 1e-6
        cent = (a * ys).sum(0) / wsum
        ink = a.sum(0) > 0.5
        xs = np.arange(w)
        cent = np.interp(xs, xs[ink], cent[ink]) if ink.any() else np.full(w, h / 2)
        self.cent = cv2.GaussianBlur(cent.astype(np.float32)[None, :], (0, 0), 6).ravel()
        rng = np.random.default_rng(seed)
        n = int((t1 - t0) * rate)
        te = np.sort(rng.uniform(t0, t1, n))
        hx, hy = self.head(te)
        ang = rng.uniform(0, 2 * np.pi, n)
        sp = rng.uniform(60, 300, n)
        self.p = Particles(te, hx, hy, np.cos(ang) * sp, np.sin(ang) * sp - 60, rng.uniform(0.4, 1.1, n), k=2.0,
                           g=420)

    def progress(self, T):
        return ease(ramp(T, self.t0, self.t1))

    def head(self, T):
        h, w = self.layer.shape
        p = np.asarray([self.progress(t) for t in np.atleast_1d(T)])
        x = p * (w - 1)
        y = np.interp(x, np.arange(w), self.cent)
        return self.cx - w / 2 + x, self.cy - h / 2 + y

    def draw(self, f, T, shadow=True):
        p = self.progress(T)
        if p <= 0:
            return
        mask = reveal(self.layer, p, soft=24)
        if shadow:
            sh = Layer(np.zeros(self.layer.rgb.shape, np.float32), cv2.GaussianBlur(self.layer.a * mask, (0, 0), 6))
            put(f, sh, self.cx + 4, self.cy + 7, opacity=0.55)
        put(f, self.layer, self.cx, self.cy, alpha_mul=mask)
        x, y, fade, _ = self.p.at(T)
        glow_points(f, x, y, fade * 0.8, bgr("#FFD98A"), core=0.7, halo=2.5, gain=0.5)
        if self.t0 <= T <= self.t1 + 0.1:
            hx, hy = self.head(T)
            glow_points(f, hx, hy, [3.0], bgr("#FFF2C8"), core=1.5, halo=7, gain=0.9)
            for ang in (0, np.pi / 2):                            # a little star flare at the head
                d = np.array([np.cos(ang), np.sin(ang)]) * 26
                p0 = (int(hx[0] - d[0]), int(hy[0] - d[1]))
                p1 = (int(hx[0] + d[0]), int(hy[0] + d[1]))
                cv2.line(f, p0, p1, tuple(float(c) for c in bgr("#FFF4D6")), 1, cv2.LINE_AA)


# ------------------------------------------------------------------ assets ----

class Assets:
    def __init__(self):
        self.velvet = velvet()
        self.bokeh = Bokeh()
        self.strokes = mandala_strokes()
        self.mono = gold(text_mask("M&S", DECO, 54), bevel=1.0, depth=4)
        self.seal = mi.wax_seal()
        self.env_front, self.env_lining = mi.envelope_parts()
        self.card_front = mi.card_layer()
        self.card_back = card_back()
        self.garland = mi.garland_layer()
        self.flourish = mi.flourish(560)
        self.flourish_small = mi.flourish(380)
        self.world = World(self)
        self.sky = Sky()
        self.lanterns = Lanterns()
        self.couple = mi.couple_layer(1.15)
        T = {}
        T["shubh"] = gold(text_mask("शुभ विवाह", DEVA_HEAD, 120), bevel=1.8, depth=7)
        T["names"] = gold(text_mask(f"{DETAILS['groom']} & {DETAILS['bride']}", SCRIPT, 110), bevel=1.4, depth=5)
        T["groom"] = gold(text_mask(DETAILS["groom"], SCRIPT, 200), bevel=1.8, depth=7, base=LIGHT_GOLD)
        T["amp"] = gold(text_mask("&", SCRIPT, 130), base=LIGHT_GOLD)
        T["bride"] = gold(text_mask(DETAILS["bride"], SCRIPT, 200), bevel=1.8, depth=7, base=LIGHT_GOLD)
        T["names_ne"] = gold(text_mask(f"{DETAILS['groom_ne']}  र  {DETAILS['bride_ne']}", DEVA_HEAD, 76),
                             base=LIGHT_GOLD)
        cream = bgr("#F7EBD0")
        T["together"] = solid(text_mask("TOGETHER WITH THEIR FAMILIES", CAPS, 34, weight=600, tracking=6), cream)
        T["couple"] = gold(text_mask(f"{DETAILS['groom']} & {DETAILS['bride']}", SCRIPT, 120), base=LIGHT_GOLD)
        for k, line in enumerate(("joyfully invite you to celebrate", "the beginning of their beautiful journey")):
            T[f"inv{k}"] = solid(text_mask(line, SERIF, 56, weight=500, italic=True), cream)
        T["inv_ne0"] = solid(text_mask("हाम्रो नयाँ जीवनको शुभ सुरुवातमा", DEVA, 46, weight=500), bgr("#FFD9A0"))
        T["inv_ne1"] = solid(text_mask("तपाईंको उपस्थितिको हार्दिक अपेक्षा गर्दछौं", DEVA, 46, weight=500), bgr("#FFD9A0"))
        T["prog_ne"] = gold(text_mask("शुभ कार्यक्रम", DEVA_HEAD, 110), bevel=1.8, depth=7, base=LIGHT_GOLD)
        T["prog_en"] = solid(text_mask("THE CELEBRATIONS", CAPS, 36, weight=600, tracking=8), cream)
        T["std"] = gold(text_mask("Save the Date", DECO, 92), bevel=1.6, depth=6, base=LIGHT_GOLD)
        T["date"] = solid(text_mask(DETAILS["save_the_date"] or "Date & venue to follow", SERIF, 52, weight=600), cream)
        T["joy"] = solid(text_mask("With joyful hearts, we welcome you to our forever", SERIF, 44, weight=500,
                                   italic=True), cream)
        T["weds"] = gold(text_mask(f"{DETAILS['groom']}  weds  {DETAILS['bride']}", SCRIPT, 116), bevel=1.6, depth=6,
                         base=LIGHT_GOLD)
        T["shubh_small"] = gold(text_mask("शुभ विवाह", DEVA_HEAD, 84), base=LIGHT_GOLD)
        self.T = T
        self.events = [mi.Assets.event_card(None, i, *e) for i, e in enumerate(DETAILS["events"])]
        rng = np.random.default_rng(31)
        self.spark_in = Particles(np.linspace(0.55, 1.4, 120), *self.spark_path(np.linspace(0.55, 1.4, 120)),
                                  rng.uniform(-40, 40, 120), rng.uniform(-60, 20, 120), rng.uniform(0.3, 0.8, 120),
                                  k=2.5, g=300)
        self.sparklers = [Sparkler(T["groom"], 430, 1170, 19.9, 21.3, 1), Sparkler(T["bride"], 640, 1410, 21.4, 22.9, 2)]
        self.heart = self.heart_particles()

    @staticmethod
    def spark_path(t):
        u = clip01((np.asarray(t) - 0.6) / 0.8)
        x = 760 - 140 * u + 40 * np.sin(u * 3)
        y = -40 + (1420 + 40) * u ** 1.3
        return x, y

    def heart_particles(self, n=190, seed=5):
        rng = np.random.default_rng(seed)
        t = np.linspace(0, 2 * np.pi, n, endpoint=False)
        hx = 16 * np.sin(t) ** 3
        hy = -(13 * np.cos(t) - 5 * np.cos(2 * t) - 2 * np.cos(3 * t) - np.cos(4 * t))
        tx, ty = 540 + hx * 10, 520 + hy * 10
        sx, sy = rng.uniform(-100, W + 100, n), rng.uniform(200, H + 100, n)
        delay = rng.uniform(0, 0.8, n)
        return dict(tx=tx, ty=ty, sx=sx, sy=sy, delay=delay, ph=rng.uniform(0, 6.3, n))


# ------------------------------------------------------------------ scenes ----

def scene_a(A, t, T):
    f = A.velvet.copy()
    f *= 0.3 + 0.3 * ease(ramp(t, 0.0, 1.4)) + 0.45 * ease(ramp(t, 1.3, 2.6))
    A.bokeh.draw(f, T, amount=0.6 * ease(ramp(t, 0.3, 2.0)))
    # The light of the diya filling the room.
    lit = ease(ramp(t, 1.35, 1.8))
    wick = np.array([600.0, 1420.0])
    if lit > 0:
        R = 200 + 900 * ease_out(ramp(t, 1.35, 3.5))
        d = np.hypot(XX - wick[0], YY - wick[1])
        f += (np.exp(-(d / R) ** 2) * 0.35 * lit)[..., None] * bgr("#FFB868")
    # The mandala drawing itself.
    m = mandala_mask(A.strokes, t)
    if m.max() > 0:
        g = gold(m, bevel=1.0, depth=3.5)
        put(f, g, 540, 800, sheen=((t - 3.0) / 2.0))
    put(f, A.mono, 540, 800, opacity=ease(ramp(t, 3.4, 4.2)), sheen=(t - 4.2) / 1.2)
    mi.diya(f, 480, 1420, T, scale=1.2, opacity=ease(ramp(t, 0.2, 1.0)), lit=lit)
    # The falling spark that lights it.
    if 0.55 <= t <= 1.45:
        x, y, fade, _ = A.spark_in.at(t)
        glow_points(f, x, y, fade * 0.6, bgr("#FFD98A"), core=0.8, halo=2.5, gain=0.6)
        hx, hy = A.spark_path(t)
        glow_points(f, [hx], [hy], [3.0], bgr("#FFF2C8"), core=1.6, halo=8, gain=1.0)
    a = ease(ramp(t, 4.2, 5.0))
    put(f, A.T["shubh"], 540, 1640 + 20 * (1 - a), opacity=a, sheen=(t - 4.8) / 1.4)
    a = ease(ramp(t, 4.7, 5.5))
    put(f, A.T["names"], 540, 1790 + 20 * (1 - a), opacity=a)
    zoom = 1 + 4 * ease(ramp(t, 6.0, 7.0)) ** 2
    out = mi.camera(f, zoom, 540, 800)
    flash = ease(ramp(t, 6.4, 7.0))
    return out * (1 - flash) + bgr("#FFF3DC") * flash


def scene_b(A, t, T):
    f = A.velvet.copy() * 1.15
    A.bokeh.draw(f, T, amount=0.7)
    # The envelope's flight.
    cy = 2500 - 1740 * ease_out(ramp(t, 0.0, 1.3)) + 1800 * ease(ramp(t, 4.9, 5.9))
    rx = np.radians(58 * (1 - ease_out(ramp(t, 0.0, 1.5))) + 3 * np.sin(t * 1.3))
    ry = np.radians(10 * np.sin(t * 0.9) * (1 - ramp(t, 1.4, 2.6)))
    if t < 6.0:
        rgb, a = env_texture(A, t)
        dst = project(quad(EW, EH), 540, cy, 1.0, rx, ry)
        warp_put(f, rgb, a, dst, opacity=1 - ease(ramp(t, 5.0, 5.8)))
    # The seal's burst.
    seal_xy = project(np.array([[0, EAPEX - EH / 2]], np.float32), 540, cy, 1.0, rx, ry)[0]
    if t >= 2.3:
        if not hasattr(A, "petal_burst"):
            rng = np.random.default_rng(17)
            A.petal_burst = PetalBurst(2.3, seal_xy[0], seal_xy[1], 70, rng)
            A.spark_burst = burst(2.3, seal_xy[0], seal_xy[1], 300, (200, 1200), rng, up=0.25, life=(0.5, 1.4),
                                  k=2.0, g=500)
        x, y, fade, _ = A.spark_burst.at(t)
        glow_points(f, x, y, fade * 0.9, bgr("#FFD98A"), core=0.8, halo=3, gain=0.6)
        A.petal_burst.draw(f, t)
        flash = np.exp(-((t - 2.35) / 0.12) ** 2)
        glow_points(f, [seal_xy[0]], [seal_xy[1]], [12 * flash], bgr("#FFE9B8"), core=6, halo=30, gain=0.8)
    # The card flies out and turns over.
    if t >= 4.6:
        start = project(np.array([[0, ET + 24 + 260 - 400 - EH / 2]], np.float32), 540, cy, 1.0, rx, ry)[0]
        u = ease(ramp(t, 4.6, 6.0))
        cx = start[0] + (540 - start[0]) * u
        ccy = start[1] + (930 - start[1]) * u + 18 * np.sin(t * 1.4) * ramp(t, 6.0, 7.0)
        sc = 1.0 + 0.36 * u
        ry_c = np.pi * ease(ramp(t, 5.0, 6.1))
        rx_c = rx * (1 - u) + np.radians(4 * np.sin(t * 1.1))
        dst = project(quad(760, 520), cx, ccy, sc, rx_c, ry_c, f=1600)
        back = np.cos(ry_c) < 0
        lay = A.card_back if back else A.card_front
        shade = 0.72 + 0.28 * abs(np.cos(ry_c))
        warp_put(f, lay.rgb, lay.a, dst, shade=shade, flip=back)
        if back:
            A.bokeh.draw(f, T + 3, amount=0.2)
    flash = 1 - ease(ramp(t, 0.0, 0.5))
    return f * (1 - flash) + bgr("#FFF3DC") * flash


def world_cam(T):
    return 1.22 * ease(ramp(T, 14.8, 19.6))


def night_of(T):
    return ease(ramp(T, 23.0, 25.8))


def scene_world(A, t, T):
    """From the card's arch window to the end: one continuous camera."""
    f = np.zeros((H, W, 3), np.float32)
    night = night_of(T)
    tilt = 1150 * ease(ramp(T, 43.4, 45.4))                 # the camera looks up at the end
    A.sky.draw(f, T, night, stars_dy=tilt * 0.25)
    A.world.draw(f, world_cam(T), night, T, dy=tilt)
    draw_birds(f, T, 17.0, 23.5, night)
    # Names, written by a sparkler.
    names_out = 1 - ease(ramp(T, 23.2, 24.0))
    if T < 24.1:
        tmp = f.copy()
        for s in A.sparklers:
            s.draw(tmp, T)
        a = ease(ramp(T, 22.8, 23.5))
        put(tmp, A.T["amp"], 540, 1290, opacity=ease(ramp(T, 21.2, 21.7)))
        put(tmp, A.T["names_ne"], 540, 1600 + 20 * (1 - a), opacity=a)
        f[:] = f * (1 - names_out) + tmp * names_out
    # Lanterns rise from the valley at dusk.
    A.lanterns.draw(f, T - 23.6, amount=clip01((night - 0.3) / 0.4) * (1 - 0.5 * ramp(T, 43.4, 45.0)), dy=tilt * 0.6)
    # The invitation among the stars.
    if 24.5 <= T <= 31.0:
        out = 1 - ease(ramp(T, 29.6, 30.3))
        items = [("together", 360), ("couple", 500), ("inv0", 640), ("inv1", 715), ("inv_ne0", 830), ("inv_ne1", 905)]
        for k, (key, y) in enumerate(items):
            a = ease(ramp(T, 25.0 + 0.45 * k, 25.8 + 0.45 * k)) * out
            put(f, A.T[key], 540, y + 20 * (1 - a), opacity=a, sheen=(T - 27.0) / 1.5 if key == "couple" else None)
        put(f, A.flourish, 540, 1000, opacity=ease(ramp(T, 27.4, 28.2)) * out)
    # The programme on a turning prism.
    if 29.8 <= T <= 37.4:
        prism(f, A, T - 29.8)
    # Save the date: the hill, the couple, the heart.
    if T >= 37.3:
        couple_scene(f, A, T - 37.3, tilt)
    # The constellation and the close.
    if T >= 43.6:
        close(f, A, T - 43.6)
    return f


def prism(f, A, t):
    a_in = ease(ramp(t, 0.0, 0.8)) * (1 - ease(ramp(t, 7.0, 7.5)))
    put(f, A.T["prog_ne"], 540, 250 + 20 * (1 - a_in), opacity=a_in)
    put(f, A.T["prog_en"], 540, 350, opacity=a_in)
    put(f, A.flourish_small, 540, 420, opacity=a_in)
    steps = [(0.0, 1.8), (2.4, 3.6), (4.2, 5.4), (6.0, 7.2)]
    rot_deg = 0.0
    for i in range(1, 4):
        rot_deg += 90 * ease(ramp(t, steps[i - 1][1], steps[i][0]))
    cw, ch = 900, 300
    R = ch / 2
    cy, f_len = 1000, 1700
    faces = []
    for i, card in enumerate(A.events):
        alpha = np.radians(rot_deg - 90 * i)
        if np.cos(alpha) <= 0.02:
            continue
        P = np.array([[-cw / 2, -ch / 2, -R], [cw / 2, -ch / 2, -R], [cw / 2, ch / 2, -R], [-cw / 2, ch / 2, -R]])
        Y = P[:, 1] * np.cos(alpha) - P[:, 2] * np.sin(alpha)
        Z = P[:, 1] * np.sin(alpha) + P[:, 2] * np.cos(alpha) + R
        sx = 540 + f_len * P[:, 0] / (f_len + Z)
        sy = cy + f_len * Y / (f_len + Z)
        faces.append((Z.mean(), np.stack([sx, sy], 1).astype(np.float32), card, np.cos(alpha)))
    for _, dst, card, c in sorted(faces, key=lambda q: -q[0]):
        warp_put(f, card.rgb, card.a, dst, opacity=a_in, shade=0.45 + 0.55 * c)
    # Which one is showing.
    for i in range(4):
        on = abs(((rot_deg / 90) % 4) - i) < 0.5
        cv2.circle(f, (540 - 75 + 50 * i, 1240), 9 if on else 6,
                   tuple(float(c * a_in) for c in (GOLD_LIGHT if on else bgr("#8A7A9A"))), -1, cv2.LINE_AA)
    glow_points(f, [540], [cy], [6 * a_in], bgr("#FFD9A0"), core=40, halo=90, gain=0.25)


def couple_scene(f, A, t, tilt):
    rise = ease_out(ramp(t, 0.0, 1.2))
    hill_top = 1660 + 520 * (1 - rise) + tilt
    m = (YY >= hill_top + 40 * np.cos((XX - 540) / 700 * np.pi)).astype(np.float32)
    a = m[..., None]
    f[:] = f * (1 - a) + bgr("#1A1426") * a
    ch, cw = A.couple.shape
    put(f, A.couple, 540, hill_top - ch / 2 + 36, opacity=rise)
    # Fireflies gather into a heart.
    if tilt < 900:
        hp = A.heart
        u = np.clip((t - 0.9 - hp["delay"]) / 1.7, 0, 1)
        e = u * u * (3 - 2 * u)
        swirl = np.sin(np.pi * e) * 120
        ang = np.arctan2(hp["ty"] - hp["sy"], hp["tx"] - hp["sx"]) + np.pi / 2
        x = hp["sx"] + (hp["tx"] - hp["sx"]) * e + np.cos(ang) * swirl
        y = hp["sy"] + (hp["ty"] - hp["sy"]) * e + np.sin(ang) * swirl - tilt * 0.4
        b = (0.5 + 0.5 * np.sin(t * 5 + hp["ph"])) * 0.6 + 0.6 * e
        glow_points(f, x, y, b * ramp(t, 0.6, 1.2), bgr("#FFD0A0"), core=1.0, halo=4, gain=0.6)
        formed = ease(ramp(t, 2.8, 3.4))
        glow_points(f, [540], [470 - tilt * 0.4], [10 * formed], bgr("#FF9AA0"), core=30, halo=70, gain=0.3)
    out = 1 - ease(ramp(t, 6.6, 7.2))
    for key, y, t0 in (("std", 850, 3.0), ("date", 950, 3.5), ("joy", 1030, 3.9)):
        a = ease(ramp(t, t0, t0 + 0.8)) * out
        put(f, A.T[key], 540, y + 20 * (1 - a) - tilt * 0.4, opacity=a, sheen=(t - 3.8) / 1.6 if key == "std" else None)


CONST = {
    "M": [(-300, 120), (-270, -110), (-205, 40), (-140, -110), (-110, 120)],
    "heart": [(0, 120), (-70, 40), (-82, -30), (-45, -75), (0, -40), (45, -75), (82, -30), (70, 40), (0, 120)],
    "S": [(270, -100), (190, -110), (140, -55), (190, 5), (260, 30), (290, 85), (240, 125), (150, 110)],
}


def close(f, A, t):
    c = np.array([540.0, 660.0])
    m = mandala_mask(A.strokes, 10 + t, full=True)
    g = gold(m, bevel=1.0, depth=3.5, base=LIGHT_GOLD)
    put(f, g, c[0], c[1], opacity=0.22 * ease(ramp(t, 0.8, 2.0)))
    k = 0
    for name, pts in CONST.items():
        pts = np.array(pts, np.float32) + c
        for i in range(len(pts)):
            appear = ease(ramp(t, 0.6 + 0.05 * k, 1.0 + 0.05 * k))
            glow_points(f, [pts[i, 0]], [pts[i, 1]], [2.5 * appear * (0.8 + 0.2 * np.sin(t * 4 + k))],
                        bgr("#FFF4DC"), core=1.2, halo=5, gain=0.9)
            if i > 0:
                p = clip01((t - 1.2 - 0.07 * k) / 0.25)
                if p > 0:
                    a, b = pts[i - 1], pts[i - 1] + (pts[i] - pts[i - 1]) * p
                    cv2.line(f, tuple(np.round(a).astype(int)), tuple(np.round(b).astype(int)),
                             tuple(float(v) for v in bgr("#F6DFA8") * 0.8), 2, cv2.LINE_AA)
            k += 1
    a = ease(ramp(t, 2.2, 3.2))
    put(f, A.T["weds"], 540, 1060, alpha_mul=reveal(A.T["weds"], a))
    put(f, A.flourish, 540, 1190, opacity=ease(ramp(t, 2.8, 3.5)))
    put(f, A.T["shubh_small"], 540, 1300, opacity=ease(ramp(t, 3.1, 3.8)), sheen=(t - 3.8) / 1.2)
    fade = ease(ramp(t, 4.4, 5.4))
    f *= 1 - fade


SCENES = [(0.0, 7.0, scene_a), (6.8, 14.4, scene_b), (13.8, DURATION, scene_world)]
FADE = 0.6


def frame_at(A, T):
    out, total = None, 0.0
    for s, e, fn in SCENES:
        if s <= T < e:
            w = 1.0
            if s > 0:
                w = min(w, (T - s) / (0.2 if fn is scene_b else FADE))
            if e < DURATION:
                w = min(w, (e - T) / (0.2 if fn is scene_a else FADE))
            w = ease(w)
            img = fn(A, T - s, T)
            out = img * w if out is None else out + img * w
            total += w
    f = out / max(total, 1e-6)
    return bloom(f)


def main():
    A = Assets()
    wav = OUT.with_suffix(".wav")
    music.write_wav(wav, music.render2(DURATION))
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ffmpeg, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-i", str(wav), "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(OUT)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = int(DURATION * FPS)
    rng = np.random.default_rng(12)
    for i in range(n):
        f = frame_at(A, i / FPS)
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
        out = Path(sys.argv[4])
        for T in [float(x) for x in sys.argv[3].split(",")]:
            img = frame_at(A, T)
            cv2.imwrite(str(out / f"v2_{T:05.1f}.jpg"), (np.clip(img, 0, 1) * 255).astype(np.uint8))
    else:
        main()
