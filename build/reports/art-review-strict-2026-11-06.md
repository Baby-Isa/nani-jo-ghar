# Art review under the stricter rules, 6 Nov 2026

Zafar's rules of 6 Nov, built into `build/tools/art/artcolour.py` and run over every shipped picture (shipped by reference: 1,653 of the 2,248 in `assets/`; the raw `assets/ChatGPT 261106 1/` sheets left out).

## In plain words

- **Most of what fails, fails on colour combinations.** 699 of 1,653 shipped pictures have main colours from more than one Wada combination. Nearly all of them can be fixed by **recolouring** in a run (668); 33 need a **redraw** (wrong light, or most of their colour off any one combination); 2 need a **re-cut** (a baked shadow).
- **People are 262 of those 699** (faces, hands, patients, the old storybook characters): skin plus clothes rarely sit in one combination. Decision 2 asks whether people are judged this way at all.
- **Light now fails 5 pictures** (the well, the drop machine, a toothbrush in use, a tweezers pose, the white bandage); 6 more that read wrongly to the tool were passed by Fable's eye on 6 Nov and are kept off the list.
- **27 exceptions for Zafar,** almost all one colour: the generator's bright sky blue (toothbrushes, plasters, the sky, the farm door, the water bottle's cap). The book has no colour that close.
- **48 batches need an eye** on their contact sheets; the chai shelf is the one I can tell at a glance.
- **The white marble, the stone shelf and tile, and `--njg-panel` all conform** (below).

## Counts (shipped pictures)

| result | pictures |
|---|---|
| PASS | 847 |
| FLAG only | 78 |
| EXCEPTION (Zafar decides) | 25 (27 with those that also FAIL) |
| FAIL | 703 |

| FAIL by rule | pictures |
|---|---|
| palette: no one combination holds the main colours | 699 (people 262) |
| light from outside the upper left | 5 |
| baked shadow | 7 |

| FLAG (no block) | pictures |
|---|---|
| batch odd one out (48 batches) | 79 |
| faint or short shadow | 72 |
| light oak or pine wood | 14 |
| house look (rainbow) | 3 |

| area | shipped | PASS | FAIL | exception | redo: recolour / redraw / re-cut |
|---|---|---|---|---|---|
| Cook items | 462 | 239 | 176 | 3 | 166 / 10 / 0 |
| Cook backgrounds | 22 | 17 | 5 | 0 | 5 / 0 / 0 |
| Clinic | 700 | 342 | 310 (people 141) | 20 | 286 / 22 / 2 |
| Shared (faces, word moment, shell, UI) | 33 | 19 | 14 (people 3) | 0 | 14 / 0 / 0 |
| Other modes (day, farm, characters, hands, scenes) | 436 | 230 | 198 (people 118) | 4 | 197 / 1 / 0 |

## The rules as built

| rule | how it is measured | tuned to |
|---|---|---|
| (a) one palette | main colours (k-means in CIE Lab) with chroma 8 or more and L* 20 or more, each at least 10% of the tinted pixels; PASS when one of Wada's 348 combinations has a colour within ΔE 9 (CIEDE2000, lightness weighted down) of every one | 9 anchors below |
| (a) exception | a main colour over ΔE 10 from every Wada colour; on the block until `palette.allow` holds Zafar's word | as the retrospective's off-palette (the sky blue) |
| (b) light, palette | light outside the upper-left arc and the palette rule are FAILs; people still skipped for light; `light.eye_passed` holds an eye's pass | |
| (c) batch | still a FLAG; `--batch-sheets DIR` writes a sheet per flagged batch, odd ones ringed | |
| (d) wood | FLAG a light oak or pine (hue 55-90°, L* 52-84, chroma 16-48) on a lid (jars, tins, the chai shelf) or on an item named as wood; not on hands | 14 shipped |
| (e) sizes | classes L 1.0, M 0.9, S 0.81, tolerance 0.04 (no overlap); floor 40 CSS px at 740x320; `--slot-css H` checks a slot | |
| (f) strip | a spec's `house: {attach: true, combination: N}` names that combination in the block and attaches `build/tools/art/data/swatches/wada-N.png` (made when missing; push it before the run) | |

