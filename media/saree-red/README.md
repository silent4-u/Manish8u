# The saree and blouse in red

`photo.webp` is a portrait (1344 × 768) in a blue and olive saree with cream
paisley motifs, and a pale mint blouse. `recolour.py` makes the saree and the
blouse red, removes the Gemini sparkle from the lower right, and makes it
4K. Everything
else stays exactly as it was: the face, skin, hair, bindi, bangles, the wall
and the table.

| File | Size | What it is |
| --- | --- | --- |
| `saree-red-4k.jpg` | 3840 × 2194 | The portrait in 4K, the saree and blouse in red, no sparkle |
| `saree-red.jpg` | 1344 × 768 | The same at the photo's own size |
| `before-after.jpg` | | The photo and the new one side by side |

| Part | Before | After |
| --- | --- | --- |
| Saree, main colour | Blue | A rich red, a touch lighter than the blue was |
| Saree, pallu and border | Olive | A deeper red, so the saree stays two-toned |
| Motifs | Cream, and greenish cream on the pallu | Cream, all alike: cream on red |
| Pallu's light sheen | Light olive | A soft gold shine on the red |
| Blouse | Pale mint, with white dots | A soft red, the dots kept |

How it is made:

1. **Where.** A rough outline round the saree and blouse, drawn by eye,
   keeps the wall and the table out. The face, the bangles and the blouse
   each have their own outline too.
2. **Which.** Inside the outline, each pixel is weighed by its colour
   (lightness, chroma and hue in Lab) as the saree's blue, its olive, its
   light olive, or the blouse. The skin, hair, gold and the cream motifs
   match none of these, so they are left alone. The weights are soft, so
   every edge blends.
3. **Red.** The weighed pixels are given the new hue and chroma, and keep
   their own lightness. So every fold, shadow and thread of the weave, and
   the blouse's dots, stay as they were. Darker cloth gets a little less
   chroma, as dyed cloth does in shadow.
4. **The pallu's motifs.** On the pallu, the motifs and the light sheen are
   the olive's own hue, only lighter, so no colour rule can tell them
   apart. Both keep their lightness and chroma, and are only turned from
   greenish to the warm cream of the other motifs.
5. **The sparkle.** The Gemini sparkle at the lower right lies on the
   table. It is found by its brightness against the table (`MARK` is where
   to look), and filled in by LaMa (`../old-photo/deep_clean.py`) from the
   table round it, so the table's grain and its back edge run on through.
   Gemini also puts an invisible SynthID watermark in its images; that is
   in the pixels themselves, and stays.
6. **4K.** Real-ESRGAN (`../sunset/upscale.py`) enlarges it 4x, blended half
   and half with a plain Lanczos enlargement. That keeps it crisp without
   the waxy skin a GAN gives on its own. It is then taken to 3840 px wide,
   sharpened lightly on lightness alone, and given a fine grain. The photo
   is not quite 16:9 (it is 7:4), so 3840 × 2194 keeps all of it; a 16:9
   frame (3840 × 2160) would cut 17 px from the top and bottom.

The shades are set at the top of `recolour.py` (`RED`, `DEEP_RED`,
`SOFT_RED`): each is a hue, a chroma, and a lightness scale. Raise the
chroma for a stronger red, or lower it for a softer one.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/saree-red/recolour.py      # about 40 seconds on CPU
```

The LaMa and Real-ESRGAN models download on first use, and are cached in
`~/.cache`, not in the repository.
