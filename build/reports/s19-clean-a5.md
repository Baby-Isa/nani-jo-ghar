# s19-clean-a5: the shared lights, fingers and order card rows (12 Nov)

Opus, high. Branch `s19-clean-a5` (the integration merges c437318b9, s19-clean-e, and 3fe6c7d09, Mum's 12 Nov session, taken in), never pushed.

## Flaws and open (first)
- **No full before.** My base run duplicated s19-clean-a6's, so I stopped it at 9 pages (chaat L2-L3, daar L2-L4); a6 then dropped theirs. Before and after by check is on those 9 pages only.
- **`evidence.mjs --after --brief` refuses the brief:** SH-267's probe wants `life:dish-flash` on `cook:chai-tray#speed1`, which no driver reaches (a6's evidence.json). The rows' own `--run` was about 2.5 h at this load, so I stopped it. The proof is the contract checks and the sandbox's state shots.
- **check-change not run** (hours at load 25-35).
- **Two pages time out at L4 740x320:** chai (as in chai's report) and mishkaki-grill.
- **contract-106 (SH-236) 31:** the lesson's taps are fixed. The rest are games' own control and help lights, late under load; the probe lags about 0.5 s.
- **contract-72 (SH-152) 6 at two sizes:** the pantry's card is redrawn under a new key as its station starts, so its row snaps home (181 to 0). Corn's and mishkaki's frames came late.
- **contract-104 4:** the files exist; they were still loading 600 ms in.
- **contract-112 7:** chai L4's elchi light (chai-tray.js), samosa's own strip and keema lights, the pantry's at order-card-big (two lit regions).
- **contract-121 2 (fetch L2, L4 at 740x320):** the card lesson's picture sits under the pop-up's veil for a moment. Mine, not fixed.
- **SH-264's Oho: in code, not heard in a run.** `cook:chai-tray@L2#serve-wrong` served right (its look-alike was refused), so no wrong card opened in either try (`s19-clean-a5-oho`, `-oho2`).
- **contract-53:** the pantry's, samosa's and baking's help lights are 4-7 times their thing at 740x320 (they frame a region).

## What changed
1. **SH-152:** a card with several rows (chaat, daar) kept only its last row's scroll, so every tick threw the first row back to its start. Each row is now kept, and a served card folds after its row's glide home (`OrderCard.TIMES.homeWait`).
2. **contract-116:** after the order, a row goes home only as far as keeps the current card whole.
3. **SH-267:** the dish card's 1.5 s counts only while frames are drawn (`WordCard.flash`); the order's start froze the page and ate it.
4. **SH-236:** the big card lesson's light leaves the tapped part in the same turn as the tap (was 0.6-0.9 s).
5. **SH-178:** the next item's card is glided whole into its row before it is lit, never the whole order card.
6. **SH-230:** a help light keeps clear of the step's neighbours when its station names none (`Coach.rungs`). Also SH-249: a light cut at the screen's edge keeps the corner rule.
7. **SH-242:** a card's shelf picture by its plain path (baking's flour).
8. **SH-264 (Mum's 12 Nov session, code change 3):** the wrong card opens with her *Oho* (`intj.oh-no`, through the engine's Exclaim, her clip `oho.mp3`). The soft note plays only where the line has no voice.
9. **Chai's ui.js line:** the helper's line is marked said when queued (`NaniGuide.markSaid`), so the help never says it again.

Already built, proven by the run (0 breaks over 88 pages): SH-238 (103), SH-241 and SH-227 (100), SH-239 (108), SH-141 and SH-119 (44; 102's 6 are games' own glows), SH-60 (24, 91), SH-178 (79, 90), SH-250 (112's dim share). PAN-21: no count pill came up on the pantry at L1-L4, and the tally's place is the fridge's base. CK-46: the placement is stations.js (a6's); the art is ART-33's. CK-55: cook:title at 740x320 reaches its end, the shop's "?" clear of the cog.

## Lines for others
- **a6 (checks):**
  - contract-117: leave out a light buried while the "?" pop-up is open.
  - contract-116: leave out rows whose cards are still to be said (`.oc-away`), and samples mid-FLIP.
  - contract-18: compare the life note's `at` with the samples' page time.
  - evidence.json SH-267: `cook:chai-tray`, not `#speed1`.
- **e:** daar's trivet light, samosa's strip and keema lights, mishkaki's lights: close on the press (`Cook.Coach.began`). Also samosa's strip light pad (112).
- **chai-tray.js:** the L4 elchi light at 740x320 (112, bottom -54 px).

## Proof
- **After** (`build/screenshots/sandbox/s19-clean-a5-after/`, L1-L4 at 740x320 and 1280x665, at fa03f4e1b): 86 of 88 ends, 0 page errors, `CONTRACT FAILED: 391 breaks` (contract.md). The biggest are 120 166, 114 12, 65 19 and 37 12 (e's); 36 51, 117 13, 116 11, 107 4 and 18 5 (a6's); 106 31; 70 10 and 83 2 (the games'). My rows' checks: 103, 100, 108, 44, 24, 91, 79 and 90 at 0; 72 6, 119 5, 104 4, 112 7.
- **Before → after, the 9 base pages:** 48 → 36 breaks. contract-72 4→0, 18 5→0, 114 6→2, 102 1→0, 73 1→0; 65 6→9 (chop's waves, under load).
- **Four sizes, L1** (`build/screenshots/sandbox/s19-clean-a5-contract/`, the code before Mum's merge, with e's): 44 of 44 ends, 0 page errors, `CONTRACT FAILED: 112 breaks` (36 34, 106 12, 117 10, 114 9, 73 6). **contract-119 (SH-267) 0** (a4: 14), **contract-72 0**, contract-24 2 (eggs' bowl glows at 2.9 s: e's), contract-79 1 (chai, 18 ms early).
- **Frames** (under build/screenshots/sandbox/): s19-clean-a5-after/cook-eggs/1280x665/01-start.png (CK-46), s19-clean-a5-title/cook-title/740x320/07-shop-grown-ups.png (CK-55), s19-clean-a5-after/cook-fetch-l3/1280x665/07-kind-tap.png (PAN-21).
- `checks: 14 steps in 344 s`, all ok on the final commit (unit 900 pass).

QA: builder · checks ✅ · contract ❌ (owners named) · check-change not run · no Kutchi written
