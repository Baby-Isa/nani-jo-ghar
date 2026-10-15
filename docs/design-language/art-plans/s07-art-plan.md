# Sprint 7 art plan: the doctor, the girl complete, the belt, then Cook (pack `s07`)

**Written:** 15 Oct 2026, by Fable, from Zafar's words of 15 Oct ("a short artwork run this sprint … clinic first … the grandad doctor … extra permutations … the items on the conveyor belt … all the bumps and scrapes … then the cook artwork") and his answers the same day ("yes to all … every single game mode … should all work start to finish with the little girl; if you've proven that works, then we can make the other assets … leave the ladle … do the kitchen thing"). **Status:** a proposal; nothing runs until he says go. **Built from:** `CLAUDE.md` (13, 16), `art-bible.md`, `art-pipeline.md`, the s05 audit (its prompts are reused where they still fit), `docs/design-language/art-plans/clinic-items.md` (ART-20), the fix list's "waiting on art" rows, `docs/feedback/cook-phone-2026-10-15.md` (CK-44, ART-21, SH-91), the doctor's sheets Zafar gave (`sources/art/s07/doctor-s1-sheet-v1.png`, `doctor-ref-faces-v1.png`, `doctor-ref-seated-v1.png`), and an audit of every clinic game's art in code (`data/clinic/heal/*.json` `art`, `data/clinic/heal-art.json`, `data/clinic/sheets.json`, `js/clinic/`).

**The run spec** is `build/tools/art/specs/s07.run.yaml`; **the paste block** is `docs/design-language/art-plans/s07-paste-block.txt` (generated: `python3 build/tools/art/artblock.py --spec build/tools/art/specs/s07.run.yaml --check`, then the same with `--out docs/design-language/art-plans/s07-paste-block.txt`); **the prompts** are section 5. Sources land in `sources/art/s07/`.

## 0. Totals and the order (Zafar, 15 Oct: the doctor, then the girl complete, then the rest of the belt, then Cook; every part boundary a safe stop)

| Part | What | Images | Rows it closes or unblocks |
|---|---|---|---|
| **A** | The doctor from his sheet: one base pose, two faces, six permutations, two door frames | 11 | CLN-150, CLN-17, CLN-115, CLN-25 (his half), CLN-01, CLN-81 (his half), ART-19 (his blink and talk) |
| **B** | The girl's complete set: her life frames, sore face, neutral standing face, level-toed sole, the dirt, the knee bump, the drill view's tooth, boing's drop machine, and the nine belt sheets her ailments ask for | 19 | CLN-136, CLN-137, ART-19 (hers), CLN-87's foot note, CLN-121's dirt flaw, CLN-33/CLN-100's bump, CLN-106 and CLN-37 (the machine), ART-20, CLN-97's level plaster |
| **C** | The rest of the belt: the decoys sheet | 1 | ART-20 (the decoys) |
| **D** | Cook: the kitchen master, Nani's moods, the sekelo plate, the chai pan's tilt, the daar pieces, the potato | 10 | SH-91, ART-21, CK-44 (the kitchen), ART-10, ART-13, ART-19 (Nani), SEK-14, CHAI-08, CK-06, DAAR-05, ART-11 |
| | **Total** | **41** | clinic 31 · Cook 10 |

**His time:** about 3.5 minutes an image (attach, paste, wait, judge, save), about a quarter redone: **part A about 45 minutes, part B about 1 hour 20, part C 5 minutes, part D about 45 minutes; about 3 hours in all.** The clinic (A–C) is about 2 hours 10. Every part boundary is a safe stop: A leaves the real doctor everywhere, B the girl's morning complete in final art, C the belt whole, then Cook as far as it gets (K1 first).

## 1. Flaws and uncertainties first

