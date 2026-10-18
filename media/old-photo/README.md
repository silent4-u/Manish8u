# Old photo of six friends — restored in 4K

## For printing and framing

| File | Size | Prints well at |
| --- | --- | --- |
| `friends-print-7x5.jpg` | 4200 × 3000 | 7×5, 10×7, A4, up to 14×10 in |
| `friends-print-3x2.jpg` | 3600 × 2400 | 6×4, 9×6, up to 12×8 in |

Both are 300 dpi with an embedded sRGB profile, so a photo lab can print
them as they are. `print-before-after.jpg` compares the result with the
print.

`restore_print.py` makes them. It is a second, more careful pass than
`restore.py` below, which repainted whole garments and left smeared cloth and
pale patches on faces. This one cleans damage only where the damage is:

- **Spots.** Mould spots are found automatically everywhere except on the
  faces. On the faces they are listed by hand after checking each face at
  5× (`FACE_HEAL`), so no eye, brow, nostril or the fourth boy's glasses
  frame is touched. Every fill comes from LaMa, which rebuilds the
  surrounding texture.
- **Speckle and cracks.** Each kind has its own test:
  - Small, sharp marks on the pale clothes.
  - Brown strands on the sky.
  - Near-black spots on the checked shirts and dark trousers.
  - Spots on arms and hands.
  - A few marks found by eye: a crack, a drip on the belt, the mould along
    the shirt hem, a scratch on the sky.
- **Stains.** Broad water marks are lifted back toward each garment's clean
  level. Gentle shading such as folds is left alone, and the fine grain of
  the cloth is put back unchanged.
- **Colour.** The violet is taken out of the blacks, the yellow out of the
  whites and the pink out of the skin. The teal sky moves back toward blue,
  and the tone range is restored with a gentle curve.
- **Print.** The picture is cropped inside the print's edges and enlarged
  with a 50/50 blend of Real-ESRGAN (realesr-general-x4v3) and a plain
  Lanczos enlargement. That keeps edges crisp without the glassy eyes a GAN
  gives on its own. It then gets a fine grain.

The sixth boy's checked shirt is the one place it cannot fully mend. Water
bleached its checks in a band across the middle. The olive stain is taken
out, but the pattern there is only as strong as the print still holds it.

```sh
pip install numpy opencv-python-headless onnx onnxruntime pillow
python3 media/old-photo/restore_print.py   # about 3 minutes on CPU
```

## Regenerated faces, made in the cloud

`friends-ai-7x5.jpg` (4200 × 3000) and `friends-ai-3x2.jpg` (3600 × 2400)
regenerate the picture with the models a cloud session can run, without
Stable Diffusion. `regenerate_faces.py` makes them:

- **Start.** It begins from the cleaned print, recoloured, with two last
  marks healed: a brown arc under the sixth boy's eye and a scratch on the
  second boy's cheek.
- **Detail.** RealESRGAN_x4plus redraws all the detail of the picture, used
  in full this time rather than blended with a plain enlargement.
- **Faces.** CodeFormer regenerates every face at high fidelity (0.8), from
  the enlarged picture. Each face is colour-matched and blended back through
  a feathered ellipse.

Working from the cleaned print matters: on it CodeFormer keeps the fourth
boy's glasses and every face stays recognisable, while on the stained print
it erased the glasses. The sixth boy's face keeps a softened trace of the
damage beside his left eye. `ai-before-after.jpg` compares the result with
the cleaned print.

```sh
python3 media/old-photo/regenerate_faces.py   # about 7 minutes on CPU
```

## Regenerated as a fresh photograph (run on your own computer)

`regenerate.py` redraws the picture with Stable Diffusion 1.5 and ControlNet
Tile so it looks like a sharp, new studio photograph of the same moment, then
puts the real faces back:

- **Regenerate.** img2img from the cleaned, recoloured print at 1400 × 1000,
  in overlapping 768 px tiles, with a fixed seed. ControlNet Tile holds every
  shape in place; only texture (skin, cloth, the sky) is redrawn.
- **Real faces.** Each face with its hair, the second boy's cap and the fourth
  boy's glasses is taken from the print and blended back through a feathered
  ellipse, colour-matched to the new picture.
- **Lettering.** The "UNDERCOVER POLICE" T-shirt is pasted back from the
  print, so the model never invents letters.

| File | What it is |
| --- | --- |
| `friends-regenerated-7x5.jpg` | 4200 × 3000, real faces |
| `friends-regenerated-3x2.jpg` | 3600 × 2400, real faces |
| `friends-regenerated-full-7x5.jpg` | 4200 × 3000, faces regenerated too, for comparison |
| `regenerated-comparison.jpg` | cleaned print, real faces, fully regenerated |

It needs to download about 4 GB of model weights from Hugging Face (cached in
`~/.cache/huggingface`, never in the repository), which the cloud sessions
cannot reach, so run it on your own computer with Python 3.10 or newer:

```sh
pip install numpy opencv-python-headless onnx onnxruntime pillow
pip install torch diffusers transformers accelerate safetensors
python3 media/old-photo/regenerate.py                    # 15-40 min on CPU; a minute or two on a GPU or Apple Silicon
python3 media/old-photo/regenerate.py --strength 0.35    # stay closer to the print
python3 media/old-photo/regenerate.py --strength 0.55    # sharper, but strays further
python3 media/old-photo/regenerate.py --model SG161222/Realistic_Vision_V5.1_noVAE
```

Check the faces at 100% afterwards. The "full" version shows what the model
does to faces on its own; expect it to drift from the real people, which is
why the main files keep the print's faces.

## The first 4K restoration

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
