# Chaat: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-chaat), before any build. `node build/tools/review/audit.mjs --standard chaat` (205 House
and Family rules; no contract run, no saved checks: 2 pass, 14 fail, 26 judge, 36 gap, 127 not run), then my read of chaat's code
(`js/cook/mechanics/assemble.js`, its recipe in `data/cook.json` recipes.chaat, its knobs in data.mechanics.assemble, its leak bot
`build/leak_chaat.mjs`). Chaat is a recipe: the chop step (today the chop mechanic run straight as a station, `"do": "chop"`), then
the bowl (assemble). Scores are for the chaat round; chop's own rules are on `gaps/chop.md`.

**Before the build (8 Nov):** 205 rules: 0 n/a 25 · 1 missing 25 · 2 built 150 · 3 green 5 · 4-5 none.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece chai already runs on: (a) the worktop, (b) serving, (c) the
shelf, pills and word pop, (d) lights and lessons, (e) the order's flow) · Game code · Art · Words · Decision · Check.
Scope: H House, F Family. Audit: what `--standard chaat` printed.

## Not to touch (non-negotiable 1, the keep list)

- The bowl itself: the side-on glass bowl, the layers going in bottom first in the order said, each a strip of its food; a spoonful
  lifting off its pot and dropping in; the bowl's top layer taken back with a tap until the bowl moves on; a wrong thing going in,
  the little pause, the warm wobble and back out (CHT-14, Zafar 21 Oct: the right ones stay in and stay ticked); the bowl served by
  itself once complete and right (SH-105); the third wrong try showing the right way (decision 51); L4's folded card, a peek a hint.
- The order: the dish asked first, the prep next, the layer order said just before the bowl (decision 87 (1), CHT-07); "ba
  bataato" a layer said twice counting twice (CHT-17); 3, 4, 5, 6 spoons by level.
- KEEP-01 (the underline while a line is spoken; the order card and pop-up "the bar we want to set").

## What the build does (this sprint, in this order)

1. **Game code:** `data/stations/chaat.json` (new): the bowl's measures, the pots and strips, the layers' thickness, the shelf's and
   the bowl's layout, the motions' times; `assemble.js` reads it and keeps only the bowl's own code.
2. **Adopt (a):** the worktop and the stone band (`Cook.Kit.worktop`, `St.stoneBand`) for chaat's own fill and band.
3. **Adopt (c):** the word pills (`Shelf.P.chip`, `Shelf.pillWant`, `.pillScale`), the speaker (`Shelf.P.speaker`), the word pop
   (`Juice.P.pop`); chaat's speaker, chip and pop drawing deleted.
4. **Adopt (d), (e), (b):** the first-time gate and the reveal lessons (`Cook.Coach.firsts`, `.lessons`), a wrong drop rushing the
   hint (`Cook.Coach.wrong`); the recast through `UI.personSay`; the review faces through `NjgServe`.
