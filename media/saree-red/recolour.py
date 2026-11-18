"""The saree and the blouse, recoloured red; the portrait polished, in 4K
and as an A4 landscape page.

photo.webp is a portrait in a blue and olive saree with cream paisley
motifs, and a pale mint blouse. The cloth is recoloured red, and
everything else (the skin, hair, bangles, wall and table) stays as it is:

  1. Where. A rough outline round the saree and blouse, drawn by eye,
     keeps the wall and table out. The face, the bangles and the blouse
     each have their own outline.
  2. Which. Inside it, each pixel is weighed by its colour (lightness,
     chroma and hue in Lab) as the saree's blue, its olive, or the blouse.
     The skin, hair, gold and the cream motifs match none of these, so they
     are left alone. The weights are soft, so edges blend.
  3. Red. The weighed pixels are given a red hue and chroma, and keep
     their own lightness, so every fold, shadow and thread of the weave
     stays.
     - The blue becomes a rich red, a touch lighter than the blue was.
     - The olive becomes a deep red, as full as the rest. It is darker
       cloth, so it needs more chroma to read as red, not a dusty pink.
     - The motifs on the pallu, and its light sheen, share the olive's hue
       but are lighter. They keep their lightness and chroma, and are only
       turned from greenish to the warm cream of the other motifs: cream
       motifs and a gold shine on the red.
     - The blouse becomes a soft red.
     - The cream motifs elsewhere stay as they are.

  4. The sparkle. The Gemini sparkle at the lower right lies on the
     table. It is found by its brightness against the table (MARK is
     where to look), and filled in by LaMa (../old-photo/deep_clean.py)
     from the table round it.

  5. Polish. The shadows and mid-tones are lifted a little (white and
     black stay put). The cloth and wall get a little local contrast,
     eased on skin so the face stays soft. Faint colours get a little
     more depth, and the skin is kept as it is.

  6. 4K. Real-ESRGAN (../sunset/upscale.py) enlarges it 4x, blended half
     and half with a plain Lanczos enlargement, so it is crisp without the
     waxy skin a GAN gives on its own. It is then taken to 3840 px wide
     (the photo is not quite 16:9, so 3840 x 2194 keeps all of it),
     sharpened lightly on lightness alone, and given a fine grain.

  7. A4. A4 landscape (297 x 210 mm) is narrower than the photo (1.41:1
     against 7:4). So a strip of plain wall is cut from each side (PAGE),
     and room is added above her head and below her arms. Her head drape
     touched the top edge, so the extra headroom also frames her better.
     - Above, the wall is mirrored up: the balustrade and the panel
       mouldings carry on as they would. Where the mirror would bring the
       saree, LaMa fills in wall from round about instead.
     - Below, LaMa carries the table on.
     The page is then enlarged as for 4K, to 3508 x 2480, A4 at 300 dpi.

  saree-red.jpg          the portrait, saree and blouse in red, no sparkle
  saree-red-4k.jpg       the same in 4K, 3840 x 2194
  saree-red-a4.jpg/.pdf  an A4 landscape page, 3508 x 2480 at 300 dpi
  before-after.jpg       the photo and the A4 page side by side

    pip install numpy opencv-python-headless onnx onnxruntime pillow
    python3 media/saree-red/recolour.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "old-photo"))
sys.path.insert(0, str(HERE.parent / "sunset"))
import onnxruntime as ort  # noqa: E402
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402

SOURCE = HERE / "photo.webp"
MARK = (1250, 675, 1325, 750)      # where the sparkle is (x0, y0, x1, y1)
WIDTH_4K = 3840
A4 = (3508, 2480)                  # 297 x 210 mm at 300 dpi, landscape
PAGE = (85, 1313, 72, 28)          # A4: the columns kept (x0, x1), the rows added above and below
GAN_SHARE = 0.5                    # Real-ESRGAN's share of the enlargement

# Outlines, drawn by eye on the 1344 x 768 photo.
SAREE = [(330, 140), (470, 90), (620, 35), (700, 12), (800, 12), (870, 42), (950, 112), (1010, 172),
         (1062, 222), (1088, 262), (1080, 330), (1088, 430), (1122, 508), (1152, 556), (1125, 615),
         (1080, 648), (1000, 658), (900, 662), (780, 664), (700, 668), (600, 668), (500, 664),
         (400, 664), (340, 668), (240, 664), (160, 628), (148, 560), (182, 450), (222, 330),
         (248, 280), (300, 258), (328, 228)]
BLOUSE = [[(425, 325), (615, 315), (650, 430), (620, 625), (425, 625), (412, 450)],
          [(815, 270), (885, 270), (885, 405), (815, 405)]]
FACE = ((757, 200), (116, 148))              # an ellipse: centre, half-axes
BANGLES = [[(272, 455), (390, 445), (405, 545), (300, 570), (268, 520)],
           [(1135, 432), (1250, 432), (1250, 520), (1135, 520)]]
HEAD = [(450, 0), (1000, 0), (1000, 200), (450, 200)]      # where she reaches the top edge

# The new colours: Lab hue (degrees) and chroma. Lightness is the photo's own.
# Each with how lightness changes: L * scale + offset.
RED = (30, 50, (1.2, 2))           # for the blue: a rich red, a touch lighter
DEEP_RED = (28, 52, (0.92, 0))     # for the olive: deep, and as full as the rest
SOFT_RED = (25, 36, (0.82, 0))     # for the blouse
CREAM = 85                         # hue for the pallu's motifs and sheen, as the other motifs


def poly_mask(shape, polys):
    m = np.zeros(shape, np.uint8)
    for p in polys:
        cv2.fillPoly(m, [np.array(p, np.int32)], 1)
    return m > 0


def ramp(x, lo, hi):
    """0 below lo, 1 above hi, smooth between."""
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def band(x, lo, hi, soft):
    return ramp(x, lo - soft, lo + soft) * (1 - ramp(x, hi - soft, hi + soft))


def regions(shape):
    h, w = shape
    saree = poly_mask(shape, [SAREE])
    face = np.zeros(shape, np.uint8)
    cv2.ellipse(face, FACE[0], FACE[1], 0, 0, 360, 1, -1)
    keep = (face > 0) | poly_mask(shape, BANGLES)
    blouse = poly_mask(shape, BLOUSE)
    soft = lambda m: cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.5)
    return soft(saree & ~keep), soft(blouse & ~keep)


def weights(L, C, hue, saree, blouse):
    """How much each pixel is the saree's blue, its olive, the light olive
    (the pallu's motifs and sheen), or the blouse."""
    blue = band(hue, 190, 315, 12) * ramp(C, 2, 6) * saree
    pale = band(hue, 110, 215, 10) * (1 - ramp(C, 18, 24)) * ramp(L, 42, 50) * blouse
    olive = band(hue, 90, 135, 4) * ramp(C, 4, 8) * (1 - ramp(C, 26, 32)) * saree * (1 - pale)
    # The pallu's motifs and its sheen share the olive's hue, but are lighter.
    # (Lightness smoothed a little, so the weave's grain does not mottle it.)
    light = ramp(cv2.GaussianBlur(L, (0, 0), 1.5), 45, 58)
    blur = lambda m: cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.7)
    return blur(blue), blur(olive * (1 - light)), blur(olive * light), blur(pale)


