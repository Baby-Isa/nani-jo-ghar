# Art pipeline: how art is made, cut, named and checked

How art is made. The look is `art-bible.md`; the method for each batch is here. Sections are copied word for word from the old docs (each headed by where it came from).

---

## 1. Layers, pivots, containers and export

> from: docs/design-language/art-bible.md (as it stood before step 1d) §5 Layers and motion

## 5. Layers and motion

**The rule (from the asset plan):** anything that moves, is tapped, changes state or can be covered is its own layer. Everything else is baked into the background.

| Baked into the background | Separate sprite |
|---|---|
| Walls, floor, window frame, worktop, cabinets, fixed shelves, fixed hob body, fixed decor | Every tappable item, every container that receives items, characters, cats, hands, tools |
| The station surface (board, chakla, hob) **only if it never moves** in that station | Hob knobs (they turn), flame rings, pans and pots |
| | Occluders cut from the background: the island front, a cushion, the stall counter front |
| | Ambient motion: curtain, fan blades, plants and leaf shadows, bunting flags, lanterns, clock hands, birds, steam wisps, dust motes |
| | Story dressing (Birthday decorations; Eid decorations wait for the Eid arc) |

**No doubled surfaces:** a surface is either baked or a sprite, never both. No board drawn on a background that already has one; no chakla on a chopping board.

### Pivots

