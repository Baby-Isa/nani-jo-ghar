# "Nani says, do it": musical statues and getting ready (slug: do-it-engine)

Designed overnight on 1 Nov 2026, while Zafar slept, on his instruction to design every game on his likely answers; revised the same night after an independent critique (`do-it-engine-critique.md`; what changed is in §12). Every choice he hasn't made is in §10, so he can reverse it by number. Nothing here is built or agreed. Kutchi appears only where it's already in the repo (`data/lang/lexicon.json`, `data/family-audio.json`, the word inventory). Everything else is English, marked "to record".

Sources, newest first:
- The scope for this design and Zafar's answers at the foot of `build/reports/games-master-map-2026-10-31.md` (1 Nov). The relevant rows: musical statues, getting ready, the clean-up, Part 3's verbs, Part 7's days, and question 16 (the music: "your call", still open).
- `build/reports/game-settings-map-2026-10-31.md`: row 9 (statues, "Nani says, do it" fits it exactly), row 22 (the school day), and his notes ("perhaps the morning routine (kids know it)").
- The research of 31 Oct:
  - other games §1 (party) and §12 (school), plus "ours that look weak";
  - mechanics: finding 2 (verbs come from doing), finding 5 (the same scene repeated teaches), the big table's "Nani says, do it" and "Simon says" rows, and the top 10, number 1;
  - existing games §5 (the one "say it, Ali acts" moment);
  - the word inventory and the target wordlists.
