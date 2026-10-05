# Above the Himalaya

A 15-second portrait film (1080 × 1920, 30 fps, H.264 + AAC stereo) made from
one window photo and one phone video of a flight past the Himalaya.

| File | What it is |
| --- | --- |
| `window.jpg` | The window photo, with the wing and the cloud sea |
| `flight.mp4` | The phone clip: 28 s, 478 × 850, 60 fps |
| `render_flight.py` | Cuts, stabilises, grades and scores the film |
| `above-the-himalaya.mp4` | The result |

| Time | Shot |
| --- | --- |
| 0–3.6 s | The photo, with a slow push toward the wing and the horizon |
| 2.8–7.6 s | The clip's sharpest stretch: window frame, wing and the range on the horizon |
| 6.8–15 s | The snow peaks above the cloud sea |

How the film is made:

- **Slow motion.** The video shots play at half speed. The clip is 60 fps, so
  each source frame becomes one output frame and the motion stays smooth.
- **Stabilisation.** The far scene is tracked, the camera path is smoothed,
  and a 10% crop hides the edges.
- **Grade.** It lifts the haze from the window, deepens the blue a little,
  warms the snow and adds a soft light from the sun side.
- **Sound.** The clip's own engine hum is low-passed and placed under a soft
  pad, a high shimmer and a few piano notes.

The source video is 478 px wide, so the film is upscaled about 2.3× to reach
1080 px. It is softer than native 1080p footage.

```sh
pip install numpy opencv-python-headless imageio-ffmpeg
python3 media/flight/render_flight.py
```
