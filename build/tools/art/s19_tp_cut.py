#!/usr/bin/env python3
"""Cut the S19 tray-and-pot run (Zafar's 7 PM block, 10 Nov) off magenta with s19_cut.py's keying.
T1 the stone tray (one piece), T2 the stone tile (no key: a square texture, 512 px), P1/P2 the pot with water and empty
(kept at the same box so they swap), E1 the cream plate, E2 a fried egg, E3 a boiled egg's halves (one piece), at the table's angle.
Usage: python3 build/tools/art/s19_tp_cut.py"""
import os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from s19_cut import alpha_of, despill, save, pieces

SRC = "sources/art/s19-tray-pot/results/best/"
OUT = "assets/cook/items/v4/"
WHOLE = {"T1": ("kit/tray-stone", 1600), "E1": ("eggs/plate-table", 700), "E2": ("eggs/fried-table", 520), "E3": ("eggs/boiled-halves-table", 520)}
POTS = {"P1": "kit/pot-water", "P2": "kit/pot-empty"}

def whole(line, name, maxside, box=None):
    a = np.asarray(Image.open(SRC + line + ".png").convert("RGB")).astype(float)
    al = alpha_of(a); rgb = despill(a, al)
    if box is None:
        ys, xs = np.where(al > 0.5)
        box = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
    return save(rgb, al, box, None, None, f"{OUT}{name}.webp", maxside), box

def main():
    for line, (name, m) in WHOLE.items():
        im, _ = whole(line, name, m); print(name, im.size)
    # the two pots share one box (the union), so water and empty swap in place
    boxes = []
    for line in POTS:
        a = np.asarray(Image.open(SRC + line + ".png").convert("RGB")).astype(float)
        ys, xs = np.where(alpha_of(a) > 0.5); boxes.append((ys.min(), ys.max(), xs.min(), xs.max()))
    y0, y1, x0, x1 = min(b[0] for b in boxes), max(b[1] for b in boxes), min(b[2] for b in boxes), max(b[3] for b in boxes)
    for line, name in POTS.items():
        im, _ = whole(line, name, 900, (slice(y0, y1 + 1), slice(x0, x1 + 1))); print(name, im.size)
    t = Image.open(SRC + "T2.png").convert("RGBA").resize((512, 512), Image.LANCZOS)
    t.putpixel((0, 0), t.getpixel((0, 0))[:3] + (254,))  # (an opaque webp is saved without alpha; the art check wants WebP with alpha)
    t.save(f"{OUT}kit/tray-stone-tile.webp", "WEBP", quality=88, method=6, exact=True); print("kit/tray-stone-tile", t.size)

if __name__ == "__main__":
    main()
