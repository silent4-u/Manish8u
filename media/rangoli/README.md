# The rangoli, made more attractive and still real

`photo.webp` is a phone photo (1848 × 4000) of a powder rangoli on a
concrete floor, taken from above, with the photographer's feet at the
bottom. `enhance.py` makes it more attractive without redrawing anything:
every grain of powder is the photo's own.

| File | Size | What it is |
| --- | --- | --- |
| `rangoli.jpg` | 1800 × 2250 (4:5) | The rangoli |
| `before-after.jpg` | | The photo and the new one side by side |

How it is made:

1. **Frame.** It is cut to 4:5, centred on the rangoli, from just above the
   sandals, so the rangoli stands on its own. 4:5 is also the shape
   Instagram and Facebook show largest.
2. **Floor.**
   - The debris on the bare floor is filled in by LaMa
     (`../old-photo/deep_clean.py`) from the floor round it: a flake of
     plastic, a lump and specks of spilled powder, and a stray thread.
   - Each fleck is found by its bright core, then grown out into its fainter
     edges, so no ghost is left. The concrete's own grain (specks under
     20 px) is left alone.
   - The concrete's blotches are evened out by about half, so it reads as a
     calm grey ground, with its texture kept.
3. **Colour.** The photo was a little cool: the white powder was bluish and
   the concrete greenish. A small warm shift makes the white powder clean
   and the floor a natural grey.
4. **Rangoli.**
   - A little more colour depth. The softer colours get more of it than the
     strong ones, so nothing turns neon.
   - A little local contrast, so the combed ridges and the grain of the
     powder stand out.
   - The whites are lifted a touch.
5. **Light.** A soft vignette darkens the floor towards the corners, so the
   eye goes to the rangoli. A light sharpening is applied on lightness
   alone.

The strengths are set at the top of `enhance.py`: `WARM`, `EVEN`,
`VIBRANCE`, `CLARITY` and `VIGNETTE`. `CROP` sets the frame.

```sh
pip install numpy opencv-python-headless onnxruntime
python3 media/rangoli/enhance.py
```

The LaMa model downloads on first use. It is cached in `~/.cache/lama`, not
in the repository.
