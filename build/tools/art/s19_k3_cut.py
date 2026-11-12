#!/usr/bin/env python3
"""Cut the S19 fixes run (s19-k3, 11 Nov; docs/design-language/art-plans/s19-k3-art-plan.md) off magenta, after s19_k2_cut.py.
Zafar's picks (sources/art/s19-k3/results/picks-sheet.jpg): B5r-3 the four jugs, B6-2 the three jars, D4-2 the onion golden and raw,
C12-3 chaat's three scatters, K10-2 sekelo's steel tray, K8r-2 the karahi, G1r-2 the grill, KF-6 the kitchen.

The magenta is never exact (#EC-#FA, green 0-44): each picture's own ground colour is its median border pixel.
- Solid pieces: s19_cut.py's key (alpha_of), despilled against the picture's own ground, then edge_bleed's clean edge.
- Glass (the jugs, the jars): a linear colour-difference key, alpha = 1 - (how magenta) / (the ground's magenta), so the glass is
  see-through where the magenta showed through it (the handles, the walls, the neck), its colour unmixed from the ground and any
  pink left taken out; no edge_bleed (the soft pixels are the glass). Opaque contents and lids stay solid.
- The tray (K10) is made 3:1 by cutting its straight middle out (as pan-steel-short was made), the seam on the plain brushing.
- The grill (G1r) is cut tight and brought to today's grill.webp width (1621); its far and near rims and coal bed are measured.
- The karahi (K8r): the rim's circle and the oil's, measured as samosa's meta (cx, cy of w and h; r of w; oil = oil r / rim r).
- The kitchen (KF-6): as s19-serve2 made KG: LANCZOS to 2100x1575, UnsharpMask(1.2, 40, 3) (fitted on KG -> today's file: the
  least difference), webp q84; the island's back edge measured as there (the strongest step up into the marble, rows 1000-1120,
  the median of columns 300-1800). --kitchen also writes a side-by-side and marble crops of today's file and the new one.
Writes the contact sheet (every cut on a dark and a light ground) to sources/art/s19-k3/results/cut-sheet.jpg and the numbers to
sources/art/s19-k3/results/cut-numbers.json.
ART-78 (12 Nov): ST recuts the stone shelf band (kit/tray-stone) from the tray-pot run's T1 on its own canvas (NJG_SOURCES: where
sources/ lives, for a sparse checkout); its sheet is cut-sheet-stone.jpg.
Usage: python3 build/tools/art/s19_k3_cut.py [--only B5r,B6,D4,C12,K10,K8r,G1r,KF,ST]"""
import os, sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
from s19_cut import alpha_of
from edge_bleed import bleed, pink_share

SRC = "sources/art/s19-k3/results/raw/s19-k3-"
RES = "sources/art/s19-k3/results/"
OUT = "assets/cook/items/v4/"
Q = dict(quality=90, method=6, exact=True)


def load(pick):
    a = np.asarray(Image.open(SRC + pick + ".png").convert("RGB")).astype(float)
    e = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
    return a, np.median(e, 0)


def despill(a, al, bg):
    """s19_cut.despill against the picture's own ground (not #FF00FF), then any pink cast left at the rim taken out."""
    out = a.copy()
    k = (al > 0) & (al < 1)
    out[k] = np.clip((a[k] - (1 - al[k, None]) * bg) / np.maximum(al[k, None], 0.15), 0, 255)
    r, g, b = out[..., 0], out[..., 1], out[..., 2]
    fix = ((np.minimum(r, b) - g) > 40) & (al < 0.98)
    avg = (r + g + b) / 3
    out[fix, 0] = np.minimum(r[fix], np.maximum(g[fix] + 40, avg[fix]))
    out[fix, 2] = np.minimum(b[fix], np.maximum(g[fix] + 40, avg[fix]))
    return out


