#!/usr/bin/env python3
"""Art pipeline step, per the Technical Plan's "Art: sheets to sliced
assets": keys out a sheet's flat background and cuts one transparent PNG
per grid cell, trimmed to its own content with a small pad. Re-run
whenever a new sheet is generated.

Usage:
  python3 build/slice_sheet.py <sheet.png> <cols> <rows> <out_dir> <name1> <name2> ...
      [--key magenta|grey] [--pad 16] [--glass name,name] [--sheer name,name]
      [--keep-purple name,name]

Names are given left to right, top to bottom; "-" skips a cell.

Keys:
  magenta  (default) the flat #FF00FF sheets. Everything close to the key
           colour is background, wherever it is (holes in a torn maani too).
  grey     the flat #808080 sheets for steel, iron and glass. Steel is grey
           too, so only *flat* near-key pixels count, and only if they touch
           the sheet edge or form a hole of a real size (a handle loop). Steel
           reflections and brushed gradients are never flat, so they stay.

Method (the Naming Convention doc's "method that actually works", brought
up to the 3D look, which has no outlines to hide a hard edge in):
  1. The key colour is measured from the sheet's border, not assumed.
  2. Whole blobs are assigned to the cell holding their centroid, so an item
     poking past a cell edge moves as a unit and loose heaps stay together.
     Specks below --min-blob pixels are dropped.
  3. Edges are soft: a 2-3 px band where each pixel's alpha is its
     projection between the key and the colour of the nearest solid pixel,
     and its colour is that solid colour. No key colour survives in the
     band, so there is no magenta or grey fringe on black or white.
  4. Magenta caught in gaps inside an item (between coriander stalks) is
     found by colour (on the line from the local item colour to the key)
     and made transparent in proportion; --keep-purple skips red onion.
  5. --glass cells (and --sheer cells: wire mesh) use a difference matte
     inside their filled silhouette: alpha grows with the distance from the
     key, and colour is un-mixed from the key, so glass keeps its
     reflections and dark edges and goes see-through where the backdrop
     showed through.

Needs numpy and scipy (pip install scipy).
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

KEYS = {"magenta": (255, 0, 255), "grey": (128, 128, 128)}


def measure_key(rgb, nominal):
    """Median of a 4 px border, if it is near the nominal key colour."""
    b = np.concatenate([rgb[:4].reshape(-1, 3), rgb[-4:].reshape(-1, 3),
                        rgb[:, :4].reshape(-1, 3), rgb[:, -4:].reshape(-1, 3)])
    k = np.median(b, axis=0)
    if np.linalg.norm(k - np.array(nominal, float)) > 60:
        sys.exit(f"border colour {k} is not the {nominal} key; wrong --key?")
    return k


def local_std(rgb, size=5):
    g = rgb.mean(axis=2)
    m = ndi.uniform_filter(g, size)
    m2 = ndi.uniform_filter(g * g, size)
    return np.sqrt(np.maximum(m2 - m * m, 0))


def background_mask(rgb, K, kind):
    d = np.linalg.norm(rgb - K, axis=2)
    if kind == "magenta":
        # Border noise on these sheets tops out around 12 (rare specks ~38).
        return d < 40, d
    # Grey: flat and near the key; then only regions touching the edge, or
    # enclosed holes of a real size (handle loops, gaps in a wire basket).
    cand = (d < 12) & (local_std(rgb) < 2.5)
    lab, n = ndi.label(cand)
    if n == 0:
        return cand, d
    sizes = ndi.sum(np.ones_like(lab), lab, index=np.arange(1, n + 1))
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    keep = np.zeros(n + 1, bool)
    keep[1:] = sizes >= 25
    keep[edge] = True
    keep[0] = False
    # Grow those flat seeds into the near-key pixels that touch them (the
    # soft falloff at a steel rim is near-key but not flat).
    bg = ndi.binary_propagation(keep[lab], mask=d < 16)
    return bg, d


def soft_alpha(rgb, K, fg, band=2):
    """Alpha and colour for a solid (opaque) item mask with a soft edge."""
    h, w, _ = rgb.shape
    alpha = fg.astype(float)
    out = rgb.copy()
    interior = ndi.binary_erosion(fg, iterations=band)
    if not interior.any():
        return alpha, out
    edge = fg & ~interior
    # Nearest interior pixel for every pixel.
    dist_in, (iy, ix) = ndi.distance_transform_edt(~interior, return_indices=True)
    ys, xs = np.nonzero(edge)
    F = rgb[iy[ys, xs], ix[ys, xs]]
    C = rgb[ys, xs]
    v = F - K
    vv = (v * v).sum(1)
    a = np.clip(((C - K) * v).sum(1) / np.maximum(vv, 1), 0, 1)
    # Thin parts (sev strands, stalks) have no interior close by: judge them
    # by their own distance from the key and un-mix their colour.
    thin = dist_in[ys, xs] > band + 2
    dC = np.linalg.norm(C - K, axis=1)
    a_thin = np.clip((dC - 40) / 80, 0, 1)
    a[thin] = a_thin[thin]
    F[thin] = np.clip(K + (C[thin] - K) / np.maximum(a_thin[thin, None], 0.2), 0, 255)
    # Where the item colour is too close to the key to judge (grey steel on
    # grey), fall back to a one-pixel feather at the outermost ring.
    dist_out = ndi.distance_transform_edt(fg)
    near = (vv <= 400) & ~thin
    a[near] = np.clip(dist_out[ys, xs][near] / 2.0, 0.5, 1)
    # A pixel that is nearly solid keeps its own colour (detail survives).
    keep = (a > 0.92) & ~thin
    F[keep] = C[keep]
    alpha[ys, xs] = a
    out[ys, xs] = F
    return alpha, out


def despill_magenta(rgb, K, fg, alpha, out, win=11):
    """Magenta that shows through gaps inside an item (between coriander
    stalks, sev strands, chopped pieces) is mixed with the item there, so it
    survives the key. Find pixels that sit on the line between the local
    item colour and the key, and make them as transparent as they are
    magenta. Purple items (red onion) skip this: see --keep-purple."""
    s = np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1]
    w = (fg & (s < 20)).astype(float)
    dens = ndi.uniform_filter(w, win)
    Fl = np.stack([ndi.uniform_filter(rgb[..., c] * w, win) for c in range(3)], -1)
    Fl = Fl / np.maximum(dens[..., None], 1e-6)
    cand = fg & (s >= 20) & (dens > 0.08)
    ys, xs = np.nonzero(cand)
    if len(ys) == 0:
        return alpha, out
    C, F = rgb[ys, xs], Fl[ys, xs]
    v = K - F
    vv = np.maximum((v * v).sum(1), 1)
    t = ((C - F) * v).sum(1) / vv
    perp = np.linalg.norm(C - F - t[:, None] * v, axis=1)
    spill = (t > 0.08) & (perp < 45)
    a_new = np.clip(1 - t, 0, 1)
    ys, xs = ys[spill], xs[spill]
    alpha = alpha.copy()
    alpha[ys, xs] = np.minimum(alpha[ys, xs], a_new[spill])
    out = out.copy()
    out[ys, xs] = F[spill]
    return alpha, out


def difference_matte(rgb, K, d, region, a_min=0.0, ramp=(6, 56)):
    """Glass and mesh: alpha from distance to the key, colour un-mixed."""
    a = np.clip((d - ramp[0]) / (ramp[1] - ramp[0]), a_min, 1.0)
    a = np.where(region, a, 0.0)
    safe = np.maximum(a, 1e-3)[..., None]
    F = np.clip(K + (rgb - K) / safe, 0, 255)
    return a, F


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet")
    ap.add_argument("cols", type=int)
    ap.add_argument("rows", type=int)
    ap.add_argument("out_dir")
    ap.add_argument("names", nargs="+")
    ap.add_argument("--key", choices=KEYS, default="magenta")
    ap.add_argument("--pad", type=int, default=16)
    ap.add_argument("--min-blob", type=int, default=60)
    ap.add_argument("--glass", default="", help="comma-separated names cut as glass")
    ap.add_argument("--sheer", default="", help="comma-separated names cut as wire mesh")
    ap.add_argument("--keep-purple", default="", help="comma-separated names (red onion) to skip the magenta despill")
    args = ap.parse_args()

    glass = set(filter(None, args.glass.split(",")))
    sheer = set(filter(None, args.sheer.split(",")))
    keep_purple = set(filter(None, args.keep_purple.split(",")))
    rgb = np.asarray(Image.open(args.sheet).convert("RGB")).astype(float)
    h, w, _ = rgb.shape
    K = measure_key(rgb, KEYS[args.key])
    bg, d = background_mask(rgb, K, args.key)
    fg = ~bg

    # Whole blobs, assigned to the cell that holds their centroid.
    lab, n = ndi.label(fg, structure=np.ones((3, 3)))
    idx = np.arange(1, n + 1)
    sizes = ndi.sum(np.ones_like(lab), lab, index=idx)
    cents = ndi.center_of_mass(np.ones_like(lab), lab, index=idx)
    cw, ch = w / args.cols, h / args.rows
    cell_of = np.full(n + 1, -1)
    for i, (s, (cy, cx)) in enumerate(zip(sizes, cents), start=1):
        if s < args.min_blob:
            continue
        col = min(int(cx // cw), args.cols - 1)
        row = min(int(cy // ch), args.rows - 1)
        cell_of[i] = row * args.cols + col
    cellmap = cell_of[lab]
    cellmap[lab == 0] = -1

    os.makedirs(args.out_dir, exist_ok=True)
    for i, name in enumerate(args.names[: args.cols * args.rows]):
        if name == "-":
            continue
        mask = cellmap == i
        if not mask.any():
            print(f"EMPTY cell {i} ({name})")
            continue
        ys, xs = np.nonzero(mask)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        r, c = divmod(i, args.cols)
        crosses = (x0 < c * cw - 1 or x1 > (c + 1) * cw + 1 or
                   y0 < r * ch - 1 or y1 > (r + 1) * ch + 1)
        # Work on the crop plus a margin so the edge band has room.
        m = 4
        Y0, Y1, X0, X1 = max(y0 - m, 0), min(y1 + m, h), max(x0 - m, 0), min(x1 + m, w)
        sub = rgb[Y0:Y1, X0:X1]
        msk = mask[Y0:Y1, X0:X1]
        if name in glass or name in sheer:
            region = ndi.binary_fill_holes(ndi.binary_closing(msk, iterations=3))
            if name in sheer:
                region = msk | ndi.binary_dilation(msk, iterations=1) & region
            a, col_ = difference_matte(sub, K, d[Y0:Y1, X0:X1], region,
                                       a_min=0.06 if name in glass else 0.0)
        else:
            a, col_ = soft_alpha(sub, K, msk)
            if args.key == "magenta" and name not in keep_purple:
                for _ in range(2):  # the second pass catches the edge band
                    a, col_ = despill_magenta(np.where(msk[..., None], col_, sub), K, msk, a, col_)
                # Last resort, the classic despill: no pixel may be more
                # magenta than it is green (a no-op on these items' colours).
                m = np.minimum(col_[..., 0], col_[..., 2]) - col_[..., 1]
                m = np.maximum(m, 0)[..., None] * np.array([1.0, 0.0, 1.0])
                col_ = col_ - m
        # Trim to what is actually visible, then pad.
        vis = a > 0.02
        vy, vx = np.nonzero(vis)
        ty0, ty1, tx0, tx1 = vy.min(), vy.max() + 1, vx.min(), vx.max() + 1
        a = a[ty0:ty1, tx0:tx1]
        col_ = col_[ty0:ty1, tx0:tx1]
        p = args.pad
        out = np.zeros((a.shape[0] + 2 * p, a.shape[1] + 2 * p, 4), np.uint8)
        out[p:-p, p:-p, :3] = np.clip(col_, 0, 255).round().astype(np.uint8)
        out[p:-p, p:-p, 3] = np.clip(a * 255, 0, 255).round().astype(np.uint8)
        out[out[..., 3] == 0, :3] = 0
        path = os.path.join(args.out_dir, f"{name}.png")
        Image.fromarray(out, "RGBA").save(path, optimize=True)
        note = "  CROSSES CELL EDGE" if crosses else ""
        print(f"wrote {path} {out.shape[1]}x{out.shape[0]}{note}")


if __name__ == "__main__":
    main()
