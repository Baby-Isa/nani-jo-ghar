# The kitchen frame: its notes (the frame's "owner")

Every session that touches the frame reads this first and updates it last. A brief that disagrees with it is wrong. Plan: `build/reports/s20-plan.md`; sprint: `docs/sprints/S20-one-kitchen-frame.md`.

## What the frame is (Zafar, 13 Nov)
- **The shared kit** (`js/shared/`, parts of `js/cook/ui.js`) is a toolkit of options with fixed standards: cards, the order card, Nani's box, lights, pills, the shelf and the stone tray, well done and wrong order, the end screen, the language engine. It never names a game.
- **The kitchen frame** is the floor plan: the play area, the bottom row (shelf or stone tray), the worktop. Sprint 21 adds the round (first-time gate, stuck help, serve, redo, level-up, the "Shabash!" spot).
- **Each game furnishes its own room:** its mechanic, its stations and their shares of the play area, its settings. It lays out freely inside its play area, in proportions of that area, never in screen or sheet numbers, never outside it.
- **Shared spots** (daar's counting card, Sprint 21) are kit parts the frame places beside the game's declared main thing; the game picks the side; an ordered fallback list when there is no room.
- **Sizes are a chain:** play area → stations → contents, with minimums on small phones and the shelf's size classes (`js/shared/shelf.js`).
- **The pantry is not a stove game:** shared kit only.

## Decisions that bind it
- A mistake keeps chai's way in every game: the wrong pan can't be picked; a wrong item can go in, the cup is made, the whole cup is redone (decision 22).
- The dish card at the order's first sentence is the order's own item pop-up, same place, look and motion (decision 23, SH-286).
- "Shabash!" sits where chai has it; the wrong-order pop-up only when an order is wrong; a tap never skips a due lesson (decision 22, built in Sprint 21).

## The frame's API
`js/cook/frame.js` (loaded by `js/cook/kitchen-kit.js`). Sheet units throughout (the 1600 x 900 drawing sheet).

**`Cook.Frame.area(S, opts)`**: the floor plan, read once as a game lays out. Returns:
- `play {x, y, w, h}`: the worktop the game furnishes: 48 in from the sheet's sides, from 16 below the view's top to 28 above the bottom row.
- `bottom {x, y, w, h}`: the bottom row: from the band's top to the view's foot, 40 in from the view's sides.
- `pills`: the count pills' room over the game's main thing (50 CSS px, so the screen's), in sheet units.
- `px`, `toScreen(x, y)`: the screen's scale and a point on screen, for the sums only the screen can answer (below).
- `stoneBand(S, {game})`: the bottom band at the frame's top, shelf line and depth. The game calls it with its own key, so its settings name the band (`shelf` or `tray`): SH-248 wants the game's own code to pull it (`build/core/band.test.mjs`).
- `wash`: the worktop's wash, drawn when `draw` is set.

Options: `top` (the band's top; default `St.SHELF.top`), `base` (the shelf line things stand on; a shelf band only), `draw` (draw the wash), `far`, `depth` (the band's; default `D.bg + 1.2`).

Who calls it: chai (Sprint 20 step 1: `{top, base, far, draw: true}`, band `shelf`).

## Counts (may only go down)
`node build/tools/review/frame-counts.mjs`. 13 Nov: chai-tray 29, eggs 12, maani-line 15, corn 11 screen reads; flow.js 31, serve.js 5, ui.js 6, station-lib.js 3, stations.js 3 lines naming a game.
