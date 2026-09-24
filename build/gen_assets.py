#!/usr/bin/env python3
"""Image-generation pipeline for Nani jo Ghar: drives the OpenAI Images API
from a data file (`data/asset-list.json`) instead of one-off prompts, with
resume, a spending cap, contact sheets, a reskin drift check and an
edit-in-place cut-out helper.

Usage
-----
    # No key set, or explicit --dry-run: prints every planned request and
    # the estimated total cost. No network calls are made either way.
    python3 build/gen_assets.py --dry-run

    # Real run (needs OPENAI_API_KEY in the environment and network access
    # to api.openai.com). Stops before the cap would be exceeded.
    OPENAI_API_KEY=sk-... python3 build/gen_assets.py --budget 20

    # Only one group or one asset id, and more variants per pose:
    python3 build/gen_assets.py --only hands-master --variants 3

    # Build a labelled, checkerboard-backed contact sheet of a group's
    # current outputs, for review:
    python3 build/gen_assets.py --contact-sheet hands-master

    # Standalone drift check (also runs automatically after every
    # mode="reskin" generation, recorded in the manifest):
    python3 build/gen_assets.py --drift-check out/girl.png out/master.png

    # Cut an item added by an "edit" call out of its station background,
    # plus its shadow as a separate optional layer:
    python3 build/gen_assets.py --cutout empty-station.png edited-station.png \\
        assets/items/cook/onion-whole.png --shadow-out assets/items/cook/onion-whole-shadow.png

Asset list (`data/asset-list.json`): a `style_block` (placeholder text --
the art bible will supply the real one), a `templates` dict of named prompt
templates (`{style}` plus per-entry fields), `defaults`, and an `assets`
array. Each asset entry has an `id`, `group`, `output` path, `mode`
(`generate`, `edit`, or `reskin`), a `prompt` or `template`+`fields`, and
for `edit`/`reskin` a list of `reference_images` (may point into the
git-ignored `sources/private/`) and an optional `mask`. `reskin` entries
also give a `master` id: its output is used as the reference image and,
after generation, compared against it for shape drift.

Progress is recorded in `build/gen-manifest.json` by a hash of the
resolved prompt plus its inputs, so a re-run skips anything already done
whose inputs haven't changed and only redoes what has. The model name and
per-image price are the CONFIG dict below, not scattered through the
request code.
"""
import argparse
import base64
import hashlib
import io
import json
import os
import random
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

try:
    import requests
except ImportError:  # pragma: no cover - fall back to stdlib if requests is absent
    requests = None
    import urllib.request

GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_ASSET_LIST = os.path.join(GAME, "data", "asset-list.json")
DEFAULT_MANIFEST = os.path.join(GAME, "build", "gen-manifest.json")
DEFAULT_CONTACT_SHEET_DIR = os.path.join(GAME, "build", "contact-sheets")

# --- Config: model, pricing, pacing. Edit here, not inline in the request
# code. An asset list may override any of these under a top-level "config"
# object; see load_config().
CONFIG = {
    "model": "gpt-image-1",
    "price_per_image": {
        "1024x1024": 0.04,
        "1024x1536": 0.06,
        "1536x1024": 0.06,
        "default": 0.04,
    },
    # Pacing: up to max_concurrency requests in flight, and at least
    # min_request_gap_seconds between request starts. A 429 halves the
    # concurrency and doubles the gap for the rest of the run (Pacer).
    "max_concurrency": 3,
    "min_request_gap_seconds": 20,
    "max_retries": 5,
    "backoff_base_seconds": 2.0,
}

GENERATIONS_URL = "https://api.openai.com/v1/images/generations"
EDITS_URL = "https://api.openai.com/v1/images/edits"

DEFAULT_DRIFT_THRESHOLD = 0.9
DRIFT_REJECT_STATUS = "rejected: shape drift"


# --------------------------------------------------------------------------
# Asset list / config loading
# --------------------------------------------------------------------------

def load_asset_list(path):
    with open(path, "r") as f:
        data = json.load(f)
    data.setdefault("style_block", "")
    data.setdefault("negative_block", "")
    data.setdefault("templates", {})
    data.setdefault("defaults", {})
    data.setdefault("assets", [])
    return data


def load_config(data):
    cfg = dict(CONFIG)
    cfg["price_per_image"] = dict(CONFIG["price_per_image"])
    override = data.get("config", {})
    cfg.update({k: v for k, v in override.items() if k != "price_per_image"})
    cfg["price_per_image"].update(override.get("price_per_image", {}))
    return cfg


def resolve_path(p):
    if p is None:
        return None
    return p if os.path.isabs(p) else os.path.join(GAME, p)


def price_for_size(cfg, size):
    prices = cfg["price_per_image"]
    return prices.get(size, prices["default"])


# --------------------------------------------------------------------------
# Prompt resolution
# --------------------------------------------------------------------------

def resolve_prompt(entry, style_block, templates, negative_block=""):
    """Every prompt = style block + template (or raw prompt) + negative
    block (art bible section 9)."""
    if entry.get("prompt"):
        return f"{style_block}\n\n{entry['prompt']}\n\n{negative_block}".strip()
    tmpl_name = entry.get("template")
    if not tmpl_name:
        raise ValueError(f"{entry.get('id')}: needs a 'prompt' or a 'template'")
    tmpl = templates.get(tmpl_name)
    if tmpl is None:
        raise ValueError(f"{entry.get('id')}: unknown template {tmpl_name!r}")
    fields = dict(entry.get("fields", {}))
    fields.setdefault("style", style_block)
    fields.setdefault("negative", negative_block)
    try:
        prompt = tmpl.format(**fields).strip()
    except KeyError as exc:
        raise ValueError(f"{entry.get('id')}: template {tmpl_name!r} needs field {exc}") from None
    if negative_block and "{negative}" not in tmpl:
        prompt = f"{prompt}\n\n{negative_block}"
    return prompt


