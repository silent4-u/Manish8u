"""Remove the event tent from inauguration.jpg, leaving everything else alone.

The tent hides the middle of the portico, and a still photo cannot know what
is behind it. source.jpg can: it shows the same facade with no tent. So that
photo is registered onto this one (SIFT on the facade around the portico, a
RANSAC homography, since the facade is a plane), and the hidden part is taken
from it and blended in to match this photo's light. The thin tent
poles and bamboo rigging in front of the building are covered with the
pixels beside them.

    pip install opencv-python-headless numpy
    python3 media/kamal-municipality/remove_tent.py
"""

from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
TARGET = HERE / "inauguration.jpg"
DONOR = HERE / "source.jpg"
OUTPUT = HERE / "inauguration-clean.jpg"

# All coordinates are pixels in inauguration.jpg (4000 x 1848).

# Banner and purple canopy, plus the bamboo standing against the facade
# around it. Filled from the registered donor photo.
REPLACE = [
    np.array([(1268, 622), (2398, 564), (2444, 592), (2444, 1098), (2160, 1098),
              (2152, 1044), (1900, 1042), (1570, 1048), (1566, 1092), (1268, 1092)]),
    np.array([(2352, 318), (2410, 318), (2415, 640), (2356, 640)]),  # tall bamboo
]
REPLACE_LINES = [  # (points, width)
    ([(2395, 700), (2495, 678)], 22),
    ([(1200, 856), (1300, 850)], 20),
    ([(1200, 936), (1300, 932)], 20),
]

# The wall inside the portico sits behind the plane the homography is fitted
# to, so between the two viewpoints it shifts: measured on the ground-floor
# window frames it lands 19 px left on the left and 33 px left on the right,
# i.e. a slight horizontal compression. Applied after the homography.
BACK_WALL = np.array([[0.9806, 0, 9.7], [0, 1, -6], [0, 0, 1]])
PORTICO = (1258, 690, 2398, 1300)  # x0, y0, x1, y1 of the recessed wall
INNER_COLUMNS = [(1532, 1632), (1992, 2096)]  # incl. the back warp's copy

# Poles and rigging in front of the building. Each is found by colour inside
# a corridor, then covered with the pixels just beside it, which keeps the
# wall, steps and chairs behind it sharp where inpainting would smear it.
# Poles: (x, y0, y1); covered from the left, so they are listed left to right.
POLES = [
    (1302, 1040, 1455), (1387, 1090, 1430), (1455, 1090, 1350), (1505, 1090, 1350),
    (1547, 1090, 1350), (1905, 1040, 1300),
    (2166, 1090, 1305), (2202, 1090, 1300), (2240, 1090, 1300), (2307, 1090, 1300),
    (2421, 1090, 1475),
]
# Bamboo tied to the poles: (polyline, corridor width, copy-from offset).
ABOVE, LEFT = (0, 20), (22, 0)
BAMBOO = [
    ([(700, 1207), (1300, 1030)], 44, ABOVE),
    ([(180, 1162), (450, 1195), (700, 1220), (1000, 1216), (1310, 1200)], 44, ABOVE),
    ([(740, 1160), (1100, 1154), (1390, 1152), (1560, 1160)], 40, ABOVE),
    ([(1100, 1208), (1340, 1206)], 36, ABOVE),
    ([(2170, 1150), (2440, 1164)], 40, ABOVE),
    ([(2318, 1296), (2412, 1170)], 40, ABOVE),
    ([(2428, 1320), (2432, 1495)], 34, LEFT),  # foot of the right pole
]


def colour_mask(img, kind):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.int32)
    hh, ss, vv = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    if kind == "pole":  # navy / violet cloth
        return (hh >= 105) & (hh <= 150) & (ss > 70) & (vv > 15) & (vv < 160)
    # bamboo: tan and brown, plus its dark lashings
    tan = (hh >= 6) & (hh <= 32) & (ss > 35) & (vv > 50) & (vv < 225)
    return tan | ((vv < 70) & (ss < 120))


def cover(img, mask, shift):
    """Replace the masked pixels with the image shifted by `shift` (dx, dy)."""
    h, w = img.shape[:2]
    M = np.float32([[1, 0, shift[0]], [0, 1, shift[1]]])
    src = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
    a = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.5)[..., None]
    return img * (1 - a) + src * a


def remove_rigging(img, skip):
    out = img.astype(np.float32)
    h, w = img.shape[:2]
    for x, y0, y1 in POLES:
        corridor = np.zeros((h, w), bool)
        corridor[y0:y1, x - 20:x + 21] = True
        m = colour_mask(out.astype(np.uint8), "pole") & corridor & (skip == 0)
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((25, 3), np.uint8))
        # Lock onto the pole's own column, so an umbrella or balloon beside
        # it in the corridor is left alone.
        hist = m.sum(0)
        if hist.max() < 0.3 * (y1 - y0):
            continue
        xc = int(np.argmax(hist))
        band = np.zeros_like(m)
        band[:, xc - 9:xc + 10] = 1
        m &= band
        m = cv2.dilate(m, np.ones((5, 7), np.uint8)) > 0
        m &= corridor
        out = cover(out, m, (22, 0))  # copy from 22 px to the left
    for pts, width, shift in BAMBOO:
        corridor = np.zeros((h, w), np.uint8)
        cv2.polylines(corridor, [np.array(pts, np.int32)], False, 1, width)
        m = colour_mask(out.astype(np.uint8), "bamboo") & (corridor > 0) & (skip == 0)
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 15), np.uint8))
        m = (cv2.dilate(m, np.ones((5, 5), np.uint8)) > 0) & (corridor > 0)
        out = cover(out, m, shift)
    return np.clip(out, 0, 255).astype(np.uint8)


