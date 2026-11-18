"""Regenerate the six-friends photo with the models this machine can run.

regenerate.py redraws the whole picture with Stable Diffusion, but its
weights live on Hugging Face, which the cloud sessions cannot reach. This
script makes the regenerated look from models that are already cached:

  1. Start from the cleaned print (restore_print.py), recoloured the same
     way, and heal two last marks on faces that a face model would otherwise
     draw as a scar or a blemish.
  2. Redraw the detail of the whole picture with RealESRGAN_x4plus alone
     (restore_print.py blends it 50/50 with a plain enlargement to stay
     close to the print; here it is used in full for a crisp, new look).
  3. Regenerate each face with CodeFormer at high fidelity (FIDELITY), from
     the enlarged picture, aligned to its five landmarks. Each new face is
     colour-matched to the picture and blended in through a feathered
     ellipse, so hair edges, the cap and the neighbours stay as they are.
     Run on the cleaned print, CodeFormer keeps the fourth boy's glasses;
     on the stained print it had erased them.
  4. A fine grain, then the same print sizes as restore_print.py:

       friends-ai-7x5.jpg   4200 x 3000  14x10 in at 300 dpi; 7x5, 10x7, A4
       friends-ai-3x2.jpg   3600 x 2400  12x8 in at 300 dpi; 6x4, 9x6

    pip install numpy opencv-python-headless onnx onnxruntime pillow
    python3 media/old-photo/regenerate_faces.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
sys.path.insert(0, str(HERE))
import upscale as sr  # noqa: E402
from deep_clean import Lama  # noqa: E402
from restore import CACHE, detect_faces, session  # noqa: E402
from restore_print import CLEANED, CROP, SOURCE, recolour, save_print  # noqa: E402

OUT_7X5 = HERE / "friends-ai-7x5.jpg"
OUT_3X2 = HERE / "friends-ai-3x2.jpg"
COMPARE = HERE / "ai-before-after.jpg"
PRINT_7X5 = HERE / "friends-print-7x5.jpg"
FIDELITY = 0.8          # CodeFormer: 1 keeps closest to the input face, 0 redraws most
WIDTH, HEIGHT = 4200, 3000

# Last marks on faces, (x, y, radius) in friends-b.jpg: a brown arc under the
# sixth boy's eye, and a scratch on the second boy's cheek.
HEAL = [(1379, 199, 6), (508, 305, 4)]

# Five-point face template for 512 x 512 crops (FFHQ alignment).
TEMPLATE = np.array([[192.98138, 239.94708], [318.90277, 240.1936], [256.63416, 314.01935],
                     [201.26117, 371.41043], [313.08905, 371.15118]], np.float32)


def face_mask():
    """Where a new face replaces the old one, in template space: forehead
    to chin, cheek to cheek, feathered."""
    m = np.zeros((512, 512), np.float32)
    cv2.ellipse(m, (256, 300), (150, 190), 0, 0, 360, 1, -1)
    return cv2.GaussianBlur(m, (0, 0), 18)


def codeformer(sess, crop):
    x = (cv2.cvtColor(crop, cv2.COLOR_BGR2RGB).astype(np.float32) / 255 - 0.5) / 0.5
    y = sess.run(None, {"input": x.transpose(2, 0, 1)[None], "weight": np.array(FIDELITY, np.float64)})[0][0]
    y = (np.clip(y.transpose(1, 2, 0), -1, 1) + 1) / 2
    return cv2.cvtColor((y * 255 + 0.5).astype(np.uint8), cv2.COLOR_RGB2BGR)


def match_colour(new, ref, mask, strength=0.7):
    """Shift the new face's Lab mean and spread toward the old one's."""
    a = cv2.cvtColor(new, cv2.COLOR_BGR2LAB).astype(np.float32)
    b = cv2.cvtColor(ref, cv2.COLOR_BGR2LAB).astype(np.float32)
    w = mask > 0.5
    for c in range(3):
        ma, sa = a[..., c][w].mean(), a[..., c][w].std() + 1e-3
        mb, sb = b[..., c][w].mean(), b[..., c][w].std() + 1e-3
        target = (a[..., c] - ma) * (sb / sa) + mb
        a[..., c] = a[..., c] + (target - a[..., c]) * strength
    return cv2.cvtColor(np.clip(a, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)


def regenerate_faces(big, faces, scale, offset):
    sess = session("codeformer.onnx")
    mask = face_mask()
    out = big.astype(np.float32)
    h, w = big.shape[:2]
    for _, pts, _ in faces:
        p = ((pts - offset) * scale).astype(np.float32)
        M, _ = cv2.estimateAffinePartial2D(p, TEMPLATE, method=cv2.LMEDS)
        crop = cv2.warpAffine(big, M, (512, 512), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_REFLECT)
        new = match_colour(codeformer(sess, crop), crop, mask)
        Minv = cv2.invertAffineTransform(M)
        face = cv2.warpAffine(new, Minv, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        a = cv2.warpAffine(mask, Minv, (w, h), flags=cv2.INTER_LINEAR)[..., None]
        out = out * (1 - a) + face.astype(np.float32) * a
    return np.clip(out, 0, 255).astype(np.uint8)


def main():
    if not (CACHE / "codeformer.onnx").exists():
        print("codeformer.onnx downloads from the facefusion assets on first use")
    col = recolour(cv2.imread(str(CLEANED)))
    heal = np.zeros(col.shape[:2], np.uint8)
    for x, y, r in HEAL:
        cv2.circle(heal, (x, y), r, 1, -1)
    col = Lama().fill(col, heal > 0)
    x0, y0, x1, y1 = CROP
    print("enlarging with RealESRGAN_x4plus")
    heavy = ort.InferenceSession(sr.build_rrdb(sr.load_pth(sr.CACHE / sr.X4PLUS[1])).SerializeToString(),
                                 providers=["CPUExecutionProvider"])
    big = sr.upscale_tiled(heavy, col[y0:y1, x0:x1])
    big = cv2.resize(big, (WIDTH, HEIGHT), interpolation=cv2.INTER_AREA)
    print("regenerating faces with CodeFormer")
    faces = detect_faces(cv2.imread(str(SOURCE)))
    scale = np.array([WIDTH / (x1 - x0), HEIGHT / (y1 - y0)], np.float32)
    big = regenerate_faces(big, faces, scale, np.array([x0, y0], np.float32))
    grain = cv2.GaussianBlur(np.random.default_rng(11).normal(0, 2.2, big.shape[:2]).astype(np.float32), (0, 0), 0.8)
    big = np.clip(big.astype(np.float32) + grain[..., None], 0, 255).astype(np.uint8)
    save_print(big, OUT_7X5)
    save_print(cv2.resize(big[80:2880], (3600, 2400), interpolation=cv2.INTER_AREA), OUT_3X2)
    # Side by side with the cleaned print, and the faces up close.
    before = cv2.imread(str(PRINT_7X5))
    half = lambda im: cv2.resize(im, (1400, 1000), interpolation=cv2.INTER_AREA)
    top = np.hstack([half(before), np.full((1000, 16, 3), 255, np.uint8), half(big)])
    fy0, fy1, fx0, fx1 = 330, 1330, 760, 3960      # the row of faces
    strip = lambda im: cv2.resize(im[fy0:fy1, fx0:fx1], (1408, 440), interpolation=cv2.INTER_AREA)
    bottom = np.hstack([strip(before), np.full((440, 8, 3), 255, np.uint8), strip(big)])
    bottom = cv2.resize(bottom, (top.shape[1], int(bottom.shape[0] * top.shape[1] / bottom.shape[1])))
    sheet = np.vstack([top, np.full((16, top.shape[1], 3), 255, np.uint8), bottom])
    for x, t in ((24, "CLEANED"), (1440, "REGENERATED")):
        cv2.putText(sheet, t, (x, 60), cv2.FONT_HERSHEY_DUPLEX, 1.5, (0, 0, 0), 6, cv2.LINE_AA)
        cv2.putText(sheet, t, (x, 60), cv2.FONT_HERSHEY_DUPLEX, 1.5, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.imwrite(str(COMPARE), sheet, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"wrote {COMPARE.name}")


if __name__ == "__main__":
    main()
