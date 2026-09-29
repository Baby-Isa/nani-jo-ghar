#!/usr/bin/env python3
"""Cut the maani v2 art (build/gen_maani_v2.py) the way build/cut_tick_v2.py does (docs/VISUAL-QA.md §2):
the object is everything not connected to the flat grey background, with pinholes filled; its cast
shadow and the ring's hole (the background colour itself) stay see-through; a 1 px
anti-aliased edge. Out: assets/cook/items/maani-v2/chimta.webp (tips up and to the right, cropped
to the object).

  python3 build/cut_maani_v2.py
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cut_chai_v2 as C  # noqa: E402

ROOT = C.ROOT
SRC = os.path.join(ROOT, 'sources', 'art', 'maani-v2')
OUT = os.path.join(ROOT, 'assets', 'cook', 'items', 'maani-v2')


def cut_chimta():
    a = np.asarray(Image.open(os.path.join(SRC, 'chimta-draft1.png')).convert('RGB')).astype(float)
    bg = C.bg_field(a)
    # the steel is brighter than the grey; its cast shadow is darker and colourless, so it drops out,
    # and so does the ring's hole (the background colour itself)
    lift = (a - bg).mean(-1)
    obj = C.object_mask(a, t=1.6, open_it=2) & (lift > 6)
    obj = ndi.binary_closing(obj, iterations=3) & (lift > -4)
    lab, n = ndi.label(obj)
    sizes = np.bincount(lab.ravel())
    obj = np.isin(lab, [i for i in range(1, n + 1) if sizes[i] > 1500])
    # fill only small pinholes (the ring's hole stays open)
    holes = ndi.binary_fill_holes(obj) & ~obj
    lab, n = ndi.label(holes)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() < 120:
            obj[m] = True
    img = C.rgba(a, C.soft(obj))
    x0, y0, x1, y1 = C.bbox(obj)
    img = img.crop((x0 - 4, y0 - 4, x1 + 4, y1 + 4))
    img.thumbnail((512, 512), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    img.save(os.path.join(OUT, 'chimta.webp'), quality=92, method=6)
    print('chimta', img.size)


if __name__ == '__main__':
    cut_chimta()
