"""A jersey for कमल गाउँपालिका: a white half-collar (polo collar) T-shirt,
with the crest and one winning star on the front and the name on the back.

  jersey-board.png       front and back side by side, the crest and star up
                         close, and the colours
  jersey-front.png       the front, 2000 x 2000
  jersey-back.png        the back, 2000 x 2000
  print-crest-star.png   the crest with its star, for the printer (transparent)
  print-back-name.png    the name for the back, for the printer (transparent)

The design is drawn as vector art (SVG) and rendered in a headless browser,
which shapes the Devanagari properly:

  shirt    white, a polo collar over a two-button placket, set-in short
           sleeves with ribbed cuffs; the collar and cuffs tipped with a navy
           and a crimson stripe, the colours of Nepal's flag
  crest    a shield: a crimson band with the name कमल, and below it a lotus
           (कमल) before the snow peaks, over water, in a navy and gold rim
  star     one winning star above the crest, large and gold, each arm faceted
           light and dark so it catches the eye like a medal, outlined in navy
           with two small sparkles
  back     कमल गाउँपालिका across the shoulders in Khand Bold, navy with a
           thin crimson shadow

The flat lay is made to look like cloth: soft folds and shading over
everything (prints included), a fine knit texture, stitching at the seams.

    npm install playwright        # Chromium, for rendering
    python3 media/jersey/make_jersey.py
"""

import math
import subprocess
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
CACHE = Path.home() / ".cache" / "jersey"
FONTS = {
    "Khand": "https://raw.githubusercontent.com/google/fonts/main/ofl/khand/Khand-Bold.ttf",
    "Montserrat": "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf",
}

NAME = "कमल गाउँपालिका"
SHORT = "कमल"
WHITE = "#FAFAF8"
NAVY = "#0B2E6B"
CRIMSON = "#C8102E"
GOLD = "#F2B705"
LOTUS = "#E8508A"

# The shirt, in a 1000 x 1000 view: body and sleeves, front and back (the
# back's neckline is higher, under the collar). About as wide across the
# chest as 0.65 of its length, as a polo shirt laid flat.
SHIRT = ("M 395 150 C 340 165 290 178 232 190 L 88 352 L 192 452 L 262 380 "
         "C 258 560 266 760 272 900 C 400 920 600 920 728 900 C 734 760 742 560 738 380 "
         "L 808 452 L 912 352 L 768 190 C 710 178 660 165 605 150 ")
FRONT_NECK = "C 575 172 535 186 500 188 C 465 186 425 172 395 150 Z"
BACK_NECK = "C 565 132 435 132 395 150 Z"
VIEW = (1000, 1000)
CREST_AT, CREST_W = (632, 428), 104       # the crest's centre and width on the front (the left chest)
STAR_AT, STAR_R = (632, 318), 48          # the star's centre and outer radius, above it


def font_css():
    CACHE.mkdir(parents=True, exist_ok=True)
    css = ""
    for name, url in FONTS.items():
        path = CACHE / url.rsplit("/", 1)[1].replace("%5B", "[").replace("%5D", "]")
        if not path.exists():
            urllib.request.urlretrieve(url, path)
        css += f"@font-face{{font-family:'{name}';src:url('{path.as_uri()}');}}"
    return css


def defs():
    return f"""
<defs>
  <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#3a3530" flood-opacity="0.22"/>
  </filter>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="softer" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="lift" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="1.5" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.16"/>
  </filter>
  <filter id="knit" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 0.75" in="n"/>
  </filter>
  <pattern id="mesh" width="5" height="5" patternUnits="userSpaceOnUse">
    <circle cx="1.2" cy="1.2" r="0.7" fill="#000" fill-opacity="0.045"/>
    <circle cx="3.7" cy="3.7" r="0.7" fill="#000" fill-opacity="0.035"/>
  </pattern>
  <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F1F0EC"/>
  </linearGradient>
  <linearGradient id="inside" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#E9E8E4"/><stop offset="1" stop-color="#C9C7C2"/>
  </linearGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#BFDDF7"/><stop offset="1" stop-color="#F4F9FE"/>
  </linearGradient>
  <linearGradient id="goldL" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFF1B0"/><stop offset="0.55" stop-color="#FFD23F"/><stop offset="1" stop-color="#F2B705"/>
  </linearGradient>
  <linearGradient id="goldD" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F0B400"/><stop offset="1" stop-color="#B57A00"/>
  </linearGradient>
  <clipPath id="shirtF"><path d="{SHIRT}{FRONT_NECK}"/></clipPath>
  <clipPath id="shirtB"><path d="{SHIRT}{BACK_NECK}"/></clipPath>
</defs>"""


