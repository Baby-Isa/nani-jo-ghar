#!/usr/bin/env python3
"""Code-based hand skinning (hands v1, 25 Sept 2026).

No more hand images from the image API: every character's hands are made
here from the approved master set (the 47 passing masters in
build/reports/data/hands-master-v2-review.json).

For each master pose and each character in data/hand-skins.json:
  (a) skin: the masked skin is recoloured to the character's tone (skin
      only; the sleeve, nails' own hue and the tool gaps are untouched);
  (b) sleeve: the cream linen sleeve is masked and recoloured to the
      character's sleeve colour, keeping its shading (boy: as is);
  (c) jewellery: sprites drawn in code (rings, tennis bracelet, bangles) are
      composited at the pose's anchors in data/hand-anchors.json: each
      hand's ring-finger point and angle and its wrist point, angle and
      width;
  (d) overlay: an optional texture (mehndi) masked to the back of the hand.

Outputs: assets/characters/hands/skins/<character>/<pose>.webp (lossless),
plus <pose>-left.webp for characters whose left hand needs different
jewellery (Nani: the left hand is the master mirrored, with the diamond
ring instead of the aqiq and no bracelet). The jewellery sprites are also
saved on their own (skins/jewellery/) so the game can animate them at the
anchors later. One contact sheet per character, with the anchors drawn on
a separate check sheet.

    python3 build/skin_hands.py                      # every character, every pose
    python3 build/skin_hands.py --only nani --poses hand-a1-flat-palm-t
    python3 build/skin_hands.py --measure-wrists     # re-run the wrist finder into the anchors file
    python3 build/skin_hands.py --check-sheet        # anchors drawn on the masters, for review

Anchor convention (data/hand-anchors.json): pixel coordinates in the master
image; angle_deg is the direction the finger (ring) or the hand (wrist)
points, 0 = up the frame, positive = clockwise. A ring view is "back"
(stone on top), "palm" or "side" (band only). Ring anchors were read off
gridded views of each master by eye and checked on the check sheet.
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
import hand_masks as hm  # noqa: E402
import hand_jewellery3d as j3  # noqa: E402

GAME = ga.GAME
H = "assets/characters/hands"
REVIEW = os.path.join(GAME, "build", "reports", "data", "hands-master-v2-review.json")
ANCHORS = os.path.join(GAME, "data", "hand-anchors.json")
SKINS = os.path.join(GAME, "data", "hand-skins.json")
OUT = os.path.join(GAME, H, "skins")
SHEETS = os.path.join(GAME, "build", "contact-sheets")

REF_WRIST = 200  # jewellery sprites are drawn for a wrist this wide; scaled by wrist_px / REF_WRIST
FINGER_OF_WRIST = 0.27  # ring-finger width as a share of the wrist width


# ---------------------------------------------------------------------------
# Jewellery (hands v3: ray-cast 3D, build/hand_jewellery3d.py)
# ---------------------------------------------------------------------------

def jewellery_sprites():
    """Loose 3D-rendered sprites for the game to animate at the anchors,
    saved to skins/jewellery/: rings on an invisible finger (the finger
    still hides the back of the band) for each stone and view, and wrist
    pieces as -front (what shows over the arm) and -back (the parts that
    peep out behind it) for each camera. Drawn for a 54 px finger and a
    200 px wrist."""
    jd = os.path.join(OUT, "jewellery")
    os.makedirs(jd, exist_ok=True)
    for f in os.listdir(jd):
        if f.endswith(".png"):
            os.remove(os.path.join(jd, f))
    out = {}
    fw = RING_FW
    for kind in ("aqiq", "diamond"):
        for view in ("back", "palm", "side"):
            prims, _, _ = j3.ring_prims(fw, fw, 0.0, fw, kind, view)
            out[f"ring-{kind}-{view}"] = _to_img(j3.render(prims, (0, 0, 2 * fw, 2 * fw)))
    for name, style in (("tennis-bracelet", "tennis"), ("bangles-glass", ["glass_red", "glass_green", "gold"])):
        for cam in ("e", "t"):
            c = REF_WRIST
            prims, _, _ = j3.wrist_prims(c, c, 0.0, REF_WRIST, style, cam)
            box = (0, 0, 2 * c, 2 * c)
            front = j3.render(prims, box)
            full = j3.render([p for p in prims if p.mat != "occ"], box)
            back = full.copy()
            back[..., 3] = np.clip(full[..., 3] - front[..., 3], 0, 1)
            out[f"{name}-{cam}-front"] = _to_img(front)
            out[f"{name}-{cam}-back"] = _to_img(back)
    for k, im in out.items():
        bb = im.getbbox()
        (im.crop(bb) if bb else im).save(os.path.join(jd, f"{k}.png"))
    return out


def _to_img(rgba):
    return Image.fromarray(np.clip(rgba * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA")


RING_FW = REF_WRIST * FINGER_OF_WRIST  # the finger width the loose ring sprites are drawn for


# Where a hand's jewellery passes behind the other arm (master pixels): its
# wrist items are hidden inside these polygons. e4-f2: the rear (left)
# wrist lies behind the front forearm.
OCCLUDERS = {"hand-e4-clap-f2-together-e": {"left": [[(452, 560), (700, 560), (722, 900), (770, 1024),
                                                      (478, 1024), (470, 900), (448, 700)]]}}


def clear_of_sleeve(anchor, sleeve, style, camera):
    """Move a wrist anchor up the arm (towards the hand) until the wrist
    piece's lower edge clears the sleeve: bangles stack towards the elbow
    and the ellipse of each drops below its centre line by about
    R sin(tilt), so without this they can lie on the cuff (b1, b3)."""
    if sleeve is None:
        return anchor
    W = anchor["width_px"]
    reach = (0.47 if style != "tennis" else 0.17) * W + (0.03 * W if camera == "e" else 0.0)
    a = math.radians(anchor["angle_deg"])
    ax, ay = math.sin(a), -math.cos(a)  # towards the hand
    px, py = math.cos(a), math.sin(a)
    H_, W_ = sleeve.shape
    out = dict(anchor)
    for _ in range(40):
        bx, by = out["x"] - ax * reach, out["y"] - ay * reach
        vals = []
        for u in np.linspace(-0.35, 0.35, 15) * W:
            xi, yi = int(round(bx + px * u)), int(round(by + py * u))
            if 0 <= xi < W_ and 0 <= yi < H_:
                vals.append(sleeve[yi, xi])
        if not vals or np.mean(vals) < 0.15:
            break
        out["x"], out["y"] = out["x"] + ax * 4, out["y"] + ay * 4
    return out


def place_jewellery(hand_img, hands, items, camera, pose_id=None, mirrored=False, sleeve=None):
    """Composite 3D jewellery onto a hand image. hands: the pose's hand
    anchors (already mirrored if the image is); items: {"right": [...],
    "left": [...]} from the character, each {"type": "ring", "stone":
    "aqiq"|"diamond"} or {"type": "wrist", "style": "tennis" | [bangle
    materials]}.

    Rings sit at the ring anchor (hands v2 landmark placement), scaled to
    the measured finger width, turned to the finger's first segment and
    tipped out of the picture plane by its curl; the view (back / palm /
    side) turns the stone to the camera, behind the finger or onto its
    edge; 'hidden' draws nothing. Wrist pieces sit at the bracelet anchor
    (wrist anchor as a fallback), re-measured across the silhouette."""
    alpha = np.asarray(hand_img.convert("RGBA"))[..., 3]
    jobs = []
    for hand in hands:
        wrist = hand.get("bracelet") or hand.get("wrist")
        for it in items.get(hand["side"], []):
            if it["type"] == "wrist" and wrist:
                job = j3.wrist_item(alpha, clear_of_sleeve(wrist, sleeve, it["style"], camera), it["style"], camera)
                side = hand["side"]
                if mirrored:
                    side = "left" if side == "right" else "right"
                polys = OCCLUDERS.get(pose_id, {}).get(side, [])
                if polys:
                    pm = Image.new("L", hand_img.size, 0)
                    for poly in polys:
                        ImageDraw.Draw(pm).polygon([((hand_img.width - 1 - x) if mirrored else x, y) for x, y in poly], fill=255)
                    job["hide"] = np.asarray(pm) > 0
                jobs.append(job)
            elif it["type"] == "ring":
                r = hand.get("ring") or {}
                if r.get("view") in (None, "hidden") or "x" not in r:
                    continue
                jobs.append(j3.ring_item(r, it["stone"], r["view"], r.get("facing", 0.0), r.get("curl_deg", 0.0)))
    return j3.composite(hand_img, jobs) if jobs else hand_img


# ---------------------------------------------------------------------------
# Skin, sleeve, overlay
# ---------------------------------------------------------------------------

def back_of_hand_mask(im, hands):
    """Soft mask of the back of each hand whose ring view is 'back': skin
    within ~1.5 wrist widths beyond the wrist, along the arm."""
    w, _ = ga.skin_weight(im)
    H_, W_ = w.shape
    yy, xx = np.mgrid[0:H_, 0:W_]
    m = np.zeros_like(w)
    for hand in hands:
        wr, ring = hand.get("wrist"), hand.get("ring")
        if not wr or not ring or ring["view"] != "back":
            continue
        a = math.radians(wr["angle_deg"])
        ax, ay = math.sin(a), -math.cos(a)
        t = (xx - wr["x"]) * ax + (yy - wr["y"]) * ay
        c = np.hypot(xx - (wr["x"] + ax * wr["width_px"] * 0.8), yy - (wr["y"] + ay * wr["width_px"] * 0.8))
        m = np.maximum(m, (t > wr["width_px"] * 0.1) * (c < wr["width_px"] * 1.5))
    return w * m


def apply_overlay(im, texture_path, hands, opacity=0.85):
    tex = Image.open(texture_path).convert("RGBA")
    tiled = Image.new("RGBA", im.size)
    for y in range(0, im.height, tex.height):
        for x in range(0, im.width, tex.width):
            tiled.paste(tex, (x, y))
    m = back_of_hand_mask(im, hands) * opacity
    arr = np.asarray(im).astype(np.float64)
    t = np.asarray(tiled).astype(np.float64)
    a = (t[..., 3] / 255.0) * m
    arr[..., :3] = arr[..., :3] * (1 - a[..., None]) + (arr[..., :3] * t[..., :3] / 255.0) * a[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")


# Lines (master pixels, x0, y0, x1, y1) along the top edge of a cuff where
# pale forearm skin reads as cream: sleeve weight on the hand's side of the
# line (above it) is dropped, feathered over a few pixels. This replaces
# v1/v2's rectangular erase boxes, which left hard-edged blocks of sleeve
# colour on the forearm.
# Poses whose arms cross or touch, where the per-arm edge fit can't separate
# them: no envelope fill; their cuff lining is given as a polygon instead.
NO_ENVELOPE = {"hand-e4-clap-f2-together-e"}
CUFF_FILL = {"hand-f2-drum-cupped-t": [[(372, 897), (420, 895), (500, 897), (580, 903), (640, 912), (680, 920),
                                        (700, 935), (705, 1024), (300, 1024), (304, 915), (330, 900)]],
             "hand-b5-hook-grip-t": [[(480, 846), (575, 851), (640, 856), (675, 861), (700, 869), (715, 900),
                                      (725, 1024), (480, 1024)]],
             "hand-b2-vertical-grip-e": [[(488, 878), (550, 843), (650, 791), (770, 706), (800, 696), (1024, 696),
                                          (1024, 1024), (488, 1024)]],
             "hand-e4-clap-f2-together-e": [[(250, 770), (292, 784), (342, 806), (400, 842), (468, 876),
                                             (500, 902), (470, 960), (440, 1024), (250, 1024)],
                                            [(486, 908), (560, 887), (640, 868), (702, 853), (740, 858),
                                             (780, 1024), (500, 1024)]]}
CUFF_CAPS = {"hand-a5-wave-f1-e": [(380, 864, 680, 887)],
             "hand-d2-c-hold-e": [(850, 1283, 1000, 1253), (1000, 1253, 1210, 1285)],
             "hand-d6-two-hand-catch-f1-open-e": [(107, 887, 407, 864), (935, 864, 1235, 887)]}  # a5 mirrored (x' = 787 - x) and a5 shifted by +555


def clip_sleeve_to_cuff(w, master, hands):
    """The loose cuff pass in hand_masks can take in pale, lit forearm skin
    just above the cuff. For each arm with a wrist anchor, find the cuff's
    top edge along the arm from unambiguous cuff pixels (cream: chroma < 28,
    hue > 68) and drop sleeve weight beyond it, inside that arm's corridor."""
    arr = np.asarray(master.convert("RGBA")).astype(np.float64)
    lab = ga.rgb_to_lab(arr[..., :3])
    C = np.hypot(lab[..., 1], lab[..., 2])
    hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    core = (arr[..., 3] > 200) & (C < 28) & (hue > 68) & (lab[..., 0] > 60)
    H_, W_ = core.shape
    yy, xx = np.mgrid[0:H_, 0:W_]
    w = w.copy()
    for h in hands:
        wr = h.get("wrist")
        if not wr:
            continue
        a = math.radians(wr["angle_deg"])
        ax, ay = math.sin(a), -math.cos(a)  # towards the hand
        t = (xx - wr["x"]) * ax + (yy - wr["y"]) * ay
        lat = np.abs(-(xx - wr["x"]) * ay + (yy - wr["y"]) * ax)
        corridor = lat < wr["width_px"] * 1.1
        cuff = core & corridor & (t < 0)
        if cuff.sum() < 500:
            continue
        # the cuff's top edge slopes: measure it per 20 px strip across the arm
        side = -(xx - wr["x"]) * ay + (yy - wr["y"]) * ax
        overall = np.percentile(t[cuff], 99.5)
        for lo in np.arange(-wr["width_px"] * 1.1, wr["width_px"] * 1.1, 20):
            strip = corridor & (side >= lo) & (side < lo + 20)
            cs = cuff & strip
            top = np.percentile(t[cs], 99) if cs.sum() > 40 else overall
            w[strip & (t > min(top, overall) + 6)] = 0.0
    # thin tabs of very pale forearm that pass as cream: open the mask
    # (~24 px) at half size; the sleeve itself is far thicker
    half = Image.fromarray(((w[::2, ::2] > 0.5) * 255).astype(np.uint8), "L")
    opened = np.asarray(half.filter(ImageFilter.MinFilter(13)).filter(ImageFilter.MaxFilter(15))) > 0
    keep = np.kron(opened, np.ones((2, 2), dtype=bool))[:w.shape[0], :w.shape[1]]
    keep = np.asarray(Image.fromarray((keep * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.5))) / 255.0
    return w * keep




