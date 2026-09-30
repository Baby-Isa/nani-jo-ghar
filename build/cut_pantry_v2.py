"""Cut the pantry v2 sheets (sources/art/pantry-v2/, docs/archive/art-prompts/chatgpt-art-prompts-pantry-jars.md)
into registered transparent webps, on build/cut_tick_v2.py's method:

- the background is measured from the sheet's edges; cells are found from the grey gutters;
- the object is everything not connected to the flat background, holes filled, largest piece;
- edges use colour-to-alpha against the background. Unlike the tick, clear glass must not be
  solid: only the strongly coloured parts (food, lids, labels, wood, highlights), closed over
  small gaps, are alpha 1; the rest of the object (empty glass, the gaps between crate slats)
  keeps its colour-to-alpha value, so the shelf shows through it instead of baked-in grey;
- every cell of a sheet is scaled by ONE factor onto an identical canvas, centred, base on
  the same line (containers) or centred (icons).

Writes assets/cook/items/shelf-<id>-bare-f.webp (containers), icon-<id>.webp (single items),
sticker-blank.webp. Run from the repo root: python3 build/cut_pantry_v2.py [sheet ...]"""
import re
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'sources/art/pantry-v2/'
OUT = 'assets/cook/items/'
DOC = 'docs/archive/art-prompts/chatgpt-art-prompts-pantry-jars.md'

# sheet -> (P section whose table gives the ids, kind, canvas w, h)
SHEETS = {
    'sheet1-tall-jars': (1, 'shelf', 256, 384),
    'sheet2-spice-jars': (2, 'shelf', 256, 256),
    'sheet3-bottles': (3, 'shelf', 256, 384),
    'sheet4-tubs': (4, 'shelf', 256, 256),
    'sheet5-veg-crates': (5, 'shelf', 256, 256),
    'sheet6-fruit-crates': (6, 'shelf', 256, 256),
    'sheet7-packets': (7, 'shelf', 256, 256),
    'items1': (1, 'icon', 256, 256),
    'items2': (2, 'icon', 256, 256),
    'items3': (3, 'icon', 256, 256),
    'items4': (4, 'icon', 256, 256),
    'items5': (5, 'icon', 256, 256),
    'items6': (6, 'icon', 256, 256),
    'items7': (7, 'icon', 256, 256),
}
SMALL_HOLE = 600  # px at the sheet's size
SOLID = 30  # colour distance from the grey above which a pixel is part of something opaque


def ids_from_doc():
    """P-section number -> the nine game ids, in cell order, from the pack's tables."""
    doc = open(DOC).read()
    out = {}
    for m in re.finditer(r'^## P(\d)\..*?(?=^## )', doc, re.S | re.M):
        rows = re.findall(r'^\| (\d) \| [^|]+\| `([^`]+)`', m.group(0), re.M)
        if rows:
            out[int(m.group(1))] = [i for _, i in sorted(rows, key=lambda r: int(r[0]))]
    return out


def runs(on, min_len):
    """[start, end) runs of True at least min_len long, merging gaps shorter than 6 px."""
    r, start = [], None
    for i, v in enumerate(list(on) + [False]):
        if v and start is None:
            start = i
        elif not v and start is not None:
            r.append([start, i])
            start = None
    merged = []
    for a, b in r:
        if merged and a - merged[-1][1] < 6:
            merged[-1][1] = b
        else:
            merged.append([a, b])
    return [(a, b) for a, b in merged if b - a >= min_len]


