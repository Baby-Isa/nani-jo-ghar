#!/usr/bin/env python3
"""Slice the Cook with Nani proof-of-concept art (ChatGPT sheets, 24 Sept 2026)
into game assets under assets/cook/.

Sources (sources/cook/):
  nani-sheet.webp       4 poses on magenta: neutral, talking, happy, pointing
  customers-sheet.webp  3x3 on magenta: Nana / Ma / cousin x happy, neutral, impatient
  props-sheet.webp      6x6 props, already transparent
  backgrounds-sheet.webp 2x2 backgrounds with white gutters
  basket-bowl.webp      basket + brass bowl, already transparent

Throwaway art for a prototype; the pipeline is what carries over.
Run: python3 build/make_cook_art.py
"""
import os
import numpy as np
import cv2
from PIL import Image, ImageFilter

GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(GAME, "sources", "cook")
OUT = os.path.join(GAME, "assets", "cook")

PROPS = [
    "onion", "onion-half", "onion-chopped", "tomato", "tomato-chopped", "chilli",
    "garlic", "daal-dry", "jeeru", "rai", "hardar", "loon",
    "atto", "water-jug", "dough-ball", "chapati-raw", "chapati-half", "chapati-puffed",
    "rolling-pin", "chakla", "tawa", "pot", "pot-daal", "tadka-pan",
    "saucepan", "saucepan-chai", "milk-jug", "tea-tin", "sugar-jar", "elchi",
    "glass", "glass-chai", "knife", "knife-gold", "thali", "chai-machine",
]


def load(name):
    return Image.open(os.path.join(SRC, name)).convert("RGBA")


def save(img, *parts):
    # WebP with alpha: about a fifth of the PNG size, which matters on a phone
    path = os.path.splitext(os.path.join(OUT, *parts))[0] + ".webp"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "WEBP", quality=88, method=6)
    return path


def key_magenta(img):
    """Soft chroma key for a flat #FF00FF background, with despill."""
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # How magenta a pixel is: both R and B well above G.
    m = np.minimum(r, b) - g
    alpha = 1.0 - np.clip((m - 60.0) / (150.0 - 60.0), 0, 1)
    # Despill: pull R and B down towards G where there's a magenta cast.
    spill = np.clip(np.minimum(r, b) - g, 0, None) * (1.0 - alpha * 0.35)
    fringe = alpha < 0.999
    r2 = np.where(fringe, r - spill * 0.8, r)
    b2 = np.where(fringe, b - spill * 0.8, b)
    out = np.dstack([np.clip(r2, 0, 255), g, np.clip(b2, 0, 255), alpha * 255]).astype(np.uint8)
    im = Image.fromarray(out, "RGBA")
    # Erode the alpha by 1px to kill the last pink halo.
    al = im.getchannel("A").filter(ImageFilter.MinFilter(3))
    im.putalpha(al)
    return im


def runs(mask1d, min_len=8):
    """[start, end) runs where mask1d is True."""
    out, start = [], None
    for i, v in enumerate(mask1d):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= min_len:
                out.append((start, i))
            start = None
    if start is not None and len(mask1d) - start >= min_len:
        out.append((start, len(mask1d)))
    return out


def trim(img, pad=2):
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def columns(img, min_gap=6):
    al = np.asarray(img.getchannel("A")) > 20
    return runs(al.sum(axis=0) > 2, min_len=40)


def split_n(img, n):
    """Split into n columns at the emptiest column near each even split,
    for figures whose shawls touch."""
    al = np.asarray(img.getchannel("A")) > 20
    col = al.sum(axis=0)
    xs = np.nonzero(col > 2)[0]
    x0, x1 = xs[0], xs[-1] + 1
    step = (x1 - x0) / n
    cuts = [x0]
    for k in range(1, n):
        g = int(x0 + step * k)
        w = int(step * 0.2)
        cuts.append(g - w + int(np.argmin(col[g - w:g + w])))
    cuts.append(x1)
    return list(zip(cuts[:-1], cuts[1:]))


def rows(img):
    al = np.asarray(img.getchannel("A")) > 20
    return runs(al.sum(axis=1) > 2, min_len=40)


