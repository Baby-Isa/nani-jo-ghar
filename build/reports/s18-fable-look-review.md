# Sprint 18: the look (Fable's independent review), 8 Nov 2026

An independent view on perspective, shadows, marble, light, ChatGPT's six sekelo findings and the mock-up process. Flaws first.

## Flaws first

**In today's game (the s18-w3-full run):**
1. Nothing is grounded. Hob, tray, board, tawa, trays and grill have no shadow; the bible's rule is "nothing floats". Chai gets away with it because its shelf items stand on a drawn ledge line; sekelo's and maani's heaps hover mid-band.
2. Sekelo's board is light oak (bible: walnut, never light oak), its skewer is a one-pixel line at phone size, and its heaps are drawn at a 3/4 angle that is neither the worktop's T nor the shelf's F camera. That is the clash Zafar feels: the heaps, not the shelf.
3. Maani's dough clusters and thalis sit on the band with no line and no shadow; the thalis read as discs stuck to a wall.
4. At 740x320 today's marble is a plain grey wall; worktop and stone band almost merge.

**In the mocks:**
5. Window light-streaks cross the board and tray (mocks 3-5) and the top-left (1-2). The bible allows window patches "on walls away from tap areas"; the worktop is all tap area.
6. Mock-1's marble is yellowed (Zafar, 6 Nov: "white, never yellowed") and its veins compete with the dough; its flour-dusted pyramids are a fussier object.
7. Mock-2's shadows are about twice the right weight. Mock-3's bowls float on a flat band as today's heaps do. Mock-5's plank adds a third wood tone and a heavy dark foot.
8. Mocks 3-5 invent an item (murgi) and drop one (makai); a mock that changes the item list is not a redo of the game.

## 1. Perspective and the shelf

**Recommend option 4, the stone ledge with a front lip: it is chai's own shelf and already the house rule (STD-E3-03, shelf band the stone).** The clash is resolved by a rule, not a treatment:

