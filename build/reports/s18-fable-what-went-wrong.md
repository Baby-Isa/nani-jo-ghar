# Sprint 18: why the kitchen games don't look like chai, and the round that fixes it

Fable (the judge; I built none of this), 8 Nov 2026, for Zafar. Flaws first.

## The short answer

Baking, eggs and corn are **not** on chai's kit for the thing you see first: the scene. They take the kit's lights, lessons, word
chip, review and order card, and draw the play area themselves (a counter photo, a photo kitchen, an oak table, a code-drawn tray,
a round glow). The kit has no scene piece a game must use, so seven of nine games skipped part of chai's kitchen; no brief named
the look, no check measures it, and the judge (me) was never asked.

## Game by game

Chai: marble worktop; the stone band and ledge along the bottom; every item in a slot on the ledge, its pill under it; one rounded
box lighting item and pill; hob and tray centred above; order card, side panel, serve, progress end.

**Baking**
| Looks | Side-on counter photo; the bowl floats before the cupboards; containers at y 820, below the counter's edge (470), so in front of the doors; a round glow over the kit's box clips the pill; no band or ledge |
|---|---|
| Kit | Coach.firsts/control/box/wrong/lessons, Kit.chip, Kit.review, St.tableDecoys, UI.mission, S.step |
| Own | `bk-bg`, the row (`x = 260 + i*1080/(n-1)`), bowl, jug, oven, cat, `onLight: S.glow(o, true, {bounce})` |

**Eggs**
| Looks | A photo kitchen over the stage; the egg bowl floats at left with its chip; hob and tray on the photo; no band |
|---|---|
| Kit | Kit.hob/art/heatRing/chip/badge, Coach.firsts/control/nextLight/wrong/lessons |
| Own | `eg-bg`, bowl and shakers at settings coordinates, the tray, `glowOn` → S.glow |

**Corn**
| Looks | Oak table; a **code-drawn** tray holding six bowls, labels edge to edge; the crate's huge light; no band |
|---|---|
| Kit | Kit.heatRing/chip/badge, Coach.*, St.steps/begin, NjgServe |
| Own | `S.setBg("cn-table")`, the tray graphics, the row, `glow` → S.glow |

**Daar**
| Looks | Jars at the bottom on bare grey, labels tiny; the chop step on a bare board; a code-drawn dial; no band or ledge |
|---|---|
| Kit | Shelf.slots, St.classFit, St.tableDecoys, Kit.review, Coach.control/wrong/lessons |
| Own | Its own pot and hob picture (no Kit.hob/burner), the gauge, glows |

**Chop**
| Looks | Bare marble, a gold strip at left, things fly in the air; no greeting at the start; no shelf |
|---|---|
| Kit | St.begin/end/redo, Coach.firsts/lessons, UI.mission |
| Own | The strip, the timer disc, the throws |

**Chaat**
| Looks | Band and pills; the chop step on a wood board; the bowl above; close to chai |
|---|---|
| Kit | Chop as a game, the band, Kit.chip |
| Own | The bowl and its layers (placeholders) |