- The sibling designs of tonight, as revised after their critiques: `party-gifts.md` (its cast decision: the host family's grandparents are *dada* and *dadima*; its day order, which this doc follows), `party-guests.md` (the party children Zara and Yusuf: placeholders), `wake-up-clock.md` (what carries into getting ready) and `school-day.md` (the child packs the bag).
- `lessons-checklist-2026-11-01.md`, the rulebook (`docs/game-design/rulebook.md` §1, Zafar's 28-29 Oct rules), `speaking.md`, `docs/language/grammar-notes.md`, and the art bible §1-3.

---

## How it plays (in 30 seconds; Zafar asked, 1 Nov)

**Musical statues, at the party.** Two party children, Zara and Yusuf, dance in the middle of the room while Nani claps the beat. Nani stops clapping: the music stops, and the two children bob on the spot, waiting. Nani calls a pose in Kutchi, say "sit!". Beside the dancers stand two to five picture cards (sit, jump, turn round, and later stand, stop, touch your nose). The child taps the card for what Nani said, and both dancers snap into that pose and hold it, with a click and a giggle. Then Nani says "dance!", the music bursts back, and they dance again. Tap the wrong card and the dancers do that pose as a funny mistake; Nani says the call again and the child taps again. About six stops make a round. Once a play, Nani turns to the real child, "now you!", and the child in the room dances and freezes too. Later levels add "jump, don't sit!", "touch your nose" and two calls at once, and later still the child is Nani and calls the pose out loud. At the end Zara puts a paper crown on the child's character.

**Getting ready, on the school day,** is the same game with a different room: Ali and two little cousins stand in pyjamas; Nani says "Ali, comb your hair", the child taps the comb, and Ali combs his hair. Nani calls the jobs in any order and to any child, so only the words say which.

---

## 0. One line

| | |
|---|---|
| **What it is** | One small engine, "do it". A person can do several actions, and the heard words pick which one. The child taps, and the character does it. Two stages use it here: **A. musical statues** (the party) and **B. getting ready** (the school day: three children who slept over at Nani's). The clean-up will be the third (its own design). |
| **Days** | A: someone's birthday, after look after the guests and before the cake. B: the school day, after the wake-up clock and the door, before pack the school bag. |
| **Status** | New. Designed overnight, revised after the critique, not agreed. |
| **Engine** | New: `do-it` (actors, actions, triggers, per-actor state, a call queue). Everything around it is the shared kit: order card, guide, light, end screen, speaking moment. |
| **Rough size** | Engine: small, about one sprint with both stages greyboxed. Art: two party dancers with about 12 poses each; three children as layered "dress-up dolls" built on `js/dress/doll.js` (a lab page first). **Recording is not a blocker for the prototype** (Zafar, 1 Nov: existing takes, else the device voice; voices are settled before shipping). 2 of the statues verbs are in the engine (sit *we*; turn *firai*, if Mum uses it for a person) and none has its own clip. Of getting ready's calls, only "eat" ✓ has a clip. Visit 1 is the scope's vocabulary only; everything else is visits 2-3 (§5). |

---

## 1. The language goal

**Word groups:**
- **A, statues.** Main: body-moving verbs. Then body parts (the head only, on visit 1).
- **B, getting ready.** Main: routines. Then the body (teeth, hair, face, hands) and clothes (socks, shoes).
- **Small words:** "your", "not / don't" (L2, the rulebook's "no" ask), and "first ... then" (L4).

**Form:** the bare command to a child. This is the first verb form children learn (verbs research §6, "commands first"), and it's the form Nani uses. The elder form waits for visit 2, when the host family's *dadima* joins the dancing, and only once Mum has recorded it (every verb here has `imp.polite: unknown` in the lexicon).

### The words it teaches (visit 1)

Key:
- **✓** means a family clip of its own, or a whole recorded line.
- **in engine** means the Kutchi is in the repo but has no clip of its own yet.
- **to record** means no Kutchi yet.

**A. Musical statues**

| English | Kutchi in the repo | State | Level it decides from |
|---|---|---|---|
| sit | *we* | in engine (confirmed; heard in "sit opposite me", *munje same we*, also in engine) | L1 (first rounds) |
| jump | | to record | L1 (first rounds) |
| turn (round) | *firai* | in engine as "turn over, stir" (a cooking word). Mum to say whether she uses it for a person turning round | L1 (joins within L1) |
| dance | | to record. Heard at every stop from L1 (Nani's "dance!" as the music starts); decides from L2 | L2 |
| stand (up) | | to record. *gadi ke ubhi rakh* ("stop the car, keep it standing") is in the engine; never lift a word out of it | L2 |
| stop (freeze like a statue) | | to record. Mum has said "stop" is the English *stop* (grammar-notes §25, B19), or *gadi ke ubhi rakh* for a car. Her sheet asks her to **confirm** she'd say *stop!* to children freezing, not to invent a word | L2 |
| don't (the "no" ask: "jump, don't sit!") | *... na* | the pattern is in the engine (*ad na*, "don't touch"; *bhaj na, hal*, "don't run, walk"). Mum says the actual "don't sit" line; nothing is built from the pattern | L2 |
| touch (your ...) | *ad* | in engine ("don't touch", *ad na*) | L3 |
| nose | | to record | L3 |
| head | | to record | L3 |
| ear | *kan* | ✓ | L3 |
| well done | *shabash* ✓ | ✓ | Nani's line, once or twice a round. (*Shabash, beta* is only inside the recorded "Mmm, chai bo fine ai. Shabash, beta" (S2) and can't be cut cleanly; it's on Mum's sheet as a line of its own if wanted.) |
| now you! | | to record ("Your turn, Ali" is in the engine as English only) | the off-screen round |

Later visits (§5): clap, hands up, hand (*hath*, in engine), tummy, knee (*gutan*, in engine), foot (*pag*, in engine), everyone, sleep, dance slowly (*aste thi* ✓, B2) and quickly (*jaldi*, B3, in engine), and the elder form.

**B. Getting ready**

| English | Kutchi in the repo | State | Level it decides from |
|---|---|---|---|
| the three children's names | | to record (Ali, plus two little cousins: placeholders, Zafar's "the recommendation for now", 1 Nov) | heard from L1 (the called child steps forward); the person decides on visit 2 |
| brush (your teeth) | | to record | L1 |
| teeth | | to record | L1 |
| comb (your hair) | | to record | L1 |
| hair | | to record | L1 |
| (eat your) breakfast | *kha* (eat) ✓; breakfast to record | ✓ / to record | L1 |
| wash (your face / hands) | *dho* | in engine (heard inside "wash the glass, wash the cup", a whole recorded line) | L2 |
| face | | to record | L2 |
| hands | *hath* | in engine | L2 |
| not (the "no" ask: "wash your hands, not your face!") | *na* | pattern in engine (as above); Mum says the line | L2 |
| put on | | to record | L3 |
| socks | | to record | L3 |
| shoes | | to record | L3 |
| get dressed | | to record. Heard at the end of every round L1-L3; decides at L4 | L4 |
| first ... then ... | | to record | L4 |
| hurry up! | *jaldi kar* | ✓ | Nani's flavour line; never a timer |

"Wake up" isn't here: it's the clock's word, heard and decided there. "Drink your milk" isn't here either: the clock already serves Ali milk. Later visits (§5): dry (the towel), shirt (*shati*, in engine), jumper, cold, hairbrush.

### Its verbs

- **Statues (visit 1):** sit, jump, turn, dance, stand, stop, touch.
- **Getting ready (visit 1):** brush, comb, eat, wash, put on, get dressed.

**What decides in getting ready, said plainly:** each thing does one job, so at L1 the call is settled by whichever word the child catches, the verb or the noun ("brush your teeth" against "comb your hair"). It isn't a leak (a child with no Kutchi still can't win), but it isn't the verb alone. From L2 the noun decides within a verb pair (wash your **face** against wash your **hands**: the flannel against the soap; at L3 put on your **socks** against put on your **shoes**), and the "no" ask makes the child hold both words. A verb deciding on one thing (wash against dry, both on the face) is visit 2, with the towel.

**Part 3's top 40:**
- **Sit (22) and turn (26):** both decide a move in statues.
- **Do (1):** glue, in Nani's lines.
- **Eat (18):** comes back.
- Sleep and drink (missing top-60 verbs) wait for visits 2-3 here (§5).

### Frames

**Heard:**
- "[verb]!"
- "[verb], don't [verb]!" (L2; the "no" said last, as the rulebook asks)
- "touch your [part]!" (L3)
- "[name], [verb] your [thing]!"
- "[name], wash your hands, not your face!" (L2)
- "first [X], then [Y]" (L4)
- *jaldi kar* ✓
- *shabash* ✓
- "now you!"

**Said:**
- Statues only, from L3 or visit 2 ("You be Nani", §3 A3).
- The child calls one bare command from a closed set of three that sound different: sit, jump, turn.
- Zafar checks they sound different once they're recorded.

### New words per level (recounted after the critique)

The lessons ask for 3-5 new words a round, each heard at least 3 times.

| Level | A. Statues: new words, and hearings a round | B. Getting ready: new words, and hearings a round |
|---|---|---|
| L1 | **sit, jump** in the first rounds: 6 stops, so each is called 3 times. **Turn** joins once sit and jump have each been right three times in a row; from then each round calls turn at least 3 times. "Dance" is heard at every stop (6). | **brush (teeth), comb (hair), breakfast** (5 words). Three children, each called for all three, so every call is heard 3 times a round (once per child). The names are heard 3 times each. |
| L2 | **stand, stop, don't** (3); **dance** now decides. 7 stops: stand and stop at least 3 each, one or two "no" asks | **wash, face, hands, not** (4). 9 calls: wash your face and wash your hands once for each child (3 hearings each), one or two "no" asks |
| L3 | **touch, nose, head, ear** (4; ear ✓). 7 stops: each part at least twice as a call and once more in the "no" ask or a miss's repeat | **put on, socks, shoes** (3). 10 calls: each child puts on socks and shoes |
| L4 | none new: the look-alikes (stand against stop; sit against turn-round-and-sit) and two calls in one | **get dressed** (heard at the end of every earlier round) and **first ... then** (2-3) |

### Mum first

The game teaches nothing until these are recorded. Grey English would be a reader's win (lessons §1, AUD flaw 2). The prototype plays before then on the device voice (Zafar, 1 Nov). They go first on her next sheet, as bare commands to a child.

**Statues L1:** sit (as a clip of its own), jump, turn round (with the *firai* question), dance.

**Getting ready L1:** "[name], brush your teeth", "[name], comb your hair", "[name], eat your breakfast", and the three names in Nani's voice (so the engine joins name and call; Mum's ear checks the join).

**Totals:**
- About 10 lines for both L1s.
- About 12 more for L2-L4 (stand, stop to confirm, "jump, don't sit", touch your nose / head / ear; wash your face / hands, "wash your hands, not your face", put on your socks / shoes, get dressed, first ... then).
- The elder forms are not on this sheet: they come with visit 2 (§5).

---

## 2. Where it sits in its day

### A. The birthday (one order, as `party-gifts.md` §2 has it after its critique)

1. Door
2. The walk or ride
3. Introductions (pass the balloon)
4. Look after the guests ("how are you?")
5. **Musical statues**
6. The cake (candles, the cloth and the slices)
7. Snap the people, ending in the family photo (once Snap is rebuilt)
8. The party presents, as everyone leaves
9. Home (the party-bag toy for Ali)
10. The evening book

All three party designs now use this order: `party-guests.md` §2 was brought into line in the consistency pass (1 Nov), and only the master map's Part 7 still shows the older one. It is the gifts doc's order because it is the newest and keeps the give-to stages apart; Zafar took it on 1 Nov ("the recommendation for now"). The party's people are one cast across the three designs (`party-gifts.md` §0): Zara (4), her mum, her masi, Yusuf (6), Sana (5), dada and dadima.

| Carries in | Carries out |
|---|---|
| The names from introductions: Zara and Yusuf dance. (Names decide nothing here on visit 1.) | **The dancing crown:** a plain paper crown that Zara puts on the child's character at the end. The child wears it in the family photo (stage 7). |
| The balloon tied to the child's wrist (`party-guests`): seen when the child's character slides in for the crown. | **The cake:** the round ends with Nani's unscored "sit, the cake is coming". It's heard, never a decision, so "the last call is always sit" can't be learned. |
| | **The book:** a page of the dancers frozen in the funniest statue of the round, and "who jumped?" over it. |
| | **Later visits:** the dancers flop down hot and thirsty. A short second "how are you?" after statues would put give-to twice in a row before the cake, so `party-guests.md` now parks that round (consistency pass); the cake follows statues directly. |

**Rhythm:** look after the guests is busy and toy-like, statues is loud and physical, and the cake is calm. The engine is never used twice in a row.

### B. The school day (the order `school-day.md` §2 and `wake-up-clock.md` §2 give: the clock starts the night before, so it comes before the door; consistency pass, 1 Nov)

1. **The wake-up clock** (the family wakes at their time)
2. Door
3. **Getting ready**
4. Pack the school bag
5. The bus
6. The blackboard
7. Home
8. The book

| Carries in | Carries out |
|---|---|
| **From the clock:** Ali is up, in his pyjamas with bed-hair, as the clock leaves him (the clock wakes him; "wake up" is heard only there). His two little cousins slept in the clock's bedroom too, top-to-tail on a floor mattress in the background (`wake-up-clock.md` §3 has the line); after the door, all three go through to the children's room to get ready. | **To pack the bag:** three dressed children, ready. Nani: "now the bag", and the **child** packs it at the front door, as `school-day.md` designs it. |
| The clock already served Ali his milk, so nobody drinks milk here. | **To the bus:** at the end the bus horn beeps outside; *jaldi kar* ✓. |
| | **The book:** before and after. Three sleepy, bed-haired children, then three in uniform, and "who brushed their teeth?" (past tense later, at A2). |

### The engine shared with the clean-up (a day at home)

- The same calls, the same comic misses, the same light.
- The clean-up's things have states (on/off, open/closed) instead of poses; getting ready already has per-actor state (combed, washed, dressed).
- One engine and three settings, so a fix made in one is made in all three (lessons §13).

---

## 3. The stages and mini-games

### The engine in one paragraph

Each stage has:
- **Actors:** the dancers, or the three children.
- **Actions:** each one real art. A pose, or a short animation from real frames.
- **Triggers:** what the child taps to make an action happen. In statues, a **pose card**. In getting ready, a **thing** on the shelf, the rail or Nani's tray.
- **State per actor** (getting ready): what each child has done this round. It is what the leak test is written from.

Nani says one call, and its card pops big and flies into its row. The child taps a trigger, and the actor does that action.

- **Right, first go:** the reaction, then the row ticks and the next call comes.
- **Wrong:** the actor does the wrong action as a comic miss (a different one each time). Nani says the call again, and the child redoes it on the spot. **The row ticks only a call that was right on the first tap; a call put right after a miss closes without a tick and never moves that word's ladder** (lessons §5, rulebook "first go").
- **Data per level:** the call queue (shuffled; repeats where natural), how many triggers show (always more than one), the decoys, the "no" asks, and which calls are two-word.
- **Moving up (Zafar, 1 Nov):** only right-first-time rounds count towards the next level, every call ticked on its first tap. A round with an untick is progress on the end screen, but doesn't count.

Nothing moves by itself, nothing glows on the answer, and there's no timer.

### The pool, scored

Scores out of 5: fun, does the Kutchi decide, novelty, build cost (5 = cheap).

| Candidate | Fun | Kutchi decides | Novel | Cost | Verdict |
|---|---|---|---|---|---|
| **A1. Musical statues on screen** (pose cards) | 4 | 5 | 4 | 3 | **keep** |
| **A2. The off-screen round** (the child's own body, unscored) | 5 | 3 (unscored) | 5 | 5 | **keep**, once per play |
| **A3. You be Nani** (the child calls the pose) | 4 | 5 | 3 (the shared moment) | 4 | **keep**, from L3 or visit 2 |
| **B1. Getting ready** (three children; tap the thing, the called child does it) | 4 | 4 (the thing's word at L1; the noun within a pair from L2) | 4 | 2 (three layered children) | **keep** |
| Tap the body part on the dancer ("boop the nose") | 5 | 5 | 4 | 3 | parked: the nose is about 15 px at 275 px high (§10, 7) |
| Put the routine in order (sequencing cards) | 2 | 1 | 2 | 4 | **cut**: won by knowing the routine (other games §12) |
| Simon says ("Nani didn't say") | 3 | 2 | 2 | 4 | **cut**: it tests holding back, not language, and being caught is a verdict (mechanics table). Not the same as the rulebook's "no" ask ("jump, don't sit!"), which says what to do and is kept at L2 |
| The child's own character dances on stage | 5 | 5 | 3 | 1 | maybe later: needs layered pose art (`charmaker`) |
| Who's doing it? (find the dancer who's sitting) | 3 | 5 | 2 | 4 | belongs to the safari's "who's doing it?"; not here |
| Dance fast / dance slowly (the tempo) | 4 | 4 | 4 | 4 | statues visit 2 (§5); *aste thi* ✓ |
| Sleeping lions (everyone lies still) | 4 | 4 | 4 | 4 | statues visit 3 (§5) |
| Tell Ali (the child says the routine call) | 3 | 4 | 2 | 4 | getting ready visit 3, the same shared moment as A3 |

---

### A1. Musical statues (on screen)

**The why:** at every children's party the grown-up stops the music and calls a pose. Here Nani does it. She stands on the right and claps the beat. When she stops clapping, the music stops, and she calls.

**Who's on screen (E camera):**
- Two party children, full body, in the middle of the cleared front room: **Zara** (the lead, in the centre, a step nearer the viewer) and **Yusuf**. (Sana and the host family's *dadima* join on visit 2.)
- **Nani** on the right, three-quarter on, clapping.
- The child's own character is off screen (the child is the camera, as in Cook). It slides in only at the end, for the crown, and on visit 2 for the handover.

**The music stops, and nobody freezes yet.** When Nani stops clapping, Zara and Yusuf don't freeze: they keep a small on-the-spot **waiting bob** (a two-frame loop, knees bending, looking at Nani) until a card is tapped. The waiting bob is no card's picture. So every call, including "stop", asks for something the dancers aren't already doing.

**The six actions and their cards** (each card a crop of the same E render; §7):
- **Sit:** sitting cross-legged on the floor.
- **Jump:** in the air, knees up (a crouch, then up).
- **Turn:** turned round, back to us.
- **Stand:** straight and still, arms at the sides.
- **Stop:** the real statue freeze, caught mid-move: one leg lifted, arms out, a wobble. It's what "stop!" means in the real party game.
- **Dance:** the big two-frame dance. Tapping it restarts the music.
- **Touch your nose / head / ear** (L3): a finger on the part; these cards are head-and-shoulders crops.

**The five questions:**

| Question | The answer | Score |
|---|---|---|
| What do you do? | **Watch:** the music plays, the dancers dance, and you can tap a dancer for a wiggle (a toy; it decides nothing). **Music stops:** the dancers bob, waiting. **Call:** Nani calls. **Tap** the card, and every dancer does it and holds it. One gesture: tap a card. | 5 |
| Where's the challenge, and does the Kutchi decide? | 2-5 pose cards sit in a column beside the dancers. Each shows a pose, with no text, and the cards shuffle every stop. Only the heard words say which (from L2, the "no" ask; at L3, touch + part). Calls repeat and come in any order. | 5 |
| Where's the fun? | The freeze. The dancers snap into the pose with a soft "click" and a sparkle, and hold it, with Yusuf wobbling a little and giggling. Then the music bursts back. **Misses:** see the delight moment. | 4 |
| Where's the instruction? | Nani on screen, then the card. The guide box shows the step (a speaker). Nani repeats the call every few seconds for non-readers (lessons §4). | 4 |
| What's novel? | The only game where whole-body verbs decide, and it has the off-screen twin. No other stage freezes and releases to music. | 4 |

**Level ladder.** Levels make the Kutchi harder, never the gesture (always one tap on a card). "Stops" are the calls per round. The round sizes follow Zafar's 29 Oct rule: one level overridden (L1, written here: 6 stops, because a new verb needs three hearings a round and a round of one is over before it starts), then even steps to L4's most of 8, which is how `wake-up-clock.md` reads the same rule (Zafar, 1 Nov: the recommendation for now).

| Level | Adds one thing | Calls | Cards per stop | Stops |
|---|---|---|---|---|
| **L1** | the core: bare pose verbs, each a clearly different shape. **Sit and jump** in the first rounds; **turn** joins once sit and jump have each been right three times in a row. After each pose, Nani says "dance!" and the music restarts by itself (heard, not decided) | sit, jump; then turn | 2: the asked one and one clearly different | 6 (override) |
| **L2** | **one added pose and the "no" ask:** stand, and **stop** (the statue freeze). **Dance** now decides: after a pose, Nani's next call may be "dance!" (tap the dance card to restart the music) or another pose, at random. One or two calls a round are a "no" ask: "jump, don't sit!", with the "no" said last and its card last on the row (rulebook §1) | L1's, plus stand, stop, dance, the "no" ask | 3 | 7 |
| **L3** | **two words per move:** touch + part (nose, head, ear), on head-and-shoulders cards. Other ways of saying the L1-L2 calls, as Mum says them ("sit down", "stand up") | L2's, plus touch your nose / head / ear | 4 | 7 |
| **L4** | **look-alikes and two calls in one:** **stand against stop** (straight and still, against the mid-move statue: two poses that are both "not moving"), **sit against turn-round-and-sit** (the same floor pose from the front and the back), and "jump, then sit" (two taps in order, the same gesture) | all | 5, one a look-alike | 8 |

**A wrong "dance" tap never restarts the music.** If the child taps the dance card when Nani called a pose, the dancers do one little stumble step on the spot and look at Nani, the music stays off, and she says the call again. So the dance card is never "the music button".

**The leak test:**
- **Reading:** the cards have no text. The order card shows the Kutchi, and the English only at L1 (a supported word). Past support, the card is a speaker only. *Fix:* in place.
- **Matching:** the card's picture shows only while the word is supported (until right three times in a row). Nobody shows the pose before the tap:
  - Nani claps and never acts it out;
  - when the music stops the dancers do the **waiting bob**, which is no card's picture; "stop" is a pose they are not already in;
  - the dance loop never ends in a pose card's shape;
  - the dance card and the stop card differ in shape at 64 px (both feet down and arms swinging, against one leg up and arms straight out), proven on the lab page.

  *Fix:* in the data and the art (the waiting bob frames).
- **Eliminating:** no card is used up. The asked pose can repeat (the queue allows it), and the number of cards stays the same all round. *Fix:* repeats in the queue.
- **Patterns:** the calls are shuffled and the card positions shuffle every stop. From L2, "dance" comes after one or two poses at random; the "no" ask comes at random stops; the first call is random; the end-of-round "sit" is unscored. *Fix:* in place.
- **Waiting:** the music never restarts and nothing moves until the right tap (a wrong dance tap doesn't restart it either). The hint after 7, 9, 11 or 13 s (from the last action) is Nani repeating the call, which is free. Then the helper card with the full answer opens in the guide box, and that costs the bulb. Nothing glows on the answer. *Fix:* in place.

**The odds for a learned save with no Kutchi** (all first picks right):
- **L1** (past support): (1/2)^6, about 1.6%.
- **L2:** (1/3)^7, under 0.1%.
- **L3 and L4:** smaller still.
- **Bot target:** under 10% of rounds at every level once past support.

**The delight moment.**
- **Right:** the freeze-click. Every dancer holds the pose, and Yusuf's wobble and giggle are the running joke. Once or twice a round, Nani laughs and says *shabash* ✓ (one line per moment, never on every tap).
- **Misses:** each one is the dancers doing the wrong pose, then a different funny turn, all on the open floor:
  - jump instead of sit: they land in a giggling heap on the floor, the cushions untouched against the wall;
  - turn instead of stand: they spin slowly, wobble a little dizzily, and sit down with a laugh (never bumping into each other);
  - sit instead of jump: they plonk down and look surprised, and Zara shrugs;
  - stop instead of stand: they freeze mid-move, and Yusuf's statue wobbles until he giggles and puts his foot down;
  - touch your head instead of your nose: they pat their heads, then look cross-eyed at their noses;
  - dance instead of a pose: the little stumble step, and the music stays off.

  Then Nani repeats the call and the child redoes it. Never a frown, and nobody is ever "out". Every miss passes "could a child copy this at Nani's and get hurt?": no furniture, no spinning into people.

**The music (his call; question 16 is still open):**
- **The beat, on by default:** Nani's clapping, recorded by the family, with no voice.
- **A tune, off by default:** a separate track that stays switched off in data until Zafar says yes and says where it comes from. The cheapest answer that keeps the family's own sound is a family hum; nothing generated or stock goes in without his word.
- The music stops at a random 3-8 s, so it never becomes a timer.

### A2. The off-screen round ("now you!")

**What it is:** once per play of the stage, after the last on-screen round, Nani turns front-facing to the player: "now you!" (to record).
1. The claps play and the dancers dance, and the real child dances in the room.
2. The claps stop, and Nani calls a pose to the real child.
3. After 2 seconds, the dancers on screen do it too, as the model *after* the child's own try.

There are 3 calls, then everyone on screen claps for the child.

**The rules:**
- **When:** once per play, at the end (in data: `offscreen: "end"`, with "every other round" as the other setting). Nani's "now you!" stays an event.
- **Unscored:** no ticks, no bulb, no mic, no camera.
- **Skippable:** a tap anywhere skips it.
- **The calls:** the level's verbs only.
- **The cog:** has "dance in the room: on/off" (default on) for buses and waiting rooms.

| Five questions | Answer | Score |
|---|---|---|
| Do | dance in the room, then freeze in the pose | 5 |
| Challenge, Kutchi | the heard verb, but unscored by design | 3 |
| Fun | your own body; the grown-up joins in | 5 |
| Instruction | Nani front-facing, the same call | 4 |
| Novel | the only off-screen moment in the game | 5 |

**Leak test:** not applicable, since it's unscored. The on-screen model comes after a 2 s gap, so the child tries first.

### A3. You be Nani (the speaking moment, from L3 or visit 2)

This reuses the one shared "say it, Ali acts" moment (`js/shared/say.js`). It isn't a seventh copy (existing games §5, lessons §8).

1. **Watch:** the child has heard Nani call dozens of times.
2. **Handover:** Nani turns front-facing, and the child's character slides in; Nani gives it her place by the speaker and steps back clapping. The "your turn" mic bubble appears over the child's character.
3. **The call:** the claps stop, and a thought bubble over the child's character shows one pose (the need, as a picture, as `speaking.md` asks).
4. **The child says it:** from the closed set of three (sit, jump, turn), with the pills always there. Rung 1 plays the model first and the child says it after.
5. **The dancers do exactly what was heard:** a wrong hearing gets the funny wrong pose, as Cook's funny wrong cup does.

It's never a gate: no mic means tap a pill. There are 2 calls, then it goes back to Nani.

| Five questions | Answer | Score |
|---|---|---|
| Do | say the pose | 4 |
| Challenge | recall the verb from a picture | 5 |
| Fun | the room obeys you | 4 |
| Instruction | the bubble and the handover | 4 |
| Novel | the shared moment; new verbs | 3 |

### B1. Getting ready (the school day)

**The why:** Ali and his two little cousins slept over at Nani's, and it's a school morning. The child helps Nani get the three of them ready: tap what Nani says, and the child she named does it. Nani calls in any order and to any child, so the routine is no help (the scope: "the verb decides, not the routine's order"). The mixed-up order is the joke: a cousin eats breakfast with bed-hair while Ali stands combed and in pyjamas.

**Who's on screen (E camera, full body):**
- **The three children** stand in a row in the middle of the room, in pyjamas with bed-hair: **Ali** (about 8, tall and lanky), a **girl cousin** (about 5) and a **boy cousin** (about 4). Placeholders for now (Zafar, 1 Nov: the recommendation). Their places in the row shuffle each round.
- **The things,** at reachable spots either side of them:
  - a basin shelf on one side: a cup with three toothbrushes, the comb; from L2 the soap and the flannel;
  - a clothes rail on the other: the school clothes on hangers (the one thing never called before L4); from L3 socks, and shoes on the floor below.
- **Nani** at the door on the right, three-quarter on, holding a **tray with three bowls**. "Eat your breakfast" is her handing a bowl over: the child taps the bowl on her tray, and it hops to the named child, who eats a few spoonfuls standing by the door. (Nobody eats off a stool in the bedroom.)
- **The shelf and the rail swap sides each round,** and the things on them reorder.

**Each child has their own state.** Combing flattens that child's hair, brushing leaves a foam moustache that's wiped at once (so teeth leave no mark), and breakfast leaves that child's bowl empty on the tray. The things themselves go back after every use. Who has done what is visible on the hair and the bowls, and the leak test below is written from exactly that.

**How a call goes:** Nani: "[name], brush your teeth!" The named child takes one step forward (the person word is heard and supported on visit 1; it decides on visit 2). The card flies in. The child taps a thing; it hops into the named child's hand, the child does it, and puts it back.

**The five questions:**

| Question | The answer | Score |
|---|---|---|
| What do you do? | Nani calls a child and a job; tap the thing. It hops into that child's hand (after the tap, never before), they do it and put it back. One gesture: tap a thing. | 4 |
| Where's the challenge, and does the Kutchi decide? | **L1:** the thing's word decides (verb or noun, whichever the child catches: §1). **From L2:** the noun decides within a pair (wash your face against wash your hands) and the "no" ask makes both words count. Every call comes once per child, so each is heard three times a round. | 4 |
| Where's the fun? | The children change before your eyes: bed-hair springs flat with a "boing", a foam moustache after brushing, socks pulled up with a snap. The misses are the jokes (below). At the end all three check the mirror and grin, then twirl into uniform. | 4 |
| Where's the instruction? | Nani on screen at the door, then the card. *Jaldi kar* ✓ now and then as flavour, never a timer. | 4 |
| What's novel? | The only routine game, and the only one where several characters each carry their own state through the round. | 4 |

**Level ladder.** The calls a round follow the same one-override reading as statues: L1 overridden to 9 (three children × three calls, so each new word is heard three times), then even steps to L4's most of 10.

| Level | Adds one thing | Calls (asked from) | Things shown | Calls a round |
|---|---|---|---|---|
| **L1** | the core: three routine calls, each to all three children | brush your teeth, comb your hair, eat your breakfast | 4: toothbrushes, comb, the bowls on Nani's tray, and the school clothes (never called) | 9 (override) |
| **L2** | **two words that matter:** wash your face (the flannel) against wash your hands (the soap). One or two calls a round are a "no" ask: "[name], wash your hands, not your face!", the "no" said last | L1's, plus wash your face / hands | 6 | 9: both washes for every child, plus three L1 calls |
| **L3** | **one more pair, and other ways of saying it:** put on your socks against put on your shoes; "go and brush your teeth", "your hair: comb it" (as Mum says them) | L2's, plus put on your socks / shoes | 8 | 10: socks and shoes for every child, plus four others |
| **L4** | **two calls in one, and the last job decides:** "first [X], then [Y]" (two taps, the same gesture), sometimes against the routine's order, so the heard order decides; and **get dressed** (the clothes on the rail), heard at the end of every earlier round, is now called | all | 8 | 10 (two are first-then) |

**The leak test** (written from the state model above):
- **Reading:** the things carry no text, and the card is the same as in statues. *Fix:* in place.
- **Matching:**
  - the card's picture (a child doing it) shows only while the word is supported;
  - no child reaches or looks towards the answer;
  - no thing is shaped to its call: nothing dirty or tangled marks the answer beyond the honest state below.

  *Fix:* in the art and the data.
- **Eliminating (honest):** done states are visible: a combed child's hair is flat, and an empty bowl shows who has eaten. Teeth leave no mark, so tracking brushing needs memory. A child who tracks all three children can therefore win **each child's last call by elimination** (at L1, three of the nine taps). What stops that winning the round: the first two calls to each child are open (1 in 3, then 1 in 2), the calls jump between the children at random, and the round always shows more things than any child has calls left. From L2 a child gets only some of the level's calls, so the last call is no longer forced either. *Fix:* in the data (the interleaving and the draw).
- **Patterns:** the calls never follow the routine order (shuffled across children and jobs; in some rounds deliberately reversed). The first call and the first child are random. The children's places and the spots shuffle every round. *Fix:* in place.
- **Waiting:** no child acts by themselves, and the hint ladder is as in statues. *Fix:* in place.

**The odds for a learned save with no Kutchi** (a sceptic who tracks every child's state perfectly):
- **L1:** per child 1/3 × 1/2 × 1 = 1/6; for the round, (1/6)^3, about 0.5%.
- **L2:** about the same or less (each child: both washes plus one of three others; the "no" ask cuts it further), under 0.5%.
- **L3 and L4:** smaller still.
- **Bot target:** under 10% at every level. The bot also reports how many taps it won by elimination, so the number above is checked, not assumed.

**The delight moment.**
- **Right:** the transformation beats (the comb's boing, the foam moustache wiped, the socks' snap).
- **Misses:** each a different funny one, and the thing always goes back. Each passes "could a child copy this at Nani's?":
  - a sock goes on a hand as a puppet that "talks";
  - a child starts to brush their teeth with the comb, stops short of their mouth, stares at it, and giggles;
  - shoes go on the wrong feet: the child walks pigeon-toed for two steps, stops, looks down, and swaps them;
  - soap instead of the flannel: a big soap bubble grows between their hands and pops, and they laugh;
  - the flannel instead of the soap: they hide behind it, "peekaboo";
  - at L4, the school shirt goes on back to front and they spin to find the sleeve.

  **Food is never played with:** a wrong tap on a bowl is "mmm, later" and a tummy pat (non-negotiable 9's spirit and the family's respect for food). **Shoes stay on feet**, and nothing from the floor goes near a head or a mouth (shoes are unclean in this family's home).

**Speaking:** none on the first visit (§5: "Tell Ali" on visit 3, through the shared moment).

---

## 4. The child's first-ever round, screen by screen

### A. Musical statues (L1, first ever)

1. **The room.** The front room, cushions pushed to the walls. Zara and Yusuf stand in the middle and Nani stands on the right. Nothing is lit, and there are a few seconds of quiet.
2. **The watch.** Nani: "dance!" She claps. Zara and Yusuf dance (a two-frame bob and spin). A tap on a dancer gives a wiggle, and that's the only live thing. Then Nani stops clapping, and the dancers do the waiting bob, looking at her.
3. **Showing the action once** (lessons §2; it doesn't count against the bulb). Nani: "sit!" The **sit** card slides into the column, the one live thing in a lit box with a gold glow; everything else is dim. The child taps it, and the dancers sit with the click and sparkle. That's the only showing: no finger and no ripple, just the lit card.
4. **The first real call.** Nani: "dance!" The claps run and stop; the dancers bob. Nani: "jump!" The card pops big beside the side panel (the picture, the Kutchi when recorded, and "jump" in English: L1 support) and flies into its row.

   The lit box now hugs **both** cards in the column (sit and jump; the choice, never the answer alone), and the dancers and Nani dim. The child taps.
5. **The fun moment.** On a right tap, the freeze-click and Yusuf's wobble. On a wrong tap (sit), they plonk down surprised and Zara shrugs; they get up, Nani says "jump!" again, and the child taps jump.
6. **The progress.** The row ticks a call that was right first go. Six stops in all, sit and jump three times each, shuffled. *Shabash* ✓ once, about halfway.
7. **The end.** Zara runs over; the child's character slides in from the side with the balloon on its wrist, and she puts the paper crown on it. Nani says the unscored "sit, the cake is coming", and the dancers sit down on the floor. Then the off-screen round (step 8), if this was the last round of the play.
8. **The off-screen round** (once per play). Nani turns front-facing: "now you!" The claps play in the room. They stop, and Nani calls "jump!" to the child. Two seconds later, Zara and Yusuf jump too. Three calls, then everyone on screen claps and cheers for the child. Then the shared two-page end screen, and on to the cake.

### B. Getting ready (L1, first ever)

1. **The room.** The children's room at Nani's, morning light. Ali and his two little cousins stand in a row in pyjamas with wild bed-hair, yawning. Nani is at the door with the breakfast tray. A few seconds of quiet.
2. **Show what isn't on the card.** The school clothes on the rail bounce once in a lit box, with no word and no tap: they're the thing never called today. Then the other things in reach bounce silently in turn (toothbrushes, comb, the bowls on the tray): a look, no names.
3. **Show the action once.** Nani: "Ali, brush your teeth!" Ali steps forward. The card pops big (the picture of brushing, the Kutchi when recorded, the English at L1) and flies into its row. The light hugs **only the toothbrushes** this one time; it's the showing, and it doesn't count. Tap: Ali's brush hops into his hand, he brushes, gets a foam moustache, wipes it, and puts the brush back.
4. **The real calls.** Nani: "[the little girl], eat your breakfast!" She steps forward, and the card flies in. Now the light hugs **all four** things. The child taps the bowls on Nani's tray; one hops to her, and she eats a few spoonfuls by the door with her hair sticking up, happy.

   A wrong tap on the comb: she starts to eat with it, stops short, looks at it, and giggles; it goes back. Nani says the call again, and the child redoes it.
5. **The rest of the round.** Seven more calls, jumping between the children and the jobs. "Comb your hair!" brings the *boing* as the bed-hair springs flat. By the end each child has done all three.
6. **The end.** A mirror slides in by the rail. The three look at themselves, combed and fed, still in pyjamas. They laugh, and Nani laughs: "get dressed!" (heard; it decides only at L4) and *jaldi kar* ✓. They grab their clothes and the twirl puts all three in uniform. That last change is shown, not asked, so dressed children always reach the bag.

   The bus horn beeps outside. The shared end screen, then Nani: "now the bag", and pack the school bag.

---

## 5. Later visits and harder versions

| Visit | Statues | Getting ready |
|---|---|---|
| **1** (L1-L4 above) | on screen; the off-screen round once per play; You be Nani from L3 | three children, L1-L4 |
| **2** (Zara a year older) | **Sana** dances too. The host family's **dadima** joins the dancers, and Nani calls her in the **elder form** (once Mum has recorded the elder forms; every verb here is `imp.polite: unknown`, round 5 C142-C151). **Dance quickly, dance slowly:** the tempo changes and the dancers' speed with it (*aste thi* ✓, B2; *jaldi*, B3, in engine; Mum says the "dance slowly" line). **Clap your hands, hands up, everyone.** You be Nani from the start. | **The person decides:** the three children stand still and Nani's name picks who, using give-to's two taps (tap the thing, then the child; `giveto` from `party-gifts.md`), the same gesture as every give-to. **Dry your face** with the towel against wash your face with the flannel (the verb decides on one face). The comb against a hairbrush (a look-alike). The day's weather from the door: "it's cold today, put on your jumper" (*thundo* ✓ is food gone cold; Mum to say whether it's used for weather). |
| **3** | **Sleeping lions** (sleep: everyone lies still; sit against sleep as a look-alike). **Statues in the garden** (the same engine, a new background): "run", "stop", "walk" (*bhaj*, *hal*, in engine; "don't run, walk" *bhaj na, hal*, in engine). Touch your **tummy, knee, foot**, on mid-body cards proven at 64 px, or on tablets only. | **Tell Ali:** the child gives the call, using the shared speaking moment (closed set: wash, brush, eat). A wrong hearing gets the funny wrong action |
| **Book** | "Who jumped?", "what did Zara do?" (past tense, at A2) | "Who brushed their teeth?" (past, at A2) |

---

## 6. What it reuses and what is new

### Reused (nothing restyled per mode; non-negotiable 6)

| Piece | File | Used for |
|---|---|---|
| The page grid, sidebar and play area | `js/shared/frame.js`, `fit.js`, `stage.js` | both stages; two layouts by height |
| The host (a pipeline of stages) | `js/shared/host.js` | statues inside the party day; getting ready inside the school day |
| The order card and its rows | `js/shared/order-card.js`, `word-card.js` | each call is a card that pops big and flies into its row; "no" cards last |
| The guide box, the helper card, the bulb | `js/shared/guide.js`, `bulb.js` | the step, the repeated call (free), the paid helper card |
| The light and the dim | `js/shared/onboard.js`, `focus.js` | the showing and the choice box. No finger, as the rulebook already says for every game |
| The rules (hint timings, level-up, the word ladder, first go) | `js/shared/rules.js`, `data/rules.json` | nothing hard-coded |
| The family voice and sounds | `js/shared/family-voice.js`, `sfx.js` | Nani's calls, the clapping, the click, the boing |
| The speaking moment | `js/shared/say.js`, `speech.js` | You be Nani (A3); Tell Ali (visit 3) |
| The child's character | `js/shared/character.js` | sliding in for the crown and the handover |
| Dress up's layered doll | `js/dress/doll.js` | the three children's layers (base, outfit, hair, face), reused, not rebuilt |
| The end screen | `js/shared/results.js` | both stages |
| The party room and cast | `party-guests.md`, `party-gifts.md` art | statues' background and dancers |
| Give-to (visit 2) | `giveto`, designed in `party-gifts.md` | the person deciding in getting ready |

### New

- **The `do-it` engine** (`js/doit/engine.js`, with data in `data/doit/statues.json`, `data/doit/getting-ready.json`, and later `clean-up.json`):
  - actors, actions (frames, hold time, sound), triggers (card or thing), **state per actor**, a call queue (shuffle, repeats, interleaving across actors, decoys, "no" asks, two-word and first-then calls), the comic misses per action pair, and the putting back;
  - about 400 lines; the clean-up's states are the same "state" field.
- **The music player:** the claps track, an optional tune track (off), a random stop, and a tempo flag for visit 2. It's small.
- **The off-screen round:** a mode of the engine with no scoring, a 2 s model delay, the once-per-play setting and the cog switch.
- **The three children's layers** on `js/dress/doll.js`: a base body each, outfit layers (pyjamas, uniform, socks, shoes), hair (bed-hair, combed), faces (sleepy, foam, chewing, grin), and arms per action. A **lab page first**, to prove the layers line up at the four sizes before the full art run.
- **The lab page for the statues cards:** every card at 64 px, side by side, including dance against stop and the three head-and-shoulders touch cards, before the art run.
- **The leak bot** for both stages (a learned save, no Kutchi, tracking state; under 10% of rounds; it reports taps won by elimination).

---

## 7. Art and layout

### Cameras (art bible §3: one per scene)

| Scene | Camera | In this camera |
|---|---|---|
| The party front room (statues) | **E**, eye level, full bodies standing on the floor; horizon about 55-60% | the dancers (Zara and Yusuf on visit 1), Nani clapping, the child's character (sliding in for the crown) |
| The pose cards | **E** crops of Zara's own pose renders on a plain warm card. Sit, jump, turn, stand, stop and dance are full-body crops; **touch your nose / head / ear are head-and-shoulders crops** of the same render (the same camera, zoomed) | one per pose, cut from the same renders (no new drawing) |
| The children's room at Nani's (getting ready) | **E**, full body, front; horizon at about hip height (as Dress up's) | the three children, the shelf, the rail, the bed behind, the mirror, Nani at the door with the tray |
| The things | **F** item front view | toothbrush cup, comb, soap, flannel, school clothes on hangers, socks, shoes, three bowls on a tray |

### Art list (one paste block for Zafar's ChatGPT run, backgrounds locked first)

- **Backgrounds (2):**
  - the party front room, cleared for dancing (shared with the party designs; day light);
  - the children's room at Nani's (morning light; one cultural nod at most, such as an ajrakh bedspread).
- **The dancers (visit 1):** Zara and Yusuf, each a pose sheet edited from their character sheet:
  - dance A and dance B; the waiting bob (2 frames); the stumble step;
  - sit, jump (crouch, then up), turn (back view), stand, stop (the statue freeze, with a wobble frame);
  - touch nose, touch head, touch ear.

  That's about 12 each, 24 in all. Visits 2-3 add Sana, dadima, clap, hands up, sleep, tummy, knee and foot.
- **Nani:** clapping (2 frames), calling (three-quarter on), front-facing ("now you!"), and holding the breakfast tray at the door.
- **The three children:** the layered dolls as in §6, plus the mirror grin and the misses' frames (sock puppet, comb stare, pigeon-toed shoes, soap bubble, flannel peekaboo, shirt back to front).
- **Items (F view):** about 8, using the props sheet's materials.
- **The crown:** plain paper, no text; a layer on the child's character.
- **Rules:**
  - No text anywhere: bunting, balloons, the crown, pyjamas and socks are plain (no stripes or prints that could become text).
  - Clothes modest: long sleeves, long trousers or leggings under dresses; the girl cousin's uniform a long-sleeved top and a long skirt or pinafore over leggings.
  - Decorations are balloons and plain bunting, with no religious marker.
  - Shoes only ever on feet or on the floor.

### Layout (two layouts, switched by height; check at 740x320, 930x430, 1280x665, 1920x1080, and 915x275)

**Big screens (930x430 and up):**
- The sidebar is on the left: the guide box and the call rows.
- **Statues:** the pose cards are a column of 2-5 at the play area's left. The dancers are in the middle, Zara front and centre. Nani is on the right. Cards are at least 96 px.
- **Getting ready:** the shelf is on one side of the three children and the rail on the other. The children are in the middle, Ali about 70% of the height. Nani is at the door on the far right with the tray, cut at the waist by the door frame.

**Phones (740x320, 915x275):**
- The scenery is cropped, not the people (lessons §6): the room's walls go and the floor is cropped close.
- **Statues:** the dancers are about 80% of the play height. Cards are at least 64 px; the touch cards are head-and-shoulders crops so the finger and the face read at that size (proven on the lab page first). At L3-L4 the cards form two short columns, so 4-5 cards fit in 275 px. Nani is cut at the waist at the right edge.
- **Getting ready:** Ali is about 80% of the height, the cousins shorter. The things are at least 64 px, on two levels each side, never over a face. Bubbles go into free space above the things, never over the sidebar.
- **The cog** is the only button. Nothing is ever clipped.

---

## 8. What it borrows from other games

- **Musical statues and freeze dance** (the real party game; the HTKS and "red light, purple light" self-regulation games, Oregon State): the stop-and-pose rhythm. Never the "you're out" rule.
- **GoNoodle** (Common Sense): moving your own body to a screen, which became our off-screen round.
- **Total Physical Response** (Mavilidi 2015; Toumpaniari 2015, mechanics report): acting verbs with the whole body gives the best recall. This is the case for the off-screen round, and for making a character act on screen.
- **Toca Boca's toys that react** (other games, lesson 1): every right tap and every miss gets a reaction.
- **Pepi Bath** (summary): hygiene routines as toy actions (brush, wash). We borrow tap the thing and the character uses it, but **our** calls decide, not free play.
- **Dress-up dolls** (our own `js/dress/doll.js`, and Sago Mini's dress-up): the children's layers.
- **Cook's funny wrong cup:** the speaking moment does exactly what was heard.

We borrow mechanics, never themes, and no specific game is recreated.

---

## 9. The lessons checklist (`lessons-checklist-2026-11-01.md`)

| Group | Result |
|---|---|
| **1. The heard word decides** | **Passed, with the honest limits written.** The leak test is written per stage from its state model, with the bot target under 10%. Statues: the waiting bob means no call is already shown. Getting ready: at L1 the thing's word decides (verb or noun); from L2 the noun decides within a pair; each child's last call at L1 can be won by elimination (three taps of nine), the round can't (about 0.5%). Deciding words recorded as their own clip: ear ✓ and eat ✓ only. **Exception:** not playable as teaching until Mum's L1 lines are in (§1, "Mum first"). Ticks only a right first go. Two words per move from L2 (the "no" ask; touch + part at L3). No numbers decide. |
| **2. Onboarding** | **Passed.** The first round is the tutorial. One lit box, everything else dimmed, no finger (the rulebook's rule; nothing to switch off). Statues shows one action once, then goes live with two cards. Getting ready shows the never-called thing first (silently), the other things silently, and one action once. Tap only, never a drag. |
| **3. Instructions** | **Passed.** Nani is on screen and calls before any card appears. The card never changes and the guide box shows the step. Listening again is free and the helper card costs the bulb. One line per moment, with *shabash* ✓ not on every tap. |
| **4. Pacing** | **Passed.** No Next and no Done: each stop or call moves on by itself. A tap during speech skips it. Hints at 7, 9, 11 and 13 s. The call is repeated every few seconds. The music stops at random, so it's not a timer, and there is no timer. The off-screen round is once per play, not after every round. Pose sheets preload. |
| **5. Feedback and the end** | **Passed.** A miss gets the comic wrong action and the call again, and the child redoes it on the spot. A different funny miss each time, never a frown or an "out". Rows tick a right first go. It ends the moment the job is done, with something served: the crown and "sit, the cake is coming"; the mirror, then uniform. The shared end screen. |
| **6. Layout** | **Passed on paper** (§7). The four sizes plus 915x275 are checked at build. The touch cards are head-and-shoulders crops, proven at 64 px on the lab page before the art run. |
| **7. Art** | **Passed on paper.** One camera per scene (E; items F). Code only moves real art (the children's layers are real cut-outs). Calm faces and gentle motion: the dance is a two-frame bob, not "crazy". Each speaker has two poses (Nani three-quarter, then front-facing for "now you!"). One paste block. **Risk:** the three children's layers need the lab first. |
| **8. Speaking** | **Passed.** Only after many watches (A3, from L3 or visit 2). Closed set of 3 with the pills always there. Never a gate. It reuses the one shared moment. |
| **9. Levels** | **Passed, following the rulebook.** Each level adds one thing and is designed in its own right: L4 adds look-alikes and two calls in one (statues), first-then and get dressed (getting ready), not just more speed. L2 has the rulebook's "no" ask in both stages. Round sizes: one override (L1), written in each ladder, then even steps (the clock's reading of the rule); Zafar took the recommendation for now (1 Nov). |
| **10. Words** | **Passed, recounted.** Every line is listed in §1 and every call is one natural sentence (a bare command). Naming fits the moment ("put on your shoes", not "shoes"). What's said is what's on the card. Statues L1: 2-3 new verbs, each called 3 times a round; getting ready L1: 5 new words, each heard 3 times (once per child). Visit 1 is the scope's vocabulary; the rest is visits 2-3. |
| **11. Culture** | **Passed.** No reward is a sweet: the statues prize is a paper crown, and the cake stays in the cake stage. The party has no religious markers. Clothes are modest. Food is never played with in the misses. Shoes stay on feet. Nothing to copy and get hurt by: no jumping on furniture (every miss lands on the open floor, cushions untouched), no spinning into each other, and nobody puts anything in their mouth wrongly (the comb miss stops short). The tune is off until Zafar says (§10, 2). The host grandmother is *dadima*, never a second Nani. |
| **12. Fun** | **Passed.** The hands have a toy during the music (tap a dancer for a wiggle). Yusuf's wobble and the children's misses are the "kind of funny" moments. The freeze-click and the boing feel good. Contrast: the freeze against the dancing; the mixed-up morning. Consecutive stages never repeat the engine. Something is carried to the book. |
| **13. Mistakes made twice** | **Passed:** one engine for three settings, so a fix lands everywhere. All levels designed. The state model is chosen and the leak test written from it, so nothing is left for the builder to decide except §10's open questions. One party order is named for all three party docs. Motion is judged on film (the freeze and the twirl). |

**The ten questions, in short:**
1. **Which heard words decide?** The pose and routine calls (§1). Two are in the engine; the rest come first on Mum's sheet.
2. **How would the Sceptic win at L2+, and why does that fail?**
   - She could read: there's no text to read.
   - She could match the card's picture: it's gone once the word is past support; the dancers wait in a bob that's no card.
   - She could eliminate: statues' cards stay and calls repeat; in getting ready she can win a child's last call, but not the round (about 0.5% at L1).
   - She could follow the routine order: it's shuffled across children and jobs.
   - She could wait: there's no glow, and the helper card costs the bulb.
3. **What open need can't the picture settle?** Dancers waiting in a bob; three children who each still need something.
4. **What does the first round light up?** One card or thing once, then the whole choice.
5. **Who asks?** Nani, on screen, in a recorded bare command.
6. **What do the hands do?** Tap a dancer during the music; tap a card or a thing.
7. **The funny moment?** Yusuf's wobble, and the sock puppet.
8. **How does it end, and what is served?** The crown, then sitting for cake; the mirror and the uniforms.
9. **What changes at each level, and is L4 its own?** See the ladders; yes, L4 is its own.
10. **All five sizes, one camera?** Yes (§7).

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, the reason, and the answer I assumed. Reverse any by number. (Renumbered after the critique; §12 says what changed.)

1. **One `do-it` engine for statues, getting ready and the clean-up,** designed here with both stages. *Why:* his R9, and the master map's "one engine". *Assumed:* yes.
2. **The music: Nani's recorded claps alone by default.** A tune is a data switch that stays off until he says yes and where it comes from. It stops at a random 3-8 s. *Why:* question 16 is still his call; claps are the family's own sound; nothing generated or stock goes in unasked. *Assumed:* yes (Zafar, 1 Nov: the recommendation for now).
3. **Statues' gesture is one tap on a pose card.** The cards are crops of Zara's own poses, with no text, in a column beside the dancers; the touch cards are head-and-shoulders crops, proven at 64 px on a lab page first. *Why:* one gesture, big targets, readable on phones. *Assumed:* yes.
4. **Everyone does the pose the child picked,** and nobody is ever "out". *Why:* non-negotiable 7. *Assumed:* yes.
5. **The dancers are Zara and Yusuf** (Sana on visit 2). The child's own character stays off screen and slides in only for the crown and the handover. *Why:* pose art for the child's character is costly, and a figure standing still at a dance is a sad note. *Assumed:* yes.
6. **When the music stops the dancers bob, waiting; "stop" is the real statue freeze.** Dance is heard at L1 and decides from L2; stop and stand join at L2. A wrong "dance" tap never restarts the music. *Why:* a frozen default would show the stop answer; the dance card must never become the music button. *Assumed:* yes.
7. **Body parts are cards ("touch your nose"), not taps on the dancer's body,** and visit 1 uses only head parts (nose, head, ear ✓). Tummy, knee and foot wait for mid-body cards proven at 64 px, or tablets (visit 3). *Why:* the nose is about 15 px on a phone; a full-body card can't show which part. *Assumed:* yes.
8. **Visit 1 is the scope's vocabulary.** Clap, hands up, everyone, sleep, Sana, the elder form, the tempo, the garden, dry, the hairbrush, the jumper and the weather go to visits 2-3. *Why:* the scope, the research's "keep it short", and Mum's recording load. *Assumed:* yes.
9. **The off-screen round runs once per play,** at the end of the last round (a data setting; "every other round" is the other choice). Unscored, 3 calls, the model 2 s after, a tap skips it, a cog switch defaults to on. *Why:* the strongest verb evidence, kept an event instead of a chore. *Assumed:* yes.
10. **No mic and no camera in the off-screen round.** *Why:* privacy and simplicity; it's unscored. *Assumed:* yes.
11. **The statues prize is a plain paper crown,** worn in the family photo. Never a sweet. *Why:* non-negotiable 9, and a carry into Snap. *Assumed:* yes.
12. **You be Nani from statues L3 (or visit 2),** using the one shared speaking moment. Closed set: sit, jump, turn. *Why:* a natural exchange the child has watched many times. *Assumed:* yes.
13. **Getting ready is three children who slept over: Ali and two little cousins** (placeholders), each with their own state. The called child steps forward on visit 1; the name decides on visit 2 with give-to's two taps. *Why:* one child can't hear a call three times or repeat a once-only job; three children give every word three hearings and an honest leak test. *Assumed:* yes (Zafar, 1 Nov: the recommendation for now).
14. **Getting ready's gesture is tap the thing:** it hops into the called child's hand, they do it and put it back. *Why:* toy-like, one gesture at every level. *Assumed:* yes.
15. **Nani's calls are shuffled across children and jobs, out of routine order on purpose,** and the comedy is in it. "Wake up" is the clock's word only. *Why:* the scope; the clock decides "wake up". *Assumed:* yes.
16. **Dressed children always reach the bag:** "get dressed" is heard at the end of every round and decides only at L4. *Why:* the story needs ready children for the bag without "get dressed is always called" becoming a pattern. *Assumed:* yes.
17. **"First ... then" at L4 in both stages,** sometimes against the routine's order. *Why:* the heard order decides; two calls without a new gesture. *Assumed:* yes.
18. **What decides in getting ready is said plainly:** the thing's word at L1, the noun within a pair from L2, the verb on one thing (wash against dry) on visit 2. *Why:* each thing has one job; the doc shouldn't claim more. *Assumed:* yes.
19. **Round sizes follow the 29 Oct rule:** one override, L1 (statues 6 stops, getting ready 9 calls), then even steps to L4 (statues 6/7/7/8; getting ready 9/9/10/10). *Why:* his rule; the override is for the three hearings. *Assumed:* yes, built this way (Zafar, 1 Nov: the recommendation for now).
20. **L2 has the rulebook's "no" ask in both stages:** "jump, don't sit!" and "wash your hands, not your face!", the "no" said last. *Why:* his 29 Oct rule; a negated ask says what to do, unlike Simon says. *Assumed:* yes, built this way (Zafar, 1 Nov: the recommendation for now).
21. **Every miss passes "could a child copy this at Nani's?":** no furniture, nothing spun into, food never played with, shoes only on feet, nothing near a mouth. *Why:* lessons §11, non-negotiable 9. *Assumed:* yes.
22. **Lab pages before the art run:** the three children's layers at the four sizes, and every statues card at 64 px. *Why:* layered dolls can misalign, and the touch cards must read on phones. *Assumed:* yes.
23. **The game counts as teaching only once Mum's L1 lines are recorded** (about 10). Bare commands to a child; elder forms wait for visit 2. *Why:* grey English is a reader's win. *Assumed:* yes.
24. **The party order is `party-gifts.md`'s:** door, ride, introductions, look after the guests, statues, the cake, Snap, the presents, home, the book. *Why:* the newest of the three, and it keeps give-to stages apart; `party-guests.md` §2 and the master map change with it. *Assumed:* yes (Zafar, 1 Nov: the recommendation for now).
25. **The host family's grandmother is *dadima*,** never "Zara's nani", and she stays off the dance floor until visit 2 and the recorded elder forms. *Why:* the gifts critique's two-Nani finding, as the gifts design decided it. *Assumed:* yes.
26. **Breakfast comes on Nani's tray at the door,** and nobody drinks milk here (the clock served it). *Why:* how a Nani's house works, and no serving twice. *Assumed:* yes.

**Open questions:** Zafar took the recommendations for now (1 Nov): claps alone, the round sizes and the "no" asks as built, Ali and two placeholder cousins, and the one party order. Left for Mum:
1. **For Mum:** does she use *firai* for a person turning round; what does she say for "jump", "stand up", "stop" (she has said English *stop*: confirm for children freezing) and "don't sit"; and does "first ... then" have a natural frame?

---

## 11. ChatGPT mock-up prompts

All five are mock-ups for Zafar to judge the look and scale. **The real pose cards and things are separate crops and cut-outs** made from the approved renders; the cards drawn inside these scenes only show the layout, and their in-scene look is not the asset.

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

### Prompt do-it-engine-1: musical statues, level 1 (the first stop)

What it should show: the party room the moment after the child tapped the "sit" card. It shows the whole loop (Nani claps and calls, the child taps a pose card, everyone does it), and how big the dancers and cards are. The cards drawn here show the layout only; the real cards are separate crops.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no menus, no buttons). Eye-level camera, wide, horizon at about 55-60% of the frame, full bodies standing on the floor.

The scene: the bright front room of a modern East African family home with gentle Kutch touches: limewash cream walls, pale oak floor, floor cushions pushed back against the walls, plain coloured balloons and plain fabric bunting on the back wall with no writing. Late-morning sun from the upper left, soft contact shadows on the floor.

Centre, on the open floor well away from the cushions: two young children have just dropped to sit cross-legged on the floor at the same moment, mid-giggle: a 4-year-old girl in a marigold kameez with a light dupatta over leggings (centre, a step nearer the viewer), and a 6-year-old boy in a striped cotton kurta and trousers, who is wobbling a little as he lands. A tiny soft sparkle burst around them, as if they have just frozen into the pose.

Right: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, standing three-quarter on, hands just apart after a clap, smiling at the children.

Left edge of the play area: a vertical column of two large rounded cream cards, each a small clean full-body picture of the same girl in a pose: the top card shows her sitting cross-legged, the bottom card shows her mid-jump with knees up. The top (sitting) card has a soft warm gold glow, as if it has just been tapped; the rest of the room is lit normally.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no cel shading, no blur or vignette.

Absolutely no text, letters, numbers or symbols anywhere: not on the cards, bunting, balloons or clothes.

Must read at phone size: both children's faces and their sitting pose, the two pose cards and the difference between them, the glow on the chosen card, and the grandmother's clap.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
```

### Prompt do-it-engine-2: musical statues, level 3 ("touch your nose")

What it should show: the harder levels. Four pose cards, two of them head-and-shoulders "touch" cards, so Zafar sees whether a finger on the nose and a finger on the head can be told apart at card size. Two dancers only, so the frame stays readable. The cards drawn here show the layout only; the real cards are separate crops, tested at 64 px on a lab page.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, wide, horizon at about 55-60%, full bodies on the floor.

The scene: the same bright modern front room (limewash cream walls, pale oak floor, cushions pushed back against the walls, plain balloons and plain bunting without writing), late-morning sun from the upper left.

Centre, on the open floor: two children have just frozen in the same pose, each touching the tip of their own nose with one finger and looking cross-eyed at it, laughing: a 4-year-old girl in a marigold kameez with a light dupatta over leggings (centre, a step nearer the viewer) and a 6-year-old boy in a striped kurta and trousers, who is wobbling a little. A small soft sparkle around them.

Right: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, three-quarter on, laughing, hands mid-clap.

Left edge: two short columns of large rounded cream cards (four cards), each a clean small picture of the same girl. Two cards are close-up head-and-shoulders pictures: one with her finger on the tip of her nose, one with her hand flat on the top of her head. Two cards are full-body: one mid-jump with knees up, one turned round with her back to us. The "finger on nose" card has a soft gold glow, as if just tapped.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, expressive faces, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers or symbols anywhere.

Must read at phone size: the two children's faces, and the four cards, especially the finger on the nose against the hand on the head in the two close-up cards.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
```

### Prompt do-it-engine-3: the off-screen round ("now you!")

What it should show: the moment Nani turns to the real child. Zafar sees how the screen asks a child to move their own body, without text and without a camera.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, horizon at about 55-60%.

The scene: the same bright modern front room (limewash cream walls, pale oak floor, cushions against the walls, plain balloons and plain bunting without writing), late-morning sun from the upper left.

Foreground, slightly right of centre and large: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, now turned to face the viewer directly, leaning forward a little with a warm, playful smile, one hand stretched out palm-up towards the viewer, inviting the person holding the screen to dance.

Behind her, smaller, a 4-year-old girl in a marigold kameez with a light dupatta over leggings and a 6-year-old boy in a striped kurta and trousers stand on the open floor, knees a little bent, grinning at the viewer, waiting to copy.

No cards on screen in this moment.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers, musical notation, swirls or symbols of any kind anywhere.

Must read at phone size: the grandmother's face looking straight out and her inviting hand, and the two children's eager faces behind her.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
```

### Prompt do-it-engine-4: getting ready, level 1 ("comb your hair")

What it should show: the children's room, the three children, the things in reach and Nani's breakfast tray, at the moment the oldest boy's bed-hair springs flat. Zafar sees the routine setting, the scale of three children and the things on a phone, and the transformation. The things drawn here show the layout only; the real things are separate cut-outs.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front view, horizon at about the hip height of the tallest child, full bodies standing on the floor.

The scene: a calm children's bedroom in a grandmother's modern East African home with one gentle Kutch nod (an ajrakh-patterned bedspread on the bed behind them). Limewash cream walls, pale oak floor, soft early-morning sun from the upper left through a window.

Centre, in a row: three children in plain long-sleeved cotton pyjamas with no pattern. In the middle, a tall, lanky 8-year-old boy, mid-comb: one hand runs a simple wooden comb through his hair; half his hair is still wildly sticking up from sleep, the other half suddenly smooth and neat, with a tiny soft sparkle where it sprang flat. He's grinning, still a bit sleepy-eyed. On his left, a 5-year-old girl with her hair sticking up from sleep, yawning. On his right, a 4-year-old boy with wild bed-hair, rubbing one eye.

Left of the children: a low wooden shelf by a small basin, with a steel cup holding three toothbrushes and an empty spot where the comb lives. Right of the children: a clothes rail with three sets of plain school clothes on hangers. Each thing is large, clearly separated, and lit evenly.

Far right, at the doorway: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, three-quarter on, smiling, holding a tray with three plain steel bowls and spoons.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, believable simple materials (steel, wood, cotton), chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers or symbols anywhere: none on the clothes, toothbrushes or tray.

Must read at phone size: the three children's faces and the oldest boy's half-messy, half-neat hair, the comb in his hand, and each thing (toothbrush cup, school clothes, the tray of bowls) as clearly different shapes.

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
```

### Prompt do-it-engine-5: getting ready, level 3 (a funny miss: the sock puppet)

What it should show: the busier L3 room with eight things, and a wrong pick played as a joke, not a verdict. Zafar sees how a miss feels, and that the pairs (socks against shoes, soap against flannel) stay readable. The things drawn here show the layout only.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front view, horizon at about the tallest child's hip height, full bodies on the floor.

The scene: the same calm children's bedroom in a grandmother's modern East African home (limewash cream walls, pale oak floor, ajrakh-patterned bedspread behind), soft morning sun from the upper left.

Centre, in a row: three children with neatly combed hair, still in plain long-sleeved pyjamas with no pattern. The tall, lanky 8-year-old boy in the middle has pulled a plain white sock onto his hand like a puppet and is making it "talk" towards the viewer with a cheeky grin. He looks playful, never told off. The 5-year-old girl beside him laughs behind her hand; the 4-year-old boy on the other side points at the sock puppet, delighted.

Left: a low shelf by a small basin with a steel cup of three toothbrushes, a simple wooden comb, a bar of soap, and a folded flannel, each separate. Right: a clothes rail with plain school clothes on hangers and plain white socks hanging in pairs; a row of three pairs of plain school shoes on the floor beneath it. Each thing is large, separated, and evenly lit.

Far right, at the doorway: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, laughing with a hand to her mouth.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, simple believable materials, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers or symbols anywhere; no stripes or prints on clothes or socks.

Must read at phone size: the sock puppet on his hand and the three faces, the grandmother laughing, and the eight things as distinct shapes (especially the shoes against the socks, and the soap against the flannel).

Attach as references:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp
```

Prompts 1-3 describe the same room as `party-guests` prompts 1-2 (limewash, oak, bunting), so the backgrounds will match if the party's is locked first.

---

**Sources for tonight's web searches:**
- [Stop and Go, a freeze-style game (Mentalyc; vendor)](https://www.mentalyc.com/therapy-games-and-tools/stop-and-go-game)
- [Freeze Dance (Wonderschool curriculum)](https://curriculum.wonderschool.com/home/age-group/toddler/freeze-dance)
- [Building executive function through games (NAEYC)](https://naeyc.org/node/5352)
- [Pepi Bath (app listing)](https://apps.apple.com/mx/app/pepi-bath/id505124220)

---

## 12. Changes after the critique

Each finding from `do-it-engine-critique.md`, then what I did.

**MUST**

1. **Getting ready's state model contradicted itself; the leak test was false.** Took the strong version: a round is **three children** (Ali and two little cousins, placeholders), each with their own state, every L1 call made once per child. The leak test is now written from that state: done states are visible (hair, bowls), teeth leave no mark, a child's last call at L1 can be won by elimination (three taps of nine) but the round can't (about 0.5%), and the bot reports elimination wins. "Things go back" stays (true of the things) but no longer claims nothing is crossed off; "bed-hair all round" and "a call can repeat" are deleted. **One part not taken:** the person word doesn't decide on visit 1. With one gesture at every level, letting the name pick the child needs give-to's two taps; that's visit 2 (§5), so visit 1 keeps one tap throughout. The cheap one-Ali version is open question 5.
2. **"Stop" was the pose the dancers were already in.** When the music stops the dancers now do a **waiting bob** (no card's picture). **Stop** is the real statue freeze, **stand** is straight and still, **dance** restarts the music. A wrong "dance" tap never restarts the music (a stumble step, Nani repeats). The leak test's matching line, the L4 look-alike and a 64 px dance-against-stop check on the lab page are rewritten from it.
3. **Two rulebook overrides filed as assumed yeses.** Zafar's 29 Oct rule wins: the ladders now follow it (one override, L1, then even steps: statues 6/7/7/8, getting ready 9/9/10/10) and L2 has the "no" ask in both stages ("jump, don't sit!", "wash your hands, not your face!", the "no" said last as the rulebook asks). Both are open questions 3 and 4, each saying what my first draft did and that it "reverses your 29 Oct rule". Simon says stays cut, with the difference from a negated ask written in the pool.
4. **Body-part cards couldn't be told apart at 64 px.** The touch cards are **head-and-shoulders crops** of the same render, proven at 64 px on a lab page before the art run. Visit 1 uses head parts only: nose, head and **ear** (✓, already recorded); tummy, knee and foot go to visit 3 on proven mid-body cards or tablets. Prompt 2's phone-size line now asks only for faces and the four cards.
5. **Too many new words for the hearings.** Statues L1 is **sit and jump** for its first rounds over **6 stops** (3 hearings each), turn joining within L1, stand and stop at L2, "everyone" moved to visit 2. Getting ready L1 is three calls (brush, comb, breakfast) to three children: every word heard 3 times. Wash moves to L2, get dressed to L4. §1's table and §9 row 10 are recounted.
6. **Two Nanis, and two party orders.** "Zara's nani" is gone: the host family's grandmother is **dadima** (the gifts design's decision after its critique), off the dance floor until visit 2 and the recorded elder forms. The party order is now `party-gifts.md`'s, named in §2 and §10 (decision 24, open question 6), with a note that `party-guests.md` §2 and the master map must take it (I edited no other file).
7. **Two misses broke the safety and culture lines.** Jump-for-sit lands in a giggling heap **on the floor, cushions untouched**; the shoe hat is now **shoes on the wrong feet** (pigeon-toed, then swapped). Every miss was reread against "could a child copy this at Nani's?": the dizzy spin no longer bumps into anyone, and the comb miss stops short of the mouth. §9 row 11 and decision 21 say so.

**SHOULD**

8. **"The verb decides" was half true.** Said plainly in §1, the B1 five questions, the pool and §9: the thing's word at L1, the noun within a pair from L2, wash against dry on one face at visit 2.
9. **Scope creep.** Visit 1 is the scope's vocabulary. The elder form, clap, hands up, everyone, sleep, Sana, the tempo, the garden, dry, the hairbrush, the jumper, the weather and milk moved to visits 2-3 (§5). Statues L4 keeps its own look-alikes with no new words (stand against stop; sit against turn-round-and-sit). The art list drops to two dancers (about 24 poses) and about 8 items.
10. **The first round showed too much and named unrecorded things.** Statues shows one action once (sit, lit alone), then goes live with two cards. Getting ready's things bounce silently, no names; the school clothes, never called before L4, are the "not on the card" thing. The finger question is deleted (the rulebook already says no finger).
11. **Continuity with the clock and the bag.** The stage opens on the children already up (the clock's carry); "wake up" is heard only in the clock. The carry out is "now the bag", and the child packs it. Breakfast is Nani's tray at the door, not a stool in the bedroom; milk is dropped (the clock serves it).
12. **The off-screen round after every round.** Once per play, at the end, as a data setting ("every other round" as the other choice); the cog stays.
13. **The child's character standing still.** It's off screen, the child as the camera, and slides in only for the crown and the handover.
14. **Kutchi bookkeeping.** "Dance slowly" now asks for *aste thi* ✓ (B2), not the *slow* loan; "stop" cites grammar-notes §25 B19 (Mum said English *stop*) so the sheet asks her to confirm; §0 says two verbs are in the engine (*we*, *firai*, with the meaning question); *shabash, beta* is noted as inside the S2 line and uncuttable, so Nani uses *shabash* ✓; the first-go rule is in the engine paragraph; Dress up's doll is named as `js/dress/doll.js`.
15. **The music's source and default.** Claps alone by default; the tune is a switch that stays off until Zafar says yes and where it comes from (a family hum suggested). Decision 2 and open question 1 rewritten; the kalimba is gone.
16. **The ChatGPT prompts.** A line above the prompts and in each "what it should show" says the real cards and things are separate crops and cut-outs. Prompt 2 drops Sana and the second grandmother (two dancers), and asks for head-and-shoulders touch cards. Prompt 3 drops the swirls and the speaker and forbids "symbols of any kind". Prompt 4 drops the glow and the stool (Nani holds the tray at the door), and shows the three children. Prompt 5 drops the glass of milk, is now L3 (socks), and asks for plain pyjamas and socks with no stripes or prints. The new statues prompts place the dancers on the open floor, away from the cushions.

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** The school day's order in §2B is now the clock, then the door, then getting ready, as `school-day.md` and `wake-up-clock.md` have it; the two little cousins sleep in the clock's bedroom (its §3 has the line). The party order was already `party-gifts.md`'s; `party-guests.md` now matches it and parks the after-statues round. The party cast is the one shared list in `party-gifts.md` §0: Zara is 4 on visit 1, in a marigold kameez, and the prompts say so.

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **"How it plays"** added near the top, as he asked: musical statues and getting ready in 30 seconds.
- **Musical statues: the recommendation for now.** Open questions 1 and 3-6 are closed on the recommendations (claps alone, the round sizes, the "no" asks, Ali and two placeholder cousins, the one party order); only Mum's question remains.
- **Level up only on right-first-time rounds,** written into the engine paragraph.
- **Voices:** recording is not a blocker for the prototype (existing takes, else the device voice).
- **Clothes:** the prompt sheet's line is added before the prompts (the dancers and the cousins in modern casual clothes, Nani as drawn).
