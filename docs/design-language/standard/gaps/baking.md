# Baking: its gap to the standard

**Made:** 8 Nov 2026, Sprint 18 wave 2 (s18-g-baking), before any build. `node build/tools/review/audit.mjs --standard baking --run
s18-g-baking-pre` (205 House and Family rules, read against my contract run of `cook:baking` L1-L4 at 1280x665: 16 pass, 16 fail, 35
judge, 47 gap, 91 not run; that run: 17 breaks, contract-24 12, contract-98 3, contract-23 2), then my read of the game
(`js/cook/stations/baking.js`, `data/stations/baking.json`). Where the audit's pass or fail is chai's probe, the score is baking's own.

**Scores before the build:** 0: 14 · 1: 36 · 2: 138 · 3: 15 · dbd: 2. **Updated** the same night after the build (a note
ending "(build)"; the audit re-read against s18-g-baking-contract, the four sizes at L1 and L4, 0 breaks): 0: 14 · 1: 17 · 2: 152 · 3: 20 · 4: 0 · 5: 0 · dbd: 2

**The scale:** 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his "done" · dbd different by design (dated).
**Next:** Kit (a kit piece still to build) · Adopt (take a kit piece: (d) lights and lessons, (e) the order's flow) · Game code ·
Art · Words · Decision · Check. Scope: H House, F Family. Audit: what `--standard baking` printed.

## Not to touch (non-negotiable 1, the keep list)

- His turn-by-turn design (1 Nov): Nani gives one instruction at a time and its row appears as she says it; tap what she names; each
  tap tips it a bit more and some goes in; "a little" one tap and "that's good"; "a lot" taps until enough; "a little more" a tap,
  "still a little more", a tap, "enough"; more taps don't land; the row ticks the moment the amount is there.
- The measuring jug from L3: its lines at a quarter, half, full, one and a half and two and a half, no numbers; a tap a quarter cup;
  it tips into the bowl by itself.
- Tap the bowl for the dough; the oven: tap to open, tap the naan in, its ring fills, out when Nani says it's ready, steam, Nana's
  happy face. The cat (Simba) peeking over the counter.
- KEEP-01 (the underline while a line is spoken; the order card and pop-up).

## What the build does (this sprint, in this order)

1. **Game code:** the game reads its settings (`Cook.data.settings.baking`): the scene picture, the bowl's states, the jug's
   pictures and its lines (`items.jug.lineAt`, a rising crop, never a drawn fill), the oven's three pictures, the naan by the bake; it loads only `settings.assets`.
2. **Adopt (d):** the kit's first-time gate (`Cook.Coach.firsts`), each control's call with its light (`Cook.Coach.control`: the
   tip, the bowl, the oven; contract-24), a wrong pick rushes the hint (`Cook.Coach.wrong`), the reveal lessons before the first turn
   (`Cook.Coach.lessons`; contract-98). Nani's turn is tagged a call (contract-23's "Thorok.").
3. **Game code:** decoys from the central rules (1-4, the L4 lookalike), noted for contract-37.
4. **Kit (asks):** a word moment for any measure (baking's jug, ART-38's art); a page box for a canvas thing (`pageRect`).

## 0 Foundations

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-01-01 | H | gap | 2 | Check | the tap-to-tip turns, the amounts, the jug and the oven kept; no diff tool yet |
| STD-01-02 | H | not run | 2 | Words | lines from the engine; naan, a lot, still a little more, that's good and three jug amounts grey English (R6-18, R6-135) |
| STD-01-03 | H | pass | 3 | Check | contract-16, -46, -39 green L1-L4 at 1280x665 |
| STD-01-04 | H | not run | 1 | Check | no leak config for baking |
| STD-01-05 | H | judge | 1 | Check | never judged as a game |
| STD-01-06 | H | not run | 2 | Check |  |
| STD-01-07 | H | gap | 2 | Check | no verdict: "that's good", "enough"; a tap past the amount adds nothing |
| STD-01-08 | H | not run | 2 | Art | the landed block wired (build); the cat and the word moment placeholders |
| STD-01-09 | H | not run | 2 | Check | naan, flour, milk, yoghurt; the reward is the naan to Nana |
| STD-02-01 | H | gap | 2 | Check | no child-pace play |
| STD-02-02 | H | gap | 2 | Check | the containers by picture and chip; the amount by her voice |
| STD-02-03 | H | gap | 2 | Check | every action a tap |
| STD-02-04 | H | judge | 3 | Check | contract green at the four sizes, L1 and L4 (build) |
| STD-02-05 | H | not run | 2 | Check |  |

