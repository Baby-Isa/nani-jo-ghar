---
name: brief
description: Write a complete brief for a new build session (mode, engine, art or tools work) from a small JSON spec. Use before launching any session, so every brief carries the standing lines and the regression rows for the screens it touches.
---
# /brief: a session brief from a spec

**For:** the orchestrator, before any `create_session`. Enforced by `brief.mjs` (required fields, owned files, no helpers, the overlap check) and CLAUDE.md the working agreement's Builders line; template `docs/process/session-brief-template.md`.

## Steps
1. Copy a spec: `build/tools/ops/specs/4e-clinic-engine.json` is the worked example. Fill name, model, effort and why, cost, stop (UK), branch, owns, readOnly, tasks (each `do` + `accept`), flows, port, report, publish.
   - Owned files must be disjoint from every running session's. Shared files have one owner.
   - A fix round: two builders at most, each owning both the code and the evidence specs (`build/sandbox/data/evidence.json` entries) of its own rows, so no tools builder chases them afterwards (Zafar, 20 Oct).
   - `flows` are sandbox flow ids (`clinic:heal-cut`, `cook:chai-tray` ...). Not sure? `node build/tools/review/touched.mjs --files <the files it will change>`.
2. Generate it:
   ```
   node build/tools/ops/brief.mjs <spec.json> --out <spec>.brief.txt
   ```
   It adds the read-first list, no helpers, don't remove mechanics, the proof steps (touched → shotdiff → regress → skeleton), the regression rows (via `regress.mjs`) and the finish rules.
3. Read the brief once, top to bottom: is every task's acceptance something you can check by looking?
4. Put the launch to Zafar: model and effort, cost estimate, stop time. Launch only on his go.
5. Launch: `create_session` with the brief as the prompt, `outcome_branch` = the integration branch. Log the launch with `/checkin --log`.

## Don't
- Hand-edit the generated standing lines: change the generator instead (`build/tools/ops/brief.mjs`).
- Brief a session to publish unless Zafar approved publishing: set `"publish": true` only then.
