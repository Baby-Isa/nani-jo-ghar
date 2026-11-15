"""s20-corn-upright (CK-117, CK-119; decision 37): the chopped cob, cut by script from the existing cob art (never new drawing,
non-negotiable 8). Keeps the cob's thick middle (350 of its 900 px: the stem and the tapered tip cut off), rounds the cut ends a
little and shades them a touch, so it reads shorter and fatter (about 2.6:1). Writes cob.<state>.chopped.r1.webp (lying: its length
the picture's width, as the whole cob; code stands it upright) and cob.card.upright.r1.webp (the done cob turned upright, its cut end
up, for the item card and the pop-up card). Run from the repo root: python3 build/reports/s20-corn-upright-cut.py"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC = "assets/art/corn/cob.{}.r1.webp"
X0, X1 = 275, 625  # the middle kept, picture px of 900 (the cob is thickest at x 300-600)
SS = 4  # supersampling for the rounded ends' edge


def chop(im):
    w, h = im.size
    a = np.array(im).astype(np.float32)
    # the rounded-rectangle mask over the kept middle (corner radius 0.3 of the cob's thickness), anti-aliased
    rows = np.where(a[:, (X0 + X1) // 2, 3] > 128)[0]
    th = rows.max() - rows.min()
    r = 0.3 * th
    m = Image.new("L", ((X1 - X0) * SS, h * SS), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, rows.min() * SS - 2 * SS, (X1 - X0) * SS - 1, rows.max() * SS + 2 * SS], radius=r * SS, fill=255)
    m = np.array(m.resize((X1 - X0, h), Image.LANCZOS)).astype(np.float32) / 255
    out = a[:, X0:X1].copy()
    out[:, :, 3] *= m
    # the cut ends a touch darker (the kernels turning away at the cut), fading in over 0.12 of the thickness
    fade = max(1, int(0.12 * th))
    for i in range(fade):
        k = 0.82 + 0.18 * (i / fade)
        out[:, i, :3] *= k
        out[:, -1 - i, :3] *= k
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA")
    return img.crop(img.getbbox())


# CK-129 (round 2, the eye judge: the cob "about 2.2:1 raw, 2.7:1 cooked"): every state one shape, ONE canvas (the K4 cobs differ a
# few per cent in thickness), so the cob keeps its aspect in every place and state
SHAPE = (350, 140)
for st in ["raw", "turned", "done", "over"]:
    c = chop(Image.open(SRC.format(st)).convert("RGBA")).resize(SHAPE, Image.LANCZOS)
    c.save(f"assets/art/corn/cob.{st}.chopped.r1.webp", lossless=False, quality=90, method=6)
    print(st, c.size, round(c.size[0] / c.size[1], 2))
# the card picture: the done cob upright (turned a quarter anticlockwise: its right end up, as the game stands it, GK.lay up),
# CK-128 (round 2: "the short fat cob whole with air round it, as chai's jar in its card"): standing in a canvas of the jar's shape
# (0.8 wide to its height) with 8% air above and below it
up = chop(Image.open(SRC.format("done")).convert("RGBA")).resize(SHAPE, Image.LANCZOS).rotate(90, expand=True)
H = round(up.height / 0.84)
card = Image.new("RGBA", (round(H * 0.8), H), (0, 0, 0, 0))
card.alpha_composite(up, ((card.width - up.width) // 2, (H - up.height) // 2))
card.save("assets/art/corn/cob.card.upright.r1.webp", lossless=False, quality=90, method=6)
print("card", card.size)
