# The module map: chai's pieces on the three layers (Sprint 17, 7 Nov)

Sprint 18's map (`docs/sprints/S18-kitchen-family.md`, "Coded well"): every piece of chai today, the layer it belongs in, the file it
lives in now, the file it moves to, its Sprint 18 owner and the call a game makes. Written by the orchestrator from the standard's F1
(`docs/design-language/standard/f-build.md`, STD-F1-01 to -07 and its piece table; line ranges at commit 34641d3, the signed-off
chai). The rules that govern it: STD-F1-01 (the lowest layer that owns it, fixed once), STD-F1-02 (no game copies kit code, no kit
file names a game), STD-F1-05 (a piece on the old code or the kit, never both). A kit builder that needs a different file or call
says so in its report and this page changes the same day.

**The three layers (Zafar, 7 Nov, decision 13):** the shared kit (`js/shared/`, `js/cook/ui.js`, `js/cook/flow.js`,
`js/cook/station-lib.js`: every game, and whatever the pantry and the stalls also need) → the kitchen kit (`js/cook/kitchen-kit.js`,
`js/cook/mechanics/`: every kitchen game; its **stove part** only for games that cook with heat) → the game (its settings file
`data/stations/<game>.json` and its own mechanic in `js/cook/stations/<game>.js`).

**Owners for Sprint 18's wave 1:** (a) heat, burners, knobs and the boil sound, plus the worktop wash and the stone band; (b) pouring
and serving, plus the pans and their looks; (c) the shelf, its word chips and count pills; (d) lights and lessons; (e) the order's
flow and timings (sole owner of `js/cook/ui.js` and `js/shared/order-card.js` for the run); chai's owner (sole owner of
`js/cook/stations/chai-tray.js`, switching chai onto each piece as it lands, with `frozen.mjs --diff` after each switch).
"chai" below is `js/cook/stations/chai-tray.js`, "kk" `js/cook/kitchen-kit.js`, "lib" `js/cook/station-lib.js`, "ui"
`js/cook/ui.js`, "flow" `js/cook/flow.js`.

