#!/usr/bin/env python3
"""Image-generation pipeline for Nani jo Ghar: drives the OpenAI Images API
from a data file (`data/asset-list.json`) instead of one-off prompts, with
resume, a spending cap, contact sheets, a reskin drift check and an
edit-in-place cut-out helper.

Cost note (24 Sept 2026): every request now sends `quality` explicitly
(default medium; see CONFIG). An earlier run left it unset, the API quietly
defaulted to high, and billing came in around $0.16/image instead of the
$0.04 the script assumed. Check current gpt-image-1 pricing at
https://platform.openai.com/docs/pricing before a large run.

Usage
-----
    # No key set, or explicit --dry-run: prints every planned request and
    # the estimated total cost. No network calls are made either way.
    python3 build/gen_assets.py --dry-run

    # Quick offline self-test (price table, dry-run planning, one mocked API
    # call). No network calls, no OPENAI_API_KEY needed.
    python3 build/gen_assets.py --self-test

    # Cheap prompt check before a real run: quality low, output under
    # drafts/ instead of the real asset paths.
    OPENAI_API_KEY=sk-... python3 build/gen_assets.py --only hands-master --draft

    # Real run (needs OPENAI_API_KEY in the environment and network access
    # to api.openai.com). Stops before the cap would be exceeded, prints a
    # pre-flight image-count x price estimate first, and asks for --yes if
    # that estimate is over $5.
    OPENAI_API_KEY=sk-... python3 build/gen_assets.py --budget 20 --yes

    # Only one group or one asset id, more variants per pose, and a quality
    # override for the whole run:
    python3 build/gen_assets.py --only hands-master --variants 3 --quality high

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
whose inputs haven't changed and only redoes what has. The model name,
quality and per-quality, per-size price are the CONFIG dict below, not
scattered through the request code. A reskin that fails its drift check
(automated QA) is retried automatically up to `max_regens` times (default
1, i.e. one retry); once a run gives up, that image stays "rejected" on
resume and is not retried again without an explicit --retry-rejected.
"""
import argparse
import base64
import contextlib
import hashlib
import io
import json
import os
import random
import sys
import tempfile
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
#
# Cost note (24 Sept 2026): the owner was billed ~$0.16/image (~$30 for 187
# requests) because every request left `quality` unset and the API defaulted
# to high, while this file assumed a flat $0.04. Two fixes: (1) `quality` is
# now always sent explicitly (default "medium" below, see QUALITIES), and
# (2) price is looked up per quality AND size, not a flat number. The prices
# below are OpenAI's published per-image cost for gpt-image-1; check
# https://platform.openai.com/docs/pricing before trusting them for a large
# run, since gpt-image-1 pricing has changed before and may again.
QUALITIES = ("low", "medium", "high")

CONFIG = {
    "model": "gpt-image-1",
    "quality": "medium",  # conservative default; override per entry ("quality": "...")
                            # or for a whole run with --quality
    "price_per_image": {
        "low": {
            "1024x1024": 0.011,
            "1024x1536": 0.016,
            "1536x1024": 0.016,
            "default": 0.011,
        },
        "medium": {
            "1024x1024": 0.042,
            "1024x1536": 0.063,
            "1536x1024": 0.063,
            "default": 0.042,
        },
        "high": {
            "1024x1024": 0.167,
            "1024x1536": 0.25,
            "1536x1024": 0.25,
            "default": 0.167,
        },
    },
    # Pacing: up to max_concurrency requests in flight, and at least
    # min_request_gap_seconds between request starts. A 429 halves the
    # concurrency and doubles the gap for the rest of the run (Pacer).
    "max_concurrency": 3,
    "min_request_gap_seconds": 20,
    "max_retries": 5,
    "backoff_base_seconds": 2.0,
    # QA regen: after an automated QA failure (currently: reskin drift
    # check), retry generating that one image this many extra times before
    # giving up and recording it rejected. Default is a single retry (two
    # attempts total); raise it with --max-regens. Once a run gives up on an
    # image it stays "rejected" on resume -- a later run won't quietly pay
    # for a "round 2" unless it's asked to with --retry-rejected.
    "max_regens": 1,
    # Pre-flight guard (point 4): a live run prints its planned image count
    # x price before spending anything; above this many dollars it refuses
    # to proceed without --yes.
    "preflight_dollar_threshold": 5.0,
}

GENERATIONS_URL = "https://api.openai.com/v1/images/generations"
EDITS_URL = "https://api.openai.com/v1/images/edits"

DEFAULT_DRIFT_THRESHOLD = 0.9
DRIFT_REJECT_STATUS = "rejected: shape drift"
DRAFT_SUBDIR = "drafts"


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
    cfg["price_per_image"] = {q: dict(sizes) for q, sizes in CONFIG["price_per_image"].items()}
    override = data.get("config", {})
    cfg.update({k: v for k, v in override.items() if k != "price_per_image"})
    for quality, sizes in override.get("price_per_image", {}).items():
        cfg["price_per_image"].setdefault(quality, {}).update(sizes)
    return cfg


def resolve_path(p):
    if p is None:
        return None
    return p if os.path.isabs(p) else os.path.join(GAME, p)


def price_for_size(cfg, quality, size):
    """Price of one image at `quality` and `size` (point 1: price is always
    looked up by quality AND size, never a flat number)."""
    table = cfg["price_per_image"].get(quality)
    if table is None:
        raise ConfigError(f"unknown quality {quality!r}; expected one of {QUALITIES}")
    return table.get(size, table["default"])


def quality_for(entry, cfg, override=None):
    """The quality an entry generates at: a --quality CLI override beats
    the entry's own `quality` field, which beats the config default."""
    if override:
        return override
    return entry.get("quality") or cfg.get("quality", "medium")


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


def compute_prompt_hash(prompt, mode, size, transparent, references, mask, variant_index, mirror=(), quality=None):
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
    # Only when it differs from the long-standing default: images already
    # generated before quality was sent explicitly keep matching hashes (and
    # stay skipped on resume) as long as they're being treated as "medium".
    # An explicit non-default quality (e.g. a --draft run at "low", or an
    # entry pinned to "high") gets its own hash, so it never collides with -
    # or silently skips - a differently-priced image at the same path.
    if quality and quality != "medium":
        fields["quality"] = quality
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
    # Point 1: where the response carries a `usage` block, hand it back so
    # the caller can record real token usage in the manifest instead of
    # only the estimated dollar price.
    return out, payload.get("usage")


