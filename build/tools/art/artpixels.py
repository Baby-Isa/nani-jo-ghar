#!/usr/bin/env python3
"""Pixel check on shipped cut-outs (SH-115; Zafar, 18 Oct: "we built a tool to cut these out and test them").

A cut-out is a WebP/PNG with alpha. The header check (artcheck.mjs) only proves the alpha exists; this reads the pixels
and fails a cut that still carries its sheet's key grey (#808080) or a ragged, wide soft rim. Judged on a flat cream
composite (the colour the game's tables and rooms are closest to), so a faint rim nobody can see is not a finding.

  python3 build/tools/art/artpixels.py FILE...            one line per file: PASS or FAIL with the reasons
  python3 build/tools/art/artpixels.py --scan [--json]    every candidate under assets/ (what artcheck.mjs runs; the
                                                          parked hands under assets/characters/hands are not drawn by any page)
  python3 build/tools/art/artpixels.py --json FILE...     the measures and verdicts of the named files as JSON
  python3 build/tools/art/artpixels.py --sheet OUT.png FILE...   a contact sheet on cream and on dark

Key grey: a pixel with |rgb-122| <= 14, channel spread < 12 and a 5x5 local spread of luma < 1.5 (the sheets' ground is
117-128 and flat to 0.5; the sole's gap between two toes was 112-121).
Rules (RULES below; solid pieces):
  holes   a patch of key grey of 16 px or more that sits among coloured pixels (channel spread over 22: skin, food, plastic)
          or touches the outline (within 3 px of alpha 0): grey left between toes or prongs, inside a loop. Among neutral
          pixels (steel, glass, white) a patch can be the piece's own face, so there only the outline counts
  grey    the holes together are over 3 % of the solid pixels
  smudge  over 2 % of the covered pixels are dark neutral soft alpha beyond 2 px of the solid body: a cast shadow kept
  rim     the semi-alpha band that shows on cream (composite differs from cream by more than 12) is wider than 5 px on
          average (pixels of that band / pixels of the outline)
Glass (a piece whose semi-alpha pixels are over 28 % of what it covers) gets a narrower rule, not an exemption: grey and
holes are measured as above (on alpha >= 0.5), the rim rule is replaced by
  halo    more than 5 % of the covered pixels lie more than 3 px from any pixel of alpha >= 0.5 (a cast shadow, or the
          sheet's haze, kept as soft alpha)
  greyring  more than 1 % of the outer 3 px ring is soft alpha whose colour is the key grey (a grey fringe)
Thresholds are in RULES; change them there and re-run `artcheck.mjs --write-known` only when a rule is tightened.
"""
import hashlib
import json
import os
import sys
import tempfile

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CREAM = np.array([247.0, 238.0, 220.0])
RULES = {"v": 8, "grey_share": 0.03, "hole_px": 16, "rim_w": 5.0, "glass_semi": 0.28, "halo": 0.05, "greyring": 0.01,
         "smudge": 0.02, "max_side": 1600, "key_tol": 14, "key_mid": 122, "spread": 12, "flat_sd": 1.5, "coloured": 22}


