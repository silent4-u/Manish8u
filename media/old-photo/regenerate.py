"""Regenerate the photo of six friends as a fresh, sharp studio photograph.

restore_print.py repairs the print; it cannot put back detail the water took
(cloth texture, fine skin, the bleached checks). This script redraws the
picture with a generative model, held tightly to the original so the poses,
clothes and painted sky stay where they are, and then puts the real faces
back so the six still look like themselves:

  1. Start. The cleaned print (friends-print-cleaned.jpg) is recoloured as
     in restore_print.py, cropped to the same CROP and resized to WORK.
  2. Regenerate. Stable Diffusion 1.5 img2img guided by ControlNet Tile,
     which keeps every shape of the input and only re-imagines texture.
     It runs in overlapping 768 px tiles so it fits in memory on a CPU,
     with a fixed SEED so a run can be repeated exactly.
  3. Real faces. Each face, with its hair, is taken from the start image
     and blended into the new picture through a soft, feathered ellipse
     made from the face box; its colour is matched to the new skin first.
     The second boy's cap (CAP) and the fourth boy's glasses are inside
     these regions, so they are the print's own.
  4. Lettering. The "UNDERCOVER POLICE" T-shirt (PROTECT in restore.py) is
     pasted back from the start image in both versions, colour-matched the
     same way, so the model never invents letters.
  5. Print. Enlarged with restore_print.enlarge (Real-ESRGAN + Lanczos) and
     saved at 300 dpi with an sRGB profile:

       friends-regenerated-7x5.jpg       4200 x 3000  real faces
       friends-regenerated-3x2.jpg       3600 x 2400  real faces
       friends-regenerated-full-7x5.jpg  4200 x 3000  faces regenerated too
       regenerated-comparison.jpg        print | real faces | all regenerated

The model weights (about 4 GB) download from Hugging Face on first use to
~/.cache/huggingface; nothing is written to the repository but the outputs.
On a CPU a run takes roughly 15-40 minutes; an NVIDIA GPU or an Apple
Silicon Mac does it in a minute or two.

    pip install numpy opencv-python-headless onnx onnxruntime pillow
    pip install torch diffusers transformers accelerate safetensors
    python3 media/old-photo/regenerate.py
    python3 media/old-photo/regenerate.py --strength 0.35   # stay closer to the print
"""

import argparse
import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
sys.path.insert(0, str(HERE))
from restore import PROTECT, detect_faces  # noqa: E402
from restore_print import CROP, enlarge, recolour, save_print  # noqa: E402

CLEANED = HERE / "friends-print-cleaned.jpg"
OUT_7X5 = HERE / "friends-regenerated-7x5.jpg"
OUT_3X2 = HERE / "friends-regenerated-3x2.jpg"
OUT_FULL = HERE / "friends-regenerated-full-7x5.jpg"
COMPARISON = HERE / "regenerated-comparison.jpg"

MODEL = "stable-diffusion-v1-5/stable-diffusion-v1-5"
VAE = "stabilityai/sd-vae-ft-mse"          # sharper faces and cloth than the stock VAE
CONTROLNET = "lllyasviel/control_v11f1e_sd15_tile"

WORK = (1400, 1000)        # 7:5, a multiple of 8; enlarged exactly 3x for the print
TILE, OVERLAP = 768, 128
STEPS, STRENGTH, GUIDANCE, CONTROL = 30, 0.45, 6.0, 1.0
SEED = 1987

PROMPT = ("a sharp, realistic studio photograph of six young men standing together in front of a "
          "painted sky backdrop, natural skin texture, detailed cotton and checked fabric, "
          "soft studio light, 35mm film photo, high detail")
NEGATIVE = ("cartoon, painting, illustration, drawing, cgi, 3d render, blurry, deformed face, "
            "disfigured, extra fingers, extra limbs, watermark, text, letters, stains, scratches, "
            "damaged photo, oversaturated")

# The second boy's cap is worn sideways and reaches well past his face box:
# (centre, axes) of an ellipse around it, in friends-b.jpg pixels.
CAP = ((527, 212), (98, 78))


# ------------------------------------------------------------- 1. start ----

