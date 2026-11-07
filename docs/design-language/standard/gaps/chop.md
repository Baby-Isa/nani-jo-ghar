# Chop: its gap to the standard

**Made:** 7 Nov 2026, Sprint 18 wave 1 (s18-chop), before any build. `node build/tools/review/audit.mjs --standard chop` (205 House and
Family rules; no contract run, no saved checks: 2 pass, 14 fail, 26 judge, 36 gap, 127 not run), then my read of chop's code
(`js/cook/mechanics/chop.js`, its lab entry, daar's use of it). Chop has a flow (`cook:chop`, the Station lab's Chop tile) but no
game of its own yet: the lab plays a daal order's chop on Nana's card. Scores are for chop alone; where chop is a step of daar or
chaat, that game's gap page scores the rest.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece as it lands: (d) lights and lessons, (e) the order's flow) ·
Game code · Art · Words · Decision · Check. Scope: H House, F Family. Audit: what `--standard chop` printed.

## Not to touch (non-negotiable 1, the keep list)

- The Fruit-Ninja chop itself: throws in volume, decoys as often as wanted ones, the red-onion lookalike, the switch mid-round
  ("Hane ba marcha!"), rounds running on without a gap (DAAR-35), the knife with no hand following the finger, the cut along the
  swipe (DAAR-22), the knife resting between swipes, nothing cut off by the board's edge (DAAR-13).
- KEEP-01 (the underline while a line is spoken; the order card and pop-up). KEEP-02 (chopped things wait at the side and you add
  them in: daar's, kept when daar moves onto chop). KEEP-13 (daar's dial and rotation).

## What the build does (this sprint, in this order)

