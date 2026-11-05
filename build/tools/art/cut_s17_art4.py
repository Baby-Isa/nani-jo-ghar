"""Cut pack s17-art4's glasses (Zafar, 5 Nov): the empty glass (s17-wm2 WE) and the same glass to the rim with chai (WR) and with
plain tea (WB), all three in ONE box so they lie over each other to the pixel, and the tea's inside measured from WR.

Each is cut from its wall by the wall's own colour, row by row (the wall's colour read beside the glass), the glass's outline filled,
nothing left of the counter below the base (the base's corners mirrored from its left, as ART-39). The word moment draws them over the
same wall, so what shows through the clear glass is that wall again.

  python3 build/tools/art/cut_s17_art4.py   # writes assets/shared/word-moment/glass-{e2,wr,wb}-s17.webp and cut-data.json's tea
"""
import json
import os

import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SRC = {
    "e2": "sources/art/s17-wm2/we-chai-glass-empty-large-v1.webp",
    "wr": "sources/art/s17-art4/wr-chai-glass-rim-v1.webp",
    "wb": "sources/art/s17-art4/wb-tea-glass-rim-v1.webp",
}
OUT = "assets/shared/word-moment"
W0, H0 = 1024, 1536


def load(p):
    im = Image.open(os.path.join(ROOT, p)).convert("RGB")
    if im.size != (W0, H0):
        c = Image.new("RGB", (W0, H0))
        c.paste(im, (0, 0))
        c.paste(im.crop((0, im.height - 1, W0, im.height)), (0, im.height))  # (a row short: its last row again)
        im = c
    return np.asarray(im).astype(float)


def dist(a):
    """Per pixel, how far from the wall at its row (the wall read at both edges, a straight blend across)."""
    L = a[:, 8:48].mean(1, keepdims=True)
    R = a[:, -48:-8].mean(1, keepdims=True)
    t = np.linspace(0, 1, a.shape[1])[None, :, None]
    wall = L + (R - L) * t
    return np.sqrt(((a - wall) ** 2).sum(2))


def outline(d, y0, y1):
    """The glass's left and right edge per row (the outermost clearly not-wall pixels)."""
    edges = {}
    for y in range(y0, y1):
        xs = np.where(d[y] > 24)[0]
        xs = xs[(xs > 60) & (xs < W0 - 60)]
        if len(xs) > 40:
            edges[y] = (int(xs.min()), int(xs.max()))
    return edges


def main():
    imgs = {k: load(p) for k, p in SRC.items()}
    ds = {k: dist(a) for k, a in imgs.items()}
    # the counter's top: the first row from the bottom third where the wall's colour changes all the way across
    e = imgs["e2"]
    rows = e[:, 8:48].mean(1)
    top_counter = next(y for y in range(int(H0 * 0.7), H0) if np.sqrt(((rows[y] - rows[y - 6]) ** 2).sum()) > 18)
    base = top_counter - 2
    # one outline for all three: the union of their edges (they differ by a pixel or two)
    eds = [outline(ds[k], 150, base) for k in imgs]
    ys = sorted(set().union(*[set(x) for x in eds]))
    y_top = ys[0]
    edges = {}
    for y in ys:
        got = [x[y] for x in eds if y in x]
        edges[y] = (min(g[0] for g in got), max(g[1] for g in got))
    # (the base: below the last full-width rows, each row no wider than the row above, mirrored about the glass's middle)
    mid = np.median([(l + r) / 2 for l, r in edges.values()])
    prev = None
    for y in ys:
        l, r = edges[y]
        half = max(mid - l, r - mid)
        if prev is not None and y > base - 60:
            half = min(half, prev)
        edges[y] = (int(round(mid - half)), int(round(mid + half)))
        prev = half
    x0 = min(l for l, r in edges.values()) - 2
    x1 = max(r for l, r in edges.values()) + 3
    box = (x0, y_top - 2, x1, base + 1)
    for k, a in imgs.items():
        d = ds[k]
        mask = np.zeros(d.shape)
        for y, (l, r) in edges.items():
            mask[y, l : r + 1] = 1
            # (a soft pixel at each edge)
            if l > 0:
                mask[y, l - 1] = 0.5
            if r + 1 < W0:
                mask[y, r + 1] = 0.5
        # (inside its outline the glass is kept whole, the wall seen through it baked in, as pack s17-wm2's cut: the word moment's scene
        # has the same wall there, and the art check's soft-rim rule holds; only the outline's own pixel is soft)
        a8 = (mask * 255).astype(np.uint8)
        rgba = np.dstack([a.astype(np.uint8), a8])
        im = Image.fromarray(rgba, "RGBA").crop(box)
        im.save(os.path.join(ROOT, OUT, f"glass-{k}-s17.webp"), "WEBP", quality=92, method=6)
    bw, bh = box[2] - box[0], box[3] - box[1]
    # the tea's inside, from WR against the empty glass: where they differ in the glass's middle is the tea; its top is just under
    # the rim's lip, its bottom the inner floor, where the difference drops (the thick base below it only shows the tea through it)
    e2, wr = imgs["e2"], imgs["wr"]
    cx = int(mid)
    diff = np.sqrt(((e2 - wr) ** 2).sum(2))[:, cx - 15 : cx + 15].mean(1)
    span = range(box[1], box[3])
    t_top = next(y for y in span if y > box[1] + bh * 0.03 and diff[y] > 90)
    t_bot = next(y for y in reversed(span) if y < box[1] + bh * 0.9 and diff[y] > 95)
    rows = []
    for i in range(12):
        y = int(round(t_top + (t_bot - t_top) * i / 11))
        yy = min(edges, key=lambda q: abs(q - y))
        l, r = edges[yy]
        inset = 0.045 * (r - l)
        rows.append([round((y - box[1]) / bh, 4), round((l + inset - box[0]) / bw, 4), round((r - inset - box[0]) / bw, 4)])
    tea = {"top": rows[0][0], "bottom": rows[-1][0], "rows": rows}
    cp = os.path.join(ROOT, OUT, "cut-data.json")
    cut = json.load(open(cp))
    for k in imgs:
        e = {"file": f"shared/word-moment/glass-{k}-s17.webp", "w": bw, "h": bh, "_about": f"pack s17-art4 (Zafar, 5 Nov): one box for e2, wr and wb, cut by build/tools/art/cut_s17_art4.py from {SRC[k]}"}
        if k == "wr":
            e["tea"] = tea
        cut["props"][f"glass-{k}-s17"] = e
    json.dump(cut, open(cp, "w"), indent=1)
    print("box", box, "size", (bw, bh), "counter top", top_counter, "tea", json.dumps(tea))


if __name__ == "__main__":
    main()
