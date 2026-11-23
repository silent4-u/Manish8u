# The ground floor in 3D

A 3D model of the drawn ground floor, with photos from the air and room by room. The house is 25'-0" × 35'-2", with:
- a 7'-6" verandah;
- a U-type stair;
- a living room (10'-8" × 10'-0");
- two bedrooms (12'-3" × 14'-4" and 12'-2" × 11'-2");
- a kitchen (11'-0" × 11'-2");
- a toilet (7'-0" × 4'-0").

`photos/` holds the 13 photos, 2560 × 1440, in walkthrough order:

| Photo | View |
| --- | --- |
| 01, 02 | From the air, front-left and front-right, roof off |
| 03 | 3D floor plan, walls cut at 4 ft, rooms labelled |
| 04 | Front view from the yard |
| 05 | Verandah, the stair and the main door |
| 06, 07 | Living room: the sofa side and the TV wall |
| 08, 09 | Passage with the wash basin; the toilet |
| 10, 11 | Kitchen, and the dining corner looking back |
| 12, 13 | Bedroom 1 and bedroom 2 |

`photos/half-wall/` holds the half-wall views: the walls are cut at 4'-9", half their height, so every room shows. The tall things are hidden in these views: door leaves, curtains, wall tiles, kitchen wall cabinets.

| Photo | View |
| --- | --- |
| 1–4 | From the front-left, front-right, rear-left and rear-right |
| 5 | Front-left, with the room names and sizes |
| 6 | From the top, labelled |

The model follows the drawing's openings:
- W5 windows, the M.D main door and the W4 window;
- V.2 and V.3 ventilators;
- D.3 bedroom doors and the back door;
- the D.2 toilet door.

Assumed:
- 9" outer walls and 4½" partitions;
- a 1'-6" plinth and 9'-6" ceilings;
- doors 6'-9" high, windows with a 3'-0" sill and a 7'-0" head.

The furniture is illustrative.

To rebuild the photos (three.js, rendered in headless Chromium):

```sh
npm install three@0.160.0
python3 -m http.server 8765 &          # from this folder, with node_modules beside index.html
node stills.js stillA stillB stillPlan stillVerandah stillEntry stillLiving stillLiving2 \
  stillPassage stillToilet stillKitchen stillKitchen2 stillBed1 stillBed2
node stills.js halfFL halfFR halfRL halfRR halfLabels stillPlan       # the half-wall views
```
