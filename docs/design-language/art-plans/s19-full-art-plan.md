# S19 full art run: the pieces every kitchen game still needs

**Method:** the mini run's (`s19-mini-chrome-block.txt`: three ChatGPT chats at once, per line plan in text -> "generate exactly this" -> check -> corrected version; zero retries, 26 images in 55 minutes). Judged in `build/reports/s19-mini-judge.md`; its nine changes are applied below. The block: `s19-full-chrome-block.txt`; the references: `sources/art/s19-full/refs/` and `refs.zip`.

**Rules that shape it (Zafar, 9 Nov):** pieces, never screens (PRC-16); the stone tray is drawn in code, so only the bowls and items are asked for (ART-69); no stove from ChatGPT, chai's hob everywhere (SH-246); no oval plate or tray (ART-71); every utensil wood and metal (SAM-34); the fold is a rig from pieces on magenta (SAM-21); only art the game will use, approved art reused and said so (art-run skill).

## 1. Reused, not redrawn

| Piece | From | Note |
|---|---|---|
| Chaat bowl, empty | mini C1-1 (cut) | floor ~50% of the bowl: the toppings scale to it |
| Potato cubes, chickpeas, sev | mini C2-2, C3-2, C4-1 (cut at ~0.7, one code shadow; sev despilled) | |
| Steel frying pan | mini E1-1, the steel pan (cut) | the iron pan is dropped (judge change 6); it is the chai pan's steel |
| The grill | mini G1-2 (cut) | the inner ledge passes as a bevel at game size; corn uses the same grill (CK-67) |
| Glass mixing bowl: flour heap, wet patch, dough ball | mini B1-2 (cut) | three of the six states; the other three are line B1 below |
| The oven | mini B3-2, interior tinted warm grey and runners steel in code | the door layer cut so it can open; the dotted tray slots are code (CK-70) |
| Six dressing bowls: lemon, salt, chilli powder, green chutney, tamarind, pepper | mini T-2 (cut off the stone) | corn's flavour screen (CK-67); salt and pepper also eggs' band |
| Chai's hob, knobs | `assets/cook/items/v3/hob/` | every stove (SH-246) |
| Daar's steel pot and its states, the katori, the chopped heaps in glass bowls | `assets/cook/items/v3/daar/`, `items-s17-stove/t-*` | DAAR-48 only enlarges and recentres them |
| Samosa's karahi with oil, the paper-lined plate, the walnut board | `assets/cook/items/v3/samosa/` | the slotted spoon is redrawn wood-and-metal on its cloth (SAM-34) |
| Maani's chakla, velan, tawa, turner, the maani discs | `assets/cook/items/v3/maani/` | MAA-24 is layout; the dough heaps are redrawn smaller (line F6) |
| Sekelo's threading pieces (five kinds, raw) and heaps | `assets/cook/items/v3/sekelo/` | the threading screen is untouched; see K2 for the grill's pieces |
| Baking's band jars: flour, water, milk, sugar | `assets/cook/items/shelf-cook-{atto,paani,dudh,khun}-bare-f.webp` | chai's side-on jars fit baking's side-on band |
| Faces, pills, cards, the stone tray, the heat rings | code | |

Older sets exist (`assets/cook/items/topping-*-bowl-t.png`, `spice-*-bowl-t.png`, `veg-*-whole/halved-t.png`, `items-s17-stove/`, `proto/eggs`, `proto/corn`, `proto/baking`): a different bowl, camera and shadow in each, and the mocks Zafar picked show one cream bowl on one band. They are the fallback if a row below fails, not the plan.

## 2. New, per game

Each line is one ChatGPT image (try 1 and its corrected version both kept: two files a line). "Magenta" = flat #FF00FF, straight down, no shadow (we add shadows in code: judge change 4, generalised, since the mini's magenta shadows were replaced anyway and the sev fringed).

### Sekelo (SEK-20, option 3; ART-71)
How seen: raw skewers two by two on the stone band, the grill with four upright slots, the cooked tray on the right; a skewer is built in code from the pieces the child threaded (`mishkaki-grill.js`: the order says which kinds), so a fixed whole skewer cannot show the child's own order. Judge change 3 asked for one whole skewer line; this plan splits it into the rod and a piece set so the grill shows what was threaded. Zafar decides (question 1).
- **K1** the empty skewer rod, horizontal, point right, walnut handle and steel collar.
- **K2** the fifteen pieces on a skewer, straight down: meat, tomato, onion, pepper, potato x raw, grilled, charred; "cooked meat deep brown with char, not golden" (change 3).
- **K3** the empty brushed-steel tray, deeper than the mini's (his "deeper trays"), the rim one flat band (change 2).

