#!/usr/bin/env python3
"""Writes assets/cook/items/v3/README.md from each group's meta.json (run after build/cut_cook_v3.py)."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V3 = os.path.join(ROOT, "assets", "cook", "items", "v3")

GROUPS = [
    ("hob", "H1-H6", "**Wired** into `Cook.Kit` (js/cook/kitchen-kit.js `HOBS`): every station's hob, knobs.", {
        "hob-1": "1 burner, portrait (maani, daar, samosa fry; chai with 1 person)",
        "hob-2": "2 burners (chai, 2 people)", "hob-3": "3 burners (chai, 3 people)", "hob-4": "4 burners (chai, 4 people)",
        "hob-wide": "one big burner on a landscape hob, for a big karahi (`Cook.Kit.hob(S, {wide: true})`, `Kit.art(1, [...], {wide: true})`); not used by a station yet",
        "knob-off": "the knob, off (grip bar horizontal)", "knob-on": "the knob, on: the same knob, bar vertical, warm glow (the kit turns it a quarter)",
        "hob-4-v2": "v3.1 R1: 4 burners at H1's burner size (replaces hob-4)", "knob-off-v2": "v3.1 R2: the knob, off",
        "knob-on-v2": "v3.1 R2: on, with a strong wide glow (fades out before the canvas edge)"}),
    ("chai", "C1", "Not wired: for the chai session. One registered canvas (the pan's rim centre lines up in all nine).", {
        "pan-empty": "empty", "pan-water": "clear water", "pan-leaves": "water + tea leaves turning amber", "pan-tea": "black tea",
        "pan-milky": "milky chai", "pan-spiced": "milky chai with cardamom and ginger", "pan-boil-tea": "black tea, rolling boil",
        "pan-boil-milky": "milky chai, rolling boil with froth", "pan-foam": "milky chai foaming to the rim (boil-over warning)"}),
    ("maani", "M1-M5", "Not wired: for the maani session. The maani discs share one registered canvas.", {
        "dough-pile-wheat": "a loose pile of wheat dough balls, for the shelf (Q14: no tray)", "dough-pile-millet": "the millet (bajr) pile",
        "dough-ball-wheat": "one wheat ball (the same scale as the pile's balls on the sheet)", "dough-ball-millet": "one millet ball",
        "chakla": "the rolling board, dark walnut", "velan": "the rolling pin, dark walnut",
        "maani-wheat-raw": "wheat, raw", "maani-wheat-half": "wheat, half-cooked", "maani-wheat-cooked": "wheat, cooked (flat)", "maani-wheat-burnt": "wheat, burnt",
        "maani-millet-raw": "millet, raw", "maani-millet-half": "millet, half-cooked", "maani-millet-cooked": "millet, cooked", "maani-millet-burnt": "millet, burnt",
        "tawa": "the tawa, handle at right (hi-res)", "turner": "the flat wooden turner (Q15)"}),
    ("daar", "D1-D2", "Not wired: for the daar session. The nine pots share one registered canvas.", {
        "pot-empty": "empty", "pot-oil": "hot oil", "pot-seeds": "oil + mustard and cumin popping", "pot-onion": "+ onion frying",
        "pot-tomato": "+ tomato", "pot-chilli": "+ green chilli", "pot-daar": "cooked daar", "pot-tadka": "daar with the tadka on top", "pot-stir": "daar mid-stir (a swirl)",
        "ladle": "the ladle, cut out of the small pot ChatGPT stood it in (hand-drawn outline: the bowl's circle, the handle, the hole)",
        "daar-bowl-trivet": "a served bowl of daar on a woven trivet", "veg-bowl": "a steel bowl of chopped onion, tomato and chilli",
        "pot-tomato-only": "v3.1 R4: seeds + tomato, no onion (on D1's pot canvas)", "pot-chilli-only": "v3.1 R4: seeds + green chilli, no onion",
        "pot-onion-chilli": "v3.1 R4: onion + chilli, no tomato", "pot-tomato-chilli": "v3.1 R4: tomato + chilli, no onion",
        "pot-tadka-v2": "v3.1 R4: daar with a mustard and cumin tadka only (no dry chilli, no curry leaves)",
        "daar-bowl-trivet-plain": "v3.1 R4: the trivet bowl of plain daar (waits to be poured)",
        "ladle-v2": "v3.1 R3: a deep steel dipper, three-quarter on (bowl: the biggest circle inside it)",
        "chop-heap-onion": "v3.1 R5: a heap of chopped red onion (daar's chop piles)", "chop-heap-tomato": "v3.1 R5: chopped tomato",
        "chop-heap-chilli": "v3.1 R5: sliced green chilli rings (also samosa's chilli heap)", "chop-piece-onion": "v3.1 R5: one piece of onion (the heaps' scale)",
        "chop-piece-tomato": "v3.1 R5: one piece of tomato", "chop-piece-chilli": "v3.1 R5: one chilli ring",
        "dial-stopped": "v3.1 R8: flat cream icon, stopped (a ladle and pause bars)", "dial-slow": "v3.1 R8: slow (a tortoise)",
        "dial-fast": "v3.1 R8: fast (a hare)", "dial-spill": "v3.1 R8: too fast (a splash)"}),
    ("chaat", "T1-T2", "Not wired: for the chaat session. Side-on glass (Q2b), cut see-through: colour-to-alpha all over, solid only where strongly coloured. The pots share one canvas, registered on the pot's bottom-centre.", {
        "bowl-side": "the empty glass serving bowl, side-on", "pot-chana": "chickpeas", "pot-potato": "boiled potato cubes", "pot-onion": "chopped red onion",
        "pot-chilli": "chopped green chilli", "pot-sev": "sev", "pot-dahi": "yoghurt", "pot-imli": "tamarind chutney", "pot-chutney": "green chutney", "pot-dhania": "chopped coriander"}),
    ("samosa", "S1-S5", "Not wired: for the samosa session. The fold stages share one canvas, registered on the strip's right end (it stays put while the left end folds).", {
        "fold-1": "the flat strip", "fold-2": "the first fold: a triangle hiding the filling (Q3)", "fold-3": "folded again", "fold-4": "folded again",
        "fold-5": "the last tail folding over", "fold-6": "the finished raw samosa",
        "board": "the house board, dark walnut (fill, chop, thread)", "karahi": "the karahi of oil, open loop handles", "plate": "the paper-lined enamel plate",
        "jharo": "the slotted spoon (open holes)",
        "fill-chundo": "spiced mince heap", "fill-potato": "potato cubes", "fill-onion": "chopped onion", "fill-chilli": "chopped chilli",
        "fill-dhania": "chopped coriander", "fill-peas": "peas", "fill-carrot": "grated carrot", "fill-cabbage": "cooked cabbage"}),
    ("sekelo", "K1-K5", "Not wired: for the sekelo session. The racks share one canvas (registered on the rack's left end and lower rail); the plates one canvas (on the plate's rim).", {
        "rack-0": "the rack, empty", "rack-1": "1 skewer", "rack-2": "2 skewers", "rack-3": "3 skewers", "rack-4": "4 skewers",
        "plate-1": "plate, 1 skewer (handles off the plate)", "plate-2": "2 skewers", "plate-3": "3 skewers", "plate-4": "4 skewers",
        "grill": "the charcoal grill with two bars", "meat-raw": "mishkaki, raw", "meat-grilled": "grilled", "meat-charred": "charred",
        "onion-raw": "onion chunk, raw", "onion-grilled": "grilled", "tomato-raw": "tomato chunk, raw", "tomato-grilled": "grilled",
        "pepper-raw": "pepper chunk, raw", "pepper-grilled": "grilled", "heap-meat": "a heap of raw meat cubes (shelf)",
        "heap-onion": "onion chunks", "heap-tomato": "tomato chunks", "heap-pepper": "pepper chunks",
        "plate-0-v2": "v3.1 R6: the clean empty plate (one canvas with plate-1-v2..4-v2, on the rim)", "plate-1-v2": "v3.1 R6: 1 skewer, fanned",
        "plate-2-v2": "v3.1 R6: 2 skewers", "plate-3-v2": "v3.1 R6: 3 skewers", "plate-4-v2": "v3.1 R6: 4 skewers (FIVE sticks drawn: the lowest one stays empty)",
        "potato-raw": "v3.1 R7: potato chunk, raw (the decoy)", "potato-grilled": "v3.1 R7: grilled", "potato-charred": "v3.1 R7: charred, still potato",
        "onion-charred": "v3.1 R7: charred, still purple onion", "tomato-charred": "v3.1 R7: charred, still red", "pepper-charred": "v3.1 R7: charred, still green",
        "heap-potato": "v3.1 R7: a heap of raw potato chunks (the decoy's shelf heap)"}),
]

SKIP = {"w", "h", "sheet", "set", "registered", "note"}


def fmt(m):
    parts = []
    for k, v in m.items():
        if k in SKIP:
            continue
        if k == "burners":
            v = ", ".join(f"({b['x']}, {b['y']})" for b in v)
        parts.append(f"{k} {v}")
    return "; ".join(parts)


def main():
    out = ["# Cook v3 art (29 Sept play-test)", "",
           "Cut by `python3 build/cut_cook_v3.py` from `sources/art/cook-v3/` (the 28 ChatGPT sheets from",
           "`docs/chatgpt-art-prompts-cook-v3.md`, renamed to their \"save as\" names). The method is `docs/VISUAL-QA.md` §2's:",
           "colour-to-alpha edges, flat grey inside loops and holes made transparent (and checked: no `#808080` left inside a",
           "cut), ChatGPT's drawn drop shadows removed, and one registered canvas per object shown in several states.",
           "",
           "Each folder's `meta.json` holds, per sprite: `w`, `h` (px), the sheet it came from, and what was **measured from the",
           "art**, as fractions of the sprite's own width (x, r) and height (y): `cx, cy, r` = the round body's centre and radius",
           "(handles left out; `fit_px` = how round it is), `burners` = each burner's centre, `frontY` = the middle of the hob's",
           "front strip (the badges and knobs), `anchor` = the registration point. `python3 build/check_vessel_meta.py` re-measures",
           "every one of them. This README is written by `python3 build/v3_readme.py`.",
           "",
           "The faces (A1, A2) went to `assets/cook/characters/<who>-face[-happy|-frown].webp` (Ali is `cousin`; Isa's are new),",
           "framed by the eyes: `assets/cook/items/v3/faces-meta.json` has each face's eye points on its sheet.", "",
           "**v3.1 (30 Sept):** the redos R1-R8 (`docs/chatgpt-art-prompts-overnight-2026-09-30.md`, `sources/art/cook-v3-1/`) are",
           "cut by `python3 build/cut_cook_v3_1.py` (the same method, this script's functions) into the same folders, next to",
           "the v3 files, with `-v2` where one replaces a v3 file. R4's pots are scaled and placed on D1's pot canvas (their",
           "rims on D1's); R6's plates share one canvas on the rim. The report: `build/reports/art-v3-1.md`.", ""]
    for name, prompts, what, purpose in GROUPS:
        meta = json.load(open(os.path.join(V3, name, "meta.json")))
        out += [f"## {name}/ ({prompts})", "", what, "", "| file | px | what it is | measured |", "|---|---|---|---|"]
        for f, m in meta.items():
            out.append(f"| `{f}.webp` | {m['w']}x{m['h']} | {purpose.get(f, '')} | {fmt(m)} |")
        out.append("")
    open(os.path.join(V3, "README.md"), "w").write("\n".join(out))
    print("README.md written")


if __name__ == "__main__":
    main()