## A Learning

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-A1-01 | H | gap | 2 | Check | L1: flour, water or milk, naan, a lot, a little |
| STD-A1-02 | H | pass | 3 | Check | contract-93, -26 green |
| STD-A1-04 | H | judge | 2 | Check | plans vary the container and the amount |
| STD-A1-05 | H | not run | 0 | none | no speaking moment |
| STD-A2-01 | H | not run | 2 | Adopt | (d) |
| STD-A2-02 | H | pass | 3 | Check | contract-39 green |
| STD-A2-03 | H | fail | 2 | Adopt | the card kit's blur (the audit's fail is chai's probe) |
| STD-A2-04 | H | not run | 2 | Adopt | (d) |
| STD-A2-05 | H | not run | 2 | Adopt | (d) |
| STD-A3-01 | H | fail | 1 | Kit | the jug's moment's settings and call are in (build); the kit's call plays chai's pair only (asked) |
| STD-A3-02 | H | fail | 1 | Kit | as A3-01 |
| STD-A3-03 | H | gap | 1 | Kit | as A3-01; its art ART-38 |
| STD-A3-04 | H | judge | 2 | Art | the jug's five even lines, no numbers; ART-38's measure |
| STD-A4-01 | H | not run | 2 | Words | the step line joins two engine lines: no "N cups of X" frame (R6-136) |
| STD-A4-02 | H | not run | 2 | Words | seven grey English rows on the sheet |
| STD-A4-03 | H | not run | 2 | Kit | the store-build flag is a gap |
| STD-A4-04 | H | not run | 2 | Check |  |

## B Play

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-B1-01 | H | gap | 2 | Check | her order on the card, the mix, the oven, the end; no word moment at L3 |
| STD-B1-02 | H | gap | 2 | Check | the naan to Nana's face |
| STD-B1-03 | H | pass | 3 | Check | contract-88, -93 green |
| STD-B1-04 | H | not run | 0 | none | no "no" items |
| STD-B1-05 | H | not run | 2 | Adopt | (e) |
| STD-B1-06 | H | pass | 3 | Check | contract-2, -12 green |
| STD-B1-07 | H | fail | 2 | Check | baking never calls pass-me |
| STD-B2-01 | F | pass | 2 | Check | the dough in the bowl, the naan in the oven (the audit's pass is chai's probe) |
| STD-B2-02 | H | gap | 2 | Check | a tap to tip at every level; the jug a tap a quarter cup |
| STD-B2-03 | F | gap | 2 | Check | the oven's ring shows the bake |
| STD-B2-04 | F | not run | 1 | Decision | the oven is not tappable before ready and the naan never burns (naan-deep landed): his call |
| STD-B2-05 | F | gap | 2 | Check | no window end |
| STD-B2-06 | F | not run | 0 | none | one naan |
| STD-B2-07 | H | pass | 3 | Check | contract-21 green |
| STD-B2-08 | H | gap | 0 | none | no wrong dish: a tap past the amount does not land |
| STD-B2-09 | F | not run | 0 | none |  |
| STD-B2-10 | H | pass | 2 | Check | nothing goes in past the amount; a wrong container wiggles, never pours |
| STD-B2-11 | F | not run | dbd | Decision | a pour is a tap per tip, his turn-by-turn design (1 Nov) |
| STD-B3-02 | H | pass | 3 | Check | contract-71 green |
| STD-B3-03 | F | not run | 2 | Check | the jug fills by one tap repeated, ticks at the line |
| STD-B4-01 | H | not run | 2 | Check | the pour sound, the tilt, the stream, the mound rises |
| STD-B4-02 | H | not run | 0 | none | no control |
| STD-B4-03 | F | not run | 2 | Check | the oven's ring and steam |
| STD-B4-04 | H | not run | 2 | Check | the naan out, Nana's face |
| STD-B4-05 | H | gap | 2 | Check |  |
| STD-B4-06 | H | not run | 2 | Check |  |

