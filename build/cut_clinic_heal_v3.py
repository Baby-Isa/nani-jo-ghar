#!/usr/bin/env python3
"""Cut the clinic heal art (pack clinic-heal-v3) and write data/clinic/heal-art.json.

The method is the art plan's section 8 (docs/design-language/art-plans/clinic-heal-art-plan.md) on
build/cut_tick_v2.py's keying (D7): the background measured from the outer 6 px; the object is everything not
connected to that flat grey, holes filled; edges by colour-to-alpha against the measured grey, a solid eroded core.
Registered states share one canvas (D8); the edits are ECC-registered to their original (the build/expressions.py
method). Close-ups keep their exit edges flush. Only the images that have landed are cut: a missing source is
skipped and listed, so the script can be re-run as the run uploads more.

  python3 build/cut_clinic_heal_v3.py            # cut everything that's there, write the data, print a report
  python3 build/cut_clinic_heal_v3.py --sheets D # also write judging contact sheets into folder D
"""
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO, "sources/art/clinic-heal-v3")
OUT = os.path.join(REPO, "assets/clinic")
DATA = os.path.join(REPO, "data/clinic/heal-art.json")
SKIN = np.array([0xC4, 0x9A, 0x78], float)
# The prompts' #C49A78 is a midtone; this sampler reads the lit skin of a render, and on the approved family art
# (assets/clinic/patients/ali/ali-sit.webp, ma-sit.webp) it reads #FA9C62 and #EC9360. A new patient is judged
# against that approved render (the art plan's ΔE 6 / 12 limits), so the cast matches Ali and Ma side by side.
SKIN_RENDER = np.array([0xF3, 0x98, 0x61], float)
REPORT = []


def log(*a):
    s = " ".join(str(x) for x in a)
    REPORT.append(s)
    print(s)


# judged a fail and not cut (the redo list in build/reports/a1-clinic-art.md): the stand-in stays for that piece
FAILED = {
    "child-u1-upperarm-v1.png": "sleeveless vest, bare shoulder; chin and plait in frame (modesty, I1)",
}


def src(name):
    if name in FAILED:
        log(f"  {name}: judged a fail, not cut ({FAILED[name]})")
        return None
    p = os.path.join(SRC, name)
    return p if os.path.exists(p) else None


def load(p):
    return np.asarray(Image.open(p).convert("RGB")).astype(float)


def rel(p):
    return os.path.relpath(p, REPO).replace(os.sep, "/")


# ---------------------------------------------------------------- keying

def bg_of(a):
    edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    return np.median(edge, 0)


