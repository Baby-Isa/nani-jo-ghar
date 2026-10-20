---
name: feedback
description: Turn Zafar's voice-note or play-test feedback into the full report CLAUDE.md asks for (every point with its timestamp, cause checked in code, fix, coverage table) and same-day regression rows. Use whenever Zafar sends a voice note or a transcript of feedback.
---
# /feedback: a voice note becomes a report and regression rows

**For:** the orchestrator. Every point gets a report line and a fix-list row the same day; the 1 Oct clinic report (`docs/archive/feedback/clinic-playtest-2026-10-01.md`) is the model.

## Steps
1. Transcript with times: `python3 build/transcribe_family.py <voice.m4a> <out.md>` (Whisper via the API), or use the one Zafar sent.
2. Skeleton:
   ```
   node build/tools/ops/feedback.mjs <part1.md> [<part2.md>] --name <mode>-playtest-<date>
   ```
   Writes `build/reports/feedback-<name>.md`: §1 mechanics changed and old art reused (blank), §2 every point (time, his words, screen; cause and fix blank), §3 draft regression rows with the next free ids, §4 coverage of every line.
3. The points are drafts: merge, split and re-word them; check every cause **in code** (file:line) and write the fix.
4. Fill §1 first: every mechanic changed (now → proposed) and every old art reused. Anything that removes or replaces a mechanic needs his explicit OK.
5. Coverage: every transcript line maps to a point or "chatter"; 0 unmapped.
5a. **Scope, at his strength.** For every point ask: one screen, or every game? Anything about a shared thing (pop-ups, cards, buttons, ticks, voice, bubbles, the end screen, characters, art swaps, "every game", "everywhere", "like in Cook") is a Shared row in his full words, with Check "auto: contract check every game", and goes on the contract list (`build/sandbox/lib/contract.mjs`, `regress.mjs` CONTRACT_ROWS) in the sprint that builds it. Never narrow, soften or merge his words; quote them in the row.
5a2. **Levels, for every station the point touches.** For each Cook station, recipe or clinic game a point names (or that shares the thing it names), the row lists **L1-L4 for each station touched** (Check: "auto: <station> at L1, L2, L3 and L4"), and the report's §3 names the levels played. A fix seen at one level is not a fix (SH-109, Zafar 17 Oct: "check all the levels of games when I give feedback").
5a3. **Told before: search the archive for every point.** Before a point becomes a new row, search the archive for it by its words and its screen: `grep -rniE "<two or three of his words>" docs/feedback docs/archive/feedback docs/process/regressions.md docs/archive/regressions-done.md`. A hit is a **told before** point: reopen that row (never a new one), quote the earlier line in the report, and mark the row so `/review` judges a shot of it (SH-116). §5 says why it slipped (a code reading marked it built, a one-game fix, a narrowed row...).
5b. **A second reader before the rows land.** A fresh Fable agent reads the transcript and your drafted rows only (not your reasoning) and returns every point it finds MISSING or WEAKENED (the S04 coverage audits are the model: `build/reports/s04-coverage-*.md`). Fix every one; the report's §4 records both readers: 0 unmapped, 0 weakened.
6. Put decisions to him as a numbered list with recommendations, "yes to all except …".
7. The gate first: `node build/tools/ops/feedback.mjs --check build/reports/feedback-<name>.md` must pass (every line mapped, every point's cause as file:line or "not code: ..."). Same day: add the checked rows to the fix list, `docs/process/regressions.md` (next free ID across it and `docs/archive/regressions-done.md`; one row per point; a status is the current state in a line, no history), then `node build/tools/review/statuscounts.mjs --write` for the status table.
8. Move the final report to `docs/feedback/<mode>-playtest-<date>.md`.

## Don't
Mark anything built here: rows from feedback start open or reopened; only the sprint check's judged evidence moves them.
Paraphrase away his words in §2; build anything before he answers.
