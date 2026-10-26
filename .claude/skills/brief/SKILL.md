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
   It adds the read-first list, no helpers, don't remove mechanics, the one loop's PROOF (`docs/architecture/evidence-loop.md` "The one loop (S13)": checks, `evidence.mjs --after --brief`, the flows' contract run at 1366x768 and 915x412, no frames of its own), the rows its tasks name plus the open rows of its `elements`, PLACES for those elements (`kitmap.mjs`) and the finish rules.
3. Read the brief once, top to bottom: is every task's acceptance something you can check by looking?
3b. At launch, play the rows BEFORE: `COOK_TEST_PORT=<port> NJG_LOCK=/tmp/njg-browser-<port>.lock node build/tools/review/evidence.mjs --before --check --brief <spec.json>`, then one `judge` call on its `judge/check-NN.md` and `--collect --run-id <before run>`. A probe fault (EVIDENCE) is fixed before the builder starts; a row with no probe refuses the brief.
4. Put the launch to Zafar: model and effort, cost estimate, stop time. Launch only on his go.
5. Launch: `create_session` with the brief as the prompt, `outcome_branch` = the integration branch. Log the launch with `/checkin --log`.

## Don't
- Hand-edit the generated standing lines: change the generator instead (`build/tools/ops/brief.mjs`).
- Brief a session to publish unless Zafar approved publishing: set `"publish": true` only then.
