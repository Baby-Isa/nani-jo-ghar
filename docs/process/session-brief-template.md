# Session brief template

Use this for every build session. The rules it draws on are in `process/rules.md` §2 (sessions, agents and git); this file links to them by ID instead of restating them: **B3** (no helper sessions), **B4** (every brief is complete), **B17** (a mode session edits only its own files), **B6** (one report, one push), **C8** (fast checks only), **A24** (what a brief names).

## Generate it, don't type it

`node build/tools/ops/brief.mjs <spec.json> --out <file>` writes the brief from a small JSON spec and adds the standing lines: the read-first list, no helpers, don't remove mechanics, the proof steps, the regression rows for the flows it touches, and the finish rules. The spec fields are in the script's `--help`; a worked spec is `build/tools/ops/specs/4e-clinic-engine.json`. The generator is the truth: if this file and its output disagree, the output wins and this file gets fixed. The `/brief` skill runs it.

## What every brief names

A remote session can't be messaged, so the brief must be complete; to redirect a session, interrupt it and relaunch (B4).

```
SESSION NAME / MODE, MODEL AND EFFORT (and why), COST ESTIMATE, HARD STOP (UK time), BRANCH

READ FIRST (in this order):
  1. CLAUDE.md
  2. docs/archive/process/rules-2026-10-13.md: the sections listed (default 2 and 3)
  3. docs/process/qa-checklist.md
  4. docs/status.md ("Next chat")
  5+. the mode doc and design-language docs it touches (named in the spec)

FILES THIS SESSION OWNS (edit only these) · READ-ONLY (never edit) · SHARED PIECES NEEDED BUT MISSING (a marked stub, B17)
DO NOT remove or replace any mechanic or mini-game Zafar hasn't commented on. NO helper sessions (B3).
PERMISSIONS NEEDED UP FRONT
TASKS (numbered, each with its acceptance criterion)
PLACES (for a spec naming `elements`: kitmap.mjs, every file:line that draws or styles each)
REGRESSION ROWS TO RECHECK (the rows the tasks name, plus the open rows of the elements named; never a flow's whole list)
PROOF (the one loop, docs/architecture/evidence-loop.md "The one loop (S13)"): checks.mjs and the unit tests; the before was played at launch; `evidence.mjs --after --brief <spec>`; the flows' contract run at 1366x768 and 915x412; kitsheet.mjs --after for named elements; no frames of its own, and the report lists only the after folder
TESTS: browser tests on the session's own lock and COOK_TEST_PORT (`/tmp/njg-browser-<port>.lock`, NJG_LOCK for the evidence tools)
GIT and FINISH: build/reports/<id>-<topic>.md (under 300 words), the QA checklist results, commit the branch (builders never push; the orchestrator merges).
  Only a session the brief marks `publish` ends with bump_version and one push to main.
```
