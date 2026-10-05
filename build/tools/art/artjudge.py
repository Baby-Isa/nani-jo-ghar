#!/usr/bin/env python3
"""First-pass art judge: numbers before any model looks (art-pipeline.md "Art tools"; plan section 7).

  python3 build/tools/art/artjudge.py                       # every image in the pack's source folder
  python3 build/tools/art/artjudge.py --only girl-M1,girl-W10 --dir sources/art/clinic-heal-v3
  python3 build/tools/art/artjudge.py --json out.json -v    # machine-readable result; -v prints the measurements

Each image is matched to its run line by file name (the spec's `save`), then measured against that line's check
profile (spec: checks.<ID>.judge). Per image it prints PASS, FLAG (look at it: the reason is named) or FAIL (a hard
rule: wrong canvas, text, skin ΔE > 12, an edit identical to its original, wrong piece count).
Measured: canvas size and aspect; the flat #808080 ground (and shadows or gradients on it); framing (which edges the
subject touches against which it should, margins, height fill); skin colour ΔE against the approved render; edits (how
much changed, how much outside the allowed region after registration, identical to the original); "like" images (W9/W10
against W1: size and feet line); glyph-like marks on the ground (text); near-duplicate images; round glossy discs that
may read as sweets. NOT measured (a model must look): gaze, anatomy, fingers, likeness, modesty beyond a missing-sleeve
hint, style. A PASS here is never a pass of the art, only that the numbers are fine."""
import argparse
import functools
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import artlib as L  # noqa: E402
import artspec as S  # noqa: E402

REPO = S.REPO
SKIN_RENDER = np.array([0xF3, 0x98, 0x61], float)  # the lit skin of the approved family renders (Ali, Ma), as in the cutter
EDGES = ("left", "right", "top", "bottom")


class Result:
    def __init__(self, line, path):
        self.line, self.path = line, path
        self.fail, self.flag, self.info = [], [], {}

    @property
    def level(self):
        return "FAIL" if self.fail else "FLAG" if self.flag else "PASS"


@functools.lru_cache(maxsize=4)  # a few at a time: each is ~100 MB of float arrays
def keyed(path):
    a = L.load(path)
    return (a,) + L.key(a)


def touches(obj):
    h, w = obj.shape
    return {e: bool(obj[L.EDGE_SLICES[e](h, w)].any()) for e in EDGES}


def ground(a, obj):
    """The flat ground: its colour (median of the edge pixels that are grey) and its spread outside the object."""
    far = ~ndi.binary_dilation(obj, iterations=18)
    px = a[far]
    if len(px) < 500:
        return None, None
    return np.median(px, 0), float(np.abs(px - np.median(px, 0)).max(1).mean())


def glyph_marks(a, obj, bgc):
    """Glyph-like blobs on the flat ground, away from the subject: rows of small marks (text, labels, numbers)."""
    far = ~ndi.binary_dilation(obj, iterations=20)
    d = (np.abs(a - bgc).max(2) > 28) & far
    d = ndi.binary_opening(d, iterations=1)
    lab, n = ndi.label(d)
    if n == 0:
        return 0
    objs = ndi.find_objects(lab)
    boxes = []
    for i, sl in enumerate(objs):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if 5 <= h <= 70 and 2 <= w <= 90 and 0.15 < w / h < 4:
            boxes.append((sl[0].start, sl[0].stop, sl[1].start, sl[1].stop))
    best = 0
    for b in boxes:  # marks of similar height on one baseline
        row = [c for c in boxes if abs((c[1] + c[0]) / 2 - (b[1] + b[0]) / 2) < 0.6 * (b[1] - b[0]) and 0.5 < (c[1] - c[0]) / (b[1] - b[0]) < 2]
        best = max(best, len(row))
    return best


def hash64(a):
    g = cv2.resize(cv2.cvtColor(a.astype(np.uint8), cv2.COLOR_RGB2GRAY), (9, 8), interpolation=cv2.INTER_AREA).astype(int)
    return (g[:, 1:] > g[:, :-1]).flatten()


