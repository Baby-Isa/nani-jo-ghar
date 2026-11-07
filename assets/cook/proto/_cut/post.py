"""After artcut on s18-prep.cut.json (Sprint 18 prep): (1) the three oven pictures onto one canvas, top-left aligned on the cabinet frame, so a swap
changes only the glow or the door; (2) the magenta spill off the corn cut-outs (artdespill, 3 px band); (3) the jug's measuring lines read from jug-empty
into cut-data.json ("jug-lines": each line's height as a fraction of the jug's height from its top; the game reveals a full jug through a rising mask).
  python3 assets/cook/proto/_cut/post.py
"""
import glob, json, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
P = os.path.join(ROOT, "assets/cook/proto")

STEPS = sys.argv[1:] or ["ovens", "despill", "jug", "fix"]  # a step alone re-runs only that step (they re-encode, so none is idempotent)


def fix_art_check():
    """artcheck's pixel rules (Sprint 18 merge): (1) egg-pot-boil keeps a flat key-grey sliver of the sheet's ground inside the left handle's loop:
    it goes transparent (every flat key-grey patch of 16 px or more that touches the outline); (2) the partial-alpha pieces (the raw fried egg and
    the two shakers) get their soft rim tightened: alpha below 0.3 is 0, above 0.8 is 1, a ramp between."""
    from scipy import ndimage as ndi
    f = os.path.join(P, "eggs", "egg-pot-boil.webp")
    im = np.asarray(Image.open(f).convert("RGBA")).astype(float)
    rgb, a = im[..., :3], im[..., 3] / 255
    key = (np.abs(rgb - 122).max(2) <= 14) & ((rgb.max(2) - rgb.min(2)) < 12) & (a >= 0.9)
    lab, n = ndi.label(key)
    near_out = ndi.binary_dilation(a <= 0.04, iterations=3)
    cleared = 0
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() >= 16 and (m & near_out).any():
            im[ndi.binary_dilation(m, iterations=1), 3] = 0
            cleared += int(m.sum())
    Image.fromarray(im.astype("uint8"), "RGBA").save(f, quality=90, method=6)
    print("egg-pot-boil: key grey cleared", cleared, "px")
    for n_ in ("egg-fried-raw", "shaker-salt-t", "shaker-pepper-t"):
        f = os.path.join(P, "eggs", n_ + ".webp")
        im = np.asarray(Image.open(f).convert("RGBA")).astype(float)
        a = im[..., 3] / 255
        im[..., 3] = np.clip((a - 0.3) / 0.5, 0, 1) * 255
        Image.fromarray(im.astype("uint8"), "RGBA").save(f, quality=90, method=6)
        print(n_, "alpha tightened")

if "ovens" in STEPS:
    ov = [os.path.join(P, "baking", n + ".webp") for n in ("oven-shut", "oven-baking", "oven-open")]
    ims = [Image.open(p).convert("RGBA") for p in ov]
    W, H = max(i.width for i in ims), max(i.height for i in ims)
    for p, im in zip(ov, ims):
        c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        c.alpha_composite(im, (0, 0))
        c.save(p, quality=90, method=6)
    print("ovens on one canvas", W, H)

if "despill" in STEPS:
    subprocess.run([sys.executable, os.path.join(ROOT, "build/tools/art/artdespill.py"), "--band", "3"] + sorted(glob.glob(os.path.join(P, "corn", "cob-*.webp")) + [os.path.join(P, "corn", "corn-crate.webp")]), check=False)  # the magenta-ground sheets only (CB, CX)

if "fix" in STEPS:
    fix_art_check()

if "jug" in STEPS:
    d = json.load(open(os.path.join(P, "_cut", "cut-data.json")))
    j = np.asarray(Image.open(os.path.join(P, "baking", "jug-empty.webp")).convert("RGBA")).astype(float)
    h, w = j.shape[:2]
    # the lines: short bright horizontal dashes inside the jug's body (white, near-opaque), one per row group
    bright = (j[..., :3].min(2) > 225) & (j[..., 3] > 200)
    rows = np.where(bright[:, int(w * .3):int(w * .6)].sum(1) >= max(6, w * 0.04))[0]
    groups = []
    for r in rows:
        if groups and r - groups[-1][-1] <= 2:
            groups[-1].append(r)
        else:
            groups.append([r])
    lines = [round(float(np.mean(g)) / h, 3) for g in groups][:5]  # the five lines (a sixth bright patch near the base is a highlight)
    d["props"]["jug-lines"] = {"from_top_fraction_of_jug-empty": lines, "jug_px": [w, h], "note": "five lines, no numbers; the game's quarter, half, full, one and a half, two and a half"}
    print("jug lines", lines)
    json.dump(d, open(os.path.join(P, "_cut", "cut-data.json"), "w"), indent=1, ensure_ascii=False)
