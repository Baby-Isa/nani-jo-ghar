# s19-r2-shared: the morning gate's regressions and the shared reopened rows (13 Nov)

Branch `s19-r2-shared` (from 8d6bac9e5), not pushed. Port 8911, own lock, --parallel 2.

## What changed

- **contract-24, -102 (daar, chaat)**: the free pick's guided glow had `{now: true}` since SH-237's overnight hop (`js/cook/station-lib.js:1200`), so it lit 0.5 s after the last tap, with no light. It waits for the level's pause again (keeps its hop). `Cook.Coach.stuck` (`js/cook/coach.js` hint) now glows a thing only inside its light and puts the glow out with it (daar L1's jar, the four-size run).
- **contract-113 (pantry L2-L4)**: `UI.cardIntoView` / the order read-along used `scrollIntoView` on a card outside the order list (the request pop-up's, inside `#stage`), which scrolled the stage itself ~290 px: the shelves slid under the side panel and stayed (`js/cook/ui.js:1126`, `:2595`). Cards now scroll only their own list (`boxIntoView`); `#stage` is `overflow: clip` (`css/cook.css`) with a scroll guard in `UI.init`.
- **PAN-19**: Nani's own list (the pantry) read as headless, so its first thing flashed as a small "hakro dudh" dish card over the big card (`ui.js` introduce, flashSaid). Her list flashes nothing.
- **CK-96**: the rows baking reveals one by one (bake-1..5) join one sideways row of item cards, as chai's.
- **Evidence tool**: run outputs served from this checkout under `NJG_GAME_ROOT` (the blank "not found" sheets), an unserved sheet an error (`lib/env.mjs`, `lib/sheets.mjs`); a timed-out shot taken from the compositor (`lib/evidence-probe.mjs`); `served` = dishes landed on their trays, before the results panel (`lib/moments.mjs`); tall frame panels cut into parts; no panel dropped (`evidence.mjs`). Probes: CHAI-37, PAN-19, CHAI-55, CK-96 (`data/evidence.json`).

## Proof

| row | verdict | evidence |
|---|---|---|
| PAN-19 | DONE | `build/screenshots/evidence/s19-r2-shared-ev/PAN-19*.png`: one card at a time, no small "hakro" card, L1-L4 both sizes. Her first line and its card come together (no moment before it) |
| CHAI-37 | DONE | `s19-r2-shared-ev3/CHAI-37.png`: dim, next item's card lit (A-C); D (L4 740) light already gone. A player who taps at once never sees it (by design, SH-261) |
| CHAI-55 | LEFT: row text | `s19-r2-shared-ev/CHAI-55.png`: full, half, then random. That is CHAI-110 (Zafar, 11 Nov night, "first order full, second half"), which overrides the row's 1 Nov wording: the row needs his newer word. The glass hint was not caught in 6 onboard shots |
| CK-96 | DONE (to judge) | `s19-r2-shared-ev2/CK-96*.png`: one row of narrow cards growing as she says each, L1 and L4, both sizes; a lone first card fills its row (contract-116, Zafar 11 Nov) |
| CK-102 cards | LEFT: needs Zafar | a finished card folds to its headline and tick in every game (his fold sequence); keeping baking's open is his call |

Contract, gate pages (morning gate -> mine): run s19r2s-a2 (pantry L2-L4, daar and chaat L2, both sizes): 113 40->0, 24 12->0, 102 2->0, total 67->10. Four-size run `s19-r2-shared-contract` (L1, 20 pages, all ends reached), 740 and 1280: 24 10->0, 102 4->1 (fixed after: coach.js), total 16->8; left: 53, 79, 92, 112 x2 at 1 each (light shapes and timing, as on 12 Nov). L2-L4 `s19-r2-shared-contract-l24` (30 pages, all ends reached), 740 and 1280: total 84->33; 113 40->1, 24 12->0, 102 2->1. Up by one or two, none traced here: 26, 36 x2, 83, 104, 111 (stations' or load), 107 (chaat L2 sev lit without its hop: watch it, the guided glow now waits), 121 (below). 102 left: baking's oven (baking.js); 113 left: chai L4's milk pan over Nana.

Checks: `checks.mjs` 14 steps ok; unit tests pass (evidence.test 30, help tests 13); lint-specs 0.

## Open

- contract-121 (pantry L2-L3 740, "the card lesson's picture under the canvas"): as on 12 Nov, not traced; likely the zoomed pop card's measured box.
- check-change (tier 2) did not finish: its base is the merge base with origin/main, so `scope` failed on 1377 other sessions' files and `play` planned 65 pages at one at a time (about 100 min). Stopped; run by hand instead: `loadcheck.mjs` 28/32 (daar, tadka, stir, baking load another game's picture: art-step, my diff loads none), `test_cook_mount.mjs` 17 failed on the base's files too, `frozen.mjs --diff` timed out at 15 min. The orchestrator should run check-change with `--base 8d6bac9e5`.
