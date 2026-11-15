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
- Nani's box in the side panel takes the order card's face: its size, ring and inset from the box's corner, her line where the card's headline starts (SH-301, Zafar 15 Nov; `css/shared/order-card.css`, every game).
- The order card's headline is one size in every state, in every game (SH-277; the kit's `#side` rule, was chai's alone).
- Well done is in the serve's own kitchen, chai's way: the kit's review faces over the dishes and the "Shabash!" card (`Cook.Kit.serve().faces` or `.review`), never a scene of its own (SH-303, Zafar 15 Nov; eggs' table and cat removed; maani already so).

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

`Cook.Frame.lend(part) -> back()` (s20-b1-daar): a host lends the game it runs part of its play area, `part {x, y, w, h}` in shares of it (0-1); while lent, every `area()`'s `play` is that part; `back()` ends the lend (call it in a `finally`). Chai never lends, so chai's boxes are untouched.

**`area.next(o2)`: a game's next screen in the same round** (Sprint 20 batch 1, from corn: the grill, then the flavour). The floor plan again for that screen, read as it lays out, with `o2` over the first area's options; the wash is never drawn again. `o2.top` moves the bottom row's top for that screen where its row is taller (corn's six bowls in two rows on a phone), so its `play` is what is left above it. `o2.band: {ms}` draws the bottom band anew at the new top in the band the first area drew (the game's own: the stone tray's slab alone, its wash already under it; or the stone band and its shelf), fades it in over `ms` (default 380) and removes the old band once it is in. Returns the new area, with its own `next`. `stoneBand` now also keeps what it drew on the area (`band`, `game`) for this. A game with one screen never calls it; chai does not, so chai's boxes cannot move by it.

