"""Merge three phone shots of one sunset into a single cinematic photo.

The three were taken from the same balcony within moments of each other, at
three zooms and exposures, so they line up with a homography each:

  sunset-tower.jpg  mid zoom, the composition: tower, roof, poles, sun, clouds
  sunset-sun.jpg    the longest zoom, darker: the sharpest sun and clouds
  sunset-wide.jpg   wide and brighter: what is in the shadows

All three are mapped into the tower shot's frame (cropped to 4:5) and fused
like an exposure bracket, in a Laplacian pyramid: each pixel takes the shot
that is best exposed there. A shot only contributes to the levels of detail
it actually has at this size: the wide one is enlarged about five times, so
it brings light into the shadows but none of its blurred detail, and the
long zoom brings the finest cloud texture. Then a restrained grade.

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/sunset/upscale.py        # optional: 4x Real-ESRGAN sources
    python3 media/sunset/merge_sunset.py
"""

from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
TOWER, SUN, WIDE = (HERE / f for f in ("sunset-tower.jpg", "sunset-sun.jpg", "sunset-wide.jpg"))
OUTPUT = HERE / "sunset-cinematic.jpg"

W, H = 2160, 2700          # 4:5
K = W / 1080               # pixel sizes below are tuned at 1080 wide
CROP_TOP = 150             # in the tower shot's pixels
LEVELS = 9
SR = 4                     # upscale.py's factor; its -x4.png files are used when present


def homography(src, dst):
    sift = cv2.SIFT_create(8000)
    k1, d1 = sift.detectAndCompute(cv2.cvtColor(src, cv2.COLOR_BGR2GRAY), None)
    k2, d2 = sift.detectAndCompute(cv2.cvtColor(dst, cv2.COLOR_BGR2GRAY), None)
    matches = cv2.BFMatcher().knnMatch(d1, d2, k=2)
    good = [m for m, n in matches if m.distance < 0.75 * n.distance]
    p1 = np.float32([k1[m.queryIdx].pt for m in good])
    p2 = np.float32([k2[m.trainIdx].pt for m in good])
    h, inliers = cv2.findHomography(p1, p2, cv2.RANSAC, 3.0)
    print(f"  {int(inliers.sum())} inliers of {len(good)} matches")
    return h


