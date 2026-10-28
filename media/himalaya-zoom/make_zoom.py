"""A smooth, clear zoom from the rooftops to Kanchenjunga, made from one phone
clip and five photos taken from the same spot a minute later:

  himalaya-zoom.mp4   1080 x 1920, 23 s, with the clip's own sound

  zoom-clip.mp4        the clip: a slow zoom from the rooftops to the
                       houses, the hills and the massif above them (it came
                       through an editor as a 405 px wide picture between
                       black bars)
  photo-1-wide.jpg     the photos, from wide to close: 2x, 4x, 6.5x the
  photo-2-houses.jpg   first; the last is a wider frame at about the
  photo-3-hills.jpg    fourth's zoom
  photo-4-massif.jpg
  photo-5-closeup.jpg

  1. Where everything is. The photos are matched to one another (SIFT
     features, a similarity fitted with RANSAC) and to the clip, whose
     every frame is tracked (corners, frame to frame) and then lined up
     directly against the photo it overlaps most, so nothing drifts. All of
     it is placed in one frame of reference: the houses photo's pixels.
  2. A smooth zoom. The clip zooms unevenly, and stops for four seconds
     halfway. The film's camera instead follows one eased curve, from the
     clip's widest view to the massif filling the frame, its centre taken
     from where the clip itself pointed while it zoomed (where it stood
     still, the hand re-aimed; that is spread over the zoom around it), so
     nothing swings or jumps. The zoom quickens by up to a third through
     the middle, so it does not linger where the clip stood still. Each
     film frame takes the latest clip frame that holds its whole view, tilt
     and all, steadied onto the curve; the clip plays on continuously
     beneath that, up to 3x where it stood still, so every frame is one
     real moment of it, never two blended. The phone's exposure stepped
     down in the pause; that step is spread into a slow drift.
  3. Clear. The clip's frames are enlarged with Real-ESRGAN. The sky, the
     hills and the snow do not move in a minute, so their detail is taken
     from the sharpest photo that covers them, laid on the clip's own broad
     colour there (so no photo's edge can show); only the trees and houses,
     which do move, are the clip's own.
  4. On past the clip. Where the clip ends, its trees and houses give way to
     the photos': its light eases towards theirs first, then one morphs
     into the other along the motion between them (the trees swayed a
     little in the minute between), so nothing shows twice. The zoom
     carries on through the photos, each giving
     way to the next, closer one where it covers the frame, until the
     massif fills it. Each photo's colours are matched to the houses
     photo's with a smooth fitted surface, so no sky shows as a box.
  5. A gentle finish: a filmic curve, a slightly deeper sky at the top,
     a soft vignette and fine grain; a fade in and out; the clip's sound,
     carried on with crossfaded pieces of itself.

    pip install numpy opencv-python-headless onnx onnxruntime imageio-ffmpeg
    python3 media/himalaya-zoom/make_zoom.py      # about an hour on CPU
"""

import math
import re
import subprocess
import sys
import wave
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
import upscale as sr  # noqa: E402

CLIP = HERE / "zoom-clip.mp4"
PHOTOS = ["photo-1-wide.jpg", "photo-2-houses.jpg", "photo-3-hills.jpg", "photo-4-massif.jpg",
          "photo-5-closeup.jpg"]
NEIGHBOUR = [1, None, 1, 2, 3]   # each photo is matched to this one (the houses photo is the reference)
DETAIL = [3, 4, 2, 1, 0]         # which photo to draw from first, where several cover a pixel
REF = 1
OUTPUT = HERE / "himalaya-zoom.mp4"
CACHE = Path.home() / ".cache" / "himalaya-zoom"
SIZE = (1080, 1920)
FPS = 30
DUR = 23.0
MARGIN = 0.93                    # the film's view, as a share of the clip frame it is taken from
MAX_SPEED = 3.0                  # the fastest the clip is played (where it stood still), times its own speed
ZOOM = (0.6, 21.0)               # when the zoom starts and ends (s), in zoom time (see zoom_time)
QUICKEN = (9.6, 1.3, 0.35)       # where the zoom runs faster (s), over how long (s), and by how much
FINAL_FILL = 0.94                # how much of the frame's width the massif fills at the end


def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def smootherstep(x):
    x = np.clip(x, 0, 1)
    return x * x * x * (x * (6 * x - 15) + 10)


def H(m):
    return np.vstack([m, [0, 0, 1]]) if m.shape[0] == 2 else m


def scale_of(m):
    return float(np.sqrt(abs(np.linalg.det(m[:2, :2]))))


# ------------------------------------------------------------------- clip ----

