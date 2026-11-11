#!/usr/bin/env python3
"""Cut the S19 kitchen-and-items run (11 Nov) off magenta with s19_cut.py's keying, then edge_bleed's clean edge.
Each pick in sources/art/s19-k2/results/best/ -> its pieces in reading order (rows, then left to right), saved as webp.
The kitchen paintings (KG, KO, KS) and B5 (jugs drawn on a wall, not magenta) are not cut here.
Usage: python3 build/tools/art/s19_k2_cut.py [--only SD1,D3]"""
import os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from s19_cut import alpha_of, despill, save, pieces
from edge_bleed import bleed

SRC = "sources/art/s19-k2/results/best/"
OUT = "assets/cook/"
LINES = {
    "KT": ("serve", ["tray-src"], 1400),
    "SD1": ("serve", ["dish-chai", "dish-maani", "dish-daar"], 640),
    "SD2": ("serve", ["dish-sekelo", "dish-samosa", "dish-chaat"], 640),
    "SD3": ("serve", ["dish-corn", "dish-naan", "dish-chop"], 640),
    "D1": ("items/v4/daar", ["pot-empty"], 1000),
    "D2": ("items/v4/daar", ["pot-oil"], 1000),
    "D3": ("items/v4/daar", ["disc-seeds", "disc-onion", "disc-onion-chilli", "disc-masala", "disc-daar", "disc-tadka"], 520),
    "K8": ("items/v4/samosa", ["karahi-oil"], 1000),
    "M1": ("items/v4/maani", ["board", "pin"], 900),
    "K2b": ("items/v4/sekelo", [f"{k}-{s}" for k in ("chicken", "chilli", "corn") for s in ("raw", "part", "cooked", "over")], 360),
    "K9": ("items/v4/sekelo", [f"bowl-{k}" for k in ("meat", "tomato", "onion", "pepper", "potato", "chicken", "chilli", "corn")], 420),
    "E5": ("items/v4/eggs", ["egg-whole", "boiled-runny-a", "boiled-runny-b", "boiled-soft-a", "boiled-soft-b", "boiled-firm-a", "boiled-firm-b", "boiled-over-a", "boiled-over-b"], 360),
    "S5": ("items/v4/samosa", ["plate-napkin"], 900),
    "B3a": ("items/v4/baking", ["naan-tray-raw", "naan-tray-part"], 900),
    "B3b": ("items/v4/baking", ["naan-tray-baked", "naan-tray-over"], 900),
    "PS1": ("items/v4/pantry", ["orange", "apple", "pear"], 420),
    "P1": ("items/v4/kit", ["pot-water"], 900),
    "P2": ("items/v4/kit", ["pot-empty"], 900),
}

def main():
    only = None
    if "--only" in sys.argv: only = sys.argv[sys.argv.index("--only") + 1].split(",")
    done = []
    for line, (folder, names, maxside) in LINES.items():
        if only and line not in only: continue
        a = np.asarray(Image.open(SRC + line + ".png").convert("RGB")).astype(float)
        al = alpha_of(a); rgb = despill(a, al)
        ps = pieces(al, len(names))
        if len(ps) != len(names): print(f"{line}: found {len(ps)} pieces, want {len(names)}")
        for (lab, ids, box), nm in zip(ps, names):
            path = f"{OUT}{folder}/{nm}.webp"
            save(rgb, al, box, ids, lab, path, maxside)
            im = np.asarray(Image.open(path).convert("RGBA"))
            Image.fromarray(bleed(im), "RGBA").save(path, "WEBP", quality=90, method=6, exact=True)
            done.append(path)
    print(len(done), "pieces")

if __name__ == "__main__":
    main()
