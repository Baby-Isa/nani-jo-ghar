# ChatGPT art prompts, batch 3 (Cook): the cook characters, then the two gaps batch 2 left

**Started:** 25 Sept 2026. **For:** the Cook with Nani art no pack has ever asked for: the counter moods of the cook characters (the "Characters" item in the "Then" section of `docs/cook-with-nani-todo.md`), then the two items found by `docs/cook-art-audit.md`. **Built from:** `docs/chatgpt-art-prompts-batch2.md` (its format, tips and runner rules all apply here unchanged), `docs/chatgpt-art-prompts.md` (batch 1: section 2.8, the expressions and impatient panels; section 8, the vessels sheet the two items extend), `docs/Nani jo Ghar — Art Bible.md` section 6 (poses and expressions are edits of the sheet; blink and mouth frames are in-place edits) and `build/cut_characters.py` (how the counter crops are cut and lined up).

It works like batch 2. Each prompt is one fenced block: copy it, attach what the **attach:** line says, send. Keep the result only if it passes the **check:** line, then download it and name it as the **save as:** line says. The **cuts to:** and **slices to:** lines are for Claude: which crop or grid, the key colour, and the sprite names.

**Not in this pack (already asked elsewhere):** Big Ma, the doctor, Simba and Zazu, with their behind-the-counter views (batch 2, section 3); the family's feelings and "where it hurts" sheets (batch 3, sections 1 and 7); Nani's standard 12 expressions (batch 1's 2.8, any batch).

---

## 0. Before you start

### 0.1 What's different from batch 2

- **Batch 1's tips (its section 0) and batch 2's slicer rules (its section 2 intro) all still apply** to section 2: attach the style anchor, a fresh chat for each, download the PNG (never a screenshot), regenerate rather than argue.
- **Section 1 is all edits, not new sheets.** Each one edits an approved image in place, so the character changes face or pose without jumping: the game swaps these images over each other in the same spot (`build/cut_characters.py` cuts every mood with the same box as the neutral). So:
  - **Attach only the image being edited. No style anchor:** a second image leaves ChatGPT unsure which one to edit, and the approved image already carries the style.
  - **Always edit the approved original, in a fresh chat,** never an earlier edit, so the moods don't drift from each other.
  - **Compare with the original:** if it looks identical, it has failed; if the head, hands or counter edge have moved or changed size, it has failed too.
- **No private photos in section 1.** Photos are allowed again (Zafar, 25 Sept), but these are edits of an already approved likeness: a photo would pull Nani's face away from the approved drawing, which is exactly the jump the edits are there to avoid. Nana, Ma and Ali are generic (no real person).
- **Section 2 goes on grey** (`#808080`), like the other steel, glass and wood items: no shadows, so the game can add its own contact shadow.

### 0.2 The order

Section 1 first: the characters are on screen in every Cook station, and today three of Nani's four moods are the same image.

| Step | What | Images |
|---|---|---|
| 1.1–1.4 | Nani at the counter: happy, talking, pointing, blink (edits of the `char-nani-v2.png` close-up) | 4 |
| 1.5–1.7 | Nana, Ma and Ali at the counter, happy and talking (edits of their sheets' counter panel) | 3 |
| 1.8–1.10 | Nana, Ma and Ali impatient, with a real "tsk" face (edits of their impatient sheets) | 3 |
| 2.1–2.2 | The chai glass (three-quarter, empty) and the skewer rack | 2 |
| | **Total** | **12** |

### 0.3 Attachments: download these first

Everything below is in the repo. On GitHub, open each file under `https://github.com/Baby-Isa/nani-jo-ghar/blob/main/` and use the **Download raw file** button. Put them all in one folder. Keep the file names as they are.

| File | Used by |
|---|---|
| `sources/art/characters/char-nani-v2.png` | 1.1–1.4 (the image edited) |
| `sources/art/characters/char-nana-v1.png` | 1.5 (the image edited) |
| `sources/art/characters/char-ma-v1.png` | 1.6 (the image edited) |
| `sources/art/characters/char-ali-v1.png` | 1.7 (the image edited) |
| `sources/art/characters/char-nana-impatient-v1.png` | 1.8 (the image edited) |
| `sources/art/characters/char-ma-impatient-v1.png` | 1.9 (the image edited) |
| `sources/art/characters/char-ali-impatient-v1.png` | 1.10 (the image edited) |
| `sources/art/style-anchor-v1.png` | 2.1, 2.2 |
| `sources/art/chatgpt/sheet-vessels-v1.png` | 2.1 (for the steel finish and the existing chai glass's proportions, not its camera), 2.2 (the wood tone) |

### 0.4 Instructions for Claude in Chrome (unattended run)

```
You're running the "Cook" batch-3 art prompts in ChatGPT, on your own. Zafar isn't watching; he'll read your log afterwards.

The prompts: docs/chatgpt-art-prompts-batch3-cook.md, open in another tab. Do 1.1 to 1.10, then 2.1 and 2.2, in that order (12 images).
The attachments are in the folder Zafar gave you. Each prompt's "attach:" line says which files go with it. In section 1 attach ONLY the one image named (no style anchor). In section 2 always attach style-anchor-v1.png.

For each prompt:
1. Start a fresh ChatGPT chat.
2. Attach exactly the files on its "attach:" line, paste the text of its fenced block exactly as written, and send. Don't reword, shorten or add to the prompt, and never write a prompt of your own.
3. When the image arrives, judge it against that prompt's "check:" line, point by point. Also look for: any text or letters; shadows on the grey; a background that isn't flat. For an edit (section 1), compare it with the image you attached: if they look identical, it has failed; if the head, hands or counter have moved or changed size, it has failed.
4. If it fails, you may redo it ONCE: send the same prompt again in a fresh chat with the same attachments. Keep whichever of the two is better, even if both fail, and note the failures in the log.
5. Download the image you keep with ChatGPT's download button (never a screenshot). Make sure you download the NEW image, not the file you attached.
6. Write one log line straight away, then move on.

Keep a log as you go, and paste it in full as your last message. One line per downloaded image:
  <step> | <time> | <the downloaded file's name exactly as the browser saved it> | save as <the "save as:" name> | PASS or FAIL (<which check points failed>) | redo used: yes/no | <notes>

Image limits: if ChatGPT says you've hit the image limit, log the time and its exact message, wait, then carry on. Don't stop the run and don't switch to another tool.

Don't change anything: no ChatGPT settings, model picker, memory, custom instructions, no Chrome settings or download folder. If something needs a decision from Zafar, log it, skip that step and carry on.

At the end: paste the full log, then a short list of what passed, what failed and what was skipped.
```

---

## 1. The cook characters at the counter

The service view shows each character waist up behind the island, and swaps images for their moods: `<who>-neutral`, `-happy` (also used while they talk) and `-impatient`, and Nani's four moods `nani-neutral`, `-happy`, `-talk`, `-point` (`js/cook/stations.js`). Today all four Nani moods are the one v2 close-up, the others' happy face is a head pasted onto the neutral body, and their impatient sheets fold the arms but smile smugly. Every prompt here is an **edit of the approved image**, so Claude can cut the result with exactly the same box as today's crop and nothing jumps when the mood changes.

**The rule for every face here:** warm and readable at a small size. Impatient is a comic "tsk", never angry or scary.

### 1.1 Nani, happy (edit of the v2 close-up)

The close-up in the top-right panel of `char-nani-v2.png` (leaning on the white marble counter) is Nani's canonical in-game framing. The whole sheet is edited, so the close-up keeps its exact place and size on the page.

**attach:** `char-nani-v2.png` only. No style anchor.

```
Edit the attached character sheet. Same image, same size (1536×1024), same layout, same camera: every panel stays exactly where it is, the same size, and everything outside the large close-up in the top-right panel stays exactly as it is.

In the top-right close-up (Nani leaning on the white marble counter), change only her expression to happy: a big, warm, open smile with a little of her top teeth showing, her cheeks lifted and her eyes crinkled and bright behind her glasses, delighted with us. Her head, shoulders, arms and hands stay exactly where they are, the same size and shape, her hands resting on the counter as now; the counter's edge stays at exactly the same height.

Keep her exactly as she is: her face shape, her thin round gold wire-framed glasses, her deep red headscarf, the small mole just above her upper lip on the viewer's left, her beige kurta with gold and deep-red embroidery, her rings and her tennis bracelet, and the same light and render style. Do not add, remove or move anything. No text, letters or watermarks. Five fingers on each hand.
```

**save as:** `char-nani-counter-happy-v1.png`
**cuts to:** `nani-happy`, with `build/cut_characters.py`'s Nani box (the same crop as `nani-neutral`)
**check:** flick between it and `char-nani-v2.png`: the close-up's face is clearly happier, **not identical** · her head, hands and the counter edge haven't moved or changed size · glasses, red headscarf, **mole on the viewer's left**, rings and bracelet unchanged, no bangles · the rest of the sheet unchanged · no text.

### 1.2 Nani, talking (edit of the v2 close-up)

The talking frame: the game bobs this image while her line plays.

**attach:** `char-nani-v2.png` only. No style anchor.

```
Edit the attached character sheet. Same image, same size (1536×1024), same layout, same camera: every panel stays exactly where it is, the same size, and everything outside the large close-up in the top-right panel stays exactly as it is.

In the top-right close-up (Nani leaning on the white marble counter), change only her expression to talking: her mouth half open in the middle of a word, as if telling a child something kind, her eyebrows lifted a little, her eyes warm and smiling and looking at us. Her head, shoulders, arms and hands stay exactly where they are, the same size and shape, her hands resting on the counter as now; the counter's edge stays at exactly the same height.

Keep her exactly as she is: her face shape, her thin round gold wire-framed glasses, her deep red headscarf, the small mole just above her upper lip on the viewer's left, her beige kurta with gold and deep-red embroidery, her rings and her tennis bracelet, and the same light and render style. Do not add, remove or move anything. No text, letters, speech bubbles or watermarks. Five fingers on each hand.
```

**save as:** `char-nani-counter-talk-v1.png`
**cuts to:** `nani-talk`, with the Nani box (the same crop as `nani-neutral`)
**check:** mouth clearly open mid-word, **not identical** to v2, and different from 1.1's big smile · head, hands and counter edge unmoved · glasses, headscarf, mole on the viewer's left unchanged · no speech bubble or text.

### 1.3 Nani, pointing (edit of the v2 close-up)

For "that one!" moments: one hand comes up off the counter to point, the other stays put. The Art Bible's rule: gestures stay above the counter line.

**attach:** `char-nani-v2.png` only. No style anchor.

```
Edit the attached character sheet. Same image, same size (1536×1024), same layout, same camera: every panel stays exactly where it is, the same size, and everything outside the large close-up in the top-right panel stays exactly as it is.

In the top-right close-up (Nani leaning on the white marble counter), change only her pose and expression: she lifts her left hand (the one with the diamond solitaire ring, on the viewer's right) off the counter and raises it beside her shoulder, the index finger pointing upwards and a little towards the viewer's right, as if saying "that one!"; the whole hand stays above the counter and well inside the panel. Her right hand, with the red stone ring and the tennis bracelet, stays resting on the counter exactly where it is. A bright, encouraging smile, looking at us. Her head and shoulders stay exactly where they are, the same size; the counter's edge stays at exactly the same height.

Keep her exactly as she is: her face shape, her thin round gold wire-framed glasses, her deep red headscarf, the small mole just above her upper lip on the viewer's left, her beige kurta with gold and deep-red embroidery and its cuffs, her rings and her tennis bracelet, NO bangles, and the same light and render style. Do not add, remove or move anything else. No text, letters or watermarks. Five fingers on each hand.
```

**save as:** `char-nani-counter-point-v1.png`
**cuts to:** `nani-point`, with the Nani box (the same crop as `nani-neutral`); if the raised hand pokes out of the box, Claude widens it for this one and keeps the head and counter registered
**check:** one hand raised and pointing, above the counter and inside the panel · the other hand still on the counter, bracelet on it · head, shoulders and counter edge unmoved · five fingers on each hand · diamond ring on the pointing hand, red stone ring on the resting one · no bangles, no text.

### 1.4 Nani, blink (edit of the v2 close-up)

The blink frame is laid over the neutral close-up for a split second, so **only the eyes** may change.

**attach:** `char-nani-v2.png` only. No style anchor.

```
Edit the attached character sheet. Same image, same size (1536×1024), same layout, same camera: every panel stays exactly where it is, the same size, and everything outside the large close-up in the top-right panel stays exactly as it is.

In the top-right close-up (Nani leaning on the white marble counter), change only her eyes: both eyes gently closed, as in the middle of a natural blink, the upper eyelids down and the lashes resting, relaxed, not squeezed. Nothing else changes: the same gentle smile, the same mouth, the same head position, size and tilt, the same glasses in the same place, the same hands on the counter.

Keep her exactly as she is: her face shape, her thin round gold wire-framed glasses, her deep red headscarf, the small mole just above her upper lip on the viewer's left, her beige kurta with gold and deep-red embroidery, her rings and her tennis bracelet, and the same light and render style. Do not add, remove or move anything. No text, letters or watermarks.
```

**save as:** `char-nani-counter-blink-v1.png`
**cuts to:** `nani-blink`, with the Nani box (the same crop as `nani-neutral`); only the eye region is used, laid over the neutral
**check:** both eyes closed, relaxed · **everything else the same as v2:** the smile, the mouth, the glasses, the head's position and tilt (flick between the two: only the eyes should change) · mole on the viewer's left · no text.

### 1.5 Nana, happy and talking at the counter (edit of his sheet)

Today's `nana-happy` is the expressions sheet's head pasted onto the neutral body. This is a real pose, edited from the counter panel (top right) of his sheet, so it lands where the neutral does.

**attach:** `char-nana-v1.png` only. No style anchor.

```
Edit the attached character sheet. Same image, same size (1536×1024), same layout, same camera: every panel stays exactly where it is, the same size, and everything outside the panel at the top right (Nana behind the wooden counter) stays exactly as it is.

In that top-right panel, change only his pose and expression to happy and talking: a big, warm smile with his mouth open in the middle of a word, eyebrows lifted, eyes crinkled and twinkling behind his glasses. He lifts one hand off the counter in a friendly, open-palmed gesture in front of his chest, as if telling a happy story; the other hand stays resting on the counter where it is. His head may tilt a little, but it stays in the same place and the same size; his shoulders stay where they are; the counter stays exactly where it is, the same height and size. Every gesture stays above the counter and well inside the panel.

Keep him exactly as he is: his face, his white knitted cap, his round glasses, his white beard, his cream kurta and his brown waistcoat, and their colours, in the same light and render style. Do not add, remove or move anything else. No text, letters or watermarks. Five fingers on each hand.
```

**save as:** `char-nana-counter-happy-v1.png`
**cuts to:** `nana-happy`, with Nana's `game` box in `build/cut_characters.py` (the same crop as `nana-neutral`), replacing the head swap
**check:** clearly happy and mid-word, one hand up in front of his chest, the other on the counter · head in the same place and size, the counter unmoved · cap, glasses, beard, waistcoat unchanged · the rest of the sheet unchanged · five fingers, no text.

### 1.6 Ma, happy and talking at the counter (edit of her sheet)

**attach:** `char-ma-v1.png` only. No style anchor.

```
Edit the attached character sheet. Same image, same size (1536×1024), same layout, same camera: every panel stays exactly where it is, the same size, and everything outside the panel at the top right (Ma leaning on the white marble counter) stays exactly as it is.

In that top-right panel, change only her pose and expression to happy and talking: a bright, chatty smile with her mouth open in the middle of a word, eyebrows lifted, eyes sparkling. She lifts one hand off the counter, palm up in front of her chest, as if explaining something fun; the other hand stays resting on the counter where it is. Her head may tilt a little, but it stays in the same place and the same size; her shoulders stay where they are; the counter stays exactly where it is, the same height and size. Every gesture stays above the counter and well inside the panel.

Keep her exactly as she is: her face; her green dupatta with the small gold motif worn over her head, with a little of her black hair at the front; her gold jhumka earrings; her maroon embroidered kurta; and their colours, in the same light and render style. Do not add, remove or move anything else. No text, letters or watermarks. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-ma-counter-happy-v1.png`
**cuts to:** `ma-happy`, with Ma's `game` box (the same crop as `ma-neutral`), replacing the head swap
**check:** clearly happy and mid-word, one hand up palm-up, the other on the counter · head in the same place and size, the counter unmoved · **dupatta still on her head**, jhumkas, maroon kurta · the rest of the sheet unchanged · five fingers, no text.

### 1.7 Ali, happy and talking at the counter (edit of his sheet)

Ali's files in the game are still named `cousin-*`.

**attach:** `char-ali-v1.png` only. No style anchor.

```
Edit the attached character sheet. Same image, same size (1536×1024), same layout, same camera: every panel stays exactly where it is, the same size, and everything outside the panel at the top right (Ali, a boy of about nine, leaning on the stone counter) stays exactly as it is.

In that top-right panel, change only his pose and expression to happy and talking: a big, cheeky grin with his mouth open in the middle of a word, eyebrows up, eyes bright. He lifts one hand off the counter in a small, excited wave at about shoulder height; the other hand stays resting on the counter where it is. His head may tilt a little, but it stays in the same place and the same size; his shoulders stay where they are; the counter stays exactly where it is, the same height and size. Every gesture stays above the counter and well inside the panel.

Keep him exactly as he is: his face, his tousled black hair, his orange T-shirt with the chest pocket, and their colours, in the same light and render style; still about nine, not older. Do not add, remove or move anything else. No text, letters or watermarks. Five fingers on each hand.
```

**save as:** `char-ali-counter-happy-v1.png`
**cuts to:** `cousin-happy`, with Ali's `game` box (the same crop as `cousin-neutral`), replacing the head swap
**check:** clearly happy and mid-word, one hand waving above the counter, the other on it · head in the same place and size, the counter unmoved · tousled hair, orange T-shirt with pocket, still about nine · the rest of the sheet unchanged · five fingers, no text.

### 1.8 Nana, impatient with a "tsk" (edit of his impatient sheet)

Batch 1's impatient sheets have the pose (arms folded, tapping a foot) but a smug smile. This changes only the face. The game cuts the waist up, lined up by the eyes, so the head must not move.

**attach:** `char-nana-impatient-v1.png` only. No style anchor.

```
Edit the attached image. Same image, same size, same composition, same camera: his whole body, his folded arms, his tapping foot and the background stay exactly as they are, the same size and shape. His head stays exactly where it is, the same size and tilt.

Change only his face to a real, impatient "tsk": eyebrows drawn down and together, eyes looking at us from under slightly lowered lids, lips pressed together and pulled to one side as if clicking his tongue, one cheek pulled in a little. Clearly impatient and a little fed up, like a grandfather who has been waiting for his tea: comic and still friendly, never angry or scary.

Keep him exactly as he is: his face shape, his white knitted cap, his round glasses, his white beard, his cream kurta, his brown waistcoat and his brown shoes, and their colours, in the same light and render style. Do not add, remove or move anything. No text, letters, symbols, steam or watermarks. Five fingers on each hand.
```

**save as:** `char-nana-impatient-v2.png`
**cuts to:** `nana-impatient`, with Nana's `imp` box (the same crop as today's `nana-impatient`)
**check:** flick between it and `char-nana-impatient-v1.png`: the smug smile is gone and he reads as impatient at thumbnail size, **not identical** · still friendly, not angry · head in the same place, size and tilt; arms folded; body unchanged · cap, glasses, beard, waistcoat · no symbols or text.

### 1.9 Ma, impatient with a "tsk" (edit of her impatient sheet)

**attach:** `char-ma-impatient-v1.png` only. No style anchor.

```
Edit the attached image. Same image, same size, same composition, same camera: her whole body, her folded arms, her tapping foot and the background stay exactly as they are, the same size and shape. Her head stays exactly where it is, the same size and tilt.

Change only her face to a real, impatient "tsk": eyebrows drawn down and together, eyes looking at us from under slightly lowered lids, lips pressed together and pulled to one side as if clicking her tongue, one cheek pulled in a little. Clearly impatient and a little fed up, like a mum who has been kept waiting: comic and still friendly, never angry or scary.

Keep her exactly as she is: her face shape; her green dupatta with the small gold motif worn over her head, with a little of her black hair at the front; her gold jhumka earrings; her maroon embroidered kurta and trousers; her embroidered flat shoes; and their colours, in the same light and render style. Do not add, remove or move anything. No text, letters, symbols, steam or watermarks. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-ma-impatient-v2.png`
**cuts to:** `ma-impatient`, with Ma's `imp` box (the same crop as today's `ma-impatient`)
**check:** the smug smile is gone and she reads as impatient at thumbnail size, **not identical** to v1 · still friendly, not angry · head in the same place, size and tilt; arms folded; body unchanged · **dupatta on her head**, jhumkas · no symbols or text.

### 1.10 Ali, impatient with a "tsk" (edit of his impatient sheet)

**attach:** `char-ali-impatient-v1.png` only. No style anchor.

```
Edit the attached image. Same image, same size, same composition, same camera: his whole body, his folded arms, his tapping foot and the background stay exactly as they are, the same size and shape. His head stays exactly where it is, the same size and tilt.

Change only his face to a real, impatient "tsk": eyebrows drawn down and together, eyes rolled up a little and then looking at us, lips pressed together and pushed to one side as if clicking his tongue, one cheek puffed a little. Clearly impatient, a nine-year-old who is bored of waiting: comic and still friendly, never angry or scary.

Keep him exactly as he is: his face shape, his tousled black hair, his orange T-shirt with the chest pocket, his jeans and his trainers, and their colours, in the same light and render style; still about nine, not older. Do not add, remove or move anything. No text, letters, symbols or watermarks. Five fingers on each hand.
```

**save as:** `char-ali-impatient-v2.png`
**cuts to:** `cousin-impatient`, with Ali's `imp` box (the same crop as today's `cousin-impatient`)
**check:** the smug smile is gone and he reads as impatient at thumbnail size, **not identical** to v1 · still friendly, not sulky or angry · head in the same place, size and tilt; arms folded; body unchanged · orange T-shirt with pocket, still about nine · no symbols or text.

