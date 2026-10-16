# s08: the doctor and Nani in the locked style, every view and gesture (pack `s08`)

**Written:** 16 Oct 2026 by the art planner; rebuilt the same day on the references Zafar approved (below) after his ask ("Ensure we capture all the variations we need or might need … face on, quarter turn, half turn, left and right, arms down, arms waving, mid conversation, making a point, pointing up, pointing down … have a review about all the permutations that we need"). **Status:** ready for his go; nothing runs until he says so. Rules: `CLAUDE.md` 13 and 16; the doctor and Nani are real people, so **he approves their pictures** (his ok in the chat is the pass; the first picture of each person gates the rest, section 3). Run spec: `build/tools/art/specs/s08.run.yaml`; the block it generates: `s08-paste-block.txt` (never hand-edited). He runs the block himself in Claude in Chrome; delivery by download from ChatGPT's Library page (section 3).

## 0. The approved references and the skin swatches

**Approved (Zafar, 16 Oct), the references for everything:** the lineup `sources/art/s08/lineup-v4-1.png` (the guiding template: the grandad, the doctor, on the left; Nani in the middle; the girl on the right), the character sheets `sources/art/s08/sheet-doctor-final-1.png`, `sheet-nani-final-1.png` and `sheet-girl-v2-1.png`, and the close-up panels in `sources/art/s08/panels/` (faces and stylised hands). Faces keep the likeness at the lineup's level with slightly larger, open eyes. The adults' hands are stylised like the girl's: smooth, simple, rounded fingers, no veins, tendons or knuckle wrinkles. Clothes simplified: his plain navy blazer with a faint check, white open shirt, charcoal trousers, brown belt, brown shoes, silver watch on his left wrist; her plain cream kameez with a few bold red motifs only at the neck, cuffs and hem, straight cream trousers, a plain red dupatta over her head, flat cream shoes, round thin gold glasses, a thin pearl bracelet on her left wrist, **no rings on any finger** (Zafar, 16 Oct: "too fiddly to reliably get right; remove all rings"). Nani 5'5"-5'6" beside his 5'8", slim, never portly. The girl is not in this run.

**Skin (the sheet swatches): the doctor #C88A6F, Nani #D5906C** (the girl #DA956C for comparison). Every prompt carries its character's hex and the words "the skin exactly this, never lighter, paler or pinker"; every check reads "skin within ΔE 6 of the swatch"; `artjudge.py` measures it (`skin:` on the check). Zafar: "watch skin tone drift on all."

**The drift guard (how every picture is made).** The sheets are approved, so no sheet is drawn in this run. (1) The face sheet and the face-on standing base are edits of the approved sheet: they attach the sheet and the lineup, the only authority on who and how. (2) A turn is a redraw of the face-on base ("changed in nothing but the turn") with the sheet attached, whose turnaround panels show the turn. (3) A pose is a redraw of its view's base ("changed in nothing but the arms, hands and face") with the sheet and the lineup attached. (4) Mouths and blinks are edits of their base (that one image only). Nothing is generated fresh from words and nothing attaches the s07 pictures: their finish is the one being replaced. Faces, skin and feet lines register with the base, so the cutter can swap views in place.

## 1. Where they appear (the audit, 16 Oct)

