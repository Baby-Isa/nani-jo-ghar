#!/usr/bin/env python3
"""The samosa fold from a round sheet (Zafar, 9 Nov, from a family-style video: "the filling in the middle of a round circle, then one
side folds, then the second side, then the bottom flap"). Geometry: the three creases are the sides of an equilateral triangle
centred on the circle, each at distance d from the centre. Folding a cap over its crease puts its arc through the point 2d - R past
the centre: at d = R/2 (the triangle inscribed in the circle) the three caps meet exactly at the centre; at d < R/2 they overlap
past it, so the closed samosa is sealed with no gap. The closed shape is an equilateral triangle of side 2*sqrt(3)*d; the filling
must fit inside its incircle (radius d). Left, then right, then the bottom: three folds, each a card flip seen from straight above.
Usage: python3 build/tools/art/samosa_circle_rig.py <outdir>"""
import math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC = "sources/art/s19-mocks2/zafar-fold/9.webp"   # his ChatGPT strip, panel 1
C, R = (224, 241), 179            # panel 1's sheet: centre and radius
D = 0.47                          # creases at 0.47 R: the caps overlap just past the centre, and fold back almost inside the triangle
FILL_R, FILL_S = 0.47, 0.55       # the filling scaled to sit inside the closed triangle (incircle 0.47 R)
CLOSED = (1420, 520, 1712, 800)   # panel 8: the closed samosa
PAD = 40

def load():
    import cv2
    a = np.asarray(Image.open(SRC).convert("RGB")).astype(np.uint8)
    box = (C[0] - R - 8, C[1] - R - 8, C[0] + R + 8, C[1] + R + 8)
    sheet = a[box[1]:box[3], box[0]:box[2]].copy(); h, w = sheet.shape[:2]; c = (R + 8, R + 8)
    yy, xx = np.mgrid[0:h, 0:w]; r = np.hypot(xx - c[0], yy - c[1])
    alpha = (np.clip((R - r) * 1.2 + 0.5, 0, 1) * 255).astype(np.uint8)
    si = sheet.astype(int); sat = si.max(-1) - si.min(-1)
    filling = ((sat > 95) | (si.sum(-1) < 520)) & (r < 0.62 * R)                 # the filling and its specks, not the cream pastry
    fm = Image.fromarray((filling * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))
    hole = np.asarray(fm) > 0
    pastry = cv2.inpaint(sheet, hole.astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA)
    ys, xs = np.where(filling); fx0, fx1, fy0, fy1 = xs.min(), xs.max(), ys.min(), ys.max()
    blob = Image.fromarray(sheet).crop((fx0 - 6, fy0 - 6, fx1 + 6, fy1 + 6)).convert("RGBA")
    bm = Image.fromarray((filling[fy0 - 6:fy1 + 6, fx0 - 6:fx1 + 6] * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1))
    blob.putalpha(bm); blob = blob.resize((int(blob.width * FILL_S), int(blob.height * FILL_S)), Image.LANCZOS)
    out = Image.fromarray(np.dstack([pastry, alpha]), "RGBA")
    sh = Image.new("RGBA", blob.size, (0, 0, 0, 0)); sh.putalpha(blob.split()[3].point(lambda v: int(v * 0.25)))
    out.alpha_composite(sh.filter(ImageFilter.GaussianBlur(3)), (int(c[0] - blob.width / 2) + 3, int(c[1] - blob.height / 2) + 4))
    out.alpha_composite(blob, (int(c[0] - blob.width / 2), int(c[1] - blob.height / 2)))
    full = np.asarray(out).astype(float).copy(); full[..., 3] = alpha
    closed = Image.open(SRC).convert("RGB").crop(CLOSED); ca = np.asarray(closed).astype(int)
    cal = (((ca.max(-1) - ca.min(-1)) > 34) * 255).astype(np.uint8)
    cm = Image.fromarray(cal).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
    closed = closed.convert("RGBA"); closed.putalpha(cm)
    return full, c, closed

SHEET, CC, CLOSED_IM = load()
SH, SW = SHEET.shape[:2]
W, H = SW + 2 * PAD, SH + 2 * PAD
CX, CY = PAD + CC[0], PAD + CC[1]                                   # the circle's centre on the canvas
NORMALS = {"left": (-math.cos(math.pi / 6), -0.5), "right": (math.cos(math.pi / 6), -0.5), "bottom": (0.0, 1.0)}
ORDER = ["left", "right", "bottom"]
YY, XX = np.mgrid[0:H, 0:W].astype(float)
UNDER = np.array([240, 222, 180], float)

