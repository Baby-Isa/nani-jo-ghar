# Critique: the safari design (`safari.md`), 1 Nov 2026

Independent critic, flaws first. Checked against the lessons checklist, the design method, the two research reports, the audit, the master map and Zafar's answers, CLAUDE.md, the sibling design `farm-animals.md`, the day doc `docs/game-design/days/safari.md`, the rulebook, `speaking.md`, the lexicon and clips. Nothing edited but this file.

## Findings, most serious first

### 1. MUST: A's gesture breaks the shared Snap kit and the one-button rule
- **Place:** §3 A (steps, question 1), §7 layout ("the shutter is 56 px at the bottom right"), §10 decision 4, prompts 1-3 ("a large round cream-and-brass shutter button").
- **Problem:** A invents "tap the animal, then tap the shutter", with a shutter button on the play screen. The farm's Snap (the kit the safari is built on) is "tap the place, the frame glides and goes gold, tap inside the gold frame to shoot. There's no shutter button: the cog stays the only button on the play screen." Two Snap games with two gestures is exactly the "same shared screens and buttons in every mode" failure (non-negotiable 6), and the lessons say the cog is the only button (§6, SH-91, CK-53).
- **Evidence:** `farm-animals.md` stage 7 ("There's no shutter button"), and its "New to build" 2: "The Snap kit's frame ... a tap inside it shoots. The safari designer adds the moving road on top."
- **Change:** tap the animal, the frame glides to it and follows; when it's locked the corners go gold; tap inside the frame to shoot. Drop the shutter button from the layout and the prompts. Tapping another animal before the shot moves the frame (the undo stays).

### 2. MUST: B is the farm's photo shoot again, and its "one new engine" is already the farm's
- **Place:** §0 engines, §3 B (question 5 "the only game where the child commands animals", score 21), §6 "New to build" 2 ("the action player ... this is the trip's one new engine").
- **Problem:** B's move is tap the animal, tap the place, where each place is a verb (bush = eat, grass = run, pool = drink or swim). The farm's B1 is tap the animal, tap the place, where each place is a verb (trough = eat, bucket = drink, bed = sleep, gate = run), with the same verbs, the same first-go rule and the same third-visit speaking flip (P4). The farm's design already names "the animal actor" as its one new piece and says "the safari and the adoption centre reuse it", and `do-it-engine.md` already defines actors, actions and a call queue. The safari design counts the same thing as its own new engine and scores B 4/5 for novelty. The child would play the identical mechanic on two consecutive trips (mechanics research finding 5: "the same mechanic repeated gets boring"). The audit's whole point (§5: one job built many times on separate engines) is being repeated at the design stage.
- **Evidence:** `farm-animals.md` stage 7 and "New to build" 1; `do-it-engine.md` §0; the master map Part 4 ("most new games are skins of six engines").
- **Change:** either (a) keep B but declare it a skin of the farm's animal actor and the do-it engine, no new engine, with its novelty rewritten honestly as what it adds (the command form and the speaking turn on *kha*, *bhaj*, *hida ach*, which exist in the engine today, plus "come here" as a move) and its score cut; or (b) replace B with a second game that teaches a group the farm doesn't: the describing-word game Zafar said yes to (master map Q12, "one game where the describing word is the move"), which is this design's own parked "Who's hiding?" (tall, long, stripy, spotty, big ears). The design parks it for want of recordings, but A's deciding words are 0 of 10 recorded too, so recording-readiness doesn't separate them. Put the choice to Zafar as a numbered decision.

### 3. MUST: the learned-save bot fails the design's own target at A L2
- **Place:** §3 A, "The bot": "the learned-save bot, which knows the nouns but not the verbs, must also win under 10% at L2-L4"; the ladder: L2 has 3 photos, "two elephants ... plus one other kind".
- **Problem:** a save that knows the nouns is left with two candidates per ask at L2, so a first-go hit is 1 in 2; winning needs 80% of 3 rows, which is all 3; (1/2)^3 = 12.5%, over the 10% line the design sets. L3 ("Who's climbing?", three kinds each doing two things) is also ambiguous: the design says "the monkey and the lion climb", so "who's climbing?" has two right answers unless each verb is unique within a group, which isn't stated.
- **Evidence:** the design's own numbers, and the ride's bot today (≤5.3% at every speed, audit §1d).
- **Change:** L2 takes 4 photos ((1/2)^4 = 6.25%), written as the game's one override in its row, or three of a kind at L2 (1 in 3, 3.7%) if the phone layout can hold it. At L3 and L4, one member per verb within a group, written as a rule and coded (lessons §9: "rules are coded, not just written").

