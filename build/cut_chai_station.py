"""Cut the chai station's filed art (sources/art/chatgpt-batch3/) into transparent webps,
on build/cut_tick_v2.py's method (docs/archive/process/VISUAL-QA.md s2):

- the background is measured from the image's edges;
- solid things (the tray, the knobs): everything not connected to the flat grey, holes
  filled, largest piece; an eroded core is alpha 1 and the edge uses colour-to-alpha
  against the background, so no grey fringe;
- clear glass (the chai glass): colour-to-alpha throughout, with only its metal rim band
  solid, so the tray and the chai show through the glass;
- flames: pure colour-to-alpha (a glow has no solid core).
States of one object share one canvas registered to the object (knob off/on; the two
flame rings at one scale, so the low ring is really smaller).

Writes assets/cook/items/chai-station/{tray,glass,knob-off,knob-on,flame-high,flame-low}.webp.
Run from the repo root: python3 build/cut_chai_station.py"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'sources/art/chatgpt-batch3/'
OUT = 'assets/cook/items/chai-station/'


def load(name):
    a = np.asarray(Image.open(SRC + name).convert('RGB')).astype(float)
    edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    return a, np.median(edge, 0)


def c2a(c, bg):
    up = np.where(c > bg, (c - bg) / (255 - bg), (bg - c) / bg)
    return np.clip(up.max(2), 0, 1)


def solid(c, bg):
    """cut_tick_v2.cut(glow=False): the object solid, its edge colour-to-alpha."""
    d = np.abs(c - bg).max(2)
    lab, _ = ndi.label(d < 8)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ndi.binary_fill_holes(~np.isin(lab, list(border)))
    lb, _ = ndi.label(obj)
    obj = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
    core = ndi.binary_erosion(obj, iterations=3)
    alpha = np.where(ndi.binary_dilation(obj, iterations=2), c2a(c, bg), 0)
    alpha = np.clip((alpha - 0.03) / 0.97, 0, 1)
    alpha = np.where(core, 1.0, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(core[..., None], c, np.clip((c - bg) / safe + bg, 0, 255))
    ys, xs = np.nonzero(obj)
    return np.dstack([rgb, alpha * 255]).astype(np.uint8), (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


def glow(c, bg):
    """A flame ring: colour-to-alpha everywhere (a faint noise floor cut away)."""
    alpha = np.clip((c2a(c, bg) - 0.04) / 0.96, 0, 1)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.clip((c - bg) / safe + bg, 0, 255)
    m = alpha > 0.05
    ys, xs = np.nonzero(m)
    return np.dstack([rgb, alpha * 255]).astype(np.uint8), (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


def glass(c, bg, rim=((624, 389, 238, 147), (624, 388, 212, 101))):
    """The chai glass: colour-to-alpha everywhere (smooth, no blotchy solid patches), a faint
    floor so the whole glass reads on the tray, and its metal rim band (between the two
    ellipses, measured on the source) solid, feathered over 1.5 px."""
    d = np.abs(c - bg).max(2)
    lab, _ = ndi.label(d < 8)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ndi.binary_fill_holes(~np.isin(lab, list(border)))
    lb, _ = ndi.label(obj)
    obj = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
    yy, xx = np.mgrid[:c.shape[0], :c.shape[1]].astype(float)
    def inside(e):
        cx, cy, rx, ry = e
        return 1 - np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    k = 1.5 / 200
    band = np.clip(inside(rim[0]) / k, 0, 1) * np.clip(-inside(rim[1]) / k, 0, 1)
    soft = ndi.gaussian_filter(obj.astype(float), 1.2)
    alpha = np.clip(c2a(c, bg) * 1.5, 0, 1)
    alpha = np.maximum(alpha, 0.1 * soft) * np.clip(soft * 1.4, 0, 1)
    alpha = np.maximum(alpha, band)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.clip((c - bg) / safe + bg, 0, 255)
    rgb = rgb * (1 - band[..., None]) + c * band[..., None]
    ys, xs = np.nonzero(obj)
    return np.dstack([rgb, alpha * 255]).astype(np.uint8), (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


def fit(img, box, size, pad=0.02):
    """Crop to the object, fit into size (w, h) keeping its shape, centred."""
    im = Image.fromarray(img, 'RGBA').crop(box)
    W, H = size
    s = min(W * (1 - 2 * pad) / im.width, H * (1 - 2 * pad) / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    cv = Image.new('RGBA', size, (0, 0, 0, 0))
    cv.alpha_composite(im, ((W - im.width) // 2, (H - im.height) // 2))
    return cv


def shared(parts, size, pad=0.03):
    """Several states on one canvas: one scale (the biggest fills it), each centred on its own box."""
    mw = max(b[2] - b[0] for _, b in parts)
    mh = max(b[3] - b[1] for _, b in parts)
    s = min(size[0] * (1 - 2 * pad) / mw, size[1] * (1 - 2 * pad) / mh)
    out = []
    for img, b in parts:
        im = Image.fromarray(img, 'RGBA').crop(b)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        cv = Image.new('RGBA', size, (0, 0, 0, 0))
        cv.alpha_composite(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
        out.append(cv)
    return out


def main():
    a, bg = load('tray-chai-t-v2.png')
    fit(*solid(a, bg), (720, 720)).save(OUT + 'tray.webp', quality=90, method=6)
    a, bg = load('vessel-glass-chai-top-t-v1.png')
    img, box = glass(a, bg)
    g = fit(img, box, (300, 400), pad=0.01)
    g.save(OUT + 'glass.webp', quality=92, method=6)
    a, bg = load('sheet-hob-parts-t-v1.png')
    H, W = a.shape[:2]
    my, mx = int(H * 0.44), W // 2
    koff = solid(a[:my, :mx], bg)
    kon = solid(a[:my, mx:], bg)
    for im, n in zip(shared([koff, kon], (320, 320)), ['knob-off', 'knob-on']):
        im.save(OUT + n + '.webp', quality=92, method=6)
    fh = glow(a[my:, :mx], bg)
    fl = glow(a[my:, mx:], bg)
    for im, n in zip(shared([fh, fl], (512, 512), pad=0.01), ['flame-high', 'flame-low']):
        im.save(OUT + n + '.webp', quality=92, method=6)
    print('chai station art ok')


if __name__ == '__main__':
    main()
