#!/usr/bin/env python3
"""Hands v3 master fixes in code (26 Sept 2026).

    python3 build/hand_v3_keys.py b1 build/hand-v3-raw/b1-v0.png   # key a blue-tool render into a master
    python3 build/hand_v3_keys.py edges POSE [POSE...]             # repair ragged key-out edges
    python3 build/hand_v3_keys.py frame POSE                       # clear a stray line at the canvas edge
    python3 build/hand_v3_keys.py relight-left POSE                # re-light a mirrored left hand in a two-hand master

key_blue: the tool is a cobalt-blue object drawn by the model (build/hand_v3_gen.py).
Skin, nails and sleeve carry no blue at all (Lab b* > 0 everywhere), so the
tool's weight is read straight off b*: pure tool (b* < -35) is removed, pure
hand (b* > 5) kept, and the anti-aliased and bounce-lit band between is
unmixed: alpha drops by the blue share and the tool colour is taken back
out of the pixel, leaving a clean edge and a clean gap for the game's tool
sprite. The result then goes through the usual master normalisers (skin
distribution matched to the reference hand, forearm scaled to 250 px).

repair_edges: for the older magenta-keyed masters whose gaps came out
stair-stepped or torn. The hand's alpha is smoothed (a blurred silhouette
thresholded at the edge, which rounds off steps smaller than about a
blur radius) and re-anti-aliased; pixels the smoothing adds are filled
by inpainting from the skin next to them, pixels it removes go
transparent. Fine anatomy (fingertips, the webs) is kept by limiting the
change to a band where the old edge was jagged: the difference between
the old alpha and its opening/closing.
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402

GAME = ga.GAME
MASTER = os.path.join(GAME, "assets", "characters", "hands", "master")


# Poses whose render left a wider dark rim (the tool's shadow painted on the
# skin along the gap): a deeper clean-up band, set by eye.
RIM = {"d2-c-hold-t": {"band": 9, "max_de": 14.0}}


def key_blue(im):
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    lab = ga.rgb_to_lab(arr[..., :3])
    b = lab[..., 2]
    a = arr[..., 3] / 255.0
    w = np.clip((5.0 - b) / 40.0, 0, 1)  # blue share: 0 at b* >= 5, 1 at b* <= -35
    w = np.where(a > 0, w, 0)
    # the tool's own colour near each pixel, for unmixing: median of pure tool pixels
    core = (w > 0.98) & (a > 0.9)
    tool = np.median(arr[core][:, :3], axis=0) if core.any() else np.array([40, 80, 230.0])
    # colour of the band where the tool touches: unmixing overshoots there
    # (a yellow or dark-red rim), so those pixels take the colour of the
    # nearest clean hand pixel instead; alpha carries the edge
    rgb = arr[..., :3].copy()
    clean = (w < 0.02) & (a > 0.95)
    touched = (ndimage.binary_dilation(w > 0.02, iterations=2)) & ~clean & (a > 0)
    if clean.any() and touched.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~clean, return_indices=True)
        rgb[touched] = rgb[iy[touched], ix[touched]]
    alpha = a * np.clip(1 - 1.6 * w, 0, 1)
    # the rod's pale specular rim survives the unmix as grey slivers: drop
    # low-chroma pixels within a few px of the tool
    near = ndimage.binary_dilation(w > 0.5, iterations=5)
    chroma = np.hypot(lab[..., 1], lab[..., 2])
    alpha = np.where(near & (chroma < 14), 0, alpha)
    # drop specks and fragments of the tool's shadow that survive (blobs
    # under 3% of the largest; a second hand is far bigger)
    lbl, n = ndimage.label(alpha > 0.1)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(alpha), lbl, range(1, n + 1))
        keep_ids = [i + 1 for i, sz in enumerate(sizes) if sz >= 0.03 * sizes.max()]
        alpha = np.where(np.isin(lbl, keep_ids) | (lbl == 0), alpha, 0)
    # the tool's contact shadow on the (transparent) ground: faint pixels
    # well away from the hand
    far = ndimage.distance_transform_edt(alpha < 0.6) > 3
    alpha = np.where(far & (alpha < 0.6), 0, alpha)
    out = np.dstack([rgb, alpha * 255])
    return Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8), "RGBA")


def decontaminate_rim(im, band=3, max_de=10.0):
    """A thin rim of off-colour (a yellow rim light, a red bounce) along the
    silhouette: pixels within `band` px of the edge whose colour is more
    than max_de (Lab) from the nearest interior pixel take the interior
    colour, keeping their alpha."""
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    a = arr[..., 3]
    solid = a > 127
    inner = ndimage.binary_erosion(solid, iterations=band + 1)
    rim = (a > 0) & ~inner
    if not inner.any():
        return im
    _, (iy, ix) = ndimage.distance_transform_edt(~inner, return_indices=True)
    src = arr[iy, ix, :3]
    de = np.linalg.norm(ga.rgb_to_lab(arr[..., :3]) - ga.rgb_to_lab(src), axis=-1)
    fix = rim & (de > max_de)
    arr[fix, :3] = src[fix]
    return Image.fromarray(np.clip(arr + 0.5, 0, 255).astype(np.uint8), "RGBA")


def normalise(im, entry_id):
    data = ga.load_asset_list(ga.DEFAULT_ASSET_LIST)
    cfg = ga.load_config(data)
    entry = next(e for e in data["assets"] if e["id"] == entry_id)
    entry = dict(entry, key_out=None)
    return ga.post_process_hand(entry, im, cfg)


def repair_edges(im, sigma=2.2, band=5):
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    a = arr[..., 3] / 255.0
    solid = a > 0.5
    # where the edge is jagged: the change an opening + closing makes
    r = band
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    disc = xx * xx + yy * yy <= r * r
    oc = ndimage.binary_closing(ndimage.binary_opening(solid, disc), disc)
    jag = ndimage.binary_dilation(oc ^ solid, disc, iterations=2)
    # smoothed silhouette
    sm = ndimage.gaussian_filter(solid.astype(np.float64), sigma)
    new_a = np.clip((sm - 0.5) * 2.2 + 0.5, 0, 1)
    new_a = np.where(jag, new_a, a)
    # colour for pixels that become (more) opaque: inpaint from solid skin nearby
    grow = (new_a > 0.5) & ~solid
    rgb = arr[..., :3].copy()
    if grow.any():
        src = solid & ~jag | (solid & (a > 0.95))
        dist, (iy, ix) = ndimage.distance_transform_edt(~src, return_indices=True)
        fill = rgb[iy, ix]
        # blur the fill a little so it isn't a smear of one pixel's colour
        for c in range(3):
            fill[..., c] = ndimage.gaussian_filter(fill[..., c], 2.0)
        rgb = np.where(grow[..., None], fill, rgb)
    out = np.dstack([rgb, new_a * 255])
    return Image.fromarray(np.clip(out + 0.5, 0, 255).astype(np.uint8), "RGBA")


def trim_wisps(im, r=7):
    """Hair-thin wisps and specks along the edge (the tool's contact shadow
    left on the fingers): alpha is limited to the silhouette opened by a
    disc of radius r, feathered by a pixel."""
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    a = arr[..., 3] / 255.0
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    disc = xx * xx + yy * yy <= r * r
    body = ndimage.binary_opening(a > 0.25, disc)
    lim = ndimage.gaussian_filter(ndimage.binary_dilation(body, iterations=1).astype(np.float64), 0.8)
    arr[..., 3] = np.minimum(a, lim) * 255
    return Image.fromarray(np.clip(arr + 0.5, 0, 255).astype(np.uint8), "RGBA")


def despeckle_edge(im, band=8, drop=18.0):
    """Dark specks painted just inside the edge (the tool's shadow): pixels
    in the edge band much darker than the median of their neighbourhood
    take that median."""
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    solid = arr[..., 3] > 127
    edge = solid & ~ndimage.binary_erosion(solid, iterations=band)
    L = ga.rgb_to_lab(arr[..., :3])[..., 0]
    med = np.stack([ndimage.median_filter(arr[..., c], size=11) for c in range(3)], -1)
    Lm = ga.rgb_to_lab(med)[..., 0]
    fix = edge & (Lm - L > drop)
    fix = ndimage.binary_dilation(fix, iterations=1) & solid
    arr[fix, :3] = med[fix]
    return Image.fromarray(np.clip(arr + 0.5, 0, 255).astype(np.uint8), "RGBA")


def clear_frame(im, margin=24):
    """Remove faint stray pixels hugging the canvas edge (c5's frame line)
    that aren't part of an arm leaving the frame: any component of weak
    alpha within `margin` px of an edge."""
    arr = np.asarray(im.convert("RGBA")).copy()
    a = arr[..., 3]
    edge = np.zeros_like(a, bool)
    edge[:margin] = edge[-margin:] = True
    edge[:, :margin] = edge[:, -margin:] = True
    strong = ndimage.binary_dilation(a > 200, iterations=3)
    kill = edge & ~strong
    arr[..., 3] = np.where(kill, 0, a)
    return Image.fromarray(arr, "RGBA")


def main():
    cmd = sys.argv[1]
    if cmd in ("b1", "key"):
        # key POSE RAW: a blue-tool render keyed and normalised into the master
        pose, raw_path = ("b1-handle-grip-t", sys.argv[2]) if cmd == "b1" else (sys.argv[2], sys.argv[3])
        raw = Image.open(raw_path).convert("RGBA")
        im, info = normalise(key_blue(raw), f"hand-{pose}")
        im = despeckle_edge(decontaminate_rim(trim_wisps(im), **RIM.get(pose, {})))
        im.save(os.path.join(MASTER, f"hand-{pose}.png"))
        print(pose, json.dumps({k: v for k, v in info.items() if not isinstance(v, (list, dict))}))
    elif cmd == "edges":
        for pose in sys.argv[2:]:
            p = os.path.join(MASTER, f"{pose}.png")
            repair_edges(Image.open(p)).save(p)
            print("repaired", pose)
    elif cmd == "frame":
        p = os.path.join(MASTER, f"{sys.argv[2]}.png")
        clear_frame(Image.open(p)).save(p)
    elif cmd == "relight-left":
        import hand_jewellery3d as j3
        p = os.path.join(MASTER, f"{sys.argv[2]}.png")
        im = Image.open(p).convert("RGBA")
        region = np.zeros((im.height, im.width), bool)
        region[:, : im.width // 2] = True
        j3.relight_mirrored(im, region=region).save(p)


if __name__ == "__main__":
    main()
