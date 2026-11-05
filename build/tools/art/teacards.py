"""The half and full item-card pictures (and the word moment's levels) from the one steady glass (Zafar, 5 Nov: "more obviously show
half and full ... we need that bigger difference shown on item cards, and we also need non-milk tea versions as item cards").

The empty glass (pack s17-wm2's WE) and a full one lined up with it to the pixel: WR (chai to the rim) and WB (plain tea to the rim,
pack s17-art4) when they have landed, else WF (pack s17-wm2's chai, just below the rim). The full picture is shown below a level over
the empty one, as the word moment draws it, so each card is the same glass the child saw poured.

  python3 build/tools/art/teacards.py            # writes assets/shared/word-moment/card-{half,full}-{chai,tea}-s17.webp
"""
import json
import os
import sys

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
A = os.path.join(ROOT, "assets", "shared", "word-moment")
HALF = 0.42  # (Zafar, 5 Nov: "half should be a little lower than current end height": the word moment's half, of the inside)
H_OUT = 360  # the card picture's height (the item card shows it about 120-200 px tall)


def load(name):
    p = os.path.join(A, name)
    return Image.open(p).convert("RGBA") if os.path.exists(p) else None


def tea_of(name):
    cut = json.load(open(os.path.join(A, "cut-data.json")))
    props = cut.get("props", {})
    t = (props.get(name) or {}).get("tea") or props["glass-wf-s17"]["tea"]
    return t


def at_level(empty, full, tea, lv):
    """The full picture below the level (0..1 of the inside's height), over the empty one."""
    w, h = empty.size
    y = int(round((tea["bottom"] - (tea["bottom"] - tea["top"]) * lv) * h))
    out = empty.copy()
    if lv > 0:
        part = full.crop((0, y, w, h))
        out.alpha_composite(part, (0, y))
    return out


def card(im):
    bb = im.getbbox()
    im = im.crop(bb)
    k = H_OUT / im.height
    return im.resize((max(1, round(im.width * k)), H_OUT), Image.LANCZOS)


def main():
    empty = load("glass-e2-s17.webp") or load("glass-we-s17.webp")
    if empty is None:
        sys.exit("no empty glass")
    made = []
    for kind, names in (("chai", ["glass-wr-s17.webp"]), ("tea", ["glass-wb-s17.webp"])):
        full = next((load(n) for n in names if load(n) is not None), None)
        if full is None:
            print(f"{kind}: no full picture yet ({', '.join(names)}): skipped")
            continue
        src = next(n for n in names if load(n) is not None)
        tea = tea_of("glass-wr-s17")  # (wr and wb share one box and one inside: cut_s17_art4.py)
        for lvl, lv in (("half", HALF), ("full", 1.0)):
            out = os.path.join(A, f"card-{lvl}-{kind}-s17.webp")
            card(at_level(empty, full, tea, lv)).save(out, "WEBP", quality=90, method=6)
            made.append(f"{os.path.relpath(out, ROOT)} (from {src})")
    print("\n".join(made))


if __name__ == "__main__":
    main()