| Place | Who, view, pose | Today | Pictures it needs |
|---|---|---|---|
| Clinic waiting room (`js/clinic/stages/waiting.js`, `data/clinic/scenes-v2.json` waiting.doctor) | the doctor front-on by his door, waving, calling the next patient; mouth closed between lines | DD1 + DD2 (s07, wired) | wave front with the calling mouth + its closed mouth |
| Clinic diagnosis (`diagnosis.js`) | three-quarter left to the patient while they talk, then front to the player; bubbles at his head | 3q-left + talk + blink; front (no faces) | 3q-left with talk and blink; front |
| Clinic send-off (`sendoff.js`) | three-quarter right to the girl at the door; waves her off | 3q-right (no faces), wave-3q-right | 3q-right; wave 3q-right |
| Clinic pharmacy and his box, cards (`common.js` `S.doctorFace`, `Kit.doctorFace`) | his face in the guide box and on cards: neutral, talk, laugh, think | cut from `doctor-ref-faces-v1.png` | the face sheet (12, registered) |
| Clinic stage 2's "does it hurt here?", the tool cues, "that's it" | pointing at the part, finger up, the torch at the eye | not drawn (words only) | point-left 3q-left, finger-up, torch (LIKELY) |
| Cook: every station, the greeting, the orders, the day summaries, the shop (`js/cook/stations.js`, `js/cook/flow.js`, `data/cook.json` art.assets.shared) | Nani leaning on the counter: neutral, happy, talk, point, blink | N1-N5 (s07, wired as `nani-*-v2.webp`) | the five leaning pictures again |
| Nani's guide box in every mode, the Cook cover, story cards (`js/shared/guide.js`, `js/shared/story.js`, `nani-badge.webp`) | her face | the old badge | the face sheet (12, registered) |
| First launch (`data/story/first-launch.json`, `docs/game-design/modes/first-launch.md`) | Nani talks, points at the kitchen, holds out a spoon, hugs the child, sips chai | the old waist-up pictures with a ledge; SVG placeholder panels | standing front with talk; point-left/right; the counter set (LIKELY) |
| Story by the fire, the bazaar, travel, conversations at the door (`docs/game-design/modes/story-by-the-fire.md`, `docs/game-design/modes/conversations.md`) | Nani standing, turned to a visitor then to the player; waving, welcoming, celebrating | nothing drawn | standing turns, waves, gestures (LIKELY) |
| The house (`js/home.js`) | nobody drawn today | | none |

The s07 doctor set (`sources/art/s07/`, 41 standing pictures) and the s07 Nani (N1-N5) are the pictures this run replaces; they are not attached to anything.

## 2. The permutation matrix

Views: **F** face-on, **QL** quarter turn to the viewer's left, **QR** quarter turn to the viewer's right, **SL** side-on left, **SR** side-on right. Cells: **NEED** (what the game wires first: Zafar, 16 Oct), **LIKELY** (wired next or planned for story and modes), **SKIP** (never seen: a side view hides the face, a point behind oneself). The letter is the part that makes it.

### The doctor

| Pose | F | QL | QR | SL | SR |
|---|---|---|---|---|---|
| Arms down, neutral (the view base) | NEED A | NEED A | NEED A | LIKELY C3 | LIKELY C3 |
| Talking mouth (edit) | LIKELY C0 | NEED A | LIKELY C0 | SKIP | SKIP |
| Blink (edit) | LIKELY C0 | NEED A | LIKELY C0 | SKIP | SKIP |
| Waving (F: the calling mouth + its closed-mouth edit) | NEED A (2) | LIKELY C2 | NEED A | LIKELY C3 | LIKELY C3 |
| Talking mid-conversation, open hands | LIKELY C1 | LIKELY C1 | LIKELY C1 | SKIP | SKIP |
| Making a point, gesticulating | LIKELY C1 | LIKELY C1 | LIKELY C1 | SKIP | SKIP |
| Pointing left | LIKELY C1 | LIKELY C1 | SKIP | SKIP | SKIP |
| Pointing right | LIKELY C1 | SKIP | LIKELY C1 | SKIP | SKIP |
| Finger up, "idea" | LIKELY C1 | LIKELY C1 | LIKELY C1 | SKIP | SKIP |
| Pointing up | LIKELY C2 | LIKELY C2 | LIKELY C2 | SKIP | SKIP |
| Pointing down | LIKELY C2 | LIKELY C2 | LIKELY C2 | SKIP | SKIP |
| Welcoming, open hands | LIKELY C2 | LIKELY C2 | LIKELY C2 | SKIP | SKIP |
| Celebrating, arms up | LIKELY C2 | LIKELY C2 | LIKELY C2 | SKIP | SKIP |
| Arms folded | LIKELY C3 | LIKELY C3 | LIKELY C3 | SKIP | SKIP |
| Thinking, hand on chin | LIKELY C3 | LIKELY C3 | LIKELY C3 | SKIP | SKIP |
| Holding the torch | LIKELY C3 | LIKELY C3 | LIKELY C3 | SKIP | SKIP |

