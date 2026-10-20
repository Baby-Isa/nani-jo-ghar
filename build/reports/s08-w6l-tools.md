# s08-w6l-tools

Branch `worktree-agent-ac4ac496a4b68b32a`. Game code changed: no (build/sandbox and build/tools/review only).

## What changed
- **Sheets:** strips wrap to 2-4 frames a line by crop width (each frame read at 290-580 px, not 90-140), sheets split by height, hit times on the captions, cmd output keeps 120 lines. New `js:<Global.path>` capture (MAA-17's `Cook.maaniWindow`).
- **Drivers:** `mistake-real` (the heal mistake player at real pace: CLN-107 at L3, CLN-194), a moment before the wrong item goes in (CHT-14), the slip tried again as a move is chosen (CLN-107 L2), `line:<who>-<who>` and calls inside `at(...)` reachable.
- **heal-marks.mjs:** one block per game, all 12 (fever, numbers fixed).
- **collect:** a text-only PASS that opens with its capture label (a script's command) stands, tested; on the last run SH-115, CLN-172, LNG-04 are accepted.
- **Contracts:** 26 (tap-through fold, to-record lines; find and dress pass), 3 (clip to its line by id), 35 (daal chop card at L4, #hint), 30 (`[data-howto]`), each with a test.
- **Specs:** all 14 EVIDENCE rows rewritten, CLN-198 and LNG-17 added, plus SH-117, SH-98, CLN-179, CLN-106 for waves 6I and 6J.

## Open
- One `DRIVERS` entry added in `catalog.mjs` (`mistake-real`).
- CLN-194's shake (360 ms) falls between frames (about 300 ms apart); the red flash shows.
- CLN-179 shows 7 of 8 wraps (the last step closes first).
- SEK-07 L4 timed out once in a run, passed on rerun.
- The full touched set was not run (evidence.json touches every flow).

## Proof
| Check | Run | Result |
|---|---|---|
| All 19 rows plus SH-117, SH-98, CLN-179, CLN-106 | `evidence.mjs --run`, runs w6l-c to w6l-n | 0 tool failures, sheets read |
| collect on ev-20261020-030207-6zl | copied run | SH-115, CLN-172, LNG-04 accepted, 0 refused (data reverted) |
| contract 26 on mode:find, mode:dress | sandbox `--contract` | 0 breaks |
| `checks.mjs` | all | ok |
| unit tests | `node --test` | 146 pass |
