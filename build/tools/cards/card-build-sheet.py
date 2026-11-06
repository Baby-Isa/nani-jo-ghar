#!/usr/bin/env python3
"""Sheets for the 6 Nov card build (build/tools/cards/card-build.mjs), and the last gap measured again off the pixels.

    python3 build/tools/cards/card-build-sheet.py <raw dir> <out dir>

<raw dir> is card-build.mjs's --out (one folder per size, measure.json). Writes to <out dir>:
  panel-<size>.png    the side panel's order card: chai's own order, all one line, all two lines, mixed (BEFORE above, AFTER below),
                      then AFTER with the English hidden and with one English peeking
  screens-<size>.png  the pop-up card (chai's word, then "fudino ji chutney"), Nani's box, Nana's bubble, the shelf pills, the word
                      moment's cards: BEFORE left, AFTER right
  pixels.json         every AFTER row's last gap read off the pixels: the lowest dark pixel over the divider's span, above the divider
Prints one line per row: g, the row's last gap as the game set it (every card, the ones scrolled out of view too), and for each card
in view its own gap as the game measured it against the pixels (ok within 1 CSS px: the browser draws text snapped to the device
pixels and the canvas rounds a letter's ink to whole px; build/tools/cards/ink-probe.mjs shows the baseline exact and the ink within 0.75 px).
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

RAW, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
M = json.load(open(os.path.join(RAW, "measure.json")))
DPR = 2
try:
    FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    SMALL = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
except OSError:
    FONT = SMALL = ImageFont.load_default()
RED, GREEN, INK, BG = (190, 40, 40), (30, 130, 60), (40, 30, 25), (244, 240, 232)


def load(size, name):
    p = os.path.join(RAW, size, name + ".png")
    return Image.open(p).convert("RGB") if os.path.exists(p) else None


def trim_foot(img):
    """A side panel's empty foot (the panel's own colour under the last card) cut away, a margin kept."""
    if img is None:
        return None
    from PIL import ImageChops
    bg = Image.new("RGB", img.size, img.getpixel((4, img.height - 4)))
    box = ImageChops.difference(img, bg).convert("L").point(lambda v: 255 if v > 14 else 0).crop((0, 0, img.width - 12, img.height)).getbbox()
    return img if not box else img.crop((0, 0, img.width, min(img.height, box[3] + 24)))


def label(img, text, colour):
    if img is None:
        return None
    out = Image.new("RGB", (img.width, img.height + 34), BG)
    out.paste(img, (0, 34))
    ImageDraw.Draw(out).text((6, 5), text, fill=colour, font=FONT)
    return out


def grid(rows, title, gap=14):
    rows = [[c for c in r if c is not None] for r in rows]
    rows = [r for r in rows if r]
    if not rows:
        return None
    w = max(sum(c.width for c in r) + gap * (len(r) - 1) for r in rows)
    h = sum(max(c.height for c in r) for r in rows) + gap * (len(rows) - 1) + 46
    sheet = Image.new("RGB", (w + 2 * gap, h + gap), BG)
    d = ImageDraw.Draw(sheet)
    d.text((gap, 10), title, fill=INK, font=FONT)
    y = 46
    for r in rows:
        x = gap
        for c in r:
            sheet.paste(c, (x, y))
            x += c.width + gap
        y += max(c.height for c in r) + gap
    return sheet


def fit(img, max_w):
    if img is None or img.width <= max_w:
        return img
    return img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)


def pixel_gap(img, item):
    """The lowest dark pixel over the divider's span, between the English's box top and the divider's top: CSS px from it to the divider."""
    if not item.get("divTop") or not item.get("divSpan"):
        return None
    x0, x1 = (round(v * DPR) for v in item["divSpan"])
    y0, y1 = round(item["enBox"]["y"] * DPR), round(item["divTop"] * DPR)
    x0, x1 = max(x0, round(item["card"]["x"] * DPR) + 2), min(x1, round(item["card"]["r"] * DPR) - 2, img.width - 1)
    px = img.load()
    low = None
    for y in range(y0, min(y1, img.height)):
        for x in range(x0, x1):
            r, g, b = px[x, y]
            if 0.299 * r + 0.587 * g + 0.114 * b < 200:
                low = y
                break
    return None if low is None else round(item["divTop"] - (low + 1) / DPR, 2)