def paint(L, A, B, w, colour):
    """Blend towards a hue and chroma, by weight w. Darker cloth gets less
    chroma, as real dyed cloth does in shadow."""
    hue, chroma, (scale, offset) = colour
    Lt = np.clip(L * scale + offset, 0, 100)
    c = chroma * np.clip((Lt + 10) / 50, 0.35, 1.1)
    At, Bt = c * np.cos(np.radians(hue)), c * np.sin(np.radians(hue))
    return L + w * (Lt - L), A + w * (At - A), B + w * (Bt - B)


def turn(A, B, w, hue):
    """Turn the hue, by weight w, keeping the chroma."""
    c = np.hypot(A, B)
    At, Bt = c * np.cos(np.radians(hue)), c * np.sin(np.radians(hue))
    return A + w * (At - A), B + w * (Bt - B)


def recolour(bgr):
    lab = cv2.cvtColor(bgr.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    C, hue = np.hypot(A, B), np.degrees(np.arctan2(B, A)) % 360
    saree, blouse = regions(L.shape)
    w_blue, w_olive, w_light, w_pale = weights(L, C, hue, saree, blouse)
    L, A, B = paint(L, A, B, w_blue, RED)
    L, A, B = paint(L, A, B, w_olive, DEEP_RED)
    A, B = turn(A, B, w_light, CREAM)
    L, A, B = paint(L, A, B, w_pale, SOFT_RED)
    out = cv2.cvtColor(np.dstack([L, A, B]).astype(np.float32), cv2.COLOR_LAB2BGR)
    return np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8)


def unmark(bgr, lama):
    """The sparkle filled in from the table round it."""
    x0, y0, x1, y1 = MARK
    L = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32)
    box = L[y0:y1, x0:x1]
    # The table round the sparkle: the box's border, below the table's edge.
    table = np.median(box[-8:])
    mark = np.zeros(L.shape, np.uint8)
    mark[y0:y1, x0:x1] = box > table + 18
    mark = cv2.dilate(mark, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))) > 0
    print(f"sparkle: {mark.sum()} px")
    return lama.fill(bgr, mark)


