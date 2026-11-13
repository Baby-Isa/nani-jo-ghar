# s19-night-c: the chop screen (chop, chaat, daar), samosa, maani, sekelo: rows, overnight 13 Nov

Branch `s19-night-c`, never pushed. The machine ran at load 25-50 all night (four builders' browsers). No before folder (the spec has no rows).

## Flaws first
- **The contract breaks went up, not down, so task 1's accept is not met.** I could not separate the machine's load from my code tonight.
  - L1 at 740x320 and 1280x665: 19 before (`s19-night-c-base`, at launch) and 67 after (`s19-night-c-contract`).
  - L2-L4 at the same two sizes: 76 in the gate (12 Nov) and 146 after (`s19-night-c-l24`).
    - By game: chop 4->24, chaat 13->20, daar 8->33, samosa 7->9, maani 5->8, sekelo 8->12, stir 25->26, assemble 6->14.
    - By check: 65 18, 36 15, 78 9, 89 7, 37 7, 111 7, 18 7 (timing and the kit's checks).
- **Breaks that are mine and still open:**
  - **samosa, contracts 36, 107, 92 and 117 on ph-keema:** SAM-38 moves the first light onto the heap of the filling Nani names.
    - Under load the kit's light came about 2.5 s after her call (36) and before the heap's hop (107).
  - **chop, contract-36 (5 times at L2-L4):** CK-109 starts the call with the light. In `chop@L2` at 1280 the call came at 35.3 s and the light at 35.4 s.
    - Under load the light's layer showed 2.7 s later, and the check read that as a step with no call.
    - The eye run (ev1 CK-109) shows the light and the line together. A quiet-machine rerun is needed.
- **Reverted:**
  - SAM-40's card change: it caused contract-108 ("trae chunda" still open at Shabash).
  - The stir's first-light change: contract-78 did not change, and it added 36 and 117.
- **Four sizes, L1, all eight flows:** 32 of 32 pages reached their end, 0 page errors, 139 breaks.
- **L2-L4 ends:** 47 of 48. `mishkaki-grill@L4` at 740x320 timed out at 300 s.
- **Tier 2 (`check-change.mjs`) not run.** It plans 30 steps, about 269 min.
  - Cut down (`--base a9ccaa4fd --levels 1 --sizes 740x320 --no-before --no-film`) it is 48 min; no lock time was left.
- **`checks.mjs`:** 12 steps ok. The load step was not run because my lock was busy.
  - unit had 2 fails. `build/host/onboard.test.mjs` was mine (samosa's `Coach.stop(true)`) and is fixed: 3 of 3 pass.
  - `briefpack.test.mjs` "the live specs give no overlap" is the overnight specs sharing evidence.json. The orchestrator owns those specs.

## Rows
**DONE** (code and script-made frames, for the judge):
- **SAM-38:** the first light is the heap Nani names (ev1 and ev3 SAM-38).
  - Before: `s19-night-c-base/cook-samosa/740x320/05-kind-tap.png`, where an empty strip is lit.
- **SAM-37:** the fold's light is on the dough alone (ev3 SAM-37 frames 4-5).
  - Before: `06-kind-swipe.png`, where the order card is boxed.
- **DAAR-52:** one Nana face at the bowl's upper left, 150 design px, chai's size for one dish. The katori's small face is hidden while it shows (ev1).
- **CK-108:** at 740x320 the strip's box ends about 60 px inside the right edge, with the hand inside it (ev1).
- **CK-109:** "Nindha nindha kap!" starts with the light. The finger comes 0.3 s after the dim (ev1).
- **CK-110:** the halves stay inside the board (ev1). The hop still crosses the board's edge on its way up: that is the mechanic.
- **CK-111:** the bowl waiting beside the hob and the spice shelf stay at full strength. The finger draws the knife along (ev1 CK-111 and DAAR-52).
- **SEK-28:** the served tray holds the skewer the child grilled, four meat pieces (`s19-night-c-contract/cook-mishkaki-grill/1920x1080/c13-bubble.png`).

**PARTLY:**
- **SEK-29:** the meat browns over its cooking time (ev1). The tray moves clear of the cog in the code; no frame shows it yet.
- **CK-112:** the maani label sits above the board and the plates are at full strength. Where the dish card sits is the shared card (SH-273).

**LEFT:**
- **SAM-40 (new label: shared):** the kit folds the card once the dish is closed (`ui.js` closeItem `madeNow`). The fold has to wait for the well done.
- **CK-106 (needs Zafar):** the dish lands on Nani's tray. Nobody thanks her, because she is the asker (`flow.js` `kitchenEnd`). Who receives her chopping is his call.
- **CK-107 (to judge):** chop's end buttons match daar's (base `cook-chop/740x320/10-result.png` beside `cook-daar/740x320/15-result.png`).
- **MAA-25 (needs a layout):** at 740x320 two plates do not fit on the worktop beside the hob unless the board or the tawa gets smaller.
- **[check] rows not run, though their probes exist (88 pages did not fit):**
  - DAAR-03, -12, -36 to -41, -43 to -47, -49.
  - SEK-14, -20, -22, -25, -26, -27.
  - SAM-30, -31, -34.
  - MAA-19 to -22.
  - CHT-18, -19.
- **Played in ev3, waiting for the judge:** DAAR-39, -46, -51; SAM-35, -36; CK-112; CHT-13.
  - CHT-13's L1 probe never reaches `view-marble` (0 of 1, twice).
- **Waiting on Zafar:** MAA-20's pick and MAA-23's lesson.
- **Waiting on Mum:** maani's roll call has no recorded voice (contract-36).

## Proof
- Evidence: `build/screenshots/evidence/s19-night-c-ev1/` (index `build/reports/evidence-s19-night-c-ev1.md`, 9 rows) and `.../s19-night-c-ev3/`.
- Contract before: `build/screenshots/sandbox/s19-night-c-base/contract.md` ("CONTRACT FAILED: 19 breaks").
- Four sizes after: `build/screenshots/sandbox/s19-night-c-contract/contract.md` ("CONTRACT FAILED: 139 breaks", 32 of 32 ends).
- L2-L4 after: `build/screenshots/sandbox/s19-night-c-l24/contract.md` ("CONTRACT FAILED: 146 breaks", 47 of 48 ends).
- Device-voice lines heard (for the recording sheet): "Samosa waar!", "Samosa hane kadh.", "Tar!", "trae chunda", "Nindha nindha kap!", "Pela jeeru.".