def key(a, multi=400, exits=(), tol=10, glass=None):
    """RGBA float array (alpha 0..1) of the object on the flat grey. exits: the edges the object leaves by
    ('left', 'right', 'top', 'bottom'): there the border is not background. glass: an optional bool mask kept at
    its colour-to-alpha value (never a solid core)."""
    if exits:
        # measure the grey only on the edges the object doesn't leave by
        h, w = a.shape[:2]
        parts = []
        if "top" not in exits:
            parts.append(a[:6].reshape(-1, 3))
        if "bottom" not in exits:
            parts.append(a[-6:].reshape(-1, 3))
        if "left" not in exits:
            parts.append(a[:, :6].reshape(-1, 3))
        if "right" not in exits:
            parts.append(a[:, -6:].reshape(-1, 3))
        e = np.concatenate(parts)
    else:
        e = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    # the grey is measured on the edge pixels that ARE grey (an edge can carry skin, hair or a collar)
    g = e[(e.max(1) - e.min(1) < 14) & (e.mean(1) > 90) & (e.mean(1) < 170)]
    bg = np.median(g if len(g) > 200 else e, 0)
    d = np.abs(a - bg).max(2)
    flat = d < tol
    lab, _ = ndi.label(flat)
    border = np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    border = set(np.unique(border[border > 0]))
    # a flat region counts as background only when it is big (a big flat patch of skin touching an exit edge isn't)
    sizes = np.bincount(lab.ravel())
    bgl = [l for l in border if sizes[l] > 2000]
    obj = ~np.isin(lab, bgl)
    obj = ndi.binary_opening(obj, iterations=1)
    obj = ndi.binary_fill_holes(obj)
    # enclosed background (the grey between a plait and the neck): a big flat patch of the measured grey inside the
    # figure is a hole, not a part; small flat patches (a highlight on the sleeve) stay
    hole = (d < tol * 0.8) & obj
    hl, hn = ndi.label(hole)
    if hn:
        hs = np.bincount(hl.ravel())
        big = [i for i in range(1, hn + 1) if hs[i] > 600]
        if big:
            obj &= ~ndi.binary_dilation(np.isin(hl, big), iterations=1)
    lb, n = ndi.label(obj)
    if n > 1:
        sz = np.bincount(lb.ravel())
        sz[0] = 0
        keep = [i for i in range(1, n + 1) if sz[i] >= multi] or [int(np.argmax(sz))]
        obj = np.isin(lb, keep)
    core = ndi.binary_erosion(obj, iterations=3)
    up = np.where(a > bg, (a - bg) / np.maximum(1, 255 - bg), (bg - a) / np.maximum(1, bg))
    alpha = np.clip(up.max(2), 0, 1)
    alpha = np.where(ndi.binary_dilation(obj, iterations=2), alpha, 0)
    alpha = np.clip((alpha - 0.04) / 0.5, 0, 1)  # a strong ramp: soft antialiasing, no grey halo
    alpha = np.where(core, 1.0, alpha)
    if glass is not None:
        g = np.clip(up.max(2) * 1.6, 0, 1)
        alpha = np.where(glass & obj, g, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(alpha[..., None] >= 0.999, a, np.clip((a - bg) / safe + bg, 0, 255))
    # exit edges stay flush: the last rows/columns are solid where the object touches them
    return np.dstack([rgb, alpha]), obj


def bbox(alpha, thr=0.04):
    ys, xs = np.nonzero(alpha > thr)
    return [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]


def to_img(rgba):
    return Image.fromarray(np.dstack([np.clip(rgba[..., :3], 0, 255), np.clip(rgba[..., 3] * 255, 0, 255)]).astype(np.uint8), "RGBA")


def save(img, path, q=90, size=None, two=None):
    """Save a webp at `size` (w, h) and, when `two` is given, the @2x at that size. Returns the paths."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out = []
    if two:
        im2 = img if img.size == tuple(two) else img.resize(tuple(two), Image.LANCZOS)
        p2 = path.replace(".webp", "@2x.webp")
        im2.save(p2, quality=q, method=6)
        out.append(p2)
    im1 = img if size is None or img.size == tuple(size) else img.resize(tuple(size), Image.LANCZOS)
    im1.save(path, quality=q, method=6)
    out.insert(0, path)
    return out


# ---------------------------------------------------------------- registration (the build/expressions.py method)

def ecc(mov, ref, band, mode=cv2.MOTION_AFFINE):
    """Warp `mov` onto `ref`, measured on `band` (y0, y1 as fractions of the height). Returns the warped image and
    the warp matrix."""
    h, w = ref.shape[:2]
    y0, y1 = int(band[0] * h), int(band[1] * h)
    g = lambda x: cv2.GaussianBlur(cv2.cvtColor(x.astype(np.uint8), cv2.COLOR_RGB2GRAY), (5, 5), 0).astype(np.float32) / 255
    a, b = g(ref), g(mov)
    mask = np.zeros((h, w), np.uint8)
    mask[y0:y1] = 255
    M = np.eye(2, 3, dtype=np.float32)
    try:
        _, M = cv2.findTransformECC(a, b, M, mode, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), mask, 5)
    except cv2.error as e:
        log("  ECC failed:", e)
    out = cv2.warpAffine(mov.astype(np.float32), M, (w, h), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
    return out.astype(float), M


def changed(a, b, thr=45):
    return np.abs(a - b).sum(2) > thr


def leak(a, b, allowed):
    """The share of changed pixels outside the allowed region, after a 7x7 open (art plan section 7.3)."""
    c = changed(a, b)
    c = cv2.morphologyEx(c.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)) > 0
    out = c & ~allowed
    return out.sum() / c.size


def skin_check(rgb, alpha, box, name):
    """Median skin colour inside box (x0, y0, x1, y1 in px) against #C49A78, as a Lab distance (ΔE76)."""
    x0, y0, x1, y1 = box
    px = rgb[y0:y1, x0:x1][alpha[y0:y1, x0:x1] > 0.99]
    if not len(px):
        return None
    hsv = cv2.cvtColor(px.reshape(-1, 1, 3).astype(np.uint8), cv2.COLOR_RGB2HSV).reshape(-1, 3)
    sk = px[(hsv[:, 0] >= 5) & (hsv[:, 0] <= 22) & (hsv[:, 1] > 60) & (hsv[:, 1] < 170) & (hsv[:, 2] > 120)]
    if len(sk) < 50:
        return None
    m = np.median(sk, 0)
    lab = lambda c: cv2.cvtColor(np.uint8([[c]]), cv2.COLOR_RGB2LAB)[0, 0].astype(float) * [100 / 255, 1, 1] - [0, 128, 128]
    de = float(np.linalg.norm(lab(m) - lab(SKIN_RENDER)))
    log(f"  skin {name}: #{int(m[0]):02X}{int(m[1]):02X}{int(m[2]):02X} ΔE {de:.1f} from the approved family render" + (" (colour-correct)" if de > 6 else "") + (" FAIL" if de > 12 else ""))
    return de


def sharpen2x(img):
    """The @2x of a close-up: Lanczos x2 and an unsharp mask (Real-ESRGAN isn't installable here; question 3)."""
    im = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    rgb.putalpha(im.getchannel("A"))
    return rgb


# ---------------------------------------------------------------- the patients' wide poses

FIG_H = {"child": 440, "adult": 575}  # the drawn height on the room (1x): the plan says ~410 for a child; 440 measured by overlay so the feet reach the step stool
FACES = ["happy", "sad", "pain", "hot", "cold"]
KINDS = {  # kind id in the game -> run-list prefix, age group
    "girl": ("girl", "child"),
    "boy": ("boy", "child"),
    "old-man": ("oldman", "adult"),
    "old-woman": ("oldwoman", "adult"),
    "uncle": ("man", "adult"),
    "auntie": ("woman", "adult"),
}
# Zoom anchors on the front-on (W1) and side-on (W7) source pictures, in source px (1024 x 1536), measured by eye on
# the gridded overlays (build/screenshots/a1/); the patient's own sides: on the front pose their left is on the
# viewer's right. Converted to canvas fractions in the data.
ANCHORS = {
    "girl": {
        "front": {
            "forehead": [512, 240], "eyes": [512, 330], "mouth": [512, 420], "ear.left": [700, 360], "ear.right": [322, 365],
            "upperarm.left": [690, 680], "upperarm.right": [332, 680], "forearm.left": [640, 850], "forearm.right": [384, 850],
            "hand": [512, 900], "tummy": [512, 790], "knee.left": [610, 1040], "knee.right": [414, 1040],
            "foot.left": [625, 1350], "foot.right": [395, 1350], "head": [512, 330], "seat": [512, 1040],
        },
        "side": {
            "ear": [415, 375], "eyes": [580, 315], "knee": [740, 960], "head": [480, 320], "foot": [720, 1280], "seat": [480, 1030],
        },
        "sideScale": 1.11,
        "neck": 540,
    },
}


def cut_wide(kind):
    p, age = KINDS[kind]
    w1p = src(f"{p}-w1-front-neutral-v1.png")
    if not w1p:
        log(f"{kind}: no W1 yet")
        return None
    log(f"{kind}: wide poses")
    w1 = load(w1p)
    H, W = w1.shape[:2]
    k1, obj1 = key(w1)
    skin_check(w1, k1[..., 3], (int(W * .35), int(H * .2), int(W * .65), int(H * .38)), f"{kind} W1 face")
    figs = {"front": k1}
    # the head band: from the top to the collar (the neck's narrowest row in the top half)
    rows = obj1.sum(1)
    top = int(np.argmax(rows > 0))
    ys = np.arange(H)
    neck = ANCHORS.get(kind, {}).get("neck", int(0.35 * H))  # the collar, measured on the grid
    log(f"  head band y {top}..{neck}")
    faces = {}
    for i, f in enumerate(FACES):
        fp = src(f"{p}-w{i + 2}-front-{f}-v1.png")
        if not fp:
            log(f"  W{i + 2} {f}: not landed")
            continue
        e = load(fp)
        if e.shape != w1.shape:
            e = np.asarray(Image.fromarray(e.astype(np.uint8)).resize((W, H), Image.LANCZOS)).astype(float)
        r, M = ecc(e, w1, (top / H, (neck + 40) / H))
        # the head region: the changed pixels above the collar, as a filled hull, grown and feathered
        c = changed(r, w1) & (ys[:, None] < neck + 30)
        c = cv2.morphologyEx(c.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        pts = cv2.findNonZero(c)
        m = np.zeros((H, W), np.uint8)
        if pts is not None:
            cv2.fillConvexPoly(m, cv2.convexHull(pts), 1)
        m = cv2.dilate(m, np.ones((25, 25), np.uint8))
        m[neck + 30:] = 0
        allowed = m > 0
        lk = leak(r, w1, allowed)
        log(f"  W{i + 2} {f}: shift {M[0, 2]:+.1f},{M[1, 2]:+.1f} px, leak outside the head {lk * 100:.2f}%" + (" REDO" if lk > 0.015 else ""))
        soft = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 6)
        kr, _ = key(r)
        a = np.minimum(soft, kr[..., 3])
        faces[f] = np.dstack([r, a])
    for n, (tag, band) in {"blanket": ("w9", (0.74, 0.93)), "bottle": ("w10", (0.74, 0.93))}.items():
        fp = src(f"{p}-{tag}-{n}-v1.png")
        if not fp:
            log(f"  {tag.upper()} {n}: not landed")
            continue
        e = load(fp)
        r, M = ecc(e, w1, band, cv2.MOTION_TRANSLATION)
        # a fresh prompt can come back a little bigger or smaller: when the legs still drift, fit them by scale too
        kr, _ = key(r)
        lb = np.zeros((H, W), bool)
        lb[int(band[0] * H):int(band[1] * H)] = True
        if np.abs(kr[..., 3] - k1[..., 3])[lb].mean() > 0.02:
            r2, M2 = ecc(e, w1, band, cv2.MOTION_AFFINE)
            kr2, _ = key(r2)
            if np.abs(kr2[..., 3] - k1[..., 3])[lb].mean() < np.abs(kr[..., 3] - k1[..., 3])[lb].mean():
                log(f"  {tag.upper()}: fitted by scale {np.hypot(M2[0, 0], M2[1, 0]):.3f} on the legs (an interim; the redo list has it)")
                r, M = r2, M2
        legs = np.zeros((H, W), bool)
        legs[int(band[0] * H):int(band[1] * H)] = True
        kr, _ = key(r)
        drift = np.abs(kr[..., 3] - k1[..., 3])[legs].mean()
        log(f"  {tag.upper()} {n}: shift {M[0, 2]:+.1f},{M[1, 2]:+.1f} px; leg-band alpha drift {drift * 100:.2f}%" + (" REDO" if drift > 0.02 else ""))
        figs[n] = kr
    # one canvas for every front pose: the union of their boxes, 16 px pad (scaled), bottom = the feet
    boxes = [bbox(f[..., 3]) for f in figs.values()]
    x0 = min(b[0] for b in boxes)
    y0 = min(b[1] for b in boxes)
    x1 = max(b[2] for b in boxes)
    y1 = max(b[3] for b in boxes)
    fh = bbox(k1[..., 3])
    s1 = FIG_H[age] / (fh[3] - fh[1])  # 1x scale: W1's figure at its drawn height
    pad = int(round(16 / s1))
    cx0, cy0, cx1, cy1 = max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad)
    cw, ch = cx1 - cx0, cy1 - cy0
    size1 = (round(cw * s1), round(ch * s1))
    size2 = (size1[0] * 2, size1[1] * 2)
    if size2[1] > ch:  # never upscale the wide poses: the @2x is at most the source
        size2 = (cw, ch)
    base = f"{OUT}/patients/{kind}/{kind}"
    out = {"canvas": [cw, ch], "src": [cx0, cy0], "w": size1[0], "h": size1[1]}
    crop = lambda r: to_img(r[cy0:cy1, cx0:cx1])
    for n, f in figs.items():
        name = "front" if n == "front" else f"front-{n}"
        out[n] = rel(save(crop(f), f"{base}-{name}.webp", 90, size1, size2)[0])
    out["faces"] = {}
    for f, r in faces.items():
        out["faces"][f] = rel(save(crop(r), f"{base}-face-{f}.webp", 92, size1, size2)[0])
    # the seat line (the lowest row of the thighs' level part) and the feet, in canvas fractions
    ys1, xs1 = np.nonzero(k1[..., 3] > 0.5)
    feet = ys1.max()
    out["feet"] = round((feet - cy0) / ch, 4)
    an = ANCHORS.get(kind, {}).get("front", {})
    out["anchors"] = {k: [round((v[0] - cx0) / cw, 4), round((v[1] - cy0) / ch, 4)] for k, v in an.items()}
    # the corner faces: square head crops, eye line at 42 %, face width fixed (D18)
    heads = {}
    ey = an.get("eyes", [W / 2, top + 0.3 * (neck - top)])
    side = int((neck - top) * 1.25)
    hx0 = int(ey[0] - side / 2)
    hy0 = int(ey[1] - 0.42 * side)
    for f, r in [("neutral", k1)] + list(faces.items()):
        full = k1.copy()
        if f != "neutral":
            a = r[..., 3:4]
            full[..., :3] = full[..., :3] * (1 - a) + r[..., :3] * a
        sq = np.zeros((side, side, 4))
        ya, xa = max(0, hy0), max(0, hx0)
        yb, xb = min(H, hy0 + side), min(W, hx0 + side)
        sq[ya - hy0:yb - hy0, xa - hx0:xb - hx0] = full[ya:yb, xa:xb]
        heads[f] = rel(save(to_img(sq), f"{base}-head-{f}.webp", 92, (512, 512))[0])
    out["heads"] = heads
    # the side-on pose (W7) and its happy face (W8)
    w7p = src(f"{p}-w7-side-neutral-v1.png")
    if w7p:
        w7 = load(w7p)
        k7, o7 = key(w7)
        b7 = bbox(k7[..., 3])
        # the side pose is drawn a little smaller than the front by the generator: scaled so the heads match
        s7 = s1 * ANCHORS.get(kind, {}).get("sideScale", 1)
        pad7 = int(round(16 / s7))
        sx0, sy0, sx1, sy1 = max(0, b7[0] - pad7), max(0, b7[1] - pad7), min(W, b7[2] + pad7), min(H, b7[3] + pad7)
        sw, sh = sx1 - sx0, sy1 - sy0
        z1 = (round(sw * s7), round(sh * s7))
        z2 = (min(sw, z1[0] * 2), min(sh, z1[1] * 2))
        sd = {"canvas": [sw, sh], "src": [sx0, sy0], "w": z1[0], "h": z1[1], "feet": round((b7[3] - sy0) / sh, 4)}
        sd["file"] = rel(save(to_img(k7[sy0:sy1, sx0:sx1]), f"{base}-side.webp", 90, z1, z2)[0])
        # the seat: the bottom of the thighs (the lowest row of the figure left of the knee bend)
        sd["anchors"] = {k: [round((v[0] - sx0) / sw, 4), round((v[1] - sy0) / sh, 4)] for k, v in ANCHORS.get(kind, {}).get("side", {}).items()}
        w8p = src(f"{p}-w8-side-happy-v1.png")
        if w8p:
            e = load(w8p)
            r, M = ecc(e, w7, (b7[1] / H, 0.4))
            c = changed(r, w7) & (np.arange(H)[:, None] < int(0.4 * H))
            pts = cv2.findNonZero(cv2.morphologyEx(c.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)))
            m = np.zeros((H, W), np.uint8)
            if pts is not None:
                cv2.fillConvexPoly(m, cv2.convexHull(pts), 1)
            m = cv2.dilate(m, np.ones((25, 25), np.uint8))
            lk = leak(r, w7, m > 0)
            log(f"  W8 side happy: leak {lk * 100:.2f}%" + (" REDO" if lk > 0.015 else ""))
            soft = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 6)
            k8, _ = key(r)
            sd["happy"] = rel(save(to_img(np.dstack([r, np.minimum(soft, k8[..., 3])])[sy0:sy1, sx0:sx1]), f"{base}-side-face-happy.webp", 92, z1, z2)[0])
        else:
            log("  W8 side happy: not landed")
        out["side"] = sd
    else:
        log("  W7 side: not landed")
    out["age"] = age
    return out