def analyse(path):
    im = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32)
    rgb, a = im[..., :3], im[..., 3] / 255.0
    k = int(np.ceil(max(a.shape) / float(RULES["max_side"])))  # big pictures are measured at 1/k (alpha-weighted), quicker
    if k > 1:
        h, w = (a.shape[0] // k) * k, (a.shape[1] // k) * k
        a = a[:h, :w].reshape(h // k, k, w // k, k).mean((1, 3))
        pm = (rgb[:h, :w] * (im[:h, :w, 3:4] / 255.0)).reshape(h // k, k, w // k, k, 3).mean((1, 3))
        rgb = np.where(a[..., None] > 1e-3, pm / np.maximum(a[..., None], 1e-3), 0)
    op, nz = a >= 0.9, a > 0.04
    n_nz = int(nz.sum())
    if n_nz < 30:
        return {"covered": n_nz, "fails": ["empty: fewer than 30 pixels have any alpha"], "glass": False}
    semi_mask = nz & ~op
    glass = semi_mask.sum() / n_nz > RULES["glass_semi"]
    solid = op if not glass else (a >= 0.5)
    lum = rgb.mean(2)
    spread = rgb.max(2) - rgb.min(2)
    near_key = (np.abs(rgb - RULES["key_mid"]).max(2) <= RULES["key_tol"]) & (spread < RULES["spread"])
    m1, m2 = ndi.uniform_filter(lum, 5), ndi.uniform_filter(lum * lum, 5)
    sd = np.sqrt(np.maximum(m2 - m1 * m1, 0))
    key = near_key & (sd < RULES["flat_sd"]) & solid
    n_solid = max(int(solid.sum()), 1)
    lab, n = ndi.label(key)
    holes = []
    if n:
        sizes = np.bincount(lab.ravel(), minlength=n + 1)
        # a patch of key grey is the ground left on the piece when it is among coloured pixels (toes, food, plastic) or
        # touches the outline; among neutral pixels (steel, glass, white) it can be the piece's own face, so it counts
        # only at the outline
        _, (iy, ix) = ndi.distance_transform_edt(~key, return_indices=True)
        near = lab[iy, ix]
        ring = (~key) & solid & (ndi.distance_transform_edt(~key) <= 3)
        rs = np.bincount(near[ring], weights=spread[ring], minlength=n + 1) / np.maximum(np.bincount(near[ring], minlength=n + 1), 1)
        edge = np.bincount(lab[key & ndi.binary_dilation(a <= 0.04, iterations=3)], minlength=n + 1) > 0
        for i in range(1, n + 1):
            if sizes[i] * k * k < RULES["hole_px"] or sizes[i] < 3:
                continue
            if rs[i] > RULES["coloured"] or edge[i]:
                holes.append(int(sizes[i]) * k * k)
    grey = sum(holes) / (n_solid * k * k)
    comp = rgb * a[..., None] + CREAM * (1 - a[..., None])
    vis = semi_mask & (np.abs(comp - CREAM).max(2) > 12)
    per = int((ndi.binary_dilation(~nz) & nz).sum()) + 1
    rim = vis.sum() / per
    far = ndi.distance_transform_edt(~(a >= 0.5))
    halo = float((nz & (far > 3)).sum()) / n_nz
    ring = nz & (ndi.distance_transform_edt(nz) <= 3)
    gr = float((ring & ~op & near_key).sum()) / max(int(ring.sum()), 1)
    soft_dark = nz & (a < 0.6) & (spread < 22) & (lum < 115) & (ndi.distance_transform_edt(~(a >= 0.9)) > 2)
    smudge = float(soft_dark.sum()) / n_nz
    fails = []
    if grey > RULES["grey_share"]:
        fails.append("grey %.1f%% of the solid pixels are key grey" % (grey * 100))
    if holes:
        fails.append("holes %d key-grey patch(es), the largest %d px" % (len(holes), max(holes)))
    if glass:
        if halo > RULES["halo"]:
            fails.append("halo %.1f%% soft alpha away from the body (cast shadow or haze)" % (halo * 100))
        if gr > RULES["greyring"]:
            fails.append("greyring %.1f%% of the outer ring is key grey" % (gr * 100))
    elif rim > RULES["rim_w"]:
        fails.append("rim a soft rim %.1f px wide on cream" % rim)
    if smudge > RULES["smudge"]:
        fails.append("smudge %.1f%% is a dark soft shadow kept as alpha" % (smudge * 100))
    return {"covered": n_nz, "glass": bool(glass), "grey": round(float(grey), 4), "holes": len(holes),
            "hole_max": max(holes) if holes else 0, "rim": round(float(rim), 2), "smudge": round(smudge, 4), "halo": round(halo, 4), "greyring": round(gr, 4),
            "fails": fails}


def candidates(root=REPO):
    """Every cut-out under assets/: WebP/PNG with alpha, not a background, a rough, a @2x or a thumbnail."""
    out = []
    base = os.path.join(root, "assets")
    for d, dirs, files in os.walk(base):
        rel = os.path.relpath(d, root).replace(os.sep, "/")
        dirs[:] = [x for x in dirs if x not in ("rough", "old", "src", "sources")]
        if rel.startswith("assets/characters/hands"):  # parked (H13): no game page draws them
            continue
        if "/bg" in rel + "/" or rel.startswith("assets/backgrounds") or rel.startswith("assets/clinic/rooms"):
            continue
        for f in files:
            if not f.lower().endswith((".webp", ".png")) or "@2x" in f or "thumb" in f:
                continue
            p = os.path.join(d, f)
            try:
                with Image.open(p) as im:
                    if im.mode not in ("RGBA", "LA", "PA") and not (im.mode == "P" and "transparency" in im.info):
                        continue
            except Exception:
                continue
            out.append(p)
    return sorted(out)


def cached(paths):
    cp = os.path.join(tempfile.gettempdir(), "njg-artpixels-cache.json")
    try:
        cache = json.load(open(cp))
    except Exception:
        cache = {}
    res, dirty = {}, False
    for p in paths:
        h = hashlib.sha1(open(p, "rb").read()).hexdigest() + str(RULES["v"])
        if cache.get(p, {}).get("h") != h:
            try:
                cache[p] = {"h": h, "r": analyse(p)}
            except Exception as e:  # one bad file never stops the scan
                cache[p] = {"h": h, "r": {"fails": ["unreadable: %s" % e], "glass": False, "covered": 0}}
            dirty = True
        res[p] = cache[p]["r"]
    if dirty:
        try:
            json.dump(cache, open(cp, "w"))
        except Exception:
            pass
    return res


def sheet(paths, out, cell=220):
    from PIL import ImageDraw
    cols = min(6, max(1, len(paths)))
    rows = (len(paths) + cols - 1) // cols
    W, H = cell * cols, (cell + 16) * rows
    sh = Image.new("RGB", (W * 2 + 8, H), (255, 255, 255))
    for half, bg in enumerate([(247, 238, 220), (24, 26, 36)]):
        part = Image.new("RGB", (W, H), bg)
        d = ImageDraw.Draw(part)
        for i, p in enumerate(paths):
            im = Image.open(p).convert("RGBA")
            im.thumbnail((cell - 8, cell - 8))
            x, y = (i % cols) * cell, (i // cols) * (cell + 16)
            part.paste(im, (x + (cell - im.width) // 2, y + 14 + (cell - im.height) // 2), im)
            d.text((x + 3, y + 1), os.path.basename(p)[:34], fill=(0, 0, 0) if half == 0 else (230, 230, 230))
        sh.paste(part, (half * (W + 8), 0))
    sh.save(out)


def main(argv):
    if "--sheet" in argv:
        i = argv.index("--sheet")
        sheet(argv[i + 2:], argv[i + 1])
        return 0
    if "--scan" in argv:
        res = cached(candidates())
        if "--json" in argv:
            print(json.dumps({os.path.relpath(p, REPO).replace(os.sep, "/"): r["fails"] for p, r in res.items()}))
        else:
            bad = {p: r for p, r in res.items() if r["fails"]}
            for p, r in bad.items():
                print("FAIL %s: %s" % (os.path.relpath(p, REPO), "; ".join(r["fails"])))
            print("artpixels: %d cut-outs, %d fail" % (len(res), len(bad)))
        return 0
    files = []
    for a in [x for x in argv if not x.startswith("-")]:  # a folder stands for its images (no @2x), so a whole cut checks in one call
        if os.path.isdir(a):
            files += sorted(os.path.join(d, f) for d, _, fs in os.walk(a) for f in fs if f.lower().endswith((".webp", ".png")) and "@2x" not in f)
        else:
            files.append(a)
    if not files:
        print(__doc__)
        return 2
    if "--json" in argv:  # {file: result} for the files named (the tests use this)
        res = {p: analyse(p) for p in files}
        print(json.dumps(res))
        return 1 if any(r["fails"] for r in res.values()) else 0
    bad = 0
    for p in files:
        r = analyse(p)
        bad += bool(r["fails"])
        print("%s %s%s" % ("FAIL" if r["fails"] else "PASS", p, ("  " + "; ".join(r["fails"])) if r["fails"] else "  (%s grey %.3f rim %.1f halo %.3f)" % ("glass" if r["glass"] else "solid", r.get("grey", 0), r.get("rim", 0), r.get("halo", 0))))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
