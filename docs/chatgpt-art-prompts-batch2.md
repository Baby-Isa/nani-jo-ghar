# ChatGPT art prompts, batch 2: the copy-paste pack

**Started:** 25 Sept 2026. **For:** the second ChatGPT run, which fills the gaps batch 1 left for Cook. **Built from:** `build/reports/chatgpt-batch-1.md` (section 5: the fails and their re-prompts; section 6: what Cook still needs and the suggested next sheets), `docs/chatgpt-art-prompts.md` (the batch 1 pack: its tips, style lines and character prompts still apply), `docs/Nani jo Ghar — Art Bible.md` (the rules win if anything here disagrees), `docs/Nani jo Ghar — Cast.md` and `build/slice_sheet.py`.

It works like batch 1. Each prompt is one fenced block: copy it, attach what the **attach:** line says, send. Keep the result only if it passes the **check:** line, then download it and name it as the **save as:** line says. The **slices to:** line is for Claude: the grid it's cut on, the key colour, and the sprite names.

---

## 0. Before you start

### 0.1 What's different from batch 1

- **Batch 1's tips (its section 0) all still apply:** attach the style anchor every time, regenerate rather than argue, a fresh chat for every sheet, download the PNG (never a screenshot), hand the PNGs back to Claude.
- **Some sheets have fewer cells.** The slicer takes any grid, so a sheet with six items is a 3 × 2 grid, not twelve cells with gaps. Each prompt says its grid.
- **Food goes on magenta (`#FF00FF`); steel, glass, wood and tools go on grey (`#808080`).** No shadows on magenta, every item well inside its own cell, and straight top-down unless the prompt says otherwise.
- **Some prompts attach a batch-1 sprite so the new one matches it** (the wheat maani, the samosas). Those sprites are cut-outs with transparent backgrounds; ChatGPT copes with that.
- **The approved Nani is `char-nani-v2.png`**, not the `char-nani-v1.png` that batch 1's prompts mention. Use v2 wherever a prompt asks for "the approved Nani sheet".

### 0.2 The order

| Step | What | Images | Who |
|---|---|---|---|
| 1 | Redos: the worktop evening relight, the onion, the velan, the chakla, the thali | 5 | Claude in Chrome, unattended |
| 2 | New sheets: bajri maani, hob knob and flames, chai tray and grill, samosa folds, pantry veg (F), pantry containers (F), chaat layers | 7 | Claude in Chrome, unattended |
| 3 | Real-life characters: Big Ma, the doctor, Simba, Zazu, each with a behind-the-counter view | about 14 | Zafar, with Claude in Chrome |

### 0.3 Attachments: download these first

Everything below is in the repo. On GitHub, open each file under `https://github.com/Baby-Isa/nani-jo-ghar/blob/main/` (for example `…/blob/main/sources/art/style-anchor-v1.png`) and use the **Download raw file** button. Put them all in one folder, e.g. `Downloads/nani-batch2-attach/`. Keep the file names as they are.

