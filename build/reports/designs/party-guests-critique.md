# Critique: party guests (introductions and looking after the guests)

Independent critic, 1 Nov 2026. Judged `build/reports/designs/party-guests.md` against the lessons checklist (1 Nov), the design method, the two 31 Oct research reports, the audit of our games, the master map and settings map (Zafar's answers), and CLAUDE.md. I checked the Kutchi claims against `data/lang/`, `data/conversations/`, `docs/language/grammar-notes.md`, and the engines named against `js/shared/` and `js/clinic/stages/`. Nothing was edited but this file.

Numbered, the most serious first. **MUST** blocks the design going to Zafar as "ready"; **SHOULD** is fixed before the builder brief.

---

## 1. MUST: at L2-L3 of pass the balloon, the names and the age cue decide, not the kin words

**Place:** §3 A2, the stage A ladder (L2), the stage A leak test ("Matching").

**Problem:** the design claims "two words decide: whose and which" and "there are always two of the same kind". Neither holds for the calls as listed. At L2 the people are Zara, Yusuf, Zara's mum, Masi (Yusuf's mum) and Zara's nani. "Zara's nani" is the only old woman in the room: the picture settles it. "Yusuf's mum" is settled by remembering which woman Yusuf pointed at in the intro, keyed on the English name "Yusuf": a face memory, no Kutchi. So a child with no Kutchi who tracks names and ages wins every L2 call; the Sceptic's "1 in 4" is really 1 in 1.

**Evidence:** lessons 1 ("show a need the picture can't settle", OTH lessons 2 and 6); non-negotiable 4 (no winning by matching); the design's own L4 note that the kin word only decides once there are "three grandmothers ... none marked as whose", which admits the L2-L3 problem.

**Change:** from L2, every call must be a pair that shares the owner and differs only by the kin word among look-alikes, which the cast already gives: "Zara's mum" against "Zara's masi" (two women of an age, both Zara's). No "nani" call until two grandmothers are on the sofa (bring dadi to L3, or hold nani calls to L4). Keep "no intros from L3" so the echo from the intro ends when support ends. Rewrite the Sceptic paragraph with the real odds.

## 2. MUST: every deciding word in both stages is unrecorded, so the whole design is a reader's win today

**Place:** §1 (the tables), §9 group 1, decision 17.

**Problem:** the design names it honestly and then designs round it. Stage A at L1 is decided by English names (not Kutchi at all); the kin words are "2 of 9" and those two (*Nani*, *Nana*) are the cast's names, not kin words in use; the frames "give the balloon to ___", "my name is ___", "this is my ___" are all to record. Stage B's six feelings are 0 of 6. Under decision 84 every one of these shows as grey English on the card and in the bubble, so a 6-8 year old reads the answer: the dastarkhwan problem (AUD flaw 2, 95-100%). "Counts as teaching only once recorded" is right, but the design also proposes a lab build, a leak bot and an art run before any of it exists, and the names, which every frame carries, are still an open question.

**Evidence:** lessons 1 and 10 ("Mum's voice is the budget: build from recorded frames"); master map rule 3; AUD flaw 2; `data/lang/clips.json` (no hungry, thirsty, tired, hot-as-a-person, cold-as-a-person, mum, masi, dadi, give-the-balloon, my-name-is).

**Change:** (a) fix the family's names with Zafar first (open question 1 becomes question 0), because Mum records them inside the frames; (b) put Mum's sheet in the design as a numbered list: the six "I'm ___" lines, the four kin words (mum, mother's sister, father's mother, plus Nani as a kin word confirmed), the three frames with a name slot, "I'm fine, and you?" is already there; (c) say which the engine can build and which it can't: "Zara's masi" needs *jo/ji/ja* agreement (engine-spec §possession), and the design writes only *jo*; report the gap rather than assume; (d) no lab build before (b) lands. The order "mock-up → Mum's sheet → lab" should be written in §10.

## 3. MUST: the "say your own name" moment breaks the speaking rules and has no fallback for a silent child

**Place:** §3 stage A speaking (2), §4 step 7, decision 5.

**Problem:** it is an open set ("whatever the child says ... the guests clap"), the pill is only there "no mic", and a child with a mic who says nothing is left with a mic bubble and clapping that never comes. Speaking.md: "a closed set ... never open-ended ... the on-device recogniser can only do closed sets anyway". `js/shared/speech.js` is DTW against family templates; it has no "any voice" mode, so "the mic shows it heard a voice" is new engine work the design doesn't list. "My name is ___" is also a sentence with a hole, which non-negotiable 2 forbids as a modelled line. Clapping for any noise is a verdict in disguise (it's praise for nothing).

