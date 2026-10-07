#!/usr/bin/env python3
"""The general art cutter: one JSON spec per pack drives the cut (art-pipeline.md "Art tools").

  python3 build/tools/art/artcut.py build/tools/art/specs/clinic-heal-v3.cut.json            # cut what has landed
  python3 build/tools/art/artcut.py SPEC --out /tmp/x --only child-knee,o1-ear-foot          # test run, chosen jobs
  python3 build/tools/art/artcut.py SPEC --list                                              # the jobs and what is missing
  python3 build/tools/art/artcut.py SPEC -v                                                  # the full report, not the summary

Job types (spec "jobs", each with an "id"; "each": [{...vars}] repeats a job with <var> replaced in every string):
  closeup  one limb/head that leaves by "exits" (kept flush), @2x sharpened; "states": other pictures registered
           (ECC, "register": {"mode": "translation"|"affine", "band": [y0, y1]}) onto the base and keyed on its canvas
  grid     a prop sheet cut by its gutters: pieces in reading order get "names" (null skips one), padded, max "max" px;
           "glass": names kept at partial alpha; "failed": {name: reason} not cut; "registered": [{"names", "align"}]
           pad pieces of one object onto one shared canvas (base | topleft)
  background  (s02) a 16:9 background cropped at "crop_y", resized, with painted trays measured ("measure")
  grid "cells"/"boxes" (s02): whole blobs by centroid per cell, or explicit source-px boxes; "sizes" per name;
           "soft" keys the whole sheet colour-to-alpha (glass); "register_scale" shrinks a registered set together
  figure   a single standing/sitting figure: the base pose and its poses ("poses": whole figures registered on a band),
           face layers ("faces": head-only edits on the base's canvas), one canvas for all, the 1x size from "fig_h",
           @2x never above the source, anchors as canvas fractions, 512 px corner heads, an optional side pose
Missing sources are skipped and listed, so the cut can be re-run as a run uploads more. Nothing here changes the old
build/cut_*.py scripts. Output: webp (+ @2x), a data JSON ("data") and cut-report.txt beside it.
"""
import argparse
import copy
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import artlib as L  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
REPORT, FLAGS = [], []
VERBOSE = False


def log(msg, flag=False, quiet=False):
    REPORT.append(msg)
    if flag:
        FLAGS.append(msg.strip())
    if VERBOSE or flag or not quiet:
        print(msg)


class Ctx:
    def __init__(self, spec, out, src, data_path):
        self.spec = spec
        self.out = out
        self.src = src
        self.data_path = data_path
        self.skin = np.array(spec.get("skin_render", [0xF3, 0x98, 0x61]), float)
        self.failed = spec.get("failed", {})  # source name -> reason: judged a fail, not cut
        self.missing = []

    def path(self, name):
        if name in self.failed:
            log("  %s: judged a fail, not cut (%s)" % (name, self.failed[name]), quiet=True)
            return None
        p = os.path.join(self.src, name)
        if os.path.exists(p):
            return p
        self.missing.append(name)
        return None

    def rel(self, p):
        base = self.out if self.out else REPO
        return os.path.relpath(p, base).replace(os.sep, "/")

    def to(self, rel_path):
        return os.path.join(self.out, rel_path)

    def skin_check(self, rgb, alpha, box, name):
        m = L.skin_median(rgb, alpha, box)
        if m is None:
            return None
        de = L.delta_e(m, self.skin)
        lim = self.spec.get("skin_limits", [6, 12])
        log("  skin %s: #%02X%02X%02X ΔE %.1f from the approved render%s%s" % (name, int(m[0]), int(m[1]), int(m[2]), de, " (colour-correct)" if de > lim[0] else "", " FAIL" if de > lim[1] else ""),
            flag=de > lim[1], quiet=True)
        return de


def fit_to(e, shape):
    if e.shape == shape:
        return e
    return np.asarray(Image.fromarray(e.astype(np.uint8)).resize((shape[1], shape[0]), Image.LANCZOS)).astype(float)