Plus his face sheet (A). Doctor: **9 NEED, 43 LIKELY.**

### Nani

| Pose | F | QL | QR | SL | SR |
|---|---|---|---|---|---|
| Leaning on the counter: neutral, happy, talk, point, blink (N1-N5) | NEED B (5) | SKIP | SKIP | SKIP | SKIP |
| Standing, arms down, neutral (the view base) | LIKELY C0 | LIKELY C1 | LIKELY C1 | LIKELY C3 | LIKELY C3 |
| Talking mouth (edit) | LIKELY C0 | LIKELY C1 | LIKELY C1 | SKIP | SKIP |
| Blink (edit) | LIKELY C0 | SKIP | SKIP | SKIP | SKIP |
| Talking mid-conversation, open hands | LIKELY C1 | LIKELY C1 | LIKELY C1 | SKIP | SKIP |
| Making a point | LIKELY C1 | LIKELY C1 | LIKELY C1 | SKIP | SKIP |
| Pointing left | LIKELY C1 | LIKELY C1 | SKIP | SKIP | SKIP |
| Pointing right | LIKELY C1 | SKIP | LIKELY C1 | SKIP | SKIP |
| Finger up, "idea" | LIKELY C1 | LIKELY C1 | SKIP | SKIP | SKIP |
| Waving | LIKELY C2 | LIKELY C2 | LIKELY C2 | SKIP | SKIP |
| Pointing up | LIKELY C2 | SKIP | SKIP | SKIP | SKIP |
| Pointing down | LIKELY C2 | SKIP | SKIP | SKIP | SKIP |
| Welcoming, open hands | LIKELY C2 | SKIP | SKIP | SKIP | SKIP |
| Celebrating (Shabash, clapping) | LIKELY C2 | LIKELY C2 | SKIP | SKIP | SKIP |
| Arms folded | LIKELY C3 | SKIP | SKIP | SKIP | SKIP |
| Thinking, hand on chin | LIKELY C3 | SKIP | SKIP | SKIP | SKIP |
| Standing at the counter, hands on it (the counter base) | LIKELY C3 | SKIP | SKIP | SKIP | SKIP |
| Holding a tray of chai (off the counter base) | LIKELY C3 | SKIP | SKIP | SKIP | SKIP |
| Stirring a pan (off the counter base) | LIKELY C3 | SKIP | SKIP | SKIP | SKIP |

Plus her face sheet (B). Nani: **6 NEED, 34 LIKELY.**

**The face sheets (one each, registered):** twelve expressions on one 4 by 3 grid with the head in exactly the same place and size in every cell: neutral, talking A (mouth a little open), talking B (wide open, teeth showing), smiling, laughing, blink, surprised, thinking, concerned, proud, encouraging nod, listening. They feed the guide box, the cards and the talk animation (two mouth shapes).

## 3. The run: order, time, safe stops

| Part | Lines | What lands | His time |
|---|---|---|---|
| **A** The doctor, NEED | 9 | the front base (his gate), his face sheet; 3q-left with talk and blink; 3q-right; wave 3q-right; the wave front with the calling mouth and its closed-mouth edit | about 35 min (the front base waits for his ok before anything else of him is sent) |
| **B** Nani, NEED | 6 | the leaning base (her gate) with happy, talk, blink and point; her face sheet | about 25 min |
| **C0** The next bases and faces, LIKELY | 11 | his front and 3q-right talk and blink; her standing front base with talk and blink, her quarter turns with talk | about 25 min |
| **C1** Talking and pointing, LIKELY | 25 | both: mid-conversation, making a point, pointing left and right, finger up | about 45 min |
| **C2** Waves, up and down, welcome and celebrate, LIKELY | 21 | both: pointing up and down, welcoming, celebrating; his wave 3q-left; her waves | about 40 min |
| **C3** Folded, thinking, torch, the counter set, the side views, LIKELY | 20 | his folded, thinking, torch; her folded, thinking, counter base, tray, stirring; both side views, his side waves | about 40 min |
| | **92** | | **about 3 h 30** |

