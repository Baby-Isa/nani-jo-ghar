# Nani jo Ghar — Chapter 1 Art Prompts

*Ready-to-paste ChatGPT prompts for every new background and prop Chapter 1 (The guests are coming) needs, written against layout contract v2 in the Roadmap doc. Supersedes the kitchen and bazaar prompts in the Image Prompt Sheets doc.*

Sep 23, 2026 · @Someone

## What Chapter 1 needs

| Errand | Scenes | Props and sprites | Status |
| --- | --- | --- | --- |
| 1. Fruit bowl (Shopping) | Kitchen v3, bazaar stall v3 | Basket, brass bowl | Kitchen v3 and bazaar v3 **done, kept**. Fruit, Nani, shopkeeper already done |
| 2. Daal for dinner (Cook-along) | Kitchen v3, spice cupboard | Cooking pot, chopping board, stirring spoon | Spice cupboard **done, kept**. Vegetables, spices, lentils (store cupboard sheet) already done |
| 3. Set the dastarkhwan (Put it there) | Sitting room with dastarkhwan | Serving tray, tableware sheet | Sitting room **done, kept** |
| Story dressing, all three | Kitchen v3 (the hub) | Eid decorations sheet | **Done, kept** |

Seven images in total: four backgrounds and three prop sheets. **All four backgrounds done. The Eid decorations sheet is done.** Remaining: containers and tableware, both blocked on the basket angle test (Build Brief v4, section 1).

## How to use

1. Generate in the order below. Each prompt says which existing image to attach for style.
2. Every prompt already ends with "Create a new image, matching the style of the attached image exactly." Attach, paste, go.
3. Backgrounds are 16:9. If ChatGPT returns a different ratio, regenerate rather than crop: a cropped background breaks the measured layout.
4. Check each result against the "Reject if" line before keeping it. Painted food near a tappable surface is the most common failure.
5. Drop finished images back into the chat or repo. Claude slices, measures and places them.

## What changed from the first backgrounds

Per layout contract v2: a counter, island or bolster runs across the scene so characters stand behind something; the camera sits slightly higher, looking down onto the work surface; every tappable surface is clear, flat and evenly lit; no painted food anywhere near it; no rugs or clutter in the foreground, where the carried basket or tray sits; and the quiet left strip is no longer needed, since the sidebar now has its own column.

## 1. Nani's kitchen v3 (the hub, Errands 1 and 2): done, kept as v3

Saved as `assets/backgrounds/bg-nani-kitchen-v3.png`.

> Interior of a warm, simple kitchen in a Muslim home in Kutch, India, seen from a standing adult's eye height, looking slightly down. A long, plain wooden kitchen island runs across the whole width of the lower part of the scene, its top edge at about 60% of the image height. The island's top surface is clear, flat, evenly lit and completely empty; its front face is plain wooden panels. On the right third, behind the island, open floor space where a person would stand, with a clay stove against the back wall. On the back wall, across the left two thirds, four long open wooden shelves, evenly spaced from near the top of the image down to just above the island, all completely empty, with flat plain tops. On the far left of the back wall, a small closed wooden wall cupboard with carved doors. Upper right: a window with a patterned ajrakh curtain, a few brass and copper pots hanging along the far right edge, and a small plain patch of whitewashed wall between the shelves and the window. Whitewashed walls, terracotta floor, no rug. No food, no produce, no jars, no people, no text or writing of any kind. The far left and far right edges are calm and uncluttered. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. 16:9 landscape. Create a new image, matching the style of the attached image exactly.

**Review of the kept image (23 Sep 2026), and how it's used.** Passes every reject check. Two quirks are absorbed in layout and code, not by regenerating:

| Area | Decision |
| --- | --- |
| **Top shelf** | Sits at the very top of the frame, so an item standing on it would be cut off. It becomes the **Eid shelf**: hub decorations hang from it or run along its edge (lantern, bunting, lights). No pantry items on it |
| **Pantry** | The **lower three shelves**, about 8 slots each, ~24 in total. Chapter 1 needs about 12 food items; Arc 1 fits comfortably |
| **Island top** | Nani's bowl (Errand 1) and the cooking pot (Errand 2) sit here, as destination containers |
| **Island front** | The carried basket sits over it, bottom-centre, during errands. **In the hub, the quilt drapes over it**: the largest plain area in the scene, and the basket isn't shown in the hub |
| **Nani** | Behind the island, head over the plain wall between the shelf ends and the curtain, so her red headscarf doesn't sit against the red curtain. If it still blends, the build script shifts the curtain's reds towards indigo (still authentic ajrakh) |
| **Stove** | Beside Nani at the island's right end, for the "pats the stove" story beat |
| **Carved cupboard, top-left** | Tap target that opens the spice cupboard close-up |
| **Size** | Resize to exactly 1600×900; the source is a fraction off 16:9, with no visible stretch |

## 2. Bazaar produce stall v3 (Errand 1): done, kept as v3