def glass_key(a, bg):
    """Glass on magenta: alpha from how much of the ground's magenta shows (linear), colour unmixed; no pink left."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = ndimage.gaussian_filter(np.minimum(r, b) - g, 0.7)
    mbg = min(bg[0], bg[2]) - bg[1]
    bal = 1 - np.clip((np.abs(r - b) - 30) / 90.0, 0, 1)   # red far from blue is never the ground (a walnut lid, a warm flour)
    al = np.clip(1 - np.clip(m - 12, 0, None) * bal / (mbg - 40), 0, 1)
    al[al < 0.04] = 0
    out = a.copy()
    k = (al > 0) & (al < 1)
    out[k] = np.clip((a[k] - (1 - al[k, None]) * bg) / np.maximum(al[k, None], 0.06), 0, 255)
    # no pink left in the glass: red and blue no higher than green + 6 where the pixel is see-through or near it
    R, G, B = out[..., 0], out[..., 1], out[..., 2]
    soft = al < 0.995
    cap = G + 6
    out[..., 0] = np.where(soft, np.minimum(R, cap), R)
    out[..., 2] = np.where(soft, np.minimum(B, cap), B)
    # and the solid glass edges' faint lavender (the ground through thick glass, under the key's threshold): grey-violet pixels
    # (red and blue a little over green, close to each other) brought to green + 4; the warm contents and lids have blue under green
    R, G, B = out[..., 0], out[..., 1], out[..., 2]
    lav = ((np.minimum(R, B) - G) > 4) & (np.abs(R - B) < 40)
    out[..., 0] = np.where(lav, np.minimum(R, G + 4), R)
    out[..., 2] = np.where(lav, np.minimum(B, G + 4), B)
    # clear glass: its see-through pixels made grey (the cap above can leave a faint green; the glass has no colour of its own)
    grey = out.mean(2, keepdims=True)
    k = (al < 0.98)[..., None]
    out = np.where(k, grey + (out - grey) * 0.2, out)
    return out, al


def objects(al, n, thr=0.5, min_share=0.0015):
    """The n largest parts of the picture, each with the small bits whose box lies inside it (crumbs, a glass rim's speck)."""
    lab, k = ndimage.label(ndimage.binary_closing(al > thr, iterations=2))
    boxes = ndimage.find_objects(lab)
    sizes = ndimage.sum(np.ones_like(al), lab, range(1, k + 1))
    order = [i for i in np.argsort(-sizes) if sizes[i] > al.size * min_share][:n]
    out = []
    for i in order:
        b = boxes[i]; ids = [i + 1]
        for j in range(k):
            if j == i or j in order: continue
            c = boxes[j]
            if c[0].start >= b[0].start - 4 and c[0].stop <= b[0].stop + 4 and c[1].start >= b[1].start - 4 and c[1].stop <= b[1].stop + 4:
                ids.append(j + 1)
        out.append((lab, ids, b))
    out.sort(key=lambda t: (t[2][1].start + t[2][1].stop) / 2)   # left to right
    return out


def crop(rgb, al, box, lab=None, ids=None, pad=4, keep_near=3):
    y0, y1 = max(0, box[0].start - pad), min(al.shape[0], box[0].stop + pad)
    x0, x1 = max(0, box[1].start - pad), min(al.shape[1], box[1].stop + pad)
    a = al[y0:y1, x0:x1].copy()
    if lab is not None:
        mask = np.isin(lab[y0:y1, x0:x1], ids)
        a *= ndimage.binary_dilation(mask, iterations=keep_near)
    c = np.clip(rgb[y0:y1, x0:x1], 0, 255)
    return np.dstack([c, a * 255]).clip(0, 255).astype(np.uint8)


def tight(rgba, thr=8, pad=2):
    ys, xs = np.where(rgba[..., 3] > thr)
    return rgba[max(0, ys.min() - pad):ys.max() + 1 + pad, max(0, xs.min() - pad):xs.max() + 1 + pad]


def rim_from_inside(rgba):
    """s19_cut.save's rim fix: a soft pixel's colour from the nearest pixel well inside (a 1-2 px magenta rim on warm pieces)."""
    a = rgba[..., 3] / 255.0
    inside = ndimage.binary_erosion(a > 0.5, iterations=3)
    rim = (a > 0.01) & ~inside
    if inside.any() and rim.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~inside, return_indices=True)
        rgba = rgba.copy(); rgba[rim, :3] = rgba[iy[rim], ix[rim], :3]
    return rgba