**Evidence:** lessons 8 ("a closed set of 3-5, with the pills always there ... never a pause or a gate"); speaking.md §1; non-negotiable 7 (never make them wait for speech); speech.js header.

**Change:** make it a watched beat, not a test: the balloon comes to the child, the "your turn" mic shows with the child's own face pill always beside it, a 4 s timeout to the pill (as Conversations R4 does), and the character waves either way. Say in §10 that the name is never a word in the ladder. If Zafar wants the real name said, it's a parent-confirmed moment (speaking.md's parent fallback), not recognition.

## 4. MUST: the phone layout for pass the balloon is not solved, and L4 needs a camera pan

**Place:** §7 Layout (phones), the stage A ladder L3-L4.

**Problem:** stage A puts two rows of faces (children on cushions in front, grown-ups' heads behind) in a 275 px tall play area with bubbles "above heads", so a front-row child's bubble lands on a back-row grown-up's face. The call card "pops big beside the side panel", the balloon arcs "through free space", and the guide box and reply pills need room too. At L3-L4 there are 6-7 people plus the child; the design's answer is a camera that "pans gently left and right ... the called person's group is always in view", which means the decoy can be off screen (a free call), a moving scene under a tap target, and a new engine piece nobody has costed. 915x275 is only addressed for stage B.

**Evidence:** lessons 6 ("nothing goes over a face", "two layouts, switched by height", the five sizes); art bible "one camera per scene"; lessons 13 (judged on film).

**Change:** before the builder: a pixel sketch per size (740x320, 915x275, 930x430) of stage A at L2 and L4 with the side panel, faces ≥ 56 px, bubbles in a ceiling band above the back row, the card's pop position, and the arc's corridor. Drop the pan: on phones, one row of people (as stage B), seated grown-ups and children alternating, at most 5 on screen at L4 (the three grandmothers plus two children is enough for the kin test). The mock-up prompts should ask for a 3:1 crop so Zafar sees the phone case.

## 5. MUST: the mock-up prompts attach Nani's real-likeness sheet to generate other grandmothers, and their casts don't match the ladder

**Place:** §11 prompts 1, 2 and 4 (nani-sheet.webp attached); prompts 2 and 3 (the people shown).

**Problem:** Nani is Zafar's mum (cast.md: real likeness, approved). The prompts ask ChatGPT to "match the references" and attach her sheet while describing two grandmothers who are not her. Image models copy faces from references; the new family's nani or dadi may come out as Zafar's mum, and that then ships as a stranger. Prompt 3 is captioned "the first visit" but shows a grandad with a white beard (nobody at visit 1; and the doctor, another real likeness, is bald with a white beard). Prompt 2 is "level 2" but shows two grandmothers, which the ladder only has at L4. Zafar would approve pictures of a game that isn't the one designed.

**Evidence:** non-negotiable 8 (Claude judges, cuts and wires what lands; the brief must be right); the task's own check ("real people named"); §3's cast per level.

**Change:** remove nani-sheet from the family prompts (customers-sheet gives the people style, props-sheet the items, service.jpg the light); add one line: "none of these people is anyone shown in the references". Put the right people in each prompt (prompt 2: Zara, Yusuf, Zara's mum, Masi, one nani; prompt 3: no grandad, or a grandad who exists in §3). Drop the quoted "aah" and "snore" and "bounce line" (they invite letters and "Zzz"); the golden glow on the tapped person in prompts 1 and 2 shows a hint the game never gives, so caption it as "after the tap" or leave it out.

---

## 6. SHOULD: L1 of pass the balloon teaches no Kutchi and starts with a long watch

**Place:** §3 A1, §4 steps 3-6.

**Problem:** the deciding word at L1 is an English name; the Kutchi heard is a frame nobody has recorded. Before the first tap the child watches three intros and a pass-around (10-15 s, hands idle); at L2 three intros plus a shuffle. Lessons 12 ("hands have something to do at every step") and 2 ("lose them by confusion, not by boredom").

**Change:** two options for Zafar: (a) the intro pass is also a tap (each child says "my name is ..." when the balloon lands, and the child taps the next one: no test, hands busy, the names land); (b) make the recorded kin word decide from L1: "give it to Nani" ✓ against "give it to Zara" (our Nani is on the sofa; *Nani* is recorded). Either way the first-ever round should be stage A alone; stage B's single guest can open the next visit, so the 13-step first round (two modelled exchanges, a trolley sweep) isn't the child's first ten minutes. "About 90 seconds" is not credible for those 13 steps; time it.

## 7. SHOULD: L3's "your nani" said by Yusuf to Zara is addressed to someone else

**Place:** stage A ladder L3.

**Problem:** a call the player must act on, spoken to another character, contradicts UX §16 (characters face the player when it is the child's turn; facing each other is the "watch" cue) and asks a 5-year-old to work out who "you" is before the Kutchi. "My mum" from the holder already shifts the owner without that load.

**Change:** every call is addressed to the player. Keep "my ___" (the holder's) and "your nani" only when it means ours.

## 8. SHOULD: a new person arrives at L4 with no intro

**Place:** stage A ladder (L3 "no intros", L4 "adds Zara's dadi").

**Problem:** with intros gone from L3, "Zara's dadi" has no referent the first time; the child can only guess among the old women until a wrong tap teaches it. Lessons 3 ("model it, then ask").

**Change:** any new person gets a one-line intro the first time they appear at any level, then no more.

## 9. SHOULD: in how are you?, a tap on a guest means two things, and a second tap mid-fix is undefined

**Place:** §3 stage B steps, B1.

**Problem:** tapping a guest is "ask" at step 1 and "give to" at step 3. The design never says what happens when the child taps another guest while a card is open (a second answer, two open cards, overlapping voices, which guest the lifted thing goes to). Method Q1 (one gesture per kind of action); lessons 3 ("no overlapping voices").

**Change:** while a card is open, the other guests are dimmed and untappable (the lit-box rule); the lifted thing goes to whoever is tapped next, and a tap on the trolley again swaps the thing. Write it as a rule row.

## 10. SHOULD: B3, A3 and A4 have no leak test; B3 is won by trial and error

**Place:** §3 B3, A3, A4; the two "stage" leak tables.

**Problem:** the method asks for a leak test per mini-game; the design wrote one per stage. B3 ("ask the guests one by one until the thirsty one says so") is won by asking everyone and trying water on each; misses are funny and free, so only the first-try record stops it, and the design doesn't say so. A3 and A4 are 1 in 3 blind with pills a child can hear first; say what the bot does with pill fishing.

**Change:** a short leak row for each mini-game. For B3: the others answer with needs the child must also fix before the round ends, so an ask is never free, and the badge is first-try only.

## 11. SHOULD: the hint rules contradict the rulebook

**Place:** stage A and B leak tests ("Waiting"), stage B ladder ("the hint comes after 7, 9, 11, 13 s"), §9 group 9.

**Problem:** the rulebook's hint at 7-13 s is the guide's hint and is the one counted for level-up ("at most once a round"). The design calls the 7-13 s hint "free: the call said again" and makes the bulb the costly one. Lessons 3 ("listening again is free; only the bulbs cost") refers to the card's speaker (SH-102), not the timed hint. Stage A's card "shows its Kutchi text at L1 only" also contradicts the rulebook ("its Kutchi always shown"; the ladder hides it after three right picks).

**Change:** name three things apart: the card's speaker (free, any time), the guide's hint at 7-13 s (counted), the bulb's helper card (costs a bulb). Align the card text with the rulebook and `data/rules.json`.

## 12. SHOULD: wrong reuse and missed reuse

**Place:** §6.

**Problem:** `js/shared/rel.js` is the positions layer ("where things are"), not owners or kinship; a builder sent there for "whose" will go wrong. Kin ids already live in Conversations' roster (`name: "kin-nana"`) and the T4 answers; "the child asks" is Conversations T13 (*Ker ai?* with pills at S2, *Aai ki aayo?* spoken at S3), which the design re-describes as a new ask step. Feeling faces are `data/faces.json` and the clinic's `feelings` block (`data/clinic/pipeline.json`), whose L3 already maps hot → fan, cold → blanket, sad → apple: the party's table gives sad a balloon and cold a shawl, so one feeling gets two fixes across games. The master map's fold puts "seat the guests", "where's my cup?", the dastarkhwan and "give one to Nana" at the party; the design never says how its chair, trolley and give-to relate to them.

**Change:** drop rel.js; point at Conversations T3/T13 and the roster; make `data/party/needs.json` the one feelings table and note that the send-off reads it later (a separate decision for Zafar, NN1); one paragraph on the fold's party pieces.

## 13. SHOULD: lifting the clinic's waiting room into a shared "pick a person" is an uninvited refactor

**Place:** §6 reused, item 3.

**Problem:** `js/clinic/stages/waiting.js` is a built, judged stage with regression rows; moving it into `js/shared/` for the party changes the clinic without Zafar's word (non-negotiable 1 by spirit; S13's lesson that moving a built game onto shared code is a rebuild).

**Change:** build the party's tap on `whichone.js` + `onboard.js` (that is all it needs: a target, a decoy set, a shake); propose the shared lift as its own fix-list row for a later sprint.

## 14. SHOULD: *ki aiye* isn't a line the family recorded

**Place:** §1 greetings table, stage B step 1, §9 question 5.

**Problem:** the recorded child form is *Tu ki aiye?* (`fam:tu-ki-aiye`); the casual *Ki ai?* exists in `lines.json` with no audio. Writing *ki aiye* as the child's ask is a hand-made fragment (non-negotiable 2). Also *khuda-fis* and *dadima* are marked "engine" but are recorded (`family-audio.json`; grammar-notes K14, all three grandmother words recorded, Zafar to choose), and *sad* is marked "engine, no Kutchi", which means it isn't in the engine at all.

**Change:** copy line ids, not spellings: *Tu ki aiye?* / *Aai ki aayo?*; correct the three statuses.

## 15. SHOULD: too many new words at L2, too few hearings at L1

**Place:** §1 "New words per level"; §9 group 10.

**Problem:** L2 adds 6 (lesson 10: 3-5 a round). At L1 of stage B a round has two guests, so each feeling is heard once a round, not "3+"; "each heard 3+ times across stages 4-9" counts stages that aren't designed.

**Change:** move "which food" to L3; make each guest's feeling heard three times inside its own step (the guest's line, the card's pop, and the fix line "aah, not [thirsty] now", which Mum records as one sentence).

## 16. SHOULD: scope creep in people, art and engines

**Place:** §5 later visits, §7 art, §6 new to build.

**Problem:** visits 2-4 add a baby, a dad, dadi, dada, Sana's mum, Yusuf's dad and "more friends", and Zara at four ages: 14 or so character sheets at 24 cells each, when decision 77 is one supervised run at a time and the sprint rule is one playable goal. The "new to build" list (give-to, needs table, the balloon's arc and four misses, the seat shuffle, two data files, a day entry, a leak bot, plus finding 4's layout) is not "medium". The birthday day isn't in `data/days.json` yet either.

**Change:** cut visits 3-4's people to one line ("later; not designed"); visit 1 is six people at 12 cells, with the fix-and-miss sheet only for the four who get needs on visit 1; name what the first sprint builds (stage A L1-L2 and stage B L1-L2 in the lab) and what waits.

## 17. SHOULD: four tone and culture points

**Place:** §3 A2 fun ("Nani-ji pretending to be cross"), stage A delight (the bop on grandmothers' heads; the balloon tied to the wrist), stage B misses ("wear it as a turban").

**Problem:** a cross face, even pretend, is the frown the research warns against (OTH §1-2; non-negotiable 7). A turban gag is a visible religious marker played for a laugh (non-negotiable 9, and it travels badly). A balloon hitting an elder on the head is a question of manners in this family, not for a designer to assume. "Nani-ji" is a form nobody in the game uses.

**Change:** cut the cross face and the turban (the hot guest can hold the shawl at arm's length and fan with it); ask Zafar whether elders are bopped or the balloon lands in their lap; plain "Nani".

## 18. SHOULD: English text reaching the child

**Place:** §4 step 3 ("her bubble, read-along underline"), the grey English on every card until recorded.

**Problem:** a read-along underline is a reading feature on an English placeholder line (non-negotiable 3; lessons 13 "English text reaching the child"). Bubbles show the Kutchi line (SH-99) and no more.

**Change:** no underline; the bubble shows the Kutchi once recorded, the grey placeholder until then, and nothing animates the text.

## 19. SHOULD: the name "Masi" is already a person

**Place:** §3 the people; decision 3.

**Problem:** the cast's Masi hosts the beach; the design's "Zara's masi" uses the same word as a kin word for a different woman, in the same game, with the cast's Masi marked "a name only". A child hears one word for two people.

**Change:** flag it for Zafar and Mum: either the beach host gets a name ("Masi Sakina") or the kin word at the party is the one Mum uses for mother's sister with its owner always said ("Zara ji masi").

## 20. SHOULD: method outputs missing

**Place:** §6, §10, the whole doc.

**Problem:** the method's §6 asks for the assets each mini-game declares and loads; the five-question pool is "keep the best 6-8 per stage" and the design keeps 4 and 3 with two parked each (fine if said); the design lives in `build/reports/designs/` and doesn't say which mode doc it will become. The master map Part 7 also puts the party day as "introductions, look after the guests, gifts and cake, musical statues, Snap the people", which the design extends with a second stage-B round after statues, an engine that isn't designed.

**Change:** an assets list per mini-game (backgrounds, sheets, items, clips); a line on where the doc goes (`docs/game-design/modes/party.md`); mark B3 and the post-statues round "later, depends on statues".

---

## Verdict

The two stages are the right games for the day and the toy is good: a balloon that bops heads and six comic fixes with six comic misses is the kind of funny the feedback asks for, and asking each guest how they are is exactly what Zafar said on 1 Nov. But the design does not yet pass its own test. The kin words don't decide at L2-L3 (names and the one old woman do), every deciding word in both stages is still unrecorded so the whole thing is a reader's win on grey English, the "say your name" moment is an open set with no pill and no fallback, the phone layout for seven people in two rows is unsolved and leans on a camera pan, and the mock-up prompts would hand ChatGPT Zafar's mum's face to draw strangers. Fix those five and the SHOULDs that follow from them (the hint rules, the ask gesture, the leak rows for B3/A3/A4, the wrong reuse of rel.js and the clinic lift, the scope of later visits), then it is ready for Zafar's numbered choices and one art run of six people.
