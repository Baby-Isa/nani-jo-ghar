#!/usr/bin/env python3
"""Automatic checks for hand sprites (hands v1). Complements looking at the
contact sheets; it does not replace it.

Per image: skin midtone hex and its delta E to the group's reference,
alpha (share fully transparent, share semi-transparent, stray specks
away from the hand), whether the forearm enters from the bottom edge, and
whether the hand is clipped at the top, left or right edge.

    python3 build/qa_hands.py hands-master [hands-girl ...] [--json out.json]
"""
import argparse
import json
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402


def blobs(mask):
    """Connected components (4-neighbour) of a boolean mask via PIL-free
    flood fill on a downsampled grid; returns component sizes."""
    small = mask[::4, ::4]
    seen = np.zeros_like(small, dtype=bool)
    sizes = []
    h, w = small.shape
    for y, x in zip(*np.nonzero(small)):
        if seen[y, x]:
            continue
        stack, n = [(y, x)], 0
        seen[y, x] = True
        while stack:
            cy, cx = stack.pop()
            n += 1
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < h and 0 <= nx < w and small[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((ny, nx))
        sizes.append(n * 16)
    return sorted(sizes, reverse=True)


def check(path, target_lab):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im)[..., 3]
    mid, hx, n = ga.measure_skin_midtone(im)
    opaque = a > 16
    comps = blobs(opaque)
    stray = sum(c for c in comps[1:] if c < 2000)
    edge = 3
    r = {
        "file": os.path.relpath(path, ga.GAME),
        "skin": hx,
        "skin_de": round(ga.delta_e(mid, target_lab), 1) if mid is not None and target_lab is not None else None,
        "transparent_pct": round(100 * float((a == 0).mean()), 1),
        "semi_pct": round(100 * float(((a > 0) & (a < 255)).mean()), 2),
        "parts": len([c for c in comps if c >= 2000]),
        "stray_px": int(stray),
        "enters_bottom": bool(opaque[-edge:, :].any()),
        "clipped": [s for s, sl in (("top", opaque[:edge, :]), ("left", opaque[:, :edge]), ("right", opaque[:, -edge:])) if sl.any()],
    }
    flags = []
    if r["skin_de"] is not None and r["skin_de"] > 3.5:
        flags.append(f"skin dE {r['skin_de']}")
    if r["skin"] is None:
        flags.append("no skin found")
    if r["transparent_pct"] < 30:
        flags.append("background not transparent")
    if r["stray_px"] > 400:
        flags.append(f"stray pixels {r['stray_px']}")
    if not r["enters_bottom"]:
        flags.append("forearm does not reach the bottom edge")
    if r["clipped"]:
        flags.append("touches " + "/".join(r["clipped"]))
    r["flags"] = flags
    return r


def main():
    p = argparse.ArgumentParser()
    p.add_argument("groups", nargs="+")
    p.add_argument("--json")
    args = p.parse_args()
    data = ga.load_asset_list(ga.DEFAULT_ASSET_LIST)
    cfg = ga.load_config(data)
    out = []
    for entry in data["assets"]:
        if entry.get("group") not in args.groups:
            continue
        v = entry.get("variants", 1)
        target = ga.skin_target_for(entry, cfg)
        for i in range(v):
            path = ga.resolve_path(ga.variant_path(entry["output"], i, v))
            if not os.path.exists(path):
                out.append({"file": os.path.relpath(path, ga.GAME), "flags": ["missing"]})
                continue
            out.append(check(path, target))
    for r in out:
        print(f"{r['file']:70s} {str(r.get('skin')):8s} dE {str(r.get('skin_de')):5s} "
              f"{'; '.join(r['flags']) or 'ok'}")
    if args.json:
        with open(args.json, "w") as f:
            json.dump(out, f, indent=1)


if __name__ == "__main__":
    main()
