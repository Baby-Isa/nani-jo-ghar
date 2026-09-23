#!/usr/bin/env python3
"""Scene art for the playtest-2 layout (see docs/playtest-2026-09-23.md).
Everything here is derived from the existing painted art, so it stays in
the same style - nothing is invented from scratch except the brass bowl.

Writes:
  assets/backgrounds/bg-bazaar-stall-v3.jpg  bazaar with the painted
      tomatoes and chillies cloned out of the counter, so the only produce
      on the counter is produce you can actually tap.
  assets/scene/kitchen-island.png  a wooden island for Nani to stand
      behind, tiled from the bazaar counter's own planks (same painter,
      same lighting). Drawn ABOVE Nani so it hides her lower body.
  assets/scene/basket-back.png / basket-front.png  the player's
      foreground basket, cut out of the woven basket painted on the bazaar
      counter. Back = whole basket; front = only the front wall and rim,
      drawn above the items so they sit IN the basket.
  assets/scene/bowl-back.png / bowl-front.png  Nani's brass fruit bowl,
      same back/front split.
  assets/characters/<c>/<c>-mouth.png  the neutral pose with only the
      mouth swapped in from the talking pose (aligned, feathered), so
      flapping neutral <-> mouth moves ONLY the mouth, never the body.
  assets/characters/<c>/<c>-happy-aligned.png  happy pose padded onto the
      neutral canvas with the head aligned, so the swap doesn't jump.

The bazaar counter occluder needs no file: the game re-draws the bottom of
the background itself (from the counter's back edge down) above the
shopkeeper - see data/scenes/bazaar.json "occluder".

Usage: python3 build/make_scene_art.py   (needs Pillow + numpy)
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, "assets", *p)
os.makedirs(A("scene"), exist_ok=True)


def feather(mask, r):
    return mask.filter(ImageFilter.GaussianBlur(r))


# =====================================================================
# 1. Bazaar: clone the painted tomatoes and chillies off the counter.
#    Counter and wall lines are horizontal, so a horizontal clone lines up.
# =====================================================================
bz = Image.open(A("backgrounds", "bg-bazaar-stall-v2.jpg")).convert("RGB")
arr = np.asarray(bz).astype(int)
R, G, B = arr[..., 0], arr[..., 1], arr[..., 2]


def clone_patch(img, box, colour_mask, src_dx, shadow_box=None):
    """Replace pixels in colour_mask (within box, plus an optional shadow
    rectangle) with pixels src_dx to the side. Feathered edges."""
    x0, y0, x1, y1 = box
    m = np.zeros((img.height, img.width), dtype=np.uint8)
    sub = colour_mask[y0:y1, x0:x1]
    m[y0:y1, x0:x1] = np.where(sub, 255, 0)
    mask = Image.fromarray(m).filter(ImageFilter.MaxFilter(9))
    if shadow_box:
        ImageDraw.Draw(mask).rectangle(shadow_box, fill=255)
    mask = feather(mask, 2.5)
    shifted = img.transform(img.size, Image.AFFINE, (1, 0, src_dx, 0, 1, 0))
    return Image.composite(shifted, img, mask)


red = (R > 160) & (G < 80) & (B < 75)
red[:, :628] = False  # the basket weave is orange-brown too; tomatoes start at x~630
# tomatoes: their red pixels, plus everything right of the basket's rim
# (x>=652) where only wall/counter sits behind them - catches outlines too
bz = clone_patch(bz, (620, 515, 735, 600), red, 150, shadow_box=(652, 518, 730, 596))
green = (G > R - 10) & (G > 70) & (G - B > 25)
bz = clone_patch(bz, (1075, 535, 1185, 600), green, -160, shadow_box=(1080, 580, 1182, 598))
bz.save(A("backgrounds", "bg-bazaar-stall-v3.jpg"), quality=90)
print("wrote bg-bazaar-stall-v3.jpg")

# =====================================================================
# 2. Kitchen island, tiled from the (cleaned) bazaar counter.
#    Bazaar counter rows: back edge y=552, front edge y=609, lip to 640,
#    plank front panel 640-785. Clean top x 700-1150, clean panels 420-1330.
# =====================================================================
ISLAND_W = 1080
top_src = bz.crop((700, 552, 1150, 640))      # top face + lip, 450x88
panel_src = bz.crop((420, 640, 1330, 785))    # front planks, 910x145


def tile_h(src, width):
    """Tile horizontally, alternating mirrored copies so seams match."""
    out = Image.new("RGB", (width, src.height))
    x, flip = 0, False
    while x < width:
        piece = src.transpose(Image.FLIP_LEFT_RIGHT) if flip else src
        out.paste(piece, (x, 0))
        x += src.width
        flip = not flip
    return out


top = tile_h(top_src, ISLAND_W)
panel = tile_h(panel_src, ISLAND_W)
IH = top.height + panel.height  # 233
island = Image.new("RGBA", (ISLAND_W, IH + 30), (0, 0, 0, 0))
body = Image.new("RGB", (ISLAND_W, IH))
body.paste(top, (0, 0))
body.paste(panel, (0, top.height))
# left end: a darker side strip and an outline, so it reads as a solid end
d = ImageDraw.Draw(body)
side = body.crop((0, top.height, 22, IH))
side = ImageEnhance.Brightness(side).enhance(0.62)
body.paste(side, (0, top.height))
d.line([(0, 0), (0, IH)], fill=(58, 32, 16), width=3)
d.line([(22, top.height), (22, IH)], fill=(70, 40, 20), width=2)
d.line([(0, IH - 2), (ISLAND_W, IH - 2)], fill=(58, 32, 16), width=3)
# soft contact shadow on the floor under the island
shadow = Image.new("L", island.size, 0)
ImageDraw.Draw(shadow).rectangle([10, IH - 6, ISLAND_W, IH + 18], fill=150)
shadow = feather(shadow, 8)
island.paste((40, 22, 10, 255), (0, 0), shadow)
island.alpha_composite(body.convert("RGBA"), (0, 0))
island.save(A("scene", "kitchen-island.png"))
print("wrote scene/kitchen-island.png", island.size, "top face rows 0-57, lip 57-88")

# =====================================================================
# 3. Foreground basket, cut from the woven basket on the bazaar counter
#    (outer rim x 427-650, y 497-557; body to y 600).
# =====================================================================
src = Image.open(A("backgrounds", "bg-bazaar-stall-v2.jpg")).convert("RGB")
BX0, BY0, BX1, BY1 = 420, 490, 656, 604
crop = src.crop((BX0, BY0, BX1, BY1))
cw, ch = crop.size
S = 4  # draw the mask supersampled, then downsample (smooth edges)
m = Image.new("L", (cw * S, ch * S), 0)
md = ImageDraw.Draw(m)
ox, oy = BX0, BY0
E = lambda x0, y0, x1, y1: [(x0 - ox) * S, (y0 - oy) * S, (x1 - ox) * S, (y1 - oy) * S]
md.ellipse(E(427, 497, 650, 558), fill=255)                  # rim
md.polygon([((431 - ox) * S, (528 - oy) * S), ((646 - ox) * S, (528 - oy) * S),
            ((628 - ox) * S, (588 - oy) * S), ((449 - ox) * S, (588 - oy) * S)], fill=255)  # body
md.ellipse(E(447, 568, 630, 600), fill=255)                  # rounded bottom
bmask = m.resize((cw, ch), Image.LANCZOS)
# drop the tomato that overlaps the basket's right edge
carr = np.asarray(crop).astype(int)
tom = (carr[..., 0] > 160) & (carr[..., 1] < 80) & (carr[..., 2] < 75)
tom[:, : 634 - BX0] = False
bmask = Image.fromarray(np.where(tom, 0, np.asarray(bmask)).astype(np.uint8))
# pull the edge in ~2px so no wall/tomato halo survives the upscale
bmask = bmask.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(0.7))

# front wall = everything below the inner opening's front (lower) arc
fm = Image.new("L", (cw * S, ch * S), 0)
fd = ImageDraw.Draw(fm)
# inner opening ellipse approx x 444-633, y 507-547; the front arc is its
# lower half. Fill everything below that arc.
ix0, iy0, ix1, iy1 = 444, 507, 633, 547
pts = []
for i in range(41):
    t = np.pi * i / 40
    x = (ix0 + ix1) / 2 - np.cos(t) * (ix1 - ix0) / 2
    y = (iy0 + iy1) / 2 + np.sin(t) * (iy1 - iy0) / 2
    pts.append(((x - ox) * S, (y - oy) * S))
fd.polygon([(0, pts[0][1])] + pts + [(cw * S, pts[-1][1]), (cw * S, ch * S), (0, ch * S)], fill=255)
fmask = fm.resize((cw, ch), Image.LANCZOS)
fmask = Image.fromarray(np.minimum(np.asarray(fmask), np.asarray(bmask)))

SCALE = 2.3
size = (round(cw * SCALE), round(ch * SCALE))
up = crop.resize(size, Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
back = up.convert("RGBA")
back.putalpha(bmask.resize(size, Image.LANCZOS))
# darken the interior a touch so contents pop
interior = Image.new("L", size, 0)
ImageDraw.Draw(interior).ellipse([(ix0 - ox) * SCALE + 6, (iy0 - oy) * SCALE + 4,
                                  (ix1 - ox) * SCALE - 6, (iy1 - oy) * SCALE + 6], fill=90)
interior = feather(interior, 6)
dark = Image.new("RGBA", size, (40, 22, 8, 255))
back = Image.composite(Image.alpha_composite(back, Image.merge("RGBA", (*dark.split()[:3], interior))), back, bmask.resize(size))
front = up.convert("RGBA")
front.putalpha(fmask.resize(size, Image.LANCZOS))
back.save(A("scene", "basket-back.png"))
front.save(A("scene", "basket-front.png"))
print("wrote scene/basket-back.png + basket-front.png", size,
      "rim front arc at y≈%d" % round(((iy0 + iy1) / 2 + (iy1 - iy0) / 2 - oy) * SCALE))

# =====================================================================
# 4. Brass fruit bowl (procedural - no bowl exists in the art yet).
#    Side-on bowl, rim ellipse on top, back/front split like the basket.
# =====================================================================
BW, BH = 520, 240
S = 3
W, H = BW * S, BH * S
cx = W / 2
rim_top, rim_h = 30 * S, 70 * S          # rim ellipse spans rim_top..rim_top+rim_h
rim_mid = rim_top + rim_h / 2
bottom = 225 * S


def brass(h):
    """Vertical brass gradient: dark at the bottom, bright band high up."""
    g = np.zeros((h, W, 3))
    for y in range(h):
        t = y / h
        base = np.array([196, 142, 52]) * (1.05 - 0.55 * t)
        g[y] = base
    # horizontal shading: darker at the sides, highlight left of centre
    xs = np.linspace(-1, 1, W)
    side = (1 - 0.45 * xs ** 2)[None, :, None]
    hl = np.exp(-((xs + 0.35) / 0.18) ** 2)[None, :, None] * 38
    rng = np.random.default_rng(3)
    dots = rng.normal(0, 6, (h // 6 + 1, W // 6 + 1, 1)).repeat(6, 0).repeat(6, 1)[:h, :W]
    return np.clip(g * side + hl + dots, 0, 255).astype(np.uint8)


body_mask = Image.new("L", (W, H), 0)
bd = ImageDraw.Draw(body_mask)
bd.chord([0 + 10 * S, rim_mid - (bottom - rim_mid), W - 10 * S, bottom], 0, 180, fill=255)
foot = Image.new("L", (W, H), 0)
ImageDraw.Draw(foot).rectangle([cx - 70 * S, bottom - 18 * S, cx + 70 * S, bottom + 6 * S], fill=255)
body_rgb = Image.fromarray(brass(H))
rim_mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(rim_mask).ellipse([4 * S, rim_top, W - 4 * S, rim_top + rim_h], fill=255)
inner_mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(inner_mask).ellipse([16 * S, rim_top + 8 * S, W - 16 * S, rim_top + rim_h - 6 * S], fill=255)
inner_rgb = Image.new("RGB", (W, H), (92, 58, 20))
# inner shading: darker at the back
ig = np.asarray(inner_rgb).astype(float)
ig *= np.linspace(0.65, 1.1, H)[:, None, None]
inner_rgb = Image.fromarray(np.clip(ig, 0, 255).astype(np.uint8))
rim_rgb = Image.new("RGB", (W, H), (226, 178, 84))

back = Image.new("RGBA", (W, H), (0, 0, 0, 0))
# soft shadow under the bowl
sh = Image.new("L", (W, H), 0)
ImageDraw.Draw(sh).ellipse([cx - 190 * S, bottom - 14 * S, cx + 190 * S, bottom + 14 * S], fill=130)
sh = feather(sh, 8 * S)
back.paste((30, 16, 6, 255), (0, 0), sh)
back.paste(body_rgb, (0, 0), Image.fromarray(np.maximum(np.asarray(body_mask), np.asarray(foot))))
back.paste(rim_rgb, (0, 0), rim_mask)
back.paste(inner_rgb, (0, 0), inner_mask)
# front = body below the rim's middle line + the front half of the rim band
front_cut = Image.new("L", (W, H), 0)
ImageDraw.Draw(front_cut).rectangle([0, rim_mid, W, H], fill=255)
front_rim = Image.fromarray(np.minimum(np.asarray(rim_mask), np.asarray(front_cut)))
front_rim = Image.fromarray(np.maximum(np.asarray(front_rim) - np.asarray(inner_mask), 0).astype(np.uint8))
front = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bm = np.minimum(np.maximum(np.asarray(body_mask), np.asarray(foot)), np.asarray(front_cut))
bm = np.maximum(bm.astype(int) - np.asarray(inner_mask).astype(int), 0).astype(np.uint8)
front.paste(body_rgb, (0, 0), Image.fromarray(bm))
front.paste(rim_rgb, (0, 0), front_rim)
# rim lip line
for im in (back, front):
    ImageDraw.Draw(im).arc([4 * S, rim_top, W - 4 * S, rim_top + rim_h], 0, 180, fill=(120, 80, 24, 255), width=3 * S)
ImageDraw.Draw(back).arc([4 * S, rim_top, W - 4 * S, rim_top + rim_h], 180, 360, fill=(150, 104, 34, 255), width=2 * S)
def outline(im, col=(70, 40, 14, 255), w=2 * S):
    a = im.split()[3].point(lambda v: 255 if v > 128 else 0)
    ring = Image.fromarray(np.clip(np.asarray(a.filter(ImageFilter.MaxFilter(w * 2 + 1))).astype(int) - np.asarray(a).astype(int), 0, 255).astype(np.uint8))
    o = Image.new("RGBA", im.size, (0, 0, 0, 0)); o.paste(col, (0, 0), ring); o.alpha_composite(im); return o
# outline only the bowl, not its floor shadow
back_noshadow = back.copy()
back = outline(back)
front = outline(front)
back = back.resize((BW, BH), Image.LANCZOS)
front = front.resize((BW, BH), Image.LANCZOS)
back.save(A("scene", "bowl-back.png"))
front.save(A("scene", "bowl-front.png"))
print("wrote scene/bowl-back.png + bowl-front.png", (BW, BH), "rim middle y=%d" % (rim_mid / S))

# =====================================================================
# 5. Character frames: neutral body + talking mouth; happy aligned.
# =====================================================================
MOUTH = {  # (mouth centre x, y, radius x, radius y) on the neutral canvas
    "nani": (163, 146, 30, 14),
    "shopkeeper": (170, 150, 34, 18),
}
FACE = {"nani": (100, 40, 220, 190), "shopkeeper": (95, 60, 240, 200)}


def best_offset(base, other, box, search=18):
    a_full = np.asarray(base).astype(float)
    b_full = np.asarray(other).astype(float)
    x0, y0, x1, y1 = box
    a = a_full[y0:y1, x0:x1, :3]
    best = None
    for dy in range(-search, search + 1):
        for dx in range(-search, search + 1):
            if y0 + dy < 0 or x0 + dx < 0 or y1 + dy > b_full.shape[0] or x1 + dx > b_full.shape[1]:
                continue
            e = np.abs(a - b_full[y0 + dy:y1 + dy, x0 + dx:x1 + dx, :3]).mean()
            if best is None or e < best[0]:
                best = (e, dx, dy)
    return best[1], best[2]


def on_canvas(img, size, dx=0, dy=0):
    c = Image.new("RGBA", size, (0, 0, 0, 0))
    c.alpha_composite(img, ((size[0] - img.width) // 2 - dx, -dy) if dy <= 0 else ((size[0] - img.width) // 2 - dx, 0))
    if dy > 0:
        c = c.transform(size, Image.AFFINE, (1, 0, 0, 0, 1, dy))
    return c


for c, (mx, my, rw, rh) in MOUTH.items():
    neutral = Image.open(A("characters", c, f"{c}-neutral.png")).convert("RGBA")
    talking = Image.open(A("characters", c, f"{c}-talking.png")).convert("RGBA")
    happy = Image.open(A("characters", c, f"{c}-happy.png")).convert("RGBA")
    size = neutral.size
    t_pad = on_canvas(talking, size)
    dx, dy = best_offset(neutral, t_pad, FACE[c])
    t_al = t_pad.transform(size, Image.AFFINE, (1, 0, dx, 0, 1, dy))
    mm = Image.new("L", size, 0)
    ImageDraw.Draw(mm).ellipse([mx - rw, my - rh, mx + rw, my + rh], fill=255)
    mm = feather(mm, 5)
    mouth = Image.composite(t_al, neutral, mm)
    mouth.save(A("characters", c, f"{c}-mouth.png"))
    h_pad = on_canvas(happy, size)
    hdx, hdy = best_offset(neutral, h_pad, FACE[c])
    h_al = h_pad.transform(size, Image.AFFINE, (1, 0, hdx, 0, 1, hdy))
    h_al.save(A("characters", c, f"{c}-happy-aligned.png"))
    print(f"wrote {c}-mouth.png (talking offset {dx},{dy}) and {c}-happy-aligned.png (offset {hdx},{hdy})")
