# s08 wave 6M: Cook, the last run's code fails (builder report; not judged)

Branch `worktree-agent-ad7a2775759515f5c` from `df3be32d`. Not pushed. Game code changed: yes.

## Flaws first

1. contract-5 still breaks ("all 3 badges showed at once"). This was already the case before this wave (156 breaks in the red run). It comes from SH-37's always-visible tiles; the check counts the tile itself.
2. Samosa fold: the swipe arrow starts over the filling.
3. The review's tick picture still fills gold in part (a share). Only the "n/total" text is gone.
4. Chai: a faint pale oval near the far rim (a wisp) still shows at kind-timing.
5. Decision 9 said a wrong item in the sequence empties the bowl. The brief (rule 12) overrides it; cook.md is not mine to change.

## What changed

| Row | Change |
|---|---|
| CHT-14 | A wrong item from later in the order comes out alone ("early"); the right layers stay. The chips are speaker-only at every level. |
| SAM-22 | The tick badge counts "✓ × n" instead of "n/total". A badge still to come shows its picture faint and grey. |
| CK-48 | Samosa's six strips are drawn with the board. The chop starts throwing as the board comes up once its order was read in a pop-up. |
| SAM-21 | The filling sits on the bottom-left corner flap; the first fold carries it over. |
| SH-113 | One crop per picture in shared CSS: the doctor at 1.9 and 36%, the girl at 1.7 and 45%. |
| DAAR-26 | A card closed for its level keeps its stir row. |
| DAAR-35 | The wave switch happens in the tick, on the beat. |
| CK-06 | The puff is now a thin ripple. Steam and wisps start at the far rim. |

## Proof

| Check | Result |
|---|---|
| `checks.mjs` (no load) | unit 446 pass, words 0, static 0 new, leak 19 ok, bump, specs, docs ok |
| `leak.mjs chaat` | PASS (fair 100%, blind under 1%) |
| Evidence `ev-w6m-green1` (16 pages, 1366x768) | every probe reached its moment. contract-65 0 breaks (L3, L4). DAAR-26 L4 card: "Muke daar khape. / trae aste thi" |
| Own look | chaat keeps chana; strips with board; chop lands mid-throw; review "✓ × 2"; pot without clouds; faces matched |

Requests: `build/leak_chaat.mjs` should model "early" as keeping the bowl (win rates unchanged). contract-5 should measure badge content, not the tile. Proposed new row: samosa and daar filling chips write their words at L1-L2, the same reading leak. Art: none.
