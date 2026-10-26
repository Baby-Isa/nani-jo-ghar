#!/usr/bin/env python3
"""s12-w3b (CHAI-26, CHAI-08): cut the s12 pour frames (PT1 milky, PT2 black) and the glasses (GL).

  python3 build/reports/s12-w3b/cut_pour.py

The six pans of each sheet: the grey keyed out (the handle's hole too), the drip below the spout trimmed (the game draws
the stream), MIRRORED (Zafar, 23 Oct: the spout on the right, the handle on the left), each on one canvas registered on
its rim's centre. The glasses: each cut square on its rim's fitted circle, so it sits centred in its holder.
Writes assets/cook/items-s12/ (webp, the glasses also @2x) and assets/cook/items-s12/meta.json (source px of the 1x).
"""
import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..")
SRC = os.path.join(ROOT, "sources", "art", "s12")
OUT = os.path.join(ROOT, "assets", "cook", "items-s12")
BG = np.array([118, 118, 118])
NAMES = ["pan-tip-0", "pan-tip-20", "pan-tip-40", "pan-tip-60", "pan-pour", "pan-pour-end"]
PAD = 6


def alpha_of(a, tol=5, soft=10, hole=200, bg=BG):
    d = np.abs(a - bg).max(axis=2)
    bgl = d <= tol
    lab, n = ndi.label(bgl)
    sizes = ndi.sum(np.ones_like(lab), lab, range(1, n + 1))
    keep = np.zeros(n + 1, bool)
    keep[1:] = sizes >= hole
    ground = keep[lab]
    al = np.clip((d - tol) / soft, 0, 1)
    al[ground] = 0
    return al, ground


def cut_pans(sheet, suffix):
    a = np.asarray(Image.open(os.path.join(SRC, sheet)).convert("RGB")).astype(float)
    al, ground = alpha_of(a.astype(int))
    lab, n = ndi.label(~ground)
    sizes = ndi.sum(np.ones_like(lab), lab, range(1, n + 1))
    blobs = []
    for i, s in enumerate(sizes):
        if s > 5000:
            ys, xs = np.where(lab == i + 1)
            blobs.append((int(ys.min() > 500), int(xs.min()), i + 1))
    blobs.sort()
    assert len(blobs) == 6, len(blobs)
    frames = []
    H4 = None
    for k, (_, _, i) in enumerate(blobs):
        m = ndi.binary_dilation(lab == i, iterations=2)
        cols = np.where((lab == i).sum(axis=0) > 150)[0]
        L, R = int(cols.min()), int(cols.max())
        mid = cols[(cols > L + 0.3 * (R - L)) & (cols < R - 0.15 * (R - L))]
        T = min(int(np.where(lab[:, x] == i)[0].min()) for x in mid)
        B = max(int(np.where(lab[:, x] == i)[0].max()) for x in mid)
        if k < 4:
            H4 = B - T
        else:
            B = T + H4  # the pouring cells: the rim's height as cell 4's (the drip is not the pan)
        cx, cy, rx, ry = (L + R) / 2, (T + B) / 2, (R - L) / 2, (B - T) / 2
        yy, xx = np.mgrid[0 : a.shape[0], 0 : a.shape[1]]
        out = ((xx - cx) / (rx + 3)) ** 2 + ((yy - cy) / (ry + 3)) ** 2 > 1
        drip = m & out & (xx < cx) & (yy > cy + 0.5 * ry)
        aa = al * m
        pour = None
        if drip.any() and k >= 4:
            dy, dx = np.where(drip & (al > 0.5))
            # where the chai leaves the rim: the drip's middle, on the rim
            px = float(np.median(dx[dy < dy.min() + 14]))
            py = cy + ry * np.sqrt(max(0.0, 1 - ((px - cx) / rx) ** 2))
            pour = (px, py)
        aa[drip] = 0
        ys, xs = np.where(aa > 0.02)
        frames.append(dict(a=aa, box=(int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1), c=(cx, cy), r=(rx, ry), lip=(float(L), float(np.median(np.where(lab[:, L] == i)[0]))), pour=pour))
    # one canvas for all six, registered on the rim's centre
    left = max(f["c"][0] - f["box"][0] for f in frames) + PAD
    right = max(f["box"][2] - f["c"][0] for f in frames) + PAD
    up = max(f["c"][1] - f["box"][1] for f in frames) + PAD
    down = max(f["box"][3] - f["c"][1] for f in frames) + PAD
    W, Hc = int(np.ceil(left + right)), int(np.ceil(up + down))
    meta = {}
    rgb = a.astype(np.uint8)
    for name, f in zip(NAMES, frames):
        ox, oy = f["c"][0] - left, f["c"][1] - up  # the canvas's corner in sheet px
        canvas = np.zeros((Hc, W, 4), np.uint8)
        x0, y0 = int(round(ox)), int(round(oy))
        sx0, sy0 = max(0, x0), max(0, y0)
        sx1, sy1 = min(a.shape[1], x0 + W), min(a.shape[0], y0 + Hc)
        canvas[sy0 - y0 : sy1 - y0, sx0 - x0 : sx1 - x0, :3] = rgb[sy0:sy1, sx0:sx1]
        canvas[sy0 - y0 : sy1 - y0, sx0 - x0 : sx1 - x0, 3] = (f["a"][sy0:sy1, sx0:sx1] * 255).astype(np.uint8)
        canvas = canvas[:, ::-1]  # MIRRORED (Zafar, 23 Oct)
        mx = lambda x: W - 1 - (x - x0)  # a sheet x on the mirrored canvas
        file = f"{name}{suffix}-s12.webp"
        Image.fromarray(canvas, "RGBA").save(os.path.join(OUT, "chai-pan", file), quality=90, method=6)
        meta[f"{name}{suffix}"] = {
            "file": f"chai-pan/{file}",
            "w": W,
            "h": Hc,
            "cx": round(mx(f["c"][0]), 1),
            "cy": round(f["c"][1] - y0, 1),
            "rx": round(f["r"][0], 1),
            "ry": round(f["r"][1], 1),
            "lip": [round(mx(f["lip"][0]), 1), round(f["lip"][1] - y0, 1)],
            "pour": [round(mx(f["pour"][0]), 1), round(f["pour"][1] - y0, 1)] if f["pour"] else None,
        }
    return meta


