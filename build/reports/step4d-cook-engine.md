# Step 4d: Cook on the language engine

Branch `ccr-fcd9dddd-wnywzc`, 5 Oct. No `bump_version`, no push to `main`.

**Mechanics changed: none.** Samosa's Done now only shows while the strip has something on it (C3 leftover). **Art: all old, nothing new.**

## What moved
- `js/cook/words.js` connects Cook to the engine (the 4e pattern). Every word, row, headline, bubble, guide line, pantry line, greeting, word tile and count comes from the engine, and speech plays the engine's stitched clip plan. It keeps the old call names, so no station changed.
- **Marked adapter left:** `Lang.join` sets engine pieces side by side where the engine has no rule (orders' "with"/"and" joins, lists).
- Frames are data: `data/cook.json` `meanings`.
- `cook.html` no longer loads `js/cook/lang.js`. It stays, marked, only for the parked pages (dress, find, snap, tidy, monsoon; who reads the seed through `core.js`). It is not thin: those pages need its lookups until each moves to the engine.
- **The orchestrator's addition:** Cook's words, lines, grammar, guide English and headlines, plus the clinic's word and line text, are in `data/lang/seed/` and the importer reads them there. Engine output is unchanged. `data/clinic/lang.json` is deleted. `data/cook.json` keeps only the item catalogue. Not moved: `pipeline.json`'s English (the clinic's code reads it), `content.json` and `cook-tts.json` (parked runtime data).
- Word lint: **0 literals in js/cook** (internal mistake reports and grown-ups' labels are allow-listed, with reasons). Cook's code reads no word text (`build/test_cook_words.mjs`).

## Changed lines (full list: `step4d-line-changes.md`)
*Thank you!*, *Khuda-fis!*; *mirchi*; *kabaat*. Pantry: *Muke atto de.* for each thing (PAN-02). Plurals the engine knows: *ba bataata*, *ba chunda*, *watano*. Card no-rows are lower case. Undecided clashes untouched: Hedo/Ghan (the engine marks them draft), ha/haa, jamno, samosa/sambusa, watana/matar, rasoro/jikoni.

## Placeholders left
Cook: 5 frames ("with", "and", "times", the sugar sentence, the pantry headline), 24 words or lines, 1 form (*tameto*'s plural) (`gap-list.md`).

## Proof
Decision 48 scope; full list in `step4d-qa.md`.
- Tests: lang 56, core 45, Cook words/lang/voice 12, `checks.mjs` (229 unit tests; word gate strict on js/cook **and js/clinic**, 0 literals). Clinic literals were logs, aria, SVG and keys; the parked heal games hic/tummy/hair are a marked G26 debt.
- check_onboard, leak_cook, `test_cook_host` and the parked and clinic leaks pass. Smoke passes for fetch, chai-tray and samosa. **Daar's smoke hit its 240 s limit in stir** (no page error); the sandbox's daar flows end.
- Sandbox at 1366×768 (stopped early, as asked): 86 Cook pages, all end, 0 page errors. 7 pages each have 1 finding, not checked against the baseline. Parked pages: all 6 end, 0 new findings. The clinic pass was not run.
- Looked at: pantry, chop card, samosa take-back (emptied strip, no Done), sekelo review (*hakri*), chaat at 800×360.

## Screenshots
`build/screenshots/sandbox/d4-proof/` (not committed); QA: `step4d-qa.md`.
