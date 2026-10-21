#!/usr/bin/env python3
"""Cut the s09b art (sources/art/s09b/) into the day's pieces under assets/day/s09b/: the skies, the far hills (magenta),
the wide car window (green), the empty house (its sky cut away), Nani's door poses (flat grey), the sprite sheets (magenta,
split at the empty columns between things), her face close-up and the book's find-it spreads. Keying is cut_s09r.py's
(each edge pixel takes the colour of the thing beside it). Usage: python3 build/tools/art/cut_s09b.py"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage
from cut_s09r import key, magenta, top_edge

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
SRC = os.path.join(ROOT, "sources/art/s09b")
OUT = os.path.join(ROOT, "assets/day/s09b")
PLAIN = {"sky-sunny": "s1-sky-sunny-v1.png", "sky-cloudy": "s2-sky-cloudy-v1.png", "sky-raining": "s3-sky-raining-v1.png",
         "sky-night": "s4-sky-night-v1.png", "nani-face-fire": "c1-nani-face-fire-v1.png",
         "book-farm-spread": "k1-book-farm-spread-v1.png", "book-kitchen-spread": "k2-book-kitchen-spread-v1.png"}
SHEETS = {"a1-farm-animals-v1.png": ["cow", "sheep", "donkey", "horse"],
          "a2-farm-animals-v1.png": ["buffalo", "duck", "camel", "hen-chicks"],
          "v1-road-vehicles-v1.png": ["bus", "tractor", "bicycle", "car"],
          "v2-road-things-v1.png": ["milk-van", "kite", "aeroplane", "butterfly"],
          "l1-road-landmarks-v1.png": ["windmill", "well", "rainbow"]}
POSES = {"n1-nani-door-poses-v1.png": ["nani-wave", "nani-welcome", "nani-point-up", "nani-umbrella"],
         "n2-nani-door-poses-v1.png": ["nani-listen", "nani-fan", "nani-shade-eyes"]}
SPRITE_H, POSE_H = 360, 900


def green(a):
    return a[..., 1] - np.maximum(a[..., 0], a[..., 2])


def grey_of(a):
    """How close each pixel is to the sheet's own flat grey (sampled at its corners): 255 on the grey, falling off fast."""
    c = np.median(np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3), a[-8:, :8].reshape(-1, 3), a[-8:, -8:].reshape(-1, 3)]), 0)
    d = np.sqrt(((a - c) ** 2).sum(-1))
    return 255 - d * 8


def webp(im, name, q=88):
    im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=q, method=6)


def pieces(rgba, names):
    """The sheet's things as pixel masks: connected pieces, each small piece (a chick, a kite's ribbon, a cloud under a
    rainbow) joined to the nearest big one; then, while there are more than len(names), the two big ones nearest each
    other side by side are joined. Left to right."""
    lab, n = ndimage.label(rgba[..., 3] > 128)
    if not n:
        return []
    area = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    com = ndimage.center_of_mass(np.ones_like(lab), lab, range(1, n + 1))
    big = [i for i in range(n) if area[i] > 0.15 * area.max()]
    group = {i: [i] for i in big}
    for i in range(n):
        if i not in group and area[i] > 30:
            near = min(big, key=lambda b: (com[i][0] - com[b][0]) ** 2 + (com[i][1] - com[b][1]) ** 2)
            group[near].append(i)
    keys = sorted(group, key=lambda b: com[b][1])
    while len(keys) > len(names):
        t = min(range(len(keys) - 1), key=lambda j: abs(com[keys[j + 1]][1] - com[keys[j]][1]))
        group[keys[t]] += group.pop(keys[t + 1])
        keys.pop(t + 1)
    return [np.isin(lab, [m + 1 for m in group[b]]) for b in keys]


def cut_sheet(rgba, names, max_h, rep, src):
    masks = pieces(rgba, names)
    if len(masks) != len(names):
        rep[src] = f"{len(masks)} pieces, wanted {len(names)}"
        return
    for m, name in zip(masks, names):
        grown = ndimage.binary_dilation(m, iterations=3)
        piece = rgba.copy()
        piece[..., 3] = np.where(grown, piece[..., 3], 0)
        ys, xs = np.where(piece[..., 3] > 0)
        im = Image.fromarray(np.ascontiguousarray(piece[ys.min():ys.max() + 1, xs.min():xs.max() + 1]), "RGBA")
        if im.height > max_h:
            im = im.resize((round(im.width * max_h / im.height), max_h), Image.LANCZOS)
        webp(im, name)
        rep[name] = {"size": list(im.size), "from": src}


def house(path):
    """The empty house with its sky cut away: the sky is the blue region joined to the top edge."""
    a = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    skyish = (b > r + 18) & (b > g - 6)
    lab, _ = ndimage.label(skyish)
    top = set(np.unique(lab[0])) - {0}
    sky = np.isin(lab, list(top))
    sky = ndimage.binary_closing(sky, iterations=2)
    alpha = np.where(sky, 0, 255).astype(np.float32)
    alpha = ndimage.gaussian_filter(alpha, 0.8)
    w = alpha.shape[1]
    return np.dstack([a, alpha]).astype(np.uint8), int(np.median([np.argmax(c) for c in (alpha > 128)[:, w // 3: 2 * w // 3].T]))  # the roofline over the middle third


def main():
    os.makedirs(OUT, exist_ok=True)
    rep = {}
    for name, f in PLAIN.items():
        webp(Image.open(os.path.join(SRC, f)).convert("RGB"), name)
        rep[name] = "copied"
    k = key(os.path.join(SRC, "f2-farm-far-hills-loop-v1.png"))
    rows = np.where((k[..., 3] > 128).any(1))[0]
    k = k[rows[0]:rows[-1] + 1]
    w = k.shape[1]
    webp(Image.fromarray(k, "RGBA"), "far-hills")
    rep["far-hills"] = {"size": [w, k.shape[0]], "edge_left": top_edge(k[..., 3], 0, 8), "edge_right": top_edge(k[..., 3], w - 8, w)}
    win = key(os.path.join(SRC, "w1-car-window-wide-v1.png"), keyness=green, k=(0, 255, 0))
    webp(Image.fromarray(win, "RGBA"), "car-window-wide", q=92)
    hole = np.where((win[..., 3] < 128).any(1))[0], np.where((win[..., 3] < 128).any(0))[0]
    rep["car-window-wide"] = {"opening": [int(hole[1][0]), int(hole[0][0]), int(hole[1][-1] - hole[1][0]), int(hole[0][-1] - hole[0][0])], "green_left": int(((win[..., 3] > 0) & (green(win[..., :3].astype(np.float32)) > 120)).sum())}
    h, roof = house(os.path.join(SRC, "h3-house-empty-wide-v1.png"))
    webp(Image.fromarray(h, "RGBA"), "house-empty", q=90)
    rep["house-empty"] = {"roofline_y": roof}
    for f, names in SHEETS.items():
        cut_sheet(key(os.path.join(SRC, f)), names, SPRITE_H, rep, f)
    for f, names in POSES.items():
        cut_sheet(key(os.path.join(SRC, f), keyness=grey_of, k=None), names, POSE_H, rep, f)
    json.dump(rep, open(os.path.join(OUT, "cut-report.json"), "w"), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
