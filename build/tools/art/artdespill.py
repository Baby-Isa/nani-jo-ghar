#!/usr/bin/env python3
"""Magenta spill off a cut-out's rim (s17 stove landing, 6 Nov): the pass after artcut.py on a magenta-ground sheet.

  python3 build/tools/art/artdespill.py assets/cook/items-s17-stove/t-onion-*.webp       # in place
  python3 build/tools/art/artdespill.py --band 3 --dry FILES                              # count only

artcut keys the magenta ground hard, but anti-aliased rim pixels (leaf edges, coconut fibre, a twine bow) keep a pink
tint, and a small pocket of ground inside a ring stays if it is under hole_min. Only inside a band of --band px from the
transparent edge: a pixel that is still magenta (R and B both well over G) goes transparent; any other pixel there whose
min(R, B) is over G is pulled back to G on R and B (the spill removed, its own hue kept). Pixels deeper in are never
touched, so a red onion or a pomegranate keeps its colour. Grey-ground cut-outs never need it.
"""
import argparse
import glob

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def despill(im, band=3, hard=60):
    a = np.asarray(im.convert("RGBA")).astype(np.int16)
    rgb, al = a[..., :3], a[..., 3]
    clear = al < 8
    near = ndi.binary_dilation(clear, iterations=band) & ~clear
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    magenta = near & (r - g > hard) & (b - g > hard) & (np.abs(r - b) < 70)
    spill = np.minimum(r, b) - g
    soft = near & ~magenta & (spill > 0)
    out = a.copy()
    out[..., 3][magenta] = 0
    for c in (0, 2):
        ch = out[..., c]
        ch[soft] = ch[soft] - spill[soft]
    out = np.clip(out, 0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA"), int(magenta.sum()), int(soft.sum())


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+")
    ap.add_argument("--band", type=int, default=3)
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()
    for p in a.files:
        for f in sorted(glob.glob(p)):
            im = Image.open(f)
            im.load()
            out, m, s = despill(im, a.band)
            print("%s: %d magenta rim px cleared, %d tinted px de-spilled" % (f, m, s))
            if not a.dry:
                out.save(f, quality=88, method=4)


if __name__ == "__main__":
    main()