def _cap(w, lines, width, mirrored):
    H_, W_ = w.shape
    yy, xx = np.mgrid[0:H_, 0:W_]
    for x0, y0, x1, y1 in lines:
        if mirrored:
            x0, x1 = width - 1 - x0, width - 1 - x1
        yl = y0 + (xx - x0) * (y1 - y0) / (x1 - x0)
        inside = (xx >= min(x0, x1) - 40) & (xx <= max(x0, x1) + 40)
        keep = np.clip((yy - yl) / 4.0 + 0.5, 0, 1)
        w = np.where(inside, w * keep, w)
    return w


def sleeve_weight(master, hands, pose_id=None, mirrored=False):
    """Soft 0..1 sleeve mask (hands v3). The colour mask (hand_masks,
    clipped at the cuff's top edge along each arm) misses the cuff's
    warm-shaded sides and its lining, which read as skin: they came out as
    stair-stepped cream patches on the girl and Nani (the b4 cuff sliver
    among them). v3 closes those notches: the mask is morphologically
    closed with a disc about an eighth of the wrist wide and its holes are
    filled, inside the silhouette; the closing can only fill concave bites
    out of the sleeve, never grow it past its straight top edge. Pale
    forearm that reads as cream is cut along CUFF_CAPS lines."""
    from scipy import ndimage
    w = clip_sleeve_to_cuff(hm.sleeve_region(master), master, hands)
    w = _cap(w, CUFF_CAPS.get(pose_id, []), master.width, mirrored)
    solid = np.asarray(master.convert("RGBA"))[..., 3] > 40
    widths = [h["wrist"]["width_px"] for h in hands if h.get("wrist")] or [240]
    r = max(6, int(min(widths) * 0.13 / 2))  # at half resolution
    half = w[::2, ::2] > 0.5
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    disc = (xx * xx + yy * yy) <= r * r
    pad = r + 2
    closed = ndimage.binary_closing(np.pad(half, pad), structure=disc)[pad:-pad, pad:-pad]
    closed = ndimage.binary_fill_holes(closed)
    closed = (np.kron(closed, np.ones((2, 2), dtype=bool))[:w.shape[0], :w.shape[1]] & solid).astype(np.float64)
    # additions (closing, envelope) only where the master pixel could be
    # cloth: the skin's contact crease just above the cuff is warm and
    # saturated, and turned into a stair-stepped band of sleeve colour
    lab = ga.rgb_to_lab(np.asarray(master.convert("RGB")).astype(np.float64))
    C = np.hypot(lab[..., 1], lab[..., 2])
    hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    cloth = ndimage.gaussian_filter(((C < 30) | (hue > 74) | (lab[..., 0] > 84)).astype(np.float64), 1.0)  # the cuff's lit rim is very light
    fringe = None
    if pose_id not in NO_ENVELOPE:
        env, above, fringe, below = _envelope_fill(w, solid, hands, cloth > 0.5)
        closed = np.maximum(closed, env)
        closed[above] = 0.0
        w = np.where(above, 0.0, w)
    # the colour mask's own fringe along the cuff's top edge: lit skin just
    # above the cuff reads C 33-34 at hue ~66 and passes as cuff, a
    # stair-stepped band of sleeve colour on the forearm; there, only
    # cloth-coloured pixels stay sleeve
    if fringe is not None:
        # near the edge, the fitted edge decides: sleeve below it, skin above
        geo = ndimage.gaussian_filter(below.astype(np.float64), 0.8) * solid
        fr = ndimage.gaussian_filter(fringe.astype(np.float64), 1.5)
        w = w * (1 - fr) + geo * fr
        closed = closed * (1 - fr) + geo * fr
    for poly in CUFF_FILL.get(pose_id, []):
        pts = [((master.width - 1 - x) if mirrored else x, y) for x, y in poly]
        pm = Image.new("L", master.size, 0)
        ImageDraw.Draw(pm).polygon(pts, fill=255)
        closed = np.maximum(closed, (np.asarray(pm) > 0) & solid)
    closed = _cap(closed, CUFF_CAPS.get(pose_id, []), master.width, mirrored)
    soft = ndimage.gaussian_filter(closed, 1.0) * solid
    return np.maximum(w, soft)


