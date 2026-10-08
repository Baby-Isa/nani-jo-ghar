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
5a. **Scope, at his strength (decision 78).** For every point ask: one screen, or every game? Anything about a shared thing (pop-ups, cards, buttons, ticks, voice, bubbles, the end screen, characters, art swaps, "every game", "everywhere", "like in Cook") is a Shared row in his full words, with Check "auto: contract check (decision 75) every game", and goes on the contract list (`build/sandbox/lib/contract.mjs`, `regress.mjs` CONTRACT_ROWS) in the sprint that builds it. Never narrow, soften or merge his words; quote them in the row.
5b. **A second reader before the rows land (decision 78).** A fresh Fable agent reads the transcript and your drafted rows only (not your reasoning) and returns every point it finds MISSING or WEAKENED (the S04 coverage audits are the model: `build/reports/s04-coverage-*.md`). Fix every one; the report's §4 records both readers: 0 unmapped, 0 weakened.
5c. **Old feedback coming back.** If a point repeats an earlier row, the row is **reopened** (not a new row), and §5 of the report says why it slipped (a code reading marked it built, a one-game fix, a narrowed row...).
6. Put decisions to him as a numbered list with recommendations, "yes to all except …" (A5).
7. Same day: add the checked rows to `docs/process/regressions.md`, then `node build/tools/review/statuscounts.mjs --write` for the status table.
8. Move the final report to `docs/feedback/<mode>-playtest-<date>.md`.

## Don't
Mark anything built here: rows from feedback start open or reopened; only the sprint check's judged evidence moves them (decision 76).
Paraphrase away his words in §2; build anything before he answers (A1).
