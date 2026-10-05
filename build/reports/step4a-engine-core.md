# Step 4a: the language engine core

Branch `ccr-fcd9dddd-wnywzc`, 5 Oct. New files only: no game, page or shared file changed, nothing moved onto the engine. Reference: `engine-spec.md` § What is built.

## The API (`js/core/lang/engine/`)
`createEngine({data, audio, voice})` / `loadEngine()`. `Lang.say(meaning, ctx)` → `{ok, text, en, tokens, segments, rows, clipPlan, drafts, gaps}`; `rows`, `check`, `word`, `play` (→ `Voice.say`), `explain`. Stitched from words by default (decision 26). What it can't say comes back as gaps (`lexeme`, `form`, `rule`, `feature`, `audio`) with question IDs, plus grey English placeholders.

## The schema (`data/lang/`)
`params` (features, parts of speech, who "you" is) and `elicit` (Mum's templates) are real. `lexicon`, `paradigms`, `abstract`, `concrete` and `clips` are empty, ready for 4b. `test-seed/` holds 32 cited words and 13 rules from grammar-notes, for tests only. The validator rejects an entry with no source, an English-only word not flagged to-record, a to-record word carrying Kutchi, free text in rules, and clips that say something else.

## What 4b must fill
The lexicon from `data/cook.json`, `data/clinic.json` and grammar-notes (Cook ids as `aliases`); paradigms (start from the seed's); meanings and rules for the § 14 frames; `clips.json` rows for the existing word clips; golden tests on the real data.

## Tests
`node --test build/lang/`: **29 pass**. Golden sentences (§1–§10, §36), decision 30 (a)–(f), oblique *-e*, "of", the unknown-gender default, gaps, clip plans, rows, the reporter, no Kutchi in code. `build/core/` (45) and the lint tests (9) pass. `build/test_shared_*`: 133 pass, 1 fails, and not from this session: `test_shared_frame.mjs` "no hard-coded px" catches 4 px sizes that F1 added to `css/shared/order-card.css`. Gap reporter: `node build/lang/gap-report.mjs --seed`.

## Changes to the design, and why
1. Rules hold no free words: every word is a lexicon entry (`{lex}`), so it carries a status, a source and a clip (G26).
2. A separate clip index (`data/lang/clips.json`) instead of adding keys to `family-audio.json`, so recordings never touch the engine.
3. `wanted` folded into `to-record`, which the validator needs.
4. `p3near`/`p3far` reserved (*hi/hu* point, they are not persons: §51). Added `clusivity` for *pa/asa* (§52).
5. `only` conditions for partial rules (*waari* with chai only; *wagar ji* with she-words, L36).
6. A defaulted gender is reported only when a form depends on it (informal *khape* doesn't).

## For the orchestrator
The px failure belongs to F1/C3. No screens, so no screenshots; QA is the automated lines (LNG-04 via the validator).
