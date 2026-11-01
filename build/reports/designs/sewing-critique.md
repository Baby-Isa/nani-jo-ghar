# Critique: Big Ma's sewing (`sewing.md`)

Independent read, 1 Nov 2026, flaws first. Checked against the lessons checklist (1 Nov), the design method skill, the two research reports of 31 Oct, the audit of our games, the master map and the settings map with Zafar's answers, CLAUDE.md's non-negotiables, the archived Dress up design, and the repo's own data and code (`data/lang/lexicon.json`, `data/family-audio.json`, `js/dress/`, `js/find/`, `js/shared/`, `docs/game-design/cast.md`, `easy-to-play.md`, `speaking.md`). Nothing was edited.

**MUST** blocks the design going to Zafar; **SHOULD** is fixed before the brief.

---

## MUST

### 1. The fitting's L1 ask carries no word that decides the piece (3d, §4 step 10)

- **Place:** 3d "What you do" step 1 ("This is for Ali", *hi {x} lai ai*), the L1 ladder row ("Ali's new red kurta and a green dupatta: 'this is for Ali'"), §4 step 10, the leak test's "today's piece is only sometimes asked".
- **Problem:** *hi Nana lai ai* means "this is for Nana": the one slot in the frame is the person. At L1 there is one person on screen, so the heard sentence decides nothing. The piece is picked from the card's picture (the kurta, red, shown while supported), or by "I just made it" (the red kurta is the piece the child made two minutes ago, and the decoy is a dupatta nobody has mentioned). The leak test's defence ("today's piece is only sometimes asked") is contradicted by the design's own L1 row and first round, where today's piece is the ask. A picture-matcher wins 100%; a child with no Kutchi wins by memory of the make stage; nobody is tested on a word.
- **Evidence:** non-negotiable 4; lessons 1 ("the heard word decides"; "show a need the picture can't settle"); the games map's Big Ma row ("no picture of the finished piece from L2") was written for exactly this stage.
- **Change:** the L1 line names the garment, in a frame the engine has: the customer's *muke laal kurta khape* ("I want the red kurta", on *muke {x} khape*, in engine) or Big Ma's "{garment} Ali lai ai" (a form for Mum to confirm). The L1 decoy is another garment for the same person, and from the first round today's made piece is the ask no more than half the time (the mended piece or one of Big Ma's hanging pieces otherwise). Recount the bot: L1 must rest on the garment word, not on the person.

### 2. The size is wrong: "medium, two sprints, reskins" rests on four engines that don't exist on the kit (§0, §6)

- **Place:** §0 "Engines" and "Rough size" ("the stall and the fitting are reskins"); §6 "Reused" and "New to build" item 4 ("medium").
- **Problem:**
  - Find it's stall is **greybox on its own engine** (the map: G, "a rebuild each"; `find-it.md`: "still runs on its own engine", decision 38 pending). It is not a reskin.
  - Dress up's `wear`, `fitting.js` and the rail are greybox on `js/dress/core.js`; the design knows this (item 4) but still calls the fitting a reskin in §0.
  - **Give-to is not built.** It is "new" in `party-gifts.md` (itself under critique), and the sewing's fitting depends on it.
  - **Pay is designed only** (`count-to-a-number.md`, Sprint 10).
  - `js/dress/mechanics/stitch.js` is a **swipe round a dashed ring** on a button or motif (its header says so), not "a swipe along a track". The scissors' chalk track, the seam's dotted line and the needle's zig-zag are new linear-track mechanics, three of them, in the design's main stage.
- **Evidence:** the map Part 4 ("Greybox (a rebuild each): ... Find it ... Dress up"); the audit §5 ("Moving each onto the kit is a rebuild, not a reskin"); CLAUDE.md ("keep it small"; sprints of one to three days with one playable goal).
- **Change:** an honest size with its order: (1) Find it onto the kit, (2) Dress up's `wear` and rail onto the kit, (3) give-to and pay as shared pieces, (4) one linear-track mechanic in `js/shared/` used by cut, seam and needle, then (5) the sewing. Say which of these the sewing sprint owns and which it waits for. If the game must land sooner, visit 1 is make and mend on the built table pool (`table.js`, ring stitch for buttons) plus a fitting on `whichone.js` with a two-tap, and the stall waits for the shops.

### 3. Two scope reversals presented as his word or an assumed yes (§10 decisions 1 and 9; 3e)

