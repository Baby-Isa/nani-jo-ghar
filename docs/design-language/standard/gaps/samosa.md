# Samosa: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-samosa), before any build. `node build/tools/review/audit.mjs --standard samosa` (205
House and Family rules; no contract run, no saved checks: 2 pass, 22 fail, 26 judge, 36 gap, 119 not run), then my read of the game
(`js/cook/stations/samosa.js`, `js/cook/mechanics/fill-fold.js` Cook.Pastry, its lab tile, `data/stations/samosa.json`). Samosa is
one combined station in three jobs: fill six strips from the heaps, one tick; fold each by swipe; fry in the karahi and lift with the
jharo. Its own rows are closed (SAM-28 the last, on the s14 kit); the brief's ART-38 is baking's word moment, not samosa's.

**Counts (before):** 0 n/a 11 · 1 missing 24 · 2 built, unproven 164 · 3 check green 4 · 4 judged 0 · 5 done 0 · dbd 2.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece: all five are switched on chai) · Game code · Art · Words ·
Decision · Check. Scope: H House, F Family. Audit: what `--standard samosa` printed.

## Not to touch (non-negotiable 1, the keep list)

- The fill: six strips on the big board at every level (SAM-25), any strip tapped, a spoonful a tap, a mound tapped takes one
  back, the one tick that grades every strip (SAM-24), decision 51 strip by strip.
- The fold: the swipe along each arrow, only the moving flap lit, the coded fold in the pastry tile (SAM-21, SAM-16), no dashed
  line, no red dot (KEEP-04); the folded ones onto the plate's flat middle.
- The fry: the wide hob, the knob that turns the fire on and off (SAM-13), the oil, adding samosas, the ring, the jharo sliding
  under and riding onto the plate (KEEP-03, KEEP-13: "samosa fry and frying handle").
- KEEP-01: the underline while a line is spoken; the order card and pop-up.

## What the build does (this sprint, in this order)

