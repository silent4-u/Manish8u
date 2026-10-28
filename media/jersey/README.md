# कमल गाउँपालिका jersey

A white half-collar (polo collar) jersey. It has a crest and one winning star
on the front, and कमल गाउँपालिका in a semicircular arch across the back.

| File | Size | What it is |
| --- | --- | --- |
| `jersey-board.png` | 2400 × 1300 | Front and back side by side, with the crest and star up close and the colours |
| `jersey-front.png` | 2000 × 2000 | The front |
| `jersey-back.png` | 2000 × 2000 | The back |
| `print-crest-star.png` | 1200 × 1880, transparent | The crest with its star, flat, for the printer |
| `print-back-name.png` | 3324 × 1401, transparent | The arched name for the back, for the printer |

## The design

| Part | What it is |
| --- | --- |
| Shirt | White, with a polo collar over a two-button placket. It has short set-in sleeves with ribbed cuffs. The collar and cuffs are tipped with a navy and a crimson stripe, the colours of Nepal's flag. |
| Star | One winning star above the crest. It is large and gold, and each arm is faceted light and dark, so it catches the eye like a medal. It has a navy outline and two small sparkles beside it. |
| Crest | A shield with a navy and gold rim. A crimson band at the top carries कमल. Below it, a lotus (कमल) stands before snow peaks, over water. |
| Back | कमल गाउँपालिका in a semicircular arch (140°) across the shoulders, in Khand Bold, navy with a thin crimson shadow. |

The crest is an original design. To use the gaun palika's official logo
instead, save it here as `logo.png` (or `.jpg`, `.webp`, `.svg`) and run the
script again. A plain white background round it is made transparent, and the
star stays above it.

Devanagari set along a curve breaks its headline (the shirorekha), because
each letter turns on its own. So the name is set straight first, then bent
into the arch: its headline stays one unbroken curve, and the letters fan
out as printed arch lettering does.

## Colours

| Colour | Hex | Where |
| --- | --- | --- |
| White | — | The shirt |
| Navy | `#0B2E6B` | Tipping, the star's outline, the crest's rim, the back name |
| Crimson | `#C8102E` | Tipping, the crest's band, the back name's shadow |
| Gold | `#F2B705` | The star, the crest's inner rim |
| Lotus pink | `#E8508A` | The lotus |

## For the printer

- **Crest.** Left chest, about 8 cm wide. Its top sits about 8 cm below the
  shoulder seam.
- **Star.** Centred about 1 cm above the crest, about 6 cm across.
  `print-crest-star.png` is at about 250 dpi at this size.
- **Back name.** The arch is about 30 cm wide and 12.5 cm high, centred. Its
  top sits about 8 cm below the collar. `print-back-name.png` is at about
  280 dpi at this size.
- **Method.** The faceted gold star and the crest's colours print best by
  sublimation or DTF. For screen printing, the star can be flat gold with a
  navy outline.

## Making it

`make_jersey.py` draws everything as vector art (SVG). Headless Chromium
(Playwright) renders it, so the Devanagari is shaped properly. Soft folds,
a fine knit texture and the stitching lie over everything, prints
included, so the flat lay reads as cloth. The fonts are fetched from Google
Fonts on the first run: Khand Bold for the Devanagari, Montserrat for the
labels.

```sh
npm install playwright        # Chromium, for rendering
python3 media/jersey/make_jersey.py
```