# ---------------------------------------------------------------- close-ups

def cut_closeup(name, srcname, exits, outpath, states=None, register=None, glass=None):
    """A close-up: keyed with its exit edges flush, exported at the source size and an @2x. states: {suffix: file}
    registered to the first and exported on the same canvas."""
    p = src(srcname)
    if not p:
        log(f"{name}: not landed")
        return None
    a = load(p)
    k, obj = key(a, exits=exits)
    # exit edges: wherever the object reaches the edge, alpha is solid to the edge
    H, W = a.shape[:2]
    for e in exits:
        sl = {"left": (slice(None), slice(0, 3)), "right": (slice(None), slice(W - 3, W)), "top": (slice(0, 3), slice(None)), "bottom": (slice(H - 3, H), slice(None))}[e]
        k[..., 3][sl] = np.where(obj[sl], 1.0, k[..., 3][sl])
    log(f"{name}: cut, exits {','.join(exits)}")
    files = save_closeup(k, outpath)
    out = {"file": rel(files[0]), "size": [W, H], "exits": list(exits), "box": [round(v / s, 4) for v, s in zip(bbox(k[..., 3]), [W, H, W, H])]}
    for suf, (fname, band) in (states or {}).items():
        sp = src(fname)
        if not sp:
            log(f"  {suf}: not landed")
            continue
        e = load(sp)
        if e.shape != a.shape:
            e = np.asarray(Image.fromarray(e.astype(np.uint8)).resize((W, H), Image.LANCZOS)).astype(float)
        if band:
            e, M = ecc(e, a, band, cv2.MOTION_TRANSLATION)
            log(f"  {suf}: shift {M[0, 2]:+.1f},{M[1, 2]:+.1f} px")
        ke, oe = key(e, exits=exits)
        for ed in exits:
            sl = {"left": (slice(None), slice(0, 3)), "right": (slice(None), slice(W - 3, W)), "top": (slice(0, 3), slice(None)), "bottom": (slice(H - 3, H), slice(None))}[ed]
            ke[..., 3][sl] = np.where(oe[sl], 1.0, ke[..., 3][sl])
        out[suf] = rel(save_closeup(ke, outpath.replace(".webp", f"-{suf}.webp"))[0])
    return out


