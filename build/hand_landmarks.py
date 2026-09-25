#!/usr/bin/env python3
"""Per-pose ring and bracelet placement from hand landmarks (hands v2, 25 Sept 2026).

The v1 ring anchors were read off gridded views by eye and sat all over the
back of the hand. Here every hand in every master is run through MediaPipe's
hand-landmark model (21 joints per hand; it works on these stylised 3D hands),
and the jewellery is placed from the joints:

  ring      on the ring finger's first segment, between the base knuckle
            (MCP, landmark 13) and the middle joint (PIP, landmark 14), 35% of
            the way from the MCP, turned to that segment's angle and scaled to
            the finger's width (measured across the segment on the image:
            the alpha edge or the dark crease against the next finger,
            bounded by the knuckle spacing).
  view      which side of the hand faces us, from the handedness of the
            landmark triangle wrist / index MCP / pinky MCP against the hand's
            known side: 'back' (band and stone), 'palm' (thin band only),
            'side' (edge-on: thin band) or 'hidden' (curled out of view, or
            occluded: set by hand after the visual check).
  bracelet  at the wrist landmark (0), moved a little up the arm, across the
            forearm's direction (cuff anchor -> wrist landmark), as wide as
            the arm is there.

Detection runs on each master composited over three backgrounds, and on its
mirror image; detections of the same hand are merged by the median of their
joints. Hands are matched to the pose's hands in data/hand-anchors.json by
their wrist. Where detection fails or is wrong, the two joints are marked by
hand in the anchors file with "source": "manual" (kept on re-runs), and a
manual "view" can be pinned with "view_source": "manual".

    python3 build/hand_landmarks.py                  # detect every master, update anchors
    python3 build/hand_landmarks.py --poses hand-a1-flat-palm-t
    python3 build/hand_landmarks.py --sheet          # debug sheets only (landmarks + ring outline)
"""
import argparse
import json
import math
import os
import sys
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402
from hand_ring_pins import PINS  # noqa: E402

GAME = ga.GAME
H = "assets/characters/hands"
ANCHORS = os.path.join(GAME, "data", "hand-anchors.json")
MODEL = os.path.join(GAME, "build", "models", "hand_landmarker.task")  # git-ignored, fetched on first use
MODEL_URL = ("https://storage.googleapis.com/mediapipe-models/hand_landmarker/"
             "hand_landmarker/float16/latest/hand_landmarker.task")
SHEETS = os.path.join(GAME, "build", "contact-sheets")

RING_T = 0.35          # ring centre, share of the way from MCP to PIP (at least)
WEB_PAST = 0.12        # ...and at least this share of the segment past the web, where the finger leaves its neighbours
BRACELET_BACK = 0.12   # bracelet centre, share of the palm length (wrist->middle MCP) up the arm
SIDE_VIEW = 0.22       # |normalised cross| below this: the hand is edge-on
CURLED_DEG = 75        # ring finger bent more than this at the PIP: curled
BONES = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 5), (5, 6), (6, 7), (7, 8), (5, 9), (9, 10), (10, 11), (11, 12),
         (9, 13), (13, 14), (14, 15), (15, 16), (13, 17), (0, 17), (17, 18), (18, 19), (19, 20)]


# ---------------------------------------------------------------------------
# Detection
# ---------------------------------------------------------------------------

_DET = None


def detector():
    global _DET
    if _DET is None:
        from mediapipe.tasks.python import BaseOptions, vision
        if not os.path.exists(MODEL):
            os.makedirs(os.path.dirname(MODEL), exist_ok=True)
            urllib.request.urlretrieve(MODEL_URL, MODEL)
        opt = vision.HandLandmarkerOptions(base_options=BaseOptions(model_asset_path=MODEL), num_hands=2,
                                           min_hand_detection_confidence=0.1, min_hand_presence_confidence=0.1,
                                           running_mode=vision.RunningMode.IMAGE)
        _DET = vision.HandLandmarker.create_from_options(opt)
    return _DET


