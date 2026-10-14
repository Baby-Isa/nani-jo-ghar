#!/usr/bin/env python3
"""Cut the chai v2 mock-up drafts (sources/art/chai-v2-mockup/*-draft1.png) to transparent webps in
assets/cook/items/chai-v2/, by build/cut_tick_v2.py's method: the background is measured (here a
fitted field, since the drafts' grey has a gradient) and the object is what differs from it. Both pieces
are rounded rectangles, and their baked shadows are dropped (the page gives every object the same soft
shadow, §7), so each is cut as an anti-aliased rounded rectangle fitted to its edges.

  python3 build/cut_chai_v2_mockup.py
"""
import os

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'sources', 'art', 'chai-v2-mockup')
OUT = os.path.join(ROOT, 'assets', 'cook', 'items', 'chai-v2')
# how each piece's right and bottom edges are found: the hob's bright steel rim is a sharp step before
# the shadow; the tray's wood is saturated where the shadow is neutral grey
PIECES = {'hob-2': ('hob-2-burner-t', 'rim'), 'tray-4': ('tray-4-cutout-t', 'saturated')}


def cut(path, mode):
    a = np.asarray(Image.open(path).convert('RGB')).astype(float)
    # the drafts' grey isn't flat (lighter at the top, a faint vignette): fit a smooth quadratic
    # background to a 60 px border ring, per channel, and measure everything against that field
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w] / np.array([h, w])[:, None, None]
    ring = np.zeros((h, w), bool)
    ring[:60], ring[-60:], ring[:, :60], ring[:, -60:] = True, True, True, True
    basis = np.stack([np.ones_like(xx), xx, yy, xx * xx, yy * yy, xx * yy], -1)
    bg = np.empty_like(a)
    for ch in range(3):
        coef, *_ = np.linalg.lstsq(basis[ring], a[..., ch][ring], rcond=None)
        bg[..., ch] = basis @ coef
    d = np.abs(a - bg).max(2)
    # Both pieces are rounded rectangles lit from the upper left, and their baked shadow (right and
    # bottom) is as dark as the charcoal hob itself, so no threshold separates them. The top and left
    # edges are clean in a plain mask; the right and bottom edges are the last sharp step (the rim)
    # before the smooth shadow ramp. The piece is then an anti-aliased rounded rectangle.
    obj = ndi.binary_fill_holes(ndi.binary_opening(d > 50, iterations=2))
    lb, _ = ndi.label(obj)
    obj = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
    ys, xs = np.nonzero(obj)
    top, left = ys.min(), xs.min()
    cy, cx = (top + ys.max()) // 2, (left + xs.max()) // 2

    def last_step(line, start):  # scanning outwards from the middle: the last jump sharper than the shadow's ramp
        jumps = [i for i in range(start, len(line) - 4) if np.abs(line[i + 4] - line[i]).max() > 55]
        return jumps[-1] + 2
    if mode == 'rim':
        right = int(np.median([last_step(a[y], cx) for y in range(cy - 40, cy + 40, 8)]))
        bottom = int(np.median([last_step(a[:, x], cy) for x in range(cx - 40, cx + 40, 8)]))
    else:
        sat = ndi.binary_fill_holes(ndi.binary_opening(a.max(2) - a.min(2) > 35, iterations=2))
        sy, sx = np.nonzero(sat)
        right, bottom = sx.max(), sy.max()
    rad = int(np.nonzero(obj[top])[0].min() - left)  # where the top edge's arc begins
    S = 4
    m = Image.new('L', (w * S, h * S), 0)
    ImageDraw.Draw(m).rounded_rectangle([left * S, top * S, (right + 1) * S, (bottom + 1) * S], radius=max(rad, 8) * S, fill=255)
    alpha = np.asarray(m.resize((w, h), Image.LANCZOS)).astype(float) / 255
    img = Image.fromarray(np.dstack([a, alpha * 255]).astype(np.uint8), 'RGBA')
    obj = alpha > 0
    ys, xs = np.nonzero(obj)
    pad = 4
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0), min(xs.max() + pad, a.shape[1]), min(ys.max() + pad, a.shape[0]))
    return img.crop(box), box


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for src, (name, mode) in PIECES.items():
        img, box = cut(os.path.join(SRC, src + '-draft1.png'), mode)
        img.save(os.path.join(OUT, name + '.webp'), quality=92, method=6)
        print(name, img.size, 'crop', box)
