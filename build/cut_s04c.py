#!/usr/bin/env python3
"""Cut session S04-C's art (build/gen_s04c.py; sources/art/s04c/) onto the game's canvases.

  python3 build/cut_s04c.py                 # writes the game files (below)
  python3 build/cut_s04c.py --out DIR       # somewhere else, to compare

Served dishes (js/cook/flow.js servedPic draws a picture with origin (0.5, 0.94) at the tray's y + 0.18 of its
height, drawH tall): each picture is SEATED: a transparent strip under the dish puts its base on the tray's floor line
(world y SEAT, just behind the tray's front rim) instead of over the rim, so no code changes; drawH goes to
data/cook.json art.s02 served-dishes. No shadow is baked in (the code draws the contact shadow to the right, CK-21).
  chaat-v2.webp          the side-on glass bowl (C1), glass at partial alpha
  pantry-basket-v2.webp  the old basket, smaller and seated (Fable: it overlapped the tray's rim)

Nani (js/cook/stations.js CHARS.nani: x 330, top 150, scale 0.98, origin (0.5, 0); the occluder hides world y >= 611):
the leaning base N0 and its moods (masked edits, only the masked area pasted back, feathered, so nothing jumps)
on ONE canvas: her forearms' underside lands on the island's back edge (ARM_WORLD) and her eyes stay at today's x.
  nani-neutral / -happy / -talk / -point.webp
"""
import argparse
import json
import os

import sys

import cv2
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'sources', 'art', 's04c')
A = lambda *p: os.path.join(ROOT, *p)
sys.path.insert(0, os.path.join(ROOT, 'build', 'tools', 'art'))
import artlib as L  # noqa: E402

TRAY_Y, TRAY_H = 652, 58          # data/cook.json art.s02 kitchen-trays (all three share y and h)
BASE = TRAY_Y + TRAY_H * 0.18     # servedPic's base line
SEAT = 650                        # the tray's floor line just behind its front rim (the rim's top edge is y 652)

# what passed Fable (sources/art/s04c/verdicts.md); the moods' paste masks are in masks.json
PICK = json.load(open(os.path.join(SRC, 'pick.json'))) if os.path.exists(os.path.join(SRC, 'pick.json')) else {}

NANI = dict(x=330, top=150, scale=0.98)
EYES_TODAY_X = 324.5              # world x of the midpoint of today's eyes (293, 281) and (356, 261)
ARM_WORLD = 614                   # where the forearms' underside lands: just under the island's back edge (611)
NANI_F = 0.63                     # world px per source px (today's sprite is 0.561: she is 12% bigger, nearer the counter)


def rgb(p):
    return np.asarray(Image.open(p).convert('RGB')).astype(float)


