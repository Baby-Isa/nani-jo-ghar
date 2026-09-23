# Nani jo Ghar: art direction options (making it look modern)

**Date:** 23 Sept 2026
**Trigger:** Zafar's wife said the game "looks really old, like games when the App Store first came out".
**Goal:** keep the Kutchi cultural immersion, but make it look like a game from 2026 that a child *wants* to play.
**Status:** exploration. Nothing decided yet. Generate the comparison image (section 5), pick a direction, then run a one-scene style test before regenerating everything.

---

## 1. What makes it look old

She's right, and it's not one thing. It's a stack of choices that were fashionable around 2010–2013 (early App Store, Facebook games, hidden-object games):

| What it looks like now | Why that reads as "2011" |
|---|---|
| **Semi-realistic, airbrushed characters** (Nani's face is near-photographic, with a glossy "caricature" finish) | Exactly the look of 2010-era Facebook and mobile games. Modern kids' games use stylised faces with simple shapes and big readable expressions |
| **Style clash:** near-real Nani, glossy cartoon fruit, painterly rooms | Nothing belongs to the same world, so it reads as clip-art assembled together |
| **Glossy fruit with shine spots, gradients and thick black outlines** | The "Bejeweled / clip-art" look |
| **Skeuomorphic textures everywhere:** wood grain on every surface, a parchment-texture sidebar | iOS 6-era skeuomorphism. Modern design uses flat colour with *subtle* texture |
| **Brown and orange everywhere** (wood, terracotta floor, wooden counter, wooden shelves) | Muddy, low contrast, no focal point. Nothing pops |
| **Flat, straight-on "stage" camera with empty, even lighting** | Hidden-object-game staging. No depth, mood or light |
| **UI:** the system font (Segoe UI / Roboto), emoji icons (📖 🧩), default buttons | Looks like a prototype, because it is |
| **Black letterbox bars** | Looks unfinished |
| **Stiff motion:** things slide or swap with little easing, bounce or reaction | Motion is half of what makes a game feel modern |

**Also worth knowing: the current "Kutch" isn't very Kutch.** It's a generic Indian-ish kitchen. Real Kutch has a strong, *graphic* visual culture:
- **Bhunga** round mud houses with conical thatch roofs.
- **Lippan kaam**: white mud relief with inset mirrors.
- **Ajrakh** block print in indigo and madder.
- **Bandhani** tie-dye dots.
- **Rogan** painting.
- **Mirror-work** embroidery.

These are flat, pattern-based and geometric, which is exactly what modern design likes. **Leaning into real Kutch craft is the route to both "more cultural" and "more modern" at the same time.**

---

## 2. What any direction has to survive (technical and production constraints)

- **ChatGPT has to make every asset consistently:** about 5–10 backgrounds, about 60 food items (fruit, veg, spices), 2–6 characters with expression edits, plus containers and icons. **Simpler, flatter styles stay consistent across many generations; semi-realistic ones drift.** This matters more than anything else.
- **The expression pipeline** (`build/expressions.py`: blink and mouth edits patched onto one base image) works best on clean, flat-shaded faces. Fewer shading gradients mean invisible seams.
- **Items must read at about 90px on a phone.** Bold simple silhouettes and flat colour are recognisable small; glossy detail turns to mush.
- **Layered 2D:** background, character, counter front, items, containers, each on a transparent layer. Any 2D style works. **Cut-paper / layered styles suit it especially well**, because the layers *are* the look, and gentle parallax comes almost free.
- **No text in images** (Game Design rule). Characters stand behind counters (Layout contract v2).
- **The code carries over.** Positions live in `data/scenes/*.json` and are re-measured per background with `build/place_preview.py`. A style change is **art regeneration plus re-measuring**, not a rebuild. The basket and bowl mechanic, the counters, speech bubbles, quantities, tests and expression pipeline all stay.

---

## 3. Cheap fixes that modernise it whatever style we choose

These cost no new art and are worth doing regardless:
1. **A real font:** a friendly rounded display font. Good fit: **Baloo 2** (free, Google Fonts). Its sister family **Baloo Bhai 2** covers Gujarati script, a nice cultural tie if Gujarati script is ever shown.
2. **Custom icons instead of emoji** (already specified in `docs/sidebar-design.md`).
3. **A flat, clean UI:** solid cream panel, no parchment texture, generous rounded corners, soft shadows.
4. **No black bars:** fill the letterbox with a blurred copy of the scene (already a Layout contract v2 rule).
5. **Motion polish:**
   - squash and stretch on taps;
   - a springy bounce when things land;
   - a small celebration on success, using **marigold petals or bandhani dots**, not generic confetti;
   - characters reacting (a nod, a lean in);
   - smooth transitions between scenes.
6. **Colour grading:** a warm light pass and a gentle vignette, so every scene has a focal point (Phaser's built-in post effects).
7. **Sound:** soft, tactile UI sounds and ambient scene audio. Hugely underrated for "feels modern".

---

## 4. Six directions

All six keep the Kutch palette (indigo, madder red, marigold, whitewash, terracotta) and Kutch craft motifs.

| | Direction | What it looks like | Modern references | AI consistency | Redo cost |
|---|---|---|---|---|---|
| **A** | **Flat folk graphic** | Flat shapes, no outlines, limited palette, ajrakh and bandhani as flat pattern fills, subtle paper grain | *Venba* (a 2023 cooking game about a Tamil family; the closest match to this project), Sago Mini, Headspace illustrations | ★★★★★ | Everything, but fastest to regenerate |
| **B** | **Cut-paper diorama** | Layered paper cut-outs with soft drop shadows between layers, a light "papercraft" texture; Lippan mirror sparkle | *Tearaway*, Paper Mario, shadow-box art | ★★★★☆ | Everything; the layers become the look and parallax comes free |
| **C** | **Modern storybook gouache** | Textured gouache or watercolour, restrained palette, soft directional light, simple stylised faces | *Alba: A Wildlife Adventure*, modern picture books, gentle Ghibli | ★★★☆☆ | Closest to now: restyle, don't reinvent |
| **D** | **Soft 3D clay / toy** | Rounded "claymation" 3D renders, soft studio light, chunky proportions | Toca Boca, Animal Crossing, Duolingo 3D | ★★★☆☆ | Everything; very "2026 kids", but risks looking generic |
| **E** | **Clean cel-shaded cosy** | Crisp clean lines, flat two-tone shading, warm colour-graded light, expressive faces | *A Short Hike*, *Spiritfarer*, cosy anime-lite | ★★★★☆ | Everything |
| **F** | **Lippan & mirror graphic** | Bold whitewashed Bhunga interior, Lippan relief patterns and mirrors as the main decoration, very graphic and bright | Kutch craft itself, museum-poster design | ★★★★☆ | Everything; the most distinctive and most "Kutch" |

**My shortlist:**
- **A** (flat folk): safest, most consistent, closest to *Venba*.
- **B** (cut-paper): most distinctive, and it suits our layer system.
- **F** can be *combined* with A or B as the set dressing: use real Bhunga and Lippan interiors whichever rendering style wins.

**On characters:** whichever direction wins, Nani and the shopkeeper need **stylised faces** (simple shapes, bigger eyes, readable expressions) instead of the near-photographic look. That's the single biggest "old" signal. It also makes the blink and mouth edits cleaner.

---

## 5. ChatGPT prompts

### 5.1 One comparison image with all six directions

Attach the current kitchen screenshot and Nani's image as references.

> Create ONE image: a 3×2 grid of six panels, each panel 16:9, separated by thin white gutters. Every panel shows **the same scene and composition** in a different art style, so the styles can be compared side by side. Put only a small capital letter (A to F) in the top-left corner of each panel; no other text anywhere.
>
> **The scene (identical in all six):** a child's-eye view of Nani's kitchen in a village in Kutch, Gujarat, India. An older South Asian grandmother (red headscarf, round glasses, cream kurta with red embroidery; see the attached reference for who she is, NOT for the style) stands centre-right **behind a kitchen counter** that hides her from the waist down. She smiles and gestures. Behind her, the back wall has **four long shelves** with a few fruits and small clay jars, and there are gaps on the shelves. On the counter in front of her sits an empty brass bowl. In the foreground, bottom-centre, the top of a woven basket that the player is holding, with two oranges and a pear inside. A small window with daylight. On the right edge, a slim cream interface panel (no text, just three rounded cards with coloured dots). Palette in every panel: indigo, madder red, marigold yellow, whitewash, terracotta.
>
> **The six styles:**
> - **A, flat folk graphic:** flat vector shapes, no outlines, limited palette, ajrakh block-print and bandhani-dot patterns as flat fills, subtle paper grain; like the game *Venba* or Sago Mini.
> - **B, cut-paper diorama:** everything made of layered paper cut-outs with soft shadows between the layers, a light paper texture, depth like a shadow box; like *Tearaway*.
> - **C, modern storybook gouache:** textured gouache painting, restrained palette, soft warm directional light, simple stylised faces; like a modern award-winning picture book or *Alba: A Wildlife Adventure*.
> - **D, soft 3D clay toy:** rounded claymation-style 3D, soft studio lighting, chunky friendly proportions; like Toca Boca or Animal Crossing.
> - **E, clean cel-shaded cosy:** crisp clean lines, flat two-tone shading, warm golden-hour light, expressive face; like *A Short Hike* or *Spiritfarer*.
> - **F, Lippan and mirror graphic:** a round whitewashed Bhunga hut interior with Lippan-kaam white mud relief and small inset mirrors on the walls, bold graphic shapes, bright and clean, very Kutch.
>
> Make all six look like a polished, modern 2026 mobile game for children aged 4–10: clean, bright, inviting, with a clear focal point on the grandmother. Stylised friendly faces, not realistic.

**If the grid comes out muddled** (six detailed panels is a lot for one image), run the same prompt **once per style** instead. Replace the grid paragraph with "Create one 16:9 image" and keep only that style's line. Six separate images compare better anyway.

### 5.2 Once a direction is chosen: the style-lock test

Before regenerating everything, make **one complete scene** in the chosen style:
- the kitchen background (with the counter drawn in, and empty shelves with clear surfaces);
- Nani (neutral pose, upper body, transparent background);
- six fruit (transparent, one per image);
- the basket and the bowl (each as back and front layers);

then drop them into the game and playtest. Only if it holds up in motion, on a phone, move on to the rest.

---

## 6. What gets redone

| Asset | Redo? | Notes |
|---|---|---|
| Backgrounds (kitchen, bazaar, spice cupboard, sitting room, hub) | Yes | Few in number. Follow the background art brief in Layout contract v2 |
| Characters (Nani, shopkeeper) | Yes | Then re-run the expression pipeline (`build/expressions.py`) on the new base images |
| Food items (about 60) | Yes | Generate in consistent batches (one item per image, the same style line every time) |
| Containers (basket, bowl, tray) and counter fronts | Yes | New, in the chosen style |
| UI icons | Yes | Already planned (sidebar spec) |
| **Code, logic, scene system, tests, pipelines** | **No** | Positions are re-measured per new background; everything else carries over |

Now is the right time: Chapter 1 has only a handful of backgrounds and one errand built. Every errand added in the old style would be more to redo later.

---

## 7. Round 1 results and feedback (23 Sept 2026)

**What came back:** ChatGPT produced the six-panel grid, but **all six looked nearly the same**: the same painterly render with small tweaks. Two reasons:
- We attached the old art as a reference, and it anchored everything.
- One image with six styles pushes the model to average them.

**Lesson:** don't attach the old art for style (describe the characters in words instead), and generate each style **separately**.

**What Zafar and his wife liked:**
- **Panel D (soft 3D):** the 3D look and the "realism" of the character.
- **Panel F (Lippan background):** the background, but as a **modern kitchen**: limewash walls, marble counter tops, with **Kutch as accents, not in your face** (the brass bowl, picture frames, a cushion, the curtain).
- **Sago Mini:** also liked. Flat, friendly, kid-appealing.
- **Food-making / restaurant games** (sushi and similar): some of our modes are like these, and they're fun and addictive.
- **Venba:** Zafar liked it; his wife thought it looked old. Zafar also likes **Firewatch**: flat, but more grown-up.
- **Top App Store games:** they look like template churn, but they're popular. The game has to win a fight for attention.
- **Hands holding the basket** in the foreground (ChatGPT added this): keep it. It makes the first-person basket feel real.

**Decision leaning, not final:**
- **Stars, points and streaks: now a yes in principle** ("if it gets kids playing, the attention is spent in a good place"). This supersedes the Game Design doc's "no points, stars, XP or streaks" rule once designed. The softer designs (embroidered stars on quilt patches, a streak that never punishes) are in the chat of 23 Sept 2026.
- **Setting:** home scenes become a **modern kitchen with Kutch accents**. The bazaar can stay more traditional.
- **Rule:** modernness runs through everything; the culture is a hint. **The language is the main cultural thing.**

## 8. Claude's view after round 1

1. **Two separate questions are tangled together:** the rendering (flat 2D ↔ soft 3D) and the setting (traditional ↔ modern with Kutch accents). The setting is now decided: modern with accents. Round 2 only has to settle the rendering.
2. **What makes cooking and restaurant games addictive is mostly "juice", not the art style:** satisfying bounces, pops, sounds, a clear goal, a timer, stars at the end. That's code and sound design, and it works in any style.
3. **Best structural reference: *Good Pizza, Great Pizza*.** It's a flat-styled food game with the customer standing **behind a counter** and the player making food in front: almost our exact layout, and a proven hit.
4. **Production reality:**
   - **Flat** is the most consistent style for ChatGPT across about 60 items, and the only one where **characters built from separate parts** (proper animation, see the playtest doc section 4.1) become realistic later.
   - **Soft 3D** looks richer in a still image, but animation stays limited to swapping frames (blink and mouth), and items drift in style more often.
   - Both work with the current code.
5. **Aim at 6–10 year olds and their parents,** not toddlers. Sago Mini is aimed at 2–5 and can feel babyish once reading and counting come in. Firewatch is for adults. The sweet spot is flat or soft-3D, *polished*, with warm light.

## 9. Round 2 prompts (generate each one separately)

**Don't attach the old art.** For each style, paste the shared scene text below, then that style's line.

**Shared scene (paste first, every time):**
> Create one 16:9 image: a screenshot from a polished, modern 2026 mobile game for children aged 6–10 and their parents. Child's-eye view of a grandmother's kitchen in a modern home: soft limewash walls, a white marble kitchen island with a pale wood base, clean modern shelves on the back wall with a few fruits and small jars, and gaps on the shelves. The Kutch (Gujarat, India) culture is in small accents only: a brass bowl on the island, a small framed Kutch mirror-work embroidery on the wall, an ajrakh-print cushion on a stool, a brass water pot. A warm, friendly grandmother in her sixties (South Asian, red headscarf, round glasses, cream kurta with red embroidery) stands behind the island, visible from the waist up, smiling and gesturing towards the bowl. A blank white speech bubble near her. In the foreground, bottom-centre, the player's two small hands hold a woven basket with two oranges and a pear inside. On the right edge, a slim clean cream interface panel with three rounded cards (coloured dots only, no text). Bright, clean, inviting, a clear focal point on the grandmother. No text anywhere.

**Then one style line per image:**
- **R2-A, Sago Mini flat:** ultra-simple flat vector style like Sago Mini World: bold flat colours, geometric rounded shapes, no outlines, no gradients, very simple dot-eyed friendly face.
- **R2-B, flat with soft shading:** flat vector shapes with gentle soft shading and soft shadows, clean and polished, like *Good Pizza, Great Pizza* or Duolingo's illustrations: expressive simple faces.
- **R2-C, atmospheric flat:** grown-up flat illustration like the game *Firewatch*: limited harmonious palette, big simple shapes, strong warm sunlight through the window with long soft light shapes, a hint of atmosphere.
- **R2-D, bright modern illustration:** like the game *Venba*, but brighter, cleaner and more saturated: flat colour with subtle texture, crisp shapes, a contemporary palette.
- **R2-E, soft 3D clay toy:** rounded soft-3D "toy" render like Toca Boca or Animal Crossing: chunky friendly proportions, soft studio lighting, matte materials.
- **R2-F, stylised 3D animated film:** high-quality stylised 3D like a modern animated feature film: appealing proportions, expressive eyes, soft global illumination, realistic materials (marble, brass, wicker), warm and cosy.

**Then:** put the six results side by side (or send them to Claude to make a labelled comparison sheet). Pick one or two to take into the style-lock test (section 5.2).

## 10. Round 2 results (23 Sept 2026)

Nine images came back, but only six were different (two were duplicated). They are saved in `docs/art-direction/round-2/`, named after the style each one matches. The labelled comparison sheet, with every image, is a private claude.ai artifact: https://claude.ai/artifact/5KQzRDp2z2Hos7Z3Mt42JC

The right-hand panels and speech bubbles are placeholders built in code, so they are not scored. Scores are out of 5.

| | Style | Looks | Works in game | Feasible | Verdict |
|---|---|---|---|---|---|
| **R2-E** | Soft 3D | 5 | 4 | 3 | **Pick, if it passes the style-lock test.** The most polished and modern, and the closest to what was liked in round 1. The risk is keeping about 60 items consistent, with light baked into every sprite |
| **R2-D** | Bright illustration | 4 | 4 | 4 | **Fallback.** Nani looks at the bowl and points, so her pose teaches the task; open eyes suit `expressions.py`; outlines keep generations consistent. Clear the busy counter |
| R2-A | Sago Mini flat | 3 | 5 | 5 | Drop: the easiest to make, but it reads as aimed at 2–5, not 6–10 |
| R2-B | Soft-shaded flat | 4 | 3 | 4 | Drop: low contrast (cream on cream), forgettable |
| R2-F | Stylised 3D film | 4 | 2 | 2 | Drop: cluttered shelves compete with the items, Nani is small in frame, and it is the hardest to reproduce |
| R2-C | Atmospheric flat | 4 | 2 | 2 | Drop: the orange light hides the oranges and brings back "brown and orange everywhere". Kept only as an idea for an evening colour grade |

**Next:** run the section 5.2 style-lock test on R2-E. Generate the six fruit in **three separate ChatGPT chats**, compare them at 90px, and blink-test an open-eyed Nani. If the fruit don't clearly look like one set, or the blink shows seams, run the same test on R2-D.