def resolve_references(entry, assets_by_id):
    refs = list(entry.get("reference_images", []))
    if entry.get("mode") == "reskin":
        master_id = entry.get("master")
        if not master_id or master_id not in assets_by_id:
            raise ValueError(f"{entry['id']}: reskin needs a valid 'master' asset id")
        refs = [assets_by_id[master_id]["output"]] + refs
    return refs


def variant_path(base_path, i, variants):
    if variants <= 1:
        return base_path
    root, ext = os.path.splitext(base_path)
    return f"{root}-v{i}{ext}"


def compute_prompt_hash(prompt, mode, size, transparent, references, mask, variant_index, mirror=()):
    fields = {
            "prompt": prompt,
            "mode": mode,
            "size": size,
            "transparent": transparent,
            "references": references,
            "mask": mask,
            "variant": variant_index,
        }
    if mirror:  # only when set, so existing manifest hashes stay valid
        fields["mirror"] = sorted(mirror)
    payload = json.dumps(fields, sort_keys=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


# --------------------------------------------------------------------------
# Manifest
# --------------------------------------------------------------------------

def load_manifest(path):
    if not os.path.exists(path):
        return {}
    with open(path, "r") as f:
        return json.load(f)


def save_manifest(path, manifest):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)
    os.replace(tmp, path)


# --------------------------------------------------------------------------
# OpenAI Images API
# --------------------------------------------------------------------------

class ConfigError(Exception):
    """A local problem (missing reference file, bad parameter): retrying
    can't fix it, so it fails fast and nothing is billed."""


class APIRejected(Exception):
    """OpenAI rejected the request with a 4xx (other than 429). The request
    failed validation before generation, so it isn't billed."""

    def __init__(self, status, body):
        super().__init__(f"HTTP {status}: {body}")
        self.status = status


class Pacer:
    """Thread-safe request pacing shared by every worker: at most
    `concurrency` requests in flight and at least `gap` seconds between
    request starts. On a 429, `slow_down()` halves the concurrency and
    doubles the gap for the rest of the run, and holds every new start
    until the server's Retry-After has passed."""

    def __init__(self, concurrency, gap):
        self.concurrency = max(1, int(concurrency))
        self.gap = float(gap)
        self.in_flight = 0
        self.next_start = 0.0
        self.cond = threading.Condition()

    def acquire(self):
        with self.cond:
            while True:
                now = time.monotonic()
                if self.in_flight < self.concurrency and now >= self.next_start:
                    self.in_flight += 1
                    self.next_start = now + self.gap
                    return
                timeout = max(self.next_start - now, 0.05) if self.in_flight < self.concurrency else None
                self.cond.wait(timeout)

    def release(self):
        with self.cond:
            self.in_flight -= 1
            self.cond.notify_all()

    def slow_down(self, retry_after):
        with self.cond:
            self.concurrency = max(1, self.concurrency // 2)
            self.gap = self.gap * 2 if self.gap else 5.0
            self.next_start = max(self.next_start, time.monotonic() + retry_after)
            print(f"    429: slowing down -- concurrency {self.concurrency}, gap {self.gap:.0f}s, "
                  f"holding new requests for {retry_after:.0f}s")
            self.cond.notify_all()


def request_with_retry(fn, cfg, pacer=None):
    """Run one API request with retries. `fn` does the network call only
    (local files are read beforehand, so a missing file never gets here).
    Retries network errors, 429 and 5xx; a 429 also slows the pacer."""
    max_retries = cfg["max_retries"]
    base_delay = cfg["backoff_base_seconds"]
    for attempt in range(max_retries + 1):
        if pacer:
            pacer.acquire()
        try:
            resp, net_exc = fn(), None
        except requests.RequestException as exc:  # network error: retry like a 5xx
            resp, net_exc = None, exc
        finally:
            if pacer:
                pacer.release()
        if net_exc is not None:
            if attempt == max_retries:
                raise net_exc
            delay = base_delay * (2 ** attempt) + random.uniform(0, base_delay)
            print(f"    network error ({net_exc}); retrying in {delay:.1f}s ...")
            time.sleep(delay)
            continue
        if resp.status_code == 200:
            return resp
        if resp.status_code == 429 or resp.status_code >= 500:
            if attempt == max_retries:
                resp.raise_for_status()
            retry_after = resp.headers.get("Retry-After")
            try:
                delay = float(retry_after) if retry_after else None
            except ValueError:
                delay = None
            if delay is None:
                delay = base_delay * (2 ** attempt) + random.uniform(0, base_delay)
            if resp.status_code == 429 and pacer:
                pacer.slow_down(delay)
            print(f"    HTTP {resp.status_code}; retrying in {delay:.1f}s ...")
            time.sleep(delay)
            continue
        if 400 <= resp.status_code < 500:
            raise APIRejected(resp.status_code, resp.text[:300])
        resp.raise_for_status()
    raise RuntimeError("unreachable")  # pragma: no cover


def images_from_response(resp):
    payload = resp.json()
    out = []
    for item in payload["data"]:
        b64 = item.get("b64_json")
        if not b64:
            raise RuntimeError("expected b64_json in the API response")
        out.append(Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGBA"))
    return out


def api_generate(prompt, size, transparent, cfg, api_key, pacer=None):
    if requests is None:
        raise ConfigError("the 'requests' package is required for real API calls")

    def fn():
        return requests.post(
            GENERATIONS_URL,
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": cfg["model"],
                "prompt": prompt,
                "size": size,
                "n": 1,
                "background": "transparent" if transparent else "opaque",
            },
            timeout=180,
        )

    resp = request_with_retry(fn, cfg, pacer)
    return images_from_response(resp)[0]


def _read_local(path, what):
    try:
        with open(path, "rb") as fh:
            return fh.read()
    except OSError as exc:
        raise ConfigError(f"{what} not readable: {path} ({exc.strerror})") from None


def _mirrored_png(blob):
    im = Image.open(io.BytesIO(blob)).transpose(Image.FLIP_LEFT_RIGHT)
    buf = io.BytesIO()
    im.save(buf, "PNG")
    return buf.getvalue()


def api_edit(prompt, size, transparent, cfg, api_key, reference_paths, mask_path=None, pacer=None, mirror=()):
    if requests is None:
        raise ConfigError("the 'requests' package is required for real API calls")
    # Read every local file up front: a missing reference is a config error
    # and must fail fast, not go through the network retry/backoff loop.
    refs = [(os.path.basename(p), _read_local(p, "reference image")) for p in reference_paths]
    # `mirror_references`: flip these references left-right before upload,
    # e.g. to start a left hand from a right-hand reference.
    refs = [(name, _mirrored_png(blob) if i in mirror else blob) for i, (name, blob) in enumerate(refs)]
    mask = (os.path.basename(mask_path), _read_local(mask_path, "mask")) if mask_path else None

    def fn():
        files = [("image[]", (name, blob, "image/png")) for name, blob in refs]
        if mask:
            files.append(("mask", (mask[0], mask[1], "image/png")))
        data = {
            "model": cfg["model"],
            "prompt": prompt,
            "size": size,
            "n": "1",
            "background": "transparent" if transparent else "opaque",
        }
        return requests.post(
            EDITS_URL,
            headers={"Authorization": f"Bearer {api_key}"},
            data=data,
            files=files,
            timeout=240,
        )

    resp = request_with_retry(fn, cfg, pacer)
    return images_from_response(resp)[0]


# --------------------------------------------------------------------------
# Drift check (reskin vs master, alpha-silhouette IoU)
# --------------------------------------------------------------------------

def alpha_mask(im, threshold=128):
    a = np.asarray(im.convert("RGBA"))[..., 3]
    return a >= threshold


def normalize_silhouette(im, size=256, threshold=128):
    """Tight-crop the alpha silhouette, pad to a square and resize to a
    fixed canvas, so two poses drawn at slightly different scale or
    position in frame can still be compared."""
    mask = alpha_mask(im, threshold)
    ys, xs = np.nonzero(mask)
    if len(xs) == 0:
        return np.zeros((size, size), dtype=bool)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    crop = mask[y0:y1, x0:x1]
    h, w = crop.shape
    side = max(h, w)
    padded = np.zeros((side, side), dtype=bool)
    oy, ox = (side - h) // 2, (side - w) // 2
    padded[oy:oy + h, ox:ox + w] = crop
    pil = Image.fromarray((padded * 255).astype(np.uint8), "L").resize((size, size), Image.NEAREST)
    return np.asarray(pil) >= 128


def silhouette_iou(im_a, im_b, size=256, threshold=128):
    a = normalize_silhouette(im_a, size, threshold)
    b = normalize_silhouette(im_b, size, threshold)
    union = np.logical_or(a, b).sum()
    if union == 0:
        return 0.0
    return float(np.logical_and(a, b).sum()) / float(union)


def drift_check(candidate_path, master_path, threshold=DEFAULT_DRIFT_THRESHOLD):
    iou = silhouette_iou(Image.open(candidate_path), Image.open(master_path))
    return iou, iou >= threshold


# --------------------------------------------------------------------------
# Skin normaliser (hands): measure the masked skin midtone and colour-match
# it back to the reference hand's midtone. Skin only: the white sleeve,
# coloured sleeves, bangles and nails are kept out of (or barely touched
# by) the soft mask, and chroma is scaled rather than shifted, so pale
# nails keep their own hue instead of being pushed through grey to lilac.
# --------------------------------------------------------------------------

_D65 = np.array([0.95047, 1.0, 1.08883])
_M_RGB2XYZ = np.array([[0.4124564, 0.3575761, 0.1804375],
                       [0.2126729, 0.7151522, 0.0721750],
                       [0.0193339, 0.1191920, 0.9503041]])
_M_XYZ2RGB = np.linalg.inv(_M_RGB2XYZ)


def rgb_to_lab(rgb):
    """sRGB (0-255, [..., 3]) to CIE Lab (D65)."""
    c = np.asarray(rgb, dtype=np.float64) / 255.0
    lin = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    xyz = lin @ _M_RGB2XYZ.T / _D65
    f = np.where(xyz > (6 / 29) ** 3, np.cbrt(xyz), xyz / (3 * (6 / 29) ** 2) + 4 / 29)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], axis=-1)


