# The redo blocks, the re-tuned check and the skies, 6 Nov 2026

Branch `worktree-agent-aedcaec0dd7a3b9f6` (from `ccr-1f71c98a-wwowh8`). Nothing pushed; nothing wired.

## In plain words

- **The colour check is fairer now, the rule is the same.** One Wada combination per item stays. The tool now treats a thing's
  light and shade as one colour, warm steel and stone as neutral, allows one small accent from the book, judges fruit, veg, food
  and animals by how natural their colours are, and leaves people to the eye. Of the 699 palette fails, 674 now pass; what still
  fails is what looks wrong (the two-colour plasters, the drop machine, the kite, the bright sky blue, a few loud old icons).
- **Shipped pictures that fail: 50 of 1,671 (was 703).** 6 exceptions for you (was 27).
- **Skies have their own rule and their own look.** A short Skies section in the art bible: soft painted skies, gentle
  gradients, big soft clouds, warm light, colours a little muted so they merge. One Wada combination per time of day (sheet:
  `build/reports/art/sky-combinations-2026-11-06.jpg`). The tool checks each sky's colours and a saturation ceiling: today's
  sunny, cloudy and night skies and the sun card all fail it (too vibrant); the rain sky passes.
- **Three blocks, ready to paste, unsupervised, no stops:**

| Block | What it draws | Images | Run time | Your time |
|---|---|---|---|---|
| **Cook** `s17-cook-redo-chrome-block.txt` | chai's two gas flames (calmer blue) with the hob's knobs and tray; the chopped tomato (toned to a real tomato) and the mustard seeds' bowl; the two rolling pins in walnut and chai's empty glass | 3 sheets, 10 items (about 4 images) | about 20 min | paste, about 5 min |
| **Sky** `s17-sky-chrome-block.txt` | the door's sunny, cloudy, rain and night skies; the sun card; new skies in the farm card and the book's farm page (edits: nothing else changes); a bank of 8 (bright day, golden hour, dusk, night; wide and square) | 15 (about 20 with redos) | about 1 h 15 | paste, about 5 min; a look at the door later |
| **Clinic** `s17-clinic-redo-chrome-block.txt` | the plasters (four colours redrawn, round in three sizes, the curved heel plaster), the toothbrush at your angle and its views, the drop machine, the redos (wipes, jug, dropper, bandage, tweezers, thermometer, cup, foot bath), 72 new items for a family children's clinic, and 32 of today's items again so the belt is one batch | 19 prompts, 138 items (about 25 images) | about 2 h | paste, about 5 min |

- **The sky-blue toothbrushes and plaster are done in post:** `recolour.py` pulled 14 pictures to Olympic Blue, written as
  `-v2` beside the old ones (sheet: `build/reports/art/recolour-sky-blue-2026-11-06.jpg`). Not wired.
- **The toothbrush reference:** no free photo from your angle exists on Wikimedia Commons (17 looked at: they lie flat with
  the bristles up, stand in cups or hang in packets). The block attaches a plain diagram of the angle instead
  (`sources/art/clinic-redo/toothbrush-angle.png`) and spells it out in words.

## The re-tuned counts

Full table and method: `build/reports/art-review-strict-2026-11-06.md`, "After Fable's view: re-tuned".

| shipped 1,671 | first pass | re-tuned |
|---|---|---|
| PASS | 847 | 1,466 |
| FLAG | 78 | 149 |
| EXCEPTION | 25 | 6 |
| FAIL | 703 | 50 |

FAIL by rule: palette 30, natural bands 6, sky 4, light 5, baked shadow 7. By block: clinic 24, hue pull 7 (11 with the
exceptions), sky 4, cook 4, day when next touched 6 (kite, rainbow, wall, well, the farm card, the bowl's shadow), none 5 (old
icons). Redo list: `docs/design-language/art-plans/redo-strict-2026-11-06.yaml` and `.csv` (50 rows, each with its block).
Must-pass anchors: the 55 house-look pictures and Fable's steel and glass set all pass.

## The sky combinations

| Time | Wada | Colours | Ceiling (mean / brightest 5% chroma) |
|---|---|---|---|
| Bright day (cloudy and rain in greys) | 194 | Olympic Blue, Seashell Pink (Jasper Red only as the faintest warmth) | 24 / 40 |
| Golden hour, sunset | 209 | Ivory Buff, Yellow Orange, Salvia Blue | 30 / 50 |
| Dusk, nightfall | 339 | Ochraceous Salmon, English Red, Light Glaucous Blue, Violet Blue | 28 / 46 |
| Night | 75 | Pale King's Blue, Violet Blue | 24 / 40 |