### 4. MUST: the verbs have nowhere to happen on the ride
- **Place:** §3 A ladder (drink, swim at L2; climb at L3), §7 art 1 (the three loops), prompt 2's "a small muddy waterhole in the middle distance".
- **Problem:** the ride's near loop is "a tall-grass verge and a bush"; the acacia is on the middle loop, which moves at 0.8 to the near line's 1 (window-ride rules). An elephant can't drink or swim on a grass verge, and a monkey can't climb a tree that slides past at a different speed. The design also never says what "run" means on a scrolling road: a runner moves relative to its group, so it leaves the group, and the ride's fairness rule ("look-alikes pass together ... nothing leaves before it's been asked") breaks for exactly the verb that decides.
- **Evidence:** `window-ride.md` (layers, speeds, the leak rule); art list rows 1 and 4-6.
- **Change:** build the verb groups as scenes on the near loop (a waterhole stretch with a shallow edge and deep middle; a climbable tree on the near line; open grass), one scene per group, so each group's verbs have their props on the same layer. Define run as a short dash that stays inside the group's width (it runs ahead, stops, runs again), and say so in the leak test.

### 5. MUST: scope creep against the map's "small"
- **Place:** §0 size, §7 art (about 70 sprites, three backgrounds, a Hannah Mami sheet, props, "in one ChatGPT run"), §6 (a new engine, two lab pages).
- **Problem:** the master map and the research size the safari as "small: a reskin of Snap plus the window ride". This design is two games, six grown-up kinds with five or six poses each, four baby kinds with ten poses each, three backgrounds and a likeness sheet: the biggest art run the game has asked for, from a day Zafar lists tenth in the design order and whose deciding words are unrecorded. Decision 77 runs are supervised by Zafar one paste block at a time; a 70-sprite block is not one run.
- **Evidence:** master map Part 5 row 10 and the research "sizes at a glance"; `art-run` skill (one paste block, backgrounds first).
- **Change:** first visit: the four kinds Zafar's verbs need (elephant, giraffe, zebra, plus one climber; the lion is his open question), each with only the poses its level uses; babies as the grown-up sheets scaled with a younger face (the farm's small goat does this) at most two kinds; the hippo, the monkey, the second calf and the sleep poses as later visits. Count the sprites in the design, and split the run into backgrounds, then grown-ups, then babies.

