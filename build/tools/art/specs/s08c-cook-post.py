#!/usr/bin/env python3
"""s08c's Cook post-steps (wave 7A), run after the cut: python3 build/tools/art/artcut.py build/tools/art/specs/s08c.cut.json
--only <the cook-* ids>, then

    python3 build/tools/art/specs/s08c-cook-post.py [--weights RealESRGAN_x2plus.pth] [--skip-upscale]

Every step works only on pictures ChatGPT drew (never a drawn stand-in, CLAUDE.md 13):
  1. CP3 (CHAI-26): the cast shadow under each tipped pan is taken out (perfectly neutral grey, joined to the outside,
     never the black handle); then each frame's black-tea copy: the chai's pixels recoloured to the clear reddish amber of
     the same picture's cell 6 (its pan holds black tea), the light and shading kept.
  2. SK4 (SEK-14, SEK-20): tray-0..3 from tray-4 by painting the skewers out from the right: each skewer's band is filled
     from the tray's own brushed steel straight above and below it (the brushing runs top to bottom, along the skewers), and
     below the tray (the handles) made clear.
  3. WT1 (contract-11, SH-91, ART-05): cut here from the source (artcut's key wants a grey ground), cross-faded left-right
     and top-bottom, then upscaled x2 by
     build/tools/art/upscale.py: assets/cook/bg/bg-cook-marble-tile-s08c.webp.
  4. The hob: the plate cut from assets/cook/bg/bg-cook-hob-t-v1.png on a rounded rectangle fitted to it, upscaled x2:
     assets/cook/bg/bg-cook-hob-plate-s08c.webp (laid on the tiled marble where the -1600 picture had it).
  5. The measures: assets/cook/items-s08c/meta.json (the tray's skewer lines, the pans' contents circles, the tip frames'
     near rim, the kadchi's and teaspoon's bowls, the hob's place in the 1600x900 design box).
"""
import argparse
import json
import os
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
sys.path.insert(0, os.path.join(REPO, "build/tools/art"))
import artlib as L  # noqa: E402

IT = os.path.join(REPO, "assets/cook/items-s08c")
BG = os.path.join(REPO, "assets/cook/bg")
META = {}


def rgba(p):
    return np.asarray(Image.open(p).convert("RGBA")).astype(np.float32)


def save(a, p, q=90, lossless=False):
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA").save(p, quality=q, method=6, lossless=lossless)


