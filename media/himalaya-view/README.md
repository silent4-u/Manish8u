# The Himalaya over the foothills: cleared and graded

`himalaya-cinematic.jpg` (2160 × 3840) is `himalaya-before.jpg`, a phone
photo of the snow massif over hazy foothills, with the haze cleared from the
middle hills and a natural cinematic finish. `himalaya-before-after.jpg` puts
the two side by side.

`enhance.py` makes it:

1. **Regions.** It finds the sky, the foreground leaves, the snow massif and
   the hazy distance in between.
2. **Haze.** The dark channel prior measures how much haze lies over each
   part of the hills, and a guided filter makes that follow the ridgelines.
   Only part of the haze is removed: the haze kept is the square root of the
   haze there. Far hills are cleared most but still sit lighter and bluer
   than near ones, so the depth survives. Lightness is lifted fully, but
   colour only by a quarter, after the JPEG colour noise is smoothed, so no
   false colours appear.
3. **Detail.** Real-ESRGAN (from `../sunset/upscale.py`) enlarges the
   picture. It is blended by region: fully on the hills, partly on the snow,
   lightly on the leaves (which the phone had already sharpened) and not at
   all on the sky. The hills' forests and ridgelines are then sharpened at
   two scales, with the strongest edges limited so no halos form.
4. **Grade.**
   - **Snow:** local contrast in its rock and ridges, warm highlights, cool
     shadows, and the brightest snow rolled off rather than clipped.
   - **Sky:** a polariser-like deepening towards the top.
   - **Hills:** the near ridge a little greener than the far hills.
   - **Leaves:** calmed and slightly darkened to frame the view.
   - **Finish:** a gentle filmic curve, a soft vignette and fine grain.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/himalaya-view/enhance.py      # under a minute on CPU
```
