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

GAME = ga.GAME
H = "assets/characters/hands"
REVIEW = os.path.join(GAME, "build", "reports", "data", "hands-master-v2-review.json")
ANCHORS = os.path.join(GAME, "data", "hand-anchors.json")
SKINS = os.path.join(GAME, "data", "hand-skins.json")
OUT = os.path.join(GAME, H, "skins")
SHEETS = os.path.join(GAME, "build", "contact-sheets")

REF_WRIST = 200  # jewellery sprites are drawn for a wrist this wide; scaled by wrist_px / REF_WRIST
FINGER_OF_WRIST = 0.27  # ring-finger width as a share of the wrist width
ELLIPSE = {"e": 0.34, "t": 0.14}  # wrist-ring ellipse height / width, by camera


# ---------------------------------------------------------------------------
# Jewellery sprites (drawn at REF_WRIST, supersampled)
# ---------------------------------------------------------------------------

def _canvas(w, h, ss):
    return Image.new("RGBA", (int(w * ss), int(h * ss)), (0, 0, 0, 0))


def _gold(d, box, ss, width, shade=1.0):
    col = tuple(int(c * shade) for c in (214, 170, 74))
    d.ellipse([v * ss for v in box], outline=col + (255,), width=max(1, int(width * ss)))


def draw_ring(kind, view, ss=6):
    """A ring for a finger pointing up the sprite (the band runs across).
    kind: 'aqiq' (oval red-orange cabochon in a plain yellow gold bezel) or
    'diamond' (round solitaire in a raised six-claw setting). view: 'back'
    shows the stone, 'palm' and 'side' the band only. Sprite centre = the
    ring's centre on the finger."""
    fw = REF_WRIST * FINGER_OF_WRIST  # finger width, 54 px at the reference wrist
    W, Hh = fw * 1.6, fw * 1.6
    img = _canvas(W, Hh, ss)
    d = ImageDraw.Draw(img)
    cx, cy = W / 2, Hh / 2
    band_h = fw * (0.15 if view == "back" else 0.085)
    # contact shadow on the skin, just below the band (the light is upper left)
    d.rounded_rectangle([(cx - fw / 2 + 1) * ss, (cy - band_h / 2 + 2) * ss, (cx + fw / 2 - 1) * ss, (cy + band_h / 2 + 3) * ss],
                        radius=band_h / 2 * ss, fill=(70, 40, 25, 60))
    # the band across the finger: gold shaded by the cosine of the angle
    # round the finger, so it darkens and narrows where it turns away at
    # both sides (it wraps round, rather than lying on top like a bar)
    x0, x1 = int((cx - fw / 2) * ss), int((cx + fw / 2) * ss)
    for x in range(x0, x1):
        u = ((x + 0.5) / ss - cx) / (fw / 2)  # -1..1 across the finger
        c = math.sqrt(max(0.0, 1 - u * u))
        lit = 0.55 + 0.45 * c + 0.12 * (-u)  # a touch brighter towards the light (left)
        h = band_h * (0.55 + 0.45 * c)
        col = tuple(int(min(255, v * lit)) for v in (214, 166, 64))
        d.line([x, (cy - h / 2) * ss, x, (cy + h / 2) * ss], fill=col + (255,))
        hi = tuple(int(min(255, v * (0.7 + 0.35 * c))) for v in (255, 226, 140))
        d.line([x, (cy - h / 2) * ss, x, (cy - h / 2 + h * 0.3) * ss], fill=hi + (255,))
    if view == "back":
        if kind == "aqiq":
            rx, ry = fw * 0.3, fw * 0.39  # oval along the finger
            d.ellipse([(cx - rx - 3) * ss, (cy - ry - 3) * ss, (cx + rx + 3) * ss, (cy + ry + 3) * ss],
                      fill=(200, 150, 56, 255))  # bezel
            d.ellipse([(cx - rx - 3) * ss, (cy - ry - 3) * ss, (cx + rx + 3) * ss, (cy + ry + 3) * ss],
                      outline=(250, 222, 140, 255), width=int(1.4 * ss))
            d.ellipse([(cx - rx) * ss, (cy - ry) * ss, (cx + rx) * ss, (cy + ry) * ss], fill=(178, 40, 22, 255))
            d.ellipse([(cx - rx * 0.8) * ss, (cy - ry * 0.85) * ss, (cx + rx * 0.7) * ss, (cy + ry * 0.6) * ss],
                      fill=(214, 70, 36, 255))
            d.ellipse([(cx - rx * 0.55) * ss, (cy - ry * 0.7) * ss, (cx - rx * 0.05) * ss, (cy - ry * 0.2) * ss],
                      fill=(255, 190, 160, 200))  # glossy highlight, upper left (the light)
        else:
            r = fw * 0.27
            for k in range(6):  # six claws
                a = math.radians(k * 60 + 30)
                px, py = cx + math.cos(a) * r * 1.02, cy + math.sin(a) * r * 1.02
                d.ellipse([(px - 2.6) * ss, (py - 2.6) * ss, (px + 2.6) * ss, (py + 2.6) * ss], fill=(236, 196, 96, 255))
            d.ellipse([(cx - r) * ss, (cy - r) * ss, (cx + r) * ss, (cy + r) * ss], fill=(226, 236, 244, 255))
            for k in range(8):  # facets
                a = math.radians(k * 45)
                d.line([cx * ss, cy * ss, (cx + math.cos(a) * r) * ss, (cy + math.sin(a) * r) * ss],
                       fill=(170, 190, 210, 255), width=int(0.8 * ss))
            d.ellipse([(cx - r * 0.45) * ss, (cy - r * 0.45) * ss, (cx + r * 0.45) * ss, (cy + r * 0.45) * ss],
                      fill=(250, 252, 255, 255))
            d.ellipse([(cx - r * 0.7) * ss, (cy - r * 0.75) * ss, (cx - r * 0.25) * ss, (cy - r * 0.3) * ss],
                      fill=(255, 255, 255, 255))
    img = img.resize((int(W), int(Hh)), Image.LANCZOS)
    return img


