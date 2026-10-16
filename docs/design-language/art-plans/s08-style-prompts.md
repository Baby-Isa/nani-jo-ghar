# s08: the doctor and Nani in the locked style, every view and gesture (pack `s08`)

**Written:** 16 Oct 2026 by the art planner, on Zafar's lock and his ask the same day ("Ensure we capture all the variations we need or might need … face on, quarter turn, half turn, left and right, arms down, arms waving, mid conversation, making a point, pointing up, pointing down … have a review about all the permutations that we need"). **Status:** ready for his go; nothing runs until he says so. Rules: `CLAUDE.md` 13 and 16; the doctor and Nani are real people, so **he approves every picture of them** (his ok in the chat is the pass). Run spec: `build/tools/art/specs/s08.run.yaml`; the block it generates: `s08-paste-block.txt` (never hand-edited). He runs the block himself in Claude in Chrome, download delivery (section 3).

## 0. The lock and the skin swatches

**Locked (Zafar, 16 Oct): `sources/art/s08/lineup-v4-1.png`**, the grandad (the doctor), Nani and the girl side by side. Faces keep the likeness at that level with slightly larger, open eyes (the V4-1 eyes; not the bigger V5 eyes). Bodies and clothes simplified: his plain navy blazer with a faint check, white open shirt, charcoal trousers, brown shoes, brown belt, silver watch on his left wrist; her plain cream kameez with a few bold red motifs at the neck, cuffs and hem, a plain red dupatta over her head, round gold glasses, thin bracelet and two rings, flat cream shoes, modest and loose. Nani 5'5"-5'6" beside his 5'8", slim, never portly. The girl unchanged (not in this run).

**Skin, sampled from the lineup (median of the face, skin pixels only).** The doctor **#D3997A** (lit forehead #E99F7A, cheek #CF8E74, hands #DE8764); Nani **#D48E6B** (lit forehead #E5A37A, cheek #D78D6A, hands #E8A77E); the girl #DE936C for comparison. Every prompt names its character's swatch; every check reads "skin within ΔE 6 of the sheet swatch"; `artjudge.py` measures it (`skin:` on the check). Zafar: "watch skin tone drift on all."

**The drift guard (how every picture is made).** (1) The character sheet first, redrawn from the lineup; Zafar approves it; it is attached to every later picture as the only authority on who and how. (2) The face-on standing base is drawn from the sheet. (3) A turn is a redraw of the face-on base ("changed in nothing but the turn"), with the s07 picture of that turn attached as the turn reference only. (4) A pose is a redraw of its view's base ("changed in nothing but the arms, hands and face"), with the s07 picture of that pose, where one exists, attached as the pose reference only. (5) Mouths and blinks are edits of the base. Nothing is generated fresh from words; faces, skin and feet lines register with the base, so the cutter can swap views in place. The s07 pictures (`sources/art/s07/doctor-*`) are never a rendering reference: their finish is the one being replaced.

## 1. Where they appear (the audit, 16 Oct)

| Place | Who, view, pose | Today | Pictures it needs |
|---|---|---|---|
| Clinic waiting room (`js/clinic/stages/waiting.js`, `data/clinic/scenes-v2.json` waiting.doctor) | the doctor front-on by his door, standing and waving, calling the next patient; mouth closed between lines | DD1 + DD2 (s07, wired) | wave front + the calling mouth |
| Clinic diagnosis (`diagnosis.js`) | three-quarter left to the patient while they talk, then front to the player; bubbles at his head | 3q-left + talk + blink; front (no faces: his mouth is still when he talks front) | 3q-left, front, each with talk and blink |
| Clinic send-off (`sendoff.js`) | three-quarter right to the girl at the door; waves her off | 3q-right (no faces), wave-3q-right | 3q-right with talk and blink; wave 3q-right |
| Clinic pharmacy and his box, cards (`common.js` `S.doctorFace`, `Kit.doctorFace`) | his face in the guide box and on cards: neutral, talk, laugh, think | cut from `doctor-ref-faces-v1.png` | the face sheet (12, registered) |
| Clinic stage 2's "does it hurt here?", the tool cues, "that's it" | pointing at the part, finger up, the torch at the eye | not drawn (words only) | point-left 3q-left, finger-up, torch (LIKELY) |
| Cook: every station, the greeting, the orders, the day summaries, the shop (`js/cook/stations.js`, `js/cook/flow.js`, `data/cook.json` art.assets.shared) | Nani leaning on the counter: neutral, happy, talk, point, blink | N1-N5 (s07, wired as `nani-*-v2.webp`) | the five leaning pictures again |
| Nani's guide box in every mode, the Cook cover, story cards (`js/shared/guide.js`, `js/shared/story.js`, `nani-badge.webp`) | her face | the old badge | the face sheet (12, registered) |
| First launch (`data/story/first-launch.json`, `docs/game-design/modes/first-launch.md`) | Nani talks, points at the kitchen, holds out a spoon, hugs the child, sips chai | the old waist-up pictures with a ledge; SVG placeholder panels | standing front with talk; point-left/right; the counter set (LIKELY) |
| Story by the fire, the bazaar, travel, conversations at the door (`docs/game-design/modes/story-by-the-fire.md`, `docs/game-design/modes/conversations.md`: "someone enters and speaks to whoever is there; Nani answers, then turns to the player") | Nani standing, turned to a visitor then to the player; waving, welcoming, celebrating | nothing drawn | standing turns, waves, gestures (LIKELY) |
| The house (`js/home.js`) | nobody drawn today | | none |

