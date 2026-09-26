# Monsoon rush: build log

**25 Sept 2026.** Phases 0 and 1 of the build brief (docs/modes/monsoon-rush-design.md, section 12), plus G3 from phase 2. Branch `claude/build-monsoon`.

## Where things are

| What | File |
|---|---|
| The clock (audio clock; a virtual clock for tests) | `js/monsoon/clock.js` (Node and browser) |
| Storm generator, timing, grader, retries, stars, the Busy stage rule, constraint checks | `js/monsoon/calls.js` (Node and browser) |
| The leak bots and a headless storm player | `js/monsoon/bots.js` (Node and browser: the lab and the Node harness run the same bots) |
| Loading, word progress (`js/progress.js`), voice (Cook's `Lang`), the storm runner, test hooks | `js/monsoon/core.js` |
| Scene host (greybox HTML world), sounds, sidebar and cards, the Rush lab | `js/monsoon/stage.js`, `fx.js`, `ui.js`, `lab.js` |
| Mechanics | `js/monsoon/mechanics/cover.js` (G1), `count.js` (G2), `callit.js` (G3) |
| Stubs for shared pieces | `js/monsoon/stubs/say.js`, `js/monsoon/stubs/speech-lab.js` |
| Data | `data/monsoon.json`; sidecars `data/monsoon-audio.json`, `data/scenes/kitchen-monsoon.json` |
| Tests | `build/leak_monsoon.mjs` (Node), `build/test_monsoon.py` (Playwright, port 8805) |

## Decisions I took (nobody to ask; defaults where the docs had one)

1. **Sidecar path.** The brief (D.7, section 12) names `data/scenes/kitchen-monsoon.json`; I used that path, not `data/kitchen-monsoon.json`.
2. **G1 candidates are two whole look-alike groups** (kitchen: paani, dudh, chai, atto, daal; sugar: khun, loon, dai): 8 pots. With the kitchen group alone, a Sceptic who knows *chai* and *daal* are never called guesses 1 in 3 and wins about 1.8% of storms. With both groups it's 1 in 6.
3. **Menu words are never called at all.** They stay on the island as look-alikes. A called but untested word would only add noise.
4. **Sequence ("Ne poi") means the order counts**: the first answer goes to the first-named pot. Otherwise the linker decides nothing.
5. **Switch** is said as "{x}! Nar {x}. {y}!" from existing frames (`no` is Zafar's draft). Lidding the lure blames `ph-no` as well as the noun.
6. **G2 drops never wait, even in Drizzle** (they fall slower: `drizzleDropSec` 1.6). Counting what falls is the game. A near miss (±1) still counts as "kept dry".
7. **G3 in Busy**: on a null Ali shrugs and the drop keeps its beat. The pills show anyway and can still save it before the reveal. The parent's tick appears only after a null.
8. **Cook's `count` and `passme` are not loaded.** Both are bound to Cook's Phaser zone host. Monsoon's `count.js` keeps count's rules (tally shown and never the target; never ends by itself; Done is the lid). `passme` between Drizzle waves is left for the next phase.
9. **Pot contents are told apart by texture** (milk glossy, yoghurt swirled, sugar coarse, salt sparkling). None is the odd one out, but a child who knows the word can find it.
10. **A wave ends at its end time.** A tap planned after it never happens, in both Node and the browser.
11. **The within-storm `learner` bot** remembers clip → place from the reveals. With 4 spots and 8 waves (G6 level 1) it earns 3–4.4%. A phrase always meaning its place is the word itself, so section 8.5 says to report this, not fail it. I report it, and 10% still fails.

## Numbers

`node build/leak_monsoon.mjs` (32/32 unit cases; 1,000 storms per game and level for the constraints and χ²; 500 storms per bot, Busy, all words at stage 3 so every call is tested):

- Constraint failures: 0 in every game and level. Targets, slots and next-slot jumps are uniform (χ² p 0.06–1.0). G4 level 1 is state-led by design.
- **Every bot is under 2% on G1, G2, G3, G4 and G6 at levels 1–3.** Almost all are at 0.00%; the highest is G3 L1 `menu` at 0.20%. The one exception is `learner` on G6 L1 (3.0%; 4.4% with mixed word stages), reported per decision 11.
- The same holds for Drizzle, and for the `mixed` word profile.
- **The english bot:** the recogniser (`js/shared/speech.js` in Node) on 34 English clips against the 7 kitchen words gave null on **34/34**. The Kutchi clips named themselves 7/7.

`python3 build/test_monsoon.py` (port 8805):

- **Play**: every star in G1–G3 at L1–3 in Drizzle and Busy (laptop), and each game at L3 Busy on the flip5, 1440×900, 1280×800, iPad, iPad portrait and a 812×375 phone. There's a tap-cover check before every tap, and no console errors.
- **Bots**: the browser bots (real clicks at the bot's times, on the virtual clock) match the Node player outcome-for-outcome on 36/36 storms (12 bots, G1 and G2 at L1).
- **Speech paths**: heard, wrong, null, timeout and english each work in both tempos; after a null the pills and the parent's tick appear and finish the call.
- **Bugs the screenshots caught and I fixed**: the call pill squeezed on a 375 px phone; a stale "Arre re!" flash from the previous storm; milk and yoghurt looked the same.
