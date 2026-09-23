#!/usr/bin/env python3
"""Generate flicker-free expression frames for Nani.

One base illustration + AI *edits* of it. A script then pastes back only the
changed eye/mouth pixels onto the untouched base, so the body never moves
between frames. See lab/nani-build-brief.md (build brief, section 3) for the
full spec this implements.

Usage: build/.venv/bin/python build/expressions.py
"""
import io
import json
import os
import sys
import time

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_PATH = os.path.join(REPO, "assets", "characters", "nani", "nani-neutral.png")
WORK_DIR = os.path.join(REPO, "build", "expr_work")
OUT_DIR = os.path.join(REPO, "assets", "characters", "nani", "expr")
REVIEW_DIR = os.path.join(REPO, "lab", "review")
FACE_MODEL_PATH = os.path.join(WORK_DIR, "face_landmarker.task")

MODEL_PRIMARY = "gemini-3.1-flash-image"   # "Nano Banana 2" -- latest stable image-edit model per live models.list()
UPSCALE = 3
CANVAS_ASPECT = (9, 16)   # closest Gemini-supported aspect ratio to 327:700 (0.467 vs 0.5625)
BG_COLOR = (232, 224, 208)  # #E8E0D0

CALL_CAP = 16
CANDIDATES_PER_FRAME = 2

DIFF_THRESHOLD = 45       # RGB-sum delta to count a pixel as "changed"
MASK_DILATE_PX = 6
MASK_FEATHER_PX = 8
LEAK_MAX_FRAC = 0.015     # 1.5%
SEAM_MAX = 18
NOOP_MIN_FRAC = 0.0015    # 0.15%
REGISTRATION_BAND_FRAC = 0.40   # top 40% used for ECC head registration
LEAK_CHECK_BAND_FRAC = 0.45     # leak is only meaningful within the registration-trusted band

FRAMES = [
    {
        "id": "eyes-closed",
        "prompt": "Edit this illustration: close her eyes gently, as in a natural relaxed blink. Change nothing else: same face, glasses, headscarf, clothes, colours, lighting, line style and framing.",
        "region": "eyes",
    },
    {
        "id": "eyes-half",
        "prompt": "Edit this illustration: her eyes half closed, mid-blink. Change nothing else: same face, glasses, headscarf, clothes, colours, lighting, line style and framing.",
        "region": "eyes",
    },
    {
        "id": "mouth-half",
        "prompt": "Edit this illustration: her mouth slightly open as if mid-word, lips parted a little, teeth barely visible. Change nothing else: same eyes, face, glasses, headscarf, clothes, colours, lighting, line style and framing.",
        "region": "mouth",
    },
    {
        "id": "mouth-open",
        "prompt": "Edit this illustration: her mouth open as if saying 'aah' while talking warmly. Change nothing else: same eyes, face, glasses, headscarf, clothes, colours, lighting, line style and framing.",
        "region": "mouth",
    },
    {
        "id": "smile",
        "prompt": "Edit this illustration: a big warm proud smile, eyes slightly crinkled with happiness. Change nothing else: same face shape, glasses, headscarf, clothes, colours, lighting, line style and framing.",
        "region": "eyes+mouth",
    },
]

# MediaPipe FaceMesh standard landmark index sets
LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
LIPS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 78, 95, 88, 178, 87, 14,
        317, 402, 318, 324, 308, 191, 80, 81, 82, 13, 312, 311, 310, 415]