def start_image():
    """The cleaned, recoloured print at WORK size, and the scale from
    friends-b.jpg pixels to it."""
    x0, y0, x1, y1 = CROP
    img = recolour(cv2.imread(str(CLEANED)))[y0:y1, x0:x1]
    sx, sy = WORK[0] / (x1 - x0), WORK[1] / (y1 - y0)
    return cv2.resize(img, WORK, interpolation=cv2.INTER_AREA), (x0, y0, sx, sy)


def to_work(xy, t):
    x0, y0, sx, sy = t
    return (xy[0] - x0) * sx, (xy[1] - y0) * sy


# -------------------------------------------------------- 2. regenerate ----

def load_pipeline(model):
    import torch
    from diffusers import AutoencoderKL, ControlNetModel, StableDiffusionControlNetImg2ImgPipeline

    if torch.cuda.is_available():
        device, dtype = "cuda", torch.float16
    elif torch.backends.mps.is_available():
        device, dtype = "mps", torch.float32
    else:
        device, dtype = "cpu", torch.float32
    controlnet = ControlNetModel.from_pretrained(CONTROLNET, torch_dtype=dtype)
    vae = AutoencoderKL.from_pretrained(VAE, torch_dtype=dtype)
    pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
        model, controlnet=controlnet, vae=vae, torch_dtype=dtype,
        safety_checker=None, requires_safety_checker=False)
    pipe.set_progress_bar_config(leave=False)
    pipe.enable_attention_slicing()
    print(f"model on {device}")
    return pipe.to(device)


def starts(length):
    """Tile origins along one side, overlapping by at least OVERLAP."""
    if length <= TILE:
        return [0]
    n = int(np.ceil((length - OVERLAP) / (TILE - OVERLAP)))
    return [round(i * (length - TILE) / (n - 1)) for i in range(n)]


def ramp(n, lo_edge, hi_edge):
    """Blend weight across a tile: ramps up over OVERLAP on sides that meet
    another tile, flat on sides at the picture's edge."""
    w = np.ones(n, np.float32)
    r = np.linspace(0, 1, OVERLAP + 2, dtype=np.float32)[1:-1]
    if not lo_edge:
        w[:OVERLAP] = r
    if not hi_edge:
        w[-OVERLAP:] = r[::-1]
    return w


def regenerate(pipe, bgr, strength, steps, seed):
    import torch
    from PIL import Image

    h, w = bgr.shape[:2]
    acc = np.zeros((h, w, 3), np.float32)
    wsum = np.zeros((h, w, 1), np.float32)
    ys, xs = starts(h), starts(w)
    tiles = [(y, x) for y in ys for x in xs]
    for i, (y, x) in enumerate(tiles, 1):
        th, tw = min(TILE, h), min(TILE, w)
        tile = Image.fromarray(cv2.cvtColor(bgr[y:y + th, x:x + tw], cv2.COLOR_BGR2RGB))
        print(f"  tile {i}/{len(tiles)} at ({x}, {y})")
        out = pipe(prompt=PROMPT, negative_prompt=NEGATIVE, image=tile, control_image=tile,
                   strength=strength, num_inference_steps=steps, guidance_scale=GUIDANCE,
                   controlnet_conditioning_scale=CONTROL, width=tw, height=th,
                   generator=torch.Generator("cpu").manual_seed(seed)).images[0]
        out = cv2.cvtColor(np.asarray(out.resize((tw, th))), cv2.COLOR_RGB2BGR).astype(np.float32)
        wt = np.outer(ramp(th, y == 0, y + th >= h), ramp(tw, x == 0, x + tw >= w))[..., None]
        acc[y:y + th, x:x + tw] += out * wt
        wsum[y:y + th, x:x + tw] += wt
    return np.clip(acc / wsum, 0, 255).astype(np.uint8)


# ------------------------------------------------------- 3. real faces ----

def head_masks(shape, faces, t):
    """One soft mask per face: an ellipse over the face box, reaching up over
    the hair, feathered so the seam disappears into the new skin."""
    masks = []
    for i, (box, _, _) in enumerate(faces):
        (bx0, by0), (bx1, by1) = to_work(box[:2], t), to_work(box[2:], t)
        bw, bh = bx1 - bx0, by1 - by0
        m = np.zeros(shape, np.float32)
        centre = (int((bx0 + bx1) / 2), int((by0 + by1) / 2 - 0.12 * bh))
        cv2.ellipse(m, centre, (int(0.62 * bw), int(0.78 * bh)), 0, 0, 360, 1.0, -1)
        if i == 1:      # the cap
            (cx, cy), (ax, ay) = to_work(CAP[0], t), (CAP[1][0] * t[2], CAP[1][1] * t[3])
            cv2.ellipse(m, (int(cx), int(cy)), (int(ax), int(ay)), 0, 0, 360, 1.0, -1)
        soft = 0.09 * bw
        m = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(soft) * 2 + 1,) * 2))
        masks.append(cv2.GaussianBlur(m, (0, 0), soft))
    return masks


