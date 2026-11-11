#!/usr/bin/env python3
"""Take the magenta out of a cut's soft edge (ART-76, 10 Nov: a hairline pink rim on most S19 cuts).
For every semi-transparent pixel, the colour is replaced by the colour of the nearest solid pixels of the piece itself (the
standard edge-bleed for cut-outs): the alpha is kept, so the edge stays soft, but it can no longer carry the magenta it was cut from.
A pinkish solid pixel within 2 px of the soft edge (min(r,b) - g over 40, red near blue) is treated as edge too.
Usage: python3 build/tools/art/edge_bleed.py [--check] FILE_OR_DIR ...   (--check: report, change nothing)"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

def pink_share(a):
    al = a[..., 3]; e = (al > 20) & (al < 235)
    if e.sum() < 50: return 0.0
    r, g, b = (a[..., i][e].astype(float) for i in range(3))
    return float((((np.minimum(r, b) - g) > 35) & (np.abs(r - b) < 90)).mean())

def bleed(a):
    a = a.astype(float); al = a[..., 3]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    soft = (al > 0) & (al < 250)
    rim = ndimage.binary_dilation(soft, iterations=2)  # a pinkish solid pixel counts only within 2 px of the soft edge (a red onion's own purple stays)
    pinkish = ((np.minimum(r, b) - g) > 40) & (np.abs(r - b) < 90) & rim
    solid = (al >= 250) & ~pinkish
    if solid.sum() == 0: return a.astype(np.uint8)
    # nearest solid pixel for every pixel
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    near = a[iy, ix, :3]
    # smooth the borrowed colour a little so the rim isn't blocky
    for c in range(3): near[..., c] = ndimage.uniform_filter(near[..., c], 3)
    fix = (al > 0) & ((al < 250) | pinkish)
    a[fix, :3] = near[fix]
    return np.clip(a, 0, 255).astype(np.uint8)

# see-through glass and thin steel keep their soft pixels as cut (their soft edge is the glass, not a rim): baking's bowls and jugs,
# the empty skewer
SKIP = ("/baking/jug-", "/baking/bowl-", "/sekelo/skewer-empty")

def files(paths):
    for p in paths:
        if os.path.isdir(p):
            for d, _, fs in os.walk(p):
                for f in sorted(fs):
                    if f.endswith(".webp") and not any(k in os.path.join(d, f) for k in SKIP): yield os.path.join(d, f)
        else: yield p

def main():
    check = "--check" in sys.argv
    paths = [p for p in sys.argv[1:] if p != "--check"]
    n = before = after = 0
    for f in files(paths):
        im = Image.open(f)
        if im.mode != "RGBA": continue
        a = np.asarray(im)
        s0 = pink_share(a); n += 1; before += s0 > 0.15
        if check: continue
        b = bleed(a); s1 = pink_share(b); after += s1 > 0.15
        Image.fromarray(b, "RGBA").save(f, "WEBP", quality=90, method=6, exact=True)
    print(f"{n} cuts; pink rim (over 15% of the soft edge) before: {before}" + ("" if check else f", after: {after}"))

if __name__ == "__main__":
    main()