os.makedirs(WORK_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(REVIEW_DIR, exist_ok=True)

call_count = 0
call_log = []


def log(msg):
    print(msg, flush=True)


# ---------------------------------------------------------------------------
# 0. Key + network checks (rule 3 in the build brief)
# ---------------------------------------------------------------------------

def check_prereqs():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        log("STOP: GEMINI_API_KEY is not set. Cannot call the Gemini image-edit API.")
        log("Fallback: see lab/PROMPTS.md and section 6 of the build brief.")
        sys.exit(1)
    return key


# ---------------------------------------------------------------------------
# 3.1 Prepare the input
# ---------------------------------------------------------------------------

def prepare_input(base_im):
    """Upscale x3, composite onto flat bg, centred on a 9:16 canvas.
    Returns (prepared_image, transform) where transform lets us invert exactly.
    """
    bw, bh = base_im.size
    up_w, up_h = bw * UPSCALE, bh * UPSCALE
    upscaled = base_im.resize((up_w, up_h), Image.LANCZOS)

    ar_w, ar_h = CANVAS_ASPECT
    canvas_h = up_h
    canvas_w = round(canvas_h * ar_w / ar_h)
    if canvas_w < up_w:
        canvas_w = up_w  # never crop the character

    off_x = (canvas_w - up_w) // 2
    off_y = (canvas_h - up_h) // 2

    canvas = Image.new("RGB", (canvas_w, canvas_h), BG_COLOR)
    canvas.paste(upscaled, (off_x, off_y), upscaled.split()[3])  # alpha as mask

    transform = {
        "base_w": bw, "base_h": bh,
        "up_w": up_w, "up_h": up_h,
        "canvas_w": canvas_w, "canvas_h": canvas_h,
        "off_x": off_x, "off_y": off_y,
        "upscale": UPSCALE,
    }
    return canvas, transform


def invert_transform(candidate_im, transform):
    """Crop the canvas back to the character region and downscale to base size."""
    t = transform
    cropped = candidate_im.crop((t["off_x"], t["off_y"], t["off_x"] + t["up_w"], t["off_y"] + t["up_h"]))
    return cropped.resize((t["base_w"], t["base_h"]), Image.LANCZOS)


# ---------------------------------------------------------------------------
# 3.2 Call the edit API
# ---------------------------------------------------------------------------

def get_client():
    from google import genai
    return genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def call_gemini_edit(client, prepared_im, prompt):
    global call_count
    if call_count >= CALL_CAP:
        raise RuntimeError(f"Call cap ({CALL_CAP}) reached, refusing to call the API again.")
    call_count += 1
    log(f"[api call {call_count}/{CALL_CAP}] model={MODEL_PRIMARY} prompt={prompt[:60]!r}...")

    resp = client.models.generate_content(model=MODEL_PRIMARY, contents=[prepared_im, prompt])

    usage = getattr(resp, "usage_metadata", None)
    entry = {
        "call": call_count,
        "model": MODEL_PRIMARY,
        "prompt": prompt,
        "usage": {
            "prompt_tokens": getattr(usage, "prompt_token_count", None),
            "candidates_tokens": getattr(usage, "candidates_token_count", None),
            "total_tokens": getattr(usage, "total_token_count", None),
        } if usage else None,
    }
    call_log.append(entry)
    log(f"  usage: {entry['usage']}")

    for cand in resp.candidates:
        for part in cand.content.parts:
            inline = getattr(part, "inline_data", None)
            if inline is not None and inline.data:
                return Image.open(io.BytesIO(inline.data)).convert("RGB")
    raise RuntimeError("Gemini response contained no image data.")


# ---------------------------------------------------------------------------
# 3.3 Align and locate face regions
# ---------------------------------------------------------------------------

def register_to_base(base_gray, cand_gray, cand_rgb):
    """ECC affine registration using only the top 40% (head area)."""
    h, w = base_gray.shape
    band = int(h * 0.40)
    warp_matrix = np.eye(2, 3, dtype=np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6)
    try:
        _, warp_matrix = cv2.findTransformECC(
            base_gray[:band], cand_gray[:band], warp_matrix, cv2.MOTION_AFFINE, criteria
        )
    except cv2.error as e:
        log(f"  ECC registration failed ({e}); using identity transform.")
        warp_matrix = np.eye(2, 3, dtype=np.float32)
    aligned = cv2.warpAffine(
        cand_rgb, warp_matrix, (w, h), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP,
        borderMode=cv2.BORDER_REPLICATE,
    )
    return aligned


_face_detector = None


def get_face_boxes(base_rgb):
    """Try MediaPipe Face Landmarker; fall back to diff-blob if no face found."""
    global _face_detector
    try:
        import mediapipe as mp
        from mediapipe.tasks import python as mp_python
        from mediapipe.tasks.python import vision

        if _face_detector is None:
            base_options = mp_python.BaseOptions(model_asset_path=FACE_MODEL_PATH)
            options = vision.FaceLandmarkerOptions(base_options=base_options, num_faces=1)
            _face_detector = vision.FaceLandmarker.create_from_options(options)

        h, w = base_rgb.shape[:2]
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(base_rgb))
        result = _face_detector.detect(mp_image)
        if result.face_landmarks:
            lm = result.face_landmarks[0]

            def bbox(idxs, pad_frac=0.35):
                xs = [lm[i].x * w for i in idxs]
                ys = [lm[i].y * h for i in idxs]
                x0, x1 = min(xs), max(xs)
                y0, y1 = min(ys), max(ys)
                pw, ph = (x1 - x0) * pad_frac, (y1 - y0) * pad_frac
                return (max(0, x0 - pw), max(0, y0 - ph), min(w, x1 + pw), min(h, y1 + ph))

            eb_l = bbox(LEFT_EYE)
            eb_r = bbox(RIGHT_EYE)
            eyes_box = (min(eb_l[0], eb_r[0]), min(eb_l[1], eb_r[1]), max(eb_l[2], eb_r[2]), max(eb_l[3], eb_r[3]))
            mouth_box = bbox(LIPS, pad_frac=0.5)
            log(f"  face regions via MediaPipe: eyes={tuple(round(v) for v in eyes_box)} mouth={tuple(round(v) for v in mouth_box)}")
            return {"eyes": eyes_box, "mouth": mouth_box, "source": "mediapipe"}
    except Exception as e:
        log(f"  MediaPipe face detection unavailable/failed ({e}); using diff-blob fallback.")

    # Fallback: no face-mesh region available at this call site (needs a diff
    # image); signal caller to use the diff-blob approach.
    return None


