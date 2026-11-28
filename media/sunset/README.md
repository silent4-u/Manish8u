# One sunset, three shots

`sunset-cinematic.jpg` (2160 × 2700, 4:5) is a single photo merged from three
phone shots of the same sunset. They were taken from the same balcony
moments apart, at different zooms and exposures.

| Shot | What it brings |
| --- | --- |
| `sunset-tower.jpg` | The composition: tower, roof, poles, sun and clouds. It is the frame the others are mapped into. |
| `sunset-sun.jpg` | The longest zoom: the sharpest sun disc and cloud texture |
| `sunset-wide.jpg` | The wide, brighter exposure: light in the shadows |

The three shots arrived through WhatsApp: 591 px wide and heavily
JPEG-compressed. `upscale.py` first enlarges each one 4× with two Real-ESRGAN
models:

- **`RealESRGAN_x4plus`** gives the crispest edges and cleanest surfaces.
  It is RRDBNet: 23 residual-in-residual dense blocks, run in overlapping
  tiles.
- **`realesr-general-x4v3`** is the light model for real-world photos. It
  gives a more natural texture.

PyTorch isn't needed. The released checkpoints are read with a small
unpickler, each network is rebuilt as an ONNX graph, and onnxruntime runs it
on the CPU, in about 8 minutes for all three shots with both models. The
weights download to `~/.cache/realesrgan` on first use. The upscaled PNGs are
left out of git.

The merge leads with the crisp model. In the shadows, where it paints foliage
too smoothly, it mixes in the light model and a little of the plainly
enlarged original.

`merge_sunset.py` then does the merge in four steps:

1. **Align.** It aligns each shot to the tower shot with a SIFT and RANSAC
   homography. Because the camera only turned and zoomed, the sun lands
   within a few pixels in all three.
2. **Fuse.** It fuses the three in a Laplacian pyramid, like an exposure
   bracket: each pixel favours the shot that is best exposed there.
3. **Use only real detail.** Each shot adds only the level of detail it
   really has at this size. The wide shot is enlarged about five times, so it
   lifts the shadows but adds none of its blur. The long zoom gives the
   finest clouds, and only where it agrees with the tower shot.
4. **Grade.** It aims at a clean camera file:
   - golden highlights and slightly deeper shadows
   - more depth in the clouds
   - a graduated sky
   - a soft bloom around the sun
   - a light vignette
   - edge-aware denoising in the deepest shadows only
   - fine luminance sharpening, capped so no halo forms
   - just enough fine noise to keep the sky from banding

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/sunset/upscale.py        # 4x sources; the merge falls back to the JPEGs without them
python3 media/sunset/merge_sunset.py
```
