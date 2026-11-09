#!/usr/bin/env python3
"""The samosa fold's geometry guide (SAM-21, Zafar 9 Nov: "draw it in code for ChatGPT to then replicate ... the stages of folding,
exactly proportions"). A sheet 1.22 wide to 1 tall (a square would not close: each corner would land past the far crease; at
this ratio each corner lands just inside the triangle), the filling low in the middle; the crease lines run from the top edge's
middle to each bottom corner; the right flap folds over its crease, then the left; the result is the triangle top-middle,
bottom-left, bottom-right, 1.22 wide to 1 tall (the look of round 2's B3-2 frame 3). Mid-folds are drawn as the flap's straight-down view turned part way over its crease.
Usage: python3 build/tools/art/samosa_fold_guide.py <out.png>"""
import math, sys
from PIL import Image, ImageDraw, ImageFont
S = 360; PAD = 60; PW = S + 2 * PAD; N = 5
HS = 0.82                                    # the sheet's height for a width of 1
TOP = (0.5, 0.0); BL = (0.0, HS); BR = (1.0, HS); TL = (0.0, 0.0); TR = (1.0, 0.0)
FILL_C, FILL_R = (0.5, 0.54), 0.2           # inside the final triangle's incircle (r 0.281 at y 0.539)
FACE, BACK, EDGE = (236, 205, 140), (214, 180, 112), (150, 112, 60)
def refl(p, a, b, t):
    """p turned by t*pi about the line a-b, seen from straight above (the in-plane offset scales by cos)."""
    dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L
    px, py = p[0] - a[0], p[1] - a[1]; along = px * ux + py * uy
    fx, fy = a[0] + along * ux, a[1] + along * uy; c = math.cos(math.pi * t)
    return (fx + (p[0] - fx) * c, fy + (p[1] - fy) * c)
def xy(p, ox): return (ox + PAD + p[0] * S, PAD + p[1] * S)
def dashed(d, a, b, ox):
    (x0, y0), (x1, y1) = xy(a, ox), xy(b, ox); n = 18
    for i in range(0, n, 2):
        d.line([(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n), (x0 + (x1 - x0) * (i + 1) / n, y0 + (y1 - y0) * (i + 1) / n)], fill=(120, 90, 50), width=3)
def frame(d, ox, t1, t2, label, f):
    right = [TOP, TR, BR]; left = [TOP, TL, BL]; base = [TOP, BR, BL]
    d.polygon([xy(p, ox) for p in base], fill=FACE, outline=EDGE)
    for flap, t in ((left, t2), (right, t1)):
        if t == 0: d.polygon([xy(p, ox) for p in flap], fill=FACE, outline=EDGE)
    if t1 < 1 or t2 < 1:   # the filling shows until both flaps are over it
        cx, cy = xy(FILL_C, ox); r = FILL_R * S
        if t1 == 0 and t2 == 0:
            d.ellipse([cx - r, cy - r * 0.8, cx + r, cy + r * 0.8], fill=(170, 130, 60), outline=(110, 80, 30), width=2)
            for i in range(9):
                a = i * 0.7; d.ellipse([cx + math.cos(a) * r * 0.55 - 9, cy + math.sin(a) * r * 0.4 - 9, cx + math.cos(a) * r * 0.55 + 9, cy + math.sin(a) * r * 0.4 + 9], fill=(90, 150, 60) if i % 3 == 0 else (230, 190, 90))
        else:
            d.ellipse([cx - r, cy - r * 0.8, cx + r, cy + r * 0.8], fill=(170, 130, 60), outline=(110, 80, 30), width=2)
    if t1 == 0 and t2 == 0: dashed(d, TOP, BR, ox); dashed(d, TOP, BL, ox)
    for flap, t, a, b in ((right, t1, TOP, BR), (left, t2, TOP, BL)):
        if t > 0:
            pts = [refl(p, a, b, t) for p in flap]
            d.polygon([xy(p, ox) for p in pts], fill=BACK if t >= 0.5 else FACE, outline=EDGE)
    d.text((ox + PAD, PAD + int(S * HS) + 14), label, fill=(40, 30, 20), font=f)
def main(out):
    im = Image.new("RGB", (PW * N, int(S * HS) + 2 * PAD + 50), (246, 244, 241)); d = ImageDraw.Draw(im)
    try: f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    except OSError: f = ImageFont.load_default()
    steps = [(0, 0, "1 flat, filling, creases"), (0.62, 0, "2 right corner lifting over"), (1, 0, "3 right flap down"),
             (1, 0.62, "4 left corner lifting over"), (1, 1, "5 the samosa")]
    for i, (t1, t2, lab) in enumerate(steps):
        frame(d, i * PW, t1, t2, lab, f)
        if i: d.line([(i * PW, 20), (i * PW, int(S * HS) + 2 * PAD + 30)], fill=(210, 205, 198), width=2)
    im.save(out)
if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "sources/art/s19-mocks2/guides/samosa-fold-guide.png")
