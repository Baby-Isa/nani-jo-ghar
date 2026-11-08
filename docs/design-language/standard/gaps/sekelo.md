# Sekelo: its gap to the standard

**Made:** 8 Nov 2026 (s18-g-sekelo), before any build: `audit.mjs --standard sekelo` (205 House and Family rules) plus a read
of `mishkaki-grill.js`, `thread.js`, `grill.js` and their settings.

**Counts before the build** (205 rules): 13 at 0, 32 at 1, 155 at 2, 5 at 3, none at 4 or 5.
**Counts after the build** (d86b384a; "(build)" marks a change): 13 at 0, 23 at 1, 163 at 2, 6 at 3.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece as it lands: (d) lights and lessons, (e) the order's flow) ·
Game code · Art · Words · Decision · Check. Scope: H House, F Family. Audit: what `--standard sekelo` printed.

## Not to touch (non-negotiable 1, the keep list)

- The threading: tap a bowl and the piece goes on from the tip and slides down; tap the skewer and the last piece comes off; a
  piece no skewer needs bounces back at L1 and goes on quietly from L2; a mixed skewer's pieces in the spoken order (SEK-13's ticks).
- One job at a time (Sekelo v2, §15): thread every skewer, the go-on with the grill's picture (SH-106), then the grill.
- The grill: the rack (two racks, layout D, SEK-20), each skewer's own ring, `turns` turns on the green and the lift, too early
  (raw) or too late (charred) back to the rack (SEK-09), several cooking at once, "Firai!" at each green.
- The taste (§14a) and decision 51: only the wrong skewers are made again, the third try kept.
- KEEP-01 (the underline while a line is spoken; the order card and pop-up).

## What the build does (this sprint, in this order)