---

## 2. The two missing items

### 2.1 The chai glass, fillable (three-quarter, empty)

**Priority 1 — the Chai Tray station.** Batch 1's chai glass (`sheet-vessels-v1.png`, row 3) is a front view, for the glass as a standing icon. The Chai Tray's pour-in-cup mechanic needs the same camera the pan, pot and kadai get on that same sheet: steep enough that the rim is a clean ellipse and a little of the inside wall shows, so the game can rise a liquid fill and draw dashed fill lines inside it without them drifting outside the glass. Right now `js/cook/station-lib.js` draws this camera angle in code every time a cup is laid out on the tray.

**attach:** style anchor, `sheet-vessels-v1.png` (for the steel-rimmed glass's proportions and finish only, **not** its camera).

```
Generate an image, 1024×1024, square.

One small Kutchi/East African "cutting" chai glass for a children's cooking game: a short, narrow, clear glass tumbler with a thin steel rim round the top, completely empty, seen from a steep three-quarter angle from above — steep enough that its rim is a clean, nearly circular ellipse and a little of the clear inside wall shows down into it, the same kind of angle as a pan or pot seen from above with its inside just visible. Centred, filling about 55% of the image height, with plenty of empty background all round it, not touching the edges.

It is about 9 cm tall and 6 cm across, a simple straight-sided tumbler (no handle, no saucer), clear glass with a soft, believable shine and a thin brushed-steel band round the rim. Use the attached vessels sheet only for how the glass and its steel rim look, not for its camera angle.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left, so the glass and steel pick up soft warm highlights. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, clear glass, brushed steel with gentle warm reflections, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No tea, chai, milk, tray, spoon, hands or extra objects.
```

**save as:** `vessel-glass-chai-top-t-v1.png`
**slices to (1×1, grey):** `vessel-glass-chai-top-t`
**check:** the rim reads as an ellipse, not a circle seen edge-on and not a full side view · a little of the clear inside wall shows below the rim, like the pan/pot on the vessels sheet · empty (no liquid) · the same small tumbler shape and steel rim as the vessels sheet's chai glass · flat grey, no shadow, no writing.

### 2.2 The skewer rack (empty, plain)

**Priority 2 — the Mishkaki grill station.** `js/cook/mechanics/grill.js` (`Cook.Skewer`, `drawRack`) draws a wooden rack with notched slots entirely in code; the number of slots changes by level (4 or 5), so a fixed rack with baked-in notches wouldn't line up at every level. This asks for a plain rack instead — a simple wooden stand with a straight top rail and a straight lower rail, no notches drawn — that the game can lay skewers across at any spacing, the same way it already lays the tray, grill and thali sprites under its own foreground objects.

**attach:** style anchor, `sheet-vessels-v1.png` (for the warm-wood finish tone only, **not** its camera).

```
Generate an image, 1536×400, landscape.

One empty wooden skewer rack for a children's cooking game, the kind used to rest raw or cooked mishkaki skewers before grilling: seen from directly above, straight down (90 degrees), a long, plain rectangular wooden stand, centred, filling almost the whole width and about 70% of the height, with a little empty background above and below it, not touching the left or right edges.

It is built from smooth pale wood: a straight top rail and a straight bottom rail, the same length, joined by two short end pieces, like a simple ladder-shaped frame lying flat. The camera is exactly overhead, so both rails are straight lines, parallel to each other and to the top and bottom of the image, with a plain gap of open background between them (skewers will lie across that gap). NO notches, NO grooves, NO carved slots, NO skewers, nothing resting on it: completely plain and empty.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, warm pale wood with a quiet grain, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No skewers, food, charcoal, hands or extra objects.
```

**save as:** `vessel-skewer-rack-t-v1.png`
**slices to (1×1, grey):** `vessel-skewer-rack-t`
**check:** two straight parallel rails, top and bottom, running the full width · no notches, grooves or slots cut into it · nothing resting on it · straight down, not at an angle · flat grey, no shadow, no writing.
