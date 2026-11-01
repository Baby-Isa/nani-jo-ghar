# Critique: Pick it up and put it back, the doll's house (1 Nov 2026)

Independent read of `build/reports/designs/pick-it-up-put-it-back.md` against the lessons checklist, the design method, the two 31 Oct research reports, the audit, the two maps, the rulebook (`docs/game-design/rulebook.md`, `data/rules.json`), the art bible, the cast doc and CLAUDE.md. I checked the word inventory, `data/lang/lexicon.json`, `docs/language/grammar-notes.md` §15-18, `data/relations.json`, `data/layout.json`, `js/shared/`, `js/tidy/`, `js/find/`, Tidy up's archived design and the hide-and-seek design written the same night. Flaws first, most serious at the top. **MUST** blocks the design going to Zafar as written; **SHOULD** is fixed before the brief.

---

## 1. MUST: a child with no Kutchi levels up by fishing, in every stage

**Place:** §3 A leak test ("Waiting", "Eliminating"), §3 B leak test, §5 ("Level up after 3 rounds with at most one hint each"), §10 decision 9.

**Problem:** every miss is "funny, never a frown", the line repeats, and the step never ends until the right copy or ring is tapped. So a round always finishes. Decision 9 makes only a first-go right tick the word's ladder and the badge, but the level rests on the rulebook's rule unchanged: three finished rounds with the guide's hint at most once. The hint is timed "from the last action", so a child who taps copy after copy never idles 7 seconds, never sees a hint, finishes three rounds, and climbs to L3 and L4 with no Kutchi at all. The badge "isn't a verdict", so it costs them nothing. The design's own sentence, "fishing through the copies finishes the step but teaches the bot nothing it can win on", concedes the finish and misses that the finish is what the level counts.

**Evidence:** rulebook §1 "up after 3 finished rounds at a level where the guide's hint came at most once a round"; `data/rules.json` `hintS` "from the last action"; checklist §1 "Ticks mustn't let a child fish… Tick only the right item, first go" [C1017 P62-63]; checklist §9 "Rules are coded, not just written". The hide-and-seek critique (finding 1) raised the identical hole last night.

