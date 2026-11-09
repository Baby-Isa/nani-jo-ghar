# Fable's answers to the kitchen mock-ups (Zafar's voice note of 9 Nov)

Read: `docs/feedback/kitchen-mocks-2026-11-09-transcript.md` [1]-[31]; his two images in `sources/art/s18-mocks/zafar-own/`; the 49 mocks in `sources/art/s18-mocks/results/`; the art bible; `docs/game-design/families/kitchen.md`; `build/reports/s18-review-and-direction.md` §4-6; baking's sheet `build/reports/designs/cook-baking-eggs.md`; every `data/stations/<game>.json`. The side-by-side frames the brief names do not exist on this branch (`build/screenshots/sidebyside/`, `sandbox/s18-w3-full/`), so I shot today's lab screens myself at 740x320 and 1280x665 (daar, samosa, maani, sekelo, eggs, baking, corn, chop, chaat as `assemble`) and compared our item art at 42 CSS px (the S slot at 740x320) and at 168 px.

Three tests on every answer: the four sizes (the play area beside the side panel is about 522x320, 784x430, 1037x665 and 1560x1080; the band is its bottom 30%, so the scene is 224 CSS px tall on his phone), buildable in Phaser with cut art, right for the mechanic and a 3-6-year-old.

## For Zafar (yes to all except ...)

