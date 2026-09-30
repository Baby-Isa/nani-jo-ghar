#!/usr/bin/env python3
"""Cut the Cook v3 ChatGPT sheets (29 Sept play-test, docs/archive/art-prompts/chatgpt-art-prompts-cook-v3.md) into sprites.

    python3 build/cut_cook_v3.py              # every sheet -> assets/cook/items/v3/<group>/*.webp + meta.json
    python3 build/cut_cook_v3.py --only hob   # one group (hob, faces, chai, maani, daar, chaat, samosa, sekelo)

The method is build/cut_tick_v2.py's (docs/archive/process/VISUAL-QA.md §2):
  - the object is everything not connected to the flat grey background, holes filled, so grey steel
    and dark glass stay solid; BUT a hole that is itself flat background grey (inside a loop handle,
    a rack's frame, the holes of a slotted spoon) is background again, so no grey is left inside;
  - edges use colour-to-alpha against the measured background (no grey fringe);
  - glass (the chaat bowl and pots) is colour-to-alpha all over with a solid core only where it's
    strongly coloured, so the cream shows through it;
  - where a sheet shows one object in several states, every state shares one canvas and is placed
    by the same anchor (registered): the vessel's fitted rim, the strip's right end, or the grid.
Nothing is stitched or tiled: each sprite is one cell of one picture, only cropped (the hobs are
also scaled so their burners match, see HOB_CAP_R).

Every meta.json value is measured from the cut art (centres, radii, burner positions), as
fractions of the sprite's own width/height unless the key ends in _px. build/check_vessel_meta.py
re-measures them.
"""
import argparse
import json
import math
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "sources", "art", "cook-v3")
OUT = os.path.join(ROOT, "assets", "cook", "items", "v3")
# the old composed hob's brass cap radius, canvas px (measured on assets/cook/items/chai-v2/hob-2.webp
# before it was retired, 29 Sept): the new hobs are scaled so their caps match it, so a station's hob
# scale k keeps its burner size (the burner supports matched too: 213 px then, 205 px now)
HOB_CAP_R = 70.9

# ChatGPT's upload name -> the prompt's "save as" name (the orchestrator's content match, checked by eye)
RENAME = [
    ("chatgpt-cook-v3-01-h1.png", "h1-hob-2-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 02_27_56 PM.png", "h2-hob-1-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 02_33_16 PM.png", "h3-hob-3-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 02_36_51 PM.png", "h4-hob-4-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 02_40_03 PM.png", "h5-hob-wide-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 02_43_57 PM.png", "h6-knob-off-on-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 02_51_14 PM.png", "a1-faces-nani-nana-ma-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 02_56_12 PM.png", "a2-faces-ali-isa-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 03_00_44 PM.png", "c1-chai-pan-states-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 03_12_05 PM.png", "m1-dough-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 03_18_06 PM.png", "m2-chakla-velan-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_12_12 PM.png", "m3-maani-states-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_16_25 PM.png", "m4-tawa-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_20_01 PM.png", "m5-turner-wood-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_24_22 PM.png", "d1-daar-pot-states-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_33_23 PM.png", "d2-ladle-trivet-bowl-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_36_27 PM.png", "t1-chaat-bowl-side-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_41_57 PM.png", "t2-chaat-pots-side-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_48_56 PM.png", "s1-samosa-fold-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_52_47 PM.png", "s2-board-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 04_59_40 PM.png", "s3-karahi-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 05_02_45 PM.png", "s4-plate-jharo-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 05_05_52 PM.png", "s5-fillings-top-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 05_08_57 PM.png", "k1-rack-0-4-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 05_13_54 PM.png", "k2-plate-1-4-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 05_17_58 PM.png", "k3-grill-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 05_43_32 PM.png", "k4-pieces-v1.png"),
    ("ChatGPT Image Sep 29, 2026, 05_53_13 PM.png", "k5-heaps-v1.png"),
]


# ---------------------------------------------------------------- the cut itself

def load(name):
    a = np.asarray(Image.open(os.path.join(SRC, name)).convert("RGB")).astype(float)
    return a


def measure_bg(a, band=6):
    edge = np.concatenate([a[:band].reshape(-1, 3), a[-band:].reshape(-1, 3), a[:, :band].reshape(-1, 3), a[:, -band:].reshape(-1, 3)])
    return np.median(edge, 0)