1. **The doctor's sheets exist and are the authority on his look** (Zafar, 15 Oct; `sources/art/s07/`): bald with short white hair at the sides, a short neat white beard, clear rectangular glasses, a white open-collared shirt under a navy-blue check blazer, charcoal trousers, brown leather shoes, a silver watch on his left wrist, a brown leather doctor's bag (the bag is on the sheet only; no pose carries it). **No stethoscope** (the old stand-in's): the stethoscope is a belt and diagnosis item, not his costume. His render is a soft, fairly realistic 3D; every doctor prompt says "exactly as the attached sheet", not the style anchor, so he stays himself. DS1 (a new sheet) is skipped: `doctor-s1-sheet-v1.png` is every doctor line's reference.
2. **The 12-face sheet covers his box and card faces, so they are cut, not drawn:** neutral smile, talking, laughing, gentle smile, cheering, warm closed smile, finger up, thinking, surprised, worried, sceptical, wink-laugh (front-on, head and shoulders, on a flat blue-grey ground). The 512 px heads for `Kit.DOCTOR_FACE` come from it (neutral, talking, laughing, thinking as the "hmm"). What the sheet cannot give is the standing figure's own talking mouth and blink at his three-quarter turn (the diagnosis and send-off bubbles come from the standing figure), so DF1 and DF3 stay as edits of DW1; the happy and "hmm" edits are dropped (DA4 carries his laugh standing; the card's hmm is the sheet's thinking face).
3. **The girl's audit (every live game, every stage) found her close-ups and wide poses all wired and final:** ear, mouth (v2), brush and plaque, tongue (v2), eyes clear, sore and closed (v2), eye tests A (v2) and B, knee, kicked and grazed, forearm, grazed and cut, upper arm (v2), sole; front with the five faces and six heads, blanket, bottle (v2), side and side happy, standing and waving. Missing or not final for a start-to-finish morning: her blink and talking mouth (ART-19: the talk animation swaps to the same picture), her sore face with one eye shut (CLN-136: W4 came back with both eyes open), her neutral standing face (CLN-137), the sole's toes (foot levels 2 and 3 keep a stand-in), the dirt (flat brown discs drawn in code, CLN-121's flaw; the foot's blobs too), a knee bump (nothing drawn), the drill view's tooth (drawn in code), boing's drop machine (`boing.json` names `heal-v3/drop-machine.webp`, which does not exist: the machine, levers and drops are code). All in part B. Her `how she feels` card still draws flat faces (`Kit.feelingFace`) though her heads exist: wiring, not art.
4. **hic, tummy and hair** are registered games no ailment reaches (`pipeline.json`: 13 ailments over cut, knee, ear, tooth, taste, eye, foot, fever, boing); they are parked (H32, CLN-41 retired) and draw old help and rough sprites. No art here: unparking them is a design decision first (`docs/questions.md`).
5. **The belt's camera.** `scenes-v2.json` pharmacy: the painted belt (`cb4c`) runs edge to edge, its surface between y 0.615 and 0.69 of the room, seen from the front and a little above (about 20 degrees); items stand with their base on `beltY` 0.685, `itemH` 0.15 of the room (about 154 px in the 1536×1024 room, 110 px on a laptop stage), the picture's bottom on the belt (`css/clinic.css` `.cl-belt.v2 .cl-belt-dish .cl-item-img { object-position: 50% 100% }`) with a code contact shadow and drop shadow. So every belt view is drawn **from the front and about 20 degrees above, standing on its base on a flat invisible surface, no shadow**, the same camera as the s02 sheets' `belt` cells. The tray uses the same picture (`Kit.Tray` → `Kit.icon`), so the top-down tray cells are spares until the tray is wired to them.
6. **Colours on the belt are a code tint today** (`.cl-item[data-colour]` sepia/hue-rotate filters) unless an own-colour sprite exists (`Kit.icon`: `<base>-<colour>`). The sheets draw the asked colours as real objects (plaster, bandage, thread, drops); the cut names them `<item>-<colour>-belt`.
7. **The comb** (a decoy; the hair game is parked) is dropped from `pipeline.json` decoys instead of drawn.
8. **The kitchen master (SH-91) cannot be output at 2100×1350 by ChatGPT.** Agreed (Zafar, 15 Oct): one 1536×1024 picture whose whole frame is the master, the 1600×900 core (people, island, trays) inside it at the middle-bottom (x 12–88%, y 36–100%), more ceiling and wall above, more kitchen each side; then **upscaled on our side** ×1.367 (Real-ESRGAN) to 2100×1400 and trimmed to 2100×1350. The core is drawn at 76% of the old picture's linear resolution before the upscale. The island's back edge must land at core y 608 (79% down the draft), the trays' middles at core x 358, 802, 1251 (29%, 50%, 71.5% across); the cut re-measures them (`art.s02.kitchen-trays.meta`).
9. **Nani (N1–N5) is the s05 part A unchanged** (never run): her four mood files are one picture (ART-10), her lean was rejected (ART-13). N1's "render her face like Nana" sentence stays (Zafar, 15 Oct).
10. **Left to the next sprint's full run, after the girl is proven (Zafar, 15 Oct):** the other patients' wide poses, close-ups and adult limbs (s05 parts D and E; the boy, old man and old woman's landed poses still need a cut session), the household nouns' pictures (CLN-38), the eye close-up's photoreal look (CLN-107), the pantry shelves (PAN-06), Cook's day art (CK-24), the chop screen's mixed styles (SH-37), the station backgrounds' masters (ART-05), the kadchi (DAAR-02: the ladle stays as it is, Zafar 15 Oct), the certificate (CLN-116: his photo, code), Nana, Ma and Ali's life frames.
11. **Characters already drawn that the game could wire with no new art** (Zafar: "if it's easy to put them in, put them in"): see the report; none is in the block.

## 2. How Zafar runs the block himself

As s05's section 2: the block is generated for the Chrome runner; he ignores its MOVING IMAGES, RUNNER LOOP and GitHub lines and uses the RUN ORDER, the prompts here (section 5), the CHECKS and the PASS/FAIL LIST. For each line: a fresh ChatGPT chat, exactly the files on the line (an edit line attaches only the one image), the prompt pasted as is, judged, saved with ChatGPT's download button as `sources/art/s07/<save as>` (a redo of a kept line is `-v2`). Real people (the doctor, Nani) are his call. At the end, or at any part boundary: commit the folder to `main` or drag the files into the Claude chat, with a `sources/art/s07/art-run-log.txt` (one line per image: `ID | PASS or FAIL (why) | redos`). Then Claude judges (`artjudge.py`), cuts (`s07.cut.json`) and wires (`/brief`, then `/review`).

## 3. The lines

Columns: **seen** is how the game shows it (view, size on the 1600×900 stage or the 1536×1024 room at 1×, who stands where); **today** is what the code draws now.

### 3.1 Part A: the doctor (a real person: Zafar approves each one; every line attaches his sheet)

| ID | What | Seen | Today | Rows | Reuse |
|---|---|---|---|---|---|
| DW1 | Standing, full body, three-quarter to the viewer's LEFT, arms relaxed at his sides, neutral: the base | the diagnosis beside the bed (`exam.doctor` x 0.735, feet y 0.9, h 0.66 of the room: about 676 px; the patient sits at x 0.5 on his right), the check-up by the wall (`stand.doctor`) | `Kit.doctorFigure` (a flat SVG, a white coat) and `Kit.DOCTOR_FACE` (another man) | CLN-150, CLN-17, CLN-01, CLN-81 | his sheet, panel 2 |
| DF1 | Talking (edit of DW1) | every bubble of his from the standing figure; the mouth frame of the talk animation | a texture swap to the same picture | ART-19 | – |
| DF3 | Blink (edit of DW1) | the life frames | – | ART-19 | – |
| DA1 | Arms folded, listening | the diagnosis while the child says where it hurts | – | – | – |
| DA2 | Pointing to the viewer's left at chest height | the diagnosis naming the part; "Does it hurt here?" | – | CLN-17 | s05 DW4 |
| DA3 | One finger up | "one more thing", the how-to cue, the count-down | – | – | the faces sheet's finger-up for the card |
| DA4 | Both arms up, open hands, laughing | the send-off's "all better", a perfect handover | – | – | – |
| DA5 | Holding the pen torch up in his near hand | D3's look (the tool named), the eye and ear checks | – | – | the torch as `items-v2/pen-torch` |
| DA6 | Turned three-quarter to the viewer's RIGHT, waving goodbye | the send-off at the front door (`door.doctor` x 0.22, h 0.64; the patient stands to his left at x 0.37): yes, Zafar 15 Oct | the exam room is used instead because the door scene had no art | CLN-25 | – |
| DD1 | Leaning out of his half-open door, calling (head, shoulders, one beckoning hand, entering from the RIGHT edge) | the waiting room's door (`waiting.doctor` x 0.806, h 0.2 of the room: about 205 px; the door leaf hides the rest of him) | the rough sprite's top half | CLN-115 (decision 83) | s05 DD1; the faces sheet's laugh |
| DD2 | The same, looking out, mouth closed (edit of DD1) | the why beat: he looks out, then calls | – | CLN-115 | – |
| (cut) | His box and card faces: neutral, talking, laughing, thinking | `Kit.DOCTOR_FACE` everywhere (the box, every card, the request pop-up) | the SVG face | CLN-150 | **cut from `doctor-ref-faces-v1.png`**, no prompt |

### 3.2 Part B: the girl's complete set (every stage and game of her morning in final art)

| ID | What | Seen | Today | Rows | Reuse |
|---|---|---|---|---|---|
| GB1 | Her blink (edit of her seated front picture) | the eye test and every bubble of hers; the life frames | missing (the talk swaps to the same picture) | ART-19, EY8 | s05 GB1 |
| GM1 | Her talking mouth (edit) | as GB1 | missing | ART-19 | s05 GM1 |
| GS1 | Her sore face, one eye shut (edit) | the diagnosis's D9 (her own sore look under the card), the send-off's L2 feeling | `girl-face-pain` with both eyes open | CLN-136 | redo of the clinic pack's W4 |
| GN1 | Standing, mouth closed, neutral (edit of her standing-palms picture) | the send-off at L2 while she says her feeling | her standing art's resting face smiles | CLN-137 | `girl-w11-standing-palms-v1` |
| RP1 | Her sole with the five toes in a level row | foot L1–L3 (the channels run from the named toes), the sole filling the close-up (800×500 units, the leg off the bottom) | the clinic pack's P1 (toes sloping) for L1 only; a stand-in from L2 | CLN-87's foot note | s05 RP1 |
| I1 | Dirt: eight soft bits of dust, grit and a smear | the scrape (on her grazed forearm and knee, washed away by the water), the foot's soak (the dirt hides the splinters) | flat dark-brown discs drawn in code | CLN-121's flaw, CLN-108 | – |
| I2 | The knee bump (edit of K1) | knee L1 `knee-bump`, the close-up before the wrap | nothing drawn | CLN-33, CLN-100 | `child-k1-knee-v1` |
| TD1 | The drill view: one sore tooth big, its neighbours and the gum, clean (the decay patches are props) | tooth, the drill and fill steps (the camera pushes in on the sore tooth) | a tooth drawn in code | CLN-106's cousin in the tooth game; `clinic.md` "Still stand-ins" | attach her mouth (M1 v2) for the teeth's look |
| DM1 | Boing's drop machine: four tubes of coloured medicine with drip spouts | boing, every level (the machine front and a little above, the syringe under the chute) | code-drawn (the file `boing.json` names does not exist) | CLN-37, CLN-106 | s05 DM1 |
| DM2 | Its levers up and down and the four teardrop drops (3×2) | boing | code-drawn | CLN-37, CLN-106 | s05 DM2 |
| B1 | The plaster, lying level: belt in red, blue, green, yellow; skin; tray red, blue, green | asked by scrape, cut, sore feet, thorn (her ailments); colours from level 2 | `sheets/plaster/plaster-belt` tilted, tinted in code | CLN-97, ART-20 | attach the s02 E3 sheet |
| B2 | The bandage roll: belt ×4 colours, tray ×4 | asked by knee bump, leg break | rough sprite | ART-20 | `items-v2/bandage-roll` |
| B3 | The thread reel: belt ×3 colours, tray ×3, side-on, a loose length | asked by the cut | rough sprite | ART-20 | s05 E19 |
| B4 | The reflex hammer: belt, tray, tool, in use, spares | asked by knee bump, leg break; the knee game's tap | rough sprite; `items-v2/reflex-hammer` in the tool column | ART-20 | s05 E21 |
| B5 | The drops bottle: belt ×4 colours, tray ×4 | asked by seed in ear, sore eye | `sheets/drop-bottle` one colour, tinted in code | ART-20 | attach the s02 E4 sheet |
| B6 | The dentist's drill: belt, tray, tool, in use, spares | asked by sugar bug, cracked tooth; the tooth game | rough sprite; `items-v2/dentist-drill` | ART-20 | – |
| B7 | The filling tube: belt, tray, tool, in use, spares | asked by cracked tooth; the fill | rough sprite / the SVG stand-in `tube` | ART-20, CLN-106 | s05 E20 |
| B8 | The taste things: lemon half, milk jug, honey jar, teaspoon: belt ×4, tray ×4 | asked by coated tongue; the taste game's tool column | rough sprites; `items-v2` singles | ART-20 | attach `ci3-drinks` |
| B10 | The eye patch: belt, tray, tool, in use, spares | asked by sore eye; the eye game | rough sprite | ART-20 | s05 E22 |

### 3.3 Part C: the rest of the belt

| ID | What | Seen | Today | Rows | Reuse |
|---|---|---|---|---|---|
| B9 | The decoys: apple, tumbler, folded red blanket, tissue, stethoscope, crutches, pen torch, hot-water bottle (belt ×8) | decoys at every level; the send-off's L3 tray (apple, blanket); the jab's apple | rough sprites; `items-v2` singles | ART-20 | attach `ci2-tools-comfort` |

### 3.4 Part D: Cook (as time allows)

| ID | What | Seen | Today | Rows | Reuse |
|---|---|---|---|---|---|
| K1 | The kitchen master: the whole 1536×1024 frame is the 2100×1350 master, the 1600×900 core at its middle-bottom; the tap one tap; no plant on the floor through the door | every Cook greeting, order and serve; drawn 1:1, the stage shows as much as it has room for | `service-v2.webp` cover-fitted (the counter seam, CK-44) | SH-91, ART-21, CK-44 | attach the kitchen; s02 A1's wording |
| N1 | Nani leaning on the counter, neutral (the base) | the counter: head about 180 px wide at 1×, the counter's back edge at y 608 | one picture for every mood | ART-13, ART-10 | s05 N1 |
| N2, N3, N4, N5 | Happy, talking, pointing, blink | as N1 | – | ART-10, ART-19 | s05 N2–N5 |
| SK2 | The sekelo plate with 1–4 straight skewers | sekelo L1–L4, top-down, the plate about 420 px wide | the fanned plates retired; a code-laid plain plate | SEK-14 (decision 79) | s05 SK2 |
| CP1 | The chai pan's tilt: flat, 15°, 30°, 45°, then 45° pouring milk chai and black tea (3×2) | the chai tray's pour, top-down | one tipped pan with the stream (`pan-pour-milk`, judged angled) | CHAI-08 (Zafar, 14 Oct) | attach the s02 C1 pan |
| DP1 | The daar's pieces: onion, ginger-garlic paste, tomato, chilli, flakes, cumin, a curry leaf (top-down) | the daar pot as things go in and are stirred | code-drawn blobs and dots | CK-06, DAAR-05 | attach the s02 C6 ginger |
| PT1 | The potato: whole, halved, one cube, a pile of cubes (2×2) | the chop station | glossy blocks that read as butter | ART-11 | – |

## 4. The run order and the estimate

| Part | Lines | Images | Why this order |
|---|---|---|---|
| **A** | DW1, DF1, DF3, DA1–DA6, DD1, DD2 | 11 | The doctor first (Zafar, 15 Oct); DW1 unblocks the rest |
| **B** | GB1, GM1, GS1, GN1, RP1, I1, I2, TD1, DM1, DM2, B1–B8, B10 | 19 | The girl's morning complete, with everything her games ask for from the belt |
| **C** | B9 | 1 | The decoys |
| **D** | K1, N1–N5, SK2, CP1, DP1, PT1 | 10 | Cook: the kitchen master first, then Nani (he approves), then the stations |
| | **Total** | **41** | expected redos about 10; about 3 hours (section 0) |

**Dependencies:** DF1 and DF3 edit DW1; DA1–DA6 attach DW1 and the sheet; DD2 edits DD1; DM2 attaches DM1; N2, N3, N5 edit N1; N4 attaches it. Every other line attaches repo files only (GB1, GM1, GS1, GN1 and I2 are edits of repo files), so within a part the lines can run in any order.

## 5. The prompts

Every prompt is pasted as is into a fresh ChatGPT chat with exactly the files its run-order line names attached. No slots in this pack. Grounds: flat mid-grey `#808080`, no shadows on the grey; the cutter keys it out. **The belt view**, used in the belt sheets: "seen from the front and a little above, the camera about 20 degrees above the object looking slightly down, as a thing standing on the attached conveyor belt is seen; standing on its base on a flat invisible surface, its whole footprint touching the surface; no surface drawn, no shadow". **The tray view:** "seen from directly above, straight down".

### Part A: the doctor (real person: Zafar approves each one; every line attaches his sheet, `doctor-s1-sheet-v1.png`)

#### DW1. The doctor standing, three-quarter left, arms down, neutral (the base every pose is registered to)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is and for how he is rendered, draw the doctor once, large: standing, full body, turned three-quarters towards the viewer's LEFT (as in the second figure on the sheet), as if standing beside a patient who sits on his right, his weight on both feet, both feet flat on one invisible level, BOTH arms relaxed and hanging at his sides, hands open and loose, NOTHING in his hands (no bag), a gentle neutral face with a small kind smile, mouth closed, looking towards the viewer's left and a little down, as at a child sitting on a bed. Draw no floor. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer, the dark belt, the charcoal trousers, the brown leather shoes, the silver watch on his left wrist. No bag, no stethoscope, no white coat. Skin exactly as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet: the same soft 3D render, the same face, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DF1. The doctor talking (an edit of DW1)
```
Edit the attached picture. Change ONLY his face, to this expression: talking, the mouth open mid-word, the brows lifted a little, kind and attentive. His glasses, beard, clothes and hands stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DF3. The doctor, eyes closed (the blink; an edit of DW1)
```
Edit the attached picture. Change ONLY his eyes: both gently closed, as in a calm blink, the lids relaxed behind his glasses; the rest of the face unchanged, mouth closed. His glasses, beard, clothes and hands stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DA1. The doctor with his arms folded, listening (attach the kept DW1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for the exact pose, size and framing, and the attached character sheet for who he is, draw him again exactly as in that picture, at the same size and the same position in the frame, the same three-quarter turn towards the viewer's left, both feet in exactly the same place, the same gentle neutral face, mouth closed. The only change: BOTH arms are folded loosely across his chest, each hand resting on the opposite upper arm, relaxed and listening, the silver watch showing on his left wrist. Draw no floor; nothing touches the edges of the image.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer, the charcoal trousers, the brown leather shoes, the silver watch. No bag, no stethoscope. Skin as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DA2. The doctor pointing to the viewer's left (attach the kept DW1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for the exact pose, size and framing, and the attached character sheet for who he is, draw him again exactly as in that picture, at the same size and the same position in the frame, the same three-quarter turn towards the viewer's left, both feet in exactly the same place. The only change: his near arm (on the viewer's left) is raised, bent at the elbow, the hand at chest height with the index finger pointing to the viewer's left and a little down, as a doctor naming the part that hurts; the other arm stays hanging at his side; a kind, attentive face, a small smile, mouth closed. Draw no floor; nothing touches the edges of the image.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer, the charcoal trousers, the brown leather shoes, the silver watch on his left wrist. No bag, no stethoscope. Skin as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DA3. The doctor with one finger up (attach the kept DW1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for the exact pose, size and framing, and the attached character sheet for who he is, draw him again exactly as in that picture, at the same size and the same position in the frame, the same three-quarter turn towards the viewer's left, both feet in exactly the same place. The only change: his near arm (on the viewer's left) is raised, bent at the elbow, the hand beside his shoulder with the index finger pointing straight UP, as in "one thing" or "listen"; the other arm stays hanging at his side; a bright, encouraging face, a small smile, mouth closed. Draw no floor; nothing touches the edges of the image.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer, the charcoal trousers, the brown leather shoes, the silver watch on his left wrist. No bag, no stethoscope. Skin as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DA4. The doctor with both arms up, "all better" (attach the kept DW1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for the exact pose, size and framing, and the attached character sheet for who he is, draw him again exactly as in that picture, at the same size and the same position in the frame, the same three-quarter turn towards the viewer's left, both feet in exactly the same place. The only change: BOTH arms are raised high and a little apart, the open hands above his head with the palms towards us, celebrating, and his face is his big, open, laughing smile (as on the sheet), the eyes crinkled. Both hands stay well inside the image. Draw no floor; nothing touches the edges of the image.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer, the charcoal trousers, the brown leather shoes, the silver watch on his left wrist. No bag, no stethoscope. Skin as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DA5. The doctor holding the pen torch (attach the kept DW1, the sheet and the clinic things)
```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for the exact pose, size and framing, the attached character sheet for who he is, and the attached clinic things for the pen torch, draw him again exactly as in that picture, at the same size and the same position in the frame, the same three-quarter turn towards the viewer's left, both feet in exactly the same place. The only change: his near arm (on the viewer's left) is raised, bent at the elbow, and his hand holds a small steel pen torch (as on the attached clinic things, the torch OFF, no beam) at chest height, its tip pointing towards the viewer's left and a little down, as a doctor about to look in a child's eyes or ears; the other arm stays hanging at his side; a kind, attentive face, a small smile, mouth closed. Draw no floor; nothing touches the edges of the image.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer, the charcoal trousers, the brown leather shoes, the silver watch on his left wrist. No bag, no stethoscope. Skin as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DA6. The doctor turned three-quarter RIGHT, waving goodbye (attach the kept DW1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for his exact size, framing and the position of his feet, and the attached character sheet for who he is, draw him again at the same size and the same position in the frame, both feet on exactly the same invisible level: standing, full body, but now turned three-quarters towards the viewer's RIGHT (the mirror of the attached turn), as if seeing a patient off who stands on his left; his near arm (on the viewer's right) raised in a friendly wave, the open hand beside his head with the palm towards us; the other arm hanging at his side; a big, warm, open smile, looking towards the viewer's right and a little down, as at a child. Draw no floor; nothing touches the edges of the image.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer, the charcoal trousers, the brown leather shoes, the silver watch on his LEFT wrist. No bag, no stethoscope. Skin as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DD1. The doctor leaning out of his door, calling the next patient (attach the sheet and the faces sheet)
```
Generate an image, 1024×1024, square.

Using the attached character sheet as the only reference for who this is and how he is rendered, and the attached sheet of his faces for his open laughing call, draw the doctor leaning out of a half-open doorway to call the next patient: his head, shoulders and upper chest lean in from the RIGHT edge of the image, his body turned towards us, his head tilted a little, one hand raised beside his face in a small friendly beckoning wave with the palm towards us; a big open smile, the mouth open as if calling a name. His shoulder, upper arm and the side of his body run off the RIGHT edge of the image (as if the rest of him is behind the door); draw NO door, door frame or wall: only him, against the plain background. His head is a little left of centre and fills about 40% of the image height, with clear background above, below and to the left.

Keep him exactly as on the sheet: bald with short white hair at the sides, the short neat white beard, the clear rectangular glasses, the white open-collared shirt under the navy-blue check blazer. No stethoscope. Skin as the sheet's swatch, a warm light tan, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DD2. The doctor at his door, looking out, mouth closed (an edit of DD1)
```
Edit the attached picture. Change ONLY his face, to this expression: looking out at the waiting room with a gentle closed-mouth smile, the eyes warm, as he looks for the next patient before calling. The raised hand, the glasses, beard, clothes and his position at the right edge stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hand, clothes, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: the same soft 3D render, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

### Part B: the girl's complete set

#### GB1. The girl, eyes closed (the blink; an edit of her seated front picture)
```
Edit the attached picture. Change ONLY her eyes: both gently closed, as in a calm blink, the lids relaxed; the rest of the face unchanged, mouth closed. Her plaits, ribbons, dress, hands and legs stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### GM1. The girl, mouth open mid-word (the talking frame; an edit of her seated front picture)
```
Edit the attached picture. Change ONLY her mouth: open a little, mid-word, the teeth just showing, as when talking; the eyes and the rest of the face unchanged. Her plaits, ribbons, dress, hands and legs stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### GS1. The girl's sore face, one eye shut (redo of the clinic pack's W4; an edit of her seated front picture)
```
Edit the attached picture. Change ONLY her face, to this expression: a small comic wince of being sore: ONE eye squeezed shut (the eye on the viewer's left), the other eye open and looking at us, the brows pulled together and up in the middle, the mouth a small tight "ow" pulled to one side with the teeth just showing; mild and a little funny, never real distress, no tears. Her plaits, ribbons, dress, hands and legs stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### GN1. The girl standing, mouth closed, neutral (an edit of her standing-palms picture)
```
Edit the attached picture. Change ONLY her mouth, to a calm, closed, neutral mouth with no smile; the eyes, brows and the rest of the face unchanged. Her plaits, ribbons, dress, hands, legs and sandals stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### RP1. The girl's sole with level toes (redo of the clinic pack's child-P1, for foot levels 1–3)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is (the girl on the sheet, a child of about five), and the attached sole picture for the exact framing, size and look, draw the same close-up again for a children's doctor game: her bare right foot held up towards us so that we see the sole straight on, the toes at the top, the heel at the bottom, the ankle and a little of the leg in a plain white cotton trouser leg going back and down out of the bottom edge of the image. The one change from the attached picture: the five toes sit in a LEVEL row across the top of the foot, their tips all at about the same height (the big toe only a little higher than the little toe), clearly separate and easy to count, with a small gap between each. The sole is the main thing, centred, filling about three quarters of the image height; smooth and clean, a little paler and pinker than the top of the foot; no lines drawn on it, no marks, no splinters. Skin the same warm light tan as the sheet (about hex #C49A78), never orange. The leg touches only the bottom edge of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five toes.
```

#### I1. Dirt: eight soft bits of dust and grit for a grazed knee and a dirty sole (attach the grazed forearm and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eight separate bits of DIRT, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 50% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. They are the kind of dirt a child picks up falling in the garden, as it looks lying ON skin, seen from directly above, straight down: soft, dusty, matte, warm brown and grey-brown, every bit with a soft, feathered edge (never a hard-edged disc, never a flat blob), the same look as the dirt on the attached grazed arm. Friendly and mild: no blood, no insects, nothing gross.
Row 1, left to right: (1) a soft round patch of dust; (2) a smaller patch of dust with a few tiny grit specks in it; (3) a short smear of dirt, longer than it is tall; (4) a loose scatter of five or six tiny grit specks.
Row 2, left to right: (5) a bigger irregular patch of dust with a few grit specks; (6) a thin streak of dirt; (7) three small grit specks close together; (8) a faint, wide, very soft patch of dust.
Light from the upper left, very soft. No skin drawn, no surface, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached grazed arm and the style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### I2. The knee bump (an edit of the child's knee close-up)
```
Edit the attached picture. Change ONLY the kneecap: add one soft, rounded BUMP on it, a gentle swelling a little bigger than a coin, the skin over it a mild pink-red blush that fades softly into the skin around it; no cut, no graze, no blood, no bruise colours (no purple or black), nothing gross: a mild, comic "bumped my knee". The rest of the knee, the leg, the rolled white cloth and the skin stay exactly as they are.
Everything else stays exactly the same: the same leg, the same framing, size and position in the frame (the thigh in from the left edge, the shin out of the bottom edge); the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### TD1. The drill view: one sore tooth big, clean, with its neighbours and the gum (attach her mouth close-up and the anchor)
```
Generate an image, 1536×1024, landscape.

A close-up for a children's dentist game, as the camera pushes in on one tooth inside the attached open mouth: ONE upper front tooth, big, straight on from the front, centred, filling about 45% of the image width and about 70% of its height, with the two neighbouring teeth either side of it, each cut off by the LEFT and RIGHT edges of the image, and the pink gum above all three running off the TOP edge. All three teeth clean, white and healthy, smooth enamel with a soft sheen, no decay, no holes, no marks, no spots (the decay is added later): the same teeth, colours and look as the attached mouth, only much closer. Below the teeth's bottom edges there is nothing: the flat background. No tongue, no lips, no tools, no hands.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling everything that is not tooth or gum. No gradient, no texture. NO shadows on the grey.

Style: exactly as the attached mouth and the style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DM1. The drop machine (boing)
```
Generate an image, 1024×1536, portrait.

A friendly medicine drop machine for a children's doctor's clinic, on its own, seen from the front and slightly above, standing on a flat base: a white and pale-steel cabinet with FOUR tall clear glass tubes standing side by side on top. Each tube is filled with coloured liquid medicine, one colour per tube: red, yellow, blue and green, from left to right; the liquid is smooth and clear-coloured, with no balls, beads or sweets in it. At the bottom of each tube is a small steel drip spout, like a medicine dropper's tip, over a shared chute that funnels down to one small round opening at the bottom centre, where a drop can fall out. On the front, under each tube, is an empty round steel socket where a lever will go; draw NO levers. Centred, filling about 85% of the image height.
Clean, clinical and friendly: it must look like a medicine dispenser, not a sweet, gumball or jelly-bean machine. No balls, no glass dome, no coin slot, no turning handle, no stripes, no wrapped sweets.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and clinic things: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DM2. The levers and the drops (boing; attach the kept DM1 and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: six things in an invisible grid of 3 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Each seen from the front and slightly above, matching the attached drop machine.
Row 1: (1) a short steel lever with a round white knob, pointing UP, on a small round steel mount; (2) the SAME lever and mount, at exactly the same size and position in its cell, pulled DOWN; (3) one single drop of liquid medicine in red, falling: a teardrop shape (round at the bottom, pointed at the top), matte and softly translucent like coloured syrup, never a glossy ball, bead or sweet.
Row 2: (4) the same drop in yellow; (5) the same drop in blue; (6) the same drop in green. All four drops exactly the same teardrop size and shape.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached machine and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B1. The plaster, lying level, in its colours (attach the belt, the s02 plaster views and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight cells, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell's width, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a child's sticking plaster exactly like the one on the attached plaster sheet (a rounded strip with a soft pale pad in the middle), lying FLAT and LEVEL, its long axis exactly left to right, never tilted or standing on edge: the same plaster in every cell, only its colour changes.
Row 1, left to right, all seen from the front and a little above (the camera about 20 degrees above the plaster looking slightly down, exactly as a thing lying on the attached conveyor belt is seen), lying on a flat invisible surface: (1) a RED plaster; (2) a BLUE plaster; (3) a GREEN plaster; (4) a YELLOW plaster.
Row 2, left to right: (5) a plain SKIN-coloured plaster, the same view as row 1; then seen from directly above, straight down, lying flat: (6) RED; (7) BLUE; (8) GREEN.
Each colour is the whole strip in one clean, clear colour with the pale pad; no stripes, no patterns, no pictures printed on it. Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached plaster sheet and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B2. The bandage roll in four colours (attach the belt, the bandage roll and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight cells, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a rolled crepe bandage like the attached bandage roll: a neat cylinder of soft fabric, lying on its side with its loose end tucked, the same roll in every cell, only its colour changes.
Row 1, left to right, all seen from the front and a little above (the camera about 20 degrees above the roll looking slightly down, exactly as a thing standing on the attached conveyor belt is seen), lying on its side on a flat invisible surface, its whole length touching the surface: (1) a RED bandage roll; (2) a BLUE one; (3) a GREEN one; (4) a YELLOW one.
Row 2, left to right, the same four rolls, RED, BLUE, GREEN, YELLOW, each lying on its side seen from directly above, straight down.
Each colour is the whole fabric in one clean, clear colour; no stripes, no clips, no pins. Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached bandage roll and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B3. The thread reel in three colours (no needle; attach the belt, the care kit and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eight cells, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a small wooden reel of plain cotton thread with a short loose end of thread; NO needle anywhere: the same reel in every cell, only its thread's colour changes.
Row 1, left to right, all seen from the front and a little above (the camera about 20 degrees above the reel looking slightly down, exactly as a thing standing on the attached conveyor belt is seen), standing upright on its end on a flat invisible surface: (1) RED thread; (2) BLUE thread; (3) GREEN thread; (4) the RED reel seen exactly side-on, standing.
Row 2, left to right: standing upright, seen from directly above, straight down (a circle): (5) RED; (6) BLUE; (7) GREEN; (8) a short loose length of RED thread lying in a loose curve, on its own.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B4. The reflex hammer (attach the belt, the clinic things and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the reflex hammer from the attached clinic things: a red rubber triangular head on a slim steel handle: the same object, colours and materials in every cell.
Row 1, left to right: (1) lying flat on a flat invisible surface, head to the left, handle exactly left to right, seen from the front and a little above (the camera about 20 degrees above it looking slightly down, exactly as a thing lying on the attached conveyor belt is seen); (2) lying flat, seen from directly above, straight down; (3) standing on its head, handle up, seen straight on from the front; (4) in use: held tilted 45 degrees, the head to the lower left as if about to tap a knee.
Row 2, left to right: (5) held vertically, head down; (6) lying flat, seen exactly side-on; (7) seen exactly end-on from the head; (8) three-quarter from above.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B5. The drops bottle in four colours (attach the belt, the s02 drop-bottle sheet and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight cells, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the small medicine drops bottle on the attached drop-bottle sheet (the same squeezy bottle with its dropper cap), the same bottle in every cell, only its colour changes: the cap and the liquid showing through the bottle in one clean colour, the bottle itself pale and translucent.
Row 1, left to right, all seen from the front and a little above (the camera about 20 degrees above the bottle looking slightly down, exactly as a thing standing on the attached conveyor belt is seen), standing upright on its base on a flat invisible surface: (1) RED cap and liquid; (2) BLUE; (3) GREEN; (4) YELLOW.
Row 2, left to right, the same four bottles, RED, BLUE, GREEN, YELLOW, standing upright and seen from directly above, straight down (the cap a circle).
No label, no writing. Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached drop-bottle sheet and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B6. The dentist's drill (attach the belt, the clinic things and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a friendly dentist's drill handpiece: a slim pale-steel pen-like body with a soft rounded white grip, a small angled head at the tip with a tiny rounded bur, and a short pale-blue cord ending in a plain plug at the back; clean and friendly, nothing sharp or scary: the same object, colours and materials in every cell.
Row 1, left to right: (1) lying flat on a flat invisible surface, tip to the left, exactly left to right, seen from the front and a little above (the camera about 20 degrees above it looking slightly down, exactly as a thing lying on the attached conveyor belt is seen); (2) lying flat, seen from directly above, straight down; (3) standing on its back end, tip up, seen straight on from the front; (4) in use: held tilted 45 degrees, the tip to the lower left as if about to touch a tooth.
Row 2, left to right: (5) lying flat, seen exactly side-on; (6) the head and bur close up, three-quarter; (7) held vertically, tip down; (8) three-quarter from above.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B7. The filling tube (attach the belt, the care kit and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a small white squeezable plastic tube with a rounded blue cap and a plain blue band near the cap, like a small toothpaste tube, with NO writing or label: the same object, colours and materials in every cell.
Row 1, left to right: (1) lying on its side on a flat invisible surface, cap to the left, exactly left to right, seen from the front and a little above (the camera about 20 degrees above it looking slightly down, exactly as a thing lying on the attached conveyor belt is seen); (2) lying, seen from directly above, straight down; (3) standing on its cap, seen straight on from the front; (4) in use: held tilted 45 degrees, cap off, the open nozzle to the lower left with a small bead of off-white paste at it.
Row 2, left to right: (5) lying, seen exactly side-on; (6) the cap off, lying beside the tube; (7) the tube squeezed in the middle, nozzle down, a short worm of off-white paste coming out; (8) the tube three-quarter from above.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B8. The taste things: lemon half, milk jug, honey jar, teaspoon (attach the belt, the drinks and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: four objects, each twice, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The objects: a LEMON HALF (cut face towards us, bright and juicy); a small plain white ceramic MILK JUG full of milk, like the jugs on the attached drinks sheet; a small clear glass HONEY JAR with a plain wooden lid, golden honey inside, no label; a plain steel TEASPOON. The same four objects, colours and materials in both rows.
Row 1, left to right, all seen from the front and a little above (the camera about 20 degrees above the object looking slightly down, exactly as a thing standing on the attached conveyor belt is seen), each standing or lying on its base on a flat invisible surface: (1) the lemon half, cut face up and tilted towards us; (2) the milk jug, its handle to the right; (3) the honey jar; (4) the teaspoon lying flat, bowl to the left, exactly left to right.
Row 2, left to right, the same four objects seen from directly above, straight down: (5) the lemon half, cut face up (a circle); (6) the milk jug, the milk's surface a circle; (7) the honey jar, its lid a circle; (8) the teaspoon lying flat, bowl to the left.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached drinks sheet and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B10. The eye patch (attach the belt, the clinic things and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a child's soft eye patch: a plain pale-blue cotton oval pad with a thin white elastic band attached at both sides; no print, no picture, no skull: the same object, colours and materials in every cell.
Row 1, left to right: (1) the pad lying face up on a flat invisible surface, the band looping out flat to the sides, seen from the front and a little above (the camera about 20 degrees above it looking slightly down, exactly as a thing lying on the attached conveyor belt is seen); (2) lying flat, seen from directly above, straight down; (3) the pad straight on from the front, the band hanging below; (4) in use: the pad curved as it would sit over an eye, seen three-quarter from the front, the band running off to the sides.
Row 2, left to right: (5) seen exactly side-on, the pad's gentle curve showing; (6) the pad from behind (the soft inside); (7) the pad with its band folded neatly under it; (8) three-quarter from above.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

### Part C: the rest of the belt

#### B9. The decoys: apple, tumbler, folded blanket, tissue, stethoscope, crutches, pen torch, hot-water bottle (attach the belt, the clinic things and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eight different objects, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Every object is seen from the front and a little above (the camera about 20 degrees above it looking slightly down, exactly as a thing standing on the attached conveyor belt is seen), standing or lying on its base on a flat invisible surface, its whole footprint touching the surface.
Row 1, left to right: (1) one whole red APPLE with a short stalk; (2) a plain clear glass TUMBLER, empty; (3) a soft deep-red BLANKET folded into a neat square pile; (4) one white paper TISSUE, loosely folded, lying flat.
Row 2, left to right: (5) a STETHOSCOPE like the one on the attached clinic things, coiled loosely, lying flat; (6) a pair of small wooden CRUTCHES with pale grey pads, leaning together, standing on their tips; (7) a small steel PEN TORCH lying flat, exactly left to right, the lens to the left, OFF, no beam; (8) a teal knitted HOT-WATER BOTTLE standing upright, its white stopper at the top.
No writing, no labels, no logos on anything. Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

### Part D: Cook (the kitchen master first; Nani is a real person: Zafar approves each one)

#### K1. The kitchen master: the whole frame is the 2100×1350 master, the 1600×900 core at its middle-bottom
```
Generate an image, 1536×1024, landscape.

Using the attached kitchen picture as the only reference for the room, redraw the SAME kitchen at full detail from exactly the SAME camera (eye level, straight on, one-point perspective, every vertical line vertical), but as a WIDER and TALLER view: everything in the attached picture appears again, at the same size relative to each other and in the same places relative to each other, inside a central-bottom region of this image, about the middle 76% of the width and the bottom 64% of the height (its top edge at about 36% down); above that region the picture continues up into more of the same limewash wall and the ceiling (the pendant lamp's cord rising to a ceiling rose); to the left and right it continues into more of the same kitchen (more sage cabinets and marble worktop, more wall), the island and its pale oak slatted front running across the whole width of the image at the same height.
So: the white marble island's back edge is one straight horizontal line across the whole image at about 79% down from the top, its pale oak slatted front below it across the whole width down to the bottom edge; the three identical empty dark walnut serving trays stand on the island top exactly as in the attached picture, evenly spaced, their centres at about 29%, 50% and 71% of the image width, each about 16% of the image width long, their near rims a little back from the island's front edge; the tall window at the left with the sink below it, the three plain empty oak shelves on the wall, the black gas hob set in the sage-green cabinets with brass knobs, the small mirror-work hanging and the round brass pot at the right, the arched doorway with the garden beyond, the white pendant lamp with a brass top.
Two fixes to the attached picture: the TAP at the sink is one simple modern brass mixer tap (one curved spout and one lever on one body), nothing loose beside it; and through the arched doorway there is NO plant on the floor (the garden beyond shows only its greenery and sky, nothing standing on the floor).
Nobody in the picture: no people, no hands, no food, no dishes other than the three empty trays. The wall above the island and the island's back edge across the middle stay plain, for characters added later. Nothing is blurred: the ceiling, the sides and the far garden are as sharp as the middle.

Light: warm late-morning sun through the window at the upper left, soft window-shaped light patches on the wall, every shadow falling down and to the right. Sharp everywhere: no depth-of-field blur, no vignette, no lens flare.

Style: exactly as the attached kitchen and style anchor: a stylised 3D animated-feature-film look, soft global illumination, believable materials (marble with faint warm veins, brushed brass, pale oak, sage paint, limewash), no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No religious images or markers of any kind.
```

#### N1. Nani leaning on the counter, neutral (the base every mood is cut from)
```
Generate an image, 1024×1536, portrait.

Using the attached Nani character sheet as the only reference for who she is (the top-right panel of the sheet, Nani leaning on a counter, is the pose to follow), draw Nani once, large, LEANING on a kitchen counter, relaxed and friendly, as a grandmother leans on her counter to chat with a child: the camera at eye level, straight on, a little above the counter top (the same camera as the attached kitchen). Her upper body tilts a little forward over the counter; BOTH FOREARMS lie flat along the counter top, folded loosely one over the other in front of her, her hands resting on her forearms, both ELBOWS out to the sides and resting ON the counter top. The undersides of her forearms and elbows touch the marble, with a soft contact shadow under each. Her head is a little forward, held straight, a gentle neutral face, mouth closed, looking straight at us.

The counter: a plain warm-white marble slab with faint veins, seen from a little above, its BACK EDGE a perfectly straight horizontal line across the whole image at about 82% down from the top; the marble top shows in front of her forearms down to the bottom edge of the image. Nothing of her shows below the counter's back edge except her forearms, elbows and hands, which rest on top of it. Nothing else on the counter.

Scale and proportions: exactly the proportions of the sheet, a small woman with a normal-sized head; do NOT enlarge the head or the face. Her figure, from the top of her scarf to the counter's back edge, fills about 65% of the image height; her whole head, both shoulders, both elbows and both hands are inside the image with clear background on the left and right.

Keep her exactly as on the sheet: the round thin gold glasses, the deep-red Kutch dupatta over her head covering her hair, the cream long-sleeved kurta with red and gold embroidery at the cuffs and front, small gold drop earrings, the thin diamond tennis bracelet and the red aqiq ring on her right hand, the gold solitaire ring on her left hand, no bangles. Skin a warm light tan (about hex #C49A78), never orange, never pink. Render her face in exactly the same chunky, simplified, stylised way as the attached Nana picture (big soft eyes, smooth simple skin, a readable mouth), not more photographic than him: she and Nana must look like two characters from one film.

Background above and beside the counter: one perfectly flat, uniform neutral mid-grey, hex #808080. No wall, no kitchen, no gradient, no texture. No shadow on the grey.

Style: exactly as the attached sheet, the attached Nana and the style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N2. Nani, happy (an edit of N1)
```
Edit the attached picture. Change ONLY her face, to this expression: a big, warm, happy smile with the eyes crinkled, delighted, as when the child has done well. Her glasses, dupatta, arms, hands and the counter stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N3. Nani, talking (an edit of N1)
```
Edit the attached picture. Change ONLY her face, to this expression: talking, the mouth open mid-word (the teeth just showing), the brows lifted a little, friendly and attentive. Her glasses, dupatta, arms, hands and the counter stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N4. Nani, pointing (attach the kept N1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached picture of Nani leaning on her counter for the exact pose, size, framing and counter, and the attached character sheet for who she is, draw her again exactly as in that picture, at the same size and the same position in the frame, the counter's back edge on exactly the same line, her left forearm (on the viewer's right) still lying flat on the counter exactly as before. The only change: her right arm (on the viewer's left) lifts: the elbow stays resting on the counter, the forearm rises, and her hand comes up to about shoulder height beside her face with the index finger pointing down and to the viewer's right, as if pointing at something on the counter in front of her; a bright, encouraging face, a small smile, mouth closed, looking at us.

Keep her exactly as on the sheet: the round thin gold glasses, the deep-red Kutch dupatta covering her hair, the cream embroidered kurta, the small gold earrings, the tennis bracelet and red aqiq ring on her right hand, the gold solitaire on her left hand, no bangles. Skin a warm light tan (about hex #C49A78), never orange, never pink. Same counter: a plain warm-white marble slab, its back edge a straight horizontal line, the marble top showing in front of her down to the bottom edge.

Background above and beside the counter: one perfectly flat, uniform neutral mid-grey, hex #808080. No wall, no gradient, no texture. No shadow on the grey.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N5. Nani, eyes closed (the blink; an edit of N1)
```
Edit the attached picture. Change ONLY her eyes: both gently closed, as in a calm blink, the lids relaxed behind her glasses; the rest of the face unchanged, mouth closed. Her glasses, dupatta, arms, hands and the counter stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### SK2. The sekelo plate holding one, two, three and four straight skewers (top-down)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME plain oval brushed-steel plate as the attached plate, seen from directly above, straight down, four times in an invisible grid of 2 columns and 2 rows of equal cells, the plate at exactly the same size and position in every cell (its long axis left to right, filling about 80% of the cell's width), with clear background all round; nothing touches a cell boundary or an image edge. Do not draw grid lines, borders or labels.
On the plates, bare skewers exactly like the attached one (a plain thin bamboo stick with a short rounded wooden handle at one end), with NO food on them, lying STRAIGHT and PARALLEL, left to right across the plate, never fanned, never bending, all pointing the same way with the handles to the RIGHT and each handle sticking out past the plate's right rim: cell 1 (top left) ONE skewer across the middle of the plate; cell 2 (top right) TWO skewers, close together and evenly spaced about the middle; cell 3 (bottom left) THREE; cell 4 (bottom right) FOUR, still close together and evenly spaced, all well inside the plate's long edges. The skewers rest flat on the plate with a soft contact shadow on the steel.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached plate, skewer and style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and wood, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### CP1. The chai pan's tilt: flat, 15, 30, 45 degrees, then pouring (attach the s02 pan and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME small steel chai pan as the attached picture (a plain brushed-steel saucepan with a pouring lip at its left side and a straight black handle to the right), seen from DIRECTLY ABOVE, straight down, six times in an invisible grid of 3 columns and 2 rows of equal cells, the pan at exactly the same size in every cell, centred, filling about 70% of its cell's width, with clear background all round; nothing touches a cell boundary. Do not draw grid lines, borders or labels. The pan is full of milky tan chai.
Row 1, left to right: (1) the pan FLAT, level, the chai's surface a full circle; (2) the pan tipped 15 degrees towards its lip (the left side dips a little, the chai's surface a slight oval drawn towards the lip); (3) tipped 30 degrees, the chai gathered at the lip, not yet pouring.
Row 2, left to right: (4) tipped 45 degrees, the chai right at the lip's edge, not yet pouring; (5) tipped 45 degrees and POURING: a smooth stream of milky tan chai leaving the lip to the left and down, with the chai inside the pan as in cell 4; (6) exactly as cell 5 but the liquid is clear dark reddish-brown black tea, in the pan and in the stream.
The pan and its handle stay in exactly the same place and size in every cell; only the tilt and the liquid change. Light from the upper left, with a soft contact shadow under the pan to the lower right.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, no texture. NO shadows on the grey beyond the pan's contact shadow.

Style: exactly as the attached pan and style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DP1. The daar's pieces: onion, ginger-garlic paste, tomato, chilli, cumin, a curry leaf (top-down; attach the s02 ginger and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: eight separate food things, in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 50% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Everything is seen from DIRECTLY ABOVE, straight down, as it looks when it has just gone into a pot of daar: real food, matte, soft, never glossy beads or sweets. Scale: the attached ginger root is the size reference; a single onion piece is about a thumbnail.
Row 1, left to right: (1) a small loose heap of chopped white onion pieces, small translucent curved pieces; (2) ONE chopped onion piece on its own; (3) a small dollop of pale ginger-garlic paste, soft and matte; (4) a small loose heap of chopped red tomato chunks with their seeds.
Row 2, left to right: (5) five or six thin round slices of green chilli, scattered; (6) a small pinch of dried red chilli flakes, scattered; (7) a small pinch of whole cumin seeds, scattered; (8) ONE fresh green curry leaf.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No board, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached ginger and the style anchor: a stylised 3D animated-feature-film look, soft subsurface food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### PT1. The potato: whole, halved, one cube, a pile of cubes (top-down; attach the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: four things, in an invisible grid of 2 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 55% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Everything is seen from DIRECTLY ABOVE, straight down. The potato is a real potato: a matte, slightly rough, pale brown skin with a few small eyes; its cut flesh is pale cream-white with a faint yellow tinge, MATTE and starchy, a little uneven, never shiny, never glossy, never a smooth yellow block (it must not look like butter or cheese).
Cell 1 (top left): one whole potato. Cell 2 (top right): the potato cut in half, the two halves lying cut face up, side by side. Cell 3 (bottom left): ONE peeled potato cube, a little uneven, its faces matte. Cell 4 (bottom right): a loose pile of about eight peeled potato cubes, uneven sizes, a little starchy on the cut faces.
Light from the upper left. No surface drawn, no shadows.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No board, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, soft subsurface food, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

## 6. Cut and wire notes (for the sessions after the run)

- **The doctor (DW1–DD2, and the sheets):** DW1 as a `figure` job (`artcut.py`; feet line; 1× height 0.66 of the exam room, `scenes-v2.json` `exam.doctor`, `stand.doctor`, `door.doctor`); DF1 and DF3 as head layers on DW1's canvas (ECC on the head band); DA1–DA6 whole figures registered to DW1 on the feet line (DA6 is turned the other way, so register on the feet and height only); DD1 trimmed with the right edge flush (exit: right), DD2 a face layer on it, placed at the waiting room's door (`waiting.doctor`, h 0.2). **His box and card faces are cut from `doctor-ref-faces-v1.png`** (a 4×3 grid on a flat blue-grey ground, keyed by colour-to-alpha): neutral (cell 1), talking (2), laughing (3), thinking (8) as 512 px heads replacing `Kit.DOCTOR_FACE` (`js/clinic/screen.js:31,55`, `js/clinic/heal/host.js:385`); the standing figures replace `Kit.doctorFigure` (`js/clinic/stages/diagnosis.js:56`, `sendoff.js:60,87`); the door pictures replace `Kit.person("doctor","neutral")` (`waiting.js:139`, today `rough-art.json` `patients.doctor`). Record them in `data/clinic/heal-art.json` under a new `doctor` key (canvas, feet, heads, poses) so every stage reads one source; the talk animation gets his blink and mouth (ART-19). CLN-150's check then passes by one picture everywhere. The send-off goes back to the front door (`sendoff.js` `onArt ? "exam" : "door"` → `door` with `door.doctor` and DA6; her standing poses already exist): yes, Zafar 15 Oct (CLN-25).
- **The girl's set:** GB1 and GM1 as head layers on her canvas (`heal-art.json` `faces`: `blink`, `talk`), the talk animation keyed to them; GS1 as `girl-face-sore` (a head layer) for the diagnosis's D9 and the send-off's "sore"; GN1 as `girl-stand-front-neutral` on the standing canvas (`sendoff.js` while she says her feeling). RP1 on P1's canvas, the toes re-measured for `foot.json` `place` so levels 1–3 use it. I1 cut as eight soft-edged props (colour-to-alpha against the grey) into `assets/clinic/heal-v3/` as `dirt-<n>` webps (new files); `cut.js` (the dirt layer, `washDone`) and `foot.js` (`blob`, FT2) draw them instead of the discs, washed away as now. I2 registered to K1 as `knee-bump` (`knee.json` art, `kinds: ["girl"]`), shown for the `knee-bump` ailment before the wrap. TD1 trimmed with the left, right and top edges flush (exits) as the tooth game's drill view (`tooth.js` the drill step's zoomed tooth: the decay patches and holes drawn on it as now). DM1 cut whole (trimmed), the four spouts and the chute's mouth recorded; DM2 by its gutters; `boing.json` `machine`, levers and drops with their measured sockets; the upright syringe from `sheets/syringe/syringe-upright`. Her `how she feels` card: wire her heads (`girl-head-*`) into `Kit.feelingFace`'s place (`sendoff.js:112,117,294`), no art.
- **The belt sheets (B1–B10):** `grid` jobs as the s02 sheets into `assets/clinic/sheets/<item>/`; `data/clinic/sheets.json` views and remaps; `data/clinic.json` items gain `sprite`/`img` for bandage, thread, hammer, drill, paste, limu, dudh, honey, spoon, patch, apple, cup, blanket, tissue, stethoscope, crutches, torch, bottle; the coloured ones cut as `<base>-<colour>` so `Kit.icon` finds an own-colour sprite and the CSS tint (`.cl-item[data-colour]` filters) stops applying to them; the plaster's belt view replaced by B1's level one; the comb dropped from `pipeline.json` decoys. The pharmacy shot at `/review` is the proof (every belt item on the belt, its base on the surface, ×2 zoom).
- **The kitchen master (K1):** upscale ×1.367 (Real-ESRGAN) to 2100×1400, trim 25 px top and bottom to 2100×1350, save it beside `assets/cook/bg/service-v2.webp` as a new `service-master-v1` webp (plus the 1600×900 core crop as a new `service-v3` for anything that still wants 16:9); measure the island's back edge and the three trays on the core (`artcut` background job) into `art.s02.kitchen-trays.meta` (core coordinates). `fitBg` (`js/cook/stations.js:146`) draws the master 1:1 with the core offset (250, 450) and shows as much as the stage has room for; `occluder()` (`:682`) crops from master y 1061 (core 611); `trayFront` (`js/cook/flow.js:777`) likewise: that closes CK-44 and ART-21 with SH-91's first master. The other scenes' masters follow in the next run.
- **Nani (N1–N5), the plate (SK2):** as the s05 audit's section 6 (the counter line at y 608, head about 180 px wide, moods as head layers, way (b) for the forearms needs Zafar's yes; the plate's four registered cells into `v3/sekelo/plate-straight-{1..4}.webp`).
- **The chai pan (CP1):** six registered cells into `assets/cook/items/chai-v2/` as `pan-tilt-{0,15,30,45}`, `pan-pour-milk-v2`, `pan-pour-black-v2` (one canvas, the lip measured for `meta.lipX/lipY`); the pour in `chai.js` steps through the tilts before the stream.
- **The daar pieces (DP1), the potato (PT1):** props into `v3/daar/` and the chop station's potato states; `daar.js` draws the pieces as they go in and keeps them through the stir (DAAR-05).
