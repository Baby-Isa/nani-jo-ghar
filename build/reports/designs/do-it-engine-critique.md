# Critique: "Nani says, do it" (`do-it-engine.md`)

Independent read, 1 Nov 2026, flaws first. Checked against the lessons checklist (1 Nov), the design method skill, the two research reports of 31 Oct, the audit of our games, the master map and the settings map with Zafar's answers, the rulebook, `speaking.md`, the art bible, CLAUDE.md's non-negotiables, the sibling designs (`party-guests.md`, `party-gifts.md` and its critique, `wake-up-clock.md`, `school-day.md`, `clean-up-day.md`) and the repo's own data (`data/lang/lexicon.json`, `data/family-audio.json`, `js/shared/`, `js/dress/`). Nothing was edited.

**MUST** blocks the design going to Zafar; **SHOULD** is fixed before the brief.

---

## MUST

### 1. Getting ready's state model contradicts itself, and its leak test is false (B1; §3, §4, §9)

- **Place:** B1's leak test ("nothing used up: things go back", "bed-hair is there all round, whatever is called", "at L4 a call can repeat"); B1's fun ("bed-hair springs flat with a boing when combed", "pyjamas become uniform with a twirl"); §4 B step 5 ("*Boing*: the bed-hair springs flat"); the odds ("1/4 × 1/3 × 1/2").
- **Problem:** the comb puts the thing back, but Ali's hair stays flat, his teeth stay brushed, his pyjamas are now a uniform. The state lives on Ali, not on the shelf, so every done call is visibly crossed off: at L1 the third call is a coin toss between the two things Ali hasn't used. The design's own odds formula (1/4 × 1/3 × 1/2) is an elimination formula, so the leak test's "no thing is used up" is contradicted by the design's own arithmetic. "Bed-hair all round, whatever is called" is flatly contradicted by the boing. And "a call can repeat" is incoherent for a morning routine: nobody eats breakfast twice or combs flat hair, so repeats (the fix for elimination in statues) aren't available here. Under 10% per round still holds at every level (4%, 0.2%), so the bot passes, but the text says one thing and the game does another, and a builder will build the contradiction (lessons §13: design questions left open).
- **Evidence:** NN4; lessons §1 (eliminating; "ticks mustn't let a child fish"); mechanics finding 5 (the same scene repeated teaches; a once-only action can't repeat).
- **Change:** choose the state model and write the leak test from it. The strong version, which also fixes MUST 5: **a round is two or three children getting ready in the same room** (Ali and a cousin at L1; three from L2, which is the design's own visit-2 idea brought forward). Each child has their own state, so "brush your teeth" is called once per child (2-3 hearings a round, the natural repeat), the mixed-order joke happens three times, and from L2 the person word decides too ("Sana, comb your hair": who and what, lessons §1's two words per move). Elimination then needs the child to track three states, and the odds are written honestly from it. The cheap version: keep one Ali, delete "things go back" and "bed-hair all round" from the leak test, say that done states are visible and the bound is things > calls + 1 at every level, and drop "a call can repeat" except for the one natural repeat (wash your hands again after breakfast).

### 2. "Stop" is the pose the dancers are already in, so it can't decide, and stop, dance and the neutral freeze look alike (A1; §3 L2, L4, the leak test)

- **Place:** A1's leak test ("the dancers freeze in the same neutral freeze every stop, never the called pose"); L2 ("'Stop' is the freeze card: frozen mid-dance, arms out"); L4 ("stand against stop: still and straight, against frozen mid-move"); L2's "dance" card.
- **Problem:** the neutral freeze *is* "frozen mid-dance, arms out", which *is* the stop card. Whenever "stop" is called the dancers are already showing the answer (a matching leak), and the call is nonsense to a child: they have already stopped. The dance card (a dancer mid-dance) is a frame from the same loop, so at 64 px the stop card, the dance card and the frozen dancers are three near-identical pictures. L4's "stand against stop" look-alike then rests on a difference the card can't show. Decision 6 says dance and stop "decide from L2", and as written neither can.
- **Evidence:** NN4 (matching); lessons §1 ("show a need the picture can't settle"); the scope's six verbs (dance and stop must decide somewhere).
- **Change:** when the music stops, the dancers don't freeze. They keep a small on-the-spot bob (a two-frame "waiting" loop that is no card's picture) until a card is tapped. **Stop** is then a real action: the full statue freeze, mid-move. **Stand** is straight and still, distinct from it. **Dance** restarts the music and the big dance. Say in the data that a wrong "dance" tap never restarts the music (a stumble, then Nani repeats), or a child learns that the dance card is the music button. Rewrite the leak test's "neutral freeze" line and the L4 look-alike from that.