# ---------------------------------------------------------------- 1. CP3: no cast shadow; the black-tea copies
def tip_frames():
    d = os.path.join(IT, "chai-pan")
    src = np.asarray(Image.open(os.path.join(REPO, "sources/art/s08c/cp3-chai-pan-tip-pour-v2.png")).convert("RGB")).astype(np.float32)
    # the black tea's colour: cell 6's liquid (the saturated reddish pixels inside its pan), median and spread
    c6 = src[512:1024, 1024:1536].reshape(-1, 3)
    hsv6 = cv2.cvtColor(c6.reshape(-1, 1, 3).astype(np.uint8), cv2.COLOR_RGB2HSV).reshape(-1, 3).astype(np.float32)
    tea6 = c6[(hsv6[:, 1] > 170) & (hsv6[:, 0] < 16) & (hsv6[:, 2] > 60)]
    black = np.median(tea6, 0)
    out = {}
    for deg in (0, 20, 40, 60):
        p = os.path.join(d, "pan-tip-%d-s08c.webp" % deg)
        a = rgba(p)
        al = a[..., 3] / 255.0
        rgb = a[..., :3]
        spread = rgb.max(2) - rgb.min(2)
        lum = rgb.mean(2)
        # the black handle (and its own shine, filled in), kept whatever its grey
        dark = (lum < 75) & (al > 0.5)
        handle = ndi.binary_dilation(ndi.binary_fill_holes(ndi.binary_closing(dark, iterations=3)), iterations=2)
        # the cast shadow: perfectly neutral grey darker than the ground, joined to the clear outside
        shade = (spread <= 4) & (lum < 126) & (lum > 40) & (al > 0) & ~handle
        lb, n = ndi.label(shade)
        outside = ndi.binary_dilation(al < 0.05, iterations=2)
        touch = np.unique(lb[outside & (lb > 0)])
        sz = np.bincount(lb.ravel())
        drop = np.isin(lb, [t for t in touch if sz[t] > 200])
        drop = ndi.binary_dilation(drop, iterations=1) & ~handle & (spread <= 8)
        al2 = np.where(drop, 0.0, al)
        # the shadow's soft outer edge: faint neutral alpha left round the dropped patch
        near = ndi.binary_dilation(drop, iterations=4) & (spread <= 6) & (al2 < 0.98) & ~handle
        al2 = np.where(near, 0.0, al2)
        # specks of the shadow's edge left apart from the pan: only the pan's own piece stays
        lb2, n2 = ndi.label(al2 > 0.02)
        if n2 > 1:
            s2 = np.bincount(lb2.ravel())
            s2[0] = 0
            al2 = np.where(lb2 == int(np.argmax(s2)), al2, 0.0)
        # the cut along the shadow is ragged (the steel's underside and the shadow share greys): smoothed, a 1 px soft edge
        keep = ndi.gaussian_filter((al2 > 0.5).astype(np.float32), 3.0) > 0.5
        keep = ndi.binary_fill_holes(keep)
        al2 = np.minimum(al, ndi.gaussian_filter(keep.astype(np.float32), 0.8))
        al2 = np.where(handle, al, al2)
        a[..., 3] = al2 * 255
        save(a, p)
        # the black-tea copy: the chai (warm, saturated) recoloured to cell 6's tea, its light kept
        hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
        chai = (hsv[..., 1] > 120) & (hsv[..., 2] > 150) & (hsv[..., 0] < 25) & (al2 > 0.5)  # (the warm steel inside the wall is darker: V 117-134)
        chai = ndi.binary_opening(chai, iterations=1)
        # the chai is one pool (the warm steel inside the wall is never it); its own shine filled in
        lc, nc = ndi.label(chai)
        if nc > 1:
            sc = np.bincount(lc.ravel())
            sc[0] = 0
            chai = lc == int(np.argmax(sc))
        chai = ndi.binary_fill_holes(chai)
        # its meniscus at the wall: the paler warm pixels just round it
        chai = chai | (ndi.binary_dilation(chai, iterations=2) & (hsv[..., 1] > 100) & (hsv[..., 2] > 140) & (hsv[..., 0] < 25))
        w = ndi.gaussian_filter(chai.astype(np.float32), 1.0)
        rel = lum / max(1.0, float(np.median(lum[chai]))) if chai.any() else lum * 0
        tea = np.clip(black[None, None, :] * rel[..., None], 0, 255)
        b = a.copy()
        b[..., :3] = rgb * (1 - w[..., None]) + tea * w[..., None]
        save(b, p.replace("-s08c.webp", "-black-s08c.webp"))
        out[deg] = near_rim(al2, rgb)
    META["tip"] = {"_about": "CP3 cells 1-4 (pan-tip-<deg>-s08c, one window %dx%d): the contents' centre (cx, cy), the rim's half width rx and half height ry, and the near rim's middle (lip: the stream leaves from it), source px" % (a.shape[1], a.shape[0]), "frames": out, "black": [round(float(v)) for v in black]}


