#!/usr/bin/env python3
"""Hands v3 sheets (26 Sept 2026).

    python3 build/hand_v3_sheets.py contact      # build/contact-sheets/hands-v3-<set>.png, verdict under each image
    python3 build/hand_v3_sheets.py review       # build/contact-sheets/hands-v3-review-*.png, before/after jewellery close-ups

Contact sheets read build/reports/data/hands-v3-qa.json ("after" verdicts):
a green PASS or a red FAIL tag under each image, with the reason's first
words. Review sheets put the v2 skins (from git, commit BEFORE) next to the
v3 ones, cropped round each ring and wrist anchor at the same place and scale.
"""
import io
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402
import skin_hands as sh  # noqa: E402

GAME = ga.GAME
QA = os.path.join(GAME, "build", "reports", "data", "hands-v3-qa.json")
SHEETS = os.path.join(GAME, "build", "contact-sheets")
BEFORE = "3cf61a6"  # the v2 state at the start of v3
H = "assets/characters/hands"
BG = (118, 128, 138, 255)


def _font(size):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def _on_bg(im):
    bg = Image.new("RGBA", im.size, BG)
    bg.alpha_composite(im.convert("RGBA"))
    return bg


def contact(set_name, prefix, cols=6, tile=300):
    qa = json.load(open(QA))["after"]["files"]
    files = sorted(p for p in qa if p.startswith(prefix))
    rows = (len(files) + cols - 1) // cols
    lab_h = 46
    sheet = Image.new("RGB", (cols * tile, rows * (tile + lab_h)), (34, 34, 34))
    d = ImageDraw.Draw(sheet)
    f1, f2 = _font(15), _font(11)
    for i, p in enumerate(files):
        v = qa[p]
        im = Image.open(os.path.join(GAME, p)).convert("RGBA")
        z = (tile - 8) / max(im.size)
        im = _on_bg(im.resize((max(1, round(im.width * z)), max(1, round(im.height * z))), Image.LANCZOS))
        x, y = (i % cols) * tile, (i // cols) * (tile + lab_h)
        cell = Image.new("RGBA", (tile, tile), BG)
        cell.paste(im, ((tile - im.width) // 2, tile - im.height))
        sheet.paste(cell.convert("RGB"), (x, y))
        ok = v["verdict"] == "PASS"
        col = (60, 170, 90) if ok else (205, 60, 60)
        d.rectangle([x, y + tile, x + tile - 2, y + tile + lab_h - 2], fill=(24, 24, 24))
        d.rectangle([x + 4, y + tile + 5, x + 58, y + tile + 23], fill=col)
        d.text((x + 9, y + tile + 6), v["verdict"], fill=(255, 255, 255), font=f1)
        name = os.path.basename(p).rsplit(".", 1)[0].replace("hand-", "")
        d.text((x + 64, y + tile + 7), name[:34], fill=(235, 235, 235), font=f2)
        d.text((x + 6, y + tile + 28), v["reason"][:52], fill=(190, 190, 190), font=f2)
    out = os.path.join(SHEETS, f"hands-v3-{set_name}.png")
    sheet.save(out)
    return out


def _git_image(path):
    blob = subprocess.run(["git", "show", f"{BEFORE}:{path}"], cwd=GAME, capture_output=True).stdout
    return Image.open(io.BytesIO(blob)).convert("RGBA") if blob else None


def _crop(im, x, y, half, out):
    c = _on_bg(im).crop((int(x - half), int(y - half), int(x + half), int(y + half)))
    return c.resize((out, out), Image.LANCZOS).convert("RGB")


def review(name, title, entries, tile=300):
    """entries: [(label, char, pose, suffix, anchor kind 'ring'|'wrist', hand index)]"""
    anchors = sh.load_anchors()
    rows = len(entries)
    head = 70
    W, Hh = 2 * tile + 3 * 14 + 260, head + rows * (tile + 14) + 10
    sheet = Image.new("RGB", (W, Hh), (30, 30, 30))
    d = ImageDraw.Draw(sheet)
    d.text((14, 12), title, fill=(255, 255, 255), font=_font(20))
    d.text((14, 42), "left: v2 (before)     right: v3 (after), same crop and scale", fill=(190, 190, 190), font=_font(13))
    for r, (label, char, pose, suf, kind, hi) in enumerate(entries):
        a = anchors[pose]
        hands = a["hands"]
        if suf == "-left":
            hands = sh.mirror_hands(hands, a["size"][0])
        h = hands[hi]
        anc = (h.get("ring") if kind == "ring" else (h.get("bracelet") or h.get("wrist")))
        half = anc["width_px"] * (1.3 if kind == "ring" else 0.85)
        path = f"{H}/skins/{char}/{pose}{suf}.webp"
        before = _git_image(path)
        after = Image.open(os.path.join(GAME, path)).convert("RGBA")
        y = head + r * (tile + 14)
        for j, im in enumerate((before, after)):
            if im is not None:
                sheet.paste(_crop(im, anc["x"], anc["y"], half, tile), (14 + j * (tile + 14), y))
        d.text((2 * tile + 3 * 14, y + 10), label, fill=(240, 240, 240), font=_font(15))
        d.text((2 * tile + 3 * 14, y + 34), pose.replace("hand-", "") + suf, fill=(170, 170, 170), font=_font(12))
    out = os.path.join(SHEETS, f"hands-v3-review-{name}.png")
    sheet.save(out)
    return out


REVIEWS = [
    ("nani-right", "Nani, right hand: red aqiq ring and diamond tennis bracelet", [
        ("aqiq ring, back of hand", "nani", "hand-a1-flat-palm-t", "", "ring", 0),
        ("tennis bracelet, top-down", "nani", "hand-a1-flat-palm-t", "", "wrist", 0),
        ("aqiq ring, eye level", "nani", "hand-e3-count-5-e", "", "ring", 0),
        ("tennis bracelet, eye level", "nani", "hand-e3-count-5-e", "", "wrist", 0),
        ("ring band, palm up", "nani", "hand-a3-palm-up-e", "", "ring", 0),
        ("bracelet, palm-side wrist", "nani", "hand-a3-palm-up-e", "", "wrist", 0),
        ("aqiq on a curled finger", "nani", "hand-e3-count-2-e", "", "ring", 0),
    ]),
    ("nani-left", "Nani, left hand: round solitaire diamond; hand re-lit from the upper left", [
        ("solitaire, back of hand", "nani", "hand-a1-flat-palm-t", "-left", "ring", 0),
        ("solitaire, eye level", "nani", "hand-e3-count-5-e", "-left", "ring", 0),
        ("solitaire, wave", "nani", "hand-a5-wave-f1-e", "-left", "ring", 0),
        ("solitaire, reach", "nani", "hand-a4-reach-e", "-left", "ring", 0),
        ("band, palm up", "nani", "hand-a3-palm-up-t", "-left", "ring", 0),
        ("solitaire, fist", "nani", "hand-d4-squeeze-f2-tight-t", "-left", "ring", 0),
    ]),
    ("girl-bangles", "Player girl: red and green glass bangles and a gold bangle, each wrist", [
        ("top-down, back of hand", "player-girl", "hand-a1-flat-palm-t", "", "wrist", 0),
        ("eye level, back of hand", "player-girl", "hand-e3-count-5-e", "", "wrist", 0),
        ("eye level, palm up", "player-girl", "hand-a3-palm-up-e", "", "wrist", 0),
        ("wrist turned, reach", "player-girl", "hand-a7-hand-on-heart-e", "", "wrist", 0),
        ("two hands, left wrist", "player-girl", "hand-e4-clap-f1-apart-e", "", "wrist", 0),
        ("fist, top-down", "player-girl", "hand-d4-squeeze-f2-tight-t", "", "wrist", 0),
    ]),
]


def main():
    cmd = sys.argv[1]
    if cmd == "contact":
        for set_name, prefix in (("masters", f"{H}/master/"), ("player-boy", f"{H}/skins/player-boy/"),
                                 ("player-girl", f"{H}/skins/player-girl/"), ("nani", f"{H}/skins/nani/")):
            print(contact(set_name, prefix))
    elif cmd == "review":
        for name, title, entries in REVIEWS:
            print(review(name, title, entries))


if __name__ == "__main__":
    main()
