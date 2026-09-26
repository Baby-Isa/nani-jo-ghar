#!/usr/bin/env python3
"""Game-sized hand sprites for Cook with Nani (js/cook/hands.js).

The baked character skins (assets/characters/hands/skins/<character>/, hands
v3) are 1024-1744 px and 200 KB-1.2 MB each: far too big for a phone. For
every pose in data/hand-poses.json and every character there, this makes
assets/cook/hands/<character>/<file>.webp:
  - trimmed to its visible pixels (alpha > 8), but always down to the bottom
    edge, where the arm leaves the picture;
  - scaled by hand-poses.json `scale` (master px -> 1600x900 design px), so
    the game draws it at 1:1;
  - WebP quality 85, alpha kept.
and data/hand-sprites.json: per file its crop box (skin px), scale, size,
and the arm's exit on the bottom row (centre x and width, sprite px), where
js/cook/hands.js stretches the sleeve on to the screen's edge.

The source skins are never changed. Usage: python3 build/hands_webp.py
"""
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKINS = os.path.join(ROOT, "assets", "characters", "hands", "skins")
OUT = os.path.join(ROOT, "assets", "cook", "hands")
Q = 85


def exits(im):
    """Runs of opaque pixels along the bottom row: [(centre x, width)], left to right."""
    a = im.getchannel("A")
    w, h = im.size
    row = [a.getpixel((x, h - 1)) > 128 for x in range(w)]
    runs, start = [], None
    for x, on in enumerate(row + [False]):
        if on and start is None:
            start = x
        elif not on and start is not None:
            if x - start > 6:
                runs.append(((start + x - 1) / 2, x - start))
            start = None
    return runs


def main():
    spec = json.load(open(os.path.join(ROOT, "data", "hand-poses.json")))
    scale = spec["scale"]
    chars = spec["characters"]["player"] + [spec["characters"]["nani"]]
    files = sorted({p["file"] for p in spec["poses"].values()})
    meta = {"_about": "Made by build/hands_webp.py from data/hand-poses.json: don't edit. file -> crop [x0, y0, x1, y1] in the skin image, scale, size [w, h] of the webp, exits: the arm(s) on the bottom row [centre x, width] in webp px. The same for every character (the skins keep every master pixel's place).", "scale": scale, "files": {}}
    total = {}
    for f in files:
        box = None
        for ch in chars:
            src = os.path.join(SKINS, ch, f"hand-{f}.webp")
            im = Image.open(src).convert("RGBA")
            a = im.getchannel("A").point(lambda v: 255 if v > 8 else 0)
            b = a.getbbox()
            box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
        box = (box[0], box[1], box[2], Image.open(os.path.join(SKINS, chars[0], f"hand-{f}.webp")).size[1])
        size = (max(1, round((box[2] - box[0]) * scale)), max(1, round((box[3] - box[1]) * scale)))
        for ch in chars:
            im = Image.open(os.path.join(SKINS, ch, f"hand-{f}.webp")).convert("RGBA").crop(box).resize(size, Image.LANCZOS)
            os.makedirs(os.path.join(OUT, ch), exist_ok=True)
            dst = os.path.join(OUT, ch, f"{f}.webp")
            im.save(dst, "WEBP", quality=Q, method=6)
            total[ch] = total.get(ch, 0) + os.path.getsize(dst)
            if ch == chars[0]:
                meta["files"][f] = {"crop": list(box), "size": list(size), "exits": [[round(x, 1), w] for x, w in exits(im)]}
    json.dump(meta, open(os.path.join(ROOT, "data", "hand-sprites.json"), "w"), indent=1)
    for ch, n in total.items():
        print(f"{ch}: {len(files)} files, {n // 1024} KB")


if __name__ == "__main__":
    main()
