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

### The kitchen kit (`js/cook/kitchen-kit.js`), done last, after chai v3 and maani v3 reached main
- **`HOBS[4]` is R1's `hob-4-v2`.** It's measured from the art (burners, `frontY` 0.8928) and checked against the art and the meta by `check_vessel_meta.py`.
  - Its caps are the v3 size, so a station's `k` keeps its burner size. But the hob is 1546 px wide, not 1753.
  - Chai fits its hob to the row (`room / hobW`), so at 4 people its hob scale goes from 0.633 to 0.723 and its burners are 14% bigger, with no chai code changed.
- **The knobs are R2's `knob-off-v2` / `knob-on-v2`.** `KNOB` is `BADGE / 0.839`: R2's body is 0.839 of its canvas, H6's was 0.742. The knob's round body stays the face badge's size.
  - The kit still turns the knob a quarter (`kOn` starts at −90°), which works for R2 as it did for H6: its "on" bar is vertical.
- The old `hob-4`, `knob-off` and `knob-on` stay in the folder, unused.
- The vessel check's kit comparison now reads `hob-4-v2` as the kit's 4-burner hob.

## 3. Tests
(filled in below)

## 4. Shots and their flaws
Every shot is in `build/reports/art-v3-1/`:
- `<station>-<viewport>-L<n>[…]/`, shot by the stations' own scripts (`shoot_daar_v3.py`, `shoot_samosa_v3.py`, `shoot_sekelo_v2.py`, `shoot_chai_v2.py`, `shoot_maani_v2.py`);
- the round-1 flaws (before the fixes) in `flaws/`.

