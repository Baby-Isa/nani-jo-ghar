# S02-D2: re-clip with blind listening checks

**What changed.** D's candidates are replaced. New tools in `build/tools/audio/`:
- `vad.py`: Silero VAD, split at pauses and where the voice changes. 6,032 utterances.
- `blind.py`: whisper-1 and gpt-4o-transcribe on each utterance, never told the target (no prompt, no language).
- `verify.py` and `blindmatch.py`: a take is kept only if both transcripts match the target, with these rules:
  - every word is heard and nothing else is (no filler, English, IDs, laughter or repeats);
  - the ending is right (chokro, not chokri);
  - the pitch gives the right speaker;
  - no rival line matches as well;
  - it is at most 0.6 s over the line's natural length.
  At most 5 per line, cut with CLEAN at −16 LUFS.
- `audit.py`: the third blind check.

**Counts.**
- 263 of 552 lines have 409 verified takes.
- 289 have none and come last in the picker under "Record again". 46 of those have a current clip that passes.
- One phone page holds all 552 lines (7.4 MB).
- API cost about $2.

**Proof.**
- amli has no 'Okay' clip; cup has no P-10 or P-11 clip.
- chulo and atto offer nothing: Mum only says them inside sentences.
- No take is over its natural length + 0.6 s.
- **Not met:** for matar, Mum's 1697.5 s take ranks 2nd behind her 1698.8 s take. The 1647.9 s take fails the blind check because Whisper hears "Peace".
- Audit of 30 random clips, 3 runs each: **0/30 contain anything but the target** by majority. One clip, mishkaki-ji-lakri, was flagged "laughing" in one run. Results are in `audit-69.json`.
- Picker at 390×844: no errors, and all 961 audio links resolve.
- `checks.mjs`: 229/229 tests pass and the word lint is clean.
- `check_onboard` is OK.

**Open.**
- No sandbox run: `touched.mjs` maps `data/` to all 57 flows, and no page loads these files.
- `loadcheck.mjs` doesn't exist yet.
- `regress --stdin` cuts piped input at 64 KB (a file redirect works).
- To listen to: matar 1697.5 s and mishkaki-ji-lakri.

QA: audio tools · Auto ✅ · LNG-12 built · no game files touched.
