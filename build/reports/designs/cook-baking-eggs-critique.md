# Critique: Cook, the baking station and the eggs station (1 Nov 2026)

Independent critic's read of `build/reports/designs/cook-baking-eggs.md`, judged against the lessons checklist (1 Nov), the design method, the two research reports and the audit (31 Oct), the games map and Zafar's answers, and CLAUDE.md's non-negotiables. I also checked the repo where the design makes a claim about it (`js/cook/mechanics/*.js`, `data/cook.json`, `data/family-audio.json`, `data/lang/lexicon.json`, `docs/game-design/cast.md`, `sources/cook/customers-sheet.webp`). Findings are numbered, the most serious first. Nothing in the design or elsewhere was changed.

## Findings

### 1. MUST. Counted cups close by themselves: the number is never needed (B1, L2 and L4)

- **Place:** §3 B1, the L2 row ("whole cups, counted as they tip in") and "Two and a half": "The step closes when the total reaches the amount said. Tipping past it is 'too much'."
- **Problem:** a child who hears "two cups of flour" tips whole cups until the step closes. If it closes at two, they never need the number; if a third tip is "too much" and comes back out, that's the same answer by consequence. Either way the count is won by waiting. The design's own eggs rule says the opposite ("counts never end by themselves; judged at the plate"), and the lessons say rows tick when the step closes, not when a count is reached (§5), and ticks must never let a child fish (§1). Cook's own rule is that a count keeps its commit (the samosa's count button, `cook.md` level table). The bot estimate for L2 (under 1%) counts the number as a Kutchi decision; it isn't one as written.
- **Change:** make the count a commit, as eggs are. The knead is the natural one: the flour row closes only when the child taps the dough (or Nani's "knead" step opens) and the cups in the bowl are judged then. Too few: "more" and the row stays open; too many: the cloud, the last cup lifts back out, Nani says the number. Say which commit it is, and have the leak bot count first-go rows only (a fishing child finishes every round, so "win" must mean first go, and §6 item 9 should say so).

### 2. MUST. The owner never decides the plate: faces do (E1, L2 and L3)

- **Place:** §3 E1, L2 ("the owner decides the plate"), the five questions Q2 and Q5 ("the first Cook station where the owner decides the plate"), and the bot estimate ("the plate mapping (½)").
- **Problem:** Cook's order card gives each person their own part of the card with their face (`cook-recipes-guide.md` §4, "rows said for one person become that person's own part of the mission card, with their face"), and the design puts the same face badges on the tray rim (the chai tray's layout). So the child matches the card's face to the tray's face. "For Nana" and "Nana's" are heard but never needed. The chai tray has the same shape and that's accepted there because its Kutchi is what's in the cup; here the owner is claimed as a deciding word and it isn't.
- **Change:** at L3, where "for", "Nana's" and "too" are the new words, put the relayed orders on Nani's one card with no face per row ("a fried egg, for Nana" with the egg picture only), so the tray badge can be found only from the heard name. At L2 say plainly that the plate is support and recount the bot: verbs (½ × ½) and counts (½ × ½) give about 6%, still under 10%. Drop the Q5 claim or make it true.

### 3. MUST. The oven's "now" is not judged, so waiting wins it (B5, L3-L4)

- **Place:** §3 B5, Steps and Timing: "Tap a bake when its ring reaches the band its word asks for" and "Past the end of the deep-golden band, the ring stops and the bake waits. Nothing burns."
- **Problem:** the design never says what happens when a "take it out now" bake is tapped at deep golden. If it's accepted, a child waits for every ring to stop and taps them all: the time words decide nothing, and the design's own numbers (waiting wins one round in four at L3, one in eight at L4) are for the oven alone. It leans on B1's rows to get the round under 1%, which means a child who knows the amount words but not the time words never has to learn them. It is also an open question left for the builder (lessons §13).
- **Change:** define both misses, kindly. A "now" bake tapped past its band: a funny reaction (Nana's "oho", a darker naan still eaten), the first-go tick lost, the word said again. A "bit longer" bake tapped early: the door shuts and it goes back in ("leave it a bit longer"), the redo on the spot. The light-golden band must pass (the ring keeps filling to deep golden), so waiting is a miss for a "now" row. Nothing blackens; NN7 holds.

### 4. MUST. The ChatGPT prompts draw a different family, a different cat, and invite a hand

- **Place:** §11, prompts 1, 2, 3 and 4.
- **Problem:**
  - **Nana.** The approved customers sheet (`sources/cook/customers-sheet.webp`, attached to prompts 1, 3 and 4) shows Nana with a full white beard, round glasses, a white prayer cap and a brown waistcoat. Prompts 1, 3 and 4 say "a grandfather with grey hair and a neat grey moustache" and prompt 4 puts him in "a navy cardigan over a white shirt". That's a different man; with the sheet attached and the text contradicting it, ChatGPT will blend them or pick one, and whatever lands can't be cut to match the game's faces.
  - **Ali.** The sheet shows a small boy in an orange T-shirt; the prompts say "a lanky boy of about ten" in "a plain blue kurta".
  - **Nani.** Prompts 2 and 3 describe "a plain cream kameez with a few bold red motifs and a plain red dupatta"; the cast says a beige long kurta with gold and deep-red embroidery and a sheer deep-red dupatta, and the approved Nani sheet is attached.
  - **Simba.** Prompts 2 and 4 ask for "a grey tabby cat"; Simba is a black Russian Blue with green eyes (`cast.md`), and Zazu the grey one. A tabby can't be Simba, and the joke (B7, decision 10) is his.
  - **Hands.** Prompt 2 shows a jar tilted mid-air pouring, says "nothing floats", and never says "no hands". That's an invitation to draw a hand holding the jar; Cook has no hands anywhere (H13).
  - **A muddled moment.** Prompt 2 shows three moments at once: the cup half full mid-pour, a heap already in the bowl with a dust puff, and the sneeze. The sneeze belongs to "too much", which comes after the tip, not during a pour.
  - None of the prompts names a real person and all four forbid text: good.
- **Change:** in every prompt, replace the character descriptions with "Nana, Ma, Ali and Nani exactly as on the attached sheets: the same faces, hair, cap, glasses and clothes" and describe only pose and expression. Make the cat "Simba, the big black cat with green eyes" (or drop him from prompt 4). Add to prompt 2: "No hands or arms anywhere; the flour jar hangs tilted by itself over the cup." Give prompt 2 one moment (the pour, the bowl empty, Simba watching) and move the sneeze to a small second prompt or a later redo.

### 5. MUST. The speaking turn (E4) runs ahead of Zafar's speaking plan and its words

- **Place:** §3 E4, decisions 12 and 13, §9 item 8.
- **Problem:** `speaking.md` (approved by Zafar, 29 Sept and 14 Oct) sets the pilot as Cook's chai ordering only, builds the shared speaking component from what the pilot teaches, and says "nothing else is built yet; no mode waits on this". The pilot hasn't run. E4 adds a second speaking moment on a station that doesn't exist, and its model lines ("boiled or fried?", "I want a boiled egg", "I want a fried egg") are all unrecorded, so rung 1 ("the recorded line plays, with the words written") can't happen at all. The closed set as written is weak for the recogniser too: *muke [ukarelo] indo khape* and *muke [tarelo] indo khape* differ by one word in the middle; the research says two or three options that sound different (mechanics report, finding 3; SH-127).
- **Change:** take E4 out of this scope and list it under §5 "Later visits", after the chai pilot. When it comes, the child answers Nani's "boiled or fried?" with one word ("boiled", "fried", or "no, thank you"), which is the natural reply and a set that sounds different.

### 6. MUST. The first-round walkthrough contradicts the rules it is meant to teach

- **Place:** §4, the baking station step 3; the eggs station steps 4 and 5; §3 E1 step 6.
- **Problem:**
  - Baking step 3: "The child lets go. If they let go short, Nani says 'more' and they top up" happens before the cup is tapped. Decision 4 says the tap is the only judged moment and top-ups before it are free. A child taught in round one that letting go is judged learns a different game from L2's.
  - Eggs step 4: Nani says "now, Nana's egg" at L1. "Nana's" (*nana jo*) is L3's new word; at L1 the frame should be "now, the egg". Lessons §3: one line per moment and the asker's frame only.
  - Eggs step 5: "both vessels lit, because the choice is the lesson" against "one live thing at a time in a lit box" (lessons §2). A choice needs two targets, so say it as the deliberate exception and say what the box does (one box round the hob, both vessels live inside it, nothing else).
  - Eggs step 6 and B5: "It's ready. Take it out now." is two recorded lines in one moment. Pick one (the time word is the one that decides).
- **Change:** rewrite those steps so the walkthrough and §3 agree; a builder builds the walkthrough.

### 7. SHOULD. "A lot" is swallowed by "a whole cup", so it is won by holding on (B1, L3)

- **Place:** §3 B1, the amounts table ("a lot: 65-100%"; "a whole cup: 88-100%, the cup stops pouring at the brim") and the leak test's Waiting row.
- **Problem:** holding until the cup stops gives 100%, which is right for both words, and the two are "never in the same round", so they're never contrasted. A child who learns one habit (hold till it stops) wins every "a lot" row and never learns the word. The design admits a third of L3's rows go this way.
- **Change:** band "a lot" at about 55-85% so a full cup is "too much" for it, and put "a lot" and "a whole cup" in one L3 round now and then (the describing-pair rule: contrast teaches).

### 8. SHOULD. The press-and-hold pour reverses a tested Cook rule: ask him, don't assume

- **Place:** §10 decision 3; §9 item 2 ("the hold is the one exception").
- **Problem:** `cook.md` H17 says "Pour is a tap-measure" and `ux-principles.md` §12 records why: "Cook's press-and-hold pour didn't land in testing; in stations where ingredients are tapped in, liquids are tapped too." The lessons say tap, then tap (§2). The design's reason is sound (Zafar's newer "no fill line; the amount word says when to stop" needs a stop the child decides, and a tap-measure pours to a line), so the hold is probably right, but it undoes a rule he set after play, and the farm's watering can (cited as the same gesture) is designed, not built, so it's no evidence.
- **Change:** move decision 3 to the top of §10 as a real question with the two docs it changes named (H17 and UX §12, baking only), and note the fallback if he says no: the measure judged on how many short taps, which makes amounts counting again, so the hold is the recommendation.

### 9. SHOULD. The oven decides nothing at L1-L2

- **Place:** §3 B5, Q2 ("From L3 the Kutchi decides") and the ladder.
- **Problem:** two levels of a stage where the heard word decides nothing is the method's Q2 failing (a stage where the Kutchi doesn't decide is a toll before the serve, mechanics report finding 1). L2 is a pure timing juggle. Both time lines are recorded, so there's no word reason to wait.
- **Change:** from L1 one bake with its word drawn at random ("now" or "a bit longer"), the card's row picture (light or deep golden) as support until picked right three times; L2 two bakes with their own words. Or make L1-L2 a beat with no ring, like the knead, and start the rings at L3.

