# One sunset, three shots

`sunset-cinematic.jpg` (1080 × 1350, 4:5) is a single photo merged from three
phone shots of the same sunset. They were taken from the same balcony
moments apart, at different zooms and exposures.

| Shot | What it brings |
| --- | --- |
| `sunset-tower.jpg` | The composition: tower, roof, poles, sun and clouds. It is the frame the others are mapped into. |
| `sunset-sun.jpg` | The longest zoom: the sharpest sun disc and cloud texture |
| `sunset-wide.jpg` | The wide, brighter exposure: light in the shadows |

`merge_sunset.py` does the merge in four steps:

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
   fine grain.

```sh
pip install numpy opencv-python-headless
python3 media/sunset/merge_sunset.py
```
