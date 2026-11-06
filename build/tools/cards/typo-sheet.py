#!/usr/bin/env python3
# Contact sheets for the card typography study (6 Nov): build/reports/card-typography-2026-11-06.md.
#   python3 build/tools/cards/typo-sheet.py <run dir of typo-options.mjs> build/reports/cards
# Every crop is pixel-true from the 2x shots (no resampling): the order card, or the whole side panel for the panel-fit picture.
import json, sys, os
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
m = json.load(open(os.path.join(src, "measure.json")))
DPR = 2
SIZES = ["971x412", "971x318", "740x320", "930x430", "1280x665"]
CASES = [("one", "all one line"), ("two", "all two lines"), ("mixed", "two lines beside one")]
NAMES = {"today": "Today (the game)", "base": "Approved this morning (2b + Lora)", "o1": "1 Tidy (today's layout, spaced)",
         "o2": "2 Centred, Nunito Sans", "o3": "3 Top-aligned, Figtree", "o4": "4 Quieter 11 px, Atkinson",
         "o5": "5 Roomy, Source Sans 3"}
OPTS = list(NAMES)
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font, small, big = (ImageFont.truetype(F, 22), ImageFont.truetype(F, 18), ImageFont.truetype(FB, 30))


def shot(size, case, opt):
    p = os.path.join(src, size, f"{case}-{opt}.png")
    return Image.open(p).convert("RGB") if os.path.exists(p) else None


def card_crop(size, case, opt, pad=6):
    im, d = shot(size, case, opt), m.get(f"{size}|{case}|{opt}")
    if im is None or not d or not d.get("cards"):
        return None, d
    c = d["cards"][0]
    box = [max(0, c["x"] - pad), max(0, c["y"] - pad), c["r"] + pad, c["b"] + pad]
    return im.crop(tuple(int(round(v * DPR)) for v in box)), d


def facts(d):
    if not d or not d.get("items"):
        return "-"
    it = d["items"]
    en = sorted({i["enPx"] for i in it})
    flags = [k for k in ("clipped", "overlap", "outside") if any(i[k] for i in it)]
    two = sum(1 for i in it if i["enLines"] > 1)
    s = f"card {it[0]['card']['h']:.0f} px · English {'/'.join(f'{e:g}' for e in en)} px · speaker {it[0]['spkR']['w']:.0f}"
    if two:
        s += f" · English on 2 lines: {two}"
    s += " · " + ("CLIPPED/OVERLAP: " + ",".join(flags) if flags else "nothing clipped")
    return s


