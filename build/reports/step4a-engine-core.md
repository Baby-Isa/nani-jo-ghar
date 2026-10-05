# Step 4a: the language engine core

Branch `ccr-fcd9dddd-wnywzc`, 5 Oct. New files only: no game, page or shared file changed, nothing moved onto the engine. Reference: `docs/language/engine-spec.md` § What is built.

## The API (`js/core/lang/engine/`)
`createEngine` / `loadEngine`. `Lang.say(meaning, ctx)` → `{ok, text, en, tokens, segments, rows, clipPlan, drafts, gaps}`; `rows`, `check`, `word`, `play` (→ `Voice.say`), `explain`. Stitched from words by default (decision 26). What it can't say comes back as gaps (`lexeme`, `form`, `rule`, `feature`, `audio`) with question IDs and grey English placeholders.

## The schema (`data/lang/`)
`params` and `elicit` (Mum's templates) are real. `lexicon`, `paradigms`, `abstract`, `concrete` and `clips` are empty, ready for 4b. `test-seed/` holds 38 cited words and 14 rules, for tests only. The validator rejects an entry with no source, an English-only word not flagged to-record, a to-record word carrying Kutchi, free text in rules, and clips that say something else.

## How 4b loads each kind (decision 40, G27)
Each word becomes one lexicon entry, with its notes, open questions and history on that entry. Regular forms go in paradigms; irregular forms go in the entry's `forms`. Fixed expressions and set phrases (*kari chai*, *na, na khape*) are entries with `parts`. Patterns are abstract meanings plus rules, and their exceptions are the rule's `exceptions`. English-only words are `to-record`. Each recording gets a `clips.json` row. The full table is in engine-spec. Sources: `data/cook.json`, `data/clinic.json`, `data/content.json` (parked modes), `family-audio.json`, lexicon.md, grammar-notes, grammar-kb, Mum's rounds. Cook ids go in as `aliases`.

## Tests
`node --test build/lang/`: **33 pass**. They cover golden sentences, decision 30 (a)–(f), oblique *-e*, "of", the unknown-gender default, gaps, fixed expressions, exceptions, clip plans, rows, the reporter, and no Kutchi in code. `build/core/` (45) and lint (9) pass. `build/test_shared_*`: 1 failure, not from this session: 4 px sizes F1 added to `css/shared/order-card.css`.

## Changes to the design
1. Rules hold no free words: every word is an entry (G26).
2. A separate clip index (`clips.json`), so the recordings file is untouched.
3. `wanted` folded into `to-record`.
4. `p3near`/`p3far` reserved (*hi/hu* point, they are not persons: §51). Added `clusivity` (*pa/asa*, §52).
5. `only` conditions and `exceptions` on rules; `parts`, `notes`, `open` and `history` on entries.
6. A defaulted gender is reported only when a form depends on it.

## For the orchestrator
The px failure belongs to F1/C3. No screens, so no screenshots.
