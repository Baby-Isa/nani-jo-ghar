# Dress up: build report (phases 0 and 1)

Branch `claude/build-dress`, 25 Sept 2026. Details: `docs/dress-build-log.md`.

## Built
- **Phase 0 (Node-runnable):** `data/dress.json` (all clothes, colour, part, tool and weather words are placeholders; numbers, *vadho/nindho*, *nar* and Cook's frames referenced by id from `data/cook.json`), `js/dress/look.js` (generator for G1–G5 and K5 with the 5% blind-odds budget), `rack.js`, `grade.js`, `build/leak_dress.mjs`.
- **Phase 1 (greybox):** `dress.html`, `css/dress.css`, `js/dress/{core,doll,flow,bot}.js`, mechanics one per file (wear, check, change, count, stitch, passme, say), games **G2 Lay it out**, **G1 The fitting** (greyed existing crops, code overlays at anchors, mirror), **G3 Big Ma's mending** (tin, motifs, parts, pass me, stitch), **G4 Bangles** with **"say how many"** on `js/shared/speech.js` (pills and a grown-up's tick as fallback). No new images.

## Open it
`dress.html`: the Dress lab (game × level, client, Big Ma helps, blind-odds readout, on-screen bot, Bot × 200). `dress.html?game=bangles&level=1&seed=5` opens one round.

## Numbers
- Node, 2,000 rounds, worst blind strategy L1/L2/L3: G2 3.1/0.1/0.0% · G1 3.1/0.6/0.5% · G3 1.3/0.1/0.3% · G4 1.2/0.1/0.1% · G5 (logic only) 3.1/3.0/3.1%. Real-Kutchi slice, separate: G3 L1 16%, G4 L1 6%.
- On-screen bot vs Node (random, L1, 200 rounds): within 0.2 points for all four.
- `python3 build/test_dress.py --viewport all`: 72/72 rounds pass (6 sizes × 4 games × 3 levels, a mistake every third round, tap-cover check, no words in the scene, nothing ends by itself). No human playtest yet.

## Stubs to swap
`js/dress/stubs/pick.js` → shared which-one (one line each in `dress.html` and the leak bot); `mechanics/say.js` → shared `say`; code overlays in `doll.js` → overlay-at-anchor sprites; `star_sets` in `data/dress.json` → shared star rules; `Cook.save.dress` → the shell's profile.

## Next (phase 2)
`iron` and G7, stitch polish, "ask Big Ma" (needs F72–F77 recorded), patterns at G1 L3, pass me in G1, more on-screen bot strategies. Then G5 and the story days (phase 3).

## Decisions taken
DOM/SVG, not Phaser (Find it's pattern; Cook's Phaser fetch/count/passme have small DOM ports); house clothes greyed (leak rule 1); from L2 the ear star is judged at the first Done; G3/G4 check at Done at every level; "say how many" asks about bangles already on the wrist; "sun hat" added as a third head kind. The microphone needs `num-04`/`num-05` recordings (only 01–03 exist), so the moment runs on pills and the grown-up's tick for now.