### 10. SHOULD. The meal word: free play's clock contradicts "eggs always at breakfast", and the light states are art scope

- **Place:** §3 C, decision 15; §7 backgrounds.
- **Problem:** Zafar's word (settings map, row "Food") is "breakfast, lunch and dinner come from the time of day in story mode". Decision 15 extends it to free play by the device clock, and then §3 C says "eggs always play at breakfast": a child frying eggs at 14:00 in free play hears which? Also §1 says "the meal word: 1 per kitchen day", while §2's day table has all three in one day. And the art bible's rule ("a scene's backgrounds come in every lighting state it uses") makes the relights real cost: a morning island, a night island, a morning hob, a day counter and a golden-evening counter, five backgrounds in one run beside the stations' own art.
- **Change:** free play keeps each station's own slot (eggs are breakfast, baking is dinner), story mode follows the day as he said. Count the meal words as three a day. Trim this run's backgrounds to the morning hob, the morning island and the golden-evening counter; dinner's night island can wait for the book.

### 11. SHOULD. Isa is a baby

- **Place:** §3 B1 L3 ("a small naan for Isa"), B5 L4 ("Isa's and Ali's now"), E1 L4 ("3-4 people"), §7 People.
- **Problem:** `cast.md` has Isa as "a baby in the family, appears later, no design yet". He has a badge and face in `assets/cook/characters/` but isn't a Cook customer (`data/cook.json` has nana, ma and cousin) and has no three-pose set. A baby ordering a naan or a hard-boiled egg reads oddly, and it adds art.
- **Change:** the fourth person is Nani herself ("and one for me", which also pays off decision 17's "I'll have it!") or Ma. Keep Isa for the baby's own moments.

### 12. SHOULD. Lines said that aren't in the word table

- **Place:** §1 against §3 and §4.
- **Problem:** the design says every line is listed, but these are said and missing: "I'll have it!" (Nani, decision 17); "OK" (E4); "naan for dinner" and "{bake} for {meal}"; "two" said again as a bare correction (no number has a clip, audit flaw 4, so this is a placeholder voice at the moment of a miss); "{Isa}'s and {Ali}'s now" (a two-owner frame); "the pot" as an onboarding line; "aah". Lessons §10: whatever is said is written.
- **Change:** add them to the table with their status, and to Mum's list where they decide something (the bare numbers, the two-owner frame).

### 13. SHOULD. Three deciding words carry a doubt flag the design calls ✓

- **Place:** §1 word table.
- **Problem:** the lexicon marks *thorok* (a little) "doubtful in the notes", *wadhare* (more) "doubtful in the notes" and *gund* (knead) "heard once", and *tar* (fry) is a draft. "A little" is L1's core amount and "more" is the miss word the child hears most. They have clips, so ✓ is defensible, but the first kitchen day rests on two doubtful words. The pot's name (*tapelo* or *sufuria*) is the lexicon's open question too, and the design asks only the egg one.
- **Change:** put thorok, wadhare, gund and tar on Mum's confirm list for the next round, and add "tapelo or sufuria?" to §10's open questions beside "indo or mayai?".

### 14. SHOULD. Reuse missed, and one reuse claim that misleads the builder

- **Place:** §6.
- **Problem:**
  - `data/family-audio.json` holds *hakro cup, ba cup* ("one cup, two cups") and *hakro cup* already; the design says "two: in engine, no clip" and sends "a clip for each of one, two and three" to Mum. Check the manifest before asking her again.
  - `boil.js` is a knob game (light it, turn it down in the green, the owner's big knob); the design drops the knob (decision 14) and taps the egg in the green, which is `fry.js`'s rule. "A new eggs profile for boil.js with two bands" sends the builder to the wrong file. Decision 14 also quietly reverses the owner's knob rule (H12, the boil mechanic's note) and should be a question, not an assumption.
  - A fifth view, `counter`: `cook.md` §14's chaat v2 is already front-on with a shelf band, and the pantry view is straight-on. Check whether one of those is the counter before adding a view.
- **Change:** use `fry.js` for both vessels (the pot as a second pan with its own ring profile); name the clips that exist; test the chaat and pantry views first.

### 15. SHOULD. Phone layout on paper doesn't fit at 915x275

- **Place:** §7 Layout.
- **Problem:** at 275 px high, after the shared side panel and a 64 px container strip, the cup is about 110 px tall, so "a little" (5-25%) is 6-28 px of fill and a half is hard to tell from a lot. Nani at 45% of the height (124 px) plus her bubble leaves no room for the bowl's heap. Simba "at the far left" sits where the side panel is. At the eggs station, 3-4 plates with 44 px badges don't fit as a column at the right at 275 px, and the design doesn't say the tray is 2×2 like the chai tray.
- **Change:** give the cup a minimum of about 55% of the play height; at 275 px, Nani becomes her face badge beside her bubble (as the chai station already does) and Simba's sill moves to the right edge under her; make the egg tray 2×2 with the chai tray's badge rule; add a line that the phone layouts are checked on the lab page before the game (fast lane, Zafar 27 Oct).

### 16. SHOULD. The best joke rewards the miss

- **Place:** §3 B1, the delight moment ("some will overpour on purpose; that's fine") and decision 10.
- **Problem:** the flour cloud and sneeze are the station's funniest thing and fire only on "too much". A side reward off the goal is what pulls young children off the learning (mechanics report, Hirsh-Pasek; Zombie Division). The lessons' jokes (the wax that keeps coming, the knee's kick) live inside the right action.
- **Change:** let the sneeze fire on a right "heaped" cup too (the mound puffs as it tips in), and give "too much" the rotating smaller reactions (the slosh, Simba's ears, Nani's "oho"), so the funniest thing comes with the hardest right word.

### 17. SHOULD. "No chilli" and "no sugar" are always no

- **Place:** §3 E1 L2 and B1 L2.
- **Problem:** the chilli shaker is never asked for at the eggs station and the sugar jar never in bread, so leaving them alone is always right and the "no" row ticks for doing nothing (research fix (b): fewer asked than shown, with the rest as real choices).
- **Change:** sometimes Ali asks "with chilli" (*mirchi* ✓), so the shaker is a real choice; at L3-L4 a bake that wants "a little sugar". The chaat station already mixes "with" and "no" rows.

### 18. SHOULD. The first kitchen day is long

- **Place:** §2 day table and §4.
- **Problem:** the door, eggs (five steps and a serve), a full existing station at lunch, baking (two to four pours, a knead, an oven, a serve) and the book is a lot for a 3-year-old in one sitting; H50 says one recipe across a few stations, and the lessons say allow plenty of time. §4 implies both new stations on the first kitchen day.
- **Change:** the first visit is eggs and baking with no lunch station (or baking alone, as its first visit is the big one); lunch comes on visit 2 with chips mayai, as §5 already plans.

### 19. SHOULD. Egg cups and "tok tok": check it's Nani's table

- **Place:** §3 E1 Q3, §4 step 8, §7 art (egg cup on a plate, lid off).
- **Problem:** a soft-boiled egg in an egg cup, topped with a teaspoon, is a British breakfast. Zafar's row is "a boiled egg for Nana", not an egg cup. If the family peels its boiled eggs on the plate, the art list (egg cups, lid-off states), the delight moment and the soft-yolk reveal change.
- **Change:** one question in §10: egg cup or peeled on the plate? Design the reveal to suit his answer (a peeled egg halved shows soft or hard just as well).

## Verdict

The design is thorough, honest about what's unrecorded, and mostly built from the kit; the crack, the lineless cup and Simba's sneeze are the right kind of fun, and the word budget is sized sensibly. But three of its claimed Kutchi decisions don't hold as written: counted cups close by themselves (1), the owner is matched by face (2), and the oven's "now" is never a miss (3), so the leak numbers in §3 and §9 are not yet true. The ChatGPT prompts would hand Zafar a different Nana, a different Ali and a tabby called Simba, with a hand likely on the flour jar (4), and the speaking turn runs ahead of the chai pilot he approved with words nobody has recorded (5), while the tutorial walkthrough teaches a judging rule the game won't use (6). Fix those six and the rest are tunings (bands, levels L1-L2 of the oven, the free-play clock, Isa, the phone layout) that a day's revision clears. Not ready to show him as a finished design; ready after the MUST list.