def diff_blob_regions(base_rgb, cand_rgb):
    """Fallback face-box finder: largest diff blob in the upper 35% of the image,
    split into an eye band (upper half) and mouth band (lower half)."""
    h, w = base_rgb.shape[:2]
    band_h = int(h * 0.35)
    diff = np.abs(base_rgb[:band_h].astype(np.int32) - cand_rgb[:band_h].astype(np.int32)).sum(axis=2)
    mask = (diff > DIFF_THRESHOLD).astype(np.uint8)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    if n <= 1:
        # nothing changed at all in the band; use a generic centred face box
        x0, y0, x1, y1 = w * 0.3, h * 0.05, w * 0.7, h * 0.30
    else:
        biggest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        x, y, bw, bh, _ = stats[biggest]
        x0, y0, x1, y1 = x, y, x + bw, y + bh
    mid_y = (y0 + y1) / 2
    eyes_box = (x0, y0, x1, mid_y)
    mouth_box = (x0, mid_y, x1, y1)
    return {"eyes": eyes_box, "mouth": mouth_box, "source": "diff-blob"}


REGION_MAP = {
    "eyes": ["eyes"],
    "mouth": ["mouth"],
    "eyes+mouth": ["eyes", "mouth"],
}


def region_mask(shape, boxes, region_names):
    h, w = shape[:2]
    m = np.zeros((h, w), dtype=np.uint8)
    for name in region_names:
        x0, y0, x1, y1 = [int(round(v)) for v in boxes[name]]
        m[max(0, y0):min(h, y1), max(0, x0):min(w, x1)] = 1
    return m


