#!/usr/bin/env python3
"""S12 W3-A's cuts from sources/art/s12 into assets/day/s12 (ART-24, ART-25, ART-27, DOOR-08):
  door-sun     the big sun against the sky (sn), framed on the sun, as the door's weather card picture
  door-farm    the farmhouse, the farmer with her pitchfork and the animals (fm), as the door's activity card picture
  nani-come-open / nani-come-beckon   Nani's come-here poses (nw: the open palm, then the beckon), cut from the flat grey
  turn-1..4    the page turn (pg1-pg4, in that order), each registered onto the book's pages picture (pages-b2-v2) by its
               unchanged surroundings, cropped to the part that differs, laid at `box` (pages px) over the pages
Prints the data for data/day.json (door) and data/day-book.json (art.turn).
Usage: python3 build/reports/s12-w3a/cut_s12_w3a.py"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
sys.path.insert(0, os.path.join(ROOT, "build/tools/art"))
from cut_s09r import key  # noqa: E402
from cut_s09b import grey_of, pieces  # noqa: E402

SRC = os.path.join(ROOT, "sources/art/s12")
OUT = os.path.join(ROOT, "assets/day/s12")
rep = {}


def webp(im, name, q=86):
    im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=q, method=6)


def card(src, name, box, size):
    im = Image.open(os.path.join(SRC, src)).convert("RGB").crop(box).resize(size, Image.LANCZOS)
    webp(im, name, 84)
    rep[name] = {"from": src, "crop": list(box), "size": list(size)}


def poses():
    rgba = key(os.path.join(SRC, "nw-nani-come-here-v1.png"), keyness=grey_of, k=None)
    names = ["nani-come-open", "nani-come-beckon"]
    masks = pieces(rgba, names)
    assert len(masks) == 2, len(masks)
    for m, name in zip(masks, names):
        grown = ndimage.binary_dilation(m, iterations=3)
        p = rgba.copy()
        p[..., 3] = np.where(grown, p[..., 3], 0)
        ys, xs = np.where(p[..., 3] > 0)
        p = p[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        im = Image.fromarray(np.ascontiguousarray(p), "RGBA")
        H = 900
        if im.height > H:
            im = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
        a = np.asarray(im)[..., 3] > 128
        h, w = a.shape
        rows = np.where(a.any(1))[0]
        feet = a[int(h * 0.96):]
        fx = np.where(feet.any(0))[0]
        # her head: the top tenth's middle (the raised hand is beside it, not above it: the column under the topmost row)
        top = a[: int(h * 0.12)]
        cols = np.where(top.any(0))[0]
        # the head is the widest run in the top band near the middle; take the run holding the band's centroid of mass
        mass = top.sum(0)
        lab, n = ndimage.label(mass > 0)
        runs = [(lab == i + 1) for i in range(n)]
        best = max(runs, key=lambda r: mass[r].sum())
        hx = float((np.arange(w)[best] * mass[best]).sum() / mass[best].sum()) / w
        webp(im, name, 88)
        rep[name] = {"art": f"assets/day/s12/{name}.webp", "w": w, "h": h, "body": [int(rows[0]), int(rows[-1])], "cx": round(float((fx[0] + fx[-1]) / 2 / w), 3), "head": [round(hx, 3), 0.085]}


def shift_of(base, img, mask):
    """The whole-pixel shift (dx, dy) that lays img on base best over mask (the surroundings that do not move)."""
    best = None
    b = base.astype(np.float32)
    for dy in range(-8, 9):
        for dx in range(-8, 9):
            m = np.roll(np.roll(img, dy, 0), dx, 1).astype(np.float32)
            e = np.abs(m - b).mean(-1)[mask].mean()
            if best is None or e < best[0]:
                best = (e, dx, dy)
    return best


def turns():
    base = np.asarray(Image.open(os.path.join(ROOT, "assets/day/book/pages-b2-v2.webp")).convert("RGB"))
    H, W = base.shape[:2]
    # the surroundings that never move: the left of the picture and its bottom band (her dress), at half size for speed
    mask = np.zeros((H, W), bool)
    mask[:, :180] = True
    mask[820:, :] = True
    files = ["pg1-page-turn-25-v1.png", "pg2-page-turn-70-v1.png", "pg3-page-turn-120-v1.png", "pg4-page-turn-160-v1.png"]
    frames = []
    for f in files:
        im = np.asarray(Image.open(os.path.join(SRC, f)).convert("RGB").resize((W, H), Image.LANCZOS))
        e, dx, dy = shift_of(base[::2, ::2], im[::2, ::2], mask[::2, ::2])
        dx, dy = dx * 2, dy * 2
        im = np.roll(np.roll(im, dy, 0), dx, 1)
        frames.append(im)
        rep[f] = {"shift": [dx, dy], "err": round(float(e), 2)}
    # one box for all four: where any frame differs from the pages picture
    diff = np.zeros((H, W), bool)
    for im in frames:
        d = np.abs(im.astype(np.int16) - base.astype(np.int16)).max(-1) > 40
        diff |= ndimage.binary_opening(d, iterations=2)
    ys, xs = np.where(diff[:, 180:] if False else diff)
    pad = 16
    x0, y0 = max(0, xs.min() - pad), max(0, ys.min() - pad)
    x1, y1 = min(W, xs.max() + pad), min(H, ys.max() + pad)
    box = [int(x0), int(y0), int(x1 - x0), int(y1 - y0)]
    for i, im in enumerate(frames):
        piece = Image.fromarray(im[y0:y1, x0:x1])
        webp(piece, f"turn-{i + 1}", 80)
    rep["turn"] = {"frames": [f"assets/day/s12/turn-{i + 1}.webp" for i in range(4)], "box": box}


def main():
    os.makedirs(OUT, exist_ok=True)
    # the sun: two thirds of the frame (Zafar, 22 Oct D6); the sun's middle measured on the source at about (766, 460)
    card("sn-door-sun-v1.png", "door-sun", (226, 40, 1306, 850), (640, 480))
    # the farm: the house, the farmer and the animals, the fence in front
    card("fm-door-farm-v1.png", "door-farm", (100, 60, 1500, 1010), (720, 489))
    poses()
    turns()
    json.dump(rep, open(os.path.join(OUT, "cut-report.json"), "w"), indent=1)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
