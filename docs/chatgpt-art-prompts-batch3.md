# ChatGPT art prompts, batch 3: the copy-paste pack

**Started:** 25 Sept 2026. **For:** the third ChatGPT run (tonight, unattended): feelings for the family, the new people the modes share, the shared backgrounds, the clinic's rooms and patients, and the farm animals. **Built from:** `docs/chatgpt-art-prompts-batch2.md` (its format and runner rules), `docs/chatgpt-art-prompts.md` (batch 1: its tips, character prompts and relights still apply), `docs/Nani jo Ghar — Art Bible.md` (the rules win if anything here disagrees), `docs/Nani jo Ghar — Cast.md`, `docs/Nani jo Ghar — Asset Naming Convention.md`, `docs/modes/PIPELINE-BRIEF.md`, the art sections (9) of `docs/modes/*-design.md` and section 4 of `docs/find-it-design.md`, and the layout specs `data/scenes/sofa.json` and `data/scenes/clinic.json`.

It works like batches 1 and 2. Each prompt is one fenced block: copy it, attach what the **attach:** line says, send. Keep the result only if it passes the **check:** line, then download it and name it as the **save as:** line says. The **cuts to:** line is for Claude: the grid it's cut on, the key colour and the sprite names.

**Only art whose design is settled.** Everything here is used by several modes, or is a part of the clinic that every version of it keeps (a waiting room, a room, a counter, patients). Left out until tonight's redesigns land: the healing mini-game close-ups, the pharmacy items, and every mode-specific prop.

---

## 0. Before you start

### 0.1 What's different from batch 2

