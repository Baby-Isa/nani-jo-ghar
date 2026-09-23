#!/usr/bin/env python3
"""Procedural placeholder art for the one thing the fruit-bowl errand needs
that doesn't already exist: the bowl the fruit goes into, and a parchment
texture for the recipe-scroll sidebar. Everything else reuses existing
character/item art per the Roadmap doc ('reuse existing assets, only make
up the bowl and stuff'). No external image-gen tool available in this
session, so this is drawn procedurally with PIL rather than skipped."""
from PIL import Image, ImageDraw, ImageFilter
import random
import math

random.seed(7)

# ---------------- bowl ----------------
W, H = 480, 360
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# wooden bowl body (simple rounded trapezoid with rim ellipse)
body_color = (139, 94, 52, 255)
body_dark = (105, 68, 36, 255)
rim_color = (168, 118, 68, 255)

# bowl body
d.polygon(
    [(70, 150), (410, 150), (360, 320), (120, 320)],
    fill=body_color,
)
# bottom shadow curve
d.ellipse([120, 295, 360, 345], fill=body_dark)
d.ellipse([120, 280, 360, 330], fill=body_color)
# rim (ellipse, lighter)
d.ellipse([55, 110, 425, 190], fill=rim_color)
d.ellipse([85, 128, 395, 178], fill=(74, 46, 24, 255))  # inner well (empty bowl interior)

# a few wood-grain arcs for texture
for i in range(6):
    y = 160 + i * 25
    d.arc([90 + i * 6, y, 390 - i * 6, y + 140], start=200, end=340, fill=(120, 80, 44, 120), width=3)

img = img.filter(ImageFilter.SMOOTH)
img.save("/home/claude/game/assets/items/bowl-empty.png")

# ---------------- parchment texture (tileable-ish sidebar background) ----------------
PW, PH = 400, 900
paper = Image.new("RGB", (PW, PH), (232, 214, 175))
pd = ImageDraw.Draw(paper)

# soft mottling
for _ in range(2200):
    x = random.randint(0, PW - 1)
    y = random.randint(0, PH - 1)
    r = random.randint(1, 3)
    shade = random.randint(-18, 14)
    base = (214 + shade, 194 + shade, 152 + shade)
    base = tuple(max(0, min(255, c)) for c in base)
    pd.ellipse([x - r, y - r, x + r, y + r], fill=base)

paper = paper.filter(ImageFilter.GaussianBlur(1.2))
pd = ImageDraw.Draw(paper)

# vignette edges (darker border like aged paper)
edge = Image.new("L", (PW, PH), 0)
ed = ImageDraw.Draw(edge)
ed.rectangle([0, 0, PW, PH], fill=0)
for i in range(40):
    alpha = int(90 * (1 - i / 40))
    ed.rectangle([i, i, PW - i, PH - i], outline=alpha)
edge = edge.filter(ImageFilter.GaussianBlur(6))
dark = Image.new("RGB", (PW, PH), (90, 60, 30))
paper = Image.composite(dark, paper, edge)

paper.save("/home/claude/game/assets/ui/parchment.jpg", quality=88)

print("wrote assets/items/bowl-empty.png", Image.open("/home/claude/game/assets/items/bowl-empty.png").size)
print("wrote assets/ui/parchment.jpg", Image.open("/home/claude/game/assets/ui/parchment.jpg").size)
