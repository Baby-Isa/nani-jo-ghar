# ChatGPT art prompts: the copy-paste pack

**Started:** 24 Sept 2026. **For:** making the game's art in ChatGPT (included in the subscription) instead of paying per image on the API. **Built from:** `docs/Nani jo Ghar — Art Bible.md` (the rules win if anything here disagrees), `docs/Nani jo Ghar — Cast.md`, `docs/Nani jo Ghar — Asset Building Plan.md`, `docs/Nani jo Ghar — Asset Naming Convention.md`, `build/slice_sheet.py` and `data/cook.json`.

Work top to bottom. Each prompt is one fenced block: copy it, attach what the **attach:** line says, send. Keep the result only if it passes the **check:** line, then download it and name it as the **save as:** line says.

---

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

## 2. Character sheets

**How it works for people:** first the **main sheet** (turnaround, the waist-up game view, hands, colour swatches), then, in the same chat, the **expressions sheet** (section 2.8), attaching the approved main sheet. Once Zafar signs off a sheet, that sheet is the only reference for that character from then on; never the photos again.

**For every person:** a stylised 3D-film face (big expressive eyes, soft rounded forms, simple mouth, smooth skin), modern, warm and respectful, **never a caricature**. A Muslim Khoja family: no bindi, tilak or other Hindu markers.

### 2.1 Nani

**attach:** style anchor, `sources/private/mum-02-face.jpg` (best face), `mum-01.jpg`, `mum-03.jpg`, `nani-ring-aqiq-ref-1.jpg`, `nani-ring-diamond-ref.jpg`, and `sources/cook/nani-sheet.webp` (for how faces are rendered, not who she is).

```
Generate an image, 1536×1024, landscape.

A character sheet for a children's game character called Nani, a warm grandmother, based on the woman in the attached photos, rendered in the style of the attached style anchor (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). Use the character-sheet image only for how faces are stylised, not for who she is.

Keep her likeness in what survives stylising: her face shape, her warm closed-mouth smile, her build. Stylise the face: large expressive eyes with a clear highlight, soft rounded forms, simple readable mouth, smooth skin with gentle age lines, skin tone as in her photos rendered warm and unsaturated. Modern and respectful, never a caricature.

Her fixed look, identical in every panel:
- Thin round gold wire-framed glasses.
- A deep red headscarf wrapped round her head and neck, the long ends falling over the front.
- A small mole just above her upper lip on HER right side (the viewer's left when she faces us). Small and natural, never exaggerated.
- A beige long kurta with gold and deep-red embroidery down the front and at the cuffs, and a sheer deep-red dupatta.
- NO bangles. A thin diamond tennis bracelet on her right wrist. Right ring finger: a yellow gold ring with a smooth oval red-orange aqiq stone in a plain gold bezel. Left ring finger: a slim yellow gold ring with one round sparkling solitaire diamond in a raised claw setting.

Layout, on one flat plain light-grey background, in clear separate panels with space between them:
1. Full-body turnaround, standing, neutral pose: front, three-quarter, side, back.
2. Upper body cut at the waist, front view, as seen standing behind a kitchen counter.
3. Her hands: right hand and left hand, back of the hand towards us, fingers relaxed and slightly open, sleeve cuff visible, rings and bracelet clearly readable.
4. Close-ups: the glasses, the two rings, the embroidery motif on the cuff.
5. A strip of flat colour swatches: skin, eyes, headscarf red, kurta beige, embroidery gold.

The same woman in every panel, identical clothes and jewellery. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-nani-v1.png`
**check:** looks like Mum through the stylising (face shape, glasses, smile) and isn't a caricature · mole small, on the viewer's left in the front views · rings on the right fingers, tennis bracelet on the right wrist, **no bangles** · red headscarf the same in all panels; five fingers per hand.

### 2.2 Big Ma

**attach:** style anchor, `sources/private/bigma-01.jpg`, `bigma-02.jpg`, `bigma-03.jpg`, and the approved `char-nani-v1.png` (for render style only, so the two grandmothers look like one family of designs).

```
Generate an image, 1536×1024, landscape.

A character sheet for a children's game character called Big Ma, the family's great-grandmother and seamstress, based on the woman in the attached photos, rendered in the style of the attached style anchor (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). Render her exactly as the attached Nani sheet is rendered, but she is a different person.

Keep her likeness in what survives stylising: her face shape, a gentle, knowing smile, her build. She is very elderly and small. Stylise the face: large expressive eyes, soft rounded forms, simple mouth, smooth skin with gentle age lines, skin tone as in her photos rendered warm and unsaturated. Modern and respectful, never a caricature.

Her fixed look, identical in every panel:
- Thin metal rectangular glasses.
- ALWAYS a headscarf: a soft, plain one in a muted dark colour, with a little of her dark, greying hair showing at the front, pulled back.
- A soft cotton house dress in maroon with a small white paisley print and lace trim.
- Thin gold bangles on both wrists.

Layout, on one flat plain light-grey background, in clear separate panels with space between them:
1. Full-body turnaround, standing, neutral pose: front, three-quarter, side, back.
2. Upper body cut at the waist, front view, as seen sitting behind a sewing table.
3. Her hands: right and left, back of the hand towards us, relaxed, bangles and sleeve visible.
4. Close-ups: the glasses, the paisley print and lace trim, and her sewing things (a needle with red thread, a wooden thread reel, small scissors).
5. A strip of flat colour swatches: skin, eyes, hair, headscarf, dress maroon.

The same woman in every panel, identical clothes. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-bigma-v1.png`
**check:** headscarf in every panel · reads as older and smaller than Nani, clearly a different person · rectangular glasses, maroon paisley dress, thin gold bangles · gentle smile, no caricature.

### 2.3 The doctor