Picked from the 348 by distance to sky colours per time (a script, then by eye on the sheet). Day's Olympic Blue is also the
blue the toothbrushes are pulled to, so the game has one blue. Strips: `build/tools/art/data/swatches/wada-194.png`, `-209`,
`-339`, `-75`.

## Exceptions for you

1. `clinic/rough/items/fever-strip` (a purple): the clinic block redraws the fever strip (CB02).
2. `clinic/rough/items/plaster-blue`, `clinic/s11/toothbrush-s11`: pulled to Olympic Blue (`-v2`).
3. `clinic/rough/overlays/face-sad`, `stitches` (sky blue): recolour with the overlays' next run.
4. `day/s09b/book-farm-spread` (its sky): the sky block's SE02 edit.
5. **The drop machine's four drops** (red, yellow, green, blue): no Wada combination has all four; the game needs four colours.
   The block keeps four softened book tones on a house-coloured cabinet.
6. **The gas flame:** a real flame is that blue; the low one now fails by a hair. The Cook block redraws both in a calmer blue.

## Decisions for Zafar

1. **The re-tuned measure** (tones merged, neutrals to chroma 14, one accent, natural bands, people by eye, a sky rule).
   Recommend: yes.
2. **The four sky combinations** (194, 209, 339, 75). Recommend: yes. (The alternative for day is 72, a paler cream and blue.)
3. **Run order:** Cook (20 min), then sky (1 h 15), then clinic (2 h). Recommend: yes.
4. **Clinic part D** (32 of today's items redrawn so the belt is one batch). Recommend: yes, it is last; skip it if time runs out.
5. **The drop machine's four drop colours** as an exception (`palette.allow`). Recommend: yes.
6. **The gas flames redrawn** calmer, not kept. Recommend: yes.
7. **The 14 `-v2` hue pulls** swap in after your look at the sheet. Recommend: yes.
8. **The old vegetable and spice icons** (`assets/items/vegetable`, `spice`: 5 fail natural bands): leave them. Recommend: yes.
9. **The toothbrush diagram** as the reference (no photo found). Recommend: yes; a photo you take on your counter would beat it.

## Implementation plan

1. Merge this branch into `ccr-1f71c98a-wwowh8` and push: the four strips (`build/tools/art/data/swatches/wada-*.png`) and the
   toothbrush diagram must be on the branch before the sky and clinic blocks run (`artblock.py --check` names any missing).
   The Cook block's references are already there.
2. Re-run `python3 build/tools/art/artblock.py --spec build/tools/art/specs/s17-<pack>.run.yaml --check` for each, then hand
   Zafar the three blocks with the times above.
3. On landing: `artjudge.py`, then `artcolour.py` (the sky rule on skies; `--batch items-s17` on the clinic sheets), then
   the cuts (each plan's section 5) and a wiring session after his yes. The sky's wiring sets `data/day.json`
   `weather.<w>.sky.art`; nothing about any game's rules changes.
4. Regression rows to update on merge: ART-45, ART-46 (re-tuned measure), ART-47, ART-53 (walnut in the blocks), ART-56 (sky
   section, rule and block built), CLN-180 (the diagram, TB01), CLN-219 (the block), ART-44 (the shadows redrawn in the clinic
   block; `scene/bowl-back.png` with day).

## Proof

- `node --test build/tools/art/artcheck.test.mjs`: 22 of 22 pass. New: tones merge, warm stone is ground, a small accent passes
  and a big one fails; natural bands, people by eye, the sky rule (a muted sky passes, the generator's blue fails); on the repo,
  the 55 house-look pictures and Fable's five pass and the drop machine and a two-colour plaster still fail.
- Scan: `artcolour.py --batch-by auto --quiet --json` in four jobs over `assets/` (not the ChatGPT folder or the unshipped
  stove cuts), then `artredo.py --rescore` (re-measures the skies from their pixels).
- Each block: validated by `artspec.validate` (0 problems) and built by `artblock.build`; the sky and clinic blocks' new
  references are not on origin yet (step 1).
- `node build/tools/review/checks.mjs`: every line ok (unit 647 pass; docs within every limit; `art` 383 changed pictures, 0 FAIL,
  0 exception). To get there: the stove cuts' produce and dishes joined `palette.natural` (3 had failed the old measure); the
  tablespoon and kalyo pau joined `light.eye_passed` on the stove landing's own eye ("both mild, keep"); the four `-v2`
  toothbrushes carry their originals' known smudge in `artcheck-known.json`; the `-v2` items-v2 toothbrush carries its
  original's eye pass on light.
