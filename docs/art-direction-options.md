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
