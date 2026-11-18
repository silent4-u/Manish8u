# A misty sunrise, made cinematic

`photo.webp` is a phone photo (1848 × 4000): an orange sky, the sun rising
red through mist between two trees, two power lines across the top, and a
dark field filling the bottom 40%. A filter had already been applied to it:
its darkest tone is a lifted grey (L 54 of 255), so it looks faded.
`cinematic.py` sharpens it and grades it like a film still, in two frames.

| File | Size | What it is |
| --- | --- | --- |
| `sunrise-cinematic.jpg` | 2160 × 2700 (4:5) | Portrait, for a feed post |
| `sunrise-cinematic-wide.jpg` | 3840 × 2160 (4K) | A 2.39:1 movie frame round the sun, between black bars |
| `before-after.jpg` | | The photo and the two frames side by side |

How it is made:

1. **Clean.** A faint red ghost of the sun on the dark field, a reflection
   inside the phone's lens, is filled in by LaMa
   (`../old-photo/deep_clean.py`).
2. **Frame.** Both frames leave out the empty dark field.
   - The portrait starts just below the power lines, so they are gone.
   - The movie frame (2.39:1, as in cinemas) sets the sun between the
     trees, above the mist.
3. **Sharper.**
   - Real-ESRGAN (`../sunset/upscale.py`) enlarges each frame 4x, blended
     half and half with a plain Lanczos enlargement, then takes it down to
     its size.
   - The portrait runs in strips of 231 rows, which map to exactly 270 rows
     out, so the strips meet without a seam.
4. **Grade.**
   - The faded grey blacks are set back to near black, and the mid-tones
     get an S-curve, for depth.
   - Split toning gives the classic film palette: the shadows and the mist
     go a cool teal, the sky and the sun a deeper orange.
   - A little local contrast makes the leaves and branches against the
     mist crisp. It is eased in the darkest parts, so the dark leaves do
     not take on a painted sheen.
5. **Light.**
   - A soft warm glow (halation) surrounds the sun and the bright sky near
     it, as film gives a strong light.
   - A vignette is centred a little towards the sun.
6. **Finish.** A light sharpening on lightness alone, and a film grain,
   which also keeps the smooth sky from banding.

The strengths are set at the top of `cinematic.py`: `BLACK`, `CONTRAST`,
`COOL`, `WARM`, `CLARITY`, `HALATION`, `VIGNETTE` and `GRAIN`. `PORTRAIT`
and `SCOPE` set the frames.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/sunrise-cinematic/cinematic.py      # about 2 minutes on CPU
```

The Real-ESRGAN and LaMa models download on first use. They are cached in
`~/.cache`, not in the repository.
