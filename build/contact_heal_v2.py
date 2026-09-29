#!/usr/bin/env python3
"""Contact sheets of the clinic v2 heal shots (build/reports/clinic-v2-b/) for review: one sheet per game
and level, the shots in order, 3 across. Out: build/reports/clinic-v2-b/sheets/<game>-L<level>.png"""
import glob
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "build", "reports", "clinic-v2-b")
os.makedirs(os.path.join(D, "sheets"), exist_ok=True)
groups = {}
for f in sorted(glob.glob(os.path.join(D, "*.png"))):
    g = "-".join(os.path.basename(f).split("-")[:2])
    groups.setdefault(g, []).append(f)
for g, fs in groups.items():
    ims = [Image.open(f).convert("RGB") for f in fs]
    w, h = 683, 384
    cols = 3
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (w * cols, h * rows), "white")
    for i, (im, f) in enumerate(zip(ims, fs)):
        x, y = (i % cols) * w, (i // cols) * h
        sheet.paste(im.resize((w, h)), (x, y))
        ImageDraw.Draw(sheet).text((x + 6, y + h - 16), os.path.basename(f)[:-4], fill=(200, 0, 0))
    sheet.save(os.path.join(D, "sheets", g + ".png"))
    print(g, len(ims))
