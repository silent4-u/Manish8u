"""Rough outlines of each garment in friends-b.jpg (1600 x 1073), drawn by eye.

Each outline only has to contain its garment: the pixels inside it that
actually belong to the garment are picked by colour (see deep_clean.py).
"""

GARMENTS = {
    # name: (kind, outline)
    # kind "plain" garments are rebuilt as clean fabric; "check" garments keep
    # their pattern and only have their stains inpainted.
    "first_shirt_trousers": ("plain", [(250, 400), (330, 415), (420, 420), (480, 450), (530, 520), (570, 620),
                                       (580, 760), (540, 800), (520, 900), (500, 1073), (240, 1073), (225, 980),
                                       (195, 880), (165, 760), (150, 640), (170, 540), (220, 460)]),
    "second_shirt": ("plain", [(430, 330), (480, 310), (560, 350), (640, 360), (660, 420), (650, 520), (640, 640),
                               (620, 760), (560, 790), (520, 780), (560, 700), (540, 600), (510, 520), (470, 450),
                               (420, 400)]),
    "second_trousers": ("plain", [(510, 780), (640, 760), (700, 820), (740, 950), (760, 1073), (560, 1073),
                                  (540, 950)]),
    "third_tshirt": ("plain", [(660, 340), (700, 330), (860, 330), (900, 360), (910, 480), (900, 600), (890, 760),
                               (700, 770), (680, 650), (660, 500)]),
    "third_trousers": ("plain", [(690, 760), (890, 760), (930, 850), (960, 1073), (700, 1073), (690, 900)]),
    "fourth_shirt": ("plain", [(900, 380), (1000, 370), (1020, 420), (1000, 560), (950, 740), (930, 740),
                               (910, 560)]),
    "fifth_shirt": ("check", [(910, 520), (960, 440), (1050, 400), (1150, 380), (1230, 410), (1250, 520),
                              (1240, 700), (1230, 820), (1060, 820), (1030, 700), (990, 650), (940, 620)]),
    "fifth_trousers": ("plain", [(1030, 810), (1250, 800), (1260, 950), (1250, 1073), (1040, 1073), (1030, 950)]),
    "sixth_shirt": ("check", [(1250, 360), (1330, 340), (1420, 290), (1530, 340), (1570, 450), (1590, 620),
                              (1560, 700), (1500, 740), (1260, 760), (1240, 600)]),
    "sixth_trousers": ("plain", [(1250, 740), (1500, 740), (1560, 820), (1560, 1073), (1260, 1073), (1245, 900)]),
}

# Things inside a garment outline that are not fabric, and must survive the
# rebuild: the first boy's belt, the fifth boy's belt and buckle.
KEEP = [
    [(262, 940), (330, 925), (420, 905), (500, 878), (512, 915), (430, 945), (330, 970), (266, 985)],
    [(1065, 805), (1250, 798), (1252, 842), (1070, 850)],
    # Arms and hands over the checked shirts: skin, not shirt.
    [(1190, 330), (1240, 340), (1250, 400), (1225, 470), (1200, 530), (1185, 600), (1160, 625), (1130, 610),
     (1125, 560), (1150, 520), (1175, 470), (1190, 400)],                     # fifth: forearm and hand
    [(930, 610), (980, 640), (1010, 700), (1050, 722), (1100, 738), (1112, 770), (1092, 802), (1050, 812),
     (1008, 800), (975, 730), (935, 665)],                                     # fifth: hand on hip
    [(1255, 310), (1310, 300), (1322, 350), (1302, 388), (1265, 382)],         # hand on the sixth's shoulder
    [(1500, 640), (1560, 640), (1566, 760), (1505, 760)],                      # sixth: forearm
]

# Large smears the colour tests cannot separate from the shirt or skin under
# them; repainted with LaMa. (x, y) outlines in friends-b.jpg.
SMEARS = [
    [(545, 376), (574, 380), (578, 412), (575, 444), (546, 447), (538, 427), (500, 427), (497, 404),
     (528, 394), (543, 390)],                                                    # second boy's chest
]
