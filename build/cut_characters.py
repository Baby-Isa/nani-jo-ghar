#!/usr/bin/env python3
"""Cut the in-game character portraits from the approved character sheets.

    python3 build/cut_characters.py            # writes assets/cook/characters/*.webp
    python3 build/cut_characters.py --out DIR  # somewhere else (to compare)

Sources: sources/art/characters/char-*.png (ChatGPT batch 1; Nani v2 is the
approved sheet). Nothing here reads sources/private/.

What it makes (same file names and about the same pixel sizes as the old
placeholder set, so the code needs no change):

  <who>-neutral / -happy / -impatient   the service view (Phaser). Waist up,
      standing behind the island. js/cook/stations.js CHARS places each file
      (top, scale) and the island's front edge (world y 611) hides what's
      below, so every mood is framed the same way: the sheet's island edge
      lands at world y 623, just under the counter, and the hands rest on it.
        neutral    the sheet's "game crop" (behind the counter)
        happy      the same body with the talking/smiling head from the
                   expressions sheet (panel 3) swapped in, so switching mood
                   (and talking: customers talk with their happy face) never
                   makes the body jump
        impatient  the impatient sheet (arms folded), scaled by the eyes to
                   the same head size and put where the neutral head is
  <who>-badge    head and shoulders for the round faces (sidebar, intro card,
                 chai tray): expressions panel 1 (neutral), square
  nani-*         Nani v2 has one pose: the close-up leaning on the counter,
                 her canonical framing. All four moods use it (talk and point
                 too: a different crop would make her jump when she talks);
                 the badge is a tighter crop of the same face.
  isa-badge, kasuku-badge   for later.

Cut-outs: the sheets' backdrops are soft gradients, not a flat key, so the
backdrop is modelled per crop (a robust quadratic fit per channel), alpha
comes from the distance to that model with holes filled (grey hair and a
white cap stay solid), and edge colours are un-mixed from the backdrop so
there is no grey or blue fringe. The sheets' counters are cut away: below
the counter's back edge only the hands stay.
"""
import argparse
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "sources", "art", "characters")
OUT = os.path.join(ROOT, "assets", "cook", "characters")

# js/cook/stations.js CHARS (world units; the service view is 1600x900)
CHARS = {"nani": (150, 0.98), "nana": (175, 1.25), "ma": (195, 1.14), "cousin": (290, 1.02)}
COUNTER_WORLD = 623  # the sheet's counter edge lands here (the island's back edge is 611)

# Per character, in sheet pixels. eyes = (left eye, right eye) pupil centres as seen.
SPEC = {
    "nani": {
        "game": dict(sheet="char-nani-v2.png", box=(1030, 0, 1536, 600), counter=555, hands_to=578, warm=72,
                     eyes=((1240, 154), (1314, 130)), body_cx=1284),
        "f": 0.85,  # world px per sheet px
        "canvas": (443, 578),
        "badge": dict(sheet="char-nani-v2.png", box=(1100, 0, 1480, 360), eyes=((1240, 154), (1314, 130)),
                      crown=12, chin=250),
    },
    "nana": {
        "game": dict(sheet="char-nana-v1.png", box=(1112, 40, 1536, 600), counter=505, hands_to=505,
                     eyes=((1328, 176), (1378, 189)), body_cx=1312),
        "f": 1.026,
        "canvas": (370, 389),
        "happy": dict(sheet="char-nana-expressions-v1.png", box=(768, 0, 1152, 341), eyes=((943, 130), (1001, 137)),
                      chin=262),
        "neck": 262,  # sheet y of the neutral's chin/beard line (head swap seam)
        "imp": dict(sheet="char-nana-impatient-v1.png", box=(480, 0, 1060, 1024), eyes=((726, 130), (785, 152))),
        "badge": dict(sheet="char-nana-expressions-v1.png", box=(0, 0, 384, 341), eyes=((198, 130), (250, 137)),
                      crown=30, chin=250),
    },
    "ma": {
        "game": dict(sheet="char-ma-v1.png", box=(1090, 20, 1520, 520), counter=459, hands_to=462, warm=88,
                     eyes=((1288, 152), (1344, 164)), body_cx=1303),
        "f": 0.99,
        "canvas": (341, 405),
        "happy": dict(sheet="char-ma-expressions-v1.png", box=(768, 0, 1152, 341), eyes=((938, 116), (1000, 128)),
                      chin=205),
        "neck": 238,
        "imp": dict(sheet="char-ma-impatient-v1.png", box=(520, 0, 960, 1024), eyes=((762, 124), (816, 144))),
        "badge": dict(sheet="char-ma-expressions-v1.png", box=(0, 0, 384, 341), eyes=((202, 120), (260, 134)),
                      crown=20, chin=215),
    },
    "cousin": {
        "game": dict(sheet="char-ali-v1.png", box=(1056, 0, 1536, 545), counter=481, hands_to=500, warm=95,
                     eyes=((1248, 187), (1318, 162)), body_cx=1305),
        "f": 0.72,
        "canvas": (255, 379),
        "happy": dict(sheet="char-ali-expressions-v1.png", box=(772, 0, 1148, 336), eyes=((926, 164), (996, 140)),
                      chin=262),
        "neck": 268,
        "imp": dict(sheet="char-ali-impatient-v1.png", box=(540, 0, 940, 1024), eyes=((672, 174), (740, 148))),
        "badge": dict(sheet="char-ali-expressions-v1.png", box=(4, 0, 372, 336), eyes=((158, 164), (218, 150)),
                      crown=10, chin=265),
    },
    "isa": {
        "badge": dict(sheet="char-isa-expressions-v1.png", box=(0, 0, 384, 341), eyes=None, crown=None, chin=None),
    },
    "kasuku": {
        "badge": dict(sheet="char-kasuku-poses-v1.png", box=(780, 560, 1130, 950), eyes=None, crown=None, chin=None,
                      # grey bird on a pale grey backdrop: the backdrop is very flat, so cut close to it
                      fit_tol=5.0, matte=dict(t0=4.0, t1=13.0)),
    },
}