def star_points(cx, cy, R, r):
    pts = []
    for k in range(10):
        a = -math.pi / 2 + k * math.pi / 5
        rad = R if k % 2 == 0 else r
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    return pts


def star(cx, cy, R, sparkle=True, shadow=True):
    """The winning star: five arms, each split along its ridge into a light
    and a dark facet, gold, in a navy outline; and two small sparkles."""
    pts = star_points(cx, cy, R, R * 0.45)
    poly = " ".join(f"{x:.2f},{y:.2f}" for x, y in pts)
    facets = ""
    for k in range(0, 10, 2):
        tip, left, right = pts[k], pts[k - 1], pts[(k + 1) % 10]
        facets += (f'<polygon points="{cx},{cy} {tip[0]:.2f},{tip[1]:.2f} {left[0]:.2f},{left[1]:.2f}" fill="url(#goldL)"/>'
                   f'<polygon points="{cx},{cy} {tip[0]:.2f},{tip[1]:.2f} {right[0]:.2f},{right[1]:.2f}" fill="url(#goldD)"/>')
    lift = ' filter="url(#lift)"' if shadow else ""
    out = (f'<g{lift}><polygon points="{poly}" fill="{NAVY}" stroke="{NAVY}" '
           f'stroke-width="{R * 0.16:.2f}" stroke-linejoin="round"/>'
           f'{facets}<polygon points="{poly}" fill="none" stroke="#FFF6CC" stroke-width="{R * 0.03:.2f}" '
           f'stroke-linejoin="round" opacity="0.8"/></g>')
    if sparkle:
        for (dx, dy, s) in ((1.15, -0.75, 0.22), (-1.2, -0.35, 0.15)):
            x, y, a = cx + dx * R, cy + dy * R, s * R
            out += (f'<path d="M {x} {y - a} Q {x} {y} {x + a} {y} Q {x} {y} {x} {y + a} Q {x} {y} {x - a} {y} '
                    f'Q {x} {y} {x} {y - a} Z" fill="{GOLD}" stroke="{NAVY}" stroke-width="{R * 0.025:.2f}"/>')
    return out


def lotus(cx, base, s):
    """A lotus in bloom, s wide: back petals light, front petals deep pink."""
    def petal(angle, h, w, fill):
        return (f'<path d="M 0 0 C {w / 2} {-h * 0.3} {w / 2} {-h * 0.72} 0 {-h} C {-w / 2} {-h * 0.72} {-w / 2} {-h * 0.3} 0 0 Z" '
                f'fill="{fill}" stroke="#A3245E" stroke-width="{s * 0.018:.2f}" transform="translate({cx} {base}) rotate({angle})"/>')
    out = "".join(petal(a, s * 0.5, s * 0.26, "#F6AECA") for a in (-62, 62, -32, 32))
    out += "".join(petal(a, s * 0.56, s * 0.3, LOTUS) for a in (-18, 18))
    out += petal(0, s * 0.62, s * 0.3, "#EE6A9C")
    out += f'<ellipse cx="{cx}" cy="{base - s * 0.02}" rx="{s * 0.16}" ry="{s * 0.05}" fill="{GOLD}"/>'
    return out