def cut(c, bg, glass=False, keep="largest", min_area=2500, hole_flat=7.0, shadows=True):
    """One cell (RGB float) -> RGBA float array. keep: 'largest' piece or 'all' pieces over min_area."""
    d = np.abs(c - bg).max(2)
    lab, _ = ndi.label(d < 8)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ~np.isin(lab, list(border))
    obj = ndi.binary_opening(obj, iterations=1)
    lb, n = ndi.label(obj)
    if n == 0:
        return None
    sizes = np.bincount(lb.ravel())[1:]
    if keep == "largest":
        obj = lb == (np.argmax(sizes) + 1)
    else:
        obj = np.isin(lb, [i + 1 for i, s in enumerate(sizes) if s >= min_area])
    # a grey patch enclosed by the object that is flat background (inside a loop handle, a rack's
    # frame, the holes of a slotted spoon) is background again: flat (little texture) and the
    # background's colour. Brushed steel and glass near the grey have texture, so they stay.
    lum = c.mean(2)
    inner = (d < 12) & obj
    lab2, n2 = ndi.label(inner)
    bgholes = np.zeros_like(obj)
    for i in range(1, n2 + 1):
        h = lab2 == i
        if h.sum() < 25:
            continue
        core_h = ndi.binary_erosion(h, iterations=1) if h.sum() > 80 else h
        if (d[h] < hole_flat).mean() > 0.6 and lum[core_h].std() < 4.0:
            bgholes |= h
    obj = ndi.binary_fill_holes(obj) & ~bgholes
    if shadows:
        # ChatGPT's soft drop shadows (drawn despite "no shadows"): unsaturated, a little darker than the
        # grey, and OUTSIDE the object's body. They leave the solid core, so colour-to-alpha turns them
        # into a faint shade instead of a grey band on the cream.
        blum = bg.mean()
        sat = c.max(2) - c.min(2)
        shade = (sat < 16) & (lum < blum - 2) & (lum > blum - 70)
        body = obj & ~shade
        lb3, n3 = ndi.label(body)
        if n3:
            szs = np.bincount(lb3.ravel())[1:]
            body = np.isin(lb3, [i + 1 for i, v in enumerate(szs) if v >= max(200, 0.02 * szs.max())])
            body = ndi.binary_fill_holes(body)
            shadow = obj & ~body
            obj = obj & ~shadow
    if glass:
        core = ndi.binary_erosion((d > 45) & obj, iterations=3)
    else:
        core = ndi.binary_erosion(obj, iterations=3)
    up = np.where(c > bg, (c - bg) / np.maximum(255 - bg, 1), (bg - c) / np.maximum(bg, 1))
    alpha = np.clip(up.max(2), 0, 1)
    if glass:
        alpha = np.clip(alpha * 1.6, 0, 1)  # the glass itself stays visible (a light veil), still see-through
    alpha = np.where(ndi.binary_dilation(obj, iterations=2), alpha, 0)
    alpha = np.clip((alpha - 0.03) / 0.97, 0, 1)
    alpha = np.where(core, 1.0, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(core[..., None], c, np.clip((c - bg) / safe + bg, 0, 255))
    return np.dstack([rgb, alpha * 255])


def grey_left(img, bg, tol=6.0, min_area=120):
    """The grey-leftover check: any opaque patch inside a cut that is flat background grey. Returns the
    biggest such patch's area (0 = clean)."""
    a = img[..., 3] > 200
    d = np.abs(img[..., :3] - bg).max(2)
    g = a & (d < tol)
    g = ndi.binary_opening(g, iterations=2)
    lab, n = ndi.label(g)
    if not n:
        return 0
    return int(np.bincount(lab.ravel())[1:].max()) if np.bincount(lab.ravel())[1:].max() >= min_area else 0


def bbox(img, thr=128):
    ys, xs = np.nonzero(img[..., 3] > thr)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def fit_circle(pts):
    P = np.asarray(pts, float)
    A = np.c_[2 * P[:, 0], 2 * P[:, 1], np.ones(len(P))]
    s = np.linalg.lstsq(A, (P ** 2).sum(1), rcond=None)[0]
    return s[0], s[1], math.sqrt(max(1.0, s[2] + s[0] ** 2 + s[1] ** 2))


def rim_points(mask, c, step=2):
    H, W = mask.shape
    pts = []
    for deg in range(0, 360, step):
        t = math.radians(deg)
        last = None
        for rr in range(1, max(W, H)):
            x, y = int(c[0] + math.cos(t) * rr), int(c[1] + math.sin(t) * rr)
            if not (0 <= x < W and 0 <= y < H):
                break
            if mask[y, x]:
                last = (x, y)
        if last:
            pts.append((deg, last))
    return pts


def robust_circle(mask, c0=None):
    """The round body's rim: rays from the centre, the outermost solid pixel each way, then a circle
    fitted with the handles' rays (the far outliers) dropped. Returns cx, cy, r (px) and the 90th
    percentile residual."""
    ys, xs = np.nonzero(mask)
    c = c0 or (xs.mean(), ys.mean())
    keep = None
    for _ in range(6):
        pts = rim_points(mask, c)
        P = np.array([p for _, p in pts], float)
        if keep is None:
            keep = np.ones(len(P), bool)
        cx, cy, r = fit_circle(P[keep])
        res = np.hypot(P[:, 0] - cx, P[:, 1] - cy) - r
        med = np.median(np.abs(res[keep]))
        keep = np.abs(res) <= max(2.5, 3 * med)
        cx, cy, r = fit_circle(P[keep])
        c = (cx, cy)
    res = np.abs(np.hypot(P[keep, 0] - cx, P[keep, 1] - cy) - r)
    return cx, cy, r, float(np.percentile(res, 90))


def save(img, path, max_side=None):
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGBA")
    if max_side and max(im.size) > max_side:
        k = max_side / max(im.size)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=90, method=6, exact=False)
    return im


def pad_canvas(img, pad):
    H, W = img.shape[:2]
    out = np.zeros((H + 2 * pad, W + 2 * pad, 4))
    out[pad:pad + H, pad:pad + W] = img
    return out


def crop_to(img, box, pad):
    x0, y0, x1, y1 = box
    sub = img[max(0, y0):y1, max(0, x0):x1]
    return pad_canvas(sub, pad)


