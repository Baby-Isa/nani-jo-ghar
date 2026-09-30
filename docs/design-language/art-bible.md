# Nani jo Ghar: art bible


> **Stale points (what `docs/process/rules.md` now overrides; the text below is left as written).**
> - Liquids drawn as discs masked by the pot's inner rim (§8) → pre-rendered pictures, cross-faded; never drawn dots or discs (D11)
> - "Default: the image API's native transparent background" → art is made in ChatGPT via Claude in Chrome; no alpha, so batches use magenta `#FF00FF` for food and grey `#808080` for steel, glass, wood, tools and characters, then key it (D1, D3, D22). See `art-pipeline.md`
> - Hands (§7) and the hands sections of the prompt templates → parked, none in Cook (H13); the hand work is kept in `art-pipeline.md` under "Hands (parked)"
> - Quilt (in the cast notes) → bookshelf (decision 4)
> - Star-related art and UI (ear, hand, tick stars) → three badges (H5)
> - "No private photos" wording in older prompts → superseded by decision 9
> - Chapter 1 "thick outlines / cel shading" style line → retired; this bible's 3D-film look stands
> - Open in this file: "tappable items get the most saturation in the frame" and "one accent pattern per surface" (§2) are not in the rulebook; they live here.
> - §5 (layers, pivots, containers, export, transparent backgrounds), §9 (prompt templates) and §10 (visual QA checklist) moved to `art-pipeline.md`.

**Started:** 24 Sept 2026. **Status:** v1, the single source of truth for every image prompt and every art review. It will be amended as the Cook with Nani stations settle; parts marked **(provisional)** are expected to change.

**Where the decisions came from:** `docs/archive/art/art-direction-options.md` (section 10, the chosen 3D-film look), `docs/archive/cook/cook-with-nani-phase-a-design.md` (section 2, what went wrong and the agreed fixes), `docs/archive/art/Asset Building Plan.md` (hands, cats, ambient motion, real-life likeness), `docs/archive/design-v1/game-modes-v2.md` (the eight modes), `docs/archive/art/Asset Naming Convention.md` (file names, slicing).

**Supersedes:** the style line "children's storybook illustration style, soft cel shading, thick soft outlines" in `docs/archive/art-prompts/Chapter 1 Art Prompts.md`. Those prompts keep their layout rules (empty tappable surfaces, a counter to stand behind, no text), but their style line is retired.

---

## 1. Style

**In one paragraph:** a stylised 3D animated-feature look, the kind of frame you'd see in a modern family film. Soft global illumination and warm sunlight; believable materials (marble with warm veins, brushed steel, polished brass, pale oak, cotton and linen, glossy tomato skin, matte flour); no outlines. Shapes are simplified and slightly chunky, with clean surfaces and restrained micro-detail, so every item reads at 90 px on a phone. Faces are stylised, not realistic: big expressive eyes, soft rounded forms, simple readable mouths, a small nose, smooth skin with rosy cheeks. The home is a **modern kitchen with Kutch accents** (limewash, marble, sage cabinets, brass, mirror-work, ajrakh); the bazaar may be more traditional. Modern throughout, culture as a hint; the language is the main cultural thing.

**Set dressing: restraint (decided with the family, 24 Sept 2026).** Zafar's wife: "don't do too much, it will look old again." The game is modern-looking with hints and nods to East Africa and Kutch, never a caricature of either. **At most 1–2 cultural nods per scene**, rotated between scenes and visits rather than all shown at once, and introduced gradually as the game goes on. Never clutter. Full object list: `docs/archive/art/Asset Building Plan.md`, section 6.

### Canonical style references

Attach these (never the old storybook art) when a prompt needs a style reference.

| Path | Use it for | Don't use it for |
|---|---|---|
| `assets/cook/bg/service.jpg` | Setting, palette, light direction, material finish of the home | Camera for cooking stations (it's the eye-level island view) |
| `sources/cook/nani-sheet.webp` | Character rendering: face stylisation, eyes, skin, fabric, embroidery detail | Nani's identity (to be replaced by the sheet made from Mum's photos) |
| `sources/cook/customers-sheet.webp` | Family consistency: the same render style across ages and genders | Final designs of Nana, Ma or Ali (placeholders) |
| `sources/cook/props-sheet.webp` | Item materials and level of detail (steel, brass, glass, dough, chopped veg) | **Camera.** Its ¾ view is exactly the mismatch that broke the proof of concept |

