# Sprint 12 art plan (pack `s12`)

**Written:** 22 Oct 2026, from Zafar's 22 Oct voice notes (`docs/feedback/s12-polish-2026-10-22.md`: B9, B10, A9, C9, D6, D7, F7, D9) and the rows they reopened (CHAI-26, CHAI-08, ART-08, SH-115, ART-24, ART-25, ART-27, DOOR-08). **Decision 77:** Claude wrote this plan and its block; Zafar runs it in ChatGPT and approves what lands; Claude judges, cuts and wires. **Run spec:** `build/tools/art/specs/s12.run.yaml`; the block is generated from it (`python3 build/tools/art/artblock.py --spec build/tools/art/specs/s12.run.yaml`). Not in this run: the animals at several angles (ART-26).

## 0. Totals

| Part | What | Images |
|---|---|---|
| **A** | The chai pour: the pan tipping, true top-down, six cells (PT1), the same in black tea (PT2), and the glasses exactly from above (GL) | 3 |
| **B** | The face circles: the doctor, the girl, Nani and Nana as one passport-style sheet (FC) | 1 |
| **C** | The eye test's lemon, whole, no shadow, on magenta (LM) | 1 |
| **D** | The door's two cards: a big sun (SN) and a farm with a farmer (FM) | 2 |
| **E** | The evening book's page turn: four frames, each an edit of the book picture (PG1-PG4) | 4 |
| **F** | Nani's "come here" at the door: two poses (NW) | 1 |
| | **Total** | **12**, about an hour (three windows; PT2 waits for PT1) |

**Expected redos:** PT1 two (the hardest view ChatGPT is asked for: a tilt seen from exactly above), FC one or two (four likenesses in one picture), one or two across PG1-PG4 (an edit that moves more than the right page), FM one (a sign with writing). The amend rule is on: a failed try comes back with only the failed point reworded.

**Reused approved art (attached as references, nothing redrawn for its own sake):** the top-down milk pan (`sources/art/s08b/cp2-chai-pan-topdown-v1.png`, the pan in play), the glasses (`sources/art/s08c/gl1-chai-glasses-top-v1.png`, passed 20 Oct), the three sheets of the real people and Nana's sheet, Nani's door poses (`sources/art/s09b/n1-nani-door-poses-v1.png`), the sunny sky (`s09b/s1`), the farm's fields and animals (`s09r/m1`, `s09r/i1`), the book held out (`s09a/b2-book-open-v2.png`), the lemon (`s08b/lm1`) and the orange card (`assets/items/fruit/fru-04.png`) for the lemon's framing. Zafar's eight phone frames of a real pan pouring (`sources/art/pour-reference-2026-10-22/`, 22 Oct) are the reference for how a pan tips; three of them are attached.

## 1. Flaws and uncertainties first

