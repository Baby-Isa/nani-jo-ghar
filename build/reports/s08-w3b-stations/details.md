# s08-w3b-stations: details (builder, not judged)

Worktree `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6`, branch `worktree-agent-ad8726d440ddf65d6`, from `claude/new-session-b5r2am` at b5a2495a. Not pushed; nothing on main.

## Flaws first (all of them)

| # | Flaw |
|---|---|
| 1 | Sekelo layout D at 1366x768: the rack picture (rack-0..4) is a thin rail frame. Empty, the two racks are two slim brown frames on the left, and the grill (815 design px wide) outweighs them. Full, the upright skewers fill the column. Research layout D chose this; Zafar (or the judge) should see it before the next art run. |
| 2 | Sekelo L3/L4: one decoy (veg-01). contract-37 breaks on `cook:mishkaki-grill@L3` and `@L3#hint` (and L4, not run). The other vegetables have no sekelo piece art (brief: keep one, say so). |
| 3 | `cook:assemble@L2#mistake` 1366x768: contract-22, "Muke chaat khape." said at 4.25 s (the order pop-up) and again at 6.79 s (`request cook:reveal`, the layer order read from the card). This is the request/reveal path (`UI.mission.request("assemble")`), which I did not change. It is not seen on the fair flows. I did not run a red to prove it predates this branch. |
| 4 | Chaat strips: the chutney layers (THIN 0.5) are thin green or brown lines. The chickpea strip's lower edge is a little see-through over the potato (round chickpeas with gaps). At the bowl's lower corners the strip ends short of the glass by a few px. |
| 5 | Chaat at L3: after the bowl empties, the reopened rows go back to dots (•••). This is the level table, correct but stark. "fudino ji chutney" is written at L3 because it has no voice yet (Cook.dotItem; this was already so). |
| 6 | Files outside the brief's list, each needed by a task: `js/cook/ui.js` (MAA-15: `again` passed through to `stepCall`, which skips the "said a moment ago" rule and logs `queued-again`; contract-30: the kind's own row "ba lakri mixed" over its skewer boxes), `js/cook/station-lib.js` (passes `o.again` on), `build/sandbox/lib/contract.mjs` and `build/sandbox/contract-voice.test.mjs` (contract-22 exempts a step call marked `queued-again`, with a fixture test), `build/test_cook_levels.mjs` (a MAA-17 test), and the new `build/tools/review/leak-configs/chaat.json` (one line; the adapter is `build/leak_chaat.mjs`). |
| 7 | No evidence probes were added to `build/sandbox/data/evidence.json`. None exist for CHT-12..15, SEK-19..21 or MAA-15/17, and the file is shared with the other builders. Red and green are by the leak bot, a unit test, contract runs and filmstrips instead. |
| 8 | The 191 regression rows were not each re-played. The flows run are listed below; `touched.mjs` maps the shared files (ui.js, contract.mjs) to every flow, which is over the browser budget. |
| 9 | The chaat wrong-drop animation at test speed 3 is about 1 s. At a child's pace it is about 2.5 s: spoon in, a 260 ms pause, a wobble with an amber glow, then out. I did not watch it at speed 1. |
| 10 | The sekelo taste face is placed over the raw rack for layout D. In the lab the serve cuts to the kitchen, so I have not seen it. |

## What changed, by task

### 1. Chaat (assemble.js, data/cook.json chaat entries)

