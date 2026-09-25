#!/usr/bin/env python3
"""Masks and measurements on the master hand images (hands v1), used by
build/skin_hands.py: the sleeve mask (sleeve_mask_grown, sleeve_region),
sleeve recolouring (recolour_sleeve) and the automatic wrist finder
(find_wrists, with MANUAL_WRISTS for the arms it misses)."""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402

GAME = ga.GAME
H = "assets/characters/hands"

# Wrists the automatic finder misses (read off a grid by eye; "manual": true
# in the data). Listed arms are added to what the finder found, by x order.
MANUAL_WRISTS = {
    "hand-b2-vertical-grip-e": [{"x": 753, "y": 767, "angle_deg": -28, "wrist_px": 250}],
    "hand-d4-squeeze-f2-tight-t": [{"x": 506, "y": 720, "angle_deg": 0, "wrist_px": 250}],
    "hand-e5-arm-up-fist-e": [{"x": 506, "y": 720, "angle_deg": 0, "wrist_px": 250}],  # v2: a copy of d4-f2-tight
    "hand-e7-shrug-e": [{"x": 606, "y": 941, "angle_deg": 38, "wrist_px": 240}],
    "hand-c5-two-hand-fold-t": [{"x": 1102, "y": 918, "angle_deg": -24, "wrist_px": 245}],
    "hand-e4-clap-f2-together-e": [{"x": 560, "y": 716, "angle_deg": -8, "wrist_px": 240}],
}

SLEEVE_PINK = "#D9A5A0"  # soft dusty pink (orchestrator, 24 Sept 2026)



# ---------------------------------------------------------------------------
# Sleeve
# ---------------------------------------------------------------------------

def _edge_components(mask, min_px=3000):
    """Large components touching the frame edge (where the arm leaves the
    picture); if none does (a cuff drawn whole, e.g. A7), the largest one."""
    out = np.zeros_like(mask)
    comps = ga._components(mask, min_px)
    for comp in comps:
        if comp[:6].any() or comp[-6:].any() or comp[:, :6].any() or comp[:, -6:].any():
            out |= comp
    if not out.any() and comps:
        out = comps[0]
    return out