Saved as `assets/backgrounds/bg-bazaar-stall-v3.png`.

> Interior of a fruit and vegetable stall in a bazaar in Kutch, India, seen from the customer's side at a standing adult's eye height, looking slightly down. A long, low wooden counter runs across the whole width of the lower middle of the scene, its top edge at about 60% of the image height. Along the counter top, a single row of about ten small, shallow, empty woven baskets and low wooden trays, evenly spaced from left to right, each completely empty. The counter's front face is plain wooden planks. Behind the counter on the right third, open space where the shopkeeper stands. Behind: a whitewashed wall, brass hanging scales on the left, a blank chalkboard, a brass lantern, a striped cloth awning across the top. No produce anywhere in the scene, including the edges: no fruit, vegetables, garlic, chillies or sacks. The floor in front of the counter is plain packed earth, with no rug and no baskets. The far left and far right edges are calm and uncluttered. No people, no text or writing of any kind. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. 16:9 landscape. Create a new image, matching the style of the attached image exactly.

**Review of the kept image (23 Sep 2026), and how it's used.** Passes every reject check. No painted produce anywhere, which fixes the biggest playtest problem.

| Area | Decision |
| --- | --- |
| **Display row** | Ten holders in one row on the counter, woven baskets and wooden crates alternating: **10 shop-display slots**, one per holder. Items sit in the holders with a contact shadow |
| **Shopkeeper** | Behind the counter between the chalkboard and the lantern, head over the plain wall. The holders run the full width, so the two or three right-hand holders sit in front of his chest; items there are drawn in front of him, like a seller behind his produce (it read naturally in playtest 2). Taps are unaffected: the character is never interactive |
| **Counter front** | The carried basket sits over it, bottom-centre |
| **Scales** | Scenery now; a future weighing mechanic (see the playtest review's "counter as an interaction stage") can use them |
| **Chalkboard** | Scenery; quantities live on the recipe list now, per contract v2 |
| **Masking** | The old "mask out painted tomatoes and chillies" step no longer applies |
| **Size** | Resize to exactly 1600×900, as with the kitchen |

## 3. Spice cupboard close-up (Errand 2): done, kept as v1

Saved as `assets/backgrounds/bg-spice-cupboard-v1.png`.

> Close-up of the inside of an open wooden spice cupboard in a Muslim home in Kutch, India, seen straight on, as if standing right in front of it. The two carved wooden doors are open at the far left and far right edges, framing the scene. Inside, three long, evenly spaced wooden shelves across the full width, each completely empty, with flat, plain, evenly lit tops and room for six small bowls on each shelf. The top shelf sits well below the top edge of the image, with clear space above it. The back wall of the cupboard is painted deep indigo with a faint block-print pattern. No jars, no bowls, no spices, no food, no people, no text or writing of any kind. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. 16:9 landscape. Create a new image, matching the style of the attached image exactly.

**Review of the kept image (23 Sep 2026), and how it's used.** Passes every reject check.

| Area | Decision |
| --- | --- |
| **Shelves** | Three full-width shelves, **6 slots each, 18 in total** for the 16 spices, with room for 7 per shelf if ever needed. Spacing is generous, so spice sprites can be drawn larger than on the pantry |
| **Dark spices** | Cloves, black peppercorns and mustard seeds have less contrast against the indigo. Their bowls and contact shadows help; if any still read poorly in the preview, they take the end slots, where the cupboard's wooden sides sit behind them |
| **Cupboard floor, bottom strip** | Not a fourth row. The carried container sits here, bottom-centre, as in every scene |
| **Character** | None. Nani's voice comes from a speech bubble at the edge of the scene |
| **Leaving** | Back to the kitchen through the sidebar, the same way "go to the bazaar" works, never by tapping the painted doors |
| **Size** | Resize to exactly 1600×900 |

## 4. Sitting room with dastarkhwan (Errand 3): done, kept as v1

Saved as `assets/backgrounds/bg-sitting-room-v1.png`.

> A simple sitting room in a Muslim home in Kutch, India, seen from a standing adult's eye height, looking down at the floor at a steep angle. A long rectangular dastarkhwan cloth, plain cream in the centre with a thin madder-red and indigo border, lies flat on the floor across the middle of the scene, completely empty and evenly lit. Along the far side of the cloth, a row of large floor cushions and a long low bolster, tall enough to hide the lower half of someone kneeling behind it, with open space behind the right third. The wall behind the right third is plain, with no curtain or red fabric. Whitewashed walls, a low window with a patterned curtain on the left, a small high shelf on the wall. Plain terracotta floor in the foreground, with no rug near the bottom of the image. No food, no dishes, no people, no text or writing of any kind. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. 16:9 landscape. Create a new image, matching the style of the attached image exactly.

**Review of the kept image (23 Sep 2026), and how it's used.** Passes every reject check.

| Area | Decision |
| --- | --- |
| **Dastarkhwan** | Large, empty, plain cream with a thin border: the "put it there" surface. Hotspots are measured onto the cloth (a place setting per person along the near and far edges, serving dishes down the middle) |
| **Nani** | The cushions sit against the wall, so there is no space behind the bolster. Nani sits on the cushions instead: upper body over the plain wall on the right, lower body hidden by a **cut-out of the right-hand cream cushion drawn in front of her** (the same technique as the counter overlay in playtest 2). The cream cushion, not the red one, sits in front of her so her red headscarf stands out. Drawn at about 80% of her kitchen scale, since she is further from the camera |
| **Foreground floor** | The carried serving tray sits here, bottom-centre |
| **Brass pot on the high shelf** | Scenery, not a tap target |
| **Size** | Resize to exactly 1600×900 |

## 5. Containers sheet (all three errands)

Attach: the kept bazaar stall v3

> A 3 by 2 grid of six separate illustrations on a plain flat magenta background, hex FF00FF. Each object is empty and viewed from slightly above, at the angle you'd see it held in your arms or sitting on a table right in front of you, so the inside is clearly visible. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. Each item centred in its own cell with clear space around it, no cell borders, no text or labels anywhere. In order, left to right, top to bottom: a large round woven shopping basket, a large brass serving bowl, a round steel cooking pot, a flat round wooden serving tray with a low rim, a wooden chopping board, a long wooden stirring spoon. Create a new image, matching the style of the attached image exactly.

**Why this shape:** basket and tray are carried containers (bottom-centre); bowl and pot are destination containers (on the island). Claude cuts each container into a back layer and a front-rim layer by masking the rim, so items appear to sit inside it.

**Before generating:** run the basket angle test in Build Brief v4 first. If straight-on fruit sprites look wrong inside a top-down basket, reduce the angle in this prompt ("viewed only slightly from above") rather than redrawing every item.

## 6. Tableware sheet (Errand 3)

Attach: the kept containers sheet (generate after it)

> A 4 by 2 grid of eight separate tableware illustrations on a plain flat magenta background, hex FF00FF. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. Each item centred in its own cell with clear space around it, viewed slightly from above, no cell borders, no text or labels anywhere. In order, left to right, top to bottom: a round steel plate, a steel drinking tumbler, a small steel bowl, a brass water jug, a cloth-lined basket of flatbreads, a serving spoon, a serving dish of yellow daal, a small bowl of mango pickle. Create a new image, matching the style of the attached image exactly.

## 7. Eid decorations sheet (story dressing in the hub): done, kept as v1

Saved as `sources/sheet-eid-decorations-v1.png`. Sheets are kept in `sources/`, not sliced into `assets/backgrounds/`, since each cell becomes its own sliced sprite (see the Asset Naming Convention doc).

> A 3 by 2 grid of six separate illustrations on a plain flat magenta background, hex FF00FF. Children's storybook illustration style, bright saturated colours, soft cel shading, thick soft outlines. Each item centred in its own cell with clear space around it, viewed straight on, no cell borders, no text, letters or writing anywhere. In order, left to right, top to bottom: a hanging brass lantern with a warm glow, a short string of plain colourful paper bunting, a hanging crescent moon and star decoration, a short string of small warm fairy lights, a plate of dates, a folded prayer mat. Create a new image, matching the style of the attached image exactly.

**Why this sheet:** the hub gets dressed a little more after each errand (see "How the story is told" in the Roadmap). In kitchen v3 these hang from or run along the top shelf, the Eid shelf. The bunting must carry no letters: text never lives in an image.

**Review of the kept image (23 Sep 2026), and how it's used.** Passes every reject check: no text or letters anywhere, including on the bunting.

| Area | Decision |
| --- | --- |
| **Anchor points** | Lantern and the crescent/star both hang from visible chains, giving a natural point to anchor them from the eid_shelf in scene JSON |
| **Legibility** | All six read clearly at small size, checked against the hub's actual scale |
| **Fairy-light glow** | The bulb glow has blended into the magenta key colour at the slicing step. Needs a clean cut plus a code-added glow effect (same class of fix as the known `item-vermicelli.png` magenta-fringe defect in the Asset Naming Convention doc), not a regeneration |
| **Bunting length** | Only 3 flags, too short to span a shelf edge on its own. Tiled/repeated in code along the shelf edge with varied flag colours, rather than regenerated wider |
| **Story mapping** | Lantern → Errand 1 intro beat. Bunting → after Errand 1 (patch 1). Fairy lights → after Errand 2 (patch 2). Crescent and star → end of Chapter 1. Dates → Chapter 2. Prayer mat → held back for Chapter 5, Eid morning itself, rather than used as kitchen dressing now |

## Not needed yet

The cat (Chapter 3), guest characters (Chapter 2), the doorway scene (Chapter 2) and the clothes stall (Chapter 4) are specified in phase 4, once Chapter 1 has tested the contract in real play.
