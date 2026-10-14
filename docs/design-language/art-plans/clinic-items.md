# Clinic items: every item and the views it needs (ART-20)

The table the next art run plans from (decision 65: one sprite sheet per item, every view it needs plus spares). Built on 14 Oct (S06 round 4) from `data/clinic.json` (items, groups, instruments), `data/clinic/pipeline.json` (the pharmacy's asks, decoys and colours), `data/clinic/heal/*.json` (each heal game's items) and the heal games' tool columns (`S.tools(...)` in `js/clinic/heal/games/*.js`). What exists now is from `data/clinic/sheets.json` (the S02 sheets), `assets/clinic/items-v2/` (old single pictures, remapped to a sheet view where one exists) and `data/clinic/rough-art.json` (throwaway rough sprites, not shipping art).

**The views** (the sheets' own names): **belt** the pharmacy belt, front and a little above; **tray** top-down in the tray; **tool** the heal game's tool column; **in use** the working angle on the patient (one per way it is held); **spares** a side view plus the item's states (open, filled, peeled ...), to 6-8 views a sheet.

**Key:** **has** a sheet view exists · **NEED** the view is needed and there is no sheet view (what is drawn today in brackets) · **–** not needed. An item is on the belt (and so can land in the tray) when a pharmacy round asks for it or it is on the decoy list; a colour list means the belt and tray need it in each colour (the colour asks from level 2).

## Items the clinic draws

| Item (aliases) | Where it shows | Belt | Tray | Tool column | In use | Spares | Sheet now |
|---|---|---|---|---|---|---|---|
| paani (cook-paani, jug-hot, jug-cold) | asked: scrape, cut, sore feet, thorn (hot and cold jugs); decoy · cut (wash), foot (hot, warm, cold jugs), hic (fills the glass), taste (water jug), tummy (pitchers) | has (hot, warm, cold) | has | NEED (items-v2 water-jug, jug-hot/cold/lukewarm) | has (pour, each temperature) | NEED side | jug |
| cloth (care-cloth) | asked: scrape; decoy · cut (dab) | has | has | has | has (dab, dab-wet, dab-3q) | has | cloth |
| plaster (care-plaster) | asked: scrape, cut, sore feet, thorn; decoy; colours red, blue, green · cut, boing and foot tool columns (two-colour plasters, skin) | has, but **NEED** it level, not tilted (CLN-97), and in red, blue, green | NEED in red, blue, green | has (plaster-flat: 11 colourings) | has (forearm, knee, upper arm, peel) | has | plaster, plaster-flat |
| bandage (care-bandage) | asked: knee bump, leg break; decoy; colours red, blue, green, yellow · knee (wrap) | NEED x4 colours (rough sprite) | NEED x4 | NEED (items-v2 bandage-roll) | NEED the wrap (code-drawn) | NEED | – |
| thread | asked: cut; decoy; colours red, blue, green | NEED x3 (rough sprite) | NEED x3 | – | – | NEED | – |
| hammer | asked: knee bump, leg break; decoy · knee (the reflex tap) | NEED (rough sprite) | NEED | NEED (items-v2 reflex-hammer) | NEED the tap | NEED | – |
| crutches | decoy | NEED (rough sprite) | NEED | – | – | NEED | – |
| torch (tool-torch) | decoy · the diagnosis's look (instrument) · listed in the ear's items | NEED (rough sprite; items-v2 pen-torch) | NEED | – | NEED (the look, its beam) | NEED | – |
| tweezers (tool-tweezers) | asked: seed in ear; decoy · ear, foot (the splinter) | has | has | has | has (use, use-45, open, splinter) | has | tweezers |
| cotton-bud (bud) | asked: seed in ear, coated tongue; decoy · ear, taste | has (the pot) | has (the pot) | has (pot-belt, remapped) | has (use, use-down, wax, ointment) | has | bud |
| cotton (the alcohol wipe) | asked: jab; decoy · boing (wipe the arm) | has | has | has | has | has | wipe |
| drops (care-drops) | asked: seed in ear, sore eye; decoy; colours red, blue, green, yellow · ear (nozzle down), eye (green drops) | has, **NEED** in 4 colours | has, NEED in 4 colours | has | has (use, use-down, squeeze) | has | drop-bottle |
| bottle (care-bottle, hot-water bottle) | decoy · fever (a room thing), tummy | NEED (no belt view) | has | has | has (use, lying) | has | hot-water-bottle |
| toothbrush | asked: sugar bug, cracked tooth; decoy · tooth (brushing) | has | has | has | has (use, up, down, with paste; brushing sheet) | has | toothbrush, brushing |
| comb | decoy · hair (combing out the beetles) | **NEED** (rough sprite; CLN-97: the belt's comb) | NEED | – | NEED the comb through hair | NEED | – |
| drill | asked: sugar bug, cracked tooth · tooth | NEED (rough sprite) | NEED | – | NEED (items-v2 dentist-drill) | NEED | – |
| paste (the filling) | asked: cracked tooth · tooth (the fill) | NEED: a clear tube (clinic.md P: replace "filling") | NEED | – | NEED (heal-v3 filling-nozzle pictures) | NEED | – |
| limu (fru-02) | asked: coated tongue · taste (lemon half), the eye chart's picture | NEED (rough sprite) | NEED | NEED (items-v2 lemon-half) | NEED | NEED | – |
| dudh (milk) | asked: coated tongue · taste (milk jug), tummy (a pitcher) | NEED (rough sprite) | NEED | NEED (items-v2 milk-jug) | NEED the pour | NEED | – |
| honey | asked: coated tongue; decoy · taste | NEED (rough sprite) | NEED | NEED (items-v2 honey-jar) | NEED | NEED | – |
| spoon | asked: coated tongue; decoy · taste, foot (the salt spoon) | NEED (rough sprite) | NEED | NEED (items-v2 teaspoon) | NEED the stir and the scoop | NEED | – |
| apple | asked: jab (the send-off's apple, H33) · the send-off's L3 tray (blanket, fan, apple) | NEED (items-v2 apple) | NEED | – | – | NEED | – |
| cup | decoy · hic (the glass), tummy (the cup) | NEED (rough sprite) | NEED | – | NEED (items-v2 tumbler; empty, half, full) | NEED | – |
| fan | decoy · fever (desk fan, hand fan, ceiling fan) · the send-off's L3 tray | has (desk fan) | NEED | has (hand fan) | has (desk-fan use, hand-fan use) | has | desk-fan, hand-fan; ceiling fan code-drawn (room-items fan-body, fan-blades) |
| blanket (care-blanket) | decoy · fever (a room thing), send-off L3 tray | NEED (items-v2 blanket-red) | NEED | – | NEED (on the patient: heal-art's girl-front-blanket) | NEED | – |
| tissue | decoy · ear (the wax goes on it) | NEED (rough sprite) | NEED | – | has (heal-v3 tissue) | NEED | – |
| stethoscope (tool-stethoscope) | decoy · the diagnosis's listen (instrument) | NEED (items-v2 stethoscope) | NEED | – | NEED (on the chest) | NEED | – |
| thermometer (strip, tool-strip) | asked: fever; decoy · fever, the diagnosis's temperature | has | has | has | has (use, use-down, arm, read) | has | thermometer |
| syringe | asked: jab · boing (the doctor holds it upright; drops fill it) | has | has | has | has (use, upright, filled, pressed) | has | syringe |
| pointer (tool-pointer) | eye (the chart) | – | – | NEED | NEED (rough sprite) | NEED | – |
| patch (care-patch) | asked: sore eye · eye (a pirate patch) | NEED (rough sprite) | NEED | – | NEED (on the eye) | NEED | – |
| loon (spi-16, salt pot) | foot (salt in the soak) | – | – | NEED (rough sprite) | NEED the scoop | NEED | – |
| shampoo | hair | – | – | NEED (no picture at all) | NEED | NEED | – |
| bug-jar | hair (the beetles go in) | – | – | NEED (rough sprite) | NEED (open, with beetles) | NEED | – |
| tool-hand | the diagnosis's look-and-touch | – | – | – | NEED (the doctor's hand) | – | – |

## Things the heal games draw that are not items

| Thing | Game | Needs | Now |
|---|---|---|---|
| the drop machine (four dispensers, levers, spouts) | boing | front, each lever up and down, a drop | **NEED**: code-drawn (data/clinic/heal/boing.json names heal-v3/drop-machine.webp, which does not exist) |
| the waste bin | ear | open, 3q | has (bin sheet) |
| turmeric, ginger | taste | tool column, in use | NEED (items-v2 turmeric-bowl, ginger) |
| window, ice pack, heater | fever | room view, on and off | heater has (heater sheet); window and ice pack: NEED (room-items single pictures) |

## Not drawn anywhere today

needle, xray (it left the decoys: it only reads as English), cast (knee.json lists it for the leg break and pharmacy colours blue, pink, white, but no round asks it), khun, lollipop, tub, sticker. These need no sheet until a round uses them; the lollipop and the sweets stay out of rewards (non-negotiable 16).

## The first gaps (the row's own)

1. The belt's plaster drawn level, not tilted, in red, blue and green (CLN-97).
2. The comb: belt, tray, in use (CLN-97).
3. Boing's drop machine.
4. Then the pharmacy's asked items with no sheet: bandage (4 colours), hammer, thread (3 colours), drill, paste (a clear tube), limu, dudh, honey, spoon, patch, apple.