def _detect_once(rgb):
    import mediapipe as mp
    r = detector().detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb)))
    H_, W_ = rgb.shape[:2]
    out = []
    for lms, hd in zip(r.hand_landmarks, r.handedness):
        pts = np.array([[p.x * W_, p.y * H_] for p in lms])
        out.append({"pts": pts, "score": hd[0].score})
    return out


def detect_hands(im):
    """All hands in an RGBA master: a list of {pts (21x2), score, n (runs that
    agreed)}, merged over three backgrounds and the mirror image."""
    runs = []
    for bg in ((120, 130, 140), (255, 255, 255), (30, 30, 30)):
        b = Image.new("RGBA", im.size, bg + (255,))
        b.alpha_composite(im)
        rgb = np.asarray(b.convert("RGB"))
        runs += _detect_once(rgb)
        for d in _detect_once(rgb[:, ::-1]):
            d["pts"][:, 0] = im.width - 1 - d["pts"][:, 0]
            runs.append(d)
    # cluster by the palm centre (wrist, index MCP, pinky MCP, middle MCP)
    clusters = []
    for d in sorted(runs, key=lambda d: -d["score"]):
        c = d["pts"][[0, 5, 9, 17]].mean(0)
        size = np.linalg.norm(d["pts"][9] - d["pts"][0])
        for cl in clusters:
            if np.linalg.norm(cl["c"] - c) < 0.5 * max(size, cl["size"]):
                cl["m"].append(d)
                break
        else:
            clusters.append({"c": c, "size": size, "m": [d]})
    hands = []
    for cl in clusters:
        pts = np.stack([d["pts"] for d in cl["m"]])
        # the model can swap index and pinky between runs (it guesses the
        # hand's chirality); keep the runs that agree with the best one
        ref = cl["m"][0]["pts"]
        keep = [p for p in pts if np.linalg.norm(p[13] - ref[13]) < 0.35 * cl["size"]]
        hands.append({"pts": np.median(np.stack(keep), 0), "score": float(np.mean([d["score"] for d in cl["m"]])),
                      "n": len(keep)})
    hands.sort(key=lambda h: -h["n"])
    return hands


def match_hands(found, hands):
    """Assign detections to the pose's hands (by the cuff wrist anchor) and
    return a list parallel to hands (None where nothing matched)."""
    out = [None] * len(hands)
    used = set()
    pairs = []
    for i, h in enumerate(hands):
        wr = h.get("wrist")
        if not wr:
            continue
        for j, f in enumerate(found):
            dist = np.linalg.norm(f["pts"][0] - (wr["x"], wr["y"]))
            if dist < 2.2 * wr["width_px"]:
                pairs.append((dist - 60 * f["n"], i, j))
    for _, i, j in sorted(pairs):
        if out[i] is None and j not in used:
            out[i], used = found[j], used | {j}
    return out


# ---------------------------------------------------------------------------
# Geometry
# ---------------------------------------------------------------------------

def angle_of(v):
    """Direction of v in the anchors' convention: 0 = up the frame, clockwise positive."""
    return math.degrees(math.atan2(v[0], -v[1]))


def facing(pts, side):
    """'back' or 'palm' facing us, or 'side', from the wrist/index/pinky
    triangle. For a right hand seen from the back (fingers up) the index MCP
    is left of the pinky MCP: cross > 0 in image coordinates."""
    v1, v2 = pts[5] - pts[0], pts[17] - pts[0]
    s = (v1[0] * v2[1] - v1[1] * v2[0]) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-6)
    if side == "left":
        s = -s
    if abs(s) < SIDE_VIEW:
        return "side", s
    return ("back" if s > 0 else "palm"), s


def curl_deg(pts):
    a, b = pts[14] - pts[13], pts[15] - pts[14]
    return math.degrees(math.acos(np.clip(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-6), -1, 1)))


def _profile(arr, p, n, reach):
    """alpha and luminance sampled along the unit vector n from p, -reach..reach."""
    ts = np.arange(-reach, reach + 1)
    xs = np.clip(np.round(p[0] + n[0] * ts).astype(int), 0, arr.shape[1] - 1)
    ys = np.clip(np.round(p[1] + n[1] * ts).astype(int), 0, arr.shape[0] - 1)
    px = arr[ys, xs]
    lum = px[:, :3] @ np.array([0.299, 0.587, 0.114])
    return ts, px[:, 3], lum