**Change:** the level rests on first-go: up after 3 rounds where every errand and placement was right first go (or at most one wasn't) and the hint came at most once. "Last action" means the last ask, so a tap doesn't reset the timer. Write it in §10 as a rulebook override and put the number in `data/rules.json` so the leak bot reads it.

## 2. MUST: the card's room and position pictures at L2 are a picture match, and the design and the rulebook say different things about them

**Place:** §3 A "The instruction" and leak test ("Matching"), §3 B "The instruction", §4 step 2 ("the glasses, the kitchen's picture, the 'on' picture"), §9 row 1.

**Problem:** the card row carries the thing's picture, the room's little picture and a position picture "while the place words are supported". The design reads "supported" as the word ladder (three right in a row, then the text fades). The rulebook's rule is by level: `cardPicture: [true, true, false, false]`, shown at L1 and L2. Under the rulebook, every L2 errand is: match the room picture to a room, match the on/under picture to a copy. That is 100% for a child with no Kutchi, and the "under 10% at L2" claim fails. Stage 2 is the same: the position picture on the row picks the ring. The games map already says, for the clean-up, "the order card's picture at L1 only".

**Evidence:** `data/rules.json` levels.cardPicture; research-other-games §3 "the 'it glows' support is fine at level 1 only", lesson 6 "the hints that guide play are leaks for us"; checklist §1 "Show a need the picture can't settle". Same as the hide-and-seek critique, finding 2.

**Change:** one rule, written once: the room and position pictures on the card at L1 only; from L2 the row shows the thing, the Kutchi and a speaker. Record it in §10 as an override of the rulebook's L2 picture, and make §3 A, §3 B, §4 and §9 agree.

## 3. MUST: the first round cannot be played by its own rules, and its story contradicts itself

**Place:** §3 B "What you do", level ladder L1 ("one anchor (the table): on or under… Rings shown: 2"), leak test ("Eliminating": "A placed thing makes its spot unavailable, but a new ring appears on the next anchor in the same relation"); §4 steps 5-9.

**Problem:**
- At L1 there is one anchor and two rings. The ball goes under the table, which "makes its spot unavailable"; there is no "next anchor" at L1. The second ask ("the glasses on the table") now has one ring: a free move. The third ask, "the bag under the table", asks for a spot the rule has closed. As written, the first round's put-away has one real choice in three.
- The story: in stage 1 the child fetches Nana's glasses and he reads with them; in stage 2 the same glasses are "back on the sitting-room rug" and go on the table; in step 9 "everyone with their thing: Nana reading, Ma at the front door with her bag, Ali bouncing his ball", though the child has just put the ball and the bag under the table. A four-year-old will notice that the things they tidied are in people's hands again.
- Hide and seek's design (same night) hands this game its mischief things ("Nana's glasses are on the floor in the bedroom; put them on the table"). This design ignores that carry and invents its own. Two designs for one day say different things.

**Evidence:** the design's own §3 B rules against §4 step 8; `build/reports/designs/hide-and-seek.md` §2 row 2 ("Uses (b)…"); checklist §2 "lose them by confusion, not by boredom".

**Change:** a spot is never consumed: things can share "under the table" (the ring stays live and the second thing settles beside the first), so every placement at L1 has two rings and at L2 eight. Separate the two halves' things: stage 1 fetches what the family want and they keep them; stage 2 puts away what hide and seek dropped on the floor (its handover) plus the ball from the garden. Put the carry in one place both designs cite.

## 4. MUST: Simba's paw leaks by waiting, and the design re-opens a leak Tidy up had closed

**Place:** §3 C "What you do" step 4 ("the row ticks when Nani reaches it and nothing is tapped for 3 seconds"), "The instruction" ("the card shows all the rows as the room's list, each ticking as it closes"), leak test ("Waiting").

**Problem:** the card lists every row, and a row that already holds ticks itself after a three-second wait. So the child waits three seconds on each row: a tick means leave it, no tick means fix it. Which rows hold, the thing the design calls the stage's novelty ("the only place a child learns that not every row is a job"), is read off the card by waiting. Only the ring is left to the Kutchi. It also makes the child sit through Nani's rows one by one. Tidy up's archived design saw exactly this ("if the card listed Nani's rows and ticked the ones already true, it would name the leave rows") and answered it with a fixed card of n dots and Nani's voice carrying the rows.

**Evidence:** `docs/archive/modes/tidy-up.md` Q.1 rule 2 ("A stage-4 card shows dots, not rows") and stage 4 ("The rows cover right things as well as wrong and a leave row looks like any other"); non-negotiable 4 (no winning by waiting); non-negotiable 7 (never make them wait for speech); checklist §13 "An 'everywhere' rule fixed in one game only".

**Change:** reuse Tidy's rule: the card is n dots (n = things knocked), never the rows; no row ticks on a wait; a tap on a thing that already holds gives the happy wiggle and counts as a right judgement; Nani's rows play on, and a tap during them is kept.

## 5. MUST: L1's deciding word is one the child has never heard and Mum has not recorded, and the recording list is undercounted

**Place:** §1 ("the rooms come back from hide and seek", "Totals: about 22 to record first"), §1 "Frames heard", §3 A ladder L1 ("the copies are in different rooms, so the room word decides"), §4, §9 row 10, §10 decision 14.

**Problem:**
- Hide and seek's first visit is one bedroom and teaches its places (cupboard, wardrobe, bed, curtain, box); the room names arrive only at its visit 5 ("the whole house"). So on the day as designed, the child reaches this game having never heard "sitting room", "bedroom" or "Ali's room", and the design's L1 makes the room word the deciding word. Four of the five room names have no Kutchi at all (§1 says so). L1's first round therefore teaches 3 things + 2 positions + 3 rooms = 8 new words, not 3-5, and the deciding one is the weakest.
- The things are worse: glasses, bag and ball have no Kutchi (inventory: "no-kutchi"), so every L1 ask is "My [glasses] are on the table in the [kitchen]" with grey English in the slot that matters. A reader wins; a non-reader hears device speech. Decision 14 admits it but the first-round walkthrough is written as if it plays.
- "About 22" is low. Counting what the design itself names: 6 things, bed, sofa, box, 4 rooms, this side, that side, put it back, pick it up, 6 position words as pieces of their own (today only inside lines), the fetch frame per asker, the put-away frame, "the X goes on the Y", "leave the X", "Simba took it", "and the last one", "bring me the X", slippers, shoes, top, bottom, drawer, knife, fork, 5 spices; plus Nana's, Ma's and Ali's voices for their own lines (open question 1). That is 40-50 clips before the first visit, and more if each asker records their own frame.
- The fetch frame "built from 'it was on the table' and 'he's in the kitchen'" is two recorded clauses spliced into one sentence with two place phrases. The grammar notes give one frame for put ({thing} {place} je {where} rakh) and none with a room and an anchor in one line. Splicing is a hand-made fragment, which non-negotiable 2 forbids: "if the engine can't say it, report the gap."

**Evidence:** `build/reports/designs/hide-and-seek.md` §1 (words: places, not rooms), §5 visit 5; `research-word-inventory-2026-10-31.csv` (glasses, bag, box, sofa, pillow, blanket: no Kutchi; kitchen inside 2 lines; on, under: placeholders); grammar-notes §18 rule 14; checklist §10 "Mum's voice is the budget… list every line needed", "3-5 new words a round"; audit flaw 2 (a reader wins on placeholders).

**Change:** (a) at L1 the room is a guided tap and the position decides: the copies sit in one room, on and under the same anchor (on and under are inside Mum's lines and first on her sheet; the research says on before under); the room word joins at L2 as the second word per move. (b) Until the askers have voices, Nani says every ask ("Nana's glasses are on the table in the kitchen", the fallback in open question 1), so 1a needs no new voices. (c) A table "What Mum records for L1 to play", counted, in the order that unblocks play, with the fetch frame asked of her as a frame ("X is on the table in the kitchen") rather than spliced. (d) The two home designs name the same list of room words and who records them first.

## 6. MUST: the mock-up prompts attach the wrong Nani, invent a Nana, and prompt 4 will read as the player's own arm

**Place:** §11, prompts 1, 2 and 4.

**Problem:**
- Prompt 2 attaches `sources/cook/nani-sheet.webp`, which the art bible lists as a render-style reference only ("not Nani's identity", a generated placeholder). Nani is locked (Zafar, 16 Oct) to `sources/art/s08/sheet-nani-final-1.png` and the lineup. ChatGPT will draw the placeholder and Zafar will approve it as the look. The hide-and-seek critique flagged the same yesterday.
- Prompt 1 describes Nana as "a navy cardigan and white kurta"; the bible's standing placeholder is a white knitted cap, round glasses, white beard, cream kurta, brown waistcoat (the Nana Cook already uses). A second Nana for one game.
- Prompt 4 puts "the cream sleeve and red embroidered cuff of a grandmother's kameez" at the bottom edge of a straight-down scene. In a top-down view a sleeve at the bottom edge is the first-person-hand convention, which the bible parked (H13: no hands in Cook). The child will read it as their own arm, which is the opposite of "which side Nani is on". More to the point, the design never says how "this side" is shown in a T scene at all.
- Prompt 1 mixes the L1 guided moment (the kitchen glowing for the glasses) with the L2 copies (two bags): a composite that explains two rules at once.
- Good: no prompt names a real person, every prompt forbids text, and the styles match the bible's Do and Don't.

**Evidence:** art bible §1 "The real people, locked" and the reference table; §6 cast row for Nana; §7 (hands parked); checklist §7 "plain scenes".

**Change:** attach `sheet-nani-final-1.png` and the lineup (keep `nani-sheet.webp` only as a render-style reference, as the bible's table says); describe Nana as the bible does; prompt 4 without the sleeve, and a sentence in §3 E saying how the board shows Nani's side (her bust in the guide's place at the bottom, as Cook's stations show her, or the E view of the kitchen before the zoom with her standing at that end); prompt 1 as one moment (L1: the glasses, the glow, no bags; or L2: two bags, no glow).

## 7. SHOULD: the first visit is far too big for a game the research sized "small to medium"

**Place:** §0 ("medium… one builder sprint for the core, a second for the boards"), §3 (eight mini-games kept, four in the first visit plus two boards), §5 ("L2-L4 on the first visit"), §6 "New to build" (six new pieces), §7 art list.

**Problem:** the first visit as written is stages 1-4 at L1-L4, the spice box and make the bed, a doll's-house camera with zoom and travel, a speaker-relative relation, four new people with three poses each (Nana, Ma, Ali and baby Isa, whom the cast doc marks "no design yet, appears later", and who cannot ask for anything), five rooms in two lighting states each, about eight anchors and fifteen things: roughly fifty assets in "one paste block", before Zafar has played one errand. The research sized it as put-it-in-its-place plus a fetch, with the camera as the new part.

**Evidence:** research-other-games §4 "Size: … Small to medium"; `docs/game-design/cast.md` (Isa); CLAUDE.md "Keep it small"; checklist §13 "Design questions left open for the builder" (the askers' voices is one); the hide-and-seek critique's finding 10 split that game the same way.

**Change:** 1a: stages 1 and 2 at L1-L2, three rooms (kitchen, sitting room, bedroom), four things (glasses, bag, ball, cup), Nani as the only speaker, Nana seated as the one receiver (one pose plus "using it"), no lights-off states, no boards. 1b after his play: Ma and Ali with voices, Simba's paw, Tell Ali where, L3-L4, the boards. Isa waits for the cast decision. Move open question 1 and decisions 4, 17 and 19 to 1b.

## 8. SHOULD: "this side" and "that side" are built on a meaning Mum hasn't confirmed, and her note says they are pointing words

**Place:** §1 (the position table), §3 B L2 and "This side and that side" ("She never points"), §3 E, §10 decision 6, open question 2.

**Problem:** grammar-notes §17 records *hi baju* and *hu baju* in one line: "At home they point: *hida* (here, near you) and *huda* (there), or *hi baju* (this side) and *hu baju* (that side)." They are deictic, used with a point. The design removes the point and fixes "this side" as "the side nearer Nani", then builds stage 2's L2, the spice box's whole board and the game's "novel" claim on it. If Mum says *hi baju* means the side she points at, the rings have been teaching a convention the family doesn't use. The engine has *baju* alone; neither phrase is a clip.

**Evidence:** grammar-notes §17; non-negotiable 2 (Mum is the authority); open question 2 in the design itself.

**Change:** keep the question, but don't build on the answer: stage 2's L2 is on and under with two anchors (already two words per move), and this side / that side becomes its L3 once Mum has answered with a picture. The spice box stays a 1b board. If she confirms the speaker-relative meaning, decision 6 stands as written.

## 9. SHOULD: the leak numbers don't say what they claim, and "win" is undefined

**Place:** §3 A leak test ("Patterns"), §3 B ("Bot target under 10% first go at L2"), §3 C ("Bot target under 10%"), §9 row 1.

**Problem:** "picks the right copy first go under 10% of errands at L2 (3 copies, 1 in 3 per errand…)" is 33% per errand, not under 10%; the bracket then gives 4% for three in a row. At L1 the copy and the ring are each a coin toss (two copies, two rings), which is never stated. Stage 3's "under 10%" has no working (how many rows, how many rings, what counts as a win). Since every round finishes (finding 1), the bot has nothing to "win" unless the design defines a win as all first go.

**Evidence:** checklist §1 "The bot plays a learned save and must win under 10% of rounds"; the hide-and-seek critique's finding 14.

**Change:** define a won round as every errand and placement right first go; give the per-level odds in one table (L1: 1 in 2 and 1 in 2; L2: 1 in 3 and 1 in 8; stage 3: rows x rings) and let the bot print them.

## 10. SHOULD: Simba's paw drops two of Tidy's mechanics without asking, and the swap has no ask

**Place:** §3 C ("A crash off-screen… Simba is on the bed… his paw still out"), level ladder L3 (the swap), §10 decision 11 ("Nothing removed").

**Problem:** Tidy up's Simba's paw is a two-second window to tap the paw and shoo him, saving one thing (the hand-skill beat, the neat star), and its Arc 4 form has Zazu carry one thing off with Nani's "it was on …" deciding by the past tense. Both are gone here without a line saying so; Zafar never commented on them. The swap at L3 says "two things have swapped places… Tap one, tap the other" in a room the child hasn't seen, with nothing on the floor and no rows spoken: nothing tells the child which two. Tidy's version has Nani repeat every row in a new order and a card of two dots.

**Evidence:** `docs/archive/modes/tidy-up.md` 4a and 4b; non-negotiable 1; checklist §13 "A builder replacing a mechanic… unasked".

**Change:** list the paw-tap and the past-tense form as numbered choices (keep, 1b, or park), and give the swap its ask: Nani says every row of the room once, then the child taps the two that no longer hold.

## 11. SHOULD: three hint stories are one again

**Place:** §3 A leak test ("Waiting": "the helper card opens with the full answer and costs a bulb" at 7-13 s), §3 B ("The right ring never glows unless the helper card was bought"), §9 row 4.

**Problem:** the rulebook separates the free repeat, the guide's hint (7/9/11/13 s from the last action, counts for level-up) and the helper card (a bulb tap, costs a bulb, shows the full answer). The design has the 7-13 s timer open the helper card and charge a bulb by itself, which is help the child didn't ask for and a cost they didn't choose.

**Evidence:** rulebook §1 "The guide's hint" and "The helper card"; checklist §3 "Listening again is free; only the bulbs cost"; the hide-and-seek critique's finding 8.

**Change:** one paragraph: the free repeat every 8 s; the guide's hint (the bulb throbs at 7-13 s from the last ask); the helper card only on a bulb tap.

## 12. SHOULD: the phone layout is asserted, not checked, and the card row won't fit

**Place:** §7 Layout, §3 A and B "The instruction", §4 step 2, §9 row 6.

**Problem:** at 740x320 the card column is about 148 px. A row carrying the thing's picture, the room's picture, the position picture, the Kutchi and (at L1) the English is five things in 148 px: clipped or ellipsised text, which non-negotiable 6 forbids. `js/shared/order-card.js` today shows one picture per card. Stage 2 at L2: eight rings of 48 px round two anchors "well apart", Nani cut at the hip with her face in frame, 8% slivers each side and a rug of things, in about 590 px of play width; the design calls this "passed on paper" and names only the overview as a risk. Nani standing "at the left end of the room" puts her against the card column, where the checklist keeps people in the middle and on the right. Heights 500-599 fall in neither of the design's two layouts (`data/layout.json` makes everything under a 500 short side a phone and the rest laptop, bar tablets).

**Evidence:** non-negotiable 6; checklist §6 [RULES P7, P16; SH-145]; checklist §13 "Playing one level, one round or one size"; the fast lane (Zafar, 27 Oct: a lab page, the four-size check, then his choices).

**Change:** the lab page before any art, placeholder boxes at the five sizes and every level, shots by script; the card row mocked at 740 with its longest Kutchi; the row change (two pictures on a row, or the room as the card's face) sent to the shared-layer owner as a change to `order-card.js`; Nani's two ends as "middle-left" and "right" of the play area; the layout switch named as the data's 500.

## 13. SHOULD: the speaking set is too small at L2 and too big at L4

**Place:** §1 "Frames said", §3 D level ladder (L2 "Set of 2", L4 "the child says 'under the chair'… the pills show both words").

**Problem:** speaking.md and the checklist give a closed set of 3-5; L2 offers two (a coin toss on the pills, 50%). L4 asks for a position plus an anchor in one turn: with two anchors and two or three positions that is four to six combinations, past the 2-3 "that sound different" the recogniser handles (SH-127, the Disney work).

**Evidence:** `docs/game-design/speaking.md` ("the recogniser only ever checks 3-5 options"); research-mechanics finding 3; checklist §8.

**Change:** L2's set is three (on, under, next to, all starting differently); L4 is two turns, the position then the anchor, each from a set of 2-3.

## 14. SHOULD: reuse missed, and rulebook overrides not recorded

**Place:** §6, §10.

**Problem:** the L3 two-person exchange and every bubble are Conversations' job (`js/shared/conversations.js`: `bubble` is "THE speech bubble for a line in every game", `run` the scripted beat); the design routes them through `say.js` only. `js/shared/whichone.js` has the decoy rule, `blindOdds` and `estimate`: the copies rule and the bot are a reskin of it, not an extension of Find it's greybox bot. `js/shared/rules.js` is the one reader for levels and hints. Tidy's n-dots card (finding 4) is a solved rule in the archive. The "one house" claim (decision 3) is not true as drawn: hide and seek's bedroom has a wardrobe, a curtained window, a cupboard and the toy box; this design's bedroom has a bed, a chair, a lamp and a side table, and puts the toy box in Ali's room. And §10 records twenty decisions but none as rulebook overrides, though the design departs from the rulebook at least four times: L2 without numbers or "no" asks, the card picture by ladder not level, a speaking set of two, and the level rule (finding 1).

**Evidence:** audit §5 ("Overlaps: one job done many times… each built it on their own engine"); checklist §13; the hide-and-seek critique's findings 11 and 17 (overrides recorded).

**Change:** name Conversations, WhichOne, Rules and the n-dots rule in §6; one bedroom shared by both designs (places and anchors in one drawing) or drop the "halves the art" claim; a short "Rulebook overrides" list at the end of §10.

## 15. SHOULD: small things

- **Cupboards:** Zafar said the game "grows into drawers (cutlery), the wardrobe and cupboards"; the design parks cupboards as "maybe later" (K, 16 points). Deferring is fine; present it as a numbered choice, not an assumption.
- **The travel's lights:** decision 17 says day light only to keep the art small, but the art list asks for lights-on and lights-off for all five rooms so the travel can switch them on. In daylight a light coming on is a weak beat anyway. For 1a use the shared lit-box glow (code) as the travel's highlight and drop the ten light states.
- **Baby Isa** is listed as an owner at L2 ("my teddy") and cannot speak; the cast doc has no design. Give the teddy to Ali or the child until Isa is decided.
- **Decision 20** ("no fridge, sink or hob as anchors") is contradicted by prompt 1's kitchen ("sage cabinets, a marble worktop… a small wooden table with one chair"): fine, but say the cabinets are scenery, never ringed, or ChatGPT's picture will invite it.
- **"The five new words"** in §4 step 9: the first round as designed teaches eight (finding 5).
- **Zafar's own list** was "on top of, underneath, left of, right of"; the design's "this side and that side first" follows Mum's approved advice (idea 11, Zafar 26 Sept) and the scope he gave on 1 Nov, so it is not a contradiction; say so in decision 7 so he sees the swap was his.
- Nothing in the design invents Kutchi: every word and frame is traced to the lexicon or Mum's notes, and the unrecorded ones are marked. Good.
- The method's output is a section in `docs/game-design/modes/<mode>.md`; this lives in `build/reports/designs/`. Fine for an overnight proposal; say where it goes once he says yes.

---

## Verdict

The shape is right and it follows Zafar's scope closely: fetch by a heard place with identical copies, put back with every spot ringed and a shake on a wrong one, Nani as the adult the sandboxes lack, and a delight moment (Nana's eyes, Zazu in the bag, Simba in glasses) at every step. The fold of Tidy's and Find it's nine mini-games is faithful to the agreed list. But as written it is not leak-proof in play, and its first round does not work: a child can fish through every level because the level ignores first-go (1), L2 is a picture match under the rulebook's card rule (2), the one-anchor put-away closes its own spots so two of the three placements are free or impossible (3), Simba's paw tells the child which rows to fix by waiting, re-opening a leak Tidy had closed (4), and L1's deciding word is a room name the child has never heard and Mum has never recorded, in an ask the engine cannot build (5). The mock-ups would hand Zafar the placeholder Nani, a second Nana and a top-down sleeve that reads as the player's arm (6). Fix those six, cut the first visit to 1a (stages 1-2, L1-L2, three rooms, Nani the only voice: 7), hold this side / that side until Mum answers (8), and run the lab page at the five sizes before any art (12); then it is ready for his numbered choices. The rest is polish.
