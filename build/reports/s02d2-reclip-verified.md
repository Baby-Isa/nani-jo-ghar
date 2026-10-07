# S02-D2: re-clip with blind listening checks

**What changed.** D's candidates are replaced entirely. New tools in `build/tools/audio/`:
- `vad.py`: Silero VAD (onnx, no torch), split at 0.18 s pauses and wherever the voice changes. Result: 6,032 utterances.
- `blind.py`: two blind transcriptions per utterance (whisper-1, gpt-4o-transcribe), with no prompt, no language and no target. Cached in `cache/blind.json`.
- `blindmatch.py` and `verify.py`: a take is kept only if both transcripts match the target, with these rules:
  - every target word is heard and nothing else is (no filler, English, IDs, laughter or repeats);
  - the ending matches (chokro, not chokri);
  - the pitch says it's the right speaker, with at most 20% of the voice sounding like the other speaker;
  - no other line's text matches it as well;
  - it is at most 0.6 s longer than the line's natural length.
  At most 5 per line, cut with CLEAN at −16 LUFS.
- `audit.py`: the third blind check (below).

**Counts.** 263 of 552 lines have 409 verified takes. 289 have none and are listed at the end of the picker under "Record again". 46 of those 289 have a current clip that passes. All 552 lines fit in one phone page (`pack_pages.py`, 7.4 MB). Cost about $2 in API calls.

**Proof.**
- amli has no 'Okay' clip and cup has no P-10 or P-11 clip.
- chulo and atto offer nothing: Mum only says them inside sentences, so they go on the record-again list.
- No take is over its natural length + 0.6 s (longest 2.05 s).
- matar falls short of its check: rank 1 is Mum's 1698.8 s take and her 1697.5 s take is rank 2. The 1647.9 s take fails the blind check because Whisper hears 'Peace'.
- Audit of 30 random clips, each asked 3 times: **0/30 hold anything but the target** (by majority vote). One clip, mishkaki-ji-lakri, was flagged in a single run ("laughing"). Table: `audit-69.json`.
- Picker checked at 390×844: no errors, all 961 audio links resolve, picking works.
- `checks.mjs`: 229/229 tests pass and the word lint is clean.
- `check_onboard` is OK.

**Open.**
- `touched.mjs` lists all 57 flows for any `data/` file, so I ran no sandbox, as D did. No page loads these files.
- `loadcheck.mjs` doesn't exist yet.
- The `regress --stdin` pipe cuts its input at 64 KB. Redirecting the input from a file works.
- Listen to the start of matar 1697.5 s and the end of mishkaki-ji-lakri.

QA: audio tools · reviewer: none yet · Auto: checks ✅ check_onboard ✅ · LNG-12 built · AUD/LNG unchanged (no game files touched).
