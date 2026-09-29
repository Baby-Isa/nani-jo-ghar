#!/usr/bin/env python3
"""Cut the chaat v2 drafts (build/gen_chaat_v2.py -> sources/art/chaat-v2/) into the station's sprites
(assets/cook/items/chaat-v2/), with build/cut_tick_v2.py's method:
  - the object is everything not connected to the background, holes filled (clear glass stays one piece);
  - edges (and, for the glass, its whole body) use colour-to-alpha against the MEASURED background. These
    drafts have a soft vignette, so the background is fitted per pixel (a smooth surface through the
    pixels outside the object) rather than one flat grey.
Outputs:
  glass-bowl.webp      the clear serving bowl, side view, empty (see-through: its body is colour-to-alpha)
  band-<word>.webp     a layer as seen through the glass: a packed texture strip (cropped from the strips
                       sheets, or tiled from the painted top-down layer art where the strip read badly)
  prep-<word>.webp     one identical front-on prep bowl per topping: the generated empty bowl, with that
                       topping heaped in its opening (the painted top-down topping bowls' contents, seen at
                       the bowl's own low angle), so every slot is the same bowl
  meta.json            the glass's measured inside (floor, rim, the inner wall per row) for the station
  python3 build/cut_chaat_v2.py
"""
import json
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'sources', 'art', 'chaat-v2')
ITEMS = os.path.join(ROOT, 'assets', 'cook', 'items')
OUT = os.path.join(ITEMS, 'chaat-v2')


def load(name):
    return np.asarray(Image.open(os.path.join(SRC, name)).convert('RGB')).astype(float)


def fit_bg(a, outside, deg=4):
    """A smooth background surface (per channel, a 2D polynomial) through the pixels marked `outside`."""
    h, w, _ = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    X = (xx / w - 0.5) * 2
    Y = (yy / h - 0.5) * 2
    terms = [X ** i * Y ** j for i in range(deg + 1) for j in range(deg + 1 - i)]
    A = np.stack([t[outside] for t in terms], 1)
    step = max(1, len(A) // 60000)
    bg = np.zeros_like(a)
    for ch in range(3):
        coef, *_ = np.linalg.lstsq(A[::step], a[..., ch][outside][::step], rcond=None)
        bg[..., ch] = sum(c * t for c, t in zip(coef, terms))
    return bg


def c2a(c, bg):
    """Colour-to-alpha against a (per-pixel) background: alpha and the un-mixed colour."""
    up = np.where(c > bg, (c - bg) / np.maximum(255 - bg, 1), (bg - c) / np.maximum(bg, 1))
    alpha = np.clip(up.max(2), 0, 1)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.clip((c - bg) / safe + bg, 0, 255)
    return alpha, rgb


def silhouette(a, T, close):
    """The object: its strong edges (the drafts' soft vignette has none), closed and filled."""
    g = a.mean(2)
    gm = np.hypot(ndi.sobel(g, 0), ndi.sobel(g, 1))
    m = largest(ndi.binary_fill_holes(ndi.binary_closing(gm > T, iterations=close)))
    return ndi.binary_erosion(m, iterations=1)


def largest(mask):
    lb, n = ndi.label(mask)
    if not n:
        return mask
    return lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)


def save(img, name):
    os.makedirs(OUT, exist_ok=True)
    img.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=90, method=6)
    img.save(os.path.join(SRC, 'cut-' + name + '.png'))