**Anti-references (never attach for style):** everything in `assets/backgrounds/` and `assets/characters/` (the old cel-shaded storybook look), and `docs/archive/cook-screens/03-pantry.jpg` and `08-tawa.jpg` as examples of the camera and scale faults listed in section 10.

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


## 5. Layers and motion (moved; ambient motion kept here)

Moved to `docs/design-language/art-pipeline.md` (§5: layers, pivots, containers, export, transparent backgrounds). The ambient-motion table from the asset plan is kept here:

> from: docs/archive/art/Asset Building Plan.md §4 Making scenes feel alive (ambient motion)

### Ambient motion: making scenes feel alive

**Rule for every background from now on: anything that should move is its own layer with a pivot point**, not painted into the background. Code does the motion (a gentle sine sway, flicker, particles), so the art cost is mostly just separating the layers.

| Motion | Art needed | Done in code |
|---|---|---|
| Bunting swaying (Eid) | Each flag its own small sprite on a string sprite | Per-flag sway with an offset, a gust every so often |
| Curtain in a breeze | Curtain as a separate layer | A slow skew/wave |
| Ceiling fan | The blades as a separate sprite | Rotation |
| Steam (chai, daal, rain on a hot road) | One soft wisp sprite | Particles |
| Flames on the hob | Already drawn in code | Flicker |
| Dust in a sunbeam | One soft dot | Drifting particles in the light shaft |
| Plants, leaf shadows on the wall | Plant and leaf-shadow layers | Sway |
| Washing line, a kite through the window | Each item a sprite | Sway, a kite bobbing |
| Birds on the windowsill or wire (pigeons, sparrows) | 3–4 poses (sit, peck, hop, fly off) | Occasional hop; fly off when tapped |
| Kasuku, the parrot (African grey, windowsill or a perch — hub, doorway, kitchen) | Pose set: perched, head tilt, beak open "talking", wings flapping, walking along the perch. Head a separate layer | Idle tilts and the odd "talking" beat when it repeats a word (behaviour: `docs/game-design/cast.md`); never during a task |
| Lanterns and fairy lights (Eid) | Lantern sprite; one light-dot sprite | Glow pulse, twinkle |
| Clock | Hands as separate sprites | Ticking |
| Rain on the window, drips (Monsoon) | Drop and streak sprites | Particles |
| Cats, Nani | See section 3; Nani's breathing and blinking already exist | Breathing, blinking, tail flicks |

Keep it subtle: 2–4 moving things per scene, never near a tap target, and switched off by the "reduce motion" setting.

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

**Full cast list, who each character is based on, and where they appear:** `docs/game-design/cast.md`.

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

An **African grey**, generic (no real-life likeness). Lives on the windowsill or a perch in the hub, the doorway or the kitchen. Behaviour and dialogue: `docs/game-design/cast.md`.

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

Full list and generation order: `docs/archive/art/Asset Building Plan.md`, section 1.

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


## 9 and 10. Prompt templates and visual QA checklist (moved)

Moved to `docs/design-language/art-pipeline.md`.

**Cultural accuracy (a Khoja home, Kutch and East Africa):**
- **Clothing:** kurta, kurti, salwar, dupatta or headscarf; modest cuts; caps on men as the family confirms. No Hindu religious markers.
- **Food:** halal, no pork, no alcohol. Dishes look like home versions: rotli and maani thin and soft with brown spots, daal yellow and loose, chai milky and orange-brown in a glass, mishkaki as small marinated cubes on a skewer.
- **Kitchen items:** steel thali and katori, masala dabba, tawa, chakla and a thin tapered velan, vaghariyu for tadka, a chai saucepan and strainer, steel dabbas, a pressure cooker. East African and Kutch set dressing: `docs/archive/art/Asset Building Plan.md`, "Set dressing: East African and Kutch objects".
- **Decor:** Kutch craft as accents (mirror-work, ajrakh, bandhani, brass); no deity images, no temple items.

---

---

## Set dressing

> from: docs/archive/art/Asset Building Plan.md §6 Set dressing: East African and Kutch objects

### East African and Kutch objects