**Time:** three windows, about 1.5 to 2 minutes a line once they flow, a quarter redone; parts A and B are slower because each person's first picture waits for his ok before anything else of that person is sent. **Every part boundary is a safe stop:** A leaves the clinic's doctor complete in the new style, B leaves Cook's Nani and both face sheets, C0 the faces the next wiring needs, C1-C3 the story and conversation set in value order. Whatever is kept at a stop is downloaded.

**His approvals.** The first picture of each person (DW-F for the doctor, NL for Nani) is posted in the chat and the runner waits for his ok before any other line of that person is sent (as in s07); after that gate every later picture is posted as it is kept and the run carries on, and a "no" is a redo of that line and the edits of it.

**Delivery (Zafar, 16 Oct).** He pastes `s08-paste-block.txt` into Claude in Chrome and watches. Every kept image stays in its chat, logged with the chat link, the chat's title and its save-as name; later prompts attach kept images from ChatGPT's library. When the run is complete, or when he says "stop" or "download", the runner opens ChatGPT's Library page (https://chatgpt.com/library), finds each kept image in run order and downloads it with ChatGPT's own download button (Chrome's normal download to his PC; the file keeps ChatGPT's title, renaming is not possible), logging each as "DOWNLOADED n: title -> save-as" and posting that list at the end of the log, as the s07 log did. It never uploads to GitHub and never uses page JavaScript to move images. Zafar renames from the list and pushes the folder and the log to the repo himself as `sources/art/s08/`. He must attach nothing himself: every reference is fetched from the branch raw (`claude/new-session-b5r2am`, where the approved files live until they are published).

## 4. After the run (Claude)