def finger_width(arr, p, along, spacing):
    """Width across the finger at p (perpendicular to `along`): walk out each
    way to the alpha edge, or to the dark crease against the next finger (a
    local luminance minimum clearly darker than the finger's middle). Bounded
    to 0.6-1.25 x the knuckle spacing; falls back to 0.95 x spacing."""
    n = np.array([-along[1], along[0]])
    reach = int(spacing * 1.4)
    ts, alpha, lum = _profile(arr, p, n, reach)
    lum = np.convolve(lum, np.ones(5) / 5, mode="same")
    c = reach
    mid = np.median(lum[c - 4:c + 5])
    half = []
    for step in (1, -1):
        edge = None
        for k in range(int(spacing * 0.3), reach - 3):
            i = c + step * k
            if alpha[i] < 128:
                edge = k
                break
            if lum[i] < mid * 0.78 and lum[i] <= lum[i - step] and lum[i] <= lum[i + step]:
                edge = k
                break
        half.append(edge)
    if half[0] is None and half[1] is None:
        return spacing * 0.95, "default"
    if half[0] is None or half[1] is None:
        w = 2 * (half[0] or half[1])
    else:
        w = half[0] + half[1]
    w = float(np.clip(w, 0.6 * spacing, 1.25 * spacing))
    return w, "measured"


def _both_edges(arr, p, along, spacing):
    """True when the profile across the finger at p meets an edge (alpha gap
    or dark crease) on BOTH sides within 0.75 x the knuckle spacing."""
    n = np.array([-along[1], along[0]])
    reach = int(spacing * 0.75)
    _, alpha, lum = _profile(arr, p, n, reach)
    lum = np.convolve(lum, np.ones(5) / 5, mode="same")
    mid = np.median(lum[reach - 4:reach + 5])
    ok = []
    for step in (1, -1):
        hit = False
        for k in range(int(spacing * 0.3), reach - 3):
            i = reach + step * k
            if alpha[i] < 128 or (lum[i] < mid * 0.78 and lum[i] <= lum[i - step] and lum[i] <= lum[i + step]):
                hit = True
                break
        ok.append(hit)
    return all(ok)


def arm_width(arr, p, across, cap):
    n = np.array(across)
    reach = int(cap)
    ts, alpha, _ = _profile(arr, p, n, reach)
    inside = alpha >= 128
    c = reach
    if not inside[c]:
        return None
    lo = c
    while lo > 0 and inside[lo - 1]:
        lo -= 1
    hi = c
    while hi < len(inside) - 1 and inside[hi + 1]:
        hi += 1
    return float(hi - lo)


