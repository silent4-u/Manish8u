"""The Cliff's certificate of bravery, from a phone photo to a straight,
clean A4 page.

photo.jpg is the certificate photographed at a slight angle: tilted, wider
at the bottom than the top, with the jump card lying on its top-left corner,
and its lower edge and a sliver of its right side just outside the picture.

  1. Straight. The certificate's thin white frame (its top and two sides)
     and the top edge of the white name box are found and fitted as lines.
     They are straight and square on the paper, so the perspective that
     maps their four meeting points to a rectangle straightens the whole
     page.
  2. A4. The paper's edges sit just outside the frame (MARGIN, measured at
     its left and top-right edges). The page is cut at those edges and made
     exactly A4, 210 x 297 mm: the top margin matches the sides, and the
     height follows from the width.
  3. Clean. The JPEG's noise is smoothed. The photo was taken in bluish
     light (the name box, the white lettering and the jump card are all
     equally blue), so the colour is balanced until the name box reads
     white. The green keeps its own shading: it is printed darker towards
     the lower left (the white lettering there is as bright as elsewhere,
     so this is not a shadow).
  4. Whole. A thin sliver at the right and top edges lay outside the photo.
     LaMa (../old-photo/deep_clean.py) fills it in from the page around it.
     The foot of the page, below the silhouettes, was also outside the
     photo. There the green is carried on, column by column, and so is the
     dark corner at the lower left, along its straight edge. The
     silhouettes fade out where the photo ends: what lies below them is not
     in the photo, so nothing is made up for it.
  5. Print. The page is enlarged to 2480 x 3508 pixels, A4 at 300 dpi, with
     Real-ESRGAN (../sunset/upscale.py) blended with a plain enlargement so
     the lettering is crisp. The text is sharpened lightly. It is saved as
     a JPEG and as a one-page PDF, both marked 300 dpi.

The name, the date and the bungy master's signature are the photo's own,
unchanged.

  certificate-a4.jpg / .pdf    the page, A4 at 300 dpi
  before-after.jpg             the photo and the page side by side

The jump card stays where it lay. It hides the top of the photo of the
jumper on the certificate, and that cannot be recovered from this photo.

    pip install numpy opencv-python-headless onnx onnxruntime pillow
    python3 media/bungy-certificate/make_a4.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
sys.path.insert(0, str(HERE.parent / "old-photo"))
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402

SOURCE = HERE / "photo.jpg"
A4 = (2480, 3508)              # 210 x 297 mm at 300 dpi
MARGIN = 43                    # paper edge to the frame, in the straightened photo's pixels
GAN_SHARE = 0.6                # Real-ESRGAN's share of the enlargement

# Where to look for each line in the photo (x0, y0, x1, y1), and which way it runs.
LINES = {
    "top": ((470, 25, 1025, 60), False),
    "left": ((30, 300, 85, 1045), True),
    "right": ((1020, 50, 1100, 995), True),
    "namebox": ((260, 935, 900, 990), False),
}
# Where the dark corner's edge shows at the lower left, in the straightened page.
CORNER = (0, 1330, 250, 1460)
FADE = 1.5                     # how quickly the silhouettes fade out below the photo, px


def fit_line(white, region, vertical):
    """A thin bright line in `region`, fitted: per row (or column) the middle
    of its few white pixels, then a robust straight line through them."""
    x0, y0, x1, y1 = region
    ys, xs = np.nonzero(white[y0:y1, x0:x1])
    ys, xs = ys + y0, xs + x0
    pts = []
    for v in range(y0, y1) if vertical else range(x0, x1):
        sel = xs[ys == v] if vertical else ys[xs == v]
        if 0 < len(sel) <= 8:
            pts.append((np.median(sel), v) if vertical else (v, np.median(sel)))
    return cv2.fitLine(np.array(pts, np.float32), cv2.DIST_HUBER, 0, 0.01, 0.01).flatten()


def meet(a, b):
    (vx1, vy1, x1, y1), (vx2, vy2, x2, y2) = a, b
    t = np.linalg.solve(np.array([[vx1, -vx2], [vy1, -vy2]]), [x2 - x1, y2 - y1])
    return np.array([x1 + t[0] * vx1, y1 + t[0] * vy1], np.float32)


def straighten(img):
    """The page, straightened and cut to A4 at the photo's own scale, and
    where the photo covered it (bool)."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    white = ((hsv[..., 1] < 60) & (hsv[..., 2] > 200)).astype(np.uint8)
    L = {k: fit_line(white, r, v) for k, (r, v) in LINES.items()}
    tl, tr = meet(L["top"], L["left"]), meet(L["top"], L["right"])
    bl, br = meet(L["namebox"], L["left"]), meet(L["namebox"], L["right"])
    w = (np.linalg.norm(tr - tl) + np.linalg.norm(br - bl)) / 2
    h = (np.linalg.norm(bl - tl) + np.linalg.norm(br - tr)) / 2
    # The page: the frame inset MARGIN from its edges, the height A4's.
    pw = w + 2 * MARGIN
    ph = pw * A4[1] / A4[0]
    frame = np.float32([[MARGIN, MARGIN], [MARGIN + w, MARGIN], [MARGIN + w, MARGIN + h], [MARGIN, MARGIN + h]])
    H = cv2.getPerspectiveTransform(np.float32([tl, tr, br, bl]), frame)
    size = (int(round(pw)), int(round(ph)))
    page = cv2.warpPerspective(img, H, size, flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    seen = cv2.warpPerspective(np.full(img.shape[:2], 255, np.uint8), H, size, flags=cv2.INTER_NEAREST) > 0
    seen = cv2.erode(seen.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    print(f"frame {w:.0f} x {h:.0f} px; page {size[0]} x {size[1]} px at the photo's scale")
    return page, seen


def clean(page):
    """JPEG noise smoothed; the colour balanced on the name box's white."""
    page = cv2.fastNlMeansDenoisingColored(page, None, 3, 5, 7, 21)
    hsv = cv2.cvtColor(page, cv2.COLOR_BGR2HSV)
    paper = (hsv[..., 1] < 70) & (hsv[..., 2] > 200)
    # The name box: the largest white area in the middle of the page.
    h, w = paper.shape
    box = np.zeros_like(paper)
    box[int(0.55 * h):int(0.65 * h), int(0.25 * w):int(0.8 * w)] = True
    ref = np.median(page[paper & box].astype(np.float32), axis=0)
    gain = 245 / ref
    print(f"name box {ref.round()} (BGR); white balance x{gain.round(2)}")
    return np.clip(page.astype(np.float32) * gain, 0, 255).astype(np.uint8)


def green(page):
    hsv = cv2.cvtColor(page, cv2.COLOR_BGR2HSV)
    return (hsv[..., 0] >= 38) & (hsv[..., 0] <= 62) & (hsv[..., 1] > 100) & (hsv[..., 2] > 50)


def foot(page, seen):
    """The foot of the page below the photo's lower edge: the green carried
    down from just above, column by column, and the dark corner along its
    edge; whatever crosses the photo's edge fades into them."""
    h, w = seen.shape
    xs = np.arange(w)
    # The photo's lower edge is a straight line on the page.
    mid = xs[w // 10:-w // 10]
    k, c = np.polyfit(mid, [np.nonzero(seen[:, x])[0].max() for x in mid], 1)
    line = k * xs + c - 1                              # kept sub-pixel, so the fade has no steps
    edge = np.floor(line).astype(int)
    # The green just above the edge, per column, smoothed along the page.
    g = green(page)
    base = np.full((w, 3), np.nan, np.float32)
    for x in xs:
        rows = np.arange(edge[x] - 30, edge[x] - 4)
        sel = rows[g[rows, x]]
        if len(sel) > 8:
            base[x] = np.median(page[sel, x], axis=0)
    for ch in range(3):
        ok = ~np.isnan(base[:, ch])
        base[:, ch] = np.interp(xs, xs[ok], base[ok, ch])
    base = cv2.GaussianBlur(base[None], (0, 0), 20)[0]
    # The dark corner: its edge fitted, its colour taken from inside it.
    x0, y0, x1, y1 = CORNER
    dark = cv2.cvtColor(page, cv2.COLOR_BGR2LAB)[..., 0] < 70
    pts = [(np.nonzero(dark[y, x0:x1])[0].max() + x0, y) for y in range(y0, y1)
           if dark[y, x0:x1].any() and seen[y, x0:x1].all()]
    a, b = np.polyfit([p[1] for p in pts], [p[0] for p in pts], 1)
    yy, xx = np.mgrid[0:h, 0:w]
    inside = (a * yy + b - xx) / np.hypot(1, a)        # px inside the corner's edge
    corner = np.median(page[(inside > 4) & seen & (yy > y0)], axis=0)
    print(f"dark corner edge x = {a:.3f} y + {b:.1f}, colour {corner.round()} (BGR)")
    alpha = np.clip(0.5 + inside / 1.5, 0, 1)[..., None]
    fill = (1 - alpha) * base[None] + alpha * corner
    # Below the edge, the photo's last row fades into the fill.
    out = page.astype(np.float32)
    below = yy > edge[None]
    fade = np.exp(-np.maximum(yy - line[None], 0) / FADE)[..., None]
    last = (out[edge, xs] + out[edge - 1, xs]) / 2
    last = cv2.GaussianBlur(last[None], (0, 0), 1.5)
    out = np.where(below[..., None], fade * last + (1 - fade) * fill, out)
    return np.clip(out, 0, 255).astype(np.uint8)


def enlarge(page):
    """Real-ESRGAN 4x blended with Lanczos, then to A4 at 300 dpi; the
    lettering sharpened lightly on lightness."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    gan = sr.upscale_tiled(sess, page).astype(np.float32)
    plain = cv2.resize(page, (gan.shape[1], gan.shape[0]), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    big = cv2.resize(GAN_SHARE * gan + (1 - GAN_SHARE) * plain, A4, interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(np.clip(big, 0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0]
    lab[..., 0] = np.clip(L + 0.5 * (L - cv2.GaussianBlur(L, (0, 0), 2.0)), 0, 255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR)


def save(page, stem):
    rgb = Image.fromarray(cv2.cvtColor(page, cv2.COLOR_BGR2RGB))
    rgb.save(HERE / f"{stem}.jpg", quality=95, dpi=(300, 300))
    rgb.save(HERE / f"{stem}.pdf", resolution=300)
    print(f"wrote {stem}.jpg and {stem}.pdf ({page.shape[1]} x {page.shape[0]}, A4 at 300 dpi)")


def side_by_side(before, after, height=1500):
    fit = lambda x: cv2.resize(x, (round(x.shape[1] * height / x.shape[0]), height), interpolation=cv2.INTER_AREA)
    return np.hstack([fit(before), np.full((height, 24, 3), 255, np.uint8), fit(after)])


def main():
    img = cv2.imread(str(SOURCE))
    page, seen = straighten(img)
    page = clean(page)
    page = foot(Lama().fill(page, ~seen), seen)          # the strips outside the photo
    a4 = enlarge(page)
    save(a4, "certificate-a4")
    cv2.imwrite(str(HERE / "before-after.jpg"), side_by_side(img, a4), [cv2.IMWRITE_JPEG_QUALITY, 90])


if __name__ == "__main__":
    main()
