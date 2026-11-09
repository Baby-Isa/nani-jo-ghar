#!/usr/bin/env python3
"""The samosa fold as a rig, not as painted frames (SAM-21, Zafar 9 Nov: "why can't we use the samosa?").
One flat sheet from the art (s19-mini S1-2, stage 1: its creases already run from the top edge's middle to each bottom corner, the
filling wholly inside the middle triangle) is cut into three pieces along the creases; each side flap turns over its crease as a
2D card flip seen from straight above (the offset from the crease scales by cos of the angle; past 90 degrees the flap's underside
shows: paler, mirrored), shaded as it turns from the light and casting a soft shadow that grows with its height. When both flaps
are down, the closed samosa from the same art (stage 5) takes over with a small settle. This is how a game studio does an
interactive fold: the child's finger drives the angle, so it follows the drag and always lands exactly.
Usage: python3 build/tools/art/samosa_fold_rig.py <outdir>   (writes samosa-fold-rig-strip.jpg and samosa-fold-rig.gif)"""
import math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC = "sources/art/s19-mini/results/s19-mini-S1-2.png"
SHEET = (30, 355, 330, 596)        # stage 1's sheet in the source (x0, y0, x1, y1)
CLOSED = (1330, 340, 1656, 606)    # stage 5's closed samosa
PAD = 70

def cut(box, pad=8):
    im = Image.open(SRC).convert("RGB").crop((box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad))
    a = np.asarray(im).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    sat = a.max(-1) - a.min(-1)
    alpha = ((sat > 38) | (a.sum(-1) < 520)).astype(np.uint8) * 255      # pastry and filling, not the pale grey marble
    m = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    im = im.convert("RGBA"); im.putalpha(m); return im, pad

SHEET_IM, SP = cut(SHEET)
FILL_AT, FILL_R = (149, 164), (86, 68)      # the art's filling (sheet coords): low, so the side flaps cannot cover it
FILL_TO, FILL_S = (150, 112), 0.6           # where the flaps do cover: the diamond they overlap in, high in the middle

def refill(im, sp):
    """Lift the filling out (pastry filled in under it from its surroundings) and put it back higher and smaller."""
    a = np.asarray(im).astype(float); h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]; cx, cy = FILL_AT[0] + sp, FILL_AT[1] + sp
    ell = (((xx - cx) / (FILL_R[0] + 16)) ** 2 + ((yy - cy) / (FILL_R[1] + 16)) ** 2) <= 1
    keep = (~ell) & (a[..., 3] > 200)
    rgb = Image.fromarray(np.where(keep[..., None], a[..., :3], 0).astype(np.uint8)); km = Image.fromarray((keep * 255).astype(np.uint8))
    num = np.asarray(rgb.filter(ImageFilter.GaussianBlur(28))).astype(float); den = np.asarray(km.filter(ImageFilter.GaussianBlur(28))).astype(float)[..., None] / 255
    smooth = num / np.maximum(den, 1e-3)
    plain = a[sp + 10:sp + 80, sp + 215:sp + 290, :3].reshape(-1, 3).mean(0)
    wt = np.clip(den * 2, 0, 1) * 0.5                                    # the surroundings' colour near the edge, plain pastry inside
    smooth = smooth * wt + plain * (1 - wt)
    patch = a[sp + 10:sp + 80, sp + 215:sp + 290, :3]; ph, pw = patch.shape[:2]          # plain pastry, top left
    detail = patch - np.asarray(Image.fromarray(patch.astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))).astype(float)
    out = a.copy(); out[..., :3] = np.where(ell[..., None], smooth + detail[yy % ph, xx % pw], a[..., :3])
    base = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA")
    src = Image.open(SRC).convert("RGBA"); sx, sy = SHEET[0] + FILL_AT[0], SHEET[1] + FILL_AT[1]
    blob = src.crop((sx - FILL_R[0], sy - FILL_R[1], sx + FILL_R[0], sy + FILL_R[1]))
    m = Image.new("L", blob.size, 0); ImageDraw.Draw(m).ellipse((6, 6, blob.width - 6, blob.height - 6), fill=255); blob.putalpha(m.filter(ImageFilter.GaussianBlur(5)))
    blob = blob.resize((int(blob.width * FILL_S), int(blob.height * FILL_S)), Image.LANCZOS)
    base.alpha_composite(blob, (int(FILL_TO[0] + sp - blob.width / 2), int(FILL_TO[1] + sp - blob.height / 2)))
    al = np.asarray(base).copy(); al[..., 3] = np.where(ell, 255, a[..., 3]); return Image.fromarray(al, "RGBA")