def edge_pink(rgba, depth=4, strong=12):
    """A pink cast at a piece's outer edge (the raw onion's shaded edges, translucent over the magenta: min(r,b) - g over 15, red near
    blue) within `depth` px of the edge takes the colour of the nearest clean pixel; a pink stripe deeper in (an onion's skin) stays."""
    a = rgba.astype(float); r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    d = ndimage.distance_transform_edt(al > 128)
    m = np.minimum(r, b) - g
    # (and the ground itself, shaded, showing through a gap low in a heap: strongly magenta, up to `strong` px in)
    pk = ((((m > 15) & (d <= depth)) & (np.abs(r - b) < 70)) | ((m > 60) & (d <= strong) & (np.abs(r - b) < 85))) & (al > 0)
    clean = (al > 200) & ~pk & (d > 1)
    if not pk.any() or not clean.any(): return rgba
    _, (iy, ix) = ndimage.distance_transform_edt(~clean, return_indices=True)
    out = rgba.copy(); out[pk, :3] = rgba[iy[pk], ix[pk], :3]
    return out


def fill_clear(rgba):
    """The clear pixels' colour (kept by exact=True) set to the nearest visible pixel's: WebP's half-resolution colour would
    otherwise carry the ground's magenta, kept under alpha 0, into the rim."""
    a = np.asarray(rgba).copy(); vis = a[..., 3] > 0
    if vis.all() or not vis.any(): return a
    _, (iy, ix) = ndimage.distance_transform_edt(~vis, return_indices=True)
    a[~vis, :3] = a[iy[~vis], ix[~vis], :3]
    return a


def write(rgba, path, maxside=None, glass=False, w=None, size=None):
    if not glass: rgba = edge_pink(rgba)
    im = Image.fromarray(rgba, "RGBA")
    if size: im = im.resize(size, Image.LANCZOS)
    elif w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    elif maxside and max(im.size) > maxside:
        s = maxside / max(im.size); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    if not glass: im = Image.fromarray(edge_pink(np.asarray(im)), "RGBA")   # (again after the resample: it mixes the rim anew)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    a = np.asarray(im)
    if not glass: a = bleed(a)   # edge_bleed: the soft edge takes the piece's own colour (glass keeps its soft pixels: edge_bleed.SKIP)
    Image.fromarray(fill_clear(a), "RGBA").save(path, "WEBP", **Q)
    return path


DONE, NUM = [], {}