def sleeve_mask_grown(im, cream_ref=True, skin_highlights=True):
    """Boolean sleeve mask, per image: cuff colours overlap pale lit skin in
    chroma (both ~30-35) and differ only a little in hue, so no fixed
    threshold works for every master. Instead the cuff's colour is sampled
    where the arm leaves the frame (opaque pixels within 30 px of the
    bottom, left or right edge), the skin's from the hand's skin core, and
    each pixel goes to the nearer of the two in the Lab a-b plane
    (lightness is left out: both are shaded). Sleeve areas touching the
    frame edge are kept, with fold shadows filled. Falls back to the fixed
    cream test when no cuff reaches the edge (A7's whole cuff)."""
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    opaque = rgba[..., 3] > 16
    lab = ga.rgb_to_lab(rgba[..., :3])
    ab = lab[..., 1:]
    edge = np.zeros_like(opaque)
    edge[-30:] = True
    edge[:, :30] = True
    edge[:, -30:] = True
    edge &= rgba[..., 3] > 200
    skin_w, _ = ga.skin_weight(im)
    core_skin = (skin_w > 0.8) & (rgba[..., 3] > 240)
    if edge.sum() < 500 or core_skin.sum() < 500:
        seed = ga.sleeve_mask(im)
    else:
        cuff_ab = np.median(ab[edge & (lab[..., 0] > 55)], axis=0) if (edge & (lab[..., 0] > 55)).sum() > 200 \
            else np.median(ab[edge], axis=0)
        # skin gets two references, its midtone and its highlights (the
        # lightest 15% of the skin core), so pale lit skin stays skin
        skin_ab = np.median(ab[core_skin], axis=0)
        Ls = lab[..., 0][core_skin]
        hi = core_skin & (lab[..., 0] >= np.percentile(Ls, 85))
        skin_hi_ab = np.median(ab[hi], axis=0)
        # the cuff roll is often whiter than the sleeve body sampled at the
        # edge: a fixed cream-white reference (Lab a 4, b 15) covers it
        d_cuff = np.linalg.norm(ab - cuff_ab, axis=-1)
        if cream_ref:
            d_cuff = np.minimum(d_cuff, np.linalg.norm(ab - np.array([4.0, 15.0]), axis=-1))
        d_skin = np.linalg.norm(ab - skin_ab, axis=-1)
        if skin_highlights:
            d_skin = np.minimum(d_skin, np.linalg.norm(ab - skin_hi_ab, axis=-1))
        seed = opaque & (d_cuff < d_skin) & (lab[..., 0] > 35)
    grown = ga._dilate(seed, 6) & opaque
    region = _edge_components(grown)
    # the rolled cuff is often split from the sleeve body by its shadow
    # line: add large seed areas lying within 30 px of the body
    near = ga._dilate(region, 30)
    for comp in ga._components(grown, 3000):
        if (comp & near).any():
            region |= comp
    region &= ga._dilate(seed, 6)
    if cream_ref:
        # the lit and the shaded side of the roll: light low-chroma pixels, or
        # yellow-hued (69+) low-chroma ones, within 70 px of the sleeve found so
        # far (skin is hue ~55-66 and, where lit, chroma 34+)
        L_, C_ = lab[..., 0], np.hypot(ab[..., 0], ab[..., 1])
        hue_ = np.degrees(np.arctan2(ab[..., 1], ab[..., 0]))
        lit_cuff = opaque & ga._dilate(region, 70) & (((L_ > 70) & (C_ < 30)) | ((L_ > 45) & (C_ < 35) & (hue_ >= 69)))
        for comp in ga._components(lit_cuff, 300):
            if (comp & ga._dilate(region, 8)).any():
                region |= comp
        # pieces of the cuff cut off from the sleeve body by a shadow line:
        # non-skin pixels in large blobs touching the region
        not_skin = opaque & (skin_w < 0.45)
        for comp in ga._components(not_skin & ga._dilate(region, 60), 800):
            if (comp & ga._dilate(region, 6)).any():
                region |= comp
    small = Image.fromarray((region[::4, ::4] * 255).astype(np.uint8), "L")
    shut = np.asarray(small.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))) > 0
    return np.kron(shut, np.ones((4, 4), dtype=bool))[:region.shape[0], :region.shape[1]] & opaque


def sleeve_region(im):
    """Soft 0..1 version of sleeve_mask_grown, feathered by a pixel."""
    rgba = np.asarray(im.convert("RGBA"))
    region = sleeve_mask_grown(im).astype(np.float64)
    # the mask is built on a coarse grid: cut it back at full resolution
    # wherever the pixel itself reads as skin, so it never spills onto the arm
    skin_w, lab = ga.skin_weight(im)
    chroma = np.hypot(lab[..., 1], lab[..., 2])  # the cuff is chroma <= ~33 (shaded side), lit skin 34+
    region *= 1 - np.clip((skin_w - 0.5) * 3.0, 0, 1) * np.clip((chroma - 33) / 4.0, 0, 1)
    soft = np.asarray(Image.fromarray((region * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.2))) / 255.0
    return soft * (rgba[..., 3] > 0)


def recolour_sleeve(im, target_hex=SLEEVE_PINK, weight=None):
    """Recolour the sleeve to target_hex, keeping its shading: each pixel's
    lightness keeps its offset from the sleeve's median lightness; chroma
    and hue become the target's, a little stronger in the shadows."""
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    w = sleeve_region(im) if weight is None else weight  # pass the master's weight when im is already recoloured
    if w.sum() < 2000:
        return im, {"sleeve_px": 0, "action": "no sleeve found"}
    lab = ga.rgb_to_lab(rgba[..., :3])
    L = lab[..., 0]
    core = w > 0.8
    mL = np.median(L[core])
    t = ga.rgb_to_lab(ga.hex_to_rgb(target_hex))
    tC, th = np.hypot(t[1], t[2]), np.arctan2(t[2], t[1])
    L2 = t[0] + (L - mL) * 0.95
    C2 = tC * np.clip(1.0 + (mL - L) / 120.0, 0.8, 1.35)
    new = ga.lab_to_rgb(np.stack([L2, C2 * np.cos(th), C2 * np.sin(th)], axis=-1))
    rgba[..., :3] = rgba[..., :3] * (1 - w[..., None]) + new * w[..., None]
    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA"), {"sleeve_px": int(core.sum())}


