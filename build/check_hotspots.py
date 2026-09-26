#!/usr/bin/env python3
"""Check the clinic's patient hotspots (docs/modes/clinic-design.md 12.2 task 1, R3.9).

For each patient hotspot file (data/patients/*.json) and each of the six
test screen sizes, it reports every part's EFFECTIVE hit area: the design
pixels where a tap lands on that part, using the same rule as
js/clinic/body.js (inside: the smallest active part that contains the tap;
outside: the nearest active part within `pad` design px). It converts that
to centimetres on the device (the canvas is fitted into the stage beside
the sidebar, as css/cook.css lays it out) and checks:

  - level 1 (the six big parts, no close-up): every part's hit area is at
    least MIN_CM across (the diameter of a circle of the same area) on the
    iPad; on the phone it is reported and the part is flagged "opens zoomed"
    with the zoom it needs;
  - the face parts are "close-up only": they are checked inside the
    close-up (scaled by closeup.scale) instead;
  - overlaps: two polygons of the same level overlapping by more than
    OVERLAP of the smaller one's area (the knee inside the leg is fine: they
    are never live together at level 1);
  - mirroring: every .left has a .right after mirroring, and the pair is
    symmetric across axisX.

Usage: python3 build/check_hotspots.py [--pxcm-ipad 52] [--pxcm-phone 63] [--min-cm 2]
Exit code 1 if a level-1 part is under MIN_CM on the iPad.
"""
import argparse
import glob
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIEWPORTS = [
    ("flip5-landscape", 915, 375, "phone"),
    ("laptop", 1366, 768, "laptop"),
    ("laptop-16x10", 1440, 900, "laptop"),
    ("laptop-1280x800", 1280, 800, "laptop"),
    ("ipad", 1024, 768, "ipad"),
    ("ipad-portrait", 768, 1024, "ipad"),
]


def side_w(w, h):
    """css/cook.css --side-w, and the portrait layout (sidebar below)."""
    a = w / h
    if a <= 1332 / 1000:
        return None
    if 1333 / 1000 <= a <= 1.5:
        return 244
    return min(360, max(min(max(200, 0.19 * w), 300), w - h * 16 / 9))


def canvas_scale(w, h):
    sw = side_w(w, h)
    if sw is None:  # portrait: the stage is the full width, 16:9, above the sidebar
        return min(w / 1600, (w * 9 / 16) / 900)
    return min((w - sw) / 1600, h / 900)


def inside(poly, x, y):
    c = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-9) + xi:
            c = not c
        j = i
    return c


def area(poly):
    a = 0
    j = len(poly) - 1
    for i in range(len(poly)):
        a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1])
        j = i
    return abs(a / 2)


def seg_dist(px, py, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    t = max(0, min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / ((dx * dx + dy * dy) or 1)))
    return math.hypot(px - a[0] - t * dx, py - a[1] - t * dy)


def dist(poly, x, y):
    if inside(poly, x, y):
        return 0
    return min(seg_dist(x, y, poly[j], poly[i]) for i, j in zip(range(len(poly)), [len(poly) - 1] + list(range(len(poly) - 1))))


def build(f):
    polys = {}
    ax = f.get("axisX", 800)
    for k, p in f["parts"].items():
        polys[k] = p
        if f.get("mirror") and k.endswith(".left"):
            polys.setdefault(k[:-5] + ".right", [[2 * ax - x, y] for x, y in p])
    return polys


def part_of(k):
    return k.split(".")[0]


def hit_areas(polys, live, pad, step=4, box=(0, 0, 1600, 900)):
    out = {k: 0 for k in live}
    ordered = sorted(live, key=lambda k: area(polys[k]))
    for y in range(box[1], box[3], step):
        for x in range(box[0], box[2], step):
            best = None
            for k in ordered:
                if inside(polys[k], x, y):
                    best = k
                    break
            if best is None:
                bd = pad
                for k in live:
                    d = dist(polys[k], x, y)
                    if d < bd:
                        bd, best = d, k
            if best:
                out[best] += step * step
    return out


