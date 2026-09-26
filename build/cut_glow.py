#!/usr/bin/env python3
"""Cuts a glowing sprite (gas flames) off a flat key with the minimal-alpha
un-mix: each pixel gets the smallest alpha that explains it as some colour
over the key, C = a*F + (1-a)*K. Near-key glow goes faint but keeps its own
bright colour, so there is no grey or tan rim on a light backing and no
haze left in an empty centre (slice_sheet.py's --glass keeps its filled
silhouette opaque at the edge, which suits glass but rims a glow).

Usage: python3 build/cut_glow.py <sheet.png> <cols> <rows> <out_dir> <name1> ... [--pad 16] [--floor 0.06]
Names left to right, top to bottom; "-" skips a cell. Only named cells are cut.
"""
import argparse
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet")
    ap.add_argument("cols", type=int)
    ap.add_argument("rows", type=int)
    ap.add_argument("out_dir")
    ap.add_argument("names", nargs="+")
    ap.add_argument("--pad", type=int, default=16)
    ap.add_argument("--floor", type=float, default=0.06, help="alpha below this is key noise")
    args = ap.parse_args()

    C = np.asarray(Image.open(args.sheet).convert("RGB"), float)
    h, w, _ = C.shape
    b = np.concatenate([C[:4].reshape(-1, 3), C[-4:].reshape(-1, 3), C[:, :4].reshape(-1, 3), C[:, -4:].reshape(-1, 3)])
    K = np.median(b, axis=0)
    E = C - K
    a = np.maximum(np.maximum(E / np.maximum(255 - K, 1), -E / np.maximum(K, 1)).max(axis=2), 0)
    a = np.clip((a - args.floor) / (1 - args.floor), 0, 1)
    F = np.clip(K + E / np.maximum(a, 1e-3)[..., None], 0, 255)
    # drop specks: keep only alpha blobs of a real size
    lab, n = ndi.label(a > 0.02)
    if n:
        sizes = ndi.sum(np.ones_like(a), lab, range(1, n + 1))
        a[np.isin(lab, 1 + np.nonzero(sizes < 40)[0])] = 0

    # Whole groups (a ring of separate flame tongues, joined by a dilation)
    # go to the cell holding their centroid, as slice_sheet.py does.
    cw, ch = w / args.cols, h / args.rows
    grp, ng = ndi.label(ndi.binary_dilation(a > 0.02, iterations=12))
    cents = ndi.center_of_mass(a > 0.02, grp, range(1, ng + 1))
    cell_of = {g + 1: int(cy // ch) * args.cols + int(cx // cw) for g, (cy, cx) in enumerate(cents) if cy == cy}
    os.makedirs(args.out_dir, exist_ok=True)
    for i, name in enumerate(args.names):
        if name == "-":
            continue
        keep = np.isin(grp, [g for g, cell in cell_of.items() if cell == i]) & (a > 0)
        ys, xs = np.nonzero(keep & (a > 0.02))
        ty0, ty1, tx0, tx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        p = args.pad
        out = np.zeros((ty1 - ty0 + 2 * p, tx1 - tx0 + 2 * p, 4), np.uint8)
        out[p:-p, p:-p, :3] = F[ty0:ty1, tx0:tx1].round()
        out[p:-p, p:-p, 3] = (np.where(keep, a, 0)[ty0:ty1, tx0:tx1] * 255).round()
        path = os.path.join(args.out_dir, name + ".png")
        Image.fromarray(out, "RGBA").save(path, optimize=True)
        print(f"wrote {path} {out.shape[1]}x{out.shape[0]}")


if __name__ == "__main__":
    main()
