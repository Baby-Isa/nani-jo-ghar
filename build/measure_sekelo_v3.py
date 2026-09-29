#!/usr/bin/env python3
"""Measures the Sekelo v3 art's skewers and writes them into assets/cook/items/v3/sekelo/meta.json (30 Sept, K9).

The rack (rack-0..4) and the plate (plate-1..4) are pictures with their empty skewers already drawn in; the
pieces are added in code along each drawn skewer's line (js/cook/mechanics/grill.js, SK.V3). This finds each
skewer's line from the art, as fractions of the canvas:
  rack-N:  "sticks": [[x, tip, handle, end], ...]   upright: the stick's x, its tip, where the wooden handle
                                                     starts and the handle's end (y)
  plate-N: "sticks": [[tx, ty, hx, hy, ex, ey], ...] on the diagonal: the tip, where the handle starts, the
                                                     handle's end (the handle is off the plate)
  grill:   "bed": [x0, y0, x1, y1]                  the coal bed inside the grill's walls
It also cuts stick.webp, the one empty skewer the code moves about (the board, the flight, the grill): rack-1's
first skewer, with the rails taken out from behind it, so every skewer on screen is the same drawn stick.

  python3 build/measure_sekelo_v3.py          # measure, cut, write meta.json
  (build/check_vessel_meta.py re-measures with these functions and checks meta.json and grill.js agree)
"""
import json
import os

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "assets", "cook", "items", "v3", "sekelo")


def rgba(name):
    return np.asarray(Image.open(os.path.join(DIR, name + ".webp")).convert("RGBA")).astype(int)


def rack_sticks(name):
    """Each upright skewer in a rack picture: [x, tip, handle, end] (fractions)."""
    im = rgba(name)
    a = im[:, :, 3] > 128
    H, W = a.shape
    # the rack itself is only rows 148-251: above it only the skewers are drawn
    top = a[: int(H * 0.3)]
    cols = np.nonzero(top.any(0))[0]
    groups = []
    for x in cols:
        if groups and x - groups[-1][-1] <= 3:
            groups[-1].append(x)
        else:
            groups.append([x])
    out = []
    for g in groups:
        x0 = int(round(np.mean(g)))
        sub = a[:, max(0, x0 - 30): x0 + 30]
        ys = np.nonzero(sub.any(1))[0]
        tip, end = int(ys.min()), int(ys.max())
        # the handle: below the lower rail, the first row wider than the stick (the ferrule's taper)
        wid = [int(np.ptp(np.nonzero(sub[y])[0]) + 1) if sub[y].any() else 0 for y in range(H)]
        handle = next(y for y in range(int(H * 0.66), H) if wid[y] > 14)
        xs = [np.nonzero(sub[y])[0].mean() + max(0, x0 - 30) for y in range(tip + 10, int(H * 0.36))]
        out.append([round(float(np.mean(xs)) / W, 4), round(tip / H, 4), round(handle / H, 4), round(end / H, 4)])
    return out


def plate_sticks(name, n):
    """Each diagonal skewer in a plate picture: [tx, ty, hx, hy, ex, ey] (fractions), tip first."""
    im = rgba(name)
    r, g, b, a = (im[:, :, i] for i in range(4))
    H, W = a.shape
    wood = (a > 128) & (r - b > 60) & (r > 90)
    ys, xs = np.nonzero(wood)
    P = np.c_[xs, ys].astype(float)
    c = P.mean(0)
    d = np.linalg.svd(P - c, full_matrices=False)[2][0]
    if d[0] < 0:
        d = -d
    nrm = np.array([-d[1], d[0]])
    off = (P - c) @ nrm
    t = (P - c) @ d
    # 1-D k-means on the offsets across the line: one cluster per skewer
    cen = np.percentile(off, np.linspace(10, 90, n)) if n > 1 else np.array([np.median(off)])
    for _ in range(30):
        lab = np.argmin(np.abs(off[:, None] - cen[None, :]), 1)
        cen = np.array([np.median(off[lab == k]) for k in range(n)])
    out = []
    for k in np.argsort(cen):
        sel = lab == k
        o = float(np.median(off[sel]))
        tt = t[sel]
        t0, t1 = np.percentile(tt, 0.2), np.percentile(tt, 99.8)
        # the handle: dark wood in this skewer's band, in its last third
        dark = sel & (r[ys, xs] < 150) & (t > t0 + (t1 - t0) * 0.66)
        th = np.percentile(t[dark], 1) if dark.any() else t0 + (t1 - t0) * 0.8
        pt = lambda s: c + nrm * o + d * s
        (tx, ty), (hx, hy), (ex, ey) = pt(t0), pt(th), pt(t1)
        out.append([round(tx / W, 4), round(ty / H, 4), round(hx / W, 4), round(hy / H, 4), round(ex / W, 4), round(ey / H, 4)])
    return out


def grill_bed():
    """The coal bed inside the grill's walls: [x0, y0, x1, y1] (fractions)."""
    im = rgba("grill")
    r, g, b, a = (im[:, :, i] for i in range(4))
    H, W = a.shape
    # the glow between the coals: strongly orange pixels
    hot = (a > 128) & (r > 200) & (r - b > 120) & (g < 170)
    ys, xs = np.nonzero(hot)
    return [round(np.percentile(xs, 0.5) / W, 4), round(np.percentile(ys, 0.5) / H, 4), round(np.percentile(xs, 99.5) / W, 4), round(np.percentile(ys, 99.5) / H, 4)]