### 6. SHOULD: things taken off the day without a numbered decision
- **Place:** §2 (the day's table), §10, the parked table.
- **Problem:** the day doc's stage 7 (a food stall, "open: the stall's food") and the bag's binoculars are gone from the day; colours (the map's "also carries") are deferred; drink, sleep, sit, walk, look and take are added to Zafar's four verbs. Only some of this is in §10 (9, 16), none of it as "I removed X". Non-negotiable 1 says nothing goes without his OK; §10 is where he reverses by number.
- **Evidence:** `docs/game-design/days/safari.md` stages 2 and 7; the master map safari row; his scope line ("run, climb, swim, eat").
- **Change:** add numbered lines: the stall parked (not cut) until the family names the food; binoculars kept in the bag for "Who's hiding?" or dropped; the verb list extended beyond his four (and why drink, which has no Kutchi, is a deciding word at L2 in both games).

### 7. SHOULD: a lit box on Hannah Mami's face
- **Place:** §3 B steps and L1 ("the places are the bush, the grass and Hannah Mami"), §4 B step 1 ("Hannah Mami ... glow[s]"), B's first-round light.
- **Problem:** "come here" makes a person the tap target, so the light box and the "come here" glow sit over her face, and the baby's nuzzle plays across it. Lessons §2 and §6: the box never crosses a face; nothing goes over a face.
- **Change:** the place is a mat or a patch at her feet (she crouches to it); the box hugs the mat.

### 8. SHOULD: "every new word heard three times a round" isn't true at A L1
- **Place:** §1 ("Every new word is heard at least three times a round"), §9 row 10.
- **Problem:** L1 is three animals, three photos; each animal is named once, in its ask. The hint repeats only after 7 s of nothing, and a right first go never triggers it. Elephant, giraffe and zebra are heard once each.
- **Change:** write the frames so the name comes two or three times in a right-go round ("Look, an elephant! ... the elephant! ... *shabash*, the elephant"), and the print line names what's in it on every shot, not only wrong ones.

### 9. SHOULD: the design contradicts itself and the ride's own fun
- **Place:** §3 A ladder L1 ("One slow speed") against §4 A step 7 ("the jeep speeds up for a few seconds"); §2 stage 3 ("she hands over the camera") against §4 A step 1 ("the camera from the bag sits on the seat"); the lit box that "moves with" the elephant against lessons §4 ("a light waits until everything is still").
- **Problem:** a builder would have to guess which is meant (lessons §13: design questions left open for the builder). And the ride's own mechanic, Nani's "speed up" and "slow down" calls that Zafar called "the fun of it" (20 Oct), is silently gone: the design never says whether the speed calls are kept, replaced by the ask-driven slowdown, or dropped.
- **Change:** settle each pair in the text; state the moving-box exception to the stillness rule explicitly; say what happens to the speed calls (recommended: keep them between asks from L2, as the ride does).

### 10. SHOULD: Kutchi assumed where the engine can't yet say it
- **Place:** §1 word table: "take (command) *khan* ... 'take a photo'"; "walk (command) *hal*"; "*bhaj na, hal*"; "*ha*".
- **Problem:** "take a photo" is written as if *khan* (take, as in "take the big one") is the verb; Kutchi may use another verb for taking a photo, and the engine has no photo line, so this is the gap non-negotiable 2 says to report, not assume. The lexicon says *hal* is "walk, come, go: walk and come are the same verb (§12)", so a later visit that teaches *hal* as "walk" against *hida ach* as "come here" teaches a contrast Kutchi doesn't draw; *bhaj na, hal* is a whole recorded-style phrase and shouldn't be split. "*ha*" clashes with "*haa*" in the clinic and Cook data (clash list 4-5).
- **Evidence:** `data/lang/lexicon.json` v.take, v.walk, phrase.dont-run-walk; `data/lang/reports/clash-list.md`.
- **Change:** list "take a photo" and "photo" as frames for Mum with no Kutchi guessed; drop *hal* as "walk" from the later-visit plan until Mum says; use the settled spelling.

### 11. SHOULD: the phone layout is asserted, not shown
- **Place:** §7 layout (915x275 and 740x320), §3 B L3 ("the same pool, two spots, so it needs precision").
- **Problem:** B at 275 px tall wants five places in one band with 90 px targets (the pool split into an edge and a middle), babies 100 px tall in a row in front, the card on the left and Hannah Mami on the right; a baby standing at the pool's edge covers the pool's middle, and a 90 px "edge" next to a 90 px "middle" is a precision tap for a four-year-old (research: 4-year-olds are "slow, inefficient and inaccurate" at touch targets). A at L3 puts six animals at 110-130 px in one group inside a window that also holds the side panel, Hannah Mami and a bubble "in the sky band", which the same section crops to a thin strip. The lessons' answer is a four-size mock-up before the game (Zafar, 27 Oct).
- **Change:** separate drink from swim by place, not by depth (a stream or a trough apart from the pool), cap a passing group at four animals, put the bubble by her face not in the sky band, and show the two phone sizes as mock-ups before any build.

### 12. SHOULD: the ChatGPT prompts ask for muddled frames and settle things that are Zafar's
- **Place:** §11 prompts 1-4.
- **Problem:** prompt 3 wants the baby giraffe's eye "to fill most of the bracket frame" and, in the same image, "baby versus grown-up giraffe clearly different in size": the eye hides the body, so one demand kills the other; plus a monkey, a lion, a second baby and the aunt in a 275 px frame. Prompt 4 draws the rock and the tree "unused until then", so the mock-up shows seven tappable-looking places when three are live. Prompts 1, 2 and 4 fix Hannah Mami's clothes (sun hat, sage shirt, no head covering) although §10 lists her clothes and headscarf as "genuinely his". Prompts 1 and 2 dim the decoy animal, which bakes a hint into the reference image a builder will copy. No real person is named and "no text" is stated: good.
- **Change:** one moment per prompt (the eye shot on its own, the size contrast on its own); draw only the live places at the level shown; describe her as "head covering to be decided" or leave it out of the first run; no dimming in the reference art.

### 13. SHOULD: the voice fallback has no screen
- **Place:** §10 decision 15 ("If not, Nani asks from the back seat and Hannah Mami drives").
- **Problem:** the asker must be on screen and speak before the card (lessons §3; "bubbles belong to faces"). The layout has Hannah Mami at the right edge and no Nani. If Hannah Mami doesn't record (she is Zafar's wife; whether she speaks Kutchi for the game is his call), every line in both games changes speaker and the layout has no face for it. The farm has the same open question; this design should not build on an answer that isn't given.
- **Change:** ask him first (it's in "genuinely his"), and design the fallback layout now: Nani in the back seat beside the child's view, or Nani at the camp's edge; or make Hannah Mami's lines short enough that Nani's bubble can sit by a small Nani inset.

### 14. SHOULD: waiting and support in B are unspecified
- **Place:** §3 B steps ("the row ticks when the action ends"; "a lap of the grass that shakes the ground"), L1 ("the card shows the command's picture while supported").
- **Problem:** each call waits for the baby's full action before the next call, with no durations; the lessons say never make them wait. The command's picture (a munching picture) matches the bush while supported; that's allowed, but the design never says when support ends (the word ladder: three right picks in a row) or that the picture is of the baby acting, not of the place.
- **Change:** actions of 1.5-2.5 s with the next call allowed to land on the tick; state the ladder; the card's picture is the baby doing it, never the place.

## Verdict

A is the right game and the day's shape is sound, but as written it isn't buildable from the shared kit: its gesture contradicts the farm's Snap frame and the one-button rule, its L2 fails its own bot number, and its verbs need props the ride's loops don't have. B is the farm's photo shoot in a new skin, counted as a new engine the farm already claimed, so the "second game that teaches something Snap doesn't" is not yet answered; the honest options are a declared skin with a smaller claim, or the describing-word game Zafar has already said yes to. The art ask is far past "small", and a handful of decisions (the stall, the binoculars, the extra verbs, her clothes and voice) are taken without being numbered for him. Fix findings 1-5 and the design is close; the rest are a morning's edits before it reaches Zafar.
