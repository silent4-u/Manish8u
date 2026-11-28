"""News-channel style videos: a bulletin of top stories, or a breaking-news alert.

Each video has an intro sting, one segment per story and a closing card. On
screen: a channel bar with a live clock and the Nepali date, a rotating globe
behind, a category tag (and a red BREAKING banner for alerts), the headline,
a short summary and its source, a progress bar, and a scrolling ticker of the
other headlines. Under it: a narrated voice, a soft music bed and whooshes.

Only text is shown: no photos or footage from the news sites are used.
"""

import math
import subprocess
import tempfile
import wave
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import nepali_datetime
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from .site import bs_label
from .tts import read_wav, speak

SR = 44100
RED, NAVY, WHITE, GOLD = (200, 16, 46), (8, 18, 40), (255, 255, 255), (255, 196, 0)
FONT_DIRS = ["/usr/share/fonts/truetype/noto", "/usr/share/fonts/opentype/noto", "/usr/share/fonts/noto",
             "/usr/share/fonts/truetype/dejavu"]
LAYOUT = {
    "vertical": dict(W=1080, H=1920, top=140, globe=(540, 760, 470), x=70, w=940, banner=300, chip=430, head=510,
                     head_size=(86, 50), head_lines=5, sum_size=46, sum_lines=7, ticker=1688, tick_h=86, bottom=1774),
    "horizontal": dict(W=1920, H=1080, top=110, globe=(1520, 560, 400), x=90, w=1180, banner=160, chip=250, head=320,
                       head_size=(76, 46), head_lines=3, sum_size=40, sum_lines=4, ticker=930, tick_h=70, bottom=1000),
}


def has_devanagari(s):
    return any("\u0900" <= ch <= "\u097f" for ch in s)


_fonts = {}


def font(size, bold=False, devanagari=False):
    key = (size, bold, devanagari)
    if key not in _fonts:
        if devanagari:
            names = ["NotoSansDevanagari-Bold.ttf" if bold else "NotoSansDevanagari-Regular.ttf"]
        else:
            names = ["NotoSans-Bold.ttf", "DejaVuSans-Bold.ttf"] if bold else ["NotoSans-Regular.ttf", "DejaVuSans.ttf"]
        for path in (Path(d) / n for n in names for d in FONT_DIRS):
            if path.exists():
                try:
                    _fonts[key] = ImageFont.truetype(str(path), size, layout_engine=ImageFont.Layout.RAQM)
                except (OSError, KeyError):
                    _fonts[key] = ImageFont.truetype(str(path), size)
                break
        else:
            _fonts[key] = ImageFont.load_default(size)
    return _fonts[key]


LATIN_ONLY = set("·●•…—–‘’“”")


def runs(text):
    """Split text into (is_devanagari, piece) runs. The Nepali font has no
    English letters, and the English font no Devanagari, so each run is drawn
    in its own font. Spaces, digits and punctuation join the run before them."""
    out = []
    for ch in text:
        if "\u0900" <= ch <= "\u097f":
            kind = True
        elif ch.isalpha() or ch in LATIN_ONLY:
            kind = False
        else:
            kind = out[-1][0] if out else False
        if out and out[-1][0] == kind:
            out[-1][1] += ch
        else:
            out.append([kind, ch])
    return out


def width(d, text, size, bold=False):
    return sum(d.textlength(piece, font=font(size, bold, dev)) for dev, piece in runs(text))


def put(d, xy, text, size, bold=False, fill=WHITE, anchor="la"):
    """Draw mixed English/Nepali text. anchor: (l|m|r)(a|m|s), as in Pillow."""
    x, y = xy
    w = width(d, text, size, bold)
    x -= {"l": 0, "m": w / 2, "r": w}[anchor[0]]
    ascent, descent = font(size, bold, False).getmetrics()
    base = {"a": y + ascent, "m": y + (ascent - descent) / 2, "s": y}[anchor[1]]
    for dev, piece in runs(text):
        f = font(size, bold, dev)
        d.text((x, base), piece, font=f, fill=fill, anchor="ls")
        x += d.textlength(piece, font=f)


