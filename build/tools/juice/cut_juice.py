"""Cut the s17-juice sheets (3x2 cells on flat grey) into sprites with alpha.

Glows and steam (SK, ST, BU): a difference key (GIMP colour-to-alpha): alpha is how far each pixel is from the cell's own
measured grey, per channel towards 0 or 255, the largest wins; the colour is un-premultiplied from the grey, so a soft halo
keeps its hue at low alpha. A small noise floor (the grey's own mottle) is subtracted and the alpha re-stretched.
Drops (TD): solid, so a normal key with a soft edge (smoothstep on the distance), the edge colour decontaminated the same way.

python3 -I cut_juice.py <sheets dir> <out dir> <contact sheet path>
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter

SRC, OUT, CONTACT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
SHEETS = [("sk", "sk-sparkle-steps-v1.webp", "glow"), ("st", "st-steam-wisps-v1.webp", "glow"),
          ("td", "td-tea-drops-v1.webp", "solid"), ("bu", "bu-gold-burst-v1.webp", "glow")]
MAXSIDE = 384  # the art plan: 256 design px, x1.5 for phones
PAD = 10


def bg_of(cell):
    # the cell's grey, from a 24 px border ring (median per channel)
    h, w, _ = cell.shape
    ring = np.concatenate([cell[:24].reshape(-1, 3), cell[-24:].reshape(-1, 3), cell[:, :24].reshape(-1, 3), cell[:, -24:].reshape(-1, 3)])
    return np.median(ring, axis=0)


def smooth_bg(cell):
    # a slowly varying grey (the sheet's mottle and vignette): median of the border ring, then a plane fitted to 4 corners
    h, w, _ = cell.shape
    b = bg_of(cell)
    corners = [np.median(cell[:64, :64].reshape(-1, 3), 0), np.median(cell[:64, -64:].reshape(-1, 3), 0),
               np.median(cell[-64:, :64].reshape(-1, 3), 0), np.median(cell[-64:, -64:].reshape(-1, 3), 0)]
    yy, xx = np.mgrid[0:h, 0:w]
    u, v = (xx / (w - 1))[..., None], (yy / (h - 1))[..., None]
    plane = (corners[0] * (1 - u) * (1 - v) + corners[1] * u * (1 - v) + corners[2] * (1 - u) * v + corners[3] * u * v)
    return plane


def key_glow(cell):
    P = cell.astype(np.float64)
    B = smooth_bg(cell)
    up = np.where(P > B, (P - B) / np.maximum(255 - B, 1), 0)
    dn = np.where(P < B, (B - P) / np.maximum(B, 1), 0)
    a = np.max(np.maximum(up, dn), axis=2)
    a = np.clip(a, 0, 1)
    # the grey's own mottle: measured on the ring, then subtracted
    h, w = a.shape
    ring = np.concatenate([a[:24].ravel(), a[-24:].ravel(), a[:, :24].ravel(), a[:, -24:].ravel()])
    floor = min(0.12, float(np.percentile(ring, 99.5)) + 0.01)
    a2 = np.clip((a - floor) / (1 - floor), 0, 1)
    a2 = np.where(a > 0, a2, 0)
    safe = np.maximum(a, 1e-4)[..., None]
    C = np.clip(B + (P - B) / safe, 0, 255)
    return C, a2, floor


def key_solid(cell):
    P = cell.astype(np.float64)
    B = smooth_bg(cell)
    d = np.max(np.abs(P - B), axis=2)
    lo, hi = 9.0, 34.0
    t = np.clip((d - lo) / (hi - lo), 0, 1)
    a = t * t * (3 - 2 * t)
    safe = np.maximum(a, 1e-3)[..., None]
    C = np.where(a[..., None] < 0.999, np.clip(B + (P - B) / np.maximum(safe, 0.35), 0, 255), P)
    return C, a, lo / 255


def checker(w, h, s=16):
    yy, xx = np.mgrid[0:h, 0:w]
    m = ((xx // s + yy // s) % 2).astype(np.float64)
    return np.stack([200 + 30 * m] * 3, axis=2)


cuts = []
for line, fname, kind in SHEETS:
    im = np.array(Image.open(os.path.join(SRC, fname)).convert("RGB"))
    H, W, _ = im.shape
    cw, ch = W // 3, H // 2
    k = 0
    for r in range(2):
        for c in range(3):
            cell = im[r * ch : (r + 1) * ch, c * cw : (c + 1) * cw]
            C, a, floor = key_glow(cell) if kind == "glow" else key_solid(cell)
            ys, xs = np.where(a > 0.02)
            if len(xs) < 40:
                print(f"{line} r{r+1}c{c+1}: empty, skipped")
                continue
            k += 1
            x0, x1 = max(0, xs.min() - PAD), min(cw, xs.max() + PAD + 1)
            y0, y1 = max(0, ys.min() - PAD), min(ch, ys.max() + PAD + 1)
            # touching the cell edge means something crossed a gutter
            edge = xs.min() < 3 or ys.min() < 3 or xs.max() > cw - 4 or ys.max() > ch - 4
            rgba = np.dstack([C, a * 255]).astype(np.uint8)[y0:y1, x0:x1]
            img = Image.fromarray(rgba, "RGBA")
            s = min(1.0, MAXSIDE / max(img.size))
            if s < 1:
                img = img.resize((max(1, round(img.size[0] * s)), max(1, round(img.size[1] * s))), Image.LANCZOS)
            name = f"{line}-{k}"
            path = os.path.join(OUT, name + ".webp")
            img.save(path, "WEBP", quality=88, alpha_quality=90, method=6)
            cuts.append((name, path, img, kind))
            print(f"{name}: cell r{r+1}c{c+1} {img.size[0]}x{img.size[1]} floor {floor:.3f} edge-touch {edge} {os.path.getsize(path)} B")

# contact sheet: every cut on dark, mid and light grounds
TILE = 200
cols = len(cuts)
grounds = [(28, 22, 18), (128, 128, 128), (251, 245, 236)]
sheet = Image.new("RGB", (TILE * 7, TILE * 3 * ((cols + 6) // 7)), (0, 0, 0))
for i, (name, path, img, kind) in enumerate(cuts):
    for g, col in enumerate(grounds):
        tile = Image.new("RGBA", (TILE, TILE), col + (255,))
        t = img.copy()
        t.thumbnail((TILE - 20, TILE - 20), Image.LANCZOS)
        tile.alpha_composite(t, ((TILE - t.size[0]) // 2, (TILE - t.size[1]) // 2))
        row = (i // 7) * 3 + g
        sheet.paste(tile.convert("RGB"), ((i % 7) * TILE, row * TILE))
sheet.save(CONTACT)
print("contact", CONTACT, sheet.size)