def place(arr, hand, pts, side, old=None):
    """Ring and bracelet placements for one hand from its 21 joints (pixel
    coordinates). Returns (ring, bracelet)."""
    mcp, pip = pts[13], pts[14]
    seg = pip - mcp
    L = np.linalg.norm(seg)
    along = seg / (L + 1e-6)
    p = mcp + RING_T * seg
    have_all = not np.isnan(pts).any()
    if have_all:
        spacing = float(np.mean([np.linalg.norm(pts[13] - pts[9]), np.linalg.norm(pts[13] - pts[17])]))
    else:  # hand-marked joints only: the first segment is ~1.3 finger widths long
        spacing = (old or {}).get("spacing_px") or L / 1.3
    fw, how = finger_width(arr, p, along, spacing)
    web = None
    if have_all:
        # on the back of the hand the MCP landmark sits on the knuckle, and
        # the finger only separates from its neighbours further up (the
        # web); walk up the segment until both sides of the finger find an
        # edge (a background gap or the crease against the next finger)
        for t in np.arange(0.15, 0.85, 0.025):
            q = mcp + t * seg
            w_, how_ = finger_width(arr, q, along, spacing)
            if how_ == "measured" and w_ < 1.2 * spacing and _both_edges(arr, q, along, spacing):
                web = float(t)
                break
        if web is not None and web + WEB_PAST > RING_T:
            p = mcp + min(web + WEB_PAST, 0.6) * seg
            fw, how = finger_width(arr, p, along, spacing)
    view, s = facing(pts, side) if have_all else ((old or {}).get("view", "back"), 0.0)
    curl = curl_deg(pts) if have_all else 0.0
    pinned = (old or {}).get("source") == "manual" or (old or {}).get("view_source") == "manual"
    if pinned:
        view = old["view"]
    elif view == "palm" and curl > CURLED_DEG:
        view = "hidden"  # a fist or grip seen from the palm side: the ring is inside it
    # a curled finger seen from the back (fist, grip): the segment is
    # foreshortened and its image angle is noise; the ring's band then runs
    # across the hand's axis (wrist -> ring MCP), just past the knuckle
    if have_all and curl > CURLED_DEG and view in ("back", "side"):
        axis = pts[13] - pts[0]
        along = axis / (np.linalg.norm(axis) + 1e-6)
        seg = along * max(float(np.dot(seg, along)), 0.5 * spacing) if L > 0 else along * 0.5 * spacing
        p = mcp + RING_T * seg
        fw, how = finger_width(arr, p, along, spacing)
    ring = {"mcp": [round(float(mcp[0]), 1), round(float(mcp[1]), 1)],
            "pip": [round(float(pip[0]), 1), round(float(pip[1]), 1)],
            "x": round(float(p[0]), 1), "y": round(float(p[1]), 1),
            "angle_deg": round(angle_of(seg), 1), "width_px": round(fw, 1), "width_from": how,
            "view": view, "facing": round(float(s), 2), "curl_deg": round(curl, 0),
            "web_t": None if web is None else round(web, 3)}
    if (old or {}).get("width_source") == "manual":
        ring["width_px"], ring["width_from"] = old["width_px"], "manual"
        ring["width_source"] = "manual"
    if pinned:
        ring["view_source"] = "manual"
    if not have_all:
        return ring, None
    # bracelet: a little up the arm from the wrist joint, across the forearm
    w0 = pts[0]
    palm_len = np.linalg.norm(pts[9] - pts[0])
    wr = hand.get("wrist")
    hand_dir = (pts[9] - w0) / (palm_len + 1e-6)
    if wr and np.linalg.norm(w0 - (wr["x"], wr["y"])) > 1.3 * wr["width_px"]:
        # the wrist joint is nowhere near the measured wrist (a fist or grip
        # the model misread): fall back to the wrist anchor itself
        return ring, {"x": wr["x"], "y": wr["y"], "angle_deg": wr["angle_deg"],
                      "width_px": round(wr["width_px"] * 0.95, 1), "width_from": "wrist anchor (joint rejected)"}
    arm = hand_dir
    if wr:
        # the forearm runs from the wrist anchor (measured on the arm, nearer
        # the cuff) to the wrist joint; trust that line when it is long enough
        # and roughly agrees with the hand's axis, else the anchor's angle if
        # that agrees, else the hand's axis
        a = math.radians(wr["angle_deg"])
        anchor_dir = np.array([math.sin(a), -math.cos(a)])
        v = w0 - np.array([wr["x"], wr["y"]])
        cos50 = math.cos(math.radians(50))
        if np.linalg.norm(v) > 0.3 * wr["width_px"] and np.dot(v / np.linalg.norm(v), hand_dir) > cos50:
            arm = v / np.linalg.norm(v)
        elif np.dot(anchor_dir, hand_dir) > cos50:
            arm = anchor_dir
    b = w0 - arm * BRACELET_BACK * palm_len
    across = np.array([-arm[1], arm[0]])
    cap = 1.4 * (wr["width_px"] if wr else palm_len)
    bw = arm_width(arr, b, across, cap)
    if bw is None or bw < 0.45 * palm_len or (wr and bw > 1.1 * wr["width_px"]):
        bw = wr["width_px"] * 0.9 if wr else palm_len * 0.8
        bhow = "default"
    else:
        bhow = "measured"
    bracelet = {"x": round(float(b[0]), 1), "y": round(float(b[1]), 1), "angle_deg": round(angle_of(arm), 1),
                "width_px": round(bw, 1), "width_from": bhow}
    return ring, bracelet