# ---------------------------------------------------------------- closeup

def cut_closeup(job, cx):
    p = cx.path(job["src"])
    if not p:
        return None
    exits = tuple(job.get("exits", ()))
    a = L.load(p)
    H, W = a.shape[:2]
    k, obj = L.key(a, exits=exits)
    L.flush_exits(k, obj, exits)
    outp = cx.to(job["out"])
    files = save_closeup(L.to_img(k), outp, job)
    d = {"file": cx.rel(files[0]), "size": [W, H], "exits": list(exits),
         "box": [round(v / s, 4) for v, s in zip(L.bbox(k[..., 3]), [W, H, W, H])]}
    n = 1
    for suf, st in (job.get("states") or {}).items():
        sp = cx.path(st["src"])
        if not sp:
            log("  %s: not landed" % suf, quiet=True)
            continue
        e = fit_to(L.load(sp), a.shape)
        reg = st.get("register")
        if reg:
            mode = cv2.MOTION_TRANSLATION if reg.get("mode", "translation") == "translation" else cv2.MOTION_AFFINE
            e, M = L.ecc(e, a, reg["band"], mode, say=log)
            log("  %s: shift %+.1f,%+.1f px" % (suf, M[0, 2], M[1, 2]), quiet=True)
        ke, oe = L.key(e, exits=exits)
        L.flush_exits(ke, oe, exits)
        d[suf] = cx.rel(save_closeup(L.to_img(ke), outp.replace(".webp", "-%s.webp" % suf), job)[0])
        n += 1
    if job.get("mirror"):  # a gaze fix: the face is symmetric, so the picture is mirrored (recorded)
        for f in (outp, outp.replace(".webp", "@2x.webp")):
            Image.open(f).transpose(Image.FLIP_LEFT_RIGHT).save(f, quality=90, method=6)
        d["mirrored"] = True
    log("%s: cut, exits %s, %d picture(s)" % (job["id"], ",".join(exits) or "none", n))
    return {"closeup": job.get("data", job["id"]), "value": d}


def save_closeup(img, path, job):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, quality=job.get("q", 90), method=6)
    p2 = path.replace(".webp", "@2x.webp")
    L.sharpen2x(img).save(p2, quality=job.get("q2", 88), method=6)
    return [path, p2]


# ---------------------------------------------------------------- grid

def cell_pieces(job, obj, shape, ma):
    """Pieces by cell or by box (s02): "cells": [cols, rows] gives each whole blob to the cell holding its centroid
    (art-pipeline "whole blobs by centroid"), so an item that pokes over a cell line stays whole; "boxes":
    {name: [x0, y0, x1, y1]} (source px) cuts a named piece by an explicit box, for items that touch a neighbour.
    Returns [(y0, x0, y1, x1, mask, name)] in reading order, the mask being the piece's own pixels in that box."""
    H, W = shape
    out = []
    boxes = job.get("boxes", {})
    names = job["names"]
    if "cells" in job:
        cols, rows = job["cells"]
        lb, n = ndi.label(obj)
        sz = ndi.sum(np.ones_like(lb), lb, range(1, n + 1))
        com = ndi.center_of_mass(np.ones_like(lb), lb, range(1, n + 1))
        cell_of = {}
        for i, (c, s) in enumerate(zip(com, sz), 1):
            if s < job.get("min_bit", 60):
                continue
            cx_, cy_ = min(cols - 1, int(c[1] / (W / cols))), min(rows - 1, int(c[0] / (H / rows)))
            cell_of.setdefault(cy_ * cols + cx_, []).append(i)
        for idx, nm in enumerate(names):
            if not nm or nm in boxes:
                continue
            ids = cell_of.get(idx, [])
            if not ids or sum(sz[i - 1] for i in ids) < ma:
                log("  %s: nothing in cell %d" % (nm, idx + 1), flag=True)
                continue
            m = np.isin(lb, ids)
            ys, xs = np.nonzero(m)
            y0, x0, y1, x1 = ys.min(), xs.min(), ys.max() + 1, xs.max() + 1
            out.append((y0, x0, y1, x1, m[y0:y1, x0:x1], nm))
    for nm, (bx0, by0, bx1, by1) in boxes.items():
        reg = np.zeros((H, W), bool)
        reg[by0:by1, bx0:bx1] = True
        m = obj & reg
        lb, n = ndi.label(m)
        if n > 1:  # the neighbour's slivers inside the box go: keep the blobs of real size
            s = ndi.sum(np.ones_like(lb), lb, range(1, n + 1))
            m = np.isin(lb, [i + 1 for i, v in enumerate(s) if v >= max(job.get("min_bit", 60), 0.02 * s.max())])
        ys, xs = np.nonzero(m)
        if not len(ys):
            log("  %s: nothing in its box" % nm, flag=True)
            continue
        y0, x0, y1, x1 = ys.min(), xs.min(), ys.max() + 1, xs.max() + 1
        out.append((y0, x0, y1, x1, m[y0:y1, x0:x1], nm))
    order = {nm: i for i, nm in enumerate(names)}
    out.sort(key=lambda t: order.get(t[5], 1e9))
    return out