def save_closeup(k, path):
    img = to_img(k)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, quality=90, method=6)
    p2 = path.replace(".webp", "@2x.webp")
    sharpen2x(img).save(p2, quality=88, method=6)
    return [path, p2]


# ---------------------------------------------------------------- props (grid sheets)

def cut_grid(srcname, names, outdir, min_area=1500, glass=()):
    """Cut a prop sheet by its gutters: each separate piece, left to right, top to bottom, trimmed with a 16 px pad,
    at most 512 px. names: the file names in reading order (None skips a piece)."""
    p = src(srcname)
    if not p:
        log(f"{srcname}: not landed")
        return {}
    a = load(p)
    k, obj = key(a, multi=min_area)
    lb, n = ndi.label(ndi.binary_dilation(obj, iterations=6))
    pieces = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lb == i)
        if len(ys) < min_area:
            continue
        pieces.append((ys.min(), xs.min(), ys.max() + 1, xs.max() + 1, i))
    # reading order: rows by the top, then left to right
    pieces.sort(key=lambda t: (round(((t[0] + t[2]) / 2) / (a.shape[0] / 3)), t[1]))
    log(f"{srcname}: {len(pieces)} pieces for {len(names)} names")
    out = {}
    for (y0, x0, y1, x1, i), nm in zip(pieces, names):
        if not nm:
            continue
        m = lb[y0:y1, x0:x1] == i
        piece = k[y0:y1, x0:x1].copy()
        piece[..., 3] *= m
        img = to_img(piece)
        pad = Image.new("RGBA", (img.width + 32, img.height + 32), (0, 0, 0, 0))
        pad.alpha_composite(img, (16, 16))
        s = min(1, 512 / max(pad.size))
        if s < 1:
            pad = pad.resize((round(pad.width * s), round(pad.height * s)), Image.LANCZOS)
        path = f"{outdir}/{nm}.webp"
        os.makedirs(outdir, exist_ok=True)
        pad.save(path, quality=90, method=6)
        out[nm] = {"file": rel(path), "w": pad.width, "h": pad.height}
    return out


