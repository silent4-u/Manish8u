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

## The 4K cut

`above-the-himalaya-4k.mp4` is 2160 × 3840 (portrait 4K), 30 fps and
23.4 s long, with H.264 at about 18 Mbps and AAC audio. `render_4k.py` makes
it from the same window photo and phone clip.

| Time | Shot |
| --- | --- |
| 0–3.6 s | The window photo, upscaled with RealESRGAN_x4plus, pushing in |
| 2.8–7.4 s | The window, the wing and the range on the horizon, at 0.45× |
| 6.6–20.6 s | The Himalayan range above the cloud sea, on a speed ramp that eases to about ¼ speed in the middle |
| 19.8–23.4 s | Back at the window and wing, ending in a fade to black |

Every clip frame used goes through four steps:

1. **Spot healing.** Soft dark blobs of window dirt are healed, but only
   where the haze is flat, so real detail is untouched.
2. **Dehaze.** A held-back dark-channel dehaze with guided-filter
   refinement. It uses one haze estimate per shot, so it can't flicker.
3. **Upscale.** 4× with realesr-general-x4v3.
4. **Stabilisation.** The far scene is tracked and the camera path smoothed.

Only every second 60 fps frame is upscaled. Optical flow builds the frames
in between, which is what keeps quarter speed smooth.

Dissolves bloom with light. The grade lifts the haze, deepens the blue,
warms the sunlit snow and lets the highlights glow. The score is longer and
sits over the real cabin hum, with air rushing through each dissolve.

The film takes about 70 minutes to render, so it can be made in pieces:

```sh
pip install numpy opencv-python-headless onnx onnxruntime imageio-ffmpeg
python3 media/flight/render_4k.py --frames 0 117     # ... up to 702, any order
python3 media/flight/render_4k.py --mux              # join the pieces, add sound
```

The source clip is 478 px wide, so 4K here means clean upscaled detail, not
native 4K capture.