def three(prof, min_len):
    """Three runs of a busy profile; if two touch (a carrot's leaves reaching the row above),
    split the longest run at its quietest line."""
    r = runs(prof > 0.01, min_len)
    while len(r) < 3 and r:
        a, b = max(r, key=lambda x: x[1] - x[0])
        q = a + (b - a) // 4
        cut_at = q + int(np.argmin(prof[q:b - (b - a) // 4]))
        r = sorted([x for x in r if x != (a, b)] + [(a, cut_at), (cut_at, b)])
    return r


def cells(d):
    """The nine cell boxes (x0, y0, x1, y1), row by row, from the gutters."""
    busy = d > 14
    rows = three(busy.mean(1), d.shape[0] // 12)
    assert len(rows) == 3, f'expected 3 rows, found {rows}'
    out = []
    for y0, y1 in rows:
        cols = three(busy[y0:y1].mean(0), d.shape[1] // 12)
        assert len(cols) == 3, f'expected 3 columns in rows {y0}-{y1}, found {cols}'
        out += [(x0, y0, x1, y1) for x0, x1 in cols]
    return out


def cut(c, bg):
    """One cell -> RGBA (same size) and the object's bounding box."""
    d = np.abs(c - bg).max(2)
    lab, _ = ndi.label(d < 8)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ndi.binary_fill_holes(~np.isin(lab, list(border)))
    lb, _ = ndi.label(obj)
    obj = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
    # small bites out of the outline (a lid's highlight matching the grey) are closed and opaque
    closed = ndi.binary_fill_holes(ndi.binary_closing(np.pad(obj, 12), iterations=8))[12:-12, 12:-12]
    bites = closed & ~obj
    obj = closed
    # opaque parts: strongly coloured, closed over small gaps (seed texture, lid knurling)
    solid = ndi.binary_closing(d > SOLID, iterations=3) & ndi.binary_erosion(obj, iterations=2)
    solid = ndi.binary_opening(solid, iterations=1)
    # small holes in something opaque (a lid's knurling, gaps between seeds) are part of it;
    # big ones (empty glass above the food) stay see-through
    holes, n = ndi.label(ndi.binary_fill_holes(solid) & ~solid)
    if n:
        size = np.bincount(holes.ravel())
        small = size < SMALL_HOLE
        small[0] = False
        solid |= small[holes]
    solid |= bites
    up = np.where(c > bg, (c - bg) / (255 - bg), (bg - c) / bg)
    alpha = np.clip(up.max(2), 0, 1)
    alpha = np.where(ndi.binary_dilation(obj, iterations=2), alpha, 0)
    alpha = np.clip((alpha - 0.02) / 0.98, 0, 1)
    alpha = np.where(solid, 1.0, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(solid[..., None], c, np.clip((c - bg) / safe + bg, 0, 255))
    ys, xs = np.nonzero(obj)
    return np.dstack([rgb, alpha * 255]).astype(np.uint8), (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


def run(name, ids):
    p, kind, CW, CH = SHEETS[name]
    a = np.asarray(Image.open(SRC + f'pantry-v2-{name}.png').convert('RGB')).astype(float)
    edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    bg = np.median(edge, 0)
    d = np.abs(a - bg).max(2)
    got = [cut(a[y0:y1, x0:x1], bg) for x0, y0, x1, y1 in cells(d)]
    # one scale for the whole sheet: the biggest object fills the canvas (less a margin)
    mw = max(b[2] - b[0] for _, b in got)
    mh = max(b[3] - b[1] for _, b in got)
    s = min(0.92 * CW / mw, 0.92 * CH / mh)
    for (img, b), gid in zip(got, ids):
        im = Image.fromarray(img, 'RGBA').crop(b)
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
        x = (CW - im.width) // 2
        y = CH - round(0.04 * CH) - im.height if kind == 'shelf' else (CH - im.height) // 2
        canvas.alpha_composite(im, (x, y))
        out = OUT + (f'shelf-{gid}-bare-f.webp' if kind == 'shelf' else f'icon-{gid}.webp')
        canvas.save(out, quality=92, method=6)
    print(name, 'ok', f'scale {s:.3f}')


def sticker():
    a = np.asarray(Image.open(SRC + 'pantry-v2-sticker.png').convert('RGB')).astype(float)
    edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3)])
    bg = np.median(edge, 0)
    img, b = cut(a, bg)
    im = Image.fromarray(img, 'RGBA').crop(b).resize((256, 256), Image.LANCZOS)
    im.save(OUT + 'sticker-blank.webp', quality=92, method=6)
    print('sticker ok')


if __name__ == '__main__':
    ids = ids_from_doc()
    todo = sys.argv[1:] or list(SHEETS) + ['sticker']
    for n in todo:
        if n == 'sticker':
            sticker()
        else:
            run(n, ids[SHEETS[n][0]])
