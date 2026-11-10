#!/usr/bin/env python3
"""The mini run's pieces the overnight builders need (S19): corn's six dressing bowls cut off the stone tray (T-2, circles found by
Hough), the grill off its marble (G1-2, flood fill from the edges), the steel egg pan and the chaat bowl off magenta (s19_cut's key).
Usage: python3 build/tools/art/s19_cut_mini.py"""
import sys, os
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
import s19_cut as C
M = "sources/art/s19-mini/results/s19-mini-"; OUT = C.OUT

def bowls():
    im = Image.open(M + "T-2.png").convert("RGB")
    g = cv2.medianBlur(cv2.cvtColor(np.asarray(im)[:, :, ::-1], cv2.COLOR_BGR2GRAY), 5)
    c = cv2.HoughCircles(g, cv2.HOUGH_GRADIENT, dp=1.2, minDist=150, param1=80, param2=40, minRadius=60, maxRadius=110)[0]
    c = sorted(c.tolist(), key=lambda t: t[0])
    for (x, y, r), nm in zip(c, ["lemon", "salt", "chilli-powder", "green-chutney", "tamarind-chutney", "black-pepper"]):
        R = int(r - 1); crop = im.crop((int(x - R), int(y - R), int(x + R), int(y + R))).convert("RGBA")
        m = Image.new("L", crop.size, 0); ImageDraw.Draw(m).ellipse((1, 1, 2 * R - 1, 2 * R - 1), fill=255)
        crop.putalpha(m.filter(ImageFilter.GaussianBlur(1.2)))
        os.makedirs(OUT + "corn", exist_ok=True); crop.resize((300, 300), Image.LANCZOS).save(f"{OUT}corn/bowl-{nm}.webp", "WEBP", quality=90)

def grill():
    im = Image.open(M + "G1-2.png").convert("RGB"); m = im.copy()
    W, H = m.size
    seeds = [(x, 2) for x in range(0, W, 30)] + [(x, H - 3) for x in range(0, W, 30)] + [(2, y) for y in range(0, H, 30)] + [(W - 3, y) for y in range(0, H, 30)]
    for s in seeds:
        if m.getpixel(s) != (255, 0, 255) and sum(m.getpixel(s)) > 540: ImageDraw.floodfill(m, s, (255, 0, 255), thresh=34)
    a = (np.asarray(m) != [255, 0, 255]).any(-1).astype(np.uint8) * 255
    a = cv2.morphologyEx(a, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(a); k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    a = np.where(lab == k, 255, 0).astype(np.uint8)
    ys, xs = np.where(a > 0); box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    out = im.convert("RGBA"); out.putalpha(Image.fromarray(a).filter(ImageFilter.GaussianBlur(1)))
    out = out.crop(box)
    # the shadow ChatGPT painted under the grill (a grey ramp below the near rim; code draws shadows): rows from the bottom up whose
    # opaque pixels are colourless grey are cut, with a 2 px fade
    o = np.asarray(out).astype(int); al = o[..., 3] > 128; cut = o.shape[0]
    for y in range(o.shape[0] - 1, int(o.shape[0] * 0.8), -1):
        px = o[y][al[y]][:, :3]
        if len(px) and (px.max(1) - px.min(1)).mean() < 12: cut = y
        else: break
    o = o.copy(); o[cut:, :, 3] = 0
    for k in range(2): o[max(0, cut - 1 - k), :, 3] = (o[max(0, cut - 1 - k), :, 3] * (0.5 + 0.25 * k)).astype(int)
    out = Image.fromarray(o.astype(np.uint8), "RGBA").crop((0, 0, o.shape[1], cut))
    os.makedirs(OUT + "kit", exist_ok=True); out.save(f"{OUT}kit/grill.webp", "WEBP", quality=90)

def magenta(src, game, names, maxside, keep=None):
    a = np.asarray(Image.open(src).convert("RGB")).astype(float); al = C.alpha_of(a); rgb = C.despill(a, al)
    ps = C.pieces(al, len(names))
    for (lab, ids, box), nm in zip(ps, names):
        if keep and nm not in keep: continue
        C.save(rgb, al, box, ids, lab, f"{OUT}{game}/{nm}.webp", maxside)

bowls(); grill()
magenta(M + "E1-1.png", "eggs", ["pan-iron", "pan-steel"], 700, keep={"pan-steel"})
magenta(M + "C1-1.png", "chaat", ["bowl-empty"], 900)
print("done")
