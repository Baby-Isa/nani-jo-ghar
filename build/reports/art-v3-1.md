# Cook v3.1 art and follow-ups (30 Sept)

Branch `claude/cook-v3-1-art`. The 13 overnight images (`docs/chatgpt-art-prompts-overnight-2026-09-30.md`: R1–R8 for Cook,
CI1–CI5 for the clinic) are cut, reviewed and wired, along with Zafar's answers to the v3 station reports
(`docs/feedback/cook-playtest-2026-09-29.md`, last section).

- **Cutter:** `build/cut_cook_v3_1.py` reuses `build/cut_cook_v3.py`'s functions: colour-to-alpha edges, flat grey
  inside loops made transparent (and checked), ChatGPT's drawn shadows removed, registered canvases.
- **Contact sheets** (every new cut on the game's cream): `build/reports/art-v3-1/contact-{hob,daar,sekelo,clinic}.png`,
  plus `contact-edges-zoom.png` (edges at 2x) and `plate-v2-lines.png` (R6's measured skewer lines drawn on the plates).
- **Shots:** `build/reports/art-v3-1/<station>-<viewport>-L<n>[-…]/`. The round-1 flaws are in `flaws/`.

## 1. Image by image

| # | file(s) | verdict | why |
|---|---|---|---|
| R1 | `hob/hob-4-v2` (1546x530) | **pass** | Four round burners, even gaps, even frame. At the v3 cap size (71 px, `HOB_CAP_R`) the hob is 1546 px wide, not 1753 (a burner is 0.24 of the hob, not 0.24 of a wider one), so for the same width a station can draw its burners bigger. **Weak point:** the "plain front strip" is thin. The supports reach 0.84 of the height, so `frontY` (the knobs' line) is 0.893, close to the bottom frame. See §4 (kit). |
| R2 | `hob/knob-off-v2`, `knob-on-v2` (400x400) | **pass** | The same knob; the "on" glow is bold and wide, and reads at coin size. Two cut fixes: the on cell's glow spills over the sheet's middle into the off cell, so the off knob is cut clear of it and clipped at its gold ring; and both are registered on the gold ring (a filled disc), so ChatGPT's shadow doesn't pull the centre (`fit_px` 1.0 and 0.5). The glow fades out over the last 12% of the canvas, so it's never squared off. |
| R3 | `daar/ladle-v2` (833x1039) | **pass, with a note** | As the orchestrator saw: a **deep steel dipper seen three-quarter on**, not the foreshortened top-down ladle. Clean edges, no pot. Its bowl is measured as the biggest circle inside the cut (`bowl_fit: inscribed`), because the handle joins the rim and spoils a rim fit. **In the pot** it reads as a small steel cup sitting in the daar with its handle curling up and right. It's clearly a kitchen tool being used, but more "measuring cup" than "ladle". Redo if Zafar wants a real ladle (the prompt's wording didn't get one twice). |
| R4 | `daar/pot-tomato-only`, `-chilli-only`, `-onion-chilli`, `-tomato-chilli`, `-tadka-v2`, `daar-bowl-trivet-plain` | **pass** | Each cell shows only the vegetables it names. They're scaled and placed onto **D1's pot canvas** (430x348): each fitted rim lands on D1's rim (r 0.3567 vs D1's 0.3566, centre within 0.001), so they cross-fade in place with D1's pictures. ChatGPT drew thin light lines between the cells, which threw `grid_boxes` off (the top pots came out cut in half: fixed with equal cells, inset on the inner edges only). The trivet bowl crosses the row line, so it has its own box, with the line opened away. `pot-tadka-v2` has only mustard and cumin (no dry chilli, no curry leaves: no daal order has them). |
| R5 | `daar/chop-heap-{onion,tomato,chilli}`, `chop-piece-*` | **pass** | Clearly chopped onion, tomato and chilli rings: no flowers or berries, no bowls. The single pieces are at the heaps' scale (one canvas each set). |
| R6 | `sekelo/plate-0-v2` … `plate-4-v2` (465x499) | **pass, with a flaw** | The same plate in the same place (registered on the rim), a clean empty plate, handles off the plate, skewers fanned. **Flaw:** the "four" cell has **five** bamboo sticks and four handles, so the lowest short one is left empty in the game (see §5). The fan converges at the handles, so the shared parallel-line finder mixed the skewers up. `build/measure_sekelo_v3.py --v2` finds each fanned skewer as its own line (RANSAC over the wood pixels); the lines drawn on the plates are in `plate-v2-lines.png`. |
| R7 | `sekelo/potato-{raw,grilled,charred}`, `{onion,tomato,pepper}-charred`, `heap-potato` | **pass** | The potato is clearly potato in all three states. The charred onion stays purple, the tomato red and the pepper green: none can be taken for charred meat. The heap is five loose chunks, smaller in its cell than K5's heaps, so it's cut to a tight canvas (the shelf sizes heaps by canvas width). |
| R8 | `daar/dial-{stopped,slow,fast,spill}` | **pass** | Four flat cream icons in one style. The tortoise and hare read at fingernail size. They're recoloured to one flat #F5E6C8, with a soft alpha from the luminance. ChatGPT drew light lines between the cells, so each icon is cut inside its own cell. |
| CI1 | `clinic/items-v2/` plasters box … dentist drill | **pass** | Nine items, clear, three-quarter on a flat base, no writing. The dentist's drill has a small bur at its tip; it's not scary at this size, but say if it should go. |
| CI2 | reflex hammer … apple | **pass** | No needle on the syringe. The pen torch's drawn light spot on the counter (a grey blob) is dropped (one piece per item). The stethoscope keeps all its parts. |
| CI3 | tumbler … ginger water | **pass** | The turmeric milk is golden and the ginger water pale amber. The glass things are cut see-through. |
| CI4 | `plaster-*` (11) | **pass** | All the same size (one canvas; the measured box is 330–332 x 145–146 px in every cell), the colours consistent, the pairs in the order asked. |
| CI5 | `jug-{hot,cold,lukewarm}`, `basin` | **pass, with a note** | The same jug three times (one canvas, registered on the bottom-centre); the basin is a top-down circle. The hot jug's steam is colour-to-alpha above the rim, a soft veil, though it ends in a faint straight edge at the rim line. `jug-lukewarm` trips the grey-leftover check (309 px): that's its calm water surface, which really is grey, not the background (checked on cream). |

`python3 build/check_vessel_meta.py` re-measures every new round thing: the pots, the plates, the knobs, the trivet
bowl, the ladle's bowl and the clinic's basin (new `check_clinic_items`). It also checks daar.js's `LADLE` and `TRIVET_PLAIN`, every
`POTS` state on the pot's canvas, and grill.js's plate table against the art.

## 2. What was wired

### Daar (`js/cook/stations/daar.js`)
- **The pot shows only what went in (R4).** The pictured vegetables so far (onion, tomato, chilli) pick one of 8 pictures:
  - seeds, onion, tomato-only, onion+tomato, chilli-only, onion+chilli, tomato+chilli, all three.
  - Garlic or potato changes nothing.
  - A no-onion order never shows onion (shot: `daar-*-L1-noonion/*-veg-in.png`).
  - The tadka picture is `pot-tadka-v2` (mustard and cumin only), in the pot and in the stir.
- **The plain daar waits (R4 cell 6)** on its trivet beside the pot and pours in. The review bowl is still the tadka one (D1's trivet bowl), sized to match.
- **The piles (R5):** each right slice sends one chopped piece flying off the knife, which lands as its heap. The heaps are a little smaller than the old piles and further apart, so two heaps stay two (round-1 flaw: two chilli heaps merged into one).
- **The ladle (R3):** `ladle-v2`, placed by its measured bowl.
- **The dial (R8):** the four icons on their bands. The face is still drawn in code; the drawn icons stay only as a fallback while the images load. Round-1 flaw: the stopped icon poked out past the face's left edge; the radii are now kept inside.
- **Zafar's answer (Q7):** Nani's chop card is **words only from level 3** (*dungri*, *tameto*). How many is heard, as on the order card.
- **Shots:** `Cook.daarForce` (lab only) and `shoot_daar_v3.py --force '{"onions": 0}'` give an order with no onion.

### Sekelo (`js/cook/mechanics/grill.js`, `data/stations/mishkaki-grill.json`)
- **The plate is `plate-N-v2` (R6).** `SK.V3.plate` holds the measured rim and each fanned skewer's line. The pieces sit along them as before (the code places pieces on whatever lines are measured).
  - `PLATE_PIECE` goes 0.74 → 0.9.
  - The alternate stagger (48) goes, and every plated chunk moves 60 local px toward its tip (90 pushed the top chunk past the tip) (`PLATE_SHIFT`), where the fan is widest.
  - Round-1 flaw: at 3 skewers, the chunks by the handles overlapped where the skewers converge.
- **The clean empty plate** replaces the patched plate-0.
- **R7:** the decoy potato (`veg-01`) has its own chunks (`v3pieces`) and its own heap (`bowls`), no longer samosa's diced potato. Every piece loads a charred picture.
  - A charred vegetable shows its own charred chunk (it's no longer the grilled one tinted brown).
  - The served plate only darkens a piece that has no charred picture.

### Samosa (`js/cook/stations/samosa.js`, `js/cook/order.js`, `js/cook/recipes.js`, `js/cook/ui.js`, `data/cook.json`)
- **The base filling goes first on the card:** a recipe option in the shared `order.js`, default off, on only for samosa.
  - Its value names the slot whose first item is the base, per block: `"baseFirst": ["kinds", "kinds2"]`.
  - **It's `baseFirst`, not `headFirst`:** `headFirst` already exists in `order.js` as maani's headline rule ("Muke ba bajr ji maani khape"), so reusing the name would have changed maani.
  - The base row goes first in every block, and the rest stay shuffled. The sentence follows the card, so the base is said first too.
- **Two different samosas in one order:**
  - **Data (`data/cook.json`):** from level 3, half the orders (`count2`: 0 at L1–2; at L3–4, 1–2 with a 50% chance of none) have a second kind. Its base is the other base (`base1` = `$kinds.0`; `base2` from `bases` minus it), plus maybe one extra, 2–3 spoons.
  - **Speech:** said as its own sentence with the existing `and_join` line: *"… and ba samosa, with trae bataato."*. That line is English, already flagged "to record" and used by maani. No new Kutchi.
  - **The shared order model (additive):** a row can carry a `block`, and a say entry with `blockHead` heads that block. `order.js` gives the block its own section with its own head, `ui.js` draws it on the card as a labelled item with its parts under it (the shared card's own "item row + parts" tier), and `tickItem` / `closeItem` / `missItem` take an optional `block` filter. Without a `block`, nothing changes.
  - **The station:** block 1 is filled and folded as before. When its samosas are made (`n === count`), **the next strip starts empty**, the card and the shelf open, and block 2 is filled. Its later strips are pre-filled with block 2's spoons. The fillings are graded per block; the count is graded per block (`made A and B, they asked for …`).
  - Round-1 bug: block 2's base could be missing when block 1 used both bases, so block 2 came out as *watana* only. Fixed with `base1`.
- **The strip shows every filling:** one small mound per filling, side by side (two) or in a ring (three or more). A second spoon of the same filling grows its own mound. Before, each spoon was a mound over the last, so only the top one showed.
- **"fry them"** is the shared button kit's **→ Next** (`NjgButtons.next`, `#samosa-next`, the flat pill with the gold arrow). cook.html now loads `js/shared/buttons.js` and `css/shared/buttons.css`; `UI.go` stays as the fallback.
- **The green chilli heap** is R5's chilli rings (`daar/chop-heap-chilli`), sized by its own canvas: it no longer reads as peas.
- **Lab / shots:** `Cook.samosaTwo` (lab only) and `shoot_samosa_v3.py --two`.

### The kitchen kit (`js/cook/kitchen-kit.js`)
See §4b: done last, after chai's work reached main.

## 3. Tests
(filled in below)

## 4. Shots and their flaws
(filled in below)

## 5. Open for Zafar
(filled in below)
