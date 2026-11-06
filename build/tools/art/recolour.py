#!/usr/bin/env python3
"""The sky-blue hue pull (the strict review's decision 3, Fable's redo programme step 2): the generator's bright sky blue on
the listed toothbrush and plaster pictures is pulled to Wada's Olympic Blue (#5a82b3), in post, keeping each picture's
shading. Never the skies (they are redrawn: the sky block). Each picture is written as a new `-v2` file beside the old one,
never over it; nothing is wired (the swap is a build session's, after Zafar's yes on the sheet).

  python3 build/tools/art/recolour.py --find                        # the toothbrush and plaster pictures with sky blue, by share
  python3 build/tools/art/recolour.py                               # pull the LIST below; write <name>-v2.webp beside each
  python3 build/tools/art/recolour.py --sheet build/reports/art/recolour-sky-blue-2026-11-06.jpg   # and a before/after sheet

How: the sky blue is the opaque pixels whose CIE Lab hue is within HUE (degrees) and chroma over MIN_C, faded out over EDGE
degrees at the window's ends (so a white bristle or a cream pad is untouched). Their share-weighted mean (lightness, chroma,
hue) is moved to Olympic Blue's: the hue by the whole difference, the chroma by its ratio, the lightness by PULL_L of the
difference (a pixel's shading relative to the mean is kept). Then artcolour.py's palette rule reads the result."""
import argparse
import fnmatch
import glob
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import artcolour as A  # noqa: E402

OLYMPIC = A.lab(A.rgb_of_hex("#5a82b3"))
HUE = (205.0, 290.0)
EDGE = 12.0
MIN_C = 18.0
PULL_L = 0.8
# The listed pictures (the strict review's exceptions and FAILs that are the sky blue on a toothbrush or a plaster, and the
# toothbrush and brushing sheets beside them; --find lists the candidates and their share of sky blue). Not here: the toothbrush
# sheet's belt, paste, side and use-up views (baked shadow or light: redrawn in the clinic block, s17-clinic-redo TB02) and the
# plasters in the book's deeper Blue (they pass).
LIST = [
    "assets/clinic/items-s08b/toothbrush-s08b.webp",
    "assets/clinic/s11/toothbrush-s11.webp",
    "assets/clinic/sheets/brushing/brushing-down.webp",
    "assets/clinic/sheets/brushing/brushing-down-paste.webp",
    "assets/clinic/sheets/brushing/brushing-level.webp",
    "assets/clinic/sheets/brushing/brushing-level-paste.webp",
    "assets/clinic/sheets/brushing/brushing-up.webp",
    "assets/clinic/sheets/brushing/brushing-up-paste.webp",
    "assets/clinic/items-v2/toothbrush.webp",
    "assets/clinic/sheets/toothbrush/toothbrush-tool.webp",
    "assets/clinic/sheets/toothbrush/toothbrush-tray.webp",
    "assets/clinic/sheets/toothbrush/toothbrush-use.webp",
    "assets/clinic/sheets/toothbrush/toothbrush-use-down.webp",
    "assets/clinic/rough/items/plaster-blue.webp",
]
CANDIDATES = ["assets/clinic/**/*toothbrush*", "assets/clinic/**/*brushing*", "assets/clinic/**/*plaster*"]


def mask_of(Lab, alpha):
    C = np.hypot(Lab[..., 1], Lab[..., 2])
    h = np.degrees(np.arctan2(Lab[..., 2], Lab[..., 1])) % 360
    w = np.clip(np.minimum(h - HUE[0], HUE[1] - h) / EDGE, 0, 1) * np.clip((C - MIN_C) / 6.0, 0, 1)
    return w * (alpha > 0.05), C, h


def pull(rgb, alpha):
    """The pulled RGB (0..255) and the sky-blue share of the piece."""
    Lab = A.lab(rgb)
    w, C, h = mask_of(Lab, alpha)
    share = float(w.sum() / max(1.0, (alpha > 0.05).sum()))
    if w.sum() < 20:
        return rgb, share
    ww = w / w.sum()
    mL, mC = float((Lab[..., 0] * ww).sum()), float((C * ww).sum())
    mh = float(np.degrees(np.arctan2((np.sin(np.radians(h)) * ww).sum(), (np.cos(np.radians(h)) * ww).sum())) % 360)
    tL, tC = float(OLYMPIC[0]), float(np.hypot(OLYMPIC[1], OLYMPIC[2]))
    th = float(np.degrees(np.arctan2(OLYMPIC[2], OLYMPIC[1])) % 360)
    nL = Lab[..., 0] + PULL_L * (tL - mL)
    nC = C * (tC / max(mC, 1e-6))
    nh = np.radians(h + (th - mh))
    new = np.stack([nL, nC * np.cos(nh), nC * np.sin(nh)], -1)
    out = Lab * (1 - w[..., None]) + new * w[..., None]
    return A.lab_to_rgb(out), share


