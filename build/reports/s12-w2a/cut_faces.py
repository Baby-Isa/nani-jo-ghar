#!/usr/bin/env python3
"""ART-08 (S12 W2-A): cut the four face circles from the passport sheet Zafar passed (23 Oct), by ONE rule for all four.

  python3 build/reports/s12-w2a/cut_faces.py            -> assets/shared/faces/{doctor,girl,nani,nana}.webp (128 px)

The rule (docs/design-language/art-plans/s12-art-plan.md section 2): a circle centred on the NOSE, its diameter 1.5 times the
head's height (the top of the hair, scarf or cap to the chin or the beard's end), so every head is the same size in its circle
and both ears (or both sides of the scarf) show. The flat #808080 ground is keyed out where it touches the cell's edge (a flood
fill, so grey shading inside the figure stays), its edge softened by a pixel; outside the circle is transparent. The CSS never
crops again (object-fit cover on a square: nothing to crop). The landmarks were read off the sheet by eye (each cell 768 x 512).
"""
import os
from collections import deque
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SRC = os.path.join(ROOT, "sources/art/s12/fc-face-circles-v1.png")
OUT = os.path.join(ROOT, "assets/shared/faces")
SIZE = 128  # drawn at 44-83 px (decision 68: never over 3x the smallest drawn size)
# cell origin, nose (in the cell), head top and chin (y in the cell)
FACES = {
    "doctor": {"cell": (0, 0), "nose": (398, 232), "top": 42, "chin": 338},
    "girl": {"cell": (768, 0), "nose": (380, 275), "top": 55, "chin": 350},
    "nani": {"cell": (0, 512), "nose": (400, 228), "top": 22, "chin": 315},
    "nana": {"cell": (768, 512), "nose": (376, 215), "top": 20, "chin": 330},
}
GREY = (118, 118, 119)  # the sheet's flat ground as drawn (asked for #808080)


def key_ground(cell):
    """Alpha: 0 on the flat grey connected to the cell's edge, 255 elsewhere, the edge softened."""
    w, h = cell.size
    px = cell.load()
    near = lambda p: max(abs(p[0] - GREY[0]), abs(p[1] - GREY[1]), abs(p[2] - GREY[2])) <= 22
    bg = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near(px[x, y]) and not bg[y * w + x]:
                bg[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if near(px[x, y]) and not bg[y * w + x]:
                bg[y * w + x] = 1
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bg[ny * w + nx] and near(px[nx, ny]):
                bg[ny * w + nx] = 1
                q.append((nx, ny))
    # the ground shut in by the figure (between a plait and the neck): a patch of the exact ground colour, big enough not to be
    # shading, is ground too
    tight = lambda p: max(abs(p[0] - GREY[0]), abs(p[1] - GREY[1]), abs(p[2] - GREY[2])) <= 7
    seen = bytearray(w * h)
    for y0 in range(h):
        for x0 in range(w):
            i0 = y0 * w + x0
            if bg[i0] or seen[i0] or not tight(px[x0, y0]):
                continue
            comp = [(x0, y0)]
            seen[i0] = 1
            k = 0
            while k < len(comp):
                x, y = comp[k]
                k += 1
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    j = ny * w + nx
                    if 0 <= nx < w and 0 <= ny < h and not seen[j] and not bg[j] and tight(px[nx, ny]):
                        seen[j] = 1
                        comp.append((nx, ny))
            if len(comp) >= 150:
                for x, y in comp:
                    bg[y * w + x] = 1
    a = Image.frombytes("L", (w, h), bytes(0 if b else 255 for b in bg))
    return a.filter(ImageFilter.GaussianBlur(0.8))


def main():
    sheet = Image.open(SRC).convert("RGB")
    os.makedirs(OUT, exist_ok=True)
    report = []
    for name, f in FACES.items():
        cx, cy = f["cell"]
        cell = sheet.crop((cx, cy, cx + 768, cy + 512))
        rgba = cell.convert("RGBA")
        rgba.putalpha(key_ground(cell))
        head = f["chin"] - f["top"]
        d = round(1.5 * head)
        nx, ny = f["nose"]
        box = (nx - d // 2, ny - d // 2, nx - d // 2 + d, ny - d // 2 + d)
        sq = Image.new("RGBA", (d, d), (0, 0, 0, 0))
        sq.paste(rgba.crop((max(0, box[0]), max(0, box[1]), min(768, box[2]), min(512, box[3]))), (max(0, -box[0]), max(0, -box[1])))
        sq = sq.resize((SIZE, SIZE), Image.LANCZOS)
        # the circle: transparent outside it (drawn at 4x for a smooth edge)
        m = Image.new("L", (SIZE * 4, SIZE * 4), 0)
        ImageDraw.Draw(m).ellipse((0, 0, SIZE * 4 - 1, SIZE * 4 - 1), fill=255)
        m = m.resize((SIZE, SIZE), Image.LANCZOS)
        a = Image.composite(sq.getchannel("A"), Image.new("L", (SIZE, SIZE), 0), m)
        sq.putalpha(a)
        path = os.path.join(OUT, f"{name}.webp")
        sq.save(path, "WEBP", quality=90, method=6)
        report.append(f"{name}: head {head} px, circle {d} px round the nose {f['nose']}, -> {os.path.relpath(path, ROOT)}")
    print("\n".join(report))


if __name__ == "__main__":
    main()