**attach:** style anchor, `sources/private/doctor-01.jpg` to `doctor-04.jpg`, and the approved `char-nani-v1.png` (render style only).

```
Generate an image, 1536×1024, landscape.

A character sheet for a children's game character, the family doctor, a friendly grandfatherly man, based on the man in the attached photos, rendered in the style of the attached style anchor (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). Render him exactly as the attached Nani sheet is rendered, but he is a different person.

Keep his likeness in what survives stylising: face shape, build, and his big, open, laughing smile. Stylise the face: large expressive eyes, soft rounded forms, simple mouth, smooth skin, skin tone as in his photos rendered warm and unsaturated. Warm and reassuring, never stern, never a caricature.

His fixed look, identical in every panel:
- Bald, with a neatly trimmed white beard.
- Clear-framed glasses.
- A checked blazer over a white shirt, smart trousers.
- A steel wristwatch on his left wrist.
- He carries a brown leather doctor's bag.

Layout, on one flat plain light-grey background, in clear separate panels with space between them:
1. Full-body turnaround, standing, neutral pose, bag in hand: front, three-quarter, side, back.
2. Upper body cut at the waist, front view, as seen standing behind a table.
3. His hands: right and left, back of the hand towards us, relaxed, shirt cuff and watch visible.
4. Close-ups: the glasses, the watch, the doctor's bag, the blazer check.
5. A strip of flat colour swatches: skin, eyes, beard, blazer, shirt.

The same man in every panel, identical clothes. Do not add any text, letters, numbers, labels or watermarks, including on the bag. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand.
```

**save as:** `char-doctor-v1.png`
**check:** bald, trimmed white beard, clear glasses, big laughing smile · friendly, not stern · no writing or cross symbols on the bag · watch on the same wrist in every panel.

### 2.4 Simba (big brother cat)

**attach:** style anchor, `sources/private/simba-01.jpg`, `cats-01-zazu-left-simba-right.jpg` (Simba is the darker, bigger one), `cats-03-simba-back-zazu-front.jpg`.

```
Generate an image, 1536×1024, landscape.

A character sheet for a cat in a children's game: Simba, a big five-year-old cat, based on the darker, bigger cat in the attached photos, rendered in the style of the attached style anchor (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). Appealing and expressive like a film animal, but still clearly a real breed, not a cartoon.

His fixed look, identical in every panel:
- A charcoal, near-black Russian Blue: short, dense, plush coat.
- Solid, round-faced and heavier; a full-grown big cat.
- Pale mint-green eyes.
- A dark collar with one small silver bell. No tags.

Layout, on one flat plain light-grey background, separate poses with space between them, all at the same scale:
Top row: turnaround standing: front, three-quarter, side (facing right), back.
Bottom row: sitting upright; lying down with paws tucked; asleep curled in a ball; walking (side view, facing right).
Also a strip of flat colour swatches: coat, eyes, collar.

The same cat in every pose. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No other animals.
```

**save as:** `char-simba-v1.png`
**check:** near-black, round-faced, heavy · mint-green eyes · collar with bell, no tags · same size in every pose.

Then, in the same chat, attaching the approved sheet:

```
Using the attached Simba sheet as the only reference, make a second sheet, 1536×1024, same flat light-grey background, same scale and style, the same cat exactly: coat, eyes, collar and bell unchanged.
Top row: pouncing (side view, facing right); eating from a small bowl; carrying a green chilli in his mouth; a guilty face (ears back, eyes sideways).
Bottom row, head and shoulders, front: content (eyes half-closed), curious (head tilted, ears forward), startled (eyes wide, ears up), sleepy (yawning).
No text, labels or watermarks.
```

**save as:** `char-simba-poses-v1.png`
**check:** the same cat as the sheet · each expression reads at thumbnail size · the chilli is the only extra object.

### 2.5 Zazu (little brother, drawn as a kitten)

**attach:** style anchor, the approved `char-simba-v1.png` (for style and scale), `sources/private/cats-01-zazu-left-simba-right.jpg` (Zazu is the lighter one), `cats-02.jpg`, `cats-03-simba-back-zazu-front.jpg`.

```
Generate an image, 1536×1024, landscape.

A character sheet for a cat in a children's game: Zazu, a one-year-old cat, the little brother of the cat on the attached Simba sheet, based on the lighter, slimmer cat in the attached photos. Render him exactly as Simba is rendered (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines).

His fixed look, identical in every panel:
- A silver-grey Russian Blue, slim, with big ears.
- Drawn as a KITTEN: bigger head and bigger eyes for his body, shorter legs, a fluffier coat than Simba's. About 85% of Simba's length. His proportions, not only his size, tell him apart from Simba.
- Yellow-green eyes.
- A plain thin collar, no bell, no tags.

Layout, on one flat plain light-grey background, separate poses with space between them, all at the same scale:
Top row: turnaround standing: front, three-quarter, side (facing right), back.
Bottom row: sitting upright; lying down; asleep curled in a ball; walking (side view, facing right).
Far right: Zazu sitting beside Simba (copied exactly from the attached sheet) to show their size difference.
Also a strip of flat colour swatches: coat, eyes, collar.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

**save as:** `char-zazu-v1.png`
**check:** reads as a kitten (big head, short legs), not a small adult · silver-grey, clearly lighter than Simba · yellow-green eyes, thin collar, no bell · side-by-side panel: Zazu smaller and slimmer.

Then, in the same chat, attaching the approved sheet:

```
Using the attached Zazu sheet as the only reference, make a second sheet, 1536×1024, same flat light-grey background, same scale and style, the same kitten exactly: kitten proportions, coat, eyes and thin collar unchanged, no bell.
Top row: pouncing (side view, facing right); eating from a small bowl; carrying a green chilli in his mouth; a guilty face (ears back, eyes sideways).
Bottom row, head and shoulders, front: content (eyes half-closed), curious (head tilted, ears forward), startled (eyes wide, ears up), sleepy (yawning).
No text, labels or watermarks.
```

**save as:** `char-zazu-poses-v1.png`
**check:** still a kitten in every pose · no bell appears · the chilli is the only extra object.

**Head and tail layers** (so the game can flick the tail and turn the head): don't ask ChatGPT for separated parts. Claude cuts them from the side and sitting poses.

### 2.6 Kasuku (the parrot)

**attach:** style anchor only (Kasuku isn't based on a real bird).

```
Generate an image, 1536×1024, landscape.

