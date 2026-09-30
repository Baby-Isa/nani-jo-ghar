#!/usr/bin/env python3
"""A stand-in tomato pot for chaat v3 (30 Sept): the v3 pot sheet (T2) has no tomato, and tomato (veg-03)
is one of chaat's toppings. This recolours `pot-onion.webp`'s diced onion to diced tomato (same jar, same
canvas and anchor), so the shelf stays all side-on (Q2b) until a real `pot-tomato` is drawn.

  python3 build/make_chaat_tomato_pot.py      # writes assets/cook/items/v3/chaat/pot-tomato.webp + meta
"""
import json
import os

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "assets", "cook", "items", "v3", "chaat")


def rgb_to_hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1)
    mn = a.min(-1)
    d = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) / 6
    s = np.where(mx > 0, (mx - mn) / (mx + 1e-9), 0)
    return h, s, mx


def hsv_to_rgb(h, s, v):
    i = np.floor(h * 6).astype(int) % 6
    f = h * 6 - np.floor(h * 6)
    p, q, t = v * (1 - s), v * (1 - f * s), v * (1 - (1 - f) * s)
    out = np.zeros(h.shape + (3,))
    for k, (r, g, b) in enumerate([(v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q)]):
        m = i == k
        out[m] = np.stack([r[m], g[m], b[m]], -1)
    return out


def main():
    im = np.array(Image.open(os.path.join(DIR, "pot-onion.webp")).convert("RGBA")).astype(float) / 255
    H, W = im.shape[:2]
    h, s, v = rgb_to_hsv(im[..., :3])
    # the food only: inside the jar's walls, below the food's top (a soft-edged box), and solid
    yy, xx = np.mgrid[0:H, 0:W]
    box = np.clip((xx / W - 0.1) / 0.04, 0, 1) * np.clip((0.9 - xx / W) / 0.04, 0, 1)
    box *= np.clip((yy / H - 0.2) / 0.03, 0, 1) * np.clip((0.9 - yy / H) / 0.03, 0, 1)
    food = box * (im[..., 3] > 0.5)
    # the jar's own white highlights come down over the top of the food: keep them (they're grey, not pink)
    food *= np.where(yy / H < 0.34, np.clip((s - 0.05) / 0.06, 0, 1), 1)
    # onion's magenta skin -> tomato red; its white flesh -> the paler red of a tomato's inside
    nh = np.where(s > 0.25, 0.995, 0.012) + np.zeros_like(h)
    ns = np.clip(np.where(s > 0.25, s * 1.1 + 0.3, 0.55 + s * 1.2), 0, 0.95)
    nv = np.clip(np.where(s > 0.25, v * 0.8, v * 0.9), 0, 1)
    new = hsv_to_rgb(nh, ns, nv)
    out = im.copy()
    out[..., :3] = im[..., :3] * (1 - food[..., None]) + new * food[..., None]
    Image.fromarray((out * 255).round().astype(np.uint8)).save(os.path.join(DIR, "pot-tomato.webp"), quality=90)
    mp = os.path.join(DIR, "meta.json")
    meta = json.load(open(mp))
    m = dict(meta["pot-onion"])
    m["from"] = "pot-onion.webp, recoloured (build/make_chaat_tomato_pot.py): a stand-in, no tomato on the T2 sheet"
    meta["pot-tomato"] = m
    json.dump(meta, open(mp, "w"), indent=1)
    print("wrote pot-tomato.webp")


if __name__ == "__main__":
    main()