def lab_to_rgb(lab):
    lab = np.asarray(lab, dtype=np.float64)
    fy = (lab[..., 0] + 16) / 116
    f = np.stack([fy + lab[..., 1] / 500, fy, fy - lab[..., 2] / 200], axis=-1)
    xyz = np.where(f > 6 / 29, f ** 3, 3 * (6 / 29) ** 2 * (f - 4 / 29)) * _D65
    lin = np.clip(xyz @ _M_XYZ2RGB.T, 0, 1)
    c = np.where(lin <= 0.0031308, lin * 12.92, 1.055 * lin ** (1 / 2.4) - 0.055)
    return np.clip(c * 255.0 + 0.5, 0, 255)


def hex_to_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float64)


def rgb_to_hex(rgb):
    r, g, b = (int(round(float(v))) for v in rgb)
    return f"#{r:02X}{g:02X}{b:02X}"


def _ramp(x, lo, hi):
    return np.clip((x - lo) / (hi - lo), 0.0, 1.0)


def skin_weight(im):
    """Soft 0..1 skin mask for a hand sprite. Skin is an opaque, mid-light,
    moderately saturated warm colour.
    Measured on the round-3 hand: skin Lab hue 55-65 and chroma 40-50;
    the cream linen sleeve hue ~77 and chroma ~18. Excluded: transparent
    pixels, white or cream fabric (low chroma, yellower hue), deep reds
    (Nani's sleeve, hue below ~40), golds, greens, blues and very dark
    pixels. Nails sit close to skin (hue ~56, chroma ~40) and are corrected
    with it, proportionally."""
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    lab = rgb_to_lab(arr[..., :3])
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    hue = np.degrees(np.arctan2(b, a))
    w = _ramp(arr[..., 3], 1, 16)  # antialiased edges too, or they keep an orange fringe
    w = w * _ramp(C, 16, 24) * (1 - _ramp(C, 78, 88))      # not white/cream fabric; very orange raw skin still in
    w = w * _ramp(hue, 40, 48) * (1 - _ramp(hue, 67, 73))  # skin hues only: reds (sleeve) and golds/creams out
    w = w * _ramp(L, 25, 35) * (1 - _ramp(L, 90, 96))      # not deep shadow, not specular white
    return w, lab