def crest(cx, cy, w, shadow=True):
    """The crest, w wide, centred at (cx, cy): a navy shield with a gold rim;
    a crimson band with कमल; a lotus before snow peaks, over water."""
    k = w / 100
    shield = "M 4 0 H 96 Q 100 0 100 4 V 52 C 100 82 78 104 50 118 C 22 104 0 82 0 52 V 4 Q 0 0 4 0 Z"
    t = f"translate({cx - 50 * k} {cy - 59 * k}) scale({k})"
    lift = ' filter="url(#lift)"' if shadow else ""
    inner = "translate(50 59) scale({0}) translate(-50 -59)"
    return f"""
<g transform="{t}"{lift}>
  <clipPath id="field{cx}"><path d="{shield}" transform="{inner.format(0.86)}"/></clipPath>
  <path d="{shield}" fill="{NAVY}"/>
  <path d="{shield}" fill="{GOLD}" transform="{inner.format(0.92)}"/>
  <path d="{shield}" fill="#FFFFFF" transform="{inner.format(0.86)}"/>
  <g clip-path="url(#field{cx})">
    <rect x="0" y="0" width="100" height="118" fill="url(#sky)"/>
    <polygon points="6,76 24,50 33,58 46,36 60,55 70,46 94,76" fill="#FFFFFF" stroke="#8FB0D8" stroke-width="1.2" stroke-linejoin="round"/>
    <polygon points="46,36 52,52 47,60 41,48" fill="#C7DAF0"/>
    <polygon points="24,50 28,58 22,64" fill="#C7DAF0"/>
    <polygon points="70,46 76,58 70,62" fill="#C7DAF0"/>
    <rect x="0" y="74" width="100" height="44" fill="#DDEFF9"/>
    {lotus(50, 93, 44)}
    <path d="M 8 98 Q 18 94 28 98 T 48 98 T 68 98 T 88 98 T 108 98" fill="none" stroke="#2E78C0" stroke-width="2.4"/>
    <path d="M 14 105 Q 24 101 34 105 T 54 105 T 74 105 T 94 105" fill="none" stroke="{NAVY}" stroke-width="2.4"/>
    <rect x="0" y="0" width="100" height="31" fill="{CRIMSON}"/>
    <rect x="0" y="31" width="100" height="2.2" fill="{GOLD}"/>
    <text x="50" y="26.5" text-anchor="middle" font-family="Khand" font-weight="700" font-size="23" fill="#FFFFFF">{SHORT}</text>
  </g>
</g>"""


def tipping(edge, clip, wide=1.0):
    """Two stripes, crimson and navy, just inside an edge (within clip)."""
    return (f'<g clip-path="url(#{clip})" fill="none" stroke-linejoin="round">'
            f'<path d="{edge}" stroke="{NAVY}" stroke-width="{22 * wide}"/>'
            f'<path d="{edge}" stroke="#FFFFFF" stroke-width="{16 * wide}"/>'
            f'<path d="{edge}" stroke="{CRIMSON}" stroke-width="{12 * wide}"/>'
            f'<path d="{edge}" stroke="#FFFFFF" stroke-width="{6 * wide}"/></g>')