**Tuning.** Neutral cutoff 6 or 8, main share 8, 10 or 12%, ΔE 8, 9 or 10, on two anchor sets: 55 pictures in the house look (the chai word moment, the s17 marble and stone) that should pass, 5 stock-looking ones that should fail (drop machine, kite, well, hen, a sky-blue toothbrush).

| setting | house-look anchors failing | stock anchors failing | shipped failing |
|---|---|---|---|
| neutral 6, 8%, ΔE 8 | 23 of 55 | 5 of 5 | 1,125 |
| neutral 8, 10%, ΔE 9 (chosen) | 4 of 55 (`card-half-chai`, `glass-side-2`, both tilted kettles) | 4 of 5 (the toothbrush as an exception; the hen passes) | 699 |
| neutral 8, 10%, ΔE 10 | 2 of 55 (the tilted kettles) | 3 of 5 (the drop machine passes) | 427 |

ΔE 9 is about two steps between neighbouring colours in the book (the median gap is 4.4); at 10 a colour matches about seven Wada colours and the drop machine's RGBY tubes pass. At neutral 6 the stone shelf fails on its own warm grey.

## The worst by area

Sheet: `build/reports/art/art-review-strict-2026-11-06-worst.jpg` (the six worst shipped per area).

| area | worst | why |
|---|---|---|
| Cook items | the chai shelf's bare jars and the elchi jar | palette (the tea leaves, the lid's light wood, the milk carton's blue top), plus the shelf's batch split |
| | `chai-station/glass.webp`, `jar/jar-slot-0..4.webp`, `icon-spi-01.webp` | palette: a cream or gold beside a stone; light wood lids |
| Cook backgrounds | `bg/stove.jpg`, `bg/pantry.jpg`, `bg/service-v2.webp`, `bg/bg-cook-hob-t-v1-1600.webp`, `worktop-s08c/hob-plate-s08c.webp` | palette: one warm grey-brown stone or shadow (chroma 10-14) that sits in no combination with the rest; the s17 marble passes |
| Clinic | the drop machine (light, rainbow, palette); the toothbrush sheet (baked shadows, sky blue, light); `tweezers-splinter.webp` (light); the thermometer belt and the rough chai cup (baked shadows) | |
| Shared | `faces/nani.webp`, `doctor.webp`, `nana.webp` (people: skin and clothes); the shell's doors; `word-moment/card-half-chai-s17.webp`, `kettle-tilted-s17.webp` | palette |
| Other modes | the well (light); `scene/bowl-back.png` (baked shadow); Nani's hands (her red bangle); the s09r bush and tree; the aeroplane; the kite | palette |

## Exceptions for Zafar (27)

Every one is a colour the book does not have (nearest Wada colour over ΔE 10). Keep one and it goes on `palette.allow` in `look-rules.json` with his words and the date.

