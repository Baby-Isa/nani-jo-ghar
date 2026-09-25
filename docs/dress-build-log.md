# Dress up: build log

**Mode id** `dress-up` · **branch** `claude/build-dress` · **started** 25 Sept 2026 · **design** `docs/modes/dress-up-design.md` (the deep dive and section 12). Every default in the design doc was taken.

## Phase 0: pure logic (done)

| File | What it is |
|---|---|
| `data/dress.json` | 11 colours, 12 garments, parts, motifs, tools, 4 weathers: **all placeholders** (`"kutchi": null`). The real words (`num-01..05`, `ph-big`, `ph-small`, `ph-no`, and the frames need / and / no / give / oops / here) are **referenced by id from `data/cook.json`, never copied**. Also: people (Cook's `nana`, `ma`, `cousin`), palettes, the kinds K1-K5, levels per mini-game G1-G5, stitch/change/say knobs, the `dress-up` star set, the 5% budget |
| `js/dress/stubs/pick.js` | **Stub** for the foundation's shared which-one module: seeded RNG, sampling, `grid` (every kind in every colour), `rules` (leak rules 2-3), `setOdds` (the blind-odds calculator: the best of uniform, most-common-feature and most-salient-colour priors) |
| `js/dress/look.js` | `Dress.Look.generate({game, level, data, rng, profile, who})`: renderer-agnostic rounds for G1-G5 (and K5, the child as speaker). Weak words first. Widens the scope (a colour, a tool) until the round's blind odds are at most 5% |
| `js/dress/rack.js` | `Dress.Rack.build(round, rng)`: rail, shelf, tin, tray, tools, bangle tray, carry tray; shuffled spots; `Rack.rules` checks leak rules 2-4 |
| `js/dress/grade.js` | `Dress.Grade.check(round, state)`: per row `{ok, why, realOk}`, extras (over-collecting is graded; unasked slots are not), nar rows, for whom, counts, sizes, weather needs/forbids, pass me; `Grade.live` for level 1 |
| `build/leak_dress.mjs` | The Node leak bot (no browser) |

### Leak-bot numbers (Node, 2,000 rounds per game per level, seed 7)

Ear-star rate of the **worst** blind strategy; every strategy is listed by `node build/leak_dress.mjs`. Budget: under 10% (design target 5%). Strategies: random, salient, frequent, usual colour, occasion default, row order = slot/pile order, empty, try-and-see (L1), Done-then-fix, ignore the change of mind, over-fill, fill the tin / take the whole column, hedge every carry item.

| Game | L1 | L2 | L3 | Generator's blind odds (mean, L1) | Real-Kutchi slice (oracle for placeholders) |
|---|---|---|---|---|---|
| G2 Lay it out | 3.1% (usual) | 0.1% | 0.0% | 2.7% | none: no real-Kutchi decision |
| G1 The fitting | 3.1% (occasion) | 0.6% | 0.5% | 2.3% | L1 none; L2-3 about 90% (only *nar* is real) |
| G3 Big Ma's mending | 1.3% | 0.1% | 0.3% | 1.5% | **16.0%** L1 (count x size: the design's 17%) |
| G4 Bangles | 1.2% | 0.1% | 0.1% | 1.6% | **6.2%** L1 (the counts) |
| G5 Going out (logic only) | 3.1% | 3.0% | 3.1% | 4.8% | none |

No rack broke leak rules 2-4 in 30,000 rounds. The real-Kutchi slice is reported on its own, as design D.7 asks, and is **not** held to the budget: it is what a child who already knows every colour and garment word would get by guessing the real words.

**Placeholder decisions** (still English, so the ear star is not written to word progress for them; D.9 decision 4): G2 colour, garment, for whom · G1 colour, garment · G3 colour, thing, tool, motif, part, side · G4 colour, garment · G5 colour, garment, weather.

Fix found by the bot: G3 level 1 went over budget in 475 of 2,000 rounds when the asked button was the most eye-catching colour (the salient prior: 1/2 x 1/3 x 1/3 = 5.6%). The generator now adds a fourth tool to Big Ma's board in that case (4.2%).

## Phase 1: the greybox lab (done)

Open `dress.html` (the Dress lab is the title). `dress.html?game=fitting&level=2&seed=5` jumps straight into a round.

