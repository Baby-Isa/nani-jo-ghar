# Maani: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-maani), before any build. `node build/tools/review/audit.mjs --standard maani` (205
House and Family rules; no contract run, no saved checks: 2 pass, 14 fail, 26 judge, 36 gap, 127 not run), then my read of maani's
code (`js/cook/stations/maani-line.js`, its settings `data/stations/maani-line.json`, the roll and tawa mechanics, the lab-only
`roll-tawa` proof). Maani is the Maani line: the dough piles, the chakla, one tawa on one burner, the plates, the tick. Its
contract run before the build (`cook:maani-line` L1-L4 at 1280x665): every end reached, 0 page errors, 3 breaks (contract-98 at
L2-L4: a dotted word on the card with no lesson).
**Scores now:** 11 at 0, 26 at 1, 162 at 2, 3 at 3, 3 at dbd.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece: (a) the stove and worktop, (b) pans, pour and serve, (c) the
shelf, pills and pop, (d) lights and lessons, (e) the order's flow) · Game code · Art · Words · Decision · Check. Scope: H House,
F Family. Audit: what `--standard maani` printed.

## Not to touch (non-negotiable 1, the keep list)

- The roll: a ball flies to the chakla, drag up and down, the velan rolls it to the gold ring (two at L4); the velan wider (MAA-12).
- The tawa: one on one burner, the ring like a clock, the turner's flip and lift, half-cooked and burnt as pictures, the green
  longer at every level (MAA-17), the knob's high, low, off (MAA-11), the sizzle only on a lit tawa.
- The plates fanned so you can count them (MAA-10); the piles unshadowed (MAA-09); a ball goes back before the roll (MAA-04);
  the ghost finger on the rolled maani (MAA-13).
- The tick is the child's count: a wrong maani is redone on the spot, the third wrong try shown (decision 51).
- KEEP-01 (the underline while a line is spoken; the order card and pop-up). Pass-me stays out (MAA-14 parked).

## What the build does (this sprint, in this order)

1. **Game code:** pass-me's call goes (B1-07); a wrong tap brings the hint at once (D2-04); the green at least 2 s at L4 in its
   settings (B2-05); colours from the tokens (E6-01).
2. **Adopt:** (a) the worktop wash and the stone band (E3-03); (b) the tick and recast on `NjgServe.round` (B2-08); (c) the word
   pop on `Juice.P.pop`; (d) the reveal lessons before the first pile (D1-08); (e) the face tap on `UI.hearPerson`. Each copied block
   deleted (F1-02).
