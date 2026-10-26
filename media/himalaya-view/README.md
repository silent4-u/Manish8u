# The Himalaya over the foothills: cleared, graded, in 4K

`himalaya-before.jpg` is a phone photo of the snow massif over hazy foothills.
`enhance.py` clears the haze from the hills, sharpens them and gives the view
a cinematic grade, in two 4K frames:

| File | Size | What it is |
| --- | --- | --- |
| `himalaya-4k.jpg` | 2160 × 3840 | The whole photo, 4K UHD portrait |
| `himalaya-4k-cinemascope.jpg` | 3840 × 2160 | The peak and its ranges, 2.39:1 inside a 16:9 4K frame |

`himalaya-before-after.jpg` compares the portrait with the photo.

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
   The two ranges just under the snow (`NEAR_PEAK`) are the farthest and
   haziest hills. They get more help: less haze kept, a higher stretch limit,
   and extra local contrast at the scale of their ridges and forest patches.
   They still stay lighter than the hills in front, and nothing else in the
   picture changes.
4. **Focus.** The foreground leaves are softly out of focus, as if the lens
   were focused on the mountain: gently in the portrait, more in the
   widescreen frame, where they are big and close. The blur is a lens disc
   applied to the leaves alone. The mask also takes in the leaves' drip tips
   and the bright rims the phone's sharpening drew round them, so no sharp
   outline is left.
5. **Grade, for the look of a film still.**
   - **Snow:** golden morning light, a soft halation round its brightest
     edges, cool shadows, and the brightest snow rolled off rather than
     clipped.
   - **Sky:** a polariser-like deepening towards the top, with a faint warm
     glow along the horizon.
   - **Hills:** blue-green shadows, the near ridge a little greener than the
     far hills.
   - **Leaves:** darkened to frame the view.
   - **Finish:** a filmic curve with a slightly lifted black, a vignette and
     fine grain.

The widescreen frame is rendered from the photo at its own scale (about
3.6x), not cut from the portrait. At that scale the hills hold their shapes
and texture but not fine detail: that is as much as the photo holds.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/himalaya-view/enhance.py      # about 1.5 minutes on CPU
```