def api_generate(prompt, size, quality, transparent, cfg, api_key, pacer=None):
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
                "quality": quality,  # always explicit (point 1): the API's own
                                       # default is "high", which is what ran up
                                       # the original bill
                "n": 1,
                "background": "transparent" if transparent else "opaque",
            },
            timeout=180,
        )

    resp = request_with_retry(fn, cfg, pacer)
    images, usage = images_from_response(resp)
    return images[0], usage


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


def api_edit(prompt, size, quality, transparent, cfg, api_key, reference_paths, mask_path=None, pacer=None, mirror=()):
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
            "quality": quality,  # always explicit (point 1), see api_generate
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
    images, usage = images_from_response(resp)
    return images[0], usage


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


_SKIN_CACHE = {}


def skin_weight(im):
    """Cached _skin_weight (it is called several times per image by the
    post steps and takes ~2 s): keyed by a hash of the pixels."""
    arr = np.asarray(im.convert("RGBA"))
    key = hashlib.md5(arr.tobytes()).hexdigest()
    if key not in _SKIN_CACHE:
        if len(_SKIN_CACHE) > 8:
            _SKIN_CACHE.clear()
        _SKIN_CACHE[key] = _skin_weight(im)
    w, lab = _SKIN_CACHE[key]
    return w.copy(), lab.copy()


def _skin_weight(im):
    """Soft 0..1 skin mask for a hand sprite. Skin is an opaque, mid-light,
    warm colour that is not part of the sleeve.
    Skin Lab hue sits at 55-66 with chroma 30-50, but the palest lit skin
    reaches hue ~73 at chroma ~30-35, close to the cream linen sleeve (hue
    72-90, chroma 18-30): the sleeve is cut out as low chroma AND yellow
    hue together (chroma under ~30 at hue over ~72, or under ~24 at hue
    over ~66), which keeps pale lit skin in.
    Also excluded: transparent pixels, deep reds (Nani's sleeve, the girl's
    pink sleeve and red bangles, hue below ~40), golds and greens (hue above
    ~82), very saturated colours and very dark pixels. Nails sit close to
    skin and are corrected with it, proportionally."""
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    lab = rgb_to_lab(arr[..., :3])
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    hue = np.degrees(np.arctan2(b, a))
    w = _ramp(arr[..., 3], 1, 16)  # antialiased edges too, or they keep an orange fringe
    w = w * _ramp(C, 10, 16) * (1 - _ramp(C, 78, 88))      # not grey/white; very orange raw skin still in
    w = w * _ramp(hue, 40, 48) * (1 - _ramp(hue, 82, 88))  # skin hues only: reds out, golds/greens out
    w = w * _ramp(L, 25, 35) * (1 - _ramp(L, 93, 97))      # not deep shadow, not specular white
    # cream/white sleeve: a yellow hue with lowish chroma. The ramps are
    # wide and the weight is blurred, so skin that shades towards the
    # sleeve's hue fades out of the correction gradually: a hard mask here
    # leaves blotches on the cuff or pale patches on the hand.
    sleeve = np.maximum(_ramp(hue, 70, 80) * (1 - _ramp(C, 40, 50)), (1 - _ramp(C, 18, 26)) * _ramp(hue, 62, 68))
    w = w * (1 - sleeve)
    w = np.asarray(Image.fromarray((w * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(2.5))).astype(np.float64) / 255
    return w * _ramp(arr[..., 3], 1, 16), lab


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


def normalise_skin(im, target_lab, tolerance=3.0, passes=6):
    """Run _normalise_skin_once up to `passes` times (6 converges on every master image): a very orange raw
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


SKIN_PCTS = (5, 25, 50, 75, 95)


def skin_stats(im):
    """Percentiles (SKIN_PCTS) of the skin's Lab lightness and chroma, and
    its median hue (radians), over the confident skin core; None if too
    little skin. The midtone alone misses what reads as 'orange palms'
    (a long high-chroma tail) and 'pale, lit differently' (highlights too
    bright): both show in the percentiles."""
    w, lab = skin_weight(im)
    core = (w > 0.8) & (np.asarray(im.convert("RGBA"))[..., 3] >= 240)
    if int(core.sum()) < 400:
        return None
    C = np.hypot(lab[..., 1], lab[..., 2])[core]
    h = np.arctan2(lab[..., 2], lab[..., 1])[core]
    return {"L": np.percentile(lab[..., 0][core], SKIN_PCTS), "C": np.percentile(C, SKIN_PCTS),
            "h": float(np.median(h))}


def _pct_map(x, src, dst):
    """Piecewise-linear map taking the percentiles `src` to `dst`, with the
    end segments' slopes carried on beyond the ends (clamped to 0.3-3)."""
    src, dst = np.maximum.accumulate(np.asarray(src, float) + np.arange(len(src)) * 1e-3), np.asarray(dst, float)
    y = np.interp(x, src, dst)
    lo = np.clip((dst[1] - dst[0]) / (src[1] - src[0]), 0.3, 3)
    hi = np.clip((dst[-1] - dst[-2]) / (src[-1] - src[-2]), 0.3, 3)
    y = np.where(x < src[0], dst[0] + (x - src[0]) * lo, y)
    return np.where(x > src[-1], dst[-1] + (x - src[-1]) * hi, y)


def match_skin_distribution(im, ref):
    """Skin normaliser v2 (hands v1, step 1): map the image's skin lightness
    and chroma percentiles onto the reference's (`ref` = skin_stats of the
    reference hand) and rotate its hue to the reference's median, weighted
    by the soft skin mask. Fixes orange palms (the chroma tail is pulled
    in), too-bright or flat lighting (the lightness spread is matched) and
    the midtone at once. Returns (image, info)."""
    st = skin_stats(im)
    if st is None:
        return im, {"skin_action": "no skin found"}
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    w, lab = skin_weight(im)
    L, C, h = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2]), np.arctan2(lab[..., 2], lab[..., 1])
    L2 = L + (_pct_map(L, st["L"], ref["L"]) - L) * w
    C2 = np.maximum(C + (_pct_map(C, st["C"], ref["C"]) - C) * w, 0)
    h2 = h + (ref["h"] - st["h"]) * w
    rgba[..., :3] = lab_to_rgb(np.stack([L2, C2 * np.cos(h2), C2 * np.sin(h2)], axis=-1))
    out = Image.fromarray(rgba.astype(np.uint8), "RGBA")
    after = skin_stats(out)
    dist = lambda s: round(float(np.abs(s["L"] - ref["L"]).mean() + np.abs(s["C"] - ref["C"]).mean()), 2)
    return out, {"skin_action": "distribution matched", "skin_dist_before": dist(st),
                 "skin_dist_after": dist(after) if after else None,
                 "skin_before": measure_skin_midtone(im)[1], "skin_after": measure_skin_midtone(out)[1]}