- **Page** (`dress.html`, `css/dress.css`, `js/dress/core.js`, `flow.js`): Cook's `core.js`, `lang.js`, `ui.js` and `cook.css` are loaded and read, never edited. Dress words and frames join `Cook.data` in memory only. One SVG world (1600x900). The sidebar holds the card, Done, who's talking, and "moments" (pass me, say how many); nothing covers the play area during play.
- **Renderer** (`js/dress/doll.js`): flat shapes for every garment, motif, button and tool; the upper-body renderer greys the existing crops (`assets/cook/characters/<who>-neutral.webp`: house clothes, never counted) and draws overlays at the anchors in `data/scenes/bigma-fitting.json`; the mirror is a flipped `<use>`. The table and wrist close-up use `data/scenes/bigma-table.json`. No new images.
- **Mechanics** (one file each in `js/dress/mechanics/`): `wear`, `check`, `change`, `count`, `stitch`, `passme`, `say`.
- **Games** (`js/dress/games/`): `layout.js` (G2), `fitting.js` (G1), `table.js` (G3), `bangles.js` (G4). Intro card; live checks at L1 (G1, G2); Done checks with recasts from the first wrong row from L2; change of mind from L2; card hidden after the intro at L3; "?" replays (costs the no-help star); stars as they happen; the result card with the receipt, "They asked / You did" and the words from the round.
- **Speaking moment**: G4 "say how many" on `js/shared/speech.js` (`Speech.listen({choices, timeoutMs})`), closed set *hikdo..panj*. Pills and "a grown-up heard it" are always there; the voice star comes only from a recognised right answer or the grown-up's tick.
- **Lab**: game x level, client, Big Ma helps, the blind-odds readout for the round on screen, the on-screen bot (random / salient / frequent), and Bot x 200.

### Tests

- `node build/leak_dress.mjs`: the numbers above.
- `python3 build/test_dress.py [--viewport all]`: plays every game at L1-3 through real pointer events from `Dress.expect`, with a deliberate wrong piece in one round in three (the ear star must go; the round must still finish), the tap-cover check before every tap, no words drawn in the scene, "a round never ends by itself", the L1 stitch tolerance (28 px). Port 8804.
- `python3 build/test_dress.py --bot 200`: the on-screen bot against the Node numbers (within 2 points).

**Results, 25 Sept:** `--viewport all` passes all 72 rounds (4 games x L1-3 x 6 sizes, a deliberate mistake in every third). `--bot 200`: on screen vs Node at L1, G2 2.0/1.8%, G1 1.5/1.3%, G3 1.0/1.2%, G4 0.5/0.7%. (The first bot run read 0% for three games: the bot looked for things before the scene was drawn and pressed Done on nothing. It now waits for the scene.) Ten level-1 rounds of each game: no repeated look.

## Decisions taken while building

1. **DOM/SVG, not Phaser.** Find it's pattern. Cook's `fetch`, `count` and `passme` are drawn in Cook's Phaser kitchen and can't run in a flat-lay or upper-body scene, so the greybox has small DOM ports with the same rules (`count.js`, `passme.js`; fetch is the tap-to-pile in `layout.js`). They go when the shared mechanics can draw in any renderer.
2. **The house clothes are greyed.** The crops wear painted clothes (Nana's cap, Ma's green dupatta), so the base figure is desaturated: leak rule 1 is visible, and a green dupatta request isn't confused with Ma's own.
3. **The ear star at L2+ is judged at the first Done**; later Dones only let the player finish (after three the round ends anyway, never stuck).
4. **G3 and G4 check at Done at every level** (a count can't be checked live without saying when to stop).
5. **Say how many asks about a colour already on Ma's wrist after the check**, so the child counts what they see and says the number: production from a picture, not an echo.
6. **Heads:** a third head kind, "sun hat", so every slot has at least two kinds for every person (and G5 has a hot-weather need).
7. **Cold forbids the sun hat** (not the T-shirt), so an asked top is never one the weather forbids.
8. The microphone needs the family's recordings of all five numbers as templates; only `num-01..03` exist today, so the moment runs on pills and the grown-up's tick until `num-04`, `num-05` are recorded.

## Next (phase 2)

`iron` and G7 the ironing pile; stitch polish and the neat star from stitch quality; "ask Big Ma" on `say` once F72-F77 are recorded; patterns (dotted, striped) at L3 of G1; `passme` in G1; the on-screen bot's other strategies; then phase 3 (G5 with the curtain and the courtyard strip, the story days) once the shell lands.
