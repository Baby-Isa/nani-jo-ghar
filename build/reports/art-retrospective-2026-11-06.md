# Art retrospective, 6 Nov 2026: every asset through the colour and look tool

Overnight task 2 (`docs/process/overnight-brief-2026-11-06.md`). The tool is new (`build/tools/art/artcolour.py`, Zafar's yes of 6 Nov); this is its first pass over everything in `assets/`. A PASS is only that the numbers are fine: no check here sees style, likeness or anatomy.

## Verdict, flaws first

1. **The chai shelf's two batches are the one join a parent sees, and the tool finds it without being told which is which.** As one surface (the named batch `chai-shelf` in `build/tools/art/data/look-rules.json`) the eight pictures split in two on see-through glass (bare jars 0.02-0.07 of their pixels soft, v2 jars 0.18-0.26), canvas (256x384 against 176x256), fill (88-91% against 94%), shape (0.62 against 0.67 wide for the same jar) and lid (four lid families in eight pictures: pale wood, dark wood, black steel, gold, white, plus the bottle's blue cap and the carton's top). Light is the same (upper left on all seven readable ones), so it is a run join, not a lighting fault. Table below.
2. **Little else is wrong.** 2,248 pictures (one per name; `@2x` and second formats left out), 2,124 cut-outs: 2,082 PASS, 164 FLAG, 2 FAIL. Of the 1,603 that ship (not the parked hands, roughs, protos or the old scene folder): 1,505 PASS, 97 FLAG, 1 FAIL.
3. **One shipped baked shadow:** `assets/clinic/sheets/thermometer/thermometer-belt.webp` (named in `data/clinic/sheets.json`) keeps a thin dark strip under the tube (alpha about 0.3). A re-cut, not a redo. The other FAIL, `assets/scene/bowl-back.png`, is the old scene folder (`data/scenes/kitchen.json`).
4. **The one colour outside Sanzo Wada's book is the generator's bright sky blue** (`#60b3f2`, ΔE 10-12 from Olympic Blue): eleven clinic toothbrush and brushing pictures, the ice pack, and the day sky and farm door. Everything else sits within ΔE 10 of a Wada colour (median 4). Half of a typical cook item's colour is in the house family (median share 0.73 on `assets/cook/items`; the word moment 0.96; vegetables 0.22, as vegetables should be).
5. **Light is right almost everywhere.** 15 shipped pictures read from outside the upper-left arc; most are pans and tools seen at an angle where the reading needs an eye: the three pouring pans (from the right), the samosa jharo (lower left), the well (lower right), the drop machine, the steel cup, the reflex hammer, the tweezers, the kite and the onion (upper right). People are not judged for light (their faces are the locked style, s17-fonts-review).
6. **No white halos ship.** The six edge hits at the first threshold were steel rims, a hob's trim, a bubble and a wipe's crimp: real edges.

## The chai shelf (the known finding)

| file | canvas | fill h | w/h | see-through | gloss | light | lid |
|---|---|---|---|---|---|---|---|
| `shelf-cook-paani-bare-f` | 256x384 | 88% | 0.40 | 0.20 | **0.072** | none clear | blue cap |
| `shelf-cook-dudh-bare-f` | 256x384 | 88% | 0.49 | 0.02 | 0.016 | upper left | carton top |
| `shelf-cook-chai-bare-f` | 256x384 | 91% | 0.62 | 0.06 | 0.012 | upper left | pale wood |
| `shelf-cook-khun-bare-f` | 256x384 | 91% | 0.62 | 0.07 | 0.015 | left | pale wood |
| `shelf-elchi-jar-v2-f` | 176x256 | 94% | 0.67 | **0.26** | 0.017 | left | black steel |
| `shelf-aadu-jar-v2-f` | 175x256 | 94% | 0.67 | **0.18** | 0.015 | upper left | dark wood |
| `shelf-lasan-jar-v2-f` | 176x256 | 94% | 0.68 | **0.20** | 0.017 | upper left | gold |
| `shelf-loon-jar-v2-f` | 176x256 | 94% | 0.66 | **0.21** | 0.026 | left | white |

The tool's lines on it (`--batch chai-shelf`): the bare jars and the carton are the "soft alpha" split from the v2 jars and the bottle; the bottle is the gloss odd one out; four lid families. Sheet: `build/reports/art/art-retrospective-2026-11-06-chai-shelf.jpg`. Fix: task 5's one-run redo (one camera, one light, one lid family, size classes), already in the brief.

## Method

- `python3 build/tools/art/artcolour.py --scan assets --json build/screenshots/artcolour/all.json --quiet` (6 min, numpy and Pillow only), then the worst 36 shipped by score (a FAIL 10, a light, halo or off-palette flag 2-3, batch flags 1 each up to 3).
- Per picture: main colours (k-means in CIE Lab on the opaque pixels), each matched to Wada's 159 colours by CIEDE2000 with lightness weighted down (a tint or shade counts as near) and to the house family (combinations 283, 249, 311, 200 and the colours the palette review named); light from the shading inside each material on the outer ring; the near-white share of the outer 2 px against the band behind it; dark soft pixels below the filled piece.
- Batches: each folder (a folder of over 40 split by name family, e.g. `cook/items/shelf*f`), plus the named surface `chai-shelf`. One surface is judged on splits and lids; a folder only on a single odd one out.
- Data: Wada's colours vendored from mattdesl's open transcription, the one the palette review used (`build/tools/art/data/wada-colors.json`, MIT; source and commit in `wada-colors.LICENSE.txt`).

## Counts

| check | all pictures | shipped |
|---|---|---|
| FAIL baked shadow | 2 | 1 |
| light outside the upper-left arc | 65 (50 are the parked hands and roughs) | 15 |
| off-palette (ΔE over 10 from every Wada colour) | 27 | 20 |
| batch: gloss / see-through / specular / edge / light / saturation / lid | 23 / 19 / 14 / 10 / 9 / 7 / 5 | 20 / 17 / 10 / 9 / 7 / 7 / 5 |
| white halo | 0 | 0 |
| PASS / FLAG / FAIL | 2,082 / 164 / 2 | 1,505 / 97 / 1 |

## How I calibrated

Every threshold was set on the real assets, looked at on contact sheets, and its note written into `look-rules.json`:

| pass | flags | what was wrong | change |
|---|---|---|---|
| first rules, `assets/cook/items` only | 279 of 537 flagged | every top-down pan "lit from the lower right": an upper-left light lights a bowl's far inside wall | a round piece (largest inner circle over 84% of its area) reading lower right is the bible's light on a concave inside |
| | | the brightest quadrant flagged a diagonal rolling pin lit from the upper left | the quadrant is reported, not judged |
| first full scan | 506 flag, 3 fail | two clear-glass clinic belts "baked shadow": a faint dark glass wall | a shadow pixel must show on a light ground (alpha x darkness 0.15) |
| | 0 off-palette at ΔE 14 | the book covers 99% of main colours within 9.9 | ΔE 10 |
| second | 565 flag | off-palette was near-black hair and char (the book has no warm near-black); faces "lit from the upper right" were hair and jeans | near-blacks (L* under 20) neutral; people skipped for light |
| | | folder "splits" were one item's states (a pan empty and full) | a folder flags only a single odd one out; splits and lids only on a named surface |
| final | 164 flag, 2 fail | | |

Halos: at 0.3 the six hits were real metal edges; 0.4 keeps the test's halo (100%). The 1-D split needs a gap over a floor and over three times the spread inside the groups.

## The worst outliers

Sheet: `build/reports/art/art-retrospective-2026-11-06-worst.jpg` (the 36 worst shipped; the full-size copy and the whole run's JSON are in `build/screenshots/artcolour/`, not in git).

| # | file | check | read |
|---|---|---|---|
| 1 | `assets/clinic/sheets/thermometer/thermometer-belt.webp` | FAIL baked shadow | true: a dark strip under the tube |
| 2 | `assets/clinic/sheets/toothbrush/toothbrush-use-up.webp` (and 10 more toothbrush, brushing, ice pack) | off-palette sky blue | true colour finding; the object is honest |
| 3 | `assets/cook/items/shelf-*-bare-f.webp`, `shelf-*-jar-v2-f.webp` | chai-shelf split, four lids | true, the known join |
| 4 | `assets/cook/items/chai-v2/pan-pour.webp`, `assets/cook/items-s12/chai-pan/pan-pour-black-s12.webp`, `pan-pour-end-s12.webp` | light from the right | likely true (the pour series); check by eye |
| 5 | `assets/cook/items/v3/samosa/jharo.webp` | light lower left, odd one of its batch | check by eye |
| 6 | `assets/day/s09b/well.webp` | light lower right, odd one of its batch | check by eye |
| 7 | `assets/clinic/heal-v3/drop-machine-v3.webp` | light lower left (strength 17) | likely true |
| 8 | `assets/clinic/items-v2/reflex-hammer.webp`, `toothbrush.webp`, `assets/items/cook/onion-whole.png`, `assets/day/s09b/kite.webp` | light upper right | mild; check by eye |
| 9 | `assets/clinic/sheets/tweezers/tweezers-side.webp`, `assets/clinic/sheets-v3/tweezers/tweezers-side-v3.webp` | glossier and more see-through than the set | true: a side view cut from a different sheet |
| 10 | `assets/cook/items/shelf-fru-01-bare-f.webp` | light from below | probably tool noise (crate slats); check by eye |
| 11 | `assets/scene/bowl-back.png` | FAIL baked shadow | true; old scene folder |
| 12 | `assets/cook/items/chai-station/flame-low.webp`, `flame-ring-low-t.png` | off-palette blue | a gas flame is that blue: leave |

## Redo list

The redo YAML that `artblock.py --redo` reads names line IDs of one pack's run spec; these span many packs and some are re-cuts, so it is a table.

| what | files | why | how | size |
|---|---|---|---|---|
| chai shelf, one run | the 8 shelf pictures (later 9) | two batches on one shelf | task 5's paste block (stove family), `house: {attach: true}` | in task 5 |
| thermometer belt re-cut | `assets/clinic/sheets/thermometer/thermometer-belt.webp` | kept shadow strip | erase soft dark alpha below the tube (artcut or a small script), `artcolour.py` and `artpixels.py` to prove | 15 min |
| toothbrush blue | 11 clinic pictures, `ice-pack-s08b.webp` | generator sky blue, off the book | Zafar's call (decision 1): leave, or a hue pull towards Wada's Olympic Blue in post | 30 min if yes |
| pouring pans | 3 pour pictures | lit from the right | watch list; redo with the stove run only if the eye agrees | none now |
| eye checks | jharo, well, drop machine, steel cup, hammer, tweezers, kite, onion, bananas | light readings | one look on the worst sheet; anything true joins its game's next run | 10 min |
| bowl-back | `assets/scene/bowl-back.png` | baked shadow | retire with the old scene, or ignore | none |

## Fable's view

Looked at 14 flagged and 14 passing cut-outs on grey at 400 px, bottoms at 3x on white; the tool re-run on four folders and single files with `-v`.

**Flaws, evidence first.**

1. **The one FAIL rule misses an opaque baked shadow.** `assets/cook/items/chai-v2/pan-pour.webp` carries a near-solid dark crescent under the pan (plain at 3x on white); the tool reports `shadow soft 0, skirt 0`, because the check only sees soft alpha or a skirt wider than the body. `clinic/items-v2/honey-jar.webp` (PASS) has a faint soft shadow too (69 px, under the 0.25 share). Add a third test: dark, neutral, opaque pixels in the bottom band darker than the body's lowest material. Until then "no baked shadows ship" is unproven.
2. **"Shipped" is by folder, not by reference.** `chai-v2/pan-pour.webp`, `pan-pour-black-s12.webp` and `items/cook/onion-whole.png` are named in no `data/*.json`; count from `asset-list.json` and the data files.
3. **Light flags are noise on multi-material pieces,** the albedo confound the real-people report found: the bananas crate "from below", the well "lower right" (my eye: upper right), the kite, jharo, steel cup and hammer all read fine. Four segments cannot separate six materials.
4. **What my eye sees that no number does: camera height.** `chai-v2/pan-pour` is 45° above, `pan-empty-s14` straight down, the karahi 60°, the well 30°; the shelf's two batches differ in camera as much as in gloss. Cheap proxy: rim-ellipse height over width on round items, as a batch feature.
5. **Off-palette at ΔE 10 against 159 colours is toothless by construction** (99% within 9.9: the book covers the wheel), so calibration left only the generator's sky blue. What marks the stock pictures (the well's foliage, the drop machine's RGBY tubes, the kite, the onion as a smooth maroon ball with no skin) is high chroma with a low house share: reported, never judged. Make house share a surface-level FLAG (say under 0.4 on cook).
6. **Colour semantics:** `pan-pour-black-s12`'s "black tea" is a red-orange syrup matched "Red Orange, in the house". In palette and wrong; only a model's look catches that; say so beside "the object is honest".

**Redo list.** Order right: the shelf first. Add Gemini's fix 2, a `cm` height per shelf item in `data/cook.json` (half an hour, fixes bottle = jar before the run lands). Cut the eye-check row to the well and the drop machine; the rest I looked at and they pass.

**Decisions.** 1 yes (leave the blue). 2 yes, once the opaque-shadow test exists. 3 and 4 yes. 5 amend: not repo-wide, but `--changed` (the pictures in `git diff`, 0.16 s each) in `checks.mjs` at every push, so no pack lands unmeasured.

**Verdict:** a sound ruler for the shelf join, its one real finding, but its only FAIL misses an opaque shadow and it cannot see camera, chroma or contents, so a PASS is "numbers fine", never "looks right": ship the shelf redo, fix the shadow test and the shipped filter before the next pack.

## Decisions for Zafar

1. **The clinic's sky-blue toothbrushes:** leave them (a child's toothbrush is that blue) and hold new art to the house look. Recommend: leave.
2. **Light, off-palette and batch lines stay FLAGs, never FAILs;** only a baked shadow FAILs. Recommend: yes.
3. **The size classes** (L 100%, M 90%, S 80% of the slot height, ±5%) are a draft in `look-rules.json`; task 5's report sets the final rule. Recommend: adopt task 5's numbers there, no change here.
4. **The swatch strip in prompts** is opt-in per pack (`house: {attach: true}`); every block already names the house colours and the edge line for the judge. Recommend: switch it on for the stove run, check its first sheet for a painted strip.
5. **Not in `checks.mjs` repo-wide:** six minutes is too slow for every push; it runs in the judge, at art runs and as a retrospective. Recommend: yes.

## Implementation plan

Built tonight (on the branch): `build/tools/art/artcolour.py`, `build/tools/art/data/` (`wada-colors.json` and its licence, `look-rules.json`, `house-swatch.png`), `artjudge.py` (`look:` lines, `--batch`, `--no-look`), `artblock.py` and `templates/block.txt` (HOUSE LOOK section; the swatch and one prompt sentence on opt-in), tests in `artcheck.test.mjs`, rows in `art-pipeline.md` section 15 and `docs/tools.md`. On his yes to the redo list:

1. Re-cut `thermometer-belt.webp` (small script beside `artcut.py`): files `assets/clinic/sheets/thermometer/`. Check: `artcolour.py` PASS, `artpixels.py` PASS, the heal game's thermometer shot. Size 15 min, risk low.
2. If decision 1 is "recolour": a hue pull on the 12 blue pictures (Pillow, Lab), before and after sheet. Size 30 min, risk low (one hue).
3. Task 5's stove run: spec with `house: {attach: true}`, its items named in `look-rules.json` `sizes.items` and a named batch per shelf. Check: `artjudge.py --batch <shelf>` on what lands. Size: inside task 5.
4. Any pack after: add its surfaces to `batches` and run `artcolour.py` on the landed folder before the judge. Size: minutes per pack.

## Proof

- `python3 build/tools/art/artcolour.py --scan assets --json build/screenshots/artcolour/all.json --quiet`: "2248 picture(s): 2082 pass, 164 flag, 2 fail; 201 batch(es), 59 with an odd one out".
- `node --test build/tools/art/artcheck.test.mjs`: 8 of 8 pass, the three new ones red-then-green on synthetic jars (a halo, a baked shadow, light from the lower right, magenta off-palette, a size class, one glossy jar in a matte batch; a clean jar passes) and CIEDE2000 against Sharma's test pair (2.0425).
- Paste blocks: all 27 run specs (and 4 redo lists) built before and after the change: 108 lines added (4 per block), 0 removed or changed; no committed block regenerated. `artblock.py --check` unchanged where it passed before (the others fail only on references not fetched locally, as before).
- `artjudge.py --spec build/tools/art/specs/s17-art3.run.yaml --batch art3`: the `look:` lines print beside the judge's own; 38 images, 20 pass, 15 flag, 3 fail (the 3 FAILs are the judge's own: text-like marks and piece counts; no look: line is a FAIL there).
- Sheets looked at: the chai shelf, the pans' light, the glass shadows, the halos, the shipped light flags, the worst 36.
- Not done: no eye check of each light reading at full size; the chai shelf's real-size heights wait for task 5.
