# s18-g-sekelo: sekelo at chai's standard on the kits (Sprint 18, wave 2)

Opus, high. About $20. Zafar's decision 5 for this run: no BEFORE run, no evidence --before.

## What changed

1. **Gap page first** (675fcd1e, alone): `docs/design-language/standard/gaps/sekelo.md`, 205 rules scored, what not to touch, the plan.
2. **The game on its settings file and the kits** (d86b384a):
   - The thread's and the grill's levels moved into `data/stations/mishkaki-grill.json` (`mechanic.thread`, `.grill`), read by
     `Cook.Skewer.knobs` (falls back to `Mech.knobs` on a page without the file).
   - Copied kit code deleted from `js/cook/mechanics/grill.js`: `SK.speaker`'s drawing (now `Cook.Kit.speaker`); `SK.bowl`'s own chip
     (about 30 lines; now `Cook.Kit.chip` at every scale); `SK.pop`'s card (now `Juice.P.pop` placed by `Juice.popAt`); `SK.band`'s
     wash and parchment band (now `Cook.Kit.worktop` and `St.stoneBand`, with no shelf strip because the bowls are top-down);
     `SK.shelf`'s slot arithmetic (now `Shelf.slots`); `V2.INK` and `V2.FONT`. The `Cook.Skewer` calls keep their names (the corn
     stall).
   - Kit (d): `Cook.Coach.firsts` and `.lessons` before the threading (contract-98 was red at L2 and L3); the thread's hint and glow
     hide once the word is past support (`Onboard.hintHides`); a wrong piece calls `Cook.Coach.wrong()`.
   - **SEK-22:** each skewer is named by its step (`wordId` set to rack, turn, lift or undo), so the kit's light hugs the skewer's own
     box (the stick, drawn or hidden, and its pieces), not a circle round the tap point.
   - Kept as the game's own (different by design): the grill's clock. `Mech.boil` is a pan with a knob.
3. **Rescored:** 13 at 0, 32 at 1, 155 at 2, 5 at 3 before; 13 at 0, 23 at 1, 163 at 2, 6 at 3 after.

## Proof

- Contract, L1-L4 at 1280x665, before this commit's lessons: contract-98 broke at L2 and L3. After: "CONTRACT PASSED: 0 breaks over 4
  pages", every end reached, 0 page errors (run s18-g-sekelo-b; the last run on the final commit is in the hand-back).
- Checks: static ok (0 new; 2 known ones are now fixed), words 0 literals, load 29/29. Unit: chip-words, cook harness, rules counts,
  shared rules, shared shelf all pass. `test_voice_wiring` fails on index.html (ViewTransition), and it failed the same way before
  my change.
- Not run: the four sizes (the orchestrator's merge run), evidence --after, frozen diff (not a reference game).

## Asks (exact changes)

1. **Orchestrator, `data/cook.json`:** delete `mechanics.thread` and `mechanics.grill`. The settings file now holds them.
2. **Kit, `js/cook/coach.js` `runKit` spot():** honour an explicit box, `if (Cook.expect && Cook.expect.box) return Cook.expect.box();`,
   so games don't need the `wordId` naming.
3. **The checks' owner:** run `build/tools/review/checks.mjs --write-known` to shrink static's known list by 2.

## Open

SEK-22 for the judge (sekelo at L1-L4, the lit skewer). The thread's idle hint still runs on its own ladder: `Cook.Coach.control`
is next. The rack has no stuck hint (STD-D2-04). SEK-18 and murgi wait on Mum, SEK-20 on art. L4 is no quicker than L3 (STD-C2-06,
a decision for Zafar).
