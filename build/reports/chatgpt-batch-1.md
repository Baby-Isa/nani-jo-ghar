# ChatGPT batch 1: processing report

**Processed:** 25 Sept 2026. **Source:** 42 downloads in `assets/chat gpt dump for processing/` (folder now removed), made by Claude in Chrome from `docs/chatgpt-art-prompts.md`. **Not wired into the game yet.**

**In short:** 108 item sprites sliced from 9 sheets, 14 backgrounds filed (PNG + WebP), 15 character sheets filed. 5 hard fails need a re-prompt (one of them is a missing file), plus some fixes that can be made in code. The biggest gaps for Cook are the millet (bajri) maani set, hob knobs and flame rings, the grill, and the F-view pantry items.

Contact sheets (each sprite on black and on white, all at 0.5×, with the style anchor and the approved hand for comparison):
`build/contact-sheets/chatgpt-spices.png`, `-veg-whole.png`, `-veg-cut.png`, `-toppings.png`, `-dough.png`, `-mishkaki.png`, `-serving.png`, `-vessels.png`, `-tools.png`, `-backgrounds.png`.

---

## 1. File mapping

I identified every file by looking at it. **The run log's numbering is off by one:** the batch starts at 12:57 with Kasuku, not at 01:00. The three 12_xx files are the style anchor, Nani and Kasuku, not Nani drafts. Also, 02_26_05 is a byte-identical second copy of the veg-cut sheet, and the worktop's "evening" (02_46_30) is a byte-identical copy of the day image.

| Download | Log # | Saved as | Note |
|---|---|---|---|
| 12_15_30 | – | *(dropped)* | The style anchor again (a re-encode of `sources/art/style-anchor-v1.png`, mean pixel difference 1.3/255) |
| 12_49_30 | – | `sources/art/characters/char-nani-v2.png` | The approved Nani sheet v2 (the same image as `nani-sheet-v2-approved.png` on `claude/art-hands-v1`, re-downloaded) |
| 12_57_50 | 1 | `sources/art/characters/char-kasuku-v1.png` | |
| 01_00_47 | 2 | `sources/art/characters/char-kasuku-poses-v1.png` | |
| 01_03_58 | 3 | `sources/art/characters/char-family-lineup-v1.png` | |
| 01_06_35 | 4 | `sources/art/characters/char-nana-v1.png` | |
| 01_09_42 | 5 | `sources/art/characters/char-ma-v1.png` | |
| 01_12_36 | 6 | `sources/art/characters/char-ali-v1.png` | |
| 01_15_04 | 7 | `sources/art/characters/char-isa-v1.png` | |
| 01_17_33 | 8 | `sources/art/characters/char-nana-expressions-v1.png` | |
| 01_19_30 | 9 | `sources/art/characters/char-nana-impatient-v1.png` | |
| 01_21_47 | 10 | `sources/art/characters/char-ma-expressions-v1.png` | |
| 01_23_39 | 11 | `sources/art/characters/char-ma-impatient-v1.png` | |
| 01_25_57 | 12 | `sources/art/characters/char-ali-expressions-v1.png` | |
| 01_29_20 | 13 | `sources/art/characters/char-ali-impatient-v1.png` | |
| 02_15_33 | 14 | `sources/art/characters/char-isa-expressions-v1.png` | |
| 02_21_46 | 15 | `sources/art/chatgpt/sheet-spices-t-v1.png` | magenta |
| 02_23_51 | 16 | `sources/art/chatgpt/sheet-veg-whole-t-v1.png` | magenta |
| 02_25_58 | 17 | `sources/art/chatgpt/sheet-veg-cut-t-v1.png` | magenta |
| 02_26_05 | – | *(dropped)* | Byte-identical duplicate of 02_25_58 |
| 02_28_06 | 18 | `sources/art/chatgpt/sheet-toppings-t-v1.png` | magenta |
| 02_31_06 | 19 | `sources/art/chatgpt/sheet-dough-t-v1.png` | magenta |
| 02_33_46 | 20 | `sources/art/chatgpt/sheet-mishkaki-pieces-t-v1.png` | magenta |
| 02_36_10 | 21 | `sources/art/chatgpt/sheet-serving-t-v1.png` | magenta |
| 02_39_31 | 22 | `sources/art/chatgpt/sheet-vessels-v1.png` | grey |
| 02_41_42 | 23 | `sources/art/chatgpt/sheet-tools-v1.png` | grey |
| 02_43_46 | 24 | `sources/art/chatgpt/bg-cook-worktop-t-v1.png` | |
| 02_46_30 | 25 | *(dropped)* | **Supposed to be the worktop evening, but it's byte-identical to the day image. Still to make.** |
| 02_48_24 | 26 | `sources/art/chatgpt/bg-cook-worktop-t-night-v1.png` | |
| 02_55_51 | 27 | `sources/art/chatgpt/bg-cook-hob-t-v1.png` | |
| 02_57_07 | 28 | `sources/art/chatgpt/bg-cook-hob-t-evening-v1.png` | |
| 02_58_40 | 29 | `sources/art/chatgpt/bg-cook-hob-t-night-v1.png` | |
| 03_00_55 | 30 | `sources/art/chatgpt/bg-nani-kitchen-e-v1.png` | |
| 03_02_18 | 31 | `sources/art/chatgpt/bg-nani-kitchen-e-evening-v1.png` | |
| 03_03_35 | 32 | `sources/art/chatgpt/bg-nani-kitchen-e-night-v1.png` | |
| 03_05_53 | 33 | `sources/art/chatgpt/bg-bigma-room-e-v1.png` | |
| 03_07_37 | 34 | `sources/art/chatgpt/bg-bigma-room-e-evening-v1.png` | |
| 03_09_24 | 35 | `sources/art/chatgpt/bg-bigma-room-e-night-v1.png` | |
| 03_11_28 | 36 | `sources/art/chatgpt/bg-bazaar-stall-e-v1.png` | |
| 03_13_15 | 37 | `sources/art/chatgpt/bg-bazaar-stall-e-evening-v1.png` | |
| 03_14_54 | 38 | `sources/art/chatgpt/bg-bazaar-stall-e-night-v1.png` | |
| 03_18_51 | 39 | `sources/art/chatgpt/mehndi-back-of-hand-v1.png` | 1254×1254, flat line art (a pattern reference for the girl-Eid hand reskin, not a sprite) |

