# From the rooftops to Kanchenjunga: one smooth zoom

`zoom-clip.mp4` is a phone clip, zooming slowly from the rooftops to the
houses, the hills and the snow massif above them. The five photos were
taken from the same spot a minute later, from wide to close. `make_zoom.py`
makes one smooth, clear zoom out of them:

| File | Size | What it is |
| --- | --- | --- |
| `himalaya-zoom.mp4` | 1080 × 1920, 24 s | The zoom, from the rooftops until the massif fills the frame, with the clip's own sound |

| Input | What it shows |
| --- | --- |
| `zoom-clip.mp4` | From the rooftops (wider than the wide photo) to about the houses photo's view. It came through an editor as a 405 px wide picture between black bars. |
| `photo-1-wide.jpg` | The whole view, the massif small above the hills (1x) |
| `photo-2-houses.jpg` | The houses, the hills and the massif (2x) |
| `photo-3-hills.jpg` | The hills and the massif (4x) |
| `photo-4-massif.jpg` | The massif (6.5x) |
| `photo-5-closeup.jpg` | The massif, a wider frame at about 6x |

How it is made:

1. **Where everything is.** The photos are matched to one another (SIFT
   features, a similarity fitted with RANSAC). The clip is tracked from
   frame to frame, and every frame is then lined up directly against the
   photo it overlaps most, so nothing drifts. All of it is placed in one
   frame of reference: the houses photo's pixels.
2. **A smooth zoom.** The clip zooms unevenly, and stops for four seconds
   halfway. The film's camera instead follows one eased curve, from the
   clip's widest view to the massif filling the frame. Its centre is taken
   from where the clip itself pointed while it zoomed. Where it stood
   still, the hand re-aimed; that is spread over the zoom around it, so
   nothing swings. Each film frame takes the latest clip frame that holds
   its whole view, tilt and all, steadied onto the curve. The stop is
   crossed with a short crossfade.
3. **Clear.** The clip's frames are enlarged with Real-ESRGAN. The sky, the
   hills and the snow do not move in a minute, so their detail is taken
   from the sharpest photo that covers them. That detail is laid on the
   clip's own broad colour, so no photo's edge can show. Only the trees
   and houses, which do move, are the clip's own.
4. **On past the clip.** Where the clip ends, its trees and houses give way
   to the photos'. The zoom carries on through the photos, each giving way
   to the next, closer one where it covers the frame, until the massif
   fills it. Each photo's colours are matched to the houses photo's with a
   smooth fitted surface, so no photo's sky shows as a box against the
   next.
5. **A gentle finish.**
   - A filmic curve, a slightly deeper sky at the top, a soft vignette and
     fine grain.
   - A fade in and out.
   - The clip's own sound, carried on with crossfaded pieces of itself.

```sh
pip install numpy opencv-python-headless onnx onnxruntime imageio-ffmpeg
python3 media/himalaya-zoom/make_zoom.py               # about an hour on CPU
python3 media/himalaya-zoom/make_zoom.py stills 4 12 20  # a few frames, to check first
```
