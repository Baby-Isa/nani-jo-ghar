#!/usr/bin/env python3
"""Labelled QA contact sheet: every sprite on a black and on a white
backing side by side (the Art Bible's section 10 rule: a fringe hides on
one and shows on the other), all at one scale so relative sizes read true.

Usage: python3 build/contact_sheet.py <out.png> "<title>" <sprite.png> ... [--scale 0.5] [--cols 4]
       [--ref label=path.png ...]   (extra reference tiles drawn at the same scale, e.g. the hand)
"""
import argparse
import os

from PIL import Image, ImageDraw, ImageFont


def font(size):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
              "/usr/share/fonts/dejavu/DejaVuSans.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("title")
    ap.add_argument("sprites", nargs="+")
    ap.add_argument("--scale", type=float, default=0.5)
    ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--ref", action="append", default=[])
    args = ap.parse_args()

    items = [(os.path.splitext(os.path.basename(p))[0], p) for p in args.sprites]
    items += [tuple(r.split("=", 1)) for r in args.ref]
    ims = []
    for label, p in items:
        im = Image.open(p).convert("RGBA")
        w, h = im.size
        ims.append((label, f"{w}x{h}", im.resize((max(1, round(w * args.scale)), max(1, round(h * args.scale))), Image.LANCZOS)))
    tw = max(i.size[0] for _, _, i in ims)
    th = max(i.size[1] for _, _, i in ims)
    lab_h, gap, head = 34, 10, 44
    cell_w, cell_h = 2 * tw + 3 * gap, th + lab_h + 2 * gap
    rows = -(-len(ims) // args.cols)
    W, H = args.cols * cell_w + gap, head + rows * cell_h + gap
    sheet = Image.new("RGB", (W, H), (60, 60, 60))
    d = ImageDraw.Draw(sheet)
    d.text((gap, 10), f"{args.title}   (all tiles at {args.scale:g}x, black | white backing)",
           fill="white", font=font(22))
    f = font(14)
    for n, (label, dims, im) in enumerate(ims):
        r, c = divmod(n, args.cols)
        x, y = gap + c * cell_w, head + r * cell_h
        for k, bgc in enumerate(((0, 0, 0), (255, 255, 255))):
            bx = x + k * (tw + gap)
            tile = Image.new("RGB", (tw, th), bgc)
            tile.paste(im, ((tw - im.size[0]) // 2, (th - im.size[1]) // 2), im)
            sheet.paste(tile, (bx, y))
        d.text((x, y + th + 4), label, fill="white", font=f)
        d.text((x, y + th + 19), dims, fill=(190, 190, 190), font=f)
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    sheet.save(args.out, optimize=True)
    print(f"wrote {args.out} {W}x{H}")


if __name__ == "__main__":
    main()