def glass():
    a = load('glass-bowl-draft1.png')
    h, w, _ = a.shape
    # first pass: a rough box round the bowl is "inside"; everything else is background
    rough = np.zeros((h, w), bool)
    rough[250:890, 40:990] = True
    bg = fit_bg(a, ~rough)
    obj = silhouette(a, 30, 6)
    # second pass: refit the background without the object itself
    bg = fit_bg(a, ~ndi.binary_dilation(obj, iterations=14))
    alpha, rgb = c2a(a, bg)
    # clear glass: its body keeps a faint presence (so it reads as glass on any colour); rim and base
    # highlights come through as they are
    alpha = np.clip(alpha * 1.6, 0, 1)
    alpha = np.where(obj, np.maximum(alpha, 0.1), 0)
    soft = ndi.gaussian_filter(obj.astype(float), 1.2)
    alpha = alpha * np.clip(soft * 1.4, 0, 1)
    img = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    ys, xs = np.nonzero(obj)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    crop = Image.fromarray(img[y0:y1, x0:x1], 'RGBA')
    om = obj[y0:y1, x0:x1]
    H, W = om.shape
    # the inside: per row, the silhouette's edges moved in by the wall's thickness
    wall = 0.022 * W
    prof = []
    for f in np.linspace(0, 1, 41):
        r = min(H - 1, int(f * (H - 1)))
        xs_r = np.nonzero(om[r])[0]
        prof.append([round(f, 4), round((xs_r.min() + wall) / W, 4), round((xs_r.max() - wall) / W, 4)] if len(xs_r) else [round(f, 4), 0.5, 0.5])
    # the rim: the top of the silhouette to its widest row; the inner floor: above the thick base
    widest = int(np.argmax(om.sum(1)[: H // 2]))
    meta = {
        'w': int(W), 'h': int(H),
        'rimTop': 0.0, 'rimY': round(widest / H, 4),
        'rimRy': round(widest / H, 4),
        # the glass's thick base: the floor inside sits about this far up (measured on the draft)
        'floorY': 0.83,
        'inside': prof,
    }
    save(crop, 'glass-bowl')
    return meta


def band_from_strip(sheet, box, name, key_white=False, key_bg=None):
    a = load(sheet)
    x0, y0, x1, y1 = box
    c = a[y0:y1, x0:x1]
    alpha = np.ones(c.shape[:2])
    if key_white:
        # a drizzle: the yoghurt round it goes (the ribbon stays), soft edge
        wh = (c.min(2) > 195) & (np.ptp(c, 2) < 40)
        wh = ndi.binary_opening(wh, iterations=1)
        alpha = 1 - ndi.gaussian_filter(wh.astype(float), 1.5)
        alpha = np.clip((alpha - 0.15) / 0.85, 0, 1)
    img = np.dstack([c, alpha * 255]).astype(np.uint8)
    save(Image.fromarray(img, 'RGBA'), 'band-' + name)


def band_from_layer(src, name, w=900, h=120, scale=0.55):
    """A strip tiled from painted top-down layer art (its packed middle), for a layer the strips sheet drew badly."""
    im = Image.open(os.path.join(ITEMS, src)).convert('RGBA')
    im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    iw, ih = im.size
    # the dense middle of the pile
    tile = im.crop((int(iw * 0.18), int(ih * 0.3), int(iw * 0.82), int(ih * 0.7)))
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    tw, th = tile.size
    rng = np.random.default_rng(3)
    for yy in range(-th // 2, h, th // 2):
        for xx in range(-tw // 2, w, tw // 2):
            out.alpha_composite(tile, (int(xx + rng.integers(-10, 10)), int(yy)))
    save(out, 'band-' + name)


# the top-down topping bowls' contents, for the heap in each front-on prep bowl
TOPPINGS = {
    'veg-01': 'topping-bataato-boiled-bowl-t.png', 'ph-chana': 'topping-channa-bowl-t.png',
    'ph-dahi': 'topping-dai-bowl-t.png', 'ph-amli': 'topping-amli-bowl-t.png', 'ph-lili': 'topping-lili-bowl-t.png',
    'ph-sev': 'topping-sev-bowl-t.png', 'ph-dhana': 'topping-dhana-chopped-bowl-t.png',
    'veg-12': 'topping-marcha-chopped-bowl-t.png', 'veg-02': 'topping-dungri-chopped-bowl-t.png',
    'veg-03': 'topping-tameto-chopped-bowl-t.png',
}
LIQUID = {'ph-dahi', 'ph-amli', 'ph-lili'}


def prep_bowls():
    a = load('bowls-a-draft1.png')
    h, w, _ = a.shape
    # the middle bowl (the yoghurt one: its bowl is the cleanest): cream-white, low saturation, bright
    cell = a[:, 600:920]
    body = silhouette(cell, 30, 4)
    ys, xs = np.nonzero(body)
    rows = body.sum(1)
    top = ys.min()
    bot = ys.max()
    full = rows.max()
    # the rim: the widest row of the bowl (the heap above it is narrower)
    rim_row = int(np.argmax(rows)) - int(full * 0.03)
    # the body: the cup from its rim down (the draft's yoghurt heap above it goes)
    cup = body.copy()
    cup[:rim_row] = False
    # the rim's own ellipse (seen from slightly above): half-height from the draft, ~0.1 of its width
    cx = (xs.min() + xs.max()) / 2
    rx = full / 2
    ry = rx * 0.2
    rim_y = rim_row + ry * 0.35
    # the bowl's pixels (the cup), with its edge by colour-to-alpha against the local grey
    outside = ~ndi.binary_dilation(body, iterations=12)
    bg = fit_bg(cell, outside, deg=3)
    alpha, rgb = c2a(cell, bg)
    core = ndi.binary_erosion(cup, iterations=2)
    alpha = np.where(core, 1, np.where(ndi.binary_dilation(cup, iterations=2), alpha, 0))
    rgb = np.where(core[..., None], cell, rgb)
    bowl = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA')
    # one canvas for every prep bowl: the bowl at the bottom, room above for the heap
    PAD = 10
    x0 = int(cx - rx) - PAD
    x1 = int(cx + rx) + PAD
    heap_h = int(rx * 0.62)
    y0 = int(rim_y - ry - heap_h)
    y1 = bot + PAD
    W, H = x1 - x0, y1 - y0
    rim = (cx - x0, rim_y - y0)
    meta = {'w': int(W), 'h': int(H), 'rimY': round(rim[1] / H, 4), 'rx': round(rx / W, 4)}
    bowl_c = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bowl_c.alpha_composite(bowl.crop((x0, y0, x1, y1)))
    # the rim ring (the inside wall's far half shows over the heap's base, the lip in front)
    for wid, src in TOPPINGS.items():
        im = Image.open(os.path.join(ITEMS, src)).convert('RGBA')
        iw, ih = im.size
        # the contents: the circle inside the painted bowl's rim
        r_in = 0.36 * iw
        m = Image.new('L', im.size, 0)
        ImageDraw.Draw(m).ellipse((iw / 2 - r_in, ih / 2 - r_in, iw / 2 + r_in, ih / 2 + r_in), fill=255)
        food = Image.new('RGBA', im.size, (0, 0, 0, 0))
        food.paste(im, (0, 0), m)
        food = food.crop((int(iw / 2 - r_in), int(ih / 2 - r_in), int(iw / 2 + r_in), int(ih / 2 + r_in)))
        liquid = wid in LIQUID
        # the heap: the top-down contents squashed to the bowl's low angle, raised in a dome for solids
        dome = 0.04 if liquid else 0.26
        fw = int(rx * 2 * 0.9)
        fh_top = int(ry * 2 * 0.94)
        tall = int(fh_top + rx * dome * 2)
        tex = food.resize((fw, tall), Image.LANCZOS)
        # the heap's outline: the rim's ellipse, and above its centre line a rounded dome
        cyl = tall - fh_top / 2
        yy, xx = np.mgrid[0:tall, 0:fw]
        nx = (xx - fw / 2) / (fw / 2)
        rim_e = nx ** 2 + ((yy - cyl) / (fh_top / 2)) ** 2 <= 1
        dome_e = (nx ** 2 + ((yy - cyl) / max(cyl, 1)) ** 2 <= 1) & (yy <= cyl)
        full_mask = Image.fromarray(((rim_e | dome_e) * 255).astype(np.uint8))
        full_mask = full_mask.filter(ImageFilter.GaussianBlur(1.2))
        # light from the upper left, a soft shade at the bottom of the heap
        sh = np.asarray(tex).astype(float)
        yy, xx = np.mgrid[0:tall, 0:fw]
        light = 1.08 - 0.22 * (yy / tall) - 0.1 * (xx / fw)
        sh[..., :3] = np.clip(sh[..., :3] * light[..., None], 0, 255)
        tex = Image.fromarray(sh.astype(np.uint8), 'RGBA')
        heap = Image.new('RGBA', (fw, tall), (0, 0, 0, 0))
        heap.paste(tex, (0, 0), Image.fromarray(np.minimum(np.asarray(full_mask), np.asarray(tex)[..., 3]).astype(np.uint8)))
        out = bowl_c.copy()
        hx = int(rim[0] - fw / 2)
        hy = int(rim[1] + fh_top / 2 - tall - ry * 0.05)
        out.alpha_composite(heap, (hx, hy))
        # the front lip goes back over the heap's base: the cup's pixels just under the rim line
        lip = np.asarray(bowl_c).copy()
        lip_mask = np.zeros(lip.shape[:2], bool)
        yy2, xx2 = np.mgrid[0:H, 0:W]
        inner = ((xx2 - rim[0]) / (rx * 0.94)) ** 2 + ((yy2 - rim[1]) / (ry * 0.94)) ** 2 <= 1
        lip_mask = (yy2 > rim[1]) & ~inner
        lip[..., 3] = np.where(lip_mask, lip[..., 3], 0)
        out.alpha_composite(Image.fromarray(lip, 'RGBA'))
        save(out, 'prep-' + wid)
    return meta


def _ellipse(w, h, eh):
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).ellipse((0, h - eh, w, h), fill=255)
    return m


if __name__ == '__main__':
    meta = {'glass': glass()}
    # the strips: packed rows (x0, y0, x1, y1 on the draft), well inside each slab
    band_from_strip('strips-a-draft1.png', (300, 80, 1240, 200), 'veg-01')
    band_from_strip('strips-a-draft1.png', (300, 205, 1240, 300), 'ph-chana')
    band_from_strip('strips-a-draft1.png', (300, 318, 1240, 410), 'ph-dahi')
    band_from_strip('strips-a-draft1.png', (290, 420, 1250, 525), 'ph-amli', key_white=True)
    band_from_strip('strips-a-draft1.png', (290, 585, 1250, 690), 'ph-lili', key_white=True)
    band_from_strip('strips-b-draft1.png', (250, 80, 1280, 220), 'ph-sev')
    band_from_strip('strips-b-draft1.png', (255, 290, 1280, 415), 'ph-dhana')
    band_from_strip('strips-b-draft1.png', (250, 650, 1280, 775), 'veg-02')
    band_from_strip('strips-b-draft1.png', (250, 830, 1280, 960), 'veg-03')
    # the chilli rings drew as cartoon crosses: the painted top-down slices instead
    band_from_layer('layer-marcha-chopped-t.png', 'veg-12')
    meta['prep'] = prep_bowls()
    json.dump(meta, open(os.path.join(OUT, 'meta.json'), 'w'), indent=1)
    print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk != 'inside'} for k, v in meta.items()}))