def draw_lines(mask, lines):
    for pts, width in lines:
        cv2.polylines(mask, [np.array(pts, np.int32)], False, 255, width, cv2.LINE_AA)
    return mask


def fill_smooth(values, known):
    """Push-pull fill: spread the known values smoothly into the unknown."""
    levels = []
    v, k = values * known[..., None], known.astype(np.float32)
    while min(k.shape) > 16:
        levels.append((v, k))
        v, k = cv2.pyrDown(v), cv2.pyrDown(k)
    filled = v / np.maximum(k, 1e-6)[..., None]
    for v, k in reversed(levels):
        up = cv2.pyrUp(filled, dstsize=(k.shape[1], k.shape[0]))
        mean = v / np.maximum(k, 1e-6)[..., None]
        wgt = np.clip(k * 2, 0, 1)[..., None]
        filled = mean * wgt + up * (1 - wgt)
    return filled


def blend(donor, target, mask):
    """Seamless paste: the donor's detail, with this photo's light and colour.

    The colour difference is measured on a ring just outside the mask and
    spread smoothly across it (a membrane, as in Poisson cloning). Ring pixels
    where the two photos show different things (a balloon, a person) are left
    out so they cannot tint the patch.
    """
    tb = cv2.GaussianBlur(target, (0, 0), 3).astype(np.float32)
    db = cv2.GaussianBlur(donor, (0, 0), 3).astype(np.float32)
    diff = tb - db
    ring = cv2.dilate(mask, np.ones((25, 25), np.uint8)) & ~mask
    known = (ring > 0) & (np.abs(diff).sum(2) < 70)
    offset = cv2.GaussianBlur(fill_smooth(diff, known), (0, 0), 8)
    patched = np.clip(donor.astype(np.float32) + offset, 0, 255)
    a = cv2.GaussianBlur(mask, (0, 0), 2.0).astype(np.float32)[..., None] / 255.0
    return (patched * a + target * (1 - a)).astype(np.uint8)


def register(donor, target):
    """Homography from donor to target, fitted on the facade near the portico."""
    g1 = cv2.cvtColor(donor, cv2.COLOR_BGR2GRAY)
    g2 = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
    roi = np.zeros(g2.shape, np.uint8)
    roi[200:1400, 900:2900] = 255
    cv2.rectangle(roi, (1280, 560), (2460, 1100), 0, -1)  # tent
    cv2.rectangle(roi, (1500, 1080), (2250, 1848), 0, -1)  # people
    sift = cv2.SIFT_create(20000)
    k1, d1 = sift.detectAndCompute(g1, None)
    k2, d2 = sift.detectAndCompute(g2, roi)
    matches = cv2.BFMatcher().knnMatch(d1, d2, k=2)
    good = [m for m, n in matches if m.distance < 0.72 * n.distance]
    p1 = np.float32([k1[m.queryIdx].pt for m in good])
    p2 = np.float32([k2[m.trainIdx].pt for m in good])
    H, inliers = cv2.findHomography(p1, p2, cv2.RANSAC, 4.0)
    print(f"registration: {int(inliers.sum())} inliers of {len(good)} matches")
    return H


def main():
    target = cv2.imread(str(TARGET))
    donor = cv2.imread(str(DONOR))
    h, w = target.shape[:2]

    H = register(donor, target)
    front = cv2.warpPerspective(donor, H, (w, h), flags=cv2.INTER_CUBIC)
    back = cv2.warpPerspective(donor, BACK_WALL @ H, (w, h), flags=cv2.INTER_CUBIC)
    # Inside the portico, below its beam, the wall is the recessed one;
    # the two inner columns stay on the front alignment.
    a = np.zeros((h, w), np.float32)
    a[PORTICO[1]:PORTICO[3], PORTICO[0]:PORTICO[2]] = 1
    for x0, x1 in INNER_COLUMNS:
        a[:, x0:x1] = 0
    a = cv2.GaussianBlur(a, (0, 0), 6)[..., None]
    warped = (front * (1 - a) + back * a).astype(np.uint8)

    # The donor is enlarged about 2x by the warp, so it is softer than this
    # phone photo: sharpen it and give it matching sensor grain.
    blur = cv2.GaussianBlur(warped, (0, 0), 2.0)
    warped = cv2.addWeighted(warped, 1.8, blur, -0.8, 0)
    noise = np.random.default_rng(7).normal(0, 2.2, warped.shape)
    warped = np.clip(warped + noise, 0, 255).astype(np.uint8)

    rep = np.zeros((h, w), np.uint8)
    for poly in REPLACE:
        cv2.fillPoly(rep, [poly.astype(np.int32)], 255)
    draw_lines(rep, REPLACE_LINES)

    out = blend(warped, target, rep)

    out = remove_rigging(out, rep)

    cv2.imwrite(str(OUTPUT), out, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