def cells(a, cols, rows, box=None):
    """Equal grid cells: [(x0, y0, x1, y1)] row by row."""
    H, W = a.shape[:2]
    x0, y0, x1, y1 = box or (0, 0, W, H)
    cw, ch = (x1 - x0) / cols, (y1 - y0) / rows
    return [(round(x0 + i * cw), round(y0 + j * ch), round(x0 + (i + 1) * cw), round(y0 + j * ch + ch)) for j in range(rows) for i in range(cols)]


def grid_boxes(a, bg, cols, rows):
    """The sheet's cells as ChatGPT drew them (its grids aren't equal: D1's bottom pots cross the
    equal grid's line): each object goes to the equal-grid cell holding its centre, then each cell
    line is put midway between the objects on either side of it."""
    H, W = a.shape[:2]
    d = np.abs(a - bg).max(2)
    m = ndi.binary_opening(d > 14, iterations=2)
    lab, n = ndi.label(m)
    objs = ndi.find_objects(lab)
    sizes = ndi.sum(m, lab, range(1, n + 1))
    comps = [o for o, sz in zip(objs, sizes) if sz > 3000]
    rowsof = {}
    colsof = {}
    for o in comps:
        cy, cx = (o[0].start + o[0].stop) / 2, (o[1].start + o[1].stop) / 2
        r, c = min(rows - 1, int(cy / (H / rows))), min(cols - 1, int(cx / (W / cols)))
        rowsof.setdefault(r, []).append(o)
        colsof.setdefault(c, []).append(o)

    def lines(groups, count, axis, size):
        out = [0]
        for i in range(count - 1):
            lo, hi = groups.get(i), groups.get(i + 1)
            if lo and hi:
                out.append(round((max(o[axis].stop for o in lo) + min(o[axis].start for o in hi)) / 2))
            else:
                out.append(round(size * (i + 1) / count))
        return out + [size]
    ys = lines(rowsof, rows, 0, H)
    xs = lines(colsof, cols, 1, W)
    return [(xs[i], ys[j], xs[i + 1], ys[j + 1]) for j in range(rows) for i in range(cols)]


class Group:
    """One output folder: its sprites, meta.json and the report rows."""

    def __init__(self, name):
        self.name = name
        self.dir = os.path.join(OUT, name)
        self.meta = {}
        self.rows = []

    def put(self, fname, img, bg, sheet, meta=None, max_side=None):
        g = grey_left(img, bg)
        im = save(img, os.path.join(self.dir, fname + ".webp"), max_side)
        m = {"w": im.width, "h": im.height, "sheet": sheet}
        m.update(meta or {})
        if g:
            m["grey_left_px"] = g
        self.meta[fname] = m
        self.rows.append((fname, im.size, g))
        print(f"  {self.name}/{fname}.webp {im.width}x{im.height}" + (f"  GREY LEFT {g}px" if g else ""))
        return im

    def done(self):
        with open(os.path.join(self.dir, "meta.json"), "w") as f:
            json.dump(self.meta, f, indent=1)


def registered(sheet_cuts, anchor, pad=16):
    """Place cut cells on one canvas so their anchors line up. sheet_cuts: [(img, (ax, ay))] with the
    anchor in each img's own px. Returns the placed images and the anchor on the canvas."""
    L = max(ax for _, (ax, ay) in sheet_cuts)
    T = max(ay for _, (ax, ay) in sheet_cuts)
    R = max(img.shape[1] - ax for img, (ax, ay) in sheet_cuts)
    B = max(img.shape[0] - ay for img, (ax, ay) in sheet_cuts)
    W, H = int(math.ceil(L + R)), int(math.ceil(T + B))
    out = []
    for img, (ax, ay) in sheet_cuts:
        cv = np.zeros((H, W, 4))
        ox, oy = int(round(L - ax)), int(round(T - ay))
        h, w = img.shape[:2]
        cv[oy:oy + h, ox:ox + w] = img[: H - oy, : W - ox]
        out.append(cv)
    # trim to the union of what's drawn, plus pad
    union = np.zeros((H, W), bool)
    for cv in out:
        union |= cv[..., 3] > 8
    ys, xs = np.nonzero(union)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    out = [pad_canvas(cv[y0:y1, x0:x1], pad) for cv in out]
    return out, (L - x0 + pad, T - y0 + pad)


def cut_cells(a, bg, boxes, **kw):
    res = []
    for b in boxes:
        x0, y0, x1, y1 = b
        c = cut(a[y0:y1, x0:x1], bg, **kw)
        res.append(c)
    return res


def tight(img, pad=16):
    x0, y0, x1, y1 = bbox(img, 8)
    return pad_canvas(img[y0:y1, x0:x1], pad)


def circle_meta(img, **extra):
    m = img[..., 3] > 128
    cx, cy, r, res = robust_circle(m)
    H, W = m.shape
    d = {"cx": round(cx / W, 4), "cy": round(cy / H, 4), "r": round(r / W, 4), "fit_px": round(res, 1)}
    d.update(extra)
    return d, (cx, cy, r)


# ---------------------------------------------------------------- the hob family

