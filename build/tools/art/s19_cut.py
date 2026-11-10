#!/usr/bin/env python3
"""Cut the S19 full run's pieces off magenta (Zafar, 10 Nov overnight: "prioritize the cutting out and processing").
Each source line in sources/art/s19-full/results/best/ is keyed (soft alpha from how magenta a pixel is), despilled (the magenta
taken back out of the edge colours), split into its objects (connected parts, ordered row by row, left to right), trimmed, and
saved as webp under assets/cook/items/v4/<game>/<name>.webp. Contact shadows drawn on the magenta are dropped: shadows are code's.
A contact sheet of every piece on a checkerboard is written for judging.
Side-on glass on the wall and marble (B1, B1f, B2) has its own cutter, glass_cut.
Usage: python3 build/tools/art/s19_cut.py [--only F4,K6] [--sheet out.jpg]
The second half (s19-wave-e2): --only K2,K6c,C5,C5-drizzle,C6,C10,C10-drizzle,S2,S4,B1,B1f,B2,B3,K4,K7 --sheet sources/art/s19-full/cuts/contact-sheet-3.jpg"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage
import cv2

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
    # K4 #101 (10 Nov, four stages; Zafar: raw, part, cooked, over): the three names corn uses keep their stage, the fourth is new
    "K4": ("corn", ["cob-raw", "cob-turned", "cob-done", "cob-over"], 900),
    "K3": ("kit", ["tray-steel"], 1000),
    # K7 #103 (10 Nov): four fried stages (raw, part, cooked, over) and the boiled halves; the part-cooked one is new
    "K7": ("eggs", ["egg-cracked", "egg-part", "egg-cooked", "egg-overdone", "egg-boiled-half-a", "egg-boiled-half-b"], 360),
    "F7": ("eggs", ["bowl-of-eggs"], 600),
    "K1": ("sekelo", ["skewer-empty"], 1000),
    # K6b (the slotted spoon alone) is left out: its light reads from the lower right (artcolour); samosa keeps K6's spoon on its cloth
    "C7": ("chaat", ["layer-tameto"], 800), "C9": ("chaat", ["layer-fudino"], 800), "C10": ("chaat", ["layer-amli"], 800),
    "C11": ("chaat", ["layer-dai"], 800), "C8": ("chaat", ["layer-marcha"], 800),
    "F3": ("chaat", ["bataato", "chana", "dungri", "tameto", "marcha", "kothmir", "sev", "lili-chutney", "amli-chutney", "dai"], 360),
    "F5": ("samosa", ["bataato", "vatana", "dungri", "marcha", "kothmir", "kheemo", "gajar", "kobi"], 360),
    "S1": ("samosa", ["sheet-top"], 900), "S3": ("samosa", ["filling"], 600),
    # the second half (run-report-2.md, 10 Nov evening): s19-wave-e2
    # K2 #98: five pieces (rows: meat, tomato, onion, pepper, potato) x four stages (columns: raw, part, cooked, over)
    "K2": ("sekelo", [f"{p}-{st}" for p in ["meat", "tomato", "onion", "pepper", "potato"] for st in ["raw", "part", "cooked", "over"]], 300),
    "K6c": ("kit", ["cloth"], 600),   # #94: the slotted spoon's folded cloth alone, its handle's dent
    "C5": ("chaat", ["layer-lili"], 800), "C5-drizzle": ("chaat", ["layer-lili-drizzle"], 800),   # #24 ribbons, #111 drizzles
    "C6": ("chaat", ["layer-dungri"], 800),   # #95
    "C10-drizzle": ("chaat", ["layer-amli-drizzle"], 800),   # #110 (C10 #39, the smears, is layer-amli above)
    "S2": ("samosa", ["sheet-under"], 900),   # #92: the round sheet's underside
    "S4": ("samosa", ["samosa-raw", "samosa-part", "samosa-cooked", "samosa-over"], 400),   # #97
    "B3": ("baking", ["tray-raw", "tray-baked"], 900),   # #87: the naan tray raw and baked
}
# side-on glass on a cream wall over white marble, not magenta (glass_cut below): line -> (game, names, max side, options)
GLASS = {
    # B1 #108: the empty bowl, flour (half), the shaggy dough; B1f #109: flour at a quarter, a half, three quarters
    "B1": ("baking", ["bowl-empty", "bowl-flour", "bowl-shaggy"], 600, "bowl"),
    "B1f": ("baking", ["bowl-flour-1", "bowl-flour-2", "bowl-flour-3"], 600, "bowl"),
    # B2 #83: the measuring jug empty, then water at a quarter, a half, three quarters, full
    "B2": ("baking", ["jug-0", "jug-1", "jug-2", "jug-3", "jug-4"], 500, "jug"),
}
# their lower outlines (below the counter's seam the marble can't be modelled), measured on the sources (rows from 3 px above the
# seam, the half-width as a share of the half-width at the seam): the bowl's taper to its foot; the jug straight, round corners
BOWL_LOW = [(3, 1.0), (22, 0.95), (42, 0.885), (62, 0.78), (82, 0.67), (97, 0.52), (104, 0.41)]
JUG_LOW = [(d, 1.0) for d in range(0, 47)] + [(47 + u, (86 - 25 + (25 ** 2 - u ** 2) ** 0.5) / 86) for u in range(0, 26)]
WHOLE = {"C5", "C5-drizzle", "C6", "C7", "C8", "C9", "C10", "C10-drizzle", "C11"}   # a topping layer is one piece made of many bits: keep the picture whole

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
    c = np.clip(rgb[y0:y1, x0:x1], 0, 255).astype(np.uint8)
    # (s19-wave-e2: a 1-2 px magenta rim stayed on yellow, orange and green pieces, the potato, the fried samosa, the drizzles, where red
    # and blue are far apart so the key reads them as food: the rim's colour is taken from the piece's own inside, its alpha kept)
    inside = ndimage.binary_erosion(a > 0.5, iterations=3)
    rim = (a > 0.01) & ~inside
    if inside.any() and rim.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~inside, return_indices=True)
        c[rim] = c[iy[rim], ix[rim]]   # (each rim pixel the colour of the nearest pixel well inside)
    im = Image.fromarray(np.dstack([c, np.clip(a * 255, 0, 255).astype(np.uint8)]), "RGBA")
    s = maxside / max(im.size)
    if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True); im.save(path, "WEBP", quality=90, method=6)
    return im

def glass_cut(path, n, foot_at, profile, handle=False):
    """Side-on glass pieces photographed on a cream wall over a white marble counter (B1, B1f, B2: not on magenta), in reading order.
    Above the counter's seam the wall is a smooth fit per row, so a pixel's alpha is how far it is from the wall (the glass is
    see-through, its rims and highlights solid) and its colour is the glass's own (the wall taken back out). Below the seam the
    marble's veins can't be modelled, so the piece is solid there inside the measured lower outline (`profile`: half-widths by row
    from 3 px above the seam, a share of the half-width at the seam; the foot `foot_at` px under the seam): the marble shows through
    as it does on the game's marble worktop, and what is in a bowl (flour, dough) stays solid. A jug's walls are taken just under the
    seam, where its handle has ended. The caustics and the shadow under the foot are left out (shadows are code's)."""
    a = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    H, W, _ = a.shape
    g = cv2.GaussianBlur(cv2.cvtColor(a, cv2.COLOR_RGB2GRAY), (0, 0), 1.2)
    m = np.hypot(cv2.Sobel(g, cv2.CV_32F, 1, 0), cv2.Sobel(g, cv2.CV_32F, 0, 1))
    # the seam: where the wall's warm cream turns to the marble's cool white (blue less red jumps), down the clear left edge
    br = (a[:, :40, 2] - a[:, :40, 0]).mean(1)
    seam = int(np.argmax(np.diff(cv2.GaussianBlur(br.reshape(-1, 1), (1, 9), 0).ravel())) + 1)
    top0 = int(H * 0.12)
    colhit = (m[top0:seam - 30] > 5).sum(0) > 4
    lab, _ = ndimage.label(ndimage.binary_closing(colhit, iterations=8))
    spans = sorted([o[0] for o in ndimage.find_objects(lab) if o[0].stop - o[0].start > 60], key=lambda o: o.start)[:n]
    clear = np.ones(W, bool)
    for o in spans: clear[max(0, o.start - 14):o.stop + 14] = False
    xs, X = np.where(clear)[0], np.arange(W)
    bg = np.zeros_like(a)
    for y in range(seam):
        for c in range(3): bg[y, :, c] = np.polyval(np.polyfit(xs, a[y, xs, c], 1), X)
    d = np.abs(a - bg).max(2)
    above = cv2.GaussianBlur(np.clip((d - 4) / 22, 0, 1), (0, 0), 1.2)
    out = []
    for o in spans:
        x0, x1 = max(0, o.start - 15), min(W, o.stop + 15)
        dd = ndimage.binary_closing(d[top0:seam - 3, x0:x1] > 10, iterations=3)
        ys = [y for y in range(top0, seam - 3) if dd[y - top0].any()]
        L = {y: np.where(dd[y - top0])[0].min() + x0 for y in ys}; R = {y: np.where(dd[y - top0])[0].max() + x0 for y in ys}
        if handle:
            yb, q = seam + 12, (x1 - x0) // 3
            el, er = x0 + int(np.argmax(m[yb, x0:x0 + q])), x1 - q + int(np.argmax(m[yb, x1 - q:x1]))
        else:
            el, er = L[ys[-1]], R[ys[-1]]   # (a bowl: its walls at the seam; what is in it is never taken for one)
        cx, hw = (el + er) / 2, (er - el) / 2
        up = cv2.convexHull(np.array([(L[y], y) for y in ys] + [(R[y], y) for y in ys], np.int32))
        low = [(int(cx - hw * k), seam - 3 + dy) for dy, k in profile] + [(int(cx + hw * k), seam - 3 + dy) for dy, k in profile]
        low = cv2.convexHull(np.array(low + [(int(cx - hw), seam - 3), (int(cx + hw), seam - 3)], np.int32))
        sil = np.zeros((H, W), np.uint8); cv2.fillConvexPoly(sil, up, 255); sil[seam - 3:] = 0; cv2.fillConvexPoly(sil, low, 255)
        sil[seam + foot_at + 1:] = 0
        sil = cv2.GaussianBlur(sil.astype(np.float32) / 255, (0, 0), 1.0)
        al = np.ones((H, W), np.float32); al[:seam] = above[:seam]
        al = np.minimum(al, sil)
        rgb = a.copy()
        k = al > 0.02; k[seam:] = False
        rgb[k] = np.clip((a[k] - (1 - al[k, None]) * bg[k]) / np.maximum(al[k, None], 0.3), 0, 255)
        yy, xx = np.where(al > 0.02)
        box = (slice(yy.min(), yy.max() + 1), slice(xx.min(), xx.max() + 1))
        out.append(np.dstack([rgb[box], al[box] * 255]).clip(0, 255).astype(np.uint8))
    return out

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
    for line, (game, names, maxside, kind) in GLASS.items():
        if only and line not in only: continue
        src = SRC + line + ".png"
        if not os.path.exists(src): print("missing", src); continue
        ps = glass_cut(src, len(names), foot_at=101 if kind == "bowl" else 68, profile=BOWL_LOW if kind == "bowl" else JUG_LOW, handle=kind == "jug")
        if len(ps) != len(names): print(f"{line}: found {len(ps)} pieces, want {len(names)}")
        for rgba, nm in zip(ps, names):
            im = Image.fromarray(rgba, "RGBA")
            s_ = maxside / max(im.size)
            if s_ < 1: im = im.resize((round(im.width * s_), round(im.height * s_)), Image.LANCZOS)
            path = f"{OUT}{game}/{nm}.webp"; os.makedirs(os.path.dirname(path), exist_ok=True); im.save(path, "WEBP", quality=90, method=6)
            done.append((f"{game}/{nm}", im))
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
