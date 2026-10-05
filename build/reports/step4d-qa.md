QA: Cook on the language engine (4d) · reviewer: the builder (the orchestrator reviews next) · commit: see git log ("4d:")
Scope per decision 48: fast checks plus one `--touched` pass at 1366×768 (`cook:`, `clinic:`), one shot each. No 4-size matrix, no sound run; the orchestrator runs the full matrix before publishing.

Auto:
- `node --test build/lang/` 56 ✅ · `build/core/` 45 ✅ · `build/test_cook_words.mjs`, `test_cook_lang.mjs`, `test_cook_voice.mjs` 12 ✅ (549 lines through the engine's plan, no whole-phrase clip)
- `build/tools/review/checks.mjs` ✅: 229 unit tests pass, the word gate is strict on js/cook and js/clinic (0 literals), bump dry run
- `import_all.mjs --check` ✅ (0 errors, 0 warnings; the engine's output is the same as before the seed move)
- `check_onboard` ✅ · `leak_cook` ✅ · leak monsoon, find, who and dress ✅ · leak_clinic and the heal leaks ✅ · `check_clinic_kutchi` ✅
- Smoke: fetch, chai-tray and samosa ✅. **daar ❌: hit the smoke's 240 s play limit in the stir phase, with no page error.** In the sandbox the daar flows reach their end (daar@L2#mistake, daar#takeback, L3, L4 and hint).
- Sandbox, parked pages (`d4-parked2`): all 6 reach their end, 0 new findings · laptop pass `d4-laptop`: LAPTOP

Screens (flaws first):
- Pantry card @1366: the headline "Bring me these" is the engine's to-record placeholder (italic, flagged). On the word review, the "Served" stamp sits over the card's TO RECORD chip (older than 4d).
- To-record placeholders now end with a full stop ("Chop these.", guide lines): the engine's Say.
- A noun of unconfirmed gender takes the he-pattern plural (*chunda*, *bataata*). The engine marks its data confirmed, so no "to check" dots show. This is an engine follow-up.
- Samosa take-back @1366: the strip emptied, Done hidden ✅. Heap labels stay in the one-form (*chundo*) while the card says *ba chunda* (expected).
- Sekelo word review: *hakri* · *lakri* · *gos*, the order's own forms (SH-02 ✅).
- Daar L2 chop card: "Chop these." flagged, *hakro dungri* dotted to check, *ba mirchi* ✅.
- Chaat L1 @800×360 (from the stopped proof run): rows *chana*, *ba bataata*, *mirchi*; the bulb's English "I'd like chaat." / "two potatoes" ✅.

Checklist: TXT ✅ · LAY ✅ (no layout change) · CMP ✅ · LNG ⚠ placeholders listed in the gap list · INT ✅ (take-back tested) · AUD ✅ (engine plan; device voice only on the test path) · ART n/a · CUL ✅

Regressions rechecked: PAN-02 partly built (the pantry) · SH-02 ✅ (exact forms in the review) · LNG-03 ✅ · LNG-04 open (with, and, times; listed) · SAM-01 ✅ ("with" still a placeholder) · CHAI-05 ✅ · MAA-02 ✅ · SEK-01 ✅ · CK-TB-01: samosa and chaat take-back run in the sandbox now.
