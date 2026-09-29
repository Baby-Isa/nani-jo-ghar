#!/usr/bin/env python3
"""Cut the chai v2 game art (sources/art/chai-v2/*-draft1.png, build/gen_chai_v2.py) into
assets/cook/items/chai-v2/, by build/cut_tick_v2.py's method adapted to these drafts:
  - the drafts' grey is not flat (a soft gradient) and each object bakes a soft shadow. The background
    is everything connected to the border through SMOOTH pixels (small gradient): the shadow ramp is
    smooth, the object's own edges are not. The object is the rest, holes filled, largest piece.
  - the edge gets a 1 px anti-aliased falloff; the page draws the one soft shadow itself (§7).
  - glass stays see-through: the empty glass's alpha comes from colour-to-alpha against the
    measured grey (highlights and rims stay, the grey goes); chai is solid.
Also composes the hob for 1..4 burners from the mock-up's 2-burner hob (hob-2-burner-t.webp):
a left end, one burner tile per person, a right end, and a deeper front edge for the face badges
and knobs. Positions the game needs go to assets/cook/items/chai-v2/meta.json.

  python3 build/cut_chai_v2.py
"""
import json
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
from scipy.spatial import ConvexHull
from PIL import ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'sources', 'art', 'chai-v2')
OUT = os.path.join(ROOT, 'assets', 'cook', 'items', 'chai-v2')
META = {}


def load(name):
    return np.asarray(Image.open(os.path.join(SRC, name + '-draft1.png')).convert('RGB')).astype(float)


def bg_field(a, ring=40):
    """A smooth quadratic background fitted to the border ring (per channel)."""
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w] / np.array([h, w])[:, None, None]
    m = np.zeros((h, w), bool)
    m[:ring], m[-ring:], m[:, :ring], m[:, -ring:] = True, True, True, True
    basis = np.stack([np.ones_like(xx), xx, yy, xx * xx, yy * yy, xx * yy], -1)
    out = np.empty_like(a)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(basis[m], a[..., c][m], rcond=None)
        out[..., c] = basis @ coef
    return out


def object_mask(a, t=2.0, open_it=3):
    g = ndi.gaussian_filter(a, (1.5, 1.5, 0))
    gm = np.sqrt(sum(ndi.sobel(g[..., c], 0) ** 2 + ndi.sobel(g[..., c], 1) ** 2 for c in range(3))) / 8
    lab, _ = ndi.label(gm < t)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ndi.binary_fill_holes(ndi.binary_opening(~np.isin(lab, list(border)), iterations=open_it))
    return obj


def largest(m):
    lb, n = ndi.label(m)
    if not n:
        return m
    return lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)


def soft(mask):
    """A 1 px anti-aliased edge: the mask at 4x, blurred, back down."""
    im = Image.fromarray((mask * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(0.9))).astype(float) / 255


def rgba(a, alpha):
    return Image.fromarray(np.dstack([np.clip(a, 0, 255), np.clip(alpha, 0, 1) * 255]).astype(np.uint8), 'RGBA')


def crop_to(img, box, pad, size):
    """Crop a box (+pad), square it (object centred), resize to `size` wide."""
    x0, y0, x1, y1 = box
    im = img.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
    s = size / im.width
    return im.resize((size, round(im.height * s)), Image.LANCZOS), s


def bbox(m):
    ys, xs = np.nonzero(m)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def cut_pans():
    # the top-down pan: the body is a circle (fitted to the object once its handle is opened away)
    a = load('pan-top')
    obj = largest(object_mask(a))
    body = largest(ndi.binary_opening(obj, iterations=30))
    ys, xs = np.nonzero(body)
    # NB (29 Sept): the opening leaves the handle's root on the body, so this mean sits up and right of the
    # real centre; the shipped meta has cx 0.3434, cy 0.6408, from a circle fitted to the rim with the
    # handle's side left out. Fit the rim the same way before re-cutting, or the pans sit off their burners
    cx, cy = xs.mean(), ys.mean()
    R = np.sqrt(body.sum() / np.pi)
    x0, y0, x1, y1 = bbox(obj)
    img = rgba(a, soft(obj))
    pad = 8
    im, s = crop_to(img, (x0, y0, x1, y1), pad, 512)
    im.save(os.path.join(OUT, 'pan-top.webp'), quality=92, method=6)
    # the inside floor (where the liquid sits): measured on the draft, about 0.8 of the outer rim
    META['panTop'] = {'w': im.width, 'h': im.height, 'cx': (cx - x0 + pad) * s / im.width, 'cy': (cy - y0 + pad) * s / im.height,
                      'r': R * s / im.width, 'rIn': R * 0.8 * s / im.width}
    # the tipped pan: its body's convex hull (the dark wall on the shadow side is smooth too)
    a = load('pan-pour')
    obj = largest(object_mask(a))
    lum, sat = a.mean(2), a.max(2) - a.min(2)
    chai = largest(ndi.binary_opening(sat > 45, iterations=3))
    qx0, qy0, qx1, qy1 = bbox(chai)
    box = np.zeros_like(obj)
    box[qy0 - 35:, qx0 - 45: qx1 + 35] = True
    body = largest(ndi.binary_opening(obj & box & (lum > 55), iterations=4))
    pts = np.argwhere(body)[:, ::-1]
    hull = pts[ConvexHull(pts).vertices]
    hm = Image.new('L', (a.shape[1], a.shape[0]), 0)
    ImageDraw.Draw(hm).polygon([tuple(p) for p in hull], fill=255)
    obj = obj | (np.asarray(hm) > 0)
    x0, y0, x1, y1 = bbox(obj)
    img = rgba(a, soft(obj))
    im, s = crop_to(img, (x0, y0, x1, y1), pad, 512)
    im.save(os.path.join(OUT, 'pan-pour.webp'), quality=92, method=6)
    # the spout: the object's lowest-left point on the rim (the lip the chai leaves from)
    lip = np.argwhere(obj[:, :])
    left = lip[lip[:, 1] < x0 + (x1 - x0) * 0.12]
    ly = left[:, 0].mean()
    META['panPour'] = {'w': im.width, 'h': im.height, 'lipX': (x0 - x0 + pad) * s / im.width + 0.02, 'lipY': (ly - y0 + pad) * s / im.height,
                       'bodyW': np.ptp(np.nonzero(body.any(0))[0]) * s / im.width}