### 3. Two rulebook overrides presented as assumed yeses (decision 19; §3 ladders; §9 row 9)

- **Place:** decision 19 ("No 'no' asks in either stage; round sizes override 'L1 is 1': statues 4/5/5/6 stops, getting ready 3/4/5/6 calls. *Assumed:* yes").
- **Problem:** the rulebook is Zafar's word (28-29 Oct): L2 brings "no" asks, L1 is 1, L2-L3 by the formula, and "a game may override **one** level, written in its row". The design overrides three levels in each stage and removes L2's "no" ask, and files both under §10 as a yes he hasn't given. The argument against "no" asks conflates two things: Simon says ("Nani didn't say", a trick that tests holding back, which the research rightly rejects) and a plain negated ask ("not sit: jump", *we na, jump*), which says what to do and is exactly the rulebook's L2 "no" ask (chai's "not the red one" is the same shape). A point he has decided isn't reversed by an assumed yes (NN1; the gifts critique, MUST 3, made the same point).
- **Evidence:** rulebook §1 ("How many", "L2 more of it", the override clause); the settings map and CLAUDE.md ("the newest word from Zafar wins"; a clash goes to him).
- **Change:** move both to §10's open questions, each marked "reverses your 29 Oct rule", with the rule-following alternative beside it: one override only (L1 = 3 stops, since a round of one is over before it starts), the rest by the formula (3, 4, 5, 6); and L2's "no" ask as "*we na*, jump!" (the negated verb said first, then the real one, which is listening, not a trick). If he keeps the override, the row is written as the rulebook asks.

### 4. The body-part cards can't be told apart at phone size (A1 L2-L3; §7; prompt 2)

- **Place:** §3 A1 L2 ("touch your nose / head / tummy"), L3 (ear, knee, foot); §7 phones ("cards are at least 64 px"; "the pose cards are E crops of Zara's own pose art"); §10 decision 7 (the nose "is about 15 px at phone height, too small for a 3-year-old").
- **Problem:** the design parks "boop the nose" because the nose is 15 px on a full-body figure, then makes L2's whole decision rest on telling a finger-on-nose from a finger-on-head (and at L3 from a finger-on-ear) on a 64 px full-body crop, where the head is about 10 px. The two-word move of L2 (lessons §1) is unreadable on the trigger. Prompt 2's "must read at phone size: every dancer's finger on their nose" in a wide four-dancer shot can't be met by the art either.
- **Evidence:** lessons §6 (items and faces stay big on phones); the design's own §10, 7.
- **Change:** the body-part cards are head-and-shoulders crops of the same E render (same camera, zoomed), tested at 64 px on the lab page before the art run; sit, stand, jump and turn stay full-body crops. Knee and foot can't be head crops, so either they become "touch your knee" with a mid-body crop proven at 64 px, or they move to tablets or a later visit. Rewrite prompt 2's phone-size line to ask for faces and the four cards only.

### 5. Too many new words for the hearings a round gives (§1 "New words per level"; §3 ladders; §4)

- **Place:** statues L1: "sit, jump, stand, turn (4); dance and stop heard about 8 times", "everyone" heard from L1, 4 stops; getting ready L1: five calls asked from, 3 calls a round.
- **Problem:** lessons §10 asks for 3-5 new words a round, **each heard at least 3 times**. Statues' first round puts seven new words in a 3-year-old's ear (four deciding verbs plus dance, stop and everyone) and has four stops, so each deciding verb is heard about once per round by a child who taps promptly. Getting ready is worse: five routine calls, three a round, so in any round two of the five are never heard at all, and no word reaches three hearings. The design's §9 marks group 10 "Passed"; it isn't.
- **Evidence:** lessons §10 (E2P 9; SH-159); mechanics finding 5 (repetition of the same scene is what teaches).
- **Change:** statues L1 is sit and jump in its first rounds (the rulebook's one clearly different decoy), six stops with repeats, turn joining within L1 and stand at L2 (the rulebook's "one added item"); dance and stop are heard every stop anyway. Getting ready takes MUST 1's three-children round, which gives each verb 2-3 hearings; failing that, L1 is three calls (brush your teeth, comb your hair, eat your breakfast) from four things, and wash and get dressed come at L2. Recount §1's table from the fix.

