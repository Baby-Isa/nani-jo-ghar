# Testing: how we check the code

> **Stale points (what `docs/process/rules.md` now overrides; the text below is left as written).**
> - Mode test ports (Find it 8801 … Foundation 8800) were set for the 25 Sept wave of sessions → still one browser test at a time with your own `COOK_TEST_PORT`; at most ~4 sessions at once, no helper sessions (B1, B16, non-negotiable 14)
> - "Browser tests only if cheap" → done means looked at, not tests passed: every state screenshotted and judged by someone other than the builder (non-negotiable 7; QA checklist)
> - "Leak-bot numbers" in the build report → the Kutchi leak test still applies (non-negotiable 6)
> - Alive-Nani test lessons mention Phaser's clock in headless Chromium → Phaser is lab-only; the lesson about wall-clock timing versus throttled `requestAnimationFrame` still holds for any headless test

The definition of done is `docs/process/qa-checklist.md`. This file is the practical side: ports, commands and lessons.

## The rule on browser tests (by ID)

**B16** (`docs/process/rules.md`): browser tests run one at a time (`flock -w 1800 … timeout`, own `COOK_TEST_PORT`, `--canvas` for `--days`, split by `--stations`); discard rewritten screenshots unless intended.

The quick (non-browser) tests for the shared modules are `build/test_shared_*.mjs` (for example `node --test build/test_shared_save.mjs`); the onboarding check is `check_onboard`.

---

## Test ports and the test rules from the mode build brief

> from: docs/archive/mode-briefs/BUILD-COMMON.md § Tests (and Git, Finish)

## Tests
- A Node leak bot (no browser) proving level 1 of each first-set mini-game can't be won blind, with the numbers in your build log.
- Browser tests only if cheap: one at a time, `--canvas`, your own `COOK_TEST_PORT` (Find it 8801, Tidy up 8802, Who did it 8803, Dress up 8804, Monsoon 8805, Clinic 8806, Snap 8807, Foundation 8800).

## Git
- Work on the branch your session was given; commit small and often; push after every meaningful step (`git push -u origin <branch>`, retry on network errors). Never push to `main` or any other branch; never force-push.
- Commit messages end with the Co-Authored-By and Claude-Session lines your system prompt gives.

## Finish
Write `build/reports/<mode>-build.md` (under 400 words): what's built and where, how to open it (the lab URL), the leak-bot numbers, the stubs to swap for shared pieces, what's left for the next phase, and any decision you had to take. Commit, push, and end your turn with the same summary.

---

## Testing lessons from the alive-Nani test

> from: docs/archive/art/alive-nani-test-2026-09-23.md § LEARNING sections on the headless browser clock and audio thresholds

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
