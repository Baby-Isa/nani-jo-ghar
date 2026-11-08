# s18-w3-chop: chop opens its step before it speaks; chaat calls chop as its own game (Sprint 18, wave 3)

Opus, high. Commit `df51c907`.

## What changed

- `js/cook/stations/chop.js`: `Cook.Chop.play` opens the chop's step (`PlayLog.step("chop")`) as the board starts when the order
  was already heard or skipped, before the knife, Nani's card and the throws; daar, the Chop tile and chaat all get it.
  `Mech.define("chop-game", {station: "chop", view: "marble"})` runs the game through `play()` (its numbers, the rules' decoys
  with the first try's note, its step) and returns what was cut.
- `js/cook/mechanics/chop.js`: new `stepOpen` param; the mechanic opens the step itself only when its own pop-up came first.
- `data/cook.json`: chaat's chop step `"do": "chop-game"`; `mechanics.assemble.levels[0].flyMs` deleted (chaat.json has it).
- `js/cook/index.js`: `PARTS["chop-game"] = PARTS.chop`.
- `a0f963c0`: chop-game throws the rules' decoys exactly (`exactDecoys`); contract-37 at recipe:chaat L1 (two kinds, two decoys)
  was new with chop-game (608f531e passes). Now 1/2/3/4 (run c3: L1 two kinds, one decoy). Daar keeps "at least".

## Proof

- First red: `cook:chaat` L2-L4 at 1280x665 on the integration branch played green four times (the skip always fell before
  the step opened), so the old break did not reproduce; the fix moves the step to the board's start anyway.
- Contract `cook:chaat` L1-L4, `cook:chop` L1-L4, `cook:daar` L1, L4 at 1280x665 (run `s18-w3-chop-c1`):
  `CONTRACT PASSED: 0 breaks over 10 pages`, every end reached, 0 page errors. Chaat now notes its chop's decoys (1-4, lookalike at L4).
- `loadcheck --only cook:chop,cook:daar,cook:assemble,cook`: 4/4 ok.
- `checks.mjs`: static, words, leak, bump, specs, docs, fixlist, recordings ok; unit 744 pass, 3 fail (the art-block tests: no `sources/`).
- No BEFORE and no evidence run (orchestrator's override); one size only.

## Ask

Done by the orchestrator (flow.js maps chop-game to chop; chop-game's view back to wood).