def cuffs():
    out = ""
    for sgn in (1, -1):
        X = (lambda x: x) if sgn == 1 else (lambda x: 1000 - x)
        a, b = (X(88), 352), (X(192), 452)
        ux, uy = (X(232) - X(88)) / 216.7, (190 - 352) / 216.7    # along the sleeve, towards the shoulder
        d = 26
        c, e = (b[0] + ux * d, b[1] + uy * d), (a[0] + ux * d, a[1] + uy * d)
        band = f"M {a[0]} {a[1]} L {b[0]} {b[1]} L {c[0]:.1f} {c[1]:.1f} L {e[0]:.1f} {e[1]:.1f} Z"
        cid = f"cuff{sgn}"
        ribs = "".join(
            f'<line x1="{a[0] + (b[0] - a[0]) * f:.1f}" y1="{a[1] + (b[1] - a[1]) * f:.1f}" '
            f'x2="{a[0] + (b[0] - a[0]) * f + ux * d:.1f}" y2="{a[1] + (b[1] - a[1]) * f + uy * d:.1f}" '
            f'stroke="#000" stroke-opacity="0.05" stroke-width="1"/>' for f in [i / 40 for i in range(1, 40)])
        out += (f'<clipPath id="{cid}"><path d="{band}"/></clipPath><path d="{band}" fill="#F7F7F4"/>{ribs}'
                f'<g clip-path="url(#{cid})"><path d="M {a[0]} {a[1]} L {b[0]} {b[1]}" stroke="{NAVY}" stroke-width="20"/>'
                f'<path d="M {a[0]} {a[1]} L {b[0]} {b[1]}" stroke="#FFFFFF" stroke-width="14"/>'
                f'<path d="M {a[0]} {a[1]} L {b[0]} {b[1]}" stroke="{CRIMSON}" stroke-width="10"/>'
                f'<path d="M {a[0]} {a[1]} L {b[0]} {b[1]}" stroke="#FFFFFF" stroke-width="4"/></g>'
                f'<path d="M {e[0]:.1f} {e[1]:.1f} L {c[0]:.1f} {c[1]:.1f}" stroke="#BDBBB5" stroke-width="1.2" '
                f'stroke-dasharray="3 3"/>')
    return out


def stitching(view):
    seams = [
        "M 232 190 C 248 260 258 330 262 380", "M 768 190 C 752 260 742 330 738 380",
        "M 276 884 C 400 903 600 903 724 884",
    ]
    return "".join(f'<path d="{d}" fill="none" stroke="#B9B6B0" stroke-width="1.3" stroke-dasharray="4 3.5"/>'
                   for d in seams)


def folds(clip):
    """Soft folds and shading over everything, prints included (multiplied)."""
    dark = [
        ("M 262 392 C 300 470 320 560 314 650 C 292 560 276 470 262 392 Z", 0.30),
        ("M 738 392 C 700 470 680 560 686 650 C 708 560 724 470 738 392 Z", 0.30),
        ("M 330 700 C 430 676 540 690 650 730 C 540 718 430 712 330 726 Z", 0.12),
        ("M 262 380 L 192 452 L 214 462 L 274 412 Z", 0.28),
        ("M 738 380 L 808 452 L 786 462 L 726 412 Z", 0.28),
        ("M 272 900 C 400 920 600 920 728 900 L 728 862 C 600 880 400 880 272 862 Z", 0.14),
    ]
    light = [
        ("M 360 560 C 440 520 560 520 640 560 C 560 545 440 545 360 560 Z", 0.5),
        ("M 330 262 C 400 236 460 234 500 240 C 450 252 400 262 330 296 Z", 0.35),
    ]
    out = f'<g clip-path="url(#{clip})"><g filter="url(#soft)" style="mix-blend-mode:multiply">'
    out += "".join(f'<path d="{d}" fill="#6b6457" fill-opacity="{o}"/>' for d, o in dark)
    out += ('<rect x="222" y="170" width="64" height="760" fill="#6b6457" fill-opacity="0.09"/>'
            '<rect x="714" y="170" width="64" height="760" fill="#6b6457" fill-opacity="0.09"/></g>')
    out += '<g filter="url(#soft)" style="mix-blend-mode:screen">'
    out += "".join(f'<path d="{d}" fill="#FFFFFF" fill-opacity="{o}"/>' for d, o in light)
    out += '</g>'
    out += ('<rect x="0" y="0" width="1000" height="1000" fill="url(#mesh)"/>'
            '<rect x="0" y="0" width="1000" height="1000" filter="url(#knit)" opacity="0.05" style="mix-blend-mode:multiply"/>'
            '</g>')
    return out


