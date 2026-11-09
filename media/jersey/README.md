# कमल गाउँपालिका jersey

A white half-collar (polo collar) jersey. The front has the निशान छाप, as on
the gaun palika's letter pad, with one winning star above it. The back has
कमल गाउँपालिका in a semicircular arch, with झापा set inside it.

| File | Size | What it is |
| --- | --- | --- |
| `jersey-board.png` | 2400 × 1300 | Front and back side by side, with the logo and star and a button up close, and the colours |
| `jersey-front.png` | 2000 × 2000 | The front |
| `jersey-back.png` | 2000 × 2000 | The back |
| `print-crest-star.png` | 1200 × 1880, transparent | The logo with its star, flat, for the printer |
| `print-back-name.png` | 3324 × 1401, transparent | The arched name with झापा inside it, for the printer |
| `logo-source.webp` | 250 × 211 | The निशान छाप as received |
| `logo.png` | 1000 × 844, transparent | The निशान छाप enlarged 4x for printing |

## The design

| Part | What it is |
| --- | --- |
| Shirt | White piqué knit, with short set-in sleeves and ribbed cuffs. The back hem is a little longer than the front's, and there are side vents at the hem with bar tacks. |
| Collar | A polo collar of knitted rib, tipped with a navy and a crimson stripe, the colours of Nepal's flag (the cuffs too). Its back rises round the neck. Inside, a navy neck tape and a size label show. |
| Placket | Two buttons, piped navy and crimson. The buttons are domed gold metal, each with a navy rim, two engraved rings and a glint of light, over stitched buttonholes. |
| Logo | The निशान छाप on the left chest. |
| Star | One winning star above the logo, the only star on the shirt. It is gold, and each arm is faceted light and dark like a medal. It has a navy outline and a soft gold glow, so it stands out though it is not large. |
| Back | कमल गाउँपालिका in a semicircular arch (140°) across the shoulders. Below its crown, inside the arch, is झापा. Both are in Khand Bold, navy with a thin crimson shadow. |

The mock-ups are made to look like a real shirt laid flat. Its folds are lit
from the upper left, and its body is rounded from the middle to the sides.
The sleeves are shaded to their undersides, and the edges darken as the
cloth turns away. The piqué knit shows close up. All of this lies over the
prints too.

Devanagari set along a curve breaks its headline (the shirorekha), because
each letter turns on its own. So the name is set straight first, then bent
into the arch: its headline stays one unbroken curve, and the letters fan
out as printed arch lettering does.

## Colours

| Colour | Hex | Where |
| --- | --- | --- |
| White | — | The shirt |
| Navy | `#0B2E6B` | Tipping, piping, the neck tape, the star's outline, the back lettering |
| Crimson | `#C8102E` | Tipping, piping, the back lettering's shadow |
| Gold | `#F2B705` | The star and its glow, the buttons |

## For the printer

- **Logo.** Left chest, about 9 cm wide. Its top sits about 9 cm below the
  shoulder seam. `logo.png` is at about 280 dpi at this size.
- **Star.** Centred about 1.5 cm above the logo, about 5 cm across.
- **Back.** The arch is about 30 cm wide and 12.5 cm high, centred, with
  झापा inside it, in the upper middle of the back: its top sits about
  11 cm below the collar.
  `print-back-name.png` is at about 280 dpi at this size.
- **Buttons.** Gold metal shank buttons, about 15 mm.
- **Method.** The faceted gold star, its glow and the logo's colours print
  best by sublimation or DTF. For screen printing, the star can be flat gold
  with a navy outline, and no glow.
- **The emblem.** The निशान छाप is Nepal's national emblem, and its use is
  regulated. Check with the gaun palika office before printing.

## Making it

`enlarge_logo.py` enlarges `logo-source.webp` 4x with RealESRGAN_x4plus. The
emblem's colour is enlarged over white and its transparency on its own, so
its edges and the motto on its ribbon stay crisp. It writes `logo.png`.

`make_jersey.py` draws everything as vector art (SVG). Headless Chromium
(Playwright) renders it, so the Devanagari is shaped properly.
- **Logo.** It takes `logo.png` (or `.jpg`, `.webp`, `.svg`) if there is one.
  A plain white background round it is made transparent. Without one, it
  draws its own crest: a shield with a lotus before snow peaks.
- **Fonts.** These are fetched from Google Fonts on the first run: Khand Bold
  for the Devanagari, Montserrat for the labels.

```sh
npm install playwright        # Chromium, for rendering
python3 media/jersey/enlarge_logo.py
python3 media/jersey/make_jersey.py
```
