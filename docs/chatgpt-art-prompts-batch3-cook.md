# ChatGPT art prompts, batch 3 (Cook): the two gaps batch 2 left

**Started:** 25 Sept 2026. **For:** the two Cook with Nani items no pack has ever asked for, found by `docs/cook-art-audit.md`. **Built from:** `docs/chatgpt-art-prompts-batch2.md` (its format, tips and runner rules all apply here unchanged), `docs/chatgpt-art-prompts.md` (batch 1, section 8: the vessels sheet these two extend).

It works like batch 2. Each prompt is one fenced block: copy it, attach what the **attach:** line says, send. Keep the result only if it passes the **check:** line, then download it and name it as the **save as:** line says. The **slices to:** line is for Claude: the key colour and the sprite name (both of these are single-item images, not grids).

Both are live stations drawing a placeholder shape in code every time they run (`chai-tray.js`'s cup, `grill.js`'s rack), so they're ordered by that: the Chai Tray is the earlier, more visible station.

---

## 0. Before you start

- Batch 1's tips (its section 0) and batch 2's slicer rules (its section 2 intro) all still apply: attach the style anchor every time, a fresh chat for each, download the PNG (never a screenshot), regenerate rather than argue.
- Both of these go on **grey** (`#808080`), like the other steel/glass/wood items: no shadows, so the game can add its own contact shadow.

### Attachments: download these first

| File | Used by |
|---|---|
| `sources/art/style-anchor-v1.png` | Both prompts |
| `sources/art/chatgpt/sheet-vessels-v1.png` | 1.1 (for the steel finish and the existing chai glass's proportions, not its camera) |

### Instructions for Claude in Chrome (unattended run)

```
You're running the "Cook" batch-3 art prompts in ChatGPT, on your own. Zafar isn't watching; he'll read your log afterwards.

The prompts: docs/chatgpt-art-prompts-batch3-cook.md, open in another tab. Do 1.1 then 1.2, in that order.
The attachments are in the folder Zafar gave you. Each prompt's "attach:" line says which files go with it. Always attach style-anchor-v1.png.

For each prompt:
1. Start a fresh ChatGPT chat.
2. Attach exactly the files on its "attach:" line, paste the text of its fenced block exactly as written, and send. Don't reword, shorten or add to the prompt, and never write a prompt of your own.
3. When the image arrives, judge it against that prompt's "check:" line, point by point. Also look for: any text or letters; shadows on the grey; a background that isn't flat.
4. If it fails, you may redo it ONCE: send the same prompt again in a fresh chat with the same attachments. Keep whichever of the two is better, even if both fail, and note the failures in the log.
5. Download the image you keep with ChatGPT's download button (never a screenshot).
6. Write one log line straight away, then move on.

Keep a log as you go, and paste it in full as your last message. One line per downloaded image:
  <step> | <time> | <the downloaded file's name exactly as the browser saved it> | save as <the "save as:" name> | PASS or FAIL (<which check points failed>) | redo used: yes/no | <notes>

Image limits: if ChatGPT says you've hit the image limit, log the time and its exact message, wait, then carry on. Don't stop the run and don't switch to another tool.

Don't change anything: no ChatGPT settings, model picker, memory, custom instructions, no Chrome settings or download folder. If something needs a decision from Zafar, log it, skip that step and carry on.

At the end: paste the full log, then a short list of what passed, what failed and what was skipped.
```

---

## 1. The two missing items

### 1.1 The chai glass, fillable (three-quarter, empty)

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

### 1.2 The skewer rack (empty, plain)

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
