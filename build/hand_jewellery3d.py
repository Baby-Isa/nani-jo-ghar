#!/usr/bin/env python3
"""Jewellery rendered in 3D for the hand skins (hands v3, 26 Sept 2026).

v1/v2 drew the jewellery as flat 2D sprites (an outlined oval "sticker" for
the aqiq, a row of white dots for the tennis bracelet, outline ellipses for
the bangles). Zafar's verdict: they don't match the hands' soft 3D render.
This module replaces them with a small ray-caster, so every piece is real
geometry, lit like the hands:

  * scene: quadrics (spheres, ellipsoids, cylinders) under an orthographic
    camera looking down -z; world x right, y up, z towards the viewer; the
    image pixel (X, Y) is world (X, -Y). Rays are solved analytically.
  * rings: a band (a torus of flattened ellipsoids round the finger axis),
    a bezel and an oval cabochon (aqiq) or a basket, six claws and a
    faceted round brilliant (solitaire). The finger is a cylinder occluder
    on the same axis: whatever lies behind it is hidden, so the band wraps
    round and its back half disappears; the stone sits where the view puts
    it (back: facing the camera; palm: behind the finger, so only the band
    shows; side: in profile on the edge).
  * wrist: the tennis bracelet is a chain of white-gold cups, each holding
    a faceted diamond; glass bangles are thin tori of tinted glass (plus
    one gold). The forearm is a cylinder occluder, tipped a little out of
    the picture plane, so each circle shows as a curved front arc with its
    back half hidden behind the arm and just its ends peeping out at the
    sides.
  * shading: soft key light from the upper left (the hands' light), wrap
    diffuse, a sky/floor environment term for the metals, broad plus tight
    speculars, faceted normals and per-facet glints for diamonds, a
    translucent core glow for the carnelian and rim saturation for glass.
    At composite time each piece is multiplied by the local skin
    illumination (so a ring in shadow is darker) and casts a soft contact
    shadow onto the skin, down and to the right.

Everything renders at 3x and is downsampled. Used by build/skin_hands.py.
"""
import math

import numpy as np
from PIL import Image, ImageFilter

SS = 3  # supersampling

# light from the upper left, a little towards the viewer (world: y up, z to viewer)
L = np.array([-0.55, 0.62, 0.56])
L = L / np.linalg.norm(L)
V = np.array([0.0, 0.0, 1.0])
HV = (L + V) / np.linalg.norm(L + V)


def _unit(v):
    v = np.asarray(v, dtype=np.float64)
    return v / np.linalg.norm(v)


def _frame(axis):
    """Two unit vectors perpendicular to axis: u (the one closest to the
    camera direction +z) and v = axis x u."""
    a = _unit(axis)
    u = V - a * a.dot(V)
    if np.linalg.norm(u) < 1e-6:
        u = np.array([1.0, 0.0, 0.0]) - a * a[0]
    u = _unit(u)
    return u, np.cross(a, u)


class Prim:
    """A quadric (p-c)^T M (p-c) = 1. mat: material name or 'occ' (occluder,
    hides what is behind it and draws nothing). normal: None (the quadric's
    own), ('torus', centre, axis, R, r_rad, r_ax), or ('facet', axis, n_az,
    seed). zmax: only the part with (p-c).clip_axis <= zmax is kept (for
    the loose back/front halves)."""

    def __init__(self, c, M, mat, normal=None, alpha=1.0):
        self.c = np.asarray(c, dtype=np.float64)
        self.M = np.asarray(M, dtype=np.float64)
        self.mat = mat
        self.normal = normal
        self.alpha = alpha


def ellipsoid(c, axes, radii, mat, **kw):
    """axes: three orthonormal vectors, radii: their semi-axes."""
    R = np.stack([_unit(a) for a in axes], axis=1)
    D = np.diag([1.0 / (r * r) for r in radii])
    return Prim(c, R @ D @ R.T, mat, **kw)


def sphere(c, r, mat, **kw):
    return Prim(c, np.eye(3) / (r * r), mat, **kw)


def cylinder(c, axis, r):
    a = _unit(axis)
    return Prim(c, (np.eye(3) - np.outer(a, a)) / (r * r), "occ")


def _extent(p):
    """Half extents in x and y of the prim's projection (inf for cylinders)."""
    try:
        Mi = np.linalg.inv(p.M)
    except np.linalg.LinAlgError:
        return None
    ex, ey = math.sqrt(max(Mi[0, 0], 0)), math.sqrt(max(Mi[1, 1], 0))
    return ex, ey


# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------

def render(prims, box, zfilter=None):
    """Render prims over the image box (x0, y0, x1, y1) in image pixels.
    Returns an RGBA float array (y, x, 4) at 1x, premultiplied off, and the
    per-pixel front depth of the jewellery (nan where none).
    zfilter: None, 'front' (keep z >= 0 relative to 'zref' of prims) or
    'back' - used for the loose sprites."""
    x0, y0, x1, y1 = box
    W, Hh = int(x1 - x0) * SS, int(y1 - y0) * SS
    xs = x0 + (np.arange(W) + 0.5) / SS
    ys = y0 + (np.arange(Hh) + 0.5) / SS
    X, Y = np.meshgrid(xs, -ys)  # world coords (y up)
    zbuf = np.full((Hh, W), -np.inf)
    idb = np.full((Hh, W), -1, dtype=np.int32)
    for k, p in enumerate(prims):
        ext = _extent(p) if p.mat != "occ" else None
        if ext is not None:
            cx, cy = p.c[0], -p.c[1]  # image coords of centre
            ix0 = max(0, int(((cx - ext[0]) - x0) * SS) - 2)
            ix1 = min(W, int(((cx + ext[0]) - x0) * SS) + 3)
            iy0 = max(0, int(((cy - ext[1]) - y0) * SS) - 2)
            iy1 = min(Hh, int(((cy + ext[1]) - y0) * SS) + 3)
            if ix0 >= ix1 or iy0 >= iy1:
                continue
        else:
            ix0, ix1, iy0, iy1 = 0, W, 0, Hh
        dx = X[iy0:iy1, ix0:ix1] - p.c[0]
        dy = Y[iy0:iy1, ix0:ix1] - p.c[1]
        M = p.M
        a = M[2, 2]
        b = 2 * (M[2, 0] * dx + M[2, 1] * dy)
        cc = M[0, 0] * dx * dx + 2 * M[0, 1] * dx * dy + M[1, 1] * dy * dy - 1
        if abs(a) < 1e-12:
            continue
        disc = b * b - 4 * a * cc
        ok = disc >= 0
        w = np.where(ok, (-b + np.sqrt(np.where(ok, disc, 0))) / (2 * a), -np.inf)
        z = p.c[2] + w
        if zfilter is not None and p.mat != "occ":
            keep = (z >= p_zref(p)) if zfilter == "front" else (z < p_zref(p))
            # for the back half we want the far surface: use the other root
            if zfilter == "back":
                wb = np.where(ok, (-b - np.sqrt(np.where(ok, disc, 0))) / (2 * a), -np.inf)
                zb = p.c[2] + wb
                z = np.where(z >= p_zref(p), np.where(zb < p_zref(p), zb, -np.inf), z)
                keep = np.isfinite(z)
            z = np.where(keep, z, -np.inf)
        sub = zbuf[iy0:iy1, ix0:ix1]
        win = z > sub
        sub[win] = z[win]
        idb[iy0:iy1, ix0:ix1][win] = k
    rgba = np.zeros((Hh, W, 4))
    for k, p in enumerate(prims):
        if p.mat == "occ":
            continue
        m = idb == k
        if not m.any():
            continue
        P = np.stack([X[m], Y[m], zbuf[m]], axis=1)
        n = _normals(p, P)
        col, al = _shade(p, n, P)
        rgba[m, :3] = col
        rgba[m, 3] = al
    # downsample (average colour weighted by alpha)
    h1, w1 = Hh // SS, W // SS
    r = rgba[:h1 * SS, :w1 * SS].reshape(h1, SS, w1, SS, 4)
    a = r[..., 3].mean(axis=(1, 3))
    c = (r[..., :3] * r[..., 3:4]).sum(axis=(1, 3)) / np.maximum(r[..., 3].sum(axis=(1, 3)), 1e-6)[..., None]
    out = np.concatenate([c, a[..., None]], axis=2)
    return out


def p_zref(p):
    return getattr(p, "zref", 0.0)


