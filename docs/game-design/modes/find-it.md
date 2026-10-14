# Find it: design (the next mode after Cook with Nani)

**Where this stands (5 Oct 2026).** Find it is a focus mode and the next to move onto the shared core, host and language engine (decision 38). The 25 Sept slice (`find.html`, `js/find/`, `data/find.json`) still runs on its own engine. Read the scoring in this design as the three badges (time, accuracy, hints; H5) plus the speaking bonus in pocket money (decision 2); read "Arc 1–5" and the story homes against the live arcs (the Birthday, day-out trips, the clinic, Making clothes with Big Ma, Monsoon, Who did it; H36–H39); coins and pocket money follow decision 10. Hands are parked (H13); no written English for the child (E1; the `[EN: …]` markers are placeholders for grown-ups' text, to be replaced by Kutchi flagged "to record"). Mum's clips supply the words; the engine builds the lines (G9).

**Date:** 24 Sept 2026
**Status:** proposal for Zafar. **25 Sept: first playable slice on its own branch, for Zafar's review** (not live): `find.html` + `js/find/` + `data/find.json`, the engine (rows as data, relations as data, levels as data, the Search lab with the non-speaker bot) and M1 Nani's list with M5 Check the bag, in the bazaar with placeholder art. **Later on 25 Sept it moved onto Cook's calm sidebar (Wave 5A):** Nani's list comes up big as the intro card and flies into the sidebar; one row and one dot per thing; the goal behind "?"; Nani says less (new words are still taught with the twinkle); the result card is the word review; no coin/star counter (pocket money on the title and result card); the combo rises from the basket; Done and the rail (with zoom) are pinned to the sidebar's foot so zoom never falls off a phone. Tests: `build/archive/test_find.py` (play) and `build/archive/test_find.py --leak N` (the bot). It builds on `docs/archive/design-v1/game-modes-v2.md` (mode 2, *Find it*), `docs/archive/cook/cook-with-nani-phase-a-design.md` (the shared systems and the station library) and `docs/archive/cook/cook-with-nani-kutchi-audit.md` (the leaks).
**Placeholder rule:** Kutchi below is limited to words and frames already in `data/content.json` or `data/cook.json`. Anything written like `[EN: under]` has no Kutchi yet. In the game it is an English placeholder in grey italic until the family gives the word. **Never invent Kutchi.**
**25 Sept, later:** the deep dive (mini-games, one-file mechanics, speaking moments, a build brief at the end) **supersedes sections 3, 5.4 and 7 where they conflict**; D9 lists the patches.
**25 Sept, evening:** the **pipeline design** at the top (stages in a fixed order, each stage a set of mini-games, stitched into one errand with a beginning and an end) **supersedes the deep dive's D5 first set, D6 and section 8 where they conflict**; P9 lists the patches. Phases 0–1 of the deep dive's brief are built on `claude/build-find` (see P6); this section is written against that build.
**25 Sept, late (26 Sept):** the **mini-game quality pass** at the very top answers Zafar's five questions for every mini-game in the pipeline, cuts the library from 21 twists to 10, merges or drops the variants that another mode already has, and applies the late rules (consistent controls inside a mini-game, auto-tick, no mid-round verdicts, the card is the master). **It supersedes P2, P3 and P8 where they conflict**; Q8 lists the patches, and P8 is edited in place.

---

## Mini-game quality pass, 25 Sept 2026

**Why this section.** `docs/archive/mode-briefs/MINIGAME-QUALITY-BRIEF.md`: "the detail and success will all be in how these mini-games work: what do you need to do, where is the challenge, where is the fun, where is the instruction, what is novel." For each mini-game in the pipeline (P2) and each twist in the library (P3) this section answers those five questions, scores them 1–5 each, keeps the best (at most 6–8 per stage, 8–10 for the library), checks that nothing kept is the same as a mini-game in another mode unless it is deliberately shared, and walks through a level-1 errand stage by stage. Rules applied throughout (`docs/design-language/ux-principles.md` §11–§13): **consistent controls inside each mini-game** (the same kind of action always uses the same gesture, and a mini-game's gestures never change between its levels); **auto-tick** on the instruction card; **no negative feedback mid-round** from level 2 (mistakes show in the end review); **the card is the master, Nani is a voice**. Kutchi below is the family's only: *Muke {n} {x} khape*, *Ne {x}*, *{x} na*, *hakro / hakri*, *ba*, *trae*, *char*, *panj*, *wadho / nindho*, *pela … ne poi*, *{person} lai*, *pan*, *hi*, *khan*, *khanigin*, *Muke {x} de*, *ke*, *saathe*, *Haa*, the salaam, *Ghan*, *Khuda-fis*, "Thank you" (English), *Arre re!*, *Hedo!*, *Shabash!*, the fruit (*santra, limu, kelo, ambo*). `[EN: …]` is a placeholder, grey and English in the game.

### Q1 The rules, applied to Find it

**Controls: one convention for the whole mode.** In Find it a *thing* is always **tapped** (an item on the stall, a thing in the bag, a coin, a fruit for Nana, an openable, a stall front, a pill) and the *camera* is **dragged** to pan (with the rail's zoom buttons). That is already how the build works at every level, so the search (`spot`) needs no change. What did change, so that no mini-game mixes gestures for one kind of action or changes them by level:

| Mini-game | Was | Now | Why |
|---|---|---|---|
| **5c The scales** | Drag each orange from the basket onto the pan | **Tap** each orange in the basket; it hops onto the pan (Cook's `count`, whose units are tapped everywhere) | The scales sit beside the bag check, where things are tapped; one gesture for "move a thing" across stage 5 |
| **5d Pay** (later) | Drag coins to the counter | **Tap** a coin; it slides to the counter | Same reason |
| **6b Give one to Nana** | Drag from the bag to the person | **Tap the thing, tap the face** (the same two taps as Tidy up's *Seat the guests* and Snap's *Who wants which?*: a deliberately shared mechanic) | One gesture for "give" across the three modes that have it |
| **The torch** (L1) | The beam follows the finger | Unchanged: **drag** the beam, **tap** the thing under it. Two kinds of action, two gestures, the same at every level | Aiming a light and picking a thing are different actions, so the rule allows it |
| **2a Which stall?** | Taught at level 1, tested from level 2 | Unchanged: a **tap** on a front at every level; only what the front shows changes | Levels change the Kutchi, not the gesture |
| **4c Where is it?** at level 4 (qualified anchors) | Unchanged | A tap at every level | — |

**Auto-tick, and the count leak (decision for Zafar, Q8.1).** A row on Nani's list ticks the moment it is right. For a **noun row** that is the first find. For a **count row** (*ba santra*) a tick at the second orange tells a non-speaker exactly when to stop, which is the digit leak (D5.2) in another shape: the blind bot would tap one fruit until its row ticks. **Default:** a count row ticks on its **first** find (the noun is right; the count is judged at Done and in the review), and the tally beside the row (×2) stays what it is now, the child's own count. If Zafar prefers the tick at the count, the leak script gains a *tap-till-tick* strategy and we measure what it costs (the stage-4 ear would then rest on the bag and the scales).

**No mid-round verdicts.** From level 2 a wrong tap in the search is not wiggled or recast: **whatever you tap goes in the basket**, the row ticks only when the right thing is in, and the extras are what the shopkeeper trips over (5a) and what the accuracy badge shows (UX 9). Level 1 keeps its one-time wiggle and recast as onboarding. The "tapping everywhere" slow-down (three wrong things in two seconds) stays, since it is a pause, not a buzzer. The Warmer ("?") and the light bulb are the help; the recast lives on in the end review's word list (each missed row played again with what was tapped beside it).

**The card is the master.** The request card (Nani's list; the faces in 1b; Ali's picture list in 1d) shrinks into the left sidebar and is the only place the rows live. Nani is her recorded voice, the throbbing hint on the "?" button, and the interjections (*Arre re!* at level 1 only; *Shabash!*, *Ghan!* at a tick). She is on screen at the request card, the doorway call and the send-off, never in the stall.

### Q2 What's working now, and the mechanic borrowed from each

| Where | The mechanic | Why it works | Where it lands in Find it |
|---|---|---|---|
| **The hidden-cats wave on Steam** (*Cats Hidden Around the World*, *100 hidden cats*, *FIND KITTENS*, 2023–2025, all 94–97% positive) | One hand-drawn picture, one kind of thing to find, a counter that only counts up, no timer, no fail; a cat found *reacts* (a meow, a jump) | The pleasure is purely "found it!" plus a reaction; the picture is the level. Cheap art gets hundreds of hours of play | The rule that every find reacts with its own sound and hop (already the arc into the basket); *Kasuku's minute* and the free-play stall as "one picture, count up"; Zazu's peeking is this genre in one sprite (kept out for now, see Q5) |
| **Hidden Through Time 2** (2023–24) | A short **clue per item** that "gives the gist of where"; a **toggle that changes the scene** (day/night, rain) so some things are only findable in one state | Children of 6–8 play it on their own; the clue makes it fair; the toggle makes one scene two | The clue is Nani's sentence; the Warmer is "the gist of where" (a third of the scene); the **torch** is our scene toggle (L1) |
| **Good Pizza, Great Pizza** | Orders built from randomised parts; the **customer's comic reaction** to a wrong pizza is the feedback, not a buzzer; tips for a right one | The wrong-order reaction is funny enough to be a reward, so mistakes don't sting; the parts make a million orders | The shopkeeper's *Arre re!* and the wrong fruit in his hand (3b), Nani's puzzled empty hand (6a), Ali's shrug (1d): the miss is always a character's reaction. Rows from parts (noun × count × size × place) are `gen.js` |
| **Dr. Panda Supermarket / Baby Panda's Supermarket** | A **shopping list → aisles → weigh → pay → bag** sequence; items found by **opening counters and cupboards** | Five-year-olds already know the shape of a shop, so the fixed order is not a rule, it's the world | The seven stages; the scales (5c); openables as the ordinary way a stall hides things (4d, L2) |
| **Pok Pok Playroom** (Apple Design Award; new toys through 2025) | Hand-drawn, **calm**, every object reacts to a touch, nothing flashes to hold attention; no score in the toys | Calm holds a five-year-old longer than flash; reactions are the reward | Every scenery tap reacts (the awning, the bunting, the scale's dish); no confetti except at the tick; the *khanigin* tray (3a) is a Pok Pok moment: pick any one, it's yours |
| **Duolingo ABC** | A **repeat button** on every prompt; each word **highlights as it's spoken**; speech recognition for saying letters out loud, with the pills as the fallback | Listening support that never shows the answer; read-along makes the audio the text | The card's one speaker and the read-along (UX 1, 4); `tell` with its pills fallback (3b, 6a, 1d) |
| **Khan Academy Kids** | A balance of **closed multiple-choice recall** ("tap the one") and **open explore** | Recall makes it stick; explore keeps it a game | Rounds (closed: the rows) and Explore mode (open: tap anything, hear its name) |
| **Bluey Hide & Seek** (the talking toy) and **Peekaboo Barn** | The hidden thing **talks while you look**; opening a door plays the animal's sound whether or not it's the right one | Sound during the search keeps a small child looking; an empty door is still fun | Simba's bell and the cats' noises (4d, L3); empty openables react too (L2) |
| **Toca Life World** (and the lesson of **Toca Boca Days**, shut down Aug 2025) | Shops in sections; everything reacts; the character reacts to *whatever* you hand them. The multiplayer sandbox with no ending didn't last | The story is the child's; a shop is sections. An ending matters | Stalls by trade (2a); the bowl and the counter act on whatever was said; **every stage ends** (Done, *Ghan!*, *khanigin*), and the errand ends at home |
| **Overcooked / Cooking Mama** | Order tickets that expire; a chain of small gestures with the cook's reaction at the end | Tension from a visible clock; a verdict face at the end, never mid-step | Busy's patience ring (level 3+ only); the three badges at the end, not during |

### Q3 The five questions, mini-game by mini-game

Scores are **Do / Challenge / Fun / Instruction / Novel**, 1–5 each, total out of 25. *Do* is how much there is to do with your hands; *Challenge* how much the Kutchi decides and how well it ladders; *Instruction* how much of it is real Kutchi today. Gestures are listed in *Do*; none changes by level.

#### Stage 1 · The errand

| Mini-game | 1 What do you do? | 2 Where is the challenge? | 3 Where is the fun? | 4 Where is the instruction? | 5 What is novel? | Score | Keep? |
|---|---|---|---|---|---|---|---|
| **1a Nani's list** (built) | Listen. The card is over the play area: Nani's face, one row per thing (dot + text by word stage). Each chunk lights as she says it. Tap the card's one speaker to hear it again (the first replay free). Tap **Go** (right, under the thumb) and the card shrinks into the left sidebar | Holding two or three rows in your head across the whole errand. L1 one row; L2 two; L3 three, half the time with a *Nar* row; L4 a size or a position on a row. From level 3 the rows are dots (word stage 3) | The target twinkling on the stall as she says a stage-1 word (the tie between word and thing); the card flying into the sidebar | Card: *Muke hakro santra khape.* · *Ne ba limu.* · *Nar kelo.* Nani: the same, read along; *Hedo!* to start | Nothing on its own: it is the request card every mode has (UX 1), deliberately shared. It is the stage, not a twist | 3/3/3/5/2 = **16** | **Keep** (the baseline) |
| **1b Everyone wants something** | Two or three faces on the card; each says one row in turn and its row is tagged with that face. Tap a face to hear that person's row again. L4: one face changes its mind mid-card (*Nar santra … kelo*) and its row swaps live | Who wants what, not just what: the row can't be found without remembering the face for stage 6. L2 two people, one row each; L3 three; L4 a change of mind and *pan* (*Ma lai pan hakro*) | The change of mind: Nana shakes his head and the row re-writes itself; the faces nodding as their thing lands in the basket | Card: *Nana: Muke ba santra khape.* · *Big Ma: Ne hakro limu.* · *Ma lai pan hakro.* Nani reads each in that person's voice (recorded per family member) | Several askers on **one** card, and a row that changes while you watch. Snap's *Who wants which?* has owners at the hand-in; nobody else has the *asking* by several faces | 3/4/4/5/3 = **19** | **Keep** (L2+) |
| **1c Kasuku overheard** (F7) | (No card: Kasuku squawks five words; find them in 60 s) | — | — | — | Same as the library's *Kasuku's minute* (L14): it is a whole round, not a stage-1 variant | — | **Moved** to the library and free play |
| **1d You're Nani** (F4, built) | The card shows pictures, no words. Say each one (the mic; pills as fallback; a parent ✓). Ali repeats what he heard, runs to the stall and picks it while you watch (stages 2–4 as a 10-second scene). You rejoin at stage 5 to check his bag | Producing the noun, then the number (L2), then the size (L4), with the stall's kinds as the closed set (5–8) then 1–4. A wrong word is *acted on*: Ali brings the wrong fruit, and you must catch it in his bag | Ali's shrug and wrong fruit; his little run; catching him out at the bag | Card: pictures with one speaker per picture (hear the model). Ali: *Santra? Khuda-fis!* Nani (voice): *Shabash!* at a right say | The **flipped run**: the child speaks the list and then watches the consequence unfold across the pipeline before checking it. The clinic's *You call them*, Tidy up's *Ali fetches* and Snap's *Ali's camera* each flip one stage; only this flips the errand | 4/4/4/4/5 = **21** | **Keep** (L2+, Ch2) |

#### Stage 2 · Get there

| Mini-game | 1 Do | 2 Challenge | 3 Fun | 4 Instruction | 5 Novel | Score | Keep? |
|---|---|---|---|---|---|---|---|
| **2a Which stall?** | Four fronts on the lane. Tap the one Nani named; the camera zooms in. L1 taught: Ali runs ahead and waves, the front twinkles, a ghost finger shows the tap once. L4: two stops (*pela …, ne poi …*), tap them in order | L1 nothing (taught). L2 two fronts sell the same things (two fruit stalls), so only the place phrase decides (*[EN: the old man's]*, *[EN: by the tree]*, *Nana jo*). L3 four doors off the courtyard (rooms E49–E58). L4 a route of two, in order | The zoom-in through the awning; Ali waving; at L4 the camera swinging from one stall to the next with Nani's *ne poi* | Card: the place line under the rows: *[EN: the fruit stall]* · *pela [EN: the fruit stall], ne poi [EN: the sweet shop]*. Nani says it once; the front twinkles at L1 | A place decided **by whose or by where**, not by what it sells; the two-stop route. Snap's *Where to?* and *Which way?* reuse this tap (Snap says so); this is where it is *tested* (two of a kind). Deliberately shared with Snap | 2/3/3/4/3 = **15** | **Keep** |
| **2b Whose stall?** | Tap the right shopkeeper in the lane (*[EN: the old man]*, later *in red*); they walk you to their stall | Kind + colour | — | People words (F1–F13) | None: it is the clinic's waiting room (*Bring in the girl*, *The old man in red*) and Dress up's *Bring in…* on the same `whichone` decoy rule. Its "whose" survives inside 2a at L2 (*Nana jo* stall) | 2/3/3/3/1 = **12** | **Cut** (the clinic owns "tap the person named") |
| **2c The dark lane** | (The torch on the lane) | — | — | — | It is the torch modifier (library L1), which applies to any scene | — | **Moved** to the library |

#### Stage 3 · At the counter

| Mini-game | 1 Do | 2 Challenge | 3 Fun | 4 Instruction | 5 Novel | Score | Keep? |
|---|---|---|---|---|---|---|---|
| **3a The counter: salaam and *khanigin*** (built as `greet`; absorbs L21) | The shopkeeper greets; tap the reply pill (three pills; from L2 say it, closed set 3). Then he holds out a tray: *Ambo khanigin* ("take one yourself"): tap **any** one; it's yours, ungraded, and it drops in the basket as a gift. Then he waves at the stall (*khanigin* again: the rest is yours to find) and stage 4 starts | The reply (L1 choose, L2 say, L3 the second exchange, B43). The tray is a warm-up: the first tap in the stall is never wrong | The tray: whichever you tap, he beams and it's yours (a Pok Pok moment); the *khanigin* wave that hands you the stall | Card: the greeting pills (shared `greet`). Shopkeeper: *Salamun alaykum* … *Ambo khanigin!* … *khanigin*. Nani (voice): nothing; this is the shopkeeper's beat | The ungraded **gift tap** that teaches *khanigin / khan / hi* by doing (*hi ambo khan*), and the fiction's reason a customer shops alone. The salaam itself is Cook's `greet`, deliberately shared by every mode | 2/2/4/5/3 = **16** | **Keep** |
| **3b Ask for one** (speaking) | *[EN: What do you need?]* Say the first row (the noun; from L2 the count). He hands **exactly what he heard**: it drops in the basket and that row's tally reads 1 (or 2). If it's the wrong fruit, it's in his hand and in your basket: *Arre re!* at L1 with one retry; from L2 it simply lands and the review shows it. Then the pills if the mic gives nothing | Production with a closed set of the stall's kinds (4–8), then the numbers 1–4 (L3), then a size (L4). The Sceptic: pills never earn the speaking bonus | The fruit arriving in your basket because you *said* it; the shopkeeper's exaggerated ear-cupping while he listens | Card: the row throbs. Shopkeeper: *[EN: What do you need?]* Child: *Muke hakro santra khape* (the model plays on the row's speaker). Shopkeeper: *Hakro santra! Khuda-fis.* | **What you say pre-fills the next stage**: stage 4 starts with that row's tally already at 1, so speaking is seen to count. Tidy up's *What do you need?* and Snap's *What's this?* are single-stage says; none carries forward | 4/4/5/5/4 = **22** | **Keep** (L2+) |
| **3c The doorway** (home errands; Cook's `passme`) | At home there is no counter: as the search starts Nani calls from the doorway one thing that is **not** on the list (*Hedo! Muke hakro limu de*) and a row is added to the card | A met word off the list (spaced review); *de*. L2 once per errand; L4 twice | Nani's head round the door; the new row sliding onto the card | Card: the new row appears with its speaker. Nani: *Hedo! Muke hakro limu de.* | Nothing new: Cook's pass-me and Snap's *Quick shot* are the same interrupt, deliberately shared. It stays because the home skin needs a stage 3 and the fiction (Nani's second thought) is right | 2/3/3/5/2 = **15** | **Keep** (home skin, shared) |

#### Stage 4 · Find it

| Mini-game | 1 Do | 2 Challenge | 3 Fun | 4 Instruction | 5 Novel | Score | Keep? |
|---|---|---|---|---|---|---|---|
| **4a The list** (F1, built) | Drag to pan, tap the rail to zoom, **tap** each thing; it arcs into the basket with its sound and the tally rises; tap **Done** (right, under the thumb). L2+: everything you tap goes in (no wiggle); the row ticks when the right thing is in | Noun + count among look-alikes (santra / limu / peach) and copies. L1 one stall, ≤ 11 things, counts 1–2; L2 counts to 3, a size on one row; L3 a *Nar* row, counts to 4; L4 a size **and** a position, two stalls (pan). The Warmer keeps ≥ 3 candidates. Blind bot 1.7% (built) | The arc and the plink; the combo rising from the basket; the tick with *Shabash!*; the row twinkling on a new word | Card: the rows (*Muke ba santra khape. Ne hakro limu.*). Nani: replay on the speaker; *Shabash!* at a tick; nothing else in the stall | The **search itself**: a panned, zoomable scene with copies and clutter capped by level, Done, over- and under-collection graded. Tidy up's *Bring me the X* is the same tap on a floor of six with no search; it declares the `whichone` decoy rule shared with Find it, and Find it owns the scene | 4/4/4/5/3 = **20** | **Keep** (the bulk) |
| **4b Which one?** (F2, built; absorbs L10 Big Ma's box and L11 the cloth stall as skins) | As 4a, but every row carries *wadho / nindho* and every kind is out in both sizes | The size word alone decides: the same picture at 1.25× and 0.8×, both sizes on two or more kinds (the size rule). L1 two rows; L2 two groups; L3 a *Nar* row; L4 a position too. **Skins:** colour in Big Ma's box (E60–E71, Ch4), colour + pattern on the cloth stall (F63, age 11). Blind 0.1% | Simba is the big one, Zazu the small one (the running joke on the card's speaker); the tiny lemon next to the huge one | Card: *Muke wadho santra khape. Ne nindho limu.* Nani: the same | The **same picture at two scales**, both on the stall, so the adjective is the whole decision. Dress up, Snap and the clinic use `whichone` for attributes on *different* things; here the noun is fixed and only size (later colour) moves. Shared module, distinct game | 4/5/4/4/3 = **20** | **Keep** |
| **4c Where is it?** (F3, built as a greybox) | Calls one at a time (*santra, crate [EN: in]*); the called thing is in three places; tap the one she meant; the next call comes. Same gestures as 4a | Only the position separates the copies (matched by anchor *word*: two crates are both "the crate" until L4 qualifies them). L1 in / on, four calls; L2 in front of; L3 the sitting room: under, behind; L4 a size on each call. Not tested while the positions are English (blind 25%); 0.7% once they are Kutchi | The copy you tapped lifting out of the crate; the same orange called to two places in a row ("the other one!") | Card: the current call only (one row at a time, fixed shape). Nani: *santra, crate [EN: in]* (placeholder until A5) | **Positions found, not placed.** Tidy up tests positions by placing (its stage 3); the clinic's `where` is a body part. Nobody else has copies of one noun in three relations | 4/5/4/3/5 = **21** | **Keep** (Kutchi-real when A5 lands) |
| **4d Simba's mischief** (F5, phase 3) | The sweets are behind openables (curtain, cushion, lid, drawer); the call names the openable; tap to open; empty ones react too; a tail, a bell, paw prints point to a cat, not always to the sweet; from L4 Zazu moves one sweet once | Which openable, from *[EN: behind] {anchor}*; the clues can lie. L3 eight openables; L4 twelve and the move. Blind about 1 in 8 per call | The reveal under a cushion (Zazu asleep on a jalebi); the bell that leads to the wrong cat; the empty tiffin's rattle | Card: the call (*[EN: behind] {curtain}*). Nani: the call; the cats' noises are the rest | **Openables plus a clue that can lie.** Who did it?'s *Follow the prints* is a tap-in-order trail with no hiding; the clinic's `lift` lifts one named thing. The trail-to-a-cat is only here | 5/4/5/3/5 = **22** | **Keep** (Ch3 flagship, phase 3) |

Modifiers on any stage-4 variant (from the library, Q5): **the torch** (L1), **the other one** (L4), **find two the same** (L5), **Busy**.

#### Stage 5 · Hand over

| Mini-game | 1 Do | 2 Challenge | 3 Fun | 4 Instruction | 5 Novel | Score | Keep? |
|---|---|---|---|---|---|---|---|
| **5a Check the bag** (built; **absorbs 5b He reads it back**) | The stall dims; only the counter is live. He packs the list from the rows, lifting each thing and **naming it with its count** as it goes in (*ba santra … hakro limu*). One thing is wrong: **in his hands** (a look-alike, one too many, the wrong size) **or in his words** (he says *trae* holding two; he calls a lemon *santra*). **Tap the wrong thing** in the bag; he looks, says sorry, and swaps it or recounts. First ever round: no mistake, *Khuda-fis* | Remembering what was asked when the rows are dots (stage 3), and listening to him against what you see. L1 a look-alike swap, and he is always right in his words (the third hearing of the list); L2 a swap **or** a wrong count said; L3 the wrong size (held or said); L4 the wrong count, rows as dots. The Sceptic: a look-alike from the same group, never the odd one out; one in the bag's size (4–6) per guess | The shopkeeper's *Arre re, arre re!* and the swap; catching him say *trae* with two in his hand | Card: the rows, as dots or text by stage. Shopkeeper: *Ba santra … hakro limu … Ghan?* Child: taps. Shopkeeper: *Arre re! Hakro santra. Khuda-fis.* | The only place in any mode where the child **catches someone else's mistake**, and from L2 the mistake can be in what he **says**, not what he holds. The clinic's `handover` is the doctor catching the child (the reverse); Snap's *Nana's guess* is yes/no on one print. Merging 5b removed the yes/no pills, so stage 5 has one gesture: tap the thing | 3/4/4/4/5 = **20** | **Keep** |
| **5b He reads it back** | (Yes / no pills per line) | — | — | — | Merged into 5a (see above) | — | **Merged** |
| **5c The scales** | *[EN: put them on the scales]*: **tap** each orange in the basket; it hops onto the pan, which tips; the dial shows the running tally, never the target; tap **Done**. *Ghan!* if it matches; from L2 a wrong weight just gets *Khuda-fis* and the review | The count word, heard again after the search and acted on. L2 one row weighed; L3 two rows in the order he says (*pela santra, ne poi limu*); L4 he asks a **different** count from the list (*[EN: just] hakro [EN: this time]*), so the child can't reuse stage 4's memory | The pan bouncing under each orange; the dial needle swinging; the big *Ghan!* | Card: the row throbs; the order line at L3. Shopkeeper: *Pela santra, ne poi limu.* · *Ghan!* | A **weighing pan and a dial** (Dr. Panda's weigh step): the tally as a physical tip, and at L4 a count that *differs* from the list. No other mode weighs; Cook's `count` under it is shared | 3/3/4/4/3 = **17** | **Keep** (L2+) |
| **5d Pay** (Arc 2) | Tap coins to a spoken price; change from L3 | Numbers as money | The till's ding | Needs a currency word and prices (**new**, P7) | Counting coins to a heard number is Cook's count with coins | 3/3/3/2/3 = **14** | **Maybe later** (no Kutchi for it yet) |

#### Stage 6 · Home

| Mini-game | 1 Do | 2 Challenge | 3 Fun | 4 Instruction | 5 Novel | Score | Keep? |
|---|---|---|---|---|---|---|---|
| **6a The bowl** (built; speaking moment 1) | Nani's hands are full. **Say** what to put in the bowl; she takes that from the bag and drops it in; a wrong name and she holds up an empty hand, puzzled (or the wrong fruit); one retry, then the pills. Without a mic: she names, you tap (the listening recall) | Production with the **bag's kinds** as the closed set, padded to 3–8. L1 say one; L2 two; L4 three. The Sceptic: pills never earn the speaking bonus | Nani's puzzled empty hand; the fruit landing in the bowl in her hands because you said its name | Card: the bag's things as a row of pictures with a speaker each. Nani: *[EN: What goes in?]* … *Santra! Khuda-fis.* | Speaking with **what you actually bought** as the closed set: a wrong buy at stage 4 comes home as an empty hand here, so the pipeline's mistakes surface in the fiction. Every mode has a `tell`; only this one's set is the round's own output | 4/4/4/5/4 = **21** | **Keep** |
| **6b Give one to Nana** | Nani: *Nana lai hakro santra*. **Tap the thing** in the bag, **tap the face** on the sofa; it flies over. The rows from 1b go home to their owners (*Big Ma lai ba limu*); L3 *pan*; L4 a *Nar* | *{person} lai* + count + family names. L1 one person, one thing; L2 two people; L3 counts; L4 *pan* and *Nar* | Nana's delighted face; the wrong recipient holding up the fruit, puzzled | Card: the row with its face. Nani: *Nana lai hakro santra. Ma lai pan hakro.* | Nothing of its own: the same two taps as Tidy up's *Seat the guests*, Snap's *Who wants which?* and Who did it?'s *Share them out*, on Cook's *{person} lai* frame. **Deliberately shared** (one `giveto`); kept only as the close of 1b | 3/3/3/5/2 = **16** | **Keep** (when 1b ran; shared) |
| **6c Put it away** | The bag becomes Tidy up's tray | Tidy up's T1 | — | — | Tidy up's mini-game, not Find it's: a hand-over between modes | — | **Hand-over** (stays as such) |

#### Stage 7 · Send-off

One beat, no variants, on purpose: Nani's thanks ("Thank you" (English), *Ghan!*, *Khuda-fis*), the story beat if there is one, then the shared end-of-round screen (UX 9: the three badges, then the word review of exactly the words heard). Optional coda: tap Kasuku and he says a word back in the child's own voice (`shadow`, ungraded). Score 2/1/4/5/2: it is an ending, and endings are the same every time.

### Q4 The cut: what each stage keeps

Find it's stages were already lean (the bulk is stage 4 plus the library), so the cut here is merges and moves rather than a long "maybe later".

| Stage | Kept (score) | The novel thing | Cut, merged or moved |
|---|---|---|---|
| 1 The errand | **1a** Nani's list (16), **1b** Everyone wants something (19), **1d** You're Nani (21) | 1a the shared request card; 1b several askers and a live change of mind; 1d the flipped errand | 1c → the library (L14 *Kasuku's minute*) |
| 2 Get there | **2a** Which stall? (15) | A place decided by whose or where, and the two-stop route | **2b cut** (the clinic's waiting room; "whose" lives in 2a L2); 2c → the torch (L1) |
| 3 The counter | **3a** Salaam and *khanigin* (16), **3b** Ask for one (22), **3c** The doorway (15, home skin, shared) | 3a the ungraded gift tap; 3b what you say pre-fills the tally; 3c Cook's pass-me, shared | L21 *Pick your own* folded into 3a |
| 4 Find it | **4a** The list (20), **4b** Which one? (20), **4c** Where is it? (21), **4d** Simba's mischief (22) | 4a the search; 4b one picture at two scales; 4c positions found; 4d openables and a lying clue | L10 Big Ma's box and L11 the cloth stall folded into 4b as skins |
| 5 Hand over | **5a** Check the bag, with his words (20), **5c** The scales (17) | 5a catching someone else's mistake, held or said; 5c a pan and a dial | **5b merged** into 5a (its yes/no pills go); 5d Pay → maybe later |
| 6 Home | **6a** The bowl (21), **6b** Give one to Nana (16, shared) | 6a the bag as the closed set; 6b Cook's *lai* frame on the shared give-to taps | 6c is Tidy up's (a hand-over) |
| 7 Send-off | the one beat | — | — |

Fourteen mini-games across seven stages, plus the library's ten twists.

### Q5 The library, cut from 21 twists to 10

Five-question scores added to P3's fun / Kutchi / build. Kept: the ten with the highest totals that are not the same as something elsewhere; merged twists are folded into the one that survives.

| # | Twist | Do / Chal / Fun / Instr / Novel | Total | Decision |
|---|---|---|---|---|
| L1 | **The torch** (drag the beam, tap the thing; the position phrase saves the battery) | 4/4/5/3/5 | 21 | **Keep**: our scene toggle (Hidden Through Time 2's day/night); absorbs 2c |
| L2 | **Openables** (+ **L16 Lift the layer**: a cloth over the counter or a stacked crate is an openable too) | 4/5/5/3/5 | 22 | **Keep**: the ordinary way a stall hides things (Baby Panda's counters) |
| L3 | **The cats' trail** (+ **L18 The crow**, Arc 4: the same trail to a bird on the wall) | 3/4/5/3/5 | 20 | **Keep**: the clue that can lie |
| L4 | **The other one** (*Hi na … [EN: the other one]* after a wrong copy) | 2/5/3/3/4 | 17 | **Keep**: the cheapest new Kutchi test on built mechanics |
| L5 | **Find two the same** (*ba [EN: the same]* among near-misses; Hidden City's "find 2") | 3/4/4/3/4 | 18 | **Keep** |
| L6 | **The scales** (= 5c) | 3/3/4/4/3 | 17 | **Keep** (it is 5c; listed once) |
| L9 | **The sweet tray** (mithai by name from look-alikes; the box has fixed cells, Tidy up's `pack`) | 4/5/5/3/4 | 21 | **Keep**: the Ch3 set, once E59 lands |
| L14 | **Kasuku's minute** (five weakest words, no text, 60 s; the hub daily; the hidden-cats "one picture, count up") | 3/5/3/5/4 | 20 | **Keep**: the mode's daily |
| L17 | **The chicks** (moving targets: the position is true only for a moment) | 4/4/5/3/5 | 21 | **Keep** (Arc 3; needs the courtyard and G27–G40) |
| L20 | **Tell Ali where** (you see the cap under the sofa; you say *sofa [EN: under]*; Ali looks there) | 3/5/5/3/5 | 21 | **Keep**: the only production of a position phrase anywhere |

**Maybe later** (one line each): **L7 Pay**: coins to a spoken price, when a currency word and prices exist (Arc 2). **L8 He reads it back**: merged into 5a. **L10 Big Ma's box** and **L11 The cloth stall**: skins of 4b, not games. **L12 Spot the change**: Who did it? owns "what happened" (Arc 4 at the earliest). **L13 Nani's day**: three grades of every scene for one time-of-day word (art budget). **L15 Zazu peeking**: a sharp-eye collectible with no Kutchi; UX 6 says cut what isn't the lesson, and it can return as a free-play sticker. **L19 Bazaar run**: it is 2a at L4. **L21 Pick your own**: folded into 3a. **Rejected, still:** silhouettes, fixed positions, recharging hints, bargaining, *Photo*, *Who has it?*.

**Build order for the ten:** L4, L5 (cheap, on `spot`, Kutchi-real today); L1 (a CSS mask); L2, L3, L9 (the Ch3 set, after E59 and A5); L20 (after A5); L17 (Arc 3); L14 when the hub daily rotates.

### Q6 Distinctness across modes

Read against the "Pipeline design" sections of the clinic, Tidy up, Who did it?, Dress up, Snap and Monsoon rush.

| Find it mini-game | Looks like | Verdict |
|---|---|---|
| 1a Nani's list | Every mode's request card | Deliberately shared (UX 1) |
| 1b Everyone wants something | Snap 5b *Who wants which?* (owners at the hand-in) | Distinct: the asking by several faces, the change of mind; the *give* end (6b) is the shared part |
| 1d You're Nani | Clinic W3, Tidy 1d/3d, Snap 3d, Dress up 5c (one stage flipped) | Distinct: the whole errand flipped and watched |
| 2a Which stall? | Snap 2a *Where to?* ("Find it's tap-the-one", Snap's own words) | Deliberately shared; tested here (two of a kind), taught there |
| 2b Whose stall? | Clinic W1/W2, Dress up 1a | **Cut**: the same game |
| 3a Salaam | Cook's `greet`, every mode | Deliberately shared; the *khanigin* tray is Find it's |
| 3b Ask for one | Tidy 1c *What do you need?* (*Muke {x} de*), Snap 5c | Distinct: acted on by a shopkeeper and carried into the next stage's tally |
| 3c The doorway | Cook's pass-me, Snap 3e *Quick shot* | Deliberately shared (`passme`) |
| 4a The list | Tidy 1a *Bring me the X* (tap the named thing among look-alikes into the tray) | Shared decoy rule (`whichone`, declared by Tidy up); Find it owns the search: pan, zoom, copies, counts, Done, the Warmer. Tidy's floor never exceeds 8 things and has no copies |
| 4b Which one? | Dress up 3c bolts (colour + pattern), clinic W2, Snap 3b *The big one* | Shared module; distinct game (one noun, two scales, both on the stall). Snap's is the size as a *subject to frame*, not to pick among copies |
| 4c Where is it? | Tidy 3a *Put it there* (place by position), clinic D2 (a body part) | Distinct: found, not placed; not a body |
| 4d Simba's mischief | Who did it? 2c *Follow the prints* (`trail`), clinic `lift`, Who 5c R8 the cushion | Distinct: openables that hide and a clue that lies; Who's trail is tap-in-order. The `trail` name is shared; the rule differs (theirs graded on order, ours a pointer). Name ours `clue` if the foundation shares `trail` |
| 5a Check the bag (with his words) | Clinic `handover` (the doctor names what's there and sends the wrong one back), Snap 5d *Nana's guess* (yes/no on a print), clinic D1b yes/no | Distinct: the child corrects the character. The clinic's is the reverse. The yes/no pills are gone with 5b |
| 5c The scales | Cook `count`, clinic belt counts, Monsoon drip count | Shared `count`; the pan and dial are Find it's; no other mode weighs |
| 6a The bowl | Every mode's `tell` | Distinct closed set (the bag's kinds) |
| 6b Give one to Nana | Tidy 5a *Seat the guests*, Snap 5b, Who 5c *Share them out* | **Deliberately shared**: one `giveto` (tap the thing, tap the face) on Cook's *{person} lai*; Find it reuses whichever mode builds it first |
| The torch | Monsoon S3f *The power cut* (shared `dark`) | Shared mask; the beam and battery are Find it's |
| Kasuku's minute | The hub daily of every mode | Find it's entry, by design |

### Q7 A level-1 errand, stage by stage (the first set: 1a, 2a, 3a, 4a, 5a, 6a, 7)

This is round three or four for a new player (the first ever round is P5's ninety seconds: one row, no bag mistake, no sidebar until round two). Level 1 means one stall, one or two rows, counts of one or two, the stall with at most eleven things, the built bazaar with placeholder art.

**Stage 1 · Nani's list.** The bazaar lane is behind a dim; over it the request card: Nani's face top-left, two rows with a speaker each and one dot per row, a big **Go** button bottom-right. Nani says *Muke ba santra khape* and the first row's chunks light as she says them (*Muke* … *ba santra* … *khape*); the oranges on the far stall twinkle once because *santra* is still a stage-1 word. *Ne hakro limu*; the second row lights; the lemons twinkle. The child taps the row's speaker once (free) and hears *ba santra* again. Tap **Go**: the card shrinks and flies into the left sidebar, where the two rows sit with their dots. The fun: the twinkle answering the voice. Nothing ticks yet. The end: the lane comes up in colour.

**Stage 2 · Which stall?** Four grey fronts along the lane, fruit painted on one awning, vegetables on another, sweets, cloth. Ali runs ahead to the fruit stall and waves. Nani's voice: *[EN: the fruit stall]* (grey italic on the card's place line) and that front twinkles; the first time, a ghost finger taps it once and fades. The child taps the front: the camera zooms in through the awning to the counter and the shopkeeper. Taught, not tested (no ear from this at level 1). The fun: the zoom. The place line on the card ticks. About five seconds.

**Stage 3 · Salaam and khanigin.** The shopkeeper folds his hands: *Salamun alaykum*. Three reply pills at the bottom right; the ghost finger rests on *Wa alaikum salaam* the first time only. Tap it; he beams. He holds out a small tray of three mangoes: *Ambo khanigin!* The child taps any one; it drops into the basket with a plink and the tally in the top-right shows 🥭 1 (no row for it: a gift). He waves at the stall: *khanigin*. The fun: whichever mango, it was the right one. The greeting line on the card ticks. The stall comes live.

**Stage 4 · The list.** The stall at eye level, a screen and a half wide: oranges in a crate and on the counter, lemons in a basket, peaches and a few tomatoes as look-alikes, eleven things. On a phone it opens zoomed 1.5×; drag to pan, the rail's + / − to zoom; the sidebar holds the two rows and the "?" light bulb hasn't appeared yet. The child taps an orange: it arcs into the basket, plink, the tally reads 🍊 1 and the first row's tally ×1. A second orange: ×2 and the row **ticks** (level 1: the tick at the count, before Zafar decides Q8.1) with Nani's *Shabash!* The child taps a peach by mistake: at level 1 it wiggles, *Arre re! [EN: peach]… hakro limu*, and nothing goes in (the one-time correction). A lemon: the second row ticks. Both rows ticked, **Done** glows for the first three rounds only; the child taps it. The fun: the arc, the plink, the combo rising from the basket. The end: the stall dims and the counter lights.

**Stage 5 · Check the bag.** The shopkeeper packs from the rows, naming each as it goes in: *ba santra* (two oranges drop in) … *hakro limu* (a peach drops in: the level-1 look-alike swap; he says the right word and holds the wrong thing). The bag is a fixed-shape card of three cells under his hands, the mango from stage 3 already in the first. He asks *Ghan?* The child taps the peach: *Arre re, arre re!* He swaps it for a lemon: *Hakro limu. Khuda-fis.* (If the child taps an orange, at level 1 he shakes his head once and says the list again; from level 2 he hands over the bag as it is and the review shows it.) The fun: catching him. The rows on the card are already ticked; the bag cell fills green. The end: he hands over the bag; Ali carries it home; the lane scrolls.

**Stage 6 · The bowl.** Nani's kitchen, the bowl on the island, Nani with her hands in the dough. The bag's three kinds appear on the card as pictures with a speaker each (mango, orange, lemon), and the mic button glows on the right. Nani: *[EN: What goes in?]* The child says *santra* (the lab's picker; a parent's ✓ in Grandparent mode); Nani lifts an orange from the bag and drops it in the bowl. Say *limu*: the lemon. A wrong word (*kelo*, which isn't in the bag) and she holds up an empty hand, puzzled, and asks again; after one retry the pills appear. Without a mic the pills are live from the start. The fun: Nani doing what you said with her hands full. Each picture ticks as it lands. The end: the bowl is full; *Ghan!*

**Stage 7 · Send-off.** Nani: "Thank you." *Khuda-fis!* The end-of-round screen: the stopwatch (this round's seconds; "New best!" with a sparkle if so), the accuracy row (three slots: two rows and the bag, all green, the badge goes gold with its sound), the hints badge (0, gold). **Next**. Page two: *santra*, *limu*, *ambo*, *ba*, *hakro*, *khanigin*, each with its English and a tap to hear it. Tap Kasuku in the corner and he squawks *santra* back in the child's voice. The end: the kitchen, and Nani's next list.

### Q8 What changes below, and decisions

1. **Decision for Zafar: the tick on a count row.** Default: tick on the first find, count judged at Done (no leak). Alternative: tick at the count, measured by a *tap-till-tick* bot strategy. Level 1 may tick at the count either way (it is taught).
2. **`spot` from level 2: no wiggle, no recast; a tapped thing goes in the basket.** Over- and under-collection are graded at Done as now, and the review plays each missed row with what was tapped. The leak bot's numbers should not move (a wrong tap already cost the row).
3. **5b is merged into 5a**: `bag` gains a *said* mistake (the shopkeeper's line names the wrong count or the wrong noun over the right thing); the yes/no pills and the shared `readback` are dropped from Find it (the clinic keeps its `handover`). The bot's strategies for it: tap the odd-looking thing; tap the last thing packed; random.
4. **2b is cut**, and `go` needs no people; 2c is the torch. **1c** is the library's L14. **L10, L11** are skins of 4b (a `skin` field on the scene, not a game). **L16 → L2**, **L18 → L3**, **L19 → 2a L4**, **L21 → 3a**.
5. **Controls:** 5c, 5d and 6b are taps (Q1); `weigh` is a pan overlay over `count`; `giveto` is the shared tap-tap and Find it reuses it rather than building it if Tidy up or Snap ships it first.
6. **The library is ten** (Q5); P3's table stands as the full record, its "first ten to build" line is replaced by Q5's build order.

| Section below | Change |
|---|---|
| P2 stage 1 | 1c moved to the library; 1a–1b–1d as scored |
| P2 stage 2 | 2b cut; 2c moved; 2a absorbs L19 at L4 |
| P2 stage 3 | 3a absorbs L21 (the *khanigin* tray) |
| P2 stage 4 | 4b absorbs L10, L11 as skins; from L2 no wiggle or recast (Q8.2) |
| P2 stage 5 | 5b merged into 5a; 5c and 5d by tap; 5d maybe later |
| P2 stage 6 | 6b by tap-tap, shared |
| P3 | Ten kept (Q5); the rest maybe later |
| P6 | `bag.js` gains the said mistake; `readback` is not built by Find it; `giveto` may come from another mode; `spot.js` loses the level-2+ wiggle |
| P8 | Edited in place: phases 0–1 and the first three tasks |
| P9 | Adds the tick decision (Q8.1) |

**Sources (this pass).** Hidden cats on Steam: [Cats Hidden Around the World](https://store.steampowered.com/app/2377970/Cats_Hidden_Around_the_World/), [100 hidden cats](https://store.steampowered.com/app/1587560/100_hidden_cats/), [FIND KITTENS](https://store.steampowered.com/app/2907010/HIDDEN_CATS_The_last_of_cats/). Hidden Through Time 2: [Movies Games and Tech](https://moviesgamesandtech.com/2024/07/29/review-hidden-through-time-2/), [Hey Poor Player](https://www.heypoorplayer.com/2023/11/09/hidden-through-time-2-myths-magic-review-pc/). Good Pizza, Great Pizza: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/good-pizza-great-pizza), [Game Developer](https://www.gamedeveloper.com/design/good-pizza-great-pizza-would-not-exist-if-not-for-costco). Pok Pok: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/pok-pok-playroom), [Pok Pok blog](https://playpokpok.com/blog/new-toy-phonics/). Duolingo ABC: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/duolingo-abc-learn-to-read), [EducationalAppStore](https://www.educationalappstore.com/app/duolingo-abc). Khan Academy Kids: [Common Sense Education](https://www.commonsense.org/education/reviews/khan-academy-kids). Bluey Hide & Seek: [TTPM](https://ttpm.com/products/bluey-hide-seek-game/). Toca Boca Days: [Toca Boca](https://www.tocaboca.com/kids/toca-boca-days), [Fandom](https://toca-boca.fandom.com/wiki/Toca_Days). Sago Mini World: [Screenwise](https://screenwiseapp.com/media/sago-mini-world-game). Lingokids: [MyeLearningWorld](https://myelearningworld.com/lingokids-review/). Dr. Panda, Baby Panda, Toca Life World, Pepi, Hidden Folks: as listed under P9.

---

> The older passes (the pipeline design, the deep dive, the original sections 1-8 and their Sources) are in `docs/archive/modes/find-it-old-passes.md`. Where the header above says they are superseded, this file now wins. Section ids like P6, D5 or 8.2 in code comments point to that archive.

---

## Build status

> from: docs/archive/build-logs/find-build-log.md (whole file, without its title)

### 25 Sept 2026: phases 0 and 1 (the deep dive's first set)

Branch `claude/build-find`. Built from `docs/game-design/modes/find-it.md` (deep dive D1–D9, brief section 8), `docs/archive/mode-briefs/BUILD-COMMON.md`, `docs/design-language/ux-principles.md` and `docs/architecture/shared-api.md`. Every default taken.

#### What changed in the live slice

| Brief item | Where |
|---|---|
| `list.js` split into one-file mechanics and games | `js/find/mechanics/{spot,bag,greet,where,tell,bowl}.js`, `js/find/games/{list,whichone,where,ali}.js`; `round.js` keeps thin `searchTap/collect/wrong` that call `Find.Spot` |
| Pure generator (rows by level: count, size, where, not; the size rule; placement) | `js/find/gen.js` (UMD: the page and Node use the same code) |
| Digit leak (the review's High) | a row shows its count's digit only while the number word is taught (stage ≤ 1, read when the list opens); a count miss on such a row is noted, not tested |
| Level 4 | every game's `levels` in `data/find.json` |
| Where-rows match by anchor word | `Find.matches` → `Gen.matches` → `Rel.holds` (by word is the shared default) |
| The listening recall becomes speaking moment 1 | `mechanics/bowl.js`, at the end of Nani's list (lab and story) |
| Node leak bot | `js/find/blind.js` (strategies) + `build/leak_find.mjs` |

#### Shared modules used directly (no stubs)

`Rel.holds` / `Rel.info` / `Rel.mergeWords` (positions and their placeholder words), `WhichOne.checkDecoys` (every size row is checked, every round), `WhichOne.rng/shuffle` (seeded generator), `Say.tell` (every speaking moment; the lab passes `Find.fakeListen` as `speech`), `Stars.voice` (the speaking bonus), `Stars.rules("find").placeholdersTested` (a row decided by a placeholder isn't tested), `Stars.installInto`, `Stars.ICONS.mic`. Nothing in `js/shared/` was edited.

#### Decisions I had to take

1. **Family spelling on screen.** `data/cook.json` still says *wadho* and is read-only here, so `data/find.json` `words.spelling` sets `ph-big` to ***wadho*** on Find it's screens; the voice stays the draft recording until the family records it.
2. **Every stall thing in both sizes once any row is sized.** Otherwise a row with a size word (longer) points at the only two-size thing. A row with no size then takes either size.
3. **Asked sizes are dealt mixed** (never all big), so "always the big one" is no better than chance.
4. **F3 accuracy badge shows "not tested"** while the position words are English placeholders (the shared rule). Its leak numbers are measured as if the positions were Kutchi ("hidden") and reported apart as "reader" (today's readable placeholders).
5. **F4 has no accuracy badge** (nothing is heard and chosen): voice, sharp eyes (the bag's mistake found first time) and no help.
6. **Pills live at once outside the lab** (no family recordings yet for the recogniser, so `Say` hides the mic); in the lab the mic is a picker ("what did the child say?").
7. **A round that breaks a rule is dealt again** (at most 40 times; mean 1.0–1.6 deals, except F3 level 4, size and where on six calls: mean 2.7, max 15 in 500).

#### Leak bot (`node build/leak_find.mjs --n 1000`, full table in `build/reports/archive/find-leak.md`)

Ear-star rate of a player who knows no Kutchi, mean over strategies (worst single strategy in brackets).

| Game | L1 st2 | L1 st3 | L2 st2 | L2 st3 | L3 st2 | L3 st3 |
|---|---|---|---|---|---|---|
| F1 list + bag | 1.7% (3.2) | 1.8% (4.0) | 0.3% | 0.2% | 0.3% | 0.2% |
| F2 which one? + bag | 0.1% (2.0) | 0.2% (1.2) | 0.2% | 0.2% | 0.0% | 0.0% |
| F3 calls (positions hidden) | 0.7% (3.6) | 0.5% (3.6) | 0.4% | 0.3% | 0.1% | 0.1% |
| F3 today (placeholders readable, untested) | 25% | 22% | 17% | 18% | 18% | 17% |

F4 by pills only: all pills right first time 24% at L1 (one pick from five), 0% from L2; the speaking bonus 0 times in 4,000 rounds. The generator's checks (the size decoy rule, "in three places") held in 3,200 rounds; the digit shows at stage 1 only.

**The digit fix:** with the old rule (digit shown up to stage 2), F1 level 1 at stage 2 was **14.3%** (worst strategy 31%); now **2.0%**.

#### Tests

`python3 build/archive/test_find.py` (port 8801): the story round (now with the bowl), lab rounds, F2, F3 at levels 1 and 3 (sitting room), F4 through the mic stand-in (speaking bonus), pills only (no speaking bonus), a parent's ✓ (speaking bonus), level 4 of every game. `--leak N` still runs the in-page bot.

## Zafar's answers, 14 Oct

- **4d Simba's mischief is Arc 1's hide-and-seek beat** (find the sweets the cat scattered). (Zafar, 14 Oct)
