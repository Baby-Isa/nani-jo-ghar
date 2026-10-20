#!/usr/bin/env python3
"""Cut the s09r road style test (sources/art/s09r/, keyed on flat magenta) into the ride's pieces under assets/day/ride/s09r/:
the looping layers (trimmed to their band, full width; the seam measured: the top edge's height at the left and right edges) and
the sprites (one per thing, by connected piece, left to right, bottoms kept). Magenta is keyed to alpha, each edge pixel taking the colour of
the thing beside it (see key()). Usage: python3 build/tools/art/cut_s09r.py [--report]"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
SRC = os.path.join(ROOT, "sources/art/s09r")
OUT = os.path.join(ROOT, "assets/day/ride/s09r")
LAYERS = {"far-hills": "f1-farm-far-hills-v1.png", "middle-fields": "m1-farm-mid-fields-v1.png",
          "near-verge": "n1-farm-near-verge-v1.png", "town-shops": "t1-town-mid-shops-v1.png"}
SHEETS = {"p1-props-v1.png": ["bush", "haystack", "wall", "tree"], "i1-animals-v1.png": ["goat", "hen", "dog", "bird"],
          "d1-doors-v1.png": ["red-door", "green-door"]}
SPRITE_H = 360  # px tall at most (the near line at 1440 wide draws a goat about 200 px)


def key(path):
    """Magenta to alpha. A pixel is clearly the thing (barely magenta), clearly ground (nearly pure magenta), or a mix at an
    edge. A mixed pixel's alpha is its position on the line from magenta to the colour of the nearest clear pixel of the thing,
    and its colour is that thing colour: so a thin blade of grass keeps its green instead of turning pink or brown."""
    a = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    k = np.array([255, 0, 255], np.float32)
    m = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]   # how magenta a pixel is
    thing, ground = m < 15, m > 235
    # the rim (3 px in from the ground) is mixed with magenta even where it looks like the thing (thin grass tips turn orange):
    # its colour comes from the nearest pixel deeper in
    deep = ndimage.distance_transform_edt(thing) > 3
    thing = deep
    _, (iy, ix) = ndimage.distance_transform_edt(~thing, return_indices=True)
    near = a[iy, ix]                                   # the nearest clear colour of the thing
    fk, pk = near - k, a - k
    alpha = np.clip((pk * fk).sum(-1) / np.maximum((fk * fk).sum(-1), 1.0), 0, 1)
    alpha = np.where(thing, 1.0, np.where(ground, 0.0, alpha))
    rgb = np.where(thing[..., None], a, near)
    alpha = np.where(alpha < 0.12, 0.0, alpha)         # no faint haze
    return np.dstack([rgb, alpha * 255]).astype(np.uint8)


def save(rgba, name):
    Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, name + ".webp"), "WEBP", quality=88, method=6)


def top_edge(alpha, x0, x1):
    cols = alpha[:, x0:x1] > 128
    ys = [int(np.argmax(c)) for c in cols.T if c.any()]
    return int(np.median(ys)) if ys else None


def main():
    os.makedirs(OUT, exist_ok=True)
    rep = {}
    for name, f in LAYERS.items():
        p = os.path.join(SRC, f)
        if not os.path.exists(p):
            rep[name] = "missing"; continue
        k = key(p)
        rows = np.where((k[..., 3] > 128).any(1))[0]
        k = k[rows[0]:rows[-1] + 1]
        w = k.shape[1]
        left, right = top_edge(k[..., 3], 0, 8), top_edge(k[..., 3], w - 8, w)
        save(k, name)
        rep[name] = {"size": [w, k.shape[0]], "edge_left": left, "edge_right": right, "seam_px": abs((left or 0) - (right or 0))}
    for f, names in SHEETS.items():
        p = os.path.join(SRC, f)
        if not os.path.exists(p):
            rep[f] = "missing"; continue
        k = key(p)
        lab, n = ndimage.label(k[..., 3] > 128)
        objs = ndimage.find_objects(lab)
        big = sorted([(s, i + 1) for i, s in enumerate(objs) if (s[0].stop - s[0].start) * (s[1].stop - s[1].start) > 4000],
                     key=lambda t: t[0][1].start)
        if len(big) != len(names):
            rep[f] = f"{len(big)} pieces, wanted {len(names)}"; continue
        for (sl, lid), name in zip(big, names):
            piece = k[sl].copy()
            piece[..., 3] = np.where(lab[sl] == lid, piece[..., 3], 0)  # only this piece's own pixels
            im = Image.fromarray(piece, "RGBA")
            if im.height > SPRITE_H:
                im = im.resize((round(im.width * SPRITE_H / im.height), SPRITE_H), Image.LANCZOS)
            im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=88, method=6)
            rep[name] = {"size": list(im.size), "from": f}
    json.dump(rep, open(os.path.join(OUT, "cut-report.json"), "w"), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
