# ChatGPT art prompts: the pantry v2 (Zafar, 28 Sept)

## Paste this one block into Claude in Chrome
```
You're making 16 images in ChatGPT for a children's game called Nani jo Ghar. Work through these steps in order, and don't change any ChatGPT, GitHub or Chrome settings. You don't upload anything: I'll do that.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/claude/nifty-rubin-c0d431/docs/chatgpt-art-prompts-pantry-jars.md and read the whole page. It has 16 prompts, in this order: P0 to P7, then S, then I1 to I7. Each is in a grey code box, followed by "attach" and "check" lines.

2. Download the two reference images. Open each page below and click its "Download raw file" button (the download-arrow icon at the top right of the image):
   - https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png
   - https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt/bg-nani-kitchen-e-v1.png

3. In ChatGPT (chatgpt.com), for each prompt in that order: start a new chat, attach the files its "attach" line names, paste the text of its code box exactly as written, and send. When the image arrives, compare it against its "check" line.
   - If it passes, download it straight away with ChatGPT's own download button (never a screenshot), before moving on. Don't rename it.
   - If it fails, reply once saying which check it failed and ask for a corrected image. If that fails too, start a fresh chat and try once more (at most 2 retries per prompt). Then download the best one and note what's wrong with it.
   - Download only the one image you keep for each prompt, so there are exactly 16 downloads, in prompt order.
   - P2 to P7 also attach your P1 image, and P6 also attaches your P5 image, so do those first.

4. When all 16 are done, give me a list in prompt order: the prompt (P0 … I7), the exact downloaded file name, and pass, or what's wrong with it.
```

