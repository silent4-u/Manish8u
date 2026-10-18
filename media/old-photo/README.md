# Old photo of six friends — restored in 4K

`friends-restored-4k.jpg` (3840 × 2575) restores `friends-b.jpg`, a phone
photo of a mould-spotted, water-stained, faded print. `friends-a.jpg` is a
second shot of the same print, kept for reference.

`restore.py` works in four stages:

1. **Spots.** It looks for compact, dark, isolated blobs on lighter ground,
   which leaves the checks, brows, hair and the cap's edge alone. A first
   pass takes the clear spots, a second takes strong ones that touch other
   features (by their cores), and a third takes spots on darker fabric. It
   repeats until nothing more is found, because clearing one spot leaves its
   neighbours isolated enough to find.
   - Eyes, nose, mouth (from the face detector's landmarks) and the T-shirt
     lettering are protected.
   - A few marks right beside eyes and noses, which the automatic pass
     deliberately does not touch, are listed in `HEAL` and inpainted.
   - Larger brown smears and the mould blotches on pale cloth are lifted.
2. **Colour.** The faded dyes are re-levelled per channel and balanced on
   the brightest cloth. The violet is taken out of the shadows. Skin, which
   had as much red as yellow and read as pink, is turned toward a natural
   tan. The over-yellow cream cloth is calmed, and gentle contrast is
   restored.
3. **Detail.** The print is upscaled 4× with RealESRGAN_x4plus (from
   `../sunset/upscale.py`), using tiles with 40 px of context so no seams
   show. It is then resampled to 3840 px wide.
4. **Faces.** They are not redrawn. A generative face model (CodeFormer)
   was tried first and dropped: even at high fidelity it erased the frames
   of the fourth boy's glasses and changed all six faces. The faces are the
   print's own, cleaned of hand-listed spots (`HEAL` in `restore.py`) and
   upscaled with the rest of the frame.

After the spot pass, `deep_clean.py` repaints the broad water and mould
stains with LaMa (big-lama, ONNX from OpenCV Zoo):

- **Plain garments.** Stains on the cream shirts and trousers and the dark
  trousers are repainted, then broad blotches are evened out.
- **Checked shirts.** They are flat-fielded, which keeps the checks, then
  their brown stains and round spots are repainted.
- **Skin and backdrop.** Mould on skin and on the painted backdrop is
  repainted, and the teal sky is evened out.
- **Outlines.** `garments.py` holds the rough garment outlines, the areas
  that must survive (belts, arms and hands over the shirts) and a
  hand-marked chest smear.

`before-after.jpg` shows the print and the result side by side, and
`faces-before-after.jpg` compares each face with the print.
`friends-restored-4k-bw.jpg` is a black-and-white version made by
`black_and_white.py`: a channel mix near luminance that leans a little on red
for smooth skin, then soft levels and a mild curve so the pale clothes and
the faces keep their detail.
`friends-restored-4k-sepia.jpg` tones that black and white like an old
print, from deep brown shadows to cream highlights.

**What it cannot do.** This is a restoration of the print, not a new
photograph. Detail the water destroyed (cloth texture, the bleached patches
on the checked shirts, fine facial texture) is not in the source. Rebuilding
it as a crisp modern photo needs a generative photo-restoration model, which
this pipeline does not use.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/old-photo/restore.py      # about 10 minutes on CPU
```

The model weights download on first use:

- Real-ESRGAN to `~/.cache/realesrgan`
- YOLOv8-face (facefusion's ONNX build) to `~/.cache/facefusion`, used only
  to find and protect the faces
- U2-Net human segmentation to `~/.cache/rembg`
- LaMa to `~/.cache/lama`
