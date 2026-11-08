# Eggs at breakfast: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-eggs), before any build. `node build/tools/review/audit.mjs --standard eggs --run
s18-g-eggs-before` (205 House and Family rules; the contract run `cook:eggs` and `cook:eggs@L4` at 1280x665: both reach the end,
5 breaks, contract-24 4 (the next thing glows at once) and contract-98 1 (a dotted word with no lesson, L4); 16 pass, 24 fail,
33 judge, 44 gap, 88 not run), then my read of `js/cook/stations/eggs.js` (580 lines) and `data/stations/eggs.json`. Many audit
fails are shared rows read from other games' probes (SH-190, SH-180, SH-195, CHAI-67, MAA-14); the note says so and the score is
eggs' own.

**Counts (before):** score 0: 14 · 1: 44 · 2: 133 · 3: 14 · 4: 0 · 5: 0.

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece: (a) heat, (b) pans and serving, (c) the shelf and pills,
(d) lights and lessons, (e) the order's flow) · Game code · Art · Words · Decision · Check. Scope: H House, F Family.

## Not to touch (non-negotiable 1, the keep list)

- The prototype's mechanic (Zafar, 1 Nov): tap the bowl, an egg lifts; tap the pot (boiled) or the pan (fried, cracked flat);
  each egg's ring fills, in the green it glows; tap it, then its person's plate (a boiled egg in its cup); a plate ticks at its
  count; an extra egg does not land; from L3 the salt and pepper shakers, tap one then a plate; tap the tray: the table, the
  window's sky by the meal (breakfast, lunch, dinner), each plate sliding to its person, steam, the cat on the sill.
- Several eggs in the pot and the pan at once (Zafar: room for several); an egg waits in the green (no overcooking).
- KEEP-01 (the underline while a line is spoken; the order card and pop-up).

## What the build does (this sprint, in this order)

1. **Game code:** the end never frowns (decision 8): `mood = ok ? "happy" : "neutral"`, the soft sound, no shake. Its settings
   from `Cook.data.settings.eggs` (items, scene, assets): the landed block-1 art in place of the mock-up crops and code shapes
   (pot by state, pan dry/oil, eggs, fried egg by the ring, the bowl by its count, shakers, egg cups, the served plate, the
   morning and night kitchens); `Cook.roundDone`.
2. **Adopt (d):** the first-time gate `Cook.Coach.firsts`; each step's call with its light `Cook.Coach.control` (the first time
   lit with the call, after that the stuck hint after the level's wait, at once after a wrong move `Cook.Coach.wrong`); the next
   vessel `Cook.Coach.nextLight` choosing the pot or the pan; the reveal lessons `Cook.Coach.lessons`. Deletes eggs' own `first()`
   and its glow-at-once. Fixes contract-24 and -98.
3. **Adopt (a, b, e)** where eggs has the thing: the burners' flames (`Cook.Kit.burner`), the heat ring (`Cook.Kit.heatRing`),
   the people's orders (`UI.peopleSay`), the review faces (`NjgServe`) at the table.
4. **Asks** for what eggs needs and the kit lacks go in the report.

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | the bowl, the pot or the pan, the rings, the plates, the shakers, the tray to the table kept; no diff tool yet |
| STD-01-02 | H | not run | 2 | Words | every line from the engine; boiled egg (ph-boiledegg) grey English; egg's gender not yet asked |
| STD-01-03 | H | pass | 3 | Check | contract-16, -46, -39 green on cook:eggs L1, L4 |
| STD-01-04 | H | not run | 1 | Check | no leak config for eggs |
| STD-01-05 | H | judge | 1 | Check | never judged (a lab prototype) |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | gap | 1 | Game code | a wrong plate gets a frown at the table (decision 8: chai's progress display) |
| STD-01-08 | H | not run | 2 | Art | block 1 landed and cut (s18-prep); the game still loads the 1 Nov mock-up crops and draws shapes |
| STD-01-09 | H | not run | 2 | Check |  |
| STD-02-01 | H | gap | 1 | Check | no child-pace play of eggs |
| STD-02-02 | H | gap | 2 | Check |  |
| STD-02-03 | H | gap | 2 | Check | every move a tap |
| STD-02-04 | H | fail | 2 | Check | panelcheck's fail is the shared panel (SH-190); eggs played at 1280x665 only |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 2 | Decision | egg, fried, boiled egg, salt, pepper over L1-L4; L1 meets two |
| STD-A1-02 | H | pass | 3 | Check |  |
| STD-A1-04 | H | judge | 2 | Check |  |
| STD-A1-05 | H | not run | 0 | none | no speaking moment; a tap always works |
| STD-A2-01 | H | not run | 2 | Check |  |
| STD-A2-02 | H | pass | 3 | Check |  |
| STD-A2-03 | H | fail | 2 | Adopt | the card kit's (SH-195 is chai's probe) |
| STD-A2-04 | H | not run | 2 | Check |  |
| STD-A2-05 | H | not run | 2 | Check |  |
| STD-A3-01 | H | fail | 0 | none | no amount words: the counts are pictures |
| STD-A3-02 | H | fail | 0 | none |  |
| STD-A3-03 | H | gap | 0 | none |  |
| STD-A3-04 | H | judge | 0 | none |  |
| STD-A4-01 | H | not run | 2 | Check |  |
| STD-A4-02 | H | not run | 2 | Check |  |
| STD-A4-03 | H | not run | 2 | Check |  |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | gap | 2 | Check | the people, the order, the hob, the tray, the table, the end |
| STD-B1-02 | H | gap | 1 | Decision | the table: each plate slides to its person; one well done if all right; no thank-you each |
| STD-B1-03 | H | pass | 3 | Check |  |
| STD-B1-04 | H | not run | 2 | Check | 'no salt' (L4) said last by kit e's ladder |
| STD-B1-05 | H | not run | 2 | Adopt | (e) |
| STD-B1-06 | H | pass | 3 | Check | contract-2, -12 green; the tray tap is the serve (his mechanic) |
| STD-B1-07 | H | fail | 2 | Check | eggs never calls passMeAfter (MAA-14 is maani's probe) |
| STD-B2-01 | F | pass | 3 | Check | boiled in the pot, fried in the pan |
| STD-B2-02 | H | gap | 2 | Check | taps at every level |
| STD-B2-03 | F | gap | 2 | Check | the ring on each egg, its green |
| STD-B2-04 | F | not run | 1 | Decision | too early wiggles; an egg waits in the green and never overcooks (the prototype, 1 Nov): dbd to ask |
| STD-B2-05 | F | gap | 2 | Check | the green never ends |
| STD-B2-06 | F | not run | 2 | Check | several eggs in the pot and the pan at once |
| STD-B2-07 | H | pass | 3 | Check |  |
| STD-B2-08 | H | gap | 1 | Decision | no redo at the table (the prototype's decision 2, his to reverse) |
| STD-B2-09 | F | not run | 0 | none | nothing is lost |
| STD-B2-10 | H | pass | 2 | Game code | an egg on a plate cannot be taken back |
| STD-B2-11 | F | not run | 0 | none | no pour |
| STD-B3-02 | H | pass | 3 | Check | an extra egg hops and stays in the hand |
| STD-B3-03 | F | not run | 0 | none | no amount |
| STD-B4-01 | H | not run | 2 | Check | pop, sizzle, the egg lifts |
| STD-B4-02 | H | not run | 0 | none | no control: the burner lights as an egg goes in |
| STD-B4-03 | F | not run | 2 | Check | the ring grows; steam at the green |
| STD-B4-04 | H | not run | 2 | Check |  |
| STD-B4-05 | H | gap | 1 | Game code | the table frowns at a wrong plate |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 1 | Decision | boiled and fried not set as a teaching pair |
| STD-C1-02 | H | gap | 1 | Kit | egg, fried, salt, pepper first met here (d: the general first meeting) |
| STD-C2-01 | H | not run | 2 | Check |  |
| STD-C2-02 | H | not run | 2 | Check | people 1, 2, 3, 3; eggs each 1, 1-2, 1, 1-2 (data/cook.json) |
| STD-C2-03 | H | not run | 1 | Decision | no shelf decoys; the pot or the pan is the pick |
| STD-C2-04 | H | not run | 1 | Decision | 'no salt' only at L4 (data/cook.json) |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 1 | Decision | cookMs grows by level (3.2 to 4.4 s): slower, not quicker |
| STD-C2-07 | H | not run | 1 | Decision | L3 eggs each 1 after L2's 1-2: a count goes down |
| STD-C2-08 | H | not run | 1 | Game code | eggs never calls Cook.roundDone |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Check |  |
| STD-C3-02 | H | not run | 2 | Check |  |
| STD-C3-03 | H | not run | 2 | Check |  |
| STD-C3-04 | H | not run | 2 | Adopt | the bowl's and shakers' word chips (Cook.Kit.chip) |
| STD-C3-05 | H | not run | 2 | Check |  |
| STD-C3-06 | H | not run | 2 | Check |  |
| STD-C3-07 | H | not run | 2 | Check |  |
| STD-C4-01 | H | gap | 1 | Kit | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check |  |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 1 | Adopt | (d): its own first() on save.seenStation, lit at once |
| STD-D1-02 | H | gap | 1 | Adopt | (d): S.glow bounce, no dim, no box |
| STD-D1-03 | H | judge | 1 | Adopt | (d): the pot and the pan lit together |
| STD-D1-05 | H | gap | 0 | none | nothing small |
| STD-D1-06 | H | pass | 1 | Adopt | (d): no breath, no call held |
| STD-D1-07 | H | fail | 1 | Adopt | (d): no card light |
| STD-D1-08 | H | fail | 1 | Adopt | (d): contract-98 broke at L4 |
| STD-D1-09 | H | not run | 0 | none | no timed control |
| STD-D1-10 | F | fail | 1 | Adopt | (d): the next vessel chooses between the pot and the pan |
| STD-D2-01 | H | fail | 1 | Adopt | (d): contract-24, 4 breaks (the next thing glows at once) |
| STD-D2-02 | H | not run | 2 | Check | the next plate in the card's order |
| STD-D2-03 | H | fail | 1 | Adopt | (d) |
| STD-D2-04 | H | not run | 1 | Adopt | (d): an unready egg wiggles, nothing rushes |
| STD-D2-05 | H | not run | 1 | Adopt | (d) |
| STD-D2-06 | F | pass | 0 | none | no timed control |
| STD-D3-01 | H | not run | 2 | Check |  |
| STD-D3-02 | H | fail | 1 | Adopt | (d, e): the helper card is blank |
| STD-D3-03 | H | pass | 2 | Adopt | (e) |
| STD-D3-04 | H | not run | 2 | Check |  |
| STD-D3-05 | H | fail | 2 | Check |  |
| STD-D4-01 | H | not run | 2 | Check | a plate ticks at its count |
| STD-D4-02 | H | fail | 2 | Adopt | (e) |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check |  |
| STD-D5-03 | H | not run | 2 | Check |  |
| STD-D5-04 | H | pass | 3 | Check |  |

## E Presentation

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-E1-01 | H | fail | 2 | Check | the shared panel (panelcheck SH-190) |
| STD-E1-02 | H | fail | 2 | Check | the shared panel |
| STD-E1-04 | H | fail | 2 | Check | the shared panel |
| STD-E1-05 | H | judge | 2 | Check |  |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check |  |
| STD-E2-03 | H | fail | 2 | Check | the shared panel |
| STD-E2-04 | H | not run | 2 | Check |  |
| STD-E2-05 | H | pass | 3 | Check |  |
| STD-E2-06 | H | gap | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check | the plates' faces are the kit's badge |
| STD-E2-08 | H | judge | 2 | Check |  |
| STD-E3-01 | H | not run | 1 | Art | mock-up crops and shapes at mixed scale |
| STD-E3-02 | H | fail | 1 | Art | eggs, plates, cups, shakers, the table and the window drawn in code |
| STD-E3-03 | F | not run | 2 | Check |  |
| STD-E3-04 | F | judge | 1 | Art | chai's pan of water stands in as the pot; the pan a mock-up crop |
| STD-E3-05 | F | gap | 2 | Check | the people behind the table |
| STD-E4-01 | H | fail | 2 | Check | SH-180 is the shared row |
| STD-E4-02 | H | pass | 3 | Check |  |
| STD-E4-03 | F | gap | 1 | Art | the fried egg never changes as it cooks |
| STD-E4-04 | H | gap | 2 | Check |  |
| STD-E5-01 | H | pass | 3 | Check |  |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | 2 | Check |  |
| STD-E6-01 | H | not run | 2 | Check | the colours are data (eggs.json station.palette) |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 1 | Adopt |  |
| STD-F1-02 | H | not run | 1 | Game code | its first-time gate copies chai's old one (fresh, seen, first) |
| STD-F1-03 | H | gap | 1 | Game code | art paths, sizes and places in code; the settings keys unread |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Check |  |
| STD-F1-06 | H | judge | 2 | Check |  |
| STD-F2-02 | H | not run | 1 | Kit | the level numbers in eggs.json mechanic.levels, not the rules file |
| STD-F2-03 | F | gap | 1 | Game code | vessel size, slots, tray and plate places in code |
| STD-F2-04 | H | gap | 2 | Check |  |
| STD-F3-01 | H | fail | 2 | Check | SH-180 is the shared row |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Check | SH-195 is chai's probe; eggs reads no progress itself |
| STD-F3-04 | H | fail | 2 | Check | the shared panel |
| STD-F3-05 | H | not run | 2 | Check | z.expect from nextThing |
| STD-F3-06 | H | judge | 2 | Check |  |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 1 | Game code | its art list in code; settings.assets unread |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | judge | 2 | Check |  |
| STD-F4-06 | H | not run | 2 | Check |  |
| STD-F5-01 | H | gap | 2 | Check | the lab at L1-L4 |
| STD-F5-02 | H | not run | 2 | Check |  |
| STD-F5-03 | H | not run | 0 | none | no kit piece of its own |

## G Proof

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-G1-01 | H | gap | 2 | Check |  |
| STD-G1-02 | H | judge | 2 | Check |  |
| STD-G1-03 | H | judge | 2 | Check |  |
| STD-G1-04 | H | gap | 2 | Check |  |
| STD-G1-05 | H | not run | 2 | Check |  |
| STD-G1-06 | H | fail | 2 | Check | the shared panel |
| STD-G1-07 | H | gap | 1 | Check | wave 3 |
| STD-G1-08 | H | not run | 2 | Check |  |
| STD-G1-09 | H | not run | 1 | Check | as 01-04 |
| STD-G2-01 | H | not run | 2 | Check |  |
| STD-G2-02 | H | judge | 2 | Check |  |
| STD-G2-03 | H | not run | 2 | Check |  |
| STD-G2-04 | H | not run | 2 | Check |  |
| STD-G2-05 | H | judge | 2 | Check |  |
| STD-G2-06 | H | gap | 2 | Check |  |
| STD-G2-07 | H | not run | 2 | Check |  |
| STD-G2-08 | H | gap | 0 | none | chai only |
| STD-G3-01 | H | judge | 1 | Check | wave 3 |
| STD-G3-02 | H | judge | 1 | Check | wave 3 |
| STD-G3-03 | H | judge | 2 | Check |  |
| STD-G3-04 | H | judge | 2 | Check |  |
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
| STD-H1-01 | H | judge | 2 | Art | block 1 (EP, EF, EG, EY, EB, ES, EM, EN) |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 2 | Check |  |
| STD-H1-05 | H | not run | 1 | Art | the cat a mock-up crop; Simba waits (art plan Q6) |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check |  |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | boiled egg on the sheet (R6-19, R6-137) |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | boiled egg unrecorded |
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