# ---------------------------------------------------------------------------
# 3.4 Mask + composite + QA
# ---------------------------------------------------------------------------

def build_mask(base_rgb, aligned_rgb, allowed_region_mask):
    diff = np.abs(base_rgb.astype(np.int32) - aligned_rgb.astype(np.int32)).sum(axis=2)
    changed = (diff > DIFF_THRESHOLD).astype(np.uint8)
    changed = changed & allowed_region_mask

    kernel = np.ones((MASK_DILATE_PX, MASK_DILATE_PX), np.uint8)
    dilated = cv2.dilate(changed * 255, kernel)
    closed = cv2.morphologyEx(dilated, cv2.MORPH_CLOSE, kernel)
    feathered = cv2.GaussianBlur(closed, (0, 0), MASK_FEATHER_PX / 2.0)
    mask_f = feathered.astype(np.float64) / 255.0
    return mask_f, changed


def composite(base_rgba, aligned_rgb, mask_f):
    base_rgb = base_rgba[:, :, :3].astype(np.float64)
    m3 = mask_f[:, :, None]
    final_rgb = base_rgb * (1 - m3) + aligned_rgb.astype(np.float64) * m3
    final_rgb = np.clip(np.round(final_rgb), 0, 255).astype(np.uint8)
    final = np.dstack([final_rgb, base_rgba[:, :, 3]])
    return final


def qa_checks(base_rgb, aligned_rgb, final_rgb, mask_f, allowed_region_mask, changed):
    results = {}

    # Leak: changed pixels OUTSIDE the allowed region, but only within the
    # top band that (a) ECC registration was actually fit against and (b)
    # is anywhere near the face-patch mask -- residual affine drift far down
    # the body (hem/silhouette) is neither trustworthy nor relevant, since
    # the composite never touches that area regardless. A morphological
    # open (7px) also strips isolated antialiasing/line-jitter noise
    # (unavoidable when the "edit" is a full independent re-render, e.g. a
    # manually-sourced ChatGPT image, rather than a true in-place pixel
    # edit) so this measures actual redrawn content, not rendering noise.
    h = base_rgb.shape[0]
    leak_band = int(h * LEAK_CHECK_BAND_FRAC)
    diff_all = np.abs(base_rgb.astype(np.int32) - aligned_rgb.astype(np.int32)).sum(axis=2)
    outside_changed_raw = (diff_all > DIFF_THRESHOLD) & (allowed_region_mask == 0)
    outside_changed_raw[leak_band:] = False
    outside_changed = cv2.morphologyEx(
        outside_changed_raw.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)
    ).astype(bool)
    leak_frac = outside_changed.sum() / outside_changed.size
    results["leak_frac"] = float(leak_frac)
    results["leak_pass"] = bool(leak_frac <= LEAK_MAX_FRAC)

    # Seam: mean colour diff along the mask's feathered edge
    edge = cv2.Canny((mask_f * 255).astype(np.uint8), 50, 150)
    edge_dilated = cv2.dilate(edge, np.ones((3, 3), np.uint8))
    edge_px = edge_dilated > 0
    if edge_px.sum() > 0:
        seam_diff = np.abs(final_rgb[:, :, :3].astype(np.int32) - base_rgb.astype(np.int32)).sum(axis=2)
        seam_score = float(seam_diff[edge_px].mean())
    else:
        seam_score = 0.0
    results["seam_score"] = seam_score
    results["seam_pass"] = bool(seam_score <= SEAM_MAX)

    # No-op: fraction of allowed region actually changed
    allowed_total = allowed_region_mask.sum()
    changed_in_region = (changed & allowed_region_mask).sum()
    noop_frac = changed_in_region / allowed_total if allowed_total else 0
    results["changed_frac"] = float(noop_frac)
    results["noop_pass"] = bool(noop_frac >= NOOP_MIN_FRAC)

    # Outside-region identity: final must equal base exactly where mask == 0
    zero_mask = mask_f == 0
    identical = np.array_equal(final_rgb[:, :, :3][zero_mask], base_rgb[zero_mask].astype(np.uint8))
    results["identity_pass"] = bool(identical)

    results["all_pass"] = bool(
        results["leak_pass"] and results["seam_pass"] and results["noop_pass"] and results["identity_pass"]
    )
    return results