**The s07 doctor set** (`sources/art/s07/`, 41 standing pictures, `s07-art-run-log.txt`): neutral, arms folded, point-left, finger-up, arms-up, torch and wave in five views each (front, 3q-left, 3q-right, side-left, side-right; point-left's 3q-right was rejected), the door call with its closed mouth, four waving turns, talk and blink on the 3q-left, the faces sheet, the seated portrait and the sheet. Wired: 3q-left (+talk, blink), front, 3q-right, wave-3q-right, wave-front (+closed mouth), four faces. The other 33 are unwired spares; in this run they serve only as pose and turn references.

## 2. The permutation matrix

Views: **F** face-on, **QL** quarter turn to the viewer's left, **QR** quarter turn to the viewer's right, **SL** side-on left, **SR** side-on right. Cells: **NEED** (wired today or certainly next), **LIKELY** (planned story and modes), **SKIP** (never seen: a side view hides the face, a point behind oneself). The letter is the part that makes it.

### The doctor

| Pose | F | QL | QR | SL | SR |
|---|---|---|---|---|---|
| Arms down, neutral (the view base) | NEED A | NEED A | NEED A | LIKELY C3 | LIKELY C3 |
| Talking mouth (edit) | NEED A | NEED A | NEED A | SKIP | SKIP |
| Blink (edit) | NEED A | NEED A | NEED A | SKIP | SKIP |
| Waving (+ the open calling mouth, F) | NEED A | LIKELY C2 | NEED A | LIKELY C3 | LIKELY C3 |
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

Plus his sheet and his face sheet (A). Doctor: **14 NEED, 39 LIKELY.**

### Nani

| Pose | F | QL | QR | SL | SR |
|---|---|---|---|---|---|
| Leaning on the counter: neutral, happy, talk, point, blink (N1-N5) | NEED B (5) | SKIP | SKIP | SKIP | SKIP |
| Standing, arms down, neutral (the view base) | NEED B | LIKELY C1 | LIKELY C1 | LIKELY C3 | LIKELY C3 |
| Talking mouth (edit) | NEED B | LIKELY C1 | LIKELY C1 | SKIP | SKIP |
| Blink (edit) | NEED B | SKIP | SKIP | SKIP | SKIP |
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

Plus her sheet and her face sheet (B). Nani: **10 NEED, 31 LIKELY.**

**The face sheets (one each, registered):** twelve expressions on one 4 by 3 grid with the head in exactly the same place and size in every cell: neutral, talking A (mouth a little open), talking B (wide open, teeth showing), smiling, laughing, blink, surprised, thinking, concerned, proud, encouraging nod, listening. They feed the guide box, the cards and the talk animation (two mouth shapes). The doctor's today is cut from `doctor-ref-faces-v1.png` (not registered); Nani has only a badge.

## 3. The run: order, time, safe stops

| Part | Lines | What lands | His time |
|---|---|---|---|
| **A** The doctor, NEED | 14 | his sheet and face sheet; front, 3q-left and 3q-right bases, each with talk and blink; wave front with the calling mouth; wave 3q-right | about 45 min (the sheet, then the front base, then the turns each wait for his ok before anything attaches them) |
| **B** Nani, NEED | 10 | her sheet and face sheet; the five leaning pictures; her standing front base with talk and blink | about 35 min |
| **C1** Talking and pointing, LIKELY | 29 | both: mid-conversation, making a point, pointing left and right, finger up; Nani's quarter turns with talk | about 55 min |
| **C2** Waves, up and down, welcome and celebrate, LIKELY | 21 | both: pointing up and down, welcoming, celebrating; his wave 3q-left; her waves | about 40 min |
| **C3** Folded, thinking, torch, the counter set, the side views, LIKELY | 20 | his folded, thinking, torch; her folded, thinking, counter base, tray, stirring; both side views, his side waves | about 40 min |
| | **94** | | **about 3 h 35** |

**Time:** three windows, about 1.5 to 2 minutes a line once they flow, a quarter redone; parts A and B are slower because every real-person picture waits for his ok before it is attached to the next. **Every part boundary is a safe stop:** A leaves the clinic's doctor complete in the new style, B leaves Cook's Nani and both face sheets, C1-C3 add the story and conversation set in value order. The block downloads whatever is kept at any stop.

**How he runs it.** He pastes `s08-paste-block.txt` into Claude in Chrome and watches. Download delivery (s07, 15 Oct: ChatGPT serves images as in-page blobs and page-JavaScript uploads were refused): every kept image stays in its chat, logged with the chat link and save-as name; later prompts attach kept images from ChatGPT's library; at the end (or at a stop) the runner downloads them in run order with ChatGPT's own download button, logging "DOWNLOADED n: save-as", and Zafar uploads the folder as `sources/art/s08/`. He must attach nothing himself: every reference is fetched from the branch raw (`claude/new-session-b5r2am`, where the lineup and the s07 pictures live until they are published). His ok in the chat is the pass for every picture.

## 4. After the run (Claude)

1. `artjudge.py` on the pack (skin ΔE against the swatches above; edits by pixel diff against their base, mean under 5; poses and turns registered on the base's feet line).
2. Likeness, by Zafar's eye: each sheet's face close-up beside the lineup at one head height.
3. Cut (`artcut.py`, a new `s08.cut.json`): the doctor's five views on one `fig_h` with talk and blink layers, the wave front with the calling mouth as a face layer, the twelve faces as 512 px heads; Nani's five leaning pictures to `nani-*-v3.webp` (the seven paths in `data/cook.json` and `js/cook/flow.js`), her standing base and faces, her badge from the face sheet.
4. Wire (`/brief`, then `/review`): `data/clinic/heal-art.json` views re-measured with faces on front and 3q-right; the guide box faces; part C pictures stay as cut spares until a mode asks for them (an idea row names each).

## 5. The prompts

Every prompt is pasted as is into a fresh chat with exactly the files on its line, its {SLOT}s filled word for word from the line. Sizes: a sheet 1536×1024; a standing picture 1024×1536; the leaning and counter pictures 1024×1536.

#### DS. The doctor's sheet, from the lineup

Attach: `lineup-v4-1.png`, `doctor-s1-sheet-v1.png`.

```
Generate an image, 1536×1024, landscape.

Two pictures are attached: a LINEUP of three people on grey (landscape) and an OLD character sheet (several panels on light blue-grey). The man on the LEFT of the lineup is the doctor. The lineup is the only reference for WHO he is and HOW he is rendered: his face, the size of his eyes, his skin, his white hair and beard, his glasses, his clothes and the whole finish. The old sheet gives only the idea of a character sheet; its rendering, its bag and its clothes are not used.

Draw his character sheet: a full-body turnaround (front, three-quarter left, side left, back) standing on one invisible floor with every pair of feet on one level, arms relaxed at the sides, a gentle neutral face with a small kind smile; a large face close-up front-on; a face close-up turned three-quarters; both hands, palm and back; the glasses and the watch alone; and a strip of round colour swatches: his skin in the light, his skin in shadow, his beard, the blazer's navy, the shirt's white, the trousers' charcoal, the shoes' brown. Panels spaced clearly apart, nothing touching a panel's neighbour or the image edges.

The same man in every panel, identical clothing: bald on top with short white side hair, a short neat solid white beard, clear thin rectangular glasses, a white open-collared shirt under a plain navy-blue blazer with a faint check, charcoal trousers with a brown belt, brown leather shoes, a silver watch on his LEFT wrist, no bag, no stethoscope. Rendered exactly as in the lineup: his face at the lineup's level of likeness, the eyes slightly larger and open as there, matte smooth skin with soft shading and no pores or fine wrinkles, hair and beard as soft solid white masses, the body and clothes simplified with soft plain cloth and no visible weave, simple hands with rounded fingers, glasses with simple frames and no refraction, one warm soft key light from the upper left with soft shadows to the lower right, no outlines, no photorealism.

Skin: exactly the warm light tan of his face in the lineup, about hex #D3997A in the light; never orange, never pink, never darker or paler than the lineup. Background: one flat, uniform light blue-grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

#### DX. The doctor's twelve faces, registered (attach his kept sheet first)

Attach: kept:DS, `doctor-ref-faces-v1.png`.

```
Generate an image, 1536×1024, landscape.

Two pictures are attached: his character SHEET (panels on light blue-grey) and an OLD faces sheet (twelve head-and-shoulders faces in a 4 by 3 grid). The old sheet gives only the grid and the framing (head and shoulders, front-on, one face per cell); its expressions and its rendering are not used. The SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Draw twelve head-and-shoulders faces of him, front-on, in a 4 by 3 grid, in this order, left to right then top to bottom: 1 neutral (a small kind smile, mouth closed); 2 talking A (the mouth a little open, as on a short vowel); 3 talking B (the mouth open wide, the teeth showing, as on a long vowel); 4 smiling (a warm closed smile); 5 laughing (a big open laugh, the eyes crinkled); 6 blink (both eyes gently closed, the face otherwise as 1); 7 surprised (brows up, eyes wide, the mouth a small o); 8 thinking (eyes up and to one side, lips pressed, one brow up); 9 concerned (brows drawn a little together, a small kind frown); 10 proud (chin a little up, a broad closed smile, soft eyes); 11 encouraging nod (the head tipped a few degrees down, a warm smile, eyes on us); 12 listening (the head tipped a few degrees to one side, mouth closed, brows soft, attentive).

REGISTERED: the head exactly the same size and in exactly the same place in every cell, the eyes on one line across each row and the nose on each cell's centre line, so that any two cells can be swapped without the head moving; the head tilts only in cells 11 and 12 and only by a few degrees. Glasses, beard, hair, shirt and blazer identical in every cell; only the face changes. Nothing crosses a cell boundary. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear thin rectangular glasses, white open-collared shirt, plain navy blazer with a faint check.

Skin: exactly the sheet's swatch, about hex #D3997A in the light; never orange, never pink, never darker or paler than the sheet. Background in every cell: one flat, uniform light blue-grey as the sheet. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DW0. The doctor standing, front, neutral (the face-on base)

Attach: kept:DS, `doctor-w1-stand-front-neutral-v1.png`.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: his character SHEET (panels on light blue-grey) and an OLD standing picture of the same man (grey background) in a rendering that is wrong and must not be copied. The old picture gives only the pose, the size, the framing and the position of the feet. The SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Draw him standing, full body, front-on to the viewer, both arms relaxed at his sides, hands open and loose, nothing in his hands, a gentle neutral face with a small kind smile, mouth closed, looking at us; the figure at the same size and position as in the old picture (about 85% of the image height, both feet on exactly the same invisible level, nothing touching an edge). Draw no floor and no shadow on the grey.

Rendered exactly as the sheet: the same face and eye size, the same skin finish, the same hair and beard, the same cloth, the same light from the upper left, the same soft edges, the same proportions. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear thin rectangular glasses, white open-collared shirt, plain navy blazer with a faint check, charcoal trousers, brown belt, brown leather shoes, silver watch on his left wrist. No bag, no stethoscope.

Skin: exactly the sheet's swatch, about hex #D3997A in the light; never orange, never pink, never darker or paler than the sheet. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

#### DWT. The doctor turned (a redraw of his face-on base; the line says the turn)

Attach: kept:DW-F, kept:DS, the s07 picture of that turn.

```
Generate an image, 1024×1536, portrait.

Three pictures are attached: first, his face-on STANDING picture (grey background), which is the base; second, his character SHEET; third, an OLD picture of the same man already turned, in a rendering that is wrong and must not be copied (it shows only the turn and the feet).

Draw the man of the first picture again, changed in nothing but his turn: {VIEW}. Both arms stay relaxed at his sides, hands open and loose, nothing in his hands, the same gentle neutral face with a small kind smile, mouth closed. The figure at the same size as the first picture, his feet on the same invisible level at the same height, his head at the same height, nothing touching an edge, no floor, no shadow on the grey. Drawn, not flipped: the watch stays on his LEFT wrist. Everything else identical to the first picture: the same face and eye size, skin, hair and beard, glasses, clothes, rendering, light from the upper left and grey.

Skin: exactly the sheet's swatch, about hex #D3997A in the light; never orange, never pink, never darker or paler than the sheet. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

#### DT. Talking (an edit; attach that one image only)

```
Edit the attached image. Change only his mouth: open it a little as if saying a word, the teeth just showing. Every other pixel identical: the same pose, size, position, clothes, skin, light and background.
```

#### DB. Blink (an edit; attach that one image only)

```
Edit the attached image. Change only his eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, size, position, clothes, skin, light and background.
```

#### DC. The calling mouth (an edit of his waving front picture; attach that one image only)

```
Edit the attached image. Change only his mouth: open it in a wide friendly call, as if calling the next patient in, the teeth showing, the smile kept. Every other pixel identical: the same raised hand, pose, size, position, clothes, skin, light and background.
```

#### DP. A pose (a redraw of the view's base; the line says the pose)

Attach: the view's kept base first, kept:DS second, and third, where the line has one, the s07 picture of that pose.

```
Generate an image, 1024×1536, portrait.

Two or three pictures are attached: first, his STANDING picture (grey background), which is the base; second, his character SHEET; third, if present, an OLD picture of the same man in a rendering that is wrong and must not be copied, which shows only the arm pose to copy.

Draw the man of the first picture again, changed in nothing but his arms, hands and face, exactly so: {POSE}. Keep everything else identical to the first picture: the same turn of the body and head, the same size and position in the frame, both feet on the same invisible level in the same place, the same clothes, the same rendering, the same skin, the same light from the upper left, the same grey. Draw the new arms and hands in the same rendering as the rest of him, never as the third picture. The watch stays on his LEFT wrist. Nothing touches an edge; no floor, no shadow on the grey.

Skin: exactly the sheet's swatch, about hex #D3997A in the light; never orange, never pink, never darker or paler than the sheet. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

#### NS. Nani's sheet, from the lineup

Attach: `lineup-v4-1.png`, `nani-n1-lean-neutral-v1.png`.

```
Generate an image, 1536×1024, landscape.

Two pictures are attached: a LINEUP of three people on grey (landscape) and an OLD picture of a woman leaning on a marble counter (portrait). The woman in the MIDDLE of the lineup is Nani. The lineup is the only reference for WHO she is and HOW she is rendered: her face, the size of her eyes, her skin, her glasses, her clothes, her build and the whole finish. The old leaning picture shows her features large: use it only for the likeness of her face (the shape of her face, her eyes, her brows, her nose and her smile), drawn at the lineup's level of stylising; its rendering, its embroidery and its knitted dupatta are not used.

Draw her character sheet: a full-body turnaround (front, three-quarter left, side left, back) standing on one invisible floor with every pair of feet on one level, arms relaxed at the sides, a gentle neutral face with a small kind smile; a large face close-up front-on; a face close-up turned three-quarters; both hands, palm and back (a thin bracelet on her right wrist, a small red-stone gold ring on her right hand, a small gold ring on her left); a close-up of one red motif from her kameez; and a strip of round colour swatches: her skin in the light, her skin in shadow, the kameez's cream, the dupatta's red, the glasses' gold. Panels spaced clearly apart, nothing touching a panel's neighbour or the image edges.

The same woman in every panel, identical clothing, exactly as the lineup: a plain cream knee-length kameez with long sleeves and a few bold red flower motifs at the neck, the cuffs and the hem, straight cream trousers, a plain red dupatta over her head covering her hair and falling around her shoulders and down one side, flat cream shoes with a little gold, round thin gold glasses, small gold earrings. Slim, the lineup's build and proportions, never portly; her clothes modest and loose. Rendered exactly as in the lineup: her face at the lineup's level of likeness, the eyes slightly larger and open as there, matte smooth skin with soft shading and no pores or fine wrinkles, the dupatta and kameez soft plain cloth with no knit, weave or fine folds, simple hands with rounded fingers, glasses with simple frames and no refraction, one warm soft key light from the upper left with soft shadows to the lower right, no outlines, no photorealism.

Skin: exactly the warm light tan of her face in the lineup, about hex #D48E6B in the light; never orange, never pink, never darker or paler than the lineup. Background: one flat, uniform light blue-grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers.
```

#### NX. Nani's twelve faces, registered (attach her kept sheet first)

Attach: kept:NS, `doctor-ref-faces-v1.png`.

```
Generate an image, 1536×1024, landscape.

Two pictures are attached: her character SHEET (panels on light blue-grey) and an OLD faces sheet of a different person (twelve head-and-shoulders faces in a 4 by 3 grid). The old sheet gives only the grid and the framing (head and shoulders, front-on, one face per cell); its person, its expressions and its rendering are not used. The SHEET gives who she is and exactly how she is rendered; copy its rendering exactly.

Draw twelve head-and-shoulders faces of her, front-on, in a 4 by 3 grid, in this order, left to right then top to bottom: 1 neutral (a small kind smile, mouth closed); 2 talking A (the mouth a little open, as on a short vowel); 3 talking B (the mouth open wide, the teeth showing, as on a long vowel); 4 smiling (a warm closed smile); 5 laughing (a big open laugh, the eyes crinkled); 6 blink (both eyes gently closed, the face otherwise as 1); 7 surprised (brows up, eyes wide, the mouth a small o); 8 thinking (eyes up and to one side, lips pressed, one brow up); 9 concerned (brows drawn a little together, a small kind frown); 10 proud (chin a little up, a broad closed smile, soft eyes); 11 encouraging nod (the head tipped a few degrees down, a warm smile, eyes on us); 12 listening (the head tipped a few degrees to one side, mouth closed, brows soft, attentive).

REGISTERED: the head exactly the same size and in exactly the same place in every cell, the eyes on one line across each row and the nose on each cell's centre line, so that any two cells can be swapped without the head moving; the head tilts only in cells 11 and 12 and only by a few degrees. Glasses, the red dupatta over her head and the cream kameez's neck identical in every cell; only the face changes. Nothing crosses a cell boundary.

Skin: exactly the sheet's swatch, about hex #D48E6B in the light; never orange, never pink, never darker or paler than the sheet. Background in every cell: one flat, uniform light blue-grey as the sheet. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other religious markers.
```

#### NL. Nani leaning on the counter, neutral (the Cook base)

Attach: kept:NS, `nani-n1-lean-neutral-v1.png`.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: her character SHEET (panels on light blue-grey) and an OLD picture of her leaning on a marble counter (portrait) in a rendering that is wrong and must not be copied. The old picture gives only the pose, the framing, the size and the counter: both forearms flat along the counter top, folded loosely one over the other, both elbows resting on it, her upper body tilted a little forward, her head and shoulders in the same place, the counter's back edge a straight horizontal line across the whole image at the same height, the marble top in front of her down to the bottom edge. The SHEET gives who she is and exactly how she is rendered; copy its rendering and its clothes exactly.

Draw her again exactly so: leaning on the counter as in the old picture, a gentle neutral face with a small kind smile, mouth closed, looking at us; the plain cream kameez with its few bold red motifs at the neck and cuffs, the plain red dupatta over her head, the round gold glasses, the thin bracelet and the two rings, as the sheet. Her whole head, both shoulders, both elbows and both hands inside the image with clear grey on the left and right. Nothing else on the counter. Soft contact shadows under her forearms on the marble only.

Rendered exactly as the sheet: the same face and eye size, the same skin finish, soft plain cloth with no knit or weave, simple hands, simple glasses, light from the upper left, soft edges. Skin: exactly the sheet's swatch, about hex #D48E6B in the light; never orange, never pink, never darker or paler than the sheet. Background above and beside the counter: one flat, uniform neutral mid-grey, hex #808080; the marble as the old picture, warm white with faint veins. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```

#### NH. Happy (an edit; attach that one image only)

```
Edit the attached image. Change only her face: a warm happy smile, the eyes a little narrowed with it, the mouth closed. Every other pixel identical: the same pose, arms, counter, size, position, clothes, skin, light and background.
```

#### NT. Talking (an edit; attach that one image only)

```
Edit the attached image. Change only her mouth: open it a little as if saying a word, the teeth just showing. Every other pixel identical: the same pose, arms, size, position, clothes, skin, light and background.
```

#### NB. Blink (an edit; attach that one image only)

```
Edit the attached image. Change only her eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, arms, size, position, clothes, skin, light and background.
```

#### NW0. Nani standing, front, neutral (the face-on base)

Attach: kept:NS.

```
Generate an image, 1024×1536, portrait.

One picture is attached: her character SHEET (panels on light blue-grey). It gives who she is and exactly how she is rendered; copy its rendering, its clothes and its front turnaround panel exactly.

Draw her standing, full body, front-on to the viewer, both arms relaxed at her sides, hands open and loose, nothing in her hands, a gentle neutral face with a small kind smile, mouth closed, looking at us; the figure about 85% of the image height, both feet on exactly the same invisible level, nothing touching an edge. Draw no floor and no shadow on the grey.

Rendered exactly as the sheet: the same face and eye size, the same skin finish, the same soft plain cloth, the same light from the upper left, the same soft edges, the same slim proportions. Keep every identifying feature: the plain cream kameez with its few bold red motifs at the neck, cuffs and hem, straight cream trousers, the plain red dupatta over her head, flat cream shoes, round thin gold glasses, the thin bracelet and the two rings.

Skin: exactly the sheet's swatch, about hex #D48E6B in the light; never orange, never pink, never darker or paler than the sheet. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; her clothes modest and loose, her dupatta over her head.
```

#### NWT. Nani turned (a redraw of her face-on base; the line says the turn)

Attach: kept:NW-F, kept:NS.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: first, her face-on STANDING picture (grey background), which is the base; second, her character SHEET.

Draw the woman of the first picture again, changed in nothing but her turn: {VIEW}. Both arms stay relaxed at her sides, hands open and loose, nothing in her hands, the same gentle neutral face with a small kind smile, mouth closed. The figure at the same size as the first picture, her feet on the same invisible level at the same height, her head at the same height, nothing touching an edge, no floor, no shadow on the grey. Everything else identical to the first picture: the same face and eye size, skin, glasses, dupatta over her head, clothes, rendering, light from the upper left and grey.

Skin: exactly the sheet's swatch, about hex #D48E6B in the light; never orange, never pink, never darker or paler than the sheet. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```

#### NC. Nani standing at the counter (the counter base)

Attach: kept:NW-F, kept:NS, `nani-n1-lean-neutral-v1.png`.

```
Generate an image, 1024×1536, portrait.

Three pictures are attached: first, her face-on STANDING picture (grey background), which is the base; second, her character SHEET; third, an OLD picture of her leaning on a marble counter in a rendering that is wrong and must not be copied, which gives only the counter and the framing (waist up, the counter's back edge a straight horizontal line across the whole image at about 82% down, the marble top in front of her down to the bottom edge, her figure from the top of her dupatta to the counter edge about 65% of the image height).

Draw the woman of the first picture again, standing upright behind that counter, seen waist up, front-on, both hands resting lightly on the counter top a little apart, the same gentle neutral face with a small kind smile, mouth closed, looking at us. Nothing else on the counter; soft contact shadows under her hands on the marble only. Everything else identical to the first picture: the same face and eye size, skin, glasses, dupatta over her head, kameez, rendering and light from the upper left.

Skin: exactly the sheet's swatch, about hex #D48E6B in the light; never orange, never pink, never darker or paler than the sheet. Background above and beside the counter: one flat, uniform neutral mid-grey, hex #808080; the marble as the third picture, warm white with faint veins. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```

#### NP. A pose (a redraw of the base the line attaches first; the line says the pose)

Attach: the kept base first (a standing view, the leaning picture or the counter picture), kept:NS second, and third, where the line has one, the s07 picture of that pose.

```
Generate an image, 1024×1536, portrait.

Two or three pictures are attached: first, her picture (grey background, with a marble counter if the base has one), which is the base; second, her character SHEET; third, if present, an OLD picture of her in a rendering that is wrong and must not be copied, which shows only the arm pose to copy.

Draw the woman of the first picture again, changed in nothing but her arms, hands, what they hold and her face, exactly so: {POSE}. Keep everything else identical to the first picture: the same turn of the body and head, the same size and position in the frame, the same feet or counter line in the same place, the same clothes, the same rendering, the same skin, the same light from the upper left, the same grey (and the same marble, if any). Draw the new arms and hands in the same rendering as the rest of her, never as the third picture. Nothing touches an edge; no floor, no shadow on the grey.

Skin: exactly the sheet's swatch, about hex #D48E6B in the light; never orange, never pink, never darker or paler than the sheet. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```
