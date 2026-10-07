# S02-D: re-clip every family recording

**What changed.** New tools in `build/tools/audio/`. `transcribe.py` runs Whisper with word times in pieces of about 25 s and caches the results in `cache/`: 10 sources, 176 min, about **$1.06**. `reclip.py` finds every take of each line: Whisper text fuzzy-matched with aliases, the old clip as a seed, unheard takes next to heard ones, and lines that match a rival line better are left to that line. It sets onsets and offsets from the sound, labels the speaker by pitch calibrated per source (loudness breaks ties), scores each take, keeps at most 5 at or above the bar of 70, and cuts them with CLEAN and two-pass −16 LUFS (±1 dB). `review.html` is the phone picker. `apply_picks.mjs` applies the picks.

**Counts.** 552 clips (the other 250 manifest rows have no clip). 540 have candidates (1130 in total, 16 MB). **173 lines got a better, different take at rank 1.** Of the 60 lines Zafar marked redo, 56 now have a passing take; of the 141 hand-picked lines, 139 do. 8 current clips sound like the other voice.

**Record again (nothing above the bar):** zafar hi, aaki, bas!, Ha!, wadhare, hakri chamchi; mum hane kadh, tarela bataata, hakro bakro ba bakra, wadho ginech nindho ginech, firai chad, thorok wij.

**Proof.**
- matar: Mum's 1648.0 s take is rank 1, her 1697.5 s take is found, and the 1650 s take is labelled Zafar.
- Picker at 390×844: picking, copying and every audio link work, with no page errors.
- `apply_picks` dry run on 3 picks: exactly 3 entries change, and so does the real run, which was then reverted.
- `checks.mjs`: unit tests 229 pass. The word lint fails on 38 literals in `js/cook` and `js/clinic` (Sessions B and C's files, not mine).
- No page loads the new files. `touched.mjs` widens any `data/` file to all 57 flows, which is over the 15-minute cap, so no sandbox or shotdiff pass was run.

**Open.**
- The game ranks only `checked: "ok"` as approved, so `ok-zafar` clips are treated like unchecked ones (`js/shared/family-voice.js`, `conversations.js`). Teach both files `ok-zafar` before applying the picks.
- The 247 skipped rows were not searched.