## C Progression

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-C1-01 | H | not run | 2 | Check | L1 asks a lot and a little in one round |
| STD-C1-02 | H | gap | 1 | Kit | naan first met here; the amounts by the word moment (A3) |
| STD-C2-01 | H | not run | 2 | Check | L1 two turns, L2 three with "more", L3 the jug, L4 four with the jug's other lines |
| STD-C2-02 | H | not run | 2 | Check | turns 2, 3, 3, 4 |
| STD-C2-03 | H | not run | 2 | Check | the rules' 1-4 and the L4 lookalike, St.tableDecoys (build); contract-37 does not judge baking yet |
| STD-C2-04 | H | not run | 1 | Decision | no "no" asks at any level |
| STD-C2-05 | H | not run | 2 | Adopt | (e) |
| STD-C2-06 | H | not run | 1 | Decision | only the oven is timed, and it is longer at L4 (4.2 s against 3.6) |
| STD-C2-07 | H | not run | 2 | Check |  |
| STD-C2-08 | H | not run | 2 | Adopt | the lab's round never levels up |
| STD-C2-09 | H | gap | 2 | Check |  |
| STD-C3-01 | H | not run | 2 | Adopt |  |
| STD-C3-02 | H | not run | 2 | Adopt |  |
| STD-C3-03 | H | not run | 2 | Adopt |  |
| STD-C3-04 | H | not run | 2 | Check | the chip under each container |
| STD-C3-05 | H | not run | 2 | Adopt |  |
| STD-C3-06 | H | not run | 2 | Adopt | (e) |
| STD-C3-07 | H | not run | 2 | Adopt |  |
| STD-C4-01 | H | gap | 1 | Kit | as C1-02 |
| STD-C4-03 | H | not run | 2 | Check | the lab's level only |

## D Guidance

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-D1-01 | H | not run | 2 | Check | the kit's gate, Cook.Coach.firsts (build) |
| STD-D1-02 | H | gap | 2 | Check | the kit's light: the dim, the gold box (build) |
| STD-D1-03 | H | judge | 2 | Check | one light at a time, closed as its thing is done (build) |
| STD-D1-05 | H | gap | 0 | none | no small part |
| STD-D1-06 | H | pass | 2 | Check | Cook.Coach.control for the tip, bowl, oven and naan (build) |
| STD-D1-07 | H | fail | 1 | Adopt | no card light (d) |
| STD-D1-08 | H | fail | 3 | Check | contract-98 green L1-L4: the lessons as each row is revealed (build) |
| STD-D1-09 | H | not run | 0 | none | no timed control |
| STD-D1-10 | F | fail | 0 | none | no next vessel |
| STD-D2-01 | H | not run | 3 | Check | contract-24 green L1-L4 (build) |
| STD-D2-02 | H | not run | 2 | Check | the shared step names the item asked now |
| STD-D2-03 | H | not run | 3 | Check | contract-24 green (build) |
| STD-D2-04 | H | not run | 2 | Check | each control's stuck hint; a wrong pick rushes it (build) |
| STD-D2-05 | H | not run | 2 | Adopt | (d) |
| STD-D2-06 | F | pass | 0 | none | no timed control |
| STD-D3-01 | H | not run | 2 | Adopt | (e) |
| STD-D3-02 | H | fail | 2 | Adopt | the shared step's helper card |
| STD-D3-03 | H | pass | 3 | Check | contract-89 green |
| STD-D3-04 | H | not run | 2 | Adopt |  |
| STD-D3-05 | H | gap | 2 | Adopt |  |
| STD-D4-01 | H | not run | 2 | Check | ticks at the amount (Zafar, 1 Nov) |
| STD-D4-02 | H | fail | 2 | Adopt | (e) |
| STD-D5-01 | H | not run | 2 | Check |  |
| STD-D5-02 | H | gap | 2 | Check |  |
| STD-D5-03 | H | not run | 2 | Adopt |  |
| STD-D5-04 | H | pass | 3 | Check | contract-38, -32 green |