# --------------------------------------------------------------------------
# Scale normaliser (hands v1, step 1): every hand sprite is rescaled so its
# forearm, measured just above the sleeve, is as wide as the reference's.
# Hands are swapped in code at one fixed size, so a pose drawn bigger or
# smaller than the reference would jump in size on screen.
# --------------------------------------------------------------------------

def sleeve_mask(im, red=False):
    """Sleeve fabric: cream or white (light, lower chroma than skin and a
    yellower hue: Lab hue about 75-90, skin 55-66) or Nani's deep red."""
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    lab = rgb_to_lab(arr[..., :3])
    C = np.hypot(lab[..., 1], lab[..., 2])
    hue = np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    cream = (lab[..., 0] > 55) & (C < 31) & (hue > 66) & (hue < 110)  # pale lit skin is chroma ~34, the cuff <= ~28
    red_ = (hue > -15) & (hue < 38) & (C > 30) & (lab[..., 0] < 58)  # Nani's deep-red kurta sleeve
    return (arr[..., 3] > 200) & ((cream | red_) if red else cream)


def _components(mask, min_px):
    """Connected components (4-neighbour) of a boolean mask, quarter-size
    labelling; returns a list of full-size boolean masks, biggest first."""
    small = mask[::4, ::4]
    lab = np.zeros(small.shape, dtype=np.int32)
    n, sizes = 0, {}
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
        sizes[n] = cnt * 16
    full = np.kron(lab, np.ones((4, 4), dtype=np.int32))[:mask.shape[0], :mask.shape[1]]
    keep = sorted((k for k, v in sizes.items() if v >= min_px), key=lambda k: -sizes[k])
    return [(full == k) & mask for k in keep]


def _dilate(mask, radius):
    """Fast approximate dilation: a max filter on a quarter-size mask."""
    small = Image.fromarray((mask[::4, ::4] * 255).astype(np.uint8), "L")
    k = max(3, (radius // 4) * 2 + 1)
    grown = np.asarray(small.filter(ImageFilter.MaxFilter(k))) > 0
    return np.kron(grown, np.ones((4, 4), dtype=bool))[:mask.shape[0], :mask.shape[1]]


def forearm_widths(im, band=(25, 110), red_sleeve=False):
    """Width of each forearm just beyond its sleeve, independent of the
    arm's direction: the arm silhouette (opaque, not sleeve) is eroded
    until nothing is left in the band `band` px beyond the sleeve; the
    number of erosions is half the width of the widest round section, i.e.
    the forearm's width. One value per sleeve (two-handed images give two).
    Returns a list of (width_px, (cx, cy)) with the band's centre."""
    rgba = np.asarray(im.convert("RGBA"))
    sm = sleeve_mask(im, red=red_sleeve)
    sm = np.asarray(Image.fromarray((sm * 255).astype(np.uint8), "L")
                    .filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))) > 0
    opaque = rgba[..., 3] > 128
    arm = opaque & ~_dilate(sm, 8)
    half = lambda m: m[::2, ::2]
    out = []
    # the rolled cuff and the sleeve below it are split by a shadow line:
    # merge them before labelling
    merged = _dilate(sm, 20)
    for comp in _components(merged, 6000)[:2]:
        sl = comp & sm
        if sl.sum() < 3000:
            continue
        ring = half(_dilate(sl, band[1]) & ~_dilate(sl, band[0]) & arm)
        if ring.sum() < 50:
            continue
        m = Image.fromarray((half(opaque) * 255).astype(np.uint8), "L")
        n = 0
        while (np.asarray(m) > 0)[ring].any() and n < 200:
            m = m.filter(ImageFilter.MinFilter(3))
            n += 1
        ys, xs = np.nonzero(ring)
        out.append((float(4 * n), (float(xs.mean() * 2), float(ys.mean() * 2))))
    return out