def _envelope_fill(w, solid, hands, cloth=None):
    """Fill each cuff up to its top edge. The arm's direction is snapped to
    the nearer image axis; across the arm, in 12 px strips, the top of the
    sleeve mask (its furthest point towards the hand) is measured and the
    upper envelope of the strips' tops fitted (a line, then a gentle
    quadratic), rejecting strips that fall short of it (those are the bites
    where the cuff's shaded side read as skin, which is what this fills).
    Everything in the silhouette on the elbow side of the fitted edge, and
    connected to the sleeve, is sleeve; mask spikes well past the edge are
    returned as 'above', to be cut."""
    from scipy import ndimage
    m = w > 0.5
    mc = m if cloth is None else (m & cloth)  # the edge is fitted to cloth-coloured pixels
    H_, W_ = m.shape
    above = np.zeros((H_, W_), bool)
    fringe = np.zeros((H_, W_), bool)
    below = np.zeros((H_, W_), bool)
    yy, xx = np.mgrid[0:H_, 0:W_]
    out = np.zeros((H_, W_), bool)
    for h in hands:
        wr = h.get("wrist")
        if not wr:
            continue
        a = math.radians(wr["angle_deg"])
        ax, ay = math.sin(a), -math.cos(a)
        if abs(ax) > abs(ay):
            t, side, s0 = xx * np.sign(ax), yy, wr["y"]
        else:
            t, side, s0 = yy * np.sign(ay), xx, wr["x"]
        W = wr["width_px"]
        band = np.abs(side - s0) < W * 1.3
        # strip tops, from the mask near this arm
        mm = mc & band
        if mm.sum() < 2000:
            continue
        ss, tt = [], []
        for lo in np.arange(s0 - W * 1.3, s0 + W * 1.3, 12):
            cs = mm & (side >= lo) & (side < lo + 12)
            if cs.sum() > 30:
                ss.append(lo + 6)
                tt.append(np.percentile(t[cs], 99.5))
        if len(ss) < 5:
            continue
        ss, tt = np.array(ss), np.array(tt)
        # upper envelope: a line through the strips first (rejecting the
        # ones that fall short: the bites), then a gentle quadratic through
        # what is left, for the cuff's curved edge
        keep = np.ones(len(ss), bool)
        for _ in range(5):
            cf1 = np.polyfit(ss[keep], tt[keep], 1)
            res = tt - np.polyval(cf1, ss)
            keep = res > -max(6.0, 0.5 * np.std(res[keep]))
        cf = np.polyfit(ss[keep], tt[keep], 2) if keep.sum() >= 5 else np.array([0.0, *cf1])
        span = (ss[keep].max() - ss[keep].min()) / 2
        if abs(cf[0]) * span * span > 0.12 * W:  # too bent: keep the line
            cf = np.array([0.0, *cf1])
        lo_s, hi_s = ss[keep].min() - 6, ss[keep].max() + 6
        inside = (side >= lo_s) & (side <= hi_s)
        # the curve inside the measured span, its end tangent's line beyond it
        edge = np.clip(side, lo_s, hi_s)
        slope = 2 * cf[0] * edge + cf[1]
        top = np.polyval(cf, edge) + np.where(inside, 0.0, slope * (side - edge))
        g = solid & band & (t < top)
        lbl, _ = ndimage.label(g)
        ids = np.unique(lbl[g & m])
        out |= np.isin(lbl, ids[ids > 0])
        above |= band & (t > top + 14)  # spikes well past the edge
        near = band & (t > top - 12) & (t < top + 14)  # the top ~12 px of the cuff and just above
        fringe |= near
        below |= near & (t < top) & np.isin(lbl, ids[ids > 0])
    return out.astype(np.float64), above, fringe, below


