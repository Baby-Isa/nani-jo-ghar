#!/usr/bin/env python3
"""Girl hand set, made in code from the master hands (hands v1, 24 Sept 2026).

The image API redrew the hands when asked to reskin them (39 of 47 failed
the outline drift check), so the girl set is built here instead:

1. Sleeve: on each passing master, the cream linen sleeve is masked and
   recoloured to a soft dusty pink, keeping its shading. The hand pixels
   are untouched, so every tool gap and outline matches the master exactly.
2. Bangles: never painted in. Three thin glass bangles (red, green, gold)
   are drawn as separate sprites, each split into a back half (drawn behind
   the arm) and a front half (drawn over it), in two ellipse shapes: one for
   eye-level hands (ring seen from a little above) and one for top-down
   hands (ring seen nearly edge-on).
3. Wrists: for every master, each arm's wrist point, arm angle and wrist
   width are measured and written to data/hand-wrists.json, so the game can
   place the bangle sprites (and later a mehndi overlay, or Nani-style
   jewellery) on any hand.
4. A contact sheet of the girl set with the bangles drawn from that data,
   which also checks the data by eye.

    python3 build/reskin_hands.py            # everything
    python3 build/reskin_hands.py --only hand-a1-flat-palm-t,hand-e1-thumbs-up-e

Girl-Eid (mehndi) is not made yet: a mehndi overlay pattern will be drawn
separately and placed with the same wrist data.
"""
import argparse
import json
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402

GAME = ga.GAME
H = "assets/characters/hands"
REVIEW = os.path.join(GAME, "build", "reports", "data", "hands-master-v2-review.json")
WRISTS = os.path.join(GAME, "data", "hand-wrists.json")
BANGLE_DIR = os.path.join(GAME, H, "bangles")
SHEET = os.path.join(GAME, "build", "contact-sheets", "hands-girl.png")

# Wrists the automatic finder misses (read off a grid by eye; "manual": true
# in the data). Listed arms are added to what the finder found, by x order.
MANUAL_WRISTS = {
    "hand-b2-vertical-grip-e": [{"x": 753, "y": 767, "angle_deg": -28, "wrist_px": 250}],
    "hand-d4-squeeze-f2-tight-t": [{"x": 506, "y": 720, "angle_deg": 0, "wrist_px": 250}],
    "hand-e7-shrug-e": [{"x": 606, "y": 941, "angle_deg": 38, "wrist_px": 240}],
    "hand-c5-two-hand-fold-t": [{"x": 1102, "y": 918, "angle_deg": -24, "wrist_px": 245}],
    "hand-e4-clap-f2-together-e": [{"x": 560, "y": 716, "angle_deg": -8, "wrist_px": 240}],
}

SLEEVE_PINK = "#D9A5A0"  # soft dusty pink (orchestrator, 24 Sept 2026)

# Bangle sprites are drawn for a wrist BANGLE_REF_WRIST px wide; the game
# scales them by (wrist_px / BANGLE_REF_WRIST).
BANGLE_REF_WRIST = 200
BANGLES = {  # name: (base colour, highlight colour)
    "red": ((200, 38, 48), (255, 170, 170)),
    "green": ((40, 150, 70), (170, 240, 180)),
    "gold": ((214, 168, 72), (255, 236, 170)),
}
BANGLE_SHAPES = {"e": 0.34, "t": 0.14}  # ellipse height / width, by camera
BANGLE_SPACING = 13  # px between neighbouring bangles along the arm, at the reference wrist


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
        # the lit side of the roll: light (L > 70), low-chroma (< 30) pixels
        # within 70 px of the sleeve found so far; lit skin is chroma 34+
        L_, C_ = lab[..., 0], np.hypot(ab[..., 0], ab[..., 1])
        lit_cuff = opaque & (L_ > 70) & (C_ < 30) & ga._dilate(region, 70)
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
    soft = np.asarray(Image.fromarray((region * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.2))) / 255.0
    return soft * (rgba[..., 3] > 0)


def recolour_sleeve(im, target_hex=SLEEVE_PINK):
    """Recolour the sleeve to target_hex, keeping its shading: each pixel's
    lightness keeps its offset from the sleeve's median lightness; chroma
    and hue become the target's, a little stronger in the shadows."""
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    w = sleeve_region(im)
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