1. **Real people:** Nani (FC, NW), the doctor and the girl (FC). Zafar judges likeness after the run; the runner keeps the first image that passes its check. Modest clothes as on the sheets, no rings on Nani (art bible, 16 Oct).
2. **PT1 is the view ChatGPT failed twice** (section 3). This time the pan tips the way a real pan pours (lip down, away from the handle, as in Zafar's frames), the rim's centre stays put in every cell, no falling stream is drawn (the game draws it from the lip, `js/shared/pour.js`) and no shadow is allowed on the grey. If it still comes back with six near-identical circles, the fallback is cells 1, 3, 4 and 5 of whichever try shows the most difference between its rims.
3. **The photos must not be copied.** PT1's three phone frames show a hand, a sink and a kitchen; the prompt says they are only for how the pan tips and how the liquid leaves the rim. A hand, a sink or a side view in the result is a fail.
4. **FC asks for four likenesses in one picture** so the four heads share one crop and one model. If two faces blend, the redo amends only the blended one; if a second try still blends, the judge splits the sheet into two lines (the doctor with the girl, Nani with Nana) on the redo list.
5. **PG1-PG4 are edits of one picture.** Each attaches the original book picture, never another frame; the cut takes only the right page's region from each frame and registers it on the unchanged left page, so a small redraw elsewhere does not matter. A frame whose left page, hands or room moved is still a fail (the check).
6. **The glasses (GL) may not beat GL1.** Zafar (B9) read the glass as "maybe not exactly top down" and off its holder's centre; the holder centring is code (CHAI-08, `js/cook/stations/chai-tray.js` WELLS). GL is one cheap image with a stricter prompt (concentric floor, radial facets); if it is not plainly better than GL1, GL1 stays and only the code moves.
7. **The farm's farmer is a placeholder** (D7: "probably Hanamami, but we'll replace that with her later"): a grown woman in a straw hat, modest and generic, no likeness. The farm's readability notes are in section 4.

## 2. Why the circles kept failing (ART-08, A9)

Three circles, three source pictures, three crop rules, and no face ever drawn to look straight out. The doctor's circle is `assets/clinic/patients/doctor/v2/faces/neutral.webp` (144 px): a head-and-shoulders box from his standing s08 "front" pose, which is really a slight three-quarter turn, so one ear shows. The girl's is `girl-head-neutral.webp`: the cutter's corner-head rule (`artcut.py`: a square 1.25 times the head height, the eyes at 42 percent) over her whole-figure pose, whose head turns the other way, upscaled to 512. Nani's is Cook's `nani-face.webp`, cut from her old v2 sheet by eye positions (`build/cut_characters.py`); the book uses a fourth (`nani-face-fire.webp`). Every rule centres on the eyes, not the head, so a turned head keeps one ear and loses the other; the CSS then crops again (`object-position: top` in Nani's box, `center` in the doctor's). ART-08 was judged by the cutter's numbers, never by the circles side by side.

**The fix:** one sheet (FC) drawn as passport photos, one circle rule for all four in the cut (a circle centred on the nose, 1.5 times the head height), one CSS rule (`object-position: center`), and the judge looks at the four circles together at phone size before anyone else sees them.

## 3. What went wrong with the old pour frames (CHAI-26, B10)

The s08c sheet `cp3-chai-pan-tip-pour-v2.png` is the "ChatGPT frames from two sprints ago". Its prompt asked the pan to tip **towards the viewer, turning about the line of its handle**, which is not how a pan pours: Zafar's frames (22 Oct) show the handle lifting and the far rim (the lip side) dipping. Seen from above, the sideways tilt made the pan look as if it was "almost rotating away" (Zafar, 17 Oct, P59). Its two pour cells drew the stream as thick glossy syrup from the near rim, not the lip, and the pans cast shadows on the grey (the 20 Oct judge: tilt passed, stream failed), so the game used cells 1-4 with a code-drawn stream. Sprint 11 then dropped the frames and coded the whole pour from the one flat pan (a squash and a sliding tea surface), which Zafar says looks worse than the frames did. So PT1 keeps what worked (ChatGPT draws the tilt, the rim ellipses measured in the prompt), fixes the direction (lip down, as the photos), draws no stream and no shadow, and keeps the rim's centre in one place so the frames register.

## 4. What makes "farm" readable at a glance (ART-25)

Picture books for two- to four-year-olds use the same few signs, and children name them before they can read: a **house with a big pitched roof** (red is the strongest cue, from the barn convention), a **wooden fence**, **hay bales**, a **farmer in a wide hat holding a pitchfork**, and **two or three animals together** (a hen is the single most recognised farm animal, then a cow, a goat or a sheep). A field alone reads as "grass" or "park"; the s09b farm card (the empty book spread with a goat and a hen) is close to that, which is why Zafar wanted a different image. FM puts all five signs in one picture, the farmhouse centred (the door card crops it to 4:3 and the thought bubble to a circle, so nothing important sits near an edge), and reuses the s09r goat, hen and dog so the card matches the ride.

## 5. The prompts

#### PT1. The chai pan tipping, seen from exactly above
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME small brushed-steel milk pan as the full pan in the first attached picture (its black handle pointing to the RIGHT, its small pouring lip on the LEFT, opposite the handle), full of milky tan chai, seen from DIRECTLY ABOVE, the camera fixed straight over the pan, six times in an invisible grid of 3 columns and 2 rows. In every cell the pan is the same size and the centre of its rim sits at the exact same point of its cell; the handle points right in every cell.

From cell to cell the pan tips the way a real pan pours: the handle end LIFTS toward the camera and the lip side DIPS away from it, turning about the line that runs from the top of the cell to the bottom through the pan's centre. Seen from above this means: the rim becomes an ellipse that is NARROWER from left to right while its height stays the same; the handle rises toward the camera, so it looks shorter and a little bigger; the inside wall on the handle side (the right) shows as a growing band of steel between the rim and the tea; the tea stays level, so it slides toward the lip on the left and its right edge moves away from the rim.
Row 1: (1) flat and level, 0 degrees: the rim a full circle, the tea a full disc; (2) tipped 20 degrees: the rim about 94% as wide as it is tall, a thin band of inside wall on the right, the tea's surface moved a little to the left; (3) tipped 40 degrees: the rim about 77% as wide as it is tall, a wider band of inside wall on the right, the tea gathered toward the lip.
Row 2: (4) tipped 60 degrees: the rim only HALF as wide as it is tall, the inside wall showing across the right half of the pan, the tea pressed against the lip and just reaching it, not yet pouring; (5) as cell 4 and POURING: a short, thin tongue of milky chai curls over the lip and ends just past it, no longer than a fifth of the pan's width; NO long falling stream (the game draws that); (6) as cell 5 at the END of the pour: only a shallow pool of chai left against the lip, a thin trickle over the lip, most of the steel floor showing. Every cell must be clearly more tipped than the one before it across cells 1 to 4: four different ellipses.

The second, third and fourth attached pictures are photos of a real pan tipping and pouring, seen from the side: use them ONLY for how the pan tips (handle up, far rim down) and how the liquid leaves the rim as a thin sheet. Copy nothing else from them: no hand, no sink, no kitchen, no side view; the camera here is always directly above.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No hob, no gradient, no texture. NO shadows on the grey. Nothing touches a cell boundary. Do not draw grid lines.

Style: exactly as the first attached picture: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and liquid, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### PT2. The same six pans, black tea
```
Edit the attached sprite sheet of six milk pans. Keep EVERYTHING exactly as it is: the same six pans at the same sizes and places, the same tilt in each cell, the same handle, rim, inside wall, lip, the tongue of liquid in cell 5 and the trickle in cell 6, the same flat grey background, pixel for pixel where possible. Change only one thing: the liquid in every cell is now BLACK TEA, clear and dark reddish-brown, slightly translucent at its thin edges, instead of milky tan chai. Its surface, level and shape in each cell do not move.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### GL. The chai glasses exactly from above
```
Generate an image, 1536×1024, landscape.

Three times the SAME small clear glass chai tumbler as the attached picture, seen from EXACTLY straight above, the camera fixed over the centre of each glass: the rim a perfect circle, the walls the same thickness all the way round, the round floor a smaller circle exactly concentric with the rim, the glass's vertical facets spaced evenly round like the spokes of a wheel and all the same length. The same size and place in each third of the image, in a row: (1) empty, clean clear glass; (2) full of milky chai, light caramel brown, matte, a faint skin on top, the liquid's surface a circle concentric with the rim; (3) full of black tea, clear dark reddish amber, the glass floor faintly seen through it. Each about 25% of the image wide; nothing touches an edge or another glass. No holder, saucer or tray.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture, NO shadows on the grey. Do not draw dividing lines.

Style: exactly as the attached picture: a stylised 3D animated-feature-film look, semi-photoreal glass and liquid, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### FC. Four faces for the round face buttons, one sheet
```
Generate an image, 1536×1024, landscape.

A sprite sheet of FOUR head-and-shoulders portraits for a children's game, in an invisible grid of 2 columns and 2 rows, all four framed EXACTLY the same way, like passport photos: (1) top left: the grandfather doctor from the first attached sheet (the same face, glasses, hair, skin tone, navy blazer and shirt); (2) top right: the girl from the second attached sheet (the same face, plaits with their bows, skin tone and yellow top); (3) bottom left: the grandmother from the third attached sheet (the same face, round glasses, red headscarf over her hair and shoulders, cream embroidered top, skin tone); (4) bottom right: the grandfather from the fourth attached sheet (the same face, white knitted cap, round glasses, white beard, cream kurta and brown waistcoat).

The same framing in every cell: the person faces the camera DEAD ON, nose pointing straight at us, head upright and not tilted, both sides of the face showing equally (both ears, or the same amount of hair or scarf on each side); the eyes exactly on the cell's horizontal midline and looking straight at the viewer; the middle of the face on the cell's vertical midline; the head (from the top of the hair, scarf or cap to the chin) about 60% of the cell's height, the same in all four; the shoulders level and cut off by the bottom of the cell. A warm, friendly closed-mouth smile, eyes open. Nothing drawn round the heads: no circles, frames, lines or labels. Nothing touches a cell boundary at the sides or top.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture, no shadows on the grey.

Style: exactly as the attached sheets: the same stylised 3D animated-feature-film look, the same likeness at the same level of realism, soft global illumination from the upper left, no outlines. Modest clothing as on the sheets; the grandmother wears no rings, no jewellery except her glasses.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

#### LM. The whole lemon for the eye test's card
```
Generate an image, 1024×1024, square.

One whole LEMON, the same lemon as the first attached picture (bright yellow, finely dimpled skin, a small nub at each end), seen exactly from the side, lying level with its two ends pointing left and right, centred, about 70% of the picture wide, with clear empty space all round it. Whole and uncut, no leaf, no second lemon, no slice. Framed like the attached orange card: the fruit alone, nothing else in the picture. The background is ONE flat, even, pure magenta, hex #FF00FF, with NO floor, NO cast shadow, NO contact shadow under the fruit and no gradient (it is cut away later): the lemon floats on the flat colour.

Style: exactly as the attached lemon: semi-photoreal, soft global illumination from the upper left, real waxy skin with a gentle highlight, no outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SN. A big sun against the sky, for the door's weather card
```
Generate an image, 1536×1024, landscape.

The same soft blue daytime sky as the attached picture, but now with ONE BIG SUN as the picture's subject: a round golden-yellow sun whose disc fills about TWO THIRDS of the picture's height, centred a little above the middle, with a soft warm glow fading from its edge into the clear blue sky. The sun is a plain soft-edged disc with a warm glow: no face, no rays drawn as lines or spikes. Only sky round it: no ground, hills, trees, buildings, birds or people; at most two or three small soft white clouds, only near the bottom corners and never in front of the sun.

Style: exactly as the attached sky: soft, clean, painterly-smooth 3D animated-feature-film sky, no outlines, no lens flare.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### FM. A farm with a farmer, for the door's activity card
```
Generate an image, 1536×1024, landscape.

A small friendly farm for a young child's picture card, in the style of the attached pictures (the same bright green fields, wooden fence and soft blue sky as the first; the same animals as the second). In the middle distance, centred: ONE farmhouse with cream walls, a wooden door, two small windows and a big steep RED roof, a small round hay bale and a stack of two beside it. In front of it, a low wooden fence like the attached one, with a gap in the middle. In the gap, standing facing us and smiling, ONE farmer: a grown woman in a wide straw hat, a loose long-sleeved sage-green tunic to the knee over loose brown trousers, brown boots, holding a wooden pitchfork upright beside her with one hand, the prongs up. Near her feet the goat, the hen and the dog from the second attached picture, the same animals in the same style, all facing us or her. Green fields to a low line of hills, a few soft clouds.

Everything that matters (the house, the farmer, the animals) stays within the middle 85% of the width and the middle 80% of the height, so the picture can be cropped to 4:3 and to a circle. No sign, no board, no tractor, no other people. Daylight, soft and warm.

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, signs, logos or watermarks. No religious images or markers.
```

#### PG. The book's right page turning (one prompt, four frames)
```
Edit the attached picture of the open book held out on her lap. Keep EVERYTHING exactly as it is, the same size and framing, the left page, the red cover and spine, her hands, her dupatta and clothes, the armchair and the room behind, pixel for pixel where possible. Change only the book's RIGHT page: it is being turned over to the left, {STAGE}. The turning page is plain cream on both sides with the same thin gold border; it bends softly like real paper and casts only a soft shadow where it lifts from the book. Where the right page has lifted away, the NEXT page shows beneath it: the same plain cream with the same thin gold border, blank. Both pages stay blank: no writing, no pictures on them.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### NW. Nani says "come": the wave and the beckon
```
Generate an image, 1536×1024, landscape.

Exactly TWO full-length poses of the SAME grandmother as the attached sheet (the same face, round glasses, red headscarf over her hair and shoulders, cream embroidered kameez, cream trousers, embroidered slippers), side by side, the same size as each other and as the figures in the second attached picture, standing on one invisible baseline, facing the viewer, whole from head to feet with space round each: (1) left: calling "come!": her right arm raised in front of her at shoulder height, elbow bent, the palm turned toward us and the fingers together and open, her head a little forward, a warm smile with the mouth a little open as she says it; (2) right: the beckon: the same stance and arm, but the hand has turned toward her and the fingers curl in toward her palm, drawing the viewer to her, the same warm smile with the mouth closed. In both, the left arm rests relaxed at her side. No rings, no bracelets, no jewellery except her glasses. Modest clothing exactly as on the sheet.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, NO shadows on the grey.

Style: exactly as the attached sheet: the same stylised 3D animated-feature-film look, the same likeness at the same level of realism, soft global illumination, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No religious images or markers.
```

## 6. Cut and wire notes

- **PT1, PT2:** grid 3×2, `cell_align` (the same pan in every cell), grey key as CP3 (`tol` 4-5 for the steel); per cell the rim's centre and the lip's point go into `cut-data.json` (the stream's anchor). Names: `pan-tip-0`, `-20`, `-40`, `-60`, `pan-pour`, `pan-pour-end` (+ `-black` from PT2). **Wiring (s12 chai builder, CHAI-26):** the pan lifts over the glass, the code rotates the sprite so the lip points at the glass (a true top-down sprite turns freely), plays 0 → 20 → 40 → 60 → pour → pour-end at the data's step times, and `js/shared/pour.js` draws the thin stream from the lip anchor; the s11 squash-and-slide pour goes. The milk/black choice follows the brew as today (CHAI-31).
- **GL:** grid 3×1, `glass` + `soft_floor` as GL1; replaces `assets/cook/items-s08c/glass/glass-*-top-s08c.webp` only if the judge finds it plainly more top-down than GL1. Either way the glass's centring on the tray's well is code (CHAI-08: `glassR8`, WELLS in `chai-tray.js`).
- **FC:** grid 2×2 on grey; one circle rule for all four: centre on the nose, diameter 1.5 times the head height (top of hair or scarf to chin), saved at 512 px as `faces/doctor.webp`, `girl.webp`, `nani.webp`, `nana.webp` in one shared folder (a new faces-s12 folder under assets/shared (made at the cut)). **Wiring:** `Kit.doctorFace("neutral")`, the girl's heal-card head, the guide box's `opts.face` for Nani and Cook's `facePath` for Nani and Nana point at them; every circle `object-position: center`. The talk and blink moods stay on their old frames until a mood round. The judge's proof is one screenshot of the four circles at phone width.
- **LM:** key magenta, trim, `lemon-whole-s12.webp` (+ `@2x`) replacing `lemon-whole-s08b` in `data/clinic/heal/eye.json`, `ear.json`, `scene.js` and `eye.js`. The overlap with the doctor's hand (C9) is the card's picture box, not the art: the eye test's card draws its picture `contain` inside `WordCard.card`'s face (s11 DC's measured corners).
- **SN, FM:** no key; `assets/day/s12/door-sun.webp` and `door-farm.webp` (cover-cropped to 4:3 in the cut as well, so the card never crops them further). `data/days.json` `door.skies.sunny.card` → the sun picture; `door.cards.activity.farm.pic` → the farm picture with no sprites (the W1-B door builder wires; the thought bubble takes the same picture).
- **PG1-PG4:** each registered on the base `pages-b2-v2` by its unchanged left page (ECC, as the face layers), then only the right page's region (the right half of the book plus the space above it) kept as an alpha layer; `assets/day/book/turn-1..4.webp`. **Wiring (book owner, ART-27):** `book.js` plays the four frames in order over the page content during the turn (about 120 ms each, the last cross-fading to the next page), replacing the CSS swing; the tap corner stays 64 px.
- **NW:** grey key as N1/N2, two figures on one baseline, `assets/day/s09b/nani-come-1.webp`, `nani-come-2.webp` at the door poses' height; `data/days.json` `door.nani.poses.come` (two frames the code alternates at about 500 ms) and `door.poses.day[0]` → `come` while she says "come" (DOOR-08; the Kutchi "come" is on the recording sheet, English in grey italic until it lands).
