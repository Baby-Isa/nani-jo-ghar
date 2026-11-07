# s17-o4-lesson: the dotted-word lesson always shows (CHAI-102)

## Flaws first
- The proof comes from my own script, not evidence.mjs (as the orchestrator asked), so the judge has no before|after sheet from it.
- Every run, old code and new, logs one page error from the labs page's move to the lab page ("Transition was aborted ... ViewTransition"). It isn't from this change.
- The blurred-picture lesson uses the same code path but wasn't proven at L3.

## Cause (his 01:32 log)
The station starts as the order's card starts to fly. The lesson picked a dotted word 180 ms before the order's end redrew every card. So it lit a card that was no longer on the page, waited 4.5 s on nothing, and had already spent its once-only mark.

## What changed
- `js/cook/station-lib.js`: `begin` keeps the order's end as `ctx.landed`. The new `Cook.Stations.orderLanded(ctx)` waits for it, then until no pop-up, popped or flying card, or waiting row is left, then one frame. It gives up after 12 s.
- `js/cook/stations/chai-tray.js`: a lesson that's due waits for the order to land (noted `order-landed`). If its card is redrawn, it lights the same word on the new card, else picks again. The mark is spent, and `reveal-lesson ... shown` noted, only once its box is drawn. If nothing is drawn, it logs `none-in-view` and spends nothing.

## Proof
Played from `labs.html` as a New player with fresh storage, at real speed, with the page not told it is a test browser. A run passes if a lit box sits on a dotted word on the page after the note.

| Run | Sizes | Result |
|---|---|---|
| old code, L2 (red) | 1280x609, 740x320 | 4 of 4 missed |
| L2, five each | 1280x609, 905x298, 740x320 | 15 of 15 lit |
| L4, two each | same | 6 of 6 lit |
| skip during the order, L2 and L4 | same | 6 of 6 lit |

The order landed 89–450 ms after the station began.

## Contract run
`CONTRACT PASSED: 0 breaks over 4 pages` (cook:chai-tray at 740x320, 930x430, 1280x665 and 1920x1080).

## Open and requests
- CHAI-102 is built; the judge looks at the sprint's end.
- Request: one line in `docs/process/overnight-log.md` (not mine to edit): "7 Nov, s17-o4-lesson: CHAI-102 built: the lesson waits for the order to land (27 of 27 runs lit)".