- *The camera belongs to the surface, not the screen.* Above the line, T (true circles, no walls); on the shelf, F (mid-height, 10 degrees down, a hint of rim). The lip is the horizon between the two cameras; once there is a visible line with a shadow under it, the eye accepts both. The genre does exactly this: Papa's and Good Pizza, Great Pizza run a top-down work surface with front-view ingredient bins along the bottom behind a counter edge; Unpacking draws every surface in its own camera; Cooking Mama changes camera per screen; Overcooked and Toca Kitchen use one camera because they have one surface. (From memory, not re-searched today.)
- *Everything on the shelf stands on the line* with a footprint (base or rim ellipse) and a contact shadow. Mock-3 fails this; mock-4 and chai today pass.
- *Bowls, not piles, for loose pieces* (sekelo's cubes, chopped veg, chaat toppings): low, wide, in F so the heap shows over the rim. Zafar's "slight angle" discomfort is the mocks' bowls drawn at 20-25 degrees; at the bible's 10 it goes away.
- *Flat things.* Spheres and cubes look the same from any angle; only the pile's shape and shadow betray the camera. Keep Zafar's strict single-layer top-down cluster for dough balls, set in a shallow steel thali in F (the game has one) with a contact shadow. No pyramids. I would not add a "flat strip for flat things": one shelf, one line, one camera on it; the flat thing goes in a dish. Agree with the rest of the orchestrator's rule: a shelf wherever named things are picked, none where nothing is picked.

## 2. Shadows

**Yes, add them to everything; one kind, built two ways; tuned to half of mock-2.**

- *Kind:* the bible's own words, a tight dark core plus a soft falloff down-right: a contact shadow with a short drop in one sprite, no separate long cast shadow.
- *Strength:* multiply, alpha about 0.20 at the core, offset about 3% of width right and 6% of height down (the numbers already in `contactShadow`), spread about 1.05 of the footprint. Make these tokens (values.md E6) so every game draws the same shadow. Mock-2 is about 0.35 and long: keep its shelf items, halve its hob.
- *Static station objects* (hob, board, tawa, trays, grill): a pre-blurred silhouette made once offline by a build tool (alpha mask, gaussian blur, tint, saved as `*-shadow.webp`), placed by the same `contactShadow()` call below the object. One draw call, no runtime blur, identical on WebGL and Canvas. Not baked into the object art: `artcolour.py` already FAILs baked shadows, and a baked one is wrong once the object is scaled by size class or swapped by state.
- *Placed and moving things* (shelf items, pan, dough, pieces): the existing ellipse with a tighter core. It already follows scale, alpha and visibility and lifts on `fly()`; add a shrink-and-fade when lifted, a grow-back on landing.
- *Skewer and pan:* one shadow per group, not per piece. The skewer with its pieces casts one capsule that lengthens as pieces land (`contactShadow(group, box)` already takes a box). The pan's shadow is fixed; its contents are inside it and cast nothing.
- *Not preFX addShadow:* WebGL-only (Canvas gets nothing), per-object shader cost grows with sprite count on low phones, and its look differs from the ellipse: two shadow languages in one frame.
- *Honestly, mock-2 against chai today:* mock-2 is better grounded, the hob and tray sit, the shelf items stand. But its weight, window patch and brighter marble are three changes at once, and part of chai's calm is how little is going on. Target: chai today plus shadows at half mock-2's weight, no streak. The two cheap methods above do this really well; it is a deterministic look, not a shader gamble.

## 3. Marble

**A careful middle, leaning to today's.** Today's hue (`#EDECEF`, never yellowed) stays. Veins come up to about 60% of mock-1's contrast, cool grey not warm, so the worktop reads as stone at 740x320 and is still "lighter and calmer than what sits on it". Warmth comes from the light, not from tinting the stone.

## 4. Lighting

**Yes: one fixed upper-left light for every object, boards, trays and stove included, soft shadows lower right.** The fixed objects today have no directional shading; mocks 3-5 show the right answer for the board (a lit top-left bevel, shadow lower right). **No light streaks on the worktop.** The honest "sunlight" is a very soft warm gradient across the marble, 3-4% lighter top-left, baked into the background. Streaks are decoration over tap areas and fight the pop-outs and lit boxes.

## 5. ChatGPT's six findings

1. *Wider mid-walnut board, satin, bevelled:* agree on walnut (today's is a bible FAIL) and the bevel (thickness and a shadow line); "wider" no, the size class and four frames set width.
2. *Thicker skewer, reflections, walnut handle:* agree; the bible thickens thin parts, and the skewer vanishes at 740x320. One soft specular line, not chrome.
3. *Larger, deeper tray:* deeper yes (a hint of inner wall); larger no, and the grill level must fit two trays and a grill.
4. *Loose piles instead of bowls:* disagree. Bowls give a footprint, a rim that states the camera, a constant tap shape and tidiness.
5. *One upper-left light, contact shadows lower right:* agree; it is the bible.
6. *Balance board and tray weight:* agree, but it is a layout question (shelfshot at four sizes), not art.
Overall, "stylised shapes, realistic materials" is the bible's first paragraph. Agree.

## 6. Process

**Yes, one ChatGPT mock per Sprint 18 kitchen game, but settle the shared rules first on chai and sekelo; the other eight mocks then answer only game-specific questions.** Otherwise ten mocks each re-decide the shelf, light and marble, and drift.

Every mock-up brief fixes:
- *The plate:* a grey-box screenshot of the real stage at 1280x665 from the lab page (side-panel column, shelf band at 30%, shelf line, pill line, gear) that the mock paints over, so the geometry is the game's.
- *The anchor:* chai's signed-off frame as the style reference.
- *The lines:* T above the line, F on the shelf, everything standing on the line; one upper-left light, shadows lower right at the token weight; no streaks on the worktop; marble `#EDECEF`; walnut; the stone shelf (option 4); no text (empty pill blanks or none); only the game's items from `data/cook.json`, nothing invented or dropped.
- *One size:* the mock is a direction at 1280x665; the four-size check happens on the cut assets, never on the mock.

Turning a mock into a spec: a one-page look sheet per game: the mock beside today's frame; a numbered diff list; each line classed art (a new asset: view letter, size class, states, into the art-run paste block), code (shadow, ledge, layout number: a fix-list row) or no (named drift, rejected); acceptance is the shelfshot at four sizes and the judge reading the mock's intent, not a pixel match.

## Proof

Pictures: `build/screenshots/sandbox/s18-w3-full/` cook-chai-tray 1920x1080 05-kind-tap, 07-kind-timing and 740x320 05-kind-tap; cook-maani-line 1920x1080 05-kind-tap, 07-kind-timing; cook-mishkaki-grill 1920x1080 05-kind-tap, 06-kind-click and 740x320 05-kind-tap; Zafar's mock-1 to mock-5 and chai-now-sheet.png (scratchpad, zafar-mocks).

Docs: `docs/design-language/art-bible.md` sections 1-3; `standard/e-presentation.md` (all); `standard/values.md` shelf rows; `build/tools/art/data/look-rules.json` shadow rules; `art-pipeline.md` shadow lines. Code: `js/cook/stations.js` `flat()` and `contactShadow()`; `js/cook/station-lib.js` 868; `js/cook/stations/chai-tray.js` shelf constants.

Genre comparisons are from memory, not searched today. No files changed except this report.
