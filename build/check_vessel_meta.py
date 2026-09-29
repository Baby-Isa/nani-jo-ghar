#!/usr/bin/env python3
"""Checks that each vessel's recorded body centre and radius match its art (29 Sept).

The chai pan's centre was measured with its handle still attached, so every pan sat low-left of its
burner and nobody saw it in the screenshots. This fits a circle to each vessel's rim (the handle's side
left out) and fails when the recorded centre is off by more than 1.5% of the image width.

  python3 build/check_vessel_meta.py
Vessels with two handles (karahi, pot) are set by hand from their cuts and aren't checked here.

v3 (29 Sept, build/cut_cook_v3.py): every round thing in assets/cook/items/v3/*/meta.json (pans, pots,
tawa, karahi, plates, maani, bowls, knobs...) is re-fitted here with the handles dropped as outliers
(cut_cook_v3.robust_circle), and every hob's burner centres are re-found from its brass caps and
compared with its meta.json AND with Cook.Kit's HOBS table in js/cook/kitchen-kit.js.
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


def check_v3():
    """The v3 cuts: each round thing's centre and radius, each hob's burners (art, meta and the kit)."""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from cut_cook_v3 import gold_caps, robust_circle
    V3 = os.path.join(ROOT, "assets", "cook", "items", "v3")
    bad = 0
    kit = open(os.path.join(ROOT, "js/cook/kitchen-kit.js")).read()
    for group in sorted(os.listdir(V3)):
        mp = os.path.join(V3, group, "meta.json")
        if not os.path.exists(mp):
            continue
        meta = json.load(open(mp))
        for name, m in meta.items():
            path = os.path.join(V3, group, name + ".webp")
            img = np.asarray(Image.open(path).convert("RGBA")).astype(float)
            H, W = img.shape[:2]
            if "burners" in m:
                caps = gold_caps(img)
                got = [(x / W, y / H) for x, y, _ in caps]
                want = [(b["x"], b["y"]) for b in m["burners"]]
                off = max((max(abs(a[0] - b[0]), abs(a[1] - b[1])) for a, b in zip(got, want)), default=1) if len(got) == len(want) else 1
                # and the kit's table (HOBS) must say the same
                key = name.replace("hob-", "")
                km = re.search(rf"\b{key}: \{{ w: (\d+), h: (\d+), burners: (\[\[.*?\]\]), frontY: ([\d.]+)", kit)
                koff = 1
                if km:
                    kb = json.loads(km.group(3))
                    same_size = int(km.group(1)) == W and int(km.group(2)) == H
                    koff = max(max(abs(a[0] - b[0]), abs(a[1] - b[1])) for a, b in zip(kb, want)) if same_size and len(kb) == len(want) else 1
                    koff = max(koff, abs(float(km.group(4)) - m["frontY"]))
                ok = off <= TOL and koff <= 0.001
                bad += not ok
                print(f"{'ok  ' if ok else 'FAIL'} v3 hob/{name}: {len(caps)} burners, art vs meta off {off:.4f}, meta vs Cook.Kit off {koff:.4f}")
            elif "bowl_r" in m:  # the ladle: its round bowl, with the handle (above it) left out
                mask = img[..., 3] > 128
                mask[: int((m["bowl_cy"] - m["bowl_r"] * W / H * 0.5) * H)] = False
                cx, cy, r, res = robust_circle(mask)
                off = max(abs(cx / W - m["bowl_cx"]), abs(cy / H - m["bowl_cy"]), abs(r / W - m["bowl_r"]))
                ok = off <= TOL
                bad += not ok
                print(f"{'ok  ' if ok else 'FAIL'} v3 {group}/{name} bowl: recorded ({m['bowl_cx']:.4f}, {m['bowl_cy']:.4f}, r {m['bowl_r']:.4f}), rim ({cx / W:.4f}, {cy / H:.4f}, r {r / W:.4f}), off {off:.4f} (fit {res:.1f}px)")
            elif "cx" in m and "r" in m:
                cx, cy, r, res = robust_circle(img[..., 3] > 128)
                off = max(abs(cx / W - m["cx"]), abs(cy / H - m["cy"]), abs(r / W - m["r"]))
                ok = off <= TOL
                bad += not ok
                print(f"{'ok  ' if ok else 'FAIL'} v3 {group}/{name}: recorded ({m['cx']:.4f}, {m['cy']:.4f}, r {m['r']:.4f}), rim ({cx / W:.4f}, {cy / H:.4f}, r {r / W:.4f}), off {off:.4f} (fit {res:.1f}px)")
    return bad


def check_daar():
    """Daar v3 (29 Sept): js/cook/stations/daar.js places the pot, the trivet bowl and the ladle from constants
    (POT, TRIVET, LADLE); they must say what assets/cook/items/v3/daar/meta.json measured from the art (checked
    against the rims by check_v3), and every pot state must share the pot's registered canvas."""
    src = open(os.path.join(ROOT, "js/cook/stations/daar.js")).read()
    meta = json.load(open(os.path.join(ROOT, "assets/cook/items/v3/daar/meta.json")))
    bad = 0

    def const(name):
        m = re.search(rf"const {name} = \{{([^}}]*)\}}", src)
        return {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", m.group(1))}

    pairs = [("POT", "pot-empty", ("w", "h", "cx", "cy", "r")), ("TRIVET", "daar-bowl-trivet", ("w", "h", "cx", "cy", "r")),
             ("LADLE", "ladle", ("w", "h", "bowl_cx", "bowl_cy", "bowl_r"))]
    for name, key, fields in pairs:
        c = const(name)
        m = meta[key]
        mine = [c[f] for f in ("w", "h", "cx", "cy", "r")]
        theirs = [m[f] for f in fields]
        ok = all(abs(a - b) <= (1 if i < 2 else 0.002) for i, (a, b) in enumerate(zip(mine, theirs)))
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} daar.js {name}: {mine} vs meta {key}: {theirs}")
    pot = const("POT")
    for st in re.search(r"const POTS = \[([^\]]*)\]", src).group(1).replace('"', "").split(", "):
        m = meta[f"pot-{st}"]
        ok = m["w"] == pot["w"] and m["h"] == pot["h"] and abs(m["cx"] - pot["cx"]) < 0.004 and abs(m["cy"] - pot["cy"]) < 0.004
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} daar pot-{st}: {m['w']}x{m['h']}, centre ({m['cx']}, {m['cy']}) on the pot's canvas")
    # the contents' clip sits inside the rim
    ok = pot["inner"] < pot["r"]
    bad += not ok
    print(f"{'ok  ' if ok else 'FAIL'} daar POT.inner {pot['inner']} < r {pot['r']}")
    return bad


