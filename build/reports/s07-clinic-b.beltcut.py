"""s07-clinic-b: the belt cut (B1-B10). A one-off cutter, kept beside the report because artcut.py (read-only for this
session) has no shadow-aware key and pads every side: a belt view needs its base flush with the picture's bottom (the
belt draws it with object-position 50% 100% on the belt's surface) and no baked-in shadow (the belt draws its own
contact shadow). Suggestion for the tools: lift this as an artcut "belt" job.

  python3 build/reports/s07-clinic-b.beltcut.py            # cut every piece below into assets/clinic/sheets/
  python3 build/reports/s07-clinic-b.beltcut.py --preview DIR   # also a contact sheet per sheet (magenta + dark)

Each piece is one connected component of the keyed sheet (cut by component, never a blind grid: the FAIL sheets'
items reach over their cell lines), picked by the centre point given below (source px). The key is artlib.key (tol 10);
then any soft shadow (low saturation, darker than the grey, joined to the background) is grown away from the outside;
glass pieces keep partial alpha. The crop is tight, with 3 px at the top and sides and none at the bottom.
"""
import json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "build/tools/art"))
import artlib as L  # noqa: E402
import numpy as np  # noqa: E402
from PIL import Image  # noqa: E402
from scipy import ndimage as ndi  # noqa: E402

SRC = os.path.join(ROOT, "sources/art/s07")
OUT = os.path.join(ROOT, "assets/clinic/sheets")
MAX = 384  # the s02 belt views' longest side (decision 68: drawn at about 110-154 px tall, x2 for a phone's density)
OUT_DIR = [OUT]  # --out DIR writes there instead

