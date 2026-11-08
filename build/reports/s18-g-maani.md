# s18-g-maani: maani on the kits (Sprint 18, wave 2)

Opus, high. Maani keeps its own mechanic: the roll to the gold ring, the tawa's flip and lift, the knob, the plates. Everything
else is now a kit call. Its gap page came first and was committed alone.

## What changed

| Kit | Before (maani's own code, deleted) | Now |
|---|---|---|
| (a) worktop | a 0.5 page-colour wash and a panel-colour band drawn with `INK` literals | `Kit.worktop`, `St.stoneBand` (the stone, no ledge) |
| (b) serve | its own `for (;;)` tick-and-recast loop (about 75 lines) | `NjgServe.round`: each kind checked, extras taken away, the third try shown |
| (c) pop | `wordPop`'s card, text and speaker drawn in maani | `Juice.P.pop` |
| (d) lights | no reveal lessons (contract-98 broke at L2-L4) | `Cook.Coach.firsts` and `.lessons` before the first pile; a wrong tap calls `Cook.Coach.wrong` and the step's help (STD-D2-04) |
| (e) order | the face tap called `UI.mission.replay` | `UI.personSay` (falls back to the replay) |

Pass-me's calls are gone (`maani-line.js`, `tawa.js`). The roll ring's colours now come from the tokens.

## Proof

- Commits: `5beae6bb` (the gap page), `6d857642` (the build), and this report with the rescore.
- Contract: `cook:maani-line,cook:roll-tawa` at 740x320, 930x430, 1280x665, 1920x1080 gave `CONTRACT PASSED: 0 breaks over 8
  pages`. Every end was reached, with 0 page errors. Folder: `build/screenshots/sandbox/s18-g-maani-contract/`.
- Contract: L1-L4, #mistake and @L4#mistake at 1280x665 gave `CONTRACT PASSED: 0 breaks over 6 pages`. Before the build the
  same run had 3 breaks, all contract-98.
- The gap page went from 11 at 0, 26 at 1, 162 at 2, 3 at 3, 3 dbd to 11 at 0, 19 at 1, 168 at 2, 4 at 3, 3 dbd.
- Checks: `static` ok (0 new; the 2 roll.js literals are fixed, so the known list can shrink), `words` ok, `docs` ok.
  `test_cook_levels`, `test_cook_harness`, `test_cook_rules_counts`, `test_shared_rules` and `test_shared_order_card` pass.
  `test_cook_words` G26 fails on `js/cook/mechanics/boil.js:508` (kit code, not mine). `loadcheck --only cook:maani-line,cook:roll-tawa`:
  "1/1 pages load only what's on their screen" (52 pictures; roll-tawa has no load page).
- No BEFORE run and no evidence --after (decision 5). The judge has not seen it.

## Asks

1. **Zafar (STD-B2-05):** the flip's green at L4 is 1.54 s (side 1) and 1.48 s (side 2), under the 2 s floor. In
   `data/stations/maani-line.json`, `flipAddS` 0.75 → 1.3 gives 2.72/2.50/2.23/2.09 s and 2.61/2.40/2.14/2.03 s. Then
   `build/test_cook_levels.mjs` MAA-17 should assert `add === 1.3` and `old + add` in place of `0.75`. I didn't make the change:
   the test pins his 17 Oct number.
2. **Orchestrator:** `node build/tools/review/checks.mjs --only static --write-known` (2 roll.js findings fixed). In
   `data/cook.json` `mechanics.tawa.levels[0]`, delete `"passMeAfterMs": 1500`, because nothing reads it now.
3. **Kit (a)'s owner:** `boil.js:508` reads `Cook.data.lines` directly, which trips G26. Fetch the line through `Cook.Lang`
   instead (test_cook_words).
4. **Decisions for Zafar (gap page):** B2-04 (should an early flip refuse and shake?), B4-05 (the "too early" swatch from
   `S.verdict`), A3-01 (a word moment for wadhi/nindhi), C1-01 (a teaching order). Three rows are marked different by design and
   need his confirmation: B1-06, B3-02, C2-03.
5. **Next Adopts:** `Cook.Coach.control` (D1-06), `.cardLight` (D1-07), and a maani section on the kitchen-kit lab page (F5-03).

Open rows: MAA-15, MAA-16 (Mum), MAA-19 (the first roti's card pop: kit (e)), MAA-14 parked.
