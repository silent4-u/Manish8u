"""Black-and-white version of the restored photo.

A channel mix close to luminance, leaning a little on red so skin stays
smooth, then soft levels that keep detail in the pale clothes and in the
faces, a mild S-curve, and a touch of local contrast.

    python3 media/old-photo/black_and_white.py
"""

from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "friends-restored-4k.jpg"
OUTPUT = HERE / "friends-restored-4k-bw.jpg"

MIX = np.array([0.12, 0.53, 0.35], np.float32)    # B, G, R weights


def main():
    img = cv2.imread(str(SOURCE)).astype(np.float32) / 255
    g = img @ MIX
    # Levels: deep blacks, whites kept just short of clipping.
    lo, hi = np.percentile(g, (0.3, 99.95))
    g = np.clip((g - lo) / (hi - lo), 0, 1) * 0.90 + 0.04
    g = g ** 1.12                                   # pull the mid-tones down off the paper white
    # Gentle S-curve.
    g = g + 0.08 * g * (1 - g) * (2 * g - 1)
    # Light local contrast at face scale.
    blur = cv2.GaussianBlur(g, (0, 0), 24)
    g = np.clip(g + (g - blur) * 0.12, 0, 1)
    cv2.imwrite(str(OUTPUT), (g * 255 + 0.5).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