def fold(layers, name, t):
    """Fold every layer's part beyond the crease by t (0 flat, 1 over): returns (static layers, moving layers drawn on top, height)."""
    n = NORMALS[name]; u = (-n[1], n[0]); a = (CX + n[0] * D * R, CY + n[1] * D * R)
    th = math.pi * t; c = math.cos(th); c = math.copysign(max(abs(c), 0.035), c if c != 0 else 1)
    beyond = ((XX - a[0]) * n[0] + (YY - a[1]) * n[1]) > 0
    qx, qy = XX - a[0], YY - a[1]; along = qx * u[0] + qy * u[1]; perp = (qx * n[0] + qy * n[1]) / c
    sx, sy = a[0] + along * u[0] + perp * n[0], a[1] + along * u[1] + perp * n[1]
    ix, iy = np.clip(sx.round().astype(int), 0, W - 1), np.clip(sy.round().astype(int), 0, H - 1)
    ok = (sx >= 0) & (sy >= 0) & (sx < W) & (sy < H) & beyond[iy, ix]
    static, moving = [], []
    for L in layers:
        s = L.copy(); s[..., 3] *= ~beyond; static.append(s)
        m = L[iy, ix].copy(); m[..., 3] *= ok
        if c < 0: m[..., :3] = m[..., :3] * 0.84 + UNDER * 0.16                # its underside shows once past upright
        m[..., :3] = np.clip(m[..., :3] * (1 - 0.2 * math.sin(th)), 0, 255); moving.append(m)
    if c < 0: moving = moving[::-1]                                             # flipped over: the bottom layer is now on top
    vis = np.zeros((H, W), bool)
    for m in moving: vis |= m[..., 3] > 10
    h = float((np.abs(perp) * math.sin(th))[vis].mean()) if vis.any() else 0.0
    return static, moving, h

def state(ts):
    """The sheet with the folds done so far (each t 0 or 1 before the one in motion); returns layers bottom to top and the last height."""
    base = np.zeros((H, W, 4)); base[PAD:PAD + SH, PAD:PAD + SW] = SHEET
    layers, h = [base], 0.0
    for nm in ORDER:
        if ts[nm] <= 0: break
        st, mv, h = fold(layers, nm, ts[nm]); layers = st + mv
        if ts[nm] < 1: break
    return layers, h

def frame(ts, closed=0.0):
    img = Image.new("RGBA", (W, H), (238, 236, 233, 255))
    if closed >= 1:
        k = (2 * math.sqrt(3) * D * R * 1.04) / CLOSED_IM.width; s = k * (1 + 0.04 * math.sin(math.pi * min(1, closed - 1)))
        ci = CLOSED_IM.resize((int(CLOSED_IM.width * s), int(CLOSED_IM.height * s)), Image.LANCZOS)
        sh = Image.new("RGBA", ci.size, (0, 0, 0, 0)); sh.putalpha(ci.split()[3].point(lambda v: int(v * 0.28)))
        x, y = int(CX - ci.width / 2), int(CY + D * R - ci.height * 0.97)
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)), (x + 6, y + 8)); img.alpha_composite(ci, (x, y)); return img
    layers, h = state(ts)
    for k, L in enumerate(layers):
        lay = Image.fromarray(L.astype(np.uint8), "RGBA"); off = 4 + (h * 0.16 if k == len(layers) - 1 else 0)
        sh = Image.new("RGBA", lay.size, (0, 0, 0, 0)); sh.putalpha(lay.split()[3].point(lambda v: int(v * 0.24)))
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(3 + h * 0.04)), (int(off), int(off * 1.2))); img.alpha_composite(lay)
    return img

def ease(x): return 0.5 - 0.5 * math.cos(math.pi * x)
def T(l=0, r=0, b=0): return {"left": l, "right": r, "bottom": b}

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "sources/art/s19-mocks2/guides"
    keys = [(T(), 0), (T(0.4), 0), (T(1), 0), (T(1, 0.4), 0), (T(1, 1), 0), (T(1, 1, 0.4), 0), (T(1, 1, 1), 0), (T(1, 1, 1), 1.5)]
    names = ["filling in the middle", "left side lifts", "left side down", "right side lifts", "right side down", "bottom lifts", "sealed", "closed samosa"]
    tiles = [frame(*k).convert("RGB") for k in keys]
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
    S = Image.new("RGB", (len(tiles) * (W + 8) + 8, H + 40), (250, 248, 245)); d = ImageDraw.Draw(S)
    for i, (tl, nm) in enumerate(zip(tiles, names)): S.paste(tl, (8 + i * (W + 8), 34)); d.text((12 + i * (W + 8), 8), nm, fill=(40, 30, 20), font=f)
    S.save(f"{out}/samosa-circle-rig-strip.jpg", quality=88)
    seq = [(T(), 0)] * 8
    for nm in ORDER:
        done = {k: (1 if ORDER.index(k) < ORDER.index(nm) else 0) for k in ORDER}
        seq += [({**done, nm: ease(i / 16)}, 0) for i in range(1, 17)] + [({**done, nm: 1}, 0)] * 4
    seq += [(T(1, 1, 1), 1 + i / 8) for i in range(1, 9)] + [(T(1, 1, 1), 2)] * 14
    gif = [frame(*k).convert("RGB").resize((W * 3 // 4, H * 3 // 4)) for k in seq]
    gif[0].save(f"{out}/samosa-circle-rig.gif", save_all=True, append_images=gif[1:], duration=50, loop=0, optimize=True)
    print("wrote", len(seq), "frames")
