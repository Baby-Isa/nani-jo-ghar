#!/usr/bin/env python3
"""Make the game's webp files for the sprites wired in data/cook.json (art.sprites).

Cook with Nani loads <stem>.webp next to each <stem>.png source in
assets/cook/items/ (the PNGs stay: they're the masters). Each sprite is
trimmed to its visible pixels, then:
  - `w`: exactly this wide (a prop it replaces: the prop's own width, so
    every fixed scale in the code draws it the same size), else
  - `max`: at most this many px on its longer side (art.sprites.max, 256 by
    default; 0 keeps the source size: the big vessels are small already),
  - `square`: stretched to a square box first (the maani states come out
    8-12% oval and a little wider than the raw one; the report's fix).
WebP quality 85, alpha kept.

It also makes the 1600x900 stage backgrounds (art.sprites.bg) from the
1536x1024 ChatGPT plates in assets/cook/bg/:
  - the worktop: scaled to 1600 wide, the middle 900 rows;
  - the hob: scaled and placed so its two burners sit exactly where the
    stations put pans (Cook.Stations.BURNER: 515,375 and 1085,375).

Usage: python3 build/sprites_webp.py   (re-run after changing the data)
"""
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Q = 85

# burner centres in the hob plate (source px, measured on the grates' caps) and on the stage
HOB_BURNERS_SRC = ((545.0, 379.0), (992.0, 380.0))
HOB_BURNERS_STAGE = ((515.0, 375.0), (1085.0, 375.0))
STAGE = (1600, 900)


def entries(sp):
    """(item, state, file, opts) for every sprite in the data."""
    for item, states in sp["items"].items():
        for state, v in states.items():
            if isinstance(v, str):
                yield item, state, v, {}
            else:
                yield item, state, v["file"], v


def prop_widths(sp):
    out = {}
    for prop, ref in sp.get("props", {}).items():
        path = os.path.join(ROOT, "assets", "cook", "props", prop + ".webp")
        if os.path.exists(path):
            out[ref] = Image.open(path).width
    return out


def make_item(src, dst, *, w=None, max_side=256, square=False):
    im = Image.open(src).convert("RGBA")
    bb = im.getchannel("A").getbbox()
    im = im.crop(bb)
    if square:
        side = max(im.size)
        im = im.resize((side, side), Image.LANCZOS)
    if w:
        im = im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS)
    elif max_side and max(im.size) > max_side:
        k = max_side / max(im.size)
        im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    im.save(dst, "WEBP", quality=Q, method=6)
    return im.size


def make_worktop(src, dst):
    im = Image.open(src).convert("RGB")
    k = STAGE[0] / im.width
    im = im.resize((STAGE[0], round(im.height * k)), Image.LANCZOS)
    top = (im.height - STAGE[1]) // 2
    im.crop((0, top, STAGE[0], top + STAGE[1])).save(dst, "WEBP", quality=Q, method=6)


def make_hob(src, dst):
    im = Image.open(src).convert("RGB")
    (ax, ay), (bx, by) = HOB_BURNERS_SRC
    (tx, ty), (ux, uy) = HOB_BURNERS_STAGE
    k = (ux - tx) / (bx - ax)
    ox = (tx + ux) / 2 - (ax + bx) / 2 * k
    oy = (ty + uy) / 2 - (ay + by) / 2 * k
    big = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    x0, y0 = round(-ox), round(-oy)
    assert x0 >= 0 and y0 >= 0 and x0 + STAGE[0] <= big.width and y0 + STAGE[1] <= big.height, "the hob plate doesn't cover the stage"
    big.crop((x0, y0, x0 + STAGE[0], y0 + STAGE[1])).save(dst, "WEBP", quality=Q, method=6)


def main():
    data = json.load(open(os.path.join(ROOT, "data", "cook.json")))
    sp = data["art"]["sprites"]
    d = os.path.join(ROOT, sp["dir"])
    widths = prop_widths(sp)
    total = 0
    done = set()
    for item, state, stem, opts in entries(sp):
        if stem in done:
            continue
        done.add(stem)
        src = os.path.join(d, stem + ".png")
        dst = os.path.join(d, stem + ".webp")
        size = make_item(src, dst, w=opts.get("w") or widths.get(f"{item}.{state}"), max_side=opts.get("max", sp.get("max", 256)), square=opts.get("square", False))
        kb = os.path.getsize(dst) / 1024
        total += kb
        print(f"{stem}.webp {size[0]}x{size[1]} {kb:.1f} KB")
    bgdir = os.path.join(ROOT, "assets", "cook", "bg")
    for view, stem in sp.get("bg", {}).items():
        src = os.path.join(bgdir, stem.replace("-1600", "") + ".png")
        dst = os.path.join(bgdir, stem + ".webp")
        (make_hob if view == "hob" else make_worktop)(src, dst)
        kb = os.path.getsize(dst) / 1024
        total += kb
        print(f"{stem}.webp {kb:.1f} KB")
    print(f"total {total:.0f} KB")


if __name__ == "__main__":
    main()
