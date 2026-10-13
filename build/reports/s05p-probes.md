# S05-P: the last probe fixes and the row paperwork

## What changed
- **ART-18:** the sound hook now logs the speaker (`talk:nani`, from the shared talk's start); the trace follows her talk alone at speed 1 and stops when it does. Nani's talk is **1.4 and 1.9 px** (limit 2), run ev-20261013-113350-yrf: amplitude passes; the period is undecided (the talk is shorter than one cycle). Pushed alone first (48f64ae). Row left open for G/the orchestrator to judge.
- **Built on fresh run ev-20261013-113508-8ie:** 17 of 18 rows (SH-13, 15, 33, 41, PAN-02, CHAI-06, 15, MAA-10, CK-02, 12, 20, CLN-11, 48, 111, 117, MOD-01, LNG-02). **SH-66 fails on the game** (2 clips, "Dudh." and "Ne daar.", start 0.31 s after stage-end): for G.
- **Probe faults:** SH-03 (gloss left out of the lexicon check, clinic card no longer asks for a word list) PASS; SAM-02, 08, 10, CK-09 (now cook:maani-line, canvases chakla/velan), SEK-07 judged by eye PASS (S05-P judged: /review rechecks). MAA-08: **game fail for G** (844x390 roll-tawa plate cut by the top edge). CLN-65: game and art, only hot, happy and cold exist. CLN-45: probe reads the card now; ladder judgement open. SEK-13: still open (the #mission crop shows no piece rows; T). ART-12: the neck/back/hair screen is on no frame; needs naming.
- **CLN-122** closed as is (decision 83). Counts: 45 open or reopened, 294 built.

## Round 2 (orchestrator's three items)
- **SEK-13:** peek at L3 (run ev-20261013-120457-te9) shows the closed one-line card, no piece rows; a mixed skewer only comes at L3+, where cards are closed. Question for G: should a peek open the rows? Still open.
- **ART-12:** "7.1" is a stale 30 Sept art-batch label; no screen shows separate neck, back and hair parts: art or design gap, waiting.
- **CLN-45:** ladder judged from the level data: one-thing-per-level holds in ear L2, hair L3, tummy L2; breaks at L2 in eye, foot, knee and at L3 in boing, taste, tooth and more. Reopened for G and D19.
- **CLN-65:** marked waiting on art.

## Round 3 (G's rows, the probe side)
Fixes: `stir-begin` moment (DAAR-11), `listen-through` driver (SEK-11), the maani-line plate (MAA-08), `textMatches` counts only what a child sees (CLN-14), SH-19 max 14, SH-01 at `result`, SAM-16 film, mounds row renumbered SAM-17.
- Built: DAAR-11 (347.6 deg), SEK-11, SH-01, CLN-14, SH-19.
- SH-17 reopened: the Cook chai pop-up read-along lasts 89 ms a word (shared order card).
- MAA-08 open: plates whole; a face disc on the hob, orchestrator to judge.
- SAM-16: filmed; the diagonal is too small at stage size.

- **SAM-16 (round 4):** the probe films canvas:sv3-fold on a fresh profile at L1 and L2, 4 frames at 200 ms (run ev-20261013-134819-70s): the ghost and the first fold's diagonal are clear. Status stays 'built, sheet to judge' for the orchestrator.

## Not done
`touched.mjs` maps only evidence.json (tools change), i.e. a full sandbox pass, so I skipped it and shotdiff/regress (brief: never a full pass). Checks: 293 unit tests, words, specs, load all ok.

# s05p-probes

Branch `ccr-a7370759-t0lee7`, commit `3312c12`. Sandbox run `ev-20261013-115633-t92`. Game code changed: <say what, or "no">.

## What was built
<!-- fill in: each change, one line, the files; mechanics changed and old art reused first -->

## Proof (from the run; do not retype)
- **Pages run:** 1 (flow x size): 1 flows at 1366x768. 1 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 11 of 11 states, in `build/screenshots/sandbox/ev-20261013-115633-t92` (not committed, B19). Contact sheets: `build/screenshots/sandbox/ev-20261013-115633-t92/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (0 known, 0 fixed). Findings in the run: 0 (none).
- **Sound:** 1 lines with no family clip, 6 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/ev-20261013-115633-t92 vs build/tools/review/approved-shots.json: 59 shots, 0 changed, 59 new, 0 gone, 0 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 238 single words that may be ids
  - B  English that a child may see: 38 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (13 places)
  - D  lines with no family recording: 36 distinct words with no clip in 4081 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: cook:mishkaki-grill@L4 · reviewer: <someone other than the builder> · commit: 3312c12
Auto: layout lint ✅ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 14 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| cook:mishkaki-grill@L4 | 1366x768 | 11 | 0 | sheets/cook-mishkaki-grill-l4__1366x768.png |

### Regression rows to recheck (14; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] SEK-01 · built · eye/ear: card · LNG-04 · Headline is Muke sekelo khape (was "mishkaki"; mishkaki is the meat cubes); sekelo still to conf
- [ ] SEK-02 · built · eye: ×2 zoom · All-new art, not reused old grill, rack, board and skewer; rack does not read as an empty pictur
- [ ] SEK-03 · built · eye: sekelo L3–L4, samosa L3, chaat, s · Several skewers get a mini card each: each skewer a plain group box of pills, alternate groups t
- [ ] SEK-04 · built · auto: data check; eye · No bare "boga" skewers; a veg skewer names what is on it, in order
- [ ] SEK-05 · built · auto: build/test_cook.py --orders · No duplicate pick in an order ("tameto, tameto")
- [ ] SEK-06 · built · eye: ×2 zoom · Onion and tomato are big and chunky, the same in the bowl and on the skewer, not oversized again
- [ ] SEK-07 · built · eye: plate state with 2–4 skewers, ×2 · Plate skewers lie straight and parallel, left to right across the plate, never fanned or bending
- [ ] SEK-08 · built · eye: each phase · One job per phase (thread, then grill); no chips on the grill
- [ ] SEK-09 · built · eye: grill phase, turn early / on time · Turning a skewer too soon shows nothing and costs nothing (too late not yet tested). An early tu
- [ ] SEK-10 · built · ear: sekelo L2 · Count-along at L1 only (L2 still speaks every piece)
- [ ] SEK-11 · reopened · ear: L2–L3 · Spoken order: each skewer's sequence follows it at once ("two mixed: first…, then…; one onion")
- [ ] SEK-12 · built · eye: L3 bulb · Quantity two written where said (with SH-52)
- [ ] SEK-13 · open · eye: mixed skewer · Card ticks each piece of a mixed skewer as it goes on
- [ ] SEK-14 · open · eye: rack and plate with 1–4 skewers, · The rack and the plate are pre-rendered pictures holding one, two, three and four real skewers (

## Left open
<!-- fill in -->