def measure_skin_midtone(im, min_pixels=400):
    """Median Lab of the skin pixels in the middle band of lightness (30th
    to 70th percentile), i.e. the midtone, not the highlights or shadows.
    Returns (lab, hex, pixel_count) or (None, None, n) if too little skin."""
    w, lab = skin_weight(im)
    core = (w > 0.8) & (np.asarray(im.convert("RGBA"))[..., 3] >= 240)
    n = int(core.sum())
    if n < min_pixels:
        return None, None, n
    Ls = lab[..., 0][core]
    lo, hi = np.percentile(Ls, [30, 70])
    band = core & (lab[..., 0] >= lo) & (lab[..., 0] <= hi)
    mid = np.median(lab[band], axis=0)
    return mid, rgb_to_hex(lab_to_rgb(mid)), n


def delta_e(lab1, lab2):
    return float(np.linalg.norm(np.asarray(lab1) - np.asarray(lab2)))


def normalise_skin(im, target_lab, tolerance=3.0, passes=3):
    """Run _normalise_skin_once up to `passes` times: a very orange raw
    render sits partly outside the soft mask, so one pass can land short."""
    out, info = _normalise_skin_once(im, target_lab, tolerance)
    first = dict(info)
    for _ in range(passes - 1):
        if info.get("skin_action") != "corrected" or (info.get("skin_delta_e_after") or 0) <= tolerance:
            break
        out, info = _normalise_skin_once(out, target_lab, tolerance)
    first.update(skin_after=info.get("skin_after"),
                 skin_delta_e_after=info.get("skin_delta_e_after", info.get("skin_delta_e_before")))
    return out, first


def _normalise_skin_once(im, target_lab, tolerance=3.0):
    """Colour-match an image's skin midtone to `target_lab` (skin only).
    In LCh: lightness shifted, chroma scaled, hue rotated, each weighted by
    the soft skin mask; alpha untouched. Returns (image, info dict)."""
    target_lab = np.asarray(target_lab, dtype=np.float64)
    mid, before_hex, n = measure_skin_midtone(im)
    info = {"skin_before": before_hex, "skin_target": rgb_to_hex(lab_to_rgb(target_lab)), "skin_pixels": n}
    if mid is None:
        info.update(skin_after=None, skin_action="no skin found")
        return im, info
    de = delta_e(mid, target_lab)
    info["skin_delta_e_before"] = round(de, 2)
    if de <= tolerance:
        info.update(skin_after=before_hex, skin_action="within tolerance")
        return im, info
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    w, lab = skin_weight(im)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C, h = np.hypot(a, b), np.arctan2(b, a)
    mC, mh = np.hypot(mid[1], mid[2]), np.arctan2(mid[2], mid[1])
    tC, th = np.hypot(target_lab[1], target_lab[2]), np.arctan2(target_lab[2], target_lab[1])
    dL, kC, dh = target_lab[0] - mid[0], tC / max(mC, 1e-6), th - mh
    L2 = L + dL * w
    C2 = C * (1 + (kC - 1) * w)
    h2 = h + dh * w
    out_lab = np.stack([L2, C2 * np.cos(h2), C2 * np.sin(h2)], axis=-1)
    rgba[..., :3] = lab_to_rgb(out_lab)
    out = Image.fromarray(rgba.astype(np.uint8), "RGBA")
    after_mid, after_hex, _ = measure_skin_midtone(out)
    info.update(skin_after=after_hex, skin_action="corrected",
                skin_delta_e_after=round(delta_e(after_mid, target_lab), 2) if after_mid is not None else None)
    return out, info


def _hsv(rgb):
    r, g, b = (rgb[..., i] / 255.0 for i in range(3))
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    d = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, np.where(mx > 0, (mx - mn) / (mx + 1e-9), 0), mx


def key_out_magenta(im):
    """Remove a flat magenta placeholder (a tool drawn as a plain #FF00FF
    shape so the fingers close round something real) and leave its exact
    shape as a transparent gap for the separate tool sprite. The renderer
    shades the magenta, so its shadowed side comes out dark crimson-purple:
    the key is by hue (270-350 degrees, i.e. magenta through crimson, far
    from skin at 15-35) and saturation, with a soft edge. Pixels just
    outside (magenta light bounced onto the skin) are pulled back towards
    skin by clamping blue to green. Only run on entries with key_out, never
    on Nani's red sleeve or the girl's pink one. Returns (image, removed)."""
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    h, sat, val = _hsv(rgba[..., :3])
    hue_w = _ramp(h, 262, 278) * (1 - _ramp(h, 346, 356))
    kill = hue_w * _ramp(sat, 0.22, 0.35)
    # The placeholder's specular edge renders near-white or pale pink, which
    # the hue key misses: in a thin ring round the keyed area, also clear
    # anything that isn't skin- or cream-coloured (hue 10-55).
    core = Image.fromarray(((kill > 0.5) * 255).astype(np.uint8), "L")
    ring = np.asarray(core.filter(ImageFilter.MaxFilter(9))) > 0
    skinlike = (h >= 10) & (h <= 55) & (sat > 0.06)
    kill = np.where(ring & ~skinlike, 1.0, kill)
    removed = int(((kill > 0.5) & (rgba[..., 3] > 16)).sum())
    rgba[..., 3] = rgba[..., 3] * (1 - kill)
    spill = (kill > 0) & (kill < 1)
    rgba[..., 2] = np.where(spill, np.minimum(rgba[..., 2], rgba[..., 1]), rgba[..., 2])
    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA"), removed


