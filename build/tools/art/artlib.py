"""Shared image functions for the art tools (cutter, judge). The keying, registration and export methods are
build/cut_clinic_heal_v3.py's (art plan section 8, on build/cut_tick_v2.py, rule D7): lifted unchanged so the
cutter reproduces that script's output."""
import os

import cv2
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

EDGE_SLICES = {  # the 3 px strip of each edge, as (rows, cols) for an HxW array
    "left": lambda h, w: (slice(None), slice(0, 3)), "right": lambda h, w: (slice(None), slice(w - 3, w)),
    "top": lambda h, w: (slice(0, 3), slice(None)), "bottom": lambda h, w: (slice(h - 3, h), slice(None)),
}


def load(p):
    return np.asarray(Image.open(p).convert("RGB")).astype(float)


def key(a, multi=400, exits=(), tol=10, glass=None, soft=False):
    """RGBA float array (alpha 0..1) of the object on the flat grey, plus the object mask. exits: the edges the
    object leaves by: the grey is not measured there. soft: partial alpha everywhere (glass, a drop, dust)."""
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
    if not parts:
        parts = [a[:6].reshape(-1, 3)]
    e = np.concatenate(parts)
    g = e[(e.max(1) - e.min(1) < 14) & (e.mean(1) > 90) & (e.mean(1) < 170)]  # the grey: edge pixels that ARE grey
    bg = np.median(g if len(g) > 200 else e, 0)
    d = np.abs(a - bg).max(2)
    flat = d < tol
    lab, _ = ndi.label(flat)
    border = np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    border = set(np.unique(border[border > 0]))
    sizes = np.bincount(lab.ravel())
    bgl = [l for l in border if sizes[l] > 2000]  # a big flat patch of skin touching an exit edge isn't background
    obj = ~np.isin(lab, bgl)
    obj = ndi.binary_opening(obj, iterations=1)
    obj = ndi.binary_fill_holes(obj)
    hole = (d < tol * 0.8) & obj  # enclosed background (between a plait and the neck) is a hole, not a part
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
    if soft:
        alpha = np.where(ndi.binary_dilation(obj, iterations=2), np.clip(up.max(2) * 2.2, 0, 1), 0)
    else:
        alpha = np.where(core, 1.0, alpha)
    if glass is not None:
        g2 = np.clip(up.max(2) * 1.6, 0, 1)
        alpha = np.where(glass & obj, g2, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(alpha[..., None] >= 0.999, a, np.clip((a - bg) / safe + bg, 0, 255))
    return np.dstack([rgb, alpha]), obj


def flush_exits(k, obj, exits):
    """Wherever the object reaches an exit edge, alpha is solid to the edge."""
    h, w = k.shape[:2]
    for e in exits:
        sl = EDGE_SLICES[e](h, w)
        k[..., 3][sl] = np.where(obj[sl], 1.0, k[..., 3][sl])
    return k


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


def sharpen2x(img):
    """The @2x of a close-up: Lanczos x2 and an unsharp mask."""
    im = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    rgb.putalpha(im.getchannel("A"))
    return rgb


def ecc(mov, ref, band, mode=cv2.MOTION_AFFINE, say=print):
    """Warp `mov` onto `ref`, measured on `band` (y0, y1 as fractions of the height). Returns warped image, matrix."""
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
        say("  ECC failed: %s" % e)
    out = cv2.warpAffine(mov.astype(np.float32), M, (w, h), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
    return out.astype(float), M


def changed(a, b, thr=45):
    return np.abs(a - b).sum(2) > thr


def leak(a, b, allowed):
    """The share of changed pixels outside the allowed region, after a 7x7 open (art plan section 7.3)."""
    c = changed(a, b)
    c = cv2.morphologyEx(c.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)) > 0
    return (c & ~allowed).sum() / c.size


def lab_of(c):
    return cv2.cvtColor(np.uint8([[c]]), cv2.COLOR_RGB2LAB)[0, 0].astype(float) * [100 / 255, 1, 1] - [0, 128, 128]


def skin_median(rgb, alpha, box, smin=60):
    """Median skin colour inside box (x0, y0, x1, y1 px) over the solid pixels, or None."""
    x0, y0, x1, y1 = box
    px = rgb[y0:y1, x0:x1][alpha[y0:y1, x0:x1] > 0.99]
    if not len(px):
        return None
    hsv = cv2.cvtColor(px.reshape(-1, 1, 3).astype(np.uint8), cv2.COLOR_RGB2HSV).reshape(-1, 3)
    sk = px[(hsv[:, 0] >= 5) & (hsv[:, 0] <= 22) & (hsv[:, 1] > smin) & (hsv[:, 1] < 170) & (hsv[:, 2] > 120)]
    return np.median(sk, 0) if len(sk) >= 50 else None


def delta_e(c1, c2):
    return float(np.linalg.norm(lab_of(c1) - lab_of(c2)))


def head_mask(r, base, ys_limit, neck, shape, grow=25, open_k=5):
    """The head region of an edit: the changed pixels above the collar as a filled hull, grown, cut at the collar."""
    H, W = shape
    c = changed(r, base) & (np.arange(H)[:, None] < ys_limit)
    c = cv2.morphologyEx(c.astype(np.uint8), cv2.MORPH_OPEN, np.ones((open_k, open_k), np.uint8))
    pts = cv2.findNonZero(c)
    m = np.zeros((H, W), np.uint8)
    if pts is not None:
        cv2.fillConvexPoly(m, cv2.convexHull(pts), 1)
    m = cv2.dilate(m, np.ones((grow, grow), np.uint8))
    return m
