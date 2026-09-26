#!/usr/bin/env python3
"""Cuts poses that don't sit on an even grid (the animal sheets: four
turnaround views over five poses, a swatch strip, a size panel) by hand-set
boxes, with slice_sheet.py's keying (same key detection, soft edge, grey or
magenta rules). Each box is cropped, anything that pokes in across the box's
edge from a neighbour is painted out with the key colour, and the crop is
cut as a 1x1 sheet.

Usage:
  python3 build/cut_boxes.py <sheet.png> <out_dir> name=x0,y0,x1,y1 ... [--key grey|magenta] [--fluffy]

Boxes are in sheet pixels; give them a little air round the pose.
"""
import argparse
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import slice_sheet as ss  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet")
    ap.add_argument("out_dir")
    ap.add_argument("boxes", nargs="+")
    ap.add_argument("--key", choices=ss.KEYS, default="grey")
    ap.add_argument("--fluffy", action="store_true", help="pass every pose to slice_sheet.py's --fluffy (down, fur)")
    args = ap.parse_args()

    rgb = np.asarray(Image.open(args.sheet).convert("RGB")).astype(float)
    K = ss.measure_key(rgb, ss.KEYS[args.key])
    bg, _ = ss.background_mask(rgb, K, args.key)
    fg = ~bg
    here = os.path.dirname(os.path.abspath(__file__))
    with tempfile.TemporaryDirectory() as tmp:
        for spec in args.boxes:
            name, _, box = spec.partition("=")
            x0, y0, x1, y1 = (int(v) for v in box.split(","))
            sub = rgb[y0:y1, x0:x1].copy()
            f = fg[y0:y1, x0:x1]
            lab, _ = ndi.label(f, structure=np.ones((3, 3)))
            edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
            stray = np.isin(lab, edge[edge > 0])
            sub[stray] = K
            m = 24
            canvas = np.empty((sub.shape[0] + 2 * m, sub.shape[1] + 2 * m, 3))
            canvas[:] = K
            canvas[m:-m, m:-m] = sub
            p = os.path.join(tmp, name + ".png")
            Image.fromarray(canvas.round().astype(np.uint8), "RGB").save(p)
            subprocess.check_call([sys.executable, os.path.join(here, "slice_sheet.py"), p, "1", "1",
                                   args.out_dir, name, "--key", args.key]
                                  + (["--fluffy", name] if args.fluffy else []))


if __name__ == "__main__":
    main()
