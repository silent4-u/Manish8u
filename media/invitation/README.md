# Wedding invitation video: Manish & Sushmita

`manish-sushmita-invitation.mp4` is a 44-second vertical (1080 × 1920)
digital wedding invitation, ready for WhatsApp, Instagram or Facebook
stories. Everything in it is drawn by `make_invitation.py`: there are no
photos, stock images or templates. The music, a tanpura drone with a
santoor-like melody in Raag Bhupali, a soft string pad and temple bells, is
composed by `music.py`.

| Time | Scene |
| --- | --- |
| 0–7 s | An ivory envelope on silk, sealed with red wax stamped **M&S**. The seal splits, the flap opens on a maroon lining, and the card rises out. |
| 7–12 s | **॥ श्री गणेशाय नमः ॥** over a lit brass diya, **शुभ विवाह**, and the parents' blessing. |
| 12–20 s | A gold arch onto the Himalaya at sunset with a pagoda temple. Marigold garlands drop in, and **Manish & Sushmita** is written on in gold, with **मनीष र सुस्मिता** below. |
| 20–26 s | The invitation, in English and Nepali. |
| 25–33 s | The programme: Haldi, Mehendi, Shubh Vivah and Pritibhoj. |
| 33–40 s | **Save the Date**, with the couple in silhouette in the arch, rim-lit by the sunset. |
| 40–44 s | The M&S seal and "Manish weds Sushmita". |

## Filling in the dates and venues

The cards say **"Date & venue to follow"** until the details are filled in.
Edit `DETAILS` at the top of `make_invitation.py`:

```python
"events": [
    ("Haldi", "हल्दी", "Mangsir 13 · 10 AM", "Groom's home, Kamal"),
    ...
],
"save_the_date": "Mangsir 15, 2083  ·  1 December 2026",
```

Then render again. The names and their Nepali spellings are set there too.

```sh
pip install numpy opencv-python-headless pillow imageio-ffmpeg
python3 media/invitation/make_invitation.py <fonts_dir>    # about 15 minutes on CPU
python3 media/invitation/make_invitation.py <fonts_dir> --stills 3,15,37 <out_dir>   # quick stills
```

`fonts_dir` must hold these fonts, all under the SIL Open Font License:

- Great Vibes, Cinzel Decorative and Tiro Devanagari Hindi, from the
  `@fontsource` packages on npm.
- Cormorant Garamond, Cinzel and Noto Serif Devanagari, from Google Fonts.
