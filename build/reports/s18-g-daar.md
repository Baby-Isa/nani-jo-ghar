# s18-g-daar: daar at chai's standard on the kits (Sprint 18, wave 2)

Opus, high. Daar keeps its chop, tadka and stir. The chop is now chop's own game. The other pieces run on the kits.

## What changed

| Commit | What |
|---|---|
| 51792266 | The gap page alone (`docs/design-language/standard/gaps/daar.md`, 205 rules) |
| 7684f241 | The chop runs as `Cook.Chop.play`. Play has a new `note` option, which reports each round's decoys (chop's game uses it too). The reveal lessons run before the first throw (DAAR-41). The word pop is `Juice.P.pop`, the shelf uses `Shelf.slots` and `St.classFit`, and places and sizes moved to `daar.json` `scene` |
| 64cff18f | DAAR-40: the chop opens its own step as its board starts. Her line is tagged as the step's call. When it is shown without being said, the call is logged as skipped. A wrong spice brings the hint at once (`Cook.Coach.wrong`) |
| (last) | The gap page rescored, this report, the overnight log |

**Copied kit code deleted (daar.js unless named):**
- daar's word pop, a copy of chai's old pop (about 18 lines)
- the shelf's slot sums (5)
- the chop's grading (12) and its CK-49 decoy note (6)
- the serve's dead "not quite" path with `orderLine` (16)
- the dial's code-drawn fallback icons (`tortoise`, `hare`, `splash`, about 45)
- chop's stopgap import in `mechanics/chop.js` (4)

The chop board stays the marble (ART-37).

## Proof

- Contract runs at 1280x665:
  - `cook:daar` L1-L4 and `cook:chop@L2`: 0 breaks, every end reached, 0 page errors (run `s18-g-daar-c3`).
  - The first run (c1) showed DAAR-40 as the chop's switch line ("Hane trae mirchi!", 7.7 s after the skip, no step open).
  - `cook:chop` L1 and L4: 0 breaks (run `s18-g-daar-c4`).
- `cook:daar@L2#mistake`: 1 break, contract-21. A wrong tap on a decoy jar was eaten while the old first-time coach lit lasan (`St.coach("daar-cook")` → `Cook.Coach.start`, its ghost rung). The base code shows the same rung on lasan; in its replay the tester tapped the right jar. The fix is the next step on the gap page (STD-D1-01, Adopt): move the cook phase onto kit (d)'s `Cook.Coach.firsts` / `.control` lights, which let taps through.
- `cook:chaat@L2` breaks contract-98 (no reveal lesson). That is chaat's own; this change does not cause it.
- The four sizes were not run (decision 5: one size per builder; the orchestrator runs all four at merge).
- `checks.mjs --only static,words,docs,load`: all pass. `load` is 29/29. `docs` fails only on other games' gap pages (samosa, sekelo, chaat).
- `node --test` on the cook harness, rules counts, shelf and chip words: 26 pass.
- No BEFORE run and no `evidence --after` (Zafar's decision 5).

**Gap page:** before 0:14, 1:37, 2:148, 3:4, dbd:2; after 0:14, 1:32, 2:151, 3:6, dbd:2.

## Asks (exact changes)

1. `js/cook/index.js` (orchestrator): `const DAAR = [M + "chop.js", "./stations/chop.js"];`. Daar never calls `tadka.js` or `stir.js` (STD-F4-03).
2. The chaat builder: call `Cook.Coach.lessons({gate: Cook.Coach.firsts("chaat", {round: new Set()}), ctx})` before the first step (contract-98 at L2). If chaat runs the chop mechanic, it should call `Cook.Chop.play(z, {..., note: true})`.
3. Decision for Zafar:
   - Two stirs exist: daar's own and the Stir tile's older `mechanics/stir.js`. The Stir tile could play daar's stir, with stir.js deleted.
   - A spice in the oil can't be taken back with a tap (STD-B2-10).

**QA checklist:**
- `checks.mjs`: unit has 4 fails, none in daar's files (three art-block tests need `sources/`; checkDocs trips on the other games' gap pages).
- static reports 3 known findings fixed: the list can shrink with `--write-known` (not mine to run).
- The leak bot and the judge were not run (wave 3).
