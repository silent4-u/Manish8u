"""Enlarge the logo 4x with RealESRGAN_x4plus, for printing.

logo-source.webp is the निशान छाप as on the gaun palika's letter pad, 250 px
wide: sharp on a screen, but about 70 dpi at a chest logo's 9 cm. Enlarged,
its edges and the motto on its ribbon stay crisp at about 280 dpi.

The colour is enlarged over white (the shirt is white), and the transparency
on its own, so the edges stay clean. Writes logo.png, which make_jersey.py
then uses in place of its own crest.

    python3 media/jersey/enlarge_logo.py
"""

import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "sunset"))
import upscale as sr  # noqa: E402


def main():
    img = cv2.imread(str(HERE / "logo-source.webp"), cv2.IMREAD_UNCHANGED)
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    a = img[..., 3:4].astype(np.float32) / 255
    rgb = (img[..., :3].astype(np.float32) * a + 255 * (1 - a)).astype(np.uint8)
    pad = 8                                   # room at the edges for the network
    rgb = cv2.copyMakeBorder(rgb, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(255, 255, 255))
    alpha = cv2.copyMakeBorder(img[..., 3], pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=0)
    path = sr.CACHE / sr.X4PLUS[1]
    if not path.exists():
        sr.CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(sr.X4PLUS[0] + sr.X4PLUS[1], path)
    sess = ort.InferenceSession(sr.build_rrdb(sr.load_pth(path)).SerializeToString(),
                                providers=["CPUExecutionProvider"])
    big = sr.upscale_tiled(sess, rgb)
    big_a = sr.upscale_tiled(sess, cv2.cvtColor(alpha, cv2.COLOR_GRAY2BGR)).mean(axis=2)
    p = pad * 4
    out = np.dstack([big, np.clip(big_a, 0, 255).astype(np.uint8)])[p:-p, p:-p]
    cv2.imwrite(str(HERE / "logo.png"), out)
    print(f"wrote logo.png ({out.shape[1]} x {out.shape[0]})")


if __name__ == "__main__":
    main()
