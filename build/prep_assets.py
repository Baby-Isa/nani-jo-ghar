#!/usr/bin/env python3
"""Downscale sliced game assets for phone-size delivery.

Source: the corrected slice (out2) from the asset-slicing session.
Target: /home/claude/game/assets/, capped to sane max dimensions so the
artifact/zip stays small while still looking sharp at 2x on an 800x450
logical canvas (per the Image Prompt Sheets layout contract).
"""
import os
from PIL import Image

SRC = "/tmp/claude-0/-home-claude/c3f105c0-81df-59cd-8106-67c359e5b821/scratchpad/out2"
DST = "/home/claude/game/assets"

ITEM_MAX = 260      # items render at ~72-85 logical px; 260 covers 2x/3x retina with headroom
CHAR_MAX_H = 700    # characters are tall upper-body sprites
BG_MAX_W = 1600      # backgrounds are 16:9, 1600x900 is 2x the 800x450 logical canvas

def resize_cap(im, max_dim, by="max_side"):
    w, h = im.size
    if by == "max_side":
        scale = min(1.0, max_dim / max(w, h))
    elif by == "height":
        scale = min(1.0, max_dim / h)
    elif by == "width":
        scale = min(1.0, max_dim / w)
    if scale >= 1.0:
        return im
    return im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)

def process_tree(src_root, dst_root, max_dim, by="max_side"):
    n = 0
    for dirpath, dirnames, filenames in os.walk(src_root):
        rel = os.path.relpath(dirpath, src_root)
        out_dir = os.path.join(dst_root, rel) if rel != "." else dst_root
        os.makedirs(out_dir, exist_ok=True)
        for fn in filenames:
            if not fn.lower().endswith(".png"):
                continue
            im = Image.open(os.path.join(dirpath, fn))
            im = resize_cap(im, max_dim, by=by)
            im.save(os.path.join(out_dir, fn), optimize=True)
            n += 1
    return n

n_items = process_tree(os.path.join(SRC, "items"), os.path.join(DST, "items"), ITEM_MAX, by="max_side")
n_chars = process_tree(os.path.join(SRC, "characters"), os.path.join(DST, "characters"), CHAR_MAX_H, by="height")
n_bgs = process_tree(os.path.join(SRC, "backgrounds"), os.path.join(DST, "backgrounds"), BG_MAX_W, by="width")

print(f"items: {n_items} files")
print(f"characters: {n_chars} files")
print(f"backgrounds: {n_bgs} files")

# report total size
total = 0
for dirpath, _, filenames in os.walk(DST):
    for fn in filenames:
        total += os.path.getsize(os.path.join(dirpath, fn))
print(f"total assets size: {total/1024/1024:.1f} MB")
