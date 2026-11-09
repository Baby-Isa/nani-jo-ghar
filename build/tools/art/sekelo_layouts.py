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
SIZES = [("1920x1080 big screen", 1.44), ("1280x665 laptop", 1.56), ("740x320 your phone", 1.63), ("930x430 big phone", 1.82)]
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
def band(base, top):
    """Fable's stone tray (build/reports/s19-stone-tray-fable.md) along the bottom 30%."""
    x0, x1 = int(W * 0.03), int(W * 0.97); y0, y1 = top, H - int(H * 0.02); r = int((y1 - y0) / 8)
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 6), r, fill=(0, 0, 0, 40))
    d.rounded_rectangle((x0, y0, x1, y1), r, fill=(181, 169, 158, 255))
    lip = max(4, int((y1 - y0) * 0.035)); d.rounded_rectangle((x0 + lip, y0 + lip, x1 - lip, y1 - lip), r - lip, fill=(196, 184, 173, 255))
    return x0 + lip, y0 + lip, x1 - lip, y1 - lip
def fit_grill_h(maxh, maxw):
    return int(min(maxh / (1 + 0.32 * (G_RIM[1] - G_RIM[0])), maxw * GRILL.height / GRILL.width))
def opt1():
    im = marble().convert("RGBA")
    gh = fit_grill_h(H - 2 * M, W * 0.62); gw, ls_g = place_grill(im, gh, W - M - int(GRILL.width * gh / GRILL.height) / 2)
    tw = W - gw - 3 * M; avail = H - 2 * M - 30; th = int(avail / 2 / (1 + 0.32 * 0.93))
    for i, st in enumerate(("raw", "grilled")): place_tray(im, M, M + i * (avail / 2 + 30), tw, th, st)
    ls_t = th - 7 - 2 * int(min(tw, th) * 0.035)
    return im, min(int(ls_t * .2), int(tw * .88 / 4 * .78)), int(ls_g * .2)
def opt2():
    im = marble().convert("RGBA"); ar = GRILL.width / GRILL.height
    gh = fit_grill_h(H - 2 * M, (W - 4 * M) * ar / (ar + 2 * 0.62)); gw, ls_g = place_grill(im, gh, W / 2)
    tw = int((W - gw) / 2 - 2 * M); pw = min(int(tw * .88 / 4 * .78), int(ls_g * .2)); ls = int(pw / 0.2); rim = int(tw * 0.035)
    th = min(ls + 2 * rim + 7, int((H - 2 * M) / 1.3)); ls = th - 2 * rim - 7
    for x, st in ((M, "raw"), (W - M - tw, "grilled")):
        im.alpha_composite(tray(tw, th), (int(x), M)); row(im, 4, ls, st, x + tw * 0.06, x + tw * 0.94, M + rim)
    return im, min(int(ls * .2), int(tw * .88 / 4 * .78)), int(ls_g * .2)
def opt3():
    """The raw skewers on the stone band along the bottom (as every game's items); the grill above; the cooked tray right of it."""
    im = marble().convert("RGBA"); top = int(H * 0.70)
    bx0, by0, bx1, by1 = band(im, top + 6)
    lb = int((by1 - by0) * 0.92 / 1.32)                                 # upright in the band, the handle inside it too
    row(im, 4, lb, "raw", W * 0.3, W * 0.7, by0 + int((by1 - by0) * 0.04))
    gh = fit_grill_h(top - M - 6, W * 0.6); gx_c = M + int(GRILL.width * gh / GRILL.height) / 2 + W * 0.04
    gw, ls_g = place_grill(im, gh, gx_c)
    tx = int(gx_c + gw / 2 + M); tw = W - tx - M - int(W * 0.03)
    pw = min(int(tw * .88 / 4 * .78), int(ls_g * .2)); ls = min(int(pw / 0.2), int((top - 2 * M) / 1.32)); rim = int(tw * 0.035); th = ls + 2 * rim + 7
    im.alpha_composite(tray(tw, th), (tx, M)); row(im, 4, ls, "grilled", tx + tw * 0.06, tx + tw * 0.94, M + rim)
    return im, min(int(lb * .2), int((W * .4) / 4 * .78)), int(ls_g * .2), min(int(ls * .2), pw)
