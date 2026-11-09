#!/usr/bin/env python3
"""Sekelo grill layouts, everything upright (SEK-20, Zafar 9 Nov): full-size skewers on the grill (four fill it), smaller ones in the
trays (they grow and shrink on the way); every skewer's tip rests on the far (top) rim, its handle's collar on the near (bottom) rim.
v1: two trays stacked on the left; v2: one tray left, one right. Drawn at the narrowest play area (1560x1080, the 1920x1080 screen),
with the 740x320 phone's play area (1.63) and 930x430's (1.82) marked: the stage fits by height and crops the sides.
Usage: python3 build/tools/art/sekelo_layouts.py <outdir>"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = "assets/cook/items/v3/sekelo/"
W, H, M = 1560, 1080, 36
MOCK = Image.open("sources/art/s19-mocks2/results/A1-sekelo-1.png").convert("RGBA"); K = MOCK.width / 1400
FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
def marble():
    t = MOCK.crop((int(1290 * K), int(20 * K), int(1390 * K), int(120 * K))).resize((W, H), Image.LANCZOS)
    return t.filter(ImageFilter.GaussianBlur(2))
def grill_img():
    g = MOCK.copy()
    # paint the mock's own skewer out with the coals to its left
    x0, x1 = int(835 * K), int(980 * K)
    patch = g.crop((x0 - (x1 - x0) - int(20 * K), int(95 * K), x0 - int(20 * K), int(660 * K)))
    g.paste(patch, (x0, int(95 * K)))
    g = g.crop((int(470 * K), int(75 * K), int(1360 * K), int(668 * K))).convert("RGB")  # rim at about 7%..93% of its height
    m = g.copy()
    for c in ((0, 0), (m.width - 1, 0), (0, m.height - 1), (m.width - 1, m.height - 1), (m.width // 2, 2), (2, m.height // 2), (m.width - 3, m.height // 2)):
        ImageDraw.floodfill(m, c, (255, 0, 255), thresh=38)   # the mock's own marble round the grill, made see-through
    a = Image.new("L", g.size, 255); px, pa = m.load(), a.load()
    for y in range(g.height):
        for x in range(g.width):
            if px[x, y] == (255, 0, 255): pa[x, y] = 0
    g = g.convert("RGBA"); g.putalpha(a.filter(ImageFilter.GaussianBlur(1))); return g
GRILL = grill_img()
G_RIM = (0.075, 0.935)       # the grill picture's far and near rim, as shares of its height
G_IN = (0.115, 0.885)        # its coal bed's left and right, as shares of its width
def tray(w, h):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im); r = int(min(w, h) * 0.12)
    d.rounded_rectangle((6, 6, w - 1, h - 1), r, fill=(0, 0, 0, 60))
    d.rounded_rectangle((0, 0, w - 7, h - 7), r, fill=(196, 198, 200, 255), outline=(150, 152, 155, 255), width=3)
    i = int(min(w, h) * 0.06)
    for k in range(i):  # the inner well, darker toward the walls
        c = 172 + int(30 * k / i); d.rounded_rectangle((i - k + 2, i - k + 2, w - 9 - i + k, h - 9 - i + k), max(4, r - i), outline=(c, c + 2, c + 4, 255), width=1)
    d.rounded_rectangle((i, i, w - 7 - i, h - 7 - i), max(4, r - i), fill=(204, 206, 209, 255))
    for y in range(i, h - 7 - i, 3): d.line((i + 4, y, w - 11 - i, y), fill=(210, 212, 214, 60))
    return im
def skewer(ls, state, pw=None):
    """A skewer ls long from its tip to its collar (the handle below it, 0.32 of ls)."""
    pw = pw or int(ls * 0.2); hl = int(ls * 0.32); w = pw + 8; h = ls + hl
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im); cx = w // 2; rw = max(3, int(ls * 0.012))
    d.polygon([(cx, 0), (cx - rw * 1.6, int(ls * 0.06)), (cx + rw * 1.6, int(ls * 0.06))], fill=(222, 224, 228, 255), outline=(150, 152, 158, 255))
    d.rectangle((cx - rw, int(ls * 0.05), cx + rw, ls), fill=(205, 208, 212, 255), outline=(140, 142, 148, 255))
    top, bot = int(ls * 0.1), int(ls * 0.95); step = (bot - top) / 4
    for i, n in enumerate(["meat", "tomato", "onion", "meat"]):
        p = Image.open(f"{D}{n}-{state}.webp").convert("RGBA").resize((pw, int(pw * 396 / 404)), Image.LANCZOS)
        im.alpha_composite(p, ((w - pw) // 2, int(top + i * step + step / 2 - p.height / 2)))
    d.rectangle((cx - rw * 2.2, ls - rw, cx + rw * 2.2, ls + rw * 2), fill=(180, 182, 188, 255), outline=(120, 122, 128, 255))
    hw = max(8, int(ls * 0.055))
    d.rounded_rectangle((cx - hw, ls + rw * 2, cx + hw, h - 2), hw, fill=(122, 74, 42, 255), outline=(84, 50, 28, 255), width=2)
    d.line((cx - hw * 0.4, ls + rw * 4, cx - hw * 0.4, h - hw), fill=(160, 104, 64, 255), width=max(2, hw // 4))
    return im
def put(base, img, x, y):
    a = img.split()[3].point(lambda v: int(v * 0.33)); sh = Image.new("RGBA", img.size, (0, 0, 0, 0)); sh.putalpha(a)
    sh = sh.filter(ImageFilter.GaussianBlur(4)); base.alpha_composite(sh, (int(x) + 7, int(y) + 9)); base.alpha_composite(img, (int(x), int(y)))
def row(base, n, ls, state, x0, x1, y_tip):
    sk = skewer(ls, state, min(int(ls * 0.2), int((x1 - x0) / n * 0.78)))
    for i in range(n): put(base, sk, x0 + (x1 - x0) * (i + 0.5) / n - sk.width / 2, y_tip)
def place_grill(base, gh, cx):
    g = GRILL.resize((int(GRILL.width * gh / GRILL.height), gh), Image.LANCZOS); gx = int(cx - g.width / 2); gy = M
    put(base, g, gx, gy)
    ls = int(gh * (G_RIM[1] - G_RIM[0])); y_tip = gy + int(gh * G_RIM[0])
    row(base, 4, ls, "raw", gx + g.width * G_IN[0], gx + g.width * G_IN[1], y_tip)
    return g.width, ls
def place_tray(base, x, y, w, h, state, n=4):
    t = tray(w, h); base.alpha_composite(t, (int(x), int(y)))
    rim = int(min(w, h) * 0.035); ls = h - 7 - 2 * rim
    row(base, n, ls, state, x + w * 0.06, x + w * 0.94, y + rim)
    return ls
def frames(base, label):
    d = ImageDraw.Draw(base)
    d.rectangle((0, 0, W - 1, H - 1), outline=(40, 160, 70, 255), width=4)
    d.rectangle((0, H - 44, W, H), fill=(0, 0, 0, 170)); d.text((14, H - 38), label, fill="white", font=FONT)
def v1(out):
    im = marble().convert("RGBA")
    gh = int((H - 2 * M) / (1 + 0.32 * (G_RIM[1] - G_RIM[0])))
    gh = int(gh * 0.9)
    gw, ls_g = place_grill(im, gh, W - M - int(GRILL.width * gh / GRILL.height) / 2)
    tw = W - gw - 2 * M; avail = H - 2 * M - 30
    th = int(avail / 2 / (1 + 0.32 * 0.93)); ls_t = 0
    for i, st in enumerate(("raw", "grilled")):
        ls_t = place_tray(im, M, M + i * (avail / 2 + 30), tw, th, st); pw_t = min(int(ls_t * .2), int(tw * .88 / 4 * .78))
    frames(im, f"v1: two trays left. Tray skewers {ls_t / ls_g:.0%} of the grill's; pieces {pw_t} px vs {int(ls_g * .2)} px. Green: the 1920 play area; phones show more marble each side")
    im.convert("RGB").save(out, quality=88)
def v2(out):
    """A tray each side: the width is shared by three things, so the grill shrinks until the trays' skewers are about half its own."""
    im = marble().convert("RGBA"); ar = GRILL.width / GRILL.height
    gh = int((W - 4 * M) / (ar + 2 * 0.62))                       # tw = 0.62 gh: tray pieces about half the grill's
    gw, ls_g = place_grill(im, gh, W / 2); tw = int((W - gw) / 2 - 2 * M)
    pw = int(tw * .88 / 4 * .78); ls = int(pw / 0.2); rim = int(tw * 0.035); th = ls + 2 * rim + 7
    for x, st in ((M, "raw"), (W - M - tw, "grilled")):
        im.alpha_composite(tray(tw, th), (int(x), M)); row(im, 4, ls, st, x + tw * 0.06, x + tw * 0.94, M + rim)
    frames(im, f"v2: a tray each side. The grill shrinks to {gh} px tall; pieces {pw} px in the trays vs {int(ls_g * .2)} px on the grill")
    im.convert("RGB").save(out, quality=88)
if __name__ == "__main__":
    o = sys.argv[1] if len(sys.argv) > 1 else "sources/art/s19-mocks2/fit"
    v1(f"{o}/layout-v1-two-trays-left.jpg"); v2(f"{o}/layout-v2-tray-each-side.jpg")
