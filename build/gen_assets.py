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
import time

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
    "request_delay_seconds": 1.5,
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

def resolve_prompt(entry, style_block, templates):
    if entry.get("prompt"):
        return f"{style_block}\n\n{entry['prompt']}".strip()
    tmpl_name = entry.get("template")
    if not tmpl_name:
        raise ValueError(f"{entry.get('id')}: needs a 'prompt' or a 'template'")
    tmpl = templates.get(tmpl_name)
    if tmpl is None:
        raise ValueError(f"{entry.get('id')}: unknown template {tmpl_name!r}")
    fields = dict(entry.get("fields", {}))
    fields.setdefault("style", style_block)
    return tmpl.format(**fields).strip()


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

def request_with_retry(fn, cfg):
    max_retries = cfg["max_retries"]
    base_delay = cfg["backoff_base_seconds"]
    for attempt in range(max_retries + 1):
        try:
            resp = fn()
        except Exception as exc:  # network error: retry like a 5xx
            if attempt == max_retries:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, base_delay)
            print(f"    network error ({exc}); retrying in {delay:.1f}s ...")
            time.sleep(delay)
            continue
        if resp.status_code == 200:
            return resp
        if resp.status_code == 429 or resp.status_code >= 500:
            if attempt == max_retries:
                resp.raise_for_status()
            retry_after = resp.headers.get("Retry-After")
            delay = float(retry_after) if retry_after else base_delay * (2 ** attempt) + random.uniform(0, base_delay)
            print(f"    HTTP {resp.status_code}; retrying in {delay:.1f}s ...")
            time.sleep(delay)
            continue
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


def api_generate(prompt, size, transparent, cfg, api_key):
    if requests is None:
        raise RuntimeError("the 'requests' package is required for real API calls")

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

    resp = request_with_retry(fn, cfg)
    return images_from_response(resp)[0]


def api_edit(prompt, size, transparent, cfg, api_key, reference_paths, mask_path=None):
    if requests is None:
        raise RuntimeError("the 'requests' package is required for real API calls")

    def fn():
        opened = []
        try:
            files = []
            for p in reference_paths:
                fh = open(p, "rb")
                opened.append(fh)
                files.append(("image[]", (os.path.basename(p), fh, "image/png")))
            data = {
                "model": cfg["model"],
                "prompt": prompt,
                "size": size,
                "n": "1",
                "background": "transparent" if transparent else "opaque",
            }
            if mask_path:
                mfh = open(mask_path, "rb")
                opened.append(mfh)
                files.append(("mask", (os.path.basename(mask_path), mfh, "image/png")))
            return requests.post(
                EDITS_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                data=data,
                files=files,
                timeout=180,
            )
        finally:
            for fh in opened:
                fh.close()

    resp = request_with_retry(fn, cfg)
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


def run(args):
    data = load_asset_list(args.asset_list)
    cfg = load_config(data)
    style_block = data["style_block"]
    templates = data["templates"]
    defaults = data["defaults"]
    assets = data["assets"]
    assets_by_id = {a["id"]: a for a in assets}

    manifest = load_manifest(args.manifest)
    api_key = os.environ.get("OPENAI_API_KEY")
    dry_run = args.dry_run if args.dry_run is not None else not bool(api_key)

    selected = [a for a in assets if entry_matches_only(a, args.only)]
    if not selected:
        print(f"no assets matched --only {args.only!r}")
        return

    spent = 0.0
    planned_total = 0.0
    done_ct = skip_ct = run_ct = reject_ct = 0

    print(f"{'DRY RUN' if dry_run else 'LIVE RUN'} -- {len(selected)} asset(s), model={cfg['model']}")
    if args.budget is not None:
        print(f"budget cap: ${args.budget:.2f}")

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
            prompt = resolve_prompt(entry, style_block, templates)
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

            label = f"[{key}] {mode:8s} {size:11s} ${unit_price:.3f}  {eid}"
            if references:
                label += f"  refs={references}"

            if args.budget is not None and planned_total + unit_price > args.budget + 1e-9:
                print(f"budget cap (${args.budget:.2f}) reached; stopping before {key}"
                      f"{' (dry run)' if dry_run else ''}")
                budget_stop = True
                break

            planned_total += unit_price
            if dry_run:
                print(f"{label}\n    prompt: {prompt[:160]}{'...' if len(prompt) > 160 else ''}")
                continue

            print(label)
            try:
                if mode == "generate":
                    img = api_generate(prompt, size, transparent, cfg, api_key)
                elif mode in ("edit", "reskin"):
                    ref_paths = [resolve_path(r) for r in references]
                    img = api_edit(prompt, size, transparent, cfg, api_key, ref_paths, resolve_path(mask))
                else:
                    raise ValueError(f"unknown mode {mode!r}")
            except Exception as exc:
                manifest[key] = {
                    "status": "error",
                    "prompt_hash": phash,
                    "group": entry.get("group"),
                    "mode": mode,
                    "error": str(exc),
                }
                save_manifest(args.manifest, manifest)
                print(f"    ERROR: {exc}")
                spent += unit_price  # the API call was still made/billed
                time.sleep(cfg["request_delay_seconds"])
                continue

            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            img.save(out_path)
            spent += unit_price
            run_ct += 1

            status = "done"
            iou = None
            if mode == "reskin":
                master_out = resolve_path(assets_by_id[entry["master"]]["output"])
                iou, ok = drift_check(out_path, master_out, args.drift_threshold)
                status = "done" if ok else DRIFT_REJECT_STATUS
                if not ok:
                    reject_ct += 1
                    print(f"    drift check FAILED (IoU {iou:.3f} < {args.drift_threshold}) -> {DRIFT_REJECT_STATUS}")
                else:
                    print(f"    drift check OK (IoU {iou:.3f})")
            else:
                done_ct += 1

            manifest[key] = {
                "status": status,
                "prompt_hash": phash,
                "group": entry.get("group"),
                "mode": mode,
                "output": out_path,
                "cost": unit_price,
                "iou": iou,
            }
            save_manifest(args.manifest, manifest)
            time.sleep(cfg["request_delay_seconds"])

    if dry_run:
        print(f"\nestimated cost for this run: ${planned_total:.2f} "
              f"(skipped {skip_ct} already-done item(s))")
    else:
        print(f"\nspent ${spent:.2f} this run -- {run_ct} generated, {done_ct} done, "
              f"{reject_ct} flagged for drift, {skip_ct} skipped (already done)")


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--asset-list", default=DEFAULT_ASSET_LIST)
    p.add_argument("--manifest", default=DEFAULT_MANIFEST)
    p.add_argument("--only", help="restrict to one group or asset id (comma-separated for several)")
    p.add_argument("--variants", type=int, default=None, help="override the variant count for every selected asset")
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
