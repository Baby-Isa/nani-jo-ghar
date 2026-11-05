"""Cut pack s17-pc2 (Zafar, 5 Nov, ART-41: "I like 1 ... this colour left and bottom panel and this ledge style ... add this"): the
stone tile for the side panel and the shelf band, and the stone shelf strip the jars stand on.

ST: the middle 1024 of his tile, its edges cross-faded with the opposite edges (a wrap blend, as the white marble) so it tiles with
no seam; x2 (1024) and x1 (512). SL: his strip's rows from the shelf's top face to the end of its shadow (the wall above and the white
below dropped), the shadow baked from its own darkness onto the stone's colour (a solid strip), its left and right edges cross-faded so it repeats
side by side; x2 (1536 wide) and x1 (768).

  python3 build/tools/art/cut_s17_pc2.py   # writes assets/shared/panel/stone-tile-s17{,@1x}.webp, stone-shelf-s17{,@1x}.webp
"""
import json
import os

import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
OUT = os.path.join(ROOT, "assets", "shared", "panel")
ST = "sources/art/s17-pc2/st-stone-tile-v1.webp"
SL = "sources/art/s17-pc2/sl-stone-shelf-strip-v1.webp"
# SL's rows (read off the picture, 5 Nov): the wall ends at 545, the top face 546-608, the front edge 609-666, the shadow 667-700
SL_TOP, SL_EDGE, SL_SHADOW, SL_END = 546, 609, 667, 701


def wrap_blend(a, band, axis):
    """Cross-fade the first and last `band` pixels along `axis` so the picture repeats with no seam (the result is `band` shorter)."""
    a = np.moveaxis(a, axis, 0)
    n = a.shape[0]
    t = np.linspace(0, 1, band)[:, None, None] if a.ndim == 3 else np.linspace(0, 1, band)[:, None]
    head = a[:band] * t + a[n - band:] * (1 - t)
    out = np.concatenate([head, a[band:n - band]], axis=0)
    return np.moveaxis(out, 0, axis)


def save(im, name, w1):
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=88, method=6)
    im.resize((w1, round(im.height * w1 / im.width)), Image.LANCZOS).save(os.path.join(OUT, name + "@1x.webp"), "WEBP", quality=88, method=6)


def main():
    st = np.asarray(Image.open(os.path.join(ROOT, ST)).convert("RGB")).astype(float)
    h, w = st.shape[:2]
    c = st[(h - 1152) // 2:(h + 1152) // 2, (w - 1152) // 2:(w + 1152) // 2]
    c = wrap_blend(wrap_blend(c, 128, 1), 128, 0)  # (1152 - 128 = 1024 each way)
    tile = Image.fromarray(np.clip(c, 0, 255).astype(np.uint8))
    save(tile, "stone-tile-s17", 512)
    mean = c.reshape(-1, 3).mean(0)

    sl = np.asarray(Image.open(os.path.join(ROOT, SL)).convert("RGB")).astype(float)[SL_TOP:SL_END]
    sl = wrap_blend(sl, 96, 1)
    rgba = np.zeros(sl.shape[:2] + (4,))
    rgba[..., :3] = sl
    rgba[..., 3] = 255
    # the shadow: from its darkness against the white below (white -> clear), drawn as a soft warm dark
    k = SL_SHADOW - SL_TOP
    lum = sl[k:].mean(2)
    a = np.clip((250 - lum) / (250 - 150), 0, 1)
    # (it always lies on the stone band, so the shadow is baked onto the stone's own colour: the strip is solid, no see-through
    # edge for the art check to flag; the band's tile and this colour differ by under 2%)
    a = (a * 150 / 255)[..., None]
    rgba[k:, :, :3] = np.array([92, 78, 66]) * a + mean * (1 - a)
    rgba[k:, :, 3] = 255
    strip = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA")
    save(strip, "stone-shelf-s17", 768)
    meta = {"tile_mean": "#%02x%02x%02x" % tuple(int(round(x)) for x in mean), "shelf": {"w": strip.width, "h": strip.height, "top_face": [0, SL_EDGE - SL_TOP], "front_edge": [SL_EDGE - SL_TOP, SL_SHADOW - SL_TOP], "shadow": [SL_SHADOW - SL_TOP, SL_END - SL_TOP]}}
    json.dump(meta, open(os.path.join(OUT, "panel-s17.json"), "w"), indent=1)
    print(json.dumps(meta))


if __name__ == "__main__":
    main()
