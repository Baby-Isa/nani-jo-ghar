# s20-p3-gate: the blocking gate and the merge script

## What changed (new files only, in build/tools/tiers/)
- `gate-lists.json`: 92 blocking contract checks (every check with no break in s19-r2-gate; that is the 161 of 179 table rows) and 18 advisory (the ones that broke), each with a reason. The file says a check moves only with a line naming Zafar's written yes.
- `gate.mjs --game <g>[,<g>]` (`--game none` = tier 0 only): checks.mjs; the contract run of the games' flows (L1-L4, 740x320 and 1280x665, `--parallel 2`); the box gate for games with a box reference. One line per part with minutes, then `GATE PASS|FAIL ...; N min`. Fails on any blocking break, any page that does not reach its end, any page error, fewer pages than asked, or a check in neither list. Advisory breaks are printed, never failing. No known-failures list.
- `merge.mjs <branch>`: `git merge --no-commit --no-ff`, games from the merge's changed files (a shared change plays chai), gate on the merged tree, commit with the gate's line on pass, `git merge --abort` on fail. Never pushes.
- Tests: `gate.test.mjs` (a check in both lists or neither fails; blocking vs advisory; incomplete pages) and `merge.test.mjs` (stub gate in a scratch repo: pass merges with the line in the message, fail aborts and leaves the tree as it was). 7 pass.

## Proof (not finished: the orchestrator runs it)
- Told to stop by the orchestrator: the machine was shared with other builders (load 10-14), so no run was "alone".
- One full gate run on chai (not alone, p5 ran boxes jobs beside it): **GATE FAIL chai-tray: checks pass 2.4, contract FAIL 27, boxes FAIL 3.9; 33.2 min.** Gate logs: build/screenshots/gate/gate-20261113T1909-chai-tray/.
  - Blocking contract breaks: contract-112 (light-picture) at cook:chai-tray@L3#hint 1280x665 (hint-nani-says) and lab:cook/chai-tray@L4 740x320 (order-card-in-sidebar); contract-104 (card-pic) "elchi" picture did not load, lab:cook/chai-tray@L4#child 1280x665 (may be load); contract-116 (card-pad) "aako" cut by its row, lab:cook/chai-tray@L4#child at 1280x665 and 740x320 (chai-tray-kind-timing).
  - Box gate: 6/8 pages identical; L4@740x320 light-1 moved 0.7 px; L4@930x430 shelf and light boxes moved 0.2-2 px (diff sheet build/screenshots/boxes/gate-20261113T1909-chai-tray-chai-tray/diff-chai-tray.html).
  - Advisory breaks printed, not failing: contract-72 x2, -36 x2, -113 x1.
  - Nothing was moved to advisory.
- A second run was started and stopped at the orchestrator's word; no result.
- The real refusal test was not run (needs the browser): recipe: a throwaway branch off this one adding to css/shared/order-card.css `.oc-card.oc-s14 .oc-row14 > .oc-row.oc-it14:first-child { transform: translate(-6cqi,-14cqi); position: relative; z-index: 9; }` (a card over a face), then `node build/tools/tiers/merge.mjs <branch> --game chai-tray`. The unit test covers the refuse and merge logic with a stub gate.
- A bug found on the way and fixed: passing NJG_LOCKED to the parts failed checks.mjs's lock test; the gate no longer passes it.

## Open
- Two passing runs on chai, the refusal, check-change tier 2 and the contract replay at four sizes: waiting for a free machine.
- chai is not at zero on 3 blocking checks and the box gate (above); fixing is not in this brief.
