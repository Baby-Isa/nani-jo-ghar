# Hide and seek: find Simba and Zazu (design, 1 Nov 2026)

Written overnight while Zafar slept. He asked for every game to be designed alone, with each choice written down so he can reverse it (§10). This is design only. No code, data or other doc was changed. **Revised the same night after an independent critique** (`hide-and-seek-critique.md`); what changed and why is in §12.

Sources, newest first:
- his scope (31 Oct, with his wife): Nani says where to look ("look in the cupboard"), the place glows at first, you open it, and the cats are there or not;
- the games map (`build/reports/games-master-map-2026-10-31.md`, Part 1 "A day at home", Parts 2, 3, 5 and 7, his answers of 1 Nov);
- the settings map (`game-settings-map-2026-10-31.md` §1 and §4);
- the audit's fold list (`research-existing-games-2026-10-31.md` §4): Simba's mischief, openables, the cats' trail, the torch and "the other one" all come here;
- the lessons checklist (`designs/lessons-checklist-2026-11-01.md`), the rulebook (`docs/game-design/rulebook.md`) and its numbers (`data/rules.json`);
- the cast (`docs/game-design/cast.md`) and the art bible (`docs/design-language/art-bible.md`) for the cats, Nani and Nana.

**About the Kutchi in this doc:** it is only what is already in the repo (`build/reports/research-word-inventory-2026-10-31.csv`). Sentences are given in English, because the language engine builds them from Mum's phrases. The tags mean:
- **✓** a family clip of the word or the whole line;
- **inside lines** Mum says it only inside longer recorded lines;
- **in engine** the engine has it, but it isn't recorded;
- **to record** the repo has no Kutchi for it yet.

**Nothing in this game ships, and the leak bot has nothing to measure, until Mum's L1 list (§1) is recorded.** Until then every unrecorded word is grey-italic English, device-spoken in testing only (non-negotiable 2), and a reader wins. **Voices (Zafar, 1 Nov):** for the prototype, the Kutchi takes that exist play, and the device voice says the rest. Who voices what, the recording sessions and the casting are settled before shipping, once the words are locked; nothing in this design waits on a voice.

---

## 0. One line

| | |
|---|---|
| **What** | Simba and Zazu hide in a bedroom at Nani's. Nani says where to look, the child opens that place, and a cat jumps out or something silly is there instead. |
| **Day** | A day at home: the first of three games (hide and seek, then pick it up and put it back, then the clean-up). |
| **Status** | New (31 Oct), now designed, revised after the critique. |
| **Engine** | Find it's openables (designed, 4d and library L2) on the shared kit (`js/shared/`), with a new **openable** piece (a place that opens, shows what's inside and closes again) and a small **cat actor** (hide, jump out, run to Nani, slip to a new place). Lines and bubbles go through `conversations.js`; the leak bot is a reskin of `whichone.js` (§6). |
| **Size** | Split in two (§5). **1a** (L1-L2, no Nana, no speaking) is small: about one builder sprint, seven places, a short cat sheet. **1b** (L3-L4, Nana and the speaking moment, the look-alike pairs) comes after Zafar has played 1a. |

---

## 1. The language goal

