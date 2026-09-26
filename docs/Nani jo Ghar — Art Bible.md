# Nani jo Ghar: art bible

**Started:** 24 Sept 2026. **Status:** v1, the single source of truth for every image prompt and every art review. It will be amended as the Cook with Nani stations settle; parts marked **(provisional)** are expected to change.

**Where the decisions came from:** `docs/art-direction-options.md` (section 10, the chosen 3D-film look), `docs/cook-with-nani-phase-a-design.md` (section 2, what went wrong and the agreed fixes), `docs/Nani jo Ghar — Asset Building Plan.md` (hands, cats, ambient motion, real-life likeness), `docs/game-modes-v2.md` (the eight modes), `docs/Nani jo Ghar — Asset Naming Convention.md` (file names, slicing).

**Supersedes:** the style line "children's storybook illustration style, soft cel shading, thick soft outlines" in `docs/Nani jo Ghar — Chapter 1 Art Prompts.md`. Those prompts keep their layout rules (empty tappable surfaces, a counter to stand behind, no text), but their style line is retired.

---

## 1. Style

**In one paragraph:** a stylised 3D animated-feature look, the kind of frame you'd see in a modern family film. Soft global illumination and warm sunlight; believable materials (marble with warm veins, brushed steel, polished brass, pale oak, cotton and linen, glossy tomato skin, matte flour); no outlines. Shapes are simplified and slightly chunky, with clean surfaces and restrained micro-detail, so every item reads at 90 px on a phone. Faces are stylised, not realistic: big expressive eyes, soft rounded forms, simple readable mouths, a small nose, smooth skin with rosy cheeks. The home is a **modern kitchen with Kutch accents** (limewash, marble, sage cabinets, brass, mirror-work, ajrakh); the bazaar may be more traditional. Modern throughout, culture as a hint; the language is the main cultural thing.

**Set dressing: restraint (decided with the family, 24 Sept 2026).** Zafar's wife: "don't do too much, it will look old again." The game is modern-looking with hints and nods to East Africa and Kutch, never a caricature of either. **At most 1–2 cultural nods per scene**, rotated between scenes and visits rather than all shown at once, and introduced gradually as the game goes on. Never clutter. Full object list: `docs/Nani jo Ghar — Asset Building Plan.md`, section 6.

### Canonical style references

Attach these (never the old storybook art) when a prompt needs a style reference.

| Path | Use it for | Don't use it for |
|---|---|---|
| `assets/cook/bg/service.jpg` | Setting, palette, light direction, material finish of the home | Camera for cooking stations (it's the eye-level island view) |
| `sources/cook/nani-sheet.webp` | Character rendering: face stylisation, eyes, skin, fabric, embroidery detail | Nani's identity (to be replaced by the sheet made from Mum's photos) |
| `sources/cook/customers-sheet.webp` | Family consistency: the same render style across ages and genders | Final designs of Nana, Ma or Ali (placeholders) |
| `sources/cook/props-sheet.webp` | Item materials and level of detail (steel, brass, glass, dough, chopped veg) | **Camera.** Its ¾ view is exactly the mismatch that broke the proof of concept |

**Anti-references (never attach for style):** everything in `assets/backgrounds/` and `assets/characters/` (the old cel-shaded storybook look), and `docs/cook-screens/03-pantry.jpg` and `08-tawa.jpg` as examples of the camera and scale faults listed in section 10.

### Do

- Soft, warm key light from one direction (section 2) with a gentle fill; soft contact shadows.
- Materials with real, gentle specular: brass glints, steel reflects warm light, marble has a faint sheen.
- Chunky, rounded silhouettes; slightly thickened thin parts (knife blades, chilli stems, spoon handles) so they survive at small sizes.
- Clean, simplified textures: marble veins, wood grain and embroidery are present but quiet.
- Faces: large eyes with a clear highlight, soft brows, simple mouth shapes that read as an emotion at thumbnail size.
- Kutch accents as objects and patterns: mirror-work frames, ajrakh cushions and curtains, bandhani dots, brass pots, embroidered cuffs.

### Don't