# ---------------- the jugs (B5r-3): flour, milk, sugar, yoghurt, glass, one shared box so they swap in place ----------------
def jugs():
    a, bg = load("B5r-3")
    rgb, al = glass_key(a, bg)
    obs = objects(al, 4, thr=0.3)
    names = ["jug-flour", "jug-milk", "jug-sugar", "jug-yoghurt"]
    pieces = [tight(crop(rgb, al, b, lab, ids)) for lab, ids, b in obs]
    H = max(p.shape[0] for p in pieces); W = max(p.shape[1] for p in pieces)
    for p, nm in zip(pieces, names):
        c = np.zeros((H, W, 4), np.uint8); y = H - p.shape[0]; x = (W - p.shape[1]) // 2
        c[y:y + p.shape[0], x:x + p.shape[1]] = p   # bottom-aligned, centred
        path = write(c, f"{OUT}baking/{nm}.webp", maxside=500, glass=True)
        DONE.append(path)
        q = np.asarray(Image.open(path).convert("RGBA")).astype(float); h = q.shape[0]
        # the fill: rows where the middle third is opaque cream (the contents); its top and the inner floor, from the top
        mid = q[:, q.shape[1] // 5: q.shape[1] * 3 // 5]
        op = (mid[..., 3] > 240).mean(1) > 0.9
        top = int(np.where(op)[0].min())
        Lm = mid[..., :3].mean(2).mean(1)
        floor = top + int(np.argmax(Lm[top:] < 180))   # (the inside's floor: the dark line where the contents meet the thick base)
        t, f = top / h, floor / h
        NUM[nm] = {"size": [q.shape[1], h], "fillTop": round(t, 3), "floor": round(f, 3),
                   "lineAt": {k: round(f - i * (f - t) / 5, 3) for i, k in zip(range(1, 6), ("1", "2", "4", "6", "10"))}}


# ---------------- the jars (B6-2): flour (tall), sugar, salt (short), glass, walnut lids ----------------
def jars():
    a, bg = load("B6-2")
    rgb, al = glass_key(a, bg)
    obs = objects(al, 3, thr=0.3)
    names = ["jar-flour", "jar-sugar", "jar-salt"]
    ps = [tight(crop(rgb, al, b, lab, ids)) for lab, ids, b in obs]
    hs = [p.shape[0] for p in ps]
    k = 600 / max(hs)   # one scale for the three, so their heights stay told apart in pixels too
    for p, nm in zip(ps, names):
        path = write(p, f"{OUT}baking/{nm}.webp", glass=True, size=(round(p.shape[1] * k), round(p.shape[0] * k))); DONE.append(path)
        im = Image.open(path); NUM[nm] = {"size": list(im.size), "srcHeight": p.shape[0]}
    for nm, h in zip(names, hs): NUM[nm]["heightShare"] = round(h / hs[0], 3)


# ---------------- the onion (D4-2): golden on the left, raw on the right; a heap and six loose pieces each ----------------
def onion():
    a, bg = load("D4-2")
    al = alpha_of(a)
    # the ground seen through a gap low in the raw heap, shaded to a red-magenta the key reads as onion (r - b up to 100): clear it
    # (a raw onion's own pink lines are paler: min(r, b) - g under 50)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    gap = ndimage.binary_dilation(((np.minimum(r, b) - g) > 55) & (np.abs(r - b) < 100) & (b > 110), iterations=1)
    al[gap] = np.minimum(al[gap], 0.0)
    rgb = despill(a, al, bg)
    W = a.shape[1]
    for side, (x0, x1), tag in (("golden", (0, W // 2), "-golden"), ("raw", (W // 2, W), "")):
        sal = np.zeros_like(al); sal[:, x0:x1] = al[:, x0:x1]
        lab, k = ndimage.label(sal > 0.5)
        sizes = ndimage.sum(np.ones_like(al), lab, range(1, k + 1)); boxes = ndimage.find_objects(lab)
        big = int(np.argmax(sizes))
        hb = boxes[big]
        # the heap: the biggest part and every bit inside its box; the loose pieces: the six next biggest outside it
        inbox = [j + 1 for j in range(k) if boxes[j][0].start >= hb[0].start and boxes[j][0].stop <= hb[0].stop and boxes[j][1].start >= hb[1].start and boxes[j][1].stop <= hb[1].stop]
        loose = [j for j in np.argsort(-sizes) if (j + 1) not in inbox and sizes[j] > 400][:6]
        loose.sort(key=lambda j: np.arctan2((boxes[j][0].start + boxes[j][0].stop) / 2 - (hb[0].start + hb[0].stop) / 2, (boxes[j][1].start + boxes[j][1].stop) / 2 - (hb[1].start + hb[1].stop) / 2))
        heap = rim_from_inside(tight(crop(rgb, al, hb, lab, inbox)))
        p = write(heap, f"{OUT}daar/chop-heap-onion{tag}.webp", maxside=477); DONE.append(p)
        NUM[f"chop-heap-onion{tag}"] = {"size": list(Image.open(p).size)}
        for n, j in enumerate(loose, 1):
            pc = rim_from_inside(tight(crop(rgb, al, boxes[j], lab, [j + 1])))
            p = write(pc, f"{OUT}daar/chop-piece-onion{tag}-{n}.webp", maxside=160); DONE.append(p)
        NUM[f"chop-piece-onion{tag}"] = {"pieces": len(loose)}
        # and the whole panel (heap and its six pieces where they lie), for a board that wants them scattered
        ys, xs = np.where(sal > 0.5); box = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
        p = write(rim_from_inside(tight(crop(rgb, sal, box))), f"{OUT}daar/chop-scatter-onion{tag}.webp", maxside=700); DONE.append(p)


# ---------------- chaat's scatters (C12-3): potato cubes, chickpeas, sev, each kept whole as the other layers ----------------
def scatters():
    a, bg = load("C12-3")
    al = alpha_of(a)
    # the ground in the small gaps where strands cross, mixed with the sev's orange into a red-pink the key reads as food: potato,
    # chickpeas and sev are all warm (blue well under green), so blue over green is the magenta: alpha falls with it
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    al = np.minimum(al, np.clip(1 - (b - g - 5) / 40.0, 0, 1))
    rgb = despill(a, al, bg)
    cols = (al > 0.5).any(0)
    lab, k = ndimage.label(ndimage.binary_closing(cols, iterations=40))
    spans = sorted([o[0] for o in ndimage.find_objects(lab) if o[0].stop - o[0].start > 80], key=lambda o: o.start)
    assert len(spans) == 3, spans
    for sp, nm in zip(spans, ["layer-bataato", "layer-chana", "layer-sev"]):
        sal = np.zeros_like(al); sal[:, sp] = al[:, sp]
        ys, xs = np.where(sal > 0.5); box = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
        p = write(rim_from_inside(tight(crop(rgb, sal, box))), f"{OUT}chaat/{nm}.webp", maxside=800); DONE.append(p)
        NUM[nm] = {"size": list(Image.open(p).size)}


def one(pick, thr=0.5):
    a, bg = load(pick)
    al = alpha_of(a); rgb = despill(a, al, bg)
    lab, ids, b = objects(al, 1)[0]
    # holes inside the piece (a handle's loop) stay as keyed: only the one part and its own bits are kept
    return tight(crop(rgb, al, b, lab, ids))


# ---------------- sekelo's tray (K10-2): 3:1 by cutting the straight middle out ----------------
def tray():
    p = one("K10-2")
    h, w = p.shape[:2]
    want = 3 * h
    # the ends (0.6 of the height from each end, past the rounded corners) kept; the straight middle between them resampled
    # narrower (the brushing runs along the tray, so it stays seamless): pan-steel-short's way, without a seam
    e = int(0.6 * h)
    mid = Image.fromarray(p[:, e:w - e]).resize((want - 2 * e, h), Image.LANCZOS)
    out = np.concatenate([p[:, :e], np.asarray(mid), p[:, w - e:]], 1)
    NUM["tray-steel-long"] = {"srcSize": [w, h], "srcRatio": round(w / h, 3), "middleResampled": [w - 2 * e, want - 2 * e]}
    path = write(out, f"{OUT}kit/tray-steel-long.webp", w=1200); DONE.append(path)
    q = np.asarray(Image.open(path).convert("RGBA")).astype(float)
    H, W = q.shape[:2]
    # the well's inset: where the rim band's bright ends, along the middle row and column (the inner edge of the rim: the step down)
    L = q[..., :3].mean(2)
    row = ndimage.uniform_filter1d(L[H // 2], 5); col = ndimage.uniform_filter1d(L[:, W // 2], 5)
    op = np.where(q[H // 2, :, 3] > 200)[0]; x0 = op.min()
    opc = np.where(q[:, W // 2, 3] > 200)[0]; y0 = opc.min()
    dx = np.diff(row[x0:x0 + W // 6]); dy = np.diff(col[y0:y0 + H // 3])
    ix = x0 + int(np.argmin(dx)) + 1; iy = y0 + int(np.argmin(dy)) + 1
    NUM["tray-steel-long"].update({"size": [W, H], "ratio": round(W / H, 3), "inner": [round(ix / W, 3), round(iy / H, 3)]})


# ---------------- the karahi (K8r-2): the rim's circle and the oil's ----------------
def karahi():
    p = rim_from_inside(one("K8r-2"))
    path = write(p, f"{OUT}samosa/karahi-oil-v2.webp", w=1000); DONE.append(path)
    q = np.asarray(Image.open(path).convert("RGBA")).astype(float)
    H, W = q.shape[:2]
    a = q[..., 3] > 128
    # the round body without its handles: the rows' widths are the circle's except where a handle sticks out: fit a circle to the
    # top and bottom edges (no handles there) and to the left and right edges away from the handles' rows
    ys, xs = np.where(a)
    top, bot = ys.min(), ys.max()
    cy0 = (top + bot) / 2; r0 = (bot - top) / 2
    pts = []
    for t in np.linspace(0, 2 * np.pi, 720, endpoint=False):
        if abs(np.sin(t)) < 0.45: continue   # (the handles stand out left and right: those rays are left out)
        dx, dy = np.cos(t), np.sin(t)
        for rr in np.arange(r0 * 1.15, r0 * 0.7, -0.5):
            x, y = int(round(W / 2 + dx * rr)), int(round(cy0 + dy * rr))
            if 0 <= x < W and 0 <= y < H and a[y, x]: pts.append((x, y)); break
    P = np.array(pts, float)
    A = np.c_[2 * P[:, 0], 2 * P[:, 1], np.ones(len(P))]; bb = (P ** 2).sum(1)
    cx, cy, c = np.linalg.lstsq(A, bb, rcond=None)[0]; r = np.sqrt(c + cx ** 2 + cy ** 2)
    # the oil: its edge along 72 rays from the rim's centre, where the golden oil's saturation (max - min over 40) gives way to the
    # grey steel wall; a circle fitted to those points
    sat = q[..., :3].max(2) - q[..., :3].min(2)
    E = []
    for t in np.linspace(0, 2 * np.pi, 72, endpoint=False):
        for rr in range(int(r * 0.4), int(r)):
            x, y = int(cx + np.cos(t) * rr), int(cy + np.sin(t) * rr)
            if sat[y, x] < 40: E.append((x, y)); break
    E = np.array(E, float)
    A2 = np.c_[2 * E[:, 0], 2 * E[:, 1], np.ones(len(E))]
    ox, oy, c2 = np.linalg.lstsq(A2, (E ** 2).sum(1), rcond=None)[0]; ro = np.sqrt(c2 + ox ** 2 + oy ** 2)
    NUM["karahi-oil-v2"] = {"w": W, "h": H, "cx": round(cx / W, 4), "cy": round(cy / H, 4), "r": round(r / W, 4), "oil": round(ro / r, 3),
                            "rimPx": round(r, 1), "oilPx": round(ro, 1), "oilCentre": [round(ox / W, 4), round(oy / H, 4)]}


# ---------------- the grill (G1r-2): tight, at today's width; far and near rims, the coal bed ----------------
def grill():
    p = one("G1r-2")
    NUM["grill-v2"] = {"tight": [p.shape[1], p.shape[0]]}
    path = write(p, f"{OUT}kit/grill-v2.webp", size=(1621, 813)); DONE.append(path)   # (tight 1.99:1: today's canvas, within 0.4%)
    q = np.asarray(Image.open(path).convert("RGBA")).astype(float)
    H, W = q.shape[:2]
    L = q[..., :3].mean(2); A = q[..., 3]
    # the frame: pale steel (bright, low saturation); the coal bed: dark. Along the middle column the far rim is the first bright
    # band from the top and the near rim the last; each's middle row
    x = W // 2
    steel = (L > 150) & (A > 200) & ((q[..., :3].max(2) - q[..., :3].min(2)) < 45)
    col = steel[:, x - 40:x + 40].mean(1) > 0.6
    runs = []; y = 0
    while y < H:
        if col[y]:
            s = y
            while y < H and col[y]: y += 1
            runs.append((s, y))
        y += 1
    far = (runs[0][0] + runs[0][1] - 1) / 2; near = (runs[-1][0] + runs[-1][1] - 1) / 2
    # the coal bed's left and right: the frame's side rails' inner edges (as today's bed, 0.105 and 0.895 = its rails' inner edges)
    # along rows a quarter and three quarters down (clear of the handles): the second steel run from the left ends, the second from
    # the right starts
    lefts, rights = [], []
    for yy in (H // 4, H // 2 - 100, 3 * H // 4):
        st = steel[yy]; xs_ = np.where(np.diff(np.r_[0, st.astype(int), 0]) != 0)[0].reshape(-1, 2)
        xs_ = [r for r in xs_ if r[1] - r[0] > 4]
        lefts.append(xs_[0][1]); rights.append(xs_[-1][0])
    NUM["grill-v2"].update({"w": W, "h": H, "far": round(far / H, 3), "near": round(near / H, 3),
                            "bed": [round(float(np.median(lefts)) / W, 3), round(float(np.median(rights)) / W, 3)],
                            "rims": [list(map(int, r)) for r in runs], "bars": len(runs) - 2})


# ---------------- the kitchen (KF-6): as KG was made (s19-serve2) ----------------
def back_edge(a):
    L = a.mean(2)
    ys = []
    for x in range(300, 1801, 10):
        d = np.diff(L[1000:1120, x]); ys.append(1000 + int(np.argmax(d)) + 0.5)
    return float(np.median(ys))


def kitchen():
    path = "assets/cook/serve/kitchen-tall.webp"
    old = Image.open(path).convert("RGB"); olda = np.asarray(old).astype(float)
    os.makedirs(RES + "kitchen", exist_ok=True)
    old.save(RES + "kitchen/kitchen-tall-before.webp", "WEBP", quality=84, method=6)
    kf = Image.open(SRC + "KF-6.png").convert("RGB")
    new = kf.resize((2100, 1575), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=3))
    na = np.asarray(new).astype(float)
    NUM["kitchen-tall"] = {"src": list(kf.size), "size": [2100, 1575], "backEdgeOld": back_edge(olda), "backEdgeNew": back_edge(na)}
    NUM["kitchen-tall"]["backEdgeNewDesign"] = NUM["kitchen-tall"]["backEdgeNew"] - 450
    new.save(path, "WEBP", quality=84, method=6)
    # side by side and the marble crops (the island's top, under the back edge), same place in each
    s = 0.4
    sb = Image.new("RGB", (int(2100 * s) * 2 + 20, int(1575 * s) + 30), (255, 255, 255)); d = ImageDraw.Draw(sb)
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    for i, (im, t) in enumerate([(old, "today (KG)"), (new, "new (KF-6)")]):
        sb.paste(im.resize((int(2100 * s), int(1575 * s)), Image.LANCZOS), (i * (int(2100 * s) + 20), 30)); d.text((i * (int(2100 * s) + 20) + 4, 4), t, fill=(0, 0, 0), font=f)
    sb.save(RES + "kitchen/kitchen-side-by-side.jpg", quality=88)
    box = (700, 1120, 1400, 1420)
    mc = Image.new("RGB", (1420, 330), (255, 255, 255)); d = ImageDraw.Draw(mc)
    for i, (im, t) in enumerate([(old, "today's marble"), (new, "new marble")]):
        mc.paste(im.crop(box), (i * 720, 30)); d.text((i * 720 + 4, 4), t, fill=(0, 0, 0), font=f)
    mc.save(RES + "kitchen/kitchen-marble-crops.jpg", quality=92)
    def stats(a):
        c = a[box[1]:box[3], box[0]:box[2]].reshape(-1, 3)
        return {"mean": [round(v, 1) for v in c.mean(0)], "r-b": round(float((c[:, 0] - c[:, 2]).mean()), 1), "r-g": round(float((c[:, 0] - c[:, 1]).mean()), 1)}
    NUM["kitchen-tall"]["marbleOld"] = stats(olda); NUM["kitchen-tall"]["marbleNew"] = stats(na)


# ---------------- ART-78 (Zafar, 12 Nov night: "The stone serving tray is cut out really poorly"): the stone band, recut ----------------
STONE_SRC = os.environ.get("NJG_SOURCES", "sources") + "/art/s19-tray-pot/results/best/T1.png"


def stone():
    """The tray-pot run's T1 (s19_tp_cut.py cut it with the plain #FF00FF key: a pink-grey fringe round the rim and soft specks of the
    ground left above it). Recut on the same canvas, so nothing that draws it moves: the same box (s19_cut's key over 0.5, 6 px round)
    at the same size (1593 x 292). The key is the picture's own ground (its median border colour); only the band itself is kept (no
    specks); the edge's alpha is smoothed a little (a clean rounded rim, not stair-stepped), its colour taken from the stone just
    inside, then edge_pink and edge_bleed as every k3 cut."""
    a = np.asarray(Image.open(STONE_SRC).convert("RGB")).astype(float)
    e = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)])
    bg = np.median(e, 0)
    # today's canvas: s19_tp_cut's box (s19_cut.alpha_of over 0.5, its tight box, 6 px round)
    al0 = alpha_of(a)
    ys, xs = np.where(al0 > 0.5)
    y0, y1, x0, x1 = max(0, ys.min() - 6), min(a.shape[0], ys.max() + 1 + 6), max(0, xs.min() - 6), min(a.shape[1], xs.max() + 1 + 6)
    # the key against the picture's own ground: how far a pixel is from the ground's magenta, in the ground's own terms
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    mbg = min(bg[0], bg[2]) - bg[1]
    al = np.clip((mbg * 0.82 - m) / (mbg * 0.6), 0, 1)
    # only the band: its one big part, its holes filled; every speck of the ground outside it cleared
    lab, k = ndimage.label(al > 0.5)
    sizes = ndimage.sum(np.ones_like(al), lab, range(1, k + 1))
    body = ndimage.binary_fill_holes(lab == int(np.argmax(sizes)) + 1)
    al = al * ndimage.binary_dilation(body, iterations=2)
    al[ndimage.binary_erosion(body, iterations=3)] = 1.0
    # a smooth rim: the alpha softened over about a pixel (the key steps along the rounded corners)
    al = np.clip(ndimage.gaussian_filter(al, 0.8), 0, 1)
    al[al < 0.03] = 0
    rgb = despill(a, al, bg)
    rgba = np.dstack([np.clip(rgb, 0, 255), al * 255]).astype(np.uint8)[y0:y1, x0:x1]
    rgba = rim_from_inside(rgba)
    path = os.environ.get("NJG_STONE_OUT", f"{OUT}kit/tray-stone.webp")
    old = Image.open(f"{OUT}kit/tray-stone.webp").size if os.path.exists(f"{OUT}kit/tray-stone.webp") else (1593, 292)
    # (written as a new file, never over the old one's inode: a hard-linked copy of the tree keeps today's picture)
    if os.path.exists(path): os.remove(path)
    write(rgba, path, size=old)
    DONE.append(path)
    q = np.asarray(Image.open(path).convert("RGBA"))
    NUM["tray-stone"] = {"size": list(q.shape[1::-1]), "box": [int(x0), int(y0), int(x1), int(y1)], "ground": [round(v) for v in bg],
                         "parts": int(ndimage.label(q[..., 3] > 8)[1])}


def sheet(path):
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    cell = 260; cols = 4
    rows = (len(DONE) + cols - 1) // cols
    S = Image.new("RGB", (cols * cell * 2, rows * (cell + 20)), (255, 255, 255)); d = ImageDraw.Draw(S)
    for i, p in enumerate(DONE):
        im = Image.open(p).convert("RGBA"); t = im.copy(); t.thumbnail((cell - 12, cell - 12), Image.LANCZOS)
        x, y = (i % cols) * cell * 2, (i // cols) * (cell + 20)
        for j, g in enumerate([(28, 28, 30), (238, 234, 226)]):
            bg = Image.new("RGB", (cell, cell), g); bg.paste(t, ((cell - t.width) // 2, (cell - t.height) // 2), t); S.paste(bg, (x + j * cell, y + 20))
        d.text((x + 3, y + 3), p.replace(OUT, "") + f"  {im.size[0]}x{im.size[1]}", fill=(0, 0, 0), font=f)
    S.save(path, quality=88)


def main():
    only = None
    if "--only" in sys.argv: only = sys.argv[sys.argv.index("--only") + 1].split(",")
    steps = {"B5r": jugs, "B6": jars, "D4": onion, "C12": scatters, "K10": tray, "K8r": karahi, "G1r": grill, "KF": kitchen, "ST": stone}
    for k, fn in steps.items():
        if only and k not in only: continue
        fn(); print(k, "done")
    for p in DONE:
        a = np.asarray(Image.open(p).convert("RGBA"))
        NUM.setdefault("pinkRim", {})[p.replace(OUT, "")] = round(pink_share(a), 3)
    # (ART-78's recut alone has its own sheet: the k3 sheet keeps every pick)
    if DONE: sheet(RES + ("cut-sheet-stone.jpg" if only == ["ST"] else "cut-sheet.jpg"))
    prev = {}
    if os.path.exists(RES + "cut-numbers.json"): prev = json.load(open(RES + "cut-numbers.json"))
    prev.update({k: v for k, v in NUM.items() if k != "pinkRim"}); prev.setdefault("pinkRim", {}).update(NUM.get("pinkRim", {}))
    json.dump(prev, open(RES + "cut-numbers.json", "w"), indent=1)
    print(json.dumps(NUM, indent=1))


if __name__ == "__main__":
    main()