def _normals(p, P):
    d = P - p.c
    if p.normal is None:
        n = d @ p.M.T
    elif p.normal[0] == "torus":
        _, C, A, R, rr, ra = p.normal
        q = P - C
        ax = q @ A
        qa = q - np.outer(ax, A)
        rho = np.linalg.norm(qa, axis=1, keepdims=True)
        er = qa / np.maximum(rho, 1e-9)
        n = er * ((rho - R) / (rr * rr)) + np.outer(ax / (ra * ra), A)
    elif p.normal[0] == "facet":
        _, S, naz, seed = p.normal
        n0 = d @ p.M.T
        n0 = n0 / np.linalg.norm(n0, axis=1, keepdims=True)
        u, v = _frame(S)
        cs = n0 @ S
        pol = np.degrees(np.arccos(np.clip(cs, -1, 1)))
        az = np.arctan2(n0 @ v, n0 @ u)
        # table (flat top), two crown tiers, girdle/pavilion
        tier = np.digitize(pol, [22, 42, 64])
        offs = np.where(tier % 2 == 1, 0.5, 0.0)
        step = 2 * np.pi / naz
        azq = (np.floor(az / step + offs) + 0.5 - offs) * step
        polq = np.radians(np.choose(tier, [0.0, 32.0, 52.0, 76.0]))
        n = (np.outer(np.cos(polq), S) + (np.sin(polq) * np.cos(azq))[:, None] * u
             + (np.sin(polq) * np.sin(azq))[:, None] * v)
        # per-facet id for glints
        p._facet = (tier * 97 + np.floor(az / step + offs).astype(int) * 13 + seed) % 23
    else:
        n = d @ p.M.T
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-9)


MATS = {
    "gold": dict(base=(0.93, 0.68, 0.28), metal=True),
    "gold_dark": dict(base=(0.84, 0.60, 0.24), metal=True),
    "whitegold": dict(base=(0.80, 0.81, 0.84), metal=True),
    "aqiq": dict(base=(0.66, 0.13, 0.06)),
    "diamond": dict(base=(0.86, 0.90, 0.95)),
    "glass_red": dict(base=(0.78, 0.07, 0.12), glass=True),
    "glass_green": dict(base=(0.07, 0.55, 0.24), glass=True),
}


def _shade(p, n, P):
    m = MATS[p.mat]
    base = np.array(m["base"])
    nl = n @ L
    wrap = np.clip((nl + 0.45) / 1.45, 0, 1)
    nh = np.clip(n @ HV, 0, 1)
    nz = np.clip(n[:, 2], 0, 1)
    ny = n[:, 1]
    alpha = np.full(len(n), p.alpha)
    if m.get("metal"):
        sky = np.array([1.0, 0.95, 0.84])
        floor = np.array([0.30, 0.20, 0.13])
        t = np.clip(0.5 + 0.5 * ny - 0.25 * n[:, 0], 0, 1)[:, None]
        env = floor * (1 - t) + sky * t
        col = base * (0.18 + 0.52 * wrap[:, None] + 0.42 * env)
        col += (0.55 * nh ** 36 + 0.18 * nh ** 8)[:, None] * np.array([1.0, 0.96, 0.86])
        col *= (0.78 + 0.22 * nz)[:, None]  # soft darkening towards the silhouette
    elif p.mat == "aqiq":
        col = base * (0.30 + 0.62 * wrap[:, None])
        col += (0.26 * nz ** 3)[:, None] * np.array([0.95, 0.42, 0.16])  # glow from inside the stone
        col += (0.85 * nh ** 70 + 0.16 * nh ** 10)[:, None] * np.array([1.0, 0.93, 0.88])
    elif p.mat == "diamond":
        r = 2 * nz[:, None] * n - V  # reflection
        t = np.clip(0.5 + 0.5 * r[:, 1] - 0.3 * r[:, 0], 0, 1)[:, None]
        env = np.array([0.42, 0.46, 0.55]) * (1 - t) + np.array([1.0, 1.0, 1.0]) * t
        col = base * (0.35 + 0.35 * wrap[:, None]) + 0.45 * env
        fid = getattr(p, "_facet", np.zeros(len(n), int))
        glint = np.isin(fid, (3, 11, 17)).astype(float)
        dim = np.isin(fid, (5, 8, 19, 21)).astype(float)
        col = col * (1 - 0.30 * dim[:, None]) + (0.35 * glint)[:, None]
        col += (0.9 * nh ** 50)[:, None]
        col = col * np.array([0.98, 0.99, 1.02])
    elif m.get("glass"):
        rim = (1 - nz) ** 2
        col = base * (0.42 + 0.55 * wrap[:, None]) + base[None, :] * 0.35 * rim[:, None]
        col += (1.0 * nh ** 90 + 0.22 * nh ** 12)[:, None]
        alpha = alpha * (0.80 + 0.20 * rim)
    else:
        col = base * (0.3 + 0.7 * wrap[:, None])
    return np.clip(col, 0, 1), alpha