## E Presentation

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-E1-01 | H | judge | 2 | Check |  |
| STD-E1-02 | H | gap | 2 | Check |  |
| STD-E1-04 | H | not run | 2 | Check |  |
| STD-E1-05 | H | judge | 2 | Check | the oven's ring over the oven |
| STD-E2-01 | H | not run | 2 | Check |  |
| STD-E2-02 | H | not run | 2 | Check |  |
| STD-E2-03 | H | not run | 2 | Check |  |
| STD-E2-04 | H | not run | 2 | Check | naan's card the naan alone; the cup's the jug |
| STD-E2-05 | H | pass | 3 | Check | contract-76, -83 green |
| STD-E2-06 | H | gap | 2 | Check |  |
| STD-E2-07 | H | not run | 2 | Check | the review's face is the kit's |
| STD-E2-08 | H | judge | 3 | Check | contract-92, -53 green (build) |
| STD-E3-01 | H | not run | 2 | Check | sizes and places from the settings' items (build) |
| STD-E3-02 | H | fail | 2 | Art | pictures now (build); code draws the bake ring, steam and the drops for salt, yoghurt, ghee |
| STD-E3-03 | F | not run | dbd | Decision | the side-on counter, his mock-up (1 Nov), not the marble |
| STD-E3-04 | F | judge | 0 | none | no hob |
| STD-E3-05 | F | gap | 0 | none | no one at the counter |
| STD-E4-01 | H | fail | 2 | Check | the door swaps two pictures by design |
| STD-E4-02 | H | pass | 3 | Check | contract-83 green |
| STD-E4-03 | F | gap | 2 | Check | the oven's baking picture and ring; the naan raw in, golden out (build) |
| STD-E4-04 | H | gap | 2 | Check |  |
| STD-E5-01 | H | pass | 3 | Check | contract-7, -22 green |
| STD-E5-03 | H | not run | 2 | Check |  |
| STD-E5-04 | H | not run | 2 | Check | "still a little more" said between tips |
| STD-E6-01 | H | not run | 2 | Check | the art colours in its settings |
| STD-E6-02 | H | not run | 2 | Check |  |

## F Build

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-F1-01 | H | gap | 2 | Check | the kit's lights, lessons, decoys (build) |
| STD-F1-02 | H | not run | 2 | Check | its own first() gate and lit-at-once glows deleted (build) |
| STD-F1-03 | H | gap | 2 | Check | the settings file read for its scene, items, word moment (build) |
| STD-F1-04 | H | not run | 2 | Check |  |
| STD-F1-05 | H | gap | 2 | Check | all on its old code |
| STD-F1-06 | H | judge | 3 | Check | brief.mjs --live-check |
| STD-F2-02 | H | not run | 2 | Check | decoys from the rules (build) |
| STD-F2-03 | F | gap | 2 | Check | places, sizes, the jug's lines in its settings (build) |
| STD-F2-04 | H | gap | 2 | Check |  |
| STD-F3-01 | H | fail | 2 | Check |  |
| STD-F3-02 | H | not run | 2 | Check |  |
| STD-F3-03 | H | fail | 2 | Adopt |  |
| STD-F3-04 | H | not run | 0 | none |  |
| STD-F3-05 | H | not run | 2 | Check | z.expect |
| STD-F3-06 | H | judge | 2 | Check | the cat's endless tween, z.tick |
| STD-F4-02 | H | judge | 2 | Check |  |
| STD-F4-03 | H | fail | 2 | Check | only what the round draws, from its settings (build); loadcheck lacks baking (asked) |
| STD-F4-04 | H | not run | 2 | Check |  |
| STD-F4-05 | H | judge | 2 | Check |  |
| STD-F4-06 | H | not run | 2 | Check |  |
| STD-F5-01 | H | gap | 2 | Check | the lab's baking tile, L1-L4 |
| STD-F5-02 | H | not run | 2 | Check |  |
| STD-F5-03 | H | not run | 1 | Kit | no baking section on the kitchen-kit lab page |

## G Proof

| Rule | Scope | Audit | Score | Next | Note |
|---|---|---|---|---|---|
| STD-G1-01 | H | gap | 2 | Check |  |
| STD-G1-02 | H | judge | 2 | Check |  |
| STD-G1-03 | H | judge | 2 | Check |  |
| STD-G1-04 | H | gap | 2 | Check |  |
| STD-G1-05 | H | not run | 2 | Check |  |
| STD-G1-06 | H | gap | 2 | Check |  |
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
| STD-H1-01 | H | judge | 2 | Art | block 1 from his runs; ART-38's word moment to come |
| STD-H1-02 | H | judge | 2 | Check |  |
| STD-H1-03 | H | gap | 2 | Check |  |
| STD-H1-04 | H | judge | 2 | Art | ART-38 queued, no sizes yet |
| STD-H1-05 | H | not run | 2 | Art | cat-peek a named placeholder |
| STD-H1-06 | H | not run | 2 | Check |  |
| STD-H1-07 | H | not run | 2 | Check | the tray flagged warm (prep) |
| STD-H1-08 | H | gap | 2 | Check |  |
| STD-H1-09 | H | gap | 2 | Check |  |
| STD-H2-01 | H | not run | 2 | Words | R6-18, R6-135, R6-136 |
| STD-H2-02 | H | judge | 2 | Check |  |
| STD-H2-04 | H | not run | 1 | Words | naan unrecorded |
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