def gold_caps(img):
    """The brass caps: strongly yellow, bright blobs. [(cx, cy, r)] left to right."""
    rgb = img[..., :3]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    gold = (r > 120) & (r - b > 55) & (g - b > 30) & (img[..., 3] > 200)
    gold = ndi.binary_opening(gold, iterations=2)
    gold = ndi.binary_fill_holes(gold)
    lab, n = ndi.label(gold)
    out = []
    for i in range(1, n + 1):
        m = lab == i
        area = m.sum()
        if area < 800:
            continue
        ys, xs = np.nonzero(m)
        out.append((xs.mean(), ys.mean(), math.sqrt(area / math.pi)))
    return sorted(out)


def hob_group(old_cap_r):
    G = Group("hob")
    specs = [("hob-1", "h2-hob-1-v1.png", 1), ("hob-2", "h1-hob-2-v1.png", 2), ("hob-3", "h3-hob-3-v1.png", 3),
             ("hob-4", "h4-hob-4-v1.png", 4), ("hob-wide", "h5-hob-wide-v1.png", 1)]
    for fname, sheet, n in specs:
        a = load(sheet)
        bg = measure_bg(a)
        c = cut(a, bg)
        c = tight(c, 6)
        caps = gold_caps(c)
        assert len(caps) == n, (fname, len(caps))
        # scale so the caps match the old hob's (hob-wide: its big burner keeps its own size relative
        # to hob-2's scale, so the wide burner stays bigger than the rest)
        ref = caps if fname != "hob-wide" else gold_caps(tight(cut(load("h1-hob-2-v1.png"), measure_bg(load("h1-hob-2-v1.png"))), 6))
        k = old_cap_r / np.mean([r for _, _, r in ref])
        if fname == "hob-wide":
            k *= 1.0  # the prompt's H1 scale
        im = Image.fromarray(np.clip(c, 0, 255).astype(np.uint8), "RGBA")
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        c = np.asarray(im).astype(float)
        caps = gold_caps(c)
        H, W = c.shape[:2]
        # the glass: inside the silver frame, down the middle column (the frame is the bright band)
        lum = c[..., :3].mean(2)
        cx0, cy0, cr = caps[0]
        sup, ring = support_radius(c, cx0, cy0, cr)
        colv = lum[:, W // 2] * (c[:, W // 2, 3] > 128)
        rows = np.arange(H)
        silver = np.nonzero(colv > 130)[0]
        glass_top = silver[silver < H * 0.12].max() + 1
        glass_bottom = silver[silver > H * 0.88].min() - 1
        below = max(cy0 + ring, cy0 + sup * 0.72)
        front_y = (below + glass_bottom) / 2
        meta = {
            "n": n,
            "burners": [{"x": round(x / W, 4), "y": round(y / H, 4)} for x, y, _ in caps],
            "cap_r": round(np.mean([r for _, _, r in caps]) / W, 4),
            "support_r": round(sup / W, 4),
            "glass": {"top": round(glass_top / H, 4), "bottom": round(glass_bottom / H, 4)},
            "frontY": round(front_y / H, 4),
            "scale_from_sheet": round(k, 4),
        }
        G.put(fname, c, bg, sheet, meta)
    # the knobs (H6): off and on, one canvas each, registered on the knob's round body
    a = load("h6-knob-off-on-v1.png")
    bg = measure_bg(a)
    H, W = a.shape[:2]
    offc = cut(a[:, : W // 2], bg)
    onc = cut(a[:, W // 2:], bg)  # the rim's glow: colour-to-alpha outside the body keeps it soft
    on_glow = cut_glow(a[:, W // 2:], bg)
    placed = []
    for img in (offc, on_glow):
        m = img[..., 3] > 200
        cx, cy, r, _ = robust_circle(m)
        placed.append((img, (cx, cy), r))
    rr = max(r for _, _, r in placed)
    pad = int(rr * 0.35)
    outs = []
    for img, (cx, cy), r in placed:
        x0, y0 = int(round(cx - rr - pad)), int(round(cy - rr - pad))
        size = int(2 * (rr + pad))
        cv = np.zeros((size, size, 4))
        sx0, sy0 = max(0, x0), max(0, y0)
        sub = img[sy0: y0 + size, sx0: x0 + size]
        cv[sy0 - y0: sy0 - y0 + sub.shape[0], sx0 - x0: sx0 - x0 + sub.shape[1]] = sub
        outs.append(cv)
    for fname, img in zip(("knob-off", "knob-on"), outs):
        m, _ = circle_meta(img)
        m["note"] = "grip bar horizontal = off; on is the same knob turned a quarter (bar vertical) with a warm glow"
        G.put(fname, img, bg, "h6-knob-off-on-v1.png", m, max_side=320)
    G.done()
    return G


def cut_glow(c, bg):
    """cut_tick_v2's glow cell: the solid core is only the strongly coloured body; the glow is colour-to-alpha."""
    d = np.abs(c - bg).max(2)
    body = ndi.binary_fill_holes(d > 90)
    lb, n = ndi.label(body)
    body = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
    core = ndi.binary_erosion(body, iterations=4)
    up = np.where(c > bg, (c - bg) / (255 - bg), (bg - c) / bg)
    alpha = np.clip(up.max(2), 0, 1)
    alpha = np.clip((alpha - 0.03) / 0.97, 0, 1)
    alpha = np.where(core, 1.0, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(core[..., None], c, np.clip((c - bg) / safe + bg, 0, 255))
    return np.dstack([rgb, alpha * 255])


def support_radius(c, cx, cy, cr):
    """How far the burner reaches: the support's arms (the diagonals) end in a deep shadow dip on the
    glass, and so does the black ring (straight down). Returns (arm reach, ring radius), px."""
    lum = c[..., :3].mean(2)
    H, W = lum.shape

    def reach(deg):
        t = math.radians(deg)
        prof = []
        for rr in range(int(cr * 1.3), int(cr * 3.6)):
            x, y = int(cx + math.cos(t) * rr), int(cy + math.sin(t) * rr)
            prof.append(lum[y, x] if (0 <= x < W and 0 <= y < H) else 255)
        prof = np.array(prof)
        idx = np.nonzero(prof < 25)[0]
        return cr * 1.3 + (idx.max() if len(idx) else 0)
    arms = float(np.median([reach(d) for d in (45, 135, 225, 315)]))
    ring = float(np.median([reach(d) for d in (0, 90, 180)]))
    return arms, min(ring, arms)


# ---------------------------------------------------------------- the faces (A1, A2)

# eye centres per cell, measured by eye on the sheets (px in the 1254 sheet): (left eye, right eye)
FACE_EYES = {}


def faces_group():
    """Writes assets/cook/characters/<who>-face[-happy|-frown].webp (the same 280px framing as
    build/cut_characters.py: eyes on the line BADGE_EYE_Y, BADGE_IOD apart)."""
    G = Group("faces")
    G.dir = os.path.join(ROOT, "assets", "cook", "characters")
    SIZE, EYE_Y, IOD = 280, 0.45, 0.32  # a closer crop than cut_characters (0.25): the face fills the circle (X4)
    moods = ["", "-happy", "-frown"]
    rows = {"a1-faces-nani-nana-ma-v1.png": ["nani", "nana", "ma"], "a2-faces-ali-isa-v1.png": ["cousin", "isa"]}
    for sheet, people in rows.items():
        a = load(sheet)
        bg = measure_bg(a[:, :, :])
        boxes = cells(a, 3, 3)
        for r, who in enumerate(people):
            for m, mood in enumerate(moods):
                x0, y0, x1, y1 = boxes[r * 3 + m]
                (lx, ly), (rx, ry) = FACE_EYES[(sheet, r, m)]
                cell = a[y0:y1, x0:x1]
                c = cut_face(cell, bg)
                # eyes in the cell's px
                lx, ly, rx, ry = lx - x0, ly - y0, rx - x0, ry - y0
                iod = math.hypot(rx - lx, ry - ly)
                k = IOD * SIZE / iod
                ang = math.degrees(math.atan2(ry - ly, rx - lx))
                im = Image.fromarray(np.clip(c, 0, 255).astype(np.uint8), "RGBA")
                mx, my = (lx + rx) / 2, (ly + ry) / 2
                # scale, then rotate about the eyes' midpoint, then put the midpoint at (SIZE/2, SIZE*EYE_Y)
                im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
                big = Image.new("RGBA", (im.width * 3, im.height * 3), (0, 0, 0, 0))
                big.paste(im, (im.width, im.height))
                cxm, cym = im.width + mx * k, im.height + my * k
                big = big.rotate(ang * 0.5, resample=Image.BICUBIC, center=(cxm, cym))
                out = big.crop((round(cxm - SIZE / 2), round(cym - SIZE * EYE_Y), round(cxm - SIZE / 2) + SIZE, round(cym - SIZE * EYE_Y) + SIZE))
                arr = np.asarray(out).astype(float)
                G.put(f"{who}-face{mood}", arr, bg, sheet, {"eyes_px": [[round(lx + x0), round(ly + y0)], [round(rx + x0), round(ry + y0)]], "scale": round(k, 4)})
    json.dump(G.meta, open(os.path.join(OUT, "faces-meta.json"), "w"), indent=1)
    return G


def cut_face(cell, bg):
    """A person on the grey: everything not connected to the cell's own grey border (the sheet's cells
    touch, so a neighbour's scarf can cross the border: keep the piece holding the cell's middle)."""
    d = np.abs(cell - bg).max(2)
    lab, _ = ndi.label(d < 10)
    H, W = d.shape
    # background = grey regions touching the top/left/right border
    border = set(np.unique(np.concatenate([lab[0], lab[:, 0], lab[:, -1], lab[-1]]))) - {0}
    obj = ~np.isin(lab, list(border))
    lb, n = ndi.label(obj)
    mid = lb[int(H * 0.45), W // 2]
    if mid:
        obj = lb == mid
    obj = ndi.binary_fill_holes(obj)
    core = ndi.binary_erosion(obj, iterations=3)
    up = np.where(cell > bg, (cell - bg) / (255 - bg), (bg - cell) / bg)
    alpha = np.clip(up.max(2), 0, 1)
    alpha = np.where(ndi.binary_dilation(obj, iterations=2), alpha, 0)
    alpha = np.clip((alpha - 0.03) / 0.97, 0, 1)
    alpha = np.where(core, 1.0, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(core[..., None], cell, np.clip((cell - bg) / safe + bg, 0, 255))
    return np.dstack([rgb, alpha * 255])


# ---------------------------------------------------------------- the station sets (cut and documented, not wired)

def vessel_states(G, sheet, names, cols, rows, glass=False, anchor="rim", extra=None, max_side=None):
    """One vessel in several states: each cell cut, registered on the vessel's fitted rim centre
    ('rim'), its bottom-centre ('bottom') or the cell's own grid position ('grid')."""
    a = load(sheet)
    bg = measure_bg(a)
    boxes = grid_boxes(a, bg, cols, rows)
    items = []
    for name, b in zip(names, boxes):
        if name is None:
            continue
        x0, y0, x1, y1 = b
        c = cut(a[y0:y1, x0:x1], bg, glass=glass)
        if anchor == "rim":
            cx, cy, r, _ = robust_circle(c[..., 3] > 128)
            anc = (cx, cy)
        elif anchor == "bottom":
            bx0, by0, bx1, by1 = bbox(c, 60)
            anc = ((bx0 + bx1) / 2, by1)
        else:  # rack: the rack's left end and its lower rail (the skewers come and go above and below it)
            m = c[..., 3] > 128
            xs = np.nonzero(m.any(0))[0]
            wide = np.nonzero(m.sum(1) > 0.8 * (xs.max() - xs.min()))[0]
            anc = (float(xs.min()), float(wide.max()))
        items.append((name, c, anc))
    placed, (ax, ay) = registered([(c, anc) for _, c, anc in items], anchor)
    for (name, _, _), img in zip(items, placed):
        H, W = img.shape[:2]
        meta = {"registered": anchor, "set": names[0].rsplit("-", 1)[0]}
        if anchor == "rim":
            m, _ = circle_meta(img)
            meta.update(m)
            meta["anchor"] = [round(ax / W, 4), round(ay / H, 4)]
        elif anchor == "bottom":
            meta["anchor"] = [round(ax / W, 4), round(ay / H, 4)]
        if extra:
            meta.update(extra(name, img) or {})
        G.put(name, img, bg, sheet, meta, max_side)


def singles(G, sheet, specs, glass=False, uniform=False, max_side=None, local_bg=False):
    """Separate objects on one sheet. specs: [(name, box or None for the whole sheet, meta_fn)]."""
    a = load(sheet)
    bg = measure_bg(a)
    cuts = []
    for name, box, fn in specs:
        if name is None:
            continue
        x0, y0, x1, y1 = box or (0, 0, a.shape[1], a.shape[0])
        if local_bg:  # a panel with its own grey (D2's three panels)
            bg = measure_bg(a[y0:y1, x0:x1], 4)
        c = cut(a[y0:y1, x0:x1], bg, glass=glass)
        cuts.append((name, tight(c, 16), fn))
    if uniform:  # the same canvas for every item, each centred on its bounding box
        W = max(c.shape[1] for _, c, _ in cuts)
        H = max(c.shape[0] for _, c, _ in cuts)
        out = []
        for name, c, fn in cuts:
            cv = np.zeros((H, W, 4))
            oy, ox = (H - c.shape[0]) // 2, (W - c.shape[1]) // 2
            cv[oy:oy + c.shape[0], ox:ox + c.shape[1]] = c
            out.append((name, cv, fn))
        cuts = out
    for name, c, fn in cuts:
        G.put(name, c, bg, sheet, fn(c) if fn else {}, max_side)


def round_fn(**extra):
    def f(img):
        m, _ = circle_meta(img)
        m.update(extra)
        return m
    return f


def chai_group():
    G = Group("chai")
    names = ["pan-empty", "pan-water", "pan-leaves", "pan-tea", "pan-milky", "pan-spiced", "pan-boil-tea", "pan-boil-milky", "pan-foam"]
    vessel_states(G, "c1-chai-pan-states-v1.png", names, 3, 3, anchor="rim",
                  extra=lambda n, img: {"inner_r": inner_radius(img)})
    G.done()
    return G


def inner_radius(img):
    """The steel wall's inside edge on a top-down pan: the first big brightness change going in
    from the rim towards the centre (median over many rays)."""
    m = img[..., 3] > 128
    cx, cy, r, _ = robust_circle(m)
    lum = img[..., :3].mean(2)
    H, W = lum.shape
    found = []
    for deg in range(100, 260, 8):  # the left half: away from the handle (upper right)
        t = math.radians(deg)
        prof = [lum[int(cy + math.sin(t) * rr), int(cx + math.cos(t) * rr)] for rr in range(int(r * 0.55), int(r * 0.99))]
        g = np.abs(np.diff(ndi.uniform_filter1d(np.array(prof), 3)))
        found.append(int(r * 0.55) + int(np.argmax(g)))
    return round(float(np.median(found)) / W, 4)


def maani_group():
    G = Group("maani")
    a = load("m1-dough-v1.png")
    boxes = grid_boxes(a, measure_bg(a), 2, 2)
    singles(G, "m1-dough-v1.png", [("dough-pile-wheat", boxes[0], None), ("dough-pile-millet", boxes[1], None)])
    singles(G, "m1-dough-v1.png", [("dough-ball-wheat", boxes[2], round_fn()), ("dough-ball-millet", boxes[3], round_fn())])
    a = load("m2-chakla-velan-v1.png")
    H, W = a.shape[:2]
    singles(G, "m2-chakla-velan-v1.png", [("chakla", (0, 0, 755, H), round_fn()), ("velan", (755, 0, W, H), None)])
    names = ["maani-wheat-raw", "maani-wheat-half", "maani-wheat-cooked", "maani-millet-raw", "maani-millet-half",
             "maani-millet-cooked", "maani-wheat-burnt", "maani-millet-burnt", None]
    vessel_states(G, "m3-maani-states-v1.png", names, 3, 3, anchor="rim")
    singles(G, "m4-tawa-v1.png", [("tawa", None, round_fn(handle="right"))])
    singles(G, "m5-turner-wood-v1.png", [("turner", None, None)])
    G.done()
    return G


# D2's ladle stands in a small pot: its outline read off a 10 px grid (sheet px), so it can be cut out
LADLE = {"rim_y": 262, "bowl": (256.5, 522.0, 103.0), "hole": (377.5, 247.5, 21.0),
         "handle": [(286, 425), (300, 372), (318, 305), (330, 262), (340, 222), (348, 205), (362, 196), (380, 194),
                    (398, 198), (412, 210), (418, 228), (415, 250), (408, 275), (390, 320), (360, 370), (332, 413), (322, 432)]}


def cut_ladle():
    """The ladle alone, out of D2's pot: a hand-drawn outline (the bowl's circle and the handle's
    polygon, minus the handle's hole), anti-aliased at 4x; where the handle crosses the grey, the
    colour-to-alpha edge takes over."""
    from PIL import ImageDraw
    a = load("d2-ladle-trivet-bowl-v1.png")[:, :515]
    bg = measure_bg(a[:, :505], 4)
    H, W = a.shape[:2]
    S4 = 4
    m = Image.new("L", (W * S4, H * S4), 0)
    dr = ImageDraw.Draw(m)
    bx, by, br = LADLE["bowl"]
    dr.ellipse([(bx - br) * S4, (by - br) * S4, (bx + br) * S4, (by + br) * S4], fill=255)
    dr.polygon([(x * S4, y * S4) for x, y in LADLE["handle"]], fill=255)
    hx, hy, hr = LADLE["hole"]
    dr.ellipse([(hx - hr) * S4, (hy - hr) * S4, (hx + hr) * S4, (hy + hr) * S4], fill=0)
    mask = np.asarray(m.resize((W, H), Image.LANCZOS)).astype(float) / 255
    d = np.abs(a - bg).max(2)
    up = np.where(a > bg, (a - bg) / (255 - bg), (bg - a) / bg)
    c2a = np.clip(up.max(2) * 1.4, 0, 1)
    # only the handle's top, above the pot's rim, lies on the grey (its hole and edges fade there)
    yy = np.arange(H)[:, None] * np.ones((1, W))
    grey = (yy < LADLE["rim_y"]) & (d < 30)
    alpha = mask * np.where(grey, c2a, 1.0)
    rgb = np.where(grey[..., None], np.clip((a - bg) / np.maximum(c2a, 1e-3)[..., None] + bg, 0, 255), a)
    full = np.dstack([rgb, alpha * 255])
    x0, y0 = bbox(full, 8)[:2]
    img = tight(full, 12)
    h, w = img.shape[:2]
    bowl = {"bowl_cx": round((bx - x0 + 12) / w, 4), "bowl_cy": round((by - y0 + 12) / h, 4), "bowl_r": round(br / w, 4)}
    return img, bg, bowl


def daar_group():
    G = Group("daar")
    names = ["pot-empty", "pot-oil", "pot-seeds", "pot-onion", "pot-tomato", "pot-chilli", "pot-daar", "pot-tadka", "pot-stir"]
    vessel_states(G, "d1-daar-pot-states-v1.png", names, 3, 3, anchor="rim")
    # D2: three panels split by thin white lines (ChatGPT drew them): cut inside each panel
    # (the ladle's own pot isn't wanted: the ladle is cut out of it below)
    singles(G, "d2-ladle-trivet-bowl-v1.png", [("daar-bowl-trivet", (523, 6, 1022, 1018), round_fn()),
                                               ("veg-bowl", (1034, 6, 1530, 1018), round_fn())], local_bg=True)
    img, bg, m = cut_ladle()  # m: the ladle's round bowl, from its outline
    m["note"] = "cut out of D2's pot along a hand-drawn outline (build/cut_cook_v3.py LADLE)"
    G.put("ladle", img, bg, "d2-ladle-trivet-bowl-v1.png", m)
    G.done()
    return G


def chaat_group():
    G = Group("chaat")
    singles(G, "t1-chaat-bowl-side-v1.png", [("bowl-side", None, bowl_side_meta)], glass=True)
    names = ["pot-chana", "pot-potato", "pot-onion", "pot-chilli", "pot-sev", "pot-dahi", "pot-imli", "pot-chutney", "pot-dhania"]
    vessel_states(G, "t2-chaat-pots-side-v1.png", names, 3, 3, glass=True, anchor="bottom")
    G.done()
    return G


def bowl_side_meta(img):
    """The side-on glass bowl: its rim line and its inside (where the layers go), as fractions."""
    a = img[..., 3] > 60
    H, W = a.shape
    ys, xs = np.nonzero(a)
    top, bottom = ys.min(), ys.max()
    return {"rimY": round(top / H, 4), "bottomY": round(bottom / H, 4), "left": round(xs.min() / W, 4), "right": round(xs.max() / W, 4)}


def samosa_group():
    G = Group("samosa")
    # S1: the strip is anchored on its right end (it stays put while the left end folds over)
    a = load("s1-samosa-fold-v1.png")
    bg = measure_bg(a)
    boxes = grid_boxes(a, bg, 3, 2)
    items = []
    for i, b in enumerate(boxes):
        x0, y0, x1, y1 = b
        c = cut(a[y0:y1, x0:x1], bg)
        m = c[..., 3] > 128
        xs = np.nonzero(m.any(0))[0]
        right = xs.max()
        colm = m[:, right - 30: right - 10].any(1)
        ys = np.nonzero(colm)[0]
        items.append((f"fold-{i + 1}", c, (right, (ys.min() + ys.max()) / 2)))
    placed, (ax, ay) = registered([(c, anc) for _, c, anc in items], "right-end")
    for (name, _, _), img in zip(items, placed):
        H, W = img.shape[:2]
        G.put(name, img, bg, "s1-samosa-fold-v1.png", {"registered": "the strip's right end", "anchor": [round(ax / W, 4), round(ay / H, 4)]})
    singles(G, "s2-board-v1.png", [("board", None, None)])
    singles(G, "s3-karahi-v1.png", [("karahi", None, karahi_meta)])
    a = load("s4-plate-jharo-v1.png")
    H, W = a.shape[:2]
    singles(G, "s4-plate-jharo-v1.png", [("plate", (0, 0, 850, H), round_fn()), ("jharo", (850, 0, W, H), None)])
    a = load("s5-fillings-top-v1.png")
    boxes = grid_boxes(a, measure_bg(a), 3, 3)
    names = ["fill-chundo", "fill-potato", "fill-onion", "fill-chilli", "fill-dhania", "fill-peas", "fill-carrot", "fill-cabbage"]
    singles(G, "s5-fillings-top-v1.png", [(n, b, None) for n, b in zip(names, boxes)], uniform=True)
    G.done()
    return G


def karahi_meta(img):
    """Two loop handles: fit the body with the left and right rays dropped (the robust fit does it)."""
    m, (cx, cy, r) = circle_meta(img)
    # the oil: the golden disc inside
    rgb = img[..., :3]
    oil = (rgb[..., 0] - rgb[..., 2] > 70) & (img[..., 3] > 200)
    oil = ndi.binary_opening(oil, iterations=3)
    lab, n = ndi.label(oil)
    if n:
        oil = lab == (np.argmax(np.bincount(lab.ravel())[1:]) + 1)
        m["oil"] = round(math.sqrt(oil.sum() / math.pi) / r, 4)
    return m


def sekelo_group():
    G = Group("sekelo")
    # K1: registered on the rack itself (its left end and lower rail)
    names = ["rack-0", "rack-1", "rack-2", "rack-3", "rack-4", None]
    vessel_states(G, "k1-rack-0-4-v1.png", names, 3, 2, anchor="rack", extra=rack_meta)
    # K2: the plate is the anchor (the skewers' handles stick out past it)
    vessel_states(G, "k2-plate-1-4-v1.png", ["plate-1", "plate-2", "plate-3", "plate-4"], 2, 2, anchor="rim")
    singles(G, "k3-grill-v1.png", [("grill", None, grill_meta)])
    a = load("k4-pieces-v1.png")
    boxes = grid_boxes(a, measure_bg(a), 3, 3)
    names = ["meat-raw", "meat-grilled", "meat-charred", "onion-raw", "onion-grilled", "tomato-raw", "tomato-grilled", "pepper-raw", "pepper-grilled"]
    singles(G, "k4-pieces-v1.png", [(n, b, None) for n, b in zip(names, boxes)], uniform=True)
    a = load("k5-heaps-v1.png")
    boxes = grid_boxes(a, measure_bg(a), 2, 2)
    singles(G, "k5-heaps-v1.png", [(n, b, None) for n, b in zip(["heap-meat", "heap-onion", "heap-tomato", "heap-pepper"], boxes)], uniform=True)
    G.done()
    return G


def rack_meta(name, img):
    """The rack's four skewer places (x as fractions) and the two rails' y, measured on rack-4."""
    return {}


def grill_meta(img):
    """The grill's two bars (y) and the firebox's inside (x0, x1), as fractions."""
    rgb = img[..., :3]
    H, W = rgb.shape[:2]
    lum = rgb.mean(2)
    # the bars: long bright horizontal lines across the middle
    mid = lum[:, int(W * 0.25): int(W * 0.75)]
    bright = (mid > 150).mean(1)
    rows = np.nonzero(bright > 0.6)[0]
    bars = []
    if len(rows):
        groups = np.split(rows, np.nonzero(np.diff(rows) > 3)[0] + 1)
        bars = [round(float(g.mean()) / H, 4) for g in groups if len(g) >= 3]
    return {"bars_y": bars}


# ---------------------------------------------------------------- run

GROUPS = {"hob": None, "faces": faces_group, "chai": chai_group, "maani": maani_group, "daar": daar_group,
          "chaat": chaat_group, "samosa": samosa_group, "sekelo": sekelo_group}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    args = ap.parse_args()
    only = set(filter(None, args.only.split(",")))
    from face_eyes_v3 import EYES
    FACE_EYES.update(EYES)
    for name in GROUPS:
        if only and name not in only:
            continue
        print(name)
        if name == "hob":
            hob_group(HOB_CAP_R)
        else:
            GROUPS[name]()


if __name__ == "__main__":
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main()
