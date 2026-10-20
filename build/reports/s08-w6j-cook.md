# s08 wave 6J: Cook, every open code fix (builder report; not judged)

Branch `worktree-agent-ad4f8ef141f5e5cbf` from `b4aff61d`. Not pushed. Game code changed: yes.

## Flaws first

1. Daal chop L4: the chop card stays open (Zafar's DAAR-34), so contract-35's "L4 every card closed" breaks on `cook:daar@L4`. That needs a tools change.
2. SH-117: the pour now runs 2.9 s, but the probe plays at speed 3 and its pot crop cuts the lifted bowl.
3. SH-98's probe never reaches its peek: the samosa card no longer folds (decision 97).
4. contract-20 (two Nana faces, daar L3 hint) did not reproduce in a probe at 800x360.

## What changed

| Row | Change |
|---|---|
| SH-112 | The band is 30% (`St.SHELF.top` 630) in all six band stations. Jars, heaps, piles, pots and bins are a quarter bigger. The samosa board and fry hob are smaller. Design doc split line updated. |
| SH-60 | Glows come with Nani's line (`NaniGuide.lastHelpAt`). A halo shows under WebGL. Samosa, maani and threading now light their target. |
| DAAR-34 | Chop card row in the level table (`daar-chop`). A ticked row is written. An L4 call is written whole. Drawn at the order's card level. |
| SH-98 | The to-check underline shows only in the word book and "?". |
| SH-117 | The lip sits over the far rim. The pour is longer and the fill rises. |
| SAM-21 | Each swipe's arrow shows at once. |
| CHAI-08 flaws | The count pills hide during a pour. Review faces sit beside the glass. |
| contract-35 | `bajr ji maani` dots as one item. The samosa card stays open (decision 97). |
| contract-3 | The pantry's last count finishes before it closes. The day 5 and open-kitchen breaks are the checker matching a cut count clip to a later stage. |
| SH-37 | Cream results card. Tiles still to come show empty. |

## Proof

| Check | Result |
|---|---|
| `checks.mjs` (unit, words, static, leak, bump, specs) | ok, 435 pass. `load` not run (no new pictures). |
| Evidence `w6j-green` | 5 sheets for the judge. SH-98 tool failure (unreached). |
| SH-60 timing (Lifecycle) | help/glow: pantry 20.16/20.17, chai 8.43/8.44, samosa 8.56/8.57 s |
| Sandbox `w6j-days` (day3, day5, open-kitchen, contract) | all reach the end. Before the last fixes: contract-35 4, contract-3 2. |
| Own shots | 6 stations x 4 sizes, no overlap or clip |

Requests (6L): exempt `daar-chop` from contract-35 at L4; skip revealed rows; match clips to lines by id; SH-117 at speed 1; new SH-98 probe. Art: none.