def draw_wrist_ring(style, camera, ss=4):
    """A ring round the wrist, split into (back, front) halves of one
    sprite (back drawn under the hand, front over it). style: a bangle
    colour name ('red', 'green', 'gold') or 'tennis' (a thin row of small
    diamonds in white gold)."""
    rx = REF_WRIST * (0.53 if style == "tennis" else 0.58)  # the bracelet sits close; bangles hang loose
    ry = max(rx * ELLIPSE[camera], 6)
    pad = 12
    W, Hh = int(2 * rx + 2 * pad), int(2 * ry + 2 * pad)
    img = Image.new("RGBA", (W * ss, Hh * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx, cy = W * ss / 2, Hh * ss / 2
    if style == "tennis":
        # a thin white-gold line of settings, then close-set small diamonds
        d.ellipse([cx - rx * ss, cy - ry * ss, cx + rx * ss, cy + ry * ss], outline=(150, 150, 160, 255), width=int(6.5 * ss))
        d.ellipse([cx - rx * ss, cy - ry * ss + 1.5 * ss, cx + rx * ss, cy + ry * ss + 1.5 * ss],
                  outline=(90, 80, 70, 110), width=int(2 * ss))  # contact shadow on the skin
        n = 54
        for k in range(n):
            a = 2 * math.pi * k / n
            px, py = cx + math.cos(a) * rx * ss, cy + math.sin(a) * ry * ss
            r = 3.6 * ss
            d.ellipse([px - r, py - r, px + r, py + r], fill=(222, 228, 236, 255))
            d.ellipse([px - r * 0.6, py - r * 0.75, px + r * 0.15, py - r * 0.1], fill=(255, 255, 255, 255))
    else:
        colour, hi = {"red": ((200, 38, 48), (255, 170, 170)), "green": ((40, 150, 70), (170, 240, 180)),
                      "gold": ((214, 168, 72), (255, 236, 170))}[style]
        thick = 7.0

        def ring(col, alpha, grow=0.0, width=thick, dy=0.0):
            box = [cx - (rx + grow) * ss, cy - (ry + grow) * ss + dy * ss,
                   cx + (rx + grow) * ss, cy + (ry + grow) * ss + dy * ss]
            d.ellipse(box, outline=col + (alpha,), width=max(1, int(width * ss)))

        ring(tuple(int(c * 0.72) for c in colour), 235)
        ring(colour, 225, grow=-0.8, width=thick - 2.5)
        ring(hi, 200, grow=-0.6, width=1.6, dy=-1.6)
    img = img.resize((W, Hh), Image.LANCZOS)
    arr = np.asarray(img).copy()
    back, front = arr.copy(), arr.copy()
    back[Hh // 2:] = 0
    front[:Hh // 2] = 0
    return Image.fromarray(back, "RGBA"), Image.fromarray(front, "RGBA")


def jewellery_sprites():
    """Every sprite, keyed as it is named in data/hand-skins.json, saved to
    skins/jewellery/ as well."""
    out = {}
    for kind in ("aqiq", "diamond"):
        for view in ("back", "palm", "side"):
            out[f"ring-{kind}-{view}"] = draw_ring(kind, view)
    for style in ("red", "green", "gold", "tennis"):
        for cam in ("e", "t"):
            back, front = draw_wrist_ring(style, cam)
            name = f"bangle-{style}" if style != "tennis" else "tennis-bracelet"
            out[f"{name}-{cam}-back"], out[f"{name}-{cam}-front"] = back, front
    jd = os.path.join(OUT, "jewellery")
    os.makedirs(jd, exist_ok=True)
    for k, im in out.items():
        im.save(os.path.join(jd, f"{k}.png"))
    return out


def _paste(layer, sprite, x, y, scale, angle):
    sp = sprite.resize((max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))), Image.LANCZOS)
    sp = sp.rotate(-angle, resample=Image.BICUBIC, expand=True)
    layer.alpha_composite(sp, (int(round(x - sp.width / 2)), int(round(y - sp.height / 2))))


RING_FW = REF_WRIST * FINGER_OF_WRIST  # the finger width ring sprites are drawn for


def place_jewellery(hand_img, hands, items, camera, sprites):
    """Composite jewellery onto a hand image. hands: the pose's hand anchors
    (already mirrored if the image is); items: {"right": [...], "left": [...]}
    from the character, each {"type": "ring"|"wrist", "sprite": name or list
    of names}.

    Rings (hands v2): on the ring finger at the landmark placement
    (build/hand_landmarks.py), scaled to the measured finger width, turned
    to the finger's first segment; 'back' shows band and stone, 'palm' and
    'side' a thin band, 'hidden' nothing. The ring is clipped to the hand's
    silhouette so it never hangs into the background or a tool gap.
    Wrist items sit at the bracelet anchor (the wrist joint, across the
    forearm), stacked along the arm, 13 px apart at the reference wrist;
    poses without one fall back to the cuff anchor."""
    base = Image.new("RGBA", hand_img.size, (0, 0, 0, 0))
    over = Image.new("RGBA", hand_img.size, (0, 0, 0, 0))
    rings = Image.new("RGBA", hand_img.size, (0, 0, 0, 0))
    for hand in hands:
        wrist = hand.get("bracelet") or hand.get("wrist")
        for it in items.get(hand["side"], []):
            if it["type"] == "wrist" and wrist:
                k = wrist["width_px"] / REF_WRIST
                names = it["sprite"] if isinstance(it["sprite"], list) else [it["sprite"]]
                a = math.radians(wrist["angle_deg"])
                along = np.array([math.sin(a), -math.cos(a)])
                for j, name in enumerate(names):
                    off = (j - (len(names) - 1) / 2) * 13 * k
                    x, y = wrist["x"] + along[0] * off, wrist["y"] + along[1] * off
                    _paste(base, sprites[f"{name}-{camera}-back"], x, y, k, wrist["angle_deg"])
                    _paste(over, sprites[f"{name}-{camera}-front"], x, y, k, wrist["angle_deg"])
            elif it["type"] == "ring":
                r = hand.get("ring") or {}
                if r.get("view") in (None, "hidden") or "x" not in r:
                    continue
                view = "back" if r["view"] == "back" else "palm"
                _paste(rings, sprites[f"{it['sprite']}-{view}"], r["x"], r["y"], r["width_px"] / RING_FW, r["angle_deg"])
    # clip the rings to the hand (the stone may stand a little proud of the
    # finger's outline, so the silhouette is grown by a few pixels)
    sil = hand_img.getchannel("A").filter(ImageFilter.MaxFilter(5))
    ra = np.asarray(rings).copy()
    ra[..., 3] = (ra[..., 3].astype(np.float64) * np.asarray(sil) / 255.0).astype(np.uint8)
    over.alpha_composite(Image.fromarray(ra, "RGBA"))
    base.alpha_composite(hand_img)
    base.alpha_composite(over)
    return base


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


# Boxes (master pixels) where the sleeve mask is erased by hand: a5-f1's
# forearm is so pale it reads as cream just above the cuff; d2-e and f4
# kept a speck of sleeve colour on the forearm.
SLEEVE_ERASE = {"hand-a5-wave-f1-e": [(540, 760, 660, 866)],
                # hands v2: sleeve-colour specks on the forearm, found on the nani sheet
                "hand-d2-c-hold-e": [(1165, 1113, 1219, 1179)],
                "hand-f4-phone-two-hands-e": [(1683, 1273, 1731, 1323)],
                # d6-f1 is a5-f1 and its mirror (build/hand_guides.py): a5's box, on both arms
                "hand-d6-two-hand-catch-f1-open-e": [(127, 760, 247, 866), (1095, 760, 1215, 866)]}


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


def skin_character(master, char, hands, camera, sprites, pose_id=None, mirrored=False):
    im = master
    # the sleeve mask is measured on the untouched master: after the skin
    # recolour the skin/cuff classifier would see different colours
    sleeve_w = None
    if char.get("sleeve"):
        sleeve_w = clip_sleeve_to_cuff(hm.sleeve_region(master), master, hands)
        for x0, y0, x1, y1 in SLEEVE_ERASE.get(pose_id, []):
            if mirrored:
                x0, x1 = master.width - x1, master.width - x0
            sleeve_w[y0:y1, x0:x1] = 0.0
    if char.get("skin"):
        im, _ = ga.normalise_skin(im, ga.rgb_to_lab(ga.hex_to_rgb(char["skin"])), tolerance=0.0)
    if char.get("sleeve"):
        im, _ = hm.recolour_sleeve(im, char["sleeve"], weight=sleeve_w)
    if char.get("overlay") and char["overlay"].get("texture"):
        im = apply_overlay(im, os.path.join(GAME, char["overlay"]["texture"]), hands)
    return place_jewellery(im, hands, char.get("jewellery", {}), camera, sprites)


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
        if len(found) > len(hands):  # keep the ones nearest the hands' rings / the widest apart
            found = found[:len(hands)] if len(hands) == 1 else [found[0], found[-1]]
        for h, w in zip(hands, found if len(found) == len(hands) else found + [None] * (len(hands) - len(found))):
            h["wrist"] = None if w is None else {"x": w["x"], "y": w["y"], "angle_deg": w["angle_deg"],
                                                 "width_px": w["wrist_px"], "source": w["source"]}


_SPRITES = None


def _bake_one(job):
    """Bake one pose for one character (and its left variant); returns
    [(label, path)]. Runs in a worker process with --jobs."""
    global _SPRITES
    name, mid, output = job
    if _SPRITES is None:
        _SPRITES = jewellery_sprites()
    skins = json.load(open(SKINS))
    char = skins[name]
    a = load_anchors()[mid]
    od = os.path.join(OUT, name)
    master = Image.open(ga.resolve_path(output)).convert("RGBA")
    out = skin_character(master, char, a["hands"], a["camera"], _SPRITES, mid)
    res = [(mid.replace("hand-", ""), os.path.join(od, f"{mid}.webp"))]
    out.save(res[0][1], lossless=True)
    if char.get("left_variant") and len(a["hands"]) == 1:
        mirrored = master.transpose(Image.FLIP_LEFT_RIGHT)
        mh = mirror_hands(a["hands"], master.width)
        out_l = skin_character(mirrored, char, mh, a["camera"], _SPRITES, mid, mirrored=True)
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