A character sheet for a pet parrot in a children's game: Kasuku, an African grey parrot, rendered in the style of the attached style anchor (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). Appealing and expressive like a film animal, but clearly a real African grey.

His fixed look, identical in every panel: soft grey feathers with a gentle scalloped pattern, a pale whitish face patch around each eye, pale yellow eyes, a curved black beak, grey feet, and a short bright red tail.

He stands on a short, plain, horizontal wooden perch (a simple round dowel) in every pose, the same perch each time.

Layout, on one flat plain light-grey background, separate poses with space between them, all at the same scale:
Top row: perched, neutral, side-on facing left; perched, front view; perched with his head tilted to one side, curious; perched with his beak open, "talking".
Bottom row: wings open, flapping up (frame 1); wings flapping down (frame 2); walking along the perch, one foot lifted (frame 1); walking, the other foot lifted (frame 2).
Also a strip of flat colour swatches: grey feathers, face patch, beak, red tail.

Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No other animals or objects.
```

**save as:** `char-kasuku-v1.png`
**check:** clearly an African grey (grey body, red tail, pale face patch) · the same perch in every pose · talking pose has the beak visibly open · wing frames look like one flap.

### 2.7 The family: Nana, Ma, Ali and baby Isa (generic, not real people)

These four aren't based on anyone. Their skin is based on **Zafar's own tone**: a warm light tan (midtone about `#C49A78`, face in daylight about `#BE826B`), never orange, never oversaturated, varied only slightly between them so they look related. First a line-up so they match each other, then one sheet each in the same chat.

