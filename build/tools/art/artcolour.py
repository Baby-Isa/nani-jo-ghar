#!/usr/bin/env python3
"""The colour and look tool (Zafar's yes, 6 Nov; art-pipeline.md "Art tools"): numbers on any picture or cut-out before a
model looks, in the art judge's PASS / FLAG / FAIL words.

  python3 build/tools/art/artcolour.py assets/cook/items/shelf-*-f.webp            # one line per picture, batch by folder
  python3 build/tools/art/artcolour.py DIR --sheet out.png --json out.json -v      # every picture under DIR, a contact sheet
  python3 build/tools/art/artcolour.py --scan assets --worst 36 --sheet worst.png  # the retrospective: every asset
  python3 build/tools/art/artcolour.py x.webp --size-class M                       # proportion against a size class
  python3 build/tools/art/artcolour.py --changed [REF]                             # only pictures changed since REF (checks.mjs `art`)
  python3 build/tools/art/artcolour.py --swatch build/tools/art/data/house-swatch.png   # the house swatch strip
  python3 build/tools/art/artcolour.py --house-words                               # the house colours in words (the block)

Per picture:
  colour   the main colours (k-means in CIE Lab on the opaque pixels, weighted by share), each matched to Sanzo Wada's 159
           colours (data/wada-colors.json, MIT, see its LICENSE) by CIEDE2000 with lightness weighted down (kL 2: a tint or
           shade of a Wada colour is near); whether it is in the house family (Wada 283, 249, 311, 200 and the colours the
           palette review named); FLAG off-palette: a main colour over off_palette_share that is over off_palette_de from
           every Wada colour. Neutrals (steel, glass, white, black) are reported, never off-palette.
  light    (cut-outs) the light direction from the shading inside each material on the outer ring; FLAG when it is clear
           and not from the upper left, above or the left (the art bible). Not on people (look-rules.json light.skip).
  halo     (cut-outs) FLAG a near-white band just inside the alpha edge, much whiter than the band behind it.
  shadow   (cut-outs) FAIL a baked shadow: dark, low-chroma soft alpha below the body, a dark skirt wider than the body, or
           an opaque neutral strip under it that grows lighter away from a dark contact line (Fable, 6 Nov: pan-pour);
           FLAG a faint (warm-tinted, small) soft shadow.
  camera   (round items by name) rim = the top arc's height over the body's width, about 0 from the side, 1 from above.
  shipped  whether a page, script, style or data file names the picture or builds its path (look-rules.json "shipped"):
           named, built, lab (a lab page only) or none; the summary counts shipped and unreferenced apart.
  size     (cut-outs with a size class) FLAG when the piece's height in its canvas is off its class's target (token steps,
           Zafar 6 Nov: L 100 %, M ~90 %, S >= ~80 % of the slot; data/look-rules.json "sizes").
  batch    (a batch: the pictures of one folder, or --batch) FLAG the odd ones out in gloss, saturation, light direction,
           specular position, edge whiteness, and lid family: the pictures of one surface come from one run; on a named
           surface a camera range over batch.camera_range; a strong colour with little of it in the house family (house look).
Thresholds are in data/look-rules.json. Exit 1 when any picture FAILs, 2 when there is nothing to measure, else 0.
NOT measured: style, anatomy, likeness, text, framing (artjudge.py and a model's look). A PASS is only that the numbers
are fine."""
import argparse
import fnmatch
import functools
import glob
import json
import math
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
DATA = os.path.join(HERE, "data")
RULES = os.path.join(DATA, "look-rules.json")
IMG_EXT = (".png", ".webp", ".jpg", ".jpeg")


# ---------------------------------------------------------------- colour science (sRGB D65 -> CIE Lab, CIEDE2000)

