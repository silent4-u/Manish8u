"""Restore the old print of six friends: clean, recolour, upscale to 4K, and
restore the faces.

  1. Spots.  Mould and dirt sit on the print as small dark-brown blobs, fine
     speckle and thin cracks. They are found with a black-hat transform (what a
     morphological closing fills in), kept only where they are small or thin
     and browner than their surroundings, and inpainted. Eyes, brows,
     nostrils and lips are protected using the face detector's landmarks, and
     so is the lettering on the T-shirt.
  2. Colour.  The dyes have faded: shadows have gone violet, skin
     yellow-grey, and the whole print is low in contrast. Each channel is
     re-levelled, the violet is taken out of the shadows, and contrast and
     saturation are restored with restraint.
  3. Detail.  RealESRGAN_x4plus (from ../sunset/upscale.py) enlarges the
     cleaned print 4x; it is then resampled to 3840 px wide (4K UHD).
  4. Faces.  Each face is aligned to the FFHQ template and restored with
     CodeFormer at a high fidelity weight, so it sharpens what is there
     rather than inventing a new face, then blended back over the 4K frame.

    pip install numpy opencv-python-headless onnx onnxruntime
    python3 media/old-photo/restore.py
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
import upscale as sr  # noqa: E402

SOURCE = HERE / "friends-b.jpg"
OUTPUT = HERE / "friends-restored-4k.jpg"
CACHE = Path.home() / ".cache" / "facefusion"
MODELS = "https://github.com/facefusion/facefusion-assets/releases/download/models-3.0.0/"
TARGET_W = 3840
FIDELITY = 0.75          # CodeFormer weight: 1 keeps the input, 0 trusts the prior
FACE_BLEND = 0.85        # how much of the restored face is used

# The T-shirt lettering (x0, y0, x1, y1 in friends-b.jpg): letter counters
# look like spots to the black-hat, so leave it alone.
PROTECT = [(670, 400, 880, 510)]

# FFHQ 512 five-point template (left eye, right eye, nose, mouth L, mouth R).
TEMPLATE = np.array([[192.98138, 239.94708], [318.90277, 240.19366], [256.63416, 314.01935],
                     [201.26117, 371.41043], [313.08905, 371.15118]], np.float32)


def session(name):
    path = CACHE / name
    if not path.exists():
        import urllib.request
        CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(MODELS + name, path)
    return ort.InferenceSession(str(path), providers=["CPUExecutionProvider"])


# ------------------------------------------------------------------ faces ----

def detect_faces(bgr, threshold=0.45):
    """YOLOv8 face: boxes and five landmarks, in image pixels."""
    s = session("yoloface_8n.onnx")
    h, w = bgr.shape[:2]
    k = 640 / max(h, w)
    canvas = np.zeros((640, 640, 3), np.uint8)
    canvas[:int(h * k), :int(w * k)] = cv2.resize(bgr, (int(w * k), int(h * k)))
    x = ((canvas.astype(np.float32) - 127.5) / 128.0).transpose(2, 0, 1)[None]
    out = s.run(None, {"input": x})[0][0].T          # 8400 x 20
    keep = out[:, 4] > threshold
    boxes, scores, lms = out[keep, :4], out[keep, 4], out[keep, 5:]
    xyxy = np.stack([boxes[:, 0] - boxes[:, 2] / 2, boxes[:, 1] - boxes[:, 3] / 2,
                     boxes[:, 0] + boxes[:, 2] / 2, boxes[:, 1] + boxes[:, 3] / 2], 1) / k
    idx = cv2.dnn.NMSBoxes([list(map(float, [b[0], b[1], b[2] - b[0], b[3] - b[1]])) for b in xyxy],
                           scores.tolist(), threshold, 0.4)
    faces = []
    for i in np.array(idx).flatten():
        pts = lms[i].reshape(5, 3)[:, :2] / k
        faces.append((xyxy[i], pts, float(scores[i])))
    return sorted(faces, key=lambda f: f[0][0])


def protect_mask(shape, faces):
    m = np.zeros(shape[:2], np.uint8)
    for _, pts, _ in faces:
        eye = np.linalg.norm(pts[1] - pts[0])
        for p in pts[:2]:      # the eyes (brows are long and thin, so never taken for spots)
            cv2.ellipse(m, (int(p[0]), int(p[1])), (int(0.30 * eye), int(0.19 * eye)), 0, 0, 360, 255, -1)
        cv2.ellipse(m, (int(pts[2][0]), int(pts[2][1])), (int(0.22 * eye), int(0.16 * eye)), 0, 0, 360, 255, -1)
        mc = (pts[3] + pts[4]) / 2
        cv2.ellipse(m, (int(mc[0]), int(mc[1])), (int(0.42 * eye), int(0.20 * eye)), 0, 0, 360, 255, -1)
    for x0, y0, x1, y1 in PROTECT:
        m[y0:y1, x0:x1] = 255
    return m > 0


# ------------------------------------------------------------------ spots ----

def isolated(sel, bh, x, y, w, h, ring=5, need=0.75):
    """True when the blob sits alone on clean ground: most of a thin ring
    around it is free of other dark marks (checks, cap edges and hair fail)."""
    H, W = bh.shape
    x0, y0, x1, y1 = max(x - ring - 1, 0), max(y - ring - 1, 0), min(x + w + ring + 1, W), min(y + h + ring + 1, H)
    m = np.zeros((y1 - y0, x1 - x0), np.uint8)
    m[y - y0:y - y0 + h, x - x0:x - x0 + w] = sel
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * ring + 1, 2 * ring + 1))
    r = (cv2.dilate(m, k) > 0) & (m == 0)
    if not r.any():
        return False
    return (bh[y0:y1, x0:x1][r] < 10).mean() >= need


def spot_mask(bgr, protect):
    """Compact dark blobs, alone on lighter ground: spots, not checks, brows or hair."""
    L = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32)
    g = cv2.GaussianBlur(L, (0, 0), 0.8)
    closed = cv2.morphologyEx(g, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (27, 27)))
    bh = closed - g
    bh[protect] = 0                                   # eyes, mouth, nose and lettering split away first
    m = np.zeros(bh.shape, bool)
    for thresh, peak_min, max_area in ((11, 14, 900), (45, 45, 500), (8, 10, 400)):
        n, lab_, st, _ = cv2.connectedComponentsWithStats((bh > thresh).astype(np.uint8), 8)
        for i in range(1, n):
            x, y, w, h, area = st[i]
            if area > max_area:
                continue
            sel = lab_[y:y + h, x:x + w] == i
            aspect = max(w, h) / max(1, min(w, h))
            if aspect > 2.6 or area / (w * h) < 0.33:
                continue
            if bh[y:y + h, x:x + w][sel].max() < (peak_min if area > 6 else max(peak_min, 22)):
                continue
            ground_min = 95 if thresh != 8 else 55        # the third pass: spots on the trousers and checks
            if closed[y:y + h, x:x + w][sel].mean() <= ground_min:
                continue
            if thresh == 8 and bh[y:y + h, x:x + w][sel].max() < 0.35 * closed[y:y + h, x:x + w][sel].mean():
                continue
            if not isolated(sel, bh, x, y, w, h):
                continue
            if thresh != 45:
                m[y:y + h, x:x + w] |= sel
            else:   # a strong core: grow it back out to the spot's own edge
                pad = 6
                y0, x0 = max(y - pad, 0), max(x - pad, 0)
                core = np.zeros((h + 2 * pad, w + 2 * pad), np.uint8)
                core[y - y0:y - y0 + h, x - x0:x - x0 + w] = sel
                core = core[:min(h + 2 * pad, bh.shape[0] - y0), :min(w + 2 * pad, bh.shape[1] - x0)]
                grown = cv2.dilate(core, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))) > 0
                hh, ww = grown.shape
                m[y0:y0 + hh, x0:x0 + ww] |= grown & (bh[y0:y0 + hh, x0:x0 + ww] > 9)
    m &= ~protect
    return cv2.dilate(m.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))


def clean(bgr, faces):
    protect = protect_mask(bgr.shape, faces)
    # Several passes: clearing one spot leaves its neighbours isolated enough
    # to be recognised on the next.
    out, m = bgr, np.zeros(bgr.shape[:2], np.uint8)
    for _ in range(4):
        mi = spot_mask(out, protect)
        if mi.sum() == 0:
            break
        out = cv2.inpaint(out, mi * 255, 4, cv2.INPAINT_TELEA)
        m |= mi
    # Mould blotches: darker, browner patches on pale cloth and backdrop. Lift
    # each pixel back toward the fabric's own level (a large closing finds
    # it) and take its colour from the clean pixels around it. Skin, the
    # navy checks and the protected features are left alone.
    lab = cv2.cvtColor(out, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    ground = cv2.morphologyEx(L, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21)))
    ground = cv2.GaussianBlur(ground, (0, 0), 3)
    d = ground - L
    face_box = np.zeros(L.shape, bool)
    for box, _, _ in faces:
        x0, y0, x1, y1 = box.astype(int)
        face_box[max(y0, 0):y1, max(x0, 0):x1] = True
    w = np.clip((d - 4) / 14, 0, 1) * (ground > 150) * (A < 141) * (B > 126) * ~face_box * ~protect
    w = cv2.GaussianBlur(w.astype(np.float32), (0, 0), 1.5)
    clean_w = cv2.GaussianBlur(1 - w, (0, 0), 7) + 1e-3
    for ch in (A, B):
        ch[:] = ch * (1 - w) + (cv2.GaussianBlur(ch * (1 - w), (0, 0), 7) / clean_w) * w
    L += d * w * 0.85
    return cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR), m


# ----------------------------------------------------------------- colour ----

def recolour(bgr):
    a = bgr.astype(np.float32) / 255
    # Re-level each channel on its own percentiles.
    for c in range(3):
        lo, hi = np.percentile(a[..., c], (0.5, 99.7))
        a[..., c] = np.clip((a[..., c] - lo) / (hi - lo), 0, 1)
    lab = cv2.cvtColor(a, cv2.COLOR_BGR2LAB)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    # Balance on the brightest cloth: it should be warm white, not green.
    hi = L > np.percentile(L, 93)
    A -= (np.median(A[hi]) - 1.5) * 0.8
    B -= (np.median(B[hi]) - 9.0) * 0.8
    # Take the violet out of the shadows (hair, trousers, the T-shirt).
    dark = 1 - np.clip((L - 15) / 35, 0, 1)
    A -= (A - 2) * 0.5 * dark
    B -= (B - (-3)) * 0.4 * dark
    # Contrast on lightness, gently local.
    l8 = np.clip(L * 2.55, 0, 255).astype(np.uint8)
    lc = cv2.createCLAHE(clipLimit=1.4, tileGridSize=(8, 8)).apply(l8).astype(np.float32) / 2.55
    L = L * 0.6 + lc * 0.4
    x = np.clip(L / 100, 0, 1)
    L = 100 * (x + 0.08 * x * (1 - x) * (2 * x - 1))
    lab = np.dstack([L, A * 0.96, B * 0.92])
    out = cv2.cvtColor(lab.astype(np.float32), cv2.COLOR_LAB2BGR)
    return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)


# ------------------------------------------------------------------ faces ----

def restore_faces(big, faces, scale):
    s = session("codeformer.onnx")
    out = big.astype(np.float32)
    H, W = big.shape[:2]
    for box, pts, _ in faces:
        p = (pts * scale).astype(np.float32)
        M, _ = cv2.estimateAffinePartial2D(p, TEMPLATE, method=cv2.LMEDS)
        crop = cv2.warpAffine(big, M, (512, 512), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        x = (crop[..., ::-1].astype(np.float32) / 255 - 0.5) / 0.5
        y = s.run(None, {"input": x.transpose(2, 0, 1)[None], "weight": np.array(FIDELITY, np.float64)})[0][0]
        y = ((np.clip(y.transpose(1, 2, 0), -1, 1) + 1) / 2 * 255)[..., ::-1]
        # Keep the original colour of the face: restore detail, not complexion.
        ylab = cv2.cvtColor(y.astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
        clab = cv2.cvtColor(crop, cv2.COLOR_BGR2LAB).astype(np.float32)
        ylab[..., 1:] = cv2.GaussianBlur(clab[..., 1:], (0, 0), 3)
        y = cv2.cvtColor(np.clip(ylab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
        # A soft oval mask so only the face, not the hair edge, is replaced.
        mask = np.zeros((512, 512), np.float32)
        cv2.ellipse(mask, (256, 290), (190, 230), 0, 0, 360, 1.0, -1)
        mask = cv2.GaussianBlur(mask, (0, 0), 22)
        Mi = cv2.invertAffineTransform(M)
        back = cv2.warpAffine(y, Mi, (W, H), flags=cv2.INTER_CUBIC)
        m = cv2.warpAffine(mask, Mi, (W, H))[..., None] * FACE_BLEND
        out = out * (1 - m) + back * m
    return np.clip(out, 0, 255).astype(np.uint8)


def main():
    src = cv2.imread(str(SOURCE))
    print("finding faces")
    faces = detect_faces(src)
    print(f"  {len(faces)} faces")
    print("cleaning spots")
    cleaned, m = clean(src, faces)
    cv2.imwrite(str(HERE / "friends-cleaned.jpg"), cleaned, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print("recolouring")
    col = recolour(cleaned)
    print("upscaling 4x (RealESRGAN_x4plus)")
    if not (sr.CACHE / sr.X4PLUS[1]).exists():
        import urllib.request
        sr.CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(sr.X4PLUS[0] + sr.X4PLUS[1], sr.CACHE / sr.X4PLUS[1])
    heavy = ort.InferenceSession(sr.build_rrdb(sr.load_pth(sr.CACHE / sr.X4PLUS[1])).SerializeToString(),
                                 providers=["CPUExecutionProvider"])
    big = sr.upscale_tiled(heavy, col)
    k = TARGET_W / big.shape[1]
    big = cv2.resize(big, (TARGET_W, int(round(big.shape[0] * k))), interpolation=cv2.INTER_AREA)
    print("restoring faces (CodeFormer)")
    out = restore_faces(big, faces, scale=TARGET_W / src.shape[1])
    # A fine, even grain so it reads as a photograph, not a render.
    grain = cv2.GaussianBlur(np.random.default_rng(3).normal(0, 3.0, out.shape[:2]).astype(np.float32), (0, 0), 0.7)
    out = np.clip(out.astype(np.float32) + grain[..., None], 0, 255).astype(np.uint8)
    cv2.imwrite(str(OUTPUT), out, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"wrote {OUTPUT} {out.shape[1]}x{out.shape[0]}")


if __name__ == "__main__":
    main()
