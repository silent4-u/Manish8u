# Boundary wall and gate: colour options

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
