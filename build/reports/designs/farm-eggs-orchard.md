# The farm: collect the eggs, the corn stall, and the orchard and vegetable patch

Designed overnight, 1 Nov 2026, while Zafar slept, and revised the same night after an independent critique (`farm-eggs-orchard-critique.md`, 7 MUST, 10 SHOULD); §12 lists each finding and what changed. Every choice he hasn't made is in §10, with the answer I assumed, so he can reverse it. Nothing here is built. The Kutchi below is only what the repo holds (`data/lang/lexicon.json`, the word inventory of 31 Oct); everything else is English, marked "to record". No Kutchi sentence in this file is mine: frames are given in English, to be built by the language engine from recorded parts, and §1's frame table says which parts exist.

This design shares its day with `farm-animals.md` (feed, the photo shoot, animals home). The two now use **one count rule (counts tick at the number), one cast of hens and chicks, one asker rule and one art plan** (decisions 2, 18 and 24, settled by Zafar's answers of 1 Nov). Where `farm-animals.md` still says otherwise (its old hen sprites), §10 flags the change for its owner; I edit no other file.

## 0. One line

- **What:** three games for Hannah Mami's farm, cut to what the map calls small.
  - **A. Collect the eggs:** tap the hen Nani names, she hops off her nest, take the eggs Nani asks for into the basket. A chick hides under one hen every round.
  - **B. The corn stall:** the plain sekelo reskin. Grill the cobs, then dress each as ordered and add the chutney asked for, for one customer at a time, as Cook does today.
  - **C. The orchard and vegetable patch:** one scene, one camera, two stages. **C1 Pick:** pick what's asked, N of each, into the basket. **C2 Plant and water:** plant the sapling named in the gap, water it, and watch it grow in place.
- **Day:** the farm. A and B are on the first visit (stages 6 and 8 of `farm.md`). C is the second visit. "What you plant, you pick next time" and "the corn you picked goes to the stall" are later rows (§5).
- **Status:** A designed (`farm.md`: "count-to-a-number + openables"), now detailed. B designed as a sekelo reskin, now detailed and kept plain. C new (Zafar's scope, 31 Oct: "plant fruit and vegetable trees; pick N of each into a basket").
- **Engines:**
  - A: count-to-a-number (Cook's count, generalised) on the shared **openable** that `hide-and-seek.md` defines (the hen is an openable; no new "lift" piece).
  - B: Cook's sekelo station (`js/cook/stations/mishkaki-grill.js`), its threading phase swapped for Cook's add (dress, then chutney).
  - C1: count-to-a-number.
  - C2: Tidy's tap-then-tap place, Cook's pour, and a grow from real art frames, all in C1's scene.
- **Rough size:** A small (one scene, the openable reused, the farm's hens). B small (a reskin: one worktop background and new item art). C small to medium (one scene, plants in states, saplings). Three art blocks after a grey-box lab (§7).

## 1. The language goal

**Word groups:** food (fruit and vegetables, eggs, the corn's dressings and chutneys); farm animals (hen, chick); plants (tree, sapling, plant); numbers 1-4; describing words (big and small, colours, ripe as colour); "under"; quantities (a little, a whole can, all).

**What each game teaches that the others don't:**
- **A** carries the farm-animal half: hen, chick, "under", big and small, and the colour of a hen. Numbers ride along from L2.
- **B** carries cooking words on a trip: the dressings, the chutneys, "no" asks, "a little" and "lots".
- **C** is the only plants game. It carries the fruit and vegetables, "pick", "plant", "water", "grow", ripe-as-colour ("the red ones"), and how much water.

**The words.** ✓ = a family clip of the word alone. "Heard in lines" = the Kutchi is in the repo and is heard inside longer recorded lines, with no clip of its own. "In engine" = the Kutchi is in the repo, with no recording. "To record" = no Kutchi in the repo.

| English | Kutchi in the repo | Status | Used in |
|---|---|---|---|
| egg | *indo* / *mayai* | ✓ both recorded alone; **Zafar, to confirm: *indo*, for now** (1 Nov; Mum to say which one for a child) | A, home |
| chicken, hen | *murgi* | in engine, confirmed as food ("chicken"); **Zafar, to confirm: *murgi* for the hen** (1 Nov; Mum to say whether it is the live hen) | A |
| chick | – | to record | A (the joke, every round) |
| under | *niche* | heard in 1 line | A frame |
| big | *wadho* | heard in 30 lines (the he-form; the she-form for a hen is Mum's) | A L1, C1 L4 |
| small | *nindho* | ✓ (the she-form for a hen is Mum's) | A L1, C1 L4 |
| red | *laal* | ✓ (whether it is said of a hen is Mum's) | A L2, C1 L3 |
| green | *lilo* | in engine | C1 L3 |
| white | – | to record | A L2 |
| brown | – | to record | A L4 (eggs) |
| yellow | – | to record | C1 L3 (mangoes) |
| one, two, three, four | *hakro*, *ba*, *trae*, *char* | heard in lines (one, three, four); in engine (two). None has its own clip. | A, B, C from L2 |
| how many? | *kitla* | ✓ | A L3 |
| all of these | *hi mare* | recorded as a whole line | A L3 |
| more | *wadhare* | in engine (draft) | C2 L3 (Nani's reaction only) |
| a little | *thorok* | ✓ (draft) | B L4, C2 L3 |
| whole, full | *aako* | ✓ | C2 L3 ("a whole can") |
| enough | *bas* | ✓ | C2 L3 |
| bring | *khanech* | in engine (confirmed in the grammar notes; *wadho cup khanech* "bring the big cup" is a confirmed line) | A frames |
| want | *khape* (with *muke*) | ✓ in confirmed lines (*muke khun nati khape*, "I don't want sugar") | B order frame |
| with | *sathe* | heard in a confirmed line (*wadhe chokre sathe*) | B order frame |
| and | *ne* | heard in confirmed lines | A L4, B, C1 L4 |
| mango | *ambo* / *aamo* | heard in 38 lines | C1 L1, C2 L3 |
| lemon | *limu* | ✓ | B L1, C1 L1, C2 L1 |
| tomato | *tameto* | ✓ | C1 L2, C2 L1 |
| chilli | *mirchi* | ✓ | C1 L3, C2 L2 |
| corn on the cob | *makai* | ✓ | B |
| green beans | *phali* | in engine (draft) | C1 L4, C2 L4 (the look-alike) |
| "the big mangoes or the small ones?" | *wadha ke nindha amba* | in engine, whole line | C1 L4 |
| water | *paani* | heard in 3 lines | C2 |
| mint, tamarind, coconut chutney | *fudino ji chutney*, *amli ji chutney*, *nair ji chutney* | ✓ all three | B |
| red chilli powder | *laal marcha* | in engine (draft) | B L1 |
| salt, black pepper, garlic | *loon*, *mari*, *lasan* | in engine (draft) | B L2+ |
| garlic powder | – | to record (Mum: *lasan* plus a word for powder?) | B L4 |
| no | *na* | ✓ | B L2 ("no" asks) |
| turn it | *firai* | ✓ | B (the grill) |
| take it out | *kadhi chad* | ✓ whole line | B (the grill) |
| it's ready | *tayar ai* | ✓ whole line | B |
| put it in | *wiji chad* | ✓ whole line | A, C1 (the guide box: "put it in the basket") |
| look | *nar* | heard in 11 lines | A (the guide box) |
| well done | *shabash* | ✓ | all |
| yes | *ha* | ✓ | all |
| lots | – | to record | B L4 |
| tree, sapling, plant (noun) | – | to record | C2 |
| pick, plant (verb), grow, water (verb) | – | to record (all forms) | C |
| sprinkle, squeeze | – | to record | B (the guide box only) |
| basket, nest, straw | – | to record later; not deciding | Nani's lines only |

**Verbs:** look (under), bring, put in, pick, plant, water, grow, turn, take out. The deciding words are nouns and describing words (which hen, which plant, which dressing), numbers and amounts; the verbs are heard in every ask and the guide box.

**The frame table.** Non-negotiable 2 asks for the gap frame by frame. Nothing below is buildable today from confirmed parts alone: every frame needs at least one form Mum hasn't given. So each frame is recorded whole by Mum, once per slot word that isn't yet recorded alone (the engine cuts the slot from her own takes and swaps only words she has recorded alone, as `farm-animals.md` §1 does). **Takes** counts what she records.

| # | Heard frame (English) | Where | What the repo has | What the engine can't build today | Takes |
|---|---|---|---|---|---|
| A1 | "Bring me an egg from under the {big / small} hen." | A L1 | bring *khanech*; under *niche* (1 line); egg *indo* ✓; small *nindho* ✓; big *wadho* (lines) | the she-forms of big and small with hen; the "from under" form; *murgi* as a live hen | 2 (big, small) |
| A2 | "Bring me an egg from under the {red / white} hen." | A L2 | red *laal* ✓ | white; red said of a hen | 2 |
| A3 | "Bring me {two / three / four} eggs from under the {X} hen." | A L2-L4 | the numbers inside lines | the plural egg after a number | 3 (one per number) |
| A4 | "the red one", "the small one" (the noun dropped) | A L3 | – | the she-form "one" | 2 |
| A5 | "How many eggs has the small hen got? Bring them all." | A L3 | *kitla* ✓; *hi mare* ✓ (whole line) | "has got"; "them all" | 1 |
| A6 | "Two brown eggs from the big hen." "Two from the red hen and one from the small hen." | A L4 | *ne* "and" (lines) | brown; two counts in one line | 2 |
| A7 | "Oh, a chick!" | A, every round | – | chick | 1 |
| B1 | "I want {one / two} corn with {lemon / chilli powder / salt / pepper / garlic powder} and {mint / tamarind / coconut} chutney." | B L1-L4 | *muke … khape* ✓ (lines); *sathe* "with" (line); *ne* (lines); *makai* ✓; *limu* ✓; the chutneys ✓ | the order with corn and a dressing slot; corn after a number | 5 (one per dressing; the chutneys swap in from their own clips) |
| B2 | "No chilli." "No salt." | B L2 | *na* ✓; the pattern in *muke khun nati khape* ✓ | the dressing in that pattern | 2 |
| B3 | "Make it spicy." "With a squeeze of lemon." | B L3 | – | both | 2 |
| B4 | "A little chilli." "Lots of chilli." | B L4 | *thorok* ✓ | lots | 2 |
| C1a | "Pick {a / two / three} {mango / lemon / tomato / chilli / green bean}." | C1 L1-L4 | the fruit nouns (✓ or lines); numbers in lines | pick; the plural nouns after a number | 5 (one per kind, singular) + 4 (plurals) |
| C1b | "The red ones." "Two green chillies." | C1 L3 | red ✓, green (engine) | "the ones"; yellow | 2 |
| C1c | "Two mangoes and one lemon." | C1 L4 | *ne* (lines) | two kinds in one line | 1 |
| C2a | "Plant the {lemon / tomato / chilli / mango / green bean}." "Plant two tomatoes." | C2 L1-L4 | the nouns | plant (verb); sapling | 5 + 1 |
| C2b | "Give it a little water." "Give it a whole can." | C2 L3 | *thorok* ✓, *aako* ✓, *paani* (lines) | water as a verb or "give it water" | 2 |
| C2c | "More." "Enough." "Look, it's growing!" | C2 (reactions) | *wadhare* (draft), *bas* ✓ | grow | 2 (confirm *wadhare*; the growing line) |
| G | the guide-box lines (§4) | all | *wiji chad* ✓, *firai* ✓, *kadhi chad* ✓, *bas* ✓ | "look under the hen", "put it on", "sprinkle it", "squeeze it", "put the chutney on", "give it to them", "pick them", "plant it", "water it" | 9 |
| W | words alone for the cards and the slots | all | – | hen (as the live hen), chick, white, brown, big, one, two, three, four, chilli powder, salt, pepper, garlic powder, lots, mango, green, yellow, green beans, sapling, tree | 20 |

**Totals:** about **75 takes** across the three games, not the "about 25 clips" first written. The first sitting covers only **visit 1 at L1-L2** (A1-A3, A7, B1 with lemon, chilli powder and salt, B2, the A and B guide lines, and the words those need): about **25 takes**. With `farm-animals.md`'s first sitting (about 21), the farm's first visit needs about 46 takes before it teaches at L1-L2. C's takes (about 30) go on a later sheet, with the second visit. L3-L4 open as later sittings land.

**New words per level** (each heard at least 3 times a round):
- A: L1 egg ✓, hen, big and small (3). L2 red, white, one and two (4). L3 "how many", "all", three (3; the chick row adds chick). L4 brown, four (2).
- B: L1 lemon, chilli powder, mint chutney, tamarind chutney (4; corn comes back from feed; the chutney names count as words). L2 salt, coconut chutney, "no" (3). L3 pepper, the customer's phrasings (2). L4 "a little", "lots", garlic powder (3).
- C1: L1 mango, lemon (2). L2 tomato, the numbers (2). L3 chilli, red, green (3; yellow when recorded). L4 green beans, big and small mangoes (2).
- C2: L1 plant, lemon and tomato as saplings (2). L2 chilli (1). L3 mango, "a little water", "a whole can" (3). L4 green beans (1).

**Mum first** (the deciding words, before these games teach): is *murgi* the live hen; the she-forms of big and small with hen; whether *laal* is said of a hen; white; chick; the numbers 1-4 alone; chilli powder and salt confirmed; the A1-A3 and B1-B2 frames. Until then a reader wins on the grey English (lessons §1), so each game counts as teaching only once its deciding words are in (decision 22).

## 2. Where it sits in its day

**First visit** (`farm.md`'s list): door, bag, ride, meet Hannah Mami, feed the animals, **collect the eggs (A)**, Snap, **the corn stall (B)**, animals home, home, the book.
- **Into A:** the hens were just fed (stage 5): the same mother hen and her three chicks, and the two other hens. They settle on their nests. Nani: let's see if they've laid, for Hannah Mami.
- **Out of A:** the eggs go into Hannah Mami's crate. One goes in the child's hand "for Ali" (the home stage). The rest go to the pantry for the next kitchen day (the eggs station). The hiding chick runs back out to its two sisters in the yard; at dusk all three follow their mother into the coop (`farm-animals.md`'s home). Snap's "the chick with its mother" is a second-visit row (`farm-animals.md`), not visit 1's.
- **Into B:** after Snap, Hannah Mami's stall at the farm gate. Visitors want corn.
- **Out of B:** the last cob is the child's own ("aah"). Busy B is followed by the calm walk home with the animals (rhythm rule).

**Second visit (the orchard visit):** door, bag, ride, meet (short), **C1 pick**, animals home with positions, **C2 plant and water**, home, the book.
- **Into C1:** Nani needs fruit and vegetables for her kitchen.
- **C1 to C2:** the same patch. There are gaps in the front bed, and the saplings wait in their pots.
- **Out of C2:** each sapling grows into its plant in place, in the row the child picked from (the delight). The evening book shows them.
- **Out of C:** the basket goes to the pantry. Mangoes and tomatoes turn up in the next kitchen day (the chaat, the daar).

No two of the same engine back to back: A (count on openables) follows feed (place); C1 (count) and C2 (place and pour) are split by animals home.

## 3. The games

### Shared rules for all three

- **Who speaks** (decision 18): **Nani says every line,** in Mum's takes where they exist and the device voice for the rest in the prototype. In A and C she stands at the right and asks from a bubble at her face; in B she is off screen and her grill lines are in the guide box (guide-and-card R3), as in Cook. Hannah Mami is silent for now (Zafar, 1 Nov: Nani or another placeholder for her lines and look), as in `farm-animals.md` decision 13; she isn't in the hen house or the patch in the first build. The guide box says only the step now (R2), without a face (R4).
- **How a count closes** (decision 2; Zafar, 1 Nov, reversed after his chai play; one rule for every game): a count ticks the moment the right number is reached, and an extra tap doesn't land; an amount ticks when it is poured (half at half, full at full). No stillness timer. The real moves stay as moves of their own, not as what closes a count: in A and C1 the child hands the basket to Nani (a tap on her; she tips it into the crate (A) or lifts it onto her hip (C1)), in B Cook's serve, in C2 picking up the can. A basket that hasn't reached its number can't be handed over, and an empty basket can't either. This restores `easy-to-play.md` rule 4.
- **The kind is judged once, at the hand-over (the fishing fix):** the count ticks at the number as the eggs or fruit land, but nothing is judged egg by egg for its kind. An egg from any hen and a fruit from any plant lands in the basket until the number is reached, and at the hand-over the whole basket is judged once for kind:
  - **Right the first time:** the row ticks **gold**, each word in it moves one step on its ladder, and only this counts as a win for the leak bot.
  - **Wrong** (the wrong hen or plant, or the wrong colour): a funny consequence takes out what's wrong (the hen hops over and nudges her egg home; the goat munches the wrong fruit), the count falls back below its number, and Nani says the ask again. **The right items stay in the basket** (nothing undoes a child's right work, non-negotiable 7). The child fixes it and the count ticks again. The row then ticks **plain**, moves no word's ladder, and **the round doesn't count towards moving up** (Zafar, 1 Nov: level up only on right-first-time rounds), so a fished row can't climb a level. There is no too-many or too-few miss: the count ticks at the number.
- **Take-backs:** tap an item in the basket to put it back, until the close.
- **The count sits on the basket** as the shared tally (dots, never digits). The card writes the whole ask in Kutchi, count included, as a word, and fades it by the word ladder.
- **Hints** after 7, 9, 11 and 13 s from the last action: Nani says the ask again (free). The helper card with the full answer costs a bulb.
- **No timers** in A and C. B keeps the grill's turn timing (a skill row, not language), and its first turn holds in the green.
- **The first round is the tutorial,** unscored, one lit box at a time (§4).

### 3A. Collect the eggs

**Scene:** inside the hen house, eye level (camera E). A low plank shelf runs across the middle with straw nests drawn in **F view** (about 10° down, as `farm-animals.md` draws its troughs), so the eggs in an open nest lie in plain sight and can be counted. A hen sits on each nest. Nani stands at the right, chest up, beside Hannah Mami's wooden egg crate. The child's basket sits at the bottom left of the play area. The open door behind shows the sunny yard, where two chicks peck.

**The hen is the shared openable** (`hide-and-seek.md` §6): closed is the hen sitting on her nest; open is the hen hopped down to the floor beside her nest, on the side away from the basket, clucking; the content layer is her eggs and, sometimes, the chick. What the openable needs for the hen (taking from the content layer, holding open while the ask is open) is a row for the shared-layer owner (§6).

**The five questions:**
1. **What do you do?** Tap a hen: she flaps and hops down off the shelf beside her nest, and her eggs lie in the open. She stays down while the ask is open; tap her again, or tap another hen, and she hops back up (one hen down at a time). Tap an egg: it hops into the basket. Tap an egg in the basket to put it back. Hand the basket to Nani (tap her) and it is judged.
2. **Does the Kutchi decide?** Yes. **Which hen** (big or small at L1; colour from L2), and from L2 **how many**. Every hen has eggs, always more than asked, so the picture never settles it.
3. **The fun:** the hop-down is a toy (the flap, the cluck, a feather drifting). **The chick:** under one random hen each round sits a fluffy chick. When that hen hops down, it tumbles out of the nest cheeping, hops onto her back and rides her back up at the close. Nani laughs: "Oh, a chick!" Children will open every hen to find it, and that's allowed.
4. **The instruction:** Nani, three-quarter to the hens, then front-on to the child for the ask. Her card shows the hen and the egg while they're supported.
5. **What's novel:** the only game where a creature hides the thing you count. It's the day's joke, and it repeats each visit so the child waits for it.

**Scores:** do 4, Kutchi 4, fun 5, instruction 4, novel 4.

**Peeking is free.** Opening a hen costs nothing and isn't a pick. Only the basket is judged. Every hen has eggs, so a peek tells nothing.

**The cast** (decision 24, shared with `farm-animals.md`): three hens and three chicks. **The mother hen** (big, red-brown; her three chicks follow her), **the small white hen** and **the big white hen**. A uses two at L1 and all three from L2. One chick hides under a hen each round; the other two peck in the yard.

**Level ladder.** The repeating thing is **eggs per ask**, most 4 at L4, so by the rule the most per ask is 1, 2, 3 and 4; each ask draws a count from 1 up to that, so the number decides. Asks per round are 3, 3, 4 and 4 (the rulebook doesn't number them; set by the leak budget). **The one override:** L3 keeps three hens (2 decoys, not 3), because the only fourth hen would be a third size (a weak contrast, never asked) or a colour Mum hasn't given; the phrasings and the count carry L3.
- **L1:** the mother hen and the small white hen (big and small: the clearly different decoy). One egg per ask. Nani counts aloud. Words: egg ✓, hen, big, small ✓.
- **L2:** adds **numbers** (1-2) and the big white hen. Each hen is asked by the words that pick her out alone, generated by `whichone` from her size and colour: "the red hen", "the small hen", "the big white hen". Each hen has 3-4 eggs. The card's English is dotted. No "no" asks (decision 6).
- **L3:** **other ways of saying it.** The same three hens. Asks drop the noun ("the red one"), or ask "how many eggs has the small hen got? Bring them all" (2-3 eggs). Counts to 3. The card's picture is blurred. **The chick row:** once a round, after the scored asks, Nani asks for an egg "from under the hen with the chick". Opening hens finds her, so it's the round's joke row: it always ticks plain, moves no ladder, and is never a leak-bot win.
- **L4:** **amounts and a look-alike.** Brown and white eggs lie under the same hen, so the egg's colour decides too ("two brown eggs from the big hen"; three hens × two egg colours, five decoys, the look-alike being the same egg in the other colour). Two counts in one ask ("two from the red hen and one from the small hen"). Counts to 4. Each nest holds 5-6 eggs.

**The leak test:**

| Way to win without Kutchi | Can it win? | Why not, and the fix |
|---|---|---|
| **Reading** | Only on English placeholders. | The card shows Kutchi, and its English is dotted from L2. Until Mum records hen, chick and white, a reader wins: it counts as teaching only once they're in (decision 22). |
| **Matching** | Only while supported. | The card's hen picture is support: it shows until the word is picked right three times in a row (first time right), then speaker only. From L3 the picture blurs. The hens carry no labels past support. |
| **Fishing** | No. | Nothing is judged egg by egg for its kind: a wrong hen's egg lands like any other until the number ticks. The basket is judged once for kind, at the hand-over. Only a first hand-over right ticks gold and moves a ladder; a redo ticks plain, the round doesn't count towards moving up, and it is never a bot win. By Zafar's choice (1 Nov), a count or an amount can be won by tapping or holding until it ticks; which hen, which plant, which colour and which sapling still decide wherever two words decide a move. |
| **Eliminating** | No. | Every hen keeps more eggs than asked after each ask, so the same hen can be asked again. Nothing ends by itself. |
| **Patterns** | No. | The hens shuffle along the shelf each round. The asked hen, the counts and the chick's hen are random. The chick is under a set hen only in the first-ever round. |
| **Waiting** | No. | No glow on the answer after the tutorial. The hint repeats the ask and points at the card, never at a hen. An empty basket can't be handed over, and nothing closes by waiting. |

**Blind odds** (changed 1 Nov: the count no longer decides, because the bot taps until it ticks; first hand-over right; the bot's win is a round that counts towards moving up, which is now a right-first-time round; `whichone`'s calculator checks them in data): L1: hen 1 in 2 per ask, three asks: a level-up round 12.5%: accepted as the guided level, with the words supported (decision 23); the bot judges from L2. **L2:** hen 1 in 3 per ask; a level-up round about **3.7%**. L3 and L4 lower. (With the count it was 1 in 6 per ask, about 0.5%.)

**Miss reactions at the hand-over** (different each time, never a frown): the wrong hen hops over, clucks and nudges her egg home with her beak. Idle, not a verdict: a hen ruffles up and plops back down with a puff of straw.

**The delight moment:** the chick (above), every round, under a different hen.

**Speaking:** none. The farm's speaking turn is the call at dusk (`farm-animals.md`).

### 3B. The corn stall (the plain sekelo reskin)

**Scene:** one scene, the stall's worktop from exactly overhead (camera T): Cook's sekelo screen on a new pale-oak stall worktop background. The grill tray (`sheet-tray-grill-t-v2` if it suits), raw cobs in a crate, the dressings in small steel shaker bowls along the bottom, lemon halves, three chutney bowls and a steel plate on the right. The customer orders and is served as Cook's stations do today (the shared customer cast, the order card with the customer's face). No stall-front scene, no zoom, no waiting crowd.

**Steps** (one job at a time):
1. **Order:** the customer orders in Cook's order frame; each card pops and flies into its row.
2. **Grill:** sekelo's grill phase as it is. Tap a cob to put it on. Tap to turn it while the heat ring is green (*firai* ✓). Tap to lift it onto the plate when it's golden (*kadhi chad* ✓). Charred is funny, never wrong for language: it's the hand-skill row.
3. **Dress** (Cook's add, in place of threading): tap the shaker asked for, and one shake sprinkles over the cob on the plate. Tap a lemon half to squeeze it (a squish and drips).
4. **Chutney** (Cook's add): tap the bowl named, and a spoonful lands beside the cob.
5. **Serve:** Cook's serve. The customer bites, says "aah" and smiles.

**The five questions:**
1. **What do you do?** Tap to grill, turn and lift; tap a shaker or a lemon half; tap a bowl; serve.
2. **Does the Kutchi decide?** Yes: how many cobs, which dressing, "no" this one, how much, and which chutney. All the shakers and bowls are always out.
3. **The fun:** the kernels blister and pop on the grill, the lemon squish, and the customer's bite. If they asked for chilli, a happy "sss-aah" and a puff of breath.
4. **The instruction:** the customer orders in Cook's order frame. Nani's grill lines are in the guide box.
5. **What's novel:** little, by design (Zafar: "a skin of Cook, not a new game"). New only as cooking on a trip, and in its words.

**Scores:** do 4, Kutchi 4, fun 4, instruction 4, novel 2 (kept: Zafar asked for it, and it's cheap).

**Level ladder.** The repeating thing is **cobs per round**, most 4 at L4; by the rule 1, 2, 3 and 4. **The one override:** L2 has 3 cobs, not 2, for the leak budget (with two cobs a level-up round was about 21% blind; with three, about 3%; now that only right-first-time rounds move up, Zafar 1 Nov, about 0.1%). One customer at L1-L2; two from L3, one after the other (2 + 1 at L3, 2 + 2 at L4). Decoys by the rule: 1, 2, 3 and 4 (the dressings out: 2, 3, 4, 5).
- **L1:** one cob. Two dressings out (lemon ✓, chilli powder) and two chutneys (mint ✓, tamarind ✓). One of each asked. Everything shown.
- **L2:** three cobs for one customer; numbers ("two with lemon, one with chilli"); **"no" asks** said last ("no chilli", *na* ✓). Adds salt and the third chutney (coconut ✓). The card's English is dotted.
- **L3:** **other ways of saying it.** The customer's own phrasing ("make it spicy"; "with a squeeze of lemon"). Each cob in an order can differ. Adds pepper. The card's picture is blurred.
- **L4:** **amounts and a look-alike.** "A little chilli" (*thorok* ✓) is one shake, "lots" three. Garlic powder sits beside the salt (the look-alike: two pale powders). Four cobs.

**The leak test:**

| Way | Can it win? | Why not, and the fix |
|---|---|---|
| **Reading** | Only on placeholders. | Chilli powder, salt, pepper and garlic powder are drafts or to record. Until Mum confirms them, the dressing rows are a reading leak. The chutneys and lemon are ✓ already. |
| **Matching** | Only while supported. | The card's pictures fade by the word ladder and blur at L3. The shakers have no labels. |
| **Fishing** | No. | Cook's accuracy rule: the plate is judged at the serve, gold only if right the first time; the shake ticks at the amount and an extra shake doesn't land (Zafar, 1 Nov). A re-served plate ticks plain, and the round doesn't count towards moving up. |
| **Eliminating** | No. | Every shaker and bowl stays out. "No" items are said last. A customer may ask for what the last one had. |
| **Patterns** | No. | Orders are random. The shaker and bowl places are fixed per station (Cook's rule), but the order varies, so position never predicts. |
| **Waiting** | No. | No glow on the answer. The hint points at the card. |

**Blind odds:** L1: dressing 1 in 2 × chutney 1 in 2: a gold round 25%, the guided level (decision 23). L2: three cobs at 1 in 9 each: a level-up round (right first time) about **0.1%**; recounted 1 Nov without the number (the bot taps until it ticks): at worst 1 in 3 each, about 3.7%, which the lab bot confirms. L3 and L4 lower.

**Speaking:** none in the first build (decision 16). The chutney order on the shared "say it, X acts" moment is a later row, if Zafar wants a second speaking turn on the farm.

### 3C1. The orchard and vegetable patch: pick

**Scene:** a sunny kitchen garden at the farm, eye level (camera E). One row of two to five fruit trees and vegetable plants across the middle, kept low so every fruit is in reach. In front of them, a strip of dug soil with gaps (C2's). Behind, a low fence runs across and ends at the right, where the big basket stands against the end post; the goat's head can stretch over the fence just above it. Nani stands at the right edge.

**The five questions:**
1. **What do you do?** Tap a fruit or vegetable: it pops off with a wobble of leaves and bounces into the basket. Tap one in the basket to put it back. Hand the basket to Nani (tap her) and it is judged.
2. **Does the Kutchi decide?** Yes: **which** (the plant) from L1, **how many** from L2 (Zafar's two words per move), and **which ones** (the colour, the size) from L3. Every plant has more than asked, and several kinds grow side by side.
3. **The fun:** the pop and bounce, the leaves shaking, and the goat. **At a wrong close the goat helps:** he stretches over the fence and munches the wrong one out of the basket, happily. The child adds the right one, with a laugh instead of a verdict.
4. **The instruction:** Nani asks. Her card shows the fruit while it's supported.
5. **What's novel:** the only plants game, and picking is a satisfying verb. Ripe and unripe give colour words a natural reason.

**Scores:** do 5, Kutchi 4, fun 4, instruction 4, novel 4.

**Level ladder.** The repeating thing is **fruit per ask**, most 4 at L4: by the rule 1, 2, 3 and 4 (each ask draws from 1 up to that). Decoys by the rule (plants out: 2, 3, 4, 5). Asks per round 3, 3, 4, 4. No override.
- **L1:** two trees, mango and lemon ✓. One fruit per ask. Nani counts aloud.
- **L2:** adds **numbers** (1-2) and tomato ✓. "Pick two lemons." Each plant has at least two more than asked. English dotted.
- **L3:** **other ways of saying it,** by colour. Adds chilli ✓. Tomatoes grow red and green, mangoes yellow and green, chillies red and green. "Pick the red tomatoes", "two green chillies". Ripeness is asked as a colour until Mum gives "ripe" (decision 10). Counts to 3. The picture blurs.
- **L4:** **amounts and a look-alike.** Two kinds in one ask ("two mangoes and one lemon"). Sizes: "the big mangoes or the small ones?" (*wadha ke nindha amba*, in engine). The look-alike: green beans (*phali*, draft) beside the green chillies. Counts to 4.

**The leak test:**

| Way | Can it win? | Why not, and the fix |
|---|---|---|
| **Reading** | Only on placeholders. | Lemon, tomato and chilli are ✓; mango is heard in 38 lines and needs its own clip; numbers have no clip. Until then those rows are a reading leak. |
| **Matching** | Only while supported. | The card picture fades by the ladder and blurs at L3. No plant has a label past support. |
| **Fishing** | No. | Nothing is judged fruit by fruit for its kind; the goat only comes at the hand-over. The basket is judged once for kind; only a first hand-over right ticks gold; a redo ticks plain and the round doesn't count towards moving up. The count ticks at the number, so tapping until it ticks is allowed (Zafar, 1 Nov); the plant still decides. |
| **Eliminating** | No. | More on every plant than asked; the same plant can be asked twice; nothing ends by itself. |
| **Patterns** | No. | Plants shuffle along the row each round. Asks, counts and colours are random. |
| **Waiting** | No. | No glow on the answer. The hint repeats the ask. An empty basket never closes. |

**Blind odds:** L1: 1 in 2 per ask, three asks (the guided level). **L2** (changed 1 Nov, the count no longer decides): plant 1 in 3 per ask: a level-up round (right first time) about **3.7%**. L3: plant 1 in 4 × colour 1 in 2 per ask: about 0.2%. (Before: with the count, 0.5% at L2.)

**Miss reactions at the hand-over:** the goat's munch (built first, from `farm-animals.md`'s goat eat pose, cropped over the fence). The bird is a later row.

**The delight moment:** the goat munching, and the fruit's bounce into the basket.

**Speaking:** none.

### 3C2. The orchard and vegetable patch: plant and water

**Scene:** C1's patch, the same camera (E). The basket has gone to the pantry. Along the bottom edge stand two to five saplings in small clay pots, each with its own leaves and one small fruit so the kind can be seen (the item itself, never a label). The front strip has three gaps of dug soil (four at L4). The watering can stands at the right, where the basket was.

**Steps:**
1. Nani: "Plant the lemon." Tap the lemon sapling: it lifts out of its pot.
2. Tap a gap: it goes in, and the soil closes round it. Tap a planted sapling to take it back, until the planting closes.
3. Tap and hold the watering can: it tilts and pours over the new plant (Cook's pour). At the asked amount the pour stops itself and the amount ticks; holding on pours nothing more (Zafar, 1 Nov). **Picking up the can closes the planting** (a real move of its own, the step's next thing), and the kind of sapling and the gap are judged then.
4. **The grow:** when the watering ticks (the can's amount is reached: half ticks at half, a whole can when it is empty), the sapling shoots up in place into its fruiting plant, in about three seconds: a cross-fade through real art frames (sapling, small plant, the patch's own fruiting plant), with a soft rustle and a pop. No sparkles. The row ticks.

**The five questions:**
1. **What do you do?** Tap the sapling, tap the gap, hold the can.
2. **Does the Kutchi decide?** Yes: which sapling from L1 and how many from L2 (the count ticks at the number, so by Zafar's choice (1 Nov) the number can be won by tapping until it ticks; the sapling still decides). The water at L3 ticks at the asked amount too, so the water word is heard and followed but no longer decides. It's the weakest of the four for language at every level, by design: it's the calm stage.
3. **The fun:** the grow. The thing you planted becomes a fruiting plant in the row you picked from.
4. **The instruction:** Nani's ask and card, as in C1.
5. **What's novel:** making something grow, in place.

**Scores:** do 4, Kutchi 3, fun 5, instruction 4, novel 4.

**Level ladder.** The repeating thing is **saplings per ask**, most 3 at L4 (one tomato and two chillies): by the rule 1, 2, 2 and 3. Decoys by the rule (saplings out: 2, 3, 4, 5). Asks per round 3 at every level. No override.
- **L1:** lemon ✓ and tomato ✓ saplings, one per ask, any amount of water. Words: plant, the two saplings.
- **L2:** adds chilli ✓ and **numbers** ("plant two tomatoes": two gaps).
- **L3:** adds the mango sapling and **how much water**: "give it a little water" (*thorok* ✓) or "give it a whole can" (*aako* ✓). The pour ticks at the amount (Zafar, 1 Nov): the thresholds live in data (below), and the word sets the target the pour stops at. The pour has no fill line (baking's rule).
- **L4:** adds a **look-alike** (green beans beside chilli) and two kinds in one ask ("one tomato and two chillies").

**The water at L3, in data** (`data/` level file for the patch; the lab tunes the numbers with a three-year-old's hold):
- `canSeconds: 3.0`: a whole can pours for 3 s, then is empty; the "whole can" amount ticks there (a can running dry is the world, and it also ticks the amount).
- `littleAt: 0.8`: "a little" is a total pour of about 0.8 s, in one hold or two; the amount ticks there and the pour stops (the lab tunes it with a three-year-old's hold).
- A whole can needs no second threshold: it ticks when the can is empty.
- **Too little** is just not yet ticked: the sapling stays small and droops, and the child pours again (a hold released early is topped up as often as they like). There is no "too much" now: the pour stops at the amount and the sapling never floods. The row ticks gold if the sapling and the gap were right first time.
- The water asks are heard and followed; the pour stops itself at the asked amount, so no "too much" miss exists.
- Holding the can until it's empty now ticks the amount for the child on any ask (by Zafar's choice, 1 Nov); the sapling and the count carry the language.

**The leak test:**

| Way | Can it win? | Why not, and the fix |
|---|---|---|
| **Reading** | Only on placeholders. | Plant, sapling and water (verb) are to record. |
| **Matching** | Only while supported. | The sapling's fruit is the item itself, not a label. The card's picture fades and blurs. |
| **Fishing** | No. | The planting is judged once, when the can is picked up; the water once, at its close. Only a first close right ticks gold. |
| **Eliminating** | No. | Every sapling stays; there are more gaps than asked. |
| **Patterns** | No. | Saplings shuffle; asks and amounts are random. |
| **Waiting** | No. | No glow on the answer. The pour stops itself at the asked amount, so holding the can wins the water by Zafar's choice (1 Nov); the sapling and the count still decide. |

**Blind odds** (changed 1 Nov: neither the count nor the water decides, because the bot taps and holds until they tick): L1: 1 in 2 per ask, three asks (the guided level). **L2:** sapling 1 in 3 per ask: a level-up round (right first time) about **3.7%**. L3: sapling 1 in 4 per ask: about 1.6%. (Before: 0.5% at L2 and about 1% at L3.)

**The delight moment:** the grow, every planting.

**Speaking:** none.

### Considered and parked

- **Seed packets in a top-down planting bed** (the first draft): Zafar's alternative to saplings (decision 8). Its cost: a fifth background, a second camera (T), and every plant drawn again in T (seed, sprout, small plant, fruiting plant), plus a carry from T plants to E plants.
- **The stall front** with a crowd of visitors and a zoom to the grill, and **the chutney speaking turn**: later rows (§5).
- **Plant now, pick next time:** a later row; it needs saved state between days (§5).
- **Shake the tree** to make fruit fall: chance decides what falls. Kept only as an idle toy (the leaves shake and the fruit wobbles; nothing drops).
- **Count the eggs into an egg box:** a box with exactly N cups leaks the number.
- **Feed the chick:** that's the feed stage's job.
- **Pull up the roots** (onion ✓, potato, carrot): a good second gesture, held for a later orchard visit, so one action is new at a time.

## 4. The first rounds

Every first round is the tutorial and unscored. One lit box at a time with a breathing gold glow; everything else dimmed and untappable; no finger. Each starts by showing **what isn't on the card**. The guide box says the step now from the moment it opens, never empty (R2); its lines are in §1's frame table (G), grey "to record" until Mum records them.

### Collect the eggs (first farm visit)

1. **Arrive.** The hen house fades in from the yard (no jumps after the first frame). Two hens doze on their nests: the mother hen and the small white hen. Nani stands at the right beside the crate. Everything is dimmed but her.
2. **What isn't on the card.** The light moves to each hen in turn. Each lifts her head and clucks as Nani names her: "the big hen", "the small hen". The light leaves them.
3. **The ask.** Nani turns front-on: "Bring me an egg from under the big hen." The card pops big beside the side panel (the big hen, an egg, the Kutchi, the speaker), then flies into its row. Guide box: [Look under the hen] (to record).
4. **The open (a new action, shown once).** The lit box hugs the big hen. The child taps: she flaps and hops down beside her nest with a cluck. Two eggs lie in the open straw. She stays down.
5. **The egg.** The lit box moves to the eggs. Guide box: *wiji chad* ✓ ("put it in"). Tap one: it hops into the basket with a soft *tok*. A dot appears on the basket.
6. **The hand-over (shown once).** The count ticked when the right number of eggs reached the basket. The lit box moves to Nani. Tap her: the child hands the basket over (a real move of its own), and Nani counts "one", tips the basket into the crate, and says *shabash* ✓. The row ticks gold. The big hen hops back up onto her nest.
7. **Alone, and the joke.** The light points once at the card (1.2 s), then stops. "An egg from under the small hen." The child may open the big hen first; that's free, and she just clucks. They open the small hen (her first time): **the chick tumbles out** cheeping and hops onto her back. Nani laughs: "Oh, a chick!" The child takes an egg and hands the basket over; the chick rides her back up. Tick.
8. **The same hen twice.** "An egg from under the big hen" again (the same hen can be asked twice). Open, take, close. Tick.
9. **The end.** The crate is full. Nani puts one egg in the child's hands: "for Ali". *Shabash*. The chick runs out to its sisters in the yard; the camera eases back to the yard.
10. **The end screen:** the shared two-page end screen. Its word page has egg, hen, big and small, and chick (to record), each with its picture and speaker; the grown-ups' English sits under the Kutchi there.

From the second round, the round is scored and the showing doesn't repeat. Each level's new thing is shown once when it arrives (at L2 the third hen is shown and named first, Nani counts the first ask aloud, and the tally dots light once). A child who leaves a wrong basket still gets the close's funny consequence and the ask again (shared rules), and the hint at 7 s.

### The corn stall (first farm visit)

1. **Arrive.** The stall's worktop from overhead. Everything is dimmed.
2. **What isn't on the card.** The light moves along the bottom row: Nani names each thing as it glows (in the guide box, off screen): the corn crate, the lemon half, the chilli powder, then the mint and tamarind bowls. The light leaves them.
3. **The order.** The customer orders: "One corn with lemon and mint chutney." The cards pop and fly into their rows.
4. **The grill (shown once).** The lit box hugs the crate; tap: a cob goes on the grill. Guide box: [Put it on] (to record). The heat ring fills; its first turn **holds in the green** while the light shows the cob; tap: it turns. Guide box: *firai* ✓. Golden: the lit box moves to the cob; guide box: *kadhi chad* ✓; tap: it lifts onto the plate.
5. **The dress (shown once).** The lit box moves to the lemon half. Guide box: [Squeeze it] (to record). Tap: squish and drips on the cob.
6. **The chutney (shown once).** The lit box moves to the mint bowl. Guide box: [Put the chutney on] (to record). Tap: a spoonful beside the cob.
7. **The serve (shown once).** Cook's serve, lit once. Guide box: [Give it to them] (to record). The customer bites: "aah". The row ticks.
8. **The end.** The child's own cob, and Cook's end screen with lemon, chilli powder and the two chutneys on its word page.

### Pick (the orchard visit)

1. **Arrive.** The patch fades in: the mango tree and the lemon tree, the basket at the fence end, Nani at the right. The goat's head pops over the fence once, chewing, and ducks back.
2. **What isn't on the card.** The light moves to each tree as Nani names it: "a mango", "a lemon". The leaves shiver as each is named.
3. **The ask.** "Pick a mango." The card pops and flies into its row. Guide box: [Pick them] (to record).
4. **The pick (shown once).** The lit box moves to the mangoes. Tap one: it pops off and bounces into the basket. A dot appears.
5. **The close (shown once).** The lit box moves to Nani. Tap her: the child hands the basket over; Nani counts "one", lifts it onto her hip and back, and says *shabash*. Tick.
6. **Alone.** The light points once at the card. "Pick a lemon." The child picks.
7. **The goat (shown once).** If any close in the round is wrong, the goat stretches over and munches the wrong one, and Nani says the ask again. If none is, at the end the goat steals one leaf from the lemon tree, so every child meets him.
8. **The end.** The basket goes to the pantry; the word page has mango and lemon.

### Plant and water (the orchard visit)

1. **Arrive.** The same patch; the basket gone; two saplings in pots along the bottom, the can at the right.
2. **What isn't on the card.** The light moves to each sapling as Nani names it: "the lemon", "the tomato"; then to the gaps; then to the can, which sloshes once.
3. **The ask.** "Plant the lemon." Guide box: [Plant it] (to record).
4. **The planting (shown once).** The lit box hugs the lemon sapling; tap: it lifts out of its pot. The lit box moves to a gap; tap: it goes in and the soil closes.
5. **The water (shown once).** The lit box moves to the can (a control: it only glows). Guide box: [Water it] (to record). Hold: it tilts and pours. Release.
6. **The grow (slower the first time).** The sapling shoots up into a little lemon tree with lemons. Nani: "Look, it's growing!" Tick.
7. **Alone.** "Plant the tomato." The child plants and waters.
8. **The end.** The two new plants stand in the row; the word page has plant, lemon and tomato.

## 5. Later visits and harder versions

- **Visit 1 (first farm day):** A and B at the child's level.
- **Visit 2 (the orchard visit):** C1 and C2 in one scene. Animals home gets positions (`farm-animals.md`).
- **Later rows** (each its own go from Zafar, not part of this build):
  - **Plant now, pick next time:** what was planted is grown and picked first on the next visit. It needs DAY-02 (a whole day plays through) closed and a saved planted state across days; `js/day/day.js` keeps only `today` and `dayNo` today.
  - **The corn you picked goes to the stall:** corn plants join the patch, and B runs on the orchard visit with those cobs (a same-day carry through `today`).
  - **The stall front:** Hannah Mami's stall at the gate with a waiting crowd (the one who speaks orders) and a zoom to the grill.
  - **The chutney speaking turn** on the shared "say it, X acts" moment, if Zafar wants a second farm speaking turn.
  - **The bird** as a second C1 miss reaction.
  - **The roots:** "pull up two onions" (*dungri* ✓), potatoes, carrots (the pull-up gesture).
  - **More hens:** a fourth hen once Mum gives a second hen colour; the coop's top and bottom nests ("the hen at the top": positions).
  - **More plants:** banana, orange and pomegranate (drafts in the engine, to record). Owners in C1 ("three mangoes for Nani, two for Ali").
  - **The child gives the orders** (role reversal): the child tells Ali which hen to open, from the closed set of hen words, on the shared "say it, Ali acts" moment.

## 6. What it reuses and what is new

**Reuses:**
- **Cook's count** (`js/cook/mechanics/count.js`), generalised as count-to-a-number (`docs/game-design/modes/count-to-a-number.md`), with its **accuracy rule** (a wrong spoon costs the badge): the first-go rule here.
- **The shared openable** (`hide-and-seek.md` §6, from Find it's 4d and library L2): the hen.
- **`js/shared/whichone.js`**: the hens (size, colour), the plants (kind, colour, size), the saplings and the shakers (with a look-alike group each) are its items; it builds the line-ups, checks the decoy rule, balances the said values, and computes the blind odds in data (`blindOdds`, `fitBudget`), replacing the hand sums in §3.
- **`js/shared/rel.js`**: "under" (*niche*) as a relation word, for A's frames.
- **The sekelo station** (`js/cook/stations/mishkaki-grill.js`, `js/cook/mechanics/grill.js`, `data/stations/mishkaki-grill.json`): the grill phase as it is.
- **Cook's add** (`js/cook/mechanics/add.js`) for the dress and the chutney; **pour** (`js/shared/pour.js`, `js/cook/mechanics/pour.js`) for the watering can.
- **Tidy's place** (`js/tidy/mechanics/place.js`): tap, then tap, for sapling to gap.
- **Zafar's count rule** (1 Nov, reversed after the chai play): counts and amounts tick at the number or amount and an extra tap doesn't land; the hand-over, the serve and the can are real moves of their own, not what closes a count (decision 2).
- **The shared layer** (`js/shared/`): the order card (`order-card.js`), the guide box (`guide.js`), the onboarding and light (`onboard.js`, `focus.js`), the request pop-up (`request-popup.js`), the tally (`tally.js`), the bulb (`bulb.js`), the end screen (`results.js`), the family voice (`family-voice.js`).
- **The day** (`js/day/`): the farm day's data, the home stage (one egg for Ali), and the book (the chick and the grown plants as pictures).
- **Art:** the farm's hens and chicks (one set for the day, decision 24); `farm-animals.md`'s goat eat pose for the goat over the fence; Nani's locked s08 look.

**New to build:**
- **Two rows for the shared-layer owner on the openable** (not built here; never restyled per mode): (1) **take from the content layer**, one item at a time, each a tappable item that leaves the openable for a container; (2) **hold open while the ask is open**, closing with the step's close or a tap on it or on another openable (one open at a time), instead of "closes itself after its joke". The hen's open art (hopped down beside the nest) is art, not code.
- **The kind judged at the hand-over:** the whole container judged once for kind at the hand-over, gold on a first hand-over right, a redo plain (and the round doesn't count towards moving up). The count itself ticks at the number. It belongs in the shared count (`count-to-a-number.md`), written there with Zafar's count rule of 1 Nov, so every count game gets it.
- **Plant items in states** (unripe, ripe; on the plant, in the basket), the pop-and-bounce pick, and **saplings** (in the pot, planted, small plant).
- **The grow:** a cross-fade through real art frames, all in E. No drawing in code.
- **The dress and chutney phase** for B: Cook's add with new items, in place of threading.
- **Miss reactions** as data: the hen's nudge, the roll-back, the goat's munch, the sapling's droop and flop.
- **Data:** `data/stations/corn-stall.json`, and level files for the eggs and the patch, with every count, decoy, threshold and level rule in data.
- **The leak bot** for each game (a learned save; its win is a round that counts towards moving up; under 10% from L2).

## 7. Art and layout

**Cameras (one per scene, art bible §3):**
- The hen house: **E**, front-on to the shelf, horizon at about 55%. Hens and the chick in E; **the nests and the eggs in them in F view** (about 10° down), so an open nest's eggs can be counted.
- The stall worktop: **T**, exactly overhead (no horizon, rims as circles). Cobs in every state, shakers, lemon halves, chutney bowls and the plate, all in T.
- The patch: **E**, side-on, horizon at about 55%. Every plant, fruit, sapling, pot, gap and the can in E. The basket in F view, so its fruit can be counted.

**Proof before any art run** (Zafar's fast lane, 27 Oct): a grey-box lab page for the hen house and the patch, every hen, nest, egg, basket, person and bubble as a labelled box, at 740x320, 930x430, 1280x665, 1920x1080 and 915x275, checked by the four-size script.

**The art, in three blocks** (one paste block each, backgrounds locked first; decision 77):
- **Block 1, the hen house and the farm's hens** (visit 1; shared with `farm-animals.md`): the hen house interior (E, nests in F); **the three hens** in the 3D style (the old `assets/characters/hen/` sprites are the storybook look, the anti-reference), each sitting on a nest, hopped down beside it, and clucking, plus the poses `farm-animals.md` asks of its hen (walk, peck, drink, sleep); **the chick:** tumble, cheep, riding on the hen's back, peck, follow; eggs, brown and white, in a nest (F) and single (for the basket); the child's basket (F); Hannah Mami's crate. About 25 cut-outs.
- **Block 2, the corn stall** (visit 1): the pale-oak stall worktop (T, with `sheet-tray-grill-t-v2` if it suits); the corn raw, golden and charred; four shakers (red chilli powder, salt, pepper, garlic powder); lemon halves whole and squeezed; three chutney bowls (white coconut, green mint, dark tamarind) and a spoonful of each; the steel plate; the dressed cob (sprinkled, squeezed). About 18 cut-outs.
- **Block 3, the patch** (visit 2), in two halves: **3a (L1-L2):** the patch background (E, the farm's palette from `m1-farm-mid-fields-v1`, with the fence end and the dug strip); the mango tree (big and small, yellow and green mangoes), the lemon tree, the tomato plants (red and green); each fruit single for the basket; lemon and tomato saplings in pots, planted, and small; the watering can upright and tilted. **3b (L3-L4):** the chilli plant (red and green), green beans, the chilli, mango and bean saplings and small plants; the drooped and flopped sapling. About 22 and 14 cut-outs.
- **People:** Nani from her locked s08 look (`sources/art/s08/sheet-nani-final-1.png`), standing three-quarter and front-on; no new poses beyond what `farm-animals.md` orders. Hannah Mami isn't needed by this design's first build. Customers: the shared customer cast (`sources/cook/customers-sheet.webp`); no new people.
- **The goat:** `farm-animals.md`'s goat eat pose, cropped over the fence; no new goat art.

**Layout.** The layouts switch by height (the phone layout below 500 px). The left fifth (about 22%) is the shared side panel at every size.
- **The hen house:**

| Size | Play area | Where things go |
|---|---|---|
| **740x320** | about 577x320 | Nani at the right, chest up, about 100 px wide, her head at y 60-130; her bubble to her left over the back wall. Three nest slots of about 150 px across the remaining 470 px. The shelf's nest band at y 110-170: a nest about 120 px wide holds 3 eggs in front and 2-3 behind, raised so each shows; **eggs at least 44 px**. A sitting hen about 90 px tall (y 80-170). The floor band y 190-310: a **hopped-down hen** stands beside her nest, about 90 px tall, her head below the nest's rim, so the eggs stay in the open. The basket at the bottom left of the play area, 80 px. The bubble and the card pop sit above the hens, never over a face or an open nest. |
| **915x275** | about 714x275 | The same, wider: nest slots about 190 px. Nest band y 95-150; sitting hens about 80 px (y 70-150); eggs at least 44 px; the floor band y 165-270, a hopped-down hen about 85 px. Nani at the right, her head at y 50-115. The back wall gives up its room first. |
| **930x430** | about 725x430 | The phone layout with more back wall and the door whole; eggs and hens capped at their 740 size plus a quarter. |
| **1280x665, 1920x1080** | the big layout | The same positions, centred, items capped at their maximum size. The back wall, the door and the yard get the extra room. Nothing moves, so the light boxes stay put. |

- **The patch** (740x320 and 915x275): the plants in one row in the middle band, trees cropped at the top so the fruit hangs at y 90-200 (fruit at least 44 px); the dug strip with its gaps at y 210-250; pots and saplings along the bottom at about 60 px each (five fit in 330 px); the basket (C1) or the can (C2) at the right against the fence end, left of Nani; the goat's head above the basket, clear of Nani's face; Nani at the right edge, chest up. Big screens: more sky and fields; nothing moves.
- **The grill:** sekelo's layout. The grill centre left, the shakers in a row along the bottom, the chutney bowls and the plate on the right. At 275 high the shaker row is one row of up to five, at about 56 px.
- **Bubbles** go into free space above the hens or the plants, never over a face or the side panel.

## 8. What it borrows from other games

- **Peekaboo Barn** (the hide-and-seek design's source tonight: [App Store](https://apps.apple.com/us/app/id6468775129)): opening a door always makes a sound and a reaction. We borrow the open-and-reveal with a sound. Our reveal holds eggs (the count) and sometimes a chick (the joke).
- **Sago Mini Farm** (our research, read): tap a rain cloud and the crops grow. We borrow the fast grow after watering. We don't borrow its silly crops (they'd make the picture decide).
- **Toca Kitchen 2** (research, read): guests react to food. We borrow the customer's bite and "aah" at the corn stall.
- **Dr. Panda Restaurant** (research, summary): orders, then cooking. Our order card, then the grill.
- **My PlayHome** and **Toca House** (research): gardening and eggs as favourite small jobs. We add the voice that asks (cross-cutting lesson 9).
- **The "give me N" test** (mechanics research): the number as a give. Here the count ticks at N and the basket's kind is judged at the hand-over.
- **Monki-style rotation** (research): the hens shuffle and the chick moves every round.

(Hay Day's "come back and it's grown", from memory, is dropped with the carry, which is now a later row.)

## 9. The lessons checklist

1. **The heard word decides: passed.** A and C1 need two words per move from L2 (which hen or plant, and how many), the count ticks at the number, the basket's kind is judged once at the hand-over, and only a first hand-over right ticks gold or moves a ladder, so fishing doesn't win. Each game's leak test, with a Fishing row, and its blind odds are in §3, from L2 a level-up round under 10%. The deciding words recorded today: egg, small, red, lemon, tomato, chilli, the three chutneys; the rest are in §1's frame table. **C2 is weak on language at every level** (the sapling is the only decider, since the count and the water now tick on their own, 1 Nov), accepted because it's the calm stage. Our own words, not just numbers: hen, chick, the colours, the fruit and vegetables.
2. **Onboarding and the first round: passed.** Every first round is written step by step (§4), each starting with what isn't on the card, one lit box, each new action shown once, the grill's timer held in the green, tap then tap, and 2-5 hiding places.
3. **Instructions: passed.** Nani is on screen and speaks before the card (A, C); the customer orders (B). The card never changes; the guide box says the step, never empty (§4's lines). Listening again is free. One line per moment: Nani counts aloud only at L1.
4. **Pacing and waiting: passed.** No Next and no Done: a count ticks at the number and an extra tap doesn't land (Zafar's count rule, 1 Nov); the hand-over, the serve and the can are real moves. Taps skip the speech. Hints at 7-13 s. No timers in A or C. The ask repeats for non-readers.
5. **Feedback and the end: passed.** A funny consequence and the ask again, redone on the spot (the hen's nudge, the goat, the droop and flop). Rows tick at the close, gold only first time. The count sits on the basket. It ends at once with something given or grown (the egg for Ali, the child's own cob, the grow). The shared end screen.
6. **Layout: passed on paper** at all five sizes, with numbers for 740x320 and 915x275 (§7); a grey-box lab comes before any art.
7. **Art and camera: passed.** One camera per scene (E for the hen house and the whole patch, T for the worktop), the nests and basket in F view inside E so counts read. Nothing drawn in code (the grow is art frames). Contact shadows, nothing floating. No sparkles. Three paste blocks, each its own run.
8. **Speaking: none in this design's first build.** The farm's speaking turn is the call at dusk (`farm-animals.md`), on the shared moment. B's chutney turn is a later row.
9. **Levels: passed.** Each game follows the rulebook (L1 the core; L2 numbers, plus "no" in B only; L3 other ways of saying it; L4 amounts and a look-alike), with its repeating thing, its most at L4 and its one override written in §3. The Kutchi gets harder, not the gestures.
10. **Words: passed with the gap listed.** §1's frame table says frame by frame what the engine can't build today and what Mum records (about 75 takes; about 25 for the first sitting). Every count is written on the card as a word. 2-4 new words a round.
11. **Culture: passed.** Halal; no sweets (the treat is a cob of corn and an egg for Ali); modest clothes; no religious markers. Nothing a child could copy and get hurt by: the grill is tapped, never touched, and Nani says "don't touch!" (*na ad*, in engine, to record) the first time.
12. **Fun: passed.** The hands always have something to do. The "kind of funny" moments: the chick riding the hen, the goat munching, the sapling flopping in its puddle, the "sss-aah". Good gestures: the hop-down, the pop, the squish, the pour. Contrast: big hen and small hen, red and green. No fatigue: A follows feed with a different action; B's L4 is four cobs in a round, not twelve.
13. **Mistakes made twice: guarded.** The count rule is Zafar's one rule

**The ten questions:** 1. §1 and §3 (the deciding words; about ten recorded). 2. §3's leak tables, each with a Fishing row. 3. Every hen has eggs; every plant has more than asked; every shaker, bowl and sapling is out. 4. §4, all four. 5. Nani and the customers, in the frames of §1. 6. Open, take; pick; tap, tap, pour; grill, sprinkle, spoon, serve. 7. The chick, the goat, the flop, the "sss-aah". 8. With something given or grown: the eggs into the crate, one for Ali; the cob to each customer and to the child; the grow. 9. §3; each L4 has its own look-alike. 10. §7.

## 10. Decisions made for Zafar overnight

Answer "yes to all except ...".

1. **Scope cut to small:** visit 1 is A and B (B as the plain sekelo reskin); the orchard is visit 2, one scene, one camera, pick then plant. The stall front, the chutney speaking turn, plant-now-pick-next-time, the corn-to-stall carry and the bird are later rows (§5). *Reason:* the map's "small" and your "a skin of Cook, not a new game"; the carry needs saved state the day doesn't have, with DAY-02 still open. *Assumed answer:* yes.
2. **One count rule, Zafar's (1 Nov, reversed after the chai play), the same in every game:** a count ticks at the number and an extra tap doesn't land; an amount ticks when reached. The hand-over (A and C1), the serve (B) and the can (C2) are real moves of their own. Never a button, and no stillness timer. *(First, earlier on 1 Nov: the natural next thing, else about 1.25 s of stillness.)*
3. **The count ticks at the number; the basket's kind is judged once, at the hand-over; gold only first time.** No egg or fruit is judged for kind as it's taken. A wrong hand-over takes out what's wrong with a funny reaction and asks again; the right ones stay; the row ticks plain, moves no word's ladder, and the round doesn't count towards moving up (Zafar, 1 Nov). *Reason:* otherwise a child wins by taking from each hen until one stays (your chaat point, CHT-14; every sibling design's first-go rule). By his choice the count can be won by tapping until it ticks. *Assumed answer:* yes.
4. **The hens are told apart by size at L1** (big and small) **and by colour from L2** (red ✓, then white), each asked by the words that pick her out alone. *Reason:* recorded words first; contrast pairs teach best. *Assumed answer:* yes.
5. **Opening a hen is a free peek.** She hops down beside her nest and stays down while the ask is open. The chick sits under a random hen each round (under the small hen in the first-ever round, the first time she's opened). From L3 "the hen with the chick" is a joke row that ticks plain and is never a leak-bot win. *Reason:* the joke works as a toy; a peek gives nothing away because every hen has eggs. *Assumed answer:* yes.
6. **No "no" asks in A or C;** B has them from L2. *Reason:* "not that hen" is unnatural; the rulebook lets a game skip them with a reason. *Assumed answer:* yes.
7. **The eggs go to the pantry, with one for Ali** (the home stage). They turn up in the kitchen's eggs station. *Reason:* `farm.md`. *Assumed answer:* yes (his).
8. **The orchard plants saplings, not seeds:** saplings in pots, planted into gaps in the patch's front strip, in the same scene and camera, growing into fruiting plants in place. *Reason:* your scope line ("plant fruit and vegetable trees"); one camera; half the plant art. The alternative is seed packets in a top-down bed: a fifth background, a second camera, and every plant drawn twice. *Assumed answer:* saplings.
9. **The first plants:** mango and lemon (L1), tomato (L2), chilli (L3), green beans (L4) to pick; lemon and tomato (L1), chilli (L2), mango (L3), green beans (L4) to plant. Roots and banana, orange and pomegranate later. *Reason:* lemon, tomato and chilli are ✓; mango is heard in 38 lines. *Assumed answer:* yes.
10. **Ripe and unripe asked as colours** ("the red tomatoes") until Mum gives "ripe". *Reason:* never invent Kutchi. *Assumed answer:* yes.
11. **The goat eats a wrong pick, at the close.** It's the first build's C1 reaction, from `farm-animals.md`'s goat eat pose; extras roll back; the bird comes later. *Reason:* a funny miss, the redo on the spot, no new goat art. *Assumed answer:* yes.
12. **Watering decides nothing at L1-L2; from L3 "a little" and "a whole can" decide both ways,** with the thresholds in data (a little 0.3-1.2 s; a whole can 2.7 s or more of a 3 s can). Too little: the sapling droops and Nani says "more". Too much: it flops in a puddle and Nani says *bas* ✓. *Reason:* if too much always grew, holding the can would win. *Assumed answer:* yes.
13. **Saplings carry no labels;** each shows its own leaves and one small fruit. *Reason:* NN3; the sapling is the item, and the word picks among several. *Assumed answer:* yes.
14. **The corn stall is the plain sekelo reskin:** grill as it is, then dress and chutney as Cook's add, one customer at a time at L1-L2 and two from L3, served as Cook serves. Cobs per round 1, 3, 3, 4 (the rule's 1, 2, 3, 4, with L2 raised to 3 for the leak budget). *Reason:* your corn stall row in `farm.md` and "a skin of Cook"; sixty taps at L4 was too many. *Assumed answer:* yes.
15. **The dressings:** lemon ✓ and chilli powder at L1; salt (L2), pepper (L3), garlic powder (L4, the look-alike beside the salt). *Reason:* recorded first; a real look-alike pair. *Assumed answer:* yes.
16. **No speaking turn in this design's first build.** The farm's speaking turn is the call at dusk. B's chutney order on the shared "say it" moment is a later row if you want a second. *Reason:* B is meant to be cheap, and a seventh copy of "say it, X acts" is what the audit warns against. *Assumed answer:* yes.
17. **(Was: the stall uses the corn you picked.)** Now a later row (§5). *Assumed answer:* yes.
18. **Nani says every line in A and C,** from her bubble on screen, and from the guide box in B; Hannah Mami is silent, Nani or another placeholder for her lines and look for now (Zafar, 1 Nov), the same rule as `farm-animals.md` decision 13. **Voices (Zafar, 1 Nov):** for the prototype, the Kutchi takes that exist play, and the device voice says the rest. Who voices what, the recording sessions and the casting are settled before shipping, once the words are locked; nothing in this design waits on a voice.
19. **The pull-up gesture** (root vegetables) waits for a later visit. *Reason:* one new action at a time. *Assumed answer:* yes.
20. **No timers in A or C.** B keeps the grill's turn timing, held in the green the first time. *Reason:* the no-timers lesson; sekelo's existing rule. *Assumed answer:* yes.
21. **The ladders follow the rulebook,** each with its repeating thing, its most at L4 and at most one override, written in §3: A eggs per ask (1-4; L3 keeps three hens); B cobs per round (1, 3, 3, 4); C1 fruit per ask (1-4); C2 saplings per ask (1, 2, 2, 3). Asks per round: 3, 3, 4, 4 in A and C1; 3 in C2. *Reason:* one override per game, written in its row. *Assumed answer:* yes.
22. **A game counts as teaching only once its deciding words are recorded;** until then it plays with grey English in testing only. The farm's sheet for Mum is §1's frame table, the first sitting about 25 takes (visit 1, L1-L2). *Reason:* NN2; lesson §1. *Assumed answer:* yes.
23. **L1's blind odds are accepted as the guided level** (the words are supported, everything shown); the leak bot judges from L2, where a level-up round must stay under 10% (A, C1 and C2 about 3.7% since the count stopped deciding on 1 Nov; B recounted by the lab bot, at worst three cobs at 1 in 3 each, 3.7%, since its number no longer decides). *Reason:* the clinic's L1 precedent. *Assumed answer:* yes.
24. **One farm cast for the day:** three hens (the big red-brown mother hen, the small white hen, the big white hen) and the mother hen's three chicks, drawn new in the 3D style. The hen the child feeds is the hen that lays; one chick hides in the hen house, the other two peck in the yard; all three follow her home at dusk. **`farm-animals.md` adopts these hens** in place of the old `assets/characters/` hen sprites (done in the consistency pass, 1 Nov: its decision 8 and §7). *Reason:* one hen on one day; the old sprites are the art bible's anti-reference. *Assumed answer:* yes.
25. **The hen is hide and seek's shared openable,** not a new "lift" piece; two rows go to the shared-layer owner (take from the content layer; hold open while the ask is open). *Reason:* one piece, four designs (non-negotiable 6). *Assumed answer:* yes.
26. **Art in three blocks after a grey-box lab:** the hen house and hens (shared with `farm-animals.md`), the corn stall, then the patch in two halves. *Reason:* one supervised paste block per run. *Assumed answer:* yes.

**Open questions:** Zafar answered the count rule and who asks on 1 Nov (decisions 2 and 18). What remains is for Mum:
1. **For Mum, through him:** which word for egg to a child (Zafar: *indo*, for now; to confirm); whether *murgi* is the live hen (Zafar thinks so; to confirm); the she-forms of big and small with hen; whether *laal* is said of a hen; whether roasted corn has its own name.

## 11. ChatGPT mock-up prompts

**Run order:** prompt 1 first; prompt 2 next, and once Zafar approves its patch, attach it as the **first** reference of prompt 3 (a fresh run has no memory of the last); prompt 4 on its own. The grandmother is a **stand-in from her locked sheet**; Hannah Mami is left out (a placeholder for now, Zafar 1 Nov). All UI (lit boxes, glows, the tally dots, bubbles) is code-drawn and not shown.

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

### Prompt farm-eggs-orchard-1: collect the eggs (L2)

The image should show the hen house at the moment a hen has hopped down off her nest: her eggs in the open in the nest, countable, and the chick tumbling out. It shows the open, the count and the joke in one frame.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The scene: inside a small, sunny wooden hen house on a farm, seen straight on at eye level, the horizon at about 55% of the height. Across the middle runs a low wooden plank shelf with three round straw nests in a row, evenly spaced, the nests seen from slightly above (about 10 degrees down) so what is in them shows. On two nests sit hens, clearly different from each other: on the left, a big plump red-brown hen; on the right, a small white hen. The middle nest belongs to a big white hen, who has just hopped down off the shelf: she stands on the straw-covered floor beside and below her nest, wings half open, beak open in a cluck, one small feather drifting, her head lower than the nest's rim. Her nest is now open and in plain view: four smooth cream eggs lie clearly separate in the straw, three in front and one behind, every one fully visible and easy to count, and a fluffy yellow chick is tumbling out over the nest's rim, beak open, cheeping. At the bottom left of the frame, a small woven basket seen from slightly above holds one egg. At the right edge, cut at the chest, stands the grandmother from the attached character sheet, three-quarter on, smiling at the hens, beside a wooden egg crate on the floor. Behind, the open doorway shows a bright farmyard where two more yellow chicks peck, and warm sunlight falls in, making soft patches on the straw.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows under every hen, nest, basket and crate, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the crate, the basket, the walls or anything else.

It must read at phone size (about 740x320 pixels): each hen's size and colour clearly different; the four eggs big, smooth and bright against the straw, nothing covering them; the chick bright yellow and obvious; the grandmother's face clear of everything.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt farm-eggs-orchard-2: the orchard and vegetable patch, picking (L3)

The image should show the patch as the child picks: several kinds side by side, more than asked, ripe and unripe, one fruit bouncing into the basket, and the goat over the fence munching. It shows that the words decide which and how many.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The scene: a sunny kitchen garden on a farm, seen side-on at eye level, the horizon at about 55% of the height, flat ground. Across the middle stand four low plants in a row, all small enough that their fruit hangs in the middle of the frame: a small mango tree with six mangoes, some ripe yellow-orange and some green, some big and some small; a lemon tree with bright yellow lemons; a row of staked tomato plants with red tomatoes and green tomatoes; a bushy chilli plant with red and green chillies. Every plant has plenty of fruit. In front of the plants runs a narrow strip of freshly dug dark soil with three empty round gaps. Behind the plants runs a low wooden fence; at the right it ends at a thick post, and a large woven basket stands on the ground against that post, seen from slightly above, holding two lemons and one mango. One yellow mango has just been tapped: it is in mid-air, bouncing in a small arc towards the basket, and the mango tree's leaves are still shaking. Over the fence just above the basket, a friendly cream-and-tan goat stretches its neck and happily munches a green tomato. At the far right edge, cut at the chest, stands the grandmother from the attached character sheet, three-quarter on, smiling. Beyond the fence, gentle green fields and a soft blue sky.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm and uncluttered.

Absolutely no text, letters or numbers anywhere.

It must read at phone size (about 740x320 pixels): each fruit big, chunky and clearly its own kind; red against green clear on the tomatoes and chillies; big and small mangoes clearly different; the fruit in the basket countable; the goat's head clear of the grandmother's face.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/m1-farm-mid-fields-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt farm-eggs-orchard-3: plant and water, in the same patch (L1)

The image should show the same patch at planting time: saplings in pots to choose from, one just planted and being watered, and one already grown in its gap. It shows the calm stage and its delight in the same scene and camera as picking.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The scene: exactly the same sunny kitchen garden as the first attached image, the same eye-level side-on camera, the same plants, fence and fields. The basket and the goat are gone. In the strip of dug dark soil in front of the plants, three round gaps: in the left gap stands a freshly grown small lemon tree with three bright lemons, just as tall as the lemon tree behind it is wide; in the middle gap a small young tomato plant has just been planted, and a green metal watering can, held by no one and tilted in mid-pour, pours a gentle stream of water onto the soil at its foot, the soil darkening; the right gap is open and empty. Along the bottom edge stand two small terracotta pots with young plants: a lemon sapling showing one small lemon, and a tomato sapling showing one small red tomato. At the far right edge, cut at the chest, stands the grandmother from the attached character sheet, three-quarter on, smiling at the new plants. Warm sunlight from the upper left, soft contact shadows under the pots, the can and the plants.

Style: match the attached references. A stylised 3D animated-feature look, soft warm light, chunky simplified shapes, clean surfaces, no outlines, no photorealism. No glitter, sparkles or particles. Calm and uncluttered.

Absolutely no text, letters or numbers anywhere, including on the pots.

It must read at phone size (about 740x320 pixels): the three gaps clearly separate; the two saplings instantly recognisable by their fruit; the water stream and the newly grown lemon tree easy to see.

References to attach (the approved patch from prompt 2 first):
[the approved image from prompt farm-eggs-orchard-2]
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt farm-eggs-orchard-4: the corn stall's grill

The image should show the corn stall's worktop from exactly overhead: cobs grilling in different states, every dressing and chutney out at once, and one cob being dressed. It shows that the order, not the scene, picks the dressing and the chutney.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The camera looks exactly straight down (90 degrees) onto a roadside stall's worktop of pale oak, with no horizon, no walls and no perspective tilt: every rim reads as a circle. Centre left, a rectangular charcoal grill tray with glowing coals under a dark grate holds three corn cobs lying side by side: one pale and raw, one golden with blistered kernels, and one half turned with a darker charred stripe. On the right, a small round steel plate holds a golden roasted cob; a lemon half above it is being squeezed, with a few bright droplets falling onto the kernels. Next to the plate stand three small round steel bowls of chutney: a white coconut chutney, a bright green mint chutney and a dark brown tamarind chutney, each with a little spoon. Along the bottom edge, in a neat row, sit four small round steel shaker bowls: red chilli powder, a pale cream garlic powder, white salt and black pepper, with two fresh lemon halves beside them. A small wooden crate of raw cobs sits at the top left. Warm sunlight from the upper left, soft contact shadows, nothing floating, no smoke or haze.

Style: match the attached references. A stylised 3D animated-feature look, soft warm light, believable materials (brushed steel, oak, charcoal, glossy kernels), chunky simplified shapes, no outlines, no photorealism. Calm and uncluttered.

Absolutely no text, letters or numbers anywhere: not on the crate, the bowls or the shakers.

It must read at phone size (about 740x320 pixels): the three cob states (raw, golden, charred) clearly different; the four powders clearly different in colour, with the salt and the garlic powder close but distinguishable; the three chutneys clearly different colours.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/chatgpt-batch3/sheet-tray-grill-t-v2.png
```

## 12. Changes after the critique

Each finding from `farm-eggs-orchard-critique.md` (1 Nov), then what was done.

1. **MUST: a child with no Kutchi wins A and C1 by fishing.** Done. Nothing is judged item by item; the whole basket is judged once at the close; only a first close right ticks gold, moves a word's ladder and counts for the leak bot; a redo ticks plain and counts as a hint for moving up (the rulebook's hint rule, as `farm-animals.md` does). *Reversed later on 1 Nov, after the chai play: the count ticks at the number, so there is no too-many or too-few; the kind is judged at the hand-over.* The hen's nudge and the goat's munch are now the close's reactions. Every leak table has a Fishing row, and the blind odds are re-run as "a round that counts towards moving up" (about 7% at L2 in A, C1 and C2; 3% in B). One difference from the critique: on a wrong close the **right items stay** in the basket, and only the wrong ones leave. Reason: non-negotiable 7 (nothing undoes a child's right work); the row is already plain and moves no ladder, so what's left gives nothing away that counts.
2. **MUST: two count-close rules, both reversing rule 4 by assumption; the give risks being Done in costume.** Done. This design no longer settles the close. It adopts the rule `farm-animals.md` already put to Zafar (stillness, or the step's next thing where there is one), so the farm day has one rule, and makes it open question 1 with three numbered choices: (a) stillness, recommended, as the closest to his own "every step moves on by itself"; (b) the give, named as a Done in costume; (c) keep rule 4. §3 gives the fallback for (c) (the count stops at N, the basket judged there, which still decides, how many doesn't, and `whichone` adds decoys to stay under budget). The answer goes into `count-to-a-number.md` and `easy-to-play.md` the same day; I didn't edit them. The give survives only as the close's animation (Nani tips the basket into the crate). *Superseded later on 1 Nov, after the chai play: counts tick at the number and an extra tap doesn't land.*
3. **MUST: C2 L3's amount words were beaten by holding the can.** Done. Too much is now a miss as well (the sapling flops in a puddle, Nani says *bas* ✓, the water step redoes), and too little droops and asks for "more". The thresholds are in data: a 3 s can, "a little" 0.3-1.2 s in total, "a whole can" 2.7 s or more. Holding the can wins only half the asks.
4. **MUST: "Lift" duplicated hide and seek's shared openable.** Done. "Lift" is deleted; the hen is the openable (closed: sitting; open: hopped down beside the nest; content: eggs and sometimes the chick). Two rows go to the shared-layer owner: take from the content layer one item at a time, and hold open while the ask is open.
5. **MUST: two hens, two chick counts, two Snap placements and two askers across the two farm designs; Hannah Mami's voice left open.** Done. One cast (decision 24): three new 3D hens and the mother hen's three chicks, the fed hen being the laying hen, one chick hiding, two in the yard, all three home at dusk; Snap's chick row is a second-visit row, as `farm-animals.md` has it. One art list: Block 1 draws the hens for both designs, and `farm-animals.md` is flagged to swap its old hen sprites (its owner's edit). One asker rule (decision 18, open question 2): Nani says every line in Mum's voice and Hannah Mami is silent until she records, the same as `farm-animals.md` decision 13, with the alternative put to Zafar. Hannah Mami is no longer in A or C, which also removes her three props from the art.
6. **MUST: scope against "small".** Done. Visit 1 is A and B, and B is the plain sekelo reskin (the grill as it is, dress and chutney as Cook's add, one customer at a time as Cook does, no stall front, no zoom, no crowd, no speaking turn). C is one scene in one camera. The carry between visits, the corn-to-stall carry, the stall front, the chutney turn and the bird are later rows (§5), the carry noted as needing DAY-02 and saved state that `js/day/day.js` doesn't have. Backgrounds drop from five to three. The art is split into three blocks with counts (about 25, 18, 22 and 14 cut-outs) after a grey-box lab. One difference: I kept the goat as C1's one miss reaction in the first build, because it costs no new art (`farm-animals.md`'s goat eat pose, cropped over the fence) and it is C1's delight; the bird and the roll-back variety wait.
7. **MUST: the reveal didn't read at phone height.** Done. Nests (and the basket) in F view; the hen hops down to the floor beside her nest, her head below its rim, so the eggs lie in the open; she stays down while the ask is open (until the close or a tap on her or another hen), never on a timer. §7 gives the hen house at 740x320 and 915x275 in numbers (eggs at least 44 px, nest and floor bands, hen heights) and at the other three sizes.
8. **SHOULD: the corn stall was three times sekelo's load at L4.** Done. Cobs per round in total: 1, 3, 3, 4 (the rule's 1, 2, 3, 4 with L2 raised to 3, the game's one override, because two cobs leave a level-up round at about 21% blind), one customer at L1-L2, two from L3. L4 is four cobs, not twelve.
9. **SHOULD: B's speaking turn was a seventh copy, and the stall front had no room for three people.** Done. No speaking turn in B; a later row on the shared moment if Zafar wants one. No stall front; Nani speaks from the guide box (R3).
10. **SHOULD: two L3 rows weren't language rows.** Done. The chick ask is the round's joke row: it ticks plain and is never a leak-bot win. L3 keeps three hens (no middle-sized fourth); a fourth hen waits for a second hen colour from Mum (§5). This is A's one override, written in its ladder.
11. **SHOULD: the word budget was understated, and no frame was checked.** Done. §1 has a frame table: each frame, what the repo has, what the engine can't build today, and the takes. None of the frames is buildable from confirmed parts alone. About 75 takes in all; about 25 for the first sitting (visit 1, L1-L2); C's go on a later sheet. B L1 counts the two chutney names among its four new words.
12. **SHOULD: three first rounds were a sentence each; no guide-box lines; the chick appeared from nowhere.** Done. §4 writes all four first rounds step by step, each with its "what isn't on the card" pass and the guide-box line per step. The first-ever chick is under the small hen, the first time she's opened (step 7).
13. **SHOULD: Zafar said trees; the design planted seed packets in a top-down bed.** Done. C2 plants saplings in pots into gaps in the patch, in the same E scene, and the sapling grows into its fruiting plant in place. Seed packets are put to Zafar as the alternative, with their art cost (decision 8).
14. **SHOULD: reuse missed.** Done. §6 names `js/shared/whichone.js` (line-ups, decoys, look-alike groups and the blind odds in data), `js/shared/rel.js` ("under") and Cook's `count.js` accuracy rule (the first-go rule).
15. **SHOULD: the ChatGPT prompts.** Done. All four say "16:9 landscape" and give the phone size. Prompt 1: the hen has hopped down beside her nest, which is in F view with four eggs in the open. Prompt 2: the basket by the fence end, the goat's head over it munching; no "taken from the basket" story. Prompt 3 is rewritten for the new C2 in the same patch, with the approved patch as its first reference and "no glitter, sparkles or particles". Prompt 4: the heat shimmer dropped ("no smoke or haze"). Also, following the sibling design's prompt fixes: Hannah Mami is left out until her likeness run, and the grandmother is a stand-in from her locked s08 sheet; a run order is given.
16. **SHOULD: rulebook departures not written as decisions.** Done. Each ladder in §3 names its repeating thing, its most at L4, the rule's numbers and its one override with the reason (A: L3 keeps three hens; B: L2 three cobs; C1 and C2: none). A's L2 counts now follow the rule (1-2, not 1-3), still under budget. Decision 21 lists them.
17. **SHOULD: outside evidence from memory.** Done. Peekaboo Barn now cites the store listing the hide-and-seek design found. Hay Day is dropped, along with the carry it supported.

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** `farm-animals.md` now uses this design's three new 3D hens and three chicks (its decision 8 and §7; its prompts draw the same big, plump red-brown mother hen), and its count close is worded the same as §3 here (stillness, or the step's next thing where there is one; an empty trough or basket never closes; the clock waits for speech), one question for both (open question 1). *Later on 1 Nov, after the chai play: counts tick at the number in both farm designs; no stillness timer.*

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **One count rule:** counts and amounts tick at the number or amount and an extra tap doesn't land (reversed later on 1 Nov, after the chai play). The hand-over of the basket (A and C1), the serve (B) and the can (C2) stay as real moves of their own; the first answer, earlier the same day, closed counts on them or on about 1.25 s of stillness. The rule-4 fallback and open question 1 are gone (§3, §4, decisions 2-3, checklist 4).
- **Level up only on right-first-time rounds:** a redo no longer counts as a hint; the round doesn't count. The blind odds are recounted (all far under 10% from L2).
- **Voices and Hannah Mami:** Nani or a placeholder for now; existing takes, else the device voice; open question 2 is gone (decision 18).
- **Words:** *indo* for egg (for now) and *murgi* for the hen are marked "Zafar, to confirm". **Clothes:** the prompt sheet's line is added before the prompts.
- Counts tick at the number (his reversal after the chai play).
