# Critique: the school day design (`school-day.md`), 1 Nov 2026

Independent critic, flaws first. Checked against the lessons checklist, the design method, the two research reports, the audit, the master map and Zafar's answers, the settings map, CLAUDE.md, the rulebook, `speaking.md`, `guide-and-card.md`, the art bible, the sibling designs of the same night (`wake-up-clock.md`, `do-it-engine.md`, `clean-up-day.md`, `farm-eggs-orchard.md`), `pack-the-bag.md`, `window-ride.md`, the lexicon and the clips. Nothing edited but this file.

## Findings, most serious first

### 1. MUST: the day runs backwards, and three designs of the same night disagree on its order
- **Place:** §0 ("Door, wake-up clock, getting ready, A, the bus, B"), §2 table rows 1-2, §4 step 1.
- **Problem:** this file puts the door first and the clock second. The clock design (`wake-up-clock.md` §2) puts the clock first (it starts the night before and ends at sunrise) and hands its morning sky to the door, with a reason ("why the clock opens the day"). `do-it-engine.md` §2B copies this file's order. The master map's Part 7 row, which Zafar said yes to, lists "the wake-up clock, getting ready, pack the school bag, the bus, the blackboard" and the glue line says every day is "the door, the bag, the ride". So a builder of the school day has two orders and no decision. Door-then-clock also makes no sense in time: Nani says "today it's school" in the morning, then everyone goes to bed.
- **Evidence:** `wake-up-clock.md` §2 rows 1-2; master map Part 7; lessons §13 ("design questions left open for the builder").
- **Change:** take the clock design's order (clock, then the door with the clock's sky, then getting ready, the bag, the bus, the board, home, the book), fix §0, §2 and §4, and tell the do-it design. If the author disagrees, it goes to Zafar as a numbered decision, not as two different tables.

### 2. MUST: the model leaks the answer by elimination
- **Place:** §3 B "The lesson" ("The lesson always starts with the model: the teacher asks Ali, Ali comes up and does it, and the teacher wipes it back to dots"), B1 L1 ("2 dotted pictures"), §4 steps 7-8.
- **Problem:** at L1 the board has two dotted pictures. Ali draws the house; she wipes it; she asks the child to "draw the bird". The child saw which one Ali did, so "the other one" wins with no Kutchi, 100% of the time. The leak test says "every job has at least two undrawn candidates", but a wiped picture is only undrawn on the board, not in the child's memory. At L2 (3 pictures) the model cuts the blind odds from 1 in 3 to 1 in 2, at every level the model is on. The Sceptic's answer to "draw the ___" is always "not the one Ali just did".
- **Evidence:** the design's own L1 table and §4; non-negotiable 4 (no winning by eliminating); lessons §1.
- **Change:** the model must not be one of the child's candidates. Either (a) Ali's model is on a different job from the child's first job (he colours or rubs out; the child draws), or (b) the model's picture is wiped **and** the board is re-dealt before the ask (new pictures, new places), or (c) at L1 only, the child is asked the same picture Ali drew ("now you: the house"), which is "model it, then ask" in its pure form and teaches by imitation, with the noun deciding from L2 among three. Write the rule in the leak test and have the bot play with memory of the model.

### 3. MUST: the bag's count has no decoys, so the number never decides
- **Place:** §3 A ladder L2 ("Put two pencils in the bag." "3 asked (one is a count), 2 decoys: an unasked school thing (crayons) and a toy"), L4 ("Two pencils and the red crayon").
- **Problem:** the bench holds how many pencils? The design never says, and the decoy count (one school thing, one toy) leaves no room for a third pencil. If there are exactly two pencils, "put two pencils in" is "put the pencils in": the noun wins and the number teaches nothing. The research is blunt about this ("exactly three mangoes on the tree means pick them all"). The design also never says what happens when the child packs three: the row "ticks when the child taps the next thing", so over-packing closes the row, with no word on whether it ticks gold.
- **Evidence:** research-other-games §8 ("where it leaks"); `count-to-a-number.md` and the orchard design (extras handed back with the number said again); lessons §1 ("from L2, two words per move").
- **Change:** at every count ask, more of that thing than asked (three or four pencils for "two"), counted in the decoy budget as the rulebook's "decoy of the same kind"; on over-packing, the extra hops back out with the number said again and the row redoes on the spot; the tally is dots, never digits (`tally.js`). Give the count rows their own bot line.

