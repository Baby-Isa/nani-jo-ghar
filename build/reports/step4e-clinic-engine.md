# Step 4e: the clinic on the language engine

Branch `ccr-fcd9dddd-wnywzc`, 5 Oct. No bump, no push to `main`.

**Mechanics changed: none.** No art touched.

## What moved
- `js/clinic/lang.js` is now an adapter over `js/core/lang/engine/` (no Kutchi, tables or agreement). Clinic ids are the engine's aliases. The voice plays the engine's word-by-word clip plan (decision 26).
- All stages, review words and twelve heal games get their words from the engine. Nothing at runtime reads `data/clinic/lang.json` or `kutchi`/`english` fields.
- 39 English lines and 1 word moved out of code into the clinic's data and were re-imported (0 errors). Slotted lines name their engine meaning (`fn`).
- **Marked adapter left:** `Join` sets engine-built pieces side by side where the engine has no rule (heal rows, "pela nindho", "ba laal").
- **Engine change (smallest):** `word()` gives a lone describing word Mum's default gender, flagged (decision 21). Otherwise "nindho" shows "small", which a reader could match.
- `js/core/lang/index.js`: re-exports `createEngine`/`loadEngine` (additive).
- `data/clinic/lang.json` stays because the importer reads it. Orchestrator to decide.

## Changed lines (full diff: `step4e-line-changes.md`)
- G6: *Achija!* → *Khuda-fis*; *Aabhar aanjo!* → *Thank you*.
- Words the engine knew replace placeholders: chokri, chokro, gutan, kan, akh, hath, pag, garam, thundo, chando; *marcha* → *mirchi*.
- Agreement: *hakri chamchi*.
- Undecided clashes kept as the engine has them: yes is *ha*; *jamno* becomes "[right]"; tooth L1-2 "left" says *dabo*.
- Engine wording for placeholders; set phrases end with a full stop.
- Fixed: *Wa alaikum salaam* used to play the *Salamun alaykum* clip.

## Placeholders left
42 clinic frames, about 170 words (`gap-list.md`).

## Proof
- Lang tests 56 ✅ · R5 tests 5 ✅ · `check_clinic_kutchi` ✅ · grep: only item ids ✅ · `check_onboard` ✅ · 13 leak scripts ✅.
- Sandbox `--touched clinic:` at 1366×768, 844×390, 800×360 and 1024×768: 327 of 328 pages reach the end. The one stop passed on re-run. 0 page errors.
- 16 new findings: 15 come from the lab page's ☰ and tray (the old code shows them too). 1 is fever L2 at 800×360, where a third row scrolls the card 5 px.
- Shots: `build/screenshots/sandbox/proof-4e/`, plus `recheck-4e` and `recheck2-4e`.

## QA (builder; orchestrator reviews)
Flaws, all older than this step:
- At 800×360 the "TO RECORD" chip touches the eye.
- "Get well soon!" is dark English in a pill.
- The Say caption is plain text.

TXT ✅ · LAY ⚠ fever · CMP ✅ · LNG ⚠ pill · INT ✅ · AUD ✅ · CUL ✅.

Rows rechecked: CLN-21, 26, 30, 44, 60, 73, 76, 80; LNG-01, 04, 05 ✅.
