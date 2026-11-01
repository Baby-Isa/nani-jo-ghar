#!/usr/bin/env python3
"""The photo shoot prototype's two new placeholder pictures (assets/farm/proto/; Zafar's prototype notes, 1 Nov). Everything else the
prototype draws is already cut: the farm layers and animals of the ride (assets/day/ride/s09r/, assets/day/s09b/).

  hannah-face.webp  Hannah Mami's placeholder face: the woman with the camera, cropped from Zafar's own mock-up
                    (sources/art/mockups-2026-11-01/mockup-farm-animals-photo.png). A placeholder until her art run.
  chick.webp        one chick on its own: the front-left chick of the hen-with-chicks sheet (sources/art/s09b/a2-farm-animals-v1.png),
                    keyed on magenta with the ride's key (cut_s09r.key), the hen's orange reaching in from the box's edge dropped.

Usage: python3 build/tools/art/proto_photo_art.py"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
OUT = os.path.join(ROOT, "assets/farm/proto")


def hannah():
    im = Image.open(os.path.join(ROOT, "sources/art/mockups-2026-11-01/mockup-farm-animals-photo.png")).convert("RGB")
    face = im.crop((1368, 196, 1648, 476)).resize((240, 240), Image.LANCZOS)
    face.save(os.path.join(OUT, "hannah-face.webp"), "WEBP", quality=86, method=6)


def chick():
    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    from cut_s09r import key                                      # the ride's own magenta key (soft edges, no pink rim)
    rgba = key(os.path.join(ROOT, "sources/art/s09b/a2-farm-animals-v1.png"))
    x0, y0, x1, y1 = 1258, 636, 1377, 772                            # the front-left chick: the hen behind it and its leg at the right
    box = rgba[y0:y1, x0:x1].copy()
    r, g = box[..., 0].astype(np.int32), box[..., 1].astype(np.int32)
    solid = box[..., 3] > 20
    hen = solid & (g < 0.66 * r)                                    # the hen's orange feathers behind it (the chick is yellow)
    yy, xx = np.mgrid[0:box.shape[0], 0:box.shape[1]]
    b = box[..., 2].astype(np.int32)
    beak = (xx >= 12) & (xx <= 46) & (yy >= 22) & (yy <= 50) & (r > 225) & (g > 120)              # bright orange, not the hen's brown
    own = beak | ((yy >= 110) & (xx < 92))                          # the chick's own beak and feet
    lab, n = ndimage.label(hen & ~own)
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if ys.min() == 0 or xs.max() == box.shape[1] - 1:             # the hen reaches in from the top or the right edge
            box[lab == i, 3] = 0
    box[hen & (xx >= 92) & (yy >= 70), 3] = 0                       # and her leg and foot beside the chick
    box[(xx >= 97) & (yy >= 104), 3] = 0
    box[hen & ~beak & (xx <= 46) & (yy <= 56), 3] = 0               # her breast behind its beak
    lab, n = ndimage.label(box[..., 3] > 20)
    if n > 1:                                                       # the chick: its biggest piece and whatever is not a speck
        sizes = ndimage.sum(box[..., 3] > 20, lab, range(1, n + 1))
        keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 40])
        box[~keep, 3] = 0
    ys, xs = np.where(box[..., 3] > 20)
    box = box[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(box, "RGBA").save(os.path.join(OUT, "chick.webp"), "WEBP", quality=88, method=6)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    hannah()
    chick()
    print("ok:", ", ".join(sorted(os.listdir(OUT))))