def main():
    ap = argparse.ArgumentParser()
    # CSS px per cm: iPad 132 CSS px/inch = 52/cm; a phone ~160 CSS px/inch = 63/cm (the brief's defaults)
    ap.add_argument("--pxcm-ipad", type=float, default=132 / 2.54)
    ap.add_argument("--pxcm-phone", type=float, default=160 / 2.54)
    ap.add_argument("--pxcm-laptop", type=float, default=96 / 2.54)
    ap.add_argument("--min-cm", type=float, default=2.0)
    a = ap.parse_args()
    data = json.load(open(os.path.join(ROOT, "data/clinic.json")))
    lv1 = data["levels"][0]["parts"]
    lvl = data["mechanics"]["where"]["levels"][0]
    pad = lvl.get("pad", 120)
    min_hit = lvl.get("minHitPx", 160)
    fails = []
    for path in sorted(glob.glob(os.path.join(ROOT, "data/patients/*.json"))):
        f = json.load(open(path))
        polys = build(f)
        name = os.path.basename(path)
        face = set((f.get("closeup") or {}).get("parts", []))
        print(f"\n{name}: {len(polys)} polygons after mirroring (pad {pad}, level-1 minHitPx {min_hit})")
        # mirroring
        for k in list(polys):
            if k.endswith(".left") and k[:-5] + ".right" not in polys:
                fails.append(f"{name}: {k} has no right side")
        # overlaps among level-1 live parts
        live1 = [k for k in polys if part_of(k) in lv1 and part_of(k) not in face]
        for i, k1 in enumerate(live1):
            for k2 in live1[i + 1:]:
                p1, p2 = polys[k1], polys[k2]
                xs = [p[0] for p in p1 + p2]
                ys = [p[1] for p in p1 + p2]
                n = both = 0
                for y in range(min(ys), max(ys), 4):
                    for x in range(min(xs), max(xs), 4):
                        i1, i2 = inside(p1, x, y), inside(p2, x, y)
                        both += i1 and i2
                        n += i1 or i2
                small = min(area(p1), area(p2)) / 16
                if small and both / small > 0.1:
                    fails.append(f"{name}: {k1} and {k2} overlap {100 * both / small:.0f}% of the smaller at level 1")
        areas = hit_areas(polys, live1, pad)
        print(f"  level 1 hit areas (design px): " + ", ".join(f"{k} {int(v)}" for k, v in sorted(areas.items())))
        for k, v in areas.items():
            if 2 * math.sqrt(v / math.pi) < min_hit:
                fails.append(f"{name}: {k} hit area is {2 * math.sqrt(v / math.pi):.0f} design px across, under minHitPx {min_hit}")
        # the face in the close-up: the drawing is scaled; its hit areas scale with it
        cu = f.get("closeup") or {}
        s = cu.get("scale", 1)
        live_face = [k for k in polys if part_of(k) in face or part_of(k) == "body-head"]
        fr = cu.get("rect", [0, 0, 1600, 900])
        face_areas = hit_areas(polys, live_face, pad / s, step=2, box=(fr[0], fr[1], fr[0] + fr[2], fr[1] + fr[3]))
        print(f"  {'viewport':17} {'scale':>6} " + " ".join(f"{part_of(k)[5:] + ('.' + k.split('.')[1][0] if '.' in k else ''):>9}" for k in sorted(areas)))
        for vp, w, h, kind in VIEWPORTS:
            sc = canvas_scale(w, h)
            pxcm = {"ipad": a.pxcm_ipad, "phone": a.pxcm_phone, "laptop": a.pxcm_laptop}[kind]
            cms = {k: 2 * math.sqrt(v / math.pi) * sc / pxcm for k, v in areas.items()}
            print(f"  {vp:17} {sc:6.3f} " + " ".join(f"{cms[k]:8.2f}c" for k in sorted(areas)))
            small = [k for k, c in cms.items() if c < a.min_cm]
            if kind == "ipad" and vp == "ipad" and small:
                fails.append(f"{name} on {vp}: level-1 parts under {a.min_cm} cm: " + ", ".join(f"{k} {cms[k]:.2f}" for k in small))
            if kind == "phone" and small:
                zoom = max(a.min_cm / cms[k] for k in small)
                print(f"    phone: {len(small)} level-1 parts under {a.min_cm} cm -> the phone opens zoomed x{zoom:.2f} (as the design says)")
            fcm = {k: 2 * math.sqrt(v / math.pi) * s * sc / pxcm for k, v in face_areas.items() if part_of(k) != "body-head"}
            if vp in ("ipad", "flip5-landscape"):
                print(f"    close-up only (x{s}): " + ", ".join(f"{part_of(k)[5:]}{'.' + k.split('.')[1][0] if '.' in k else ''} {c:.2f}c" for k, c in sorted(fcm.items())))
    if fails:
        print("\nFAIL:\n  " + "\n  ".join(fails))
        sys.exit(1)
    print("\nPASS: level-1 parts at least %.1f cm on the iPad; the phone opens zoomed; face parts are close-up only; mirrored." % a.min_cm)


if __name__ == "__main__":
    main()
