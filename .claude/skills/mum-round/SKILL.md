---
name: mum-round
description: Process a new round of Mum's recordings into clips, the family-audio manifest and the language engine, and build the next round's question sheet. Use when Zafar uploads a folder of Mum's voice files, or asks what to ask Mum next.
---
# /mum-round: from Mum's recordings to the engine, and the next sheet

**For:** language work. Rules: non-negotiable 2; the language rules in `docs/language/lexicon.md` and `engine-spec.md`. Mum is the authority; never invent Kutchi; two AIs agreeing is not evidence.

## After a recording (folder `sources/audio/mum-YYYY-MM-DD/`)
1. Dry run (reads and measures only):
   ```
   node build/tools/ops/mumround.mjs sources/audio/mum-YYYY-MM-DD
   ```
   Per file: transcript, item list, what `--go` would cut; the clips' loudness against -16 LUFS; the engine check; the gap counts.
2. Item lists: `--draft-items` writes `<name>.items.draft.json` with the question ids and times it heard. Fill `id`, `kutchi`, `english` from what Zafar typed beside each question, never from a guess; rename to `.items.json`.
3. Run it (Whisper through the OpenAI API, needs `OPENAI_API_KEY`):
   ```
   node build/tools/ops/mumround.mjs sources/audio/mum-YYYY-MM-DD --go
   ```
   Clips cut, normalised, merged into `data/family-audio.json`; engine rebuilt; new gap counts printed.
4. Write the answers into `docs/language/grammar-notes.md`, `lexicon.md` and `build/lang/hand/` (each citing the recording and time), then re-run `node build/lang/import_all.mjs`.
5. Re-score: in `docs/language/grammar-kb.md`, re-mark the score sheet's needs the round answered (the rule is above it), move today's scores to "Before", then update the summary table and the vocabulary coverage.
6. Report `build/reports/mum-YYYY-MM-DD.md` in the 5 Oct shape: headline grammar, new words, the scores that moved, clips (none ear-checked yet), spellings to confirm as a "yes to all except …" list for Zafar.
7. Tell Zafar the clips wait for his ear in `lab/family-audio.html`. Every clip is `"approved": "game"` and plays in the game at once; his ear can drop a bad take (`redo`); a store build needs every clip re-recorded and `"final"` (`node build/tools/ops/storeaudio.mjs`; Zafar, 12 Nov).

## The one recording sheet (Zafar, 14 Nov)
There is **one** sheet, never a new round's file: `docs/language/recording-sheet.docx` (Word, tables: grammar first, then each game; its `.md` twin beside it), made from **`data/lang/recording-sheet.json`**, where every question is a row. It is only ever added to: a row is never deleted, renumbered or rebuilt in a new shape; an answered row stays, marked. When Zafar asks for the sheet, pull it from that source (regenerate, send the `.docx`); never rebuild it by hand.
```
node build/tools/ops/recordings.mjs        # adds what the engine needs (gap list, grammar slots, the day, parked words); moves rows on
node build/tools/ops/mumsheet.mjs          # adds the clash list's quick checks for Mum; prints the next sitting (grammar first)
node build/tools/lang/recording-sheet.mjs  # regenerates the .docx and .md from the source (both tools above do this too)
```
- **A new question by hand** (Zafar's feedback, a new game line): one JSON line in the source's `rows`, in the right section, with the next id (`G-NEG-07`, `CK-CHAI-93`), the English to ask, what it is for, `"status": "to record"` and its source; then regenerate. A new game gets a new section at the end of its group. The Kutchi column only ever holds what the family said, with `who`.
- **At the sitting** Mum says each row's ID before the line, so the item list's question ids (`qid`) are the rows' ids; after `--go`, `recordings.mjs` marks those rows recorded (date and clip ids). Mark a row `answered` (with the date and the grammar-notes section) when Mum answers a question that needs no clip, and `confirmed` when Zafar confirms a spelling.
- `checks.mjs` ("recordings") fails while the engine has a need the sheet lacks, or the two files are out of date.
