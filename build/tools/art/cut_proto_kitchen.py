"""proto-kitchen (1 Nov): cut the placeholder props in assets/cook/proto/ from Zafar's 1 Nov mock-ups (boxes in 900-wide thumb coords).
   python3 build/tools/art/cut_proto_kitchen.py sources/art/mockups-2026-11-01 assets/cook/proto"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

CROPS = [
    # name, file, box (thumb), mask, max px
    ("egg-pot", "mockup-cook-baking-eggs-eggs-station.png", (82, 104, 262, 292), "ellipse", 360),
    ("egg-pan", "mockup-cook-baking-eggs-eggs-station.png", (305, 105, 498, 298), "ellipse", 360),
    ("egg-bowl", "mockup-cook-baking-eggs-eggs-station.png", (8, 322, 166, 482), "ellipse", 300),
    ("cat-sit", "mockup-cook-baking-eggs-served.png", (30, 66, 146, 232), "dark", 260),
    ("cat-peek", "mockup-cook-baking-eggs-pour.png", (742, 192, 872, 300), "dark", 260),
    ("bake-bowl", "mockup-cook-baking-eggs-pour.png", (508, 236, 724, 346), "ellipse-wide", 380),
    ("bake-naan", "mockup-cook-baking-eggs-oven.png", (278, 234, 512, 342), "ellipse", 360),
    ("corn-plate", "mockup-farm-corn-stall.png", (484, 139, 722, 377), "ellipse", 360),
    ("corn-box", "mockup-farm-corn-stall.png", (26, 0, 336, 124), "rect", 420),
    ("corn-chutney-white", "mockup-farm-corn-stall.png", (748, 68, 868, 176), "ellipse", 200),
    ("corn-chutney-green", "mockup-farm-corn-stall.png", (742, 178, 860, 292), "ellipse", 200),
    ("corn-chutney-red", "mockup-farm-corn-stall.png", (738, 288, 860, 412), "ellipse", 200),
    ("corn-chilli", "mockup-farm-corn-stall.png", (141, 392, 240, 491), "ellipse", 180),
    ("corn-salt", "mockup-farm-corn-stall.png", (344, 392, 442, 491), "ellipse", 180),
    ("corn-pepper", "mockup-farm-corn-stall.png", (446, 392, 545, 491), "ellipse", 180),
    ("corn-lemon", "mockup-farm-corn-stall.png", (568, 394, 716, 492), "lemons", 240),
    ("corn-cob-raw", "mockup-farm-corn-stall.png", (126, 140, 202, 352), "corn", 260),
    ("corn-cob-half", "mockup-farm-corn-stall.png", (226, 140, 302, 352), "corn", 260),
    ("corn-cob-done", "mockup-farm-corn-stall.png", (320, 140, 398, 352), "corn", 260),
]

K = None
for name, f, box, mask, mx in CROPS:
    im = Image.open(os.path.join(SRC, f)).convert("RGBA")
    k = im.width / 900.0
    b = tuple(int(round(v * k)) for v in box)
    c = im.crop(b)
    w, h = c.size
    a = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(a)
    if mask in ("ellipse", "ellipse-wide"):
        d.ellipse((5, 5, w - 6, h - 6), fill=255)
        a = a.filter(ImageFilter.GaussianBlur(0.6))
    elif mask == "rect":
        a = Image.new("L", (w, h), 255)
    elif mask == "lemons":
        d.ellipse((2, 2, w * 0.5, h - 3), fill=255)
        d.ellipse((w * 0.5, 2, w - 3, h - 3), fill=255)
    elif mask == "corn":
        arr = np.asarray(c).astype(int)
        r, g, bb = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        m = ((r > 140) & (g > 90) & (bb < 150) & (r - bb > 70)) | ((r > 60) & (r - bb > 25) & (r >= g))
        m = ndimage.binary_opening(m, iterations=1)
        m = ndimage.binary_closing(m, iterations=4)
        m = ndimage.binary_fill_holes(m)
        yy, xx = np.mgrid[0:m.shape[0], 0:m.shape[1]]
        m &= ((xx - m.shape[1] / 2) / (m.shape[1] * 0.4)) ** 2 + ((yy - m.shape[0] / 2) / (m.shape[0] * 0.5)) ** 2 <= 1
        lab, n = ndimage.label(m)
        if n:
            sizes = ndimage.sum(m, lab, range(1, n + 1))
            m = lab == (1 + int(np.argmax(sizes)))
        a = Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(0.6))
    elif mask in ("dark", "light"):
        arr = np.asarray(c).astype(int)
        if mask == "dark":
            m = arr[:, :, :3].max(axis=2) < 95
        else:
            # the glass jar: everything that isn't the plain wall behind (green tiles / sunlight): keep by saturation
            r, g, bb = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
            mxv = arr[:, :, :3].max(axis=2)
            mnv = arr[:, :, :3].min(axis=2)
            sat = (mxv - mnv) / np.maximum(mxv, 1)
            m = (sat < 0.12) & (mxv > 150)
        m = ndimage.binary_closing(m, iterations=3)
        m = ndimage.binary_fill_holes(m)
        lab, n = ndimage.label(m)
        if n:
            sizes = ndimage.sum(m, lab, range(1, n + 1))
            m = lab == (1 + int(np.argmax(sizes)))
        m = ndimage.binary_fill_holes(m)
        a = Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.2))
    c.putalpha(a)
    c.thumbnail((mx, mx))
    p = os.path.join(OUT, name + ".webp")
    c.save(p, "WEBP", quality=82, method=6)
    print(name, c.size, os.path.getsize(p))

# fixes: an empty frying pan (the egg painted over), a naan with no face badge (its left half mirrored)
pan = Image.open(os.path.join(OUT, "egg-pan.webp")).convert("RGBA")
w, h = pan.size
cx, cy, r = w * 0.5, h * 0.5, w * 0.445
dark = Image.new("RGBA", (w, h), (0, 0, 0, 0))
dd = ImageDraw.Draw(dark)
for i in range(40, 0, -1):
    rr = r * i / 40
    v = int(34 + (40 - i) * 0.6)
    dd.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=(v, v, v + 2, 255))
pan.alpha_composite(dark)
pan.save(os.path.join(OUT, "egg-pan.webp"), "WEBP", quality=82, method=6)
im = Image.open(os.path.join(SRC, "mockup-cook-baking-eggs-oven.png")).convert("RGBA")
k = im.width / 900.0
L = im.crop(tuple(int(v * k) for v in (278, 234, 366, 342)))
R = L.transpose(Image.FLIP_LEFT_RIGHT)
n = Image.new("RGBA", (L.width * 2, L.height))
n.paste(L, (0, 0)); n.paste(R, (L.width, 0))
a = Image.new("L", n.size, 0)
ImageDraw.Draw(a).ellipse((6, 6, n.width - 7, n.height - 7), fill=255)
n.putalpha(a.filter(ImageFilter.GaussianBlur(0.6)))
n.thumbnail((360, 360))
n.save(os.path.join(OUT, "bake-naan.webp"), "WEBP", quality=82, method=6)
print("fixed pan, naan")
