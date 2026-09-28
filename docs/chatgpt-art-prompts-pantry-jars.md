# ChatGPT art prompts: the pantry, as jars (Zafar, 28 Sept)

**For:** every pantry-shelf item in Cook, redrawn as a proper side-on container. **The problem:** the pantry shelf is viewed side-on, but the items on it were drawn top-down, which looks wrong sitting on a shelf. **The fix:** one consistent family of containers — clear glass/plastic jars and tubs with the food visible inside, each with a label sticker (about a third of the jar's height) showing a bigger picture of the item, so similar items are easy to tell apart at a glance. Milk is a carton or jug, not a jar. Lentils, flour and other bulky dry goods go in bigger jars. Spices go in small matching spice jars. Zafar uploads the PNGs to `sources/art/chatgpt-results/` (a fresh dated folder as usual); Claude cuts them with `build/slice_sheet.py --key grey` and wires them into `assets/cook/items/`.

Covers every ingredient found in `data/cook.json`'s `words`, `recipes` and `pantry` sections that a pantry or spice cupboard would sensibly hold — not just today's `pantry.lists.shelf` and `pantry_decoys`, so the shelf can grow into new ingredients later without another wrong-perspective redo.

Every sheet uses the same rules: flat mid-grey `#808080` background, no floor, no shadows, no text or numbers anywhere (the label stickers are pictures, not words — most players can't read), each container centred in its own equal cell, **identical jar or tub shape and size within a sheet's row**, style matching the attached style anchor.

## Paste into Claude in Chrome (ChatGPT open in a tab)
```
You're making 8 images in ChatGPT for a children's game. Attach sources/art/style-anchor-v1.png (download it from https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png with "Download raw file") to every prompt. Send each prompt below in its own new chat. Keep an image only if it passes its "check"; otherwise regenerate (up to 2 retries) rather than arguing. Download the PNG (never a screenshot) and rename it to the "save as" name. Don't change any ChatGPT or Chrome settings. When done, tell me the eight file names and any that failed their check.
```

## P1. Everyday staples: milk, tea, sugar, flour
```
A sprite sheet for a children's game, 2048x512, four equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers.
Each cell holds a container standing upright, seen straight on from the side, filling about 80% of its cell height. All four containers share the same shelf-height and base line, but each has its own shape as named below.
Cell 1: a milk jug or carton, white with a pale blue tint, you can see milky liquid inside through a small clear window, with a round label sticker (about a third of the jug's height) showing a big glass-of-milk picture.
Cell 2: a medium clear glass jar with a wooden lid, loose dark tea leaves visible inside, a round label sticker showing a big picture of a tea leaf.
Cell 3: a medium clear glass jar with a wooden lid, white sugar crystals visible inside, a round label sticker showing a big picture of a sugar cube.
Cell 4: a bigger clear plastic jar with a flip lid, pale cream flour visible inside, a round label sticker showing a big picture of a scoop of flour.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `pantry-jars-staples-a-v1.png`
**check:** four containers on the same base line, clearly different silhouettes (jug, two same-size jars, one bigger jar) · the food is visible through the glass/plastic in every cell · each label sticker is a picture, not text.

## P2. Everyday staples: lentils, chickpeas, sev, ghee
```
A sprite sheet for a children's game, 2048x512, four equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers.
Each cell holds a container standing upright, seen straight on from the side, filling about 80% of its cell height, all sharing the same base line.
Cell 1: a bigger clear glass jar with a wooden lid, dry orange lentils (like small round beans) visible inside, a round label sticker showing a big picture of a bowl of lentils.
Cell 2: a medium clear glass jar with a wooden lid, beige chickpeas visible inside, a round label sticker showing a big picture of a chickpea.
Cell 3: a medium clear plastic tub, golden crunchy noodle strands (like thin fried noodles) visible inside, a round label sticker showing a big picture of the golden strands.
Cell 4: a small clear glass jar with a metal lid, pale golden ghee (a smooth solid fat) visible inside, a round label sticker showing a big picture of a spoonful of ghee.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `pantry-jars-staples-b-v1.png`
**check:** four containers on the same base line, clearly different fills and sizes · the food reads clearly through the glass/plastic · each label sticker is a picture, not text.

## P3. Fresh vegetables: potato, onion, tomato, green chilli
```
A sprite sheet for a children's game, 2048x512, four equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers.
Each cell holds a clear plastic tub with an open or hinged top, seen straight on from the side, filling about 80% of its cell height, all four tubs the same size and shape, on the same base line.
Cell 1: 3 whole potatoes visible inside, a round label sticker (about a third of the tub's height) showing one big potato.
Cell 2: 3 whole red onions visible inside, a round label sticker showing one big onion.
Cell 3: 3 whole tomatoes visible inside, a round label sticker showing one big tomato.
Cell 4: a handful of whole green chillies visible inside, a round label sticker showing one big green chilli.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `pantry-jars-veg-a-v1.png`
**check:** four identical tub shapes and sizes · the vegetables are easy to tell apart even without the sticker · each label sticker is a picture, not text.

## P4. Fresh vegetables: garlic, ginger, peas, lemon
```
A sprite sheet for a children's game, 2048x512, four equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers.
Each cell holds a clear plastic tub with an open or hinged top, seen straight on from the side, filling about 80% of its cell height, all four tubs the same size and shape as each other, on the same base line.
Cell 1: 3 whole garlic bulbs visible inside, a round label sticker showing one big garlic bulb.
Cell 2: 3 knobs of fresh ginger visible inside, a round label sticker showing one big piece of ginger.
Cell 3: a heap of green peas (some still in the pod, some loose) visible inside, a round label sticker showing one big pea pod.
Cell 4: 3 whole lemons visible inside, a round label sticker showing one big lemon.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `pantry-jars-veg-b-v1.png`
**check:** four identical tub shapes and sizes, matching P3's tubs · the contents are easy to tell apart · each label sticker is a picture, not text.

## P5. Dairy, chutneys and herbs
```
A sprite sheet for a children's game, 2048x512, four equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers.
Each cell holds a container standing upright, seen straight on from the side, filling about 80% of its cell height, all on the same base line.
Cell 1: a small clear plastic tub with a lid, thick white yoghurt visible inside, a round label sticker showing a big picture of a spoonful of yoghurt.
Cell 2: a small clear glass jar with a screw lid, dark brown tamarind chutney (a thick sauce) visible inside, a round label sticker showing a big picture of a brown sauce swirl.
Cell 3: a small clear glass jar with a screw lid, bright green mint chutney (a thick sauce) visible inside, a round label sticker showing a big picture of a green sauce swirl.
Cell 4: a small clear glass jar with a wooden lid, chopped fresh green coriander leaves visible inside, a round label sticker showing a big picture of a coriander leaf.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `pantry-jars-dairy-herbs-v1.png`
**check:** four small containers of matching size (smaller than P1/P2's jars) · the two chutneys are clearly different colours (brown vs green) · each label sticker is a picture, not text.

## P6. Raw protein and pepper
```
A sprite sheet for a children's game, 1536x512, three equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers.
Each cell holds a small clear plastic tub with a lid, seen straight on from the side, filling about 80% of its cell height, all three tubs the same size and shape, on the same base line.
Cell 1: raw pink-red minced meat visible inside, a round label sticker showing a big picture of a small meatball.
Cell 2: raw meat cubes visible inside, a round label sticker showing a big picture of a meat cube on a skewer.
Cell 3: a whole green bell pepper visible inside, a round label sticker showing a big picture of a green pepper.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `pantry-jars-protein-v1.png`
**check:** three identical tub shapes and sizes · the mince and the meat cubes read as clearly different textures · each label sticker is a picture, not text.

## P7. The spice cupboard: six spice jars in a row
```
A sprite sheet for a children's game, 2048x1024, six equal cells in two rows of three on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers.
Each cell holds one small clear glass spice jar with a matching metal screw lid, seen straight on from the side, filling about 75% of its cell height. All six jars are exactly the same shape, size and lid, differing only in what's inside and the sticker, like a matched spice rack set.
Cell 1: bright yellow turmeric powder, a small round label sticker showing a big picture of a pinch of yellow powder.
Cell 2: small brown cumin seeds, a label sticker showing a big picture of a cumin seed.
Cell 3: tiny dark mustard seeds, a label sticker showing a big picture of a mustard seed.
Cell 4: green cardamom pods, a label sticker showing a big picture of one cardamom pod.
Cell 5: coarse white salt crystals, a label sticker showing a big picture of a salt crystal.
Cell 6: bright red chilli powder, a label sticker showing a big picture of a red chilli.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**save as:** `pantry-jars-spices-v1.png`
**check:** all six jars identical in shape, size and lid, differing only in contents and sticker · every fill is easy to tell apart by colour and texture alone · no text anywhere.

**Cuts to (Claude):** P1 → `jug-dudh-f.webp` (cell 1), `tin-chai-f.webp` (2), `jar-khun-f.webp` (3), `jar-atto-f.webp` (4). P2 → `jar-daal-f.webp` (1), `jar-chana-f.webp` (2), `jar-sev-f.webp` (3), `jar-ghee-f.webp` (4). P3 → `veg-bataato-whole-f.webp` (1), `veg-dungri-whole-f.webp` (2), `veg-tameto-whole-f.webp` (3), `veg-marcha-whole-f.webp` (4). P4 → `veg-lasan-whole-f.webp` (1), `veg-aadu-whole-f.webp` (2), `veg-watana-whole-f.webp` (3, new), `veg-limu-whole-f.webp` (4, new). P5 → `tub-dai-f.webp` (1, new), `jar-amli-f.webp` (2, new), `jar-lili-f.webp` (3, new), `jar-dhana-f.webp` (4, new). P6 → `tub-keema-f.webp` (1, new), `tub-gos-f.webp` (2, new), `tub-pepper-f.webp` (3, new; the word itself is still `ph-pepper`, no Kutchi recorded — Mum says capsicum isn't traditional, so it may stay English). P7 → `jar-hardar-f.webp`, `jar-jeeru-f.webp`, `jar-rai-f.webp`, `jar-elchi-f.webp` (replaces the existing one), `jar-loon-f.webp` (replaces), `jar-lalmarcha-f.webp`, in that cell order. All existing `-f` filenames are straight replacements — no code changes needed, since the pantry scene already references them by name; only the "new" ones need a line adding them to `data/cook.json`'s pantry shelf list when Zafar's ready to widen it.

---

## R5. A new results tick: two metal finishes

For the end-of-round screen's tick badge (`docs/chatgpt-art-prompts-results-badges.md` R2, already live). Zafar wants an alternative, more polished pair alongside the flat-colour fills already in the game, in the same semi-realistic material style as the stopwatch and bulb (sources for those: `sources/art/chatgpt-results/`).

```
A sprite sheet for a children's game, 1024x512, two equal cells side by side on a flat mid-grey #808080 background. No floor, no shadows, no text, no numbers, no circle behind the tick.
Each cell holds the same big, chunky, rounded tick (check mark), identical shape and size in both cells, filling about 80% of its cell, rendered as a solid metal object rather than a flat colour.
Left: polished gold metal, like a small trophy, with soft specular highlights and a warm glow, catching the light the way the stopwatch's gold rim does.
Right: matte grey pewter, softly brushed metal, no shine and no glow, the way the bulb's switched-off glass reads cool and quiet.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, semi-realistic metal shading to match the stopwatch and the bulb, no outlines.
```
**save as:** `ui-results-tick-metal-v1.png`
**check:** two identical tick shapes differing only in material and finish · the gold cell shows visible specular highlights, the pewter cell is flat matte with no shine · no circle or background shape behind either.

**Cuts to (Claude):** `tick-gold-metal.webp`, `tick-pewter.webp`. Zafar decides where these sit alongside the existing flat-fill tick states (`docs/chatgpt-art-prompts-results-badges.md` R2) before wiring.
