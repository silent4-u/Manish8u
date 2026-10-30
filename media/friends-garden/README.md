# Two friends on a garden path: brightened, cleared, in 4K

`before.jpg` is a phone photo (1072 × 1362) that has been through a messaging
app. It is soft and blocky from JPEG, and dull: the two friends stand in
shade on a misty day, under a white sky. `enhance.py` brightens and clears
it, and enlarges it to 4K.

| File | Size | What it is |
| --- | --- | --- |
| `friends-4k.jpg` | 3022 × 3840 | The photo in 4K, the faces sharpened by CodeFormer |
| `friends-4k-natural.jpg` | 3022 × 3840 | The same, the faces left as the enlargement gives them |
| `before-after.jpg` | | The photo and `friends-4k.jpg` side by side |
| `faces-compare.jpg` | | The faces up close: the photo enlarged plainly, the natural 4K, the 4K with CodeFormer |

How it is made:

1. **Clean.** The JPEG's blocks and colour noise are smoothed first, so the
   enlargement does not sharpen them.
2. **Mist.** The dark channel prior measures the mist over each part, and a
   guided filter makes that follow the edges. Some of the mist is cleared:
   the trees and the path come forward, the distance stays soft, and the
   white sky is left nearly as it is.
3. **Light.** The picture is split into its broad light (an edge-keeping
   guided filter) and its fine detail.
   - The light is lifted most in the shadows and mid-tones, and not at all
     at white, so the sky does not burn out.
   - The skin gets a little more, out of the shade.
   - The detail is laid back a little stronger.
   - The black and white points are set again, with a gentle S-curve, so it
     is bright without turning grey.

   On the whole the picture is about 17% lighter; the faces about 30 levels
   of 255.
4. **Colour.** Faint colours, such as the leaves, the flowers and the
   jeans, are made richer. Colours that are already rich, and the skin, are
   left nearly as they are, so faces stay natural. The white balance is
   evened on the greys.
5. **4K.** Real-ESRGAN (`../sunset/upscale.py`) enlarges it 4x, blended half
   and half with a plain Lanczos enlargement. That keeps edges crisp without
   the glassy eyes and waxy skin a GAN gives on its own. It is then taken to
   3840 px tall, sharpened lightly on lightness alone, and given a fine
   grain.
6. **Faces.** Each face is only about 60 px wide in the photo, too little
   for any enlargement to sharpen.
   - CodeFormer redraws each face at high fidelity (0.85), staying close to
     the face as it is. The code is shared with `../old-photo`.
   - Each face is colour-matched and blended back through a feathered
     ellipse.
   - The faces keep their own shape and expression. Their eyes, brows and
     lips come out sharp.
   - `friends-4k-natural.jpg` keeps the faces without this, if you prefer
     them untouched.
7. **Faces, brighter and smoother.** This is done in both versions, inside a
   feathered oval round each face.
   - The light is lifted again, most in the shadows: each face is about 23
     levels of 255 brighter than before this step.
   - The skin's fine texture is softened by an edge-keeping guided filter,
     so the eyes, brows, lips and hairline stay sharp. A fifth of the texture
     is put back, so the skin still looks like skin.
   - The final sharpening and grain are eased on the faces, so they stay
     smooth.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/friends-garden/enhance.py                 # about a minute on CPU
python3 media/friends-garden/enhance.py preview out.jpg   # the look only, at the photo's size
```

The CodeFormer and face-detection models download from the facefusion
assets on first use. They are cached in `~/.cache/facefusion`, not in the
repository.
