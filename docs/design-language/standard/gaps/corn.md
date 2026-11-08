# The corn stall: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-corn), before any build. `node build/tools/review/audit.mjs --standard corn` (205
House and Family rules; no contract run, no saved checks: 2 pass, 14 fail, 28 judge, 39 gap, 122 not run), then my read of the
game (`js/cook/stations/corn.js`, `data/stations/corn.json`, its order `recipes.corn` in `data/cook.json`, its lab tile). The corn
stall is a lab prototype (Zafar's, 1 Nov: "a sekelo redress, all on one screen"; on the farm, day 2), never judged. Its flow
`cook:corn` plays to the end today with two contract breaks of its own: contract-24 (the next thing glows at once, before the
level's wait) and contract-95 ("Hane makai!" said after a skip, before any step opens).

**Updated** 8 Nov after the build (s18-g-corn's commits): a note ending "(build)" is what it changed. The audit on the final contract
run (`--run s18-g-corn-contract`, 1280x665, L1-L4: 0 breaks) prints 16 pass, 14 fail, 35 judge, 47 gap, 93 not run (before: 2 pass).
The Audit column below is the first audit's.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece: (d) lights and lessons, (e) the order's flow) · Game code ·
Art · Words · Decision · Check. Scope: H House, F Family. Audit: what `--standard corn` printed.

**Counts (205 rules), before the build:** 0: 15 · 1: 47 · 2: 139 · 3: 4 · 4: 0 · 5: 0 · dbd: 0.
**After the build:** 0: 15 · 1: 21 · 2: 147 · 3: 22 · 4: 0 · 5: 0 · dbd: 0.

## Not to touch (non-negotiable 1, the keep list)

- The stall on one screen, top-down: the box of raw cobs, the grill, the plate, the tray of six dressings with their word cards.
- The cob's round: a tap on the box puts one on the grill (no more than asked, no more than the grill holds); its ring fills; a tap
  turns it, once; its second side fills; a tap lifts it onto the plate; the order's head ticks when the plate holds the number
  asked (Zafar, 1 Nov). Several cobs at once, each on its own clock.
- What goes on: a tap on a dressing puts it on the corn, named as it goes on; its row ticks; a "no" or an unasked one lands quietly
  and is judged at the end. A tap on the plate gives it to them.
- KEEP-01 (the underline while a line is spoken; the order card and pop-up). Nani's box stands in for Hannah Mami (no real person
  without her approved sheet).

## What the build does (this sprint, in this order)

1. **Game code:** the settings file drives it: art from `settings.items`, `scene` and `assets` (the cut block 1 art in
   `assets/cook/proto/corn/`; the table picture CT instead of the code-drawn planks), sizes and places from the settings, the
   dressing list from the recipe; the steps open (Grill, Dress, Serve) so Nani's box follows and nothing is said after a skip
   (contract-95).
2. **Adopt (d):** the first-time gate (`Cook.Coach.firsts`) for its own copy; each step's call with its light the first time and
   the stuck light only after the level's wait (`Cook.Coach.control`, contract-24); a wrong dressing rushes the hint
   (`Cook.Coach.wrong`); no light on a dressing past support; the reveal lessons (`Cook.Coach.lessons`).
3. **Adopt (e) and the end:** the order flow from the lab's card; the end shows progress, not a frown (settings `end.display`).
4. **Asks:** what the kits lack (the cob's ring as the kit's heat ring; corn's decoys from the rules) go in the report.

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | the grill, the turn once, the dressings named as they go on, the plate kept; no diff tool |
| STD-01-02 | H | not run | 2 | Words | lines from the engine (order frames, now, lift, guide-firai); makai's gender not asked |
| STD-01-03 | H | not run | 3 | Check | contract-16 green L1-L4 at 1280x665; audit pass on s18-g-corn-contract |
| STD-01-04 | H | not run | 1 | Check | no leak config for corn; the light past support is gone (D2-05, build) |
| STD-01-05 | H | judge | 1 | Check | never judged (a lab prototype) |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | not run | 2 | Check | the kit's serve: a wrong plate's gentle face, its person says again what went wrong, redone on the spot (build) |
| STD-01-08 | H | not run | 2 | Art | the cut block 1 art from the settings; the table is CT (build); CO on the redo list |
| STD-01-09 | H | not run | 2 | Check | corn, lemon, salt, chutneys |
| STD-02-01 | H | gap | 2 | Check | no child-pace play |
| STD-02-02 | H | not run | 2 | Check |  |
| STD-02-03 | H | not run | 2 | Check | taps only |
| STD-02-04 | H | judge | 2 | Check | panel 60 of 60 (3 Nov); not judged |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 1 | Decision | L1 meets makai and one dressing |
| STD-A1-02 | H | not run | 3 | Check | the lab's card (e); audit pass on s18-g-corn-contract |
| STD-A1-04 | H | judge | 2 | Check | the order frames vary |
| STD-A1-05 | H | not run | 0 | none | no speaking moment |
| STD-A2-01 | H | not run | 2 | Adopt | (d) |
| STD-A2-02 | H | not run | 3 | Check | (d); audit pass on s18-g-corn-contract |
| STD-A2-03 | H | fail | 1 | Kit | (d), the blur rule |
| STD-A2-04 | H | not run | 2 | Kit | (d) |
| STD-A2-05 | H | not run | 2 | Kit | (d) |
| STD-A3-01 | H | fail | 0 | none | no amounts |
| STD-A3-02 | H | fail | 0 | none |  |
| STD-A3-03 | H | gap | 0 | none |  |
| STD-A3-04 | H | judge | 0 | none |  |
| STD-A4-01 | H | not run | 2 | Words |  |
| STD-A4-02 | H | not run | 2 | Words | laal marcha, lili, amli have no word of their own: their cards grey English (settings gaps) |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 2 | Check | the order, the steps in Nani's box (grill, turn, lift, dress), the serve, the end (build) |
| STD-B1-02 | H | not run | 2 | Check | one asker, served by the plate tap |
| STD-B1-03 | H | not run | 3 | Check | (e); audit pass on s18-g-corn-contract |
| STD-B1-04 | H | not run | 2 | Kit | the recipe says the no last; O.ladder (e) |
| STD-B1-05 | H | not run | 3 | Check | contract-95 green L1-L4: each line its step's call, said once the step opens (build) |
| STD-B1-06 | H | not run | 3 | Check | the serve is the plate tap (his prototype); the work itself has no end of its own; audit pass on s18-g-corn-contract |
| STD-B1-07 | H | fail | 2 | Check | passMeChance 0; corn never calls passMeAfter |
| STD-B2-01 | F | pass | 3 | Check | grilled on the grill, dressed on the plate; audit pass on s18-g-corn-contract |
| STD-B2-02 | H | gap | 2 | Check | a tap at every level |
| STD-B2-03 | F | gap | 2 | Check | the ring over each cob |
| STD-B2-04 | F | not run | 1 | Decision | a cooking cob refuses (wiggles); none ever burns: no after |
| STD-B2-05 | F | gap | 2 | Check | no window closes |
| STD-B2-06 | F | not run | 2 | Check | up to three cobs, each its own clock |
| STD-B2-07 | H | not run | 3 | Check | audit pass on s18-g-corn-contract |
| STD-B2-08 | H | gap | 2 | Check | NjgServe.round: the recast, the dressings off, played again; the third try shown; #mistake plays it (build) |
| STD-B2-09 | F | not run | 0 | none | nothing is lost |
| STD-B2-10 | H | pass | 3 | Check | a second tap on a dressing takes it back until the serve (build); audit pass on s18-g-corn-contract |
| STD-B2-11 | F | not run | 0 | none | no pour |
| STD-B3-02 | H | not run | 3 | Check | the box past the count wiggles; audit pass on s18-g-corn-contract |
| STD-B3-03 | F | not run | 0 | none |  |
| STD-B4-01 | H | not run | 2 | Check | pop, sizzle, click; the cob's picture changes |
| STD-B4-02 | H | not run | 0 | none | no control |
| STD-B4-03 | F | not run | 2 | Check | the ring fills, the cob browns |
| STD-B4-04 | H | not run | 2 | Check |  |
| STD-B4-05 | H | gap | 2 | Check | a wrong dressing lands quietly |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | no pair named (lili and amli?) |
| STD-C1-02 | H | gap | 1 | Kit | makai, laal marcha, mari first met here (d: the general first meeting) |
| STD-C2-01 | H | not run | 2 | Check |  |
| STD-C2-02 | H | not run | 1 | Decision | cobs 1, 1, 2, 2 of a grill of 3; dressings 1, 2, 2, 2-3 |
| STD-C2-03 | H | not run | 1 | Decision | the tray always holds all six: five decoys at L1, no lookalike |
| STD-C2-04 | H | not run | 2 | Check | a no only at L4 (0.6) |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 1 | Decision | a side gets slower by level (2.6 to 3.2 s) |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Check | Cook.roundDone (build) |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Adopt |  |
| STD-C3-02 | H | not run | 2 | Adopt |  |
| STD-C3-03 | H | not run | 2 | Adopt |  |
| STD-C3-04 | H | not run | 2 | Adopt | the tray's word chips (Cook.chipWord) |
| STD-C3-05 | H | not run | 2 | Adopt |  |
| STD-C3-06 | H | not run | 2 | Adopt | (e) |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 1 | Kit | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check | the lab's level only |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 2 | Check | Cook.Coach.firsts; its own copy deleted (build) |
| STD-D1-02 | H | not run | 2 | Check | Cook.Coach.control's light (build) |
| STD-D1-03 | H | not run | 2 | Check | one light at a time, closed as its step moves on (build) |
| STD-D1-05 | H | gap | 0 | none | the whole cob is lit |
| STD-D1-06 | H | not run | 3 | Check | the call held for the light the first time (build); audit pass on s18-g-corn-contract |
| STD-D1-07 | H | fail | 1 | Adopt | no card light (d) |
| STD-D1-08 | H | fail | 3 | Check | Cook.Coach.lessons before the first step; contract-98 green (build) |
| STD-D1-09 | H | not run | 0 | none | no window closes |
| STD-D1-10 | F | fail | 1 | Adopt | the crate's stuck hint only; no next-vessel light (d) |
| STD-D2-01 | H | not run | 3 | Check | contract-24 green L1-L4, #hint: the stuck light after the level's wait (build) |
| STD-D2-02 | H | not run | 2 | Check | the dressing's stuck hint opens her helper card on the first undone one (build) |
| STD-D2-03 | H | not run | 2 | Check | St.acted after every right move (build) |
| STD-D2-04 | H | not run | 2 | Check | an unasked dressing: Cook.Coach.wrong (build) |
| STD-D2-05 | H | not run | 2 | Check | no light on an asked dressing past support (Onboard.hintHides) (build) |
| STD-D2-06 | F | not run | 3 | Check | "Firai!" as the ring fills; audit pass on s18-g-corn-contract |
| STD-D3-01 | H | not run | 2 | Check | each step in her box as it opens (build) |
| STD-D3-02 | H | fail | 2 | Check | UI.helperOpen on the dressing's stuck hint (build) |
| STD-D3-03 | H | not run | 3 | Check | the dressing's call said only as her helper card opens (build); audit pass |
| STD-D3-04 | H | not run | 2 | Adopt | (e) |
| STD-D3-05 | H | gap | 2 | Check |  |
| STD-D4-01 | H | not run | 2 | Check | the head ticks at the count; a dressing at its tap |
| STD-D4-02 | H | fail | 2 | Adopt | (e) |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check |  |
| STD-D5-03 | H | not run | 2 | Check |  |
| STD-D5-04 | H | not run | 3 | Check | audit pass on s18-g-corn-contract |

## E Presentation

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-E1-01 | H | judge | 2 | Check |  |
| STD-E1-02 | H | gap | 2 | Check |  |
| STD-E1-04 | H | not run | 2 | Check |  |
| STD-E1-05 | H | not run | 2 | Check | the ring clear of the next cob |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check |  |
| STD-E2-03 | H | not run | 2 | Check |  |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | not run | 3 | Check | audit pass on s18-g-corn-contract |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check | the stall's face a kit badge |
| STD-E2-08 | H | not run | 2 | Check | Onboard.light's box (build) |
| STD-E3-01 | H | not run | 2 | Check | sizes from the settings' drawn sizes (build) |
| STD-E3-02 | H | fail | 2 | Art | the table is CT (build); the tray a drawn board (art plan Q7); the drops stand in for CO |
| STD-E3-03 | F | not run | 1 | Decision | the stall's oak table (CT), not the marble |
| STD-E3-04 | F | not run | 0 | none | no hob |
| STD-E3-05 | F | gap | 0 | none | no one drawn at a counter |
| STD-E4-01 | H | fail | 2 | Check | the drops fade in and out (build) |
| STD-E4-02 | H | not run | 3 | Check | (e); audit pass on s18-g-corn-contract |
| STD-E4-03 | F | gap | 2 | Check | raw, half, done |
| STD-E4-04 | H | gap | 2 | Check |  |
| STD-E5-01 | H | not run | 3 | Check | audit pass; contract-22 at L2#mistake: ph-amli's device-voiced English twice (the redo's tap), missing Kutchi |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | 2 | Check | "Firai!" may come mid-dressing at L3-L4 |
| STD-E6-01 | H | not run | 2 | Check | the ring is the kit's heat ring (build); the rest from the settings palette |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 2 | Check | the kits' lights, steps, ring, serve (build) |
| STD-F1-02 | H | not run | 2 | Check | the copied first-time gate, glow-the-next, ring and review deleted (build) |
| STD-F1-03 | H | gap | 2 | Check | art, sizes, places, dressings, motion from the settings (build) |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Check |  |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 1 | Kit | the hint's wait from the rules (build); the tray's six, not the rules' decoys (C2-03) |
| STD-F2-03 | F | gap | 2 | Check | settings scene.layout and motion (build) |
| STD-F2-04 | H | gap | 2 | Check | scene.layout._about derives each place (build) |
| STD-F3-01 | H | fail | 2 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Adopt |  |
| STD-F3-04 | H | not run | 0 | none |  |
| STD-F3-05 | H | not run | 2 | Check | nextThing() feeds the step, the light, z.expect and the helper (build) |
| STD-F3-06 | H | judge | 2 | Check | z.tick, life.js timers |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 2 | Check | loads only the settings' files (build) |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | not run | 2 | Check |  |
| STD-F4-06 | H | not run | 2 | Check |  |
| STD-F5-01 | H | gap | 2 | Check | the lab at L1-L4 |
| STD-F5-02 | H | not run | 2 | Check | z.progress, z.skill, z.listen |
| STD-F5-03 | H | not run | 1 | Kit | the cob's ring on no lab page |

## G Proof

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-G1-01 | H | gap | 2 | Check |  |
| STD-G1-02 | H | judge | 2 | Check |  |
| STD-G1-03 | H | judge | 2 | Check |  |
| STD-G1-04 | H | not run | 2 | Check |  |
| STD-G1-05 | H | not run | 2 | Check |  |
| STD-G1-06 | H | gap | 2 | Check |  |
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
| STD-H1-01 | H | judge | 2 | Art | block 1 landed; CO on the redo list |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 2 | Art |  |
| STD-H1-05 | H | not run | 2 | Art | CX a kept best try |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | makai's gender; laal marcha, lili, amli alone |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | three dressings grey |
| STD-H2-05 | H | not run | 2 | Check |  |
| STD-H3-01 | H | judge | 2 | Check |  |
| STD-H3-02 | H | judge | 2 | Check |  |
| STD-H3-03 | F | judge | 2 | Check |  |
| STD-H3-04 | H | gap | 3 | Check | this page |
| STD-H3-05 | H | judge | 3 | Check | "Not to touch" below |
| STD-H3-06 | H | judge | 2 | Check |  |
| STD-H3-07 | H | judge | 2 | Check |  |
| STD-H4-01 | H | judge | 2 | Check |  |
| STD-H4-03 | H | not run | 2 | Check |  |
| STD-H4-04 | H | not run | 2 | Check |  |
| STD-H4-05 | H | judge | 2 | Check |  |
