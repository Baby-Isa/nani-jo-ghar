# Art pipeline smoke test — 24 Sept 2026

Capped, paid smoke test of `build/gen_assets.py` against the live OpenAI Images
API. Scope: `hand-ref-master`, `ingredient-onion-whole`,
`ingredient-onion-chopped`, budget `--budget 2`.

## 1. Setup check

- `OPENAI_API_KEY`: set (`env | grep -ic openai` → 1 match).
- `GET https://api.openai.com/v1/models` with that key → **HTTP 200**.
- Proceeded to the real run.

## 2. Script fixes required

- **`data/asset-list.json`: invalid image size.** Both `ingredient-onion-whole`
  and `ingredient-onion-chopped` set `"size": "512x512"`, which `gpt-image-1`
  rejects: `400 invalid_value` — *"Invalid size '512x512'. Supported sizes are
  1024x1024, 1024x1536, 1536x1024, and auto."* Confirmed directly against the
  API. Fixed both entries to `"size": "1024x1024"` (matches the asset list's
  own `defaults.size`, so the override was redundant as well as wrong).
- **Not fixed, flagged for a follow-up:** `request_with_retry()` in
  `gen_assets.py` wraps *any* exception raised while building a request —
  including a local `FileNotFoundError` from opening a missing
  `reference_images` path — and retries it five times with exponential
  backoff as if it were a transient network/5xx error. When
  `ingredient-onion-whole` failed validation on the first attempt, the
  dependent `ingredient-onion-chopped` edit call burned ~67s retrying a
  missing local file before failing for good. Harmless here (a re-run picked
  both up), but worth a `try/except (FileNotFoundError, ValueError)` around
  the reference/mask opens so config errors fail fast instead of paying the
  full backoff schedule.
- **Not fixed, flagged only:** the run loop credits `unit_price` to `spent`
  on *any* exception (`spent += unit_price` in the `except` branch), including
  the `512x512` 400 error above, which OpenAI does not actually bill (request
  validation fails before generation). The script's own run summaries
  therefore over-report spend by $0.04 for that failed attempt — real
  OpenAI billing for this session is 3 successful images × $0.04 = **$0.12**,
  not the $0.20 the two run summaries add up to.
- **Not fixed, flagged only (content, not a script bug):** `data/asset-list.json`'s
  `style_block` is still the placeholder ("storybook 3D-film look …
  cel-shaded … Pixar/Laika-adjacent, indigo/silver/marigold/madder palette"),
  and the `hand_pose` template hardcodes "indigo cotton" cuff + "warm medium
  brown" skin. The art bible (now v1, signed off, no outstanding questions)
  specifies a materially different style (3D animated-feature look, **no
  outlines, no cel shading**), a **cream** kurta cuff with **red** Kutch
  embroidery (not indigo), and one specific skin-tone range
  (`#B4754A`–`#C6885C`, not "warm medium brown"). This run intentionally used
  the script/config exactly as committed, so the QA verdicts below judge
  output against the *current* asset list, and separately note where the art
  bible disagrees. Swapping in the art bible's real style + negative blocks
  (section 9) before the next real run is a content decision for the team,
  not something made unilaterally in this smoke test.

## 3. Generated assets

| Asset | Output path | Mode | Size | Cost |
|---|---|---|---|---|
| `hand-ref-master` | `assets/characters/hands/hand-ref-master.png` | generate | 1024×1024 | $0.04 |
| `ingredient-onion-whole` | `assets/items/cook/onion-whole.png` | generate | 1024×1024 | $0.04 |
| `ingredient-onion-chopped` | `assets/items/cook/onion-chopped.png` | edit (ref: onion-whole) | 1024×1024 | $0.04 |

Contact sheets: `build/contact-sheets/hands-reference.png`,
`build/contact-sheets/ingredients-onion.png`.

**Cost used: $0.12 of the $2.00 budget** (real OpenAI billing; see the
over-reporting note above for why the script printed a higher figure).

## 4. Timing

- `hand-ref-master` (generate, 1024×1024): ≈39s.
- `ingredient-onion-whole` (generate, 1024×1024) + `ingredient-onion-chopped`
  (edit, 1024×1024): ≈76s combined for the pair, ≈38s/request average.
- (Excludes the script's fixed 15s inter-request pacing delay and the ~67s
  burned on the retry bug above, both accounted for separately.)

## 5. QA verdicts (art bible §10 checklist, judged against the contact sheets)

- **`hand-ref-master`** — **Reject.** The prompt asked for a top-down camera
  and "a flat relaxed hand resting palm-down on a worktop, fingers together";
  the model instead rendered an upright, front-facing hand with fingers
  spread (more "high-five" than "resting flat"), and there's no worktop in
  frame. Camera/pose don't match the brief (§10 check 1), and the cuff colour
  (indigo with gold medallions) matches the placeholder template but not the
  art bible's cream cuff with red Kutch embroidery (§10 check 11, §7).
- **`ingredient-onion-whole`** — **Reject.** Rendered as a ¾ elevated view
  (skin, root tuft and side curvature all visible) rather than the requested
  straight-down top-down shot where a round onion should read as a circle
  (§10 check 1, §3). Shading and papery-skin brushstrokes lean painterly
  rather than the art bible's clean-surface, no-painterly-brushwork rule
  (§10 check 9), though contact shadow and general execution are otherwise
  clean.
- **`ingredient-onion-chopped`** — **Pass, with a note.** Genuine top-down
  view, plausible diced-onion silhouette, correct scale relative to the whole
  onion, visible contact shadow under the pile (§10 checks 1–3 hold). Piece
  edges carry a slightly hard dark outline that borders on §10 check 9's
  "no outlines" rule — worth a closer look on a full-size render rather than
  the thumbnail, but not an obvious reject.

**Overall:** the technical pipeline (auth, request shape, edit-with-reference,
manifest/resume, contact-sheet build) works end-to-end once the size
parameter is fixed. Content quality is gated on switching the asset list over
to the art bible's finalised style block, cuff colour and skin tone, and on
tightening the camera language in the hand-pose template so top-down poses
are actually rendered top-down.
