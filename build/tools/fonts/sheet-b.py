#!/usr/bin/env python3
"""Contact sheets for the font sample of 6 Nov (b): sheet.py's layout with the options of options-b.mjs (columns) at each size (rows).

    python3 build/tools/fonts/sheet-b.py --shots build/screenshots/fonts-b [--shots2 build/screenshots/fonts-b2] [--out build/reports/fonts]

Writes <out>/<screen>-2026-11-06b.webp.
"""
import argparse
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(__file__))
import sheet as S  # noqa: E402

S.OPTS = ["A", "L", "F", "G", "T", "S", "R"]
S.NAMES = {"A": "A today", "L": "1 Lora", "F": "2 Fraunces bold + Lora", "G": "3 Lora + Fraunces headline",
           "T": "4 Literata", "S": "5 Source Serif 4", "R": "6 Alegreya"}
S.SIZES = ["740x320", "930x430", "1280x665", "1920x1080"]
SCREENS = [
    ("chai-order", "chai-01-order-card-big", "Chai L1: the order (Nani's line, the order card, Nana's bubble)"),
    ("chai-shelf-L4", "shelf4-01-view-marble", "Chai L4: the shelf pills (ten words)"),
    ("word-moment", "wm-word-moment-lab", "The word moment's cards"),
    ("end-words", "chai-03-results-words", "Chai: the end screen"),
    ("door", "door-lines-and-yes", "The door: Nani's lines, Ha! and Na"),
]


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--shots", required=True)
    a.add_argument("--shots2")
    a.add_argument("--out", default=os.path.join(S.ROOT, "build", "reports", "fonts"))
    a.add_argument("--col", type=int, default=300)
    o = a.parse_args()
    # (the second shooter's sizes merged into the first's folder: same layout, <size>/<option>/<shot>.png)
    if o.shots2 and os.path.isdir(o.shots2):
        for size in os.listdir(o.shots2):
            src = os.path.join(o.shots2, size)
            if os.path.isdir(src):
                for opt in os.listdir(src):
                    d = os.path.join(o.shots, size, opt)
                    os.makedirs(d, exist_ok=True)
                    for f in os.listdir(os.path.join(src, opt)):
                        if not os.path.exists(os.path.join(d, f)):
                            shutil.copy(os.path.join(src, opt, f), d)
    os.makedirs(o.out, exist_ok=True)
    for key, stem, title in SCREENS:
        dest, n = S.sheet(o.shots, o.out, key + "-2026-11-06b", stem, title, o.col)
        print(f"{dest}: {n} shots, {os.path.getsize(dest) // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