def recolour_sleeve(im, master, weight, target_hex):
    """Recolour the sleeve to target_hex, keeping its shading, with the
    lightness read off the untouched master (so cuff pixels the skin pass
    recoloured don't come out as darker patches)."""
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    L = ga.rgb_to_lab(np.asarray(master.convert("RGB")).astype(np.float64))[..., 0]
    core = weight > 0.8
    if core.sum() < 2000:
        return im
    mL = np.median(L[core])
    t = ga.rgb_to_lab(ga.hex_to_rgb(target_hex))
    tC, th = np.hypot(t[1], t[2]), np.arctan2(t[2], t[1])
    L2 = t[0] + (L - mL) * 0.95
    C2 = tC * np.clip(1.0 + (mL - L) / 120.0, 0.8, 1.35)
    new = ga.lab_to_rgb(np.stack([L2, C2 * np.cos(th), C2 * np.sin(th)], axis=-1))
    rgba[..., :3] = rgba[..., :3] * (1 - weight[..., None]) + new * weight[..., None]
    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA")


def skin_character(master, char, hands, camera, pose_id=None, mirrored=False):
    """mirrored: the master was flipped for a left hand; it is re-lit from
    the upper left (hand_jewellery3d.relight_mirrored) after recolouring."""
    im = master
    sleeve_w = sleeve_weight(master, hands, pose_id, mirrored) if char.get("sleeve") else None
    if char.get("skin"):
        im, _ = ga.normalise_skin(im, ga.rgb_to_lab(ga.hex_to_rgb(char["skin"])), tolerance=0.0)
    if char.get("sleeve"):
        im = recolour_sleeve(im, master, sleeve_w, char["sleeve"])
    if mirrored:
        # the relight moves light from one side to the other but also
        # brightens the whole hand a little: match the relit skin back to
        # the right hand's own lightness/chroma percentiles (monotonic, so
        # the new light direction stays)
        stats = ga.skin_stats(im)
        im = j3.relight_mirrored(im)
        im, _ = ga.match_skin_distribution(im, stats)
    if char.get("overlay") and char["overlay"].get("texture"):
        im = apply_overlay(im, os.path.join(GAME, char["overlay"]["texture"]), hands)
    if sleeve_w is None and char.get("jewellery"):
        sleeve_w = sleeve_weight(master, hands, pose_id, mirrored)
    return place_jewellery(im, hands, char.get("jewellery", {}), camera, pose_id, mirrored, sleeve_w)


