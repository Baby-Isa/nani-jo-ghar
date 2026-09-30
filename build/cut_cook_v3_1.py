#!/usr/bin/env python3
"""Cut the Cook v3.1 redos (R1-R8) and the clinic v2 items (CI1-CI5) into sprites (30 Sept).

    python3 build/cut_cook_v3_1.py               # everything
    python3 build/cut_cook_v3_1.py --only daar   # one group: hob, daar, sekelo, clinic

The sheets are docs/chatgpt-art-prompts-overnight-2026-09-30.md's, uploaded under their "save as" names
(sources/art/cook-v3-1/, sources/art/clinic-v2/items/). The method is build/cut_cook_v3.py's (cut_tick_v2,
docs/VISUAL-QA.md §2), whose functions this reuses: colour-to-alpha edges, flat grey inside loops made
transparent (and checked), ChatGPT's drawn shadows removed, one registered canvas per object shown in
several states. New files sit next to the v3 ones (assets/cook/items/v3/<group>/), with a -v2 suffix where
they replace one; the clinic items go to assets/clinic/items-v2/.

Registration:
  - R4's five pots are scaled and placed onto D1's pot canvas (430 x 348), their fitted rim on D1's rim, so
    they swap with pot-seeds / pot-onion / ... in place;
  - R6's five plates share one canvas, registered on the plate's fitted rim;
  - R2's two knobs share one square canvas centred on the knob's round body (as H6's);
  - CI4's plasters and CI5's three jugs share one canvas each (the plaster's box centre; the jug's
    bottom-centre).
Every meta.json value is measured from the cut art; build/check_vessel_meta.py re-measures the round ones.
"""
import argparse
import json
import math
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cut_cook_v3 as V  # noqa: E402

ROOT = V.ROOT
SRC = os.path.join(ROOT, "sources", "art", "cook-v3-1")
CLINIC_SRC = os.path.join(ROOT, "sources", "art", "clinic-v2", "items")
OUT = V.OUT
CLINIC_OUT = os.path.join(ROOT, "assets", "clinic", "items-v2")


def load(name, src=SRC):
    return np.asarray(Image.open(os.path.join(src, name)).convert("RGB")).astype(float)


class Group(V.Group):
    """cut_cook_v3's Group, but merging into an existing meta.json (the v3 files stay)."""

    def __init__(self, name, folder=None):
        super().__init__(name)
        if folder:
            self.dir = folder
        mp = os.path.join(self.dir, "meta.json")
        self.meta = json.load(open(mp)) if os.path.exists(mp) else {}

    def done(self):
        os.makedirs(self.dir, exist_ok=True)
        with open(os.path.join(self.dir, "meta.json"), "w") as f:
            json.dump(self.meta, f, indent=1)


def rgba(path):
    return np.asarray(Image.open(path).convert("RGBA")).astype(float)


def scale_img(img, k):
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGBA")
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    return np.asarray(im).astype(float)


def place_on(img, anchor, canvas_wh, canvas_anchor):
    """Put img on a (W, H) canvas so its anchor (px) lands on canvas_anchor (px)."""
    W, H = canvas_wh
    cv = np.zeros((H, W, 4))
    ox, oy = int(round(canvas_anchor[0] - anchor[0])), int(round(canvas_anchor[1] - anchor[1]))
    h, w = img.shape[:2]
    sx0, sy0 = max(0, -ox), max(0, -oy)
    dx0, dy0 = max(0, ox), max(0, oy)
    ww, hh = min(w - sx0, W - dx0), min(h - sy0, H - dy0)
    cv[dy0:dy0 + hh, dx0:dx0 + ww] = img[sy0:sy0 + hh, sx0:sx0 + ww]
    clipped = (sx0 > 0 or sy0 > 0 or sx0 + ww < w or sy0 + hh < h) and (img[..., 3] > 8).sum() > (cv[..., 3] > 8).sum() + 50
    return cv, clipped


