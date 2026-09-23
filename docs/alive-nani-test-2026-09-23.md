# Alive Nani test — findings, decisions, settings (23 Sep 2026)

Ran the `lab/nani-alive.html` build brief: prove one base illustration +
AI-edited expression patches + Phaser can make a character feel alive with
zero manual art. Result: **yes, via the ChatGPT manual path.** Live at
`https://baby-isa.github.io/nani-jo-ghar/lab/nani-alive.html`.

## MVP — what shipped

- `build/expressions.py`: prep base → call edit API (or read manually-supplied
  files with `--manual-dir`) → OpenCV ECC affine registration onto the base →
  MediaPipe face-landmark eye/mouth boxes (diff-blob fallback for cartoon art
  with no face detected) → mask + composite only the changed region → QA
  (leak / seam / no-op / outside-region-identity) → review artefacts.
- `assets/characters/nani/expr/nani-{eyes-closed,eyes-half,mouth-half,
  mouth-open,smile}.png`: all 5 pass QA, pixel-identical to the base outside
  the face patch, visually verified (`lab/review/*`).
- `lab/nani-alive.html`: standalone Phaser 3 scene — breathing, idle sway,
  auto-blink, audio-driven mouth-sync (Web Audio `AnalyserNode`), happy hop,
  each independently toggleable, plus a raw-frame debug strip.
- `build/test_nani_alive.py`: Playwright check at 915×375 and 1366×768.

## LEARNING — Gemini API had zero quota

`GEMINI_API_KEY` returned `429 RESOURCE_EXHAUSTED, limit: 0` on every image
model (`gemini-3.1-flash-image`, `gemini-2.5-flash-image`) — a billing/plan
issue, not a missing key or blocked network. `OPENAI_API_KEY` wasn't set
either. Per the build brief's rule 3 (stop, don't work around it), fell back
to the manual path: wrote `lab/PROMPTS.md`, Zafar generated the 5 edits with
ChatGPT and dropped them in.

**If billing gets enabled later:** the API path is untouched and ready —
`build/.venv/bin/python build/expressions.py` (no `--manual-dir`). Model
list was checked live (`client.models.list()`), not hardcoded from memory,
per the brief's own instruction; `gemini-3.1-flash-image` ("Nano Banana 2")
was the latest non-preview image-edit model at the time.

## LEARNING — ChatGPT output needs different QA tuning than a true in-place edit

Gemini's image-edit API edits pixels in place; ChatGPT's image tool
**regenerates the whole image** conditioned on the reference, even when told
to change only one thing. Visually near-identical, but every line-art edge
shifts by a pixel or two — the raw diff-vs-base is noisy everywhere, not
just at the face.

Two QA changes in `build/expressions.py` (`qa_checks`) to tell real redrawn
content apart from this jitter, both documented inline:
1. **7×7 morphological open** on the "outside allowed region" diff mask
   before counting leak fraction — strips isolated antialiasing noise,
   keeps contiguous redrawn blobs.
2. **Leak check scoped to `LEAK_CHECK_BAND_FRAC` (45%) of the image height**
   — matches the band ECC registration (`REGISTRATION_BAND_FRAC`, top 40%)
   actually fits against. Drift near the hem/silhouette from an
   independently-cropped source image is neither trustworthy to measure nor
   relevant: the composite mask never reaches that low, so it can't leak
   into the final frame regardless.

Without these two, all 5 ChatGPT frames failed QA even though they were
visually clean — the check was catching rendering noise, not defects.
**No threshold was loosened to force a pass** — the change is about what
counts as "leaked", not how much leak is tolerated (`LEAK_MAX_FRAC` is
still 1.5%, unchanged).

## LEARNING — ChatGPT prompt template that keeps drift low

(Full prompts in `lab/PROMPTS.md`.) What mattered:
- **Attach the original base file fresh to every prompt.** Never chain off
  a previous ChatGPT output — drift compounds fast across turns.
- **One new chat message per frame.** Continuing in the same thread lets
  earlier edits bleed into the next one.
- Heavy repetition of "identical" / "change nothing else" / list every
  preserved feature by name (glasses, headscarf, clothes, colours,
  lighting, line style, framing) — ChatGPT's edit mode has no true mask,
  so it needs the constraint spelled out, not implied.
- Aspect ratio and crop tightness still varied noticeably between outputs
  (327:700 base vs. outputs ranging ~0.44–0.58 aspect) even with identical
  prompts — expect this, don't try to prevent it. ECC affine registration
  (6 DOF, handles independent x/y scale) absorbs it.

## LEARNING — Phaser's internal clock drifts badly in headless Chromium

`this.time.delayedCall` is driven by Phaser's own clock, which advances via
`requestAnimationFrame`. Headless Chromium throttles rAF well below 60fps
when the tab isn't "focused" (which a fresh Playwright page often isn't) —
observed a 2500–6000ms scheduled blink firing at ~10s wall-clock. Fixed by
scheduling blinks with plain `setTimeout` (wall-clock time) instead —
see `lab/nani-alive.html`'s `scheduleNextBlink`/`runBlinkCycle`. Tweens
(breathing/sway) were left on Phaser's clock since they're cosmetic only,
not correctness-tested.

## LEARNING — audio RMS thresholds must be calibrated per-project, not assumed

Initial mouth-sync thresholds (low 0.04 / high 0.14, coarse per-frame
smoothing) were tuned by feel and didn't match this project's actual word
clips: `assets/audio/word/snt-01.mp3`'s smoothed RMS peaks around
0.05–0.09, so "mouth-open" (0.14) almost never triggered. Fixed by:
- Measuring the real envelope (logged raw + smoothed RMS against
  `snt-01.mp3`) and setting `THRESH_LOW = 0.02`, `THRESH_HIGH = 0.06`.
- Switching to **frame-rate-independent** one-pole smoothing
  (`coeff = 1 - exp(-dt / tauMs)`, attack 30ms / release 90ms as time
  constants) rather than a fixed per-frame coefficient — the latter
  behaves differently at 60fps vs. headless Chromium's throttled rate.

If a future character's audio is louder/quieter, re-measure — don't assume
these exact numbers carry over.

## Recommendation

Good enough to roll out to other characters **via the ChatGPT manual path**.
The Gemini API path is code-complete and untested end-to-end (never
produced a real frame — blocked on quota throughout), so budget one
real run against it before trusting it blind, even though the pipeline
logic is identical either way.
