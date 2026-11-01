# Critique: the farm animals design (1 Nov 2026)

Independent read of `build/reports/designs/farm-animals.md` against the lessons checklist, the design method, the two research reports, the audit, the maps, `farm.md`, `TEMPLATE.md` Part C, the rulebook, `speaking.md`, the archived Snap quality pass and CLAUDE.md. Flaws first; MUST means the design doesn't go to Zafar or a builder until it's fixed, SHOULD means fix it before the brief. Nothing else was edited.

**What the design gets right, in one line:** the pipeline is honest about its recording gap, the five questions are answered everywhere, the leak tables are real, the photo shoot's "make it do it, then snap" is the best idea in any of the overnight designs, and §10 puts eighteen choices to Zafar in his format.

---

## Findings

### 1. MUST: the feed's L1 model gives the asks away by elimination

- **Place:** §4 Feed steps 2-6; §3 A1 ladder L1 ("2 asks, two different animals; 3 shown"); the A1 leak table ("Eliminating: fewer asks than animals at L1").
- **Problem:** The model has Hannah Mami feed the cow. The two asks that follow are "two different animals", so they can only be the hen and the goat. A child who watched sees one cob already in the cow's trough and two empty troughs: the first ask is 1 in 2, the second is forced. The claimed L1 blind odds of 1 in 6 are really 1 in 2, and "the picture can't settle it" (lessons §1, OTH lesson 2) fails in the very first round. Even if the cob is eaten and gone, a three-year-old remembers "the cow's done".
- **Evidence:** The design's own fix for elimination is "fewer asks than animals"; the model spends the third animal. The lessons checklist §1 asks for a need the picture can't settle.
- **Change:** Keep the model's animal in the pool: the cow eats its cob and is visibly hungry again before the first ask, and the two L1 asks are drawn from all three (an animal may be the model and then asked). Or model on a fourth thing (Hannah Mami feeds the chicks a pinch from her hand, which is never a trough). Recompute the L1 odds and say which.

### 2. MUST: home at dusk L1 drops Zafar's agreed listening game

- **Place:** §3 C1 and the evening ladder ("L1: C1 listening asks: none"); §4 Home at dusk.
- **Problem:** `farm.md` row 9 (Zafar, 20-21 Oct) is "each animal to its own place, one at a time, the place named": a listening game at the first visit. The design's L1 is a watch (Nani calls the hen), one spoken call (goat or cow) and a beat (Hannah Mami leads the last one in). No heard word decides anything at L1, so the row's mechanic is replaced at the level the child actually plays. Decision 10 covers "who goes now, not where", not "no listening at L1". Non-negotiable 1.
- **Evidence:** `farm.md` row 9; `TEMPLATE.md` Part C row 9 marks only the call as "Proposed"; the design itself scores C1 at 14 and says "kept as Zafar's agreed beat".
- **Change:** L1 keeps one listening ask: after the hen is called (watch), Nani asks "the goat goes in now" from goat and cow (1 in 2, the L1 allowance), and the last animal is the child's call. For the call's closed set, don't shrink it to "the animals still out": the recogniser's set is the three names (hen, goat, cow) and the pills show all three; if the child says the hen, she pokes her head out of the coop and goes back in (the funny surprise), and the card's animal is asked again. That keeps 2-3 options for the recogniser (research-mechanics finding 3) at every rung.

### 3. MUST: the heard sentences can't be built by the engine, and the design counts the wrong verb forms as recorded

