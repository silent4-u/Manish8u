"""Two friends on a garden path: brightened, cleared and enlarged to 4K.

before.jpg is a phone photo that has been through a messaging app: soft,
blocky from JPEG, and dull, the two in shade under a white sky.

  1. Clean. The JPEG blocks and colour noise are smoothed first, so the
     enlargement does not sharpen them.
  2. Mist. It was a misty day. The dark channel prior measures the mist
     over each part (a guided filter makes that follow the edges), and some
     of it is cleared: the trees and the path come forward, the distance
     stays soft, and the white sky is left nearly as it is.
  3. Light. The picture is split into its broad light (an edge-keeping
     guided filter) and its fine detail. The light is lifted, most in the
     shadows and mid-tones where their faces are, and not at all at white,
     so the sky does not burn out. The detail is laid back a little stronger.
     The black and white points are then set again, with a gentle S-curve,
     so the picture is bright but not grey.
  4. Colour. Faint colours (leaves, flowers, the jeans) are made a little
     richer; colours already rich, and the skin, are left nearly as they are,
     so faces stay natural. The white balance is evened.
  5. 4K. Real-ESRGAN (../sunset/upscale.py) enlarges it 4x, and that is
     blended half and half with a plain Lanczos enlargement. Edges come out
     crisp, without the glassy eyes and waxy skin a GAN gives on its own. It
     is then taken down to 3840 pixels tall, sharpened lightly on lightness
     alone, and given a fine grain.

  6. Faces. Each face is about 60 pixels wide in the
     photo, too little for the enlargement to sharpen. CodeFormer redraws
     them at high fidelity (FACE_FIDELITY), from the enlarged picture; each
     is colour-matched and blended back through a feathered ellipse
     (../old-photo/regenerate_faces.py).

  friends-4k.jpg          3022 x 3840, the whole photo, the faces sharpened by CodeFormer
  friends-4k-natural.jpg  the same, the faces as the enlargement leaves them
  before-after.jpg        the photo and the result side by side
  faces-compare.jpg       the faces up close: photo, 4K, 4K with CodeFormer

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/friends-garden/enhance.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
sys.path.insert(0, str(HERE.parent / "old-photo"))
import upscale as sr  # noqa: E402

SOURCE = HERE / "before.jpg"
OUTPUT = HERE / "friends-4k.jpg"
OUTPUT_NATURAL = HERE / "friends-4k-natural.jpg"
COMPARE = HERE / "before-after.jpg"
FACES_COMPARE = HERE / "faces-compare.jpg"
FACE_FIDELITY = 0.85          # CodeFormer: 1 keeps closest to the face as it is, 0 redraws most
HEIGHT = 3840                 # 4K, on the long side
KEEP_MIST = 0.55              # mist kept: t ** KEEP_MIST (1 keeps it all, 0 clears it)
LIFT = 1.7                    # how far the light is lifted: 1 - (1 - L) ** LIFT
FACE_LIGHT = 0.10             # and the skin a touch more, out of the shade
CLARITY = 1.3                 # the fine detail, laid back this much stronger
CURVE = 0.25                  # the S-curve's share
VIBRANCE = 0.55               # faint colours made this much richer at most
GAN_SHARE = 0.5               # Real-ESRGAN's share of the enlargement


def guided(I, p, r, eps):
    """He's guided filter with a grey guide: p smoothed so its edges follow I."""
    box = lambda x: cv2.boxFilter(x, -1, (2 * r + 1, 2 * r + 1))
    mI, mp = box(I), box(p)
    a = (box(I * p) - mI * mp) / (box(I * I) - mI * mI + eps)
    b = mp - a * mI
    return box(a) * I + box(b)


