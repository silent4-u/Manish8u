# Wedding invitation video: Manish & Sushmita

## Second edition: one continuous film

`manish-sushmita-invitation-2.mp4` (49 s, 1080 × 1920) is made by
`make_invitation2.py`. It is filmed as one continuous camera move, with
moving light and particles rather than titles fading over cards:

| Time | Scene |
| --- | --- |
| 0–7 s | Dark velvet. A falling spark lights a brass diya. Its light draws a gold mandala ring by ring around **M&S**, the rings turning against each other, and the camera dives into the mandala's heart. |
| 7–14 s | An envelope flies up in 3D. The wax seal bursts into rose petals and gold sparks, the flap opens, and the card flies out at the camera, turning over to show the blessing. |
| 14–23 s | The camera pushes through the card's arch window into a paper-cut Nepal: the Himalaya at sunrise, a stupa with prayer flags, a pagoda, birds and turning sun rays, each layer at its own depth. A sparkler writes **Manish & Sushmita** across the sky, shedding glitter. |
| 23–30 s | Dusk turns to night, sky lanterns rise from the valley, and the invitation appears among the stars in English and Nepali. |
| 30–37 s | A turning prism shows each ceremony in turn: Haldi, Mehendi, Shubh Vivah, Pritibhoj. |
| 37–44 s | The couple on a hilltop under the moon. Fireflies drift in and gather into a heart above them: **Save the Date**. |
| 44–49 s | The camera tilts up into the stars, which join into **M ♥ S**: Manish weds Sushmita. |

The score (`music.render2`) adds a soft tabla keherwa under the middle of
the film, a whoosh for each camera move, sparkler crackle, and rising bell
chimes when the mandala draws, when night falls and when the heart forms.

```sh
python3 media/invitation/make_invitation2.py <fonts_dir>     # about 20 minutes on CPU
```

The names, events and dates come from `DETAILS` in `make_invitation.py`,
which both editions share.

## First edition

`manish-sushmita-invitation.mp4` (7 MB) is a 44-second vertical (1080 × 1920)
digital wedding invitation, ready for WhatsApp, Instagram or Facebook
stories. Everything in it is drawn by `make_invitation.py`: there are no
photos, stock images or templates. The music, a tanpura drone with a
santoor-like melody in Raag Bhupali, a soft string pad and temple bells, is
composed by `music.py`. `invitation-poster.jpg` is a still from it, for a thumbnail
or a first message.

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