def front():
    left_leaf = "M 500 188 C 466 185 426 172 395 150 C 386 186 400 236 432 268 C 456 242 480 214 500 188 Z"
    right_leaf = "M 500 188 C 534 185 574 172 605 150 C 614 186 600 236 568 268 C 544 242 520 214 500 188 Z"
    opening = "M 403 156 C 438 130 562 130 597 156 C 572 174 534 186 500 188 C 466 186 428 174 403 156 Z"
    stand = "M 395 150 C 432 116 568 116 605 150 L 597 156 C 562 130 438 130 403 156 Z"
    return f"""
<g filter="url(#drop)">
  <path d="{SHIRT}{FRONT_NECK}" fill="url(#body)" stroke="#D6D3CD" stroke-width="1.4"/>
</g>
{cuffs()}
{stitching("front")}
<path d="{opening}" fill="url(#inside)"/>
<path d="{stand}" fill="#FAFAF8" stroke="#D3D0CA" stroke-width="1.2"/>
<g>
  <path d="M 485 196 H 515 V 334 Q 515 346 500 348 Q 485 346 485 334 Z" fill="#FBFBF9" stroke="#CFCCC6" stroke-width="1.2"/>
  <path d="M 489 200 V 334 Q 489 342 500 343 Q 511 342 511 334 V 200" fill="none" stroke="#BDBBB5" stroke-width="1" stroke-dasharray="3 3"/>
  {''.join(f'<circle cx="500" cy="{y}" r="6.5" fill="#FFFFFF" stroke="#BEBBB4" stroke-width="1.2"/><circle cx="498" cy="{y}" r="1" fill="#9a978f"/><circle cx="502" cy="{y}" r="1" fill="#9a978f"/>' for y in (240, 294))}
</g>
<clipPath id="leafL"><path d="{left_leaf}"/></clipPath><clipPath id="leafR"><path d="{right_leaf}"/></clipPath>
<g filter="url(#lift)"><path d="{left_leaf}" fill="#FCFCFA"/><path d="{right_leaf}" fill="#FCFCFA"/></g>
{tipping("M 395 150 C 386 186 400 236 432 268 C 456 242 480 214 500 188", "leafL", 0.8)}
{tipping("M 605 150 C 614 186 600 236 568 268 C 544 242 520 214 500 188", "leafR", 0.8)}
<path d="{left_leaf}" fill="none" stroke="#D3D0CA" stroke-width="1.2"/>
<path d="{right_leaf}" fill="none" stroke="#D3D0CA" stroke-width="1.2"/>
{crest(*CREST_AT, CREST_W)}
{star(*STAR_AT, STAR_R)}
{folds("shirtF")}"""


def back():
    band = "M 395 150 C 432 124 568 124 605 150 L 601 170 C 566 150 434 150 399 170 Z"
    return f"""
<g filter="url(#drop)">
  <path d="{SHIRT}{BACK_NECK}" fill="url(#body)" stroke="#D6D3CD" stroke-width="1.4"/>
</g>
{cuffs()}
{stitching("back")}
<clipPath id="band"><path d="{band}"/></clipPath>
<g filter="url(#lift)"><path d="{band}" fill="#FCFCFA"/></g>
{tipping("M 399 170 C 434 150 566 150 601 170", "band", 0.7)}
<path d="{band}" fill="none" stroke="#D3D0CA" stroke-width="1.2"/>
<g font-family="Khand" font-weight="700" font-size="74" text-anchor="middle">
  <text x="502.8" y="338" fill="{CRIMSON}">{NAME}</text>
  <text x="500" y="335" fill="{NAVY}">{NAME}</text>
</g>
{folds("shirtB")}"""


def svg(body, w=VIEW[0], h=VIEW[1], extra=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'{defs()}{extra}{body}</svg>')


def html(content, w, h, bg="transparent"):
    return (f"<!doctype html><html><head><meta charset='utf-8'><style>{font_css()}"
            f"html,body{{margin:0;background:{bg};width:{w}px;height:{h}px;overflow:hidden}}</style></head>"
            f"<body>{content}</body></html>")


SHOT = """
const { chromium } = require('playwright');
(async () => {
  const jobs = JSON.parse(process.argv[1]);
  const browser = await chromium.launch();
  for (const [page_, out, w, h, s] of jobs) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: s });
    await page.goto('file://' + page_);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, omitBackground: true });
    await page.close();
  }
  await browser.close();
})();
"""