1. **Camera rule: the camera belongs to the surface; two cameras, never a 30° band.** A **shelf (side-on)** when the pickable things stand up (bottles, jars, shakers, egg boxes): chai, eggs, baking. A **walnut tray (top-down)** when they lie or heap (cubes, cobs, dough, sheets): sekelo, corn, chaat, samosa, daar (spices as katoris). Spices follow the game. Clinic: no change now.
2. **Tray: 06's raised rim with 05's quieter grain, the rim thin.** Bowls: one cream ceramic bowl (samosa-17's) for everything; not glass (no rim on a phone), not steel (it flashes).
3. **Daar: keep the tadka and the stir; no soak, no boil.** Pour the daar from its bowl beside the pot, chai's way. Big central pot, 08's. Stir: a pip lights per lap and Nani counts each lap aloud, "bas" at the number; it never stops the child; a ghost lap the first time. Slow and fast out of L1-L3, back at L4 with a word moment.
4. **Chaat: top-down, opaque cream bowl, items on the tray.** One transparent picture per topping, stacked in the order added, with gaps so the layer beneath shows: about ten pictures, no combination renders. Your side-on image: no (15 px layers on your phone; not chai's ledge).
5. **Samosa: yes to one sheet at a time on 18's board, the stack left (tap brings one), the tray right.** Fillings as transparent blobs stacked on the sheet, not combination sheets. Fold: your two corners, two diagonal swipes. Fry: 31's plate, no serving tray, chai's tap ring.
6. **Corn: sekelo's grill screen exactly.** Raw crate above the person's plate on the left, the grill tall at centre-right, aligned top and bottom (fits; tight at 740x320). Spices go on each cob as it lands on its person's plate; one cob at a time until L3.
7. **Eggs: chai's rule.** Side-on shelf (egg box, salt, pepper, chilli), two-burner hob top-down, 27's walnut tray right, for the plates; never under the hob.
8. **Baking: side-on, as its sheet says.** A level reads only from the side. Jug with chai's two dashed lines (half, full). Your side-on chaat image is baking's camera, with chai's ledge.
9. **Maani: yes to 38,** the board about 7% bigger, the pin tucked at its foot; fits all four sizes.
10. **Chop: a walnut board filling the scene, the knife, a whole and two halves per vegetable; the countdown ring stays.**

## Reasoning, flaws first

### 1. Top-down versus side-on

Flaws: `daar-20.png` mixes top-down katoris and side-on jars on one ledge; the "30-degree compromise" is a third camera and a third batch of art, against the bible's one-camera rule (§3). Don't open it.

At 42 px (my sheet of `assets/cook/items-s17-stove/f-*-jar.webp` against `t-*-katori.webp`): a jar is a coloured column with a lid, a katori a coloured disc. Turmeric, chilli and salt read either way; cumin, mustard and coriander read in neither, only the pill tells. So the camera does not make spices readable; the pill does, and the game's other things choose the camera. Spices in a jar on chai's and eggs' shelf, in a katori on daar's, corn's and sekelo's tray; sauces likewise (`f-tamarind-chutney.webp` or `t-tamarind-pulp-katori.webp`, both exist). Bottles, cartons, the egg box and the yoghurt tub read only standing (`f-water-bottle.webp`, `f-milk-carton.webp`, `f-eggs-in-a-box.webp`): shelf games. Cubes, cobs, dough and pastry read only lying: tray games.

Clinic ([15]): a belt and a tool column with their own design; moving them for consistency alone is a redesign with no play reason. The rule decides when those screens are next redone.

### 2. The tray and the bowls

`corn-05.png`: flat plank, faint lip, quiet grain. `corn-06.png`: a real rim, louder grain. At 740x320 the band is 96 px tall; a rim is two thin lines and says "tray on the worktop", which a plank does not; 06's grain competes with the bowls, which must be the most saturated thing (bible §2). So: 06's shape, 05's grain, the rim thin; one picture cut with its shadow, stretched in width by code.

Bowls: glass (`chaat-23.png`'s band, our `t-small-glass-bowl.webp`) loses its rim at 42 px; steel on walnut flashes (today's corn tray, my 740x320 shot); the cream bowl of `samosa-17.png` and `samosa-31.png` reads at 42 px and sits on walnut. One bowl for every tray game. Walnut bowls vanish on a walnut tray (`chaat-23.png`, right).

### 3. Daar

How it is cooked at home (Mum's to confirm; the recipe is hers): wash and soak, boil soft with hardar and loon (a pressure cooker in most homes), whisk smooth, then the vaghar: hot oil or ghee, rai, jeeru, lasan, mirchi, curry leaves, sometimes onion and tomato, poured over, stirred. As mechanics: soaking is waiting (non-negotiable 7); boiling is chai's ring again; whisking is our stir. The tadka is where daar's own words live (jeeru, rai, lasan, mirchi: their first meeting, `kitchen.md`), so it stays, Nani's order the mechanic.

Pouring from above: a stream with no source is the one thing top-down cannot show; `daar-21.png` proves it (cumin from nowhere). Chai's tilt-and-stream from the bowl beside the pot is built (`scene.pourMs`, SH-117), consistent, and animates well.

The pot: today's is already 580 of the scene's 630 design px (`potR` 290), so `daar-08.png` is close once the hob is the kit's; take 08 and drop the dial when speeds go, freeing the right for the daar bowl and katori. `daar-07.png` has a hand (H13).

Stir: today's badge counts laps but is small; the target rightly never shows (matching). Clearer without stopping: pips under the pot, one lit per lap, Nani counting each lap as it closes, "bas" at the number; stirring on costs score only, as now. Gap to log: bare numbers are heard only inside longer lines, so the count is a grey-italic placeholder until Mum records them. First time: the ladle makes one slow ghost lap. Speed: he is right; "aste thi / jaldi" needs a lesson L1 cannot give. Out of L1-L3; back at L4 with a word moment (CHAI-67: two pots, one slow, one quick, the words heard), as chai teaches half and full. The tortoise-and-hare dial goes.

### 4. Chaat

Top-down with an opaque bowl is right: `chaat-13.png` and `chaat-23.png` read as food; today's glass bowl (my `assemble` shot) is a grey trough at 740x320. Items on the tray: L4 has up to ten things (CHT-17), and ten bowls round the dish shrink it and move every round.

How a studio layers: Toca Boca-style kitchens never render combinations. Each topping is one transparent sprite on the bowl's registered canvas, drawn in the order added; the base fills the bowl, later layers are smaller or have gaps (drizzle lines, loose sev, leaves) so what is beneath shows at the edges. Ten toppings are ten pictures plus the empty bowl; chaat's ten strips (`assets/cook/items-s08b/chaat-strips/`) are this idea in the wrong camera, and `assets/cook/items/chaat-bowl-full-t.png` shows the look to aim at. His potato-and-chana base renders are unnecessary: two scatter pictures overlap, whichever was added second on top.

His `chaat-side-on-zafar.png`: handsome ledge and pills, but six layers in a bowl 130 px tall at 740x320 are 15 px each; the tick button is out (principle 2); the recessed glowing shelf is not chai's stone ledge (non-negotiable 6). Keep it as baking's camera reference.

### 5. Samosa

One sheet on `samosa-18.png`'s board: yes; today's six strips are 40 px tall on his phone and the fold never read. The stack top left, a tap brings one that grows as it flies; the steel plate right with the asker's face badge collects; the fry opens itself at the asked number. Fillings: chaat's stacking rule, one transparent blob per filling (`assets/cook/items/v3/samosa/fill-*.webp` are close), so combinations are free; a 120-combination sheet is redrawn every time a filling changes.

The fold: a real samosa is a three-move cone from a strip, which is today's coded fold and what failed with him. His two-corner fold on a square is two diagonal swipes, each along the arrow, and the coded pastry fold (`Cook.Pastry`) already bends a texture along a line: buildable. Two swipes, not one, so the fold stays a thing the child does. Fry: `samosa-31.png` (or `samosa-02.png` without its tray): karahi, paper plate, no second tray since the band has one; chai's heat ring per samosa, a tap lifts it with the jharo. Oil realism is pre-rendered states cross-faded plus code bubbles (bible §8).

### 6. Corn

Sekelo's grill layout, his `sekelo-threading-zafar-pick.png` proportions and `sekelo-47.png`'s grill with deeper trays: raw crate above (`corn-05.png`'s), the person's plate below, grill tall at centre-right. Aligned top and bottom at 740x320: a 200 px grill gives two 95 px trays and cobs about 70 px long: readable, tight; comfortable from 930x430. `corn-26.png`'s tongs and brush are clutter.

Spices per cob, as it lands on its person's lit plate: chai's "pour into the glass" step, three taps per cob (on, turn, off) plus one per dressing. One cob at a time at L1-L2 so nothing needs turning while a child dresses; several from L3 at chai's green floor (CK-65). Batch dressing would break corn's per-person orders.

### 7. Eggs

What goes on: salt and pepper shakers (L3), a chilli (L2), eggs from their box. All stand up, so the band is chai's shelf and eggs follow chai exactly: `eggs-27.png`'s two-burner hob top-down, its walnut tray for the plates on the right with face badges. A tray under the hob (27, 34) leaves 224 px for both on his phone and fails. Known flaw in 27/34: the pan's handle over the tray.

### 8. Baking

The sheet (§0, B1): baking is "the only game about how much", the pour stopping at the word. A level is a side-on fact; from above a jug is a disc. So baking is side-on, camera E, as designed; `baking-09.png`, `-14.png`, `-29.png` are top-down bowls with no jug and miss the game. Lines: the sheet said none; chai draws dashed half and full lines on every cup, never answering the order. Chai's two lines on the jug keep the family one thing and give adh and aako something to land on; a little and a lot stay bands. His `chaat-side-on-zafar.png` is baking's camera, with chai's stone ledge for the recess and the oven at the right. Nobody minds one side-on game; pantry already is.

### 9. Maani

`maani-38.png` is today's layout with the board grown. Numbers: the one-burner hob at k 0.85 is 395 wide and 559 tall (`kitchen-kit.js` HOBS[1]); today's chakla 470. A board at the hob's height plus the pin below touches the band at every size. A board of about 500 with the pin tucked at its foot fits: the columns sum to 1045 of 1600 design px; the board is 165-178 CSS px at 740x320, 239 at 930x430, 324 at 1280x665, 488 at 1920x1080. His dashed circles come with the big/small lesson ([3]).

### 10. Chop

Today: bare marble, the countdown ring top left, things rising from the band (my `chop-740x320.png`). It needs a walnut board filling the scene (`chop-43.png`'s, cut with its shadow: ART-37), our knife (`tool-knife-t-v2.webp`), and per kind a whole and two halves that fly apart on the swipe (whole exists for all six, `assets/cook/items/veg-*-whole-t.webp`; halves only for onion and potato as `.png`: about twelve new), all in T. The countdown stays as a ring on the board's corner; "a clock to remove" was a misread. No hand, no painted arcs (`chop-40.png`). About eighteen pictures, one run.
