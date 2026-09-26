# Who did it?: design (mode id `who-did-it`)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar. Nothing built yet. Follows `docs/modes/MODE-DESIGN-BRIEF.md`; modelled on `docs/find-it-design.md`; uses the lessons in `docs/cook-with-nani-kutchi-audit.md` and `docs/cook-with-nani-todo.md` (Waves 1–5).
**Absorbs:** the old **Ask around** mode (Roadmap mode 6) and the deduction half of **At the door** (the greeting half stays a choice inside every mode, as v2 says).
**Placeholder rule:** Kutchi here is only what's already in `data/content.json` or `data/cook.json`. Anything written `[EN: …]` has no Kutchi yet: in the game it's grey italic English until the family gives the words. **Never invent Kutchi.** Right now almost every describing word, kinship title and past-tense frame this mode needs is a placeholder (section 6.6). That's the biggest risk, and section 4 is shaped around it.
**Current section:** "Mini-game quality pass, 25 Sept 2026" (next) sharpens and cuts the pipeline design's mini-games and reveals, and wins wherever the two differ; "Pipeline design, 25 Sept 2026" supersedes the deep dive (D1–D9) and sections 3, 4, 8 and 12 wherever they conflict; the deep dive's solver, leak rules, speaking rules and scores still stand underneath it all.

---

## Mini-game quality pass, 25 Sept 2026

Follows `docs/modes/MINIGAME-QUALITY-BRIEF.md` (Zafar: "the detail and success will all be in how these mini-games work: what do you need to do, where is the challenge, where is the fun, where is the instruction, what is novel") and `docs/UX-PRINCIPLES.md` §11–§13 as clarified on 26 Sept: **controls are consistent inside each mini-game and never change between its levels** (swipe, drag and tap are all fine; the same kind of action always uses the same gesture); **the card auto-ticks** and mistakes show only in the end review; **the card is the master and Nani is a voice**. Every mini-game and reveal in the pipeline design (P2, P3) is answered against the five questions, scored, and kept, merged or cut. Where this section and P2/P3 differ, this section wins; P8's build brief is updated below to match.

**The cut in one line.** 17 stage variants become **10 kept** (1 · 2 · 4 · 2 · 1, plus the goodbye), with 3 merged and 4 put aside; the 18 reveals become **9** (4 in the first build, 2 next, 3 as the L3 twists) and 8 put aside. Nothing kept is the same as a mini-game in another mode unless it says so and reuses that mode's mechanic.

### Q1 The controls, fixed per mini-game

One line per kept mini-game: its gesture for each kind of action, the same at every level. Changes from P2/P3 are in bold.

| Mini-game | Move / pick | Choose / confirm | Speak (optional, never replaces the gesture) | Changed |
|---|---|---|---|---|
| 1 Dust rings | tap a ring | — (the tap is the answer; no Done) | say the number (closed set 1–3) | **1a's counted tap + number pill and 1b's tap merged into one tap on a ring**: the rings tapped *are* the count |
| 2a Look closer | drag the lens; release over a smudge to collect it | — | — | **drag-and-release only** (P2 had "drag onto it and it snaps": kept, and no tap after the drag) |
| 2c Follow the prints | tap a print | — (the trail ends itself at the sofa) | — | none |
| 3a Keep who fits | tap a suspect (toggles forward/back) | tap Done; from L3 tap the next empty clue slot to ask for the card | — | **the L2 "magnifier over paws at the sofa" option is removed**: paws and hands are visible at every level of stage 3; the lens belongs to stage 2 only, so no gesture appears at L2 that L1 didn't have |
| 3b You ask | tap a question pill; tap the *haa* answerers forward | tap Done | say the question word | none |
| 3c Tell Ali | — (Ali moves the suspects) | tap a word pill (the fallback) | say the describing word | none |
| 3d Nani guesses | — (Nani moves her frames) | tap ✓ / ✗ | say *haa* / *nar* | none |
| 4a Point | tap one suspect | — | say the name (L1) or the describing word (L2+) | **4c Say who folded in** as 4a's mic option, offered at every level |
| 4b Prove it | tap a clue card in the notebook | — | — | none |
| 5b Sorry, it's okay | — | tap a reply pill | say the reply | none |
| Reveals | one gesture each, named in Q4 (tap, counted swipe, counted tap, drag with a speed band) | — | R2: say the number | **R3's press-and-hold pour becomes a tap per paw**; **5a's tap-the-sweets-into-the-box is no longer its own game**: where a reveal counts, the count is that reveal's own tap (R2, R12); otherwise the sweets go back on their own |

Two things cut partly *because* of the controls rule: **2b The dropped things** (the clinic's belt is tap at L1 and drag at L2 in the clinic's spec, and a belt of drifting evidence makes no sense on a kitchen floor anyway) and the **peek-at-paws lens on the line-up**.

### Q2 Research: what is working right now, and what is borrowed

Checked today by search: Hey Duggee's *The Detective Badge* (S1 E48), *Duck Detective: The Secret Salami* (2024, PC and consoles; well reviewed into 2026), *The JerryMaya Detective Agency* (App Store, ages 6–12, 2025 update). The rest is from memory of the 2021–2025 charts and awards and was **not re-verified this session**: treat those rows as leads, not citations.

| Game | The specific mechanic | Why it works | Where it goes here |
|---|---|---|---|
| **Hey Duggee, The Detective Badge** (checked) | Duggee's pie vanishes from the windowsill; each Squirrel does one detective *ritual* (crime tape, photos, measuring, looking under the cow); tiny footprints are the clue; they follow the trail; everyone gets the badge | Pre-schoolers love the props of being a detective more than the logic; the footprints make "follow" the verb; the badge is the reward | The **props** at stage 1 (Kasuku's crime tape flutters across the scene; a fedora on the case card that the child taps to start); the footprint trail is 2c; the end-of-round badges (UX 9) are the Duggee badge |
| **Duck Detective: The Secret Salami** (checked) | "Deducktions": a notebook sentence with colour-coded blanks (names, objects, verbs); feedback only says "3 or more wrong" or "2 or fewer", never which; a gold "Duck Approved" stamp when it's right | Guessing blindly is discouraged without ever punishing; the stamp is the payoff; it is played by families together | **4b Prove it at L4**: Nani's recap as a three-chip sentence (*who · what · trace*), graded as a whole with the stamp, replacing the old G10 case board; and our rule that mistakes are shown only in the end review is the same instinct |
| **The JerryMaya Detective Agency** (checked) | Near-limitless generated mysteries from a small fixed cast and town; a bonus library of mini-games and comics unlocked by cases | Familiar faces plus a fresh case every time is what keeps 6–12s replaying | `case.js` already generates; the **case book** and the reveal library are the bonus shelf ("Catch them again!") |
| **Blue's Clues & You!** (memory) | Exactly three paw-print clues into the handy-dandy notebook, then the Thinking Chair | A fixed count the child can predict; the pause before the answer | The fixed clue slots on the case card; the "so…" pause in 4a |
| **Toca Mystery House / Toca Life** (memory) | Everything tapped reacts; nothing fails; spooky-but-safe | Five-year-olds explore by poking; a reaction is a reward | Every smudge, print and ring reacts to a tap (a puff, a squelch) even when it isn't the answer; no wrong buzz |
| **Pok Pok Playroom** (memory; Apple Design Award) | Real-object sounds on every touch; no goals or verdicts | A "wrong" tap still sounds lovely, so the child keeps exploring | The dust puff and Kasuku's sneeze in 1; the lens's "bloom" sound in 2a; the sofa creak when a suspect sits |
| **Khan Academy Kids** (memory) | One spoken instruction per activity with read-along; Kodi's pointing hand shows the first tap | One instruction, shown not told | UX 1's request card; UX 8's ghost finger |
| **Duolingo ABC** (memory) | "Tap the one you hear" among three; a sparkle on the right one, nothing on the others | The three-way pick is the right size for 5; the sparkle is the tick | 1 Dust rings and 2a are three-way picks by ear; the auto-tick is the sparkle |
| **Bluey: Let's Play, Keepy Uppy** (memory) | Tap the balloon to keep it up | A tap that *catches* is the most satisfying tap there is | R12's flying sweets are caught in the air by tap |
| **Good Pizza, Great Pizza** (memory) | The customer's oddly-worded order must be interpreted; the pizza is judged at handover, with the customer's face; a tally of the day | The order card is the master; feedback comes at the end, in one place | The case card is the master; accuracy comes on the end-of-round screen; the case book is the day's tally |
| **Overcooked** (memory) | One ticket at a time; the queue is visible | Attention is free for the ticket | One clue card at a time in 3a; the empty slots show how many are coming |
| **Guess Who? (Hasbro app)** (memory) | Flip-down frames; the board empties; the computer can play the asker for younger children | The emptying board *is* the reasoning made visible | The sofa line-up sitting down; 3d has Nani ask for the younger child, 3b has the child ask |
| **Sago Mini** (memory) | Characters giggle at any poke; "no wrong way" | Warmth over correctness | Suspects purr or say "Hm?" when tapped; the culprit laughs when caught, never cries |

