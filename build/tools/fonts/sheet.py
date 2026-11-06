#!/usr/bin/env python3
"""Contact sheets for the font options (fonts across the game, 6 Nov): one sheet per screen, the options side by side (columns) at
each size (rows), from shoot.mjs's shots; and a close-up sheet of the smallest type (crops at 2x of the phone sizes, shot with --dpr 2).

    python3 build/tools/fonts/sheet.py [--shots build/screenshots/fonts] [--out build/reports/fonts] [--col 440]
    python3 build/tools/fonts/sheet.py --crops build/screenshots/fonts-dpr2 --out build/reports/fonts

Writes <out>/<screen>.webp (small enough to commit: a few hundred KB each) and <out>/closeups.webp.
"""
import argparse
import glob
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
OPTS = ["A", "B", "C", "D"]
NAMES = {"A": "A  today", "B": "B  Nunito for every word", "C": "C  Fraunces for every word", "D": "D  Andika for every word"}
SIZES = ["740x320", "971x318", "930x430", "1280x665", "1920x1080"]
# the screens, by the shot's file name (shoot.mjs)
SCREENS = [
    ("chai-order", "chai-01-order-card-big", "Chai L1: the order (Nana's bubble, the big card, the side panel)"),
    ("chai-shelf", "chai-02-view-marble", "Chai L1: the shelf"),
    ("chai-shelf-L4", "shelf4-01-view-marble", "Chai L4: the crowded shelf (ten pills)"),
    ("word-moment", "wm-word-moment-lab", "The word moment's cards (lab page, at the end)"),
    ("end-words", "chai-03-results-words", "Chai: the end screen's word review"),
    ("door", "door-lines-and-yes", "The door: Nani's line, the cards, Ha! and Na"),
    ("clinic", "clinic-waiting-01-stage-waiting", "The clinic: the waiting room"),
]


def font(px, bold=True):
    f = os.path.join(ROOT, "build", "sandbox", "fonts", "nunito-800.ttf" if bold else "nunito-700.ttf")
    try:
        return ImageFont.truetype(f, px)
    except OSError:
        return ImageFont.load_default()


def sheet(shots, out, key, stem, title, col):
    pad, head, rowlab = 10, 64, 84
    rows = []
    for size in SIZES:
        w, h = map(int, size.split("x"))
        rows.append((size, round(col * h / w)))
    W = rowlab + len(OPTS) * (col + pad) + pad
    H = head + sum(r[1] + pad for r in rows) + pad
    im = Image.new("RGB", (W, H), (246, 241, 232))
    d = ImageDraw.Draw(im)
    d.text((pad, 8), title, fill=(42, 37, 34), font=font(22))
    for i, o in enumerate(OPTS):
        d.text((rowlab + i * (col + pad) + pad, 38), NAMES[o], fill=(125, 34, 52), font=font(17))
    y = head
    found = 0
    for size, rh in rows:
        d.text((pad, y + 4), size, fill=(42, 37, 34), font=font(15))
        for i, o in enumerate(OPTS):
            p = os.path.join(shots, size, o, stem + ".png")
            x = rowlab + i * (col + pad) + pad
            if os.path.exists(p):
                s = Image.open(p).convert("RGB").resize((col, rh), Image.LANCZOS)
                im.paste(s, (x, y))
                found += 1
            else:
                d.rectangle([x, y, x + col, y + rh], outline=(200, 190, 170))
                d.text((x + 8, y + 8), "(no shot)", fill=(140, 120, 100), font=font(14, False))
        y += rh + pad
    dest = os.path.join(out, key + ".webp")
    im.save(dest, "WEBP", quality=72, method=6)
    return dest, found


def closeups(crops, out):
    """The smallest type at 2x: per option, the same regions of the phone shots (shot at DPR 2)."""
    # regions in CSS px at 740x320 / 971x318: (label, stem, size, box)
    regions = [
        ("740x320 L4 shelf pills, the first six (the smallest word: about 9 CSS px)", "shelf4-01-view-marble", "740x320", (236, 292, 530, 318)),
        ("740x320 side panel: order card and Nani's box", "shelf4-01-view-marble", "740x320", (0, 0, 222, 160)),
        ("740x320 L1 order: Nana's bubble and the big card", "chai-01-order-card-big", "740x320", (230, 30, 560, 300)),
        ("971x318 L4 shelf pills, the first six (13 CSS px)", "shelf4-01-view-marble", "971x318", (280, 290, 620, 316)),
        ("740x320 the door's line (C and D wrap to three lines)", "door-lines-and-yes", "740x320", (390, 6, 610, 104)),
        ("740x320 the clinic's side panel", "clinic-waiting-01-stage-waiting", "740x320", (0, 44, 236, 178)),
    ]
    k = 2  # the shots' DPR
    pad = 10
    tiles = []
    for label, stem, size, box in regions:
        row = []
        for o in OPTS:
            p = os.path.join(crops, size, o, stem + ".png")
            if not os.path.exists(p):
                row.append(None)
                continue
            s = Image.open(p).convert("RGB")
            row.append(s.crop(tuple(v * k for v in box)))
        tiles.append((label, row))
    cw = max((t.width for _, r in tiles for t in r if t), default=200)
    cw = min(cw, 700)
    W = 4 * (cw + pad) + pad
    H = 50
    scaled = []
    for label, row in tiles:
        rr = [t.resize((cw, round(t.height * cw / t.width)), Image.LANCZOS) if t and t.width > cw else t for t in row]
        rh = max((t.height for t in rr if t), default=40)
        scaled.append((label, rr, rh))
        H += 30 + rh + pad
    im = Image.new("RGB", (W, H), (246, 241, 232))
    d = ImageDraw.Draw(im)
    for i, o in enumerate(OPTS):
        d.text((pad + i * (cw + pad), 14), NAMES[o], fill=(125, 34, 52), font=font(18))
    y = 50
    for label, rr, rh in scaled:
        d.text((pad, y + 4), label + "  (2x, as a phone's screen draws it)", fill=(42, 37, 34), font=font(15))
        y += 30
        for i, t in enumerate(rr):
            if t:
                im.paste(t, (pad + i * (cw + pad), y))
        y += rh + pad
    dest = os.path.join(out, "closeups.webp")
    im.save(dest, "WEBP", quality=80, method=6)
    return dest


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--shots", default=os.path.join(ROOT, "build", "screenshots", "fonts"))
    a.add_argument("--crops")
    a.add_argument("--out", default=os.path.join(ROOT, "build", "reports", "fonts"))
    a.add_argument("--col", type=int, default=440)
    o = a.parse_args()
    os.makedirs(o.out, exist_ok=True)
    if o.crops:
        print(closeups(o.crops, o.out))
        return 0
    for key, stem, title in SCREENS:
        dest, n = sheet(o.shots, o.out, key, stem, title, o.col)
        print(f"{dest}: {n} shots, {os.path.getsize(dest) // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
