# Sprint 2 art: the kitchen, the served dishes, the Cook fixes, the coin jar, the clinic sprite sheets and the girl (pack `s02`)

**Written:** 6 Oct 2026, for Sprint 2 item 5 (`docs/archive/sprints/S02-play-and-fix-cook-clinic.md`). **Status:** ready for Zafar's go; nothing runs until he says so (decision 43).
**Built from:** `CLAUDE.md` (non-negotiables 13, 16), `.claude/skills/art-run/SKILL.md`, `docs/design-language/art-bible.md` (§1 style, §2 light, §3 cameras, §4 scale, §8 items), `docs/design-language/art-pipeline.md` (§1 grounds and export, §15 tools and the runner loop), the worked example `clinic-heal-art-plan.md`, `docs/feedback/cook-playtest-2026-10-06.md` §1b, `docs/feedback/clinic-playtest-2026-10-06.md` §1b, decisions 60–65, and the open lines of `clinic-heal-redo-list.yaml`.

**How to use this page:** sections 1–3 are the thinking (D4, D5): what each image is for, how the game sees it, the camera and the light. Section 4 is the run order. Section 5 holds the prompt texts the runner pastes (one code box per ID). Section 6 names the generated block. Section 7 is the judging, 8 the cut, 9 the estimate, 10 the questions for Zafar.

---

## 0. In short

- **45 images** in six parts, committed by Chrome to `sources/art/s02/` on `main`:
  - **A, the kitchen (1):** the service background redrawn at full size, same camera, three empty trays on the island, one marble edge under the sink, nobody in it.
  - **B, the served dishes (1):** one sheet of eight dishes at the counter's angle, each drawn to sit in a tray.
  - **C, the Cook fixes (11):** the pouring pan (milk tea and black tea), black-tea glass states, a real teaspoon, the small spice jars bigger with distinct lids, ginger that reads as ginger, a sekelo plate with no sticks, a plain side-on chaat glass, a margin-safe smaller knife, the daar bowl and trivet as two images, six samosa fold frames on one baseline.
  - **D, the coin jar (2):** one jar at five fill levels on one canvas; a coin and a small pile.
  - **E, the clinic items as sprite sheets (17):** one sheet per item, 6–9 views each, with spares (decision 65), planned from where each item appears (the table in 3.5).
  - **F, the girl (13):** a standing pose with palms forward (D3), a standing wave for the send-off, a mouth-less-open close-up for brushing with its plaque layer; and the nine open lines of the clinic redo list (U1, M1, M2, Y1–Y3, T1, W10, O2) rerun with the fault named in the prompt.
- **No real person is drawn.** Nani's leaning picture exists (the top-right panel of `sources/art/characters/nani-sheet-v2-approved.png`, cut as `assets/cook/characters/nani-neutral.webp`): the kitchen is drawn empty and she is placed on it by code, as now. Zafar sees the composite (Nani on the new counter) at the review before it ships; nothing in the run waits for him.
- **Zafar's time:** about a minute to paste the block. The runner judges every image itself (decision 29).
- **Light everywhere:** warm, from the upper left; every shadow falls down and to the right (Zafar, K4: "sun is coming in from the left"). Sprites carry no shadow; code draws the contact shadow (art bible §2).

---

## 1. Reused on purpose, retired, not in this run

**Reused (D23):**

| Art | Where | Used for |
|---|---|---|
| Nani leaning on the counter | `assets/cook/characters/nani-neutral.webp` (+ `-happy`, `-talk`, `-point`), from `nani-sheet-v2-approved.png` top-right | Placed by code on the new kitchen (decision 64). Only the bob is toned down (code, Session B). Never redrawn here |
| The kitchen's layout | `assets/cook/bg/service.jpg` | The reference the kitchen is redrawn from: same camera, same places |
| The chai pan and glass | `sources/art/chai-v2/pan-pour-draft1.png`, `glasses-draft1.png` | Identity references for C1–C3 (the same pan, the same glass) |
| The milk-tea glass states, the pan-top states | `assets/cook/items/chai-v2/`, `assets/cook/items/v3/chai/` | Stay; only the black-tea states are new |
| The spice-jar shape | `sources/art/pantry-v2/pantry-v2-sheet2-spice-jars.png` | The jar C5 keeps (bigger, lids that differ) |
| The sekelo plate's steel | `sources/art/cook-v3-1/r6-plate-0-4-v2.png` | The plate's look, without the sticks |
| The daar trivet bowl | `sources/art/cook-v3/d2-ladle-trivet-bowl-v1.png` | The bowl and the trivet C10 splits |
| Every clinic item already cut | `assets/clinic/items-v2/`, `room-items/`, `heal-v3/` | Stay wired until a sheet lands; the CI sheets (`sources/art/clinic-v2/items/ci1…ci5`) and R1 are attached so each new sheet is the same object |
| The girl | `sources/art/clinic-heal-v3/s1-girl-sheet-v2.png`, `girl-w1-front-neutral-v1.png` | The only identity references for part F |

**Retired when the new art is cut:** `basket.webp` as the served dish (K4); `pan-pour.webp` (baked shadow, clipped corner); the code-drawn spoon (`mechanics/count.js`); `shelf-veg-14-jar-f.webp` ("gummies"); the fanned-stick sekelo plates `plate-0…4`; `v3/chaat/bowl-side.webp`; `tool-knife-t.webp`; `daar-bowl-trivet-plain.webp` as one image; `fold-1…6`; the clinic's single-view items as the belt/tray/tool pictures (the sheets replace them view by view).

**Not in this run:** the chaat layers as "flat, simple, side-on like the end screen" (T4: a design question for Session B first); the fever room's sweat and snowflake icons and the swirl icon (code SVG); the eye chart (code); the knee wrap path (code); the pot's flat top edge (to be confirmed in play); the review-screen tick's fringe (a re-cut, not new art); the doctor and Big Ma (their photos); evening and night relights of the kitchen (service plays by day).

---

## 2. Staging and canvas rules

**Grounds (art-pipeline §1):** every sprite sheet on flat mid-grey `#808080`, no shadows, no floor. The food here (pastry, ginger, dishes) sits with steel, glass or wood in the same sheet, and the pale warm colours key cleanly off grey, so grey everywhere; magenta nowhere (it tints steel and glass). Glass, steam and the glass bowl are cut colour-to-alpha, never hard-keyed.

**Sizes:** ChatGPT stops at 1536 px on a side.

| Kind | Made at | Export | Notes |
|---|---|---|---|
| **The kitchen (A1)** | 1536×1024, the scene inside a central 16:9 band | Cropped to 1536×864, upscaled ×2 (Real-ESRGAN) and resampled to **3200×1800 `@2x` and 1600×900** | Real detail about 1536 wide, against ~830 today (feedback §1b). `Stage.has2x` lists it |
| **Sheets (B, C, D, E, F-O2)** | 1536×1024, an invisible grid, cells 384–512 px | Each cell trimmed, 16 px pad, longest side at most 512 (states registered on one canvas) | Sprites show at 90–260 px on the 1600×900 stage |
| **Single items (C1, C2, C4, C7, C8, C9)** | 1024×1024 | Trimmed, pad 16, at most 512 (the pan and the glass bowl up to 800: they show large) | |
| **The girl's wide poses (W11, W12)** | 1024×1536 | Figure at the W1 scale (`heal-art.json` girl: 275×472 at 1×; `@2x` from the source) | Registered to W1 on the head height, feet on one line |
| **Her close-ups (M3, M4, RM1, RM2, RY1–RY3, RT1, RU1)** | 1536×1024 or 1024×1536, the part running off the edges | As the clinic pack: source size, `@2x` upscaled | Exit edges are the bleed (clinic plan 2.2) |

**Cameras (art bible §3):**
- **Kitchen and dishes:** E, eye level, straight on, the island's top edge horizontal at about 65% of the height. A dish for a tray is drawn as the island is seen: **front and a little above**, the camera about at rim height looking 10–15° down, so a little of the inside shows and the base is hidden by the tray's rim.
- **Cook stations:** T, straight down, rims as circles, for the teaspoon, the ginger pieces, the sekelo plate, the knife, the bowl and the trivet, the fold frames, the pouring pan (the pan is tipped in the top-down view, so its rim reads as an ellipse and the stream leaves the spout: the tilt is drawn, not rotated in code).
- **Pantry:** F, straight on at mid-height, 10° down, for the spice jars and the ginger jar.
- **Clinic:** the belt (CB4c) is E, items front and a little above as the CI sheets; the tray is T; the tool column is a small front/three-quarter icon; in use is the game's working angle (3.5).
- **The coin jar:** F, straight on, a hint of the rim.

