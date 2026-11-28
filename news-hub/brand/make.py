"""Profile picture, YouTube banner and Facebook cover in the videos' style.

    python brand/make.py

Reads the channel's name from config.yaml (site.name and site.name_ne), so
after renaming the channel, run this again.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

from newshub import load_config                                   # noqa: E402
from newshub.video import RED, WHITE, globe_frames, gradient, put, width   # noqa: E402

TAGLINE = "Nepal & world news  ·  नेपाल र विश्वका ताजा समाचार"


def background(W, H, globe_r, gx, gy):
    img = gradient(W, H).convert("RGBA")
    frames, glow = globe_frames(globe_r, 1)
    off = (int(gx - glow.width / 2), int(gy - glow.height / 2))
    img.alpha_composite(glow, off)
    img.alpha_composite(frames[0], off)
    return img


def bell(d, cx, cy, h, fill=WHITE):
    """A simple bell, h pixels tall, centred on (cx, cy)."""
    w = h * 0.9
    top = cy - h / 2
    d.ellipse([cx - h * 0.08, top, cx + h * 0.08, top + h * 0.16], fill=fill)                  # the loop
    d.chord([cx - w * 0.36, top + h * 0.1, cx + w * 0.36, top + h * 0.75], 180, 360, fill=fill)  # the dome
    d.polygon([(cx - w * 0.36, top + h * 0.42), (cx + w * 0.36, top + h * 0.42),
               (cx + w * 0.5, top + h * 0.8), (cx - w * 0.5, top + h * 0.8)], fill=fill)          # the skirt
    d.rounded_rectangle([cx - w * 0.54, top + h * 0.76, cx + w * 0.54, top + h * 0.86], h * 0.04, fill=fill)
    d.ellipse([cx - h * 0.1, top + h * 0.84, cx + h * 0.1, top + h * 1.0], fill=fill)          # the clapper


def logo(img, cx, mid, s, name, name_ne, tagline=None):
    """The red name box (bell + Nepali name), the English name under it and an
    optional tagline, the whole block centred on (cx, mid). s = Nepali text size."""
    d = ImageDraw.Draw(img)
    rows = s * (2.6 if tagline else 2.05)
    top = mid - rows / 2
    tw = width(d, name_ne, s, True)
    bh = s * 0.95                                  # bell height
    gap = s * 0.28
    inner = bh + gap + tw
    pad = s * 0.38
    box = [cx - inner / 2 - pad, top, cx + inner / 2 + pad, top + s * 1.5]
    d.rounded_rectangle(box, int(s * 0.18), fill=RED)
    bell(d, box[0] + pad + bh / 2, top + s * 0.75, bh)
    put(d, (box[0] + pad + bh + gap, top + s * 0.75), name_ne, s, True, anchor="lm")
    put(d, (cx, box[3] + s * 0.42), name.upper(), int(s * 0.42), True, fill=WHITE, anchor="mm")
    if tagline:
        put(d, (cx, box[3] + s * 0.95), tagline, int(s * 0.24), fill=(200, 212, 232), anchor="mm")


def main():
    site = load_config()["site"]
    name, name_ne = site["name"], site["name_ne"]

    W = 1080                                       # profile picture: inside the centre circle
    img = background(W, W, 430, W / 2, W / 2)
    logo(img, W / 2, W / 2, 150, name, name_ne)
    img.convert("RGB").save(HERE / "profile-picture.png")

    W, H = 2560, 1440                              # YouTube: text inside the centre 1546x423
    img = background(W, H, 520, W / 2 + 640, H / 2)
    logo(img, W / 2 - 330, H / 2, 140, name, name_ne, TAGLINE)
    img.convert("RGB").save(HERE / "youtube-banner.png", optimize=True)

    W, H = 1640, 924                               # Facebook cover: clear of the globe
    img = background(W, H, 380, W / 2 + 520, H / 2)
    logo(img, W / 2 - 270, H / 2, 104, name, name_ne, TAGLINE)
    img.convert("RGB").save(HERE / "facebook-cover.png", optimize=True)
    print("brand: profile-picture.png, youtube-banner.png, facebook-cover.png")


if __name__ == "__main__":
    main()
