"""s08-clinic-items (GS1 on the standing canvas). usage, from the repo root: python3 build/reports/s08-clinic-items.tostand.py OUT_DIR SITTING_SORE@2x.webp
Move a sitting face layer onto the standing canvas by the same scale and shift s07 used: found by fitting the sitting
sad layer onto the standing sad layer (both exist), checked by the residual, then applied to the new layer."""
import sys, numpy as np, cv2
from PIL import Image

G = 'assets/clinic/patients/girl/'
out_dir = sys.argv[1]


def ld(p):
    return np.array(Image.open(p).convert('RGBA')).astype(np.float32)


sit = ld(G + 'girl-face-sad@2x.webp')
std = ld(G + 'girl-stand-face-sad@2x.webp')
print('sit', sit.shape, 'stand', std.shape)
# coarse: template match of the sitting layer's face box (scaled 1.15..1.30) in the standing layer, on premultiplied colour
ys, xs = np.nonzero(sit[..., 3] > 128)
box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
pm = lambda a: a[..., :3] * (a[..., 3:] / 255)
best = None
for s in np.arange(1.10, 1.36, 0.005):
    crop = pm(sit)[box[1]:box[3], box[0]:box[2]]
    t = cv2.resize(crop, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    if t.shape[0] >= std.shape[0] or t.shape[1] >= std.shape[1]:
        continue
    r = cv2.matchTemplate(pm(std).astype(np.float32), t.astype(np.float32), cv2.TM_SQDIFF_NORMED)
    v, _, loc, _ = cv2.minMaxLoc(r)
    if best is None or v < best[0]:
        best = (v, s, loc)
v, s, loc = best
tx, ty = loc[0] - box[0] * s, loc[1] - box[1] * s
M = np.array([[s, 0, tx], [0, s, ty]], np.float32)
print('scale %.3f shift %.1f,%.1f (sqdiff %.4f)' % (s, tx, ty, v))


def move(a):
    return cv2.warpAffine(a, M, (std.shape[1], std.shape[0]), flags=cv2.INTER_LANCZOS4, borderValue=(0, 0, 0, 0))


chk = move(sit)
m = (std[..., 3] > 128) | (chk[..., 3] > 128)
print('check: sitting sad moved vs standing sad: mean |diff| %.2f (0-255), alpha IoU %.3f' % (
    np.abs(pm(chk) - pm(std))[m].mean(), ((std[..., 3] > 128) & (chk[..., 3] > 128)).sum() / m.sum()))
new = np.clip(move(ld(G.replace(G, sys.argv[2]))), 0, 255).astype(np.uint8)
im = Image.fromarray(new, 'RGBA')
im.save(out_dir + '/girl-stand-face-sore@2x.webp', quality=92, method=6)
one = Image.open(G + 'girl-stand-face-sad.webp').size
im.resize(one, Image.LANCZOS).save(out_dir + '/girl-stand-face-sore.webp', quality=92, method=6)
print('wrote', im.size, one)
