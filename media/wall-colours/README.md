# Boundary wall and gate: colour options

## Fancy finishes, in the house's colours

`fancy-wall-options.jpg` goes beyond paint. It gives the wall the finishes of
a fancy boundary wall, all matched to the house: sky-blue walls, green
ledges, red roof and skirting, maroon gate. Each design is also saved full
size as `fancy-<design>.jpg`.

| Part | Finish |
| --- | --- |
| Frame | The house's sky blue, with an ivory coping along the top and a plinth in the house's red skirting colour along the bottom |
| Strips above and below the relief | Patterned encaustic tiles (star and circle), edged with a gold border line |
| Relief | The arcs and steps in the design's colours, every groove picked out in metallic gold |
| Pillars | Clad in stacked natural stone, with an ivory cap and gold line under the canopy and a red base like the plinth |
| Canopy | The design's roof colour, with ivory lines on its diamond tiles and an ivory valance with gold scallops |

| Design | Relief | Tiles | Stone | Canopy | Why |
| --- | --- | --- | --- | --- | --- |
| **Sky & Gold** | ivory, mid and deep blue, gold | ivory with deep blue, house blue and gold | warm sandstone | roof red | The house's own blue, made rich with gold; the calmest |
| **Garden** | ivory, leaf green, roof red, gold | ivory with green, red and gold | grey slate | leaf green | Picks up the green ledges and the red roof |
| **Royal** | ivory, maroon, deep blue, gold | maroon with gold and ivory | cream travertine | maroon | Ties the wall to the maroon gate; the most festive |

### Sky & Gold Deluxe

`fancy-sky-gold-deluxe-options.jpg` puts the wall as it is, Sky & Gold and
Sky & Gold Deluxe side by side, with the deluxe gate up close. The deluxe
version (`fancy-sky-gold-deluxe.jpg`) adds:

| Part | Finish |
| --- | --- |
| Gate | Deep blue, with its raised border, its words, its emblem and its spear tips in gold |
| Relief | Blue glass mosaic with gold flecks in the outer arcs and corner pieces; a gold stencil of interlocking circles on the ivory pieces |
| Tiles | Every circle and star edged in gold |
| Frame | A gold line under the coping and another over the plinth |
| Pillars | A small brass wall lantern on each gate pillar |

**Building it:**
- **Tiles.** Encaustic or printed ceramic tiles, about the recess's height,
  laid in a single row in each strip, with a gold (or brass) tile border.
- **Stone.** Stacked split-stone ledge panels (sandstone, slate or
  travertine), fixed with a stone adhesive on the pillars' plaster.
- **Gold.** Exterior metallic gold enamel for the relief's grooves and the
  canopy's scallops, with a fine brush, after the colours.
- **Mosaic.** Glass mosaic sheets (about 2 cm squares), cut to the relief's
  arcs and fixed with a white tile adhesive.
- **Stencil.** A reusable stencil and metallic gold paint, dabbed on over the
  ivory once it is dry.
- **Gate.** Metal primer, then deep blue enamel; the border, words, emblem
  and spear tips in gold enamel with a fine brush.
- **Lanterns.** Outdoor wall lanterns, wired before the stone goes on.
- **Ivory and red.** Exterior emulsion, as for the other designs.

`fancy_wall.py` makes the photos:
- **Shapes.** It reuses the panels, the pillars and the canopy from
  `wall_colours.py`, and the relief's traced bands and steps from
  `motif_colours.py`.
- **Tiles and stone.** These are drawn flat, in each strip's and each
  pillar's own straight-on rectangle, then warped into the photo.
- **Realism.** Every finish is laid in linear light as its colour × the
  photo's own shading, so the sun, the relief and the tree's dappled shadows
  stay as they are. Plants, flowers and the gate stay in front, untouched.

```sh
python3 media/wall-colours/fancy_wall.py [fonts_dir]
```

## House blue, with the relief motif in colour

`motif-colour-options.jpg` shows three schemes that paint the wall the
house's own sky blue and pick out every arc band and step of the relief in
colour, against an ivory background. The pillars are ivory, and the canopy is
the roof's red with an ivory scalloped valance. Each scheme is also saved
full size as `motif-<scheme>.jpg`.

| Scheme | Arc bands, inner to outer | Steps, top to bottom | Corner block | Groove lines |
| --- | --- | --- | --- | --- |
| **Peacock** | gold, emerald, peacock teal | sky, mid and deep blue | gold | gold |
| **Sunset on Sky** | saffron, coral, rose | light saffron, orange, red | plum | white |
| **Royal** | gold, emerald, maroon (like the gate) | light, mid and deep gold | maroon | gold |

`motif_colours.py` traces the motif in each panel's straight-on view:
- **Arcs.** Each arc is a circle fitted through a few points on its groove,
  then snapped to the groove itself.
- **Steps.** The staircase's treads and risers are straight lines.
- **Colours.** These curves split the panel into its bands and steps, and
  each piece is coloured by its role.

```sh
python3 media/wall-colours/motif_colours.py [fonts_dir]
```

## Whole-wall schemes

`wall-before.jpg` is the bare cement wall with its relief of arcs and steps.
`wall-colour-options.jpg` shows it beside five schemes chosen to go with the
house's sky-blue walls, green trims, red roof tiles and maroon gate. Each
scheme is also saved full size as `wall-<scheme>.jpg`.

| Scheme | Panel | Frame | Groove lines | Pillars | Canopy | Why |
| --- | --- | --- | --- | --- | --- | --- |
| Sky Blue & White | white | sky blue | blue | white | roof red, white scallops | Matches the house; calm and unified |
| Cream & Maroon | cream | maroon | maroon | cream | maroon, cream scallops | Warm and elegant; picks up the gate |
| Sand & Terracotta | sand | terracotta | terracotta | terracotta | terracotta | Earthy; warm against the blue house |
| Stone Grey & Leaf Green | light grey | green | green | light grey | green | Modern; picks up the green trims |
| Royal Blue & Gold | royal blue | cream | gold | cream | gold | Rich and festive |

The best fits are **Sky Blue & White**, which ties the wall to the house, and
**Cream & Maroon**, which ties it to the gate.

**Painting tips:**
- **Primer.** Use an exterior primer first. Fresh cement needs a few weeks to
  cure, then an alkali-resistant primer.
- **Paint.** Use exterior emulsion for the colours.
- **Groove lines.** Paint them last with a fine brush, so the relief stands
  out from the road.
- **Plinth.** A darker or matt finish near the ground hides splashes.

`wall_colours.py` makes the photos:
- **Zones.** Each relief panel is flattened to a straight-on view, where its
  zones are rectangles and its groove lines can be found; both are mapped
  back onto the photo.
- **Paint.** It is applied in linear light as paint colour × the cement's
  own shading, so the relief, the sun and the tree's shadows stay real.
- **Untouched.** Plants and the gate are not painted.

```sh
python3 media/wall-colours/wall_colours.py [fonts_dir]
```