- **Place:** §1 "Its verbs" ("eat: *kha* ✓, the form for a child"), "Frames heard", §9 group 1 ("only corn, eat and small are clips on their own").
- **Problem:** *Kha* is the imperative ("eat!"). The photo shoot hears "take a photo of the goat eating", "now the goat sleeps", "the goat is sleeping"; feed hears "the hen wants corn", "give the goat two corn"; home hears "the goat goes in", "two hens go in now". Those need third-person present forms (she-thing: the goat, the hen; plural: the hens), a "take a photo of X doing Y" frame, "X wants Y" with an animal subject, and a word for photo. None of these is in the inventory: eat has *kha* (imperative), *khai* (having-done) and *kianto* (present, I, man) only; drink, sleep and run have no present forms; "photo" and "camera" are "planned". So the one verb the design calls recorded does not decide a single move as written, and the engine cannot say any of the frames in §1 today.
- **Evidence:** `research-word-inventory-2026-10-31.csv` rows eat, run (*bhaj*, imperative only), take (*khan*, imperative only), come (*ach*), camera (planned); CLAUDE.md non-negotiable 2: "if the engine can't say it, report the gap".
- **Change:** Add a frame table: each heard sentence, the exact forms it needs (verb, person, gender, number), what the engine has, what Mum must record. Count those in the recording total (it is well over the "about 22 words": every verb needs its she-thing present and plural forms, plus the frames). Mark *kha* ✓ as the speaking rung's word (the child says "eat!" to the goat at the third visit), not the photo shoot's deciding word.

### 4. MUST: the photo shoot ticks at the shutter, which Snap's quality pass ruled out as a fishing leak

