# S02-D: re-clip every family recording

**What changed.** New tools in `build/tools/audio/`:
- `transcribe.py`: Whisper with word times, cached in `cache/`. 10 sources, 176 min, **$1.06**.
- `reclip.py`: finds every take of each line (fuzzy text with aliases, the old clip as a seed, unheard takes next to heard ones, rival lines win their own takes). It sets cut points from the sound, labels the speaker by pitch calibrated per source (loudness breaks ties) and scores each take. It keeps at most 5 at or above the bar of 70 and cuts them with CLEAN and −16 LUFS (±1 dB).
- `review.html`: phone picker.
- `apply_picks.mjs`: applies the picks.

**Counts.** 552 clips (the other 250 manifest rows have no clip); 540 have candidates (1130 in all). **173 lines got a better, different take.** Redo lines: 56 of 60 now pass. Hand-picked lines: 139 of 141 pass. 8 current clips sound like the other voice.

**Record again:** zafar hi, aaki, bas!, Ha!, wadhare, hakri chamchi; mum hane kadh, tarela bataata, hakro bakro ba bakra, wadho ginech nindho ginech, firai chad, thorok wij.

**Proof.**
- matar: Mum's 1648.0 s take is rank 1, her 1697.5 s take is found, and 1650 s is labelled Zafar.
- Picker at 390×844: picking, copying and all audio links work.
- `apply_picks` on 3 picks changes exactly 3 entries (dry run and a real run, reverted).
- `checks.mjs`: 229 unit tests pass. The word lint fails on B and C's `js/` files.
- No page loads the new files. `touched.mjs` still lists all 57 flows for any `data/` file, which is over the 15-minute cap, so no sandbox run.

**Open.**
- The game treats `ok-zafar` like an unchecked clip (`js/shared/family-voice.js`, `conversations.js`). Teach both files `ok-zafar` before applying the picks.
- The 247 skipped rows were not searched.