def cut_grid(job, cx):
    p = cx.path(job["src"])
    if not p:
        return None
    a = L.load(p)
    ma = job.get("min_area", 1500)
    k, obj = L.key(a, multi=ma, tol=job.get("tol", 10))
    names = job["names"]
    if "cells" in job or "boxes" in job:
        named = cell_pieces(job, obj, a.shape[:2], ma)
        log("%s: %d piece(s) by %s for %d name(s)" % (job["id"], len(named), "cell" if "cells" in job else "box", len([n for n in names if n])))
    else:
        lb, n = ndi.label(ndi.binary_dilation(obj, iterations=6))
        pieces = []
        for i in range(1, n + 1):
            ys, xs = np.nonzero(lb == i)
            if len(ys) >= ma:
                pieces.append((ys.min(), xs.min(), ys.max() + 1, xs.max() + 1, i))
        rows = job.get("rows", 3)
        pieces.sort(key=lambda t: (int(((t[0] + t[2]) / 2) // (a.shape[0] / rows)), t[1]))  # rows by the top, then left to right
        log("%s: %d pieces for %d names%s" % (job["id"], len(pieces), len(names), "" if len(pieces) == len(names) else "  <-- COUNT MISMATCH"),
            flag=len(pieces) != len(names))
        named = [(y0, x0, y1, x1, lb[y0:y1, x0:x1] == i, nm) for (y0, x0, y1, x1, i), nm in zip(pieces, names)]
    props = {}
    pad, big = job.get("pad", 16), job.get("max", 512)
    sizes = job.get("sizes", {})  # name -> its longest side in px (decision 68: at drawn size, not the sheet's)
    outdir = cx.to(job["outdir"])
    ks = None
    soft_all = job.get("soft", False)
    cvs = {}
    for (y0, x0, y1, x1, m, nm) in named:
        if not nm:
            continue
        if nm in job.get("failed", {}):
            log("  %s: judged a fail, not cut (%s)" % (nm, job["failed"][nm]), quiet=True)
            continue
        if soft_all or nm in job.get("glass", ()):  # partial alpha, never a solid core
            ks = ks if ks is not None else L.key(a, multi=ma, soft=True, tol=job.get("tol", 10))[0]
            piece = ks[y0:y1, x0:x1].copy()
            m = ndi.binary_fill_holes(ndi.binary_dilation(m, iterations=2))  # the soft edge stays; clear glass inside isn't a hole
        else:
            piece = k[y0:y1, x0:x1].copy()
        piece[..., 3] *= m
        img = L.to_img(piece)
        cv = Image.new("RGBA", (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
        cv.alpha_composite(img, (pad, pad))
        cvs[nm] = cv
    # one scale per registered set when "register_scale" (s02): the states of one object shrink together
    group_of = {n: g["names"] for g in job.get("registered", []) for n in g["names"]} if job.get("register_scale") else {}
    for nm, cv in cvs.items():
        grp = [g for g in group_of.get(nm, [nm]) if g in cvs]
        s = min(1, min(sizes.get(g, big) / max(cvs[g].size) for g in grp))
        if s < 1:
            cv = cv.resize((round(cv.width * s), round(cv.height * s)), Image.LANCZOS)
        path = "%s/%s.webp" % (outdir, nm)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        cv.save(path, quality=job.get("q", 90), method=6, lossless=job.get("lossless", False))
        props[nm] = {"file": cx.rel(path), "w": cv.width, "h": cv.height}
        if job.get("scale_note"):
            props[nm]["scale"] = round(s, 4)
    for grp in job.get("registered", []):
        register_set(props, grp["names"], grp.get("align", "topleft"), cx, job.get("q", 90))
    return {"props": props}


def register_set(props, names, align, cx, q):
    """Registered states (D8): pieces of one object onto one canvas, aligned top-left (centred on y) or by the base."""
    ims = {n: Image.open(os.path.join(cx.out, props[n]["file"])) for n in names if n in props}
    if len(ims) < 2:
        return
    W = max(i.width for i in ims.values())
    H = max(i.height for i in ims.values())
    for n, im in ims.items():
        c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        c.alpha_composite(im, ((W - im.width) // 2, H - im.height) if align == "base" else (0, (H - im.height) // 2))
        c.save(os.path.join(cx.out, props[n]["file"]), quality=q, method=6)
        props[n].update({"w": W, "h": H})
    log("  registered on one canvas %dx%d: %s" % (W, H, ", ".join(ims)), quiet=True)


# ---------------------------------------------------------------- figure

def cut_figure(job, cx):
    p = cx.path(job["src"])
    if not p:
        log("%s: base not landed" % job["id"])
        return None
    w1 = L.load(p)
    H, W = w1.shape[:2]
    k1, obj1 = L.key(w1)
    sb = job.get("skin_box", [.35, .2, .65, .38])
    cx.skin_check(w1, k1[..., 3], (int(W * sb[0]), int(H * sb[1]), int(W * sb[2]), int(H * sb[3])), "%s base face" % job["id"])
    figs = {"front": k1}
    rows = obj1.sum(1)
    top = int(np.argmax(rows > 0))
    neck = job.get("neck", int(0.35 * H))  # the collar row (measured on the grid)
    band_pad, leak_max = job.get("band_pad", 40), job.get("leak_max", 0.015)
    log("  head band y %d..%d" % (top, neck), quiet=True)
    faces = {}
    for f, name in job.get("faces", {}).items():
        fp = cx.path(name)
        if not fp:
            log("  face %s: not landed" % f, quiet=True)
            continue
        e = fit_to(L.load(fp), w1.shape)
        r, M = L.ecc(e, w1, (top / H, (neck + band_pad) / H), say=log)
        m = L.head_mask(r, w1, neck + 30, neck, (H, W))
        m[neck + 30:] = 0
        lk = L.leak(r, w1, m > 0)
        log("  face %s: shift %+.1f,%+.1f px, leak outside the head %.2f%%%s" % (f, M[0, 2], M[1, 2], lk * 100, " REDO" if lk > leak_max else ""), flag=lk > leak_max, quiet=True)
        soft = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 6)
        kr, _ = L.key(r)
        faces[f] = np.dstack([r, np.minimum(soft, kr[..., 3])])
    for n, ps in job.get("poses", {}).items():
        fp = cx.path(ps["src"])
        if not fp:
            log("  pose %s: not landed" % n, quiet=True)
            continue
        band = ps["band"]
        e = L.load(fp)
        r, M = L.ecc(e, w1, band, cv2.MOTION_TRANSLATION, say=log)
        kr, _ = L.key(r)
        lb = np.zeros((H, W), bool)
        lb[int(band[0] * H):int(band[1] * H)] = True
        if np.abs(kr[..., 3] - k1[..., 3])[lb].mean() > 0.02:  # a fresh prompt comes back a little bigger or smaller: fit by scale
            r2, M2 = L.ecc(e, w1, band, cv2.MOTION_AFFINE, say=log)
            kr2, _ = L.key(r2)
            if np.abs(kr2[..., 3] - k1[..., 3])[lb].mean() < np.abs(kr[..., 3] - k1[..., 3])[lb].mean():
                log("  pose %s: fitted by scale %.3f on the legs (an interim; the redo list has it)" % (n, np.hypot(M2[0, 0], M2[1, 0])), quiet=True)
                r, M = r2, M2
        kr, _ = L.key(r)
        drift = np.abs(kr[..., 3] - k1[..., 3])[lb].mean()
        log("  pose %s: shift %+.1f,%+.1f px; leg-band alpha drift %.2f%%%s" % (n, M[0, 2], M[1, 2], drift * 100, " REDO" if drift > ps.get("drift_max", 0.02) else ""),
            flag=drift > ps.get("drift_max", 0.02), quiet=True)
        figs[n] = kr
    # one canvas for every front pose: the union of their boxes + pad (in drawn px), bottom = the feet
    boxes = [L.bbox(f[..., 3]) for f in figs.values()]
    x0, y0 = min(b[0] for b in boxes), min(b[1] for b in boxes)
    x1, y1 = max(b[2] for b in boxes), max(b[3] for b in boxes)
    fh = L.bbox(k1[..., 3])
    s1 = job["fig_h"] / (fh[3] - fh[1])  # 1x scale: the base figure at its drawn height
    pad = int(round(job.get("pad", 16) / s1))
    cx0, cy0, cx1, cy1 = max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad)
    cw, ch = cx1 - cx0, cy1 - cy0
    size1 = (round(cw * s1), round(ch * s1))
    size2 = (size1[0] * 2, size1[1] * 2)
    if size2[1] > ch:  # never upscale the figures: the @2x is at most the source
        size2 = (cw, ch)
    base = cx.to(job["out"])
    out = {"canvas": [cw, ch], "src": [cx0, cy0], "w": size1[0], "h": size1[1]}
    crop = lambda r: L.to_img(r[cy0:cy1, cx0:cx1])
    for n, f in figs.items():
        out[n] = cx.rel(L.save(crop(f), "%s-%s.webp" % (base, "front" if n == "front" else "front-" + n), 90, size1, size2)[0])
    out["faces"] = {f: cx.rel(L.save(crop(r), "%s-face-%s.webp" % (base, f), 92, size1, size2)[0]) for f, r in faces.items()}
    ys1, _ = np.nonzero(k1[..., 3] > 0.5)
    out["feet"] = round((ys1.max() - cy0) / ch, 4)
    an = job.get("anchors", {}).get("front", {})
    out["anchors"] = {k: [round((v[0] - cx0) / cw, 4), round((v[1] - cy0) / ch, 4)] for k, v in an.items()}
    # the corner faces: square head crops, eye line at 42 %, face width fixed (D18)
    heads = {}
    ey = an.get("eyes", [W / 2, top + 0.3 * (neck - top)])
    side = int((neck - top) * 1.25)
    hx0, hy0 = int(ey[0] - side / 2), int(ey[1] - 0.42 * side)
    for f, r in [("neutral", k1)] + list(faces.items()):
        full = k1.copy()
        if f != "neutral":
            al = r[..., 3:4]
            full[..., :3] = full[..., :3] * (1 - al) + r[..., :3] * al
        sq = np.zeros((side, side, 4))
        ya, xa, yb, xb = max(0, hy0), max(0, hx0), min(H, hy0 + side), min(W, hx0 + side)
        sq[ya - hy0:yb - hy0, xa - hx0:xb - hx0] = full[ya:yb, xa:xb]
        heads[f] = cx.rel(L.save(L.to_img(sq), "%s-head-%s.webp" % (base, f), 92, (512, 512))[0])
    out["heads"] = heads
    sd_job = job.get("side")
    sp = cx.path(sd_job["src"]) if sd_job else None
    if sp:
        w7 = L.load(sp)
        k7, _ = L.key(w7)
        b7 = L.bbox(k7[..., 3])
        s7 = s1 * sd_job.get("scale", 1)  # the generator draws the side pose a little smaller: scaled so the heads match
        pad7 = int(round(job.get("pad", 16) / s7))
        sx0, sy0, sx1, sy1 = max(0, b7[0] - pad7), max(0, b7[1] - pad7), min(W, b7[2] + pad7), min(H, b7[3] + pad7)
        sw, sh = sx1 - sx0, sy1 - sy0
        z1 = (round(sw * s7), round(sh * s7))
        z2 = (min(sw, z1[0] * 2), min(sh, z1[1] * 2))
        sd = {"canvas": [sw, sh], "src": [sx0, sy0], "w": z1[0], "h": z1[1], "feet": round((b7[3] - sy0) / sh, 4)}
        sd["file"] = cx.rel(L.save(L.to_img(k7[sy0:sy1, sx0:sx1]), "%s-side.webp" % base, 90, z1, z2)[0])
        sd["anchors"] = {k: [round((v[0] - sx0) / sw, 4), round((v[1] - sy0) / sh, 4)] for k, v in job.get("anchors", {}).get("side", {}).items()}
        for f, name in sd_job.get("faces", {}).items():
            fp = cx.path(name)
            if not fp:
                log("  side face %s: not landed" % f, quiet=True)
                continue
            r, M = L.ecc(L.load(fp), w7, (b7[1] / H, 0.4), say=log)
            m = L.head_mask(r, w7, int(0.4 * H), 0, (H, W))
            lk = L.leak(r, w7, m > 0)
            log("  side face %s: leak %.2f%%%s" % (f, lk * 100, " REDO" if lk > leak_max else ""), flag=lk > leak_max, quiet=True)
            soft = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 6)
            k8, _ = L.key(r)
            sd[f] = cx.rel(L.save(L.to_img(np.dstack([r, np.minimum(soft, k8[..., 3])])[sy0:sy1, sx0:sx1]), "%s-side-face-%s.webp" % (base, f), 92, z1, z2)[0])
        out["side"] = sd
    elif sd_job:
        log("  side pose: not landed", quiet=True)
    out["age"] = job.get("age")
    log("%s: figure cut, canvas %dx%d, %d pose(s), %d face layer(s)" % (job["id"], cw, ch, len(figs), len(faces)))
    return {"patient": job.get("data", job["id"]), "value": out}


# ---------------------------------------------------------------- background (s02)

def cut_background(job, cx):
    """A background at 16:9 (art-pipeline Export): the scene's band cropped at "crop_y" (the source row that becomes
    the top; chosen so a measured line, e.g. the island's back edge, lands where the old background had it), resized
    to "size" (1600x900), saved as webp (or jpg). "measure": {"trays": {"hsv": [h0, h1, s0, v1], "count": 3}} finds
    the dark walnut trays painted on it and records each one's box in design px [cx, cy, w, h] (left to right)."""
    p = cx.path(job["src"])
    if not p:
        return None
    im = Image.open(p).convert("RGB")
    W, H = im.size
    tw, th = job.get("size", [1600, 900])
    bh = round(W * th / tw)
    oy = job.get("crop_y", (H - bh) // 2)
    band = im.crop((0, oy, W, oy + bh)).resize((tw, th), Image.LANCZOS)
    outp = cx.to(job["out"])
    os.makedirs(os.path.dirname(outp), exist_ok=True)
    if outp.endswith(".jpg"):
        band.save(outp, quality=job.get("q", 86), optimize=True, progressive=True)
    else:
        band.save(outp, quality=job.get("q", 86), method=6)
    d = {"file": cx.rel(outp), "size": [tw, th], "crop_y": oy, "src_band": [W, bh]}
    tr = (job.get("measure") or {}).get("trays")
    if tr:
        a = np.asarray(band)
        hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV)
        h0, h1, s0, v1 = tr["hsv"]
        y0, y1 = tr.get("band", [0, th])
        m = (hsv[..., 0] >= h0) & (hsv[..., 0] <= h1) & (hsv[..., 1] >= s0) & (hsv[..., 2] <= v1)
        m[:y0] = False
        m[y1:] = False
        m = ndi.binary_closing(m, iterations=3)
        lb, n = ndi.label(m)
        sz = ndi.sum(np.ones_like(lb), lb, range(1, n + 1))
        best = sorted(range(1, n + 1), key=lambda i: -sz[i - 1])[: tr.get("count", 3)]
        trays = []
        for i in best:
            ys, xs = np.nonzero(lb == i)
            x0, x1, y0_, y1_ = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
            trays.append([int(round((x0 + x1) / 2)), int(round((y0_ + y1_) / 2)), int(x1 - x0), int(y1_ - y0_)])
        trays.sort()
        d["trays"] = trays
        log("  trays (design px cx, cy, w, h): %s" % trays, quiet=True)
    for nm, (ln, want) in (job.get("lines") or {}).items():
        d.setdefault("lines", {})[nm] = {"src": ln, "at": round((ln - oy) * th / bh, 1), "want": want}
        log("  %s: source row %d lands at %.1f (old background %d)" % (nm, ln, (ln - oy) * th / bh, want), quiet=True)
    log("%s: background %dx%d from rows %d..%d" % (job["id"], tw, th, oy, oy + bh))
    return {"props": {job.get("data", job["id"]): d}}


def cut_pose(job, cx):
    """(s02) A redone whole-figure pose onto an existing figure's canvas, without re-cutting that figure (its files
    stay as they are): registered to "base" (the figure's base picture) on "band" (translation, or by scale when it
    drifts), keyed, cropped at the canvas recorded in "canvas_from" (file#path.to.patient: src, canvas, w, h)."""
    p = cx.path(job["src"])
    if not p:
        return None
    base = L.load(os.path.join(REPO, job["base"]))
    fpath, _, keypath = job["canvas_from"].partition("#")
    spec = json.load(open(os.path.join(REPO, fpath)))
    for k in keypath.split("."):
        spec = spec[k]
    H, W = base.shape[:2]
    e = fit_to(L.load(p), base.shape)
    band = job["band"]
    kb, _ = L.key(base)
    lb = np.zeros((H, W), bool)
    lb[int(band[0] * H):int(band[1] * H)] = True
    best = None
    for mode in (cv2.MOTION_TRANSLATION, cv2.MOTION_AFFINE):
        r, M = L.ecc(e, base, band, mode, say=log)
        kr, _ = L.key(r)
        drift = np.abs(kr[..., 3] - kb[..., 3])[lb].mean()
        if best is None or drift < best[0]:
            best = (drift, kr, M)
    drift, kr, M = best
    log("  %s: shift %+.1f,%+.1f px, scale %.3f; leg-band alpha drift %.2f%%%s" % (job["id"], M[0, 2], M[1, 2], np.hypot(M[0, 0], M[1, 0]), drift * 100, " REDO" if drift > job.get("drift_max", 0.02) else ""),
        flag=drift > job.get("drift_max", 0.02), quiet=True)
    x0, y0 = spec["src"]
    cw, ch = spec["canvas"]
    size1 = (spec["w"], spec["h"])
    size2 = (size1[0] * 2, size1[1] * 2) if size1[1] * 2 <= ch else (cw, ch)
    out = L.save(L.to_img(kr[y0:y0 + ch, x0:x0 + cw]), cx.to(job["out"]), 90, size1, size2)
    log("%s: pose on the figure's canvas %dx%d" % (job["id"], cw, ch))
    return {"closeup": job.get("data", job["id"]), "value": {"file": cx.rel(out[0]), "drift": round(float(drift), 4)}}


TYPES = {"closeup": cut_closeup, "grid": cut_grid, "figure": cut_figure, "background": cut_background, "pose": cut_pose}


# ---------------------------------------------------------------- spec handling

def expand(spec):
    """Jobs with "each": [{var: value}] become one job per row with <var> replaced in every string."""
    jobs = []
    for j in spec["jobs"]:
        if "each" not in j:
            jobs.append(j)
            continue
        txt = json.dumps({k: v for k, v in j.items() if k != "each"})
        for row in j["each"]:
            t = txt
            for k, v in row.items():
                t = t.replace("<%s>" % k, str(v))
            jobs.append(json.loads(t))
    return jobs


def load_spec(path):
    txt = open(path).read()
    if path.endswith((".yaml", ".yml")):
        import yaml
        return yaml.safe_load(txt)
    return json.loads(txt)


def main(argv=None):
    global VERBOSE
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__)
    ap.add_argument("spec")
    ap.add_argument("--out", help="write here instead of the spec's out folder (test runs)")
    ap.add_argument("--src", help="read sources from here instead of the spec's src folder")
    ap.add_argument("--only", help="comma-separated job ids")
    ap.add_argument("--list", action="store_true", help="list the jobs and which sources are missing; cut nothing")
    ap.add_argument("-v", "--verbose", action="store_true")
    a = ap.parse_args(argv)
    VERBOSE = a.verbose
    spec = load_spec(a.spec)
    out = os.path.abspath(a.out) if a.out else os.path.join(REPO, spec["out"])
    src = os.path.abspath(a.src) if a.src else os.path.join(REPO, spec["src"])
    data_path = os.path.join(out, "cut-data.json") if a.out else os.path.join(REPO, spec.get("data", "cut-data.json"))
    cx = Ctx(spec, out, src, data_path)
    jobs = expand(spec)
    if a.only:
        want = set(a.only.split(","))
        jobs = [j for j in jobs if j["id"] in want]
    if a.list:
        for j in jobs:
            names = [j.get("src")] + [s["src"] for s in (j.get("states") or {}).values()] + list((j.get("faces") or {}).values()) + [p["src"] for p in (j.get("poses") or {}).values()]
            miss = [n for n in names if n and not os.path.exists(os.path.join(src, n))]
            print("%-22s %-8s %s" % (j["id"], j["type"], ("missing: " + ", ".join(miss)) if miss else "ready"))
        return 0
    data = {"_about": spec.get("about", ""), "patients": {}, "closeups": {}, "props": {}}
    for j in jobs:
        try:
            r = TYPES[j["type"]](j, cx)
        except Exception as e:  # one bad picture never stops the pack
            log("%s: ERROR %s: %s" % (j["id"], type(e).__name__, e), flag=True)
            continue
        if not r:
            continue
        if "props" in r:
            data["props"].update(r["props"])
        elif "closeup" in r:
            data["closeups"][r["closeup"]] = r["value"]
        elif "patient" in r:
            data["patients"][r["patient"]] = r["value"]
    os.makedirs(out, exist_ok=True)
    data["_report"] = REPORT
    with open(data_path, "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    rep = os.path.join(out, "cut-report.txt") if a.out or not spec.get("report_beside_data") else data_path.replace(".json", "-report.txt")
    open(rep, "w").write("\n".join(REPORT) + "\n")
    miss = sorted(set(cx.missing))
    print("\n%d job(s); %d flag(s)%s; data %s" % (len(jobs), len(FLAGS), ("; %d source(s) not landed" % len(miss)) if miss else "", os.path.relpath(data_path, REPO)))
    return 1 if FLAGS else 0


if __name__ == "__main__":
    sys.exit(main())