# ---------------------------------------------------------------------------
# Main per-frame pipeline
# ---------------------------------------------------------------------------

def qa_and_composite_candidate(base_rgba, base_rgb_np, base_gray, candidate_rgb_pil, region_names, mediapipe_boxes, attempt_label):
    """Shared 3.3/3.4 pipeline: register a raw candidate onto the base, mask,
    composite and QA it. Used for both API candidates (after invert_transform)
    and manually-supplied candidates (after a plain resize)."""
    cand_rgb_np = np.array(candidate_rgb_pil.convert("RGB"))
    cand_gray = cv2.cvtColor(cand_rgb_np, cv2.COLOR_RGB2GRAY)

    aligned_rgb = register_to_base(base_gray, cand_gray, cand_rgb_np)

    if mediapipe_boxes is not None:
        boxes = mediapipe_boxes
    else:
        boxes = diff_blob_regions(base_rgb_np, aligned_rgb)
    allowed_mask = region_mask(base_rgb_np.shape, boxes, region_names)

    mask_f, changed = build_mask(base_rgb_np, aligned_rgb, allowed_mask)
    final = composite(base_rgba, aligned_rgb, mask_f)
    qa = qa_checks(base_rgb_np, aligned_rgb, final, mask_f, allowed_mask, changed)
    qa["attempt"] = attempt_label
    qa["region_source"] = boxes["source"]
    return {"final": final, "qa": qa, "aligned": aligned_rgb, "mask": mask_f}


def process_frame(client, base_im, base_rgba, base_rgb_np, base_gray, prepared_im, transform, frame, mediapipe_boxes):
    frame_id = frame["id"]
    region_names = REGION_MAP[frame["region"]]
    best = None
    attempts = 0
    max_attempts = CANDIDATES_PER_FRAME + 2  # a couple of retries within the shared cap

    while attempts < max_attempts and call_count < CALL_CAP:
        attempts += 1
        try:
            edited = call_gemini_edit(client, prepared_im, frame["prompt"])
        except RuntimeError as e:
            log(f"  call failed: {e}")
            break

        candidate = invert_transform(edited, transform)
        cand_path = os.path.join(WORK_DIR, f"{frame_id}-raw-{attempts}.png")
        candidate.save(cand_path)

        result = qa_and_composite_candidate(
            base_rgba, base_rgb_np, base_gray, candidate, region_names, mediapipe_boxes, attempts
        )
        qa = result["qa"]
        log(f"  [{frame_id}] attempt {attempts}: {qa}")

        if qa["all_pass"]:
            if best is None or qa["seam_score"] < best["qa"]["seam_score"]:
                best = result
            if attempts >= CANDIDATES_PER_FRAME:
                break

        if attempts >= CANDIDATES_PER_FRAME and best is not None:
            break

    if best is None:
        log(f"  [{frame_id}] FAILED after {attempts} attempt(s): no candidate passed QA.")
        return None
    return best


