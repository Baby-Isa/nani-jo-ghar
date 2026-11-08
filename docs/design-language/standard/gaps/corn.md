# The corn stall: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-corn), before any build. `node build/tools/review/audit.mjs --standard corn` (205
House and Family rules; no contract run, no saved checks: 2 pass, 14 fail, 28 judge, 39 gap, 122 not run), then my read of the
game (`js/cook/stations/corn.js`, `data/stations/corn.json`, its order `recipes.corn` in `data/cook.json`, its lab tile). The corn
stall is a lab prototype (Zafar's, 1 Nov: "a sekelo redress, all on one screen"; on the farm, day 2), never judged. Its flow
`cook:corn` plays to the end today with two contract breaks of its own: contract-24 (the next thing glows at once, before the
level's wait) and contract-95 ("Hane makai!" said after a skip, before any step opens).

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece: (d) lights and lessons, (e) the order's flow) · Game code ·
Art · Words · Decision · Check. Scope: H House, F Family. Audit: what `--standard corn` printed.

**Counts (205 rules), before the build:** 0: 15 · 1: 47 · 2: 139 · 3: 4 · 4: 0 · 5: 0 · dbd: 0.
**After the build:** to come (rescored at the end).

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
| STD-01-03 | H | not run | 2 | Check | contract-16 never run on cook:corn |
| STD-01-04 | H | not run | 1 | Check | no leak config for corn; the glow on the asked dressing gives it away (D2-05) |
| STD-01-05 | H | judge | 1 | Check | never judged (a lab prototype) |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | not run | 1 | Adopt | a frown at the end for a wrong dressing; settings end.display is progress (as eggs, decision 8) |
| STD-01-08 | H | not run | 2 | Art | block 1's runs; CO on the redo list |
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
| STD-A1-02 | H | not run | 2 | Adopt | the lab's card (e) |
| STD-A1-04 | H | judge | 2 | Check | the order frames vary |
| STD-A1-05 | H | not run | 0 | none | no speaking moment |
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
| STD-A4-02 | H | not run | 2 | Words | laal marcha, lili, amli have no word of their own: their cards grey English (settings gaps) |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | not run | 1 | Game code | no step ever opens (no ctx.nextStep): Nani's box never moves past the order |
| STD-B1-02 | H | not run | 2 | Check | one asker, served by the plate tap |
| STD-B1-03 | H | not run | 2 | Adopt | (e) |
| STD-B1-04 | H | not run | 2 | Kit | the recipe says the no last; O.ladder (e) |
| STD-B1-05 | H | not run | 1 | Game code | contract-95: "Hane makai!" said after a skip, before any step opens |
| STD-B1-06 | H | not run | 2 | Check | the serve is the plate tap (his prototype); the work itself has no end of its own |
| STD-B1-07 | H | fail | 2 | Check | passMeChance 0; corn never calls passMeAfter |
| STD-B2-01 | F | pass | 3 | Check | grilled on the grill, dressed on the plate |
| STD-B2-02 | H | gap | 2 | Check | a tap at every level |
| STD-B2-03 | F | gap | 2 | Check | the ring over each cob |
| STD-B2-04 | F | not run | 1 | Decision | a cooking cob refuses (wiggles); none ever burns: no after |
| STD-B2-05 | F | gap | 2 | Check | no window closes |
| STD-B2-06 | F | not run | 2 | Check | up to three cobs, each its own clock |
| STD-B2-07 | H | not run | 2 | Check |  |
| STD-B2-08 | H | gap | 1 | Game code | a wrong dressing is only a frown at the end; no redo on the spot (St.redo) |
| STD-B2-09 | F | not run | 0 | none | nothing is lost |
| STD-B2-10 | H | pass | 1 | Game code | a dressing once on cannot be taken back (a second tap wiggles) |
| STD-B2-11 | F | not run | 0 | none | no pour |
| STD-B3-02 | H | not run | 2 | Check | the box past the count wiggles |
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
| STD-C2-08 | H | not run | 2 | Adopt |  |
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
| STD-D1-01 | H | not run | 1 | Adopt | its own copy of the first-time gate (fresh, first) -> Cook.Coach.firsts (d) |
| STD-D1-02 | H | not run | 1 | Adopt | the light is a bare S.glow: no dim, no gold box (d) |
| STD-D1-03 | H | not run | 1 | Adopt | (d) |
| STD-D1-05 | H | gap | 0 | none | the whole cob is lit |
| STD-D1-06 | H | not run | 1 | Adopt | the light and the call not together, no breath (d) |
| STD-D1-07 | H | fail | 1 | Adopt | no card light (d) |
| STD-D1-08 | H | fail | 1 | Adopt | no reveal lessons (d) |
| STD-D1-09 | H | not run | 0 | none | no window closes |
| STD-D1-10 | F | fail | 1 | Adopt | the next cob from the box: no next light (d) |
| STD-D2-01 | H | not run | 1 | Adopt | contract-24: the next thing glows at once, every time (d) |
| STD-D2-02 | H | not run | 1 | Game code | the stuck hint names nothing |
| STD-D2-03 | H | not run | 1 | Adopt | (d) |
| STD-D2-04 | H | not run | 1 | Adopt | a wrong dressing brings nothing (d) |
| STD-D2-05 | H | not run | 1 | Adopt | the asked dressing glows, past support too (d) |
| STD-D2-06 | F | not run | 2 | Check | "Firai!" as the ring fills |
| STD-D3-01 | H | not run | 1 | Game code | her box never shows the step (no step opens) |
| STD-D3-02 | H | fail | 1 | Adopt | no helper card (d) |
| STD-D3-03 | H | not run | 2 | Adopt | (e) |
| STD-D3-04 | H | not run | 2 | Adopt | (e) |
| STD-D3-05 | H | gap | 2 | Check |  |
| STD-D4-01 | H | not run | 2 | Check | the head ticks at the count; a dressing at its tap |
| STD-D4-02 | H | fail | 2 | Adopt | (e) |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check |  |
| STD-D5-03 | H | not run | 2 | Check |  |
| STD-D5-04 | H | not run | 2 | Check |  |

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
| STD-E2-05 | H | not run | 2 | Check |  |
| STD-E2-06 | H | not run | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check | the stall's face a kit badge |
| STD-E2-08 | H | not run | 1 | Adopt | no lit box (d) |
| STD-E3-01 | H | not run | 1 | Game code | sizes are pixel literals in code; settings items.drawn unread |
| STD-E3-02 | H | fail | 1 | Game code | the table drawn in code though CT (bg-table) landed; dressing dots and smoke drawn |
| STD-E3-03 | F | not run | 1 | Decision | the stall's oak table (CT), not the marble |
| STD-E3-04 | F | not run | 0 | none | no hob |
| STD-E3-05 | F | gap | 0 | none | no one drawn at a counter |
| STD-E4-01 | H | fail | 2 | Check | dots appear at once on the cob |
| STD-E4-02 | H | not run | 2 | Adopt | (e) |
| STD-E4-03 | F | gap | 2 | Check | raw, half, done |
| STD-E4-04 | H | gap | 2 | Check |  |
| STD-E5-01 | H | not run | 2 | Check |  |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | 2 | Check | "Firai!" may come mid-dressing at L3-L4 |
| STD-E6-01 | H | not run | 2 | Check | colours from the settings palette |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 1 | Adopt | its own light manager and gate |
| STD-F1-02 | H | not run | 1 | Game code | copies chai's first-time gate (fresh, first) and glow-the-next |
| STD-F1-03 | H | gap | 1 | Game code | art paths, sizes, places, DRESS, LIQUID in code; settings items, scene, assets unread |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Check |  |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 1 | Kit | no decoys or hint wait from the rules |
| STD-F2-03 | F | gap | 1 | Game code | sizes, places, the ring's radius in code |
| STD-F2-04 | H | gap | 1 | Game code | stage-px literals, no derivation |
| STD-F3-01 | H | fail | 2 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Adopt |  |
| STD-F3-04 | H | not run | 0 | none |  |
| STD-F3-05 | H | not run | 2 | Check | nextThing() feeds z.expect and the glow |
| STD-F3-06 | H | judge | 2 | Check | z.tick, life.js timers |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 1 | Game code | loads the old proto art (assets/cook/proto/corn-*), not settings.assets |
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