def save(img, name):
    p = os.path.join(out, name)
    img.save(p, "WEBP", quality=76, method=6)
    print(p, img.size, os.path.getsize(p) // 1024, "KB")


def grid(cells, cols, title, colhead, rowhead, gap=24, rowlab_w=0):
    # cells: rows of (image or None, caption)
    cw = [max((r[i][0].width if r[i][0] else 200) for r in cells) for i in range(cols)]
    rh = [max((c[0].height if c[0] else 100) for c in r) for r in cells]
    capl = [max(c[1].count("\n") + 1 for c in r) for r in cells]  # caption lines under each row
    W = rowlab_w + sum(cw) + gap * (cols + 1)
    H = 70 + 40 + sum(h + 50 + 24 * n for h, n in zip(rh, capl))
    sheet = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(sheet)
    d.text((gap, 18), title, fill="black", font=big)
    x = rowlab_w + gap
    for i in range(cols):
        d.text((x, 76), colhead[i], fill="#7d2234", font=font)
        x += cw[i] + gap
    y = 110
    for ri, r in enumerate(cells):
        if rowhead:
            d.text((gap, y + 8), rowhead[ri], fill="black", font=font)
        x = rowlab_w + gap
        for i, (im, cap) in enumerate(r):
            if im is not None:
                sheet.paste(im, (x, y + 36))
            d.multiline_text((x, y + 40 + (im.height if im else 0)), cap, fill="#444", font=small, spacing=4)
            x += cw[i] + gap
        y += rh[ri] + 50 + 24 * capl[ri]
    return sheet


# ---------- round 2 (6 Nov evening): python3 build/tools/cards/typo-sheet.py <run dir> build/reports/cards --round2 ----------
# (the run: typo-options.mjs --only o2,r2A,r2B,r2C --sizes 971x412,971x318,740x320,1280x665,1920x1080 --no-popup)
R2SIZES = ["971x412", "971x318", "740x320", "1280x665", "1920x1080"]
R2NAMES = {"o2": "Baseline: option 2 (round 1)", "r2A": "A Footer band", "r2B": "B Divider line", "r2C": "C Foot button"}
SIZELAB = {"971x412": "  (his phone, no banner)", "971x318": "  (his phone in the browser)", "740x320": "  (smallest phone)"}


def facts2(d):
    if not d or not d.get("items"):
        return "-"
    it, a = d["items"], d.get("align", {})
    flags = [k for k in ("clipped", "overlap", "outside") if any(i[k] for i in it)]
    s = [f"card {it[0]['card']['h']:.0f} px, picture {it[0]['picR']['h']:.0f} px tall",
         f"English {'/'.join(f'{e:g}' for e in sorted({i['enPx'] for i in it}))} px" + (f", {sum(1 for i in it if i['enLines'] > 1)} on 2 lines" if any(i['enLines'] > 1 for i in it) else ""),
         f"speaker {it[0]['spkR']['w']:.0f} px, tap {it[0]['spkHit']['w']:.0f} x {it[0]['spkHit']['h']:.0f}",
         "English lines level" if a.get("enTop1", 9) < 0.6 else f"English lines {a.get('enTop1')} px apart",
         "CLIPPED/OVERLAP: " + ",".join(flags) if flags else "nothing clipped or overlapping"]
    return "\n".join(s)


def fitcap(d):
    f = (d or {}).get("fit", {})
    if f.get("headlineClear"):
        cap = f"next headline clear (+{f['spareForHeadline']:.0f} px)"
    elif f.get("headlineShows"):
        cap = f"next headline whole, {-f['spareForHeadline']:.0f} px into the fade"
    elif f.get("spareForPeek8", -1) >= 0:
        cap = f"next card peeks {f['peekPx']:.0f} px, headline hidden"
    else:
        cap = f"no peek ({f.get('peekPx', 0):.0f} px)"
    return cap + "\n" + ("this card whole" if f.get("card1Clear") else "this card in the fade" if f.get("card1Whole") else "this card CUT")


def round2():
    opts = [o for o in R2NAMES if any(k.endswith(f"|{o}") for k in m)]
    # the overview: his phone (971x412), the mixed row, the baseline and A, B, C side by side
    row = [(card_crop("971x412", "mixed", o)[0], facts2(m.get(f"971x412|mixed|{o}"))) for o in opts]
    save(grid([row], len(opts), "His phone (971x412, no banner): two-line words beside one-line. Round 2: the row aligned, one English size, three speaker treatments",
              [R2NAMES[o] for o in opts], None), "typo2-overview.webp")
    # one sheet per treatment (and the baseline): the three cases as rows, the five sizes as columns
    for o in opts:
        rows = [[(card_crop(s, cs, o)[0], f"{s}, {lab}\n" + facts2(m.get(f"{s}|{cs}|{o}"))) for s in R2SIZES] for cs, lab in CASES]
        save(grid(rows, len(R2SIZES), f"{R2NAMES[o]}   (rows: {', '.join(l for _, l in CASES)}; columns: the screen; 2x pixels)",
                  [s + SIZELAB.get(s, "") for s in R2SIZES], None), f"typo2-{o.replace('r2', '')}.webp")
    # the panel fit: the whole side panel (Nani's box shut, one order card, the next card's peek) at his phone sizes, the mixed and the
    # all-two-lines rows (the tightest), every treatment
    rows = []
    for s in ("971x412", "971x318", "740x320"):
        for cs in ("mixed", "two"):
            rows.append([(shot(s, cs, o), f"{s}, {dict(CASES)[cs]}\n" + fitcap(m.get(f"{s}|{cs}|{o}"))) for o in opts])
    save(grid(rows, len(opts), "The side panel: Nani's box shut, one order card, the next one's peek (rows: 971x412, 971x318, 740x320; mixed, then all two lines)",
              [R2NAMES[o] for o in opts], None), "typo2-panel-fit.webp")


if "--round2" in sys.argv:
    round2()
    sys.exit(0)

# 1. per option: cases as rows, sizes as columns
for opt in OPTS:
    rows = []
    for cs, lab in CASES:
        row = []
        for s in SIZES:
            im, d = card_crop(s, cs, opt)
            row.append((im, f"{s}, {lab}\n" + facts(d).replace(" · ", "\n")))
        rows.append(row)
    sh = grid(rows, len(SIZES), f"{NAMES[opt]}   (rows: {', '.join(l for _, l in CASES)}; columns: the screen; 2x pixels)",
              [f"{s}{'  (his phone, no banner)' if s == '971x412' else '  (his phone in the browser)' if s == '971x318' else ''}" for s in SIZES],
              None)
    save(sh, f"typo-{opt}.webp")

# 2. the overview: his phone (no banner), the mixed case, today and every option side by side
row = []
for opt in OPTS:
    im, d = card_crop("971x412", "mixed", opt)
    row.append((im, facts(d).replace(" · ", "\n")))
sh = grid([row], len(OPTS), "His phone (971x412, no banner): two-line words beside one-line, today and every option", [NAMES[o] for o in OPTS], None)
save(sh, "typo-overview.webp")

# 3. the panel fit: the whole side panel (Nani's box shut, one order card, the next card's peek) at his phone with and without the banner
rows = []
for s in ("971x412", "971x318", "740x320"):
    r = []
    for opt in OPTS:
        im, d = shot(s, "mixed", opt), m.get(f"{s}|mixed|{opt}")
        f = (d or {}).get("fit", {})
        if f.get("headlineClear"):
            cap = f"next headline clear (+{f['spareForHeadline']:.0f} px)"
        elif f.get("headlineShows"):
            cap = f"next headline in the fade ({f['spareForHeadline']:.0f})"
        elif f.get("spareForPeek8", -1) >= 0:
            cap = f"next card peeks {f['peekPx']:.0f} px, headline hidden"
        else:
            cap = f"no peek ({f.get('peekPx', 0):.0f} px)"
        cap += "\n" + ("this card whole" if f.get("card1Clear") else "this card in the fade" if f.get("card1Whole") else "this card CUT")
        r.append((im, cap))
    rows.append(r)
sh = grid(rows, len(OPTS), "The side panel: Nani's box shut, one order card, the next one's peek (mixed case; rows 971x412, 971x318, 740x320)", [NAMES[o] for o in OPTS], None)
save(sh, "typo-panel-fit.webp")

# 4. the English faces on option 2's layout (his phone, mixed case)
faces = [k.split("|")[2] for k in m if k.startswith("971x412|mixed|f-")]
row = []
for f in faces:
    im, d = card_crop("971x412", "mixed", f)
    it = (d or {}).get("items", [])
    widths = "\n".join(f"{i['en']}: {i['enR']['w']:.0f} px wide at {i['enPx']:g} px" for i in it)
    row.append((im, facts(d).replace(" · ", "\n") + "\n" + widths))
if row:
    sh = grid([row], len(row), "The English faces, each on option 2's layout (his phone, 971x412; English 600; Nunito, Atkinson and Figtree 500)", [f[2:] for f in faces], None)
    save(sh, "typo-faces.webp")

# 5. the pop-up card per option (fudino ji chutney), at his phone and the laptop
rows = []
for s in ("740x320", "930x430", "1280x665"):
    r = []
    for opt in OPTS:
        p = os.path.join(src, s, f"popup-{opt}.png")
        d = (m.get(f"{s}|popup|{opt}") or {}).get("popup") or {}
        im = Image.open(p).convert("RGB") if os.path.exists(p) else None
        cap = f"Kutchi {d.get('kPx')} / English {d.get('enPx')} px" + (" · CLIPPED" if d.get("clipped") or d.get("outside") else "")
        r.append((im, cap))
    rows.append(r)
sh = grid(rows, len(OPTS), "The pop-up card, fudino ji chutney (rows 740x320, 930x430, 1280x665)", [NAMES[o] for o in OPTS], None)
save(sh, "typo-popup.webp")