# sheet -> [(folder, name, (x, y) a point on the piece, options)]
JOBS = {
    # B5 PASS: the belt camera; caps in row 2 (the tray view)
    "b5-drops-colours": [("drops", f"drops-{c}-{v}", (x, y), {}) for v, y, xs in (("belt", 300, (200, 580, 950, 1330)), ("tray", 730, (200, 580, 950, 1330))) for c, x in zip(("red", "blue", "green", "yellow"), xs)],
    # B3 PASS-with-note: row 1 standing reels (belt), row 2 top-down (tray); cell 4 side-on and cell 8 the loose length are spares
    "b3-thread-colours": [("thread", f"thread-{c}-{v}", (x, y), {}) for v, y, xs in (("belt", 300, (180, 560, 940)), ("tray", 720, (190, 565, 945))) for c, x in zip(("red", "blue", "green"), xs)]
    + [("thread", "thread-red-side", (1340, 300), {}), ("thread", "thread-loose", (1330, 720), {})],
    # B8 PASS-with-note: row 1 belt, row 2 tray
    "b8-taste-things": [("taste", f"{n}-{v}", (x, y), {}) for v, y, xs in (("belt", None, (190, 600, 950, 1330)), ("tray", None, (190, 590, 950, 1320))) for n, x in zip(("lemon", "milk-jug", "honey-jar", "spoon"), xs)],
    # B9 PASS-with-note: the decoys at the belt camera (the comb is dropped from the decoys, not drawn)
    "b9-decoys-belt": [
        ("decoys", "apple-belt", (200, 270), {}), ("decoys", "tumbler-belt", (575, 260), {"glass": True}),
        ("decoys", "blanket-belt", (950, 280), {}), ("decoys", "tissue-belt", (1340, 300), {}),
        ("decoys", "stethoscope-belt", (230, 720), {}), ("decoys", "crutches-belt", (575, 700), {"shadow_x0": 594}),
        ("decoys", "torch-belt", (960, 730), {}), ("decoys", "hot-water-bottle-belt", (1350, 700), {}),
    ],
    # B2 FAIL: row 1 skipped (angled); row 2 side-on rolls serve as the belt view
    "b2-bandage-colours": [("bandage", f"bandage-{c}-belt", (x, 715), {}) for c, x in zip(("red", "blue", "green", "yellow"), (200, 580, 955, 1335))],
    # B1 FAIL: drawn top-down, so rows 1-2 are tray views only (not the belt)
    "b1-plaster-level-colours": [("plaster-level", f"plaster-{c}-tray", (x, y), {}) for (c, x, y) in (("red", 205, 325), ("blue", 580, 325), ("green", 955, 325), ("yellow", 1335, 325), ("skin", 205, 640))],
    # s08-clinic-items: B1 v2 (s08 API redo, PASS-with-note): row 1 (red, blue, green, yellow) and cell 5 (skin) at the
    # belt camera, drawn at the width given (a share of the dish, set to the belt set's look: see the report); cells 6-8
    # (top-down) are not cut again: the s07 tray views stay
    "s08/items/b1-plaster-level-colours-v2": [("plaster-level", f"plaster-{c}-belt", (x, y), {"width": 0.8}) for (c, x, y) in (("red", 204, 269), ("blue", 581, 269), ("green", 955, 269), ("yellow", 1327, 269), ("skin", 204, 750))],
    # s08-clinic-items: DM2 v2 (PASS-with-note): the four matte drops for the drop machine's syringe. Its two levers
    # (cream knob, steel boss; up at (296, 230), down at (768, 300)) are not cut: today's drawn levers carry their
    # tube's colour on the knob, which the colour levels need (build/reports/s08-clinic-items.md)
    "s08/items/dm2-levers-drops-v2": [("drops-machine", n, (x, y), {"max": 128}) for (n, x, y) in (("drop-red", 1247, 292), ("drop-yellow", 292, 745), ("drop-blue", 768, 745), ("drop-green", 1247, 745))],
    # B4 FAIL: cut by component; cell 1 = belt, cell 4 = tool (in use)
    "b4-reflex-hammer-sheet": [("hammer", "hammer-belt", (220, 300), {}), ("hammer", "hammer-tool", (1340, 280), {})],
    # B6 FAIL: cell 1 = belt, cell 4 = tool
    "b6-drill-sheet": [("drill", "drill-belt", (200, 230), {}), ("drill", "drill-tool", (1330, 270), {})],
    # B7 FAIL: cell 1 = belt, cell 4 = tool, cell 7 = the fill
    "b7-filling-tube-sheet": [("paste", "paste-belt", (220, 285), {}), ("paste", "paste-tool", (1330, 270), {}), ("paste", "paste-fill", (965, 700), {})],
    # B10 FAIL: cell 1 = belt, cell 4 = in use
    "b10-eye-patch-sheet": [("patch", "patch-belt", (200, 310), {}), ("patch", "patch-use", (1260, 300), {})],
}


def unshadow(a, obj, bg, x0=0):
    """Grow the background into the soft shadows it touches: grey (low saturation), darker than the ground, within 60.
    x0: only right of this column (the crutches' grey rubber tips are as dark as their shadow, which falls right)."""
    mean = a.mean(2)
    sat = a.max(2) - a.min(2)
    cand = (sat < 12) & (mean < bg.mean() - 2) & (mean > bg.mean() - 60)
    cand[:, :x0] = False
    grown = ndi.binary_propagation(~obj, mask=(~obj) | cand)
    obj2 = obj & ~grown
    obj2 = ndi.binary_opening(obj2, iterations=1)
    return obj2