1. `artjudge.py` on the pack (skin ΔE against the swatches above; edits by pixel diff against their base, mean under 5; poses and turns registered on the base's feet line).
2. Likeness, by Zafar's eye: each face sheet's neutral cell beside the sheet's close-up and the lineup at one head height.
3. Cut (`artcut.py`, a new `s08.cut.json`): the doctor's views on one `fig_h` with talk and blink layers, the wave front with its two mouths as face layers, the twelve faces as 512 px heads; Nani's five leaning pictures to `nani-*-v3.webp` (the five paths in `data/cook.json` and `js/cook/flow.js`), her standing base and faces, her badge from the face sheet.
4. Wire (`/brief`, then `/review`): `data/clinic/heal-art.json` views re-measured; the guide box faces; part C pictures stay as cut spares until a mode asks for them (an idea row names each).

## 5. The prompts

Every prompt is pasted as is into a fresh chat with exactly the files on its line, in the line's order, its {SLOT}s filled word for word from the line. Sizes: a face sheet 1536×1024; every standing, leaning and counter picture 1024×1536.

#### DX. The doctor's twelve faces, registered (an edit of his approved sheet)

Attach: `sheet-doctor-final-1.png`, `lineup-v4-1.png`.

```
Generate an image, 1536×1024, landscape.

Two pictures are attached: his approved character SHEET (a four-view turnaround, a face close-up, his hands and his colour swatches on grey) and the LINEUP of three people on grey, where he is the man on the LEFT. They are the only authority on who he is and how he is rendered: copy his face, the size of his eyes, his skin, his white hair and beard, his glasses, his clothes and the whole finish from them exactly, as if these were twelve more panels of that sheet.

Draw twelve head-and-shoulders faces of him, front-on, in a 4 by 3 grid of equal cells separated by clear grey gutters (no lines), in this order, left to right then top to bottom: 1 neutral (a small kind smile, mouth closed); 2 talking A (the mouth a little open, as on a short vowel); 3 talking B (the mouth open wide, the teeth showing, as on a long vowel); 4 smiling (a warm closed smile); 5 laughing (a big open laugh, the eyes crinkled); 6 blink (both eyes gently closed, the face otherwise as 1); 7 surprised (brows up, eyes wide, the mouth a small o); 8 thinking (eyes up and to one side, lips pressed, one brow up); 9 concerned (brows drawn a little together, a small kind frown); 10 proud (chin a little up, a broad closed smile, soft eyes); 11 encouraging nod (the head tipped a few degrees down, a warm smile, eyes on us); 12 listening (the head tipped a few degrees to one side, mouth closed, brows soft, attentive).

REGISTERED: the head exactly the same size (about half the cell's height) and in exactly the same place in every cell, the eyes on one line across each row and the nose on each cell's centre line, so that any two cells can be swapped without the head moving; the head tilts only in cells 11 and 12 and only by a few degrees. The shoulders run off the lower edge of their cell and nothing else touches a cell's edge. Glasses, beard, hair, shirt and blazer identical in every cell; only the face changes.

Rendered exactly as the sheet and the lineup: the face at their level of likeness with the same slightly larger, open eyes; matte smooth skin with soft shading, no pores and no fine wrinkles; the hair and beard soft solid white masses; bald on top with short white side hair, a short neat solid white beard, clear thin rectangular glasses; the clothes simplified as the sheet, soft plain cloth with no visible weave: a white open-collared shirt under a plain navy blazer with a faint check. One warm soft key light from the upper left with soft shadows to the lower right; no outlines, no photorealism.

Skin: exactly hex #C88A6F in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background in every cell and gutter: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DW0. The doctor standing, front, neutral (the face-on base; an edit of his approved sheet)

Attach: `sheet-doctor-final-1.png`, `lineup-v4-1.png`.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: his approved character SHEET (a four-view turnaround, a face close-up, his hands and his colour swatches on grey) and the LINEUP of three people on grey, where he is the man on the LEFT. They are the only authority on who he is and how he is rendered: copy his face, the size of his eyes, his skin, his white hair and beard, his glasses, his clothes, his proportions and the whole finish from them exactly. This picture is the sheet's front turnaround panel drawn alone, large.

Draw him standing, full body, front-on to the viewer, both arms relaxed at his sides, hands open and loose, nothing in his hands, a gentle neutral face with a small kind smile, mouth closed, looking at us; the figure about 85% of the image height, centred, both feet on exactly the same invisible level, nothing touching an edge. Draw no floor and no shadow on the grey.

Rendered exactly as the sheet and the lineup: the face at their level of likeness with the same slightly larger, open eyes; matte smooth skin with soft shading, no pores and no fine wrinkles; the hair and beard soft solid white masses; bald on top with short white side hair, a short neat solid white beard, clear thin rectangular glasses; the clothes simplified as the sheet, soft plain cloth with no visible weave: a plain navy blazer with a faint check, a white open-collared shirt, charcoal trousers, a brown belt, brown leather shoes, a silver watch on his LEFT wrist; no bag, no stethoscope. Hands stylised like the girl's in the lineup: smooth, simple, rounded fingers, no veins, tendons or knuckle wrinkles, five fingers on each hand. One warm soft key light from the upper left with soft shadows to the lower right; no outlines, no photorealism.

Skin: exactly hex #C88A6F in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DWT. The doctor turned (a redraw of his face-on base; the line says the turn)

Attach: kept:DW-F, `sheet-doctor-final-1.png`.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: first, his face-on STANDING picture (grey background), which is the base; second, his approved character SHEET, whose turnaround panels show him turned.

Draw the man of the first picture again, changed in nothing but his turn: {VIEW}. Both arms stay relaxed at his sides, hands open and loose, nothing in his hands, the same gentle neutral face with a small kind smile, mouth closed. The figure at the same size as the first picture, his feet on the same invisible level at the same height, his head at the same height, nothing touching an edge, no floor, no shadow on the grey. Drawn, not flipped: the watch stays on his LEFT wrist. Everything else identical to the first picture: the same face and eye size, skin, hair and beard, glasses, simplified clothes (plain navy blazer with a faint check, white open shirt, charcoal trousers, brown belt and shoes), the same smooth stylised hands with five fingers, the same rendering, the same light from the upper left and the same grey.

Skin: exactly hex #C88A6F in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DT. Talking (an edit; attach that one image only)

```
Edit the attached image. Change only his mouth: open it a little as if saying a word, the teeth just showing. Every other pixel identical: the same pose, size, position, clothes, hands, skin colour, light and background.
```

#### DB. Blink (an edit; attach that one image only)

```
Edit the attached image. Change only his eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, size, position, clothes, hands, skin colour, light and background.
```

#### DWC. The closed mouth (an edit of his calling wave; attach that one image only)

```
Edit the attached image. Change only his mouth: close it into a warm closed smile, the eyes and brows unchanged. Every other pixel identical: the same raised hand, pose, size, position, clothes, skin colour, light and background.
```

#### DP. A pose (a redraw of the view's base; the line says the pose)

Attach: the view's kept base first, `sheet-doctor-final-1.png` second, `lineup-v4-1.png` third.

```
Generate an image, 1024×1536, portrait.

Three pictures are attached: first, his STANDING picture (grey background), which is the base; second, his approved character SHEET; third, the LINEUP of three people, where he is the man on the LEFT. The sheet and the lineup are the only authority on who he is and how he is rendered.

Draw the man of the first picture again, changed in nothing but his arms, hands and face, exactly so: {POSE}. Keep everything else identical to the first picture: the same turn of the body and head, the same size and position in the frame, both feet on the same invisible level in the same place, the same simplified clothes (plain navy blazer with a faint check, white open shirt, charcoal trousers, brown belt and shoes), the same rendering, the same skin, the same light from the upper left, the same grey. Draw the new arms and hands in the same rendering as the rest of him: smooth stylised hands like the girl's in the lineup, simple rounded fingers, no veins, tendons or knuckle wrinkles, five fingers on each hand. The watch stays on his LEFT wrist. Nothing touches an edge; no floor, no shadow on the grey.

Skin: exactly hex #C88A6F in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### NX. Nani's twelve faces, registered (an edit of her approved sheet)

Attach: `sheet-nani-final-1.png`, `lineup-v4-1.png`.

```
Generate an image, 1536×1024, landscape.

Two pictures are attached: her approved character SHEET (a four-view turnaround, a face close-up, her hands and her colour swatches on grey) and the LINEUP of three people on grey, where she is the woman in the MIDDLE. They are the only authority on who she is and how she is rendered: copy her face, the size of her eyes, her skin, her glasses, her dupatta, her clothes and the whole finish from them exactly, as if these were twelve more panels of that sheet.

Draw twelve head-and-shoulders faces of her, front-on, in a 4 by 3 grid of equal cells separated by clear grey gutters (no lines), in this order, left to right then top to bottom: 1 neutral (a small kind smile, mouth closed); 2 talking A (the mouth a little open, as on a short vowel); 3 talking B (the mouth open wide, the teeth showing, as on a long vowel); 4 smiling (a warm closed smile); 5 laughing (a big open laugh, the eyes crinkled); 6 blink (both eyes gently closed, the face otherwise as 1); 7 surprised (brows up, eyes wide, the mouth a small o); 8 thinking (eyes up and to one side, lips pressed, one brow up); 9 concerned (brows drawn a little together, a small kind frown); 10 proud (chin a little up, a broad closed smile, soft eyes); 11 encouraging nod (the head tipped a few degrees down, a warm smile, eyes on us); 12 listening (the head tipped a few degrees to one side, mouth closed, brows soft, attentive).

REGISTERED: the head exactly the same size (about half the cell's height) and in exactly the same place in every cell, the eyes on one line across each row and the nose on each cell's centre line, so that any two cells can be swapped without the head moving; the head tilts only in cells 11 and 12 and only by a few degrees. The shoulders run off the lower edge of their cell and nothing else touches a cell's edge. The glasses, the red dupatta over her head and the cream kameez's neck identical in every cell; only the face changes.

Rendered exactly as the sheet and the lineup: the face at their level of likeness with the same slightly larger, open eyes; matte smooth skin with soft shading, no pores and no fine wrinkles; round thin gold glasses; the clothes simplified as the sheet, soft plain cloth with no knit, weave or embroidery texture: a plain red dupatta over her head covering her hair, a plain cream kameez with a few bold red motifs only at the neck. One warm soft key light from the upper left with soft shadows to the lower right; no outlines, no photorealism. No bindi, tilak or other religious markers.

Skin: exactly hex #D5906C in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background in every cell and gutter: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### NL. Nani leaning on the counter, neutral (the Cook base; an edit of her approved sheet)

Attach: `sheet-nani-final-1.png`, `lineup-v4-1.png`.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: her approved character SHEET (a four-view turnaround, a face close-up, her hands and her colour swatches on grey) and the LINEUP of three people on grey, where she is the woman in the MIDDLE. They are the only authority on who she is and how she is rendered: copy her face, the size of her eyes, her skin, her glasses, her dupatta, her clothes, her build and the whole finish from them exactly.

Draw her leaning on a kitchen counter, seen from the front and a little above, from the top of her head to the counter: both forearms lying flat on the counter top, folded loosely one over the other, both elbows resting on it, her upper body tilted a little forward towards us, a gentle neutral face with a small kind smile, mouth closed, looking at us. The counter's back edge is one straight horizontal line across the whole width of the image at about 72% of the height from the top; below that line, to the bottom edge, only the counter's warm white marble top with faint grey veins, with her forearms lying on it; above it, flat grey. Her whole head, both shoulders, both elbows and both hands inside the image with clear grey to the left and right of her; her figure from the top of her dupatta to the counter edge about 65% of the image height. Nothing else on the counter; soft contact shadows under her forearms on the marble only.

Rendered exactly as the sheet and the lineup: the face at their level of likeness with the same slightly larger, open eyes; matte smooth skin with soft shading, no pores and no fine wrinkles; the clothes simplified as the sheet, soft plain cloth with no knit, weave or embroidery texture: a plain cream kameez with long sleeves and a few bold red flower motifs only at the neck and the cuffs, a plain red dupatta over her head covering her hair and falling around her shoulders and down one side, round thin gold glasses, a thin pearl bracelet on her left wrist; NO rings on any finger. Slim, the lineup's build, never portly; her clothes modest and loose. Hands stylised like the girl's in the lineup: smooth, simple, rounded fingers, no veins, tendons or knuckle wrinkles, five fingers on each hand. One warm soft key light from the upper left with soft shadows to the lower right; no outlines, no photorealism. No bindi, tilak or other religious markers.

Skin: exactly hex #D5906C in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background above and beside the counter: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### NH. Happy (an edit; attach that one image only)

```
Edit the attached image. Change only her face: a warm happy smile, the eyes a little narrowed with it, the mouth closed. Every other pixel identical: the same pose, arms, hands, counter, size, position, clothes, skin colour, light and background.
```

#### NT. Talking (an edit; attach that one image only)

```
Edit the attached image. Change only her mouth: open it a little as if saying a word, the teeth just showing. Every other pixel identical: the same pose, arms, hands, size, position, clothes, skin colour, light and background.
```

#### NB. Blink (an edit; attach that one image only)

```
Edit the attached image. Change only her eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, arms, hands, size, position, clothes, skin colour, light and background.
```

#### NW0. Nani standing, front, neutral (the face-on base; an edit of her approved sheet)

Attach: `sheet-nani-final-1.png`, `lineup-v4-1.png`.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: her approved character SHEET (a four-view turnaround, a face close-up, her hands and her colour swatches on grey) and the LINEUP of three people on grey, where she is the woman in the MIDDLE. They are the only authority on who she is and how she is rendered: copy her face, the size of her eyes, her skin, her glasses, her dupatta, her clothes, her build and the whole finish from them exactly. This picture is the sheet's front turnaround panel drawn alone, large.

Draw her standing, full body, front-on to the viewer, both arms relaxed at her sides, hands open and loose, nothing in her hands, a gentle neutral face with a small kind smile, mouth closed, looking at us; the figure about 85% of the image height, centred, both feet on exactly the same invisible level, nothing touching an edge. Draw no floor and no shadow on the grey.

Rendered exactly as the sheet and the lineup: the face at their level of likeness with the same slightly larger, open eyes; matte smooth skin with soft shading, no pores and no fine wrinkles; the clothes simplified as the sheet, soft plain cloth with no knit, weave or embroidery texture: a plain cream knee-length kameez with long sleeves and a few bold red flower motifs only at the neck, the cuffs and the hem, straight cream trousers, a plain red dupatta over her head covering her hair and falling around her shoulders and down one side, flat cream shoes, round thin gold glasses, a thin pearl bracelet on her left wrist; NO rings on any finger. Slim, the lineup's build and proportions, never portly; her clothes modest and loose. Hands stylised like the girl's in the lineup: smooth, simple, rounded fingers, no veins, tendons or knuckle wrinkles, five fingers on each hand. One warm soft key light from the upper left with soft shadows to the lower right; no outlines, no photorealism. No bindi, tilak or other religious markers.

Skin: exactly hex #D5906C in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### NWT. Nani turned (a redraw of her face-on base; the line says the turn)

Attach: kept:NW-F, `sheet-nani-final-1.png`.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: first, her face-on STANDING picture (grey background), which is the base; second, her approved character SHEET, whose turnaround panels show her turned.

Draw the woman of the first picture again, changed in nothing but her turn: {VIEW}. Both arms stay relaxed at her sides, hands open and loose, nothing in her hands, the same gentle neutral face with a small kind smile, mouth closed. The figure at the same size as the first picture, her feet on the same invisible level at the same height, her head at the same height, nothing touching an edge, no floor, no shadow on the grey. Everything else identical to the first picture: the same face and eye size, skin, glasses, the plain red dupatta over her head, the plain cream kameez with its few red motifs, the same smooth stylised hands with five fingers and no rings, the same rendering, the same light from the upper left and the same grey.

Skin: exactly hex #D5906C in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```

#### NC. Nani standing at the counter (the counter base; a redraw of her face-on base)

Attach: kept:NW-F, `sheet-nani-final-1.png`, `lineup-v4-1.png`.

```
Generate an image, 1024×1536, portrait.

Three pictures are attached: first, her face-on STANDING picture (grey background), which is the base; second, her approved character SHEET; third, the LINEUP of three people, where she is the woman in the MIDDLE. The sheet and the lineup are the only authority on who she is and how she is rendered.

Draw the woman of the first picture again, standing upright behind a kitchen counter, seen from the front and a little above, from the top of her head to the counter: both hands resting lightly on the counter top a little apart, the same gentle neutral face with a small kind smile, mouth closed, looking at us. The counter's back edge is one straight horizontal line across the whole width of the image at about 72% of the height from the top; below that line, to the bottom edge, only the counter's warm white marble top with faint grey veins, with her hands resting on it; above it, flat grey. Her figure from the top of her dupatta to the counter edge about 65% of the image height, clear grey to the left and right of her. Nothing else on the counter; soft contact shadows under her hands on the marble only. Everything else identical to the first picture: the same face and eye size, skin, glasses, the plain red dupatta over her head, the plain cream kameez with its few red motifs, the same smooth stylised hands with five fingers and no rings, the same rendering and light from the upper left.

Skin: exactly hex #D5906C in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background above and beside the counter: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```

#### NP. A pose (a redraw of the base the line attaches first; the line says the pose)

Attach: the kept base first (a standing view, the leaning picture or the counter picture), `sheet-nani-final-1.png` second, `lineup-v4-1.png` third.

```
Generate an image, 1024×1536, portrait.

Three pictures are attached: first, her picture (grey background, with a marble counter if the base has one), which is the base; second, her approved character SHEET; third, the LINEUP of three people, where she is the woman in the MIDDLE. The sheet and the lineup are the only authority on who she is and how she is rendered.

Draw the woman of the first picture again, changed in nothing but her arms, hands, what they hold and her face, exactly so: {POSE}. Keep everything else identical to the first picture: the same turn of the body and head, the same size and position in the frame, the same feet or counter line in the same place, the same simplified clothes (the plain red dupatta over her head, the plain cream kameez with its few red motifs), the same rendering, the same skin, the same light from the upper left, the same grey (and the same marble, if any). Draw the new arms and hands in the same rendering as the rest of her: smooth stylised hands like the girl's in the lineup, simple rounded fingers, no veins, tendons or knuckle wrinkles, five fingers on each hand, NO rings on any finger. Nothing touches an edge; no floor, no shadow on the grey.

Skin: exactly hex #D5906C in the light, the sheet's skin swatch; the skin exactly this, never lighter, paler or pinker, never orange, never darker. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```