def uniform(cuts):
    """The same canvas for every cut, each centred on its bounding box (the sheet's own scale kept)."""
    W = max(c.shape[1] for c in cuts)
    H = max(c.shape[0] for c in cuts)
    out = []
    for c in cuts:
        cv = np.zeros((H, W, 4))
        oy, ox = (H - c.shape[0]) // 2, (W - c.shape[1]) // 2
        cv[oy:oy + c.shape[0], ox:ox + c.shape[1]] = c
        out.append(cv)
    return out


def inscribed(mask):
    """The biggest circle inside a mask (the ladle's round bowl: the handle is narrower): centre, radius px."""
    dt = ndi.distance_transform_edt(mask)
    cy, cx = np.unravel_index(np.argmax(dt), dt.shape)
    return float(cx), float(cy), float(dt[cy, cx])


# ---------------------------------------------------------------- R1, R2: the hob and the knob

def hob_group():
    G = Group("hob")
    a = load("r1-hob-4-v2.png")
    bg = V.measure_bg(a)
    c = V.tight(V.cut(a, bg), 6)
    caps = V.gold_caps(c)
    assert len(caps) == 4, len(caps)
    # the same scale rule as v3's hobs: the brass caps match the old hob's (HOB_CAP_R), so a station's hob
    # scale k keeps its burner size; R1's hob is narrower for the same burners (they're a fifth of it now)
    k = V.HOB_CAP_R / np.mean([r for _, _, r in caps])
    c = scale_img(c, k)
    caps = V.gold_caps(c)
    H, W = c.shape[:2]
    lum = c[..., :3].mean(2)
    cx0, cy0, cr = caps[0]
    sup, ring = V.support_radius(c, cx0, cy0, cr)
    colv = lum[:, W // 2] * (c[:, W // 2, 3] > 128)
    silver = np.nonzero(colv > 130)[0]
    glass_top = silver[silver < H * 0.15].max() + 1
    glass_bottom = silver[silver > H * 0.85].min() - 1
    below = max(cy0 + ring, cy0 + sup * 0.72)
    front_y = (below + glass_bottom) / 2
    meta = {
        "n": 4,
        "burners": [{"x": round(x / W, 4), "y": round(y / H, 4)} for x, y, _ in caps],
        "cap_r": round(np.mean([r for _, _, r in caps]) / W, 4),
        "support_r": round(sup / W, 4),
        "glass": {"top": round(glass_top / H, 4), "bottom": round(glass_bottom / H, 4)},
        "frontY": round(front_y / H, 4),
        "scale_from_sheet": round(k, 4),
        "note": "R1: four burners at H1's burner size (replaces hob-4)",
    }
    G.put("hob-4-v2", c, bg, "r1-hob-4-v2.png", meta)
    # R2: the knobs, one square canvas each, centred on the round body; the glow is wide, so more room
    a = load("r2-knob-off-on-v2.png")
    bg = V.measure_bg(a)
    H, W = a.shape[:2]
    offc = V.cut(a[:, : W // 2], bg)
    on_glow = V.cut_glow(a[:, W // 2:], bg)
    placed = []
    for img in (offc, on_glow):
        m = img[..., 3] > 200
        cx, cy, r, _ = V.robust_circle(m)
        placed.append((img, (cx, cy), r))
    rr = max(r for _, _, r in placed)
    # how far the "on" glow reaches (alpha over 3%), so the square keeps all of it
    ga = on_glow[..., 3] > 8
    ys, xs = np.nonzero(ga)
    gcx, gcy = placed[1][1]
    reach = float(np.percentile(np.hypot(xs - gcx, ys - gcy), 99.5))
    half = int(math.ceil(min(reach + 6, min(gcx, W // 2 - gcx, gcy, H - gcy))))
    outs = []
    yy, xx = np.mgrid[0:2 * half, 0:2 * half]
    dist = np.hypot(xx - half + 0.5, yy - half + 0.5)
    for i, (img, (cx, cy), r) in enumerate(placed):
        cv, _ = place_on(img, (cx, cy), (2 * half, 2 * half), (half, half))
        if i == 0:
            # the off knob: nothing past its own rim (the on cell's glow reaches over the sheet's middle)
            cv[..., 3] *= np.clip((r * 1.08 - dist) / 3, 0, 1)
        else:
            # the glow fades to nothing before the canvas edge (never squared off)
            cv[..., 3] *= np.clip((half - 2 - dist) / (half * 0.25), 0, 1)
        outs.append(cv)
    for fname, img in zip(("knob-off-v2", "knob-on-v2"), outs):
        m, _ = V.circle_meta(img)
        m["note"] = "R2: grip bar horizontal = off; on: the same knob, bar vertical, a strong warm glow (the kit turns it a quarter)"
        G.put(fname, img, bg, "r2-knob-off-on-v2.png", m, max_side=400)
    G.done()
    return G


# ---------------------------------------------------------------- R3, R4, R5, R8: daar

def daar_group():
    G = Group("daar")
    d1 = G.meta["pot-empty"]
    PW, PH = d1["w"], d1["h"]
    pot_anchor = (d1["anchor"][0] * PW, d1["anchor"][1] * PH)
    pot_r = d1["r"] * PW
    # R4: cells 1-5 onto D1's pot canvas (scaled so the fitted rims match), cell 6 the plain trivet bowl
    a = load("r4-daar-pot-more-v1.png")
    bg = V.measure_bg(a)
    # equal cells, inset clear of the thin light lines ChatGPT drew between them (grid_boxes read those
    # lines as objects and put the row line at y 204, cutting the top pots in half)
    H, W = a.shape[:2]
    boxes = [(x0 + 8 * (x0 > 0), y0 + 8 * (y0 > 0), x1 - 8 * (x1 < W), y1 - 8 * (y1 < H)) for x0, y0, x1, y1 in V.cells(a, 3, 2)]
    names = ["pot-tomato-only", "pot-chilli-only", "pot-onion-chilli", "pot-tomato-chilli", "pot-tadka-v2"]
    what = ["seeds + tomato (no onion)", "seeds + green chilli (no onion)", "seeds + onion + chilli (no tomato)",
            "seeds + tomato + chilli (no onion)", "cooked daar, a tadka of mustard and cumin only (no dry chilli, no curry leaves)"]
    for name, b, w in zip(names, boxes, what):
        x0, y0, x1, y1 = b
        c = V.cut(a[y0:y1, x0:x1], bg)
        cx, cy, r, _ = V.robust_circle(c[..., 3] > 128)
        k = pot_r / r
        cs = scale_img(c, k)
        cv, clipped = place_on(cs, (cx * k, cy * k), (PW, PH), pot_anchor)
        m, _ = V.circle_meta(cv)
        m.update({"registered": "rim (D1's pot canvas)", "set": "pot", "anchor": d1["anchor"], "scale_from_sheet": round(k, 4), "what": w})
        if clipped:
            m["clipped"] = True
        G.put(name, cv, bg, "r4-daar-pot-more-v1.png", m)
    # cell 6: the trivet crosses the row line (its top is above y 512), so its box starts under the pot
    # above it; the thin separator line that touches it is opened away (anything under 8 px thick)
    x0, y0, x1, y1 = boxes[5][0], 430, W, H
    c = V.cut(a[y0:y1, x0:x1], bg)
    solid = ndi.binary_opening(c[..., 3] > 40, iterations=4)
    lab, n = ndi.label(solid)
    keep = ndi.binary_dilation(lab == (np.argmax(np.bincount(lab.ravel())[1:]) + 1), iterations=3)
    c[..., 3] *= keep
    c = V.tight(c, 16)
    m, _ = V.circle_meta(c)
    m["what"] = "the trivet bowl of plain daar (no tadka): the bowl waiting to be poured"
    G.put("daar-bowl-trivet-plain", c, bg, "r4-daar-pot-more-v1.png", m)

    # R3: the ladle, a deep steel dipper, three-quarter on; its bowl's round rim measured (the handle dropped)
    a = load("r3-ladle-v2.png")
    bg = V.measure_bg(a)
    c = V.tight(V.cut(a, bg), 12)
    cx, cy, r = inscribed(c[..., 3] > 128)
    H, W = c.shape[:2]
    G.put("ladle-v2", c, bg, "r3-ladle-v2.png", {"bowl_cx": round(cx / W, 4), "bowl_cy": round(cy / H, 4), "bowl_r": round(r / W, 4), "bowl_fit": "inscribed",
                                                "note": "R3: a deep steel dipper seen three-quarter on (not the foreshortened ladle asked for)"})

    # R5: three chopped heaps (one canvas) and three single pieces (one canvas), the sheet's own scale
    a = load("r5-chopped-veg-v1.png")
    bg = V.measure_bg(a)
    boxes = V.grid_boxes(a, bg, 3, 2)
    heaps = [V.tight(V.cut(a[y0:y1, x0:x1], bg, keep="all", min_area=400), 12) for x0, y0, x1, y1 in boxes[:3]]
    ones = [V.tight(V.cut(a[y0:y1, x0:x1], bg), 12) for x0, y0, x1, y1 in boxes[3:]]
    for name, img in zip(["chop-heap-onion", "chop-heap-tomato", "chop-heap-chilli"], uniform(heaps)):
        G.put(name, img, bg, "r5-chopped-veg-v1.png", {"what": "a loose heap of chopped " + name.split("-")[-1]})
    for name, img in zip(["chop-piece-onion", "chop-piece-tomato", "chop-piece-chilli"], uniform(ones)):
        G.put(name, img, bg, "r5-chopped-veg-v1.png", {"what": "one piece, the heaps' scale"})

    # R8: the dial's four flat icons, recoloured to one flat cream with a soft alpha (ChatGPT drew thin
    # light lines between the cells: each icon is cut inside its own cell, clear of them)
    a = load("r8-dial-icons-v1.png")
    bg = V.measure_bg(a)
    H, W = a.shape[:2]
    lum = a.mean(2)
    colbright = (lum > bg.mean() + 40).mean(0)
    lines = [x for x in range(20, W - 20) if colbright[x] > 0.8]
    groups = []
    for x in lines:
        if groups and x - groups[-1][-1] <= 2:
            groups[-1].append(x)
        else:
            groups.append([x])
    cuts = [0] + [int(np.mean(g)) for g in groups] + [W]
    assert len(cuts) == 5, cuts
    cream = np.array([0xF5, 0xE6, 0xC8], float)
    icons = []
    for i in range(4):
        x0, x1 = cuts[i] + 8, cuts[i + 1] - 8
        cell = a[:, x0:x1]
        l = cell.mean(2)
        alpha = np.clip((l - bg.mean() - 6) / (cream.mean() - bg.mean() - 12), 0, 1)
        img = np.dstack([np.broadcast_to(cream, cell.shape).copy(), alpha * 255])
        icons.append(V.tight(img, 8))
    for name, img in zip(["dial-stopped", "dial-slow", "dial-fast", "dial-spill"], uniform(icons)):
        G.put(name, img, bg, "r8-dial-icons-v1.png", {"what": "flat cream icon (R8)", "colour": "#F5E6C8"}, max_side=360)
    G.done()
    return G


# ---------------------------------------------------------------- R6, R7: sekelo

def sekelo_group():
    G = Group("sekelo")
    a = load("r6-plate-0-4-v2.png")
    bg = V.measure_bg(a)
    boxes = V.grid_boxes(a, bg, 3, 2)
    items = []
    for n, b in enumerate(boxes[:5]):
        x0, y0, x1, y1 = b
        c = V.cut(a[y0:y1, x0:x1], bg, keep="all", min_area=2000)
        cx, cy, r, _ = V.robust_circle(c[..., 3] > 128)
        items.append((f"plate-{n}-v2", c, (cx, cy), r))
    placed, (ax, ay) = V.registered([(c, anc) for _, c, anc, _ in items], "rim")
    for (name, _, _, r), img in zip(items, placed):
        H, W = img.shape[:2]
        m, _ = V.circle_meta(img)
        m.update({"registered": "rim", "set": "plate-v2", "anchor": [round(ax / W, 4), round(ay / H, 4)],
                  "note": "R6: the skewers fanned wider; plate-0-v2 is a clean empty plate (replaces the patched plate-0)"})
        G.put(name, img, bg, "r6-plate-0-4-v2.png", m)

    # R7: the potato and the charred vegetables, on K4's uniform piece canvas (404 x 396); the potato heap on K5's
    a = load("r7-potato-charred-v1.png")
    bg = V.measure_bg(a)
    boxes = V.grid_boxes(a, bg, 3, 3)
    names = ["potato-raw", "potato-grilled", "potato-charred", "onion-charred", "tomato-charred", "pepper-charred"]
    k4 = G.meta["meat-raw"]
    cuts = [V.tight(V.cut(a[y0:y1, x0:x1], bg), 16) for x0, y0, x1, y1 in boxes[:6]]
    # the pieces are fitted by their alpha box in code (grill.js pieceTex), so only the canvas is matched
    CW, CH = max(k4["w"], max(c.shape[1] for c in cuts)), max(k4["h"], max(c.shape[0] for c in cuts))
    for name, c in zip(names, cuts):
        cv, _ = place_on(c, (c.shape[1] / 2, c.shape[0] / 2), (CW, CH), (CW / 2, CH / 2))
        G.put(name, cv, bg, "r7-potato-charred-v1.png", {"what": "R7: " + name.replace("-", ", ")})
    x0, y0, x1, y1 = boxes[6]
    heap = V.tight(V.cut(a[y0:y1, x0:x1], bg, keep="all", min_area=1500), 16)
    k5 = G.meta["heap-meat"]
    cv, _ = place_on(heap, (heap.shape[1] / 2, heap.shape[0] / 2), (max(k5["w"], heap.shape[1]), max(k5["h"], heap.shape[0])),
                     (max(k5["w"], heap.shape[1]) / 2, max(k5["h"], heap.shape[0]) / 2))
    G.put("heap-potato", cv, bg, "r7-potato-charred-v1.png", {"what": "R7: a loose heap of raw potato chunks (the decoy's shelf heap)"})
    G.done()
    return G


# ---------------------------------------------------------------- CI1-CI5: the clinic's items

def clinic_group():
    G = Group("clinic-items-v2", CLINIC_OUT)
    G.meta = {}

    def sheet(fname, cols, rows, names, glass=(), note=None):
        a = load(fname, CLINIC_SRC)
        bg = V.measure_bg(a)
        boxes = V.grid_boxes(a, bg, cols, rows)
        for i, (name, b) in enumerate(zip(names, boxes)):
            if not name:
                continue
            x0, y0, x1, y1 = b
            # one piece (the pen torch's drawn light spot on the counter goes); the stethoscope's parts all stay
            c = V.cut(a[y0:y1, x0:x1], bg, glass=i in glass, keep="all" if name == "stethoscope" else "largest", min_area=1500)
            c = V.tight(c, 12)
            m = {"what": name.replace("-", " ")}
            if note and name in note:
                m.update(note[name])
            G.put(name, c, bg, fname, m, max_side=512)

    sheet("ci1-care-kit-v1.png", 3, 3, ["plasters-box", "bandage-roll", "tweezers", "cotton-buds", "eye-drops", "thermometer", "toothbrush", "filling-paste", "dentist-drill"],
          glass=(3, 4, 5))
    sheet("ci2-tools-comfort-v1.png", 3, 3, ["reflex-hammer", "stethoscope", "pen-torch", "syringe", "water-jug", "cloth-blue", "blanket-red", "desk-fan", "apple"],
          glass=(3,))
    sheet("ci3-drinks-v1.png", 3, 3, ["tumbler", "teaspoon", "honey-jar", "ginger", "lemon-half", "turmeric-bowl", "milk-jug", "turmeric-milk", "ginger-water"],
          glass=(2, 6, 7, 8))
    # CI4: eleven plasters, the same size and shape: one canvas, each centred on its box
    a = load("ci4-plasters-v1.png", CLINIC_SRC)
    bg = V.measure_bg(a)
    boxes = V.grid_boxes(a, bg, 4, 3)
    names = ["plaster-red", "plaster-yellow", "plaster-blue", "plaster-green", "plaster-red-yellow", "plaster-red-blue", "plaster-red-green",
             "plaster-yellow-blue", "plaster-yellow-green", "plaster-blue-green", "plaster-skin"]
    cuts = [V.tight(V.cut(a[y0:y1, x0:x1], bg), 12) for x0, y0, x1, y1 in boxes[:11]]
    for name, img in zip(names, uniform(cuts)):
        ys, xs = np.nonzero(img[..., 3] > 128)
        G.put(name, img, bg, "ci4-plasters-v1.png", {"what": name.replace("-", " "), "box_w_px": int(np.ptp(xs) + 1), "box_h_px": int(np.ptp(ys) + 1)})
    # CI5: the jug three times (one canvas, registered on its bottom-centre); the hot one's steam kept soft
    a = load("ci5-foot-soak-v1.png", CLINIC_SRC)
    bg = V.measure_bg(a)
    boxes = V.grid_boxes(a, bg, 2, 2)
    jugs = []
    ref_top = None
    for i, name in enumerate(["jug-hot", "jug-cold", "jug-lukewarm"]):
        x0, y0, x1, y1 = boxes[i]
        cell = a[y0:y1, x0:x1]
        c = V.cut(cell, bg, keep="all", min_area=1500)
        solid = c[..., 3] > 128
        ys, xs = np.nonzero(solid)
        if name == "jug-hot":
            # the steam: everything above the jug's rim goes colour-to-alpha (never a solid grey-white cloud)
            rows = solid.sum(1)
            wide = np.nonzero(rows > 0.45 * rows.max())[0]
            rim = int(wide.min())
            d = np.abs(cell - bg).max(2)
            up = np.where(cell > bg, (cell - bg) / np.maximum(255 - bg, 1), (bg - cell) / np.maximum(bg, 1))
            c2a = np.clip((up.max(2) - 0.02) / 0.98, 0, 1)
            above = np.zeros_like(solid)
            above[: max(0, rim - 6)] = True
            alpha = np.where(above, c2a, c[..., 3] / 255)
            safe = np.maximum(alpha, 1e-3)[..., None]
            rgb = np.where(above[..., None], np.clip((cell - bg) / safe + bg, 0, 255), c[..., :3])
            c = np.dstack([rgb, alpha * 255])
        bx0, by0, bx1, by1 = V.bbox(c, 128)
        jugs.append((name, c, ((bx0 + bx1) / 2, by1)))
    placed, (ax, ay) = V.registered([(c, anc) for _, c, anc in jugs], "bottom")
    for (name, _, _), img in zip(jugs, placed):
        H, W = img.shape[:2]
        G.put(name, img, bg, "ci5-foot-soak-v1.png", {"what": name.replace("-", " "), "registered": "bottom-centre", "anchor": [round(ax / W, 4), round(ay / H, 4)]}, max_side=512)
    x0, y0, x1, y1 = boxes[3]
    c = V.tight(V.cut(a[y0:y1, x0:x1], bg), 12)
    m, _ = V.circle_meta(c)
    m["what"] = "a round steel basin of clear water, top-down (the foot soak)"
    G.put("basin", c, bg, "ci5-foot-soak-v1.png", m, max_side=512)
    G.done()
    return G


GROUPS = {"hob": hob_group, "daar": daar_group, "sekelo": sekelo_group, "clinic": clinic_group}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    args = ap.parse_args()
    only = set(filter(None, args.only.split(",")))
    for name, fn in GROUPS.items():
        if only and name not in only:
            continue
        print(name)
        fn()


if __name__ == "__main__":
    main()
