---
name: feedback
description: Turn Zafar's voice-note or play-test feedback into the full report CLAUDE.md asks for (every point with its timestamp, cause checked in code, fix, coverage table) and same-day regression rows. Use whenever Zafar sends a voice note or a transcript of feedback.
---
# /feedback: a voice note becomes a report and regression rows

**For:** the orchestrator. Rules: A5, A6, D10 (the report), A18, A19 (rows the same day) (`docs/process/rules.md` §1); the 1 Oct clinic report (`docs/feedback/clinic-playtest-2026-10-01.md`) is the model.

## Steps
1. Transcript with times: `python3 build/transcribe_family.py <voice.m4a> <out.md>` (Whisper via the API), or use the one Zafar sent.
2. Skeleton:
   ```
   node build/tools/ops/feedback.mjs <part1.md> [<part2.md>] --name <mode>-playtest-<date>
   ```
   Writes `build/reports/feedback-<name>.md`: §1 mechanics changed and old art reused (blank), §2 every point (time, his words, screen; cause and fix blank), §3 draft regression rows with the next free ids, §4 coverage of every line.
3. The points are drafts: merge, split and re-word them; check every cause **in code** (file:line) and write the fix.
4. Fill §1 first: every mechanic changed (now → proposed) and every old art reused. Anything that removes or replaces a mechanic needs his explicit OK (A4).
5. Coverage: every transcript line maps to a point or "chatter"; 0 unmapped.
6. Put decisions to him as a numbered list with recommendations, "yes to all except …" (A5).
7. Same day: add the checked rows to `docs/process/regressions.md`, then `node build/tools/review/statuscounts.mjs --write` for the status table.
8. Move the final report to `docs/feedback/<mode>-playtest-<date>.md`.

## Don't
Paraphrase away his words in §2; build anything before he answers (A1).
