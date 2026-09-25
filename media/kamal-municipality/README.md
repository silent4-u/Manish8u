# Monumental Horizon — Kamal Rural Municipality Office

A 10-second cinematic shot of कमल गाउँपालिका, गाउँ कार्यपालिकाको कार्यालय
(Topgachhi, Jhapa, Koshi Province), made from one photograph.

| File | What it is |
| --- | --- |
| `source.jpg` | The photo the shot is built from (2048 × 1536) |
| `render.py` | Renders the video and its soundtrack from the photo |
| `monumental-horizon.mp4` | The result: 1920 × 1080, 24 fps, 10 s, H.264 + AAC stereo |

## How the brief was realised

There is no drone footage and no depth map, so the drone move is a virtual
camera travelling over the still photo. A Catmull-Rom spline carries it through
the three beats without stopping between them.

| Time | Brief | What the render does |
| --- | --- | --- |
| 0:00–0:03 | Foreground reveal | Fades up low on the ground floor and courtyard. Out-of-focus leaves with warm, glinting edges slide past the lens while the camera pushes forward and tilts up. There is low haze and a golden wash from the upper right. |
| 0:03–0:07 | Architectural ascent | Pedestal up through the portico and signboard to the roofline, where the flag ripples. The tree crown sways gently. |
| 0:07–0:10 | High-angle apex | Drifts back and recentres on the full symmetric facade. An anamorphic flare, with a blue horizontal streak and ghosts, sweeps along the roofline. |

Across the whole shot: a warm-highlight / teal-shadow grade, extra saturation
on the greens and the red window frames, a contrast S-curve, a vignette, film
grain and a 2:1 widescreen matte. A 2.39:1 matte was tried first, but it cut
the flag off the final wide shot.

The soundtrack is synthesised in the script:
- Wind and leaf rustle, with birdsong in the first half.
- A string pad on D – G – A – D.
- A cello and brass rise through the ascent that resolves on D at 0:08.
- Piano notes decaying to the end.

## What a still cannot give

- **True parallax.** The building moves as one flat plane. Only the added
  foreground leaves move at a different depth.
- **Real 4K.** The tightest crops enlarge the photo about 2×, so the output is
  1080p rather than an upscaled 4K file.
- **Sky and hills.** The clouds do not drift, and there are no hills in the
  photo to reveal.

For a true fly-through, feed `source.jpg` to an image-to-video model (Runway
Gen-3, Luma Dream Machine, Sora, Pika) with this prompt:

> Cinematic 4K drone shot of a grand white three-story government building with
> distinct dark-red window frames and columns, Nepali flag on the roof
> fluttering gently. Camera begins low behind overhanging green tree branches
> creating a natural lens frame, then executes a smooth rising pedestal camera
> movement into an expansive high-angle wide shot. Morning golden hour light,
> soft atmospheric mist, anamorphic lens flare, photorealistic, 24fps,
> hyper-detailed architecture, smooth gimbal movement.

## Rendering again

```sh
pip install numpy pillow imageio-ffmpeg   # imageio-ffmpeg bundles ffmpeg
python3 media/kamal-municipality/render.py
```

It takes about six minutes on one CPU. The random seed is fixed, so the output
is the same on every run. Camera keyframes are in `KEYS` at the top of the
script.

## Inauguration day — tent removed, 15-second drone shot

| File | What it is |
| --- | --- |
| `inauguration.jpg` | The photo from the inauguration, with the event tent in front of the entrance |
| `remove_tent.py` | Removes the tent and its poles and bamboo, leaving everything else |
| `inauguration-clean.jpg` | The result |
| `render_inauguration.py` | Renders the drone shot from the cleaned photo |
| `inauguration-drone.mp4` | 1920 × 1080, 24 fps, 15 s, H.264 + AAC stereo |

**Removing the tent.** Nothing in the photo shows what is behind the tent, but
`source.jpg` shows the same portico with no tent. That photo is aligned to
this one and the hidden part is taken from it:

- The front of the building is aligned with a homography, fitted with SIFT
  matches on the facade.
- The wall inside the portico sits further back, so it gets its own small
  correction, measured on the ground-floor window frames.
- The patch is colour-matched to this photo at its edges.
- Each tent pole and piece of bamboo is found by colour inside a marked
  corridor, then covered with the pixels just beside it.
- The balloons, chairs, entrance and people are untouched. Bamboo lying on
  the ground is kept.

**The drone move.** The shot is a real camera moving through a simple depth
model of the photo:

- The building is one far plane.
- The paving comes closer row by row, as a flat ground does.
- The two women stand near the camera, cut out with GrabCut.

The camera flies toward the women, so they grow faster than the building
behind them, and nothing hidden behind them is ever uncovered.

| Time | Move |
| --- | --- |
| 0–4.5 s | Wide on the whole square, then pushing forward |
| 4.5–8 s | Tilting down to the two women in front of the portico |
| 8–11 s | Craning up the columns to the name |
| 11–15 s | Drifting back to the whole building |

Because the source is a still photo, the people, flag and trees don't move.

```sh
pip install numpy pillow opencv-python-headless imageio-ffmpeg
python3 media/kamal-municipality/remove_tent.py
python3 media/kamal-municipality/render_inauguration.py
```