**Restraint rule (decided with the family, 24 Sept 2026): at most 1–2 cultural nods per scene**, rotated between scenes and visits rather than all shown at once, introduced gradually, never clutter. Zafar's wife: "don't do too much, it will look old again" — the game is modern-looking with hints and nods, not a caricature. See also the Art Bible, section 1. Object first, then a one-line description of how it looks, then which scenes it suits.

### East Africa — chosen (24 Sept 2026)

| Object | How it looks | Suits |
|---|---|---|
| **Tandoor** | Large clay oven, wide mouth, set into a low brick surround | **Background only**, somewhere in the yard. Replaces the charcoal jiko stove (removed) |
| **Vacuum flask of chai** | Tall metal or patterned plastic flask with a cup-lid | Hub, guests arriving, the dastarkhwan |
| **Blue-rimmed enamel mugs and plates** | White enamel with a speckled dark-blue rim and edge chips | Dastarkhwan, kitchen shelves, yard meals |
| **Kanga cloth** | Bright block-printed cotton, bold border, folded stacks or worn as a wrap | Market stalls, washing line, Ma or a guest's dress |
| **Woven mkeka mat** | Flat plaited palm-leaf mat, natural tan with a simple woven pattern | Floor seating, dastarkhwan, yard |
| **Mbuzi, the coconut-grater stool** | Low wooden stool with a curved serrated blade fixed at one end, sat astride to grate | Kitchen background, a cook-along beat |
| **Carved Swahili-style door** | Dark wood, deep geometric and floral relief carving, brass studs | Bazaar or hub exterior establishing shot |
| **Woven baskets (kiondo)** — the family's own suggestion | Tightly coiled woven fibre, rounded body, often a leather or cloth trim and carry strap | Bazaar (Find it), hub shelves, carried by shoppers |
| **Three-legged wooden stool (kigoda)** — the family's own suggestion | Low, round-topped, three splayed legs, plain turned wood | Hub, kitchen, yard, bazaar stalls |
| **Short straw broom (ufagio)** — the family's own suggestion | A tight bunch of stiff grass or straw bound at the top into a handle, no long shaft; used bent over | Yard, tidy-up scenes, propped by a doorway |
| **Panga (machete)** — the family's own suggestion | A long, broad steel blade with a plain wooden handle | **Tool only, hanging**, on a hook in the yard or a store; never handled, since it's a children's game |

**Not now** (suggestions the family didn't pick; drop unless a later scene calls for one): brass coffee pot, kerosene lamp, tin trunk, transistor radio, mosquito net, crate of soda bottles, sugarcane, mango tree, Maasai shuka blanket.

### Kutch — suggestions, same restraint rule

Not yet chosen; a list to work from.

| Object | How it looks | Suits |
|---|---|---|
| Mirror-work cushions (abhla) | Embroidered cotton with small round mirror discs stitched in, bright thread borders | Hub seating, dastarkhwan, bedroom |
| Bandhani cloth | Tie-dyed fine cotton or silk, small dot patterns in bright colours on a deep ground | Dupattas, cushion covers, folded stacks on a shelf |
| Brass and copper vessels | Hand-hammered pots and lotas, warm gold and reddish sheen, dented and polished | Kitchen shelves, serving, the courtyard |
| Charpai | Low wooden frame strung with woven rope or webbing in a criss-cross pattern | Yard or courtyard seating, an outdoor nap spot |
| Clay water pots (matka) | Rounded unglazed terracotta, a narrow neck, sometimes on a stand or ring | Kitchen, yard, bazaar |
| Rogan-painted cloth | Fine, raised, glossy castor-paint scrollwork in bright colour on dark cloth | A framed wall piece, a special cushion or cloth |
| Carved wooden chest | Dark wood, brass corner fittings and studs, sometimes a domed lid | Bedroom, storage, the wedding arc (dowry chest) |

---


## 11. Open questions for Zafar

Answered 24 Sept 2026 and folded into the sections above: Mum's likeness and headscarf detail (section 6), which family members are generic and the doctor's likeness (section 6, `docs/game-design/cast.md`), the cats' eye colour and Zazu's kitten proportions (section 6), hand skin tone (sections 2 and 7), lighting states (section 2), and East African set dressing (asset plan, "Set dressing: East African and Kutch objects"). Also answered the same day, from a family conversation: set-dressing restraint (section 1), Big Ma's role as the seamstress (section 6, `docs/game-design/cast.md`), the cousin renamed Bilal → Ali (section 6), and the parrot's name, Kasuku (section 6).

None outstanding.
