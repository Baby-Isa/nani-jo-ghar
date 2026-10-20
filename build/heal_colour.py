#!/usr/bin/env python3
"""The colour class of a picture (s08-w5b, CLN-189): what a child would call its colour.

  python3 build/heal_colour.py <picture> ...   prints one JSON line per picture: {file, class, hue, sat, val, coloured}

Its opaque pixels in HSV; the "coloured" ones (saturation and value over 0.25); under a quarter coloured is white
(a pale thing: garlic, milk); else the median hue names it: red under 15 or over 345 degrees, purple 270-345, orange
or brown 15-42 (orange when vivid: saturation over 0.62 and value over 0.78), yellow 42-70, green 70-170, blue 170-270.
Read by build/test_shared_heal_chart.mjs (each eye-chart picture's colour matches its word).
"""
import colorsys
import json
import sys

from PIL import Image


def colour(path):
    im = Image.open(path).convert("RGBA")
    im.thumbnail((160, 160))
    px = [p for p in getattr(im, "get_flattened_data", im.getdata)() if p[3] > 200]
    hsv = [colorsys.rgb_to_hsv(r / 255, g / 255, b / 255) for r, g, b, _ in px]
    col = [c for c in hsv if c[1] > 0.25 and c[2] > 0.25]
    share = len(col) / max(1, len(hsv))
    med = lambda xs: sorted(xs)[len(xs) // 2] if xs else 0
    if share < 0.25:
        return {"class": "white", "hue": None, "sat": round(med([c[1] for c in hsv]), 3), "val": round(med([c[2] for c in hsv]), 3), "coloured": round(share, 3)}
    # hues round the circle: the reds either side of 0 are one group (shifted by +30 before the median)
    hue = (med([((c[0] * 360) + 30) % 360 for c in col]) - 30) % 360
    sat = med([c[1] for c in col])
    val = med([c[2] for c in col])
    if hue < 15 or hue >= 345:
        k = "red"
    elif hue >= 270:
        k = "purple"
    elif hue < 42:
        k = "orange" if sat > 0.62 and val > 0.78 else "brown"
    elif hue < 70:
        k = "yellow"
    elif hue < 170:
        k = "green"
    else:
        k = "blue"
    return {"class": k, "hue": round(hue, 1), "sat": round(sat, 3), "val": round(val, 3), "coloured": round(share, 3)}


if __name__ == "__main__":
    for f in sys.argv[1:]:
        print(json.dumps(dict(file=f, **colour(f))))
