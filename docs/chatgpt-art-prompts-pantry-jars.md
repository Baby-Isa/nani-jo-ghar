# ChatGPT art prompts: the pantry v2 (Zafar, 28 Sept)

## Paste this one block into Claude in Chrome
```
You're making 8 images in ChatGPT for a children's game called Nani jo Ghar, then committing them to GitHub. Work through these steps in order, in new tabs, and don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/claude/nifty-rubin-c0d431/docs/chatgpt-art-prompts-pantry-jars.md. Read the whole page. It has 8 prompts, P0 to P7, each in a grey code box, each followed by "attach", "save as" and "check" lines.

2. Download the two reference images yourself. Open each page below and click its "Download raw file" button (the download-arrow icon at the top right of the image):
   - https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png
   - https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt/bg-nani-kitchen-e-v1.png

3. In ChatGPT (chatgpt.com), for each prompt P0 to P7 in order: start a new chat, attach the files its "attach" line names, paste the text of its code box exactly as written, and send. When the image arrives, compare it against its "check" line. If it fails, reply once saying which check it failed and ask for a corrected image; if that fails too, start a fresh chat and try once more (at most 2 retries per prompt), then keep the best one and note what's wrong with it. Download the image with ChatGPT's own download button (never a screenshot) and rename it to the "save as" name. P1's result is attached to P2 to P7 as a family reference, so do P1 before those.

4. Upload all 8 PNGs in one go at https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/pantry-v2 (use "choose your files" if you can't drag them). Commit message: "Pantry v2 art: background and 7 container sheets (ChatGPT)". If any file kept ChatGPT's own name because you couldn't rename it, list which prompt each one is in the extended description. Pick "Commit directly to the main branch" and press "Commit changes".

5. Tell me: the 8 file names, the commit link, and any image that failed its check and how.
```

