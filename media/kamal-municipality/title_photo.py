"""Compose the final titled photo: graded source.jpg with the municipality's
name set in the clear sky on the upper right.

    python3 media/kamal-municipality/title_photo.py [fonts_dir]

Fonts (Google Fonts, OFL): Tiro Devanagari Hindi for the Nepali name and
Cinzel / Cormorant Garamond for the English lines. Pillow needs libraqm to
shape the Devanagari conjuncts correctly.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
FONTS = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "fonts"
OUTPUT = HERE / "kamal-municipality-title.jpg"

IVORY = (255, 248, 236)
GOLD = (222, 180, 98)
MAROON = (139, 30, 30)

NEPALI = "कमल गाउँपालिका"
ENGLISH = "KAMAL RURAL MUNICIPALITY"
PLACE = "Topgachhi  ·  Jhapa  ·  Koshi Province, Nepal"


def font(name, size, weight=None):
    f = ImageFont.truetype(str(FONTS / name), size, layout_engine=ImageFont.Layout.RAQM)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])
        except OSError:
            pass
    return f


def grade(img):
    """The video's look: warm highlights, teal shadows, richer greens and reds."""
    a = np.asarray(img, np.float32) / 255.0
    h, w = a.shape[:2]
    lum = (a @ np.array([0.2126, 0.7152, 0.0722], np.float32))[..., None]
    out = lum + (a - lum) * 1.25
    hi = np.clip((lum - 0.45) / 0.5, 0, 1)
    lo = 1 - np.clip(lum / 0.4, 0, 1)
    out += hi * np.array([0.06, 0.03, -0.045]) + lo * np.array([-0.015, 0.01, 0.025])
    out = np.clip(out, 0, 1)
    out = out + 0.2 * out * (1 - out) * (2 * out - 1)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    sun = np.exp(-(((xx - w * 0.9) / (w * 0.7)) ** 2 + ((yy + h * 0.1) / (h * 0.7)) ** 2))
    out += sun[..., None] * 0.10 * np.array([1.0, 0.72, 0.32])
    vig = 1 - 0.32 * (((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) ** 1.3
    out *= np.clip(vig, 0.5, 1)[..., None]
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


def spaced(draw, xy_centre, text, fnt, fill, tracking):
    """Draw text centred at xy_centre with extra letter spacing."""
    widths = [draw.textlength(ch, font=fnt) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = xy_centre[0] - total / 2
    for ch, cw in zip(text, widths):
        draw.text((x, xy_centre[1]), ch, font=fnt, fill=fill, anchor="lm")
        x += cw + tracking
    return total


def lotus(draw, cx, cy, s, fill):
    """A small five-petal lotus, the name's own emblem (कमल = lotus)."""
    def petal(angle, length, width):
        pts = []
        for t in np.linspace(0, 1, 30):
            r = length * t
            half = width * np.sin(np.pi * t) ** 0.9 * (1 - 0.25 * t)
            pts.append((r, half))
        pts += [(r, -hw) for r, hw in reversed(pts)]
        ca, sa = np.cos(angle), np.sin(angle)
        return [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in pts]

    for ang, ln, wd in ((-160, 0.75, 0.26), (-20, 0.75, 0.26), (-125, 0.95, 0.32), (-55, 0.95, 0.32), (-90, 1.1, 0.36)):
        draw.polygon(petal(np.radians(ang), ln * s, wd * s), fill=fill)
    draw.ellipse((cx - 0.12 * s, cy - 0.12 * s, cx + 0.12 * s, cy + 0.12 * s), fill=fill)


def main():
    src = Image.open(HERE / "source.jpg").convert("RGB")
    W, H = src.size
    base = grade(src).convert("RGBA")

    cx = int(W * 0.812)  # centre of the clear sky, right of the flag and the tree
    y_np, y_rule, y_en, y_place = int(H * 0.110), int(H * 0.168), int(H * 0.200), int(H * 0.232)

    f_np = font("TiroDevanagariHindi-Regular.ttf", int(W * 0.041))
    f_en = font("Cinzel[wght].ttf", int(W * 0.0128), weight=600)
    f_pl = font("CormorantGaramond[wght].ttf", int(W * 0.0118), weight=500)

    text = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(text)
    d.text((cx, y_np), NEPALI, font=f_np, fill=IVORY + (255,), anchor="mm")
    en_w = spaced(d, (cx, y_en), ENGLISH, f_en, IVORY + (240,), tracking=W * 0.0036)
    d.text((cx, y_place), PLACE, font=f_pl, fill=IVORY + (200,), anchor="mm")

    # Divider: hairlines either side of the lotus.
    half = en_w / 2
    gap = W * 0.018
    d.line((cx - half, y_rule, cx - gap, y_rule), fill=GOLD + (230,), width=max(2, W // 900))
    d.line((cx + gap, y_rule, cx + half, y_rule), fill=GOLD + (230,), width=max(2, W // 900))
    lotus(d, cx, y_rule + W * 0.005, W * 0.011, GOLD + (255,))

    # A soft shadow for legibility against the bright cloud, and a warm glow
    # on the name itself, instead of an outline or a box.
    alpha = text.split()[3]
    shadow = Image.new("RGBA", base.size, (20, 14, 10, 0))
    shadow.putalpha(alpha.filter(ImageFilter.GaussianBlur(W * 0.006)).point(lambda v: int(v * 0.75)))
    glow = Image.new("RGBA", base.size, GOLD + (0,))
    glow.putalpha(alpha.filter(ImageFilter.GaussianBlur(W * 0.012)).point(lambda v: int(v * 0.45)))

    # A faint dark wash behind the block so it reads on any monitor.
    wash = Image.new("L", base.size, 0)
    ImageDraw.Draw(wash).ellipse(
        (cx - W * 0.17, y_np - H * 0.07, cx + W * 0.17, y_place + H * 0.05), fill=45
    )
    wash = wash.filter(ImageFilter.GaussianBlur(W * 0.04))
    dark = Image.new("RGBA", base.size, (25, 20, 18, 0))
    dark.putalpha(wash)

    out = Image.alpha_composite(base, dark)
    out = Image.alpha_composite(out, shadow)
    out = Image.alpha_composite(out, glow)
    out = Image.alpha_composite(out, text)
    out.convert("RGB").save(OUTPUT, quality=95, subsampling=0)
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
