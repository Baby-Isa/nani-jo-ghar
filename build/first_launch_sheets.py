#!/usr/bin/env python3
"""Contact sheets of the first launch's story screenshots (build/test_first_launch.py
writes them to build/screenshots/first-launch/<viewport>/, which isn't committed):
one JPEG per viewport in build/reports/first-launch/. Cook's own round screenshots
(1xx, 2xx) are left out. Usage: python3 build/first_launch_sheets.py"""
import os
import re

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "build", "screenshots", "first-launch")
OUT = os.path.join(ROOT, "build", "reports", "first-launch")
COLS, TW = 4, 420


def main():
    os.makedirs(OUT, exist_ok=True)
    for vp in sorted(os.listdir(SRC)):
        d = os.path.join(SRC, vp)
        fs = sorted(f for f in os.listdir(d) if re.match(r"^\d\d-.*\.png$", f))
        if not fs:
            continue
        ims = [Image.open(os.path.join(d, f)).convert("RGB") for f in fs]
        th = round(TW * ims[0].height / ims[0].width)
        rows = (len(ims) + COLS - 1) // COLS
        sheet = Image.new("RGB", (COLS * TW, rows * (th + 22)), "white")
        dr = ImageDraw.Draw(sheet)
        for i, (f, im) in enumerate(zip(fs, ims)):
            x, y = (i % COLS) * TW, (i // COLS) * (th + 22)
            sheet.paste(im.resize((TW - 6, th - 6)), (x + 3, y + 3))
            dr.text((x + 6, y + th + 4), f[:-4], fill=(60, 40, 30))
        path = os.path.join(OUT, f"{vp}.jpg")
        sheet.save(path, quality=72)
        print(path, len(fs), "shots")


if __name__ == "__main__":
    main()
