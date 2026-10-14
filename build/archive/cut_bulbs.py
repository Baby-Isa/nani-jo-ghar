"""Re-cut the four results bulbs from the ChatGPT sheet with the tick cutter's matte
(flood-filled object, holes filled so the clear 'off' glass stays solid, colour-to-alpha
edges and glow) and register all four at the same size and position."""
from PIL import Image
import numpy as np, sys
sys.path.insert(0, 'build')
import cut_tick_v2 as T
SRC = 'sources/art/chatgpt-results-260928/ChatGPT Image Sep 28, 2026, 12_23_52 PM.png'
a = np.asarray(Image.open(SRC).convert('RGB')).astype(float)
edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
bg = np.median(edge, 0)
w = a.shape[1] // 4
cuts = [T.cut(k * w, (k + 1) * w, k == 0, a=a, bg=bg, solid=True) for k in range(4)]
H0 = max(b[3] - b[1] for _, b in cuts)
W0 = max(b[2] - b[0] for _, b in cuts)
PAD = int(H0 * 0.22)
CW, CH = W0 + 2 * PAD, H0 + 2 * PAD
for k, (img, b) in enumerate(cuts):
    s = H0 / (b[3] - b[1])
    im = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    cx = (b[0] + b[2]) / 2 * s
    canvas.alpha_composite(im, (round(CW / 2 - cx), round(PAD - b[1] * s)))
    canvas.resize((round(512 * CW / CH), 512), Image.LANCZOS).save(f'assets/ui/results/bulb-{k}.webp', quality=92, method=6)
    print('bulb', k, 'ok')
