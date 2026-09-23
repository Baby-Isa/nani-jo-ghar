#!/usr/bin/env python3
"""Renders one PNG per scene with every layer in the same order the game
draws it: background -> character (behind) -> occluder (counter/island,
hides the character's lower body) -> stall/shelf slots with a sample fruit
and contact shadow -> bowl back / items / bowl front -> basket back /
items / basket front -> bubble anchor box. Baselines in red, labels on.
This is how scene JSON positions get verified before any code uses them -
never by dragging things by hand. See Build Brief v3, section 6.1.

Usage: python3 build/place_preview.py [scene-id ...]
No args = render every scene in data/scenes/.
"""
import glob
import json
import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCENES_DIR = os.path.join(ROOT, "data", "scenes")
OUT_DIR = os.path.join(ROOT, "build", "previews")

SAMPLE_FRUIT = [
    "assets/items/fruit/fru-01.png", "assets/items/fruit/fru-02.png",
    "assets/items/fruit/fru-03.png", "assets/items/fruit/fru-04.png",
    "assets/items/fruit/fru-06.png", "assets/items/fruit/fru-07.png",
    "assets/items/fruit/fru-09.png", "assets/items/fruit/fru-13.png",
    "assets/items/fruit/fru-15.png", "assets/items/fruit/fru-16.png",
]
SINK = 3  # px an item sits into its surface (matches js/game.js)


def load(p):
    return Image.open(os.path.join(ROOT, p)).convert("RGBA")


def fit(sprite, max_w, max_h):
    r = min(max_w / sprite.width, max_h / sprite.height)
    return sprite.resize((max(1, round(sprite.width * r)), max(1, round(sprite.height * r))), Image.LANCZOS)


def paste_item(base, path, x, baseline, max_w, max_h, shadow=True):
    sprite = fit(load(path), max_w, max_h)
    if shadow:
        sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
        w = sprite.width * 0.8
        ImageDraw.Draw(sh).ellipse([x - w / 2, baseline - w * 0.07, x + w / 2, baseline + w * 0.07], fill=(42, 22, 8, 80))
        base.alpha_composite(sh)
    base.alpha_composite(sprite, (round(x - sprite.width / 2), round(baseline + SINK - sprite.height)))


def paste_width(base, path, x, baseline_or_top, w, anchor_bottom=True):
    img = load(path)
    h = round(img.height * w / img.width)
    img = img.resize((w, h), Image.LANCZOS)
    top = baseline_or_top - h if anchor_bottom else baseline_or_top
    canvas = Image.new("RGBA", base.size, (0, 0, 0, 0))
    canvas.alpha_composite(img, (round(x - w / 2), round(top)) if top >= 0 else (round(x - w / 2), 0))
    base.alpha_composite(canvas)


def label(draw, x, baseline, w, text):
    draw.line([(x - w / 2, baseline), (x + w / 2, baseline)], fill=(255, 0, 0, 255), width=2)
    draw.text((x - w / 2, baseline + 4), text, fill=(255, 0, 0, 255))


def render_scene(scene_path):
    scene = json.load(open(scene_path))
    bg = load(scene["background"])
    base = bg.copy()
    samples = iter(SAMPLE_FRUIT * 4)

    # character, behind the occluder: origin top-centre at (x, top)
    char = scene.get("character")
    if char:
        sprite = load(f"assets/characters/{char['id']}/{char['id']}-neutral.png")
        s = char.get("scale", 1.0)
        sprite = sprite.resize((round(sprite.width * s), round(sprite.height * s)), Image.LANCZOS)
        occ = scene.get("occluder")
        if occ:  # behind a counter: nothing of the character exists below its top edge
            keep = round(occ["y"] + 20 - char["top"])
            sprite = sprite.crop((0, 0, sprite.width, min(sprite.height, keep)))
        layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
        layer.alpha_composite(sprite, (round(char["x"] - sprite.width / 2), round(char["top"])))
        base.alpha_composite(layer)

    occ = scene.get("occluder")
    if occ:
        if occ.get("fromBackground"):
            base.alpha_composite(bg.crop((0, occ["y"], bg.width, bg.height)), (0, occ["y"]))
        else:
            base.alpha_composite(load(occ["image"]), (occ["x"], occ["y"]))

    draw = ImageDraw.Draw(base)
    for slot_id, slot in scene.get("slots", {}).items():
        paste_item(base, next(samples), slot["x"], slot["baseline"], slot["maxW"], slot["maxH"])
        label(draw, slot["x"], slot["baseline"], slot["maxW"], slot_id)

    for key in ("bowl", "basket"):
        c = scene.get(key)
        if not c:
            continue
        if "baseline" in c:
            paste_width(base, c["back"], c["x"], c["baseline"], c["w"], anchor_bottom=True)
        else:
            paste_width(base, c["back"], c["x"], c["top"], c["w"], anchor_bottom=False)
        for i, spot in sorted(enumerate(c["inside"]), key=lambda e: e[1]["baseline"]):
            paste_item(base, next(samples), spot["x"], spot["baseline"], c["item"]["maxW"], c["item"]["maxH"], shadow=False)
        if "baseline" in c:
            paste_width(base, c["front"], c["x"], c["baseline"], c["w"], anchor_bottom=True)
        else:
            paste_width(base, c["front"], c["x"], c["top"], c["w"], anchor_bottom=False)
        draw = ImageDraw.Draw(base)
        for i, spot in enumerate(c["inside"]):
            draw.text((spot["x"] - 4, spot["baseline"] - 12), str(i), fill=(255, 0, 0, 255))

    b = scene.get("bubble")
    if b:
        draw.rectangle([b["right"] - b["maxW"], b["top"], b["right"], b["top"] + 110], outline=(0, 120, 255, 255), width=3)
        draw.text((b["right"] - b["maxW"] + 6, b["top"] + 6), "speech bubble (max)", fill=(0, 120, 255, 255))

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"{scene['id']}.png")
    base.convert("RGB").save(out)
    print(f"wrote {out}")


def main():
    args = sys.argv[1:]
    paths = [os.path.join(SCENES_DIR, f"{a}.json") for a in args] if args else sorted(glob.glob(os.path.join(SCENES_DIR, "*.json")))
    for p in paths:
        render_scene(p)


if __name__ == "__main__":
    main()
