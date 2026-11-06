#!/usr/bin/env python3
"""The Cook redo's finishing pass (6 Nov), after artcut.py build/tools/art/specs/s17-cook-redo.cut.json.

  python3 build/tools/art/cook_redo_post.py

artcut writes every cut to sources/art/s17-cook-redo/cuts/; only what the game shows lands in assets/.

1. The flame rings on the old flames' canvas, so the game's code and sizes stay as they are. js/cook/kitchen-kit.js
   scales a ring by its outer radius in the old art (flame-high's ring reaches 245/512 of its sprite); boil.js stretches
   the 512 canvas under the pan. Each new ring (artcut's -raw cut) is centred on a 512 px canvas and scaled per axis
   until its solid flames (alpha > 0.3) reach the old ring's radius: high 251, low 191 (measured from
   assets/cook/items/chai-station/flame-*.webp). The low ring is drawn 5% wider than tall: the per-axis scale makes it
   round again, as the old ones were. The halo fades out before the canvas edge.
2. The lit knob (KH01 cell 4): its glow is light on the grey, so a plain key cuts it ragged and a soft key makes the
   steel ring see-through. Its round body (the dark face's centre, the knob's radius from the off knob's cut) is kept
   solid as drawn; outside it the glow is unmixed from the grey at partial alpha. The off knob and the tray are cut
   the same way without the glow. Each on a square canvas centred on its circle, so a knob turns about its middle.
3. Nani's shop's rolling pin (assets/cook/props/rolling-pin-walnut.webp): the level walnut pin turned 38 degrees, lying
   from lower left to upper right as the old shop picture did, so it fills the shop's square card.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import artlib as L  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CUTS = os.path.join(REPO, "sources/art/s17-cook-redo/cuts")  # artcut's cuts and the unwired pieces
LIVE = os.path.join(REPO, "assets/cook/items/s17-cook-redo")  # what the game shows: the flame rings
SHEET = os.path.join(REPO, "sources/art/s17-cook-redo/kh01-chai-hob-v1.png")
OUTER = {"flame-low": 191, "flame-high": 251}  # the old rings' outer radius at alpha > 0.3, on 512 px
SIZE = 512
PAD = 16
HALO = 0.15  # alpha below this in a flame ring's glow goes
R_OFF = [170.0]  # the off knob's radius, set by its cut: the lit knob is the same knob


def place(name, outer):
    im = Image.open(os.path.join(CUTS, name + "-raw.webp")).convert("RGBA")
    a = np.asarray(im)[..., 3] / 255.0
    ys, xs = np.nonzero(a > 0.3)
    cx, cy = (xs.min() + xs.max() + 1) / 2, (ys.min() + ys.max() + 1) / 2
    sx, sy = 2 * outer / (xs.max() - xs.min() + 1), 2 * outer / (ys.max() - ys.min() + 1)
    big = im.resize((round(im.width * sx), round(im.height * sy)), Image.LANCZOS)
    cv = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ox, oy = round(SIZE / 2 - cx * sx), round(SIZE / 2 - cy * sy)
    big = big.crop((max(0, -ox), max(0, -oy), big.width, big.height))  # the soft halo past the canvas edge goes
    cv.alpha_composite(big.crop((0, 0, min(big.width, SIZE - max(0, ox)), min(big.height, SIZE - max(0, oy)))), (max(0, ox), max(0, oy)))
    px = np.asarray(cv).astype(np.float64)
    yy, xx = np.mgrid[0:SIZE, 0:SIZE]
    r = np.hypot(xx + 0.5 - SIZE / 2, yy + 0.5 - SIZE / 2)
    px[..., 3] *= np.clip((SIZE / 2 - r) / 10, 0, 1)  # no hard line at the canvas edge
    # the halo's faintest 15% goes: scaled up 1.5x, high's glow drew a soft rim 11.7 px wide (the pixel check's
    # glass limit is 10); now about 9, the flames and their warm tips untouched
    px[..., 3] = np.clip((px[..., 3] / 255 - HALO) / (1 - HALO), 0, 1) * 255
    os.makedirs(LIVE, exist_ok=True)
    out = os.path.join(LIVE, name + ".webp")
    Image.fromarray(px.round().astype(np.uint8), "RGBA").save(out, quality=90, method=6)
    print("%s: scale %.3f x %.3f, centre (%.0f, %.0f) -> %s" % (name, sx, sy, cx, cy, os.path.relpath(out, REPO)))


def disc_cut(name, cell, glow=False):
    """A round steel piece of the 3 x 2 hob sheet (cell 0-5) as a clean circle on a square canvas centred on it: the
    steel ring sits near the grey, so a key leaves its rim ragged. The circle is fitted to the keyed piece (its bbox,
    2 px in); inside it the pixels are as drawn. glow: outside the circle the glow is unmixed from the grey at
    partial alpha (the lit knob)."""
    a = L.load(SHEET)
    H, W = a.shape[:2]
    r0, c0 = divmod(cell, 3)
    oy, ox = r0 * H // 2, c0 * W // 3
    reg = a[oy:oy + H // 2, ox:ox + W // 3]
    soft, obj = L.key(reg, multi=2000, tol=3 if glow else 5, soft=True, soft_gain=1.25)
    if glow:  # the glow widens the key: the centre is the dark face's, the radius the same knob's off (R_OFF)
        dark = ndi.binary_fill_holes(ndi.binary_opening((reg.mean(2) < 75) & obj, iterations=2))
        lb, n = ndi.label(dark)
        cy, cx = ndi.center_of_mass(lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1))
        cx, cy = cx + 0.5, cy + 0.5
        R = R_OFF[0]
    else:
        lb, n = ndi.label(obj)
        core = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
        ys, xs = np.nonzero(core)
        cx, cy = (xs.min() + xs.max() + 1) / 2, (ys.min() + ys.max() + 1) / 2
        R = (xs.max() - xs.min() + ys.max() - ys.min() + 2) / 4 - 2
        if name == "knob-off":
            R_OFF[0] = R
    yy, xx = np.mgrid[0:reg.shape[0], 0:reg.shape[1]]
    body = np.clip(R - np.hypot(xx + 0.5 - cx, yy + 0.5 - cy) + 0.5, 0, 1)
    rgba = np.dstack([reg, body])
    if glow:
        rgba[..., :3] = reg * body[..., None] + soft[..., :3] * (1 - body[..., None])
        rgba[..., 3] = np.maximum(soft[..., 3] * ndi.binary_dilation(obj, iterations=30), body)
    ys, xs = np.nonzero(rgba[..., 3] > 0.02)
    h = int(np.ceil(np.hypot(xs + 0.5 - cx, ys + 0.5 - cy).max())) + PAD
    y0, x0 = int(round(cy)) - h, int(round(cx)) - h
    crop = np.zeros((2 * h, 2 * h, 4))
    sy0, sx0 = max(0, y0), max(0, x0)
    part = rgba[sy0:y0 + 2 * h, sx0:x0 + 2 * h]
    crop[sy0 - y0:sy0 - y0 + part.shape[0], sx0 - x0:sx0 - x0 + part.shape[1]] = part
    cv = L.to_img(crop)
    if max(cv.size) > SIZE:
        cv = cv.resize((SIZE, SIZE), Image.LANCZOS)
    out = os.path.join(CUTS, name + ".webp")
    cv.save(out, quality=90, method=6)
    print("%s: circle r %.0f at (%.0f, %.0f) of cell %d, %dx%d -> %s" % (name, R, cx, cy, cell, cv.width, cv.height, os.path.relpath(out, REPO)))


def shop_pin():
    im = Image.open(os.path.join(CUTS, "rolling-pin.webp")).convert("RGBA")
    rot = im.rotate(38, resample=Image.BICUBIC, expand=True)
    rot = rot.crop(rot.getbbox())
    cv = Image.new("RGBA", (rot.width + 2 * PAD, rot.height + 2 * PAD), (0, 0, 0, 0))
    cv.alpha_composite(rot, (PAD, PAD))
    out = os.path.join(REPO, "assets/cook/props/rolling-pin-walnut.webp")
    cv.save(out, quality=90, method=6)
    print("shop pin: %dx%d -> %s" % (cv.width, cv.height, os.path.relpath(out, REPO)))


if __name__ == "__main__":
    for n, r in OUTER.items():
        place(n, r)
    disc_cut("knob-off", 2)
    disc_cut("knob-on", 3, glow=True)
    disc_cut("tray", 4)
    shop_pin()
