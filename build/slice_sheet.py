#!/usr/bin/env python3
"""Art pipeline step, per the Technical Plan's "Art: sheets to sliced
assets": keys out the sheet's flat magenta (hex FF00FF) background and
crops each grid cell tight to its own content, saving one transparent
PNG per cell. Re-run whenever a new sheet is generated.

Usage: python3 build/slice_sheet.py <sheet.png> <cols> <rows> <out_dir> <name1> <name2> ...
"""
import sys
import os
from PIL import Image


def key_out_magenta(im, tolerance=40):
    im = im.convert("RGBA")
    data = im.getdata()
    key = (255, 0, 255)
    new_data = []
    for r, g, b, a in data:
        if abs(r - key[0]) < tolerance and abs(g - key[1]) < tolerance and abs(b - key[2]) < tolerance:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    im.putdata(new_data)
    return im


def tight_crop(im):
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def main():
    sheet_path, cols, rows, out_dir, *names = sys.argv[1:]
    cols, rows = int(cols), int(rows)
    im = Image.open(sheet_path).convert("RGBA")
    im = key_out_magenta(im)
    w, h = im.size
    cw, ch = w // cols, h // rows
    os.makedirs(out_dir, exist_ok=True)
    i = 0
    for row in range(rows):
        for col in range(cols):
            if i >= len(names):
                break
            cell = im.crop((col * cw, row * ch, (col + 1) * cw, (row + 1) * ch))
            cell = tight_crop(cell)
            out_path = os.path.join(out_dir, f"{names[i]}.png")
            cell.save(out_path)
            print(f"wrote {out_path} {cell.size}")
            i += 1


if __name__ == "__main__":
    main()
