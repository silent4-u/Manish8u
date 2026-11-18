# The saree and blouse in red, in 4K and on A4

`photo.webp` is a portrait (1344 × 768) in a blue and olive saree with cream
paisley motifs, and a pale mint blouse. `recolour.py` does the following:

- makes the saree and the blouse red;
- removes the Gemini sparkle from the lower right;
- polishes the picture lightly;
- writes it in 4K, and as an A4 landscape page ready to print.

The face, skin, hair, bindi and bangles stay exactly as they were.

| File | Size | What it is |
| --- | --- | --- |
| `saree-red-a4.jpg` | 3508 × 2480, 300 dpi | An A4 landscape page (297 × 210 mm), with room above her head |
| `saree-red-a4.pdf` | One A4 landscape page | The same, to print at 100% ("actual size") |
| `saree-red-4k.jpg` | 3840 × 2194 | The portrait in 4K, framed as the photo |
| `saree-red.jpg` | 1344 × 768 | The same at the photo's own size |
| `before-after.jpg` | | The photo and the A4 page side by side |

| Part | Before | After |
| --- | --- | --- |
| Saree, main colour | Blue | A rich red, a touch lighter than the blue was |
| Saree, pallu and border | Olive | A deep red, as full as the rest |
| Motifs | Cream, and greenish cream on the pallu | Cream, all alike: cream on red |
| Pallu's light sheen | Light olive | A soft gold shine on the red |
| Blouse | Pale mint, with white dots | A soft red, the dots kept |

How it is made:

1. **Where.** A rough outline round the saree and blouse, drawn by eye,
   keeps the wall and the table out. The face, the bangles and the blouse
   each have their own outline too.
2. **Which.** Inside the outline, each pixel is weighed by its colour
   (lightness, chroma and hue in Lab) as one of four kinds:
   - the saree's blue;
   - its olive;
   - its light olive;
   - the blouse.

   The skin, hair, gold and the cream motifs match none of these, so they
   are left alone. The weights are soft, so every edge blends.
3. **Red.** The weighed pixels are given the new hue and chroma, and keep
   their own lightness.
   - Every fold, shadow and thread of the weave, and the blouse's dots,
     stay as they were.
   - Darker cloth gets a little less chroma, as dyed cloth does in shadow.
   - The olive is darker cloth than the blue, so it gets more chroma, or
     it reads as a dusty pink rather than red.
4. **The pallu's motifs.** On the pallu, the motifs and the light sheen are
   the olive's own hue, only lighter, so no colour rule can tell them
   apart. Both keep their lightness and chroma, and are only turned from
   greenish to the warm cream of the other motifs.
5. **The sparkle.** The Gemini sparkle at the lower right lies on the
   table.
   - It is found by its brightness against the table. `MARK` is where to
     look.
   - LaMa (`../old-photo/deep_clean.py`) fills it in from the table round
     it, so the table's grain and its back edge run on through.
   - Gemini also puts an invisible SynthID watermark in its images. That is
     in the pixels themselves, and stays.
6. **Polish.**
   - The shadows and mid-tones are lifted a little; white and black stay
     put.
   - The cloth and the wall get a little local contrast. It is eased on
     skin, so the face stays soft.
   - Faint colours get a little more depth, and the skin is kept as it is.
7. **4K.**
   - Real-ESRGAN (`../sunset/upscale.py`) enlarges it 4x, blended half and
     half with a plain Lanczos enlargement. That keeps it crisp without the
     waxy skin a GAN gives on its own.
   - It is then taken to 3840 px wide, sharpened lightly on lightness
     alone, and given a fine grain.
   - The photo is not quite 16:9 (it is 7:4), so 3840 × 2194 keeps all of
     it. A 16:9 frame (3840 × 2160) would cut 17 px from the top and
     bottom.
8. **A4.** A4 landscape is narrower than the photo: 1.41:1 against 1.75:1.
   Cutting the photo down to that shape would cut into the saree and her
   elbows. So `PAGE` sets a smaller cut and some added room:
   - A strip of plain wall is cut from each side.
   - Room is added above her head and below her arms. In the photo her
     head drape touched the top edge, so the headroom also frames her
     better.
   - Above, the wall is mirrored upwards, so the balustrade and the panel
     mouldings carry on as they would. Where the mirror would bring the
     saree, LaMa fills in wall from round about instead.
   - Below, LaMa carries the table on.
   - The page is then enlarged as for 4K, to 3508 × 2480: A4 at 300 dpi,
     saved as a JPEG and as a one-page PDF.

The shades are set at the top of `recolour.py` (`RED`, `DEEP_RED`,
`SOFT_RED`). Each is a hue, a chroma and a lightness scale: raise the chroma
for a stronger red, or lower it for a softer one. The polish is the
defaults of `polish()`.

```sh
pip install numpy opencv-python-headless onnx onnxruntime pillow
python3 media/saree-red/recolour.py      # about a minute on CPU
```

The LaMa and Real-ESRGAN models download on first use. They are cached in
`~/.cache`, not in the repository.