def normalise_scale(im, target_width, tolerance=0.04, limits=(0.6, 1.6), red_sleeve=False):
    """Rescale a hand sprite so its mean forearm width matches target_width.
    The anchor is the bottom-centre of the opaque pixels on the bottom edge
    (where the arm leaves the frame), so the arm still enters there. When
    growing would push the hand out of the frame, the canvas grows up or
    sideways (to multiples of 16 px); when shrinking, the sleeve is
    extended back down to the edge by repeating its last row. Returns
    (image, info)."""
    widths = forearm_widths(im, red_sleeve=red_sleeve)
    if not widths:
        return im, {"scale_action": "no forearm found"}
    width = float(np.mean([w for w, _ in widths]))
    k = target_width / width
    info = {"forearm_px": round(width, 1), "scale": round(k, 3)}
    if abs(k - 1) <= tolerance:
        info["scale_action"] = "within tolerance"
        return im, info
    if not limits[0] <= k <= limits[1]:
        info["scale_action"] = "out of range, left as is"
        return im, info
    im = im.convert("RGBA")
    W, H = im.size
    a = np.asarray(im)[..., 3]
    bottom = np.nonzero(a[-3:].max(axis=0) > 16)[0]
    ax = float(bottom.mean()) if len(bottom) else W / 2
    big = im.resize((max(1, round(W * k)), max(1, round(H * k))), Image.LANCZOS)
    ox, oy = round(ax - ax * k), round(H - H * k)
    # growing can push the hand past the frame: then the canvas grows too
    # (up and sideways, never down), keeping the arm's exit at the bottom
    # edge, so no hand is cut or left small. The game places hands by that
    # bottom pivot, so a bigger canvas is harmless.
    # only the hand has to stay in frame: the sleeve, in the bottom fifth
    # of the frame, may run off the edges (the arm comes from off-screen)
    top_part = np.asarray(big)[..., 3].copy()
    top_part[max(0, round(H * 0.8) - oy):] = 0
    bb = Image.fromarray(top_part).getbbox() or (0, 0, big.width, big.height)
    margin = 8
    pad_l = max(0, margin - (ox + bb[0]))
    pad_r = max(0, (ox + bb[2]) + margin - W)
    pad_t = max(0, margin - (oy + bb[1]))
    pad_l, pad_r, pad_t = (-(-v // 16) * 16 for v in (pad_l, pad_r, pad_t))
    canvas = Image.new("RGBA", (W + pad_l + pad_r, H + pad_t), (0, 0, 0, 0))
    canvas.paste(big, (ox + pad_l, oy + pad_t))
    if pad_l or pad_r or pad_t:
        info["canvas"] = list(canvas.size)
    H2 = canvas.height
    if k < 1 and oy + pad_t + big.height < H2:  # pad the sleeve down to the bottom edge
        arr = np.asarray(canvas).copy()
        last = oy + pad_t + big.height - 1
        arr[last + 1:] = arr[last]
        canvas = Image.fromarray(arr, "RGBA")
    cropped = []
    info.update(scale_action="rescaled", clipped=cropped)
    return canvas, info


def clean_key_edges(im):
    """After a magenta key-out: remove the dark saturated red rim the
    shaded placeholder leaves on the skin (hue 330-15, saturation > 0.5,
    darker than skin) and soften the cut edge by one pixel."""
    rgba = np.asarray(im.convert("RGBA")).astype(np.float64)
    h, sat, val = _hsv(rgba[..., :3])
    # near the cut, anything magenta-to-red (hue 290-12) is placeholder
    # residue, however light or dull; further away only dark saturated red
    cut = _dilate(rgba[..., 3] < 16, 12)
    rim = (((h >= 330) | (h <= 15)) & (sat > 0.5) & (val < 0.75)) | (cut & ((h >= 290) | (h <= 12)) & (sat > 0.15))
    rim &= rgba[..., 3] > 16
    if not rim.any():  # nothing to clean: leave the image untouched (safe to re-run)
        return im, 0
    rgba[..., 3] = np.where(rim, 0, rgba[..., 3])
    alpha = Image.fromarray(rgba[..., 3].astype(np.uint8), "L")
    soft = np.asarray(alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float64)
    near = np.asarray(Image.fromarray((rim * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(7))) > 0
    rgba[..., 3] = np.where(near, np.minimum(rgba[..., 3], soft), rgba[..., 3])
    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA"), int(rim.sum())


def normalise_red_sleeve(im, target_hex):
    """Nani's sleeve: the generator paints it a bright orange-red; shift its
    median colour (lightness, chroma, hue) to target_hex (her deep madder
    red), weighted by a soft mask of saturated reds (Lab hue -20..50,
    chroma over ~35). Skin (hue 55+, chroma ~35) and the gold embroidery
    and bangles (hue 70+) stay out. Returns (image, info)."""
    arr = np.asarray(im.convert("RGBA")).astype(np.float64)
    lab = rgb_to_lab(arr[..., :3])
    L, C, h = lab[..., 0], np.hypot(lab[..., 1], lab[..., 2]), np.degrees(np.arctan2(lab[..., 2], lab[..., 1]))
    w = _ramp(arr[..., 3], 1, 16) * _ramp(C, 30, 40) * _ramp(h, -30, -20) * (1 - _ramp(h, 44, 52)) * (1 - _ramp(L, 70, 80))
    core = w > 0.8
    if core.sum() < 2000:
        return im, {"sleeve_action": "no red sleeve found"}
    mL, mC, mh = np.median(L[core]), np.median(C[core]), np.median(h[core])
    t = rgb_to_lab(hex_to_rgb(target_hex))
    tL, tC, th = t[0], np.hypot(t[1], t[2]), np.degrees(np.arctan2(t[2], t[1]))
    L2 = L + (tL - mL) * w
    C2 = C * (1 + (tC / max(mC, 1e-6) - 1) * w)
    h2 = np.radians(h + (th - mh) * w)
    arr[..., :3] = lab_to_rgb(np.stack([L2, C2 * np.cos(h2), C2 * np.sin(h2)], axis=-1))
    out = Image.fromarray(arr.astype(np.uint8), "RGBA")
    return out, {"sleeve_before": rgb_to_hex(lab_to_rgb(np.array([mL, mC * np.cos(np.radians(mh)), mC * np.sin(np.radians(mh))]))),
                 "sleeve_target": target_hex, "sleeve_action": "corrected"}


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
    # the placeholder's shaded rim, where it meets the fingers, renders as a
    # dark saturated red-brown (HSV hue 0-30 or magenta, saturation > ~0.7,
    # value < ~0.7): clear it in a band just outside the keyed area, then
    # soften the new edge a little
    keyed = kill > 0.5
    band = _dilate(keyed, 14) & ~keyed
    rim = band & (sat > 0.68) & (val < 0.72) & ((h <= 32) | (h >= 280))
    kill = np.where(rim, 1.0, kill)
    removed = int(((kill > 0.5) & (rgba[..., 3] > 16)).sum())
    rgba[..., 3] = rgba[..., 3] * (1 - kill)
    soft = np.asarray(Image.fromarray(rgba[..., 3].astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.8)))
    rgba[..., 3] = np.where(_dilate(kill > 0.5, 4), np.minimum(rgba[..., 3], soft), rgba[..., 3])
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


def _ref_path(entry, cfg, field, default_key):
    sec = cfg.get(field) or {}
    return resolve_path(entry.get(default_key) or sec.get("reference"))


def post_process_hand(entry, im, cfg, cache={}):
    """Hands v1 post steps, in order, for an entry in a hand group:
    (1) after a magenta key-out, clean the red rim and soften the cut;
    (2) skin: an entry with a fixed `skin_target` hex (Nani's references)
    gets the midtone normaliser, every other hand the distribution match
    against its `skin_reference` (else the config's reference hand);
    (3) scale: forearm width matched to `scale_normalise.target_forearm_px`
    (or the entry's `scale_reference` image's). Returns (image, info)."""
    info = {}
    if skin_target_for(entry, cfg) is None:  # not a hand group
        return im, info
    if entry.get("key_out") == "magenta":
        im, n = clean_key_edges(im)
        info["key_rim_px"] = n
    tol = (cfg.get("skin_normalise") or {}).get("tolerance_delta_e", 3.0)
    if entry.get("skin_target"):
        im, sk = normalise_skin(im, rgb_to_lab(hex_to_rgb(entry["skin_target"])), tol)
    elif entry.get("skin_mode") == "midtone":  # e.g. mehndi: a full-range match would fade the pattern
        im, sk = normalise_skin(im, skin_target_for(entry, cfg), tol)
    else:
        ref = resolve_path(entry.get("skin_reference") or (cfg.get("skin_normalise") or {}).get("reference"))
        key = ("skin", ref, os.path.getmtime(ref))
        if key not in cache:
            cache[key] = skin_stats(Image.open(ref))
        im, sk = match_skin_distribution(im, cache[key])
    info.update(sk)
    if entry.get("sleeve_target"):
        im, sl = normalise_red_sleeve(im, entry["sleeve_target"])
        info.update(sl)
    sc = cfg.get("scale_normalise") or {}
    if sc and entry.get("scale_normalise", True):
        target = sc.get("target_forearm_px")
        nani = str(entry.get("group", "")).startswith("hands-nani")
        if entry.get("scale_reference"):
            ref = resolve_path(entry["scale_reference"])
            key = ("scale", ref, os.path.getmtime(ref))
            if key not in cache:
                ws = forearm_widths(Image.open(ref), red_sleeve=nani)
                cache[key] = float(np.mean([w for w, _ in ws])) if ws else None
            target = cache[key]
        if target:
            ws = forearm_widths(im, red_sleeve=nani)
            vals = [w for w, _ in ws]
            if len(vals) == 2 and abs(vals[0] - vals[1]) > 0.15 * max(vals):
                info.update(scale_action="arms disagree, left as is (check by eye)",
                            forearm_px=[round(v) for v in vals])
            else:
                im, s = normalise_scale(im, target, sc.get("tolerance", 0.04), tuple(sc.get("limits", (0.6, 1.8))), nani)
                info.update(s)
                if s.get("scale_action") == "rescaled":  # the width estimate shifts a little: one more pass
                    im, s2 = normalise_scale(im, target, sc.get("tolerance", 0.04), (0.8, 1.25), nani)
                    info["second_pass"] = {k: s2.get(k) for k in ("forearm_px", "scale", "scale_action")}
    return im, info


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


def build_contact_sheet(group, data, out_dir, thumb=220, cols=5, label_h=24, name=None, notes=None):
    """Labelled contact sheet of a group's outputs on a checkerboard. Every
    tile uses the SAME zoom (canvas pixels to sheet pixels) and sits on the
    tile's bottom edge, where the arm leaves the frame, so a hand drawn too
    big or too small stands out. `notes` maps asset id -> a second label
    line (e.g. finger count and verdict); a note starting with "FAIL" is
    drawn in red."""
    entries = [a for a in data["assets"] if a.get("group") == group]
    if not entries:
        raise ValueError(f"no assets in group {group!r}")
    notes = notes or {}
    if notes:
        label_h = 36

    defaults = data.get("defaults", {})
    tiles = []
    for entry in entries:
        variants = entry.get("variants", defaults.get("variants", 1))
        for i in range(variants):
            path = resolve_path(variant_path(entry["output"], i, variants))
            label = entry["id"] if variants <= 1 else f"{entry['id']} v{i}"
            im = Image.open(path).convert("RGBA") if os.path.exists(path) else None
            tiles.append((label, im, notes.get(entry["id"], "")))

    if len(tiles) > 15:
        cols = 8
    biggest = max([max(im.size) for _, im, _ in tiles if im is not None] or [1024])
    zoom = (thumb - 8) / biggest
    cell_w, cell_h = thumb, thumb + label_h
    rows = (len(tiles) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * cell_w, rows * cell_h), (40, 40, 40))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    for idx, (label, im, note) in enumerate(tiles):
        r, c = divmod(idx, cols)
        x0, y0 = c * cell_w, r * cell_h
        if im is not None:
            fitted = im.resize((max(1, round(im.width * zoom)), max(1, round(im.height * zoom))), Image.LANCZOS)
            tile_bg = checkerboard((thumb, thumb))
            tile_bg.paste(fitted, ((thumb - fitted.width) // 2, thumb - fitted.height), fitted)
            canvas.paste(tile_bg, (x0, y0))
        else:
            draw.rectangle((x0, y0, x0 + thumb, y0 + thumb), outline=(200, 60, 60), width=2)
            draw.text((x0 + 8, y0 + thumb // 2 - 6), "missing", fill=(220, 120, 120), font=font)
        short = label.replace("hand-girl-", "").replace("hand-eid-", "").replace("hand-", "").replace("nani-", "N ")
        draw.text((x0 + 4, y0 + thumb + 4), short[:36], fill=(235, 235, 235), font=font)
        if note:
            col = (240, 110, 110) if note.upper().startswith("FAIL") else (150, 220, 150)
            draw.text((x0 + 4, y0 + thumb + 18), note[:36], fill=col, font=font)

    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{name or group}.png")
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
    draft = bool(getattr(args, "draft", False))
    cli_quality = "low" if draft else getattr(args, "quality", None)
    max_regens = args.max_regens if args.max_regens is not None else cfg.get("max_regens", 1)

    selected = [a for a in assets if entry_matches_only(a, args.only)]
    if not selected:
        print(f"no assets matched --only {args.only!r}")
        return

    print(f"{'DRY RUN' if dry_run else 'LIVE RUN'}{' (draft, quality=low)' if draft else ''} -- "
          f"{len(selected)} asset(s), model={cfg['model']}, concurrency {cfg['max_concurrency']}, "
          f"gap {cfg['min_request_gap_seconds']}s, max_regens {max_regens}")
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
        quality = quality_for(entry, cfg, cli_quality)
        # Point 3 (--draft): quality low, and a separate drafts/ subfolder so
        # cheap prompt checks never land on (or get skipped in place of) a
        # real asset path.
        out_rel = os.path.join(DRAFT_SUBDIR, entry["output"]) if draft else entry["output"]
        out_base = resolve_path(out_rel)

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
        unit_price = price_for_size(cfg, quality, size)
        # Point 2: automatic regen only applies to a mode with an automated
        # QA check (today, just reskin's drift check) -- generate/edit have
        # nothing to auto-retry against, so they always run once.
        entry_max_regens = max_regens if mode == "reskin" else 0

        for i in range(variants):
            key = f"{eid}::v{i}" + ("::draft" if draft else "")
            phash = compute_prompt_hash(prompt, mode, size, transparent, references, mask, i, mirror, quality)
            out_path = variant_path(out_base, i, variants)
            existing = manifest.get(key)
            existing_status = (existing or {}).get("status", "")
            already_done = bool(existing and existing.get("prompt_hash") == phash
                                and existing_status.startswith(("done", "rejected")))
            # Point 2, second half: a QA-rejected item stays rejected on
            # resume -- no silent "round 2" -- unless --retry-rejected asks
            # for exactly that.
            if already_done and existing_status.startswith("rejected") and args.retry_rejected:
                already_done = False

            if already_done:
                skip_ct += 1
                print(f"[{key}] skip (already {existing_status})")
                continue

            if args.budget is not None and planned_total + unit_price > args.budget + 1e-9:
                print(f"budget cap (${args.budget:.2f}) reached; stopping before {key}"
                      f"{' (dry run)' if dry_run else ''}")
                budget_stop = True
                break

            planned_total += unit_price
            tasks.append(dict(key=key, eid=eid, entry=entry, mode=mode, size=size, transparent=transparent,
                              quality=quality, prompt=prompt, references=references, mask=mask, mirror=mirror,
                              unit_price=unit_price, max_regens=entry_max_regens, phash=phash, out_path=out_path))

    waves = plan_waves(tasks, assets_by_id)
    if dry_run:
        for w, wave in enumerate(waves):
            print(f"-- wave {w} ({len(wave)} request(s), run concurrently)")
            for t in wave:
                label = (f"[{t['key']}] {t['mode']:8s} {t['size']:11s} quality={t['quality']:6s} "
                         f"${t['unit_price']:.3f}  {t['eid']} -> {os.path.relpath(t['out_path'], GAME)}")
                if t["references"]:
                    label += f"  refs={t['references']}"
                p = t["prompt"]
                print(f"{label}\n    prompt: {p[:160]}{'...' if len(p) > 160 else ''}")
        print(f"\nestimated cost for this run: {len(tasks)} image(s) x price at chosen quality = "
              f"${planned_total:.2f} (skipped {skip_ct} already-done item(s))")
        return

    # Point 4: pre-flight estimate before any paid run. A plain image count x
    # price total over the threshold needs an explicit --yes.
    threshold = cfg.get("preflight_dollar_threshold", 5.0)
    print(f"\npre-flight estimate: {len(tasks)} image(s) planned, ~${planned_total:.2f} at the chosen quality "
          f"(a QA regen can add up to {max_regens} more attempt(s) per reskin image; skipped {skip_ct} already-done)")
    if planned_total > threshold and not args.yes:
        print(f"estimated spend (${planned_total:.2f}) exceeds ${threshold:.2f}; re-run with --yes to proceed.")
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
        max_attempts = 1 + t["max_regens"]
        t0 = time.monotonic()
        final = None
        for attempt in range(1, max_attempts + 1):
            print(f"[{key}] queued {mode} {t['size']} quality={t['quality']} attempt {attempt}/{max_attempts} "
                  f"(+{time.monotonic() - t0:.0f}s; the pacer holds the actual request start)")
            billed = False
            try:
                if mode == "generate":
                    img, usage = api_generate(t["prompt"], t["size"], t["quality"], t["transparent"], cfg, api_key, pacer)
                else:
                    ref_paths = [resolve_path(r) for r in t["references"]]
                    img, usage = api_edit(t["prompt"], t["size"], t["quality"], t["transparent"], cfg, api_key,
                                          ref_paths, resolve_path(t["mask"]), pacer, t["mirror"])
                billed = True
                os.makedirs(os.path.dirname(t["out_path"]), exist_ok=True)
                img.save(t["out_path"])
                raw = os.path.join(GAME, "build", "raw", os.path.relpath(t["out_path"], GAME))
                os.makedirs(os.path.dirname(raw), exist_ok=True)
                img.save(raw)  # untouched API output (git-ignored), before key-out / skin normalising
            except Exception as exc:
                # Only a request that reached generation is billed: local
                # config errors never left the machine and a 4xx is rejected
                # before generation. Network errors / exhausted 5xx retries
                # are counted conservatively, since we can't tell whether it
                # was generated. A hard error stops this image entirely --
                # only a QA failure (below) triggers an automatic regen.
                if not billed and not isinstance(exc, (ConfigError, APIRejected)):
                    billed = True
                record(key, {"status": "error", "prompt_hash": t["phash"], "group": entry.get("group"),
                             "mode": mode, "quality": t["quality"], "error": str(exc), "billed": billed,
                             "attempt": attempt})
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
            if entry.get("flip_output"):
                Image.open(t["out_path"]).transpose(Image.FLIP_LEFT_RIGHT).save(t["out_path"])
            if entry.get("key_out") == "magenta":
                keyed, removed = key_out_magenta(Image.open(t["out_path"]))
                keyed, _ = drop_fragments(keyed)
                keyed, _ = fix_magenta_spill(keyed)
                keyed.save(t["out_path"])
                skin["keyed_out_px"] = removed
                print(f"[{key}] keyed out {removed} px of magenta placeholder")
            if skin_target_for(entry, cfg) is not None:
                fixed, post = post_process_hand(entry, Image.open(t["out_path"]), cfg)
                fixed.save(t["out_path"])
                skin.update(post)
                print(f"[{key}] skin {post.get('skin_before')} -> {post.get('skin_after')} "
                      f"({post.get('skin_action')}); scale {post.get('scale', '-')} ({post.get('scale_action', 'off')})")

            status, iou = "done", None
            if mode == "reskin":
                master_out = resolve_path(assets_by_id[entry["master"]]["output"])
                iou, ok = drift_check(t["out_path"], master_out, args.drift_threshold)
                status = "done" if ok else DRIFT_REJECT_STATUS
                print(f"[{key}] drift check {'OK' if ok else 'FAILED'} (IoU {iou:.3f}), "
                      f"attempt {attempt}/{max_attempts}")

            with stats_lock:
                stats["spent"] += t["unit_price"]  # every attempt is a real, billed request
            final = {"status": status, "prompt_hash": t["phash"], "group": entry.get("group"), "mode": mode,
                     "quality": t["quality"], "output": t["out_path"], "cost": t["unit_price"], "iou": iou,
                     "seconds": round(elapsed, 1), "attempt": attempt, **skin}
            if usage:  # point 1: real token usage, when the API returns it
                final["usage"] = usage

            if status == "done" or attempt == max_attempts:
                break
            print(f"[{key}] QA failed; auto-regenerating (regen {attempt} of {max_attempts - 1} allowed by "
                  f"--max-regens/config) ...")

        record(key, final)
        with stats_lock:
            stats["run"] += 1
            stats["done" if final["status"] == "done" else "reject"] += 1
        print(f"[{key}] {final['status']} in {time.monotonic() - t0:.0f}s -> {os.path.relpath(t['out_path'], GAME)}")

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

# --------------------------------------------------------------------------
# Self-test (point 5): a quick offline check of the cost-conservative bits
# -- the price table, dry-run planning (including --draft and --quality),
# and one mocked API call -- with no network access and no OPENAI_API_KEY
# needed. `python3 build/gen_assets.py --self-test`.
# --------------------------------------------------------------------------

class _FakeAPIResponse:
    """A stand-in for requests.Response, just enough for images_from_response
    and request_with_retry's status_code check."""

    def __init__(self, payload):
        self.status_code = 200
        self._payload = payload
        self.headers = {}
        self.text = ""

    def json(self):
        return self._payload

    def raise_for_status(self):  # pragma: no cover - never hit at status 200
        pass


class _FakeRequests:
    """A stand-in for the `requests` module: enough of its surface for
    api_generate/api_edit and request_with_retry to run against, with every
    call recorded instead of going over the network."""

    class RequestException(Exception):
        pass

    def __init__(self, payload):
        self._payload = payload
        self.calls = []

    def post(self, url, **kwargs):
        self.calls.append((url, kwargs))
        return _FakeAPIResponse(self._payload)


def _self_test_png_b64():
    buf = io.BytesIO()
    Image.new("RGBA", (2, 2), (200, 120, 90, 255)).save(buf, "PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")


def self_test():
    """Run every check; print PASS/FAIL per check and a summary. Returns
    True iff everything passed (main() uses this as the process exit code)."""
    results = []

    def check(name, fn):
        try:
            fn()
        except Exception as exc:  # noqa: BLE001 - a failed check just gets reported
            results.append((name, False, f"{type(exc).__name__}: {exc}"))
        else:
            results.append((name, True, ""))

    # 1) price table: known gpt-image-1 prices, by quality AND size, and the
    # per-quality "default" fallback for an unlisted size.
    def price_table():
        cfg = load_config({})
        assert price_for_size(cfg, "low", "1024x1024") == 0.011
        assert price_for_size(cfg, "medium", "1024x1024") == 0.042
        assert price_for_size(cfg, "high", "1024x1024") == 0.167
        assert price_for_size(cfg, "medium", "1024x1536") == 0.063
        assert price_for_size(cfg, "high", "1536x1024") == 0.25
        assert price_for_size(cfg, "low", "2048x2048") == cfg["price_per_image"]["low"]["default"]
        # medium is always noticeably cheaper than high, at every size in
        # the table -- the whole point of this change
        for size, med in cfg["price_per_image"]["medium"].items():
            assert med < cfg["price_per_image"]["high"][size], f"medium not cheaper than high at {size}"
    check("price table (low/medium/high x size)", price_table)

    # 2) an asset-list "config" override merges into, rather than replacing,
    # the built-in price table (load_config's per-quality dict merge).
    def price_override_merge():
        cfg = load_config({"config": {"quality": "low",
                                       "price_per_image": {"medium": {"1024x1024": 0.05}}}})
        assert cfg["quality"] == "low"
        assert cfg["price_per_image"]["medium"]["1024x1024"] == 0.05
        assert cfg["price_per_image"]["low"]["1024x1024"] == 0.011  # untouched sibling entry
        assert cfg["price_per_image"]["high"]["1024x1024"] == 0.167  # untouched sibling quality
    check("config price_per_image override merges (not replaces)", price_override_merge)

    # 3) dry-run planning: quality defaults to medium, --quality and --draft
    # override it, --draft writes under drafts/, and nothing touches the
    # network (dry_run=True forces this regardless of OPENAI_API_KEY).
    tmp_dir = tempfile.mkdtemp(prefix="gen-assets-selftest-")

    def make_args(**over):
        base = dict(asset_list=None, manifest=os.path.join(tmp_dir, "manifest.json"), only=None, variants=None,
                     max_concurrency=None, budget=None, dry_run=True, drift_threshold=DEFAULT_DRIFT_THRESHOLD,
                     quality=None, draft=False, max_regens=None, retry_rejected=False, yes=False)
        base.update(over)
        return argparse.Namespace(**base)

    asset_list_path = os.path.join(tmp_dir, "asset-list.json")
    with open(asset_list_path, "w") as f:
        json.dump({
            "style_block": "style", "negative_block": "", "templates": {},
            "defaults": {"size": "1024x1024", "transparent": True, "variants": 1},
            "assets": [{"id": "selftest-item", "group": "selftest", "mode": "generate",
                        "output": "build/selftest/out.png", "prompt": "a single red apple"}],
        }, f)

    def dry_run_default_quality():
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            run(make_args(asset_list=asset_list_path))
        out = buf.getvalue()
        assert "quality=medium" in out, out
        assert "estimated cost for this run: 1 image(s)" in out, out
        assert "$0.04" in out, out  # 1 x medium 1024x1024 = $0.042
    check("dry-run: defaults to quality=medium, correct estimate", dry_run_default_quality)

    def dry_run_quality_flag():
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            run(make_args(asset_list=asset_list_path, quality="high"))
        out = buf.getvalue()
        assert "quality=high" in out, out
        assert "$0.17" in out or "$0.167" in out, out
    check("dry-run: --quality overrides the default", dry_run_quality_flag)

    def dry_run_draft():
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            run(make_args(asset_list=asset_list_path, draft=True))
        out = buf.getvalue()
        assert "quality=low" in out, out
        assert "::draft" in out, out  # draft's own manifest key, distinct from the production one
        assert f"{DRAFT_SUBDIR}{os.sep}" in out, out  # output path is redirected under drafts/
    check("dry-run: --draft forces quality=low and a drafts/ path", dry_run_draft)

    def dry_run_no_network():
        global requests
        real_requests = requests
        fake = _FakeRequests({"data": []})
        requests = fake
        try:
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                run(make_args(asset_list=asset_list_path))
            assert fake.calls == [], "dry run made a network call"
        finally:
            requests = real_requests
    check("dry-run makes no network calls", dry_run_no_network)

    # 4) a mocked API call: no real network access, but exercises the exact
    # code path a live run uses, and checks that quality is always sent
    # explicitly and that a returned `usage` block comes back to the caller.
    def mocked_api_call():
        global requests
        real_requests = requests
        payload = {"data": [{"b64_json": _self_test_png_b64()}],
                   "usage": {"input_tokens": 50, "output_tokens": 1056, "total_tokens": 1106}}
        fake = _FakeRequests(payload)
        requests = fake
        try:
            cfg = load_config({})
            img, usage = api_generate("a single red apple", "1024x1024", "low", True, cfg, "sk-fake", pacer=None)
            assert img.size == (2, 2)
            assert usage == payload["usage"]
            assert len(fake.calls) == 1
            sent = fake.calls[0][1]["json"]
            assert sent["quality"] == "low", sent  # point 1: quality is always explicit
            assert sent["size"] == "1024x1024"
            assert sent["model"] == cfg["model"]
        finally:
            requests = real_requests
    check("mocked API call: quality sent explicitly, usage recorded", mocked_api_call)

    print("\nself-test results:")
    ok = True
    for name, passed, detail in results:
        print(f"  [{'PASS' if passed else 'FAIL'}] {name}" + (f" -- {detail}" if detail else ""))
        ok = ok and passed
    print(f"{sum(1 for _, p, _ in results if p)}/{len(results)} passed")
    return ok


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
    p.add_argument("--quality", choices=list(QUALITIES), default=None,
                    help="quality for every selected asset this run, overriding each entry's own 'quality' and the "
                         "config default (medium). gpt-image-1 prices roughly: low $0.011, medium $0.042, "
                         "high $0.167 per 1024x1024 image; larger sizes cost more (see CONFIG.price_per_image).")
    p.add_argument("--draft", action="store_true",
                    help="cheap prompt check: quality low, output under a drafts/ subfolder instead of the real "
                         "asset paths, so nothing real is overwritten or skipped by a draft run")
    p.add_argument("--max-regens", type=int, default=None,
                    help="extra attempts after an automated QA failure (currently: a reskin's drift check) before "
                         "giving up on that image; default 1 (config max_regens). 0 disables auto-regen.")
    p.add_argument("--retry-rejected", action="store_true",
                    help="also re-plan entries a previous run's QA already gave up on (status 'rejected: ...'); "
                         "off by default, so a rejected image never gets a silent, unattended 'round 2'")
    p.add_argument("--yes", action="store_true",
                    help="skip the pre-flight confirmation for a live run whose estimate exceeds "
                         "config preflight_dollar_threshold (default $5)")
    p.add_argument("--self-test", action="store_true",
                    help="run a quick offline self-test (dry-run planning, the price table, a mocked API call) "
                         "and exit; makes no network calls")

    p.add_argument("--contact-sheet", metavar="GROUP", help="build a contact sheet PNG for this group and exit")
    p.add_argument("--sheet-name", help="with --contact-sheet: file name (without .png) instead of the group's")
    p.add_argument("--sheet-notes", metavar="JSON", help="with --contact-sheet: JSON file mapping asset id -> note line")
    p.add_argument("--drift-check", nargs=2, metavar=("CANDIDATE", "MASTER"),
                    help="standalone silhouette-IoU drift check between two PNGs, then exit")
    p.add_argument("--cutout", nargs=3, metavar=("BACKGROUND", "EDITED", "OUT"),
                    help="cut the added item out of an edited station image, then exit")
    p.add_argument("--shadow-out", metavar="PATH", help="with --cutout: also save the item's shadow as its own layer")
    p.add_argument("--skin-measure", nargs="+", metavar="PNG", help="print each hand's masked skin midtone hex, then exit")
    p.add_argument("--skin-normalise", nargs=2, metavar=("IN", "OUT"),
                    help="colour-match a hand's skin to --skin-target (hex) or the master reference, then exit")
    p.add_argument("--skin-target", metavar="HEX", help="with --skin-normalise: the target midtone hex")

    p.add_argument("--from-raw", action="store_true",
                    help="with --post: start from the untouched API output in build/raw/ (key-out included)")
    p.add_argument("--post", metavar="IDS",
                    help="re-run the hand post steps (key-edge clean, skin match, scale) on the current outputs of "
                         "these asset ids or groups (comma-separated), in place, then exit")

    args = p.parse_args()

    if args.self_test:
        sys.exit(0 if self_test() else 1)

    if args.post:
        data = load_asset_list(args.asset_list)
        cfg = load_config(data)
        for entry in data["assets"]:
            if not entry_matches_only(entry, args.post):
                continue
            path = resolve_path(entry["output"])
            src = os.path.join(GAME, "build", "raw", os.path.relpath(path, GAME)) if args.from_raw else path
            if not os.path.exists(src):
                print(f"[{entry['id']}] missing {os.path.relpath(src, GAME)}")
                continue
            im = Image.open(src).convert("RGBA")
            if args.from_raw and entry.get("key_out") == "magenta":
                im, _ = key_out_magenta(im)
                im, _ = drop_fragments(im)
                im, _ = fix_magenta_spill(im)
            if args.from_raw and entry.get("flip_output"):
                im = im.transpose(Image.FLIP_LEFT_RIGHT)
            out, info = post_process_hand(entry, im, cfg)
            out.save(path)
            print(f"[{entry['id']}] {json.dumps(info)}", flush=True)
        return

    if args.contact_sheet:
        data = load_asset_list(args.asset_list)
        notes = json.load(open(args.sheet_notes)) if args.sheet_notes else None
        out_path = build_contact_sheet(args.contact_sheet, data, DEFAULT_CONTACT_SHEET_DIR,
                                       name=args.sheet_name, notes=notes)
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