---

## 3. Thinking before prompting, image by image

### 3.1 The kitchen (A1; decision 64; ART-13)

| What's for | How it's seen | Camera | What's in it | What stays clear |
|---|---|---|---|---|
| The service screen's background behind every order, the pocket-money screen and the greetings | Full-bleed at 1600×900 and on tablets | E, the island top edge at about y 0.65, verticals vertical, as `service.jpg` | The same room: window and brass tap at the left, the sink worktop with **one** marble edge (no doubled strip at x 0–105, y 565–590), three empty oak shelves, the black hob in sage cabinets, the mirror-work hanging and brass pot at the right, the arched doorway, the pendant lamp; the marble island with its oak-slat front across the whole width; **three identical empty trays** on the island, side by side at about 22%, 50% and 78% of the width, each about 14% of the width, long sides parallel to the island edge, with their own soft contact shadow to the lower right | **Nobody**: Nani's cut is placed by code behind the island centre, forearms on the counter, so the island's back edge and the wall behind her at x 0.35–0.65 up to the shelves stay plain; no food, no hands, no text |

**Why trays in the background:** the dishes are placed into them by code (B), the rim hides each dish's base, and the three positions are one per customer (decision 64). The cut records each tray's inner box (x, y, w, h and the rim's top line) in `data/cook/service-trays.json` so `drawServed` lands each dish on its tray's floor.

### 3.2 The served dishes (B1; K4)

| Cell | Dish | Why this way |
|---|---|---|
| 1 | Milky chai in a cutting glass | The glass as C3's; orange-brown milky |
| 2 | Black tea in the same glass | Clear deep amber; the two must differ at 90 px (C9) |
| 3 | A stack of four maani on a steel plate | Soft, brown-spotted |
| 4 | A steel bowl of yellow daar | Loose and yellow, a little tadka on top |
| 5 | A glass bowl of layered chaat | Plain thin glass (as C8), layers readable |
| 6 | Two folded samosas on a small steel plate | Golden, triangular |
| 7 | Two sekelo skewers on a steel plate | Skewers left to right, parallel (S2) |
| 8 | A small woven basket of pantry things | A steel milk jug, a plain tea tin, a small cloth sack: the pantry order's "served" picture |

All eight from the front and a little above, lit from the upper left, nothing under them (the tray is in the background), on grey.

### 3.3 The Cook fixes (C1–C11)

| ID | For | Camera | Size on screen | Notes |
|---|---|---|---|---|
| **C1** pan pouring, milk tea | The chai pour (`chai-tray.js`): the pan tipped towards the glass | T, the pan tipped about 35° towards the lower left, a stream of milky chai leaving the spout | About 420 px wide | The same pan as the attached draft (brushed steel, one long handle at the upper right). Whole pan and handle inside the image with a wide margin (the old one's corner was clipped, C7). No drawn shadow |
| **C2** the same pan, black tea | The black-tea order (C9, CHAI-07) | An edit of C1: only the liquid and the stream change to clear deep amber | As C1 | Registered to C1 |
| **C3** black-tea glass, three states | The glass filling with black tea | F, straight on, as the attached glasses | About 120 px tall | Empty, half, full on one registered canvas; the same cutting glass as the milk-tea set, so code swaps sets |
| **C4** teaspoon | Stirring the sugar (C18) | T, lying flat, bowl at the left, handle to the right | About 180 px long | Plain steel, slightly thickened (art bible §1 Do) |
| **C5** spice jar family | The pantry's small jars (PA14, PAN-09) | F, 10° down | Fills a slot (about 130 px tall) | Garlic cloves, ginger knobs, green cardamom pods, coarse salt, in four identical small glass jars whose **lids differ**: brass, dark wood, matte black, white ceramic; contents large and clear through the glass; no labels |
| **C6** ginger | The chai station's ginger (C24) | T | About 110 px | A knobbly fresh ginger root with pale tan skin and a cut end showing yellow fibre, and three thin slices beside it: two cells |
| **C7** sekelo plate | The skewers' plate (S2, SEK-07) | T, straight down | About 520 px wide | A plain oval steel plate, empty, **no sticks, no food**; code lays the skewers straight, left to right |
| **C8** chaat glass bowl | The side-on assembly glass (T1, CHT-03) | E side-on, exactly | About 600 px wide | A simple thin clear glass bowl: straight-sided, a thin base, **no thick bottom, no reflections or highlights**, just the two thin wall lines and a faint tint; cut colour-to-alpha |
| **C9** knife | The chop (D1, D10) | T, lying flat, blade left, handle right | About 180 px (smaller than today's 260) | Steel blade, pale wood handle, **whole knife inside the image with a margin of at least 10% all round** |
| **C10** daar bowl, trivet | The daar serve (D4): the bowl lifts, the trivet stays | T, straight down | About 230 px | Two cells: a steel bowl of plain yellow daar (no tadka) and the round woven trivet, empty, each centred; the bowl's radius about 0.8 of the trivet's so it sits inside |
| **C11** samosa fold frames | The fold swipes (A4, SAM-05) | T, six cells | About 380 px wide | **One pastry strip at the same place and height in every cell**, the strip's top and bottom edges on the same two lines in all six; the triangle grows from the left end by diagonal folds; nothing above or below the strip's lines; simple matte pastry, not hyper-real. Frame 6 is the finished triangle at the strip's left end, the same height |

### 3.4 The coin jar (D1, D2; C11, decision 51)

| ID | For | Camera | Notes |
|---|---|---|---|
| **D1** the jar at five levels | The pocket-money screen: the jar fills as each card's coins drop in | F, straight on, a hint of the rim | Five cells, **the same jar at the same size and place in each**: a plain clear glass jar with a brass lid, empty, a quarter, half, three-quarters, full of plain gold coins; no label; the coins matte-gold with soft edges, no markings |
| **D2** a coin and a pile | The coins that drop from the card into the jar; the "total" picture | F, slightly above | Two cells: one coin standing on its edge and a small heap of five; plain gold, **no numbers, letters or faces** on the coins |

### 3.5 The clinic items as sprite sheets (E1–E17; decision 65)

**The logic.** Each item appears in up to four places, and each place has its own camera: **belt** (the pharmacy's painted belt, CB4c, eye level: front and a little above, as the CI sheets), **tray** (the doctor's tray and the heal tray: top-down), **tool** (the heal games' tool column: a small front or three-quarter icon, the belt view reused where it reads), **use** (the working angle in the game). Spares are the views a future game is most likely to need (fully side-on, three-quarter, the other state). One sheet per item, 1536×1024, an invisible grid of 4×2 (8 cells) unless the row says otherwise, cells left to right then the second row.

| Sheet | Item | Where it appears → the view it needs → cell | Spares |
|---|---|---|---|
| **E1** dabbing cloth | Scrape: belt (folded, front-above) → 1 · tray (folded, top-down) → 2 · tool (folded, front) → 3 · use: the dab (bunched, pressed down, seen from above) → 4 · use, three-quarter → 5 | 6 folded exactly side-on · 7 the dab, wet (a darker patch) · 8 the cloth unfolded flat, top-down |
| **E2** plasters, flat | Pharmacy colours (`pipeline.json` coloured.plaster; the colour ladder): the eleven plasters top-down, **solid colour across the whole strip and pad**, in a 4×3 grid → 1–11 (red, yellow, blue, green, skin, red-yellow, red-blue, red-green, yellow-blue, yellow-green, blue-green: two-colour ones split lengthwise, half and half); 12 empty | — |
| **E3** plaster, views (the red one) | Belt (lying, front-above) → 1 · tray (top-down) → 2 · tool (front, turned 30°) → 3 · use on the knee (arched, seen from the front) → 4 · use on the forearm (gently curved, from above) → 5 · use on the upper arm (short curve, side) → 6 | 7 side-on edge · 8 half peeled, backing lifting. Code recolours the views for the other colours (a flat hue shift, as the hand reskins) |
| **E4** drop bottle | Ear and eye: belt (standing, front-above) → 1 · tray (top-down) → 2 · tool (front) → 3 · **use: nozzle down**, tilted 45°, a drop forming at the tip → 4 · use: nozzle straight down → 5 | 6 standing exactly side-on · 7 the cap off, beside it · 8 squeezed, a drop falling |
| **E5** toothbrush | Tooth: belt (lying, front-above) → 1 · tray (top-down, bristles up) → 2 · tool (front) → 3 · **use: into the mouth**, handle to the upper right, bristles to the lower left at 30° → 4 · use: bristles straight down → 5 | 6 exactly side-on, bristles left · 7 bristles up at 60° (the brushing stroke's other end) · 8 with a pea of white paste |
| **E6** hand fan | Fever: room (lying flat, front-above) → 1 · tray (top-down) → 2 · tool (face-on) → 3 · **use: pointing down**, the handle up, the blade down, seen front-on at the patient → 4 · use, tilted left 25° → 5 · use, tilted right 25° → 6 | 7 exactly side-on edge · 8 three-quarter from above |
| **E7** desk fan | Fever: belt (front, face-on) → 1 · three-quarter → 2 · tray/top-down → 3 · **use: head tilted down** 30°, front → 4 · head tilted down, three-quarter → 5 | 6 exactly side-on facing left · 7 from behind · 8 icon-sized front (the same as 1, smaller detail check) |
| **E8** hot-water bottle | Fever: room (lying, front-above) → 1 · tray (top-down) → 2 · tool (upright, front) → 3 · use (hugged: leaning back 20°, front) → 4 | 5 upright exactly side-on · 6 lying, neck to the left · 7 from behind · 8 stopper off |
| **E9** heater | Fever: room, **facing left** (three-quarter to the left, off) → 1 · the same, on → 2 · front, off → 3 · front, on → 4 · exactly side-on facing left, off → 5 · the same, on → 6 | 7 top-down · 8 from behind. Pairs registered (same place and size) |
| **E10** alcohol wipe | Boing: belt (sealed packet, front-above) → 1 · tray (packet, top-down) → 2 · tool (packet front) → 3 · packet torn, wipe peeking → 4 · **use: the wipe bunched**, pressed down, from above → 5 · wipe unfolded flat → 6 | 7 packet exactly side-on · 8 the wipe three-quarter. The packet is plain white with one blue band, no text |
| **E11** syringe | Boing: belt (lying, front-above) → 1 · tray (top-down) → 2 · tool (front) → 3 · **upright, barrel open at the top, empty** (the drop machine) → 4 · the same, filled with clear liquid → 5 · **use: the jab**, tilted 45°, cap down to the lower left, plunger up → 6 | 7 exactly side-on · 8 plunger pressed. The blue cap stays on in every view; no bare needle (a children's game) |
| **E12** tweezers | Ear and foot: belt (lying, front-above) → 1 · tray (top-down) → 2 · tool (front) → 3 · **use: tips down**, vertical → 4 · use: tilted 45°, tips to the lower left → 5 · tips closed holding a splinter → 6 | 7 exactly side-on · 8 tips open wide, top-down |
| **E13** cotton bud | Ear and taste: belt (the pot, front-above) → 1 · tray (the pot, top-down) → 2 · one bud flat (tray) → 3 · **use: tilted 45°**, tip to the lower left → 4 · use: vertical, tip down → 5 · bud with green ointment → 6 | 7 bud with wax · 8 pot exactly side-on |
| **E14** waste bin | Ear: where the wax goes (a bin instead of the tissue): front → 1 · three-quarter, lid closed → 2 · three-quarter, lid open → 3 · top-down, open → 4 · exactly side-on → 5 · tool (front, small) → 6 | 7 a steel kidney dish three-quarter · 8 the kidney dish top-down (the "waste tray" option) |
| **E15** ear bits at the ear's angle (6 cells, 3×2) | Ear: wax blobs **as they sit on an ear seen side-on**, three-quarter lit from the upper left: big → 1 · medium → 2 · small → 3 · the seed likewise → 4 · a wax blob on the cotton bud's tip, side → 5 | 6 a wax blob falling (teardrop) |
| **E16** jugs (9 cells, 3×3) | Foot: hot, cold, lukewarm: belt (standing, front-above) → row 1 · tray (top-down) → row 2 · **use: pouring**, tilted 40°, spout to the lower left, a stream → row 3. Hot: a soft steam wisp; cold: frost on the glass and two ice cubes; lukewarm: plain | — |
| **E17** thermometer | Fever and diagnosis: belt (lying, front-above) → 1 · tray (top-down) → 2 · tool (front) → 3 · **use: in the mouth**, tilted 30°, bulb to the lower left → 4 · use: vertical, bulb down → 5 · under the arm (tilted 60°) → 6 | 7 exactly side-on · 8 bulb to the right (reading side). Tick marks only, no digits |

Every sheet attaches the CI sheet (or R1) that holds the item today, so the sheet is **the same object in more views**, in the clinic's plastic, steel and cloth. Each cell's item fills about 60% of its cell; nothing touches a cell boundary.

### 3.6 The girl (F; clinic feedback §1b; `clinic-heal-redo-list.yaml`)

| ID | For | Camera and framing | Notes |
|---|---|---|---|
| **W11** standing, palms forward | D3: the doctor asks for a part; a bigger standing patient with palms forward so hands, arms, knees and feet can all be tapped | 1024×1536, standing, front, both feet flat on one level, arms a little out from the sides, **palms turned to us**, fingers apart | The same girl as the sheet and W1 (round face, two short plaits with white ribbons, yellow long-sleeved kurti dress, white leggings, white sandals); fills about 85% of the height; no floor |
| **W12** standing, waving | The send-off (the redo list's open "new" line) | As W11, one hand lifted in a small wave, a big happy smile | Registered to W11 on the feet |
| **M3** mouth less open | Brushing: teeth take about a third of the mouth's height, the lips relaxed | 1536×1024, front, from just above the nose to below the chin, cheeks running off the left and right edges | Clean white teeth, top and bottom rows showing a little, the tongue low |
| **M4** plaque | The plaque layer the brush clears | An edit of M3: only the teeth change: a soft, matte, pale-yellow film with a few paler speckles over the front teeth | Registered to M3; cut as a teeth-only layer with a mask |
| **RU1** upper arm | Boing (the redo: a bare shoulder and the chin were in shot) | 1536×1024, the bare upper arm about half the height, **the yellow sleeve pushed up to the shoulder and clearly in view**, the arm leaving the bottom edge, **nothing of the head, neck or plaits** | |
| **RM1** mouth open | Tooth (the redo: framed too wide) | As M3 but mouth wide open, "aah"; **the cheeks run off both sides, no ears, plaits or collar** | |
| **RM2** tongue out | Taste (the redo: too wide, rosy cheeks) | As RM1; the tongue out and down, plain pink; **plain skin, the tongue the only pink** | |
| **RY1** eyes clear | Eye drops (the redo: too wide) | 1536×1024, from the forehead to below the nose, **the head's sides run off the left and right edges**, both eyes across the middle | Base for RY2, RY3 |
| **RY2** one eye sore | An edit of RY1: only the eye on the viewer's right pink | | |
| **RY3** eyes closed | An edit of RY1: both eyes gently closed | | |
| **RT1** eye test A | The split screen (the redo: she looked away from the chart) | 1024×1536, head and shoulders, one hand over the eye on the viewer's right, **the other eye looking a little to our right, past us, at a chart just off the picture** | |
| **RW10** hugging the bottle | Fever (the redo: 2.4% smaller than W1, feet 2% off) | 1024×1536, **exactly W1's size, framing, seat and feet** (the attached front picture), the teal knitted bottle hugged to the tummy | Registered to W1 on the legs and feet |
| **RO2** mouth bits | Taste and tooth (the redo: the spots read as sweets) | 1536×1024, 4×2: four **matte, softly irregular, slightly raised sore spots** in red, yellow, blue, green, the same size, no gloss; three jagged decay patches; one white filling patch | |

---

## 4. The run order (what makes the sprint safe)

| Part | Prompts | Images | Why this order |
|---|---|---|---|
| **A** | A1 | 1 | The kitchen first: Session B's service screen and the pocket-money screen need it, and it's the one image Zafar will see first |
| **B** | B1 | 1 | The dishes sit on A1's trays |
| **C** | C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11 | 11 | Cook's regression rows, in station order |
| **D** | D1, D2 | 2 | The pocket-money screen |
| **E** | E1 to E17 | 17 | The clinic sheets, in the order the heal games are played (scrape, plasters, ear, tooth, fever, boing, foot) |
| **F** | W11, W12, M3, M4, RU1, RM1, RM2, RY1, RY2, RY3, RT1, RW10, RO2 | 13 | The girl: her new poses first, then the redo list |

**Dependencies:** C2 is an edit of C1; M4 of M3; RY2 and RY3 of RY1; W12 attaches the kept W11. Everything else attaches only repo files, so three windows run freely from the start.

---

## 5. The prompts

**For the runner:** paste each code box exactly as written; no slots are used in this pack (the PEOPLE table below is for the generator's check only). An edit (C2, M4, RY2, RY3) attaches only the one kept image it edits and is only ever made from a fresh picture (D9).

### PEOPLE table (the slot texts)

| Person (run-list prefix) | {NAME} | {KEEP} | {LEGS} |
|---|---|---|---|
| girl | the girl | the round face, the two short plaits with small white ribbons, the yellow long-sleeved kurti dress, the white leggings and the white sandals | the lower legs hang down freely over the edge, the feet not touching anything. |

### Part A: the kitchen

#### A1. The service kitchen, full size, three trays, nobody in it
```
Generate an image, 1536×1024, landscape.

Using the attached kitchen picture as the only reference for the room, redraw the same kitchen at full detail from exactly the same camera: eye level, straight on, one-point perspective, every vertical line vertical, the white marble island's top edge horizontal at about 65% of the image height, its pale oak slatted front below it across the whole width. Everything in the same place as the reference: the tall window and brass tap at the left, the sink's marble worktop with ONE single clean marble edge (no second strip below it), the three plain empty oak shelves on the warm limewash wall, the black gas hob set in the sage-green cabinets with brass knobs, the small mirror-work hanging and the round brass pot at the right, the arched doorway with the garden beyond, the white pendant lamp with a brass top. Keep the whole scene inside a central 16:9 band: the top and bottom 80 pixels show only more wall above and more oak slats below, so the image can be cropped to 16:9 with nothing lost.

New in this picture: three identical small, shallow, rectangular serving trays of rich dark walnut wood (the same warm dark walnut as the chakla rolling board and velan rolling pin) with low rims, completely empty, standing side by side on the island top, evenly spaced with their centres at about 22%, 50% and 78% of the image width, each about 14% of the image width long, their long sides parallel to the island's front edge, their near rims a little back from the island's front edge, each with a soft contact shadow to its lower right. Nothing else on the island.

Nobody in the picture: no people, no hands, no food, no dishes other than the three empty trays. The wall and the island's back edge across the middle stay plain, for a character added later.

Light: warm late-morning sun through the window at the upper left, soft window-shaped light patches on the wall, every shadow falling down and to the right. Sharp everywhere: no depth-of-field blur, no vignette, no lens flare.

Style: exactly as the attached kitchen and style anchor: a stylised 3D animated-feature-film look, soft global illumination, believable materials (marble with faint warm veins, brushed brass, pale oak, sage paint, limewash), no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No religious images or markers of any kind.
```

### Part B: the served dishes

#### B1. Eight served dishes at the counter's angle
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: eight served dishes in an invisible grid of 4 columns and 2 rows of equal cells, one dish per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Every dish is seen from the front and a little above, the camera about at the rim's height looking about 15 degrees down, so a little of the inside shows, as a dish on a kitchen island is seen by someone standing in front of it. Each dish stands on a flat base; nothing is drawn under it.
Row 1, left to right: (1) a small faceted "cutting" chai glass full of milky, orange-brown chai; (2) the SAME glass full of clear, deep amber black tea with no milk; (3) a neat stack of four soft, thin, round flatbreads with light brown spots, on a plain round steel plate; (4) a plain steel bowl of loose yellow lentil daar with a little golden tempered cumin on top.
Row 2, left to right: (5) a simple thin clear glass bowl with straight sides, holding layered chaat: boiled potato and chickpeas at the bottom, white yogurt, a brown tamarind streak, fine yellow sev and green coriander on top, each layer readable; (6) two golden, crisp, triangular folded samosas on a small plain steel plate; (7) a plain oval steel plate with two grilled skewers of small marinated meat cubes, onion and pepper, both skewers lying parallel, straight, left to right; (8) a small round woven palm basket holding a plain steel milk jug, a plain unlabelled round tea tin and a small cream cloth sack.
Light from the upper left; the highlights and the shading agree with it on every dish.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no table, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials (brushed steel, thin glass, soft bread, glossy daar), soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Halal food only; no sweets.
```

### Part C: the Cook fixes

#### C1. The chai pan, tipped and pouring milky chai
```
Generate an image, 1024×1024, square.

One small brushed-steel saucepan for a children's cooking game, exactly the same pan as the attached picture (a plain cylindrical steel body with a small pouring lip and one long flat brushed-steel handle with a hole at the end), seen from directly above, tipped about 35 degrees towards the lower left so that a smooth stream of milky, orange-brown chai pours from its lip down towards the lower left corner. The pan's rim reads as an ellipse because of the tilt; the chai inside gathers at the lip. The handle points to the upper right. The whole pan, the whole handle and the whole stream are inside the image with a clear margin of at least 10% of the image on every side: nothing is cut off by an edge.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no surface, no gradient, no texture. NO shadows of any kind, not under the pan and not from the handle.

Style: exactly as the attached pan and style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C2. The same pan pouring black tea (an edit of C1)
```
Edit the attached image. Change only the liquid: the chai in the pan and the stream pouring from its lip become clear, deep amber black tea with no milk, slightly translucent where the stream is thin. Everything else stays exactly as it is: the pan, the handle, the tilt, the size, the position, the stream's shape and path, the background. The image keeps exactly the same size and shape as the attached picture, with the same perfectly flat, uniform neutral mid-grey background, hex #808080, edge to edge, and NO shadows of any kind.

Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C3. The black-tea glass, three states
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: three glasses in an invisible grid of 3 columns and 1 row of equal cells, one glass per cell, centred, each filling about 70% of its cell's height, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. All three are the SAME small faceted "cutting" chai glass as the attached glasses, at exactly the same size and position in each cell, seen straight on from the front at the glass's mid-height, with a hint of the rim's inside showing.
Left to right: (1) the glass empty; (2) the glass half full of clear, deep amber black tea with no milk, its surface a flat ellipse; (3) the glass full to just below the rim with the same clear amber black tea.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached glasses and style anchor: a stylised 3D animated-feature-film look, semi-photoreal glass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C4. A teaspoon, top-down
```
Generate an image, 1024×1024, square.

One plain stainless-steel teaspoon for a children's cooking game, seen from directly above, lying flat and level, its bowl at the left and its handle running to the right, slightly stockier than a real spoon so it reads at a small size, centred and filling about 80% of the image width, with clear background all round; nothing touches the image edges. No sugar, no liquid in it.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C5. The small spice jars, bigger, with lids that differ
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: four small glass pantry jars in an invisible grid of 4 columns and 1 row of equal cells, one jar per cell, centred, each filling about 80% of its cell's height, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. All four are the same small, clear, straight-sided glass jar as the attached pantry jars, seen straight on from the front at the jar's mid-height with the camera looking about 10 degrees down so a little of the lid's top shows. Each jar is full to the shoulder so its contents are large and clear through the glass, and each has a DIFFERENT lid.
Left to right: (1) whole garlic cloves, papery white with a hint of purple, under a polished brass lid; (2) knobbly pieces of fresh ginger root with pale tan skin and one cut face showing pale yellow fibre, under a dark wood lid; (3) green cardamom pods, under a matte black lid; (4) coarse white salt crystals, under a white ceramic lid.
No labels, no stickers, no text on any jar. Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No shelf, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached jars and style anchor: a stylised 3D animated-feature-film look, semi-photoreal glass and brass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C6. Ginger that reads as ginger, top-down
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: two things in an invisible grid of 2 columns and 1 row of equal cells, one per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Both are seen from directly above, lying flat.
Left to right: (1) one hand of fresh ginger root: knobbly, branching, with thin pale tan skin, fine rings and lines across it, and one cut end showing pale yellow fibrous flesh; (2) three thin round slices of fresh ginger lying flat and slightly apart, pale yellow with a thin tan rim and a fibrous centre.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No board, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. It must look like real ginger root, never like sweets or gummies.
```

#### C7. The sekelo plate with no sticks
```
Generate an image, 1024×1024, square.

One plain oval stainless-steel serving plate for a children's cooking game, seen from directly above, completely EMPTY: no skewers, no sticks, no food, no pattern, no rim decoration. Its long axis runs left to right, centred, filling about 85% of the image width, with clear background all round; nothing touches the image edges. A gentle rolled rim, brushed steel, like the attached plates.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached plates and style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C8. A plain thin side-on chaat glass
```
Generate an image, 1024×1024, square.

One simple clear glass serving bowl for a children's cooking game, seen exactly side-on at the bowl's mid-height, EMPTY: straight, very slightly flaring sides, a thin flat base the same thickness as the walls, a plain rim. Drawn as simply as possible: the glass is only a faint cool tint with two thin wall lines, NO reflections, NO highlights, NO thick bottom, NO facets, NO pattern. Centred, filling about 85% of the image width and about 60% of the height, with clear background all round; nothing touches the image edges.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows of any kind.

Style: as the attached style anchor but simplified: a stylised 3D animated-feature-film look with the glass drawn flat and plain, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C9. A smaller, margin-safe chef's knife, top-down
```
Generate an image, 1024×1024, square.

One kitchen knife for a children's cooking game, seen from directly above, lying flat and level with the blade pointing left and the pale oak handle to the right, the cutting edge at the bottom: a plain brushed-steel blade, a little stockier than a real knife so it reads at a small size, with a simple rounded wooden handle and two small brass rivets. Centred and filling about 75% of the image width, with a clear margin of at least 10% of the image on every side: the tip and the handle's end are both well inside the image, nothing is cut off by an edge.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No board, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal steel and wood, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C10. The daar bowl and its trivet, two images
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: two things in an invisible grid of 2 columns and 1 row of equal cells, one per cell, centred, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Both are seen from directly above, their rims perfect circles.
Left to right: (1) the steel bowl from the attached picture, on its own with NOTHING under it: a plain brushed-steel bowl full of smooth, loose, plain yellow lentil daar with no tempering on top, filling about 55% of its cell's width; (2) the round woven trivet from the attached picture, on its own, EMPTY: a flat round mat of coiled natural palm fibre with a simple woven pattern, filling about 70% of its cell's width, so the bowl would sit inside it with a clear margin of trivet showing.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached picture and style anchor: a stylised 3D animated-feature-film look, semi-photoreal steel and fibre, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C11. Six samosa fold frames on one baseline
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's cooking game: six frames of a samosa pastry strip being folded, in an invisible grid of 3 columns and 2 rows of equal cells, one frame per cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Everything is seen from directly above, lying flat.
THE RULE FOR EVERY FRAME: the pastry strip is a long horizontal rectangle of plain, pale, matte samosa pastry, exactly the same height in every frame, lying in exactly the same place in its cell: its top edge and its bottom edge are on the same two horizontal lines in all six cells, and its right-hand end is at the same place in all six cells. NOTHING in any frame goes above the strip's top line or below its bottom line. The fold happens at the LEFT end of the strip and works to the right; the folded part never gets taller than the strip.
Reading order: (1) the flat strip, unfolded, filling about 80% of its cell's width; (2) the left end folded up diagonally to make a small triangle flap, the rest of the strip flat; (3) the triangle folded over once more along a diagonal, now a pocket the full height of the strip, the rest flat; (4) the pocket folded over again diagonally to the right, the strip behind it shorter; (5) the last of the strip folded over the pocket, a small tail left; (6) the finished closed triangle, the height of the strip, standing at the left end of where the strip was, and nothing else in the cell.
Simple, clean, matte pastry: smooth pale surface with a very faint flour dusting, no cracks, no detailed texture, not hyper-realistic.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No board, no gradient, no texture. NO shadows of any kind.

Style: as the attached style anchor, simplified: a stylised 3D animated-feature-film look with soft matte surfaces, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

### Part D: the coin jar

#### D1. The coin jar at five fill levels
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's game: five jars in an invisible grid of 5 columns and 1 row of equal cells, one jar per cell, centred, each filling about 80% of its cell's height, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. All five are the SAME plain clear glass jar with a rounded shoulder and a polished brass screw lid, at exactly the same size and position in each cell, seen straight on from the front at the jar's mid-height with a hint of the lid's top showing. No label and no sticker.
Left to right: (1) the jar empty; (2) a quarter full of plain round gold coins; (3) half full; (4) three-quarters full; (5) full to the shoulder. The coins are matte warm gold with soft edges and NO markings, numbers, letters or faces, heaped loosely inside the glass.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal glass and brass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### D2. One coin and a small pile
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's game: two things in an invisible grid of 2 columns and 1 row of equal cells, one per cell, centred, each filling about 50% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Both are seen from the front and slightly above.
Left to right: (1) one plain round gold coin standing on its edge, facing us; (2) a small loose heap of five of the same coins, two lying flat and three leaning. The coins are matte warm gold with soft edges and NO markings, numbers, letters or faces: plain smooth discs with a slightly raised rim.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed gold, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

### Part E: the clinic items as sprite sheets

Every sheet below uses this opening and this tail; only the middle (the cells) differs.

#### E1. The dabbing cloth
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the soft light-blue folded cloth from the attached clinic things: the same cloth, colour and fabric in every cell.
Row 1, left to right: (1) folded in a neat square, seen from the front and a little above; (2) folded, seen from directly above; (3) folded, seen straight on from the front; (4) in use: bunched up and pressed down as if dabbing a graze, seen from directly above, the fabric gathered at the top.
Row 2, left to right: (5) the same bunched dab, seen from the front and a little above; (6) folded, seen exactly side-on; (7) the bunched dab with a small darker damp patch at its base; (8) unfolded, lying flat and open, seen from directly above.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E2. The plasters, flat, solid colour all the way
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eleven adhesive plasters in an invisible grid of 4 columns and 3 rows of equal cells, one plaster per cell, centred, lying flat and level, seen from directly above, each filling about 75% of its cell's width, with clear background all round; nothing touches or crosses a cell boundary; the last cell (row 3, column 4) is left empty. Do not draw grid lines, borders or labels. Every plaster is the SAME shape and size as the attached plasters: a rounded strip with a slightly raised square pad in the middle and tiny breathing dots. The colour covers the WHOLE plaster, strip and pad alike, matte and even, with no pattern.
Row 1, left to right: (1) bright red; (2) bright yellow; (3) bright blue; (4) bright green.
Row 2, left to right: (5) plain skin-toned beige; (6) half red, half yellow, split along the strip's long axis; (7) half red, half blue; (8) half red, half green.
Row 3, left to right: (9) half yellow, half blue; (10) half yellow, half green; (11) half blue, half green; (12) empty.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached plasters and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E3. One plaster in eight views (the red one)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is one adhesive plaster exactly like the attached plasters, bright red all over, strip and pad alike, matte and even.
Row 1, left to right: (1) lying flat, seen from the front and a little above; (2) lying flat, seen from directly above; (3) lying flat, turned about 30 degrees, seen from the front and above; (4) stuck over a knee: arched like a bridge, seen from the front, nothing under it.
Row 2, left to right: (5) stuck along a forearm: gently curved, seen from above, nothing under it; (6) stuck on an upper arm: a short tight curve, seen from the side, nothing under it; (7) seen exactly side-on edge-on, a thin curved line of red; (8) half peeled, one end lifting with its white paper backing coming away.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached plasters and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No skin or body parts drawn: the plaster alone, curved as if on them.
```

#### E4. The drop bottle
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the small clear plastic drop bottle with a white screw cap and a white dropper nozzle from the attached care kit: the same bottle in every cell, no label.
Row 1, left to right: (1) standing upright, seen from the front and a little above; (2) standing, seen from directly above; (3) standing, seen straight on from the front; (4) in use: cap off, held nozzle DOWN, tilted about 45 degrees with the nozzle to the lower left, one clear drop forming at the tip.
Row 2, left to right: (5) in use: cap off, nozzle pointing straight down, one clear drop at the tip; (6) standing, seen exactly side-on; (7) standing with its cap off and the cap lying beside it; (8) squeezed, nozzle down, one clear drop just falling below the tip.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and style anchor: a stylised 3D animated-feature-film look, semi-photoreal plastic and glass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E5. The toothbrush
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the white and light-blue toothbrush from the attached care kit: the same brush in every cell.
Row 1, left to right: (1) lying flat, bristles to the left, seen from the front and a little above; (2) lying flat, bristles up, seen from directly above; (3) lying flat, seen straight on from the side with the bristles facing us; (4) in use: held diagonally, the handle to the upper right and the bristles to the lower left, tilted about 30 degrees from horizontal, bristles facing down and left.
Row 2, left to right: (5) in use: held vertically, bristles pointing straight down; (6) exactly side-on, bristles to the left, the brush head's profile clear; (7) held diagonally the other way, the handle to the lower right and the bristles to the upper left at about 60 degrees; (8) lying flat as in (1) with a small pea of white toothpaste on the bristles.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and style anchor: a stylised 3D animated-feature-film look, semi-photoreal plastic, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E6. The hand fan
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the round woven palm-leaf hand fan with a short plain wooden handle from the attached comfort things: the same fan in every cell.
Row 1, left to right: (1) lying flat, seen from the front and a little above; (2) lying flat, seen from directly above, the handle to the lower right; (3) upright, seen face-on, the handle at the bottom; (4) in use, POINTING DOWN: held by the handle at the top with the round blade below it, seen face-on, as if fanning someone below.
Row 2, left to right: (5) pointing down, tilted about 25 degrees to the left; (6) pointing down, tilted about 25 degrees to the right; (7) seen exactly side-on, edge-on, a thin woven line with the handle; (8) seen from the front and above at a three-quarter angle, upright.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached comfort things and style anchor: a stylised 3D animated-feature-film look, semi-photoreal woven fibre and wood, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E7. The desk fan
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the small cream desk fan on a round base from the attached clinic things: the same fan in every cell, no dials or switches with markings.
Row 1, left to right: (1) seen straight on from the front, the blades facing us; (2) seen from the front and a little above, turned a three-quarter angle; (3) seen from directly above; (4) in use: the head tilted DOWN about 30 degrees, seen from the front, so the blades face down and towards us.
Row 2, left to right: (5) the head tilted down about 30 degrees, seen at a three-quarter angle; (6) seen exactly side-on, FACING LEFT, the head's profile clear; (7) seen from behind, the motor's back; (8) seen straight on from the front as in (1), slightly smaller.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and style anchor: a stylised 3D animated-feature-film look, semi-photoreal plastic, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos, dials or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E8. The hot-water bottle
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the hot-water bottle in a plain teal knitted cover with a cream rubber neck and stopper from the attached comfort things: the same bottle in every cell.
Row 1, left to right: (1) lying flat, the neck up, seen from the front and a little above; (2) lying flat, seen from directly above; (3) standing upright, seen straight on from the front; (4) as if hugged: upright, leaning back about 20 degrees, seen from the front, nothing holding it.
Row 2, left to right: (5) standing upright, seen exactly side-on; (6) lying flat with the neck to the left, seen from directly above; (7) standing upright, seen from behind; (8) standing upright, the stopper out and lying beside it.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached comfort things and style anchor: a stylised 3D animated-feature-film look, semi-photoreal knit and rubber, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E9. The heater, facing left
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the small free-standing cream electric heater with two horizontal heating bars and two small feet from the attached comfort things: the same heater in every cell, no dials, switches or markings. Views that come in an OFF and ON pair are at exactly the same size and position in their two cells.
Row 1, left to right: (1) turned a three-quarter angle to the LEFT (its front faces left and towards us), switched OFF, the bars grey; (2) the SAME view, switched ON, the bars glowing warm orange with a soft warm glow just around them; (3) seen straight on from the front, OFF; (4) the SAME front view, ON.
Row 2, left to right: (5) seen exactly side-on, its front FACING LEFT, OFF; (6) the SAME side view, ON, the glow showing at the left; (7) seen from directly above; (8) seen from behind.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached comfort things and style anchor: a stylised 3D animated-feature-film look, semi-photoreal painted metal, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos, dials or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E10. The alcohol wipe
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a single-use antiseptic wipe: a small flat square foil-paper packet, plain white with one light-blue band across it and NO text, and inside it a thin folded white cloth wipe. Rendered like the attached care kit.
Row 1, left to right: (1) the sealed packet lying flat, seen from the front and a little above; (2) the sealed packet, seen from directly above; (3) the sealed packet standing upright, seen straight on; (4) the packet torn open along its top, the white wipe peeking out.
Row 2, left to right: (5) in use: the wipe bunched up and pressed down as if wiping skin, seen from directly above; (6) the wipe unfolded, lying flat and open, seen from directly above; (7) the sealed packet seen exactly side-on, edge-on; (8) the bunched wipe seen from the front and a little above.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and style anchor: a stylised 3D animated-feature-film look, semi-photoreal foil and cloth, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E11. The syringe set for the boing
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the clear plastic syringe with a white plunger and a light-blue cap from the attached clinic things: the same syringe in every cell, its blue cap ON in every view, no bare needle anywhere, and no scale digits (plain tick marks are fine).
Row 1, left to right: (1) lying flat, the cap to the left, seen from the front and a little above; (2) lying flat, seen from directly above; (3) lying flat, seen straight on from the side; (4) standing upright with the cap at the bottom, the plunger pulled out so the barrel is OPEN at the top and empty.
Row 2, left to right: (5) standing upright as in (4), the barrel full of clear liquid; (6) in use: held diagonally, tilted about 45 degrees, the cap pointing to the lower left and the plunger to the upper right; (7) lying flat, seen exactly side-on; (8) lying flat as in (1), the plunger pressed fully in.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and style anchor: a stylised 3D animated-feature-film look, semi-photoreal clear plastic, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E12. The tweezers
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the steel tweezers with angled tips from the attached care kit: the same tweezers in every cell.
Row 1, left to right: (1) lying flat, tips to the left, seen from the front and a little above; (2) lying flat, seen from directly above; (3) lying flat, seen straight on from the side; (4) in use: held vertically, tips pointing straight DOWN, slightly open.
Row 2, left to right: (5) in use: held diagonally at about 45 degrees, tips to the lower left, slightly open; (6) tips closed, gripping one thin wooden splinter; (7) seen exactly side-on, edge-on; (8) lying flat, seen from directly above with the tips open wide.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E13. The cotton bud and its pot
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eight views of the cotton buds and their pot from the attached care kit, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The same clear round pot full of buds and the same single bud (plain white cotton tips, a pale wooden stick) in every cell.
Row 1, left to right: (1) the full pot, seen from the front and a little above; (2) the full pot, seen from directly above; (3) one bud lying flat and level, seen from directly above; (4) in use: one bud held diagonally at about 45 degrees, its tip to the lower left.
Row 2, left to right: (5) in use: one bud held vertically, tip pointing straight down; (6) one bud lying flat with a dab of pale green soothing ointment on its right-hand tip; (7) one bud lying flat with a little glossy golden ear wax on its right-hand tip; (8) the full pot seen exactly side-on.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E14. The waste bin (and a kidney dish)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eight views in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Cells 1 to 6 are the SAME small brushed-steel pedal bin with a hinged lid, as in a clinic, plain and clean, empty; cells 7 and 8 are a plain brushed-steel kidney-shaped dish, empty. Rendered like the attached clinic things.
Row 1, left to right: (1) the bin seen straight on from the front, lid closed; (2) the bin at a three-quarter angle, from the front and a little above, lid closed; (3) the bin at the same three-quarter angle, lid OPEN, the empty inside visible; (4) the bin seen from directly above with the lid open, the round empty opening clear.
Row 2, left to right: (5) the bin seen exactly side-on, lid closed; (6) the bin seen straight on from the front, lid closed, slightly smaller; (7) the kidney dish from the front and a little above; (8) the kidney dish from directly above.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E15. Ear bits at the ear's angle
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: six small things in an invisible grid of 3 columns and 2 rows of equal cells, one thing per cell, centred, each filling about half of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Each is seen at a three-quarter angle from the side and a little above, as something sitting on the ear of a person seen side-on, lit from the upper left so the near side is lit and the far side is in soft shade. Friendly and clean, never gross.
Row 1, left to right: (1) a big blob of ear wax: a soft, rounded, glossy golden-yellow blob like a dab of honey-coloured clay; (2) the same kind of blob, medium-sized; (3) the same kind of blob, small.
Row 2, left to right: (4) one small, round, smooth, shiny brown seed; (5) the tip end of a cotton bud (white cotton tip and a short length of pale wooden stick) with a little golden wax on the tip, seen at the same angle; (6) a small golden wax blob falling, teardrop-shaped, matte.
Nothing else drawn: no ear, no skin.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E16. The jugs: hot, cold, lukewarm, in three views
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: nine views in an invisible grid of 3 columns and 3 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the plain clear glass water jug from the attached foot-soak sheet, in three states that are the same jug: column 1 HOT (full of water, a soft wisp of steam rising from the top), column 2 COLD (full of water, a light frost on the glass and two ice cubes floating), column 3 LUKEWARM (full of plain clear water, nothing else). Each row is one view, and all three jugs in a row are at exactly the same size and position in their cells.
Row 1: standing upright, seen from the front and a little above, handle to the right.
Row 2: standing upright, seen from directly above, the rim a circle, the handle to the right.
Row 3: in use: pouring, tilted about 40 degrees with the spout to the lower left, a smooth stream of water leaving the spout towards the lower left, the handle up to the right.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached foot-soak sheet and style anchor: a stylised 3D animated-feature-film look, semi-photoreal glass and water, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E17. The thermometer
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the glass clinical thermometer with a steel bulb and a red line from the attached care kit: the same thermometer in every cell, with plain tick marks only and NO digits.
Row 1, left to right: (1) lying flat, the bulb to the left, seen from the front and a little above; (2) lying flat, seen from directly above; (3) lying flat, seen straight on from the side, the scale facing us; (4) in use: held diagonally at about 30 degrees from horizontal, the bulb to the lower left.
Row 2, left to right: (5) in use: held vertically, the bulb pointing straight down; (6) held at about 60 degrees from horizontal, the bulb to the lower left; (7) seen exactly side-on, edge-on, a thin glass line; (8) lying flat with the bulb to the RIGHT, the scale facing us.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and style anchor: a stylised 3D animated-feature-film look, semi-photoreal glass and steel, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

### Part F: the girl

#### W11. Standing, palms forward (for D3)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet and the attached seated front picture as the only references for who this is, draw the girl once, large: STANDING upright, full body, front view, facing us, both feet flat on one level and a little apart, her arms held a little out from her sides and slightly bent, both PALMS turned towards us with the fingers relaxed and apart, as if showing us her hands; a gentle neutral face, looking at us, mouth closed. Draw no floor: she stands on an invisible level. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep her exactly as on the sheet: the round face, the two short plaits with small white ribbons, the yellow long-sleeved kurti dress, the white leggings and the white sandals. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W12. Standing, waving (the send-off)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet and the attached standing picture as the only references for who this is, draw the girl once, large, exactly the same size and in exactly the same place as in the attached standing picture: STANDING upright, full body, front view, facing us, both feet flat on one level in the same place as in the standing picture, her left arm (on the viewer's right) relaxed at her side, her right arm lifted with the hand up beside her head in a small friendly wave, the palm towards us; a big happy smile, looking at us. Draw no floor. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep her exactly as on the sheet: the round face, the two short plaits with small white ribbons, the yellow long-sleeved kurti dress, the white leggings and the white sandals. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### M3. Mouth less open, for brushing
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is, draw an extreme close-up of the girl's face from just above the tip of her nose to just below her chin, front view, facing us, so close that her cheeks run off the LEFT and RIGHT edges of the image: no ears, no plaits, no hair, no collar and no clothing in the picture, only the lower face. Her mouth is relaxed and OPEN A LITTLE: the lips parted so the teeth show through a gap about one third of the mouth's height, the top row of small, clean, white teeth clearly visible and a little of the bottom row, the tongue low and out of the way, the lips soft and natural, not stretched. Clean, healthy teeth and gums. Her skin a warm light tan (about hex #C49A78), smooth and plain, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the face does not cover, above and below. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### M4. The plaque (an edit of M3)
```
Edit the attached image. Change only the teeth: cover the visible front teeth with a soft, matte, pale creamy-yellow film of plaque with a few slightly paler speckles, thickest near the gum line, so the teeth look dull and in need of brushing; nothing gross, no decay, no dark spots. Everything else stays exactly as it is: the face, the lips, the mouth's shape and opening, the skin, the size, the position and the background. The image keeps exactly the same size and shape as the attached picture, with the same perfectly flat, uniform neutral mid-grey background, hex #808080, and NO shadows of any kind.

Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### RU1. The child's upper arm (redo: a sleeve pushed up, nothing of the head)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is (the girl on the sheet, a child of about five), draw a close-up of her bare upper arm for a children's doctor game: seen from the side and a little in front, the arm hanging relaxed, the bare upper arm from the shoulder to just above the elbow filling about half of the image height, a little right of centre. The yellow sleeve of her kurti dress is PUSHED UP to the shoulder and clearly visible, bunched above the bare upper arm. The arm leaves the image at the BOTTOM edge (the elbow and forearm are off the picture) and the side of her yellow dress is at the LEFT edge. NOTHING of her head, neck, chin, hair or plaits is in the picture: the image stops below the shoulder. Clean skin with no marks. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the arm and dress do not cover. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bare shoulder beyond the pushed-up sleeve.
```

#### RM1. Mouth wide open (redo: tighter framing)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is, draw an extreme close-up of the girl's face from just above the tip of her nose to just below her chin, front view, facing us, so close that her cheeks run off the LEFT and RIGHT edges of the image: no ears, no plaits, no hair, no collar and no clothing in the picture, only the lower face. Her mouth is WIDE OPEN as if saying "aah": the top and bottom rows of small, clean, white teeth clear and separate, the tongue low, the inside of the mouth soft pink. Clean, healthy teeth and gums. Her skin a warm light tan (about hex #C49A78), smooth and plain, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the face does not cover, above and below. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### RM2. Tongue out (redo: tighter framing, plain skin)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is, draw an extreme close-up of the girl's face from just above the tip of her nose to just below her chin, front view, facing us, so close that her cheeks run off the LEFT and RIGHT edges of the image: no ears, no plaits, no hair, no collar and no clothing in the picture, only the lower face. Her mouth is open and her TONGUE is out and down over her lower lip, plain smooth pink with no spots, filling about half of the image height. Her skin a warm light tan (about hex #C49A78), smooth and PLAIN with NO rosy cheeks and no blush: the tongue is the only pink in the picture. Never orange, never pink skin.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the face does not cover, above and below. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### RY1. Eyes, clear (redo: tighter framing)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is, draw an extreme close-up of the girl's eyes: front view, facing us, from the middle of her forehead to just below the tip of her nose, so close that the SIDES of her head run off the LEFT and RIGHT edges of the image: no ears, no plaits and no ribbons in the picture, only a little hair at the very top where the forehead meets the hairline. Both eyes big, clear and bright, looking straight at us, across the middle of the image; soft brows. Her skin a warm light tan (about hex #C49A78), smooth and plain, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the face does not cover, above and below. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### RY2. One eye sore (an edit of RY1)
```
Edit the attached image. Change only the eye on the viewer's RIGHT: its white becomes softly pink and the lids around it a little puffy and pink, as a mildly sore eye, with no tears and nothing gross. The other eye, the brows, the skin, the size, the position and the background stay exactly as they are. The image keeps exactly the same size and shape as the attached picture, with the same perfectly flat, uniform neutral mid-grey background, hex #808080, and NO shadows of any kind.

Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### RY3. Eyes closed (an edit of RY1)
```
Edit the attached image. Change only the eyes: both eyes gently CLOSED, the lids relaxed with soft lashes, as a calm blink. The brows, the skin, the size, the position and the background stay exactly as they are. The image keeps exactly the same size and shape as the attached picture, with the same perfectly flat, uniform neutral mid-grey background, hex #808080, and NO shadows of any kind.

Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### RT1. Eye test A (redo: looking past us at the chart)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is, draw the girl from the head to the shoulders, front view, facing us, large, her shoulders running off the BOTTOM edge of the image. She is doing an eye test: one hand is lifted flat over the eye on the VIEWER'S RIGHT, the palm towards her face, five fingers together; her other eye is open and LOOKING A LITTLE TO OUR RIGHT, past us, at an eye chart just outside the picture, with a small concentrating smile. Her head is centred and fills about 60% of the image width, with clear background at the left, right and top; only the shoulders touch the bottom edge.

Keep her exactly as on the sheet: the round face, the two short plaits with small white ribbons, the yellow long-sleeved kurti dress. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No wall, no chart, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on the hand.
```

#### RW10. Hugging the hot-water bottle (redo: W1's exact size and feet)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet and the attached seated front picture as the only references for who this is, draw the girl once, large, at EXACTLY the same size and in EXACTLY the same place as in the attached seated front picture: sitting on the edge of a doctor's examination bed, full body, front view, facing us, the backs of the thighs flat and level, the knees bent, both feet resting flat on an invisible step at exactly the same height and place as in the seated picture, her head at the same height. Draw no bed, stool or step. The only change: with both arms she hugs a hot-water bottle against her tummy, a plain teal knitted cover with a cream rubber neck and stopper showing at the top, her hands wrapped round it, with a comforted, cosy face. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep her exactly as on the sheet: the round face, the two short plaits with small white ribbons, the yellow long-sleeved kurti dress, the white leggings and the white sandals. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### RO2. Mouth bits (redo: matte sore spots, never sweets)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eight small things in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about half of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: four small sore spots as on a tongue, all exactly the same size and shape: soft, MATTE, slightly raised, a little irregular in outline like a small blister, with NO gloss, NO highlight and NO hard edge, softly fading into the surface they sit on: (1) red, (2) yellow, (3) blue, (4) green. They must never look like sweets, gumballs, beads or buttons.
Row 2, left to right: (5), (6) and (7): three small, jagged patches of tooth decay, dull brown-grey with uneven edges, each a different shape, each as if lying flat on a tooth; (8) a small, smooth, matte off-white patch of tooth filling, rounded, with no outline.
Each seen from the front, lit from the upper left. Friendly and clean, never gross.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, soft matte materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Nothing that looks like sweets.
```

---

## 6. The paste block for Claude in Chrome

Generated, never hand-written (art-pipeline §15.2):
```
python3 build/tools/art/artblock.py --spec build/tools/art/specs/s02.run.yaml --check
python3 build/tools/art/artblock.py --spec build/tools/art/specs/s02.run.yaml
```
The block is `docs/design-language/art-plans/s02-chrome-block.txt`. It reads this page from the branch `ccr-a7370759-t0lee7` until it reaches `main`. Zafar pastes it into Claude in Chrome as it is (A10).

---

## 7. Judging (D25)

**At generation:** the runner judges each image against its check and the pass/fail list in the block, at most 2 redos.

**After upload, Claude judges again, more strictly, before anything is wired or shown to Zafar:**
1. `python3 build/tools/art/artjudge.py --spec build/tools/art/specs/s02.run.yaml` over `sources/art/s02/` first: FAILs are redos, FLAGs are where to look.
2. **Contact sheets** on black, white and the game's cream at ×2: clean alpha, no grey fringe (the glass bowl, the jugs, the glass states, the drop bottle, the syringe and the coin jar keep partial alpha), a 16 px pad.
3. **The kitchen:** laid under Nani's cut at the service position with the three badge faces and a dish on each tray, at laptop 1366×768, phone 844×390 and tablet 1180×820; the island edge at the same place as `service.jpg` (so `stations.js` positions hold within 2%); no doubled strip; the trays' inner boxes measured.
4. **Registration (D8):** C2 to C1, M4 to M3, RY2 and RY3 to RY1 (ECC; the diff outside the allowed region under 1.5%); the heater pairs in E9; the jar in D1's five cells; the glass in C3's three; the pastry strip's top and bottom lines in C11's six cells (within 2% of the cell height; over that, a redo); W12 to W11 and RW10 to W1 on the feet (over 2% drift, a redo).
5. **Light:** every sheet's highlights at the upper left and shading to the lower right (a sheet with cells lit from different sides is a redo: Zafar's K4).
6. **Skin** on every girl image against `#C49A78` (ΔE over 6 colour-corrected, over 12 a redo); RM2's cheeks plain.
7. **Culture and tone** (I1, I2, 16): no markers, nothing gross, the coins and spots never read as sweets, the syringe never shows a bare needle.

Failures go on `docs/design-language/art-plans/s02-redo-list.yaml`, never to Zafar.

---

## 8. Cut and wire

The cut spec `build/tools/art/specs/s02.cut.json` is written by the cut session from this table (art-pipeline §15.1 job types: `grid`, `closeup`, `figure`; the kitchen's crop-and-upscale and the tray measure are a new `background` job type).

| Images | Cut | Output | Used by |
|---|---|---|---|
| A1 | Crop to the 16:9 band (ECC against `service.jpg` for the island line), Real-ESRGAN ×2, resample | `assets/cook/bg/service-v2.webp` (1600×900) + `@2x`; `data/cook/service-trays.json` (three tray boxes and rim lines) | `stations.js` service, the pocket-money screen, greetings (Session B) |
| B1 | Grid 4×2 | `assets/cook/items/served/{chai-milk,chai-black,maani,daar,chaat,samosa,sekelo,pantry-basket}.webp` | `drawServed` (`flow.js`), on A1's trays |
| C1, C2 | Registered pair | `assets/cook/items/chai-v2/pan-pour-milk.webp`, `pan-pour-black.webp` | `chai-tray.js` pour (replaces `pan-pour.webp`) |
| C3 | Grid 3×1, registered | `chai-v2/glass-black-{empty,half,full}.webp` | `chai-tray.js` black-tea orders |
| C4 | Single | `chai-v2/teaspoon-t.webp` | `mechanics/count.js` (replaces the code spoon) |
| C5 | Grid 4×1 | `assets/cook/items/shelf-{lasan,aadu,elchi,loon}-jar-v2-f.webp` | The pantry's small-jar slots at 1.0 of a slot (`cook.json`) |
| C6 | Grid 2×1 | `chai-v2/ginger-root-t.webp`, `ginger-slices-t.webp` | The chai station's ginger (replaces `shelf-veg-14-jar-f.webp` there) |
| C7 | Single | `v3/sekelo/plate-plain-t.webp` | `grill.js` plate; skewers laid straight by code |
| C8 | Single, colour-to-alpha | `v3/chaat/bowl-side-v2.webp` (+ `meta.json` inside path) | `assemble.js` |
| C9 | Single | `tool-knife-t-v2.webp` | `chop.js` at 180 px |
| C10 | Grid 2×1 | `v3/daar/daar-bowl-plain-t.webp`, `trivet-t.webp` | `daar.js`: the bowl lifts, the trivet stays |
| C11 | Grid 3×2, one canvas, the strip's lines recorded | `v3/samosa/fold-v2-{1..6}.webp` | `samosa.js` fold swipes |
| D1 | Grid 5×1, registered | `assets/cook/items/jar/jar-{0,1,2,3,4}.webp` | The coin-jar screen |
| D2 | Grid 2×1 | `jar/coin.webp`, `coin-pile.webp` | The coin drop |
| E1–E17 | Grid per sheet; registered pairs where the row says so; the jugs' three states per view on one canvas | `assets/clinic/sheets/<item>/<item>-{belt,tray,tool,use,use2,side,…}.webp`, and `assets/clinic/sheets/sheets.json` (item → view → file, pivot) | `kit.js` picks the view by place (Session C wires the map); the single-view items in `items-v2/` stay as fallbacks |
| W11, W12 | Figure; W12 registered to W11 on the feet | `assets/clinic/patients/girl/girl-stand.webp`, `girl-stand-wave.webp` + `@2x` | D3 (`diagnosis.js`), the send-off |
| M3, M4 | Close-up; M4 a teeth-only layer | `closeups/girl/mouth-brush.webp`, `mouth-plaque.webp` + `@2x` | `tooth.json` brushing |
| RU1, RM1, RM2, RY1–RY3, RT1, RW10 | As the clinic pack's U1, M1, M2, Y1–Y3, T1, W10, saved as `-v2` beside the `-v1` | `closeups/child/upperarm-v2…`, `closeups/girl/{mouth,tongue,eyes,eyes-sore,eyes-closed,eyetest-a}-v2.webp`, `patients/girl/girl-front-bottle-v2.webp` | `heal-art.json` repointed |
| RO2 | Grid 4×2 | `heal-v3/spot-{red,yellow,blue,green}-v2.webp`, `decay-{1,2,3}-v2.webp`, `filling-patch-v2.webp` | `taste.json`, `tooth.json` |

Regression rows the wiring sessions recheck: ART-13, CHAI-07, PAN-09, SEK-07, CHT-03, SAM-05, ART-01 to ART-12, the clinic rows in `clinic-playtest-2026-10-06.md` §6.

---

## 9. Estimate

| | |
|---|---|
| **Images** | **45** (1 + 1 + 11 + 2 + 17 + 13). With redos at about a third (the sheets with eight views of one object and C11's registration are the likely redos: expect E-sheets 5–6, C11 1–2, the kitchen 1, the girl's close-ups 2–3), about 60 generations |
| **Zafar's time** | A minute to paste; nothing to approve during the run. He sees Nani on the new kitchen at the review |
| **Run time** | At about a minute an image and three windows: about an hour of generation, two to two and a half hours with redos and commits; an image-limit wait could stretch it across an evening |
| **Cut and review session** | Top model, high effort (visual judgement, rule 15): about 2M tokens, ~$15 (the sprint's figure) |
| **Paid API** | None |

---

## 10. Questions for Zafar (answer "yes to all except …")

1. **Nani is not redrawn:** her existing leaning picture goes on the new kitchen by code, and the kitchen is drawn empty with three plain trays. **Zafar (7 Oct): yes, in the same rich walnut as the rolling pin and board; yes to questions 2-7.***
2. **Pantry basket as a served dish** (a basket holding a milk jug, tea tin and cloth sack) for the pantry order's "served" picture. *Recommend yes.*
3. **Coins with no markings** (plain gold discs: no numbers, no faces, no text, rule 5). *Recommend yes.*
4. **Plaster colours by code** from one red plaster's eight views (a flat hue shift), with the eleven flat plasters drawn solid for the belt and tray. *Recommend yes.*
5. **The syringe keeps its blue cap in every view**, the jab included: no bare needle in a children's game. *Recommend yes.*
6. **A pedal bin for the ear wax** (with a steel kidney dish as the spare "waste tray"). *Recommend the bin.*
7. **The chaat layers' redesign (T4)** waits for Session B's design, not this run. *Recommend yes.*