def clean(img):
    """The JPEG's blocks and colour noise smoothed, detail kept: a light
    non-local-means on lightness, a stronger one on colour."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    L, A, B = cv2.split(lab)
    L = cv2.fastNlMeansDenoising(L, None, h=4, templateWindowSize=7, searchWindowSize=21)
    A = cv2.fastNlMeansDenoising(A, None, h=6, templateWindowSize=7, searchWindowSize=21)
    B = cv2.fastNlMeansDenoising(B, None, h=6, templateWindowSize=7, searchWindowSize=21)
    return cv2.cvtColor(cv2.merge([L, A, B]), cv2.COLOR_LAB2BGR)


def clear_mist(img):
    """Part of the mist taken off: the dark channel prior's transmission,
    made to follow edges with a guided filter, raised to KEEP_MIST; held
    near 1 on the bright, colourless sky so it does not go blotchy."""
    f = img.astype(np.float32) / 255
    dark = cv2.erode(f.min(axis=2), np.ones((15, 15), np.uint8))
    top = dark >= np.percentile(dark, 99.8)
    air = np.median(f[top], axis=0)
    t = 1 - 0.9 * cv2.erode((f / air).min(axis=2), np.ones((15, 15), np.uint8))
    grey = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    t = guided(grey, t.astype(np.float32), 30, 1e-3)
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    sky = np.clip((hsv[..., 2] - 0.78) / 0.12, 0, 1) * np.clip((0.18 - hsv[..., 1]) / 0.1, 0, 1)
    sky = cv2.GaussianBlur(sky.astype(np.float32), (0, 0), 6)
    t = np.clip(t, 0.3, 1) ** KEEP_MIST
    t = t * (1 - sky) + sky * np.maximum(t, 0.85)
    out = (f - air) / t[..., None] + air
    return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)


def skin(lab):
    """Where the skin is (0..1): warm, moderately coloured, mid to light."""
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    hue = np.degrees(np.arctan2(B, A))
    chroma = np.hypot(A, B)
    m = (np.clip(1 - np.abs(hue - 55) / 30, 0, 1) * np.clip((chroma - 8) / 6, 0, 1)
         * np.clip((L - 25) / 10, 0, 1) * np.clip((45 - chroma) / 10, 0, 1))
    return cv2.GaussianBlur(m.astype(np.float32), (0, 0), 3)


def light(img):
    """Lift the broad light, most in the shadows and mid-tones; clear the
    detail; enrich faint colours; even the white balance."""
    f = img.astype(np.float32) / 255
    lab = cv2.cvtColor(f, cv2.COLOR_BGR2LAB)
    L = lab[..., 0] / 100
    base = guided(L, L, 12, 0.004)
    detail = L - base
    lit = 1 - (1 - np.clip(base, 0, 1)) ** LIFT
    L2 = lit + CLARITY * detail
    # Black and white points set again, then a gentle S-curve.
    lo, hi = np.percentile(L2, 0.4), np.percentile(L2, 99.7)
    L2 = np.clip((L2 - lo) / (hi - lo) * 0.97 + 0.01, 0, 1)
    L2 = (1 - CURVE) * L2 + CURVE * L2 * L2 * (3 - 2 * L2)
    L2 = L2 + FACE_LIGHT * skin(lab) * (1 - L2)
    # Colour: chroma scales with the light it now has, and faint colours grow
    # a little more, skin least of all.
    A, B = lab[..., 1], lab[..., 2]
    sk = skin(lab)
    chroma = np.hypot(A, B)
    gain = 1 + VIBRANCE * np.clip(1 - chroma / 50, 0, 1) * (1 - 0.85 * sk)
    # Even the white balance on the neutral greys (the path, the walls, the sky).
    grey = (chroma < 8) & (L > 0.3) & (L < 0.95)
    A = A - np.median(A[grey]) * 0.8
    B = B - np.median(B[grey]) * 0.8
    out = np.dstack([L2 * 100, A * gain, B * gain])
    return np.clip(cv2.cvtColor(out, cv2.COLOR_LAB2BGR), 0, 1)


def enlarge(f, size):
    """Real-ESRGAN 4x blended with Lanczos, then down to `size` (w, h)."""
    sess = ort.InferenceSession(sr.build(sr.weights()).SerializeToString(), providers=["CPUExecutionProvider"])
    img = (f * 255 + 0.5).astype(np.uint8)
    gan = sr.upscale_tiled(sess, img).astype(np.float32) / 255
    plain = cv2.resize(f, (gan.shape[1], gan.shape[0]), interpolation=cv2.INTER_LANCZOS4)
    big = GAN_SHARE * gan + (1 - GAN_SHARE) * plain
    return cv2.resize(big, size, interpolation=cv2.INTER_AREA)


def restore_faces(big, small):
    """Each face found in `small` redrawn by CodeFormer in `big`, an
    enlargement of it (uint8 BGR)."""
    import regenerate_faces as rf
    from restore import detect_faces
    rf.FIDELITY = FACE_FIDELITY
    faces = detect_faces(small)
    print(f"{len(faces)} faces")
    scale = np.array([big.shape[1] / small.shape[1], big.shape[0] / small.shape[0]], np.float32)
    return rf.regenerate_faces(big, faces, scale, np.zeros(2, np.float32)), faces


def finish(f):
    """A light unsharp on lightness alone, and a fine grain."""
    lab = cv2.cvtColor(np.clip(f, 0, 1).astype(np.float32), cv2.COLOR_BGR2LAB)
    L = lab[..., 0]
    L = L + 0.35 * (L - cv2.GaussianBlur(L, (0, 0), 1.6))
    rng = np.random.default_rng(3)
    L = L + cv2.GaussianBlur(rng.standard_normal(L.shape).astype(np.float32), (0, 0), 0.7) * 0.9
    lab[..., 0] = np.clip(L, 0, 100)
    return np.clip(cv2.cvtColor(lab, cv2.COLOR_LAB2BGR), 0, 1)


def side_by_side(before, after, height=1600):
    def fit(x):
        return cv2.resize(x, (round(x.shape[1] * height / x.shape[0]), height), interpolation=cv2.INTER_AREA)
    gap = np.full((height, 24, 3), 255, np.uint8)
    return np.hstack([fit(before), gap, fit(after)])


def main():
    img = cv2.imread(str(SOURCE))
    h, w = img.shape[:2]
    size = (round(w * HEIGHT / h), HEIGHT)
    lit = light(clear_mist(clean(img)))
    if len(sys.argv) > 2 and sys.argv[1] == "preview":       # preview PATH: the look only, at the photo's size
        cv2.imwrite(sys.argv[2], side_by_side(img, (lit * 255 + 0.5).astype(np.uint8), 1000))
        return
    big = enlarge(lit, size)
    big8 = (np.clip(big, 0, 1) * 255 + 0.5).astype(np.uint8)
    lit8 = (lit * 255 + 0.5).astype(np.uint8)
    faced, faces = restore_faces(big8, lit8)
    results = {}
    for path, picture in ((OUTPUT, faced.astype(np.float32) / 255), (OUTPUT_NATURAL, big)):
        out8 = (finish(picture) * 255 + 0.5).astype(np.uint8)
        cv2.imwrite(str(path), out8, [cv2.IMWRITE_JPEG_QUALITY, 95])
        results[path] = out8
        print(f"wrote {path.name} ({size[0]} x {size[1]})")
    cv2.imwrite(str(COMPARE), side_by_side(img, results[OUTPUT]), [cv2.IMWRITE_JPEG_QUALITY, 90])
    # The faces up close: the photo enlarged plainly, the 4K, the 4K with CodeFormer.
    boxes = np.array([f[0] for f in faces])
    x0, y0 = boxes[:, 0].min(), boxes[:, 1].min()
    x1, y1 = boxes[:, 2].max(), boxes[:, 3].max()
    pad = 0.35 * (y1 - y0)
    x0, y0, x1, y1 = max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)
    k = size[1] / h
    crop = lambda im: im[int(y0 * k):int(y1 * k), int(x0 * k):int(x1 * k)]
    plain = cv2.resize(img, size, interpolation=cv2.INTER_CUBIC)
    rows = [crop(plain), crop(results[OUTPUT_NATURAL]), crop(results[OUTPUT])]
    cv2.imwrite(str(FACES_COMPARE), np.hstack([np.hstack([r, np.full((r.shape[0], 16, 3), 255, np.uint8)]) for r in rows])[:, :-16],
                [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"wrote {COMPARE.name} and {FACES_COMPARE.name}")


if __name__ == "__main__":
    main()
