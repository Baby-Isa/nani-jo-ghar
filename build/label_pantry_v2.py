"""Put the labels on the pantry v2 containers (docs/archive/art-prompts/chatgpt-art-prompts-pantry-jars.md, "Putting the
labels on"): the item's icon on the blank sticker, the sticker at one fixed anchor per container
type, bent a little on round containers and shaded to the container's light.

python3 build/label_pantry_v2.py [P-number ...]   writes assets/cook/items/shelf-<id>-f.webp
python3 build/label_pantry_v2.py --preview 2 out.png   only a test sheet, bare vs labelled"""
import sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, 'build')
from cut_pantry_v2 import ids_from_doc

ITEMS = 'assets/cook/items/'
# P-number -> label centre (fractions of the container's box, x and y), diameter (fraction of
# the box height), round (bend it to the curve)
ANCHOR = {
    1: (0.5, 0.60, 0.34, True),
    2: (0.5, 0.62, 0.42, False),
    3: (0.5, 0.64, 0.30, True),
    4: (0.5, 0.60, 0.46, True),
    5: (0.5, 0.80, 0.34, False),
    6: (0.5, 0.80, 0.34, False),
    7: (0.5, 0.58, 0.40, False),
}
ICON_FILL = 0.70  # the icon's longer side, as a share of the sticker's diameter


def label(gid, d):
    st = Image.open(ITEMS + 'sticker-blank.webp').convert('RGBA').resize((d, d), Image.LANCZOS)
    ic = Image.open(ITEMS + f'icon-{gid}.webp').convert('RGBA')
    ic = ic.crop(ic.getbbox())
    k = ICON_FILL * d / max(ic.size)
    ic = ic.resize((max(1, round(ic.width * k)), max(1, round(ic.height * k))), Image.LANCZOS)
    st.alpha_composite(ic, ((d - ic.width) // 2, (d - ic.height) // 2))
    return st


def bend(im):
    """Squeeze towards the left and right edges, as if wrapped round a cylinder."""
    a = np.asarray(im).astype(float)
    w = a.shape[1]
    x = (np.arange(w) + 0.5) / w * 2 - 1           # -1..1 across the label on the jar
    src = np.sin(x * np.pi / 2 * 0.8) / np.sin(np.pi / 2 * 0.8)  # where it comes from on the flat label
    cols = np.clip(((src + 1) / 2 * w - 0.5).round().astype(int), 0, w - 1)
    return Image.fromarray(a[:, cols].astype(np.uint8), 'RGBA')


def shade(im, rnd):
    """Warm light from the upper left: a gentle fall-off to the lower right, stronger at the
    edges of a round container, and a hairline soft edge."""
    a = np.asarray(im).astype(float)
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    g = 1.0 - 0.10 * ((xx / w) + (yy / h)) / 2
    if rnd:
        g *= 1.0 - 0.18 * np.abs((xx + 0.5) / w * 2 - 1) ** 3
    a[..., :3] *= g[..., None]
    out = Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA')
    al = out.getchannel('A').filter(ImageFilter.GaussianBlur(0.6))
    out.putalpha(al)
    return out


def labelled(p, gid):
    bare = Image.open(ITEMS + f'shelf-{gid}-bare-f.webp').convert('RGBA')
    x0, y0, x1, y1 = bare.getbbox()
    cx, cy, dd, rnd = ANCHOR[p]
    d = round(dd * (y1 - y0))
    lb = label(gid, d)
    if rnd:
        lb = bend(lb)
    lb = shade(lb, rnd)
    out = bare.copy()
    out.alpha_composite(lb, (round(x0 + cx * (x1 - x0) - d / 2), round(y0 + cy * (y1 - y0) - d / 2)))
    return bare, out


if __name__ == '__main__':
    ids = ids_from_doc()
    if sys.argv[1:2] == ['--preview']:
        p, dest = int(sys.argv[2]), sys.argv[3]
        pairs = [labelled(p, g) for g in ids[p]]
        W, H = pairs[0][0].size
        # full size (bare over labelled), then laptop (~96 px tall) and phone (~48 px) strips
        sizes = [1.0, 96 / H, 48 / H]
        rows = []
        for s in sizes:
            for which in (0, 1):
                rows.append([im[which].resize((round(W * s), round(H * s)), Image.LANCZOS) for im in pairs])
        CW = W * 9
        CH = sum(r[0].height + 8 for r in rows)
        c = Image.new('RGB', (CW, CH), (207, 137, 71))
        y = 0
        for r in rows:
            for i, im in enumerate(r):
                c.paste(im, (i * (im.width + 6), y), im)
            y += r[0].height + 8
        c.save(dest)
    else:
        for p in [int(a) for a in sys.argv[1:]] or range(1, 8):
            for g in ids[p]:
                labelled(p, g)[1].save(ITEMS + f'shelf-{g}-f.webp', quality=92, method=6)
            print('P%d labelled' % p)