5. **The chop step as chop's own game** (`Cook.Chop.play`): an ask (chop's files are the daar builder's; the recipe's run is the
   orchestrator's). CHT-13, CHT-04 (the side-on bowl and its layers) stay on art: the s08b strips are the placeholders.

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | the bowl, its take-back, the wobble and the auto-serve kept (above); no diff tool yet |
| STD-01-02 | H | not run | 2 | Words | the order and the layer calls from the engine (Cook.Order.speech, St.addLine) |
| STD-01-03 | H | not run | 2 | Check | written words only on the pills and the card; contract-16 not run on cook:chaat |
| STD-01-04 | H | not run | 2 | Check | `build/leak_chaat.mjs` reads CHAAT_RULES; not in a saved run |
| STD-01-05 | H | judge | 1 | Check | the bowl never judged on the kits |
| STD-01-06 | H | not run | 2 | Check | its own pills and pop drawn in the game (Adopt (c)) |
| STD-01-07 | H | not run | 2 | Check | warm wobble, never red; take-back until the step moves on |
| STD-01-08 | H | not run | 2 | Art | pots, strips and bowl from runs; the side-on bowl redraw waits (CHT-13) |
| STD-01-09 | H | not run | 2 | Check | halal toppings; praise only |
| STD-02-01 | H | gap | 2 | Check | no child-pace play of the bowl |
| STD-02-02 | H | not run | 2 | Check | pots show their food; the pill speaks |
| STD-02-03 | H | not run | 2 | Check | taps only in the bowl (the chop's swipe is chop's dbd) |
| STD-02-04 | H | not run | 2 | Check | CHT-17's 740x320 L4 labels (reopened) |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 1 | Decision | L1 meets three toppings plus chop's vegetables; no count of new words per round |
| STD-A1-02 | H | not run | 2 | Adopt | (e): the layer order said from his card just before the bowl |
| STD-A1-04 | H | judge | 2 | Check | varied orders: base first, toppings shuffled, "no" from L2 |
| STD-A1-05 | H | not run | 0 | none | no speaking moment |
| STD-A2-01 | H | not run | 2 | Adopt | (d) |
| STD-A2-02 | H | not run | 2 | Adopt | (e) the card |
| STD-A2-03 | H | fail | 1 | Kit | (d), the blur rule |
| STD-A2-04 | H | not run | 2 | Kit | (d) |
| STD-A2-05 | H | not run | 2 | Kit | (d) |
| STD-A3-01 | H | fail | 0 | none | no amounts (a double portion is a count said with its number) |
| STD-A3-02 | H | fail | 0 | none |  |
| STD-A3-03 | H | gap | 0 | none |  |
| STD-A3-04 | H | judge | 0 | none |  |
| STD-A4-01 | H | not run | 2 | Words |  |
| STD-A4-02 | H | not run | 2 | Words | grey English from the card kit; the pills and pop show the display word |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 2 | Check | the dish asked, the chop, the layer order, the bowl, the face, the end |
| STD-B1-02 | H | not run | 2 | Check | one bowl to its asker (the review face) |
| STD-B1-03 | H | not run | 2 | Adopt | (e) |
| STD-B1-04 | H | not run | 2 | Check | "no" rows last (kit e's O.ladder on Rules.noLast) |
| STD-B1-05 | H | not run | 2 | Check | contract-95 not run on cook:chaat |
| STD-B1-06 | H | not run | 3 | Check | SH-105: complete and right goes by itself (code); Done stays for a short bowl |
| STD-B1-07 | H | fail | 2 | Check | chaat never calls pass-me; the audit reads the recipe's knob |
| STD-B2-01 | F | pass | 0 | none | nothing cooks in the bowl |
| STD-B2-02 | H | gap | 2 | Check | one tap for every layer, every level |
| STD-B2-03 | F | gap | 0 | none | no timed action in the bowl |
| STD-B2-04 | F | not run | 0 | none | no window |
| STD-B2-05 | F | gap | 0 | none |  |
| STD-B2-06 | F | not run | 0 | none | one bowl |
| STD-B2-07 | H | not run | 2 | Check | a tap waits only for the spoon in flight (busy) |
| STD-B2-08 | H | gap | 2 | Check | St.redo: the wrong layer out, its rows said again, the third shown |
| STD-B2-09 | F | not run | 0 | none | nothing lost |
| STD-B2-10 | H | pass | 3 | Check | the top layer back with a tap until the bowl moves on; first try scored |
| STD-B2-11 | F | not run | 0 | none | no pour |
| STD-B3-02 | H | not run | 2 | Check | one past its count bounces back out (judgeDrop) |
| STD-B3-03 | F | not run | 0 | none |  |
| STD-B4-01 | H | not run | 2 | Check | the pop sound, the spoon, the layer |
| STD-B4-02 | H | not run | 0 | none | no control |
| STD-B4-03 | F | not run | 0 | none |  |
| STD-B4-04 | H | not run | 2 | Check | the face after the last layer settles |
| STD-B4-05 | H | gap | 2 | Check | judged as it goes in (CHT-14, his): the wobble is the thing's own, no verdict word |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | no pair named for chaat (the two chutneys, amli and lili?) |
| STD-C1-02 | H | gap | 1 | Kit | dai, amli, lili are first met here (d: the general first meeting) |
| STD-C2-01 | H | not run | 2 | Check |  |
| STD-C2-02 | H | not run | 2 | Check | 3, 4, 5, 6 spoons from the rules (count.games.chaat) |
| STD-C2-03 | H | not run | 2 | Check | St.tableDecoys on the rules: 1-4, the "no" counting as one |
| STD-C2-04 | H | not run | 2 | Check | L1 none (the recipe's no slot by level) |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 1 | Game code | the spoon's flight one time at every level (flyMs) |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Adopt |  |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Adopt | Cook.markRight on a first-go layer only |
| STD-C3-02 | H | not run | 2 | Adopt |  |
| STD-C3-03 | H | not run | 2 | Adopt |  |
| STD-C3-04 | H | not run | 2 | Adopt | Cook.chipWord on the pill ladder (progress.pillShows) |
| STD-C3-05 | H | not run | 2 | Adopt |  |
| STD-C3-06 | H | not run | 2 | Adopt | (e) |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 1 | Kit | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check |  |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 2 | Adopt | its own save key (coached "assemble-v2"); the kit's gate (d) |
| STD-D1-02 | H | not run | 1 | Decision | the first time is chaat's own ghost demo (row, pot, drop, tick), not the kit's light |
| STD-D1-03 | H | not run | 2 | Adopt | (d) |
| STD-D1-05 | H | gap | 0 | none | the pots are whole things |
| STD-D1-06 | H | not run | 1 | Adopt | (d) |
| STD-D1-07 | H | fail | 1 | Adopt | (d) the card light |
| STD-D1-08 | H | fail | 1 | Adopt | (d) Cook.Coach.lessons before the first layer |
| STD-D1-09 | H | not run | 0 | none | no timed control |
| STD-D1-10 | F | fail | 0 | none | one bowl a round |
| STD-D2-01 | H | not run | 2 | Adopt | (d); St.steps calls the next layer as it opens |
| STD-D2-02 | H | not run | 2 | Check | the next layer is C.next, the order's own |
| STD-D2-03 | H | not run | 2 | Adopt | (d) |
| STD-D2-04 | H | not run | 1 | Adopt | (d) Cook.Coach.wrong on a wrong drop |
| STD-D2-05 | H | not run | 2 | Adopt | (d) |
| STD-D2-06 | F | not run | 0 | none |  |
| STD-D3-01 | H | not run | 2 | Adopt | (e) |
| STD-D3-02 | H | fail | 2 | Adopt | (e) the helper card |
| STD-D3-03 | H | not run | 2 | Adopt | (e) |
| STD-D3-04 | H | not run | 2 | Adopt | (e) |
| STD-D3-05 | H | not run | 2 | Adopt | (e) |
| STD-D4-01 | H | not run | 2 | Check | a layer ticks its row as it goes in |
| STD-D4-02 | H | fail | 2 | Adopt | (e) |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check |  |
| STD-D5-03 | H | not run | 1 | Adopt | its own save key is not the kit's first-time gate (D1-01) |
| STD-D5-04 | H | not run | 2 | Check |  |

## E Presentation

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-E1-01 | H | not run | 2 | Check |  |
| STD-E1-02 | H | not run | 2 | Check |  |
| STD-E1-04 | H | not run | 2 | Check |  |
| STD-E1-05 | H | not run | 2 | Check | CHT-17: L4 ten pots' labels at 740x320 |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Adopt | (c) the pills' floor and scale, for its own wrap (CHT-17) |
| STD-E2-03 | H | not run | 2 | Check |  |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | not run | 2 | Check |  |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Adopt | (b) the review face |
| STD-E2-08 | H | not run | 2 | Check |  |
| STD-E3-01 | H | not run | 2 | Check | identical pots in one camera |
| STD-E3-02 | H | fail | 1 | Art | the shelf plank and the worktop fill are code-drawn (Adopt (a)); the bowl's layers wait on CHT-13 |
| STD-E3-03 | F | not run | 1 | Adopt | (a) its own page-colour fill and parchment band, not the marble wash and the stone |
| STD-E3-04 | F | not run | 0 | none | no hob |
| STD-E3-05 | F | gap | 0 | none | the review face only |
| STD-E4-01 | H | fail | 2 | Check | spoon flights and settles ease |
| STD-E4-02 | H | not run | 2 | Adopt | (e) |
| STD-E4-03 | F | gap | 0 | none | nothing changes with time |
| STD-E4-04 | H | gap | 2 | Check | the right way shown layer by layer |
| STD-E5-01 | H | not run | 2 | Check |  |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | 2 | Check | the layer call is said as its step opens |
| STD-E6-01 | H | not run | 1 | Game code | INK's literal colours, the ghost's own finger and ring |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 1 | Adopt | its own pills, speaker, pop and band where the kits have them |
| STD-F1-02 | H | not run | 1 | Game code | speaker, chip, pop, band copied from chai v2 |
| STD-F1-03 | H | gap | 1 | Game code | no settings file: its numbers are code constants |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Check | old code only (no piece half-switched) |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 2 | Check | counts and decoys from the rules |
| STD-F2-03 | F | gap | 1 | Game code | as F1-03 |
| STD-F2-04 | H | gap | 2 | Check | design px on the 1600x900 box |
| STD-F3-01 | H | fail | 2 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Adopt |  |
| STD-F3-04 | H | not run | 0 | none |  |
| STD-F3-05 | H | not run | 2 | Check | z.expect |
| STD-F3-06 | H | judge | 2 | Check |  |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 2 | Check | loadcheck; St.loadArt asks only what is on the shelf |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | not run | 2 | Check |  |
| STD-F4-06 | H | not run | 2 | Check | St.loadArt's real-time cap |
| STD-F5-01 | H | gap | 2 | Check | the lab's Chaat bowl tile at L1-L4 |
| STD-F5-02 | H | not run | 2 | Check | chaat-drop notes, Cook.undoAt |
| STD-F5-03 | H | not run | 0 | none | no kit piece of its own |

## G Proof

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-G1-01 | H | gap | 2 | Check |  |
| STD-G1-02 | H | judge | 2 | Check |  |
| STD-G1-03 | H | judge | 2 | Check |  |
| STD-G1-04 | H | not run | 2 | Check |  |
| STD-G1-05 | H | not run | 2 | Check |  |
| STD-G1-06 | H | not run | 2 | Check |  |
| STD-G1-07 | H | gap | 1 | Check | wave 3 |
| STD-G1-08 | H | not run | 2 | Check |  |
| STD-G1-09 | H | not run | 2 | Check | leak_chaat.mjs |
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
| STD-H1-01 | H | judge | 2 | Art | pots, strips and the bowl from runs |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 1 | Art | CHT-13's side-on bowl and its layers: no block with sizes yet |
| STD-H1-05 | H | not run | 2 | Art | the s08b strips and the tomato pot stand in (CHT-13, CHT-04) |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | the toppings' words on the sheet where missing |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | dai, amli, lili confirmed; sev, dhania to check |
| STD-H2-05 | H | not run | 2 | Check |  |
| STD-H3-01 | H | judge | 2 | Check |  |
| STD-H3-02 | H | judge | 2 | Check |  |
| STD-H3-03 | F | judge | 2 | Check |  |
| STD-H3-04 | H | gap | 3 | Check | this page |
| STD-H3-05 | H | judge | 3 | Check | "Not to touch" above |
| STD-H3-06 | H | judge | 2 | Check |  |
| STD-H3-07 | H | judge | 2 | Check |  |
| STD-H4-01 | H | judge | 2 | Check |  |
| STD-H4-03 | H | not run | 2 | Check | CHT-13, CHT-04, CHT-16 labelled waiting on art |
| STD-H4-04 | H | not run | 2 | Check |  |
| STD-H4-05 | H | judge | 2 | Check |  |