- **Place:** decision 1 ("not Dress up's 'mend, then make'... his 31 Oct order"), decision 9 and 3e ("Dress for the weather becomes the fitting's last beat on visit 3").
- **Problem:** the 1 Nov scope for this design names the first set as "the fitting, Big Ma's sewing table (mend, then make), dress for the weather". The design (a) reverses mend-then-make and attributes the new order to "his 31 Oct order", but the only 31 Oct source with that order is the master map's row title, which is Claude's wording; his own 31 Oct note says "makes and mends", no order; and (b) drops dress for the weather from visit 1 to visit 3 as an assumed yes. Non-negotiable 1 and the newest-word rule: the scope is his newest word on this game, and an assumed yes is not an OK on something he has just put in scope.
- **Evidence:** CLAUDE.md non-negotiable 1; the settings map §1 (his clothes note); the sewing scope line; `dress-up.md` 5b ("Going out", 22/25, "Weather → clothing reasoning lives only here").
- **Change:** keep Going out in visit 1 as the fitting's last beat (it is about 30 s: Nani's weather line through the door, the shawl or the cap, Ali steps out, the comic soaking) and put the make/mend order to him as a numbered question marked "the 1 Nov scope says mend, then make; I propose make first because the opening joke needs a new kurta". The pack-the-bag overlap is a reason to offer him, not a decision to make for him.

### 4. The ChatGPT prompts draw a Big Ma who isn't Big Ma, and §7 says her photos are still to come (§7 item 1, §11 prompts 1, 3, 4)

- **Place:** §7 ("A real likeness... photos to come... This blocks the game"); prompt 1 and 4 ("a very elderly, tiny great-grandmother... soft white hair under a white cotton dupatta, wearing a plain lilac kameez"); prompt 3 ("soft white hair under a white dupatta").
- **Problem:** `cast.md` already holds the notes taken from her photos (`bigma-01` to `bigma-03`): dark hair greying, pulled back; thin rectangular metal glasses; always a plain, muted or dark headscarf at home; soft cotton house dresses (maroon with a white paisley print, or pastel florals); thin gold bangles; "in her sewing room, use the house dress". The prompts invent white hair, a white dupatta and a lilac kameez, and no glasses. She is a real-likeness character (cast.md: "sheet-first rule: photos in, character sheet out, Zafar signs off, every later pose from the sheet"); a mock-up that fixes a different look is the thing the rule exists to prevent, and "blocks on her photos" is stale. Prompts 3 and 4 also attach `sources/cook/nani-sheet.webp` to scenes with no Nani in them, which invites the model to put Nani (another real likeness) in Big Ma's place.
- **Evidence:** cast.md §Big Ma and the photo notes; the art bible §6 ("Real-likeness characters follow their own photos"); lessons 7 (one paste block, backgrounds first).
- **Change:** describe Big Ma in every prompt from the cast notes (small, elderly, greying hair pulled back under a plain dark headscarf, thin rectangular glasses, a maroon paisley house dress, thin gold bangles); drop the Nani sheet from prompts 3 and 4; replace "photos to come / blocks the game" with "her character sheet is the first item of the run, from the notes in cast.md".

### 5. Three design points are left for the builder (3b, 3d, §2/§4)