SHEET_IM = refill(SHEET_IM, SP)
CLOSED_IM, _ = cut(CLOSED)
SW, SH = SHEET[2] - SHEET[0], SHEET[3] - SHEET[1]
TOP, TL, TR, BL, BR = (SW / 2, 0), (0, 0), (SW, 0), (0, SH), (SW, SH)
W, H = SHEET_IM.width + 2 * PAD, SHEET_IM.height + 2 * PAD
OX, OY = PAD + SP, PAD + SP                                            # the sheet's (0, 0) on the canvas

def poly_mask(pts, size, off):
    m = Image.new("L", size, 0); ImageDraw.Draw(m).polygon([(x + off[0], y + off[1]) for x, y in pts], fill=255); return np.asarray(m) / 255.0

SRC_A = np.asarray(SHEET_IM).astype(float)
CENTRE = poly_mask([TOP, BR, BL], SHEET_IM.size, (SP, SP))
FLAPS = {"right": ([TOP, TR, BR], TOP, BR), "left": ([TOP, TL, BL], TOP, BL)}

def flap_layer(name, t):
    """The flap turned by t (0 flat, 1 folded over), straight above: RGBA canvas and its mean height."""
    pts, a, b = FLAPS[name]; pm = poly_mask(pts, SHEET_IM.size, (SP, SP))
    th = math.pi * t; c = math.cos(th); c = math.copysign(max(abs(c), 0.035), c if c != 0 else 1)
    ux, uy = b[0] - a[0], b[1] - a[1]; L = math.hypot(ux, uy); ux, uy = ux / L, uy / L; nx, ny = -uy, ux
    yy, xx = np.mgrid[0:H, 0:W].astype(float); qx, qy = xx - OX - a[0], yy - OY - a[1]
    along = qx * ux + qy * uy; perp = (qx * nx + qy * ny) / c
    sx = a[0] + along * ux + perp * nx + SP; sy = a[1] + along * uy + perp * ny + SP      # back to the sheet picture
    ix, iy = np.clip(sx.round().astype(int), 0, SHEET_IM.width - 1), np.clip(sy.round().astype(int), 0, SHEET_IM.height - 1)
    inside = (sx >= 0) & (sy >= 0) & (sx < SHEET_IM.width) & (sy < SHEET_IM.height)
    px = SRC_A[iy, ix].copy(); px[..., 3] *= pm[iy, ix] * inside
    if c < 0:                                                           # the underside: paler, a little flour-dusted
        px[..., :3] = px[..., :3] * 0.82 + np.array([236, 214, 168]) * 0.18
    shade = 1.0 - 0.22 * math.sin(th) * (1 if name == "right" else 0.7)  # turning away from the upper-left light
    px[..., :3] = np.clip(px[..., :3] * shade, 0, 255)
    height = abs(perp) * math.sin(th)
    return Image.fromarray(px.astype(np.uint8), "RGBA"), float(np.mean(height[px[..., 3] > 10])) if (px[..., 3] > 10).any() else 0.0

