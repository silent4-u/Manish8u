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
   - **Or hide them.** Fit a false ceiling below the rafters: bamboo mat
     (chatai) for a warm natural look, or PVC panels, with foil or thermocol
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
python3 media/room-makeover/makeover.py   # about 2 minutes on CPU
```