def bg_of(a):
    e = np.concatenate([a[:8, :].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
    return np.median(e, 0)


def key_grey(a, tol=14, glass_ok=False, sat_food=0.10):
    """Alpha off a flat grey ground: the ground is modelled per row from the side edges (gpt-image's grey drifts
    lighter downwards). Glass (near-grey, unsaturated pixels inside the object) keeps partial alpha; saturated food
    and bright white stay solid."""
    side = np.concatenate([a[:, :8], a[:, -8:]], 1)
    bg = ndi.median_filter(np.median(side, 1), size=(31, 1))[:, None, :]
    d = np.abs(a - bg).max(2)
    lab, _ = ndi.label(d < tol)
    border = set(np.unique(np.concatenate([lab[0], lab[:, 0], lab[:, -1], lab[-1]]))) - {0}
    obj = ~np.isin(lab, list(border))
    obj = ndi.binary_fill_holes(ndi.binary_opening(obj, iterations=1))
    hl, hn = ndi.label((d < tol * 0.8) & obj)  # enclosed ground (between an arm and the body) is a hole
    if hn:
        hs = np.bincount(hl.ravel())
        obj &= ~ndi.binary_dilation(np.isin(hl, [i for i in range(1, hn + 1) if hs[i] > 300]), iterations=1)
    lb, n = ndi.label(obj)
    if n > 1:
        sz = np.bincount(lb.ravel())
        sz[0] = 0
        obj = lb == int(np.argmax(sz))
    up = np.where(a > bg, (a - bg) / np.maximum(1, 255 - bg), (bg - a) / np.maximum(1, bg)).max(2)
    alpha = np.clip((up - 0.03) / 0.45, 0, 1)
    core = ndi.binary_erosion(obj, iterations=3)
    mx, mn = a.max(2), a.min(2)
    sat = (mx - mn) / np.maximum(mx, 1)
    if glass_ok:
        solid = core & ((sat > sat_food) | (mx > 215) | (mx < 70))
        solid = ndi.binary_opening(solid, iterations=2)
        alpha = np.where(solid, 1.0, np.where(obj, np.clip(up * 2.4, 0.12, 1), 0))
    else:
        alpha = np.where(core, 1.0, np.where(ndi.binary_dilation(obj, iterations=2), alpha, 0))
    safe = np.maximum(alpha, 1e-3)[..., None]
    out = np.where(alpha[..., None] >= 0.999, a, np.clip((a - bg) / safe + bg, 0, 255))
    return np.dstack([out, alpha * 255]).astype(np.uint8)


def trim(rgba, pad=0):
    al = rgba[..., 3]
    ys, xs = np.nonzero(al > 10)
    return rgba[max(0, ys.min() - pad):ys.max() + 1 + pad, max(0, xs.min() - pad):xs.max() + 1 + pad]


def seat(im, vis_w):
    """The dish (trimmed) on a canvas whose bottom strip puts its base on SEAT when drawn at drawH; returns
    (canvas, drawH). vis_w: the dish's drawn width in world px."""
    w, h = im.size
    s = vis_w / w                      # world px per image px
    t = 10
    p = (round((BASE - SEAT) / s) + 0.06 * (t + h)) / 0.94
    p = int(round(p))
    c = Image.new('RGBA', (w + 20, t + h + p), (0, 0, 0, 0))
    c.alpha_composite(im, (10, t))
    return c, round(c.height * s, 1)


def dishes(out):
    res = {}
    if 'C1' in PICK:
        k = trim(key_grey(rgb(os.path.join(SRC, PICK['C1'])), glass_ok=True))
        im = Image.fromarray(k, 'RGBA')
        im = im.resize((300, round(300 * im.height / im.width)), Image.LANCZOS)
        c, dh = seat(im, PICK.get('C1_w', 190))
        c.save(os.path.join(out, 'chaat-v2.webp'), 'WEBP', quality=92, method=6)
        res['chaat'] = dict(file='assets/cook/items/served/chaat-v2.webp', w=c.width, h=c.height, drawH=dh)
    old = Image.open(A('assets/cook/items/served/pantry-basket.webp')).convert('RGBA')
    old = old.crop(old.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox())
    c, dh = seat(old, PICK.get('pantry_w', 128))
    c.save(os.path.join(out, 'pantry-basket-v2.webp'), 'WEBP', quality=92, method=6)
    res['pantry'] = dict(file='assets/cook/items/served/pantry-basket-v2.webp', w=c.width, h=c.height, drawH=dh)
    return res


def nani_cut(a, counter):
    """Nani off the grey; below the counter's top edge only her own (saturated or dark) pixels stay, not the white
    slab nor the arms' soft shadow on it."""
    k = key_grey(a).astype(float)
    mx, mn = a.max(2), a.min(2)
    sat = (mx - mn) / np.maximum(mx, 1)
    below = np.zeros(a.shape[:2], bool)
    below[counter - 20:] = True  # from above the slab edge: the per-row ground model blurs across it
    hers = (sat > 0.24) | (mx < 120)  # the slab under her arms picks up their warm tint (sat ~0.15)
    hers = ndi.binary_fill_holes(ndi.binary_opening(hers, iterations=2))
    # keep what's connected to her above the line
    lb, _ = ndi.label(hers | ~below)
    keep = np.isin(lb, np.unique(lb[counter - 23]))
    m = np.where(below, hers & keep, k[..., 3] > 128)
    m = ndi.gaussian_filter(m.astype(float), 0.8)
    k[..., 3] = np.where(below, m * 255, k[..., 3])
    return k


def nani(out):
    if 'N0' not in PICK:
        return {}
    meta = PICK['N0_meta']   # {"counter": y, "arm": y (forearms' underside), "eyes": [[x, y], [x, y]]} on the source
    base = rgb(os.path.join(SRC, PICK['N0']))
    masks = json.load(open(os.path.join(SRC, 'masks.json')))
    moods = {'neutral': base}
    for mood, idk in (('happy', 'N1'), ('talk', 'N2'), ('point', 'N3')):
        if idk not in PICK:
            continue
        ed = rgb(os.path.join(SRC, PICK[idk]))
        # the edit redraws the whole frame a little moved or scaled: put it back on the base first (ECC, affine, on
        # the head and shoulders, which the mask's paste must meet without a seam)
        pm = PICK.get(idk + '_meta')
        if pm:
            # a gesture the model drew a little reframed: a similarity on her eyes and the counter line, the scale the
            # mean of the eye-distance and eye-to-counter ratios (head and arms each within ~5%), the eyes' midpoint
            # on the base's
            e0, e1 = np.array(meta['eyes'], float), np.array(pm['eyes'], float)
            iod = lambda e: np.hypot(*(e[1] - e[0]))
            s_ = (iod(e0) / iod(e1) + (meta['counter'] - e0[:, 1].mean()) / (pm['counter'] - e1[:, 1].mean())) / 2
            t = e0.mean(0) - s_ * e1.mean(0)
            Mx = np.float32([[s_, 0, t[0]], [0, s_, t[1]]])
            moods[mood] = cv2.warpAffine(ed.astype(np.float32), Mx, (ed.shape[1], ed.shape[0]), flags=cv2.INTER_LINEAR,
                                         borderMode=cv2.BORDER_REPLICATE).astype(float)
            print('  %s by eyes and counter: scale %.3f' % (mood, s_))
            continue
        whole = mood in masks.get('whole', [])  # a gesture redraws the body: the whole edit, registered on the head
        ed, M = L.ecc(ed, base, (0.12, 0.5) if whole else (0.2, 0.75), mode=cv2.MOTION_AFFINE)
        print('  %s on the base: %s' % (mood, np.round(M, 3).tolist()))
        if whole:
            moods[mood] = ed
            continue
        m = np.zeros(base.shape[:2])
        H, W = m.shape
        yy, xx = np.mgrid[0:H, 0:W]
        cx, cy, rx, ry = masks['face']
        m[((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1] = 1
        if mood == 'point':
            for x0, y0, x1, y1 in masks['arm']:
                m[y0:y1, x0:x1] = 1
        m = ndi.gaussian_filter(m, 6)[..., None]
        moods[mood] = ed * m + base * (1 - m)
    f, sc = NANI_F, NANI['scale']
    ex = (meta['eyes'][0][0] + meta['eyes'][1][0]) / 2
    # canvas px = world / 0.98; source -> canvas factor
    k = f / sc
    cuts = {md: nani_cut(v, meta['counter']) for md, v in moods.items()}
    # one canvas for all: symmetric about the image origin x (world 330), eyes at EYES_TODAY_X
    al = np.maximum.reduce([c[..., 3] for c in cuts.values()])
    ys, xs = np.nonzero(al > 10)
    top = ys.min()
    bottom = meta['arm'] + 12
    wl = (EYES_TODAY_X - NANI['x']) / sc  # eye midpoint's offset from the canvas centre, canvas px
    half = max(ex - xs.min(), xs.max() - ex) * k + abs(wl) + 12
    Wc = int(2 * half)
    # world y of the source row r: 150 + (r - top) * k * 0.98 + y0 ; choose y0 so arm -> ARM_WORLD
    y_off = (ARM_WORLD - NANI['top']) / sc - (meta['arm'] - top) * k  # canvas px above the head
    Hc = int(round(y_off + (bottom - top) * k))
    res = {}
    for md, c in cuts.items():
        im = Image.fromarray(np.clip(c, 0, 255).astype(np.uint8)[top:bottom], 'RGBA')
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        cv = Image.new('RGBA', (Wc, Hc), (0, 0, 0, 0))
        cv.alpha_composite(im, (round(Wc / 2 + wl - ex * k), round(y_off)))
        cv.save(os.path.join(out, 'nani-%s.webp' % md), 'WEBP', quality=90, method=6)
        res[md] = cv.size
    eyes_w = [(round(NANI['x'] + (Wc / 2 + wl - ex * k + x * k - Wc / 2) * sc), round(NANI['top'] + (y_off + (y - top) * k) * sc)) for x, y in meta['eyes']]
    print('nani canvas', Wc, Hc, 'eyes (world)', eyes_w, 'was (293, 281) (356, 261)')
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out')
    a = ap.parse_args()
    od = a.out or A('assets/cook/items/served')
    on = a.out or A('assets/cook/characters')
    os.makedirs(od, exist_ok=True)
    print(json.dumps(dishes(od)))
    print(nani(on))


if __name__ == '__main__':
    main()