def apply_pins(mid, entry):
    """Reset each ring to detection, then apply the hand-checked pins in
    build/hand_ring_pins.py (the only place manual views and joints live, so
    removing a pin there undoes it)."""
    pins = PINS.get(mid, [])
    for i, h in enumerate(entry["hands"]):
        r = {k: v for k, v in (h.get("ring") or {}).items()
             if k not in ("source", "view_source", "note", "width_source")}
        pin = pins[i] if i < len(pins) else None
        if pin:
            if "view" in pin:
                r["view"], r["view_source"] = pin["view"], "manual"
            if "mcp" in pin:
                r["mcp"], r["pip"], r["source"] = pin["mcp"], pin["pip"], "manual"
            if "width_px" in pin:
                r["width_px"], r["width_source"] = pin["width_px"], "manual"
            if "note" in pin:
                r["note"] = pin["note"]
        h["ring"] = r


def update_pose(mid, entry, im, detect=True):
    """Detect and place for every hand of one pose. A ring with "source":
    "manual" keeps its hand-marked mcp/pip (and "view"); a ring with
    "view_source": "manual" keeps its view over detected joints; a hand with
    "bracelet_source": "manual" keeps its bracelet."""
    apply_pins(mid, entry)
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    found = match_hands(detect_hands(im), entry["hands"]) if detect else [None] * len(entry["hands"])
    for h, f in zip(entry["hands"], found):
        old = h.get("ring") or {}
        manual = old.get("source") == "manual"
        if f is not None and not manual:
            h["landmarks"] = {"points": [[round(float(x), 1), round(float(y), 1)] for x, y in f["pts"]],
                              "score": round(f["score"], 2), "runs": f["n"], "source": "mediapipe"}
        elif f is None and not manual:
            h["landmarks"] = None
        lm = h.get("landmarks")
        if manual:
            pts = np.array(lm["points"], dtype=float) if lm else np.full((21, 2), np.nan)
            pts[13], pts[14] = old["mcp"], old["pip"]
        elif lm:
            pts = np.array(lm["points"], dtype=float)
        else:
            h["ring"] = {"view": "hidden", "source": "none", "note": "no detection: mark the joints by hand"}
            continue
        ring, bracelet = place(arr, h, pts, h["side"], old)
        ring["source"] = "manual" if manual else "mediapipe"
        if old.get("note"):
            ring["note"] = old["note"]
        h["ring"] = ring
        pins = PINS.get(mid, [])
        pin = pins[entry["hands"].index(h)] if entry["hands"].index(h) < len(pins) else None
        wr = h.get("wrist")
        if pin and pin.get("bracelet") == "anchor" and wr:
            bracelet = {"x": wr["x"], "y": wr["y"], "angle_deg": wr["angle_deg"],
                        "width_px": round(wr["width_px"] * 0.95, 1), "width_from": "wrist anchor (pinned)"}
        if bracelet:
            h["bracelet"] = bracelet


# ---------------------------------------------------------------------------
# Debug sheets
# ---------------------------------------------------------------------------

def ring_outline(r):
    """Four corners of the ring band: across the finger, band thickness along it."""
    a = math.radians(r["angle_deg"])
    along = np.array([math.sin(a), -math.cos(a)])
    n = np.array([-along[1], along[0]])
    c = np.array([r["x"], r["y"]])
    hw, hb = r["width_px"] / 2, max(4, r["width_px"] * 0.12)
    return [tuple(c + n * hw + along * hb), tuple(c - n * hw + along * hb),
            tuple(c - n * hw - along * hb), tuple(c + n * hw - along * hb)]


