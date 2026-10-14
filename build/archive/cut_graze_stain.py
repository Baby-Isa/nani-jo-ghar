#!/usr/bin/env python3
"""CLN-121: the scrape's second graze, cut from the landed graze art (no new picture).

The scrape (js/clinic/heal/games/cut.js mountScrape) draws on the grazed close-ups K3 and F2
(assets/clinic/closeups/child/{knee,forearm}-graze.webp): the first plaster's wound is the art's own. Levels 2 and 3
lay two plasters, so they need a second graze, and the art has one. This cuts the art's graze out as a MULTIPLY
stain (graze / plain, per channel, feathered to white at its edge), which the game lays on bare skin at the second
wound (mix-blend-mode multiply), so it takes the skin's own tone wherever it goes.

  python3 build/cut_graze_stain.py           # writes assets/clinic/closeups/child/{knee,forearm}-graze-stain.webp

Measured (source px of the 1536 x 1024 pictures, by the graze's pinkness over the plain picture, R/G over the skin's
median): the knee's graze centre (865, 395), the forearm's (618, 405); both go to data/clinic/heal/cut.json art.
The stain is cut from the @2x pictures at 2x; its size in 1x source px goes to the data (stain.size).
"""
import json
import os

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'assets', 'clinic', 'closeups', 'child')

# name: (graze centre in 1x source px, crop half-size, the feathered ellipse's half-axes), all 1x source px
CUTS = {
    'knee': ((865, 395), (130, 150), (95, 115)),
    'forearm': ((618, 405), (130, 90), (100, 58)),
}
S = 2  # cut from the @2x pictures


def load(name):
    return np.asarray(Image.open(os.path.join(D, name + '@2x.webp')).convert('RGBA')).astype(np.float64)


def blur(a, r):
    out = np.empty_like(a)
    for c in range(a.shape[2]):
        im = Image.fromarray(np.clip(a[..., c], 0, 255).astype(np.uint8), 'L')
        out[..., c] = np.asarray(im.filter(ImageFilter.GaussianBlur(r)), dtype=np.float64)
    return out


def cut(name):
    (cx, cy), (hw, hh), (ex, ey) = CUTS[name]
    G = load(name + '-graze')
    P = load(name)
    x0, x1, y0, y1 = (cx - hw) * S, (cx + hw) * S, (cy - hh) * S, (cy + hh) * S
    g = blur(G[y0:y1, x0:x1], 1.2)
    p = blur(P[y0:y1, x0:x1], 1.2)
    skin = (g[..., 3] > 250) & (p[..., 3] > 250)
    ratio = np.ones_like(g[..., :3])
    ratio[skin] = g[skin, :3] / np.maximum(p[skin, :3], 1)
    yy, xx = np.mgrid[y0:y1, x0:x1]
    d = np.hypot((xx / S - cx) / ex, (yy / S - cy) / ey)
    # the skin round the graze (a ring) sets what "no change" is (the edit shifted the tone a little everywhere)
    ring = skin & (d > 1.05) & (d < 1.4)
    norm = np.median(ratio[ring], axis=0) if ring.sum() > 50 else np.ones(3)
    ratio = np.clip(ratio / norm, 0, 1)
    # feather: full inside 0.55 of the ellipse, nothing past 1
    w = np.clip((1.0 - d) / 0.45, 0, 1)
    w = w * w * (3 - 2 * w)
    w[~skin] = 0
    out = 1 - w[..., None] * (1 - ratio)
    img = Image.fromarray(np.round(out * 255).astype(np.uint8), 'RGB')
    path = os.path.join(D, name + '-graze-stain.webp')
    img.save(path, 'WEBP', quality=92, method=6)
    print(path, img.size, 'norm', np.round(norm, 3).tolist(), 'darkest', np.round(out.min(axis=(0, 1)), 3).tolist())
    return {'centre': [cx, cy], 'size': [2 * hw, 2 * hh]}


if __name__ == '__main__':
    print(json.dumps({k: cut(k) for k in CUTS}))
