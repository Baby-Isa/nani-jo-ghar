#!/usr/bin/env python3
"""The type sizes per surface, size and option, from shoot.mjs's inventories (fonts across the game, 6 Nov).

    python3 build/tools/fonts/sizes.py [--shots build/screenshots/fonts] [--md]

Prints, per surface, the font the browser drew it in and its smallest size (CSS px) at each screen size, for option A (today), then
the Kutchi words' smallest size per option (the faces' widths move the fitted sizes: the shelf pills, the fitted headlines).
"""
import argparse
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SIZES = ["740x320", "971x318", "930x430", "1280x665", "1920x1080"]
OPTS = ["A", "B", "C", "D"]
# (surface, role, who reads it, a test on (screen, state, row))
SURF = [
    ("Shelf pills (drawn)", "Kutchi word to learn", "child", lambda s, r: r["kind"] == "canvas" and "25px 800" in r["sel"] and s.startswith(("chai", "shelf4"))),
    ("Nana's bubble (play area)", "Kutchi line", "child", lambda s, r: "wp-text" in r["sel"] or ("wp " in r["sel"] and "wp-en" not in r["sel"])),
    ("Big item card: word", "Kutchi word to learn", "child", lambda s, r: s.endswith("order-card-big") and "wc-k" in r["sel"] and r["px"] > 20),
    ("Big item card: English", "English (supported word)", "child + grown-up", lambda s, r: s.endswith("order-card-big") and "wc-en" in r["sel"] and r["px"] > 13),
    ("Order card: headline", "Kutchi line", "child", lambda s, r: "oc-headline" in r["sel"]),
    ("Order card: item card word", "Kutchi word to learn", "child", lambda s, r: "wc-k" in r["sel"] and not s.endswith("order-card-big") and not s.startswith("wm") and r["px"] < 20),
    ("Order card: item card English", "English (supported word)", "child + grown-up", lambda s, r: "wc-en" in r["sel"] and not s.endswith("order-card-big") and not s.startswith("wm") and r["px"] < 13),
    ("Nani's box (guide line)", "Kutchi line or its grey English", "child (grown-up for grey)", lambda s, r: "ng-line" in r["sel"] or "ng-say" in r["sel"]),
    ("Word moment: card word", "Kutchi word to learn", "child", lambda s, r: s.startswith("wm") and "wc-k" in r["sel"]),
    ("Word moment: card English", "English (supported word)", "child + grown-up", lambda s, r: s.startswith("wm") and "wc-en" in r["sel"]),
    ("End screen: word review, Kutchi", "Kutchi word (review)", "grown-up with child", lambda s, r: "rs-word" in r["sel"] and r["sel"].endswith("b.fit")),
    ("End screen: word review, English", "grown-ups' English", "grown-up", lambda s, r: "rs-en" in r["sel"]),
    ("Door: Nani's line", "Kutchi line", "child", lambda s, r: s.startswith("door") and "day-say" in r["sel"] and "day-k" in r["sel"]),
    ("Door: English under her line", "English under Nani's line", "grown-up (and child)", lambda s, r: s.startswith("door") and "day-en" in r["sel"]),
    ("Door: activity card word", "Kutchi word to learn", "child", lambda s, r: s.startswith("door") and "day-wline" in r["sel"] and "to-record" not in r["sel"]),
    ("Door: Ha! / Na", "Kutchi word (answer)", "child", lambda s, r: s.startswith("door") and "day-yes-word" in r["sel"]),
    ("Clinic: order card word", "Kutchi word to learn", "child", lambda s, r: s.startswith("clinic") and ".ku" in r["sel"]),
    ("Clinic: grey to-record lines", "Kutchi line, not yet recorded", "grown-up", lambda s, r: s.startswith("clinic") and "njg-ph" in r["sel"]),
]


def load(shots, size, opt):
    p = os.path.join(shots, f"inventory-{size}-{opt}.json")
    if not os.path.exists(p):
        return []
    out = []
    for st in json.load(open(p)):
        key = f"{st['screen']}-{st['state']}"
        for r in st["rows"]:
            out.append((key, r))
    return out


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--shots", default=os.path.join(ROOT, "build", "screenshots", "fonts"))
    o = a.parse_args()
    inv = {(s, p): load(o.shots, s, p) for s in SIZES for p in OPTS}
    print("| Surface | Role | Reader | Face today | " + " | ".join(SIZES) + " |")
    print("|---|---|---|---|" + "---|" * len(SIZES))
    for name, role, who, test in SURF:
        faces, cells = set(), []
        for s in SIZES:
            rows = [r for k, r in inv[(s, "A")] if test(k, r)]
            faces |= {f"{r['face']} {re.sub(r'[^0-9]', '', str(r['weight'])) or r['weight']}{' italic' if r.get('style') == 'italic' else ''}" for r in rows}
            cells.append(f"{min(r['px'] for r in rows):g}" if rows else "-")
        print(f"| {name} | {role} | {who} | {', '.join(sorted(faces)) or '-'} | " + " | ".join(cells) + " |")
    print()
    print("Kutchi words per option: the smallest size (CSS px), and its x-height in px (size x the face's x-height)")
    XH = {"Fraunces": 0.478, "Nunito": 0.499, "Baloo 2": 0.493, "Andika": 0.498}
    print("| Surface | Size | " + " | ".join(OPTS) + " |")
    print("|---|---|" + "---|" * len(OPTS))
    for name, role, who, test in SURF:
        if "Kutchi" not in role:
            continue
        for s in ["740x320", "971x318", "1920x1080"]:
            cells = []
            for p in OPTS:
                rows = [r for k, r in inv[(s, p)] if test(k, r)]
                if not rows:
                    cells.append("-")
                    continue
                r = min(rows, key=lambda r: r["px"])
                xh = XH.get(r["face"], 0.5) * r["px"]
                cells.append(f"{r['px']:g} {r['face'].split()[0]} (x {xh:.1f})")
            print(f"| {name} | {s} | " + " | ".join(cells) + " |")


if __name__ == "__main__":
    main()