# ---------------------------------------------------------------- matting
def load(name):
    return np.asarray(Image.open(os.path.join(SRC, name)).convert("RGB")).astype(float)


def fit_background(rgb, usable, iters=4, tol=10.0):
    """A smooth backdrop: per-channel quadratic in (x, y), fitted robustly
    over the pixels that look like backdrop (starting from the crop's rim)."""
    h, w, _ = rgb.shape
    yy, xx = np.mgrid[0:h, 0:w]
    X = np.stack([np.ones_like(xx), xx / w, yy / h, (xx / w) ** 2, (yy / h) ** 2, xx * yy / (w * h)], -1).reshape(-1, 6)
    rim = np.zeros((h, w), bool)
    rim[:6] = rim[:, :6] = rim[:, -6:] = True
    sel = rim & usable
    flat = rgb.reshape(-1, 3)
    B = None
    for _ in range(iters):
        idx = np.flatnonzero(sel.reshape(-1))
        if len(idx) > 40000:
            idx = idx[:: len(idx) // 40000]
        coef, *_ = np.linalg.lstsq(X[idx], flat[idx], rcond=None)
        B = (X @ coef).reshape(h, w, 3)
        d = np.linalg.norm(rgb - B, axis=2)
        # the backdrop grows out from the rim through near-model pixels
        near = (d < tol) & usable
        lab, _ = ndi.label(near)
        seeds = np.unique(lab[rim & near])
        sel = np.isin(lab, seeds[seeds > 0])
    return B


def matte(rgb, B, usable, t0=8.0, t1=34.0, hole_min=40, band=2):
    """Alpha (0..1) and un-mixed colour for everything that isn't backdrop."""
    d = np.linalg.norm(rgb - B, axis=2)
    d = np.where(usable, d, 0.0)
    hard = d > t1
    # backdrop = not hard and connected to the crop's rim; enclosed near-backdrop
    # pockets only count if they are big (a gap between an arm and the body)
    cand = ~hard
    lab, n = ndi.label(cand)
    rim_labels = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    sizes = ndi.sum(np.ones_like(lab), lab, index=np.arange(n + 1))
    mean_d = ndi.mean(d, lab, index=np.arange(n + 1))
    is_bg = np.zeros(n + 1, bool)
    is_bg[rim_labels] = True
    is_bg |= (sizes >= hole_min) & (mean_d < t0 + 6)
    is_bg[0] = False
    bg = is_bg[lab] & cand
    fg = ~bg & usable
    # keep only the big pieces (drop specks of noise)
    lab2, n2 = ndi.label(fg)
    if n2:
        s2 = ndi.sum(np.ones_like(lab2), lab2, index=np.arange(1, n2 + 1))
        keep = np.zeros(n2 + 1, bool)
        keep[1:] = s2 >= 200
        fg = keep[lab2]
    interior = ndi.binary_erosion(fg, iterations=band)
    soft = np.clip((d - t0) / (t1 - t0), 0, 1)
    alpha = np.where(interior, 1.0, np.where(fg, np.maximum(soft, 0.0), 0.0))
    # the outermost ring: soft by distance to the backdrop, never harder than 1
    ring = fg & ~interior
    alpha[ring] = np.clip(soft[ring], 0.0, 1.0)
    # un-mix edge colours from the backdrop; faint pixels take the nearest solid colour
    _, (iy, ix) = ndi.distance_transform_edt(~interior, return_indices=True)
    solid = rgb[iy, ix]
    a = alpha[..., None]
    un = np.clip(B + (rgb - B) / np.maximum(a, 1e-3), 0, 255)
    col = np.where(a >= 0.999, rgb, np.where(a > 0.35, un, solid))
    return alpha, col


def cut(spec, counter=True):
    """RGBA cut-out (float arrays) of spec['box'] from its sheet."""
    rgb_full = load(spec["sheet"])
    x0, y0, x1, y1 = spec["box"]
    rgb = rgb_full[y0:y1, x0:x1]
    h, w, _ = rgb.shape
    usable = np.ones((h, w), bool)
    cy = spec.get("counter")
    if counter and cy is not None:
        usable[cy - y0 :] = False
    B = fit_background(rgb, usable, tol=spec.get("fit_tol", 10.0))
    alpha, col = matte(rgb, B, usable, **spec.get("matte", {}))
    if counter and cy is not None:
        # below the counter's back edge: only the hands (and cuffs) that rest on it
        # The counters are warm (cream, pinkish marble, beige granite, wood), so
        # colour distance can't tell them from skin; warmth can: skin has a far
        # bigger red-blue spread than any of the stone tops. (Nana's wood is as
        # warm as skin, so his hands are cut straight at the edge: hands_to == counter.)
        r0, r1 = cy - y0, spec["hands_to"] - y0
        alpha[r0:] = 0
        # the counter's lit top edge, just above the line: drop it where no body stands over it
        alpha[r0 - 5 : r0] *= (alpha[r0 - 8] > 0.5)[None, :]
        if r1 > r0:
            band = rgb[r0:r1]
            warm = band[..., 0] - band[..., 2]
            seed = np.zeros(warm.shape, bool)
            # above the counter's own warmth (it reflects the skin and clothes a little)
            thr = spec["warm"]
            seed[0] = (alpha[r0 - 1] > 0.5) & (warm[0] > thr + 5)
            keep = ndi.binary_propagation(seed, mask=warm > thr)
            keep = ndi.binary_opening(keep, iterations=1) | seed
            a_band = np.clip((warm - thr + 8) / 16, 0, 1) * keep
            alpha[r0:r1] = ndi.gaussian_filter(a_band, 0.5) * keep
            col[r0:r1] = band
    # drop stray specks (a panel border, a lit counter corner)
    lab, n = ndi.label(alpha > 0.05)
    if n > 1:
        sizes = ndi.sum(np.ones_like(lab), lab, index=np.arange(n + 1))
        alpha[(sizes < 400)[lab]] = 0
    return np.dstack([col, alpha * 255]).astype(np.float32)


def to_img(arr):
    return Image.fromarray(np.clip(arr + 0.5, 0, 255).astype(np.uint8), "RGBA")


# ---------------------------------------------------------------- placing
def place(canvas, cut_rgba, sheet_origin, k, anchor_sheet, anchor_canvas, angle=0.0):
    """Paste a cut-out (whose (0,0) is sheet_origin) into canvas, scaled by k
    and rotated by angle (degrees, about the anchor) so that anchor_sheet lands
    on anchor_canvas. Premultiplied resampling, so no dark fringes."""
    im = to_img(cut_rgba).convert("RGBa")
    w, h = im.size
    im = im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    ax = (anchor_sheet[0] - sheet_origin[0]) * k
    ay = (anchor_sheet[1] - sheet_origin[1]) * k
    if angle:
        # rotate about the anchor: pad so the anchor is the centre
        W2, H2 = im.size
        pad = int(max(W2, H2))
        big = Image.new("RGBa", (W2 + 2 * pad, H2 + 2 * pad), (0, 0, 0, 0))
        big.paste(im, (pad, pad))
        big = big.rotate(angle, resample=Image.BICUBIC, center=(ax + pad, ay + pad))
        im, ax, ay = big, ax + pad, ay + pad
    layer = Image.new("RGBa", canvas.size, (0, 0, 0, 0))
    layer.paste(im, (round(anchor_canvas[0] - ax), round(anchor_canvas[1] - ay)))
    return layer.convert("RGBA")


def eyes_mid(e):
    return ((e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2)


def iod(e):
    return float(np.hypot(e[1][0] - e[0][0], e[1][1] - e[0][1]))


def eye_angle(e):
    return float(np.degrees(np.arctan2(e[1][1] - e[0][1], e[1][0] - e[0][0])))


def service_frame(who):
    """(k, map) for the neutral: sheet -> canvas for this character's game crop."""
    s = SPEC[who]
    g = s["game"]
    top, scale = CHARS[who]
    k = s["f"] / scale
    W, H = s["canvas"]
    r_c = (COUNTER_WORLD - top) / scale

    def m(x, y):
        return (W / 2 + (x - g["body_cx"]) * k, r_c + (y - g["counter"]) * k)

    return k, m


def make_neutral(who):
    s = SPEC[who]
    g = s["game"]
    k, m = service_frame(who)
    canvas = Image.new("RGBA", s["canvas"], (0, 0, 0, 0))
    c = cut(g)
    layer = place(canvas, c, g["box"][:2], k, (g["body_cx"], g["counter"]), m(g["body_cx"], g["counter"]))
    return layer


def premul(a):
    x = np.asarray(a).astype(np.float32) / 255
    return np.dstack([x[..., :3] * x[..., 3:], x[..., 3:]])


def unpremul(p):
    a = p[..., 3:]
    rgb = np.where(a > 1e-4, p[..., :3] / np.maximum(a, 1e-4), 0)
    return Image.fromarray(np.clip(np.dstack([rgb, a]) * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA")


def make_happy(who, neutral):
    """Neutral body, expression-panel head (panel 3: smiling, talking)."""
    s = SPEC[who]
    g, hp = s["game"], s["happy"]
    k, m = service_frame(who)
    ge = [m(*p) for p in g["eyes"]]
    kh = k * iod(g["eyes"]) / iod(hp["eyes"])
    ang = -(eye_angle(g["eyes"]) - eye_angle(hp["eyes"]))  # PIL rotates counter-clockwise
    head = place(neutral, cut(hp), hp["box"][:2], kh, eyes_mid(hp["eyes"]), eyes_mid(ge), angle=ang)
    # the seam: a line under the chin, perpendicular to the face; above it the new head
    # (its own silhouette, so none of the old head shows), below it the old body
    W, H = neutral.size
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    mx, my = eyes_mid(ge)
    th = np.radians(eye_angle(g["eyes"]))
    # distance along the face's down axis from the eye line
    down = (yy - my) * np.cos(th) - (xx - mx) * np.sin(th)
    neck = (s["neck"] - eyes_mid(g["eyes"])[1]) * k
    feather = 8.0
    wgt = np.clip((neck - down) / feather + 0.5, 0, 1)[..., None]
    P = premul(head) * wgt + premul(neutral) * (1 - wgt)
    return unpremul(P)


def make_impatient(who):
    s = SPEC[who]
    g, ip = s["game"], s["imp"]
    k, m = service_frame(who)
    ge = [m(*p) for p in g["eyes"]]
    ki = k * iod(g["eyes"]) / iod(ip["eyes"])
    canvas = Image.new("RGBA", s["canvas"], (0, 0, 0, 0))
    # the whole figure (feet and the tap arcs drop off the canvas bottom)
    c = cut(ip, counter=False)
    return place(canvas, c, ip["box"][:2], ki, eyes_mid(ip["eyes"]), eyes_mid(ge))


def make_badge(who, size=280):
    """Head and shoulders, square, for a round mask (object-fit: cover; top)."""
    b = SPEC[who]["badge"]
    c = cut(b, counter=False)
    a = c[..., 3] > 128
    ys, xs = np.nonzero(a)
    x0, y0 = b["box"][:2]
    crown = b["crown"] if b.get("crown") is not None else y0 + ys.min()
    if b.get("chin") is not None:
        head = b["chin"] - crown
        cx = eyes_mid(b["eyes"])[0]
    else:
        head = (y0 + ys.max() - crown) * 0.62
        cx = x0 + (xs.min() + xs.max()) / 2
    # the head fills ~60% of the height; a little air above the crown
    k = 0.6 * size / head
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    return place(canvas, c, (x0, y0), k, (cx, crown), (size / 2, size * 0.05))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=OUT)
    ap.add_argument("--only", default="")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    only = set(filter(None, args.only.split(",")))

    def save(img, name):
        p = os.path.join(args.out, f"{name}.webp")
        img.save(p, "WEBP", quality=90, method=6, exact=False)
        print(f"{name}.webp {img.size[0]}x{img.size[1]}")

    for who in ["nani", "nana", "ma", "cousin", "isa", "kasuku"]:
        if only and who not in only:
            continue
        s = SPEC[who]
        if "game" in s:
            neutral = make_neutral(who)
            if who == "nani":
                for mood in ["neutral", "happy", "talk", "point"]:
                    save(neutral, f"nani-{mood}")
            else:
                save(neutral, f"{who}-neutral")
                save(make_happy(who, neutral), f"{who}-happy")
                save(make_impatient(who), f"{who}-impatient")
        save(make_badge(who), f"{who}-badge")


if __name__ == "__main__":
    main()
