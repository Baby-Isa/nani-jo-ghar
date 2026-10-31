# The games we already have: an honest audit (31 Oct 2026)

For Zafar, before the design of the 30 games. It lists every game and mini-game we have, grouped by setting and then by mechanic, judges each on its job, and says what more each could carry cheaply. Read-only: no other file changed, no Kutchi added (the few Kutchi words below are copied from the repo).

**In one breath:**
- **Built on the shared kit:** 9 Cook games, 16 clinic games (4 stages, 8 live heal games, 4 parked heal games), and the door, the ride and the book.
- **Greybox:** about 30 mini-games in the six parked modes.
- **Designed only:** dozens more (the trips' stages, the parked modes' libraries).
- **Cook is the strongest:** the word decides the move, Zafar finds it fun, and 53 of its 118 words are recorded.
- **The clinic's mechanics are good, but its words are not real yet.** Of 239 shared words, 14 are recorded, and of the body words only *kan* (ear) has a clip.
- **The heal games teach counting more than the body.** In 8 of the 12 (knee, ear, boing, foot and the four parked ones) the heard word that decides the move is mostly a number.
- **The parked modes are well designed and pass their leak tests,** but each runs on its own engine. Most of their deciding words are English placeholders.

**Labels used below:**
- **Built:** on the shared kit, in the labs.
- **Greybox:** a parked mode's own lab, on its own engine, with placeholder art.
- **Designed:** in a doc only.
- **Words:** the word groups it carries, then how many words (how many recorded). The counts come from `research-word-inventory-2026-10-31.csv`.
- **Leak:** does the heard word decide the move (non-negotiable 4)?
- **Fun:** is it fun to play?
- **Z:** what Zafar has said about it.

Each is marked good, fair or weak. Bot numbers marked "run today" are ones I re-ran on 31 Oct.

---

## Flaws first: what I couldn't verify

1. **I played nothing in a browser.** "Fun" comes from Zafar's notes (`docs/feedback/`, the KEEP and CLN rows) and the designs, not from my own play.
   - **No feedback on file:** Zafar has left no play notes on the six parked modes (Find it, Tidy up, Snap, Dress up, Who did it?, Monsoon rush). Their "fun" is the design's claim only.
   - **Not filmed:** I haven't filmed the Cook stations on the new kit (DAAR-36, SEK-22, MAA-19 and CHT-17 are still open).
