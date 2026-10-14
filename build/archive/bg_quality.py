#!/usr/bin/env python3
"""Re-encode the game's backgrounds at full source resolution and good quality (28 Sept 2026).

Zafar: the backgrounds looked low-res next to the character art. Every background the
game loads is re-made here from its full-size source PNG (ChatGPT's 1536x1024) as WebP at
quality 94 (they were ~80). The Cook worktop and hob (1600x900 crops) go through
build/sprites_webp.py's own cropping at BG_Q.

Not fixable here: assets/cook/bg/service.jpg and pantry.jpg were cut from one 2x2 sheet
(sources/cook/backgrounds-sheet.webp, 1672x941), so each is ~830x465 px upscaled to
1600x900: they need redrawing at full size (or an upscale), see build/reports/cook-ui-28sept.md.

  python3 build/bg_quality.py
"""
import glob
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "build"))
import sprites_webp  # noqa: E402

Q = 94
TARGETS = sorted(glob.glob(os.path.join(ROOT, "assets", "backgrounds", "*.webp")) + glob.glob(os.path.join(ROOT, "assets", "clinic", "rooms", "bg-*.webp")))


def source_for(webp):
    stem = os.path.splitext(os.path.basename(webp))[0]
    same = os.path.splitext(webp)[0] + ".png"
    if os.path.exists(same):
        return same
    found = glob.glob(os.path.join(ROOT, "sources", "art", "**", stem + ".png"), recursive=True)
    return found[0] if found else None


def main():
    for dst in TARGETS:
        src = source_for(dst)
        if not src:
            print("no source:", os.path.relpath(dst, ROOT))
            continue
        im = Image.open(src).convert("RGB")
        before = os.path.getsize(dst) // 1024
        im.save(dst, "WEBP", quality=Q, method=6)
        print(f"{os.path.relpath(dst, ROOT)} {im.size[0]}x{im.size[1]} {before} -> {os.path.getsize(dst) // 1024} KB")
    bgdir = os.path.join(ROOT, "assets", "cook", "bg")
    import json

    sp = json.load(open(os.path.join(ROOT, "data", "cook.json")))["art"]["sprites"]
    for view, stem in sp.get("bg", {}).items():
        src = os.path.join(bgdir, stem.replace("-1600", "") + ".png")
        dst = os.path.join(bgdir, stem + ".webp")
        before = os.path.getsize(dst) // 1024
        (sprites_webp.make_hob if view == "hob" else sprites_webp.make_worktop)(src, dst)
        print(f"{os.path.relpath(dst, ROOT)} {before} -> {os.path.getsize(dst) // 1024} KB")


if __name__ == "__main__":
    main()
