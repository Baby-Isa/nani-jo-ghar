# s20-recording-sheet: the one recording sheet (builder report, 14 Nov)

**What changed.** Every question for Mum now lives in one source, `data/lang/recording-sheet.json` (2,179 rows; a row is never deleted or renumbered). `build/tools/lang/recording-sheet.mjs` makes `docs/language/recording-sheet.docx` (tables, grammar first, then each game; done rows grey, last) and its `.md` twin. `recordings.mjs` adds the engine's needs to the source (gaps, unknown and draft grammar cells, the day, parked words) and marks rows recorded when a clip's question id is the row's id; `mumsheet.mjs` adds the clash list's quick checks and prints the next sitting; neither writes its own sheet. Old sheets: `docs/archive/language/`.

## Inventory (every sheet found, all merged)

| Sheet | Date | Questions | Result |
|---|---|---|---|
| Combined, Round 3, Round 4 (archive) | 25-28 Sept | 625 / 606 / 598 ids (shared C-I series) | all present |
| Round 5, Round 6 (.md, .docx) | 1 Oct, 3 Nov | 220 / 148 | all present |
| Round 1, Round 2 (archive) | 23-24 Sept | superseded by Combined | via Combined |
| Mum yes-no list | 5 Oct | 67 | present (English only) |
| doctor-recording-list (.md, .docx) | 13 Oct | 235 | all present |
| recording-sheet.md (generated) and its 23 Oct .docx | 20 Oct-13 Nov | ~1,000 / 611 | re-derived; 1c's prose is 12 rows; 61 dropped needs "closed" |
| recording-sheet-2026-11-12.docx | 12 Nov | 57 + word lists | present; 87 rows recorded from the sitting's clips |
| grammar-notes "For Mum next time", grammar-kb's open needs, decision 27, farm.md | 5 Oct-14 Nov | 75 | rows |

## Sections (to do / done)

Grammar 403/232: G-NOUN 54/76, G-VERB 23/13, G-TENSE 103/10, G-NEG 5/6, G-Q 6/4, G-NUM 10/4, G-AMT 11/0, G-ADJ 26/28, G-POS 25/39, G-JOIN 15/13, G-PLACE 10/12, G-POL 38/4, G-CMD 12/0, G-PRAISE 5/4, G-CHK 60/19.
Cook 209/190: chai 44/42, eggs 6/4, baking 10/13, corn 6/1, pantry 19/2, chop 4/2, chaat 9/8, daar 16/5, samosa 9/7, maani 10/3, sekelo 13/5, every game 63/98.
Clinic 500/9 (visit 161, heal 155, words 164/9, old man 10, doctor 10). Farm and day 92/4. Story and birthday 72/24. Parked 437/7.
Statuses: 1,640 to record, 73 to confirm, 69 answered, 329 recorded, 68 closed. New: decision 27's khapeti/khapanti/khapeto/khapanta (G-VERB-01..05, 35, 36 with their orders: khapeti alone and "Muke dudh khapeto" already recorded, the rest to record), "akho burichad" ("Fill it up all the way", CK-CHAI-01, to confirm), and the genders the endings need (sekelo, naan, makai G-NOUN-36..38; chaat 127; garlic, mishkaki, mustard seeds 128-130, after merging the language branch c7af047eb).

## Proof

- The generator twice: identical md5 for both files (a test checks it byte for byte).
- `node --test` recordings, mumsheet, recording-sheet tests: 16 pass. `checks.mjs` after the merge: 14 steps ok (recordings: "current, 2179 rows").
- No rows, flows or before folder in the brief (no evidence probes). Check-change (`--base f3c8a0156`; it plays chai, data/lang reading as shared): push pass; scope fail (Open 5); play: 3 contract breaks on chai (121, 79, 112; no game file touched here); before cut short by another builder's pkill; stopped at frozen to merge; no result file.

## Open

1. `docs/tools.md`, `grammar-kb.md`, `grammar-notes.md` name old tools and paths (not mine); I fixed `engine-spec.md`'s, which broke the docs check.
2. `mumround.mjs`'s draft-items regex misses the new ids.
3. `checks.mjs` runs the generator's test through `recordings.test.mjs`; listing `build/tools/lang` would be cleaner.
4. Old answered rows with no clip carry no Kutchi (it lives in grammar-notes).
5. The brief's owns are prose, so `brief.mjs --audit` flags every file, owned ones too.