- No outlines, cel shading, flat vector fills or painterly brushwork.
- No photorealism: no pores, no photographic food, no real-person likeness beyond what survives stylising.
- No glossy clip-art shine spots, heavy gradients or plastic toy sheen.
- No depth-of-field blur, motion blur, vignettes, lens flare or bloom on sprites.
- No text, letters, numbers, logos or watermarks anywhere, including on packaging, bunting and tins.
- No clutter on or near any tappable surface.

---

## 2. Palette and light

### Key colours (approximate, sampled from the references)

| Role | Colour | Approx. hex | Where |
|---|---|---|---|
| Kutch red (madder) | Embroidery and dupatta red | `#B72424` | Nani's dupatta and embroidery, mirror-work frames, the boy cuff's embroidery |
| Deep maroon | Ma's kurta | `#7F1D31` | Clothing accents |
| Marigold | Warm yellow-orange | `#E8A33A` | Turmeric, daal, celebrations (petals), highlights |
| Indigo | Ajrakh blue | `#2E3A6E` | Ajrakh prints, spice cupboard back, calm UI accents |
| Limewash cream | Walls (lit) | `#EFE3D3` | Home walls; `#D3B196` in shade |
| Marble | Warm white | `#FAE5D4` | Worktops, island top |
| Sage | Cabinet green | `#9CA78A` | Cabinets, doors |
| Pale oak | Shelves, island front | `#D1874D` / `#C38355` | Wood |
| Brass | Warm gold | `#CB9847` | Pots, knobs, handles, lanterns, Nani's rings |
| Steel | Neutral with warm reflections | `#B9B4AC` | Pans, thali, katori, dabbas |
| Terracotta | Earth | `#B8643E` | Bazaar, clay pots, plants |
| Green (secondary) | Ma's dupatta, leaves | `#3F7A4A` | Clothing, herbs, plants |
| Hands (skin) | One tone, Zafar's own: a warm light tan, **not orange, not saturated** (sampled from his photos, 24 Sept 2026) | Midtone `#C49A78`, highlights `#D8B894`, shadows `#A07A60` (daylight face sample `#BE826B`) | Every hand sprite (section 7); no variants for now. The generator drifts orange (round 3 came out `#D3833E`–`#DE9351`), so check the sampled hex and colour-correct in post if needed |

**Rules:**
- **Reds belong to Nani.** Keep large red areas out of the backgrounds behind her head (curtains, frames), so she always pops.
- **Tappable items get the most saturation in the frame.** Backgrounds are lighter and calmer than what sits on them.
- **One accent pattern per surface.** A tiled splashback or an ajrakh cushion, not both in the same small area.

### Light

Four lighting states, planned now rather than left for later, since Arc 1 needs evening and night (the guests coming tonight, the Eid evening party) and Arc 3 needs a storm sky.

| Lighting state | Key light | Fill / shadows | Used for |
|---|---|---|---|
| **Day** | Late-morning sun, upper left, warm | Soft shadows down and to the right; long window-shaped light patches on walls away from tap areas | Ordinary cook-along, pantry, hub, bazaar scenes |
| **Golden evening** | Low warm sun, upper left, longer and more orange | Longer soft shadows, lower right; warm rim light on edges facing the window | Arc 1: guests coming tonight, the fruit-bowl and dastarkhwan errands as dusk falls |
| **Night** | Lamp and lantern light: warm pools around each lamp, hanging lantern or overhead bulb | Cool blue fill from the windows outside the warm pools; shadows soft and short, radiating from each lamp rather than one direction | Arc 1: the Eid evening party once guests arrive, Nani hanging the lantern; Arc 3: evening lamps in Nani's day |
| **Storm** | Flat grey daylight through cloud, no strong direction; an occasional cool lightning rim on a dramatic beat | Very soft, low-contrast shadows; cooler overall palette | Arc 3: the monsoon storm sky |

**Rule: a scene's backgrounds come in every lighting state it uses.** Same camera, same layers (section 5), so a background painted for day and reused at night is a straight relight, not a redraw: the worktop, shelves and occluders stay in the same place, only the light, shadows and any lamps/lanterns change. A scene that only ever plays in daylight needs only the day background.