def lab(rgb):
    """sRGB 0..255 (..., 3) -> CIE Lab (D65)."""
    c = np.asarray(rgb, np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    m = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def de2000(l1, l2, kL=1.0, kC=1.0, kH=1.0):
    """CIEDE2000 between Lab arrays (broadcasting)."""
    l1, l2 = np.asarray(l1, np.float64), np.asarray(l2, np.float64)
    L1, a1, b1 = l1[..., 0], l1[..., 1], l1[..., 2]
    L2, a2, b2 = l2[..., 0], l2[..., 1], l2[..., 2]
    cb = (np.hypot(a1, b1) + np.hypot(a2, b2)) / 2
    g = 0.5 * (1 - np.sqrt(cb ** 7 / (cb ** 7 + 25.0 ** 7)))
    a1p, a2p = (1 + g) * a1, (1 + g) * a2
    c1p, c2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p, h2p = np.degrees(np.arctan2(b1, a1p)) % 360, np.degrees(np.arctan2(b2, a2p)) % 360
    zero = (c1p * c2p) == 0
    dlp, dcp = L2 - L1, c2p - c1p
    dhp = h2p - h1p
    dhp = np.where(dhp > 180, dhp - 360, np.where(dhp < -180, dhp + 360, dhp))
    dhp = np.where(zero, 0, dhp)
    dHp = 2 * np.sqrt(c1p * c2p) * np.sin(np.radians(dhp / 2))
    lbp, cbp = (L1 + L2) / 2, (c1p + c2p) / 2
    hs = h1p + h2p
    hbp = np.where(np.abs(h1p - h2p) > 180, np.where(hs < 360, (hs + 360) / 2, (hs - 360) / 2), hs / 2)
    hbp = np.where(zero, hs, hbp)
    t = (1 - 0.17 * np.cos(np.radians(hbp - 30)) + 0.24 * np.cos(np.radians(2 * hbp)) + 0.32 * np.cos(np.radians(3 * hbp + 6))
         - 0.20 * np.cos(np.radians(4 * hbp - 63)))
    dth = 30 * np.exp(-(((hbp - 275) / 25) ** 2))
    rc = 2 * np.sqrt(cbp ** 7 / (cbp ** 7 + 25.0 ** 7))
    sl = 1 + 0.015 * (lbp - 50) ** 2 / np.sqrt(20 + (lbp - 50) ** 2)
    sc, sh = 1 + 0.045 * cbp, 1 + 0.015 * cbp * t
    rt = -np.sin(np.radians(2 * dth)) * rc
    x, y, z = dlp / (kL * sl), dcp / (kC * sc), dHp / (kH * sh)
    return np.sqrt(np.maximum(x * x + y * y + z * z + rt * y * z, 0))


def hexof(rgb):
    return "#%02x%02x%02x" % tuple(int(round(min(255, max(0, v)))) for v in rgb)


def rgb_of_hex(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float64)


def lab_to_rgb(L):
    """CIE Lab (D65) -> sRGB 0..255, for drawing a swatch of a cluster centre."""
    L = np.asarray(L, np.float64)
    fy = (L[..., 0] + 16) / 116
    fx, fz = fy + L[..., 1] / 500, fy - L[..., 2] / 200
    inv = lambda f: np.where(f ** 3 > 216 / 24389, f ** 3, (116 * f - 16) / (24389 / 27))
    xyz = np.stack([inv(fx), inv(fy), inv(fz)], -1) * np.array([0.95047, 1.0, 1.08883])
    m = np.array([[3.2404542, -1.5371385, -0.4985314], [-0.9692660, 1.8760108, 0.0415560], [0.0556434, -0.2040259, 1.0572252]])
    c = np.clip(xyz @ m.T, 0, 1)
    return np.where(c <= 0.0031308, 12.92 * c, 1.055 * c ** (1 / 2.4) - 0.055) * 255


def words(L):
    """A colour in plain words (for the paste block and the sheet): lightness, then hue."""
    l, a, b = (float(v) for v in L)
    c, h = math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360
    if c < 9:
        return "black" if l < 20 else "charcoal" if l < 40 else "grey" if l < 72 else "light grey" if l < 90 else "white"
    if h >= 345 or h < 42:  # Lab hue angles: sRGB red 40, orange 60, yellow 103, green 136, cyan 196, blue 306
        hue = "maroon" if l < 36 else "pink" if l > 72 else "brick red" if h > 30 and c < 45 else "red"
    elif h < 68:
        hue = "brown" if l < 45 else "tan" if c < 30 and l < 75 else "peach" if l >= 75 else "cinnamon" if l < 62 else "orange"
    elif h < 92:
        hue = "brown" if l < 45 else "cream" if l > 84 and c < 35 else "stone" if c < 20 else "khaki" if l < 66 else "ochre"
    elif h < 115:
        hue = "olive" if l < 60 else "yellow"
    elif h < 185:
        hue = "green"
    elif h < 235:
        hue = "teal"
    elif h < 300:
        hue = "blue"
    else:
        hue = "lilac" if l > 70 else "purple"
    fixed = ("maroon", "brown", "olive", "cream", "peach", "pink", "lilac", "stone", "tan", "cinnamon", "khaki", "brick red")
    tone = "" if hue in fixed else "deep " if l < 35 else "dark " if l < 50 else "pale " if l > 85 else "light " if l > 75 else ""
    mute = "greyish " if c < 15 and hue not in ("stone", "tan", "cream") else "soft " if c < 26 and hue not in ("stone", "tan", "cream", "brown") else ""
    return (tone + mute + hue).strip()


# ---------------------------------------------------------------- data

@functools.lru_cache(maxsize=4)
def rules(path=RULES):
    return json.load(open(path))


@functools.lru_cache(maxsize=1)
def wada():
    """[(name, hex, rgb, lab, combinations)], and the house family's indices (look-rules.json "house")."""
    raw = json.load(open(os.path.join(DATA, "wada-colors.json")))
    rows = [{"name": c["name"], "hex": c["hex"], "combos": c["combinations"]} for c in raw]
    labs = lab(np.array([rgb_of_hex(c["hex"]) for c in rows]))
    return rows, labs


@functools.lru_cache(maxsize=1)
def combos():
    """Wada's combinations: {combination id: [indices of its colours in wada()]} (348 of 2 to 4 colours)."""
    rows, _ = wada()
    out = {}
    for i, c in enumerate(rows):
        for k in c["combos"]:
            out.setdefault(int(k), []).append(i)
    return out


def combination_words(combo):
    """One combination's colours as one line of words: name (plain words)."""
    rows, labs = wada()
    return ", ".join("%s (%s)" % (rows[i]["name"], words(labs[i])) for i in combos()[int(combo)])


def palette_fit(cols, R=None, name=""):
    """Zafar's one-palette rule (6 Nov): every main colour of an item near a colour of ONE Wada combination. cols: the
    main colours ({lab, share, chroma}). Returns {main, combo, colours, fit, missing, off, allowed}: combo is the best
    combination (every main colour covered, the tightest; else the most share covered), off the main colours over
    exception_de from every Wada colour (an EXCEPTION), allowed Zafar's word when the file is on palette.allow."""
    R = R or rules()
    P, kL = R["palette"], R["colour"]["kL"]
    rows, labs = wada()
    tinted = [c for c in cols if c["chroma"] >= P["neutral_chroma"] and c["lab"][0] >= P["dark_l"]]
    tot = sum(c["share"] for c in tinted)
    main = [dict(c, tshare=c["share"] / tot) for c in tinted if tot and c["share"] / tot >= P["main_share"]]
    rel = os.path.relpath(os.path.abspath(name), REPO) if name else ""
    allowed = next((v for g, v in P.get("allow", {}).items() if not g.startswith("_") and rel and (fnmatch.fnmatch(rel, g) or fnmatch.fnmatch(os.path.basename(rel), g))), None)
    out = {"main": [], "combo": None, "colours": [], "fit": True, "missing": [], "off": [], "allowed": allowed}
    if not main:
        return out
    D = de2000(np.array([c["lab"] for c in main], float)[:, None], labs[None], kL=kL)
    near = D <= P["combo_de"]
    sh = np.array([c["tshare"] for c in main])
    best = None
    for k, idx in combos().items():
        cov = near[:, idx].any(1)
        worst = float(D[:, idx].min(1).max())
        key = (bool(cov.all()), float(sh[cov].sum()), -worst)
        if best is None or key > best[0]:
            best = (key, k, cov)
    (full, _, _), k, cov = best
    for c, d, ok in zip(main, D, cov):
        i = int(d.argmin())
        out["main"].append({"hex": c["hex"], "share": round(c["tshare"], 3), "words": c.get("words", ""), "nearest": rows[i]["name"], "de": round(float(d[i]), 1), "in_combo": bool(ok)})
    out["combo"], out["fit"] = k, full
    out["colours"] = [rows[i]["name"] for i in combos()[k]]
    out["missing"] = [m["hex"] for m in out["main"] if not m["in_combo"]]
    out["off"] = [m for m in out["main"] if m["de"] > P["exception_de"]]
    return out


def house(R=None):
    R = R or rules()
    rows, _ = wada()
    combos, names = set(R["house"]["combinations"]), {n.lower() for n in R["house"]["names"]}
    return [i for i, c in enumerate(rows) if combos & set(c["combos"]) or c["name"].lower() in names]


def house_words(R=None):
    """The house colours as one line of words for the paste block: name (plain words), in the order of the book."""
    rows, labs = wada()
    return ", ".join("%s (%s)" % (rows[i]["name"], words(labs[i])) for i in house(R))


def swatch(out, R=None, w=1200, h=160, combo=None):
    """The house swatch strip (or one Wada combination's, combo): plain blocks, no text (a reference ChatGPT must not
    copy letters from)."""
    rows, _ = wada()
    idx = combos()[int(combo)] if combo is not None else house(R)
    im = Image.new("RGB", (w, h), (255, 255, 255))
    d = ImageDraw.Draw(im)
    step = w / len(idx)
    for k, i in enumerate(idx):
        d.rectangle([int(k * step) + 4, 4, int((k + 1) * step) - 4, h - 5], fill=tuple(int(v) for v in rgb_of_hex(rows[i]["hex"])))
    im.save(out)
    return out


# ---------------------------------------------------------------- measuring

def load(path, max_side):
    """RGB (0..255 float, straight alpha), alpha (0..1) and the original size, measured at most max_side px."""
    im = Image.open(path)
    im.load()
    return prep(im, max_side) + (im.size,)


def prep(im, max_side=512):
    """A PIL image -> straight-alpha RGB (0..255) and alpha (0..1), at most max_side px (premultiplied resize)."""
    im = im.convert("RGBA")
    k = max(im.size) / float(max_side)
    if k > 1:
        im = im.convert("RGBa").resize((max(1, round(im.width / k)), max(1, round(im.height / k))), Image.LANCZOS).convert("RGBA")
    a = np.asarray(im, np.float64)
    return a[..., :3], a[..., 3] / 255.0


def kmeans(x, k, iters=20, seed=0):
    """Plain k-means with a k-means++ start (numpy only). Returns centres, labels."""
    rng = np.random.default_rng(seed)
    n = len(x)
    k = min(k, n)
    c = [x[rng.integers(n)]]
    d2 = ((x - c[0]) ** 2).sum(1)
    for _ in range(1, k):
        p = d2 / d2.sum() if d2.sum() > 0 else None
        c.append(x[rng.choice(n, p=p)])
        d2 = np.minimum(d2, ((x - c[-1]) ** 2).sum(1))
    c = np.array(c)
    lb = np.zeros(n, int)
    for _ in range(iters):
        dist = ((x[:, None, :] - c[None]) ** 2).sum(2)
        lb = dist.argmin(1)
        nc = np.array([x[lb == j].mean(0) if (lb == j).any() else c[j] for j in range(k)])
        if np.allclose(nc, c):
            break
        c = nc
    return c, lb


def main_colours(L, R):
    """The main colours of a set of Lab pixels: [{lab, share}] by share, near-duplicates merged."""
    C = R["colour"]
    if len(L) > C["sample"]:
        L = L[np.random.default_rng(1).choice(len(L), C["sample"], replace=False)]
    cen, lb = kmeans(L, C["k"])
    share = np.bincount(lb, minlength=len(cen)) / len(lb)
    groups = [[cen[j], share[j]] for j in range(len(cen)) if share[j] > 0]
    merged = True
    while merged and len(groups) > 1:
        merged = False
        for i in range(len(groups)):
            for j in range(i + 1, len(groups)):
                if de2000(groups[i][0], groups[j][0]) < C["merge_de"]:
                    wi, wj = groups[i][1], groups[j][1]
                    groups[i] = [(groups[i][0] * wi + groups[j][0] * wj) / (wi + wj), wi + wj]
                    del groups[j]
                    merged = True
                    break
            if merged:
                break
    groups.sort(key=lambda g: -g[1])
    return [{"lab": g[0], "share": float(g[1])} for g in groups if g[1] >= C["min_share"]]


def match(Lc, R):
    """Nearest Wada colour and nearest house colour of one Lab colour."""
    rows, labs = wada()
    kL = R["colour"]["kL"]
    d = de2000(Lc[None], labs, kL=kL)
    i = int(d.argmin())
    hidx = house(R)
    hd = d[hidx]
    j = hidx[int(hd.argmin())]
    return {"name": rows[i]["name"], "hex": rows[i]["hex"], "de": round(float(d[i]), 1)}, \
           {"name": rows[j]["name"], "hex": rows[j]["hex"], "de": round(float(d[j]), 1)}


def angle_word(t):
    return ["the right", "the upper right", "above", "the upper left", "the left", "the lower left", "below", "the lower right"][int(((t + 22.5) % 360) // 45)]


def light(Lab, op, R):
    """Light direction from the shading inside each material on the outer ring of the piece."""
    P = R["light"]
    if op.sum() < 200:
        return None
    ys, xs = np.nonzero(op)
    cx, cy = xs.mean(), ys.mean()
    hw, hh = max(1.0, (xs.max() - xs.min()) / 2), max(1.0, (ys.max() - ys.min()) / 2)
    dist = ndi.distance_transform_edt(op)
    ring = op & (dist <= max(2.0, P["ring"] * dist.max()))
    ry, rx = np.nonzero(ring)
    if len(ry) < 150:
        return None
    px = Lab[ring]
    feat = np.stack([px[:, 1], px[:, 2], px[:, 0] * P["l_weight"]], 1)
    sub = np.random.default_rng(2).choice(len(feat), min(len(feat), 12000), replace=False)
    cen, _ = kmeans(feat[sub], P["segments"])
    seg = ((feat[:, None, :] - cen[None]) ** 2).sum(2).argmin(1)
    x, y = (rx - cx) / hw, (ry - cy) / hh
    dev = np.zeros(len(px))
    xc, yc = np.zeros(len(px)), np.zeros(len(px))
    for s in range(len(cen)):
        m = seg == s
        if m.sum() < 20:
            continue
        dev[m] = np.clip(px[m, 0] - px[m, 0].mean(), -35, 35)
        xc[m], yc[m] = x[m] - x[m].mean(), y[m] - y[m].mean()
    A = np.array([[(xc * xc).sum(), (xc * yc).sum()], [(xc * yc).sum(), (yc * yc).sum()]])
    rhs = np.array([(xc * dev).sum(), (yc * dev).sum()])
    try:
        gx, gy = np.linalg.solve(A + np.eye(2) * 1e-6, rhs)
    except np.linalg.LinAlgError:
        return None
    if math.hypot(gx, gy) > 60:  # a degenerate fit (a thin stick): no reading
        return None
    t = math.degrees(math.atan2(-gy, gx)) % 360
    # roundness of the piece without its handles: a bowl, pan or glass seen from above is round, and its inside is lit
    # on the far (lower-right) wall by an upper-left light, so a lower-right reading there is the bible's light
    # (the largest circle inside the piece against the piece's area: 1 for a disc, about 0.9 with a handle, 0.79 for a square)
    filled = ndi.binary_fill_holes(op)
    r_in = ndi.distance_transform_edt(filled).max()
    round_ = float(math.pi * r_in * r_in / max(1, filled.sum()))
    q = {"UL": (x < 0) & (y < 0), "UR": (x >= 0) & (y < 0), "LL": (x < 0) & (y >= 0), "LR": (x >= 0) & (y >= 0)}
    qd = {k: round(float(dev[m].mean()), 1) if m.sum() > 10 else None for k, m in q.items()}
    best = max((k for k in qd if qd[k] is not None), key=lambda k: qd[k])
    return {"angle": round(t), "strength": round(float(math.hypot(gx, gy)), 1), "quadrants": qd, "brightest": best, "round": round(round_, 2)}


def halo(Lab, alpha, R):
    P = R["halo"]
    solid = alpha >= 0.5
    if solid.sum() < 200:
        return None
    d = ndi.distance_transform_edt(solid)
    edge = (solid & (d <= P["edge_px"])) | ((alpha > 0.25) & ~solid)
    inner = solid & (d >= P["inner_from"]) & (d <= P["inner_to"])
    if inner.sum() < 30:
        return None
    white = (Lab[..., 0] >= P["white_l"]) & (np.hypot(Lab[..., 1], Lab[..., 2]) <= P["white_c"])
    return {"edge": round(float(white[edge].mean()), 3), "inner": round(float(white[inner].mean()), 3)}


def baked_shadow(Lab, alpha, R):
    P = R["shadow"]
    cov, solid = alpha > 0.05, alpha >= 0.9
    if solid.sum() < 200:
        return None
    ys, xs = np.nonzero(cov)
    y0, y1 = ys.min(), ys.max()
    band = np.zeros_like(cov)
    band[int(y1 - P["band"] * (y1 - y0 + 1)):y1 + 1] = True
    C = np.hypot(Lab[..., 1], Lab[..., 2])
    dark = (Lab[..., 0] < P["dark_l"]) & (C < P["dark_c"])
    lo, hi = P["soft_alpha"]
    beyond = ~ndi.binary_dilation(solid, iterations=2)
    # below the body: under the lowest row of the filled piece in that column (clear glass is soft inside, not below)
    body = ndi.binary_fill_holes(ndi.binary_closing(alpha >= 0.5, iterations=4))
    has = body.any(0)
    bottom = np.where(has, body.shape[0] - 1 - np.argmax(body[::-1], 0), -1)
    below = np.arange(body.shape[0])[:, None] > bottom[None, :]
    shows = alpha * (1 - Lab[..., 0] / 100) >= P["shows"]  # visibly dark on a light ground (clear glass's faint dark wall is not)
    soft = cov & beyond & below & (alpha >= lo) & (alpha <= hi) & dark & band & shows
    soft_share = soft.sum() / max(1, (cov & band).sum())
    # a solid dark skirt: rows of the bottom band wider than the body above them, the extra pixels dark and neutral
    sy, sx = np.nonzero(solid)
    sy0, sy1 = sy.min(), sy.max()
    rows = range(int(sy0 + 0.4 * (sy1 - sy0)), int(sy0 + 0.75 * (sy1 - sy0)) + 1)
    lefts = [np.nonzero(solid[r])[0].min() for r in rows if solid[r].any()]
    rights = [np.nonzero(solid[r])[0].max() for r in rows if solid[r].any()]
    skirt = 0
    if lefts:
        l, r = np.median(lefts), np.median(rights)
        bw = max(1.0, r - l)
        outside = np.zeros_like(solid)
        outside[:, :max(0, int(l - 0.08 * bw))] = True
        outside[:, int(r + 0.08 * bw) + 1:] = True
        sk = solid & band & outside & dark
        skirt = sk.sum()
        skirt_share = skirt / max(1, (solid & band).sum())
    else:
        skirt_share = 0.0
    # a faint soft shadow (FLAG): the same soft pixels, but warm-tinted allowed and a smaller share (a honey jar's)
    F = P["faint"]
    dark_f = (Lab[..., 0] < P["dark_l"]) & (C < F["dark_c"])
    faint = cov & beyond & below & (alpha >= lo) & (alpha <= hi) & dark_f & band & shows
    faint_share = faint.sum() / max(1, (cov & band).sum())
    out = {"soft_px": int(soft.sum()), "soft": round(float(soft_share), 3), "skirt_px": int(skirt), "skirt": round(float(skirt_share), 3),
           "faint_px": int(faint.sum()), "faint": round(float(faint_share), 3)}
    out.update(opaque_shadow(Lab, alpha, R))
    return out


def opaque_shadow(Lab, alpha, R):
    """An opaque baked shadow (Fable, 6 Nov: pan-pour's crescent): per column, the run of opaque, neutral pixels at the
    bottom edge that grows lighter going down from a dark contact line (a cast shadow fades away from the object; an
    object's own base shades darker towards its edge), its contact darker than the body just above it. span: the longest
    stretch of such columns across the piece's width; depth: their pixels per column of the piece's width."""
    P = R["shadow"]["opaque"]
    solid = alpha >= 0.5
    ys, xs = np.nonzero(solid)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    H, W = y1 - y0 + 1, x1 - x0 + 1
    L, C = Lab[..., 0], np.hypot(Lab[..., 1], Lab[..., 2])
    neutral = solid & (C < P["dark_c"])
    has = solid.any(0)
    bottom = np.where(has, solid.shape[0] - 1 - np.argmax(solid[::-1], 0), -1)
    band_top, max_run, min_run = y1 - R["shadow"]["band"] * H, P["max_run"] * H, max(P["min_run"], int(P["min_run_h"] * H))
    cols, px = [], 0
    for x in range(x0, x1 + 1):
        b = bottom[x]
        if b < band_top or not neutral[b, x]:
            continue
        y, prev, lmin, ymin = b, L[b, x], L[b, x], b
        while y > 0 and neutral[y - 1, x] and L[y - 1, x] <= prev + P["tol"] and b - y < max_run:
            y -= 1
            prev = L[y, x]
            if prev < lmin:
                lmin, ymin = prev, y
        n = b - ymin + 1
        if n < min_run or lmin >= R["shadow"]["dark_l"]:
            continue
        rise = L[max(ymin, b - 2):b + 1, x].max() - lmin  # the very edge is often soft: the brightest of the bottom 3
        above = [yy for yy in range(ymin - 1, max(-1, ymin - 1 - 3 * P["above"]), -1) if solid[yy, x]][:P["above"]]
        if above and rise >= P["rise"] and np.median(L[above, x]) - lmin >= P["gap"]:
            cols.append(x)
            px += n
    best = cur = 0
    last = None
    for x in cols:
        cur = cur + 1 if last is not None and x - last <= 2 else 1
        best, last = max(best, cur), x
    return {"opaque_span": round(best / W, 3), "opaque_depth": round(px / W, 2)}


def is_round(name, R):
    """A round vessel by its file name (look-rules.json camera.names): the camera proxy is read only on these."""
    base = os.path.basename(name).lower()
    return any(w in base for w in R["camera"]["names"])


def camera(alpha, R):
    """Camera height proxy for a round item (Fable, 6 Nov): half-ellipses fitted to the top and the bottom edge of the
    piece's body (handles and spouts opened away) across its width; rim = the top arc's height over the body's width, about
    0 seen from the side and 1 straight down, read only when both arcs fit and agree (a cylinder's rim and base)."""
    P = R["camera"]
    k = max(alpha.shape) / float(P["side"])
    if k > 1:  # measured on a small copy: the opening is the slow part
        alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).resize((max(1, round(alpha.shape[1] / k)), max(1, round(alpha.shape[0] / k))), Image.BILINEAR)) / 255.0
    solid = alpha >= 0.5
    if solid.sum() < 300:
        return None
    ys, xs = np.nonzero(solid)
    size = max(ys.max() - ys.min(), xs.max() - xs.min()) + 1
    r = max(1, int(P["open"] * size))
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    body = ndi.binary_opening(solid, structure=(xx * xx + yy * yy) <= r * r)
    lb, n = ndi.label(body)
    if n == 0:
        return None
    body = lb == (np.bincount(lb.ravel())[1:].argmax() + 1)
    cols = np.nonzero(body.any(0))[0]
    if len(cols) < 20:
        return None
    a = (cols.max() - cols.min() + 1) / 2.0
    s = np.sqrt(np.clip(1 - ((cols - (cols.max() + cols.min()) / 2.0) / a) ** 2, 0, 1))
    out = {}
    for side, edge, sign in (("top", np.argmax(body[:, cols], 0), -1), ("bottom", body.shape[0] - 1 - np.argmax(body[::-1, cols], 0), 1)):
        y = edge.astype(float)
        keep = np.ones(len(y), bool)
        for _ in range(3):  # trim the points far off the arc (a knob, a foot, a drip) and fit again
            M = np.stack([np.ones(keep.sum()), sign * s[keep]], 1)
            c, b = np.linalg.lstsq(M, y[keep], rcond=None)[0]
            err = np.abs(c + sign * b * s - y)
            keep = err <= max(2.5 * np.median(err), 1.5)
        e = float(np.sqrt((err[keep] ** 2).mean())) / (2 * a)
        if 0 <= b / a <= P["max_ratio"] and e <= P["max_err"] and keep.mean() >= 0.6:
            out[side] = round(float(b / a), 2)
    if len(out) < 2 or abs(out["top"] - out["bottom"]) > P["agree"]:
        return {**out, "rim": None}  # a dome lid, a carton's gable, a bottle's foot: the arcs disagree, no reading
    out["rim"] = out["top"]
    return out


def gloss(Lab, op, R):
    P = R["gloss"]
    if op.sum() < 200:
        return None, None
    Lm = np.where(op, Lab[..., 0], 0)
    cnt = ndi.uniform_filter(op.astype(float), 9)
    loc = ndi.uniform_filter(Lm, 9) / np.maximum(cnt, 1e-3)
    spec = op & (Lab[..., 0] >= P["spec_l"]) & (np.hypot(Lab[..., 1], Lab[..., 2]) <= P["spec_c"]) & (Lab[..., 0] - loc >= P["local_dl"])
    g = spec.sum() / op.sum()
    if spec.sum() < 5:
        return round(float(g), 4), None
    ys, xs = np.nonzero(op)
    cx, hw = (xs.max() + xs.min()) / 2, max(1.0, (xs.max() - xs.min()) / 2)
    sx = np.nonzero(spec)[1]
    return round(float(g), 4), round(float(((sx - cx) / hw).mean()), 2)


def wood(res, name, R):
    """What reads as light wood (look-rules.json "wood"): the lid of a lidded item by name, or a main colour of an item
    whose name says wood; None when nothing does."""
    W = R.get("wood")
    if not W or not name:
        return None
    base = os.path.basename(name).lower()
    if any(fnmatch.fnmatch(os.path.relpath(os.path.abspath(name), REPO), g) for g in R["light"]["skip"]):
        return None  # people and hands: a hand on a rolling pin is skin, not wood
    toks = re.split(r"[-_.]", os.path.splitext(base)[0])
    if len(toks) > 1 and toks[-1] in W.get("state_suffixes", []):
        toks = toks[:-1]  # the clinic's "-tray" and "-belt" are where the item sits, not what it is
    words_ = "-".join(toks)

    def light_wood(L):
        h, c = math.degrees(math.atan2(L[2], L[1])) % 360, math.hypot(L[1], L[2])
        return W["hue"][0] <= h <= W["hue"][1] and W["l"][0] <= L[0] <= W["l"][1] and W["c"][0] <= c <= W["c"][1]
    lid = res["info"].get("lid")
    if lid and any(n in base for n in W["lid_names"]) and light_wood(lid):
        return "the lid or top (%s)" % words(lid)
    if any(n in words_ for n in W["names"]):
        hits = [c for c in res.get("colours", []) if c["share"] >= W["share"] and light_wood(c["lab"])]
        if hits:
            return "%s %s (%.0f%% of the piece)" % (hits[0]["hex"], hits[0]["words"], hits[0]["share"] * 100)
    return None


def size_class_of(path, R):
    rel = os.path.relpath(os.path.abspath(path), REPO)
    for pat, cls in R["sizes"]["items"].items():
        if fnmatch.fnmatch(rel, pat) or fnmatch.fnmatch(os.path.basename(path), pat):
            return cls
    return None


def analyse_arrays(rgb, alpha, R=None, size_class=None, name=""):
    """Every per-picture measure on one picture (straight-alpha RGB 0..255, alpha 0..1). Returns a result dict with
    `fail` and `flag` lists in the judge's words; artjudge.py calls this on its keyed cut-outs."""
    R = R or rules()
    res = {"file": name, "fail": [], "flag": [], "exception": [], "info": {}}
    Lab = lab(rgb)
    cutout = bool((alpha < 0.05).mean() > 0.02)
    res["cutout"] = cutout
    op = alpha >= 0.9
    if op.sum() < 50:
        res["flag"].append("too few opaque pixels to measure")
        return res
    # colour
    cols = []
    for c in main_colours(Lab[op], R):
        Lc = c["lab"]
        chroma = math.hypot(Lc[1], Lc[2])
        near, hs = match(Lc, R)
        row = {"hex": hexof(lab_to_rgb(Lc)), "lab": [round(float(v), 2) for v in Lc], "share": round(c["share"], 3), "words": words(Lc), "neutral": chroma < R["colour"]["neutral_chroma"] or Lc[0] < R["colour"]["dark_l"],
               "wada": near, "house": hs, "in_house": hs["de"] <= R["house"]["house_de"], "chroma": round(chroma, 1),
               "hue": round(math.degrees(math.atan2(Lc[2], Lc[1])) % 360)}
        cols.append(row)
    res["colours"] = cols
    # one palette per item (Zafar, 6 Nov): all the main colours from ONE Wada combination; a colour the book lacks is his call
    pf = palette_fit(cols, R, name)
    res["palette"] = pf
    if pf["allowed"]:
        pass
    elif pf["off"]:
        res["exception"].append("palette exception: %s fit%s no Wada colour (nearest %s): no combination holds %s; Zafar decides"
                                % (", ".join("%s %s (%.0f%% of its colour)" % (m["hex"], m["words"], m["share"] * 100) for m in pf["off"]),
                                   "s" if len(pf["off"]) == 1 else "", ", ".join("%s ΔE %.0f" % (m["nearest"], m["de"]) for m in pf["off"]),
                                   "it" if len(pf["off"]) == 1 else "them"))
    elif not pf["fit"]:
        res["fail"].append("palette: no one Wada combination holds its main colours; the nearest, %d (%s), lacks %s: recolour within one combination"
                           % (pf["combo"], ", ".join(pf["colours"]), ", ".join("%s %s (%.0f%%, nearest %s)" % (m["hex"], m["words"], m["share"] * 100, m["nearest"]) for m in pf["main"] if not m["in_combo"])))
    tinted = [c for c in cols if not c["neutral"]]
    res["info"]["house_share"] = round(sum(c["share"] for c in tinted if c["in_house"]) / max(1e-6, sum(c["share"] for c in tinted)), 2) if tinted else None
    # a rainbow (Fable, 6 Nov: the drop machine's RGBY tubes, the kite): several strong colours, none of them the house's
    Hl = R["house_look"]
    loud = [c for c in tinted if not c["in_house"] and c["chroma"] >= Hl["loud_chroma"] and c["share"] >= Hl["loud_share"]]
    hues = []
    for c in sorted(loud, key=lambda c: -c["share"]):
        if all(min(abs(c["hue"] - h), 360 - abs(c["hue"] - h)) >= Hl["hue_apart"] for h in hues):
            hues.append(c["hue"])
    res["info"]["loud_hues"] = len(hues)
    if len(hues) >= Hl["rainbow"]:
        res["flag"].append("house look: %d strong colours outside the house family (%s): a stock-art rainbow"
                           % (len(hues), ", ".join(c["words"] for c in loud[:5])))
    res["info"]["chroma"] = round(float(np.hypot(Lab[..., 1], Lab[..., 2])[op].mean()), 1)
    g, sx = gloss(Lab, alpha >= 0.5, R)  # glass is soft alpha: its highlights sit at 0.5-0.9
    res["info"]["gloss"], res["info"]["spec_x"] = g, sx
    cov = alpha > 0.05
    res["info"]["soft"] = round(float((cov & ~op).sum() / max(1, cov.sum())), 3)
    if not cutout:
        return res
    # lid: the top band of the piece
    ys, xs = np.nonzero(op)
    top = op.copy()
    top[int(ys.min() + R["batch"]["lid_band"] * (ys.max() - ys.min() + 1)):] = False
    if top.sum() > 30:
        res["info"]["lid"] = [round(float(v), 1) for v in np.median(Lab[top], 0)]
    # walnut wherever there is wood (Zafar, 6 Nov): a light oak or pine lid, board, handle or tray is a FLAG
    wd = wood(res, name, R)
    if wd:
        res["flag"].append("wood: %s reads as light oak or pine; walnut wherever there is wood (Zafar, 6 Nov)" % wd)
    # light
    li = light(Lab, op, R)
    res["info"]["light"] = li
    P = R["light"]
    if li and li["strength"] >= P["min_strength"]:
        off_arc = not (P["allowed_min"] <= li["angle"] <= P["allowed_max"])
        lo_, hi_ = P["concave_arc"]
        concave = li["round"] >= P["concave_round"] and (lo_ <= li["angle"] <= hi_)
        li["concave"] = concave
        skip = any(fnmatch.fnmatch(os.path.relpath(os.path.abspath(name), REPO), g) for g in P["skip"]) if name else False
        li["skipped"] = skip
        eye = P.get("eye_passed", {}).get(os.path.relpath(os.path.abspath(name), REPO)) if name else None
        if eye:
            li["eye_passed"] = eye
        if off_arc and not concave and not skip and not eye:  # a FAIL since 6 Nov (Zafar): on the block or in the redo pipeline
            res["fail"].append("light from %s (%d°, strength %.0f; brightest quadrant %s): the bible's light is from the upper left"
                               % (angle_word(li["angle"]), li["angle"], li["strength"], li["brightest"]))
    # halo
    ha = halo(Lab, alpha, R)
    res["info"]["halo"] = ha
    H = R["halo"]
    if ha and ha["edge"] >= H["min_share"] and ha["edge"] >= H["ratio"] * max(ha["inner"], 0.02):
        res["flag"].append("white halo: %.0f%% of the outer %d px is near-white against %.0f%% just inside it (a rim or edge glow)"
                           % (ha["edge"] * 100, H["edge_px"], ha["inner"] * 100))
    # baked shadow
    sh = baked_shadow(Lab, alpha, R)
    res["info"]["shadow"] = sh
    S = R["shadow"]
    O = S["opaque"]
    if sh and ((sh["soft_px"] >= S["min_px"] and sh["soft"] >= S["soft_share"]) or (sh["skirt_px"] >= S["min_px"] and sh["skirt"] >= S["skirt_share"])):
        res["fail"].append("baked shadow: a dark soft patch below the piece (%d px soft, %.0f%% of the bottom band; skirt %.0f%%): code draws the contact shadow"
                           % (sh["soft_px"], max(sh["soft"], sh["skirt"]) * 100, sh["skirt"] * 100))
    elif sh and sh["opaque_span"] >= O["span"] and sh["opaque_depth"] >= O["depth"]:
        res["fail"].append("baked shadow: an opaque dark strip under the piece, lighter away from the object (%.0f%% of its width, %.1f px deep): code draws the contact shadow"
                           % (sh["opaque_span"] * 100, sh["opaque_depth"]))
    elif sh and sh["opaque_span"] >= O["flag_span"] and sh["opaque_depth"] >= O["flag_depth"]:
        res["flag"].append("shadow: a short opaque dark strip under the piece (%.0f%% of its width, %.1f px deep): check by eye"
                           % (sh["opaque_span"] * 100, sh["opaque_depth"]))
    elif sh and sh["faint_px"] >= S["faint"]["min_px"] and sh["faint"] >= S["faint"]["share"]:
        res["flag"].append("shadow: a faint soft shadow below the piece (%d px, %.0f%% of the bottom band): check by eye; re-cut if it shows"
                           % (sh["faint_px"], sh["faint"] * 100))
    # camera height (round items)
    if name and is_round(name, R):
        res["info"]["camera"] = camera(alpha, R)
    # proportion
    fill = (np.nonzero((alpha > 0.5).any(1))[0])
    res["info"]["fill_h"] = round(float((fill.max() - fill.min() + 1) / alpha.shape[0]), 3) if len(fill) else None
    if size_class:
        Z = R["sizes"]
        want = Z["classes"].get(size_class)
        if want is None:
            res["flag"].append("size class %r is not in look-rules.json sizes.classes" % size_class)
        elif res["info"]["fill_h"] is not None and abs(res["info"]["fill_h"] - want) > Z["tolerance"]:
            res["flag"].append("size: fills %.0f%% of the slot height; class %s wants %.0f%% (±%.0f%%)"
                               % (res["info"]["fill_h"] * 100, size_class, want * 100, Z["tolerance"] * 100))
        res["info"]["size_class"] = size_class
    return res


def analyse(path, R=None, size_class=None):
    R = R or rules()
    rgb, alpha, size = load(path, max(R["colour"]["max_side"], 512))
    res = analyse_arrays(rgb, alpha, R, size_class or size_class_of(path, R), path)
    res["size"] = list(size)
    return res


# ---------------------------------------------------------------- batches

def two_means(v):
    """1-D split of sorted values into two groups minimising the spread inside them: (index order of low group, high group)."""
    o = np.argsort(v)
    s = np.asarray(v)[o]
    best, cut = None, 1
    for i in range(1, len(s)):
        ss = s[:i].var() * i + s[i:].var() * (len(s) - i)
        if best is None or ss < best:
            best, cut = ss, i
    return list(o[:cut]), list(o[cut:])


def batch_check(results, name, R=None, surface=True):
    """Flag the odd ones out of one batch (one surface, one run). Adds `batch:` flags to the results in place; returns
    the batch summary. surface: the batch is one surface (a named batch or --batch), so its lids must be one family too."""
    R = R or rules()
    B = R["batch"]
    items = [r for r in results if r.get("cutout")]
    summ = {"batch": name, "n": len(items), "splits": []}
    if len(items) < B["min_items"]:
        return summ
    feats = {"gloss": lambda r: r["info"].get("gloss"), "chroma": lambda r: r["info"].get("chroma"),
             "spec_x": lambda r: r["info"].get("spec_x"), "soft": lambda r: r["info"].get("soft"),
             "halo": lambda r: (r["info"].get("halo") or {}).get("edge"),
             "light": lambda r: (r["info"]["light"]["angle"] if r["info"].get("light") and r["info"]["light"]["strength"] >= R["light"]["min_strength"] else None)}
    for f, spec in B["features"].items():
        have = [(r, feats[f](r)) for r in items if feats[f](r) is not None]
        if len(have) < B["min_items"]:
            continue
        v = np.array([x for _, x in have], float)
        if spec.get("circular"):  # unwrap around the circular mean
            m = math.degrees(math.atan2(np.sin(np.radians(v)).mean(), np.cos(np.radians(v)).mean()))
            v = (v - m + 180) % 360 - 180 + m
        lo, hi = two_means(v)
        gap = abs(v[hi].mean() - v[lo].mean())
        spread = math.sqrt((v[lo].var() * len(lo) + v[hi].var() * len(hi)) / len(v))
        small = lo if len(lo) < len(hi) else hi if len(hi) < len(lo) else hi
        if gap > spec["min_gap"] and gap > B["sep"] * max(spread, spec["min_gap"] / 10) and len(small) <= spec.get("max_odd", B["max_odd"]) * len(v) and (surface or len(small) == 1 or not B["folder_odd_only"]):
            big = hi if small is lo else lo
            fmt = (lambda x: "%.0f°" % (x % 360)) if spec.get("circular") else (lambda x: "%.3g" % x)
            for i in small:
                have[i][0]["flag"].append("batch %s: %s %s against the batch's %s (%d of %d pictures): %s"
                                          % (name, spec["label"], fmt(v[i]), fmt(np.median(v[big])), len(big), len(v),
                                             "the batch splits in two" if len(small) > 1 else "the odd one out"))
            summ["splits"].append({"feature": f, "odd": [os.path.basename(have[i][0]["file"]) for i in small], "gap": round(float(gap), 3)})
    # camera height (Fable, 6 Nov): on one surface the round items' rims may span at most camera_range
    rims = [(r, r["info"]["camera"]["rim"]) for r in items if (r["info"].get("camera") or {}).get("rim") is not None]
    if surface and len(rims) >= B["min_items"]:
        lo_r, hi_r = min(rims, key=lambda t: t[1]), max(rims, key=lambda t: t[1])
        if hi_r[1] - lo_r[1] > B["camera_range"]:
            for r, v in (lo_r, hi_r):
                r["flag"].append("batch %s: camera height differs on one surface: rim %.2f (%s) to %.2f (%s), over %.2f apart (one camera per surface)"
                                 % (name, lo_r[1], os.path.basename(lo_r[0]["file"]), hi_r[1], os.path.basename(hi_r[0]["file"]), B["camera_range"]))
            summ["splits"].append({"feature": "camera", "odd": [os.path.basename(lo_r[0]["file"]), os.path.basename(hi_r[0]["file"])], "gap": round(hi_r[1] - lo_r[1], 3)})
    # house look (Fable, 6 Nov): on a surface in the house look, a strong picture with little of the house in it stands out
    H = R["house_look"]
    shares = [r["info"]["house_share"] for r in items if r["info"].get("house_share") is not None]
    if len(shares) >= B["min_items"] and np.median(shares) >= H["surface_share"]:
        for r in items:
            hs, ch = r["info"].get("house_share"), r["info"].get("chroma")
            if hs is not None and ch is not None and ch >= H["chroma"] and hs <= H["share"] and not any("house look:" in f for f in r["flag"]):
                r["flag"].append("batch %s: house look: %.0f%% of its colour in the house family at chroma %.0f, on a surface whose median is %.0f%%: strong colour off the house palette"
                                 % (name, hs * 100, ch, np.median(shares) * 100))
    # lid families: single-linkage by CIEDE2000
    lids = [(r, np.array(r["info"]["lid"])) for r in items if r["info"].get("lid")]
    if len(lids) >= B["min_items"] and (surface or B["lid_in_folders"]):
        fam = list(range(len(lids)))
        for i in range(len(lids)):
            for j in range(i + 1, len(lids)):
                if de2000(lids[i][1], lids[j][1]) < B["lid_de"]:
                    a, b = fam[i], fam[j]
                    fam = [a if x == b else x for x in fam]
        counts = {f: fam.count(f) for f in set(fam)}
        if len(counts) > 1:
            main = max(counts, key=lambda f: counts[f])
            mw = words(np.median([l for (_, l), f in zip(lids, fam) if f == main], 0))
            for (r, l), f in zip(lids, fam):
                if f != main:
                    r["flag"].append("batch %s: lid or top is %s, the batch's is %s (%d lid families in %d pictures)"
                                     % (name, words(l), mw, len(counts), len(lids)))
            summ["splits"].append({"feature": "lid", "families": len(counts)})
    return summ


def batch_key(path, mode, big=40, counts=None):
    d = os.path.dirname(path)
    if mode == "none":
        return path
    if mode == "folder" or not counts or counts.get(d, 0) <= big:
        return d
    stem = os.path.splitext(os.path.basename(path))[0].split("@")[0]
    parts = stem.split("-")
    return "%s/%s*%s" % (d, parts[0], parts[-1] if len(parts) > 1 else "")


# ---------------------------------------------------------------- shipped: by reference, not by folder (Fable, 6 Nov)

def _texts(globs, exclude):
    out = []
    for g in globs:
        for p in sorted(glob.glob(os.path.join(REPO, g), recursive=True)):
            rel = os.path.relpath(p, REPO)
            if os.path.isfile(p) and not any(fnmatch.fnmatch(rel, x) for x in exclude):
                try:
                    out.append(open(p, encoding="utf8", errors="replace").read())
                except OSError:
                    pass
    return out


def _norm(t):
    """A path as written in code or data -> the part after assets/, without its extension."""
    t = t.lstrip("./")
    if "assets/" in t:
        t = t.split("assets/", 1)[1]
    root, ext = os.path.splitext(t)
    return root if ext.lower() in IMG_EXT else t


def _template(t):
    """A JS template literal naming assets/... -> a regex on the path after assets/ (each ${...} one name, no slash);
    None when its first folder is itself a ${...} (too wide to mean anything)."""
    i = t.find("assets/")
    if i < 0:
        return None
    t, out, k = t[i + 7:], "", 0
    while k < len(t):
        if t.startswith("${", k):
            depth, k = 1, k + 2
            while k < len(t) and depth:
                depth += {"{": 1, "}": -1}.get(t[k], 0)
                k += 1
            out += "\0"
        else:
            out += t[k]
            k += 1
    if "/" not in out or "\0" in out.split("/", 1)[0]:
        return None
    return re.compile("[^/]*".join(re.escape(x) for x in out.split("\0")) + r"$")


class Refs:
    """Which pictures a page or data file references (look-rules.json "shipped"): `named` when its path is written out
    (with or without assets/ and its extension), `built` when code builds it (a template literal's pattern, or its bare
    name quoted where its folder is named too), `lab` when only a lab page does, else `none`. Shipped = named or built."""

    def __init__(self, R=None):
        S = (R or rules())["shipped"]
        self.sets = {k: self._index(_texts(S[k], S["exclude"])) for k in ("pages", "lab")}

    @staticmethod
    def _index(texts):
        paths, dirs, names, pats = set(), set(), set(), []
        for s in texts:
            for t in re.findall(r"[A-Za-z0-9_./-]*/[A-Za-z0-9_./-]+", s):
                n = _norm(t)
                if n.endswith("/"):
                    dirs.add(n.rstrip("/"))
                else:
                    paths.add(n)
                    dirs.add(os.path.dirname(n))
            names.update(re.findall(r"""["'`]([A-Za-z0-9_.-]+)["'`]""", s))
            names.update(re.findall(r"\}([A-Za-z0-9_.-]+\.(?:webp|png|jpe?g))", s))  # `${dir}name.webp`
            for t in re.findall(r"`([^`]*assets/[^`]*)`", s):
                p = _template(t)
                if p:
                    pats.append(p)
        return {"paths": paths, "dirs": dirs, "names": {_norm(n) for n in names}, "pats": pats}

    def _hit(self, ix, sub):
        stem = os.path.splitext(sub)[0]
        if stem in ix["paths"]:
            return "named"
        if any(p.match(sub) or p.match(stem) for p in ix["pats"]):
            return "built"
        if os.path.basename(stem) in ix["names"] and os.path.dirname(stem) in ix["dirs"]:
            return "built"
        return None

    def of(self, path):
        rel = os.path.relpath(os.path.abspath(path), REPO)
        if not rel.startswith("assets/"):
            return "none"
        sub = rel[len("assets/"):]
        return self._hit(self.sets["pages"], sub) or ("lab" if self._hit(self.sets["lab"], sub) else "none")


# ---------------------------------------------------------------- changed pictures (checks.mjs `art`)

def _git(*a):
    return subprocess.run(["git", "-C", REPO, *a], capture_output=True, text=True)


def changed(ref=None):
    """The pictures under assets/ changed since ref (default: the merge-base with origin/main, or HEAD~1 on main),
    including uncommitted and untracked ones. Returns (ref, paths)."""
    head = _git("rev-parse", "HEAD").stdout.strip()
    if not ref:
        mb = _git("merge-base", "HEAD", "origin/main")
        ref = mb.stdout.strip() if mb.returncode == 0 and mb.stdout.strip() and mb.stdout.strip() != head else "HEAD~1"
    d = _git("diff", "--name-only", "--diff-filter=ACMR", ref, "--", "assets")
    if d.returncode != 0:
        raise SystemExit("git diff against %s failed: %s" % (ref, d.stderr.strip()))
    u = _git("ls-files", "--others", "--exclude-standard", "--", "assets")
    rels = sorted(set(d.stdout.split() + u.stdout.split()))
    return ref, [os.path.join(REPO, p) for p in rels if p.lower().endswith(IMG_EXT) and os.path.isfile(os.path.join(REPO, p))]


# ---------------------------------------------------------------- files, sheet, CLI

def collect(args, R):
    skip_dirs, skip_name = set(R["scan"]["skip_dirs"]), R["scan"]["skip_name"]
    out = []
    for a in args:
        if os.path.isdir(a):
            for root, dirs, files in os.walk(a):
                dirs[:] = sorted(x for x in dirs if x not in skip_dirs)
                out += [os.path.join(root, f) for f in sorted(files) if f.lower().endswith(IMG_EXT)]
        else:
            out += sorted(glob.glob(a)) or [a]
    out = [p for p in out if not any(s in os.path.basename(p) for s in skip_name)]
    stems = {}
    for p in out:  # one picture in two formats: keep the webp
        k = os.path.splitext(p)[0]
        if k not in stems or p.lower().endswith(".webp"):
            stems[k] = p
    return sorted(set(stems.values()))


LEVELS = ("PASS", "FLAG", "EXCEPTION", "FAIL")


def level(r):
    """FAIL, then EXCEPTION (a colour the book lacks: Zafar decides; on the block until he does), FLAG, PASS."""
    return "FAIL" if r["fail"] else "EXCEPTION" if r.get("exception") else "FLAG" if r["flag"] else "PASS"


@functools.lru_cache(maxsize=4)
def font(size):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def wrap(d, text, f, w):
    out, line = [], ""
    for word in text.split():
        t = (line + " " + word).strip()
        if d.textlength(t, font=f) <= w:
            line = t
        else:
            out.append(line)
            line = word
    return out + [line] if line else out


def sheet(results, out, cols=6, tw=300, title=None):
    """A contact sheet: each picture on a checker, its colour bar, nearest Wada names and its flags."""
    th, pad, lh = 210, 10, 13
    f, fb = font(11), font(12)
    tiles = []
    for r in results:
        t = Image.new("RGB", (tw, 1000), (250, 248, 244))
        d = ImageDraw.Draw(t)
        chk = Image.new("RGB", (tw, th), (222, 219, 213))
        cd = ImageDraw.Draw(chk)
        for y in range(0, th, 12):
            for x in range(0, tw, 12):
                if (x // 12 + y // 12) % 2:
                    cd.rectangle([x, y, x + 11, y + 11], fill=(236, 233, 228))
        try:
            im = Image.open(r["file"]).convert("RGBA")
            im.thumbnail((tw - 8, th - 8), Image.LANCZOS)
            chk.paste(im, ((tw - im.width) // 2, (th - im.height) // 2), im)
        except Exception:
            pass
        t.paste(chk, (0, 0))
        y = th + 3
        x = 0
        cols_ = r.get("colours") or []
        tot = sum(c["share"] for c in cols_) or 1
        for c in cols_:
            w = int(round(tw * c["share"] / tot))
            d.rectangle([x, y, min(tw, x + w), y + 14], fill=tuple(int(v) for v in rgb_of_hex(c["hex"])))
            x += w
        y += 18
        lv = level(r)
        col = {"PASS": (40, 110, 60), "FLAG": (180, 110, 0), "EXCEPTION": (120, 40, 160), "FAIL": (180, 30, 30)}[lv]
        rel = os.path.relpath(r["file"], REPO) if os.path.isabs(r["file"]) or r["file"].startswith(REPO) else r["file"]
        for ln in wrap(d, "%s  %s" % (lv, rel.replace("assets/", "")), fb, tw - 4)[:2]:
            d.text((2, y), ln, font=fb, fill=col)
            y += lh + 1
        for c in cols_[:3]:
            d.text((2, y), "%2.0f%% %s  %s ΔE%.0f%s" % (c["share"] * 100, c["words"], c["wada"]["name"], c["wada"]["de"], "  H" if c["in_house"] else ""), font=f, fill=(60, 55, 50))
            y += lh
        for fl in (r["fail"] + r.get("exception", []) + r["flag"])[:4]:
            for ln in wrap(d, ("FAIL " if fl in r["fail"] else "") + fl, f, tw - 4)[:3]:
                d.text((2, y), ln, font=f, fill=col)
                y += lh
        tiles.append(t.crop((0, 0, tw, y + 4)))
    if not tiles:
        return None
    rows = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
    head = 30 if title else 0
    H = head + sum(max(t.height for t in row) + pad for row in rows) + pad
    W = cols * (tw + pad) + pad
    S = Image.new("RGB", (W, H), (255, 255, 255))
    if title:
        ImageDraw.Draw(S).text((pad, 8), title, font=font(16), fill=(30, 30, 30))
    y = head + pad
    for row in rows:
        for i, t in enumerate(row):
            S.paste(t, (pad + i * (tw + pad), y))
        y += max(t.height for t in row) + pad
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    if out.lower().endswith((".jpg", ".jpeg")):
        S.save(out, quality=82, optimize=True)
    else:
        S.save(out, optimize=True)
    return out


def batch_sheet(name, items, odd, out, th=150, notes=None, cols=8):
    """One flagged batch for an eye (Zafar, 6 Nov: "a problem if you can tell it comes from different batches"): every
    picture's canvas at the same height on one plain ground, as they would stand together; the odd ones out ringed."""
    f, fb = font(11), font(13)
    tw, pad, lh = int(th * 0.9), 8, 13
    tiles = []
    for r in items:
        t = Image.new("RGB", (tw, th + 2 * lh + 4), (232, 229, 224))
        try:
            im = Image.open(r["file"]).convert("RGBA")
            im.thumbnail((tw - 6, th - 6), Image.LANCZOS)
            t.paste(im, ((tw - im.width) // 2, th - 3 - im.height), im)
        except Exception:
            pass
        d = ImageDraw.Draw(t)
        b = os.path.splitext(os.path.basename(r["file"]))[0]
        is_odd = b in odd or os.path.basename(r["file"]) in odd
        if is_odd:
            d.rectangle([0, 0, tw - 1, th - 1], outline=(214, 120, 0), width=3)
        for k, ln in enumerate(wrap(d, b, f, tw - 4)[:2]):
            d.text((2, th + 2 + k * lh), ln, font=f, fill=(150, 80, 0) if is_odd else (60, 55, 50))
        tiles.append(t)
    if not tiles:
        return None
    rows = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
    head = 22 + lh * len(notes or [])
    W = pad + min(cols, len(tiles)) * (tw + pad)
    H = head + sum(max(x.height for x in row) + pad for row in rows) + pad
    S = Image.new("RGB", (max(W, 420), H), (250, 248, 244))
    d = ImageDraw.Draw(S)
    d.text((pad, 4), name, font=fb, fill=(30, 30, 30))
    for k, n in enumerate(notes or []):
        d.text((pad, 22 + k * lh), n[:110], font=f, fill=(150, 80, 0))
    y = head
    for row in rows:
        for i, x in enumerate(row):
            S.paste(x, (pad + i * (tw + pad), y))
        y += max(x.height for x in row) + pad
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    S.save(out, quality=78, optimize=True)
    return out


def batch_sheets(groups, batches, outdir):
    """A sheet per batch with an odd one out (batch_sheet), named after the batch; returns [(batch, path)]."""
    out = []
    for b in batches:
        if not b["splits"]:
            continue
        g = groups.get(b["batch"]) or groups.get(os.path.join(REPO, b["batch"])) or []
        odd = {o for s in b["splits"] for o in s.get("odd", [])}
        notes = ["%s: %s" % (s["feature"], ", ".join(s.get("odd", [])) or "%d families" % s.get("families", 0)) for s in b["splits"]]
        safe = re.sub(r"[^A-Za-z0-9]+", "-", b["batch"].replace("assets/", "")).strip("-")
        p = batch_sheet(b["batch"], [r for r in g if r.get("cutout")], odd, os.path.join(outdir, safe + ".jpg"), notes=notes)
        if p:
            out.append((b["batch"], p))
    return out


def score(r):
    """How bad a picture is, for --worst: a FAIL, then each flag (off-palette weighted by share)."""
    return 10 * len(r["fail"]) + 8 * len(r.get("exception", [])) + sum(2 if f.startswith("batch") else 3 for f in r["flag"])


def clean(o):
    if isinstance(o, dict):
        return {k: clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [clean(v) for v in o]
    if isinstance(o, (np.floating,)):
        return float(o)
    if isinstance(o, (np.integer,)):
        return int(o)
    if isinstance(o, np.bool_):
        return bool(o)
    return o


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], epilog=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="*", help="files, folders or globs")
    ap.add_argument("--scan", help="every picture under this folder (the retrospective); batches by folder and name family")
    ap.add_argument("--batch", help="treat every picture given as one batch with this name")
    ap.add_argument("--batch-by", choices=("folder", "auto", "none"), default="folder", help="how pictures are grouped into batches (auto: a folder of over 40 pictures is split by name family)")
    ap.add_argument("--size-class", help="L, M or S: the size class of every picture given (otherwise look-rules.json sizes.items)")
    ap.add_argument("--rules", default=RULES)
    ap.add_argument("--sheet", help="write a contact sheet (PNG or JPG) here")
    ap.add_argument("--worst", type=int, help="the sheet shows only the N worst pictures")
    ap.add_argument("--json", help="write every result as JSON here")
    ap.add_argument("--batch-sheets", metavar="DIR", help="write a contact sheet per batch with an odd one out here, for an eye to judge (Zafar, 6 Nov: a batch is a problem only if you can tell)")
    ap.add_argument("--quiet", action="store_true", help="print only the summary and the FAILs")
    ap.add_argument("--swatch", help="write the house swatch strip (or --combination's) here and stop")
    ap.add_argument("--combination", type=int, help="with --swatch: a Wada combination's strip instead of the house's; alone: print its colours in words")
    ap.add_argument("--slot-css", type=float, metavar="H", help="a slot's height in CSS px at look-rules.json sizes.at: whether each size class's piece meets sizes.min_css_px, and stop")
    ap.add_argument("--house-words", action="store_true", help="print the house colours in words and stop")
    ap.add_argument("--changed", nargs="?", const="", metavar="REF", help="only the pictures under assets/ changed since REF (default: the merge-base with origin/main, or HEAD~1), uncommitted and untracked ones too; a named surface's other pictures are measured beside them, not judged (checks.mjs `art`)")
    ap.add_argument("-v", "--verbose", action="store_true")
    a = ap.parse_args(argv)
    R = rules(a.rules)
    if a.swatch:
        n = len(combos()[a.combination]) if a.combination is not None else len(house(R))
        print("wrote %s: %d %s colours" % (swatch(a.swatch, R, combo=a.combination), n, "house" if a.combination is None else "combination %d" % a.combination))
        return 0
    if a.combination is not None:
        print("Wada combination %d: %s" % (a.combination, combination_words(a.combination)))
        return 0
    if a.slot_css is not None:
        Z = R["sizes"]
        bad = [k for k, v in Z["classes"].items() if a.slot_css * v < Z["min_css_px"]]
        for k, v in Z["classes"].items():
            print("  %s: %.0f%% of %.0f px = %.1f CSS px%s" % (k, v * 100, a.slot_css, a.slot_css * v, "  (under %d at %s)" % (Z["min_css_px"], Z["at"]) if k in bad else ""))
        return 1 if bad else 0
    if a.house_words:
        print(house_words(R))
        return 0
    context = []
    if a.changed is not None:
        ref, paths = changed(a.changed or None)
        if not paths:
            print("no picture changed since %s" % ref[:12])
            return 0
        paths = collect(paths, R)
        for bname, globs in R.get("batches", {}).items():  # a changed shelf jar is measured beside the rest of its shelf
            if bname.startswith("_"):
                continue
            mem = collect([os.path.join(REPO, g) for g in globs], R)
            if set(map(os.path.abspath, mem)) & set(map(os.path.abspath, paths)):
                context += [m for m in mem if os.path.abspath(m) not in set(map(os.path.abspath, paths + context))]
        print("%d picture(s) changed since %s%s" % (len(paths), ref[:12], " (and %d beside them on their surface)" % len(context) if context else ""))
    else:
        paths = collect(([a.scan] if a.scan else []) + a.paths, R)
    if not paths:
        print("no pictures to measure")
        return 2
    refs = Refs(R)
    res = []
    for i, p in enumerate(paths + context):
        try:
            r = analyse(p, R, a.size_class)
        except Exception as e:  # a bad file never stops the pass
            r = {"file": p, "fail": [], "exception": [], "flag": ["could not be measured: %s: %s" % (type(e).__name__, e)], "info": {}, "cutout": False}
        r["ref"], r["context"] = refs.of(p), i >= len(paths)
        res.append(r)
        if a.scan and i % 200 == 199:
            print("  ... %d of %d" % (i + 1, len(paths)), file=sys.stderr)
    mode = "auto" if a.scan and a.batch_by == "folder" else a.batch_by
    groups = {}
    if a.batch:
        groups[a.batch] = res
    elif mode != "none":
        counts = {}
        for r in res:
            counts[os.path.dirname(r["file"])] = counts.get(os.path.dirname(r["file"]), 0) + 1
        for r in res:
            groups.setdefault(batch_key(r["file"], mode, counts=counts), []).append(r)
    for bname, globs in R.get("batches", {}).items():  # named surfaces (one shelf): judged as one batch as well
        if bname.startswith("_") or a.batch:
            continue
        pats = [g if os.path.isabs(g) else os.path.join(REPO, g) for g in globs]
        mem = [r for r in res if any(fnmatch.fnmatch(os.path.abspath(r["file"]), p) for p in pats)]
        if len(mem) > 1:
            groups[bname] = mem
    named = {k for k in R.get("batches", {}) if not k.startswith("_")} | ({a.batch} if a.batch else set())
    batches = [batch_check(g, os.path.relpath(k, REPO) if os.path.isabs(k) else k, R, surface=k in named) for k, g in groups.items() if len(g) > 1]
    counts = {k: 0 for k in LEVELS}
    split = {k: {x: 0 for x in LEVELS} for k in ("shipped", "unreferenced")}
    for r in res:
        if r["context"]:
            continue
        lv = level(r)
        counts[lv] += 1
        split["shipped" if r["ref"] in ("named", "built") else "unreferenced"][lv] += 1
        if a.quiet and lv not in ("FAIL", "EXCEPTION"):
            continue
        print("%-5s %s" % (lv, r["file"]) + ("" if r["ref"] in ("named", "built") else "  (%s)" % {"lab": "a lab page only", "none": "not referenced"}[r["ref"]])
              + ("  " + json.dumps(clean(r["info"]), ensure_ascii=False) if a.verbose and lv == "PASS" else ""))
        if a.verbose or lv != "PASS":
            for x in r["fail"]:
                print("        FAIL  " + x)
            for x in r.get("exception", []):
                print("        EXCEPTION  " + x)
            for x in r["flag"]:
                print("        flag  " + x)
        if a.verbose:
            for c in r.get("colours", []):
                print("        colour %s %3.0f%% %-20s Wada %s %s ΔE %.1f; house %s ΔE %.1f%s" % (c["hex"], c["share"] * 100, c["words"], c["wada"]["name"], c["wada"]["hex"], c["wada"]["de"],
                                                                                      c["house"]["name"], c["house"]["de"], " (in the house)" if c["in_house"] else ""))
            if lv != "PASS":
                print("        " + json.dumps(clean(r["info"]), ensure_ascii=False))
    n = sum(counts.values())
    print("\n%d picture(s): %d pass, %d flag, %d exception, %d fail; %d batch(es), %d with an odd one out"
          % (n, counts["PASS"], counts["FLAG"], counts["EXCEPTION"], counts["FAIL"], len(batches), sum(1 for b in batches if b["splits"])))
    for k, c in split.items():
        if sum(c.values()):
            print("  %s: %d (%d pass, %d flag, %d exception, %d fail)%s" % (k, sum(c.values()), c["PASS"], c["FLAG"], c["EXCEPTION"], c["FAIL"],
                  "" if k == "shipped" else "; %d on a lab page only" % sum(1 for r in res if r["ref"] == "lab" and not r["context"])))
    if a.json:
        json.dump(clean({"results": res, "batches": batches, "counts": counts, "shipped": split}), open(a.json, "w"), indent=1, ensure_ascii=False)
    if a.batch_sheets:
        for bname, p in batch_sheets({(os.path.relpath(k, REPO) if os.path.isabs(k) else k): g for k, g in groups.items()}, batches, a.batch_sheets):
            print("batch sheet: %s (%s)" % (p, bname))
    if a.sheet:
        show = sorted(res, key=lambda r: -score(r))[:a.worst] if a.worst else res
        out = sheet(show, a.sheet, title=("the %d worst of %d" % (len(show), len(res))) if a.worst else None)
        print("sheet: %s" % out)
    return 1 if counts["FAIL"] or counts["EXCEPTION"] else 0


if __name__ == "__main__":
    sys.exit(main())
