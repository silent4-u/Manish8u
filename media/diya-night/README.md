# A festival night: clearer, sharper and warmer

`photo.webp` is a phone photo (1848 × 3460) of a courtyard at night: fairy
lights hanging from the eaves, a woman in a blue saree lighting a diya by a
red curtain, a rangoli ringed with diyas, and dark steps in front. The
phone's night mode has smoothed it, so fine detail and her face are soft,
and the steps are nearly black. `enhance.py` makes it clearer, sharper and
warmer, and keeps it a real photo.

| File | Size | What it is |
| --- | --- | --- |
| `diya-night.jpg` | 2051 × 3840 | The photo, enhanced |
| `before-after.jpg` | | The photo and the new one side by side |

How it is made:

1. **Clean.** A blue lens-flare dot on the dark step, a reflection inside
   the phone's lens, is filled in by LaMa (`../old-photo/deep_clean.py`)
   from the step round it.
2. **Sharper.**
   - Real-ESRGAN (`../sunset/upscale.py`) enlarges it 4x, blended half and
     half with a plain Lanczos enlargement, then takes it down to 3840 px
     tall.
   - It runs in strips of 346 rows, which map to exactly 384 rows out, so
     the strips meet without a seam.
3. **Her face.** It is only about 60 px across in the photo. CodeFormer
   (`../old-photo/regenerate_faces.py`) redraws it at high fidelity (0.9),
   so her eyes, brows and lips come out clear while the face stays hers.
   At 0.7 it began to change her features, so it is kept at 0.9.
4. **Light.**
   - The shadows are opened up, most in the darkest parts, so the steps,
     the tiled ramp and the banana plant come out of the black.
   - The mid-tones get a gentle S-curve, so it does not go flat.
   - The harsh bulb over the curtain is softened.
   - Local contrast brings out the carved vent, the pillars and the
     curtain's pattern.
5. **Colour.** A warm shift gives the festive evening look, in place of the
   bulb's cold white. The softer colours get a little more depth.
6. **Glow.** Each small light gets a soft warm glow, as the eye sees it: the
   fairy-light bulbs, the coiled light strings and the diya flames. The big
   bulb gets none.
7. **Finish.** A soft vignette, a light sharpening on lightness alone, and
   a fine grain, so it reads as a photo.

The strengths are set at the top of `enhance.py`: `SHADOWS`, `CONTRAST`,
`WARM`, `VIBRANCE`, `CLARITY`, `GLOW`, `VIGNETTE` and `FACE_FIDELITY`.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/diya-night/enhance.py      # about 2 minutes on CPU
```

The models download on first use and are cached in `~/.cache`, not in the
repository: Real-ESRGAN, LaMa, CodeFormer and the face detector.
