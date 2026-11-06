#!/usr/bin/env python3
# Contact sheets for the card English study: per option, today vs the option at five sizes, cropped to the order card's item row
# (pixel-true crops; a phone's crop enlarged 2x with whole pixels so the small type can be read, the big screens' at 1x).
#   python3 build/tools/cards/sheet.py build/screenshots/cards build/reports/cards
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
m = json.load(open(os.path.join(src, "measure.json")))
sizes = ["740x320", "930x430", "971x318", "1280x665", "1920x1080"]
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except Exception:
    font = ImageFont.load_default()


def crop(size, opt):
    rows = [r for r in m.get(f"{size}|panel|{opt}", []) if r["kind"] == "item"]
    im = Image.open(os.path.join(src, size, f"{opt}-panel.png")).convert("RGB")
    x0 = max(0, min(r["card"]["x"] for r in rows) - 6); y0 = max(0, min(r["card"]["y"] for r in rows) - 6)
    x1 = max(r["card"]["x"] + r["card"]["w"] for r in rows) + 6; y1 = max(r["card"]["y"] + r["card"]["h"] for r in rows) + 6
    c = im.crop((int(x0), int(y0), int(x1), int(y1)))
    k = 2 if int(size.split("x")[1]) < 500 else 1
    if k != 1:
        c = c.resize((c.width * k, c.height * k), Image.NEAREST)
    return c, rows[0]["enPx"], rows[0]["card"]["h"]


LABEL = {"floor12": "1  English 12 px floor only", "nudge": "2  12 px, Kutchi up, speaker gap trimmed",
         "floor11": "3  11 px floor, Kutchi up", "big13": "4  13 px, gaps trimmed, speaker drawn 30 px"}
for i, (opt, lab) in enumerate(LABEL.items(), 1):
    cells = []
    for s in sizes:
        a, ea, ha = crop(s, "before"); b, eb, hb = crop(s, opt); cells.append((s, a, ea, ha, b, eb, hb))
    W = max(c[1].width + c[4].width for c in cells) + 60; H = sum(max(c[1].height, c[4].height) + 30 for c in cells) + 40
    sheet = Image.new("RGB", (W, H), "white"); d = ImageDraw.Draw(sheet)
    d.text((10, 10), f"Option {lab}   (left: today, right: the option; phones at 2x)", fill="black", font=font)
    y = 40
    for s, a, ea, ha, b, eb, hb in cells:
        d.text((10, y), f"{s}: English {ea} -> {eb} px; card height {ha} -> {hb} px", fill="black", font=font)
        sheet.paste(a, (10, y + 22)); sheet.paste(b, (a.width + 40, y + 22))
        y += max(a.height, b.height) + 30
    p = os.path.join(out, f"option-{i}-{opt}.png")
    sheet = sheet.convert("P", palette=Image.ADAPTIVE, colors=256)
    sheet.save(p, optimize=True); print(p, sheet.size, os.path.getsize(p) // 1024, "KB")