# ---------------------------------------------------------------- run

def main():
    sheets = None
    if "--sheets" in sys.argv:
        sheets = sys.argv[sys.argv.index("--sheets") + 1]
    data = json.load(open(DATA)) if os.path.exists(DATA) else {}
    data["_about"] = ("The clinic heal art (pack clinic-heal-v3), written by build/cut_clinic_heal_v3.py from "
                      "sources/art/clinic-heal-v3/ (art plan section 8). patients: kind -> the wide poses on one canvas "
                      "(front, faces = head layers on the same canvas, blanket/bottle whole figures, side = W7 with its "
                      "happy face), the canvas size in source px and the 1x size, `feet` = the feet line, anchors = "
                      "zoom anchors as canvas fractions (the patient's own sides). heads = the 512 px corner faces. "
                      "closeups: set -> part -> file, states, source size, exit edges, the part's box (fractions). "
                      "Every file has an @2x beside it except the heads and props.")
    data.setdefault("patients", {})
    for kind in KINDS:
        r = cut_wide(kind)
        if r:
            data["patients"][kind] = r
    data.setdefault("closeups", {})
    cl = data["closeups"]
    for st, who in [("child", "child"), ("adult", "adult")]:
        d = cl.setdefault(st, {})
        r = cut_closeup(f"{st} K", f"{who}-k1-knee-v1.png", ("left", "bottom"), f"{OUT}/closeups/{st}/knee.webp",
                        {"kick": (f"{who}-k2-knee-kick-v1.png", (0.0, 0.45)), "graze": (f"{who}-k3-knee-graze-v1.png", (0.0, 1.0))})
        if r: d["knee"] = r
        r = cut_closeup(f"{st} F", f"{who}-f1-forearm-v1.png", ("left",), f"{OUT}/closeups/{st}/forearm.webp",
                        {"graze": (f"{who}-f2-forearm-graze-v1.png", (0.0, 1.0)), "cut": (f"{who}-f4-forearm-cut-v1.png", (0.0, 1.0))})
        if r: d["forearm"] = r
        r = cut_closeup(f"{st} U", f"{who}-u1-upperarm-v1.png", ("left", "bottom"), f"{OUT}/closeups/{st}/upperarm.webp")
        if r: d["upperarm"] = r
        r = cut_closeup(f"{st} P", f"{who}-p1-sole-v1.png", ("bottom",), f"{OUT}/closeups/{st}/sole.webp")
        if r: d["sole"] = r
    for kind, (p, age) in KINDS.items():
        d = cl.setdefault(kind, {})
        r = cut_closeup(f"{kind} E", f"{p}-e1-ear-v1.png", ("top", "right", "bottom"), f"{OUT}/closeups/{kind}/ear.webp")
        if r: d["ear"] = r
        # the run framed the girl's M1 and M2 wider than asked (ears and plaits at the sides): the face leaves only
        # by the top; the games place them so the sides are off screen
        r = cut_closeup(f"{kind} M1", f"{p}-m1-mouth-v1.png", ("top",), f"{OUT}/closeups/{kind}/mouth.webp")
        if r: d["mouth"] = r
        r = cut_closeup(f"{kind} M2", f"{p}-m2-tongue-v1.png", ("top",), f"{OUT}/closeups/{kind}/tongue.webp")
        if r: d["tongue"] = r
        r = cut_closeup(f"{kind} Y", f"{p}-y1-eyes-v1.png", ("left", "right"), f"{OUT}/closeups/{kind}/eyes.webp",
                        {"sore": (f"{p}-y2-eye-sore-v1.png", (0.0, 1.0)), "closed": (f"{p}-y3-eyes-closed-v1.png", (0.0, 1.0))})
        if r: d["eyes"] = r
        r = cut_closeup(f"{kind} T1", f"{p}-t1-eyetest-a-v1.png", ("bottom",), f"{OUT}/closeups/{kind}/eyetest-a.webp")
        if r: d["eyetest-a"] = r
        r = cut_closeup(f"{kind} T2", f"{p}-t2-eyetest-b-v1.png", ("bottom",), f"{OUT}/closeups/{kind}/eyetest-b.webp")
        if r: d["eyetest-b"] = r
        if not d:
            del cl[kind]
    data["_report"] = REPORT
    with open(DATA, "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    log("wrote", rel(DATA))


if __name__ == "__main__":
    main()