- CHT-12: the ellipse shadow under the bowl is gone.
- CHT-13: `art.s02["chaat-glass"]` is now `assets/cook/items-s08b/chaat-bowl-side-s08b.webp` (800x311). Its meta was measured on the @2x cut (`scratch/measure_bowl.py`, the `check_vessel_meta.py` method): rim 0.0728, floor 0.8701, a 29 px wall, inside at 41 heights. It is side-on, so the ellipses are nearly flat. Each layer draws its item's s08b strip (10 strips, `STRIPS` in assemble.js) once across the bowl at its own size: no tiling, no seams. The strip's ragged or glossy top stands above the layer line by its own measured "solid top" (`stripTop`). The side shading darkens only the strip's pixels. The thrown spoonful is cut from the strip. The pot-photo tiling (`bandCanvas`) is kept only for an item with no strip. Layers of short orders are thicker: `max(4, n)` instead of `max(6, n)`. The asset manifest `art.assets.stations.assemble` gains the bowl and strips globs, and the prefetch is the new bowl.
- CHT-14, CHT-15 (decision 9): the pure block `CHAAT_RULES` (`checker`, `judgeDrop`, `rowsMissed`) decides each tap as the item goes in:
  - **in**: the item stays and its row ticks.
  - **bounce** (decoy, the "no" item, one too many): the item goes in, there is a 260 ms pause, the glass wobbles ±2.5° with an amber radial glow behind it (`bowl.notIn`), and the item flies back to its pot.
  - **reset** (in the order, but later): the same wobble, then the bowl empties, every spoonful flies back, and the rows open again.
  - Tick costs: the row the order wanted at that place loses its tick, as do the "no" row when its item was tried and the tried item's own row on a reset. Ticks already earned stay. Help still costs bulbs only. Word stats: `markMiss(expected)` once per place, `markRight` for every item not missed.
  - Test hook: `Cook.assembleOrder`.

### 2. Sekelo (grill.js, thread.js comments, data/stations/mishkaki-grill.json, data/cook.json sekelo entries)

