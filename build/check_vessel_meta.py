#!/usr/bin/env python3
"""Checks that each vessel's recorded body centre and radius match its art (29 Sept).

The chai pan's centre was measured with its handle still attached, so every pan sat low-left of its
burner and nobody saw it in the screenshots. This fits a circle to each vessel's rim (the handle's side
left out) and fails when the recorded centre is off by more than 1.5% of the image width.

  python3 build/check_vessel_meta.py
Vessels with two handles (karahi, pot) are set by hand from their cuts and aren't checked here.
"""
import json
import math
import os
import re
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOL = 0.015


def fit_rim(path):
    a = np.array(Image.open(path).convert("RGBA"))[:, :, 3] > 128
    H, W = a.shape
    ys, xs = np.nonzero(a)
    c0 = (xs.mean(), ys.mean())
    best = None
    # one handle: try leaving out each 75-degree sector and keep the cleanest circle
    for skip in range(0, 360, 15):
        c = c0
        for _ in range(5):
            pts = []
            for deg in range(0, 360, 2):
                if 0 <= (deg - skip) % 360 <= 75:
                    continue
                t = math.radians(deg)
                last = None
                for rr in range(1, max(W, H)):
                    x, y = int(c[0] + math.cos(t) * rr), int(c[1] + math.sin(t) * rr)
                    if not (0 <= x < W and 0 <= y < H):
                        break
                    if a[y, x]:
                        last = (x, y)
                if last:
                    pts.append(last)
            P = np.array(pts, float)
            A = np.c_[2 * P[:, 0], 2 * P[:, 1], np.ones(len(P))]
            s = np.linalg.lstsq(A, (P ** 2).sum(1), rcond=None)[0]
            c = (s[0], s[1])
            r = math.sqrt(max(1.0, s[2] + s[0] ** 2 + s[1] ** 2))
        res = np.percentile(np.abs(np.hypot(P[:, 0] - c[0], P[:, 1] - c[1]) - r), 90)
        if best is None or res < best[0]:
            best = (res, c[0] / W, c[1] / H, r / W)
    return best


def main():
    kit = open(os.path.join(ROOT, "js/cook/kitchen-kit.js")).read()
    chai = open(os.path.join(ROOT, "js/cook/stations/chai-tray.js")).read()
    checks = []
    for name in ("pan", "tawa"):
        m = re.search(rf'\b{name}: \{{ key: "[^"]+", url: ([^,]+), w: \d+, cx: ([\d.]+), cy: ([\d.]+)', kit)
        url = m.group(1).strip()
        url = url.replace('V2 + "', "assets/cook/items/chai-v2/").strip('"')
        checks.append((f"Cook.Kit.VESSELS.{name}", url, float(m.group(2)), float(m.group(3))))
    m = re.search(r"panTop: \{ w: \d+, h: \d+, cx: ([\d.]+), cy: ([\d.]+)", chai)
    checks.append(("chai-tray META.panTop", "assets/cook/items/chai-v2/pan-top.webp", float(m.group(1)), float(m.group(2))))
    meta = json.load(open(os.path.join(ROOT, "assets/cook/items/chai-v2/meta.json")))["panTop"]
    checks.append(("chai-v2/meta.json panTop", "assets/cook/items/chai-v2/pan-top.webp", meta["cx"], meta["cy"]))
    bad = 0
    for label, url, cx, cy in checks:
        res, fx, fy, fr = fit_rim(os.path.join(ROOT, url))
        off = max(abs(fx - cx), abs(fy - cy))
        ok = off <= TOL
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {label}: recorded ({cx:.4f}, {cy:.4f}), rim ({fx:.4f}, {fy:.4f}), off {off:.4f} (fit {res:.1f}px)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
