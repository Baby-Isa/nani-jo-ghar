# Game modes: the inventory

For Zafar, 16 Nov 2026. One view of every game mode in Nani jo Ghar: what makes it different, what makes it fun, and the word groups it carries. Built from the mode docs, the days, the 31 Oct maps, the 1-2 Nov designs and prototypes, and the games' data (`data/cook.json`, `data/stations/*.json`, `data/clinic.json`, the `data/*-proto.json` files and the prototypes' code). The same data is in `modes-table.json`, one object per game.

**How to read it:**
- **[A] actual:** in a built game's data or code today (the 1-2 Nov lab prototypes count as built; their words are mostly English placeholders until Mum records them).
- **[P] planned:** in a design doc, a day file or the 31 Oct maps, not in the code.
- **[S] suggested:** my proposal, to fill a gap or balance the load (the Suggestions section says why).
- **Primary:** the game can't be won without understanding these words. **Secondary:** heard and used, not deciding. **Tertiary:** heard in passing.
- Game status: **built** (playable in the labs, prototypes included), **designed**, **parked** (greybox, off the shared kit), **idea**.
- Groups are the 38 of the word-groups map (Table 1), by name. The grammar column waits for the grammar study (empty in the JSON).

## The big table

| # | Game | Family | Status | USP | Fun | Primary | Secondary | Tertiary | Key verbs |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **The pantry** | cook | built | Fetch Nani's list | Hunting the shelves | [A] Food and drink (milk, sugar, flour, chai, daal) | [A] Linking and helping words (and (ne), give me (muke de))<br>[P] Positions and directions (top shelf, bottom shelf) | [A] Pronouns and owners (me (muke))<br>[A] Cooking and the kitchen (cupboard (kabaat)) | give [A], need [A], bring [P] |
| 2 | **Chai** | cook | built | Pour to order | The boil rising | [A] Food and drink (chai, milk, sugar, cardamom, ginger)<br>[A] Numbers and counting (one, two, three (sugars))<br>[A] Quantities (half (adh), full (aako)) | [A] Describing words (black (kari), unsweetened (mori))<br>[A] Pronouns and owners (for Nana, me)<br>[A] Family and people (Nana, Ma, Ali) | [A] Linking and helping words (with (waari), and)<br>[P] Cooking and the kitchen (pan, cup)<br>[P] Describing words (gone cold) | pour [A], add [A], boil [A], need [A] |
| 3 | **Eggs at breakfast** | cook | built | Boil or fry | Crack and sizzle | [A] Cooking and the kitchen (boiled, fried, pot, frying pan)<br>[A] Food and drink (egg, salt, black pepper)<br>[A] Numbers and counting (one, two) | [A] Pronouns and owners (for Nana, no salt)<br>[A] Family and people (Nana, Ma, Ali)<br>[P] Time and days (breakfast, morning) | [P] Daily routines (breakfast) | boil [A], fry [A], crack [P], want [A] |
| 4 | **Maani** | cook | built | Kind and count | Rolling and puffing | [A] Food and drink (maani, millet maani (bajr ji maani))<br>[A] Numbers and counting (one, two, three)<br>[A] Shapes and sizes (big (wadhi), small (nindhi)) | [A] Cooking and the kitchen (rolling pin, tawa, turner)<br>[A] Linking and helping words (and) | [A] Family and people (Nana, Ma, cousin) | roll [A], flip [A], knead [A] |
| 5 | **Roll-tawa** | cook | built | Two tawas | Juggling the tawas | [A] Food and drink (maani) | [A] Numbers and counting (two (tawas))<br>[A] Cooking and the kitchen (tawa) | - | roll [A], flip [A] |
| 6 | **The corn stall** | cook | built | Dress to order | Sizzle and squeeze | [A] Food and drink (corn on the cob (makai), lemon, salt, red chilli powder, mint chutney)<br>[A] Numbers and counting (one, two cobs) | [A] Linking and helping words (with, no (na))<br>[P] Quantities (a little, lots) | [A] Cooking and the kitchen (grill, turn)<br>[P] Greetings and politeness (hello at the stall) | turn [A], add [A], squeeze [P] |
| 7 | **Daar** | cook | built | Spices in order | Tadka crackle | [A] Food and drink (daal, turmeric, cumin seeds, mustard seeds, garlic)<br>[A] Linking and helping words (first (pela), then (ne poi)) | [A] Cooking and the kitchen (chop, tadka, stir)<br>[A] Describing words (slowly (aste thi), quickly (jaldi))<br>[A] Numbers and counting (count of chops) | [A] Family and people (Ma, cousin) | chop [A], add [A], stir [A] |
| 8 | **Chop** | cook | built | Swipe the knife | Satisfying slicing | [A] Food and drink (onion, tomato, potato, chilli, garlic) | [A] Numbers and counting (two to eight chops)<br>[A] Cooking and the kitchen (knife, board) | [P] Describing words (chop it small) | chop [A], cut [P] |
| 9 | **Chaat** | cook | built | Layers in order | Building the bowl | [A] Food and drink (chickpeas, yoghurt (dai), sev, tamarind chutney, coriander)<br>[A] Linking and helping words (first, then, no) | [A] Pronouns and owners (for Nana)<br>[A] Family and people (Nana, Ma, cousin) | [A] Cooking and the kitchen (bowl) | add [A], chop [A] |
| 10 | **Baking** | cook | built | The amount decides | Rising pour, puffing | [A] Quantities (a little, half, full, one and a half, two and a half)<br>[A] Food and drink (flour, water, milk, ghee, naan) | [A] Numbers and counting (a quarter, one and a half)<br>[A] Cooking and the kitchen (cup, teaspoon, oven)<br>[P] Time and days (now, a bit longer) | [A] Family and people (Nana)<br>[P] Celebrations (the party cake) | pour [A], knead [A], add [A], take out [P] |
| 11 | **Sekelo** | cook | built | Thread the pattern | Skewer patterns | [A] Food and drink (meat (gos), chicken (murgi), onion, tomato, potato)<br>[A] Numbers and counting (one, two skewers)<br>[A] Linking and helping words (first, then) | [A] Cooking and the kitchen (skewer (lakri), grill)<br>[A] Describing words (mixed) | [A] Family and people (Nana) | thread [A], turn [A], grill [A] |
| 12 | **Samosa** | cook | built | Fill, fold, fry | Folding triangles | [A] Food and drink (mince (chundo), potato, peas, onion, coriander)<br>[A] Numbers and counting (one, two samosas) | [A] Cooking and the kitchen (pastry, flour, fry)<br>[A] Linking and helping words (no) | [A] Family and people (Nana, Ma)<br>[P] Time and days (lift them out now) | fill [A], fold [A], fry [A] |
| 13 | **Clinic: the waiting room** | clinic | built | Call the patient | Picked person rises | [A] Family and people (man, woman, boy, girl)<br>[A] Describing words (old, young, tall, short) | [A] Colours (red, green, blue)<br>[A] Jobs and helpers (doctor) | [P] Family and people (with the baby, grandad, aunty) | bring in [P], call [P] |
| 14 | **Clinic: diagnosis and where does it hurt?** | clinic | built | Find what hurts | Face zoom, ow | [A] Body (knee, hand, head, ear, tummy)<br>[A] Positions and directions (left, right) | [A] Household things (torch, stethoscope, thermometer)<br>[A] Greetings and politeness (yes (ha), no (na))<br>[P] Pronouns and owners (my, his (munjo, injo)) | [P] Health and feelings (it hurts, sore, cough)<br>[A] Jobs and helpers (doctor)<br>[P] Question words (does it hurt here?) | hurt [P], look in [P], listen [P], point [P] |
| 15 | **Clinic: the pharmacy belt** | clinic | built | Belt catching | Conveyor rush | [A] Household things (plaster, bandage, tissue, ice pack, hot-water bottle)<br>[A] Colours (red bottle, blue bottle, green bottle) | [A] Numbers and counting (one to four items)<br>[A] Linking and helping words (first, then (pela, ne poi)) | [P] Health and feelings (medicine, drops, syrup) | bring [P] |
| 16 | **Clinic heal: scrape, knee, foot, boing, hand** | clinic | built | Treat each part | Kicks, winces, boing | [A] Numbers and counting (dab N times, two to five beads)<br>[A] Colours (red, blue plasters)<br>[A] Body (arm, knee, foot, toe, finger) | [A] Linking and helping words (first, then)<br>[A] Describing words (hot, cold (water))<br>[A] Health and feelings (careful, ow)<br>[A] Positions and directions (left, right) | [A] Household things (plaster, bandage, cloth) | clean [P], wrap [P], pull [A], count [A] |
| 17 | **Clinic heal: ear, nose, eye, tooth** | clinic | built | Close-up head care | Wax pops, sneeze | [A] Numbers and counting (N drops, N cleans)<br>[A] Positions and directions (up, down, left, right (dabo, jamno))<br>[A] Shapes and sizes (big then small (wadho, nindho)) | [A] Body (ear, nose, eye, tooth, mouth)<br>[A] Greetings and politeness (yes, no (the eye test))<br>[P] Household things (bed, cup, ball, key (eye chart)) | [A] Linking and helping words (first, then)<br>[A] Health and feelings (drops, tissue) | clean [P], brush [A], fill [A], cover [P] |
| 18 | **Clinic heal: drinks and fever** | clinic | built | Make the cure | Bumps shrink, burp | [A] Food and drink (turmeric, milk, ginger, honey, lemon)<br>[A] Describing words (hot (koso), cold, just right) | [A] Numbers and counting (spoons, fan N times)<br>[P] Health and feelings (cough, sore throat, tummy)<br>[A] Describing words (quickly, slowly (fan)) | [A] Household things (blanket, fan, cool cloth, hot-water bottle)<br>[A] Body (throat, tongue, tummy) | make [P], stir [A], drink [P], fan [P] |
| 19 | **Clinic: the send-off** | clinic | built | Feelings after care | Apple and wave | [A] Health and feelings (happy, sad, hot, cold, scared) | [A] Greetings and politeness (bye, is everything okay now?)<br>[P] Question words (how do you feel?) | [A] Food and drink (apple)<br>[A] Household things (blanket) | feel [P], say bye [A] |
| 20 | **Clinic heal: tummy, hic, hair (parked)** | clinic | parked | Waiting heal games | Hiccup sips | [A] Numbers and counting (sips one to five) | [A] Body (tummy, hair)<br>[A] Household things (shampoo, comb) | [P] Linking and helping words (first, then) | comb [A], drink [P] |
| 21 | **Clinic: what's wrong?** | clinic | idea | Name the illness | Coughs and sneezes | [S] Health and feelings (cough, cold, headache, fever, better) | [S] Body (head, throat, nose)<br>[S] Household things (medicine, tissue) | [S] Question words (what's wrong?)<br>[S] Time and days (today, now) | feel [S], cough [S], give [S] |
| 22 | **Hide and seek** | home | built | Place words decide | The cat reveal | [A] Home and rooms (wardrobe, cupboard, bed, curtain, drawer)<br>[A] Positions and directions (in, under, behind) | [A] Question words (where?)<br>[A] Household things (box, basket)<br>[P] Describing words (open, closed, big, small) | [A] Pets and small animals (cat (Simba, Zazu))<br>[A] Numbers and counting (count with me)<br>[P] Daily routines (bedtime with the torch) | look [A], close [A], open [P], find [P], hide [P] |
| 23 | **Pick it up and put it back** | home | built | Position decides | Nana's huge eyes | [A] Positions and directions (on, under, in)<br>[A] Home and rooms (kitchen, bedroom) | [A] Household things (glasses, cup, bag, table, bed)<br>[A] Pronouns and owners (Nana's, my bag)<br>[A] Family and people (Nana) | [A] Toys and play (ball)<br>[A] Question words (where is it?)<br>[P] Positions and directions (this side, that side) | put [A], pick up [P], bring [P], take [P] |
| 24 | **Clean-up day** | home | built | Doing words decide | Dusk, light off | [A] Actions (verbs) (switch on, switch off, turn off, sweep, close)<br>[A] Household things (tap, light, soap, broom, curtains) | [A] Describing words (on, off, open, closed)<br>[P] Describing words (dirty, clean)<br>[A] Home and rooms (bathroom, bedroom) | [P] Toys and play (toy car (Ali's room))<br>[A] Pets and small animals (Zazu) | switch on [A], switch off [A], turn off [A], sweep [A], close [A], wipe [P], open [P] |
| 25 | **The wake-up clock** | home | built | Wake on time | Pillow launches | [A] Numbers and counting (one to twelve, eleven, twelve)<br>[A] Time and days (o'clock, morning, night, not now) | [A] Family and people (Nana, Ali)<br>[A] Daily routines (wake up, get up, goodnight) | [A] Pets and small animals (Simba)<br>[P] Time and days (before, after) | wake up [A], get up [A], sleep [P] |
| 26 | **Getting ready** | home | built | Ali obeys Nani | Bed-hair boing | [A] Daily routines (brush teeth, comb hair, wash face, breakfast)<br>[A] Body (hair, face, teeth, hands) | [A] Family and people (Ali, the cousins)<br>[P] Clothes (socks, shoes) | [A] Food and drink (breakfast)<br>[A] Household things (toothbrush, soap, flannel) | brush [A], wash [A], eat [A], comb [P] |
| 27 | **Sewing: make** | home | built | Garment word picks | Simba bats offcuts | [A] Clothes (kurta, cap, dupatta, shawl, sleeve)<br>[A] Describing words (long, short) | [A] Shapes and sizes (small)<br>[A] Colours (red) | [A] Family and people (Ali)<br>[P] Numbers and counting (buttons) | make [A], cut [A], sew [P] |
| 28 | **Sewing: mend** | home | built | Said fault decides | The zzip | [A] Clothes (sleeve, button, pocket, kurta)<br>[A] Describing words (torn, hole) | [A] Pronouns and owners (my)<br>[A] Family and people (Nana)<br>[P] Linking and helping words (first, then) | [P] Pets and small animals (Simba) | fix [A], mend [P], sew [P] |
| 29 | **Sewing: the fitting** | home | built | Trying it on | Too-long kurta | [A] Clothes (kurta, cap, dupatta)<br>[A] Shapes and sizes (big, small, just right) | [A] Describing words (long, just right)<br>[P] Weather and nature (rain, cold)<br>[P] Pronouns and owners (for Ali) | [P] Household things (umbrella)<br>[P] Colours (red) | put on [P], take off [P], wear [P] |
| 30 | **The door** | home | built | Sky sets plans | Nani's gestures | [A] Weather and nature (sun, rain, clouds, stars, rainbow) | [A] Time and days (today, tomorrow)<br>[A] Places in town (market, farm, clinic) | [A] Greetings and politeness (yes (ha), no (na))<br>[A] Actions (verbs) (cook, help) | go [A], want [A], cook [A] |
| 31 | **The evening book** | home | built | Retell your day | Your own story | [A] Linking and helping words (then, and then)<br>[A] Question words (what's this?, where is the ...?) | [A] Time and days (today, tomorrow, goodnight)<br>[A] Transport and travel (car, bus (we went by))<br>[A] Farm animals (goat, chicken, dog, bird) | [A] Food and drink (chai, milk, chapati)<br>[A] Household things (plaster, thermometer, toothbrush) | see [A], use [A], go [A], want [A] |
| 32 | **Conversations** | home | built | Reply in Kutchi | Talking back | [A] Greetings and politeness (salaam, bye (khuda-fis), how are you?, I'm fine, thank you)<br>[A] Question words (who (ker), what (ki), where (kida), how many (kitla)) | [A] Family and people (Nani, Nana, Ma, Big Ma, Ali)<br>[A] Pronouns and owners (tu / aai, muke)<br>[A] Food and drink (chai, maani, daar) | [A] Linking and helping words (can you, will you help)<br>[P] Health and feelings (tired, cold)<br>[P] Weather and nature (it's raining) | say [A], help [A], make [A], want [A], come [P] |
| 33 | **First launch** | home | built | Make, then cook | Seeing yourself | [A] Food and drink (chai, milk, sugar) | [A] Greetings and politeness (thank you, shabash)<br>[A] Celebrations (tomorrow is Eid (to reword)) | [A] Family and people (Nani, the guests)<br>[A] Time and days (tomorrow) | help [P], cook [P], come [P] |
| 34 | **What's missing?** | home | idea | Spot what vanished | Simba stole one | [S] Question words (what's missing?, where did it go?)<br>[S] Household things (key, cup, spoon, glasses, bag) | [S] Actions (verbs) (remember, forget, see, find)<br>[S] Quantities (all gone, none) | [S] Pets and small animals (Simba) | remember [S], forget [S], find [S], see [S] |
| 35 | **Tell Ali which one** | home | idea | Describe, Ali picks | Ali's wrong pick | [S] Describing words (hot, cold, full, empty, wet)<br>[S] Shapes and sizes (big, small, long) | [S] Colours (red, blue)<br>[S] Pronouns and owners (this, that) | [S] Household things (cup, towel, bag) | tell [S], give [S], say [S] |
| 36 | **The day in order** | home | idea | Order the day | Your photos, shuffled | [S] Time and days (morning, afternoon, evening, before, after)<br>[S] Linking and helping words (first, then, after) | [S] Daily routines (wake up, breakfast, bed) | [S] Actions (verbs) (went, saw, ate) | remember [S], go [S] |
| 37 | **Ali's play room** | home | idea | Toy verbs decide | Toys do tricks | [S] Toys and play (ball, doll, teddy, car, blocks)<br>[S] Actions (verbs) (push, pull, roll, throw) | [S] Positions and directions (in the box, on the shelf) | [S] Pronouns and owners (Ali's, mine) | push [S], pull [S], roll [S], throw [S], put [S] |
| 38 | **Find it (the errand)** | trips | built | Search the stall | Arc and plink | [A] Food and drink (orange, lemon, mango, banana, peach)<br>[A] Numbers and counting (one, two, three)<br>[A] Shapes and sizes (big, small) | [A] Positions and directions (in, on, under, behind)<br>[A] Greetings and politeness (salaam, take one yourself (khanigin))<br>[A] Family and people (Nana, Big Ma) | [A] Household things (crate, basket, box, cushion, curtain)<br>[A] Linking and helping words (and, not (na))<br>[A] Pets and small animals (Simba, Zazu) | give [A], need [A], take [A], find [P], put [P] |
| 39 | **Pack the bag** | trips | designed | What today needs | Things hop in | [P] Clothes (sun hat, sandals, towel)<br>[P] Household things (water bottle, umbrella, bag) | [P] Weather and nature (sun, rain)<br>[P] Shapes and sizes (the big hat)<br>[P] Colours (the red one)<br>[P] Numbers and counting (two bottles) | [P] Pronouns and owners (my bag, Ali's bag)<br>[P] Sea and beach (bucket, spade) | put in [P], take out [P], need [P] |
| 40 | **The window ride** | trips | built | Tap passing things | Rushing past | [A] Farm animals (cow, goat, hen, camel, donkey)<br>[A] Transport and travel (bus, car, tractor, bicycle, aeroplane) | [A] Weather and nature (tree, sun, rainbow, well, windmill)<br>[A] Describing words (speed up, slow down) | [A] Pets and small animals (dog, bird, butterfly)<br>[A] Colours (red door, green door) | look [A], come [A], go [P] |
| 41 | **Put it in its place** | trips | designed | Word picks place | Things slide home | [P] Positions and directions (in, on, behind, next to) | [P] Pronouns and owners (Nana's cup)<br>[P] Numbers and counting (two scoops) | - | put [P], give [P] |
| 42 | **Count to a heard number** | trips | designed | Number only heard | Plink into containers | [A] Numbers and counting (one to five)<br>[P] Quantities (a little, more, enough) | [P] Linking and helping words (two, and then one)<br>[P] Money and shopping (coins) | - | count [P], give [P] |
| 43 | **Pass the balloon** | trips | built | Family word picks | Balloon bops heads | [A] Family and people (mum, aunt (masi))<br>[P] Family and people (grandfather, grandmother) | [A] Greetings and politeness (hello, my name is, what's your name?)<br>[A] Pronouns and owners (my, your, Zara's) | [A] Toys and play (balloon) | give [A], call [P] |
| 44 | **How are you?** | trips | built | Feelings pick fixes | Gulp, flop, fan | [A] Health and feelings (hungry, thirsty, tired, sad, hot) | [A] Greetings and politeness (how are you?, I'm fine, thank you)<br>[A] Food and drink (water, samosa)<br>[A] Household things (chair, fan, shawl) | [A] Toys and play (balloon)<br>[A] Health and feelings (cold) | give [A], ask [P], help [P] |
| 45 | **Musical statues** | trips | built | Body-moving verbs | Freeze and wobble | [A] Actions (verbs) (sit, jump, stand up, turn round, dance) | [P] Body (nose, head, ear (touch your))<br>[P] Time and days (stop, now) | [A] Music and art (dance, clapping)<br>[A] Family and people (Zara, Yusuf) | sit [A], jump [A], stand [A], turn [A], dance [A], stop [P], touch [P] |
| 46 | **The cake** | trips | built | Candles by count | Blow-out, cream nose | [A] Numbers and counting (one to six (candles))<br>[A] Pronouns and owners (for Nana, my, your) | [A] Celebrations (cake, candle, birthday)<br>[A] Family and people (Nana, baby) | [P] Shapes and sizes (big, small)<br>[P] Household things (cup) | blow [A], bring [A], give [P] |
| 47 | **The party presents** | trips | built | Whose present? | Unwrap sounds | [A] Pronouns and owners (for, mine, yours, Zara's, the baby's)<br>[A] Family and people (grandfather, baby, Nana) | [A] Toys and play (drum, ball, teddy) | [P] Music and art (drum)<br>[P] Celebrations (present) | give [A], open [P] |
| 48 | **Snap the guests** | trips | designed | Photos of people | Baby grabs lens | [P] Family and people (grandfather, grandmother, aunt, baby)<br>[P] Colours (red) | [P] Clothes (the aunt in red)<br>[P] Linking and helping words (with (the baby)) | [P] Technology (photo) | take a photo [P], look [P] |
| 49 | **Who ate the cake?** | trips | designed | Deduce from clues | Grown-up culprit | [P] Describing words (small, big, in red)<br>[P] Question words (who?) | [P] Family and people (girl, boy)<br>[P] Colours (red) | [P] Household things (cup)<br>[P] Food and drink (cake) | eat [P], take [P] |
| 50 | **Pack the school bag** | trips | built | Toys are decoys | Simba in bag | [A] School and learning (book, pencil, crayon, lunchbox, school bag) | [A] Toys and play (ball, teddy)<br>[P] Numbers and counting (two)<br>[P] Pronouns and owners (your) | [P] Pets and small animals (Simba) | put in [A], take out [P] |
| 51 | **The blackboard** | trips | built | Draw what's said | Drawings come alive | [A] Music and art (draw, colour, picture)<br>[A] Colours (red, green) | [A] School and learning (teacher, chalk, duster)<br>[P] Numbers and counting (one to five)<br>[P] Shapes and sizes (circle, square) | [A] Farm animals (goat, bird)<br>[A] Transport and travel (car)<br>[A] Home and rooms (house) | draw [A], colour [A], rub out [A], ring [A] |
| 52 | **The town map** | trips | built | Infer the place | What comes back | [A] Places in town (market, park, bakery, library, clinic) | [A] Linking and helping words (I want to go, wants)<br>[A] Family and people (Nana, Hannah Mami, Big Ma)<br>[A] Health and feelings (poorly) | [A] School and learning (book)<br>[A] Food and drink (bread)<br>[A] Jobs and helpers (fire station, post office) | go [A], want [A], read [P], play [P] |
| 53 | **Serve at the fruit stall** | trips | built | Shopkeeper, both ways | Needle swings | [A] Food and drink (lemon, mango, onion, banana, orange)<br>[A] Numbers and counting (two, three) | [A] Shapes and sizes (big, small)<br>[P] Quantities (half, enough)<br>[A] Question words (how many?) | [P] Greetings and politeness (please, I want) | want [A], give [P], weigh [P] |
| 54 | **Nani's picky shopping** | trips | built | Size decides | Tiny pot monocle | [A] Shapes and sizes (big, small, biggest, smallest) | [A] Cooking and the kitchen (pot, cup, glass)<br>[A] Question words (which one?) | [P] Linking and helping words (not, I want) | buy [A], want [A] |
| 55 | **Pay** | trips | built | Heard price only | Coin flick count | [A] Numbers and counting (one, ten)<br>[P] Numbers and counting (twenty, to a hundred)<br>[A] Money and shopping (paisa, coins, how much?) | [A] Describing words (just right) | [P] Greetings and politeness (please, thank you) | pay [P], count [P], give [P] |
| 56 | **The lanes** | trips | designed | Follow spoken directions | Wrong turn loops | [P] Positions and directions (left, right, straight on, past the red door) | [P] Colours (red door)<br>[P] Places in town (market, well) | [P] Weather and nature (rain) | go [P], turn [P], stop [P] |
| 57 | **The goat chase** | trips | designed | Follow the pointers | Goat steals shopping | [P] Positions and directions (that way, past the well, behind the cart) | [P] Farm animals (goat)<br>[P] Greetings and politeness (salaam) | [P] Household things (bag) | go [P], run [P], catch [P] |
| 58 | **Big Ma's cloth stall** | trips | built | Pick the cloth | Bolt flops open | [A] Colours (red, green, white, blue, yellow)<br>[A] Shapes and sizes (big, small) | [A] Clothes (cloth)<br>[A] Money and shopping (here's the money)<br>[P] Pronouns and owners (for Ali) | [A] Linking and helping words (I want, not) | buy [A], want [A], pay [P] |
| 59 | **Feeding time** | trips | built | Animal and feed | Farmyard munch | [A] Farm animals (hen, goat, cow, sheep, chick)<br>[A] Food and drink (corn, grass, water) | [P] Numbers and counting (two, three cobs)<br>[A] Linking and helping words (wants) | [P] Shapes and sizes (small) | feed [A], want [A], give [P] |
| 60 | **Collect the eggs** | trips | built | Peek under hens | Chick tumbles out | [A] Numbers and counting (one, two eggs)<br>[A] Shapes and sizes (big, small (hen))<br>[A] Colours (red, white, brown) | [A] Farm animals (hen, chick)<br>[A] Quantities (half, all)<br>[P] Positions and directions (under) | [A] Food and drink (egg) | bring [A], lift [P] |
| 61 | **The farm photo shoot** | trips | built | Doing word picks | Four hooves up | [A] Farm animals (goat, hen, chick, cow, dog)<br>[A] Shapes and sizes (big, small)<br>[A] Numbers and counting (two, three) | [P] Actions (verbs) (eat, run, drink, sleep) | [A] Technology (photo) | take a photo [A], run [P], eat [P] |
| 62 | **Home at dusk** | trips | built | Animals to bed | Chick runs back | [A] Farm animals (cow, hen, goat, chick)<br>[A] Positions and directions (in (go in)) | [A] Time and days (now, it's getting dark, goodnight)<br>[P] Linking and helping words (first, then) | [P] Home and rooms (house, shed, coop) | come [A], go in [A], call [P] |
| 63 | **Pick (the orchard)** | trips | built | Pick to count | Pop and bounce | [A] Food and drink (mango, lemon, tomato, chilli)<br>[A] Numbers and counting (two) | [P] Plants and garden (tree, plant)<br>[P] Colours (red, green) | [A] Farm animals (goat) | take [A], pick [P] |
| 64 | **Plant and water** | trips | built | Plant, water, grow | The grow | [A] Food and drink (lemon, tomato, chilli)<br>[A] Plants and garden (plant, water, grow) | [P] Quantities (a little, a whole can)<br>[P] Numbers and counting (two) | [P] Weather and nature (sun) | plant [A], water [A], grow [A], look [A] |
| 65 | **Pet hotel: look after the animals** | trips | built | Needs, then care | Pompom bee | [A] Pets and small animals (dog, cat, rabbit, bee, ant)<br>[A] Actions (verbs) (feed, wash, brush, put to bed) | [A] Health and feelings (hungry, sleepy)<br>[A] Shapes and sizes (big, small)<br>[P] Numbers and counting (cobs) | [A] Food and drink (corn)<br>[P] Family and people (Hannah Mami) | feed [A], wash [A], brush [A], put to bed [A] |
| 66 | **Pet hotel: going home** | trips | built | Name picks pet | Goodbye tricks | [A] Pets and small animals (dog, ant, rabbit, bee, cat) | [P] Shapes and sizes (big, small)<br>[A] Greetings and politeness (bye) | [A] Pronouns and owners (we've come for)<br>[P] Family and people (the families) | come [A], give [A] |
| 67 | **Snap from the jeep** | trips | built | Animals doing things | Giraffe fills frame | [A] Wild animals (elephant, giraffe, zebra, lion, monkey)<br>[A] Actions (verbs) (eating, swimming, running, climbing) | [A] Shapes and sizes (big, small)<br>[P] Family and people (baby) | [P] Transport and travel (jeep)<br>[A] Technology (photo) | eat [A], swim [A], run [A], climb [P], take a photo [A] |
| 68 | **Who's hiding?** | trips | built | Parts and patterns | Pop-up giraffe | [A] Wild animals (zebra, giraffe, elephant)<br>[A] Body (ears, neck, tail)<br>[A] Describing words (stripy, spotty, grey) | [A] Question words (who's there?, where?)<br>[A] Shapes and sizes (big, small) | [P] Plants and garden (long grass) | hide [A], find [A] |
| 69 | **The watering hole** | trips | idea | Who drinks where | Splashing trunks | [P] Wild animals (lion, elephant, giraffe, zebra)<br>[P] Positions and directions (next to, in) | [P] Actions (verbs) (drink) | [S] Weather and nature (hot, sun) | drink [P], go [P] |
| 70 | **Shells** | trips | built | Crab under shell | Crab scuttles off | [A] Sea and beach (shell, pebble, crab)<br>[A] Shapes and sizes (big, small) | [P] Numbers and counting (two, three)<br>[P] Colours (red, white) | [P] Linking and helping words (not) | bring [A], find [P] |
| 71 | **The sandcastle** | trips | built | Fill and stack | Crab's shell hat | [A] Quantities (a little, half, full)<br>[A] Shapes and sizes (big, small) | [A] Sea and beach (bucket, sand, tower, shell)<br>[P] Linking and helping words (first, then)<br>[P] Positions and directions (on top, next to) | [A] Actions (verbs) (fill, build) | fill [A], build [P], tip [P] |
| 72 | **The beach stalls** | trips | built | Zoom-in food stalls | Coconut thwack | [A] Food and drink (corn, chips, coconut, lemon, chilli) | [P] Linking and helping words (with, without)<br>[A] Shapes and sizes (big, small)<br>[P] Numbers and counting (how many) | [P] Money and shopping (pay) | want [P], give [P] |
| 73 | **The picnic** | trips | built | Whose cup where | Crab steals chip | [P] Pronouns and owners (for Ali, Nani's)<br>[P] Positions and directions (in the middle, next to, on) | [A] Cooking and the kitchen (cup, plate)<br>[A] Food and drink (coconut, chips, corn) | [P] Numbers and counting (two)<br>[A] Family and people (Masi, Ali) | put [P], give [P] |
| 74 | **The kite** | trips | idea | Hold and release | Kite dips, soars | [P] Describing words (slowly, quickly)<br>[P] Time and days (now) | [P] Weather and nature (wind)<br>[P] Toys and play (kite) | [P] Greetings and politeness (careful) | let go [P], hold [P] |
| 75 | **The ride on the water** | trips | built | Spot on water | Hat blows off | [A] Sea and beach (boat, ship, fish, buoy)<br>[A] Transport and travel (boat, ship) | [A] Shapes and sizes (big, small)<br>[A] Describing words (quickly, slowly) | [A] Pets and small animals (bird) | look [A], speed up [P] |
| 76 | **Litter fishing** | trips | built | Litter at sea | Shoe spits crab | [A] Household things (shoe, bottle, tin can, bag, kettle) | [A] Colours (red, white)<br>[A] Shapes and sizes (big, small)<br>[A] Clothes (sock, sun hat) | [A] Toys and play (ball)<br>[A] Sea and beach (fish) | take out [A], catch [P] |
| 77 | **Tidy up** | parked | parked | Arrange by rules | Shoe mountain | [A] Positions and directions (top shelf, next to, in front of, on the left, in the middle)<br>[A] Cooking and the kitchen (plate, cup, spoon, bowl, jug) | [A] Food and drink (spices, fruit, vegetables)<br>[A] Numbers and counting (one to six)<br>[A] Family and people (Nana, Ma, Big Ma, Ali) | [A] Colours (red, blue, green)<br>[A] Celebrations (the sweet box) | put [A], leave [A] |
| 78 | **Dress up** | parked | parked | Style on request | Wrong-size fitting | [A] Clothes (kurta, dupatta, cap, socks, shawl)<br>[A] Colours (red, blue, yellow, pink, purple) | [A] Weather and nature (it's cold, it's hot, it's raining, it's windy)<br>[A] Shapes and sizes (big, small)<br>[A] Positions and directions (left, right) | [A] Numbers and counting (one to five)<br>[A] Household things (needle, scissors, thread) | put on [P], wear [P], sew [P] |
| 79 | **Who did it?** | parked | parked | Deduce the culprit | The reveal | [A] Describing words (old, young, big, small, dark)<br>[P] Question words (who?) | [A] Family and people (Nana, Ali)<br>[A] Colours (red, green) | [A] Food and drink (flour, chilli, yoghurt)<br>[A] Household things (glasses, cap) | eat [P], take [P] |
| 80 | **Monsoon rush** | parked | parked | Beat the storm | Catching the leak | [A] Weather and nature (it's raining, it's windy, thunder, the sun's out)<br>[A] Household things (bucket, water pot, charpai, door, gate) | [A] Food and drink (daal, flour, chickpeas, milk)<br>[A] Numbers and counting (drips) | [P] Pets and small animals (the cats inside)<br>[P] Time and days (now) | cover [P], catch [P], close [P] |
| 81 | **Snap** | parked | parked | Aim and capture | Show Nani prints | [A] Numbers and counting (one to ten (just so many))<br>[A] Shapes and sizes (big, small) | [A] Food and drink (mango, banana, coconut, papaya) | [A] Technology (camera, photo) | take a photo [P], look [P] |

## Word-group coverage

Counts are games (a group listed twice in one tier of a game counts once). *Primary today* counts only games where the group is primary and [A]. **Verdict:** *gap* = no game, actual or planned, needs the group to win (an [S] row may fill it); *thin* = one such game; *covered* = two or more; *out* = dropped by Zafar (31 Oct).

| # | Word group | Target A1 / A2 | Primary | Primary today [A] | Secondary | Tertiary | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Greetings and politeness | 20 / 30 | 1 | 1 | 9 | 5 | thin |
| 2 | Sounds and baby games | 14 / 15 | 0 | 0 | 0 | 0 | out |
| 3 | Family and people | 25 / 35 | 4 | 3 | 15 | 12 | covered |
| 4 | Jobs and helpers | 8 / 18 | 0 | 0 | 1 | 2 | **gap** |
| 5 | Body | 25 / 32 | 4 | 4 | 4 | 1 | covered |
| 6 | Health and feelings | 20 / 40 | 3 (1 [S]) | 2 | 4 | 5 | covered |
| 7 | Food and drink | 60 / 90 | 20 | 20 | 6 | 8 | covered |
| 8 | Cooking and the kitchen | 15 / 25 | 2 | 2 | 9 | 4 | covered |
| 9 | Home and rooms | 25 / 40 | 2 | 2 | 1 | 2 | covered |
| 10 | Household things | 20 / 32 | 6 (1 [S]) | 4 | 7 | 13 | covered |
| 11 | Clothes | 20 / 35 | 5 | 4 | 4 | 0 | covered |
| 12 | Colours | 11 / 14 | 7 | 6 | 10 | 3 | covered |
| 13 | Shapes and sizes | 10 / 16 | 12 (1 [S]) | 11 | 12 | 2 | covered |
| 14 | Numbers and counting | 22 / 40 | 19 | 19 | 17 | 4 | covered |
| 15 | Money and shopping | 6 / 14 | 1 | 1 | 2 | 1 | thin |
| 16 | Time and days | 18 / 35 | 3 (1 [S]) | 1 | 6 | 5 | covered |
| 17 | Weather and nature | 12 / 25 | 2 | 2 | 5 | 4 | covered |
| 18 | Farm animals | 12 / 15 | 4 | 4 | 3 | 2 | covered |
| 19 | Wild animals | 12 / 20 | 3 | 2 | 0 | 0 | covered |
| 20 | Pets and small animals | 12 / 18 | 2 | 2 | 0 | 10 | covered |
| 21 | Sea and beach | 8 / 14 | 2 | 2 | 1 | 2 | covered |
| 22 | Plants and garden | 7 / 11 | 1 | 1 | 1 | 1 | thin |
| 23 | Places in town | 10 / 22 | 1 | 1 | 2 | 0 | thin |
| 24 | Transport and travel | 12 / 20 | 2 | 2 | 1 | 2 | covered |
| 25 | School and learning | 15 / 30 | 1 | 1 | 1 | 1 | thin |
| 26 | Toys and play | 15 / 22 | 1 (1 [S]) | 0 | 3 | 5 | **gap** ([S] fills) |
| 27 | Sports and games | 10 / 18 | 0 | 0 | 0 | 0 | **gap** |
| 28 | Music and art | 10 / 18 | 1 | 1 | 0 | 2 | thin |
| 29 | Positions and directions | 16 / 28 | 11 | 6 | 7 | 1 | covered |
| 30 | Describing words | 30 / 60 | 9 (1 [S]) | 6 | 11 | 2 | covered |
| 31 | Question words | 9 / 12 | 5 (1 [S]) | 2 | 5 | 3 | covered |
| 32 | Pronouns and owners | 20 / 28 | 3 | 2 | 13 | 4 | covered |
| 33 | Quantities | 12 / 20 | 4 | 3 | 5 | 0 | covered |
| 34 | Linking and helping words | 8 / 18 | 5 (1 [S]) | 4 | 14 | 8 | covered |
| 35 | Celebrations | 8 / 14 | 0 | 0 | 2 | 3 | out |
| 36 | Daily routines | 12 / 18 | 1 | 1 | 2 | 2 | thin |
| 37 | Technology | 4 / 8 | 0 | 0 | 0 | 4 | out |
| 38 | Actions (verbs) | 55 / 100 | 5 (1 [S]) | 4 | 3 | 3 | covered |

## Load by game

Unique groups per tier. **Verdict:** *thin* = no primary group or three groups or fewer in all; *heavy* = four or more primary groups, or nine or more in all; *balanced* otherwise.

| # | Game | Family | Primary | Secondary | Tertiary | Total | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | The pantry | cook | 1 | 2 | 2 | 5 | balanced |
| 2 | Chai | cook | 3 | 3 | 3 | 9 | heavy |
| 3 | Eggs at breakfast | cook | 3 | 3 | 1 | 7 | balanced |
| 4 | Maani | cook | 3 | 2 | 1 | 6 | balanced |
| 5 | Roll-tawa | cook | 1 | 2 | 0 | 3 | thin |
| 6 | The corn stall | cook | 2 | 2 | 2 | 6 | balanced |
| 7 | Daar | cook | 2 | 3 | 1 | 6 | balanced |
| 8 | Chop | cook | 1 | 2 | 1 | 4 | balanced |
| 9 | Chaat | cook | 2 | 2 | 1 | 5 | balanced |
| 10 | Baking | cook | 2 | 3 | 2 | 7 | balanced |
| 11 | Sekelo | cook | 3 | 2 | 1 | 6 | balanced |
| 12 | Samosa | cook | 2 | 2 | 2 | 6 | balanced |
| 13 | Clinic: the waiting room | clinic | 2 | 2 | 1 | 5 | balanced |
| 14 | Clinic: diagnosis and where does it hurt? | clinic | 2 | 3 | 3 | 8 | balanced |
| 15 | Clinic: the pharmacy belt | clinic | 2 | 2 | 1 | 5 | balanced |
| 16 | Clinic heal: scrape, knee, foot, boing, hand | clinic | 3 | 4 | 1 | 8 | balanced |
| 17 | Clinic heal: ear, nose, eye, tooth | clinic | 3 | 3 | 2 | 8 | balanced |
| 18 | Clinic heal: drinks and fever | clinic | 2 | 3 | 2 | 7 | balanced |
| 19 | Clinic: the send-off | clinic | 1 | 2 | 2 | 5 | balanced |
| 20 | Clinic heal: tummy, hic, hair (parked) | clinic | 1 | 2 | 1 | 4 | balanced |
| 21 | Clinic: what's wrong? | clinic | 1 | 2 | 2 | 5 | balanced |
| 22 | Hide and seek | home | 2 | 3 | 3 | 8 | balanced |
| 23 | Pick it up and put it back | home | 2 | 3 | 3 | 8 | balanced |
| 24 | Clean-up day | home | 2 | 2 | 2 | 6 | balanced |
| 25 | The wake-up clock | home | 2 | 2 | 2 | 6 | balanced |
| 26 | Getting ready | home | 2 | 2 | 2 | 6 | balanced |
| 27 | Sewing: make | home | 2 | 2 | 2 | 6 | balanced |
| 28 | Sewing: mend | home | 2 | 3 | 1 | 6 | balanced |
| 29 | Sewing: the fitting | home | 2 | 3 | 2 | 7 | balanced |
| 30 | The door | home | 1 | 2 | 2 | 5 | balanced |
| 31 | The evening book | home | 2 | 3 | 2 | 7 | balanced |
| 32 | Conversations | home | 2 | 3 | 3 | 8 | balanced |
| 33 | First launch | home | 1 | 2 | 2 | 5 | balanced |
| 34 | What's missing? | home | 2 | 2 | 1 | 5 | balanced |
| 35 | Tell Ali which one | home | 2 | 2 | 1 | 5 | balanced |
| 36 | The day in order | home | 2 | 1 | 1 | 4 | balanced |
| 37 | Ali's play room | home | 2 | 1 | 1 | 4 | balanced |
| 38 | Find it (the errand) | trips | 3 | 3 | 3 | 9 | heavy |
| 39 | Pack the bag | trips | 2 | 4 | 2 | 8 | balanced |
| 40 | The window ride | trips | 2 | 2 | 2 | 6 | balanced |
| 41 | Put it in its place | trips | 1 | 2 | 0 | 3 | thin |
| 42 | Count to a heard number | trips | 2 | 2 | 0 | 4 | balanced |
| 43 | Pass the balloon | trips | 1 | 2 | 1 | 4 | balanced |
| 44 | How are you? | trips | 1 | 3 | 2 | 6 | balanced |
| 45 | Musical statues | trips | 1 | 2 | 2 | 5 | balanced |
| 46 | The cake | trips | 2 | 2 | 2 | 6 | balanced |
| 47 | The party presents | trips | 2 | 1 | 2 | 5 | balanced |
| 48 | Snap the guests | trips | 2 | 2 | 1 | 5 | balanced |
| 49 | Who ate the cake? | trips | 2 | 2 | 2 | 6 | balanced |
| 50 | Pack the school bag | trips | 1 | 3 | 1 | 5 | balanced |
| 51 | The blackboard | trips | 2 | 3 | 3 | 8 | balanced |
| 52 | The town map | trips | 1 | 3 | 3 | 7 | balanced |
| 53 | Serve at the fruit stall | trips | 2 | 3 | 1 | 6 | balanced |
| 54 | Nani's picky shopping | trips | 1 | 2 | 1 | 4 | balanced |
| 55 | Pay | trips | 2 | 1 | 1 | 4 | balanced |
| 56 | The lanes | trips | 1 | 2 | 1 | 4 | balanced |
| 57 | The goat chase | trips | 1 | 2 | 1 | 4 | balanced |
| 58 | Big Ma's cloth stall | trips | 2 | 3 | 1 | 6 | balanced |
| 59 | Feeding time | trips | 2 | 2 | 1 | 5 | balanced |
| 60 | Collect the eggs | trips | 3 | 3 | 1 | 7 | balanced |
| 61 | The farm photo shoot | trips | 3 | 1 | 1 | 5 | balanced |
| 62 | Home at dusk | trips | 2 | 2 | 1 | 5 | balanced |
| 63 | Pick (the orchard) | trips | 2 | 2 | 1 | 5 | balanced |
| 64 | Plant and water | trips | 2 | 2 | 1 | 5 | balanced |
| 65 | Pet hotel: look after the animals | trips | 2 | 3 | 2 | 7 | balanced |
| 66 | Pet hotel: going home | trips | 1 | 2 | 2 | 5 | balanced |
| 67 | Snap from the jeep | trips | 2 | 2 | 2 | 6 | balanced |
| 68 | Who's hiding? | trips | 3 | 2 | 1 | 6 | balanced |
| 69 | The watering hole | trips | 2 | 1 | 1 | 4 | balanced |
| 70 | Shells | trips | 2 | 2 | 1 | 5 | balanced |
| 71 | The sandcastle | trips | 2 | 3 | 1 | 6 | balanced |
| 72 | The beach stalls | trips | 1 | 3 | 1 | 5 | balanced |
| 73 | The picnic | trips | 2 | 2 | 2 | 6 | balanced |
| 74 | The kite | trips | 2 | 2 | 1 | 5 | balanced |
| 75 | The ride on the water | trips | 2 | 2 | 1 | 5 | balanced |
| 76 | Litter fishing | trips | 1 | 3 | 2 | 6 | balanced |
| 77 | Tidy up | parked | 2 | 3 | 2 | 7 | balanced |
| 78 | Dress up | parked | 2 | 3 | 2 | 7 | balanced |
| 79 | Who did it? | parked | 2 | 2 | 2 | 6 | balanced |
| 80 | Monsoon rush | parked | 2 | 2 | 2 | 6 | balanced |
| 81 | Snap | parked | 2 | 1 | 1 | 4 | balanced |

## Suggestions