**Word groups:**
- main: home and rooms (the house's places and containers);
- supporting: positions (in, under, behind), question words (where?), pets (the cats' names), and open and closed;
- woven in: numbers 1-5 (the count) and big and small (1b, L3-L4).

### The words it teaches (first visit: Nani's bedroom)

| English | Kutchi in the repo | Status | Where it decides a move |
|---|---|---|---|
| cupboard | *kabaat* | **✓** | L1 on |
| wardrobe | none | to record (ask Mum whether it is also *kabaat*; see §10, decision 20) | L1 on |
| bed | none | to record | L1 on ("under the bed") |
| curtain | none | to record | L1 on ("behind the curtain") |
| box (the toy box) | none | to record | L1 on |
| basket (laundry basket) | none | to record | L2 on |
| drawer (the chest of drawers' bottom drawer) | none | to record | L2 on (replaces the door; §10, decision 26) |
| blanket (a soft quilt heaped at the bed's foot) | none | to record | 1b, L3 on ("under the blanket") |
| in | *me* | in engine; the engine says *me*, as in Mum's recorded *e rasore me ai* ✓ (*andar* is not used here) | every line with a container |
| under | *niche* | inside lines (1) | under the bed, under the blanket |
| behind | *puthiya* | inside lines (4) | behind the curtain |
| big, small | *wadho*, *nindho* | *wadho* inside lines (30); *nindho* **✓** | 1b: L3 (naming the cats), L4 (look-alike pairs) |
| here!, there! | *hida*, *huda* | **✓** both | heard at each find |
| Simba, Zazu | *Simba*, *Zazu* | in engine (names), not said by Mum alone | L2 on (who) |

The door is no longer a hiding place (§10, decision 26). "Cat" is not needed: Nani always uses the names. It moves to a later visit.

### Its verbs

| Verb | Kutchi in the repo | Status | Where | Visit |
|---|---|---|---|---|
| look | *nar* (to a child) | in engine; past forms inside lines (11) | every ask: "look in the wardrobe" | 1a |
| close | none (*band*, closed, in engine); **Zafar, to confirm: *bund*** (1 Nov; the family says it for closing and for a light) | to record | "close your eyes" (whole line); the close step ("close the wardrobe") | 1a |
| open | none | to record | 1a only inside "open your eyes" (whole line); alone in 1b, L3: "open the box!" | 1a / 1b |
| find | none | to record (not in the engine) | "find Zazu!" (L2 on) | 1a |
| hide | none | to record | only inside the door line (a whole line) | 1a |
| know | *khabar* in "do you know who I am?" | **✓** whole line, *khabar* inside lines | L3: "do you know where Zazu is?" (in Nani's lines, as Zafar asked) | 1b |
| think | none | to record | L3: "I think he's behind the curtain"; Nana's answer | 1b |
| take (took) | "Simba took it" | in engine, to record | the mischief line | later (the item drops silently until then) |

### Frames heard (English meaning; the engine builds them from recorded pieces)

| When | Frame | Pieces | Visit |
|---|---|---|---|
| The count | "Close your eyes!" · "one … five" (one number per tap) · "Open your eyes!" | two whole lines (to record); *hakro, ba, trae, char, panj* (in engine, none with its own clip) | 1a (from the second hide ever) |
| The ask, L1 | "Where's Simba? Look in the wardrobe." | where is it? *kida ai* **✓** + name; look *nar*; place; in *me* | 1a |
| The ask, L2 | "Simba's in the wardrobe. Zazu's under the bed. Find Zazu!" | the recorded "he's in the kitchen" frame (*e rasore me ai* **✓**) with the name and place swapped; find (to record) | 1a |
| The ask, L3 (other ways of saying it) | "I think he's behind the curtain." · "Open the box!" · "He's under the bed, not in the wardrobe." · "The big one's in the cupboard." · "Do you know where Zazu is?" | think, open (to record); not *na* **✓**; big *wadho*, small *nindho*; *khabar* | 1b |
| The ask, L4 | "Zazu's in the small box." · after a miss on the twin: "Not this one, the other one!" | *nindho* **✓**; "not this one, that one" *hi na, hu* (in engine) | 1b |
| A find | "There he is!" then "Well done!" | there *huda* **✓**; well done *shabash* **✓** | 1a |
| An empty spot | Nani laughs, then "No!" and the ask once more | *na* **✓** ("No.") with Nani's laugh; no new clip | 1a |
| The close step | "Close the wardrobe." | close (to record) + place | 1a |
| The door | "Simba and Zazu are hiding! Shall we find them?" | one whole line (to record) | 1a |
| Nana, at the door (watch) | Nani: "Nana, where's Zazu?" Nana: "I think he's under the bed." | *Nana* **✓**, *kida ai* **✓**; think (to record); Nana's lines in whoever's takes we have, else the device voice (Zafar, 1 Nov) | 1b |
| The mischief | "Simba took Nana's glasses!" | "Simba took it" (in engine), glasses (to record) | later: in 1a the thing drops silently and is named in pick it up, where its word decides |

### What Mum records for L1 to play

Ordered by what unblocks play. Each is one short clip.

| # | Clip | Count | Why |
|---|---|---|---|
| 1 | wardrobe, bed, curtain, box (the cupboard *kabaat* ✓ exists) | 4 | the deciding words; plus one question: is a wardrobe also *kabaat*? (decision 20) |
| 2 | *me* (in), *niche* (under), *puthiya* (behind), each alone | 3 | the engine needs them as pieces, not only inside lines |
| 3 | *nar* (look, to a child) alone | 1 | every ask |
| 4 | Simba, Zazu, in Mum's voice | 2 | the names inside every ask |
| 5 | "Close your eyes!" and "Open your eyes!" | 2 | the count |
| 6 | one, two, three, four, five, each alone | 5 | the count (no number has a clip yet; other games need them too) |
| 7 | close (the imperative, to a child) | 1 | "close the wardrobe" |
| 8 | the door line | 1 | the reason to play |
| | **L1 total** | **19** | |

**Reused, nothing new:** *kida ai* ✓ (the ask), *huda* ✓ and *shabash* ✓ (the find), *na* ✓ with Nani's laugh (the empty spot), *e rasore me ai* ✓ (the L2 frame), *nindho* ✓ (1b).

**For L2 (still 1a):** basket, drawer, find: **3 more, 22 in all for 1a.**

**For 1b:** blanket, open (alone), think ("I think he's …"), "do you know where … is?", *wadho* alone, "not this one, the other one": **about 6 from Mum**, plus Nana's own set of place words and "I think he's …" in his voice (about 12, whoever voices him).

**Deferred to later visits:** the mischief items' names and "Simba took …" (5), "cat" (1), six to ten (5), the surprises' names (about 8): about 19.

**The whole design, every visit counted:** about 45-50 clips from Mum plus Nana's set. The first visit's 1a needs 22.

### New words per level

| Level | New this level | Asked per round |
|---|---|---|
| L1 | the five places (cupboard, wardrobe, bed, curtain, box), in and under and behind, look, where | 2 places (all five met within three rounds) |
| L2 | basket, drawer; find; the names now decide | 3 |
| L3 (1b) | blanket; think, know, open, not; big and small as names for the cats | 3 |
| L4 (1b) | the small box and the small basket (look-alikes); "the other one" | 4 |

Each round asks 2-4 places and each is heard at least three times: in the ask, on the card's replay, and at the find or close. That meets the checklist's "3-5 new words a round, each heard at least 3 times".

---

## 2. Where it sits in its day

**A day at home (Nani's house), hosted by Nani, with Simba and Zazu.** Zafar's order: hide and seek, then pick it up and put it back, then the clean-up. Every day is the door, its games, then the evening book. There is no `docs/game-design/days/home.md` yet. This section is that file's first row.

| Step | What happens | What carries |
|---|---|---|
| **The door** (built) | Nani opens the door. Behind her, a black tail whisks round a corner and a bell jingles. Nani: "Simba and Zazu are hiding! Shall we find them?" (to record) | the reason to play |
| **1. Hide and seek** (this game) | The cats hide in the bedroom. The child finds them, round by round. | **Out:** (a) the place words, said in the same house the next game uses; (b) each round's mischief thing (Nana's glasses, Ali's sock, Big Ma's thread, Nani's purse), which drops silently on the floor; (c) the cats, who now sit and watch. |
| **2. Pick it up and put it back** | Uses (b): "Nana's glasses are on the floor in the bedroom; put them on the table." Here the thing's word is said and decides. It reuses the bedroom background from this game and adds the doll's-house rooms. | the places become positions (on, under, next to) |
| **3. The clean-up** | The verbs done to the house: "close the curtains", "switch off the light". This game's "close the wardrobe" is its first taste. | close is met here first |
| **The evening book** (built) | Page: "We found Simba in the wardrobe!" with a photo from the round's best find. The child taps where Simba was ("where was Simba?", *kida wo*, in engine). | the day's recap |

**Why first:** it teaches the house's places by name, through the reveal, before the next game asks the child to use them as positions (games map, §4). It's also the game with the strongest outside evidence of fun (games map, Part 5, row 3).

**Played alone:** free play opens straight into the bedroom with the cats at Nani's feet. The count starts on the first tap.

---

## 3. The mini-games and stages

A round is one short story:
1. **The count:** the cats hide (a beat the child drives, not a test).
2. **The searches:** 2-4 of them. Each is one "where" ask and one find.
3. **The close step:** close the places Nani names.
4. **The end:** the cats on Nani's lap, then the shared end screen.

The search is a pool of variants. Which variants play is set by the level (data).

### The pool, scored

Scores: Do / Challenge (Kutchi decides) / Fun / Instruction / Novel, each 1-5.

| # | Mini-game or beat | D/C/F/I/N | Total | Decision | Visit |
|---|---|---|---|---|---|
| M1 | **Look in the ___** (the core search) | 5/5/5/4/4 | 23 | **Keep**, L1 on | 1a |
| M2 | **Which cat?** (both hide; who and where) | 4/5/4/3/4 | 20 | **Keep**, L2 on | 1a |
| M3 | **Close it** (close the places Nani names) | 4/3/3/4/3 | 17 | **Keep**, every level (L1 a single "yes" ask) | 1a |
| M4 | **The other one** (look-alike pairs: the big box and the small box) | 4/5/4/3/3 | 19 | **Keep**, L4 | 1b |
| M5 | **The count** (close your eyes, tap to count, open your eyes) | 4/1/5/4/3 | 17 | **Keep as a beat:** the word decides nothing here, so it isn't a stage. The child's taps drive it, so it is never a wait. | 1a |
| M6 | **Ask Nana** (speaking: "Where's Zazu?") | 4/4/4/3/5 | 20 | **Keep:** watched at L2 of 1b, handed over at L3, alone at L4 | 1b |
| M7 | **The torch at bedtime** (night; tap to shine) | 5/4/5/3/4 | 21 | **Keep as a later visit** (§5), not a level | later |
| M8 | **Simba's mischief** (the last find of a round has something he took) | 2/2/5/3/4 | 16 | **Keep as woven delight and the carry** to pick it up; in 1a the thing drops silently | 1a |
| M9 | **The cats' trail** (paw prints or a bell) | 3/2/4/3/3 | 15 | **Folded, a numbered choice** (§10, decision 11): (a) prints only after a find, as a route replay; (b) a bell or prints before the find at L3-L4 that are right only half the time. (a) in 1a, (b) tested in 1b. | 1a / 1b |
| M10 | **Your turn to hide** (the child hides a cat; Nani asks "is he in the box?"; the child answers yes or no, *ha* / *na* **✓**) | 4/5/5/3/5 | 22 | **Later visit** (§5). It is the audit's "judge what is said", leak-proof, and the yes/no clips exist. Parked from the first visit only to keep it small. | later |

**Maybe later:** Kasuku's version (the parrot saw where they went; her squawk, Zafar 1 Nov: try Kasuku's squawk from Mum's clip, and Zafar can imitate a parrot if that fails); the garden (behind the tree, under the car); find two the same (Find it's L5), which doesn't fit cats.

---

### M1. Look in the ___ (the core)

**Why:** "Where's Simba?" The cats are hiding and Nani knows where.

**The five questions:**
1. **Do:** tap a place. It opens (the wardrobe doors swing, the bed cover lifts, the curtain swishes, the box lid pops, the cupboard door opens, the drawer slides out). One gesture, a tap, for every place.
2. **Challenge:** the place word decides which of 5-10 identical-looking closed places to open. **The Kutchi decides it.** No tail, bulge or wobble shows where a cat is (§3 leak test).
3. **Fun:** the reveal. A cat is there in a different pose each time:
   - Simba blinks sleepily on folded clothes;
   - Zazu tumbles out with a dust bunny on his head;
   - Simba is too big for the drawer and overflows it;
   - Zazu pounces at the child's finger.

   An empty spot has its own joke, never the same one twice in a round:
   - a sock bounces out of the box;
   - the curtain reveals a pigeon on the sill, who coos and flaps off;
   - the cupboard's towels slump out in a soft heap;
   - Ali's toy car rolls from under the bed;
   - a ball of wool unrolls from the basket.
4. **Instruction:** Nani on screen speaks first: "Where's Simba? Look in the wardrobe." Then the card pops big (Simba's face and the place: at L1 its picture, Kutchi and English; from L2 speaker and Kutchi only) and flies into its row. The guide box says the step ("look").
5. **Novel:** a place word decides which container to open, and the target is alive and moves. Find it's 4c finds copies by position. Pick it up places things. Nothing else hides a character who reacts.

**The level ladder** (each level adds one thing; the Kutchi gets harder, the gesture never changes):

| Level | Places | Searches | What's new | Support |
|---|---|---|---|---|
| **L1** | 5 (cupboard, wardrobe, under the bed, behind the curtain, the box) | 2 (Simba, then Zazu; one hides while the other sits with Nani) | the core; "yes" asks only | the named place glows as Nani says it (his "it glows at first"); the card shows the place's picture and English |
| **L2** | 7 (+ the basket, the bottom drawer) | 3 (a cat hides again after the count) | **M2:** both cats hide, so who and where | no glow; the card's English dotted and **its place picture gone** (speaker and Kutchi; the cats' faces stay); a cat slips to a new place after two empty opens |
| **L3** (1b) | 8 (+ under the blanket) | 3 | **other ways of saying it:** "I think he's …", "open the …", "he's under the bed, not in the wardrobe", "the big one's …", "do you know where …?" | as L2 |
| **L4** (1b) | 10 (+ the small box and the small basket, beside the big ones) | 4 | **M4:** look-alike pairs decided by big or small; "not this one, the other one" after a miss on the twin | as L2 |

These numbers live in the data, in the rulebook's central file. This game overrides four rulebook defaults, all recorded in §10:
- L1 has 2 searches, not 1, because two cats are the story (decision 2).
- "No" asks come at L3 as a phrasing, not at L2, because L2's new thing is who and where (decision 9).
- **Level-up rests on the finds** as well as the guide's hint: up after 3 finished rounds in a row where **every find was first-open** (Zafar, 1 Nov: level up only on right-first-time rounds) and the guide's hint came at most once (decision 24).
- **The card's place picture shows at L1 only**, not L1-L2 (decision 25).

**The three helps** (one meaning each):
- **The repeat (free):** 5 s after the ask with no tap, Nani says the ask once more. It costs nothing and counts for nothing.
- **The guide's hint (counts):** at 7 / 9 / 11 / 13 s (L1-L4) from **the last ask**, not the last tap, Nani says the place word again and the place glows once. A child who taps fast can't reset it. This is the hint the level-up rule counts (`data/rules.json` `advance.maxGuideHints`). A slip to a new place is a new ask and starts the wait again.
- **The helper card (the bulb, costs a bulb):** a tap on the bulb, at any time, shows the full answer (picture, Kutchi, English) in the guide's box and lights the place. It costs a bulb and, as the rulebook says, doesn't count for level-up.

**The leak test**

| Way to win without Kutchi | Can it? | The fix |
|---|---|---|
| **Reading** | The places carry no labels. The card's Kutchi is romanised: someone who can read it but doesn't know Kutchi can't map *kabaat* to a picture once the picture has gone. **Danger:** a place word not yet recorded shows as grey-italic English, and a reader wins (the dastarkhwan won 95-100% this way). | Nothing ships and the leak bot doesn't run until Mum's L1 list is recorded (§1). The bot runs on recorded words only. English on the card shows at L1 only (non-negotiable 3) and is dotted from L2. |
| **Matching** | At L1 the card's picture of the wardrobe matches the scene's wardrobe. | Allowed at L1 only, where the glow helps anyway. **From L2 the card has no place picture** (speaker and Kutchi, and the cat's face), so nothing on the card matches a place (decision 25). Every place has one picture, never a scene crop, and all the places look equally "closed". |
| **Eliminating** | Open everything until a cat appears. | (1) **From L2, after two empty opens the cat slips to a new closed place.** You hear a patter and a bell, centred, with no movement on screen, and Nani says the new place. Fishing never closes in on the cat. (2) Accuracy counts only first-open finds. (3) **The level rests on first-open finds** (decision 24): a fisher finds every cat, the rows tick, but the level doesn't move. (4) The chance falls as places grow. A random opener's first open finds the asked cat about 1 in 7 at L2, and the pool shrinks as found places stay open, so **a whole round of first-open finds is under 1% at L2 (about 0.5%) and under 0.1% at L4; three level-up rounds in a row is under 0.1% at L2.** The bot prints the real numbers. (L1, with the glow, is allowed: supported.) |
| **Patterns** | The cats' favourite spots, an order of places, a cat always in the big places. | Each hiding place is uniform at random among the closed places, the last round's included. Who is asked first is random from L2. Every place fits both cats (Simba squeezing into the drawer is a joke, not a rule), so size never narrows it. |
| **Waiting** | A tail creeping out, a meow from the right place, the glow arriving by itself. | A cat never comes out by itself and nothing about a closed place changes over time. Every cat sound is mono and centred, never from the place. From L2 the only glow is the guide's hint, which counts against the level, and the helper card, which costs a bulb. |

**The delight moment:** the first open of each round. The doors swing, a beat of stillness, then two green eyes blink open and the cat leaps out with a *mrrp*, runs to Nani and winds round her legs. Nani: "There he is!" (*huda* **✓**).

**Speaking:** none in M1 itself; see M6 (1b).

---

### M2. Which cat? (L2 on)

**Why:** both cats are hiding now, and Nani saw both.

1. **Do:** the same tap.
2. **Challenge:** two words per move (the games map's rule 2). Nani says where each cat is, then which one to find: "Simba's in the wardrobe. Zazu's under the bed. Find Zazu!" The child must hold the pairing and pick the right place. The name alone isn't enough, and the place alone is a coin toss.
3. **Fun:** opening the other cat's place. Simba is caught, gives a guilty look, and bolts to a new hiding place, curtain swinging. It's a miss, but a funny one, and it shuffles the board.
4. **Instruction:** two rows on the card, each with the cat's face and its place as speaker and Kutchi (no place picture: M2 starts at L2); the asked one throbs. The replay says only what's left. A face per row is a change to the shared `order-card.js` (today one face per card); it goes to the shared-layer owner (§6).
5. **Novel:** who and where in one move, with a target that runs.

**Levels:**
- L2 two cats, three searches (one hides again after its find, behind a count);
- L3 (1b) the cats named by size ("the big one", "the small one");
- L4 (1b) adds the look-alike pairs (M4).

**The leak test:**
- **Reading** and **matching** as M1. The faces on the card are allowed because the names aren't the Kutchi being tested; the places are, and from L2 they have no picture.
- **Eliminating:** two places are named and one is asked, so a guesser who heard "both places" but not who has a 1 in 2 chance. Fix: the wrong cat runs to a new place, so a second guess is never free. The first-open rule keeps the badge and the level honest.
- **Patterns:** which cat is asked is random. The last-named isn't always the one asked.
- **Waiting:** as M1.

**The delight moment:** the wrong cat's guilty face and getaway.

---

### M3. Close it (every level)

**Why:** "Nana's coming; let's tidy up!" This is the house's first "close", the verb the clean-up builds on.

1. **Do:** tap an open place, and it closes with a soft clunk.
2. **Challenge:**
   - L1: one "yes" ask. The last find's place is open and glows.
   - L2: one named among at least three open places.
   - L3-L4: two, named one after the other.

   Empty places close themselves after their joke, so the room stays readable; the cats' places stay open. If fewer than three are open, Zazu nudges another door open on his way to Nani (a cute beat, and it guarantees the choice).
3. **Fun:** the clunk, and sometimes a last surprise: the pigeon flaps out as the curtain closes, or the sock flies back into the box.
4. **Instruction:** Nani: "Close the wardrobe." Its row on the card has the place picture at L1 only (speaker and Kutchi from L2), plus the close action's own icon.
5. **Novel:** small. It's the round's calm close, and the only place outside the clean-up where "close" decides a move.

**Rules:**
- **The cats are always out first.** A cat is never shut in anywhere (a child could copy it; lessons §11).
- Under the bed has nothing to close (its cover drops by itself), so it's never named here.

**The leak test:** with 3 open places a guesser closes the right one 1 time in 3. A wrong tap shakes the place, it stays open, and the line repeats (a mistake gets a shake and the word). It counts towards accuracy. It is a low-stakes third hearing of the place word, not a main test, and the round's badge and the level rest on the finds.

---

### M4. The other one (L4, 1b)

**Why:** the bedroom has two boxes (the big toy box and a small one) and two baskets (the big laundry basket and Big Ma's small sewing basket).

1. **Do:** the same tap.
2. **Challenge:** the size word decides between twins: "Zazu's in the small box." If the child opens the twin, Nani recasts: "Not this one, the other one!" (*hi na, hu*, in engine). That's the help after a miss, not a free answer, and it counts as a miss for accuracy and the level.
3. **Fun:** Simba hiding in the *small* box, half of him overflowing; Zazu lost inside the huge one, only his ears showing as the lid lifts.
4. **Instruction:** the card row is speaker and Kutchi only (L4 has no place picture), so the size is heard, never seen on the card.
5. **Novel:** the look-alike rung (rulebook L4) on this game's own nouns. This side and that side stay with pick it up (Mum's order).

**The leak test:**
- **Matching** a picture to the right size can't happen: the card has no picture at L4.
- **Eliminating:** after a miss on the twin, the recast leaves one choice, so it's help, and accuracy marks the miss.
- **Patterns:** big and small are asked equally often, at random.
- **Waiting:** as M1.

---

### M5. The count (a beat, every round but the first-ever hide)

Nani: "Close your eyes!" She puts her hands over her eyes, and the play area dims softly from top and bottom (the shared dim). **The child taps Nani's hands once per number, and she says that number** (one to five, every level). If the child doesn't tap for 2 s, she says the next number herself, so a child who doesn't tap never waits. In the dark: a patter, a bell jingle, a thump, a tiny squeak. After five: "Open your eyes!" The light comes back: one cat (L1) or both (L2 on) is gone, and the room looks exactly as before.

- **Words:** close, open and eyes, plus one to five, heard every round. The word decides nothing here; that's why it's a beat, not a stage.
- **The hands:** a tap, the game's one gesture. No hold. The first time, Nani's hands glow (a control glows, it doesn't bounce) to show the tap once.
- **To ten:** a later change in data, once Mum has recorded six to ten.
- **The first-ever hide skips it:** in the first round ever, Simba simply walks off into a brief dim and the light returns (§4). The count is first met at the second hide, once the child has seen an open.

---

### M6. Ask Nana (speaking, 1b)

**Why:** Nani can't see where Zazu went. Nana was in the doorway and saw.

**Where he stands:** the bedroom door, on the right of the room, is wide open and is scenery, not a hiding place (decision 26). Nana's head and shoulders lean round its frame.

**The exchange** (speaking.md: two people the child has watched many times):
- **Watch** (L2 in 1b, once a round): Nana appears in the doorway. Nani turns to him: "Nana, where's Zazu?" Nana: "I think he's under the bed." Nana's answer is the ask: the card's row comes from his words.
- **Handover** (L3): Nani turns to face the child (the turn and the mic bubble from speaking.md). The card shows Zazu's face, greyed because he's hidden. The child asks "Where's Zazu?" Nana answers with a place, and that place decides the search.
- **Alone** (L4): no model line first. **The ask varies in Kutchi:** "Where's the big one?" / "Where's the small one?" (*wadho*, *nindho* **✓**), using L3's names for the cats.

1. **Do:** say it, or tap one of two pills, each with its speaker. The pills are always there.
2. **Challenge:** saying the frame, then hearing Nana's place word. The place decides, and the asking earns the speaking bonus.
3. **Fun:** Nana's pointing finger and his deadpan "I think …". If the recogniser hears the wrong name, Nana answers for that cat ("Simba? He's right there, by your feet!"), and the found cat waves its tail. It's a funny consequence, never a verdict.
4. **Instruction:** the watched exchange, the mic bubble, and the face on the card.
5. **Novel:** the one moment in the game where the child asks (research-mechanics, "Ask to find out", ranked 8th; speaking.md calls asking the hardest part). **Said plainly:** at L2-L3 the two pills share the same Kutchi (*kida ai*) and differ only by a cat's name, so it is a starter rung that tests a name. L4's big and small is where the Kutchi itself varies.

**Closed set:** 2 (Simba / Zazu at L2-L3; the big one / the small one at L4), which sound different. It never blocks:
- with no mic, or two null results, the pills;
- in Grandparent mode, a parent's ✓.

**The leak test:** the pills earn no speaking bonus. The search after Nana's answer is M1's, with M1's fixes.

---

### M8. Simba's mischief (woven in)

The last find of each round comes with something the cat took: Nana's glasses, Ali's sock, Big Ma's reel of thread or Nani's purse (one a round, random). **In 1a the thing drops on the floor silently**: no line, no new clip. A small "for later" tray in the side panel takes its picture. The thing is named in pick it up, where its word decides. "Simba took Nana's glasses!" is added once Mum has recorded it.

That tray is the carry into pick it up and put it back. It is a new shared element, so it belongs to the shared-layer owner, not `js/hide/`.

---

## 4. The first-ever round, screen by screen

The child is 4 and can't read. A grown-up may be beside them. **The first tap comes within about 10 s.**

1. **The door** (built). Nani opens it. A black tail whisks past behind her and a bell jingles. Nani: "Simba and Zazu are hiding! Shall we find them?" The door swings, the house opens as the doll's house (two storeys: downstairs the kitchen and the sitting room, upstairs the bathroom, Nani's bedroom and Ali's room), and the camera glides gently up into Nani's bedroom (about 4 s in all).
2. **The bedroom, first frame.**
   - The room is lit by warm late-morning sun from the window on the left.
   - Left to right across the back: the wardrobe, the window with its ajrakh curtain, the bed (side on, its cover hanging to the floor), the low cupboard. The toy box sits on the rug in front. On the far right, the bedroom door stands wide open onto the landing (scenery).
   - Nani stands on the right, full height on a big screen, a bust on a phone. Simba and Zazu sit at her feet, tails flicking.
   - The side panel on the left is empty.
   - Nothing moves for two seconds (the calm start).
3. **The tour, tapped** (the rulebook's "show what isn't on the card", done with the hands). Nani names the first place, "the wardrobe", and it glows and bounces in its lit box. The child taps it: its doors rattle but stay shut, and Nani names the next. Five places, five taps (tap, then tap). The first tap lands about 8 s after the door opened. No place opens yet; opening is for the child to discover. A tap elsewhere doesn't skip it (the rulebook: a tap never skips a first-time showing); it shows once ever per player.
4. **The first hide, no count.** The light dims briefly. Simba gets up and walks straight back into the dim (not towards any place). The light returns. Simba is gone; Zazu is still at Nani's feet, looking innocent.
5. **The ask.** Nani speaks first: "Where's Simba? Look in the wardrobe." Then Simba's card pops big beside the panel:
   - Simba's face;
   - the wardrobe picture (L1);
   - the Kutchi;
   - the English under it (L1).

   In testing, before Mum records "wardrobe", the Kutchi slot shows the grey-italic English and the English line is left off: one line, never two. The card flies into its row. The guide box shows the "look" step.
6. **The first open: one live thing.**
   - The wardrobe sits in a lit box with a breathing gold glow, and it bounces once.
   - Everything else is dimmed and can't be tapped.
   - There's no finger and no ripple.
   - After 5 s with no tap, Nani says the ask again (the repeat). At 7 s, the guide's hint. In a showing neither counts.
7. **The reveal.** The child taps. The doors swing open. A beat, then Simba lifts his head from the folded clothes and blinks, green eyes and all. He stretches, leaps down with a *mrrp*, trots to Nani and winds round her legs. Nani: "There he is! Well done!" Simba's row ticks, and the wardrobe stays open.
8. **The first count.** The dim clears completely. Nani: "Close your eyes!" and covers her eyes; her hands glow once. The child taps them: "one", tap, "two" … "five". "Open your eyes!" Now Zazu is gone and Simba sits by Nani.
9. **The second ask, everything live.** "Where's Zazu? Look under the bed." The card flies to its row. The bed's cover glows (L1 support), but all five places can be tapped now.
   - Say the child taps the box instead. The lid pops and a striped sock boings out on a spring, wobbling. Nani laughs: "No!" (*na* ✓). Then the ask once more: "Look under the bed." The lid closes itself.
10. **The find.** The child taps the bed. The cover lifts, and Zazu tumbles out backwards with a dust bunny on his head, sneezes a tiny sneeze, and pounces on the cover's tassel. Nani: "There he is! Well done!" Nana's glasses drop from the cover onto the rug without a word, and their picture slides into the "for later" tray (M8). The row ticks.
11. **Close it.** Nani: "Close the wardrobe." The wardrobe glows (L1, one open place, a "yes" ask). Tap: clunk. The row ticks.
12. **The end.** Nani sits on the bed. Both cats climb into her lap and curl up, purring, with a slow blink at the child. That's the "aah": what's served is a cuddle.
13. **The shared two-page end screen** (the only word list):
    - page 1: progress (two finds, one first-open star, the time, the bulb unused);
    - page 2: the round's words (wardrobe, under the bed, where, look, close), Kutchi with English for the grown-up and a tap to hear each.

    Then "next": pick it up and put it back, starting from the glasses on the rug.

The round takes about 90 seconds and asks two places. It shows the tap, the open, the count, an empty spot's joke and the close.

---

## 5. Later visits and harder versions

| Visit | What's new | Words it adds | Engine change |
|---|---|---|---|
| **1a. The bedroom, L1-L2** (build first) | M1, M2, M3 (the close), M5 (the count to five), M8 (the thing drops silently); 7 places; no Nana, no speaking | §1, Mum's 22 clips | the openable, the cat actor, the hide logic |
| **1b. The bedroom, L3-L4** (after Zafar plays 1a) | M4 (the look-alike pairs), M6 (Ask Nana), the other ways of saying it, the blanket; the trail test (decision 11, option b) | blanket, think, know, open, big; Nana's set | Nana in the doorway; the order card's face per row |
| **2. The sitting room and the kitchen** (downstairs in the doll's house) | two more rooms, one per round, chosen at random: under the sofa, behind the sofa cushion, the kitchen cupboard, under the table, the big pot cupboard | sofa, cushion, table (*table*, inside lines), kitchen (*rasoro*, inside lines, and the recorded "he's in the kitchen" frame; **Zafar, to confirm: *rasor***); "I saw Simba in the kitchen" (*simba ke rasore me nares*, in engine); the mischief line; the count to ten | a background per room; the same data shape |
| **3. Your turn to hide** (M10) | the child drags nothing: they tap a place and the cat hides there. Nani covers her eyes, counts, then asks "Is he in the box?" The child answers *ha* or *na* (**✓** both), tapped or said (closed set 2, watched first as Nana answering Nani). Nani opens what she asked and looks puzzled or delighted. | yes and no as answers; the place words heard as questions | the "judge what is said" pattern; a tiny reversal of M1 |
| **4. Bedtime, with the torch** (M7) | the night relight of the bedroom: dark blue with the moon through the curtain. Tap a place and the torch shines there (no free drag, the lessons' "tap, then tap"). Green eyes glow back if a cat is there. At the end, "switch on the light" leads into the clean-up's verb. | torch, dark, light, night, sleep (all to record) | the night background (a relight, art bible §2); the shared dim as the dark |
| **5. The whole house** | the two-storey doll's-house cross-section shared with pick it up and the clean-up (Zafar, 1 Nov): downstairs the kitchen and the sitting room, upstairs the bathroom, Nani's bedroom and Ali's room. Room and place: "Zazu's in the cupboard in the kitchen." Tap the room (the camera glides in), then the place. At phone size see §7, "The doll's house at 740x320". | the rooms' names (kitchen *rasor* and bathroom said as "bathroom": Zafar, to confirm; the others to record); two words a move as room and place | one overview background; the room tap |

**Harder versions inside the levels** come from more places, both cats, other ways of saying it, look-alikes, and Nana's answer, never from faster or fiddlier gestures.

---

## 6. What it reuses and what is new

**Reused:**
- The shared kit, `js/shared/`:
  - the order card (`order-card.js`), the side panel and guide box (`guide.js`);
  - the light and dim (`focus.js`, `onboard.js` until it retires);
  - the bulb (`bulb.js`) and the helper card;
  - `word-card.js`, `results.js` (the two-page end screen) and `sfx.js`;
  - **Conversations (`conversations.js`)**: `Conversations.bubble` for every line's bubble (the one speech bubble in every game) and `run` for the scripted Nani-Nana exchange (1b);
  - speaking (`say.js`, `speech.js`) and the request pop-up (`request-popup.js`);
  - **WhichOne (`whichone.js`)**: the decoy check and `blindOdds` / `estimate` for the leak bot;
  - **`rel.js`**, the relations checker, for in, under and behind.
- The rules: `data/rules.json` through `js/shared/rules.js` (levels, the hint waits, the showing, the word ladder, level-up). This game's level-up override is one number there (decision 24), proposed as `advance.games["hide-and-seek"].maxNotFirstOpen: 1`, read by the game and the bot; not added tonight.
- The language engine (`js/core/lang`, `data/lang/`), which builds every line from Mum's clips.
- Designs:
  - Find it's **4d Simba's mischief** and library **L2 Openables**, **L3 The cats' trail** and **L4 The other one** (`docs/game-design/modes/find-it.md`), folded as the audit's §4 proposes;
  - Find it's tap rule: a thing is always tapped.
- The clinic's lift-to-reveal beat (the doctor lifts one named thing, `js/clinic/pipeline.js`) as the openable's starting point; the builder checks it before writing new code.
- Tidy up's **Simba's paw** greybox (`js/tidy/`) as reference for a cat that knocks things about. Its code isn't reused; the cat actor replaces it.
- The door and the evening book (`js/day/door.js`, `book.js`) for the day's start and end.

**New to build:**

| Piece | What it is | Shared? |
|---|---|---|
| **openable** | A place with closed and open art, a content layer (cat, surprise or nothing), a tap to open, a close, and a "closes itself after its joke" option; starts from the clinic's lift beat | yes: eggs under hens, the party's presents and the beach's crabs will want it (audit §5) |
| **cat actor** | Pose swaps on real art (sit, peek, jump out, run to Nani, guilty look, curl up, overflow); paths across the floor layer; the "slip to a new place" rule | yes: the cats appear across the home day |
| **the "for later" tray** | the carried thing's picture in the side panel | yes: the shared-layer owner builds it |
| **a face per row on the order card** | M2's two rows, each with a cat's face | yes: a change to `order-card.js` by the shared-layer owner, never restyled here |
| **hide logic** | Random hiding among closed places, the move after two misses (from L2), first-open accuracy and level-up, who-and-where asks | game-only |
| **data** | `data/hide-and-seek.json`: rooms, places (art keys, words, closeable or not), the surprise pool per place, levels (places, searches, variants, support) | — |
| **lab page** | built **before the art run**: placeholder boxes for every place at every level, the panel and Nani's bust, toggles for level and cat positions, screenshots by script at the five sizes (§7) | — |
| **leak bot** | a reskin of WhichOne's odds: a random opener, an opener of the last place, a reader on placeholder English; target under 10% of rounds winning the badge from L2, and under 1% of children levelling up by chance | — |

**Files a builder would own:** `hide.html` (until the one-app shell), `js/hide/`, `data/hide-and-seek.json` and the lab entry. Shared pieces (openable, cat actor, tray, the order card's face per row) go to the shared-layer owner, never restyled per mode.

**Where this design goes once Zafar says yes:** `docs/game-design/modes/hide-and-seek.md` (the mode), and §2 as the first row of `docs/game-design/days/home.md`.

---

## 7. Art and layout

### The art it needs (one ChatGPT run per visit, the background locked first)

**Camera:** **E**, eye level, front, for the whole scene (art bible §3): horizon at about 50-55%, one-point perspective, verticals vertical. The room is a straight-on stage set. Every sprite (places open and closed, cats, Nani, Nana, surprises) is drawn in this camera.

**The people and cats** come from the cast doc and the art bible: Nani from the locked sheet (`sources/art/s08/sheet-nani-final-1.png`, the lineup `lineup-v4-1.png`; a plain red dupatta, no rings); Simba and Zazu from the cast doc's photo notes (Simba a big charcoal Russian Blue with green eyes, a dark collar and a small silver bell; Zazu silver-grey, drawn as a kitten, yellow-green eyes, a plain thin collar); Nana from the cast doc (a generic kindly grandfather in his seventies, white beard, white cap, cream kurta, a shawl over one shoulder, in Zafar's skin tone).

**1a (build first):**

| Asset | Count | Notes |
|---|---|---|
| **The bedroom background, day** | 1 | Limewash walls, pale oak floor and a rug. One or two cultural nods only (an ajrakh curtain and a mirror-work frame). The bedroom door on the far right, drawn wide open onto a plain hall, as part of the background (it has no states). No clutter near any place. Lit from the upper left. |
| **Places, closed and open** | 7 × 2 | wardrobe, cupboard, bed with a cover to the floor (cover down and lifted), curtain (drawn and pulled back), the toy box (lid shut and up), the laundry basket (lid shut and up), the chest of drawers' bottom drawer (shut and pulled out). Each cut as a layer with the background's light; the open state is empty inside so content can layer in. **Nothing about a closed place may hint at what's inside.** |
| **Simba and Zazu sheet** | about 8 poses each | sit, peek (eyes in the dark), leap out, run, guilty look, curled on a lap, pounce, and one special each (Simba sleepy on folded clothes and squeezed into the drawer; Zazu with a dust bunny). Head and tail as separate layers (art bible §6). |
| **Nani poses** | 2 new | hands over eyes (the count), sitting with the cats on her lap. Standing and front poses reuse the s08 set (`nani-3q-*`, `nani-front-*`, `nani-lean-*`). |
| **Surprises** | 5 | a sock on a spring, a pigeon on the sill, a heap of towels, Ali's toy car, a ball of wool |
| **Mischief things** | 4 | Nana's glasses, Ali's sock, Big Ma's reel of thread, Nani's purse (the same items pick it up uses, so made once for both) |

**1b (after Zafar plays 1a):** the small box and the small sewing basket (2 × 2), the blanket heap (1 × 2: a soft quilt heaped on a floor cushion at the bed's foot, always lumpy, so a cat under it changes nothing); the rest of the cat poses (stretch, Simba overflowing the small box, Zazu lost in the big box with only his ears showing); Nana at the door (2: pointing, and "I think …"); 3 more surprises (a toy bear, Big Ma's thread, a slipper). **Later:** the night relight, the sitting room, the kitchen, the doll's-house overview.

All in the house's existing look (`assets/cook/bg/service.jpg` for palette and light). Real art only: code moves art and draws nothing (no drawn tails, cushions or dust).

### Layout

**Two layouts, switched by height:** the phone layout when the screen's short side is under 500 px (`data/layout.json`), the big-screen layout from 500 up. **Checked at five sizes:** 740x320, 915x275 (Zafar's Z Fold) and 930x430 (all phones), 1280x665 and 1920x1080 (big screens). The lab page proves every number below with placeholder boxes, by script, before the art run.

**Phones** (740x320, 915x275, 930x430):
- **Left:** the side panel with the card rows (about 22% of the width, about 163 px at 740). One row is the cat's face plus the place as speaker and Kutchi (from L2); at L1, the picture, Kutchi and English. The lab mocks the row at 740 with the longest Kutchi and the dotted English; text shrinks, then wraps, never clips (non-negotiable 6).
- **Right:** Nani as a bust, about 30% of the height, standing on the frame's edge. Her face is never covered.
- **Middle:** the room cropped to the band of places, keeping **a strip of wall at least 48 px tall above the places for Nani's bubble**. The ceiling and most of the floor go; the scenery gives up the room, not the places.
- **Places:** each tap box at least 64 px tall at 320 and 56 px at 275, with at least 12 px between tap boxes. At L1 the tall places (wardrobe, curtain, bed, cupboard) sit along the back and the box on the rug in front, so each keeps its shape. From L2 the basket and the drawer join the front row. At L4 (1b) ten places sit in two loose rows. If the lab shows ten don't fit at 915x275, L4 drops the blanket for nine (a data change).
- **Cats:** the cats run to Nani's feet at the bottom right, outside every tap box.
- **Bubbles:** in the wall strip above the places, never over the panel, a place's tap box or a face.
- **Nana (1b):** in the open doorway at the right of the room, beside Nani, never over the card side.

**Big screens** (1280x665 and 1920x1080):
- The whole room shows, with Nani standing full height on the right.
- The places are larger, and the floor shows the rug and the cats' run.
- The cog, top right of the play area, is the only button.

**One check:** the dim of the count must leave Nani's face, her tappable hands and the cog visible at all five sizes.

**The doll's house at 740x320** (visit 5, and the glide in at the door on every visit; Zafar, 1 Nov: one two-storey house for the three home games). The play area is about 577x320 beside the side panel. The house fills it as a cross-section: a 10 px roof line, two storeys of about 145 px each and a 20 px ground strip. Upstairs, three rooms of about 192 px wide (the bathroom, Ali's room, Nani's bedroom); downstairs, two of about 288 px (the kitchen, the sitting room). Nani's bust stands on the ground strip at the bottom right, over the sitting room's floor edge, never over a room's middle. On the overview each room is one tap box (192x145 or 288x145, far above the 64 px minimum); its places are too small to tap there, so a tap on a room glides the camera in and the room fills the play area, as in the phone layout above. At 915x275 the storeys are about 122 px; at 930x430 about 195 px. On big screens the whole house shows, and the room tap still glides in. The overview is one background, `pick-it-up-put-it-back.md`'s, so the three home games share one house.

---

## 8. What it borrows, by name

| Game | What we borrow | Why |
|---|---|---|
| **Monki Hide and Seek** (iGameMom review) | the hiding spots change after every find; the place given as a hint ("behind the house") | the reviewer says it holds young children "for a long time"; moving targets beat elimination |
| **Where's Spot?** (Eric Hill's lift-the-flap book) | a different silly creature behind every wrong flap | an empty spot is a joke, not a failure: our pigeon, sock and towels |
| **Peekaboo Barn** | opening a door always makes a sound and a reaction, right or not | keeps a small child opening; our empty-spot pool |
| **Hide and Seek, farm vocabulary app** (iGameMom) | count with your eyes closed, then search | our count beat (M5), which the child's taps drive |
| **Animal Hide and Seek** (MyFirstApp) | tap to reveal; hiding places change each level | our places grow from 5 to 10 |
| **Hidden Through Time 2** | a scene toggle (day and night) makes one scene two | our bedtime torch visit (M7) |
| **Fiete Hide and Seek** | a helper who knows | Nana in the doorway (M6) |
| **Toca House** (Common Sense review) | things that react are the toy; chores bore | every open reacts; the close step stays short |
| **The touchscreen search study** (children aged 4-25) | 4-year-olds found the target 84% of the time among 4 things and often gave up when it wasn't there | 5 places at L1; quick, fun empty spots; the first tap within 10 s |
| **Sago Mini** | no timers | there's no clock anywhere in this game |

**Sources found tonight** (web, beyond the 31 Oct research): the lift-the-flap hide-and-seek pattern for toddlers ([Peekaboo Barn, App Store](https://apps.apple.com/us/app/id6468775129); [Hide-and-Seek Mommy, a lift-the-flap book](https://mitpressbookstore.mit.edu/book/9781419785948); [Spot's Noisy Peek-a-boo](https://www.penguin.co.uk/books/192811/spot-s-noisy-peek-a-boo/9780723272717/)). Store listings only, no independent reviews; they back the "every flap reacts" idea, not the learning.

---

## 9. The lessons checklist

| Group | Verdict | How |
|---|---|---|
| **1. The heard word decides** | Pass, once recorded | Leak test per mini-game (§3). Deciding words: 7 places in 1a, 1 recorded today (*kabaat*); nothing ships until Mum's L1 list is recorded (§1). Ticks: a find always ticks (you can't refuse a cat), but fishing can't close in because the cat moves, **and the level rests on first-open finds** (decision 24), so a fisher never levels up. Accuracy is first-open only. The open need: every closed place looks the same. From L2 the card has no place picture. Who wants what rotates (the cat asked is random). Two words a move from L2 (who and where). Our own words decide, not numbers. |
| **2. Onboarding and the first round** | Pass | The first round is the tutorial, and the first tap comes within about 10 s: the place tour is tapped, and the first hide skips the count. One lit place, then everything live. Every new action is shown once: the tour tap, the open, the count tap, the close (and the handover in 1b). A tap never skips a first-time showing. The dim clears fully after the first find. Tap then tap; 5 places at L1. |
| **3. Instructions** | Pass | Nani is on screen and speaks before each card. The card is what's wanted and never changes; the guide says the step. Nana and Nani model the exchange before the handover (1b). Replays are free and say only what's left. One line per moment: no name on every tap. |
| **4. Pacing and waiting** | Pass | No Next and no Done; each find moves on by itself. The count is driven by the child's taps, and Nani counts on by herself after 2 s, so nobody waits. Three helps, each with one meaning (§3): the free repeat at 5 s, the guide's hint at 7 / 9 / 11 / 13 s from the last ask, the bulb's helper card at a cost. No timer. A cat never leaves before it's asked for (it moves only after misses, and only from L2). |
| **5. Feedback and the end** | Pass | A miss gets a different funny empty spot and Nani's laughing "No!", never a frown. A wrong close shakes and repeats the word. Rows tick when the find or close happens. It ends the moment the last close is done, back with Nani, with the cuddle served, then the shared two-page end screen, the only word list. |
| **6. Layout** | Pass, to check in the lab first | Two layouts, switched at a short side of 500 px; all five sizes in §7, proved with placeholder boxes by script before the art run. Nothing goes over a face; a wall strip is kept for bubbles. Items and faces stay big. The left is for the cards, Nani on the right, Nana in the doorway in the middle-right (1b). One background. The cog is the only button. |
| **7. Art and camera** | Pass | One camera (E). Nothing drawn in code. Clean cut-outs with contact shadows. Calm faces and gentle zooms. Nani from the locked sheet, with a three-quarter pose and a front-facing one for the handover. One surprise per mock-up. All of 1a's new art goes in one paste block, with the bedroom locked first. |
| **8. Speaking** | Pass in 1b; none in 1a | Ask Nana, inside a two-person exchange watched first. A closed set of 2 with the pills always there; at L2-L3 it tests a name (said plainly), at L4 the Kutchi varies (big and small). The mic shows what it heard. It's a play action and never blocks. No quiz. |
| **9. Levels** | **Pass with four exceptions** (§10, decisions 2, 9, 24 and 25) | L1 core, "yes" only, everything shown; L2 more of it plus who; L3 other ways of saying it; L4 look-alikes. The Kutchi gets harder, not the gestures. Every level is designed and has its own new thing; L4 isn't a faster L3. **Exceptions:** L1 has 2 searches (two cats); "no" asks arrive at L3, not L2; level-up also needs first-open finds; the card's place picture is L1 only. |
| **10. Words and recording** | Pass, with Mum's list | Every line is listed in §1 against Mum's clips, with **the L1 minimum (19 clips) and 1a's total (22)**, reusing *na*, *huda*, *shabash* and *kida ai*. One natural sentence per person per moment. Things are named as they are ("the small box"). Every count is said. About 3 places a round, each heard 3+ times; the Kutchi shows until picked right three times in a row. |
| **11. Culture** | Pass | No religious markers in the bedroom (no prayer mat, no shrine, no text). Modest clothes. No food rewards: the reward is the cats' cuddle. Safety: a cat is never shut in anywhere, and nobody climbs into a wardrobe or box (only cats hide). |
| **12. Fun and delight** | Pass | The hands do something at every step, the tour and the count included. The "kind of funny" moments: Simba overflowing the drawer (and the small box in 1b), Zazu's dust-bunny sneeze, the guilty getaway. A gesture that feels good: the doors' swing and the clunk. Contrast: big Simba and tiny Zazu. No fatigue: the reveals never repeat within a round. Nani's asks give the toy a goal, and the find carries into the evening book. |
| **13. Mistakes made twice** | Pass | "Everywhere" rules come from the shared kit, not this game (Conversations, WhichOne, rel.js, the order card's change). Motion is judged on film (the reveal and the slip-away). Every level, a full round and every size are in the lab, before the art. No design question is left for the builder (§10); Nana's voice is open but only blocks 1b. No mechanic is replaced: Find it's and Tidy up's pieces are folded as the audit's list proposes, which Zafar agreed (31 Oct, answer 3); the trail's lying clue is kept as a choice (decision 11). The bulb waits and voices never overlap. No English reaches the child: the empty spot is Nani's *na* ✓. |

**The ten questions, answered:**
1. **The deciding words:** 7 place words in 1a (1 recorded), then the names, then big and small in 1b.
2. **How would the Sceptic win at L2 and above?** By opening everything: the cat moves after two misses, and the level needs first-open finds. By matching the card: there's no place picture from L2. By reading the placeholder English: nothing ships until recorded. By guessing who: the wrong cat runs.
3. **The open need the picture can't settle:** up to ten identical closed places, one cat, and no picture on the card.
4. **What the first round lights up:** the five places one by one (tapped), the wardrobe alone, then everything, with the bed's glow.
5. **Who asks, and in which sentence:** Nani, "Where's Simba? Look in the wardrobe."; in 1b, from L3, Nana answers the child.
6. **What the hands do:** tap at every step: the tour, the count, the open, the close.
7. **The "kind of funny" moment:** Simba squeezed into the drawer; the guilty getaway.
8. **The end:** the cats on Nani's lap, then the shared end screen. What's served is a cuddle.
9. **What changes per level:** places 5 / 7 / 8 / 10; who; other phrasings; look-alikes. L4 is its own.
10. **All five sizes:** yes, proved in the lab with boxes before the art, then with real art in one camera (§7).

---

## 10. Decisions made for Zafar overnight

Each is the choice, the reason, and the answer I assumed he'd give. Any can be reversed. Decisions 24-33 were added after the critique; 5, 8, 10, 11, 16, 20 and 22 were changed by it.

1. **The first visit is one room, Nani's bedroom,** upstairs in the two-storey doll's-house home (Zafar, 1 Nov), the room the grandchildren sleep in, so a toy box belongs there. More rooms on later visits. *Reason:* one background keeps the art run small, and 5-10 places fit one room. *Assumed:* yes.
2. **L1 has one cat hiding at a time, two searches a round** (Simba, then Zazu). This overrides the rulebook's 1 at L1. *Reason:* both cats are the story, and one hidden target keeps L1 a pure "where". *Assumed:* yes.
3. **The glow is only at L1, with Nani's line. From L2 the only glow is help** (the guide's hint, which counts, or the helper card, which costs a bulb). *Reason:* his "it glows at first", and the research says a glow is fine at L1 only. *Assumed:* yes.
4. **From L2, a cat slips to a new place after two empty opens.** It's heard (patter and bell), not seen, and Nani says the new place. *Reason:* it ends elimination; Monki does it. Not at L1, because the youngest give up if the target moves. *Assumed:* yes.
5. **Accuracy (the badge) counts only first-open finds; so does the level (decision 24).** A later find still ticks the row. *Reason:* the lessons' "tick only the right item, first go", balanced with "you can't refuse a found cat". *Assumed:* yes.
6. **Empty places close themselves after their joke; the cats' places stay open for the close step.** *Reason:* a readable room, and a real choice when closing. *Assumed:* yes.
7. **A close step at the end of every round** ("close the wardrobe"), with the cats always out first and never shut in. *Reason:* he gave this game "open and close"; it seeds the clean-up; and it's safe to copy. *Assumed:* yes.
8. **The count is a beat the child drives:** "Close your eyes!", one tap on Nani's hands per number (she counts on by herself after 2 s), "Open your eyes!". To five at every level; ten is a later data change once six to ten are recorded. No hold. The first-ever hide skips it. *Reason:* the research's favourite moment, open and close heard every round, and the hands busy instead of a wait. *Assumed:* yes.
9. **"No" asks come at L3 as one of the other ways of saying it** ("he's under the bed, not in the wardrobe"), not at L2. This overrides the rulebook. *Reason:* L2's new thing is who and where; one new thing a level. *Assumed:* yes.
10. **The speaking moment is asking Nana "Where's Zazu?", in 1b:** watched at L2, handed over at L3, alone at L4, where the ask becomes "where's the big one / the small one?". A closed set of 2. *Reason:* the only mechanic that makes a child ask; *kida ai* is recorded; at L2-L3 it tests a name, which is fine for a starter rung, and L4 makes the Kutchi vary. *Assumed:* yes. Nana's lines play in whoever's takes we have, else the device voice (Zafar, 1 Nov); nothing waits on a voice.
11. **The cats' trail and the bell, two options:** (a) no clue before the find; prints appear after it, as a route replay ("so that's how he got in!"), and big and small paws feed L3's "the big one / the small one"; (b) a bell or prints before the find at L3-L4 that point to the right place only half the time, so the clue can lie and the word still decides (Find it 4d's "a clue that can lie", and the research's "decoy tails"). *Chosen:* (a) in 1a, (b) as a test in 1b, judged by the bot. *Reason:* a clue that is always right is visual search (a leak); one that lies half the time keeps the folded mechanic he agreed without leaking. *Assumed:* yes.
12. **The torch is a later visit (bedtime), not a level, and it's tap-to-shine, not drag.** *Reason:* the lessons' "drag only along a track"; the night relight is cheap; it leads to "switch on the light". *Assumed:* yes.
13. **"The other one" is L4's recast on look-alike pairs, decided by big and small** (two boxes, two baskets), in 1b. This side and that side stay with pick it up. *Reason:* the rulebook's L4 look-alike; Mum's order for sides. *Assumed:* yes.
14. **Simba's mischief: each round's last find comes with one thing a cat took** (Nana's glasses, Ali's sock, Big Ma's thread, Nani's purse), and it carries into pick it up. In 1a it drops silently and is named in pick it up. *Reason:* the audit's fold, the day's carry, and Toca Town's carry-it-home; no clips needed here. *Assumed:* yes.
15. **No timer and no losing**, anywhere. *Reason:* non-negotiable 7; Sago's rule. *Assumed:* yes.
16. **Places per level 5 / 7 / 8 / 10; searches 2 / 3 / 3 / 4,** set in the data. If ten don't fit at 915x275 in the lab, L4 drops the blanket for nine. *Reason:* the 4-6 at L1 he set; the research's search study; the old "9" at L4 miscounted the two added twins. *Assumed:* yes.
17. **"Your turn to hide" (yes and no) is the third visit,** not the first. *Reason:* keep the first visit small; *ha* / *na* are recorded, so it's cheap later. *Assumed:* yes.
18. **Every place fits both cats.** Simba in the drawer or the small box is a joke, not a rule. *Reason:* size must never narrow the guess. *Assumed:* yes.
19. **Under the bed means a bed cover hanging to the floor, lifted on a tap.** No gap shows underneath. *Reason:* the open need. *Assumed:* yes.
20. **If Mum says wardrobe and cupboard are both *kabaat*, the bedroom keeps one of them** (the one her word means) **and swaps the other for a suitcase** (to record), never two places with one name. The drawer is already in from L2 (decision 26). *Reason:* the place word must decide. *Assumed:* yes.
21. **Cat sounds are mono and centred, never from the cat's place.** *Reason:* hearing direction is not Kutchi. *Assumed:* yes.
22. **An empty spot is Nani's laugh and "No!" (*na* ✓), then the ask once more.** The surprises aren't named in Kutchi on the first visit. *Reason:* no new clip, one line per moment; later visits can name them. *Assumed:* yes.
23. **The game's file names:** `hide.html`, `js/hide/`, `data/hide-and-seek.json`. *Reason:* the existing pattern. *Assumed:* yes.
24. **Level-up rests on the finds** (rulebook override 3): up after 3 finished rounds in a row where every find was first-open (Zafar, 1 Nov: level up only on right-first-time rounds, in every game), and the guide's hint came at most once. The finds still always tick. The number goes in `data/rules.json` for the game and the leak bot (`advance.games["hide-and-seek"].maxNotFirstOpen: 0`, when built). *Reason:* without it a fast tapper never idles into a hint, finds every cat eventually, and climbs to L4 knowing no place word. *Assumed:* yes.
25. **The card's place picture shows at L1 only** (rulebook override 4: the rulebook shows it at L1-L2, `cardPicture: [true, true, false, false]`); from L2 the card is speaker and Kutchi, and the cats' faces stay. One rule everywhere: M1, M2, M3, M4 and §4 all follow it. *Reason:* at L2 a place picture is picture-to-scene matching among seven places, a 100% win with no Kutchi; the clean-up already has "the card's picture at L1 only". *Assumed:* yes.
26. **The door is not a hiding place; the chest of drawers' bottom drawer joins at L2 instead.** The bedroom door stays wide open as scenery, and it is Nana's doorway in 1b. *Reason:* Nana leans round the door, so it can't also be a closed place (a leak and a muddle). The window can't be his either: the curtain there is a hiding place. *Assumed:* yes.
27. **The first visit is split: 1a (L1-L2) is built first; 1b (L3-L4, Nana, the speaking moment, the look-alike pairs) after he has played 1a.** *Reason:* the research sized this as a small reskin of Find it's openables; 1a is about a third of the art and no new speaking or voice. Nothing is dropped, only ordered. *Assumed:* yes.
28. **The first-ever round gets to a tap in about 10 s:** the place tour is tapped (Nani names a place, it glows, the child taps it, it rattles but stays shut), and the first hide has no count. A tap never skips the tour (the rulebook's first-time showing). *Reason:* 25 s of watching loses a four-year-old; tap, then tap. *Assumed:* yes.
29. **Three helps, one meaning each:** the free repeat at 5 s; the guide's hint at 7 / 9 / 11 / 13 s **from the last ask**, which counts for level-up; the bulb's helper card, which costs a bulb and doesn't count. *Reason:* the rulebook's "from the last action" read so that fishing can't reset it. *Assumed:* yes.
30. **Mum's L1 list is 19 clips, 22 for all of 1a,** ordered by what unblocks play (§1), reusing *na*, *huda*, *shabash*, *kida ai* and the "he's in the kitchen" frame; "cat", the mischief names, six to ten and the surprise names are deferred, and think and know wait for 1b (still in Nani's lines, as he asked). Nothing ships until the 19 are in. *Reason:* the old "about 20 new words" hid a list of 45-50 clips. *Assumed:* yes.
31. **"In" is *me*,** as in Mum's recorded *e rasore me ai*; *andar* is not used here. *Reason:* one word per meaning, and it matches her frame. *Assumed:* yes.
32. **One surprise per mock-up; Nana is a separate character study; the prompts attach the locked Nani sheet and the lineup**, with `nani-sheet.webp` as a render-style reference only, and cite the cast doc for the cats and Nana. *Reason:* the game never shows two surprises at once, and the placeholder sheet isn't Nani. *Assumed:* yes.
33. **The lab page comes before the art run,** with placeholder boxes at the five sizes and every level, screenshots by script. *Reason:* the phone layout was asserted, not checked; the panel row and ten places at 275 px are the tight spots. *Assumed:* yes.

### Open questions (genuinely his)

None left. Zafar answered both on 1 Nov: Nana's lines play in whoever's lines we have; Kasuku's squawk is tried from Mum's clip, and Zafar can imitate a parrot if that fails.

---

## 11. ChatGPT mock-up prompts

Attach the listed references to each prompt. The cats have no reference sheet yet, so they're described in words from the cast doc's photo notes (`docs/game-design/cast.md`); ChatGPT is never the authority on how they look. Nani comes from the locked sheet and lineup; `nani-sheet.webp` is attached only for the render style. One surprise per frame. The bedroom is Nani's bedroom, upstairs in the two-storey doll's house (Zafar, 1 Nov); these prompts show it close up, so the scene text is unchanged.

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

### Prompt hide-and-seek-1: the first find (L1, the bedroom by day)

Shows the core: the child opened the wardrobe and the big black cat is inside, while every other place stays closed and alike. It's the picture that explains the whole game.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: a bright, modern bedroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about half height, one-point perspective, verticals vertical. Limewash cream walls, a pale oak floor with a soft rug. Left to right along the back wall: a tall pale-oak wardrobe with two doors; a window with a soft indigo block-printed curtain drawn closed; a single bed seen side-on with a patterned cover hanging all the way to the floor so nothing underneath can be seen; a low sage-green cupboard with one door. On the rug in front, a closed wooden toy box with a lid. On the far right, the bedroom door stands wide open onto a plain hallway; nobody is in it. One small mirror-work frame on the wall, nothing else on the walls. Warm late-morning sunlight from the upper left, soft contact shadows.

The moment: the wardrobe doors have just swung open. Inside, on a pile of folded clothes, a big solid charcoal-black cat with green eyes, a round face and a dark collar with a small silver bell, lifts his head and blinks sleepily, clearly delighted to be found. Every other place (curtain, bed cover, cupboard, toy box) is closed and looks ordinary: no tails, no bulges, nothing peeking out. On the right edge of the frame stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. She is turned three-quarters towards the wardrobe, laughing with her hands together. At her feet sits a small silver-grey kitten with big ears, a big head and yellow-green eyes, looking up at the wardrobe.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, believable materials, no outlines, no cel shading, no photorealism. Calm, uncluttered, modern with only a hint of Kutch and East African culture.

Absolutely no text, letters or numbers anywhere: not on the toy box, the wall, the curtain or any object.

Must read at phone size (the image will be shown about 320 pixels tall): each of the five hiding places as a clearly separate, big, simple shape; the cat's green eyes inside the wardrobe; the grandmother's face.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp (render style only, not her face)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png (how animals are drawn)
```

### Prompt hide-and-seek-2: a funny empty spot (L2, both cats hiding)

Shows that a wrong place is a joke, not a failure. One surprise only, both cats hidden, no Nana.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: the same modern bedroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about half height. Limewash cream walls, pale oak floor, a soft rug, warm sunlight from the upper left. Along the back: a tall pale-oak wardrobe (closed), a window with an indigo block-printed curtain (drawn closed), a single bed with a patterned cover hanging to the floor (down), a low sage-green cupboard (closed), and a small pale-oak chest of drawers with its bottom drawer shut. On the rug in front: a woven laundry basket with its lid on, and a wooden toy box. On the far right, the bedroom door stands wide open onto a plain, empty hallway.

The moment: the toy box's lid has just popped up and a single striped sock has bounced out on a little spring, wobbling comically in mid-air. That is the only thing open. No cats can be seen anywhere: every other place is closed and looks ordinary, with nothing peeking out. On the right edge stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs, a plain red dupatta over her head, thin round gold glasses, no rings. She laughs at the sock with a hand to her cheek.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, believable materials, no outlines, no cel shading, no photorealism. Calm, modern, uncluttered: one joke, one face.

Absolutely no text, letters or numbers anywhere: not on the sock, the box, the drawers or any object.

Must read at phone size (about 320 pixels tall): the seven hiding places as separate, simple shapes that all look equally closed; the sock; the grandmother's face.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp (render style only, not her face)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt hide-and-seek-2b: Nana at the door (a character study for 1b)

Not a gameplay frame: Nana alone, so his look can be approved before he goes into the room.

```
Character study for a children's language game (ages 3-8). Two poses of the same man side by side on a plain warm cream background, nothing else in the picture.

The character: a kindly grandfather in his seventies with a neat white beard, a plain white cap, a cream kurta and a soft shawl over one shoulder. Warm light-tan skin (midtone about #C49A78, never orange). A gentle, slightly deadpan, knowing face. He is a generic character: he must not look like the older man in the attached lineup, whose picture is attached only for the style and skin tone.

Pose 1: his head and shoulders lean in round the edge of a pale-oak door frame (only the frame's edge shows), smiling knowingly and pointing a finger to the left, as if he knows where the cat is hiding.
Pose 2: the same lean round the frame, one finger raised beside his cheek, eyebrows up, as if saying "I think …".

Style: match the attached references: a stylised 3D animated-feature look, soft warm light from the upper left, chunky simplified shapes, believable fabric, no outlines, no cel shading, no photorealism. Camera at eye level, straight on.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (each pose about 120 pixels tall): his face, the beard and cap, the pointing hand.

Landscape frame, about 2:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (style and skin tone only)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp (how generic family members are drawn)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (palette and light)
```

### Prompt hide-and-seek-3: the big cat in the small box (L4, 1b, look-alike pairs)

Shows the hardest level: two boxes and two baskets of different sizes, where the size word decides, and the game's best joke. The kitten is still hidden, so it is not in the picture.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: the same modern bedroom in a grandmother's house, straight on at eye level like a stage set. Limewash cream walls, pale oak floor, soft rug, warm sunlight from the upper left. Along the back: a closed pale-oak wardrobe, a window with an indigo block-printed curtain drawn closed, a bed with a patterned cover hanging all the way to the floor, a low sage-green cupboard, a small chest of drawers with its bottom drawer shut, and a soft quilt heaped on a floor cushion at the foot of the bed. On the rug in front, clearly side by side as look-alike pairs: a big wooden toy box and a small wooden box of the same design; a big woven laundry basket and a small woven sewing basket of the same design, all with lids. On the far right, the bedroom door stands wide open onto an empty hallway.

The moment: the lid of the SMALL box has just been lifted, and a big, solid charcoal-black cat with green eyes and a collar with a small silver bell is squeezed inside it, far too big for it, spilling over the edges with a sheepish, proud face. Everything else is closed and looks ordinary: the big box beside it is shut, the bed cover hangs straight to the floor, the quilt is just a soft heap, and no other cat, tail, ear or eye can be seen anywhere. On the right edge stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs, a plain red dupatta over her head, thin round gold glasses, no rings. She laughs with both hands over her mouth.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. Calm and uncluttered; the joke comes from the cat, not from mess.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 320 pixels tall): the size difference between each pair (the big box and the small box, the big basket and the small basket); the black cat overflowing the small box; the grandmother's face.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp (render style only, not her face)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png (how animals are drawn)
```

### Prompt hide-and-seek-4: bedtime with the torch (later visit)

Shows the night version: the same room relit for night, a torch beam where the child tapped, and the cat's eyes shining back (the find itself, so a visible cat is right here). It proves the room works as a relight, not a redraw.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: the same modern bedroom in a grandmother's house, straight on at eye level like a stage set, now at night. The same furniture in the same places: a pale-oak wardrobe, a window with an indigo block-printed curtain half open showing a deep blue night sky and a soft moon, a bed with a patterned cover hanging to the floor, a low sage-green cupboard, a small chest of drawers, a wooden toy box and a laundry basket on the rug, the bedroom door open onto a dark hallway. The room is dark in a cosy way: cool blue moonlight from the window and a soft warm glow from a small bedside lamp turned very low. Shadows are soft.

The moment: a round, warm pool of torch light falls on the bed, where the cover has been lifted a little. In the dark gap under the bed, two big yellow-green eyes shine back and a silver-grey kitten with big ears blinks, caught and pleased. Everything else is in gentle darkness; no other eyes, tails or shapes give anything away. On the right stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs, a plain red dupatta over her head, thin round gold glasses, no rings. She holds a simple torch, smiling, lit softly by its glow.

Style: match the attached references: a stylised 3D animated-feature look, chunky simplified shapes, believable materials, no outlines, no photorealism. Night lighting that stays warm and safe, never scary.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 320 pixels tall): the torch pool and the kitten's shining eyes; the outlines of each hiding place even in the dark; the grandmother's face.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp (render style only, not her face)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png (how animals are drawn)
```

---

## 12. Changes after the critique

The critique (`hide-and-seek-critique.md`, 1 Nov) had 5 MUSTs and 12 SHOULDs. All were applied; nothing in it clashed with Zafar's recorded word (his 4-6 places at L1, the glow at first, open it and the cats are there or not, the day's order, the fold list, know and think in Nani's lines all stand).

| # | Finding | What I did |
|---|---|---|
| 1 | **MUST.** A child levels up by fishing: finds always tick, the slip never blocks, level-up counts only the hint. | Level-up now also needs first-open finds: at most one find a round not first-open, over 3 rounds in a row (decision 24, rulebook override 3). Written into §3's overrides and leak table, §6 (the proposed `data/rules.json` entry, not added tonight: no other file edited), §9 rows 1 and 9. |
| 2 | **MUST.** The card's place picture at L2 is a matching leak, and the design said two things. | One rule: the place picture at L1 only, speaker and Kutchi from L2, the cats' faces stay (decision 25, rulebook override 4). M1, the ladder, the leak table, M2, M3, M4 and §4 now all say the same. M4's "right-sized box picture before support" is gone. |
| 3 | **MUST.** Mum's list was undercounted. | New table "What Mum records for L1 to play": 19 clips, ordered by what unblocks play; 22 for all of 1a; about 6 more for 1b plus Nana's set; about 19 deferred; 45-50 in all. Reuses *na*, *huda*, *shabash*, *kida ai* and the kitchen frame; the empty spot is now *na* ✓ with a laugh; the mischief names, "cat", "hide" alone, think, know and six to ten are deferred. A plain line at the top: nothing ships, and the bot has nothing to measure, until the 19 are in (decision 30). |
| 4 | **MUST.** Nana leans round the door that is also a hiding place. | The door is dropped as a place; the bottom drawer (decision 20's spare) joins at L2. The door is wide-open scenery and Nana's doorway (decision 26). Not the window: its curtain is a hiding place. Words, ladder, art and prompts updated. |
| 5 | **MUST.** Prompt 2 asked for a muddled screen. | Prompt 2 is now one surprise (the sock), everything else closed, Nani alone. Nana has his own character study, prompt 2b. |
| 6 | SHOULD. 25 s of watching before the first tap. | The tour is tapped (each place rattles but stays shut), and the first-ever hide skips the count: the first tap lands about 8 s in (§4, decision 28). The tour is no longer skippable by a tap, matching the rulebook's first-time showing. |
| 7 | SHOULD. The count is a wait with no clips and a hold. | The child taps Nani's hands once per number; she counts on herself after 2 s; no hold; to five at every level, ten later in data (M5, decision 8). One to five are on Mum's L1 list. |
| 8 | SHOULD. Three hint stories. | One paragraph, "The three helps": the free repeat at 5 s, the guide's hint at 7 / 9 / 11 / 13 s from the last ask (counts), the bulb's helper card (costs a bulb, doesn't count) (decision 29). §4 and §9 row 4 match. |
| 9 | SHOULD. The phone layout was asserted, not checked. | The lab page with placeholder boxes comes before the art run, by script, at the five sizes, 930x430 now placed as a phone; the switch is a short side of 500 px; a 48 px wall strip for bubbles; L1's tall places along the back; the panel row mocked at 740; one line, not two, on an unrecorded L1 card; the face-per-row change goes to the shared-layer owner (§7, §6, decision 33). |
| 10 | SHOULD. The first visit is too big. | Split into 1a (L1-L2: M1, M2, M3, M5, M8 silent; 7 places, about 8 poses a cat, 2 new Nani poses, 5 surprises, no Nana) and 1b (L3-L4, M4, M6 with Nana, the pairs, the rest). Decision 10 and open question 1 move to 1b (decision 27). Nothing is dropped. |
| 11 | SHOULD. Reuse missed. | §6 names Conversations (bubbles and the exchange), WhichOne (the decoy check and the bot's odds), `rel.js` (positions) and the clinic's lift beat as the openable's start. |
| 12 | SHOULD. The lying clue was cut, not offered. | Decision 11 now offers (a) no clue before the find and (b) a bell or prints that are right half the time at L3-L4; (a) in 1a, (b) tested in 1b. M9's row says the same. |
| 13 | SHOULD. Prompt 3 showed a peeking kitten; the prompts attached the placeholder Nani. | Prompt 3's bed cover is down and no second cat shows. Every prompt now attaches `sheet-nani-final-1.png` and `lineup-v4-1.png`, keeps `nani-sheet.webp` as render style only, says a plain red dupatta and no rings, and the cats follow the cast doc. |
| 14 | SHOULD. The leak maths was generous. | Recomputed with the shrinking pool: under 1% a round at L2 (about 0.5%), under 0.1% at L4, and three level-up rounds in a row by chance under 0.1%; "the bot prints the real numbers". The L4 place count is corrected to 10 (the old 9 missed one twin), with a fallback to 9 if the lab says so. |
| 15 | SHOULD. The words were served twice at the end. | Step 12 is the cuddle only; the shared two-page end screen is the only word list. |
| 16 | SHOULD. Ask Nana varies only a name. | Said plainly in M6; at L4 the ask becomes "where's the big one / the small one?" (*wadho*, *nindho* ✓). M6's challenge score is lowered from 5 to 4. |
| 17 | SHOULD. Small things. | "In" is *me* (decision 31); the prompts cite the cast doc; the "for later" tray goes to the shared-layer owner; §6 says where the design lives once he says yes. |

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **The home:** one two-storey doll's house for the three home games (downstairs the kitchen and the sitting room; upstairs the bathroom, Nani's bedroom and Ali's room). The first visit is Nani's bedroom, upstairs; visit 2's rooms are downstairs; visit 5 is the whole house, with its 740x320 layout in §7.
- **Level up only on right-first-time rounds:** every find first-open (decision 24, §3).
- **Voices:** Nana's lines in whoever's takes we have, else the device voice; Kasuku's squawk from Mum's clip, or Zafar's parrot. Both open questions are answered and removed.
- **Words:** *bund* (close) and *rasor* (kitchen) are in the tables as "Zafar, to confirm"; the bathroom is said as "bathroom". **Clothes:** the prompt sheet's line is added before the prompts (Nana's study, prompt 2b).
