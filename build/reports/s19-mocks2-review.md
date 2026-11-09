# Mock-up round 2: Fable's review (9 Nov)

Looked at: the 25 results and their four-frame crops (`sources/art/s19-mocks2/`), the chrome block, Zafar's 9 Nov decisions (`s18-review-and-direction.md` §7), my round-1 answers, the TODAY pictures, and each game's `data/stations/*.json` and station code. Four tests per image: the red 740x320 crop (play area 522x320, the band 96 px, the scene 224 px), cut-and-animate in Phaser, the mechanic and a child's finger, the house rules.

## For Zafar

**Picks**

- **Sekelo: A1-2.** Calmer coals, cleaner trays; the left trays are the game's rack and plate, so no band here.
- **Corn: A2-2,** and the tray close-up as the band reference for every tray game.
- **Maani: A3-1** (bare board); A3-2's rings are code, after the big/small lesson.
- **Daar: B1-1 tadka, B1-2 stir;** counter **B1-5**.
- **Chaat: B2-1.**
- **Samosa: B3-1 filling, B3-3 fry;** B3-2 is the fold's look only.
- **Eggs: redo** (handle over the band, flames seen from above, a wood frame round the hob, Nani's face three times).
- **Baking: mixing c, oven a,** recoloured.
- **Chop: C3-2 as the look;** a catalogue, not a screen, so a pieces run.

**Changes**

1. CODE. Sekelo: place the trays so the top tray's top meets the grill's top and the bottom tray's bottom the grill's bottom.
2. CODE. Corn: the crate is clipped at 1920x1080; keep it inside the middle 80%.
3. CODE. Maani: move the turner down and left, away from the settings corner; shrink the dough heaps so the pills fit.
4. REJECT. B1-3 reads as a desk calendar; B1-4 is a card in a bolted frame with a smaller digit.
5. ART. Daar: cut the pot with plain hot oil; the seeds fall in by code.
6. ART. Chaat: the same bowl empty, plus one transparent layer per topping (ten), one run.
7. CODE. Chaat at 740x320: ten bowls are 52 px a slot, too tight; two rows on the phone at L4, or 44 px bowls. I recommend two rows.
8. ART. Samosa: the filling as six separate blobs; the karahi with plain oil, no samosas.
9. CODE. Samosa fry: the face badge sits at the settings corner; move it to the plate's lower-left; the plate inside the frame.
10. CODE. Samosa fold: Cook.Pastry folds by code; take only the flap's shading from B3-2 (its step 2 leaves the filling showing, step 3 has no seam).
11. REJECT. Eggs: the blue flames (heat is the ring), the walnut surround (chai's hob is black glass, steel rim), C1-2's handle crossing the band.
12. CODE. Eggs: faces are ours, one per person.
13. ART. Baking: the bowl states (flour heap, well, dough) need the camera a touch above side-on, as c nearly is, or an opaque bowl shows nothing; six states plus jug levels, one run.
14. ART. Oven: cream enamel, steel trim, one gold-ringed knob (two do nothing); door and tray as separate layers so it opens.
15. ART. Chop: the empty board and the twelve pieces on a plain background; they cannot be cut cleanly off walnut.
16. CODE. Chop: the onion's brown skin loses contrast on walnut at speed: a golden skin or a contact shadow. And decide: the board above a band (the S19 chop rises from the band, pills showing every kind) or filling the whole area; I recommend above the band.

**Stir counter:** B1-5, built in code: the shared card style, cream with a big brown digit, right of the pot, about 100 px tall on your phone; it pops as each lap closes. Nani's count aloud waits for Mum's numbers.

**Redo prompts**

- **Eggs:** "Same scene. The hob is chai's: black glass with a brushed-steel rim, no wood surround, no visible flames. The frying pan's handle points straight down and ends at the hob's edge, never below. Three plain cream plates on the walnut tray, blank corners."
- **Oven:** "Same oven in cream enamel with brushed-steel trim and one gold-ringed knob, centred; the glass door and the naan tray as before."

## Reasoning per image, flaws first

### A1 sekelo (1, 2)

Flaws: neither tray is deep, and neither lines up with the grill (in -2 the trays run 120-385 and 420-690 against the grill's 150-600). -1's coals are lava-red with a baked glow; -2's are dark with a few embers, quieter. The skewer handle crosses the band line in both; it does not matter, because this screen has no band: the left trays are grill.js's rack and plate, and nothing is picked from a shelf. The grill fills the height, which is right.

Red crop: the grill and both trays survive; a skewer is about 33 CSS px wide and 160 tall, a good target. Cutting: the grill with its coals and bars is one piece; skewers draw above the bars (they do in the mock); each piece of meat, chicken, tomato and onion is its own chunk sprite already, so the mock's skewer is a look reference, not a cut. Rules: light upper-left, shadows lower-right, no text. Pick -2; align the trays by code.

### A2 corn (1, 2, tray close-up)

Flaws: the crate's left edge sits outside the green frame (clipped at 1920x1080). Four cobs in the crate against the game's six: fine, the crate is one picture. -1's coals glow lava; -2's are calmer and the cobs glossier. The person's oval plate with a face circle sits below the crate; the two stack above the band. The six bowls (lemon, salt, red chilli powder, green chutney, tamarind chutney, black pepper) are right; at 740x320 a bowl is about 53 px, six slots of 87: good.

The close-up is the tray we asked for: 06's thin raised rim, 05's quiet grain, cream bowls, pills inside the tray, shadows lower-right. Cut it as a 9-slice (ends and a stretch middle); the bowls as one bowl sprite with contents layered. Pick -2 plus the close-up.

### A3 maani (1, 2 size guide)

Flaws: the dough heaps fill the tray's height, leaving no room for pills; the turner's top end sits about 40 CSS px from the settings corner on the phone, and the child taps the turner (maani-line.js: it flips the maani). The tray art is taller than the 30% band. Otherwise the brief is met: the board about 7% up (187 CSS px at 740x320, my earlier estimate 165-178), the pin tucked at its foot and clear of the tray, the tawa on its small hob with a gold-ringed knob, Nani's face on the hob, millet darker and wheat lighter, two steel plates with faces at the tray's right.

-2's rings: the small ring hugs the rolled maani, the big one near the board's edge; at 740x320 these dashes are a pixel wide, so the rings are code (maani-line.js already etches a ring). Cutting: board, pin, hob, tawa, turner and plates are separate objects with soft shadows on marble: clean cuts. Pick -1.

### B1 daar (1 tadka, 2 stir, 3-5 counters)

Flaws: the tadka pot already has cumin in the oil, so it is one step in; the cut needs plain oil with the seeds a code layer. The cream bowl of cooked daar on the right touches the red frame and is cut at 1920x1080; it is a piece, so code places it. Eight bowls (onion, tomato, garlic, green chilli, turmeric, salt, cumin, mustard) are right; at 740x320 they are 65 px a slot, workable, and the data drops two if it crowds. The stir image's swirl is baked in; the stir is the ladle rotating by code, with the daar surface a disc that can turn under a mask. The pot is about 190 CSS px on the phone: big enough.

Counters: -3 is a desk-calendar flip card on a sage stand with two rings; a child would not misread it, but it is a second object with a story. -4 is the same card inside a walnut and steel frame with four screws, the digit smaller. -5 is a plain cream rounded card with one huge brown digit, about 118x160 CSS px on the phone, the digit around 100 px: readable at a glance, the same family as our shared cards, and nothing to draw: it is code. It sits right of the pot, clear of the settings corner. Zafar asked for a big, easy number that need not fit the kitchen (DAAR-03, DAAR-46): -5.

### B2 chaat (1)

Flaws: the bowl is full, so the empty bowl and every topping layer are still to make; the mock proves the look (potato, chickpeas, green chutney, sev reading as one dish), not the pieces. Ten bowls on the tray (potato, chickpeas, onion, tomato, green chilli, coriander, sev, green chutney, tamarind chutney, yogurt) are right, but at 740x320 they are 52 px a slot, under a finger's 44 px once the gaps are in; early levels show fewer, L4 shows ten. The bowl is 211 CSS px on the phone, its food 150: fine. Light and shadow are right; nothing round the bowl.

### B3 samosa (1 filling, 2 fold, 3 fry)

Flaws, filling: the sheet stack (left) and the steel plate (right) are both outside the middle 80% and clipped at 1920x1080; the filling is a mixed blob, where the game stacks one blob per filling. Board, sheet, stack and plate are separate and cut cleanly; six bowls (potato, peas, onion, green chilli, coriander, mince) right. The sheet is about 122 CSS px on the phone, a comfortable drag target.

Fold strip: step 2's flap tip lands a third in from the left but halfway up, so the filling shows; step 3 is a finished puffy triangle with no fold seam, and geometrically two corner folds on a square do not give that clean triangle. None of this matters for play: Cook.Pastry bends the sheet by code; the strip gives us the flap's shading.

Fry: the face badge sits at the top-right of the plate, about 40 CSS px from the settings corner, and the plate is cut at 1920x1080; both are code. The karahi, slotted spoon with its folded cloth, the paper towel and no tray under the plate match the brief. The bubbling oil with samosas is baked; the game cross-fades oil states and draws bubbles, so we need the karahi with plain oil; a golden samosa can be cut from this one, the raw ones from the tray. A samosa in oil is about 53 CSS px: tappable.

### C1 eggs (1, 2)

Flaws: both show blue gas flames under the pot and pan seen from above, which is physically wrong and is the heat ring's job; both have a walnut frame round the hob, not chai's black glass with a steel rim; -1's black handle touches the band line and -2's steel handle crosses into the shelf ("never over the tray"); -1 puts Nani's face on all three plates. -2 is otherwise the better picture (whole chillies in the jar, a cleaner egg box, three people). The band is chai's pale stone shelf with egg box, salt, pepper, chilli jar: right. 27's walnut tray on the right, nothing under the hob: right. Plates are about 70 CSS px on the phone, fine drop targets. The pot's boiling water and the pan's eggs are states, as the game already has. Redo, with the one-line prompt above.

### C2 baking (mixing a, b, c; oven a, b)

Flaws: all three mixing images are pure side-on, so the bowl's inside barely shows; the game's six bowl states (flour heap, well, dough) need the camera a touch above, as c nearly has. a and b carry a warm light wash in the top-left of the marble, close to the window streak the brief banned; c has none. The jug's two dashed lines sit at about 42% and 76% of its height (half and full below the lip): right. Shelf items (flour jar, water bottle, milk carton, yogurt tub, salt, sugar) right; the jug's spout faces the bowl. c's bowl is 245 CSS px wide on the phone, the jug 122: good. Pick c.

Oven: a sage-green enamel oven with three gold-ringed knobs on a steel strip, a glass door, three naans on a tray, a lamp top-right inside. Sage is a new material against the house list; two of the three knobs do nothing; the body runs into the band region, which is fine since nothing is picked here. The door window's bottom stays above the band line in both; a's window is a little larger and its naans more baked. Cutting: body, door (glass as its own layer so it opens), tray with naan, steam by code. Pick a, recoloured.

### C3 chop (1, 2)

Flaws: this is a still-life of the pieces, not the screen: the game throws vegetables up from below and the child swipes them in the air (mechanics/chop.js), with the countdown ring at the board's top-left. The knife is cut by the green frame at 1920x1080 and its tip sits near the settings corner; it is a piece, placed by code. The pieces have baked contact shadows on walnut, so cutting them off the board will not be clean: they need re-rendering on a plain background, and the board needs one empty render. The onion's brown skin against mid-walnut is the weakest contrast on the screen and it will be moving. Everything asked for is there: one huge board with a thin marble border, wider left and right; a chef's knife; onion, tomato, potato and garlic each whole and as two clean halves. -2's shapes are cleaner and more saturated. Open question for Zafar: the S19 chop rises from a stone band with every kind and its pill; a board filling the whole area has no band, so the throws would rise from the board's bottom edge with no pills. His 16 says the board fills; I recommend the band stays and the board fills the space above it, or the shelf's "never tells which to cut" job is lost.

## Proof

Read-only in the repo except this file. Written by Fable, 9 Nov.