### 6. L3 builds on the two-Nani problem the gifts critique already flagged, and the party order doesn't match its siblings (§2, §3 L3)

- **Place:** §3 A1 L3 ("Zara's nani dances too, and Nani calls her in the polite form"); §2 A ("the order from `party-gifts.md` §2 and `party-guests.md` §2"); the cast line in the header.
- **Problem:** `party-gifts-critique.md` MUST 1 says two Nanis on one screen break the deciding word and muddle "Nani" (the child's own grandmother, every day's host) with a stranger; it proposes the host family's grandparents become *dada* and *dadima*. This design puts our Nani and "Zara's nani" on the same floor and has Nani call her by the elder form, with the word "nani" doing work in the call. Whatever Zafar decides on that critique, this stage must follow it, and today it assumes the answer the critique argues against. Separately, the two sibling designs disagree on the day's order: `party-guests` §2 runs gifts and cake (6) then statues (7); `party-gifts` §2 runs statues (5) then cake (6). This design cites both as if they agreed and follows gifts. Three docs, two orders, and the carries (the crown into the family photo; the dancers hot and thirsty before a second "how are you?") depend on which.
- **Evidence:** NN2 and NN4 (the gifts critique's reasoning); lessons §13 (an "everywhere" rule fixed in one game only).
- **Change:** rename the dancing grandmother to whatever the gifts critique's outcome is (dadima by default), and keep her off the floor until the elder forms are recorded (all of sit, turn, touch and stand have `imp.polite: unknown` in the lexicon, round 5 C142-C151). Put one party order in all three docs and name it in §10 as the one Zafar confirms.

### 7. Two misses break the design's own safety and culture lines (A1, B1 delight moments; §9 row 11)

- **Place:** A1 misses ("jump instead of sit: they bounce off the cushions and land in a heap"); B1 misses ("a shoe ends up on his head like a hat"); §9 row 11 ("no jumping on furniture, the dancers jump on the floor only").
- **Problem:** bouncing off the cushions is jumping on the furniture, which §9 says the game never shows. A shoe on the head is not a joke in a Khoja home: shoes are unclean and stay by the door; it's the kind of gag that gets the stage sent back on sight, and it's something a child copies. "Nothing a child could copy and get hurt by" and NN9's spirit are both in the lessons.
- **Evidence:** lessons §11 (KEEP-08; AUD flaws 7-8); NN9; the design's own §9.
- **Change:** jump-for-sit lands in a giggling heap on the floor, cushions untouched; the shoe miss becomes shoes on the wrong feet (Ali walks pigeon-toed, stops, swaps them) or a shoe on his hand like a phone. Reread every miss against "could a child copy this at Nani's": the sock puppet, the towel ghost and the hairbrush stare are fine.

---

## SHOULD

### 8. "The verb decides" is only half true in getting ready (B1; §1; §9 row 1)

- **Place:** B1's five questions ("L1: the routine verb decides"); §1 ("Its verbs: wash, brush, comb, get dressed, put on, eat, drink, dry").
- **Problem:** the trigger is a thing with one use. A toothbrush brushes teeth and nothing else, so "brush your teeth" against "comb your hair" is settled by whichever word the child catches, verb or noun. The mechanics report's own row says this mechanic "fails if each thing can only do one action (the noun gives it away)"; the scope asked for "a thing or person with several actions; the verb picks one". It isn't a leak (a child with no Kutchi still can't win), but it's a fetch game in the engine's clothes until L2's pairs (wash / dry your face; brush your teeth / hair). The clean-up has the same shape, so it matters twice.
- **Change:** say it plainly in §1 and §9: at L1 the thing's word decides, from L2 the verb or the noun decides within a pair, and list the pairs. If the verb must decide at L1 too, the pair goes in at L1 (flannel against towel: wash against dry) and "put on" waits.

### 9. Scope creep: two stages have become six (§1, §3, §5, §7)

- **Place:** the elder form (L3), clap, hands up and sleep (decision 8), Sana as a third dancer (L2), first-then (L3-L4), the weather inference (decision 18), four look-alike pairs at getting ready L4, the tempo flag and garden statues (§5), the crown layer, a two-track music player with a cog switch, Ali's doll lab; the art list of about 80 pieces across two stages.
- **Problem:** the scope was six verbs and body parts for statues, five commands for getting ready, and an off-screen round. The design roughly doubles the vocabulary, adds a register (which costs Mum nine more clips, all `imp.polite: unknown`), a third dancer (16 more poses), and inference from another stage. The research's verdict on screen statues is "keep it short". The engine is "about 400 lines"; the art and recording around it are a quarter's work.
- **Change:** visit 1 is the scope: statues L1-L4 on sit, jump, stand, turn, dance, stop, touch + nose / head / tummy; getting ready on wash, brush, get dressed, breakfast, comb, plus face / hands / socks / shoes at L2. Elder form, clap, hands up, sleep, Sana, the weather, the hairbrush and jumper, tempo and the garden go to §5 as visits 2-3. Keep L4 its own (the look-alike can be sit against turn-round-and-sit, or shirt against trousers) without new words.

### 10. The first round shows one gesture four times, and names four unrecorded things (§4 A step 3, §4 B step 2)

- **Place:** §4 A step 3 (sit, jump, stand, turn each shown once with its own music run: about a minute before the first real call); §4 B step 2 ("each of the four things bounces once in turn as Nani names it").
- **Problem:** the lessons say "show each new action once"; tapping a card is one action, and showing it four times is showing four words, which is the round itself. For a 3-year-old that's four music runs before anything is theirs. In getting ready, Nani naming the toothbrush, comb, clothes and bowl adds four nouns that aren't in §1's word list and aren't recorded (so the device says them in English while testing: "to record" placeholders a reader hears), a minute before the same things are called by a different phrase ("brush your teeth"). "Show what isn't on the card" means the things never asked for (chai's water and tea), not every thing on screen. The kit's finger is already off by rule (rulebook §1 "no finger"; §5 "the ghost finger goes when each game takes the light"), so §6's "question for the shared-layer owner" isn't one.
- **Change:** statues: one showing (the first call, lit alone), then live with two cards. Getting ready: the things bounce silently in turn (a look, no names), and the one decoy that's never called at L1 is the "not on the card" thing. Delete the finger question.

### 11. Continuity with the clock and the bag (§2 B, §4 B)

- **Place:** §4 B step 1 ("Ali sits up in bed, yawning. Nani at the door: 'wake up, Ali!'"); §2 B carry-out ("a dressed Ali holds his empty school bag"); getting ready L2 "drink your milk"; the breakfast tray on a stool in the bedroom.
- **Problem:** `wake-up-clock.md` ends with all three sleepers up at the window and Nani bringing Ali milk; this stage puts him back in bed and wakes him again, then gives him milk to drink at L2. `school-day.md` has the *child* pack the bag at Nani's front door with Nani naming things; here Ali holds the bag. And breakfast is eaten in the bedroom off a stool, which isn't how a Nani's house works (the mixed-order joke doesn't need the bowl in the bedroom: a doorway tray from Nani would do).
- **Change:** open on Ali already up, in pyjamas with bed-hair, in his room (the clock's carry as the clock wrote it); "wake up" is heard in the clock only. Carry out "a dressed Ali, ready; Nani: 'now the bag'" and let the child pack. Nani brings the tray in at the door ("eat your breakfast" is her handing it over), or drop breakfast from the bedroom and keep eat for the kitchen; and don't serve milk twice.

### 12. The off-screen round after every round is a lot of unscored minutes (A2; decision 9)

- **Place:** decision 9 ("runs after every on-screen round: 3 calls, the model 2 s after the call").
- **Problem:** three calls at 3-8 s of music each plus the call, the 2 s gap and the model is 30-45 s after every round, at every level and visit, and a dancing child isn't near the screen to skip it. It's the stage's best moment and it will wear out by round three. The research says the real fun is the body, and "keep it short".
- **Change:** once per play of the stage (the end of the last round), or every other round, in data; keep the cog switch. Nani's "now you!" then stays an event.

### 13. The child's own character stands still at the party (decision 5; §3 A1)

- **Place:** "The child's own character stands small beside Nani ... It doesn't dance."
- **Problem:** at a party where everyone dances, the child's own figure standing by the grandmother is a small sad note (NN7's spirit) and at 275 px it's hidden anyway. The cost argument against pose art for it is right.
- **Change:** keep it off screen (the child is the camera, as in Cook) and bring it in only for the handover and the crown, which the design already does at 275 px. Or give it the speaker to hold: a job, not a wallflower.

### 14. Kutchi bookkeeping and small claims (§1, §3, §5, §6)

- **Place and problem:**
  - §5 "*slow* ✓": the clip is the English loan in *slow kar* ("turn it down", the flame); "slowly" is Mum's *aste thi* ✓ (B2). "Dance slowly" should ask for *aste thi* and still be checked with her.
  - "stop (freeze): to record": grammar-notes §25 B19 already has Mum saying "stop" is the English *stop* (or *gadi ke ubhi rakh*); say so, so the sheet asks her to confirm rather than invent.
  - §0 "1 of the 6 statues verbs is in the engine": sit (*we*) and turn (*firai*) are both in it; two, with the *firai* meaning question.
  - "*shabash, beta* (in engine)": it's a recorded Mum line, but inside "Mmm, chai bo fine ai. Shabash, beta" (S2); it can't be cut cleanly for a party without her saying it alone.
  - §3's engine paragraph says "the row never ticks a wrong pick" but not that a stop after a miss never ticks at all; §9 says "first go". Put the first-go rule in the engine paragraph where the builder reads it.
  - §6 cites "Dress up's greybox" for Ali's layers: name `js/dress/doll.js` (it exists) so the builder reuses it rather than the idea of it.
- **Change:** correct each line; move *aste thi* into §1's table.

### 15. The music's source and its default (decision 2; open question 1)

- **Place:** "a simple wordless tune on a kalimba", tune on by default, claps recorded by the family.
- **Problem:** the claps follow CLAUDE.md (the family's own sound), but a kalimba tune is a generated or stock asset with no pipeline, no author and no rule in the art bible or `audio.md`. Instrumental music is also exactly the kind of thing this family may not want in a children's game, which is why the scope made it his call. A default of "on" means the first thing he hears is the thing he hasn't agreed.
- **Change:** default to claps alone; the tune is a data switch that stays off until he says yes and says where the tune comes from (a family hum is the cheapest answer that keeps NN2's spirit).

### 16. The ChatGPT prompts (§11)

- **Prompts 1-2:** the pose cards are drawn inside the scene. Fine for a mock-up, but say in the "what it should show" line that the real cards are separate crops, so Zafar doesn't approve the in-scene card look as the asset. Prompt 2 asks for four dancers, Nani, four cards and a speaker in one wide frame at phone size: busy; drop Sana (SHOULD 9) and it reads.
- **Prompt 3:** "musical swirls (abstract curved lines)" is a known route to note symbols; keep the "no musical notation" line and add "no symbols of any kind".
- **Prompt 4:** "the comb's empty spot on the shelf has a faint gold glow" asks the model to light nothing, and "a small stool with a breakfast tray stands in front of the shelf" overlaps two things that must be separate cut-outs. Put the stool beside the shelf and drop the glow (the light is code).
- **Prompt 5:** "a glass of milk" where §1 and the clinic's tray say a cup; and "pyjama trousers" under a school shirt is the mixed-order joke, fine, but say "plain" so no stripes or prints become text.
- **All:** none names a real person, all forbid text; the references exist in the repo. Prompts 1-3 describe the same room as `party-guests` prompts 1-2 (limewash, oak, bunting), so the backgrounds will match if the party's is locked first, as the design says.

---

## Verdict

The engine idea is right and cheap, the delight moments are real (the freeze-click, the foam moustache, the sock puppet), the leak thinking is mostly careful, and the Mum-first list is the correct first step. But the two stages don't yet hold together: getting ready's leak test describes a game that isn't the one in its fun column (things go back, Ali doesn't), statues' "stop" is a call the picture has already answered, and both stages put more new words in a round than a round can repeat. Two of Zafar's rules are reversed as assumed yeses, the L3 grandmother walks into the two-Nani problem the sibling critique raised this morning, and two misses would get the stage sent back on sight. None of this needs a new mechanic: a three-children morning, a waiting bob instead of a freeze, smaller L1 word sets, the scope's vocabulary for visit 1 and a tidied party order would make it a design he can say yes to by number. Not ready to show him until the seven MUSTs are in.
