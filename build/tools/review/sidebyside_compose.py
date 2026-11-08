"""Side by side with chai (s19-checks, Sprint 19 part 2 and 3): the pictures sidebyside.mjs hands the eye judge.

python3 build/tools/review/sidebyside_compose.py RUN_DIR CHAI_SLUG GAME_SLUG OUT_DIR --sizes 740x320,1280x665

RUN_DIR/keyframes/<slug>@<size>/ holds each page's key-<moment>.png, keys.json (the boxes of the order panel, its first card and
Nani's box at each moment) and strip-NN-<why>/ frames (build/sandbox/lib/keyframes.mjs). Writes into OUT_DIR:
  <size>/pair-<n>-<moment>.png     the whole screens, chai left, the game right, full size (1:1 CSS px), labelled
  <size>/close-<n>-<moment>.png    the first order card and Nani's box cropped from each, chai's beside the game's, 1:1
  <size>/strip-<game|chai>-NN-<why>.png   a strip's frames in reading order, each labelled with its ms from the moment
  manifest.json                    what was written and what was missing (a moment a page never reached says so)
Never upscales: a close-up is the page's own pixels.
"""
import json
import os
import sys
from PIL import Image, ImageDraw, ImageFont

MOMENTS = ["order", "light", "kind", "mid", "serve", "praise", "end"]
WORDS = {"order": "the order in the side panel", "light": "the first first-time light", "kind": "the first move", "mid": "mid-cook",
         "serve": "the serve", "praise": "well done", "end": "the end screen's word review"}
BG = (250, 247, 240)
INK = (40, 30, 20)
RED = (180, 40, 40)


def font(size):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


F = font(18)
FS = font(14)


def keys_of(d):
    p = os.path.join(d, "keys.json")
    return json.load(open(p)) if os.path.exists(p) else {"keys": {}, "strips": []}


def missing(w, h, text):
    im = Image.new("RGB", (w, h), (235, 230, 222))
    ImageDraw.Draw(im).text((20, h // 2 - 10), text, fill=RED, font=F)
    return im


def labelled(ims, labels, head):
    gap, top = 16, 34
    w = sum(i.width for i in ims) + gap * (len(ims) + 1)
    h = max(i.height for i in ims) + top + 30
    out = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(out)
    d.text((gap, 8), head, fill=INK, font=F)
    x = gap
    for im, lab in zip(ims, labels):
        out.paste(im, (x, top + 26))
        d.text((x, top + 4), lab, fill=INK, font=FS)
        x += im.width + gap
    return out


def crop(im, box, pad=6):
    if not box:
        return None
    l, t, r, b = box
    l, t = max(0, l - pad), max(0, t - pad)
    r, b = min(im.width, r + pad), min(im.height, b + pad)
    if r - l < 8 or b - t < 8:
        return None
    return im.crop((l, t, r, b))


def strip_image(d, title):
    meta = json.load(open(os.path.join(d, "strip.json")))
    frames = meta.get("frames", [])
    if not frames:
        return None
    first = Image.open(os.path.join(d, frames[0]["file"]))
    k = 0.5 if first.width > 900 else 0.75
    fw, fh = int(first.width * k), int(first.height * k)
    cols = 4
    rows = (len(frames) + cols - 1) // cols
    gap, top, lab = 10, 40, 22
    out = Image.new("RGB", (cols * (fw + gap) + gap, top + rows * (fh + lab + gap) + gap), BG)
    dr = ImageDraw.Draw(out)
    dr.text((gap, 10), title, fill=INK, font=F)
    for i, f in enumerate(frames):
        im = Image.open(os.path.join(d, f["file"])).convert("RGB").resize((fw, fh), Image.LANCZOS)
        x = gap + (i % cols) * (fw + gap)
        y = top + (i // cols) * (fh + lab + gap)
        ms = f["ms"]
        dr.text((x, y), f"{'+' if ms >= 0 else ''}{ms} ms{' (no change)' if f.get('held') else ''}", fill=RED if 0 <= ms < 120 else INK, font=FS)
        out.paste(im, (x, y + lab))
    return out


def main():
    run, chai, game, out = sys.argv[1:5]
    sizes = sys.argv[sys.argv.index("--sizes") + 1].split(",") if "--sizes" in sys.argv else ["740x320", "1280x665"]
    man = {"pairs": [], "closes": [], "strips": [], "missing": []}
    for size in sizes:
        od = os.path.join(out, size)
        os.makedirs(od, exist_ok=True)
        dc, dg = (os.path.join(run, "keyframes", f"{s}@{size}") for s in (chai, game))
        kc, kg = keys_of(dc)["keys"], keys_of(dg)["keys"]
        w, h = (int(v) for v in size.split("x"))
        for n, m in enumerate(MOMENTS, 1):
            ims, labs, close = [], [], []
            for who, d, k in (("chai", dc, kc), (game, dg, kg)):
                rec = k.get(m)
                if rec and os.path.exists(os.path.join(d, rec["file"])):
                    im = Image.open(os.path.join(d, rec["file"])).convert("RGB")
                    ims.append(im)
                    labs.append(f"{who}")
                    bx = rec.get("boxes") or {}
                    close.append((who, crop(im, bx.get("card")), crop(im, bx.get("guide"))))
                else:
                    ims.append(missing(w, h, f"{who}: never reached '{m}' ({WORDS[m]})"))
                    labs.append(f"{who} (not reached)")
                    close.append((who, None, None))
                    man["missing"].append(f"{who}@{size}: {m}")
            p = os.path.join(od, f"pair-{n}-{m}.png")
            labelled(ims, labs, f"{size} · {n}. {WORDS[m]} · chai left, {game} right").save(p, optimize=True)
            man["pairs"].append(os.path.relpath(p, out))
            pieces, plabs = [], []
            for part, i in (("order card", 1), ("Nani's box", 2)):
                for who, *cs in close:
                    c = cs[i - 1]
                    pieces.append(c if c is not None else missing(220, 80, f"no {part}"))
                    plabs.append(f"{who}: {part}")
            if any(c is not None for _, *cs in close for c in cs):
                p = os.path.join(od, f"close-{n}-{m}.png")
                labelled(pieces, plabs, f"{size} · {n}. {WORDS[m]} · close-ups at 1:1, chai's beside {game}'s").save(p, optimize=True)
                man["closes"].append(os.path.relpath(p, out))
        for who, d in (("chai", dc), ("game", dg)):
            if not os.path.isdir(d):
                continue
            for s in sorted(x for x in os.listdir(d) if x.startswith("strip-")):
                im = strip_image(os.path.join(d, s), f"{size} · {chai if who == 'chai' else game} · {s}: 0.5 s before to 2 s after (ms from the moment)")
                if im is None:
                    continue
                p = os.path.join(od, f"strip-{'chai' if who == 'chai' else game}-{s[6:]}.png")
                im.save(p, optimize=True)
                man["strips"].append(os.path.relpath(p, out))
    json.dump(man, open(os.path.join(out, "manifest.json"), "w"), indent=1)
    print(f"{len(man['pairs'])} pairs, {len(man['closes'])} close-ups, {len(man['strips'])} strips, {len(man['missing'])} moments not reached")


if __name__ == "__main__":
    main()
