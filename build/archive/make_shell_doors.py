#!/usr/bin/env python3
"""The house's door pictures (index.html, the shell's home screen).

Each door of Nani's house shows a small portrait crop of that mode's own
background, so the home screen loads fast (a few KB per door, not the full
1600x900 backgrounds). Rerun after a background changes:

    python3 build/make_shell_doors.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "shell")
# door -> (source background, horizontal centre of the crop, 0..1)
DOORS = {
    "cook": ("assets/backgrounds/bg-nani-kitchen-v3.png", 0.3),
    "find": ("assets/backgrounds/bg-bazaar-stall-e-v1.webp", 0.5),
    "clinic": ("assets/clinic/rough/rooms/waiting.webp", 0.5),
    "monsoon": ("assets/backgrounds/bg-nani-kitchen-e-night-v1.webp", 0.5),
    "who": ("assets/backgrounds/bg-sitting-room-v1.png", 0.5),
    "tidy": ("assets/backgrounds/bg-sitting-room-v1.png", 0.25),
    "dress": ("assets/backgrounds/bg-bigma-room-e-v1.webp", 0.5),
    "snap": ("assets/backgrounds/bg-bazaar-stall-e-evening-v1.webp", 0.5),
}
# who you meet behind the door (the live modes), so a child who can't read
# tells the doors apart: (sprite, height as a share of the door, bottom offset)
WHO = {
    "cook": ("assets/cook/characters/nani-happy.webp", 0.78, 0.0),
    "find": ("assets/characters/shopkeeper/shopkeeper-happy.png", 0.72, 0.0),
    "clinic": ("assets/clinic/rough/patients/girl/wave.webp", 0.62, 0.02),
}
W, H = 300, 400


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (src, cx) in DOORS.items():
        im = Image.open(os.path.join(ROOT, src)).convert("RGB")
        # a portrait window out of a landscape picture: full height, 3:4
        h = im.height
        w = int(h * W / H)
        x0 = max(0, min(im.width - w, int(im.width * cx - w / 2)))
        im = im.crop((x0, 0, x0 + w, h)).resize((W, H), Image.LANCZOS)
        if name in WHO:
            spr, share, off = WHO[name]
            c = Image.open(os.path.join(ROOT, spr)).convert("RGBA")
            c = c.crop(c.getbbox())
            ch = int(H * share)
            cw = int(c.width * ch / c.height)
            if cw > W * 0.95:
                cw = int(W * 0.95)
                ch = int(c.height * cw / c.width)
            c = c.resize((cw, ch), Image.LANCZOS)
            im.paste(c, ((W - cw) // 2, H - ch - int(H * off)), c)
        p = os.path.join(OUT, f"door-{name}.webp")
        im.save(p, "WEBP", quality=72)
        print(p, os.path.getsize(p) // 1024, "KB")


if __name__ == "__main__":
    main()
