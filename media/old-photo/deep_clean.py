"""Deep clean of the stained print, run after the spot pass in restore.py.

Small spots are only half the damage. Water and mould soaked into the light
clothes, the checked shirts and the painted backdrop as broad brown blotches.
Here:

  * Plain garments (outlined roughly in garments.py; the pixels that belong
    are picked by colour inside each outline) are rebuilt as clean fabric:
    lightness from the fabric's own clean level (an upper envelope for light
    cloth, a median for dark cloth), so folds and lighting stay but blotches
    go, plus the fine weave of the original; colour from the clean pixels
    around each point, pulled toward the garment's own colour.
  * Checked shirts keep their pattern: only brown/olive stains on them are
    masked and repainted with LaMa.
  * Skin and the backdrop: mould that is darker and browner than its
    surroundings is masked and repainted with LaMa.

LaMa (big-lama, ONNX build from OpenCV Zoo) fills each masked area from its
surroundings, in overlapping 512 px windows.
"""

from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

from garments import GARMENTS, KEEP, SMEARS

LAMA_URL = ("https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/"
            "inpainting_lama/inpainting_lama_2025jan.onnx")
LAMA = Path.home() / ".cache" / "lama" / "inpainting_lama_2025jan.onnx"
U2NET = Path.home() / ".cache" / "rembg" / "u2net_human_seg.onnx"


# --------------------------------------------------------------- helpers ----

def to_lab(bgr):
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    return lab[..., 0], lab[..., 1] - 128, lab[..., 2] - 128


def from_lab(L, A, B):
    lab = np.dstack([np.clip(L, 0, 255), np.clip(A + 128, 0, 255), np.clip(B + 128, 0, 255)]).astype(np.uint8)
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


def ellipse(k):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))


def normconv(v, w, sigma):
    return cv2.GaussianBlur(v * w, (0, 0), sigma) / (cv2.GaussianBlur(w, (0, 0), sigma) + 1e-4)


def fill_holes(m):
    h, w = m.shape
    ff = m.astype(np.uint8).copy()
    cv2.floodFill(ff, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 1)
    return m | (ff == 0)


def masked_filter(v, m, fn):
    """Apply fn to v as if the region outside m continued the inside."""
    filled = cv2.inpaint(np.clip(v, 0, 255).astype(np.uint8), (~m).astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA)
    return fn(filled.astype(np.float32))


def person_mask(bgr):
    s = ort.InferenceSession(str(U2NET), providers=["CPUExecutionProvider"])
    h, w = bgr.shape[:2]
    x = cv2.resize(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB), (320, 320), interpolation=cv2.INTER_AREA)
    x = (x.astype(np.float32) / 255 - np.array([0.485, 0.456, 0.406], np.float32)) \
        / np.array([0.229, 0.224, 0.225], np.float32)
    p = s.run(None, {"input.1": x.transpose(2, 0, 1)[None]})[0][0, 0]
    p = (p - p.min()) / (p.max() - p.min() + 1e-6)
    return cv2.resize(p, (w, h)) > 0.5


def skin_model(bgr, faces):
    L, A, B = to_lab(bgr)
    pts = []
    for _, p, _ in faces:
        eye = np.linalg.norm(p[1] - p[0])
        for dx in (-0.45, 0.45):
            x, y = int(p[2][0] + dx * eye), int(p[2][1] + 0.1 * eye)
            pts.append(np.stack([A[y - 3:y + 4, x - 3:x + 4].ravel(), B[y - 3:y + 4, x - 3:x + 4].ravel()], 1))
    pts = np.concatenate(pts)
    return pts.mean(0), np.cov(pts.T) + np.eye(2) * 6


def skin_distance(A, B, model):
    mu, cov = model
    d = np.stack([A - mu[0], B - mu[1]], -1)
    return np.einsum("...i,ij,...j->...", d, np.linalg.inv(cov), d)


# ------------------------------------------------------------------ LaMa ----

