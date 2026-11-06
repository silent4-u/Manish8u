# The Cliff's certificate of bravery, as an A4 page

`photo.jpg` is a phone photo (1118 × 1500) of the certificate. It was taken
at a slight angle: tilted, wider at the bottom than the top, with the jump
card lying on its top-left corner. `make_a4.py` makes it a straight, clean
page, exactly A4, ready to print.

| File | Size | What it is |
| --- | --- | --- |
| `certificate-a4.jpg` | 2480 × 3508, 300 dpi | The page, A4 (210 × 297 mm) |
| `certificate-a4.pdf` | One A4 page | The same, to print at 100% ("actual size") |
| `before-after.jpg` | | The photo and the page side by side |

How it is made:

1. **Straight.** The certificate's thin white frame and the top edge of the
   white name box are found and fitted as straight lines. They are square
   on the paper, so the perspective that turns their four corners back
   into a rectangle straightens the whole page. The text then runs level,
   and the frame is square.
2. **A4.** The paper's edges sit just outside the frame. The page is cut at
   those edges and made exactly A4: the top margin matches the sides, and
   the height follows from the width.
3. **Clean.**
   - The JPEG's noise is smoothed.
   - The photo was taken in bluish light: the name box, the white lettering
     and the jump card are all equally blue. So the colour is balanced
     until the name box reads white, and the green comes out the lime green
     it is.
   - The green keeps its own shading. It is printed darker towards the
     lower left, and the white lettering there is as bright as elsewhere,
     so this is not a shadow to remove.
4. **Whole.** A few strips of the page lay just outside the photo.
   - A thin sliver at the right and top edges is filled in from the page
     around it by LaMa (`../old-photo/deep_clean.py`).
   - The foot of the page, below the silhouettes, was also outside the
     photo. There the green is carried on, column by column, and so is the
     dark corner at the lower left, along its straight edge.
   - The silhouettes fade out softly where the photo ends. What lies below
     them is not in the photo, so nothing is made up for it.
5. **Print.** The page is enlarged to 2480 × 3508 pixels, A4 at 300 dpi.
   - Real-ESRGAN (`../sunset/upscale.py`) does the enlarging, blended with a
     plain enlargement so the lettering is crisp.
   - The text is sharpened lightly.
   - It is saved as a JPEG and as a one-page PDF, both marked 300 dpi.

The name, the date and the bungy master's signature are the photo's own,
unchanged.

The jump card stays where it lay. Under it is the top of the certificate's
photo of a jumper, whose feet show just below the card. That part cannot be
recovered from this photo, and filling it in would mean inventing it. For
the page without the card, photograph the certificate again with the card
moved off, and run the same script on that photo. If the new photo is framed
differently, adjust `LINES` (where the frame lines are looked for) and
`CORNER` first.

```sh
pip install numpy opencv-python-headless onnx onnxruntime pillow
python3 media/bungy-certificate/make_a4.py      # about a minute on CPU
```

The Real-ESRGAN and LaMa models download on first use. They are cached in
`~/.cache`, not in the repository.