1. **Game code:** data/stations/chop.json (new) (its settings: kinds and chops by level, the vegetables, each level's speed) and
   js/cook/stations/chop.js (new) (the game: Nani's order on her own card, the board, the end); one call daar and chaat can use.
2. **DAAR-37:** kinds 1-4 by level, chops 2, 4, 6, 8, each kind 1-3. **DAAR-38:** the chop ends on the last wanted chop.
   **DAAR-36:** the "no" said last; decoys by the rules (1-4, a lookalike at L4). **DAAR-39:** the first-time light is the
   knife's strip, the finger dragging it, one planted vegetable cut and not counted, the knife inert until it ends.
3. **Art:** the placeholder board from landed art (decision 7: the marble and the landed chakla) until ART-37.
4. **Adopt:** the kits' pieces as they land; the asks for what chop needs and the kit lacks go in the report.

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | the swipe, the throws, the switch and the ring kept; no diff tool yet |
| STD-01-02 | H | not run | 2 | Words | lines from the engine; garlic (lasan) and "chop these" unrecorded |
| STD-01-03 | H | not run | 2 | Check | contract-16 never run on cook:chop |
| STD-01-04 | H | not run | 1 | Check | no leak config for chop alone (cook.json covers daar) |
| STD-01-05 | H | judge | 1 | Check | never judged as its own game |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | not run | 2 | Check | L1 one gentle "Arre re", L2 up quiet; the ring's "enough" is no verdict |
| STD-01-08 | H | not run | 1 | Art | the board is code-drawn wood (ART-37, CHT-16) |
| STD-01-09 | H | not run | 2 | Check |  |
| STD-02-01 | H | gap | 2 | Check | no child-pace play of chop |
| STD-02-02 | H | not run | 2 | Check |  |
| STD-02-03 | H | not run | dbd | Decision | a swipe, not a tap: the swipe chop is his (29 Sept, D1/Q4); confirm against principle 5 (21 Oct) |
| STD-02-04 | H | not run | 1 | Game code | DAAR-39: at 740x320 the light framed the whole board |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 1 | Decision | L1 meets one vegetable and one number; under 3 new words |
| STD-A1-02 | H | not run | 2 | Adopt | her card (e) |
| STD-A1-04 | H | judge | 2 | Check | varied lines: "Kali ba dungri. Ne hakro tameto." |
| STD-A1-05 | H | not run | 0 | none | no speaking moment; a swipe always works |
| STD-A2-01 | H | not run | 2 | Adopt | (d) |
| STD-A2-02 | H | not run | 2 | Adopt | (d) |
| STD-A2-03 | H | fail | 1 | Kit | (d), the blur rule |
| STD-A2-04 | H | not run | 2 | Kit | (d) |
| STD-A2-05 | H | not run | 2 | Kit | (d) |
| STD-A3-01 | H | fail | 0 | none | no amounts |
| STD-A3-02 | H | fail | 0 | none |  |
| STD-A3-03 | H | gap | 0 | none |  |
| STD-A3-04 | H | judge | 0 | none |  |
| STD-A4-01 | H | not run | 2 | Words |  |
| STD-A4-02 | H | not run | 2 | Words | grey English from the card kit; garlic on the sheet |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 1 | Game code | the lab plays a daal order's chop: Nana's card, no round of its own |
| STD-B1-02 | H | not run | 0 | none | chop alone has no guests; its users serve |
| STD-B1-03 | H | not run | 2 | Adopt | (e) |
| STD-B1-04 | H | not run | 1 | Game code | DAAR-36: the "no" said second |
| STD-B1-05 | H | not run | 2 | Adopt | (e) |
| STD-B1-06 | H | not run | 1 | Game code | DAAR-38: runs until the ring is empty |
| STD-B1-07 | H | fail | 2 | Check | passMeChance 0; chop never calls passMeAfter |
| STD-B2-01 | F | pass | 0 | none | nothing cooks in chop |
| STD-B2-02 | H | gap | 2 | Check | one swipe at every level |
| STD-B2-03 | F | gap | 2 | Check | the ring on the board |
| STD-B2-04 | F | not run | 0 | none | no window |
| STD-B2-05 | F | gap | 2 | Check | a throw's air time about 2.8 s at the top level |
| STD-B2-06 | F | not run | 0 | none | one board |
| STD-B2-07 | H | not run | 2 | Check | swipes count from the first throw |
| STD-B2-08 | H | gap | 1 | Game code | alone it grades and ends; daar redoes only the wrong ones |
| STD-B2-09 | F | not run | 0 | none |  |
| STD-B2-10 | H | pass | 0 | none | nothing placed; a cut is not undone |
| STD-B2-11 | F | not run | 0 | none |  |
| STD-B3-02 | H | not run | 1 | Game code | a slice past the count counts as too many |
| STD-B3-03 | F | not run | 0 | none |  |
| STD-B4-01 | H | not run | 2 | Check | the chop sound, the halves, the cut line |
| STD-B4-02 | H | not run | 0 | none | no control |
| STD-B4-03 | F | not run | 0 | none |  |
| STD-B4-04 | H | not run | 2 | Check |  |
| STD-B4-05 | H | gap | 2 | Check | graded at the end; L1 one gentle word |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | no pair named for chop (onion and tomato?) |
| STD-C1-02 | H | gap | 1 | Kit | the vegetables are first met here (d: the general first meeting) |
| STD-C2-01 | H | not run | 2 | Check |  |
| STD-C2-02 | H | not run | 1 | Game code | DAAR-37: kinds 1-4, chops 2-8; the lab reads pieces |
| STD-C2-03 | H | not run | 1 | Game code | 3-4 decoys at every level, lookalikes always |
| STD-C2-04 | H | not run | 2 | Game code | true of the daal order; chop needs its own |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 1 | Game code | L1-L3 about 15% apart; L4 as L3 |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Adopt |  |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Adopt |  |
| STD-C3-02 | H | not run | 2 | Adopt |  |
| STD-C3-03 | H | not run | 2 | Adopt |  |
| STD-C3-04 | H | not run | 0 | none | no shelf |
| STD-C3-05 | H | not run | 2 | Adopt |  |
| STD-C3-06 | H | not run | 2 | Adopt | (e) |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 1 | Kit | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check | the lab's level only |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 2 | Adopt | (d) |
| STD-D1-02 | H | not run | 1 | Game code | DAAR-39: the strip, the finger on the knife; then (d) |
| STD-D1-03 | H | not run | 2 | Adopt | (d) |
| STD-D1-05 | H | gap | 0 | none | DAAR-39 sets the strip instead |
| STD-D1-06 | H | not run | 1 | Adopt | (d) |
| STD-D1-07 | H | fail | 1 | Adopt | (d) |
| STD-D1-08 | H | fail | 1 | Adopt | (d) |
| STD-D1-09 | H | not run | 0 | none |  |
| STD-D1-10 | F | fail | 0 | none | no vessel |
| STD-D2-01 | H | not run | 2 | Adopt | (d) |
| STD-D2-02 | H | not run | 1 | Game code | no stuck hint while things fly |
| STD-D2-03 | H | not run | 2 | Adopt | (d) |
| STD-D2-04 | H | not run | 1 | Game code | as D2-02 |
| STD-D2-05 | H | not run | 2 | Adopt | (d) |
| STD-D2-06 | F | not run | 0 | none |  |
| STD-D3-01 | H | not run | 2 | Adopt | (e) |
| STD-D3-02 | H | fail | 1 | Adopt | (e) |
| STD-D3-03 | H | not run | 2 | Adopt | (e) |
| STD-D3-04 | H | not run | 2 | Adopt | (e) |
| STD-D3-05 | H | not run | 2 | Adopt | (e) |
| STD-D4-01 | H | not run | 1 | Game code | rows tick on the count at L1 only |
| STD-D4-02 | H | fail | 2 | Adopt | (e) |
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
| STD-E1-05 | H | not run | 2 | Check | the ring stays clear of the throws |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check |  |
| STD-E2-03 | H | not run | 2 | Check |  |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | not run | 2 | Check |  |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check |  |
| STD-E2-08 | H | not run | 1 | Game code | DAAR-39 |
| STD-E3-01 | H | not run | 2 | Check | one throw size for every kind, so a finger can hit |
| STD-E3-02 | H | fail | 1 | Art | the wood board is drawn by code |
| STD-E3-03 | F | not run | 1 | Game code | the wood view; the marble and the landed chakla until ART-37 |
| STD-E3-04 | F | not run | 0 | none |  |
| STD-E3-05 | F | gap | 0 | none |  |
| STD-E4-01 | H | fail | 1 | Game code | DAAR-39: the demo light went up and down jerkily |
| STD-E4-02 | H | not run | 2 | Adopt | (e) |
| STD-E4-03 | F | gap | 2 | Check | the ring |
| STD-E4-04 | H | gap | 2 | Check | slower throws at L1 |
| STD-E5-01 | H | not run | 2 | Check |  |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | dbd | Decision | the switch is said while things fly (the mechanic, L2 up) |
| STD-E6-01 | H | not run | 1 | Game code | the bursts' colours are literals |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 1 | Game code | Nani's chop card is in the mechanic and again in daar |
| STD-F1-02 | H | not run | 1 | Game code | the lab entry builds a daal order |
| STD-F1-03 | H | gap | 1 | Game code | no settings file, no game file |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Adopt | daar and chaat switch in wave 2 |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 1 | Decision | no rules row for chop; daar's x read as pieces |
| STD-F2-03 | F | gap | 1 | Game code | knobs in data/cook.json |
| STD-F2-04 | H | gap | 2 | Check |  |
| STD-F3-01 | H | fail | 2 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Adopt |  |
| STD-F3-04 | H | not run | 0 | none |  |
| STD-F3-05 | H | not run | 2 | Check | z.expect |
| STD-F3-06 | H | judge | 2 | Check |  |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 2 | Check | loadcheck |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | not run | 2 | Check |  |
| STD-F4-06 | H | not run | 2 | Check |  |
| STD-F5-01 | H | gap | 2 | Check | the lab at L1-L4 |
| STD-F5-02 | H | not run | 2 | Check | chop-throw notes |
| STD-F5-03 | H | not run | 1 | Kit | no chop section on the kitchen-kit lab page |

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
| STD-H1-01 | H | judge | 2 | Art | vegetables and knife from runs; no board |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 1 | Art | ART-37 queued, no sizes yet |
| STD-H1-05 | H | not run | 1 | Game code | decision 7: a placeholder from landed art |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | garlic and "chop these" |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | garlic unrecorded |
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