def read_clip():
    """The clip's frames, without the black bars the editor put round them."""
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    info = subprocess.run([ff, "-i", str(CLIP)], capture_output=True, text=True).stderr
    w, h = (int(v) for v in re.search(r" Video: .*?, (\d+)x(\d+)", info).groups())
    raw = subprocess.run([ff, "-loglevel", "error", "-i", str(CLIP), "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                         capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)
    cols = np.nonzero(frames[:: 30].max(axis=(0, 1, 3)) > 20)[0]
    rows = np.nonzero(frames[:: 30].max(axis=(0, 2, 3)) > 20)[0]
    return np.ascontiguousarray(frames[:, rows[0]:rows[-1] + 1, cols[0]:cols[-1] + 1])


def follow(g0, g1, mask=None, n=800):
    """Corners in g0 and where they went in g1, kept only if tracking them
    back lands where they started."""
    p0 = cv2.goodFeaturesToTrack(g0, n, 0.005, 5, mask=mask)
    if p0 is None or len(p0) < 8:
        return None, None
    p1, st, _ = cv2.calcOpticalFlowPyrLK(g0, g1, p0, None, winSize=(25, 25), maxLevel=4)
    pb, st2, _ = cv2.calcOpticalFlowPyrLK(g1, g0, p1, None, winSize=(25, 25), maxLevel=4)
    ok = (st[:, 0] == 1) & (st2[:, 0] == 1) & (np.linalg.norm(pb - p0, axis=2)[:, 0] < 0.5)
    return p0[ok], p1[ok]


def similarity(p0, p1, thr):
    m, inl = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC, ransacReprojThreshold=thr,
                                         maxIters=4000, confidence=0.999)
    return (None, 0) if m is None else (H(m), int(inl.sum()))


def sift(img, maxdim):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    s = maxdim / max(g.shape)
    g = cv2.resize(g, None, fx=s, fy=s, interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
    k, d = cv2.SIFT_create(8000).detectAndCompute(g, None)
    return np.float32([p.pt for p in k]) / s, d


def match(fa, fb, thr=4.0):
    """The similarity taking image a onto image b, from their SIFT features."""
    (pa, da), (pb, db) = fa, fb
    pairs = [m for m, n in cv2.BFMatcher().knnMatch(da, db, k=2) if m.distance < 0.75 * n.distance]
    src = np.float32([pa[m.queryIdx] for m in pairs])
    dst = np.float32([pb[m.trainIdx] for m in pairs])
    return similarity(src, dst, thr)


# ------------------------------------------------------------ where it is ----

def place_photos(photos):
    """Each photo's pixels in the reference photo's (a similarity)."""
    feats = [sift(p, 2400) for p in photos]
    P = [None] * len(photos)
    P[REF] = np.eye(3)
    for k in sorted(range(len(photos)), key=lambda k: 0 if NEIGHBOUR[k] == REF else 1):
        if k == REF:
            continue
        j = NEIGHBOUR[k]
        m, good = match(feats[k], feats[j])
        P[k] = P[j] @ m
        print(f"{PHOTOS[k]} -> {PHOTOS[j]}: {good} matches agree, x{1 / scale_of(m):.2f}")
    return P


def render(photo_pyr, m, size):
    """A photo through the affine m (photo px to output px), from the level
    of its pyramid nearest its scale there."""
    s = scale_of(m)
    lv = int(np.clip(np.floor(np.log2(0.75 / s)), 0, len(photo_pyr) - 1)) if s < 0.75 else 0
    a = m @ np.diag([2.0 ** lv, 2.0 ** lv, 1])
    return cv2.warpAffine(photo_pyr[lv], a[:2].astype(np.float32), size, flags=cv2.INTER_LINEAR,
                          borderMode=cv2.BORDER_CONSTANT)


def flatten(g):
    """Local contrast evened out, so that the clip and a photo, exposed
    differently, look alike to the tracker."""
    g = g.astype(np.float32)
    m = cv2.GaussianBlur(g, (0, 0), 8)
    s = np.sqrt(cv2.GaussianBlur((g - m) ** 2, (0, 0), 8)) + 2
    return np.clip(128 + 40 * (g - m) / s, 0, 255).astype(np.uint8)


def steady(values, weights, half=15, sigma=15.0):
    """A per-frame estimate, steadied: the weighted median of the frames
    around each (so a fit that latches for a moment onto the houses rather
    than the hills, which lie a little differently in the photos, is
    outvoted), then smoothed. Frames without one take their neighbours'."""
    n = len(values)
    idx = np.arange(n)
    med = np.full(n, np.nan)
    for i in range(n):
        sel = (weights > 0) & (np.abs(idx - i) <= half)
        if sel.any():
            o = np.argsort(values[sel])
            c = np.cumsum(weights[sel][o])
            med[i] = values[sel][o][np.searchsorted(c, c[-1] / 2)]
    ok = ~np.isnan(med)
    med = np.interp(idx, idx[ok], med[ok])
    r = int(3 * sigma)
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    return np.convolve(np.pad(med, r, mode="edge"), k / k.sum(), mode="valid")


def place_clip(frames, photos, P):
    """Each clip frame's pixels in the reference photo's. Frame to frame the
    camera is tracked; then every frame is lined up directly against the
    houses photo (rendered at the frame's size; the wide one, matched to it,
    where the frame is too wide for it), and these small corrections are
    steadied over time, so the result neither drifts nor jerks."""
    n = len(frames)
    h, w = frames.shape[1:3]
    gray = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in frames]
    steps = []
    for i in range(n - 1):
        a, b = follow(gray[i], gray[i + 1])
        steps.append(similarity(a, b, 1.0)[0])
    T = [np.eye(3)]
    for m in reversed(steps):
        T.append(T[-1] @ m)
    T = T[::-1]                                           # frame i -> last frame
    big = cv2.resize(frames[-1], None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    m, good = match(sift(big, 1600), sift(photos[REF], 2400))
    last = m @ np.diag([2.0, 2.0, 1])                     # last frame -> reference photo
    print(f"clip's last frame -> {PHOTOS[REF]}: {good} matches agree")
    pyrs = [pyramid(p) for p in photos]
    ones = [pyramid(np.full(p.shape[:2], 255, np.uint8)) for p in photos]
    c0 = np.array([w / 2, h / 2, 1.0])
    W = [last @ T[i] for i in range(n)]
    # Each frame's correction, as a small zoom, turn and shift, against the
    # wide photo and against the houses photo; and how many points agree.
    pars = np.full((n, 2, 4), np.nan)
    votes = np.zeros((n, 2))
    for i in range(n):
        g = flatten(gray[i])
        for s, k in enumerate((0, REF)):
            to_frame = np.linalg.inv(W[i]) @ P[k]
            mask = cv2.erode((render(ones[k], to_frame, (w, h)) > 128).astype(np.uint8), np.ones((9, 9), np.uint8))
            if mask.mean() < 0.08:
                continue
            view = flatten(cv2.cvtColor(render(pyrs[k], to_frame, (w, h)), cv2.COLOR_BGR2GRAY))
            a, b = follow(g, view, mask * 255)
            if a is None or len(a) < 25:
                continue
            f, good = similarity(a, b, 1.5)
            if f is not None and good >= 20:
                pars[i, s] = [np.log(scale_of(f)), np.arctan2(f[1, 0], f[0, 0]), *(f @ c0)[:2] - c0[:2]]
                votes[i, s] = good
    # The houses photo's corrections; before it comes into view, the wide
    # photo's, shifted to agree with it where they first overlap.
    seen = np.nonzero(votes[:, 1])[0]
    both = seen[votes[seen, 0] > 0][:30]
    pars[:seen[0], 1] = pars[:seen[0], 0] + np.median(pars[both, 1] - pars[both, 0], axis=0)
    votes[:seen[0], 1] = votes[:seen[0], 0]
    # The zoom and turn steadied over a second and a half: they drift only
    # slowly, and a fit that changes its mind between the houses and the hills
    # would otherwise show as the picture rolling or the zoom hesitating. The
    # shifts over half a second.
    pars = np.column_stack([steady(np.nan_to_num(pars[:, 1, c]), votes[:, 1], *((30, 45.0) if c < 2 else (15, 15.0)))
                            for c in range(4)])
    out = []
    for g, (ls, th, dx, dy) in zip(W, pars):
        s = np.exp(ls)
        a, b = s * np.cos(th), s * np.sin(th)
        corr = np.array([[a, -b, c0[0] + dx - a * c0[0] + b * c0[1]], [b, a, c0[1] + dy - b * c0[0] - a * c0[1]],
                         [0, 0, 1]])
        out.append(g @ corr)
    return np.array(out)


def pyramid(img, levels=5):
    out = [img]
    for _ in range(levels):
        out.append(cv2.pyrDown(out[-1]))
    return out


# --------------------------------------------------------- what is distant ----

def distance_mask(photo):
    """1 on what is far (sky, snow, the hazy hills), 0 on the trees and
    houses: hazy blue and snow white, joined to the top of the photo,
    with a soft edge."""
    lab = cv2.cvtColor(photo, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab[..., 0] * 100 / 255, lab[..., 1] - 128, lab[..., 2] - 128
    hazy = (B < 1.5) & (A < 6) & (np.hypot(A, B) < 40)
    snow = (L > 72) & (np.hypot(A, B) < 18)
    far = (hazy | snow).astype(np.uint8)
    far = cv2.morphologyEx(far, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab_ = cv2.connectedComponents(far, connectivity=4)
    top = set(np.unique(lab_[:3])) - {0}
    far = np.isin(lab_, list(top)).astype(np.uint8)
    far = cv2.morphologyEx(far, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    # Only down to the first trees and roofs in each column: a blue roof or
    # a patch of sky below them is not far.
    far = far * (np.cumsum(1 - far, axis=0) <= 25)
    far = cv2.erode(far, np.ones((5, 5), np.uint8))       # clear of the leaves' edges
    return cv2.GaussianBlur(far.astype(np.float32), (0, 0), 2.5)


def far_like(img):
    """How far each pixel of a 0..1 BGR image looks: hazy blue or snow
    white, not green or dark (the same test as distance_mask, softened)."""
    lab = cv2.cvtColor(np.clip(img, 0, 1).astype(np.float32), cv2.COLOR_BGR2LAB)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    hazy = (1 - smooth(B, -1.0, 4.0)) * (1 - smooth(A, 4.0, 8.0))
    snow = smooth(L, 68, 76) * (1 - smooth(np.hypot(A, B), 15, 22))
    return cv2.GaussianBlur(np.maximum(hazy, snow).astype(np.float32), (0, 0), 1.5)


def edge_fade(shape, frac=0.08):
    """1 inside a photo, fading to 0 over its outer few per cent."""
    h, w = shape
    y = np.minimum(np.arange(h), np.arange(h)[::-1])[:, None] / (frac * min(h, w))
    x = np.minimum(np.arange(w), np.arange(w)[::-1])[None, :] / (frac * min(h, w))
    return (smooth(np.minimum(x, y), 0.0, 1.0)).astype(np.float32)


# ------------------------------------------------------------------ colour ----

def lab_stats(img, mask):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    m = mask > 0.5
    if m.sum() < 500:
        return None
    v = lab[m]
    return v.mean(0), v.std(0) + 1e-3


def colour_match(img, frm, to):
    """img's colours moved from statistics frm to statistics to (Lab)."""
    lab = cv2.cvtColor(np.clip(img, 0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    lab = (lab - frm[0]) * (to[1] / frm[1]) + to[0]
    return cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)


def fill(f, valid):
    """f filled in where not valid from the valid values around: normalised
    blurs from coarse to fine, each used where it has enough to go on."""
    v = valid.astype(np.float32)
    out = None
    for sigma in (64, 24, 8, 3):
        wt = cv2.GaussianBlur(v, (0, 0), sigma)
        avg = cv2.GaussianBlur(f * v[..., None], (0, 0), sigma) / np.maximum(wt, 1e-6)[..., None]
        a = np.clip(wt / 0.25, 0, 1)[..., None]
        out = avg if out is None else avg * a + out * (1 - a)
    return np.where(valid[..., None], f, out)


def lowpass(x, sigma):
    """A wide blur, done small: x shrunk 8x, blurred, enlarged."""
    h, w = x.shape[:2]
    small = cv2.resize(x, (w // 8, h // 8), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), sigma / 8)
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_LINEAR)


def match_photos(photos, P):
    """Each photo's colours matched to the reference photo's: the
    difference between them over their overlap, fitted per channel with a
    smooth curved surface (so a brighter or bluer sky, and its gradient,
    are matched, but no outline is copied from one photo to the other).
    Without this, each photo's sky shows as a box against the next."""
    out = list(photos)
    ref = pyramid(photos[REF])
    seen_ref = pyramid(np.full(photos[REF].shape[:2], 255, np.uint8))
    for k, p in enumerate(photos):
        if k == REF:
            continue
        f = 8
        h, w = p.shape[0] // f, p.shape[1] // f
        small = cv2.resize(p, (w, h), interpolation=cv2.INTER_AREA)
        m = np.diag([1 / f, 1 / f, 1]) @ np.linalg.inv(P[k]) @ P[REF]   # reference px -> small photo k px
        r = render(ref, m, (w, h))
        seen = cv2.erode((render(seen_ref, m, (w, h)) > 128).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        lab_p = cv2.cvtColor(cv2.GaussianBlur(small, (0, 0), 2), cv2.COLOR_BGR2LAB).astype(np.float32)
        lab_r = cv2.cvtColor(cv2.GaussianBlur(r, (0, 0), 2), cv2.COLOR_BGR2LAB).astype(np.float32)
        yy, xx = np.nonzero(seen)
        lo, hi = np.array([xx.min(), yy.min()]), np.array([xx.max(), yy.max()])

        def basis(x, y):
            u, v = (x - lo[0]) / max(hi[0] - lo[0], 1) - 0.5, (y - lo[1]) / max(hi[1] - lo[1], 1) - 0.5
            return np.stack([np.ones_like(u), u, v, u * u, u * v, v * v], -1)

        A = basis(xx.astype(np.float32), yy.astype(np.float32))
        Y, X = np.mgrid[0:p.shape[0], 0:p.shape[1]].astype(np.float32) / f
        B = basis(np.clip(X, lo[0], hi[0]), np.clip(Y, lo[1], hi[1]))   # held level past the overlap
        lab = cv2.cvtColor(p, cv2.COLOR_BGR2LAB).astype(np.float32)
        for c in range(3):
            d = lab_r[..., c][seen] - lab_p[..., c][seen]
            keep = np.abs(d - np.median(d)) < 3 * (np.median(np.abs(d - np.median(d))) * 1.48 + 1)
            coef = np.linalg.lstsq(A[keep], d[keep], rcond=None)[0]
            lab[..., c] += B @ coef
        out[k] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    return out


# -------------------------------------------------------------- the camera ----

def massif_view(photos, P):
    """The final view: centred on the snow in the massif photo, wide enough
    for it to fill FINAL_FILL of the frame (in reference pixels)."""
    k = 3
    lab = cv2.cvtColor(photos[k], cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab[..., 0] * 100 / 255, lab[..., 1] - 128, lab[..., 2] - 128
    snow = ((L > 72) & (np.hypot(A, B) < 18)).astype(np.uint8)
    n, lab_, st, _ = cv2.connectedComponentsWithStats(snow, 8)
    big = 1 + np.argmax(st[1:, 4])
    x, y, w, h = st[big, :4]
    corners = np.float32([[x, y], [x + w, y + h]])
    world = cv2.transform(corners[None], P[k][:2])[0]
    centre = world.mean(0)
    width = (world[1, 0] - world[0, 0]) / FINAL_FILL
    # Frame the snow a little above the middle, with the ranges under it.
    centre[1] += 0.12 * width * SIZE[1] / SIZE[0]
    return centre, width


def overhang(m, centre, width, frame_size):
    """How far (clip px) a level view, centre and width in reference px,
    reaches past the edges of the clip frame placed by m."""
    w, h = frame_size
    hw, hh = width / 2, width * SIZE[1] / SIZE[0] / 2
    corners = np.array([[centre[0] + sx * hw, centre[1] + sy * hh, 1] for sx in (-1, 1) for sy in (-1, 1)])
    fc = (np.linalg.inv(m) @ corners.T).T
    return max(-fc[:, 0].min(), fc[:, 0].max() - w, -fc[:, 1].min(), fc[:, 1].max() - h)


def zoom_time(t):
    """Film time to zoom time: the zoom runs up to a third faster through the
    middle, where the clip stood still, so it does not linger there; before
    and after, at its own pace."""
    c, w, a = QUICKEN
    k = w * math.sqrt(2)
    return t + a * w * math.sqrt(math.pi / 2) * (math.erf((t - c) / k) - math.erf(-c / k))


def camera_path(W, frame_size, final):
    """The film's view at every frame: centre and width in reference
    pixels, on one eased zoom; and the clip frame each one is taken from
    (None once past the clip)."""
    w, h = frame_size
    c0 = np.array([w / 2, h / 2, 1.0])
    widths = np.array([w * scale_of(m) for m in W])
    centres = np.array([(m @ c0)[:2] for m in W])
    reach = np.minimum.accumulate(widths)                 # the closest the clip has zoomed by each frame
    start, end = widths[0] * MARGIN, final[1]
    # The clip's centre as a function of its zoom, from the frames where
    # the zoom moves on, each weighted by how far it moves it (where the
    # zoom stood still, the hand re-aimed; that is spread over the zoom
    # around it, not swung through in a moment), smoothed in log width.
    lw = np.log(reach)
    moves = np.maximum(np.concatenate([[0.0], lw[:-1] - lw[1:]]), 0) + 1e-5
    grid = np.linspace(lw.max(), lw.min(), 200)
    near = np.exp(-0.5 * ((lw[None, :] - grid[:, None]) / 0.12) ** 2) * moves[None, :]
    cx = (near * centres[None, :, 0]).sum(1) / near.sum(1)
    cy = (near * centres[None, :, 1]).sum(1) / near.sum(1)
    clip_end = np.log(reach[-1] * MARGIN)

    def centre_at(lv):
        if lv >= clip_end:
            return np.array([np.interp(-lv, -grid, cx), np.interp(-lv, -grid, cy)])
        u = smootherstep((clip_end - lv) / (clip_end - np.log(end)))
        a = np.array([np.interp(-clip_end, -grid, cx), np.interp(-clip_end, -grid, cy)])
        return a + (final[0] - a) * u

    # The film's views, and for each the latest clip frame that holds it
    # whole: wide enough, and (the phone tilted a little as it zoomed, and a
    # level view cut from a tilted frame pokes out at its corners) round it.
    looks, latest = [], []
    k = 0
    for j in range(int(DUR * FPS)):
        t = zoom_time(j / FPS)
        tau = (t - ZOOM[0]) / (ZOOM[1] - ZOOM[0])
        u = 0.72 * smootherstep(tau) + 0.28 * np.clip(tau, 0, 1)
        lv = np.log(start) + (np.log(end) - np.log(start)) * u
        lv -= 0.025 * max(0.0, t - ZOOM[1])               # still drifting in, very slowly, at the end
        c = centre_at(lv)
        looks.append((c, float(np.exp(lv))))
        if lv < clip_end:
            latest.append(None)
            continue
        need = np.exp(lv) / MARGIN
        ok = np.nonzero(reach >= need)[0]
        target = ok[-1] if len(ok) else 0
        fits = [i for i in range(target, k - 1, -1) if overhang(W[i], c, np.exp(lv), frame_size) <= 0]
        k = fits[0] if fits else min(range(k, target + 1), key=lambda i: overhang(W[i], c, np.exp(lv), frame_size))
        latest.append(k)
    # The clip then plays on continuously beneath that limit: never later
    # than it, never going back, its speed changing gently, so where the clip
    # stood still it is played through a little faster and eases back, and
    # every film frame is one real moment of the clip, never two blended.
    n = sum(x is not None for x in latest)
    limit = np.minimum.accumulate(np.array(latest[:n], float)[::-1])[::-1]    # the latest allowed, from here on
    time = np.zeros(n)
    time[0], speed = limit[0], 0.0
    for j in range(1, n):
        want = np.clip((limit[j] - time[j - 1]) / 8.0, 0.0, MAX_SPEED)
        speed += np.clip(want - speed, -0.15, 0.15)
        time[j] = min(limit[j], time[j - 1] + speed)
        speed = time[j] - time[j - 1]
    # (Where the hand re-aimed, a frame on the way may fall a few pixels short
    # of the view at an edge; the photos fill that strip.)
    return [(c, width, int(round(time[j])) if j < n else None) for j, (c, width) in enumerate(looks)]


# ----------------------------------------------------------------- render ----

def to_film(centre, width):
    """Reference pixels to film pixels for a view."""
    s = SIZE[0] / width
    return np.array([[s, 0, SIZE[0] / 2 - s * centre[0]], [0, s, SIZE[1] / 2 - s * centre[1]], [0, 0, 1]])


class Film:
    def __init__(self):
        frames = read_clip()
        self.frames = frames
        self.h, self.w = frames.shape[1:3]
        raw = [cv2.imread(str(HERE / p)) for p in PHOTOS]
        CACHE.mkdir(parents=True, exist_ok=True)
        path = CACHE / "places.npz"
        if path.exists():
            z = np.load(path)
            P, W = list(z["P"]), z["W"]
        else:
            P = place_photos(raw)
            W = place_clip(frames, raw, P)
            np.savez(path, P=np.array(P), W=W)
        self.P, self.W = P, W
        photos = match_photos(raw, P)
        self.pyr = [pyramid(p.astype(np.float32) / 255) for p in photos]
        self.far = [pyramid(distance_mask(p)) for p in photos]
        self.fade = [pyramid(edge_fade(p.shape[:2])) for p in photos]
        final = massif_view(photos, P)
        self.views = camera_path(W, (self.w, self.h), final)
        self.sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(),
                                         providers=["CPUExecutionProvider"])
        self.enlarged = {}
        self.inside = None
        self.steady = self.exposure()
        self.colour = self.clip_colours(photos)
        yy, xx = np.mgrid[0:SIZE[1], 0:SIZE[0]].astype(np.float32)
        r = np.hypot((xx / SIZE[0] - 0.5) / 0.8, (yy / SIZE[1] - 0.47) / 0.9)
        self.vignette = (1 - 0.16 * smooth(r, 0.45, 1.1))[..., None].astype(np.float32)
        self.sky = (1 - smooth(yy / SIZE[1], 0.0, 0.35))[..., None].astype(np.float32)
        rng = np.random.default_rng(4)
        self.grain = [cv2.GaussianBlur(rng.normal(0, 1, SIZE[::-1]).astype(np.float32), (0, 0), 0.6) * 0.008
                      for _ in range(4)]

    def exposure(self):
        """The phone's exposure, frame by frame: how much lighter each frame
        is than the one before, on the ground both see (so the view changing
        does not count), chained. It stepped down in half a second where the
        clip stood still; returned, per frame, is the change in lightness
        (Lab L) that turns such quick changes into a drift over several
        seconds, as a real camera's settles."""
        n = len(self.frames)
        L = [cv2.cvtColor(f, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32) for f in self.frames]
        level = np.zeros(n)
        for i in range(n - 1):
            m = np.linalg.inv(self.W[i]) @ self.W[i + 1]   # frame i+1 to frame i
            b = cv2.warpAffine(L[i + 1], m[:2].astype(np.float32), (self.w, self.h), flags=cv2.INTER_LINEAR,
                               borderValue=-1)
            ok = (b >= 8) & (L[i] >= 8) & (b <= 247) & (L[i] <= 247)
            level[i + 1] = level[i] + (np.median(b[ok] - L[i][ok]) if ok.sum() > 500 else 0.0)
        r = 360
        k = np.exp(-0.5 * (np.arange(-r, r + 1) / 120.0) ** 2)
        return np.convolve(np.pad(level, r, mode="edge"), k / k.sum(), mode="valid") - level

    def clip_colours(self, photos):
        """For every clip frame, its colours' statistics and the photos'
        over the same ground, smoothed over time: the clip is graded to the
        photos'."""
        stats = []
        self._ref_pyr = pyramid(photos[REF])
        self._ref_ones = pyramid(np.full(photos[REF].shape[:2], 255, np.uint8))
        for i, f in enumerate(self.frames):
            to_frame = np.linalg.inv(self.W[i]) @ self.P[REF]
            ref = render(self._ref_pyr, to_frame, (self.w, self.h))
            seen = render(self._ref_ones, to_frame, (self.w, self.h))
            mask = cv2.erode(seen, np.ones((9, 9), np.uint8)).astype(np.float32) / 255
            a, b = lab_stats(f, mask), lab_stats(ref, mask)
            if a is not None and b is not None:
                a[0][0] += self.steady[i]                  # the frame as its exposure is steadied
            stats.append(None if a is None or b is None else np.concatenate([b[0] - a[0], [mask.mean()]]))
        # Frames too wide to overlap much take the shift of the nearest ones that do.
        good = [i for i, s in enumerate(stats) if s is not None and s[3] > 0.08]
        shift = np.array([stats[i][:3] for i in good])
        idx = np.arange(len(stats))
        cols = np.column_stack([np.interp(idx, good, shift[:, c]) for c in range(3)])
        g = np.exp(-0.5 * (np.arange(-60, 61) / 20.0) ** 2)
        g /= g.sum()
        shift = np.column_stack([np.convolve(np.pad(c, 60, mode="edge"), g, mode="valid") for c in cols.T])
        shift[:, 0] += self.steady
        return shift

    def clip_frame(self, i):
        """Clip frame i enlarged 4x with Real-ESRGAN, its exposure steadied
        and graded to the photos."""
        if i not in self.enlarged:
            self.enlarged = {k: v for k, v in self.enlarged.items() if k > i - 200}
            while len(self.enlarged) > 3:
                self.enlarged.pop(min(self.enlarged))
            big = sr.upscale_tiled(self.sess, self.frames[i])
            lab = cv2.cvtColor(big, cv2.COLOR_BGR2LAB).astype(np.float32) + self.colour[i]
            big = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
            self.enlarged[i] = big.astype(np.float32) / 255
        return self.enlarged[i]

    def clip_view(self, film, i):
        """Clip frame i, enlarged and graded, in the film's view; and where
        it covers the view (1 inside, easing to 0 over its last few pixels)."""
        big = self.clip_frame(i)
        m = film @ self.W[i] @ np.array([[0.25, 0, -0.375], [0, 0.25, -0.375], [0, 0, 1]])
        if scale_of(m) < 0.85:                             # shrinking: soften first, so it does not shimmer
            big = cv2.GaussianBlur(big, (0, 0), 0.45 / scale_of(m))
        view = cv2.warpAffine(big, m[:2].astype(np.float32), SIZE, flags=cv2.INTER_CUBIC,
                              borderMode=cv2.BORDER_REPLICATE)
        if self.inside is None:
            self.inside = edge_fade(big.shape[:2], 0.01)
        inside = cv2.warpAffine(self.inside, m[:2].astype(np.float32), SIZE, flags=cv2.INTER_LINEAR)
        return view, inside

    def photos_over(self, m_of, mask_kind):
        """The photos laid over one another, sharpest first: colour and
        cover, through each photo's affine m_of[k] (photo px to film px)."""
        acc = np.zeros(SIZE[::-1] + (3,), np.float32)
        cov = np.zeros(SIZE[::-1], np.float32)
        for k in DETAIL:
            m = m_of[k]
            corners = cv2.transform(np.float32([[[0, 0], [self.pyr[k][0].shape[1], self.pyr[k][0].shape[0]]]]),
                                    m[:2])[0]
            if corners[1, 0] < 0 or corners[0, 0] > SIZE[0] or corners[1, 1] < 0 or corners[0, 1] > SIZE[1]:
                continue
            a = render(self.fade[k], m, SIZE)
            if mask_kind == "far":
                a = a * render(self.far[k], m, SIZE)
            a = a * (1 - cov)
            if a.max() < 1e-3:
                continue
            acc += render(self.pyr[k], m, SIZE) * a[..., None]
            cov += a
            if cov.min() > 0.999:
                break
        return acc, cov

    def frame(self, j):
        centre, width, src = self.views[j]
        t = j / FPS
        film = to_film(centre, width)
        m_of = [film @ p for p in self.P]
        # How far the clip has given way to the photos' trees and houses.
        hand = self.views[j][2]
        if hand is None:
            over = light = 1.0
        else:
            lw = np.log(width)
            ends = [np.log(v[1]) for v in self.views if v[2] is not None][-1]
            over = smooth(lw, ends + 0.12, ends)            # in half a second, at the very end of the clip
            light = smooth(lw, ends + 0.5, ends + 0.1)     # and, over the second and a half before, its light
        out = None
        if hand is not None:
            out, inside = self.clip_view(film, hand)
            if inside.min() < 0.999:
                # Where the hand re-aimed, a frame can fall a few pixels
                # short of the view at an edge: the photos fill that strip.
                fill, cov = self.photos_over(m_of, "all")
                fill = fill / np.maximum(cov, 1e-4)[..., None]
                out = out * inside[..., None] + fill * (1 - inside[..., None])
            # The far layer from the photos: their detail, on the clip's own
            # broad colour there, so no photo's edge can show against it.
            far, cov = self.photos_over(m_of, "far")
            if cov.max() > 1e-3:
                # Only where the clip too shows something far: its trees,
                # swaying a little since the photos, stay in front.
                sky = cov * far_like(out)
                wp = np.maximum(lowpass(cov, 20), 1e-4)[..., None]
                wc = np.maximum(lowpass(sky, 20), 1e-4)[..., None]
                broad_photo = lowpass(far, 20) / wp
                broad_clip = lowpass(out * sky[..., None], 20) / wc
                col = far / np.maximum(cov, 1e-4)[..., None] - broad_photo + broad_clip
                out = out * (1 - sky[..., None]) + col * sky[..., None]
            if light > 0:
                # The photos' trees are lit a little differently from the
                # clip's: its broad colour eases towards theirs before it
                # gives way to them, so the light does not jump.
                all_, cov = self.photos_over(m_of, "all")
                ph = all_ + out * (1 - cov[..., None])
                out = out + light * (lowpass(ph, 40) - lowpass(out, 40))
        if over > 0:
            if hand is None or light <= 0:
                all_, cov = self.photos_over(m_of, "all")
            ph = all_ + (out if out is not None else all_ / np.maximum(cov, 1e-3)[..., None]) * (1 - cov[..., None])
            out = ph if out is None or over >= 1 else self.morph(out, ph, over)
        return self.finish(out, t, j)

    def morph(self, a, b, t):
        """From the clip's picture a to the photos' b, t of the way. Not a
        crossfade: the trees swayed a little in the minute between them and
        would show twice. Each is drawn along the motion between them (dense
        optical flow, on their local contrast, so their exposures do not
        matter) towards where the other has it, as one fades into the other."""
        half = (SIZE[0] // 2, SIZE[1] // 2)
        gray = lambda x: flatten(cv2.cvtColor((np.clip(cv2.resize(x, half, interpolation=cv2.INTER_AREA), 0, 1) * 255)
                                              .astype(np.uint8), cv2.COLOR_BGR2GRAY))
        flow = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM).calc(gray(a), gray(b), None)
        flow = cv2.resize(np.clip(cv2.GaussianBlur(flow, (0, 0), 3), -20, 20), SIZE, interpolation=cv2.INTER_LINEAR) * 2
        yy, xx = np.mgrid[0:SIZE[1], 0:SIZE[0]].astype(np.float32)
        fx, fy = flow[..., 0], flow[..., 1]
        t = float(t)
        wa = cv2.remap(a, xx - t * fx, yy - t * fy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        wb = cv2.remap(b, xx + (1 - t) * fx, yy + (1 - t) * fy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        return wa * (1 - t) + wb * t

    def finish(self, x, t, j):
        x = np.clip(x, 0, 1)
        x = x + 0.08 * x * (1 - x) * (2 * x - 1)              # a gentle filmic curve
        x = x * (1 - 0.06 * self.sky)                          # the sky a touch deeper at the top
        x = x * self.vignette
        g = np.roll(self.grain[j % 4], (j * 37) % SIZE[1], 0)
        x = x + g[..., None] * (1.1 - x.mean(2, keepdims=True))
        x = x * smooth(t, 0.0, 0.8) * (1 - smooth(t, DUR - 1.2, DUR))
        return (np.clip(x, 0, 1) * 255 + 0.5).astype(np.uint8)


# ----------------------------------------------------------------- sound ----

def sound(seconds):
    """The clip's sound, carried on to `seconds` with crossfaded pieces of
    itself, faded in and out."""
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run([ff, "-loglevel", "error", "-i", str(CLIP), "-vn", "-ac", "2", "-ar", "44100",
                          "-f", "s16le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
    rate = 44100
    total = int(seconds * rate)
    out = np.zeros((total, 2), np.float32)
    piece, fade = int(4.0 * rate), int(1.0 * rate)
    ramp = np.sin(np.linspace(0, np.pi / 2, fade)) ** 2
    n = min(len(x), total)
    out[:n] = x[:n]
    if total > len(x):
        out[len(x) - fade:len(x)] *= ramp[::-1, None]
        rng = np.random.default_rng(9)
        pos = len(x) - fade
        while pos < total:
            a = rng.integers(int(1.0 * rate), len(x) - piece)
            seg = x[a:a + piece].copy()
            seg[:fade] *= ramp[:, None]
            seg[-fade:] *= ramp[::-1, None]
            b = min(pos + piece, total)
            out[pos:b] += seg[:b - pos]
            pos += piece - fade
    t = np.arange(total) / rate
    out *= (smooth(t, 0.0, 0.8) * (1 - smooth(t, seconds - 1.5, seconds)))[:, None]
    return out


def write_wav(path, stereo):
    data = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(44100)
        w.writeframes(data.tobytes())


# ------------------------------------------------------------------ main ----

def main():
    film = Film()
    wav = CACHE / "sound.wav"
    write_wav(wav, sound(DUR))
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    W, Hh = SIZE
    proc = subprocess.Popen(
        [ff, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{Hh}", "-r", str(FPS),
         "-i", "-", "-i", str(wav), "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", str(OUTPUT)],
        stdin=subprocess.PIPE)
    n = len(film.views)
    for j in range(n):
        proc.stdin.write(film.frame(j).tobytes())
        if j % 60 == 0:
            print(f"frame {j}/{n}", flush=True)
    proc.stdin.close()
    proc.wait()
    print(f"wrote {OUTPUT.name}")


def stills(times):
    film = Film()
    for t in times:
        j = min(int(t * FPS), len(film.views) - 1)
        path = CACHE / f"still-{t:05.2f}.jpg"
        cv2.imwrite(str(path), film.frame(j), [cv2.IMWRITE_JPEG_QUALITY, 92])
        print(f"wrote {path}  (clip frame {film.views[j][2]}, width {film.views[j][1]:.0f})")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "stills":
        stills([float(a) for a in sys.argv[2:]])
    else:
        main()
