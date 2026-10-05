---
name: mum-round
description: Process a new round of Mum's recordings into clips, the family-audio manifest and the language engine, and build the next round's question sheet. Use when Zafar uploads a folder of Mum's voice files, or asks what to ask Mum next.
---
# /mum-round: from Mum's recordings to the engine, and the next sheet

**For:** language work. Rules: non-negotiables 4, 10, 11; G1, G16, G21, decision 40 (`docs/process/rules.md` §8). Mum is the authority; never invent Kutchi; two AIs agreeing is not evidence.

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
5. Report `build/reports/mum-YYYY-MM-DD.md` in the 5 Oct shape: headline grammar, new words, clips (none ear-checked yet), spellings to confirm as a "yes to all except …" list for Zafar (A5).
6. Tell Zafar the clips wait for his ear in `lab/family-audio.html` (only OK takes ship, G16).

## The next sheet
```
node build/tools/ops/mumsheet.mjs                     # counts only
node build/tools/ops/mumsheet.mjs --out "docs/language/mum-questions/Questions for Mum (Round N).md" --docx
```
Cook first, then the clinic; quick checks from the clash list; `--max` keeps a sitting near an hour. Read it once as Mum would; then add the round to `docs/language/mum-questions/README.md`. Zafar's own calls (clash list §3-6) go to him, not Mum.