### 4. MUST: scope: the art is far past "medium", and in one paste block
- **Place:** §0 size, §7 "New art", §3 B4-B1 (each picture's states), §2 ("stickers collect across visits (a page in the book)"), §5.
- **Problem:** count it. Ten chalk pictures on the first visit (house, bird, car, fish, goat, sun, ball, tree, apple, banana), each dotted, drawn, coloured in up to five colours and two or three alive poses: about 90 chalk states, plus a ring, a smudge, ten stickers, about 20 F-view things (two books, two lunchboxes, four bag states, pen, pencil, crayons, bottle, four toys, chalks, duster), the teacher in four poses, Ali in two, two backgrounds. About 130 pieces for a day the master map lists thirteenth of sixteen in the design order and sizes "medium: pack the bag plus do-it plus a small new blackboard engine". Decision 77 runs are one supervised paste block each; this is not one run. On top, a stickers page in the evening book is new book work (a new page template in `story-by-the-fire.md` §3), and PE day, break time and a Conversations greeting are listed as later visits.
- **Evidence:** master map Part 5 row 13 and Part 4; research sizes table ("School day: medium"); the safari critique's finding 5 (the same fault, caught the same night); `art-run` skill (one block, backgrounds first).
- **Change:** first visit: four board pictures (house, bird, car, apple: the speaking set plus one), two colours (red, green: the two the family has), the alive pose as one loop each; the bag's L1-L2 things only; the sticker as the picture's own drawn state on the book cover (no new art, no book page). Split the run: backgrounds, then people, then things, then chalk. Count the sprites in the design, as the safari critique asked.

### 5. MUST: B's colour-it and rub-it-out are the do-it engine's two-tap tool, designed again as a new engine
- **Place:** §0 engines ("a small new board engine"), §6 "New to build" (`board.js` plus four modules), B2 and B4 steps.
- **Problem:** B2 is tap a tool (the chalk), tap a thing; B4 is tap a tool (the duster), tap a thing, then a gesture. `clean-up-day.md` §0 specifies exactly that as "the two-tap tool" on the shared `do-it` engine (a thing is an actor whose actions are its states; the broom sweeps, the cloth wipes), and `do-it-engine.md` is the night's own shared engine for "the heard verb picks the action on a thing". A coloured picture and a rubbed-out picture are states of a board thing. The design counts B as "a small new engine", which is the audit's §5 fault (one job built many times on separate engines) repeated at the design stage, and the same fault the safari critique found in its B. The genuinely new pieces are two: the trace-and-reveal (B1) and the ring (B3).
- **Evidence:** `clean-up-day.md` §0 (engine and size), `do-it-engine.md` §0, audit §5, master map Part 4 ("most new games are skins of six engines").
- **Change:** declare B2 and B4 as the do-it engine's tool-on-thing with the board's art, and B1 and B3 as the two new modules (the trace borrowing the foot's track and the cut game's dot-to-dot stitch; the ring as the shared count's "pick the group"). Cut the "new engine" claim and the novelty scores to match.

### 6. MUST: the phone layout contradicts itself and doesn't fit its own numbers
- **Place:** §7 "Layout" (phone), §3 A L4 (4 decoys, 5 packed), §7 cameras ("Ali appears at the left of the board for the model").
- **Problem:** three things.
  - "The board takes the full height above the tray" and "bubbles go into free space above the board" cannot both be true at 275 px: there is no space above a full-height board. The teacher's bubble has nowhere to go but over the board or her face.
  - A at L4 is nine things on a bench and a cubby at "at least 90 px". At 740x320 the play area minus the side panel (about 180 px) and Nani (about 120 px) is about 440 px wide: five things at 90 px is 450 px per tier, before any gap, and two tiers of 90 px plus the bench top and the bag fill the 320 px height with no room for a bubble. The pantry's shelf holds six at L4 (rulebook §2) and Zafar already found the pantry hard to read (PAN-19 to PAN-22).
  - Ali stands at the left of the board for the model, which is the side panel's side ("keep the left for the cards: two people stand in the middle and on the right"). On a phone he is under the card rows.
- **Evidence:** lessons §6; rulebook §2 (the pantry's most); Zafar, 27 Oct (a mock-up and the four-size check before a game).
- **Change:** cap the bag at seven things on phones (L4: 4 packed, 3 decoys, written as the game's override) or drop L4 to the rule's own count; put the teacher's bubble beside her head in the right margin, with the board narrowed to leave it; Ali models from the right of the board, in front of the teacher's spot (she steps back), and sits at the right. Then mock both phone sizes before anything is built.

### 7. SHOULD: "two words per move from L2" is claimed but not true in two board jobs
- **Place:** §1 ("from L2 every move has two words"), B1 L2 ("Draw the two fish": one fish, two fish, a house), B4 L2 ("Rub out the red car": a red car, a green car, one other).
- **Problem:** in B1 L2 the group of two is the only group of two, so "two" alone picks it; the noun is free. In B4 L2 the red car is the only red thing, so "red" alone picks; the noun is free. The loanword defence in §1 (a noun that sounds English decides nothing, so the Kutchi number or colour must also be needed) is fine, but the reverse must hold too: the Kutchi noun must be needed, or B teaches numbers and colours and no nouns, which is the audit's imbalance (numbers over-served, flaw 4).
- **Evidence:** lessons §1; B3 L2 does it right (apples and bananas, groups of 2 and 3 each).
- **Change:** B1 L2: two groups of each thing (one fish, two fish, one bird, two birds); B4 L2: a red car, a green car, a red bird; and the bot must know one of the two words and still lose.

### 8. SHOULD: the verb is in the tray but never in the leak test
- **Place:** §3 B "Tools" (the white chalk, the coloured chalks and the duster are all in the tray at once), B2 and B4 leak tests.
- **Problem:** with every tool live, "colour the car" against "rub out the car" is a real verb decision, which is the thing the lessons say we most need (teach your own words, not just numbers; verbs decide in only 30 of 40). But the leak tests list the noun, the colour and the number only, and the design never says what happens when the child picks the duster on a "colour" ask (the only wrong-tool case written is a wrong chalk). A child who reads the card could also tell colour from rub-out by whether a swatch shows.
- **Evidence:** lessons §1 (AUD flaw 4); do-it-engine's rule that the verb must decide.
- **Change:** name draw, colour and rub out as deciding words in each job's leak test from L2; specify the wrong-tool reaction (the duster on a "colour" ask: the picture ducks and the teacher says the verb); the swatch sits inside the card's picture, not as a separate mark, so the card's shape doesn't name the job.

### 9. SHOULD: Kutchi assumed where the engine can't say it, and a draft word chosen for speaking
- **Place:** §1 word table ("take *khan*", used for "Take your teddy today"); "Frames said" (*ghar*, *chakli*, *safarjan*); §10 decision 13.
- **Problem:** *khan* is "take" as in "take the big one" (lexicon: *wadho khan*). "Take your teddy to school" may be another verb in Kutchi (carry, bring along); writing the frame on *khan* is the gap non-negotiable 2 says to report, not assume. The speaking set uses *safarjan*, a draft entry Mum has never confirmed, with no clip at all; *ghar* has no clip either. Speaking rung 1 repeats after a recorded model, so a set with two unrecorded words has no model to repeat. The design's own spare, *gadi*, "shares a first sound with *ghar*".
- **Evidence:** `data/lang/lexicon.json` v.take, n.apple (draft), n.house; `data/lang/clips.json` (safarjan 0, ghar 0, chakli 1, bakri 5, gadi 1); `speaking.md` ("the model line is a clip that's already recorded").
- **Change:** list "take X to school" as a frame for Mum with no verb guessed; make the speaking set three confirmed words that sound different and have been heard in clips (*chakli*, *bakri*, *gadi*), with *ghar* as the spare once recorded, and say which recorded line is the model for each.

### 10. SHOULD: the model every lesson is ten seconds of watching, and it teaches the wrong rub gesture
- **Place:** §3 B "The lesson" (every lesson opens with Ali's model and her one-swipe wipe), B3 steps (the teacher counts aloud after the ring), §4 step 7.
- **Problem:** at every level and every visit the lesson opens with Ali walking up, tracing, the picture coming alive for two seconds, him sitting and her wiping: about ten seconds before the child's hands do anything, on a day that already had the clock, getting ready, the bag and the bus. The lessons say the hands have something to do at every step and that a tap skips. The speaking rule needs the exchange watched many times, but only before the speaking turn (L3). Her wipe is "one swipe of the duster", while the child's rub is tap the duster, tap the picture, rub three times: the first thing a child copies is her single swipe, which does nothing.
- **Evidence:** lessons §4 (a tap skips the order; never make them wait), §12 (the hands have something to do), §2 (show each new action once).
- **Change:** the model plays once per level (the first round) and before every speaking turn; otherwise a tap skips it. Her wipe uses the child's gesture (tap, tap, three rubs), which is the one showing of rub-out. The next job may land on the tick while she counts; her count never holds the board.

### 11. SHOULD: new words heard once
- **Place:** §1 ("each heard at least 3 times"), §4 steps 2-3, A L1 frames.
- **Problem:** "Put the book in the bag": book is heard once, in the ask. The hint comes only after seven seconds of nothing, and a right first go never triggers it. The same for pencil, and for draw and colour in B. The safari critique found the same.
- **Evidence:** lessons §10 (3-5 new words a round, each heard at least three times); the pantry's chef call-back (guide-and-card T4: "chai, atto, dudh", then *shabash*).
- **Change:** write the frames so the word comes three times in a right-go round: the ask, the word as it hops in ("the book!"), and Nani's call-back at the zip; the teacher the same at the bell.

### 12. SHOULD: B has no bot numbers, and L1's blind odds are high
- **Place:** §3 A "The bot" (A has a target), B (none); §6 ("leak bots for both").
- **Problem:** A writes its target (under 10% from L2); B writes nothing. Working it out: B L1 is two jobs, B1 at 1 in 2 (1 in 1 with finding 2) and B2 at 1 in 2 (one picture, two chalks), so a random tapper wins B's first lesson 25-50% of the time. L2 with three jobs is about 2-3%, fine. L1 is supported, but 50% is the dastarkhwan's number, not a game's.
- **Evidence:** lessons §1 (write the leak test; the bot under 10%); the method §4.
- **Change:** write B's bot line per level; at L1 give B2 three chalks and B1 three pictures with the model on another job, which brings L1 to about 1 in 9.

### 13. SHOULD: the ChatGPT prompts muddle moments and attach the wrong Nani
- **Place:** §11 prompts 1-4.
- **Problem:** prompt 1 asks for three moments in one frame: a pencil mid-hop (a right tap), the teddy climbing out (a wrong tap) and Simba peeking (the one-in-three joke, L2 only). A builder copies the mock-up, and the design's own rule is that a wrong toy hops out before the next ask, so the pencil and the teddy never move together. Prompt 2 shows three pictures when L1 has two. Prompt 3 hangs a banana bunch from an apple tree, which is the lookalike muddle B3 L2 avoids. Prompts 1, 2 and 4 attach `sources/cook/nani-sheet.webp`, which the art bible lists as "not for Nani's identity" (the locked sheet is `sources/art/s08/sheet-nani-final-1.png`), and prompts 2 and 4 attach it for a scene with no Nani in it, so the teacher may land with Nani's face, which §10 says to avoid. No text is asked for anywhere, and no real person is named: good.
- **Evidence:** art bible §1 (the real people, locked; the reference table); the safari critique finding 12.
- **Change:** one moment per prompt (the pencil's hop; the teddy's climb-out as its own small prompt later); the boards as the level they show; the apple trees as apple trees; Nani from the locked s08 sheet, and no Nani reference for the teacher ("a generic young woman, not a family likeness", with a note that her face is Zafar's call).

### 14. SHOULD: things dropped or claimed without a numbered line
- **Place:** §0 status ("Tidy's 'bookshelf and school bag' kept for this day"), §2 (the generic trip bag), §1 ("draw and count are on the top-40 list's school side"), §10.
- **Problem:** the audit's §4 keeps Tidy's **bookshelf** and school bag for this day; the bookshelf is nowhere in the design and not parked by number. The glue's generic "pack the bag" stage for every trip is folded into the school bag without saying so. "Draw and count are on the top-40 list" is not true (master map Part 3 has neither). Non-negotiable 1 and §10's own promise ("every choice he hasn't made") mean each goes in as a line he can reverse.
- **Evidence:** audit §4 row "Tidy lunchbox week, bookshelf and school bag: keep, for the school day"; master map Part 3.
- **Change:** add numbered lines: the bookshelf parked (a later visit's "put the book back on the shelf" at home); the school bag is the day's bag stage; correct the verb claim.

### 15. SHOULD: lines needed for the book and the greeting aren't on Mum's list
- **Place:** §1 "Frames heard" (the evening book: "At school I drew a bird." "I packed my book and my pencil."), §6 "Mum's school round", §5 (the greeting).
- **Problem:** the past-tense book lines, "good morning" and its reply, "come, you're my helper today", "Simba! Out you come" and the counting-along line are heard in the design but missing from §6's list, so Mum's round would come back without them and the day would still be grey where it ends.
- **Evidence:** lessons §10 (list every line needed; Mum's voice is the budget).
- **Change:** add them to §6, and mark which speaker each is (Nani, the teacher, Ali), since the teacher's voice is still Zafar's open question 1 and nothing of B records until he answers it.

## Verdict

The shape is right: a quick bag at home, a bus, a board where the heard word picks what to trace, colour, ring or rub, and a drawing that comes alive and rides home as a sticker. The board's trace-and-reveal and the ring-the-group count are the two mechanics worth building, and the "no letters, digits or words" rule is handled as data, not a sentence. But as written it isn't buildable from one brief: the day's order contradicts the clock design made the same night; the model that opens every lesson hands the child the answer by elimination; the bag's count has nothing to count against; the board's tool-on-thing is the clean-up's do-it engine specified a second time as new; the art is about 130 pieces for a "medium" day on one paste block; and the phone layout breaks on its own numbers. Fix 1-6 and the design is sound; 7-15 are a morning's edits before it reaches Zafar, and the first job after his go is still Mum's school round, since not one of the bag's deciding words is recorded.
