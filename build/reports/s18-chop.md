# s18-chop: chop as its own game on the kits (Sprint 18, wave 1)

Opus, high. Chop is now its own game: its settings file, its own mechanic, everything else a kit call; daar and chaat can call it.
Its gap page came first (`docs/design-language/standard/gaps/chop.md`, every House and Family rule on the proof scale with its next
step), committed alone before any build.

## What landed (commit, call)

| Commit | What | Call |
|---|---|---|
| 36e0530e | The gap page (205 rules: `audit.mjs --standard chop` plus a read of chop's code) | - |
| f38ff327 | The game: `data/stations/chop.json` (its order as a recipe, its level rows), `js/cook/stations/chop.js` (the Chop tile's round), the mechanic's fixes | `Cook.Chop.play(z, params)` -> `{cut, got, wrong}`; `Cook.Chop.settings()`, `Cook.Chop.knobs(level)` |
| 0ca9c415 | Each thing to chop its own sentence ("Muke ba dungri khape.", the engine's Need frame), L4 tuned, decoys noted per round | - |
| b40347af | The strip on kit (d)'s first-time gate (`Cook.Coach.firsts`), the stuck hint on kit (e)'s helper card, the gap page rescored | - |

The mechanic's changes reach daar's chop too (it runs the same mechanic): DAAR-37 (kinds 1-4, chops 2, 4, 6, 8, each 1-3, from
the settings' recipe), DAAR-38 (the round ends on the last wanted chop; the ring still ends a short one), DAAR-36 (the board says
the "no" last; the decoys and the L4 lookalike from the central rules), DAAR-39 (the first time: the knife's strip, the kit's
light and finger, one planted vegetable cut and not counted, the knife inert until it ends; the old ghost loop is gone),
STD-D4-01 (a row ticks at its count at every level), STD-B3-02 (one past the count adds nothing), the stuck hint (STD-D2-02, -04,
-05). The board is the white marble (decision 7's placeholder) until ART-37. Missing Kutchi shows grey ("Chop these").

## Asks (files I don't own; exact changes)

1. `js/cook/index.js` (orchestrator): `chop: [M + "chop.js", "./stations/chop.js"],` and
   `const DAAR = [M + "chop.js", "./stations/chop.js", M + "tadka.js", M + "stir.js"];`. Then the stopgap line at the end of
   `js/cook/mechanics/chop.js` (`if (!...) await import("../stations/chop.js");`) can go.
2. `data/rules.json` count.games: `"chop": {"most": 8, "what": "the kinds to chop (x) and the chops in all (y)", "x": {"1": 1, "2": 2, "3": 3, "4": 4}, "y": {"1": 2, "2": 4, "3": 6, "4": 8}}` (the recipe already reads `{"rules": "chop"}`).
3. `build/sandbox/data/games.json` games.chop: add `"decoys": "exact"` (contract-37; the game notes each round's decoys, `room:` when the six vegetables run out).
4. Kit (e) / `js/cook/order.js` O.ladder: on the s14 look (`Rules.noLast()`), put the `nos` rows at the end of `home`'s last group instead of `sprinkle` (B1-04: the order card said "dungri na" second at L2).
5. `js/cook/recipes.js` R.countOf: `case "chop": return sum(d.chops);` (the lab's order-count note).
6. Later: `data/cook.json` mechanics.chop's base knobs into `data/stations/chop.json` (STD-F2-03), and a chop section on the kitchen-kit lab page.

## Proof

PROOF_PLACEHOLDER

## Waits

ART-37 (the board), Mum (garlic, "Chop these", "Muke X khape" lines), Zafar (kinds 1-3 at L1-L3 are Claude's reading; the swipe
against principle 5: STD-02-03 different by design, to confirm), wave 2 (daar and chaat onto `Cook.Chop.play`).

Cost: about $25.
