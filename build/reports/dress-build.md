# Dress up: build report (phases 0 and 1)

**Branch** `claude/build-dress` · 25 Sept 2026 · details in `docs/dress-build-log.md`.

## What's built, and where
- **Phase 0 (pure logic, runs in Node):** `data/dress.json` (every clothes, colour, part, tool and weather word is a placeholder; the numbers, *vadho/nindho*, *nar* and Cook's frames are referenced by id from `data/cook.json`); `js/dress/look.js` (the generator for G1–G5 and K5, with the blind-odds budget); `rack.js`; `grade.js`; `build/leak_dress.mjs`.
- **Phase 1 (greybox lab):** `dress.html`, `css/dress.css`, `js/dress/{core,doll,flow,bot}.js`, one mechanic per file in `js/dress/mechanics/` (wear, check, change, count, stitch, passme, say), and the four first-set games in `js/dress/games/`: **G2 Lay it out** (flat-lay, piles per person), **G1 The fitting** (greyed upper-body crops with overlays at anchors, and a mirror), **G3 Big Ma's mending** (tin, motif tray, parts, pass me, stitch), **G4 Bangles** with **"say how many"** on `js/shared/speech.js`, plus number pills and a grown-up's tick as the fallback. Scene anchors: `data/scenes/bigma-{fitting,table}.json`. No new images.

## How to open it
`dress.html` (the Dress lab is the title page): game × level 1–3, client, "Big Ma helps", the round's blind odds, the on-screen bot, Bot × 200. `dress.html?game=bangles&level=1&seed=5` opens one round directly.

## Leak-bot numbers (Node, 2,000 rounds per game per level)
Worst blind strategy, L1 / L2 / L3: G2 3.1 / 0.1 / 0.0% · G1 3.1 / 0.6 / 0.5% · G3 1.3 / 0.1 / 0.3% · G4 1.2 / 0.1 / 0.1% · G5 (logic only) 3.1 / 3.0 / 3.1%. All under 10%, and every generated round is within the 5% budget. Real-Kutchi slice, reported on its own: G3 L1 16% (count × size), G4 L1 6% (counts).
ON-SCREEN-BOT

## Tests
`python3 build/test_dress.py --viewport all` (port 8804): every game at L1–3 at the six sizes, real pointer events, a deliberate mistake in one round in three, the tap-cover check, no words in the scene, no round ends by itself. SIX-RESULT

## Stubs to swap for shared pieces
- `js/dress/stubs/pick.js` → the shared which-one module (one `<script>` line in `dress.html`, one `require` in `build/leak_dress.mjs`).
- `js/dress/mechanics/say.js` → the shared `say` (it already calls `Speech.listen`).
- The code-drawn overlays in `doll.js` → the overlay-at-anchor sprites; `star_sets` in `data/dress.json` → the shared star rules; the save goes through Cook's (`Cook.save.dress`) until the shell's profile exists.

## Left for phase 2
`iron` and G7; stitch polish; "ask Big Ma" once F72–F77 are recorded; patterns at G1 L3; pass me in G1; more strategies for the on-screen bot. Then phase 3: G5 with the curtain and the courtyard strip, and the story days.

## Decisions I had to take
DOM/SVG instead of Phaser (Find it's pattern, so Cook's Phaser-drawn fetch, count and pass me have small DOM ports with the same rules); the house clothes are greyed; from L2 the ear star is judged at the first Done; G3 and G4 check at Done at every level; "say how many" asks about bangles already on the wrist; a "sun hat" as a third head kind; the microphone needs `num-04` and `num-05` recorded (only 01–03 exist), so until then the moment runs on the pills and the grown-up's tick.