def align_to(base, other, search=40):
    """Translate `other` so its face region best matches `base` (both RGBA,
    same canvas). Returns the shifted image."""
    b = cv2.cvtColor(np.asarray(base.convert("RGB")), cv2.COLOR_RGB2GRAY).astype(np.float32)
    o = cv2.cvtColor(np.asarray(other.convert("RGB")), cv2.COLOR_RGB2GRAY).astype(np.float32)
    h = b.shape[0]
    # Head region (top 45%) matters most for a mouth swap.
    top = slice(0, int(h * 0.45))
    shift, _ = cv2.phaseCorrelate(b[top], o[top])
    dx, dy = -shift[0], -shift[1]
    dx = max(-search, min(search, dx))
    dy = max(-search, min(search, dy))
    return other.transform(other.size, Image.AFFINE, (1, 0, -dx, 0, 1, -dy), resample=Image.BICUBIC), (dx, dy)


def mouth_patch(base, talk, box, feather=10):
    """Paste the mouth area `box` (x0,y0,x1,y1 in canvas px) of `talk` onto
    `base` through a feathered ellipse."""
    mask = Image.new("L", base.size, 0)
    from PIL import ImageDraw
    ImageDraw.Draw(mask).ellipse(box, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    out = base.copy()
    out.paste(talk, (0, 0), mask)
    # Keep the base silhouette's alpha.
    out.putalpha(base.getchannel("A"))
    return out


def figures_on_canvas(figs):
    """Put figures on one shared canvas size, bottom-aligned and centred
    (they're all cut straight at the waist), so poses can swap in place."""
    w = max(f.width for f in figs)
    h = max(f.height for f in figs)
    out = []
    for f in figs:
        c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        c.paste(f, ((w - f.width) // 2, h - f.height), f)
        out.append(c)
    return out


def face_box(img):
    """Rough mouth box: the lower middle of the head, found from the
    silhouette's topmost 38%."""
    w, h = img.size
    return (int(w * 0.36), int(h * 0.30), int(w * 0.64), int(h * 0.44))


def do_nani():
    sheet = key_magenta(load("nani-sheet.webp"))
    cols = split_n(sheet, 4)
    figs = [trim(sheet.crop((x0, 0, x1, sheet.height))) for x0, x1 in cols]
    # The pointing pose is wider (raised hand): align on the body's left edge
    # instead of centring, so her head stays put.
    base_w = figs[0].width
    h = max(f.height for f in figs)
    w = max(f.width for f in figs)
    canvas = []
    for f in figs:
        c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        c.paste(f, (0, h - f.height), f)
        canvas.append(c)
    neutral, talk, happy, point = canvas
    talk, d1 = align_to(neutral, talk)
    happy, d2 = align_to(neutral, happy)
    point, d3 = align_to(neutral, point)
    print("nani shifts", d1, d2, d3)
    # Pasting the open mouth onto the neutral face smudged (the heads differ
    # between poses), so "talking" swaps to the whole talk frame, crossfaded
    # in code. LivePortrait frames replace this later.
    for name, im in [("neutral", neutral), ("talk", talk), ("happy", happy), ("point", point)]:
        save(im, "characters", f"nani-{name}.png")
    # Head badge for station screens.
    fb = neutral.crop((int(base_w * 0.12), 0, int(base_w * 0.88), int(h * 0.62)))
    save(fb, "characters", "nani-badge.png")


def mouth_box_nani(img, body_w):
    h = img.height
    # Mouth sits about 52% across the body and 43% down the figure.
    cx, cy = int(body_w * 0.53), int(h * 0.425)
    rw, rh = int(body_w * 0.13), int(h * 0.055)
    return (cx - rw, cy - rh, cx + rw, cy + rh)


def do_customers():
    sheet = key_magenta(load("customers-sheet.webp"))
    names = ["nana", "ma", "cousin"]
    poses = ["happy", "neutral", "impatient"]
    rs = rows(sheet)
    assert len(rs) == 3, rs
    for (y0, y1), who in zip(rs, names):
        band = sheet.crop((0, y0, sheet.width, y1))
        cs = columns(band)
        assert len(cs) == 3, (who, cs)
        figs = [trim(band.crop((x0, 0, x1, band.height))) for x0, x1 in cs]
        figs = figures_on_canvas(figs)
        happy, neutral, imp = figs
        happy, _ = align_to(neutral, happy)
        w, h = neutral.size
        # Customers "talk" on their happy (open-mouth) frame; see do_nani.
        for name, im in [("happy", happy), ("neutral", neutral), ("impatient", imp)]:
            save(im, "characters", f"{who}-{name}.png")
        save(neutral.crop((int(w * 0.1), 0, int(w * 0.9), int(h * 0.62))), "characters", f"{who}-badge.png")


def do_props():
    sheet = load("props-sheet.webp")
    al = np.asarray(sheet.getchannel("A")) > 20
    n, labels, stats, cent = cv2.connectedComponentsWithStats(al.astype(np.uint8), connectivity=8)
    cell = sheet.width / 6.0
    boxes = {i: [] for i in range(36)}
    for k in range(1, n):
        x, y, w, h, area = stats[k]
        if area < 60:
            continue
        cx, cy = cent[k]
        idx = int(cy // cell) * 6 + int(cx // cell)
        boxes[idx].append((x, y, x + w, y + h, k))
    for i, name in enumerate(PROPS):
        bs = boxes[i]
        assert bs, f"no component for {name}"
        x0 = min(b[0] for b in bs); y0 = min(b[1] for b in bs)
        x1 = max(b[2] for b in bs); y1 = max(b[3] for b in bs)
        # Keep only this cell's components, so a neighbour's handle poking
        # into the crop box doesn't come along.
        keep = np.isin(labels, [b[4] for b in bs])
        arr = np.asarray(sheet).copy()
        arr[..., 3] = np.where(keep, arr[..., 3], 0)
        im = Image.fromarray(arr, "RGBA").crop((x0 - 2, y0 - 2, x1 + 2, y1 + 2))
        # Upscale 1.6x so items look OK at game size (they're ~180px in the sheet).
        im = im.resize((int(im.width * 1.6), int(im.height * 1.6)), Image.LANCZOS)
        save(im, "props", f"{name}.png")


def do_basket_bowl():
    sheet = load("basket-bowl.webp")
    cols = columns(sheet)
    assert len(cols) == 2, cols
    for (x0, x1), name in zip(cols, ["basket", "bowl"]):
        if name == "bowl":
            continue  # not used by Cook with Nani yet
        im = trim(sheet.crop((x0, 0, x1, sheet.height)))
        im = im.resize((480, int(im.height * 480 / im.width)), Image.LANCZOS)
        save(im, "props", f"{name}.png")
        # Front rim layer: everything below the rim's back edge ellipse, so
        # items drawn between back and front look like they're inside.
        w, h = im.size
        al = np.asarray(im.getchannel("A")) > 30
        top = np.argmax(al.any(axis=1))
        rim_h = int(h * (0.30 if name == "basket" else 0.26))
        mask = Image.new("L", im.size, 255)
        from PIL import ImageDraw
        d = ImageDraw.Draw(mask)
        # Cut away the inside opening (an ellipse spanning the rim).
        inset = int(w * 0.035)
        d.ellipse((inset, top + int(h * 0.02), w - inset, top + rim_h * 2 - int(h * 0.1)), fill=0)
        d.rectangle((0, 0, w, top + rim_h // 2), fill=0)
        mask = mask.filter(ImageFilter.GaussianBlur(1.5))
        front = im.copy()
        front.putalpha(Image.fromarray(np.minimum(np.asarray(im.getchannel("A")), np.asarray(mask))))
        save(front, "props", f"{name}-front.png")


def do_backgrounds():
    sheet = Image.open(os.path.join(SRC, "backgrounds-sheet.webp")).convert("RGB")
    a = np.asarray(sheet).astype(np.int16)
    white = (a.min(axis=2) > 235)
    colw = white.mean(axis=0) > 0.9
    roww = white.mean(axis=1) > 0.9
    xs = runs(~colw, min_len=100)
    ys = runs(~roww, min_len=100)
    assert len(xs) == 2 and len(ys) == 2, (xs, ys)
    names = [["service", "board"], ["stove", "pantry"]]
    for j, (y0, y1) in enumerate(ys):
        for i, (x0, x1) in enumerate(xs):
            q = sheet.crop((x0 + 2, y0 + 2, x1 - 2, y1 - 2))
            # Force exact 16:9 by cropping the long side, then upscale.
            W, H = q.size
            if W / H > 16 / 9:
                nw = int(H * 16 / 9); q = q.crop(((W - nw) // 2, 0, (W - nw) // 2 + nw, H))
            else:
                nh = int(W * 9 / 16); q = q.crop((0, (H - nh) // 2, W, (H - nh) // 2 + nh))
            q = q.resize((1600, 900), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
            path = os.path.join(OUT, "bg", f"{names[j][i]}.jpg")
            os.makedirs(os.path.dirname(path), exist_ok=True)
            q.save(path, quality=86)
            print(names[j][i], (x0, y0, x1, y1))


if __name__ == "__main__":
    do_backgrounds()
    do_props()
    do_basket_bowl()
    do_nani()
    do_customers()
    print("done")