# ---------------------------------------------------------------------------
# Geometry
# ---------------------------------------------------------------------------

def _axis3(angle_deg, tilt_deg):
    """Image direction angle (0 = up the frame, clockwise +) tipped by tilt
    (tip away from the camera) -> world unit vector."""
    a, t = math.radians(angle_deg), math.radians(tilt_deg)
    return _unit([math.sin(a) * math.cos(t), math.cos(a) * math.cos(t), -math.sin(t)])


def band_prims(C, A, R, r_rad, r_ax, mat, n=None):
    """A band: flattened ellipsoids round a circle (centre C, axis A, radius
    R); radial half-thickness r_rad, half-width along the axis r_ax. The
    normal is the band's own (smooth), not the ellipsoids'."""
    u, v = _frame(A)
    n = n or max(48, int(2 * math.pi * R / (0.35 * min(r_rad, r_ax))))
    step = 2 * math.pi * R / n
    out = []
    for k in range(n):
        th = 2 * math.pi * k / n
        e = math.cos(th) * u + math.sin(th) * v
        t = np.cross(A, e)
        out.append(ellipsoid(C + R * e, (e, A, t), (r_rad, r_ax, step * 1.6), mat,
                             normal=("torus", C, A, R, r_rad, r_ax)))
    return out


def ring_prims(x, y, angle_deg, width_px, kind, view, tilt_deg=12.0, side_sign=1.0):
    """A ring on a finger whose first segment passes through image (x, y) in
    direction angle_deg, width width_px. kind: 'aqiq' | 'diamond'. view:
    back (stone to the camera) | palm (stone behind) | side (stone on the
    edge, side_sign picks which)."""
    w = width_px
    rf = 0.47 * w  # finger radius (the measured width runs edge to edge)
    C = np.array([x, -y, 0.0])
    A = _axis3(angle_deg, tilt_deg)
    u, v = _frame(A)
    phi = {"back": 0.0, "palm": math.pi, "side": side_sign * math.pi / 2}[view]
    S = math.cos(phi) * u + math.sin(phi) * v  # the stone's direction
    T = np.cross(A, S)
    r_rad, r_ax = 0.045 * w, 0.085 * w
    R = rf + r_rad * 0.9
    prims = [cylinder(C, A, rf)]
    prims += band_prims(C, A, R, r_rad, r_ax, "gold")
    if kind == "aqiq":
        prims.append(ellipsoid(C + S * (rf + 0.03 * w), (A, T, S), (0.29 * w, 0.23 * w, 0.10 * w), "gold_dark"))
        # bezel rim: an oval ring of small spheres round the stone
        for k in range(140):
            th = 2 * math.pi * k / 140
            pnt = C + S * (rf + 0.10 * w) + A * (0.255 * w * math.cos(th)) + T * (0.20 * w * math.sin(th))
            prims.append(sphere(pnt, 0.030 * w, "gold"))
        prims.append(ellipsoid(C + S * (rf + 0.085 * w), (A, T, S), (0.235 * w, 0.18 * w, 0.14 * w), "aqiq"))
    else:
        prims.append(ellipsoid(C + S * (rf + 0.06 * w), (A, T, S), (0.10 * w, 0.10 * w, 0.09 * w), "gold"))
        sc = C + S * (rf + 0.17 * w)
        prims.append(ellipsoid(sc, (A, T, S), (0.175 * w, 0.175 * w, 0.10 * w), "diamond",
                               normal=("facet", S, 8, 1)))
        for k in range(6):
            th = 2 * math.pi * (k + 0.5) / 6
            d = math.cos(th) * A + math.sin(th) * T
            prims.append(ellipsoid(sc + d * 0.172 * w + S * 0.035 * w, (d, np.cross(S, d), S),
                                   (0.022 * w, 0.022 * w, 0.05 * w), "gold"))
    return prims, C, A


