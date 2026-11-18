# Bedroom makeover

`room-1.jpg` to `room-5.jpg` are phone photos of the room as it is. The
`*-after.jpg` files are mock-ups of the same views made over, and the
`*-before-after.jpg` files put each pair side by side:

| View | Before / after |
| --- | --- |
| Main view: the bed corner, the vent and the middle wall | `room-main-before-after.jpg` |
| The door | `room-door-before-after.jpg` |
| The window | `room-window-before-after.jpg` |

They are photo edits of these very photos, not renders. The ceiling, curtains,
light and the framed photo show what the changes below would look like.
`makeover.py` makes them.

## The full design: Warm Ply & Sage

`room-design-board.jpg` is the design board: all three views finished, the
palette, the room as it was, and what goes where. `room-*-design.jpg` are the
views on their own, and `room-*-design-before-after.jpg` pair them with the
photos. `design.py` makes them.

The style is warm modern-rustic, built around the ceiling.

- **Ceiling.** 6 mm pine ply under the rafters, sloping with the roof, with
  slim walnut strips over the joints.
- **Beams.** Cleaned, treated for termites, then given a walnut stain and a
  matt varnish.
- **Light, all warm 2700 K.**
  - An LED strip hidden on top of the wall plates washes light up the ply.
  - Slim round downlights are set into the ply.
  - A rattan dome pendant hangs over the framed photo.
  - Brass up-and-down wall sconces replace the bare bulbs.
- **Walls.** Warm white, with the wall beside the curtains in a soft sage
  green.
- **Soft things.**
  - Plain linen curtains in sand.
  - A money plant in a macramé hanger from the beam.
  - A floating walnut shelf under the jali vent, with a pothos, a few books
    and a terracotta pot.
  - The restored photo of the six friends in a walnut frame.

```sh
python3 media/room-makeover/design.py [fonts_dir]   # about 4 minutes on CPU
```

## Three false ceilings compared

`room-main-ceilings.jpg`, `room-door-ceilings.jpg` and
`room-window-ceilings.jpg` show each view before, then with a bamboo chatai,
thin ply and gypsum false ceiling. Each view is also saved alone as
`*-chatai-after.jpg`, `*-ply-after.jpg` and `*-gypsum-after.jpg`.

In every mock-up the false ceiling is fixed to the underside of the rafters and
**inclined with the roof**. It hides the rafters, battens and roof sheets. The
big beams, the fan and the timber along the tops of the walls stay exposed
below it, polished walnut.

| | Bamboo chatai | Thin ply (4–6 mm) | Gypsum board |
| --- | --- | --- | --- |
| Look | Warm, natural, handmade; suits the old beams best | Warm wood with a visible grain; can be varnished or painted | Plain, smooth and modern; the brightest room |
| Cost | Lowest | Middle to high (frame, ply and polish) | Middle (needs a metal frame) |
| Weight | Very light | Medium | Heaviest |
| Heat | Some insulation | Good, better with foil above | Good, best with insulation above |
| Fire | Burns easily | Burns | Fire-resistant |
| Termites and damp | Treat with borax or anti-termite before fitting; can hold dust | Use termite-treated BWR or MR grade ply; varnish both sides | Not eaten by termites, but a roof leak stains and sags it |
| Life | About 8–10 years | 15+ years | 15+ years if the roof does not leak |

**Which to choose:**
- **Chatai** if you want it cheap, quick and cosy.
- **Ply** if you want warm wood that lasts.
- **Gypsum** if you want the brightest, cleanest look and the roof never leaks.

**For all three:**
- Fix a frame of wooden battens (or GI channels for gypsum) to the rafters,
  never to the roof sheets. The sheets look like asbestos-cement: do not
  drill, cut or sand them.
- Lay foil or thermocol insulation above the ceiling. The room stays cooler
  in summer.
- Close the open gaps at the tops of the walls.
- Leave a small hatch so the roof can be checked for leaks.

## What to do, cheapest and biggest change first

1. **Clear the room.**
   - Take down the saree hammock. If you want one, hang a proper cotton or
     macramé hammock, or a hanging chair, from the main beam with a rated hook.
   - Keep boxes and bundles in a trunk, under the bed, or in lidded woven
     baskets.
   - A wooden peg rail on one wall holds bags.
2. **Light.**
   - Use warm-white (2700–3000 K) LED bulbs instead of cool white.
   - Hang a string of warm fairy lights under the main beam.
   - Put a rattan or bamboo shade on the hanging bulb.
   - Run the loose wires on the beams through PVC casing, like the switch
     line that is already there.
3. **Curtains and cloth.**
   - Plain linen or cotton curtains in sand, beige or sage, on a wooden rod.
     The busy black-and-white print fights with the beams.
   - A solid earthy bedcover (terracotta, mustard or olive) with two or three
     Dhaka-fabric cushions, and a jute rug.
4. **The wood.**
   - Check the rafters for termites and borer (fine powder, small holes) and
     treat them first.
   - Then wipe them clean and give the beams and rafters a walnut stain and
     varnish.
   - Give the new door a clear varnish so it keeps its colour.
5. **The ceiling.** The grey roof sheets look like asbestos-cement sheets.
   Do not sand, scrape, drill, cut or pressure-wash them: damaged asbestos
   gives off harmful dust. Two safe ways to brighten them:
   - **Paint them.** Roll on a sealing primer, then warm-white paint, without
     scrubbing first. This is the mock-up's ceiling. It is the cheapest, and
     the room becomes much brighter.
   - **Or hide them.** Fit a false ceiling below the rafters, as compared
     above: bamboo chatai, thin ply or gypsum, with foil or thermocol
     insulation above. The room will also be cooler in summer and less dusty.

   Either way, close the open gaps between the wall tops and the roof with
   bamboo strips or fine mesh, to keep out dust, birds and insects.
6. **Walls.**
   - Keep them white, or paint the wall behind the bed in a warm earthy accent
     (terracotta, sage or soft beige).
   - Keep the concrete jali vent; it is a lovely feature.
7. **Personal touches.**
   - The restored photo of the six friends in a walnut frame (in the main
     mock-up).
   - A money plant trailing from the beam, and a snake plant in a terracotta
     pot.
   - A small wooden wall shelf.
   - A wood-finish ceiling fan to match the beams.

```sh
pip install numpy opencv-python-headless onnx onnxruntime
python3 media/room-makeover/makeover.py   # about 4 minutes on CPU
```