def match_colour(src, ref, mask):
    """Shift src's colour toward ref's inside mask, in Lab: the mean fully,
    the spread halfway, so the real face sits in the new light."""
    a = cv2.cvtColor(src, cv2.COLOR_BGR2LAB).astype(np.float32)
    b = cv2.cvtColor(ref, cv2.COLOR_BGR2LAB).astype(np.float32)
    sel = mask > 0.5
    for c in range(3):
        ma, sa = a[..., c][sel].mean(), a[..., c][sel].std() + 1e-3
        mb, sb = b[..., c][sel].mean(), b[..., c][sel].std() + 1e-3
        a[..., c] = (a[..., c] - ma) * (1 + 0.5 * (sb / sa - 1)) + mb
    return cv2.cvtColor(np.clip(a, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)


def paste(base, src, mask):
    m = mask[..., None]
    return (base.astype(np.float32) * (1 - m) + src.astype(np.float32) * m + 0.5).astype(np.uint8)


def real_faces(gen, start, faces, t):
    out = gen
    for m in head_masks(gen.shape[:2], faces, t):
        out = paste(out, match_colour(start, gen, m), m)
    return out


# --------------------------------------------------------- 4. lettering ----

def lettering(gen, start, t):
    m = np.zeros(gen.shape[:2], np.float32)
    for x0, y0, x1, y1 in PROTECT:
        (a, b), (c, d) = to_work((x0, y0), t), to_work((x1, y1), t)
        m[int(b):int(d), int(a):int(c)] = 1.0
    m = cv2.GaussianBlur(m, (0, 0), 10)
    return paste(gen, match_colour(start, gen, m), m)


# ------------------------------------------------------------- 5. print ----

def comparison(panels, labels):
    row = []
    for img, text in zip(panels, labels):
        img = img.copy()
        cv2.rectangle(img, (0, 0), (img.shape[1], 64), (0, 0, 0), -1)
        cv2.putText(img, text, (24, 46), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (255, 255, 255), 2, cv2.LINE_AA)
        row.append(img)
    gap = np.full((panels[0].shape[0], 16, 3), 255, np.uint8)
    return np.hstack([row[0], gap, row[1], gap, row[2]])


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--model", default=MODEL, help="any SD 1.5 checkpoint in diffusers format, "
                    "e.g. SG161222/Realistic_Vision_V5.1_noVAE")
    ap.add_argument("--strength", type=float, default=STRENGTH, help="0.3 close to the print, 0.6 freer")
    ap.add_argument("--steps", type=int, default=STEPS)
    ap.add_argument("--seed", type=int, default=SEED)
    args = ap.parse_args()

    print("1. start")
    start, t = start_image()
    faces = detect_faces(cv2.imread(str(CLEANED)))
    print(f"   {len(faces)} faces")
    print("2. regenerate")
    pipe = load_pipeline(args.model)
    gen = regenerate(pipe, start, args.strength, args.steps, args.seed)
    del pipe
    print("3. real faces, 4. lettering")
    full = lettering(gen, start, t)
    real = lettering(real_faces(gen, start, faces, t), start, t)
    print("5. print")
    big = cv2.resize(enlarge(real, 4200), (4200, 3000), interpolation=cv2.INTER_AREA)
    save_print(big, OUT_7X5)
    save_print(cv2.resize(big[80:2880], (3600, 2400), interpolation=cv2.INTER_AREA), OUT_3X2)
    save_print(cv2.resize(enlarge(full, 4200), (4200, 3000), interpolation=cv2.INTER_AREA), OUT_FULL)
    cmp = comparison([start, real, full], ["Cleaned print", "Regenerated, real faces", "Fully regenerated"])
    cv2.imwrite(str(COMPARISON), cmp, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"wrote {COMPARISON.name} {cmp.shape[1]}x{cmp.shape[0]}")


if __name__ == "__main__":
    main()
