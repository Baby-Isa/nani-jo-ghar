#!/usr/bin/env python3
"""Checks that a background's lighting states (day, evening, night) are
the same picture relit: the game swaps them in place, so nothing may move
(Art Bible, section 2: "a straight relight, not a redraw").

Works on edges, not colours, so the change of light doesn't count as a
difference: each image is turned into a gradient-magnitude map of its
locally normalised luminance. Then, against the day image:
  shift     the global offset found by phase correlation (px, x and y)
  tiles     the same, per tile of a 4x3 grid; the worst tile shows local
            drift (something moved, grew or was redrawn)
  edges     the share of the day's strong edges with a strong edge in the
            relight within 2 px (100% = every edge still there)
  diffmap   an image of edges only in one or the other (red = day only,
            cyan = relight only), written with --maps

Usage: python3 build/bg_align_check.py day.png relight.png [relight.png ...] [--maps out_dir]
"""
import argparse
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def edge_map(path):
    g = np.asarray(Image.open(path).convert("L")).astype(float)
    m = ndi.gaussian_filter(g, 15)
    s = np.sqrt(ndi.gaussian_filter((g - m) ** 2, 15)) + 4
    n = ndi.gaussian_filter((g - m) / s, 1.2)
    e = np.hypot(ndi.sobel(n, 0), ndi.sobel(n, 1))
    return e / (np.percentile(e, 99) + 1e-6)


def phase_shift(a, b):
    """(dx, dy) that moves b onto a, and the peak's strength."""
    wy = np.hanning(a.shape[0])[:, None] * np.hanning(a.shape[1])[None, :]
    A, B = np.fft.fft2(a * wy), np.fft.fft2(b * wy)
    R = A * np.conj(B)
    r = np.fft.ifft2(R / (np.abs(R) + 1e-9)).real
    y, x = np.unravel_index(np.argmax(r), r.shape)
    if y > a.shape[0] // 2:
        y -= a.shape[0]
    if x > a.shape[1] // 2:
        x -= a.shape[1]
    return int(x), int(y), float(r.max())


def strong(e):
    return e > np.percentile(e, 90)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("day")
    ap.add_argument("relights", nargs="+")
    ap.add_argument("--maps")
    args = ap.parse_args()
    ed = edge_map(args.day)
    sd = strong(ed)
    for rp in args.relights:
        er = edge_map(rp)
        if er.shape != ed.shape:
            print(f"{os.path.basename(rp)}: SIZE DIFFERS {er.shape} vs {ed.shape}")
            continue
        dx, dy, peak = phase_shift(ed, er)
        H, W = ed.shape
        worst, tiles = 0.0, []
        for ty in range(3):
            for tx in range(4):
                sl = (slice(ty * H // 3, (ty + 1) * H // 3), slice(tx * W // 4, (tx + 1) * W // 4))
                tdx, tdy, tp = phase_shift(ed[sl], er[sl])
                tiles.append((tdx, tdy))
                if tp > 0.02:  # a tile with no structure (plain marble) has no say
                    worst = max(worst, float(np.hypot(tdx, tdy)))
        sr = strong(er)
        near = ndi.binary_dilation(sr, iterations=2)
        agree = (sd & near).sum() / max(sd.sum(), 1)
        near_d = ndi.binary_dilation(sd, iterations=2)
        agree_r = (sr & near_d).sum() / max(sr.sum(), 1)
        print(f"{os.path.basename(rp)}: shift=({dx},{dy})px worst_tile_drift={worst:.0f}px "
              f"edges_kept={agree:.0%} edges_new_matched={agree_r:.0%} tiles={tiles}")
        if args.maps:
            os.makedirs(args.maps, exist_ok=True)
            im = np.zeros(ed.shape + (3,), np.uint8)
            im[sd & ~near] = (255, 60, 60)
            im[sr & ~near_d] = (60, 220, 255)
            im[sd & near] = (90, 90, 90)
            out = os.path.join(args.maps, os.path.splitext(os.path.basename(rp))[0] + "-edgediff.png")
            Image.fromarray(im).save(out, optimize=True)


if __name__ == "__main__":
    main()