**Not borrowed**: dice and boards (Clue Jr., Outfoxed), picture clue bubbles (Outfoxed's decoder shows the feature; our clues are only spoken), lives or a judge's health bar, reading-heavy sentence blanks (Duck Detective's are for readers; ours are three picture chips at L4 only).

### Q3 The five questions, stage by stage

Scores are 1–5 on each question (**Do** = is what you do clear and one-gestured; **Challenge** = does the Kutchi decide it and does it grow by level; **Fun** = is there a moment of delight; **Instruction** = can the card and Nani say it in the Kutchi the family has given us; **Novel** = does no other mini-game in any mode have this). Kutchi in the "Instruction" columns is only what exists (`data/cook.json`, `docs/kutchi-grammar-notes.md`); `[EN: …]` is a placeholder; drafts are marked.

#### Stage 1: Something's missing

| Mini-game | What you do | Where the challenge is | Where the fun is | Where the instruction is | What is novel | Do · Ch · Fun · Ins · Nov | Verdict |
|---|---|---|---|---|---|---|---|
| **1 Dust rings** (1a + 1b merged) | The side table: the sweet box, the fruit bowl, the hook. Where something has gone there is a faint **dust ring the shape of the thing**. Nani names what's gone; tap the ring (or rings) that fit. Each tap puffs dust; the tally in the corner counts your rings (yours, never the target). The card's line ticks when the right rings are tapped | L1: one noun, three rings of three shapes (*limu*, *ambo*, *dungri*: 33% blind). L2: a **count with the noun** (*ba limu*: two lemon rings among five); the tally is what you tapped, so stopping matters. L3: *nar ambo* (draft *nar*): everything but the mango. The rings you tap set **n**, the clue count for the case | The puff of dust and Kasuku's sneeze off-screen (louder each tap); on the right ring the shape "fills in" for a second as a ghost of the thing, then fades; the crime tape flutters | Card: the crime picture (the box with gaps) and the line *limu* · *ba limu* · *nar ambo* (drafts flagged), with `[EN: gone]` grey until row 9 is asked. Nani's voice: the same line, then *Arre re!* | The only mini-game anywhere whose target is an **absence**: the noun is matched to a shape with nothing in it. Find it and Tidy up tap things; this taps where a thing was | 5 · 4 · 4 · 5 · 5 = **23** | **Keep** (first set) |
| 1a How many are gone? (as its own game) | Counted taps on gaps, then a number pill | The number | The counter | Real numbers | None: Cook `count`, Tidy 1b, Monsoon S3b, Snap 1a all count by tap | 3 · 3 · 2 · 4 · 1 = 13 | **Merged** into 1 (the rings tapped are the count; the number pill goes; the spoken number stays as the `say` option) |
| 1c Whose is it? | The thing left behind is somebody's; tap the owner on the case card's face row | Kinship and *{x} jo* | Nana's sheepish look when his cap is held up | All placeholders (E85–E99 asked) | The possessive as the decider is new, but the tap is the clinic's waiting room | 4 · 4 · 3 · 2 · 3 = 16 | **Maybe later** (when the kinship words land; L3+) |

#### Stage 2: Gather clues

| Mini-game | What you do | Where the challenge is | Where the fun is | Where the instruction is | What is novel | Do · Ch · Fun · Ins · Nov | Verdict |
|---|---|---|---|---|---|---|---|
| **2a Look closer** | The kitchen floor by the box; three smudges, all **grey**. Drag the magnifier: under the lens a smudge **blooms into its colour and texture** (yellow powder, white flour, red pulp); away from the lens it is grey again. Nani names the trace; release the lens over that smudge and it snaps into the notebook as a clue card (the card's slot fills and ticks) | L1: one trace named among three (33%); look-alike groups never together (*atto/loon/khun*). L2: two clues, two names (*hardar ne atto*). L3: *nar* the white one. The colour is invisible without the lens, so the child must **look at each, then choose by the word**: a guess without listening is a third | The bloom under the glass (a soft "whoom" and the powder sparkles); the snap into the notebook with a camera click; a wrong smudge under the lens just shows its colour and Nani says nothing (from L2), so looking is free and fun | Card: the clue slots (n empty dots) and the trace noun, *hardar* · *atto* · *tameto* · *marcha* · *dai* (all real; mud is `[EN]`). Nani: the noun, then *Hedo!* when it snaps | The only **hidden-property lens** in the game: Find it's torch (Monsoon's `dark`) hides *objects*; this hides a *property* (the colour) of things you can see. Nothing else makes you look at every option before the word decides | 5 · 4 · 5 · 5 · 5 = **24** | **Keep** (first set) |
| 2b The dropped things | A belt of things drifts past the box; grab the one the culprit dropped | The held-item noun | The grab | Real nouns | None: the clinic's belt, reused in Tidy up 2c, Snap 1c, Dress up 3b; and its tap-then-drag ladder breaks the controls rule | 3 · 3 · 3 · 4 · 1 = 14 | **Cut** (the held-item noun is still tested at stage 3 as a *holds* clue) |
| **2c Follow the prints** | Paw and foot prints lead from the box across the floor, big and small mixed; Nani says which size; tap the prints of that size in order from the box; the trail ends at the sofa and the camera pans there (the hand-over to stage 3) | L2: two sizes, three prints to tap (12% blind for the order). L3: three sizes (big, small, bird). L4: *pela* the small ones *ne poi* the big (real linkers) | Each print squelches when tapped and a little cloud of powder lifts; the last print is under the sofa's fringe and a tail twitches | Card: the trace slot and *wadho* / *nindho* (drafts; agreement C22–C36 asked) `[EN: prints]`; *pela … ne poi* real at L4 | A **filtered path**: which prints (the size word) *and* their order along the trail. Dress up 1b and Monsoon S1b order things; nothing else filters and orders on a path | 4 · 4 · 4 · 3 · 4 = **19** | **Keep** (from L2, once *wadho/nindho* are confirmed) |
| 2d Ask around | Each family member says where they were; place their face on the room in the notebook | Past tense and rooms | Ali's over-long alibi | Nothing yet (F32–F34, E49–E58 asked) | Testimony placed by the player is new | 3 · 5 · 3 · 1 · 4 = 16 | **Maybe later** (Arc 4; the words) |

#### Stage 3: Question the suspects

| Mini-game | What you do | Where the challenge is | Where the fun is | Where the instruction is | What is novel | Do · Ch · Fun · Ins · Nov | Verdict |
|---|---|---|---|---|---|---|---|
| **3a Keep who fits** | The sofa line-up. The notebook's first clue card lights and Nani reads it; tap everyone who fits (they step forward), tap Done; the rest sit down. The next card lights. At L1 with one clue the tap *is* the answer (the K1 shape: no Done). The card ticks when the set was exact; it stays blank otherwise (the only mid-round signal, and it's not a cross) | L1: 3 suspects, 1 clue, the trace is on their paws in plain sight. L2: 4–5 suspects, 2–3 clues that **combine** (no single clue solves), the adjective with agreement. L3: 6, *nar*, you ask for the next card yourself (tap the empty slot) and may stop early, no-op clues. L4: relations. The blind bot: 3.7% at L1, ≈2% at L2, as built | The sit-down: each suspect sits with their own huff (Simba's slow slump, Kasuku's ruffle, Nana's knees); the last one standing gulps; the sofa creaks | Card: the clue cards from stage 2, read in Nani's voice with the frames F24–F28 (`[EN: it had] hardar [EN: on its paws]`, the noun real, the frame grey); *haa* (heard) when a card ticks | **Clues combine**: the only mini-game in any mode where two spoken facts must be held together to pick who fits. The emptying sofa is the reasoning made visible | 5 · 5 · 4 · 5 · 5 = **24** | **Keep** (first set) |
| **3b You ask** | The clue cards are gone. Tap a question pill on the wall (*[EN: glasses?]*, *wadho?*, *hardar?*) or say it; every suspect answers at once in a bubble chorus (*haa* / *nar*); tap the *haa*s forward; Done; ask again. Fewest questions wins the craft star | L3+ (Ruggeri: halving is an 8+ skill): choosing a question that halves the line-up; hearing four *haa/nar* bubbles at once and sorting them (6% blind). L4: two-slot questions | The chorus: six voices at once, Kasuku last and loudest; a question nobody fits gets a row of shrugs | Card: the question words as pills (F14–F22 asked; *wadho/nindho* drafts; *hardar* real); the answers *haa* (heard) / *nar* (draft) | The child **asks** and the set narrows: the clinic's E4 "you ask" produces one question frame for one answer; this is a Guess-Who chain the child drives | 4 · 5 · 4 · 4 · 5 = **22** | **Keep** (L3+) |
| **3c Tell Ali** | You saw it (the dealt card on the request card). Ali at the line-up: *[EN: what was it like?]*; say one word from the closed set (or tap its pill); Ali echoes it and sits down whoever doesn't fit; when one is left he points. A wrong word sits the wrong people: *[EN: nobody's left!]*, again | L1: the noun (*hardar*, *limu*). L2: the adjective (*nindho*, draft). L3: choose *which* clue to give (a halving clue earns the craft star). The voice star only by mic or a parent's tick | Ali acting on your word, hilariously wrong when you're wrong; the "nobody's left" shrug with the whole line-up sat down | Card: the dealt card (a picture) and Ali's prompts (row 11: not asked; grey). The child's word is the instruction | The role reversal is **deliberately shared** (`js/shared/say.js`: Tidy up 1d/3d, Dress up 5c, Snap 3d, Monsoon S3c, the clinic W3). What is ours: the listener **deduces** from the word, so a wrong word has a visible consequence in the line-up, not a wrong object in a basket | 4 · 4 · 5 · 4 · 4 = **21** | **Keep** (shared `say`; own free-play entry from L1) |
| **3d Nani guesses** | The dealt card again; Nani is the detective. She asks yes/no questions in Kutchi; say *haa* / *nar* or tap ✓ / ✗; her mini line-up of frames flips down as you answer; she guesses. A wrong answer makes her guess wrong, and she says why (*Arre re!* Big Ma *has* glasses) | L1: 4 questions on visible features (6.25% blind; always-yes 0%). L2: adjectives. Grandparent mode: the real Nani asks | Nani thinking aloud, her frames flipping with a clack, her triumphant "Hah!" or her baffled recount | Card: Nani's question frame (row 11: *[EN: Does yours have] {x}?*, not asked) with the feature word (F14–F22 asked; *hardar* real); the answers *haa* / *nar* | The only mini-game in any mode where **the game questions the player** about a picture they hold. Snap's 5d Nana's guess is one yes/no about a print; this is the whole chain, and `yesno` is shared with the clinic | 4 · 5 · 4 · 4 · 5 = **22** | **Keep** (the Eid party game; lab first until yes/no are recorded) |

#### Stage 4: Accuse

| Mini-game | What you do | Where the challenge is | Where the fun is | Where the instruction is | What is novel | Do · Ch · Fun · Ins · Nov | Verdict |
|---|---|---|---|---|---|---|---|
| **4a Point** (4c folded in) | Nani sits down: "so…" (the Thinking Chair pause), then *[EN: Who did it?]*. Tap one suspect, or say their name (L1) or the describing word (L2+, *nindho!*) and Ali points for you. Caught, or *[EN: Not me!]*. If more than one was still possible the solver marks it a guess: no ear star, coins for helping | Knowing you are sure. From L3 you may accuse before the cards run out, so the challenge is stopping at the right moment | The "so…" pause with everyone frozen; the caught hop; a wrong point gets an indignant *[EN: Not me!]* and, at L2+, the real culprit standing up on their own with a giggle (warm failure: the reveal still plays; the ear is lost) | Card: `[EN: Who did it?]` (A8.9 asked); *[EN: Not me!]*, *[EN: Caught you!]* (F29–F31 asked); the names are heard on tap | The **lucky-guess rule** (the solver knows whether the set was one) is nowhere else; the clinic's W1 taps a person with no such judgement | 5 · 3 · 5 · 4 · 4 = **21** | **Keep** (first set) |
| **4b Prove it** | After the point, Nani points at someone who sat down: *[EN: Prove it!]*; tap the clue card in the notebook that ruled them out; the card flies to that suspect and they shrug "fair enough". L4: Nani's recap as three picture chips (*who · what · trace*) graded as a whole with a gold "case closed" stamp (Duck Detective's deducktion, three chips not a sentence) | L3: which of 2–3 cards ruled *this* one out (33% per proof; two proofs 11%). L4: the chips | The Ace Attorney "present" beat; the stamp thumps | Card: the clue cards heard again; *[EN: Prove it!]* (F36 asked) | The only **present-the-evidence** mechanic in the game; the old G10 case board folds into its L4 | 4 · 5 · 4 · 4 · 5 = **22** | **Keep** (L3+) |
| 4c Say who | Say the name instead of pointing | Names carry no Kutchi at L1 | Ali pointing for you | The names | Shared `say`; nothing of its own | 4 · 2 · 3 · 2 · 2 = 13 | **Merged** into 4a as its mic option |
| 4d Set the trap | Choose the bait from a plate before pointing; the right bait draws the culprit out | The noun again | The Scooby-Doo tiptoe to the bait | Real nouns | The trap beat is new, but the pick is Cook `fetch` | 4 · 3 · 5 · 3 · 4 = 19 | **Maybe later** (an optional flourish at L3; not in the first build) |

#### Stage 5: Reveal, sorry, goodbye

| Mini-game | What you do | Where the challenge is | Where the fun is | Where the instruction is | What is novel | Do · Ch · Fun · Ins · Nov | Verdict |
|---|---|---|---|---|---|---|---|
| **The reveal** (one of the library, Q4) | The culprit picks it; one gesture; 10–20 s | Inside the reveal (a count, a size, a speed) | The comic caught moment | Inside the reveal | Per reveal | see Q4 | **Keep** (the library) |
| 5a Count them back | Tap each sweet into the box; the count is said | The number | The box whole again | Real numbers | None: Cook `count`; Tidy up's repack; Snap's tray count | 3 · 2 · 2 · 3 · 1 = 11 | **Folded into the reveals**: R2 and R12 *are* counts (the sweets fall out of the cap, fly out of the sneeze) and the child taps them; in the others the sweets go back on their own while Nani counts aloud (heard, not tested) |
| **5b Sorry, it's okay** (R18 folded in) | The culprit says *[EN: sorry]*; the others chorus *[EN: share!]*; Kasuku squawks it back. Nani turns to you: tap or say the reply from two pills (*[EN: it's okay]*, *[EN: share!]*); the culprit reacts to whichever you chose (a hug, or the sweets handed round) | Understanding the two replies; saying one (the voice star). Grandparent mode: Nani judges | The culprit's reaction changes with your reply; Kasuku gets the last word | Card: two pills; the words are **not asked yet** (row 10: add to Round 3); grey until then. *Achija!* (real) closes | The send-off feelings exchange is **deliberately shared** (`say`: the clinic E1–E3, Monsoon S5b, Dress up 6b, Tidy up 5c); ours is the only one where the reply is a **manners choice with a consequence** (forgive, or make them share) | 3 · 3 · 4 · 3 · 4 = **17** | **Keep** (pills until row 10 lands; the 5b speaking moment stays the first-session voice star) |
| 5c Share them out | Tap a sweet onto the right person: *Nana lai* | Kinship and *lai* | The hand-round | *{x} lai* real | None: Cook's chai tray and Snap's 5b Who wants which | 3 · 3 · 3 · 4 · 1 = 14 | **Cut** (5b's "share!" reply does the hand-round as a cutscene) |
| Goodbye | Nani's goodbye, the child's *Achija!* | — | — | Real | The shell's exchange, in every mode | — | Stays |

**Kept per stage:** 1 Dust rings · 2a Look closer, 2c Follow the prints · 3a Keep who fits, 3b You ask, 3c Tell Ali, 3d Nani guesses · 4a Point, 4b Prove it · 5b Sorry, it's okay + the reveal + goodbye. **Merged:** 1a into 1, 4c into 4a, 5a into the reveals, R18 into 5b. **Cut:** 2b, 5c. **Maybe later:** 1c Whose is it? (kinship words), 2d Ask around (Arc 4, past tense), 4d Set the trap (a flourish).

### Q4 The reveal library: 18 to 9

Scored on the same five questions. **Do** counts against a reveal whose gesture is the same as a stage's (the reveal should feel like a different kind of moment); **Novel** is against every other mini-game in the game, and "shared" names the mechanic reused on purpose. Every kept reveal is culprit-agnostic or covers a level-1 culprit, so every culprit has at least two from the first build.

| # | Reveal | What you do (one gesture) | The Kutchi | Do · Ch · Fun · Ins · Nov | Verdict |
|---|---|---|---|---|---|
| **R1** | **Zazu in the tiffin** | The lid lifts by itself; Zazu is inside, syrup on his whiskers. Nani: *Ba!* Wipe: a counted swipe across the whiskers; the cloth comes away the colour of the sweet (the first time the child sees *what* was eaten) | *ba*, *trae* (real); whiskers F22 | 4 · 3 · 5 · 3 · 3 | **Keep, first build** (Zazu's; Layla's favourite on paper). Shared: the counted rub is Monsoon S4b's `rub` |
| **R2** | **Nana's cap** | *[EN: Not me!]*; tap the cap; jalebi slide out one by one; tap each as it falls to catch it into the box; then Nani: *[EN: how many?]* and the child **says the number** | numbers said (the closed set 1–5, real) | 4 · 4 · 5 · 4 · 4 | **Keep, first build** (Nana's). New: the count is *discovered* by catching, then produced aloud. Shared: Cook `count` |
| **R3** | **Simba's yellow paws** (re-designed) | Simba sits on his paws; Nani: *Hardar!*; he lifts them, bright yellow; tap each yellow paw and it **stamps a print onto the clue card** in the notebook, which matches the smudge from stage 2 with a click. The count of yellow paws is said (*ba*: the front two; *char* at L3) | *hardar*, *ba / char* (real) | 4 · 4 · 4 · 4 · 4 | **Keep, first build** (Simba's). Changed: P3's press-and-hold pour on the right/left paw is gone (sides are the clinic's and press-and-hold is out); one tap per paw. New: the evidence *matches* the clue |
| **R4** | **Ali's pockets** (re-designed) | Ali turns his pockets out: sweets, a *limu*, an *ambo*, a spoon. Nani: *Muke limu de*; tap the *limu* and hand it back; *Muke ambo de*… until only the sweets are left; then they go in the box | *Muke {x} de* (real frame), the nouns (real); *pan* (also) at L2 | 4 · 4 · 4 · 5 · 3 | **Keep, next** (Ali's). Shared: Cook `fetch` and `passme`'s frame; the twist is that the decoys are the target and the sweets are what's left |
| R5 | Big Ma's handbag | Find the missing thing among ten | the crime noun | 3 · 3 · 3 · 4 · 1 | **Later**: it is Find it's search |
| R6 | Baby Isa's face | Wipe up, down, left, right as Nani calls it | directions (the clinic's) | 4 · 4 · 5 · 2 · 2 | **Later**: when the clinic's direction words land; shared `brush` (clinic H4/H16) |
| **R7** | **Kasuku the lookout** | Kasuku wasn't the eater: he was the lookout, and squawks back the culprit's order (*muke mithai khape!*) while pointing; tap who he points at | the order frame heard again | 3 · 4 · 5 · 3 · 5 | **Keep, L3 twist** (Kasuku's; the two-culprit case). Shared: `accuse` |
| **R8** | **The sofa cushion** (re-designed) | The stash is under a cushion; Nani: *nindho!* (the small cushion) or *ba!* (the second one); tap it to lift; the sweets are there, or a sleeping Zazu, then try the other | *wadho / nindho* (drafts), numbers (real); colours later | 4 · 4 · 4 · 4 · 4 | **Keep, next** (anyone's). Changed: colour (not asked) becomes size or count. Shared: `lift` (Tidy up, the clinic); the look-under is Clue Jr.'s and Roly's cow |
| R9 | The hen in the flour | Follow her prints back to the sack | *atto*, *pela … ne poi* | 4 · 3 · 4 · 3 · 2 | **Later** (Arc 3): it is 2c with a hen |
| R10 | The goat and the washing | Three tugs on the beat | *trae*; *[EN: pull]* | 4 · 2 · 5 · 2 · 4 | **Later** (Arc 3): a lovely tug-of-war but the Kutchi is one number and *pull* isn't asked |
| **R11** | **The cat in the milk pan** | The lid rattles; lift it **slowly** (a drag with a speed band): *aastethi* and the cat blinks up at you; *jaldi* and it bolts, try again | *aastethi / jaldi* (drafts) | 4 · 4 · 4 · 3 · 4 | **Keep, L3 twist**. Shared: the clinic's speed rows (H10, H17); ours is the only speed word on a lift |
| **R12** | **The sneeze** | Chilli powder on the culprit's nose; Nani: *Ba!*; tap the nose twice; "achoo": the sweets fly out; **tap them in the air to catch them** (Keepy Uppy) into the box; the tally counts your catches | *marcha* (real); counts (real) | 4 · 4 · 5 · 4 · 4 | **Keep, first build** (anyone's, so every culprit has two). New: the mid-air catch by tap; the count is the catch |
| R13 | The shoe mountain | Sweets out of only the big shoes | *wadho / nindho*; shoes | 3 · 4 · 3 · 3 · 2 | **Later**: Tidy up's shoe rack |
| R14 | The crow's nest | Pick the ring from the shiny things | the ring; shiny | 3 · 3 · 4 · 2 · 2 | **Later** (Arc 4): Find it's search |
| **R15** | **Nani did it** | (Rare, L3+, free play only.) "I was checking they were fresh"; tap her cheek; she gives you one | *[EN: fresh]*; *Achija* | 2 · 1 · 5 · 2 · 5 | **Keep, L3 twist**, the one kept for fun alone (UX 6: fun on its own, 8 s, cost 5); at most once a session |
| R16 | The muddy trail | Mop the prints in order | mud; *pela … ne poi* | 3 · 3 · 4 · 3 · 1 | **Later** (Monsoon): it is Monsoon S4d's mop |
| R17 | The cousin's school bag | Open the pockets in the called order | position and size words | 3 · 4 · 3 · 3 · 2 | **Later**: Tidy up's verb |
| R18 | The confession chorus | Say the reply | *sorry, it's okay, share* | — | **Merged** into 5b (it is 5b) |

**The library now:** first build **R1, R2, R3, R12**; next **R4, R8**; the L3 twists **R7, R11, R15**. Culprit coverage from the first build: Zazu R1 + R12, Nana R2 + R12, Simba R3 + R12, Ali R12 + R8 (R4 next), Kasuku R12 + R8 (R7 at L3). **Maybe later** (one line each, above): R5 handbag, R6 baby's face, R9 hen, R10 goat, R13 shoes, R14 nest, R16 mud, R17 school bag. Every reveal still ends the same way: the apology (5b), the sweets back (a cutscene unless the reveal counted them), *Achija!*.

### Q5 Distinctness across modes

Read against the "Pipeline design" sections of the clinic, Tidy up, Dress up, Snap and Monsoon rush (25 Sept).

| Ours | Nearest elsewhere | Verdict |
|---|---|---|
| 1 Dust rings | Find it's tap-the-one; Tidy up 1a Bring me; Duolingo-style three-way pick | Distinct: the target is an absence, matched by shape; `whichone` balances the decoys (shared on purpose) |
| 2a Look closer | Monsoon S3f / Find it's `dark` mask; the clinic D3's kit that reveals a find at the sore part | Distinct: the lens reveals a *property* of visible things; nothing else hides the colour and makes the word choose |
| 2c Follow the prints | Dress up 1b First… then; Monsoon S1b day strip; Snap 4c peg them up | Distinct: a size filter *and* an order on a path; the pan to stage 3 is the hand-over |
| 3a Keep who fits | Nothing | The mode's identity: clues combine |
| 3b You ask | The clinic E4 You ask (one question frame, one answer) | Distinct: a chain that narrows a set; `say` shared |
| 3c Tell Ali | Tidy up 1d, 3d; Dress up 5c; Snap 3d; Monsoon S3c; the clinic W3 | **Deliberately shared** `say`; ours is the only listener who deduces |
| 3d Nani guesses | Snap 5d Nana's guess; the clinic D1 *haa/nar* | Distinct: the chain; `yesno` shared with the clinic |
| 4a Point | The clinic W1 Bring in (tap a person) | Distinct: the lucky-guess rule and the "so…" pause |
| 4b Prove it | Nothing | Distinct |
| 5b Sorry, it's okay | The clinic E1–E3, Monsoon S5b, Dress up 6b, Tidy up 5c | **Deliberately shared** send-off `say`; ours is the manners pair with a consequence |
| Reveals | R1 Monsoon `rub`; R2/R3/R12 Cook `count`; R4 Cook `fetch` + *Muke {x} de*; R8 `lift`; R11 the clinic's speed band; R7 `accuse` | All shared on purpose; the comic picture and the Kutchi it carries are ours. Cut where the *whole* game was another mode's (R5, R14 Find it; R13, R17 Tidy up; R16 Monsoon; R6 the clinic's directions until they land) |

### Q6 Level-1 walkthroughs (the first set of each stage)

The first ever case, cast Simba, Zazu, Kasuku; Nani's voice; one word per stage. Onboarding by showing (UX 8) the first time only.

**Stage 1, Dust rings.** The request card is over the side table: Nani's face, the sweet box with one gap, *[EN: Who ate the sweet?]* lit chunk by chunk, a small fedora on the corner; the card shrinks into the left sidebar as the case card with one empty clue slot. On the table are three faint dust rings: a lemon's, a mango's, an onion's. Nani: "*Limu!*" (nothing else; `[EN: gone]` is grey on the card until the family gives it). The first time, everything dims but the rings and a ghost finger taps one, then lifts. The child taps the lemon ring: a puff of dust, Kasuku sneezes off-screen, the ring fills for a second with the ghost of a lemon, and the card's line *limu* ticks with a soft chime; the tally in the corner shows one ring. (A tap on the onion ring would puff dust and count nothing; at L1 only, Nani says *limu* once more.) The big button on the right, "Look for clues", lights; tap it and the camera drops to the floor.

**Stage 2, Look closer.** The kitchen floor by the box; three grey smudges; the magnifier lies at the bottom of the screen; the case card's single clue slot is empty in the sidebar. Nani: "*Hardar!*" The ghost finger drags the lens over one smudge and it blooms yellow with a soft whoom, then the finger lets go and the smudge goes grey again. The child drags the lens: over the white one it blooms white (flour), over the red one, red; over the yellow one, yellow and sparkling. They release the lens on the yellow smudge: a camera click, the smudge hops into the notebook's slot as a clue card, the slot ticks, and Nani says "*Hedo!*". The button "Go to the sofa" lights.

**Stage 3, Keep who fits.** Simba, Zazu and Kasuku stand behind the sofa, idle and identical in manner (a blink, a tail flick, no tells); their paws and Kasuku's feet are in plain sight, one pair yellow with turmeric, one white, one red. The clue card in the sidebar lights and Nani reads it: "*Hardar.*" The ghost finger, the first time, hovers over the line-up and taps nothing (the child must choose). The child taps Zazu, whose paws are yellow. With one clue the tap is the answer: Zazu steps forward with a gulp, the others sit with a sofa creak and their own huffs, and the clue card ticks. (Tap Simba instead and at L1 Simba steps forward, Nani says "*Hardar…*" once, and the tap can be changed; from L2 the case simply goes on.)

**Stage 4, Point.** Nani sits down on the arm of the sofa: "so…", everyone frozen for two beats, then *[EN: Who did it?]*. One is standing; the child taps Zazu (or says "Zazu" into the mic, which is offered from the first case). Zazu hops in the air, *[EN: Caught you!]*, and the "?" on the case card becomes his face. The solver notes the set was one: the ear star is earned, not guessed.

**Stage 5, R1 Zazu in the tiffin, then sorry, then goodbye.** The tiffin on the side table; its lid lifts by itself and Zazu is inside, whiskers dripping syrup, grinning. Nani: "*Ba!*" The child swipes the cloth across his whiskers twice; each swipe squeaks and the cloth comes away orange; the card's *ba* ticks on the second swipe. The sweet reappears in the box on its own while Nani says "*Hakro*". Zazu, sheepish: *[EN: sorry]* (grey until the family gives it); Kasuku squawks it back; two pills come up under the thumb, *[EN: it's okay]* and *[EN: share!]*; the child taps or says one; Zazu hugs the child's hand or hands the sweet round. Nani: "*Achija!*"; the child says it back. The end-of-round screen: the stopwatch, one green slot for each of the three tested taps (stage 1, 2, 3; stage 5 never tests), the hints badge gold, then the word review: *limu, hardar, ba, Achija*.

### Q7 What this changes in the pipeline design

- **P2:** stage 1 is one mini-game (Dust rings) plus Whose is it? later; 2b is cut; 3a loses its L2 lens option; 4c folds into 4a; 5a folds into the reveals; 5c is cut. The stage tables below stand for everything else (mechanics, levels, blind rates).
- **P3:** the library is the nine in Q4; R3, R4 and R8 as re-designed there; R18 is 5b.
- **P5:** the first ever session's stage 5 is "R1 or R3: wipe or stamp"; a five-year-old's whole first case is **four taps and one drag** (ring, lens, suspect, point, reply), plus the stage buttons.
- **P6:** `look-closer.js` splits into stage 2a only; nothing of it stays on the line-up screen. `count.js` for stage 1 becomes `rings.js` (`gap` with a tally). No `count-back.js`, `share.js`, `dropped.js`, `say-who.js`.
- **P8:** the file list and the phases are rewritten below to match (the edits are in place in P8).
- **The speaking moments** are unchanged in kind: 1 the number, 3b the question word, 3c the describing word, 3d yes/no, 4a the name or adjective, 5b the reply, R2 the count.

---

## Pipeline design, 25 Sept 2026

Follows `docs/modes/PIPELINE-BRIEF.md` (Zafar: "almost factory-like, a set process": every mode is a pipeline of stages, each stage a set of mini-games, stitched into one story with a beginning and an end), `docs/UX-PRINCIPLES.md` (the request card, the left sidebar, fixed-shape cards, the light bulb, one job at a time, start tiny, the end-of-round screen) and the deep dive's rules (modular mechanics, closed-set speaking with a fallback, the Sceptic). The clinic's pipeline (waiting room → diagnosis → pharmacy → heal → send-off) is the worked example; this is the same shape for a mystery: **something's missing → gather clues → question the suspects → accuse → the reveal and the apology.**

What changes from the deep dive: the four "kinds" (K1–K4) stop being separate mini-games and become **variants of one stage** (questioning), the magnifier moves to its own stage (gathering) before it is used at the line-up, and the case gets a real beginning (noticing what's gone) and a real end (the culprit caught, the sweets counted back, sorry said). Nothing in `js/who/case.js` is thrown away: it becomes the middle of the pipeline.

### P1 The pipeline

One case is one run through six stages. The child does one job per stage; a big button on the right ("Go to the sofa") moves to the next; what each stage produces is carried into the next, so the middle of the case is built from the beginning, never dealt from nowhere.

```
 [0 Request card]      [1 Something's missing]   [2 Gather clues]        [3 Question the suspects]  [4 Accuse]            [5 Reveal, sorry, goodbye]   [End-of-round]
  Nani's face; "Who     the sweet box: how many   the magnifier, the      the sofa line-up: keep     "Who did it?"         the caught moment; count       three badges;
  ate the sweets?";     are gone? what? whose?    dropped things, the     who fits / you ask /       point, prove it,      the sweets back; "sorry";       the word review
  read-along; shrinks   ─────────────────────►    prints; the notebook    you're the witness         or say the name       "it's okay"; goodbye
  into the sidebar      n missing = n clue slots  fills ──────────────►   ──────────────────────►    ──────────────────►   ──────────────────────────►
                        the case card             the clue chain          the standing set           the culprit           coins, the case book
```

| Stage | What the child does | What the Kutchi instruction carries | What is handed to the next stage |
|---|---|---|---|
| **0 Request card** | Watches and listens: Nani's face, the crime as a picture (the box with gaps), the question. Each recorded chunk lights as it is spoken. Then the card shrinks into the left sidebar as the **case card** | The question frame (*Who ate the sweets?*, F23) | The case card: one fixed-shape card with **n clue slots** (empty dots) |
| **1 Something's missing** | Looks at the scene of the crime and answers Nani's one question about it: how many are gone, or which thing is gone, or whose | Numbers (*hikdo, ba, trae*, real), the noun (*ambo, limu*, real), later the possessive (*Nana jo*) | **n**, the number of missing things, which sets how many clues the case needs (n = 1 at the first session, 2–4 later); the crime noun for the recap |
| **2 Gather clues** | Finds the evidence and hears Nani name it: the yellow powder by the box under the magnifier, the *limu* the culprit dropped, the big prints on the floor. Each finding becomes a **clue card** in the notebook (the sidebar) | The trace noun (*hardar, atto*, real), the held-item noun, the size adjective (draft), later the past tense | The **clue chain**: n clue cards in the notebook, all heard, none yet applied. The chain is generated by `case.js` exactly as now (balanced, shared values, no single clue solves from L2); stage 2 is how the child *meets* it |
| **3 Question the suspects** | At the sofa. Applies the clues to the line-up: keeps who fits and the rest sit; or asks the questions; or is the witness and gives the answers | The clue frames (F24–F28), yes/no (*haa* heard on 25 Sept; *nar* draft), the adjective with agreement | The **standing set** (one left at L1–2; at L3+ you stop when you are sure) |
| **4 Accuse** | Points ("You!"); from L3 proves it; from L2 can say the name or the describing word instead of pointing | *Who did it?* (A8.9), *Not me!* (F29), *Prove it!* (F36); the names | The **culprit**, and whether it was a lucky guess (the solver knows) |
| **5 Reveal, sorry, goodbye** | Watches the comic caught moment (the reveal library, P3), then helps: counts the sweets back into the box, wipes the whiskers, hears "sorry" and tells Nani it's okay (or says it to the culprit), goodbye | *Caught you!* (F31), numbers again, feelings words (*sorry, it's okay, happy*; G64), the goodbye (real) | The **end-of-round screen** (UX 9): time, accuracy, hints; then the word review; the case card into the case book |

**The hand-overs are the design.** Stage 1's count is stage 3's clue count and stage 5's count-back (the child hears *trae* three times in one case, each time doing something with it). Stage 2's clue cards are the very rows the child applies in stage 3, so a clue is heard twice (found, then applied) before it is ever tested, which is the stage-1-taught / stage-2-tested rule falling out of the structure instead of a glow. Stage 4's culprit picks the reveal. Nothing is shown in stage 2 that gives away stage 3: the scene evidence is always something *every* suspect could have (the balance rule), which is why stage 3 is still needed.

**One job at a time (UX 5).** Each stage is one screen and one verb: look, find, sort, point, help. The examine lens never appears on the line-up screen at L1–2 (the peek at paws is a stage-3 variant from L2); Done is in the sidebar; the big stage button is on the right.

### P2 Per stage: the mini-game variants

Each variant is a file (`js/who/stages/<stage>/<variant>.js`) over one or two mechanics, with levels as data (`stages.<stage>.<variant>.levels` in `data/who.json`), playable alone from the Case lab and from free play. "Reuses" names the mechanic file. Levels follow the deep dive's ladder (L1 a noun or a name; L2 the describing word with agreement; L3 not, and two things at once; L4 where and whose). Blind-bot rates are for level 1, best blind strategy, ear star.

**Stage 1: Something's missing** (the scene of the crime: the side table with the sweet box, the shelf, the hook)

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind |
|---|---|---|---|---|---|
| **1a How many are gone?** | The box has gaps; Nani asks *[EN: how many are missing?]*; the child taps each gap (a counted tap, the counter ticks) and then the number pill, or **says the number** (closed set of 3: *hikdo/ba/trae*) | Numbers 1–3 (real), 4–5 from L2 | L1: 1 gap; L2: 2–3 gaps among a full box; L3: two boxes ("how many *jalebi*?"); L4: "how many did *Nana* bring?" (possessive) | Cook `count` (the counted tap); shared `say` for the spoken number | 33% for the pill, 0% voice; not an ear row at L1 (taught), tested from L2 |
| **1b What's gone?** | The shelf or the hook with one empty place; Nani names what's gone (*[EN: the] limu [EN: is gone]*); tap the empty place that matches (each empty place has a faint dust ring the shape of the thing, so the noun decides: three rings, one word) | The noun (real: fruit, veg, spices; the cap and the glasses later) | L1: 3 rings, one word; L2: 4 rings, two words ("the *limu* and the *ambo*"); L3: *[EN: not the] ambo* | New `gap` (a tap on one of n outlined places; a `whichone` decoy set) | 33% |
| **1c Whose is it?** | The thing left behind is somebody's: *[EN: whose cap is this?]*; the child taps the owner from the family faces on the case card | Kinship and the possessive (*Nana jo*, asked E85–E99) | L3+ only (needs the words) | `lineup` in card form (the faces row) | 25% |

**Stage 2: Gather clues** (the kitchen floor and the side table; the notebook in the sidebar)

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind |
|---|---|---|---|---|---|
| **2a Look closer** | The magnifier is dragged over the scene; three smudges are on the floor (yellow, white, red); Nani says which one is the clue (*hardar*); drag the lens onto it and it snaps into the notebook as a clue card | The trace noun (real): *hardar, atto, tameto, marcha, dai*, mud (placeholder) | L1: one smudge named among 3; L2: two clues, look-alike groups avoided; L3: *[EN: not the]* white one | `examine` (the existing lens, in scene mode) | 33% per clue |
| **2b The dropped things** | A conveyor of things drifts past the box (the pharmacy-counter belt): the culprit dropped a *limu*, and Nani says so; grab it into the notebook. Decoys drift too | Held-item nouns (real); counts from L2 ("two *ambo*") | L1: 1 of 4 on the belt; L2: 2 of 6, one count; L3: a colour or size on the noun | Cook `fetch` (belt mode, as the clinic's pharmacy counter) | 25% |
| **2c Follow the prints** | Paw and foot prints lead from the box across the floor; some are big, some small; Nani: *[EN: the] wadho [EN: prints]*; tap the prints of that size in order from the box; the trail ends at the sofa (a nice hand-over: the camera pans to stage 3) | The size adjective (draft *wadho/nindho*, with agreement from L2: paws are he-words?); *first, then* (F41–42, and *pela … ne poi*, heard) | L2+: two sizes; L3: three (big, small, bird); L4: *pela* the small ones *ne poi* the big | New `trail` (tap-in-order along a path; the order is graded at the end, like `freePick`) | 12% (order of 3 among 2 sizes) |
| **2d Ask around** | Each family member says where they were (past tense); drag their face onto the room in the notebook; Nani's fact (*the ring was in the bedroom*) makes the clue card | S5 past tense and rooms (asked F32–F34, E49–E58) | L4+ (Arc 4) | New `notebook` (held from the deep dive's G8) | see deep dive G8 |

**Stage 3: Question the suspects** (the sofa line-up; the deep dive's four kinds, now four variants of one stage)

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind |
|---|---|---|---|---|---|
| **3a Keep who fits** (K2; K1 at L1) | The notebook's clue cards are applied one at a time: Nani reads the card, tap everyone who fits, Done; the rest sit down. At L1 with n = 1 this is exactly "who ate this one?" (K1): one card, one tap | The clue frames (F24–F28) with the noun or adjective that decides | L1: 3 suspects, 1 clue (the K1 shape); L2: 4–5, 2–3 clues, exact sets, agreement; L3: 6, "not", you ask for the next card, no-op clues; L4: relations | `lineup` (freePick commit), `accuse` | 3.7% (L1 with 3 items) / ≈2% at L2, as built |
| **3b You ask** (K3 reversed) | The clue cards are gone: the child chooses a question pill from the wall (*glasses? big? hardar?*) or **says it** (closed set 4–6); every suspect answers in a bubble chorus (*haa* / *nar*); the child taps the *haa*s forward; fewest questions wins the craft star | The question words (F14–F22 features, adjectives); yes/no heard many times | L3+ (Ruggeri: halving questions are an 8+ skill); L4: two-slot questions | shared `say`, `lineup`; the chorus is a lineup state (`answers`) | 6% for the ear (four *haa/nar* sorts) |
| **3c Tell Ali** (K4, you're the witness) | The child has the dealt card (saw who did it); Ali asks *[EN: what was it like?]*; the child says one word from the closed set; Ali sits down whoever doesn't fit and points when one is left; wrong word, wrong people sit, "nobody's left", again | The describing word or noun, **said** | L1 (its own free-play entry from day one): nouns; L2: the adjective; L3: choose which clue to give | shared `say` (`tell` stub today), `lineup` | 0% voice by pills, as built |
| **3d Nani guesses** (K3, you're the witness) | The dealt card again, but Nani is the detective: she asks yes/no questions in Kutchi; the child says *haa* or *nar* (or taps ✓/✗); her mini line-up empties; she guesses; a wrong answer makes her guess wrong and say why | Understanding the question; saying yes/no (*haa* real from the 25 Sept recording; *nar* draft) | L1: 4 questions on visible features; L2: adjectives; Grandparent mode: the real Nani asks | new `guesswho` (Nani's question chain and mini line-up, `case.askNext`), shared `yesno` | 6.25% (random ✓/✗); 0% for always-yes |

**Stage 4: Accuse**

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind |
|---|---|---|---|---|---|
| **4a Point** | Nani: *Who did it?*; tap one; caught or *Not me!*; a lucky guess (more than one still possible) never earns the ear | *Who did it?* (A8.9), *Not me!*, *Caught you!* | L1+ | `accuse` | 0% ear (the lucky-guess rule) |
| **4b Prove it** | After the point, Nani points at someone who sat down: *Prove it!*; tap the clue card in the notebook that ruled them out | *Prove it!* (F36); the clue heard again | L3+ | new `prove` (a tap on the notebook rows) | 33% per proof; two proofs 11% |
| **4c Say who** | Instead of pointing, say the culprit's name (closed set: the names in the line-up) or, from L2, the describing word (*nindho!*); Ali or Nani points for you | Names (no Kutchi) at L1; the adjective at L2 | L1 names for the mic's first outing; L2+ for the voice star | shared `say`, `accuse` | 0% voice by pills |
| **4d Set the trap** (later) | Before pointing, choose the bait from a plate (the thing the culprit held or ate): the right bait and the culprit comes forward on their own (the Scooby-Doo trap beat) | The noun again | L3+, an optional flourish; not in the first build | Cook `fetch`, `whichone` | 25% |

**Stage 5: Reveal, sorry, goodbye** (the reveal itself is drawn from the library in P3; then two short helping beats and the goodbye)

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind |
|---|---|---|---|---|---|
| **5a Count them back** | The culprit hands the sweets back one by one; the child taps each into the box and the count is said; the box is whole again (the hand-over to Tidy up's repack in Arc 1 Ch3, which stays Tidy up's) | Numbers (real); the sweet's name when the family gives them | L1: 1 (the first session); L2: 2–3; L3: two kinds, two counts | Cook `count` | none tested (a closing beat) |
| **5b Sorry and it's okay** | The culprit says *[sorry]*; Nani turns to the child: the child says (or taps) the reply from a closed set of two or three: *[EN: it's okay]*, *[EN: share!]*, *[EN: naughty!]* (a joke option the cats love); the culprit reacts to whichever was said | Feelings and manners words (*sorry, it's okay, happy* G64; *share*: not asked yet) | L1: two pills; L2: three, said aloud; Grandparent mode: Nani judges | shared `say` (closed set 2–3) | none tested; the voice star only |
| **5c Share them out** | The recovered sweets go round the family: *[EN: one for] Nana*, *ba* for Ma; tap the sweet onto the right person | Kinship names and *{person} lai* (heard 25 Sept), counts | L2+ | Cook's chai-tray pass (`assemble` serve step) | 25% per hand-out |
| **Goodbye** | Every case ends with Nani's goodbye and the child's reply (*Achija!* real), then the end-of-round screen | The goodbye | always | shell exchanges | — |

**Speaking moments in the pipeline** (all on `js/shared/say.js`, `listen({choices, timeoutMs})`; a fallback always visible; never blocking; the voice star only from the mic or a parent's tick): 1a the number (3 choices), 3b the question word (4–6), 3c the describing word (3–6), 3d yes/no (2), 4c the name or adjective (3–6), 5b the reply (2–3). At least one speaking moment is offered in every case from L1 (1a or 5b), so the voice star is reachable in the first session.

### P3 The big library: the reveal (the caught moment and the confession)

The clinic's pool of fun is its 15–20 healing games; this mode's is the **reveal**: what happens when the culprit is caught. Each is a 10–20 s comic beat with **one small thing for the child to do**, so it is a mini-game and not a cutscene, and each carries Kutchi through its instruction (a count, a side, a noun, a colour). The culprit chosen in stage 4 picks the reveal; every culprit has at least two, so the same culprit caught twice is not the same picture. Scores 1–5: **Fun** (would Layla laugh; would Zayn still), **Kutchi** (how much the instruction decides), **Cost** (5 = cheap: composed from existing sprites and a reused mechanic). Age fit lists the ages it lands for.

| # | Reveal | One-line pitch | The child does (mechanic) | Kutchi it teaches | Age | Fun | Kutchi | Cost |
|---|---|---|---|---|---|---|---|---|
| R1 | **Zazu in the tiffin** | The lid lifts by itself; Zazu is inside with syrup on his whiskers | Wipe his whiskers: rub *ba* times (Cook `knead`'s rub, counted) | *ba*, *trae*; whiskers (F22) | 5, 8 | 5 | 3 | 5 |
| R2 | **Nana's cap** | Nana insists "Not me!"; a jalebi slides out from under his cap | Tap the cap; count the sweets that fall (Cook `count`) | numbers; cap (F17); *Not me!* | 5, 8, 11 | 5 | 3 | 5 |
| R3 | **Simba's yellow paws** | Simba sits on his paws; they are bright yellow | Wash them: pour water from the jug onto the *right* paw, then the *left* (Cook `pour`; sides as the clinic's R3.2 rule) | *hardar*; right / left; paw | 5, 8 | 4 | 4 | 4 |
| R4 | **Ali's pockets** | Ali turns his pockets out: sweets, a *limu*, a marble, a spoon | Pick out only the sweets: *[EN: the] mithai* (Cook `fetch` from the pile) | the sweet's name; nouns as decoys | 5, 8 | 4 | 4 | 5 |
| R5 | **Big Ma's handbag** | Big Ma opens the enormous handbag: everything is in there | Find the missing thing among ten: *[EN: the] ambo* (Cook `fetch`, look-alikes from `whichone`) | the crime noun again | 8, 11 | 4 | 5 | 4 |
| R6 | **Baby Isa's face** | Syrup from ear to ear; he laughs | Wipe: up, down, left, right as Nani calls it (a called-direction rub; the clinic's teeth-brushing idea) | up / down / left / right (A8.11 here/there; the clinic's sides) | 5 | 5 | 4 | 4 |
| R7 | **Kasuku the lookout** | Kasuku wasn't the eater: he was the lookout, and he squawks back the culprit's order (*muke mithai khape!*), pointing at the real one (a two-culprit twist at L3) | Tap who Kasuku is pointing at (`accuse`) | the order frame heard again | 8, 11 | 4 | 3 | 4 |
| R8 | **The sofa cushion** | The culprit's stash is under a cushion | Lift the cushion Nani names: *[EN: the] lal [EN: one]* (colour; a lift as Tidy up's and the clinic's `lift`) | colours (asked Q11) | 5, 8 | 4 | 4 | 4 |
| R9 | **The hen in the flour** (Arc 3) | White footprints everywhere; the hen sneezes flour | Follow her prints back to the sack (`trail`) | *atto*; *pela … ne poi* | 5, 8 | 4 | 4 | 3 |
| R10 | **The goat and the washing** | The goat has a sock; it will not let go | Tug: three pulls, on the beat (a pull gesture on Cook's `stir` track logic; counted) | *trae*; *pull* (not asked) | 5, 8 | 5 | 2 | 3 |
| R11 | **The cat in the milk pan** | The lid rattles; a tail | Lift the lid *slowly* (*aastethi*, draft): too fast and the cat bolts, try again (the clinic's `lift` with a speed band) | *aastethi / jaldi* (drafts) | 5, 8, 11 | 4 | 4 | 4 |
| R12 | **The sneeze** | The culprit has chilli powder on their nose | Tickle the nose *ba* times; "achoo": the sweets fly out; catch them (tap them in the air, counted) | *marcha*; counts | 5, 8 | 5 | 3 | 4 |
| R13 | **The shoe mountain** | A sweet in every shoe | Take the sweets out of only the *big* shoes (Tidy up's shoe pairs; `whichone` by size) | *wadho / nindho*; shoes | 8 | 3 | 5 | 3 |
| R14 | **The crow's nest** (Arc 4) | The nest is full of shiny things; the ring is one of them | Pick the ring out from the spoons and foil (Cook `fetch`) | the ring; *shiny* (later) | 8, 11 | 4 | 3 | 3 |
| R15 | **Nani did it** | (Rare, L3+) Nani: "I was checking they were fresh"; everyone laughs | Tap Nani's cheek; she gives you one | *[EN: fresh]*; *Achija* | 8, 11 | 5 | 1 | 5 |
| R16 | **The muddy trail** (Monsoon) | Wet prints across the clean floor to a dripping culprit | Mop the prints in order (Monsoon rush's mop if it exists, else `trail`) | mud (placeholder), *pela … ne poi* | 5, 8 | 4 | 3 | 3 |
| R17 | **The cousin's school bag** | The older cousin's bag: books, a lunchbox, the sweets | Open the pockets in the called order: the *front* one, then the *big* one | position and size words | 8, 11 | 3 | 4 | 4 |
| R18 | **The confession chorus** | The culprit says *[sorry]*, the others say *[share!]*, Kasuku squawks it back | Say the reply (5b) | *sorry; it's okay; share* | all | 4 | 4 | 5 |

**First set of reveals for the build:** R1, R2, R3, R4, R12, R18 (all Cost 4–5, all from existing sprites and Cook's `count`, `knead`, `pour`, `fetch`). R7, R11, R15 are the L3 twists. R9, R14, R16 wait for their arcs. Every reveal ends the same way: the culprit's apology line, the child's reply (5b), the sweets back (5a), goodbye. The reveal is never gory or shaming: culprits laugh, the frame is "who ate / who took / who moved", never *chor* (Nani's Loop 1 note stands).

### P4 Research: what children's detective, mystery and Guess Who games do

Read on 25 Sept 2026 (web search; some pages only through their summaries). The earlier table in section 2.1 (Cluedo, Clue Jr., Outfoxed, Carmen Sandiego, Obra Dinn, Ace Attorney, Golden Idol, Papers Please, Layton) still stands; this adds what matters for a pipeline.

| Game | What it does | What we take into the pipeline |
|---|---|---|
| **Blue's Clues** (the show and its games) | A fixed ritual every episode: Blue leaves a paw print on three things; each is drawn into the handy-dandy notebook; after **exactly three clues** the host sits in the Thinking Chair and reasons aloud to the answer. The fixed count and the chair are the structure a pre-schooler learns to expect | The notebook that fills in stage 2 (UX 3: a case card with a fixed number of clue slots per level, so the child always knows how many are still to find); the pause before accusing (stage 4 opens with Nani sitting down: "so…"); the reasoning aloud is Nani's recap in Kutchi |
| **Guess Who?** (Hasbro; the digital *Meet the Crew* app; WhoTF) | Yes/no questions; flip down whoever is ruled out; a visible board that empties; the child's job is to *ask*, the opponent's to *answer*. The digital versions play the computer as the opponent and ask the questions for younger players | Stage 3's two witness variants (3c, 3d) and 3b You ask; the line-up that empties is already the sofa |
| **Clue Jr.: The Case of the Missing Cake** (3–8) | Roll, move, **look under** characters and furniture; the crumb picture under one base says who; a three-part answer (who, what time, what drink); a detective notepad | Stage 2 Look closer (the lens finds what's under things); stage 1's "what and how many" as the first parts of a three-part case; the notebook rows |
| **Outfoxed!** (5+, co-operative) | Each turn: search for clues **or** reveal suspects; a clue token in the **decoder** shows a green or white dot for one feature of the thief; the fox moves towards escaping every failed roll, so the game has a clock; suspect cards show features openly and are eliminated by matching | Stage 2 and stage 3 are Outfoxed's two actions split into a fixed order for L1 (search, then reveal), and merged back at L3 ("ask for the next card when you want"); the decoder is "one fact per clue"; the escaping fox is **Busy mode's ring** (Nani's chai going cold, or the culprit tiptoeing towards the door); co-op with Nani |
| **Scooby-Doo Mystery Cases** (WB, 2018) | Find clues in cluttered scenes, mini-games, **build a trap**, then **unmask** the villain; no lives, encouragement to retry; costumes as rewards | The reveal library is the unmask; 4d Set the trap as a later flourish; Scooby snacks = the case book and pocket money, never lives |
| **Toca Mystery House** (Toca Boca) | No reading, no failure; explore rooms; everything reacts; the spooky-but-safe tone for 5–8 | Stage 1 and 2 as exploration with one question attached; every tap on the scene reacts (a smudge shimmers, a print squelches) even when it isn't the answer |
| **Criminal Case / Suspects: Mobile Detective** (adult casual mysteries) | The genre's beats in order: scene → evidence → **interrogate** suspects → arrest; witnesses answer in short lines; the case file accumulates | The stage order itself; 3b's chorus of short answers; the case file is the notebook |
| **Keiki, pastory and classroom "mystery for kids" lists** | For 3–5: "what's missing?" games, 2–3 step clues, footprint trails; whodunits with five suspects and one guilty for 9–13 | Stage 1 "what's missing" as the entry mini-game for 5; five suspects and "not" for 8+; footprint trails (2c) as the bridge between |

**Mechanics worth borrowing, in one line each:** the fixed clue count and the notebook (Blue's Clues); search-or-reveal as a player choice at higher levels, and a clock as the villain escaping (Outfoxed); look under things (Clue Jr.); the unmask with a trap before it (Scooby-Doo); no failure, everything reacts (Toca); the interrogation chorus (Criminal Case). Not borrowed: dice and movement (Clue Jr., Outfoxed), picture clue bubbles (Outfoxed's decoder shows the feature; ours are spoken), 24 faces (Guess Who; 6 at most on a phone), lives.

### P5 Stitching: a session, the first ever session, and free play

**A session is an afternoon at Nani's: three cases through the whole pipeline**, about 4–5 minutes, each case 60–100 s. The three are picked from the player's weakest words and rise a little: case 1 at the player's level, case 2 with one more clue or one more suspect, case 3 with a twist reveal (R7, R11, R15) when the level allows. The culprits differ across the three (data: `session.no_repeat_culprit`). Between cases Nani's one line ("*Arre re!* Something else is gone…") is the only transition; the request card of the next case is the beat. The end-of-round screen (UX 9) comes **after every case**, not only at the end of the session, because the stopwatch and the accuracy jar are per case; the session ends with the case book page turning to show three new cards.

**The first ever session is one tiny case** (UX 7), about 60 s, with nothing to learn but one word per stage:

| Stage | The first time | Words heard |
|---|---|---|
| 0 | Nani's face; the box with **one** gap; "Who ate the sweet?" read along; the card shrinks | the question |
| 1a | Tap the one gap; the counter says *hikdo*; nothing else on the table | *hikdo* |
| 2a | The lens is already on the floor; one yellow smudge and one white; Nani: *hardar*; drag the lens onto it; it hops into the notebook's single slot | *hardar* |
| 3a | Three cats-and-parrot at the sofa; the notebook card is read: *hardar*; tap the one whose paws are yellow (the paws are visible at L1: no lens on this screen); Done is not needed with one clue, the tap is the accusation (the K1 shape) | *hardar* again |
| 4a | The caught hop; "Caught you!" | *Caught you!* (placeholder) |
| 5 | R1 or R3: wipe or wash, *hikdo* time; the sweet back in the box; sorry; tap "it's okay"; *Achija!* | *hikdo*, *Achija* |

Onboarding is by showing (UX 8): the ghost finger does the lens drag once, then the child does it; the sidebar, stars and light bulb fade in over the first three cases. From the second session the case has two gaps and two clue slots; each level adds one thing (a suspect, a clue, a count, a twist), never two.

**Free play dips into single stages** from the sofa ("Nani's mysteries"): any stage variant at any unlocked level runs on its own with a generated case behind it (stage 3d Nani guesses is the Eid party game; 3c Tell Ali the witness game; 2a Look closer for Layla; 3b You ask for Zayn; the reveal library as "Catch them again!" for Maryam's case book). The hub's **60-second round** is stages 3 and 4 only (one clue chain at the sofa, then the point): the deep dive's K1/K2 case as built today. Grandparent mode runs 3d and 5b with the real Nani judging.

**Busy mode** (from L2) is Outfoxed's escaping fox: the culprit's shadow tiptoes towards the door across stages 2–4; help rungs and dawdling move it; if it reaches the door the case still ends (the culprit is caught at the door, a different reveal), only the Quick star is lost.

### P6 What survives from the current build

The phases 0–1 build (`build/reports/who-build.md`, branch `claude/build-who`) is the middle of this pipeline. Concretely:

| File | Verdict | What changes |
|---|---|---|
| `js/who/case.js` | **Keep, extend** | The generator, solver, grader, `askNext`, `actOn` and `stars` stay as they are. Add a `plan(P, {level, seed, session})` that returns the case's stage list with a variant per stage and the shared facts (n missing, the crime noun, the culprit, the reveal id), so stages 1, 2 and 5 are graded by the same seeded state; add graders for `count` (stage 1a, 5a), `gap` (1b), `find` (2a, 2b: the clue named among decoys), `trail` (2c), `reply` (5b). `stars()` gains the accuracy count (right out of total taps across stages) for the end-of-round badge. Ear rows come from stages 1–4; stage 5 never tests |
| `js/who/flow.js` | **Change** | Today it runs one `games/<file>.run(ctx)`; it becomes `pipeline.js`: runs `plan()`'s stages in order, mounts each stage's zones, shows the stage button between them, calls the shared end-of-round screen. The lab gains a stage picker (`?stage=1a|2c|3b…`) and a "whole case" mode |
| `js/who/games/one-each.js` | **Fold** | Its K1 loop (`runK1`, `sayClue`, `recast`, `intro`) becomes stage 3a at level 1 (`stages/3-question/keep-who-fits.js` with n = 1). The intro card becomes the request card at stage 0 (`stages/0-card.js`) with read-along |
| `js/who/games/keep-who-fits.js` | **Keep** as `stages/3-question/keep-who-fits.js` | Reads its clue chain from the notebook (stage 2's output) instead of saying each clue fresh; `sayClue` reads the card |
| `js/who/games/look-closer.js` | **Split** | The lens over paws at the sofa stays as a stage-3a level-2 option (`examine` in lineup mode); the lens over the *scene* is the new stage 2a (`stages/2-gather/look-closer.js`), `examine` in scene mode (targets from `data/scenes/crime.json` instead of the line-up) |
| `js/who/games/tell-ali.js` | **Keep** as `stages/3-question/tell-ali.js` | Unchanged logic; the dealt card is shown by stage 0's card instead of its own; `Who.Tell` → `Say` |
| `js/who/mechanics/lineup.js` | **Keep** | Add the `answers` state (3b's chorus bubbles) and a `slotsPhone` of 5 when the stage button shares the right edge |
| `js/who/mechanics/examine.js` | **Keep, add a mode** | `mount(world, targets, …)` where targets are either the line-up (today) or scene spots; the snap-into-notebook animation |
| `js/who/mechanics/accuse.js` | **Keep** | Adds the "so…" pause and hands the culprit to the reveal |
| `js/who/suspect.js`, `js/who/ui.js` | **Keep** | `ui.js` loses the per-row translate/eye buttons (UX 4): one speaker per card, the light bulb at the top of the sidebar; the ladder becomes the notebook with fixed slots |
| `js/who/stubs/whichone.js` | **Go** | `WhichOne.balance` landed in `js/shared/whichone.js` (the foundation report says it matches this shape) |
| `js/who/stubs/tell.js` | **Go** | `js/shared/say.js` is finished: same rules (one retry, then pills; Grandparent ✓; `via`). Swap per `docs/shared-api.md` section 6 |
| `data/who.json` | **Keep, extend** | `people`, `attributes`, `clue_types`, `lines`, `mechanics`, `star_set`, `coins` stay. `games` becomes `stages` (each stage: its variants with `levels`), plus `reveals` (R1–R18 with culprit, mechanic, lines), `session` (cases per session, the rise, no-repeat), `crime` (what can go missing: the sweet box, fruit from the bowl, Nana's cap) |
| `data/scenes/sofa.json` | **Keep**; add `data/scenes/crime.json` | The side table with the box (stage 1), the floor with smudges and prints and the belt (stage 2), on the same 1600×900 camera E; the stage button moves the camera, no pan |
| `build/leak_who.mjs` | **Keep, extend** | Adds stage 1–2 strategies (random gap, random smudge, first print) and a whole-pipeline run: the pipeline's ear star needs every tested row across stages, so blind rates **fall** (stage 1 × stage 2 × stage 3 ≈ 0.4% at L1), which the bot must reproduce |
| `build/test_who.py` | **Keep, extend** | `--stage <id>` runs one variant; `--case` runs the whole pipeline with one deliberate mistake per stage; six sizes as now |
| The leak rules, the lucky-guess rule, the draft flags, the K3 generator | **Keep** | Unchanged |

Gone: the mini-game as the top-level unit (G1–G5 are now variants 3a-L1, 3a, 3a+2a, 3d, 3c), the per-game intro card, "Case of the day" (already gone), the per-row translate and eye buttons, `js/who/stubs/`.

### P7 Words needed (priority order)

"Asked" is in `docs/Nani jo Ghar — Questions for Mum (Combined, for the visit).md` (not edited). "Heard" is on the 25 Sept recordings (`docs/kutchi-grammar-notes.md`) and needs only Zafar's spelling check. Spelling rule from Zafar: no V, so the drafts are *wadho / nindho*.

| # | Kutchi needed | For | Status |
|---|---|---|---|
| 1 | Numbers 1–5 as gendered *hakro/hakri* and *ba* (not *hikdo/bo*) | 1a, 5a, the reveals | **Heard** (grammar notes 2–3); the game's `num-01/02` need the change |
| 2 | Trace and held-item nouns (*hardar, atto, tameto, marcha, dai, limu, ambo, dungri…*) | 2a, 2b, 3a | **Real** (`data/cook.json`) |
| 3 | yes (*haa*) / no (*nar*) | 3b, 3d, 5b | *haa* **heard** (grammar notes 7); *nar* draft (B1); asked A8.1–A8.2 |
| 4 | big / small with agreement (*wadho/wadhi, nindho/nindhi*) | 2c, 3a L2, 3c L2, R13 | Draft (B6, B7); agreement asked C22–C36 |
| 5 | *this* (*hi*), *take* (*khan*), *give me* (*muke … de*), *for* (*lai*), *also* (*pan*), *first … and then* (*pela … ne poi*) | 2b, 2c, 5a, 5c | **Heard** (grammar notes 6–9) |
| 6 | Who ate the sweets? · Who did it? · It was the big one · It wasn't … · It had turmeric on its paws · It was holding … · The one with the glasses | Stage 0 and the clue cards | Asked (F23–F28, A8.9) |
| 7 | Not me! · You're right! · Caught you! · Prove it! | Stage 4 | Asked (F29–F31, F36) |
| 8 | glasses, beard, cap, headscarf, bell, collar, tail, paw, whiskers | 3a `has`, 3b, R1, R3 | Asked (F14–F22) |
| 9 | **How many are missing? · It's gone / missing · Whose is this? · Pick it up · Look! · Footprints / prints** | Stages 1–2 | **Not asked: add to Round 3** |
| 10 | **Sorry · It's okay / never mind · Share! · Give it back · Naughty! (fond)** | 5b, R18 | **Not asked: add to Round 3** (only *happy* G64 exists) |
| 11 | Ali's echo and prompts (*What was it like? · The {x} one? Right. · Nobody's left! · Again?*); Nani's question frame (*Does yours have {x}? · Is yours {adj}?*) | 3c, 3d | Not asked (the deep dive's rows 8–9): Round 3 |
| 12 | right / left, up / down, slowly / quickly | R3, R6, R11 | The clinic asks sides; *aastethi / jaldi* drafts |
| 13 | Sweet names for the box | 1b, 5a, R4 | Asked (the sweets voice note, questions doc line 567) |
| 14 | Kinship titles, rooms, past tense, time words | 1c, 2d, later | Asked (E85–E102, E49–E58, F32–F34, F37–F43, C116–C136) |

Recording for the closed sets: rows 1, 3 and 4 first (about 12 words, five takes each from two or three speakers), then row 10, which is the family's own manners and will sound like them.

### P8 Build brief (rewritten for the pipeline; phased; own files first)

Nobody edits `js/cook/*`, `js/shared/*` or `css/cook.css`. Shared pieces are used through `docs/shared-api.md`: `WhichOne` (landed), `Say` and `Speech` (landed), `Stars` (landed), `Overlay` (landed), `Rel` (phase 4 only). Still assumed from the foundation: the shell's one save and story beats, the **request card with read-along** and the **end-of-round screen** (UX 1 and 9 say they are shared components; until they land this mode carries a local `js/who/card.js` and `js/who/roundend.js` with the same data shape: chunks with timings; `{ms, right, total, hints}`), and the onboarding kit (UX 10).

Files this mode owns:

```
who.html                                   page + Case lab (?lab=1&stage=<id>|case)
js/who/case.js                             generator, solver, grader, plan()        (pure; Node and browser)
js/who/pipeline.js                         runs plan()'s stages; the stage button; the lab   (replaces flow.js)
js/who/stages/0-card.js                    the request card (local until shared)
js/who/stages/1-missing/{count,gap,whose}.js
js/who/stages/2-gather/{look-closer,dropped,trail,notebook}.js
js/who/stages/3-question/{keep-who-fits,you-ask,tell-ali,nani-guesses}.js
js/who/stages/4-accuse/{point,prove,say-who,trap}.js
js/who/stages/5-reveal/{reveal,count-back,sorry,share}.js   (reveal.js runs a library entry from data)
js/who/mechanics/{lineup,examine,accuse,prove,guesswho,gap,trail}.js
js/who/{ui,suspect,roundend}.js  css/who.css
data/who.json                              + stages, reveals, session, crime
data/scenes/sofa.json  data/scenes/crime.json
build/leak_who.mjs  build/test_who.py
```

| Phase | Playable | Files | Done when |
|---|---|---|---|
| **0 Logic** | `plan()` and the stage graders in `case.js`; `stages`, `reveals`, `session`, `crime` in `data/who.json`; the whole-pipeline leak bot | Own only | `node build/leak_who.mjs --case --rounds 10000`: every stage's blind rate at or under P2's figures; the pipeline ear star under 1% at L1 and under 0.5% at L2; culprit and reveal uniform; every case's clue chain still passes the deep dive's rules |
| **1 The greybox pipeline** | One variant per stage at L1–2 through the whole case: 0 card, 1a, 2a, 3a, 4a, 5a + R1/R2/R3 + 5b (pills) + goodbye; the notebook with fixed slots; the light bulb; one speaker per card; the local end-of-round screen; the first-ever session as data | Own only | `test_who.py --case --level 1,2 --viewport all` passes with one deliberate mistake per stage; screenshots checked; a five-year-old's path is three taps, one drag, one tap, one tap |
| **2 Variants and speaking** | 1b, 2b (Cook `fetch` in belt mode), 2c `trail`, 3c (on `Say`), 3d (`guesswho` + `yesno`), 4b `prove`, 4c, 5b said aloud, 5c; Busy (the tiptoeing shadow); L3 of 3a (ask for the next card, no-op clues) | Own only (`Say` is landed) | `--stage` runs for every variant; the `null`/"Again?" path; the voice star only by mic or parent; bot rates hold |
| **3 Art, story, free play, the session** | Real sofa and crime scene, overlays from `Overlay`; the reveal set R4, R12, R18 then R5–R8; Arc 1 Ch3 as a full case (stage 1 the box, 2a the spilt spices, 3a, 4a, R1, then the hand-over to Tidy up's repack); Ch5 as 3d alone; "Nani's mysteries" with sessions, single stages and the 60-second round; the shared card and round-end swapped in; Grandparent mode | Own + the shell's registration | `--free 3 --story a1c3`; art QA; a session of three cases in under 5 minutes |
| **4 S5 and the door** | 2d notebook (Arc 2 Ch4, Arc 4 Ch1–2), 1c whose, 3b at L3, R9/R14/R16, the fibbing and case-board finales from the old W6–W7, G7 the door if the front-door scene exists | Own + `front-door.json` + `Rel` (read) | All bot rates under 10% |

The first three tasks are unchanged in spirit from section 12.4: task 1 is `plan()` plus the data and the bot; task 2 is the greybox pipeline with the K1-shaped first session; task 3 is the harness. Onboarding scripts per stage are written at the end of phase 2, when the mechanics have stopped moving (UX 10).

### P9 Decisions for Zafar (only what blocks the build), each with a default

1. **The ending beats come back.** The deep dive rejected "empty your pockets" as Tidy up's; the pipeline needs a real end, so 5a counts the sweets back (three taps) and 5b says sorry / it's okay, and the arranging stays Tidy up's. **Default: yes, both, tiny.**
2. **Stage 1 at the first session: one gap, or three?** One gap means the first case has one clue (the K1 tap) and one count; three means the deep dive's 3 × 3 shape from the start. **Default: one**, per UX 7 ("each level adds one thing"); the 3 × 3 case is the second session.
3. **Nani guesses (3d) and Tell Ali (3c) as stage variants, or as their own games?** As variants they share the pipeline's beginning and end (the dealt card is shown by the request card; the reveal follows); as their own games they stay 60 s. **Default: variants in a session, and single-stage entries in free play**, so both are true.
4. **Can Nani be the culprit (R15)?** A twist the older children will love; it breaks "Nani gives the clues" once. **Default: yes, from L3, at most once a session, and only in free play** (never in a story chapter).
5. **The speaking reply in 5b: two pills or three?** "Naughty!" (fond) is the joke option and the one children will choose; it needs a word the family may not want taught. **Default: two (*it's okay*, *share!*) until Mum answers row 10**; the joke waits.

---

## Deep dive, 25 Sept 2026: mini-games and mechanics

Follows `docs/modes/DEEP-DIVE-BRIEF.md` and Zafar's principles of 25 Sept (mini-games; modular mechanics as files; speaking as a core part; all modes built at once; the Sceptic). Addresses every critique in `docs/modes/REVIEW-2026-09-25.md` (D7). Drafted words from `data/cook.json` (*vadho, nindho, nar*) are shown in italics with "(draft)".

### D1 Pitch and the kinds of round

**Pitch.** Something's happened in Nani's house and the suspects are lined up behind the sofa; every fact about who did it is *said*, in Kutchi, and you act on it: keep who fits, peek at paws, answer Nani's questions, or tell Ali what you saw. One solver runs it all: the game always knows which suspects are still possible, so it can grade a commit, catch a lucky guess, drive Nani's own line-up when she's guessing, and act out Ali's line-up when the child speaks.

**The backbone: four kinds of case, one engine.** A case is `{suspects, truth, clues[]}` and the solver gives the consistent set after each clue. The kinds differ in **who gives the facts and who acts on them**, the way the clinic's visit types differ in who speaks.

| Kind | Who says the Kutchi | Who acts | What the child does (60–120 s) | Where it lives |
|---|---|---|---|---|
| **K1 One each** (*Who ate this one?*) | Nani | The child | Three things are missing; one clue per thing; tap the one it names. Honest about itself: it's "pass me" with people, plus a caught reaction per item. The tutorial shape | L1 of every mini-game; the first minute of Arc 1 Ch3 |
| **K2 Keep who fits** (the line-up) | Nani | The child | Clue by clue, tap everyone who fits, Done; the rest sit. From L3 you ask for clues, send people away yourself, accuse, and Prove it | The engine room; Arc 1 Ch3 replay, Arc 3 Ch3, Arc 4 |
| **K3 Nani guesses** (reversed) | Nani asks; **the child answers aloud** | Nani | A secret card; Nani asks yes/no questions; you say *yes* or *no* (or tap ✓/✗); her mini line-up empties; she guesses | The Eid party game (Arc 1 Ch5); Grandparent mode; the hub |
| **K4 Tell Ali** (you're the witness) | **The child** | Ali (or the older cousin) | You saw it happen (a secret card shows you the culprit); Ali stands at the line-up and asks *[EN: What was it like?]*; you **say** one word from a small set; Ali sends away whoever doesn't fit; when one is left he points. If you said the wrong word, he sends away the wrong people and you see it | Arc 1 Ch3 outro (Ali back from the shop); free play from L1; Grandparent mode with real Nani listening |

A **Nani's mysteries** session is 3–4 cases mixed by kind, drawn from the player's weakest words, like a clinic morning or a Cook day. K1 and K2 test the ear; K3 tests the ear (the question) and the voice (the answer); K4 tests the voice and the craft (which clue to give). **Speaking is not a bolt-on: K3 and K4 are two of the four kinds.**

### D2 The mini-game library

Scored 1–5. **At 5 / at 11** is fun at that age; **Kutchi** is how hard it forces the Kutchi (the exact decision the word drives); **Distinct** from the other modes; **Build** 5 = cheap. Mechanics are named in D3.

| # | Mini-game (kind) | How it plays | At 5 | At 11 | Kutchi | Distinct | Build | Mechanics | Decision |
|---|---|---|---|---|---|---|---|---|---|
| **G1** | **Who ate this one?** (K1) | 3 suspects, 3 missing things; Nani: *[EN: the one with the]* **limu**; tap; caught reaction; next | 4 | 2 | 4 (the noun or name decides) | 3 | **5** | lineup, accuse | **First set** (the tutorial mini-game; the L1 shape of G2 and G3) |
| **G2** | **Keep who fits** (K2) | 4–6 suspects; 2–4 clues that combine; exact-set commits; L3 ask, send away, accuse, Prove it | 3 | **5** | **5** (which set fits this fact; no single clue solves from L2) | **5** (the only mode where clues combine) | 4 | lineup, accuse, prove, whichone (shared), passme (Busy) | **First set** |
| **G3** | **Look closer** (K1/K2 with hidden facts) | Every suspect has a trace on paws or hands you can only see under the magnifier (yellow *hardar*, white *atto*, red *tameto*, mud); Nani names the trace; peek, then tap. From L2 traces mix with G2 clues | **5** (peeking; Zazu's yellow paws) | 3 | **5, and Kutchi-real today** (an existing food noun decides) | 4 | 4 | examine, lineup, accuse | **First set** (the Kutchi-real proof; the *Clue Jr.* peek) |
| **G4** | **Nani guesses** (K3) | A dealt card; Nani asks *[EN: Does yours have]* **glasses**?; you say *yes*/*no* or tap ✓/✗; her line-up empties; she guesses and, if you misled her, says why | 4 | 4 | **5** (understanding the question; saying the answer) | **5** (the only mode that asks the player questions) | 4 | guesswho, yesno (shared), speech | **First set** (lab first; ear grey until yes/no exist; the voice star runs on the drafts) |
| **G5** | **Tell Ali** (K4) | You saw who did it (a secret card). Ali at the line-up: *[EN: What was it like?]* You say **nindho** (draft); Ali: *[EN: The small one? Right.]* and sits the big ones down. 2–3 clues, then he points. Wrong word → wrong people sit → *[EN: Hm, nobody's left!]*, try again | 4 | 4 | **5** (production: the word you say is the whole clue) | **5** | 3 (Ali's acting is the solver plus lineup states; the mic is the foundation's) | tell (shared), lineup, speech | **First set** (the speaking mini-game) |
| G6 | **You ask** (K3 reversed again: the child asks the questions) | Choose or say a question word (*glasses? big?*); Nani answers *yes*/*no*; you send people away; fewest questions wins | 2 | **5** | 5 | 4 | 3 | guesswho, tell, lineup | **G4's level 3**, not its own mini-game (Ruggeri: halving questions are an 8+ skill) |
| G7 | Who's at the door? (W2) | Nani describes the visitor; pick from the photo wall; open; greet | 4 | 3 | 4 | 3 (Find it's rejected M10 as a photo wall) | 2 (a door scene, a wall, kinship words) | photowall, door, whichone | **Held**: after the front-door scene and kinship words (review). Its greeting choice stays with the shell's exchanges |
| G8 | Ask around (W3) | Testimony into the notebook; then Nani's fact | 2 | 4 | 5 | 4 | 2 | notebook, lineup | **Held**: S5 words (Arc 2 Ch4, Arc 4) |
| G9 | Who's fibbing? (W6) | Two statements that can't both be true; present the catch | 1 | **5** | 5 | 5 | 3 | notebook, prove | **Held**: Arc 4, 8+ |
| G10 | The case board (W7) | Who + where + what chips; Nani says it back | 3 | 4 | 3 (the listening was earlier) | 3 | 3 | board | **Held**: a finale screen for Arc 4 Ch5 |
| G11 | Who's who? (old photos, W8) | Nana describes young Nani in the past tense | 2 | 4 | 4 | 2 | 2 | lineup | **Handed to Snap** (its album owns old photos); we lend the solver |
| G12 | What happened first? (W9) | Order 3–4 pictures | 3 | 3 | 5 | 2 | 3 | — | **Rejected here**: arranging is Tidy up's verb |
| G13 | Kasuku heard it | Each suspect said an order at the start (*Muke chai khape*); Kasuku squawks one back; who said it? | 4 | 3 | 4 | 4 | 4 | lineup | **Rejected for now**: at 5 it tests memory more than Kutchi; revisit as a `said` clue type at L3 |
| G14 | Empty your pockets | The caught culprit hands back *bo* sweets; count them into the box | 3 | 1 | 3 | 1 | 5 | count (Cook) | **Rejected**: it's Tidy up's repack (the Ch3 chain already ends there) |
| G15 | Make a case (W10 in full: choose the culprit *and* the clues) | Set a whole mystery for the cousin | 2 | 4 | 4 | 4 | 2 | tell, lineup | **Folded into G5's L3** (you choose which clue to give); the culprit is dealt, not chosen |

**Combined mini-games.** A full case at L2+ is a combined mini-game in Cook's sense: a line-up zone, a magnifier inset zone (examine) and the sidebar ladder, with `case.js` routing between them the way `roll-tawa` routes maani. G1–G3 are the same zones with different level data; G4 and G5 swap who is on which side of the solver.

### D3 The mechanics

One mechanic = one file, difficulty as data (`mechanics.<id>.levels` in `data/who.json`), usable alone in the Case lab or inside a zone.

| Id | One line | Tag |
|---|---|---|
| `lineup` | 2–8 suspects in sofa slots; states standing / forward / sat / not-me / caught; the commit is a tap-anything-then-Done exact set | **New** (`js/who/mechanics/lineup.js`); its commit step reuses Cook's `freePick` |
| `examine` | The magnifier follows the finger; a close-up inset shows one suspect's hidden attribute (paws, hands); free, never a hint | **New** |
| `accuse` | Point at one (hand C4); the solver applies the lucky-guess rule; caught or not-me reaction; the recap line | **New** |
| `prove` | Nani points at a sat-down suspect; tap the clue row that ruled them out (L3+) | **New** |
| `guesswho` | Nani's question chain and her own mini line-up that empties as she's answered; her wrong guess explains itself | **New** |
| `photowall` | Pick a face from 6–8 frames (G7, later) | New, held |
| `door` | The knock, the open-door reveal, the greeting hand-off (G7, later) | New, held |
| `notebook` | Testimony tokens onto rooms or colours (G8–G9, later) | New, held |
| `yesno` | Answer a heard yes/no question: say it (closed set of two) or tap ✓/✗; never blocks | **Shared** with the **clinic** (V0 *does it hurt here?*); `js/shared/mechanics/yesno.js` |
| `tell` | Say one word from a closed set of 3–8 (or tap its pill); a character acts on what was heard; awards the voice star | **Shared** with the **clinic** (V4 tell the doctor), **Cook** and **Find it** ("Tell Ali"); `js/shared/mechanics/tell.js` |
| `whichone` | Attribute-and-decoy balance and blind odds for `is`/`has` clues (asked value on ≥2 suspects, and so on) | **Shared** (foundation module; Find it M3, Dress up D1, Snap M4, Tidy up); `case.js` calls it |
| `passme` | Nani's look-alike interrupt from the side table (her glasses, her chai) in Busy, L2+ | **Reused from Cook** |
| `freePick` | The "tap anything, or Done; graded afterwards" step inside `assemble.js` | **Reused from Cook** as a step inside `lineup` |

Counts: **new 5 in the first set** (lineup, examine, accuse, prove, guesswho) plus 3 held; **reused from Cook 2** (passme, freePick); **shared 3** (yesno and tell with the clinic and the "Tell Ali" reversal in every mode; whichone with Find it, Dress up, Snap and Tidy up). Not mechanics but needed from the foundation: overlay-at-anchor sprites (shared with Dress up), `js/shared/speech.js`, star sets and ear/voice rules as data, the relations layer for L4 `next_to` only.

### D4 Speaking moments

All three design against `listen({choices, timeoutMs}) → {choice, confidence} | null`. Rules: the closed set is stated per moment; a fallback is always on screen (word pills, or a parent's "did they say it?" tick in Grandparent mode); recognition never blocks progress (a `null` or a low confidence gets one *[EN: Again?]* from the character, then the pills come up); the **voice star** is separate from the ear star and only the mic or a parent's tick can earn it (pill taps earn coins for helping).

| Moment | Closed set (what the game listens for) | What the character does | Fallback | When |
|---|---|---|---|---|
| **G5 Tell Ali** (the core speaking mini-game) | The attribute values in play in *this* line-up, 3–6 words: L1 trace and held-item nouns (*hardar, atto, tameto, limu…*, real today) and names; L2 adds *vadho / nindho* (draft; both gender forms map to one choice); L3 adds *nar* + adjective (draft) | Ali echoes what he heard (*[EN: The small one? Right.]*), sits down everyone who doesn't fit, and points when one is left. If the wrong word was heard, the wrong people sit and Ali says *[EN: Nobody's left!]*; the child says it again. He never corrects the child's Kutchi; the echo is the model | Word pills (audio, no text before word stage 3); in Grandparent mode Nani taps ✓ or "again" | From L1 (its own mini-game); in story from Arc 1 Ch3's outro |
| **G4 Nani guesses: the answer** | Two: *[yes]* / *[no]* (A8.1, A8.2; *nar* draft for *no* until then) | Nani hears the answer, flips down her frames, thinks aloud, guesses | ✓ / ✗ buttons always visible | From L1 of G4 (phase 2) |
| **G1–G2 the accusation by name** | The suspects' names (3–6: Simba, Zazu, Kasuku, Ali, Nana, a guest's name as heard when tapped) | The named suspect steps forward: caught, or *[EN: Not me!]* | Point (C4 tap) | L1 only, as the mic's first outing; names carry no Kutchi, so from L2 the voice star needs G4 or G5 |
| **G4 L3 You ask** | The feature words on the wall (4–6: *glasses, big, small, cap…*) | Nani answers *yes*/*no* and waits | Question pills | G4 level 3 (8+) |

**The speaking ladder** (the voice star): L1 say the noun or name; L2 say the describing word; L3 choose *which* clue to give (a halving clue earns the craft star: "called it" for the witness) and say two words (*nar vadho*). Every moment records the child's take beside the family's recording for the word review (stage 1 shadowing), on the device only.

### D5 The first set and the level ladder

**First set: G3 Look closer, G1 Who ate this one?, G2 Keep who fits, G5 Tell Ali, G4 Nani guesses** (in build order). Why: G3 is the only Kutchi-real test today and the 5-year-old's hook; G1 is its L1 shape and the story's first minute; G2 is the mode's identity (clues combine) and the 11-year-old's game; G5 is the speaking core and needs nothing but the solver, the line-up and the shared `tell`; G4 is the cheapest real Guess Who and Nani's own game, and it can wait for yes/no in the lab. Held: G7 (door scene, kinship), G8–G10 (S5 words), G6 as G4's L3.

**Blind-bot estimates at level 1** (the Sceptic rule; `leak_who.mjs` must reproduce):

| Mini-game, L1 | Shape | Best blind strategy | Ear star |
|---|---|---|---|
| G1 | 3 suspects × 3 items | Random tap | **3.7%** |
| G2 | 5 suspects, 2–3 clues, exact sets | "Tap half" (the balanced first clue leaves 2 or 3 of 5) then random | **≈4%**; random subsets under 1%; tap-all 0% (every L1–2 clue removes someone) |
| G3 | 4 suspects, 3 items, traces all visible after peeking | Peek at all, then random | **1.6%** |
| G4 | 4 questions, both answers present in every round | Random ✓/✗ | **6.25%**; always-✓ 0% |
| G5 | Voice star only (no ear star awarded) | No mic, no parent: pills earn no star | **0%** for the star; the pill path is 6% for "solved", coins only |

**The level ladder** (levels are data; a child moves up by word stage, per mini-game):

| Level | Name | What the Kutchi instruction carries | G1/G2/G3 | G4 | G5 |
|---|---|---|---|---|---|
| **1** | *One word* | **A noun or a name**: the trace, the held item, who. The frame is English or absent; the noun decides (Cook's reasoning) | 3–4 suspects; one clue picks one | 4 questions on features you can see; you answer | Say the noun |
| **2** | *The describing word* | **An adjective, with agreement** (*vadho/vadhi* per A1, draft): the line-up mixes cats, men and women, so the ending is part of picking who fits; clues **combine** (2–3) | 4–5 suspects; exact sets; no single clue solves | 5–6 questions, adjectives in | Say the adjective |
| **3** | *Not, and two things at once* | **Negation** (*nar* draft) and **two slots** (*[EN: the small one with the glasses]*); you ask for clues, send away, accuse, Prove it; no-op clues (15%) start here | 6 suspects; ask-and-accuse | You ask the questions (G6) | Choose which clue to give; say two words |
| **4** (Arc 4+) | *Where and whose* | **Relations and kinship** (*next to Nana*, *Ma's sister*), then testimony in the past tense | 6–8; G8 joins | Kinship cards | Tell Nana what happened (past tense, later) |

A child feels it as: *she names it → she describes it → she says what it isn't → she says where it was and whose it is*; and in the mirror: *I name it → I describe it → I choose what to say.*

**Busy mode** (the review's gap): from L2, the patience ring is Nani's chai going cold on the side table; it drains through the case, twice as fast during help rungs, and `passme` interrupts spend it too. Off at L1 and in every story-required round.

### D6 Story home and free play

| Mini-game | Story home | Cast |
|---|---|---|
| G1 Who ate this one? | Arc 1 Ch3 "The cat and the sweets", the first minute (3 sweets, 3 suspects) | Simba, Zazu, Kasuku (silent), Nani |
| G3 Look closer | Arc 1 Ch3 (Nani found prints in the spilt spices: off-screen); Arc 3 Ch3 muddy prints; Arc 4 Ch4 "Footprints" (claimed, per the review's default) | The cats, a hen, Nana |
| G2 Keep who fits | Arc 1 Ch3 on replay and at L2+; Arc 3 Ch3; Arc 4 Ch2 (with G8 later) | Adds Ali, Nana, guests |
| G5 Tell Ali | Arc 1 Ch3's outro: Ali is back from the shop, *[EN: What happened? What was it like?]* (Ali is not in that line-up when he's the listener; `listener` is data, the older cousin otherwise); Arc 2 Ch4; Arc 4 Ch2 (tell Nana, later) | Ali, the cousin, Nana |
| G4 Nani guesses | Arc 1 Ch5 "Eid morning", the optional party game; Grandparent mode | Nani, the elders, Big Ma |
| G7 door (held) | Arc 1 Ch2 becomes a beat with the greeting only until G7 exists (the review: the door is a beat, not an errand) | — |

**One free-play entry: "Nani's mysteries" at the sofa.** It offers a session (3–4 mixed cases), any single mini-game at any unlocked level, and a **60-second round** (one K1 or K3 case), which is what the hub's single rotating daily calls; there is no separate "Case of the day" any more. The case book, the record ("cases in a row with the ear star") and the Grandparent toggle live there.

### D7 The review's critiques

| Critique | What I did |
|---|---|
| Phases 0–1 only; `case.js` + Node bot + greybox line-up, L1–2 | Adopted; D9 is phased that way and phases 0–1 touch only `js/who/`, `data/who.json`, `data/scenes/sofa.json`, `build/` |
| No-op clues confuse a 5–7-year-old at L2; start at L3 | Adopted. L2 clue count still varies (2–4) and every L2 clue removes someone, so "tap all" stays 0% |
| W2 (the door) is Find it's rejected M10 reskinned; keep it out of the first set | Adopted: G7 held until the front-door scene (`front-door.json`, named as the review asks) and kinship words; Arc 1 Ch2 is a greeting beat until then |
| W5 into the lab with a grey ear until yes/no exist | Adopted, and G4 gains a voice moment (the answer aloud) so it earns a star before yes/no arrive only through Grandparent mode's tick |
| Prove it: keep, L3 only | Adopted (`prove`, `min_level: 3`) |
| Busy mode appears only in loop 3; what does the ring drain on? | Defined in D5 (the chai going cold; help and pass-me spend it; off at L1 and in story) |
| Build the overlay-at-anchor system once, shared with Dress up | Adopted as a foundation piece; the greybox draws its own circles and arcs until it lands |
| L1 "is pass me with people" | Agreed and made honest: G1 is the tutorial mini-game and says so; G3's peek is what makes L1 fun rather than a quiz |
| Culprit pool is data; Kasuku silent: default yes | Adopted as defaults; not a decision for Zafar any more |
| "Which one?" as one shared module; a lucky-guess and blind-odds calculator | Adopted: `whichone` is shared and `case.js` calls it for balance and blind odds |
| Six dailies → one hub daily; each mode exposes a 60-second round | Adopted: "Case of the day" is gone; Nani's mysteries exposes the 60-second round |
| Footprints (Arc 4 Ch4): default Who did it | Adopted for G3 |
| "Tell Ali" role reversal needs the shared pill builder | It's `tell`, designed here as shared, with speech first and pills as the fallback |

### D8 Words needed (first set, priority order)

"Asked" means it's in `docs/Nani jo Ghar — Questions for Mum (Combined, for the visit).md` already; nothing there is edited.

| # | Kutchi needed | For | Status |
|---|---|---|---|
| 1 | Trace and held-item nouns: *hardar, atto, tameto, lal marcha, jeeru, dai, marcha, limu, aadu, dungri, bataato*, numbers 1–5 | G1, G3, G5 L1 | **Real** (`data/cook.json`); mud is `[EN]` |
| 2 | big / small, on a he-word and a she-word | G2, G5 L2 | *vadho / nindho* **draft**; asked (B6, B7; agreement C22–C36, C44–C49) |
| 3 | yes / no | G4 | Asked (A8.1, A8.2); *nar* draft for "no / not" (B1) |
| 4 | Who ate the sweets? · Who did it? · It was the big one · It wasn't the small one · It had turmeric on its paws · It was holding a mango · The one with the glasses | The case card and clue frames | Asked (F23–F28, A8.9) |
| 5 | glasses, beard, cap, headscarf, bell, collar, tail, paw, whiskers | G2 `has` clues, G4 questions | Asked (F14–F22) |
| 6 | tall, short, old, young, dark, fair | G2 L2 `is` clues | Asked (F1–F6) |
| 7 | Not me! · You're right! · Caught you! · Prove it! | Reactions | Asked (F29–F31, F36) |
| 8 | Ali's echo and prompts: *What was it like? · The {x} one? Right. · Nobody's left! · Again?* | G5 | **Not asked**: add to Round 3 |
| 9 | Nani's question frame: *Does yours have {x}? · Is yours {adj}?* | G4 | **Not asked** (A8 has the question words, not this frame): add to Round 3 |
| 10 | Kinship titles; rooms; past tense; time words | G7–G9 (held) | Asked (E85–E102, E49–E58, F32–F34, C116–C136, F37–F43) |

Recording for the closed sets (the speech agent's spec): about five takes per word from a few speakers for rows 1–3 first (about 15 words), which the family can do in an evening.

### D9 Decisions for Zafar (only what blocks the build)

1. **Do drafted words count as a Kutchi test?** *vadho / nindho / nar* are Zafar's phonetic drafts, unconfirmed. If they count (flagged `draft`), G2 and G5 have a real level 2 now; if not, level 2 waits for the visit. **Default: they count**, as Find it's M3-size slice already assumes, and every row carries `draft: true` for the audit.
2. **What does Tell Ali earn?** It awards the voice star and the craft star, never the ear star (nothing is tested by ear except Ali's echo). If Zafar wants every mini-game to carry an ear star, Ali's echo becomes a tested row. **Default: voice + craft only**; the ear icon shows "not tested this time".
3. **In Tell Ali, does the child see the culprit on a dealt card, or retell a case they've just solved?** The card is self-contained (a 60-second round, Grandparent-friendly); the retell is a better story beat but doubles the round. **Default: the dealt card**, with the retell as the Arc 1 Ch3 outro only.

---

## 1. Pitch and core loop

**Pitch.** Something's happened in Nani's house: three sweets are gone from the box, someone's knocking at the door, Nani's ring has vanished. The suspects stand in a row behind the sofa (the cats, Kasuku, Ali, Nana, a guest). Nani gives **clues out loud in Kutchi**, one at a time: "it was the small one", "it had hardar on its paws", "it wasn't wearing a cap". After each clue you **tap everyone who still fits**. The others sit down behind the sofa, looking relieved. When one is left, you point: *"You!"* The culprit's funny "caught" moment plays (Zazu with syrup on his whiskers, Nana with a jalebi hidden in his cap), and the case goes into your case book. The mode exists for **S3 (describing people, kinship, possessives, who/what/where questions, adjective agreement)** and **S5 (past tense, "what were you doing?", first/then)**. Its core verb is **deduce**: several partial clues, each spoken, **combined** to pick out one person. That's what separates it from Find it (search: one full description picks one item in a cluttered scene) and from Cook (build: the order sets what you make). **No single clue ever names the culprit** (from level 2 up). The fun, and the listening, is in putting the clues together.

**The core loop (one case, 60–150 s).**

| Step | What happens | Where the Kutchi is |
|---|---|---|
| 1 Case card | An intro card (Wave 5 rule): the crime as a picture (the box with three gaps), the suspects' faces in a row, one line from Nani (`[EN: Who ate the sweets?]`). It shrinks into the sidebar | The question frame |
| 2 Silence | About 3 s to look at the suspects. Nobody talks | — |
| 3 Clue | Nani says clue 1. A row appears on the case ladder in the sidebar: `speaker · text/••• · 👁 · translate` | **The clue: the decision** |
| 4 Commit | Tap every suspect who fits (they step forward), then **Done**. Wrong: a recast, then you try again. Right: the rest sit down | Recast in Kutchi |
| 5 Repeat | The next clue, until one suspect is left (level 1–2). From level 3 you ask for clues yourself and choose when to accuse | — |
| 6 Accuse | Point at the culprit (hand C4). The "caught" reaction, their line, the item | The confession (S5 past tense, heard) |
| 7 Close | Nani's one-line recap (`[EN: Zazu ate the jalebi!]`), stars fill, the word review (Kutchi → English), pocket money, the case card joins the case book | Recap and word review |

**How it differs from the built and designed modes.**

| | Cook with Nani | Find it | **Who did it?** |
|---|---|---|---|
| Core verb | Build (gestures in a sequence) | Search (scan, tap one) | **Deduce** (keep who fits, combine clues, accuse) |
| Camera | T, worktop | E, cluttered scene, pan | **E, a line-up of 2–8 suspects behind a sofa or counter; no pan, no clutter** |
| What the Kutchi decides | What, how many, in what order, for whom | Which item, where | **Which of the people fit each spoken fact; which fact rules someone out** |
| Where the fun is | Juice, timing, Simon memory | "Found it!", curiosity, combos | **The "aha" when the clues click; suspects' reactions; the caught reveal; beating Nani at Guess Who** |
| Syllabus | S1, S2 verbs, S5 first/then | S1, S2 positions and colours | **S3 describing, kinship, questions; S5 past tense** |

---

## 2. Research summary

### 2.1 What we borrow from which game

| Reference | Concrete mechanic | Why it works | What we take | What we don't |
|---|---|---|---|---|
| *Guess Who?* (Theora Design, 1979) | 24 faces on flip-down frames; yes/no questions about features; flip down whoever's ruled out | Simple rules, quick rounds, a visible board that empties; kids focus on **attributes**. A halving question beats a narrow one (about 5 questions with perfect halving) | The line-up that empties; attribute sets designed as a grid so every feature is shared; **the reverse game** (Nani asks *you*), W5 | 24 faces (too small on a phone; 8 at most). The original's gender imbalance made "is it a woman?" a near-instant win: we **balance** every attribute |
| *Cluedo* / *Clue* | "The missing card": deduce who, where, what; a notepad for crossing off | Logic-puzzle replay: a new hidden answer every game; the notepad makes the reasoning visible | Who + where + what as the case finale (W7); **the notebook** (W3, the old Ask around) | Hidden hands of cards, turns against opponents |
| *Clue Jr.: The Case of the Missing Cake* (3–8) | **Look under** pawns and furniture for crumbs; cross off; who, what time, what drink | Physical peeking is the fun for little ones; a three-part answer | **Look closer** (W4): tap a suspect to see their paws and hands; the *spoken* clue says which trace matters | Dice, a board |
| *Outfoxed!* (5+) | Co-operative; clue bubbles show a feature; a **decoder** says yes/no for one feature at a time | Co-op suits siblings; one fact at a time is the right chunk for 5-year-olds | Co-op with Nani (you and her against the mystery); **one fact per clue** at levels 1–2 | **Clue bubbles are pictures of the feature**: a complete leak for us. Our clues are only spoken |
| *Where in the World is Carmen Sandiego?* | Witnesses describe the thief (hair, hobby, feature); fill in a **warrant**; you need enough matched traits | An educational game where clue-gathering is the learning; descriptions as data | The warrant idea: at level 3+, **Prove it** before the accusation counts (W1 L3+) | Geography travel |
| *Return of the Obra Dinn* | Fates confirmed **in threes**, never one by one | Stops brute-forcing while keeping feedback | At level 3+, eliminations are graded at the accusation, not per tap. "A lucky guess never earns the ear star" | The ledger's scale |
| *Phoenix Wright: Ace Attorney* | Cross-examination: press a statement, **present** the evidence that contradicts it | The "gotcha" of catching a contradiction | **Who's fibbing?** (W6); **Prove it** (tap the clue that rules someone out) | The judge's health bar (punishment) |
| *The Case of the Golden Idol* | Collect words from the scene, fill blanks in "what happened" sentences; told when a few are wrong | The satisfaction of writing the explanation yourself | The case recap as a sentence the player builds from picture chips (who, where, what), which Nani then says in Kutchi (W7) | Reading-heavy sentence blanks |
| *Papers, Please* | Compare a description with the person in front of you; flag a discrepancy | Checking claims against evidence is a satisfying verb | **Who's at the door?** (W2): Nani's description versus the faces on the photo wall | Its bleak tone |
| *Professor Layton* | Unlimited time, retries; hint coins; value drops a little per wrong answer | Low stress, a sense of cleverness | No timer in Relaxed; hints cost stars, not the case | Hint coins as a currency you can grind |
| Toca Boca, *Toca Mystery House* | No reading, no failure; everything reacts | Safe for a 5-year-old | Every suspect reacts to a tap (purr, "Hm?"); warm failure | — |

### 2.2 Language-learning and development evidence

| Finding | Source | What it means here |
|---|---|---|
| Guess Who is a standard ESL game for **describing people**: listening to descriptions, question forms ("Does she have…?"), appearance adjectives | ESL Kids Games; eslactive; AmeriLingua | The genre is already a proven language task. Our twist: the learner **listens** (and later asks) |
| **Information-gap tasks** make learners exchange information that only one of them has, and focus attention on form and meaning | Pica et al., SSLA; Doughty and Pica 1986 | Nani knows who did it; you don't. The clue is the gap, so understanding it is the task |
| Children under about 6 struggle to form **constraint-seeking** (halving) questions; they improve up to about 10; 7-year-olds adapt when scanning doesn't work | Ruggeri and Lombrozo 2015; Legare et al. 2013 | Levels 1–2: **Nani asks** or gives the clues; the player judges them. Choosing good questions yourself (W5 player-asks, W10) comes later and suits 8+ |
| Reasoning by **elimination** (A or B; not A; so B) shows at about 3, and with *words* even at 2.5 | Mody and Carey 2016 and follow-ups | Even Layla (5) can do "not the big one, so the small one", if the step is small and single |
| **Negation** is slower and harder for young children, especially without a supporting context | Nordmeyer and Frank 2014; *Grasping the alternative*, Frontiers 2019 | "It *wasn't* the big one" only from level 3. At levels 1–2 every clue is positive and the action is "tap who fits", never "flip who doesn't" |
| Children understand **past tense and "yesterday"** by about 5, and adverbs help | Valian 2006; Zhang and Hudson 2018 | S5 cases pair the verb form with a time word (`[EN: yesterday]`, `[EN: this morning]`) at first; the word alone later |
| **Prompts beat recasts**, though both help | Lyster and Saito 2010 | After a wrong commit: a recast, then the player retries; the answer is never shown automatically |
| **TPR** and task-based teaching: act on spoken language; a real outcome only the language unlocks | Roadmap research table | Every tap is acting on a spoken fact; the outcome is a solved case |
| Children aged 3–5 match a spoken description to one of two pictures (past vs future change of state) | Zhang and Hudson 2018 (method) | A picture-choice after a spoken sentence is a valid comprehension test for young children, which is what the line-up is |

Sources at the end. Pages that were read only through search summaries are marked.

---

## 3. Mechanic library

Scoring 1–5. **Forces Kutchi** names the decision, the leak risks and how each is designed out. Leak rules shared by every mechanic are in section 3.2.

### 3.1 The candidates

| # | Mechanic | How it plays | Fun | Forces Kutchi | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **W1** | **The line-up** (Who ate the sweets?) | 2–8 suspects behind the sofa. **L1:** several missing sweets, one clue each: tap who ate that one. **L2:** clue by clue, tap *everyone* who fits, then Done; the rest sit down. **L3+:** ask for the next clue when you want; send suspects away yourself; accuse when you're sure; then **Prove it** (Nani points at a sent-away suspect: tap the clue row that ruled them out) | **5**: Guess Who's emptying board, suspects' sit-down reactions, the caught reveal; *Outfoxed* co-op with Nani | **5**: *which suspects fit this spoken fact* (size, shade, age, what they wear or hold, trace, where they were). Leaks: clue pictures, a guilty pose, a fixed culprit, the odd-one-out culprit, per-tap feedback, the clue count, the speaker. All designed out (3.2). Leak bot: L1 3.7%, L2 <1%, L3 about 5.6% (section 8.4) | **5**: the only mode where clues **combine**; no single clue names the culprit from L2 | **5**: Arc 1 Ch3 (the flagship), Arc 3 muddy paws, Arc 4 | **5**: a new culprit, line-up and clue chain every case; attributes vary per round (cap on or off, what they're holding); a case book of culprits |
| **W2** | **Who's at the door?** | A knock. Nani looks out of the window and describes the visitor (L1 one feature; L2 two; L3 kinship: `[EN: It's Ma's sister]`). Pick them from the **photo wall** (6–8 frames). Open the door (hand D1): it's them or it isn't. Then the **greeting choice** (respect language). 3–4 visitors per round | **4**: the knock's suspense, the door reveal, the visitor's reaction to your greeting | **4**: *which face matches the spoken description / kinship relation*. Leaks: the peephole showing the visitor (**there's no peephole view**: you only hear Nani); a fixed visitor order in the story (shuffled per replay); names under photos (**no names**, faces only); a single-feature clue at L1 is a 1-in-6 guess, so each round has 3–4 visitors | **4**: the same line-up engine in a new frame, plus the greeting, plus **kinship relations** (S3's core), which no other mode tests | **5**: Arc 1 Ch2 "Knock knock" (the guests), Arc 2 the invitation, Arc 3 the doctor, the fruit seller's delivery | **4**: any visitor any day; the photo wall fills as you meet relatives (a collection) |
| **W3** | **Ask around** (the notebook; the old mode) | Tap each relative: they step forward and answer Nani's question (`[EN: What were you doing?]` → `[EN: I was cooking in the kitchen]`; in Arc 2 `[EN: What's your favourite colour?]`). **Drag their face onto the right room (or colour) in the notebook.** Then Nani's fact (`[EN: The ring was in the bedroom]`) → tap who was there (W1 engine) | **3**: the Clue notepad; collecting testimony; slower | **5**: *where each person was / what they were doing*, heard in the past tense. Leaks: the game auto-writing the answer into the notebook (**the player places it**, graded at Done); room pictures on the answer row (the answer is spoken only); the culprit's alibi being the only long one (shared frames); every alibi said in the same order | **4**: its gesture (place a token) is Tidy up–like, but the challenge is understanding testimony and then reasoning with it | **5**: Arc 4 Ch2 "Who saw it?", Arc 2 Ch4 "The gift" (favourite colours), Arc 4 Ch1 (Nani's own recount) | **3**: rooms × activities × people regenerate; story cases are fixed at the top level (see 5.4) |
| **W4** | **Look closer** (traces) | Tap a suspect with the magnifier (hand B2 + magnifier tool): see their paws, hands, whiskers. Each has a **different** trace: atto, hardar, tameto, bhaji, mud. Nani: `[EN: It had]` **hardar** `[EN: on its paws]` | **5**: *Clue Jr.* peeking; funny traces (Zazu's yellow paws); curiosity | **5**, and **Kutchi-real today**: the deciding word is an existing food noun (`spi-01 hardar`, `cook-atto`, `veg-03 tameto`, `veg-07 bhaji`). Leaks: the trace linked to the crime (the jalebi's syrup on the culprit): **traces are never the stolen thing**, they're where the culprit walked; the prints shown on the floor (**off-screen**; Nani found them); only the culprit having a trace (**everyone has one**); look-alike traces (atto/khun/loon look alike, so only one of a look-alike group per round) | **4**: examining 2–8 people is not scene search; it's evidence, and it feeds W1 | **4**: Arc 1 Ch3, Arc 3 (mud), Arc 4 Ch4 "Footprints" | **4**: 16 spices, 16 veg and flour as traces; combines with any W1 clue |
| **W5** | **Nani guesses** (Guess Who, reversed) | You're dealt a secret card (a family face, a cat). Nani asks yes/no questions in Kutchi (`[EN: Does your person wear glasses?]`); you tap ✓ or ✗. Her own mini line-up empties as you answer. She guesses. If you answered wrongly she guesses wrong, and says why ("Arre re! Big Ma *has* glasses!"). Later: **you** ask (choose question audio pills) | **4**: turning the tables; Nani "thinking" out loud; a real Guess Who with Grandma. Grandparent mode: real Nani asks aloud | **5**: *understanding the question* about your card. Leaks: always ✓ (every round has ✓ and ✗ answers); Nani nodding or pausing before the "right" answer (no animation cue before you answer); the dealt card always plain. Bot: 4 answers = 6.25% | **5**: no other mode asks the player questions to answer about a picture | **3**: the Eid party game (Arc 1 Ch5), then free play and the hub | **5**: endless; a record of how few questions Nani needs when *you* ask; Grandparent mode |
| **W6** | **Who's fibbing?** | Two or three family members each say something (past tense). One contradicts a fact you have (Ma: `[EN: I saw Ali in the kitchen]`; Ali: `[EN: I was on the roof]`). Tap the fibber, then **present** the line that catches them | **4** (8+): the Ace Attorney "gotcha"; Ali's embarrassed grin | **5**: *which two statements can't both be true*. Leaks: the fibber's face (**no tell before the catch**); the fibber is always the last to speak (random order); fibbing is always about the room (varies: room, activity, time) | **5**: contradiction is its own reasoning move | **4**: Arc 4 Ch3 (Ali fibbed about the *sweets*, a comic sub-plot); free play from L4 | **3**: generated from W3 data; needs the S5 words |
| **W7** | **The case board** (who + where + what) | The finale of a long case: three picture chips (a suspect, a room, an object), chosen from what you've learned; Nani says your answer back as a Kutchi sentence, and the board stamps it "case closed" | **4**: a proper *Cluedo* accusation; the payoff | **4**: the chips are pictures, so the listening is **before** this (in W1, W3, W4); the board only checks it. Leaks: the right chips glowing, or the only chips being the right ones (chips include every suspect, room and object met) | **3**: combines the others | **5**: Arc 4 Ch5 "The crow" (the crow, the nest, the ring) | **3**: long cases in free play at L5 |
| **W8** | **Who's who?** (old photos) | Nana describes an old photo in the past tense: `[EN: Your Nani was the smallest; she had long hair]`. Tap the young Nani, young Nana… | **3**: heritage delight; young Nani! | **4**: past tense + describing + kinship. Leaks: the young faces looking like today's (they do a little: fine, but the clue must be needed: several similar girls) | **3**: overlaps **Snap**'s "old photos". Our part is *identifying* from combined clues; Snap's is capturing | **5**: Arc 5 Ch1 "The old trunk" | **2**: a fixed set of photos (a bonus: new photos per family) |
| **W9** | **What happened first?** | Nana tells a short story; put 3–4 pictures in order | **3** | **5**: first/then, past tense | **2**: the gesture is **arranging** (Tidy up's verb). Offer it to Tidy up, or keep it as W3's recap | **4**: Arc 5 Ch4 "Nana's stories"; the Arc 4 recap | **3** |
| **W10** | **Make a case** (role reversal) | You set up a mystery for the older cousin: choose the culprit, then choose clue pills (audio chunks) to give him. He sends people away based on *your* clues and gets it hilariously wrong if they're wrong | **4**: Maryam's "make it mine"; being the expert (a barrier game) | **4**: production: choosing the right chunk needs its meaning. Leaks: icons or text on pills (audio only; text only for readers from stage 3) | **4** | **3**: the older cousin, from Arc 2 on | **4**: endless; share it with Nani in Grandparent mode |

**Rejected or handed to other modes:**

| Idea | Why |
|---|---|
| *Outfoxed*-style clue bubbles, Carmen's picture dossiers | A picture of the feature is the answer. Clues are spoken only |
| Flip-by-flip feedback (each flip says right or wrong) | Trial and error beats the listening. Commits are graded at Done (L1–2) or at the accusation (L3+) |
| A judge's health bar or lives (Ace Attorney) | Warm failure: nothing is lost but a star |
| "Who has it?" in a crowd (Find it M10) | Picking one person from a *single* full description in a busy scene is **search**. Find it should keep it. Who did it? is a static line-up of 2–8 and combined clues |
| Serve the right person | Cook (the Chai tray pass) |
| Dress someone to a description | Dress up |
| "Take the photo of the man with the red cap" | Snap |
| Accusation wagers ("bet your coins") | Game Design's rejected double-or-nothing |

### 3.2 Leak rules for every mechanic (designed out from day one)

| Leak (the Sceptic's route) | Rule |
|---|---|
| A picture, icon or swatch of the feature on the clue row | Rows are `speaker · text/••• · 👁 · translate`, nothing else. No glyphs, no tinted text |
| The culprit gives itself away (guilty face, crumbs showing, fidgeting, looking away) | All suspects share the same randomised idle set (blink, breathe, tail flick). Guilty and caught faces play **only after** the accusation. Traces show only under the magnifier, and every suspect has one |
| Nani looks at or points at the culprit | Nani's gaze and pointing are towards the whole line-up (or the sidebar) while clues run |
| A fixed culprit (always Simba), a fixed position (always in the middle) | Culprit uniformly random (story cases: see 5.4); the line-up order shuffled per round |
| The odd one out is the culprit (the only cat among people, the only one with glasses) | Line-ups are built as **balanced grids**: every attribute value used in a clue is shared by at least 2 suspects when it's said (except the final clue); the culprit's number of distinctive features is at or below the line-up's median |
| A single clue names the culprit | From L2: no clue leaves exactly one standing unless it's the last, and at least 2 clues are always needed |
| The clue count gives the answer ("3 clues, so the last one leaves one") | Clue count varies: 15% of rounds include a **no-op clue** (everyone standing fits: the right action is Done with no change), and some a redundant clue. The ladder shows only clues already said |
| Row shape (a "not" row is longer; a relational row has two dot groups) | Hidden words side by side share one "•••" (Cook Wave 4). "Not" rows styled like the others and placed at random |
| Tap-all / tap-none / tap-half | Graded as an exact set. No-op clues make "tap all" right only sometimes, so it isn't a safe habit |
| Early accusation as a guess | **A lucky guess never earns the ear star**: the game knows the set still consistent with what's been said. Accusing with more than one consistent is "you guessed!": no ear star, coins for helping only |
| The speaker gives it away (a witness is never the culprit) | W1: clues come from Nani (or a non-suspect). W3: every suspect speaks, truthfully, the culprit included (honest alibis; the deduction combines them with Nani's fact) |
| Waiting for the glow | Hesitation never shows anything. After about 8 s Nani replays the clue (free the first time). The glow comes only after 2 misses on one clue, and costs that clue's ear |
| Tap a suspect to hear their description, then match sounds | At stage 1–2 it's free (teaching). From stage 3 it's help: costs the tick; if it's for the attribute in the current clue, the ear for that clue |
| Stage-1 teaching glow gives the answer | Stage-1 words are taught, not tested (the fitting suspects glow as Nani says the word; that clue doesn't count either way). At most 2 new words a case, and a case needs **at least 2 tested clues** for the ear star (otherwise the ear shows as "not tested this time", grey) |
| Names on photos or suspects | No names as text anywhere in the scene. A suspect's name is heard when you tap them (help rules as above) |
| English placeholders read or heard in English | Flagged per clue row: `kutchi_real: false`. The audit counts them; the lab shows a grey ear for placeholder-only cases. The first build uses Kutchi-real clue types (W4 traces, "holding {noun}") so the test is real from day one |
| Upgrades or help that do the listening | None may (section 7) |

---

## 4. Recommended first set

**One case engine, with clues as data, then four mechanics on it.** A clue is `{type, slot values, fits(suspect)}`, the same way a Find it row is `{noun, colour?, position?}` and a Cook order is station calls with slots. W2, W4 and W5 are new front-ends on the same suspects, attributes and solver.

| Order | Mechanic | Why first | Fun · Kutchi · Plot · Replay (one line each) |
|---|---|---|---|
| 1 | **W1 The line-up** (L1–3) | The engine everything else uses. Arc 1 Ch3 flagship. Works at every age by level | Fun: Guess Who's emptying board plus the cats' caught reveal. Kutchi: every tap is set by a spoken fact, graded as an exact set. Plot: "The cat and the sweets" (Arc 1 Ch3). Replay: a new culprit, line-up and clue chain every case, plus the case book |
| 2 | **W4 Look closer** (as a W1 clue type) | **Makes the mode Kutchi-real today**: the deciding word is an existing food noun (hardar, atto, tameto…), so the Sceptic test is real before the family's describing words arrive. Also the *Clue Jr.* peek that 5-year-olds love | Fun: peeking at paws. Kutchi: the trace noun decides. Plot: Arc 1 Ch3 (the prints in the spilt spices), Arc 4 Footprints. Replay: 30+ traces |
| 3 | **W5 Nani guesses** | The cheapest real *Guess Who*, the best Grandparent-mode game, and it trains **question comprehension** (S3's who/what questions). The bot can't beat it (6.25%) | Fun: beating Nani; the tables turned. Kutchi: you must understand her question. Plot: the Eid party game (Arc 1 Ch5), then the hub. Replay: endless, and with the real Nani |
| 4 | **W2 Who's at the door?** | Arc 1 Ch2 needs it ("Knock knock"); kinship is S3's heart; it hosts the greeting choice | Fun: the knock and the reveal. Kutchi: description, then kinship relation. Plot: Arc 1 Ch2, Arc 3 the doctor. Replay: any visitor, and a photo wall that fills up |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| **W3 Ask around** | Straight after the first set; **needed before Arc 2 Ch4 and Arc 4** | It's the S5 core, but no past-tense or "I like" frame exists yet (Round 1 Q4 is unanswered). Its notebook is a new component |
| W6 Who's fibbing? | Arc 4 (8+ and adults) | Needs W3's testimony data and the past tense |
| W7 Case board | Arc 4 Ch5 | A finale screen; it needs the others first |
| W8 Who's who? (old photos) | Arc 5; **agree with the Snap designer** | Overlaps Snap's old photos |
| W9 What happened first? | Arc 5; **offer it to Tidy up** | Its gesture is arranging |
| W10 Make a case | When produce stages exist | Production, not listening; Maryam's long-term hook |

**Is the first set complete?** It covers **S3** (describing, adjective agreement, kinship, question comprehension) and the Arc 1 story uses (the sweets, the door). **S5 and the lost ring need W3** (plus W6 and W7), so the mode isn't complete until phase 4 (section 12). That's the right order: Arc 1 comes first, and the S5 words don't exist yet.

---

## 5. Story integration

### 5.1 Where the mode appears

| Arc · chapter | Beat (what you see) | Errand | Mechanic, level | Cast |
|---|---|---|---|---|
| **Arc 1 Ch2 "Knock knock"** | The last errand of Ch1 ends on a knock. Nani goes to the window | **Who's at the door?** 3 guests arrive one by one; pick each from the photo wall, open, greet | W2 L1 (one feature: headscarf colour, glasses, cap); the greeting choice uses existing Kutchi (*Salamun alaykum* / *Wa alaikum salaam*) | Nani, 2–4 guests; Kasuku squawks "Salamun alaykum!" *after* each greeting (his idle line) |
| **Arc 1 Ch3 "The cat and the sweets"** | The mithai box, three gaps. Spilt spices on the kitchen floor with prints (**off-screen**: Nani comes back and tells you) | Find the sweets (Find it M4) → **Who ate them?** → repack (Tidy up) | W1 L1 (one clue per missing sweet) + W4 traces; L2 in replay | Simba, Zazu, Kasuku (a silent suspect), Ali; Nani gives the clues |
| **Arc 1 Ch5 "Eid morning"** | After Eidi, the family plays a game | **Nani guesses** (optional, the party game) | W5 L1 (family faces you've met) | Nani, the elders, Big Ma |
| **Arc 2 Ch1 "The invitation"** | Relatives arrive with the invitation | **Who's at the door?** with kinship: `[EN: It's the bride's mother]`, `[EN: It's Ma's sister]` | W2 L3 (kinship relations) | Relatives, Nani |
| **Arc 2 Ch4 "The gift"** | Nani's quilt needs thread | **Ask around**: each relative's favourite colour into the notebook (`[EN: I like red]`), then the threads (Find it), then Nani asks for each back | W3 present tense | Relatives, Big Ma (colour and thread words) |
| Arc 3 Ch3 "The animals" (optional) | Muddy prints across Nani's clean floor | **Who brought the mud in?** | W1 L2 + W4 (mud, water, straw) | The cats, a hen, a goat |
| Arc 3 Ch4 "Nani has a cold" | A knock: the doctor | **Who's at the door?** (a short one), then a formal greeting | W2 + the greeting (respect language) | The doctor |
| **Arc 4 Ch1 "It's gone"** | Nani, bare finger, worried | Nani recounts her morning in the past tense; you place **her** in each room (the notebook's first page); then Find it searches the dressing table | W3 (Nani as the first witness) | Nani |
| **Arc 4 Ch2 "Who saw it?"** (flagship) | The family in the sitting room | **Ask around**: each relative says what they were doing; notebook; Nani's fact (`[EN: The ring was on the dressing table]`) → who was near the bedroom? → two suspects, both innocent: each says they saw `[EN: a black bird]` | W3 → W1 L3 | Nana, Ma, Ali, Big Ma, the cats |
| **Arc 4 Ch3 "Following clues"** | Funny lost objects turn up (Find it) | **Who's fibbing?** Ali fibbed, about the *sweets* (a comic sub-plot, not the ring) | W6 | Ali, Ma |
| **Arc 4 Ch4 "Footprints"** | Big prints, small prints, bird prints | **Look closer** at feet and paws: the cat's, a person's, or a bird's? | W4 + W1 L3. **Claimed from Spot it** (the Roadmap's old mode); Snap may want the photo side | The cats, Nana, the crow (off-screen) |
| **Arc 4 Ch5 "The crow"** | The nest, something glinting | **The case board**: who, where, what → case closed → the trade (Find it) → Nani's ring story | W7 | The crow, Nani |
| Arc 5 Ch1 "The old trunk" | Faded photos | **Who's who?** young and old | W8 (agree with Snap) | Nana narrates |
| Arc 5 Ch4 "Nana's stories" | Nana's story | **What happened first?** | W9 (offer to Tidy up) | Nana |

### 5.2 Who drives it

| Cast | Role in this mode |
|---|---|
| **Nani** | The clue-giver and co-detective (*Outfoxed*-style co-op). She says less than in Cook: one line per clue, silence first. In W5 she's your opponent, "thinking" aloud |
| **Simba and Zazu** | The running suspects: big/small, dark/light, old/young, bell/no bell (the Asset Plan's own "describe the cat" note). Their caught reveals are the comic payoff |
| **Kasuku** | A **silent suspect** (grey and small like Zazu: a natural look-alike). He keeps the cast rule: no words during a task. He squawks "Salamun alaykum!" after a door greeting and "Arre re!" after a miss, which gives nothing away |
| **Nana** | A suspect who sneaks sweets (a jalebi hidden in his cap); the past-tense narrator in Arc 5 |
| **Ali** | The fibber (W6); a suspect |
| **Big Ma** | A witness in W3 (`[EN: I was sewing]`); a visitor at the door (formal greeting); her room in Arc 4 |
| **The doctor** | A visitor at the door (Arc 3) |
| **The older cousin** | Loses things; later you set cases for him (W10) |
| **Guests and relatives** | Line-up variety (generic bases with attribute layers), the photo wall |
| **Baby Isa** | A later suspect (a toddler with syrup on his face). No design yet |
| **The crow** | Arc 4's culprit |

### 5.3 How it opens a place on the world map

| Place | Opened by | Hosts |
|---|---|---|
| **The front door** (Nani's doorway and the photo wall beside it) | Arc 1 Ch2 | W2 story visitors; free play "Visitors" (endless knocks); the greeting choice; W5 at the photo wall |
| **The sitting room sofa** ("Nani's mysteries") | Arc 1 Ch3 | W1 and W4 cases; the case book on the side table. Shared with Find it's sitting room scene: the world is the menu, and both modes' free play live there |
| Nani's bedroom (shared with Find it) | Arc 4 Ch1 | W3 and W7 in Arc 4 |

### 5.4 Free play and story replays

- **Nani's mysteries** (the sofa): endless cases built from the player's due and weakest words, at the player's own level (it rises with ear stars; Zayn's "let the open kitchen raise the level" lesson). A best "cases in a row with the ear star" record.
- **Case of the day:** one short case (60–90 s) a day for Farah. A count of "cases solved with Nani" that never resets (no streak guilt).
- **Visitors** (the front door): knocks keep coming until you close the door.
- **Nani guesses** at the photo wall, any time; Grandparent mode.
- **Story replays re-roll the middle, not the truth.** Arc 4's answer is always the crow, but on replay who was where, who's the fibber and which clues come are regenerated, so the ear star never rests on remembering the story. Story culprits that must be fixed (the crow) are the answer to the **case board** only, which doesn't carry the ear star by itself.

---

## 6. Learning design

### 6.1 Words and frames it drives

| Stage | What | Frames (existing Kutchi, or a placeholder) | Mechanics |
|---|---|---|---|
| S1–S2 (reuse, **Kutchi-real now**) | Food nouns as traces and held items; numbers | `[EN: It had]` **{hardar}** `[EN: on its paws]` · `[EN: The one with the]` **{kelo}** · *Arre re!* · *Hedo!* · *Ghan.* · *Salamun alaykum!* · *Wa alaikum salaam!* · *Aabhar aanjo!* · *Achija!* | W1, W4, W2 greeting |
| **S3 describing** | big/small, tall/short, old/young, dark/light (and colours for scarves, caps), glasses, cap, headscarf, beard, bell, collar, tail, paws, hands | `[EN: It was the {adj} one]` · `[EN: It had {X}]` · `[EN: It was wearing {X}]` · from L3 `[EN: It wasn't the {adj} one]` | W1, W2, W5 |
| **S3 adjective agreement** | The same adjective about a masculine and a feminine suspect (if Kutchi agrees, Round 1 Q1) | Recorded per gender: `adj-big.m`, `adj-big.f` | W1 line-ups mix genders from L2, so hearing the agreement is part of picking who fits |
| **S3 kinship and possessives** | Nani, Nana, Ma (in use as names), Masi, Mama, Kaka, Kaki, Fui (Round 1 Q10) | `[EN: It's {kin}'s {kin}]` (possessive) · `[EN: It was sitting next to {kin}]` (S2 position reuse, from Find it) | W2 L3, W1 L4 |
| **S3 questions** | who, what, where, how many | `[EN: Who ate them?]` · `[EN: Does your person have {X}?]` · `[EN: Is it {adj}?]` · `[EN: yes]` / `[EN: no]` | W5, case cards |
| **S5 past tense** (intransitive first, the Roadmap's rule) | went, slept, was cooking, was sewing, was praying, was playing; rooms | `[EN: What were you doing?]` · `[EN: I was {verb}-ing in the {room}]` · `[EN: Where were you?]` | W3, W6 |
| **S5 transitive past** (later) | ate, took, saw | `[EN: {who} ate the {X}]` (the recap, heard first) · `[EN: I saw {who} in the {room}]` | Recaps from Arc 1 (heard only), W6 |
| **S5 time and sequence** | yesterday, today, this morning; first, then | `[EN: yesterday]` · *Ne poi {x}* (draft: "and then") | W3, W9 |

**Clues grow with the level** (the *Where's Wally* finding reused from Find it: longer descriptions for harder sets):

| Level | Suspects | Clue shape | Action |
|---|---|---|---|
| L1 | 2–3 | One positive fact per missing item; each identifies one suspect | Tap who ate *this* one (3 items a case) |
| L2 | 4–5 | Positive facts; 2–4 clues; none identifies alone | Tap everyone who fits, Done; the rest sit |
| L3 | 6 | Adds "not", "holding", traces; you ask for each clue | Send away yourself; accuse; **Prove it** |
| L4 | 6–8 | Adds kinship relations, "next to {kin}", mixed genders (agreement) | As L3 |
| L5 | 8 | Adds testimony (W3) and fibs (W6); long cases (W7) | As L3 + the notebook |

### 6.2 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | Nani says the clue again (row speaker) | Free the first time; then the tick (Relaxed) or patience (Busy) |
| 2 Slow replay | Half speed, a pause before the key word | Tick / patience |
| 3 Describe a suspect | Tap a suspect: Nani names them and one feature | Free at word stage 1–2 (teaching). From stage 3: the tick; the ear for this clue if the feature is the clue's |
| 4 Reveal (👁) | The clue's Kutchi text (never English) | Ear for this clue, from stage 2 |
| 5 Translate | English gist | Ear for this clue |
| 6 Shown | After 2 misses on one clue: the fitting suspects glow | Ear for this clue; the word doesn't advance |

The ladder lives behind the "?" button and the row buttons (Wave 5): no permanent goal text. No upgrade makes a rung cheaper.

### 6.3 Word-stage fading (one place only)

| Word stage | Clue row (the instruction) | In the scene (the help) |
|---|---|---|
| 1 New | Text + speaker; as Nani says the word, the fitting suspects **glow** (pulse sync). Taught, not tested | Tapping a suspect names them and the feature |
| 2 Learning | Text + speaker | No glow; tap to hear is free |
| 3 Nearly known | Speaker only (•••) | Tap to hear costs (rung 3) |
| 4 Known | Heard once; replay costs the tick | Same |

No names or feature labels in the scene at any stage: in this mode a label *is* the answer.

### 6.4 Recasts on mistakes (prompt, then retry)

| Mistake | Recast | Then |
|---|---|---|
| Wrong commit (someone who doesn't fit stepped forward, or someone who fits didn't) | The first wrong suspect does a small shrug; Nani: *Arre re!* + `[EN: Zazu is small]` + the clue again | The player re-commits. Nothing is shown |
| Wrong accusation | The accused: `[EN: Not me! I'm {adj}!]` (their own feature that breaks a clue), a funny huff | Play continues; ear lost for the accusation |
| Wrong Prove it | Nani plays the chosen clue, then shakes her head: `[EN: {name} is {adj}]` | Choose again |
| W5 wrong answer | Nani guesses wrong, then: *Arre re!* `[EN: {name} has {X}!]` on the question you got wrong | The next round |
| W3 misplaced token | The person repeats their line | Place again |

Two misses on one word drop it a stage (the existing rule).

### 6.5 Role reversal

- **W5 player-asks:** choose a question pill (audio chunks, no icons); Nani answers `[EN: yes]` / `[EN: no]`; you send people away. The craft skill is Guess Who's halving (fewest questions).
- **W10 Make a case:** set a case for the older cousin with clue pills; he follows your clues.
- **W2 greeting:** you choose the greeting (production by choice), already in the v2 plan.
- **Grandparent mode:** in W5 the real Nani reads her question in large type and asks it aloud; the child answers; she taps ✓ or ✗. In W1 she can be the clue-giver from a card of the case's clues (the app picks the case; she reads).
- Data from day one: every clue type has slots marked (`{adj}`, `{kin}`, `{noun}`) so it can be **built from pills** as well as spoken (the Platform plan item 5b).

### 6.6 Words and frames needed from the family (English placeholders until then)

| Need | Status | Priority |
|---|---|---|
| **Kinship titles**: father's brother and his wife, mother's brother, mother's sister, father's sister, older girl cousin; what a grandchild calls Nani and Nana | Asked (Round 1 Q10) | High (W2 L3) |
| **Describing words**: big, small, tall, short, old, young, dark, light; and do they change with he/she words? | Q1 asked (agreement); the words are new | **Highest** (W1, W2, W5) |
| Colours (for scarves, caps, collars) | Asked (Q11) | High |
| Features: glasses, cap (topi), headscarf, beard, bell, collar, tail, paw, hand, whiskers | New (Eid clothes are Q9) | High |
| **Yes / no** | New (in `cook.json` as English placeholders `yes`, `nope`) | **Highest** (W5) |
| Question frames: "Who ate the sweets?", "Does your person have…?", "Is it…?", "Who's there?", "What were you doing?", "Where were you?" | New | High |
| Clue frames: "It was the … one", "It wasn't the … one", "It had … on its paws", "It was holding …", "It's …'s …" | New | High |
| Reactions: "Not me!", "You're right!", "You guessed!", "Caught you!", "Prove it" | New | Medium |
| **Past tense** (Round 1 Q4 settles intransitive vs transitive): I was cooking / sleeping / sewing / praying / playing; I went; I saw; he ate; she took | Q4 asked; the list is new | High for W3 (phase 4) |
| Rooms: kitchen, bedroom, sitting room, courtyard, roof | New (household list is Q8) | High for W3 |
| Time words: yesterday, today, this morning; first, then (*ne poi* is Zafar's draft) | New / confirm | Medium |
| Sweet names for the mithai box (shared with Find it) | New | Medium |
| "I like…" (favourite colour, Arc 2) | New (the *Muke … khape* pattern may cover it) | Medium |
| Recording plan | Chunks: each frame once per voice; each adjective per gender; each suspect's name; about 60 short lines for the first set, most shared with Find it and Dress up | — |

---

## 7. Stars, rewards and upgrades

| Star | Icon | Earned when |
|---|---|---|
| **Ear: Understood** | Ear (always) | Every tested clue committed right first time (or with only rung 1–2 help), the right accusation made when it was logically determined, and (L3+) Prove it right. A lucky guess never earns it |
| **Sharp thinking** (this mode's craft star) | **Nani's round gold glasses** (her likeness detail; a magnifier is Find it's) | L1–2: each commit within a generous par time from the end of Nani's line. L3+: **called it**: accused as soon as the clues so far allowed only one, without asking for a clue you didn't need. W5: answered every question within par |
| Tick: No help (Relaxed) / Lightning: Quick (Busy) | Tick / lightning | No rungs 2–6 / solved before the visible timer ring runs out ("before Nani's back from the door") |

**Pocket money:** 5 for helping (always, even a guess), +5 ear, +3 glasses, +3 tick or lightning, +1 per case in a row with the ear star (up to +5). Money is never lost.

**Collectibles:**
- **The case book:** a card per solved case, with the culprit's "caught" snapshot (Zazu inside the tiffin, Nana's syrupy beard). Cards are composed in code from existing sprites, so they're cheap. Culprit pages fill up (Zayn's collection).
- **The photo wall:** each relative you've met at the door gets a frame. It becomes W5's deck and a kinship collection (Maryam, Nani).
- **A detective rank** on the case book cover (helper → detective → Nani's right hand), from ear-star cases. Cosmetic, never shown as a score to others.
- The chapter quilt patch as usual (a magnifier or a sweet-box motif).

**Upgrades (they never do the listening):**

| Upgrade | Effect | Trade-off |
|---|---|---|
| Bigger sofa | Up to 8 suspects: bigger cases, more coins | Harder listening (like Cook's bigger pantry) |
| Chalk marks | Mark a suspect "maybe" (a half-sit) at L3+: a note-taking tool, like *Cluedo*'s notepad | Takes a toolbar slot |
| Chai for the witnesses (W3) | Witnesses come to you in turn instead of you tapping each room | Costs a little each day (a running cost, tycoon-style) |
| Case board pins (W7) | Chips snap into place faster | Late-game only |
| Case room décor | The sofa throw, a mirror-work cushion (restraint rule: 1–2 nods) | Hub décor only |

**Rejected upgrades:** a peephole lens (shows the visitor), Kasuku repeating the clue for free (makes a hint cheaper), a magnifier that highlights the culprit, "hint packs".

---

## 8. Engineering spec for the builder

### 8.1 Data model (`data/who.json`)

```json
{
  "_about": "Who did it? content. Suspects, attributes and clue types are data; levels are knobs; cases are story spines with generated middles.",
  "people": {
    "simba":  { "kind": "cat",    "gender": "m", "name_word": "nm-simba", "sprite": "cat-simba",
                "fixed": { "size": "big", "shade": "dark", "age": "old", "collar": "bell" },
                "anchors": { "head": [0.5, 0.18], "paws": [0.5, 0.92] } },
    "zazu":   { "kind": "cat",    "gender": "m", "name_word": "nm-zazu", "sprite": "cat-zazu",
                "fixed": { "size": "small", "shade": "light", "age": "young", "collar": "plain" } },
    "kasuku": { "kind": "bird",   "gender": "m", "sprite": "kasuku", "silent": true,
                "fixed": { "size": "small", "shade": "light" } },
    "nana":   { "kind": "person", "gender": "m", "kin_word": "kin-nana", "sprite": "nana-upper",
                "fixed": { "age": "old", "beard": true }, "variable": { "wears": ["cap-white", "glasses-round", null] } },
    "guest-f1": { "kind": "person", "gender": "f", "sprite": "guest-f1-upper",
                  "variable": { "scarf": ["tint:red", "tint:green", "tint:blue"], "wears": ["glasses-rect", null] } }
  },
  "attributes": {
    "size.big":     { "dim": "size",  "word": "adj-big",  "agrees": true },
    "wears.cap-white": { "dim": "wears", "word": "ft-cap", "layer": "ov-cap-white", "anchor": "head" },
    "trace.spi-01": { "dim": "trace", "word": "spi-01", "layer": "ov-trace-yellow", "anchor": "paws", "group": "yellow" },
    "holds.fru-01": { "dim": "holds", "word": "fru-01", "layer": "item:fru-01", "anchor": "hands" }
  },
  "clue_types": {
    "is":      { "line": "clue-is",    "slot": "adj",  "min_level": 1 },
    "has":     { "line": "clue-has",   "slot": "feature", "min_level": 1 },
    "holds":   { "line": "clue-holds", "slot": "noun", "min_level": 1 },
    "trace":   { "line": "clue-trace", "slot": "noun", "min_level": 1, "needs_examine": true },
    "isnt":    { "line": "clue-isnt",  "slot": "adj",  "min_level": 3 },
    "next_to": { "line": "clue-nextto","slot": "kin",  "min_level": 4 },
    "kin_of":  { "line": "clue-kinof", "slots": ["kin", "kin"], "min_level": 3, "mechanics": ["door"] },
    "was_in":  { "line": "clue-wasin", "slot": "room", "min_level": 5, "source": "testimony" }
  },
  "lines": {
    "who-ate":   { "e": "Who ate the sweets?" },
    "clue-is":   { "e": "It was the {x} one." },
    "clue-trace":{ "e": "It had {x} on its paws." },
    "clue-holds":{ "e": "The one with the {x}." },
    "not-me":    { "e": "Not me! I'm {x}!" },
    "guessed":   { "e": "You guessed!" }
  },
  "cases": {
    "a1c3-sweets": { "scene": "sofa", "mechanic": "lineup", "level": 1,
                     "pool": ["simba", "zazu", "kasuku", "ali"], "culprit": "random",
                     "crime": { "missing": 3, "item": "ph-mithai" },
                     "clue_types": ["is", "holds", "trace"],
                     "beats": { "intro": "beat-a1c3-box", "outro": "beat-a1c3-caught" } },
    "a4c5-crow":   { "mechanic": "board", "culprit": "crow", "fixed_truth": true }
  },
  "mechanics": {
    "lineup": { "levels": [
      { "suspects": [3, 3], "mode": "per-item", "items": 3, "clue_types": ["is", "has", "holds", "trace"], "new_words_max": 2 },
      { "suspects": [4, 5], "mode": "commit", "clues": [2, 4], "noop_chance": 0.15, "single_clue_solves": false },
      { "suspects": [6, 6], "mode": "ask-and-accuse", "prove_it": true, "negation": true },
      { "suspects": [6, 8], "mode": "ask-and-accuse", "prove_it": true, "negation": true, "relational": true, "mixed_gender": true }
    ] },
    "door":  { "levels": [ { "wall": 6, "visitors": 3, "features": 1 }, { "wall": 8, "visitors": 4, "features": 2 }, { "wall": 8, "visitors": 4, "clue_types": ["kin_of"] } ] },
    "guess": { "levels": [ { "cards": 6, "questions": [3, 4], "both_answers": true } ] }
  },
  "star_set": { "ear": "ear", "hand": "nani-glasses", "relaxed": "tick", "busy": "bolt" }
}
```

Every `lines` entry follows Cook's shape (`k` for Kutchi, `e` for a placeholder, `draft`, `src`), so the family's words drop in as data with no code change. Each clue row carries `kutchi_real` (true when the deciding word has Kutchi), for the audit.

### 8.2 Reused, and new building blocks

| From | Reused as it is |
|---|---|
| Cook | Word pill; the order ladder (rows = clues, one dot per clue, hidden neighbours share "•••"); stars shown as they happen; the receipt; completion card → case card; help costs (`onHelp`, ear per row); recast pattern; Relaxed/Busy with the visible patience ring; levels as data (`mechanics.<id>.levels`); grammar frames in data; word stages (`js/cook/lang.js`); the intro card and the word-review result card (Wave 5); greeting exchanges (`exchanges`) |
| Find it | Scene data (anchors and relations, for `next_to` clues); the non-speaker bot framework; the Search lab pattern → the **Case lab**; Explore (tap to hear, outside rounds); look-alike groups (traces use `lookalike_groups` so two white powders never appear together) |
| Shell | Profiles, word progress, the wallet, story beats, the world map places (when they exist) |

| New block | What it does | Size |
|---|---|---|
| `js/who/case.js` | **Pure logic, no Phaser**: build a balanced line-up, generate a clue chain, solve (the consistent set after each clue), grade commits, accusations and Prove it. Deterministic from a seed | Medium (the heart) |
| `js/who/suspect.js` | Composes a suspect: base sprite + attribute overlays at anchors + tints; idle motion; states `standing`, `forward`, `sat` (slides down behind the occluder, head peeking so it can be undone at L3+), `caught`, `not-me` | Medium |
| `js/who/lineup.js` | The W1 scene: sofa occluder, 2–8 slots, commit/Done, accuse, Prove it | Medium |
| `js/who/closer.js` | W4: the magnifier tool follows the finger; a close-up inset on the suspect (paws/hands) | Small |
| `js/who/guess.js` | W5: the dealt card (hand C3), ✓/✗ buttons, Nani's mini line-up | Small |
| `js/who/door.js` | W2: the door scene, the photo wall, open-door reveal, greeting hand-off | Small–medium |
| `js/who/notebook.js` (phase 4) | W3: the testimony page, room or colour targets, drag faces (tap-to-move, never drag-only) | Medium |

### 8.3 The Case lab

`who.html?lab=1`: pick a mechanic, a level, a pool and a seed; a new case per press; level buttons; Relaxed/Busy; "Nani helps" tick; a **solver panel** (hidden unless `?debug=1`: the consistent set after each clue); a **bot** toggle that plays the case with any leak strategy and shows the result; "Kutchi-real only" filter.

### 8.4 Test harness and the leak bot

**Logic tests** (`build/leak_who.mjs`, Node, no browser; seconds for 10,000 rounds):
- Every generated case has exactly one consistent culprit at its end, and none earlier than intended (L2+).
- The balance rules hold: every attribute value in a clue is shared by at least 2 when said (except the last); the culprit's distinctiveness is at or below the median; no two look-alike traces in one line-up; culprit position is uniform (chi-square check).
- **Leak strategies** (each must earn the ear star in **under 10%** of rounds; the target is under 5% from L2):

| Strategy | What it does | Estimate (from a quick simulation; `case.js` must reproduce) |
|---|---|---|
| Random pick / random subset | Taps at random | L1 3.7% (3 suspects × 3 items); L2 under 1% |
| Tap all / tap none / tap one / tap half | Fixed habits | 0% (no-op clues exist; exact sets) |
| Most distinctive / least distinctive / the odd one out | Picks by looks | ≈ random, by the balance rule |
| Position (first, middle, last) | Picks by place | ≈ random, by shuffling |
| Early accuse | Accuses at once | 0% ear (lucky guess rule) |
| Wait for the glow | Does nothing until shown | 0% ear (shown costs it) |
| Sound matching | Taps suspects to hear, matches the clue's sound | 0% ear from stage 3 (it costs the ear) |
| Row shape | Reads dot groups and row order | Must equal random |
| L3 accuse + Prove it at random | — | about 5.6% (6 suspects × 3 clues); 3.1% at L4 |
| W5 random ✓/✗, always ✓ | — | 6.25% / 0% (both answers in every round) |
| W2 random photo, "the last visitor" | — | under 1% (3–4 visitors × 6–8 frames) |

**Play tests** (`build/test_who.py`, Playwright, the `test_cook.py` pattern): real pointer events from `window.__who.expectation()`; the tap-cover check before every tap; deliberate mistakes to run the recast paths; every mechanic at L1–3; six sizes (phone 915×375, 1366×768, 1440×900, 1280×800, iPad landscape and portrait); `--bot <strategy> --rounds 200` runs the leak strategies through the real UI (seeing only the screen) and must match the logic-test rates; screenshots to `build/screenshots/who/`, which Claude looks at before any commit.

### 8.5 File layout (until the one-app shell exists)

```
who.html                      page + Case lab (?lab=1)
js/who/case.js                generator, solver, grader (pure)
js/who/suspect.js  lineup.js  closer.js  guess.js  door.js  flow.js  ui.js
js/who/notebook.js            (phase 4)
data/who.json                 people, attributes, clue types, lines, cases, levels
data/scenes/sofa.json         line-up slots, occluder, bubble, Nani's spot
data/scenes/front-door.json   door, photo wall frames, window
build/leak_who.mjs            logic leak bot
build/test_who.py             UI tests and UI bot
```

Import Cook's shared modules (`js/cook/lang.js`, the ladder, word pill, stars, receipt) rather than copying them; they move to `js/shared/` with the one-app shell.

---

## 9. Scene, art and asset list

### 9.1 Camera per scene (art bible: one camera per scene)

| Scene | Camera | Framing | Used by |
|---|---|---|---|
| **The sofa line-up** (Nani's sitting room) | **E**, as the art bible's "Who did it?" row | The sofa back as the occluder at about 62% height; suspects from the waist (people) or sitting on the cushions (cats, Kasuku on the arm); 1 screen, no pan; up to 8 slots at 200 px each | W1, W4, W5, W3 (phase 4) |
| **The front door** (inside) | **E** | Door centre-left, the window with Kasuku's perch on the right, the photo wall on the side wall | W2 |
| **The photo wall** close-up | **E**, straight on | 6–8 frames, faces inserted by code | W2 picks, W5 deck |
| Nani's bedroom, courtyard | E (shared with Find it) | As Find it | Arc 4 |
| Magnifier inset | **F**-like close-up of paws or hands, inside a round lens | Composed by code from the suspect sprite, scaled | W4 |

### 9.2 Layers and ambient motion

| Layer | Why |
|---|---|
| Background with **no painted people or clue objects** | Suspects are placed by data |
| **Sofa back occluder** cut from the background | Suspects sit down behind it |
| Each suspect: base + attribute overlays (glasses, cap, trace, held item) + tint regions (scarf, cap colour) | Varied line-ups from few bases |
| Head as a separate layer (existing rule for characters, cats, Kasuku) | Idle head turns, "not me" shake, caught nod |
| The door: closed and open frames; the visitor behind it | W2 reveal |
| Photo frames as sprites | Faces swap per round |
| Ambient (2–4, never near a tap target): curtain, ceiling fan, Kasuku's head tilt at the window, dust in a sunbeam | *Alive*, "reduce motion" switches it off |
| **Rule:** every suspect gets the **same** randomised idle set; no one fidgets more | Leak rule 3.2 |

### 9.3 Hand poses (from the existing set)

| Pose | Use |
|---|---|
| **C4** pointing | Tap who fits; accuse ("You!") |
| **C3** side pinch | Hold the dealt card (W5); old photos (W8) |
| **B2** vertical grip + a **magnifier tool sprite** | Look closer (W4) |
| **D1** grab | The door handle (W2) |
| **A5** wave, **A7** hand on heart | The greeting after the door |
| **E1** thumbs up | Case closed |
| **E7** shrug | The player's reaction on a lucky guess ("you guessed!") |
| **A3** palm up | Nani gives back the recovered sweets |

**No new hand poses.** One new **tool**: the magnifier (glass lens, so native transparency via the API).

### 9.4 New items, characters and backgrounds (reuse flagged)

| Asset | Count | Reuse | Where to make it |
|---|---|---|---|
| Sofa line-up background | 1 | **Reuse** Find it's sitting room; one variant framed on the sofa, occluder cut out | ChatGPT (free), edit in place |
| Front door interior | 1 | **Shared** with Tidy up's shoe mountain and greetings | ChatGPT |
| Photo wall close-up + frame sprites | 1 + 8 | New | ChatGPT (frames as a 4×2 sheet on grey) |
| Door open frame | 1 | New | ChatGPT edit in place |
| Named cast, upper body (Nani, Nana, Ma, Ali, older cousin, Big Ma, doctor) | 0 new sheets | **Reuse** the character sheets' game crop | — |
| Extra expressions per suspect: "not me" (surprised), "caught" (laughing, guilty) | 2 × 7 people | Already in the sheet's expression list (surprised, laughing) | ChatGPT edit from the sheet |
| Cats and Kasuku: sitting, guilty face, carrying something, startled | 0 new | **Reuse** the planned cat sheets (about 15 each) and Kasuku's pose set | — |
| **Generic line-up bases** (3 aunties, 3 uncles, 2 children), upper body, neutral + surprised + laughing | 8 × 3 = 24 | Also usable as guests, relatives, Find it M10 shoppers | ChatGPT from a family style reference |
| Attribute overlays: round and rectangular glasses, white topi, earrings; beard baked into bases | about 6 | Glasses reusable in Dress up | **API** (glass lenses need partial alpha) |
| Trace overlays: flour, turmeric, tomato, spinach, mud, water, syrup, each for paws and hands | about 14 | Traces reusable in Monsoon rush (mud) | **API** (soft edges) |
| Held items | 0 new | **Reuse** the F-view item library (Cook/Find it) | — |
| Magnifier tool | 1 | Could be Find it's zoom button art | API |
| The crow, nest (Arc 4) | about 4 | Later | ChatGPT |
| Case cards, case book | 0 art | Composed in code from sprites | — |

**Rough total:** about 3 backgrounds (1 a reused variant), 8 frames, about 38 character images (24 generic + 14 expressions), about 21 overlays and tools. Backgrounds, frames and character poses in **ChatGPT (free)**; overlays, traces and the magnifier through the **API** (transparency; about $3–6).

**Layout spec before art** (the Find it process): write `data/scenes/sofa.json` slots and the occluder line, greybox in the Case lab with grey figures and code-drawn overlays, run the leak bot, then write the art brief from the spec.

---

## 10. Persona loops

### Loop 0: the draft

The Guess Who flip-down line-up with clues from Nani, a door variant, Ask around as a notebook, and an evidence peek; ten candidate mechanics (section 3). Actions: "flip down who *doesn't* fit", graded per flip. Level 1 was two cats and one clue.

### Loop 1

| Persona | What they do, say and struggle with |
|---|---|
| **Layla, 5** | Loves the cats sitting down in a huff. "Flip the ones it *isn't*" is backwards for her: she taps the one Nani described. With two cats and one clue she wins by luck half the time, and the parent says the answer |
| **Zayn, 8** | Solves L1 in seconds; "What's the point when there's one left?" Wants a record and harder cases |
| **Maryam, 11** | Likes the family faces; wants the suspects to have personality and wants to keep the funny caught moments |
| **Zafar, 38** | One clue per 20 s is thin Kutchi. Wants clues that combine ("the small one who *wasn't* in the kitchen") and a real Guess Who against Nani |
| **Farah, 34** | A case of 3 minutes is too long for a quick go |
| **Nani, 68** | Worried about "thief" (*chor*) framing for family members. Would love to play Guess Who with a grandchild for real |
| **The Sceptic** | Wins by: (1) flipping one at a time and watching for "Arre re"; (2) picking the "odd one out" (the only cat in a row of people); (3) Simba's guilty face in the idle loop; (4) guessing at 2 cats, one clue (50%); (5) reading the English placeholder clues; (6) noticing the culprit was always in the middle slot in her 5 tries |
| **The Builder** | "Recording every clue per case isn't possible (the fun analysis's objection to Guess Who). And drawing 24 distinct people is expensive" |

| Finding | Change |
|---|---|
| "Flip who doesn't fit" is a double negative for 5-year-olds (negation research) | **Tap who fits**; the rest sit down on Done. "Not" clues only from L3 |
| Per-flip feedback lets you brute-force | **Commits graded as an exact set at Done**; recast, then retry |
| Two cats, one clue = 50% | **L1 = 3 suspects × 3 missing sweets**, one clue each (3.7% for a guesser) |
| The odd one out; fixed middle slot | **Balanced line-ups** (every clued value shared by ≥ 2; culprit not the most distinctive); **position shuffled**; culprit uniform |
| Guilty idle face | **One idle set for all**; guilty/caught only after the accusation |
| Placeholder clues readable | `kutchi_real` flag per row; the ear is grey for placeholder-only cases; **W4 traces with existing food nouns** go into the first set |
| Zayn: nothing to master | L3 "ask for clues, accuse when sure"; the **Sharp thinking** craft star = "called it" |
| Zafar: thin Kutchi, wants Guess Who | **W5 Nani guesses** added to the first set; L4 relational clues |
| Farah: too long | Cases of 60–150 s; **Case of the day** (60–90 s) |
| Nani: "thief" | Framing is "who ate / who took / who moved"; culprits laugh and share; no *chor* |
| Builder: recording and drawing load | **Clue templates from chunks** (frame × slot, per gender); **generic bases + overlay layers** instead of 24 unique drawings |

### Loop 2

| Persona | What they do, say and struggle with |
|---|---|
| **Layla** | "Tap who fits" works; with 3 cats-and-parrot she listens for *big* and *small*. New words glow the fitting ones as Nani says them, and then she knows. She needs the parent for the Done button the first time (a fingertip demo fixes it) |
| **Zayn** | Likes "called it"; but at L2, after Done the rest sit down, so "one left" is obvious and the craft star is free |
| **Maryam** | Loves the case book and wants the photo wall to be *her* family |
| **Zafar** | Much better; wants to hear past tense early; asks why the recap isn't in Kutchi |
| **Farah** | Case of the day is right |
| **Nani** | W5 Grandparent mode: she reads her question aloud, the child answers. "Proud" |
| **The Sceptic** | Wins by: (1) at L3, accusing a random suspect early and getting lucky 1 in 6; (2) on the first case every word is stage 1 and glows, so she "wins" the ear star; (3) tapping each suspect to hear their description and matching the sound of the clue; (4) the clue count: "it always ends after 3 clues, so on the third I tap exactly one"; (5) in W5 always answering ✓ worked once, when the dealt card had every feature |
| **The Builder** | Asks how to test the balance rules without drawing anything |

| Finding | Change |
|---|---|
| Lucky early accusation | **A lucky guess never earns the ear star** (the solver knows the consistent set); pocket money for helping only |
| Stage-1 glow wins the ear star | Taught rows don't count; a case needs **≥ 2 tested clues** for the ear; ≤ 2 new words a case |
| Sound matching by tapping suspects | Tap-to-hear is **help from stage 3** (tick, and ear when it's the clued feature) |
| Clue count | **No-op clues** (15%) and redundant clues; the ladder shows only clues already said |
| W5 always ✓ | Every W5 round has ✓ and ✗ answers |
| Craft star free at L2 | At L1–2 the craft star is **par time from the end of the clue**; "called it" only at L3+, where nobody sits down until you send them |
| Zafar: past tense early; recap in English | The **caught line and recap are S5 past tense, heard only** from Arc 1 (pre-exposure, like Cook's "Nani names what she's added"), in the word review |
| Maryam: her family | Photo wall frames can hold the player's own relatives' names **as audio** recorded by the parent (a Grandparent-mode extra; no text). Case book décor |
| Builder: test without art | **`case.js` pure and seeded**; `leak_who.mjs` in Node; greybox figures with code-drawn overlays in the lab |

### Loop 3

| Persona | What they do, say and struggle with |
|---|---|
| **Layla** | Plays L1 with a parent on a tablet: three decisions, three funny caught reactions. On a phone, 8 suspects would be too small |
| **Zayn** | L3–4 with Prove it; the "cases in a row" record and the culprit pages keep him going. Wants Busy mode |
| **Maryam** | Case book, photo wall, the old photo trunk promised for Arc 5, and (later) making cases for the cousin |
| **Zafar** | Counts about 10 Kutchi lines a 90 s case (the question, 3–5 clues, recasts, the caught line, the recap, the word review). W3 is denser. Wants to *ask* the questions himself (W5 player-asks) |
| **Farah** | Case of the day, 60–90 s, a count that never resets |
| **Nani** | Proud of W5 and the door (her family's kinship words, her greetings). Needs the kinship titles to be *this* family's |
| **The Sceptic** | Tries: random subsets, tap-all, most distinctive, positions, row shapes, early accusation, waiting, sound matching, always-✓, placeholder reading. **Structurally she no longer wins** (bot rates in 8.4, all under 10%). She still wins **every clue whose deciding word is an English placeholder**, which today is every describing word, yes/no and kinship term |
| **The Builder** | Estimates: `case.js` 2 days, line-up and suspects 3 days, W4 1 day, W5 1 day, W2 2 days, tests 2 days. Art mostly reused; 24 generic images the only big batch |

| Finding | Change |
|---|---|
| Phones and 8 suspects | Max suspects is a **device knob**: 6 on phones, 8 on tablets and laptops; 5-year-olds on a tablet |
| Zayn wants pressure | **Busy**: a visible ring ("before Nani's back from the door") drains; help drains it too |
| Zafar wants to ask | W5 **player-asks** in phase 3 (choose question pills: role reversal) |
| Nani: our words | The photo wall and W2 L3 wait for Round 1 Q10; the family's own titles |
| The Sceptic still wins on placeholders | → Loop 4 |

### Loop 4: the placeholder problem

The brief says stop only when the Sceptic can't win. After loop 3 she can't win **structurally**, but she wins on content, as Cook's Wave 4 found.

| Finding | Change |
|---|---|
| Almost every S3 word is an English placeholder, so W1/W2/W5 can't be a real Kutchi test yet | **Phase 1 ships only Kutchi-real clue types**: `trace` (food nouns), `holds` (food nouns), and cat names as suspects. The frame can stay English (`[EN: It had] hardar [EN: on its paws]`): the frame doesn't decide, the noun does (the same reasoning as Cook's frames) |
| W5 needs yes/no in Kutchi | W5 goes to the lab in phase 2 but **its ear star is grey until yes/no arrive**; ask for yes/no first in Round 3 |
| Describing words | Placed at the top of the family list (6.6) with a Round 3 "describe the cats" voice note: big, small, dark, light (the cats already show them) |

**After loop 4:** in phase 1 cases the Sceptic can't win (the deciding words are Kutchi food nouns; the bot rates hold). In placeholder cases the lab and the ear icon say "not yet a Kutchi test". Every persona has a reason to come back: Layla the cats' caught reactions, Zayn the record and Prove it, Maryam the case book and photo wall, Zafar Kutchi density and W5, Farah the case of the day, Nani Grandparent-mode Guess Who.

### Changelog summary

| Loop | Biggest changes |
|---|---|
| 1 | Tap who fits; exact-set commits; L1 3×3; balanced line-ups; one idle set; W4 and W5 into the first set; clue templates and overlay layers |
| 2 | Lucky-guess rule; ≥ 2 tested clues; tap-to-hear costs from stage 3; no-op clues; par-time craft star at L1–2; past-tense recap heard; pure seeded `case.js` |
| 3 | Device cap on suspects; Busy ring; player-asks W5; family kinship first |
| 4 | Phase 1 only Kutchi-real clue types; grey ear on placeholder cases; yes/no and describing words top of Round 3 |

---

## 11. Scorecard and verdict

| Criterion | Score | Why |
|---|---|---|
| Fun | **4** | Proven genre (Guess Who, Clue Jr., *Outfoxed*); the caught reveal and the cats give the juice. Risk: deduction can feel like a quiz without reactions and pace |
| Forces Kutchi | **5 by design; 3 in phase 1** | Every choice comes from a spoken fact, graded as a set, with bot rates under 10%. Only food-noun clues are Kutchi until the family's describing words, yes/no and kinship arrive |
| Distinct | **5** | The only mode where clues combine; the only one that asks the player questions |
| Plot | **5** | Arc 1 Ch2 and Ch3, the whole of Arc 4, Arc 2's invitation and gift, Arc 5's trunk |
| Replay | **4** | Generated cases, free play, the case of the day, W5 with the real Nani; the story truth fixed but the middle regenerated |

**Is it good?** Yes: a proven, cheap-to-vary genre whose core decision is *understanding a spoken fact about a person*, which is exactly S3.
**Is it complete?** As a plan, yes: S3 (W1, W2, W5) and S5 (W3, W6, W7), and all three story uses (the sweets, the door, the ring). The first set covers S3 and Arc 1; **S5 needs phase 4**.

**Verdict: Go with changes.** The changes: (1) build W1 with **Kutchi-real clue types first** (traces and held items), (2) get describing words, yes/no and kinship titles from the family before W2 and W5 count as tests, (3) settle the overlaps (W8 with Snap, W9 with Tidy up, Arc 4 Footprints from Spot it).

**Top risks**

| Risk | Mitigation |
|---|---|
| **Placeholders**: nearly all S3/S5 words are missing, so most clues aren't a Kutchi test yet | Kutchi-real clue types first; grey ear; the family list in 6.6 with priorities |
| **Recording load** (the fun analysis's reason for dropping Guess Who) | Chunked templates: each frame once per voice, each adjective per gender, about 60 lines for the first set, shared with Find it and Dress up |
| **Feels like a quiz** | Reactions on every tap, caught moments, the case book, Nani as co-op partner, 60–150 s cases |
| **Art consistency of overlays** on many bases | Anchor points per base (like tools in hand grips); a script checks overlay placement; greybox first |
| Negation and relations too hard for young players | "Not" from L3, relations from L4; tap who fits |

**Open questions for Zafar**

1. Who can be a culprit: the cats, Kasuku, Ali, **Nana** (sneaking sweets)? Nani herself? Baby Isa later?
2. Kasuku as a **silent suspect**: OK with the cast rule?
3. Craft star icon: **Nani's round glasses**?
4. Arc 1 Ch2: add **Who's at the door?** before the greetings (it becomes a new errand)?
5. Arc 1 Ch5: the **Nani guesses** party game as an optional Eid errand?
6. Arc 4 Ch4 "Footprints": this mode (look closer), or Snap/Find it?
7. L3+ **Prove it** (tap the clue that ruled someone out): right for 8+, or too school-like?
8. Photo wall with the player's own relatives recorded by a parent (audio only): wanted, or keep the game's own cast?

---

## 12. Build brief for the Who did it? build agent (rewritten 25 Sept, to match the deep dive)

All modes are built at once, one agent each. **Phases 0–1 touch only this mode's own files**; shared pieces come from the foundation agent and are stubbed until they land. Nobody edits `js/cook/*` or `css/cook.css`; Cook's modules are imported against the frozen API (`docs/shared-api.md` when it exists). Mechanic and level names are the deep dive's (D2, D3, D5).

### 12.1 Files this mode owns

```
who.html                          page + Case lab (?lab=1)
js/who/case.js                    generator, solver, grader (pure; no DOM)
js/who/mechanics/lineup.js        examine.js  accuse.js  prove.js  guesswho.js     (one mechanic per file; levels as data)
js/who/mechanics/photowall.js     door.js  notebook.js                              (phase 4)
js/who/games/{one-each,keep-who-fits,look-closer,nani-guesses,tell-ali}.js        (combined mini-games: zones over the mechanics, like js/cook/stations/)
js/who/flow.js  ui.js  suspect.js
css/who.css
data/who.json                     people, attributes, clue types, lines, cases, mechanics.<id>.levels, games
data/scenes/sofa.json             slots, occluder, Nani's spot, the side table
data/scenes/front-door.json       (phase 4; named so it never collides with Tidy up's doorway-floor.json)
build/leak_who.mjs                Node leak bot
build/test_who.py                 Playwright tests and UI bot (its own port)
```

### 12.2 Shared pieces needed from the foundation (assumed, not designed here)

| Piece | Used from | Until it lands |
|---|---|---|
| The shell ("one app, one save"): profiles, word progress, wallet, story beats, map places | Phase 3 | `who.html` runs alone on Cook's save, like Find it |
| `js/shared/speech.js`: `listen({choices, timeoutMs}) → {choice, confidence} \| null` | Phase 2 (`tell`, `yesno`) | A lab stub: `?speech=pills` (the fallback path only), `?speech=parent` (a ✓/again tick), `?speech=bot:<choice>` for tests |
| The shared "which one?" attribute-and-decoy module (balance, blind odds) | Phase 0 for `is`/`has` clues | `case.js` carries a local `balance()` with the same signature, deleted when the module lands |
| Overlay-at-anchor sprites (shared with Dress up) | Phase 3 (art) | Greybox overlays drawn in code: circle pair, white arc, coloured smudge, held item from existing art |
| Star sets and ear/voice rules as data (`star_sets.who`, `minTested`, taught-rows exclusion, the voice star) | Phase 2 | `data/who.json` `star_set` block, in the foundation's shape |
| `data/relations.json` + `js/shared/rel.js` + scene `spots` | Phase 4 only (`next_to`) | Not needed before then |
| `js/shared/mechanics/yesno.js` and `tell.js` | Phase 2 | **This agent writes them** (the clinic needs the same two); coordinate with the clinic agent on the file, not the design: the interface is D4's |

### 12.3 Phases

| Phase | Playable | Files touched | Tests passing | Leak bot | Screens |
|---|---|---|---|---|---|
| **0 Logic** | Nothing visual. `case.js` + `data/who.json` (cats, Kasuku, Ali, Nana, 4 greybox guests; trace, holds, is, has attributes; the four kinds K1–K4 as solver modes) | Own only | `node build/leak_who.mjs --rounds 10000` per game and level: unique solutions; balance; culprit position uniform; the D5 rates reproduced | Every strategy < 10%; G2 L1 ≈ 4%; L2+ < 5% | — |
| **1 Greybox** | Case lab: **G3 Look closer, G1 One each, G2 Keep who fits** at L1–2 with grey figures; ladder, stars, receipt, word review, Relaxed; Arc 1 Ch3 case from `who.html?case=a1c3-sweets` | Own only | `test_who.py --lab --game g1,g2,g3 --level 1,2`; recast paths; tap-cover check | UI bot matches logic rates (±2 points) over 200 rounds per strategy | All six sizes; Claude checks the screenshots |
| **2 Speaking + Nani guesses** | **G5 Tell Ali** (L1–2) and **G4 Nani guesses** (L1) in the lab; `tell` and `yesno` shared files; the voice star; Busy (the chai ring); L3 of G2 (ask, accuse, Prove it, no-op clues) | Own + `js/shared/mechanics/{tell,yesno}.js` | `test_who.py --game g4,g5 --speech bot`; `--speech pills` fallback; the null/low-confidence "Again?" path | G4 < 10% (ear grey until yes/no); G5 voice star 0% without a mic or parent | Six sizes |
| **3 Art + story + free play** | Real sofa, cats, generic bases, overlays from the foundation system; story hooks (Arc 1 Ch3 with the Tell Ali outro, Ch5); "Nani's mysteries" with the 60-second round for the hub daily; Grandparent mode | Own + the shell's registration hook | `test_who.py --free 3 --story a1c3`; art QA checklist | Unchanged | Six sizes |
| **4 The door and S5** | G7 (front-door scene, kinship), G8 notebook (Arc 2 Ch4, Arc 4 Ch1–2), G9, G10 finale, L4 relations | Own + `front-door.json` + relations (read only) | `test_who.py --door --notebook` | All < 10% | Six sizes |

### 12.4 The first three tasks

**Task 1: `js/who/case.js` and `data/who.json` (phase 0).**
- `data/who.json` per 8.1, updated: `people` (simba, zazu, kasuku, ali, nana, guest-f1…f2, guest-m1…m2, each with `gender` and anchors), `attributes` (size and shade with `agrees: true` and the drafts *vadho/nindho* flagged `draft`; wears; holds from food nouns with Kutchi; trace from `hardar`, `atto`, `tameto`, `lal marcha`, `jeeru`, `dai`, `marcha` and `ph-mud`, with `lookalike` groups white/red/green), `clue_types` (`is`, `has`, `holds`, `trace` at L1–2; `isnt` and two-slot at L3), `lines` (placeholders `e` in Cook's shape, including Ali's echo lines and Nani's question frame from D8 rows 8–9), `mechanics.<id>.levels` for lineup, examine, accuse, prove, guesswho, `games.<id>` (which mechanics, which kind, level data, `listener` for G5), `star_set` with the voice star, one case `a1c3-sweets`.
- `case.js` exports `makeCase(data, {game, level, pool, seed, device})` → `{suspects[], truth, clues[], consistent(i)}`, `grade(state, action)`, and two solver modes the reversed kinds need: `askNext(state)` (Nani's next question, halving) and `actOn(state, word)` (what Ali does with a heard word). Pure JS, seeded RNG.
- Generator rules: culprit uniform; line-up shuffled; variable attributes rolled; balance (every clued value shared by ≥ 2 when said, except the last; culprit distinctiveness ≤ median); no single clue solves from L2; every L1–2 clue removes someone; no-op clues only from L3 (15%); one trace per look-alike group; every clue row flagged `kutchi_real` and `draft`; G4 rounds always hold both a yes and a no.
- `build/leak_who.mjs`: the strategies in 8.4 plus "tap half" and "peek at all then random"; a table per game and level. **Done when** every rate is under its threshold and D5's L1 numbers are reproduced within a point.

**Task 2: the greybox mini-games in the Case lab (phase 1).**
- `who.html`, `js/who/{flow,ui,suspect}.js`, `js/who/mechanics/{lineup,examine,accuse}.js`, `js/who/games/{one-each,keep-who-fits,look-closer}.js`, Phaser at 1600×900 with the HTML sidebar (Cook's layout contract v2); `css/who.css`.
- `data/scenes/sofa.json`: 8 slot x-positions (5 on a phone), the occluder line at y≈560, Nani's spot at the left, the side table (Busy's chai, `passme`'s look-alikes), the magnifier inset box. Grey figures; overlays drawn in code.
- `lineup`: states and tweens as before (`forward`, `sat` with the head peeking at L3, `not-me`, `caught`); the commit through Cook's `freePick` step. `examine`: the lens follows the finger, the inset shows the trace, free. `accuse`: C4 pointer; lucky-guess rule; the recap line.
- Flow per game: intro card → 3 s silence → clue row (Cook's pill and ladder) → commit/Done → recast or sit → accuse → caught → recap → stars → word review → receipt. `window.__who.expectation()` for tests. Help costs as 6.2; word stages as 6.3 via `js/cook/lang.js`.
- Lab controls: game, level, seed, pool, Relaxed/Busy, "Nani helps", the bot strategy menu, the debug solver panel, the speech stub selector (phase 2).
- **Done when** G1–G3 at L1–2 play end to end on all six sizes, and a player who follows the clues can't tell the greybox from a real case except for the art.

**Task 3: the test harness (phase 1).**
- `build/test_who.py` on the `test_cook.py` pattern, own port: serve the repo, open `who.html?lab=1&game=g3&seed=N&speed=3`, play from `__who.expectation()` with real pointer events, tap-cover check before every tap, one deliberate wrong commit and one wrong accusation per case, G1–G3 × L1–2, six viewports, screenshots to `build/screenshots/who/`.
- `--bot <strategy> --rounds 200`: the bot sees only the screen (positions, row shapes, glow states); its ear-star rate is printed beside `leak_who.mjs`'s.
- **Done when** every run passes, bot rates match the logic rates within 2 points, and the screenshots pass the visual checklist (nothing covered; suspects fully visible when standing; the sidebar off the line-up on the phone; the inset never over a suspect).

**Task 4 (phase 2, first of the next batch): `js/shared/mechanics/tell.js` and `yesno.js`, then G5 and G4.** `tell({choices, pills, character, onHeard})` calls `listen`, shows the pills after one `null` or after `timeoutMs`, and reports `{choice, via: "voice" | "pill" | "parent"}` so the star code can award the voice star only for `voice` and `parent`. G5 = `tell` + `lineup` driven by `case.actOn`; G4 = `guesswho` + `yesno` driven by `case.askNext`.

---

## Sources

- Guess Who strategy and design: [Games for Young Minds](https://www.gamesforyoungminds.com/blog/2018/8/15/guess-who) (attributes, quick play); [Chalkdust, Cracking Guess Who](https://chalkdustmagazine.com/blog/cracking-guess-board-game/) (halving); [Lancaster STOR-i, optimal strategy](https://www.lancaster.ac.uk/stor-i-student-sites/edward-mellor/2020/02/26/optimal-strategy-for-guess-who/) (search summaries only)
- Guess Who in ESL: [ESL Kids Games](https://www.eslkidsgames.com/esl-guess-who); [eslactive, Classroom Guess Who](https://eslactive.com/games/classroom-guess-who/); [AmeriLingua lesson plan](https://www.amerilingua.com/esl-lesson-plans/guess-who-what-it-is) (search summaries only)
- Cluedo: [Wikipedia, Cluedo](https://en.wikipedia.org/wiki/Cluedo); [Deduction board game (the missing card)](https://en.wikipedia.org/wiki/Deduction_board_game)
- Clue Jr.: [Hasbro rules](https://instructions.hasbro.com/en-gb/instruction/clue-junior-game-instructions); [Geeky Hobbies rules](https://www.geekyhobbies.com/clue-jr-the-case-of-the-missing-cake-rules/) (look under, cross off; ages 3–8)
- Outfoxed!: [The Family Gamers review](https://www.thefamilygamers.com/outfoxed-game/); [official site](https://outfoxedgame.com/) (the decoder, co-op, 5+)
- Carmen Sandiego: [Wikipedia, 1985 game](https://en.wikipedia.org/wiki/Where_in_the_World_Is_Carmen_Sandiego%3F_(1985_video_game)) (the warrant from matched traits)
- Obra Dinn: [Wireframe, the rule of three](https://wireframe.raspberrypi.com/articles/obra-dinn-the-rule-of-three); [Intermittent Mechanism, confirmation](https://intermittentmechanism.blog/2024/05/21/confirmation-in-the-return-of-obra-dinn/)
- Ace Attorney: [Wikipedia, Phoenix Wright](https://en.wikipedia.org/wiki/Phoenix_Wright:_Ace_Attorney) (press and present)
- Golden Idol: [Game Developer, pursuing the "aha"](https://www.gamedeveloper.com/design/case-of-the-golden-idol)
- Papers, Please: [Fandom, inspection mode](https://papersplease.fandom.com/wiki/Inspection_mode)
- Professor Layton: [Wikipedia, Curious Village](https://en.wikipedia.org/wiki/Professor_Layton_and_the_Curious_Village) (unlimited time, hint coins)
- Kids' detective apps (Toca Mystery House, no reading): [Common Sense Media, mystery games](https://www.commonsensemedia.org/lists/mystery-games) (search summary only)
- Information-gap tasks: [Pica, Kang and Sauro 2006, SSLA](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/information-gap-tasks-their-multiple-roles-and-contributions-to-interaction-research-methodology/6696A843010BC1DB5BF0D579CD018829); [Doughty and Pica 1986](https://onlinelibrary.wiley.com/doi/abs/10.2307/3586546)
- Children's questions: [Ruggeri and Lombrozo 2015, Cognition](https://www.sciencedirect.com/science/article/abs/pii/S0010027715300317); [Legare et al. 2013](https://www.sciencedirect.com/science/article/abs/pii/S0022096512001270)
- Reasoning by exclusion: [Mody and Carey 2016](https://www.harvardlds.org/wp-content/uploads/2018/05/Mody-The-Emergence-of-Reasoning-by-the-Disjunctive-Syllogism-in-Early-Childhood.-.pdf)
- Negation in children: [Nordmeyer and Frank 2014](https://langcog.stanford.edu/papers/Nordmeyer_Frank_2014.pdf); [Grasping the alternative, Frontiers 2019](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.01227/full)
- Past tense and "yesterday": [Valian 2006, present and past tense](https://www.tandfonline.com/doi/abs/10.1207/s15473341lld0204_2); [Zhang and Hudson 2018, yesterday and tomorrow](https://www.sciencedirect.com/science/article/abs/pii/S0022096517305532)
- Recasts vs prompts: [Lyster and Saito 2010](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/oral-feedback-in-classroom-sla/4999EE1C8379B2BF026B148EAF373CA1)
- Leak estimates: a quick simulation in the session scratchpad (not committed); `build/leak_who.mjs` must reproduce them

Pipeline design research (25 Sept 2026, web search; pages read through search summaries unless noted):
- Blue's Clues mechanics and the Thinking Chair: [Blue's Clues Wiki, Mechanics!](https://bluesclues.fandom.com/wiki/Mechanics!); [Thinking Chair](https://bluesclues.fandom.com/wiki/Thinking_Chair); [StudyDaily, Blue's Clues mechanics](https://studydaily.blog/blues-clues-mechanics-science)
- Guess Who digital: [Guess Who? Meet the Crew (PlayDate Digital)](https://playdatedigital.com/guess-who-meet-the-crew/); [WhoTF face guessing game](https://apps.apple.com/us/app/whotf-face-guessing-game/id6474140782); [Hasbro Guess Who rules](https://instructions.hasbro.com/en-us/instruction/guess-who-original-guessing-game-board-game-for-kids-ages-6-and-up-for-2-players)
- Clue Jr.: [Geeky Hobbies rules](https://www.geekyhobbies.com/clue-jr-the-case-of-the-missing-cake-rules/); [LoveToKnow instructions](https://www.lovetoknow.com/parenting/kids/clue-jr-game-instructions)
- Outfoxed!: [Official rules](https://officialgamerules.org/game-rules/outfoxed/); [Smarter Learning Guide review](https://smarterlearningguide.com/outfoxed-board-game-review/); [Outfoxed for ages 5–6](https://littlelovinglife.com/outfoxed-review/)
- Scooby-Doo Mystery Cases: [MobyGames](https://www.mobygames.com/game/148949/scooby-doo-mystery-cases/); [The Horror Times review](https://thehorrortimes.com/2019/01/31/scooby-doo-mystery-cases-app-game-review-by-baron-craze/)
- Toca Mystery House: [Common Sense Media review](https://www.commonsensemedia.org/app-reviews/toca-mystery-house)
- Kids' mystery game lists: [Keiki, mystery games for kids](https://keiki.app/blog/mystery-games-kids-detective-activities); [pastory, detective activities](https://pastory.app/articles/mystery-activities-for-kids/); [Mystery Tribune, detective game apps](https://mysterytribune.com/47-best-mystery-detective-and-crime-game-apps-iphone-android-phones/)