1. **Game code:** its own numbers (the grid's places, the art's measures, the heaps' pictures, the strips) into
   `data/stations/samosa.json`; the copies deleted (STD-F1-02): `pop()` onto the shared word pop (`Juice.P.pop`), `backdrop()` onto
   the kitchen kit's worktop wash and stone band (`Cook.Kit.worktop`, `St.stoneBand`), the order said again through
   `UI.personSay`, `asTally` once (`Cook.Pastry.tally`), INK and FONT gone with them, the dead "not quite" serve path.
2. **Adopt (d):** the reveal lessons (`Cook.Coach.lessons`) before the first spoon; `Cook.Coach.wrong` on a wrong strip.
3. **Asks** for what samosa needs and the kit or the central files lack go in the report (the fry's window at L3-L4, L4's row).

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | fill, the fold swipe (KEEP-04) and the fry (KEEP-03, KEEP-13) kept; no diff tool yet |
| STD-01-02 | H | not run | 2 | Words | lines from the engine (guide-fill, -fold, -fire, -fry; the lift line); the recording sheet's samosa gaps |
| STD-01-03 | H | not run | 2 | Check | contract-16 never run on cook:samosa this sprint |
| STD-01-04 | H | not run | 2 | Check | leak config in data/cook.json (samosa); never run this sprint |
| STD-01-05 | H | judge | 1 | Check | never judged on the kits |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | not run | 2 | Check | L1 one gentle oops; a pale samosa goes back in, a dark one is swapped (decision 51) |
| STD-01-08 | H | not run | 1 | Art | the coded fold in the pastry tile and the v3 heaps stand in (decision 7); the fill and fold art to come |
| STD-01-09 | H | not run | 2 | Check | savoury samosas, halal fillings (keema, potato, peas) |
| STD-02-01 | H | gap | 2 | Check | no child-pace play on the kits |
| STD-02-02 | H | not run | 2 | Check |  |
| STD-02-03 | H | not run | dbd | Decision | the fold is a swipe along its arrow (a fixed track, SAM-16, KEEP-04); the rest taps |
| STD-02-04 | H | fail | 1 | Check | the panel audit (3 Nov): SH-169 at 740x320 and 930x430 L3-L4, SH-191 1280x665 L3-L4, SH-192 930x430 L2 (the shared card) |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 2 | Check | a round brings the base, one to three fillings and the count; no exposure count yet |
| STD-A1-02 | H | not run | 2 | Check | the host's request pop-up and card (kit e) |
| STD-A1-04 | H | judge | 2 | Check | varied orders from the samosa recipe's frames |
| STD-A1-05 | H | not run | 0 | none | no speaking moment |
| STD-A2-01 | H | not run | 2 | Check | the shared card (kit d, e) |
| STD-A2-02 | H | not run | 2 | Check | the shared card |
| STD-A2-03 | H | fail | 1 | Kit | (d), the blur rule |
| STD-A2-04 | H | not run | 2 | Check | the shared card |
| STD-A2-05 | H | not run | 2 | Check | the shared card |
| STD-A3-01 | H | fail | 0 | none | counts, no amounts |
| STD-A3-02 | H | fail | 0 | none |  |
| STD-A3-03 | H | gap | 0 | none |  |
| STD-A3-04 | H | judge | 0 | none |  |
| STD-A4-01 | H | not run | 2 | Words | the word pop says the engine's tally line ("ba chundo") |
| STD-A4-02 | H | not run | 2 | Words | grey English from the card kit |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 2 | Check | people, the order, fill, fold, fry, the review face, the end |
| STD-B1-02 | H | not run | 2 | Check | one asker; the review face over the plate (Kit.review on NjgServe) |
| STD-B1-03 | H | not run | 2 | Check | the host's order (kit e) |
| STD-B1-04 | H | not run | 2 | Check | the "no" filling at L4; kit e's O.ladder puts it last |
| STD-B1-05 | H | not run | 2 | Check | the host's skip zone |
| STD-B1-06 | H | not run | 2 | Check | the fry ends on the last lift; the fill on the one tick (SAM-24, his) |
| STD-B1-07 | H | fail | 2 | Check | samosa never calls passMeAfter |
| STD-B2-01 | F | pass | 3 | Check | audit pass: fried in the karahi, served on the plate |
| STD-B2-02 | H | gap | 2 | Check | tap, swipe, tap at every level |
| STD-B2-03 | F | gap | 2 | Check | the ring round each samosa in the oil |
| STD-B2-04 | F | not run | 2 | Check | a pale lift goes back in and fries on; a dark one is swapped for a fresh one |
| STD-B2-05 | F | gap | 1 | Decision | the ring's green is lo..hi: at L3-L4 0.12 / 0.26 = 0.5 s at the top rate (data/cook.json mechanics.fry, not mine); golden scores to burnAt (1.8 s) |
| STD-B2-06 | F | not run | 2 | Check | up to six in the oil at once, any order |
| STD-B2-07 | H | not run | 2 | Check | a tap during a pop or a spoon's flight lands |
| STD-B2-08 | H | gap | 2 | Check | decision 51 strip by strip; the third shows the right way |
| STD-B2-09 | F | not run | 0 | none | nothing spills |
| STD-B2-10 | H | pass | 2 | Check | a mound tapped takes a spoon back until the tick |
| STD-B2-11 | F | not run | 0 | none | no pour |
| STD-B3-02 | H | not run | 2 | Check | nothing refused: the tick grades (SAM-24) |
| STD-B3-03 | F | not run | 0 | none | spoons are counts |
| STD-B4-01 | H | not run | 2 | Check | pop, puff, flip, sizzle |
| STD-B4-02 | H | not run | 2 | Check | the knob's sound only on its tap |
| STD-B4-03 | F | not run | 2 | Check | the oil shimmers and sizzles; the colour turns |
| STD-B4-04 | H | not run | 2 | Check |  |
| STD-B4-05 | H | gap | 2 | Check | graded at the tick; L1 one gentle word |
| STD-B4-06 | H | not run | 2 | Check | badges and praise |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | no pair named for samosa (chundo and bataato?) |
| STD-C1-02 | H | gap | 2 | Check | the fillings said in the order before the fill |
| STD-C2-01 | H | not run | 2 | Check |  |
| STD-C2-02 | H | not run | 2 | Check | six strips at every level (SAM-25, his); counts from the recipe |
| STD-C2-03 | H | not run | 2 | Check | St.tableDecoys: the rules' 1-4, a lookalike at L4 |
| STD-C2-04 | H | not run | 2 | Check | the "no" filling at L4 only |
| STD-C2-05 | H | not run | 2 | Check | the shared card |
| STD-C2-06 | H | not run | 1 | Decision | fry knobs have three levels: L4 = L3 (data/cook.json) |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Check | Cook.roundDone |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Check | markRight on the first tick only, never while guided |
| STD-C3-02 | H | not run | 2 | Check | the shared ladder |
| STD-C3-03 | H | not run | 2 | Check | the shared ladder |
| STD-C3-04 | H | not run | 2 | Check | Cook.chipWord under each heap |
| STD-C3-05 | H | not run | 2 | Check | the host's freeze and thaw |
| STD-C3-06 | H | not run | 2 | Check | kit e |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 2 | Check | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check |  |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 2 | Check | data.onboard.samosa and .fry through St.coach, once |
| STD-D1-02 | H | not run | 2 | Check | the coach's light |
| STD-D1-03 | H | not run | 2 | Check |  |
| STD-D1-05 | H | gap | 2 | Check | the knob's light |
| STD-D1-06 | H | not run | 2 | Check |  |
| STD-D1-07 | H | fail | 1 | Adopt | (d) Cook.Coach.cardLight: never called |
| STD-D1-08 | H | fail | 1 | Adopt | (d) Cook.Coach.lessons: never called |
| STD-D1-09 | H | not run | 2 | Check | St.firstHold("fry:lift") holds the golden |
| STD-D1-10 | F | fail | 1 | Adopt | (d) Cook.Coach.nextLight on the next strip: never called |
| STD-D2-01 | H | not run | 2 | Check | St.steps |
| STD-D2-02 | H | not run | 2 | Check | the next filling of the strip, then the next strip |
| STD-D2-03 | H | not run | 2 | Check | St.acted |
| STD-D2-04 | H | not run | 2 | Check | every step has a call; a wrong move does not rush it (Cook.Coach.wrong never called) |
| STD-D2-05 | H | not run | 2 | Check |  |
| STD-D2-06 | F | not run | 2 | Check | the lift called as a samosa goes golden (L3 up) |
| STD-D3-01 | H | not run | 2 | Check | the shared box |
| STD-D3-02 | H | fail | 2 | Check | steps.to's help glow on the heap or strip |
| STD-D3-03 | H | not run | 2 | Check |  |
| STD-D3-04 | H | not run | 2 | Check |  |
| STD-D3-05 | H | fail | 2 | Check | the shared box |
| STD-D4-01 | H | not run | dbd | Decision | rows tick at the one tick, every kind at once (SAM-24, SAM-27: his, 30 Oct) |
| STD-D4-02 | H | fail | 2 | Check | the shared card |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check | the shared cog |
| STD-D5-03 | H | not run | 2 | Check |  |
| STD-D5-04 | H | not run | 2 | Check |  |

## E Presentation

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-E1-01 | H | fail | 2 | Check | the design grid scaled by height |
| STD-E1-02 | H | fail | 2 | Check | the shared panel |
| STD-E1-04 | H | fail | 1 | Kit | SH-169: the current card's head out of view at 740x320 and 930x430 L3-L4 (the shared card) |
| STD-E1-05 | H | not run | 2 | Check | the jharo turned clear of the plate |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check | the word pop: its own text, never wrapped |
| STD-E2-03 | H | fail | 1 | Kit | SH-191, SH-192 (the shared card) |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | not run | 2 | Check |  |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check | Kit.review's face |
| STD-E2-08 | H | not run | 2 | Check |  |
| STD-E3-01 | H | not run | 2 | Check | the heaps one size; the strips the board's |
| STD-E3-02 | H | fail | 1 | Art | the fold is code-drawn in the pastry tile (SAM-21, his: placeholder, decision 7); the oil's bubbles are code dots |
| STD-E3-03 | F | not run | 1 | Adopt | (a) the band is a flat panel fill: the stone band and the worktop wash not taken |
| STD-E3-04 | F | not run | 2 | Check | the karahi centred on the wide burner |
| STD-E3-05 | F | gap | 0 | none | no one at a counter |
| STD-E4-01 | H | fail | 2 | Check |  |
| STD-E4-02 | H | not run | 2 | Check | the host's pop-out |
| STD-E4-03 | F | gap | 2 | Check | raw, light, golden, too dark in the fry pictures |
| STD-E4-04 | H | gap | 2 | Check | the fold settles over 150-220 ms |
| STD-E5-01 | H | not run | 2 | Check |  |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | 2 | Check | the pop says the word after a spoon lands |
| STD-E6-01 | H | not run | 1 | Game code | its own word pop and wash read tokens through copied INK and FONT; literals 0x28190a, 0x2a1a0a, 0xffe3a0 |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 1 | Game code | its own copies of the word pop, the worktop and band, the order's say-again |
| STD-F1-02 | H | not run | 1 | Game code | copied: pop() (chai's word pop), backdrop() (the old worktop and band), asTally (twice, in fill-fold.js too), INK and FONT, clock() |
| STD-F1-03 | H | gap | 1 | Game code | its numbers (layout, art measures, the heaps) in samosa.js, not data/stations/samosa.json |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Check | on the kit's hob, burner, heat ring, chip, review, decoys, redo; its own pop and backdrop |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 2 | Kit | decoys from the rules; the fry and fold knobs in data/cook.json mechanics |
| STD-F2-03 | F | gap | 1 | Game code | as F1-03 |
| STD-F2-04 | H | gap | 2 | Check | the 1600x900 design grid, its derivations in comments |
| STD-F3-01 | H | fail | 2 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Check | the host's |
| STD-F3-04 | H | fail | 0 | none | no scrolling list |
| STD-F3-05 | H | not run | 2 | Check | z.expect, nextMove |
| STD-F3-06 | H | judge | 2 | Check | life.js timers; its ticks stopped |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 2 | Check | warm(): its own pictures as the file loads; loadcheck |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | not run | 2 | Check | CK-48: drawn as the view comes up |
| STD-F4-06 | H | not run | 2 | Check | St.loadArt |
| STD-F5-01 | H | gap | 2 | Check | the lab tile at L1-L4 |
| STD-F5-02 | H | not run | 2 | Check | z.progress, z.listen, steps |
| STD-F5-03 | H | not run | 1 | Kit | no fill, fold or fry section on the kitchen-kit lab page |

## G Proof

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-G1-01 | H | gap | 2 | Check |  |
| STD-G1-02 | H | judge | 2 | Check |  |
| STD-G1-03 | H | judge | 2 | Check |  |
| STD-G1-04 | H | not run | 2 | Check |  |
| STD-G1-05 | H | not run | 2 | Check |  |
| STD-G1-06 | H | fail | 2 | Check |  |
| STD-G1-07 | H | gap | 1 | Check | wave 3 |
| STD-G1-08 | H | not run | 2 | Check |  |
| STD-G1-09 | H | not run | 2 | Check | as 01-04 |
| STD-G2-01 | H | not run | 2 | Check |  |
| STD-G2-02 | H | judge | 2 | Check |  |
| STD-G2-03 | H | not run | 2 | Check |  |
| STD-G2-04 | H | not run | 2 | Check |  |
| STD-G2-05 | H | not run | 2 | Check |  |
| STD-G2-06 | H | gap | 2 | Check |  |
| STD-G2-07 | H | not run | 2 | Check |  |
| STD-G2-08 | H | gap | 0 | none | chai only |
| STD-G3-01 | H | judge | 1 | Check | wave 3 |
| STD-G3-02 | H | judge | 1 | Check | wave 3 |
| STD-G3-03 | H | judge | 2 | Check |  |
| STD-G3-04 | H | not run | 2 | Check |  |
| STD-G3-05 | H | gap | 2 | Check |  |
| STD-G4-01 | H | not run | 2 | Check |  |
| STD-G4-02 | H | judge | 2 | Check |  |
| STD-G4-03 | H | gap | 2 | Check |  |
| STD-G4-04 | H | gap | 2 | Check |  |
| STD-G4-05 | H | gap | 2 | Check |  |
| STD-G4-06 | H | gap | 2 | Check |  |
| STD-G4-07 | H | judge | 2 | Check |  |

## H Supply

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-H1-01 | H | judge | 2 | Art | heaps, board, karahi, plate, jharo from runs; the fold coded |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 1 | Art | the fill and fold block not queued with sizes |
| STD-H1-05 | H | not run | 2 | Art | the pastry tile stands in for the fold (decision 7) |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | the recording sheet's samosa lines |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 2 | Words |  |
| STD-H2-05 | H | not run | 2 | Check |  |
| STD-H3-01 | H | judge | 2 | Check |  |
| STD-H3-02 | H | judge | 2 | Check |  |
| STD-H3-03 | F | judge | 2 | Check |  |
| STD-H3-04 | H | gap | 3 | Check | this page |
| STD-H3-05 | H | judge | 3 | Check | "Not to touch" above |
| STD-H3-06 | H | judge | 2 | Check |  |
| STD-H3-07 | H | judge | 2 | Check |  |
| STD-H4-01 | H | judge | 2 | Check |  |
| STD-H4-03 | H | not run | 2 | Check |  |
| STD-H4-04 | H | not run | 2 | Check |  |
| STD-H4-05 | H | judge | 2 | Check |  |
