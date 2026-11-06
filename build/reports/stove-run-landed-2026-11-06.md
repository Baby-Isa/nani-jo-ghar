# The stove run landed: 42 sheets judged, cut and placed (6 Nov)

Zafar's art run of the stove pack landed as 42 raw sheets under ChatGPT's own names in `assets/ChatGPT 261106 1/`. This step
matched each sheet to its run line, cut every item, judged the cuts (by numbers and by eye) and wrote the redo list. Nothing is
wired into the game.

**In plain words.** Every sheet arrived: 42 of 42 lines, no duplicates, nothing I couldn't place. All 346 items are cut into
`assets/cook/items-s17-stove/` (11 MB of small webp). **337 are usable now. 9 need a redo** for a wrong look (two closed tins that
hide their flour and powder, two cakes and a dabeli seen from the side, a squeeze bottle side-on, cassava chips drawn as crisps, and two
see-through things that took the magenta ground's pink). **None are missing.** The catch is the lids: **every jar landed with
the pale oak lid the run asked for, not walnut.** 68 items carry that lid. They are fine as one batch, so they can be used as
they are, or redone in walnut if Zafar wants walnut on the jars too (decision 1).

**FA01 (chai's shelf) passes as an anchor**: one batch, one camera, light from the upper left, one lid family, no labels. It can
replace chai's eight shelf files now **if Zafar keeps pale oak**; for walnut it needs one redo first (one image), and then the nine
jar sheets after it.

## Flaws first

1. **Pale oak, not walnut, on every jar (68 items).** The run asked for pale oak (the plan and run spec, written before Zafar's
   walnut word on 6 Nov). The lids are one family: the median lid colour per sheet is `#e7aa6b` to `#f8b271` (honey-coloured
   light wood), the spread inside a sheet at most ΔE 3.1, and every sheet ΔE 43-47 from a mid walnut (`#5d432c`). Other wood that
   landed light, not walnut: the rose water cap (FP02), the daar churner (TK02), the pastry brush and maani turner handles (TK03),
   the rubber spatula handle and spice grinder (TK05), the melted-butter brush (TB05).
2. **Two tins hide their contents**: `f-chapati-flour-atta` (FJ04, shut with a string band) and `f-baking-powder` (FJ08, shut).
   No flour or powder shows, so the picture can't say what it is. The other open tins are fine.
3. **Wrong view**: the two birthday cakes (`t-dish-chocolate-birthday-cake`, `t-dish-strawberry-cream-cake`, TD03) are
   three-quarter with their sides and stands; the dabeli (`t-dish-dabeli`, TD06) is a bun seen from the side; the chutney
   squeeze bottle (`t-squeeze-bottle-chutney`, TK02) is side-on on a top-down sheet.
4. **Wrong item**: `t-cassava-chips-golden` (TF06) came as thin round potato crisps; mogo chips are thick chips (TD03 draws them
   right).
5. **See-through on magenta**: `t-corn-kernels-in-a-cup` (TF07, a clear plastic cup) and `t-bhajia-frying` (TF09, a pool of oil)
   carry the magenta through them; no cut can take it out. The plan's own rule says nothing see-through on magenta.
6. **Magenta at the rims, fixed in the cut, two faint traces left.** The first cut left pink inside twine bows, between onion
   rings, in coconut fibre and in frying oil. Re-cut with a looser magenta key (tol 90, any enclosed ground a hole) and a new
   rim pass (`build/tools/art/artdespill.py`, only within 3 px of the edge): clean, except a faint pink on the corn silk
   (`t-corn-in-husk`) and a few strands of `t-cabbage-shredded`, both invisible at token size. Watch them on the shelf shot.
7. **Look-alikes the game must not lean on**: `t-vegetable-samosa-fried-golden` and `t-chicken-samosa-fried-golden` (TF05) are
   the same picture; plain flour and rice flour (FJ04 tins) both white; `f-fenugreek-seeds-jar` reads as round orange lentils
   (real fenugreek is small and angular). Fine for the leak test (a picture never wins), but a supported word card needs the word.
8. **One-combination rule: 152 of 346 inside one Wada combination** (my simple version; below). Most that miss are food with three
   or four natural colours; a typical cut keeps 94% of its colour in its best combination. Not a redo reason by itself today.

## 1. The mapping

All 42 run lines landed once. The two "duplicates" (`Eight Spice Jars Grid` and `Eight Spice Jars Grid(1)`) are different sheets
(FJ01 and FJ02); ChatGPT gave them the same title. Matched by content against the CSV's items in the run line's slot order (the
spec's order, which differs from the CSV's row order on 8 sheets: FP01, FP02, FV03, TB05, TF07, TK03, TK05, TD04; FK01's five
items sit in a 4x2 grid with three cells empty). Every sheet's items appear in its slot order; confidence high on all 42. The raw sheets now live in
`sources/art/s17-stove400/` under the run spec's save names, with `landed-mapping.csv` beside them (ChatGPT name, file, line).

| ChatGPT's name | now | line | items |
|---|---|---|---|
| Tea, Sugar, and Spice Jar Grid | `fa01-chai-shelf-v1.png` | FA01 | 8 |
| Eight Spice Jars Grid | `fj01-jars-v1.png` | FJ01 | 8 |
| Stainless Tea Set Grid Sheet | `fk01-chai-kit-v1.png` | FK01 | 5 |
| Eight Spice Jars Grid(1) | `fj02-jars-v1.png` | FJ02 | 8 |
| Eight Spice Jars on Grey Grid | `fj03-jars-v1.png` | FJ03 | 8 |
| Artisan Pantry Canister Collection | `fj04-jars-v1.png` | FJ04 | 8 |
| Eight Glass Jars of Grains and Legumes | `fj05-jars-v1.png` | FJ05 | 8 |
| Eight Jars of Grains and Snacks | `fj06-jars-v1.png` | FJ06 | 8 |
| Eight-jar Pantry Collection | `fj07-jars-v1.png` | FJ07 | 8 |
| Kitchen Canisters and Chutney Jars Grid | `fj08-jars-v1.png` | FJ08 | 8 |
| Stylized Kitchen Ingredients Grid | `fp01-packs-v1.png` | FP01 | 8 |
| Vibrant 3D Vegetable Grid | `fv01-produce-v1.png` | FV01 | 8 |
| Stylized Green and Red Produce Grid | `fv02-produce-v1.png` | FV02 | 8 |
| Nine-Bowl Indian Spice Grid | `tb01-katoris-v1.png` | TB01 | 9 |
| Nine Bowls of Spices and Grains | `tb02-katoris-v1.png` | TB02 | 9 |
| Spice Bowl Grid Collection | `tb03-katoris-v1.png` | TB03 | 9 |
| Nine-Heap Culinary Color Grid | `tf01-food-v1.png` | TF01 | 9 |
| Vibrant Green Ingredients Grid | `tf02-food-v1.png` | TF02 | 9 |
| Vibrant Ingredient Grid on Magenta(1) | `tf03-food-v1.png` | TF03 | 9 |
| Magenta Food Ingredient Grid | `tf04-food-v1.png` | TF04 | 9 |
| Magenta Food Grid Assortment | `tf05-food-v1.png` | TF05 | 9 |
| Indian Chai and Comfort Food Grid | `td01-dishes-v1.png` | TD01 | 9 |
| A Nine-Dish Indian Street Food Feast | `td02-dishes-v1.png` | TD02 | 9 |
| Kitchenware Flat Lay Grid | `tk01-kit-v1.png` | TK01 | 9 |
| Kitchen Essentials Flat-Lay Grid | `tk02-kit-v1.png` | TK02 | 9 |
| Kitchen Tool Flat Lay Grid | `tk03-kit-v1.png` | TK03 | 9 |
| Minimalist 3D Grocery Grid | `fp02-packs-v1.png` | FP02 | 6 |
| Vibrant Magenta Market Grid | `fv03-produce-v1.png` | FV03 | 8 |
| Nine-Bowl Ingredient Grid | `tb04-katoris-v1.png` | TB04 | 9 |
| Overhead Culinary Ingredient Grid | `tb05-katoris-v1.png` | TB05 | 6 |
| Cassava, Strawberry, and Egg Food Grid | `tf06-food-v1.png` | TF06 | 9 |
| Magenta Corn and Carrot Flatlay Grid | `tf07-food-v1.png` | TF07 | 9 |
| Top-Down Feast_ Nine Colorful Plates | `td03-dishes-v1.png` | TD03 | 9 |
| Nine-Dish Indian Feast Grid | `td04-dishes-v1.png` | TD04 | 9 |
| Stylized 3D Kitchen Essentials Grid | `tk04-kit-v1.png` | TK04 | 9 |
| Kitchen Utensils Grid in Metal and Wood | `tk05-kit-v1.png` | TK05 | 9 |
| Stylized Chutney and Pickle Jar Collection | `fj09-jars-v1.png` | FJ09 | 6 |
| Colorful 3D Vegetable Grid | `fv04-produce-v1.png` | FV04 | 8 |
| Vibrant 3×3 Vegetable and Fish Flat Lay | `tf08-food-v1.png` | TF08 | 9 |
| Bhajia and Mandazi Food Stages | `tf09-food-v1.png` | TF09 | 6 |
| Nine-Dish South Asian Feast Grid | `td05-dishes-v1.png` | TD05 | 9 |
| Indian Curry and Street Food Flat Lay | `td06-dishes-v1.png` | TD06 | 7 |

No spec line without a sheet; no sheet without a line; no true duplicates, so no alternates.

## 2. The cut

- **Tool:** `artcut.py` with a new spec `build/tools/art/specs/s17-stove400.cut.json` (one `grid` job per sheet, `cells` 4x2 or
  3x3, whole blobs by centroid, names from the CSV ids in slot order), then `artdespill.py` on the 110 magenta cut-outs.
- **Grey sheets:** tol 8; clear glass at partial alpha (`glass` with `soft_floor` 0.25, `soft_gain` 2.0, as the s17 word-moment
  glasses) for every jar and bottle and the small glass bowl; steel tins tol 5. After the pixel check (`artcheck.mjs`) found 10
  cuts with a kept shadow or haze: the thin tools of TK03 and TK05 with `shadow` (their soft contact shadow is ground), the fork
  and whisk at tol 4-5; the two dark-seed jars (mustard, nigella) solid with their empty glass top keyed as a hole (`hole_min`
  8, tol 16), since black seeds through soft glass read as haze; FA01's clear bottle with a steeper glass ramp (`soft_gain` 4).
- **Magenta sheets:** tol 90 and `hole_min` 8 (a first cut at tol 48 left pink between onion rings and in twine bows), then the rim
  pass.
- **Names:** the CSV `id` as is (`f-tea-jar.webp`, `t-turmeric-katori.webp`, `t-dish-pilau.webp`); the `f-`/`t-` prefix already
  says side-on or top-down. The plan (section 6) said `shelf-<id>-f.webp` in `assets/cook/items/s17-stove400`; this brief's
  folder and plain ids win.
- **Size:** like the s17 word-moment cuts, not s14's: the plan's rule, longest side at most 512 px, pad 16, WebP quality 88, no
  `@2x` (the sheets' cells are 384-418 px, so every cut is at the sheet's own pixels: 300-493 px, median 402). 346 files, 11 MB.
  Data: `assets/cook/items-s17-stove/cut-data.json` (each item's file and size).
- **Proof of the cut:** 0 flags from `artcut.py`; every cell had its item; the contact sheet below.

## 3. The judge

**Numbers, the sheets** (`artjudge.py --spec … --no-look`): 42 sheets, 24 pass, 18 flag, 0 fail. The flags: tight margins on
FK01, FP01, FP02, TK05 (an item near the sheet edge, cut whole); "may read as sweets" on the dish sheets (round plates; the one
real sweet is TD04's mithai platter, which the family rule allows at a celebration); soft edges on TB05, TK03, TK04 (the glass
bowls, the cooling rack's mesh).

**Numbers, the cuts** (`artcolour.py`, one batch per sheet): 346 cuts, **262 pass, 84 flag, 0 fail**. No baked shadow, no white
halo, no off-palette colour on any cut. Light: 254 cuts brightest at the upper left; only two flagged as lit from elsewhere
(`t-tool-tablespoon`, lower right; `t-dish-kalyo-pau`, upper right: both mild, keep). The 84 flags are batch odd-ones-out that are
real differences, not faults: the glass bottle against the jars, white plates against steel bowls, coloured handles against
steel, food colours away from the house family on the vegetable sheets.

| sheet | cuts | pass | flag | fail | one combination | lowest share in its best combination |
|---|---|---|---|---|---|---|
| FA01 | 8 | 4 | 4 | 0 | 7 of 8 | f-cardamom-jar 88% |
| FJ01 | 8 | 6 | 2 | 0 | 5 of 8 | f-mustard-seeds-jar 59% |
| FK01 | 5 | 3 | 2 | 0 | 1 of 5 | f-milk-pan-with-handle 68% |
| FJ02 | 8 | 6 | 2 | 0 | 6 of 8 | f-bay-leaves-jar 88% |
| FJ03 | 8 | 4 | 4 | 0 | 6 of 8 | f-dried-mint-jar 90% |
| FJ04 | 8 | 5 | 3 | 0 | 3 of 8 | f-millet-flour-bajri 63% |
| FJ05 | 8 | 5 | 3 | 0 | 4 of 8 | f-mung-beans-whole 78% |
| FJ06 | 8 | 8 | 0 | 0 | 7 of 8 | f-peanuts 90% |
| FJ07 | 8 | 8 | 0 | 0 | 5 of 8 | f-dates 82% |
| FJ08 | 8 | 4 | 4 | 0 | 2 of 8 | f-baking-powder 66% |
| FJ09 | 6 | 5 | 1 | 0 | 3 of 6 | f-mango-pickle 96% |
| FP01 | 8 | 4 | 4 | 0 | 6 of 8 | f-butter 80% |
| FP02 | 6 | 5 | 1 | 0 | 4 of 6 | f-eggs-in-a-box 78% |
| FV01 | 8 | 3 | 5 | 0 | 5 of 8 | f-coriander-bunch 74% |
| FV02 | 8 | 7 | 1 | 0 | 2 of 8 | f-raw-green-mango 75% |
| FV03 | 8 | 8 | 0 | 0 | 1 of 8 | f-spinach-bunch 50% |
| FV04 | 8 | 8 | 0 | 0 | 1 of 8 | f-green-beans 80% |
| TB01 | 9 | 9 | 0 | 0 | 1 of 9 | t-black-pepper-katori 61% |
| TB02 | 9 | 9 | 0 | 0 | 4 of 9 | t-fenugreek-leaves-dried-katori 65% |
| TB03 | 9 | 9 | 0 | 0 | 3 of 9 | t-cooking-oil-bowl 71% |
| TB04 | 9 | 9 | 0 | 0 | 6 of 9 | t-nigella-seeds-katori 65% |
| TB05 | 6 | 6 | 0 | 0 | 2 of 6 | t-coconut-milk-bowl 72% |
| TF01 | 9 | 6 | 3 | 0 | 6 of 9 | t-potato-chips-burnt 85% |
| TF02 | 9 | 9 | 0 | 0 | 1 of 9 | t-green-chilli-slit 59% |
| TF03 | 9 | 6 | 3 | 0 | 4 of 9 | t-cucumber-whole 68% |
| TF04 | 9 | 8 | 1 | 0 | 5 of 9 | t-mince-cooked-in-the-pan 89% |
| TF05 | 9 | 8 | 1 | 0 | 7 of 9 | t-spring-onion-chopped 84% |
| TF06 | 9 | 7 | 2 | 0 | 7 of 9 | t-strawberry-whole 68% |
| TF07 | 9 | 6 | 3 | 0 | 5 of 9 | t-naan-burnt 75% |
| TF08 | 9 | 9 | 0 | 0 | 4 of 9 | t-spinach-chopped 76% |
| TF09 | 6 | 5 | 1 | 0 | 3 of 6 | t-bhajia-fried-golden 92% |
| TK01 | 9 | 6 | 3 | 0 | 5 of 9 | t-rice-pot 67% |
| TK02 | 9 | 7 | 2 | 0 | 4 of 9 | t-bag-of-charcoal 68% |
| TK03 | 9 | 4 | 5 | 0 | 5 of 9 | t-tool-chai-stirring-spoon-long 72% |
| TK04 | 9 | 8 | 1 | 0 | 3 of 9 | t-measuring-spoons 70% |
| TK05 | 9 | 7 | 2 | 0 | 4 of 9 | t-tool-whisk 67% |
| TD01 | 9 | 4 | 5 | 0 | 2 of 9 | t-dish-mung-curry-mag-nu-saag 83% |
| TD02 | 9 | 4 | 5 | 0 | 0 of 9 | t-dish-vegetable-samosas-with-chutney 68% |
| TD03 | 9 | 7 | 2 | 0 | 1 of 9 | t-dish-chips-mayai 65% |
| TD04 | 9 | 5 | 4 | 0 | 0 of 9 | t-dish-mithai-platter-celebration 57% |
| TD05 | 9 | 5 | 4 | 0 | 1 of 9 | t-dish-keema-with-peas 68% |
| TD06 | 7 | 6 | 1 | 0 | 1 of 7 | t-dish-ringra-bateta-aubergine-and-potato 69% |

**Zafar's one-combination rule (6 Nov), a simple version of my own.** Another builder is adding the real check to `artcolour.py`;
until then I used a small script (not committed): artcolour's main colours of each cut (k-means in Lab on its solid pixels),
neutrals under chroma 5 left out, each colour "in" a Wada combination when within ΔE 10 (CIEDE2000, artcolour's lightness
weight) of one of that combination's colours; a cut passes when one combination holds all its colours. Result: **152 of 346 pass;
median share held by the best combination 94%; 210 at 90% or more; 53 under 75%.** The misses are mostly dishes and mixed heaps
(TD02 and TD04 none), which are many-coloured by nature. Read it as information, not a fail, until Zafar says how strict the rule
is for food (decision 4).

**By eye** (every cut on a split dark and light ground, then the sheets at full size): no text or labels anywhere; no baked
shadow; the jar sheets look like one photo shoot (same jar, glass, highlight and lid across all ten); the produce sheets hold one
light; the katoris are the same plain steel bowl throughout. The faults are the nine in the redo list and the notes in Flaws 6-7.

## 4. FA01, judged hardest

![FA01's eight cut-outs on a split dark and light ground](art/stove-run-landed-2026-11-06-fa01.jpg)

- **One batch:** the six jars are the same jar (body, shoulder, glass, highlight), only the contents change. The bottle and carton
  share the jars' camera and light.
- **One lid family:** the six lids measure `#e7a868` to `#e8ab6d` (ΔE under 1 between them), the same profile; they match the
  approved pantry-v2 jar family it was given.
- **Light** from the upper left on all eight (artcolour's batch flags on FA01 are the bottle and carton's own caps and finish, and a
  "camera height" spread that is the contents' tops, not the jars: the six jars are one jar by eye); matte glass with one soft highlight; no shadow,
  nothing behind; no text.
- **Salt** is coarse crystals, a little pearly; it reads apart from the fine sugar next to it, which is what the game needs.
- **Heights:** all six jars the same drawn height, the bottle and carton to it, as asked (the game sets the token sizes).
- **Verdict:** it passes the ANCHOR check and **can replace chai's eight shelf files now, if Zafar keeps pale oak.** For walnut,
  redo FA01 first (one image, its prompt and checks changed to walnut, and the pantry-v2 jar reference either dropped or kept for
  the glass only), then the nine jar sheets copy it.

## 5. Coverage

| | items |
|---|---|
| to draw (the CSV rows with a sheet) | 346 |
| landed and cut | 346 |
| usable now | 337 (68 of them with pale oak lids) |
| need a redo for their look | 9: `f-chapati-flour-atta`, `f-baking-powder`, `t-cassava-chips-golden`, `t-squeeze-bottle-chutney`, `t-corn-kernels-in-a-cup`, `t-bhajia-frying`, `t-dish-chocolate-birthday-cake`, `t-dish-strawberry-cream-cake`, `t-dish-dabeli` |
| redo for walnut, on decision 1 | 68 (the 67 glass jars of FA01 and FJ01-FJ09, and the rose water bottle's cap) |
| missing | 0 |

## 6. The redo list

`docs/design-language/art-plans/s17-stove400-redo-list.yaml`: **17 lines** (sheets; a redo regenerates the whole sheet).
Six for the look (TF06, TK02, TD03, TF07, TF09, TD06; FJ04 and FJ08 carry their closed tins inside their walnut lines);
eleven for walnut (FA01, FJ01-FJ09, FP02), which run only on Zafar's yes and need the spec's "pale oak" wording changed first.
`artblock.py --redo` reads it and builds a block (tested: 17 lines into a scratch file). If Zafar keeps pale oak, the list drops
to 8 lines: the six look lines plus FJ04 and FJ08 for their tins.

Contact sheet of every cut (one row per sheet; red frame = redo, brown frame = walnut on decision 1):
`build/reports/art/stove-run-landed-2026-11-06.jpg` (924x4620, 1 MB).

## 7. Decisions for Zafar ("yes to all except …")

1. **Walnut on the jars.** The run drew pale oak (as asked, before your walnut word). Recommend: **yes, redo in walnut**, FA01
   first (one image), then the nine jar sheets and the rose water sheet (10 more): 11 images, one short run. Until then the pale
   oak cuts stand in.
2. **Walnut on the tool handles too** (daar churner, pastry brush, turner, spatula, spice grinder, butter brush)? Recommend: **yes,
   but only when those sheets are redone anyway** (TK02 is on the list); not a run of its own.
3. **The nine look redos** (the closed atta and baking powder tins, the side-on cakes, dabeli and squeeze bottle, the cassava
   chips, the pink corn cup and frying oil). Recommend: **yes**, in the same run as decision 1 (6 more images;
   the two tins ride on FJ04 and FJ08).
4. **The one-combination rule for food:** today 152 of 346 sit inside one Wada combination; dishes and mixed heaps can't. Recommend:
   **apply it to containers, tools and single ingredients, not to dishes or mixed heaps**; the real check (the other builder's)
   should say which.
5. **Chai's shelf swap:** recommend **wait for the walnut FA01** rather than swap twice.

## Implementation plan

1. **On decision 1 (walnut):** change "pale oak" to "walnut" in `build/tools/art/specs/s17-stove400.run.yaml` (11 places: the
   ANCHOR and SHELF checks, the jar lines' ITEMS) and the plan's FS prompt and lid rule (`s17-stove400-art-plan.md` section 3 and
   the FS prompt, 4 places) with "(Zafar, 6 Nov)"; decide whether FA01 still attaches `jar-family.png` (its lids are oak: drop it,
   or keep it with a line that only its glass counts). Then `artblock.py --check` and
   `artblock.py --redo docs/design-language/art-plans/s17-stove400-redo-list.yaml`. Size: 30 min. Risk: the generator copies the
   attached oak lids anyway; FA01 is judged hardest again.
2. **On decision 3 only (no walnut):** drop the walnut lines from the redo list except FJ04 and FJ08 (keep their tin reasons),
   generate the block. Size: 10 min.
3. **When the redo lands:** `artcut.py build/tools/art/specs/s17-stove400.cut.json --only <ids>` (point `src` at the -v2 files),
   `artdespill.py` on magenta cuts, `artcolour.py` per sheet, a contact sheet; replace the files in
   `assets/cook/items-s17-stove/`. Size: 1 hour. Risk: low.
4. **Wiring (a build session, not this one):** the size class per item into the catalogue and the shelf scaling by class (the plan
   section 6), chai's eight shelf files first, the old v2 and bare jars kept until the swap is judged. Check: the shelf at
   740x320 and 1920x1080 and the judge.

## Proof

- Cut: `python3 build/tools/art/artcut.py build/tools/art/specs/s17-stove400.cut.json` (run as four parallel `--only` workers
  and merged; the magenta sheets, TK03, TK05, FA01, FJ01 and FJ03 re-cut after the first look and the pixel check, each with
  the spec as committed): 42 jobs, 0 flags, 346 props in `cut-data.json`.
- Pixel check: `node build/tools/art/artcheck.mjs`: "467 findings, 467 known, 0 new" (the first cut had 10 new; fixed by the
  re-cut, none added to the known list).
- Rim pass: `python3 build/tools/art/artdespill.py` on the 110 magenta cut-outs.
- Sheets: `python3 build/tools/art/artjudge.py --spec build/tools/art/specs/s17-stove400.run.yaml --no-look`: "42 image(s): 24 pass,
  18 flag, 0 fail".
- Cuts: `python3 build/tools/art/artcolour.py <one sheet's cuts> --batch <line> --batch-by none` for each of the 42 sheets: 346 cuts,
  262 pass, 84 flag, 0 fail.
- Redo block: `python3 build/tools/art/artblock.py --spec build/tools/art/specs/s17-stove400.run.yaml --redo
  docs/design-language/art-plans/s17-stove400-redo-list.yaml --out <scratch>`: "17 lines" written.
- `node build/tools/review/checks.mjs` on the commit: unit 635 pass 0 fail; words, static, bump, specs, docs, fixlist, recordings
  ok; **art** "346 picture(s): 308 pass, 38 flag, 0 fail" (the new pictures, no FAIL); **size** "live site 415 MB in 5379 files"
  (the raw sheets, 83 MB, left `assets/`; the cuts add 11 MB); load 29/29. **leak** FAILed once ("snap: g1 level 1: oracle
  100%"), on game code this step does not touch; `checks.mjs --only leak` straight after: "ok leak 20 configs at every level"
  (and ok in the run before). A flaky sample, worth a row if it comes back.
