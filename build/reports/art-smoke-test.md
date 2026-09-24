# Art pipeline smoke test 2: 24 Sept 2026

A capped, paid test of `build/gen_assets.py` using the art bible's real prompts and the new concurrent pacing. The budget was `--budget 3`. **Spent: $0.32 (8 images × $0.04 at the configured price).** Raw logs are in `build/reports/logs/run1.log` and `run2.log`.

## 1. Changes

**Content (`data/asset-list.json`)**
- The placeholder `style_block` is replaced by the art bible's section 9 style block. The new `negative_block` is appended to every prompt through a `{negative}` template field, or added automatically when a template doesn't include that field.
- The templates now follow art bible 9(c) item, 9(e) hand pose and 9(f) reskin. Hands use a cream cotton kurta cuff with a band of red Kutch embroidery, and the skin is "light brown, a little more brown than beige (around #B4754A to #C6885C)". The old indigo cuff and "warm medium brown" skin are gone.
- The camera wording is stronger. Items: "orthographic top-down view, camera directly overhead looking straight down at 90 degrees; only the top face … is visible; no horizon, no sides, no three-quarter angle; round things read as perfect circles". Hands: "…we see only the BACK of the hand (palm facing down, against the worktop), never the palm; the forearm lies flat … enters from the bottom edge …; the hand is not raised or upright".
- `ingredient-onion-chopped` now uses `mode: generate` with its own full prompt (small curved, translucent, layered pieces of red onion in a loose pile, seen from directly above). It no longer has a reference image and is no longer an edit of `onion-whole`.
- `hand-ref-master` has `variants: 2`. Pacing config (`max_concurrency: 3`, `min_request_gap_seconds: 20`) is in the asset list's `config`.

**The rule, written down.** It is in the asset list's `_readme` and on the chopped entry. In the art bible it is in section 8 ("How states are made") and in the section 9(c) note: *item states are generated fresh with their own full prompt, never edited from another state. Edit mode is only for small changes to the same object: hand poses from the reference hand, reskins, and adding an item into an empty station background.* Section 9(c) also has a new warning, learned in this run: never put a scale comparison such as "next to a child's hand" in an item prompt, because the model draws the hand.

