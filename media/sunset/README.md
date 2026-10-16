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
JPEG-compressed. `upscale.py` first enlarges each one 4× with Real-ESRGAN.
It uses `realesr-general-x4v3`, the model trained for real-world photos with
JPEG damage, set to a moderate denoise strength. That removes the blocking
and banding in the sky and sharpens the edges.

PyTorch isn't needed. The released checkpoint is read with a small
unpickler, the network is rebuilt as an ONNX graph, and onnxruntime runs it
on the CPU in about 30 seconds for all three. The weights download to
`~/.cache/realesrgan` on first use. The `-x4.png` files it writes are left
out of git.

The upscaler paints foliage a little too smoothly, so in the shadows the
merge mixes some of the plainly enlarged original back in. In the sky it
uses the upscale as it is.

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
4. **Grade.** Golden highlights, slightly deeper shadows, more depth in the
   clouds, a graduated sky, a soft bloom around the sun, a vignette and a
   fine film grain, so the cleaned-up sources still read as a photograph.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/sunset/upscale.py        # 4x sources; the merge falls back to the JPEGs without them
python3 media/sunset/merge_sunset.py
```