| File | Used by |
|---|---|
| `sources/art/style-anchor-v1.png` | **Every prompt** |
| `assets/cook/bg/bg-cook-worktop-t-v1.png` | 1.1 worktop evening |
| `sources/art/chatgpt/sheet-vessels-v1.png` | 1.5 thali, 2.3 chai tray and grill, 2.6 containers (for the steel finish) |
| `assets/cook/items/maani-raw-t.png` | 2.1 bajri maani (size and circle) |
| `assets/cook/items/dough-ball-t.png` | 2.1 bajri maani (the ball's size) |
| `assets/cook/bg/bg-cook-hob-t-v1.png` | 2.2 hob knob and flames |
| `assets/cook/items/samosa-filled-t.png` | 2.4 samosa folds |
| `assets/cook/items/samosa-folded-t.png` | 2.4 samosa folds |
| `assets/cook/items/samosa-fried-golden-t.png` | 2.4 samosa folds (for the fried look) |
| `sources/art/chatgpt/sheet-toppings-t-v1.png` | 2.7 chaat layers (the toppings' colours) |
| `assets/cook/items/chaat-bowl-empty-t.png` | 2.7 chaat layers (the bowl the layers fill) |
| `sources/art/characters/char-nani-v2.png` | Section 3 (style and framing of the counter view; render style for Big Ma and the doctor) |
| `sources/private/…` photos | Section 3 only. **Never in the repo:** they're on Zafar's computer, not GitHub |

### 0.4 Instructions for Claude in Chrome (unattended run of sections 1 and 2)

Paste this into Claude in Chrome with ChatGPT open in a tab, the prompt pack open in another tab, and the attachments folder from 0.3 ready.

```
You're running batch 2 of the "Nani jo Ghar" art prompts in ChatGPT, on your own. Zafar isn't watching; he'll read your log afterwards.

The prompts: docs/chatgpt-art-prompts-batch2.md, open in another tab. Do sections 1 and 2 only, top to bottom: 1.1 to 1.5, then 2.1 to 2.7 (12 images). Don't do section 3 (the real-life characters): Zafar does those himself.
The attachments are in the folder Zafar gave you (Downloads/nani-batch2-attach/ unless he says otherwise). Each prompt's "attach:" line says which files go with it. Always attach style-anchor-v1.png.

For each prompt:
1. Start a fresh ChatGPT chat, except where the prompt says to use an existing chat.
2. Attach exactly the files on its "attach:" line, paste the text of its fenced block exactly as written, and send. Don't reword, shorten or add to the prompt, and never write a prompt of your own. If a prompt can't be sent as written, skip it and say why in the log.
3. When the image arrives, judge it against that prompt's "check:" line, point by point. Also look for: any text or letters; shadows on a magenta or grey background; an item touching or crossing into a neighbour's cell; a background that isn't flat.
4. If it fails, you may redo it ONCE: send the same prompt again in a fresh chat with the same attachments. Don't send corrections like "make the left one smaller". Keep whichever of the two is better, even if both fail, and note the failures in the log.
5. Download the image you keep with ChatGPT's download button (never a screenshot). Make sure you download the NEW image, not one of the files you attached (in batch 1 a relight came back as a copy of the day image). For an edit or relight, compare it with the original: if they look identical, it has failed.
6. Write one log line straight away (see below), then move on to the next prompt.

Keep a log as you go, and paste it in full as your last message. One line per downloaded image:
  <step, e.g. 2.3> | <time> | <the downloaded file's name exactly as the browser saved it> | save as <the "save as:" name> | PASS or FAIL (<which check points failed>) | redo used: yes/no | <notes>
Also log every skipped prompt, every redo, every image limit and anything odd (a refusal, an error, a duplicate download). Number nothing yourself: use the step numbers from the pack, so the log can't drift out of step with the files.

Image limits: if ChatGPT says you've hit the image limit, log the time and ChatGPT's exact message. Wait until the time it gives (or check back about every 30 minutes), then carry on from the same prompt. Don't stop the run and don't switch to another tool.

Don't change anything: no ChatGPT settings, model picker, memory, custom instructions, plan or upgrade offers, no Chrome settings or download folder, no signing in or out, no deleting chats. Don't upload anything except the files on each attach line. If something needs a decision from Zafar, log it, skip that step and carry on.

At the end: paste the full log, then a short list of what passed, what failed and what was skipped.
```

---

## 1. Redos (from batch 1's fails)

Each one is a fresh chat with the style anchor attached, except 1.1, which may go in the worktop chat if it's still there.

### 1.1 The worktop, golden evening

Batch 1's evening download was a byte-for-byte copy of the day image, so this is still to make. The worktop has no window in frame, so the golden-evening prompt is adapted to the sun patch on the marble.

**attach:** style anchor, `bg-cook-worktop-t-v1.png`.

```
Edit the attached worktop image. Same image, same composition, same camera: every vein, edge and surface stays exactly where it is, the same size and shape. Change only the lighting to golden evening: the sun is now a low, warm, orange late-afternoon sun from the upper left. The patch of window sunlight on the upper-left marble becomes longer, stretching towards the lower right, and a deeper golden orange; the rest of the marble is a little dimmer and warmer, with a soft amber cast. The change should be clearly visible next to the original, but still a calm, bright worktop. Do not add, remove or move anything: still completely empty. No text.
```

**save as:** `bg-cook-worktop-t-evening-v1.png`
**check:** flick between it and the day image: clearly warmer and more golden, **not identical** · the veins haven't moved · still straight down and completely empty · no window, lamp or object has appeared.

### 1.2 The onion, whole and peeled

The whole and peeled onions came out as the same picture (no papery skin), and the peeled one was magenta-pink, almost the key colour. This one goes on grey so the onion's purple can't be mistaken for the key.

**attach:** style anchor.

```
Generate an image, 1024×1024, square.

Two red onions for a children's cooking game, side by side, each lying on its own, seen from directly above, straight down (90 degrees), as they'd look lying on a worktop: each onion a circle, about 8 cm across, both the same size.

Layout: an invisible grid of 2 columns and 1 row of equal cells covering the whole image. One onion per cell, centred, with plenty of empty background all round it. Nothing touches or crosses the middle line. Do not draw grid lines, borders or labels.
Left: one whole red onion in its dry, papery, matte copper-purple skin, with a few flaky, lifting edges and a small dry root tuft.
Right: the same onion peeled: no papery skin at all, glossy deep purple with pale streaks between the layers.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, papery onion skin, glossy onion flesh, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No knives, boards, bowls, hands or extra objects.
```

**save as:** `sheet-dungri-t-v2.png`
**slices to (2×1, grey):** `veg-dungri-whole-t` `veg-dungri-peeled-t` (replace batch 1's)
**check:** the two look clearly different: matte, papery and copper-brown on the left, glossy on the right · the peeled one is deep purple, **not hot pink** · both circles, both the same size · flat grey, no shadows.

### 1.3 The velan (rolling pin)

Batch 1 drew a Western rolling pin with handles. The game needs the thin, tapered Gujarati velan.

**attach:** style anchor.

```
Generate an image, 1024×1024, square.

One wooden velan for a children's cooking game: the thin, tapered Gujarati rolling pin, seen from directly above, straight down (90 degrees), lying diagonally from the lower left to the upper right, centred, with plenty of empty background all round it and not touching the image edges.

It is one single piece of smooth pale wood, about 35 cm long: thickest in the middle (about 3.5 cm) and tapering evenly to narrow, rounded ends (about 1.5 cm). NO handles, no separate handle pieces, no grooves, no metal, no ball bearings. Thin, but drawn slightly chunky so it reads at a small size.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, pale oak with a quiet grain, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No dough, flour, board, hands or extra objects.
```

**save as:** `tool-velan-t-v2.png`
**slices to (1×1, grey):** `tool-velan-t` (replace batch 1's)
**check:** no handles · tapers from a thick middle to thin rounded ends · lies diagonally, well inside the frame · straight down, not seen from the side · no shadow.

### 1.4 The chakla (rolling board), top-down

Batch 1's chakla showed its feet below the disc, so it was a three-quarter view, not straight down.

**attach:** style anchor.

```
Generate an image, 1024×1024, square.

One round wooden chakla for a children's cooking game: the round rolling board used for maani and rotli, seen from directly above, straight down (90 degrees), centred, filling about 70% of the image, with empty background all round it.

It is a perfect circle, about 25 cm across, in smooth pale wood with a quiet grain and a softly rounded edge. Only its flat top face is visible: the camera is exactly overhead, so the rounded edge is the same thin width all the way round. NO feet, no legs, no side, no underside visible.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, pale oak with a quiet grain, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No dough, flour, rolling pin, hands or extra objects.
```

**save as:** `tool-chakla-t-v2.png`
**slices to (1×1, grey):** `tool-chakla-t` (replace batch 1's)
**check:** a perfect circle, not an oval · no feet or side showing · the edge is the same width all round · reads as a rolling board, not a plate or a chopping board · no shadow.

### 1.5 The thali, round

Batch 1's thali was 8% oval: the whole vessel sheet's camera was tilted about 20°.

**attach:** style anchor, `sheet-vessels-v1.png` (for the steel finish only, **not** its camera).

```
Generate an image, 1024×1024, square.

One round steel thali for a children's cooking game: a flat round plate with a low raised rim, seen from directly above, straight down (90 degrees), centred, filling about 75% of the image, with empty background all round it. Empty.

It is a perfect circle, about 30 cm across. The camera is exactly overhead, so the rim is the same width all the way round and no outer side of the plate shows. Use the attached vessels sheet only for how the steel looks, not for its camera angle.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left, so the steel reflects soft warm light. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, brushed steel with gentle warm reflections, clean simplified surfaces, slightly chunky rounded shapes, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks, including on the plate. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No food, spoons, hands or extra objects.
```

**save as:** `vessel-thali-t-v2.png`
**slices to (1×1, grey):** `vessel-thali-t` (replace batch 1's)
**check:** a perfect circle (hold a coin or a round cap against the screen if unsure) · the rim is the same width all round · empty, no writing · no shadow.

---

## 2. New sheets

**The slicer's rules** (`build/slice_sheet.py`), as in batch 1's section 3:
- **Items must sit well inside their own cell.** Each whole item goes to the cell holding its centre, but anything touching a neighbour gets merged with it.
- **No shadows at all on magenta**: a shadow on magenta is dark purple, which the key can't remove. The game draws each contact shadow itself. The grey sheets have no shadows either.
- **Magenta for food, grey for steel, glass, wood, tools and anything that glows.** Shiny metal and glass pick up magenta in their reflections.
- **Straight down (90°)** unless the prompt says front view.
- **Fresh chat, fresh sheet.** Never ask for a sheet as an edit of another.

### 2.1 Bajri (millet) maani (magenta)

`cook-bajrmaani` is a required dish and has no art at all. The same stages as the wheat set, in darker grey-brown millet, at exactly the same size so the game can swap them.

**attach:** style anchor, `maani-raw-t.png` (the wheat maani: match its size and circle), `dough-ball-t.png` (the wheat dough ball: match its size).

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 6 dough and flatbread stages for a children's cooking game: bajri maani, a flatbread made from pearl millet (bajri) flour. Seen from directly above, straight down (90 degrees), as they'd look lying on a worktop: round things as circles. Every stage is drawn fresh here so they match each other exactly in colour, lighting and scale.

Colour: millet dough is darker than wheat: a soft grey-brown with a faint olive-grey tint, matte, slightly coarse and grainy, with a few fine cracks at the edges where millet dough splits.

Size: the attached cut-outs are the wheat versions from the same game. Make every bajri maani exactly the same size and shape as the attached wheat maani: a perfect circle about 310 pixels across on this 1536×1024 image, all five maani the same diameter. Make the bajri dough ball the same size as the attached wheat dough ball, about 230 pixels across.

Layout: an invisible grid of 3 columns and 2 rows of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: a smooth, round ball of bajri dough, grey-brown; a rolled-out raw bajri maani, an even grey-brown circle lightly dusted with flour; the same raw maani rolled too thin, with a ragged tear and a crack in it.
Row 2, left to right: the maani half-cooked, a little darker, with a few brown spots; the maani fully cooked and puffed up in the middle, toasty brown spots on grey-brown; a burnt maani, dark brown and black patches.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, soft matte dough, clean simplified surfaces, slightly chunky, no outlines. Home cooking.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No rolling pin, board, tawa, plate, hands or extra objects.
```

**save as:** `sheet-bajr-maani-t-v1.png`
**slices to (3×2, magenta):** `dough-bajr-ball-t` `maani-bajr-raw-t` `maani-bajr-raw-torn-t` `maani-bajr-cooked-half-t` `maani-bajr-cooked-puffed-t` `maani-bajr-burnt-t`
**check:** clearly darker and greyer than the wheat set, not beige · the five maani are the same size and all circles (not ovals), about the wheat maani's size · stages go raw → spotted → puffed → burnt · no shadows, nothing crossing a cell edge.

### 2.2 Hob knob (off and on) and flame rings (grey)

The knob turns and the flames flicker, so both are separate sprites laid over the hob background. The flames glow, so they go on grey (Claude cuts them with the glass method so they stay see-through at the edges).

**attach:** style anchor, `bg-cook-hob-t-v1.png` (so the knob matches the hob and the flames fit its burners).

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 4 parts for the gas hob in the attached image, for a children's cooking game, all seen from directly above, straight down (90 degrees), to go on top of that hob.

Layout: an invisible grid of 2 columns and 2 rows of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left: a hob control knob, OFF. A chunky round knob, about 5 cm across, drawn about 260 pixels across: matte black to match the attached hob, with a thin brushed steel ring round its base and a raised grip bar across its top. A small pointer notch at one end of the grip bar points straight up (12 o'clock).
Row 1, right: exactly the same knob, ON: turned a quarter turn anticlockwise, so the pointer points straight left (9 o'clock), and a thin warm amber glow shows in the steel ring round its base. Nothing else changes.
Row 2, left: a ring of gas flames, HIGH, as seen from above a lit burner: about 24 small flame tongues in an even circle, pointing outwards from an empty round centre. Each tongue is deep blue at its base, fading to pale translucent blue, with a tiny warm yellow tip. The empty centre is the same size as the steel burner crown in the attached hob (so the ring fits round it), about 190 pixels across; the flames reach about 50 pixels out from it.
Row 2, right: the same ring of flames, LOW: the same circle and the same empty centre, the tongues short and small, reaching only about 15 pixels out.

The empty centre of each flame ring is plain background: do not draw the burner, the pan support or the hob.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left. The flames' own glow must not light or tint the grey. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, matte black and brushed steel, soft glowing gas flames, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos, symbols, dials or markings on the knob. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No pans, hob, hands or extra objects.
```

**save as:** `sheet-hob-parts-t-v1.png`
**slices to (2×2, grey; the flame rings with `--glass`):** `hob-knob-off-t` `hob-knob-on-t` `flame-ring-high-t` `flame-ring-low-t`
**check:** the two knobs are the same knob, one turned a quarter to the left · no numbers, flame symbols or writing on the knob · the flame rings are circles with an empty centre the size of the hob's steel crown · the flames are blue with small warm tips (not orange campfire flames) · flat grey, no glow spread on the background.

### 2.3 Chai tray, charcoal grill and a potato cube (grey)

The tray is the Chai tray station's surface. The grill is the Mishkaki grill station's: skewers lie on it side by side, pointing away from the player, so it's a long rectangular jiko-style grill, not a round one. The potato cube is the thread station's decoy piece; it's food, but pale and matte, so it keys cleanly on grey and can share this sheet.

**attach:** style anchor, `sheet-vessels-v1.png` (for the steel finish only, **not** its camera).

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 3 items for a children's cooking game, all seen from directly above, straight down (90 degrees): round things as circles, rectangles as true rectangles. Not to one scale: each item is sized to fill its own cell.

Layout: an invisible grid of 3 columns and 1 row of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Left: an empty round steel serving tray for glasses of chai, about 35 cm across: a flat base with a low raised rim and two small side handles, drawn about 400 pixels across. A perfect circle; the camera is exactly overhead, so the rim is the same width all round. Use the attached vessels sheet only for how the steel looks, not for its camera angle.
Middle: a jiko-style charcoal grill, as used for mishkaki in East Africa: a long rectangular sheet-metal firebox, about 50 cm wide and 28 cm deep, drawn about 440 pixels wide. Across its top, a grill rack of thin steel bars running left to right, evenly spaced. Through the gaps between the bars, a bed of glowing charcoal: black coals with orange-red glowing cracks and a little pale ash. Nothing on the rack.
Right: one single cube of raw peeled potato, about 2 cm, pale creamy yellow, clean cut faces, drawn large (about 140 pixels across) so it reads clearly.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left, so the steel reflects soft warm light. The coals' own glow must not light or tint the grey. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, brushed steel with gentle warm reflections, glowing charcoal, clean simplified surfaces, slightly chunky rounded shapes, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks, including on the tray or grill. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette, bloom, smoke or flames. No glasses, skewers, food (except the potato cube), tongs, hands or extra objects.
```

**save as:** `sheet-tray-grill-t-v1.png`
**slices to (3×1, grey):** `tray-chai-t` `grill-jiko-t` `mishkaki-bataato-raw-t`
**check:** the tray is a circle with an even rim, empty · the grill is a true rectangle seen straight down (no front side showing), bars running left to right, coals glowing between them, nothing on it · the potato cube is a single clean cube · no smoke, no text, flat grey.

### 2.4 Samosa fold stages and an underdone samosa (magenta)

The fold station has four pastry states. Batch 1 made the open, filled strip and the finished folded samosa; these are the two in between, plus a fried samosa that came out too pale. They must match batch 1's so the game can swap them.

**attach:** style anchor, `samosa-filled-t.png` (the filled strip), `samosa-folded-t.png` (the folded samosa), `samosa-fried-golden-t.png` (how a fried one looks).

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 3 samosa stages for a children's cooking game, seen from directly above, straight down (90 degrees), as they'd look lying on a worktop.

These go between the attached cut-outs from the same game: a flat strip of raw pastry with a heap of potato and pea filling at its left end, and the finished folded raw samosa, a neat pale triangle. Match them exactly: the same pale raw pastry, the same strip width, the same filling, and the same size of triangle.

Layout: an invisible grid of 3 columns and 1 row of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Left, fold 1: the attached filled strip after its first fold: the left end, with the filling, is folded diagonally over so the filling is hidden inside a triangle of pastry at the left end; the rest of the strip still lies flat, trailing out to the right. A little filling peeks out at the open edge.
Middle, fold 2: the same, after its second fold: that triangle is folded over once more along the strip, the opposite way, so the triangle has moved further along and only a short flat flap of pastry is left sticking out from one side. The triangle is the same size as the attached folded samosa.
Right: a samosa that was fried too briefly: exactly the same triangle as the attached folded samosa, fried but underdone: pale creamy yellow, faintly glossy with oil, a few small blisters, no golden colour yet. Compare with the attached golden one: same shape, much paler.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, soft matte raw pastry, flaky fried pastry, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No board, plate, oil, hands or extra objects.
```

**save as:** `sheet-samosa-folds-t-v1.png`
**slices to (3×1, magenta):** `samosa-fold-1-t` `samosa-fold-2-t` `samosa-fried-pale-t`
**check:** fold 1 still has a long flat tail, fold 2 a short one · the pastry colour and strip width match the attached strip · the pale samosa is the same triangle as the folded one and clearly paler than the golden one, but cooked (glossy, blistered), not raw · no shadows.

### 2.5 Sheet 2F: pantry vegetables, front view (magenta)

The pantry and the bazaar show items standing on eye-level shelves, so they need the F view: camera at the item's mid-height, looking about 10° down.

**attach:** style anchor.

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 6 whole fresh vegetables for a children's cooking game, as they'd sit on a pantry shelf: each resting on its base, seen from the front, the camera at the item's mid-height looking about 10 degrees down, so the top is just visible.

All at one consistent scale, true to real life relative to each other (a tomato about 7 cm, an onion 8 cm, a potato 8 cm, a garlic bulb 6 cm, a green chilli 8 cm long, a knob of ginger 9 cm long). Small items may be drawn up to one and a half times true size so they stay readable, but the order of sizes never changes.

Layout: an invisible grid of 3 columns and 2 rows of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: a whole red onion in its dry, papery, matte copper-purple skin, standing on its root end, the dry neck pointing up; a whole ripe red tomato with its green stalk on top; a whole garlic bulb, papery white with faint purple streaks, standing on its root.
Row 2, left to right: one fresh green chilli lying on its side, its stalk to the right; a knob of fresh ginger root lying on its side, knobbly and pale golden-brown; a whole brown potato resting on its flattest side.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no shelf, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, glossy tomato skin, papery onion and garlic skin, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No knives, boards, bowls, baskets, hands or extra objects.
```

**save as:** `sheet-veg-whole-f-v1.png`
**slices to (3×2, magenta; the onion with `--keep-purple`):** `veg-dungri-whole-f` `veg-tameto-whole-f` `veg-lasan-whole-f` `veg-marcha-whole-f` `veg-aadu-whole-f` `veg-bataato-whole-f`
**check:** front view with the tops just showing, not straight down and not a steep three-quarter view · the onion has papery copper-brown skin and **isn't pink** (if it is, redo it alone with 1.2's prompt changed to front view) · size order right (garlic smallest) · no shadows.

### 2.6 Pantry containers, front view (grey)

The pantry's items that can't sit on a shelf loose. Each one shows what's inside, since the child has to find it by name: open tins with a heap showing, or clear glass. Salt and sugar come in clearly different containers (they're near twins in their bowls).

**attach:** style anchor, `sheet-vessels-v1.png` (so the steel matches batch 1's jugs).

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 7 kitchen containers for a children's cooking game, as they'd sit on a pantry shelf: each standing on its base, seen from the front, the camera at the item's mid-height looking about 10 degrees down, so the top is just visible. Each one clearly shows what's inside.

Scale: keep them in proportion to each other (the tea tin about 9 cm tall, the jars about 12 to 15 cm, the milk jug about 18 cm). Use the attached vessels sheet for how the steel looks.

Layout: an invisible grid of 4 columns and 2 rows of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. The last cell (row 2, far right) stays empty. Do not draw grid lines, borders or labels.
Row 1, left to right:
- Flour: a tall round steel dabba (canister), its lid off and leaning against its side, soft pale beige wholewheat flour heaped just above the rim.
- Daal: a clear glass jar with a steel screw lid, full of dry yellow split toor daal, clearly visible through the glass.
- Tea: a round tea tin painted deep indigo, with a plain cream band round it (no writing), its lid off and leaning against it, dark loose black tea leaves heaped just above the rim.
- Milk: a clear glass jug with a handle, full of white milk.
Row 2, left to right:
- Sugar: a tall clear glass jar with a pale wooden lid, full of coarse white sugar crystals that sparkle faintly.
- Cardamom: a small clear glass jar with a steel lid, full of green cardamom pods.
- Salt: a small, squat, round white ceramic salt pot with its wooden lid lifted off and leaning against it, fine white salt heaped inside. It must look nothing like the sugar jar.
- (empty)

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no shelf, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left, so the steel and glass reflect soft warm light. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, brushed steel with gentle warm reflections, clear glass, painted tin, glazed ceramic, clean simplified surfaces, slightly chunky rounded shapes, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks, including on the tins, jars and lids. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No spoons, scoops, hands or extra objects.
```

**save as:** `sheet-pantry-containers-f-v1.png`
**slices to (4×2, grey; daal, milk, sugar and cardamom with `--glass`):** `jar-atto-f` `jar-daal-f` `tin-chai-f` `jug-dudh-f` `jar-khun-f` `jar-elchi-f` `jar-loon-f` `-`
**check:** front view, standing level, tops just showing · each one's contents obvious at a glance · sugar and salt look nothing alike · **no writing on any tin or jar** · the last cell empty · flat grey, no shadows.

### 2.7 Chaat layers: toppings as loose scatters (magenta)

The chaat station stacks each topping into the serving bowl as its own layer. Code draws them now; these replace that. Each is a loose, round, top-down scatter the size of the bowl's inside, with no bowl.

**attach:** style anchor, `sheet-toppings-t-v1.png` (the same toppings in their bowls: match their colours), `chaat-bowl-empty-t.png` (the bowl the layers go into: match its inner circle).

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 10 chaat toppings for a children's cooking game, each spread as a loose layer the way it would lie on top of a bowl of chaat, but with NO bowl: seen from directly above, straight down (90 degrees). Each layer is a roughly round scatter, about 250 pixels across on this 1536×1024 image, the size of the inside of the attached empty serving bowl. The pieces are spread in a single, fairly even layer with small gaps between them, so layers stacked on top of each other still let the ones below peek through. Match the colours of the same toppings in the attached bowls sheet.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One scatter per cell, centred, with plenty of empty background all round it; every loose piece stays inside its own cell. Nothing touches or crosses a cell boundary. The last two cells (row 3, the two on the right) stay empty. Do not draw grid lines, borders or labels.
Row 1, left to right: boiled chickpeas (plump, pale golden), scattered; boiled potato cubes (soft, pale yellow), scattered; plain white yoghurt, a thick round pool with soft wavy edges and a gentle swirl; tamarind chutney, glossy dark brown, drizzled in loose zigzag lines about as thick as a pencil across a round area.
Row 2, left to right: green chutney, bright herby green, drizzled in loose zigzag lines the other way; finely chopped red onion, scattered; chopped tomato cubes, scattered; green chilli sliced into thin rings, scattered sparsely.
Row 3, left to right: chopped fresh coriander leaves, scattered; sev (crisp thin golden-yellow gram-flour noodles), a loose, airy sprinkle of short strands; (empty); (empty).

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, appetising, believable food, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No bowls, plates, spoons, hands or extra objects.
```

**save as:** `sheet-chaat-layers-t-v1.png`
**slices to (4×3, magenta; the onion with `--keep-purple`):** `layer-channa-t` `layer-bataato-boiled-t` `layer-dai-t` `layer-amli-t` `layer-lili-t` `layer-dungri-chopped-t` `layer-tameto-chopped-t` `layer-marcha-chopped-t` `layer-dhana-chopped-t` `layer-sev-t` `-` `-`
**check:** ten round scatters about the same size, no bowls · gaps between pieces (except the yoghurt pool) · the two drizzles clearly brown and green · no stray piece drifting into a neighbouring cell · the last two cells empty · no shadows.

---

## 3. Real-life characters (Zafar, with Claude in Chrome)

These use the family's private photos, so Zafar runs them himself today rather than leaving them to the unattended run. **The photos stay in `sources/private/` on Zafar's computer and never go into the repo;** the sheets made from them are fine to share.

### 3.1 The main sheets: use batch 1's prompts

Run these from `docs/chatgpt-art-prompts.md`, as written, one chat per character, in this order:

| Character | Batch 1 section | Then |
|---|---|---|
| Big Ma | **2.2** | 3.2 below, then expressions (batch 1's 2.8) |
| The doctor | **2.3** | 3.2 below, then expressions (batch 1's 2.8) |
| Simba | **2.4** (main sheet, then the poses sheet) | 3.2 below |
| Zazu | **2.5** (main sheet, then the poses sheet) | 3.2 below |

**Changes and the latest notes:**
- **Attach `char-nani-v2.png`** wherever 2.2 and 2.3 say "the approved `char-nani-v1.png`". v2 is the approved Nani.
- **Big Ma always wears a headscarf:** a soft, plain one at home (muted or dark). Batch 1's prompt already says so; check that every panel has it.
- **The doctor is friendly and grandfatherly:** a big, open, laughing smile, never stern. Already in 2.3; reject any sheet where he looks severe.
- **Zazu is drawn as a kitten:** bigger head and eyes, shorter legs, fluffier coat, about 85% of Simba's length. Already in 2.5; reject any sheet where he reads as a small adult cat.

### 3.2 The behind-the-counter view (all four)

Every character who appears at the kitchen island needs a **waist-up view behind the counter, like Nani's approved close-up** (the top-right panel of `char-nani-v2.png`: leaning on a white marble counter, forearms and hands resting on it, facing us with a warm smile). That close-up is her canonical in-game framing, and these should match it so everyone at the island looks like one set.

Send this **in the same chat as the character's main sheet, once Zafar has approved that sheet.**

**attach:** style anchor, that character's approved main sheet (`char-bigma-v1.png`, `char-doctor-v1.png`, `char-simba-v1.png` or `char-zazu-v1.png`), `char-nani-v2.png` (style and framing only).

For Big Ma:

```
Generate an image, 1024×1024, square.

Using the attached Big Ma sheet as the only reference for who she is, make one image of her behind a kitchen counter, framed exactly like the close-up in the top-right panel of the attached Nani sheet: upper body, cut at the waist, front view, facing us, leaning gently on a white marble counter top that runs across the bottom of the image, her forearms and hands resting on it, relaxed, hands close together. A gentle, knowing smile. Use the Nani sheet only for the framing, pose and render style; Big Ma is a different, older and smaller woman.

Keep her exactly as on her sheet: face, thin metal rectangular glasses, her soft plain headscarf in its muted dark colour with a little greying hair at the front, the maroon house dress with the small white paisley print and lace trim, and the thin gold bangles on both wrists, visible on the counter.

Rendered in the style of the attached style anchor and Nani sheet: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. One flat plain light-grey background behind her. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. No objects on the counter. Five fingers on each hand.
```

For the doctor:

```
Generate an image, 1024×1024, square.

Using the attached doctor sheet as the only reference for who he is, make one image of him behind a kitchen counter, framed exactly like the close-up in the top-right panel of the attached Nani sheet: upper body, cut at the waist, front view, facing us, leaning gently on a white marble counter top that runs across the bottom of the image, his forearms and hands resting on it, relaxed, hands close together. His big, open, laughing smile: friendly and grandfatherly, never stern. Use the Nani sheet only for the framing, pose and render style; he is a different person.

Keep him exactly as on his sheet: face, bald head, neatly trimmed white beard, clear-framed glasses, the checked blazer over a white shirt, and the steel wristwatch on his left wrist, visible on the counter.

Rendered in the style of the attached style anchor and Nani sheet: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. One flat plain light-grey background behind him. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No doctor's bag and no objects on the counter. Five fingers on each hand.
```

For Simba:

```
Generate an image, 1024×1024, square.

Using the attached Simba sheet as the only reference for who he is, make one image of him behind a kitchen counter, framed like the close-up in the top-right panel of the attached Nani sheet: a white marble counter top runs across the bottom of the image, and Simba sits up behind it, facing us, his head, chest and front legs above the counter, both front paws resting on the counter's edge, looking at us, content and curious. Use the Nani sheet only for the framing and render style.

Keep him exactly as on his sheet: a big, solid, round-faced, charcoal near-black Russian Blue with a short plush coat, pale mint-green eyes, and the dark collar with one small silver bell, no tags. A full-grown cat at true cat size against the counter.

Rendered in the style of the attached style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. One flat plain light-grey background behind him. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No other animals and no objects on the counter.
```

For Zazu:

```
Generate an image, 1024×1024, square.

Using the attached Zazu sheet as the only reference for who he is, make one image of him behind a kitchen counter, framed like the close-up in the top-right panel of the attached Nani sheet: a white marble counter top runs across the bottom of the image, and Zazu sits up behind it, facing us, stretching up so his head, chest and front legs show above the counter, both front paws resting on the counter's edge, big-eyed and curious. Use the Nani sheet only for the framing and render style.

Keep him exactly as on his sheet: drawn as a KITTEN, with a bigger head and bigger eyes for his body, big ears and a fluffier coat than Simba's; a silver-grey Russian Blue with yellow-green eyes and a plain thin collar, no bell, no tags. He is smaller than Simba, so less of him shows above the counter.

Rendered in the style of the attached style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines. One flat plain light-grey background behind him. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No other animals and no objects on the counter.
```

**save as:** `char-bigma-counter-v1.png`, `char-doctor-counter-v1.png`, `char-simba-counter-v1.png`, `char-zazu-counter-v1.png`
**check:** framed like Nani's close-up (waist up, counter across the bottom, forearms or paws resting on it) · the same character as their approved sheet (Big Ma's headscarf, glasses and bangles; the doctor's beard, glasses and watch; Simba's bell; Zazu's kitten proportions and no bell) · the doctor smiling, not stern · nothing on the counter · five fingers per hand.

**Handing back:** drag the PNGs into the Claude Code chat and say which step they're from (e.g. "3.2, Big Ma, v1"). Claude files the sheets in `sources/art/characters/` and cuts the waist-up crops for the island.
