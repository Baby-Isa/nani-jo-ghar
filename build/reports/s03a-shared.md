# S03-A: shared request pop-up, voice stop, shared rows

Branch `ccr-a7370759-t0lee7`, sandbox run `s03a`. No mechanic removed, no art changed.

## What changed
- **Request pop-up** (`js/shared/request-popup.js`; CSS in `order-card.css`): the card full size, read out; a tap anywhere stops the voice and folds it into the sidebar. Used by Cook, the pharmacy and every v2 heal game before `start()`. Call: `await RequestPopup.open({host, build(body), read, target, fast, wait, onStop})`, or `{el, card, …}` for Cook's `#intro`. Tag added to every page loading the order card or Cook's UI.
- **Voice stop:** `VoiceStop.stop()`; `Kit.Voice` lines carry a generation (chained lines fall silent), the clip pauses; `Card.speak` stops mid-card; Cook's `UI.hush`. Runs on a tap-through, pharmacy and heal start, heal end. A heal game's own whole-card read is silent after the pop-up.
- CLN-87 zoom 1.5 s from full zoom; SH-62 sequence line; review flaw 1 (800x360 word list fits).
- Rows (decision 73): Shared 25 open → 5; CLN-73, 84, 87, 109 built.

## Proof
- `checks.mjs` 229/229, words 0, load 21/21; `check_onboard` ok.
- Sandbox 1366x768, 10 flows: all end, 0 errors, CHECK PASSED; shots looked at.
- Probes: scrape, fever, tooth L1 pop-up then fold; tap-through in chai and pharmacy: silence; scrape ended at once: only the thank-you.

## QA
TXT ✅ · LAY ✅ (800x360 words) · CMP ✅ (one pop-up) · INT ✅ · AUD ⚠ flaw 2 · others not touched. Reviewer: orchestrator.

## Flaws first
1. Pull-out from full zoom shows a big soft room for ~0.5 s (Z2 vs CLN-77): judge in play.
2. Once, a Cook synth "trae" 0.66 s after the chai tap-through; not reproduced in 13 runs.
3. Waiting, diagnosis, send-off starts don't clear the voice: one line in `screen.clearStage()` (not my file).

## Open rows
SH-28, SH-32, SH-33, SH-38, SH-56 (B, C).