# ---------------------------------------------------------------------------
# Bangle sprites
# ---------------------------------------------------------------------------

def draw_bangle(colour, highlight, ratio, ss=4):
    """One thin glass bangle as (back_half, front_half) RGBA sprites of the
    same size; the ring's centre is the sprite's centre. Drawn for a wrist
    BANGLE_REF_WRIST px wide, supersampled for smooth edges."""
    rx = BANGLE_REF_WRIST * 0.58
    ry = max(rx * ratio, 6)
    thick = 7.0
    W, Hh = int(2 * rx + 4 * thick), int(2 * ry + 4 * thick)
    big = (W * ss, Hh * ss)
    cx, cy = big[0] / 2, big[1] / 2

    def ring(col, alpha, grow=0.0, width=thick, dy=0.0):
        layer = Image.new("RGBA", big, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        box = [cx - (rx + grow) * ss, cy - (ry + grow) * ss + dy * ss,
               cx + (rx + grow) * ss, cy + (ry + grow) * ss + dy * ss]
        d.ellipse(box, outline=col + (alpha,), width=max(1, int(width * ss)))
        return layer

    img = ring(tuple(int(c * 0.72) for c in colour), 235)            # body, shaded
    img.alpha_composite(ring(colour, 225, grow=-0.8, width=thick - 2.5))  # body, lit
    img.alpha_composite(ring(highlight, 200, grow=-0.6, width=1.6, dy=-1.6))  # glassy highlight
    img = img.resize((W, Hh), Image.LANCZOS)
    arr = np.asarray(img).copy()
    back, front = arr.copy(), arr.copy()
    back[Hh // 2:] = 0     # upper arc: behind the arm
    front[:Hh // 2] = 0    # lower arc: over the arm
    return Image.fromarray(back, "RGBA"), Image.fromarray(front, "RGBA")


def make_bangles():
    os.makedirs(BANGLE_DIR, exist_ok=True)
    made = {}
    for cam, ratio in BANGLE_SHAPES.items():
        for name, (col, hi) in BANGLES.items():
            back, front = draw_bangle(col, hi, ratio)
            for half, im in (("back", back), ("front", front)):
                rel = f"{H}/bangles/bangle-{name}-{cam}-{half}.png"
                im.save(os.path.join(GAME, rel))
                made[f"{name}-{cam}-{half}"] = rel
    return made


def place_bangles(hand, wrists, camera, sprites):
    """Composite the three bangles onto a hand image using its wrist data
    (what the game will do): back halves under the hand, front halves over
    it, stacked along the arm."""
    base = Image.new("RGBA", hand.size, (0, 0, 0, 0))
    over = Image.new("RGBA", hand.size, (0, 0, 0, 0))
    for w in wrists:
        k = w["wrist_px"] / BANGLE_REF_WRIST
        a = math.radians(w["angle_deg"])
        along = np.array([math.sin(a), -math.cos(a)])  # towards the hand
        for j, name in enumerate(("red", "green", "gold")):
            off = (j - 1) * BANGLE_SPACING * k
            cx, cy = w["x"] + along[0] * off, w["y"] + along[1] * off
            for half, layer in (("back", base), ("front", over)):
                sp = sprites[f"{name}-{camera}-{half}"]
                sp = sp.resize((max(1, round(sp.width * k)), max(1, round(sp.height * k))), Image.LANCZOS)
                sp = sp.rotate(-w["angle_deg"], resample=Image.BICUBIC, expand=True)
                layer.alpha_composite(sp, (int(round(cx - sp.width / 2)), int(round(cy - sp.height / 2))))
    out = base
    out.alpha_composite(hand)
    out.alpha_composite(over)
    return out


# ---------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--only", help="comma-separated master ids (default: every passing master)")
    args = p.parse_args()

    review = json.load(open(REVIEW))
    data = ga.load_asset_list(ga.DEFAULT_ASSET_LIST)
    masters = [a for a in data["assets"] if a.get("group") == "hands-master"]
    passing = [m for m in masters if review.get(m["id"], "").startswith("PASS")]
    todo = passing if not args.only else [m for m in passing if m["id"] in args.only.split(",")]

    wrists = json.load(open(WRISTS)) if os.path.exists(WRISTS) else {}
    wrists.pop("_readme", None)
    made = make_bangles()
    sprites = {k: Image.open(os.path.join(GAME, v)).convert("RGBA") for k, v in made.items()}

    os.makedirs(os.path.join(GAME, H, "girl"), exist_ok=True)
    tiles = []
    for m in (todo if args.only else masters):
        mid = m["id"]
        src = ga.resolve_path(m["output"])
        master = Image.open(src).convert("RGBA")
        cam = m.get("camera", mid[-1]).lower()
        if m in todo or mid not in wrists:
            arms = find_wrists(master)
            for extra in MANUAL_WRISTS.get(mid, []):
                arms.append(dict(extra, manual=True))
            arms.sort(key=lambda r: r["x"])
            wrists[mid] = {"camera": cam, "size": list(master.size), "arms": arms}
        if m not in passing:
            continue
        gid = mid.replace("hand-", "hand-girl-", 1)
        out_rel = f"{H}/girl/{gid}.png"
        if m in todo:
            girl, info = recolour_sleeve(master)
            girl.save(os.path.join(GAME, out_rel))
            print(f"[{gid}] sleeve {info.get('sleeve_px', 0)} px; wrists "
                  f"{[(a['x'], a['y'], a['angle_deg'], a['wrist_px']) for a in wrists[mid]['arms']]}", flush=True)
        girl = Image.open(os.path.join(GAME, out_rel)).convert("RGBA")
        tiles.append((gid, place_bangles(girl, wrists[mid]["arms"], cam, sprites), len(wrists[mid]["arms"])))

    wrists_out = {"_readme": (
        "Wrist position per master hand image (hands v1), written by build/reskin_hands.py. "
        "x, y: pixels in that image (size given), where the bangles' centre goes; angle_deg: arm direction, "
        "0 = hand points up the frame, positive = clockwise (rotate the bangle sprites by this); wrist_px: "
        "arm width there (scale bangle sprites by wrist_px / %d). Bangle sprites: %s/bangles/"
        "bangle-{red,green,gold}-{e,t}-{back,front}.png, back half drawn under the hand, front half over it, "
        "stacked %d px apart along the arm (at the reference wrist). Girl images share their master's canvas, "
        "so the same numbers apply. The girl hand = the master with the sleeve recoloured." % (
            BANGLE_REF_WRIST, H, BANGLE_SPACING))}
    wrists_out.update({k: wrists[k] for k in sorted(wrists)})
    with open(WRISTS, "w") as f:
        json.dump(wrists_out, f, indent=1)
        f.write("\n")

    contact_sheet(tiles)
    print(f"wrote {len(tiles)} girl hands, {len(made)} bangle sprites, {WRISTS}, {SHEET}")


def contact_sheet(tiles, thumb=220, cols=8, label_h=24):
    rows = (len(tiles) + cols - 1) // cols
    zoom = (thumb - 8) / max(max(im.size) for _, im, _ in tiles)
    sheet = Image.new("RGB", (cols * thumb, rows * (thumb + label_h)), (40, 40, 40))
    d = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for i, (gid, im, n_arms) in enumerate(tiles):
        r, c = divmod(i, cols)
        x0, y0 = c * thumb, r * (thumb + label_h)
        fit = im.resize((max(1, round(im.width * zoom)), max(1, round(im.height * zoom))), Image.LANCZOS)
        bg = ga.checkerboard((thumb, thumb))
        bg.paste(fit, ((thumb - fit.width) // 2, thumb - fit.height), fit)
        sheet.paste(bg, (x0, y0))
        label = gid.replace("hand-girl-", "")
        col = (235, 235, 235) if n_arms else (240, 110, 110)
        d.text((x0 + 4, y0 + thumb + 4), label[:34] + ("" if n_arms else " NO WRIST"), fill=col, font=font)
    os.makedirs(os.path.dirname(SHEET), exist_ok=True)
    sheet.save(SHEET)


if __name__ == "__main__":
    main()
