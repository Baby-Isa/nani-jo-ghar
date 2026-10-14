#!/usr/bin/env python3
"""Contact sheet of cuts on the game's cream (docs/archive/process/VISUAL-QA.md §2): python3 build/v3_contact.py OUT.png files... [--zoom]"""
import sys, math
from PIL import Image, ImageDraw
CREAM = (246, 239, 226)
def sheet(out, files, cell=300, cols=4, zoom=False):
    rows = math.ceil(len(files) / cols)
    S = Image.new("RGB", (cols * cell, rows * (cell + 18)), CREAM)
    d = ImageDraw.Draw(S)
    for i, f in enumerate(files):
        im = Image.open(f).convert("RGBA")
        if zoom:  # the top-left quarter at 2x: the edges and fringes
            im = im.crop((0, 0, im.width // 2, im.height // 2))
        im.thumbnail((cell - 8, cell - 8), Image.LANCZOS)
        x, y = (i % cols) * cell, (i // cols) * (cell + 18)
        S.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
        d.text((x + 4, y + cell + 2), f.split("/")[-1][:40], fill=(60, 50, 40))
    S.save(out)
if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    sheet(args[0], args[1:], zoom="--zoom" in sys.argv)