pix = {}
sizes = sorted({k.split("|")[0] for k in M}, key=lambda s: (int(s.split("x")[1]), int(s.split("x")[0])))
for size in sizes:
    # the side panel
    cases = ["game", "one", "two", "mixed"]
    names = {"game": "chai's own order", "one": "all one line", "two": "all two lines", "mixed": "two-line beside one-line"}
    before = [label(trim_foot(load(size, f"before-panel-{c}")), f"BEFORE: {names[c]}", RED) for c in cases]
    after = [label(trim_foot(load(size, f"after-panel-{c}")), f"AFTER: {names[c]}", GREEN) for c in cases]
    hid = [label(trim_foot(load(size, f"after-panel-{p}-{c}")), f"AFTER: English {p}, {names[c]}", GREEN) for c in ["mixed", "two"] for p in ["hidden", "peek"]]
    s = grid([before, after, hid], f"{size}: the order card in the side panel (Nani's box shut, the next order's card under it); 2x pixels")
    if s:
        s.save(os.path.join(OUT, f"panel-{size}.png"), optimize=True)
    # the pop-up, Nani's box, the bubble, the pills, the word moment
    rows = []
    for nm, txt in [("popup-own", "the pop-up card"), ("popup-long", "the pop-up card, a long word")]:
        rows.append([label(load(size, f"before-{nm}"), f"BEFORE: {txt}", RED), label(load(size, f"after-{nm}"), f"AFTER: {txt}", GREEN)])
    for key, txt, pad in [("guide", "Nani's box", 4), ("bubble", "Nana's bubble", 8)]:
        pair = []
        for st, col in [("before", RED), ("after", GREEN)]:
            bx = (M.get(f"{size}|{st}|boxes") or {}).get(key)
            im = load(size, f"{st}-order-screen")
            if bx and im:
                im = im.crop((max(0, round((bx["x"] - pad) * DPR)), max(0, round((bx["y"] - pad) * DPR)), min(im.width, round((bx["x"] + bx["w"] + pad) * DPR)), min(im.height, round((bx["y"] + bx["h"] + pad) * DPR))))
            else:
                im = None
            pair.append(label(im, f"{st.upper()}: {txt}", col))
        rows.append(pair)
    big = int(size.split("x")[0]) >= 1280
    for nm, txt in [("shelf", "the shelf pills"), ("word-moment", "the word moment's cards")]:
        b, a = load(size, f"before-{nm}"), load(size, f"after-{nm}")
        if nm == "shelf":  # the shelf's band only: its lower third
            b, a = (im.crop((0, int(im.height * 0.62), im.width, im.height)) if im else None for im in (b, a))
        mw = 1500 if big else 2000
        rows.append([label(fit(b, mw), f"BEFORE: {txt}", RED), label(fit(a, mw), f"AFTER: {txt}", GREEN)])
    s = grid(rows, f"{size}: the pop-up card, Nani's box, Nana's bubble, the shelf pills, the word moment (BEFORE left, AFTER right)")
    if s:
        if s.width > 4000:
            s = fit(s, 4000)
        s.save(os.path.join(OUT, f"screens-{size}.png"), optimize=True)
    # the last gap, off the pixels (AFTER, the English shown)
    for c in cases:
        m = M.get(f"{size}|after|{c}")
        img = load(size, f"after-panel-{c}")
        if not m or not m.get("items") or img is None:
            continue
        rows_px = [(i["word"], i["en"], i["g"], i["divToInk"], pixel_gap(img, i)) for i in m["items"] if i["inView"]]
        got = [r for r in rows_px if r[4] is not None]
        worst = max((abs(r[4] - r[3]) for r in got), default=None)
        pix[f"{size}|{c}"] = {"g": m["items"][0]["g"], "cards": rows_px, "rowLastGap": m["row"]["minDivToInk"], "pixelVsGame": worst}
        if got:
            print(f"{size:>9} {c:>5}: g {m['items'][0]['g']:.2f}, the row's last gap (the game, every card) {m['row']['minDivToInk']:.2f}; "
                  f"in view, the game against the pixels: {', '.join(f'{r[1]!r} {r[3]:.2f}/{r[4]:.2f}' for r in got)}; worst {worst:.2f} px {'ok' if worst <= 1.0 else 'CHECK'}")
json.dump(pix, open(os.path.join(OUT, "pixels.json"), "w"), indent=1)
