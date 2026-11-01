# The shops and market: serve, order, pay, and Nani's picky shopping (slug: shops)

Designed overnight on 1 Nov 2026, while Zafar slept, on his instruction to design every game on his likely answers. **Revised the same night after an independent critique** (`shops-critique.md`, 14 findings, 7 MUST); §12 lists each finding and what changed. Every choice he hasn't made is in §10, numbered, so he can reverse it; the two that move his own 19 Oct design (the lanes and the chase; the chai stall) are open questions there, not assumptions. Nothing here is built or agreed. Kutchi appears only where it is already in the repo (`data/lang/lexicon.json`, `data/family-audio.json`, the word inventory of 31 Oct). Everything else is English and marked "to record".

Sources, newest first:
- Zafar, 1 Nov: paying climbs to every number up to 100 as the levels rise; yes to one game where the describing word is the move ("the X one" in contrast pairs, "like big and small, hot and cold, at the shops or the market stall"); serve, then order; the sewing takes its cloth from the shops (master map, his answers and Part 7).
- `build/reports/designs/shops-critique.md` (1 Nov, overnight).
- `build/reports/designs/town-map.md` (1 Nov, overnight): the map opens this day and hands over at the market entrance.
- `docs/game-design/days/shops.md` (19-21 Oct): the lanes, each shop its own game, *paisa*, the goat; "a first shops day may take the lanes, two stalls, pay and the goat, and later visits add the rest".
- `docs/game-design/modes/find-it.md`: the shop games this folds in (3a the counter and *khanigin*, 3b Ask for one (L2+), 4b Which one?, 5a Check the bag, 5c the scales, 5d Pay, 1d You're Nani, L11 the cloth stall).
- The 31 Oct research (other games, mechanics, existing games §4-5, the word inventory, the target wordlists) and the lessons checklist of 1 Nov.
- Two web checks: Toca Store (Common Sense Media: the customer's wallet of ten coins; counting coins out builds early number sense) and the adjective-contrast study (Journal of Child Language: four-year-olds, not three-year-olds, read an adjective as "this one, not that one of the same kind").

---

## 0. One line

**What it is:** at the market with Nani. On the first-ever round the child helps at the fruit stall from behind the counter (serving two customers onto the scales), takes a gift for Ali, then pays for Nani's lemons with a few coins. From the second round the general store opens, where Nani is a picky shopper and the describing word picks which one (the big pot or the small one); from the third, Big Ma's cloth comes off the general store's shelf. The child orders for Nani from L2.

- **Day:** town and shops, hosted by Nani. It follows the town map and ends with the shopping put away at home and the evening book.
- **Status:** designed (the day was "designed" in outline; this is the full design of its market games). The scales, Which one?, Check the bag and the gift tap are Find it designs and greybox code; pay is new.
- **Engines:** Find it's tap-the-named-thing and size rule (`whichone`), Cook's count into a container (the scale pan, the coins on the counter), the shared give (tap the person to hand it over), the shared speaking handover, and **one new engine, pay** (the purse with two piles, two coins, the open hand, the count-back). It is built on the shared kit; Find it's own engine is the reference, not the base.
- **Rough size, honestly:** **medium for the code** (pay is about one sprint; serve and the X one are small on the kit; the cloth is a skin), **large for the art** (two scenes, two new sellers in the full pose set, four Nani poses, about 15 things and 10 props on visit 1), and **the recording is the gate**: visit 1's first level needs about 17 new clips from Mum (§1); the whole game needs about 110, almost all of them numbers.

---

## 1. The language goal

**Word groups:**
- **Main:** money and shopping; numbers (to 20 on the first visit, every number to 100 by L4); describing words (the contrast pairs).
- **Supporting:** food (fruit, vegetables, the general store's things), colours (the cloth), greetings and politeness, question words (how much? which one?).
- **The shortfalls it closes** (master map Part 2): describing words (35 short; this is now their one game where the word is the move), numbers above ten (the tens had no home), money.

Key (only ✓ counts as recorded):
- **✓** Mum's own clip of the word.
- **✓ line** a whole recorded line the game can play as it stands (for example *wadho cup*, "the big cup"). The word inside it has no clip of its own, so the engine can't put it in any other sentence.
- **heard** Mum says it inside longer lines, but no line the game can use as it stands.
- **engine** the Kutchi is in the repo with no recording (a draft or a confirmed spelling).
- **to record** no Kutchi yet. Never invented here.

### The deciding words, visit 1 (rounds 1-3, every level reached on the visit)

| English | Kutchi in the repo | State | Decides a move in |
|---|---|---|---|
| lemon | *limu* | ✓ | serve |
| onion | *dungri* | ✓ (and ✓ line *trae dungri*, three onions) | serve, the X one L4 |
| tomato | *tameto* | ✓ | serve L2+ |
| peas | *matar* | ✓ | serve L2+ |
| chilli | *mirchi* | ✓ | serve L2+ |
| corn on the cob | *makai* | ✓ | serve L3+ |
| mango | *ambo / amba* | ✓ line only: *wadho ambo*, *wadha amba*, *hakro ambo, ba amba* | serve (*ba amba*, two mangoes) |
| potato | *bateta* (Mum's clip; the lexicon has *bataato*, Zafar to confirm) | ✓ line only: *trae bateta* | serve L4 (the look-alike with onion) |
| pot | *tapelo* | ✓ | the X one |
| cup | *cup* | ✓ | the X one |
| egg | *indo* | ✓ | your turn (L2) |
| teaspoon / tablespoon | *chamchi* / *chamcho* | ✓ | the X one L4 (the look-alike pair) |
| small | *nindho* (*nindha*, the small ones) | ✓ | the X one, serve L3 |
| big | *wadho* | ✓ line only: *wadho ginech*, *wadho cup*, *wadho ambo*, *wadho chamcho* | the X one, serve L3 |
| the biggest / the smallest | *wadho ma wadho* / *nindho ma nindho* | engine (confirmed; no clean take) | the X one L3 |
| red; not the red one | *laal*; *laal na* | ✓ | the cloth |
| green | *lilo* | engine (Mum's word, no clip) | the cloth L2 |
| blue, the other cloth colours | | to record | the cloth L2 |
| one, two, three, four | *hakro, ba, trae, char* | ✓ line only, inside count lines (*hakro ambo, ba amba*, *trae dungri*, *char limu*); no clip alone | serve |
| five to nine | *panj, chh, sat, ath, no* | engine (class handout draft) | serve L2, pay L1-L2 |
| ten | *do* | engine (class handout, "never confirmed by Mum"; also "two" in the Hindi and Urdu around the children) | pay L2 (the ten-coin) |
| eleven to twenty | | to record | pay L2 |
| money (*paisa*) | | to record | pay |
| the price ("that's five paisa") | | to record | pay |

**Counted honestly:** about 43 deciding words on visit 1. **14 have Mum's own clip** (lemon, onion, tomato, peas, chilli, corn, pot, cup, egg, the two spoons, small, red, not the red one). **7 more play only inside whole lines** (mango, potato, big, one to four). **22 are not recorded** (the biggest and smallest, green, blue, five to twenty, *paisa*, the price).

**What runs on visit 1 today, and what doesn't:**
- **Serve:** the kind decides on six ✓ nouns. Counts only where a whole line has them: *ba amba* (two mangoes) once Mum's *hakro ambo, ba amba* clip is cut at its pause (her voice, no new recording), *trae dungri* ✓ line, *char limu* ✓ line, *trae bateta* ✓ line. Every other count, and the seller's count-along, is grey English, device-spoken while testing (decision 84), until her one-to-ten clips land.
- **The X one:** big/small is **playable now** on the whole recorded lines *wadho ginech* / *nindho ginech* ("buy the big one" / "buy the small one"). They are one clip, *wadho ginech, nindho ginech*, to be cut in two at its pause; its note says *ginech* (spelling and meaning) is to confirm, so Zafar confirms that first (open question 7). At L2, "the big cup" is the ✓ line *wadho cup*, and "the small cup" is built by the engine from *nindho* ✓ and *cup* ✓. Pots, onions and eggs in a size ask wait for *wadho* alone.
- **Pay:** **lab-only in full.** No number has a clip, and *paisa* and the price line are to record. It runs with grey English while testing so Zafar can play it, and counts as teaching (the word ladder, the leak bot's pass) only once Mum's one-to-ten clips are in.
- **The cloth (round 3):** *laal* ✓ and *laal na* ✓. The other colours wait.
- **The gift and the shopkeeper's wave:** *khanigin* ("take one yourself") and *ghan* ("here you are") are engine drafts Mum never confirmed, so neither is said. The gift runs on a gesture and *shabash* ✓ until she records them.

**Mum's next sheet, top first** (decision 21): *wadho* alone; one to ten as clips, ten checked against the handout's *do*; *paisa* and the price line ("that's N paisa"), and "how much is it?"; *khanigin*; *ghan*; the join for a second row (Cook's open Q5); then eleven to twenty, *lilo* as a clip, blue and one more colour, the word for cloth and "the red one, for Big Ma". That is about **17 clips for visit 1's L1** and about 12 more when pay and the cloth reach L2. The tens (9 clips) and 21-99 (up to 72) are visits 2-4. Plus two cuts of clips she has already given (*wadho ginech, nindho ginech*; *hakro ambo, ba amba*), Zafar picking the takes as usual (`/mum-round`).

### The words around the moves (heard, not deciding)

| English | Kutchi | State |
|---|---|---|
| hello / hello back | *salamun alaykum* / *alaikum salaam* | ✓ |
| can you help me? | *tu muke help kar de* | ✓ |
| yes / no | *ha* / *na* | ✓ |
| I want X (the order frame) | *Muke {x} khape* | engine, from the recorded *Muke chai khapeti* and *Muke paani khapeto* |
| buy the big one, buy the small one | *wadho ginech, nindho ginech* | ✓ (one clip, to cut in two; *ginech* to confirm) |
| take the big one | *wadho khan* | engine (confirmed) |
| big or small? | *wadho ke nindho* | engine (confirmed) |
| the big mangoes or the small ones? | *wadha ke nindha amba* | engine (confirmed) |
| what would you like? (to a child / to an adult) | *toke kuro khapeto* / *anke kuro khapeto* | ✓ |
| how many? (how much?) | *kitla* | ✓ |
| which one? | *kyo* | ✓ |
| take one yourself | *khanigin* | engine (draft): not said until recorded |
| here you are | *ghan* | engine (draft): not said until recorded |
| not this one, that one | *hi na, hu* | engine (confirmed) |
| this is for Nana (the pattern for "this is for Ali", "for Big Ma") | *hi nana lai ai* | ✓ |
| just right! | *barabar* | ✓ |
| well done | *shabash* | ✓ |
| enough / more / a little / half | *bas* / *wadhare* / *thorok* / *ardo* | ✓ |
| you're welcome | *jara e wandho nai* | ✓ |
| oh no! | *oho* | heard (in *Oho, kenjo nai!*) |
| goat | *bakro / bakri* | ✓ line (*hakro bakro, ba bakra*; *Nani jo bakro*) |
| market | *bajaar* | engine (from the town map) |
| shop, the fruit stall, cloth, purse, coin, "how much is it?" | | to record |

### Verbs (top-40 tiers)

- **want** (verb 6): *khape*, the order frame. The shops are its home.
- **give** (20): *de* (heard in 18 lines); the give to the customer and to the seller's hand.
- **take** (16): *khan*, *khanigin* (engine); the gift and Nani's "take the big one".
- **buy / get** (4): *ginech* (✓ line in "buy the big one"; meaning to confirm).
- **help** (29): *help kar* (✓ in "can you help me?").
- **pay:** to record.

### Frames heard (built by the engine from recorded pieces; no hand-written fragments)

| ID | Frame | Who | Where |
|---|---|---|---|
| F1 | *Muke {thing} khape.* / *Muke {count thing} khape.* (the count from a ✓ line until the numbers are clipped) | each customer | serve |
| F2 | *Tu muke help kar de?* ✓ | the fruit seller | the start |
| F3 | L1: *Wadho ginech.* / *Nindho ginech.* ✓ (Nani to the child). L2+: *Muke {describing} {thing} khape.* (Nani to the shopkeeper) | Nani | the X one |
| F4 | *Khanigin.* (once recorded; a gesture until then) | the fruit seller with the gift tray; the shopkeeper | the gift, the X one |
| F5 | *Kitla?* ✓ then the price ("{N} paisa", to record) | Nani asks, the seller answers | pay |
| F6 | *Barabar!* ✓ | the seller at a right pay; Nani at a right pick | pay, the X one |
| F7 | *Toke kuro khapeto?* ✓ | the shopkeeper at the handover | your turn (L2+) |
| F8 | *Hi Ali lai ai.* / *Hi Big Ma lai ai.* (pattern ✓) | Nani | the gift, the cloth |
| F9 | the miss lines: the ask again; *hi na, hu* (engine, L3) | Nani, the customers | misses |
| F10 | *Kyo?* ✓ ("which one?") | Nani, when her basket is tapped with nothing in hand | the X one |

### Frames said (closed sets, pills always there)

| ID | Said | Closed set | First visit |
|---|---|---|---|
| S1 | *Alaikum salaam* ✓ | 3 replies (shared greeting) | tap at L1; say from L2 |
| S2 | *Ha* ✓ | yes / no | tap |
| S3 | *Muke {thing} khape*, then *Muke {describing} {thing} khape* | 3 that sound different | from L2 of the general store (rung 1, say after the model), as Find it's 3b |
| S5 | the colour (*laal* ✓ and two more once recorded) | 3 colours that sound different | the cloth from L2, once three colours are recorded |
| S4 | *Kitla?* ✓ (ask the price) | 2-3 questions | visit 2 |

### New words per round and level (first visit)

| When | New | Comes back |
|---|---|---|
| Round 1 (the fruit stall, L1) | 3-4: mango and two (*ba amba*), the price one to three, *kitla* | lemon (Cook), the salaam, *ha*, *shabash* |
| Round 2 (the general store opens, L1) | 3-4: big and small (*wadho ginech*, *nindho ginech*), pot, cup | everything in round 1 |
| Round 3 (the cloth on the shelf, L1) | 2-3: red (back from the clinic), "for Big Ma", the prices four and five | |
| L2 | 4-5: the noun with its size (*wadho cup*), "not the big one", the prices 6-20, *paisa*, your turn's order | everything at L1 |
| L3 | 3-4: the biggest / the smallest, the tens (20, 30 ... 100), corn | |
| L4 | 3-4: half, a little / more, the look-alikes, the numbers 21-99 as they come | |

That keeps each round to 3-5 new words, each heard at least three times (the order, the pick, the give; the price said, counted, counted back).

---

## 2. Where it sits in its day

**The day (town and shops, hosted by Nani, sunny):**

| # | Stage | What carries in or out |
|---|---|---|
| 1 | The door | Nani: "today we're going to town" (to record); *panke randhnu khapdo* ✓ ("we need to cook") gives the reason for the market. |
| 2 | Pack the bag | Nani's shopping bag and her purse go in. The purse is shown here first, so pay isn't a surprise. |
| 3 | The ride (the bus) | |
| 4 | The town map (`town-map.md`) | The family runs errands; it ends with Nani and the child walking into the market tile, and *bajaar* is heard. |
| 5 | **This game, visit 1.** Round 1: the fruit stall (serve, the gift, Nani's lemons and pay). Round 2 adds the general store (the X one and pay). Round 3 adds Big Ma's cloth from the store's shelf. Your turn joins at the store's L2. | The bag fills: the gift fruit for Ali, Nani's lemons, then the general store's things and the red cloth. |
| 6 | Home: put the shopping away (put it in its place) | Lemons and onions to the cupboard (*kabaat* ✓), the pot on the shelf; **the gift fruit to Ali**; **the cloth to Big Ma's room** (it seeds the sewing day). |
| 7 | The evening book | One page per stall played: the customer you served, the coins counted out, the big pot, the red cloth, the goat with the list in its mouth. |

**The lane (Zafar, 1 Nov: the lanes are introduced gently from the first visit, so getting about stays the same when the full lanes come on visit 2).** The walk from the fruit stall to the general store is one short first-person lane with one turning. The first time, Nani says the way ("this way!", to record) and the lit box shows the turning; from the second round she says which way (left or right, to record) and the child taps that way. The other way is a friendly dead end (a cat on a wall blinks, and back you come), never a miss. No maze and no goat chase on visit 1: the goat still eats the list at the end of the round, which sets up visit 2's chase.

**What it takes from earlier days:**
- Cook's food nouns (onion, lemon, tomato, cup, pot, spoons) and the order frame *Muke {x} khape*, heard dozens of times serving chai. That is why serving comes naturally first.
- The town map's "want" warm-up and *bajaar*.

**What it hands on:**
- **The sewing day:** the red cloth, and the colour and length words, start Big Ma's day. The sewing's "at the stall, from L2, the child says the colour" is this design's cloth L2 (S5), so the two are one stall.
- **The beach and the farm's corn stall:** they use this pay engine at their own levels (the beach's numbers stay at 1-5; the shops own everything above 20). **One pay (Zafar, 1 Nov): count out the coins and hand them over; ready-made stacks for small prices** (to five: the beach, and the shops' L1). One engine, not two (decision 9; `beach-boat.md` says the same).
- **Later shops visits:** the full lanes and the goat chase (met gently on visit 1), the cloth seller's own stall, the chai stall (§5; open questions 5-6).

**Free play:** each stall can be played alone (lab and free play): serve, Nani's picky shopping, or the cloth, each ending with its pay and the shared end screen.

---

## 3. The mini-games

### Shared rules for all five

1. **The heard word decides; rows tick only on a right first give.** A row never ticks after a second try.
2. **Counts never end by themselves; the give closes the step** (Zafar's one count close, 1 Nov: the natural next thing, here the give; where a count has no clear next thing, about 1.25 s after the last tap; one wording, coded once in the shared count).
   - Extra fruit land on the pan; extra coins land on the counter. The step closes only when the child taps the person: the customer's held-out bag, Nani's basket, the seller's open hand. That person can be tapped from the first item.
   - **The light on the person:** only on that screen's first-ever showing, it lights **the moment the first item lands** (the light says "this is where it goes", not "now") and stays lit until the give. It never lights at the count, and never lights again after the showing.
   - **A wrong give brings everything back.** Wrong kind, too many or too few: the pan tips back into its crate, the coins slide back into the purse, the thing goes back on the counter. The asker reacts (their own joke; for too few the seller's patient open hand and "and …?") and says the ask again, number and all. The row starts over from nothing; nothing is left on the counter for the child to finish.
   - **After the second wrong give in a row,** the helper card opens with the full answer (it costs the bulb), never a third blind try.
3. **The give is an action in the world, not a Done button.** There is no Next and no Done.
4. **Undo until the give:** tap a fruit on the pan, or the coins on the counter, to take the last one back.
   - **Moving up (Zafar, 1 Nov):** only right-first-time rounds count towards the next level, in every game.
5. **Two words a move from L2** (which and how many; which and what like). Pay is the exception: its one word is a number from a set of 20 to 100.
6. **Every miss gets a funny reaction,** never a frown, then the word again. Each stall has its own (the customers' three, Nani's monocle and stagger, the seller's patient hand, the bolt's *fwump*); more come with later pairs.
7. **Hints are one sequence with one owner, the central rules file.** The first hint, at 7 s from the last action (by level), **is the asker saying the ask again**; the next steps follow the rulebook up to the helper card, which opens with the full answer and costs the bulb. There is no separate idle repeat, so two voices never overlap. Listening again is free (tap the row's speaker).
8. **No timers.** Busy comes from people waiting (serve L4), never a clock.
9. **Nani pays, from her purse.** The child's pocket money is never spent, and the purse always holds more than needed.

### 3A. Serve: help at the fruit stall

**Why:** the child hears the order frame many times from the listener's side before using it (speaking.md's watch step), counts things into a real container, and watches every customer pay (pay's watch step). Serving is the first half of "shopkeeper, both ways".

**Camera:** E, from **behind** the counter (the seller's side). The counter runs along the bottom with crates of fruit and vegetables; the scale stands in the middle; customers come up on the far side, waist up, facing us. On visit 2 the same stall is seen from the customer's side, so the flip itself says "both ways"; on visit 1 the child's avatar walks round to the customer's side in the same view for Nani's buy (§4).

**Steps:**
1. The fruit seller greets: *salamun alaykum* ✓. The child taps (from L2 says) the reply: *alaikum salaam* ✓.
2. He asks *tu muke help kar de?* ✓. The child taps *ha* ✓. He hands over his scoop, and the child's avatar steps behind the counter. He sits on his stool at the right edge with his chai.
3. A customer walks up and orders (F1): *Muke ba amba khape.* The card pops up big, then flies into its row.
4. The child taps a mango. It hops onto the scale pan; the pan dips and the needle swings (the dial has no digits). At L1 the seller counts along as each lands (once Mum's one-to-ten clips are in; grey English until then).
5. The child taps the customer's held-out bag. The seller tips the pan in, twists the bag shut and hands it over. The customer beams and says *shabash* ✓. **The customer pays the seller, and at L1 he counts the coins aloud into his tin** (pay's watch step: by the time the child pays, they have heard a dozen counts). The row ticks.
6. A wrong give: everything back (rule 2). The pan tips back into the crate, the customer does their joke and orders again.
7. The next customer comes. After the last, the gift (3B).

**The five questions:**

| Q | Answer | Score |
|---|---|---|
| 1 Do | Tap a fruit (it hops onto the pan), tap the customer (give). Tap the pan to take one back. | 4 |
| 2 Challenge | Which kind and how many, from the heard order. L3 adds a size, L4 an amount. All recorded nouns. | 4 |
| 3 Fun | The pan bouncing, the needle swinging; each customer's own funny reaction to a wrong bag; serving like a grown-up. | 4 |
| 4 Instruction | The customer's own line (F1); the card; the seller's count at L1. Nouns ✓; counts only in ✓ lines until the numbers are clipped. | 3 |
| 5 Novel | The only place the child is the seller, from behind the counter, onto a scale. | 3 |
| | | **18** |

**The level ladder** (what repeats: fruit per order; most at L4: 6):

| Level | Adds | An order |
|---|---|---|
| L1 | One kind per order; the count is one (the bare noun) or two where a whole line has it (*ba amba* today; *ba* with every fruit once it is clipped); two crates (the asked kind and one clearly different kind, both piled high); 2 customers; the seller counts along. | *Muke limu khape.* / *Muke ba amba khape.* |
| L2 | Two rows per order (two kinds); counts to 5; three kinds on the stall; the count said only at the give (the seller counts the bag as he tips it); English on the card dotted. | *Muke trae dungri khape* … [the join: to record] … *char limu* (how Mum joins a second row is Cook's open Q5) |
| L3 | Other ways of saying it: a size word on a row (*wadha amba* ✓ line), the polite frame (*tu muke … de?*, built on ✓ *tu muke help kar de*, to confirm); four kinds; the card's picture blurred. | *Tu muke ba wadha amba de?* |
| L4 | Amounts and a look-alike: half a papaya or melon (*ardo* ✓), loose peas by the scoop with *thorok* / *wadhare* / *bas* ✓; onion beside potato (*trae bateta* ✓ line); **busy: two customers wait at once, the second standing behind the first and offset, and the one who speaks is the order**; 3 customers. The seller steps out to fetch more stock (his count-along ended at L1). | *Muke ardo papaya khape.* (papaya: to record) |

**The leak test:**
- **Reading:** past support, the row is a speaker only. Counts are words, never dots or a picture of N fruit. The dial has no digits.
- **Matching:** the card's picture is one fruit, never N copies; it fades by the word ladder. At L4 the look-alike (onion, potato) defeats a glance.
- **Eliminating:** any kind on the stall can be asked, including one just sold. The crates never empty and always hold more than any order.
- **Patterns:** customers, kinds, counts and the crates' places are drawn fresh every order. No kind is tied to a customer.
- **Waiting:** the pan never stops taking fruit; the bag is lit only on the first-ever showing, from the first fruit; the seller's count-along stops at L2.
- **The bot (learned save), three strategies:**
  - *Guess:* L1, kind 1 in 2 and count 1 in 2: 1 in 4 an order, about 6% for a two-order round. L2 and above: under 1%.
  - *Dump all, then give:* the crates always hold more than the order, so a dump is always too many, and everything comes back. 0%.
  - *Add one, give, add one, give:* everything comes back at each wrong give, so this only ever ticks when the count is one (the first give). At L1 that is 1 in 2 for the count, the same as a guess; from L2 (counts to 5) 1 in 5, under 1% a round with two rows; after the second wrong give the helper card opens and the row can't tick.

**The delight:** the pan and needle; the bag twist. The misses, one per customer: the aunty sniffs the onion she didn't ask for and sneezes; the boy juggles the extra mango and drops it back in the crate; the old man balances the mango on his cap and hands it back. Each then says the order again.

**Speaking:** none in the serve itself. The greeting reply (S1) is said from L2.

### 3B. The gift: take one yourself (a beat, ungraded)

After the last customer the seller says *shabash* ✓ and holds out a tray of fruit with a sweep of his hand ("take one yourself"; *khanigin* joins the gesture once Mum records it). The child taps any fruit; it's theirs. Nani says *hi Ali lai ai* (F8): it goes in the bag for Ali. Nothing is wrong here (Find it 3a's Pok Pok moment); it is the trip's thing for Ali. Once recorded, it teaches *khanigin* by doing, before the shopkeeper uses it.

### 3C. Nani's picky shopping: the X one (the describing game)

**Why:** Zafar's yes to one game where the describing word is the move. Every thing on the counter is the same noun, so only the describing word separates them (the research's cleanest leak-proof adjective game). And every family has a grandmother who squeezes the mangoes; here that is the game.

**Camera:** E, from the customer's side, horizon at about 55%: the general store's counter with shelves behind (the bazaar camera of the art bible), one shelf of upright bolts of cloth at the side. Things on the counter in F view.

**Steps:**
1. The shopkeeper greets Nani; Nani answers (the model of S1).
2. He sets out a pair, two of the same thing in two states (at L1 a big pot and a small pot), and waves at them (*khanigin* once recorded).
3. Nani turns to the child (F3): *wadho ginech* ("buy the big one"). The row card pops up: the pot's picture, always drawn at one neutral size, and the Kutchi.
4. The child taps a pot. **It lifts and is in hand:** shown slightly raised in the middle, it shows itself, Nani's way: the big pot wobbles heavily and thuds; the small one bounces. Later pairs have their own tests (below). **A lift is never a miss:** tap another and the first goes back down; tap the lifted one again to put it down.
5. The child taps Nani's basket to give **the thing in hand**. With nothing in hand, Nani asks *kyo?* ✓ ("which one?"); nothing is counted. A right one: she says *barabar!* ✓ and it goes in; the row ticks. A wrong one goes back on the counter with her joke and the ask again: given the small pot for the big, she holds it up to her eye like a monocle; given the big pot for the small, she staggers under it. After the second wrong give, the helper card.
6. **Restock:** after each give, the shopkeeper replaces the pair with a fresh one, so the one left behind never answers the next ask. The decoy (from L2) stays where it is.

**The pairs: only pairs where a real shopper wants either state.** Each needs both its words recorded before it runs outside the lab, and each joins by recording, not by level (decision 4):

| Pair | Things | Why either is wanted | Nani's test (the delight) | Words |
|---|---|---|---|---|
| big / small | pots, cups (L1 and L2 at the general store); onions and eggs once *wadho* is clipped | a big pot for the family, a small one for Nana's chai | the big one wobbles and thuds; the small one bounces | *wadho ginech* / *nindho ginech* ✓ lines, *wadho cup* ✓ line, *nindho* ✓: **visit 1** |
| soft / hard | mangoes in a crate (they look the same) | soft to eat today, hard for the pickle (the family's own cooking) | squeeze: a squish, or a wooden *tok* | to record: **visit 2** |
| green / yellow | bananas hung at the door | green for cooking, as East African kitchens do; yellow to eat | she holds one up to the light and nods | green *lilo* (engine), yellow to record: **visit 3** |
| hot / cold | water, in two lidded steel flasks that look the same until Nani lifts the lid (steam, or cold drops on the steel) | hot for Nana's chai, cold for the walk home | the lid off: a puff of steam and a happy "aah", or a shiver at the cold drops | *garam* ✓, *thundo* ✓, *paani* alone to record: **visit 3, at the chai stall** |
| the cloth: long / short, thick / thin, plain / dotted | bolts and cut pieces (3F) | | the unroll | §3F |

**Dropped from the X one:** full/empty (nobody buys the empty tin; "the empty one" belongs in Cook's pantry as a put-it-back ask, an idea for Zafar), old/new (nobody shops for the old one), ripe/not ripe (the bananas and mangoes above do it with a reason). Hot/cold leaves visit 1: it lives in Cook's chai, where "gone cold" is natural, and comes to the shops as water when the chai stall opens.

The reason for each state ("for the pickle", "for Nana's chai") is said only from L3, once recorded, and is **never pictured** (a picture of the pickle jar would settle the pick).

The child never touches anything hot: the flasks are tapped, and Nani lifts the lid.

**The five questions:**

| Q | Answer | Score |
|---|---|---|
| 1 Do | Tap a thing (it lifts and shows its test), tap Nani's basket (give). One gesture pair at every level. | 4 |
| 2 Challenge | The describing word alone decides between two of the same thing; from L2 the noun as well; at L3 three sizes; at L4 count and describing word. Hidden pairs (soft, hot) can only be settled by testing. | 5 |
| 3 Fun | Nani's tests and her comic wrong-one reactions; the wobble and the bounce; the restock pop. | 4 |
| 4 Instruction | Nani's line (F3), the card. Visit 1's pair runs on whole recorded lines; the rest wait on Mum. | 3 |
| 5 Novel | The only game where the describing word is the whole move, and the only one where you test a thing by touch to find out which it is. | 5 |
| | | **21** |

**The level ladder** (what repeats: asks; 4, 4, 5, 6):

| Level | Adds | An ask |
|---|---|---|
| L1 | One pair at a time (two of the same thing), **no decoy** (the ask has no noun, so a different thing would only blur "the big one"); big and small. Sizes at 1.25× and 0.8× (Find it's size rule). | *Wadho ginech.* |
| L2 | Two things in both states (four on the counter) plus one decoy: the noun and the describing word together; "no" asks, said last: *not the big one* (built on ✓ *laal na*, Mum to confirm); English on the card dotted. | *Muke wadho cup khape.* / *Muke wadho cup khape. Nindho na.* (*nindho* ✓ and *na* ✓; "not the big one" waits for *wadho* alone) |
| L3 | Other ways of saying it: three in a row (big, middle, small) with *wadho ma wadho* / *nindho ma nindho* (engine); *wadho ke nindho?* from the shopkeeper; *hi na, hu* as a request; the reason said; the picture blurred. | *Muke nindho ma nindho indo khape.* |
| L4 | Count and describing word (*ba nindha dungri*: two small onions); the look-alike pair *chamcho* / *chamchi* (the big spoon and the little spoon are their own words) carries the difficulty; **two decoys on every screen (six things)**. | *Muke ba nindha dungri khape.* |

**The leak test:**
- **Reading:** past support, rows are speaker only. The card's picture is one neutral size, never steaming, never soft or green. English placeholders would be a reader's win, so **a pair runs outside the lab only once both its words are recorded** (visit 1's big/small runs on whole recorded lines; nothing else does yet).
- **Matching:** the card picture never matches one state: no big picture for "big", no steam for "hot".
- **Eliminating:** the restock after every give puts both states back, so what's left never answers the next ask.
- **Patterns:** **both states of every pair are asked.** Which state is drawn fresh each ask (even odds, no alternation, no quota); left and right are shuffled; the pair rotates among things.
- **Waiting:** nothing lights the right one. The lift shows the test on whatever the child taps, right or wrong. The basket is lit only on the first-ever showing, from the first lift, until the give.
- **The bot (learned save):**
  - *Guess within the pair:* L1, 1 in 2 an ask, so 4 asks: about 6%. L2, 1 in 5 an ask (four things and a decoy): under 1%.
  - *Always the good one* (the big one, the soft one, the hot one): both states are asked at even odds, so 1 in 2 at L1, the same as a guess.
  - *Lift both, then give the last:* the lift shows the test, not the answer; still 1 in 2.

**The delight:** Nani as the picky shopper: the monocle pot, staggering under a too-big pot. The shopkeeper's restock, two new things popping up in a puff of dust.

**Speaking:** in 3D below. The shopkeeper's *wadho ke nindho?* (L3) is the cue for a later speaking level: the child answers *wadho* or *nindho* aloud (a closed set of 2 that sound different).

### 3D. Your turn: order it (the speaking handover), from L2; Check the bag from L3

**Why:** the second half of "shopkeeper, both ways": the child asks. It joins at the general store's L2, as Find it's 3b (Ask for one, L2+), so the child has first acted on the order as the listener several times (every customer at the fruit stall, Nani at the general store on earlier rounds, Cook's chai orders), as `speaking.md` asks.

**Steps:**
1. **The handover:** Nani turns and gives the child her purse. The shopkeeper turns to face the player and asks *toke kuro khapeto?* ✓ (F7).
2. A thought bubble shows what Nani needs: at L2 one thing (eggs); from L3 a pair with one glowing (the big onion of two).
3. The "your turn" bubble with the mic appears, with three pills underneath. At rung 1 the model line plays, written and underlined, and the child says it after. The pills always work; speaking is never a gate.
4. The shopkeeper cups his ear (big and comic), then hands over **exactly what he heard**. If he heard the small onion, a tiny onion arrives; Nani laughs and the child can say it again.
5. **Check the bag (from L3, Find it 5a):** the shopkeeper packs Nani's bag, lifting each thing and naming it with its describing word (*wadho cup … nindho cup*). One is wrong: in his hands (the small cup when he says big) or, from L4, in his words. The child taps the wrong one; he looks, swaps it and says it right. The first time it runs he makes no mistake.

**The five questions:**

| Q | Answer | Score |
|---|---|---|
| 1 Do | Say it (or tap a pill); from L3 tap the wrong thing in the bag. | 3 |
| 2 Challenge | Producing the noun, then the noun with its describing word; catching a wrong word against what you see. | 4 |
| 3 Fun | The ear-cupping; what you said is what you get (a giant onion); catching the shopkeeper out. | 4 |
| 4 Instruction | F7 ✓; the model line on the pill's speaker; the thought bubble. | 4 |
| 5 Novel | The child does Nani's job; Check the bag is the only "catch someone else's mistake" in the game. | 3 |
| | | **18** |

**The level ladder:**

| Level | Adds |
|---|---|
| L1 | Not played: the child watches Nani order. |
| L2 | One thing, the noun only, rung 1 (say after the model); pills of three nouns that sound different (*indo*, *limu*, *tapelo*). |
| L3 | The noun with its describing word (*Muke wadho cup khape*); rung 2 (the model on tap only); Check the bag with 4 things, one wrong in his hands. |
| L4 | The describing word answers his question (*wadho ke nindho?* → *wadho*); two things in one order; rows as speakers only; Check the bag's mistake may be in his words or a count (*ba* said, three in his hand). |

**The leak test:** speaking is production, so the Sceptic's way in is the pills: they complete the step but **never earn the speaking bonus**. Check the bag: one wrong of four, packed at both buying stalls once the cloth is open, so a random tap wins both about 6% of the time; the wrong one is always the same kind of thing in the other state, never the odd one out.

### 3E. Pay: every number up to 100

**Why:** Zafar, 1 Nov: paying climbs to every number up to 100 as the levels rise. It is the home of the numbers above ten and of "give me N", the standard test of what a number word means.

**The money:** two coins only, with no digits. **A small copper coin is one; a big brass coin is ten.** The ten is taught by the shopkeeper's trick (below), never by a label. **Nani's purse holds two piles**, copper and brass; one tap on a pile slides one coin out. **At L1 (prices to five) it holds ready-made copper stacks of one to five instead** (Zafar, 1 Nov: stacks for small prices): one tap on the stack of the price slides it onto the counter, and the give is the same tap on the open hand. The piles always hold more than the price and are drawn as heaps, never as countable rows.

**The watch step:** at serve L1 every customer pays the fruit seller, and he counts their coins aloud into his tin (§3A step 5). The child has heard the counts, and seen the open hand and the tin, many times before paying.

**Steps:**
1. Nani asks *kitla?* ✓ (F5). The seller says the price (to record), once, then again if asked (tap his face).
2. Nani's purse opens on the counter with its piles.
3. The child taps a pile. Each tap slides one coin onto the counter with a clink. **Counted coins land in two short rows, brass above copper,** each row with a small gap after five (so nine and nine fit any screen, and the rows show the tens). At L1 the seller counts along as they land.
4. Tap a row to take its last coin back.
5. The child taps the seller's open hand. It has been open since step 1; on the first-ever showing it lights as the first coin lands and stays lit until the give, and never otherwise. He scoops the coins and counts them aloud into his tin: the count-back is the check.
6. Right: *barabar!* ✓, the tin dings, the row ticks. **Wrong (too few or too many): every coin slides back into the purse** while he says the price again; too few gets his patient open hand and a raised eyebrow ("and …?"), too many a chuckle and a shake of the head. The child counts from nothing. After the second wrong give, the helper card (rule 2).

**The ten-coin trick (the showing at L2, once):** the seller counts ten small coins into a line, sweeps them together, and they jump into one big brass coin with a *ting*. He holds it up and says ten. **Lab-only until Mum's clip of ten:** *do* is a class-handout draft never confirmed by Mum, and *do* is also "two" in the Hindi and Urdu around the children, next to Kutchi *ba* (two); her clip of ten gates pay's L2 (open question 1). Later, when the helper card opens, it shows the price as that many big and small coins.

**The five questions:**

| Q | Answer | Score |
|---|---|---|
| 1 Do | Tap a pile to slide a coin, tap the hand to give. Tap a row for a coin back. One gesture at every level. | 4 |
| 2 Challenge | The number word alone decides; 5 choices at L1, 100 by L4; tens and ones at L4. | 5 |
| 3 Fun | The clink, the scoop and count-back, the tin's ding; the ten-coin trick. | 3 |
| 4 Instruction | *Kitla* ✓ and the price, which is to record; the numbers need clips. | 2 |
| 5 Novel | The only home of the tens and of numbers above 20; money as a quantity. | 4 |
| | | **18** |

**The level ladder:**

| Level | Prices | The purse | Adds |
|---|---|---|---|
| L1 | 1-5 (the first-ever pay: 1-3) | ready-made copper stacks of one to five | pick the stack of the price, hand it over; the seller counts along as the coins land |
| L2 | 6-20 | both piles | the ten-coin (the trick, once, after Mum's clip of ten); counted only at the give |
| L3 | the tens: 10, 20 … 100 | both piles | the tens as words of their own; "other ways": the price said as "{N} paisa" or the number alone |
| L4 | any number 21-99 | both piles | tens and ones together (73 is seven brass and three copper, in the two rows); **one price per stall** (two prices is twenty taps); look-alike numbers next to each other in a round (which ones sound alike: Mum) |

Change from a bigger coin is visit 2 (§5).

**The leak test:**
- **Reading:** no digits on coins, purse, tin or card. Past support the price row is a speaker only. While a number is to record its grey English would be a reader's win, so **each price level runs outside the lab only once its numbers are recorded**.
- **Matching:** the card never shows N dots or N coins (only the bulb's helper card does, and it costs the bulb).
- **Eliminating:** the piles always hold more than the price, and every coin can go out.
- **Patterns:** prices are drawn fresh from the level's range; a price is never tied to a thing (lemons don't always cost three).
- **Waiting:** the coins never stop going out, the hand is lit only on the first-ever showing (from the first coin), and from L2 nothing is counted until the give.
- **The bot (learned save), three strategies:**
  - *Guess:* L1, 1 in 5 a pay; one pay on round 1, two from round 3: 4%. L2, 1 in 15: under 1%.
  - *Dump all, then give:* the piles always hold more than the price, so a dump is always too many, and every coin comes back. 0%.
  - *Add one, give:* every coin comes back at each wrong give, so this ticks only when the price is one: 1 in 5 at L1 (no better than a guess), never from L2 (prices start at 6). After the second wrong give the helper card opens.

**The delight:** the seller's count-back, flicking each coin into the tin with a little rhythm; the ding; the ten-coin trick. A short pay gets his patient open hand and a raised eyebrow, never a frown.

**Speaking:** none on visit 1. Visit 2: the child asks *kitla?* (S4) and the price is hidden until asked: the only "ask to find out" in the market.

### 3F. Big Ma's cloth (the X one, the cloth skin), from round 3

**Why:** the sewing takes its cloth from the shops (Zafar). It is the X one with cloth: colour first, then length and thickness. On visit 1 the bolts stand on the **general store's shelf** and the shopkeeper sells them (decision 3; open question 6 asks Zafar); the cloth seller's own stall comes on visit 2.

**Camera:** the general store's camera; the cloth shelf at the side of the shelves behind the counter.

**Steps:** Nani says what Big Ma wants: "the red one, for Big Ma" (built from *laal* ✓ and the ✓ *lai* pattern; the word for cloth is to record, so the line is to record as a whole). The child taps a bolt: the shopkeeper flings it across the counter and it unrolls with a whoosh. Tap Nani's bag to give. Right: he snips it and folds it, and Nani: *hi Big Ma lai ai* (F8). Wrong: the bolt rolls itself back up with a comic *fwump*, and Nani says the colour again. Then pay (3E) and, from L3, Check the bag.

**From L2 the child says the colour** (S5, a closed set of three colours that sound different, pills always there) once three colours are recorded. That is the sewing design's "at the stall, from L2", so the shops' cloth and the sewing's stall are one.

**The five questions:** Do 4 (the fling and unroll), Challenge 4 (colour, then colour and length), Fun 4, Instruction 2 (only red is recorded), Novel 3 (a skin of 3C, with its own word set and the thing that carries into another day). **17.**

**The level ladder:**

| Level | Adds |
|---|---|
| L1 | Three bolts of different colours; "the red one" ✓; one ask. |
| L2 | *Laal na* ✓ ("not the red one"), green (*lilo*, once clipped) and the other colours as they're recorded; the child says the colour (S5); plain and dotted in the same colour (both wanted: plain for a kameez, dotted for a dress). |
| L3 | Long or short piece (to record): the shopkeeper holds up two cut pieces (a long one for a kameez, a short one for a cushion); thick or thin (*jadi* heard in *jadi maani banai*; thin to record). |
| L4 | Colour and length together, with a look-alike (two reds, plain and dotted). |

**The leak test:** as 3C. Reading: colours are words only; no swatch on the card past support. Eliminating: the bolts are reshuffled after each give, and the red one is on the shelf in every round whether asked or not. Patterns: every colour and both states of every pair are asked. Waiting: nothing glows. Bot: L1, 1 in 3 for the pick and 1 in 5 for its pay: about 7% for the stall.

**The delight:** the fling and the unroll right across the counter; the snip.

### The goat (visit 1's surprise, no game)

At the end of the round, as Nani and the child turn to leave, a goat trots past, snatches Nani's shopping list off the top of the bag and munches it. Nani laughs: *oho!* (heard; the line to cut or record). Nothing is lost that mattered. It is the joke the child retells in the book, and it sets up the goat chase in Zafar's 19 Oct design (the chase is visit 2's; the lanes are met gently on visit 1: decision 28). The farm's goat sprite is reused if the camera matches.

### Considered and parked

- **Bargaining:** rejected again (Find it rejected it; a haggle needs a "no" verdict and an English-like price game).
- **Sort by the describing word into two baskets:** leaks unless things vary two ways; 3C's L2 does the same job.
- **The child takes the customers' money in serve:** good, but a fourth job on visit 1. It becomes visit 2's "take the money" (§5).
- **Hot and cold samosas, full/empty tins, old/new rolling pins:** dropped from the X one: nobody asks for a cold samosa, an empty tin or an old rolling pin, so only one state would ever be asked, and a child would win by picking the steaming, heavy or shiny one (§12, finding 1).
- **The chai stall** (shops.md #10) and **the toy stall's kite:** open question 5.

---

## 4. The child's first-ever round, screen by screen

The town map has just ended at the market tile. Each new screen has its showing (one lit box with a breathing gold glow; everything else dimmed and inert; no finger, nothing flying into place). **The first-ever round is one stall and one small pay:** three things to learn (serve, the gift, pay), about ten screens, 3-4 new words.

1. **The fruit stall, from behind the counter.** The view settles; nothing moves. The fruit seller (three-quarter on) says *salamun alaykum* ✓. One lit box: the reply pill, *alaikum salaam* ✓ with its speaker. The child taps it; the avatar's bubble says it in Mum's voice.
2. **The help.** He asks *tu muke help kar de?* ✓. The lit box moves to *ha* ✓. Tap: he hands over his scoop and goes to sit with his chai at the right edge.
3. **What isn't on the card.** The two crates (lemons, mangoes) bounce once each. No tap.
4. **Customer 1.** An aunty walks up and says *Muke limu khape.* Her card pops up big beside the side panel (picture, Kutchi, English at L1), then flies into its row. A pause of a few seconds.
5. **The tap.** The lemons glow. Tap: a lemon hops onto the pan, the pan dips, the needle swings. **As it lands, the light moves to the aunty's held-out bag** ("it goes here") and stays until the give. Tap: he tips the pan in, twists the bag, she beams, *shabash* ✓, and pays him; he counts her coins into his tin. Her row ticks.
6. **Customer 2, no showing.** A boy: *Muke ba amba khape.* The child taps two mangoes and the boy's bag. Given one, or a lemon: the pan tips back into the crate, he juggles the wrong one and orders again; nothing is left to finish. Tick on a right first give. He pays; the seller counts.
7. **The gift.** *Shabash!* The seller holds out a tray with a sweep of his hand. The child taps any fruit. Nani: *hi Ali lai ai*. It drops in her bag.
8. **Nani's buy.** The seller takes back his scoop with a wink, and the child's avatar walks round the counter to stand beside Nani on the customer's side (the same view: he now stands three-quarter on at the right, facing them). Nani: *Muke limu khape*. He bags the lemons himself.
9. **Pay (the showing).** Nani: *kitla?* ✓. He says the price (one to three; grey English, device-spoken, until Mum's clips). Nani's purse opens on the counter: one copper pile. Showing: the pile glows. Each tap slides a coin onto the counter as he counts along. **As the first coin lands, his open hand lights** and stays lit. Tap: he scoops them, counts them back into his tin, *barabar!*, ding. Tick.
10. **The end, served.** He hands Nani and the child a slice of mango each across the counter: "aah". As they turn to go, the goat trots past, takes the list from the bag and munches it; Nani laughs, *oho!* Then the word card, and in free play the shared two-page end screen (the badges, then the words heard, Kutchi with English under it for the grown-ups). In story mode the day moves on to home.

It ends where it began, at the fruit stall, and the avatar on the customer's side says "both ways" one more time.

**Round 2** adds the general store after the gift: the short lane (§2; decision 28), the X one at L1 with its showing (the pots glow; the basket lights at the first lift and stays lit until the give), four asks (big and small, pots then cups), and the store's pay (no showing). Nani's buy at the fruit stall moves to the store. The round ends back at the fruit stall with the mango slice and the goat.

**Round 3** adds Big Ma's cloth at the general store, with its showing (the bolts glow; the bag lights as the first bolt unrolls), and its pay.

**Your turn** joins the first time the general store reaches L2, with its own showing (the handover, the bubble, the mic).

**Progress, never verdicts:** the rows tick in the side panel; each stall's thumbs-up as the camera leaves it.

---

## 5. Later visits and harder versions

The day is data: each visit is the same list with stages added and levels raised. This assumes open questions 5-6 go as recommended; each answer moves its row. The lanes are settled (decision 28).

| Visit | Adds | New engine |
|---|---|---|
| 2 | **The full lanes and the goat chase** (Zafar's 19 Oct design, kept whole; the lanes met gently on visit 1, decision 28): the goat steals the bunch of bananas from the bag, and people along the lanes say which way it went; the child follows the words through the first-person lanes. Its own design is to come. **The cloth seller's own stall** (the cloth moves off the general store's shelf). The fruit stall from the customer's side (order there too). Soft/hard mangoes. **Ask the price** (the child says *kitla?*, the price is hidden until asked); **change** from a big coin, with **Check his change** (he gives change and says it; one coin too few); **take the money** in serve (the customer pays the child, who counts it into the tin). | the lanes (one per trip) |
| 3 | Green/yellow bananas; the chai stall (Cook's chai tray reskin) with **hot and cold water** in the flasks; two lists (Nani's and Big Ma's, Find it 1b); the toy stall (the kite, if Zafar un-parks it at the beach). | none |
| 4 | Every number to 100 everywhere in pay; the busy market (two customers at serve L4 on every stall); grandparent mode (idea 46: a grown-up plays the shopkeeper and the child orders from them). | none |

---

## 6. What it reuses and what is new

### Reused (built or designed)

| Piece | From | Used for |
|---|---|---|
| Tap the named thing, the size rule and decoy rule | `js/find/games/whichone.js`, `js/shared/whichone.js`, `js/find/mechanics/spot.js` | serve's crates, the X one, the cloth |
| The greeting reply | `js/find/mechanics/greet.js`, `js/shared/conversations.js` | the salaam at each stall |
| Check the bag | `js/find/mechanics/bag.js` (Find it 5a) | 3D from L3 |
| The speaking moment | `js/find/mechanics/tell.js`, `js/shared/say.js`, `js/shared/speech.js` (closed set) | 3D, the cloth's colour |
| Count into a container | `js/cook/mechanics/count.js` | the scale pan; the coins on the counter. The wrong-give rule (everything back, the ask again, the helper card after the second) is coded once here and shared with the farm's eggs. |
| The give (tap the thing, tap the person) | the shared give-to (party-gifts design); the farm's "the give closes a count" | serve, the X one, pay |
| Order card, request pop-up, guide, bulb, word card, showing, focus, results, rules | `js/shared/order-card.js`, `request-popup.js`, `guide.js`, `bulb.js`, `word-card.js`, `onboard.js`, `focus.js`, `results.js`, `rules.js` | everywhere; the hint sequence (the ask again as the first hint) lives in the rules file |
| The leak bot pattern | `js/find/bot.js`, `js/find/blind.js`, `build/leak_find.mjs` | a shops bot per mini-game, with the guess, dump-all, add-one and always-the-good-one strategies |
| Find it's shop data | `data/find.json` (the shops skin, 1a-6a) | words and rows to start from |
| Fruit and vegetable crates | `sources/art/pantry-v2/pantry-v2-sheet6-fruit-crates.png` and the pantry's F view | serve's crates |
| Customers | the clinic's waiting-room people and Cook's customers sheet (E, waist up) | serve's customers |
| Nani's poses | `sources/art/s09b/n1-`, `n2-nani-door-poses-v1.png` | where they fit |
| Put it in its place | its engine (the shopping put away; another stage) | home |

### New

| Piece | Size | Notes |
|---|---|---|
| **Pay** (shared engine) | about one sprint | the purse with two piles, two coins, the two counted rows, the open hand, the count-back, the ten-coin trick, price ranges as data. **One pay (Zafar, 1 Nov): count out the coins and hand them over, with ready-made stacks for small prices** (the shops' L1 and the beach); one engine, and the farm's corn stall uses it too (decision 9). |
| The scale (pan and dial) | small | Find it 5c, designed, not built; a needle layer and a pan that dips per item and tips back. |
| The lift-and-test | small | a thing lifts to the middle, is "in hand", and plays its state's reaction. Visit 1 has one reaction pair (the wobble-and-thud, the bounce), done in code; later pairs bring their own (the squish, the steam: steam is drawn, not coded). |
| The restock | tiny | a fresh pair after each give; the decoy stays. |
| The goat beat | tiny | an animated cut-out across the stall. |
| The shops data | small | `data/shops.json`: stalls, things in each state, pairs and the recording each needs, price ranges by level, which round opens which stall. |

---

## 7. The art and the layout

### Camera

- **Serve:** E, from behind the fruit stall's counter, horizon at about 55%. Counter and crates across the bottom; the scale centre; customers across the counter, waist up.
- **The general store (and its cloth shelf):** E from the customer's side, the art bible's bazaar camera: one long counter, shelves behind with one shelf of upright bolts, things in F view (shared with the pantry where they exist).
- **Coins and the purse:** F view on the counter, at the same scale as the store's things.
- **Light:** day, sun from the upper left. One lighting state.

### The art list, visit 1 (one ChatGPT run Zafar supervises; backgrounds locked first)

**Backgrounds (3):** the fruit stall from behind the counter; the general store from the customer's side, with a shelf of bolts of cloth; one short lane with one turning between them (decision 28), the lane engine's first piece. Calm, modern market with one or two Kutch or East African nods per scene (a mirror-work trim on a shelf edge, a brass weighing scale). No signs, no lettering, no religious markers.

**People:**
- New (2): the fruit seller (a man in his fifties, apron, cap; check the existing fruit-seller art the day doc lists first) and the general store's shopkeeper (a man in a waistcoat). Each in the art bible's set: neutral, talking, smile, big happy, thinking, surprised, the gentle "tsk", plus three-quarter and front-facing (the handover). The shopkeeper also cups his ear, waves, holds out his open hand and flings a bolt.
- Reused: three customers (an aunty, a boy, an old man) from the waiting room or Cook's sheet.
- Nani, new poses (4): holding her basket; the monocle (a small thing held to her eye); staggering under something big; handing over the purse.

**Things (F view), about 15:** lemons, mangoes, onions, tomatoes (the pantry's crates and F view first; check before redrawing), pots big and small, cups big and small, eggs, spoons (big and little, for L4), bolts of cloth (red, green, blue, a dotted red), a cut folded piece.

**Props, about 10:** the scale (pan, body and a separate needle), the paper bag and its twisted top, Nani's basket (front and back for things to sit inside), Nani's purse (open with two piles, open with ready-made copper stacks of one to five, and closed), the small copper coin, the big brass coin (no digits, no faces, no script; a simple stamped flower or rim), the seller's tin box, the scoop, the shopping list (blank lines, no writing), the goat (reuse the farm's).

**Later visits (not in the first run):** the cloth seller and her stall; the full lanes and their junctions; the fruit stall from the customer's side; mangoes soft and hard (one look, with a squish frame); bananas green and yellow; two lidded steel flasks, with a steam layer and a cold-drops layer; Nani's squeeze, sniff and lid-lift poses; the chai stall.

### Layout (two layouts, switched by height), with the pixel budget

**The play area** (beside the side panel, from `data/layout.json`'s sidebar rule; the lab measures the real numbers):

| Screen | Side panel | Play area |
|---|---|---|
| 740x320 | about 200 | **about 540 x 320** (the narrowest) |
| 915x275 (Zafar's phone) | about 260 (its max) | **about 655 x 275** (the shortest) |
| 930x430 | about 200 | about 730 x 430 |
| 1280x665 | about 245 | about 1035 x 665 |
| 1920x1080 | 360 | about 1560 x 1080 |

**The rules every layout keeps:** the counter band is the bottom 45% of the play area (124 px at 275, 144 at 320); things on the counter at least 70 px tall; faces in the top half, never under a bubble, a thing or the side panel; bubbles in the free space above the counter. Every tap target is at least 44 px even when its picture is smaller (a counted row of coins is one target). Big screens show more market behind and to the sides, at the same proportions. **The same counts on every screen** (fairness and the leak bot): when a layout doesn't fit, the design changes, not the count on phones.

**Each busiest layout, budgeted against 540 wide and 275 tall:**

| Layout | Across the counter band | Width | Height | Above the band |
|---|---|---|---|---|
| Serve L4 | four crates (80 each, 8 apart) and the scale (90, 12 apart) | 446 ≤ 540 | crates 70 ≤ 124 | two waist-up customers right of centre, the second behind the first and offset left (about 150 for both); the seller has stepped out for stock |
| Serve L1-L3 | two to four crates and the scale | ≤ 446 | 70 | one customer right of centre; the seller on his stool at the right edge (about 70) |
| The X one L4 | six things on a two-step display: three in front, three on a low riser 45 px behind (3 × 70 + 2 × 12) | 234, plus Nani 130 on the right: about 400 ≤ 540 | 70 + 45 = 115 ≤ 124 | the shopkeeper centre-back, his face above the riser row; Nani's face on the right |
| The X one L1-L3 | two to five things in one row | ≤ 5 × 70 + 4 × 12 = 398, plus Nani 130: ≤ 528 | 70 | as L4 |
| Pay L4 | the purse with its two piles (100), the two counted rows (brass coins 40 px, fanned at 24 px with a gap after five: 258; copper 30 px fanned at 18: 196), the open hand (90) | 100 + 16 + 258 + 16 + 90 = 480 ≤ 540 | rows 40 + 8 + 30 = 78 ≤ 124 | the seller's face right of centre, above his hand |
| The cloth | three bolts on the back shelf (60 x 100 each), above the band to the side; the unroll runs along the band | | | the shopkeeper centre; Nani right |

The lab films each of these at the four sizes and 915x275 and confirms the numbers before anything is built on them.

---

## 8. What it borrows from other games

- **Toca Store:** the customer's wallet of ten coins, counted out at the till; playing both shopkeeper and customer. Ours: the price is only heard, and Nani's purse always holds more.
- **Dr. Panda Restaurant and Supermarket:** serving a queue of customers who react. Ours: their order is in Kutchi and their reaction to a wrong bag is a joke.
- **Dr. Panda's weigh step** (Find it 5c's source): the pan and dial.
- **Toca Kitchen 2 / Toca Life:** things that react to a tap. Ours: the lift-and-test, where the reaction tells you the state.
- **Montessori's bank game** (golden beads: ten units make a ten-bar): the ten-coin trick, and the two counted rows (tens above ones).
- **Pok Pok:** an ungraded "anything you pick is right" moment: the gift tray.
- **Find it's own designs:** *khanigin*, Which one?, Ask for one (L2+), Check the bag, You're Nani.
- **Real life:** a grandmother squeezing mangoes, and choosing hard ones for the pickle.

---

## 9. The lessons checklist

| Group | Verdict |
|---|---|
| **1. The heard word decides** | **Pass for serve and the X one; pay is lab-only in full.** Leak tests written for every mini-game (§3), with the dump-all, add-one and always-the-good-one bots. Deciding words named and counted with ✓ only: 14 of about 43 have Mum's own clip, 7 more play inside whole lines. Rows tick only on a right first give; a wrong give brings everything back. Needs the picture can't settle: the card shows one neutral size; both states of every pair are asked. Two words a move from L2. **Pay** teaches only once Mum records one to ten (and *paisa*, the price line); until then it runs on grey English while testing, and none of it counts. |
| **2. Onboarding and the first round** | **Pass.** The first-ever round is one stall and one small pay (§4): about ten screens, three things to learn, 3-4 new words. The general store opens on round 2, the cloth on round 3, speaking at L2. One lit box, no finger, nothing flying into place. What isn't on the card is shown at the start (the crates). Each new screen has its showing; the person's light means "it goes here" (lit from the first item), never "now". Tap then tap; no drags. |
| **3. Instructions** | **Pass.** The asker is on screen and speaks before the card appears; cards pop, then fly into rows. The card never changes. The helper card holds the full answer. Model then ask: customers and Nani order many times before the child does. One line per moment. Listening again is free. |
| **4. Pacing and waiting** | **Pass.** No Next and no Done: the give is an action. Counts never end by themselves. Taps skip speech. Hints at 7-13 s, the first being the ask again, one sequence in the rules file, so voices never overlap. No timers. |
| **5. Feedback and the end** | **Pass.** A wrong give: everything back, the asker's joke, the ask again, the row from nothing; the helper card after the second. Undo until the give. Every stall has its own funny reactions (the sneeze, the juggle, the monocle, the stagger, the bolt's *fwump*, the patient hand). Rows tick when the step closes. It ends where it began, at the fruit stall, with a slice of mango ("aah"), then the word card and the shared end screen. |
| **6. Layout** | **Pass on paper, to film in the lab.** The pixel budget for each busiest layout is in §7, against the narrowest (540) and shortest (275) play areas: serve's second customer behind the first, the X one's six things on a two-step display, pay's coins in two short rows. Faces clear; bubbles in free space; things at least 70 px on phones; cards on the left, people in the middle and on the right; the same counts on every screen; the cog the only button. |
| **7. Art and camera** | **Pass.** One camera per scene (E, behind the counter for serve, the customer's side at the store). Nothing drawn in code except visit 1's wobble and bounce; steam and coins are art. Contact shadows on the counter. Calm faces. One paste block; two backgrounds on visit 1. |
| **8. Speaking** | **Pass.** From L2 only, inside the ordering exchange the child has acted on as the listener several times (Find it's 3b, `speaking.md`). Closed set of 3, pills always there, never a gate. The shared mic and "your turn" bubble. One shared "say it" moment; no quiz. |
| **9. Levels** | **Pass, with the rulebook adapted per game** (written in the ladders): L1 one thing (the X one's L1 has no decoy, since its ask has no noun); L2 numbers, "no" said last, English dotted; L3 other ways of saying it; L4 amounts and a look-alike. Serve has no "no" asks (unnatural in an order; decision 17). Each L4 is its own (the busy queue, the spoon look-alike, tens and ones at one price a stall). |
| **10. Words and recording** | **Pass, with the recording as the gate.** Every line built from recorded frames or played as a whole recorded line; the gaps listed (§1) with Mum's next sheet in order. One sentence per person. Things named as they are, and every pair is one a real shopper wants both ways. 3-5 new words a round. Visit 1's L1 needs about 17 new clips (the template proposes 15-25); the whole game about 110. |
| **11. Culture** | **Pass.** Halal food only. No sweets: no sweet stall; the gift and the end are fruit. Modest clothes for every seller and customer. No religious markers on stalls. Nothing hot is touched by the child. No haggling, nothing lost, Nani pays. |
| **12. Fun and delight** | **Pass.** The hands have something at every step (tap, lift, give, coins). The "kind of funny": Nani's picky tests and the goat. Good gestures: the pan dip, the unroll, the coin clink. Contrast is the game itself. No fatigue: serve, pick, say, pay and unroll are different actions, and L4 pays one price a stall. Nani's asks give it a goal; the cloth and the gift carry on. |
| **13. Mistakes made twice** | **Pass.** The wrong-give rule (the redo on the spot, a plain tick) is shared with the farm; the close itself is the farm's option (b), not its stillness close, and one count close for every game is Zafar's single answer (decision 8). One pay engine (the beach's stacks are its skin). Every level and size to be played in the lab, on film. Builder questions answered (what is in hand, an empty give, what restocks). No mechanic replaced without asking: the lanes and the chase are decision 28 (Zafar, 1 Nov); the cloth stall and the chai stall are open questions 5-6. |

**The ten questions:**
1. Nouns, describing words, colours and numbers; 14 of about 43 with Mum's own clip, 7 more in whole lines (numbers are the gap).
2. At L2 the Sceptic guesses: under 1% at serve, the X one and pay; dump-all scores 0, add-one no better than a guess; the restock, the full piles and the unlit give block elimination and waiting.
3. The card's neutral picture can't say big or soft; the mangoes and flasks look the same until tested; both states are asked.
4. The reply pill, *ha*, the crates, the lemons, the bag, the purse's pile, the hand; later the pots, the basket, the bolts.
5. The customers (F1), Nani (F3, F10), the shopkeeper (F7), the seller (F5); all built from recorded pieces or whole recorded lines.
6. Tap a fruit, tap a bag; tap a pile, tap a hand; later tap a thing, tap the basket; say it; tap a bolt.
7. Nani's monocle pot and her stagger; the goat with the list.
8. Back at the fruit stall with a mango slice; the gift, and later the cloth, go home.
9. Serve: kinds, counts, sizes, amounts and the queue. The X one: pairs, nouns, three sizes, counts. Pay: 5, 20, the tens, 100. Each L4 has its own new thing.
10. Designed for all five sizes with a pixel budget; one camera per scene, real art.

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, why, and the answer I assumed. Reverse any by number. (Revised after the critique; the old 12 and 25 became open questions 4 and 5; Zafar answered 4, the lanes, on 1 Nov: decision 28.)

1. **The game is five parts at two stalls on visit 1:** serve (the fruit stall), the X one and your turn (the general store), pay (after each buy), Big Ma's cloth (from the general store's shelf). Plus three beats: the salaam, the gift, the goat. *Why:* his scope (serve then order, pay, the describing game, the cloth) in the fewest scenes. *Assumed:* yes (the cloth's place is open question 6).
2. **Serve first, from behind the fruit stall's counter; then order at the general store.** *Why:* his "serve, then order"; the child hears the order frame many times before saying it. *Assumed:* yes.
3. **The describing game is "Nani's picky shopping" at a general store,** one stall that can hold every pair, with the cloth shelf beside it. *Why:* he said "at a market stall"; a fruit stall can't do pots and cups. *Assumed:* yes.
4. **The pairs come by recording, not by level, and only pairs a shopper wants both ways:** big/small on visit 1 (whole recorded lines), soft/hard mangoes on visit 2, green/yellow bananas and hot/cold water (at the chai stall) on visit 3, colour, length, thickness and pattern at the cloth. Full/empty, old/new and ripe are dropped; hot and cold samosas are dropped. *Why:* a pair where only one state is ever wanted leaks by pattern or makes Nani ask for a cold samosa; English placeholders are a reader's win. Hot and cold stay in the game, as his 1 Nov example asked, but as water. *Assumed:* yes.
5. **Tap lifts the thing into your hand and shows its test; tap Nani's basket gives what is in hand; a lift is never a miss; an empty give gets *kyo?*; the restock replaces the pair, not the decoy.** *Why:* the hidden pairs need a way to find out; testing is the fun; only the give is judged. *Assumed:* yes.
6. **The pay ladder:** L1 1-5 (the first pay 1-3), L2 6-20, L3 the tens to 100, L4 every number 21-99, one price per stall. *Why:* his "every number up to 100 as the levels rise", with the tens given their own level; two prices at L4 is twenty taps. *Assumed:* yes.
7. **Two coins only, copper one and brass ten, no digits, in two piles in the purse; counted coins land in two short rows, tens above ones; the ten taught by the shopkeeper's trick.** *Why:* the price stays heard; 73 becomes seven and three; nine and nine fit any phone. *Assumed:* yes (open question 3 asks about notes).
8. **Counts never end by themselves; the give closes; a wrong give brings everything back with the ask again; the helper card after the second wrong give; the person is lit only on the first showing, from the first item.** *Why:* the lessons' "stop at N needs redesigning"; a dump-all must never finish a count. Zafar settled it on 1 Nov: one count close for every game, the natural next thing (here the give) where it is clear, else about 1.25 s of stillness (one data setting).
9. **One pay for every game (Zafar, 1 Nov): count out the coins and hand them over, with ready-made stacks for small prices** (to five: the beach, and the shops' L1). Built here first, one engine. *Why:* count-out teaches "give me N"; the stacks keep a small price one tap.
10. **Nani pays from her purse, which always holds more than needed. Never the child's pocket money, and no haggling.** *Why:* non-negotiable 7; nothing lost; Find it rejected bargaining. *Assumed:* yes.
11. **The seller counts along at L1 only; from L2 he counts back only after the give. At serve L1 he counts the customers' coins aloud** (pay's watch step). *Why:* support at first, then the count-back is the check, not a cue. *Assumed:* yes.
12. **The scale is serve's container** (Find it 5c folded in). *Why:* the pan and needle are the toy; no other game weighs. *Assumed:* yes.
13. **The gift comes after serving, and goes to Ali; it runs on a gesture and *shabash* until *khanigin* is recorded.** *Why:* a thank-you for helping; the trip's thing for Ali; *khanigin* is a draft. *Assumed:* yes.
14. **Your turn joins at the general store's L2; Check the bag at L3,** packed at both buying stalls once the cloth is open. *Why:* as Find it's 3b; the child acts as the listener several times first; two new things at once is the overload the critique found. *Assumed:* yes.
15. **Speaking on visit 1:** the order at L2 (rung 1), the greeting reply from L2, the cloth's colour from L2 once three colours are recorded. Asking the price is visit 2. *Why:* only exchanges the child has watched many times; the colour say makes the shops' cloth and the sewing's stall one. *Assumed:* yes.
16. **The day is sunny,** as the town map assumed. *Why:* his "rain and umbrella beats left out for now"; one lighting state. *Assumed:* yes.
17. **No "no" asks in serve;** "not the big one" and "not the red one" in the X one and the cloth from L2. *Why:* customers don't order by refusal; *laal na* ✓ is recorded. *Assumed:* yes.
18. **Nothing hot is touched by the child:** the flasks are tapped and Nani lifts the lid. *Why:* nothing a child could copy and get hurt by. *Assumed:* yes.
19. **Customers reuse the clinic's and Cook's people; two new sellers are drawn for visit 1** (the cloth seller comes with her stall). *Why:* cost; the sellers need the handover poses. *Assumed:* yes.
20. **Built on the shared kit; Find it's greybox code is the reference.** *Why:* moving Find it onto the kit is a rebuild anyway (R7). *Assumed:* yes.
21. **Each part counts as teaching only once its deciding words have Mum's clip (or play as a whole recorded line).** Visit 1's big/small runs on *wadho ginech* / *nindho ginech*; pay is lab-only in full. Mum's next sheet, top first: *wadho* alone; one to ten (ten checked against *do*); *paisa* and the price line; *khanigin*; *ghan*; the join for a second row; then eleven to twenty and the colours. *Why:* grey English is a reader's win; a heard word is not a clip. *Assumed:* yes.
22. **The first-ever round is the fruit stall and one small pay;** the general store opens on round 2, the cloth on round 3. *Why:* the first round is tiny; the day already has the door, the bag, the ride and the map before it. *Assumed:* yes.
23. **The end is at the fruit stall, where it began,** with the seller's mango slice and the goat. The child's avatar walks round to the customer's side for Nani's buy in the same view; the full camera flip waits for visit 2's customer-side background. *Why:* end where it began; a third background on visit 1 would undo the art cut. *Assumed:* yes.
24. **The same counts on every screen size; the design fits the phone** (two coin rows, a two-step display, the second customer behind the first), with a pixel budget per layout in §7. *Why:* fairness and the leak bot. *Assumed:* yes.
25. **Serve's L4 is a busy queue** (two customers wait; the one who speaks is the order), with no timer. *Why:* an L4 of its own, not a faster L3; listening and speed fight. *Assumed:* yes.
26. **Hints: the ask again is the first hint (at 7 s), then the rulebook's steps to the helper card,** one sequence owned by the central rules file. *Why:* an idle repeat at 6 s and a hint at 7 s would overlap. *Assumed:* yes.
27. **Visit 1 is two backgrounds, two new sellers, four Nani poses and one reaction pair;** the rest is listed for later visits (§7). *Why:* the template's "a trip that needs 60 new recordings won't get made" applies to art too; one supervised ChatGPT run. *Assumed:* yes.
28. **The lanes are introduced gently from visit 1** (Zafar, 1 Nov: "if the lanes are how it works from visit 2, introduce them gently from the first visit, so it stays consistent"): one short lane with one turning between the two stalls (§2); the full lanes and the goat chase on visit 2. *Costs:* the lane engine's first piece and one background on visit 1, and "this way", left and right to record.

**Open questions (genuinely his, or Mum's):** (open question 4, the lanes, was answered on 1 Nov: decision 28.)
1. **Mum:** how does the family say the numbers one to ten (as clips), and is ten *do*? (The handout's *do* was never confirmed, and it is "two" in Hindi and Urdu.) Her ten gates pay's L2. Then 11-99: if each is its own word (as in Gujarati), that is 90 clips. Is money *paisa*, or shillings in the East African way? How is a price said ("that's five paisa"), and "how much is it?"
2. **Mum:** *wadho* alone; *khanigin* and *ghan* (are they right?); the family words for soft, hard, yellow, long, short, thin and dotted; *paani* alone.
3. **Zafar:** a big brass coin for ten, or paper notes for the tens? (Coins keep one gesture and one look; notes are more real for 50 and 100.) *Recommended:* coins.
5. **Zafar: the chai stall (your list's #10) and the toy stall's kite.**
   - **A (recommended):** the chai stall on visit 3, where hot and cold water join the X one; the kite stays parked with the beach's kite. *Costs now:* nothing.
   - **B:** the chai stall on visit 1. *Costs:* a third background and the chai stall man (posed); the code is Cook's chai tray reskinned and the fried peas into cones (*bas*, *thorok*, *wadhare* are ✓), so the words are cheap; it makes visit 1 a third stall and a third pay.
6. **Zafar: Big Ma's cloth on visit 1, from the general store's shelf or the cloth stall?** Your list has the cloth stall as its own stage.
   - **A (recommended):** a shelf of bolts at the general store on visit 1, sold by the shopkeeper; the cloth seller and her stall come with visit 2. The cloth still goes home to Big Ma, and the sewing's short stall visit (if the child hasn't been) is the same shelf. *Costs now:* nothing extra.
   - **B:** the cloth stall on visit 1. *Costs:* a third background and a third fully posed seller (the cloth seller), and a walk between three stalls.
7. **Zafar:** *ginech* in Mum's *wadho ginech, nindho ginech*: is it "buy" (the clip's note says spelling and meaning to confirm)? And may that clip, and *hakro ambo, ba amba*, be cut in two at their pauses (you pick the takes)? Potato: Mum's clip says *bateta*, the lexicon *bataato*: which spelling?

---

## 11. ChatGPT mock-up prompts

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

### Prompt shops-1: serve at the fruit stall

The image should show the fruit stall from behind the counter at the moment a fruit lands on the scale, with the customer waiting. It shows the camera flip (the child is the seller) and the count onto the pan.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons.

The scene: a sunny open-air fruit and vegetable stall in a calm, modern small-town market, seen from BEHIND the counter at eye level, so we stand where the stallholder stands. The horizon is at about 55% of the height. Across the bottom third runs a wide wooden counter. On it, left of centre, two low woven crates piled high: one of bright yellow lemons, one of green-and-red mangoes, with plenty in each. In the middle of the counter stands a simple brass weighing scale with a round shallow pan on top and a round dial facing us; the dial has a single needle and plain tick marks only. One mango sits in the pan, and a second mango is in mid-air, hopping from the crate into the pan; the pan is dipping a little and the needle has swung. On the far side of the counter, on the right, a smiling woman of about forty stands waist up, facing us, in a long plain sage-green kameez and a cream dupatta loosely over her hair, holding out an open brown paper bag with both hands. At the far right edge, a friendly man in his fifties with a short grey beard, a cream cap and a green apron sits on a low stool sipping from a small glass of chai, watching kindly. Behind the customer: a soft, uncluttered market street with a couple of awnings and warm sunlight, plain walls, no signs.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows on the counter, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the dial, the crates, the bag, the awnings, the walls or anything else.

It must read at phone size: the lemons and mangoes big, chunky and clearly different; the scale pan and its dip obvious; the flying mango clear; the customer's face and the held-out bag clear of everything; the seller's face clear at the edge.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt shops-2: Nani's picky shopping (the X one)

The image should show the general store's counter with a big and a small pot side by side, the moment after the child gave the wrong (small) one: the grandmother holds a tiny pot to her eye like a monocle while both pots wait on the counter. It shows that the describing word is the whole choice, and the "kind of funny" miss.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons.

The scene: inside a small, bright, modern general store in a market, seen from the customer's side at eye level, the horizon at about 55% of the height. A long pale-wood counter runs across the lower third. Behind it, plain shelves hold a few neat rows of steel pots and cups, calm and uncluttered, with one mirror-work trim along a shelf edge as the only decoration; at the left end of the shelves stands a short row of upright bolts of plain cotton cloth (red, green, blue). On the counter, centre, stand two shiny steel cooking pots side by side: one large and one small, the small one clearly about half the size of the large one. Behind the counter, centre-back, a cheerful shopkeeper in his sixties in a cream kurta and a brown waistcoat leans forward, both palms up, laughing; his face is above and clear of the pots. On the right, waist up, three-quarter on, a grandmother in a plain cream kameez with a few bold red embroidered motifs at the neck and cuffs and a plain red dupatta over her head, round thin gold glasses, holds a third, tiny steel pot (no bigger than a teacup) up to one eye like a monocle, with a big playful grin; a woven shopping basket hangs from her other arm. Warm sunlight falls through a doorway on the left.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the shelves, pots, cloth, walls or anything else.

It must read at phone size: the big pot clearly big and the small pot clearly small, side by side; the grandmother's face and joke clear, the tiny pot over one eye only; the shopkeeper's face clear of the pots and the shelves.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
```

### Prompt shops-3: pay at level 4, a big screen

The image should show paying a big price: the grandmother's open purse with two piles of coins, two short rows already counted out on the counter (big brass coins above, small copper ones below), and the shopkeeper's open hand. It shows how numbers up to 100 are paid with no digits anywhere. The exact count is not asked for (image models miscount); the lab builds the exact rows.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons. A wide big-screen frame.

The scene: the same small modern general store, from the customer's side at eye level, the horizon at about 55% of the height; plain shelves behind, uncluttered. On the long pale-wood counter, at the left, lies an open soft red-and-cream embroidered purse with two neat heaps of coins inside it: a heap of big plain brass coins and a heap of small plain copper coins about half their size. Every coin is blank, with only a simple stamped flower in the middle and a raised rim. In the middle of the counter, as if just counted out, lie two short tidy rows, slightly overlapping like a fanned hand of cards: a short row of big brass coins on top, and below it a short row of a few small copper coins; one more small copper coin is mid-slide from the purse, with a tiny sparkle. On the right of centre, the shopkeeper in his sixties, cream kurta and brown waistcoat, leans over the counter with his open palm held out, waiting patiently with a warm smile. A small dented tin money box with its lid open sits at his elbow. On the far right, waist up, a grandmother in a cream kameez and red dupatta, round thin gold glasses, watches proudly with her hands together. A woven shopping basket with a big steel pot and a folded red cloth inside sits at the far right of the counter.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows under every coin, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: no digits, letters, script or faces on the coins, the purse, the tin or anything else.

It must read at phone size: the two kinds of coin clearly different in size and colour; the two rows clearly two rows, brass above copper; the open palm obvious; both faces clear of everything.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
```

### Prompt shops-4: Big Ma's cloth at the general store, for the short phone strip

The image should show the cloth bolts at the general store at the moment the red bolt unrolls across the counter, with the goat sneaking past with the shopping list. ChatGPT can't make the phone's very wide strip, so it asks for the widest frame and keeps everything that matters in the middle band, which the game crops to Zafar's phone. It shows the cloth's describing game, the delight, and the day's joke.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons. Use the widest landscape frame you can make. The game will crop the top and bottom away and show only a thin band across the middle, about a third of the height, so put everything important inside that middle third: the counter, the cloth, the bolts, both faces and the goat. Keep the top and bottom thirds plain (ceiling, shelf tops, floor).

The scene: the same small modern general store in a calm market, seen from the customer's side at eye level, the horizon at about the middle of the height. Behind a long pale-wood counter, at the left end of the shelves, a low shelf holds four upright bolts of plain cotton cloth: one red, one green, one blue, one red with small white dots. The plain red bolt has just been flung across the counter and is unrolling in a long, smooth wave of red fabric along the counter, with a soft whoosh of movement. Behind the counter, centre, the cheerful shopkeeper in his sixties, cream kurta and brown waistcoat, holds a pair of big tailor's scissors upright, ready to snip. On the right, waist up, three-quarter on, a grandmother in a cream kameez and red dupatta, round thin gold glasses, holds open a woven shopping bag and smiles at the red cloth. At the far left, at counter height, a small friendly white goat trots past with a blank piece of paper in its mouth, looking pleased with itself. One mirror-work trim on the shelf edge is the only decoration; plain walls, no signs.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the paper in the goat's mouth, the cloth, the shelf or anything else.

It must read at phone size inside the middle band: the red cloth clearly red and clearly unrolling; the four bolts clearly different; both faces clear of the cloth and the scissors; the goat small but obvious at the left.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png
```

---

## 12. Changes after the critique

Each finding (`shops-critique.md`, 1 Nov), then what I did. Where the critique and Zafar's recorded word met, his word was followed.

**1. MUST: four of the six pairs leak by pattern or force unnatural asks.** Done. The pairs are now only ones a shopper wants either way, each with its reason (§3C table): big/small, soft/hard mangoes (eat today or pickle), green/yellow bananas (cook or eat), hot/cold **as water** in lidded flasks that look alike until Nani lifts the lid (Nana's chai or the walk home), and the cloth's long/short, thick/thin and plain/dotted. Full/empty, old/new, ripe and the hot/cold samosas are dropped (full/empty offered to Cook's pantry as an idea). Zafar's 1 Nov yes named "hot and cold" as an example, so hot/cold stays in this game as water (visit 3, at the chai stall) rather than going back to Cook only. The "Patterns" line now says both states of every pair are asked, and the bot has an "always the good one" strategy. The reason is said from L3 and never pictured (a picture would settle the pick). Steam is no longer on the counter before a tap.

**2. MUST: visit 1's deciding words aren't recorded, and the count hides it.** Done, with one correction found in `data/family-audio.json`. §1 now has a key where only ✓ (Mum's own clip) counts, plus "✓ line" for whole recorded lines the game can play as they stand; the recount is 14 of about 43 with their own clip, 7 more inside whole lines, 22 not recorded. The X one's L1 asks are the whole lines *wadho ginech* / *nindho ginech*, as the critique asked. The correction: Mum has also recorded *wadho cup*, *wadho ambo*, *wadha amba*, *wadho chamcho*, *trae dungri*, *char limu*, *trae bateta* and *hakro ambo, ba amba* as whole lines, so the L2 size ask ("the big cup") and some serve counts are playable now. *Wadho* alone, every number alone, *khanigin* and *ghan* still have no clip. A "What runs on visit 1 today" list says which parts play now; Mum's next sheet is in the critique's order; §9 row 1 says pay is lab-only in full. The *ginech* clip carries a "meaning to confirm" note, so it is open question 7.

**3. MUST: the first-ever round is five mechanics at three stalls.** Done. §4 is now the fruit stall and one small pay: salaam, help, two customers, the gift, then Nani's lemons paid with one to three coins. About ten screens, three things to learn, 3-4 new words. Round 2 opens the general store with big/small, round 3 the cloth, and your turn joins at the store's L2, as Find it's 3b. To keep L2 from bringing two new things at once, Check the bag moves to L3. Decision 22 and the new-words table match.

**4. MUST: over-paying and over-serving reveal the number.** Done. Shared rule 2 is now one wording, coded once in the shared count: a wrong give brings everything back (the pan tips into the crate, the coins slide into the purse) with the ask again and the row from nothing, the patient "and …?" hand for too few, and the helper card after the second wrong give. §3A step 6 and §3E step 6 use the same wording. The serve and pay bots now have dump-all (0%) and add-one-give (no better than a guess at L1, no tick from L2 in pay) strategies, with the numbers redone.

**5. MUST: the scope isn't medium.** Done. §0 now says medium for the code, large for the art, and the recording is the gate. Visit 1 is two backgrounds (the fruit stall, and the general store with the cloth bolts on its shelf), two new sellers, four Nani poses (the basket, the monocle, the stagger, the purse), one reaction pair (the wobble and the bounce, in code), about 15 things and 10 props. I used the stagger, not the blow, as the fourth pose, because the blow was for hot things, which have left visit 1. Everything else is listed under "later visits". The recording for visit 1's L1 is about 17 clips, with about 12 more at L2; numbers 11-100 are marked visits 2-4. The cloth seller, her stall and the walk come on visit 2, and that move is asked, not assumed (open question 6).

**6. MUST: Zafar's 19 Oct spine moved on an assumed yes.** Done. The old decisions 12 (the lanes and the chase to visit 2) and 25 (the chai stall to visit 3, the kite parked) are now open questions 4 and 5. Each has the recommendation, the alternative as he drew it, and the cost of each in engines, art and recording. The goat's joke stays either way. I added open question 6 for the cloth's place, since his list has the cloth stall as its own stage.

**7. MUST: the L4 counters don't fit a phone.** Done, by changing the design, not the counts. Pay: two piles in the purse (one tap, one coin) and two short fanned rows on the counter, brass above copper, with a gap after five. The X one's L4: two decoys (six things) on a two-step display, with the spoon look-alike carrying the difficulty. Serve's L4: the second customer stands behind the first, and the seller steps out for stock. One price per stall at L4. §7 has the play area at each size, from `data/layout.json`'s sidebar rule, and a written budget for each busiest layout against 540 wide and 275 tall. The lab films them to confirm.

**8. SHOULD: the ten rests on an unconfirmed handout word.** Done. Ten is now in open question 1 with the *do*/"two" collision; Mum's clip of ten gates pay's L2, and the ten-coin trick is lab-only until then.

**9. SHOULD: the ask repeats at 6 s and the hint comes at 7 s.** Done. Rule 7: the ask again is the first hint (at 7 s by level), then the rulebook's steps to the helper card, one sequence owned by the central rules file (decision 26).

**10. SHOULD: the showing lights the bag at the right count, then never again.** Done. On the first-ever showing the bag, the basket and the hand light the moment the first item lands (or the first lift) and stay lit until the give, so the light says "it goes here", not "now" (rule 2, §4 steps 5 and 9, round 2's showing).

**11. SHOULD: the beach has a different pay.** Done, as far as this file goes. Count-out with the give is the one pay, and the beach's "tap the stack that matches" becomes its L1 skin (decision 9, §2, §6). This pass edits only this file, so the line for `beach-boat.md`'s open questions is noted for when Zafar agrees, not written there. The cloth's L2 now has the colour say (S5), so the sewing's stall and the shops' cloth are one.

**12. SHOULD: three of the four prompts will come back muddled.** Done. shops-1 drops the s09r road reference (a placeholder, Zafar 20 Oct) and shows mangoes to match the new first round. shops-2 has the small pot beside the big one on the counter and Nani holding a third, tiny pot to her eye, with no handle to peer through. shops-3 asks for "a short row of big brass coins" above "a few small copper ones" and two heaps in the purse, with no exact count; the lab builds the 73. shops-4 asks for the widest frame available with everything in the middle third that the phone shows, and is now set at the general store's cloth shelf (no road reference).

**13. SHOULD: what is in hand at the give is left open.** Done. The last lifted thing is in hand, shown slightly raised; tapping it again puts it down. A basket tap with nothing in hand gets Nani's *kyo?* ✓ ("which one?") and costs nothing. The restock replaces the pair only; the decoy stays (§3C steps 4-6, decision 5). I used *kyo?* from Mum's clip, not as a draft: the clip is in `data/family-audio.json`.

**14. SHOULD: the end doesn't end where it began; the customers' pay is unused.** Done in part. The round now ends at the fruit stall with the mango slice and the goat, and §3A and §3E say the customers paying the seller is pay's watch step, with the seller counting their coins aloud at L1. One part is changed: the critique's camera flip to the customer's side would be a third background on visit 1 and undo finding 5's cut. So the child's avatar walks round to the customer's side within the same behind-the-counter view, and the full flip waits for visit 2's customer-side background (decision 23).

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** The pay line is now written into `beach-boat.md` (open question E, §6). Decision 8 and checklist row 13 no longer say the farm uses the give close: the farm designs close on stillness and list the give as their option (b), so one count close for every game is a single question for Zafar. The cloth on visit 1 stays the general store's shelf (open question 6 A), and `sewing.md` now says its stall visit is that shelf until the cloth seller's own stall arrives. Prompt shops-1's customer wears sage green, not teal, which is the cast's Masi placeholder colour (the beach and the town map draw Masi in a teal headscarf).

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **The lanes, introduced gently from visit 1:** one short lane with one turning between the two stalls; the full lanes and the goat chase stay on visit 2 (§2, §3's round 2, §5, §7's art, new decision 28; open question 4 gone).
- **One pay:** count out the coins and hand them over, with ready-made stacks for small prices; the shops' L1 (prices to five) uses the stacks (§2, §3E, decision 9).
- **Level up only on right-first-time rounds** (the shared rules). **Clothes:** the prompt sheet's line is added before the prompts.