def register(mov, ref):
    """Half-resolution ECC translation of mov onto ref: returns the warped mov at full size."""
    h, w = ref.shape[:2]
    g = lambda x: cv2.GaussianBlur(cv2.cvtColor(cv2.resize(x.astype(np.uint8), (w // 2, h // 2)), cv2.COLOR_RGB2GRAY), (5, 5), 0).astype(np.float32) / 255
    M = np.eye(2, 3, dtype=np.float32)
    try:
        _, M = cv2.findTransformECC(g(ref), g(mov), M, cv2.MOTION_TRANSLATION, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 100, 1e-5), None, 5)
    except cv2.error:
        pass
    M[:, 2] *= 2
    return cv2.warpAffine(mov.astype(np.float32), M, (w, h), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE).astype(float), M


def sweets_risk(a, obj, k):
    """Round, saturated discs with a specular highlight: what a sweet, gumball or jelly bean looks like."""
    lb, n = ndi.label(ndi.binary_dilation(obj, iterations=4))
    hsv = cv2.cvtColor(a.astype(np.uint8), cv2.COLOR_RGB2HSV)
    hits = 0
    for i in range(1, n + 1):
        m = lb == i
        area = m.sum()
        if area < 1500:
            continue
        cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        c = max(cs, key=cv2.contourArea)
        per = cv2.arcLength(c, True)
        circ = 4 * np.pi * cv2.contourArea(c) / max(1, per * per)
        sat = hsv[..., 1][m].mean()
        hi = ((hsv[..., 2] > 235) & (hsv[..., 1] < 70) & m)
        hl, hn = ndi.label(hi)
        spec = max([int((hl == j).sum()) for j in range(1, hn + 1)] or [0])
        if circ > 0.8 and sat > 110 and spec > 0.004 * area:
            hits += 1
    return hits


def judge_one(spec, r, ctx):
    line, path = r.line, r.path
    prof = spec["checks"][line["check"]].get("judge", {})
    a, k, obj = keyed(path)
    H, W = a.shape[:2]
    r.info["size"] = [W, H]
    # 1 canvas
    if max(W, H) < 1024:
        r.fail.append("canvas %dx%d: under 1024 px on the long side (a thumbnail?)" % (W, H))
    if "aspect" in prof:
        want = prof["aspect"][0] / prof["aspect"][1]
        if abs(W / H - want) / want > 0.04:
            r.fail.append("aspect %.2f, the check wants %d:%d" % (W / H, prof["aspect"][0], prof["aspect"][1]))
    if prof.get("bg") == "flat":
        gc, spread = ground(a, obj)
        if gc is not None:
            r.info["ground"] = "#%02X%02X%02X, spread %.1f" % (int(gc[0]), int(gc[1]), int(gc[2]), spread)
            if np.abs(gc - 128).max() > 16 or (gc.max() - gc.min()) > 14:
                r.flag.append("ground is %s, not flat #808080" % r.info["ground"])
            elif spread > 5:
                r.flag.append("the ground is not flat (spread %.1f: a shadow, gradient or marks)" % spread)
            # 2 edge quality: how much the mask moves between a tight and a loose key (a soft or shadowed edge)
            loose = L.key(a, tol=24)[1]
            move = abs(int(loose.sum()) - int(obj.sum())) / max(1, obj.sum())
            r.info["edge_move"] = round(move, 4)
            if move > 0.03 and not prof.get("soft_edges"):  # glass, drops and dust are soft by design
                r.flag.append("edge not crisp: the cut moves %.1f%% with the key tolerance (blur, halo or a shadow)" % (move * 100))
            # text on the ground
            g = glyph_marks(a, obj, gc)
            r.info["glyph_row"] = g
            if g >= 4:
                r.fail.append("text-like marks on the ground (%d glyph-sized blobs in a row)" % g)
            elif g == 3:
                r.flag.append("3 glyph-sized marks in a row on the ground: text?")
    # 3 framing
    t = touches(obj)
    r.info["touch"] = [e for e in EDGES if t[e]]
    ys, xs = np.nonzero(obj)
    bw, bh = (xs.max() - xs.min() + 1), (ys.max() - ys.min() + 1)
    r.info["bbox"] = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
    if prof.get("bg") == "flat":
        exits = prof.get("exits", [])
        for e in exits:
            if not t[e]:
                r.flag.append("framing: the subject does not reach the %s edge (check says it runs off there): framed too wide" % e)
        for e in EDGES:
            if e not in exits and e not in prof.get("allow_touch", []) and t[e] and (prof.get("no_touch") or exits):
                r.flag.append("framing: the subject touches the %s edge" % e)
        if not exits:
            m = min(xs.min() / W, ys.min() / H, (W - xs.max() - 1) / W, (H - ys.max() - 1) / H)
            r.info["margin"] = round(float(m), 3)
            if m < 0.015 and not any(t.values()):
                r.flag.append("tight margin %.1f%% to the nearest edge" % (m * 100))
        if "fill_h" in prof:
            f = bh / H
            r.info["fill_h"] = round(float(f), 3)
            if not prof["fill_h"][0] <= f <= prof["fill_h"][1]:
                r.flag.append("the subject fills %.0f%% of the height (the check wants %.0f-%.0f%%)" % (f * 100, prof["fill_h"][0] * 100, prof["fill_h"][1] * 100))
        if prof.get("side_hair"):  # a face close-up should run off the sides as cheeks, not show hair, plaits or ears
            hsv = cv2.cvtColor(a.astype(np.uint8), cv2.COLOR_RGB2HSV)
            dark = (hsv[..., 2] < 85) & obj
            sh = float(np.concatenate([dark[:, :int(W * .1)].ravel(), dark[:, -int(W * .1):].ravel()]).mean())
            r.info["hair_at_sides"] = round(sh, 3)
            if sh > prof["side_hair"]:
                r.flag.append("hair or plaits fill %.0f%% of the side margins (over %.0f%%): framed too wide, ears and plaits in shot" % (sh * 100, prof["side_hair"] * 100))
        if prof.get("pieces"):
            lb, n = ndi.label(ndi.binary_dilation(obj, iterations=6))
            n = int(sum(1 for i in range(1, n + 1) if (lb == i).sum() >= 1500))
            r.info["pieces"] = n
            if n != prof["pieces"]:
                r.fail.append("%d separate pieces, expected %d (touching, missing or extra)" % (n, prof["pieces"]))
        if prof.get("pieces_min"):
            lb, n = ndi.label(ndi.binary_dilation(obj, iterations=6))
            n = int(sum(1 for i in range(1, n + 1) if (lb == i).sum() >= 1500))
            r.info["pieces"] = n
            if n < prof["pieces_min"]:
                r.fail.append("%d separate pieces, expected at least %d (panels touching or missing)" % (n, prof["pieces_min"]))
    # 4 skin
    box = prof.get("skin_face")
    if box or prof.get("skin_obj"):
        # skin_face is in fractions of the subject's own box (a small old woman's face is higher than a tall boy's)
        bx = (int(xs.min() + bw * box[0]), int(ys.min() + bh * box[1]), int(xs.min() + bw * box[2]), int(ys.min() + bh * box[3])) if box else (0, 0, W, H)
        m = L.skin_median(a, k[..., 3], bx, smin=105)
        if m is not None:
            de = L.delta_e(m, SKIN_RENDER)
            r.info["skin"] = "#%02X%02X%02X ΔE %.1f" % (int(m[0]), int(m[1]), int(m[2]), de)
            if de > 12:
                r.fail.append("skin ΔE %.1f from the approved render (over 12: a redo)" % de)
            elif de > 6:
                r.flag.append("skin ΔE %.1f from the approved render (over 6: colour-correct)" % de)
        elif box:
            r.flag.append("no skin found in the face box (headscarf, hair or a framing problem?)")
    # missing cloth: a limb close-up with no sleeve or cloth in view (U1's bare shoulder)
    if prof.get("sleeve") or line["check"] in ("K1", "K2", "K3", "F1", "F2", "F4"):
        hsv = cv2.cvtColor(a.astype(np.uint8), cv2.COLOR_RGB2HSV)
        skin = (hsv[..., 0] >= 3) & (hsv[..., 0] <= 25) & (hsv[..., 1] > 55)
        cloth = obj & ~skin
        share = cloth.sum() / max(1, obj.sum())
        r.info["cloth"] = round(float(share), 3)
        if share < 0.04:
            r.flag.append("no sleeve or cloth in view (%.1f%% of the subject): a bare shoulder or arm? (modesty, I1)" % (share * 100))
    # 5 sweets
    if prof.get("sweets"):
        n = sweets_risk(a, obj, k)
        r.info["sweets"] = n
        if n:
            r.flag.append("%d round, saturated disc(s) with a glossy highlight: may read as sweets or gumballs (I2)" % n)


def judge_edit(spec, r, base_path, ctx):
    """An edit against the picture it edits: identical, how much changed, and how much outside the allowed region."""
    prof = spec["checks"][r.line["check"]].get("judge", {})
    a = L.load(r.path)
    b = L.load(base_path)
    if a.shape != b.shape:
        r.flag.append("the edit's size %s differs from its original %s" % (a.shape[1::-1], b.shape[1::-1]))
        return
    w, M = register(a, b)
    raw = L.changed(w, b)
    r.info["edit_px"] = int(raw.sum())
    if raw.mean() < 0.0003:  # a thin graze or cut is a few thousand px; under ~470 px at 1.5 MP nothing was edited
        r.fail.append("the edit looks identical to its original (%d pixels changed)" % raw.sum())
        return
    c = cv2.morphologyEx(raw.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)) > 0
    r.info["edit_changed"] = round(float(c.mean()), 4)
    al = prof.get("edit", {}).get("allowed")
    if al:
        H, W = b.shape[:2]
        allowed = np.zeros((H, W), bool)
        allowed[int(al[1] * H):int(al[3] * H), int(al[0] * W):int(al[2] * W)] = True
        allowed = ndi.binary_dilation(allowed, iterations=12)
        lk = (c & ~allowed).sum() / c.size
        r.info["edit_leak"] = round(float(lk), 4)
        if lk > 0.015:
            r.flag.append("something outside the allowed region changed (%.2f%% of the picture, over 1.5%%): body, hands or clothes moved?" % (lk * 100))
    if abs(M[0, 2]) > 40 or abs(M[1, 2]) > 40:
        r.flag.append("the edit shifted %+.0f,%+.0f px against its original" % (M[0, 2], M[1, 2]))


def judge_like(spec, r, like_path, name):
    """W9/W10 against W1, K2 against K1: the same figure size and the same feet line."""
    _, _, o1 = keyed(r.path)
    _, _, o2 = keyed(like_path)
    ys1, xs1 = np.nonzero(o1)
    ys2, xs2 = np.nonzero(o2)
    H = o1.shape[0]
    h1, h2 = ys1.max() - ys1.min(), ys2.max() - ys2.min()
    top, bot = abs(ys1.min() - ys2.min()) / H, abs(ys1.max() - ys2.max()) / H
    r.info["like"] = "%s: height ×%.3f, feet %+.1f%% of H, head %+.1f%% of H" % (name, h1 / h2, (ys1.max() - ys2.max()) / H * 100, (ys1.min() - ys2.min()) / H * 100)
    if bot > 0.015:
        r.flag.append("the feet are %.1f%% of the height off %s's (the legs and feet must stay put)" % (bot * 100, name))
    if abs(h1 / h2 - 1) > 0.03:
        r.flag.append("the figure is ×%.3f the size of %s (over 3%%: scale)" % (h1 / h2, name))
    if top > 0.02:
        r.flag.append("the head is %.1f%% of the height off %s's" % (top * 100, name))


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], epilog=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--spec", default=os.path.join(REPO, "build/tools/art/specs/clinic-heal-v3.run.yaml"))
    ap.add_argument("--dir", help="the images (default: the spec's dest folder)")
    ap.add_argument("--only", help="comma-separated run-line IDs (girl-M1) or file names")
    ap.add_argument("--json", help="also write the result as JSON here")
    ap.add_argument("-v", "--verbose", action="store_true")
    a = ap.parse_args(argv)
    spec = S.load(a.spec)
    d = a.dir or os.path.join(REPO, spec["dest"])
    lines = S.expand(spec)
    by_save = {l["save"]: l for l in lines}
    by_id = {l["id"]: l for l in lines}
    want = set(a.only.split(",")) if a.only else None
    res = []
    for f in sorted(os.listdir(d)):
        l = by_save.get(f)
        if not l or (want and l["id"] not in want and f not in want):
            continue
        res.append(Result(l, os.path.join(d, f)))
    if not res:
        print("no images in %s match the run" % d)
        return 2
    for r in res:
        try:
            judge_one(spec, r, None)
            if r.line["edit_of"] and r.line["edit_of"] in by_id:
                bp = os.path.join(d, by_id[r.line["edit_of"]]["save"])
                if os.path.exists(bp):
                    judge_edit(spec, r, bp, None)
            like = spec["checks"][r.line["check"]].get("judge", {}).get("like")
            if like:  # the line it must look like: the same person's W1, or the same set's K1
                kind = r.line["who"] or r.line["set"]
                lid = "%s-%s" % (kind, like)
                if lid in by_id and os.path.exists(os.path.join(d, by_id[lid]["save"])):
                    judge_like(spec, r, os.path.join(d, by_id[lid]["save"]), lid)
        except Exception as e:  # a bad file never stops the pass
            r.flag.append("could not be measured: %s: %s" % (type(e).__name__, e))
    # near-duplicates: two different run lines whose pictures are the same picture (an edit and its original excepted)
    hs = {}
    for r in res:
        a_ = L.load(r.path)
        hs[r.line["id"]] = hash64(a_)
    ids = list(hs)
    rmap = {r.line["id"]: r for r in res}
    for i in range(len(ids)):
        for j in range(i + 1, len(ids)):
            li, lj = by_id[ids[i]], by_id[ids[j]]
            if li["edit_of"] == lj["id"] or lj["edit_of"] == li["id"] or (li["edit_of"] and li["edit_of"] == lj["edit_of"]):
                continue
            if rmap[ids[i]].info.get("size") != rmap[ids[j]].info.get("size"):
                continue
            dist = int((hs[ids[i]] != hs[ids[j]]).sum())
            if dist <= 3:
                for x, y in ((i, j), (j, i)):
                    rmap[ids[x]].flag.append("near-duplicate of %s (hash distance %d of 64)" % (ids[y], dist))
    counts = {"PASS": 0, "FLAG": 0, "FAIL": 0}
    for r in res:
        counts[r.level] += 1
        head = "%-5s %-14s %s" % (r.level, r.line["id"], r.line["check"])
        if r.level == "PASS":
            print(head + ("  " + json.dumps(r.info, ensure_ascii=False) if a.verbose else ""))
        else:
            print(head)
            for x in r.fail:
                print("        FAIL  " + x)
            for x in r.flag:
                print("        flag  " + x)
            if a.verbose:
                print("        " + json.dumps(r.info, ensure_ascii=False))
    print("\n%d image(s): %d pass, %d flag, %d fail" % (len(res), counts["PASS"], counts["FLAG"], counts["FAIL"]))
    if a.json:
        json.dump([{"id": r.line["id"], "file": os.path.basename(r.path), "check": r.line["check"], "level": r.level, "fail": r.fail, "flag": r.flag, "info": r.info} for r in res],
                  open(a.json, "w"), indent=1, ensure_ascii=False)
    return 1 if counts["FAIL"] else 0


if __name__ == "__main__":
    sys.exit(main())