def mirror_hands(hands, width):
    out = []
    for h in hands:
        m = {"side": "left" if h["side"] == "right" else "right"}
        for key in ("wrist", "ring", "bracelet"):
            if h.get(key) and "x" in h[key]:
                v = dict(h[key])
                v["x"] = round(width - 1 - v["x"], 1)
                v["angle_deg"] = -v["angle_deg"]
                for j in ("mcp", "pip"):
                    if j in v:
                        v[j] = [round(width - 1 - v[j][0], 1), v[j][1]]
                m[key] = v
            elif h.get(key):
                m[key] = dict(h[key])
            else:
                m[key] = None
        out.append(m)
    return out


# ---------------------------------------------------------------------------
# Sheets
# ---------------------------------------------------------------------------

def contact_sheet(tiles, path, thumb=220, cols=8, label_h=24):
    rows = (len(tiles) + cols - 1) // cols
    zoom = (thumb - 8) / max(max(im.size) for _, im in tiles)
    sheet = Image.new("RGB", (cols * thumb, rows * (thumb + label_h)), (40, 40, 40))
    d = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for i, (label, im) in enumerate(tiles):
        r, c = divmod(i, cols)
        x0, y0 = c * thumb, r * (thumb + label_h)
        fit = im.resize((max(1, round(im.width * zoom)), max(1, round(im.height * zoom))), Image.LANCZOS)
        bg = ga.checkerboard((thumb, thumb))
        bg.paste(fit, ((thumb - fit.width) // 2, thumb - fit.height), fit)
        sheet.paste(bg, (x0, y0))
        d.text((x0 + 4, y0 + thumb + 4), label[:34], fill=(235, 235, 235), font=font)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sheet.save(path)


def check_sheet(anchors, poses, path):
    """The masters with every anchor drawn on: wrist (cyan dot, arm-direction
    line, width bar) and ring (magenta dot, finger-direction line; hollow
    for palm/side views)."""
    tiles = []
    for mid in poses:
        im = Image.open(ga.resolve_path(f"{H}/master/{mid}.png")).convert("RGBA")
        bg = Image.new("RGBA", im.size, (118, 128, 138, 255))
        bg.alpha_composite(im)
        d = ImageDraw.Draw(bg)
        for h in anchors[mid]["hands"]:
            if h.get("wrist"):
                w = h["wrist"]
                a = math.radians(w["angle_deg"])
                ux, uy = math.sin(a), -math.cos(a)
                d.line([w["x"], w["y"], w["x"] + ux * 120, w["y"] + uy * 120], fill=(0, 255, 255, 255), width=8)
                hw = w["width_px"] / 2
                d.line([w["x"] + uy * hw, w["y"] - ux * hw, w["x"] - uy * hw, w["y"] + ux * hw], fill=(0, 255, 255, 255), width=6)
                d.ellipse([w["x"] - 14, w["y"] - 14, w["x"] + 14, w["y"] + 14], fill=(0, 255, 255, 255))
            if h.get("ring"):
                r = h["ring"]
                a = math.radians(r["angle_deg"])
                d.line([r["x"], r["y"], r["x"] + math.sin(a) * 90, r["y"] - math.cos(a) * 90], fill=(255, 0, 255, 255), width=8)
                box = [r["x"] - 16, r["y"] - 16, r["x"] + 16, r["y"] + 16]
                if r["view"] == "back":
                    d.ellipse(box, fill=(255, 0, 255, 255))
                else:
                    d.ellipse(box, outline=(255, 0, 255, 255), width=6)
        tiles.append((mid.replace("hand-", ""), bg))
    contact_sheet(tiles, path)


def ring_sheet(name, masters, anchors, per_sheet=12, tile=380):
    """The baked images of one character with zooms on each ring and on the
    wrist jewellery: the per-pose visual check of the placements."""
    import hand_landmarks as hl
    tiles = []
    od = os.path.join(OUT, name)
    for m in masters:
        mid = m["id"]
        a = anchors[mid]
        variants = [("", a["hands"])]
        if os.path.exists(os.path.join(od, f"{mid}-left.webp")):
            variants.append(("-left", mirror_hands(a["hands"], a["size"][0] if "size" in a else
                                                   Image.open(ga.resolve_path(m["output"])).width)))
        for suf, hands in variants:
            im = Image.open(os.path.join(od, f"{mid}{suf}.webp")).convert("RGBA")
            bg = Image.new("RGBA", im.size, (118, 128, 138, 255))
            bg.alpha_composite(im)
            zooms = []
            for h in hands:
                r = h.get("ring") or {}
                if "x" in r and r.get("view") != "hidden":
                    z = max(150, int(r["width_px"] * 3.2))
                    zooms.append(bg.crop((int(r["x"] - z / 2), int(r["y"] - z / 2), int(r["x"] + z / 2), int(r["y"] + z / 2))))
                b = h.get("bracelet") or h.get("wrist")
                if b:
                    z = int(b["width_px"] * 1.6)
                    zooms.append(bg.crop((int(b["x"] - z / 2), int(b["y"] - z / 2), int(b["x"] + z / 2), int(b["y"] + z / 2))))
            k = tile / max(bg.size)
            full = bg.resize((round(bg.width * k), round(bg.height * k)), Image.LANCZOS).convert("RGB")
            zw = tile // 2
            out = Image.new("RGB", (tile + 2 * zw, tile + 22), (36, 36, 36))
            out.paste(full, (0, 0))
            for i, zm in enumerate(zooms[:4]):
                out.paste(zm.resize((zw, zw), Image.LANCZOS).convert("RGB"), (tile + (i % 2) * zw, (i // 2) * zw))
            views = " ".join(f"{h['side'][0].upper()}:{(h.get('ring') or {}).get('view', '-')}" for h in hands)
            ImageDraw.Draw(out).text((4, tile + 5), f"{mid.replace('hand-', '')}{suf}  {views}", fill=(240, 240, 240))
            tiles.append(out)
    paths = []
    for k in range(0, len(tiles), per_sheet):
        path = os.path.join(SHEETS, f"hands-{name}-rings-{k // per_sheet + 1}.png")
        hl.debug_sheet(tiles[k:k + per_sheet], path, cols=3)
        paths.append(path)
    return paths


# ---------------------------------------------------------------------------

def passing_masters():
    review = json.load(open(REVIEW))
    data = ga.load_asset_list(ga.DEFAULT_ASSET_LIST)
    return [a for a in data["assets"] if a.get("group") == "hands-master" and review.get(a["id"], "").startswith("PASS")]


def load_anchors():
    with open(ANCHORS) as f:
        a = json.load(f)
    a.pop("_readme", None)
    return a


def save_anchors(anchors, readme):
    out = {"_readme": readme}
    out.update({k: anchors[k] for k in sorted(anchors)})
    with open(ANCHORS, "w") as f:
        json.dump(out, f, indent=1)
        f.write("\n")


def measure_wrists(anchors, masters):
    """Re-run the automatic wrist finder (hand_masks.find_wrists, plus its
    MANUAL_WRISTS) and assign wrists to hands by x order."""
    for m in masters:
        mid = m["id"]
        im = Image.open(ga.resolve_path(m["output"])).convert("RGBA")
        found = [dict(w, source="auto") for w in hm.find_wrists(im)]
        found += [dict(w, source="manual") for w in hm.MANUAL_WRISTS.get(mid, [])]
        found.sort(key=lambda w: w["x"])
        hands = anchors[mid]["hands"]
        manual = [dict(w, source="manual") for w in hm.MANUAL_WRISTS.get(mid, [])]
        if len(manual) >= len(hands):  # hands v3: a full set of manual wrists wins over the finder
            found = sorted(manual, key=lambda w: w["x"])
        if len(found) > len(hands):  # keep the ones nearest the hands' rings / the widest apart
            found = found[:len(hands)] if len(hands) == 1 else [found[0], found[-1]]
        for h, w in zip(hands, found if len(found) == len(hands) else found + [None] * (len(hands) - len(found))):
            h["wrist"] = None if w is None else {"x": w["x"], "y": w["y"], "angle_deg": w["angle_deg"],
                                                 "width_px": w["wrist_px"], "source": w["source"]}


def _bake_one(job):
    """Bake one pose for one character (and its left variant); returns
    [(label, path)]. Runs in a worker process with --jobs."""
    name, mid, output = job
    skins = json.load(open(SKINS))
    char = skins[name]
    a = load_anchors()[mid]
    od = os.path.join(OUT, name)
    master = Image.open(ga.resolve_path(output)).convert("RGBA")
    out = skin_character(master, char, a["hands"], a["camera"], mid)
    res = [(mid.replace("hand-", ""), os.path.join(od, f"{mid}.webp"))]
    out.save(res[0][1], lossless=True)
    if char.get("left_variant") and len(a["hands"]) == 1:
        mirrored = master.transpose(Image.FLIP_LEFT_RIGHT)
        mh = mirror_hands(a["hands"], master.width)
        out_l = skin_character(mirrored, char, mh, a["camera"], mid, mirrored=True)
        res.append((mid.replace("hand-", "") + " L", os.path.join(od, f"{mid}-left.webp")))
        out_l.save(res[1][1], lossless=True)
    print(f"[{name}] {mid}", flush=True)
    return res


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--only", help="comma-separated character names (default: all in data/hand-skins.json)")
    p.add_argument("--poses", help="comma-separated master ids (default: every passing master)")
    p.add_argument("--measure-wrists", action="store_true", help="re-run the wrist finder into the anchors file, then exit")
    p.add_argument("--check-sheet", action="store_true", help="draw the anchors on the masters, then exit")
    p.add_argument("--jobs", type=int, default=3, help="poses baked in parallel (default 3)")
    p.add_argument("--ring-sheet", metavar="NAME", help="zoomed ring/bracelet check sheets of a baked character, then exit")
    args = p.parse_args()

    masters = passing_masters()
    if args.poses:
        masters = [m for m in masters if m["id"] in args.poses.split(",")]
    with open(ANCHORS) as f:
        readme = json.load(f).get("_readme", "")
    anchors = load_anchors()

    if args.measure_wrists:
        measure_wrists(anchors, masters)
        save_anchors(anchors, readme)
        print(f"wrists measured for {len(masters)} poses -> {ANCHORS}")
        return
    if args.ring_sheet:
        for path in ring_sheet(args.ring_sheet, masters, anchors):
            print(f"wrote {path}")
        return
    if args.check_sheet:
        path = os.path.join(SHEETS, "hands-anchors-check.png")
        check_sheet(anchors, [m["id"] for m in masters], path)
        print(f"wrote {path}")
        return

    skins = json.load(open(SKINS))
    skins.pop("_readme", None)
    names = args.only.split(",") if args.only else list(skins)
    jewellery_sprites()  # also writes the loose sprites to skins/jewellery/
    for name in names:
        char = skins[name]
        if char.get("pending"):
            print(f"[{name}] skipped: {char['pending']}")
            continue
        if char.get("bake") is False:
            print(f"[{name}] not baked: {char.get('_note', '')}")
            continue
        od = os.path.join(OUT, name)
        os.makedirs(od, exist_ok=True)
        jobs = [(name, m["id"], m["output"]) for m in masters]
        if args.jobs > 1:
            from concurrent.futures import ProcessPoolExecutor
            with ProcessPoolExecutor(args.jobs) as ex:
                done = list(ex.map(_bake_one, jobs))
        else:
            done = [_bake_one(j) for j in jobs]
        tiles = []
        for outs in done:
            for label, path in outs:
                tiles.append((label, Image.open(path).convert("RGBA")))
        contact_sheet(tiles, os.path.join(SHEETS, f"hands-{name}.png"))
        print(f"[{name}] {len(tiles)} images -> {od}")


if __name__ == "__main__":
    main()
