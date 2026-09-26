#!/usr/bin/env python3
"""Slice the rough clinic sprite sheets into trimmed transparent webp
sprites, write data/clinic/rough-art.json and the contact sheet.

    python3 sources/art/clinic-rough/slice_sheets.py

Keying: the sheets are drawn on flat #808080 grey, but the model adds a
gentle gradient and soft shadows, so the background is estimated locally
(a blurred fill from the grey-looking pixels), and grey-ish pixels that
touch the background (shadows, faint grid lines) are keyed out too. Each
opaque blob is assigned to the grid cell holding its centre; a cell's blobs
become one sprite. Rooms are kept whole (no keying).
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
GAME = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
from gen_sheets import SHEETS  # noqa: E402

OUT = os.path.join(GAME, "assets", "clinic", "rough")
MANIFEST = os.path.join(GAME, "data", "clinic", "rough-art.json")
CONTACT = os.path.join(GAME, "build", "contact-sheets", "clinic-rough.png")
MAX_SIDE = 512          # sprites are scaled down to this; plenty at game size
ROOM_W = 1536

# Sprite id -> ids already used in data/clinic.json / the design, for lookups.
ALIASES = {
    "plaster": ["care-plaster"], "bandage-red": ["care-bandage"], "cloth": ["care-cloth"],
    "ice-pack": ["care-ice"], "hot-water-bottle": ["care-bottle"], "blanket-red": ["care-blanket"],
    "tissues": ["care-tissue"], "pillow": ["care-pillow"], "drops-green": ["care-drops"],
    "stethoscope": ["tool-stethoscope"], "torch": ["tool-torch"], "thermometer": ["tool-strip"],
    "med-syrup": [], "syrup": ["med-syrup"], "honey-jar": ["med-honey"],
    "cotton-bud": ["cotton-bud"], "jug-water": ["paani", "jug"], "salt-pot": ["loon"],
    "sugar-pot": ["khun"], "lemon": ["limu"], "reflex-hammer": ["hammer"],
    "cotton-wool": ["cotton"], "foot-basin": ["tub"],
    "part-knee": ["body-knee"], "part-ear": ["body-ear"], "part-mouth": ["body-mouth", "body-tooth"],
    "part-tongue": ["tongue"], "part-eye": ["body-eye"], "part-foot": ["body-foot", "body-toe"],
    "part-forearm": ["body-arm"], "part-head": ["body-head"], "part-hand": ["body-hand", "body-finger"],
}
GROUP = {"items": "items", "parts": "parts", "overlays": "overlays", "ui": "ui"}


def sheet_group(s):
    if "group" in s:
        return s["group"]
    return GROUP.get(s["name"].split("-")[0], s["name"].split("-")[0])


def sheet_file(s):
    """The accepted raw sheet: <name>.png (a retry overwrites it; rejects are renamed)."""
    return os.path.join(HERE, s["name"] + ".png")


def key_out(img):
    rgb = np.asarray(img.convert("RGB")).astype(np.float32)
    h, w, _ = rgb.shape
    lum = rgb.mean(2)
    chroma = rgb.max(2) - rgb.min(2)
    border = np.concatenate([rgb[:4].reshape(-1, 3), rgb[-4:].reshape(-1, 3),
                             rgb[:, :4].reshape(-1, 3), rgb[:, -4:].reshape(-1, 3)])
    g = np.median(border, 0)
    # Grey-looking pixels near the sheet's grey seed a blurred local background.
    seed = (np.sqrt(((rgb - g) ** 2).sum(-1)) < 40) & (chroma < g.max() - g.min() + 12)
    wgt = ndimage.gaussian_filter(seed.astype(np.float32), 40)
    bg = np.stack([ndimage.gaussian_filter(rgb[..., c] * seed, 40) for c in range(3)], -1)
    bg = bg / np.maximum(wgt, 1e-3)[..., None]
    fallback = wgt < 0.02
    bg[fallback] = g
    diff = np.sqrt(((rgb - bg) ** 2).sum(-1))
    d = rgb - bg
    dl = d.mean(-1)
    rel_chroma = np.sqrt(((d - dl[..., None]) ** 2).sum(-1))  # colour change beyond a lighter/darker shift
    # Background candidates: close to the local grey, or neutral shadows / faint lines on it.
    cand = (diff < 16) | ((rel_chroma < 12) & (dl > -55) & (dl < 26))
    lab, n = ndimage.label(cand)
    # The candidate region(s) that touch the border are background, plus big enclosed holes.
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    sizes = ndimage.sum(np.ones_like(lab), lab, index=np.arange(n + 1))
    bgmask = np.isin(lab, list(edge))
    tight = diff < 10
    holes = [i for i in range(1, n + 1) if i not in edge and sizes[i] > 2500]
    if holes:
        bgmask |= np.isin(lab, holes) & tight
    fg = ~bgmask
    fg = ndimage.binary_opening(fg, iterations=1)
    # Soft edge: one pixel of feather.
    alpha = ndimage.gaussian_filter(fg.astype(np.float32), 0.8)
    alpha = np.clip((alpha - 0.15) / 0.7, 0, 1)
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA"), fg


def slice_grid(s, img):
    rgba, fg = key_out(img)
    h, w = fg.shape
    rows, cols = s["rows"], s["cols"]
    lab, n = ndimage.label(fg)
    objs = ndimage.find_objects(lab)
    cells = {}
    min_area = h * w * 0.0006
    blobs = []
    for i, sl in enumerate(objs, 1):
        area = int((lab[sl] == i).sum())
        if area < min_area:
            continue
        cy, cx = ndimage.center_of_mass(lab == i)
        blobs.append((cy, cx, i, area))
    ids = s["ids"]
    big = [b for b in blobs if b[3] > h * w * 0.004]
    if "layout" in s:
        # Rows as actually drawn: equal row bands, each row split into equal column bands.
        lay = s["layout"]
        for cy, cx, i, _ in blobs:
            row = lay[min(len(lay) - 1, int(cy / h * len(lay)))]
            sid = row[min(len(row) - 1, int(cx / w * len(row)))]
            if sid:
                cells.setdefault(ids.index(sid), []).append(i)
    elif len(big) == len(ids):
        # Reading order: cluster big blobs into rows by y, then left to right.
        big.sort(key=lambda b: b[0])
        rows_, cur = [], [big[0]]
        for b in big[1:]:
            if b[0] - cur[-1][0] > h / rows / 2.5:
                rows_.append(cur)
                cur = [b]
            else:
                cur.append(b)
        rows_.append(cur)
        seq = [b for r_ in rows_ for b in sorted(r_, key=lambda b: b[1])]
        centres = [(b[0], b[1]) for b in seq]
        for b in blobs:  # small bits join the nearest big blob
            j = min(range(len(centres)), key=lambda k: (centres[k][0] - b[0]) ** 2 + (centres[k][1] - b[1]) ** 2)
            if j < len(ids):
                cells.setdefault(s["ids"].index(ids[j]), []).append(b[2])
    else:
        for cy, cx, i, _ in blobs:
            r = min(rows - 1, int(cy / h * rows))
            c = min(cols - 1, int(cx / w * cols))
            cells.setdefault(r * cols + c, []).append(i)
    out = {}
    arr = np.asarray(rgba).copy()
    for k, sid in enumerate(s["ids"]):
        labs = cells.get(k, [])
        if not labs:
            out[sid] = None
            continue
        m = np.isin(lab, labs)
        ys, xs = np.where(m)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        pad = 3
        y0, x0 = max(0, y0 - pad), max(0, x0 - pad)
        y1, x1 = min(h, y1 + pad), min(w, x1 + pad)
        crop = arr[y0:y1, x0:x1].copy()
        # Only this cell's blobs (plus their feathered edge).
        keep = ndimage.binary_dilation(m[y0:y1, x0:x1], iterations=2)
        crop[..., 3] = crop[..., 3] * keep
        out[sid] = Image.fromarray(crop, "RGBA")
    return out


def save_sprite(im, path, max_side=MAX_SIDE, lossless=False):
    if max(im.size) > max_side:
        f = max_side / max(im.size)
        im = im.resize((max(1, round(im.width * f)), max(1, round(im.height * f))), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=82, method=6, lossless=lossless)
    return im.size


def font(size):
    p = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    return ImageFont.truetype(p, size) if os.path.exists(p) else ImageFont.load_default()


def contact_sheet(entries, path):
    tile, cols, lab = 150, 10, 16
    rows = (len(entries) + cols - 1) // cols
    W, H = cols * tile, rows * (tile + lab) + 40
    sheet = Image.new("RGB", (W, H), (245, 240, 232))
    d = ImageDraw.Draw(sheet)
    d.text((8, 8), f"Clinic rough art: {len(entries)} sprites (checker = transparency)", fill=(40, 40, 40), font=font(18))
    for i, (sid, fpath) in enumerate(entries):
        x, y = (i % cols) * tile, 40 + (i // cols) * (tile + lab)
        # checkerboard, half dark / half light to show fringes
        for yy in range(0, tile, 12):
            for xx in range(0, tile, 12):
                dark = xx < tile // 2
                c = ((60, 60, 60) if (xx // 12 + yy // 12) % 2 else (80, 80, 80)) if dark else \
                    ((235, 235, 235) if (xx // 12 + yy // 12) % 2 else (255, 255, 255))
                d.rectangle([x + xx, y + yy, x + xx + 11, y + yy + 11], fill=c)
        im = Image.open(fpath).convert("RGBA")
        im.thumbnail((tile - 8, tile - 8))
        sheet.paste(im, (x + (tile - im.width) // 2, y + (tile - im.height) // 2), im)
        d.text((x + 3, y + tile), sid[:22], fill=(20, 20, 20), font=font(12))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sheet.save(path)


def main():
    sprites, patients, missing, sheets_used = {}, {}, [], []
    for s in SHEETS:
        src = sheet_file(s)
        if not os.path.exists(src):
            continue
        sheets_used.append(s["name"])
        group = sheet_group(s)
        img = Image.open(src)
        if s["kind"] == "room":
            rel = f"assets/clinic/rough/rooms/{s['name'].replace('room-', '')}.webp"
            size = save_sprite(img.convert("RGB"), os.path.join(GAME, rel), max_side=ROOM_W)
            sprites[s["name"]] = {"file": rel, "w": size[0], "h": size[1], "group": "rooms", "sheet": s["name"]}
            continue
        for sid, im in slice_grid(s, img).items():
            if im is None:
                missing.append(sid)
                continue
            name = sid
            if group == "patients":
                pid, mood = sid.rsplit("-", 1)
                rel = f"assets/clinic/rough/patients/{pid}/{mood}.webp"
                patients.setdefault(pid, {})[mood] = sid
            else:
                rel = f"assets/clinic/rough/{group}/{name}.webp"
            size = save_sprite(im, os.path.join(GAME, rel))
            e = {"file": rel, "w": size[0], "h": size[1], "group": group, "sheet": s["name"]}
            if sid in ALIASES and ALIASES[sid]:
                e["aliases"] = ALIASES[sid]
            sprites[sid] = e
    missing = sorted(set(m for m in missing if m not in sprites))
    alias = {a: sid for sid, e in sprites.items() for a in e.get("aliases", [])}
    manifest = {
        "_about": ("Rough, throwaway placeholder art for the clinic (gpt-image-1 medium sprite sheets, "
                   "sliced by sources/art/clinic-rough/slice_sheets.py). The real art comes later. "
                   "`sprites` maps a sprite id to its trimmed transparent webp (paths from the site root, "
                   "w/h in px). `alias` maps ids used in data/clinic.json and the design (care-*, tool-*, "
                   "body-*, med-*, Kutchi item names) to a sprite id. `patients` maps a patient kind to its "
                   "moods (neutral, ouch, giggle, relief, happy, wave); every patient sits on a small stool, "
                   "front view. Rooms are opaque 1536x1024 backgrounds. Look up: sprites[id] || sprites[alias[id]]; "
                   "fall back to greybox when absent."),
        "version": 1,
        "sprites": dict(sorted(sprites.items())),
        "alias": dict(sorted(alias.items())),
        "patients": patients,
        "rooms": {k.replace("room-", ""): k for k in sprites if k.startswith("room-")},
    }
    if missing:
        manifest["_missing"] = missing
    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    json.dump(manifest, open(MANIFEST, "w"), indent=1)
    entries = [(sid, os.path.join(GAME, e["file"])) for sid, e in sprites.items() if e["group"] != "rooms"]
    contact_sheet(entries, CONTACT)
    rooms = [os.path.join(GAME, e["file"]) for e in sprites.values() if e["group"] == "rooms"]
    if rooms:
        tiles = [Image.open(p).convert("RGB").resize((512, 341)) for p in rooms]
        strip = Image.new("RGB", (512 * len(tiles), 341))
        for i, t in enumerate(tiles):
            strip.paste(t, (512 * i, 0))
        strip.save(CONTACT.replace(".png", "-rooms.png"))
    print(f"sheets {len(sheets_used)}: {', '.join(sheets_used)}")
    print(f"sprites {len(sprites)}; missing {missing}")


if __name__ == "__main__":
    main()