The dropped files are still in git history (commit `44daf63`).

---

## 2. Sliced items: 108 sprites in `assets/cook/items/`

**Names:** `<group>-<item>-<state>-<view>.png`. The item uses its Kutchi word where `data/cook.json` has one (dungri, tameto, bataato, lasan, marcha, aadu, limu, vatana, hardar, jeeru, rai, elchi, loon, lal-marcha, khun, atto, channa, dai) and English otherwise (pepper, sev, keema, ghee), or the placeholder word id (dhana, amli, lili). The view comes last (`-t` top-down, `-f` front). The re-run script `build/slice_chatgpt_batch1.sh` lists every cell's name in sheet order.

| Group | Sheet | Count | Files |
|---|---|---|---|
| Spices and dry goods (bowl) | spices | 12 | `spice-{hardar,lal-marcha,jeeru,rai,elchi,loon}-bowl-t`, `dry-{khun,chai-leaves,atto,daal,ghee}-bowl-t`, `veg-aadu-grated-bowl-t` |
| Whole veg | veg-whole | 12 | `veg-{dungri,tameto,bataato,lasan,marcha,aadu,limu,pepper}-whole-t`, `veg-bataato-peeled-t`, `veg-lasan-clove-t`, `veg-dhana-bunch-t`, `veg-dungri-peeled-t` |
| Cut veg | veg-cut | 12 | `veg-{dungri,tameto,bataato,limu}-halved-t`, `veg-{dungri,tameto,lasan,marcha,aadu,dhana}-chopped-t`, `veg-bataato-cubed-t`, `veg-limu-wedge-t` |
| Toppings (bowl) | toppings | 12 | `topping-{channa,bataato-boiled,dai,amli,lili,dungri-chopped,tameto-chopped,marcha-chopped,dhana-chopped,sev,vatana,keema}-bowl-t` |
| Dough, maani, samosa | dough | 12 | `dough-{rough,ball}-t`, `maani-{raw,raw-torn,cooked-half,cooked-puffed,burnt}-t`, `samosa-{pastry-strip,filled,folded,fried-golden,burnt}-t` |
| Mishkaki pieces | mishkaki | 12 | `mishkaki-{meat,pepper,dungri,tameto}-{raw,grilled,charred}-t` |
| Skewers, chips, serving | serving | 12 | `skewer-{empty,meat-raw,meat-grilled,meat-charred,mixed-grilled}-t`, `chips-{raw,golden,burnt}-t`, `chaat-bowl-{empty,full}-t`, `plate-enamel-empty-t`, `mishkaki-plated-t` |
| Vessels (grey key) | vessels | 12 | `vessel-{saucepan,pot,tadka-pan,tawa,kadai-oil,thali,katori,masala-dabba}-t`, `vessel-{water-jug,milk-jug}-f`, `vessel-glass-chai-{empty,full}-f` |
| Tools (grey key) | tools | 12 | `tool-{knife,ladle,spatula,slotted-spoon,tongs,teaspoon,tea-strainer,chips-basket,velan,chakla,board,wooden-spoon}-t` |