def polish(bgr, lift=0.35, clarity=0.3, vibrance=0.12):
    """Shadows and mid-tones lifted a little; local contrast on the cloth
    and wall, eased on skin; faint colours a little deeper, skin kept."""
    lab = cv2.cvtColor(bgr.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
    L, A, B = lab[..., 0] / 100, lab[..., 1], lab[..., 2]
    C, hue = np.hypot(A, B), np.degrees(np.arctan2(B, A)) % 360
    skin = cv2.GaussianBlur(((hue > 35) & (hue < 72) & (C > 18) & (C < 45)).astype(np.float32), (0, 0), 3)
    L = L + lift * L * (1 - L) ** 2
    L = L + clarity * (1 - 0.8 * skin) * (L - cv2.bilateralFilter(L.astype(np.float32), 0, 0.08, 6))
    k = 1 + vibrance * (1 - np.clip(C / 40, 0, 1)) * (1 - 0.7 * skin)
    out = cv2.cvtColor(np.dstack([np.clip(L, 0, 1) * 100, A * k, B * k]).astype(np.float32), cv2.COLOR_LAB2BGR)
    return np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8)


def frame_a4(bgr, lama):
    """The photo framed for A4 landscape: a strip of wall cut from each side,
    the wall carried on above her head and the table below her arms."""
    x0, x1, top, bottom = PAGE
    h = bgr.shape[0]
    # Near the top edge, what is not wall: the saree, her hair and skin.
    lab = cv2.cvtColor(bgr.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
    C, hue = np.hypot(lab[..., 1], lab[..., 2]), np.degrees(np.arctan2(lab[..., 2], lab[..., 1])) % 360
    other = cv2.morphologyEx(((C < 22) | (hue < 55) | (hue > 95)).astype(np.uint8), cv2.MORPH_OPEN,
                             np.ones((5, 5), np.uint8))
    other = (cv2.dilate(other, np.ones((9, 9), np.uint8)) > 0) & poly_mask(other.shape, [HEAD])
    other = (other | poly_mask(other.shape, [SAREE]))[:, x0:x1]
    crop = bgr[:, x0:x1]
    # Above, the wall mirrored up; LaMa where the mirror would bring the saree.
    # Below, the table by LaMa.
    canvas = np.vstack([crop[:top][::-1], crop, np.repeat(crop[-1:], bottom, axis=0)])
    hole = np.zeros(canvas.shape[:2], bool)
    hole[:top] = cv2.dilate(other[:top][::-1].astype(np.uint8), np.ones((11, 11), np.uint8)) > 0
    hole[top + h:] = True
    return lama.fill(canvas, hole)


def enlarge(bgr, size):
    """Real-ESRGAN 4x blended with Lanczos, down to `size` (w, h); a light
    unsharp on lightness alone, and a fine grain."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    gan = sr.upscale_tiled(sess, bgr).astype(np.float32) / 255
    plain = cv2.resize(bgr, (gan.shape[1], gan.shape[0]), interpolation=cv2.INTER_LANCZOS4).astype(np.float32) / 255
    big = cv2.resize(GAN_SHARE * gan + (1 - GAN_SHARE) * plain, size, interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(np.clip(big, 0, 1).astype(np.float32), cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    L = L + 0.3 * (L - cv2.GaussianBlur(L, (0, 0), 1.6))
    rng = np.random.default_rng(3)
    L = L + cv2.GaussianBlur(rng.standard_normal(L.shape).astype(np.float32), (0, 0), 0.7) * 0.8
    lab[..., 0] = np.clip(L, 0, 100)
    out = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    return np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8)


def side_by_side(before, after, height=868, gap=16):
    fit = lambda x: cv2.resize(x, (round(x.shape[1] * height / x.shape[0]), height), interpolation=cv2.INTER_AREA)
    return np.hstack([fit(before), np.full((height, gap, 3), 255, np.uint8), fit(after)])


def main():
    img = cv2.imread(str(SOURCE))
    lama = Lama()
    red = recolour(unmark(img, lama))
    out = polish(red)
    cv2.imwrite(str(HERE / "saree-red.jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 96])
    print(f"wrote saree-red.jpg ({out.shape[1]} x {out.shape[0]})")
    big = enlarge(out, (WIDTH_4K, round(WIDTH_4K * out.shape[0] / out.shape[1])))
    cv2.imwrite(str(HERE / "saree-red-4k.jpg"), big, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"wrote saree-red-4k.jpg ({big.shape[1]} x {big.shape[0]})")
    page = enlarge(polish(frame_a4(red, lama)), A4)
    rgb = Image.fromarray(cv2.cvtColor(page, cv2.COLOR_BGR2RGB))
    rgb.save(HERE / "saree-red-a4.jpg", quality=95, dpi=(300, 300))
    rgb.save(HERE / "saree-red-a4.pdf", resolution=300)
    print(f"wrote saree-red-a4.jpg and .pdf ({page.shape[1]} x {page.shape[0]}, A4 landscape at 300 dpi)")
    cv2.imwrite(str(HERE / "before-after.jpg"), side_by_side(img, page), [cv2.IMWRITE_JPEG_QUALITY, 92])


if __name__ == "__main__":
    main()
