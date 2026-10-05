# Step 4a: the language engine core

Branch `ccr-fcd9dddd-wnywzc`, 5 Oct. New files only; no game or shared file changed. Reference: `docs/language/engine-spec.md` § What is built.

## The API (`js/core/lang/engine/`)
`Lang.say(meaning, ctx)` → `{ok, text, en, tokens, segments, rows, clipPlan, drafts, gaps}`; `rows`, `check`, `word`, `play` (→ `Voice.say`), `explain`. Stitched from words by default (decision 26). Anything it can't say is a gap with question IDs and a grey English placeholder.

## The schema (`data/lang/`)
`params` and `elicit` (Mum's templates) are real. `lexicon`, `paradigms`, `abstract`, `concrete` and `clips` are empty, ready for 4b. `test-seed/` holds 38 cited words and 14 rules, for tests only. The validator rejects entries with no source, English-only words not flagged to-record, guesses, free text in rules, and clips that say something else.

## How 4b loads each kind (decision 40, G27)
Each word becomes one lexicon entry, with its notes, open questions and history on that entry. Regular forms go in paradigms, irregular ones in `forms`. Fixed expressions and set phrases (*kari chai*, *na, na khape*) are entries with `parts`. Patterns are abstract meanings plus rules, and their exceptions are the rule's `exceptions`. English-only words are `to-record`. Each recording gets a `clips.json` row. Sources: every data file (parked modes too), recordings, lexicon.md, grammar-notes, grammar-kb, Mum's rounds; old ids become `aliases`.

## Tests
`node --test build/lang/`: **34 pass**. Golden sentences, decision 30 (a)–(f), gaps, fixed expressions, exceptions, clips, rows, the reporter, no Kutchi in code or meanings. `build/core/` (45) and lint (9) pass. `build/test_shared_*`: 1 failure, not from this session: 4 px sizes F1 added to `css/shared/order-card.css`.

## Changes to the design
1. Rules hold no free words: every word is an entry (G26).
2. A separate clip index (`clips.json`), so the recordings file is untouched.
3. `wanted` folded into `to-record`.
4. `p3near`/`p3far` reserved (*hi/hu* point, they are not persons: §51). Added `clusivity` (*pa/asa*, §52).
5. `only` conditions and `exceptions` on rules; `parts`, `notes`, `open` and `history` on entries.
6. A defaulted gender is reported only when a form depends on it.
7. Ids name concepts (`n.boy`), not Kutchi words, so meanings stay language-neutral. An English grammar can sit beside the Kutchi one later: same abstract syntax, its own lexicon and rules. The translation box parses by generating and matching meanings; the dictionary is an export of `lexicon.json` (engine-spec § Room for English).

## For the orchestrator
The px failure is F1's. No screens, no screenshots.