def debug_tile(im, entry, label, tile=520, crop=True):
    """A master with every hand's joints, the ring outline (green back, yellow
    palm/side, red cross hidden) and the bracelet line; plus a zoom on each ring."""
    bg = Image.new("RGBA", im.size, (118, 128, 138, 255))
    bg.alpha_composite(im)
    d = ImageDraw.Draw(bg)
    zooms = []
    for h in entry["hands"]:
        lm = h.get("landmarks")
        if lm:
            P = lm["points"]
            for i, j in BONES:
                col = (255, 60, 200, 255) if (i, j) in ((13, 14), (14, 15), (15, 16)) else (255, 255, 255, 200)
                d.line([tuple(P[i]), tuple(P[j])], fill=col, width=4)
            for k, (x, y) in enumerate(P):
                d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(255, 60, 200, 255) if k in (13, 14) else (40, 40, 40, 255))
        b = h.get("bracelet")
        if b:
            a = math.radians(b["angle_deg"])
            n = np.array([math.cos(a), math.sin(a)])
            c = np.array([b["x"], b["y"]])
            d.line([tuple(c - n * b["width_px"] / 2), tuple(c + n * b["width_px"] / 2)], fill=(0, 230, 255, 255), width=6)
        r = h.get("ring")
        if r and "x" in r:
            col = {"back": (40, 255, 60, 255), "palm": (255, 230, 0, 255), "side": (255, 230, 0, 255)}.get(r["view"], (255, 40, 40, 255))
            d.polygon(ring_outline(r), outline=col, width=4)
            if r["view"] == "hidden":
                d.line([r["x"] - 20, r["y"] - 20, r["x"] + 20, r["y"] + 20], fill=col, width=5)
                d.line([r["x"] - 20, r["y"] + 20, r["x"] + 20, r["y"] - 20], fill=col, width=5)
            if crop:
                s = max(140, int(r["width_px"] * 3.2))
                box = (int(r["x"] - s / 2), int(r["y"] - s / 2), int(r["x"] + s / 2), int(r["y"] + s / 2))
                zooms.append(bg.crop(box))
    z = tile / max(bg.size)
    full = bg.resize((round(bg.width * z), round(bg.height * z)), Image.LANCZOS)
    zw = tile // 2
    out = Image.new("RGB", (tile + zw, tile + 26), (36, 36, 36))
    out.paste(full.convert("RGB"), (0, 0))
    for i, zm in enumerate(zooms[:2]):
        out.paste(zm.resize((zw, zw), Image.LANCZOS).convert("RGB"), (tile, i * zw))
    dd = ImageDraw.Draw(out)
    dd.text((4, tile + 6), label, fill=(240, 240, 240), font=ImageFont.load_default())
    return out


def debug_sheet(tiles, path, cols=3):
    w, h = tiles[0].size
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w, rows * h), (20, 20, 20))
    for i, t in enumerate(tiles):
        r, c = divmod(i, cols)
        sheet.paste(t, (c * w, r * h))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sheet.save(path)


def tile_label(mid, entry):
    parts = [mid.replace("hand-", "")]
    for h in entry["hands"]:
        r = h.get("ring") or {}
        parts.append(f"{h['side'][0].upper()}:{r.get('view', '-')}/{r.get('source', '-')}"
                     f" w{r.get('width_px', 0):.0f} f{r.get('facing', 0)} c{r.get('curl_deg', 0):.0f}")
    return "  ".join(parts)


def main():
    import skin_hands as sh
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--poses", help="comma-separated master ids (default: every passing master)")
    p.add_argument("--sheet", action="store_true", help="only draw the debug sheets from the anchors file")
    p.add_argument("--per-sheet", type=int, default=12)
    args = p.parse_args()
    masters = sh.passing_masters()
    if args.poses:
        masters = [m for m in masters if m["id"] in args.poses.split(",")]
    with open(ANCHORS) as f:
        readme = json.load(f).get("_readme", "")
    anchors = sh.load_anchors()
    tiles = []
    for m in masters:
        mid = m["id"]
        im = Image.open(ga.resolve_path(m["output"])).convert("RGBA")
        if not args.sheet:
            update_pose(mid, anchors[mid], im)
            print(mid, tile_label(mid, anchors[mid]), flush=True)
        tiles.append(debug_tile(im, anchors[mid], tile_label(mid, anchors[mid])))
    if not args.sheet:
        sh.save_anchors(anchors, readme)
    for k in range(0, len(tiles), args.per_sheet):
        path = os.path.join(SHEETS, f"hands-rings-debug-{k // args.per_sheet + 1}.png")
        debug_sheet(tiles[k:k + args.per_sheet], path)
        print("wrote", path)


if __name__ == "__main__":
    main()
