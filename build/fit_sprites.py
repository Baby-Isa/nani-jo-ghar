#!/usr/bin/env python3
"""Rescales a set of sliced sprites by ONE factor, so their sizes relative to
each other (as drawn on their sheet) are kept. Each sprite is trimmed to its
visible pixels, resized with premultiplied alpha (no dark or key-coloured
fringe), and re-padded.

Usage:
  python3 build/fit_sprites.py max:512 a.png b.png ...
      the set's longest side (with pad) becomes at most 512 px (never enlarged)
  python3 build/fit_sprites.py match:<twin.png>:<ref.png> a.png b.png ...
      <ref.png> (one of the set) gets the same visible width as <twin.png>,
      the existing sprite it must swap with in the game (e.g. the bajri maani
      with the wheat maani)
  [--pad 16]
"""
import argparse

import numpy as np
from PIL import Image


def content(path):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im)[..., 3]
    ys, xs = np.nonzero(a > 8)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("rule")
    ap.add_argument("sprites", nargs="+")
    ap.add_argument("--pad", type=int, default=16)
    args = ap.parse_args()
    ims = {p: content(p) for p in args.sprites}
    kind, _, rest = args.rule.partition(":")
    if kind == "max":
        longest = max(max(im.size) for im in ims.values())
        f = min(1.0, (int(rest) - 2 * args.pad) / longest)
    elif kind == "match":
        twin, ref = rest.split(":")
        f = content(twin).size[0] / ims[ref].size[0]
    else:
        raise SystemExit("rule is max:N or match:twin:ref")
    print(f"factor {f:.3f}")
    if abs(f - 1) < 1e-3:
        return
    for p, im in ims.items():
        w, h = max(1, round(im.size[0] * f)), max(1, round(im.size[1] * f))
        pm = im.convert("RGBa").resize((w, h), Image.LANCZOS).convert("RGBA")
        out = Image.new("RGBA", (w + 2 * args.pad, h + 2 * args.pad), (0, 0, 0, 0))
        out.paste(pm, (args.pad, args.pad))
        out.save(p, optimize=True)
        print(f"  {p} {out.size[0]}x{out.size[1]}")


if __name__ == "__main__":
    main()
