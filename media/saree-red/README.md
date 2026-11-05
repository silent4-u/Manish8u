# The saree and blouse in red

`photo.webp` is a portrait (1344 × 768) in a blue and olive saree with cream
paisley motifs, and a pale mint blouse. `recolour.py` makes the saree and the
blouse red, and removes the Gemini sparkle from the lower right. Everything
else stays exactly as it was: the face, skin, hair, bindi, bangles, the wall
and the table.

| File | Size | What it is |
| --- | --- | --- |
| `saree-red.jpg` | 1344 × 768 | The portrait, with the saree and blouse in red, and no sparkle |
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

The shades are set at the top of `recolour.py` (`RED`, `DEEP_RED`,
`SOFT_RED`): each is a hue, a chroma, and a lightness scale. Raise the
chroma for a stronger red, or lower it for a softer one.

```sh
pip install numpy opencv-python-headless onnxruntime
python3 media/saree-red/recolour.py
```

The LaMa model downloads on first use, and is cached in `~/.cache/lama`.
