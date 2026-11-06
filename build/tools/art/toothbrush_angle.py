#!/usr/bin/env python3
"""The toothbrush angle diagram (CLN-180, Zafar 6 Nov): the reference the clinic redo block attaches, since no free photo
from his angle was found (Wikimedia Commons, 17 checked, 6 Nov). No text in the picture (a reference ChatGPT must not copy
letters from). What it shows: a toothbrush lying on its side on a white marble counter, its bristles facing AWAY from the
viewer; the eye a little above the counter's plane, so we see the back of the head and the back of the handle square-on
(the handle's Olympic Blue grip panel facing us, never twisted), the brush's upper edge as a thin strip, and just the bristle
tips showing above the head, receding away.

  python3 build/tools/art/toothbrush_angle.py sources/art/clinic-redo/toothbrush-angle.png"""
import sys

from PIL import Image, ImageDraw, ImageFilter

W, H = 1536, 768
OLYMPIC = (90, 130, 179)        # Wada Olympic Blue #5a82b3
OLYMPIC_DK = (66, 100, 145)
CREAM = (238, 233, 224)
CREAM_TOP = (250, 248, 243)
CREAM_DK = (214, 207, 196)
BRISTLE = (247, 247, 250)
BRISTLE_DK = (214, 218, 226)


def main(out):
    im = Image.new("RGB", (W, H), (236, 235, 239))  # noqa
    d = ImageDraw.Draw(im)
    # the counter: white marble seen from a little above (lighter far away, a soft far edge high in the frame)
    for y in range(H):
        t = y / H
        c = tuple(int(a * (1 - t) + b * t) for a, b in zip((226, 225, 230), (240, 239, 243)))
        d.line([(0, y), (W, y)], fill=c)
    d.rectangle([0, 0, W, 150], fill=(206, 204, 210))  # the wall behind the counter's far edge
    x0, x1 = 230, 1040           # the handle, left to right, parallel to the picture (square-on)
    hy0, hy1 = 392, 452          # the back of the handle: its face towards us
    nx1 = 1110                   # the neck narrows into the head
    hx0, hx1 = 1110, 1330        # the head's back
    gy0, gy1 = 382, 462          # the head is a little taller than the neck
    # bristle tips: behind the head, pointing away, seen just over its top edge (the eye a little above the plane)
    tuft_y = gy0 - 26
    d.rounded_rectangle([hx0 + 14, tuft_y, hx1 - 14, gy0 + 6], radius=10, fill=BRISTLE_DK, outline=(170, 176, 190), width=2)
    for k in range(11):
        cx = hx0 + 28 + k * ((hx1 - hx0 - 56) / 10)
        d.ellipse([cx - 9, tuft_y - 7, cx + 9, tuft_y + 9], fill=BRISTLE, outline=(170, 176, 190), width=2)
    # the brush's upper edge (its side, facing up as it lies on its side): a thin lit strip
    d.rounded_rectangle([x0, hy0 - 10, x1, hy0 + 6], radius=8, fill=CREAM_TOP)
    d.polygon([(x1, hy0 - 10), (nx1, hy0 + 2), (nx1, hy0 + 14), (x1, hy0 + 4)], fill=CREAM_TOP)
    d.rounded_rectangle([hx0, gy0 - 9, hx1, gy0 + 6], radius=8, fill=CREAM_TOP)
    # the back of the handle, square-on, with its Olympic Blue grip panel centred on it
    d.rounded_rectangle([x0, hy0, x1, hy1], radius=26, fill=CREAM)
    d.polygon([(x1 - 20, hy0), (nx1 + 10, hy0 + 12), (nx1 + 10, hy1 - 12), (x1 - 20, hy1)], fill=CREAM)
    d.rounded_rectangle([x0 + 120, hy0 + 10, x0 + 520, hy1 - 10], radius=18, fill=OLYMPIC)
    d.rounded_rectangle([x0 + 120, hy1 - 22, x0 + 520, hy1 - 10], radius=6, fill=OLYMPIC_DK)
    d.rounded_rectangle([x0 + 560, hy0 + 22, x0 + 640, hy1 - 22], radius=8, fill=OLYMPIC)
    # the back of the head (no bristles show through it)
    d.rounded_rectangle([hx0, gy0, hx1, gy1], radius=36, fill=CREAM)
    d.rounded_rectangle([hx0 + 30, gy0 + 18, hx1 - 30, gy1 - 18], radius=22, fill=OLYMPIC)
    # soft shading: light from the upper left, a little darker along the lower edge of each face
    sh = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(sh)
    sd.rounded_rectangle([x0, hy1 - 14, nx1, hy1], radius=10, fill=60)
    sd.rounded_rectangle([hx0, gy1 - 16, hx1, gy1], radius=12, fill=60)
    sh = sh.filter(ImageFilter.GaussianBlur(5))
    im = Image.composite(Image.new("RGB", (W, H), CREAM_DK), im, sh)
    im.save(out)
    print(out)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "toothbrush-angle.png")
