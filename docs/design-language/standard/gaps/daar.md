# Daar: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-daar), before any build. `node build/tools/review/audit.mjs --standard daar` (205 House
and Family rules; no contract run, no saved checks: 2 pass, 22 fail, 26 judge, 36 gap, 119 not run), then my read of daar's code
(`js/cook/stations/daar.js`, `data/stations/daar.json`). Daar is chop, tadka and stir, then the serve; its chop is now chop's own game (`docs/design-language/standard/gaps/chop.md` scores the chop itself), so this page
scores the rest and how daar calls it.

**Before the build:** 0 n/a 14 · 1 missing 37 · 2 built, unproven 148 · 3 check green 4 · dbd 2. **After** (8 Nov, a note ending
"(build)" is what it changed): 0 n/a 14 · 1 missing 32 · 2 built, unproven 151 · 3 check green 6 · dbd 2.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece: (a) stove, (b) pans, pour, serve, (c) shelf, pills, word pop,
(d) lights and lessons, (e) the order's flow) · Game code · Art · Words · Decision · Check. Scope: H House, F Family. Audit: what
`--standard daar` printed.

## Not to touch (non-negotiable 1, the keep list)

- The swipe chop itself (chop's game: its keep list), the pieces flying to the side and waiting there to be added (KEEP-02).
- The tadka: the spices tapped in the order Nani says, the jar tipping over the pot, the pot's picture changing with what went in.
- The piles tapped in one at a time (D9), the daar poured from its bowl on the trivet (the shared pour, DAAR-28).
- The stir: the kadchi round the pot with its handle on the rim (DAAR-11), the flag at 12 o'clock (DAAR-30), the laps said as they
  pass it (DAAR-27), the speed dial and its rotation (KEEP-13), the spill when too fast; the review face over the bowl.
- KEEP-01 (the underline while a line is spoken; the order card and pop-up).

## What the build does

1. **Game code:** the chop onto `Cook.Chop.play`, daar's grading and decoy note deleted; DAAR-40 (contract-95), DAAR-41
   (contract-98, `Cook.Coach.lessons`).
2. **Adopt:** the word pop (`Juice.P.pop`), the shelf (`Shelf.slots`, size classes); the serve's dead path deleted.
3. **Art:** the chop board stays the marble (ART-37). Asks go in the report.

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | the chop (chop's game), the tadka order, the piles at the side (KEEP-02), the dial and laps (KEEP-13) kept (build); no diff tool |
| STD-01-02 | H | not run | 2 | Words | lines from the engine; lasan, "Chop these" and the stir line whole (DAAR-26, R6-146) unrecorded |
| STD-01-03 | H | not run | 2 | Check | contract-16 not run on cook:daar since S17 |
| STD-01-04 | H | not run | 2 | Check | data/cook.json's leak config covers daar; not run this sprint |
| STD-01-05 | H | judge | 1 | Check | never judged since the kits |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | not run | 2 | Check | L1 one gentle oops on a redo; the spill's puff, no "arre re" |
| STD-01-08 | H | not run | 1 | Art | the chop board waits on ART-37; the speed dial's face is drawn in code |
| STD-01-09 | H | not run | 2 | Check |  |
| STD-02-01 | H | gap | 2 | Check | no child-pace play of daar |
| STD-02-02 | H | not run | 2 | Check |  |
| STD-02-03 | H | not run | dbd | Decision | the chop is a swipe (his, 29 Sept, D1/Q4); the stir drags round the pot's fixed track (fits the rule) |
| STD-02-04 | H | fail | 1 | Check | panel 54 of 60 (3 Nov): SH-192 at 740x320 and 930x430, L2-L4 |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 1 | Decision | L1 meets the vegetables, jeeru, rai, a number and daar: over 5 new words is likely; uncounted |
| STD-A1-02 | H | not run | 2 | Adopt | the order card (e) |
| STD-A1-04 | H | judge | 2 | Check | the chop's varied lines (chop's game), the tadka's "Pela jeeru. Ne poi rai." |
| STD-A1-05 | H | not run | 0 | none | no speaking moment |
| STD-A2-01 | H | not run | 2 | Adopt | (d) |
| STD-A2-02 | H | not run | 2 | Adopt | (d) |
| STD-A2-03 | H | fail | 1 | Kit | (d), the blur rule |
| STD-A2-04 | H | not run | 2 | Kit | (d) |
| STD-A2-05 | H | not run | 2 | Kit | (d) |
| STD-A3-01 | H | fail | 0 | none | no amounts; the laps are a count |
| STD-A3-02 | H | fail | 0 | none | |
| STD-A3-03 | H | gap | 0 | none |  |
| STD-A3-04 | H | judge | 0 | none |  |
| STD-A4-01 | H | not run | 2 | Words | the stir line is three recorded pieces until Mum records the sentence (DAAR-26) |
| STD-A4-02 | H | not run | 2 | Words | grey English from the card kit ("Chop these") |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 2 | Check | the order, the chop, the tadka, the piles, the daar, the stir, the serve, the review |
| STD-B1-02 | H | not run | 2 | Check | one dish to its asker |
| STD-B1-03 | H | not run | 2 | Adopt | (e) |
| STD-B1-04 | H | not run | 2 | Check | Nani's card puts the "no" row last; the chop says it last (DAAR-36, chop's game) |
| STD-B1-05 | H | not run | 3 | Check | DAAR-40: the chop opens its step as its board starts; contract-95 green L1-L4 at 1280x665 (build) |
| STD-B1-06 | H | not run | 2 | Check | the chop ends on its last chop (DAAR-38, chop's game); the stir ends on the tick (C10: stirring on still counts) |
| STD-B1-07 | H | fail | 2 | Check | daar never calls passMeAfter |
| STD-B2-01 | F | pass | 3 | Check | the daar made whole in its pot, ladled to the bowl |
| STD-B2-02 | H | gap | 2 | Check | swipe to chop, tap the spices, piles and bowl, drag to stir (a tap on the pot is one lap) |
| STD-B2-03 | F | gap | 2 | Check | the chop's ring; the stir's speed dial |
| STD-B2-04 | F | not run | 0 | none | no window: the oil is hot at once (S16) |
| STD-B2-05 | F | gap | 2 | Check | the chop's throws (chop's settings) |
| STD-B2-06 | F | not run | 0 | none | one pot |
| STD-B2-07 | H | not run | 2 | Check |  |
| STD-B2-08 | H | gap | 2 | Check | decision 51 per step: only the short vegetables chopped again, the tadka again, the stir again; the third shown |
| STD-B2-09 | F | not run | 0 | none |  |
| STD-B2-10 | H | pass | 1 | Decision | a spice in the oil is not taken back by a tap (the redo takes the seeds out); to ask |
| STD-B2-11 | F | not run | 2 | Check | the daar's bowl: one tap, the shared pour |
| STD-B3-02 | H | not run | 2 | Check | the chop: one past adds nothing (chop's game); the stir past its laps counts on (C10) |
| STD-B3-03 | F | not run | 0 | none |  |
| STD-B4-01 | H | not run | 2 | Check |  |
| STD-B4-02 | H | not run | 2 | Check | the knob's sound only on its tap |
| STD-B4-03 | F | not run | 0 | none | no boil |
| STD-B4-04 | H | not run | 2 | Check |  |
| STD-B4-05 | H | gap | 2 | Check | graded at the serve; L1 one gentle word on a redo |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | no pair named for daar (jeeru and rai?) |
| STD-C1-02 | H | gap | 1 | Kit | the vegetables, jeeru and rai are first met here (d: the general first meeting) |
| STD-C2-01 | H | not run | 2 | Check |  |
| STD-C2-02 | H | not run | 2 | Check | the chop's kinds and counts from chop's settings (DAAR-37); spices and laps from the recipe |
| STD-C2-03 | H | not run | 2 | Check | spice decoys St.tableDecoys; the chop's noted by chop's game each round (build) |
| STD-C2-04 | H | not run | 2 | Check | a "no" vegetable from L2 (the recipe) |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 1 | Game code | only the chop's throws speed up by level |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Adopt |  |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Adopt |  |
| STD-C3-02 | H | not run | 2 | Adopt |  |
| STD-C3-03 | H | not run | 2 | Adopt |  |
| STD-C3-04 | H | not run | 2 | Check | the spice pills by Cook.chipWord; the shelf on Shelf.slots and the size classes (build) |
| STD-C3-05 | H | not run | 2 | Adopt |  |
| STD-C3-06 | H | not run | 2 | Adopt | (e) |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 1 | Kit | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check |  |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 1 | Adopt | (d): the cook's first time is the old coach (St.coach "daar-cook"), not the firsts gate |
| STD-D1-02 | H | not run | 2 | Adopt | (d): the chop's strip is the kit's light; the cook's is the old coach |
| STD-D1-03 | H | not run | 2 | Adopt | (d) |
| STD-D1-05 | H | gap | 2 | Check |  |
| STD-D1-06 | H | not run | 1 | Adopt | (d) |
| STD-D1-07 | H | fail | 1 | Adopt | (d) Cook.Coach.cardLight |
| STD-D1-08 | H | fail | 3 | Check | DAAR-41: kit (d)'s Cook.Coach.lessons before the first throw; contract-98 green L1-L4 (build) |
| STD-D1-09 | H | not run | 2 | Check | the chop's strip holds the knife inert until it ends (chop's game) |
| STD-D1-10 | F | fail | 0 | none | one pot, no next vessel |
| STD-D2-01 | H | not run | 2 | Check |  |
| STD-D2-02 | H | not run | 2 | Check |  |
| STD-D2-03 | H | not run | 2 | Check |  |
| STD-D2-04 | H | not run | 2 | Check | a wrong spice: Cook.Coach.wrong (build) |
| STD-D2-05 | H | not run | 2 | Check | St.hideKnown |
| STD-D2-06 | F | not run | 0 | none |  |
| STD-D3-01 | H | not run | 2 | Adopt | (e) |
| STD-D3-02 | H | fail | 1 | Adopt | (d) |
| STD-D3-03 | H | not run | 2 | Adopt | (e) |
| STD-D3-04 | H | not run | 2 | Adopt | (e) |
| STD-D3-05 | H | fail | 1 | Adopt | (e) |
| STD-D4-01 | H | not run | 2 | Check | chop rows tick at their count (chop's game); a spice as it goes in; a pile row as it goes in |
| STD-D4-02 | H | fail | 1 | Adopt | (e) |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check |  |
| STD-D5-03 | H | not run | 2 | Check |  |
| STD-D5-04 | H | not run | 2 | Check |  |

## E Presentation

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-E1-01 | H | fail | 1 | Kit | ui.js's panel |
| STD-E1-02 | H | fail | 1 | Kit | ui.js's panel |
| STD-E1-04 | H | fail | 1 | Kit | ui.js's panel |
| STD-E1-05 | H | not run | 2 | Check | the pop above the pot (Juice.P.pop), clear of the dial (build) |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check |  |
| STD-E2-03 | H | fail | 1 | Kit | SH-192 (3 Nov): the headline's and second card's gaps at 740x320 and 930x430 |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | not run | 2 | Check |  |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check |  |
| STD-E2-08 | H | not run | 2 | Check |  |
| STD-E3-01 | H | not run | 2 | Check |  |
| STD-E3-02 | H | fail | 1 | Art | the dial's code-drawn fallback icons deleted (build); its face, the stir flag and the spill drops still drawn; the chop board on ART-37 |
| STD-E3-03 | F | not run | 2 | Art | the white marble; ART-37's board to come |
| STD-E3-04 | F | not run | 2 | Check | the pot shows what went in (DAAR-16) |
| STD-E3-05 | F | gap | 0 | none |  |
| STD-E4-01 | H | fail | 2 | Check |  |
| STD-E4-02 | H | not run | 2 | Adopt | (e) |
| STD-E4-03 | F | gap | 2 | Check | the pot's picture after each addition; the stirred swirl with speed |
| STD-E4-04 | H | gap | 2 | Check | the daar's pour runs 1.9 s |
| STD-E5-01 | H | not run | 2 | Check | a lap's number is left out while Nani speaks (DAAR-27) |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | dbd | Decision | the laps are said as you stir (DAAR-24 retired, Zafar 14 Oct, D12); the chop's switch is said while things fly |
| STD-E6-01 | H | not run | 1 | Game code | the dial's, flag's and spill's colours are literals |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 2 | Check |  |
| STD-F1-02 | H | not run | 2 | Check | the word pop, the shelf's slots, the chop's grading and decoy note deleted (build); the stir also lives in stir.js: Decision |
| STD-F1-03 | H | gap | 2 | Check | the chop is Cook.Chop.play; the places in its settings (build) |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Adopt | the word pop (c), the shelf (c), the lessons and the wrong-move hint (d) taken (build); the cook's first time is still St.coach |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 2 | Check |  |
| STD-F2-03 | F | gap | 2 | Game code | places and sizes in daar.json's scene (build); the dial's drawing sizes and the stir's knobs (data/cook.json) still out |
| STD-F2-04 | H | gap | 2 | Check |  |
| STD-F3-01 | H | fail | 1 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Adopt |  |
| STD-F3-04 | H | fail | 1 | Kit | panelcheck (ui.js) |
| STD-F3-05 | H | not run | 2 | Check |  |
| STD-F3-06 | H | judge | 2 | Check | the stir's tick stops on Done |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 2 | Check | loadcheck 29/29; daar still loads tadka.js and stir.js, which it never calls (ask) |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | not run | 2 | Check |  |
| STD-F4-06 | H | not run | 2 | Check |  |
| STD-F5-01 | H | gap | 2 | Check | the lab at L1-L4 (Daar tile) |
| STD-F5-02 | H | not run | 2 | Check | stir-lap and chop-call notes, Cook.daarPhase |
| STD-F5-03 | H | not run | 1 | Kit | no stir or dial section on the kitchen-kit lab page |

## G Proof

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-G1-01 | H | gap | 2 | Check |  |
| STD-G1-02 | H | judge | 2 | Check |  |
| STD-G1-03 | H | judge | 2 | Check |  |
| STD-G1-04 | H | not run | 2 | Check |  |
| STD-G1-05 | H | not run | 2 | Check |  |
| STD-G1-06 | H | fail | 1 | Check | panelcheck SH-192 |
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
| STD-H1-01 | H | judge | 2 | Art | the daar pots, kadchi, discs and dial icons from runs |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 1 | Art | ART-37 queued, no sizes yet |
| STD-H1-05 | H | not run | 2 | Art | the marble stands in for the chop board until ART-37 |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | lasan, "Chop these", the stir line |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | lasan and the stir line unrecorded |
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