def cut_stick():
    """rack-1's skewer on its own (the rails taken out from behind it): stick.webp, and its [tip, handle, end]."""
    im = np.asarray(Image.open(os.path.join(DIR, "rack-1.webp")).convert("RGBA")).copy()
    H, W = im.shape[:2]
    x, tip, handle, end = rack_sticks("rack-1")[0]
    cx = int(round(x * W))
    crop = im[:, cx - 24: cx + 25].copy()
    a = crop[:, :, 3]
    # where the rails are (rack-0's rows), keep only the stick's own 9 px
    r0 = np.asarray(Image.open(os.path.join(DIR, "rack-0.webp")).convert("RGBA"))[:, :, 3] > 128
    rows = np.nonzero(r0.any(1))[0]
    for y in range(rows.min() - 2, rows.max() + 3):
        a[y, : 24 - 6] = 0
        a[y, 24 + 7:] = 0
        # the rail's darker wood either side of the (light bamboo) stick
        a[y, crop[y, :, 0] < 175] = 0
    crop[:, :, 3] = a
    ys = np.nonzero((a > 20).any(1))[0]
    y0, y1 = int(ys.min()) - 2, int(ys.max()) + 3
    out = Image.fromarray(crop[y0:y1])
    out.save(os.path.join(DIR, "stick.webp"), "WEBP", quality=92, method=6)
    h = y1 - y0
    return {"w": out.width, "h": h, "tip": round((tip * H - y0) / h, 4), "handle": round((handle * H - y0) / h, 4), "end": round((end * H - y0) / h, 4)}


def cut_plate0():
    """The empty plate (plate-0.webp: there is no such cell): plate-1 with its skewer (and its shadow) painted
    out by the same plate turned half round its rim centre (the plate is round; that side has no skewer)."""
    src = Image.open(os.path.join(DIR, "plate-1.webp")).convert("RGBA")
    im = np.asarray(src).astype(float)
    H, W = im.shape[:2]
    m = json.load(open(os.path.join(DIR, "meta.json")))["plate-1"]
    cx, cy = m["cx"] * W, m["cy"] * H
    tx, ty, hx, hy, ex, ey = plate_sticks("plate-1", 1)[0]
    a = np.array([tx * W, ty * H])
    b = np.array([ex * W, ey * H])
    yy, xx = np.mgrid[0:H, 0:W]
    P = np.stack([xx, yy], -1).astype(float)
    d = (b - a) / np.linalg.norm(b - a)
    t = np.clip(((P - a) @ d), 0, np.linalg.norm(b - a))
    dist = np.linalg.norm(P - (a + t[..., None] * d), axis=-1)
    # the stick is ~10 px, the handle ~36, its shadow falls below-right
    band = dist < np.where(t > np.linalg.norm(np.array([hx * W, hy * H]) - a) - 6, 26, 15)
    # each painted-out pixel takes the plate's pixel a turn away round the rim centre (the rim and the well
    # line up; the light changes slowly round the plate): the smallest turn whose source is clear of the band
    out = im.copy()
    todo = band.copy()
    from PIL import ImageFilter
    for deg in (25, -25, 40, -40, 60, -60, 90, -90):
        rot = np.asarray(src.rotate(deg, center=(cx, cy), resample=Image.BICUBIC)).astype(float)
        rband = np.asarray(Image.fromarray(band.astype(np.uint8) * 255).rotate(deg, center=(cx, cy))) > 0
        ok = todo & ~rband
        out[ok] = rot[ok]
        todo &= ~ok
    # a soft seam (2 px)
    w = np.asarray(Image.fromarray(band.astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(1.5))).astype(float)[..., None] / 255
    out = im * (1 - w) + out * w
    Image.fromarray(out.round().clip(0, 255).astype(np.uint8)).save(os.path.join(DIR, "plate-0.webp"), "WEBP", quality=92, method=6)
    return dict(m, sheet="k2-plate-1-4-v1.png", _about="plate-1 with its skewer painted out (build/measure_sekelo_v3.py cut_plate0)")


def measure():
    m = {}
    for n in range(0, 5):
        m[f"rack-{n}"] = rack_sticks(f"rack-{n}") if n else []
    for n in range(1, 5):
        m[f"plate-{n}"] = plate_sticks(f"plate-{n}", n)
    return m


def main():
    mp = os.path.join(DIR, "meta.json")
    meta = json.load(open(mp))
    for k, v in measure().items():
        meta[k]["sticks"] = v
    meta["grill"]["bed"] = grill_bed()
    meta["plate-0"] = dict(cut_plate0(), sticks=[])
    st = cut_stick()
    meta["stick"] = dict(st, sheet="k1-rack-0-4-v1.png", _about="rack-1's skewer, the rails taken out (build/measure_sekelo_v3.py)")
    json.dump(meta, open(mp, "w"), indent=1)
    open(mp, "a").write("\n")
    for k in ["plate-0", "rack-4", "plate-1", "plate-2", "plate-3", "plate-4", "grill", "stick"]:
        print(k, meta[k].get("sticks", meta[k].get("bed", meta[k])))


if __name__ == "__main__":
    main()