1. **Game code:** sekelo's numbers into its settings file (the grill's and the thread's levels); its copies of kit code deleted:
   `SK.speaker` (the kit's `Shelf.P.speaker`), `SK.bowl`'s own chip (the kit's `Cook.Kit.chip`), `SK.pop` (`Juice.P.pop`), `SK.band`
   (the kit's worktop and stone band, `Cook.Kit.worktop` and `St.stoneBand`), `SK.shelf`'s slot arithmetic (`Shelf.slots`).
2. **SEK-22:** the skewer's lit box hugs the skewer, handle to tip, at most 12 px beyond.
3. **Adopt:** kit (d)'s lights and lessons where they fit (the first-time gate, the stuck rungs, the lessons).
4. **Kept as the game's own (different by design, 8 Nov):** the grill's clock (each skewer's ring, turns and lift). `Mech.boil` is
   a pan on a burner with a knob; a skewer has no knob and no boil, so the grill keeps its own clock and reads the kit's first-time
   hold (`St.firstHold`).


## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | threading, the go-on, the grill's turns and lift, the taste and redo all kept; no diff tool yet |
| STD-01-02 | H | not run | 2 | Words | lines from the engine; SEK-18's 'thread them' line and murgi (n.chicken) unrecorded |
| STD-01-03 | H | not run | 2 | Check | contract-16 not yet run on cook:mishkaki-grill this sprint |
| STD-01-04 | H | not run | 2 | Check | data/cook.json leak config covers mishkaki; not run this sprint |
| STD-01-05 | H | judge | 1 | Check | not judged since S14 (SEK-22 reopened 30 Oct) |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | not run | 2 | Check | L1 one bounce back to the bowl; L2 up quiet; the taste's frown is NjgServe's gentle face |
| STD-01-08 | H | not run | 2 | Art | landed v3 and s08c art; the square barbecue waits on SEK-20 |
| STD-01-09 | H | not run | 2 | Check |  |
| STD-02-01 | H | gap | 2 | Check |  |
| STD-02-02 | H | not run | 2 | Check |  |
| STD-02-03 | H | not run | 2 | Check | every action a tap (bowl, skewer, rack, grill, go-on) |
| STD-02-04 | H | not run | 2 | Check | SH-169 at 740x320 L3-L4 (3 Nov audit) |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 1 | Decision | L1 meets gos or a vegetable, lakri, a number; under 3 new words |
| STD-A1-02 | H | not run | 2 | Adopt | the order card (kit e) |
| STD-A1-04 | H | judge | 2 | Check | varied orders: counts, kinds, mixes in order |
| STD-A1-05 | H | not run | 0 | none | no speaking moment; a tap always works |
| STD-A2-01 | H | not run | 2 | Adopt | (d) |
| STD-A2-02 | H | not run | 2 | Adopt | (d) |
| STD-A2-03 | H | fail | 1 | Kit | (d), the blur rule (SH-195) |
| STD-A2-04 | H | not run | 2 | Kit | (d) |
| STD-A2-05 | H | not run | 2 | Kit | (d) |
| STD-A3-01 | H | fail | 0 | none | no amounts |
| STD-A3-02 | H | fail | 0 | none | no word moment |
| STD-A3-03 | H | gap | 0 | none |  |
| STD-A3-04 | H | judge | 0 | none |  |
| STD-A4-01 | H | not run | 2 | Words | the hint line from Lang.countParts; SEK-18 |
| STD-A4-02 | H | not run | 2 | Words | grey English from the card kit; murgi on the sheet |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 2 | Check | the order, thread, go-on, grill, taste, end |
| STD-B1-02 | H | not run | 2 | Check | one asker (Nana by default) tastes the plate |
| STD-B1-03 | H | not run | 2 | Adopt | (e) |
| STD-B1-04 | H | not run | 0 | none | no 'no' items in a sekelo order |
| STD-B1-05 | H | not run | 2 | Check | contract-95 |
| STD-B1-06 | H | not run | 2 | Check | the grill moves on by itself when nothing can change the plate (decision 52); the go-on waits for the child |
| STD-B1-07 | H | fail | 2 | Check | no pass-me in sekelo |
| STD-B2-01 | F | pass | 3 | Check | the skewers are made whole on the board and grilled whole |
| STD-B2-02 | H | gap | 2 | Check | a tap at every level |
| STD-B2-03 | F | gap | 2 | Check | each skewer's own ring (SK.ring) |
| STD-B2-04 | F | not run | 2 | Check | too early: raw, back to the rack (SEK-09); too late: charred, back to the rack |
| STD-B2-05 | F | gap | 2 | Check | band 0.62-0.85 at rate 0.24/s at L3-L4: about 0.96 s; under 2 s (Decision: a number for Zafar) |
| STD-B2-06 | F | not run | 2 | Check | up to `spots` skewers at once (2-4) |
| STD-B2-07 | H | not run | 2 | Check |  |
| STD-B2-08 | H | gap | 2 | Check | decision 51: only the wrong skewers are made again, the third try kept |
| STD-B2-09 | F | not run | 2 | Check | a mistimed skewer goes back to the rack; its rows stay |
| STD-B2-10 | H | pass | 3 | Check | tap the skewer: the last piece comes off |
| STD-B2-11 | F | not run | 0 | none | no pour |
| STD-B3-02 | H | not run | 2 | Check | a full skewer takes no more; the rack holds `rack` |
| STD-B3-03 | F | not run | 0 | none | no amounts |
| STD-B4-01 | H | not run | 2 | Check | pop, sizzle, flip, the chunk's grill marks |
| STD-B4-02 | H | not run | 0 | none | no control |
| STD-B4-03 | F | not run | 2 | Check | the ring fills and the chunks brown; the click at the green |
| STD-B4-04 | H | not run | 2 | Check |  |
| STD-B4-05 | H | gap | 2 | Check | L1 one bounce; the plate graded at the taste |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | no pair named for sekelo (gos and boga?) |
| STD-C1-02 | H | gap | 1 | Kit | the pieces are first met here (d: the general first meeting) |
| STD-C2-01 | H | not run | 2 | Check |  |
| STD-C2-02 | H | not run | 2 | Check | skewers 1, 2, 2-3, 3-4 by level (rules: mishkaki-grill most 4, no levels row) |
| STD-C2-03 | H | not run | 2 | Check | St.tableDecoys (the kit's Shelf.decoys on the rules' level row: 1-2-3-4, the L4 lookalike); the knob's decoys 1,2,3,3 unused |
| STD-C2-04 | H | not run | 0 | none | no 'no' asks |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 2 | Check | rate 0.2, 0.22, 0.24, 0.24: L4 adds nothing |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Adopt |  |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Adopt |  |
| STD-C3-02 | H | not run | 2 | Adopt |  |
| STD-C3-03 | H | not run | 2 | Adopt |  |
| STD-C3-04 | H | not run | 2 | Check | Cook.chipWord under each bowl |
| STD-C3-05 | H | not run | 2 | Adopt |  |
| STD-C3-06 | H | not run | 2 | Adopt | (e) |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 1 | Kit | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check |  |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 2 | Adopt | the kit's first-time gate for the lessons (build); the thread and the rack have no first-time light of their own |
| STD-D1-02 | H | not run | 2 | Adopt | S.glow on the bowl and the rack skewer, not the kit's light |
| STD-D1-03 | H | not run | 2 | Adopt | (d) |
| STD-D1-05 | H | gap | 1 | Adopt | (d) Onboard.zoomBox |
| STD-D1-06 | H | not run | 1 | Adopt | (d) Cook.Coach.control |
| STD-D1-07 | H | fail | 1 | Adopt | (d) Cook.Coach.cardLight |
| STD-D1-08 | H | fail | 3 | Check | Cook.Coach.lessons before the threading, on the kit's first-time gate (Cook.Coach.firsts); contract-98 green L1-L4 at 1280x665 (build) |
| STD-D1-09 | H | not run | 2 | Check | the turn's first-time hold (St.firstHold 'grill:turn'); the lift never holds |
| STD-D1-10 | F | fail | 1 | Adopt | (d) Cook.Coach.nextLight: the next skewer on the rack |
| STD-D2-01 | H | not run | 2 | Adopt | (d) |
| STD-D2-02 | H | not run | 2 | Check | the thread hint names the next piece or the kind's count |
| STD-D2-03 | H | not run | 2 | Check | NaniGuide.idleMs restarts it (SH-60) |
| STD-D2-04 | H | not run | 1 | Adopt | a wrong piece rushes the kit's hints (Cook.Coach.wrong, build); the rack still has no stuck hint |
| STD-D2-05 | H | not run | 2 | Check | the thread's hint and glow hide past support (Onboard.hintHides on the word's stage, build) |
| STD-D2-06 | F | not run | 2 | Check | 'Firai!' at each green (the flip step) |
| STD-D3-01 | H | not run | 2 | Adopt | (e) |
| STD-D3-02 | H | fail | 1 | Adopt | the stuck hint is Nani's line and a glow, not the helper card |
| STD-D3-03 | H | not run | 2 | Adopt | (e) |
| STD-D3-04 | H | not run | 2 | Adopt | (e) |
| STD-D3-05 | H | not run | 2 | Adopt | (e) |
| STD-D4-01 | H | not run | 2 | Check | a skewer's card ticks when it is threaded; a mix's rows as each piece goes on (SEK-13) |
| STD-D4-02 | H | fail | 1 | Adopt | (e) |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check |  |
| STD-D5-03 | H | not run | 2 | Check |  |
| STD-D5-04 | H | not run | 2 | Check |  |

## E Presentation

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-E1-01 | H | not run | 2 | Check |  |
| STD-E1-02 | H | not run | 2 | Check |  |
| STD-E1-04 | H | not run | 2 | Check |  |
| STD-E1-05 | H | not run | 2 | Check | the rings clear of each other at 4 spots |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check |  |
| STD-E2-03 | H | not run | 2 | Check |  |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | not run | 2 | Check |  |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check |  |
| STD-E2-08 | H | not run | 2 | Check | SEK-22: each skewer named by its step (wordId rack, turn, lift, undo), so the kit's light hugs the whole skewer, handle to tip, with its pieces (build); for the judge |
| STD-E3-01 | H | not run | 2 | Check |  |
| STD-E3-02 | H | fail | 1 | Art | drawn fallbacks (stick, pieces, grill, rack, plate, board) in grill.js; the v3 and s08c pictures stand in front |
| STD-E3-03 | F | not run | 2 | Check | the kit's worktop wash and stone band (Cook.Kit.worktop, St.stoneBand) in place of SK.band's own (build) |
| STD-E3-04 | F | not run | 0 | none | no hob: the barbecue |
| STD-E3-05 | F | gap | 0 | none | no counter |
| STD-E4-01 | H | fail | 2 | Check |  |
| STD-E4-02 | H | not run | 2 | Adopt | (e) |
| STD-E4-03 | F | gap | 2 | Check | the chunks brown and char on the skewer |
| STD-E4-04 | H | gap | 2 | Check |  |
| STD-E5-01 | H | not run | 2 | Check |  |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | 2 | Check | 'Firai!' is said at the green, while the child waits for it |
| STD-E6-01 | H | not run | 1 | Game code | the V2.INK literals gone (build); the embers' and bursts' colours still literals |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 2 | Check | SK.speaker, SK.bowl's chip, SK.pop, SK.band and SK.shelf's slots are kit calls now (build); the grill's clock is the game's own |
| STD-F1-02 | H | not run | 2 | Check | the copies deleted (build); the thread's idle hint is still its own (Cook.Coach.control: next) |
| STD-F1-03 | H | gap | 2 | Check | the thread's and grill's levels in data/stations/mishkaki-grill.json (Cook.Skewer.knobs, build); data/cook.json's copy to delete (asked) |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Check | one path: the kit's chip at every scale (build) |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 2 | Check | decoys by the rules; the skewer count on the recipe's slots, not a rules row |
| STD-F2-03 | F | gap | 2 | Check | as F1-03 (build) |
| STD-F2-04 | H | gap | 2 | Check |  |
| STD-F3-01 | H | fail | 1 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Adopt |  |
| STD-F3-04 | H | not run | 2 | Check |  |
| STD-F3-05 | H | not run | 2 | Check | z.expect |
| STD-F3-06 | H | judge | 2 | Check |  |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 2 | Check | loadcheck; SK.loadArt asks for its own files only |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | not run | 2 | Check |  |
| STD-F4-06 | H | not run | 2 | Check |  |
| STD-F5-01 | H | gap | 2 | Check | the lab at L1-L4 (Station lab: Sekelo, Skewer, Grill) |
| STD-F5-02 | H | not run | 2 | Check | z.progress, z.listen |
| STD-F5-03 | H | not run | 1 | Kit | no sekelo section on the kitchen-kit lab page |

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
| STD-G1-09 | H | not run | 1 | Check | as 01-04 |
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
| STD-H1-01 | H | judge | 2 | Art | v3 and s08c art from runs |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 1 | Art | SEK-20's square barbecue: no block queued |
| STD-H1-05 | H | not run | 2 | Art | the s08c tray stands in for the two racks |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | the thread line (SEK-18) and murgi |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | murgi unrecorded |
| STD-H2-05 | H | not run | 2 | Check |  |
| STD-H3-01 | H | judge | 2 | Check |  |
| STD-H3-02 | H | judge | 2 | Check |  |
| STD-H3-03 | F | judge | 2 | Check |  |
| STD-H3-04 | H | gap | 3 | Check | this page |
| STD-H3-05 | H | judge | 3 | Check | 'Not to touch' above |
| STD-H3-06 | H | judge | 2 | Check |  |
| STD-H3-07 | H | judge | 2 | Check |  |
| STD-H4-01 | H | judge | 2 | Check |  |
| STD-H4-03 | H | not run | 2 | Check |  |
| STD-H4-04 | H | not run | 2 | Check |  |
| STD-H4-05 | H | judge | 2 | Check |  |
