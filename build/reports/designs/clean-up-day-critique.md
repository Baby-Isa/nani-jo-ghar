# Critique: Clean-up day, do it to the thing (1 Nov 2026)

Independent read of `build/reports/designs/clean-up-day.md` against the lessons checklist, the design method, the two 31 Oct research reports, the audit, the two maps, the rulebook, `data/rules.json`, the word inventory, `docs/game-design/cast.md`, `speaking.md`, `easy-to-play.md`, the art bible, and the two sibling designs it leans on (`do-it-engine.md`, `hide-and-seek.md`, `pick-it-up-put-it-back.md`). Flaws first, most serious at the top. **MUST** blocks the design going to Zafar as written; **SHOULD** is fixed before the brief.

What is good, in one line so it isn't lost: the twins (one on, one off, asks both ways) are the cleanest answer in any of tonight's designs to "the verb must decide"; the toy reactions and the dusk with Zazu's eyes are a real delight moment; the decisions list is honest and reversible.

---

## 1. MUST: a child with no Kutchi levels up by fishing

**Place:** §3 "The engine here" (a wrong pick flips back, Nani re-asks, "the child redoes it on the spot"), §6 Reused ("the rules ... level-up"), §9 row 9 ("Up after 3 rounds with at most one hint").

**Problem:** every miss is free: the wrong thing does its joke and undoes itself, the ask repeats, and the row ticks when the right thing is finally hit. The level-up counts only the guide's hint, which comes after 7 s idle. A child who taps things quickly never idles, finishes three rounds, and reaches L3-L4 without one deciding word. The design's own odds ("under 10% of rounds") measure first picks, but nothing in the round or the level rests on first picks.

**Evidence:** `data/rules.json` `advance`: "only the guide's hint counts"; checklist §1 "Ticks mustn't let a child fish ... Tick only the right item, first go" [C1017 P62-63]; the same finding was raised on hide and seek (its critique, finding 1), so this is now a shared-engine gap (lessons §13).

**Change:** level up after 3 rounds where every ask (or all but one) was right first pick and the hint came at most once. Since `do-it` serves three games, put it in the engine and in `data/rules.json` as the engine's override, not this game's. The leak bot measures first picks; the end card shows first-pick ticks as progress, never as a verdict.

## 2. MUST: the twins die after one flip, and the design says two incompatible things about it

**Place:** §3 "The one rule the builder must code" (every ask has exactly one right target in the current state); C1 leak test "Eliminating" ("a thing that's been done stays tappable and can be asked again the other way: 'turn on the tap' after 'turn it off'"; "there are always more things than asks"); decision 3; the L2 odds.

**Problem:** at L2 the two taps start in opposite states. "Turn off the tap" has one target. After it, both taps are off. "Turn on the tap" now has two targets, "turn off the tap" has none, so under the exactly-one rule the taps can never be asked again that round. The same for every pair. So "asked again the other way" is false, each kind is spent after one ask, and a round's asks must come from distinct kinds: at L2 that is 4 asks from 5 kinds (taps, lights, curtains, drawer, soap), which is "always more things than asks" by one. The builder is left to pick which rule wins (lessons §13: no design question left for the builder), and the leak table claims a fix that the engine forbids.

**Evidence:** the design's own §3 rule and C1 table, read together; mechanics research, "Nani says, do it" row ("fails if each thing can only do one action").

**Change:** write it honestly: a pair is spent once asked, unless Simba (C5) puts it back into opposite states, and the ask maker treats a matching-state pair as unaskable until then. Then make the numbers work: kinds per level at least asks + 2 (L2: 6 kinds for 4 asks, so bring the window or the cabinet forward, or ask the drawer and the soap as two kinds, which they are), and re-state the Sceptic's odds with kinds dropping out (still well under 10%: about 1/10 × 1/8 × 1/6 × 1/4). If Zafar wants re-asks in the same round, the honest route is Simba from L2, not L3.

## 3. MUST: Simba's undo points at the answer

**Place:** C5 ("Simba trots in, paws the drawer open ... Then she asks the child to put it right ('close the drawer')"; "Simba never does it to the thing Nani asks next unless she says so; she always says it").

**Problem:** the thing that just visibly moved is the thing asked next, every time. A child who taps whatever Simba touched is right without a word. That is the "visible need" leak the research names, once a round at L3-L4.

**Evidence:** research-other-games lesson 2 and §5 ("one obvious job per thing means the scene picks the move"); checklist §1 "Show a need the picture can't settle"; the same report's own fix for the party ("show it only after the child has tried").