| picture | the colour (share of its colour) | nearest Wada |
|---|---|---|
| `clinic/items-s08b/ice-pack-s08b.webp` | #26a9eb blue (20%) | Olympic Blue, 12 |
| `clinic/items-s08b/toothbrush-s08b.webp` | #5eb6f7 blue (32%) | Olympic Blue, 11 |
| `clinic/s11/toothbrush-s11.webp` | #40a9ea blue (40%) | Olympic Blue, 11 |
| `clinic/sheets/toothbrush/toothbrush-paste`, `-tray`, `-use`, `-use-up` (4) | #53adef to #71bbf4 blue (55-60%) | Olympic Blue, 10-11 |
| `clinic/sheets/brushing/brushing-down`, `-level`, `-level-paste`, `-up`, `-up-paste` (5) | #5ab0f1 to #69b9f6 blue (33-64%) | Olympic Blue, 10-11 |
| `clinic/rough/items/bandage-blue`, `drops-blue`, `plaster-blue` (3) | #24bbf2 to #3ba7db blue (16-90%) | Antwarp or Cerulian Blue, 11-12 |
| `clinic/rough/items/fever-strip.webp` | #6361fa purple (10%) | Blue Violet, 12 |
| `clinic/rough/overlays/face-sad`, `stitches`, `sweat` (3) | #56b4e2 to #58b1eb blue (17-42%) | Olympic or Pale King's Blue, 10-11 |
| `clinic/sheets/plaster-flat/plaster-flat-green.webp` | #188f20 green (11%) | Cossack Green, 10 |
| `cook/items/chai-station/flame-low.webp` | #0c5ff7 gas-flame blue (13%) | Olympic Blue, 10 |
| `cook/items/shelf-cook-paani-bare-f.webp` | #54adec bottle-cap blue (41%) | Olympic Blue, 10 |
| `cook/items/tool-chips-basket-t.png` | #65584e charcoal brown (36%) | Pale Raw Umber, 11 |
| `day/s09b/sky-sunny.webp`, `book-farm-spread.webp`, `day/s12/door-farm.webp`, `door-sun.webp` (4) | #64b9fd to #72bffd sky blue (17-25%) | Olympic Blue, 11 |

## Batches for an eye (48)

A batch is a problem only if you can tell (Zafar). One sheet per area, a row per batch, every picture at the same height, the odd ones ringed: `build/reports/art/art-review-strict-2026-11-06-batches-cook-items.jpg` (21), `-clinic.jpg` (18), `-shared.jpg` (2), `-other-modes.jpg` (7). The full list with features and odd ones is `batches_to_eye` in the redo YAML.

My read, for the judge to confirm: **the chai shelf, yes** (glass, camera, four lids: the known join); `cook/items/chai-v2` (the pouring pan) and `v3/samosa` (the jharo among heaps) are different objects, not batches; the clinic's `sheets/tweezers` and `sheets-v3/tweezers` side views come from another sheet (the retrospective said so too); the rest are one item's states in a folder.

## The marble, the stone and the panel

| what | colour | verdict |
|---|---|---|
| white marble `assets/cook/worktop-s17/marble-white-s17.webp` | #edecef, chroma 1.4 | **conforms**: a neutral, the ground; no yellow stain |
| stone tile `assets/shared/panel/stone-tile-s17.webp` | #dfd5cd, chroma 5.9 | **conforms**: a neutral |
| stone shelf `assets/shared/panel/stone-shelf-s17.webp` | #e8ded5 and #d3c6b9 (chroma 7.3 overall) | **conforms**: its lighter grey is neutral, the darker is a tint of Ecru (ΔE 6, a house colour). At a cutoff of 6 it would fail (White and Ecru share no combination) |
| `--njg-panel` `#efe5d6` | chroma 8.6, just over the cutoff | **conforms**: a tint of White (ΔE 7.7) and of Ecru (ΔE 8.5), both within 9; with Ecru it sits in the house's combination 249 |

## Redo list

`docs/design-language/art-plans/redo-strict-2026-11-06.yaml` (and `.csv`, one row a picture): by area, each picture with the rules it breaks, the fix (recolour, redraw, re-cut), the nearest combination and its colours (the strip to attach), the colours off it, the light or shadow reading, and whether it is a person. Then the exceptions, the wood flags and the batches to eye.

| area | recolour | redraw | re-cut | of them people |
|---|---|---|---|---|
| Cook items | 166 | 10 | 0 | 0 |
| Cook backgrounds | 5 | 0 | 0 | 0 |
| Clinic | 286 | 22 | 2 | 141 |
| Shared | 14 | 0 | 0 | 3 |
| Other modes | 197 | 1 | 0 | 118 |
| **all** | **668** | **33** | **2** | **262** |

