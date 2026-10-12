# s05b-words

Branch `ccr-a7370759-t0lee7`, commit `4298f20`. Sandbox run `s05b-touched`. Game code changed: yes (pantry labels, the house, Find it greybox, Cook word HTML and the bulb's English, the engine's English).

## What was built
- **Pantry leak (PAN-15):** no jar wears a word label, whatever the order (`js/cook/mechanics/fetch.js`); a pantry bot in `leak.mjs cook` (`leak-games/cook.mjs`, T's file: pantry part only).
- **No written English for the child (FL-03):** house doors are pictures, no "Player 1", "Add" or "Who's playing?" (`js/home.js`); Find it greybox scenery unlabelled (`js/find/view.js`).
- **Engine safety:** the 8 confirmations in `build/lang/hand/confirmed.mjs`; `import_all.mjs` refuses to demote a confirmation; `build/lang/diff.mjs` (0 differences).
- **Loans (LNG-13):** `loan: "en"` on mixed, cup, film, thank you, na thank you; draft *aabhar aanjo* dropped (`build/lang/hand/loans.mjs`); `build/lang/loan-audit.mjs`.
- **Words:** card placeholders keep the hidden to-record tag (`js/cook/words.js`, LNG-03); the bulb's English reads whole ("Chickpeas. Put it in!", "two skewers of mixed": `js/core/lang/engine/index.js`, `words.js`, SH-52).
- Spec fixes, not code (the probe read the wrong thing): PAN-03, MAA-02, CHAI-05, SAM-03, SH-52, LNG-03.

**Flaws first:** with no labels, flour, sugar and salt are three near-identical white jars. The fix is the sticker-label jar art Zafar specified on 28 Sept (the shelf art is "bare until Zafar decides on labels"). *Decision 1 (recommend yes):* an art-run part for jar stickers. *Decision 2:* PAN-06's "three to four full shelves" means more decoys than the level knob allows (8/11/13/14 of 21 slots, data/cook.json): recommend filling every slot from L2 up. The picker's "+" tile is emptier without "Add".

**Handed on.** T: the lexicon expect should accept engine-inflected forms (chunda) and skip the bulb's English; a numbers-known profile (SH-13); evidence run ids clash across sessions (minute stamps). C: "Nana (lab)" (`flow.js:1220`, CK-22); samosa's ✓ (SH-56); the chai strip's small jars (PAN-09). Mum: *Muke de* (SH-70), "with" (gap list 2), silent lines (LNG-01).

Red run: **ev-20261012-2108** (19 rows; failing: SH-13, SH-52, SH-70, PAN-02, PAN-03, CHAI-05, MAA-02, SAM-03, SAM-15, SEK-12, CK-22, LNG-01, LNG-03; LNG-13 had no spec).

| Row | Red | Green | Verdict |
|---|---|---|---|
| PAN-15 | leak bot 10.0% (pre-fix) | ev-20261012-2124 | built |
| FL-03 | ev-20261012-2132 | ev-20261012-2134 | built |
| LNG-03 | 2108 | ev-s05b-g2 | built |
| LNG-13 | ev-20261012-2143 | ev-s05b-g2 | built |
| SH-52 | 2108 | ev-s05b-g6 | built |
| SEK-12 | 2108 | ev-s05b-g5 | built (S's SH-41) |
| SAM-15 | 2108 | ev-s05b-g3 | built |
| PAN-03, MAA-02, SAM-03 | 2108 | ev-s05b-g3 | built (spec) |
| CHAI-05 | 2108 | ev-s05b-g4 | built (spec) |
| SH-56 | PASS | PASS (g3) | unchanged; ✓ is C's |
| SH-13, SH-70, PAN-02, CK-22, LNG-01 | 2108 | still red (g3) | open: T, Mum, C |
| SH-69, SEK-11, PAN-06, PAN-09 | sheets | g3 / 2124 | sheet to judge |

### Borrowing audit (for Zafar and Mum; 22 words)
**Zafar, 12 Oct: yes.** Now marked loan en (`build/lang/hand/loans.mjs`): chips, glass, shelf, table, time, help, mix, slow (11 marked words in all); peach stays a draft with a question on Mum's list; the South Asian words stay unmarked. `import_all.mjs --check` passed, diff 0, lang tests 57/57.

Marked: cup, film, mixed (and the phrases thank you, na thank you). The source already says "the English word", so mark them (recommend yes to all): chips, glass, shelf, table, time, help, mix, slow. To confirm: peach (draft). Words English took from South Asia, not loans (no mark): bhajiya, chaat, chai, chutney, garam masalo, ghee, kebab, samosa, sev, tawa.

## Proof (from the run; do not retype)
- **Pages run:** 30 (flow x size): 30 flows at 1366x768. 30 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 357 of 357 states, in `build/screenshots/sandbox/s05b-touched` (not committed, B19). Contact sheets: `build/screenshots/sandbox/s05b-touched/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (40 known, 10 fixed). Findings in the run: 40 (tap-small 22, canvas-text-small 9, text-small 8, scroll-container 1).
- **Sound:** 51 lines with no family clip, 28 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/s05b-touched vs build/tools/review/approved-shots.json: 802 shots, 0 changed, 802 new, 0 gone, 0 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 230 single words that may be ids
  - B  English that a child may see: 38 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (13 places)
  - D  lines with no family recording: 36 distinct words with no clip in 4081 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: cook:chaat#hint, cook:chaat#mistake, cook:chaat#takeback, cook:chaat@L2#mistake, cook:chaat@L2, cook:chaat@L3#hint ... · reviewer: the orchestrator (not yet reviewed) · commit: 4298f20
Auto: layout lint ✅ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 45 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| cook:chaat | 1366x768 | 13 | 1 | sheets/cook-chaat__1366x768.png |
| cook:chaat@L2 | 1366x768 | 13 | 1 | sheets/cook-chaat-l2__1366x768.png |
| cook:chaat@L2#mistake | 1366x768 | 13 | 1 | sheets/cook-chaat-l2-mistake__1366x768.png |
| cook:chaat@L3 | 1366x768 | 13 | 0 | sheets/cook-chaat-l3__1366x768.png |
| cook:chaat@L3#hint | 1366x768 | 14 | 0 | sheets/cook-chaat-l3-hint__1366x768.png |
| cook:chaat@L4 | 1366x768 | 12 | 0 | sheets/cook-chaat-l4__1366x768.png |
| cook:chaat#hint | 1366x768 | 14 | 0 | sheets/cook-chaat-hint__1366x768.png |
| cook:chaat#mistake | 1366x768 | 15 | 0 | sheets/cook-chaat-mistake__1366x768.png |
| cook:chaat#takeback | 1366x768 | 14 | 0 | sheets/cook-chaat-takeback__1366x768.png |
| cook:fetch | 1366x768 | 9 | 0 | sheets/cook-fetch__1366x768.png |
| cook:fetch@L2 | 1366x768 | 9 | 0 | sheets/cook-fetch-l2__1366x768.png |
| cook:fetch@L2#mistake | 1366x768 | 13 | 0 | sheets/cook-fetch-l2-mistake__1366x768.png |
| cook:fetch@L3 | 1366x768 | 11 | 0 | sheets/cook-fetch-l3__1366x768.png |
| cook:fetch@L3#hint | 1366x768 | 12 | 0 | sheets/cook-fetch-l3-hint__1366x768.png |
| cook:fetch@L4 | 1366x768 | 11 | 0 | sheets/cook-fetch-l4__1366x768.png |
| cook:fetch#hint | 1366x768 | 12 | 0 | sheets/cook-fetch-hint__1366x768.png |
| cook:fetch#mistake | 1366x768 | 13 | 0 | sheets/cook-fetch-mistake__1366x768.png |
| cook:fetch#speed1 | 1366x768 | 11 | 0 | sheets/cook-fetch-speed1__1366x768.png |
| cook:fetch#takeback | 1366x768 | 13 | 0 | sheets/cook-fetch-takeback__1366x768.png |
| cook:mishkaki-grill | 1366x768 | 10 | 1 | sheets/cook-mishkaki-grill__1366x768.png |
| cook:mishkaki-grill@L2 | 1366x768 | 10 | 1 | sheets/cook-mishkaki-grill-l2__1366x768.png |
| cook:mishkaki-grill@L2#mistake | 1366x768 | 13 | 1 | sheets/cook-mishkaki-grill-l2-mistake__1366x768.png |
| cook:mishkaki-grill@L3 | 1366x768 | 12 | 0 | sheets/cook-mishkaki-grill-l3__1366x768.png |
| cook:mishkaki-grill@L3#hint | 1366x768 | 13 | 0 | sheets/cook-mishkaki-grill-l3-hint__1366x768.png |
| cook:mishkaki-grill@L4 | 1366x768 | 12 | 0 | sheets/cook-mishkaki-grill-l4__1366x768.png |
| cook:mishkaki-grill#hint | 1366x768 | 13 | 1 | sheets/cook-mishkaki-grill-hint__1366x768.png |
| cook:mishkaki-grill#mistake | 1366x768 | 11 | 1 | sheets/cook-mishkaki-grill-mistake__1366x768.png |
| cook:mishkaki-grill#takeback | 1366x768 | 14 | 1 | sheets/cook-mishkaki-grill-takeback__1366x768.png |
| house | 1366x768 | 6 | 14 | sheets/house__1366x768.png |
| mode:find | 1366x768 | 8 | 17 | sheets/mode-find__1366x768.png |

### Regression rows to recheck (45; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CHT-01 · built · eye: L1 · INT-10 · Quantities are not only heard: card says ba dungri at L1 (counting rule)
- [ ] CHT-02 · built · eye: 1366×768 · Ingredient bowls side-on, not three-quarter
- [ ] CHT-03 · built · auto: build/check_vessel_meta.py check · Glass bowl: a thin, plain side-on profile with layer strips, no thick base, no reflections, flat
- [ ] CHT-04 · built · eye: serve and build states · Layers read as food, not liquid or flat rectangles; chilli layer not too thick; tidy ingredient
- [ ] CHT-05 · reopened · eye: chop phase · CMP-04 · Chop timer ring in the shared colours, not the old ones (verify)
- [ ] CHT-06 · built · eye: chaat L1–L3 · Potato row ticks only at the second of two; the checker counts quantities (one potato passed for
- [ ] CHT-07 · reopened · eye: story chaat · Chaat flow (Zafar, 12 Oct): the person first says they want chaat (the dish, not the layer order
- [ ] CHT-08 · built · eye: chaat retry · On a retry the order is re-said on his own card with rows lit as spoken; no extra card
- [ ] CHT-09 · built · ear: chaat L1 · arre re (never confirmed, not a family word) removed; find why it plays on correct layers
- [ ] CHT-10 · built · auto: contract check (pop-up before ev · L4 chaat: the order comes up in the shared pop-up and is read out before it folds into the close
- [ ] CHT-11 · built · eye: Cook service, chaat served · Served chaat drawn at the tray's angle (side-on art if side-on), no baked drop shadow
- [ ] CK-TB-01 · built · sandbox #takeback flows · Take it back until Done (E14): 9 of 12 Cook stations offer no take-back (only chaat, assemble an
- [ ] CK-27 · reopened · eye: chai, daar, chaat, samosa, the mo · An ingredient going into a pot, pan, glass or bowl shows a small puff or sprinkle: one shared ef
- [ ] CK-29 · built · auto: contract check (decision 75) eve · Every recipe gives each instruction just before the game that needs it (the chaat flow, CHT-07:
- [ ] PAN-01 · reopened · eye: 390×844 and 1366×768, each fetche · KNOWN BUG. "Bring me these" headline clipped ("these" cut) and the growing highlighted row / gol
- [ ] PAN-02 · reopened · eye/ear: every order sentence · LNG-03 · KNOWN BUG. Spoken and written lines are fragments with no verb (khun, ne daar, ne dudh; "I want
- [ ] PAN-03 · built · eye: pantry card · LNG-04 · Headline says "bring me these for {dish}", not "Muke dudh de." over atto with chai below (reads
- [ ] PAN-04 · built · auto: contract-7 one-voice (voice log: · One speech queue per station, in every station and the clinic: the count words, Nani's "next thi
- [ ] PAN-05 · reopened · eye: story mode · Pantry is fetched first, the first time each dish is made that day, story mode only
- [ ] PAN-06 · reopened · eye: 1366×768 · ART-03 · Shelves side-on, not top-down bowls; clear labelled jars; meat in a fridge section; no generic m
- [ ] PAN-09 · reopened · eye: 390×844 and 1366×768, pantry shel · The small jars (garlic, ginger, cardamom, salt) are drawn at the full slot size with their conte
- [ ] PAN-10 · open · ear: pantry L1–L3; eye: the guide box · Pantry wording: card headline Muke de + items, Nani's box the task (Muke chai lai de, to check w
- [ ] PAN-11 · built · ear: tap mid-line · INT-01 · A tap during her line pauses her, the count word plays, and she carries on (no garbled "Hakro…")
- [ ] PAN-12 · built · ear: pantry count · Shorter gap between count words (trim clip silence)
- [ ] PAN-13 · built · eye: story days 1–3 · Pantry/chai fatigue in the story days: pantry only the first time a dish is ever made; a new sta
- [ ] PAN-14 · built · auto: contract-11 background (drawn as · The pantry background (and every background, SH-29) is never stretched out of proportion at any
- [ ] PAN-15 · built · auto: node build/tools/review/leak.mjs · The shelf labels give the order away (non-negotiable 6): a jar's word label follows that word's
- [ ] SEK-01 · built · eye/ear: card · LNG-04 · Headline is Muke sekelo khape (was "mishkaki"; mishkaki is the meat cubes); sekelo still to conf
- [ ] SEK-02 · built · eye: ×2 zoom · All-new art, not reused old grill, rack, board and skewer; rack does not read as an empty pictur
- [ ] SEK-03 · reopened · eye: sekelo L3–L4, samosa L3, chaat, s · Several skewers get a mini card each: each skewer a plain group box of pills, alternate groups t
- [ ] SEK-04 · built · auto: data check; eye · No bare "boga" skewers; a veg skewer names what is on it, in order
- [ ] SEK-05 · reopened · auto: build/test_cook.py --orders · No duplicate pick in an order ("tameto, tameto")
- [ ] SEK-06 · built · eye: ×2 zoom · Onion and tomato are big and chunky, the same in the bowl and on the skewer, not oversized again
- [ ] SEK-07 · reopened · eye: plate state with 2–4 skewers, ×2 · Plate skewers lie straight and parallel, left to right across the plate, never fanned or bending
- [ ] SEK-08 · reopened · eye: each phase · One job per phase (thread, then grill); no chips on the grill
- [ ] SEK-09 · built · eye: grill phase, turn early / on time · Turning a skewer too soon shows nothing and costs nothing (too late not yet tested). An early tu
- [ ] SEK-10 · built · ear: sekelo L2 · Count-along at L1 only (L2 still speaks every piece)
- [ ] SEK-11 · reopened · ear: L2–L3 · Spoken order: each skewer's sequence follows it at once ("two mixed: first…, then…; one onion")
- [ ] SEK-12 · built · eye: L3 bulb · Quantity two written where said (with SH-52)
- [ ] SEK-13 · reopened · eye: mixed skewer · Card ticks each piece of a mixed skewer as it goes on
- [ ] SEK-14 · open · eye: rack and plate with 1–4 skewers, · The rack and the plate are pre-rendered pictures holding one, two, three and four real skewers (
- [ ] FL-02 · built · eye: 390×844 · LAY-06 · On phone the home button does not overlap Cook's title card or the clinic's task card
- [ ] FL-03 · built · auto: evidence probe on the house and · The house (the first screen a child sees after the first launch) shows no written English to the
- [ ] MOD-01 · reopened · auto: build/bg_align_check.py · ART-04 · Find it relights 8.2 and 8.3 are a relight, not a redraw
- [ ] MOD-02 · open · eye: Find it · Sitting room 3.2: sofa too high

## Left open
SH-03: the English under each word stays as designed (Zafar, 12 Oct, F14); row noted, layout is S's. Checks: `checks.mjs` passed (265 unit tests, 0 literals, load 21/21), `import_all.mjs --check` passed, lang tests 57/57, `leak.mjs cook` passed. Touched run `s05b-touched` covered 5 flows at 1366x768 (about 6 min; the full touched list is everything, left to `/review`).
