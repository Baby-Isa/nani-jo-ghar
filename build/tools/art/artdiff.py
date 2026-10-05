#!/usr/bin/env python3
"""Compare two folders of cut art, file by file (the cutter's proof against an older script's output).

  python3 build/tools/art/artdiff.py REF_DIR NEW_DIR [--glob 'closeups/**/*.webp'] [--tol 2]

Prints one line per file: size match, share of pixels whose RGBA differs by more than --tol (alpha-weighted RGB, so
invisible pixels never count), and the max difference; then a one-line verdict. Exit 1 if any file differs by more
than 0.5 % of its pixels or is missing/different in size. Alpha-0 pixels are ignored."""
import argparse
import glob
import os
import sys

import numpy as np
from PIL import Image


def cmp(a, b, tol):
    A = np.asarray(Image.open(a).convert("RGBA")).astype(int)
    B = np.asarray(Image.open(b).convert("RGBA")).astype(int)
    if A.shape != B.shape:
        return None, None, "size %s vs %s" % (A.shape[1::-1], B.shape[1::-1])
    vis = (A[..., 3] > 0) | (B[..., 3] > 0)
    w = np.maximum(A[..., 3], B[..., 3])[..., None] / 255.0
    d = np.concatenate([np.abs(A[..., :3] - B[..., :3]) * w, np.abs(A[..., 3:] - B[..., 3:])], 2).max(2)
    bad = (d > tol) & vis
    return bad.sum() / max(1, vis.sum()), int(d.max()), ""


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("ref")
    ap.add_argument("new")
    ap.add_argument("--glob", default="**/*.webp")
    ap.add_argument("--tol", type=int, default=2)
    a = ap.parse_args()
    files = sorted(glob.glob(os.path.join(a.new, a.glob), recursive=True))
    worst, n_bad = 0, 0
    for f in files:
        rel = os.path.relpath(f, a.new)
        r = os.path.join(a.ref, rel)
        if not os.path.exists(r):
            print("  %-48s no reference" % rel)
            n_bad += 1
            continue
        share, mx, why = cmp(r, f, a.tol)
        if share is None:
            print("  %-48s DIFFERENT %s" % (rel, why))
            n_bad += 1
            continue
        worst = max(worst, share)
        bad = share > 0.005
        n_bad += bad
        print("  %-48s %6.3f%% px differ, max %3d%s" % (rel, share * 100, mx, "  <--" if bad else ""))
    print("%d file(s), %d differing; worst %.3f%% of visible pixels" % (len(files), n_bad, worst * 100))
    return 1 if n_bad else 0


if __name__ == "__main__":
    sys.exit(main())
