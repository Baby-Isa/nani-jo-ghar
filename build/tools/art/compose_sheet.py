#!/usr/bin/env python3
"""Assemble a clean character sheet from separately made panels (s08, Zafar 16 Oct: "try improve"): the generator alone
leaves empty boxes, fades the close-up and draws realistic adult hands, so each panel is made on its own and laid out
here in one fixed studio layout: the turnaround (cropped from the generated sheet), the close-up, the hands, the props
(cropped) and colour swatches drawn from their hexes.

    python3 build/tools/art/compose_sheet.py OUT.png --turn SHEET.png x0,y0,x1,y1 --close CLOSE.png --hands HANDS.png
        [--props SHEET.png x0,y0,x1,y1] --swatches "#c88a6f,#1f2d4f,..."
"""
import argparse
from PIL import Image, ImageDraw, ImageFilter

BG = (128, 128, 128)
PANEL = (140, 140, 142)


def card(canvas, img, box, radius=18, contain=False):
    """Fill the box (cover: scale to fill, crop the overflow evenly; contain: fit whole, padded with the image's own
    corner colour), rounded corners."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    k = (min if contain else max)(w / img.width, h / img.height)
    im = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
    if contain:
        layer = Image.new("RGB", (w, h), img.getpixel((4, 4)))
        layer.paste(im, ((w - im.width) // 2, (h - im.height) // 2))
    else:
        l, t = (im.width - w) // 2, (im.height - h) // 2
        layer = im.crop((l, t, l + w, t + h))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    canvas.paste(layer, (x0, y0), mask)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("out")
    ap.add_argument("--turn", nargs=2, required=True)
    ap.add_argument("--close", required=True)
    ap.add_argument("--hands", required=True)
    ap.add_argument("--props", nargs=2)
    ap.add_argument("--swatches", required=True)
    a = ap.parse_args()
    W, H = 2048, 1365
    turn = Image.open(a.turn[0]).convert("RGB").crop(tuple(int(v) for v in a.turn[1].split(",")))
    bg = turn.getpixel((8, 8))
    c = Image.new("RGB", (W, H), tuple(max(0, v - 14) for v in bg))
    card(c, turn, (40, 40, 1400, 900), contain=True)
    card(c, Image.open(a.close).convert("RGB"), (1440, 40, 2008, 900))
    card(c, Image.open(a.hands).convert("RGB").crop((0, 150, 1024, 874)), (40, 940, 1400, 1325), contain=True)
    sw = Image.new("RGB", (568, 385), bg)
    d = ImageDraw.Draw(sw)
    cols = [s.strip() for s in a.swatches.split(",") if s.strip()]
    r = 52
    for i, col in enumerate(cols):
        cx = 85 + (i % 4) * 133
        cy = 110 + (i // 4) * 170
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col, outline=(110, 110, 112), width=2)
    card(c, sw, (1440, 940, 2008, 1325))
    c.save(a.out)
    print("wrote", a.out, c.size)


if __name__ == "__main__":
    main()