2. **Leak numbers.** I re-ran the clinic heal-game bots, the window-ride bot and the book bot (all PASS within Zafar's level-1 allowances). The Cook bot timed out (it needs a browser), so Cook's leak verdict rests on its design (the level table: decoys 1, 2, 3 and 3, then a look-alike) and on the s14 report ("leak 19" green).
   - **The parked modes' numbers are from 25 Sept,** and were not re-run.
   - **The bots treat English placeholders as if they were Kutchi.** A child who can read the grey English wins many of these games: Find it's "where" game wins 17-25% for a reader, and Tidy up's dastarkhwan 95-100%.
3. **The word counts are per citation, not per screen.** A game's count includes sound effects, frames and stray fragments the lexicon cites, so read it as a size, not an exact number.
   - **Cook's stations:** I counted them from `data/cook.json` recipes. "Recorded" is given for Cook as a whole only.
   - **Recorded means a playable take exists,** not that it's cleared to ship (the word inventory, flaw 4).
4. **Numbers have no clip of their own (0 of 10).** Every game decided by a count (most heal games, many Cook rows, Snap, Pack it) rests on numbers heard only inside longer lines. I couldn't tell what a store build would play there.
5. **"The diagnosis can name it" has two readings.** Either the part is said as the sore one, or it is only named (as a decoy or a check-up call). I give both in §3; Zafar should say which his 31 Oct rule means.
6. **Hair.** His note "the lice game was a joke" (word-groups map, row 5) could mean the parked beetles game, or a passing joke. I treat it as unclear.
7. **Safety.** A nose game that takes something out of the nose may invite copying. The clinic already avoids pins for that reason (D15e). This needs his and Mum's eye, not mine.
8. **The parked heal games' stories** say "too many sweets at the wedding" (tummy) and "dancing all night at the wedding" (foot). I flag these against the 31 Oct "celebrations out" decision; I changed nothing.

---

## 1. The full list

### 1a. The kitchen (Cook with Nani): 118 words (53 recorded)

Food, cooking, numbers, quantities, greetings and family. Every station is built. Chai is live as the reference game; the others are moving onto the s14 kit (open rows DAAR-36, SEK-22, MAA-19, CHT-17). CK-01: Zafar hasn't yet played levels 2-4 of the stations.

| Mechanic | Game | What the child does | Words | Leak | Fun | Z | Reason (evidence) |
|---|---|---|---|---|---|---|---|
| Fetch the named thing | **Pantry** | taps the jars Nani names onto the tray | food, cooking; 16 items | good | fair | fair | Same-kind decoys, so the word picks. A plain fetch, and "pantry fatigue" (PAN-13). 30 Oct: "I don't know how anybody's meant to know what's going on" (PAN-19 to PAN-22; PAN-01 has two strikes). KEEP-13: he liked its wrong-item handling. |
| Make to an order | **Chai** | makes each person's chai in their own pan (water, tea, milk, sugar, spices, *kari* or *mori*), then pours it into their glass | food, quantities (half, full), numbers, family; 10 items | good | good | good | Cups by name and count. "I like that the water is bouncing" (KEEP-18), the bubbles (KEEP-15), two-person chai (KEEP-11). Live 30 Oct, with 8 questions to him still open. |
| | **Maani line** | rolls and flips rotis: how many, big or small | food (2), numbers, sizes | good | good | good | Big and small are "really fun" (KEEP-16). Thin on words: two breads plus *wadho* and *nindho* (big and small). |
| | **Daar: chop** | swipe-chops what is on Nani's card | vegetables, spices, numbers | good | good | fair | "So much better ... the knife ... really nice" (KEEP-16). Doesn't end at the last chop, and the onboarding "went awry" (DAAR-37 to DAAR-39). |
| | **Daar: stir** | stirs N laps at the speed said | numbers, speed (slowly and quickly, recorded) | good | good | fair | The dial "looks really good" (KEEP-17). Nani should give the whole sentence, with its verb (DAAR-26). |
| | **Daar: tadka** | lab only | spices | ? | ? | ? | No notes on file. |
| | **Chaat bowl** | builds the bowl in the order said, leaving out the "no" item | food (12), first and then, "no" | good | fair | fair | Order and *na* decide. The art "doesn't really work" (CHT-13, CHT-04). |
| | **Samosa** | fills (which filling, how many), swipe-folds, fries and lifts out | food (8), numbers, "no" | good | good | good | Frying "kind of fun" and the fold "feels great" (KEEP-03, KEEP-04, KEEP-16). |
| | **Sekelo grill** | threads skewers in the order said, then grills and turns them | food (6), numbers, order | good | good | fair | "Keep the barbecue style" (KEEP-16). The layout is "very visually unbalanced" (SEK-20), and Nani is silent for 20 s because her line has no Kutchi (SEK-18). |
| Glue | One customer; a story round | one order served, then the end screen; or the pantry, then chai | | | | | Built. |
| Parked | Knead | cut from the stations | | | | | Kept, unused. |

### 1b. The clinic: 239 shared words (14 recorded), plus each heal game's own

All the stages and nine heal games are built. Body words: only *kan* (ear) is recorded; *akh* (eye), *pag* (foot), *hath* (hand) and *gutan* (knee) have Kutchi but no clip; the rest are English.

**The stages** (one patient moves through all four, then a heal game):

| Mechanic | Game | What the child does | Words | Leak | Fun | Z | Reason |
|---|---|---|---|---|---|---|---|
| Pick the one described | **Waiting room** | taps the person the doctor calls ("the old man in red") | people (man, woman, boy, girl), old and young, tall and short, colours, "with the baby" | good by design, weak today | fair | good | Every ladder word is English except *chokro* and *chokri* (boy and girl). "Heard not seen" at level 3 is liked (KEEP-14). |
| Point at what's heard | **Diagnosis D1-D3** | D1: "does it hurt here?" (yes or no). D2: "my X hurts", tap it. D3: the doctor names a tool and a part; pick the tool, then the part | body (7, 12, then 17 parts by level), look, listen, temperature, yes, no | good | fair | good | Liked: "does it hurt here?", "my foot", and "look at the knee, then the hand" (KEEP-06). Calm, no timer. The body words are placeholders. |
| Fetch from a moving belt | **Pharmacy** | taps the items asked for as they ride past | clinic items, colours, numbers, order | good | fair | good | Look-alikes, colours and counts decide. The pause hint and the card fold are liked (KEEP-14). |
| Match, then help | **Send-off** | L1: matches the face to a feeling card. L2: hears the feeling. L3: picks what helps. Then says bye | 4 feelings, goodbye | fair | fair | fair | L1 is a picture match (allowed while supported); heard from L2. All placeholders; the face art is open (CLN-137). |

**The heal games.** Eight are in a clinic morning (knee, ear, taste, fever, tooth, boing, eye, foot); four are parked.

| Mechanic | Game | What the child does | Words | Leak (bot, run today) | Fun | Z | Reason |
|---|---|---|---|---|---|---|---|
| Count, then a skill | **Knee** | taps the hammer N times, then a flash-and-tap bandage wrap | numbers, knee and leg, sides at L3; 13 (0) | **weak**: blind wins 15-37%, accepted by Zafar because the wraps are a hand-skill row | good | fair | Liked: the knee tap, the wrap, the kick (KEEP-07, -10, -17). Wants a photo-real bandage (CLN-179); "this game hasn't ended" (CLN-178). |
| | **Ear** | torch, then the wax out (big, then small), clean N times, N drops | numbers, big and small; 15 (1) | good: 14% at L1 (allowed), under 6% from L2 | good | good | The wax "taking-out" and "wax that keeps coming" (KEEP-07, KEEP-14). Art rows: tweezers, the kidney tray (CLN-173, CLN-174). |
| | **Tooth** | brushes in the directions called, drills the dark bits, fills to the line | up, down, left, right; numbers; 11 (0) | good: under 9% | good | fair | Drill, fill-to-green, one-by-one (KEEP-14). The zoom is "intimidating" (CLN-163), the brush art twisted (CLN-180), and CLN-210 reopened. |
| | **Boing (the jab)** | wipes N times, fills the syringe with the colours and counts said, the jab, then a plaster | numbers, colours; 24 (1) | good: under 1%, but 2 of 3 rows still English | fair | weak | The stars and hearts are liked; "you don't need the crazy boing animation"; "it needs all new artwork" (CLN-106, CLN-164 to CLN-171). |
| | **Foot** | pours hot or cold water, pulls each splinter along its path without touching the edges, plaster | numbers, hot and cold, toes; 18 (4) | good: 14% at L1 (allowed) | good | fair | "The gameplay part of it is fun", "I love to see the different pathways" (KEEP-17). The art and the dirt-clearing are "terrible" (P42, CLN-192, CLN-193). |
| Make to an order | **Taste (sore spots)** | pops the spots of the colour said with an ointment bud, then makes the drink named | colours, drinks (turmeric milk, ginger, honey and lemon), spoons, "no"; 7 (0) | good: under 4% | good | fair | "The tongue pops" (KEEP-10, KEEP-14). The cup art is wrong (CLN-196). |
| | **Fever** | thermometer, then window, fan or blanket until "just right" | hot, cold, just right; room things; numbers; speed; 2 (0) | good: 22% at L1 (allowed) | fair | fair | "I don't know how this game mode ends" (CLN-178). It says "just right" too early (CLN-176); the fan is drawn the wrong way up. |
| Judge what is said | **Eye** | drops, then the patient reads the chart and the child says right or wrong (*haa*, *na*: recorded) | any met noun, numbers, sides; 18 (2) | good: under 7% | good | good | The eye test, and the re-drop and re-read (KEEP-07, -10, -14). Redesign asks: the board, drops per eye (CLN-207). |
| Parked: count, then a skill | **Scrape (cut)** | wash, dab N times, plasters in the colours and order said | numbers, colours, order; 17 (2) | good: 16% at L1 (allowed) | **weak** | **weak** | "It's incredibly boring ... nothing really to do" (CLN-172). Parked 19 Oct: "we have enough clinic modes". **His 31 Oct "simple cut game (clean, plaster)" is this game.** |
| | **Tummy** | floats N bubbles up to a burp, then the drink named (half or full) | numbers, water, milk, chai, half; 15 (2) | by design | ? | ? | Lab only; no notes from him. Story: "too many sweets at the wedding". |
| | **Hic** | N sips, then hold the breath for a count | numbers, half and full; 16 (2) | by design | ? | weak | Writes English sound words to the child ("hic!", "BOO!": CLN-158). |
| | **Hair (beetles)** | combs N times, catches N beetles of a colour | numbers, colours; 12 (1) | by design | ? | ? | See flaw 6. |

**The clinic's real job:** the body is taught by the diagnosis. The heal games teach counts, colours and order, with the body named only in the "why" line. That's fine for fun, but it means more heal games add few body words unless the diagnosis grows with them (§3).

### 1c. The home (Nani's house): all parked, on their own engines

**Tidy up** (greybox): 41 words (8 recorded). The positions are English.

| Mechanic | Mini-game | What the child does | Words | Leak | Fun | Z |
|---|---|---|---|---|---|---|
| Place by rules | **Put it there** (kitchen shelves, masala dabba) | taps a thing, then a spot; the rows are rules ("orange in the bowl") | positions, food, spices | good (≤6%); a reader wins 16% at L1 | fair (the 25 Sept review: "it's just putting away") | not played |
| | **Lay the dastarkhwan** | lays the cloth by rules (in front of Nana, the red cup) | positions, owners, colours, tableware | good by design; a reader wins 95-100% (every word English) | designed as the set piece | not played |
| Count into cells | **The fruit box** (Pack it) | puts N of a fruit into the named cells, then lid and ribbon | numbers, positions (top row, corners) | good (≈4%) | good on paper | not played |
| Speak, Ali acts | **Ali's turn** | says each row; Ali places what he heard | positions, spoken | good (voice 0%, pills ≤6.6%) | good on paper | not played |
| Twist | **Simba's paw** (a lab toggle) | the paw knocks things off; put them back | positions | built as a toggle only | | |
| Designed only | Bring me the X; Where does this go?; The swap; Seat the guests; Where's my cup? | | | | | |
| Designed only | Boards: the shoe rack, Eid bunting, make the bed, the lunchbox week (with the pill-box skin), the family photo; skins: the sweet box, the toy box | | | | | |

**Find it, home side** (greybox):
- **4c Where is it?** (the sitting room; under and behind at level 3) is a greybox. Leak: 0.7% if the positions were Kutchi; 17-25% today for a reader.
- **4d Simba's mischief** (things behind openables, a clue that can lie) is designed only; it is Arc 1's hide-and-seek beat (Zafar, 14 Oct).
- **Designed only, from its library:** the torch, openables, the cats' trail, the chicks, Tell Ali where, the doorway.

**Who did it?** (greybox; 28 words, 4 recorded):
- **The mini-games:** Who ate this one? (match a trace such as yellow paws to the suspect), Keep who fits (tap whoever still fits each clue), Look closer (a magnifier), Tell Ali (speak the clue). Nani guesses is logic only.
- **Leak:** good (≤4%; by voice 0%).
- **Fun:** a strong deduction design; no notes from him.

**Monsoon rush** (greybox; 11 words of its own, none recorded):
- **The mini-games:** the kitchen leak (cover the pot named before the drip), drip count, You call it (speaking), Nani's forecast, Cats inside.
- **Leak:** good (<2%).
- **Words:** it mostly re-teaches Cook's nouns against a clock; its own weather words have no Kutchi.

**Dress up** (greybox, Big Ma's room; 47 words, 2 recorded):
- **The mini-games:** Lay it out, The fitting (with a change of mind), Big Ma's mending (N buttons of a size and colour on the part named), Bangles. Going out is logic only.
- **Leak:** good (≤3%), but **no decision rests on real Kutchi today** (every colour and garment is English).

### 1d. The trips: only the ride is built

| Mechanic | Game | What the child does | Words | Leak | Fun | Z | Reason |
|---|---|---|---|---|---|---|---|
| Spot it as it passes | **Window ride** (car or bus; the farm road) | Nani names a thing; tap it as it passes; three speeds | farm animals, transport, weather; 18 (0, **and no Kutchi**) | good (≤5.3% at every speed, run today) | good | fair | Speed is "the fun of it" (20 Oct). Too quick, the wrong way round, no onboarding; a list of three wanted (s12 E1 to E5). |
| Find it, shops skin (greybox; 14 own words, 0 recorded, plus 65 handout words, 6 recorded) | Nani's list (1a) + The list (4a) | searches the stall for what's on the list | food, numbers | good (1.7%) | good on paper | not played | |
| | Which one? (4b) | big or small, the same picture at two sizes | sizes | good (0.1%) | | | |
| | Salaam and *khanigin* (3a) | replies to the greeting, then takes one free gift | greetings | ungraded | | | |
| | Check the bag (5a) | catches the shopkeeper's mistake, held or said | numbers, food | good | | | the only "catch someone else's mistake" in the game |
| | You're Nani (1d); The bowl (6a) | speaking: say the list, Ali shops; say what goes in the bowl | | good | | | |
| Frame it (Snap, greybox, the orchard) | Just so many; The big one; Ali's camera; Show Nani | frame exactly N; frame the big one; say it and Ali shoots | numbers, sizes, food | good (1.1%) | good on paper | not played | |

**Designed, not built** (days.json `built: false`):
- **Shared stages:** pack the bag, meet, put it in its place, count to a heard number, the food stall (a Cook reskin), home (the thing for Ali).
- **New for one trip:** the shops' lanes, pay and goat chase; the beach's sandcastle and kite; boat fishing; the safari's watering hole.
- **Find it's other designed stages:** which stall, ask for one, the scales, pay, give one to Nana, everyone wants something.

### 1e. The story glue

| Game | What the child does | State | Words | Judgement |
|---|---|---|---|---|
| **The door** | Nani says the weather and the day; the child answers *Ha* or *Na* | built | weather, time, places; 22 (7) | A beat, not a test (no leak test). Zafar: fair. Nani floats, use single words, needs onboarding (s12 D1 to D9). |
| **The evening book** | find it (plain cards), name it, stick in the photo, our day; brings back words from 1, 3 and 7 days ago | built | review of the day; 13 lines (3) + 10 frames (0) | Leak good (bot PASS, run today). Fun weak-fair: "Has any thought actually gone into the book?", no onboarding (s12 F1, F2, F9, F10). "Nice the book goes on the shelf" (KEEP-20). |
| **Conversations** | reply bubbles to people (hello, how are you, what would you like) | engine and lab; not wired into pages | greetings, question words, family; 26 (19) | The best-recorded piece; not yet in play. |
| **First launch** | a pantry round, then the picture story | live | 11 lines (11) | The Eid hook becomes the birthday (31 Oct). |
| **Day builder; rounds** | strings stages into a day | built | | DAY-02 (a whole day plays through) is open with two strikes. |

---

## 2. What each could carry more of, cheaply

Group numbers are the 38 word groups. Each suggestion goes in one of three ways:
- **level:** a new level of the same game
- **reskin:** the same mechanic with new art and words
- **items:** new items in the same mechanic

Each costs words from Mum first.

**Kitchen:**
- **Chai:**
  - quantities (33), as a level: "a little sugar, a lot of sugar, a bit more milk". *thorok* (a little), *wadhare* (more) and *bas* (enough) are already recorded.
  - owners (32): "Nana's chai" (the recorded "Nana jo" frame).
  - describing (30), as a level: "it's gone cold, heat it again" (that frame is recorded).
  - time (16): morning chai.
- **Pantry:**
  - positions (29), as a level: "the tea on the top shelf", with two jars of the same thing, so the place decides (the relations checker exists, `js/shared/rel.js`).
  - quantities (33): "two bags of flour".
  - colours (12): "the red tin".
- **Maani:**
  - time (16): breakfast, lunch and dinner from the day's time (Zafar's note).
  - "one big and two small" (linking, 34).
  - shapes (13): "round", if Mum has the word.
- **Daar:**
  - chop: verbs and sizes (38, 13): "chop it small" (a recorded phrase), big pieces or small.
  - stir: "stop" and "careful, it's hot" (*dhyan rakh*, recorded).
- **Chaat:** quantities (33): "a little chutney, a lot of sev"; the chutney colours (12).
- **Samosa:** shapes (13: triangle, if Kutchi has it); numbers to 6.
- **Sekelo:** colours (12), as items: red and green peppers. The same grill is the farm's corn stall (food, 7).
- **New stations on the same kit** (Table A rows 2-3):
  - baking: quantities (33): half, a little, a lot, two and a half
  - breakfast or eggs: food (7) and time (16)

**Clinic:**
- **Waiting room**, as a new ladder rung:
  - family (3): grandad, grandma, aunty, uncle in place of man and woman
  - clothes (11): "the man in the red hat"
  - feelings (6): "the crying baby"
  - jobs (4): the nurse
- **Diagnosis:**
  - body (5), as items: nose, hair, neck, back, face parts (§3)
  - pronouns (32), as a level: "his knee" when a parent brings a child in
- **Pharmacy:**
  - household things (10), as decoys: towel, soap, tissue, scissors, brush
  - quantities (33): "a little cream"
- **Send-off:**
  - feelings (6), as items: tired (a pillow), thirsty (water), hungry (an apple), scared (a teddy), better
  - greetings (1): "get well soon", "thank you"
- **Knee:** body (5), as a reskin: the same wrap on an ankle, elbow, wrist, finger or head.
- **Ear:**
  - the nose twin (body, 5)
  - "careful" (6) on the deep blob
- **Tooth:**
  - daily routines (36): "brush your teeth, morning and night"
  - describing (30): clean and dirty
  - positions (29): top and bottom teeth
- **Taste:**
  - body (5), as a reskin: the tummy and the throat
  - food (7), as items: more drinks (water, warm milk, lemon)
  - describing (30): hot, warm, cold
  - quantities (33): a little honey
- **Fever:**
  - home verbs (38, V2), as a level: open and close the window, switch the fan on and off (CLN-119 already asks for these). This seeds clean-up day's verbs.
  - household things (10): pillow, hot-water bottle
- **Boing:**
  - feelings (6): brave, scared
  - "careful"
  - colours: *laal* (red) is the one colour recorded
- **Eye: the cheapest word-carrier in the game.** The chart can show any noun the child has met, so it's a data change to its pool: farm and wild animals (18, 19), toys (26), clothes (11), transport (24). CLN-38 already asks for household nouns.
- **Foot:**
  - body (5), as a reskin: the hand (Zafar's idea)
  - "careful" and "ow" (Zafar)
  - hot, cold and lukewarm water

**Home, trips and glue:**
- **Find it, shops:**
  - money (15) through pay
  - describing (30): fresh, soft
  - colours (12)
  - clothes (11) at the cloth stall
- **Snap**, as reskins:
  - the farm: animals (18) with "two goats" and "the big one"
  - the safari: wild animals (19) and verbs ("the one that's running")
  - the party: family (3): "take a photo of grandad"
- **Window ride:**
  - transport (24): "get in the bus" at the start
  - places in town (23): the stop that's named
  - plants (22): trees and flowers as items
  - animals with counts
  
  It needs Kutchi first: none of its 18 words has any.
- **Door:**
  - time (16): morning and evening
  - weather (17) as single words (s12 D5)
- **Book:**
  - question words (31): "who came?", "what did we make?"
  - time (16): today and yesterday
  - linking (34): "and then"
- **Conversations:**
  - feelings (6): answers such as "I'm tired" or "I'm hungry"
  - politeness (1): sorry, please
- **Dress up:**
  - body (5): "the hat on your head, the bangle on your wrist"
  - weather (17)
  - long and short (13)
  
  It joins the sewing.
- **Who did it?:** question words (31), family (3) and food (7), at the party ("who ate the cake?").
- **Monsoon:** home verbs (38): close the window, bring in the washing. This is clean-up day's neighbour.

---

## 3. The clinic, body part by body part

**The diagnosis's parts** (`data/clinic/pipeline.json`):
- **Level 1:** knee, hand, arm, leg, foot, head, ear
- **Level 2 adds:** eye, mouth, tooth, tummy, chest
- **Level 3 adds:** elbow, shoulder, neck, finger, toe

**The sore part comes only from a live ailment.** The other parts are named only as decoys, D2's choices, or D3 check-up calls ("look at the elbow").

**Key** for the table:
- **Diagnosis names it?** gives the level at which it appears, or "no".
- **Sore today?** means a live ailment can make it the sore part.
- **Kutchi** is what the repo has: "clip" means a take of it alone; "line" means it's heard only inside a longer line.

| Part (A1/A2 list) | Kutchi | Heal game today | Diagnosis names it? | Sore today? | Cheapest treatment |
|---|---|---|---|---|---|
| arm | none | **boing** (live); the scrape (parked) | L1 | yes (the jab) | done |
| leg | none | **knee** (the leg break, a cast) | L1 | yes | done |
| knee | *gutan* (line) | **knee** | L1 | yes | done |
| foot | *pag* | **foot** | L1 | yes | done |
| toe | none | **foot** (the thorn) | L3 | yes | done |
| ear | *kan* (clip) | **ear** | L1 | yes | done |
| eye | *akh* (line) | **eye** | L2 | yes | done |
| tooth | none | **tooth** | L2 | yes | done |
| mouth | none | **tooth, taste** | L2 | yes | done |
| head | none | **fever** (a fever is a head ailment) | L1 | yes | done for fever. A bump: the knee's wrap round the head (Zafar) |
| tongue | none (planned) | **taste** | no (said as "mouth") | via mouth | say "tongue" in the taste ailment (data only) |
| hand | *hath* | none live (the parked scrape lists it) | **L1** | no | the foot's splinter game on a hand (Zafar): foot.js with a hand close-up; or the cut game |
| finger | none | none | **L3** | no | the knee's wrap on a finger (Zafar), or a plaster in the cut game |
| elbow | none | none live (the parked scrape lists it) | **L3** | no | un-park the cut game: its data already lists the elbow |
| shoulder | none | none | **L3** | no | the knee's wrap as a sling (needs a new close-up) |
| neck | none | none | **L3** | no | the taste drinks for a sore throat, or a wrap |
| tummy | none | the tummy game (parked) | **L2** | no | the taste game's drinks with a tummy close-up (Zafar), or un-park the built tummy game |
| nose | none (English) | none | no (its spot is the eyes') | no | the ear game's twin: a nose close-up, tissue, drops (Zafar); see flaw 7 |
| hair | none | the hair game (parked) | no | no | un-park the hair game, or the ear's twin (Zafar); his "joke" note first |
| face, cheek, chin | none | none | no | no | the cut game: a scratch and a plaster (one face close-up) |
| lips | none | none | no | no | the taste game's ointment bud on dry lips |
| back | none | none | no (its spot is the tummy's) | no | the fever's hot-water bottle (the item exists) |
| ankle | none | none | no | no | the knee's wrap on a twisted ankle (the most natural reskin) |
| bottom, belly button | none | none | no | no | leave out (the family decides on "bottom") |
| heart, brain, blood (A2 extension) | none | none | no | no | leave out: the "where does it hurt?" chart answers the skeleton idea with child words |

Not on the A1/A2 list but in the clinic:
- **Chest:** the diagnosis names it at L2 (the stethoscope) and nothing treats it. A cough could use the taste drinks (honey and lemon).
- **Throat:** already in the taste game's "why" line.
- **Big toe and little toe:** foot, level 3.
- **Thumb, heel, skin and bone** (B1) would be reskins of the hand and the foot; the knee's cast covers a broken bone.

**How close we are:**
- **On the parts the diagnosis names (17),** 10 can be the sore part and have a live game. 7 are named but never sore and have no live game: hand, finger, elbow, shoulder, neck, chest, tummy.
  - If his rule means "said as the sore part", we already meet it. If it means "named at all", we're 7 short.
- **On the 25 A1/A2 body parts that make sense for the game,** 11 are treatable today (counting the tongue through the mouth).

**The minimum to make every named part treatable:**
1. **Un-park the scrape as his "simple cut game"** (clean, plaster).
   - It covers the hand and the elbow at once: its data already lists them.
   - Add the finger, shoulder and neck as parts: data, plus one close-up picture each.
   - Answer "boring" with his own fix from the foot (P42): wash over each dirty patch, then the plasters in the colours and order said.
2. **The tummy and the chest:** the taste game's drinks, with a tummy close-up for a tummy ache and the chest for a cough.
3. **The diagnosis:** nothing new; its tap spots exist.

That's one un-park, a few data rows, about 5 close-up pictures from one art run, and these games' move onto the s14 kit (Sprint 16 is the clinic already).

**A no-cost stopgap,** which needs his OK because it removes body words from play: stop D3 calling the 7 untreatable parts until they're treatable.

**To treat the whole A1/A2 list,** add:
- nose: the ear's twin
- ankle and a head bump: the wrap
- face, cheek and chin: the cut game
- back: the hot-water bottle
- hair: his call

Give the diagnosis a fourth level with their tap spots (nose, hair, cheek, chin and back are mapped onto other spots today, `js/clinic/figure.js`).

**The real blocker is words, not code:** about 20 body words need Mum. Only *kan* (ear) is recorded on its own.

---

## 4. Tidy up and Find it, folded into the three new home games (a proposal; nothing removed)

**The three games:**
- **Hide and seek:** places and containers, "where?", open and close.
- **Pick it up and put it back:** positions, household things, owners.
- **Clean-up day:** home verbs, sorting, describing.

**"Keep"** means it stays in its own setting, which is not a home game.

| Existing mini-game | State | Goes to | Why |
|---|---|---|---|
| Find it **4d Simba's mischief** (things behind openables, a clue that can lie) | designed | **Hide and seek** (the core) | It is hide and seek already (Zafar, 14 Oct). Swap the sweets for Simba and Zazu themselves; openables named by place ("behind the curtain") are exactly that game's words. |
| Find it library **L2 Openables**, **L3 The cats' trail** | designed | **Hide and seek** | The reveal (open it: the cats are there or not) and a level with a lying clue (a bell, paw prints). |
| Find it library **L1 The torch** | designed | **Hide and seek** (a night level) | The scene toggle; a position phrase saves the battery. |
| Find it **4c Where is it?** (copies of one thing in three places) | greybox | **Pick it up** (the pick-up half) | Zafar's own leak fix: "my bag on the table" with a second bag under the bed. 4c is built on exactly that rule. |
| Find it library **L20 Tell Ali where** | designed | **Pick it up** (a speaking level) | The child says the position and Ali looks. |
| Find it library **L4 The other one**, **L5 Find two the same** | designed | **Hide and seek** (a level twist: "not that cupboard, the other one") | Cheap Kutchi tests on the same search. |
| Tidy **Put it there** (kitchen shelves) | greybox | **Pick it up** (the put-back half) | It grades a placement against spoken rules and shows identical dots on every spot, which is Zafar's "outline all the spots". |
| Tidy **masala dabba** board | greybox | **Pick it up** (the kitchen room; later the drawers and cupboards) | Its positions are "in the middle", "this side" and "that side": Mum's order (this side and that side before left and right). |
| Tidy **Bring me the X** (from L3 the place picks: "the cup under the cushion") | designed | **Pick it up** | The same move as "my bag is on the table in the kitchen". |
| Tidy **Ali's turn** | greybox | **Pick it up** (a speaking level) | The only place the child says a position. |
| Tidy **Simba's paw** | greybox (lab toggle) | **Pick it up** (a mid-round twist) | The cat knocks things down and you put them back; it ties to hide and seek's cats. |
| Tidy **The swap** | designed | **Pick it up** (L3+) | A listening test: which two rows no longer hold. |
| Tidy **Where does this go?** (one rule said, then a stream of things; one container stays empty) | designed | **Clean-up day** | Sorting a room: toys in the box, clothes in the basket, dishes on the shelf. |
| Tidy **toy box** skin (of Pack it) | designed | **Clean-up day** (the play room) | Toys are part of tidying (Zafar, row 26). |
| Tidy **make the bed** board (under, up, down; the pillow) | designed | **Clean-up day** (the bedroom) | One of his clean-up rooms. |
| Tidy **shoe rack** board (pairs, colour, size, side) | designed | **Clean-up day** (the hall) | Pairing and sorting, with describing words. |
| Tidy **The fruit box** (Pack it) | greybox | **keep** (a shared engine); its toy-box skin goes to clean-up day | Counting into cells serves the shops and the party as well. |
| Tidy **Lay the dastarkhwan**, **Seat the guests**, **Where's my cup?**, **the family photo**, **the sweet box**, **Eid bunting** | greybox / designed | **keep**, at the **birthday party** | Owners, family and guests: group 32's main home is the party. Celebrations are out, so the bunting becomes the party's decorations. |
| Tidy **the fridge** | maybe later | **keep** (the shops day's "put the shopping away") | It already belongs to the put-it-in-its-place engine. |
| Tidy **lunchbox week**, **bookshelf and school bag** | designed / maybe later | **keep**, for the **school day** | Pack the school bag (Table A row 22). The lunchbox's days of the week wait (Zafar, 31 Oct). |
| Tidy **quilt**; **veranda pots** | maybe later | **keep** (the sewing; the orchard) | Not home games. |
| Find it **1a, 4a, 4b, 5a, 5c, 5d, 3a, 3b, 2a, 1b, 1d, 6a** | greybox / designed | **keep** (the shops day) | `shops.md` already uses them: the stalls, the scales, pay, the gift. |
| Find it **6b Give one to Nana** | designed | **keep**, at the **party** (giving to the right person) | The shared give-to tap. |
| Find it **3c The doorway** (Nani's "pass me" at home) | designed | **keep** (shared; it can interrupt any home game) | |
| Find it **L17 The chicks**; **L9 The sweet tray** | designed | **keep** (the farm; the party, once the sweet words land) | `farm.md` names the chicks for a later visit. |
| Find it **L14 Kasuku's minute** | designed | **keep** (the daily) | |

**What each new game starts with:**
- **Hide and seek:** a full design, with no code.
- **Pick it up:** the built place engine and its leak checks. This is the best start of the three.
- **Clean-up day:** designs only. **Its home verbs (turn off, close, sweep) have no Kutchi and no existing game.**

---

## 5. Overlaps, dead weight, and mechanics worth reusing

**Overlaps: one job done many times.**
1. **Tap the named thing among look-alikes:**
   - **Where it lives:** the pantry, the designed pack the bag, Find it's list, Tidy's Bring me the X, the pharmacy belt, the ride, the book's find it and Monsoon's kitchen leak.
   - **The waste:** fine as one shared mechanic, but Find it, Tidy, Snap, Dress up, Who did it? and Monsoon each built it on their own engine with their own stubs (`js/*/stubs/`). Moving each onto the kit is a rebuild, not a reskin.
2. **Count to N:**
   - **Where it decides the move:** it is the main decider in 8 of the 12 heal games (kicks, cleans, drops, wipes, jugs, dabs, sips, combs, bubbles), plus Cook, Snap's Just so many, Pack it, the drip count, the scales, and the designed eggs, shells and pay.
   - **The imbalance:** numbers are over-served while body words, verbs and feelings are under-served, and no number has a clip of its own.
3. **Colours:**
   - **Where they decide:** the scrape, boing, taste, hair, the pharmacy, the waiting room, Dress up and Snap.
   - **The gap:** all wait on the same handful of colour words from Mum; only *laal* (red) is recorded.
4. **"Say it, Ali acts":** You're Nani, the bowl, Tidy's Ali's turn, Snap's Ali's camera, Who did it?'s Tell Ali, Monsoon's You call it (and the clinic's retired W3). Six copies of one speaking moment. Keep one shared moment and vary what is said (positions, counts, clues).
5. **Give to the right person:** Seat the guests, Give one to Nana, Snap's Who wants which?, Who did it?'s share them out, the party's presents. One shared give-to; its home is the party.
6. **Pick the person described:** the waiting room, Find it's Whose stall? (already cut), Dress up's "bring in". The clinic owns it.

**Dead weight: teaches little for its cost.**
- **The scrape as it stands:** boring and parked. Worth keeping only as the cut game (§3).
- **Hic:** it teaches only counts, which are everywhere, and writes English to the child. The weakest case to bring back.
- **Hair:** counts and colours again; his note reads as a no (to confirm).
- **Tummy:** counts and the drinks, which taste already does. Its drinks are worth more as the tummy's treatment, and its story needs re-pointing.
- **Monsoon rush:** it re-teaches Cook's nouns against a clock, and its own weather words have no Kutchi. Zafar has moved weather to the door and the ride. Low value for its cost; it stays parked, not removed.
- **Dress up:** worth nothing until the clothes and colours are recorded; then it becomes the end of the sewing (his note).
- **Code:** the parked engines and their stubs, the clinic's retired W3, the eye test's version B, Cook's knead and the lab-only tadka. The designs and leak bots are the asset, not the code.
- **Knee:** fun, but the bot shows the word decides little (blind 15-37%, accepted). A spoken side or a body part per wrap at L3 would make it a listening game.

**Mechanics strong enough to reuse in many settings:**
1. **Put it in its place**, with Tidy's rule-graded board and the relations checker. Reuse: the doll's house, animals home, the picnic cloth, the shopping put away, the party table.
2. **Openables with a reveal** (Find it's 4d design). Reuse: hide and seek, eggs under the hens, a crab under a shell, the party's presents.
3. **Cook's order card and kit.** Reuse: baking, breakfast, the farm and beach stalls, the clinic's drinks, serving at the party.
4. **The window ride:** a road is data. Reuse: every trip, the safari jeep, the boat.
5. **Judge what is said** (the eye test's *haa*/*na*) and **Check the bag** (catch the mistake). Reuse: any noun from any group, the shops, the party. They are cheap to reskin, hard to win by guessing, and nothing else in the game does them.
6. **Snap's viewfinder** (exactly N; the big one; leave one out). Reuse: the farm, the safari, the party.
7. **The knee's wrap and the foot's path game.** Reuse: any limb, the hand.
8. **Conversations and the evening book:** they carry greetings, question words and the review of every group.