### Corn (CK-67, two screens)
Screen 1 is sekelo's kit (K3, the grill, the stone band). Screen 2: each person's plate with their cob (K5) over the band of six dressings (T-2's bowls).
- **K4** three cobs: raw, turned (half-grilled), done. The dressing on a cob stays a code overlay (question 3).

### Eggs (CK-66)
Chai's hob, the steel pan (E1-1), up to four plates on the right as chai's tray, the band: a bowl of eggs, salt, pepper (T-2's).
- **K7** the fried egg's four states free of the pan (raw, cooked, overdone) and a halved boiled egg (the recipe is half fried, half boiled: `friedChance`).
- **F7** a cream bowl of six brown eggs.

### Chaat (CHT-13, CHT-04)
Top-down opaque bowl (C1-1), toppings stacked as layers, ten topping bowls on the band.
- **C5** green chutney redo: "matte dark herb green #4E7A2E, flat ribbons of uneven width, no gloss" (change 5).
- **C6-C11** onion, tomato, green chilli rings, coriander, tamarind chutney, yogurt: each alone, pieces stopping at a circle 55% of the width, no shadows (change 4).
- **F3** the ten bowls, two rows of five, the same bowl as T-2's.

### Daar (DAAR-48, 49, 50)
The pot big and central (v3), chai's hob, the knob below (SH-247 refined), the lap card in code (DAAR-50).
- **F4** the eight spice bowls (cumin, mustard, turmeric, salt, chilli powder, garlic, green chilli, cardamom: the station's `spiceShelf`).
- **K6a** the ladle with a walnut handle (his "I do like the handle for the stirrer").

### Samosa (SAM-21, SAM-34)
The fold rigged in code (`samosa_circle_rig.py`) from pieces; the fry on chai's hob with the v3 karahi and plate.
- **S1** the round sheet, top side. **S2** its underside. **S3** the filling mound alone. **S4** the closed samosa raw, golden, too dark (the pale state is a code blend of raw and golden).
- **F5** the eight filling bowls (potato, peas, onion, green chilli, coriander, mince, carrot, cabbage: `samosa.json` heaps). The v3 heaps have no bowls; this puts samosa's band in the same cream bowls as every other (question 4).
- **K6b** the slotted spoon on its folded cloth.

### Maani (MAA-24)
- **F6** two heaps of three dough balls (wheat, millet), smaller than the mock's so the pills fit.
- Round plates: **K5** (shared).

### Chop (CK-71, ART-37)
The v3 walnut board above the band; the whole items hop up and split in two.
- **P1** potato, onion, tomato: whole and two halves. **P2** green chilli, garlic, ginger: whole and two halves.
- **K6c** the chef's knife.

### Baking (CK-69, CK-70)
Side-on, glass only (change 8). The oven B3-2 with code fixes (change 9); the door as a cut layer; the slots dotted in code.
- **B1** the glass bowl: empty, a small scoop of flour, a shaggy half-mixed dough (with B1-2's three: six states).
- **B2** the jug at five levels (0, quarter, half, three quarters, full) for the concrete amounts (CK-72).
- **B3** the naan tray, raw and baked, seen from the oven's front.

### Shared
- **K5** two round plates, steel and cream: his pick, the other dropped (question 2).
- **K6** the three utensils in one line (ladle, slotted spoon on cloth, chef's knife): wood and metal.

## 3. Count

| Game | Lines | Images (2 a line) |
|---|---|---|
| Sekelo | K1, K2, K3 | 6 |
| Corn | K4 | 2 |
| Eggs | K7, F7 | 4 |
| Chaat | C5, C6, C7, C8, C9, C10, C11, F3 | 16 |
| Daar | F4 | 2 |
| Samosa | S1, S2, S3, S4, F5 | 10 |
| Maani | F6 | 2 |
| Chop | P1, P2 | 4 |
| Baking | B1, B2, B3 | 6 |
| Shared | K5, K6 | 4 |
| **Total** | **28 lines** | **56 images** |

Chats: 1 = K1-K7 (steel, tools, the grill kit; 7 lines); 2 = C5-C11, F3, F4, F5 (food and bowls straight down; 10 lines); 3 = S1-S4, P1, P2, F6, F7, then B1-B3 side-on (11 lines). About two hours at the mini's pace.

**Expected redos (5-7 lines):** the sauces (C5 failed twice in the mini; C10 and C11 are the same kind), chilli rings (C8), the fifteen-piece grid (K2: counts and the "on a skewer" view), the jug's five exact levels (B2), the halves' cut faces (P1, P2). Those go on the redo list the same evening; nothing else should need a third try.

## 4. The judge's nine changes, where each landed

1. Tray hexes, lip, bowl size, no streak: the tray is code (ART-69); the hexes are its spec (`build/reports/s19-stone-tray-fable.md`). No tray line.
2. Grill rim one flat band, coals to the edge: the grill is G1-2 reused; the wording is in the house brief for every steel rim and in K3.
3. One skewer line, horizontal, points right, the empty tray, deep-brown cooked meat: K1 + K2 + K3 (split as §2 explains; question 1).
4. Toppings stop at 55%, no shadows: C5-C11 and the brief.
5. Chutney colour and form: C5.
6. One steel pan: E1-1 reused, no pan line.
7. S1 dropped; only pieces on magenta: S1-S4.
8. Glass only, a bowl-width gap, B1's shape: B1 (and B2 the jug).
9. Oven interior grey, runners steel: B3-2 fixed in code; B3 (the tray) is lit the same way.

## 5. Questions for Zafar (yes to all except ...)

1. **Skewers:** rod + fifteen pieces (K1, K2, recommended: the grill then shows what the child threaded) or the judge's one fixed skewer raw and cooked (one line fewer, but every skewer looks the same)?
2. **Plates:** K5 draws steel and cream; recommend cream for eggs and corn (it matches the bowls) and steel for maani's two (the mock he picked). Or one for all?
3. **Corn's dressing on the cob:** stays a code overlay (recommended; six dressed-cob images would be the alternative, and CO failed before).
4. **Samosa's fillings in cream bowls (F5)** like every other band, or keep the v3 heaps with no bowls (saves a line)?
5. **The grill:** reuse G1-2 as cut (recommended) or one insurance line on magenta with change 2's wording (two more images)?
6. **The oven door:** opened by code (the door layer swings down; recommended) or a second oven image with the door open (hard to keep identical)?
