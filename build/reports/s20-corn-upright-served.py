"""s20-corn-upright round 2 (CK-127): corn's served dish, composed by script from existing art only (never new drawing,
non-negotiable 8): the kit's cream plate (assets/art/kit/plate-cream) squashed to the serving view's angle (as the other served
plates sit on their trays), the chopped done cob (assets/art/corn/cob.done.chopped) standing on it, as on the flavour screen, with
a soft shadow down and to the right (one light, upper left). Writes assets/art/corn/served.upright.r1.webp.
Run from the repo root: python3 build/reports/s20-corn-upright-served.py"""
from PIL import Image, ImageFilter

W, SQ = 560, 0.62  # the canvas width; the plate's height over its width as the serving view sees it
plate = Image.open("assets/art/kit/plate-cream.default.r1.webp").convert("RGBA")
plate = plate.crop(plate.getbbox()).resize((W, round(W * SQ)), Image.LANCZOS)
cob = Image.open("assets/art/corn/cob.done.chopped.r1.webp").convert("RGBA").rotate(90, expand=True)
L = round(plate.height * 0.8)  # the cob's length: inside the plate's rim, top to bottom
cob = cob.resize((round(cob.width * L / cob.height), L), Image.LANCZOS)
pad = 12
out = Image.new("RGBA", (W + 2 * pad, plate.height + 2 * pad), (0, 0, 0, 0))
out.alpha_composite(plate, (pad, pad))
cx, cy = pad + W // 2, pad + plate.height // 2
# the cob's soft shadow: its own outline, blurred, a little see-through, offset down and to the right
sh = Image.new("RGBA", cob.size, (60, 35, 20, 0))
sh.putalpha(cob.getchannel("A").point(lambda a: int(a * 0.32)))
sh = sh.filter(ImageFilter.GaussianBlur(6))
out.alpha_composite(sh, (cx - cob.width // 2 + 7, cy - cob.height // 2 + 9))
out.alpha_composite(cob, (cx - cob.width // 2, cy - cob.height // 2))
out.save("assets/art/corn/served.upright.r1.webp", quality=90, method=6)
print("served", out.size, "cob", cob.size)
