#!/usr/bin/env python3
"""A contact sheet of every Cook v3.1 / clinic v2 item cut, on the game's cream (VISUAL-QA §5).

    python3 build/contact_v3_1.py   # -> build/reports/art-v3-1/contact-<group>.png
"""
import json
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "reports", "art-v3-1")
CREAM = (244, 236, 223)
V3 = os.path.join(ROOT, "assets", "cook", "items", "v3")
SETS = {
    "hob": (os.path.join(V3, "hob"), ["hob-4-v2", "hob-4", "knob-off-v2", "knob-on-v2", "knob-on"]),
    "daar": (os.path.join(V3, "daar"), ["pot-seeds", "pot-onion", "pot-tomato-only", "pot-chilli-only", "pot-onion-chilli", "pot-tomato-chilli", "pot-tadka-v2", "pot-tadka",
                                        "daar-bowl-trivet-plain", "daar-bowl-trivet", "ladle-v2", "chop-heap-onion", "chop-heap-tomato", "chop-heap-chilli",
                                        "chop-piece-onion", "chop-piece-tomato", "chop-piece-chilli", "dial-stopped", "dial-slow", "dial-fast", "dial-spill"]),
    "sekelo": (os.path.join(V3, "sekelo"), ["plate-0-v2", "plate-1-v2", "plate-2-v2", "plate-3-v2", "plate-4-v2", "potato-raw", "potato-grilled", "potato-charred",
                                            "onion-charred", "tomato-charred", "pepper-charred", "meat-charred", "heap-potato"]),
    "clinic": (os.path.join(ROOT, "assets", "clinic", "items-v2"), None),
}


def sheet(name, folder, names, cell=300, cols=6, zoom=None):
    if names is None:
        names = list(json.load(open(os.path.join(folder, "meta.json"))).keys())
    rows = (len(names) + cols - 1) // cols
    im = Image.new("RGB", (cols * cell, rows * (cell + 24)), CREAM)
    d = ImageDraw.Draw(im)
    for i, n in enumerate(names):
        sp = Image.open(os.path.join(folder, n + ".webp")).convert("RGBA")
        k = (cell - 20) / max(sp.size)
        sp = sp.resize((max(1, round(sp.width * k)), max(1, round(sp.height * k))), Image.LANCZOS)
        x, y = (i % cols) * cell, (i // cols) * (cell + 24)
        im.paste(sp, (x + (cell - sp.width) // 2, y + (cell - sp.height) // 2), sp)
        d.text((x + 6, y + cell + 4), n, fill=(60, 40, 30))
    im.save(os.path.join(OUT, f"contact-{name}.png"))
    return im


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for k, (f, n) in SETS.items():
        sheet(k, f, n)
    # the edges zoomed: a 3x crop of a few cuts' edges, for the grey-fringe check
    crops = []
    for f, n, box in [(os.path.join(V3, "daar"), "ladle-v2", (0.55, 0.0, 0.85, 0.3)), (os.path.join(V3, "hob"), "knob-on-v2", (0.0, 0.3, 0.35, 0.7)),
                      (os.path.join(V3, "sekelo"), "plate-4-v2", (0.55, 0.65, 0.95, 1.0)), (os.path.join(V3, "daar"), "chop-heap-chilli", (0.0, 0.2, 0.4, 0.6)),
                      (os.path.join(ROOT, "assets", "clinic", "items-v2"), "jug-hot", (0.0, 0.0, 0.6, 0.4)), (os.path.join(ROOT, "assets", "clinic", "items-v2"), "ginger-water", (0.0, 0.0, 0.5, 0.4))]:
        sp = Image.open(os.path.join(f, n + ".webp")).convert("RGBA")
        W, H = sp.size
        c = sp.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
        c = c.resize((c.width * 2, c.height * 2), Image.NEAREST)
        bgc = Image.new("RGBA", c.size, CREAM + (255,))
        bgc.alpha_composite(c)
        crops.append(bgc.convert("RGB"))
    W = sum(c.width for c in crops) + 10 * len(crops)
    H = max(c.height for c in crops)
    z = Image.new("RGB", (W, H), CREAM)
    x = 0
    for c in crops:
        z.paste(c, (x, 0))
        x += c.width + 10
    z.save(os.path.join(OUT, "contact-edges-zoom.png"))