def drop_fragments(im, min_share=0.02):
    """Clear connected opaque fragments smaller than min_share of the
    largest one (e.g. the thin lit edge of a keyed-out placeholder).
    Two-handed images keep both hands: each is far above the threshold."""
    rgba = np.asarray(im.convert("RGBA")).copy()
    mask = Image.fromarray(((rgba[..., 3] > 16) * 255).astype(np.uint8), "L")
    # label components with repeated flood fills on a quarter-size mask
    small = np.asarray(mask.resize((mask.width // 4, mask.height // 4), Image.NEAREST)) > 0
    lab = np.zeros(small.shape, dtype=np.int32)
    sizes, n = {}, 0
    for y, x in zip(*np.nonzero(small)):
        if lab[y, x]:
            continue
        n += 1
        stack, lab[y, x], cnt = [(y, x)], n, 0
        while stack:
            cy, cx = stack.pop()
            cnt += 1
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < small.shape[0] and 0 <= nx < small.shape[1] and small[ny, nx] and not lab[ny, nx]:
                    lab[ny, nx] = n
                    stack.append((ny, nx))
        sizes[n] = cnt
    if not sizes:
        return im, 0
    biggest = max(sizes.values())
    drop = [k for k, v in sizes.items() if v < min_share * biggest]
    if not drop:
        return im, 0
    dmask = np.isin(lab, drop).astype(np.uint8) * 255
    dfull = np.asarray(Image.fromarray(dmask, "L").resize(mask.size, Image.NEAREST)
                       .filter(ImageFilter.MaxFilter(9))) > 0
    removed = int((dfull & (rgba[..., 3] > 16)).sum())
    rgba[..., 3] = np.where(dfull, 0, rgba[..., 3])
    return Image.fromarray(rgba, "RGBA"), removed


def fix_magenta_spill(im):
    """Magenta light bounced onto the skin next to a keyed placeholder shows
    as a pink-red streak (hue above ~330 or below ~5). Give those pixels the
    image's own skin chroma and hue, keeping their lightness."""
    mid = measure_skin_midtone(im)[0]
    if mid is None:
        return im, 0
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    h, sat, val = _hsv(rgba[..., :3])
    spill = (((h >= 325) | (h <= 6)) & (sat > 0.12) & (rgba[..., 3] > 16))
    lab = rgb_to_lab(rgba[..., :3])
    lab[spill, 1] = mid[1]
    lab[spill, 2] = mid[2]
    rgba[..., :3] = np.where(spill[..., None], lab_to_rgb(lab), rgba[..., :3])
    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA"), int(spill.sum())


def clean_key_residue(im):
    """One-off repair for images keyed by the first version of
    key_out_magenta, whose despill turned the shaded placeholder's rim
    into saturated dark red (hue 350-10, high saturation, darker than any
    skin). Removes those pixels."""
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    h, sat, val = _hsv(rgba[..., :3])
    red = ((h >= 340) | (h <= 8)) & (sat > 0.55)
    rgba[..., 3] = np.where(red, 0, rgba[..., 3])
    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA"), int((red & (np.asarray(im.convert("RGBA"))[..., 3] > 16)).sum())


def skin_target_for(entry, cfg, cache={}):
    """The skin midtone (Lab) an entry's output is normalised to, or None if
    the entry isn't a hand or normalising is off. Order: the entry's own
    `skin_target` hex, else the measured midtone of its `skin_reference`
    image, else the config's `skin_normalise.reference` (the master hand).
    Applies to groups starting with `skin_normalise.groups_prefix`, or any
    entry with "skin_normalise": true."""
    sk = cfg.get("skin_normalise") or {}
    if entry.get("skin_normalise") is False or not sk:
        return None
    if entry.get("skin_normalise") is not True and not str(entry.get("group", "")).startswith(
            tuple(sk.get("groups_prefix", ["hands"]))):
        return None
    if entry.get("skin_target"):
        return rgb_to_lab(hex_to_rgb(entry["skin_target"]))
    ref = resolve_path(entry.get("skin_reference") or sk.get("reference"))
    if not ref or not os.path.exists(ref):
        return None
    key = (ref, os.path.getmtime(ref))
    if key not in cache:
        cache[key] = measure_skin_midtone(Image.open(ref))[0]
    return cache[key]


# --------------------------------------------------------------------------
# Edit-in-place cut-out helper
# --------------------------------------------------------------------------

def _despeckle(mask_img, radius=2):
    """Morphological opening then closing (PIL rank filters), same trick
    slice_sheet.py uses to erode an antialiased rim: remove small noise,
    then fill small holes, without needing scipy/cv2."""
    size = radius * 2 + 1
    opened = mask_img.filter(ImageFilter.MinFilter(size)).filter(ImageFilter.MaxFilter(size))
    closed = opened.filter(ImageFilter.MaxFilter(size)).filter(ImageFilter.MinFilter(size))
    return closed


def cutout_from_diff(
    background_path,
    edited_path,
    item_out_path,
    shadow_out_path=None,
    item_threshold=40.0,
    shadow_min=10.0,
    shadow_max_ratio_std=0.06,
    shadow_darken_cap=60.0,
    pad=4,
    despeckle_radius=2,
):
    """Diff an empty station background against the API's edited version
    (item added) and cut the item out to a transparent PNG. A pixel that
    changed a lot is the new item; a pixel that only got a bit darker,
    roughly uniformly across channels, is treated as a shadow and can be
    saved as its own optional layer."""
    bg = Image.open(background_path).convert("RGB")
    ed = Image.open(edited_path).convert("RGB")
    if bg.size != ed.size:
        raise ValueError(f"background {bg.size} and edited {ed.size} must be the same size")

    bg_a = np.asarray(bg).astype(np.float32)
    ed_a = np.asarray(ed).astype(np.float32)
    diff_mag = np.sqrt(((ed_a - bg_a) ** 2).sum(axis=-1))
    lum_bg = bg_a.mean(axis=-1)
    lum_ed = ed_a.mean(axis=-1)
    darken = lum_bg - lum_ed
    ratio_std = (ed_a / (bg_a + 1e-3)).std(axis=-1)

    item_mask = diff_mag > item_threshold
    shadow_mask = (~item_mask) & (darken > shadow_min) & (ratio_std < shadow_max_ratio_std)

    item_mask_img = _despeckle(Image.fromarray((item_mask * 255).astype(np.uint8), "L"), despeckle_radius)
    item_mask = np.asarray(item_mask_img) > 127
    if not item_mask.any():
        raise ValueError("no difference found between background and edited image")

    combined = item_mask | (shadow_mask if shadow_out_path else np.zeros_like(item_mask))
    ys, xs = np.nonzero(combined)
    x0 = max(int(xs.min()) - pad, 0)
    x1 = min(int(xs.max()) + 1 + pad, bg.width)
    y0 = max(int(ys.min()) - pad, 0)
    y1 = min(int(ys.max()) + 1 + pad, bg.height)

    item_rgba = np.dstack([ed_a, (item_mask.astype(np.float32) * 255)]).astype(np.uint8)
    item_img = Image.fromarray(item_rgba, "RGBA").crop((x0, y0, x1, y1))
    os.makedirs(os.path.dirname(item_out_path) or ".", exist_ok=True)
    item_img.save(item_out_path)

    shadow_written = None
    if shadow_out_path:
        shadow_mask_img = _despeckle(Image.fromarray((shadow_mask * 255).astype(np.uint8), "L"), despeckle_radius)
        shadow_mask2 = np.asarray(shadow_mask_img) > 127
        shadow_alpha = np.where(shadow_mask2, np.clip(darken / shadow_darken_cap, 0, 1) * 180, 0).astype(np.uint8)
        shadow_rgba = np.dstack([np.zeros_like(ed_a), shadow_alpha]).astype(np.uint8)
        shadow_img = Image.fromarray(shadow_rgba, "RGBA").crop((x0, y0, x1, y1))
        os.makedirs(os.path.dirname(shadow_out_path) or ".", exist_ok=True)
        shadow_img.save(shadow_out_path)
        shadow_written = shadow_out_path

    return item_out_path, shadow_written


# --------------------------------------------------------------------------
# Contact sheets
# --------------------------------------------------------------------------

def checkerboard(size, cell=12, c1=(222, 222, 222), c2=(184, 184, 184)):
    w, h = size
    yy, xx = np.indices((h, w))
    mask = ((xx // cell) + (yy // cell)) % 2 == 0
    arr = np.where(mask[..., None], np.array(c1, dtype=np.uint8), np.array(c2, dtype=np.uint8))
    return Image.fromarray(arr.astype(np.uint8), "RGB")


def build_contact_sheet(group, data, out_dir, thumb=220, cols=5, label_h=24):
    entries = [a for a in data["assets"] if a.get("group") == group]
    if not entries:
        raise ValueError(f"no assets in group {group!r}")

    defaults = data.get("defaults", {})
    tiles = []
    for entry in entries:
        variants = entry.get("variants", defaults.get("variants", 1))
        for i in range(variants):
            path = resolve_path(variant_path(entry["output"], i, variants))
            label = entry["id"] if variants <= 1 else f"{entry['id']} v{i}"
            im = Image.open(path).convert("RGBA") if os.path.exists(path) else None
            tiles.append((label, im))

    if len(tiles) > 15:
        cols = 8
    cell_w, cell_h = thumb, thumb + label_h
    rows = (len(tiles) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * cell_w, rows * cell_h), (40, 40, 40))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    for idx, (label, im) in enumerate(tiles):
        r, c = divmod(idx, cols)
        x0, y0 = c * cell_w, r * cell_h
        if im is not None:
            fitted = im.copy()
            fitted.thumbnail((thumb - 8, thumb - 8), Image.LANCZOS)
            tile_bg = checkerboard((thumb, thumb))
            tile_bg.paste(fitted, ((thumb - fitted.width) // 2, (thumb - fitted.height) // 2), fitted)
            canvas.paste(tile_bg, (x0, y0))
        else:
            draw.rectangle((x0, y0, x0 + thumb, y0 + thumb), outline=(200, 60, 60), width=2)
            draw.text((x0 + 8, y0 + thumb // 2 - 6), "missing", fill=(220, 120, 120), font=font)
        short = label.replace("hand-", "").replace("nani-", "N ")
        draw.text((x0 + 4, y0 + thumb + 4), short[:36], fill=(235, 235, 235), font=font)

    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{group}.png")
    canvas.save(out_path)
    return out_path


# --------------------------------------------------------------------------
# Generation run
# --------------------------------------------------------------------------

def entry_matches_only(entry, only):
    if not only:
        return True
    wanted = {o.strip() for o in only.split(",") if o.strip()}
    return entry["id"] in wanted or entry.get("group") in wanted


def plan_waves(tasks, assets_by_id):
    """Split tasks into dependency waves: a task whose reference images are
    the outputs of other tasks in this run waits for a later wave. Within
    a wave everything runs concurrently."""
    produced = {}
    for t in tasks:
        produced.setdefault(os.path.normpath(t["out_path"]), set()).add(t["eid"])
        produced.setdefault(os.path.normpath(resolve_path(t["entry"]["output"])), set()).add(t["eid"])
    level = {}

    def depth(t, seen=()):
        if t["eid"] in level:
            return level[t["eid"]]
        deps = set()
        for r in t["references"]:
            deps |= produced.get(os.path.normpath(resolve_path(r)), set())
        deps.discard(t["eid"])
        deps -= set(seen)
        d = 0
        for dep in deps:
            dep_task = next(x for x in tasks if x["eid"] == dep)
            d = max(d, depth(dep_task, seen + (t["eid"],)) + 1)
        level[t["eid"]] = d
        return d

    waves = {}
    for t in tasks:
        waves.setdefault(depth(t), []).append(t)
    return [waves[k] for k in sorted(waves)]


def run(args):
    data = load_asset_list(args.asset_list)
    cfg = load_config(data)
    if args.max_concurrency:
        cfg["max_concurrency"] = args.max_concurrency
    style_block = data["style_block"]
    negative_block = data["negative_block"]
    templates = data["templates"]
    defaults = data["defaults"]
    assets = data["assets"]
    assets_by_id = {a["id"]: a for a in assets}

    manifest = load_manifest(args.manifest)
    manifest_lock = threading.Lock()
    api_key = os.environ.get("OPENAI_API_KEY")
    dry_run = args.dry_run if args.dry_run is not None else not bool(api_key)

    selected = [a for a in assets if entry_matches_only(a, args.only)]
    if not selected:
        print(f"no assets matched --only {args.only!r}")
        return

    print(f"{'DRY RUN' if dry_run else 'LIVE RUN'} -- {len(selected)} asset(s), model={cfg['model']}, "
          f"concurrency {cfg['max_concurrency']}, gap {cfg['min_request_gap_seconds']}s")
    if args.budget is not None:
        print(f"budget cap: ${args.budget:.2f}")

    # Plan every request first: prompts, hashes, resume skips and the budget
    # cap are all decided up front, so the concurrent phase can't overspend.
    tasks = []
    planned_total = 0.0
    skip_ct = 0
    budget_stop = False
    for entry in selected:
        if budget_stop:
            break
        eid = entry["id"]
        mode = entry.get("mode", "generate")
        variants = args.variants or entry.get("variants", defaults.get("variants", 1))
        size = entry.get("size", defaults.get("size", "1024x1024"))
        transparent = entry.get("transparent", defaults.get("transparent", True))
        out_base = resolve_path(entry["output"])

        try:
            if mode not in ("generate", "edit", "reskin"):
                raise ValueError(f"{eid}: unknown mode {mode!r}")
            prompt = resolve_prompt(entry, style_block, templates, negative_block)
            references = resolve_references(entry, assets_by_id)
        except ValueError as exc:
            print(f"[{eid}] SKIP (config error): {exc}")
            continue
        mask = entry.get("mask")
        mirror = tuple(entry.get("mirror_references", []))
        unit_price = price_for_size(cfg, size)

        for i in range(variants):
            key = f"{eid}::v{i}"
            phash = compute_prompt_hash(prompt, mode, size, transparent, references, mask, i, mirror)
            out_path = variant_path(out_base, i, variants)
            existing = manifest.get(key)

            if existing and existing.get("prompt_hash") == phash and existing.get("status", "").startswith(("done", "rejected")):
                skip_ct += 1
                print(f"[{key}] skip (already {existing['status']})")
                continue

            if args.budget is not None and planned_total + unit_price > args.budget + 1e-9:
                print(f"budget cap (${args.budget:.2f}) reached; stopping before {key}"
                      f"{' (dry run)' if dry_run else ''}")
                budget_stop = True
                break

            planned_total += unit_price
            tasks.append(dict(key=key, eid=eid, entry=entry, mode=mode, size=size, transparent=transparent,
                              prompt=prompt, references=references, mask=mask, mirror=mirror, unit_price=unit_price,
                              phash=phash, out_path=out_path))

    waves = plan_waves(tasks, assets_by_id)
    if dry_run:
        for w, wave in enumerate(waves):
            print(f"-- wave {w} ({len(wave)} request(s), run concurrently)")
            for t in wave:
                label = f"[{t['key']}] {t['mode']:8s} {t['size']:11s} ${t['unit_price']:.3f}  {t['eid']}"
                if t["references"]:
                    label += f"  refs={t['references']}"
                p = t["prompt"]
                print(f"{label}\n    prompt: {p[:160]}{'...' if len(p) > 160 else ''}")
        print(f"\nestimated cost for this run: ${planned_total:.2f} "
              f"(skipped {skip_ct} already-done item(s))")
        return

    pacer = Pacer(cfg["max_concurrency"], cfg["min_request_gap_seconds"])
    stats = {"spent": 0.0, "run": 0, "done": 0, "reject": 0, "error": 0, "unbilled": 0}
    stats_lock = threading.Lock()
    run_start = time.monotonic()

    def record(key, value):
        with manifest_lock:
            manifest[key] = value
            save_manifest(args.manifest, manifest)

    def work(t):
        key, mode, entry = t["key"], t["mode"], t["entry"]
        t0 = time.monotonic()
        print(f"[{key}] queued {mode} {t['size']} (+{t0 - run_start:.0f}s; the pacer holds the actual request start)")
        billed = False
        try:
            if mode == "generate":
                img = api_generate(t["prompt"], t["size"], t["transparent"], cfg, api_key, pacer)
            else:
                ref_paths = [resolve_path(r) for r in t["references"]]
                img = api_edit(t["prompt"], t["size"], t["transparent"], cfg, api_key, ref_paths,
                               resolve_path(t["mask"]), pacer, t["mirror"])
            billed = True
            os.makedirs(os.path.dirname(t["out_path"]), exist_ok=True)
            img.save(t["out_path"])
            raw = os.path.join(GAME, "build", "raw", os.path.relpath(t["out_path"], GAME))
            os.makedirs(os.path.dirname(raw), exist_ok=True)
            img.save(raw)  # untouched API output (git-ignored), before key-out / skin normalising
        except Exception as exc:
            # Only a request that reached generation is billed: local config
            # errors never left the machine and a 4xx is rejected before
            # generation. Network errors / exhausted 5xx retries are counted
            # conservatively, since we can't tell whether it was generated.
            if not billed and not isinstance(exc, (ConfigError, APIRejected)):
                billed = True
            record(key, {"status": "error", "prompt_hash": t["phash"], "group": entry.get("group"),
                         "mode": mode, "error": str(exc), "billed": billed})
            with stats_lock:
                stats["error"] += 1
                if billed:
                    stats["spent"] += t["unit_price"]
                else:
                    stats["unbilled"] += 1
            print(f"[{key}] ERROR ({type(exc).__name__}, {'billed' if billed else 'not billed'}): {exc}")
            return
        elapsed = time.monotonic() - t0

        skin = {}
        if entry.get("key_out") == "magenta":
            keyed, removed = key_out_magenta(Image.open(t["out_path"]))
            keyed, _ = drop_fragments(keyed)
            keyed, _ = fix_magenta_spill(keyed)
            keyed.save(t["out_path"])
            skin["keyed_out_px"] = removed
            print(f"[{key}] keyed out {removed} px of magenta placeholder")
        target = skin_target_for(entry, cfg)
        if target is not None:
            fixed, skin = normalise_skin(Image.open(t["out_path"]), target,
                                         (cfg.get("skin_normalise") or {}).get("tolerance_delta_e", 3.0))
            if skin.get("skin_action") == "corrected":
                fixed.save(t["out_path"])
            print(f"[{key}] skin {skin.get('skin_before')} -> {skin.get('skin_after')} ({skin.get('skin_action')})")

        status, iou = "done", None
        if mode == "reskin":
            master_out = resolve_path(assets_by_id[entry["master"]]["output"])
            iou, ok = drift_check(t["out_path"], master_out, args.drift_threshold)
            status = "done" if ok else DRIFT_REJECT_STATUS
            print(f"[{key}] drift check {'OK' if ok else 'FAILED'} (IoU {iou:.3f})")
        record(key, {"status": status, "prompt_hash": t["phash"], "group": entry.get("group"), "mode": mode,
                     "output": t["out_path"], "cost": t["unit_price"], "iou": iou,
                     "seconds": round(elapsed, 1), **skin})
        with stats_lock:
            stats["spent"] += t["unit_price"]
            stats["run"] += 1
            stats["done" if status == "done" else "reject"] += 1
        print(f"[{key}] done in {elapsed:.0f}s -> {os.path.relpath(t['out_path'], GAME)}")

    for w, wave in enumerate(waves):
        if len(waves) > 1:
            print(f"-- wave {w}: {len(wave)} request(s)")
        with ThreadPoolExecutor(max_workers=max(1, cfg["max_concurrency"])) as pool:
            for fut in as_completed([pool.submit(work, t) for t in wave]):
                fut.result()

    print(f"\nspent ${stats['spent']:.2f} this run -- {stats['run']} generated, {stats['done']} done, "
          f"{stats['reject']} flagged for drift, {stats['error']} error(s) ({stats['unbilled']} not billed), "
          f"{skip_ct} skipped (already done); wall time {time.monotonic() - run_start:.0f}s")


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--asset-list", default=DEFAULT_ASSET_LIST)
    p.add_argument("--manifest", default=DEFAULT_MANIFEST)
    p.add_argument("--only", help="restrict to one group or asset id (comma-separated for several)")
    p.add_argument("--variants", type=int, default=None, help="override the variant count for every selected asset")
    p.add_argument("--max-concurrency", type=int, default=None,
                    help="requests in flight at once (default: config max_concurrency, 3)")
    p.add_argument("--budget", type=float, default=None, help="stop before spending more than this many dollars")
    p.add_argument("--dry-run", dest="dry_run", action="store_true", default=None,
                    help="print planned requests and cost; no network calls. Default when OPENAI_API_KEY is unset.")
    p.add_argument("--drift-threshold", type=float, default=DEFAULT_DRIFT_THRESHOLD,
                    help="minimum silhouette IoU for a reskin to pass (default 0.9)")

    p.add_argument("--contact-sheet", metavar="GROUP", help="build a contact sheet PNG for this group and exit")
    p.add_argument("--drift-check", nargs=2, metavar=("CANDIDATE", "MASTER"),
                    help="standalone silhouette-IoU drift check between two PNGs, then exit")
    p.add_argument("--cutout", nargs=3, metavar=("BACKGROUND", "EDITED", "OUT"),
                    help="cut the added item out of an edited station image, then exit")
    p.add_argument("--shadow-out", metavar="PATH", help="with --cutout: also save the item's shadow as its own layer")
    p.add_argument("--skin-measure", nargs="+", metavar="PNG", help="print each hand's masked skin midtone hex, then exit")
    p.add_argument("--skin-normalise", nargs=2, metavar=("IN", "OUT"),
                    help="colour-match a hand's skin to --skin-target (hex) or the master reference, then exit")
    p.add_argument("--skin-target", metavar="HEX", help="with --skin-normalise: the target midtone hex")

    args = p.parse_args()

    if args.contact_sheet:
        data = load_asset_list(args.asset_list)
        out_path = build_contact_sheet(args.contact_sheet, data, DEFAULT_CONTACT_SHEET_DIR)
        print(f"wrote {out_path}")
        return

    if args.drift_check:
        candidate, master = args.drift_check
        iou, ok = drift_check(candidate, master, args.drift_threshold)
        print(f"IoU {iou:.4f} vs threshold {args.drift_threshold} -> {'OK' if ok else DRIFT_REJECT_STATUS}")
        sys.exit(0 if ok else 1)

    if args.cutout:
        background, edited, out = args.cutout
        item_path, shadow_path = cutout_from_diff(background, edited, out, shadow_out_path=args.shadow_out)
        print(f"wrote {item_path}" + (f" and {shadow_path}" if shadow_path else ""))
        return

    if args.skin_measure:
        for path in args.skin_measure:
            _, hx, n = measure_skin_midtone(Image.open(path))
            print(f"{hx or 'no skin'}  ({n} px)  {path}")
        return

    if args.skin_normalise:
        src, dst = args.skin_normalise
        if args.skin_target:
            target = rgb_to_lab(hex_to_rgb(args.skin_target))
        else:
            target = skin_target_for({"skin_normalise": True}, load_config(load_asset_list(args.asset_list)))
        out, info = normalise_skin(Image.open(src), target, tolerance=0.0)
        out.save(dst)
        print(json.dumps(info))
        return

    run(args)


if __name__ == "__main__":
    main()
