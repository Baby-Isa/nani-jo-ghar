# s08: lock the style of the real people, then the doctor (pack `s08`)

**Written:** 16 Oct 2026 by the style judge; revised the same day on Zafar's reply ("Are you sure Nani and the girl will look okay? Now is the time to lock in character design … keep the resemblance in the face, match the rest through the body, clothing or something else"). **Status:** a proposal; nothing runs until he says go. Judgement behind it: `build/reports/s07-style-judge.md`. Rules: `CLAUDE.md` 13 and 16; the doctor and Nani are real people, so **he approves every picture of them**. Run spec: `build/tools/art/specs/s08.run.yaml`; the block it generates: `s08-paste-block.txt` (never hand-edited).

## 0. The honest answer to "are you sure?"

No. Nani's N1 is visibly more real than the girl: real skin texture, normal-size eyes, a knitted dupatta. Beside Ma at the counter the gap is small, but beside the girl on one floor "one film" is not certain, and bringing the doctor to N1's level (my first plan) would lock that uncertainty in. So the run starts with a **style lock**: three lineups he judges by eye before any pose is made. His idea is the one worth testing: keep the likeness in the face and match the rest through the body, the clothes and the render finish.

## 1. The lock: three lineups, then STOP

Each is one picture: the doctor, Nani, the girl and Nana standing on one floor, front-on, true heights (the doctor about 1.5× the girl, her crown at his chest), flat grey. The same five files attached to each; three windows at once, about ten minutes.

| ID | What it tests | Save as |
|---|---|---|
| **LA** | My first plan: the doctor brought to Nani's N1 level; Nani and the girl exactly as they are. Does the girl look like a child from the same film as two slightly-real adults? | `lineup-la-v1.png` |
| **LB** | Zafar's idea: the doctor's and Nani's **faces kept exactly** (shape, glasses, beard and hairline, the dupatta's framing, skin tone); everything below the neck and the whole finish brought into the girl's world (rounder simpler bodies, plain soft cloth with no weave or pores, simpler hands, her smooth skin finish and soft light, the same soft edges; eyes a touch larger only if the likeness holds). Nani stays modest. | `lineup-lb-v1.png` |
| **LC** | LB plus the girl one small step toward them (eyes about fifteen percent smaller, a touch more real skin shading, head a touch smaller). Included because the gap is two levels and it may close faster from both ends; **not recommended** unless A and B both fail: the girl has about 25 wired pictures across three packs, and C redraws all of them (only her two bases are in this run). Zafar, 16 Oct: "she does seem to suit the artwork quite nicely." | `lineup-lc-v1.png` |

**How he picks.** The runner posts the three with their chat links and stops. Zafar looks at them at one size and answers in the chat with one of: **"pick A"**, **"pick B"**, **"pick C"** or **"none"**. The runner then runs only that branch; "none" ends the run with the log and we rethink. My expectation: B, if the faces survive; the lineup shows that at once.

## 2. What runs after the pick

| Pick | Lines | Images | His time | What lands |
|---|---|---|---|---|
| A | DS2, then DW1, DF1, DF3, DW1F, DW1QR, DA6QR, DD1, DD2, DR2 | 10 (+3 redos likely) | about 1 h, approving as they land | the doctor at Nani's level: his sheet, the 8 wired pictures, his 12 card faces. Nani and the girl unchanged |
| B | DS2B, then the same nine poses (the same prompts, attaching DS2B), then N1B, N2B, N3B, N4B, N5B | 15 (+4) | about 1 h 20 | the doctor and Nani in the soft finish: his sheet and poses, her N1 redone as an edit of itself, her four moods as edits of the new N1 |
| C | branch B with LC attached wherever a line says kept:LB, then GW1C, GW13C | 17 (+4) | about 1 h 30 | as B, plus the girl's seated and standing bases; the rest of her set in a later pack |

The wired doctor pictures (`data/clinic/heal-art.json` `doctor.views`): 3q-left (+ talk, blink), front, 3q-right, wave-3q-right, wave-front (+ closed mouth), and his four card faces cut from the faces sheet. The other 33 kept s07 turns are unwired spares and are not redone. Dependencies: every pose attaches the branch's sheet; DF1, DF3 edit DW1; DD2 edits DD1; N2B, N3B, N5B edit N1B and N4B attaches it.