def near_rim(al, rgb):
    """The rim's ellipse of a tipped pan: its outline left of the handle (the pan body), fitted; the lip is its lowest point."""
    body = al > 0.5
    lum = rgb.mean(2)
    dark = ndi.binary_dilation((lum < 75) & body, iterations=2)
    body = body & ~dark
    lb, n = ndi.label(body)
    if n > 1:
        sz = np.bincount(lb.ravel())
        sz[0] = 0
        body = lb == int(np.argmax(sz))
    ys, xs = np.nonzero(body)
    # the pan's round body: columns left of the handle's start (the stub is narrow: rows at most a quarter of the body tall)
    colh = np.array([body[:, x].sum() for x in range(body.shape[1])])
    top = colh.max()
    body_cols = np.nonzero(colh > top * 0.35)[0]
    x0, x1 = int(body_cols.min()), int(body_cols.max())
    sub = body[:, x0:x1 + 1]
    rows = np.nonzero(sub.any(1))[0]
    y0, y1 = int(rows.min()), int(rows.max())
    # the contents: the chai's warm pixels
    hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    chai = (hsv[..., 1] > 90) & (hsv[..., 0] < 25) & (al > 0.5)
    cy_, cx_ = ndi.center_of_mass(chai) if chai.any() else ((y0 + y1) / 2, (x0 + x1) / 2)
    cys = np.nonzero(chai[:, int(cx_)])[0]
    lip_y = int(cys.max()) if len(cys) else y1
    return {"body": [x0, y0, x1, y1], "cx": round(float(cx_), 1), "cy": round(float(cy_), 1), "lip": [round(float(cx_), 1), lip_y]}