- **Place:** 3b (how the long or short line is chosen), 3d (what happens on a wrong colour or garment), §2 stage 7 and §4 step 12 (the book's lines).
- **Problem:**
  - **Make:** "What you do" has tap the pattern, drag the scissors, drag under the machine. The leak test then says "the track only lights after the choice, and the choice is the test", but no step is the choice. Is it a tap on one chalk line (then a third tap in the stage), or the drag's start point (a drag that decides, against "a tap chooses")? Undefined, and it is the stage's whole test.
  - **The fitting:** only a wrong **size** has a reaction (the gags). A wrong colour or garment (the green dupatta at L1, the green kurta at L2) has none written. "A wrong pick goes on, shows its gag and comes back" has no gag to show.
  - **The book:** "We bought red cloth. We made Ali a kurta. We mended Nana's sleeve." are past-tense sentences; *ginech*, *banai* and "mend" have no past forms in the engine, and the three lines are not in the Mum list. Non-negotiable 2: if the engine can't say it, report the gap.
- **Evidence:** lessons 13 ("design questions left open for the builder"); non-negotiable 2.
- **Change:** make it tap-then-track: tap the chalk line (it lights), then drag; a wrong line shakes and Ali says the length word. Give the colour and garment misses their own gags (the dupatta on Ali as a cape he can't see out of; the green kurta and Ali looking down puzzled, Big Ma: *lilo!*). List the book's three sentences as recordings, or use the engine's present frames ("Ali's kurta", "Nana's sleeve", "red cloth") until Mum records the past tense.

### 6. The first round is the whole day: five new controls, three new screens, four askers (§4)

- **Place:** §4 steps 2-11; §0 "about 4-5 minutes"; §9.2 "Passed".
- **Problem:** the first-ever play meets the stall's showing, the pay stage with its own first-time showing and coin counting, the opening joke, the table's showing, a tap-then-cut track, a seam track, the mend's showing, a needle track, the give-to's two taps, the photo, the end screen and the book. That is five controls shown for the first time (coins, cut, seam, needle, give-to) and about nine new words (laal/lilo, kurta, cap, sleeve, torn, button, the price, "this is for Ali") in under five minutes. The method says the first-ever session is tiny; the lessons say 3-5 new words a round and "lose them by confusion, not by boredom". §4 also runs the shops' pay stage in a day where the design says the sewing "never teaches a new number".
- **Evidence:** game-mode-design §2 ("how the first-ever session is tiny"); lessons 2 and 10; the party critique's finding 8 (the same mistake, same day).
- **Change:** the first-ever day is the short path the design already has for "the shops came first": the cloth is on Big Ma's table; door → the joke → make → the fitting → the book (two controls, two screens, about two minutes). The stall and the mend arrive on the second play, each with its showing. Keep §4 as the second-play walkthrough.

### 7. The too-long gag, the mode's identity, is invisible at phone sizes (§7 layout, prompt 4)

- **Place:** §7 layout row 740x320 ("the customer cropped at mid-shin... the rail across the bottom 25%") and 915x275 ("cropped at the knee... the rail stays at least 70 px"); 3d step 5 ("pooling on the floor with the sleeves flopping"); prompt 4 ("even when the boy is cropped at mid-shin... how comically long the kurta").
- **Problem:** at 740x320 the bottom 25% is 80 px, and the rail's pieces are "at least 80 px", so the rail fills that band in front of the customer's shins; the hem pooling on the floor is both off-frame (cropped at mid-shin) and behind the rail. At 915x275 the crop is at the knee and the rail is 70 px of 275: the "hem against the knee line" sits under the rail. The describing word's "visible, funny consequence on a body" (3d, score 5) does not happen on Zafar's Z Fold or on any phone, which is where he plays and where every screen is checked first.
- **Evidence:** lessons 6 ("items and faces stay big; take the room from the scenery"); CLAUDE.md's four-size rule plus 915x275; S14's lesson of judging on the sizes he uses.
- **Change:** on phones the customer is full length, standing on Big Ma's low stool (the hem and the floor in frame), with the rail behind them at shoulder height on the back wall and the mirror dropped from the phone layout (it returns at the twirl as a zoom); or the rail goes up the right edge beside Big Ma. Write the phone layout so that the hem, the sleeves and the floor are never under a rail or a crop, and say what the 915x275 gag reads by.

---

## SHOULD

### 8. The word accounting is thin where it matters (§1, §2, §9.10)

- "Each word is heard at least 3 times in the day, in at least 2 stages" fails for the fault words: at L1 "torn" and "button" are heard in mend only, once each plus the replay; "cap" is heard only as the decoy's name. The day template's check (O-ID table) is not filled in; fill it.
- The Mum list of 18 misses the day's glue: Nani's door line ("Ali has grown, his clothes are small"), the seller's price lines, the book's three sentences (MUST 5), the form of "make me a {garment}" on *banai*, Big Ma's sew and mend lines, "how do I look?" is in but its answer frame ("you look very nice") is not.
- Who voices whom is unsaid. Big Ma, Ali, Nana and the seller all speak deciding lines; non-negotiable 2 means they are Mum's (or Masi's) takes, with Zafar's wife recording only the song (cast.md). Say so, as Cook does for its customers.
- "*bo fine*" is in the engine only inside "chai bo fine ai"; the mirror reply would be a whole-line splice or a new clip. Mark it to record.

### 9. The stall at L1 leaks until two colours are recorded (3a)

Red is the only recorded colour. Until green and white land, an L1 round that asks "red or green" is half grey-English asks (a reader wins) and, once filtered to recorded words, always red (a pattern). The design gates the stage on recording, which is right; add the rule as a data check: the stall never counts as teaching with fewer than two recorded colours on the counter, and the lab bot reports the placeholder rate as its own line.

### 10. The speaking set is two, and one of the two has no clip (3a speaking moment, 3d)

`speaking.md` and the checklist say a closed set of 3-5; the stall's set is *laal* and *lilo*, and *lilo* has no Mum clip, so the watch step (Big Ma says the colour, the seller answers) can't be modelled in a family voice. Move the handover to when white is recorded (three colours), and give the mirror's set a third reply or keep it as the ungraded two it is, marked as such.

### 11. "A cap? *na*!" is a verdict in a child's voice (3b leak test, §4 step 8)

The rule for a miss is a shake and the word. Ali naming the wrong pattern is fine; the "*na*!" is a no at the child. Keep *na* for the "no said last" asks only.

### 12. Counting steps need their closing rule (3c L2 "the buttons: two of them", 3b L4 "three small red buttons")

A stop-at-N step is the thing `easy-to-play.md` rule 4 fixes ("a count ends at the right number and an extra tap doesn't land"). Cite it, and say how many button spots the placket shows: more than N, or the count is on the picture.

### 13. The ChatGPT prompts (§11)

- **Prompt 3:** the kurta "fills most of the frame, sleeves out to the sides", and two face frames sit top right: the faces land on the right sleeve. Faces never sit over the work (§7 rule). Move the faces or shrink the kurta.
- **Prompt 1:** a "soft breathing gold glow box" round a bolt that is mid-flop across the counter: the box hugs a still thing. Show the box on the standing bolt a beat before, or drop the box from the mock-up.
- **Prompt 4:** "a soft gold glow outlines the boy": the light is a box, never an outline (rulebook). And the mid-shin crop against the pooling hem is MUST 7 in the prompt.
- **Prompt 1:** "a modern, gently traditional Indian-style market" against the shops day's East-African-with-Kutch-nods setting and the restraint rule (one or two nods per scene); "Kutch red" is fine, "Indian-style market" is not the place. Use `shops.md`'s setting words and the town-road reference it already attaches.
- All four: no text, no real people named, modest: passed.

### 14. Scope creep for visit 1 (§5)

The cushion cover in free play (new art: cushion, sofa; a new ungraded stage) and the role reversal are later-visit material. Cut both to `docs/ideas.md`. "Chooses colours" as expression after effort can be Find it 3a's ungraded gift tap, reused: in free play at the stall the child taps any bolt, the seller says its colour and Big Ma takes it. No new stage, and the word is still heard.

### 15. Reuse missed, and reuse misnamed (§6)

- `find-it.md` 4b *Which one?* already declares the cloth stall as its colour skin (L11, F63). Cite it; it carries the size rule (the same picture at two scales) that 3a's L2 needs.
- The fitting's "change of mind" (Dress up 5a's *na* row from L2) is the built form of "no said last"; name it.
- `js/shared/whichone.js` exists and is the shared decoy rule; 3c's fault picker is `whichone` over garment parts, not a new engine. Say so and the "new to build" list shrinks.
- "Cook's thread and cut" (the map) is never tied to a file; stitch.js was built on Cook's fill-fold swipe. Name the Cook module the linear track generalises.
- `js/day/book-games.js` for the book line.

