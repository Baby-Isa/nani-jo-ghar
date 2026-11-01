# The school day: pack the school bag, and the blackboard

Designed overnight, 1 Nov 2026, while Zafar slept; revised the same night after an independent critique (`school-day-critique.md`; what changed is in §12). Every choice he hasn't made is in §10, with the answer I assumed, so he can reverse it. Nothing here is built. The Kutchi is only what the repo holds (`data/lang/lexicon.json`, `data/lang/clips.json`, the word inventory); everything else is English, marked "to record". The wake-up clock and getting ready open this day but are designed on their own; this file designs the bag, the board and the teacher's helper job, and says how they join up.

## 0. One line

- **What:** two games for the school day. **A. Pack the school bag:** at Nani's front door, Nani names what goes in; toys are the decoys, and on "show-and-tell day" one toy is wanted. **B. The blackboard:** the teacher calls the child up as her helper; a lesson is two or three board jobs from a pool of four (draw it, colour it, count them, rub it out). Every board job is pictures, colours and counts, never letters, words or written numbers (non-negotiable 3). From L3 the child takes the teacher's turn and tells Ali what to draw.
- **Day (the wake-up clock's order):** the wake-up clock (the night before, ending at sunrise), the door (with the clock's morning sky), getting ready, **A**, the bus, **B**, home, the evening book.
- **Status:** A designed (`docs/game-design/modes/pack-the-bag.md`); this is the day's bag stage (the glue's "pack the bag" for this trip). B new. Tidy's school bag is kept here; Tidy's bookshelf is parked (§10, decision 26).
- **Engines:** A is pack the bag (a reskin of Cook's pantry fetch) plus `js/shared/whichone.js`. B is **not a new engine**: colour it and rub it out are the `do-it` engine's two-tap tool on a thing (`do-it-engine.md`, `clean-up-day.md` C2), with board pictures as the things and their states (drawn, red, green, gone). Only two modules are new: **trace-and-reveal** (draw it; the foot game's track plus the cut game's dot-to-dot) and **ring the group** (count them). The board is a background with a tray, run by the shared kit.
- **Size:** medium, kept medium by scope. The first build ships **L1-L2 of both games**: four board pictures (bird, goat, car, house), two colours (red, green), the bag's L1-L2 things, and about **48 art pieces in four paste blocks** (§7). L3-L4 art is a second run once L1-L2 plays.

## 1. The language goal

**Word groups:** school (main); colours and numbers (main on the board); toys (decoys, and show-and-tell); sizes (big, small); owners (yours, Ali's); things drawn (words met on other days, so the board reuses them); the board verbs (draw, colour, rub out, count).

**What each game teaches that the other doesn't:**
- **A** teaches the school things as nouns, owners and "not", and numbers on real objects.
- **B** teaches the board verbs (colour and rub out decide between themselves from L2), the colours, numbers 1-5 as groups, and big and small, on nouns the child already half knows. It also carries the job word "teacher" and the child's helper role.

**The words.** ✓ means a family recording of the word on its own. "In engine" means the Kutchi is in the repo but has no clip of its own yet. "To record" means nothing in the repo. I never invent Kutchi.

| English | Kutchi in the repo | Status | Used in |
|---|---|---|---|
| school | – | to record | A (Nani's line), B |
| teacher | – | to record | A, B |
| book | – | to record | A, B (the sticker goes on it) |
| pencil | – | to record | A |
| crayon | – | to record | A L2+ |
| (school) bag | – | to record | A |
| lunchbox | – | to record | A L3+ (second run) |
| water bottle (bottle) | – | to record (n.bottle is a placeholder) | A L4 (second run) |
| chalk | – | to record | B |
| board | – | to record (n.board-2 placeholder) | B |
| sticker | – | to record (n.sticker placeholder) | B's end |
| ball, teddy, doll | – | to record | A decoys; show-and-tell |
| car (toy car; car on the board) | *gadi* | in engine; heard inside 1 recorded line (*wadhi gadi je andar*) | A decoy (L3+), B; speaking set |
| bird | *chakli* | in engine; heard inside 1 recorded line (*dayi chakli*) | B; speaking set |
| she-goat | *bakri* | in engine; heard inside 5 recorded lines (e.g. *nani ji bakri*) | B; speaking set |
| house | *ghar* | in engine (confirmed), no clip | B; speaking spare once recorded |
| apple | *safarjan* | in engine (draft, unconfirmed) | B second run (count), the lunchbox, once Mum confirms |
| banana | *kelo* | in engine (draft) | B second run, once Mum confirms |
| sun, fish, tree, flower | – | to record | B second run |
| red | *laal* | ✓ recorded alone | B |
| not the red one | *laal na* | ✓ whole line recorded | B L2 |
| green | *lilo* | in engine (confirmed), no clip | B |
| yellow, blue, white | – | to record | B second run |
| one, two, three, four, five | *hakro, ba, trae, char, panj* | in engine (1-4 confirmed, 5 draft); 1, 3 and 4 heard inside recorded lines | A L2+, B (count) |
| big | *wadho* | in engine; heard inside 30 recorded lines | A L3, B L3 |
| small | *nindho* | ✓ recorded alone | A L3, B L3 |
| this one, not that one | *hi na, hu* | in engine (confirmed) | both, as Nani's and the teacher's recast |
| how many | *kitla* | in engine (confirmed) | B L3 |
| put in (to put something in) | *wij*; "put it in" *wiji chad* | in engine (confirmed) | A |
| take (something) to school | – | **to record as a whole frame; no verb guessed** (*khan* is "take" as in "take the big one", and may not be the verb here) | A show-and-tell |
| draw, colour, rub out (wipe), count, put a ring round | – | to record (all forms) | B |
| give | *de* | in engine (confirmed) | B's end ("give me your book", the sticker) |
| well done | *shabash* | ✓ recorded alone | both |
| circle, square, triangle | – | **ask Mum first** whether Kutchi has them | B L4 only, if she does |

**Verbs:** put in, take to school (A); draw, colour, rub out, count (B's four jobs); give (the sticker). "Put" is #7 on the top-40 list, "take" #16, "give" #20. Draw and count are not on the top-40 list; they are this day's own verbs.

**Frames heard** (English meanings; each to be built by the language engine from recorded phrases; grey italic until then). Each new word comes **three times in a right-go round**: the ask, the word as the thing moves, and the call-back at the end.
- A, Nani: "Put the {thing} in the bag." / "Put {n} {things} in the bag." / "Not the {toy}." (said last) / "Your {thing}, not Ali's." / "the big {thing}" / "Take your {toy} to school today: it's show-and-tell." (a whole frame for Mum) / as each thing hops in, its word ("The book!") / at the zip, the call-back ("Book, pencil: *shabash*!") / on Simba: "Simba! Out you come."
- B, the teacher: "Good morning! Come, you're my helper today." / "{Ali}, draw the {thing}." (the model) / "Now you: draw the {thing}." / the verb as the action plays ("Draw it!" "Colour it!" "Rub it out!") / "Colour the {thing} {colour}." / "Not the red one: the green one." (*laal na* ✓) / "Put a ring round the {n} {things}." / then she counts them aloud, one word per bounce / "Rub out the {colour/size} {thing}." / at the bell, the call-back naming the lesson's pictures ("Bird, house: well done, my helper.") / "Give me your book." (the sticker).
- The evening book (past, the book's own frames): "At school I drew a bird." "I packed my book and my pencil."

**Frames said** (B only, from L3, the child as teacher): the closed set *chakli* (bird), *bakri* (goat), *gadi* (car). Three confirmed words that sound different, each already heard in family clips (*dayi chakli*; *nani ji bakri* and four more; *wadhi gadi je andar*). *ghar* (house) is the spare once it has a clip. The speaking model is the teacher's "Ali, draw the {bird/goat/car}"; those three lines are on Mum's list (§6), and **the speaking turn stays off until they are recorded** (speaking rung 1 repeats a recorded model).

**New words per level** (lessons §10: 3-5 new a round, each heard at least 3 times):
- **A:** L1 3 (book, pencil, bag); L2 2 (crayon, "not", with numbers coming back); L3 2 (lunchbox, owners); L4 1 (water bottle; the lookalikes reuse words).
- **B:** L1 3 (teacher, draw, colour; bird, house and red come back); L2 2 (count, rub out; green joins red); L3 1-2 (size on the board; big and small come back); L4 1-3 (the shape words, only if Mum has them).

**The deciding words and their recordings (lessons §1).**
- **A's deciding words** are about ten school things and toys. **None is recorded today.**
- **B's** are four verbs (none recorded), red (✓), green (in engine), five numbers (in engine, no clips) and four nouns (in engine, three heard inside recorded lines).
- **So neither game teaches yet.** A reader wins on English placeholders. Mum's school round comes before any build (the list is in §6).

**Both words decide, from L2 (a data check).** Mum may well say some school nouns as English loanwords (the family says "help kar de" and "fine"); her word is the one that ships. A noun that sounds English decides nothing for an English speaker, and the reverse holds too: if the number or colour alone picks, the noun teaches nothing. So **from L2, for every ask, dropping either deciding word must leave at least two candidates**: two pencil counts and two kinds; two cars and two red things; one and two of two different pictures. `data/school.json` is checked for this (`node build/tools/review/checks.mjs`, a new row in `checks-to-build.md`), and the bot that knows only one of the two words must lose (§3 bots).

## 2. Where it sits in the day, and what carries

| # | Stage | Engine | What carries |
|---|---|---|---|
| 1 | The wake-up clock | new (`wake-up-clock.md`) | the night before; everyone wakes; the window's sky is the day's weather |
| 2 | Door | the door (built) | the clock's morning sky; Nani: "today it's school" |
| 3 | Getting ready | `do-it` (`do-it-engine.md`) | dressed in the school jumper |
| 4 | **A. Pack the school bag** | pack the bag | the book and the pencil, used in B |
| 5 | The bus | the window ride (built), "get in the bus" | the ride to school; the bag on the seat; the clock's hour |
| 6 | **B. The blackboard** | `do-it` tool plus two new board modules | the drawn picture becomes the day's sticker |
| 7 | Home, the evening book | the book (built) | the sticker on the book's cover and the packed things on the page |

This is the order `wake-up-clock.md` §2 gives, for its reason: the clock starts the night before and ends at sunrise, so it must come before the door. `do-it-engine.md` §2B now has the same order (consistency pass, 1 Nov; §10, decision 23).

- **A to the bus:** the bag zips shut, a horn toots outside, and the door opens onto the bus. The bag rides on the seat beside the window (art only, no ask).
- **The bus to B:** the classroom opens with the bag on the child's desk. The things packed come out onto the desk by themselves, one hop each (a show, not a test).
- **B to the book:** at the bell the teacher presses the drawn picture onto the child's book as a sticker (the picture's own drawn state on the cover: no new art), and the book goes back in the bag. The evening book's existing page shows it and says what was drawn. A stickers page across visits is parked (decision 28).
- **Rhythm:** the clock is calm, getting ready is busy, A is calm and quick, the bus is watching, B is calm with two or three funny bursts. Getting ready and B both use `do-it`, but never back to back (A and the bus sit between).
- **Ali:** the cousin goes to the same school. His bag stands next to the child's (owners in A, L3+), and he is the model at the board (B).

## 3. The games

### A. Pack the school bag

**Why (said at the start):** Nani, at the bench by her front door: "School today! Let's pack your bag." She stands at the right, three-quarter on, the open bag on the bench at her end of it.

**Steps:** things stand on the bench and the low cubby under it (F view, like the pantry). The bag stands at the bench's right end, beside Nani, and is not one of the slots. Nani says one line. The thing's card pops up big beside the side panel, then flies into its row. The child **taps the thing**: it hops into the bag with its own sound (the book thumps, the pencils rattle), and Nani says its word as it lands ("The book!"). The row ticks. When the last row ticks, the bag zips itself shut and Nani calls the packed things back ("Book, pencil: *shabash*!"). A tap on a packed thing, before the next ask, hops it back out (the undo).

**Counts (L2+).** A count ask always has **more of that thing than asked**: three or four pencils for "two" (the rulebook's "decoy of the same kind", counted in the decoy budget). A counted group stands in one slot, each member its own tap target at least 44 px wide. Each pencil that hops in fills one dot on the pencil row's card (`tally.js`: dots, never digits). **The row ticks the moment the right count is reached, and an extra pencil doesn't land** (it stays on the bench), Zafar's count rule of 1 Nov, reversed after the chai play. No "too many" or "too few" miss exists any more; a short count is simply not yet ticked, and the number can be said again for free. By Zafar's choice (1 Nov), the count can be won by tapping until it ticks; the noun (which thing) still decides, and so do the owner, the size and "not" wherever two words decide a move.
- the right count, reached with no wrong thing: the row ticks gold; a wrong thing tapped first gets the funny hop-back and the row ticks plain;
- (Superseded 1 Nov: the old too-few and too-many misses are gone; counts tick at the number.)
- (Superseded 1 Nov, see above.)

**The five questions:**

| Question | Answer | Score |
|---|---|---|
| 1. What do you do? | Tap a thing; it hops in. One gesture, the same at every level | 4 |
| 2. Does the Kutchi decide it? | L1 the noun. From L2 the number (with spare pencils) or "not". L3 the owner or the size, and on show-and-tell day a toy is wanted. L4 two in one line, with lookalikes | 4 |
| 3. The fun | Every thing hops in with its own sound; a toy put in wriggles back out with its own joke; Simba climbs in (below); the zip | 3 |
| 4. The instruction | Nani on screen, speaking first; the card pops and flies to its row (lessons §3) | 4 |
| 5. What is novel | Owners and the show-and-tell twist are new; the action itself is pack the bag's, on purpose (a known, quick opener) | 3 |
| **Total** | | **18/25** |

**Level ladder.** The rule gives 1, 2, 4, 5 things packed. I override L1 to 2 (packing one thing isn't a round) and L4 to 4 (the phone holds seven slots, §7). **At most seven slots at any size** (a counted group is one slot; the bag is not a slot).

| Level | The one new thing | Example ask | On the bench and cubby |
|---|---|---|---|
| **L1** | The school nouns; "yes" asks only | "Put the book in the bag." then "Put the pencil in the bag." | 3 slots: the 2 asked things plus 1 clearly different decoy (a ball). Card: picture and Kutchi |
| **L2** | **Numbers and "not"** ("no" said last) | "Put the book in the bag." / "Put two pencils in the bag." ... "Not the ball." | 4 slots: the asked school thing, the pencils (count plus one or two spare), the unasked school thing (book or crayons, whichever wasn't asked), a toy. Card's English dotted |
| **L3** | **Other ways of saying it: owners and size**; show-and-tell day | "Your book, not Ali's." / "The small book." / "Take your teddy to school today." | Ali's bag beside the child's (both at the bench's end); his book and lunchbox among the things; two books (big and small). One round in four is show-and-tell: one toy is asked. Picture on the card blurred. 6 slots |
| **L4** | **Two in one line, and lookalikes** | "Two pencils and the red crayon." | 7 slots: the pencils with a pen among them, a red and a green crayon, the child's and Ali's lunchboxes, the book, a toy. 4 asks |

**Leak test:**

| Way to cheat | Why it fails, and the fix |
|---|---|
| **Reading** | No English in the play area. The card's Kutchi shows only while a word is supported, then speaker only. English placeholders are a reader's leak, so **A ships only with its deciding words recorded** (lessons §1) |
| **Matching** | The card's picture matches a thing only while supported (allowed: right picks while supported move the ladder). From L3 the picture is blurred; there are two books, two lunchboxes, pen and pencil, red and green crayons, so a picture alone can't pick |
| **Eliminating** | "Toys don't go to school" is the obvious cheat. **Show-and-tell day** (one round in four from L3, random) makes a toy right, so leaving every toy fails. From L2 an unasked school thing is always out too, so "pack every school thing" over-packs; and a count always has spares, so "pack every pencil" over-packs. There are always more things than asks, and the last ask never has only one candidate left |
| **Patterns** | Which things are asked, their order, the count asked (1-3 at L2, to 4 at L4) and where each stands are random per round. The book is not always first. Owners swap: some rounds Nani wants Ali's book packed for him |
| **Waiting** | Nothing packs itself and nothing glows on the answer. The hint after 7, 9, 11 or 13 s repeats the ask. The helper card, which costs a bulb, shows the full answer |
| **Fishing** | A wrong tap: the thing wriggles, Nani says its word (*hi na, hu*: "not this one, that one" when it fits), and it stays out. Only a first-go right pick (and a right first count) ticks gold and moves the word's ladder (lessons §1) |

**The bot:** winning means every row ticked gold (a round that moves up; Zafar, 1 Nov: level up only on right-first-time rounds). The random bot and the "never a toy" bot must win under 10% of rounds from L2. **Count rows (changed 1 Nov):** the number ticks on its own, so the "pack every one of the asked thing" bot now ticks a count row gold, and so does the "knows the noun, guesses the count" bot; the noun alone decides the bag's count rows, and the bot's odds for a count row are the noun's alone (about 1 in 3 at L2's four slots), so the lab bot recounts the bag's L2 against the 10% line. By Zafar's choice (1 Nov), the count can be won by tapping until it ticks; the noun (which thing) still decides, and so do the owner, the size and "not" wherever two words decide a move. At L1 a random tapper wins about 1 round in 6, within the supported level's allowance.

**Mistakes:** never a cross. Each toy has its own way back out: the teddy climbs out and waves, the ball boings off the wall and rolls back, the toy car reverses out with a beep, the doll sits up and shakes her head. A wrong school thing just hops back to its place.

**The delight moment:** from L2, one round in three, **Simba is in the bag**. The bag wriggles, his head pops out with a pencil in his mouth. Tap him and he hops out, drops the pencil and curls up on the doormat. (Simba is the house cat; no word is needed, but Nani's "Simba! Out you come." comes back on every visit, so the child waits for it.)

**Speaking:** none in A. It's a quick opener before the bus.

---

### B. The blackboard (the teacher's helper)

**Why (said at the start):** the teacher, at the board: "Good morning! Come, you're my helper today." (to record). She stands at the right of the board, three-quarter on, and turns front-facing on the child's turn (lessons §7).

**The lesson:** a short run of board jobs, each from a different mini-game, never the same action twice in a row (lessons §12). L1 has 2 jobs; L2-L4 have 3. Each job is a row on the left; it ticks when the job closes. Between jobs the dotted pictures fade, the drawn ones stay, and the next job's pictures appear (the teacher draws them in one quick sweep, a show).

**The model (rewritten after the critique).**
- **When:** on the first lesson at each level, and before every speaking turn. In other lessons it's skipped; on any lesson a tap skips it.
- **What:** the teacher: "Ali, draw the {goat}." Ali steps up at the **right** of the board (the teacher steps back), traces the goat, and it comes alive. Then the teacher rubs it out **with the child's own gesture** (tap the duster, tap the goat, three rubs), which is the one showing of rub-out. The goat is gone, not wiped back to dots.
- **The rule that stops the leak:** **the model's picture is never on the board for the child's next job.** The child's job is dealt fresh after the model (new pictures, new places), so remembering what Ali did tells the child nothing. The leak bot plays with memory of the model and must do no better than the random bot.

**Tools:** a chalk tray along the bottom of the board. Tap a tool to pick it up; it lifts and hovers by its spot (the `do-it` tool). Only one tool is held at once; tapping the tray puts it back. For a draw job the tray offers the white chalk. **From L2, colour and rub-out jobs offer the coloured chalks and the duster together**, so the verb picks the tool.

**The board never shows letters, words or written numbers** (non-negotiable 3). Counts are things on the board, and the teacher says the numbers aloud.

#### The pool, scored

| Mini-game | 1 Do | 2 Kutchi decides | 3 Fun | 4 Instruction | 5 Novel | Total | Engine |
|---|---|---|---|---|---|---|---|
| **B1 Draw it** (trace the dots) | 5 | 4 | 5 | 4 | 5 | 23 | **new module:** trace-and-reveal |
| **B2 Colour it** | 4 | 5 | 3 | 4 | 2 | 18 | `do-it` two-tap tool; a picture's colour is a state |
| **B3 Count them** (ring the group) | 4 | 5 | 3 | 4 | 4 | 20 | **new module:** ring the group |
| **B4 Rub it out** | 5 | 4 | 5 | 4 | 3 | 21 | `do-it` two-tap tool, with a rub (as the tooth game's brush); "gone" is a state |
| B5 Shapes (draw a circle) | 5 | 4 | 4 | 3 | 2 | 18 | **folded into B1's L4**, only if Mum has the words |
| B6 Hand out to the class (give-to) | 3 | 4 | 3 | 3 | 2 | 15 | parked: needs the party's give-to engine; a later visit |
| B7 What's gone? (Kim's game on the board) | 3 | 3 | 3 | 3 | 3 | 15 | parked: wins by tapping the gap unless answered by voice |

#### B1. Draw it

**Steps:** the board shows three or four faint dotted pictures. The teacher says "Draw the bird." The child taps the white chalk, then **drags along the dots** of the picture they choose. The chalk snaps to the dotted track and can only move along it (lessons §2: drag only along a track; the foot game's splinter path, the cut game's dot-to-dot). As it moves, the real chalk line is revealed behind it and the teacher says "Draw it!" once. When the loop closes, **the picture comes alive** for two seconds: the bird flaps and flies a loop round the top of the board, then perches on the frame; the car toots and drives a little way; the house's window lights and its chimney puffs; the goat bleats and nods. The teacher says its word ("A bird!").

**Five questions:** you trace (the best-feeling gesture we have); the noun picks which picture, among dotted pictures that could all be drawn; the fun is the drawing coming alive; the teacher speaks and the card shows the picture; novel because no other game makes a picture. The verb doesn't decide here (a dotted picture can only be drawn); B2 and B4 carry the verbs.

| Level | The one new thing | Ask | The board |
|---|---|---|---|
| **L1** | The nouns; "draw" | "Draw the bird." | 3 dotted pictures, clearly different (of bird, house, car, goat; never the model's) |
| **L2** | **Numbers:** a group | "Draw the two birds." | 4 dotted groups: one bird, two birds, one car, two cars. The number and the noun both decide. The track joins the two birds with a short dotted dash, so it's one stroke |
| **L3** | **Size** | "Draw the small house." | A big and a small house, a big and a small car. Picture on the card blurred (second run) |
| **L4** | **The lookalike** (and shapes, if Mum has them) | "Draw the sun." / "Draw the circle." | The sun and a ball, both round (rays against stripes), plus two others. With shape words: a circle, a square and a triangle; the closed circle becomes the sun and smiles (second run) |

**Leak test:** reading: no words anywhere. Matching: the card's picture matches only while supported; from L2 one and two of two things, from L3 big and small of two things, so the noun and the number (or size) are both needed. Eliminating: the model's picture is never a candidate (above); drawn pictures stay on the board, and the asked one is never the last undrawn one (at least two undrawn candidates). Patterns: the pictures and their places are random each job. Waiting: no dotted line brightens on the answer; the hint repeats the ask; the helper card costs a bulb. Fishing: a trace on the wrong picture stops at its first dot: the dots shiver, the teacher says that picture's word and "not this one, that one" (*hi na, hu*), and nothing is drawn, so nothing has to be undone.

**Delight:** the picture coming alive. Each picture has one fixed joke, the same every visit (the bird always lands on the board's frame and knocks a bit of chalk dust off).

#### B2. Colour it (the `do-it` tool)

**Steps:** drawn chalk pictures on the board. The teacher says "Colour the house red." The child taps a coloured chalk in the tray, then taps a picture. A quick chalky scribble sound plays, the teacher says "Colour it!", and the picture cross-fades to its coloured state. Tapping another tool before tapping a picture swaps it (the undo).

| Level | The one new thing | Ask | The board and tray |
|---|---|---|---|
| **L1** | One colour word | "Colour the house red." | 2 pictures; red and green chalk |
| **L2** | **The verb decides; "not"** | "Colour the car red." / "Not the red one: the green one." (*laal na* ✓) | 3 pictures, red and green chalk **and the duster** |
| **L3** | **Size plus colour** | "Colour the big bird green." | A big and a small bird, a big and a small car; 4 chalks and the duster (second run) |
| **L4** | **Two in one line, and a lookalike chalk** | "Colour the house yellow and the bird blue." | 3 pictures, 5 chalks and the duster (yellow beside white; if Mum gives orange, orange beside red) (second run) |

**Leak test:** reading: the chalks have no labels. Matching: while a colour is supported, the card shows the picture **drawn in that colour** (the swatch inside the picture, not a separate mark); past support, a speaker only, as for every job, so the card's shape never names the job. Eliminating: every chalk can colour every picture, a coloured picture can be asked again ("colour the car green" over red), and there are always more tools than colours asked. **The verb (L2+):** the duster is in the tray on a colour ask, so "colour" against "rub out" is a real decision. Patterns: tool order in the tray is shuffled each job. Waiting: as B1. Fishing: a wrong chalk on a picture: the colour slides off like a drop of water, the teacher names the colour used and asks again. **The wrong tool:** the duster on a colour ask: the picture ducks under it, and the teacher says the verb ("Colour it, not rub it out!"). Nothing is coloured or lost wrongly.

**Delight:** the fill; at L2+ a coloured car honks once.

#### B3. Count them (ring the group)

**Steps:** groups of the same chalk picture on the board, each group on its own short chalk wire or patch of grass (birds on a wire, goats on grass). The teacher says "Put a ring round the three birds." The child taps a group. A chalk ring draws itself round it (real chalk-ring art, revealed along its path), then **the teacher counts them aloud, and each bird bounces as she says its number** (counting along). The row ticks on the ring; the next job may start while she counts (her count never holds the board). The child never has to stop at a number: they choose the group that has it (lessons §4).

| Level | The one new thing | Ask | The board |
|---|---|---|---|
| **L1** | Numbers 1-3 | "Put a ring round the three birds." | 3 groups: 1, 2 and 3 birds |
| **L2** | **Two words:** which thing and how many | "Put a ring round the two goats." | Birds and goats, groups of 2 and 3 each |
| **L3** | **Other ways of saying it:** the question | "How many birds? ... Put a ring round the four." (*kitla* in engine) | Groups up to 5, four groups. Picture blurred (second run) |
| **L4** | **A lookalike, and to 5 with sizes** | "Put a ring round the five small birds." | Big and small birds in groups, plus a lookalike group (apples and oranges once Mum confirms them) (second run) |

**Leak test:** reading: no digits; the card shows the group's picture while supported, a speaker only after. Matching: from L2, two kinds share each number, so the noun and the number both decide. Eliminating: there are always at least three groups, and a ringed group stays as a candidate for the next ask on the same board. Patterns: group sizes and places are random; the asked number is not always the biggest or the middle. Waiting: as B1. Fishing: a wrong group: the teacher counts that group instead ("one, two: that's two!"), the birds bounce, then she asks again. **That miss is the lesson:** a recast with the right numbers, never a verdict.

**Delight:** the bouncing count; the last bird hops off the wire and the teacher catches it.

#### B4. Rub it out (the `do-it` tool, with a rub)

**Steps:** a board of drawn and coloured pictures. The teacher says "Rub out the red car." The child taps the duster, then taps a picture: the duster settles on it. Then the child **rubs back and forth over it** (any swipe inside the picture's box counts; three rubs clear it), and the teacher says "Rub it out!". Chalk dust puffs, the picture fades to a smudge, then the smudge clears. This is the clean-up's tool with the tooth game's rub as its job; the teacher's model uses exactly this gesture.

| Level | The one new thing | Ask | The board and tray |
|---|---|---|---|
| **L1** | "Rub out" and the noun | "Rub out the car." | Not at L1 (shown once in the model; L1's two jobs are draw and colour) |
| **L2** | **Colour plus noun; the verb decides** | "Rub out the red car." | A red car, a green car, a red bird, a green bird (so colour alone and noun alone each leave two); the duster and the coloured chalks |
| **L3** | **Size** | "Rub out the small house." | A big and a small house, a big and a small bird, one other (second run) |
| **L4** | **Two in one line** | "Rub out the big bird and the green car." | 5 pictures with two lookalike pairs (second run) |

**Leak test:** as B1. Eliminating: the lesson never asks to rub out the last picture; at least two candidates always stay. The verb: a chalk on a rub-out ask: the colour slides off, and the teacher says "Rub it out!". Fishing: tap the duster on the wrong picture and **the picture dodges**: the bird hops aside, the car reverses, the goat ducks. It isn't rubbed, so nothing is lost, and the teacher says its word. Each picture has its own dodge (lessons §5).

**Delight:** the dodge. It's the "kind of funny" moment of the day, and a child may miss on purpose once to see it, which costs only the gold tick.

#### The bots for B (written per level)

A lesson wins when every job is gold (Zafar, 1 Nov: only right-first-time rounds level up). Targets: the random bot wins **under 10% at L1 and under 2% from L2**; the "knows one of the two words" bot under 15% at L2 and under 10% from L3; the "remembers the model" bot no better than random.
- **L1** (draw, colour): B1 1 in 3 (three pictures, the model's never among them) × B2 1 in 4 (two pictures, two chalks) = **about 1 in 12 (8%)**.
- **L2** (three jobs of B1-B4): B1 1 in 4; B2 1 in 3 pictures × 1 in 3 tools = 1 in 9; B3 1 in 4; B4 1 in 3 × 1 in 3 = 1 in 9. Any three: **under 1%**. The one-word bot (knows the noun or the number/colour, not both) is left two candidates per job, so 1 in 2 each and **about 1 in 8 (12%) for three jobs**; it still loses almost nine lessons in ten. Adding a third candidate per word would mean six groups on a phone board, so I accept 12% at L2 and hold the 10% line from L3, where size adds candidates.
- **L3-L4:** lower again; the bot proves it on the second run.

#### The end of the lesson

The bell rings (a sound). **All the lesson's pictures come alive together** for two seconds. The teacher names them in a call-back and says "Well done, my helper." (*shabash* ✓ plus to record), then "Give me your book." The child taps the book on the desk; she presses the drawn picture onto its cover as a sticker; the book hops into the bag. Then the shared two-page end screen (lessons §5).

#### Speaking: the child's turn as teacher (L3 and up)

- **Watched first:** the model (above) plays before every speaking turn, and on each level's first lesson. By L3 the child has heard "Ali, draw the bird" many times.
- **The handover:** at L3, one job per lesson becomes the child's. The teacher hands the child the chalk and steps aside. A picture card in the teacher's hand shows what to ask for (a picture says what). Ali stands at the right of the board.
- **The child says it:** the shared mic (`js/shared/say.js`) with three pills: *chakli*, *bakri*, *gadi*. Ali traces whatever the child said, and it comes alive. If the child says another of the three, Ali draws that one, it comes alive too, and the teacher says the asked word once (a recast, no verdict). One "say it again" after a miss; the pills go live; a parent's ✓ works. It's a play action, never a gate (lessons §8). **Off until the three model lines are recorded.**
- **The ramp:** L3 say it after the teacher's model; L4 words only (the pills without the model).

## 4. The child's first-ever round, screen by screen

The first round is the tutorial (lessons §2). One live thing at a time, in a lit box with a breathing gold glow; everything else is dimmed and can't be tapped. No finger. The wake-up clock has just ended at sunrise.

1. **Nani's front door, morning** (the clock's sky through the door's glass). Nani: "Today it's school." She stands at the right; the open school bag is at her end of the bench; a book, a pencil and a ball stand on the bench and the cubby. **What isn't on the card is shown first:** the ball lights and bounces once, and Nani says its word. The dim clears fully.
2. **The ask.** Nani: "Put the book in the bag." The book's card pops big beside the side panel, then flies into its row. **The book is lit** (the first showing; it never counts against the bulb). The child taps it. It hops in with a thump; Nani: "The book!" The row ticks.
3. **The second ask, unlit.** Nani: "Put the pencil in the bag." The card pops and flies. The showing has stopped, so the light points once at the card row (1.2 s), then nothing glows. The child taps the ball: it boings off the wall and rolls back, and Nani says "ball". The child taps the pencil: it rattles in; "The pencil!" Tick.
4. **The zip.** The bag zips itself shut. Nani: "Book, pencil: *shabash*!" A horn toots outside; the front door opens onto the bus.
5. **The bus** (the built window ride, its own screen). The bag sits on the seat.
6. **The classroom.** The bag is on the desk; the book and the pencil hop out onto it. The teacher at the board: "Good morning! Come, you're my helper today."
7. **The model** (first lesson of L1; a tap skips it). The teacher: "Ali, draw the goat." Ali comes up at the right of the board, traces the goat; it bleats and nods. The teacher picks up the duster, taps the goat and rubs three times; it puffs away. Ali sits at his desk at the right.
8. **The child's job.** The board deals three dotted pictures: a house, a bird and a car. The teacher turns front-facing: "Now you. Draw the bird." The card pops and flies into the first row. **The white chalk is lit:** tap it, and it lifts. **The bird's first dot is lit:** the child drags, and the chalk runs along the dots ("Draw it!"). At the last dot the bird flaps, flies a loop round the board, and lands on the frame with a puff of chalk dust ("A bird!"). Tick. *Shabash*.
9. **Colour it.** The dotted pictures fade; the teacher sweeps a house on beside the bird. "Colour the house red." The card shows the house drawn in red. The red chalk is lit once (the first time this action is shown): tap it; then the house is lit: tap it. The scribble ("Colour it!"), and the house turns red. Tick.
10. **The end.** The bell. The bird and the house come alive together. "Bird, house: well done, my helper. Give me your book." The book is lit; tap it; the bird lands on its cover as a sticker; the book hops into the bag. The shared end screen. That evening the book shows the bird on the cover: "At school I drew a bird."

Total: about three minutes, two plus two asks, two of each shown. Each new word is heard three times: book and pencil (ask, landing, zip), bird (ask, alive, bell), draw and colour (ask, the action, and the model or the hint-free next lesson).

## 5. Later visits and harder versions

- **The ladder:** each game moves up after 3 right-first-time rounds at a level with at most one hint each (Zafar, 1 Nov); never down (rulebook).
- **The second art run (L3-L4):** the lunchboxes, Ali's bag, the pen, separate crayons, the water bottle, the toy car and doll; the sun, ball and fish on the board; yellow, blue and white; once Mum confirms them, apple and banana (with the lunchbox's apple carried to the board).
- **Second visit:** more school things (ruler, rubber, pen, notebook, pencil case, to record); colours to six; numbers to 7 on the board; the child-as-teacher turn.
- **Third visit:** numbers to 10 on the board (*chh, sat, ath, no, do* are drafts in the engine; Mum checks them); shapes if she has the words; the class hand-out (B6) once the party's give-to engine is built ("give the red crayon to the girl").
- **Parked, each its own later design (not in this day's size):** PE day (the sport's bag, so the ball is wanted); break time (the lunchbox opens; fruit only; "lunchbox week" waits with the days of the week, Zafar 31 Oct); the classroom-door greeting (a Conversations moment once Mum records "good morning" and its reply); the stickers page in the evening book; Tidy's bookshelf ("put the book back on the shelf", at home).

## 6. What it reuses and what's new

**Reused:**
- `docs/game-design/modes/pack-the-bag.md` (the design) and Cook's pantry fetch (the tap-it-hops-in mechanic).
- `js/shared/whichone.js` (the decoy rule, lookalike groups, line-up balance) for both games.
- **The `do-it` engine** (`do-it-engine.md`, built for getting ready and the clean-up): its two-tap tool on a thing runs B2 and B4. Board pictures are things; drawn, red, green and gone are their states. The rub (three swipes) is the tooth game's brush (`js/clinic/heal/games/tooth.js`) as one tool job.
- `js/shared/order-card.js`, `word-card.js`, `guide.js`, `focus.js` (the light), `onboard.js`, `request-popup.js`, `tally.js` (the count dots), `bulb.js`, `results.js` (the two-page end), `rules.js` with `data/rules.json` (levels, hints, the ladder), `say.js` and `speech.js` (the child-as-teacher turn), `window-ride.js` (the bus).
- For the trace: the foot game's splinter track (`foot.js`), the cut game's dot-to-dot (`cut.js`), and the knee game's "one dot waits for the tap" for the first-dot light.
- The Tidy school bag, kept for this day (audit §4); its bookshelf parked.
- Simba's art and poses (the cats).

**New to build:**
- `data/school.json`: the things, the board pictures and their states, the lessons, the levels; with the checks "nothing written", "both words decide from L2" and "the model's picture is never the next job's candidate".
- `js/school/bag.js` (a thin reskin of the fetch, with owners, show-and-tell and the count rule).
- Two board modules: `js/school/trace.js` (the dotted track and the mask reveal of the chalk line) and `js/school/ring.js` (tap a group, the ring reveal, the counting along). Written so count-to-a-number can reuse the ring later. Colour and rub are `do-it` data, not code.
- A lab page (`school.html`) with level and lesson pickers.
- Leak bots for both (`leak_school_bag`, `leak_board`), with the "never a toy", "every pencil", "one word only" and "remembers the model" bots.
- Words for Mum's school round (below).

**Mum's school round (the first job).** Speaker in brackets: N Nani, T the teacher, A Ali. Who voices the teacher is settled before shipping (Zafar, 1 Nov); for the prototype, T lines play in any take or the device voice.
- **Words:** school, teacher, book, pencil, crayon, bag, lunchbox, bottle, chalk, board, sticker, ball, teddy, doll; draw, colour, rub out, count, put a ring round; sun, fish, tree, flower; yellow, blue, white; one to five as clips; *ghar* as a clip; "your" and "Ali's"; "show-and-tell" if there's a family way to say it; confirm *safarjan* and *kelo*; and a question: does Kutchi have circle, square, triangle?
- **Lines, A (N):** "School today! Let's pack your bag." / "Today it's school." / "Put the {thing} in the bag." / "Put {n} {things} in the bag." / "Not the {toy}." / "Your {thing}, not Ali's." / "Take your {toy} to school today: it's show-and-tell." (whole frame; no verb guessed) / "Simba! Out you come."
- **Lines, B (T):** "Good morning! Come, you're my helper today." / "Ali, draw the bird / the goat / the car." (the speaking models) / "Now you: draw the {thing}." / "Draw it!" "Colour it!" "Rub it out!" / "Colour the {thing} {colour}." / "Put a ring round the {n} {things}." / "How many?" / counting along ("one, two, three", as one line and as single words) / "that's two!" / "Rub out the {thing}." / "Well done, my helper." / "Give me your book."
- **Greeting (T, and the child's reply):** "good morning" and its answer (for the later Conversations moment).
- **The evening book (N, past tense):** "At school I drew a {bird}." / "I packed my book and my pencil."

## 7. Art and layout

**Cameras (art bible §3):**
- **A, the front door:** E, eye level, straight on to the bench (horizon at about 55%). Things in F view on the bench and the cubby, as the pantry's shelves. Nani at the right, three-quarter, then front-facing on the child's turn. One background (Nani's hallway: limewash wall, a mirror-work frame, the front door at the right edge, a doormat). Day light.
- **B, the classroom:** E, straight on to the blackboard. The board fills the middle-left of the play area, its chalk tray along its bottom edge; the right quarter is the teacher's column (plain wall, the window above). Ali stands at the board's right edge for the model (the teacher steps back) and sits at a desk in the lower-right foreground. Day light through a window at the upper right. **No alphabet posters, number lines, labels or writing anywhere in the room** (non-negotiable 3; the generator adds them by default).
- **The board pictures** are flat chalk drawings on the board, so they share the board's front view. Code only reveals, cross-fades, scales and moves them (lessons §7: draw nothing in code). Groups are copies of one picture placed by the layout; big and small are one picture scaled.

**New art, first run (L1-L2), counted: about 48 pieces in four paste blocks** (decision 77; the `art-run` skill, backgrounds first):
1. **Backgrounds (2):** the hallway bench (day); the classroom with an empty board and a plain right-hand wall (day).
2. **People (6):** the teacher (three-quarter talking, front-facing pointing, pressing a sticker, stepping back: 4); Ali at the board tracing, Ali sitting (2). Nani and Simba exist.
3. **Things in F view (14):** book, pencil, crayon box, ball, teddy, teddy waving (climb-out), the school bag open, zipped and wriggling, Simba's head out of the bag; white, red and green chalk sticks, the duster.
4. **Chalk (26):** bird, goat, car, house, each dotted, drawn, red, green, and two alive poses (the dodge reuses an alive pose) = 24; the chalk ring; the smudge. The sticker is the drawn state on the book cover (no new art).

Second run (L3-L4, §5): about 30 more, listed when L1-L2 plays.

**Layout (the four sizes, Zafar 27 Oct: 740x320, 930x430, 1280x665, 1920x1080):**
- **Phone (740x320):** the side panel on the left with the card rows (about 180 px); nothing else stands on the left.
  - **A:** Nani at the right, cut at the waist (about 120 px), with her bubble beside her head over the plain wall, never over her face. The bench takes the middle (about 440 px): a top tier and the cubby, at most four slots each and **seven in all**, things at least 90 px tall, the bag at the bench's right end by Nani. Height: about 70 px of wall for the bubble, two 90 px tiers, the bench edge and floor.
  - **B:** the board takes the full height above the tray but not the full width: it ends about 130 px from the right edge, leaving the teacher's column. She is cropped to head and shoulders, and **her bubble sits beside her head in that column**, never over the board or a face. At most three pictures in a row; L2's four-picture boards (B1's groups, B4's two cars and two birds) use two rows of two; every picture at least 80 px. Ali walks in at the board's right edge for the model and sits out of frame at the right.
- **Mid (930x430):** as the phone, with more wall above; things grow to 110 px.
- **Big screens (1280x665, 1920x1080):** the classroom shows more room around the board (the window, a plant, the desks' edges); the board and the people grow, the scenery takes the extra space. Same core in the middle; the cog is the only button on the play screen.
- **Before anything is built:** a mock-up of both games at 740x320 and 930x430 (Zafar's, or ChatGPT after talking), then the lab page, then the four-size check (Zafar, 27 Oct). Then every level on film at all four sizes (lessons §13).

## 8. What it borrows

- **Drawing for Kids, bekids Coloring, Kids Coloring & Drawing Games:** the trace-then-it-animates loop ("the tracing-to-animation formula"). We borrow the payoff; the heard word picks what to trace.
- **Crayola Trace and Draw:** connect-the-dots pictures, step by step.
- **Sago Mini School:** light learning in a school setting. We add the natural stopping point its reviewers missed (the bell and the sticker).
- **Toca Life: School:** the classroom as a place to be; we avoid its "weirdly silly" dialogue.
- **Khan Academy Kids:** children love collecting prizes; our stickers (never sweets).
- **Busy Shapes:** calm, unhurried puzzles; no timers on the board.
- **Toca Town:** carry it home (the sticker and the packed things reach the evening book).
- **Monki:** rotate the hiding places; here the pictures' places and the owners.
- **Classroom research:** "give me N" as the number test, turned round into "find the group of N"; counting along. And its warning: exactly as many as asked means "take them all", so the bag's counts always have spares, and the pencils tick at the number so "take them all" cannot over-pack (Zafar, 1 Nov).

Sources: [The Tracing-to-Animation Formula, Screenwise](https://screenwiseapp.com/media/drawing-for-kids-learning-apps-app); [Crayola trace kit, The Globe and Mail](https://www.theglobeandmail.com/technology/crayolas-ipad-tracing-kit-a-draw-for-young-scribblers/article4252627); [bekids Coloring](https://bekids.com/coloring/); [Kids Coloring & Drawing Games](https://spark.mwm.ai/en/apps/kids-coloring-drawing-games/1225122654); the school section of `research-other-games-2026-10-31.md`.

## 9. The lessons checklist

| Group | Verdict |
|---|---|
| 1. The heard word decides | **Passes, once recorded.** Leak tests written per game; both words decide from L2 (a data check, and a one-word bot); counts have spares; the model's picture is never the next candidate; show-and-tell beats "no toys"; the verb picks the tool from L2; tick only the first-go right pick. **Exception:** today nearly every deciding word is unrecorded, so neither game teaches until Mum's school round lands |
| 2. Onboarding and the first round | Passes: the first round is the tutorial (§4); one lit thing; the decoy shown first; each new action shown once (rub-out in the model, with the child's gesture); tap, then tap; tracing is a drag along a track only |
| 3. Instructions | Passes: Nani and the teacher are on screen and speak before the card; the card never changes; the model (Ali) on each level's first lesson and before speaking; listening again is free |
| 4. Pacing and waiting | Passes: no Next, no Done button; no timers; a tap skips the model; counts choose a group (the board) or tick at the number (the bag), and an extra tap doesn't land; the teacher's count never holds the board; hints from 7 s |
| 5. Feedback, progress, the end | Passes: a wriggle, a dodge, a duck or a recount and the word, never a cross; each miss its own joke; ends at the zip and at the sticker; the shared end screen |
| 6. Layout | Passes on paper at the four sizes (§7): bag capped at seven slots; the teacher's bubble in her own column; nobody stands on the card side. To prove with a mock-up and on film |
| 7. Art and camera | Passes: one E camera per scene; chalk is real art revealed by a mask; no text in the room; about 48 pieces in four blocks for the first run, counted |
| 8. Speaking | Passes: only the child-as-teacher turn, watched first; closed set of three confirmed words heard in clips; pills always; reuses `say.js`; off until its model lines are recorded |
| 9. Levels | Passes: each level adds one thing, L4 is its own (lookalikes, two in one line); level up after 3 right-first-time rounds (Zafar, 1 Nov); the Kutchi gets harder, never the gesture |
| 10. Words and recording | Passes as a plan: every line listed with its speaker (§6); 3-5 new words a round, each heard three times in a right-go round |
| 11. Culture | Passes: modest clothes, no religious markers, fruit in the lunchbox, stickers not sweets, no celebrations |
| 12. Fun and delight | Passes: the drawing comes alive, the dodge, Simba in the bag, the bouncing count; no two jobs in a row share an action |
| 13. Mistakes made twice | Guarded: one day order (the clock's); no new engine where `do-it` fits; art counted; no question left to the builder (§10); no mechanic of Zafar's removed (toys stay as decoys); the "no letters" and "both words" rules are data checks |

**The ten questions, short:**
1. A: the school nouns, owners, numbers (0 recorded). B: draw, colour, rub out, count (0), red (✓), green, 1-5, four nouns (in engine, three heard in clips).
2. The Sceptic leaves the toys (show-and-tell beats it), packs every pencil (spares), picks by picture (blurred from L3, lookalikes), picks "not Ali's one" (the model's picture is gone), picks the last one (never only one left), taps everything (only first go ticks).
3. Two of everything from L2: pencil counts with spares, two books, two cars and two red things, one and two of two pictures, groups of two kinds.
4. The ball (the decoy), then the book; then the chalk and the bird's first dot; then the red chalk and the house.
5. Nani at her door; the teacher at the board; both in recorded sentences built by the engine.
6. A: tap. B: trace, tap-then-tap (`do-it`), tap a group, tap-tap-rub.
7. The duster dodge; Simba in the bag; the bird knocking chalk dust off the frame.
8. A: the zip, the call-back and the bus horn. B: the bell, everything alive, the sticker on the book.
9. Per game in §3; L4 brings lookalikes and two in one line.
10. Planned for the four sizes in two E cameras; to prove with a mock-up and on film.

## 10. Decisions made for Zafar overnight

Each is the choice, the reason, and the answer I assumed.

1. **This file designs the bag, the board and the helper job; the clock and getting ready are designed apart; the bus is the built window ride.** Keeps one design per engine. *Assumed: yes.*
2. **Nani asks for the bag at her front door, not the teacher.** The asker must be on screen, and the bag is packed at home. The teacher hosts the day from the classroom on. *Assumed: yes.*
3. **Toys stay as decoys (yours), plus a show-and-tell day (one round in four from L3) when one toy is wanted.** Otherwise "never pack a toy" wins without Kutchi. *Assumed: yes; it keeps your idea and closes its leak.*
4. **The bag packs 2 at L1 (not the rule's 1) and 4 at L4 (not 5), with at most seven slots at any size.** One thing isn't a round; seven is what the phone holds. *Assumed: yes.*
5. **The board's first pictures are bird, goat, car and house,** all confirmed in the engine, three of them heard in clips. Apple and banana wait for Mum to confirm them; sun, fish and tree come in the second run. *Assumed: yes.*
6. **Shapes only at B1's L4, and only if Mum has the words;** until then "round" things (sun, ball) stand in. You left shapes for now on 31 Oct. *Assumed: yes; ask Mum in her school round.*
7. **Nothing written anywhere in the school:** no letters, words or digits on the board, books, posters or walls. A data check. *Assumed: yes (non-negotiable 3).*
8. **Counting chooses a group ("ring the three birds"), never "draw three"; the bag's count ticks at the number and an extra tap doesn't land (Zafar, 1 Nov, after the chai play).** *Assumed: yes.*
9. **Tracing is the one drag, along the dotted track only.** Lessons §2. *Assumed: yes.*
10. **Rub it out is tap the duster, tap the picture, three rubs; a wrong picture dodges.** No loss, a joke, and the word. *Assumed: yes.*
11. **Chalk lines are real art revealed by a mask; every picture has its states drawn.** Code draws nothing. *Assumed: yes.*
12. **The teacher's helper is the child's job:** called to the board, and from L3 taking the teacher's turn with Ali (speaking). This is how I read "the teacher as a helper job". *Assumed: yes.*
13. **The child-as-teacher closed set is bird, goat, car** (*chakli, bakri, gadi*), house (*ghar*) the spare once recorded; the turn is off until the teacher's three model lines are recorded. Three confirmed words, already heard in clips, that sound different (replaces the first draft's house, bird, apple: *safarjan* is a draft and neither it nor *ghar* has a clip). *Assumed: yes.*
14. **The reward is a sticker of the picture drawn,** the picture's own drawn state on the book's cover. Never sweets. *Assumed: yes.*
15. **A lesson is 2 jobs at L1 (draw, colour) and 3 from L2, never the same action twice running.** *Assumed: yes.*
16. **No timers anywhere in the bag or on the board.** The clock is the day's only time pressure. *Assumed: yes.*
17. **Ali goes to the same school;** his bag gives the owners, he models at the board. *Assumed: yes.*
18. **Simba in the bag, one round in three from L2.** A recurring joke at home before school. *Assumed: yes.*
19. **The lunchbox holds fruit only;** its "week" stays parked with the days of the week. *Assumed: yes (your 31 Oct answer).*
20. **From L2, both deciding words are needed for every ask except the bag's count rows** (dropping either leaves at least two candidates), as a data check and a one-word bot. For the bag's counts the number no longer decides (1 Nov: it ticks at the number), so the noun carries the row. Covers loanword nouns and keeps the nouns teaching. *Assumed: yes.*
21. **Parked, not dropped:** the class hand-out (B6, needs give-to) and what's gone? (B7). *Assumed: yes.*
22. **The prototype doesn't wait for Mum's school round:** it plays on existing takes and the device voice (Zafar, 1 Nov); the leak bot is run on recorded words only.
23. **The day's order is the wake-up clock's:** clock (the night before, to sunrise), the door with its sky, getting ready, the bag, the bus, the board, home, the book. Door-then-clock ran time backwards. `do-it-engine.md` §2B now has the same order (fixed in the consistency pass, 1 Nov). *Assumed: yes.*
24. **The model never hands over the answer:** Ali's picture is rubbed out and the board re-dealt, so it is never the child's next candidate. The model plays on each level's first lesson and before each speaking turn; otherwise a tap skips it. Its rub uses the child's gesture. *Assumed: yes.*
25. **The bag's counts always have spares** (three or four pencils for "two"); the count ticks at the number, an extra pencil doesn't land, and by Zafar's choice (1 Nov) the count can be won by tapping until it ticks. *Assumed: yes.*
26. **Tidy's bookshelf is parked** (a later "put the book back on the shelf" at home); Tidy's school bag is this day's. *Assumed: yes.*
27. **The school bag is the day's "pack the bag" stage** (the glue's bag for every trip, here as the school bag). *Assumed: yes.*
28. **The first build is L1-L2 of both games, about 48 art pieces in four paste blocks** (backgrounds, people, things, chalk); L3-L4 art is a second run. The stickers page in the evening book, PE day, break time and the classroom greeting are parked as later designs. *Assumed: yes; it keeps the day medium.*
29. **Colour and rub-out run on the `do-it` engine's two-tap tool;** only trace-and-reveal and ring-the-group are new code. No new board engine. *Assumed: yes.*
30. **From L2 the verb decides:** colour and rub-out jobs offer the chalks and the duster together; the wrong tool gets its own reaction and the verb said. *Assumed: yes.*
31. **"Take your teddy to school" goes to Mum as a whole frame;** no Kutchi verb is guessed for it. *Assumed: yes.*
32. **The four check sizes are yours of 27 Oct** (740x320, 930x430, 1280x665, 1920x1080); the first draft's 915x275 is dropped. *Assumed: yes.*

**Open questions that are genuinely his:** Zafar said the school day is fine (1 Nov), so the teacher (a generic young woman, any voice for now; voices are settled before shipping) and show-and-tell stand as designed. Left for Mum:
1. **Does the family say the school nouns in Kutchi or as English loanwords?** That's Mum's answer, but it changes how much the nouns can carry (decision 20).

## 11. ChatGPT mock-up prompts

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

Four screens, one moment each: the bag (L2), then three board jobs at the level they show. The teddy's climb-out and Simba in the bag get their own small prompts later, so they never share a frame with a right pick. The teacher has no family reference: she is a generic young woman, and her face is Zafar's call. Nani's identity reference is the locked s08 sheet.

### Prompt school-day-1: Pack the school bag at Nani's door (L2)

Shows the opening game at L2: the bench, the open bag, school things with spare pencils, a toy, and one right pick hopping in. It explains that the child taps what Nani names, and that there are more pencils than asked.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: the inside of a grandmother's front door in a warm modern home, morning. Eye-level camera, looking straight at a low pale-oak bench against a limewash cream wall; the horizon about halfway up. The front door is at the right edge, slightly open, bright sunlight outside. A mirror-work frame on the wall (the only decoration). A woven doormat on the floor.

On the bench, at its right end: an open children's school bag (navy, chunky, the flap up). Along the rest of the bench and on a cubby shelf under it, well spaced in four clear spots: a hardback picture book; three yellow pencils standing upright side by side, a finger's width apart; a small box of chunky crayons; and a soft brown teddy bear sitting on the cubby shelf.

The moment: one yellow pencil is mid-hop, arcing from the group into the open bag. Nothing else moves.

At the right, standing beside the bag and cut at the waist: the grandmother from the attached sheet, matching her face, glasses and clothes exactly (a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta), slim, kind face, smiling, one hand gesturing towards the bag. Nobody else.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft contact shadows, chunky simplified shapes, clean surfaces, believable materials, big expressive eyes. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters, numbers, logos or writing anywhere: not on the book cover, the bag, the pencils, the crayon box or the walls.

Must read at phone size (the whole image shown about 740 pixels wide): every item clearly separate and at least an eighth of the image's height; the three pencils easy to count at a glance; plain wall beside and above the grandmother's head, with room there for a speech bubble.

Landscape, 16:9.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt school-day-2: The blackboard, draw it (L1: the drawing comes alive)

Shows the heart of the board game at L1: three dotted pictures, one traced by the child's chalk, and the reward of it coming alive. It explains that the child picks which picture to trace from what the teacher says.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: a bright, calm primary-school classroom, eye-level camera looking straight at a big dark-green blackboard that fills the left three-quarters of the frame. A wooden chalk tray runs along the bottom of the board, holding one stick of white chalk. The right quarter of the frame is plain warm cream wall, with a tall window at the upper right letting in warm morning sunlight. There are NO posters, NO alphabet, NO number lines, NO labels and NO writing anywhere in the room.

On the board, three simple chalk pictures in a child-friendly style, well spaced in a row: a faint dotted outline of a house, a faint dotted outline of a toy car, and a bird that has just been drawn in solid white chalk. A stick of white chalk floats at the end of the bird's outline, as if just lifted. The moment: the freshly drawn chalk bird has come alive: it is flapping its chalk wings and flying a little loop near the top of the board, leaving a tiny puff of chalk dust behind it. It looks delighted.

In the plain wall area at the right, standing beside the board: a young woman teacher, a generic character and not anyone real, in a long sage-green kurta, loose trousers and a soft cardigan, a plain dupatta over her shoulders, modest, warm and encouraging, three-quarter view, one hand open towards the board, smiling at the flying bird.

Style: match the references. A stylised 3D animated-feature look for the room and the teacher, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. The chalk drawings are soft chalky white lines on the board, simple and charming, with a gentle chalk-dust texture.

Absolutely no text, letters, numbers or writing anywhere: the board has only the chalk pictures, never letters, numbers or words.

Must read at phone size (about 740 pixels wide): each chalk picture large and separate, at least a quarter of the board's height; the dotted outlines clearly dotted; the teacher's face clear against the plain wall, with plain wall beside her head for a speech bubble.

Landscape, 16:9.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
```

### Prompt school-day-3: The blackboard, count them (L1: ring the three birds)

Shows how numbers work without any digits: groups of chalk birds, the chosen group ringed, and the birds bouncing as the teacher counts. It explains that the number heard picks the group.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: the same calm classroom, eye-level camera straight on to a big dark-green blackboard filling the left three-quarters of the frame, a wooden chalk tray along its bottom with sticks of white, red and green chalk and a felt duster. The right quarter is plain cream wall with a tall window at the upper right and warm morning sunlight. NO posters, NO alphabet, NO number lines and NO writing anywhere.

On the board: three short horizontal chalk lines like little wires, well spaced in a row, with simple white chalk birds sitting on them. The left wire has two birds, the middle wire has three birds, the right wire has one bird. All the birds are the same simple shape. The moment: a loose hand-drawn white chalk ring has just been drawn around the middle wire's three birds, and the three birds inside the ring are bouncing up one after another, happily, as they are counted. A tiny sparkle of chalk dust where the ring closed.

In the plain wall area at the right, beside the board: a young woman teacher, a generic character and not anyone real, in a long sage-green kurta, loose trousers, a soft cardigan and a plain dupatta over her shoulders, modest, front-facing now, pointing gently at the bouncing birds, mouth open mid-word as if counting aloud, delighted.

Style: match the references. A stylised 3D animated-feature look for the room and the teacher, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. The board pictures are soft, charming chalk drawings with a light chalk texture.

Absolutely no text, letters, numbers or digits anywhere, including on the board: the counting is shown only by the birds themselves.

Must read at phone size (about 740 pixels wide): each bird a clear separate shape; the groups of one, two and three easy to tell apart at a glance; the chalk ring obvious; plain wall beside the teacher's head for a speech bubble.

Landscape, 16:9.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
```

### Prompt school-day-4: The blackboard, rub it out (L2: the wrong one dodges)

Shows the funniest moment and the coloured pictures at L2: a red car, a green car and a red bird, the duster on the wrong car and the car reversing out of its way. It explains that misses are jokes, never verdicts, and shows the colour job's result.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: the same calm classroom, eye-level camera straight on to a big dark-green blackboard filling the left three-quarters of the frame, a wooden chalk tray along its bottom with a red chalk, a green chalk and a felt duster. The right quarter is plain cream wall with a tall window at the upper right and warm morning sunlight. NO posters, NO alphabet, NO number lines and NO writing anywhere.

On the board, three simple chalk drawings filled in with chalk colour, well spaced in a row: a red toy car, a green toy car of exactly the same shape, and a red bird. The moment: a grey felt duster has just come down on the green car, and the green car is reversing out of the way in a comic hurry, with little chalk speed lines and wide startled headlights, so the duster wipes only empty board. A puff of chalk dust. The red car and the red bird look on, amused.

In the plain wall area at the right, beside the board: a young woman teacher, a generic character and not anyone real, in a long sage-green kurta, loose trousers, a soft cardigan and a plain dupatta over her shoulders, modest, laughing with a hand to her cheek. Nobody else.

Style: match the references. A stylised 3D animated-feature look for the room and the teacher, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism. The chalk pictures are soft, charming, lightly textured chalk.

Absolutely no text, letters, numbers or writing anywhere, on the board or in the room.

Must read at phone size (about 740 pixels wide): the two cars clearly the same shape but different colours; the red bird clearly a bird; the car's dodge readable at a glance; the teacher's face clear against plain wall, with room beside her head for a speech bubble.

Landscape, 16:9.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
```

## 12. Changes after the critique

Each finding (`school-day-critique.md`), then what I did.

1. **MUST, the day runs backwards.** Took the wake-up clock's order (clock, door with its sky, getting ready, bag, bus, board, home, book) in §0, §2 and §4 step 1. I can't edit `do-it-engine.md` tonight, so its door-first §2B is flagged in decision 23 for a one-line fix.
2. **MUST, the model leaks by elimination.** Took the critique's option (b), strengthened: Ali's picture is rubbed out (gone, not back to dots) and the board is re-dealt, so the model's picture is never the child's next candidate. Written in B's "The model", B1's leak test, the data checks (§6) and a "remembers the model" bot. L1 now deals three pictures. Decision 24.
3. **MUST, the bag's count has no decoys.** Every count ask has spares (three or four pencils for "two"), counted as same-kind decoys; too few holds the next tap, too many hops back out, both with the number said again, neither gold; dots on the card via `tally.js`; count rows get their own bot line. Decision 25. *Superseded later on 1 Nov, after the chai play: the count ticks at the number and an extra pencil doesn't land; there is no too-few or too-many miss.*
4. **MUST, scope.** The first build is L1-L2 of both games: four board pictures (bird, goat, car, house rather than the critique's apple, because finding 9 moves the speaking set off *safarjan*, a draft with no clip), red and green, the bag's L1-L2 things. Art counted at about 48 pieces in four paste blocks (backgrounds, people, things, chalk); the sticker is the drawn state on the book cover; the stickers page, PE day, break time and the greeting are parked. Decision 28.
5. **MUST, colour and rub-out re-specified as a new engine.** B2 and B4 are now the `do-it` two-tap tool with board pictures as things; only trace-and-reveal and ring-the-group are new modules. "New engine" removed from §0, §2 and §6; B2's novelty 3 to 2, B4's 4 to 3. There is no shared "pick the group" yet, so the ring is new code written for count-to-a-number to reuse. Decision 29.
6. **MUST, the phone layout breaks.** The board no longer takes the full width: the teacher has her own right-hand column and her bubble sits beside her head. The bag holds at most seven slots at any size (L4: four asks, three decoys), with the height worked out at 740x320. Ali models from the board's right edge and sits at the right. 915x275 is dropped for Zafar's four sizes of 27 Oct (CLAUDE.md wins over the critique's 275 px case), and a mock-up at both small sizes comes before any build. Decisions 4 and 32.
7. **SHOULD, "two words per move" not true.** Applied, and made a data check: from L2, dropping either deciding word must leave two candidates. B1 L2 is one and two birds, one and two cars; B4 L2 is a red car, a green car, a red bird and a green bird; L3 sizes are big and small of two things. A one-word bot is added: it loses about 88% of L2 lessons (two candidates per job) and must win under 10% from L3; a third candidate per word at L2 would crowd the phone board.
8. **SHOULD, the verb is never tested.** Applied: from L2 colour and rub-out jobs offer the chalks and the duster together; the wrong tool has its own reaction and the verb said; the card's colour sits inside the picture and every card is a speaker past support. Draw is honestly not verb-decided (a dotted picture can only be drawn). Decision 30.
9. **SHOULD, Kutchi assumed.** Applied: "take X to school" is a whole frame for Mum, no verb guessed (decision 31). The speaking set is *chakli, bakri, gadi*, each heard in clips I checked in `clips.json`, *ghar* the spare once recorded; the teacher's three model lines are on Mum's list and the turn stays off until they're recorded (decision 13).
10. **SHOULD, the model every lesson and the wrong rub gesture.** Applied: the model plays on each level's first lesson and before each speaking turn, a tap skips it, and the teacher's rub uses the child's tap, tap, three rubs. The next job may start while she counts.
11. **SHOULD, new words heard once.** Applied: the word as the thing lands or comes alive, and a call-back at the zip and at the bell, so each new word comes three times in a right-go round (§1 frames, §3, §4).
12. **SHOULD, B has no bot numbers.** Applied: B's bot targets and odds per level (L1 about 1 in 12; L2 under 1%; the one-word and model-memory bots). L1 is three pictures for B1 and two pictures with two chalks for B2 rather than three chalks: only red and green have Kutchi, and two pictures give the same 1 in 4.
13. **SHOULD, the prompts.** Applied: one moment per prompt (the pencil's hop only; the teddy and Simba later, on their own); boards at the level shown (three pictures at L1; birds on wires, no banana on an apple tree; L2's red car, green car, red bird); Nani from `sources/art/s08/sheet-nani-final-1.png`; no Nani reference for the teacher, called a generic character, her face Zafar's call; the board leaves the right quarter as plain wall for the teacher and her bubble, matching §7.
14. **SHOULD, things dropped or claimed without a line.** Applied: Tidy's bookshelf parked (decision 26); the school bag named as the day's bag stage (decision 27); the "draw and count are on the top-40 list" claim corrected in §1 (checked: neither is in Part 3).
15. **SHOULD, lines missing from Mum's list.** Applied: §6 now lists every heard line, with its speaker (Nani, the teacher), including the book's past-tense lines, the greeting and reply, "come, you're my helper", "Simba! Out you come" and counting along, and says nothing of the teacher's records until open question 1 is answered.

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **"School: fine."** Open questions 1 (the teacher's voice and look) and 3 (show-and-tell) are closed as designed; only Mum's loanword question remains.
- **Voices:** the prototype no longer waits for Mum's school round (decision 22).
- **Level up only on right-first-time rounds:** both bots now need every row gold (§3), and §9's levels row says so.
- **Clothes:** the prompt sheet's line is added before the prompts (the teacher in modern smart-casual, the children modern casual).
- Counts tick at the number (his reversal after the chai play).