- **Place:** §3 B1 question 1 ("Tap the goat inside the gold frame: click, flash, and the photo flies to its row"), §4 photo step 5 ("the photo flies into the row, which ticks"), the B1 leak table's "Fishing" row.
- **Problem:** The instant tick (or its absence, with Nani's laugh) tells the child after one snap whether the place was right. With two places at L1 and four at L2, "tap a place, snap, no tick, tap the next place" wins every row by the second or third try. The gold-only-first-go rule protects the score, but level-up counts hints, not gold (rulebook: "up after 3 rounds where the hint came at most once"), so a child who fishes still climbs the levels. This is exactly the leak Zafar named in chaat (C1017 P62: "if it's not ticked, you take it out", CHT-14), and the archived Snap design closed it on purpose: "the shot rows tick at the hand-in, not at the shutter, because the shutter must stay silent ... a tick at the shutter would let the Sceptic spray film and watch for ticks" (`docs/archive/modes/snap.md` Q0, from Zafar's 25 Sept quality pass).
- **Evidence:** Lessons §1 ("Ticks mustn't let a child fish"); Snap Q0; the design's own fishing row concedes "at most 1 in 4 a row" per try, which is per try, not per row.
- **Change:** One of two, put to Zafar: (a) the shutter stays silent as Q0 decided: the print slides into a tray on the side panel, and when the row's asks are done Nani looks at the prints and names each (the hand-in), ticking the ones that fit; or (b) keep the live tick but make a redone row count as a hint for level-up, and define the bot's win as any tick, not a gold one. Either way, write the bot's win condition into the design.

### 5. MUST: the count-close rule reverses an approved principle, and is set for every game from inside this one

- **Place:** §3 A1 "How a count closes"; §6 ("it gains the close on stillness or the next tap rule here; this is the place to settle it for every count game"); §10 decision 5.
- **Problem:** Easy-to-play principle 4 (Zafar, 21 Oct, yes to all) says "a count ends at the right number and an extra tap doesn't land". The design calls that a leak and replaces it with a 2.5 s stillness close for every count game, presented as an "assumed yes". That's an everywhere rule changed inside one game's design (lessons §13), and it changes his word without saying so. The mechanism also has two soft spots: 2.5 s between cobs is short for a three-year-old (lessons §4: the ride had to run 50% slower), and "tap the trough to take back the last cob" shares a target with "tap the trough to drop a cob", so the take-back is ambiguous.
- **Evidence:** `easy-to-play.md` §4 principle 4 and its decision list; lessons §4 and §13.
- **Change:** Present decision 5 as what it is: "this reverses your 21 Oct principle 4 for counts, because stopping at N lets a child win by tapping until it stops". Put the stillness time in `data/rules.json` as the design says, but test it in the lab at 3-4 s first. Make the take-back a tap on the cob in the trough (the thing to remove), not the trough.

### 6. MUST: wrong decision citations, and the darkroom is parked on Zafar's behalf

- **Place:** §3 A1 ("No 'no' asks in feeding (decision 9)"), §6 and §10 item 6 ("the photos go straight to the evening book (decision 6)"; "your darkroom idea (14 Oct) stays parked").
- **Problem:** Decision 9 in the rules log is "family photos may be attached to prompts for likeness"; decision 6 is "everything stays public". Cook's decisions 6 and 9 are "move on when nothing is left" and "ticks only right first go". None says what the design cites. Worse, Zafar's 14 Oct note on Snap is "undecided until Snap is rebuilt: young Nani in old photos, instant camera or phone; his idea to weigh then: the children develop the photos in a dark room, then place each in the right place in the book". The rebuild is now, so this is the moment he reserved, and the design parks his idea with a citation that lends it false authority. Dropping "no" asks is allowed by the rulebook with a reason; it needs no decision number.
- **Evidence:** `docs/archive/process/rules-2026-10-13.md` (decisions 6, 9, 84); `docs/feedback/cook-playtest-2026-10-17.md` (Cook's 6 and 9); `docs/game-design/modes/snap.md` "Zafar's answers, 14 Oct".
- **Change:** Remove both citations. Move the darkroom, the instant camera or phone, and young Nani in old photos from "parked" to the open questions in §10, with a recommendation (the farm's first visit: straight to the book; the darkroom as the book's "stick in the photo" page or the second visit).

### 7. MUST: say what the speaking moment needs before it can run at all, and order Mum's sheet

- **Place:** §1 totals; §3 C2; §4 Home at dusk step 4 ("Nani's call 'Goat, come here!' plays"); §9 group 1.
- **Problem:** The design says the stages don't teach until Mum records, which is honest. It doesn't say that C2 can't even be tested: the recogniser matches by DTW against the family's own takes of each choice (`js/shared/speech.js`), so without takes of goat, cow and hen there is nothing to recognise, and a device-voiced English model at rung 1 would have the child saying English (non-negotiable 3). The first round's deciding words are 0 for 4 recorded (hen, goat, cow, sleep); *murgi* sits in the inventory under food ("chicken"), so its use for the live hen needs Mum's yes; "come here" to a goat is already an open question.
- **Evidence:** `speech.js` header ("templates: the family's own takes ... plus any takes enrolled"); the inventory rows.
- **Change:** A "Mum first" list in order: (1) the three animal names alone (they are the recogniser's templates and every stage's deciding words), (2) Nani's call per animal, (3) the present forms of eat, drink, sleep, run (finding 3), (4) the frames, (5) shed, coop, chick, grass, photo. Say plainly that C2 is gated on (1) and (2), not device-spoken.

### 8. SHOULD: the photo shoot's L1 skips the animal words and the delight moment

- **Place:** §3 B1 ladder (L1: the goat only; eat, sleep); §3 "The delight moment: the leap" (run arrives at L2).
- **Problem:** `farm.md` row 7's agreed asks are nouns and counts ("the hen", "two goats", "the big goat"). The design starts Snap on verbs with a single actor, so the animal names the child has just met at feed get no second hearing until L2, and the stage's own delight (the leap into the lens) isn't in the first round; L1's two verbs (eat, sleep) are the two most static. Lessons §12 asks for the fun in the hands at every step.
- **Change:** Either L1 = "take a photo of the goat / the hen / the cow" (nouns, from three animals; the card and the verbs come at L2), or keep verbs at L1 but make them eat and run (*bhaj* is at least in the engine), so the leap is the first round's reward and sleep's snore joins at L2.

### 9. SHOULD: Hannah Mami's voice contradicts itself, and one voice from two faces muddles the asker

- **Place:** §3 C1 ("Hannah Mami (Nani's voice until hers is recorded) says who goes in now") against §10 decision 13 ("Nani asks in all three stages ... until her lines are recorded, Nani makes the breakfast calls").
- **Problem:** Lessons §3: bubbles belong to faces, one line per moment, no two faces saying the same thing. Mum's voice from Hannah Mami's bubble teaches the child the wrong face for the voice.
- **Change:** Decision 13 as written: Hannah Mami is silent and gestures (she lifts the cob, she leads the cow) until her own lines exist; Nani says every line, from her own bubble.

### 10. SHOULD: the model shows a cob carried across the screen, which invites a drag

- **Place:** §4 Feed step 2 ("Hannah Mami lifts a cob from the basket and drops it in the cow's trough herself").
- **Problem:** Lessons §2 (S14P P1): no item shown flying into place, "you're going to try to drag it". The gesture is tap, then tap.
- **Change:** The model shows the two taps: the basket's lit box, a cob lifts; the trough's lit box, it drops. Hannah Mami points, she doesn't carry.

### 11. SHOULD: "no text in the scene" contradicts the shared word ladder

- **Place:** §3 A1, B1 and C1 leak tables ("No text on the places", "No text in the scene").
- **Problem:** The word ladder (SH-159, Zafar 29 Oct, `data/rules.json`) shows a word's Kutchi under its item in a pill with a speaker until it's picked right three times in a row, then the speaker only. The farm either breaks the shared rule or the leak tables are wrong about what's on screen while supported.
- **Change:** State it: each animal and each place carries the shared word pill (Kutchi, then speaker only) by the ladder; the leak bot plays a learned save with the pills earned. The tables' "no text" becomes "no text past support".

### 12. SHOULD: say where Nani's lines live (bubble, guide box, card face)

- **Place:** §3 A1 question 4; §6 ("guide.js and bulb.js: Nani's box").
- **Problem:** Guide-and-card R3 and R4: a speaker on screen talks in a bubble at her face; the guide box at the top of the side panel holds only the next step, without her face when she is also the asker. The design has Nani on stage at the right, her "box", and an order card whose face would also be hers. Nothing says which line goes where, and at 915x275 the design puts bubbles "into the sky strip", not beside her face.
- **Change:** One paragraph: Nani's ask in a bubble at her face (R3); the guide box says the step, no face (R4); the card's face is the customer: here the animal being fed or photographed, which also makes the pop-then-row card read as "the hen wants".

### 13. SHOULD: the phone layouts don't add up on paper

- **Place:** §7 Layout table (740x320: "about 590x320"; 915x275: "about 730x275").
- **Problem:** The side panel is about 22% (`ui-design-system.md`), so the play area is about 577 px at 740 wide. Three animals at 120-140 px tall are 130-170 px wide each (380-470 px), plus troughs, the basket at bottom left (about 80 px) and two people chest-up at the right edge (about 180 px) that "never overlap an animal": over 640 px into 577. At 915x275 the ground line at 85% is y 234, the cow's top is at y 94, and the sky strip above holds two people's faces, their bubbles, and the request pop-up "beside the side panel"; there's no room for a bubble beside a face. The photo shoot adds four places and a frame 40% of the width.
- **Change:** Before the art run, a lab page with grey boxes at the four sizes and the Z Fold (Zafar's fast lane: mock-up, lab page, the four-size check). Decide what gives on phones: the people drop to one (Nani) at the right, the cow stands behind the goat and hen (depth, not width), the basket sits in the side panel's lower half.

### 14. SHOULD: the first art run is too big; cut it to L1-L2

- **Place:** §7 "Art needed" (about 35 new cut-outs: goat drink, sleep, run, lens, small goat; hen drink, sleep, lens, a chick line; cow in six poses; eleven things; two backgrounds; Hannah Mami in four poses; Nani in four; the child; plus a redo of the whole old goat set).
- **Problem:** The biggest run so far was about 20 images with redos (s07 B); this is nearly double, in one block, with a likeness run for Hannah Mami still open. "The art is most of the work" is right, which is why it should be staged.
- **Change:** Block 1: the two yard backgrounds, the goat's eat, drink, sleep, run and lens, the hen's drink and sleep, the cow's eat, the troughs, cobs 1-3, the basket, the bucket, Nani with the camera and the cob. Block 2 (L3-L4 and the second visit): the small goat, the hen groups, grass, water in the trough, cobs 4-5, the chick line. Hannah Mami after her likeness run.

### 15. SHOULD: the ChatGPT prompts

- **Place:** §11, prompts 1-4.
- **Problems and changes:**
  - **a. Four different yards.** Prompts 2-4 say "the same sunny farmyard", but a fresh run has no memory of prompt 1 and none attaches its result. The pipeline locks backgrounds first. Run prompt 1, then attach its approved yard as the first reference of 2, 3 and 4 (and relit for 3).
  - **b. Real people and the player's character.** Hannah Mami is a real person with a likeness run still open; the player's character is the shared boy-or-girl layers; Nani's locked look is `sources/art/s08/sheet-nani-final-1.png` and `lineup-v4-1.png`, not `sources/cook/nani-sheet.webp`. The mock-ups invent an aunt and a girl. Either leave them out (Nani alone at the right is enough to judge the moment) or caption the prompt for Zafar: "stand-ins, not likenesses". Attach the s08 Nani sheet.
  - **c. Prompt 4 is muddled.** A big goat, a pair of hens, a trio of hens, a small goat mid-leap "right in front of the camera", gold brackets, a flash and a gate in one 740x320 frame. The leaping goat at the lens will fill and hide the frame. Drop the hen groups from this mock-up (they're prompt 2's job) and put the small goat mid-field with the big one watching.
  - **d. UI painted into art invites text.** Viewfinder brackets and a mic bubble are the classic places an image model adds "REC", battery bars, numbers or a mic glyph with letters. Add "no readouts, symbols, bars or icons inside or around the brackets" to prompts 2 and 4, and take the mic bubble out of prompt 3 (it's code-drawn; the design says UI chrome is never in the art).
  - **e. Painted UI states.** "A soft breathing gold glow outlines the goat's trough; the rest very slightly dimmed" (prompt 1) paints the onboarding state. Fine for a mock-up only if the prompt text that goes to Zafar says so; otherwise he will judge a glow that code draws.

### 16. SHOULD: C1's take-back is impossible once a hen is inside

- **Place:** §3 C1 L2 ("each tap sends one hen; the count closes as in A1").
- **Problem:** Non-negotiable 7: undo until the step moves on. A hen that has gone up the ramp and in can't be tapped back.
- **Change:** Tapped hens gather on the ramp (visible, countable) and go in together when the count closes; a tap on a hen on the ramp sends her back to the yard.

### 17. SHOULD: cap the bonus photos

- **Place:** §3 B1 question 3 and decision 7 ("an unasked photo is kept as a funny bonus photo for the book").
- **Problem:** A joke that pays every time will be farmed; the book's farm page fills with sleeping-goat photos and the round never moves.
- **Change:** One bonus photo a round (the first unasked one); later unasked photos get Nani's laugh and the recast, and nothing is kept.

### 18. SHOULD: the recording total is understated and the day's total is over the template's cap

- **Place:** §1 totals ("about 22 words to record"); `TEMPLATE.md` Part B ("about 15-25 new words a first visit").
- **Problem:** These three stages alone need about 22 words plus the frames and verb forms of finding 3; the rest of the farm day (`farm.md`: hat, water bottle, farm, feed, chick, four dressings, speed up, slow down, Hannah Mami's lines) adds about 15. The first farm visit is 40-50 recordings, double the cap the template proposed.
- **Change:** Give the day's total and propose the split: the first visit records feed and the photo shoot's L1-L2 words; home at dusk's words come with the second visit (which also answers Zafar's 21 Oct "move it if the day is long").

### 19. SHOULD: two things the method asks for are missing

- **Place:** method §6 items 7 and 2; §3 B1 question 4 ("the row's picture becomes the child's own photo").
- **Problem:** No list of the assets each mini-game declares and loads only when chosen; no win condition for the three leak bots (gold tick? any tick? first go?). And a row whose picture turns into the photo is a change to `order-card.js`, a shared piece that is never restyled per mode (non-negotiable 6).
- **Change:** Add the asset list per mini-game, the bot's win rule (it depends on finding 4), and put the photo-in-the-row to the shared-layer owner as a shared feature (the party's and the safari's Snap will want it too).

---

## Verdict

The design is the strongest of the farm's three documents and the photo shoot is worth building: a verb deciding a move, an animal the child makes act, a photo that lives on in the book. But it can't go to Zafar as it stands. Its first round leaks twice (the feed's model spends the third animal; the shutter's tick lets a child fish, which Snap's own quality pass had closed), it quietly drops his agreed listening game from home at dusk at L1, it counts an imperative as the recorded verb for sentences that need present forms the engine doesn't have, it reverses his 21 Oct count principle for every game from inside this one, and it parks the darkroom he reserved for exactly this rebuild under a decision number that says something else. Fix the seven MUSTs (two are design changes, the rest are honesty about words, scope and whose decision it is), stage the art, prove the phone layouts in a grey-box lab, and then it is one of the better sprints on the map.
