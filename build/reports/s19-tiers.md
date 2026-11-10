# s19-tiers: one tool per check tier, run by the process

Six thin wrappers in `build/tools/tiers/` (no check rewritten); settings in `tiers.json`; each has `--dry-run` and writes `build/reports/tiers/<tier>-<commit>.json` and `.md`.

| Tool | Runs |
|---|---|
| check-push (0) | `checks.mjs`; a pass on the commit is reused |
| check-prototype (1) | `labcheck.mjs` at the four sizes, page errors, a 40 s first-play film (`film.mjs`) |
| check-change (2) | games and rows from the diff (or `--games/--rows/--base/--brief`); scope audit; the game at the levels touched, 740x320 and 930x430, its rules, on this commit and the base's own tree; before\|after (`pairs.py`); rows red then green; an L1 film; extras |
| check-sprint (3) | since the last publish: changed games L1-L4 at four sizes; the rest at 1280x665; the sprint's probes and judge batches; beside chai on new art; films; extras; ONE fix list by game |
| check-publish (3b) | check-sprint's failed pages, changed games at 1280x665, `checks.mjs --full`, frozen, stamps; the known-fails list; `--go`: `publish.mjs --go` |
| check-live (4) | each changed game live at 740x320, a strip; on a failure the command that puts main back |

## Walk-through: a builder's hand-back to a publish

1. Any `git push` from Claude: the PreToolUse hook (`push-hook.mjs`) runs check-push; a fail refuses the push.
2. The builder's finish: its brief's FINISH line runs check-change `--brief`; the result goes in its report.
3. The session ends: `/checkin` reads that result; `/review` runs check-change `--brief` on its branch; exit 1 blocks the merge.
4. The last planned builder merged: `/sprint` runs check-sprint; its fix list is the fix-up. Each fix: `/review`, check-change `--base`.
5. `/publish` runs check-publish, then `--go`; `publish.mjs` refuses unless it passed on HEAD, then runs check-live. Decision 89's open-row rule is gone: open rows go into the known-fails list.

No step waits on memory, except: until `brief.mjs` writes the FINISH line, `/brief` adds it to each spec's `extra`. The change (not my file), in `brief.mjs` before `FINISH:`: `` `Before the report: COOK_TEST_PORT=${s.port} NJG_LOCK=/tmp/njg-browser-${s.port}.lock node build/tools/tiers/check-change.mjs --brief ${a.pos[0]}; it must pass; its result file goes in the report. ` + ``.

## Every audited check and its tier tool

| Check (`docs/process/check-audit.md`) | Tool |
|---|---|
| checks.mjs steps; static families; live leak bots; stdids | check-push (inside every tier) |
| load; parked leak bots (also on their files' change) | check-publish |
| screen lint, phaser, ratchet; contract 1-109; end reached, page errors | check-change, check-sprint, check-publish (contract-17: tier 5 `--store`) |
| row probes and their captures | check-change, check-sprint (`--collect/--apply`: the skills, after the judge) |
| frozen | check-change (shared or Cook change), check-sprint; check-publish reports |
| mount test; Cook leak bot | check-change, check-sprint |
| loadtime, panelcheck | check-change (their files); check-sprint via `audit.mjs` |
| audit.mjs: pillcheck, tapgate, lightfollow, spkgap, voicegate, labcheck | check-sprint, per Cook game; labcheck also check-prototype |
| `audit --standard`, sprintcheck | check-sprint (reports) |
| teachgate; word-card-taps; vessel-meta; hotspots | check-change and check-sprint by files |
| kitsheet, sidebyside | check-sprint (for Fable) |
| touched, regress; `brief.mjs --audit` | check-change |
| stamps; publishgate | check-publish; `publish.mjs` |
| check_onboard, speaker-taps, test_clinic_heal_a, test_cook.py, test_clinic.py | check-sprint (onboard also check-change): **report, not block** (FIX open; `tiers.json` says which) |
| feedbackcheck; the unpushed hook | `/feedback`; PostToolUse |
| gatecache, the lock, `--list` | inside the tools |
| shotdiff, check_clinic_kutchi, check_sidebar_fit | retired |

vessel-meta passes today: it blocks.

## Proof

- `node --test` tiers and publishgate tests: 16 pass (diff to games, levels, rows, extras, result files, gate, hook).
- `checks.mjs --only unit,static,words,specs`: all ok.
- Every `--dry-run` runs on this branch.
- check-change `--games chop --sizes 740x320`, for real: 0 contract breaks over 5 pages (base the same), 0 stuck, 0 page errors, before\|after pairs, a film. Its first try blocked on this report missing (docs check).
- The brief names no rows: no before or after run.
- cook:chop at four sizes: `CONTRACT PASSED: 0 breaks over 4 pages`, end reached, 0 page errors.

## Open

- The `brief.mjs` line above.
- check-change reports, not blocks, the sandbox's new layout findings (15 on chop, base the same).