**Samosa**
| Looks | Stone band without the ledge (heaps lie top-down, Zafar's S2/Q2), slots, pills; the plate a drawn circle; karahi on the kit hob |
|---|---|
| Kit | Kit.worktop, St.stoneBand, Shelf.slots, Kit.art/burner, Kit.review, Coach.nextLight/wrong/lessons |
| Own | The board, strips, the plate ring, several S.glow lights |

**Maani**
| Looks | Band without the ledge, piles and plates on it, pills; chakla and tawa above; close to chai |
|---|---|
| Kit | Kit.worktop, St.stoneBand, St.shelfFit, Kit.size, Coach.firsts/wrong/lessons |
| Own | Its own slot placement (no Shelf.slots), its own control lights (no Coach.control) |

**Sekelo**
| Looks | Band with pieces and pills; board and tray above; a blank start frame; close to chai |
|---|---|
| Kit | St.begin/end/steps/redo, Coach.firsts/lessons; the band in its mechanic files (not read in full) |
| Own | The rack and skewers (its mechanic) |

## What went wrong, and why

1. **The kit has no scene.** `Kit.worktop`, `St.stoneBand`, `Shelf.slots`, `St.classFit` and `Shelf.P.chip` are separate calls;
   the numbers that make them chai's kitchen live in chai-tray.js. Nothing forces a game to call any of them.
2. **The briefs named functions, not the look.** "Take the kits for … the shelf and pills…": a builder read that as `Kit.chip`
   and was done. The same brief sent the three prototypes to "its art from settings.assets (assets/cook/proto/…)", their own
   scenes; Zafar's 1 Nov "side-on, like the mock-up" was read as "keep the photo". Acceptance was "0 contract breaks, copied code
   deleted", and every builder met it.
3. **The kit allowed a second light.** `Cook.Coach.control` takes `onLight` ("the game's own glow"); baking, eggs and corn pass
   `S.glow`, the old round halo, so the kit's box and a circle draw together. Baking's box is the container alone, not container
   plus pill as chai's.
4. **No check measures the scene.** The contract measures text size, tap size, one thing per light (53), the box hugging (92),
   ends reached; nothing asks whether there is a band, items on its base line, pills at the chip line, one light layer. The rules
   for this are judge-only on chai (E3-03) or "gap", and builders scored their own gap pages: baking wrote E3-03 "dbd: his
   mock-up", corn "Decision". A builder cannot declare different-by-design.
5. **The judging (mine).** Both batches asked "clipped, English, one light, card readable, mechanic visible". I passed baking's
   film with "the atto jar alone in a gold ring" and never said the ring was not the kit's box, nor that nothing stood on a shelf.
   I answered the question asked, with no chai frame beside any game.
6. **Merging.** Seven games merged in one hour on "0 breaks at 1280x665", eight builders to one orchestrator, no look at any game
   beside chai; "all eight games on the kits" was true of the calls and false of the picture. Built was proven by grep, not by eye.

## The plan: one more round, "every kitchen game in chai's kitchen"

**Order:** kit → checks → chai's switch → baking, eggs, corn → daar, chop → the four near ones → judge → publish. One day;
**$200-270**, beyond the sprint's budget (waves 1-3 spent about $395-570).

1. **Kit: one scene call** (Opus high, $30-40). `Cook.Kit.scene(S, {items, groups, backdrop?, ledge, hob?})` draws the wash,
   the band and ledge at `Shelf.BAND.base`, lays the items (`Shelf.slots` + `St.classFit`) and their pills at `BAND.chipY`, and
   returns `{shelf, band, play}`, the free worktop the game builds in. `scene.light(id)` lights item and pill as chai does.
   `Coach.control` loses `onLight`'s glow; `S.glow` leaves the stations. A `backdrop` (a picture between wash and band) is the
   only scenery a game may add. A lab section, every state.
2. **Checks first** (Sonnet high, $10-15). (a) A structural contract: a `Cook.kitScene()` hook reports band top and base, each
   item's foot, each pill's y, the lit layers; a break if a kitchen page past the order has no band, an item off the base line
   (±4 px), a pill off the chip line, or two light layers. (b) `kitmap` as a gate in `checks.mjs`: a station file calling
   `S.glow`, `add.graphics` for scenery or `add.image` for a background breaks. (c) `sidebyside.mjs`: chai's frame beside each
   game's at the same states (order-in-sidebar, kind-tap, serve) at 740x320 and 1280x665, with one fixed question for the judge:
   "Is this chai's kitchen? List every difference."
3. **Chai onto `Kit.scene`** (chai's owner, Opus high, $15-20) with the frozen diff: proves the scene is chai's.
4. **Per game**, two builders at a time, merged only when (a)-(c) pass: baking, eggs, corn (Opus high, $20-25 each: items onto
   the shelf, scenery to a backdrop or out, own lights out); daar ($20-25: jars on the ledge, pot onto the stove part); chop
   ($10-15: the shelf with what's coming, the greeting at the start); samosa, maani, sekelo, chaat (Sonnet high, $10-15 each: onto
   `Kit.scene`). Mechanics and timings untouched; eggs keeps its 8 Nov answers.
5. **Before building, the fast lane:** the scene lab page with chai's items, then baking's, eggs' and corn's in the same kitchen,
   my four-size check, his numbered choices below. No builder launches until he picks.

## Questions for Zafar (recommendation after each)

1. One kitchen scene for every game: band and ledge along the bottom, every pickable item in a slot on it with its pill, the
   game's own things on the worktop above? **Yes, no exceptions; the kit refuses a game without it.**
2. Baking's side-on counter (your 1 Nov "like the mock-up"): cupboards, oven and cat as a backdrop above the band, containers on
   the shelf; or chai's top-down worktop with the oven on it? **The backdrop: your design kept, nothing floats.**
3. Eggs' photo kitchen and corn's oak table: backdrop or chai's marble? **Marble for eggs (at the stove); the oak table as the
   stall's backdrop (outside the kitchen).**
4. Samosa's top-down heaps with no ledge (your S2/Q2): keep? **Keep, dated as yours; every other game has the ledge.**
5. Chop: the things to chop start on the shelf and fly from it? **Yes; the mechanic unchanged.**
6. Builders this round: two at a time (CLAUDE.md) or more? **Two, after the kit builder; every merge looked at beside chai.**
7. Publish now, or after this round? **After: nothing reaches main until every game passes the side-by-side.**

## Proof

Pictures: the ten film sheets `build/screenshots/sandbox/s18-w3-films/films/cook-<game>@1280x665-sheet.png` and the ten phone
sheets `build/screenshots/sandbox/s18-w3-full/sheets/cook-<game>__740x320.png`. Code: `kitchen-kit.js` (whole); `chai-tray.js`
380-470, 565-700; `baking.js` 1-320; `eggs.js` 125-200, 520-545; `corn.js` 84-145; every station file's kit calls; the APIs of
`shelf.js`, `onboard.js`, `coach.js`, `station-lib.js`; `contract.mjs` 53/54/92. Docs: the sprint file, the module map, the
standard (README, E2-08, E3-01..05, F1-03) and every gap page's rows for them, the wave 2 briefs, reports `s18-g-{baking,eggs,
corn}`, `s18-kit-{a,c}`, `s18-w3-fable-verdicts`, `audit-standard-baking`, the judge batches, the 1 Nov prototype notes, commit 0259e67e.