**attach:** style anchor, the approved `char-nani-v1.png` (render style only), `sources/private/zafar-hand.jpg` and `zafar-group.jpg` (skin tone only; say nothing to ChatGPT about who's in them).

```
Generate an image, 1536×1024, landscape.

A line-up of four characters from one family for a children's game, standing side by side, full body, front view, neutral friendly poses, rendered in exactly the style of the attached Nani sheet (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). These are new, invented people; do not copy anyone's face from the photos.

Skin: base every skin tone on the skin in the attached photos: a warm light tan, a little more brown than beige, rendered warm and unsaturated, never orange. Vary it only very slightly between the four so they read as related.

Stylised faces: large expressive eyes, soft rounded forms, simple mouths, smooth skin. Modern, warm, appealing; never a caricature.

Left to right:
1. Nana, the grandfather: a white knitted cap, round glasses, a white beard, a cream kurta and a brown waistcoat.
2. Ma, the mother, in her thirties: a green dupatta with a small gold motif worn over her head, a maroon kurta with embroidery, gold jhumka earrings.
3. Ali, a cousin of about nine: tall and lanky for his age, long thin arms and legs, tousled black hair, an orange T-shirt with a chest pocket, jeans, trainers.
4. Isa, a baby of about one, sitting on the floor in front of Ma: a little tuft of black hair, round cheeks, a soft pale yellow cotton romper.

Realistic relative heights: Nana tallest, Ma a little shorter, Ali up to about Ma's shoulder.

One flat plain light-grey background. Do not add any text, letters, numbers, labels or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

**save as:** `char-family-lineup-v1.png`
**check:** skin warm light tan, not orange, all four related · Ali clearly tall and lanky · modern, no caricature · Nani-sheet render style.

Then one main sheet each, in the same chat, attaching the approved line-up:

```
Using the attached line-up as the only reference, make a character sheet for Nana, 1536×1024, flat light-grey background, same style. Exactly the same face, skin, clothes and colours as in the line-up. Panels: full-body turnaround (front, three-quarter, side, back); upper body cut at the waist, front view, as seen behind a kitchen counter; his right and left hands, back of the hand towards us; a strip of flat colour swatches. No text, labels or watermarks. Five fingers on each hand.
```

```
Using the attached line-up as the only reference, make a character sheet for Ma, 1536×1024, flat light-grey background, same style. Exactly the same face, skin, clothes, dupatta and earrings as in the line-up. Panels: full-body turnaround (front, three-quarter, side, back); upper body cut at the waist, front view, as seen behind a kitchen counter; her right and left hands, back of the hand towards us; a strip of flat colour swatches. No text, labels or watermarks. Five fingers on each hand.
```

```
Using the attached line-up as the only reference, make a character sheet for Ali, 1536×1024, flat light-grey background, same style. Exactly the same face, skin, hair and clothes as in the line-up; keep him tall and lanky. Panels: full-body turnaround (front, three-quarter, side, back); upper body from the chest up, front view, as seen behind a kitchen counter; his right and left hands, back of the hand towards us; a strip of flat colour swatches. No text, labels or watermarks. Five fingers on each hand.
```

```
Using the attached line-up as the only reference, make a character sheet for baby Isa, 1536×1024, flat light-grey background, same style. Exactly the same face, skin, hair and romper as in the line-up. Panels: sitting, front, three-quarter and side; crawling, side view; being held up with arms raised, happy; asleep; a strip of flat colour swatches. No text, labels or watermarks.
```

**save as:** `char-nana-v1.png`, `char-ma-v1.png`, `char-ali-v1.png`, `char-isa-v1.png`
**check:** each matches the line-up exactly · clothes identical across panels · hands have five fingers · no text.

### 2.8 Expressions (every person, same chat as their sheet)

**attach:** that character's approved main sheet only.

```
Using the attached character sheet as the only reference, make an expressions sheet for this character, 1536×1024, on the same flat light-grey background, same style. Head and shoulders, front view, the same framing and size in every panel, in a grid of 4 columns and 3 rows with space between them.
Row 1: neutral; talking, mouth half-open; talking, mouth open; smiling.
Row 2: big happy, celebrating; proud; pointing upwards with one hand, hand beside the face; thinking.
Row 3: surprised; worried; gentle disapproval, a kind "tsk"; laughing.
Keep the face, glasses, headscarf or hair, clothing, jewellery and colours exactly as on the sheet; only the expression changes. Expressions clear and readable at a small size, warm, never grotesque. No text, labels or watermarks.
```

**save as:** `char-<name>-expressions-v1.png` (e.g. `char-nani-expressions-v1.png`)
**check:** same person in all 12 (glasses, scarf, mole on Nani) · each emotion reads at thumbnail size · nothing grotesque.

For Nana, Ma and Ali, send one more: *"Same again, one panel only: impatient, arms folded, tapping a foot, but still friendly."* **save as:** `char-<name>-impatient-v1.png`.

---

## 3. Ingredient and prop sheets (magenta grids)

These are cut into single sprites by `build/slice_sheet.py`, which splits the image into **4 columns × 3 rows of equal cells**, reading **left to right, top to bottom**, keys out the magenta and crops each cell. So:

- **Items must sit well inside their own cell.** Anything crossing a cell edge gets chopped in half.
- **No shadows at all on magenta.** A shadow on magenta is dark purple, which the key can't remove. The game draws each contact shadow itself.
- **No steel, brass or glass on magenta.** Shiny metal picks up the magenta in its reflections. Those items go on sheets 8 and 9, on grey, and Claude cuts them out a different way.
- **One bowl for every "in a bowl" item:** the same small matte cream stoneware bowl, so they read as a set and don't reflect the magenta.
- **Fresh chat, fresh sheet.** Never ask for a sheet as an edit of another.

**attach (every sheet):** style anchor only.

### Sheet 1: spices and dry goods, in bowls (top-down)

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 cooking ingredients for a children's cooking game, each heaped in a small open bowl, seen from directly above, straight down (90 degrees): each bowl a perfect circle, the heap mounded above the rim so its colour and texture read clearly.

Every bowl is the same bowl: a small round open bowl in matte cream stoneware with a plain rim, about 9 cm across, the same size in every cell.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One bowl per cell, centred, filling about 55% of the cell, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: turmeric powder (bright golden yellow); red chilli powder (deep red); cumin seeds (small brown ridged seeds); black mustard seeds (tiny round dark seeds).
Row 2, left to right: green cardamom pods; white salt (fine crystals with a faint sparkle); white sugar (coarser crystals); loose black tea leaves (dark brown, fine and crumbly).
Row 3, left to right: wholewheat flour, atto (soft pale beige powder); dry yellow split lentils, toor daal; ghee (golden, soft and slightly glossy); freshly grated ginger (pale golden shreds).

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the bowls as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable food and stoneware materials, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No spoons, hands or extra objects.
```

**save as:** `sheet-spices-t-v1.png`
**slices to:** `turmeric-t-bowl` `chilli-powder-t-bowl` `cumin-t-bowl` `mustard-seeds-t-bowl` `cardamom-t-bowl` `salt-t-bowl` `sugar-t-bowl` `tea-leaves-t-bowl` `atto-t-bowl` `daal-dry-t-bowl` `ghee-t-bowl` `ginger-t-grated-bowl`
**check:** 12 bowls in the right order, all the same bowl, all circles · no shadows on the magenta, no grid lines · salt and sugar look different; cumin and mustard seeds look different · flat magenta, no pink glow on the bowls.

### Sheet 2: vegetables, whole (top-down)

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 whole fresh vegetables and fruit for a children's cooking game, each lying on its own, seen from directly above, straight down (90 degrees), as they'd look lying on a worktop: round things as circles.

All at one consistent scale, true to real life relative to each other (a tomato about 7 cm, an onion 8 cm, a garlic bulb 6 cm). Small items may be drawn up to one and a half times true size so they stay readable, but the order of sizes never changes: the garlic clove is always the smallest.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it; long items lie diagonally so they stay inside their cell. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: a whole red onion with papery skin; a whole ripe red tomato with its green stalk; a whole brown potato; the same potato, peeled (pale yellow, smooth).
Row 2, left to right: a whole garlic bulb; one peeled garlic clove; one fresh green chilli with its stalk; a knob of fresh ginger root.
Row 3, left to right: a whole yellow lemon; a whole green bell pepper; a small bunch of fresh coriander with stalks; a whole red onion, peeled (glossy purple-pink layers, no papery skin).

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, glossy tomato skin, papery onion skin, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No knives, boards, bowls, hands or extra objects.
```

**save as:** `sheet-veg-whole-t-v1.png`
**slices to:** `onion-t-whole` `tomato-t-whole` `potato-t-whole` `potato-t-peeled` `garlic-t-whole` `garlic-t-clove` `chilli-t-whole` `ginger-t-whole` `lemon-t-whole` `pepper-t-whole` `coriander-t-bunch` `onion-t-peeled`
**check:** straight down, tomato and onion are circles · size order right (clove smallest, pepper and coriander biggest) · chilli and coriander fully inside their cells · no shadows.

**Optional, sheet 2F (front view, for the pantry and the bazaar):** in a fresh chat, send sheet 2's prompt with the second paragraph's first sentence changed to *"each standing on its base, seen from the front, camera at the item's mid-height looking about 10 degrees down, so the top is just visible"*. **save as:** `sheet-veg-whole-f-v1.png`; slices use `-f-` instead of `-t-`.

### Sheet 3: vegetables, cut (top-down, loose, as on a chopping board)

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 freshly cut vegetables for a children's cooking game, seen from directly above, straight down (90 degrees), as they'd look on a chopping board (but with no board). Chopped items are one small loose heap each. Each item is drawn fresh here.

All at one consistent scale, true to real life relative to each other (a halved tomato about 7 cm across; each heap about 8 cm across). Pieces are clean, even and chunky enough to read at a small size.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One item or heap per cell, centred, with plenty of empty background all round it; a heap's loose pieces stay close together inside their cell. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: a red onion cut in half, cut face up showing its rings; a small heap of finely chopped red onion; a tomato cut in half, cut face up showing its seeds; a small heap of chopped tomato cubes.
Row 2, left to right: a peeled potato cut in half, cut face up; a small heap of raw potato cubes; a small heap of finely chopped garlic; a small heap of green chilli sliced into thin rings.
Row 3, left to right: a small heap of finely chopped fresh ginger; a small heap of chopped fresh coriander leaves; a lemon cut in half, cut face up; one lemon wedge.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, juicy believable food, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No knives, boards, bowls, hands or extra objects.
```

**save as:** `sheet-veg-cut-t-v1.png`
**slices to:** `onion-t-halved` `onion-t-chopped` `tomato-t-halved` `tomato-t-chopped` `potato-t-halved` `potato-t-cubed` `garlic-t-chopped` `chilli-t-chopped` `ginger-t-chopped` `coriander-t-chopped` `lemon-t-halved` `lemon-t-wedge`
**check:** no stray pieces drifting towards a neighbouring cell · halves are cut face up and read as that vegetable · heaps similar sizes · no shadows.

### Sheet 4: chaat toppings and samosa fillings, in bowls (top-down)

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 prepared ingredients for a children's cooking game, each heaped in a small open bowl, seen from directly above, straight down (90 degrees): each bowl a perfect circle, the food filling it generously so its colour and texture read clearly.

Every bowl is the same bowl: a small round open bowl in matte cream stoneware with a plain rim, about 9 cm across, the same size in every cell.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One bowl per cell, centred, filling about 55% of the cell, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: boiled chickpeas (plump, pale golden); boiled potato cubes (soft, pale yellow); plain white yoghurt (smooth and thick, a gentle swirl); tamarind chutney (glossy dark brown, a swirl).
Row 2, left to right: green chutney (bright herby green, a swirl); finely chopped red onion; chopped tomato; green chilli sliced into thin rings.
Row 3, left to right: chopped fresh coriander leaves; sev (crisp thin golden-yellow gram-flour noodles in a loose tangle); green peas; cooked spiced lamb mince, keema (brown, crumbly).

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the bowls as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable food and stoneware, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No spoons, hands or extra objects.
```

**save as:** `sheet-toppings-t-v1.png`
**slices to:** `chickpeas-t-bowl` `potato-t-boiled-bowl` `yoghurt-t-bowl` `tamarind-chutney-t-bowl` `green-chutney-t-bowl` `onion-t-chopped-bowl` `tomato-t-chopped-bowl` `chilli-t-chopped-bowl` `coriander-t-chopped-bowl` `sev-t-bowl` `peas-t-bowl` `keema-t-bowl`
**check:** same bowl throughout, all circles · the two chutneys clearly different (brown vs green) · the sev's thin strands aren't pink-tinged at the edges · no shadows.

### Sheet 5: dough, maani and samosa (top-down)

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 dough and pastry stages for a children's cooking game, seen from directly above, straight down (90 degrees), as they'd look lying on a worktop: round things as circles. Every stage is drawn fresh here so they match each other exactly in colour, lighting and scale.

Scale, consistent across the sheet: a dough ball about 5 cm; a rolled maani (a thin chapati) about 19 cm across; a samosa about 9 cm per side. The maani are the largest items and still fit inside their cells with space all round.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: a rough, shaggy lump of freshly mixed wholewheat dough, not yet kneaded; a smooth, soft, kneaded dough ball; a rolled-out raw maani, a thin, even, pale circle lightly dusted with flour; a raw maani rolled too thin with a ragged tear in it.
Row 2, left to right: a maani half-cooked, with a few light brown spots; a maani fully cooked and puffed up like a balloon, golden with brown spots; a burnt maani, dark brown and black patches; a long flat strip of raw pastry for a samosa.
Row 3, left to right: the same pastry strip with a small heap of potato and pea filling at one end; a folded raw samosa, a neat pale triangle; a fried samosa, crisp and golden brown with small bubbles; a burnt samosa, dark brown to black.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, soft matte dough and flaky pastry, clean simplified surfaces, slightly chunky, no outlines. Home cooking: maani thin and soft with brown spots.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No rolling pin, board, tawa, plate, hands or extra objects.
```

**save as:** `sheet-dough-t-v1.png`
**slices to:** `dough-t-rough` `dough-t-ball` `maani-t-raw` `maani-t-torn` `maani-t-half` `maani-t-puffed` `maani-t-burnt` `pastry-t-strip` `samosa-t-filled` `samosa-t-folded` `samosa-t-golden` `samosa-t-burnt`
**check:** the four maani are the same size and all circles · cooked stages go pale → spotted → puffed → burnt · the three samosas are the same triangle · nothing crosses into a neighbour's cell.

### Sheet 6: mishkaki pieces, raw, grilled and charred (top-down)

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 single pieces for threading onto a mishkaki skewer (East African grilled kebab) in a children's cooking game, seen from directly above, straight down (90 degrees). Every piece is about 3 cm across, all the same size, drawn fresh here so the raw, grilled and charred versions match exactly in shape and size.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One single piece per cell, centred, drawn large enough to read clearly (about 40% of the cell), with plenty of empty background all round it. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Columns, left to right: a cube of marinated lamb (orange-red marinade); a square piece of green bell pepper; a chunky piece of red onion (a few layers together); a quarter of a tomato.
Row 1: each piece raw.
Row 2: the same four pieces grilled: nicely browned with a few dark grill marks, juicy.
Row 3: the same four pieces charred: overcooked, blackened edges and patches.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the pieces as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, appetising, clean simplified surfaces, slightly chunky, no outlines. Halal lamb, clearly not pork.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No skewers, plates, grill, hands or extra objects.
```

**save as:** `sheet-mishkaki-pieces-t-v1.png`
**slices to:** `meat-t-raw` `pepper-t-piece-raw` `onion-t-piece-raw` `tomato-t-piece-raw` `meat-t-grilled` `pepper-t-piece-grilled` `onion-t-piece-grilled` `tomato-t-piece-grilled` `meat-t-charred` `pepper-t-piece-charred` `onion-t-piece-charred` `tomato-t-piece-charred`
**check:** each column is the same piece three times, same shape and size · grilled looks tasty, charred clearly overdone · the red onion isn't mistaken for meat · no shadows.

### Sheet 7: skewers, chips and serving (top-down)

Wooden skewers, woven and ceramic things only on this sheet: nothing shiny.

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 items for a children's cooking game, seen from directly above, straight down (90 degrees): round things as circles. Every item drawn fresh here.

Scale, consistent across the sheet: a skewer about 30 cm long, lying diagonally across its cell; a serving plate about 25 cm across; each chips heap about 10 cm. Items may be drawn a little smaller than true scale to fit, but keep them in proportion to each other.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One item per cell, centred, with empty background all round it; skewers lie corner to corner inside their own cell without touching its edges. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: one empty plain wooden bamboo skewer; the same skewer threaded with four raw marinated lamb cubes (orange-red); the same skewer with four grilled lamb cubes, browned with grill marks; the same skewer with four charred lamb cubes, blackened.
Row 2, left to right: a small heap of raw potato chips (pale, thick-cut sticks); a small heap of fried chips, crisp golden; a small heap of burnt chips, dark brown; a wide, shallow, empty serving bowl in matte cream stoneware with a thin indigo rim.
Row 3, left to right: the same bowl filled with chaat: chickpeas and potato cubes, topped with yoghurt, drizzles of brown tamarind and green chutney, chopped onion, coriander and a sprinkle of golden sev; an empty round white enamel plate with a speckled dark-blue rim; the same plate with two grilled lamb skewers, a heap of golden chips and a lemon wedge; a single grilled skewer threaded lamb, onion, green pepper, tomato.

Background: one perfectly flat, uniform magenta, hex #FF00FF, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The magenta is a keying colour, not part of the scene: it must not light, tint or reflect on anything. Light the items as if on a neutral white studio table, warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, appetising, clean simplified surfaces, slightly chunky, no outlines. Halal food, no pork, no alcohol.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No metal skewers, grill, hands or extra objects.
```

**save as:** `sheet-serving-t-v1.png`
**slices to:** `skewer-t-empty` `skewer-meat-t-raw` `skewer-meat-t-grilled` `skewer-meat-t-charred` `chips-t-raw` `chips-t-golden` `chips-t-burnt` `chaat-bowl-t-empty` `chaat-bowl-t-full` `plate-t-empty` `mishkaki-t-plated` `skewer-mixed-t-grilled`
**check:** skewers don't poke out of their cells · the four skewers are the same skewer · plates and bowls are circles · no shadows.

### Sheet 8: pots, pans, jugs and glasses (grey, not magenta)

Metal and glass can't go on magenta. This sheet uses mid-grey; tell Claude it's a grey sheet when you hand it back.

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 kitchen vessels for a children's cooking game, all empty unless stated.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One item per cell, centred, with plenty of empty background all round it; handles stay inside their own cell. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Rows 1 and 2 are seen from directly above, straight down (90 degrees), so every rim is a perfect circle and the inside walls just show:
Row 1, left to right: a steel saucepan with a long handle (for chai, about 16 cm across); a large round steel cooking pot with two small side handles (for daal, about 22 cm across); a small steel tadka pan with a short handle (about 12 cm across); a flat black iron tawa griddle with a short handle (about 26 cm across).
Row 2, left to right: a deep steel kadai frying pan with two loop handles, holding clear golden oil; a round steel thali plate with a raised rim; a small empty steel katori bowl; a round steel masala dabba, lid off, its seven small round cups filled with turmeric, red chilli powder, cumin seeds, mustard seeds, salt, cardamom pods and coriander seeds.
Row 3 is seen from the front, the camera at the item's mid-height looking about 10 degrees down, each standing on its base:
Row 3, left to right: a steel water jug with a handle and a spout; a steel milk jug with a handle; an empty small clear chai glass (a narrow "cutting" glass); the same glass full of milky, orange-brown chai.

Scale: keep them in proportion to each other (a chai glass about 9 cm tall, a jug about 18 cm tall).

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left, so the steel reflects soft warm light. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, brushed steel with gentle warm reflections, clean simplified surfaces, slightly chunky rounded shapes, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks, including on the pans. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No steam, spoons, food (except where stated), hands or extra objects.
```

**save as:** `sheet-vessels-v1.png`
**slices to (Claude cuts, grey method):** `saucepan-t` `pot-t` `tadka-pan-t` `tawa-t` `kadai-t-oil` `thali-t` `katori-t` `masala-dabba-t` `water-jug-f` `milk-jug-f` `glass-chai-f-empty` `glass-chai-f-full`
**check:** rows 1–2 straight down (rims are circles, not ovals) · row 3 front view, standing level · no writing on anything · flat grey background.

### Sheet 9: tools (grey, not magenta)

```
Generate an image, 1536×1024, landscape.

A sprite sheet of 12 kitchen tools for a children's cooking game, each lying on its own, seen from directly above, straight down (90 degrees). Thin parts (blades, handles) slightly thickened so they read at a small size.

Layout: an invisible grid of 4 columns and 3 rows of equal cells covering the whole image. One tool per cell, centred; long tools lie diagonally, corner to corner, inside their own cell without touching its edges. Nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: a kitchen knife with a steel blade and a pale wooden handle; a steel ladle; a flat steel spatula; a steel slotted spoon for lifting fried food.
Row 2, left to right: steel kitchen tongs; a steel teaspoon; a small steel tea strainer with a handle; a round wire frying basket with a handle.
Row 3, left to right: a thin, tapered wooden rolling pin (velan); a round wooden rolling board on short feet (chakla); a rectangular pale oak chopping board; a long wooden stirring spoon.

Scale: keep them in proportion to each other (the rolling pin about 35 cm, the knife about 28 cm, the teaspoon about 14 cm). Tools may be drawn smaller than true scale to fit, but in proportion.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. The grey is a plain backdrop, not part of the scene. Warm light from the upper left. NO shadows of any kind: no contact shadows, no cast shadows.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, brushed steel with warm reflections, pale oak, clean simplified surfaces, slightly chunky, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no flat vector style, no photorealism. No blur, vignette or bloom. No food, hands or extra objects.
```

**save as:** `sheet-tools-v1.png`
**slices to (Claude cuts, grey method):** `knife-t` `ladle-t` `spatula-t` `slotted-spoon-t` `tongs-t` `teaspoon-t` `tea-strainer-t` `chips-basket-t` `rolling-pin-t` `chakla-t` `board-t` `wooden-spoon-t`
**check:** every tool straight down, none at an angle from the side · rolling pin thin and tapered · the chakla and board are circles and rectangles, not skewed · nothing crosses a cell edge.

---

## 4. Backgrounds

**The layers rule:** a background has **no characters, no animals and nothing that moves or gets tapped** (no food, no loose pots or tools, no curtains, plants, fans, clocks, bunting or lanterns). All of those are separate sprites, placed by the game. The game stage is 16:9, and ChatGPT's widest size is 3:2, so every prompt keeps the important content in a central band and Claude crops the top and bottom strips.

**Set dressing restraint:** at most one or two cultural nods per scene. Modern home, Kutch and East African hints, never clutter.

One chat per background. Relights (4.6) go in the same chat.

### 4.1 The worktop, top-down (base for every cooking station)

**attach:** style anchor.

```
Generate an image, 1536×1024, landscape.

A background for a top-down cooking game: an empty kitchen worktop seen from directly above, straight down (90 degrees). No walls, no splashback, no horizon, no cupboards: the worktop fills the whole frame edge to edge.

The worktop is warm white marble with soft, quiet, gentle veins and a faint sheen, calm and even all over, so food and tools placed on it stand out. A soft, faint patch of window sunlight falls across the upper-left area. The lower 20% of the image is plain, calm marble with nothing in it (hands will enter from the bottom edge). The top and bottom 8% of the image will be cropped away, so keep the interest in the middle.

Completely empty: no board, no food, no pots, no utensils, no cloth, no crumbs, no objects of any kind.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable marble, clean simplified surface, no outlines. Warm late-morning sunlight from the upper left.

Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare. No people, hands or animals.
```

**save as:** `bg-cook-worktop-t-v1.png`
**check:** truly straight down, no wall or edge of the worktop anywhere · completely empty · veins quiet, not busy · light from the upper left.

### 4.2 The hob, top-down

**attach:** style anchor, the approved `bg-cook-worktop-t-v1.png` (so the marble matches).

```
Generate an image, 1536×1024, landscape.

A background for a top-down cooking game: a modern two-burner gas hob set into the same marble worktop as the attached worktop image, seen from directly above, straight down (90 degrees). No walls, no splashback, no horizon.

The hob is a black glass or brushed steel panel about 60 by 50 cm, centred slightly above the middle of the image, with two round gas burners side by side (left and right), each with a round cast-iron pan support. The burners are OFF: no flames. The front strip of the hob, below the burners, is plain and empty: draw NO control knobs (they're added separately). Warm white marble all round, matching the attached worktop. The lower 20% of the image is plain marble with nothing in it (hands will enter from the bottom edge). The top and bottom 8% of the image will be cropped away.

Completely empty: no pans, pots, food, utensils, cloths or objects of any kind.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable steel, cast iron and marble, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left.

Do not add any text, letters, numbers, logos, dials or markings. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare. No flames, people, hands or animals.
```

**save as:** `bg-cook-hob-t-v1.png`
**check:** straight down, both burners true circles · no knobs, no flames, no pans · marble matches the worktop · lower fifth clear.

### 4.3 Nani's kitchen, eye level (island and pantry shelves)

**attach:** style anchor, `assets/cook/bg/service.jpg` (the setting and palette to match).

```
Generate an image, 1536×1024, landscape.

The background for the main kitchen scene of a children's game: Nani's kitchen, a bright, modern home kitchen with gentle Kutch accents, seen from a standing adult's eye height, looking straight ahead (one-point perspective, verticals vertical). The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- A long kitchen island runs across the whole width of the lower part of the image. Its top is warm white marble, its top edge nearly horizontal at about 67% of the image height from the top. The island top is completely clear, flat and evenly lit. Its front is plain pale oak panels.
- Behind the island, the back wall is warm limewash cream. Across the left half of the back wall: three long open pale oak shelves, evenly spaced, completely empty, their top surfaces just visible so things could stand on them. No shelf at the very top of the image.
- The centre-right of the back wall, just above the island, is a plain calm stretch of limewash wall (a person will stand there, and her head goes against it). Keep it free of anything red.
- Upper left: a window with the late-morning sun coming in, no curtain. Sage green cabinets low on the far right. One small brass detail (a brass handle rail) and, as the one cultural nod, a small mirror-work (abhla) frame on the wall at the far right, empty inside.

Completely empty of anything that moves or can be picked up: no food, jars, pots, pans, utensils, plants, curtains, clocks, fans, lanterns or decorations. No people, no animals.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable marble, oak, limewash and brass, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right. Bright, warm and calm; nothing cluttered.

Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-nani-kitchen-e-v1.png`
**check:** island top clear, level, at about two thirds down · shelves empty with their tops visible · no red behind where Nani's head will go · no curtains, plants or loose objects.

### 4.4 Big Ma's sewing room, eye level

**attach:** style anchor, the approved `bg-nani-kitchen-e-v1.png` (so it feels like the same family's home).

```
Generate an image, 1536×1024, landscape.

The background for a scene in a children's game: Big Ma's room, a warm, homely bedroom with a sewing corner, in the same family home and style as the attached kitchen. Seen from a standing adult's eye height, looking straight ahead (one-point perspective, verticals vertical). The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- A wide wooden sewing table runs across the lower part of the image, its top edge nearly horizontal at about 67% of the image height from the top. Its top is completely clear, flat and evenly lit. On its right end, a simple classic sewing machine, fixed in place.
- Behind the table in the centre, a plain wooden chair with a small bandhani cushion (the one cultural nod), with a calm, plain stretch of soft cream wall above it (an elderly woman will sit there and her head goes against it). Keep that wall area plain and free of maroon or red.
- On the left of the back wall, a small open wooden wall rack with empty pegs and one empty shelf (thread reels will be added later). Upper left, a window with soft late-morning sun, no curtain. A carved wooden chest low on the far left.

Completely empty of anything that moves or can be picked up: no thread reels, fabric, scissors, pin cushions, clothes, baskets, plants, clocks or ornaments. No people, no animals.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable wood and cotton, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right. Warm, cosy and calm; nothing cluttered.

Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-bigma-room-e-v1.png`
**check:** table top clear and level · the wall behind the chair is plain and not maroon · no loose sewing things (only the fixed machine) · cosy, not cluttered.

### 4.5 The bazaar stall, eye level

**attach:** style anchor.

```
Generate an image, 1536×1024, landscape.

The background for a shopping scene in a children's game: a fruit and vegetable stall in an East African town bazaar with a Kutchi family running it, seen from the customer's side at a standing adult's eye height, looking straight ahead, the horizon at about 55% of the image height. A traditional stall is fine. The top and bottom 8% of the image will be cropped, so keep everything important in the middle band.

- A long, low wooden counter runs across the whole width of the lower middle of the image, its top edge nearly horizontal at about 62% of the image height from the top. Along the counter top, one row of ten small, shallow, EMPTY display holders, evenly spaced, alternating woven baskets and low wooden trays.
- The counter front is plain wooden planks. The ground in front is plain packed earth, no mats, no baskets.
- Behind the counter on the right third, open space where the shopkeeper stands, against a plain whitewashed wall.
- Behind: a whitewashed back wall and a fixed striped cloth awning across the top. As the one cultural nod, part of a carved dark-wood Swahili-style door with brass studs at the far left.

Completely empty of produce and anything that moves: no fruit, vegetables, sacks, scales, bunting, lanterns or signs. No people, no animals.

Style: match the attached style anchor exactly: a stylised 3D animated-feature-film look, soft global illumination, believable wood, woven fibre, whitewash and cloth, clean simplified surfaces, no outlines. Warm late-morning sunlight from the upper left; soft shadows to the lower right.

Do not add any text, letters, numbers, logos or watermarks, including on the awning or any sign. No outlines, no cel shading, no photorealism. No blur, vignette or lens flare.
```

**save as:** `bg-bazaar-stall-e-v1.png`
**check:** ten holders, all empty · no produce anywhere, including the edges · no writing on the awning · plain wall where the shopkeeper's head goes.

### 4.6 Evening and night versions of an approved background

Only once a day background is approved. In **the same chat**, attach the approved day image and send one of these. The game swaps them in place, so nothing may move.

**attach:** the approved day background.

Golden evening:

```
Edit the attached image. Same image, same composition, same camera: every object, edge and surface stays exactly where it is, the same size and shape. Change only the lighting to golden evening: a low, warm, orange sun from the upper left, longer soft shadows to the lower right, a warm rim of light on edges facing the window, and a slightly deeper, warmer sky or light through the window. Do not add, remove or move anything. No text.
```

Night:

```
Edit the attached image. Same image, same composition, same camera: every object, edge and surface stays exactly where it is, the same size and shape. Change only the lighting to night: the window shows a dark blue night outside; the room is lit by warm lamplight from above, with soft warm pools of light and a cool blue fill from the window outside those pools; shadows soft and short. Do not add, remove or move anything, and don't draw any lamp that isn't already there. No text.
```

(For the worktop and hob, which have no window: "Change only the lighting to night: warm overhead lamplight in a soft pool over the centre, cooler and darker towards the edges.")

**save as:** the day name with `-evening` or `-night` added, e.g. `bg-nani-kitchen-e-evening-v1.png`, `bg-nani-kitchen-e-night-v1.png`
**check:** flick between it and the day image: nothing has moved, grown or appeared · the island, table or counter top is still clear and readable · the light direction fits the state · no new lamps, people or objects.

**If it drifts** (things move or change), regenerate; don't try to nudge it back. If it keeps drifting, send it to Claude anyway: small shifts can be realigned, and Claude will say if it can't be used.