**For:** Cook's pantry round (`js/cook/mechanics/fetch.js`), redrawn to Zafar's 28 Sept decisions (`docs/cook-ui-feedback-2026-09-28.md` §4). **The problem:** the shelves were angled and the items on them were top-down bowls, which looks wrong on a side-on shelf. **The fix:** a new pantry background seen dead straight on, with a glass-door fridge and a tray, and every item redrawn as a side-on container from one family: clear containers with the food visible inside and a label sticker (about a third of the container's height) showing a blown-up picture of the item. The existing top-down art stays for the cooking stations.

**Coverage:** every ingredient used by any Cook station today (33 items, from `data/cook.json`'s `words`, `recipes` and `pantry`, plus oil and samosa pastry, which the stations use without a word yet), plus 30 planned extras for the new arcs (`docs/Nani jo Ghar — Roadmap and Story Structure.md`): 63 items on 7 sprite sheets, and the background. Existing ids are reused from `data/content.json` where they exist (fruit, carrot, spices); anything marked **new id** needs a word adding to `data/cook.json` when it's first used.

**Rules on every sheet:** 3×3 grid (nine cells, better quality per item than 4×4), flat mid-grey `#808080` background, no floor, no shadows, no text, numbers, letters or logos anywhere (the stickers are pictures only, no Kutchi or English words), each container centred in its own equal cell with clear grey all round it, **the same container, the same size, on every cell of a sheet**, each container filled with the item itself to a natural, slightly varied level between five-eighths and seven-eighths full, and a label sticker showing ONE single piece of the item drawn big (one chickpea, one potato). Style: the attached style anchor.

## P0. The pantry background
```
A background for a children's game: Nani's home pantry. Make it at the largest landscape size you can (1536x1024), crisp and highly detailed, HD quality, no blur or softness.
The camera is at eye level, looking dead straight at the back wall: a flat front-on view with no perspective tilt, no angled shelves, no side walls visible. Every shelf edge is perfectly horizontal and every upright perfectly vertical.
Left three-quarters of the picture: open wooden shelves fixed to a warm plastered wall. Three long, plain, deep wooden shelf boards, evenly spaced one above another, divided into five equal bays by four slim wooden uprights, so there are fifteen equal empty spaces.
Right quarter: a tall, slim fridge with a clear glass door and a slim silver frame, softly lit inside with a cool white light, three empty glass shelves inside.
Across the whole bottom of the picture: a wooden counter top, just below eye level so a little of its surface shows. On the counter, in the middle of the picture, a large empty rectangular wooden tray with a low raised rim, its flat base clearly visible.
Everything is empty: no jars, no food, no bottles, no items at all on the shelves, in the fridge or on the tray. No people, no text.
Keep the top 8% of the picture plain wall and the bottom 8% plain counter front, with nothing important in either (the game trims them).
Style: exactly as the attached style anchor, and the same wood, plaster, colours and warm light as the attached kitchen picture, so it reads as the next room of the same house: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `bg-nani-kitchen-e-v1.png`
**save as:** `pantry-v2-bg.png`
**check:** shelves perfectly horizontal and seen straight on (no angle) · shelves on the left about three-quarters, a glass-door fridge on the right about a quarter · the tray sits on the counter in the middle · nothing at all on the shelves, in the fridge or on the tray · no text.

## P1. Tall jars: flour, grains, sugar, tea, lentils
```
A sprite sheet for a children's game, 1024x1536 portrait, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the same tall clear glass storage jar with a round wooden lid, standing upright, seen straight on from the side at eye level, filling about 80% of its cell height, centred, with clear grey all round it. All nine jars are exactly the same shape and size; only what's inside and the sticker differ. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted. The glass is faintly tinted pale blue with soft highlights, so the food inside is easy to see.
On the front of each, a round cream paper label sticker, about a third of its height, showing ONE single piece of the item, drawn big and simple (one chickpea, one cumin seed, one potato), so it's easy to see what's inside at a glance. A picture, never words.
Row 1: (1) fine pale cream wheat flour; sticker: one ear of golden wheat. (2) grey-beige millet flour, slightly speckled; sticker: one head of millet. (3) sparkling white sugar crystals; sticker: one sugar cube.
Row 2: (4) dark loose tea leaves; sticker: one green tea leaf. (5) small orange split lentils; sticker: one orange lentil. (6) round beige chickpeas; sticker: one big chickpea.
Row 3: (7) crunchy golden thin noodle strands (sev); sticker: one curl of golden sev. (8) long white rice grains; sticker: one grain of rice. (9) dark brown cocoa powder; sticker: one cocoa pod.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**save as:** `pantry-v2-sheet1-tall-jars.png`
**check:** nine identical jars, same size, on matching base lines · every filling easy to tell apart through the glass (the two flours differ in colour) · every sticker is a picture, no words · nothing crosses from one cell into the next. · each sticker shows one single item, drawn big · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing

| Cell | Item | Game id | Why | Cuts to |
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
Each cell holds the same small square clear glass spice jar with a round silver metal screw lid, standing upright, seen straight on from the side at eye level, filling about 70% of its cell height, centred, with clear grey all round it. All nine jars are exactly the same shape and size, like a matched spice-rack set; only what's inside and the sticker differ. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted.
On the front of each, a round cream paper label sticker, about a third of its height, showing ONE single piece of the item, drawn big and simple (one chickpea, one cumin seed, one potato), so it's easy to see what's inside at a glance. A picture, never words.
Row 1: (1) bright yellow turmeric powder; sticker: one turmeric root. (2) small brown cumin seeds; sticker: one big cumin seed. (3) tiny round dark mustard seeds; sticker: one big round mustard seed.
Row 2: (4) green cardamom pods; sticker: one big cardamom pod. (5) coarse white salt crystals; sticker: one salt crystal. (6) bright red chilli powder; sticker: one dried red chilli.
Row 3: (7) black peppercorns; sticker: one big black peppercorn. (8) rolled cinnamon sticks standing upright; sticker: one cinnamon stick. (9) tiny rainbow-coloured sugar sprinkles; sticker: one sprinkle.
Style: exactly as the attached style anchor, and the same glass, light and sticker style as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pantry-v2-sheet1-tall-jars.png`
**save as:** `pantry-v2-sheet2-spice-jars.png`
**check:** nine identical small square jars with the same lid · every filling easy to tell apart by colour and texture alone (salt vs sugar-like sprinkles, cumin vs mustard) · stickers are pictures, no words. · each sticker shows one single item, drawn big · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing

| Cell | Item | Game id | Why | Cuts to |
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
Each cell holds one bottle or carton standing upright, seen straight on from the side at eye level, filling about 80% of its cell height, centred, with clear grey all round it. All nine are exactly the same height and the same width, so they line up like a row on a shelf; only their shape details, contents and sticker differ. The bottles are clear, so you can see the liquid inside. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted.
On the front of each, a round cream paper label sticker, about a third of its height, showing ONE single piece of the item, drawn big and simple (one chickpea, one cumin seed, one potato), so it's easy to see what's inside at a glance. A picture, never words.
Row 1: (1) a white gable-top milk carton with a pale blue top; sticker: one glass of milk. (2) a clear plastic bottle of clear water with a blue cap; sticker: one water drop. (3) a clear glass bottle of golden cooking oil with a cork; sticker: one golden oil drop.
Row 2: (4) a clear squeezy bottle of thick dark brown tamarind chutney; sticker: one tamarind pod. (5) a clear squeezy bottle of thick bright green mint chutney; sticker: one mint leaf. (6) a clear bottle of orange juice; sticker: one orange.
Row 3: (7) a clear squeezy bottle of red tomato ketchup; sticker: one tomato. (8) a clear squeezy bottle of golden honey; sticker: one bee. (9) a clear glass bottle of bright pink rose syrup; sticker: one pink rose.
Style: exactly as the attached style anchor, and the same glass, light and sticker style as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pantry-v2-sheet1-tall-jars.png`
**save as:** `pantry-v2-sheet3-bottles.png`
**check:** all nine the same height and width · water reads as clear (not grey), oil as golden, juice as orange, honey as amber, rose syrup as pink · the milk is a carton, not a jug · stickers are pictures, no words. · each sticker shows one single item, drawn big · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing

| Cell | Item | Game id | Why | Cuts to |
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
Each cell holds the same round clear plastic food tub with a flat clip-on lid, wider than it is tall, standing upright, seen straight on from the side at eye level, filling about 70% of its cell width, centred, with clear grey all round it. All nine tubs are exactly the same shape and size; only what's inside and the sticker differ. Each is filled with the item itself to a slightly different, natural level, somewhere between five-eighths and seven-eighths full (about four-fifths on average), so they don't look copy-pasted. The plastic is clear, so the food inside is easy to see.
On the front of each, a round cream paper label sticker, about a third of its height, showing ONE single piece of the item, drawn big and simple (one chickpea, one cumin seed, one potato), so it's easy to see what's inside at a glance. A picture, never words.
Row 1: (1) thick white yoghurt; sticker: one spoonful of yoghurt. (2) raw pink-red minced meat; sticker: one meatball. (3) raw red meat cubes; sticker: one meat cube.
Row 2: (4) smooth pale golden ghee; sticker: one spoonful of golden ghee. (5) raw pink chicken pieces; sticker: one chicken drumstick. (6) raw silver-skinned fish fillets; sticker: one fish.
Row 3: (7) a pale yellow block of butter; sticker: one butter curl. (8) a wedge of yellow cheese; sticker: one cheese wedge. (9) thick white whipped cream; sticker: one swirl of cream.
Style: exactly as the attached style anchor, and the same clear plastic, light and sticker style as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pantry-v2-sheet1-tall-jars.png`
**save as:** `pantry-v2-sheet4-tubs.png`
**check:** nine identical tubs · yoghurt, cream and butter clearly different (white wet, white fluffy, yellow block) · mince, meat cubes and chicken clearly different textures · stickers are pictures, no words. · each sticker shows one single item, drawn big · fill levels vary a little from one container to the next (roughly five-eighths to seven-eighths full), none nearly empty or overflowing

| Cell | Item | Game id | Why | Cuts to |
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
Each cell holds the same small, low-sided wooden crate of pale slatted wood, seen straight on from the side at eye level, filling about 75% of its cell width, centred, with clear grey all round it. All nine crates are exactly the same shape and size; only the contents and the sticker differ. The crate is piled up above its rim so the vegetables are easy to see.
On the front slat of each crate, a round cream paper label sticker, about a third of its height, showing ONE single piece of the item, drawn big and simple (one chickpea, one cumin seed, one potato), so it's easy to see what's inside at a glance. A picture, never words.
Row 1: (1) whole brown potatoes; sticker: one big potato. (2) whole red onions; sticker: one big red onion. (3) whole red tomatoes; sticker: one big tomato.
Row 2: (4) whole green chillies; sticker: one big green chilli. (5) whole white garlic bulbs; sticker: one big garlic bulb. (6) knobbly pieces of fresh ginger; sticker: one big piece of ginger.
Row 3: (7) fresh green pea pods, a few split open to show the peas; sticker: one pea pod. (8) whole green bell peppers; sticker: one big green pepper. (9) fresh coriander bunches standing up, leaves on top; sticker: one coriander leaf.
Style: exactly as the attached style anchor, and the same light and sticker style as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pantry-v2-sheet1-tall-jars.png`
**save as:** `pantry-v2-sheet5-veg-crates.png`
**check:** nine identical crates · every vegetable recognisable without its sticker (green chilli vs green pepper, garlic vs onion) · stickers are pictures, no words. · each sticker shows one single item, drawn big

| Cell | Item | Game id | Why | Cuts to |
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
On the front slat of each crate, a round cream paper label sticker, about a third of its height, showing ONE single piece of the item, drawn big and simple (one chickpea, one cumin seed, one potato), so it's easy to see what's inside at a glance. A picture, never words.
Row 1: (1) whole yellow lemons; sticker: one lemon. (2) a bunch of yellow bananas; sticker: one banana. (3) whole oranges; sticker: one orange.
Row 2: (4) whole ripe mangoes, yellow-orange with a red blush; sticker: one mango. (5) whole green-yellow pears; sticker: one pear. (6) whole shiny red apples; sticker: one apple.
Row 3: (7) whole brown hairy coconuts; sticker: one coconut. (8) fresh orange carrots with green tops; sticker: one carrot. (9) corn on the cob in pale green husks, a few peeled back to show the yellow kernels; sticker: one yellow corn cob.
Style: exactly as the attached style anchor, and the same light and sticker style as the attached sheets: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pantry-v2-sheet1-tall-jars.png`, `pantry-v2-sheet5-veg-crates.png`
**save as:** `pantry-v2-sheet6-fruit-crates.png`
**check:** nine crates identical to P5's · lemon vs orange vs mango clearly different in colour and shape · stickers are pictures, no words. · each sticker shows one single item, drawn big

| Cell | Item | Game id | Why | Cuts to |
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
Each cell holds one packet or box standing upright, seen straight on from the side at eye level, filling about 75% of its cell, centred, with clear grey all round it. All nine are the same overall height and width, so they line up like a row on a shelf; only their details, contents and sticker differ. Every one is clear or has a big clear window, so the food inside is easy to see.
On the front of each, a round cream paper label sticker, about a third of its height, showing ONE single piece of the item, drawn big and simple (one chickpea, one cumin seed, one potato), so it's easy to see what's inside at a glance. A picture, never words.
Row 1: (1) a carton of six brown eggs with a clear lid, standing upright; sticker: one egg. (2) a loaf of sliced bread in a clear bag with a twist tie; sticker: one slice of bread. (3) a clear packet of round golden biscuits; sticker: one biscuit.
Row 2: (4) a box of colourful Indian sweets (mithai: round yellow ladoos, pink and white squares) with a clear lid; sticker: one round yellow ladoo. (5) a clear packet of thin, flat, pale pastry sheets; sticker: one golden samosa. (6) a clear packet of crinkly golden potato crisps; sticker: one crisp.
Row 3: (7) a box of thin striped birthday candles with a clear window; sticker: one lit candle. (8) a clear glass jar of red strawberry jam with a checked cloth lid; sticker: one strawberry. (9) a bar of chocolate in a clear wrapper, some squares showing; sticker: one chocolate square.
Style: exactly as the attached style anchor, and the same light and sticker style as the attached jar sheet: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `pantry-v2-sheet1-tall-jars.png`
**save as:** `pantry-v2-sheet7-packets.png`
**check:** all nine the same height and width · the food shows through every packet · no brand names or words anywhere · stickers are pictures. · each sticker shows one single item, drawn big

| Cell | Item | Game id | Why | Cuts to |
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

**Not drawn:** chips (`ph-chips`) are cut from potatoes in the chips station, so the pantry's potato crate covers them. The safari's stall snacks are TBC with the family; the safari leans on the "pack your bag" extras (crisps, biscuits, juice, apple, chocolate) until they're known.

---

## For Claude: cutting, slots and the tray

### Cutting the sheets (`docs/VISUAL-QA.md` §2)
- Write `build/cut_pantry_v2.py` on `build/cut_tick_v2.py`'s method, not `slice_sheet.py --key grey`:
  - measure the background from the sheet's edges (the median of the outer 6 px);
  - find the nine cells from the grey gutters (column and row projections of `d > 8`), not by dividing the image by three: ChatGPT rarely spaces cells exactly;
  - the object is everything **not connected** to the flat background, holes filled, largest piece kept, so clear glass and the grey-ish water stay solid instead of turning into holes;
  - edges use colour-to-alpha against the measured background (the eroded core stays alpha 1), which removes the grey baked into the antialiasing.
- **One canvas per container type, registered.** Per sheet: take every cell's object bounding box, then scale the whole sheet by **one** factor (so the nine containers stay the same size as each other) and place each object on an identical canvas, centred horizontally, **its base on the same line** (a fixed bottom margin). Canvas sizes: tall jars and bottles 256×384; spice jars, tubs, crates and packets 256×256.
- Record each type's real height relative to the tall jar in `data/cook.json` (`art.sprites`), e.g. tall jar and bottle 1.0, packet 0.75, crate 0.6, tub 0.55, spice jar 0.5, so a spice jar never shows as big as a flour jar.
- Check every cut on the game's cream background, zoomed: no grey fringe, no ring, no holes (the water bottle especially). Keep the sources in `sources/art/pantry-v2/` and write the webps to `assets/cook/items/` under the "Cuts to" names above.

### Wiring
- Today the pantry skips sprites and uses props or drawn bowls (`Cook.Art.wordTex`, `js/cook/art.js`). Add a `shelf` state to `art.sprites.items` for every word above and have `wordTex` use it when `scene.viewName === "pantry"`. The old `-f` files (`jar-atto-f`, `jug-dudh-f`, `tin-chai-f`, `veg-*-whole-f` …) retire once nothing reads them.
- New ids are added to `data/cook.json`'s `words` only when a round first uses them (Kutchi from the family; English placeholder until then).

### The background and the slots
- Serve `pantry-v2-bg.png` at full quality: trim the top and bottom 8% to 16:9, upscale to 1600×900 and, if still soft on a laptop at 2×, keep a 3200×1800 version (`docs/cook-ui-feedback-2026-09-28.md` §4).
- Measure the real positions from the delivered picture (shelf-board tops, bay centres, fridge shelves, tray), in the game's 1600×900 world, and replace `rows`/`xs` in `js/cook/mechanics/fetch.js` with a `slots` list in `data/cook.json` (`mechanics.fetch.slots`), each `{x, y, h, zone}`. Expected shape:
  - **shelves:** 3 rows × 5 bays = 15 slots, `zone: "shelf"`, the item's base on the board;
  - **fridge:** 3 glass shelves × 2 = 6 slots, `zone: "fridge"`.
- **What goes where:** the fridge holds milk, yoghurt, meat, mince, chicken, fish, butter, cheese, cream, eggs and juice; everything else goes on the shelves (crates on the bottom shelf where possible, spice jars on the top). A fridge item is never placed on a shelf, or the other way round; decoys follow the same rule. If a round needs more fridge slots than there are, it takes fewer fridge decoys.

### The tray
- The basket goes. The tray is painted into the background; the game measures its top surface and draws **one outlined space per item needed** (3 at level 1, up to 6), in at most two rows of three, spaced evenly and centred.
- Each space is a soft rounded outline in the shape of the needed item's container type (a tall-jar space is tall, a crate space is wide), drawn at tray scale (about 0.6 of shelf size), with no picture inside: you can see how many things are still missing, but not which.
- A tapped item flies into the next free space and sits on its outline's base line. Mid-round, spaces only fill (UX §11); a wrong item still takes a space and only shows as wrong in the end review.
- Before calling it done: screenshots at 390×844 and 1366×768 of an empty tray, a half-full tray and a full tray, looked at on the cream background (`docs/VISUAL-QA.md` §1).

The metal results tick (the old R5 prompt that sat at the bottom of this file) moved to `docs/chatgpt-art-prompts-results-badges.md`.
