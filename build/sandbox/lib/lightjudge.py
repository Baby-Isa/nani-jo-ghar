"""The light-picture judge (s19-checks-1; contract-112; build/reports/s19-checks-review.md section 5, change 2).

python3 build/sandbox/lib/lightjudge.py LIGHT_DIR [LIGHT_DIR ...]   (each from lib/lightshot.mjs: before.jpg, with.jpg, light.json)

From the screen, not the game's account: what the light did not darken is found by comparing the frame just before the light with the
screen with it, pixel block by pixel block. A block the dim covers is darker by the dim's share of the way to the dim's colour
(Onboard.dimFill, rgb(30,18,10)): a = (before - with) / (before - dim colour) is that share, about 0.45 for the kit's dim (chai). What
was not darkened (a near 0) is the lit region. It passes only if:
  1. exactly one lit region (a second hole, a ring that travels, a lit patch of its own, fails);
  2. it is a rounded rectangle: its corners at most a quarter of its height (a circle or an oval fails), and it fills its own box;
  3. whole inside the frame unless its thing touches the edge;
  4. its thing's picture, its word pill and its face (the canvas's object list names which objects they are; the box is measured in
     pixels) inside it with the set pad (Onboard.BOX_PAD, or the kit's margin where smaller), less only where a neighbour is closer,
     and not a region much bigger than its thing;
  5. never over the side panel (unless it lights a card there) or over a face it is not lighting;
  6. the dim's darkness within DIM_MARGIN of chai's (DIM_REF);
  7. nothing moving into it while it is up (a thing still arriving after the light came).
The knife's swipe (STD-E2-08a: Onboard.VARIANTS.swipe, chop's, wherever chop's game runs: daar's onion, chaat) passes 4 when the box holds the knife, the item and the
path between them. Writes verdict.json beside each light, and mark.jpg (the screen with what was measured drawn on it) when it fails.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

DIM_RGB = (30, 18, 10)
DIM_LUM = 0.3 * 30 + 0.59 * 18 + 0.11 * 10
DIM_REF = 0.45          # chai's dim, measured on its light pictures (the bad-runs fixtures' chai-head-*: 0.44 to 0.46)
DIM_MARGIN = 0.08       # the dim's share may differ from chai's by this much (eggs' two dims at once: 0.75)
CELL = 2                # px per block (at the page's own scale)
INFO = 28               # a block this much brighter than the dim's colour tells lit from dim
LIT_A = 0.16            # a below this: not darkened
DIM_A = 0.26            # a above this: darkened
CORNER = 0.25           # a corner's radius at most this share of the box's height (STD-E2-08)
CORNER_TOL = 4          # px, the feathered edge and the gold line
FILL = 0.88             # the lit share of its own rounded box at least this
PAD_TOL = 4             # px a side may fall short of its pad (the feather, the gold line, the blocks)
OVER_PAD = 30           # px of room past the kit's largest margin on a side: a region, not a hug
EDGE = 3                # px from the frame's edge counts as touching it
PANEL_TOL = 4           # px into the side panel
FACE_IN = 0.2           # a face this far inside the light, not its own, is lit by it
MOVED_MAX = 0.3        # more of the screen than this moving between the pictures: not judged (a view changing, a pop-up coming)
MOVE_PX = 14            # a thing whose middle moved this far (or 30% of its size) while the light was up was moving into it
SWIPE_GAMES = ["chop"]   # STD-E2-08a, until Onboard.VARIANTS names them (read from the page when it does); a variant is a game's and
# goes wherever that game runs (Zafar, 10 Nov: one chop, chained into recipes: daar's onion and chaat's chops are chop's game)
CHAINED = {"chop": ["daar", "chaat", "assemble"]}
SURFACE = ("bg", "wall", "marble", "worktop", "counter", "stage", "panel", "band", "shelf", "slab", "kitchen", "floor", "backdrop", "room", "flame", "steam", "smoke", "hob")


def lum(im):
    a = np.asarray(im.convert("RGB"), dtype=np.float32)
    return 0.3 * a[..., 0] + 0.59 * a[..., 1] + 0.11 * a[..., 2]


def blocks(L, c):
    h, w = (L.shape[0] // c) * c, (L.shape[1] // c) * c
    return L[:h, :w].reshape(h // c, c, w // c, c).mean(axis=(1, 3))


def union(a, b):
    if a is None:
        return b
    if b is None:
        return a
    return [min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])]


def area(b):
    return max(0, b[2] - b[0]) * max(0, b[3] - b[1])


def inter(a, b):
    return max(0, min(a[2], b[2]) - max(a[0], b[0])) * max(0, min(a[3], b[3]) - max(a[1], b[1]))


def mid(b):
    return ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2)


def inside(p, b, pad=0):
    return b[0] - pad <= p[0] <= b[2] + pad and b[1] - pad <= p[1] <= b[3] + pad


def fmt(b):
    return "[" + ",".join(str(int(round(v))) for v in b) + "]"


def corner_radius(lit, known, y0, x0, y1, x1, corner):
    """The radius (in blocks) of the rounded corner that best fits the lit blocks at one corner of the box [y0, y1) x [x0, x1)."""
    hh, ww = y1 - y0, x1 - x0
    rmax = max(1, min(hh, ww) // 2)
    ys, xs = np.mgrid[0:rmax, 0:rmax]
    # (distance from the corner, inward: block (0, 0) is the corner block)
    if corner == "tl":
        sub_l, sub_k = lit[y0:y0 + rmax, x0:x0 + rmax], known[y0:y0 + rmax, x0:x0 + rmax]
    elif corner == "tr":
        sub_l, sub_k = lit[y0:y0 + rmax, x1 - rmax:x1][:, ::-1], known[y0:y0 + rmax, x1 - rmax:x1][:, ::-1]
    elif corner == "bl":
        sub_l, sub_k = lit[y1 - rmax:y1, x0:x0 + rmax][::-1, :], known[y1 - rmax:y1, x0:x0 + rmax][::-1, :]
    else:
        sub_l, sub_k = lit[y1 - rmax:y1, x1 - rmax:x1][::-1, ::-1], known[y1 - rmax:y1, x1 - rmax:x1][::-1, ::-1]
    if sub_l.shape != (rmax, rmax) or sub_k.sum() < 4:
        return None
    best, best_r = None, 0
    for r in range(0, rmax + 1):
        cy = cx = r
        out = (ys + 0.5 < cy) & (xs + 0.5 < cx) & ((ys + 0.5 - cy) ** 2 + (xs + 0.5 - cx) ** 2 > r * r)
        want = ~out
        miss = ((sub_l != want) & sub_k).sum()
        if best is None or miss < best:
            best, best_r = miss, r
    return best_r


def game_of(flow):
    f = (flow or "").split("#")[0].split("@")[0]
    return f.split(":")[-1].split("/")[-1].replace("recipe-", "")


def judge(d):
    meta = json.load(open(os.path.join(d, "light.json")))
    W = Image.open(os.path.join(d, "with.jpg"))
    # the reference: the same moment with every painted layer over the play area hidden (lib/lightshot.mjs), else the frame before
    ref = "under.jpg" if os.path.exists(os.path.join(d, "under.jpg")) else "before.jpg"
    B = Image.open(os.path.join(d, ref))
    if B.size != W.size:
        B = B.resize(W.size)
    o1 = meta.get("objs1") or {}
    o0 = meta.get("objs0") or {}
    o2 = meta.get("objs2") or {}
    vw = o1.get("vw") or W.width
    vh = o1.get("vh") or W.height
    k = W.width / float(vw)
    c = max(1, int(round(CELL * k)))
    Lb, Lw = blocks(lum(B), c), blocks(lum(W), c)
    known = (Lb - DIM_LUM) > INFO
    known_any = np.ones_like(known)
    # what moved while the pictures were taken (the screen once more after the reference): not judged
    if os.path.exists(os.path.join(d, "with2.jpg")):
        W2 = Image.open(os.path.join(d, "with2.jpg"))
        if W2.size == W.size:
            moved = np.abs(blocks(lum(W2), c) - Lw) > 10
            moved = ndimage.binary_dilation(moved, iterations=2)
            # (the light itself moved on before the second picture, the kit's note's box mostly changed: no motion mask then)
            hs = meta.get("holes") or []
            k0 = W.width / float(((meta.get("objs1") or {}).get("vw")) or W.width)
            inhole = [moved[int(h[1] * k0 / c):int(h[3] * k0 / c) + 1, int(h[0] * k0 / c):int(h[2] * k0 / c) + 1] for h in hs]
            if inhole and all(x.size and x.mean() >= 0.4 for x in inhole):
                out_moved = None
            else:
                known = known & ~moved
                known_any = ~moved
                out_moved = float(moved.mean())
        else:
            out_moved = None
    else:
        out_moved = None
    a = (Lb - Lw) / np.maximum(Lb - DIM_LUM, 1.0)
    # the kit's finger sits over the dim: not a lit place
    for f in o1.get("fingers") or []:
        x0, y0, x1, y1 = [int(v * k / c) for v in f]
        known[max(0, y0 - 1):y1 + 2, max(0, x0 - 1):x1 + 2] = False
    # not darkened: a near 0 where the screen is light enough to tell; and anything the light made brighter (its gold line, its warm
    # glow), which outlines a light even on a black hob, whose inside is then filled
    lit = (known & (a < LIT_A)) | (((Lw - Lb) > 24) & known_any)
    for f in (o1.get("fingers") or []) + (o1.get("above") or []):
        x0, y0, x1, y1 = [int(v * k / c) for v in f]
        lit[max(0, y0 - 1):y1 + 2, max(0, x0 - 1):x1 + 2] = False
        known[max(0, y0 - 1):y1 + 2, max(0, x0 - 1):x1 + 2] = False
    lit = ndimage.binary_fill_holes(lit)
    known = known | lit
    dim = known & (a > DIM_A)
    gh, gw = lit.shape
    fails = []
    out = {"dir": d, "flow": meta.get("flow"), "size": meta.get("size"), "n": meta.get("n"), "ref": ref, "moved": None if out_moved is None else round(out_moved, 3)}
    if out_moved is not None and out_moved >= MOVED_MAX:
        out.update(ok=None, skipped=f"the screen changed while its pictures were taken ({round(100 * out_moved)}% of it moved)", fails=[])
        return out, meta, None
    # 1. the lit regions (blocks joined side to side and corner to corner; specks of a moving thing dropped)
    lab, n = ndimage.label(lit, structure=np.ones((3, 3)))
    sizes = ndimage.sum(lit, lab, range(1, n + 1)) if n else []
    px2 = (c / k) ** 2
    sig = max(500.0, 0.0015 * vw * vh) / px2
    comps = [(i + 1, s) for i, s in enumerate(sizes) if s >= sig]
    comps.sort(key=lambda x: -x[1])
    # (a second region counts only where the screen is truly left as it was: a glow that pulses or a thing that brightens is not a hole)
    strict = known & (a > -0.15) & (a < LIT_A)
    comps = comps[:1] + [(i, sz) for i, sz in comps[1:] if strict[lab == i].sum() >= 0.5 * sz]
    out["regions"] = len(comps)
    if not comps:
        out.update(ok=False, fails=["nothing lit: no part of the screen was left undarkened by the dim"])
        return out, meta, None
    if len(comps) > 1:
        boxes = []
        for i, _ in comps[:4]:
            ys, xs = np.where(lab == i)
            boxes.append(fmt([xs.min() * c / k, ys.min() * c / k, (xs.max() + 1) * c / k, (ys.max() + 1) * c / k]))
        fails.append(f"{len(comps)} lit regions, not one: {' '.join(boxes)}")
    main = lab == comps[0][0]
    if main.sum() * px2 >= 0.9 * vw * vh:
        # (nothing darkened: the kit's note says a light is up, the screen shows no dim; a pop-up over it, or a layer gone: not judged)
        out.update(ok=None, skipped="nothing on the screen was darkened while the kit's note said a light was up", fails=[])
        return out, meta, None
    ys, xs = np.where(main)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    R = [x0 * c / k, y0 * c / k, x1 * c / k, y1 * c / k]
    Hpx, Wpx = R[3] - R[1], R[2] - R[0]
    out["region"] = [round(v) for v in R]
    # 2. its shape: each corner's radius (corners on the frame's edge are not judged) and how much of its own box it fills
    at_edge = {"l": R[0] <= EDGE, "t": R[1] <= EDGE, "r": R[2] >= vw - EDGE, "b": R[3] >= vh - EDGE}
    radii = {}
    for cn, sides in (("tl", "lt"), ("tr", "rt"), ("bl", "lb"), ("br", "rb")):
        if at_edge[sides[0]] or at_edge[sides[1]]:
            continue
        r = corner_radius(main, known, y0, x0, y1, x1, cn)
        if r is not None:
            radii[cn] = r * c / k
    out["radii"] = {kk: round(v, 1) for kk, v in radii.items()}
    if radii:
        rr = sorted(radii.values())[len(radii) // 2] if len(radii) % 2 else sum(sorted(radii.values())[len(radii) // 2 - 1:len(radii) // 2 + 1]) / 2
        out["radius"] = round(rr, 1)
        if rr > max(CORNER * Hpx, 6) + CORNER_TOL:
            shape = "a circle" if abs(Wpx - Hpx) < 0.15 * max(Wpx, Hpx) and rr > 0.4 * Hpx else "an oval" if rr > 0.4 * Hpx else "corners too round"
            fails.append(f"not a rounded rectangle: {shape} (corners {round(rr)} px on a box {round(Hpx)} px high, at most a quarter: {round(CORNER * Hpx)} px)")
    kb = known[y0:y1, x0:x1]
    fill = float((main[y0:y1, x0:x1] & kb).sum()) / max(1.0, float(kb.sum()))
    out["fill"] = round(fill, 3)
    if fill < FILL:
        fails.append(f"not one box: only {round(100 * fill)}% of its own box is lit (two shapes, or a ring)")
    # 6. the dim: its share on the blocks round the region (not the region, not a ring just round it)
    ring = np.zeros_like(main)
    ring[max(0, y0 - 6):y1 + 6, max(0, x0 - 6):x1 + 6] = True
    outside = known & ~ring
    vals = a[outside & (dim | (a > LIT_A))]
    if vals.size > 50:
        dm = float(np.median(vals))
        out["dim"] = round(dm, 3)
        if abs(dm - DIM_REF) > DIM_MARGIN:
            fails.append(f"the dim is {'darker' if dm > DIM_REF else 'lighter'} than chai's: {round(dm, 2)} of the way to the dim's colour against chai's {DIM_REF} (within {DIM_MARGIN})")
    # 4. what it lights (the canvas's objects name the thing; the box is the measured one)
    cvb = o1.get("cv")
    cvA = area(cvb) if cvb else vw * vh
    words = o1.get("words") or []
    faces = [f for f in (o1.get("faces") or []) if f.get("box")]
    pics = [p for p in (o1.get("pics") or []) if p.get("box") and area(p["box"]) < 0.3 * cvA and not any(s in p["id"].lower() for s in SURFACE)]
    cards = o1.get("cards") or []
    kit = o1.get("kit") or {}
    variants = (kit.get("VARIANTS") or {}) if isinstance(kit.get("VARIANTS"), dict) else {}
    game = game_of(meta.get("flow"))
    swipe_games = variants.get("swipe") if variants.get("swipe") is not None else SWIPE_GAMES
    out["variantsFrom"] = "Onboard.VARIANTS" if variants else "the check's own list (Onboard.VARIANTS not in this build)"
    knife = next((p for p in (o1.get("pics") or []) if "knife" in p["id"].lower() and inter(p["box"], R) > 0.3 * area(p["box"])), None)
    layer_v = any((l or {}).get("variant") == "swipe" for l in (o1.get("layers") or []))
    runs = {game} | {g for g, hosts in CHAINED.items() if game in hosts}
    swipe = (layer_v or bool(runs & set(swipe_games))) and knife is not None
    out["variant"] = "swipe" if swipe else None

    def U(w):
        return union(w["pic"], w.get("chip"))

    def share_in(b, box):
        return inter(b, box) / max(1.0, area(b))

    thing, T = None, None
    cand = [w for w in words if share_in(U(w), R) >= 0.5 and not ("knife" in (w.get("key") or "").lower())]
    if cand:
        w = max(cand, key=lambda w: inter(U(w), R) / (area(U(w)) + area(R) - inter(U(w), R)))
        thing, T = {"kind": "word", "id": w["id"]}, U(w)
    else:
        cp = [p for p in pics if share_in(p["box"], R) >= 0.5 and "knife" not in p["id"].lower()]
        if cp:
            p = max(cp, key=lambda p: inter(p["box"], R) / (area(p["box"]) + area(R) - inter(p["box"], R)))
            thing, T = {"kind": "pic", "id": p["id"]}, list(p["box"])
        else:
            cc = [x for x in cards if share_in(x["box"], R) >= 0.5]
            if cc:
                x = max(cc, key=lambda x: inter(x["box"], R) / (area(x["box"]) + area(R) - inter(x["box"], R)))
                thing, T = {"kind": "card", "id": x["id"]}, list(x["box"])
    own_faces = []
    if T is not None:
        for f in faces:
            fb = f["box"]
            if f.get("kind") == "badge" and share_in(fb, R) >= 0.5 and fb[0] <= T[2] + 6 and fb[2] >= T[0] - 6 and fb[1] <= T[3] + 6 and fb[3] >= T[1] - 6:
                own_faces.append(fb)
                T = union(T, fb)
    if swipe:
        items = [U(w) for w in words if share_in(U(w), R) >= 0.5] or [p["box"] for p in pics if share_in(p["box"], R) >= 0.5 and "knife" not in p["id"].lower() and "board" not in p["id"].lower()]
        if not items:
            fails.append(f"the knife's swipe lights no item: the knife {fmt(knife['box'])} but nothing to cut in {fmt(R)}")
        else:
            path = union(knife["box"], max(items, key=area))
            T = path
            poke = [s for s, bad in (("left", path[0] < R[0] - PAD_TOL), ("top", path[1] < R[1] - PAD_TOL), ("right", path[2] > R[2] + PAD_TOL), ("bottom", path[3] > R[3] + PAD_TOL)) if bad and not at_edge[s[0]]]
            if poke:
                fails.append(f"the knife's swipe light does not hold the knife, the item and the path between them: it is short at the {' and '.join(poke)} ({fmt(path)} in {fmt(R)})")
        out["thing"] = {"kind": "swipe", "knife": knife["box"]}
    elif T is None:
        fails.append(f"it lights nothing: no picture with its pill, no picture and no card is in {fmt(R)}")
    else:
        out["thing"] = dict(thing, box=[round(v) for v in T])
        LIGHT = kit.get("LIGHT") or {"share": 0.12, "min": 8, "max": 16, "clear": 2}
        pad_set = kit.get("BOX_PAD") or 10
        margin = max(LIGHT["min"], min(LIGHT["max"], LIGHT["share"] * min(T[2] - T[0], T[3] - T[1])))
        # (an item card or order card is lit whole as its own frame, a hug: chai's next card, Zafar 30 Oct "just highlight the item card")
        want = 0 if thing["kind"] == "card" else min(pad_set, margin)
        others = [U(w) for w in words if U(w) != union(T, None) and share_in(U(w), T) < 0.5] + [f["box"] for f in faces if f["box"] not in own_faces and share_in(f["box"], T) < 0.5]
        others += [p for p in (o1.get("panels") or [])]

        def room(side):
            g = 1e9
            for q in others:
                if side == "l" and q[2] <= T[0] + 1 and min(q[3], T[3]) > max(q[1], T[1]):
                    g = min(g, T[0] - q[2])
                if side == "r" and q[0] >= T[2] - 1 and min(q[3], T[3]) > max(q[1], T[1]):
                    g = min(g, q[0] - T[2])
                if side == "t" and q[3] <= T[1] + 1 and min(q[2], T[2]) > max(q[0], T[0]):
                    g = min(g, T[1] - q[3])
                if side == "b" and q[1] >= T[3] - 1 and min(q[2], T[2]) > max(q[0], T[0]):
                    g = min(g, q[1] - T[3])
            edge = {"l": T[0], "t": T[1], "r": vw - T[2], "b": vh - T[3]}[side] - 1
            return min(g - LIGHT.get("clear", 2), edge)
        pads = {"l": T[0] - R[0], "t": T[1] - R[1], "r": R[2] - T[2], "b": R[3] - T[3]}
        out["pads"] = {s: round(v) for s, v in pads.items()}
        short, wide = [], []
        hop = 0.12 * (T[3] - T[1]) if thing["kind"] == "word" else 0
        for s, nm in (("l", "left"), ("t", "top"), ("r", "right"), ("b", "bottom")):
            need = max(0.0, min(want, room(s)))
            if pads[s] < need - PAD_TOL:
                short.append(f"{nm} {round(pads[s])} px (wants {round(need)})")
            if pads[s] > LIGHT["max"] + OVER_PAD + (hop if s == "t" else 0):
                wide.append(f"{nm} {round(pads[s])} px")
        if short:
            fails.append(f"{thing['id']} {fmt(T)} (its picture, pill and face) is not inside the light with its pad: {', '.join(short)}")
        if wide:
            fails.append(f"the light frames a region round {thing['id']} {fmt(T)}, not the thing: {', '.join(wide)} of room (the pad is {round(want)})")
    # 3. whole inside the frame unless its thing is at the edge
    near_edge = T
    for s, nm in (("l", "left"), ("t", "top"), ("r", "right"), ("b", "bottom")):
        if not at_edge[s]:
            continue
        tb = near_edge or R
        dist = {"l": tb[0], "t": tb[1], "r": vw - tb[2], "b": vh - tb[3]}[s]
        if near_edge is None or dist > 20:
            fails.append(f"cut by the frame at the {nm}: its thing is {round(dist)} px from that edge")
    # 5. the side panel and the faces
    for p in o1.get("panels") or []:
        if p[2] - p[0] > 0.5 * vw:
            continue
        lit_card = thing is not None and thing["kind"] == "card" and T is not None and inter(T, p) > 0.5 * area(T)
        over = min(R[2], p[2]) - max(R[0], p[0])
        if not lit_card and over > PANEL_TOL and min(R[3], p[3]) > max(R[1], p[1]):
            fails.append(f"over the side panel by {round(over)} px (the light {fmt(R)}, the panel {fmt(p)})")
            break
    for f in faces:
        fb = f["box"]
        if fb in own_faces:
            continue
        if share_in(fb, R) >= FACE_IN and not (T is not None and share_in(fb, T) > 0.5):
            fails.append(f"over a face it is not lighting: {f.get('id') or f.get('kind')} {fmt(fb)}")
            break
    # 7. nothing moving into it: a thing in the light (a word thing, the knife, a picture of a fair size; not a surface) that, when
    # the light came (objs0), was elsewhere or not there yet; and, while the light still stood MOVE_MS in (objs2), one that moved on
    def things_of(o):
        if not o:
            return []
        lst = [{"key": w.get("key") or w["id"], "id": w["id"], "box": w["pic"]} for w in (o.get("words") or [])]
        lst += [{"key": p["id"], "id": p["id"], "box": p["box"]} for p in (o.get("pics") or []) if not any(x in p["id"].lower() for x in SURFACE) and "tray" not in p["id"].lower() and "board" not in p["id"].lower()]
        return lst

    def moved(x, src):
        same = [y for y in src if y["key"] == x["key"] or y["id"] == x["id"]]
        m = mid(x["box"])
        size = max(x["box"][2] - x["box"][0], x["box"][3] - x["box"][1])
        if not same:
            return "came into it after the light came"
        near = min(((mid(y["box"])[0] - m[0]) ** 2 + (mid(y["box"])[1] - m[1]) ** 2) ** 0.5 for y in same)
        return f"moved {round(near)} px into it after the light came" if near > max(MOVE_PX, 0.3 * size) else None
    big = 0.12 * area(R)
    inR = [x for x in things_of(o1) if share_in(x["box"], R) >= 0.6 and (x["id"] != x["key"] or "knife" in x["key"].lower() or area(x["box"]) >= big) and area(x["box"]) < 0.8 * area(R)]
    if not swipe:
        inR = [x for x in inR if "knife" not in x["key"].lower()] if T is None else inR
    for x in inR:
        why = moved(x, things_of(o0))
        if not why and meta.get("still") and o2:
            later = [y for y in things_of(o2) if y["key"] == x["key"] or y["id"] == x["id"]]
            if later:
                m = mid(x["box"])
                dd = min(((mid(y["box"])[0] - m[0]) ** 2 + (mid(y["box"])[1] - m[1]) ** 2) ** 0.5 for y in later)
                size = max(x["box"][2] - x["box"][0], x["box"][3] - x["box"][1])
                if dd > max(MOVE_PX, 0.3 * size):
                    why = f"was still moving inside it {round(dd)} px while it stood"
        if why:
            fails.append(f"lit while {x['id']} {why}: nothing moves into a light")
            break
    out.update(ok=not fails, fails=fails)
    return out, meta, (B, W)


def mark(d, out, imgs):
    _, W = imgs
    im = W.convert("RGB")
    k = im.width / float(((json.load(open(os.path.join(d, "light.json"))).get("objs1") or {}).get("vw")) or im.width)
    dr = ImageDraw.Draw(im)
    if out.get("region"):
        dr.rectangle([v * k for v in out["region"]], outline=(220, 30, 30), width=3)
    th = out.get("thing") or {}
    if th.get("box"):
        dr.rectangle([v * k for v in th["box"]], outline=(30, 90, 230), width=2)
    y = 4
    for f in out.get("fails", [])[:5]:
        dr.rectangle([0, y, im.width, y + 16], fill=(255, 255, 255))
        dr.text((6, y + 2), f[:180], fill=(180, 20, 20))
        y += 18
    im.save(os.path.join(d, "mark.jpg"), quality=82)


def main(dirs):
    for d in dirs:
        try:
            out, meta, imgs = judge(d)
        except Exception as e:  # a light that cannot be read is said so, never passed
            out, imgs = {"dir": d, "ok": False, "fails": [f"could not be judged: {e}"], "error": True}, None
        if not out.get("ok") and imgs is not None:
            mark(d, out, imgs)
        json.dump(out, open(os.path.join(d, "verdict.json"), "w"))
        print(json.dumps(out))


if __name__ == "__main__":
    main(sys.argv[1:])
