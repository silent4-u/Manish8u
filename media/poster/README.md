# Quote poster

`poster.jpg` (2160 × 2700, 4:5) turns `cafe.jpg` into an illustrated quote
poster in the style of a mustard-wall reference: a warm painted wall with soft
leaf shadows and a hanging bulb, the sitter rendered as an illustration, a
small letter-spaced title over a short rule, and a handwritten-style quote.

The title and quote are original. The reference's own text belongs to its
author, so it isn't reused. Both are plain strings at the top of
`make_poster.py` (`TITLE`, `QUOTE`).

How it is made:

- **No generative model redraws the face.** A Ghibli-style GAN was tried
  first and changed the sitter's features, so the likeness comes from the
  photo itself.
- **Cut-out.** IS-Net (rembg's `isnet-general-use`) separates the sitter,
  with his cup, the table and the saucer. The snake plant and the tissue are
  selected by colour, because the network only half-sees them against the
  pale café wall. Edge colours are taken from inside the outline, so no wall
  colour rims him.
- **Illustration.** An edge-preserving paint pass, soft cel steps on
  lightness, mid-frequency detail kept for the beard and folds, and thin ink
  lines traced from the photo. A touch of the wall's warmth is mixed into
  the shadows so he belongs in the room.
- **Wall.** Mottled mustard plaster, light pooling around the bulb,
  clustered leaf shadows that soften away from their centres, a soft
  contact shadow behind the sitter, and a glowing bulb.
- **Type.** Montserrat for the title, Delius for the quote.

```sh
pip install numpy opencv-python-headless onnxruntime pillow
python3 media/poster/make_poster.py path/to/fonts   # Montserrat[wght].ttf, Delius-Regular.ttf
```

The IS-Net weights download to `~/.cache/rembg` on first use.

## With tea and a radio

`poster-tea.jpg` uses `cafe-phone.jpg`, where the sitter is looking at his
phone. A glass of chiya stands on two books on the left and an old table
radio on the right, all on a painted wooden table. It has its own title and
quote:

> ME & MY CHIYA
>
> Spent years scrolling for happiness. Turns out it was just a cup of chiya
> and an old song away.

`make_poster_tea.py` reuses the wall, bulb, leaf shadows, illustration and
type from `make_poster.py`, with these changes:

- **Cut-out.** U2-Net's human segmentation model replaces IS-Net, because
  IS-Net drops his forearms and hands in this photo. A second pass on the
  lower half refines the arms. Only the largest region is kept, so no café
  furniture comes along.
- **Table.** Below the table's edge, a painted wooden tabletop replaces the
  café table, coffee cup, tissue box and saucer.
- **Props.** The radio covers the part of the cup that stood above the
  table. The books and the tea glass cover the café water glass that his
  forearm was seen through. The forearm then ends in a soft slanted edge
  behind the glass.
- **Drawing.** The radio, tea glass and books are drawn in code at twice
  the size and scaled down. They are not copied from the reference artwork.
  The radio has a wooden case, cloth grille, dial with a red needle, knobs
  and keys. The tea glass has amber tea, highlights, a coaster and steam.

```sh
python3 media/poster/make_poster_tea.py path/to/fonts
```

U2-Net's weights download to `~/.cache/rembg` on first use.