def grill_bars(path):
    """The grill's light metal rows (the rim, the two bars, the inner front edge), as fractions of its height."""
    im = np.asarray(Image.open(path).convert("RGBA")).astype(int)
    H, W = im.shape[:2]
    r, g, b, a = (im[..., i] for i in range(4))
    m = (a > 128) & (r > 140) & (g > 140) & (b > 140) & (np.abs(r - b) < 30)
    x0, x1 = int(W * 0.15), int(W * 0.85)
    rows = [y for y in range(H) if m[y, x0:x1].mean() > 0.6]
    groups = []
    for y in rows:
        if groups and y - groups[-1][-1] <= 2:
            groups[-1].append(y)
        else:
            groups.append([y])
    return [float(np.mean(g_)) / H for g_ in groups]


def check_sekelo():
    """Sekelo v3 (30 Sept, K6/K8/K9): each drawn skewer's line in the rack and plate pictures, the grill's bars
    and bed, and the stick: the art (re-measured) vs meta.json vs js/cook/mechanics/grill.js's SK.V3 table."""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import measure_sekelo_v3 as MS
    meta = json.load(open(os.path.join(MS.DIR, "meta.json")))
    js = open(os.path.join(ROOT, "js/cook/mechanics/grill.js")).read()
    bad = 0

    def table(name):
        m = re.search(rf"\b{name}: \{{ w: (\d+), h: (\d+),(.*?)\}},\n", js)
        return m and (int(m.group(1)), int(m.group(2)), m.group(3))

    def off(a, b):
        if len(a) != len(b):
            return 1
        return max([abs(x - y) for p, q in zip(a, b) for x, y in zip(p, q)] or [0])

    for kind, n0, measure in (("rack", 0, MS.rack_sticks), ("plate", 1, None)):
        t = table(kind)
        js_sticks = json.loads(re.search(r"sticks: (\[\[.*\]\])", t[2]).group(1)) if t else None
        for n in range(n0, 5):
            name = f"{kind}-{n}"
            art = (MS.rack_sticks(name) if n else []) if kind == "rack" else MS.plate_sticks(name, n) if n else []
            rec = meta[name].get("sticks")
            W, H = Image.open(os.path.join(MS.DIR, name + ".webp")).size
            o1 = off(art, rec or [])
            o2 = off(rec or [], js_sticks[n]) if js_sticks and t[0] == W and t[1] == H else 1
            ok = rec is not None and o1 <= TOL and o2 <= 0.001
            bad += not ok
            print(f"{'ok  ' if ok else 'FAIL'} v3 sekelo/{name}: {len(art)} skewers, art vs meta off {o1:.4f}, meta vs grill.js off {o2:.4f}")
    # the grill: its bars (the art's light rows) and bed, in meta and in grill.js
    gm = meta["grill"]
    rows = grill_bars(os.path.join(MS.DIR, "grill.webp"))
    ob = max(min(abs(r - y) for r in rows) for y in gm["bars_y"])
    bed = MS.grill_bed()
    t = table("grill")
    tb = json.loads(re.search(r"bars: (\[.*?\])", t[2]).group(1)) if t else []
    tbed = json.loads(re.search(r"bed: (\[.*?\])", t[2]).group(1)) if t else []
    o2 = max([abs(a - b) for a, b in zip(tb, gm["bars_y"][1:3])] + [abs(a - b) for a, b in zip(tbed, gm["bed"])] + [0 if t and (t[0], t[1]) == (gm["w"], gm["h"]) else 1])
    ob2 = max(abs(a - b) for a, b in zip(bed, gm["bed"]))
    ok = ob <= TOL and ob2 <= TOL and o2 <= 0.001 and len(tb) == 2 and len(tbed) == 4
    bad += not ok
    print(f"{'ok  ' if ok else 'FAIL'} v3 sekelo/grill: bars art vs meta off {ob:.4f}, bed off {ob2:.4f}, meta vs grill.js off {o2:.4f}")
    # the stick the code moves about: its tip, handle and end
    st = meta["stick"]
    sm = re.search(r"stick: \{ w: (\d+), h: (\d+), tip: ([\d.]+), handle: ([\d.]+), end: ([\d.]+)", js)
    o = max(abs(float(sm.group(i + 3)) - st[k]) for i, k in enumerate(("tip", "handle", "end"))) if sm else 1
    ok = o <= 0.001 and (int(sm.group(1)), int(sm.group(2))) == Image.open(os.path.join(MS.DIR, "stick.webp")).size
    bad += not ok
    print(f"{'ok  ' if ok else 'FAIL'} v3 sekelo/stick: meta vs grill.js off {o:.4f}")
    return bad


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
    bad = check_v3()
    bad += check_daar()
    bad += check_sekelo()
    # the samosa station places its v3 karahi and plate by numbers copied from meta.json: they must agree
    sam = open(os.path.join(ROOT, "js/cook/stations/samosa.js")).read()
    smeta = json.load(open(os.path.join(ROOT, "assets/cook/items/v3/samosa/meta.json")))
    for name in ("karahi", "plate"):
        m = re.search(rf"\b{name}: \{{ w: (\d+), cx: ([\d.]+), cy: ([\d.]+), r: ([\d.]+)", sam)
        rec = smeta[name]
        got = (int(m.group(1)), float(m.group(2)), float(m.group(3)), float(m.group(4))) if m else None
        ok = bool(got) and got[0] == rec["w"] and max(abs(got[1] - rec["cx"]), abs(got[2] - rec["cy"]), abs(got[3] - rec["r"])) <= 1e-4
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} samosa.js META.{name}: {got} vs meta.json (w {rec['w']}, cx {rec['cx']}, cy {rec['cy']}, r {rec['r']})")
    for label, url, cx, cy in checks:
        res, fx, fy, fr = fit_rim(os.path.join(ROOT, url))
        off = max(abs(fx - cx), abs(fy - cy))
        ok = off <= TOL
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {label}: recorded ({cx:.4f}, {cy:.4f}), rim ({fx:.4f}, {fy:.4f}), off {off:.4f} (fit {res:.1f}px)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
