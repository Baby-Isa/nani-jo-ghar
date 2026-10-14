#!/usr/bin/env python3
"""Cut the samosa v2 art (docs/design-language/ui-design-system.md §15) into assets/cook/items/samosa-v2/, with
build/cut_tick_v2.py's method (the object = everything not connected to the flat background, holes filled;
edges by colour-to-alpha against the measured background):
  stage-0..3.webp   the fold stages on ONE registered canvas (they overlay exactly): 0 the flat strip (made from
                    the v2 sheet's own plain pastry), 1 and 2 the v2 sheet's folds, 3 the raw folded samosa
  fry-0..3.webp     raw, light, golden, too dark: one canvas each, registered to the triangle's bounding box
  prep-<id>.webp    the front-on prep bowls the chaat v2 station doesn't have (mince, peas): its generated bowl
                    with the painted top-down contents heaped in (build/cut_chaat_v2.py's prep_bowls)
  karahi.webp, plate-paper.webp   from build/gen_samosa_v2.py's draft (when it's there)
  meta.json         the canvas, the filling's patch and each fold's flap (polygon + fold line), fractions
  python3 build/cut_samosa_v2.py
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ITEMS = os.path.join(ROOT, 'assets', 'cook', 'items')
OUT = os.path.join(ITEMS, 'samosa-v2')
SRC = os.path.join(ROOT, 'sources', 'art', 'samosa-v2')
SHEET = os.path.join(ROOT, 'sources', 'art', 'chatgpt-batch3', 'sheet-samosa-folds-t-v2.png')
os.makedirs(OUT, exist_ok=True)


def save(img, name):
    img.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=90, method=6)


def c2a(c, bg):
    up = np.where(c > bg, (c - bg) / np.maximum(255 - bg, 1), (bg - c) / np.maximum(bg, 1))
    alpha = np.clip(up.max(2), 0, 1)
    safe = np.maximum(alpha, 1e-3)[..., None]
    return alpha, np.clip((c - bg) / safe + bg, 0, 255)


def cut_flat(a, bg, thr=40):
    """RGBA of everything not connected to a flat background colour."""
    d = np.abs(a - bg).max(2)
    lab, _ = ndi.label(d < thr)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ndi.binary_fill_holes(~np.isin(lab, list(border)))
    alpha, rgb = c2a(a, np.broadcast_to(bg, a.shape))
    core = ndi.binary_erosion(obj, iterations=2)
    # a magenta sheet leaves a coloured fringe: the edge ring goes soft and takes the core's colour
    alpha = np.where(core, 1, np.where(obj, 0.55, 0))
    alpha = ndi.gaussian_filter(alpha, 0.8) * obj
    near = ndi.distance_transform_edt(~core, return_indices=True)[1]
    rgb = a[near[0], near[1]]
    return np.dstack([rgb, alpha * 255]).astype(np.uint8), obj


# ---------- the fold stages, one canvas (sheet px; the canvas's origin at sheet (CX, CY)) ----------
CX, CY, CW, CH = 20, 270, 540, 430
def fold_stages():
    a = np.asarray(Image.open(SHEET).convert('RGB')).astype(float)
    bg = np.median(np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3)]), 0)
    rgba, obj = cut_flat(a, bg, 60)
    sheet = Image.fromarray(rgba, 'RGBA')
    def canvas():
        return Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    # 1: the first fold, where it is on the sheet
    s1 = canvas()
    s1.alpha_composite(sheet.crop((0, 0, 540, 1024)), (-CX, -CY))
    # 0: the flat strip (x 48..520, y 386..636), from the sheet's own plain pastry (x 300..518), mirrored
    plain = sheet.crop((300, 386, 518, 637))
    strip = plain.resize((472, 251), Image.LANCZOS)
    # soften the join and round the left corners like the right ones
    m = Image.new('L', strip.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, 471, 250), 10, fill=255)
    strip.putalpha(Image.fromarray(np.minimum(np.asarray(m), np.asarray(strip)[..., 3])))
    s0 = canvas()
    s0.alpha_composite(strip, (48 - CX, 386 - CY))
    # 2: the second fold: its tail's right end on the strip's right end, its middle on the strip's middle
    s2 = canvas()
    s2.alpha_composite(sheet.crop((540, 280, 1030, 700)), (540 - 486 - CX, 280 - 8 - CY))
    # 3: the raw folded samosa (the painted one), as wide as the second fold's triangle, where it sat
    raw = Image.open(os.path.join(ITEMS, 'samosa-folded-t.png')).convert('RGBA')
    raw = raw.crop(raw.getbbox())
    w3 = 380
    raw = raw.resize((w3, int(raw.height * w3 / raw.width)), Image.LANCZOS)
    s3 = canvas()
    tri_cx = (547 + 925) / 2 - 486 - CX
    s3.alpha_composite(raw, (int(tri_cx - w3 / 2), int(655 - 8 - CY - raw.height)))
    for i, im in enumerate([s0, s1, s2, s3]):
        save(im, f'stage-{i}')
    fx = lambda x: round((x - CX) / CW, 4)
    fy = lambda y: round((y - CY) / CH, 4)
    P = lambda pts: [[fx(x), fy(y)] for x, y in pts]
    return {
        'w': CW, 'h': CH,
        # where the filling goes: the strip's left square
        'fill': {'x': fx(173), 'y': fy(511), 'rx': round(100 / CW, 4), 'ry': round(95 / CH, 4)},
        'folds': [
            # the flap (on the stage before) and the line it folds over (from, to)
            {'flap': P([(48, 386), (300, 386), (300, 637)]), 'line': P([(48, 386), (300, 637)])},
            {'flap': P([(40, 315), (300, 315), (300, 670), (40, 670)]), 'line': P([(300, 320), (300, 660)])},
            {'flap': P([(430, 400), (524, 400), (524, 640), (430, 640)]), 'line': P([(430, 400), (430, 640)])},
        ],
    }


# ---------- the fry states, one canvas each, the triangle's box registered ----------
def fry_states():
    a = np.asarray(Image.open(SHEET).convert('RGB')).astype(float)
    bg = np.median(np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3)]), 0)
    rgba, _ = cut_flat(a, bg, 60)
    light = Image.fromarray(rgba, 'RGBA').crop((1040, 280, 1520, 700))
    srcs = [Image.open(os.path.join(ITEMS, 'samosa-folded-t.png')).convert('RGBA'), light,
            Image.open(os.path.join(ITEMS, 'samosa-fried-golden-t.png')).convert('RGBA'),
            Image.open(os.path.join(ITEMS, 'samosa-burnt-t.png')).convert('RGBA')]
    W, H = 400, 340
    for i, im in enumerate(srcs):
        im = im.crop(im.getbbox())
        k = min((W - 20) / im.width, (H - 20) / im.height)
        im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
        c = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        c.alpha_composite(im, ((W - im.width) // 2, H - 10 - im.height))
        save(c, f'fry-{i}')
    return {'w': W, 'h': H}


def prep_bowls():
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import cut_chaat_v2 as C
    C.TOPPINGS = {'ph-keema': 'topping-keema-bowl-t.png', 'veg-10': 'topping-vatana-bowl-t.png'}
    C.save = lambda img, name: save(img, name)
    return C.prep_bowls()


def tops():
    """A spoonful's top (what lands on the pastry) for the fillings chaat v2 has no top for: the painted
    top-down bowl's contents, a soft round cut from its middle."""
    for wid, src in {'ph-keema': 'topping-keema-bowl-t.png', 'veg-10': 'topping-vatana-bowl-t.png'}.items():
        im = Image.open(os.path.join(ITEMS, src)).convert('RGBA')
        iw, ih = im.size
        r = 0.3 * iw
        crop = im.crop((int(iw / 2 - r), int(ih / 2 - r), int(iw / 2 + r), int(ih / 2 + r)))
        m = Image.new('L', crop.size, 0)
        ImageDraw.Draw(m).ellipse((6, 6, crop.width - 6, crop.height - 6), fill=255)
        m = m.filter(ImageFilter.GaussianBlur(4))
        crop.putalpha(Image.fromarray(np.minimum(np.asarray(m), np.asarray(crop)[..., 3])))
        crop.thumbnail((300, 300), Image.LANCZOS)
        save(crop, 'top-' + wid)