### 16. Nana's hand through a flat-laid sleeve (3c delight, §7 item 9)

Nana is a face in a corner frame; a hand appearing inside a garment lying on the table is a muddle (whose hand, from where?) and brushes H13 (no hands). Make the reward the sleeve itself flapping like a windsock, or Nana's face-circle reaction (eyebrows, the chuckle), which the heal games already do.

### 17. The art list has no rail (§7)

Item 5 is flat-lay T garments and item 8 is worn E layers; nothing hangs on the rail (F view, on hangers), which the fitting needs at 2-5 pieces, in the colours and both lengths, from L1. Add it, and count it: at decision 14's "no code tint" the honest visit-1 count is nearer 80 sprites than 60. If that is too many for one run, visit 1 is red only (the bought colour) with green as the decoy, and the recolours come with visit 2.

### 18. Small contradictions to settle

- "The hint costs a bulb" (every leak test) against the rulebook's free guide hint after 7-13 s and the bulb only for the helper card. Pick one, as the party critique asked.
- §2 says the shops' cloth "isn't automatically the asked one here", while §2 and decision 16 promise "the colour you heard is the colour Ali wears at the party". Both can hold only if the made piece is always the shops' cloth; say so.
- The fitting's L3 "take off" is a tap on the worn piece, and give-to's second tap is a tap on the person wearing it: the same target with two meanings. Make take-off a tap on the worn piece's hanger-shaped slot, or the rail.
- `cast.md` (24 Sept) still says "no stall visit; Big Ma fixes the kurta rather than a new one being bought". His 31 Oct note wins; change that line in the same commit as the design.
- Decision 13's face circles follow the clinic's decision 92 (a circle only where the person is off screen): right; cite it.

---

## Verdict

The shape is good: four stages that never share a main action, the describing word as the move (long or short picks the cut, torn or come off picks the mend), two faults always on the garment, no finished piece on the card past support, the size gag as the funny miss and the twirl as the always-pleased end, and the cloth carried from the shops to the party. But it can't go to Zafar as it stands. The fitting's L1 line names a person and not a piece, so the mode's ending is won by the picture or by memory; the size hides four engines that aren't on the kit and three track mechanics that don't exist; two of his scope points (mend then make; dress for the weather in the first set) are reversed as assumed yeses; the mock-up prompts invent a Big Ma who doesn't match her photo notes and attach Nani's sheet to her scenes; three design points are left to the builder; the first-ever round is the whole day with five new controls; and the too-long kurta, the one moment the mode exists for, is under the rail and off the frame at every phone size. Fix the seven MUSTs, fill the day template's word check, and this is a strong small sprint with real delight (the snip, Simba's paw, the puppet sleeves, the twirl) once Mum's twenty words are in.
