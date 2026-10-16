#!/usr/bin/env python3
"""s08-placement-fix: his card portrait framed like the old one (s07's patients/doctor/faces, before 2825e2a9).

The v3 faces (artcut.py specs/s08.cut.json doctor3-faces) are a closer crop: shown in the card's circle (object-fit cover)
his head is 0.66 of the circle and his crown touches it. The old portrait: head 0.51 of the circle, crown 0.03 under its
top. Here each face is cut again by the spec (to a temp folder), scaled by one factor k (the neutral's head to 0.56 of a
144 px square), placed on a square canvas with its crown at 0.04 (every face's own), and the bust below the shoulders
stretched down to the canvas's bottom (the sheet's bust ends at its cell, and the circle shows the bottom fifth), so the
circle is filled to its bottom as before. One trade-off: his head is 0.56 of the circle (old 0.51, v3 0.66): at 0.52 the collar
reads as a long neck (stretched 3-4x). Writes assets/clinic/patients/doctor/v2/faces/*.webp.
  python3 build/reports/s08-placement-fix.reframe.py
"""
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, "assets", "clinic", "patients", "doctor", "v2", "faces")
C = 144
HEAD = 0.56  # his head width over the circle: the old portrait had 0.51 (63 px of a 123 px tall, cover-fitted picture), v3 0.66
CROWN = 0.04  # his crown under the circle's top (the old portrait: 0.033, v3: 0.02)

tmp = tempfile.mkdtemp()
subprocess.run([sys.executable, os.path.join(REPO, "build/tools/art/artcut.py"), os.path.join(REPO, "build/tools/art/specs/s08.cut.json"), "--only", "doctor3-faces", "--out", tmp], check=True, stdout=subprocess.DEVNULL)
src = next(os.path.join(r, "") for r, _, fs in os.walk(tmp) if "neutral.webp" in fs)


def alpha(im):
    return np.array(im)[:, :, 3] > 128


def head_width(im):
    a = alpha(im)
    ys = np.where(a.any(1))[0]
    top = ys[0]
    # the head: the widest row in the upper half of the picture (the ears), above the shoulders
    band = a[top: top + int(0.55 * a.shape[0])]
    return max(int(r.sum()) for r in band), top


neutral = Image.open(src + "neutral.webp").convert("RGBA")
hw, _ = head_width(neutral)
k = HEAD * C / hw
for name in ["neutral", "talk", "laugh", "think"]:
    im = Image.open(src + name + ".webp").convert("RGBA")
    _, top = head_width(im)
    w, h = round(im.width * k), round(im.height * k)
    sm = im.resize((w, h), Image.LANCZOS)
    can = Image.new("RGBA", (C, C), (0, 0, 0, 0))
    y0 = round(CROWN * C - top * k)
    can.alpha_composite(sm, ((C - w) // 2, y0))
    arr = np.array(can)
    a = arr[:, :, 3]
    last = max(y for y in range(C) if a[y].max() > 200)
    # the bust below the shoulders stretched down to the canvas's bottom: the jacket and the shirt
    # carry on as drawn, only taller, so nothing new is painted
    # (from where the shoulders pass 0.75 of the bust's width: under the beard, so his face is never stretched)
    wide = (a > 200).sum(1)
    ya = next(y for y in range(int(0.55 * C), C) if wide[y] >= 0.75 * wide.max())
    band = Image.fromarray(arr[ya:last - 1]).resize((C, C - ya), Image.LANCZOS)
    arr[ya:] = np.array(band)
    Image.fromarray(arr).save(os.path.join(OUT, name + ".webp"), quality=92, method=6)
    print(name, "k", round(k, 3), "content", w, h, "top", y0, f"bust rows {ya}-{last - 1} stretched x{(C - ya) / (last - 1 - ya):.2f}")