def render(jobs):
    """Render (html, png, width, height, scale) pages with headless Chromium."""
    import json
    work = CACHE / "pages"
    work.mkdir(parents=True, exist_ok=True)
    args = []
    for i, (page, out, w, h, s) in enumerate(jobs):
        p = work / f"page{i}.html"
        p.write_text(page, encoding="utf-8")
        args.append([str(p), str(out), w, h, s])
    subprocess.run(["node", "-e", SHOT, json.dumps(args)], check=True)
    for _, out, *_ in jobs:
        print(f"wrote {Path(out).name}")


def board():
    """Front and back side by side on a soft background, with the title, the
    crest and star up close, and the colours."""
    W, H = 2400, 1300
    swatch = lambda x, y, col, name, hexv: (
        f'<rect x="{x}" y="{y}" width="64" height="64" rx="12" fill="{col}" stroke="#CFCBC3"/>'
        f'<text x="{x + 82}" y="{y + 28}" font-family="Montserrat" font-weight="600" font-size="22" fill="#3A3631">{name}</text>'
        f'<text x="{x + 82}" y="{y + 56}" font-family="Montserrat" font-size="19" fill="#86807A">{hexv}</text>')
    body = f"""
<rect width="{W}" height="{H}" fill="#EEEBE5"/>
<text x="120" y="118" font-family="Khand" font-weight="700" font-size="76" fill="{NAVY}">{NAME}</text>
<text x="124" y="166" font-family="Montserrat" font-weight="500" font-size="26" letter-spacing="3" fill="#86807A">JERSEY · WHITE HALF COLLAR</text>
<g transform="translate(60 170) scale(1.05)">{front()}</g>
<text x="585" y="1225" text-anchor="middle" font-family="Montserrat" font-weight="600" font-size="26" letter-spacing="4" fill="#5E5852">FRONT · अगाडि</text>
<g transform="translate(990 170) scale(1.05)">{back()}</g>
<text x="1515" y="1225" text-anchor="middle" font-family="Montserrat" font-weight="600" font-size="26" letter-spacing="4" fill="#5E5852">BACK · पछाडि</text>
<rect x="2010" y="210" width="300" height="420" rx="24" fill="#FFFFFF" stroke="#DDD8CF"/>
<g>{star(2160, 330, 70, sparkle=True)}{crest(2160, 520, 150)}</g>
<text x="2160" y="670" text-anchor="middle" font-family="Montserrat" font-weight="600" font-size="20" letter-spacing="3" fill="#5E5852">CREST + STAR</text>
{swatch(2030, 740, WHITE, "White", "base")}
{swatch(2030, 830, NAVY, "Navy", NAVY)}
{swatch(2030, 920, CRIMSON, "Crimson", CRIMSON)}
{swatch(2030, 1010, GOLD, "Gold", GOLD)}
{swatch(2030, 1100, LOTUS, "Lotus pink", LOTUS)}
"""
    return html(svg(body, W, H), W, H)


def main():
    jobs = [
        (board(), HERE / "jersey-board.png", 2400, 1300, 1),
        (html(svg(f'<rect width="1000" height="1000" fill="#EEEBE5"/>{front()}'), 1000, 1000), HERE / "jersey-front.png", 1000, 1000, 2),
        (html(svg(f'<rect width="1000" height="1000" fill="#EEEBE5"/>{back()}'), 1000, 1000), HERE / "jersey-back.png", 1000, 1000, 2),
        (html(svg(star(150, 120, 92, sparkle=False, shadow=False) + crest(150, 330, 200, shadow=False), 300, 470), 300, 470),
         HERE / "print-crest-star.png", 300, 470, 4),
        (html(svg(f'<g font-family="Khand" font-weight="700" font-size="120" text-anchor="middle">'
                  f'<text x="455" y="128" fill="{CRIMSON}">{NAME}</text><text x="450" y="123" fill="{NAVY}">{NAME}</text></g>',
                  900, 170), 900, 170), HERE / "print-back-name.png", 900, 170, 4),
    ]
    render(jobs)


if __name__ == "__main__":
    main()