**Change:** Simba touches two things (paws the drawer open and nudges the bath tap on) and Nani names one; or the mischief happens under the shared dim between asks ("a crash", like pick it up's Simba stage) so the child sees two changed things, not the change. Keep "Simba!" and the laugh; they are the funny beat and they survive the fix.

## 4. MUST: the phone layout does not add up, and the design never counts its tap targets

**Place:** §7 Layout, phones ("Things are at least 64 px. At 275 px high the things sit in two rows ... Bubbles go into the free wall space above the things"); the level ladder ("Things 12" at L3-L4); C2 and C3 (dirt on three or four places, two tools, the soap, the tray, the shelf, the shampoo).

**Problem:** "things" counts the state things only. The tappable set at L3 is about 20: 12 state things, 3-4 dirt places, 2 tools, the soap, the tray and the shelf. At 915x275 the vertical budget is: the ceiling light "just inside the top edge" (64), an upper row (64), a lower row (64), a floor strip that must show dirt (40 or more), plus gaps, which is the whole 275 px before any "free wall space" for a bubble, and Nani cut at the waist on the right needs about 120 px of width for a readable face. Two rows of 64 px things across a play area of about 700 px also leave no room for the dirt places as separate targets. Nothing in §7 shows this fits; the lab page (decision 21) is promised but has no numbers to prove.

**Evidence:** checklist §6 ("items and faces stay big", "nothing goes over a face", "bubbles into free space"); hide and seek's §7 gives 64 px at 320 and 56 px at 275 with 12 px gaps, which this design should at least match; SH-90, SH-112, SH-139.

**Change:** give a per-level target cap for phones, written in data (for example at most 8 tappable things at 915x275, so the phone layout drops to one twin per kind and two dirt places, or the room scrolls by one gentle tap on a sliver as pick it up does), list which things show at each size, and make the lab page's job to prove the cap at 915x275 and 740x320 before one sprite is drawn. Say where bubbles go on phones: if there is no free wall, Nani speaks from the guide box when she is cut at the waist (R3 allows the box for a guide who is effectively off screen); decide it, don't leave it.

## 5. MUST: the shared doll's house has no bathroom and no play room

**Place:** §2 ("The doll's-house view ... The clean-up starts from the same view"), §4 step 1 ("every room in the cross-section ... Only the bathroom is lit") and step 9 ("the bathroom's window glows"), §5 visit 5, §6 ("The doll's-house view: pick it up and put it back").

**Problem:** `pick-it-up-put-it-back.md` §4 fixes the house as five rooms: the kitchen, the sitting room, the hall with the front door, Nani's bedroom, Ali's room. Zafar's scope for that game is "4-5 rooms at most". The clean-up zooms into a bathroom and a play room that are not in the house it says it reuses, and its day's last beat taps "the house's light" on the same view. Either the house grows to seven rooms (against Zafar's word) or the two designs disagree about the one piece they share.

**Evidence:** `game-settings-map-2026-10-31.md` §1 ("A doll's-house cross-section, 4-5 rooms at most"); pick it up §4 step 1; this design §6 "Reused".

**Change:** one house, written in both docs the same day. Recommend: Ali's room is the play room (its toy box is already there), and the bathroom replaces the hall (the front door can sit in the kitchen or sitting-room wall; nothing in pick it up decides on the hall). That keeps five rooms. Put it to Zafar as one numbered choice.

## 6. MUST: the ChatGPT prompts draw the wrong cat and invite marks on the picture

**Place:** §11, prompts 2 and 3 ("A large ginger cat"); prompt 3 ("a curved trail of little motion puffs, its tiny headlights fading"; "a ceiling fan ... spinning, and a paper windmill ... turning"); prompt 1 ("No toilet in the picture"; "A soft warm glow surrounds the tap"); all four (no frame ratio; Nani without her glasses, "dupatta loosely over her hair").

**Problem:**
- Simba is Zafar's own cat, a black Russian Blue with green eyes (`cast.md`; hide and seek's prompts say "charcoal, near-black"). A ginger cat in the mock-up Zafar approves becomes the look.
- Motion puffs and a spinning fan in a still are drawn marks: the model will add swoosh lines, which the art bible bans as symbols, and a "spinning" fan in a still comes out as a blur.
- "No toilet" is a negative the model often ignores or inverts; describe the room so there is no space for one.
- The glow on the tap is a glow on the answer. It is after the tap, so defensible, but the mock-up is what Zafar will treat as the game's look, and the design's rule is "nothing glows on the answer".
- Nani's locked look has thin round gold glasses and a headscarf wrapped round head and neck (art bible §1, the sibling prompts); these prompts drop the glasses and loosen the dupatta.
- No aspect ratio: hide and seek's prompts give "about 2.3:1"; these will come back square or 16:9 and be judged at the wrong crop.

**Evidence:** `cast.md` rows for Simba and Zazu; art bible §1 ("no text, letters, numbers, logos or symbols") and the locked Nani; checklist §7.

**Change:** "a large, solid charcoal-black cat with mint-green eyes and a small silver bell" in every prompt; the car "stopped, headlights off" and the fan "still" (motion is for film, not the mock-up); drop "no toilet" and name what fills that wall instead; no glow in prompt 1 (or say "a moment after the tap, no highlight"); add Nani's glasses and the wrapped headscarf; add "wide landscape frame, about 2.3:1" to each.

## 7. SHOULD: Tell Ali has no picture of the need, so the pill picks the sentence and nothing is decided

**Place:** C4 ("a pill row of three ... Each pill is a picture of the thing with a speaker"; "The five questions ... the Kutchi decides: Ali does what's said (5)").

**Problem:** `speaking.md` builds every speaking moment from a picture of the need plus a heard frame plus a closed set. Here there is no need: Nani says "you tell Ali" and the child picks any of three. A pill tap plays a whole sentence from a thing's picture, so the child decides no verb and no word; and nothing says the room is in a state where all three sentences have exactly one target (two lights on and "switch off the light" is unaskable by the design's own rule). Also Ali's age drifts: "about ten" here, "8-year-old" in `do-it-engine.md`; the cast only says "tall and lanky".