def wrap(d, text, size, bold, max_width):
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if width(d, trial, size, bold) <= max_width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def fit(d, text, max_width, sizes, max_lines, bold=True):
    """The largest size (stepping down) at which text fits in max_lines: (size, lines)."""
    big, small = sizes
    for size in range(big, small - 1, -4):
        lines = wrap(d, text, size, bold, max_width)
        if len(lines) <= max_lines:
            return size, lines
    lines = wrap(d, text, small, bold, max_width)[:max_lines]
    lines[-1] = lines[-1].rstrip(".,") + "…"
    return small, lines


def clean_text(t):
    return t.replace("[SAMPLE] ", "").replace(" (Sample story, made up for testing.)", "").strip()


def ease(u):
    u = min(max(u, 0.0), 1.0)
    return 1 - (1 - u) ** 3


# ---- the moving background --------------------------------------------------------

def gradient(W, H):
    y = np.linspace(0, 1, H)[:, None]
    x = np.linspace(0, 1, W)[None, :]
    r = 6 + 18 * (1 - y) + 10 * x
    g = 14 + 26 * (1 - y) + 8 * x
    b = 36 + 60 * (1 - y) + 20 * x
    img = np.stack([r + 0 * x, g + 0 * x, b + 0 * x], -1)
    yy, xx = np.mgrid[0:H, 0:W]                          # faint grid
    grid = ((yy % 60 == 0) | (xx % 60 == 0)) * 6
    return Image.fromarray(np.clip(img + grid[..., None], 0, 255).astype(np.uint8))


