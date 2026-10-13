# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (13 Oct 2026, ~late UK):** Sprint 5 is live on `main` (8559d610). Zafar hasn't played it yet. Tonight the docs were cut down (decision 99, "the reset"), on branch `ccr-a7370759-t0lee7`; nothing new is on `main`.

**What the reset did:**
- **The fix list** (`docs/process/regressions.md`) holds only the genuine things to fix: 70 open or reopened, 5 waiting (art, Mum, Sprint 6), plus the 15 keep rows. 368 built, fixed or retired rows are in `docs/archive/regressions-done.md`. The tools read both, so those rows are still checked; one that fails again moves back by itself (`evidence.mjs --apply`).
- **The rulebook and decisions 1–99 are retired to `docs/archive/`.** Their content lives in the design docs (35 rules and 18 decisions were moved there word for word tonight) or in the checks. The 22 rules that should be code are in `docs/process/checks-to-build.md`, ranked, with their text kept until each check exists. `docs/decisions.md` is now a one-line log.
- **CLAUDE.md** now covers: the fix list, done meaning an independent picture, one or two sessions, small fixes in this chat, keep it small. **`docs/tools.md`** lists every tool, **`docs/questions.md`** holds every open question, and **`.claude/agents/judge.md`** is the judge.
- **`docs.mjs`** (inside `checks.mjs`) fails on any doc past its limit, a done row left in the fix list, a history chain in a row, or a duplicate ID.
- 373 old reports and 47 old docs (the old feedback reports, sources, Mum rounds 1–4, old sprints, the s02/s03 art plans, the rulebook and decisions 1–99) went to the archives. The live docs dropped from about 487k words in 113 files to about 253k in 66.
- Checks: unit 295 pass, words, bump, specs, docs all green. The tool tests are green too.

**Next steps, in order (decision 100: Zafar won't play this sprint; Opus orchestrates):**
1. **Zafar answers `docs/questions.md`** (A–G first, then 1–25; "yes to all except …"). Each answer goes into its doc or check plus a log line; the question leaves the file.
2. **Sprint 6, in the orchestrator's chat (Opus), one session at most for big pieces:**
   - **Rows:** triage the 70 open rows into code / art / Mum / Zafar (about 40 are code), then fix the code ones one mode at a time, red then green, the `judge` agent passing each picture. Art, Mum and Zafar rows go to him as one list.
   - **Checks:** build every check in `docs/process/checks-to-build.md` that code can do, top three first (red-then-green gate, publish gate, zero tolerance for clipped or scrolled text); each one's rule text leaves the file when it lands.
   - **Docs:** finish the cut-down: `find-it.md` (28k words: keep the current design, archive the three old passes); `ideas.md` to one line per idea; `art-plans/` to what the next clinic art run needs; `qa-checklist.md` trimmed where a check now covers a line; old one-off `build/*.py` cut scripts and old `build/tools/ops/specs/` to an archive folder; the inline rule IDs in the skills; word limits in `docs.mjs` for the mode and design docs.
   - Close: `/review`, publish (this branch with the reset), Zafar plays then.
3. **Measure** `/context` in the new chat after the starting prompt (13 Oct: ~60k fixed + ~3k reads; `docs/process/cost-and-speed.md`).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Branch `ccr-a7370759-t0lee7` (`main` = 8559d610, Sprint 5 live). First task: take my answers to `docs/questions.md` if I've given them, then open Sprint 6 (step 2) with a budget; Opus orchestrates; tell me before launching anything new.

---

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 4 | 66 |
| Cook: pantry | 2 | 13 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 2 / 0 / 7 / 0 / 0 / 2 / 9 | 16 / 14 / 15 / 11 / 19 / 14 / 18 |
| Clinic | 30 | 115 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 1 |
| Art | 6 | 9 |
| Language and audio | 7 | 5 |

---

## What is live (the game on `main`)

Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