## 3. How Zafar runs it

He pastes `s08-paste-block.txt` into Claude in Chrome and watches. The block is in **download mode** (s07, 15 Oct: ChatGPT serves images as in-page blobs and the page-JavaScript route to GitHub was refused, so nothing landed and he downloaded by hand): every kept image stays in its chat, the log carries its chat link and save-as name, kept images are attached to later prompts from ChatGPT's library, and at the very end the runner downloads them in run order with ChatGPT's own download button, logging "DOWNLOADED n: save-as" so the files can be renamed in order. Zafar then uploads the folder as `sources/art/s08/`. The runner never tries page-JavaScript uploads. Real people: his ok in the chat is the pass. Nothing from parts A, B or C starts before his pick.

## 4. After the run (Claude)

1. Likeness: the chosen sheet's front and three-quarter faces beside `doctor-s1-sheet-v1.png` at one head height; under B, N1B beside N1 the same way. Zafar's eye decides.
2. Level: the lineup's four heads at one head height; under B no pores, weave or single hairs at 2× zoom on anyone.
3. `artjudge.py` on the pack; pose edits by pixel diff against their base (mean under 5, as N2/N5 were).
4. Cut: `s07.cut.json` re-run on `sources/art/s08/` (feet, stand and head re-measured); `heal-art.json` `doctor.fig_h` and the views re-measured; the `scenes-v2.json` scale numbers from the judge report applied in the same session.
5. **Nani under B:** the five cook moods are five rows in `data/cook.json` (`nani-neutral`, `-talk`, `-happy`, `-point`, `-blink` → `assets/cook/characters/nani-*-v2.webp`) plus two `nani-happy-v2.webp` paths in `js/cook/flow.js`. N1B–N5B are cut the way N1–N5 were (the s07-cook session's method) to `-v3.webp`, and those seven paths change; no code logic changes. Under A nothing of Nani's changes.

## 5. The prompts

Every prompt is pasted as is into a fresh chat with exactly the files on its line. Sizes: a lineup or a sheet 1536×1024; a standing picture 1024×1536; DD1 1024×1024.

### The three finishes, in words (used inside the prompts below)

- **Nani's level (A):** smooth, simple skin with no pores and no fine wrinkles (age shown by two or three soft lines, the shape of the face and the white hair, not by texture); hair and beard as soft solid masses with a few simple strands; eyes a little larger and rounder than real with one clear highlight each; nose, ears and hands simplified and softly rounded; cloth smooth with any pattern quiet and simplified, no visible weave; softer rounder forms, the head a little larger for the body; soft global illumination, warm light from the upper left, soft shadows to the lower right, no outlines, no photorealism.
- **The girl's world (B):** the face kept exactly; everything else as the attached girl: matte poreless skin with a soft even sheen, rounder simpler body forms, soft plain cloth with no weave and no fine folds, hair and beard as soft solid masses, simpler hands with soft rounded fingers, clear glasses with simple frames and no refraction, one warm soft key light from the upper left with soft shadows, the same soft edges; the eyes a touch larger than real only if the face still reads as the same person.

#### LA. The lineup, the doctor at Nani's level

Attach: `doctor-s1-sheet-v1.png`, `nani-n1-lean-neutral-v1.png`, `nani-sheet-v2-approved.png`, `s1-girl-sheet-v2.png`, `char-nana-v1.png`.

```
Generate an image, 1536×1024, landscape.

Draw four game characters standing in a row on one flat invisible floor, all feet on exactly the same level, seen straight on at eye level, full body, arms relaxed at their sides, each a gentle neutral face with a small smile. From left to right: the DOCTOR (from the attached doctor character sheet: bald on top with short white side hair, a short neat white beard, clear rectangular glasses, a white open-collared shirt under a navy-blue check blazer, charcoal trousers, brown leather shoes, a silver watch on his left wrist, no bag), NANI (her face, glasses and rendering exactly as the attached leaning picture of her; her standing body, cream kurta with red embroidery, loose trousers and red dupatta over her head from the attached Nani sheet's front panel), the LITTLE GIRL (exactly as the attached girl sheet's standing front panel: yellow dress, white leggings, white sandals, two plaits with white bows) and NANA (exactly as the attached Nana sheet's front panel). True relative heights: the doctor about 170 cm, Nani about 155 cm, the girl about 110 cm (her head top at the doctor's chest), Nana about 165 cm. Clear space between them; nothing touches the edges of the image.

Rendering: Nani, the girl and Nana exactly as their attached pictures, changed in nothing. The doctor rendered at exactly the level of stylising of the attached Nani picture, and no more photographic than Nana: smooth, simple skin with no pores and no fine wrinkles (his age shown by two or three soft lines, the shape of his face and his white hair and beard, not by texture); the beard and side hair soft solid white masses with a few simple strands; the eyes a little larger and rounder than real with one clear highlight each, behind clear glasses with simple frames and no refraction; nose, ears and hands simplified and softly rounded; the blazer's check a quiet simplified pattern with no visible weave; softer rounder forms, the head a little larger for the body. Everyone lit by one warm key light from the upper left with soft shadows to the lower right, a soft contact shadow under each pair of feet, no outlines, no photorealism.

Skin a warm light tan, never orange, never pink. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; Nani's clothes modest and loose, her dupatta over her head.
```

#### LB. The lineup, faces kept, the rest in the girl's world

Attach: the same five files as LA.

```
Generate an image, 1536×1024, landscape.

Draw four game characters standing in a row on one flat invisible floor, all feet on exactly the same level, seen straight on at eye level, full body, arms relaxed at their sides, each a gentle neutral face with a small smile. From left to right: the DOCTOR (from the attached doctor character sheet: bald on top with short white side hair, a short neat white beard, clear rectangular glasses, a white open-collared shirt under a navy-blue check blazer, charcoal trousers, brown leather shoes, a silver watch on his left wrist, no bag), NANI (her face and glasses exactly as the attached leaning picture of her; her standing body, cream kurta with red embroidery, loose trousers and red dupatta over her head from the attached Nani sheet's front panel), the LITTLE GIRL (exactly as the attached girl sheet's standing front panel: yellow dress, white leggings, white sandals, two plaits with white bows) and NANA (exactly as the attached Nana sheet's front panel). True relative heights: the doctor about 170 cm, Nani about 155 cm, the girl about 110 cm (her head top at the doctor's chest), Nana about 165 cm. Clear space between them; nothing touches the edges of the image.

Rendering: the girl and Nana exactly as their attached pictures, changed in nothing. The doctor and Nani: KEEP THEIR FACES EXACTLY as in their attached pictures, the same face shape, features, glasses, his beard and hairline, the way her dupatta frames her face, their skin tone, the same age, so that they are clearly the same two people. Bring everything below the neck and the whole render finish into the girl's world, exactly like the attached girl: matte, poreless skin with a soft even sheen and no fine wrinkles, rounder and simpler body forms, soft plain cloth with no weave and no fine folds (the blazer's check a quiet simplified pattern, the kurta's embroidery simple), hair and beard as soft solid masses, simpler hands with soft rounded fingers, clear glasses with simple frames and no refraction, the same soft edges. Their eyes may be a touch larger than real only if the faces still read as the same people. Everyone lit by one warm soft key light from the upper left with soft shadows to the lower right, a soft contact shadow under each pair of feet, no outlines, no photorealism.

Skin a warm light tan, never orange, never pink. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; Nani's clothes modest and loose, her dupatta over her head.
```

#### LC. The lineup, as LB with the girl one step toward them

Attach: the same five files as LA.

```
Generate an image, 1536×1024, landscape.

Draw four game characters standing in a row on one flat invisible floor, all feet on exactly the same level, seen straight on at eye level, full body, arms relaxed at their sides, each a gentle neutral face with a small smile. From left to right: the DOCTOR (from the attached doctor character sheet: bald on top with short white side hair, a short neat white beard, clear rectangular glasses, a white open-collared shirt under a navy-blue check blazer, charcoal trousers, brown leather shoes, a silver watch on his left wrist, no bag), NANI (her face and glasses exactly as the attached leaning picture of her; her standing body, cream kurta with red embroidery, loose trousers and red dupatta over her head from the attached Nani sheet's front panel), the LITTLE GIRL (as the attached girl sheet's standing front panel: yellow dress, white leggings, white sandals, two plaits with white bows) and NANA (exactly as the attached Nana sheet's front panel). True relative heights: the doctor about 170 cm, Nani about 155 cm, the girl about 110 cm (her head top at the doctor's chest), Nana about 165 cm. Clear space between them; nothing touches the edges of the image.

Rendering: Nana exactly as his attached picture, changed in nothing. The doctor and Nani: KEEP THEIR FACES EXACTLY as in their attached pictures, the same face shape, features, glasses, his beard and hairline, the way her dupatta frames her face, their skin tone, the same age, so that they are clearly the same two people. Bring everything below the neck and the whole render finish into the girl's world, exactly like the attached girl: matte, poreless skin with a soft even sheen and no fine wrinkles, rounder and simpler body forms, soft plain cloth with no weave and no fine folds (the blazer's check a quiet simplified pattern, the kurta's embroidery simple), hair and beard as soft solid masses, simpler hands with soft rounded fingers, clear glasses with simple frames and no refraction, the same soft edges. Their eyes may be a touch larger than real only if the faces still read as the same people. The girl one small step toward them: her eyes about fifteen percent smaller than on her sheet, a touch more real soft shading on her cheeks and nose, her head a touch smaller for her body; still clearly the same girl, the same clothes, still a small child. Everyone lit by one warm soft key light from the upper left with soft shadows to the lower right, a soft contact shadow under each pair of feet, no outlines, no photorealism.

Skin a warm light tan, never orange, never pink. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; Nani's clothes modest and loose, her dupatta over her head.
```

#### DS2. The doctor's new sheet at Nani's level (pick A; an edit of his sheet)

Attach: `doctor-s1-sheet-v1.png`, kept:LA, `nani-n1-lean-neutral-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached doctor character sheet as the only reference for WHO this is and for the LAYOUT, redraw the whole sheet with the same panels in the same places and the same poses: the full-body turnaround (front, three-quarter, side, back), the seated upper-body portrait, both hands, the glasses, the watch, the brown leather bag, the blazer fabric close-up and the colour strip. Keep every identifying feature exactly: bald on top with short white hair at the sides, a short neat solid white beard, clear rectangular glasses, a white open-collared shirt under a navy-blue check blazer, charcoal trousers, brown leather shoes, a silver watch on his LEFT wrist, his face shape, his build and his age. The same man in every panel, identical clothing.

Change only the rendering: render him exactly as the doctor in the attached lineup picture, at exactly the level of stylising of the attached Nani picture. Smooth, simple skin with no pores and no fine wrinkles (his age shown by two or three soft lines, the shape of his face and his white hair and beard, not by texture). The beard and side hair soft solid white masses with a few simple strands, not single hairs. The eyes a little larger and rounder than real, with one clear highlight each, behind clear glasses with simple frames and no refraction. Nose, ears and hands simplified and softly rounded. The blazer's navy check a quiet, simplified pattern with no visible weave; the shirt and trousers smooth cloth. Softer, rounder forms overall, the head a little larger for the body. Soft global illumination, warm light from the upper left, soft shadows to the lower right, no outlines, no photorealism.

Skin a warm light tan, never orange, never pink. Background: one flat, uniform light blue-grey as on the attached sheet. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

#### DS2B. The doctor's new sheet in the girl's world (pick B or C; an edit of his sheet)

Attach: `doctor-s1-sheet-v1.png`, kept:LB (kept:LC on pick C), `s1-girl-sheet-v2.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached doctor character sheet as the only reference for WHO this is and for the LAYOUT, redraw the whole sheet with the same panels in the same places and the same poses: the full-body turnaround (front, three-quarter, side, back), the seated upper-body portrait, both hands, the glasses, the watch, the brown leather bag, the blazer fabric close-up and the colour strip. KEEP HIS FACE EXACTLY: the same face shape and features, clear rectangular glasses, short neat white beard, bald on top with short white hair at the sides, his skin tone and his age, so that he is clearly the same man. Keep every identifying feature: a white open-collared shirt under a navy-blue check blazer, charcoal trousers, brown leather shoes, a silver watch on his LEFT wrist. The same man in every panel, identical clothing.

Change only the rendering, exactly as the doctor in the attached lineup picture: everything below the neck and the whole finish in the world of the attached girl sheet. Matte, poreless skin with a soft even sheen and no fine wrinkles; rounder, simpler body forms; soft plain cloth with no weave and no fine folds, the blazer's check a quiet simplified pattern; hair and beard as soft solid white masses; simpler hands with soft rounded fingers; clear glasses with simple frames and no refraction; the same soft edges as the girl. His eyes a touch larger than real only if the face still reads as him. One warm soft key light from the upper left with soft shadows to the lower right, no outlines, no photorealism.

Skin a warm light tan, never orange, never pink. Background: one flat, uniform light blue-grey as on the attached sheet. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

#### DW1. Standing, three-quarter left, neutral (an edit of the kept s07 picture, rendered as the new sheet)

Attach: `doctor-w1-stand-3q-neutral-v1.png`, the branch's kept sheet (DS2 or DS2B).

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: a character SHEET (several panels on light blue-grey) and one STANDING picture (grey background). The STANDING picture gives only the pose, size, framing, turn and the position of the feet; its rendering is wrong and must not be copied. The SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Draw him again exactly as in the standing picture: standing, full body, turned three-quarters towards the viewer's left, both arms relaxed at his sides, hands open and loose, nothing in his hands, the same gentle neutral face with a small kind smile, mouth closed, looking towards the viewer's left and a little down, the figure at the same size and the same position in the frame, both feet on exactly the same invisible level. Draw no floor; nothing touches the edges of the image.

Rendered exactly as the attached sheet: the same skin finish, the same eye size, the same hair and beard, the same cloth, the same light, the same softness of edges, the same proportions. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer, charcoal trousers, brown leather shoes, silver watch on his left wrist. Warm light from the upper left, no outlines, no photorealism.

Background: one flat, uniform neutral mid-grey, hex #808080; no shadow on the grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

#### DF1. Talking (an edit of the kept DW1; attach that one image only)

```
Edit the attached image. Change only his mouth: open it a little as if saying a word, the teeth just showing. Every other pixel identical: the same pose, size, position, clothes, light and background.
```

#### DF3. Eyes closed (an edit of the kept DW1; attach that one image only)

```
Edit the attached image. Change only his eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, size, position, clothes, light and background.
```

#### DW1F. Standing, front, neutral

Attach: `doctor-w1-stand-front-neutral-v1.png`, the branch's kept sheet.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: a character SHEET (several panels on light blue-grey) and one STANDING picture (grey background). The STANDING picture gives only the pose, size, framing, turn and the position of the feet; its rendering is wrong and must not be copied. The SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Draw him again exactly as in the standing picture: standing, full body, front-on to the viewer, both arms relaxed at his sides, hands open and loose, nothing in his hands, the same gentle neutral face with a small kind smile, mouth closed, looking at us, the figure at the same size and the same position in the frame, both feet on exactly the same invisible level. Draw no floor; nothing touches the edges of the image.

Rendered exactly as the attached sheet: the same skin finish, the same eye size, the same hair and beard, the same cloth, the same light, the same softness of edges, the same proportions. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer, charcoal trousers, brown leather shoes, silver watch on his left wrist. Warm light from the upper left, no outlines, no photorealism.

Background: one flat, uniform neutral mid-grey, hex #808080; no shadow on the grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

#### DW1QR. Standing, three-quarter right, neutral

Attach: `doctor-w1-stand-3q-right-neutral-v1.png`, the branch's kept sheet.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: a character SHEET (several panels on light blue-grey) and one STANDING picture (grey background). The STANDING picture gives only the pose, size, framing, turn and the position of the feet; its rendering is wrong and must not be copied. The SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Draw him again exactly as in the standing picture: standing, full body, turned three-quarters towards the viewer's right, both arms relaxed at his sides, hands open and loose, nothing in his hands, the same gentle neutral face with a small kind smile, mouth closed, looking towards the viewer's right and a little down, the figure at the same size and the same position in the frame, both feet on exactly the same invisible level. Draw no floor; nothing touches the edges of the image.

Rendered exactly as the attached sheet: the same skin finish, the same eye size, the same hair and beard, the same cloth, the same light, the same softness of edges, the same proportions. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer, charcoal trousers, brown leather shoes, silver watch on his left wrist. Warm light from the upper left, no outlines, no photorealism.

Background: one flat, uniform neutral mid-grey, hex #808080; no shadow on the grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

#### DA6QR. Three-quarter right, waving

Attach: `doctor-a6-stand-3q-right-wave-v1.png`, the branch's kept sheet.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: a character SHEET (several panels on light blue-grey) and one STANDING picture (grey background). The STANDING picture gives only the pose, size, framing, turn and the position of the feet; its rendering is wrong and must not be copied. The SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Draw him again exactly as in the standing picture: standing, full body, turned three-quarters towards the viewer's right, his near arm (on the viewer's right) raised in a friendly wave with the open hand beside his head and the palm towards us, the other arm relaxed at his side, a big warm open smile, looking towards the viewer's right and a little down, the figure at the same size and the same position in the frame, both feet on exactly the same invisible level. Draw no floor; nothing touches the edges of the image.

Rendered exactly as the attached sheet: the same skin finish, the same eye size, the same hair and beard, the same cloth, the same light, the same softness of edges, the same proportions. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer, charcoal trousers, brown leather shoes, silver watch on his left wrist. Warm light from the upper left, no outlines, no photorealism.

Background: one flat, uniform neutral mid-grey, hex #808080; no shadow on the grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

#### DD1. Standing front, waving and calling (the waiting room)

Attach: `doctor-d1-door-call-v1.png`, the branch's kept sheet.

```
Generate an image, 1024×1024, square.

Two pictures are attached: a character SHEET (several panels on light blue-grey) and one STANDING picture (grey background). The STANDING picture gives only the pose, size, framing and the position of the feet; its rendering is wrong and must not be copied. The SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Draw him again exactly as in the standing picture: standing, full body, front-on, one hand raised in a friendly wave beside his head with the palm towards us, the other arm relaxed at his side, a big open smile as he calls the next patient, looking at us, the figure at the same size and the same position in the frame, both feet on exactly the same invisible level. Draw no floor and no door; nothing touches the edges of the image.

Rendered exactly as the attached sheet: the same skin finish, the same eye size, the same hair and beard, the same cloth, the same light, the same softness of edges, the same proportions. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer, charcoal trousers, brown leather shoes, silver watch on his left wrist. Warm light from the upper left, no outlines, no photorealism.

Background: one flat, uniform neutral mid-grey, hex #808080; no shadow on the grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

#### DD2. The closed smile (an edit of the kept DD1; attach that one image only)

```
Edit the attached image. Change only his mouth: a warm closed smile, lips together. Every other pixel identical: the same pose, size, position, clothes, light and background.
```

#### DR2. The twelve card faces (an edit of the faces sheet)

Attach: `doctor-ref-faces-v1.png`, the branch's kept sheet.

```
Generate an image, 1536×1024, landscape.

Two pictures are attached: a character SHEET (several panels on light blue-grey, with a turnaround) and a FACES sheet (twelve head-and-shoulders faces in a grid). The FACES sheet gives only the grid, the framing and the twelve expressions in their places (neutral smile, talking, laughing, gentle smile, cheering, warm closed smile, finger up, thinking, surprised, worried, sceptical, wink-laugh); its rendering is wrong and must not be copied. The character SHEET gives who he is and exactly how he is rendered; copy its rendering exactly.

Redraw all twelve faces in the same grid and the same order, head and shoulders, front-on, the same man with the same expression in each cell. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer. Rendered exactly as the character sheet: the same skin finish, the same eye size, the same hair and beard, the same cloth, the same light, the same softness of edges.

Background in every cell: one flat, uniform light blue-grey as on the attached sheets. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### N1B. Nani leaning, neutral, in the girl's world (pick B or C; an edit of N1)

Attach: `nani-n1-lean-neutral-v1.png`, kept:LB (kept:LC on pick C).

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: a LEANING picture of Nani at a marble counter (portrait) and a LINEUP of four people (landscape). Draw the leaning picture again, changed in nothing but its rendering: the same pose with both forearms flat on the counter, the same framing, the same size and position, the counter's back edge at the same height, the same glasses, red dupatta over her head, cream kurta with red embroidery, bracelet and rings, the same gentle neutral face with a small smile, mouth closed, looking at us.

KEEP HER FACE EXACTLY: the same face shape and features, glasses, the way the dupatta frames her face, her skin tone and her age, so that she is clearly the same woman. Change the rendering to exactly that of Nani in the attached lineup: matte, poreless skin with a soft even sheen and no fine wrinkles; rounder, simpler forms; the dupatta and kurta soft plain cloth with no knit, no weave and no fine folds, the embroidery simple; simpler hands with soft rounded fingers; the glasses simple frames with no refraction; the same soft edges. Her eyes a touch larger than real only if the face still reads as her. One warm soft key light from the upper left with soft shadows, no outlines, no photorealism.

Background above the counter: the same flat grey as the attached leaning picture; the marble below it the same. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other religious markers; her clothes modest, her dupatta over her head.
```

#### N2B. Happy (an edit of the kept N1B; attach that one image only)

```
Edit the attached image. Change only her face: a warm happy smile, the eyes a little narrowed with it, the mouth closed. Every other pixel identical: the same pose, arms, counter, size, position, clothes, light and background.
```

#### N3B. Talking (an edit of the kept N1B; attach that one image only)

```
Edit the attached image. Change only her mouth: open it a little as if saying a word. Every other pixel identical: the same pose, arms, counter, size, position, clothes, light and background.
```

#### N4B. Pointing (attach the kept N1B first, then the kept s07 pointing picture)

Attach: kept:N1B, `nani-n4-lean-point-v1.png`.

```
Edit the first attached image. Change only her right arm (on the viewer's right): raise it as in the second attached picture, the elbow on the counter, the hand up beside her face, the index finger pointing down to the viewer's right, the arm and hand rendered like the rest of her in the first picture. Her left forearm stays flat on the counter. Every other pixel of the first image identical: the same face, dupatta, counter, size, position, clothes, light and background. Five fingers.
```

#### N5B. Blink (an edit of the kept N1B; attach that one image only)

```
Edit the attached image. Change only her eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, arms, counter, size, position, clothes, light and background.
```

#### GW1C. The girl seated, front, neutral, one step toward the adults (pick C only; an edit)

Attach: `girl-w1-front-neutral-v1.png`, kept:LC.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: a SEATED picture of a little girl (portrait, grey background) and a LINEUP of four people (landscape). Draw the seated picture again, changed in nothing but her rendering: the same pose, framing, size and position, the same yellow dress, white leggings, white sandals, two plaits with white bows, the same gentle neutral face, mouth closed, looking at us. Render her exactly as the girl in the attached lineup: her eyes about fifteen percent smaller than in the seated picture, a touch more real soft shading on her cheeks and nose, her head a touch smaller for her body; still clearly the same girl, still a small child, the same smooth matte skin and soft light.

Background: one flat, uniform neutral mid-grey, hex #808080, as the attached seated picture. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

#### GW13C. The girl standing, three-quarter left, neutral, one step toward the adults (pick C only; an edit)

Attach: `girl-w13-standing-3q-left-neutral-v1.png`, kept:LC.

```
Generate an image, 1024×1536, portrait.

Two pictures are attached: a STANDING picture of a little girl (portrait, grey background) and a LINEUP of four people (landscape). Draw the standing picture again, changed in nothing but her rendering: the same pose, turn, framing, size, the position of her feet, the same yellow dress, white leggings, white sandals, two plaits with white bows, the same gentle neutral face, mouth closed. Render her exactly as the girl in the attached lineup: her eyes about fifteen percent smaller than in the standing picture, a touch more real soft shading on her cheeks and nose, her head a touch smaller for her body; still clearly the same girl, still a small child, the same smooth matte skin and soft light.

Background: one flat, uniform neutral mid-grey, hex #808080, as the attached standing picture; no floor, no shadow on the grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```
