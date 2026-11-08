# Feedback: the kitchen play, 8 Nov 2026 (every Sprint 18 kitchen game but chai)

**Source:** Zafar's 25-minute voice note of 8 Nov (`docs/feedback/kitchen-play-2026-11-08-transcript.md`, Whisper's draft: Kutchi
spellings are its guesses). He played maani (L1, said), sekelo, daar, stir, chaat, samosa, eggs and the corn stall (levels not said;
the branch he played was Sprint 18's wave 3). Chai was signed off before and is not in it. 239 transcript lines, 41 points. Causes
checked in code on `s18-feedback-1108` (from `ccr-31767b7f-rfyrg4`). Logging only: nothing is fixed here. Fable's
`build/reports/s18-fable-what-went-wrong.md` (the same day) explains most of it: the games moved onto the kits' calls, not chai's look.

**Layers** (`docs/architecture/module-map.md`): **shared** = `js/shared/`, `js/cook/ui.js`, `js/cook/flow.js`, `js/cook/station-lib.js`,
`js/cook/coach.js` (every game); **kitchen kit** = `js/cook/kitchen-kit.js`, `js/cook/mechanics/`; **game** = `js/cook/stations/<game>.js`
and `data/stations/<game>.json`.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Every game: the tick and next buttons | a ✓ button ends a step or a game (js/cook/ui.js:4194; maani-line.js:407, samosa.js:585, station-lib.js:1118 chaat, fill-fold.js:567, fry.js:188, daar.js:1488, stir.js:403, grill.js:1779, thread.js:306-309) | no ✓ and no "next" button anywhere: a step or a game moves on by itself when it is complete (his decision this week, said again) | P11 |
| Every game: the order card's ticks | maani's item cards tick only when its step closes on the ✓ (order-card.js:316 shows the row's done, not its units; ui.js:3701-3711) | each item card ticks as its thing is made, as in chai; "well done" and the end only when the whole card is complete | P13 |
| Every game: the first-time light | stays until the step is done (coach.js:87, the step's signature changes only when the thing is done) | goes the moment the child starts the move it shows | P6 |
| Every game: the lit thing's hop | every first-time lit thing hops (coach.js:672 `bounce: true`) | only things on the shelf (the bottom bar) hop; pans, boards and things in play never | P8 |
| Maani: the first roll | the dough rolls on past the size (js/cook/mechanics/roll.js) | the first time, the roll stops at the right size, the size guide pulses yellow with the juice sound, then the light asks for the tap (no finger) | P7 |
| Maani: the roll's demo | two fingers at once (the kit's, coach.js:111-138, and roll.js:267) | the rolling pin rolls up and down with one finger dragging it; a finger or a pulsing circle, both tried in the lab, he picks | P4, P5 |
| Sekelo: the order card | one row per skewer kind ("hakri lakri mishkaki", data/cook.json:2245) | four item cards per skewer, one per piece ("gos, gos, gos, gos"), each ticked as it goes on; the order names the dish | P18 |
| Sekelo: orders per person (question) | 1-4 skewers by level (SEK-22) | one skewer per person (Q2) | P21 |
| Daar and the stir game | two stirs: daar's own dial and look (daar.js:19-36, 1242-1330) and the stir game's (mechanics/stir.js) | one stir in the kitchen kit, one look | P29 |
| Samosa (question) | six strips, fill, fold by swipes, a ✓ (samosa.js, fill-fold.js) | back to one strip, guided: it refuses a wrong filling, takes only the asked number, rolls up and moves on (Q4) | P36 |
| Eggs: the order | "I want egg" then "one fried egg" (data/cook.json:748, :753) | "I want two fried eggs", two item cards each "fried egg", no "one" on a card | P38 |
| Corn: the green band | the last tenth of a 2.6-3.2 s side (data/stations/corn.json:45-55, :189) | longer; a minimum for every game is a question (Q5) | P40 |

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| The dough balls (maani's piles) | maani | P12 (his ChatGPT options first) |
| The chopping board and the metal trays (not exactly top-down) | sekelo (and maani's board, to name at the run) | P14 |
| The oil pan (not top-down) | daar's tadka | P27 |
| A shelf crate as an item card's picture (a crate of onions for "one onion") | every game's cards (ui.js:2931) | P24 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix | Layer |
|---|---|---|---|---|---|---|
| P1 | 0:00-0:57 | "if we're only ordering one of an item that we wouldn't say the letter one ... So it would just be Marnie ... two Marnies, three Marnies. However, which does make it look more nicer in the text box ... maybe it's better to say one then you learn the male and female tense of one and it helps you to learn other ones so maybe let's keep it for now" | maani L1 | not code: a principle for Zafar (kept for now, his words; joined with P40) | Q1 | - |
| P2 | 1:02-2:10; 16:45; 17:46 | "I look at the item card ... it doesn't use the ... correct rules I don't see a line above the speaker button divide a line and the alignment as well I think is off ... the English text would always be paired with the Kutchi text directly below it and ... centered ... look up the exact rules ... the tea game does so I don't know why it's not transferred over"; sekelo: "I don't know that it carries a lot of the tea elements"; daar: "the item cards don't have the line break they're not the correct ones" | maani, sekelo, daar (every game but chai) | js/cook/ui.js:1552 and js/cook/flow.js:1721 switch the 6 Nov card (`<html class="njg-lora">`) on only for an all-chai order; `UI.TYPE_ALL` is false (ui.js:243); the divider and the English-under-Kutchi rules live only under `:root.njg-lora` (css/shared/order-card.css:684-699) | the roll-out: the 6 Nov card for every game (`UI.TYPE_ALL`, then the gate goes), checked at the four sizes in each game | shared |
| P3 | 2:15-2:49; 23:00-23:05 | "the onboarding highlight box was incorrect for money it clips the edge of the images and the pill ... it also clips the edges of the round ... board for rolling the money it clips all edges"; eggs: "the highlight square of the ... around the eggs cuts off the word pill" | maani, eggs | js/cook/coach.js:103 and :625-659 (the kit's first-time box hugs the step's picture alone, thingOf: the pile without its pill; for the roll the dough, not the board); js/cook/stations/eggs.js:297-299 (the bowl's box, Coach.box, without its chip) | SH-230's one rule in every game: the thing, its pill and the board it works on, with the margin | shared |
| P4 | 2:49-3:02 | "instead of the finger what I think it looks terrible and there seems to be two of them overlapping at the same time like there's two different finger animations both firing" | maani L1, the roll | js/cook/coach.js:111-138 (the kit's finger, "drag" for a roll) and js/cook/mechanics/roll.js:267 (the roll's own S.ghost, at 200 ms when guided) both run; maani-line.js:380 a third ghost for the tap | one finger, the kit's (SH-119): no mechanic draws its own ghost | shared |
| P5 | 3:07-3:19 | "we need the rolling pin to go up and down and the finger dragging it up and down and just one finger I will think to decide on what the finger looks like or if we just do the the kind of pulsating circle we could try both and see what look comes out better" | maani, the roll | js/cook/coach.js:119-128 (the kit's roll demo is a finger from above the dough to below it; the pin does not move) | the demo: the pin rolls up and down under one finger; a finger and a pulsing circle both on the lab page for his pick | kitchen kit (the roll's demo), shared (the finger) |
| P6 | 3:28-4:03 | "it's not going away the highlight box ... I start rolling the box should go away ... as with onboarding in general if I successfully started doing the task it wants me to do then it should go away so there's no highlight while I'm rolling" | maani (every game) | js/cook/coach.js:87 (the step's signature changes only when the thing is done) and roll.js:269 (the roll's expectation stands until the size is reached), so the light stays through the roll | every first-time light goes when the child starts the move it shows (a drag begun, a hold started), not when it ends | shared |
| P7 | 4:09-4:30 | "once it's reached the right size maybe the first time you do the money it stops you rolling at the right size you hit the size guide it will have a highlight ... in pulsating yellow ... the juice sound is for rolling into the right size ... then the highlight comes on and prompts you to click it but there shouldn't be the finger to click it then" | maani L1, first time | js/cook/mechanics/roll.js:200-269 (no first-time stop at the size); maani-line.js:376-381 (the ghost finger shows the tap on the rolled maani) | first time: the roll stops at the size, the guide ring pulses yellow with the juice sound, then the light on the maani asks for the tap, with no finger | game (maani) on the kitchen kit's roll |
| P8 | 4:35-4:57 | "it should just be like ... the chai pan ... where it doesn't bounce up and down because it's not an item like that ... the bouncing up and down is for items ... maybe I should tighten that rule to say it's like items in the bottom bar bounce up and down" | maani (every game) | js/cook/coach.js:672 (`lightThing`: every first-time lit thing glows with `bounce: true`, the dough on the board too); js/cook/stations.js:517-578 (the hop) | the hop only for things on the shelf (the bottom bar); a pan, a board or a thing in play is lit without it (SH-53's bounce narrowed) | shared |
| P9 | 5:00-5:23 | "some weird thing happened ... I clicked the money to go onto the ... pan and ... as it flew onto the pan the ... dough balls briefly flashed up as highlighted" | maani L1 | js/cook/stations/maani-line.js:385-397 (as the maani leaves the board, `need` is the next pile and its expectation is set while the maani is still flying); js/cook/coach.js:718 lights the new expectation at once | the next pile is expected (and lit) only once the maani has landed on the tawa and the step has moved on | game |
| P10 | 5:28 | "I'm not getting onboarding for flip I don't think I got good onboarding for flipping" | maani, the tawa | data/cook.json:6347 onboard maani-line (four steps counted by the signature, js/cook/coach.js:87, spent before the flip); maani-line.js:633 the flip's expectation is a timing shown as a plain tap (coach.js:77); MAA-19's first-time hold in the green not built | MAA-19: the flip's first-time hold in the green with the dim, the lit box and the move shown (as chai's boil, SH-158) | game on the shared lights |
| P11 | 5:38-5:59; 21:18; 22:04-22:08 | "there's a tick box there's a tick as well why is the tick there ... there's no ticks in any of the games anymore no ticks hard and fast rule it's not a good game mechanic ... no ticks and even I'm going to try cut out ... go to the next scene buttons as well I think we should just cut them all out"; chaat: "also the tick buttons there when it shouldn't be there no tick buttons"; samosa: "the next button is just horrible" | every game (maani, chaat, samosa seen) | js/cook/ui.js:4194 (UI.done shows #done-btn); called by maani-line.js:407, station-lib.js:1118 (chaat's freePick, assemble.js:1353), samosa.js:585, fill-fold.js:567, fry.js:188 and :210, daar.js:1488, stir.js:403, grill.js:1779, roll.js:95, count.js:152, thread.js:306-309 (UI.go and the ✓) | no ✓ and no next button in any game: each game moves on by itself when its step or order is complete (NjgButtons.moveOn, as ui.js:4232's UI.go already does); UI.done retired from the kits | shared, then each game |
| P12 | 5:59-6:10 | "I'm not sure if the doubles look realistic enough I'm not sure they look like doubles maybe I'll ask ChatGPT to give me some options of what realistic doubles look like" | maani | not code: art (the dough ball and pile pictures) | his ChatGPT options, then an art run | art |
| P13 | 6:16-7:24 | "I didn't get a tick either for doing the money ... the item card hasn't ticked off ... I've now done both of them and ... neither of them have ticked off until I press the tick button and then they both ticked off ... it needs to be like tea where it ticks off as you go ... say well done when all of them the whole menu card is complete ... not just if an individual tray is done of a certain type ... the whole thing should be complete and ... the order person that orders says well done and then the game ends" | maani L1 (every game) | js/shared/order-card.js:316 (the 6 Nov row card draws the row's done only); js/cook/ui.js:3701-3711 (M.tickCard ticks a unit the card never draws); the row closes when the step ends on the ✓ (maani-line.js:404-410) | each item card ticks as its thing is made (one card per thing, as chai's glasses); the orderer's "well done" and the end only once every card on the order is ticked | shared |
| P14 | 8:07-8:27 | "the chopping board isn't top down either perfectly ... I think we need to attach a reference image or something exactly top down in ChatGPT to help it and all the metal trays ... let's include those in the art one ... for these top down things you need to attach a royalty free image that's exactly top down to help guide it" | sekelo (the board and trays) | not code: art | the next art run: the board and the metal trays redrawn exactly top-down, each with a royalty-free exactly-top-down reference attached | art |
| P15 | 9:14 | "it just popped up Nani's hint says thread them in English I know that needs replacing" | sekelo L1 | not code: Mum (the "thread them" line, SEK-18) | SEK-18, told again: waiting on Mum | language |
| P16 | 9:19-9:43 | "after 15 seconds or something the auto helper hint came up and it said I think one skewer of mishkaki ... in Kutchi but it could have easily fit on ... one line but for some reason it didn't it wrapped onto two ... I guess again it should be correct in tea"; and "hints don't wrap" (16:55) | sekelo (every game's Nani line) | js/cook/ui.js:1552 (the 6 Nov type off outside chai, so her line is set in the old, wider type: Lora 500 only under `:root.njg-lora`, css/shared/order-card.css:676); js/cook/mechanics/thread.js:164 and :349 (the hint says the skewer's count and kind, St.nani) | Nani's line in chai's type and fit in every game: one line whenever it fits, shrink then wrap (non-negotiable 6) | shared |
| P17 | 9:47-9:53; 16:48-16:55; 17:49 | "there's no drop down button in Nani's helper hint I really don't understand how these elements supposedly came across"; "drop downs are not there for the hints ... I can't even open the hints"; daar: "there's no drop down on the Nani hint" | sekelo, daar (every game) | js/cook/ui.js:990 (the arrow hides while no helper item is named); js/cook/station-lib.js:443-452 (helperWatch names one only when the step's expected key is a word on an order row: sekelo's piece, thread.js:370, and daar's chop slice name none) | SH-149 in every game: the arrow and the helper card whenever the step names a thing the child must pick (the piece, the vegetable), its card from the order's words | shared |
| P18 | 8:43-8:51; 9:56-11:22; 13:54-14:05 | "something we still haven't resolved in this ordering system and I think I have the answer now ... in the order card we have to have four items ... the items that go on each skewer even if it's four of the same thing and they get ticked off as you put them on ... firstly it makes you know that you've done something correct when you've put something on because otherwise you have to put four on before you even know ... secondly it's ... consistent ... you always have four for a skewer and what it lets us do is separate the names of the items that go on the skewer from the overall order ... the item you put on isn't Mishkaki the item you put on is gos like meat or it would be chicken ... the item card just say gos gos gos gos or chicken chicken chicken chicken"; "for now ... ensure that each order of a skewer just has the four individual items ... four individual ... item cards within one order" | sekelo | data/cook.json:2245 (the order is one row per skewer kind, "ba lakri mishkaki", the tally's unit the skewer); js/cook/ui.js:3713-3730 (M.tickPiece ticks a mixed skewer's pieces on its row, not cards) | the order card holds four item cards per skewer, one per piece, named for the piece, each ticked as it goes on; the order's headline names the dish | game (sekelo's order data) on the shared card |
| P19 | 11:28-13:27 | "the order can then say Mishkaki which ... is an abstraction in the language ... I'll take the language of mum but I think the order should say I want beef mishkaki I want chicken mishkaki or ... maybe the mixed one would just be like I want mishkaki ... the order can be mixed ... I don't need to say mixed ... the Kutchi version of I want grilled vegetables I mean we could take out the word mishkaki ... it is East African and we could just say I want grilled meat 'muka sekele goos kope, muka sekele kukro kope, muka sekele' (Whisper's spelling) I don't know how you do it for mixed" | sekelo's order sentence | not code: Mum (the sentences are hers; his lines are drafts to ask her) | Mum's round: "I want (a) meat / chicken / mixed skewer" or "grilled meat / vegetables", the mixed order ("first chicken, then three pieces of lamb"), whether mishkaki stays | language |
| P20 | 13:36-13:53 | "we should be organizing the questions for mum ... the big language grammar sheets we should be organizing them by game so here ... we should pop some of these questions into that game on the sheet" | the language sheets | not code: process (docs/language/recording-sheet.md and the mum-round sheet are by topic, not by game) | the grammar sheets and Mum's question sheet grouped by game; sekelo's questions (P19) into sekelo's part | process |
| P21 | 14:20-14:38 | "what would happen if one person orders two maybe we just avoid that problem maybe ... each person only ever orders one of the skewer you know we have other game modes where they order multiple things" | sekelo | not code: Zafar (changes SEK-22's skewers 1, 2, 3, 4 by level) | Q2 | - |
| P22 | 14:47-16:39 | "when they order say they want one chicken and three meat ... the Kutchi version of first chicken and then three pieces of lamb ... the chicken card will pop up and then it will go small into the order card and then ... a lamb pop-up card will pop up and it will stay there and we'll see an animation where almost like an overlaid pop-up card will shrink down and go into the order card and then the next one and on the third one the actual pop-up card will disappear and go in either that or the pop-up card then splits into three smaller pop-up cards ... I think the former might be easier to understand and simpler to implement ... tell me what you think" | sekelo (the shared pop-up) | not code: Zafar (a new pop-up behaviour for a count) | Q3 | - |
| P23 | 16:59-17:39; 20:14-20:20 | "what is going on with daar ... it's got the relic of the old order card in there the one that's like a long ... wide horizontal rectangle with an arrow running through it from left to right with the old ... everything ... it cuts across randomly halfway through the order card"; chaat: "order cards completely wrong ... where you've got sequences you've just not managed to do this order card" | daar (the tadka), chaat (the layers): every ordered list | js/shared/order-card.js:558 and :563 (a group, or a dish's ordered steps, is drawn as the old "little skewer" strip before the 6 Nov path is tried, :559); css/shared/order-card.css:476-486 (the stick and its tip) | ordered steps as the 6 Nov item cards in their order (the order shown by their place, as chai's row), the old strip retired | shared |
| P24 | 17:49-17:55 | "I think it's the wrong use of the onion as well it's a crate of onions but it should be one onion" | daar (every game's cards) | js/cook/ui.js:2931 (an item card's picture is the shelf's picture first, Cook.shelfPic: the pantry crate) | an item card shows one of the thing (a card picture per item, never its crate or heap); SEK-24's tomato crate is the same cause | shared |
| P25 | 18:02-18:23; 18:44-18:50 | "it's just a million miles off ... we did so much we made like gap analysis and ... best practice documents and everything maybe I'm over prescribing maybe you need just to use your wisdom to understand and to tell me how best to make this work because clearly me coming up with all these ideas is not working"; "at what point can you just use your judgment like any human being would look at the tea game and be like this daar game is not the same style" | daar (every game) | not code: a principle for Zafar (Fable's report: no check or judge compared any game with chai) | Q6 | - |
| P26 | 18:30-18:41 | "Nani's order card should be for chopping should be the correct item card and then after chopping there's a pop-up and the pop-up is just wrong it's the old style" | daar, chop to tadka | js/cook/stations/daar.js:408-409 (the tadka's order pops through UI.mission.request, js/cook/ui.js:3850-3856); its rows are the ordered spices, drawn by the old group path (js/shared/order-card.js:558-563; the big card never takes the 6 Nov path, :559 `!opts.big`) | the chop's order card and the tadka's pop-up as chai's (the 6 Nov big card) | shared (the card), game (daar's flow) |
| P27 | 18:55-19:05 | "certain elements which don't look the same the oil pan ... is not top down it needs to be top down we need a new art one for that ... we might be doing a new art one" | daar | not code: art (the tadka pan) | the oil pan exactly top-down in the next art run | art |
| P28 | 19:05-19:11 | "even the bottom thing that the bottom items they're not on a shelf like tea's you've just not copied anything over" | daar (every game) | js/cook/stations/daar.js:564-569 (its shelf is a code-drawn grey plank under the jars, not chai's stone band and ledge, `St.stoneBand`); the kitchen kit has no scene call a game must use (Fable's report, "What went wrong" 1) | every kitchen game's items on chai's shelf (band, ledge, pills): Fable's `Kit.scene` round | kitchen kit |
| P29 | 19:26-19:57 | "stir is just the daar thing ... it's not the same as the stir in daar like it is a different speedo it's a different style different art different zoom ... it's different completely you might just drop that game in half basically which is two completely different screens" | stir, daar | js/cook/stations/daar.js:1242-1330 and :19-36 (daar's own stir and its code-drawn dial) beside js/cook/mechanics/stir.js:1-36 (the stir game's dial, pot and zoom) | one stir in the kitchen kit (mechanics/stir.js): daar calls it, the stir game is that same screen | kitchen kit |
| P30 | 20:03-20:09 | "the onboarding for chaat ... Nani only has a drop down but the onboarding is ... there's no dark shadows or anything like that highlight box" | chaat | js/cook/mechanics/assemble.js:912 (the kit's coach is stopped: "this station's own first-time demo replaces the generic spotlight") and :1295-1330 (its own ghost finger with no dim and no box) | chaat's first time on the kit's lights (the dim and the lit box on each next thing) | shared lights, game |
| P31 | 20:24-20:36 | "it's been a while no voice noting to you and the hint is not kicked in even though I'm a new player ... eventually there's meant to be a hint that kicks in to tell me to press the next item that's not happened" | chaat (every game) | js/cook/coach.js:609 (C.rungs, the stuck help) is called only by js/cook/stations/chai-tray.js; chaat's next layer is said once (assemble.js:1348) and nothing comes after the wait | SH-228 in every game: stuck past the level's wait, the help comes | shared |
| P32 | 20:40-20:48 | "then immediately after I put in the potatoes I was told to put in the chillies which is incorrect I don't believe" | chaat | js/cook/mechanics/assemble.js:1348 (the call names `C.next(got)`, the order's sequence after the qty expansion at :901); the order he heard not in the log: to replay | the call after each layer is the order's next layer as said; replayed with his order | game |
| P33 | 20:52-21:14 | "I don't know about the look and feel of this one I do wonder if it should be like tea like it should be a bowl ... on like a counter it might make more sense might look better ... maybe we'll get ChatGPT to have a go how all of these could look" | chaat (every game's look) | not code: Zafar and art (CHT-13's side-on bowl is waiting on art) | his ChatGPT run: how each kitchen game could look in chai's kitchen (chaat's bowl on the counter), before the scene round | art |
| P34 | 21:23-21:28 | "there was no onboarding for the samosas especially when it came to placing them into the frying pan nothing told me or showed me how to place them into the frying pan" | samosa, the fry | js/cook/stations/samosa.js:190 (the fry's coach, once ever: js/cook/coach.js:682); data/cook.json:6527 (its two steps, spent on the knob, samosa.js:1144, and the first samosa); no first-time lights for the fry (samosa.js:506 is the fill's gate) | the fry's first time on the kit's lights: each samosa into the pan, then the lift on the green | game on the shared lights |
| P35 | 21:34-21:42 | "the samosa game just needs a lot of work logically I mean the item card was a mess" | samosa | js/shared/order-card.js:565-566 (a kind of several, samosa's "trae samosa", is the old box with its count row and filling pills, never the 6 Nov cards); js/cook/ui.js:1552 (the 6 Nov type off) | samosa's order on the 6 Nov item cards (one card per samosa or filling, as P13) | shared |
| P36 | 21:48-22:04; 22:13-22:53 | "the fact that there's six ... pastries rectangles doesn't work well the folding animation doesn't work well"; "I need a bigger think on it ... I wonder if we just go back to one roll ... we have added in a lot of guidance and taken away some of the areas for people to get things wrong and I think maybe that's fine it makes the game a little bit easier but it brings the focus onto the language more ... you put the items in it rolls up it doesn't let you put the item in if it's the wrong one you can only do the number of items that it tells you to do once you've done it it moves on ... in the folding animation we need to figure out a way around it" | samosa | not code: Zafar (a redesign: SAM-25's six strips, SAM-21's fold) | Q4 | - |
| P37 | 23:05-23:21 | "the highlight onboarding circle ... that goes around the pan it doesn't go around the pan it's half on the handle ... way too small and it's off-centered like how can that pass ... please explain it to me" | eggs | js/cook/stations/eggs.js:295 (the next vessel's light on the pan's whole picture, handle included, :119-120 its origin at the round body); js/cook/coach.js:442 (`round: true`: a circle from that box's centre and size) | the pan's light round its round body only (eggs' settings body cx, cy, rIn), centred on it, the handle left out | game, shared light |
| P38 | 23:32-24:04 | "the ordering logic needs checking ... the order ... says I want egg and then the item says one fried egg I think the order should say ... I want two fried eggs and then ... there should be two item cards and they should both say fried egg that way you can get rid of the need for it to say one as well in the item card" | eggs | data/cook.json:748 (the headline "order" names n.egg alone) and :753 (each person's row "{n} fried egg" on one card) | the order "I want two fried eggs"; one item card per egg, each "fried egg", no number on a card (the engine's words; a gap reported if it can't say it) | game (eggs' order data) |
| P39 | 24:04-24:14 | "there's a bit of a logic principle thing here we probably should establish rather than doing this one by one for each of the games maybe you can help me establish it actually no do help me establish it"; "it's miles off just it's absolute disaster class" | every game's orders | not code: a principle for Zafar (with P1) | Q1 | - |
| P40 | 24:14-24:28 | "corn isn't completely terrible but the timer on it is the green zone is way too short ... there must be a rule around how long the green zone is to hit if there's not make a rule around the green zone needs to be longer" | corn | data/stations/corn.json:189 (`lo` 0.9: the green is the side's last tenth) and :45-55 (a side 2.6-3.2 s), so the band lasts 0.26-0.32 s; js/cook/stations/corn.js:310 | corn's green band longer (its own settings); the rule is Q5 | game |
| P41 | 7:40-8:04 (also said) | "I think it overall looks and works how it's meant to I mean there's some bugs ... broadly speaking ... it's on the right framework" | maani | not code: liked (kept) | no row: maani's frame kept while its points are fixed | - |

Also said: "the silver dishes ... they're fine" (2:12, maani's plates); "corn isn't completely terrible" (24:14).

## Questions and principles (for the orchestrator to put to Zafar; no rows)

1. **The counting principle, every game (P1, P39; his "do help me establish it"). It overturns an earlier rule (a single item said
   without "one"); his maani call at 0:52 ("keep it for now") was provisional, pending this principle.** The spoken order and its headline carry the number
   ("I want two fried eggs"); the order card holds one item card per thing, each naming the thing alone (two "fried egg" cards, four
   "gos" cards on a skewer), so no card says "one"; the he/she forms of one are still heard in the sentences. **Recommend yes, for every
   game; the per-game rows (P18, P38, P13) then follow it.**
2. **Sekelo: one skewer per person (P21).** Levels then grow by people (1-4), not by skewers each (SEK-22 today). **Recommend yes.**
3. **A count in the pop-up (P22).** "First chicken, then three pieces of lamb": his first option, a copy of the pop-up card shrinks into
   the order card once per piece and the pop-up itself goes with the last; or it splits into three. **Recommend the first, as the shared
   pop-up's way for any count in every game (one move per card, each landing in its own card).**
4. **Samosa (P36).** Back to one strip, guided: a wrong filling is refused, only the asked number goes in, it rolls up and moves on by
   itself; the six strips (SAM-25) and the swipe fold (SAM-21) rethought. **Recommend yes in principle, by the fast lane (a mock-up and a
   lab page, his numbered choices) after the kitchen scene round; nothing removed until he picks.**
5. **A minimum green zone (P40).** He asks for a rule that the green is long enough to hit; this week's decision was no shared timing
   rule (timings per game). **Recommend: a floor in the shared rules (a shortest green per level, every timed control), each game's own
   timings above it; the floor set from chai's green, which he plays happily, and measured in each game.**
6. **Judgement (P25, P37 "how can that pass ... please explain it to me").** The answer he asked for (the orchestrator, 8 Nov): the eggs
   pan's light passed because no check asks whether a light is centred on its thing and whole round it (contract-92 asks only that it
   does not cover a neighbour), the judge's batches never asked it, and the orchestrator merged on "0 breaks" without looking beside
   chai (`build/reports/s18-review-and-direction.md` section 2). Every game must look like chai on sight; the orchestrator and the judge compare each
   game beside chai's frame before anything reaches him, and his ideas are improved, not waited for. **Recommend yes: Fable's side-by-side
   check (`sidebyside.mjs`) as the gate for every kitchen game.**
7. **The hop rule's wording (P8, his "maybe I should tighten that rule").** "Only things on the shelf (the bottom bar) hop when lit; pans,
   boards and things in play never." **Recommend yes (SH-237 is drafted that way).**

## Second reader

Fable read the transcript and the drafted rows only (`build/reports/s18-feedback-1108-second-reader.md`): 4 missing, 2 weakened.
Two "missing" were artefacts of a cut-off questions file (judgement and the hop rule are questions 6 and 7). Fixed: the answer to
"how can that pass" (question 6), samosa's X button (SH-238), the "one" rule's history (question 1), the rolling board in SH-230.
Both readers: 0 unmapped, 0 weakened after the fixes.

## 3. Rows

Levels: maani at L1 (said); the other games' levels not said (his first plays: L1 is the likeliest). Every row checks L1-L4 of each
station it touches.

| ID | Point |
|---|---|
| SH-227 (told before, reopened) | P2 |
| SH-230 (told before, reopened) | P3 |
| SH-119 (told before, reopened from the archive) | P4 |
| MAA-20 | P5 |
| SH-236 | P6 |
| MAA-21 | P7 |
| SH-237 | P8 |
| MAA-22 | P9 |
| MAA-19 (told before) | P10 |
| SH-238 | P11 |
| ART-61 | P12 |
| SH-239 | P13 |
| ART-62 | P14 |
| SEK-18 (told before) | P15 |
| SH-240 | P16 |
| SH-149 (told before, reopened) | P17 |
| SEK-25 | P18 |
| LNG-24 | P19 |
| PRC-12 | P20 |
| SH-241 | P23 |
| SH-242 | P24 |
| DAAR-44 | P26 |
| ART-63 | P27 |
| SH-243 | P28 |
| DAAR-45 | P29 |
| CHT-18 | P30 |
| SH-228 (told before, reopened) | P31 |
| CHT-19 | P32 |
| ART-64 | P33 |
| SAM-30 | P34 |
| SAM-31 | P35 |
| CK-63 | P37 |
| CK-64 | P38 |
| CK-65 | P40 |

Questions, no row: P1, P21, P22, P25, P36, P39 (Q1-Q7). Liked: P41.

## 4. Coverage

| Lines | Point |
|---|---|
| 0:00-0:57 | P1 |
| 1:02-2:10 | P2 |
| 2:12 | chatter (also said: the silver dishes are fine) |
| 2:15-2:49 | P3 |
| 2:58-3:02 | P4 |
| 3:07-3:19 | P5 |
| 3:28-4:03 | P6 |
| 4:09-4:30 | P7 |
| 4:35-4:57 | P8 |
| 5:00-5:23 | P9 |
| 5:28 | P10 |
| 5:38-5:59 | P11 |
| 6:07-6:10 | P12 |
| 6:16-7:24 | P13 |
| 7:29-7:34 | chatter |
| 7:40-8:04 | P41 |
| 8:07-8:27 | P14 |
| 8:32-8:37 | chatter |
| 8:43-8:51 | P18 |
| 8:59-9:04 | chatter |
| 9:14 | P15 |
| 9:19-9:43 | P16 |
| 9:47-9:53 | P17 |
| 9:56-11:22 | P18 |
| 11:28-13:27 | P19 |
| 13:36-13:53 | P20 |
| 13:54-14:05 | P18 |
| 14:10-14:16 | chatter |
| 14:20-14:38 | P21 |
| 14:47-16:39 | P22 |
| 16:45 | P2 |
| 16:48-16:55 | P17 |
| 16:59-17:39 | P23 |
| 17:46 | P2 |
| 17:49 | P17 |
| 17:55 | P24 |
| 18:02-18:23 | P25 |
| 18:30-18:41 | P26 |
| 18:44-18:50 | P25 |
| 18:55-19:00 | P27 |
| 19:05-19:11 | P28 |
| 19:26-19:57 | P29 |
| 20:03-20:09 | P30 |
| 20:14-20:20 | P23 |
| 20:24-20:36 | P31 |
| 20:40-20:48 | P32 |
| 20:52-21:14 | P33 |
| 21:18 | P11 |
| 21:23-21:28 | P34 |
| 21:34-21:42 | P35 |
| 21:48-21:55 | P36 |
| 22:04-22:08 | P11 |
| 22:13-22:53 | P36 |
| 23:00-23:05 | P3 |
| 23:11-23:21 | P37 |
| 23:32-23:59 | P38 |
| 24:04-24:10 | P39 |
| 24:14-24:28 | P40 |
| 24:33 | chatter |

Lines: 239; in a point 229; chatter 10; unmapped 0.

**Readers.** First reader: the feedback builder (this report): 239 lines, 0 unmapped, the gate (`feedback.mjs --check`) green. Second
reader (skill step 5b): **not run yet** (this builder had no tool to start a Fable agent); see §6.

## 5. Told before (why it slipped)

| Row | Earlier | Why it slipped |
|---|---|---|
| SH-227 | 6 Nov: "It needs work ... the Kachi and English just sit too close together" | built on chai only; the roll-out switch (`UI.TYPE_ALL`, ui.js:243) was never turned on, and Sprint 18 moved the games onto the kits' calls, not the card's look |
| SH-230 | 6 Nov night: "a general rule that works in all cases that leaves some padding around the object+pill" | fixed in chai's shelf box; the kit's first-time box (coach.js:103) and eggs' control box (eggs.js:299) still hug the picture alone: a one-game fix |
| SH-119 | 22 Oct: "a consistent finger pointer across all the game modes" | marked built by the s12 judge's frames; the mechanics kept their own ghosts (roll.js:267, maani-line.js:380) beside the kit's |
| SH-149 | 27 Oct: the helper card (the arrow) | built in chai; other games get it only when their step names an order-row word (station-lib.js:443-452), which sekelo's pieces and daar's chop never do |
| SH-228 | 6 Nov: "remove the bulbs ... they will be replaced by chai's method" | built on chai; "each game joins at the roll-out" never happened (only chai-tray.js calls C.rungs) |
| MAA-19 | 29-30 Oct: "the tawa flip's first-time hold in the green" | open since 30 Oct; Sprint 18 moved maani onto the kits' calls without it |
| SEK-18 | 17 Oct: "I'm not getting any instructions from Nani" | waiting on Mum's "thread them" line; the English placeholder still shows |

## 6. The second reader

**Not run.** The builder that wrote this report had no Agent tool, so no fresh Fable agent read the transcript and the rows. Owed by the
orchestrator before the rows count as checked: give a fresh Fable agent only `docs/feedback/kitchen-play-2026-11-08-transcript.md` and the
rows named in §3 (from `docs/process/regressions.md`), ask for every point MISSING or WEAKENED, fix each, and record the result here.

**Stand-in (not a substitute): the builder's own adversarial re-read**, line by line against the rows, found and fixed two weakenings
before the rows landed: (1) SH-119 carried only "two fingers"; it now also carries "I think it looks terrible" and his finger-or-circle
pick; (2) SH-237's rule is his "maybe": the row is drafted his way and the wording is Q7 to confirm. Points it checked stay whole:
"well done ... and then the game ends" (SH-239), "it's not a good game mechanic" (SH-238), "otherwise you have to put four on before you
even know" (SEK-25), "how can that pass" (CK-63 and Q6), the "next button ... we can't you have an X button" (SH-238). 0 missing,
0 weakened after the fixes, pending the Fable reader.