**Round 1 (found, then fixed and re-shot):**
- **Daar: two chilli heaps merged into one pile** (`flaws/r1-daar-chilli-heaps-merge.jpg`). The R5 heaps fill their canvas; they're now drawn at 0.82 of a pile and 0.95–0.98 apart. Two heaps stay two in the L3 and no-onion shots.
- **Daar: the "stopped" icon poked out past the dial's left edge** (`flaws/r1-daar-dial-icon-clipped.jpg`). The icons' radii are now kept inside the face; all four are inside in the re-shot `stir-*` shots.
- **Samosa: block 2 came out as *watana* only**, with no base (`flaws/r1-samosa-block2-base-watana.jpg`). The order had used both bases in block 1. Fixed in the data (`base1`); the L3 two-kinds shot is now chundo ×3 then bataato ×2, and a right review.
- **Sekelo: chunks overlapped by the handles** on the 3-skewer plate (`flaws/r1-sekelo-plate-crowd-handles.jpg`), where the fanned skewers converge. The chunks now sit toward the tips (and 90 px pushed the top one past the tip on a single skewer: 60).
- **Sekelo: the potato decoy heap was tiny** (it sat on K5's big canvas). It's now cut tight, the same size as the other heaps.
- **The knobs** (contact sheet): a glow sliver on the off knob, a squared-off glow, and an off-centre fit. All fixed in the cut.
- **Samosa: the fry's knob glowed but kept its bar flat**, so it read as off (`samosa-laptop-L1/laptop-l1-fry-on.png`).
  - This bug predates v3.1: `samosa.js` called `burner.set("high")` and then killed the knob's tweens (to stop its pulse), which killed the quarter turn too.
  - R2's strong glow made it obvious. The pulse now stops before the knob turns.
  - Re-shot in `samosa-phone-landscape-*`; the laptop L1 shot still shows it.

**What the final shots show:**
- **Daar**
  - The no-onion order (`daar-*-L1-noonion/`): the pot goes seeds → tomato + chilli, never onion (`*-veg-in.png`). The plain daar waits on its trivet and pours in; the tadka comes up as mustard and cumin only.
  - L3 (`daar-*-L3/`): Nani's chop card is words only (*tameto*, *dungri na*), and she says the count (*Kali ba tameto*).
  - The dial's four icons are readable on the dark glass. The ladle reads as a steel cup with its handle up and right (see R3).
  - **Flaw left:** at the hare's speed the stir's swirl picture fades in, and that's D1's `pot-stir`, which still has curry leaves (no v2 swirl was asked for). It shows only while stirring fast.
  - **Flaw left:** the review bowl is D1's tadka bowl (dry chilli, curry leaves), as asked, while the pot's tadka is mustard and cumin only.
- **Samosa**
  - L1 and L3 two kinds (`samosa-*-L1/`, `samosa-*-L3-two/`): the card has the base first in both blocks (*chundo*, then the extras; the second block "samosa" with *bataato*).
  - Two or three fillings show as separate mounds on the strip (`*-filled.png`, `*-sam-2-filled.png`), and the second kind's first strip starts empty.
  - The **"fry them" pill** is the kit's Next (white card, gold edge and arrow, bottom right). R5's chilli rings on the shelf read as chilli.
  - **Flaw left:** at L3 the block-2 row reads "samosa" with no count, because the count rule hides numbers from L3 and the count is only heard (*and ba samosa*). That's the rule, but with two blocks the child has to hold two counts in their head.
- **Sekelo**
  - L1 charred (`sekelo-*-L1-char/`), L3 with 3 skewers and L4 with 4 (`sekelo-*-L3/`, `*-L4/`). The empty plate is clean.
  - A charred onion skewer stays purple and black on the grill (`*-charred.png`). The potato decoy has its own heap and chunks.
  - **Still crowds a little** (the orchestrator's question): at 3 and 4 skewers the lower chunks of neighbouring skewers touch near the handles, where R6's skewers converge. It's better than v3's parallel skewers, but not the clean fan the prompt asked for.
  - **Flaw left:** R6's fifth, empty bamboo stick shows on the 4-skewer plate (lower left).
- **The hob** (`hob-chai-*-{1,2,3,4}/`, `hob-maani-laptop-L1/`, and the daar and samosa hobs in their folders)
  - At 1–3 burners (the v3 hobs) and 4 (R1), each knob is shown off (`*-start.png`) and on (`*-boiling.png`, `*-tawa-half.png`).
  - The on glow is a wide warm ring and reads at a glance, even on the phone. At 4 people chai's burners are bigger (scale 0.72, was 0.63), the four faces and knobs sit on the front strip, and the tray stays in the row.
  - **Flaw left:** R1's front strip is thin, so the knob's glow reaches the frame at the bottom edge. It's tidy, but tighter than on hob-1–3.

## 5. Open for Zafar
- **R3, the ladle:** a deep steel dipper, not a ladle, in both ChatGPT tries. It works in the pot (it reads as a tool stirring), but say if you want a redo with a reference photo of a real steel *kadchi*.
- **R6's "four" cell has five sticks.** The game leaves the lowest one empty. A redo of cell 5 only (four skewers, the same fan, handles apart) would fix it and uncrowd the handles.
- **The stir's swirl picture** still has D1's curry leaves (it shows at speed). One more pot picture, the daar mid-stir with R4's mustard-and-cumin tadka, would match. The same goes for **the review bowl**, which keeps D1's dry chilli and curry leaves: a trivet bowl with R4's tadka would too.
- **Two samosas, two counts at L3+:** the second block's count is heard only (the count rule). Keep that, or write the second block's count on the card?
- **When the second kind starts:** the station switches to the empty strip once the first kind's count is made. That gives away the first count (the child can't make too many of the first kind). The alternative is a "next kind" button, which needs a new button word. Say which.
- **`baseFirst` vs `headFirst`:** the brief said `headFirst`, but that name is maani's headline rule in `order.js`, so this is `baseFirst`. Same behaviour, as asked.
- **The clinic items** are cut and checked but not wired: for the clinic session. CI1's dentist drill has a small bur; say if it should go.
- **"Chop these" / "and"** are still the English placeholders they were (flagged to record). No new Kutchi and no new English on screen.