class Lama:
    def __init__(self):
        if not LAMA.exists():
            import urllib.request
            LAMA.parent.mkdir(parents=True, exist_ok=True)
            urllib.request.urlretrieve(LAMA_URL, LAMA)
        opts = ort.SessionOptions()
        opts.log_severity_level = 3
        self.s = ort.InferenceSession(str(LAMA), opts, providers=["CPUExecutionProvider"])

    def window(self, img, mask):
        """img: 512x512 BGR uint8, mask: 512x512 bool."""
        x = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32).transpose(2, 0, 1)[None] / 255
        m = mask.astype(np.float32)[None, None]
        y = self.s.run(None, {"image": x, "mask": m})[0][0].transpose(1, 2, 0)
        return cv2.cvtColor(np.clip(y, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)

    def fill(self, img, mask, size=512, stride=384, margin=48):
        out = img.copy()
        h, w = mask.shape
        ys = sorted(set(list(range(0, max(h - size, 0) + 1, stride)) + [max(h - size, 0)]))
        xs = sorted(set(list(range(0, max(w - size, 0) + 1, stride)) + [max(w - size, 0)]))
        done = np.zeros_like(mask)
        for y0 in ys:
            for x0 in xs:
                sub = mask[y0:y0 + size, x0:x0 + size] & ~done[y0:y0 + size, x0:x0 + size]
                # Only take the part of the mask away from this window's edges
                # (unless the window sits on the image edge), so each fill has
                # context on every side; the next window takes the rest.
                inner = np.zeros_like(sub)
                t = 0 if y0 == 0 else margin
                b = size if y0 + size >= h else size - margin
                l = 0 if x0 == 0 else margin
                r = size if x0 + size >= w else size - margin
                inner[t:b, l:r] = True
                sub = sub & inner
                if not sub.any():
                    continue
                patch = out[y0:y0 + size, x0:x0 + size]
                ph, pw = patch.shape[:2]
                pad = cv2.copyMakeBorder(patch, 0, size - ph, 0, size - pw, cv2.BORDER_REFLECT)
                mpad = np.zeros((size, size), bool)
                mpad[:ph, :pw] = cv2.dilate(sub.astype(np.uint8), ellipse(5)) > 0
                res = self.window(pad, mpad)[:ph, :pw]
                a = cv2.GaussianBlur(mpad[:ph, :pw].astype(np.float32), (0, 0), 1.2)[..., None]
                out[y0:y0 + ph, x0:x0 + pw] = (patch * (1 - a) + res * a).astype(np.uint8)
                done[y0:y0 + size, x0:x0 + size] |= sub
        return out


# -------------------------------------------------------------- garments ----

def garment_masks(bgr, skin):
    L, A, B = to_lab(bgr)
    h, w = L.shape
    out = {}
    keep = np.zeros((h, w), np.uint8)
    for poly in KEEP:
        cv2.fillPoly(keep, [np.array(poly, np.int32)], 1)
    keep = keep > 0
    for name, (kind, poly) in GARMENTS.items():
        inside = np.zeros((h, w), np.uint8)
        cv2.fillPoly(inside, [np.array(poly, np.int32)], 1)
        inside = inside > 0
        # The garment's own colour: from its brighter (less stained) pixels.
        sel = inside & ~skin
        thr = np.percentile(L[sel], 55)
        ref = np.array([np.median(A[sel & (L >= thr)]), np.median(B[sel & (L >= thr)])])
        dist = np.hypot(A - ref[0], B - ref[1])
        hue = np.degrees(np.arctan2(B, A))
        ch = np.hypot(A, B)
        if kind == "plain":
            member = inside & ~skin & ((dist < 14) | ((hue > 45) & (hue < 130) & (ch > 5) & (np.median(L[sel]) > 120)))
        else:
            member = inside & ~skin
        member = cv2.morphologyEx(member.astype(np.uint8), cv2.MORPH_OPEN, ellipse(5))
        member = cv2.morphologyEx(member, cv2.MORPH_CLOSE, ellipse(15)) > 0
        # Fill only small holes (spots); large ones are other things.
        holes = fill_holes(member) & ~member
        n, lab, st, _ = cv2.connectedComponentsWithStats(holes.astype(np.uint8), 8)
        member |= np.isin(lab, [i for i in range(1, n) if st[i, 4] < 600])
        member &= inside & ~skin & ~keep
        n, lab, st, _ = cv2.connectedComponentsWithStats(member.astype(np.uint8), 8)
        member = np.isin(lab, [i for i in range(1, n) if st[i, 4] > 1500])
        out[name] = (kind, member, ref)
    return out


def envelope(L, member, k):
    """Clean level of pale cloth: a closing at half resolution (stains only darken)."""
    h, w = L.shape
    small = cv2.resize(L, (w // 2, h // 2), interpolation=cv2.INTER_AREA)
    msk = cv2.resize(member.astype(np.uint8), (w // 2, h // 2), interpolation=cv2.INTER_NEAREST) > 0
    env = masked_filter(small, msk, lambda v: cv2.erode(cv2.dilate(v, ellipse(k)), ellipse(k)))
    env = masked_filter(env, msk, lambda v: cv2.GaussianBlur(v, (0, 0), 4))
    return cv2.resize(env, (w, h), interpolation=cv2.INTER_CUBIC)


def stains_plain(bgr, member):
    """Pale cloth: what sits clearly below its clean level. Dark cloth: outliers."""
    L, A, B = to_lab(bgr)
    if np.median(L[member]) > 120:
        env = envelope(L, member, 31)
        m = member & (env - L > 11)
    else:
        med = masked_filter(L, member, lambda v: cv2.medianBlur(v.astype(np.uint8), 41).astype(np.float32))
        m = member & (np.abs(L - med) > 16)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, ellipse(3))
    return cv2.dilate(m, ellipse(7)) > 0


def even_out(bgr, member, sigma=22, strength=0.85):
    """Flat-field a patterned garment: divide out blotches broader than its
    pattern, and the brown cast they carry, keeping the pattern itself."""
    L, A, B = to_lab(bgr)
    f = member.astype(np.float32)
    lo = normconv(L, f, sigma)
    target = np.median(L[member])
    gain = np.clip((target / (lo + 1e-3)) ** strength, 0.75, 1.5)
    Ln = L * gain
    for ch in (A, B):
        lo_c = normconv(ch, f, sigma)
        ch -= (lo_c - np.median(ch[member])) * strength
    new = from_lab(Ln, A, B)
    a = cv2.GaussianBlur(f, (0, 0), 2)[..., None]
    return (bgr * (1 - a) + new * a).astype(np.uint8)


def stains_check(bgr, member):
    L, A, B = to_lab(bgr)
    hue = np.degrees(np.arctan2(B, A))
    ch = np.hypot(A, B)
    m = member & (hue > 55) & (hue < 125) & (ch > 7) & (L > 40) & (L < 170)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, ellipse(3))
    return cv2.dilate(m, ellipse(7)) > 0


def spots_check(bgr, member):
    """Round dark spots on a checked shirt: not isolated (the pattern is busy),
    but compact and much darker than the closing around them, unlike stripes."""
    L, _, _ = to_lab(bgr)
    g = cv2.GaussianBlur(L, (0, 0), 0.8)
    bh = cv2.morphologyEx(g, cv2.MORPH_CLOSE, ellipse(15)) - g
    n, lab, st, _ = cv2.connectedComponentsWithStats(((bh > 18) & member).astype(np.uint8), 8)
    keep = np.zeros(n, bool)
    for i in range(1, n):
        x, y, w, h, area = st[i]
        if 6 <= area <= 260 and max(w, h) / max(1, min(w, h)) <= 1.7 and area / (w * h) >= 0.5:
            keep[i] = bh[y:y + h, x:x + w][lab[y:y + h, x:x + w] == i].max() > 26
    return cv2.dilate(keep[lab].astype(np.uint8), ellipse(7)) > 0


def stains_skin(bgr, skin, protect):
    L, A, B = to_lab(bgr)
    med = masked_filter(L, skin, lambda v: cv2.medianBlur(v.astype(np.uint8), 31).astype(np.float32))
    hue = np.degrees(np.arctan2(B, A))
    hmed = masked_filter(hue, skin, lambda v: cv2.medianBlur(np.clip(v, 0, 255).astype(np.uint8), 31).astype(np.float32))
    m = skin & ~protect & (med - L > 14) & (hue > hmed + 8)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, ellipse(3))
    return cv2.dilate(m, ellipse(7)) > 0


def stains_backdrop(bgr, person):
    L, A, B = to_lab(bgr)
    bg = ~cv2.dilate(person.astype(np.uint8), ellipse(9)).astype(bool)
    med = masked_filter(L, bg, lambda v: cv2.medianBlur(v.astype(np.uint8), 41).astype(np.float32))
    hue = np.degrees(np.arctan2(B, A))
    ch = np.hypot(A, B)
    brown = (hue > 45) & (hue < 130) & (ch > 6)
    m = bg & (((med - L > 12) & brown) | (med - L > 30))
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, ellipse(3))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    m = np.isin(lab, [i for i in range(1, n) if st[i, 4] < 6000])     # not whole painted shapes
    return cv2.dilate(m.astype(np.uint8), ellipse(7)) > 0


def deep_clean(bgr, faces, protect, log=print):
    person = person_mask(bgr)
    L, A, B = to_lab(bgr)
    skin = (skin_distance(A, B, skin_model(bgr, faces)) < 7) & (L > 60) & person
    skin = cv2.morphologyEx(skin.astype(np.uint8), cv2.MORPH_OPEN, ellipse(5)) > 0
    face_area = np.zeros(skin.shape, bool)
    for box, _, _ in faces:
        x0, y0, x1, y1 = box.astype(int)
        face_area[max(y0, 0):y1, max(x0, 0):x1] = True

    log("  garments")
    masks = garment_masks(bgr, skin)
    out = bgr.copy()
    for name, (kind, member, ref) in masks.items():
        if kind == "check":
            out = even_out(out, member & ~protect)

    log("  stains for LaMa")
    lama_mask = np.zeros(skin.shape, bool)
    for name, (kind, member, ref) in masks.items():
        if kind == "check":
            lama_mask |= stains_check(out, member & ~protect)
            lama_mask |= spots_check(out, member & ~protect)
        else:
            lama_mask |= stains_plain(out, member & ~protect)
    lama_mask |= stains_skin(out, skin & ~face_area, protect)
    lama_mask |= stains_backdrop(out, person)
    for poly in SMEARS:
        sm = np.zeros(skin.shape, np.uint8)
        cv2.fillPoly(sm, [np.array(poly, np.int32)], 1)
        lama_mask |= sm > 0
    keep = np.zeros(skin.shape, np.uint8)
    for poly in KEEP:
        cv2.fillPoly(keep, [np.array(poly, np.int32)], 1)
    lama_mask &= ~protect & ~(cv2.dilate(keep, ellipse(9)) > 0)
    log(f"  LaMa on {lama_mask.mean() * 100:.1f}% of the frame")
    out = Lama().fill(out, lama_mask)

    # What LaMa could not tell from stain (broad, faint blotches) is evened
    # out: on every garment, and on the plain teal of the painted sky.
    log("  evening out broad blotches")
    for name, (kind, member, ref) in masks.items():
        out = even_out(out, member & ~protect, sigma=24 if kind == "plain" else 22,
                       strength=0.8 if kind == "plain" else 0.85)
    L, A, B = to_lab(out)
    sky = ~cv2.dilate(person.astype(np.uint8), ellipse(15)).astype(bool) & (A < -6) & (L > 90)
    sky = cv2.morphologyEx(sky.astype(np.uint8), cv2.MORPH_OPEN, ellipse(9)) > 0
    out = even_out(out, sky, sigma=30, strength=0.7)
    return out, lama_mask, masks
