#!/usr/bin/env python3
"""Guide images for the hands v2 master retries (25 Sept 2026).

The image model ignores a second reference image and keeps redrawing the
same failures (thumb out on count-4, palms on the catch, a side-on fist for
the knife grip). Edit mode works best as a small change to an image that is
already nearly right, so each retry starts from an approved master with the
placeholder object painted in (behind the hand, pure magenta) or the part
to change masked:

  b1  d4-squeeze-f2-tight-t fist + a handle leaving the fist between thumb and index
  a2  a1-flat-palm-t with the fingers and palm foreshortened (tipped up on the heel)
  c2  c1-pinch-f2-closed-t + a pencil-thin rod through the pinch, to the upper left
  c3  c1-pinch-f2-closed-t / -e + a card standing on the pinch
  d3  b4-rolling-pin-t pair + a disc (a bowl from above) under the fingers
  e3-count-4  e3-count-5-e + a mask over the thumb (the edit only redraws that)
  d6-f1  not a guide: made in code from a5-wave-f1-e and its mirror (see make_d6)
  e3-count-4  after the API tries: made in code from e3-count-5-e (make_count4)
  e5     not a guide: a copy of d4-squeeze-f2-tight-t (the same view: the back of
         a fist, the forearm from the bottom edge)

    python3 build/hand_guides.py            # writes sources/art/hands/guides/*.png
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402

M = os.path.join(ga.GAME, "assets/characters/hands/master")
G = os.path.join(ga.GAME, "sources/art/hands/guides")
MAGENTA = (255, 0, 255, 255)


def master(mid):
    return Image.open(os.path.join(M, f"hand-{mid}.png")).convert("RGBA")


def behind(hand, draw_fn):
    """Paint an object with draw_fn(ImageDraw) and put the hand in front of it."""
    layer = Image.new("RGBA", hand.size, (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(layer))
    layer.alpha_composite(hand)
    return layer


def square(im, size=1024):
    """Pad to a square canvas (the edit endpoint returns 1024x1024) and fit."""
    s = max(im.size)
    c = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    c.paste(im, ((s - im.width) // 2, s - im.height))
    return c.resize((size, size), Image.LANCZOS)


def foreshorten(im, knuckles_y, wrist_y, fingers=0.45, palm=0.8):
    """Squash the rows above the wrist: palm rows by `palm`, finger rows by
    `fingers`, keeping the wrist and forearm where they are."""
    a = np.asarray(im)
    out = np.zeros_like(a)
    out[wrist_y:] = a[wrist_y:]
    k_out = wrist_y - (wrist_y - knuckles_y) * palm
    for y in range(wrist_y):
        if y >= k_out:
            src = wrist_y - (wrist_y - y) / palm
        else:
            src = knuckles_y - (k_out - y) / fingers
        if src >= 0:
            out[y] = a[int(round(src))]
    return Image.fromarray(out, "RGBA")


def make_d6():
    """d6 frame 1 (open, backs of both hands towards us): the approved a5-f1
    open hand as the right hand and its mirror as the left, a hand's width
    apart, forearms from the bottom edge, on one canvas."""
    r = master("a5-wave-f1-e")
    left = r.transpose(Image.FLIP_LEFT_RIGHT)
    a = np.asarray(r)[..., 3] > 128
    rows = a[: int(r.height * 0.6)]  # the hand, not the sleeve
    xs = np.where(rows.any(0))[0]
    x0, x1 = int(xs[0]), int(xs[-1])  # the right hand's extent (thumb on the left)
    hand_w = x1 - x0
    gap = int(hand_w * 0.45)  # thumb tip to thumb tip, about 15 cm at this scale
    pad = 60
    # left hand (mirror): its extent is W-1-x1 .. W-1-x0; put that at pad
    lx = pad - (r.width - 1 - x1)
    rx = pad + hand_w + gap - x0
    W = rx + r.width if rx + x1 + pad > rx + r.width else rx + x1 + pad
    c = Image.new("RGBA", (max(W, rx + x1 + pad), r.height), (0, 0, 0, 0))
    c.alpha_composite(left, (lx, 0)) if lx >= 0 else c.alpha_composite(left.crop((-lx, 0, left.width, left.height)), (0, 0))
    c.alpha_composite(r.crop((0, 0, min(r.width, c.width - rx), r.height)), (rx, 0))
    bb = c.getbbox()
    return c.crop((max(0, bb[0] - pad), 0, min(c.width, bb[2] + pad), c.height))


def make_b1_collage():
    """b1 retry (round 3): the approved top-down fist (d4-squeeze-f2-tight-t)
    with the magenta handle leaving it at the index side, and a thumb laid
    ON the handle: the extended index finger of the approved top-down point
    (c4-point-t, back view with its nail) made thicker and shorter, turned to
    the handle's angle, its root blended into the side of the fist. A collage
    for the edit to redraw as one hand."""
    fist = master("d4-squeeze-f2-tight-t")
    g = behind(fist, lambda d: (
        d.line([(372, 640), (318, 60)], fill=MAGENTA, width=66),
        d.ellipse([285, 27, 351, 93], fill=MAGENTA)))
    src = master("c4-point-t").crop((505, 60, 598, 400))
    a = np.asarray(src).copy()
    ys = np.arange(a.shape[0])[:, None]
    fade = np.clip((a.shape[0] - 1 - ys) / 90.0, 0, 1)  # fade the root into the fist
    a[..., 3] = (a[..., 3] * fade).astype(np.uint8)
    thumb = Image.fromarray(a, "RGBA").resize((int(93 * 1.25), int(340 * 0.95)), Image.LANCZOS)
    angle = np.degrees(np.arctan2(54, 580))  # the handle leans left going up
    thumb = thumb.rotate(angle, resample=Image.BICUBIC, expand=True)
    # root at the side of the fist, tip along the handle
    g.alpha_composite(thumb, (338 - thumb.width // 2, 610 - thumb.height))
    return g


def make_a2_perspective(knuckles_y=370, wrist_y=690, fingers=0.42, palm=0.78, tip_grow=0.3, cx=None):
    """a2 retry (round 3): a1-flat-palm-t tipped up on its heel. As in
    foreshorten(), but with perspective: rows nearer the fingertips (closer
    to the camera) are widened about the hand's centre, up to 1 + tip_grow
    at the tips, and brightened a little, so the fingers read as rising
    towards the viewer rather than as short fingers."""
    im = foreshorten(master("a1-flat-palm-t"), knuckles_y, wrist_y, fingers, palm)
    a = np.asarray(im).astype(np.float64)
    ys = np.where(a[..., 3].max(1) > 16)[0]
    top = int(ys[0])
    k_out = int(wrist_y - (wrist_y - knuckles_y) * palm)
    if cx is None:
        cx = float(np.average(np.arange(a.shape[1]), weights=a[k_out, :, 3] + 1e-6))
    out = a.copy()
    xs = np.arange(a.shape[1], dtype=np.float64)
    for y in range(top, k_out + 40):
        t = np.clip((k_out + 40 - y) / (k_out + 40 - top), 0, 1)  # 0 at the knuckles, 1 at the tips
        k = 1 + tip_grow * t ** 1.3
        src = cx + (xs - cx) / k
        for c in range(4):
            out[y, :, c] = np.interp(src, xs, a[y, :, c], left=0, right=0)
        out[y, :, :3] *= 1 + 0.08 * t
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA")


def make_count4():
    """e3-count-4 (the thumb folded away behind the hand), after two API
    attempts put the thumb back: the approved count-5 with the thumb cut
    away along a smooth curve (the palm's edge from the index finger's base
    to the wrist, bowed slightly outwards like the other side of the palm),
    an anti-aliased edge, and the edge shaded darker the way the palm's
    right edge is (the form turning away)."""
    im = master("e3-count-5-e")
    a = np.asarray(im).astype(np.float64)
    H_, W_ = a.shape[:2]
    yy, xx = np.mgrid[0:H_, 0:W_]
    y0, y1 = 372.0, 640.0
    t = np.clip((yy - y0) / (y1 - y0), 0, 1)
    edge = 368 + 22 * t - 12 * np.sin(np.pi * t)  # bows out a little mid-palm
    # above the palm, up the index finger's base: meet the finger's own edge
    edge = np.where(yy < y0, 322 + (yy - 300) * (46 / 72), edge)
    d = xx - edge  # > 0 inside the hand
    band = (yy >= 300) & (yy <= y1 + 10)
    cut = band & (d < 0)
    top = (yy < 300) & (yy >= 230) & (xx < 300)  # the thumb's tip, left of the index finger
    alpha = a[..., 3].copy()
    alpha[cut | top] = 0
    edge_a = band & (d >= 0) & (d < 1.5)
    alpha[edge_a] *= d[edge_a] / 1.5
    shade = band & (d >= 0) & (d < 26)
    k = 1 - 0.16 * (1 - d[shade] / 26) ** 1.5
    a[..., :3][shade] *= k[:, None]
    a[..., 3] = alpha
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


def main():
    os.makedirs(G, exist_ok=True)
    # b1 lives in its own step (made first, reviewed) but is rebuilt here too
    g = behind(master("d4-squeeze-f2-tight-t"), lambda d: (
        d.line([(385, 470), (330, 60)], fill=MAGENTA, width=66),
        d.ellipse([297, 27, 363, 93], fill=MAGENTA)))
    g.save(os.path.join(G, "b1-handle-guide.png"))
    make_b1_collage().save(os.path.join(G, "b1-thumb-collage-guide.png"))
    foreshorten(master("a1-flat-palm-t"), knuckles_y=370, wrist_y=690).save(os.path.join(G, "a2-heel-push-guide.png"))
    make_a2_perspective().save(os.path.join(G, "a2-heel-push-perspective-guide.png"))
    g = behind(master("c1-pinch-f2-closed-t"), lambda d: (
        d.line([(430, 300), (130, 40)], fill=MAGENTA, width=26),
        d.line([(430, 300), (640, 480)], fill=MAGENTA, width=26)))
    g.save(os.path.join(G, "c2-tripod-guide.png"))
    g = behind(master("c1-pinch-f2-closed-t"), lambda d: d.rectangle([295, 10, 500, 300], fill=MAGENTA))
    g.save(os.path.join(G, "c3-side-pinch-t-guide.png"))
    g = behind(master("c1-pinch-f2-closed-e"), lambda d: d.rectangle([760, 0, 965, 310], fill=MAGENTA))
    g.save(os.path.join(G, "c3-side-pinch-e-guide.png"))
    g = behind(master("b4-rolling-pin-t"), lambda d: d.ellipse([330, 20, 950, 640], fill=MAGENTA))
    g.save(os.path.join(G, "d3-bowl-guide.png"))
    # count-4: the image and a mask whose transparent part (the thumb and a
    # margin round it) is the only area the edit may redraw
    im = master("e3-count-5-e")
    mask = Image.new("RGBA", im.size, (0, 0, 0, 255))
    ImageDraw.Draw(mask).polygon([(130, 240), (335, 250), (352, 400), (345, 610), (290, 590), (130, 440)], fill=(0, 0, 0, 0))
    mask.save(os.path.join(G, "e3-count-4-mask.png"))
    # try 2 (the mask edit was ignored): the thumb erased in code, the palm's
    # edge a straight line from the index finger's base to the wrist
    a = np.asarray(im).copy()
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    edge_x = 333 + (yy - 380) * (14 / 240)
    thumb = ((yy >= 300) & (yy <= 640) & (xx < edge_x) & (xx < 360)) | ((yy >= 240) & (yy < 300) & (xx < 290))
    a[thumb, 3] = 0
    Image.fromarray(a, "RGBA").save(os.path.join(G, "e3-count-4-guide.png"))
    print("guides written to", os.path.relpath(G, ga.GAME))
    out = os.path.join(M, "hand-d6-two-hand-catch-f1-open-e.png")
    make_d6().save(out)
    print("wrote", os.path.relpath(out, ga.GAME))
    out = os.path.join(M, "hand-e3-count-4-e.png")
    make_count4().save(out)
    print("wrote", os.path.relpath(out, ga.GAME))
    # e5 (raised fist from behind) is the same view as the approved top-down
    # back of the fist; the API drew the front of the fist twice
    out = os.path.join(M, "hand-e5-arm-up-fist-e.png")
    master("d4-squeeze-f2-tight-t").save(out)
    print("wrote", os.path.relpath(out, ga.GAME))


if __name__ == "__main__":
    main()
