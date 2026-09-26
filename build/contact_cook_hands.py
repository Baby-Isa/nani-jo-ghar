#!/usr/bin/env python3
"""build/contact-sheets/cook-hands-in-game.png: Cook's hands mid-action.

One row per kept station, one column per run of build/shoot_cook_hands.py
(build/screenshots/cook-hands/<viewport>-<hands>/). Each cell is the
picture chosen for that station: PICK names a file, else the first drag,
slice, tap or onboarding picture there is.

Usage: python3 build/contact_cook_hands.py [--runs flip5-landscape-player-boy,ipad-player-girl,...]
"""
import argparse
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, "build", "screenshots", "cook-hands")
OUT = os.path.join(ROOT, "build", "contact-sheets", "cook-hands-in-game.png")
STATIONS = ["fetch", "chai-tray", "maani-line", "mishkaki-grill", "chop", "tadka", "stir", "assemble", "samosa"]
ORDER = ["drag", "slice", "tap", "onboard"]
# (run, station) -> file, where the first picture isn't the telling one
PICK = {}
CELL_H = 300


def font(size):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def pick(run, st):
    d = os.path.join(SHOTS, run)
    if (run, st) in PICK:
        return os.path.join(d, PICK[(run, st)])
    files = sorted(os.listdir(d)) if os.path.isdir(d) else []
    for kind in ORDER:
        for f in files:
            if f.startswith(f"{st}-{kind}-"):
                return os.path.join(d, f)
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--runs", default="")
    args = ap.parse_args()
    runs = [r for r in args.runs.split(",") if r] or sorted(os.listdir(SHOTS))
    cells = {}
    widths = {}
    for r in runs:
        for st in STATIONS:
            p = pick(r, st)
            if not p:
                continue
            im = Image.open(p).convert("RGB")
            w = round(im.width * CELL_H / im.height)
            cells[(r, st)] = (im.resize((w, CELL_H), Image.LANCZOS), os.path.basename(p))
            widths[r] = max(widths.get(r, 0), w)
    lab_w, head_h, pad = 170, 40, 8
    W = lab_w + sum(widths[r] + pad for r in runs if r in widths)
    H = head_h + len(STATIONS) * (CELL_H + 22 + pad)
    sheet = Image.new("RGB", (W, H), (250, 246, 238))
    d = ImageDraw.Draw(sheet)
    f1, f2 = font(18), font(12)
    x = lab_w
    for r in runs:
        if r not in widths:
            continue
        d.text((x, 10), r, fill=(45, 32, 24), font=f1)
        y = head_h
        for st in STATIONS:
            if (r, st) in cells:
                im, name = cells[(r, st)]
                sheet.paste(im, (x, y))
                d.text((x, y + CELL_H + 3), name, fill=(107, 90, 76), font=f2)
            y += CELL_H + 22 + pad
        x += widths[r] + pad
    y = head_h
    for st in STATIONS:
        d.text((10, y + CELL_H // 2 - 10), st, fill=(45, 32, 24), font=f1)
        y += CELL_H + 22 + pad
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT, optimize=True)
    print(OUT, sheet.size)


if __name__ == "__main__":
    main()