def wrist_prims(x, y, angle_deg, width_px, style, camera):
    """Wrist jewellery centred on image (x, y) across a forearm of width
    width_px pointing angle_deg. style: 'tennis' or a list of bangle
    materials ('glass_red', 'glass_green', 'gold'), stacked along the arm
    towards the elbow."""
    W = width_px
    rw = 0.5 * W
    tilt = 14.0 if camera == "e" else 10.0
    A = _axis3(angle_deg, tilt)
    C = np.array([x, -y, 0.0])
    prims = [cylinder(C, A, rw)]
    if style == "tennis":
        rb = 0.026 * W
        R = rw + rb * 0.95
        u, v = _frame(A)
        n = int(2 * math.pi * R / (2.1 * rb))
        for k in range(n):
            th = 2 * math.pi * k / n
            e = math.cos(th) * u + math.sin(th) * v
            t = np.cross(A, e)
            pc = C + R * e
            prims.append(ellipsoid(pc, (e, A, t), (rb * 0.80, rb * 1.05, rb * 1.05), "whitegold"))
            prims.append(ellipsoid(pc + e * rb * 0.45, (A, t, e), (rb * 0.80, rb * 0.80, rb * 0.62), "diamond",
                                   normal=("facet", e, 8, k)))
    else:
        tube = 0.024 * W
        R = rw + 0.07 * W
        for j, mat in enumerate(style):
            off = -(j + 0.3) * 0.095 * W  # towards the elbow, a gap between them
            wob = (-1.5, 1.2, -0.6)[j % 3]  # a hint of looseness, never enough to cross
            Aj = _axis3(angle_deg + wob, tilt + wob)
            Cj = C + A * off
            mat_ = {"gold": "gold"}.get(mat, mat)
            prims += band_prims(Cj, Aj, R, tube, tube, mat_)
        for p in prims:
            if p.mat.startswith("glass"):
                p.alpha = 0.9
    return prims, C, A


# ---------------------------------------------------------------------------
# Composite onto a hand image
# ---------------------------------------------------------------------------

def _gauss(a, r):
    if r <= 0:
        return a
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8), "L")
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(np.float64) / 255.0


def arm_cross_section(alpha, x, y, angle_deg, width_px):
    """Re-measure the forearm across (x, y): walk perpendicular to the arm
    both ways until the silhouette ends; returns the midpoint and width, or
    the input when the cut runs into something else."""
    a = math.radians(angle_deg)
    px, py = math.cos(a), math.sin(a)  # perpendicular to the arm, image coords
    H_, W_ = alpha.shape

    def walk(sgn):
        for s in range(0, int(width_px * 0.9)):
            xi, yi = int(round(x + sgn * s * px)), int(round(y + sgn * s * py))
            if not (0 <= xi < W_ and 0 <= yi < H_) or alpha[yi, xi] < 128:
                return s
        return None
    l, r = walk(-1), walk(1)
    if l is None or r is None:
        return x, y, width_px
    w = l + r
    if not (0.75 * width_px <= w <= 1.25 * width_px):
        return x, y, width_px
    mid = (r - l) / 2
    return x + mid * px, y + mid * py, float(w)


