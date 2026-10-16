#!/usr/bin/env python3
"""The feet of every standing (and the seated girl's) picture, for their contact shadows (s08-placement-judge, CLN-154..157).

  python3 build/tools/art/shoes.py            # measure and write data/clinic/heal-art.json "shoes"
  python3 build/tools/art/shoes.py --check    # measure and print; write nothing

Each picture's feet are read off its alpha: the opaque runs 3% of the picture up from its lowest row (one per foot), each
widened to the foot's own extent below that line (never past half way to the next foot), with its own lowest row; the
foot's height is from that row up to its ankle: the narrowest row of the foot's columns above its widest one, within 8%
of the picture (the trouser hem over his shoes, the sandal's ankle strap on hers). Written as [cx, bottom, w, h] canvas
fractions (x and w of the width, bottom and h of the height), keyed by the picture's path, for Kit.contactShadows (js/clinic/kit.js): a soft ellipse under each foot, black at
0.18, 1.2x the foot's width and a quarter of that tall (the judge's spec; h is kept as measured, see Kit.contactShadows).
"""
import json
import os
import sys

import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATA = os.path.join(REPO, "data", "clinic", "heal-art.json")


def feet(path):
    a = np.array(Image.open(os.path.join(REPO, path)).convert("RGBA"))[:, :, 3] > 128
    H, W = a.shape
    rows = np.where(a.any(1))[0]
    bot = rows[-1]
    y_run = max(0, bot - round(H * 0.03))
    runs, x = [], 0
    r = a[y_run]
    while x < W:
        if r[x]:
            s = x
            while x < W and r[x]:
                x += 1
            if x - s > W * 0.1:
                runs.append((s, x))
        x += 1
    out = []
    for i, (s, e) in enumerate(runs):
        lo = (runs[i - 1][1] + s) // 2 if i else 0
        hi = (e + runs[i + 1][0]) // 2 if i < len(runs) - 1 else W
        sub = a[y_run:bot + 1, lo:hi]
        ys, xs = np.where(sub)
        x0, x1, yb = lo + xs.min(), lo + xs.max() + 1, y_run + ys.max()
        # the ankle: the narrowest row of the foot's own columns, up to 8% of the picture above its lowest row
        # (above the foot's widest row in its bottom 6%: the sole's rounded edge is narrow too)
        widest = max((int(a[y, lo:hi].sum()), -y) for y in range(yb, max(0, yb - round(H * 0.06)), -1))[1] * -1
        widths = [(int(a[y, lo:hi].sum()), -y) for y in range(widest, max(0, yb - round(H * 0.08)), -1)]
        top = min(w_ for w_ in widths if w_[0] > 0)[1] * -1
        out.append([round(float(x0 + x1) / 2 / W, 4), round(float(yb + 1) / H, 4), round(float(x1 - x0) / W, 4), round(float(yb + 1 - top) / H, 4)])
    return out


def pictures(art):
    """Every picture a standing figure (or the seated girl in the exam) is drawn with: the doctor's views, the girl's."""
    files = [v["file"] for v in art["doctor"]["views"].values()]
    g = art["patients"]["girl"]
    files.append(g["front"])
    st = g["stand"]
    files += [st["front"], st["wave"]] + [t["file"] for t in (st.get("turns") or {}).values()]
    return list(dict.fromkeys(files))


def main():
    art = json.load(open(DATA))
    shoes = {"_about": __doc__.split("\n\n")[1].replace("\n", " ").strip()}
    for f in pictures(art):
        shoes[f] = feet(f)
        print(f, shoes[f])
    if "--check" in sys.argv:
        return
    art["shoes"] = shoes
    with open(DATA, "w") as fh:
        json.dump(art, fh, indent=1, ensure_ascii=False)
        fh.write("\n")


if __name__ == "__main__":
    main()
