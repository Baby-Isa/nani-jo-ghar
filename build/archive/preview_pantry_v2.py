"""Check sheet for the pantry v2 cuts: each sheet's nine on the game's cream and on shelf wood.
python3 build/preview_pantry_v2.py shelf|icon out.png [scale]"""
import sys
sys.path.insert(0, 'build')
from PIL import Image
from cut_pantry_v2 import ids_from_doc
kind, out = sys.argv[1], sys.argv[2]
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5
ids = ids_from_doc()
name = (lambda i: f'assets/cook/items/shelf-{i}-bare-f.webp') if kind == 'shelf' else (lambda i: f'assets/cook/items/icon-{i}.webp')
rows = [[Image.open(name(i)) for i in ids[p]] for p in range(1, 8)]
rows = [[im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS) for im in r] for r in rows]
W = max(im.width for r in rows for im in r); H = max(im.height for r in rows for im in r)
c = Image.new('RGB', (W * 18, H * len(rows)), (246, 238, 222))
c.paste((207, 137, 71), (W * 9, 0, W * 18, H * len(rows)))
for y, r in enumerate(rows):
    for x, im in enumerate(r):
        for half in (0, 9):
            c.paste(im, ((x + half) * W, (y + 1) * H - im.height), im)
c.save(out)
