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
- `play {x, y, w, h}`: the worktop the game furnishes: 48 in from the sheet's sides, from 16 below the view's top to 28 above the bottom row. The game lays out inside it, from its edges and size.
- `bottom {x, y, w, h}`: the bottom row: from the band's top to the view's foot, 40 in from the view's sides.
- `pills`: the count pills' room over the game's main thing (50 CSS px, so the screen's), in sheet units.
- `stoneBand(S, {game})`: the bottom band at the frame's top, shelf line and depth. The game calls it with its own key, so its settings name the band (`shelf` or `tray`): SH-248 wants the game's own code to pull it (`build/core/band.test.mjs`).
- `wash`: the worktop's wash, drawn when `draw` is set.
- The screen's answers, live (also on `Cook.Frame`): `px` (screen px per sheet unit), `view()` (the part of the sheet on screen, `{left, top, right, bottom}`), `toScreen(x, y)`, `toSheet(sx, sy)`.

Options: `top` (the band's top; default `St.SHELF.top`), `base` (the shelf line things stand on; a shelf band only), `draw` (draw the wash), `far`, `depth` (the band's; default `D.bg + 1.2`).

`Cook.Frame.sheet {x, y, w, h}`: the whole sheet, for a game whose zone is the whole sheet (chai's two zones).

**Why the screen's answers are the frame's:** some sums are about the screen, not the room: a size that must read the same in CSS px on every screen (the shelf's pills, the tray's faces at least 30 px, a word pop's clearance), a tap area or a light's box on the page, a word pop or the serve's faces kept whole inside what the screen shows. A game asks the frame, so no game reads the camera, the view or the window itself, and a change to how the screen is fitted is made in one place.

Who calls it: chai (Sprint 20 steps 1-2: `{top, base, far, draw: true}`, band `shelf`; its hob row, tray and pans are laid out from `play`, its shelf row between `bottom`'s edges).

## The size chain (Sprint 20 batch 1, maani)
Play area → stations → contents. **`area.row(stations, {max, min, room})`** (also `Cook.Frame.row(play, stations, opts)`): a game names its stations left to right, each `{share, w, h}`: its share of the row's unit (equal to start, 1 each; a game may give its own, in its settings) and its footprint for one unit (a board `1 x 1`; a hob `1.15 x 1.63` of its tawa). The frame gives:
- `unit`: the largest that fits the play area across (less the gaps) and down (less `room`, kept above the row for what appears there), at most `max` (the game's own accepted size: the chain never grows a station past it), at least `min` (a small phone's floor);
- `gap`: between stations, the frame's, a tenth of the play area's width (`Frame.ROW_GAP`);
- `boxes`: each station's `{x, y, w, h, size, cx, cy}` (`size`: its share of the unit), on the row's middle line; the row centred across the play area and down it by chai's measure (CHAI-89: centred with its `room`, its top at least 24 below the play area's top unless that pushes it into the bottom row's gap).

The game sizes its contents from its stations' `size` (maani: the chakla, the roll's rings and the velan from the board's; the tawa, its flames, ring and hob, the turner from the tawa's). Who calls it: maani (`[{share: board}, {share: tawa, w, h: the hob per unit of tawa}]`, `max` 360, its accepted size: 11 Nov). The stove part is a game's own: maani's hob is its tawa station's footprint, not a frame part.

## Counts (may only go down)
`node build/tools/review/frame-counts.mjs`. 13 Nov: chai-tray 29 (14 Nov: 24 after step 1, 0 after step 2), eggs 12, maani-line 15 (14 Nov: 0, batch 1), corn 11 screen reads; flow.js 31, serve.js 5, ui.js 6, station-lib.js 3, stations.js 3 lines naming a game.