| # | Piece | Layer | Lives today | Moves to (target) | Owner | A game calls |
|---|---|---|---|---|---|---|
| 1 | Heat and boil: the knob, too early, the green window, boil-over, the heat tick | kitchen kit, stove part | chai 317, 1542-1757; `js/cook/mechanics/boil.js` | `js/cook/mechanics/boil.js` (grown), settings in the game's json | (a) | `Mech.boil(scene, pan, opts)` (new; the game passes its window and times) |
| 2 | Hob, burners, flames, the heat ring | kitchen kit, stove part | kk 88-124, 248-302, 372-404 | kk (stays) | (a) | `Cook.Kit.hob`, `.burner`, `.heatRing` |
| 3 | The boil's sound (the loop, its start and stop) | kitchen kit, stove part | chai 1666-1692; `js/shared/sfx.js` | `js/cook/mechanics/boil.js` calling `Sfx` | (a) | inside `Mech.boil` |
| 4 | Worktop wash, stone band | kitchen kit | chai 575-632; lib 225-251 | kk | (a) | `St.worktopWash`, `St.stoneBand` (kept as names) |
| 5 | Pans and their looks (empty, filling, colours) | kitchen kit | chai 641-768, 985-1223; kk 303-314 | kk (a `pan` part) | (b) | `Cook.Kit.place`, `Cook.Kit.pan` (new) |
| 6 | Pour or spoon from the shelf into a pan | kitchen kit | chai 1377-1541 | `js/cook/mechanics/pour.js` | (b) | `Mech.pour(...)` |
| 7 | Pan into its glass; take-back | kitchen kit | chai 1758-2081; `js/shared/pour.js` | `js/cook/mechanics/pour.js` on `NjgPour` | (b) | `NjgPour.plan` (chai 1970) |
| 8 | Serving: the review faces, the tick, recast | shared kit | chai 3207-3415; kk 178-247; lib 1129 | `js/shared/` (a serve part) or lib | (b) | `Cook.Kit.review`, `St.redo` |
| 9 | The shelf: decoys, size classes, slots | shared kit | chai 442-466, 793-984; lib 170-336 | lib, or a new shared shelf file the pantry can load (builder (c) names it) | (c) | `St.tableDecoys`, `St.classFit` |
| 10 | Word chips and pills | shared kit | chai 337-350, 827-955; kk 334-371 | the shelf's file | (c) | `Cook.Kit.chip`, `progress.pillShows` |
| 11 | Count pills | shared kit | ui 3901-4073; `js/shared/tally.js` | `js/shared/tally.js` | (c) | `UI.count`, `UI.tallyAt` |
| 12 | The word pop by the action; juice | shared kit | chai 1224-1376; `js/shared/juice.js` | `js/shared/juice.js` | (c) | `Juice.P` |
| 13 | Lights: the first time, the zoom-in, the next pan, the stuck rungs, the call-out | shared kit | `js/shared/onboard.js`; `js/cook/coach.js`; chai 351-441, 2118-2807 | `js/shared/onboard.js`, `js/cook/coach.js` | (d) | `Onboard.light`, `Onboard.stuck`, `Cook.Coach.rungs` |
| 14 | Reveal lessons (the dots, the blur) | shared kit | chai 2946-3206 | `js/shared/onboard.js` (a lessons part) | (d) | `Onboard.lesson(kind, sel)` (new) |
| 15 | The order's flow and timings: said, pop-out, fold, follow, ticks, skip | shared kit | ui 1478-2679, 2894-3815; `js/shared/order-card.js`; `js/shared/request-popup.js`; flow 437-526 | ui, `js/shared/order-card.js` (stay) | (e) | `UI.mission.introduce`, `.tickItem`; `UI.followCard` |
| 16 | The side panel: Nani's box, the helper, the stepper, fit | shared kit | ui 633-1166; `js/shared/guide.js`; `js/shared/frame.js:223-258` | stays | (e) | `UI.step`, `UI.helperOpen` |
| 17 | Bubbles | shared kit | ui 400-632; request-popup 434-712 | stays | (e) | `UI.say`, `Lifecycle.bubble.place` |
| 18 | People say their orders | shared kit | chai 2082-2117, 2937-2945 | ui | (e) | `UI.readAlong` |
| 19 | The word moment | shared kit | `js/shared/word-moment.js`; ui 77-165; flow 455, 1781 | built | - | `UI.wordMoment(ids)` |
| 20 | The progress snapshot | shared kit | `js/core/progress.js:301-310`; flow 439, 737 | built | - | `progress.freeze()`, `.thaw()` |
| 21 | The closing scene, the end screen | shared kit | flow 282-306, 735-786; `js/shared/results.js` | built | - | Lifecycle's end |
| 22 | Mic serve | game | chai 2805-2883 | stays | chai's owner | - |
| 23 | Chai's recipe, levels, the level-up count | game | chai 243-336, 3416-3440; `data/stations/chai-tray.json` | the json grows; chai keeps its own mechanic | chai's owner | `Mech.combined`, `Cook.roundDone` |
| 24 | Test hooks | each layer | chai 769-792, 864, 892, 1587, 1675, 2012 | with each piece | each owner | `Cook.chaiPans` (kept for the checks) |

**What every kit builder adds:** its section on a lab page (`lab/kit.html` for shared pieces, the kitchen-kit lab page for kitchen
pieces: chai's owner makes its shell); no game name in its file (STD-F1-02); the game's data in the game's json, never in the kit;
the contract's per-game list (`build/sandbox/data/games.json`) when a check should judge a new game.

## Proof

Read from `docs/design-language/standard/f-build.md` F1 (s17-std5, line ranges at 34641d3, whose game files are main's
20261107T120301Z). The two pieces F1 left without an owner (the pans' looks, the worktop wash and stone band) were given one here
(the orchestrator, 7 Nov: pans travel with pouring, the worktop with the stove's scene). The "new" calls are targets the owners may
rename in their reports.