# ---------------------------------------------------------------------------
# Wrists
# ---------------------------------------------------------------------------

def _cross_section(pts, origin, axis, normal, t, half=5, centre_hint=None):
    """Width and centre of the arm across `axis` at distance t from origin:
    the run of occupied 2 px bins (in the normal direction) through the
    centre hint (or the median)."""
    along = (pts - origin) @ axis
    sel = pts[np.abs(along - t) <= half]
    if len(sel) < 20:
        return None, None
    proj = (sel - origin) @ normal
    lo, hi = proj.min(), proj.max()
    bins = np.arange(lo - 2, hi + 4, 2)
    hist, edges = np.histogram(proj, bins=bins)
    filled = hist > 0
    c = np.median(proj) if centre_hint is None else centre_hint
    i = int(np.clip(np.searchsorted(edges, c) - 1, 0, len(filled) - 1))
    if not filled[i]:
        return None, None
    a = b = i
    while a > 0 and filled[a - 1]:
        a -= 1
    while b < len(filled) - 1 and filled[b + 1]:
        b += 1
    return float(edges[b + 1] - edges[a]), float((edges[b + 1] + edges[a]) / 2)


def find_wrists(im, variant=0):
    """For each sleeve (arm) in the image: the wrist point (x, y), the arm's
    angle (degrees; 0 = the hand points straight up the frame, positive =
    turned clockwise), and the wrist width in px. The arm is the skin
    leaving the sleeve; its direction is the principal axis of the skin
    30-100 px beyond the cuff; the wrist is the narrowest point of the arm
    between the cuff and the flare of the hand."""
    rgba = np.asarray(im.convert("RGBA"))
    opaque = rgba[..., 3] > 128
    cream = sleeve_mask_grown(im, cream_ref=False, skin_highlights=(variant == 0))
    sleeves = ga._components(ga._dilate(cream, 24) & cream, 3000)
    skin_w, _ = ga.skin_weight(im)
    skin = opaque & (skin_w > 0.4) & ~ga._dilate(cream, 4)  # not just 'not sleeve': sleeve shadows stay out
    yy, xx = np.nonzero(skin)
    pts = np.stack([xx, yy], axis=1).astype(float)
    out = []
    for sl in sleeves[:2]:
        exit_ = skin & ga._dilate(sl, 40)
        ring = skin & ga._dilate(sl, 100) & ~ga._dilate(sl, 30)
        if exit_.sum() < 200 or ring.sum() < 500:
            continue
        ey, ex = np.nonzero(exit_)
        start = np.array([ex.mean(), ey.mean()])
        ry, rx = np.nonzero(ring)
        rp = np.stack([rx, ry], axis=1).astype(float)
        axis = rp.mean(axis=0) - start
        axis /= np.linalg.norm(axis) + 1e-9
        normal = np.array([-axis[1], axis[0]])
        widths, centres, ts = [], [], []
        hint = 0.0
        for t in range(10, 460, 8):
            w, c = _cross_section(pts, start, axis, normal, t, centre_hint=hint)
            if w is None:
                break
            widths.append(w); centres.append(c); ts.append(t)
            hint = c
        if len(widths) < 3:
            continue
        widths = np.array(widths)
        # the wrist: the narrowest point between the cuff and the widest part
        # of the hand (skipping the first and last bits of that stretch)
        j = int(np.argmax(widths))
        lo, hi = int(0.2 * j), max(int(0.85 * j), int(0.2 * j) + 1)
        i = lo + int(np.argmin(widths[lo:hi]))
        t_w = max(ts[0], ts[i] - 0.12 * widths[i])  # bangles sit a little up the arm
        p = start + axis * t_w + normal * centres[i]
        angle = math.degrees(math.atan2(axis[0], -axis[1]))
        out.append({"x": round(float(p[0]), 1), "y": round(float(p[1]), 1),
                    "angle_deg": round(angle, 1), "wrist_px": round(float(widths[i]), 1)})
    out.sort(key=lambda r: r["x"])
    if variant == 0 and len(out) < min(len(sleeves), 2):
        alt = find_wrists(im, variant=1)  # the simpler classifier finds some arms this one misses
        if len(alt) > len(out):
            return alt
    return out
