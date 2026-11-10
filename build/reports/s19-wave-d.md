# s19-wave-d: the rule breaks in sekelo, chaat, samosa and baking (10 Nov)

Opus, high. Branch `s19-wave-d`, never pushed. Flaws first.

## Flaws and open
- **Left, none in these games' code** (the after run's 12; owners and exact changes in the hand-back):
  - contract-89 x3, samosa's "Tar!": Nani's card is cleared as the call is said (ui.js, SH-172), for a clip under 100 ms at the test speed; the probe samples every 100 ms and misses it. Probe.
  - contract-111 x4, chaat#hint 740x320 (and sekelo#takeback in check-change): sampled in the moment before the shelf takes taps; 1 s later all pass. Probe.
  - contract-109 x1, baking#mistake: the kit's wrong-pick wiggle (station-lib.js S.step) turns the tin; its turned box crosses the line. Kit or probe.
  - contract-11 x2, baking L3 at 1920x1080: the shared word-moment counter is low-res. Art.
  - contract-107 (kit timing, chaat in the before): the first-time coach lights a shelf thing about 200 ms before its glow and hop. Kit or probe.
- **Bands (SH-248):** all four games' things match their band. Baking draws its own counter picture, with no stoneBand call; its settings say "shelf".

## What changed
- **Samosa:**
  - Every help glow brings the kit's light, chai's hintLit14 pattern (102). A glow that waits for the pause gets its light when it shows. The guided play keeps the coach's single light (107).
  - The strips' light hugs the pastry, not the canvas (litBounds, 105).
  - The heaps stand on one base line (109).
- **Chaat:** the shelf row spans the whole band under the bowl; the tick's corner has gone. The chutney's pill no longer touches its neighbour's (92).
- **Sekelo:** a bowl tapped while busy shakes sideways, never turns (109, as corn).
- **All four (SH-248):** "band" in each settings file; the stoneBand calls pass it.

## Proof
- Before: `build/screenshots/sandbox/s19-wave-d-before/contract.md`. 152 pages, all reached their end, 0 page errors, 42 breaks:
  - sekelo 0
  - chaat 2 (92, 107)
  - samosa 36 (102 x12, 109 x19, 89 x3, 111 x2)
  - baking 4 (102, 109, 11 x2)
  - Pictures deleted for disk.
- After: `build/screenshots/sandbox/s19-wave-d-after/contract.md`. 152 pages, all reached their end, 0 page errors, 12 breaks:
  - sekelo 2 (109, fixed after; proof run 0)
  - chaat 4 (111)
  - samosa 3 (89)
  - baking 3 (109, 11 x2)
- Contract, four games L1 at four sizes: `CONTRACT PASSED: 0 breaks over 16 pages`.
- `checks.mjs`: all ok. loadcheck: 4/4.
- `evidence.mjs --after`: refused, the brief names no row; no before folder.
- check-change (`build/reports/tiers/change-d15e1a35d1.md`): FAILED.
  - Its play reached every end with 0 page errors. Its base run (1e85a893d6) had 78 breaks; this one has 6.
  - Blocks, none from these games' code:
    - scope: the merged files
    - frozen: chai L4's contract-99
    - mount: the old fails
    - loadtime: baking has no baseline
    - contract-111 and -89: the probe races above
  - Push, leak, teachgate, vessel-meta and films pass.

## QA
```
QA: sekelo, chaat, samosa, baking (Cook) · reviewer: builder (machine checks only; the judge has not looked) · commit: d15e1a35d
Auto: checks.mjs ✅ · loadcheck 4/4 ✅ · contract L1 four sizes 16/16 ✅ · contract L1-L4 and paths 152/152 to the end, 12 probe/kit/art breaks ⚠ · check-change ❌ (blocks above)
Screens (flaws first): chaat's row at 930x430 (script-made frame) ✅; no frames of my own
Checklist: CMP ✅ (kit light only) · LAY ✅ (one base line, pills apart) · INT ✅ (no help removed) · TXT, LNG, AUD, ART, CUL not touched
Regressions rechecked: none named
Against Zafar's last feedback: KEEP-03/04/13 untouched (fold swipe, fry, frying handle) ✅
```
