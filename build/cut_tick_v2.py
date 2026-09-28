"""Cut the results tick sheet (sources/art/chatgpt-results-260928/ui-results-tick-v2.webp)
into three identically registered transparent webps: tick-gold, tick-grey, tick-gold-glow.
Solid core = alpha 1 (so the grey pewter stays opaque); edges and glow use colour-to-alpha
against the measured background, which removes the grey baked into antialiasing and glow."""
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage as ndi
SRC = 'sources/art/chatgpt-results-260928/ui-results-tick-v2.webp'
OUT = 'assets/ui/results/'
a = np.asarray(Image.open(SRC).convert('RGB')).astype(float)
edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
bg = np.median(edge, 0)
cells = [(0, 680), (680, 1340), (1340, 2000)]

def cut(x0, x1, glow, a=a, bg=bg, solid=False):
    c = a[:, x0:x1]
    d = np.abs(c - bg).max(2)
    # the object = everything not connected to the (very flat) background: no holes in the pewter
    lab, _ = ndi.label(d < 8)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ~np.isin(lab, list(border))
    if glow:  # the body only: strongly different from the grey, holes filled, largest piece
        body = ndi.binary_fill_holes(d > (60 if solid else 90))
        lb, n = ndi.label(body)
        body = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
        core = ndi.binary_erosion(body, iterations=3)
    else:
        obj = ndi.binary_fill_holes(obj)
        lb, n = ndi.label(obj)
        obj = lb == (np.argmax(np.bincount(lb.ravel())[1:]) + 1)
        core = ndi.binary_erosion(obj, iterations=3)
    up = np.where(c > bg, (c - bg) / (255 - bg), (bg - c) / bg)
    alpha = np.clip(up.max(2), 0, 1)
    if not glow:
        alpha = np.where(ndi.binary_dilation(obj, iterations=2), alpha, 0)
    alpha = np.clip((alpha - 0.03) / 0.97, 0, 1)
    alpha = np.where(core, 1.0, alpha)
    safe = np.maximum(alpha, 1e-3)[..., None]
    rgb = np.where(core[..., None], c, np.clip((c - bg) / safe + bg, 0, 255))
    img = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    ys, xs = np.nonzero(core)
    return Image.fromarray(img, 'RGBA'), (xs.min(), ys.min(), xs.max(), ys.max())

if __name__ == '__main__':
  gold, gb = cut(*cells[0], False)
  grey, sb = cut(*cells[1], False)
  glow, wb = cut(*cells[2], True)
  W0 = gb[2] - gb[0]
  PAD = int(W0 * 0.14)  # room for the glow and sparkles
  CW, CH = W0 + 2 * PAD, (gb[3] - gb[1]) + 2 * PAD

  def place(img, box):
      s = W0 / (box[2] - box[0])
      img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
      canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
      canvas.alpha_composite(img, (round(PAD - box[0] * s), round(PAD - box[1] * s)))
      return canvas.resize((512, round(512 * CH / CW)), Image.LANCZOS)

  for name, img, box in [('tick-gold', gold, gb), ('tick-grey', grey, sb), ('tick-gold-glow', glow, wb)]:
      place(img, box).save(OUT + name + '.webp', quality=92, method=6)
      print(name, 'ok')
