# Size classes: how, where, when (Fable, 6 Nov)

Zafar's rule (6 Nov): no true sizes; L 100% / M 90% / S 81% of the slot; a 40 CSS px floor at 740x320; the art draws every item the same height; the class is data. His question: how and when is each item classed.

## 1. How: one question, three answers

**Ask: how do you hold it?** Two hands (or taller than a milk carton) = **L**. One hand = **M**. Fingers = **S**. The ruler only breaks ties (longest side over 20 cm, 10-20, under 10). Two flags, never a fourth size:

- **LONG** (spoons, scissors, a syringe, a rolling pin): classed by the long side, applied to the slot's *long* side (width lying flat, as on the belt; height standing).
- **W** (a bread loaf, an egg box): fitted to the slot's width, height follows.
- Round and top-down things: the longer side of the picture's box. **Station pieces** (pots, tawa, trays, the belt) are outside: the scene's layout sizes them.
- A thing in two scenes keeps one class; only the slot changes. Two views (shelf jar, station katori) are two rows.

| Item | Where | Class |
|---|---|---|
| water bottle, milk carton, flour bag | chai shelf, fridge, pantry | L |
| tea jar, sugar jar, yoghurt tub (today 0.7) | chai shelf, fridge | M |
| spice jars; garlic, lemon, egg; chai glass | chai, pantry, daar, eggs, hiccups | S |
| rolling pin; ladle, knife | maani; daar | LONG L |
| tea strainer; scissors | chai; sewing | LONG M |
| teaspoon; syringe, thermometer, tweezers | chai; clinic belt (flat: width) | LONG S |
| crutches (the cap, however big) | clinic belt | L |
| plaster; bandage roll | clinic | S; M |
| bread loaf, egg box | eggs | W |
| chaat bowl, chai tray, karai | stations | STN |

## 2. Where

One `size` field per item in the mode's own catalogue: `data/cook.json` `words[id].size` (the shelf list's old number in `art.sprites.shelf` becomes the letter: 1 → L, 0.9/0.85 → M, 0.8/0.7 → S); `data/clinic.json` `items[id].size` (the field exists; its `.small`/`.big` CSS becomes three tokens); `data/dress.json` for the sewing tools. **Missing = M** (the commonest: 257 of the CSV's 478), and a check names it. `look-rules.json` keeps only the three factors.

## 3. When

**Now, not at the end.** Classing needs no art: the stove-400 CSV's 478 rows are classed; the live items (chai 8, pantry 64, daar's shelf, clinic 53 plus 14 heal items, sewing 4: about 150) take an hour. **As items come:** the art plan's CSV `size` column is the source, the cut step writes it into the data, the brief template carries the line, a check fails a slot item without a class. **One thing waits:** the shelf code lands with the stove-400 cut, so chai changes once (its spice jars drop to 40 px at 740x320).

## 4. How the game applies it; the proof

One helper, `St.classFit(S, key, size, room)` in `station-lib.js`: height = room × factor, never under 40 CSS px; LONG on the long side; W by width. It replaces chai's per-group `SHELF_K`, daar's width fit and the pantry's `Art.shelfSize`; the clinic gets one `--size-k` per class. Where the floor lifts S or M, the check flags the scene (its slot is too small); L never shrinks.

**`sizecheck.mjs`** (in `checks.mjs`): a page at the four sizes exposes each item (id, class, opaque px, room); asserts height ÷ room within 3% of the factor (or at the floor, flagged), S ≥ 40 CSS px at 740x320, no inversion in a row, no class missing. `artcolour.py` then checks only that every piece fills at least 85% of its cell.

## 5. Cost

150 live items: an hour. Code (helper, chai, daar, pantry, clinic): half a day mid-tier. The tool: half a day mid-tier. The judge's look: top model, short. About one day.

## 6. Decisions

1. Classify by how it is held; the ruler breaks ties. **Yes.**
2. LONG and W as flags; STN outside. **Yes.**
3. One `size` field per item in each mode's data; missing = M. **Yes.**
4. Class the 150 live items now; the CSV column sets each new one; a check fails a missing class. **Yes.**
5. The floor flags a scene rather than shrinking L. **Yes.**
6. Art bible §4 (`size_cm`, provisional) rewritten to this rule. **Yes.**

## Implementation plan

| Step | Files | Size | Risk |
|---|---|---|---|
| Class the live items | `cook.json`, `clinic.json`, `dress.json` | 1 h | the clinic's judgement calls, listed for Zafar |
| `St.classFit`; chai, daar, pantry, clinic | `station-lib.js`, `chai-tray.js`, `daar.js`, `fetch.js`, `clinic.css` | half day | chai's shelf shifts: lab shot at 740x320 first |
| `sizecheck.mjs`, docs | `build/tools/review/`, `docs/tools.md`, `art-bible.md` §4, `look-rules.json` | half day | none |

## Proof

Read: `CLAUDE.md`; the stove report §3 and its second read; `look-rules.json` `sizes`; `cook.json` (`words` 59; `art.sprites.shelf` 64 at 1 / 0.9 / 0.85 / 0.8 / 0.7); `clinic.json` `items` 53 (`size` read at `kit.js` 246, 451); the heal games' `items`; `dress.json`; the CSV's `size` column (F: L 10, M 53, S 61, W 6; T: L 79, M 204, S 20, LONG 26, STN 19); `St.shelfFit` (`station-lib.js` 280), `SHELF_K` (`chai-tray.js` 117, 819), `daar.js` 590, `fetch.js` 102; `artcolour.py` 496-610; `art-bible.md` §4. `checks.mjs --only docs`: ok with this file.
