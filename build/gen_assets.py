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


def compute_prompt_hash(prompt, mode, size, transparent, references, mask, variant_index):
    payload = json.dumps(
        {
            "prompt": prompt,
            "mode": mode,
            "size": size,
            "transparent": transparent,
            "references": references,
            "mask": mask,
            "variant": variant_index,
        },
        sort_keys=True,
    )
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


def api_edit(prompt, size, transparent, cfg, api_key, reference_paths, mask_path=None, pacer=None):
    if requests is None:
        raise ConfigError("the 'requests' package is required for real API calls")
    # Read every local file up front: a missing reference is a config error
    # and must fail fast, not go through the network retry/backoff loop.
    refs = [(os.path.basename(p), _read_local(p, "reference image")) for p in reference_paths]
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
        draw.text((x0 + 4, y0 + thumb + 4), label, fill=(235, 235, 235), font=font)

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
        unit_price = price_for_size(cfg, size)

        for i in range(variants):
            key = f"{eid}::v{i}"
            phash = compute_prompt_hash(prompt, mode, size, transparent, references, mask, i)
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
                              prompt=prompt, references=references, mask=mask, unit_price=unit_price,
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
                               resolve_path(t["mask"]), pacer)
            billed = True
            os.makedirs(os.path.dirname(t["out_path"]), exist_ok=True)
            img.save(t["out_path"])
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

        status, iou = "done", None
        if mode == "reskin":
            master_out = resolve_path(assets_by_id[entry["master"]]["output"])
            iou, ok = drift_check(t["out_path"], master_out, args.drift_threshold)
            status = "done" if ok else DRIFT_REJECT_STATUS
            print(f"[{key}] drift check {'OK' if ok else 'FAILED'} (IoU {iou:.3f})")
        record(key, {"status": status, "prompt_hash": t["phash"], "group": entry.get("group"), "mode": mode,
                     "output": t["out_path"], "cost": t["unit_price"], "iou": iou,
                     "seconds": round(elapsed, 1)})
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

    run(args)


if __name__ == "__main__":
    main()