# ---------------------------------------------------------------- 2. SK4: tray-0..3
def trays():
    d = os.path.join(IT, "sekelo-tray")
    out = {}
    for suf in ("", "@2x"):
        p = os.path.join(d, "tray-4-s08c%s.webp" % suf)
        a = rgba(p)
        H, W = a.shape[:2]
        rgb = a[..., :3]
        al = a[..., 3] / 255.0
        hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
        # the tray: rows where the opaque picture spans most of the width (the handles below are narrow)
        roww = (al > 0.5).sum(1)
        trows = np.nonzero(roww > W * 0.6)[0]
        ty0, ty1 = int(trows.min()), int(trows.max())
        # the skewers: the bamboo (warm, saturated, bright) in the tray's middle rows, and the wooden handles (red-brown) below
        bamboo = (hsv[..., 0] >= 10) & (hsv[..., 0] <= 26) & (hsv[..., 1] > 110) & (hsv[..., 2] > 140) & (al > 0.5)
        mid = slice(ty0 + (ty1 - ty0) // 4, ty1 - (ty1 - ty0) // 4)
        colw = bamboo[mid].sum(0)
        cols = ndi.binary_closing(colw > (ty1 - ty0) * 0.25, iterations=max(3, int(5 * W / 800)))  # (its shine splits a skewer)
        lb, n = ndi.label(cols)
        bands = []
        for i in range(1, n + 1):
            xs = np.nonzero(lb == i)[0]
            bands.append((int(xs.min()), int(xs.max())))
        bands.sort()
        if len(bands) != 4:
            raise SystemExit("tray-4%s: %d skewer bands found, want 4 (%s)" % (suf, len(bands), bands))
        wood = (hsv[..., 0] < 32) & (hsv[..., 1] > 100) & (al > 0.5)
        # each skewer's line: its centre column, the tip (the first wood row), the handle's start (the widest jump) and end
        lines = []
        for (b0, b1) in bands:
            band = wood[:, b0:b1 + 1]
            bb = bamboo[:, b0:b1 + 1]
            tip = int(np.nonzero(bb.sum(1) > 0)[0].min())
            rws = np.nonzero(band.any(1))[0]
            end = int(rws.max())
            width = band.sum(1)
            thin = np.median(width[tip:ty1]) if ty1 > tip else 4
            hs = np.nonzero(width > max(thin * 2.2, 8))[0]
            hs = hs[hs > tip + (end - tip) * 0.5]
            hstart = int(hs.min()) if len(hs) else ty1
            cx = float(np.average(np.arange(b0, b1 + 1), weights=band[tip:hstart].sum(0) + 1e-3))
            lines.append([cx, tip, hstart, end])
        # the tips are drawn level, just inside the tray's top wall; the warm wall itself reads as bamboo on the outer two
        tip0 = float(np.median([l[1] for l in lines]))
        lines = [[l[0], tip0, l[2], l[3]] for l in lines]
        frames = {4: a.copy()}
        cur = a.copy()
        for k in range(3, -1, -1):  # paint out the rightmost remaining skewer
            b0, b1 = bands[k]
            # the band and its contact shadow on the steel (the light is from the upper left: the shadow lies 30 px to its right)
            m0, m1 = b0 - int(round(10 * W / 800)), b1 + int(round(34 * W / 800)) + 1
            hw = (a[..., 3] > 0)
            # the steel in this band: the same rows of clean steel just left of it (between two skewers), copied across (the
            # brushing runs top to bottom, so a strip beside it is the same steel), its light matched to the band's two edges
            # (a smooth top-to-bottom correction, never row by row) and feathered in over 3 px each side
            wB = m1 - m0
            # (the first skewer's left is the tray's lit inner wall: it copies from its right, between it and the second)
            s0 = m1 + int(round(4 * W / 800)) if k == 0 else max(0, m0 - int(round(4 * W / 800)) - wB)
            patch = cur[:, s0:s0 + wB].copy()
            e3 = max(2, int(round(3 * W / 800)))
            Lt, Rt = cur[:, m0 - e3:m0, :3].mean(1), cur[:, m1:m1 + e3, :3].mean(1)
            Lp, Rp = patch[:, :e3, :3].mean(1), patch[:, -e3:, :3].mean(1)
            sig = 1.5 * W / 800  # (the walls change fast top to bottom: a row's own match, the copied grain keeps the brushing)
            dL = ndi.gaussian_filter1d(Lt - Lp, sig, axis=0)
            dR = ndi.gaussian_filter1d(Rt - Rp, sig, axis=0)
            tt = np.linspace(0, 1, wB)[None, :, None]
            fix = patch.copy()
            fix[..., :3] = patch[..., :3] + dL[:, None, :] * (1 - tt) + dR[:, None, :] * tt
            ramp = np.clip(np.minimum(np.arange(wB) + 1, wB - np.arange(wB)) / e3, 0, 1)[None, :, None]
            rows = np.arange(H)
            intray = (rows >= ty0 - 3) & (rows <= ty1 + 3)  # (with the walls' soft outer edge)
            seg = cur[:, m0:m1].copy()
            seg[intray] = seg[intray] * (1 - ramp) + fix[intray] * ramp
            cur[:, m0:m1] = seg
            # below the tray: the handle goes (clear), its whole width
            hc = (b0 + b1) // 2
            hw2 = int(round(44 * W / 800))
            cur[ty1 + 4:, max(0, hc - hw2):min(W, hc + hw2), 3] = 0
            frames[k] = cur.copy()
        for k in range(4):
            save(frames[k], os.path.join(d, "tray-%d-s08c%s.webp" % (k, suf)))
        if not suf:
            # the alpha bottom of tray-0..3: the tray's own edge (the handles gone)
            out = {"w": W, "h": H, "tray": [ty0, ty1], "sticks": [[round(v / W, 4) if i == 0 else round(v / H, 4) for i, v in enumerate(l)] for l in lines]}
    META["tray"] = dict(out, _about="SK4 tray-4-s08c (w x h px): the tray's top and bottom rows (tray), and each skewer [x, tip, handle, end] as fractions of w and h (V3.rack's form); tray-n holds skewers 1..n (from the left)")


# ---------------------------------------------------------------- 3. WT1: the 2-D tile, x2
def upscale(src, dst, weights, size=None):
    cmd = [sys.executable, os.path.join(REPO, "build/tools/art/upscale.py"), src, dst, "--weights", weights]
    if size:
        cmd += ["--size", size]
    subprocess.run(cmd, check=True)


def marble(weights, skip):
    # from the source itself (artcut's key needs a grey ground; this texture is full bleed): 4 px in, cross-faded left-right
    # then top-bottom (artlib.make_tileable, 96 px each)
    im = Image.open(os.path.join(REPO, "sources/art/s08c/wt1-marble-tile-v1.png")).convert("RGBA")
    im = im.crop((4, 4, im.width - 4, im.height - 4))
    before_h = L.seam_ratio(np.asarray(im))
    before = L.seam_ratio(np.asarray(im.transpose(Image.TRANSPOSE)))
    im = L.make_tileable(im, 96)
    t = L.make_tileable(im.transpose(Image.TRANSPOSE), 96).transpose(Image.TRANSPOSE)
    after_v = L.seam_ratio(np.asarray(t.transpose(Image.TRANSPOSE)))
    after_h = L.seam_ratio(np.asarray(t))
    tmp = os.path.join(IT, "marble-tile-tmp.png")
    # upscaled with 32 px of its own wrap round it (the network darkens a picture's edges), then cropped back: no seam
    P = 32
    wrap = np.pad(np.asarray(t.convert("RGB")), ((P, P), (P, P), (0, 0)), mode="wrap")
    Image.fromarray(wrap).save(tmp)
    out = os.path.join(BG, "bg-cook-marble-tile-s08c.webp")
    if not skip:
        png = out.replace(".webp", ".png")
        upscale(tmp, png, weights, "%dx%d" % (wrap.shape[1] * 2, wrap.shape[0] * 2))
        Image.open(png).convert("RGB").crop((2 * P, 2 * P, 2 * P + t.width * 2, 2 * P + t.height * 2)).save(out, quality=88, method=6)
        os.remove(png)
    os.remove(tmp)
    u = Image.open(out)
    META["marble"] = {"file": "assets/cook/bg/bg-cook-marble-tile-s08c.webp", "w": u.width, "h": u.height, "seam_top_bottom_before": round(before, 2), "seam_left_right_before": round(before_h, 2), "seam_top_bottom": round(after_v, 2), "seam_left_right": round(after_h, 2),
                      "_about": "WT1 cut from its source, cross-faded left-right and top-bottom, upscaled x2: laid tiled at 0.5 design px per source px (js/cook/stations.js fitBg)"}


# ---------------------------------------------------------------- 4. the hob plate
def hob(weights, skip):
    src = os.path.join(BG, "bg-cook-hob-t-v1.png")
    a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    lum = a.mean(2)
    plate = lum < 110
    plate = ndi.binary_opening(plate, iterations=3)
    lb, n = ndi.label(plate)
    sz = np.bincount(lb.ravel())
    sz[0] = 0
    plate = ndi.binary_fill_holes(lb == int(np.argmax(sz)))
    ys, xs = np.nonzero(plate)
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    # the corner radius: how far in the plate's top row starts
    r = int(np.nonzero(plate[y0 + 1])[0].min() - x0) + 2
    r = max(6, min(r * 3, 40))
    pad = 6
    X0, Y0, X1, Y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    X1 += (X1 - X0) % 2  # (even sizes: the upscaler's pixel unshuffle halves each tile)
    Y1 += (Y1 - Y0) % 2
    crop = Image.open(src).convert("RGB").crop((X0, Y0, X1, Y1))
    # the rounded mask at 4x, a 1.2 px soft edge, over the plate's own outline (its thin bright rim included: 1 px out)
    S = 4
    w, h = X1 - X0, Y1 - Y0
    m = np.zeros((h * S, w * S), np.uint8)
    cv2.rectangle(m, ((pad - 1 + r) * S, (pad - 1) * S), ((w - pad + 1 - r) * S, (h - pad + 1) * S), 255, -1)
    cv2.rectangle(m, ((pad - 1) * S, (pad - 1 + r) * S), ((w - pad + 1) * S, (h - pad + 1 - r) * S), 255, -1)
    for cx_, cy_ in ((pad - 1 + r, pad - 1 + r), (w - pad + 1 - r, pad - 1 + r), (pad - 1 + r, h - pad + 1 - r), (w - pad + 1 - r, h - pad + 1 - r)):
        cv2.circle(m, (cx_ * S, cy_ * S), r * S, 255, -1)
    mask = Image.fromarray(m).resize((w, h), Image.LANCZOS)
    tmp = os.path.join(BG, "hob-plate-tmp.png")
    crop.save(tmp)
    out = os.path.join(BG, "bg-cook-hob-plate-s08c.webp")
    big = tmp.replace(".png", "-x2.png")
    if not skip:
        upscale(tmp, big, weights, "%dx%d" % (w * 2, h * 2))
        up = Image.open(big).convert("RGB")
        os.remove(big)
    else:
        up = crop.resize((w * 2, h * 2), Image.LANCZOS)
    m2 = mask.resize((w * 2, h * 2), Image.LANCZOS)
    up.putalpha(m2)
    up.save(out, quality=90, method=6)
    os.remove(tmp)
    # where the -1600 picture drew it: that picture is the png scaled k and cropped at (ox, oy), measured by matching
    META["hob"] = {"file": "assets/cook/bg/bg-cook-hob-plate-s08c.webp", "w": up.width, "h": up.height, "src_box": [X0, Y0, X1, Y1], "radius": r,
                   "in1600": place_in_1600(Image.open(src).convert("L"), (X0, Y0, X1, Y1)),
                   "_about": "the hob plate cut from bg-cook-hob-t-v1.png (src_box, source px, its rounded mask's corner radius) x2; in1600: its box in the 1600x900 design box, where bg-cook-hob-t-v1-1600 drew it (the stations' burners, station-lib.js BURNER)"}


def place_in_1600(png, box):
    """The -1600 picture is the 1536 png scaled up and cropped: find the scale and offset by matching, then the box's place."""
    big = np.asarray(Image.open(os.path.join(BG, "bg-cook-hob-t-v1-1600.webp")).convert("L")).astype(np.float32)
    p = np.asarray(png).astype(np.float32)
    best = None
    for k in np.arange(1.20, 1.36, 0.002):
        s = cv2.resize(p, (round(p.shape[1] * k), round(p.shape[0] * k)), interpolation=cv2.INTER_AREA)
        if s.shape[0] < big.shape[0] or s.shape[1] < big.shape[1]:
            continue
        r = cv2.matchTemplate(s, big[100:800, 100:1500], cv2.TM_CCOEFF_NORMED)
        _, v, _, loc = cv2.minMaxLoc(r)
        if best is None or v > best[0]:
            best = (v, k, loc[0] - 100, loc[1] - 100)
    v, k, ox, oy = best
    x0, y0, x1, y1 = box
    return {"k": round(float(k), 4), "match": round(float(v), 4), "box": [round(x0 * k - ox, 1), round(y0 * k - oy, 1), round(x1 * k - ox, 1), round(y1 * k - oy, 1)]}


# ---------------------------------------------------------------- 5. the other measures
def pans():
    d = os.path.join(IT, "chai-pan")
    out = {}
    for nm in ("pan-water-s08c", "pan-leaves-s08c", "pan-boil-milky-s08c"):
        a = rgba(os.path.join(d, nm + ".webp"))
        al = a[..., 3] / 255.0
        g = cv2.cvtColor(a[..., :3].astype(np.uint8), cv2.COLOR_RGB2GRAY)
        H, W = g.shape
        # the rim: the biggest circle in the left part (the handle is on the right)
        c = cv2.HoughCircles(cv2.GaussianBlur(g, (5, 5), 1.5), cv2.HOUGH_GRADIENT, 1, 200, param1=80, param2=30, minRadius=int(H * 0.35), maxRadius=int(H * 0.52))
        cx_, cy_, r = [float(v) for v in c[0][0]]
        # the contents: the inside wall's circle (smaller, same centre)
        c2 = cv2.HoughCircles(cv2.GaussianBlur(g, (5, 5), 1.5), cv2.HOUGH_GRADIENT, 1, 200, param1=80, param2=25, minRadius=int(r * 0.7), maxRadius=int(r * 0.93))
        rin = float(c2[0][0][2]) if c2 is not None else r * 0.85
        out[nm] = {"w": W, "h": H, "cx": round(cx_, 1), "cy": round(cy_, 1), "rim": round(r, 1), "inner": round(rin, 1)}
    META["brew"] = dict(out, _about="CP4: each picture's rim circle (cx, cy, rim) and its contents' circle (inner), source px (Hough)")


def bowls():
    """The kadchi's bowl (the biggest circle inside it) and the teaspoon's bowl centre, as fractions."""
    out = {}
    for nm in ("kadchi/kadchi-s08c", "kadchi/kadchi-daal-s08c"):
        a = rgba(os.path.join(IT, nm + ".webp"))
        al = a[..., 3] > 128
        dt = ndi.distance_transform_edt(al)
        y, x = np.unravel_index(int(np.argmax(dt)), dt.shape)
        H, W = al.shape
        # the handle's end: the solid pixel furthest from the bowl's centre
        ys, xs = np.nonzero(al)
        i = int(np.argmax((xs - x) ** 2 + (ys - y) ** 2))
        ang = float(np.degrees(np.arctan2(ys[i] - y, xs[i] - x)))
        out[nm.split("/")[1]] = {"w": W, "h": H, "cx": round(x / W, 4), "cy": round(y / H, 4), "r": round(float(dt.max()) / W, 4), "handle_deg": round(ang, 1)}
    for nm in ("teaspoon/teaspoon-empty-s08c", "teaspoon/teaspoon-sugar-s08c", "teaspoon/teaspoon-chai-s08c"):
        a = rgba(os.path.join(IT, nm + ".webp"))
        al = a[..., 3] > 128
        H, W = al.shape
        colh = al.sum(0)
        # the bowl: the left run of tall columns
        tall = np.nonzero(colh > colh.max() * 0.6)[0]
        tall = tall[tall < W * 0.5]
        bx = float(tall.mean())
        rows = np.nonzero(al[:, int(bx)])[0]
        by = float(rows.mean())
        xs = np.nonzero(al.any(0))[0]
        out[nm.split("/")[1]] = {"w": W, "h": H, "bowl": [round(bx / W, 4), round(by / H, 4)], "len": round(float(xs.max() - xs.min()) / W, 4), "end": round(float(xs.max()) / W, 4)}
    META["bowls"] = dict(out, _about="the kadchi: its bowl's biggest inner circle (cx, cy, r of w) and the handle's direction from it (deg, y down); the teaspoon: its bowl's centre and its length, of w")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--weights", default="RealESRGAN_x2plus.pth")
    ap.add_argument("--skip-upscale", action="store_true", help="test runs: Lanczos instead of Real-ESRGAN")
    ap.add_argument("--only", help="comma list of: tip, tray, marble, hob, pans, bowls")
    a = ap.parse_args()
    steps = {"tip": tip_frames, "tray": trays, "marble": lambda: marble(a.weights, a.skip_upscale), "hob": lambda: hob(a.weights, a.skip_upscale), "pans": pans, "bowls": bowls}
    want = a.only.split(",") if a.only else list(steps)
    mp = os.path.join(IT, "meta.json")
    if os.path.exists(mp):
        META.update(json.load(open(mp)))
    for k in want:
        steps[k]()
        print("done:", k)
    META["_about"] = "s08c Cook measures, written by build/tools/art/specs/s08c-cook-post.py (the code keeps its own copies of the numbers it uses)"
    with open(mp, "w") as f:
        json.dump(META, f, indent=1, sort_keys=True)
        f.write("\n")


if __name__ == "__main__":
    main()