- **Batch 1's tips (its section 0) all still apply:** attach the style anchor every time, regenerate rather than argue, download the PNG (never a screenshot), hand the PNGs back to Claude.
- **No private photos anywhere.** Every character here is built from an approved sheet in the repo (Nani, Nana, Ma, Ali, Isa) or is a new generic person, so the whole pack runs unattended.
- **Every character and animal sheet is on flat mid-grey `#808080`, with no floor and no shadows** (batch 1's sheets were light grey with soft floor shadows). That lets Claude cut each panel straight out with `build/slice_sheet.py --key grey`, so these sheets are sprite sources, not only references.
- **Some steps continue an earlier chat** (the line-ups, then one sheet per person; the hen, then the chick), and **some attach an image made earlier in the run** (the colour variants and the relights). Their attach lines say so, e.g. "the image you saved for 6.4".
- **New people are generic and provisional.** Their skin comes from the approved family line-up (Zafar's own tone: a warm light tan, never orange), never from a photo. Nothing more is made from them (expressions, poses) until Zafar approves their sheets.
- **Big Ma and the doctor aren't in this pack.** Their feelings and "where it hurts" sheets use the prompts in sections 1 and 7 once their batch 2 sheets are approved (batch 4).

### 0.2 The order, the count and the time

Ordered by what unblocks the most modes, so if the run stops early the most useful images already exist.

| Step | What | Images | Unblocks |
|---|---|---|---|
| 1 | Feelings for the family: Nani, Nana, Ma, Ali, Isa | 5 | Every mode's reactions; the clinic's send-off; Who did it?'s "not me" and "caught" |
| 2 | The older cousin and four guests (a line-up, then a sheet each) | 6 | Find it, Who did it?, Tidy up, Dress up, the clinic, "Knock knock" |
| 3 | Backgrounds: the courtyard, the sitting room | 2 | Courtyard: Find it, Monsoon rush, Snap, Dress up, the clinic in Arc 5. Sitting room: Who did it?, Find it, the hub |
| 4 | Animals: goat, hen, chick | 3 | Monsoon rush, Snap, Find it's chicks, Tidy up, the clinic's hen |
| 5 | The clinic's rooms: waiting room, examination room, pharmacy counter | 3 | Clinic stages 1–3 and the send-off |
| 6 | The clinic's patients: a line-up, five sheets, two colour-variant sheets | 8 | Clinic stage 1 ("bring in the little girl", "the old man in blue") |
| 7 | "Where it hurts": Nani, Nana, Ma, Ali, seated | 4 | Clinic diagnosis (after the answer) and send-off |
| 8 | Relights: the sitting room (evening, night), the courtyard (evening) | 3 | Arc 1's evening and Eid night; Find it's "Nani's day" |
| | **Total** | **34** | |

**Time:** batch 1 averaged about 2½ minutes per image. With about one redo in five (about 42 sends) that's roughly **2 hours of generating**; with ChatGPT's image-limit waits, expect **4 to 6 hours** end to end, so it fits overnight. Everything is free ChatGPT image generation: **nothing in this pack uses the API.**

### 0.3 Attachments: download these first

Everything below is in the repo on `main`. On GitHub, open each file under `https://github.com/Baby-Isa/nani-jo-ghar/blob/main/` (for example `…/blob/main/sources/art/style-anchor-v1.png`) and use the **Download raw file** button. Put them all in one folder, e.g. `Downloads/nani-batch3-attach/`. Keep the file names as they are.

| File | Used by |
|---|---|
| `sources/art/style-anchor-v1.png` | **Every prompt** except the same-chat follow-ups that say otherwise |
| `sources/art/characters/char-nani-v2.png` | 1.1, 7.1 |
| `sources/art/characters/char-nana-v1.png` | 1.2, 7.2 |
| `sources/art/characters/char-nana-expressions-v1.png` | 1.2, 7.2 |
| `sources/art/characters/char-ma-v1.png` | 1.3, 7.3 |
| `sources/art/characters/char-ma-expressions-v1.png` | 1.3, 7.3 |
| `sources/art/characters/char-ali-v1.png` | 1.4, 7.4 |
| `sources/art/characters/char-ali-expressions-v1.png` | 1.4, 7.4 |
| `sources/art/characters/char-isa-v1.png` | 1.5 |
| `sources/art/characters/char-isa-expressions-v1.png` | 1.5 |
| `sources/art/characters/char-family-lineup-v1.png` | 2.1, 6.1 (render style, skin tone and heights) |
| `sources/art/chatgpt/bg-nani-kitchen-e-v1.png` | 3.1, 3.2 (same home), 5.1–5.3 (render style and light only) |
| `sources/art/characters/char-kasuku-v1.png` | 4.1, 4.2 (how an animal sheet looks) |
| `char-simba-v1.png` (**optional**, from batch 2, on Zafar's computer) | 4.1, 4.2: add it to the folder only if Zafar has approved it; the prompts work without it |

Images made during the run (6.4, 6.5, 3.1, 3.2) are attached from wherever the browser saved them; the log says which file each one is.

### 0.4 Instructions for Claude in Chrome (unattended run of the whole pack)

Paste this into Claude in Chrome with ChatGPT open in a tab, the prompt pack open in another tab, and the attachments folder from 0.3 ready.

```
You're running batch 3 of the "Nani jo Ghar" art prompts in ChatGPT, on your own. Zafar isn't watching; he'll read your log afterwards.

The prompts: docs/chatgpt-art-prompts-batch3.md, open in another tab. Do every section, top to bottom: 1.1 to 1.5, 2.1 to 2.6, 3.1 and 3.2, 4.1 to 4.3, 5.1 to 5.3, 6.1 to 6.8, 7.1 to 7.4, then 8.1 to 8.3 (34 images).
The attachments are in the folder Zafar gave you (Downloads/nani-batch3-attach/ unless he says otherwise). Each prompt's "attach:" line says which files go with it. Always attach style-anchor-v1.png unless the attach line says not to. Where an attach line names "the image you saved for" a step, attach that step's downloaded file (your log says which file it is).

For each prompt:
1. Start a fresh ChatGPT chat, except where the prompt says to use an existing chat.
2. Attach exactly the files on its "attach:" line, paste the text of its fenced block exactly as written, and send. Don't reword, shorten or add to the prompt, and never write a prompt of your own. If a prompt can't be sent as written, skip it and say why in the log.
3. When the image arrives, judge it against that prompt's "check:" line, point by point. Also look for: any text or letters; shadows or a floor on a grey background; panels or items touching or crossing into each other; grid lines or panel borders; a background that isn't flat.
4. If it fails, you may redo it ONCE: send the same prompt again in a fresh chat with the same attachments. For a step that runs in an existing chat, redo it in that same chat by sending the same prompt again. Don't send corrections like "make the left one smaller". Keep whichever of the two is better, even if both fail, and note the failures in the log. A step that continues an earlier chat always uses the chat holding the image you KEPT.
5. Download the image you keep with ChatGPT's download button (never a screenshot). Make sure you download the NEW image, not one of the files you attached. For a relight, compare it with the day image: if they look identical, it has failed.
6. Write one log line straight away (see below), then move on to the next prompt.

Keep a log as you go, and paste it in full as your last message. One line per downloaded image:
  <step, e.g. 2.3> | <time> | <the downloaded file's name exactly as the browser saved it> | save as <the "save as:" name> | PASS or FAIL (<which check points failed>) | redo used: yes/no | <notes>
Also log every skipped prompt, every redo, every image limit and anything odd (a refusal, an error, a duplicate download). Number nothing yourself: use the step numbers from the pack, so the log can't drift out of step with the files.

Image limits: if ChatGPT says you've hit the image limit, log the time and ChatGPT's exact message. Wait until the time it gives (or check back about every 30 minutes), then carry on from the same prompt. Don't stop the run and don't switch to another tool.

Don't change anything: no ChatGPT settings, model picker, memory, custom instructions, plan or upgrade offers, no Chrome settings or download folder, no signing in or out, no deleting chats. Don't upload anything except the files on each attach line. If something needs a decision from Zafar, log it, skip that step and carry on.

At the end: paste the full log, then a short list of what passed, what failed and what was skipped.
```

---

## 1. Feelings for the family

One sheet per person, in a fresh chat, twelve head-and-shoulders panels in the same framing as their batch 1 expressions sheet, so the two sheets together are one set of head layers. The words these faces carry are the clinic's send-off (*okay, happy, better, sad, scared*), its patients (poorly, ouch, a sneeze, too hot, too cold), and Who did it?'s suspects ("not me!", caught).

**The rule for every face here:** gentle. A five-year-old should never find a face upsetting: sad without tears (except baby Isa's small ones), scared as "a bit worried", poorly as a mild cold.

### 1.1 Nani

Nani has no expressions sheet yet, so her approved sheet alone is the reference; its close-up (top right) is the framing.

**attach:** style anchor, `char-nani-v2.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Nani character sheet as the only reference for who she is, make a feelings sheet for Nani: her head and shoulders down to mid-chest, front view, facing us, the same size and framing in every panel, like the close-up in the top-right panel of her sheet but without the counter.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One head-and-shoulders per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Row 1, left to right: happy (a warm, open smile, bright eyes); sad (brows raised in the middle, mouth turned down, eyes a little glassy, no tears); scared (eyes wide, brows up and together, shoulders raised a little, a small tight mouth); poorly, with a cold (heavy eyelids, a pink nose, a little pale, a small sorry mouth).
Row 2, left to right: tired (a big yawn, eyes squeezed shut, one hand raised politely near her mouth); better now (relieved, a soft smile, gentle eyes, one hand resting on her chest); ouch (a small comic wince, one eye shut, teeth together); sneezing (eyes squeezed shut, head tipped forward, mouth open mid-sneeze).
Row 3, left to right: too hot (flushed pink cheeks, fanning her face with one hand); too cold (shoulders hunched up, arms hugged in, teeth chattering, a pink nose); "not me!" (brows up, eyes wide and innocent, both palms raised beside her shoulders); caught (a sheepish, guilty grin, eyes sliding sideways).

Keep her exactly as on the sheet: her face; her thin round gold wire-framed glasses; her deep red headscarf wrapped round her head and neck; the small mole just above her upper lip on the viewer's left; her beige kurta with gold and deep-red embroidery and her sheer deep-red dupatta. When a hand shows: a red stone ring on her right hand, a diamond ring on her left hand, a thin diamond tennis bracelet on her right wrist, and NO bangles. Only the expression and the hands change.

Feelings clear and readable at a small size, warm and gentle: a young child should never find a face upsetting. No tears, no sweat drops, no symbols, no motion lines, no stars, hearts or Zzz.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-nani-feelings-v1.png`
**cuts to (4×3, grey):** `nani-feeling-happy` `nani-feeling-sad` `nani-feeling-scared` `nani-feeling-poorly` `nani-feeling-tired` `nani-feeling-better` `nani-feeling-ouch` `nani-feeling-sneeze` `nani-feeling-hot` `nani-feeling-cold` `nani-feeling-notme` `nani-feeling-caught`
**check:** the same Nani in all 12: gold round glasses, red headscarf, **mole on the viewer's left**, no bangles · each feeling reads at thumbnail size and in the right order · nothing upsetting (no tears, no real pain) · flat grey, no shadows, no panel borders, nothing touching.

### 1.2 Nana

**attach:** style anchor, `char-nana-v1.png`, `char-nana-expressions-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Nana character sheet and expressions sheet as the only reference for who he is, make a feelings sheet for Nana: his head and shoulders down to mid-chest, front view, facing us, the same size and framing in every panel as on his expressions sheet.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One head-and-shoulders per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Row 1, left to right: happy (a warm, open smile, bright eyes); sad (brows raised in the middle, mouth turned down, eyes a little glassy, no tears); scared (eyes wide, brows up and together, shoulders raised a little, a small tight mouth); poorly, with a cold (heavy eyelids, a pink nose, a little pale, a small sorry mouth).
Row 2, left to right: tired (a big yawn, eyes squeezed shut, one hand raised politely near his mouth); better now (relieved, a soft smile, gentle eyes, one hand resting on his chest); ouch (a small comic wince, one eye shut, teeth together); sneezing (eyes squeezed shut, head tipped forward, mouth open mid-sneeze).
Row 3, left to right: too hot (flushed pink cheeks, fanning his face with one hand); too cold (shoulders hunched up, arms hugged in, teeth chattering, a pink nose); "not me!" (brows up, eyes wide and innocent, both palms raised beside his shoulders); caught (a sheepish, guilty grin, eyes sliding sideways).

Keep him exactly as on the sheets: his face, his white knitted cap, his round glasses, his white beard, his cream kurta and his brown waistcoat, and their colours. Only the expression and the hands change.

Feelings clear and readable at a small size, warm and gentle: a young child should never find a face upsetting. No tears, no sweat drops, no symbols, no motion lines, no stars, hearts or Zzz.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-nana-feelings-v1.png`
**cuts to (4×3, grey):** `nana-feeling-happy` `nana-feeling-sad` `nana-feeling-scared` `nana-feeling-poorly` `nana-feeling-tired` `nana-feeling-better` `nana-feeling-ouch` `nana-feeling-sneeze` `nana-feeling-hot` `nana-feeling-cold` `nana-feeling-notme` `nana-feeling-caught`
**check:** the same Nana in all 12 (white cap, round glasses, beard, waistcoat), matching his expressions sheet · each feeling reads at thumbnail size and in the right order · nothing upsetting · flat grey, no shadows, no panel borders, nothing touching.

### 1.3 Ma

**attach:** style anchor, `char-ma-v1.png`, `char-ma-expressions-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Ma character sheet and expressions sheet as the only reference for who she is, make a feelings sheet for Ma: her head and shoulders down to mid-chest, front view, facing us, the same size and framing in every panel as on her expressions sheet.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One head-and-shoulders per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Row 1, left to right: happy (a warm, open smile, bright eyes); sad (brows raised in the middle, mouth turned down, eyes a little glassy, no tears); scared (eyes wide, brows up and together, shoulders raised a little, a small tight mouth); poorly, with a cold (heavy eyelids, a pink nose, a little pale, a small sorry mouth).
Row 2, left to right: tired (a big yawn, eyes squeezed shut, one hand raised politely near her mouth); better now (relieved, a soft smile, gentle eyes, one hand resting on her chest); ouch (a small comic wince, one eye shut, teeth together); sneezing (eyes squeezed shut, head tipped forward, mouth open mid-sneeze).
Row 3, left to right: too hot (flushed pink cheeks, fanning her face with one hand); too cold (shoulders hunched up, arms hugged in, teeth chattering, a pink nose); "not me!" (brows up, eyes wide and innocent, both palms raised beside her shoulders); caught (a sheepish, guilty grin, eyes sliding sideways).

Keep her exactly as on the sheets: her face; her green dupatta with the small gold motif worn over her head, with a little of her black hair at the front; her gold jhumka earrings; her maroon embroidered kurta; and their colours. Only the expression and the hands change.

Feelings clear and readable at a small size, warm and gentle: a young child should never find a face upsetting. No tears, no sweat drops, no symbols, no motion lines, no stars, hearts or Zzz.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-ma-feelings-v1.png`
**cuts to (4×3, grey):** `ma-feeling-happy` `ma-feeling-sad` `ma-feeling-scared` `ma-feeling-poorly` `ma-feeling-tired` `ma-feeling-better` `ma-feeling-ouch` `ma-feeling-sneeze` `ma-feeling-hot` `ma-feeling-cold` `ma-feeling-notme` `ma-feeling-caught`
**check:** the same Ma in all 12, **dupatta on her head in every panel**, jhumkas, maroon kurta · each feeling reads at thumbnail size and in the right order · nothing upsetting · flat grey, no shadows, no panel borders, nothing touching.

### 1.4 Ali

**attach:** style anchor, `char-ali-v1.png`, `char-ali-expressions-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Ali character sheet and expressions sheet as the only reference for who he is, make a feelings sheet for Ali, a boy of about nine: his head and shoulders down to mid-chest, front view, facing us, the same size and framing in every panel as on his expressions sheet.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One head-and-shoulders per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Row 1, left to right: happy (a big, open grin, bright eyes); sad (brows raised in the middle, mouth turned down, eyes a little glassy, no tears); scared (eyes wide, brows up and together, shoulders raised a little, a small tight mouth); poorly, with a cold (heavy eyelids, a pink nose, a little pale, a small sorry mouth).
Row 2, left to right: tired (a big yawn, eyes squeezed shut, one hand raised near his mouth); better now (relieved, a soft smile, gentle eyes, one hand resting on his chest); ouch (a small comic wince, one eye shut, teeth together); sneezing (eyes squeezed shut, head tipped forward, mouth open mid-sneeze).
Row 3, left to right: too hot (flushed pink cheeks, fanning his face with one hand); too cold (shoulders hunched up, arms hugged in, teeth chattering, a pink nose); "not me!" (brows up, eyes wide and innocent, both palms raised beside his shoulders); caught (a sheepish, guilty grin, eyes sliding sideways).

Keep him exactly as on the sheets: his face, his tousled black hair, his orange T-shirt with the chest pocket, and their colours. Only the expression and the hands change.

Feelings clear and readable at a small size, warm and gentle: a young child should never find a face upsetting. No tears, no sweat drops, no symbols, no motion lines, no stars, hearts or Zzz.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

**save as:** `char-ali-feelings-v1.png`
**cuts to (4×3, grey):** `ali-feeling-happy` `ali-feeling-sad` `ali-feeling-scared` `ali-feeling-poorly` `ali-feeling-tired` `ali-feeling-better` `ali-feeling-ouch` `ali-feeling-sneeze` `ali-feeling-hot` `ali-feeling-cold` `ali-feeling-notme` `ali-feeling-caught`
**check:** the same Ali in all 12 (tousled hair, orange T-shirt with pocket), still about nine, not older · each feeling reads at thumbnail size and in the right order · nothing upsetting · flat grey, no shadows, **no white grid lines** (his batch 1 sheet had them), nothing touching.

### 1.5 Isa (baby)

The same twelve feelings, as a baby of about one shows them. Crying is allowed here, but small.

**attach:** style anchor, `char-isa-v1.png`, `char-isa-expressions-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Isa character sheet and expressions sheet as the only reference for who he is, make a feelings sheet for baby Isa, about one year old: his head and shoulders down to mid-chest, front view, facing us, the same size and framing in every panel as on his expressions sheet.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One head-and-shoulders per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Row 1, left to right: happy (a big gummy giggle, eyes crinkled); sad (crying a little: mouth open, brows up, two small tears on his cheeks, cute, not distressing); scared (eyes wide, bottom lip wobbling); poorly, with a cold (droopy eyelids, a pink nose, a small sorry mouth).
Row 2, left to right: tired (a big baby yawn, rubbing one eye with a little fist); better now (calm and content, a soft smile, gentle eyes); ouch (a small startled wince, one eye shut); sneezing (a tiny sneeze, eyes squeezed shut, head tipped forward).
Row 3, left to right: too hot (flushed pink cheeks, a little grumpy pout); too cold (shoulders hunched up, hands tucked in, a pink nose); "not me!" (huge innocent eyes looking up, both little hands open); caught (a cheeky grin, one hand at his mouth).

Keep him exactly as on the sheets: his face, his round cheeks, his tuft of tousled black hair, his soft pale yellow cotton romper, and their colours. Only the expression and the hands change.

Feelings clear and readable at a small size, warm and gentle: a young child should never find a face upsetting. No tears except the two small ones in "sad", no sweat drops, no symbols, no motion lines, no stars, hearts or Zzz.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No dummy, bottle, toys or objects. Five fingers on each hand.
```

**save as:** `char-isa-feelings-v1.png`
**cuts to (4×3, grey):** `isa-feeling-happy` `isa-feeling-sad` `isa-feeling-scared` `isa-feeling-poorly` `isa-feeling-tired` `isa-feeling-better` `isa-feeling-ouch` `isa-feeling-sneeze` `isa-feeling-hot` `isa-feeling-cold` `isa-feeling-notme` `isa-feeling-caught`
**check:** the same baby in all 12 (yellow romper, tuft of hair), still about one · crying is small and cute, not wailing · each feeling reads at thumbnail size and in the right order · flat grey, no shadows, no panel borders, nothing touching.

---

## 2. The older cousin and the guests

Five new generic people who turn up in five modes: **the older cousin** (always losing things; his cap is Find it's lost item and Dress up's cameo; the role-reversal partner in Who did it? and Tidy up) and **four guests** (two aunties, two uncles: "Knock knock", the dastarkhwan, Who did it?'s line-ups, Dress up's clients). They're designed to differ in exactly the features Who did it? asks about: headscarf colour, glasses, cap, beard, moustache.

First a line-up, so they match each other and the family; then, **in the same chat**, one sheet each. The sheets add a seated panel (patients and guests sit) and a waist-up panel (the game crop behind a counter, bench or sofa).

### 2.1 The line-up

**attach:** style anchor, `char-family-lineup-v1.png`.

```
Generate an image, 1536×1024, landscape.

A line-up of five new characters for a children's game, standing side by side, full body, front view, neutral friendly poses, rendered in exactly the style of the attached family line-up (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). They are relatives and family friends of the family in the attached line-up, but new, different people: do not copy any of their faces.

Skin: the same range as the attached family: a warm light tan, a little more brown than beige, rendered warm and unsaturated, never orange; each person a little lighter or deeper, warmer or cooler, so they read as one community but five different people.

Stylised faces: large expressive eyes, soft rounded forms, simple mouths, smooth skin. Modern, warm, appealing; never a caricature. Modest clothes: long sleeves, loose, nothing tight.

Left to right:
1. The older cousin, a boy of about fourteen: tall and slim, about a head taller than the boy Ali in the attached line-up; messy black hair; a friendly, slightly dozy grin; a plain mustard-yellow baseball cap with no logo, worn a little crooked; an open navy-blue zip hoodie over a plain white T-shirt; dark grey joggers; white trainers, one lace undone.
2. An auntie in her fifties, warm and chatty, a little plump: a teal headscarf wrapped neatly round her head and neck, covering her hair; small gold stud earrings; no glasses; a soft peach long kurta with a simple white block-print border at the hem and cuffs; cream trousers.
3. An auntie in her forties, tall and elegant: a dusty-pink dupatta draped over her head, covering her hair; oval tortoiseshell glasses; a long plum-purple kurta with a small white floral print; a thin gold chain bracelet.
4. An uncle in his sixties, stocky and jolly: a round, flat-topped black East African cap (a kofia) with fine white embroidery; a short, neat salt-and-pepper beard; no glasses; a plain sky-blue kurta and white trousers.
5. An uncle in his forties, tall and thin: no cap; thick black hair greying at the temples; a black moustache and a clean-shaven chin; rectangular black glasses; a white shirt under a bottle-green V-neck sweater; dark trousers.

Realistic relative heights: the tall uncle (5) tallest; the cousin (1) about the aunties' height; the stocky uncle (4) a little shorter than the tall uncle.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind. The five stand apart, not touching.

Do not add any text, letters, numbers, labels, logos or watermarks, including on the cap and clothes. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-guests-lineup-v1.png`
**check:** five clearly different people, none a copy of Nana, Ma or Ali · the cousin clearly a teenager, taller than Ali would be, cap with **no logo** · both aunties' hair covered · the features differ as written (teal vs pink scarf; glasses on auntie 3 and uncle 5 only; cap and beard on uncle 4 only; moustache on uncle 5) · skin warm light tan, not orange · flat grey, no shadows.

### 2.2 to 2.6 One sheet each (same chat as the line-up)

Send these **in the chat holding the line-up you kept**, one after another. **attach:** nothing (the line-up is already in the chat).

2.2, the older cousin (with an extra panel for the day he loses his cap):

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the older cousin, the boy on the far left, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, hair, cap, clothes and colours as in the line-up; keep him tall and slim.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent, feet flat, hands resting on his thighs; upper body cut at the waist, front view, facing us, a friendly grin; his head and shoulders WITHOUT his cap, his hair squashed flat on top where the cap was, a sheepish grin; a strip of flat colour swatches: skin, hair, eyes, cap, hoodie, T-shirt, joggers.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

2.3, the auntie in the teal headscarf:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the auntie in the teal headscarf, second from the left, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, headscarf, earrings, clothes and colours as in the line-up; her hair covered in every panel.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent, feet flat, hands resting on her lap; upper body cut at the waist, front view, facing us, a warm smile; a strip of flat colour swatches: skin, eyes, headscarf, kurta, print, trousers.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

2.4, the auntie in the pink dupatta:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the auntie in the dusty-pink dupatta and glasses, in the middle, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, dupatta, glasses, bracelet, clothes and colours as in the line-up; her hair covered in every panel.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent, feet flat, hands resting on her lap; upper body cut at the waist, front view, facing us, a warm smile; a strip of flat colour swatches: skin, eyes, dupatta, glasses frame, kurta, print.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

2.5, the uncle in the black cap:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the stocky uncle in the black embroidered cap, second from the right, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, cap, beard, clothes and colours as in the line-up.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent, feet flat, hands resting on his thighs; upper body cut at the waist, front view, facing us, a jolly smile; a close-up of his cap's embroidery; a strip of flat colour swatches: skin, eyes, beard, cap, kurta, trousers.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

2.6, the tall uncle with glasses:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the tall, thin uncle with the moustache and glasses, on the far right, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, hair, moustache, glasses, clothes and colours as in the line-up.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent, feet flat, hands resting on his thighs; upper body cut at the waist, front view, facing us, a friendly smile; a strip of flat colour swatches: skin, eyes, hair, glasses frame, shirt, sweater, trousers.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

**save as:** `char-older-cousin-v1.png`, `char-guest-aunt-teal-v1.png`, `char-guest-aunt-pink-v1.png`, `char-guest-uncle-kofia-v1.png`, `char-guest-uncle-glasses-v1.png`
**cuts to:** filed in `sources/art/characters/`, not cut yet. Once Zafar approves a sheet, Claude cuts its seated and waist-up panels (grey key), plus the cousin's cap-less head.
**check:** each matches its person in the line-up exactly (face, clothes, colours) and stays the same in every panel · the aunties' hair covered in every panel, including the back view · the cousin's cap-less panel is the same boy · the seated pose has **no bench or chair drawn** · five fingers · flat grey, no shadows, no text.

---

## 3. Shared backgrounds

**The layers rule (batch 1, section 4):** a background has no characters, no animals and nothing that moves or gets tapped. Those are separate sprites placed by the game. The game stage is 16:9 and ChatGPT's widest size is 3:2, so every prompt keeps the important content in a central band and Claude crops the top and bottom strips. At most one or two cultural nods per scene.

The heights below are measured on the whole 1536×1024 image, and come from the layout specs (`data/scenes/sofa.json` for the sitting room), so the painted room lines up with the game's slots.

### 3.1 The courtyard, eye level (from the veranda)

Nani's yard: Find it's chicks and "Nani's day", Monsoon rush's forecast, washing line and shed, Dress up's walk-out, Snap's home scene, the clinic's Arc 5 table under the neem tree. The veranda roof edge across the top hides the sky, as Monsoon rush needs (the weather comes in code, and the sky must never give it away). This is the **one-screen** view; Find it's two-screen pan waits for its scene spec (`data/scenes/courtyard.json` doesn't exist yet) and can grow from this image.

**attach:** style anchor, `bg-nani-kitchen-e-v1.png` (the same family home).

```
Generate an image, 1536×1024, landscape.

The background for an outdoor scene in a children's game: the courtyard of Nani's house, the same family home and style as the attached kitchen, seen from the shaded veranda at a standing adult's eye height, looking straight out across the courtyard (one-point perspective, verticals vertical, the horizon at about 55% of the image height). A home in Kutch with East African touches: modern, calm and clean, not rustic clutter. The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- Across the whole top of the image, down to about 16% of its height: the underside and front edge of the veranda roof, with a plain pale wooden fascia board whose lower edge is straight and level. It hides the sky completely: no sky anywhere in the image.
- Two slim, plain wooden veranda posts stand at the far left and far right edges, from the bottom of the image up to the roof.
- The far side of the courtyard is a tall whitewashed wall in the sun, rising up behind the roof edge. In it, left of centre, a closed wooden double gate painted a soft, faded blue (the one cultural nod).
- Far left: a small whitewashed store shed with a flat roof and an open doorway with a plain dark inside, no door. Beside it, towards the centre: a low wooden hen coop with a wire-mesh front and a small open doorway at its base with a little wooden ramp, no door, empty inside.
- Right of the gate, against the far wall: a large round terracotta water pot on a low stand.
- Across the middle distance: a plain rope washing line strung between two simple wooden posts, empty: no clothes, no pegs.
- Centre right, in the middle distance: a charpai (a woven rope bed on four wooden legs), its long side facing us, completely empty.
- Far right, in the middle distance: the trunk of a large neem tree, rising up out of the frame behind the roof edge.
- The ground is smooth, pale, packed earth, even and calm, with no puddles. The lower 20% of the image is plain, clear ground with nothing on it.

Completely empty of anything that moves or can be picked up: no animals, chickens, people, clothes, buckets, pots (other than the one fixed water pot), tools, toys, fallen leaves, puddles, potted plants, lanterns or decorations.

Style: match the attached style anchor and kitchen exactly: a stylised 3D animated-feature-film look, soft global illumination, believable whitewash, wood, rope, terracotta and earth, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right. Bright, warm and calm; nothing cluttered.

Do not add any text, letters, numbers, logos or watermarks, including on the gate. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-courtyard-e-v1.png`
**cuts to:** not sliced; Claude crops to 16:9 and cuts the occluders: the roof edge, the two posts, the charpai front, the coop front.
**check:** **no sky showing anywhere** · the roof edge straight and level across the top · every anchor present: gate, shed with an open doorway, coop, water pot, washing line (empty), charpai (empty), tree trunk · no animals, clothes, buckets or puddles · lower fifth clear ground · light from the upper left.

### 3.2 Nani's sitting room, eye level (the sofa view)

Who did it?'s line-up: suspects stand behind the sofa and rest their hands on its back, which is the occluder they sit down behind (`data/scenes/sofa.json`: the sofa back's top edge at 62% of the stage, the sofa from 12% to 94% of the width, Nani on the far left, a side table on the far right). The same view is the sofa screen of Find it's sitting room and the hub's "Nani's mysteries". Find it's wider 1.5-screen pan and Tidy up's high-angle dastarkhwan view wait for their own specs.

**attach:** style anchor, `bg-nani-kitchen-e-v1.png` (the same family home).

```
Generate an image, 1536×1024, landscape.

The background for a scene in a children's game: Nani's sitting room, in the same family home and style as the attached kitchen: a bright, modern, comfortable room with gentle Kutch accents, seen from a standing adult's eye height, looking straight ahead (one-point perspective, verticals vertical, the horizon at about 55% of the image height). The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- A long, low sofa stands across the middle of the room, facing us, stretching from about 12% to about 94% of the image width. Plain, soft indigo-blue upholstery with no pattern. Its back has a straight, even, padded top edge running nearly horizontal at about 60% of the image height from the top, with a low rounded arm at each end. Its seat cushions are plain and completely empty. There is about a metre of clear floor between the sofa and the back wall (people will stand there, behind the sofa).
- The back wall is warm limewash cream. Everything above the sofa, from about 15% to 60% of the image height and from 18% to 90% of the width, is plain, calm, evenly lit wall with nothing on it (people's heads go there). Keep it free of anything red.
- Upper left: a window with soft late-morning sun coming in, no curtain. The far-left strip of the image below the window, left of the sofa, is plain wall and floor (a person will stand there).
- Far right, beyond the sofa's arm: a small, plain wooden side table, its top empty. As the one cultural nod, a small mirror-work (abhla) frame high on the wall above it, empty inside.
- The floor is warm, pale polished stone. In front of the sofa, a plain rug in soft sage green with a simple narrow border. The floor and rug in front of the sofa are clear.

Completely empty of anything that moves or can be picked up: no cushions, throws, bolsters, books, cups, plates, sweets, toys, plants, lamps, clocks, curtains or decorations other than the one frame. No people, no animals.

Style: match the attached style anchor and kitchen exactly: a stylised 3D animated-feature-film look, soft global illumination, believable fabric, wood, stone and limewash, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right. Bright, warm and calm; nothing cluttered.

Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-sitting-room-e-v1.png` (the old storybook `bg-sitting-room-v1.png` stays as it is until Tidy up decides its view)
**cuts to:** not sliced; Claude crops to 16:9 and cuts the whole sofa as the occluder.
**check:** the sofa back's top edge straight, level, at about 60% down, and the sofa nearly the full width · the wall above it plain, with nothing red · **no loose cushions or throws** on the sofa · side table empty · one mirror-work frame only · no people or cats.

---

## 4. Animals

Three farm animals in the style of the cats' and Kasuku's sheets (turnaround, then the poses the modes need, then swatches), on flat mid-grey with no shadows so Claude can cut the poses straight out. The poses are the ones the designs ask for: Monsoon rush (stand, hop, flap; shooed into the shed), Snap (walking, eating, jumping, "the goat that's eating"), Find it's chicks, and the clinic's hen on the table. Coats are kept plain so the game can tint them in code (a brown goat, a white hen).

### 4.1 The goat

**attach:** style anchor, `char-kasuku-v1.png`, and `char-simba-v1.png` if it's in the folder.

```
Generate an image, 1536×1024, landscape.

A character sheet for an animal in a children's game: a goat, rendered in the style of the attached style anchor and exactly like the attached animal character sheet or sheets (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). Appealing and expressive like a film animal, but still clearly a real goat, not a cartoon.

Her fixed look, identical in every pose: a small, friendly nanny goat of the kind kept in villages in Kutch and East Africa; a short, smooth coat in plain creamy white with no patches or markings; long floppy ears hanging down; small curved horns; a little beard; amber eyes; dark hooves. A full-grown goat.

Layout: separate poses with clear space between them, all at the same scale; nothing touches anything else. Do not draw panel borders, grid lines or labels.
Top row: turnaround, standing: front, three-quarter, side (facing right), back.
Bottom row: walking (side view, facing right); grazing, head down to the ground as if eating (side view, facing right; no grass drawn); jumping, all four hooves off the ground, a happy hop (side view, facing right); lying down with her legs tucked under; bleating, head up, mouth open.
Also a small strip of flat colour swatches: coat, inner ear, horns, eyes, hooves.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no ground, no grass, no gradient, no texture. NO shadows of any kind.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No other animals, no collar, no rope, no bell, no objects.
```

**save as:** `char-goat-v1.png`
**cuts to (grey):** Claude cuts the nine poses by hand: `goat-front` `goat-three-quarter` `goat-side` `goat-back` `goat-walk` `goat-graze` `goat-jump` `goat-lie` `goat-bleat`
**check:** clearly a goat (floppy ears, small horns, beard), plain white coat, **no patches** · the same goat and the same scale in every pose · the jump has all four hooves off the ground · no grass, rope or collar · flat grey, no shadows or floor.

### 4.2 The hen

**attach:** style anchor, `char-kasuku-v1.png`, and `char-simba-v1.png` if it's in the folder.

```
Generate an image, 1536×1024, landscape.

A character sheet for an animal in a children's game: a hen, rendered in the style of the attached style anchor and exactly like the attached animal character sheet or sheets (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). Appealing and expressive like a film animal, but still clearly a real hen, not a cartoon.

Her fixed look, identical in every pose: a plump, friendly farmyard hen with warm reddish-brown feathers, slightly darker at the tail and wing tips; a small red comb and wattles; a short yellow beak; bright amber eyes; yellow legs and feet.

Layout: separate poses with clear space between them, all at the same scale; nothing touches anything else. Do not draw panel borders, grid lines or labels.
Top row: turnaround, standing: front, three-quarter, side (facing right), back.
Bottom row: walking (side view, facing right, one foot lifted); pecking the ground, head down (side view, facing right); startled and flapping, wings raised and spread, feet just off the ground; sitting fluffed up with her legs hidden, like a hen on a nest (no nest drawn); clucking, head up, beak open.
Also a small strip of flat colour swatches: feathers, dark feathers, comb, beak, legs.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no ground, no straw, no gradient, no texture. NO shadows of any kind.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No other animals, no eggs, no nest, no objects.
```

**save as:** `char-hen-v1.png`
**cuts to (grey):** Claude cuts the nine poses by hand: `hen-front` `hen-three-quarter` `hen-side` `hen-back` `hen-walk` `hen-peck` `hen-flap` `hen-sit` `hen-cluck`
**check:** clearly a hen, reddish-brown, red comb · the same hen and scale in every pose · the flap has both wings spread · no eggs, nest or straw · flat grey, no shadows.

### 4.3 The chick (same chat as the hen)

Send this **in the chat holding the hen sheet you kept**. **attach:** nothing.

```
Using the hen sheet above (the image you made in this chat) for the style and scale, make a second sheet, 1536×1024, landscape, on the same perfectly flat mid-grey #808080 background with no shadows and no floor, in exactly the same style: her chick.

The chick's fixed look, identical in every pose: a fluffy, round, pale lemon-yellow chick a few days old, soft downy feathers, a tiny orange beak, small shiny black eyes with a highlight, little orange legs.

Layout: separate poses with clear space between them; nothing touches anything else. Draw the chick poses large, all at the same scale as each other. Do not draw panel borders, grid lines or labels.
Top row: turnaround, standing: front, three-quarter, side (facing right), back.
Bottom row: running (side view, facing right, legs mid-stride); pecking the ground (side view, facing right); hopping, both feet off the ground; sitting fluffed up into a round ball, legs hidden; cheeping, head up, beak open.
Far right, as its own panel: the hen from the sheet above, standing side-on, with one chick standing beside her at true scale (the chick about a quarter of the hen's height), to show their size difference.
Also a small strip of flat colour swatches: down, beak, legs, eyes.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No other animals, eggs, nest or objects.
```

**save as:** `char-chick-v1.png`
**cuts to (grey):** Claude cuts the nine chick poses by hand: `chick-front` `chick-three-quarter` `chick-side` `chick-back` `chick-run` `chick-peck` `chick-hop` `chick-sit` `chick-cheep` (the size panel is kept as a reference, not cut)
**check:** a baby chick, round and fluffy, pale yellow · the same chick in every pose · the size panel shows the hen from 4.2 with a much smaller chick · flat grey, no shadows.

---

## 5. The clinic's rooms

The clinic's pipeline (`docs/modes/PIPELINE-BRIEF.md`): **waiting room** (the doctor says "bring in the little girl"; the child taps the right person) → **the examination room** (diagnosis on the patient, seated on the bench) → **the pharmacy counter** (a conveyor belt carries items past; the child grabs the ones asked for) → healing → **the send-off** (in the examination room, so it needs no background of its own). The healing close-ups are left out: they're being redesigned tonight.

The clinic is the doctor's own, down the lane: a small, bright, friendly place in an East African town, calm and modern like the family home, with one Kutch nod per room. Weather (the monsoon rain on the window) is added in code, so the windows show a plain soft sky. No red crosses or medical symbols anywhere: they read as text-like signs, and the Red Cross emblem is protected.

### 5.1 The waiting room, eye level

The waiting patients are shown **from the waist up behind a rail**, like everyone else behind the kitchen island (the clinic design's section 9.1), so the waiting-room crops from section 6 drop straight in.

**attach:** style anchor, `bg-nani-kitchen-e-v1.png` (render style and light only, not the setting).

```
Generate an image, 1536×1024, landscape.

The background for a scene in a children's game: the waiting room of a friendly family doctor's small clinic in a town in East Africa, bright, calm, clean and modern, with one gentle Kutch accent. Rendered in the style and light of the attached kitchen (use it only for how things are rendered and lit, not for the room). Seen from a standing adult's eye height, looking straight ahead at the back wall (one-point perspective, verticals vertical, the horizon at about 55% of the image height). The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- Across the whole width of the lower part of the image, from the left edge to the right edge: a waist-high wooden partition of pale oak slats with a flat, smooth top rail. The top rail is straight and nearly horizontal at about 62% of the image height from the top. Waiting patients will be shown sitting just behind it, seen from the waist up, so the rail must be clean, straight and unbroken. (The bench they sit on is hidden behind the partition.)
- The back wall: pale sage green up to about the height of the rail, warm cream above. Everything above the partition, from about 15% to 62% of the image height and from 8% to 88% of the width, is plain, calm, evenly lit wall with nothing on it (people's heads go there). Keep it free of anything red.
- Far left, high up: a small window with a carved wooden jali lattice (the one cultural nod), soft late-morning sun coming through it.
- Far right, from about 88% of the width to the right edge: a plain sage-green door, closed, with a brass handle (it leads to the doctor's room).
- The floor below the partition is pale, smooth terrazzo.

Completely empty of anything that moves or can be picked up: no chairs in front of the partition, no magazines, toys, cushions, plants, posters, charts, signs, clocks, bins, water dispensers or curtains. No people, no animals.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable wood, plaster and terrazzo, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right. Bright, warm and calm; nothing cluttered.

Do not add any text, letters, numbers, logos, signs, red crosses or medical symbols. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-clinic-waiting-e-v1.png`
**cuts to:** not sliced; Claude crops to 16:9 and cuts the partition as the occluder.
**check:** the partition's top rail straight, level and unbroken across the whole width, at about 62% down · the wall above it plain from edge to edge except the window (far left) and the door (far right) · **no posters, signs or crosses** · no chairs, plants or people.

### 5.2 The examination room, eye level

Laid out to `data/scenes/clinic.json`: the patient sits on the bench left of centre, full body, facing us, feet on the floor (so knees and feet can be checked); the doctor stands on the right; the instrument tray is a column on the far left; things are placed on the floor at the lower right.

**attach:** style anchor, `bg-nani-kitchen-e-v1.png` (render style and light only, not the setting).

```
Generate an image, 1536×1024, landscape.

The background for a scene in a children's game: the examination room of a friendly family doctor's small clinic in a town in East Africa, bright, calm, clean and modern, with one gentle Kutch accent. Rendered in the style and light of the attached kitchen (use it only for how things are rendered and lit, not for the room). Seen from a standing adult's eye height, looking straight ahead at the back wall (one-point perspective, verticals vertical, the horizon at about 55% of the image height). The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- Left of centre, from about 27% to about 53% of the image width: a low padded examination bench standing against the back wall, its long side facing us. Its flat padded top is at about 60% of the image height from the top, the pad soft pale mint green, on plain pale oak legs; no pillow, no paper roll, nothing on it. A person will sit on its front edge facing us with their feet on the floor, so the floor in front of it is clear, and the wall above it is plain.
- The back wall: pale sage green up to about the height of the bench top, warm cream above.
- The right part of the image, from about 70% of the width to the right edge: plain, calm cream wall from the top down to about the middle of the image (the doctor stands there), and plain, clear floor below it (things will be placed there).
- The far-left strip, up to about 20% of the width: plain wall and floor (a tray of instruments goes there). High in the upper left: a window with soft late-morning sun and a plain, pale sky, no curtain.
- High on the wall between the bench and the right part, as the one cultural nod: a small framed piece of Kutch mirror-work (abhla) embroidery.
- The floor is pale, smooth terrazzo.

Completely empty of anything that moves or can be picked up: no instruments, stethoscope, bottles, jars, boxes, trolleys, desks, chairs, charts, posters, signs, plants, toys, cushions, bins, clocks or curtains. No people, no animals.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable padding, wood, plaster and terrazzo, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right. Bright, warm and calm; nothing cluttered.

Do not add any text, letters, numbers, logos, signs, eye charts, red crosses or medical symbols. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-clinic-room-e-v1.png`
**cuts to:** not sliced; Claude crops to 16:9 (the bench is baked; it never moves).
**check:** the bench left of centre, long side to us, top level at about 60% down, empty · the right third plain wall above, clear floor below · the far-left strip plain · **no eye chart, poster, sign or cross** · one mirror-work frame only · no people.

### 5.3 The pharmacy counter, eye level (the belt empty)

The belt is painted empty: the items ride on it as separate sprites, made later once the pharmacy's list is settled. The belt comes out of a hatch and goes into another, so items never pop into view; its evenly spaced seams let Claude cut a strip the code can scroll.

**attach:** style anchor, `bg-nani-kitchen-e-v1.png` (render style and light only, not the setting).

```
Generate an image, 1536×1024, landscape.

The background for a scene in a children's game: the pharmacy counter of a friendly family doctor's small clinic in a town in East Africa, where supplies ride past on a moving belt like a sushi conveyor. Bright, calm, clean and modern. Rendered in the style and light of the attached kitchen (use it only for how things are rendered and lit, not for the room). Seen from a standing adult's eye height, looking straight ahead (one-point perspective, verticals vertical, the horizon at about 55% of the image height). The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- A long counter runs across the whole width of the lower part of the image. Along its top runs a flat conveyor belt, straight from left to right across almost the whole width, its top surface nearly horizontal at about 62% of the image height from the top and just visible from above as a band about 6% of the image height deep. The belt is plain matte charcoal grey with thin, evenly spaced cross seams, between two low, rounded, brushed-steel side rails. It comes out of a small square hatch in a pale oak panel at the far left and goes into a matching hatch at the far right. The belt is completely EMPTY.
- The counter front, below the belt, is plain pale oak panels down to the bottom of the image.
- Behind the counter, the back wall is warm cream. Upper left and upper right: fixed wall cabinets with plain, closed sage-green doors and small brass knobs; no glass, no labels, nothing on top. Between them, from about 30% to 80% of the width and from about 15% to 60% of the height: plain, calm wall (a person may stand behind the belt there, and their head goes against it). Keep it free of anything red.

Completely empty of anything that moves or can be picked up: nothing on the belt or the counter; no bottles, jars, boxes, bags, bandages, baskets, trays, scales, bells, tills, signs, posters, plants or clocks. No people, no animals.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable wood, rubber, brushed steel and plaster, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right. Bright, warm and calm; nothing cluttered.

Do not add any text, letters, numbers, logos, labels, signs, red crosses or medical symbols. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-clinic-pharmacy-e-v1.png`
**cuts to:** not sliced; Claude crops to 16:9 and cuts the belt band as its own layer (scrolled in code) and the counter front as the occluder.
**check:** one straight, level, **empty** belt across nearly the whole width, entering and leaving through hatches · evenly spaced seams · cabinets closed, no labels · plain wall in the middle · no items, signs or crosses anywhere.

---

## 6. The clinic's patients

The waiting room's people: **a little girl, a little boy, an old man, an old woman, and a baby with a parent** (the pipeline's "bring in the little girl", "bring in the old man"). Like section 2: a line-up, then one sheet each in the same chat, then colour variants.

**Colour variants.** The pipeline's later levels put several old men in different colours in the waiting room ("the old man in blue"). So each person's main garment is **one large, plain, solid colour with no print or embroidery**, which the game can recolour in code; and 6.7 and 6.8 make the old man and the old woman in four colours as real art, which also shows what each recolour should look like. They must never be confused with the family: the old woman wears no red and no glasses (Nani and Big Ma), the old man no cap and no beard (Nana and the doctor), the baby no yellow (Isa).

### 6.1 The line-up

**attach:** style anchor, `char-family-lineup-v1.png`.

```
Generate an image, 1536×1024, landscape.

A line-up of new characters for a children's game, the patients in a friendly doctor's waiting room, standing side by side, full body, front view, neutral friendly poses, rendered in exactly the style of the attached family line-up (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). They are neighbours of the family in the attached line-up, but new, different people: do not copy any of their faces.

Skin: the same range as the attached family: a warm light tan, a little more brown than beige, rendered warm and unsaturated, never orange; each person a little lighter or deeper, warmer or cooler.

Stylised faces: large expressive eyes, soft rounded forms, simple mouths, smooth skin. Modern, warm, appealing; never a caricature. Modest clothes: long sleeves, loose, nothing tight. Each person's main garment is one plain, solid colour with no print, no pattern and no embroidery.

Left to right:
1. A little girl of about five: small and round-cheeked, black hair in two short plaits tied with small white ribbons; a long-sleeved, knee-length kurti dress in plain solid yellow over white leggings; white sandals.
2. A little boy of about six, a little taller than the girl: short, neat black hair and a gap-toothed grin; a plain solid red T-shirt with long sleeves; dark blue trousers; trainers.
3. An old man in his seventies, slim and slightly stooped: grey hair neatly combed back, a grey moustache, clean-shaven chin, no cap, no glasses; a long kurta in plain solid blue; white trousers; brown sandals; a simple wooden walking stick in his right hand.
4. An old woman in her seventies, small and round, with a kind smile: a plain white cotton headscarf covering her hair; no glasses; a pale cream kurta with a shawl in plain solid green wrapped over her shoulders; flat sandals.
5. A young father of about thirty with a short, neat black beard: a plain white shirt with long sleeves and dark trousers, holding on his hip a baby of about one in a plain mint-green romper and a small mint-green knitted hat.

Realistic relative heights: the father tallest; the old man a little shorter; the old woman small; the girl about the height of the father's waist.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind. They stand apart, not touching.

Do not add any text, letters, numbers, labels, logos or watermarks, including on the clothes. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-clinic-lineup-v1.png`
**check:** five clearly different people (the baby with the father), none like Nana, Nani, Big Ma, Ma or Ali · each main garment one plain colour, no print: yellow, red, blue, green, white · the old woman's hair covered, no red, no glasses · the old man no cap, no beard · the baby in mint, not yellow · flat grey, no shadows.

### 6.2 to 6.6 One sheet each (same chat as the line-up)

Send these **in the chat holding the line-up you kept**, one after another. **attach:** nothing.

6.2, the little girl:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the little girl on the far left, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, hair, ribbons, clothes and colours as in the line-up; her yellow dress one plain colour, no print.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), knees bent, feet flat, hands resting on her lap; upper body cut at the waist, front view, facing us, a shy smile; a strip of flat colour swatches: skin, hair, eyes, dress, leggings.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

6.3, the little boy:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the little boy, second from the left, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, hair, clothes and colours as in the line-up; his red T-shirt one plain colour, no print.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), knees bent, feet flat, hands resting on his thighs; upper body cut at the waist, front view, facing us, a gap-toothed grin; a strip of flat colour swatches: skin, hair, eyes, T-shirt, trousers.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

6.4, the old man:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the old man with the walking stick, in the middle, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, hair, moustache, clothes and colours as in the line-up; no cap, no beard, no glasses; his blue kurta one plain colour, no print.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose, the walking stick in his right hand: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), knees bent, feet flat, hands resting on his thighs, no stick; upper body cut at the waist, front view, facing us, a kind smile, no stick; a strip of flat colour swatches: skin, hair, eyes, kurta, trousers, stick.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

6.5, the old woman:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the old woman in the white headscarf and green shawl, second from the right, 1536×1024, landscape, in exactly the same style. Exactly the same face, skin, headscarf, clothes and colours as in the line-up; her hair covered in every panel; no glasses; her green shawl one plain colour, no print.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, neutral friendly pose: front, three-quarter, side (facing right), back.
Bottom row: sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), knees bent, feet flat, hands resting on her lap; upper body cut at the waist, front view, facing us, a kind smile; a strip of flat colour swatches: skin, eyes, headscarf, shawl, kurta.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

6.6, the father and the baby:

```
Using the line-up above (the image you made in this chat) as the only reference, make a character sheet for the young father and his baby, on the far right, 1536×1024, landscape, in exactly the same style. Exactly the same faces, skin, hair, beard, clothes and colours as in the line-up; the baby's romper and hat one plain mint green.

Layout, separate panels with clear space between them, nothing touching:
Top row: full-body turnaround, standing, the baby held on his hip: front, three-quarter, side (facing right), back.
Bottom row: the father sitting, full body, front view, facing us, on an invisible seat at knee height (draw no bench, stool or chair), feet flat, the baby sitting on his lap facing us, his hands holding the baby; the father's upper body cut at the waist, front view, the baby in his arms, both facing us, smiling; the baby alone, sitting up, full body, front view, facing us, on an invisible seat (draw no seat); a strip of flat colour swatches: father's skin, beard, shirt, trousers; baby's skin, romper.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient. NO shadows of any kind. Do not draw panel borders, grid lines or labels. Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No dummy, bottle, toys or bags. Five fingers on each hand.
```

**save as:** `char-clinic-girl-v1.png`, `char-clinic-boy-v1.png`, `char-clinic-oldman-v1.png`, `char-clinic-oldwoman-v1.png`, `char-clinic-dad-baby-v1.png`
**cuts to:** filed in `sources/art/characters/`, not cut yet. Once Zafar approves a sheet, Claude cuts its seated and waist-up panels (grey key).
**check:** each matches its person in the line-up exactly and stays the same in every panel · main garments still one plain colour, no print · the old woman's hair covered in every panel, including the back · no stick in the old man's seated and waist-up panels · no seat drawn in any seated panel · five fingers · flat grey, no shadows.

### 6.7 and 6.8 The old man and the old woman in four colours

Fresh chats. The four versions are the waist-up waiting-room crop, identical except for the colour, so "the old man in blue" is decided by the colour word alone.

6.7: **attach:** style anchor, the image you saved for 6.4 (the old man's sheet).

```
Generate an image, 1536×1024, landscape.

Using the attached old man character sheet as the only reference for who he is, make one image: the same old man four times side by side, evenly spaced, each his upper body cut at the waist, front view, facing us, a kind smile, exactly as in the waist-up panel of his sheet. The four are identical in every way (face, hair, moustache, pose, size, lighting) except the colour of his plain kurta, left to right: blue, green, yellow, red. Each a plain, solid, clearly readable colour with no print or pattern.

Layout: an invisible grid of 4 columns and 1 row of equal cells covering the whole image, one figure per cell, centred, with empty background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No walking stick, no objects. Five fingers on each hand.
```

6.8: **attach:** style anchor, the image you saved for 6.5 (the old woman's sheet).

```
Generate an image, 1536×1024, landscape.

Using the attached old woman character sheet as the only reference for who she is, make one image: the same old woman four times side by side, evenly spaced, each her upper body cut at the waist, front view, facing us, a kind smile, exactly as in the waist-up panel of her sheet. The four are identical in every way (face, white headscarf, cream kurta, pose, size, lighting) except the colour of her plain shawl, left to right: blue, green, yellow, purple. Each a plain, solid, clearly readable colour with no print or pattern. Her headscarf stays white in all four.

Layout: an invisible grid of 4 columns and 1 row of equal cells covering the whole image, one figure per cell, centred, with empty background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. No objects. Five fingers on each hand.
```

(The old woman's fourth colour is purple, not red: red would put her next to Nani.)

**save as:** `char-clinic-oldman-colours-v1.png`, `char-clinic-oldwoman-colours-v1.png`
**cuts to (4×1, grey):** `clinic-oldman-waist-blue` `clinic-oldman-waist-green` `clinic-oldman-waist-yellow` `clinic-oldman-waist-red`; `clinic-oldwoman-waist-blue` `clinic-oldwoman-waist-green` `clinic-oldwoman-waist-yellow` `clinic-oldwoman-waist-purple`
**check:** four copies of the **same** person, only the one garment's colour changing, in the right order · each colour obvious at a glance, no pattern · the old woman's headscarf white in all four · flat grey, no shadows, nothing touching.

---

## 7. "Where it hurts": the family, seated

Each family member as a patient on the examination bench: seated full body, facing us (the clinic sits patients full body so knees and feet can be checked), in four poses: waiting calmly, then a hand on their own head, tummy and knee. The calm pose is the patient base; the face comes from section 1 as a separate head layer, so "better now" at the send-off is this body with the better-now face.

**The clinic's leak rule:** a patient never touches or looks at the part the child has to find. These hurt poses are shown **only after the answer** (the confirming "yes, here!", and the send-off), never while the child is choosing. The side is fixed (their own right hand, their own right knee, which is on the viewer's left), because Nani's mole means her art can't be mirrored.

Baby Isa isn't here: at the clinic he sits on Ma's lap.

### 7.1 Nani

**attach:** style anchor, `char-nani-v2.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Nani character sheet as the only reference for who she is, make a sheet of four poses of Nani sitting down as a patient at the doctor's: full body, front view, facing us, in every pose sitting on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent at a right angle, both feet flat on an invisible floor, the same size and position in every cell.

Layout: an invisible grid of 4 columns and 1 row of equal cells covering the whole image, one pose per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Left to right:
1. Waiting calmly: both hands resting on her thighs, a gentle neutral face, looking at us.
2. "My head": her right hand resting on top of her head, a small wince, looking at us.
3. "My tummy": both hands resting on her tummy, a small wince.
4. "My knee": leaning forward a little, her right hand on her right knee, a small wince.
Her own right hand and right knee are on the viewer's left. Mild and a little comic, never in real pain or distress.

Keep her exactly as on the sheet: her face; her thin round gold wire-framed glasses; her deep red headscarf; the small mole just above her upper lip on the viewer's left; her beige kurta with gold and deep-red embroidery, her sheer deep-red dupatta, her cream trousers and her embroidered flat shoes; a red stone ring on her right hand, a diamond ring on her left, a thin diamond tennis bracelet on her right wrist, and NO bangles.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. No objects. Five fingers on each hand.
```

**save as:** `char-nani-hurts-v1.png`
**cuts to (4×1, grey):** `nani-sit` `nani-sit-head` `nani-sit-tummy` `nani-sit-knee`

### 7.2 Nana

**attach:** style anchor, `char-nana-v1.png`, `char-nana-expressions-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Nana character sheet and expressions sheet as the only reference for who he is, make a sheet of four poses of Nana sitting down as a patient at the doctor's: full body, front view, facing us, in every pose sitting on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent at a right angle, both feet flat on an invisible floor, the same size and position in every cell.

Layout: an invisible grid of 4 columns and 1 row of equal cells covering the whole image, one pose per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Left to right:
1. Waiting calmly: both hands resting on his thighs, a gentle neutral face, looking at us.
2. "My head": his right hand resting on top of his cap, a small wince, looking at us.
3. "My tummy": both hands resting on his tummy, a small wince.
4. "My knee": leaning forward a little, his right hand on his right knee, a small wince.
His own right hand and right knee are on the viewer's left. Mild and a little comic, never in real pain or distress.

Keep him exactly as on the sheets: his face, his white knitted cap, his round glasses, his white beard, his cream kurta and trousers, his brown waistcoat and his brown shoes, and their colours.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. No objects. Five fingers on each hand.
```

**save as:** `char-nana-hurts-v1.png`
**cuts to (4×1, grey):** `nana-sit` `nana-sit-head` `nana-sit-tummy` `nana-sit-knee`

### 7.3 Ma

**attach:** style anchor, `char-ma-v1.png`, `char-ma-expressions-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Ma character sheet and expressions sheet as the only reference for who she is, make a sheet of four poses of Ma sitting down as a patient at the doctor's: full body, front view, facing us, in every pose sitting on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent at a right angle, both feet flat on an invisible floor, the same size and position in every cell.

Layout: an invisible grid of 4 columns and 1 row of equal cells covering the whole image, one pose per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Left to right:
1. Waiting calmly: both hands resting on her lap, a gentle neutral face, looking at us.
2. "My head": her right hand resting on top of her head, over her dupatta, a small wince, looking at us.
3. "My tummy": both hands resting on her tummy, a small wince.
4. "My knee": leaning forward a little, her right hand on her right knee, a small wince.
Her own right hand and right knee are on the viewer's left. Mild and a little comic, never in real pain or distress.

Keep her exactly as on the sheets: her face; her green dupatta with the small gold motif over her head; her gold jhumka earrings; her maroon embroidered kurta and trousers; her embroidered flat shoes; and their colours.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. No objects. Five fingers on each hand.
```

**save as:** `char-ma-hurts-v1.png`
**cuts to (4×1, grey):** `ma-sit` `ma-sit-head` `ma-sit-tummy` `ma-sit-knee`

### 7.4 Ali

**attach:** style anchor, `char-ali-v1.png`, `char-ali-expressions-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached Ali character sheet and expressions sheet as the only reference for who he is, make a sheet of four poses of Ali, a tall, lanky boy of about nine, sitting down as a patient at the doctor's: full body, front view, facing us, in every pose sitting on an invisible seat at knee height (draw no bench, stool or chair), thighs level, knees bent at a right angle, both feet flat on an invisible floor, the same size and position in every cell.

Layout: an invisible grid of 4 columns and 1 row of equal cells covering the whole image, one pose per cell, centred, with empty background all round it; nothing touches or crosses a cell boundary. Do not draw grid lines, panel borders or labels.
Left to right:
1. Waiting, a bit fidgety: both hands resting on his knees, a neutral face, looking at us.
2. "My head": his right hand resting on top of his head, a small wince, looking at us.
3. "My tummy": both hands resting on his tummy, a small wince.
4. "My knee": leaning forward a little, his right hand on his right knee, a small wince.
His own right hand and right knee are on the viewer's left. Mild and a little comic, never in real pain or distress.

Keep him exactly as on the sheets: his face, his tousled black hair, his orange T-shirt with the chest pocket, his jeans and his trainers, and their colours; keep him tall and lanky.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No objects. Five fingers on each hand.
```

**save as:** `char-ali-hurts-v1.png`
**cuts to (4×1, grey):** `ali-sit` `ali-sit-head` `ali-sit-tummy` `ali-sit-knee`

**check (7.1–7.4):** the same person as their sheet in all four (Nani's mole on the viewer's left and no bangles; Nana's cap; Ma's dupatta) · seated full body, feet showing, **no bench or chair drawn** · the hand on the right place: head, tummy, and the knee on the **viewer's left** · a small wince, not real pain · the four the same size and height · flat grey, no shadows.

---

## 8. Relights (last, only if the day image passed)

A fresh chat each, attaching the kept day image. The game swaps them in place, so nothing may move. Skip a relight if its day image failed its check.

### 8.1 and 8.2 The sitting room, golden evening and night

Arc 1's "guests coming tonight" and the Eid evening party (Find it's sitting room, Who did it? at dusk).

8.1: **attach:** the image you saved for 3.2 (the sitting room, day). No style anchor.

```
Edit the attached image. Same image, same composition, same camera: every object, edge and surface stays exactly where it is, the same size and shape. Change only the lighting to golden evening: a low, warm, orange sun from the upper left, longer soft shadows to the lower right, a warm rim of light on edges facing the window, and a slightly deeper, warmer sky or light through the window. Do not add, remove or move anything. No text.
```

8.2: **attach:** the image you saved for 3.2 (the sitting room, day). No style anchor.

```
Edit the attached image. Same image, same composition, same camera: every object, edge and surface stays exactly where it is, the same size and shape. Change only the lighting to night: the window shows a dark blue night outside; the room is lit by warm lamplight from above, with soft warm pools of light and a cool blue fill from the window outside those pools; shadows soft and short. Do not add, remove or move anything, and don't draw any lamp that isn't already there. No text.
```

**save as:** `bg-sitting-room-e-evening-v1.png`, `bg-sitting-room-e-night-v1.png`

### 8.3 The courtyard, golden evening

Find it's "Nani's day" (evening) and Arc 2's mehndi night grade start from this; the courtyard has no window, so the evening line is adapted to the sun on the walls.

**attach:** the image you saved for 3.1 (the courtyard, day). No style anchor.

```
Edit the attached image. Same image, same composition, same camera: every object, edge and surface stays exactly where it is, the same size and shape. Change only the lighting to golden evening: a low, warm, orange sun from the upper left, longer soft shadows stretching to the lower right, a warm rim of light on edges facing the sun, the whitewashed walls glowing a warm amber, and the shade under the veranda roof a little deeper. No sky appears. Do not add, remove or move anything. No text.
```

**save as:** `bg-courtyard-e-evening-v1.png`
**check (8.1–8.3):** flick between it and the day image: **not identical**, and nothing has moved, grown or appeared · the sofa back and the wall above it still clear and readable · no new lamps, people or objects · the courtyard still shows no sky.

---

## 9. Not in this batch, and why

| Left out | Why | When |
|---|---|---|
| The healing mini-game close-ups (ear, teeth, eyes, cuts, knees…) | Being redesigned tonight (the pipeline brief's 15–20 healing games) | After the clinic's pipeline design lands |
| Pharmacy items (the things on the belt) | The list depends on the healing games | Same |
| Mode-specific props (shoes, mithai, sweet box, garments, washing, buckets, magnifier, photo frames…) | Each mode's pipeline redesign may change them | After tonight's redesigns |
| Big Ma's and the doctor's feelings and "where it hurts" | Their sheets (batch 2) aren't approved yet | Batch 4, with this pack's prompts in sections 1 and 7 |
| Expressions and poses for the new people (sections 2 and 6) | Sheet first: nothing is made from a sheet Zafar hasn't approved | Batch 4 (batch 1's 2.8 plus this pack's sections 1 and 7) |
| Find it's two-screen courtyard and 1.5-screen sitting room; Tidy up's high-angle dastarkhwan view | Their scene specs don't exist yet (Find it's process: spec, greybox, leak bot, then art) | When `courtyard.json` and `sitting-room.json` land |
| Monsoon rush's house cross-section, Snap's strips, the farm and the village | Held by the review (Snap) or by the rooms decision (#16) | Later |
| Nani's standard 12 expressions (batch 1's 2.8) | Not asked for this batch; her feelings sheet covers the clinic and Who did it? | Any batch: batch 1's 2.8 prompt with `char-nani-v2.png` |

---

## 10. Handing back

Drag the PNGs into the Claude Code chat with the runner's log, and say which batch they're from ("batch 3"). Claude renames them to the **save as:** names, files character and animal sheets in `sources/art/characters/` and backgrounds in `sources/art/chatgpt/`, cuts the feelings, colour and "where it hurts" sheets with `build/slice_sheet.py --key grey`, crops the backgrounds to 16:9, cuts their occluders, and checks everything on black and white backings against the Art Bible's QA list (section 10). The new people's sheets wait for Zafar's approval before anything is cut from them.
