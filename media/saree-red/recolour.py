"""The saree and the blouse, recoloured red.

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
     - The olive becomes a deeper red, so the saree stays two-toned.
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

  5. 4K. Real-ESRGAN (../sunset/upscale.py) enlarges it 4x, blended half
     and half with a plain Lanczos enlargement, so it is crisp without the
     waxy skin a GAN gives on its own. It is then taken to 3840 px wide
     (the photo is not quite 16:9, so 3840 x 2194 keeps all of it),
     sharpened lightly on lightness alone, and given a fine grain.

  saree-red.jpg      the portrait, saree and blouse in red, no sparkle
  saree-red-4k.jpg   the same in 4K, 3840 x 2194
  before-after.jpg   the photo and the new one side by side

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/saree-red/recolour.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "old-photo"))
sys.path.insert(0, str(HERE.parent / "sunset"))
import onnxruntime as ort  # noqa: E402
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402

SOURCE = HERE / "photo.webp"
MARK = (1250, 675, 1325, 750)      # where the sparkle is (x0, y0, x1, y1)
WIDTH_4K = 3840
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

# The new colours: Lab hue (degrees) and chroma. Lightness is the photo's own.
# Each with how lightness changes: L * scale + offset.
RED = (30, 50, (1.2, 2))           # for the blue: a rich red, a touch lighter
DEEP_RED = (27, 40, (0.85, 0))     # for the olive: deeper, so the saree stays two-toned
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


def unmark(bgr):
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
    return Lama().fill(bgr, mark)


def enlarge(bgr):
    """Real-ESRGAN 4x blended with Lanczos, down to 4K; a light unsharp on
    lightness alone, and a fine grain."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    gan = sr.upscale_tiled(sess, bgr).astype(np.float32) / 255
    plain = cv2.resize(bgr, (gan.shape[1], gan.shape[0]), interpolation=cv2.INTER_LANCZOS4).astype(np.float32) / 255
    size = (WIDTH_4K, round(WIDTH_4K * bgr.shape[0] / bgr.shape[1]))
    big = cv2.resize(GAN_SHARE * gan + (1 - GAN_SHARE) * plain, size, interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(np.clip(big, 0, 1).astype(np.float32), cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    L = L + 0.3 * (L - cv2.GaussianBlur(L, (0, 0), 1.6))
    rng = np.random.default_rng(3)
    L = L + cv2.GaussianBlur(rng.standard_normal(L.shape).astype(np.float32), (0, 0), 0.7) * 0.8
    lab[..., 0] = np.clip(L, 0, 100)
    out = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    return np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8)


def side_by_side(before, after, gap=16):
    return np.hstack([before, np.full((before.shape[0], gap, 3), 255, np.uint8), after])


def main():
    img = cv2.imread(str(SOURCE))
    out = recolour(unmark(img))
    cv2.imwrite(str(HERE / "saree-red.jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 96])
    cv2.imwrite(str(HERE / "before-after.jpg"), side_by_side(img, out), [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(f"wrote saree-red.jpg ({out.shape[1]} x {out.shape[0]}) and before-after.jpg")
    big = enlarge(out)
    cv2.imwrite(str(HERE / "saree-red-4k.jpg"), big, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"wrote saree-red-4k.jpg ({big.shape[1]} x {big.shape[0]})")


if __name__ == "__main__":
    main()