`Cook.Frame.sheet {x, y, w, h}`: the whole sheet, for a game whose zone is the whole sheet (chai's two zones).

**Why the screen's answers are the frame's:** some sums are about the screen, not the room: a size that must read the same in CSS px on every screen (the shelf's pills, the tray's faces at least 30 px, a word pop's clearance), a tap area or a light's box on the page, a word pop or the serve's faces kept whole inside what the screen shows. A game asks the frame, so no game reads the camera, the view or the window itself, and a change to how the screen is fitted is made in one place.

Who calls it: chai (Sprint 20 steps 1-2: `{top, base, far, draw: true}`, band `shelf`; its hob row, tray and pans are laid out from `play`, its shelf row between `bottom`'s edges); eggs (Sprint 20 batch 1: the same call, band `shelf`; its hob, pot, pan and tray from `play`, inset 8 from its sides and never closer than 24 to the view's; its shelf row between `bottom`'s edges; its table a zone the size of `Cook.Frame.sheet`; no option added).
Daar (Sprint 20 batch 1, s20-b1-daar): `{top}` for its play area each phase (its x's are shares of `play.w` in its settings' scene, its hob's group centred in `play`), `{top, far, draw: true}` in the cook phase, band `tray`; the word pop's top, the pills' scale and the badge's floor from the frame's `view()` and `px`.
Baking (Sprint 20 batch 2, s20-b2-baking): `{top, base, far, draw: true}`, band `shelf`; its bowl, jug, tray, oven, cat and shelf row at shares of `play.w` across (its settings' `scene.room`), the bowl's foot and the oven centred down `play` (CHAI-89); the oven is the round's second screen, `area.next()` (no band redrawn); sizes in CSS px from `px`. No option added; not `row`: its stations are a centre and its satellite (the bowl the shelf row centres under, the jug beside it; the oven and its tray), not a row of equals (a call in its report).
Chop: its own frame area `{top, base, far, draw: true}`, band `tray`; the board's group centred in `play`, which is the part its **host** lends it (daar: `Cook.Frame.lend`, its settings' `chopRoom`, today the whole) or, alone and in chaat's chop-game, the whole; its well done kept off the side panel and cog with `toSheet`. The host never tells chop its layout (SH-259): the frame does.
Chaat (Sprint 20 batch 2, s20-b2-chaat; its layout is its mechanic's, `js/cook/mechanics/assemble.js`, its settings `data/stations/chaat.json`): `{top, draw: true}`, band `tray`; the serving bowl's width a share of `play.w`, its middle at shares of `play` (down: the middle of the worktop that shows, lowered by its own share of its width), the tray row's span in shares of `play.w`, its pills' foot from `bottom`, the word pop, the face's and pills' sizes and the review's room from `view()`, `px` and `toScreen`. Its chop step is chop's own game (`"do": "chop-game"`, the recipe runner's): chaat lends nothing, so chop takes the whole play area; no code of chaat's runs as its chop starts, so a lend would need the recipe runner (`js/cook/recipes.js`) to lend a step's room: not built, no option added.

## The size chain (Sprint 20 batch 1, maani)
Play area → stations → contents. **`area.row(stations, {max, min, room})`** (also `Cook.Frame.row(play, stations, opts)`): a game names its stations left to right, each `{share, w, h}`: its share of the row's unit (equal to start, 1 each; a game may give its own, in its settings) and its footprint for one unit (a board `1 x 1`; a hob `1.15 x 1.63` of its tawa). The frame gives:
- `unit`: the largest that fits the play area across (less the gaps) and down (less `room`, kept above the row for what appears there), at most `max` (the game's own accepted size: the chain never grows a station past it), at least `min` (a small phone's floor);
- `gap`: between stations, the frame's, a tenth of the play area's width (`Frame.ROW_GAP`);
- `boxes`: each station's `{x, y, w, h, size, cx, cy}` (`size`: its share of the unit), on the row's middle line; the row centred across the play area and down it by chai's measure (CHAI-89: centred with its `room`, its top at least 24 below the play area's top unless that pushes it into the bottom row's gap).

**`gapUnit`** (s20-b2-sekelo): a group that stands together (sekelo's grill and its cooked tray, "one tidy rectangle", CK-86) names its gap as a share of the unit, so it grows and shrinks with the stations; without it the gap is the frame's tenth of the play width (chai, maani: unchanged).

The game sizes its contents from its stations' `size` (maani: the chakla, the roll's rings and the velan from the board's; the tawa, its flames, ring and hob, the turner from the tawa's). Who calls it: maani (`[{share: board}, {share: tawa, w, h: the hob per unit of tawa}]`, `max` 360, its accepted size: 11 Nov). Sekelo (s20-b2-sekelo), each screen its own view (`St.begin` clears the stage, so it reads `area()` afresh, never `next`): the thread screen `[board, deep tray]`, unit the board's height, `max` 586 (its accepted size); the grill screen `[grill, cooked tray]` in the play area less 8 at each side, unit a skewer's length, `room` the tray's face circle (63), `gapUnit` 0.08, `min` 120; its bowls between `bottom`'s edges. The stove part is a game's own: maani's hob is its tawa station's footprint, not a frame part.
The game sizes its contents from its stations' `size` (maani: the chakla, the roll's rings and the velan from the board's; the tawa, its flames, ring and hob, the turner from the tawa's). Who calls it: maani (`[{share: board}, {share: tawa, w, h: the hob per unit of tawa}]`, `max` 360, its accepted size: 11 Nov). The stove part is a game's own: maani's hob is its tawa station's footprint, not a frame part. Roll-tawa (Sprint 20 batch 2, the lab's two-zone proof): the same call, `{top, far, draw: true}`, band `tray`; its board and its hob (one burner, or two from tawa level 2) as `area.row`'s two stations, `max` its tawa's old size; each zone fitted to its station (the mechanic's design px times the station's unit) and owning the pointer on its side of the gap; the spare dough, the rolled one waiting and the plate on the tray; no option added.

**`Cook.Frame.taps(S, () => [[a, b], thing, ...])`** → `stop()`: a tap's room (chai's SH-288 rule, Zafar 13 Nov: "increase the tap targets as much as you can without changing the look"): each thing named takes a whole 48 CSS px either way by an invisible hit area, nothing drawn changes; a pair side by side (a burner's face and its knob) shares the room between them, meeting at the midpoint. Run each frame; works only when a hit area, a place or the scale is new. Who calls it: maani (the hob's face and knob). Chai keeps its own copy (its boxes are frozen).

## Counts (may only go down)
`node build/tools/review/frame-counts.mjs`. 13 Nov: chai-tray 29 (14 Nov: 24 after step 1, 0 after step 2), daar 8 and chop 7 (14 Nov: 0 each, s20-b1-daar), eggs 12 (14 Nov: 0 after batch 1), maani-line 15 (14 Nov: 0, batch 1), corn 11 (14 Nov: 0, s20-b1-corn), baking 9 (15 Nov: 0, s20-b2-baking), mishkaki-grill 2 (15 Nov: 0, s20-b2-sekelo), roll-tawa 4 (15 Nov: 0, s20-b2-roll-tawa), baking 9 (15 Nov: 0, s20-b2-baking) screen reads; flow.js 31, serve.js 5, ui.js 6, station-lib.js 3, stations.js 3 lines naming a game.