def cut_glasses():
    a = np.asarray(Image.open(os.path.join(SRC, "gl-chai-glasses-top-v1.png")).convert("RGB")).astype(int)
    al, ground = alpha_of(a, tol=5, soft=5, bg=np.array([126, 126, 126]))
    lab, n = ndi.label(~ground)
    sizes = ndi.sum(np.ones_like(lab), lab, range(1, n + 1))
    blobs = sorted((int(np.where(lab == i + 1)[1].min()), i + 1) for i, s in enumerate(sizes) if s > 20000)
    assert len(blobs) == 3, len(blobs)
    meta = {}
    for name, (_, i) in zip(["empty", "chai", "black"], blobs):
        ys, xs = np.where(lab == i)
        # the rim's circle: the blob's outline, fitted (least squares) on its edge points
        edge = (lab == i) & ~ndi.binary_erosion(lab == i)
        ey, ex = np.where(edge)
        A = np.c_[2 * ex, 2 * ey, np.ones(len(ex))]
        sol = np.linalg.lstsq(A, ex**2 + ey**2, rcond=None)[0]
        cx, cy = sol[0], sol[1]
        r = float(np.sqrt(sol[2] + cx**2 + cy**2))
        half = int(np.ceil(r)) + 4
        x0, y0 = int(round(cx)) - half, int(round(cy)) - half
        rgba = np.zeros((2 * half, 2 * half, 4), np.uint8)
        rgba[..., :3] = a[y0 : y0 + 2 * half, x0 : x0 + 2 * half].astype(np.uint8)
        rgba[..., 3] = ((al * (ndi.binary_dilation(lab == i, iterations=2)))[y0 : y0 + 2 * half, x0 : x0 + 2 * half] * 255).astype(np.uint8)
        im = Image.fromarray(rgba, "RGBA")
        s1 = 240

        im.resize((s1, s1), Image.LANCZOS).save(os.path.join(OUT, "glass", f"glass-{name}-top-s12.webp"), quality=90, method=6)
        meta[f"glass-{name}"] = {"file": f"glass/glass-{name}-top-s12.webp", "w": s1, "h": s1, "r": round(r / (2 * half), 4), "fit": [round(cx, 1), round(cy, 1), round(r, 1)]}
    return meta


if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "chai-pan"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "glass"), exist_ok=True)
    meta = {"_about": "s12 chai measures (build/reports/s12-w3b/cut_pour.py): the pour frames MIRRORED (spout right, handle left), each on one canvas registered on its rim's centre (cx, cy; rx, ry the rim's half width and height, source px); lip the spout's tip; pour where the chai leaves the rim (the stream's anchor). The glasses square on their rim's circle (r: its radius as a share of the width)."}
    meta.update(cut_pans("pt1-chai-pan-tip-topdown-v1.png", ""))
    meta.update(cut_pans("pt2-chai-pan-tip-black-v1.png", "-black"))
    meta.update(cut_glasses())
    with open(os.path.join(OUT, "meta.json"), "w") as fh:
        json.dump(meta, fh, indent=1)
    print(json.dumps(meta, indent=1))