def composite(base, items, jobs_alpha_ref=None):
    """base: RGBA PIL image (the skinned hand). items: list of dicts
    {prims, box, clip ('ring'|'wrist'), size (px, for shadow scale)}.
    Returns the new image."""
    arr = np.asarray(base.convert("RGBA")).astype(np.float64) / 255.0
    Hh, Ww = arr.shape[:2]
    sil = arr[..., 3]
    # local skin illumination: blurred luminance, normalised over the hand
    lum = arr[..., :3] @ np.array([0.30, 0.59, 0.11])
    num = _gauss(lum * sil, 18)
    den = _gauss(sil, 18)
    illum = num / np.maximum(den, 1e-3)
    ref = np.percentile(lum[sil > 0.9], 80) if (sil > 0.9).any() else 0.7
    layer = np.zeros((Hh, Ww, 4))
    shadow = np.zeros((Hh, Ww))
    for it in items:
        x0, y0, x1, y1 = [int(round(v)) for v in it["box"]]
        x0, y0, x1, y1 = max(0, x0), max(0, y0), min(Ww, x1), min(Hh, y1)
        if x1 <= x0 or y1 <= y0:
            continue
        rgba = render(it["prims"], (x0, y0, x1, y1))
        h, w = rgba.shape[:2]
        rgba = rgba[:y1 - y0, :x1 - x0]
        # clip: to the silhouette grown by the allowed overhang
        grow = it.get("grow", 6)
        s_img = Image.fromarray((sil[y0:y1, x0:x1] * 255).astype(np.uint8), "L")
        allow = np.asarray(s_img.filter(ImageFilter.MaxFilter(2 * (grow // 2) + 1))).astype(np.float64) / 255.0
        rgba[..., 3] *= allow[:rgba.shape[0], :rgba.shape[1]]
        # light it like the skin under it
        f = np.clip(0.52 + 0.50 * illum[y0:y1, x0:x1] / ref, 0.62, 1.06)[:rgba.shape[0], :rgba.shape[1]]
        rgba[..., :3] *= f[..., None]
        sub = layer[y0:y0 + rgba.shape[0], x0:x0 + rgba.shape[1]]
        a = rgba[..., 3:4]
        sub[..., :3] = rgba[..., :3] * a + sub[..., :3] * (1 - a)
        sub[..., 3:4] = a + sub[..., 3:4] * (1 - a)
        # contact shadow (occlusion right round it, a softer cast down-right)
        sz = it.get("size", 60)
        sa = np.zeros((Hh, Ww))
        sa[y0:y0 + rgba.shape[0], x0:x0 + rgba.shape[1]] = rgba[..., 3]
        tight = _gauss(sa, max(1.0, sz * 0.03))
        sh = max(1, int(sz * 0.05))
        cast = np.roll(np.roll(_gauss(sa, max(1.5, sz * 0.07)), sh, axis=0), sh, axis=1)
        shadow = np.maximum(shadow, np.clip(0.38 * tight + 0.30 * cast, 0, 0.5))
    out = arr.copy()
    shadow *= sil * (1 - layer[..., 3])
    out[..., :3] *= (1 - shadow)[..., None]
    a = layer[..., 3:4]
    out[..., :3] = layer[..., :3] * a + out[..., :3] * (1 - a)
    out[..., 3:4] = a + out[..., 3:4] * (1 - a)
    return Image.fromarray(np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA")


def ring_item(anchor, kind, view, facing=0.0, curl=0.0):
    w = anchor["width_px"]
    tilt = 12.0 + 0.3 * min(50.0, max(0.0, curl))  # curled fingers: a gentle tip, else the far arc hangs below
    prims, C, A = ring_prims(anchor["x"], anchor["y"], anchor["angle_deg"], w, kind, view, tilt,
                             side_sign=1.0 if facing >= 0 else -1.0)
    half = 0.9 * w
    return {"prims": prims, "box": (anchor["x"] - half, anchor["y"] - half, anchor["x"] + half, anchor["y"] + half),
            "grow": int(0.14 * w) | 1, "size": w}


def wrist_item(alpha, anchor, style, camera):
    x, y, W = arm_cross_section(alpha, anchor["x"], anchor["y"], anchor["angle_deg"], anchor["width_px"])
    prims, C, A = wrist_prims(x, y, anchor["angle_deg"], W, style, camera)
    half = 0.85 * W
    return {"prims": prims, "box": (x - half, y - half, x + half, y + half),
            "grow": int(0.16 * W) | 1, "size": W * 0.35}


# ---------------------------------------------------------------------------
# Relighting a mirrored hand (hands v3)
# ---------------------------------------------------------------------------

def relight_mirrored(im, region=None, R=70.0, amb=0.72, strength=0.8):
    """A mirrored master is lit from the upper right. Re-light it from the
    upper left: a height field is rebuilt from the silhouette (each edge
    rolls off like a rounded cylinder of radius R: fingers, palm and arm
    alike), its normals give the Lambert shading under the current light
    (mirrored, from the right) and under the wanted one (from the left),
    and every pixel is scaled by wanted / current. The fine detail
    (creases, nails, texture) and the top-to-bottom light stay as they are.
    region: optional bool mask limiting the change (e.g. one hand)."""
    from scipy import ndimage
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    solid = arr[..., 3] > 127
    d = ndimage.distance_transform_edt(solid)
    dd = np.minimum(d, R)
    h = np.sqrt(np.maximum(R * R - (R - dd) ** 2, 0))
    h = ndimage.gaussian_filter(h, 3.0)
    gy, gx = np.gradient(h)
    n = np.stack([-gx, gy, np.ones_like(h)], axis=-1)  # world: y up, so image-y gradient flips
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    Lw = L  # wanted: from the upper left
    Lc = L * np.array([-1.0, 1.0, 1.0])  # current: mirrored, from the upper right
    s_w = amb + (1 - amb) * np.clip(n @ Lw, 0, 1)
    s_c = amb + (1 - amb) * np.clip(n @ Lc, 0, 1)
    ratio = s_w / s_c
    ratio = ratio / np.median(ratio[solid])  # keep the overall exposure
    ratio = 1 + (ratio - 1) * strength
    ratio = np.where(solid, ratio, 1.0)
    if region is not None:
        ratio = np.where(region, ratio, 1.0)
    out = arr.copy()
    out[..., :3] = np.clip(arr[..., :3] * ratio[..., None], 0, 255)
    return Image.fromarray(out.astype(np.uint8), "RGBA")
