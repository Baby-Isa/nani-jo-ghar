#!/usr/bin/env python3
"""Renders one PNG per scene: background + every slot filled with a sample
fruit + containers + character at its anchor, with a thin red line at each
baseline and the slot id as a label. This is how scene JSON positions get
verified before any code uses them — never by dragging things by hand.
See Build Brief v3, section 6.1.

Usage: python3 build/place_preview.py [scene-id ...]
No args = render every scene in data/scenes/.
"""
import json
import os
import sys
import glob
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCENES_DIR = os.path.join(ROOT, "data", "scenes")
OUT_DIR = os.path.join(ROOT, "build", "previews")

# Sample fruit sprites to cycle through when filling slots, so overlap is
# obvious without needing real errand data.
SAMPLE_FRUIT = [
    "assets/items/fruit/fru-01.png", "assets/items/fruit/fru-02.png",
    "assets/items/fruit/fru-03.png", "assets/items/fruit/fru-04.png",
    "assets/items/fruit/fru-06.png", "assets/items/fruit/fru-07.png",
    "assets/items/fruit/fru-09.png", "assets/items/fruit/fru-13.png",
    "assets/items/fruit/fru-15.png", "assets/items/fruit/fru-16.png",
]


def paste_bottom_center(base, sprite_path, x, baseline, target_w):
    sprite = Image.open(os.path.join(ROOT, sprite_path)).convert("RGBA")
    ratio = target_w / sprite.width
    target_h = int(round(sprite.height * ratio))
    sprite = sprite.resize((int(target_w), target_h), Image.LANCZOS)
    left = int(round(x - target_w / 2))
    top = int(round(baseline - target_h))
    base.alpha_composite(sprite, (left, top))
    return left, top, left + int(target_w), baseline


def draw_baseline_and_label(draw, x, baseline, w, label):
    draw.line([(x - w / 2, baseline), (x + w / 2, baseline)], fill=(255, 0, 0, 255), width=2)
    draw.text((x - w / 2, baseline + 4), label, fill=(255, 0, 0, 255))


def render_scene(scene_path):
    with open(scene_path) as f:
        scene = json.load(f)

    bg_path = os.path.join(ROOT, scene["background"])
    bg = Image.open(bg_path).convert("RGBA")
    base = bg.copy()
    draw = ImageDraw.Draw(base)

    sample_i = 0

    def next_sample():
        nonlocal sample_i
        s = SAMPLE_FRUIT[sample_i % len(SAMPLE_FRUIT)]
        sample_i += 1
        return s

    # containers (e.g. the kitchen bowl) first, so items drawn "inside" sit on top
    for cname, c in scene.get("containers", {}).items():
        paste_bottom_center(base, c["image"], c["x"], c["baseline"], c["w"])
        draw_baseline_and_label(draw, c["x"], c["baseline"], c["w"], cname)
        for i, inside in enumerate(c.get("inside", [])):
            sprite = next_sample()
            paste_bottom_center(base, sprite, inside["x"], inside["baseline"], inside["w"])
            draw_baseline_and_label(draw, inside["x"], inside["baseline"], inside["w"], f"{cname}.inside[{i}]")

    # slots
    for slot_id, slot in scene.get("slots", {}).items():
        sprite = next_sample()
        paste_bottom_center(base, sprite, slot["x"], slot["baseline"], slot["w"])
        draw_baseline_and_label(draw, slot["x"], slot["baseline"], slot["w"], slot_id)

    # character, waist-up framing: origin (0.5, 1) at
    # y = worldHeight + height*(1 - visibleFraction), cropped by frame edge
    char = scene.get("character")
    if char:
        char_path = os.path.join(ROOT, "assets", "characters", char["id"], f"{char['id']}-neutral.png")
        sprite = Image.open(char_path).convert("RGBA")
        scale = char.get("scale", 1.0)
        target_w = int(round(sprite.width * scale))
        target_h = int(round(sprite.height * scale))
        sprite = sprite.resize((target_w, target_h), Image.LANCZOS)
        world_h = base.height
        visible_fraction = char.get("visibleFraction", 1.0)
        baseline_y = world_h + target_h * (1 - visible_fraction)
        left = int(round(char["x"] - target_w / 2))
        top = int(round(baseline_y - target_h))
        # crop the sprite itself to the frame so the preview matches what
        # Phaser's camera will actually show (nothing drawn below y=world_h)
        canvas = Image.new("RGBA", base.size, (0, 0, 0, 0))
        canvas.alpha_composite(sprite, (left, top))
        canvas = canvas.crop((0, 0, base.width, base.height))
        base.alpha_composite(canvas)
        draw.line([(0, world_h - 1), (base.width, world_h - 1)], fill=(0, 200, 255, 255), width=2)
        draw.text((10, world_h - 20), "frame bottom edge (character must be cropped here)", fill=(0, 200, 255, 255))

    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, f"{scene['id']}.png")
    base.convert("RGB").save(out_path)
    print(f"wrote {out_path}")


def main():
    args = sys.argv[1:]
    if args:
        paths = [os.path.join(SCENES_DIR, f"{a}.json") for a in args]
    else:
        paths = sorted(glob.glob(os.path.join(SCENES_DIR, "*.json")))
    for p in paths:
        render_scene(p)


if __name__ == "__main__":
    main()