def cut(sheet, pieces, preview=None):
    # a sheet name with a folder (s08/items/b1-...-v2) is a later pack's file under sources/art, as named
    a = L.load(os.path.join(ROOT, "sources/art", sheet + ".png") if "/" in sheet else os.path.join(SRC, sheet + "-v1.png"))
    k, obj = L.key(a, multi=1500, tol=10)
    e = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3)])
    bg = np.median(e, 0)
    lab, _ = ndi.label(obj)
    report = {}
    tiles = []
    for folder, name, (x, y), o in pieces:
        if y is None:  # B8: rows by the sheet's halves
            y = 300 if name.endswith("-belt") else 720
        lid = lab[y, x]
        if not lid:  # the point missed: the nearest component
            d = ndi.distance_transform_edt(lab == 0, return_indices=True)[1]
            lid = lab[d[0][y, x], d[1][y, x]]
        m = lab == lid
        if o.get("glass"):
            m = ndi.binary_fill_holes(m)
            up = np.where(a > bg, (a - bg) / np.maximum(1, 255 - bg), (bg - a) / np.maximum(1, bg)).max(2)
            al = np.clip(0.18 + up * 2.0, 0, 1) * m
            al = np.where(ndi.binary_erosion(m, iterations=2), al, al * 0.8)
            safe = np.maximum(al, 1e-3)[..., None]
            rgb = np.clip((a - bg) / safe + bg, 0, 255)
            piece = np.dstack([rgb, al])
        else:
            m2 = unshadow(a, m, bg, o.get("shadow_x0", 0))
            lb2, n2 = ndi.label(m2)
            if n2 > 1:
                sz = np.bincount(lb2.ravel())
                sz[0] = 0
                m2 = np.isin(lb2, [i for i in range(1, n2 + 1) if sz[i] >= max(300, 0.02 * sz.max())])
            piece = k.copy()
            piece[..., 3] = np.where(ndi.binary_dilation(m2, iterations=1), piece[..., 3], 0)
            piece[..., 3] = np.where(m2 & ~ndi.binary_erosion(m2, iterations=1), np.minimum(piece[..., 3], 0.75), piece[..., 3])
        x0, y0, x1, y1 = L.bbox(piece[..., 3], thr=0.06)
        piece = piece[y0:y1, x0:x1]
        img = L.to_img(piece)
        p = 3
        # "width": the piece drawn at that share of the belt's square dish (side padding, never a stretch): the belt
        # fits every picture to the dish (object-fit contain), so a long flat thing would otherwise span the whole dish
        sw = max(img.width + 2 * p, int(round(img.width / o["width"]))) if o.get("width") else img.width + 2 * p
        cv = Image.new("RGBA", (sw, img.height + p), (0, 0, 0, 0))
        cv.alpha_composite(img, ((sw - img.width) // 2, p))
        s = min(1, o.get("max", MAX) / max(cv.size))
        if s < 1:
            cv = cv.resize((round(cv.width * s), round(cv.height * s)), Image.LANCZOS)
        path = os.path.join(OUT_DIR[0], folder, name + ".webp")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        cv.save(path, quality=90, method=6)
        report[name] = {"file": os.path.relpath(path, ROOT), "w": cv.width, "h": cv.height, "src_box": [x0, y0, x1, y1]}
        tiles.append(cv)
    if preview:
        W = sum(t.width + 16 for t in tiles) + 16
        H = max(t.height for t in tiles) * 2 + 48
        sh = Image.new("RGBA", (W, H), (255, 0, 255, 255))
        xx = 16
        top = max(t.height for t in tiles)
        for t in tiles:
            sh.alpha_composite(t, (xx, 16))
            d = Image.new("RGBA", t.size, (70, 74, 80, 255))
            d.alpha_composite(t)
            sh.alpha_composite(d, (xx, 32 + top))
            xx += t.width + 16
        os.makedirs(preview, exist_ok=True)
        sh.convert("RGB").save(os.path.join(preview, os.path.basename(sheet) + ".png"))
    return report


if __name__ == "__main__":
    prev = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None
    if "--out" in sys.argv:  # a test run into a scratch folder
        OUT_DIR[0] = os.path.abspath(sys.argv[sys.argv.index("--out") + 1])
    only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else None
    rep = {}
    for sh, pcs in JOBS.items():
        if only and sh not in only:
            continue
        rep[sh] = cut(sh, pcs, prev)
        print(sh, ", ".join("%s %dx%d" % (n, v["w"], v["h"]) for n, v in rep[sh].items()))
    print(json.dumps({sh: {n: v["src_box"] for n, v in r.items()} for sh, r in rep.items()}))