def warp(img, m):
    # A warp that shrinks needs the source shrunk first, or it aliases.
    shrink = np.sqrt(abs(np.linalg.det(m[:2, :2])))
    if shrink < 0.9:
        img = cv2.resize(img, None, fx=shrink, fy=shrink, interpolation=cv2.INTER_AREA)
        m = m @ np.diag([1 / shrink, 1 / shrink, 1])
    out = cv2.warpPerspective(img, m, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
    valid = cv2.warpPerspective(np.ones(img.shape[:2], np.float32), m, (W, H), flags=cv2.INTER_LINEAR)
    # Feather the edge of each shot so no seam can show.
    e = int(25 * K) | 1
    valid = cv2.GaussianBlur(cv2.erode(valid, np.ones((e, e), np.uint8)), (0, 0), 18 * K)
    return out.astype(np.float32) / 255.0, valid


def source(path):
    """The Real-ESRGAN upscale when upscale.py has made it, else the JPEG.

    The crisp RRDBNet upscale (-x4plus) leads. In the shadows, where it paints
    foliage too smoothly, the lighter general model and a little of the plainly
    enlarged original are mixed in; in the sky it is used as it is.
    """
    small = cv2.imread(str(path))
    crisp = path.with_name(path.stem + f"-x{SR}plus.png")
    light = path.with_name(path.stem + f"-x{SR}.png")
    if not (crisp.exists() or light.exists()):
        return small, np.eye(3)
    sr = cv2.imread(str(crisp if crisp.exists() else light)).astype(np.float32)
    plain = cv2.resize(small, sr.shape[1::-1], interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    lum = cv2.GaussianBlur(sr @ np.array([0.114, 0.587, 0.299], np.float32), (0, 0), 6) / 255.0
    lum = cv2.erode(lum, np.ones((31, 31), np.uint8))  # reach the silhouettes' edges too
    shade = (1 - np.clip((lum - 0.15) / 0.25, 0, 1))[..., None]
    if crisp.exists() and light.exists():
        sr = sr * (1 - 0.35 * shade) + cv2.imread(str(light)).astype(np.float32) * 0.35 * shade
    a = 0.25 * shade
    mixed = np.clip(sr * (1 - a) + plain * a, 0, 255).astype(np.uint8)
    return mixed, np.diag([1 / SR, 1 / SR, 1])


def gaussian_pyr(img, n):
    pyr = [img]
    for _ in range(n - 1):
        pyr.append(cv2.pyrDown(pyr[-1]))
    return pyr


def laplacian_pyr(img, n):
    g = gaussian_pyr(img, n)
    return [g[i] - cv2.pyrUp(g[i + 1], dstsize=g[i].shape[1::-1]) for i in range(n - 1)] + [g[-1]]


def exposedness(img):
    """Mertens-style: favour mid tones, and a little colour."""
    lum = img @ np.array([0.114, 0.587, 0.299], np.float32)
    w = np.exp(-((lum - 0.5) ** 2) / (2 * 0.22 ** 2))
    sat = img.std(axis=2)
    return w * (0.6 + 2.0 * sat) + 1e-4


def fuse(images, weights, first_level):
    """Pyramid fusion. Image i contributes only from level first_level[i] up."""
    lps = [laplacian_pyr(im, LEVELS) for im in images]
    wps = [gaussian_pyr(w, LEVELS) for w in weights]
    out = []
    for lev in range(LEVELS):
        ws = [wp[lev] * (lev >= first_level[i]) for i, wp in enumerate(wps)]
        total = sum(ws) + 1e-6
        out.append(sum(lp[lev] * (w / total)[..., None] for lp, w in zip(lps, ws)))
    img = out[-1]
    for lev in range(LEVELS - 2, -1, -1):
        img = cv2.pyrUp(img, dstsize=out[lev].shape[1::-1]) + out[lev]
    return np.clip(img, 0, 1)


def match_colour(img, ref, mask):
    """Match the mean and spread of each channel to ref, over mask."""
    m = mask > 0.5
    out = img.copy()
    for c in range(3):
        a, b = img[..., c][m], ref[..., c][m]
        out[..., c] = (img[..., c] - a.mean()) * (b.std() / max(a.std(), 1e-6)) + b.mean()
    return np.clip(out, 0, 1)


# ------------------------------------------------------------------ grade ----

YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)


def grade(img, sun_xy):
    a = img.copy()
    # Depth in the clouds: a wide, gentle local-contrast lift on mid tones.
    lum = (a @ np.array([0.114, 0.587, 0.299], np.float32))[..., None]
    mid = np.exp(-((lum - 0.5) ** 2) / (2 * 0.2 ** 2))
    a += (a - cv2.GaussianBlur(a, (0, 0), 14 * K)) * 0.35 * mid
    # A graduated filter: the upper sky deepens toward dusk.
    g = np.clip(1 - YY / (H * 0.42), 0, 1)[..., None] ** 1.6
    a *= 1 - g * np.array([0.10, 0.20, 0.14])  # BGR: a touch of rose in the dark
    lum = (a @ np.array([0.114, 0.587, 0.299], np.float32))[..., None]
    # Golden highlights, a breath of teal in the deepest shadows.
    hi = np.clip((lum - 0.45) / 0.55, 0, 1)
    lo = 1 - np.clip(lum / 0.25, 0, 1)
    a += hi * np.array([-0.04, 0.0, 0.05]) + lo * np.array([0.025, 0.012, -0.008])  # BGR
    a = lum + (a - lum) * 1.10
    a = np.clip(a, 0, 1)
    # Contrast: a gentle S, keeping the shadows open enough to read.
    a = a + 0.20 * a * (1 - a) * (2 * a - 1)
    # The sun's glow, as a lens sees it: a warm bloom around the disc.
    sx, sy = sun_xy
    d = np.sqrt((XX - sx) ** 2 + (YY - sy) ** 2)[..., None]
    bloom = np.exp(-(d / (70 * K)) ** 2) * 0.30 + np.exp(-(d / (260 * K)) ** 2) * 0.10
    a = 1 - (1 - a) * (1 - bloom * np.array([0.55, 0.80, 1.0]))
    # A light vignette.
    v = 1 - 0.24 * (((XX - W / 2) / (W / 2)) ** 2 + ((YY - H * 0.45) / (H * 0.6)) ** 2) ** 1.4
    a *= np.clip(v, 0.6, 1)[..., None]
    a = np.clip(a, 0, 1)
    # Clean shadows, as from a low-ISO sensor: edge-aware smoothing, deepest
    # tones only.
    a = a.astype(np.float32)
    clean = cv2.bilateralFilter(a, d=int(9 * K) | 1, sigmaColor=0.06, sigmaSpace=4 * K)
    lum = (a @ np.array([0.114, 0.587, 0.299], np.float32))[..., None]
    dark = 1 - np.clip((lum - 0.08) / 0.17, 0, 1)
    a = a * (1 - 0.7 * dark) + clean * 0.7 * dark
    # Capture sharpening on luminance, fine radius, capped so no halo forms.
    lab = cv2.cvtColor(a, cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    detail = np.clip(L - cv2.GaussianBlur(L, (0, 0), 0.9 * K), -4.0, 4.0)
    lab[..., 0] = np.clip(L + 0.9 * detail, 0, 100)
    a = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    # Only enough fine noise to dither the sky's gradient (no banding).
    a += np.random.default_rng(3).normal(0, 0.0035, a.shape).astype(np.float32)
    return np.clip(a, 0, 1)


def main():
    # Register on the original shots; warp the upscaled ones when present.
    tower, sun, wide = (cv2.imread(str(p)) for p in (TOWER, SUN, WIDE))
    print("registering")
    h_sun = homography(sun, tower)
    h_wide = homography(wide, tower)
    (tower_x, u_tower), (sun_x, u_sun), (wide_x, u_wide) = (source(p) for p in (TOWER, SUN, WIDE))

    s = W / tower.shape[1]
    T = np.array([[s, 0, 0], [0, s, -CROP_TOP * s], [0, 0, 1]])
    p_tower, v_tower = warp(tower_x, T @ u_tower)
    p_sun, v_sun = warp(sun_x, T @ h_sun @ u_sun)
    p_wide, v_wide = warp(wide_x, T @ h_wide @ u_wide)

    # The long zoom is a slightly different exposure: bring it to the tower
    # shot's colour where they overlap, so it adds detail, not a patch.
    p_sun = match_colour(p_sun, p_tower, v_sun)
    # Only trust it where the two agree (clouds drift, near things shift).
    agree = np.abs(cv2.GaussianBlur(p_sun, (0, 0), 6 * K) - cv2.GaussianBlur(p_tower, (0, 0), 6 * K)).sum(2)
    v_sun *= np.exp(-agree / 0.12)

    w_tower = exposedness(p_tower) * v_tower
    w_sun = exposedness(p_sun) * v_sun * 1.6  # the sharpest source: preferred
    w_wide = exposedness(p_wide) * v_wide * 0.8

    # The wide shot is still ~2.5x enlarged here: it lends light, not detail.
    fused = fuse([p_tower, p_sun, p_wide], [w_tower, w_sun, w_wide], first_level=[0, 0, 3])

    sun_xy = cv2.perspectiveTransform(np.float32([[[165.5, 358.7]]]), T)[0, 0]
    out = grade(fused, sun_xy)
    cv2.imwrite(str(OUTPUT), (out * 255 + 0.5).astype(np.uint8),
                [cv2.IMWRITE_JPEG_QUALITY, 97, cv2.IMWRITE_JPEG_SAMPLING_FACTOR, cv2.IMWRITE_JPEG_SAMPLING_FACTOR_444])
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
