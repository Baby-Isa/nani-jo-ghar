#!/usr/bin/env python3
"""CHAI-92: the judge's sheets from shoot_juice.mjs's stills: BEFORE (red label) beside or above AFTER (green label) per moment.
  python3 build/tools/juice/sheets_juice.py <shots dir> <out dir> [size]
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
size = sys.argv[3] if len(sys.argv) > 3 else "1280x665"
os.makedirs(out, exist_ok=True)
try:
    FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
    SMALL = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
except OSError:
    FONT = SMALL = ImageFont.load_default()
RED, GREEN, INK = (190, 40, 40), (30, 130, 60), (40, 30, 25)


def shot(name):
    p = os.path.join(src, f"{name}-{size}.png")
    return Image.open(p).convert("RGB") if os.path.exists(p) else None


def label(im, text, colour):
    """the picture with a coloured label band over it"""
    band = 26
    o = Image.new("RGB", (im.width, im.height + band), "white")
    o.paste(im, (0, band))
    d = ImageDraw.Draw(o)
    d.rectangle([0, 0, im.width, band - 2], fill=colour)
    d.text((6, 3), text, fill="white", font=FONT)
    return o


def row(ims, gap=8):
    ims = [i for i in ims if i is not None]
    w = sum(i.width for i in ims) + gap * (len(ims) - 1)
    h = max(i.height for i in ims)
    o = Image.new("RGB", (w, h), "white")
    x = 0
    for i in ims:
        o.paste(i, (x, 0))
        x += i.width + gap
    return o


def col(ims, gap=10):
    ims = [i for i in ims if i is not None]
    w = max(i.width for i in ims)
    h = sum(i.height for i in ims) + gap * (len(ims) - 1)
    o = Image.new("RGB", (w, h), "white")
    y = 0
    for i in ims:
        o.paste(i, (0, y))
        y += i.height + gap
    return o


def titled(im, title):
    o = Image.new("RGB", (im.width, im.height + 30), "white")
    o.paste(im, (0, 30))
    ImageDraw.Draw(o).text((4, 6), title, fill=INK, font=FONT)
    return o


def scale(im, k):
    return im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)


def save(im, name):
    if im.width > 1600:
        im = scale(im, 1600 / im.width)
    p = os.path.join(out, name)
    im.save(p)
    print(p, im.size)


# A: the boiling pan's steam (a crop, 2x; and the whole screen, half size)
a = row([label(scale(shot("A-steam-before-lab-L1"), 1.5), "BEFORE", RED), label(scale(shot("A-steam-after-lab-L1"), 1.5), "AFTER", GREEN)])
aw = row([label(scale(shot("A-steam-whole-before-lab-L1"), 0.6), "BEFORE (whole screen)", RED), label(scale(shot("A-steam-whole-after-lab-L1"), 0.6), "AFTER (whole screen)", GREEN)])
save(titled(col([a, aw]), f"A  chai L1 {size}: the pan coming to the boil, its steam"), f"sheet-A-steam-{size}.png")

# B: the tray's glass as the pour ends (ms after the pour's end; each still taken with the kitchen's tweens frozen)
MS = ["150", "300", "600", "900", "1200", "1500"]
for lv in ["L1", "L4"]:
    rows = []
    for t, c in [("before", RED), ("after", GREEN)]:
        fr = [shot(f"B-glass-{m}-{t}-lab-{lv}") for m in MS]
        if not all(fr):
            continue
        rows.append(label(row([scale(f, 1.5) for f in fr]), f"{t.upper()}   " + "   ".join(f"{m} ms" for m in MS), c))
    if rows:
        save(titled(col(rows), f"B  chai {lv} {size}: the tray's glass as its first pour ends (frames from the pour's end)"), f"sheet-B-glass-{lv}-{size}.png")

# C: the word moment's last drop (frames from the drop's start)
CM = ["150", "300", "450", "600"]
rows = []
for t, c in [("before", RED), ("after", GREEN)]:
    fr = [shot(f"C-drop-{m}-{t}-lab-L4") for m in CM]
    if all(fr):
        rows.append(label(row([scale(f, 1.2) for f in fr]), f"{t.upper()}   " + "   ".join(f"{m} ms" for m in CM), c))
if rows:
    save(titled(col(rows), f"C  chai L4 {size}: the word moment, the last drop from the kettle into the side-on glass"), f"sheet-C-word-moment-{size}.png")

# D: the end screen's stopwatch; E: the serve's stamp
d = row([label(shot("D-end-before-lab-L4"), "BEFORE", RED), label(shot("D-end-after-lab-L4"), "AFTER", GREEN)])
save(titled(d, f"D  chai L4 {size}: the end screen, the stopwatch as its count lands"), f"sheet-D-end-{size}.png")
e = row([label(scale(shot("E-stamp-before-order-L1"), 1.5), "BEFORE", RED), label(scale(shot("E-stamp-after-order-L1"), 1.5), "AFTER", GREEN)])
save(titled(e, f"E  a chai order L1 {size}: the served card in the side bar as its stamp lands"), f"sheet-E-stamp-{size}.png")

# the strip: every effect, AFTER only, in play order
strip = row([
    label(shot("A-steam-after-lab-L1"), "1 steam over the boiling pan", GREEN),
    label(scale(shot("B-glass-300-after-lab-L1"), 1.5), "2 the drop", GREEN),
    label(scale(shot("B-glass-900-after-lab-L1"), 1.5), "2 the twinkles", GREEN),
    label(shot("C-drop-450-after-lab-L4"), "3 word moment: the crown", GREEN),
])
strip2 = row([label(shot("D-end-after-lab-L4"), "4 end screen: the gold burst", GREEN), label(scale(shot("E-stamp-after-order-L1"), 1.5), "5 the serve's stamp", GREEN)])
save(titled(col([strip, strip2]), f"The strip, {size}: every effect after the change, in play order"), f"strip-after-{size}.png")

# F: reduced motion (shoot_juice.mjs --less into a folder of its own, given as the 4th argument): every effect a fade in place
if len(sys.argv) > 4:
    src = sys.argv[4]
    parts = [
        label(shot("A-steam-after-lab-L4-less"), "A steam: one still wisp", GREEN),
        label(row([scale(shot(f"B-glass-{m}-after-order-L1-less"), 1.2) for m in ["150", "600", "1200"]]), "B the glass: 150, 600, 1200 ms", GREEN),
    ]
    c = [shot(f"C-drop-{m}-after-lab-L4-less") for m in ["150", "300", "450", "600"]]
    second = [label(row(c), "C the word moment: 150, 300, 450, 600 ms", GREEN)] if all(c) else []
    second += [label(shot("D-end-after-lab-L4-less"), "D the end screen", GREEN), label(scale(shot("E-stamp-after-order-L1-less"), 1.5), "E the stamp", GREEN)]
    save(titled(col([row(parts), row(second)]), f"F  reduced motion (the system setting), {size}: AFTER only, each effect fades where it is"), f"sheet-F-reduced-motion-{size}.png")
