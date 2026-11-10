#!/usr/bin/env python3
"""Cut the S19 full run's pieces off magenta (Zafar, 10 Nov overnight: "prioritize the cutting out and processing").
Each source line in sources/art/s19-full/results/best/ is keyed (soft alpha from how magenta a pixel is), despilled (the magenta
taken back out of the edge colours), split into its objects (connected parts, ordered row by row, left to right), trimmed, and
saved as webp under assets/cook/items/v4/<game>/<name>.webp. Contact shadows drawn on the magenta are dropped: shadows are code's.
A contact sheet of every piece on a checkerboard is written for judging.
Usage: python3 build/tools/art/s19_cut.py [--only F4,K6] [--sheet out.jpg]"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

SRC = "sources/art/s19-full/results/best/"
MINI = "sources/art/s19-mini/results/"
OUT = "assets/cook/items/v4/"
# line -> (game, names in reading order, max side in px)
LINES = {
    "F4": ("daar", ["jeeru", "rai", "hardar", "loon", "lal-marcha", "lasan", "lila-marcha", "elchi"], 360),
    "K6": ("kit", ["ladle", "slotted-spoon-cloth", "knife"], 700),
    "F6": ("maani", ["dough-wheat", "dough-millet"], 420),
    "K5": ("kit", ["plate-steel", "plate-cream"], 640),
    "P1": ("chop", ["bataato-whole", "bataato-half-a", "bataato-half-b", "dungri-whole", "dungri-half-a", "dungri-half-b",
                    "tameto-whole", "tameto-half-a", "tameto-half-b"], 360),
    "P2": ("chop", ["marcha-whole", "marcha-half-a", "marcha-half-b", "lasan-whole", "lasan-half-a", "lasan-half-b",
                    "adu-whole", "adu-half-a", "adu-half-b"], 360),
    "K4": ("corn", ["cob-raw", "cob-turned", "cob-done"], 900),
    "K3": ("kit", ["tray-steel"], 1000),
    "K7": ("eggs", ["egg-cracked", "egg-cooked", "egg-overdone", "egg-boiled-half-a", "egg-boiled-half-b"], 360),
    "F7": ("eggs", ["bowl-of-eggs"], 600),
    "K1": ("sekelo", ["skewer-empty"], 1000),
    # K6b (the slotted spoon alone) is left out: its light reads from the lower right (artcolour); samosa keeps K6's spoon on its cloth
    "C7": ("chaat", ["layer-tameto"], 800), "C9": ("chaat", ["layer-fudino"], 800), "C10": ("chaat", ["layer-amli"], 800),
    "C11": ("chaat", ["layer-dai"], 800), "C8": ("chaat", ["layer-marcha"], 800),
    "F3": ("chaat", ["bataato", "chana", "dungri", "tameto", "marcha", "kothmir", "sev", "lili-chutney", "amli-chutney", "dai"], 360),
    "F5": ("samosa", ["bataato", "vatana", "dungri", "marcha", "kothmir", "kheemo", "gajar", "kobi"], 360),
    "S1": ("samosa", ["sheet-top"], 900), "S3": ("samosa", ["filling"], 600),
}
WHOLE = {"C7", "C8", "C9", "C10", "C11"}   # a topping layer is one piece made of many bits: keep the picture whole

def alpha_of(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g                         # how magenta: both red and blue well above green
    bal = 1 - np.clip(np.abs(r - b) / 90.0, 0, 1)    # and red close to blue (a red chilli or a pink onion is not)
    score = m * bal
    return np.clip((150 - score) / 90.0, 0, 1)       # score <= 60: solid; >= 150: background

def despill(a, al):
    out = a.copy()
    k = (al > 0) & (al < 1)
    M = np.array([255.0, 0, 255.0])
    est = (a[k] - (1 - al[k, None]) * M) / np.maximum(al[k, None], 0.15)
    out[k] = np.clip(est, 0, 255)
    # any leftover pink cast at the rim: red and blue no higher than the brighter of green and their own mean
    r, g, b = out[..., 0], out[..., 1], out[..., 2]
    over = (np.minimum(r, b) - g) > 40
    edge = al < 0.98
    fix = over & edge
    avg = (r + g + b) / 3
    out[fix, 0] = np.minimum(r[fix], np.maximum(g[fix] + 40, avg[fix]))
    out[fix, 2] = np.minimum(b[fix], np.maximum(g[fix] + 40, avg[fix]))
    return out

def pieces(al, n):
    lab, k = ndimage.label(al > 0.5)
    if k == 0: return []
    sizes = ndimage.sum(np.ones_like(al), lab, range(1, k + 1))
    keep = [i + 1 for i in np.argsort(-sizes) if sizes[i] > al.size * 0.0015]
    boxes = [ndimage.find_objects((lab == i).astype(int))[0] for i in keep]
    # merge parts whose boxes overlap (a ball heap's crumbs, a cloth under a handle)
    items = [[i, b] for i, b in zip(keep, boxes)]
    merged = True
    while merged and len(items) > n:
        merged = False
        for x in range(len(items)):
            for y in range(x + 1, len(items)):
                (ia, ba), (ib, bb) = items[x], items[y]
                if ba[0].start < bb[0].stop and bb[0].start < ba[0].stop and ba[1].start < bb[1].stop and bb[1].start < ba[1].stop:
                    items[x] = [ia if isinstance(ia, list) else [ia], None]
                    items[x][0] = (ia if isinstance(ia, list) else [ia]) + (ib if isinstance(ib, list) else [ib])
                    items[x][1] = (slice(min(ba[0].start, bb[0].start), max(ba[0].stop, bb[0].stop)), slice(min(ba[1].start, bb[1].start), max(ba[1].stop, bb[1].stop)))
                    items.pop(y); merged = True; break
            if merged: break
    items = items[:n] if len(items) >= n else items
    # reading order: rows by centre y (tolerance half the median height), then x
    hs = np.median([b[0].stop - b[0].start for _, b in items])
    items.sort(key=lambda it: ((it[1][0].start + it[1][0].stop) / 2, (it[1][1].start + it[1][1].stop) / 2))
    rows, cur = [], []
    for it in items:
        cy = (it[1][0].start + it[1][0].stop) / 2
        if cur and abs(cy - (cur[0][1][0].start + cur[0][1][0].stop) / 2) > hs * 0.5: rows.append(cur); cur = []
        cur.append(it)
    if cur: rows.append(cur)
    out = []
    for r in rows: out += sorted(r, key=lambda it: it[1][1].start)
    return [(lab, it[0] if isinstance(it[0], list) else [it[0]], it[1]) for it in out]

def save(rgb, al, box, ids, lab, path, maxside, pad=6):
    y0, y1 = max(0, box[0].start - pad), min(al.shape[0], box[0].stop + pad)
    x0, x1 = max(0, box[1].start - pad), min(al.shape[1], box[1].stop + pad)
    mask = np.isin(lab[y0:y1, x0:x1], ids) if ids is not None else np.ones((y1 - y0, x1 - x0), bool)
    # keep soft edges near the piece, drop other pieces' pixels in the box
    near = ndimage.binary_dilation(mask, iterations=3)
    a = al[y0:y1, x0:x1] * near
    im = Image.fromarray(np.dstack([rgb[y0:y1, x0:x1], a * 255]).astype(np.uint8), "RGBA")
    s = maxside / max(im.size)
    if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True); im.save(path, "WEBP", quality=90, method=6)
    return im

def main():
    only = None; sheet = "sources/art/s19-full/cuts/contact-sheet.jpg"
    for i, x in enumerate(sys.argv):
        if x == "--only": only = sys.argv[i + 1].split(",")
        if x == "--sheet": sheet = sys.argv[i + 1]
    done = []
    for line, (game, names, maxside) in LINES.items():
        if only and line not in only: continue
        src = SRC + line + ".png"
        if not os.path.exists(src): print("missing", src); continue
        a = np.asarray(Image.open(src).convert("RGB")).astype(float)
        al = alpha_of(a); rgb = despill(a, al)
        if line in WHOLE:
            ys, xs = np.where(al > 0.5)
            box = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
            im = save(rgb, al, box, None, None, f"{OUT}{game}/{names[0]}.webp", maxside); done.append((f"{game}/{names[0]}", im)); continue
        ps = pieces(al, len(names))
        if len(ps) != len(names): print(f"{line}: found {len(ps)} pieces, want {len(names)}")
        for (lab, ids, box), nm in zip(ps, names):
            im = save(rgb, al, box, ids, lab, f"{OUT}{game}/{nm}.webp", maxside); done.append((f"{game}/{nm}", im))
    # the contact sheet on a checkerboard and on chai's black glass, so a fringe shows on both
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    cell = 220; cols = 6; rows = (len(done) + cols - 1) // cols
    S = Image.new("RGB", (cols * cell, rows * (cell + 20)), (255, 255, 255)); d = ImageDraw.Draw(S)
    for i, (nm, im) in enumerate(done):
        x, y = (i % cols) * cell, (i // cols) * (cell + 20)
        bg = Image.new("RGB", (cell, cell), (30, 30, 32)) if i % 2 else Image.new("RGB", (cell, cell), (236, 233, 228))
        t = im.copy(); t.thumbnail((cell - 10, cell - 10)); bg.paste(t, ((cell - t.width) // 2, (cell - t.height) // 2), t)
        S.paste(bg, (x, y + 20)); d.text((x + 3, y + 2), nm, fill=(0, 0, 0), font=f)
    S.save(sheet, quality=85); print("pieces", len(done), "sheet", sheet)

if __name__ == "__main__":
    main()