Record each pivot in the asset list as normalised `[x, y]` (0–1 from the sprite's top-left).

| Sprite | Pivot |
|---|---|
| Hands | Centre of the cuff where the arm leaves the frame edge |
| Tools (knife, ladle, spatula, rolling pin) | The centre of the grip, where the hand holds it |
| Jugs and pans (for tilting) | The lower front corner under the spout or lip |
| Containers, standing items | Bottom centre (the contact point) |
| Character heads, cat heads | The base of the neck |
| Cat tails | The tail root |
| Curtains, bunting, lanterns | The top attachment point (rail, string, chain) |
| Fan blades, clock hands, hob knobs | Centre of rotation |

### Containers

Receiving containers (bowl, basket, pot, thali, tray) are two layers: **back** (the inside and far rim) and **front** (the near rim), so items sit inside. In T view most containers need only one layer plus a code mask for the inner rim.

### Export

- **A cut-out from a keyed sheet** (ChatGPT gives no alpha: see below), stored as **WebP with alpha** in `assets/` (lossless for anything with fine edges; quality about 90 otherwise).
- **Trim** to the item's own bounding box, then **pad 16 px** of transparency on every side.
- **Stored size:** the largest size the sprite appears on the 1600×900 stage, times 1.5 for sharp phones. Backgrounds are exactly 1600×900.
- **Backgrounds are 16:9.** If the generator can't output 16:9, ask for the nearest landscape size with the scene kept inside a central 16:9 band, then crop. Never stretch.
- **Naming:** as in `docs/archive/art/Asset Naming Convention.md`, with the view and state as suffixes: `<item>-<view>-<state>`, e.g. `onion-t-chopped.webp`, `milk-jug-f.webp` (current names: `sources/art/<pack>/`, `shelf-<id>-f.webp`, `icon-<id>.webp`). **(provisional)**

### Grounds: magenta for food, grey for everything else

- **Art is made in ChatGPT via Claude in Chrome (D1, D3), which gives no alpha.** Every prompt asks for a flat ground, which is then keyed out (D22): magenta `#FF00FF` for food, neutral grey `#808080` for steel, brass, glass, wood, tools, characters and badges. A paid image API is only for a rapid prototype under $2 when Zafar can't respond (non-negotiable 13).
- **Never use magenta for steel, brass, glass, glowing or wispy items:** the 3D look makes metal and glass pick up a magenta tint in their reflections. Use the grey ground.
- **Glass and steam need partial alpha,** so they are cut with colour-to-alpha against the measured grey ground, never a hard key. Slice sheets with the method in the Naming Convention (`build/cut_tick_v2.py`; whole blobs by centroid, 2 px erode).

---


---

## 2. Prompt templates

> from: docs/design-language/art-bible.md (as it stood before step 1d) §9 Prompt templates

## 9. Prompt templates

Every prompt = **style block** + the template + **negative block**. Attach the references each template names. Fill in `{…}`.

### Style block (every prompt starts with this)

> Stylised 3D animated-feature-film look: soft global illumination, gentle warm fill, believable materials (marble, brushed steel, polished brass, pale oak, cotton, food with soft subsurface), clean simplified surfaces with restrained detail, appealing slightly chunky proportions, no outlines. Warm late-morning sunlight from the upper left; soft shadows falling to the lower right; a soft contact shadow wherever something touches a surface. Bright, warm, clean palette. Match the rendering of the attached style reference exactly.

### Negative block (every prompt ends with this)

> Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no flat vector style, no painterly brushwork, no photorealism. No depth-of-field blur, motion blur, vignette, lens flare or bloom. No second light source. No extra objects, props, people or background clutter beyond what is described. Correct anatomy: five fingers per hand. No bindi, tilak or other Hindu religious markers.

### (a) Character sheet from photos

Attach: the photos (private), `sources/cook/nani-sheet.webp` for style.

> Create a character sheet for a game character, based on the person in the attached photos, in the style of the attached style reference. Keep the likeness in the features that survive stylising: face shape, {glasses}, {headscarf: how it's worn, colour, pattern}, build, {jewellery}. Stylise the face: large expressive eyes, soft rounded forms, simple readable mouth, smooth skin. She wears {clothing}. On one flat light-grey background, laid out in clear panels: a full-body turnaround (front, three-quarter, side, back); an upper-body front view cut at the waist; head-and-shoulders expressions {neutral, talking, smile, big happy, thinking, surprised, worried, gentle disapproval}; both hands open showing {bangles, rings, sleeve cuff}; close-ups of {accessories and fabric motif}; and a strip of flat colour swatches for skin, hair, eyes and main fabrics. The same person in every panel, identical clothing and accessories.

### (b) A pose from a character sheet

Attach: the signed-off character sheet only.

> Using the attached character sheet as the only reference, show {name} {pose, e.g. "pointing upwards with her right hand, hand above waist height"} with the expression {expression}. Upper body, cut at the waist, front view, as seen standing behind a kitchen island. Keep her face, glasses, headscarf, clothing, embroidery, jewellery and colours exactly as on the sheet. Transparent background.

(For an expression change on an existing pose, use (d)-style in-place editing: "Change only the {mouth/eyes}; every other pixel identical.")

### (c) An item in a given view and state

Attach: `sources/cook/props-sheet.webp` (materials only). Never the item's other states.

> A single {item} {state, e.g. "chopped into small even cubes, heaped loosely"} for a cooking game. View: {F: "front view, camera at the item's mid-height looking about 10 degrees down, standing on its base" | T: "seen from directly above, straight down, round things as circles"}. Real size about {size} cm; draw it as that size would look next to a {reference item}. Centred, filling about 70% of the frame, a soft contact shadow directly under it towards the lower right. Transparent background.

For a state, write the state into the prompt itself (e.g. "small curved, translucent, layered pieces of red onion in a loose pile, seen from directly above"); don't attach the raw item image or use edit mode (section 8). Keep other objects out of item prompts ("only this food in frame: no hands…"): a scale comparison like "next to a child's hand" makes the model draw the hand.

### (d) Edit in place (item onto an empty station)

Attach: the empty station background; a mask covering only the placement area if the API supports it.

> Edit the attached image. Add exactly one {item, state} resting on the {worktop / board / pan} at {position, e.g. "the centre of the board"}, seen from directly above like everything else in the image. Size it as a real {item} relative to the {board, about 25 cm across}. It sits on the surface with a soft contact shadow towards the lower right, lit by the same sunlight from the upper left. Change nothing else: every other pixel stays identical.

**Cut-out:** align, diff against the empty background, keep the largest changed blob, then split it into the **item** (opaque) and its **shadow** (pixels that are only darker, kept as a separate semi-transparent layer). Reject if anything outside the item and its shadow changed.

### (e) A hand pose (parked, H13)

Attach: the signed-off reference hand (after it exists); before that, the style reference.

> The right hand and forearm of a child of about 7, {skin tone}, entering from the bottom edge of the frame, {T: "seen from directly above, back of the hand up, over a worktop" | E: "at eye level, back of the hand towards the viewer"}. Pose: {grip description, e.g. "fingers curled around an invisible horizontal handle, as if holding a knife, thumb along the top"}. No tool or object in the hand. Slender hand, long fingers relative to the palm, smooth, no visible bones, knuckle ridges or veins. Sleeve: a plain white linen shirt sleeve rolled back to between the elbow and the wrist, bare forearm below, the roll just showing at the frame edge (or cropped out); no embroidery. Same hand, skin, size and sleeve as the attached reference hand. Transparent background.

### (f) A reskin (sleeve and accessories only; parked, H13)

Attach: the master hand image.

> Edit the attached image. Change only the sleeve and accessories: {e.g. "replace the sleeve with a plain, modern rolled-back cotton sleeve in a soft dusty pink and add three thin glass bangles in red, green and gold at the wrist"}. Keep the hand exactly the same: identical outline, finger positions, skin, lighting and size. Nothing else changes. Transparent background.

---


---

## 3. Visual QA checklist

> from: docs/design-language/art-bible.md (as it stood before step 1d) §10 Visual QA checklist (cultural accuracy stays in `art-bible.md`)

## 10. Visual QA checklist

Review every contact sheet on **both a black and a white backing**, and every placed asset in an in-game screenshot.

| # | Check | Reject if |
|---|---|---|
| 1 | **Camera matches the background** | A T sprite in an E scene or the reverse; a ¾ view anywhere; ovals where circles are expected in T |
| 2 | **It touches a surface and has a shadow** | Floating; standing on a lip, edge or shadow instead of a surface; shadow in the wrong direction |
| 3 | **Scale matches the reference** | Size order inverts (section 4); more than 1.5× true size; hands not at 1.2× |
| 4 | **No doubled surfaces** | Board on board, chakla on a board, a baked item plus its sprite |
| 5 | **The tap target is obvious** | Below about 90 px; low contrast with its background; covered by a cat, hand or decoration |
| 6 | **Timing cue where the eye already is** | A ring, gauge or verdict away from the item being watched; gauges floating on the hob |
| 7 | **Clean alpha** | A coloured fringe (check on black), halos, clipped edges, a missing 16 px pad, stray pixels |
| 8 | **Light agrees** | Highlights or shadows from a second direction |
| 9 | **Style holds** | Outlines, cel shading, photographic textures, clip-art shine, blur |
| 10 | **Character consistent** | Face, glasses, headscarf, clothing colours or accessories differ from the sheet |
| 11 | **Sleeve consistent** | Sleeve, colour, bangles or hand outline differ from the master |
| 12 | **No text** | Any letters or numbers, even fake ones |
| 13 | **Cultural accuracy** | See below |
| 14 | **Finger count (hands; parked)** | Count every digit, at full size, and write the count down for each hand. Five per hand (thumb and four fingers) unless the pose hides some behind the palm; hidden digits must be where the pose puts them, not missing. Counting frames E3 raise exactly 1, 2, 3, 4, 5 (in "4" the thumb is folded and must not stick out). Reject: a missing or extra digit, two fingers merged, two hands fused into one shape |
| 15 | **Hand scale matches (hands; parked)** | Forearm width just above the sleeve differs from the reference by more than about 5% after the scale normaliser (`build/gen_assets.py`, `forearm_widths()`); the hand looks bigger or smaller than its neighbours on the contact sheet; the normaliser had no room to grow it (flagged in its log) |
| 16 | **Hand camera, light and skin (hands; parked)** | T poses not seen from straight above; E poses showing the palm when the pose says the back of the hand; a forearm entering from the side when the pose doesn't need it; light not from the upper left like the reference; skin not matching the reference after the skin normaliser (orange palms, pale or pink hands) |
| 17 | **Tool gaps (grips; parked)** | A tool drawn in the hand (tools are separate sprites); no clear gap where the tool goes; a keyed-out gap that slices through a finger or leaves a red rim |


---

## 4. Asset naming and slicing

> from: docs/archive/art/Asset Naming Convention.md (whole file)

# Nani jo Ghar — Asset Naming Convention

*How generated art sheets and the individual files sliced from them are named. Companion to the Image Prompt Sheets, Chapter 1 Art Prompts and Technical Plan docs.*

## Source sheets (unsliced, as generated)

Every sheet gets renamed on arrival, kept in `sources/`:

| Sheet type | Pattern | Examples |
| --- | --- | --- |
| Item grid (Template A) | `sheet-<category>-v<N>.png` | `sheet-fruit-v1.png`, `sheet-vegetable-v1.png`, `sheet-spice-v1.png`, `sheet-eid-decorations-v1.png` |
| Character sheet (Template B) | `char-<name>-v<N>.png` | `char-nani-v3.png`, `char-shopkeeper-v2.png` |
| Background (Template C) | `bg-<scene>-v<N>.png` | `bg-bazaar-stall-v3.png`, `bg-nani-kitchen-v3.png`, `bg-spice-cupboard-v1.png`, `bg-sitting-room-v1.png` |

`vN` tracks which regeneration was kept, matching the "kept as vN" notes in the Chapter 1 Art Prompts doc. A background is never sliced — the whole sheet is the game-ready asset once renamed, and saved directly to `assets/backgrounds/`.

## Sliced, game-ready files

**Items already in the content master** (fruit, vegetable, spice, and any future sheet once its words are added to the spreadsheet) are sliced one file per grid cell and named by the content master's `id` column, so the art and the word are joined by filename alone:

```
items/<category>/<id>.png
items/fruit/fru-01.png ... fru-16.png
items/vegetable/veg-01.png ... veg-16.png
items/spice/spi-01.png ... spi-16.png
```

This is what the Technical Plan means by "files named to match the content master's image_ref" — image_ref (`fruit-sheet r1c1`) is the *locator* used to find the item in the source sheet; the *filename* is the id.

**Character sheets** are sliced into their three poses by state name, not by number:

```
characters/<name>/<name>-neutral.png   (mouth closed)
characters/<name>/<name>-talking.png   (mouth open)
characters/<name>/<name>-happy.png     (celebrating)
```

**Items not yet in the content master** (generated ahead of word review, per the rule that images can precede the word list) are sliced and named by a plain English slug instead of an id, since no id exists for them yet:

```
items/<category>/item-<slug>.png       e.g. item-rice.png, item-plate.png
items/colour-threads/thread-<colour>.png
items/sweet-stall/sweet-<slug>.png
```

When any of these categories gets its own content-master rows, rename the files to that sheet's real ids in one pass (matching row order) rather than carrying the slug forward.

**Prop and container sheets** (the containers sheet, tableware sheet, Eid decorations sheet — see Chapter 1 Art Prompts) slice the same way as item grids: each cell gets its own file under `assets/props/<slug>.png` (e.g. `assets/props/lantern.png`, `assets/props/bunting.png`), since these aren't content-master vocabulary items, just scene dressing and carried/destination containers.

## Categories covered so far

| Category | Sheet slug | Status |
| --- | --- | --- |
| Fruit | fruit | In content master (fru-01–16) |
| Vegetable | vegetable | In content master (veg-01–16) |
| Spice | spice | In content master (spi-01–16) |
| Store cupboard | store-cupboard | Generated, not yet in content master |
| Household items | household | Generated, not yet in content master |
| Colour threads | colour-threads | Generated, not yet in content master |
| Clothes stall | clothes-stall | Generated, not yet in content master |
| Sweet stall | sweet-stall | Generated, not yet in content master |
| Eid decorations | eid-decorations | Generated 23 Sep 2026, kept as v1, not yet sliced (`sources/sheet-eid-decorations-v1.png`) |
| Nani | char-nani | v3, sliced |
| Shopkeeper | char-shopkeeper | v2, sliced |
| Bazaar stall | bg-bazaar-stall | v3, background, kept 23 Sep 2026 |
| Nani's kitchen | bg-nani-kitchen | v3, background, kept 23 Sep 2026 |
| Spice cupboard | bg-spice-cupboard | v1, background, kept 23 Sep 2026 |
| Sitting room with dastarkhwan | bg-sitting-room | v1, background, kept 23 Sep 2026 |

## Slicing method

A first version of the script assumed each item sat inside an equal-sized grid box, and blended out the magenta with a soft edge. Both assumptions were wrong: items don't fill their cells evenly (a shoe's toe, a mirror's handle can cross the notional boundary), so a fixed box clipped some items and let slivers of the neighbouring item bleed in; and a soft edge left a visible magenta rim on a dark background.

**The method that actually works:**

1. Key the flat magenta (`FF00FF`) background with a hard colour-distance threshold, not a soft one.
2. Find every connected blob of non-magenta pixels across the *whole* sheet (not per assumed cell).
3. Assign each whole blob — not pixel-by-pixel — to whichever expected grid position its centroid is nearest to. This is what fixes overflow: a shoe that pokes past the midline between two cells is one connected blob, so it moves as a unit to the cell its centre belongs to, rather than being sliced in half at the midline. A multi-part item (three separate lychees, a pile of cloves) still ends up under one label even though its pieces don't touch, as long as each piece's centroid is closer to that cell than any other. A handful of stray pixels (compression noise) too small to be a real fragment is dropped rather than assigned anywhere.
4. Erode the mask by ~2px to remove the anti-aliased rim entirely, then crop to that blob's own bounding box — never a shared fixed box — with a small pad.
5. Alpha is binary (fully opaque or fully transparent), not blended: this is the **legacy magenta method** from the old cel-shaded sheets; the current 3D look uses colour-to-alpha cuts with soft edges (D7, D22).
6. Build a black-backed and white-backed contact sheet per category and check every item against both before delivery — the rim was invisible on white and obvious on black, so checking only one background misses it.

**Known residual cases, not yet fixed:**

- `item-vermicelli.png` (store cupboard, not yet in the content master) still shows a faint magenta fleck around its lacy strand edges — the strands are thin enough that some partially-transparent rim pixels read as "far enough from magenta" by colour distance while still carrying a slight tint. Regenerating that one sheet with "transparent background" in the ChatGPT prompt (rather than magenta) would sidestep the problem entirely; not worth special-casing the script for one item in a future-scene sheet.
- The Eid decorations sheet's fairy-lights cell has the same class of problem: the bulb glow blends into the magenta at the edges. Same fix path — clean cut plus a code-added glow effect, not a regeneration (see Chapter 1 Art Prompts, section 7 review).


---

## 5. Hands (parked: none in Cook, H13)

> from: docs/archive/art/Asset Building Plan.md §1 Hands and arms

## 1. Hands and arms (the player's own)

### 1.1 How hands work in the game

- **First person.** The player's forearms come up from the bottom of the screen, as in Cooking Mama.
- **Rigid images moved in code.** There's no finger animation. Code slides, rotates and swaps images: a knife chops up and down, a ladle goes round, a jug tilts. Most poses are one image. A few have two frames, open and closed (grab, catch, clap, squeeze).
- **Only right hands are drawn.** Left hands are mirrored in code. Two-handed poses are drawn as one image only where the hands touch or overlap (rolling pin, clap, handshake).
- **Hand and tool are separate images.** A "handle grip" hand holds a knife, ladle, spatula, rolling pin, racquet, paddle, drumstick, brush or umbrella, and the tool is its own sprite placed in the grip. That's why the list below is short: **it's organised by grip, not by action.** New actions later are mostly new tools, not new hands.
- **Two cameras:**
  - **Top-down (T):** looking down at a worktop or table. Used for cooking stations, Tidy up and the clinic table.
  - **Eye level (E):** looking forward, with the back of the hand towards the player. Used for greetings, reaching for shelves, Find it, Dress up, music, sport and Snap.

  A pose is drawn only in the cameras it's used in.

### 1.2 Boy and girl versions (Zafar, 24 Sept)

Plan: **generate one master set, then skin it in code** (changed 25 Sept 2026). The image API's edit mode redrew the hands when asked to reskin them, so `build/skin_hands.py` recolours the skin and sleeve of each master and places jewellery sprites at anchor points recorded per pose (`data/hand-anchors.json`); the characters are data (`data/hand-skins.json`).

| Version | Sleeve and details |
|---|---|
| **Master / boy** | Plain white linen shirt sleeve, rolled back to between the elbow and the wrist; bare forearm below. Only sometimes visible: in the top-down set the roll just shows at the bottom edge or is cropped out. No embroidery (replaces the kurta cuff, 24 Sept 2026) |
| **Girl** | The same kind of modern rolled sleeve in a soft colour, plus a few thin glass bangles (the bangles are the main difference) |
| **Girl, Eid** (optional) | The same, with mehndi on the back of the hand and the palm |
| **Nani** (small set, marked N below) | Unchanged: older hands, gold bangles, rings, her red sleeve (`docs/game-design/cast.md`). Used for the "watch me" demos and when she passes you things |

**Modern, not costume (24 Sept 2026):** Zafar's wife wants modern hints and nods to the culture, not caricature. The player's hands wear everyday modern sleeves; culture shows in small touches (glass bangles, mehndi at Eid) and in Nani's own look.

**Hand shape:** slender, slim, with long fingers relative to the palm; smooth, simple surfaces with no visible bones, knuckle ridges or veins (they're rigid sprites moved in code).

**Guarding against drift:** skinned hands keep every master pixel's position, so the outline and the tool gaps can't drift. (The API reskins drifted: 39 of 47 failed the outline check.)

**Skin tone (Zafar, 24 Sept, revised after round 3):** one tone for now, Zafar's own, sampled from his photos: a warm light tan, **not orange, not saturated** — midtone about `#C49A78`, highlights `#D8B894`, shadows `#A07A60` (daylight face sample `#BE826B`); see the Art Bible, section 2. No skin-tone variants for now.

### 1.3 The list (condensed by grip)

Each line: pose, camera, frames, and what it's used for. Games: **C** Cook, **F** Find it, **T** Tidy up, **D** Dress up, **K** Nani's clinic, **W** Who did it?, **M** Monsoon rush, **S** Snap, **G** greetings in every mode, **X** future.

**A. Open hand**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| A1 | Flat palm down | T | 1 | Pressing, kneading, patting bajra rotlo, pressing a samosa edge, feeling a forehead (K), smoothing cloth (T, D) |
| A2 | Heel-of-palm push | T | 1 | Kneading, squashing, pushing an item across the table (T) |
| A3 | Palm up, open | T, E | 1 | Receiving ("here you are"), offering, holding out a hand for a coin, dua with two palms up (mirrored pair) |
| A4 | Reaching, fingers spread | E | 1 | Reaching for a shelf (C pantry, F, T), reaching up high |
| A5 | Wave | E | 2 | Hello and goodbye (G), getting someone's attention |
| A6 | Palm out, "stop" / high five | E | 1 | High five after a perfect order, "stop" or "enough" (C pour), blocking (M) |
| A7 | Hand on heart | E | 1 | Salaam greeting, thank you (G) |
| A8 | Cupped hand | T, E | 1 | Catching drips (M), holding a pile of seeds or spices, washing |

**B. Handle grip (the tool is a separate sprite)**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| B1 | Horizontal handle grip | T | 1 | Knife, spatula, ladle and doi, tadka ladle, whisk, pan handle (tilt a pan), tongs, skewer handle, grater |
| B2 | Vertical grip (fist, thumb on top) | T, E | 1 | Pestle and mortar (grinding), churning (chaas), stirring deep pots, umbrella (M), broom, hairbrush (D), torch |
| B3 | Loose stick grip | E | 1 | Drumstick (dhol, X), racquet and paddle, bat, kite reel (X), stick for the snake-and-ladder counter |
| B4 | Two hands on a rolling pin | T | 1 | Rolling maani (the two hands drawn with the pin, rocked in code) |
| B5 | Hook grip (fingers curled under a handle) | T, E | 1 | Jug handle (pour by tilting), bucket (M), basket (F bazaar), bag, kettle, chai-glass holder |

**C. Pinch and fingertip**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| C1 | Fingertip pinch, open and closed | T, E | 2 | Picking a small thing (spice, bead, coin, chick), placing it, sprinkling and garnish (quick alternation), threading a piece onto a skewer, pulling a thread (D) |
| C2 | Tripod grip (holding a spoon or pen) | T | 1 | Teaspoon (sugar, count-in), mehndi cone (D), piping jalebi, writing a list (F), medicine spoon and thermometer (K), paintbrush |
| C3 | Side pinch (holding something flat) | T, E | 1 | A card, photo (W, S), ticket, chapati edge (flip by hand), fabric (D), a page of the notebook |
| C4 | Pointing index finger | T, E | 1 | The default "tap" hand, pointing at a suspect or clue (W), pressing a button, turning a knob (a small rotation in code). Also the see-through demo finger (already in the game) |
| C5 | Two-hand pinch fold | T | 1 | Folding a samosa, folding cloth (T, D), wrapping a bandage (K), wrapping a gift |

**D. Whole-hand hold and fist**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| D1 | Grab, open then closed | T, E | 2 | Grabbing (the pantry, Tidy up), pulling a rope, picking up a vegetable, carrying |
| D2 | C-shape hold (cup or glass) | T, E | 1 | A chai glass or cup, a lassi glass, holding a bottle, pouring from a jar (tilt in code), shaking a jar |
| D3 | Two hands cupping a bowl | T | 1 | Carrying a bowl or thali, serving, holding a sweet box |
| D4 | Squeeze (fist half-closed, then tight) | T | 2 | Squeezing a lemon, wringing a cloth (M), squeezing a ketchup or chutney bottle |
| D5 | Throw release, fingers opening | E | 1 | Throwing (a ball, kite, grain to the chickens), letting go |
| D6 | Two-hand catch, open then closed | E | 2 | Catching (M, a ball, the chop station's thrown vegetables if we want a catch variant) |

**E. Social and number gestures**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| E1 | Thumbs up | E | 1 | Well done, yes, "just right" |
| E2 | Handshake (hand held out sideways) | E | 1 | Greeting guests (G), making a deal in the bazaar (F) |
| E3 | Counting fingers, 1 to 5 | E | 5 | Numbers everywhere: showing "trae", answering "how many?". **High language value**, since fingers show a number without any digits on screen |
| E4 | Clap, apart and together | E | 2 | Celebrating, rhythm games (X), calling the chickens |
| E5 | Arms up, two fists (celebration) | E | 1 | Perfect order, end of a day, finale |
| E6 | Stretch, two arms up with open hands | E | 1 | Waking up (story beats: the morning of Eid, a new day) |
| E7 | Shrug, two palms up and apart | E | 1 | "I don't know" (W), a wrong guess |

**F. Music, sport and play (mostly future)**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| F1 | Piano hands, fingers curved over keys | E | 2 | Harmonium or piano mini-game (X). Two frames: raised and pressed; keys light up in code |
| F2 | Hand-drum slap, flat and cupped | T | 2 | Dhol or tabla rhythm (X). The flat hand is A1; the cupped hand is a variant |
| F3 | Racquet and paddle | E | 1 | B3 plus a tool sprite, swung by rotating in code (a badminton-style catch game, X) |
| F4 | Holding a camera or phone, two hands | E | 1 | Snap (S) |
| F5 | Holding a kite string | E | 1 | Uttarayan kite flying (X). This is C1 with a string sprite; add it only if the pinch doesn't read well |

**Nani's set (N):** A1, A3, B1, B4, B5, C1, C4, D2, E1, E3 (about 10 poses). She demonstrates, passes things and counts on her fingers.

### 1.4 Totals and cost

**Actual, hands v1 (24–25 Sept 2026; full report `build/reports/art-hands-v1.md`):**

- **Player master set:** 56 images (A1–F5, every camera and frame; F3 and F5 are aliases of B3 and C1). After two review rounds, **47 pass** and **9 still fail** (a2, b1, c2, c3-t, c3-e, d3, d6-f1, e3-count-4, e5). Every master is skin-matched and scaled to the reference forearm (250 px).
- **Characters are made in code, not generated** (`build/skin_hands.py`, data in `data/hand-skins.json` and `data/hand-anchors.json`): each passing master gets its skin recoloured, its sleeve recoloured and jewellery sprites placed at per-pose anchors (wrist and ring finger). Baked: **player-boy 47**, **player-girl 47** (dusty-pink sleeve, three glass bangles), **Nani 88** (47 right hands + 41 left hands; deep-red sleeve, her skin, aqiq ring and tennis bracelet on the right, solitaire on the left, no bangles). **player-girl-eid** waits for the mehndi overlay texture. Rebuilding every character takes minutes and costs nothing.
- **API images:** 214 in all (2 eye-level reference, 56 masters, 71 master retries, 47 girl reskins that were later deleted, 13 Nani reference hands, 25 Nani poses that were archived). The API reskins failed: 39 of 47 girl reskins redrew the hand. That's why reskins and Nani moved to code.
- **Cost:** about **$31.70** at the real rates: 182 images at high quality (the API's silent default, ~$0.167) before the pipeline was fixed, and 32 at medium (~$0.042). The pipeline's own log says $8.63 because it assumed $0.04 an image. Future hand work needs no API calls, apart from new master poses (at medium, about $0.04 each).
- **Still to make:** the 9 failed masters (b1, the knife/spatula grip, first; probably as a pose with the tool drawn on its own layer), the Eid mehndi overlay, and the tools (separate sprites, generated with their station's props): knife, spatula, ladle, doi, tadka ladle, whisk, tongs, rolling pin, teaspoon, jug, pestle, grater, racquet, drumstick, umbrella, brush, mehndi cone, camera and so on.
- **Cost note (24 Sept 2026):** an early run left `quality` unset and the API defaulted to high (~$0.167/1024² image), billing ~$0.16/image instead of the assumed $0.04. `build/gen_assets.py` now always sends `quality` explicitly, prices per quality **and** size (low ~$0.011, medium ~$0.042, high ~$0.167 at 1024², more at larger sizes), and defaults to **medium**. `--draft` (quality low, writes to `drafts/`) is the cheap way to check prompts before a real run; a QA failure (the reskin drift check) auto-retries once by default (`--max-regens N`), never silently more; and any live run estimated over $5 needs `--yes`. `--dry-run` and `--self-test` still make no network calls.

### 1.5 Generation order

1. **Reference hand.** One right hand, top-down, with the embroidered cuff. The runner and Claude judge it (decision 29: only real people need Zafar).
2. **Master set**, top-down poses first (Cook needs them first), then eye level.
3. **The code check.** Drop the hands into two stations (roll and tawa) and check that the grips line up with the tools.
4. **Characters in code** (`build/skin_hands.py`): boy, girl, girl Eid (when the mehndi texture exists) and Nani, from the passing masters; check the anchor sheet (`--check-sheet`) and each character's contact sheet.
5. **Contact sheets** reviewed by Claude against the visual QA checklist (camera angle, scale, clean alpha, cuff consistent). Rejected images go back into the queue.

---


---

## 6. Nani and the cats from real life

> from: docs/archive/art/Asset Building Plan.md §5 Nani and the cats from real life

## 5. Nani and the cats from real life (Zafar, 24 Sept)

**It works, and it won't hurt the style if it's done in the right order:**
1. Photos plus the style reference go in, and out comes a **character sheet** in the game's 3D-film style (turnaround and expressions). The likeness lives in the features that survive stylising: face shape, glasses, hair, the headscarf and its colours, a cat's coat pattern and eye colour.
2. Zafar signs off the sheet.
3. **Every later pose is generated from the sheet, never from the photos again.** That keeps Nani looking the same across hundreds of images.

**Cost:** the current Nani images (poses, talking frames, the LivePortrait test) were made from a generated Nani, so moving to Mum's likeness means redoing Nani's set. Decide before the asset run, not after it.

**Consent:** Mum has agreed (24 Sept 2026), which matters especially once the game is shared with other communities.


---

## 7. The batch method (batch 1: tips and style anchor)

> from: docs/archive/art-prompts/chatgpt-art-prompts.md §0 Tips and §1 The style anchor

## 0. Tips before you start

- **Always attach the style anchor** (`style-anchor-v1.png`, made in step 1) to every prompt after step 1, plus whatever else the attach line says. It's what keeps everything looking like one game.
- **Size:** ChatGPT makes three sizes. Ask for **1536×1024** (landscape) for sheets and backgrounds, **1024×1024** for the style anchor. Every prompt already says which.
- **Regenerate, don't argue.** If an image is wrong, press regenerate or send the same prompt again in a fresh message. Don't chain "no, fix the left one" corrections: each edit drifts the style and faces a little more. The one exception is a single small edit that says "change only…".
- **One chat per character**, and one per background, named after it (e.g. "Nani sheet"). Expressions and relights go in that same chat so ChatGPT keeps the look. **Start a fresh chat for each ingredient sheet** so it never "edits" an earlier sheet.
- **Never make a state by editing another** (whole onion → chopped onion). Each sheet is generated fresh; raw and cooked versions that must match sit on the same sheet.
- **Download the PNG** with ChatGPT's download button. Never screenshot: it shrinks the image and blurs the magenta edge.
- **If ChatGPT won't use a photo**, send the same prompt without that photo: every character prompt already describes the likeness in words.
- **If you hit the image limit**, stop and carry on later; nothing is lost.
- **Handing files back to Claude:** drag the PNGs into the Claude Code chat and say which step they're from (e.g. "sheet 3, v1"). Claude renames them, slices the magenta sheets with `build/slice_sheet.py`, checks every piece on black and white backings against the Art Bible's QA list, and places them in the game. **Mum's, Big Ma's, the doctor's and the cats' photos stay in `sources/private/` and never go into the repo;** the character sheets made from them are fine to share.

### The order

| Step | What | Images |
|---|---|---|
| 1 | Style anchor | 1 |
| 2 | Character sheets: Nani, Big Ma, the doctor, Simba, Zazu, Kasuku, the family | about 18 |
| 3 | Ingredient and prop sheets | 9 (+1 optional) |
| 4 | Backgrounds, then their evening and night versions | 5 + relights |

---

## 1. The style anchor (do this first)

One small top-down kitchen scene in the game's look. You don't use it in the game; you attach it to every later prompt so everything matches. Don't move on until you love it.

**attach:** `assets/cook/bg/service.jpg` (setting, palette, light) and `sources/cook/props-sheet.webp` (material finish only, not its camera).

```
Generate an image, 1024×1024, square.

A small cosy vignette on a kitchen worktop, seen from directly above, straight down (90 degrees), like a top-down cooking game. No walls, no back splashback, no horizon: the worktop fills the whole frame edge to edge.

The worktop is warm white marble with soft, quiet veins. On it, spaced apart with clear marble between them: a pale oak chopping board slightly left of centre; on the board, one whole glossy red tomato and one red onion cut in half, cut face up; above the board, a small matte cream stoneware bowl heaped with bright yellow turmeric powder; to the right, a small polished steel bowl heaped with cumin seeds and a small polished brass bowl; one fresh green chilli lying on the marble. A soft patch of window sunlight falls across the lower left of the marble.

Style: a stylised 3D animated-feature-film look, like a frame from a modern family film. Soft global illumination, gentle warm fill light, believable materials (marble with a faint sheen, brushed steel reflecting warm light, polished brass glints, pale oak grain, glossy tomato skin, powdery spice), clean simplified surfaces with restrained detail, appealing, slightly chunky rounded shapes, no outlines. Warm late-morning sunlight from the upper left; soft shadows falling to the lower right; a soft contact shadow wherever something touches the worktop. Bright, warm, clean palette. Round things seen from above are true circles, not ovals.

Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no flat vector style, no painterly brushwork, no photorealism. No depth-of-field blur, vignette, lens flare or bloom. No second light source. No hands, people or extra objects beyond those described.
```

**save as:** `style-anchor-v1.png`
**check:** straight down, bowls and tomato are circles, no wall visible · reads as a 3D film, not a photo and not a cartoon with outlines · light from the upper left, shadows to the lower right on everything · steel, brass, oak and marble each look like themselves.

---


---

## 8. Colour grounds

> from: docs/archive/art-prompts/chatgpt-art-prompts-batch2.md §0.1 What's different from batch 1

### 0.1 What's different from batch 1

- **Batch 1's tips (its section 0) all still apply:** attach the style anchor every time, regenerate rather than argue, a fresh chat for every sheet, download the PNG (never a screenshot), hand the PNGs back to Claude.
- **Some sheets have fewer cells.** The slicer takes any grid, so a sheet with six items is a 3 × 2 grid, not twelve cells with gaps. Each prompt says its grid.
- **Food goes on magenta (`#FF00FF`); steel, glass, wood and tools go on grey (`#808080`).** No shadows on magenta, every item well inside its own cell, and straight top-down unless the prompt says otherwise.
- **Some prompts attach a batch-1 sprite so the new one matches it** (the wheat maani, the samosas). Those sprites are cut-outs with transparent backgrounds; ChatGPT copes with that.
- **The approved Nani is `char-nani-v2.png`**, not the `char-nani-v1.png` that batch 1's prompts mention. Use v2 wherever a prompt asks for "the approved Nani sheet".


---

## 9. Pantry jars: cutting and labelling

> from: docs/archive/art-prompts/chatgpt-art-prompts-pantry-jars.md "For Claude: renaming, cutting, labelling, slots and the tray"

## For Claude: renaming, cutting, labelling, slots and the tray

### Renaming
- Match each uploaded ChatGPT file to its prompt using Chrome's list, then the download order, then the picture itself, and `git mv` it to the "Claude renames it to" name, in `sources/art/pantry-v2/`.

### Cutting the sheets (`docs/archive/process/VISUAL-QA.md` §2)
- Write `build/cut_pantry_v2.py` on `build/cut_tick_v2.py`'s method, not `slice_sheet.py --key grey`:
  - measure the background from the sheet's edges (the median of the outer 6 px);
  - find the nine cells from the grey gutters (column and row projections of `d > 8`), not by dividing the image by three: ChatGPT rarely spaces cells exactly;
  - the object is everything **not connected** to the flat background, holes filled, largest piece kept, so clear glass and the grey-ish water stay solid instead of turning into holes;
  - edges use colour-to-alpha against the measured background (the eroded core stays alpha 1), which removes the grey baked into the antialiasing;
  - **clear glass:** the first spice sheet shows grey through the empty glass above the contents and at the jar's sides. Don't make those parts solid: give glass-only pixels (close to the background colour, inside the object) colour-to-alpha too, keeping the lid, rims, highlights and contents solid, so the glass shows the shelf behind it rather than baked-in grey.
- **One canvas per container type, registered.** Per sheet: take every cell's object bounding box, then scale the whole sheet by **one** factor (so the nine containers stay the same size as each other) and place each object on an identical canvas, centred horizontally, **its base on the same line** (a fixed bottom margin). Canvas sizes: tall jars and bottles 256×384; spice jars, tubs, crates and packets 256×256.
- Cut the I sheets the same way into `assets/cook/items/icon-<id>.webp` (trimmed, centred on a square canvas, one scale per sheet), and S into one `sticker-blank.webp`.
- Record each type's real height relative to the tall jar in `data/cook.json` (`art.sprites`), e.g. tall jar and bottle 1.0, packet 0.75, crate 0.6, tub 0.55, spice jar 0.5, so a spice jar never shows as big as a flour jar.
- Check every cut on the game's cream background, zoomed: no grey fringe, no ring, no holes (the water bottle especially). Keep the sources in `sources/art/pantry-v2/` and write the webps to `assets/cook/items/` under the "Cuts to" names above (via the labelling step below).

### Putting the labels on (`build/label_pantry_v2.py`)
- **The label:** the blank sticker, with the item's icon scaled so its longer side is about 70% of the sticker's inner circle and centred on it. One label per item, all from the same sticker, so they're identical apart from the picture.
- **Where it goes:** one anchor per container type, set once by eye on that type's canvas and stored in the script: the label's centre (as fractions of the container's box) and its diameter (about a third of the container's height; larger on spice jars and crates if a third reads too small). All nine items of a type use the same anchor, so the labels line up across the shelf.
- **Making it sit on the surface:** on round containers (tall jars, bottles, tubs) squeeze the label slightly towards its left and right edges to follow the curve; square jars, crates and packets stay flat. Then shade it to match the container: darker towards the lower right, a touch of the glass's highlight across it on glass, and a hairline soft edge so it doesn't look cut out. Test on one sheet and show Zafar before doing all seven.
- Write both versions: `shelf-<id>-f.webp` (labelled, what the pantry uses) and `shelf-<id>-bare-f.webp` (no label, for other views later).
- **Check** every labelled item on the cream background, zoomed: the label's the same size and place across the type, the picture reads at shelf size, no fringe.

### Status (28 Sept, evening)
- All 16 images came back and passed; Zafar uploaded them (ChatGPT dump 3) and they're renamed in `sources/art/pantry-v2/` (the first background try wasn't uploaded, so there's no `-try1`).
- Cut with `build/cut_pantry_v2.py`: 63 bare containers (`shelf-<id>-bare-f.webp`), 63 icons (`icon-<id>.webp`) and `sticker-blank.webp` in `assets/cook/items/`. Checked by eye on cream and shelf wood (`build/previews/pantry-v2/`): glass is see-through, lids solid, no grey fringe.
- Labels tested on the spice jars (`build/label_pantry_v2.py --preview 2`, `build/previews/pantry-v2/labels-test-spice.jpg`). They sit well, but at phone size the jar's colour reads better than the label, and white-on-cream icons (salt) vanish. **Zafar: decide later. Claude recommends bare for now.** The labelling script stays ready; if labels come back, give the salt, rice and sugar icons a darker sticker or an outline first.

- **Wired in (28 Sept, late):** the pantry view uses `assets/cook/bg/bg-pantry-v2-1600.webp` (`art.sprites.bg.pantry`; the old `pantry.jpg` stays as the fallback). Each word's container is `art.sprites.shelf` (`<id>.shelf`, with its size), loaded by `art.sprites.need.fetch`. `js/cook/mechanics/fetch.js` places items from `mechanics.fetch.slots` (13 shelf places, the top shelf's two right-hand ones left clear for the tally, and 6 in the fridge), keeps `mechanics.fetch.fridge` things in the fridge, leaves out decoys with no side-on art (chips, maani), and draws the tray's outlined spaces (`mechanics.fetch.tray`), one per thing on the list, each in its container's shape. Screenshots: `node build/shoot_pantry_v2.mjs` → `build/reports/pantry-v2/` (laptop and phone landscape, levels 1 and 4, empty / half / full tray).

- **28 Sept evening (Zafar's play feedback):** the tray's front edge (`mechanics.fetch.tray.front`, cut from the picture) is drawn again over what's on the tray; each outlined space fades as its thing lands; fridge things are drawn at least `fridgeMin` (0.9) so the yoghurt reads; the tally is a grid at most three across (2 × 3 for six), in every Cook station; the pass-me pop-up shows the side-on containers in the pantry. Waiting on the v3 background (P0) for bigger items.

- **Pantry v3 in (29 Sept):** `sources/art/pantry-v2/pantry-v3-bg.png` (Zafar's original from ChatGPT: the v3 layout with the P0-F fridge) → `assets/cook/bg/bg-pantry-v3-1600.webp`. 15 shelf places and 6 fridge places (three levels, level with the wooden shelves), items up to 175 px tall (was 135-150), the tray's six spaces 160 apart with its new front edge, and the tally moved onto the fridge's steel base in the pantry (`mechanics.fetch.tally`, `UI.tallyAt`), a size smaller there so it fits.

### Wiring
- Today the pantry skips sprites and uses props or drawn bowls (`Cook.Art.wordTex`, `js/cook/art.js`). Add a `shelf` state to `art.sprites.items` for every word above and have `wordTex` use it when `scene.viewName === "pantry"`. The old `-f` files (`jar-atto-f`, `jug-dudh-f`, `tin-chai-f`, `veg-*-whole-f` …) retire once nothing reads them.
- New ids are added to `data/cook.json`'s `words` only when a round first uses them (Kutchi from the family; English placeholder until then).

### The background and the slots
- Serve `pantry-v2-bg.png` at full quality: trim the top and bottom 8% to 16:9, upscale to 1600×900 and, if still soft on a laptop at 2×, keep a 3200×1800 version (`docs/feedback/cook-ui-feedback-2026-09-28.md` §4).
- Measure the real positions from the delivered picture (shelf-board tops, bay centres, fridge shelves, tray), in the game's 1600×900 world, and replace `rows`/`xs` in `js/cook/mechanics/fetch.js` with a `slots` list in `data/cook.json` (`mechanics.fetch.slots`), each `{x, y, h, zone}`. Expected shape:
  - **shelves:** 3 unbroken shelves × 5 evenly spaced positions = 15 slots, `zone: "shelf"`, the item's base on the board;
  - **fridge:** 4 levels × 2 = 8 slots, `zone: "fridge"`.
- **The accepted background (P0 v2, 28 Sept), first measurements** at 1536×1024, before trimming: shelf-board tops at about y 210, 398 and 588, x 22–1167; about 150 px clear above each of the lower two boards and about 130 px above the top one once the top 8% is trimmed, so tall jars are scaled to about 150 px there (spice jars suit the top board); fridge x about 1240–1500 with four levels (three glass shelves at about y 370, 525 and 680, plus the floor at about 800), so 4 × 2 = 8 fridge slots, not 6; tray on the counter at about x 395–1140, y 800–870, room for six in a row; the empty wall between the bottom shelf and the counter is where the items on the tray stand up into. Measure exactly from the file. The fridge sits outside today's pantry `footprint` (x 220–1380 in `fetch.js`): widen it to take in the fridge (the zone scales the footprint to fit, so narrow screens just zoom out a little).
- **What goes where:** the fridge holds milk, yoghurt, meat, mince, chicken, fish, butter, cheese, cream, eggs and juice; everything else goes on the shelves (crates on the bottom shelf where possible, spice jars on the top). A fridge item is never placed on a shelf, or the other way round; decoys follow the same rule. If a round needs more fridge slots than there are, it takes fewer fridge decoys.

### The tray
- The basket goes. The tray is painted into the background; the game measures its top surface and draws **one outlined space per item needed** (3 at level 1, up to 6), in one row along the tray, spaced evenly and centred (the tray is seen almost edge on, so there's no room for a second row).
- Each space is a soft rounded outline in the shape of the needed item's container type (a tall-jar space is tall, a crate space is wide), drawn at tray scale (about 0.6 of shelf size), with no picture inside: you can see how many things are still missing, but not which.
- A tapped item flies into the next free space and sits on its outline's base line. Mid-round, spaces only fill (UX §11); a wrong item still takes a space and only shows as wrong in the end review.
- Before calling it done: screenshots at 390×844 and 1366×768 of an empty tray, a half-full tray and a full tray, looked at on the cream background (`docs/archive/process/VISUAL-QA.md` §1).

The metal results tick (the old R5 prompt that sat at the bottom of this file) moved to `docs/archive/art-prompts/chatgpt-art-prompts-results-badges.md`.


---

## 10. Alive Nani: the prompt method that keeps drift low

> from: docs/archive/art/alive-nani-test-2026-09-23.md LEARNING sections on ChatGPT QA tuning and the low-drift prompt template

## LEARNING — ChatGPT output needs different QA tuning than a true in-place edit

Gemini's image-edit API edits pixels in place; ChatGPT's image tool
**regenerates the whole image** conditioned on the reference, even when told
to change only one thing. Visually near-identical, but every line-art edge
shifts by a pixel or two — the raw diff-vs-base is noisy everywhere, not
just at the face.

Two QA changes in `build/expressions.py` (`qa_checks`) to tell real redrawn
content apart from this jitter, both documented inline:
1. **7×7 morphological open** on the "outside allowed region" diff mask
   before counting leak fraction — strips isolated antialiasing noise,
   keeps contiguous redrawn blobs.
2. **Leak check scoped to `LEAK_CHECK_BAND_FRAC` (45%) of the image height**
   — matches the band ECC registration (`REGISTRATION_BAND_FRAC`, top 40%)
   actually fits against. Drift near the hem/silhouette from an
   independently-cropped source image is neither trustworthy to measure nor
   relevant: the composite mask never reaches that low, so it can't leak
   into the final frame regardless.

Without these two, all 5 ChatGPT frames failed QA even though they were
visually clean — the check was catching rendering noise, not defects.
**No threshold was loosened to force a pass** — the change is about what
counts as "leaked", not how much leak is tolerated (`LEAK_MAX_FRAC` is
still 1.5%, unchanged).

## LEARNING — ChatGPT prompt template that keeps drift low

(Full prompts in `docs/archive/lab-PROMPTS.md`.) What mattered:
- **Attach the original base file fresh to every prompt.** Never chain off
  a previous ChatGPT output — drift compounds fast across turns.
- **One new chat message per frame.** Continuing in the same thread lets
  earlier edits bleed into the next one.
- Heavy repetition of "identical" / "change nothing else" / list every
  preserved feature by name (glasses, headscarf, clothes, colours,
  lighting, line style, framing) — ChatGPT's edit mode has no true mask,
  so it needs the constraint spelled out, not implied.
- Aspect ratio and crop tightness still varied noticeably between outputs
  (327:700 base vs. outputs ranging ~0.44–0.58 aspect) even with identical
  prompts — expect this, don't try to prevent it. ECC affine registration
  (6 DOF, handles independent x/y scale) absorbs it.


---

## 11. Character animation research

> from: docs/feedback/playtest-2026-09-23.md §4 Character animation: options, and what's realistic

## 4. Character animation: options, and what's realistic

### 4.1 How characters built from separate parts work
Instead of one flat picture per pose, the character is split into separate pieces: body, head, eyes (open and closed), a few mouth shapes, eyebrows, each arm, hair, scarf.

The pieces are pinned together at joints: the neck, shoulders, elbows. The game then moves the pieces in real time:
- The head tilts.
- The chest rises for breathing.
- The eyes swap to closed for a blink.
- The mouth cycles through shapes while audio plays.
- An arm rotates to gesture.

Better tools also bend pieces smoothly (a scarf that sways, a cheek that squashes).

Common tools:
- **Spine:** the industry standard, with an official Phaser plugin. Paid, about $70 one-off for the basic edition.
- **Live2D Cubism:** made for exactly our framing (waist-up, talking, blinking, breathing). Free for small independent projects, and it has a web version.
- **Rive:** browser-based, has a free tier and good web playback.
- **DragonBones:** free but largely abandoned.

**Upside:** it looks alive and smooth. You get endless combinations (happy while talking, blinking while pointing) from one set of parts. It's also small to download.

**Catch:** the art must be drawn in layers. When you cut an arm out of a flat picture, **nothing exists behind the arm**. Someone (an artist or an AI fill tool) has to paint in the hidden body, the hidden side of the neck, and the inside of the mouth. Then someone has to set up the joints and movements. Realistically that's **several hours to a few days per character by hand**, or roughly £80–£400+ commissioned per character on sites like VGen or Fiverr.

### 4.2 Is there a free, easy, Claude-integrated tool that takes one picture, cuts it up, rigs it and makes poses by itself?
**Not a reliable one, as of late 2026 (worth re-checking every few months, because this area moves fast).** The pieces exist separately:

| Step | Tools that exist | Reliability for our art |
|---|---|---|
| Cut the picture into parts automatically | Segment Anything (SAM), background removers (rembg), newer AI layer-splitting research models | Cutting out is good. **Filling in what was hidden behind each part is hit and miss.** Scarves, embroidery and hands cause the most trouble. |
| Automatically find joints and set up movement | Meta "Animated Drawings" (free, open source) | Built for full-body, front-facing children's drawings. **Poor fit** for waist-up characters in flowing clothes. It also outputs videos, not game-ready characters. |
| Animate a face from one still picture (blink, talk, nod, small head turns) | **LivePortrait** (free, open source), SadTalker, and paid services like Hedra | **Good.** It moves the *original* picture's pixels instead of redrawing it, so the character stays exactly the same person. It works reasonably on illustrated art. It only does the face and head, not arms. It needs a graphics card, but free online ones exist (Google Colab, Hugging Face Spaces). |
| Turn one picture into a short video (idle loop) | Kling, Runway, Veo and others | Looks nice, but the character's face and clothes slowly change, the background isn't transparent, and it's hard to line up with game events. Not good for a controllable game character. |

**How Claude fits in:** Claude can't create or edit pictures itself, and this Claude Code cloud container has no graphics card. What Claude *can* do well is write and run the pipeline scripts (cut out, line up, clean backgrounds, build sprite sheets, write the Phaser animation code), and look at the results to check them. So it's "Claude runs the pipeline", not "a single Claude button".

### 4.3 Why regenerating the same character in ChatGPT for each pose isn't ideal
Every time an AI image tool redraws a character, small things change: face shape, glasses, embroidery pattern, scarf folds, skin tone, where the body sits in the frame.

Swap between those images in a game and the character **flickers and jumps**. That's partly why the current three poses feel like a slideshow.

It works for *rare, big* changes (a very happy pose shown once). It doesn't work for things that happen every second, like blinking and talking, where tiny differences are very noticeable.

### 4.4 Recommendation: a staged approach

**Stage A: "one body, swappable face" [MVP, reliable, nearly free]**
- Keep **one** body image per character that never changes, so the character's identity is locked.
- Cut out small patches just for the **eyes** (open, closed) and the **mouth** (closed, half open, wide/"oo"). Make them by editing the *same* image, either with an AI "edit only this area" tool using the neutral picture as the base, or by hand touch-ups. Never redraw from scratch.
- Put the head on as a separate piece only if the neck area is easy to fill in. Otherwise keep the head fixed.
- The code adds the life:
  - A blink every 2–6 seconds, at random, lasting about 100ms.
  - The mouth cycles between shapes about every 110ms while audio plays.
  - Constant gentle breathing: about 1% taller over roughly 3 seconds, anchored at the waist.
  - A small tilt (under half a degree) while talking.
- Big emotions (happy, concerned, pointing) can still be whole separate images, **but every image must be exported on the identical canvas size and position** so swaps don't jump.
- Because characters now stand **behind counters**, we don't need legs and rarely need arms. That's exactly why this simple approach is enough.
- **About 7–8 images per character** is plenty:
  1. Neutral
  2. Blink
  3. Mouth half open
  4. Mouth wide / "oo"
  5. Happy
  6. Gesture (offering or pointing)
  7. Concerned ("arre re")
  8. Optionally, listening or thinking

**Painted-on blinks: tried and rejected (23 Sept 2026).** Claude painted eyelids over the existing eyes by filling them from the surrounding skin. It looked bad, so we are not doing it. Decision instead:
- **Closed eyes:** have ChatGPT make an eyes-closed version of each character, in the same style, canvas size and position.
- **Mouth shapes and other small movements:** LivePortrait (below).
- **What does work from existing art:** swapping in *only the mouth* from the existing talking pose, lined up to the neutral pose with a soft edge. The body stays identical, so flapping between the two frames moves just the mouth. This is what the game uses now (`build/make_scene_art.py`).

**Stage B: LivePortrait for face frames [MVP, you are exploring this]**
- **Is it the best free, easy option? Yes, as of late 2026.** Use the free Hugging Face Space (search "LivePortrait"; nothing to install) or the official GitHub project (KwaiVGI/LivePortrait) in Google Colab. The alternatives are worse for this job: SadTalker is older with lower quality, and Hedra is easier but paid or limited, and it redraws the face.
- **Use its image-editing / "retargeting" sliders rather than a driving video.** They change one still directly: eyes open or closed (blink), lips open, the mouth shapes "aaa" / "eee" / "woo", smile, and small head turns. Upload the neutral image, move one slider, save the frame. Repeat for each frame you need.
- **Keep "paste back" on**, so you get the full character back and not just a cropped face.
- The output loses the transparent background. That's fine: send the frames back and Claude re-applies the original cut-out mask (the body doesn't move, so the mask still fits) and lines them up on the same canvas.
- Frames worth making per character: eyes closed; mouth "aaa", "eee" and "woo"; a smile; a small nod down.
- Claude then wires them in: a blink every 2–6 seconds, and the mouth shapes chosen at random while a line plays.

**Stage C: full characters built from parts [LATER, when there are more characters or emotions]**
- Commission, or draw with AI help, **layered character art** with hidden areas filled in, then rig it in **Live2D** (best for waist-up talking characters) or **Spine** (best Phaser support).
- Worth it once the cast and emotions grow. Not worth it for a two-character proof of concept.

**Brief for any future character art (a rule from now on):** export every pose on the same canvas size, with the character in the same position. Supply eyes and mouth as separate layers where possible. Keep the character's hands away from the face and body where possible, which makes cut-out parts much easier.

---


---

## 12. Older prompt templates (A, B, C)

> from: docs/archive/superseded/Image Prompt Sheets.md How to use this doc, and the three templates

## How to use this doc

1. Copy a prompt into ChatGPT (Pro gets the best results).
2. Save the first image you're happy with — this is the Nani prompt below, which has nothing to attach yet. Every prompt after that already ends with the line "Create a new image, matching the style of the attached image exactly," so just attach the saved image when ChatGPT asks and paste the prompt as-is. This is what keeps forty images looking like one game instead of forty different ones.
3. If a grid comes back with items blurring together or the wrong count, regenerate the whole sheet rather than trying to fix one cell. Sixteen items is close to the limit these models handle reliably; more than that and quality drops fast.
4. Send the finished images back here and they get cut into individual game-ready files.

**Images never carry a Kutchi word or any text**, so nothing below waits on the content master being reviewed. What matters for an image is only what the English item is, not how it's said. Generate freely from the lists in this doc; the Kutchi words get matched to pictures later, separately, once your mother and aunt have been through the word list.

## Three templates

Every sheet below is one of these three. All the V1 sheets further down are already filled in and ready to paste — these templates are here only as the pattern for the later sheets, which still need their bracketed parts filled in. All are Muslim Kutchi in setting: headscarves and dupattas rather than sari and bindi, no tilak or temple imagery, a halal butcher where relevant, no religious symbols unless asked for.

**Template A — item grid** (fruit, vegetables, spices, and later sheets)

> A 4 by 4 grid of sixteen separate [CATEGORY] illustrations on a plain flat magenta background, hex FF00FF. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. Each item centred in its own cell with clear space around it, viewed straight on, no cell borders, no text or labels anywhere. In order, left to right, top to bottom: [ITEM LIST]. Create a new image, matching the style of the attached image exactly.

**Template B — character sheet** (Nani, the shopkeeper, and later family members)

> Three views of the same character in a row, side by side, on a plain flat magenta background, hex FF00FF, with clear space between each of the three poses so the magenta background separates all three. [CHARACTER DESCRIPTION]. Upper body, facing the viewer, identical pose and framing in all three. Left: mouth closed, neutral friendly expression. Centre: mouth open as if speaking. Right: smiling broadly with both hands raised in celebration. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. No text. Create a new image, matching the style of the attached image exactly.

**Template C — background with a gap** (any room or stall a character stands in) — **superseded by layout contract v2 in the Roadmap doc and the prompts in Chapter 1 Art Prompts. Kept here for the pattern only; use the newer prompts for any Chapter 1 scene.**

> [LOCATION DESCRIPTION], seen from the visitor's side. [SPECIFIC DETAILS]. A clear horizontal surface runs across the scene at roughly two thirds of the image height, with several empty wooden crates and empty woven baskets spaced evenly along its middle section, and a plain uncluttered face below it. The left quarter of the image is calm and uncluttered, plain wall and floor, no busy detail there. Nothing in the central area duplicates a market item. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. No people, no text or writing of any kind. 16:9 landscape, with the right third left open and uncluttered where a character would stand. Create a new image, matching the style of the attached image exactly.


---

## 13. The style-lock test

> from: docs/archive/art/art-direction-options.md §5.2 Once a direction is chosen: the style-lock test

### 5.2 Once a direction is chosen: the style-lock test

Before regenerating everything, make **one complete scene** in the chosen style:
- the kitchen background (with the counter drawn in, and empty shelves with clear surfaces);
- Nani (neutral pose, upper body, transparent background);
- six fruit (transparent, one per image);
- the basket and the bowl (each as back and front layers);

then drop them into the game and playtest. Only if it holds up in motion, on a phone, move on to the rest.

---

> from: docs/archive/art/art-direction-options.md §10 Chosen direction: stylised 3D film look (23 Sept 2026). Is it workable? › The ChatGPT stress test (what the test should cover)

### The ChatGPT stress test (what the test should cover)

1. **Canonical Nani:** 1 neutral image, then 5 edits (eyes closed, mouth open, smile, pointing *above* the counter, worried). Does she stay the same person?
2. **Twelve ingredients** in one style, each on a flat magenta ground (grey for metal and glass), keyed out later, the same scale and lighting.
3. **Ingredient states:** an onion raw, then halved, then chopped (edits of the same image).
4. **The empty kitchen background** at 16:9: no Nani, no props on the tappable surfaces, with room behind the island.
5. **Layers:** the pantry tray, the brass bowl back and front (cut from a flat ground).
6. **A second character** (the shopkeeper) in the same style, next to Nani, so they look like one family of designs.

If 1–3 hold up, the style is safe to commit to.

---

## 14. Background art brief (every new background)

> from: docs/archive/design-v1/Roadmap and Story Structure.md § Layout contract v2 › Background art brief (every new background)

### Background art brief (every new background)

- A counter, island or bolster running across the scene, with room behind it for the character. No leftover floor objects (rugs, crates) where it goes or in the foreground.
- A slightly high camera looking down onto the work surface, so items and containers read clearly.
- Clear, flat, evenly lit surfaces where tappable items go. **No painted food anywhere near a tappable zone.**
- The sidebar has its own column (left, about 22%, F4) and the stage fills the screen with no letterbox (F18), so keep the far edges uncluttered for any screen shape; the rest of the layout contract is in `ui-design-system.md`.
- Same camera height and painterly lighting in every scene, 16:9, no text.
- Supply separately, cut from a flat ground, in the same style: carried container, destination container, counter front layer, swaying items.

---

## 15. Art tools and the fast runner (T2, decisions 43 and 44)

Anything done the same way twice is a script the model runs. All four tools live in `build/tools/art/`, print short summaries (never dumps), can be re-run and answer `--help`. The old `build/cut_*.py` scripts stay as they are; the cutter reproduces one of them and replaces them for new packs.

| Tool | Command | What it saves | Proof (5 Oct) |
|---|---|---|---|
| **Cutter** `artcut.py` | `python3 build/tools/art/artcut.py build/tools/art/specs/<pack>.cut.json [--out DIR] [--only ID,..] [--list] [-v]` | webp + `@2x` per piece, a data JSON (`cut-data.json`: canvases, feet lines, anchors, exits, boxes) and `cut-report.txt`; skips what hasn't landed and lists it; flags (REDO, ΔE) print even in the short summary | Re-cut the clinic pack's girl wide poses (26 files), the child and girl close-ups with their registered states, and the O1/O3 prop sheets, against `cut_clinic_heal_v3.py` run into a temp folder and against the committed `assets/clinic/`: **0.000 % of pixels differ, max 0**, via `artdiff.py` |
| **Diff** `artdiff.py` | `python3 build/tools/art/artdiff.py REF_DIR NEW_DIR [--glob ..]` | nothing; one line per file (alpha-weighted pixel diff) | the proof above |
| **Judge** `artjudge.py` | `python3 build/tools/art/artjudge.py [--only girl-M1,..] [--dir D] [--json F] [-v]` | PASS / FLAG / FAIL per image with the reason; optional JSON | the 67 images of `sources/art/clinic-heal-v3/`: flags U1, M1, M2, Y1-Y3 (framing), W10 (feet and scale), O2 (round glossy discs), T1/K1/P1 (skin ΔE 7-9), boy E1 and M1; sheets and the rest pass |
| **Block generator** `artblock.py` | `python3 build/tools/art/artblock.py [--check] [--redo LIST.yaml] [--stdout] [--sync-doc]` | the paste block in `docs/design-language/art-plans/<pack>-chrome-block.txt` (or `-redo-block.txt`) | regenerated the clinic block (115 lines): run-order differences are wording only (one explicit template line per prompt in part C; a "part done" line after part A); the runner section is new |

### 15.1 The cut spec (JSON or YAML, one per pack)
`pack`, `src`, `out`, `data`, `skin_render` (the approved render's lit skin, ΔE limits 6 and 12), `failed` (source → reason, not cut) and `jobs`. A job has an `id` and a `type`; `"each": [{"kind": "girl", "p": "girl"}]` repeats it with `<kind>` and `<p>` replaced, so a new person is one more row.
- `closeup`: `src`, `exits` (the edges the limb or head leaves by, kept flush), `out`, `states` (other pictures, each `register: {mode, band}`: ECC onto the base, keyed on its canvas), `mirror` (a recorded gaze fix).
- `grid`: a prop sheet cut by its gutters in reading order: `names` (null skips), `rows`, `glass` (partial alpha, never a solid core), `failed`, `registered: [{names, align}]` (one canvas per object), `pad` (16), `max` (512).
- `figure`: the base pose; `poses` (whole figures registered on a band, fitted by scale if they drift), `faces` (head-only edits kept as layers, with their leak % against the head), `fig_h` (the drawn height at 1x, which sets the 1x size; the `@2x` never exceeds the source), `neck`, `anchors` (source px → canvas fractions), 512 px corner heads, an optional `side` pose with its own faces.
Not in the cutter (stay in `cut_clinic_heal_v3.py` until a pack needs them): SIFT room registration and the diff overlay (R3, R4) and the gauge and chart measures (R5, C1, C2). Add them as job types when needed.

### 15.2 The run spec and the paste block
`specs/<pack>.run.yaml` is the run as data: `people` (prefix → sheet and limb set; the slot texts come from the plan's PEOPLE table), `templates` and `limb_templates` (attach, save-as, check per prompt ID; `kept:X`, `edit: kept:X`, a trailing `?` for optional), `lines` (the one-offs), `parts` (the order; `compact` prints per-person templates once), `checks` (the words in the block, plus what the judge measures), `passfail` and the `runner` knobs. `artblock.py` validates it against the plan first (every prompt exists, every dependency exists, no duplicate save-as, every reference file is in the repo), then fills `templates/block.txt` and `templates/runner-loop.txt`. **A new pack's block is generated, never hand-written:** write the plan, copy the spec, run `--check`, run the tool.

**The art redo list** (`art-plans/<pack>-redo-list.yaml`) is the input for a run that fixes earlier work: `redo` (a line ID, why it failed, its source), `new` (lines with no prompt yet; they run only when the plan has the prompt and a check, else they are listed NOT READY), `checks` for the new lines, `considered` (looked at and left out). `artblock.py --redo` builds a block of just those lines plus the edits that follow a redone picture, saved as `-v2` beside the old `-v1`, each ending in REDO: what was wrong. The clinic's list holds U1, M1, M2, Y1 (and so Y2, Y3), T1 gaze, W10 scale, O2 spots, and the girl's standing pose for the send-off (NOT READY: needs a W11 prompt in the plan).

### 15.3 The fast runner (decision 43)
The rule: **no ChatGPT window ever sits idle.** Keep N windows generating; the moment one finishes, judge it and send the edit or the next prompt at once; commits, reference fetches and logging happen only while every window is generating; stalls are detected, retried once and then skipped. A kept image is attached from the runner's workspace copy, so an edit never waits for its original's GitHub commit; commits are batched. Parts are priorities, not walls. The knobs are in the run spec (`runner:`; clinic: 3 windows, 60 s between sends, stall 6 min, hard 10 min, 2 redos, commits of 6 or after 25 min). The loop below is `templates/runner-loop.txt`, copied here by `artblock.py --sync-doc` (edit the template, not this copy); `N`, `G`, `X`, `Y`, `B`, `F` stand for the knobs.

<!-- runner-loop:start -->
```
THE RUNNER LOOP (decision 43). This is why the run is fast: read it twice.
A window is one ChatGPT chat in its own browser tab. Keep N windows generating at all times. A window must never sit with a finished picture and no next prompt. Anything that is not scanning, judging or sending (committing to GitHub, fetching references, posting the log) happens only while every window is generating.

YOUR NOTES (update after every action). One line per prompt with its state: WAITING (a dependency isn't kept yet) · READY · GENERATING (tab, time sent) · KEPT (saved in your workspace, not yet committed) · COMMITTED · SKIPPED or STALLED (why). Two queues: READY (redos at the front, then run order) and SAVE (kept, not yet committed).

THE TICK. Repeat until every line is COMMITTED or SKIPPED:
1. SCAN. Look at every generating tab (a screenshot or its page text, never the chat history). Note which are finished, still generating, stalled or errored.
2. HARVEST each finished tab, first finished first. Judge it now, in one look at the full image against its check and the PASS/FAIL LIST (no waiting, no second opinions):
   PASS: mark it KEPT; every WAITING prompt that needed it becomes READY now. Refill the freed slot at once (step 3). If the prompt you start needs this very picture, fetch and save it first (move 2, steps a and b only, into your workspace under its save-as name) and attach that local copy, never waiting for the GitHub commit; otherwise send first, then fetch and save it while the new prompt generates, and add it to SAVE.
   FAIL with redos left: put the same prompt back at the front of READY, to run in a fresh chat with the same attachments; note what failed.
   FAIL with no redos left: keep the best of the tries, note what is wrong, and treat it as a pass for the queue.
3. FILL. While fewer than N windows are generating and a prompt is READY, START the first READY prompt in the free tab: new chat, attach the local copies (screenshot the composer: exactly that many thumbnails), paste the prompt with its slots filled, send. Leave G seconds between sends, and spend that gap on one chore from step 4, not on waiting. Order of READY: redos first; then the prompt that unblocks the most WAITING ones (a sheet, a W1, a K1, a Y1, a C1, a D1); then the next in the run order. The parts are priorities, not walls: a free window takes any READY prompt, even from a later part.
4. HOUSEKEEP, only when every window is generating, one chore at a time, then straight back to step 1: (a) commit SAVE (all queued files in one upload) when B files are queued, or the oldest has waited F minutes, or a part has just ended; (b) fetch the references the next READY prompts need; (c) post the progress line and log. No chore may start while a tab is finished and unharvested, and none may take more than about two minutes.
At the start, fetch only what the first prompts need, send them, and fetch everything else during the gaps.

STALLS. A tab is stalled when its screen shows no change (no progress text, no image) for X minutes, or it shows an error ("Something went wrong", a network error, an empty reply).
- First, reload that chat once: the picture is often finished and the page is stuck.
- Still nothing Y minutes after the send: abandon that chat and run the same prompt (same attachments) in a fresh chat, once. This retry does not use up a redo.
- That retry stalls too: SKIP the prompt. Log "STALLED: <id> | <time>", log every prompt that waited for it as "SKIPPED: waits for <id>", free the slot and carry on.
- Never leave a stalled tab holding a slot while others are idle.
```
<!-- runner-loop:end -->

**Judging at speed.** The runner judges in one look. If its workspace has the repo and python, `artjudge.py --dir <saved images> --only <ID>` gives numbers first (a FAIL is a redo; a FLAG says where to look). Claude's stricter pass (plan section 7) still happens after upload, from contact sheets, and `artjudge.py` over the whole folder is its first step. The judge never measures gaze, anatomy, fingers, likeness or style; text is only found on the flat ground, not on an object.