3. **Words:** the missing lines stay grey English, logged on the recording sheet.

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | the roll to the gold ring, the tawa's flip and lift, the knob (high, low, off), the redo kept; no diff tool |
| STD-01-02 | H | not run | 2 | Words | lines from the engine; "Roll the maani round", the take-off (MAA-15) and the "and" join (MAA-16) unrecorded |
| STD-01-03 | H | not run | 2 | Check | the chips' words written until used right (Cook.chipWord); contract-16 never run on maani |
| STD-01-04 | H | not run | 2 | Check | leak-games/cook.mjs plays maani; not run this sprint |
| STD-01-05 | H | judge | 1 | Check | never judged at the standard |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | not run | 2 | Check | the review's gentle frown; the flip's "too early" swatch (B4-05) |
| STD-01-08 | H | not run | 2 | Art | the v3 maani set from runs; the band code-drawn (E3-03) |
| STD-01-09 | H | not run | 2 | Check | wheat and millet maani, halal |
| STD-02-01 | H | gap | 2 | Check | no child-pace play of maani |
| STD-02-02 | H | not run | 2 | Check | the piles by picture (millet greyer), the chips speak |
| STD-02-03 | H | not run | 2 | Check | the roll is a rub that starts on the dough; every other action a tap |
| STD-02-04 | H | not run | 2 | Check | contract run at the four sizes at the end |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 2 | Check | L1 one maani: maani or bajr ji maani and a number |
| STD-A1-02 | H | not run | 2 | Adopt | her card (e) |
| STD-A1-04 | H | judge | 2 | Check | varied orders: "Muke ba bajr ji maani khape." |
| STD-A1-05 | H | not run | 0 | none | no speaking moment |
| STD-A2-01 | H | not run | 2 | Adopt | (d) |
| STD-A2-02 | H | not run | 2 | Adopt | (d) |
| STD-A2-03 | H | fail | 1 | Kit | (d), the blur rule |
| STD-A2-04 | H | not run | 2 | Kit | (d) |
| STD-A2-05 | H | not run | 2 | Kit | (d) |
| STD-A3-01 | H | fail | 1 | Decision | wadhi and nindhi (L4): the two dashed rings show both sizes; a word moment for big and small? |
| STD-A3-02 | H | fail | 1 | Decision | as A3-01 |
| STD-A3-03 | H | gap | 1 | Decision | as A3-01 |
| STD-A3-04 | H | judge | 2 | Check | the rings 185 and 118 px: apart at a glance |
| STD-A4-01 | H | not run | 2 | Words |  |
| STD-A4-02 | H | not run | 2 | Words | grey English for the missing lines |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 2 | Check | the lab: her order, the line, the tick, the review |
| STD-B1-02 | H | not run | 2 | Check | one person; their face reviews the plates |
| STD-B1-03 | H | not run | 2 | Adopt | (e) |
| STD-B1-04 | H | not run | 0 | none | no "no" items |
| STD-B1-05 | H | not run | 2 | Check | contract-95 not run on maani |
| STD-B1-06 | H | not run | dbd | Decision | 8 Nov: the tick is the child's count (ending by itself would tell them the count: non-negotiable 4) |
| STD-B1-07 | H | fail | 1 | Game code | passMeChance 0, but the tawa still calls passMeAfter |
| STD-B2-01 | F | pass | 2 | Check | cooked on the tawa, then plated |
| STD-B2-02 | H | gap | 2 | Check | a tap for the pile, a rub to roll, a tap for the tawa, every level |
| STD-B2-03 | F | gap | 2 | Check | the heat ring on the tawa's rim, its green |
| STD-B2-04 | F | not run | 1 | Decision | an early tap flips it half-raw, a late one burns it and it still counts: the game's own mechanic; refuse and shake? |
| STD-B2-05 | F | gap | 1 | Game code | the green at L4 is 1.54 s (side 1) and 1.48 s (side 2); flipAddS in maani-line.json |
| STD-B2-06 | F | not run | 2 | Check | the next maani rolls while one cooks; the ring never waits for the roll |
| STD-B2-07 | H | not run | 2 | Check |  |
| STD-B2-08 | H | gap | 2 | Adopt | (b) NjgServe.round; maani's own copy of the loop |
| STD-B2-09 | F | not run | 0 | none | nothing is lost: a burnt maani is plated |
| STD-B2-10 | H | pass | 2 | Check | a ball goes back to its pile before the roll (MAA-04) |
| STD-B2-11 | F | not run | 0 | none | no pour |
| STD-B3-02 | H | not run | dbd | Decision | 8 Nov: one too many is the child's count, wrong at the tick (an empty pile wiggles) |
| STD-B3-03 | F | not run | 0 | none | no amounts |
| STD-B4-01 | H | not run | 2 | Check | the pop, the roll, the sizzle, the flip |
| STD-B4-02 | H | not run | 2 | Check | the knob's |
| STD-B4-03 | F | not run | 1 | Decision | a click as the green opens and the browning; no sound that grows (Mech.boil's is a pan's) |
| STD-B4-04 | H | not run | 2 | Check |  |
| STD-B4-05 | H | gap | 1 | Decision | S.verdict's pale swatch after an early flip; the maani's own picture already shows it |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | no teaching order named for wheat and millet, or big and small |
| STD-C1-02 | H | gap | 2 | Adopt | (e) the order said before the work |
| STD-C2-01 | H | not run | 2 | Check | L1 one kind, L2 two, L3 both kinds, L4 big and small |
| STD-C2-02 | H | not run | 2 | Check | rotis 2, 3, 4, 5 from count.games.maani-line |
| STD-C2-03 | H | not run | dbd | Decision | 8 Nov: always both doughs, one the decoy (the line's two piles) |
| STD-C2-04 | H | not run | 0 | none | no "no" asks |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 2 | Check | the ring 15% a level (timing.levelSpeed); flipAddS flattens the green to about 11% |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Adopt |  |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Adopt |  |
| STD-C3-02 | H | not run | 2 | Adopt |  |
| STD-C3-03 | H | not run | 2 | Adopt |  |
| STD-C3-04 | H | not run | 2 | Check | the chip's word until used right, then the speaker alone |
| STD-C3-05 | H | not run | 2 | Adopt |  |
| STD-C3-06 | H | not run | 2 | Adopt | (e) |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 1 | Kit | the general first meeting (d) |
| STD-C4-03 | H | not run | 2 | Check | the lab's level only |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 2 | Check | data.onboard maani-line, once per profile; the flip's first-time hold |
| STD-D1-02 | H | not run | 2 | Adopt | (d) |
| STD-D1-03 | H | not run | 2 | Adopt | (d) |
| STD-D1-05 | H | gap | 0 | none | the tawa and the pile are lit whole |
| STD-D1-06 | H | not run | 1 | Adopt | (d) Cook.Coach.control |
| STD-D1-07 | H | fail | 1 | Adopt | (d) Cook.Coach.cardLight |
| STD-D1-08 | H | fail | 1 | Adopt | (d) no reveal lessons in maani: contract-98 breaks at L2-L4 |
| STD-D1-09 | H | not run | 2 | Check | St.firstHold on the first flip (MAA-19) |
| STD-D1-10 | F | fail | 0 | none | one tawa, one board: no next vessel |
| STD-D2-01 | H | not run | 2 | Adopt | (d) |
| STD-D2-02 | H | not run | 2 | Check | the step box names the next pile, the pile glows |
| STD-D2-03 | H | not run | 2 | Adopt | (d) |
| STD-D2-04 | H | not run | 1 | Game code | a wrong tap wiggles but brings no hint (Cook.Coach.wrong) |
| STD-D2-05 | H | not run | 2 | Adopt | (d) |
| STD-D2-06 | F | not run | 2 | Check | the flip's call as the green opens |
| STD-D3-01 | H | not run | 2 | Adopt | (e) |
| STD-D3-02 | H | fail | 2 | Adopt | (e) |
| STD-D3-03 | H | not run | 2 | Adopt | (e) |
| STD-D3-04 | H | not run | 2 | Adopt | (e) |
| STD-D3-05 | H | not run | 2 | Adopt | (e) |
| STD-D4-01 | H | not run | 2 | Check | a row ticks as each maani lands on its plate |
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
| STD-E1-05 | H | not run | 2 | Check | the turner rests clear of the hob |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check |  |
| STD-E2-03 | H | not run | 2 | Check |  |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | not run | 2 | Check |  |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check | the face on the hob's front edge (Kit.burner) |
| STD-E2-08 | H | not run | 2 | Check |  |
| STD-E3-01 | H | not run | 2 | Check | one camera; the piles by St.shelfFit |
| STD-E3-02 | H | fail | 1 | Game code | the band, the page wash and the word pop code-drawn; the flip's swatch (B4-05) |
| STD-E3-03 | F | not run | 1 | Adopt | (a) the band is the panel colour, not the stone |
| STD-E3-04 | F | not run | 2 | Check | the tawa centred on its burner, the ring on its rim |
| STD-E3-05 | F | gap | 0 | none | the person is a face on the hob |
| STD-E4-01 | H | fail | 2 | Check |  |
| STD-E4-02 | H | not run | 2 | Adopt | (e) |
| STD-E4-03 | F | gap | 2 | Check | the browning, then the half, cooked or burnt picture |
| STD-E4-04 | H | gap | 2 | Check | the roll and the flip run slow |
| STD-E5-01 | H | not run | 2 | Check |  |
| STD-E5-03 | H | not run | 2 | Check | the sizzle loop under family lines unproven |
| STD-E5-04 | H | not run | 2 | Check |  |
| STD-E6-01 | H | not run | 1 | Game code | INK literals (page, panel, grey), the word pop's own colours |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 2 | Check |  |
| STD-F1-02 | H | not run | 1 | Game code | the word pop, the tick-and-recast loop, the wash and the band copied |
| STD-F1-03 | H | gap | 2 | Check | settings file and game file; the base knobs still in data/cook.json |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Adopt | each piece moved whole |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 2 | Kit | the rotis read count.games.maani-line |
| STD-F2-03 | F | gap | 2 | Kit | the game's numbers in its file; mechanics.roll and .tawa still in data/cook.json |
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
| STD-F5-01 | H | gap | 2 | Check | the Maani line tile at L1-L4 |
| STD-F5-02 | H | not run | 2 | Check | Cook.maaniWindow, the zones' expect |
| STD-F5-03 | H | not run | 1 | Kit | no maani section on the kitchen-kit lab page |

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
| STD-H1-01 | H | judge | 2 | Art | the v3 maani set from runs |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 2 | Check | landed |
| STD-H1-05 | H | not run | 2 | Art | the band from the stone (E3-03) |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | "Roll the maani round", "Roll the maani, then cook it" |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | the take-off (MAA-15), the "and" (MAA-16) |
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