The nearest combinations most named: 121 (Brown, Ochraceous Salmon, Lincoln Green; 58), 328 (49), 296 (38), 327 (30), 186 (29), 222 (25), 249 (23, a house one).

## Decisions for Zafar

1. **The thresholds:** neutral below chroma 8, a main colour at 10% of the colour, near at ΔE 9. Recommend: yes (stricter fails the house-look word moment; looser lets the drop machine through).
2. **People:** 262 of the 699 are faces, hands and patients, whose skin and hair are locked. Recommend: judge people by eye, like light (skip them in the palette rule), and recolour only their clothes on their next sheet run. Or: keep them in, and the redo list grows by their sheets.
3. **The exceptions:** recommend keep the gas flame (a flame is that blue); recolour the sky blue towards Olympic Blue in post on the toothbrushes, plasters, brushing, sky and doors (a hue pull, one script); keep the chips basket's charcoal brown (a near-neutral). Answer per row is fine.
4. **Redo order:** the chai shelf first (already in the stove run, with combination strips), then the Cook items in their next runs, then the clinic sheets; backgrounds and other modes when each is next touched. Recommend: yes.
5. **The six light readings Fable passed by eye** stay passed (`light.eye_passed`); new ones need an eye's name and date. Recommend: yes.
6. **Wood:** a FLAG for new art; the 14 shipped (the shelf jars' pale lids, the jar slots, the velan, the old rolling pin) go with their area's next run. Recommend: yes.
7. **The 40 px floor:** the game's slot heights at 740x320 are not checked yet (a slot needs 50 CSS px). Recommend: a sandbox measure in the stove sprint.

## Implementation plan

Built on this branch: `artcolour.py` (`palette_fit`, the EXCEPTION level and exit 1, `palette.allow`, light FAIL with `light.eye_passed`, `wood`, `--batch-sheets`, `--swatch --combination`, `--combination`, `--slot-css`), `artblock.py` (`house: {combination: N}`), `artjudge.py` (exceptions block), `look-rules.json` (`palette`, `wood`, `sizes`, `light.eye_passed`, the block's colours line), the art bible (section 2's palette, walnut, marble and light rules; section 4 now size classes, the true-size table gone), `art-pipeline.md` section 15 and `docs/tools.md`. On Zafar's answers:

1. Decision 2 yes: add the people globs to a `palette.skip` (5 min) and re-run the review (20 min, four jobs in parallel).
2. Decision 3: the allowed exceptions into `palette.allow`; the sky-blue hue pull (a script beside `artcut.py`, before and after sheet), 30 min.
3. Each redo run: its spec takes `house: {attach: true, combination: N}` from the YAML's `combination`; `artjudge.py` and `artcolour.py --changed` judge what lands.
4. Re-cut the two clinic shadows with the retrospective's row (30 min).

## Proof

- Scan: `artcolour.py --batch-by auto --quiet --json` in four jobs (cook/items, the rest of cook, clinic, everything else) over `assets/` without the ChatGPT folder: 2,248 pictures, 22 min; the review recomputed the palette and wood verdicts with the final thresholds on the stored colours.
- `node --test build/tools/art/artcheck.test.mjs`: 19 of 19 pass. New: one combination passes, two FAIL, the marble is ground, magenta is an EXCEPTION until allowed; a light-oak board FLAGs and a walnut one does not; the size classes, the floor, and the bible (no `size_cm`); a batch sheet is written; a block takes combination 151's strip. Changed: light is a FAIL (and the jharo, eye-passed, is not; the well is), off-book colour an EXCEPTION; the shadow tests ask only about shadows.
- `node build/tools/review/checks.mjs`: see the commit; the `art` line reads "no picture changed".
- Sheets looked at: the worst (30) and the Cook items' batch sheet.
- Not done: no eye on each of the 699 palette FAILs; the 48 batches wait for the judge.