**Script (`build/gen_assets.py`)**
- **(a) Fail fast on local errors.** `api_edit` reads every reference and mask file before any network call. A missing or unreadable file raises `ConfigError` straight away with no retries. The retry loop now catches only `requests.RequestException`, not every `Exception`. Bad template fields and unknown modes are rejected at planning time. Checked: a missing reference fails at once with `reference image not readable: /nope.png`.
- **(b) 4xx responses aren't counted as spend.** A 4xx other than 429 raises `APIRejected`, and neither it nor `ConfigError` is billed. The manifest records `"billed": false`, and the summary line reports how many errors were not billed. Network errors and exhausted 5xx retries are still counted, to be conservative.
- **(c) Pacing.** A shared, thread-safe `Pacer` allows at most `max_concurrency` requests in flight (default 3, or `--max-concurrency N`) and at least `min_request_gap_seconds` (20 s) between request starts. On a 429 it honours `Retry-After` by holding all new starts until then, halves the concurrency and doubles the gap for the rest of the run. Requests run in a `ThreadPoolExecutor` in **dependency waves**: an entry whose reference is another selected entry's output waits for a later wave. For example, the hand edits wait for `hand-ref-master`.
- **Still working:** resume (the second dry run skipped the 2 finished hands), the budget cap (now decided at planning time, before any thread starts, so concurrency can't overspend), manifest writes (under a lock, still atomic via tmp + `os.replace`) and dry run (it now prints the waves).
- Not exercised live: no 429 or 4xx happened in this run, so the slow-down path was only unit-checked (halving and gap doubling).

## 2. Per-image verdicts (art bible §10, each image viewed at full size and on the checkerboard contact sheet)

Contact sheets: `build/contact-sheets/hands-reference.png`, `hands-master.png` and `ingredients-onion.png`. Alpha is clean on every image: a transparent background, no fringe on the checkerboard, and a soft semi-transparent glow for the contact shadow.

| Asset | Verdict | Notes |
|---|---|---|
| `hand-ref-master-v0` | **Pass** | True top-down view, back of the hand up, forearm entering from the bottom, cream cuff with a red diamond-and-dot band. The fingers are slightly fanned. Skin samples at about `#B66E2F`–`#C17939`, a little more orange and saturated than the target `#B4754A`–`#C6885C`. |
| `hand-ref-master-v1` | **Pass (recommended)** | Same camera and cuff. The hand is more relaxed and natural: fingers gently together, a visible wrist crease, finer embroidery with mirror-dot centres. Its skin is also a touch orange (`#B66429`–`#B9682D`). |
| `ingredient-onion-whole` (round 1) | Fail | Near top-down and round, but a **child's hand appeared in frame**. My template line "draw it as that size would look next to a 13 cm child's hand" caused it (§10 "no extra objects"). I fixed the template and regenerated once. |
| `ingredient-onion-chopped` (round 1) | Fail | Also had a hand in frame, plus a ¾ view of chunky two-tone cubes (§10 check 1). Regenerated once. |
| `ingredient-onion-whole` (round 2, kept) | **Pass** | Straight down and reads as a clean circle. Glossy purple-red skin with radial lines, the dry tip at the centre, soft shadow to the lower right. There is a faint darker rim at the silhouette edge: watch it for §10 check 9 (outlines), though it reads as shading, not a line. |
| `ingredient-onion-chopped` (round 2, kept) | **Camera pass, style marginal** | Top-down, a loose round pile, curved crescent pieces, no hand. The pieces still look like thick, opaque, two-tone "gummy" slabs rather than translucent, layered, thin onion. That's much better than the cubes, but not yet something to sign off. |
| `hand-a1-flat-palm` (edit from v1) | **Pass** | Same hand, cuff and camera as the reference, with a flat palm. It is nearly identical to the reference, which is correct for A1. It carries the reference's orange skin cast. |
| `hand-b1-handle-grip` (edit from v1) | **Pass with a note** | Same cuff, skin and camera; a closed fist seen from above, back of the hand up. The thumb is tucked out of sight rather than lying "along the top" of the handle, so check that a knife sprite sits in the grip convincingly before signing it off. |

Round-1 onion images were overwritten by round 2, since the manifest and resume logic key on the prompt hash and the output path is the same. The descriptions above come from my full-size review before regenerating.

**Recommended reference hand: `hand-ref-master-v1`.** It is copied to `assets/characters/hands/hand-ref-master.png`, which the edits reference. It still needs Zafar's sign-off, and the skin should probably be nudged slightly less orange first (see §5).

## 3. Cost

| Run | Requests | Spent |
|---|---|---|
| 1: hand-ref ×2, onion whole, onion chopped | 4 generate | $0.16 |
| 2: hand A1 + B1 (edits from v1), onion whole + chopped regenerated | 2 edit + 2 generate | $0.16 |
| **Total** | 8 | **$0.32 of $3.00** |

These figures use the asset list's configured price ($0.04 per 1024² image). The requests don't set `quality`, so the API default applies, and real billing may be higher if that default is high quality. Check the OpenAI usage page. The script doesn't yet read the `usage` field in the response.

## 4. Timings (concurrency 3, 20 s gap)

- **Run 1:** 81 s wall for 4 images. Starts were paced at about 0, 20 and 40 s; the fourth request started when the first slot freed up, at about 44 s. Per-request times: hand v0 44 s, hand v1 61 s, onion whole 81 s (including its pacing wait), onion chopped 36 s.
- **Run 2:** 104 s wall for 4 images. Hand A1 edit 77 s, B1 edit 59 s, onion whole 37 s, onion chopped 67 s.
- Last session, the same work ran one request at a time: about 38 s per request plus a 15 s pause after each. Here 4 images take 80–105 s instead of about 210 s.
- The per-request time printed by the script includes time spent waiting on the pacer. The "queued" log line marks when the worker picked up the job, not when the HTTP request started.

## 5. Remaining problems

1. **Chopped onion still looks like candy.** The pieces are opaque and chunky rather than translucent and layered. Next steps: try `quality: high`, or attach `sources/cook/props-sheet.webp` for material only (not camera), which means supporting a style reference on generate-mode items.
2. **Skin runs slightly orange.** About `#B6682D` against a target of `#B4754A`–`#C6885C`. Options: add "not orange, a muted warm light brown" to the prompt, or correct the colour in post on the reference before sign-off. Every edit inherits the reference's tone.
3. **The style block says "Match the rendering of the attached style reference exactly"**, but generate-mode requests attach nothing. Either add style-reference support for generate (switching to the edits endpoint with the reference attached) or drop that sentence for generate calls.
4. **B1 grip thumb:** see the verdict above.
5. Not exercised live: the 429 slow-down path, and `quality` or real billed cost via the response's `usage` field.