def process_frame_manual(base_rgba, base_rgb_np, base_gray, base_w, base_h, frame, mediapipe_boxes, manual_dir):
    """Run 3.3 onwards on a manually-supplied raw edit (e.g. from ChatGPT),
    skipping the Gemini API call entirely."""
    frame_id = frame["id"]
    region_names = REGION_MAP[frame["region"]]
    src_path = os.path.join(manual_dir, f"{frame_id}.png")
    if not os.path.exists(src_path):
        log(f"  [{frame_id}] SKIPPED: no manual file at {src_path}")
        return None

    raw = Image.open(src_path).convert("RGB")
    # Manual edits arrive at whatever resolution/aspect the source tool gave
    # us; resize to the base canvas as an initial guess, then let ECC affine
    # registration correct any residual scale/position drift.
    candidate = raw.resize((base_w, base_h), Image.LANCZOS)
    candidate.save(os.path.join(WORK_DIR, f"{frame_id}-manual-resized.png"))

    best = qa_and_composite_candidate(
        base_rgba, base_rgb_np, base_gray, candidate, region_names, mediapipe_boxes, "manual"
    )
    log(f"  [{frame_id}] manual: {best['qa']}")
    if not best["qa"]["all_pass"]:
        log(f"  [{frame_id}] FAILED QA (manual candidate, no retry available).")
        return None
    return best


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--manual-dir", default=None,
                         help="Directory of manually-supplied raw edits (<frame-id>.png), skips the Gemini API entirely.")
    args = parser.parse_args()

    base_im = Image.open(BASE_PATH).convert("RGBA")
    base_rgba = np.array(base_im)
    base_rgb_np = base_rgba[:, :, :3]
    base_gray = cv2.cvtColor(base_rgb_np, cv2.COLOR_RGB2GRAY)
    base_w, base_h = base_im.size

    mediapipe_boxes = get_face_boxes(base_rgb_np)

    results = {}

    if args.manual_dir:
        log(f"Manual mode: reading raw edits from {args.manual_dir} (no API calls).")
        for frame in FRAMES:
            log(f"--- frame: {frame['id']} ---")
            best = process_frame_manual(base_rgba, base_rgb_np, base_gray, base_w, base_h, frame, mediapipe_boxes, args.manual_dir)
            results[frame["id"]] = best
            if best is not None:
                out_path = os.path.join(OUT_DIR, f"nani-{frame['id']}.png")
                Image.fromarray(best["final"], "RGBA").save(out_path)
                log(f"  saved {out_path}")
    else:
        check_prereqs()
        client = get_client()

        prepared_im, transform = prepare_input(base_im)
        prepared_im.save(os.path.join(WORK_DIR, "prepared-input.png"))
        log(f"prepared input: {transform}")

        for frame in FRAMES:
            if call_count >= CALL_CAP:
                log(f"[{frame['id']}] SKIPPED: call cap reached.")
                results[frame["id"]] = None
                continue
            log(f"--- frame: {frame['id']} ---")
            best = process_frame(client, base_im, base_rgba, base_rgb_np, base_gray, prepared_im, transform, frame, mediapipe_boxes)
            results[frame["id"]] = best
            if best is not None:
                out_path = os.path.join(OUT_DIR, f"nani-{frame['id']}.png")
                Image.fromarray(best["final"], "RGBA").save(out_path)
                log(f"  saved {out_path}")

    log(f"\nTotal API calls used: {call_count}/{CALL_CAP}")
    with open(os.path.join(WORK_DIR, "call_log.json"), "w") as f:
        json.dump(call_log, f, indent=2)

    # Persist QA summary for the report + review artefacts
    summary = {}
    for fid, best in results.items():
        if best is None:
            summary[fid] = {"status": "failed"}
        else:
            summary[fid] = {"status": "passed", **{k: v for k, v in best["qa"].items()}}
    with open(os.path.join(WORK_DIR, "qa_summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    log(json.dumps(summary, indent=2))

    build_review_artefacts(base_im, results)


# ---------------------------------------------------------------------------
# 3.5 Review artefacts
# ---------------------------------------------------------------------------

def load_font(size):
    for path in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def build_review_artefacts(base_im, results):
    frame_ids = [f["id"] for f in FRAMES]
    images = {"neutral": base_im}
    for fid in frame_ids:
        p = os.path.join(OUT_DIR, f"nani-{fid}.png")
        if os.path.exists(p):
            images[fid] = Image.open(p).convert("RGBA")

    # contact sheet
    font = load_font(14)
    thumb_w, thumb_h = 200, 428
    label_h = 70
    cols = ["neutral"] + frame_ids
    sheet = Image.new("RGB", (thumb_w * len(cols), thumb_h + label_h), (255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    for i, key in enumerate(cols):
        x = i * thumb_w
        if key in images:
            thumb = images[key].convert("RGBA")
            thumb = thumb.resize((thumb_w, int(thumb_w * thumb.height / thumb.width)), Image.LANCZOS)
            bg = Image.new("RGB", (thumb_w, thumb_h), (245, 245, 245))
            bg.paste(thumb, (0, 0), thumb)
            sheet.paste(bg, (x, 0))
        draw.text((x + 4, thumb_h + 4), key, fill=(0, 0, 0), font=font)
        if key != "neutral":
            qa = results.get(key)
            if qa is None:
                draw.text((x + 4, thumb_h + 22), "FAILED", fill=(200, 0, 0), font=font)
            else:
                q = qa["qa"]
                lines = [
                    f"seam {q['seam_score']:.1f}",
                    f"leak {q['leak_frac']*100:.2f}%",
                    f"chg {q['changed_frac']*100:.2f}%",
                    f"src {q['region_source']}",
                ]
                for j, line in enumerate(lines):
                    draw.text((x + 4, thumb_h + 22 + j * 12), line, fill=(0, 100, 0), font=font)
    sheet.save(os.path.join(REVIEW_DIR, "contact-sheet.png"))
    log("saved lab/review/contact-sheet.png")

    # GIFs
    def frame_or_neutral(key):
        return images.get(key, images["neutral"]).convert("RGB")

    blink_seq = ["neutral", "eyes-half", "eyes-closed", "eyes-half", "neutral"]
    blink_frames = [frame_or_neutral(k) for k in blink_seq]
    blink_durations = [60, 60, 60, 60, 1500]
    blink_frames[0].save(
        os.path.join(REVIEW_DIR, "blink.gif"), save_all=True,
        append_images=blink_frames[1:], duration=blink_durations, loop=0,
    )
    log("saved lab/review/blink.gif")

    talk_seq = ["neutral", "mouth-half", "mouth-open", "mouth-half"] * 2
    talk_frames = [frame_or_neutral(k) for k in talk_seq]
    talk_frames[0].save(
        os.path.join(REVIEW_DIR, "talk.gif"), save_all=True,
        append_images=talk_frames[1:], duration=90, loop=0,
    )
    log("saved lab/review/talk.gif")

    # face crops at 3x zoom
    fw, fh = base_im.size
    crop_box = (int(fw * 0.25), int(fh * 0.05), int(fw * 0.75), int(fh * 0.28))
    crop_w = crop_box[2] - crop_box[0]
    crop_h = crop_box[3] - crop_box[1]
    zoom = 3
    crops_cols = ["neutral"] + frame_ids
    crops_sheet = Image.new("RGB", (crop_w * zoom * len(crops_cols), crop_h * zoom + 24), (255, 255, 255))
    cdraw = ImageDraw.Draw(crops_sheet)
    for i, key in enumerate(crops_cols):
        x = i * crop_w * zoom
        if key in images:
            crop = images[key].convert("RGBA").crop(crop_box)
            crop = crop.resize((crop_w * zoom, crop_h * zoom), Image.LANCZOS)
            bg = Image.new("RGB", (crop_w * zoom, crop_h * zoom), (245, 245, 245))
            bg.paste(crop, (0, 0), crop)
            crops_sheet.paste(bg, (x, 0))
        cdraw.text((x + 4, crop_h * zoom + 4), key, fill=(0, 0, 0), font=font)
    crops_sheet.save(os.path.join(REVIEW_DIR, "face-crops.png"))
    log("saved lab/review/face-crops.png")


if __name__ == "__main__":
    main()