def globe_frames(radius, n):
    """A wireframe globe turning through one 15-degree step: loops seamlessly."""
    size = radius * 2 + 40
    frames = []
    tilt = math.radians(18)
    for k in range(n):
        rot = math.radians(15 * k / n)
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        c = size / 2

        def proj(lat, lon):
            x, y, z = math.cos(lat) * math.sin(lon + rot), math.sin(lat), math.cos(lat) * math.cos(lon + rot)
            y, z = y * math.cos(tilt) - z * math.sin(tilt), y * math.sin(tilt) + z * math.cos(tilt)
            return c + radius * x, c - radius * y, z

        def line(pts):
            for (x0, y0, z0), (x1, y1, z1) in zip(pts, pts[1:]):
                a = int(70 + 110 * max(0.0, (z0 + z1) / 2)) if (z0 + z1) > -0.2 else 22
                d.line([(x0, y0), (x1, y1)], fill=(120, 190, 255, a), width=2)

        for lon in range(0, 360, 15):
            line([proj(math.radians(la), math.radians(lon)) for la in range(-90, 91, 6)])
        for lat in range(-75, 90, 15):
            line([proj(math.radians(lat), math.radians(lo)) for lo in range(0, 361, 6)])
        d.ellipse([c - radius, c - radius, c + radius, c + radius], outline=(150, 210, 255, 120), width=3)
        frames.append(img)
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([20, 20, size - 20, size - 20], fill=(40, 110, 220, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(radius / 4))
    return frames, glow


# ---- the bulletin ---------------------------------------------------------------------

class Renderer:
    def __init__(self, cfg, fmt, kind, stories, now, sources=None):
        self.cfg, self.L, self.kind, self.stories, self.now = cfg, LAYOUT[fmt], kind, stories, now
        self.sources = sources or sorted({s["source"] for s in stories})
        L = self.L
        self.W, self.H, self.fps = L["W"], L["H"], cfg["video"]["fps"]
        self.ne = cfg["video"]["language"] == "ne"
        self.bg = gradient(self.W, self.H).convert("RGBA")
        self.globe, self.glow = globe_frames(L["globe"][2], 30)
        self.chrome = self.make_chrome()
        self.ticker_strip = self.make_ticker()

    def txt(self, story, key):
        ai = story.get("ai") or {}
        if self.ne:
            return ai.get({"title": "title_ne", "summary": "summary_ne"}[key]) or story[key]
        return (ai.get("summary_en") or story["summary"]) if key == "summary" else (ai.get("title_en") or story["title"])

    def label(self, en, ne):
        return ne if self.ne else en

    # the parts that never move
    def make_chrome(self):
        L, W = self.L, self.W
        img = Image.new("RGBA", (W, self.H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        d.rectangle([0, 0, W, L["top"]], fill=(5, 10, 24, 235))
        site = self.cfg["site"]
        bw = int(width(d, site["name_ne"], int(L["top"] * 0.34), True)) + 40
        d.rectangle([24, 22, 24 + bw, L["top"] - 22], fill=RED)
        put(d, (44, L["top"] / 2), site["name_ne"], int(L["top"] * 0.34), True, anchor="lm")
        put(d, (44 + bw, L["top"] / 2), site["name"].upper(), int(L["top"] * 0.30), True, anchor="lm")
        d.rectangle([0, L["top"], W, L["top"] + 6], fill=RED)
        # ticker frame and bottom bar
        t, th = L["ticker"], L["tick_h"]
        d.rectangle([0, t, W, t + th], fill=(245, 245, 245, 255))
        lab = self.label("TOP STORIES", "मुख्य समाचार")
        lw = int(width(d, lab, int(th * 0.42), True)) + 50
        d.rectangle([0, t, lw, t + th], fill=RED)
        d.polygon([(lw, t), (lw + 26, t + th / 2), (lw, t + th)], fill=RED)
        put(d, (24, t + th / 2), lab, int(th * 0.42), True, anchor="lm")
        self.ticker_x0 = lw + 40
        d.rectangle([0, L["bottom"], W, self.H], fill=(5, 10, 24, 240))
        put(d, (W / 2, (L["bottom"] + self.H) / 2), f'{site["base_url"].split("//")[-1].rstrip("/")}   ·   '
            f'{self.cfg["video"]["handles"]}', int((self.H - L["bottom"]) * 0.28), fill=(200, 210, 230), anchor="mm")
        return img

    def make_ticker(self):
        th = self.L["tick_h"]
        heads = [clean_text(self.txt(s, "title")) for s in self.stories] or [self.cfg["site"]["tagline"]]
        if self.kind == "alert":
            heads.append(self.label("Reported by: ", "स्रोत: ") + ", ".join(self.sources))
        text = "   •   ".join(heads) + "   •   "
        size = int(th * 0.44)
        tw = int(width(ImageDraw.Draw(Image.new("L", (1, 1))), text, size, True)) + 1
        strip = Image.new("RGBA", (tw * 2, th), (0, 0, 0, 0))
        d = ImageDraw.Draw(strip)
        for k in (0, 1):
            put(d, (k * tw, th / 2), text, size, True, fill=(20, 24, 32), anchor="lm")
        self.ticker_w = tw
        return strip

    def story_layers(self, s, idx, total):
        """Pre-rendered layers for one story: (headline block, summary block, y of summary)."""
        L, W = self.L, self.W
        x, w = L["x"], L["w"]
        head = Image.new("RGBA", (W, self.H), (0, 0, 0, 0))
        d = ImageDraw.Draw(head)
        cat = next((c for c in self.cfg["categories"] if c["slug"] == s["category"]), None)
        where = self.label("NEPAL" if s["region"] == "nepal" else "WORLD", "नेपाल" if s["region"] == "nepal" else "विश्व")
        cat_name = self.label(cat["name"].upper(), cat["name_ne"]) if cat else self.label("NEWS", "समाचार")
        chip = f"{where}  |  {cat_name}"
        cs = 36 if W < 1500 else 32
        cw = int(width(d, chip, cs, True)) + 36
        color = tuple(int(cat["color"][i:i + 2], 16) for i in (1, 3, 5)) if cat else (90, 90, 90)
        d.rounded_rectangle([x, L["chip"], x + cw, L["chip"] + 58], 8, fill=color)
        put(d, (x + 18, L["chip"] + 29), chip, cs, True, anchor="lm")
        if total > 1:
            put(d, (x + w, L["chip"] + 29), f"{idx}/{total}", 36, True, fill=(180, 195, 220), anchor="rm")
        title = clean_text(self.txt(s, "title"))
        size, lines = fit(d, title, w, L["head_size"], L["head_lines"])
        y = L["head"]
        lh = int(size * 1.3)
        for line in lines:
            put(d, (x + 3, y + 3), line, size, True, fill=(0, 0, 0, 160))
            put(d, (x, y), line, size, True)
            y += lh
        under_y = y + 18
        summ = Image.new("RGBA", (W, self.H), (0, 0, 0, 0))
        d2 = ImageDraw.Draw(summ)
        text = clean_text(self.txt(s, "summary"))
        ss = L["sum_size"]
        sy = under_y + 40
        for line in wrap(d2, text, ss, False, w)[:L["sum_lines"]]:
            put(d2, (x, sy), line, ss, fill=(215, 225, 240))
            sy += int(ss * 1.4)
        # an alert's sources go in the CONFIRMED BY card when it fits; otherwise a Source line
        if not (self.kind == "alert" and self.up_next(d2, idx, total, sy + 30)):
            src = self.label("Source: ", "स्रोत: ") + s["source"]
            put(d2, (x, sy + 24), src, 34, True, fill=GOLD)
            if self.kind != "alert":
                self.up_next(d2, idx, total, sy + 100)
        return head, summ, under_y

    def up_next(self, d, idx, total, top):
        """Vertical videos: a card in the space above the ticker: UP NEXT (the next
        headline), where to read more, or, for an alert, the sources that confirm it.
        Drawn only if the text above left room; returns whether it was drawn."""
        L = self.L
        if self.H < self.W:
            return False
        x, w = L["x"], L["w"]
        if self.kind == "alert":
            many = len(self.sources) > 1
            lab = self.label("CONFIRMED BY" if many else "REPORTED BY", "पुष्टि गर्ने स्रोत" if many else "स्रोत")
            text = "  ·  ".join(self.sources)
        elif idx < total:
            lab = self.label("UP NEXT", "अर्को समाचार")
            text = clean_text(self.txt(self.stories[idx], "title"))
        else:
            lab = self.label("FULL STORIES", "पूरा समाचार")
            text = self.cfg["site"]["base_url"].split("//")[-1].rstrip("/")
        size, lines = fit(d, text, w - 48, (40, 32), 2)
        y1 = L["ticker"] - 36
        y0 = y1 - (100 + int(len(lines) * size * 1.3))
        if top > y0:
            return False
        d.rounded_rectangle([x, y0, x + w, y1], 14, fill=(255, 255, 255, 28), outline=(255, 255, 255, 60), width=2)
        lw = int(width(d, lab, 30, True)) + 32
        d.rounded_rectangle([x + 24, y0 + 20, x + 24 + lw, y0 + 66], 8, fill=RED)
        put(d, (x + 40, y0 + 43), lab, 30, True, anchor="lm")
        ty = y0 + 80
        for line in lines:
            put(d, (x + 24, ty), line, size, True, fill=GOLD if self.kind == "alert" else (235, 240, 250))
            ty += int(size * 1.3)
        return True

    def intro_layer(self):
        img = Image.new("RGBA", (self.W, self.H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        site = self.cfg["site"]
        cy = self.H * 0.42
        put(d, (self.W / 2, cy), site["name_ne"], int(self.W * 0.12), True, anchor="mm")
        put(d, (self.W / 2, cy + self.W * 0.11), site["name"].upper(), int(self.W * 0.06), True,
            fill=(220, 228, 240), anchor="mm")
        if self.kind == "alert":
            sub = self.label("BREAKING NEWS ALERT", "ताजा खबर: आपतकालीन सूचना")
        else:
            sub = self.label(f"NEWS BULLETIN · {self.now:%I:%M %p}", f"समाचार बुलेटिन · {self.now:%H:%M}")
        sw = width(d, sub, int(self.W * 0.04), True) + 60
        y = cy + self.W * 0.2
        d.rectangle([self.W / 2 - sw / 2, y - 40, self.W / 2 + sw / 2, y + 40], fill=RED)
        put(d, (self.W / 2, y), sub, int(self.W * 0.04), True, anchor="mm")
        date = f"{self.now:%d %B %Y}   ·   {bs_label(nepali_datetime.date.from_datetime_date(self.now.date()))}"
        put(d, (self.W / 2, y + 90), date, int(self.W * 0.03), fill=(200, 210, 230), anchor="mm")
        return img

    def outro_layer(self):
        img = Image.new("RGBA", (self.W, self.H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        site = self.cfg["site"]
        cy = self.H * 0.40
        t1 = self.label("For more news", "थप समाचारका लागि")
        put(d, (self.W / 2, cy), t1, int(self.W * 0.055), True, anchor="mm")
        url = site["base_url"].split("//")[-1].rstrip("/")
        put(d, (self.W / 2, cy + self.W * 0.09), url, int(self.W * 0.045), True, fill=GOLD, anchor="mm")
        t2 = self.label(f"Follow {self.cfg['video']['handles']}", f"फलो गर्नुहोस् {self.cfg['video']['handles']}")
        put(d, (self.W / 2, cy + self.W * 0.18), t2, int(self.W * 0.04), fill=(210, 220, 235), anchor="mm")
        return img

    # one frame
    def frame(self, t, seg, segs):
        L, W, H = self.L, self.W, self.H
        f = self.bg.copy()
        gx, gy, gr = L["globe"]
        k = int(t * self.fps) % len(self.globe)
        off = (int(gx - self.glow.width / 2), int(gy - self.glow.height / 2))
        f.alpha_composite(self.glow, off)
        f.alpha_composite(self.globe[k], off)
        d = ImageDraw.Draw(f)
        for i in range(3):                                   # light streaks drifting across
            sx = (t * (90 + 40 * i) + i * 400) % (W + 600) - 300
            d.polygon([(sx, H * (0.25 + 0.2 * i)), (sx + 220, H * (0.25 + 0.2 * i)),
                       (sx + 120, H * (0.25 + 0.2 * i) + 6), (sx - 100, H * (0.25 + 0.2 * i) + 6)], fill=(90, 150, 255, 40))
        u = t - seg["start"]
        if seg["type"] == "intro":
            a = ease(u / 0.6)
            layer = seg["layer"]
            f.alpha_composite(fade(layer, a))
            bar = ease((u - 0.2) / 0.5) * W
            d.rectangle([0, H * 0.42 - self.W * 0.09, bar, H * 0.42 - self.W * 0.085], fill=RED)
        elif seg["type"] == "outro":
            f.alpha_composite(fade(seg["layer"], ease(u / 0.5)))
        else:
            head, summ, under_y = seg["layers"]
            slide = int((1 - ease(u / 0.55)) * -W * 0.25)
            f.alpha_composite(fade(head, ease(u / 0.45)), (slide, 0))
            d.rectangle([L["x"], under_y, L["x"] + ease((u - 0.3) / 0.6) * min(L["w"], 520), under_y + 8], fill=RED)
            f.alpha_composite(fade(summ, ease((u - 0.55) / 0.5)))
            if seg["story"].get("signal") or self.kind == "alert":
                if int(t * 2.5) % 2 == 0 or u < 0.6:
                    b = L["banner"]
                    lab = self.label("BREAKING NEWS", "ताजा खबर")
                    bs = 46 if W < 1500 else 40
                    bw = width(d, lab, bs, True) + 70
                    d.rectangle([L["x"], b, L["x"] + bw, b + 76], fill=RED)
                    put(d, (L["x"] + 35, b + 38), lab, bs, True, anchor="lm")
            p = min(u / seg["dur"], 1)                       # progress of this story
            d.rectangle([0, L["top"] + 6, W * p, L["top"] + 14], fill=GOLD)
        f.alpha_composite(self.chrome)
        d = ImageDraw.Draw(f)
        tx = self.ticker_x0
        shift = int(t * 140) % self.ticker_w
        crop = self.ticker_strip.crop((shift, 0, shift + W - tx, L["tick_h"]))
        f.alpha_composite(crop, (tx, L["ticker"]))
        clock = (self.now + timedelta(seconds=t)).strftime("%H:%M:%S")
        fc = font(int(L["top"] * 0.26), True)
        d.text((W - 30, L["top"] * 0.36), clock, font=fc, fill=WHITE, anchor="rm")
        live_on = int(t * 2) % 2 == 0
        lw = d.textlength("LIVE", font=font(int(L["top"] * 0.2), True))
        lx = W - 30 - d.textlength(clock, font=fc) - lw - 60
        d.rounded_rectangle([lx, L["top"] * 0.22, lx + lw + 30, L["top"] * 0.5], 6, fill=RED if live_on else (110, 20, 30))
        d.text((lx + 15, L["top"] * 0.36), "LIVE", font=font(int(L["top"] * 0.2), True), fill=WHITE, anchor="lm")
        date = bs_label(nepali_datetime.date.from_datetime_date(self.now.date())) + f"  ·  {self.now:%d %b %Y}"
        put(d, (W - 30, L["top"] * 0.74), date, int(L["top"] * 0.19), fill=(190, 200, 220), anchor="rm")
        if seg.get("wipe_in") and u < 0.35:                  # red wipe between stories
            wx = W * (u / 0.35)
            d.polygon([(wx - 140, L["top"] + 14), (wx + 60, L["top"] + 14), (wx - 60, L["ticker"]), (wx - 260, L["ticker"])],
                      fill=RED)
        return f.convert("RGB")


def fade(layer, a):
    if a >= 0.999:
        return layer
    out = layer.copy()
    out.putalpha(layer.getchannel("A").point(lambda v: int(v * a)))
    return out


# ---- sound ------------------------------------------------------------------------

def music_bed(seconds):
    t = np.arange(int(seconds * SR)) / SR
    chords = [(220.0, 277.18, 329.63), (196.0, 246.94, 293.66), (174.61, 220.0, 261.63), (196.0, 246.94, 311.13)]
    bed = np.zeros_like(t)
    for i, ch in enumerate(chords * int(seconds // 8 + 1)):
        s, e = int(i * 2 * SR), int((i + 1) * 2 * SR)
        if s >= len(t):
            break
        seg = t[s:min(e, len(t))] - t[s]
        env = np.minimum(seg / 0.4, 1) * np.minimum((2 - seg) / 0.4, 1)
        for fq in ch:
            bed[s:s + len(seg)] += 0.08 * np.sin(2 * np.pi * fq * seg) * env
    beat = 0.6                                                # a soft pulse at 100 bpm
    for b in np.arange(0, seconds, beat):
        i = int(b * SR)
        n = min(int(0.18 * SR), len(t) - i)
        k = np.arange(n) / SR
        bed[i:i + n] += 0.22 * np.sin(2 * np.pi * (70 - 120 * k) * k) * np.exp(-k * 22)
        j = int((b + beat / 2) * SR)
        if j < len(t):
            m = min(int(0.04 * SR), len(t) - j)
            bed[j:j + m] += 0.03 * np.random.default_rng(j).standard_normal(m) * np.exp(-np.arange(m) / SR * 90)
    return bed


def whoosh(length=0.5):
    n = int(length * SR)
    x = np.random.default_rng(3).standard_normal(n)
    k = np.arange(n) / n
    env = np.sin(np.pi * k) ** 2
    x = np.convolve(x, np.ones(9) / 9, "same")
    return 0.35 * x * env


def hit():
    n = int(1.2 * SR)
    k = np.arange(n) / SR
    return 0.6 * np.sin(2 * np.pi * (55 + 40 * np.exp(-k * 8)) * k) * np.exp(-k * 3) + \
        0.15 * np.sin(2 * np.pi * 880 * k) * np.exp(-k * 4)


# ---- making a video -----------------------------------------------------------------------

def narration(cfg, kind, stories, now):
    ne = cfg["video"]["language"] == "ne"
    site = cfg["site"]
    if kind == "alert":
        intro = f"{site['name_ne']}। ताजा खबर।" if ne else f"{site['name']}. Breaking news."
    else:
        part = "morning" if now.hour < 11 else "afternoon" if now.hour < 16 else "evening"
        intro = f"{site['name_ne']}। अहिलेका मुख्य समाचार।" if ne else f"This is {site['name']}. Here are the top stories this {part}."
    lines = []
    for s in stories:
        ai = s.get("ai") or {}
        if ne:
            title, summ = ai.get("title_ne") or s["title"], ai.get("summary_ne") or ""
        else:
            title, summ = ai.get("title_en") or s["title"], ai.get("summary_en") or ""
        lines.append([title.rstrip(".") + ".", summ] if summ else [title.rstrip(".") + "."])
    outro = "थप समाचारका लागि हाम्रो वेबसाइट हेर्नुहोस्।" if ne else f"For more news, visit {site['name']} online."
    return intro, lines, outro


def make(cfg, kind, stories, out_dir, log=print, sources=None):
    """Render the video(s) for a bulletin or an alert. Returns {format: path}."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    tz = ZoneInfo(cfg["site"]["timezone"])
    now = datetime.now(tz)
    lang = cfg["video"]["language"]
    intro_t, lines, outro_t = narration(cfg, kind, stories, now)
    made = {}
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        voices, engine = [], None
        for i, text in enumerate([intro_t] + lines + [outro_t]):
            p = tmp / f"v{i}.wav"
            engine = speak(text, lang, cfg, p, log)
            voices.append(read_wav(p))
        log(f"  voice: {engine}")
        durs = [max(3.2, len(voices[0]) / SR + 0.8)]
        durs += [max(6.0, len(v) / SR + 1.2) for v in voices[1:-1]]
        durs += [max(3.5, len(voices[-1]) / SR + 0.8)]
        total = sum(durs)
        # the sound track
        mix = music_bed(total + 1) * (0.55 if cfg["video"]["music"] else 0)
        speech = np.zeros_like(mix)
        start = 0.0
        for i, (v, dur) in enumerate(zip(voices, durs)):
            s = int((start + (0.5 if i else 0.7)) * SR)
            speech[s:s + len(v)] += v[:len(speech) - s]
            if i:
                w = whoosh()
                j = int(start * SR)
                mix[j:j + len(w)] += w[:len(mix) - j]
            start += dur
        h = hit()
        mix[:len(h)] += h
        duck = np.convolve((np.abs(speech) > 0.01).astype(float), np.ones(SR // 5) / (SR // 5), "same")
        track = mix * (1 - 0.8 * np.clip(duck * 3, 0, 1)) + speech * 1.0     # music dips under the voice
        track = track[:int(total * SR)]
        track = track / max(1e-6, np.abs(track).max()) * 0.89
        wav = tmp / "audio.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(2), w.setsampwidth(2), w.setframerate(SR)
            pcm = (track * 32767).astype(np.int16)
            w.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())

        for fmt in cfg["video"]["formats"]:
            r = Renderer(cfg, fmt, kind, stories, now, sources)
            segs, start = [], 0.0
            segs.append({"type": "intro", "start": 0, "dur": durs[0], "layer": r.intro_layer()})
            start = durs[0]
            for i, (s, dur) in enumerate(zip(stories, durs[1:-1]), 1):
                segs.append({"type": "story", "start": start, "dur": dur, "story": s, "wipe_in": True,
                             "layers": r.story_layers(s, i, len(stories))})
                start += dur
            segs.append({"type": "outro", "start": start, "dur": durs[-1], "layer": r.outro_layer(), "wipe_in": True})
            out = out_dir / f"{kind}-{fmt}.mp4"
            cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{r.W}x{r.H}",
                   "-r", str(r.fps), "-i", "-", "-i", str(wav), "-c:v", "libx264", "-preset", "medium", "-crf", "23",
                   "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(out)]
            proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
            n = int(total * r.fps)
            poster_t = segs[1]["start"] + 2.5 if len(segs) > 2 else 1.5
            for k in range(n):
                t = k / r.fps
                seg = next(sg for sg in reversed(segs) if t >= sg["start"])
                img = r.frame(t, seg, segs)
                if abs(t - poster_t) < 0.5 / r.fps:
                    img.save(out.with_suffix(".jpg"), quality=88)
                proc.stdin.write(img.tobytes())
            proc.stdin.close()
            if proc.wait() != 0:
                raise RuntimeError("ffmpeg failed")
            made[fmt] = out
            log(f"  video: {out.name}, {total:.0f} s, {r.W}x{r.H}")
    return made
