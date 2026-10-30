# From the chair to the window, and on to the Himalaya

`window-before.mp4` is a phone clip, zooming from a chair towards the window
grill. Through it you see trees, roofs and a hazy horizon with faint hills.
`zoom_to_himalaya.py` puts the snow massif from
`../himalaya-view/himalaya-before.jpg` on that horizon. It then carries the
zoom on past the end of the clip, until the peak fills the frame.

| File | Size | What it is |
| --- | --- | --- |
| `window-to-himalaya.mp4` | 1080 × 1920, 28 s | The clip, with the mountain, and the zoom carried on, with the clip's own sound |

How it is made:

1. **Tracking.** The camera's zoom (about 4x over the clip), drift and shake
   are measured from frame to frame and chained to the last frame. Corners
   on the view are tracked, leaving out the dark bars, and a similarity is
   fitted with RANSAC.
2. **The mountain in the clip.** The massif is placed in the sky of the
   last frame, with its foot behind the faint hills, and moved with the
   camera into every earlier frame. It is drawn only where the clip shows
   sky, so the bars, the leaves and the curtain stay in front of it.

   The clip's sky is washed out nearly white, and a white mountain cannot
   stand out against it. So the sky, and the faint hills under it, are
   made the clearer, deeper blue of a day the mountain can be seen on.

   The mountain is drawn relative to that sky. The haze on the photo's
   ranges is partly cleared first. The photo is enlarged 4x with
   RealESRGAN_x4plus, for the crispest ridges and rock, and the faces of
   the snow are given more shape. The mountain is drawn at the film's full
   size, on the enlarged clip, so it is as sharp as the frame allows. So:
   - sunlit snow stands brighter than the sky, with the brightest rolled
     off rather than clipped;
   - its faces are in blue shadow;
   - the forested ranges under it read as darker haze;
   - its foot fades into the haze, behind the faint hills.
3. **The zoom carries on.** The last frame is split into two layers: the
   grill (with the sill) and the view behind it. LaMa paints in what the
   bars hid; the window frame on the right is mirrored first, since LaMa
   has nothing beyond the frame's edge to go on. Real-ESRGAN enlarges the
   view for the trees the zoom passes.

   The camera then zooms on towards the peak and is brought up to the
   grill. The bars grow faster than the view, go out of focus and slide out
   of the frame, as they do when a phone is held up to a window. The hand's
   small shake carries on as in the clip.

   The mountain is drawn from the photo enlarged with Real-ESRGAN, so it
   gains detail as it fills the frame. With the dark room gone from the
   frame, the exposure settles lower, and the mountain stands out more
   clearly from the sky.
4. **Sound.** The clip's own outdoor ambience carries on, made from
   crossfaded pieces of itself.

```sh
pip install numpy opencv-python-headless onnx onnxruntime imageio-ffmpeg
python3 media/window-view/zoom_to_himalaya.py      # about 20 minutes on CPU
```