def v2_path(p):
    b, e = os.path.splitext(p)
    return b + "-v2" + e


def run(paths, sheet=None):
    rows = []
    for rel in paths:
        src = os.path.join(A.REPO, rel)
        im = Image.open(src).convert("RGBA")
        a = np.asarray(im, np.float64)
        rgb, alpha = a[..., :3], a[..., 3] / 255.0
        out, share = pull(rgb, alpha)
        res = Image.fromarray(np.dstack([np.clip(out, 0, 255), a[..., 3]]).astype(np.uint8), "RGBA")
        dst = v2_path(src)
        if os.path.exists(dst):
            print("exists, kept: %s" % os.path.relpath(dst, A.REPO))
        else:
            res.save(dst, **({"quality": 92, "method": 6} if dst.endswith(".webp") else {}))
            print("wrote %s (sky blue %.0f%% of the piece)" % (os.path.relpath(dst, A.REPO), share * 100))
        before, after = A.analyse(src), A.analyse(dst)
        rows.append((rel, im, Image.open(dst).convert("RGBA"), A.level(before), A.level(after), after.get("palette", {})))
    if sheet:
        tw, th = 260, 200
        S = Image.new("RGB", (tw * 2 + 340, (th + 10) * len(rows) + 50), (247, 244, 238))
        d = ImageDraw.Draw(S)
        d.text((10, 12), "Sky blue pulled to Olympic Blue (#5a82b3): before | after (-v2, not wired)", fill=(30, 30, 30), font=A.font(18))
        for k, (rel, b, a2, lb, la, pf) in enumerate(rows):
            y = 50 + k * (th + 10)
            for j, im in enumerate((b, a2)):
                t = im.copy()
                t.thumbnail((tw - 10, th - 10))
                bg = Image.new("RGB", (tw - 10, th - 10), (200, 200, 200))
                bg.paste(t, ((tw - 10 - t.width) // 2, (th - 10 - t.height) // 2), t)
                S.paste(bg, (10 + j * tw, y))
            d.text((2 * tw + 20, y + 10), rel.replace("assets/clinic/", "")[:44], fill=(30, 30, 30), font=A.font(14))
            d.text((2 * tw + 20, y + 34), "before %s, after %s" % (lb, la), fill=(80, 80, 80), font=A.font(14))
            main = ", ".join("%s %s" % (m["hex"], m["nearest"]) for m in pf.get("main", [])[:3])
            d.text((2 * tw + 20, y + 56), main[:48], fill=(110, 110, 110), font=A.font(12))
        S.save(sheet, quality=85)
        print("sheet: %s" % sheet)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], epilog=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--find", action="store_true", help="list the toothbrush and plaster pictures and their share of sky blue, and stop")
    ap.add_argument("--sheet", help="write a before/after contact sheet here")
    a = ap.parse_args(argv)
    if a.find:
        seen = set()
        for g in CANDIDATES:
            for p in sorted(glob.glob(os.path.join(A.REPO, g), recursive=True)):
                rel = os.path.relpath(p, A.REPO)
                if rel in seen or not p.lower().endswith((".webp", ".png")) or "-v2." in rel or "@2x" in rel:
                    continue
                seen.add(rel)
                im = np.asarray(Image.open(p).convert("RGBA"), np.float64)
                w, _, _ = mask_of(A.lab(im[..., :3]), im[..., 3] / 255.0)
                share = w.sum() / max(1.0, (im[..., 3] > 12).sum())
                if share > 0.02:
                    print("%5.1f%%  %s%s" % (share * 100, rel, "  (listed)" if rel in LIST else ""))
        return 0
    run(LIST, a.sheet)
    return 0


if __name__ == "__main__":
    sys.exit(main())