**What happens next:** Zafar bulk-uploads the 16 files as they are to `sources/art/pantry-v2/`; Claude matches them to the prompts (from Chrome's list, the download order and the pictures themselves), renames them and processes them (see "For Claude" below).

**For:** Cook's pantry round (`js/cook/mechanics/fetch.js`), redrawn to Zafar's 28 Sept decisions (`docs/cook-ui-feedback-2026-09-28.md` §4). **The problem:** the shelves were angled and the items on them were top-down bowls, which looks wrong on a side-on shelf. **The fix:** a new pantry background seen dead straight on, with a glass-door fridge and a tray, and every item redrawn as a side-on container from one family: clear containers with the food visible inside, and a round label sticker (about a third of the container's height) showing ONE single piece of the item drawn big (one chickpea, one potato). The existing top-down art stays for the cooking stations.

**Labels are added by Claude, not ChatGPT.** ChatGPT draws the containers bare (no label at all), one blank sticker, and each item as a single picture. Claude puts the picture on the sticker and the sticker on the container. So every label is the same size, in the same place on every container of a type, with exactly one item on it; a wrong picture is fixed by redrawing one cell, not a sheet; the single-item pictures double as UI icons (the request card's picture rows, the tally, the word review); and the bare containers stay available for other views later (a bottle turned round, say).

**Coverage:** every ingredient used by any Cook station today (33 items, from `data/cook.json`'s `words`, `recipes` and `pantry`, plus oil and samosa pastry, which the stations use without a word yet), plus 30 planned extras for the new arcs (`docs/Nani jo Ghar — Roadmap and Story Structure.md`): 63 items. That's 16 images: the background (P0), 7 bare-container sheets (P1–P7), the blank sticker (S) and 7 single-item sheets (I1–I7, in the same cell order as P1–P7). Existing ids are reused from `data/content.json` where they exist (fruit, carrot, spices); anything marked **new id** needs a word adding to `data/cook.json` when it's first used.

**Rules on every sheet:** 3×3 grid (nine cells, better quality per item than 4×4), flat mid-grey `#808080` background, no floor, no shadows, no text, numbers, letters or logos anywhere, each thing centred in its own equal cell with clear grey all round it. Container sheets: **the same container, the same size, in every cell**, no label or print on it, filled with the item itself to a natural, slightly varied level between five-eighths and seven-eighths full (crates heaped). Style: the attached style anchor.

## P0. The pantry background (v3, second try: paint a layout sketch)
The first v3 prompt was wrong, not just ChatGPT: it left the counter and tray a third of the way up, with nowhere for the things on the tray. Worked out from the game instead: four rows of things (shelf 1, shelf 2, shelf 3, the tray), each with room for the tallest (a tall jar, about 175 px of the game's 900), the counter's front off the bottom of the picture, the tray the length of the shelves, and the fridge with four levels lined up with them. That's too exact for words, so ChatGPT gets a flat colour sketch of the layout (`sources/art/pantry-v2/pantry-v3-layout-sketch.png`, made by the script in the commit that added it) and paints it. The top 80 px and bottom 80 px of the 1536x1024 image are trimmed by the game.

**Try A (preferred): paint the sketch.**
```
Paint the attached flat-colour layout sketch as a finished background for a children's game: Nani's home pantry. Keep the size exactly 1536x1024 (landscape), and keep every shape exactly where it is in the sketch and exactly the same size: the same positions, heights and gaps. Only the materials and lighting change. Crisp and highly detailed, HD quality.
What each shape is:
- The beige background: a warm plastered wall with a very soft texture.
- The three long brown bars on the left: three thick, plain, warm oak floating shelves, each one unbroken board, perfectly horizontal, with no uprights, brackets or dividers. The empty wall above each shelf stays empty (big jars will stand there later).
- The grey and pale blue shape on the right: a tall, slim glass-door fridge with a slim brushed-steel frame. It runs off the top of the picture. Inside, soft cool white light and three empty glass shelves at exactly the heights of the thin lines in the sketch, level with the wooden shelves.
- The cream band near the bottom: the top of a cream marble counter with soft golden veins. The ribbed brown band below it: the counter's front, vertical oak panelling, mostly off the bottom of the picture.
- The brown shape on the counter: a long, empty oak tray as long as the shelves, seen straight on: a thin back rim, its flat light base showing, and a tall plain front rim (the darker brown band) that would hide the bottom of anything standing in the tray.
The camera is at eye level, looking dead straight at the wall: flat front-on, no perspective tilt, no side walls. Soft, even, warm daylight from the upper left, no sunbeams, no patches of light and no hard shadows on the wall or shelves.
Everything is empty: nothing on the shelves, in the fridge or on the tray. No people, no text.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, no outlines.
```
**attach:** `pantry-v3-layout-sketch.png` (https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/pantry-v2/pantry-v3-layout-sketch.png), `style-anchor-v1.png`
**Claude renames it to:** `pantry-v3-bg.png`
**check:** lay it over the sketch in your head: the three shelves, the fridge's glass shelves, the counter and the tray are where the sketch has them, the same heights and gaps (the shelves nearly evenly filling the height, the tray at the very bottom) · the tray is as long as the shelves, with a tall front rim · the fridge runs off the top · no sunbeams or hard shadows · nothing on the shelves, in the fridge or on the tray · no text.

**Try B (if A keeps changing the layout): words only, no sketch.**
```
A background for a children's game: Nani's home pantry, 1536x1024 landscape, crisp and highly detailed, HD quality.
The camera is at eye level, looking dead straight at a warm plastered wall: flat front-on, no perspective tilt, no side walls. The picture is almost all shelves: the counter is only a strip at the very bottom.
Left three-quarters: three thick, plain, warm oak floating shelves, each one unbroken board, perfectly horizontal, no uprights or brackets, spanning from near the left edge to three-quarters of the way across. Space them evenly down the picture: the top of the first shelf 29% of the way down, the second 49% down, the third 68% down. The wall above each shelf is empty and tall enough for a big storage jar.
Right quarter: a tall, slim glass-door fridge with a brushed-steel frame, running off the top of the picture and down to the counter, lit inside with soft cool white light, with three empty glass shelves level with the three wooden shelves.
At the very bottom: the top of a cream marble counter with soft golden veins, its front edge at 92% of the way down, the counter's front below that, off the picture. On the counter, a long, empty oak tray exactly as long as the shelves above it, seen straight on: a thin back rim at 86% down, a flat light base, and a tall plain front rim from 88% to 92% down that hides the bottom of anything standing in it.
Soft, even, warm daylight from the upper left; no sunbeams, no patches of light, no hard shadows. Everything empty: nothing on the shelves, in the fridge or on the tray. No people, no text.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v3-bg.png`
**check:** as for A.

v2's prompt is in git history (this file, 28 Sept); v2 is what the game shows until v3 is in.

## P0-F. The pantry v3 fridge (29 Sept: only the fridge changes)
v3 from Try A (the painted sketch) is right for the shelves and the tray (Zafar, with the items in: "looks much better"). The fridge needs three glass shelves, each level with a wooden shelf (not four levels), a solid fridge base below the third, and a top. Only the fridge is repainted: `sources/art/pantry-v2/pantry-v3-fridge-sketch.png` is the v3 picture with the fridge replaced by a flat sketch of the new one; ChatGPT paints it, and Claude takes **only the fridge** from the result and blends it into the approved v3 picture, so the shelves and tray can't move.
```
The attached picture is a finished background for a children's game (Nani's home pantry), except for the flat grey and pale blue shape on the right, which is a sketch of a fridge. Paint that fridge properly, exactly where the sketch has it and exactly the same size, and keep the rest of the picture as it is. Keep the size 1536x1024 (landscape).
The fridge: a tall, slim, modern fridge with a brushed-steel body, seen dead straight on at eye level, with no perspective tilt.
- The darker band at the top: the fridge's steel top, a plain solid panel.
- The pale blue area: the fridge's clear glass door, through which you see the empty inside, softly lit with a cool white light.
- The three thin lines inside: three empty glass shelves at exactly those heights (level with the three wooden shelves on the left).
- Below the third glass shelf: the fridge's solid steel base, with one wide drawer front with a slim horizontal handle, and a slim ventilation grille at the very bottom, just above the marble counter.
The door is closed. Soft, even, warm daylight from the upper left on the steel. Nothing inside the fridge. No text, no logos, no brand name.
Style: exactly as the attached style anchor and the rest of the picture: stylised 3D animated-feature-film look, soft global illumination, no outlines.
```
**attach:** `pantry-v3-fridge-sketch.png` (https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/pantry-v2/pantry-v3-fridge-sketch.png), `style-anchor-v1.png`
**Claude renames it to:** `pantry-v3-fridge.png` (the fridge is cut from it; the rest is ignored)
**check:** the fridge is where the sketch has it, the same width and height · a solid steel top · exactly three glass shelves, level with the three wooden shelves · a solid steel base with a drawer and a grille below the third shelf · the door closed, nothing inside · no text or logo.

## P1. Tall jars: flour, grains, sugar, tea, lentils
```
A sprite sheet for a children's game, 1024x1536 portrait, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the same tall clear glass storage jar with a round wooden lid, standing upright, seen straight on from the side at eye level, filling about 80% of its cell height, centred, with clear grey all round it. All nine jars are exactly the same shape and size; only what's inside differs. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted. The glass is faintly tinted pale blue with soft highlights, so the food inside is easy to see.
No label, no sticker, no tag and no print anywhere on any container: leave every front plain (the game adds its own label later).
Row 1: (1) fine pale cream wheat flour. (2) grey-beige millet flour, slightly speckled. (3) sparkling white sugar crystals.
Row 2: (4) dark loose tea leaves. (5) small orange split lentils. (6) round beige chickpeas.
Row 3: (7) crunchy golden thin noodle strands (sev). (8) long white rice grains. (9) dark brown cocoa powder.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-sheet1-tall-jars.png`
**check:** nine identical jars, same size, on matching base lines · every filling easy to tell apart through the glass (the two flours differ in colour) · nothing crosses from one cell into the next · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing · no label, sticker or print on any container

| Cell | Item | Game id | Why | Cuts to (labelled; the bare one adds `-bare`) |
|---|---|---|---|---|
| 1 | flour | `cook-atto` | now (pantry, samosa) | `shelf-cook-atto-f.webp` |
| 2 | millet flour | `ph-bajri-atto` (**new id**) | now (the millet maani's dough) | `shelf-ph-bajri-atto-f.webp` |
| 3 | sugar | `cook-khun` | now (chai, pantry) | `shelf-cook-khun-f.webp` |
| 4 | tea leaves | `cook-chai` | now (chai, pantry) | `shelf-cook-chai-f.webp` |
| 5 | lentils | `cook-daal` | now (daal, pantry) | `shelf-cook-daal-f.webp` |
| 6 | chickpeas | `ph-chana` | now (chaat) | `shelf-ph-chana-f.webp` |
| 7 | sev | `ph-sev` | now (chaat) | `shelf-ph-sev-f.webp` |
| 8 | rice | `ph-rice` (**new id**) | extra: the Birthday (pilau for the guests' orders); a trip's packed lunch | `shelf-ph-rice-f.webp` |
| 9 | cocoa powder | `ph-cocoa` (**new id**) | extra: the Birthday (baking the cake) | `shelf-ph-cocoa-f.webp` |

## P2. Spice jars
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the same small square clear glass spice jar with a round silver metal screw lid, standing upright, seen straight on from the side at eye level, filling about 70% of its cell height, centred, with clear grey all round it. All nine jars are exactly the same shape and size, like a matched spice-rack set; only what's inside differs. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted.
No label, no sticker, no tag and no print anywhere on any container: leave every front plain (the game adds its own label later).
Row 1: (1) bright yellow turmeric powder. (2) small brown cumin seeds. (3) tiny round dark mustard seeds.
Row 2: (4) green cardamom pods. (5) coarse white salt crystals. (6) bright red chilli powder.
Row 3: (7) black peppercorns. (8) rolled cinnamon sticks standing upright. (9) tiny rainbow-coloured sugar sprinkles.
Style: exactly as the attached style anchor, and the same glass and light as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, your P1 image
**Claude renames it to:** `pantry-v2-sheet2-spice-jars.png`
**check:** nine identical small square jars with the same lid · every filling easy to tell apart by colour and texture alone (salt vs sugar-like sprinkles, cumin vs mustard) · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing · no label, sticker or print on any container

| Cell | Item | Game id | Why | Cuts to (labelled; the bare one adds `-bare`) |
|---|---|---|---|---|
| 1 | turmeric | `spi-01` | now (daal tadka, pantry) | `shelf-spi-01-f.webp` |
| 2 | cumin seeds | `spi-02` | now (daal tadka) | `shelf-spi-02-f.webp` |
| 3 | mustard seeds | `spi-05` | now (daal tadka) | `shelf-spi-05-f.webp` |
| 4 | cardamom | `spi-10` | now (chai, pantry) | `shelf-spi-10-f.webp` |
| 5 | salt | `spi-16` | now (daal, pantry) | `shelf-spi-16-f.webp` |
| 6 | red chilli powder | `spi-04` | now (the daal tadka shelf) | `shelf-spi-04-f.webp` |
| 7 | black pepper | `spi-11` | extra: garden/farm day (the hens' eggs, boiled with salt and pepper) | `shelf-spi-11-f.webp` |
| 8 | cinnamon | `spi-09` | extra: the Birthday (pilau and party chai) | `shelf-spi-09-f.webp` |
| 9 | sprinkles | `ph-sprinkles` (**new id**) | extra: the Birthday (decorating the cake) | `shelf-ph-sprinkles-f.webp` |

## P3. Bottles and the milk carton
```
A sprite sheet for a children's game, 1024x1536 portrait, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds one bottle or carton standing upright, seen straight on from the side at eye level, filling about 80% of its cell height, centred, with clear grey all round it. All nine are exactly the same height and the same width, so they line up like a row on a shelf; only their shape details and contents differ. The bottles are clear, so you can see the liquid inside. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted.
No label, no sticker, no tag and no print anywhere on any container: leave every front plain (the game adds its own label later).
Row 1: (1) a white gable-top milk carton with a pale blue top. (2) a clear plastic bottle of clear water with a blue cap. (3) a clear glass bottle of golden cooking oil with a cork.
Row 2: (4) a clear squeezy bottle of thick dark brown tamarind chutney. (5) a clear squeezy bottle of thick bright green mint chutney. (6) a clear bottle of orange juice.
Row 3: (7) a clear squeezy bottle of red tomato ketchup. (8) a clear squeezy bottle of golden honey. (9) a clear glass bottle of bright pink rose syrup.
Style: exactly as the attached style anchor, and the same glass and light as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, your P1 image
**Claude renames it to:** `pantry-v2-sheet3-bottles.png`
**check:** all nine the same height and width · water reads as clear (not grey), oil as golden, juice as orange, honey as amber, rose syrup as pink · the milk is a carton, not a jug · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing · no label, sticker or print on any container

| Cell | Item | Game id | Why | Cuts to (labelled; the bare one adds `-bare`) |
|---|---|---|---|---|
| 1 | milk | `cook-dudh` | now (chai, pantry) | `shelf-cook-dudh-f.webp` |
| 2 | water | `cook-paani` | now (chai) | `shelf-cook-paani-f.webp` |
| 3 | oil | `ph-oil` (**new id**) | now (samosa and chips frying, tadka) | `shelf-ph-oil-f.webp` |
| 4 | tamarind chutney | `ph-amli` | now (chaat) | `shelf-ph-amli-f.webp` |
| 5 | mint chutney | `ph-lili` | now (chaat) | `shelf-ph-lili-f.webp` |
| 6 | orange juice | `ph-juice` (**new id**) | extra: the Birthday (drinks for the guests); every trip's "pack your bag" | `shelf-ph-juice-f.webp` |
| 7 | ketchup | `ph-ketchup` (**new id**) | extra: the beach stall (chips, corn on the cob); the Birthday samosas | `shelf-ph-ketchup-f.webp` |
| 8 | honey | `ph-honey` (**new id**) | extra: the clinic (honey and lemon for a cough); the beach's fried doughnuts | `shelf-ph-honey-f.webp` |
| 9 | rose syrup | `ph-rose` (**new id**) | extra: the Birthday (pink rose milk) | `shelf-ph-rose-f.webp` |

## P4. Lidded tubs: dairy, meat and fish
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the same round clear plastic food tub with a flat clip-on lid, wider than it is tall, standing upright, seen straight on from the side at eye level, filling about 70% of its cell width, centred, with clear grey all round it. All nine tubs are exactly the same shape and size; only what's inside differs. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted. The plastic is clear, so the food inside is easy to see.
No label, no sticker, no tag and no print anywhere on any container: leave every front plain (the game adds its own label later).
Row 1: (1) thick white yoghurt. (2) raw pink-red minced meat. (3) raw red meat cubes.
Row 2: (4) smooth pale golden ghee. (5) raw pink chicken pieces. (6) raw silver-skinned fish fillets.
Row 3: (7) a pale yellow block of butter. (8) a wedge of yellow cheese. (9) thick white whipped cream.
Style: exactly as the attached style anchor, and the same clear plastic and light as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, your P1 image
**Claude renames it to:** `pantry-v2-sheet4-tubs.png`
**check:** nine identical tubs · yoghurt, cream and butter clearly different (white wet, white fluffy, yellow block) · mince, meat cubes and chicken clearly different textures · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing · no label, sticker or print on any container

| Cell | Item | Game id | Why | Cuts to (labelled; the bare one adds `-bare`) |
|---|---|---|---|---|
| 1 | yoghurt | `ph-dahi` | now (chaat) | `shelf-ph-dahi-f.webp` |
| 2 | mince | `ph-keema` | now (samosa) | `shelf-ph-keema-f.webp` |
| 3 | meat | `ph-meat` | now (mishkaki) | `shelf-ph-meat-f.webp` |
| 4 | ghee | `ph-ghee` | now (a Cook word, in the star sets) | `shelf-ph-ghee-f.webp` |
| 5 | chicken | `ph-chicken` (**new id**) | extra: the Birthday (guests' orders); chicken mishkaki at the beach stall | `shelf-ph-chicken-f.webp` |
| 6 | fish | `ph-fish` (**new id**) | extra: the boat trip (fresh fish) | `shelf-ph-fish-f.webp` |
| 7 | butter | `ph-butter` (**new id**) | extra: the Birthday cake; packed-lunch sandwiches | `shelf-ph-butter-f.webp` |
| 8 | cheese | `ph-cheese` (**new id**) | extra: packed-lunch sandwiches (every trip) | `shelf-ph-cheese-f.webp` |
| 9 | cream | `ph-cream` (**new id**) | extra: the Birthday cake | `shelf-ph-cream-f.webp` |

## P5. Vegetable crates
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the same small, low-sided wooden crate of pale slatted wood, seen straight on from the side at eye level, filling about 75% of its cell width, centred, with clear grey all round it. All nine crates are exactly the same shape and size; only the contents differ. The crate is piled up above its rim so the vegetables are easy to see.
No label, no sticker, no tag and no print anywhere on any container: leave every front plain (the game adds its own label later).
Row 1: (1) whole brown potatoes. (2) whole red onions. (3) whole red tomatoes.
Row 2: (4) whole green chillies. (5) whole white garlic bulbs. (6) knobbly pieces of fresh ginger.
Row 3: (7) fresh green pea pods, a few split open to show the peas. (8) whole green bell peppers. (9) fresh coriander bunches standing up, leaves on top.
Style: exactly as the attached style anchor, and the same light as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, your P1 image
**Claude renames it to:** `pantry-v2-sheet5-veg-crates.png`
**check:** nine identical crates · every vegetable recognisable at a glance (green chilli vs green pepper, garlic vs onion) · no label, sticker or print on any container

| Cell | Item | Game id | Why | Cuts to (labelled; the bare one adds `-bare`) |
|---|---|---|---|---|
| 1 | potato | `veg-01` | now (chaat, samosa, daal, pantry) | `shelf-veg-01-f.webp` |
| 2 | onion | `veg-02` | now (daal, chaat, samosa, mishkaki) | `shelf-veg-02-f.webp` |
| 3 | tomato | `veg-03` | now (daal, chaat, mishkaki) | `shelf-veg-03-f.webp` |
| 4 | green chilli | `veg-12` | now (daal, chaat, samosa) | `shelf-veg-12-f.webp` |
| 5 | garlic | `veg-13` | now (daal) | `shelf-veg-13-f.webp` |
| 6 | ginger | `veg-14` | now (daal, pantry) | `shelf-veg-14-f.webp` |
| 7 | peas | `veg-10` | now (samosa) | `shelf-veg-10-f.webp` |
| 8 | green pepper | `ph-pepper` | now (mishkaki) | `shelf-ph-pepper-f.webp` |
| 9 | coriander | `ph-dhana` | now (chaat, samosa) | `shelf-ph-dhana-f.webp` |

## P6. Fruit and farm crates
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the same small, low-sided wooden crate as in the attached vegetable crate sheet (same pale slatted wood, same shape and size), seen straight on from the side at eye level, filling about 75% of its cell width, centred, with clear grey all round it. The crate is piled up above its rim so the food is easy to see.
No label, no sticker, no tag and no print anywhere on any container: leave every front plain (the game adds its own label later).
Row 1: (1) whole yellow lemons. (2) a bunch of yellow bananas. (3) whole oranges.
Row 2: (4) whole ripe mangoes, yellow-orange with a red blush. (5) whole green-yellow pears. (6) whole shiny red apples.
Row 3: (7) whole brown hairy coconuts. (8) fresh orange carrots with green tops. (9) corn on the cob in pale green husks, a few peeled back to show the yellow kernels.
Style: exactly as the attached style anchor, and the same light as the attached sheets: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, your P1 image, your P5 image
**Claude renames it to:** `pantry-v2-sheet6-fruit-crates.png`
**check:** nine crates identical to P5's · lemon vs orange vs mango clearly different in colour and shape · no label, sticker or print on any container

| Cell | Item | Game id | Why | Cuts to (labelled; the bare one adds `-bare`) |
|---|---|---|---|---|
| 1 | lemon | `fru-02` | now (a Cook word, in the star sets) | `shelf-fru-02-f.webp` |
| 2 | banana | `fru-01` | extra: the Birthday fruit bowl (the tested Shopping errand); the clinic (a patient's snack) | `shelf-fru-01-f.webp` |
| 3 | orange | `fru-04` | extra: the Birthday fruit bowl | `shelf-fru-04-f.webp` |
| 4 | mango | `fru-05` | extra: the Birthday (mango lassi); the garden/farm day | `shelf-fru-05-f.webp` |
| 5 | pear | `fru-06` | extra: the Birthday fruit bowl | `shelf-fru-06-f.webp` |
| 6 | apple | `fru-08` | extra: every trip's "pack your bag" | `shelf-fru-08-f.webp` |
| 7 | coconut | `fru-09` | extra: the boat trip (coconut water); the beach | `shelf-fru-09-f.webp` |
| 8 | carrot | `veg-04` | extra: the garden/farm day (the vegetable patch) | `shelf-veg-04-f.webp` |
| 9 | corn on the cob | `ph-corn` (**new id**) | extra: the beach stall (corn on the cob) | `shelf-ph-corn-f.webp` |

## P7. Packets and boxes
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos, no brand names.
Each cell holds one packet or box standing upright, seen straight on from the side at eye level, filling about 75% of its cell, centred, with clear grey all round it. All nine are the same overall height and width, so they line up like a row on a shelf; only their details and contents differ. Every one is clear or has a big clear window, so the food inside is easy to see.
No label, no sticker, no tag and no print anywhere on any container: leave every front plain (the game adds its own label later).
Row 1: (1) a carton of six brown eggs with a clear lid, standing upright. (2) a loaf of sliced bread in a clear bag with a twist tie. (3) a clear packet of round golden biscuits.
Row 2: (4) a box of colourful Indian sweets (mithai: round yellow ladoos, pink and white squares) with a clear lid. (5) a clear packet of thin, flat, pale pastry sheets. (6) a clear packet of crinkly golden potato crisps.
Row 3: (7) a box of thin striped birthday candles with a clear window. (8) a clear glass jar of red strawberry jam with a checked cloth lid. (9) a bar of chocolate in a clear wrapper, some squares showing.
Style: exactly as the attached style anchor, and the same light as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, your P1 image
**Claude renames it to:** `pantry-v2-sheet7-packets.png`
**check:** all nine the same height and width · the food shows through every packet · no brand names or words anywhere · no label, sticker or print on any container

| Cell | Item | Game id | Why | Cuts to (labelled; the bare one adds `-bare`) |
|---|---|---|---|---|
| 1 | eggs | `ph-eggs` (**new id**) | extra: the garden/farm day (the hens' eggs); the Birthday cake | `shelf-ph-eggs-f.webp` |
| 2 | bread | `ph-bread` (**new id**) | extra: packed-lunch sandwiches (every trip) | `shelf-ph-bread-f.webp` |
| 3 | biscuits | `ph-biscuits` (**new id**) | extra: every trip's "pack your bag"; the Birthday table | `shelf-ph-biscuits-f.webp` |
| 4 | sweets box | `ph-mithai` (**new id**) | extra: the Birthday ("The cat and the sweets", pack the sweet box) | `shelf-ph-mithai-f.webp` |
| 5 | samosa pastry | `ph-pastry` (**new id**) | now (samosa: fill, fold, fry) | `shelf-ph-pastry-f.webp` |
| 6 | crisps | `ph-crisps` (**new id**) | extra: the beach and the safari ("pack your bag") | `shelf-ph-crisps-f.webp` |
| 7 | birthday candles | `ph-candles` (**new id**) | extra: the Birthday finale (blowing out the candles) | `shelf-ph-candles-f.webp` |
| 8 | jam | `ph-jam` (**new id**) | extra: packed-lunch sandwiches | `shelf-ph-jam-f.webp` |
| 9 | chocolate | `ph-chocolate` (**new id**) | extra: the Birthday cake; a safari treat | `shelf-ph-chocolate-f.webp` |

## S. The blank label sticker
```
An image for a children's game, 1024x1024, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
One single blank round label sticker, seen dead straight on, perfectly round, centred, filling about 80% of the image, with clear grey all round it. Matte cream paper with a very faint paper texture, a thin slightly darker cream rim, and gentle soft shading from warm light at the upper left. Completely blank: no picture, no pattern, no words.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-sticker.png`
**check:** one perfectly round, completely blank cream sticker · seen flat on, not tilted · nothing drawn on it.

## I1. Single-item pictures for the tall jars
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE single item on its own, drawn big and simple, centred, filling about 70% of its cell along its longer side, with clear grey all round it. These pictures go on small round labels, so each must read instantly when shrunk: a clear chunky shape, bold true colours, no background shape, circle or frame behind it, nothing else in the cell. All nine are drawn at the same visual size. Pale items get soft darker shading at their edges so they stand out from the grey.
Row 1: (1) one ear of golden wheat. (2) one head of millet. (3) one white sugar cube with soft shaded sides.
Row 2: (4) one green tea leaf. (5) one orange lentil. (6) one big chickpea.
Row 3: (7) one curl of golden sev. (8) one white grain of rice with a soft darker edge. (9) one cocoa pod.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-items1.png`
**check:** exactly one item in every cell, never a heap, bowl or bunch · all nine the same visual size · every item recognisable at thumbnail size · no circles or frames behind them.

Cell order matches P1: I1 cell *k* is the label for P1 cell *k* (same game id).

## I2. Single-item pictures for the spice jars
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE single item on its own, drawn big and simple, centred, filling about 70% of its cell along its longer side, with clear grey all round it. These pictures go on small round labels, so each must read instantly when shrunk: a clear chunky shape, bold true colours, no background shape, circle or frame behind it, nothing else in the cell. All nine are drawn at the same visual size. Pale items get soft darker shading at their edges so they stand out from the grey.
Row 1: (1) one turmeric root. (2) one big cumin seed. (3) one big round mustard seed.
Row 2: (4) one big cardamom pod. (5) one white salt crystal with a soft grey-blue edge. (6) one dried red chilli.
Row 3: (7) one big black peppercorn. (8) one cinnamon stick. (9) one sprinkle.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-items2.png`
**check:** exactly one item in every cell, never a heap, bowl or bunch · all nine the same visual size · every item recognisable at thumbnail size · no circles or frames behind them.

Cell order matches P2: I2 cell *k* is the label for P2 cell *k* (same game id).

## I3. Single-item pictures for the bottles
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE single item on its own, drawn big and simple, centred, filling about 70% of its cell along its longer side, with clear grey all round it. These pictures go on small round labels, so each must read instantly when shrunk: a clear chunky shape, bold true colours, no background shape, circle or frame behind it, nothing else in the cell. All nine are drawn at the same visual size. Pale items get soft darker shading at their edges so they stand out from the grey.
Row 1: (1) one glass of white milk. (2) one pale-blue water drop. (3) one golden oil drop.
Row 2: (4) one tamarind pod. (5) one mint leaf. (6) one orange.
Row 3: (7) one tomato. (8) one wooden honey dipper with golden honey. (9) one pink rose.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-items3.png`
**check:** exactly one item in every cell, never a heap, bowl or bunch · all nine the same visual size · every item recognisable at thumbnail size · no circles or frames behind them.

Cell order matches P3: I3 cell *k* is the label for P3 cell *k* (same game id).

## I4. Single-item pictures for the tubs
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE single item on its own, drawn big and simple, centred, filling about 70% of its cell along its longer side, with clear grey all round it. These pictures go on small round labels, so each must read instantly when shrunk: a clear chunky shape, bold true colours, no background shape, circle or frame behind it, nothing else in the cell. All nine are drawn at the same visual size. Pale items get soft darker shading at their edges so they stand out from the grey.
Row 1: (1) one silver spoon holding a white dollop of yoghurt. (2) one meatball. (3) one meat cube.
Row 2: (4) one silver spoon holding golden ghee. (5) one chicken drumstick. (6) one fish.
Row 3: (7) one butter curl. (8) one cheese wedge. (9) one white swirl of whipped cream with soft shaded folds.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-items4.png`
**check:** exactly one item in every cell, never a heap, bowl or bunch · all nine the same visual size · every item recognisable at thumbnail size · no circles or frames behind them.

Cell order matches P4: I4 cell *k* is the label for P4 cell *k* (same game id).

## I5. Single-item pictures for the vegetable crates
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE single item on its own, drawn big and simple, centred, filling about 70% of its cell along its longer side, with clear grey all round it. These pictures go on small round labels, so each must read instantly when shrunk: a clear chunky shape, bold true colours, no background shape, circle or frame behind it, nothing else in the cell. All nine are drawn at the same visual size. Pale items get soft darker shading at their edges so they stand out from the grey.
Row 1: (1) one big potato. (2) one big red onion. (3) one big tomato.
Row 2: (4) one big green chilli. (5) one big garlic bulb. (6) one big piece of ginger.
Row 3: (7) one pea pod. (8) one big green pepper. (9) one coriander leaf.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-items5.png`
**check:** exactly one item in every cell, never a heap, bowl or bunch · all nine the same visual size · every item recognisable at thumbnail size · no circles or frames behind them.

Cell order matches P5: I5 cell *k* is the label for P5 cell *k* (same game id).

## I6. Single-item pictures for the fruit crates
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE single item on its own, drawn big and simple, centred, filling about 70% of its cell along its longer side, with clear grey all round it. These pictures go on small round labels, so each must read instantly when shrunk: a clear chunky shape, bold true colours, no background shape, circle or frame behind it, nothing else in the cell. All nine are drawn at the same visual size. Pale items get soft darker shading at their edges so they stand out from the grey.
Row 1: (1) one lemon. (2) one banana. (3) one orange.
Row 2: (4) one mango. (5) one pear. (6) one apple.
Row 3: (7) one coconut. (8) one carrot. (9) one yellow corn cob.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-items6.png`
**check:** exactly one item in every cell, never a heap, bowl or bunch · all nine the same visual size · every item recognisable at thumbnail size · no circles or frames behind them.

Cell order matches P6: I6 cell *k* is the label for P6 cell *k* (same game id).

## I7. Single-item pictures for the packets
```
A sprite sheet for a children's game, 1024x1024, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE single item on its own, drawn big and simple, centred, filling about 70% of its cell along its longer side, with clear grey all round it. These pictures go on small round labels, so each must read instantly when shrunk: a clear chunky shape, bold true colours, no background shape, circle or frame behind it, nothing else in the cell. All nine are drawn at the same visual size. Pale items get soft darker shading at their edges so they stand out from the grey.
Row 1: (1) one egg. (2) one slice of bread. (3) one biscuit.
Row 2: (4) one round yellow ladoo. (5) one golden samosa. (6) one crisp.
Row 3: (7) one lit candle. (8) one strawberry. (9) one chocolate square.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**Claude renames it to:** `pantry-v2-items7.png`
**check:** exactly one item in every cell, never a heap, bowl or bunch · all nine the same visual size · every item recognisable at thumbnail size · no circles or frames behind them.

Cell order matches P7: I7 cell *k* is the label for P7 cell *k* (same game id).

**Not drawn:** chips (`ph-chips`) are cut from potatoes in the chips station, so the pantry's potato crate covers them. The safari's stall snacks are TBC with the family; the safari leans on the "pack your bag" extras (crisps, biscuits, juice, apple, chocolate) until they're known.

---

## For Claude: renaming, cutting, labelling, slots and the tray

### Renaming
- Match each uploaded ChatGPT file to its prompt using Chrome's list, then the download order, then the picture itself, and `git mv` it to the "Claude renames it to" name, in `sources/art/pantry-v2/`.

### Cutting the sheets (`docs/VISUAL-QA.md` §2)
- Write `build/cut_pantry_v2.py` on `build/cut_tick_v2.py`'s method, not `slice_sheet.py --key grey`:
  - measure the background from the sheet's edges (the median of the outer 6 px);
  - find the nine cells from the grey gutters (column and row projections of `d > 8`), not by dividing the image by three: ChatGPT rarely spaces cells exactly;
  - the object is everything **not connected** to the flat background, holes filled, largest piece kept, so clear glass and the grey-ish water stay solid instead of turning into holes;
  - edges use colour-to-alpha against the measured background (the eroded core stays alpha 1), which removes the grey baked into the antialiasing;
  - **clear glass:** the first spice sheet shows grey through the empty glass above the contents and at the jar's sides. Don't make those parts solid: give glass-only pixels (close to the background colour, inside the object) colour-to-alpha too, keeping the lid, rims, highlights and contents solid, so the glass shows the shelf behind it rather than baked-in grey.
- **One canvas per container type, registered.** Per sheet: take every cell's object bounding box, then scale the whole sheet by **one** factor (so the nine containers stay the same size as each other) and place each object on an identical canvas, centred horizontally, **its base on the same line** (a fixed bottom margin). Canvas sizes: tall jars and bottles 256×384; spice jars, tubs, crates and packets 256×256.
- Cut the I sheets the same way into `assets/cook/items/icon-<id>.webp` (trimmed, centred on a square canvas, one scale per sheet), and S into one `sticker-blank.webp`.
- Record each type's real height relative to the tall jar in `data/cook.json` (`art.sprites`), e.g. tall jar and bottle 1.0, packet 0.75, crate 0.6, tub 0.55, spice jar 0.5, so a spice jar never shows as big as a flour jar.
- Check every cut on the game's cream background, zoomed: no grey fringe, no ring, no holes (the water bottle especially). Keep the sources in `sources/art/pantry-v2/` and write the webps to `assets/cook/items/` under the "Cuts to" names above (via the labelling step below).

### Putting the labels on (`build/label_pantry_v2.py`)
- **The label:** the blank sticker, with the item's icon scaled so its longer side is about 70% of the sticker's inner circle and centred on it. One label per item, all from the same sticker, so they're identical apart from the picture.
- **Where it goes:** one anchor per container type, set once by eye on that type's canvas and stored in the script: the label's centre (as fractions of the container's box) and its diameter (about a third of the container's height; larger on spice jars and crates if a third reads too small). All nine items of a type use the same anchor, so the labels line up across the shelf.
- **Making it sit on the surface:** on round containers (tall jars, bottles, tubs) squeeze the label slightly towards its left and right edges to follow the curve; square jars, crates and packets stay flat. Then shade it to match the container: darker towards the lower right, a touch of the glass's highlight across it on glass, and a hairline soft edge so it doesn't look cut out. Test on one sheet and show Zafar before doing all seven.
- Write both versions: `shelf-<id>-f.webp` (labelled, what the pantry uses) and `shelf-<id>-bare-f.webp` (no label, for other views later).
- **Check** every labelled item on the cream background, zoomed: the label's the same size and place across the type, the picture reads at shelf size, no fringe.

### Status (28 Sept, evening)
- All 16 images came back and passed; Zafar uploaded them (ChatGPT dump 3) and they're renamed in `sources/art/pantry-v2/` (the first background try wasn't uploaded, so there's no `-try1`).
- Cut with `build/cut_pantry_v2.py`: 63 bare containers (`shelf-<id>-bare-f.webp`), 63 icons (`icon-<id>.webp`) and `sticker-blank.webp` in `assets/cook/items/`. Checked by eye on cream and shelf wood (`build/previews/pantry-v2/`): glass is see-through, lids solid, no grey fringe.
- Labels tested on the spice jars (`build/label_pantry_v2.py --preview 2`, `build/previews/pantry-v2/labels-test-spice.jpg`). They sit well, but at phone size the jar's colour reads better than the label, and white-on-cream icons (salt) vanish. **Zafar: decide later. Claude recommends bare for now.** The labelling script stays ready; if labels come back, give the salt, rice and sugar icons a darker sticker or an outline first.

- **Wired in (28 Sept, late):** the pantry view uses `assets/cook/bg/bg-pantry-v2-1600.webp` (`art.sprites.bg.pantry`; the old `pantry.jpg` stays as the fallback). Each word's container is `art.sprites.shelf` (`<id>.shelf`, with its size), loaded by `art.sprites.need.fetch`. `js/cook/mechanics/fetch.js` places items from `mechanics.fetch.slots` (13 shelf places, the top shelf's two right-hand ones left clear for the tally, and 6 in the fridge), keeps `mechanics.fetch.fridge` things in the fridge, leaves out decoys with no side-on art (chips, maani), and draws the tray's outlined spaces (`mechanics.fetch.tray`), one per thing on the list, each in its container's shape. Screenshots: `node build/shoot_pantry_v2.mjs` → `build/reports/pantry-v2/` (laptop and phone landscape, levels 1 and 4, empty / half / full tray).

- **28 Sept evening (Zafar's play feedback):** the tray's front edge (`mechanics.fetch.tray.front`, cut from the picture) is drawn again over what's on the tray; each outlined space fades as its thing lands; fridge things are drawn at least `fridgeMin` (0.9) so the yoghurt reads; the tally is a grid at most three across (2 × 3 for six), in every Cook station; the pass-me pop-up shows the side-on containers in the pantry. Waiting on the v3 background (P0) for bigger items.

### Wiring
- Today the pantry skips sprites and uses props or drawn bowls (`Cook.Art.wordTex`, `js/cook/art.js`). Add a `shelf` state to `art.sprites.items` for every word above and have `wordTex` use it when `scene.viewName === "pantry"`. The old `-f` files (`jar-atto-f`, `jug-dudh-f`, `tin-chai-f`, `veg-*-whole-f` …) retire once nothing reads them.
- New ids are added to `data/cook.json`'s `words` only when a round first uses them (Kutchi from the family; English placeholder until then).

### The background and the slots
- Serve `pantry-v2-bg.png` at full quality: trim the top and bottom 8% to 16:9, upscale to 1600×900 and, if still soft on a laptop at 2×, keep a 3200×1800 version (`docs/cook-ui-feedback-2026-09-28.md` §4).
- Measure the real positions from the delivered picture (shelf-board tops, bay centres, fridge shelves, tray), in the game's 1600×900 world, and replace `rows`/`xs` in `js/cook/mechanics/fetch.js` with a `slots` list in `data/cook.json` (`mechanics.fetch.slots`), each `{x, y, h, zone}`. Expected shape:
  - **shelves:** 3 unbroken shelves × 5 evenly spaced positions = 15 slots, `zone: "shelf"`, the item's base on the board;
  - **fridge:** 4 levels × 2 = 8 slots, `zone: "fridge"`.
- **The accepted background (P0 v2, 28 Sept), first measurements** at 1536×1024, before trimming: shelf-board tops at about y 210, 398 and 588, x 22–1167; about 150 px clear above each of the lower two boards and about 130 px above the top one once the top 8% is trimmed, so tall jars are scaled to about 150 px there (spice jars suit the top board); fridge x about 1240–1500 with four levels (three glass shelves at about y 370, 525 and 680, plus the floor at about 800), so 4 × 2 = 8 fridge slots, not 6; tray on the counter at about x 395–1140, y 800–870, room for six in a row; the empty wall between the bottom shelf and the counter is where the items on the tray stand up into. Measure exactly from the file. The fridge sits outside today's pantry `footprint` (x 220–1380 in `fetch.js`): widen it to take in the fridge (the zone scales the footprint to fit, so narrow screens just zoom out a little).
- **What goes where:** the fridge holds milk, yoghurt, meat, mince, chicken, fish, butter, cheese, cream, eggs and juice; everything else goes on the shelves (crates on the bottom shelf where possible, spice jars on the top). A fridge item is never placed on a shelf, or the other way round; decoys follow the same rule. If a round needs more fridge slots than there are, it takes fewer fridge decoys.

### The tray
- The basket goes. The tray is painted into the background; the game measures its top surface and draws **one outlined space per item needed** (3 at level 1, up to 6), in one row along the tray, spaced evenly and centred (the tray is seen almost edge on, so there's no room for a second row).
- Each space is a soft rounded outline in the shape of the needed item's container type (a tall-jar space is tall, a crate space is wide), drawn at tray scale (about 0.6 of shelf size), with no picture inside: you can see how many things are still missing, but not which.
- A tapped item flies into the next free space and sits on its outline's base line. Mid-round, spaces only fill (UX §11); a wrong item still takes a space and only shows as wrong in the end review.
- Before calling it done: screenshots at 390×844 and 1366×768 of an empty tray, a half-full tray and a full tray, looked at on the cream background (`docs/VISUAL-QA.md` §1).

The metal results tick (the old R5 prompt that sat at the bottom of this file) moved to `docs/chatgpt-art-prompts-results-badges.md`.