def frame(t1, t2, closed=0.0):
    base = Image.new("RGBA", (W, H), (238, 236, 233, 255))
    if closed >= 1:
        s = 1 + 0.04 * math.sin(math.pi * min(1, closed - 1)) if closed < 2 else 1
        ci = CLOSED_IM.resize((int(CLOSED_IM.width * s), int(CLOSED_IM.height * s)), Image.LANCZOS)
        sh = Image.new("RGBA", ci.size, (0, 0, 0, 0)); sh.putalpha(ci.split()[3].point(lambda v: int(v * 0.28)))
        cx, cy = OX + SW / 2 - ci.width / 2, OY + SH / 2 - ci.height / 2 + 6
        base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)), (int(cx) + 6, int(cy) + 8)); base.alpha_composite(ci, (int(cx), int(cy)))
        return base
    sheet = SHEET_IM.copy(); sa = np.asarray(sheet).astype(float)
    keep = CENTRE.copy()
    if t1 == 0: keep = np.maximum(keep, poly_mask(FLAPS["right"][0], SHEET_IM.size, (SP, SP)))
    if t2 == 0: keep = np.maximum(keep, poly_mask(FLAPS["left"][0], SHEET_IM.size, (SP, SP)))
    sa[..., 3] *= keep; sheet = Image.fromarray(sa.astype(np.uint8), "RGBA")
    sh = Image.new("RGBA", sheet.size, (0, 0, 0, 0)); sh.putalpha(sheet.split()[3].point(lambda v: int(v * 0.22)))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(4)), (OX - SP + 4, OY - SP + 5)); base.alpha_composite(sheet, (OX - SP, OY - SP))
    for name, t in (("right", t1), ("left", t2)):
        if t <= 0: continue
        lay, h = flap_layer(name, t)
        off = 4 + h * 0.18                                              # the shadow falls lower right, further as the flap rises
        sh = Image.new("RGBA", lay.size, (0, 0, 0, 0)); sh.putalpha(lay.split()[3].point(lambda v: int(v * 0.30)))
        base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(3 + h * 0.06)), (int(off), int(off * 1.2)))
        base.alpha_composite(lay)
    return base

def ease(x): return 0.5 - 0.5 * math.cos(math.pi * x)

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "sources/art/s19-mocks2/guides"
    keys = [(0, 0, 0), (0.3, 0, 0), (0.6, 0, 0), (1, 0, 0), (1, 0.45, 0), (1, 0.8, 0), (1, 1, 0), (1, 1, 1.5)]
    tiles = [frame(*k).convert("RGB") for k in keys]
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
    names = ["flat", "right flap lifts", "past upright: underside", "right flap down", "left flap lifts", "left flap over", "both down", "closed samosa"]
    S = Image.new("RGB", (len(tiles) * (W + 8) + 8, H + 40), (250, 248, 245)); d = ImageDraw.Draw(S)
    for i, (tl, n) in enumerate(zip(tiles, names)):
        S.paste(tl, (8 + i * (W + 8), 34)); d.text((12 + i * (W + 8), 8), n, fill=(40, 30, 20), font=f)
    S.save(f"{out}/samosa-fold-rig-strip.jpg", quality=88)
    seq = [(0, 0, 0)] * 8 + [(ease(i / 18), 0, 0) for i in range(1, 19)] + [(1, 0, 0)] * 5 + [(1, ease(i / 18), 0) for i in range(1, 19)] \
        + [(1, 1, 0)] * 3 + [(1, 1, 1 + i / 8) for i in range(1, 9)] + [(1, 1, 2)] * 14
    gif = [frame(*k).convert("RGB").resize((W // 2 * 2 // 2, H // 2 * 2 // 2)) for k in seq]
    gif[0].save(f"{out}/samosa-fold-rig.gif", save_all=True, append_images=gif[1:], duration=50, loop=0, optimize=True)
    print("wrote", f"{out}/samosa-fold-rig-strip.jpg", f"{out}/samosa-fold-rig.gif", len(seq), "frames")
