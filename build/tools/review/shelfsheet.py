#!/usr/bin/env python3
"""BEFORE/AFTER sheets of chai's shelf from two build/tools/review/shelfshot.mjs runs (the shelf swap, 6 Nov).

  python3 build/tools/review/shelfsheet.py BEFORE_DIR AFTER_DIR OUT_DIR [--sizes 740x320,930x430,1280x665,1920x1080] [--levels 1,2,3,4]

Per size, one sheet: a row per level, the shelf band crop BEFORE (red label) above AFTER (green label), each with its items'
opaque heights on screen (CSS px) under it; crops wider than 1100 px are scaled down to fit (the label says so). Also
lab-740x320-L4.png: the whole play area at 740x320, L4, BEFORE beside AFTER."""
import argparse
import json
import os

from PIL import Image, ImageDraw, ImageFont

RED, GREEN = (190, 30, 30), (20, 130, 50)


def font(sz):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/dejavu/DejaVuSans.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, sz)
    return ImageFont.load_default()


def measures(d):
    try:
        return {(r["size"], r["level"]): r for r in json.load(open(os.path.join(d, "shelf.json")))}
    except OSError:
        return {}


def line(r):
    if not r or not r.get("items"):
        return ""
    return "  ".join("%s%s %s" % (i["id"], " " + i["cls"] if i.get("cls") else "", ("%.0f" % i["cssH"])) for i in r["items"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("before")
    ap.add_argument("after")
    ap.add_argument("out")
    ap.add_argument("--sizes", default="740x320,930x430,1280x665,1920x1080")
    ap.add_argument("--levels", default="1,2,3,4")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    mb, ma = measures(a.before), measures(a.after)
    F, f = font(18), font(13)
    for size in a.sizes.split(","):
        blocks = []
        for lv in a.levels.split(","):
            for tag, d, col, m in (("BEFORE", a.before, RED, mb), ("AFTER", a.after, GREEN, ma)):
                p = os.path.join(d, "shelf-%s-L%s.png" % (size, lv))
                if not os.path.exists(p):
                    continue
                im = Image.open(p).convert("RGB")
                k = min(1.0, 1100 / im.width)
                if k < 1:
                    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
                lab = "%s  %s  L%s%s" % (tag, size, lv, "" if k == 1 else "  (shown at %d%%)" % round(k * 100))
                blocks.append((lab, col, im, "opaque heights, CSS px: " + line(m.get((size, int(lv))))))
        if not blocks:
            continue
        W = max(b[2].width for b in blocks) + 20
        per = max(40, (W - 20) // 8)  # characters per measure line
        wrap = lambda t: [t[i:i + per] for i in range(0, len(t), per)] or [""]
        H = sum(b[2].height + 34 + 16 * len(wrap(b[3])) for b in blocks) + 10
        c = Image.new("RGB", (W, H), "white")
        dr = ImageDraw.Draw(c)
        y = 6
        for lab, col, im, meas in blocks:
            dr.text((10, y), lab, fill=col, font=F)
            c.paste(im, (10, y + 24))
            ls = wrap(meas)
            for i, t in enumerate(ls):
                dr.text((10, y + 26 + im.height + 16 * i), t, fill=(60, 60, 60), font=f)
            y += im.height + 34 + 16 * len(ls)
        c.save(os.path.join(a.out, "sheet-%s.png" % size), optimize=True)
        print("sheet-%s.png" % size, c.size)
    pb, pa = (os.path.join(d, "full-740x320-L4.png") for d in (a.before, a.after))
    if os.path.exists(pb) and os.path.exists(pa):
        b, af = Image.open(pb).convert("RGB"), Image.open(pa).convert("RGB")
        c = Image.new("RGB", (b.width + af.width + 30, b.height + 30), "white")
        dr = ImageDraw.Draw(c)
        dr.text((10, 4), "BEFORE 740x320 L4", fill=RED, font=F)
        dr.text((b.width + 20, 4), "AFTER 740x320 L4", fill=GREEN, font=F)
        c.paste(b, (10, 26))
        c.paste(af, (b.width + 20, 26))
        c.save(os.path.join(a.out, "lab-740x320-L4.png"), optimize=True)
        print("lab-740x320-L4.png", c.size)


if __name__ == "__main__":
    main()