**How they're cut (`build/slice_sheet.py`, reworked):**
- It follows the Naming Convention's blob method: the key colour is measured from the sheet's border, each whole blob goes to the cell holding its centroid, specks are dropped, and each sprite is trimmed to its content with a 16 px pad. Every cell of all nine sheets came out as one clean item; nothing was clipped or taken from a neighbour.
- **Soft edges instead of binary alpha.** The 3D look has no outline to hide a hard edge in. Each edge pixel's alpha is its projection between the key and the nearest solid colour, and it takes that solid colour, so no key colour is left in the edge.
- **Magenta despill:** magenta showing through gaps inside an item (between coriander stalks, inside chilli rings) is made see-through in proportion to how magenta it is. Red onion is spared (`--keep-purple`) because it is nearly the key's hue.
- **Grey key (`--key grey`, new).** Steel is grey too, so only flat near-key regions count as background: ones touching the sheet edge, or enclosed holes of a real size (handle loops). Steel reflections and brushed gradients are never flat, so they stay. `--glass` (the chai glasses) and `--sheer` (the tea strainer and the chips basket's wire mesh) use a difference matte inside the filled silhouette: glass keeps its highlights and dark edges and goes see-through where the grey showed, and mesh shows the backing through its holes.
- **Fringe check:** after cutting, no sprite has magenta pixels at its edge except the onions, which are pink themselves. No sprite keeps grey key pixels at its edge.

---

## 3. Backgrounds

Each file is the native 1536×1024 PNG (the same bytes as the source) plus a quality-90 WebP (44–313 KB). None is cropped to 16:9 yet. The prompts kept the content inside the central band (y 80–944 for 1536×864). The dashed lines on the contact sheet show that crop.

| Scene | Folder | Day | Evening | Night |
|---|---|---|---|---|
| Worktop (T) | `assets/cook/bg/` | ✓ | **missing** | ✓ |
| Hob (T) | `assets/cook/bg/` | ✓ | ✓ | ✓ |
| Nani's kitchen (E) | `assets/backgrounds/` | ✓ | ✓ | ✓ |
| Big Ma's room (E) | `assets/backgrounds/` | ✓ | ✓ | ✓ |
| Bazaar stall (E) | `assets/backgrounds/` | ✓ | ✓ | ✓ |

**Alignment (`build/bg_align_check.py`).** It compares edge maps of locally normalised luminance, so the lighting change doesn't count. For each relight it reports the global shift from phase correlation against day, the worst of 12 tiles, and the share of day's strong edges that still have an edge within 2 px. For scale: two different scenes (kitchen against Big Ma's room) score 31% edges kept, with 104 px tile drift.

| Relight | Global shift | Worst tile | Edges kept | Verdict |
|---|---|---|---|---|
| worktop night | 0,0 | 1 px | 81% | aligned (the veins fade under the lamp) |
| hob evening | 0,0 | 1 px | 95% | aligned |
| hob night | 0,0 | 2 px | 91% | aligned |
| kitchen evening | 0,1 | 1 px | 87% | aligned |
| kitchen night | 1,1 | 2 px | 82% | aligned |
| Big Ma evening | 0,1 | 1 px | 86% | aligned |
| **Big Ma night** | 0,2 | **5 px** | 75% | **drift:** the table's front edge and the window frame move 3–5 px. Fine for a hard cut; for a crossfade, warp it locally or regenerate |
| Bazaar evening | 0,1 | 2 px | 84% | aligned |
| Bazaar night | 0,1 | 3 px | 77% | slight drift at the counter foot and on the ground; fine for a cut |

The edges that are lost are sun patches and window light, as expected.

**Against the Art Bible:**
- Worktop and hob: straight down, empty, light from the upper left, bottom 20% clear. There are no knobs or flames on the hob (correct: they're separate sprites).
- The hob panel is 822×511 px, which gives a scene scale of **13.7 px/cm at 1536 wide (14.3 px/cm on the 1600 stage)**. It's drawn wider than 60×50 cm (about 60×37), but that's harmless.
- Kitchen: the island top is clear and level at about 64–67%, the shelves are empty with their tops visible, and there's no red behind the head zone.
- Big Ma's room: the table top is clear, the only fixed object is the sewing machine, and the wall behind the chair is plain.
- Bazaar: ten empty holders (alternating baskets and trays) and no text. The counter top sits at about 52%, not the 62% asked for (minor: the game places holders from data).

---

## 4. Character sheets (filed in `sources/art/characters/`, not sliced)

| Sheet | Panels |
|---|---|
| `char-nani-v2` (approved) | Turnaround ×4; waist-up behind the counter; both hands (back, rings, tennis bracelet); close-ups: glasses, aqiq ring, diamond ring, cuff embroidery; 5 swatches. Light-blue background. No expressions sheet yet |
| `char-kasuku-v1` | 8 poses on the perch: side facing left, front, head tilt, beak open "talking"; flap up, flap down; walk frames 1 and 2; 4 swatches. Matches the prompt |
| `char-kasuku-poses-v1` | Claude in Chrome's own prompt: preening, head tucked asleep, fluffed up, hanging upside down with wings open; head close-ups: squint, tilt, neutral, wink |
| `char-family-lineup-v1` | Nana, Ma, Isa (sitting), Ali, full body. Isa sits between Ma and Ali rather than in front of Ma |
| `char-nana-v1` | Turnaround ×4; waist-up behind the counter; both hands with cuffs; 6 swatches |
| `char-ma-v1` | Turnaround ×4; waist-up behind the counter; both hands (bare forearms, no sleeve); 10 swatches |
| `char-ali-v1` | Turnaround ×4; chest-up behind the counter; both hands; 10 swatches |
| `char-isa-v1` | Sitting front, three-quarter and side; held up with arms raised (an adult's hands in frame); crawling; asleep; 7 swatches |
| `char-{nana,ma,ali,isa}-expressions-v1` | 12 each (4×3) in the prompt's order. Ali's sheet has white grid lines between panels. Isa's used Claude in Chrome's own prompt |
| `char-{nana,ma,ali}-impatient-v1` | One full-body pose each: arms folded, foot tapping, with small motion arcs by the foot (crop them out). The game needs the waist-up crop |

Not in this batch: Big Ma, the doctor, Simba, Zazu, Nani's expressions, and blink (eyes closed) frames.

---

## 5. QA against the Art Bible (section 10)

**Everything passes on:**
- **Style (#9):** it matches the style anchor and the approved hands (soft 3D, no outlines, warm upper-left light).
- **No text (#12)** and **no shadows** (the prompts asked for none; code draws contact shadows, as section 2 says).
- **Cultural accuracy (#13):** halal lamb, a Khoja kitchen, steel ware.
- **Clean alpha (#7)** on black and white. The only leftover is a few dull red-brown hairlines where magenta sat between coriander stalks and inside chilli rings (`veg-dhana-bunch-t`, `veg-marcha-chopped-t`), which don't show at game size.

**Scale (#3).** Code is meant to scale each sprite by its real size in cm (section 4), so the sheets' own relative scale only matters for resolution. The sheets did ignore it: the dough ball is 0.75× the maani, samosas are bigger than maani, and the chips heaps are as wide as the plate. Size order is kept within the veg sheet (the garlic clove is smallest).

**Resolution against the hob's 14.3 px/cm** (with the 1.5× readability boost for items under 7 cm):
- 71 sprites are at 1.5× or more their on-stage size (sharp).
- 19 are at 1.0–1.5×.
- 18 are **below 1×**, so they'll look soft at true scale. These are the big flat things drawn small on the sheets: `vessel-tawa-t` 0.67, `tool-board-t` 0.65, `vessel-saucepan-t` 0.69, `vessel-thali-t` 0.71, `tool-chips-basket-t` 0.75, `vessel-tadka-pan-t` 0.76, `vessel-kadai-oil-t` 0.77, `tool-chakla-t` 0.82, `plate-enamel-empty-t` 0.87, `vessel-pot-t` 0.88, `mishkaki-plated-t` 0.89, `tool-velan-t` 0.89, and the ladle, spatula, slotted spoon, skewer and samosa strip at 0.96–0.99.
- Regenerate the big vessels one per 1024 image when their station is wired, if they look soft.

### Fails, with a one-line re-prompt each

Send each one in a fresh chat with the style anchor attached. "Grey" means the #808080 background line from sheet 8.

| # | Asset | Why it fails | Re-prompt |
|---|---|---|---|
| 1 | `bg-cook-worktop-t-evening-v1` | **Missing:** the download was a copy of the day image | In the worktop chat, attach `bg-cook-worktop-t-v1.png` and send the section 4.6 golden-evening prompt unchanged |
| 2 | `veg-dungri-whole-t` / `veg-dungri-peeled-t` | The whole and peeled onions are the same picture: no papery skin on the whole one; the peeled one is hot magenta-pink (nearly the key colour) instead of glossy purple layers | "1024×1024, flat #808080 grey background, no shadow, seen straight down: one whole red onion in its dry, papery, matte copper-purple skin with a few flaky edges and a dry root tuft, and beside it the same onion peeled, glossy deep purple with pale streaks, in the attached style." |
| 3 | `tool-velan-t` | A Western rolling pin with handles; the Art Bible wants the thin, tapered Gujarati velan (#13) | "On flat #808080 grey, straight down, one thin wooden velan rolling pin, 35 cm, no handles, tapering evenly from a thick middle to narrow rounded ends, lying diagonally, no shadow, in the attached style." |
| 4 | `tool-chakla-t` | Camera (#1): its feet show below the disc, so it's a ¾ view, not straight down | "On flat #808080 grey, seen from directly above, straight down: one round pale wooden chakla rolling board, 25 cm, a perfect circle, only its top face visible (no feet, no side), no shadow, in the attached style." |
| 5 | `vessel-thali-t` | Camera (#1): 8% oval (the whole vessel sheet's camera is tilted about 20°; the thali is the one where it shows) | "On flat #808080 grey, seen from directly above, straight down: one round steel thali with a low raised rim, a perfect circle, no shadow, in the attached style." (Or stretch it 1.08× vertically in code.) |

**Fixable in code (no re-prompt needed):**
- **The maani states don't match.** `maani-cooked-half-t` and `-puffed-t` are 8% and 12% oval and 4% wider than `maani-raw-t` (322 px against 310), so swapping states on the tawa would "pop". Scale each to the raw maani's width and to a circle when wiring.
- **Salt and sugar** (`spice-loon-bowl-t`, `dry-khun-bowl-t`) are near twins at 90 px. They're listed as look-alikes in `cook.json`, so that may be intended, but the pantry then needs another cue (the container).
- The **board** shows a sliver of its front edge (slight tilt), which is acceptable.
- The **mehndi** was made without the anchor: flat line art. It's fine as a decal for the reskin but isn't a sprite.

---

## 6. What's missing for Cook's six dishes

What each dish's stations draw (from `data/cook.json` recipes and mechanics, `js/cook/art.js` and `js/cook/stations.js`), against what batch 1 now covers. ✓ = covered by a batch-1 sprite.

| Dish (stations) | Covered by batch 1 | Missing |
|---|---|---|
| **Chai** (pour, add, boil, count, pour; chai tray) | Saucepan ✓, milk jug (F) ✓, water jug (F) ✓, empty and full chai glasses ✓, sugar ✓ and tea leaves ✓ in bowls, elchi ✓ and grated aadu ✓ extras, teaspoon ✓, hob bg ✓, worktop bg ✓ | **Hob knob** (it turns) and **flame ring**; the **chai tray** itself; tea tin and sugar jar in F view for the pantry; a stream sprite for pouring; the chai machine prop. Open question: jugs are F view but the tray station is T (the pour needs a tilting jug; decide the view) |
| **Maani** (roll, tawa; maani line) | Dough ball ✓, raw/torn/half/puffed/burnt maani ✓, atto ✓, ghee ✓, tawa ✓, plate ✓ | **The whole millet (bajri) set** (`cook-bajrmaani` is required: a darker grey-brown dough ball plus raw, half, puffed and burnt maani); a good **velan** and a top-down **chakla** (fails 3 and 4); flame ring and knob; a serving basket or cloth for the stack (optional) |
| **Daal** (chop, tadka, stir) | Whole, halved and chopped onion, tomato, potato, chilli, ginger and garlic ✓; all six tadka spices in bowls ✓; tadka pan ✓; daal pot ✓; dry daal ✓; knife ✓, ladle ✓, wooden spoon ✓, katori ✓ | **Garlic halved** (the chop pool can throw a bulb); ginger halved; flame ring and knob; cooked daal and hot oil are code discs (no sprite needed) |
| **Chaat** (chop, assemble) | The chop veg ✓; all ten toppings in their source bowls ✓; empty and full chaat bowls ✓ | **In-bowl topping layers:** the scatters the assemble station stacks into the serving bowl, one per topping (chana, potato, dai, amli and lili drizzles, onion, tomato, chilli, dhana, sev). Code draws them now. The chopped heaps from the veg-cut sheet can stand in for onion, tomato, chilli and dhana |
| **Samosa** (fill, fold, fry) | Pastry strip ✓, filled strip ✓ (potato and pea only), folded ✓, golden ✓, burnt ✓; filling bowls ✓ (keema, potato, vatana, onion, chilli, dhana); kadai with oil ✓; slotted spoon ✓; chips basket ✓; raw, golden and burnt chips ✓ | **Fold stages 1 and 2** (the fold mechanic has four pastry states; batch 1 has the open strip and the folded samosa only); a filling layer on the strip per filling (keema looks different from potato); an **underdone "too pale"** samosa (or a code tint); flame ring and knob |
| **Mishkaki** (thread, grill, fry) | Empty skewer ✓; single meat, pepper, onion and tomato pieces, each raw, grilled and charred ✓; meat skewers raw/grilled/charred ✓; mixed skewer grilled ✓; plate and plated ✓; lemon wedge ✓; chips ✓ | **The grill** (a jiko or charcoal grill with its rack and coals: T sprite or station bg); the **grill-station background** (the code draws "bg:wood"); **bowls of pieces** for threading (or code places pieces in a katori); a single **potato cube** for the decoy (`decoyPool: veg-01`; it can be cut from `veg-bataato-cubed-t`); raw and charred mixed skewers (code can build them from pieces) |
| **All stations** | Worktop and hob backgrounds ✓ | **F-view pantry items** (sheet 2F was optional and not made; the fetch station shows each word's `image` on eye-level shelves): tins, jars and jugs for atto, daal, chai, dudh, khun, elchi, loon, plus onion, tomato, garlic, chilli, ginger and potato in F. A **board-station background**, or bake `tool-board-t` into a worktop (never both; section 5 "no doubled surfaces"). **Hands** come from `claude/art-hands-v1` (not this batch). Customers need their waist-up crops cut from the new sheets |

**Suggested next ChatGPT sheets:**
1. Bajri maani set (magenta, 6 cells).
2. Hob knob ×2 states plus flame ring (grey).
3. Chai tray, jiko grill and a potato cube (grey).
4. Samosa fold stages (magenta).
5. Sheet 2F front-view veg, plus a containers sheet for the pantry (grey).
6. Topping scatters for the chaat layers (magenta).
7. The worktop evening relight, and fails 2–5.