**Shadow rules:**
- **One light direction per scene.** Every sprite's highlights and shadows agree with its background.
- **Everything resting on a surface has a contact shadow** where it touches: a tight dark core plus a soft falloff towards the lower right.
- **Nothing floats.** An item without a contact shadow is a reject.
- **Sprites carry no cast shadow of their own** unless they come from an edit-in-place cut (section 5), where the shadow is kept as a separate layer. Otherwise code draws the contact shadow (a soft multiply ellipse, offset down-right).

---

## 3. Cameras

**The rule:** one camera per scene. Every sprite placed in a scene is drawn in that scene's camera. An item gets a view only if a scene that uses it has that camera (section 8).

### Views used

| Code | View | Horizon and perspective |
|---|---|---|
| **T** | Top-down, straight down (90°) | No horizon, no back wall or splashback in frame. Near-orthographic: rims read as circles, not ovals. Only a faint perspective so pot and bowl inner walls show |
| **E** | Eye level, front | Horizon at about 50–60% of frame height. One-point perspective, verticals stay vertical, shelf and counter edges horizontal |
| **F** | Item front view (for shelves and stalls) | Camera at the item's mid-height, looking about 10° down, so the item's top is just visible (a hint of the rim, the heap in a bowl) |

### Per scene type

| Scene | Camera | Horizon / framing rule | Sprites in this camera |
|---|---|---|---|
| **Cooking stations** (board, hob, tawa, fry, grill, assemble) **(provisional)** | T | Worktop fills the frame edge to edge; the station object (board, hob, tray) centred; bottom 20% kept clear for hands entering from the bottom edge | Ingredients in every cooking state, pans, pots, tools, hands (T set), liquid discs, flame rings |
| **Chop (ninja)** **(provisional)** | T, or E against the splashback | Decide in the station review. If T, thrown items scale up towards the camera; if E, they arc against a plain wall | Whole and sliced vegetables in that one view |
| **Island (family, greetings, serving)** | E | Island top edge nearly horizontal at 65–70% of frame height; characters behind it, cut at the waist; heads over plain wall | Characters (upper body), cats on the floor or sill, serving dishes in F view, hands (E set) |
| **Pantry shelves** | E, straight on to the cupboard | Shelf tops just visible (a few pixels of top surface) so items can stand on them; no shelf at the very top edge | Items in F view, containers (jars, tins, jugs) in F view |
| **Hub (Nani's kitchen, wide)** | E | Same as the island, wider; the island front is the occluder and the quilt's surface | Characters, cats, Eid dressing, ambient motion layers |
| **Bazaar (Find it)** | E | Customer's side, horizon at about 55%; one long counter or display row; a traditional stall is fine | Items in F view (shared with the pantry), shopkeepers, hands (E) |
| **Tidy up** | T for table and dastarkhwan; E for shelves | As cooking stations or the pantry | Tableware T, household items T or F |
| **Dress up** | E, full body, front | Character standing on a plain floor; horizon at hip height | Base body plus clothing layers, front view only |
| **Nani's clinic** | T for the table; E for the patient | Table top-down with the patient seen at the island framing | Remedies and instruments T; characters E |
| **Who did it?** | E | Suspects in a row behind a counter, sofa or bolster; cards as flat C3 hand holds | Characters and cats E; clue items F |
| **Monsoon rush** | E, side-on room cross-section | Horizon at mid-height; drips fall straight down | Buckets and items F; hands E |
| **Snap** | E, wide panorama (2–4 screens), parallax layers | Horizon constant across the whole panorama | Animals, people, places E |

**Current faults this fixes:** the stove background shows the tiled splashback (a ¾ view), props were drawn at about 30° from the side, and the pantry used top-down items on eye-level shelves. New cooking-station backgrounds are straight-down worktops.

---

## 4. Scale reference

**Unit:** the player's reference hand, a child's right hand, **13 cm** from wrist crease to middle fingertip. Nani's hand is 18 cm.

**How scale is kept:** each asset in the asset list carries a real size in cm (`size_cm`, longest visible dimension), and each scene records its own pixels per cm, measured from a known object in the background (the board, the hob, a shelf). Code scales sprites from these numbers. **(provisional, not yet in the code)**

| Item | Real size (cm) | × hand | Notes |
|---|---|---|---|
| Cumin / mustard seed | 0.3–0.5 | 0.03 | Never a sprite on its own: always a heap in a katori or a pinch |
| Cardamom pod (elchi) | 1.5 | 0.1 | Never a sprite on its own: a small heap in a katori |
| Garlic clove | 2.5 | 0.2 | |
| Dough ball (per maani) | 5 | 0.4 | |
| Garlic bulb | 6 | 0.45 | |
| Lemon | 6 | 0.45 | |
| Chai glass (cutting glass) | 6 wide, 9 tall | 0.7 | |
| Tomato | 7 | 0.55 | |
| Onion | 8 | 0.6 | |
| Potato | 8 | 0.6 | |
| Green chilli | 8 long | 0.6 | |
| Katori (small steel bowl) | 9 | 0.7 | Default spice container |
| Samosa | 9 per side | 0.7 | |
| Tea tin | 9 | 0.7 | |
| Tadka pan (vaghariyu) | 12 across | 0.9 | Plus handle |
| Masala dabba (spice box) | 20 across | 1.5 | Seven katoris inside |
| Milk jug | 10 wide, 18 tall | 1.4 | Pantry faults had it the same size as cardamom |
| Chapati / maani (rolled) | 18–20 | 1.5 | |
| Saucepan (chai) | 16 across, handle 18 | 1.2 + handle | |
| Daal pot | 22 across | 1.7 | |
| Chakla (rolling board) | 25 across | 1.9 | |
| Tawa | 26 across, plus handle | 2.0 | |
| Knife | 28 long | 2.1 | Tool sprite, sits in the B1 grip |
| Ladle / spatula | 30 long | 2.3 | |
| Mishkaki skewer | 30 long | 2.3 | |
| Thali | 30 across | 2.3 | |
| Rolling pin (velan) | 35 long | 2.7 | Thin and tapered, the Gujarati style |
| Two-burner hob | 60 × 50 | 4.6 | |
| Zazu (grey cat, 1) | about 38 long without tail | 3 | About 85% of Simba, leaner |
| Simba (black cat, 5) | about 45 long without tail, 25 at the shoulder | 3.5 | |
| Island top | 90 high | 7 | Nani (155 cm) shows from the waist up; Ali (tall and lanky for his age, about 130 cm) from the chest up |

**Readability rules:**
- **Minimum tap target: about 90 px** on the 1600×900 stage. Anything smaller than that at true scale comes in a container (katori, tin, jar) or is shown as a heap.
- **Readability boost:** small items may be drawn up to 1.5× true scale. **The order of sizes never inverts**: cardamom is never bigger than garlic, and garlic never bigger than the milk jug.
- **First-person hands are drawn at 1.2× the worktop scale** (they're nearer the camera). Every hand uses the same factor.

---

## 5. Layers and motion

**The rule (from the asset plan):** anything that moves, is tapped, changes state or can be covered is its own layer. Everything else is baked into the background.

| Baked into the background | Separate sprite |
|---|---|
| Walls, floor, window frame, worktop, cabinets, fixed shelves, fixed hob body, fixed decor | Every tappable item, every container that receives items, characters, cats, hands, tools |
| The station surface (board, chakla, hob) **only if it never moves** in that station | Hob knobs (they turn), flame rings, pans and pots |
| | Occluders cut from the background: the island front, a cushion, the stall counter front |
| | Ambient motion: curtain, fan blades, plants and leaf shadows, bunting flags, lanterns, clock hands, birds, steam wisps, dust motes |
| | Story dressing (Eid decorations) |

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

- **Transparent PNG from the generator**, stored as **WebP with alpha** in `assets/` (lossless for hands and anything with fine edges; quality about 90 otherwise).
- **Trim** to the item's own bounding box, then **pad 16 px** of transparency on every side.
- **Stored size:** the largest size the sprite appears on the 1600×900 stage, times 1.5 for sharp phones. Backgrounds are exactly 1600×900.
- **Backgrounds are 16:9.** If the generator can't output 16:9, ask for the nearest landscape size with the scene kept inside a central 16:9 band, then crop. Never stretch.
- **Naming:** as in `docs/Nani jo Ghar — Asset Naming Convention.md`, with the view and state as suffixes: `<item>-<view>-<state>`, e.g. `onion-t-chopped.webp`, `milk-jug-f.webp`, `hand-b1-t.webp`, `hand-b1-t-girl.webp`. **(provisional)**

### Transparent backgrounds vs the magenta sheet

- **Default: the image API's native transparent background**, one item per image.
- **Magenta sheets (`#FF00FF`) are legacy**, for ChatGPT-web batch sheets only. Slice them with the method in the Naming Convention doc (hard key, whole blobs by centroid, 2 px erode).
- **Never use magenta for steel, brass, glass, glowing or wispy items:** the 3D look makes metal and glass pick up a magenta tint in their reflections. Those must use native transparency or a neutral mid-grey background.
- **Glass and steam need partial alpha,** so they always come from native transparency, never from a key.

---

## 6. Characters

### Shared rules

- **Character-sheet first.** A signed-off sheet is the only reference for every later image of that character. Poses and expressions are **edits of the sheet**, never fresh generations.
- **Behind the island:** hands stay behind the counter or rest on its top; gestures stay above the counter line.
- **What stays fixed per character:** silhouette (head shape, hair or headscarf outline, build), colours of skin, hair, eyes and clothing, and signature accessories. A pose that changes any of these is a reject.
- **Expressions pipeline:** blink and mouth frames are in-place edits of the base image (`build/expressions.py`).

### Character-sheet contents

| Panel | What |
|---|---|
| Turnaround | Front, ¾, side, back; full body, neutral stance |
| Game crop | Upper body from the waist, front, as seen behind the island |
| Expressions | The list below, head and shoulders, front |
| Hands | Both hands open, showing rings, bangles, sleeve cuff |
| Callouts | Close-ups of the accessories and fabric patterns (glasses, earrings, embroidery motif) |
| Colour strip | Skin, hair, eyes, main fabrics as flat swatches |

**Expressions (people):** neutral, talking (mouth half-open and open), smile, big happy (celebrating), proud, pointing (above the counter), thinking, surprised, worried, gentle "tsk" (burnt food, a wrong item), laughing, eyes closed (blink). Customers also need impatient.

**Full cast list, who each character is based on, and where they appear:** `docs/Nani jo Ghar — Cast.md`.

### The cast

| Character | Status | Must stay consistent |
|---|---|---|
| **Nani** | **Based on Zafar's mum — she has agreed.** The current Nani (`sources/cook/nani-sheet.webp`) is a generated placeholder, to be replaced by a sheet made from Mum's photos | From the placeholder, until the new sheet: round thin gold glasses, red Kutch-embroidered dupatta over the head, cream kurta with red embroidery, small gold drop earrings, no bangles; a thin diamond tennis bracelet (right wrist), a yellow gold ring with a red aqiq (right ring finger) and a yellow gold solitaire diamond ring (left ring finger); see the Cast doc. Final details come from Mum's photos |
| **Nana, Ma, Ali, other cousins, guests** | **Generic** — not based on real family members | Placeholder looks stand until each is designed: Nana in a white knitted cap, round glasses, white beard, cream kurta, brown waistcoat; Ma in a green dupatta with gold motif over the head, maroon kurta with embroidery, gold jhumka earrings; **Ali** (cousin, renamed from the placeholder "Bilal") tall and lanky for his age, tousled black hair, an orange T-shirt with a pocket |
| **The doctor** | **Based on Zafar's wife's granddad; photos to come.** Arc 3 (the Monsoon, "Nani has a cold") and Nani's clinic mode | Likeness from the photos once they arrive, kept as the sheet-first rule below; a warm, reassuring build, a doctor's bag |
| **Big Ma** | **Based on Zafar's wife's great-grandma; photos to come.** "The spill" (mends the kurta in her room) and recurring at Eid, dinners and gatherings | Likeness from the photos once they arrive, kept as the sheet-first rule below; warm, senior, a soft cardigan or shawl over a plain kurta, glasses low on the nose, sewing things (needle, thread reel, small scissors) to hand |
| **Shopkeeper(s)** | To be redone in the 3D look | Made as edits of a family style reference, so they look like one family of designs |

**Nani from real life (asset plan, section 5):**
1. Mum's consent — **given**. Photos stay in the git-ignored `sources/private/`, never in the public repo.
2. Photos plus the style references go in; a character sheet in the 3D-film look comes out. Likeness lives in what survives stylising: face shape, glasses, the headscarf and its colours, build.
3. Zafar signs off the sheet.
4. **The sheet, never the photos, is the reference for every later pose.**
5. Then redo Nani's set: poses, talking frames, the LivePortrait test and her hand set (N).

**The doctor and Big Ma** follow the same sheet-first rule once their photos arrive: photos in, character sheet out, Zafar signs off, every later pose from the sheet.

**Cultural check for every character:** a Muslim Khoja family. No bindi, tilak, sindoor or other Hindu religious markers (the placeholder Nani in the art-direction round had a bindi; that was wrong).

### The cats

| | **Simba** | **Zazu** |
|---|---|---|
| Role | Big brother, 5 | Little brother, 1 |
| Coat | Black, Russian Blue build: short, dense, plush | Grey-blue (true Russian Blue) |
| Eyes | Green | Green |
| Size and proportions | Full adult, big cat, solid | **Drawn as a kitten**: bigger head and eyes, shorter legs, fluffier coat than Simba's, about 85% of Simba's length. Size and proportion, not just size, tell them apart |
| Must stay consistent | Green eyes, wedge head, large ears, tail length, any markings | Same list, plus kitten proportions |

**Cat sheet contents:** turnaround; sitting, lying, sleeping curled, walking, pouncing, eating, guilty face, carrying something in the mouth; expressions content, curious, guilty, startled, sleepy. **Head and tail are separate layers** (pivots in section 5) so code can flick the tail, turn the head, blink and breathe. About 15 images per cat, from 4–6 photos each.

**Rules:** a cat never covers a tap target, never blocks play at random, and lives on the floor layer or in the margins except in its scripted mischief moment.

### Kasuku, the parrot

An **African grey**, generic (no real-life likeness). Lives on the windowsill or a perch in the hub, the doorway or the kitchen. Behaviour and dialogue: `docs/Nani jo Ghar — Cast.md`.

**Pose set (small, since it mostly sits and reacts):**

| Pose | Notes |
|---|---|
| Perched | Base pose, neutral |
| Head tilt | Head as a separate layer, so code can tilt it without a new body pose |
| Beak open, "talking" | Head layer, for when it repeats a word |
| Wings flapping | 2 frames |
| Walking along the perch | 2 frames |

**Head is a separate layer** (pivot at the base of the neck, as for the cats and characters in section 5), so tilts, the talking pose and blinks are all head-layer edits over one body.

---

## 7. Hands

Full list and generation order: `docs/Nani jo Ghar — Asset Building Plan.md`, section 1.

- **First person:** forearms enter from the bottom edge. Rigid images moved in code, no finger animation.
- **Right hands only;** left hands are mirrored in code. Two-handed images only where the hands touch (rolling pin, clap, handshake, fold).
- **Grip plus separate tool:** hands are drawn empty in the grip pose; the tool is its own sprite placed at the grip's pivot. The list is organised by grip (A open, B handle, C pinch, D hold, E social, F play).
- **Cameras:** a pose is drawn only in the camera it's used in (T top-down, back of the hand up; E eye level, back of the hand towards the player).
- **The reference hand:** one right hand, top-down, relaxed and slightly open, boy sleeve, 1.2× worktop scale. Zafar signs it off; every other hand is an edit of it.
- **Shape:** a slender hand: slim overall, with **long fingers relative to a small palm** (not stubby, chunky or toy-like). **No visible bones, knuckle ridges, tendons or veins**; surfaces stay smooth and simple, because the hands are rigid sprites moved in code.
- **Skin tone:** **one tone, Zafar's own** — a warm light tan, not orange, not saturated (hex values in section 2). No skin-tone variants for now.
- **Sleeve:** modern, not costume. The rolled sleeve is **only sometimes visible**: in the top-down set the bare forearm enters from the bottom edge and the soft rolled fabric just shows at the very bottom edge, or is cropped out.
- **Post steps on every generated hand (hands v1, `build/gen_assets.py`, `post_process_hand()`):** (1) grips drawn round a magenta placeholder have it keyed out, leaving the tool's exact gap (the placeholder is drawn *behind* the fingers so the cut never slices a finger), and the red rim it leaves is cleaned; (2) the skin is matched to the reference hand's whole tone range (lightness and chroma percentiles and hue), not just the midtone, which is what fixes orange palms and pale, differently lit hands; (3) the hand is rescaled so its forearm, measured just above the sleeve, is as wide as the reference's (250 px on the 1024 px canvas), anchored where the arm leaves the bottom edge. Re-run on existing files with `python3 build/gen_assets.py --post <ids or group>`.

### Sleeves and reskins

Reskins change **only the skin tone, sleeve and accessories**, and they are made **in code, not with the image API** (25 Sept 2026: API reskins redrew the hand in 39 of 47 cases). `build/skin_hands.py` recolours the masked skin and sleeve of each approved master and composites jewellery sprites (drawn in code) at anchor points recorded per pose in `data/hand-anchors.json` (wrist point, angle and width; ring-finger point, angle and view). Characters are data in `data/hand-skins.json`. Every master pixel keeps its place, so outlines and tool gaps never drift.

| Version | Sleeve and details |
|---|---|
| **Master / boy** | Plain white linen shirt sleeve, rolled back to between the elbow and the wrist; bare forearm below the roll; no embroidery (replaces the old embroidered kurta cuff, 24 Sept 2026) |
| **Girl** | The same kind of modern rolled sleeve in a soft colour (e.g. dusty pink), plus 3–4 thin glass bangles; the bangles are the main difference |
| **Girl, Eid** (optional) | As girl, with mehndi on the back of the hand and the palm; a simple floral pattern, rust-brown |
| **Nani** (every pose, left hands too) | Her warmer, unsaturated skin; deep-red sleeve; **no bangles**; right: red aqiq ring in a plain yellow gold bezel and a thin diamond tennis bracelet; left: round solitaire diamond in a six-claw yellow gold setting (Cast, corrected 24 Sept; sheet v2). The hand shape is the master's: code can't age it |

---

## 8. Items and states

**The asset matrix:** each item gets only the views and states the game uses. No generic 6–8-view sets. The matrix is shared with Find it: the bazaar sells the same items in the same F view as the pantry.

### Views

| View | Where | Look |
|---|---|---|
| **F** (front) | Pantry shelves, bazaar stall, serving at the island, Who did it? clues | As section 3; standing on its base with a contact point |
| **T** (top-down) | Every cooking station, Tidy up tables, the clinic table | Straight down; round things are circles |

### States (examples, provisional per station)

| Item | F | T states |
|---|---|---|
| Onion | whole | whole, halved, chopped, frying golden, burnt |
| Tomato | whole | whole, halved, chopped |
| Potato | whole | whole, peeled, cubed, boiled, chips (raw, golden, burnt) |
| Green chilli | whole | whole, chopped |
| Spices (jeeru, rai, hardar, elchi, loon…) | in a jar, tin or katori | heaped in a katori; a pinch; sizzling in oil (code adds bubbles) |
| Atto (flour) | in a steel dabba | heaped in a bowl |
| Dough | — | ball, rolled raw circle, half-cooked (brown spots), puffed, burnt |
| Milk, water | jug | disc (see below) |
| Daal | dry, in a bowl | dry in a bowl; cooked disc in the pot |
| Samosa | on a plate | filled flat, folded raw, fried golden, burnt |
| Mishkaki | on a plate | raw on the skewer, grilled, charred |

**How states are made:** each state is **generated fresh with its own full prompt** (template 9c), never edited from another state. Turning a whole onion into diced onion is a complete transformation that edit mode won't carry across (tested 24 Sept 2026: the edit produced solid two-tone cubes). States match each other only through the shared style block, the same view wording and the same colour words. **Edit mode is only for small changes to the same object:** hand poses from the signed-off reference hand (9e), reskins (9f), and adding an item into an empty station background (9d). Never for state changes. Use code for anything convincing as an effect: steam, bubbles, sizzle, a golden tint, a sparkle. "Burnt" is always its own drawing.

**Spices:** always **heaped in open bowls** (a steel katori or a small ceramic bowl) so the colour and texture read from above and from the front. Tins and jars only in the pantry F view. The masala dabba is the natural T-view spice container.

**Liquids from above:** liquid is a **disc** masked by the pot's inner rim, never a flat oval or a side view. The disc grows from the base radius towards the rim radius as it fills, so the visible band of inner wall shrinks. Colour, bubbles and a boil-over are code. Pour shows a stream sprite from the jug lip to the disc.

**Flames:** a **flame ring** sprite (small blue tongues with warm tips around the burner) in T view, flickered in code. Not dots.

---

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

### (e) A hand pose

Attach: the signed-off reference hand (after it exists); before that, the style reference.

> The right hand and forearm of a child of about 7, {skin tone}, entering from the bottom edge of the frame, {T: "seen from directly above, back of the hand up, over a worktop" | E: "at eye level, back of the hand towards the viewer"}. Pose: {grip description, e.g. "fingers curled around an invisible horizontal handle, as if holding a knife, thumb along the top"}. No tool or object in the hand. Slender hand, long fingers relative to the palm, smooth, no visible bones, knuckle ridges or veins. Sleeve: a plain white linen shirt sleeve rolled back to between the elbow and the wrist, bare forearm below, the roll just showing at the frame edge (or cropped out); no embroidery. Same hand, skin, size and sleeve as the attached reference hand. Transparent background.

### (f) A reskin (sleeve and accessories only)

Attach: the master hand image.

> Edit the attached image. Change only the sleeve and accessories: {e.g. "replace the sleeve with a plain, modern rolled-back cotton sleeve in a soft dusty pink and add three thin glass bangles in red, green and gold at the wrist"}. Keep the hand exactly the same: identical outline, finger positions, skin, lighting and size. Nothing else changes. Transparent background.

---

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
| 14 | **Finger count (hands)** | Count every digit, at full size, and write the count down for each hand. Five per hand (thumb and four fingers) unless the pose hides some behind the palm; hidden digits must be where the pose puts them, not missing. Counting frames E3 raise exactly 1, 2, 3, 4, 5 (in "4" the thumb is folded and must not stick out). Reject: a missing or extra digit, two fingers merged, two hands fused into one shape |
| 15 | **Hand scale matches (hands)** | Forearm width just above the sleeve differs from the reference by more than about 5% after the scale normaliser (`build/gen_assets.py`, `forearm_widths()`); the hand looks bigger or smaller than its neighbours on the contact sheet; the normaliser had no room to grow it (flagged in its log) |
| 16 | **Hand camera, light and skin (hands)** | T poses not seen from straight above; E poses showing the palm when the pose says the back of the hand; a forearm entering from the side when the pose doesn't need it; light not from the upper left like the reference; skin not matching the reference after the skin normaliser (orange palms, pale or pink hands) |
| 17 | **Tool gaps (grips)** | A tool drawn in the hand (tools are separate sprites); no clear gap where the tool goes; a keyed-out gap that slices through a finger or leaves a red rim |

**Cultural accuracy (a Khoja home, Kutch and East Africa):**
- **Clothing:** kurta, kurti, salwar, dupatta or headscarf; modest cuts; caps on men as the family confirms. No Hindu religious markers.
- **Food:** halal, no pork, no alcohol. Dishes look like home versions: rotli and maani thin and soft with brown spots, daal yellow and loose, chai milky and orange-brown in a glass, mishkaki as small marinated cubes on a skewer.
- **Kitchen items:** steel thali and katori, masala dabba, tawa, chakla and a thin tapered velan, vaghariyu for tadka, a chai saucepan and strainer, steel dabbas, a pressure cooker. East African and Kutch set dressing: `docs/Nani jo Ghar — Asset Building Plan.md`, "Set dressing: East African and Kutch objects".
- **Decor:** Kutch craft as accents (mirror-work, ajrakh, bandhani, brass); no deity images, no temple items.

---

## 11. Open questions for Zafar

Answered 24 Sept 2026 and folded into the sections above: Mum's likeness and headscarf detail (section 6), which family members are generic and the doctor's likeness (section 6, `docs/Nani jo Ghar — Cast.md`), the cats' eye colour and Zazu's kitten proportions (section 6), hand skin tone (sections 2 and 7), lighting states (section 2), and East African set dressing (asset plan, "Set dressing: East African and Kutch objects"). Also answered the same day, from a family conversation: set-dressing restraint (section 1), Big Ma's role as the seamstress (section 6, `docs/Nani jo Ghar — Cast.md`), the cousin renamed Bilal → Ali (section 6), and the parrot's name, Kasuku (section 6).

None outstanding.