def fry_sheet():
    """The karahi (left half of the draft) and the paper-lined plate (right half): the draft's grey has a soft
    vignette and cast shadows, so each half is cut by its strong edges (build/cut_chaat_v2.py's silhouette) and
    its edge un-mixed against a fitted background."""
    p = os.path.join(SRC, 'fry-sheet-draft1.png')
    if not os.path.exists(p):
        return None
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import cut_chaat_v2 as C
    a = np.asarray(Image.open(p).convert('RGB')).astype(float)
    out = {}
    for name, (x0, x1) in [('karahi', (0, 812)), ('plate-paper', (812, 1536))]:
        c = a[:, x0:x1]
        obj = C.silhouette(c, 40, 5)
        bg = C.fit_bg(c, ~ndi.binary_dilation(obj, iterations=16), deg=3)
        # the handles' loops: background showing through, closed off by the fill (small, bg-coloured pieces)
        holes, n = ndi.label(obj & (np.abs(c - bg).max(2) < 10))
        for l in range(1, n + 1):
            if 300 < (holes == l).sum() < 20000:
                obj &= ~ndi.binary_dilation(holes == l, iterations=1)
        alpha, rgb = c2a(c, bg)
        core = ndi.binary_erosion(obj, iterations=2)
        alpha = np.where(core, 1, np.where(ndi.binary_dilation(obj, iterations=1), alpha, 0))
        rgb = np.where(core[..., None], c, rgb)
        im = np.dstack([rgb, alpha * 255]).astype(np.uint8)
        ys, xs = np.nonzero(obj)
        crop = Image.fromarray(im[ys.min():ys.max() + 1, xs.min():xs.max() + 1], 'RGBA')
        save(crop, name)
        out[name] = {'w': crop.width, 'h': crop.height}
    return out


if __name__ == '__main__':
    meta = {'stages': fold_stages(), 'fry': fry_states(), 'prep': prep_bowls()}
    tops()
    fs = fry_sheet()
    if fs:
        meta.update(fs)
    json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
    print(json.dumps(meta)[:600])