**Change:** a thought bubble over Nani (or the child's character) shows the goal state (the light off), and the three pills are the three verbs' thing-pictures; the ask maker checks the set is valid in the current state before the handover; score "Kutchi decides" at 4, not 5. Fix Ali's age once in `cast.md` and cite it.

## 8. SHOULD: Mum's list is short, and the engine cannot build L2-L4 from it

**Place:** §1 "Mum first" ("Bathroom L1 (about 10 lines)"), the frames table, §5 visit 4 (*thundo* ✓ as the cold tap).

**Problem:** the first-ever round also needs "drawer" and "broom" (named in the showing), "bathroom", "what a mess", "let's tidy the bathroom", "now it's clean", and "it's night, switch off the light" (the day's last beat): about 16, not 10. More important, the L1 list is whole sentences plus nouns alone; it never asks for the verbs alone or the frames L2-L4 need ("turn off the big tap", "switch off all the lights", "first close the curtains, then switch on the light", the reasons at L3). The engine builds lines from pieces, and Zafar confirms the engine can't say what isn't recorded (non-negotiable 2), so the ladder above L1 is unbuildable from this sheet. Two tags are too generous: *thundo* ✓ is "cold (gone cold)" for food and the sibling design flags it as "Mum to say whether it's used for weather"; lifting it to a cold tap is the lift-across the design elsewhere refuses. The wash line is a draft, unchecked take ("only a low-confidence take" class), not a shipping ✓. *Ad na* is in engine, not recorded, which the text says, but it is counted among "Nani's other lines" as if usable.

**Evidence:** `research-word-inventory-2026-10-31.csv` rows for cold, "wash the glass", don't touch; checklist §10 "list every line needed"; audit flaw 2.

**Change:** one table "What Mum records for L1 to play" with a total and an order, then "for L2", "for L3-L4", each with verbs alone and the frames' pieces; mark *thundo* "Mum to confirm for a tap", and the wash line "recorded, to re-check". State the sheet's total for the bathroom (my count: about 16 for L1, 14 for L2, 15 for L3-L4).

## 9. SHOULD: the first round is half a minute of watching, and the dim never clears

**Place:** §4 steps 3-6.

**Problem:** five things named one by one, then two full showings (the flip, then the two-tap tool), before the first choice: about 25-30 s with nothing to do but watch, which lesson §2 calls losing them by boredom. Step 6 then keeps "Nani and the side panel" dimmed for the rest of the round with a box "hugging all the things": a box round the whole room is no box, and a dimmed Nani who speaks from a bubble at her face breaks R3 and "the dim clears fully" (CHAI-33, -36, -50). The same point was raised on hide and seek (its critique, finding 6).

**Change:** name only the four L1 things, and name the drawer when it is first touched; show the flip once; show the tool when "sweep the floor" is first asked, not as a separate showing; after the showing, clear the dim fully and run the round with no box (the rulebook's "point once at where to look next" covers the hand-off).

## 10. SHOULD: the dusk hides the board

**Place:** C1 delight ("the bathroom goes soft blue"), decision 11, the first round step 7.

**Problem:** at L2-L4 the light and the curtains can go off with 2-4 asks still to come, and the room stays dusky for them. The lit box "shows up on dark things" is a checklist rule precisely because dark boards failed before (CHAI-50), and at 275 px dusky sprites of a drawer and a tray are hard to tell apart. The design says play "stays visible" but gives no level for the dusk.

**Change:** the dusk is a beat (Zazu's eyes, the mew, about 2 s), then the room settles to a readable "soft" level set in data (and checked on film, not a still); or the ask maker queues an "on" ask straight after a dusk at L2+ (it needs about half the asks to be "on" anyway).

## 11. SHOULD: the art is understated by about half

**Place:** §0 Size ("The art is most of the work"), §7 Art list ("about 10 sprites, 20 frames").

**Problem:** the bathroom list as written is two taps with 3 water frames each (8), two lights plus a light-pool layer (5), two curtains plus a sun stripe (5), the drawer (2), the window and the cabinet (4), four dirt patches and a sparkle (5), the broom, cloth, soap, shampoo, tray and shelf (6), the duck and the basket with eyes (3): about 38 frames, plus Nani in three poses, Ali in three, Simba in four, Zazu in two, and four backgrounds (five with the night bedroom). It is one of the biggest runs on the table, and the first visit needs only L1-L2's set.

**Change:** an honest count by level; lock the bathroom L1-L2 set (about 14 sprites and two layers) as the first run, and move the L3-L4 things and the other rooms to later runs the design already calls later visits.

## 12. SHOULD: the toys' put-away rebuilds pick it up's engine inside do-it

**Place:** C3 ("tap the thing ... then tap where it goes"; the play room's "put the teddy in the box, put the ball in the basket"), decision 10.

**Problem:** that is pick it up's "put it in its place" (tap the thing, every home rings, tap the home), which R9 gave to pick it up ("the clean-up keeps its single job: verbs"), and Zafar agreed the map. Zafar's word that toys are part of tidying is honoured by the toys being in this room with their state verbs (switch off the car, open the box); the placing move should be the shared piece, not a second copy in `do-it`.

**Change:** C3 calls the place engine (with its dotted rings on both homes); `do-it` owns state flips and the tool's two taps only. Say so in §6.

## 13. SHOULD: three timing rules for one moment

**Place:** C1 "Where's the instruction?" ("Nani repeats the ask every few seconds"), C1 leak test "Waiting" (repeat at 7/9/11/13 s, then the helper card), §9 row 3 ("One line per moment ... no repeats").

**Problem:** "every few seconds" and "after 7 s" and "no repeats" are three rules. Overlapping voices and help too early are both on the mistakes-made-twice list.

**Change:** pin one: the free repeat is the hint at 7/9/11/13 s by level; the helper card opens on the next rung; nothing is said while a reaction plays.

## 14. SHOULD: rulebook overrides are piling up game by game

**Place:** decisions 9, 15, 16 (picture at L1 only; no "no" asks; round sizes).

**Problem:** hide and seek and the do-it designs make the same overrides. An everywhere rule fixed in one game only is the first item in lessons §13.

**Change:** one proposal to Zafar to change the rulebook and `data/rules.json` once (card picture L1 only everywhere; "no" asks optional per game; L1 round size per game), and each design cites it instead of overriding.

## 15. SHOULD: the swipe needs its rule stated

**Place:** C2 ("A short swipe on the place works too").

**Problem:** `easy-to-play.md` allows a drag only along a track or for rubbing, and S14P P1 warns that a tool shown hovering invites a drag. A swipe on the dirt is rubbing, so it is fine, but only after the tool is tapped; and the hovering broom must not read as "drag me".

**Change:** write: the tool is tapped first, always; a swipe counts only on the dirt and only with the tool lifted; the lifted tool sits by its spot and does not follow the finger.

## 16. SHOULD: small facts that will get copied into the brief

- Zazu is "little brother" in `cast.md` and "he" in hide and seek; this design and prompts 1-2 say "she"/"her".
- Nani's "hida" ✓ is listed among her lines with no moment that uses it.
- The design says the engine never runs twice in a row on a day, then ends the day with a `do-it` tap ("it's night, switch off the light"). It is unscored and one tap, so fine, but say so.
- Non-negotiable 7: "never make them wait": a tap during a reaction (the duck surfing, the gush) must be taken, not dropped; the design only says reactions finish before the next ask.
- Open question 3 (swap the kitchen for the hall) would contradict Zafar's room list; keep it as a question, but recommend no.

---

## Verdict

The core is right and better than its nearest neighbour: states that start mixed, twins that make the verb the move, asks both ways, toy-like reactions and a true delight moment (the dusk and Zazu's eyes) answer the research's warning about Toca House directly, and the decision list is honest. It is not ready for Zafar as written. Three leaks need closing before the leak claims hold (fishing levels up; the twins are spent after one flip while the text promises re-asks; Simba's undo shows the answer), the phone layout has never been counted and almost certainly overflows at 915x275, the shared doll's house it zooms out of has no bathroom or play room, and the mock-up prompts would hand Zafar a ginger Simba with motion marks. The fixes are small and mostly in text and data; one more pass on the engine rules (shared with statues and getting ready), the house (shared with pick it up), the phone cap and the prompts, and it can go to him with Mum's full sheet attached.
