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

**`area.next(o2)`: a game's next screen in the same round** (Sprint 20 batch 1, from corn: the grill, then the flavour). The floor plan again for that screen, read as it lays out, with `o2` over the first area's options; the wash is never drawn again. `o2.top` moves the bottom row's top for that screen where its row is taller (corn's six bowls in two rows on a phone), so its `play` is what is left above it. `o2.band: {ms}` draws the bottom band anew at the new top in the band the first area drew (the game's own: the stone tray's slab alone, its wash already under it; or the stone band and its shelf), fades it in over `ms` (default 380) and removes the old band once it is in. Returns the new area, with its own `next`. `stoneBand` now also keeps what it drew on the area (`band`, `game`) for this. A game with one screen never calls it; chai does not, so chai's boxes cannot move by it.

`Cook.Frame.sheet {x, y, w, h}`: the whole sheet, for a game whose zone is the whole sheet (chai's two zones).

**Why the screen's answers are the frame's:** some sums are about the screen, not the room: a size that must read the same in CSS px on every screen (the shelf's pills, the tray's faces at least 30 px, a word pop's clearance), a tap area or a light's box on the page, a word pop or the serve's faces kept whole inside what the screen shows. A game asks the frame, so no game reads the camera, the view or the window itself, and a change to how the screen is fitted is made in one place.

Who calls it: chai (Sprint 20 steps 1-2: `{top, base, far, draw: true}`, band `shelf`; its hob row, tray and pans are laid out from `play`, its shelf row between `bottom`'s edges). Corn (batch 1: `{top, base, far, draw: true}`, band `tray`; screen 1's grill-and-tray rectangle and the band's cobs from `play`, 8 in from its sides; screen 2 calls `next`: its bowls' row between `bottom`'s edges, its plates across the new `play` less a side share each side, `plates.side` in its settings).

## Counts (may only go down)
`node build/tools/review/frame-counts.mjs`. 13 Nov: chai-tray 29 (14 Nov: 24 after step 1, 0 after step 2), eggs 12, maani-line 15, corn 11 screen reads; flow.js 31, serve.js 5, ui.js 6, station-lib.js 3, stations.js 3 lines naming a game.
