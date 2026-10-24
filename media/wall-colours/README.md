# Boundary wall and gate: colour options

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
