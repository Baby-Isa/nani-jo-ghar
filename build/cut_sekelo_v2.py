#!/usr/bin/env python3
"""Cut the Sekelo v2 art (design system §15) into assets/cook/items/sekelo/, by build/cut_tick_v2.py's
method (as adapted in build/cut_chai_v2.py: the background is everything joined to the border through
smooth pixels; the object is the rest, holes filled, with a 1 px anti-aliased edge):
  grill-t.webp     the charcoal grill, top-down (sources/art/chatgpt-batch3/sheet-tray-grill-t-v2.png, middle)
  rack-t.webp      the wooden skewer rack, top-down (vessel-skewer-rack-t-v1.png); its middle is open
                   (the grey inside the frame is background, so holes are NOT filled: colour-to-alpha)
  bowl-<id>-f.webp the four front-on prep bowls (sources/art/sekelo/bowls-draft1.png, build/gen_sekelo_v2.py),
                   every bowl on one shared canvas size, its foot on the canvas's bottom edge (true heights)

  python3 build/cut_sekelo_v2.py
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cut_chai_v2 as C  # noqa: E402

ROOT = C.ROOT
B3 = os.path.join(ROOT, 'sources', 'art', 'chatgpt-batch3')
SRC = os.path.join(ROOT, 'sources', 'art', 'sekelo')
OUT = os.path.join(ROOT, 'assets', 'cook', 'items', 'sekelo')
BOWL_IDS = ['ph-meat', 'veg-02', 'veg-03', 'veg-01']


def rgb(path):
    return np.asarray(Image.open(path).convert('RGB')).astype(float)


def save(im, name):
    im.save(os.path.join(OUT, name), quality=92, method=6)
    print(name, im.size)


def cut_grill():
    a = rgb(os.path.join(B3, 'sheet-tray-grill-t-v2.png'))
    w = a.shape[1]
    x0 = int(w * 0.33)
    x1 = int(w * 0.76)
    cell = a[:, x0:x1]
    obj = C.largest(C.object_mask(cell))
    # the handles' openings were filled with the object: give back the grey that shows through them
    bg = C.bg_field(cell)
    grey = np.sqrt(((cell - bg) ** 2).sum(2)) < 14
    lb, n = ndi.label(grey & obj)
    for k in range(1, n + 1):
        if (lb == k).sum() > 400:
            obj[lb == k] = False
    bx0, by0, bx1, by1 = C.bbox(obj)
    im, _ = C.crop_to(C.rgba(cell, C.soft(obj)), (bx0, by0, bx1, by1), 6, 900)
    save(im, 'grill-t.webp')


def cut_rack():
    a = rgb(os.path.join(B3, 'vessel-skewer-rack-t-v1.png'))
    bg = C.bg_field(a)
    d = np.sqrt(((a - bg) ** 2).sum(2))
    obj = d > 28
    obj = ndi.binary_opening(obj, iterations=2)
    obj = C.largest(obj)
    bx0, by0, bx1, by1 = C.bbox(obj)
    im, _ = C.crop_to(C.rgba(a, C.soft(obj)), (bx0, by0, bx1, by1), 6, 1000)
    # the rails further apart (the skewers bridge them, tip above, handle below): the open middle
    # between the rails is stretched, the rails themselves keep their thickness
    al = np.asarray(im)[..., 3]
    mid = al[:, im.width // 2] < 40
    ys = np.nonzero(mid)[0]
    ys = ys[(ys > 10) & (ys < im.height - 10)]
    t0, t1 = int(ys.min()), int(ys.max()) + 1
    gap = 170
    out = Image.new('RGBA', (im.width, t0 + gap + (im.height - t1)), (0, 0, 0, 0))
    out.alpha_composite(im.crop((0, 0, im.width, t0)), (0, 0))
    out.alpha_composite(im.crop((0, t0, im.width, t1)).resize((im.width, gap), Image.BICUBIC), (0, t0))
    out.alpha_composite(im.crop((0, t1, im.width, im.height)), (0, t0 + gap))
    save(out, 'rack-t.webp')


def cut_bowls():
    p = os.path.join(SRC, 'bowls-draft1.png')
    if not os.path.exists(p):
        print('no bowls draft yet')
        return
    a = rgb(p)
    # the draft's grey is uneven and each bowl casts a neutral grey shadow: the object is what is warm
    # (the cream glaze and the food) or brighter than any grey, holes filled
    warm = (a[..., 0] - a[..., 2] > 26) | (a.mean(2) > 212)
    obj = ndi.binary_fill_holes(ndi.binary_opening(ndi.binary_closing(warm, iterations=3), iterations=2))
    lb, n = ndi.label(obj)
    sizes = np.bincount(lb.ravel())[1:]
    keep = np.argsort(sizes)[::-1][:4] + 1
    boxes = sorted([(C.bbox(lb == k), k) for k in keep], key=lambda t: t[0][0])
    W = max(b[2] - b[0] for b, _ in boxes) + 16
    H = max(b[3] - b[1] for b, _ in boxes) + 8
    for (box, k), wid in zip(boxes, BOWL_IDS):
        m = ndi.binary_fill_holes(lb == k)
        x0, y0, x1, y1 = box
        cx = (x0 + x1) // 2
        cut = C.rgba(a, C.soft(m))
        # one canvas for every bowl: centred, its foot on the bottom edge
        canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        canvas.alpha_composite(cut.crop((cx - W // 2, y1 - H, cx - W // 2 + W, y1)), (0, 0))
        s = 360 / W
        save(canvas.resize((360, round(H * s)), Image.LANCZOS), f'bowl-{wid}-f.webp')


def cut_stick():
    """The painted bamboo skewer (assets/cook/items/skewer-empty-t.webp, drawn corner to corner) turned
    upright: the skewer stays vertical on the board, the rack and the grill (§15)."""
    im = Image.open(os.path.join(ROOT, 'assets', 'cook', 'items', 'skewer-empty-t.webp')).convert('RGBA')
    up = im.rotate(51.55, expand=True, resample=Image.BICUBIC)
    save(up.crop(up.getbbox()), 'stick-v.webp')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    cut_stick()
    cut_grill()
    cut_rack()
    cut_bowls()
