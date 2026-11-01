# The beach and the boat day: game design (beach-boat)

Overnight design by Claude, 1 Nov 2026, for Zafar, **revised the same night after an independent critique** (`beach-boat-critique.md`; what changed is in §12). He was asleep, so every choice made for him is listed in §10 with the reason and the answer I assumed; any of them can be reversed. Design only: nothing is built. Sources, newest wins: Zafar's answers of 1 Nov (`games-master-map-2026-10-31.md`, foot), ideas 66 and 68 (31 Oct), `docs/game-design/days/beach.md` and `boat.md` (19 Oct), the settings map (`game-settings-map-2026-10-31.md`), the research reports of 31 Oct, the lessons checklist of 1 Nov.

---

## 0. One line

**The beach with Masi (shells, the sandcastle, the three snack stalls with pay, the picnic) and the boat day (the beach's second visit: the ride on the water, then litter fishing as one stage).** Day: the beach, hosted by Masi. Status: designed (was "designed" in outline; this is the full design). Engines: shells built on the shared kit with Cook's count (borrowing Find it's size rules, not its greybox engine), **one new engine, fill and stack** (the sandcastle), Cook's grill, fry and chop plus pay (the stalls), **put it in its place after its rebuild onto the kit** plus Cook's pour (the picnic), the built window ride (the boat), and **one small new control, the hook** (litter fishing, on the kit).

**Rough size: medium-large.** One small new engine (fill and stack), one small new control (the hook), a small stall picker, the shells on the kit, and the picnic waiting on put it in its place's rebuild (R7), which pick it up and put it back needs first anyway, so that cost is shared. The art is the bulk: about **120-150 sprites, five backgrounds, a three-layer sea road and five character sheets** (Masi, three stallholders, the boatman), plus one or two generic beach-goers. The build order is in §6.

---

## 1. The language goal

**In one sentence:** the sea and the beach, food from a beach stall, and the describing words that make a choice (big and small, a little and full, the red one and not the red one, with and without), with numbers to five as money and in groups; the boat adds the household nouns, met in an odd place.

### Word groups

| ID | Kind | Group | Where it's taught |
|---|---|---|---|
| O1 | Main | Sea and beach | shells, sandcastle, ride, fishing |
| O2 | Main | Describing words as the move: sizes, amounts, one colour, with and without | shells, sandcastle, stalls, picnic |
| O3 | Supporting | Food and money | stalls, pay, picnic |
| O4 | Supporting | Owners and positions | picnic, sandcastle (L3) |
| O5 | Boat day | Household things | litter fishing |
| O6 | Small words | Numbers 1-5 as groups and prices; *first … and then* | shells, sandcastle, stalls, pay |

This game partly answers Part 6 question 12 of the master map. There, Zafar agreed that describing words should be the move in a game. Here, in shells and the sandcastle, the size or amount word is the whole decision.

### The words

Each word is marked from the inventory (`research-word-inventory-2026-10-31.csv`): **✓** (a family clip of the word alone, or the whole line, exists), **in lines** (heard only inside longer recorded lines, so it needs its own clip), or **to record** (no clip; "in engine" means the engine has the Kutchi but nobody has recorded it). Nothing is invented. A dash means the repo has no Kutchi for the word.

**Visit 1, the beach**

| English | Kutchi in the repo | Status | Stage that decides with it |
|---|---|---|---|
| shell | – | to record | shells, sandcastle |
| crab | – | to record (heard, never asked at L1) | shells, picnic (the joke) |
| sea | – | to record | door, ride, sandcastle |
| beach | – | to record | door |
| sand | – | to record | sandcastle |
| bucket | – | to record | sandcastle, bag |
| spade | – | to record | sandcastle, bag |
| towel, water bottle, sun hat, kite | – | to record (the kite is in game data with English only) | bag |
| big | *wadho* | in lines (30) | shells, sandcastle, stalls, picnic |
| small | *nindho* | ✓ | shells, sandcastle, stalls, picnic |
| red | *laal* | ✓ | shells L3 |
| not the red one | *laal na* | ✓ (whole line) | shells L3 |
| white | – | to record | shells L3 |
| fill (it) | *bhar* | ✓ | sandcastle |
| a little | *thorok* | ✓ | sandcastle L2, chips salt, picnic pour |
| half | *adh* | ✓ | sandcastle L4, picnic L4 |
| full, whole | *aako* | ✓ | sandcastle, picnic pour |
| first | *pela* | in engine, to record | sandcastle L2 |
| and then | *ne poi* | ✓ (whole line) | sandcastle |
| on, on top | *mathe* | in lines (6) | sandcastle L3, picnic L3 |
| in the middle | *wich me* | in engine (confirmed), to record | sandcastle L3, picnic L3 |
| next to | *bajume* | in engine, to record | sandcastle L3, picnic L3 |
| corn on the cob | *makai* | ✓ | stalls |
| chips | *chips* | ✓, but only a low-confidence take (retake) | stalls |
| cassava | *mogo* | in engine (confirmed), to record | stalls |
| coconut | *nair* | in lines (1); a draft from the class handout, and the repo also has *naariyel* (Zafar to choose, clash list) | stalls |
| lemon | *limu* | ✓ | stalls, picnic |
| chilli | *mirchi* | ✓ | stalls |
| salt | *loon* | in engine (draft), to record | chips |
| with (mixed in) | *waari* | in engine, to record | corn toppings, chips salt |
| without | *wagar* | in engine (confirmed), to record | corn toppings, chips salt |
| straw | – | to record | coconut |
| money (paisa), coin | – | to record (planned in `shops.md`) | pay |
| one, two, three, four, five | *hakro, ba, trae, char, panj* | all in engine, none alone: one in lines (18), three and four in lines (2 each), two and five no clip | shells L2, stalls L2, pay |
| how many? | *kitla* | ✓ | pay |
| cup | *cup* | ✓ | picnic |
| plate | *saani* | in engine, to record | picnic |
| Nani, Ali | *Nani, Ali* | ✓ | picnic |
| Masi | – | to record | picnic, every ask |
| it's Nani's | *nani jo ai* | ✓ (whole line) | picnic |
| this is for Nana (the frame for "for Ali") | *hi nana lai ai* | ✓ (whole line) | picnic |

**Visit 2, the boat day** (new words only)

| English | Kutchi in the repo | Status | Stage |
|---|---|---|---|
| boat | – | to record | door, ride |
| fish | – | to record | ride |
| wave | – | to record | ride |
| bird | *chakli* | in lines (1) | ride |
| life jacket | – | to record | bag |
| sun hat | – | to record | bag, fishing (Nani's hat) |
| slowly | *aste thi* | ✓ | ride (said by the child) |
| quickly | *jaldi* | ✓ | ride (said by the child) |
| bottle | – | to record | fishing |
| shoe | – | to record | fishing |
| can (tin) | – | to record | fishing |
| bag | – | to record | fishing |
| sock | – | to record | fishing |
| ball | – | to record | fishing |
| kettle | – | to record | fishing (L3) |

The fishing nouns are chosen because the day at home needs them too (pick it up, clean-up, pack the bag). One recording session serves three games.

### The verbs

These are commands from Masi, Nani or a stallholder:
- **bring:** *khanech*, in lines (1) ("bring the big cup", *wadho cup khanech*, is in engine, not recorded)
- **fill:** *bhar* ✓
- **put:** *rakh*, in lines (2)
- **take it out:** *kadhi chad* ✓; "take it out now", *inke hane kadh* ✓
- **give:** *de*, in lines (18)
- **want:** *khape*, in lines (22). The order frame *muke … khape* is **not recorded as an order**: Cook's order lines are TTS placeholders today (`speaking.md`). The beach needs Masi's and a family customer's order lines recorded (Mum's beach sheet B).
- **help:** "can you help me?", *tu muke help kar de* ✓ (whole line)
- **eat:** *kha* ✓
- **pull:** to record (boat day)

In the evening book, the past is the book's own frames: "we saw …", "we used …", both waiting on Mum.

### Frames heard

The language engine builds each line from recorded phrases. If the engine can't say a line, the line is **listed below as a gap for Mum's sheet**, and it plays as grey italic English (device-spoken while testing) until it lands. Nothing is glued by hand.

| Frame (English) | Built from | Status | Stages |
|---|---|---|---|
| Bring me the big shell. | {size} {thing} *khanech* | to record as a frame (*khanech* in lines only; *shell* none) | shells |
| Fill it. / A little. / Half. | *bhar* ✓ / *thorok* ✓ / *adh* ✓ | ✓ | sandcastle |
| First the big one, and then the small one. | *pela wadho, ne poi nindho* (the clinic's ear game uses the same) | *pela* and *wadho* to record alone | sandcastle |
| I want two corn. | *muke* {N} {food} *khape* | **gap:** the order frame is a TTS placeholder in Cook; record for Masi and a family customer | stalls |
| … with lemon. / … without chilli. / … no chilli. | {topping} *waari* / {topping} *wagar* | **gap:** neither is recorded and no frame joins them to an order; "no chilli" is not built from *laal na*. Mum to say how she'd naturally ask for it, and record that | corn, chips salt |
| Can you help me? | *tu muke help kar de* ✓ | ✓ (whole line) | stalls (each stallholder) |
| Take them out now. | *inke hane kadh* ✓ | ✓ (whole line) | chips |
| Careful, it's hot. | *dhyan rakh* ✓ and *garam* ✓ exist apart | **gap:** nobody has recorded the sentence; it is not glued from two clips. Record it whole | chips, corn |
| How many? / It's three. | *kitla* ✓ / the price frame | the price frame to record | pay |
| It's Nani's. / This is for Ali. | *nani jo ai* ✓ / the *hi … lai ai* frame ✓ | ✓ | picnic |
| Oh no, there's no food! | *o, kenjo nai* ✓ | ✓ (whole line) | picnic (the crab steals the last chip) |
| Slowly! / Quickly! | *aste thi* ✓ / *jaldi* ✓ | ✓ | boat ride |
| Well done! | *shabash* ✓ | ✓ | everywhere, once per step |

**The corn stall does not teach until "with" and "without" land.** Its deciding move is the toppings, so until Mum's frame is in, it plays as a toy with grey English (allowed while testing, never in a store build), and the leak bot doesn't count it.

### Frames said (closed sets)

1. **At the third stall:** "I want {corn / chips / coconut}", *muke {makai / chips / nair} khape*. It's a set of three that sound different. The model line is Masi's recorded order (gap above), so this turn waits on Mum's sheet B.
2. **On the boat (visit 2):** "Quickly!" or "Slowly!" to the boatman, *jaldi* ✓ or *aste thi* ✓. A set of two, below the checklist's three to five; the eye test's *haa / na* is the precedent for a set of two. Rung 1 on the first ride (§3.5).

### How many words, honestly

One table of the **deciding** words (the words a move depends on), counted from the inventory:

| Visit | Recorded alone or as the whole line | Heard only inside lines (needs its own clip) | No clip | Total |
|---|---|---|---|---|
| 1, the beach | **18**: small, red, not the red one, fill, a little, half, full, and then, corn, chips (retake), lemon, chilli, cup, Nani, Ali, it's Nani's, for …, how many | **7**: big, on, coconut, one, three, four, want (*khape*) | **15**: shell, white, two, five, first, in the middle, next to, cassava, salt, with, without, plate, Masi, the price frame, the order frame | **40** |
| 2, the boat day | **2**: quickly, slowly | **1**: bird | **11**: boat, fish, wave, bottle, shoe, can, bag, sock, ball, kettle, sun hat | **14** |

Glue words to record as well (not deciding, but said): sea, beach, sand, bucket, spade, crab, straw, coin, towel, water bottle, kite, life jacket, pull, "careful, it's hot".

**Mum's beach sheet** is drawn from this table, in two sittings so neither is long:
- **Sheet A (the first play: shells and the sandcastle):** shell, white, big, on, in the middle, next to, first, one to five alone, sea, sand, bucket, spade, crab, Masi, "bring me the {size} shell".
- **Sheet B (the stalls, pay, the picnic):** cassava, salt, coconut (with Zafar's choice of *nair* or *naariyel*), chips (retake), with and without as she'd naturally say them in an order, "careful, it's hot", the price frame, the order frame for Masi and one family customer, plate, straw, coin.
- **The boat day:** the eleven nouns, life jacket, pull.

**Per round:** 3-5 new words, each heard at least three times. Each stage brings 2-4 new words at L1 and 1-2 at each level after. **Words that come back:** about 30, from Cook, the farm and the shops. **Speaking turns:** one per visit.

Until the sheets are in, a reader can win on the grey English, so each stage counts as teaching only once its words land (shells and the sandcastle after sheet A; the stalls, pay and picnic after sheet B; fishing after the boat sheet).

---

## 2. Where it sits in its day

### Visit 1, the beach

| # | Stage | Engine | Carries in | Carries out |
|---|---|---|---|---|
| 1 | Door | door | | sunny and hot (Nani fans herself); "let's go to the beach, to Masi's" |
| 2 | Pack the bag | pack-the-bag | | Zafar's list: the sun hat (the red one, not the blue), the towel, the bucket and spade, the water bottle, lemons for the drink; the kite from the shops hops in by itself |
| 3 | Ride (bus, the sea road) | window ride | | the sea first seen |
| 4 | Meet Masi | conversations | | Masi joins; "come with me" |
| 5 | **Shells** | shells on the kit (Cook's count, Find it's size rules) | the bucket from the bag | shells in the bucket; the crab met |
| 6 | **Sandcastle** | **new: fill and stack** | the bucket and the spade; the shells tipped out beside the kit | a photo of the castle (for the book) |
| 7 | Snap | snap (Zafar's stage, kept as he listed it) | | photos |
| 8 | **The three stalls, with pay** | Cook reskins and pay | | corn, chips and coconuts in the picnic basket |
| 9 | **The picnic** | put it in its place (rebuilt) and Cook's pour | the food; the lemons as the lemon drink; the shells bucket | Ali's box with his lemon drink; one shell for Nani's shelf |
| 10 | Home | put it in its place | Ali's box, the shell | the shell on Nani's shelf; a lemon drink for Ali |
| 11 | Evening book | book | the castle photo, the shells, the stalls, the crab | |

**The thread:** the crab is the day's running joke. It hides under a shell, pops out of the top of the castle at the end, and steals the last chip at the picnic. The child waits for it each time. The bucket is the other thread: packed at home, filled with shells, turned into the castle's mould, then carried home with the shell for Nani.

**Rhythm:** a calm search, then building, then the busy stalls, then the calm picnic. No engine plays twice in a row.

**Length: the first play is tiny.** The method says the first-ever session is tiny and rounds are 1-3 minutes, so the day list grows by play (the list is data; it costs nothing):
- **The beach's first play:** door, bag, ride, meet Masi, **shells, the sandcastle**, home, book. The crab twice, and the castle photo for the book.
- **Its second play** adds the stalls with pay.
- **Its third play** adds the picnic, and the full day from then on.
- Snap joins in its place once its rebuild lands; the runner skips any stage that isn't built yet.
- **The boat day stays the beach's second visit** (Zafar, 1 Nov): it opens once the beach has been played once, as its own short day.

### Visit 2, the boat day

| # | Stage | Engine | Carries |
|---|---|---|---|
| 1 | Door | door | sunny, a breeze; "Masi is taking us on a boat" |
| 2 | Pack the bag | pack-the-bag | the life jacket, Nani's big sun hat, the water bottle |
| 3 | **The ride on the water** | window ride, boat road | Nani's hat blows off at "quickly!" and lands in the sea |
| 4 | **Litter fishing** | the hook, on the kit | fish out the rubbish, then Nani's hat; the boatman's net does the rest |
| 5 | The coconut cart on the jetty (optional) | the visit-1 coconut stall at L2 | the slurp; a coconut for Ali |
| 6 | Home, evening book | | Nani's hat on its hook; the ball, washed, for Ali |

The boat day is the beach's second visit (Zafar, 1 Nov). Litter fishing is one stage, not its own game, because the research found it thin on its own.

---

## 3. The stages

Every stage follows the shared rules:
- The asker is on screen and speaks before any card appears.
- The order card is on the left.
- One lit box with a gold glow per live thing; everything else is dimmed. When several things are live at once, each gets its own box (E2P).
- A wrong pick shakes and the word is said again; it's redone on the spot.
- There's no Done and no Next. Every step closes with a move in the world.
- A row ticks only on a right first pick.
- The word ladder applies: a word's Kutchi shows until it's picked right three times in a row.
- Hints come after 7, 9, 11 or 13 seconds, by level.
- Level up after three rounds with at most one hint each.
- **Each level adds one thing; L4 adds one look-alike** (the rulebook). Extras wait for later visits (§5).

These are `docs/game-design/rulebook.md` §1 and `easy-to-play.md`, and are not repeated below.

### 3.1 Shells (visit 1)

**Why:** "Masi wants shells for her castle." The bucket from the bag sits open at the edge of the sand.

**The scene:** top-down (T) wet sand. The foamy edge of the sea runs along the top of the frame. Masi's round face reacts in the top right corner, like the clinic's patient face. Each ask begins with a gentle wave that sweeps in and back and leaves a fresh spread of shells.

**Steps:**
1. The wave settles. The light waits until everything is still, then Masi asks: "bring me the big shell".
2. The child taps a shell. It lifts. If it's right, it hops into the bucket with a plink, and Masi counts along from L2.
3. Under one shell per round is the crab. When its shell is lifted, it blinks its stalk eyes, waves both claws and scuttles sideways into the foam. If its shell was the one asked for, the shell still goes in the bucket. If not, the shell shakes and drops back, and the crab ducks under another shell. That's a funny miss, never a frown. **Rule:** the crab's shell is drawn at random, except in the child's first-ever round, where it is scripted under one of the shells that answer the third ask, so the first meeting is always a happy one.
4. Three asks make a round. After the last, the bucket rattles and Masi says *shabash* once.

**Groups (from L2):** the wave leaves the shells in little piles, touching. "Two small shells" means tapping the pile of two small ones. The whole pile hops in, one shell at a time, counted along. Because the number picks the pile, the count decides the move without a "stop at N" (E2P 4). **The L2 field is four piles:** the asked size in piles of one, two and three, and one pile of the other size holding the asked count, so neither the size nor the count alone settles it. That's at most nine shells, which fits a phone (§7).

**The five questions**

| Question | Answer | Score |
|---|---|---|
| 1 What do you do? | Tap a shell or a pile. That's one gesture. | 4 |
| 2 Does the Kutchi decide it? | Yes. The size, then the count, then the colour picks among copies of one picture at two scales (Find it 4b's size rule). Top-down, so no perspective makes a far shell look small. | 5 |
| 3 The fun | The crab's reveal and sideways dash, the plink into the bucket, the wave laying out new shells | 4 |
| 4 The instruction | The card shows the shell row (picture, Kutchi, speaker). Masi says it once and repeats it every few seconds for non-readers. | 4 |
| 5 What's novel | Find it's size game in a new place, plus piles as counts and the wave that reshuffles. The crab is the beach's own joke. | 3 |
| **Total** | | **20: keep** |

**The level ladder** (each level adds one thing; the gesture never changes; the field is at most nine shells at every size, so the game played is the same on every screen)

| Level | Adds | Example ask | On the sand |
|---|---|---|---|
| L1 | size only, one shell per ask | "Bring me the big shell." | 2 big, 2 small, 1 pebble (the clearly different decoy) |
| L2 | the count, as piles | "Bring me two small shells." | 4 piles: the asked size in 1, 2 and 3, and the other size in the asked count |
| L3 | a colour, and the "no" ask said last | "Bring me the red one." / "Two shells, not the red ones." | red and white shells, in both sizes and in piles, 9 at most |
| L4 | one look-alike: a middle-sized shell beside the big and the small | "The small red shell." | the middle size sits next to the asked size |

**The leak test**
- **Reading:** the card shows Kutchi text and a picture only while the word is supported. Past support it's speaker only. English is grey italic only for unrecorded words, which is why this stage teaches only once sheet A (*shell*, *big*, the numbers) is recorded.
- **Matching:** the card's picture is one shell at no size, because the card never shows the size. Size and colour come only from the voice.
- **Eliminating:** every ask has at least three candidates (four piles from L2). The wave lays out a fresh spread after each pick, so picked shells don't thin the field.
- **Patterns:** positions, sizes, colours and the crab's shell are random each wave. Big and small are asked equally often; at L2 each count is asked equally often.
- **Waiting:** nothing moves towards the answer. The hint after 7-13 s costs the bulb, and the shell it lights is never free.

**The blind bot** picks first picks only, across three asks: at L1 two right of five, so (2/5)³, about 6%; at L2 one pile of four, (1/4)³, under 2%; L3-L4 under 1%.

**The delight:** the crab. It's the same every visit, so the child waits for it.

**Speaking:** none here.

### 3.2 The sandcastle (visit 1): the new engine, fill and stack

**Why:** "Let's build a castle. I'll tell you how it goes." Masi kneels beside the child's patch of sand and says each step; the child builds. At the end the crab pops out of the top and Nani takes the photo.

This is **Zafar's design as he wrote it** (fill the bucket, a little or full; stack first the big, then the small, in the order heard; a shell on top). Masi's castle is not shown, so there's nothing to copy: the plan is only heard. The barrier-game version (Masi builds her own castle behind a windbreak, with a reveal) is kept as an option for his word in §10 (decision 4), with its art cost.

**The scene:** eye level (E), at sand height. The sea is far behind. The child's patch of smooth sand is in the middle. Masi kneels on the right, head and shoulders, her face always visible. The kit runs along the bottom: the big bucket, the small bucket (the same colour), the sand heap with the spade standing in it, and the shells from stage 1, tipped out in a little row.

**The steps** (each one tap, then tap):
1. **Which mould.** Masi says it. The child taps a bucket, and it hops next to the heap.
2. **Fill.** Each tap on the heap flies one spadeful in, with a thwump, and the sand rises a step. **A little is 1 tap, half is 2, full is 4; a fifth heaps it over the rim and still counts as full. A sixth overflows:** the sand spills down the sides with a soft "fff", the heap takes the bucket's sand back, the bucket comes back empty, and Masi says the line again. So "full" is a window the child stops in, not a cap; nothing stops by itself.
3. **Tip.** Tap the bucket, or tap the spot it should go. It flies over, flips, thumps, wiggles and lifts with a shloop: a tower. The tower's height is the amount: a stump, a squat tower or a tall one.
   - The tip is a move in the world, not a Done button. It closes the step. Amounts are chosen by the child stopping, the way baking's "the amount word says when to stop" works (agreed in the master map). Counts are never chosen this way.
   - **A wrong amount** makes the wrong-height tower. It slumps back into the heap with a soft "fff", the bucket comes back empty, and Masi says the line again.
   - **A wrong bucket** shakes and goes back to the kit.
4. **Decorate.** Tap a shell, then tap the tower it goes on.
5. **The end.** Masi claps. The crab pops out of the top of the tallest tower wearing a shell like a hat. Nani takes the photo for the book.

**The five questions**

| Question | Answer | Score |
|---|---|---|
| 1 What do you do? | Tap a bucket, tap the heap (fill), tap to tip, tap a shell then a tower. One gesture per kind of action. | 5 |
| 2 Does the Kutchi decide it? | Yes. Which bucket (big or small), how much (a little, half, fill it), the order (from L2), where (from L3) and which tower the shell goes on, all heard, with no model to copy | 5 |
| 3 The fun | The tip and lift ("shloop"), the overflow and the slump, the crab on the castle | 5 |
| 4 The instruction | Masi's line, beside the child. The card holds the castle's rows: the bucket picture, with the amount as a word and a speaker, never a picture of a full bucket. | 4 |
| 5 What's novel | The only game built by amounts. Nothing else in the game builds a thing to a heard plan. | 4 |
| **Total** | | **23: keep (the beach's flagship)** |

**The level ladder**

| Level | Adds | Example |
|---|---|---|
| L1 | the bucket word only; always "fill it"; two towers in a row (the next lit spot is given); one shell, on the big or the small one | "Fill the big bucket." … "And then the small one." … "A shell on the big one." |
| L2 | the amount and Zafar's two-step line: each move has two words (which bucket and how much), and two towers are said in one line, in the order heard; three towers; two shells | "First the small bucket, a little, and then the big one, full." |
| L3 | positions: the child picks the spot (in the middle, next to it, on top, so stacking is possible, **two high at most**) | "The big one in the middle, and then the small one on top." |
| L4 | one look-alike: half, between a little and full | "The big bucket, half." |

The castle grows sideways at L1-L2 (a row of towers), so the order is real and not physics. A no-Kutchi player can't guess big-then-small because "it stacks that way", which is why the two-step line can come at L2 safely. Stacking arrives only with "on top" at L3, and is capped at two high on every screen.

**The leak test**
- **Reading:** amounts are words on the card, never a fill line or a picture of a full bucket. Past support the card is speaker only.
- **Matching:** there is no model castle on screen, so there's nothing to copy.
- **Eliminating:** every bucket goes back to the kit after use, so all choices stay open. Every spot takes every bucket.
- **Patterns:** the plan is generated each round: the order of big and small, the amounts and the spots are random. Big-then-small isn't always right. From L2 each amount is asked a third of the time.
- **Waiting:** nothing fills or tips by itself, and **there is no cap**: a sixth spadeful overflows, so tapping until it stops never wins. The bucket can be tipped from the first spadeful, so the light never tells you when to stop.

**The blind bot** (first picks only, on a learned save):
- **L1: about 12%** (one bucket of two, twice, and one tower of two for the shell: (1/2)³). This is the L1 allowance, the same as fishing's "one of each at L1 only" (master map): a 3-year-old's first choices are between two, and at L1 every ask is "fill it", which a learned bot knows. Stated here so the bot check passes L1 at 15%, not 10%.
- **L2: under 1%** (bucket 1/2 × amount 1/3 per tower over three towers, then two shells).
- **L3-L4: under 0.1%.**

**The delight:** the shloop of the lifted bucket, the overflow, and the crab on top for the photo.

**Speaking:** none on visit 1. On a later visit the roles swap: the child describes from a closed set, and Masi builds (§5).

### 3.3 The three stalls, with pay (visit 1): Zafar's idea 68

**Why:** "Let's get food for our picnic." Three stalls stand on the sand, each with a stallholder calling for help.

**The scene:** a wide E view of three stalls in a row:
- a corn grill cart (left)
- a cassava chips fryer (middle)
- a coconut cart heaped with green coconuts (right)

On big screens Masi and Nani stand in front, middle and right, holding the picnic basket, and two or three beach-goers wait in a queue. On phones the people in front step out and Masi (or whoever is ordering) is a round face in the corner (§7).

**The flow:**
1. **Who orders.** At L1 Masi orders: "I want two corn". **From L2 the queue orders too** (the map's fix: "two or three customers wait"): a beach-goer steps up and says "*muke nair khape*", voiced by a family member. Who wants what rotates each round.
2. The child taps the stall that sells it, and it zooms in, like the clinic. The other two stallholders wave and call "can you help me?" (*tu muke help kar de* ✓, already a whole recorded line).
3. Inside the stall, the child makes the food: §3.3a-c below.
4. **Pay** closes every stall:
   - The stallholder says the price.
   - Masi holds her purse open on the counter, with coins in little stacks of **one to five**. The coins carry no digits. She keeps hold of it.
   - The child taps the stack that matches the price. The coins slide over one by one, and the stallholder counts along.
   - The very first time pay plays, Masi taps the stack herself while the child watches (the watch step); from then on the child pays.
5. Zoom out. The stall greys out (Zafar's idea; the greying is done in code, not art), and the food drops into the basket.
6. **The return ask (from L2):** one of the asks goes back to a stall that's already done ("and one more coconut for Nani"). The greyed stall wakes again, so the last stall is never a free pick by elimination.
7. **The speaking turn:** at the third stall Masi puts the purse itself into the child's hands (the handover prop; until now she has held it). The child orders and pays (§1, frames said).

**3.3a The corn grill** (a reskin of the sekelo grill, and the same station as the farm's corn stall)
- **Steps:**
  - **Pick the cobs.** The cobs lie on the cart in bundles of one, two and three, tied with a twist of husk. Tap the bundle the count asks for; the whole bundle goes on the grill, counted along. A wrong bundle shakes and stays. (The number picks the bundle, so nothing stops by itself.)
  - Turn each cob when its kernels pop and blacken. This is the toy part. Its timer holds in the green the first time.
  - **Dress the cob:** tap a topping, then rub it along the cob. The cob is the track for the swipe. A topping that wasn't asked for shakes off with a puff, and the line is said again (undo on the spot).
  - **Close it: tap the paper sleeve.** The cob drops into its sleeve and the step closes. A sleeve tapped before the asked toppings are on gets Masi's line again, not a verdict; the sleeve waits.
- **The deciding words:** the count (from L2), and the toppings, with and without: "with lemon", "without chilli" (*limu* ✓, *mirchi* ✓; the with and without frame to record, §1; "without" said last). From L3 the owners split them: "Nani's with chilli, Masi's without".

**3.3b The cassava chips** (a reskin of the samosa fry)
- **Steps:**
  - Tap the raw chips into the basket. They slide into the oil, sizzling.
  - The stallholder lifts the basket when Masi says "take them out now" (*inke hane kadh* ✓) and the child taps the **basket's handle**, a thing in the world, never a word button. "Careful, it's hot" is said once (a gap until recorded, §1). The child never touches the oil (KEEP-08).
  - **Serve:** both cones, big and small, are always out. Tap the asked cone; the chips tip into it.
  - **Salt (from L2):** tap the shaker over the cone. "A little salt" is one or two shakes; "without salt" is none. A third shake heaps salt on top, and the cone shakes it off with Masi's line again.
  - **Close it: tap the cone** to hand it to Masi. That closes the step. A cone handed over with the wrong salt gets the line again, not a verdict.
- **The deciding words:** at L1, the cone: "the small cone" or "the big cone" (*nindho*, *wadho*), one asked of two; from L2 the salt amount, "a little" or "without" (*thorok* ✓; with and without to record).

**3.3c The coconut cart** (a reskin of Cook's chop and count)
- **Steps:**
  - Pick the coconut from the heap: the size word decides.
  - **Tap the coconut.** The stallholder chops its top off with a thwack. The child never drives the knife.
  - **The straws:** they stand in little cups of one, two and three. Tap the cup the count asks for, and the child's tap pushes its straws in, counted along.
  - Nani sips: a long slurp and "aah". That closes the step.
- **The deciding words:** which coconut, "the big one" or "the small one"; from L2 the straw count; from L3 whose coconut.

**The five questions**

| Mini-game | 1 Do | 2 Kutchi decides | 3 Fun | 4 Instruction | 5 Novel | Score |
|---|---|---|---|---|---|---|
| Pick the stall | tap a stall: 4 | the food word picks 1 of 3; the queue and the return ask stop elimination: 4 | the zoom: 4 | the asker's line, the food row on the card: 4 | idea 68's zoom-in market: 4 | **20** |
| Corn grill | pick a bundle, turn, rub, sleeve: 4 | count and toppings, with and without: 4 | kernels pop and blacken: 4 | the stallholder's call, the order: 4 | shared with the farm: 2 | **18** |
| Cassava chips | tap, lift, cone, shake: 4 | cone size, then salt: 4 | the sizzle and the golden lift: 4 | as above: 4 | a skin of the samosa fry: 2 | **18** |
| Coconut | pick, tap, push the straws, slurp: 4 | size, then count and owner: 3 | the thwack and the slurp: 5 | as above: 4 | the only top-off chop: 3 | **19** |
| Pay | tap a stack: 3 | the heard price picks the stack: 4 | the coins clink across, counted: 3 | the price said; the purse opens: 4 | pay from the shops: 2 | **16** |

All are kept. The three stalls are Cook skins, so they're cheap, and each has its own action, so they don't tire. Pay is a short beat after each one.

**The level ladder** (the three stalls and pay together)

| Level | Adds | Example |
|---|---|---|
| L1 | Masi orders; the food word picks the stall; one item each; the cone size; one with-topping; prices 1-3 | "I want corn, with lemon." … "It's two." |
| L2 | counts as bundles, straw cups and piles; "without" said last; the salt; the queue orders too; the return ask; prices to 5 | "Two corn with lemon, without chilli." |
| L3 | other ways of saying it ("bring me", "can I have", "Nani wants"); owners split the toppings; two prices said in one line, paid in order | "One for Nani with chilli, and one for Masi without." |
| L4 | one look-alike: a middle-sized cone and a middle-sized coconut beside the asked size | "The small coconut for Masi." |

**The leak test**
- **Reading:** the card shows the food rows. Past support it's speaker only. Toppings and counts are words, never pictures, from L2. Coins carry no digits.
- **Matching:** each stall has several things that could be right (both sizes, all toppings out at once, bundles and straw cups of one to three), so the zoom doesn't pick the answer.
- **Eliminating:** the queue and the return ask (L2+) mean a done stall can be asked again. All toppings, cones, bundles, straw cups and coin stacks stay out.
- **Patterns:** the order of the stalls, the asker, the toppings, the counts, the prices and who wants what change each round.
- **Waiting:** the light doesn't point at the right stall. The fry's lift is a timed toy step; its words teach, but they aren't the deciding move. **The deciding moves (stall, count, topping, size, salt, stack) never happen by themselves**: counts pick a bundle, a straw cup or a stack, and toppings and salt close only when the child taps the sleeve or the cone.

**The blind bot** across a stalls round (three stalls, first picks only): the stall picker alone is 1/3 × 1/2 at L1 (picture matching while supported, which is allowed); with the topping, the cone, the coconut's size and three coin stacks of five, the round is under 1% from L1.

**The delight:** the corn kernels popping black, the coconut top's thwack and Nani's slurp, the basket filling up.

**The speaking moment:**
- **Watch:** at stalls one and two, Masi (or the queue customer) orders to the stallholder ("*muke ba makai khape*"), and the child watches. The bubble is underlined as she says it.
- **The handover:** at stall three Masi turns and puts her purse in the child's hands, and the child's avatar steps up. The "your turn" bubble shows a picture of that stall's food.
- **The set:** closed (*makai, chips, nair*), with the pills always there.
- **The ramp:** rung 1 on the first time (say it after the model, with the words shown).
- **A wrong hearing:** if the recogniser hears a food this cart doesn't sell, the stallholder looks round his cart for it, shrugs kindly, and Masi's model plays again. Never a verdict.
- **Never a gate:** if the mic is off or hears nothing twice, the pills take over. Either way, the stallholder acts on it: this is the shared "say it, someone acts" moment, not a new copy.

### 3.4 The picnic (visit 1)

**Why:** "Let's set out the picnic." The picnic cloth is spread on the sand, and the basket is beside it. **Every spot on the cloth is outlined, all with the same outline** (Zafar's rule from pick it up and put it back: "outline all the spots, never just the right one, or it's won by elimination"; settings map §1 and §5.1, carried here by the master map). The outlines show a 3-year-old where things can go; the owner or position word picks among them.

**The scene:** E, the island framing (art bible §3). The cloth fills the lower part, seen from the child's sitting height. Behind it sit Nani (middle) and Masi (right), seen from the chest up on phones and the waist up on big screens. The child's own cushion is at the front left. Ali's tiffin box sits at the right edge of the cloth: Ali isn't there, so his box stands in for him.

**The spots** (each with the same faint outline, drawn by the shared kit as pick it up draws them): a plate place in front of each person (Nani, Masi, the child), a cup place next to each plate, the middle of the cloth, and Ali's box. Eight in all, every one outlined every time.

**The steps:**
- Tap a thing from the basket, then tap where it goes. It hops into place, and a wrong place slides back.
- The things: corn, chips cones, coconuts, cups, plates, the shell bucket, and Ali's lemon drink in his little bottle (from the lemons in the bag).
- **At L4:** pour the lemon drink into a cup, using Cook's shared pour.

**The end:**
- Everyone eats.
- The crab climbs out of the basket, snips the last chip and scuttles off sideways.
- Masi laughs: "*o, kenjo nai!*" ✓.
- Nani sips her drink: "aah". That's the served ending. Ali's lemon drink goes into his box to take home.

**The five questions**

| Question | Answer | Score |
|---|---|---|
| 1 What do you do? | Tap, then tap. At L4, pour. | 4 |
| 2 Does the Kutchi decide it? | Yes. Plates, cups and corn are identical, and every spot has the same outline, so the owner or the place word picks the spot, never the picture. | 4 |
| 3 The fun | The crab stealing the last chip, the "oh no" and the laugh; filling Ali's box | 4 |
| 4 The instruction | Masi or Nani asks: "this is for Ali", "Nani's cup". | 4 |
| 5 What's novel | Owners and positions at a meal outdoors, with food the child made. Put it in its place's picnic skin, plus the carry from the stalls. | 3 |
| **Total** | | **19: keep** |

**The level ladder**

| Level | Adds | Example |
|---|---|---|
| L1 | one thing at a time, the owner named (Nani, Masi, Ali's box) | "This is for Ali." (the corn into his box) |
| L2 | counts | "Two cups for Masi." |
| L3 | positions, with owners | "The corn in the middle." / "Nani's cup next to her plate." / "The shell on Ali's box." |
| L4 | one look-alike: half, poured beside a little and full | "Masi's cup, half." |

**The leak test**
- **Reading:** the card shows the item and the owner's face only while supported; past support the owner is a word.
- **Matching:** every spot has the same outline, so no place looks like the answer, and every person has a plate place and a cup place in front of them.
- **Eliminating:** all eight outlines show every time, and a spot never fills up and drops out, because everyone takes more than one thing. Ali's box takes several.
- **Patterns:** who gets what is random each round.
- **Waiting:** nothing places itself. The pour doesn't stop at the asked amount (an amount, as in baking).

**The blind bot:** one of about four owner spots per ask at L1, three asks: (1/4)³, under 2%.

**The delight:** the crab and the last chip.

**Speaking:** none.

### 3.5 The ride on the water (visit 2)

**Why:** "Masi's friend is taking us out on his boat." This is the built window ride with a new road: the boat's rail is the window frame, and the sea runs past in three layers:
- **Far:** islands and a big ship.
- **Middle:** other boats, birds and a buoy.
- **Near:** waves and fish leaping.

Nani names a thing, and the child taps it as it passes. The engine's rules already pass the leak test: look-alikes pass together, and things are asked only as they come into view.

**The new bit: the child sets the speed.** The ride has no Kutchi today (audit: 18 words, none Kutchi), so this needs **a change to the shared ride: Nani's speed lines in Kutchi** (*jaldi*, *aste thi*), its own row in §6 and Zafar's yes (question D).
- **Watch:** on the first stretch, Nani says "*jaldi!*" to the boatman, and the boat really rushes (the ride's three speeds). Later she says "*aste thi!*", and it eases.
- **Rung 1, the first ride:** on the second stretch Nani says "*jaldi!*" again, then turns to the child; the "your turn" bubble shows the words, underlined as she says them, and the child says it after her. The boat obeys.
- **Later rides:** the turn climbs the speaking ladder by the child's own record (`speaking.md`): words without the model, then the picture, and only at rung 4 the choice of two pictures (spray for quickly, calm water for slowly).
- **The pills are always there.** **No race:** nothing is lost at either speed.

**The joke:** the first time the boat goes quickly, Nani's big sun hat blows off and lands in the sea. Nani laughs, "oho!", and holds her headscarf. That's the reason to fish.

**The five questions:** do: tap a passing thing and say a speed (4); Kutchi: the thing named, among look-alikes (4); fun: the speed contrast and the hat (5); instruction: Nani's line (4); novel: a built engine, but the only place the child's voice changes the world's speed (3). **20: keep.**

**Levels:** the window ride's own (L1 one named thing; L2 a size or count, "two birds"; L3 two in one line; L4 the look-alike, a big boat and a small boat). The speaking turn climbs the speaking ladder by the child's own record, not by level.

### 3.6 Litter fishing (visit 2): Zafar's idea 66, as one stage

**Why:** "My hat! And look, the sea has rubbish in it. Let's fish it out." The boat stops in a calm bay by the jetty.

**The scene:** an E side-on cross-section, like a cutaway:
- **Above the waterline** (at 40% of the height): the boat cropped to its rail on the left, with Masi, Nani and the child at the rail. The boatman shows on big screens and comes forward for the net beat.
- **Below:** clear green water down to a sandy bottom. Six to eight things lie on the bottom or bob in place: a bottle, a shoe, a can, a bag, a sock, a ball, a kettle, and Nani's hat, half sunk. Fish swim among them. **The bay is a closed pool: nothing drifts in or out of view.** Every thing bobs the same gentle amount, asked or not.

**The steps:**
1. Masi asks: "the shoe!"
2. The child taps a thing. The hook drops straight down onto it (no aiming skill; this is the one new control), and it snags with a "tink".
3. **Reel it up:** tap the reel 3-4 times, each tap a click. The thing rises in a trail of bubbles, breaks the surface with a splash, dangles dripping and swings into the basket on the deck with a clunk.
4. **Each thing has its own reveal:**
   - the shoe spits out a tiny crab (the beach's crab is back)
   - the kettle pours a little fish back into the sea
   - the ball squeaks
   - the sock wriggles
5. **A wrong tap:** the hook boinks off the thing, and the thing does its own funny wobble (the ball bobs, the bottle spins). The hook comes back empty, and Masi says the word again. Nothing wrong is ever caught, so there's nothing to undo.
6. **Fish:** a fish under the hook nudges it, blows a bubble and swims off with a flick. It's never caught, and nothing is gory.
7. **After each catch:** a new thing sinks slowly from the surface to a random spot and settles before the next ask (the light waits until all is still). The generator never makes the newcomer the next answer more often than chance.
8. **The end of the round:** three or four asks, then always "Nani's hat!". The hat comes up last, dripping. Nani puts it on, wet, and everyone laughs.
9. **No "clear it all":** the boatman then sweeps the rest up in his net (a short beat, not a game step). The water sparkles, and more fish come back to look. There's no lecture line.

**The five questions**

| Question | Answer | Score |
|---|---|---|
| 1 What do you do? | Tap a thing, tap the reel. | 4 |
| 2 Does the Kutchi decide it? | Yes. The noun, then size or colour, then count, then the owner, among more things than are asked for. These are household nouns in an odd place. | 4 |
| 3 The fun | Hauling up something absurd, each with its reveal; the hat on Nani's head, wet | 4 |
| 4 The instruction | Masi says the thing once, then repeats every few seconds. The card shows the thing's row. | 4 |
| 5 What's novel | The only game that pulls things up, and the only one where home words turn up somewhere strange | 4 |
| **Total** | | **20: keep, as one stage** |

**The level ladder**

| Level | Adds | Example |
|---|---|---|
| L1 | one thing per ask, nouns only; one of each kind in the water (allowed at L1 only) | "The shoe!" |
| L2 | two of each kind, so each move has two words (the thing and its size or colour) | "The red bottle." / "The big shoe." |
| L3 | counts as clumps (cans tied in a ring of one, two or three; bottles in a net bag of two), and the "no" ask said last | "Two cans." / "The bottle, not the red one." |
| L4 | one look-alike: a second sun hat, the girl's small one, beside Nani's | "Nani's hat." |

**The leak test**
- **Reading:** the card shows the thing only while it's supported, then speaker only. Every noun here is still to record, so until the boat sheet a reader wins on grey English. The stage isn't counted as teaching until then.
- **Matching:** from L2 there are two of every kind, so the picture alone never settles it.
- **Eliminating:** a new thing sinks in after each catch, so the field never shrinks. The hat is always last, but from L4 there are two hats.
- **Patterns:** positions are random, and which things appear is drawn from the pool each round.
- **Waiting:** nothing comes to the hook, and **nothing moves differently from anything else**: everything bobs alike, nothing drifts, so watching for the still one (or the moving one) tells you nothing.

**The blind bot** picks among 6-8 things, first picks only, across 4 asks: at L1 (1/6)⁴, under 0.1%; under 1% at every level.

**The delight:** the shoe with the crab in it, and Nani's soggy hat.

**Speaking:** the ride's speed turn is the boat day's one speaking moment. Fishing stays a listening game.

### Maybe later (scored lower, parked; nothing removed)

- **The kite** (Zafar: only if it earns a game): hold and release on "now" and "let go". It's mostly timing, with "slowly" and "quickly" as the words. **14.** It still hops into the bag by itself, as he wrote.
- **The moat:** dig round the castle and pour sea water in, "a little" or "full". It's the sandcastle's later visit. **16.**
- **Sort the catch** (idea 66's other half: collect everything, then sort with a helper): sorting by kind is a picture rule, not language, unless each bin is named in Kutchi. **13.**
- **The rock pool:** find the crab by position words (under the rock, next to the weed). Strong for positions, but hide and seek owns them. **17.**
- **Paddling** stays a beat ("don't run, walk", *bhaj na, hal*, in engine; "wait for me", *mu lai khobar* ✓).
- **The extras taken out of L4** (each is art and a word Mum hasn't recorded), for later visits once their words land: the pink shell, the crab carrying a shell to a new spot, the cup mould, two coloured shells on one tower, yellow coconuts and coloured straws, change from a bigger coin (the shops own change), the dolphin's fin, the boatman's cap, the cup and the mug in the sea.

---

## 4. The child's first-ever round (visit 1)

The door, the bag, the bus ride and meeting Masi are built engines with their own onboarding. This walkthrough starts where the beach starts. **The first play is shells and the sandcastle only** (§2); the stalls and the picnic get their own first-time showing on the plays that add them.

### 1. Shells: the first screen

- The sand is dimmed, apart from one lit box round the open bucket. Masi's face is in the corner.
- A wave rolls in and out. When it's still, Masi's bubble appears and she says "bring me the big shell".
- The card pops up big beside the panel: one shell, its Kutchi under it, and a speaker. It flies into its row on the left.
- **Each big shell gets its own lit box** (two boxes; one box never hugs two things), and both bounce gently. Everything else stays dim and untappable.
- The child taps one. It lifts, plinks into the bucket, and the row ticks. Masi says *shabash* once.
- **Second ask, "the small shell":** the boxes show once on the new action (choosing small), then the dim clears fully. From now on the child plays free.
- **Third ask:** the crab is scripted under one of the shells that answer it (§3.1), so the child's right pick reveals it. It blinks, waves and dashes into the foam. The child laughs.
- The bucket rattles full, and the screen slides on.

### 2. Sandcastle

- Masi kneels beside the patch and pats the sand. Her line: "fill the big bucket".
- The box lights the big bucket. Tap it, and it hops to the heap.
- The box moves to the heap: tap, thwump; tap, thwump. The fourth tap fills it to the rim. This first time only, the box moves to the bucket at four, so the child learns that full is where you tip; the overflow is never shown as a lesson, only met.
- The box moves to the lit spot: tap. The bucket flips, thumps and lifts. Shloop. A tall tower.
- "And then the small one": the child does it alone now; the box shows only for new actions.
- "A shell on the big one": tap the shell (the box shows tap, then tap once), then the big tower.
- Masi claps. The crab pops out of the tall tower wearing a shell. Nani's camera clicks.

### The end

The shared two-page end screen:
1. **Progress:** the shells and the castle photo, each with its ticks. There's no score.
2. **The word cards:** this round's new words, with English under them for the grown-up.

Then home: the shell goes onto Nani's shelf. The evening book shows the castle and the crab.

### The first time the stalls play (the beach's second play)

- The wide beach: three stalls. Masi says "I want corn". **Each stall gets its own lit box** (three boxes), because the choice is the lesson, so the light shows where to choose, not what. The child taps the corn cart.
- **Zoom in:**
  - The stallholder says "can you help me?".
  - The box shows each new action once: tap the bundle of one onto the grill, tap to turn it when the kernels pop, tap the lemon, then rub it along the cob, then tap the paper sleeve. The cob drops into the sleeve.
- **Pay, the watch step:** the stallholder says the price; Masi holds her purse open and taps the stack herself while the child watches, and the coins clink across, counted. Zoom out: the corn cart greys, and the corn drops into the basket.
- The other two stalls call. At the chips, the child pays for the first time (the box lights the purse once, and the stacks stay unlit, so the number chooses), with one new thing shown: the basket handle to lift.
- **At the coconut cart:** Masi turns and puts her purse in the child's hands. The "your turn" bubble shows a coconut, and the model line plays with the words underlined. The child says it, or taps the pill. The stallholder picks up a coconut. Tap: thwack. Nani slurps.

### The first time the picnic plays (the beach's third play)

- The cloth, Nani and Masi sit down. All eight outlines show. Masi says "this is for Ali".
- The box lights the basket (tap the corn), then Ali's box gets its own box once: tap, then tap, shown once. The corn drops in, and the row ticks.
- Two more asks: Nani's cup, Masi's coconut.
- Everyone eats. The crab snips the last chip. Masi says "*o, kenjo nai!*", everyone laughs, and Nani says "aah". Ali's lemon drink goes into his box for home.

---

## 5. Later visits and harder versions

- **Every stage climbs L1 to L4** (§3) as the child plays the beach again. The day's list sets each stage's level.
- **The boat day** is the second visit (§3.5-3.6).
- **Visit 3, ideas, in order of value:**
  1. **The sandcastle swapped:** the child describes, and Masi builds (speaking, closed set: big or small bucket, a little or fill it). This is role reversal on a game the child knows well.
  2. **The moat** as the sandcastle's added step.
  3. **The kite**, if Zafar wants it, as its own small game.
  4. The L4 extras parked in §3 ("Maybe later"), each once its word is recorded.
- **The evening book's past tense:** "we found three shells", "the crab took the chip", once Mum records the past forms.

---

## 6. What it reuses and what is new

| Piece | Reused from | What's new in it |
|---|---|---|
| Shells | **built on the shared kit** (`js/shared/host.js`, `order-card.js`, `guide.js`, `focus.js`, `onboard.js`) with Cook's count (`js/cook/mechanics/count.js`) for the counted-along hop; Find it's size and decoy rules (`js/find/gen.js`, 4b *Which one?*) copied as generator rules, **not** Find it's greybox engine | the tap-in-a-scene search on the kit; the wave that re-lays the spread; piles as counts; the crab under a shell (Find it 4d's openable reveal, rebuilt as a kit reaction) |
| Sandcastle | the shared kit as above | **new engine: fill and stack** (the only new engine): moulds, tap-to-fill steps with the overflow window, tip-to-tower, a generated plan, stacking two high. About the size of one Cook mechanic plus a plan checker. |
| The three stalls | Cook's grill (`mechanics/grill.js`, `stations/mishkaki-grill.js`; the same station as the farm's corn), fry (`mechanics/fry.js`, `stations/samosa.js`), chop and count (`mechanics/chop.js`, `count.js`); the clinic's zoom-in from a room (`js/clinic/heal/scene.js`) | the stall picker with greyed-done stalls, the queue and the return ask (data plus a small picker); bundles and straw cups as count groups; the sleeve and the cone as closing moves |
| Pay | count-to-a-number's pay, designed for the shops (`count-to-a-number.md`, `shops.md`) | **one pay design proposed, not two:** coins in stacks of one to five, so the number picks the stack (no "stop at N"). The shops' version today is coins onto the counter to a heard number, which is the stop-at-N this design avoids, so the stacks rule goes to Zafar as a numbered change to `count-to-a-number.md` (question E). The beach builds whichever he picks; it doesn't use the counter version as is. |
| Picnic | **put it in its place after its rebuild onto the kit (R7)**: `js/tidy/engine.js` is greybox. The rebuild is the one pick it up and put it back needs first, so its cost is shared. The shared spot outline comes with it. Cook's pour (`js/shared/pour.js`) at L4 | the picnic data and art |
| Speaking at the stall | Conversations (`js/shared/conversations.js`), `js/shared/speech.js`, `say.js`; the shared "say it, someone acts" moment | none (data), once the order lines are recorded |
| The boat ride | the window ride (`js/shared/window-ride.js`, `js/day/window.js`; a road in `data/day.json`) | a boat road (data and art); the hat beat; **a shared-engine change: the ride gains Nani's speed lines in Kutchi** (its own fix-list row and Zafar's yes, question D), and the speed set by the child's voice |
| Litter fishing | the shared kit; the shells' generator rules (decoys, piles as clumps) | **a small new control: the hook** (tap a thing, the hook drops, then tap to reel); the closed pool with the sink-in newcomer |
| The day | the day runner (`js/day/day.js`, `data/days.json`), door, book | two day lists: the beach (growing over three plays) and the boat day |

Each stage declares and loads only its own art when it's chosen.

**Bots to write:** the leak bot for shells, the sandcastle (with the L1 allowance stated in §3.2), the stall round and fishing. Each plays blind on a learned save, first picks only, and must win under 10% of rounds (15% for the sandcastle's L1). The window ride's bot already exists.

**The order of work** (each a sprint or part of one; Zafar picks):
1. **Mum's beach sheet A** (§1) and the art run's backgrounds and Masi's sheet (her likeness first if she's in the game as herself).
2. **Shells and the sandcastle** on the kit: the first play of the beach. One builder.
3. **The boat day:** the boat road, the ride's Kutchi speed lines (once he says yes), and fishing with the hook. Needs the boat sheet to teach.
4. **The stalls and pay**, once he picks the pay design; the corn stall teaches once sheet B's with and without land.
5. **The picnic**, after put it in its place's rebuild (scheduled with pick it up and put it back).
6. Snap joins the day after its own rebuild.

---

## 7. The art and the layout

All art is made in ChatGPT runs Zafar supervises (non-negotiable 8). It goes in one paste block, with the backgrounds locked first. Code draws nothing: no sand, water, food or tools are drawn in code (lesson 7). Interface marks (the lit box, the picnic's spot outlines, the greyed stall) are the shared kit's, not art.

### Cameras (one per scene, art bible §3)

| Scene | Camera | Sprites in that camera |
|---|---|---|
| Shells | **T**, exactly overhead: wet sand with the foam edge along the top | shells (2 sizes plus the L4 middle size × red and white, as singles and touching piles), a pebble, the crab (top-down, plus a scuttle pose), the bucket (top-down, open) |
| Sandcastle | **E** at sand height, horizon at about 55% | buckets (big, small, one colour), the sand heap with the spade, the fill steps and the overflow, towers in 3 heights × 2 widths, the slump, Masi kneeling (3/4 and front), the crab on a tower |
| The stalls (wide) | **E**, the bazaar framing (horizon about 55%) | three stall carts in full colour, three stallholders (3/4 and front), one or two beach-goers, Masi and Nani standing, the basket |
| Corn grill zoom | **T** (the Cook station rule) | cobs raw, grilled and black-spotted; cob bundles of 1, 2, 3; the lemon half, the chilli; the paper sleeve |
| Chips zoom | **T** | the raw and golden cassava chips, the fry basket with its handle, cones in two sizes (and the L4 middle), the salt shaker, salted chips |
| Coconut zoom | **E** against the cart (Cook's chop allows T or E; E so the top flies off) | green coconuts in 2 sizes (and the L4 middle), whole and open; straw cups of 1, 2, 3 |
| Pay | the zoom's camera; the purse in F | the purse (open, held), coins in stacks of 1-5, no digits |
| Picnic | **E**, the island framing: the cloth's front edge at about 65%, people behind | Nani and Masi sitting (3/4 and front), the cloth, plates, cups, the basket, Ali's tiffin box and his little bottle, the lemon drink jug, all items in F view |
| The boat ride | the window ride's three layers behind the boat's rail | sea layers (far, middle, near), the boat rail frame, boats in 2 sizes, birds, fish leaping, the hat flying |
| Litter fishing | **E side-on cross-section**: the waterline at 40% | the boat cropped to its rail, Masi, Nani and the girl at the rail, the boatman (big screens and the net beat); the hook and line; things underwater in 2 sizes and 2 colours each (bottle, shoe, can, bag, sock, ball, kettle), can clumps, the bottle net bag, Nani's hat and the girl's hat, fish, the tiny crab, the boatman's net |

**Counts, honestly:** 5 backgrounds (shells sand, sandcastle, stalls wide, picnic, fishing bay) and 1 sea road of 3 layers. **About 120-150 sprites:** the fishing things alone are 7 kinds × 2 sizes × 2 colours (28) plus clumps, hats, fish and the net; the shells about a dozen variants; the three carts, three zooms' props and the towers and fill steps make up the rest. **Five character sheets:** Masi, three stallholders and the boatman (two poses each), plus one or two generic beach-goers. Masi likeness: if she's a real person, her likeness run comes first (art bible §1).

### The family's rules in the art

- Everyone at the beach is fully dressed: long sleeves, long trousers or skirts, headscarves where worn.
- There's no swimwear anywhere, and paddling is ankle-deep.
- No religious markers.
- The stalls sell only corn, chips, coconut and the lemon drink. There are no sweets or ice cream.

### Layout

Two layouts, switched by height (UX §12; checked at 740x320, 930x430, 1280x665, 1920x1080, and 915x275 for the Z Fold). The cards panel is on the left, about 22%, so **the play area is about 715x275 on the Z Fold and 577x320 at 740x320**; the numbers below are for 715x275. The cog is the only button on the play screen. People stand in the middle and on the right, nothing goes over a face, and on phones items and faces stay big while the room comes from the scenery. **The field (how many things, how high) is the same on every screen**, so the game played is the same; big screens only get more scenery.

| Scene | Phone (715x275 play area) | Big screens |
|---|---|---|
| Shells | The foam edge crops to a 16 px sliver. Masi's face is a 56 px round in the top right. At most 9 shells in at most 5 piles, in two rows of about 120 px each (big shells 80 px, small at 0.8×, piles as small triangles about 140x120): 16 + 240 = 256 px. | The foam edge's full width; the same field, larger. |
| Sandcastle | The kit is a 72 px strip along the bottom-left two-thirds (four items). Masi kneels on the right third, her face about 64 px, her bubble in the sky to her left. The castle patch is the 200 px above the kit: towers 84, 60 and 36 px tall on phones, **stacked two high at most** (84 + 60 + a 20 px shell = 164 px), so they fit with room for the sky. | The same, with more sky and sea. |
| Stalls (wide) | The three stalls fill the width, about 225 px each and 190 px tall, with **one row of faces**: the stallholders under their awnings at about 48 px. **Nani and Masi step out of the wide view;** whoever is ordering (Masi, or the queue customer from L2) is a 56 px round in the top-right corner, in the 75 px of sky above the awnings. The bubble goes left from the round into that sky. No queue on phones. | Masi and Nani at the waist in front, middle and right; the full queue. |
| Stall zooms | The station fills the play area, as Cook's stations do at phone size. Masi's corner round stays top right. | As Cook. |
| Picnic | People take the top 40% (110 px): Nani and Masi from the chest up, faces 56 px. The cloth takes the bottom 60% (165 px): two rows of outlined spots with items at 72 px (back row: Nani's and Masi's plate and cup places, 4 × 80 px; front row: the child's plate and cup, the middle, Ali's box). The basket is at the cloth's front left. | Up to 5 people at L4 on big screens only as scenery (they don't take spots); a wider cloth. |
| Fishing | **The waterline at 40% (110 px of sky).** The boat is cropped to its rail along the waterline at the left; Masi, Nani and the girl stand at the rail, cut at the chest, faces 48 px, about 180 px across. Masi's bubble goes **to the right of the faces** in the sky, never above them. The boatman is off screen (he comes in for the net beat). Underwater, 165 px: two bands of things at 64 px (128 px) on a 20 px seabed, at most 4 per band. | The whole boat with the boatman; a deeper seabed; the same 6-8 things. |

Bubbles go into free space (the sky above the stalls, beside the faces at sea), never over the side panel or a face.

---

## 8. What it borrows from other games

- **Dr. Panda Restaurant and Toca Kitchen 2:** guests who react to the food, and food that changes as it cooks. Hence the corn's popping black kernels, Nani's slurp and the basket filling. Toca Kitchen's long fridge-to-pan chains are the warning, so each stall is three or four short steps, each closed by a move.
- **Juno Lamb Saves the Ocean, Marine Missions and magnetic fishing toys:** the clean-up and the joy of hauling things up. Their pitfalls are designed out: a fiddly rod (our hook drops where you tap), a preachy message (no lecture line), and "catch everything" (we have asks, then the boatman's net).
- **The barrier game ("behind the screen")** from language classrooms: one side describes and the other builds. The sandcastle takes its core (the plan is only heard); the windbreak version is an option for Zafar (§10, decision 4).
- **Monki and other hide-and-seek apps:** they reshuffle after every find. Our wave re-lays the shells.
- **Toca Life: Vacation:** the beach as a place of small toys. We take only the setting's feel, not its free play.
- **Our own games:** Find it's size rule and openable reveal, the clinic's zoom-in rooms, Cook's grill, fry, chop and pour, pick it up's outlined spots, the window ride's speed contrast, and the speaking ladder's watch, then handover.

---

## 9. The lessons checklist

| Group | Verdict | How |
|---|---|---|
| 1. The heard word decides | **Pass, with exceptions stated** | Leak tests written for every stage (§3), each with a bot number. Deciding words counted honestly (§1): 18 of 40 recorded for visit 1, 2 of 14 for visit 2. Rows tick only on a right first pick. A need the picture can't settle: identical plates under identical outlines, two sizes of every shell and thing, a castle plan that is only heard. Two words a move from L2, counts included (bundles, cups, piles, stacks). **Exceptions:** the corn stall doesn't teach until with and without are recorded; the fishing nouns are all still to record, so the boat day doesn't teach until its sheet; the sandcastle's L1 bot is about 12%, the stated L1 allowance. |
| 2. Onboarding and the first round | Pass | The first play is tiny: shells and the sandcastle (§2, §4). One lit box per live thing; no finger and no fly-in. Each new action is shown once. The dim clears fully. Every new screen (shells, the castle, the stall picker, each zoom, pay with its watch step, the picnic, the fishing hook) has its showing on the play that adds it. Tap then tap throughout; drag only along the cob. 5 places at L1. The first crab is scripted by rule. |
| 3. Instructions | Pass | Masi, the stallholder, the queue customer or Nani is on screen and speaks before the card. The card is what's wanted; the guide box says the step. Bubbles belong to faces. The speaking turn is modelled twice before the handover. One line per moment: *shabash* once per step, not per tap. |
| 4. Pacing and waiting | Pass | No Done and no Next: the tip, the sleeve, the cone, the slurp and the reel are moves in the world that close each step. Counts pick a group (pile, bundle, straw cup, stack, clump), never a stop; amounts stop in a window with no cap (the sandcastle overflows, the salt heaps). Taps skip speech. Hints by the rulebook. The wave settles before the ask. Nothing leaves before it's asked; the fishing bay is a closed pool where everything bobs alike. The ask repeats for non-readers. |
| 5. Feedback and the end | Pass | A shake and the word; the wrong tower slumps, the overflow spills, the wrong topping puffs off, all redone. Every miss has its own funny reaction (the crab ducks, the ball squeaks, the bottle spins, the stallholder shrugs). Rows tick when the step closes. Each stage ends with something served: the castle photo, Nani's slurp, the picnic "aah", the wet hat. The shared end screen is used. |
| 6. Layout | Pass, numbers in §7 | Two layouts by height, five sizes. Each phone layout is worked in pixels at 715x275: one row of faces at the stalls, Masi in a corner round, the fishing waterline at 40%, stacks two high, nine shells at most. Faces clear; people in the middle and on the right; one background each; the cog only. To check at build with the four-size check. |
| 7. Art and camera | Pass | One camera per scene (§7). Shells are exactly overhead. Code draws nothing; interface marks are the kit's. Items in the plaster style. Contact shadows only. Calm faces and gentle zooms. Two poses per speaker. One paste block. Sprite count stated honestly (120-150). |
| 8. Speaking | Pass | Two moments, each inside an exchange watched first, both at rung 1 the first time. Closed sets of 3 and 2 (the eye test's *haa / na* is the precedent for 2). Pills always there. It's a play action: the stallholder acts (and shrugs kindly at a wrong hearing), the boat speeds up. The handover prop (the purse) is handed over only at the turn. Reuses the shared moment rather than adding a seventh copy. The ride's speed lines are a shared-engine change for Zafar's yes. |
| 9. Levels | Pass | Every stage has an L1-L4, each adding one thing, made harder by the Kutchi, never the gesture. Each L4 is one look-alike (the middle-sized shell, cone and coconut; half; the girl's hat). Extras are parked for later visits. Level up after 3 rounds. |
| 10. Words | Pass, with gaps reported | Built from recorded frames; every gap listed and sent to Mum's sheets A and B (§1): with and without, "careful, it's hot", the order frame, the price frame. Nothing glued by hand. One natural sentence per person. Every count and colour said is written on the card. 3-5 new words a round, each heard 3+ times. |
| 11. Culture | Pass | Halal food only; no sweets or ice cream as rewards; modest dress; paddling only; no religious markers. The child never holds or drives the knife (the coconut is tapped; the stallholder chops) and never touches the oil. |
| 12. Fun | Pass | Hands busy at every step (fill, tip, turn, rub, wrap, shake, push the straws, reel). "Kind of funny": the crab three times, the overflow and the slump, the shrug, the wet hat. Gestures that feel good: the tip-and-lift, the reel. Contrast: tall and stump towers, quick and slow on the boat. No fatigue: no two stalls share a main action. The asks give the toy a goal; the castle photo and the hat go into the book. |
| 13. Mistakes made twice | Watched | Every level designed (§3). Every step's closing move is named here, not left for the builder (the sleeve, the cone, the tip, the slurp). The engines that need a rebuild first are listed with the order of work (§6). Builders reuse Cook's art only where §6 says so. Judge on film for the tip, the overflow, the reel and the zooms, not on stills. |

**The ten questions, in short:**

1. **Which heard words decide each move?** Listed in §1, counted honestly, with what's recorded.
2. **How does the Sceptic fail?** A plan only heard, two of every kind, the queue and the return ask, groups for counts, windows with no cap for amounts, identical outlines, a field that never thins, and nothing that moves differently.
3. **What need can't the picture settle?** Identical plates under identical outlines, two sizes, a heard plan.
4. **What does the first round light up?** See §4.
5. **Who asks?** Masi, the queue customers, the stallholders and Nani, in the frames in §1.
6. **What do the hands do?** Every step has a tap action and a closing move.
7. **Where's the "kind of funny" moment?** The crab, the overflow and the hat.
8. **How does it end, and what's served?** The photo, the slurp, the "aah" and the hat.
9. **What changes at each level, and is L4 its own?** The ladders in §3; each L4 is one look-alike.
10. **Does it fit all five sizes, with real art in one camera?** Yes, worked in pixels in §7.

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, then the reason, then the answer I assumed. Lines marked *(revised)* changed after the critique (§12).

1. **The four beach stages stay as he listed them**, with Snap kept in the day where he put it, and the kite parked (it still hops into the bag). *His 1 Nov "yes" to keeping the four. Likely: yes.*
2. **The boat day is the beach's second visit:** door, bag, the ride on the water, litter fishing, an optional coconut on the jetty, home. *His Part 7 placing; the research says fishing is thin alone. Likely: yes.*
3. **Masi voices her own asks** if she'll record a short set (about 15 frames). Until then, Nani asks, and the bubble is Nani's. *Only real family voices; Masi is already the dialect tie-break. Likely: yes, and he'll ask her.*
4. *(revised)* **The sandcastle is his design as written: Masi beside the child, telling; no second castle.** The windbreak version (Masi builds her own castle hidden behind a windbreak, then the reveal of twin castles) is **an option for his word**, costing a windbreak in two states, Masi kneeling behind it in two poses, and her duplicate castle (the tower sprites reused). Every step is put right on the spot, so the two castles always match, which makes the reveal a show, not a check. *Non-negotiable 1: he didn't ask for it. Likely: the plain version; the windbreak if he likes the reveal.*
5. *(revised)* **The castle grows sideways at L1-L2, stacking comes only with "on top" at L3, and stacks are two high at most on every screen.** *Big-then-small stacking is physics, so a no-Kutchi player would always get it right; three high doesn't fit a phone. Likely: yes.*
6. *(revised)* **Amounts (a little, half, fill it) are chosen by the child stopping, closed by the tip, with no cap:** full is four or five spadefuls, and a sixth overflows. *Matches baking's agreed rule (no fill line, no cap); the cap made "fill it" tap-until-full. Likely: yes.*
7. *(revised)* **Every count picks a group:** piles (shells), bundles of cobs, cups of straws, stacks of coins (pay) and clumps (fishing). Nothing "stops by itself". *E2P 4 says a count ends at its number, which makes "tap until it stops" win, so the number must choose something. Likely: yes; this may become the pattern for every game.*
8. *(revised)* **The stalls: the asker orders (Masi at L1, the queue too from L2), the stallholder asks the child to help make it, and the child pays from the purse Masi holds open; at the third stall she puts the purse in the child's hands for the speaking turn.** *This joins idea 68 and the 19 Oct pay (Masi's coins) in one story, keeps three prices a round, and makes the purse a real handover prop. Likely: yes.*
9. **The return ask from L2** (a greyed stall can wake again). *Otherwise the last stall is a free pick by elimination. Likely: yes; his greyed-out stall stays.*
10. **The three dishes are corn with lemon and chilli, cassava chips, and coconut** (the research's pick, replacing fried doughnuts). *Halal, coastal, mostly recorded words, no sweets. Likely: yes.*
11. **The corn stall is the same station as the farm's corn stall**, with beach dressing and a different background. *One build, two days. Likely: yes.*
12. *(revised)* **Pay at every stall, as a short one-tap beat, in stacks of one to five;** the first time, Masi pays while the child watches. *Numbers heard three times a round; a price of five needs a stack of five. Likely: yes.*
13. **Stallholders are generic beach people** (two men, one woman), voiced by family members other than Mum, so Nani's voice is never on a stranger. They say only three lines: "can you help me?" ✓, the price, and thank you. *Only family voices; Mum's voice is Nani's. Likely: yes, with Zafar or Dad as the men. The woman's voice is open (question A).*
14. **The picnic uses the island camera (E)**, people behind the cloth, not a top-down cloth. *Owners need faces; the art bible's island framing already exists. Likely: yes.*
15. *(revised)* **Ali's tiffin box stands in for Ali at the picnic, and his lemon drink goes home in it** (his 19 Oct thing for Ali). *Gives a fourth owner and keeps his line. Likely: yes.*
16. **The crab is the day's running joke** (under a shell, on the castle, stealing the last chip, in the shoe on the boat day). The crab is never food. *The same joke each visit, so the child waits for it; halal. Likely: yes.*
17. **Litter fishing: Masi asks for one thing at a time; there's no free collecting and no sorting.** "Collect all, then sort" is parked. *Sorting by kind is a picture rule, not language. Likely: yes.*
18. **The hook drops where the child taps, and the child taps to reel.** No aiming or casting. *Fiddly rods are the top complaint in fishing apps. Likely: yes.*
19. **Fish are never caught;** they nudge the hook and swim off. The boatman's net clears the rest without a message line. *Nothing gory, no preaching, no "clear it all". Likely: yes.*
20. **Nani's hat blows off on the ride and is the last catch.** *It gives the fishing a reason, and the day a joke the child retells. Likely: yes.*
21. *(revised)* **The child says "quickly" (and later "slowly") to the boatman** as the boat day's speaking turn, **at rung 1 on the first ride** (Nani says it, the child repeats); the two-picture choice comes only at rung 4. *The ladder starts at rung 1; the ride gains Nani's Kutchi speed lines first (question D). Likely: yes.*
22. **The fishing nouns come from the day at home's list** (bottle, shoe, can, bag, sock, ball, kettle). *One recording round serves three games. Likely: yes.*
23. **Shells are top-down.** *Perspective would make far shells look small, which breaks the size rule. Likely: yes.*
24. *(revised)* **Fishing is an E side-on cross-section with the waterline at 40%, the boat cropped to its rail, and a closed pool where everything bobs alike.** *Three faces and a bubble need 110 px of sky on the Z Fold; a still answer among drifting things is a tell. Likely: yes.*
25. *(revised)* **The first play is tiny: shells and the sandcastle.** The stalls join on the second play, the picnic on the third; the boat day opens after the first play and stays the second visit. *The method's tiny first session; his boat-day placing kept. The day list is data. Likely: yes.*
26. *(new; reverses my first draft)* **Every spot on the picnic cloth is outlined, all alike.** *His pick-it-up rule (settings map §5.1); my draft read "every spot outlined" as the leak when it is the fix. Likely: yes; it's his.*
27. *(new)* **Shells are built on the shared kit with Cook's count, borrowing Find it's size rules, not on Find it's greybox engine.** *Find it's engine needs a rebuild (R7) the beach shouldn't wait for. Likely: yes; if he schedules Find it's rebuild first, the shells move onto it.*
28. *(new)* **The picnic waits for put it in its place's rebuild**, shared with pick it up and put it back. *Its engine is greybox (R7); one rebuild serves both. Likely: yes.*
29. *(new)* **The corn stall (and the chips' salt) teach only once "with" and "without" are recorded;** until then they play as toys with grey English. *Non-negotiable 2: no hand-glued Kutchi. Likely: yes.*
30. *(new)* **The coconut is tapped and the stallholder chops it;** the child's moves are the straw cup and the slurp. *Nothing a child could copy and get hurt by (lessons 11.3). Likely: yes.*
31. *(new)* **Each L4 adds one look-alike;** the extras (pink shell, cup mould, yellow coconuts, coloured straws, change, the dolphin, the cap and the mug) are parked for later visits. *The rulebook's L4, and each extra is art and an unrecorded word. Likely: yes.*
32. *(new)* **The bag is his 19 Oct list:** the sun hat (the red one, not the blue), the towel, the bucket and spade, the water bottle, lemons; the kite hops in by itself. *Non-negotiable 1. Likely: yes.*
33. *(new)* **His two-step castle line ("first the big, and then the small, in the order heard") comes at L2,** not L3. *The castle grows sideways, so it's safe, and it's his core line. Likely: yes.*
34. *(new)* **Art size is medium-large: 120-150 sprites, five backgrounds, a three-layer sea road, five character sheets.** *Recounted from the camera table. Likely: he decides on cost.*

**Open questions that are genuinely his**

- A. **Who voices the stallholders, the queue customers and the boatman?** I assumed Zafar or Dad for the men. For the woman at the chips stall and a queue customer, is there a family voice other than Mum and Masi, or should all be men?
- B. **Mum's sea words.** He wasn't sure how many sea words have a catchy Kutchi word (31 Oct). The words in §1 go on Mum's beach sheets A and B. If she says Kutchi uses the English word (as with *chips* and *cup*), that's fine and recorded as hers. Also: *nair* or *naariyel* for coconut (the clash list).
- C. **Masi's likeness.** If she's in the game as herself, a likeness run comes first. Otherwise, use the cast's placeholder (the teal headscarf).
- D. **The ride gains Nani's speed lines in Kutchi** (*jaldi*, *aste thi*): a change to the shared window ride, for every ride, so it needs his yes and its own row. *Recommended: yes.*
- E. **One pay design:** coins in stacks (the number picks the stack) as a numbered change to `count-to-a-number.md`, replacing "coins onto the counter to a heard number" for small prices. The shops' bigger numbers (to 20, then 100) would need their own answer, such as stacks of five and ones. *Recommended: yes for prices to five; the shops' design to follow.*
- F. **The sandcastle's windbreak** (decision 4): plain, or the barrier-game reveal at its art cost? *Recommended: plain first; the windbreak later if he likes it.*

---

## 11. ChatGPT mock-up prompts

Five prompts, one for each screen that looks different. Attach the listed references. Each shows Zafar one moment of play. Nani's locked reference is `sources/art/s08/sheet-nani-final-1.png` (art bible). Interface states (greying, outlines as code, ticks) are left to code, except where a mock-up needs to show a play mark, and then it says so.

### Prompt beach-boat-1: Shells

The top-down sand with shells in two sizes, at the moment the child lifts the shell hiding the crab. It shows the size choice and the day's running joke.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: wet sand at the edge of a calm sea, seen exactly from overhead, straight down (90 degrees, no horizon, no perspective). A thin soft white foam edge of the sea runs along the top of the frame. On the smooth wet sand lie five seashells spread out in two loose rows with clear space between them: two big spiral shells, two small spiral shells of exactly the same shape and colour at a smaller size, and one grey pebble. A child's plain blue plastic bucket stands open at the right edge, seen from above, two shells already inside. In the top right corner there is clear empty sand (a face will go there). The moment: one of the big shells has just been lifted a little off the sand, and underneath it a small orange-red crab with big friendly stalk eyes is waving both claws, about to scuttle sideways. A few sand grains are flying. Everything casts a soft contact shadow.

Style: match the attached references: a stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, believable materials (glossy shell, wet sand sheen), clean surfaces, no outlines, no cel shading, no photorealism, no depth-of-field blur.

At phone size it must read clearly: the two shell sizes must be obviously big and small at a glance, the crab's eyes and claws must read, and each shell must be big enough to tap with a small finger.

Absolutely no text, letters or numbers anywhere in the image.

Attach: https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/m1-farm-mid-fields-v1.png
```

### Prompt beach-boat-2: The sandcastle

The moment the last tower lifts and the crab pops out on top. It shows the build by amounts (three tower heights) and the joke, with Masi beside the child.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: a sunny beach seen at eye level from sand height, the calm sea and a pale sky far behind with the horizon at about 55 percent of the frame height. In the middle, on smooth damp sand, stands a child's sandcastle: a row of three towers side by side made from buckets, one tall, one short and squat, one tiny stump, each with a small shell on top. A small orange-red crab peeks out of the top of the tall tower wearing a shell like a hat. On the right, kneeling beside the castle, a smiling woman in her forties wearing a teal patterned headscarf and a long-sleeved embroidered tunic claps her hands, seen from the waist up, her face fully visible and clear of the castle. Along the bottom left, in a neat strip: two plain yellow plastic buckets of exactly the same colour and shape, one big and one small; a heap of dry sand with a spade standing in it; and a short row of seashells. Soft contact shadows on the sand.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (packed damp sand with crisp bucket ridges, plastic buckets), no outlines, no photorealism. The woman is modestly dressed: long sleeves, headscarf.

At phone size it must read clearly: the three tower heights (tall, squat, stump) must be obviously different, the two buckets must differ only in size, and the woman's face must stay clear of everything.

Absolutely no text, letters or numbers anywhere in the image, including on the buckets.

Attach: https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/c2-town-road-view-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
```

### Prompt beach-boat-3: The three stalls

The wide view of the three stalls, at the moment the child chooses one. It shows idea 68's zoom-in market with every stall calling for help. (The greying of a done stall is done in code, so every stall is in full colour here.)

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: the top of a sunny beach seen at eye level, horizon at about 55 percent, the sea and a few palm trees behind, a band of clear pale sky above the stalls. Three small food stalls stand side by side across the full width on the sand, each a simple painted wooden cart with a cloth awning, all in full bright colour. Left: a corn cart with a charcoal grill, corn cobs roasting and more cobs lying in small tied bundles, a man in a cap and a long-sleeved shirt behind it, waving. Middle: a cassava chips stall with a small fryer and two paper cones, one big and one small, a woman in a headscarf and long-sleeved tunic waving and calling. Right: a coconut cart heaped with green coconuts and little cups of straws, a man in a long-sleeved shirt waving. The three stallholders' faces sit in one row at the same height, under their awnings, clear of each other. In front, at the right edge of the frame and low, stands a woman in a teal patterned headscarf and long-sleeved tunic holding a woven picnic basket, seen from the waist up, her face clear of the stalls. Everyone is modestly dressed; nobody wears swimwear.

Style: match the attached references: a stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, chunky simplified shapes, believable materials (painted wood, charcoal glow, glossy corn, rough coconut husk), no outlines, no photorealism, calm uncluttered composition.

At phone size it must read clearly: the three stalls and what each sells (corn, chips, coconuts) must be recognisable at a glance, and every face must be clear of the stalls and of each other.

Absolutely no text, letters or numbers anywhere in the image, including on the awnings, carts, prices and signs.

Attach: https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/c2-town-road-view-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
```

### Prompt beach-boat-4: The picnic

The cloth with the family behind it, at the moment the crab steals the last chip. It shows owners and places, every place marked alike, with food the child made, and the funny end.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: a picnic on the sand seen at eye level from a sitting child's height, framed like a kitchen island: a plain patterned picnic cloth spread across the lower 60 percent of the frame with its front edge nearly horizontal, and behind it, seen from the chest up in the top 40 percent, a grandmother (match the attached grandmother sheet exactly: cream kameez with a few bold red motifs at the neck and cuffs, plain red dupatta, no rings) sitting in the middle and a woman in a teal patterned headscarf and long-sleeved embroidered tunic sitting on the right, both laughing. The calm sea and pale sky behind them. On the cloth, in two neat rows with clear space between things, every place is marked by the same faint dashed chalk-white outline: a plate place and a cup place in front of each woman, a plate place and a cup place at the front left, one in the middle of the cloth, and one at the right edge where a small steel tiffin box sits with its lid open. On some of the places: plates, identical cups, grilled corn cobs in paper sleeves, a paper cone of golden cassava chips, two green coconuts with straws, a jug of pale lemon drink, a blue bucket of shells. A woven basket sits at the front left. The moment: a small orange-red crab has climbed out of the basket and is holding the very last chip in one claw, scuttling sideways off the cloth. Soft contact shadows on everything.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (cotton cloth, steel tiffin, glossy corn, rough coconut husk), no outlines on objects, no photorealism. Modest dress; no religious symbols.

At phone size it must read clearly: each item and each marked place on the cloth must be separate and tappable, all the place outlines must look exactly alike, both faces must stay clear and expressive, and the crab with its chip must read as a joke.

Absolutely no text, letters or numbers anywhere in the image.

Attach: https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt beach-boat-5: Litter fishing on the boat day

The cutaway under the boat, at the moment a shoe comes up on the hook with a crab in it. It shows the tap-to-hook, the many things in the water, and the reveal, laid out for a phone (waterline at 40%).

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: a side-on cutaway of a calm, clear bay, like a cross-section. The waterline runs straight across at 40 percent of the frame height from the top. Above it, at the left, only the rail of a small painted wooden boat shows along the waterline, cropped by the frame edge; at the rail, cut at the chest and standing in one row with their faces at the same height and clear of each other: a grandmother (match the attached grandmother sheet: cream kameez, red dupatta) in a life jacket, laughing with one hand on her head where her sun hat was; a woman in a teal headscarf and long-sleeved tunic in a life jacket, pointing down into the water; and a small girl in a long-sleeved top and a life jacket holding a short fishing rod. The sky to the right of them is clear and empty (a speech bubble will go there). Below the waterline: clear green water down to a sandy seabed, and six everyday things in two loose rows with clear space between them, all sitting still or bobbing gently in place: a glass bottle, a can, a plastic bag, a sock, a ball, and a wide straw sun hat half sunk on the sand. Three small friendly fish swim among them. The moment: the fishing line runs straight down from the rod to an old shoe that is rising through a trail of bubbles, and a tiny orange-red crab is peeking out of the shoe. Soft light rays through the water.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (wet painted wood, glass, cotton, clear water with gentle caustics), no outlines, no photorealism, nothing scary or dirty-looking; the things look like lost everyday objects, not grime. Modest dress; no swimwear.

At phone size it must read clearly: every thing under the water must be recognisable and separate, the line from the rod to the shoe must be obvious, and the three faces at the rail must stay clear.

Absolutely no text, letters or numbers anywhere in the image, including on the bottle, the can and the boat.

Attach: https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/m1-farm-mid-fields-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
```

---

## 12. Changes after the critique

The critique (`beach-boat-critique.md`, 1 Nov) had 21 findings: 8 MUST, 13 SHOULD. Every MUST is applied. Every SHOULD is applied, one of them (12) in part, with the reason given. Where the critique and Zafar's recorded word clashed (13, the visit order), Zafar's word won.

| # | Finding | What I did |
|---|---|---|
| 1 | MUST: the picnic read "every spot outlined" as the leak, when it is Zafar's fix | Every spot on the cloth (plate and cup places, the middle, Ali's box) now has the same outline, every time (§3.4, §7, prompt 4). Recorded as a reversed decision (26). |
| 2 | MUST: the cobs and the straws "stop by themselves" | Counts pick a group: cobs in tied bundles of one, two and three; straws in cups of one, two and three (§3.3a, §3.3c). The leak test's deciding list now includes the count, so L2's two words a move holds. |
| 3 | MUST: "fill it" was tap-until-full; no sandcastle bot number | No cap: full is four or five spadefuls, and a sixth overflows and slumps back (§3.2). Bot numbers written: about 12% at L1 (stated as the L1 allowance, like fishing's), under 1% from L2. |
| 4 | MUST: in fishing the asked thing was the one that stayed still | The bay is a closed pool: nothing drifts in or out of view, everything bobs alike, and a newcomer sinks in at random after each catch and is never the next answer more often than chance (§3.6). |
| 5 | MUST: the corn toppings and the chips' salt had no closing move | Named: tap the paper sleeve to close the corn, tap the cone to hand the chips to Masi; tapped early, either gets the line again, not a verdict. A wrong topping puffs off; a third shake of salt heaps and is shaken off (§3.3a-b, §4). |
| 6 | MUST: the size and order of work were wrong | Shells are built on the shared kit with Cook's count (decision 27); the picnic waits for put it in its place's rebuild, shared with pick it up (28). Art recounted at 120-150 sprites, five backgrounds, a three-layer road, five character sheets; the game is medium-large. The order of work is in §6. |
| 7 | MUST: the phone layouts didn't add up at 915x275 | Every scene worked in pixels for the 715x275 play area (§7): the fishing waterline at 40% with the boat cropped to its rail and the bubble beside the faces; one row of faces at the stalls, with Nani and Masi out and the asker in a corner round; stacks capped at two high on every screen; the shells' L2 field is four piles, nine shells at most. |
| 8 | MUST: "with / without / no X" had no Kutchi; "careful, it's hot" was glued; the order lines were called recorded | The frames table now marks each as a gap (§1): *waari* and *wagar* are in engine but unrecorded, and "no chilli" isn't built from *laal na*; "careful, it's hot" is to record whole; *muke … khape* is a TTS placeholder in Cook. All go on Mum's sheet B. The corn stall and the salt don't teach until they land (decision 29). |
| 9 | SHOULD: the boat's speaking turn started at rung 4, and the ride has no Kutchi | Rung 1 on the first ride: Nani says *jaldi!*, the child repeats; the two-picture choice waits for rung 4. The ride gaining Nani's speed lines is listed as a shared-engine change for his yes (§3.5, §6, question D). The set of two cites the eye test's *haa / na*. |
| 10 | SHOULD: the stall picker dropped the map's queue fix | From L2 the queue orders too, voiced by a family member, which rotates who wants what (§3.3). |
| 11 | SHOULD: Zafar's bag list, lemon drink for Ali and two-step line were changed | Restored: his 19 Oct bag list with the kite hopping in (decision 32); Ali's lemon drink goes home in his tiffin box (15); "first the big, and then the small" comes at L2 (33). |
| 12 | SHOULD: the purse prop and the stall-3 hearing were muddled | Applied in part. The purse is now a real handover: Masi holds it open at stalls one and two and puts it in the child's hands only at three. A wrong hearing makes the stallholder look round his cart, shrug kindly and replay Masi's model. **Not applied:** Masi paying at stalls one and two. Pay is the stalls' only number practice; cutting the child's pay to once a round would cut the heard prices from three to one. Masi pays once, the very first time, as the watch step. |
| 13 | SHOULD: the first visit was not tiny | The beach's first play is shells and the sandcastle; the stalls join on the second play, the picnic on the third (§2, §4). **Clash with Zafar:** the critique moved the boat to the third visit; he placed it as the beach's second visit (1 Nov), so it stays second and opens after the first play. |
| 14 | SHOULD: the recorded-word claims were generous and inconsistent | One table of deciding words from the inventory: 18 of 40 recorded for visit 1, 2 of 14 for visit 2 (§1). Numbers, *mathe*, *wadho*, *nair* and *khape* are marked "in lines"; *chips* needs a retake. Mum's sheets A and B are drawn from it. |
| 15 | SHOULD: pay had stacks of one to four but prices to five, and two pay designs | Stacks of one to five. One pay design: the stacks rule goes to Zafar as a numbered change to `count-to-a-number.md` (question E); the counter version is no longer "used as is" (§6). |
| 16 | SHOULD: the chips had nothing to decide at L1 | Both cones are always out; L1 asks for one of them; L2 adds the salt with its closing move (§3.3b). |
| 17 | SHOULD: the child's swipe drove the stallholder's knife | The child taps the coconut and the stallholder chops; the child's moves are the straw cup and the slurp (decision 30). |
| 18 | SHOULD: the windbreak added art for a reveal that can never differ | The default is Zafar's plain design; the windbreak is an option in §10 (decision 4, question F) with its art cost. Prompt 2 now shows the plain version. |
| 19 | SHOULD: onboarding details against the rulebook | One box per live thing (each big shell, each stall); the first crab is scripted by rule under an answering shell; "now" is the fry basket's handle, a thing, never a word button (§3, §4). |
| 20 | SHOULD: L4 collected extras | Each L4 is one look-alike (a middle size, half, the girl's hat); the pink shell, cup mould, yellow coconuts, coloured straws, change, the dolphin, the cap and the mug are parked under "Maybe later" (decision 31). |
| 21 | SHOULD: prompt faults | Prompt 2: same-colour buckets (and the plain version); prompt 1 and 4's bucket is blue, keeping red for *laal*; prompt 3: every stall in full colour, no thumbs-up, one row of faces; prompts 4 and 5 attach Nani's locked sheet (`sources/art/s08/sheet-nani-final-1.png`) instead of the Cook sheet, and prompt 3 no longer attaches it; prompt 5 has the waterline at 40% with the boat cropped to its rail; prompt 4 shows the identical outlines. |
