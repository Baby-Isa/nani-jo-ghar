#!/usr/bin/env python3
"""The font sample of 6 Nov (b): the real phone screens (740x320) close up, every option: the L1 order (left) and the L4 shelf pills
(right, enlarged 2x). From shoot.mjs --b's shots.
    python3 build/tools/fonts/phone-b.py [shots] [out.webp]
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
shots = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "build", "screenshots", "fonts-b", "740x320")
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "build", "reports", "fonts", "phone-closeups-2026-11-06b.webp")
NAMES = {"A": "A today", "L": "1 Lora", "F": "2 Fraunces + Lora", "G": "3 Lora + Fraunces headline", "T": "4 Literata",
         "S": "5 Source Serif 4", "R": "6 Alegreya"}
f = ImageFont.truetype(os.path.join(ROOT, "build", "sandbox", "fonts", "nunito-800.ttf"), 16)
rows = []
for o in NAMES:
    p, q = os.path.join(shots, o, "shelf4-01-view-marble.png"), os.path.join(shots, o, "chai-01-order-card-big.png")
    a = Image.open(p).convert("RGB").crop((160, 292, 740, 320)).resize((1160, 56), Image.LANCZOS) if os.path.exists(p) else None
    b = Image.open(q).convert("RGB").crop((0, 0, 560, 250)) if os.path.exists(q) else None
    rows.append((o, a, b))
W, H = 1750, len(rows) * 288 + 10
im = Image.new("RGB", (W, H), (246, 241, 232))
d = ImageDraw.Draw(im)
y = 6
for o, a, b in rows:
    d.text((10, y + 4), NAMES[o] + "   (740x320, the real game: L1 order on the left; the L4 shelf pills, enlarged 2x, on the right)", fill=(125, 34, 52), font=f)
    y += 30
    if b:
        im.paste(b, (10, y))
    if a:
        im.paste(a, (580, y + 90))
    y += 258
im.save(out, "WEBP", quality=80, method=6)
print(out, os.path.getsize(out) // 1024, "KB")
