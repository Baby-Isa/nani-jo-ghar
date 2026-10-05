---
name: brief
description: Write a complete brief for a new build session (mode, engine, art or tools work) from a small JSON spec. Use before launching any session, so every brief carries the standing lines and the regression rows for the screens it touches.
---
# /brief: a session brief from a spec

**For:** the orchestrator, before any `create_session`. Rules: A24, B3, B4, B17 (`docs/process/rules.md` §2); template `docs/process/session-brief-template.md`.

## Steps
1. Copy a spec: `build/tools/ops/specs/4e-clinic-engine.json` is the worked example. Fill name, model, effort and why, cost, stop (UK), branch, owns, readOnly, tasks (each `do` + `accept`), flows, port, report, publish.
   - Owned files must be disjoint from every running session's (B2). Shared files have one owner.
   - `flows` are sandbox flow ids (`clinic:heal-cut`, `cook:chai-tray` ...). Not sure? `node build/tools/review/touched.mjs --files <the files it will change>`.
2. Generate it:
   ```
   node build/tools/ops/brief.mjs <spec.json> --out <spec>.brief.txt
   ```
   It adds the read-first list, no helpers, don't remove mechanics, the proof steps (touched → shotdiff → regress → skeleton), the regression rows (via `regress.mjs`) and the finish rules.
3. Read the brief once, top to bottom: is every task's acceptance something you can check by looking?
4. Put the launch to Zafar: model and effort, cost estimate, stop time (A11, A12). Launch only on his go (A1, A2).
5. Launch: `create_session` with the brief as the prompt, `outcome_branch` = the integration branch (B5). Log the launch with `/checkin --log`.

## Don't
- Hand-edit the generated standing lines: change the generator instead (`build/tools/ops/brief.mjs`).
- Brief a session to publish unless Zafar approved publishing (B20): set `"publish": true` only then.