def opt3h():
    """Zafar 9 Nov: option 3 with the raw skewers lying flat in the band, four in a row (tips right, handles left, a blank pill under
    each); they turn upright and grow as they go up onto the grill; the cooked tray right of the grill as option 3."""
    im = marble().convert("RGBA"); top = int(H * 0.70)
    bx0, by0, bx1, by1 = band(im, top + 6); bh = by1 - by0
    slot = (bx1 - bx0) * 0.94 / 4; pill_h = int(bh * 0.16)
    ls = int(min(slot * 0.86 / 1.32, (bh - pill_h - bh * 0.16) / 0.2 / 1.15)); pw = int(ls * 0.2)
    sk = skewer(ls, "raw", pw).rotate(-90, expand=True)                 # tip right, handle left
    d = ImageDraw.Draw(im); cy = by0 + (bh - pill_h - bh * 0.06) / 2
    for i in range(4):
        cx = bx0 + (bx1 - bx0) * 0.03 + slot * (i + 0.5)
        put(im, sk, cx - sk.width / 2, cy - sk.height / 2)
        pw2 = slot * 0.42; py = by1 - pill_h - bh * 0.06
        d.rounded_rectangle((cx - pw2 / 2, py, cx + pw2 / 2, py + pill_h), pill_h // 2, fill=(246, 238, 222, 255), outline=(214, 200, 178, 255), width=2)
    gh = fit_grill_h(top - M - 6, W * 0.6); gx_c = M + int(GRILL.width * gh / GRILL.height) / 2 + W * 0.04
    gw, ls_g = place_grill(im, gh, gx_c)
    tx = int(gx_c + gw / 2 + M); tw = W - tx - M - int(W * 0.03)
    pt = min(int(tw * .88 / 4 * .78), int(ls_g * .2)); lt = min(int(pt / 0.2), int((top - 2 * M) / 1.32)); rim = int(tw * 0.035); th = lt + 2 * rim + 7
    im.alpha_composite(tray(tw, th), (tx, M)); row(im, 4, lt, "grilled", tx + tw * 0.06, tx + tw * 0.94, M + rim)
    return im, pw, int(ls_g * .2), min(int(lt * .2), pt)
def opt3s():
    """Option 3 with the raw skewers lying flat in the band two by two (no pills: a skewer is the dish, not a word)."""
    im = marble().convert("RGBA"); top = int(H * 0.70)
    bx0, by0, bx1, by1 = band(im, top + 6); bh = by1 - by0
    slot = (bx1 - bx0) * 0.92 / 2; rowh = bh * 0.86 / 2
    ls = int(min(slot * 0.86 / 1.32, rowh * 0.8 / 0.2)); pw = int(ls * 0.2)
    sk = skewer(ls, "raw", pw).rotate(-90, expand=True)
    for r in range(2):
        for i in range(2):
            cx = bx0 + (bx1 - bx0) * 0.04 + slot * (i + 0.5); cy = by0 + bh * 0.07 + rowh * (r + 0.5)
            put(im, sk, cx - sk.width / 2, cy - sk.height / 2)
    gh = fit_grill_h(top - M - 6, W * 0.6); gx_c = M + int(GRILL.width * gh / GRILL.height) / 2 + W * 0.04
    gw, ls_g = place_grill(im, gh, gx_c)
    tx = int(gx_c + gw / 2 + M); tw = W - tx - M - int(W * 0.03)
    pt = min(int(tw * .88 / 4 * .78), int(ls_g * .2)); lt = min(int(pt / 0.2), int((top - 2 * M) / 1.32)); rim = int(tw * 0.035); th = lt + 2 * rim + 7
    im.alpha_composite(tray(tw, th), (tx, M)); row(im, 4, lt, "grilled", tx + tw * 0.06, tx + tw * 0.94, M + rim)
    return im, pw, int(ls_g * .2), min(int(lt * .2), pt)
def sheet(fn, name, out):
    global W
    tiles = []; f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    for lab, ar in SIZES:
        W = int(H * ar); r = fn(); im = r[0]; px = 320 / H                       # pieces in the phone's own pixels
        sm = im.convert("RGB").resize((int(W * 360 / H), 360), Image.LANCZOS)
        cap = Image.new("RGB", (sm.width, 64), (250, 248, 245)); d = ImageDraw.Draw(cap)
        d.text((8, 6), lab, fill=(30, 30, 30), font=f)
        d.text((8, 28), "pieces: " + " / ".join(f"{v} ({v * 320 / 1080:.0f} on the phone)" for v in r[1:]), fill=(90, 70, 50), font=f)
        t = Image.new("RGB", (sm.width, 424), (250, 248, 245)); t.paste(sm, (0, 0)); t.paste(cap, (0, 360)); tiles.append(t)
    Wt = sum(t.width for t in tiles) + 12 * (len(tiles) + 1)
    S = Image.new("RGB", (Wt, 424 + 60), (234, 230, 225)); d = ImageDraw.Draw(S)
    d.text((12, 12), name, fill=(20, 20, 20), font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22))
    x = 12
    for t in tiles: S.paste(t, (x, 48)); x += t.width + 12
    S.save(out, quality=88)
if __name__ == "__main__":
    o = sys.argv[1] if len(sys.argv) > 1 else "sources/art/s19-mocks2/fit"
    sheet(opt1, "Option 1: two trays left (pieces: trays / grill)", f"{o}/layout-opt1-sizes.jpg")
    sheet(opt2, "Option 2: a tray each side (pieces: trays / grill)", f"{o}/layout-opt2-sizes.jpg")
    sheet(opt3h, "Option 3, flat: raw skewers lying four in a row on the band (pieces: band / grill / cooked tray)", f"{o}/layout-opt3h-sizes.jpg")
    sheet(opt3s, "Option 3, flat two by two: raw skewers stacked in two rows on the band (pieces: band / grill / cooked tray)", f"{o}/layout-opt3s-sizes.jpg")
    sheet(opt3, "Option 3: raw skewers on the bottom band, cooked tray right (pieces: band / grill / cooked tray)", f"{o}/layout-opt3-sizes.jpg")