def cut_glasses():
    a = load('glasses2')
    bg = bg_field(a)
    w = a.shape[1]
    cells = [(0, w // 3), (w // 3, 2 * w // 3), (2 * w // 3, w)]
    masks, boxes = [], []
    for x0, x1 in cells:
        m = np.zeros(a.shape[:2], bool)
        m[:, x0:x1] = largest(object_mask(a[:, x0:x1]))
        # a glass is round: its disc (the fill keeps the base ring inside)
        ys, xs = np.nonzero(m)
        cx, cy, R = xs.mean(), ys.mean(), np.sqrt(m.sum() / np.pi)
        yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
        disc = (xx - cx) ** 2 + (yy - cy) ** 2 <= R ** 2
        masks.append(disc)
        boxes.append((cx, cy, R))
    Rm = max(b[2] for b in boxes)
    size = 256
    out = []
    for i, (disc, (cx, cy, R)) in enumerate(zip(masks, boxes)):
        # colour-to-alpha against the grey: clear glass keeps only its highlights and dark rims
        up = np.where(a > bg, (a - bg) / np.maximum(1, 255 - bg), (bg - a) / np.maximum(1, bg))
        c2a = np.clip(up.max(2) * 1.6, 0, 1)
        sat = a.max(2) - a.min(2)
        chai = ndi.binary_opening(sat > 45, iterations=2) & disc
        alpha = np.maximum(c2a * 0.9 + 0.12, chai.astype(float))
        alpha = alpha * soft(disc)
        safe = np.maximum(alpha, 1e-3)[..., None]
        rgb = np.where(chai[..., None], a, np.clip((a - bg) / safe + bg, 0, 255))
        # a clear glass on the grey reads grey-ish: pull the see-through part toward white glass
        img = rgba(rgb, alpha)
        pad = Rm * 1.04
        im = img.crop((int(cx - pad), int(cy - pad), int(cx + pad), int(cy + pad))).resize((size, size), Image.LANCZOS)
        im.save(os.path.join(OUT, f'glass-{["empty", "half", "full"][i]}.webp'), quality=92, method=6)
        out.append(R / pad)
    META['glass'] = {'r': out}


def cut_liquids():
    a = load('liquids')
    w = a.shape[1]
    names = ['milk', 'tea', 'milky', 'dark']
    sat = a.max(2) - a.min(2)
    lb, n = ndi.label(ndi.binary_opening(sat > 40, iterations=3))
    comps = sorted([(ndi.center_of_mass(lb == k), (lb == k).sum()) for k in range(1, n + 1)], key=lambda c: -c[1])[:3]
    comps.sort(key=lambda c: c[0][1])
    (y1, x1), (y2, x2) = comps[0][0], comps[1][0]
    area = np.mean([c[1] for c in comps])
    comps = [((y1, 2 * x1 - x2), area)] + comps
    size = 256
    for name, ((cy, cx), area) in zip(names, comps):
        R = np.sqrt(area / np.pi)
        r = R * 0.94  # just inside the pool's edge: the liquid surface only
        yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
        disc = (xx - cx) ** 2 + (yy - cy) ** 2 <= r ** 2
        img = rgba(a, soft(disc))
        im = img.crop((int(cx - r - 2), int(cy - r - 2), int(cx + r + 2), int(cy + r + 2))).resize((size, size), Image.LANCZOS)
        im.save(os.path.join(OUT, f'liquid-{name}.webp'), quality=90, method=6)
    # the milk pool runs off the draft's left edge: milk is the milky pool whitened (same meniscus and light)
    m = np.asarray(Image.open(os.path.join(OUT, 'liquid-milky.webp'))).astype(float)
    m[..., :3] = m[..., :3] * 0.25 + np.array([250, 247, 238]) * 0.75
    Image.fromarray(m.astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'liquid-milk.webp'), quality=90, method=6)


def cut_jars():
    ref = Image.open(os.path.join(ROOT, 'assets', 'cook', 'items', 'shelf-spi-10-bare-f.webp'))
    rb = ref.getbbox()  # the family's registration: the same box on a 256 canvas
    for name, word in [('jar-aadu', 'veg-14'), ('jar-lasan', 'veg-13')]:
        a = load(name)
        obj = largest(object_mask(a, open_it=8))
        img = rgba(a, soft(obj))
        x0, y0, x1, y1 = bbox(obj)
        im = img.crop((x0, y0, x1, y1)).resize((rb[2] - rb[0], rb[3] - rb[1]), Image.LANCZOS)
        cv = Image.new('RGBA', ref.size, (0, 0, 0, 0))
        cv.alpha_composite(im, (rb[0], rb[1]))
        cv.save(os.path.join(ROOT, 'assets', 'cook', 'items', f'shelf-{word}-jar-f.webp'), quality=92, method=6)


def flatten(img, m=24):
    """The tiles' plate brightness drifts a little: even out the low frequencies of the dark plate."""
    lum = img[..., :3].mean(2)
    plate = (lum < 75) & (img[..., 3] > 250)
    plate[:m], plate[-m:], plate[:, :m], plate[:, -m:] = False, False, False, False
    w = ndi.gaussian_filter(plate.astype(float), 30)
    low = ndi.gaussian_filter(np.where(plate[..., None], img[..., :3], 0), (30, 30, 0)) / np.maximum(w, 1e-3)[..., None]
    target = np.median(img[..., :3][plate], 0)
    inner = np.zeros(lum.shape, bool)
    inner[m:-m, m:-m] = True
    corr = np.where((inner & (w > 0.05))[..., None], low - target, 0)
    img[..., :3] = np.clip(img[..., :3] - corr, 0, 255)
    return img


def compose_hobs():
    """1..4 burners: left end + tiles + right end, and a deeper front edge (badges and knobs)."""
    src = np.asarray(Image.open(os.path.join(OUT, 'hob-2-burner-t.webp')).convert('RGBA')).astype(float)
    c1, c2, cy, h = 223, 637, 244, 185  # the burner caps (measured) and half a tile
    # the front edge: rows 400..470 are plain plate; stretch them to make room in front of the burners
    top, mid, bot = src[:400], src[400:470], src[470:]
    extra = 150
    midS = np.asarray(Image.fromarray(mid.astype(np.uint8), 'RGBA').resize((src.shape[1], mid.shape[0] + extra), Image.BICUBIC)).astype(float)
    tall = np.concatenate([top, midS, bot], 0)
    L = tall[:, : c1 + h]
    T = tall[:, c2 - h: c2 + h]
    R = tall[:, c2 + h:]
    F = 16  # cross-fade at each join (plain plate there)

    def join(a, b):
        wgt = np.linspace(0, 1, F)[None, :, None]
        seam = a[:, -F:] * (1 - wgt) + b[:, :F] * wgt
        return np.concatenate([a[:, :-F], seam, b[:, F:]], 1)
    META['hob'] = {'h': tall.shape[0], 'burnerY': cy / tall.shape[0], 'frontY': (400 + (70 + extra) / 2) / tall.shape[0]}
    for n in range(1, 5):
        if n == 1:
            # one burner: the left end to just past the burner, then the right end
            img = join(tall[:, : c1 + h], R)
            xs = [c1]
        else:
            img = L
            xs = [c1]
            for i in range(n - 1):
                img = join(img, T)
                xs.append(xs[-1] + 2 * h - F)
            img = join(img, R)
        img = img.copy()
        E, C = 110, 430  # the corner caps' width, a clean column of the rim
        for rows in (slice(0, 75), slice(img.shape[0] - 75, img.shape[0])):
            img[rows, :E] = tall[rows, :E]
            img[rows, -E:] = tall[rows, -E:]
            img[rows, E:-E] = tall[rows, C:C + 1]
        img = flatten(img, 18)
        Image.fromarray(img.astype(np.uint8), 'RGBA').save(os.path.join(OUT, f'hob-{n}.webp'), quality=92, method=6)
        META['hob'][str(n)] = {'w': img.shape[1], 'burners': [x / img.shape[1] for x in xs]}


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    cut_pans()
    cut_glasses()
    cut_liquids()
    cut_jars()
    compose_hobs()
    json.dump(META, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
    print(json.dumps(META, indent=1))
