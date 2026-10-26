#!/usr/bin/env python3
"""s12-w3b: tile shots into a labelled filmstrip.  strip.py OUT.png COLS [--crop x0,y0,x1,y1] [--w W] shot.png ..."""
import sys

from PIL import Image, ImageDraw

args = sys.argv[1:]
out, cols = args[0], int(args[1])
crop = None
w = 480
rest = []
i = 2
while i < len(args):
    if args[i] == "--crop":
        crop = tuple(int(v) for v in args[i + 1].split(","))
        i += 2
    elif args[i] == "--w":
        w = int(args[i + 1])
        i += 2
    else:
        rest.append(args[i])
        i += 1
ims = []
for f in rest:
    im = Image.open(f).convert("RGB")
    if crop:
        im = im.crop(crop)
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    label = f.rsplit("/", 1)[-1].rsplit(".", 1)[0]
    d.rectangle((0, 0, 7 * len(label) + 8, 16), fill=(0, 0, 0))
    d.text((4, 2), label, fill=(255, 255, 255))
    ims.append(im)
h = max(im.height for im in ims)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w + (cols - 1) * 4, rows * h + (rows - 1) * 4), (255, 255, 255))
for k, im in enumerate(ims):
    sheet.paste(im, ((k % cols) * (w + 4), (k // cols) * (h + 4)))
sheet.save(out)
print(out, sheet.size)