- SEK-19: the meat piece is `ph-meat` (gos) in classes, bowls, v3pieces, art, the recipe's lists and mixes, and the customers' patterns. An all-meat skewer's kind is `ph-mishkaki`, so the card shows "hakri lakri mishkaki". `art.sprites.need` thread/grill use `ph-meat.raw`.
- SEK-21: `GROUP_GAP` is 0, so every bin is one pitch apart.
- SEK-20 / SEK-07 (layout D):
  - The raw rack sits at (342, 237) and the cooked rack at (342, 663). Both use the same rack picture (`SK.cooked3`, the plate3 API, chunks at rack size).
  - The grill is G3H 434 (815 wide) at (1091, 450), with skewerY 511 (the tip on bar 1).
  - Gaps are 102/102/101 across and 48/48/48 down.
  - On the grill screen the marble runs full height (no shelf band). The taste face sits over the raw rack.
  - The square trays were not used: they are shiny steel (P37's complaint) and hold horizontal skewers (they would need rotating and their own composition). The racks match the threading screen.
- contract-30: when one mix is ordered several times, its own row ("ba lakri mixed") sits over the boxes (ui.js `orderCards`).

### 3. Maani (maani-line.js, data/stations/maani-line.json, data/cook.json guide)

- MAA-15: `guide["maani-line:off"].line = "guide-firai"`. Side 2's step opens with `again: true`, so it is called even though Firai was said moments before (logged `queued-again`; contract-22 knows it). "Take it off" still waits on Mum.
- MAA-17: `flipAddS: 0.75`. The ring keeps one speed, slower: rate = (hi-lo)/((hi-lo)/rate + 0.75), on both sides. `Cook.maaniWindow` records the result.

### 4. contract-8 (ui.js readAlong)

- The "next" marks are held from the first part read until the read ends or is stopped. They used to be given back in each part's `finally`, so a read stopped by a new one put "next" back over the new lit row.
- A card redrawn mid-read has its new marks held.
- A part naming several elements (one word in two skewer boxes) lights only the first.

## Proof

| Check | Red (before) | Green (after) |
|---|---|---|
| Chaat leak bot `node build/tools/review/leak.mjs chaat` (`--old` = the bowl before decision 9; pass = 3/4 of rows ticked) | L2 49-51%, L3 100%, L4 100% for random, eliminate, shelf and repeat; L1 ~1% (3 rows: one lost tick fails the 3/4 pass) | fair 100%; every blind strategy 0.0-1.1% at L1-L4: PASS |
| MAA-17 `node --test build/test_cook_levels.mjs` | on HEAD's maani-line.json: `not ok 5 MAA-17 ... flipAddS is 0.75 s` | 8/8 pass |
| Maani window (in the game, `scratch/maani-window.mjs`) | 1.42/1.20/0.93/0.79 s (side 1, from the code's own sums) | side 1 2.17/1.95/1.68/1.54 s; side 2 2.06/1.86/1.61/1.48 s |
| MAA-15 ear (`w3b-green`, cook:maani-line L1, sound log) | step `tawa-2` had no line (P7) | 15.82 s "Firai!" call (firai.mp3), step 4 queued; 17.74 s "Firai!" call (firai.mp3), step 5 queued-again; contract-22 and contract-36 clean |
| contract-8, sekelo L3#hint | orch-w2a-sekelo: 3 breaks (reading x2, next+reading) | w3b-green: 0 |
| contract-8, chai-tray L3 | w3b-red-c8 (ui.js at HEAD before the fix): 0 breaks, already green | w3b-green: 0 |
| contract-30, sekelo L3#hint | orch-w2a-sekelo: "ba" said, not written | w3b-green: 0; card shows "ba lakri mixed" |
| contract-22 fixture | new test (`queued-again` exempt; the same call without it still a break) | contract-voice.test 10/10 |
| `checks.mjs --only unit,words,static,leak,bump,specs,docs,size` | | all ok (unit 388 pass; leak 18 configs incl. chaat) |
| `loadcheck.mjs --only cook:assemble,cook:mishkaki-grill,cook:maani-line` | | 3/3 ok |
| Sandbox `w3b-green` 1366x768 (assemble, assemble@L3, assemble@L2#mistake, mishkaki-grill, @L3, @L3#hint, maani-line, chai-tray@L3) | | all reach the end, 0 page errors, 0 layout findings; contract: 3 breaks (contract-37 x2 sekelo decoys; contract-22 x1, flaw 3) |
| Sandbox `w3b-phone` 800x360 (mishkaki-grill, @L3) | | both reach the end; 1 layout finding, canvas-text-small (thread chip text), in the baseline; contract-37 x1 |
| shotdiff `w3b-green` | | 54 changed vs approved (chaat bowl, sekelo grill, badge timing); `sheets/changed.png` looked at: no clipped text or covers seen |

Browser time used: about 17 minutes in all.

## Filmstrips and sheets (PNG)

- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/chaat-L3-wrong-drop-bounce.png`: the "no" item tried, in, wobble, out.
- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/chaat-L3-sequence-reset.png`: one from later, the bowl empties, the rows reopen, then the round's 3/6 badge.
- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/chaat-L3-full-bowl-zoom2.png`: five strips in the side-on bowl, x2.
- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/chaat-L3-bowl-states.png`
- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/sekelo-L1-1366x768.png`
- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/sekelo-L3-1366x768.png`: includes "ba lakri mixed" on the L3#hint card.
- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/sekelo-L1-800x360.png`
- `/home/user/nani-jo-ghar/.claude/worktrees/agent-ad8726d440ddf65d6/build/screenshots/w3b/sekelo-L3-800x360.png`
- Runs: `build/screenshots/sandbox/w3b-green`, `w3b-phone`, `w3b-red-c8` (contract.md, sheets/).

## Rows

| Row | State after this branch |
|---|---|
| CHT-12, CHT-13, CHT-14, CHT-15 | built; need the judge |
| SEK-19, SEK-21 | built |
| SEK-20 | built (layout D); needs the judge and Zafar |
| SEK-07 | the plate is gone from the stage, so the row's wording (plate padding) needs Zafar's say |
| SEK-14 | untouched (rack pictures kept) |
| MAA-15, MAA-17 | built |
| contract-8 (SH-53) | green on sekelo L3#hint and chai-tray L3 |

No new contract checks were needed (contract-55 and up unused).
