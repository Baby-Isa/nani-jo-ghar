# Sprint 1 review (orchestrator `/review`, 6 Oct 2026)

**Scope:** everything since the step 3 gate (80457c3): Cook, the clinic, the parked modes, the house and first launch, at every size (`--gate`, run `review-s01`, 493 pages).

## Result
- **490 of 493 pages reach their end, 0 page errors; 1,697 baseline findings fixed.**
- **Failed on 11 new findings + 2 stalls**, all fixed by F2 (`f2-review-fixes.md`):
  1. Greeting choice pills over the play area at 800x360 (cook:day2, day6, open-kitchen): now one low row on short phones.
  2. Three canvas words at 13.5 px at 800x360 ("khun", "chai", "mishkaki"): floored at 14 px at source (`Cook.Kit.textFloor`).
  3. Two spacing-grid slips on the speaker margins (css/cook.css): on the grid.
  4. clinic:heal-knee#hint and heal-ear#hint timed out: did not reproduce; a late first-time help could block a tap, now built when the help starts.
- **Re-check** (run `review-s01-recheck`, the touched flows at 800x360 and 1024x768): **CHECK PASSED**, 0 new findings, both #hint flows end, 112 fixed.

## Looked at, flaws first
- Day 6 greeting at 800x360 (before F2): pills over the counter (fixed). The guide box shows "Cook it the way they said." as a grey "to record" placeholder (rule 4 allows it until Mum records the line). The "oh dear!" the lint caught is hidden gloss text, not shown to the child.
- Shelf chip labels still look small at 800x360 (baselined, open row).
- Open: Cook's title, day and shop screens are still Cook's own (the shell lacks them, `c4-cook-host.md`); the art redo list (O2 spots, U1, framing) waits for the next art run.

## Regression rows
The shared and Cook/clinic rows touched by Sprint 1 were rechecked through the run's findings; no fixed row came back. Open rows by area: `docs/status.md` (statuscounts.mjs).
