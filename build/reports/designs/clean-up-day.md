# Clean-up day: do it to the thing (design, 1 Nov 2026; revised after the critique the same night)

Written overnight while Zafar slept. He asked for every game to be designed alone, with each choice written down so he can reverse it (§10). This is design only. No code, data or other doc was changed. The independent critique (`clean-up-day-critique.md`) was applied the same night; §12 lists each finding and what changed.

Sources, newest first:
- **Zafar's scope:**
  - zoom into a room, the bathroom first: soap on the shelf or tray, turn off the tap, sweep the dirt away with the broom (it vanishes), close the curtains, switch off the light, open and close the drawer;
  - it owns the home verbs; it reacts like a toy, not chores; states start mixed; the order card's picture at L1 only;
  - toys belong in the play room ("toys are part of tidying up");
  - the rooms are the bathroom, the play room, the bedroom and the kitchen;
  - the doll's house: "4-5 rooms at most" (the settings map §1); **Zafar, 1 Nov: a two-storey doll's-house cross-section, downstairs the kitchen and the sitting room, upstairs the bathroom, Nani's bedroom and Ali's room (the play room)**, not rooms in a row; push on a toy car in Ali's room; the kitchen as the fourth visit.
- **The maps:**
  - the games map (`build/reports/games-master-map-2026-10-31.md`): Part 1 "A day at home", Parts 2, 3, 5 and 7, and his answers of 1 Nov;
  - the settings map (`game-settings-map-2026-10-31.md` §1, row 20, and §4's three home games).
- **Research (31 Oct):**
  - other games §5 (clean-up day) and its cross-cutting lessons;
  - mechanics: finding 2 and the "Nani says, do it" row ("fails if each thing can only do one action: the noun gives it away");
  - existing games §4 (Tidy's toy box and boards).
- **Tonight's sibling designs:**
  - `do-it-engine.md` (the shared engine; statues and getting ready);
  - `hide-and-seek.md` (the first game of the same day; the openables and the cats; its revised layout and prompts);
  - `pick-it-up-put-it-back.md` (the doll's-house view and the place piece).
- **The rules:** `lessons-checklist-2026-11-01.md`, `docs/game-design/rulebook.md` §1, `data/rules.json`, `docs/game-design/cast.md`, the art bible §1-3 and §6.

**About the Kutchi in this doc:** it is only what is already in the repo (`build/reports/research-word-inventory-2026-10-31.csv`). Sentences are given in English, because the language engine builds them from Mum's phrases. The tags mean:
- **✓** a family clip of the word, or the whole line, checked;
- **recorded, to re-check** a family clip exists, but it's a draft entry or an unchecked take;
- **inside lines** Mum says it only inside longer recorded lines;
- **in engine** the engine has it, but it isn't recorded (not usable until it is);
- **to record** the repo has no Kutchi for it yet.

---

## 0. One line

| | |
|---|---|
| **What** | The camera zooms from Nani's doll's-house view into one room. Nani asks for things to be done to the room ("switch off the light", "close the curtains"), and the child taps the thing. It reacts like a toy: the water stops with a plink, the room dims and a cat's eyes glow, the dust vanishes in a sparkle. |
| **Day** | A day at home: the third and last game (hide and seek, then pick it up and put it back, then the clean-up), then the evening book. |
| **Status** | New (31 Oct), now designed and critiqued. Not agreed. |
| **Engine** | The shared **`do-it`** engine (`do-it-engine.md`), here with its "state" field. A thing is an actor whose actions are its states (on and off, open and closed, dirty and clean). Hide and seek's **openable** piece is reused for the doors and drawers; pick it up's **place** piece does the put-away moves. Everything else is the shared kit. |
| **Size** | Medium. The code is small once `do-it` exists: the state things, the two-tap tool, the ask maker's check (exactly one target, spent pairs), the phone cap. That's about half a builder sprint. **The art is the biggest part:** the bathroom alone is about 38 frames plus the cats, Nani and Ali poses, and four more backgrounds follow (§7). The first art run is only the bathroom's L1-L2 set (about 28 frames). **Recording is the blocker:** none of the home verbs has Kutchi in the repo; Mum's sheet is about 15 clips for L1, 14 for L2 and 16 for L3-L4 (§1). |

---

## 1. The language goal

**Word groups:**
- **Main:** the home verbs (turn off and on, switch off and on, open, close, sweep, wipe, put away), and household things.
- **Supporting:** toys (the play room); describing (on and off, open and closed, dirty and clean, dark).
- **Woven in:** big and small (L4, the twin taps), "all" (L4), and "first ... then" (L4).

**Form:** the bare command to a child, as Nani says it. The child says the same form to Ali in the speaking moment.

### The words it teaches (first visit: the bathroom)

**The verbs:**

| English | Kutchi in the repo | Status | Decides from |
|---|---|---|---|
| turn off (the tap) | none | to record. Mum to say whether her *firai* ✓ ("turn over, stir", a cooking word) is ever used for a tap. Never lift it across without her | L1 (with its noun) |
| switch off (the light) | none; **Zafar, to confirm: *bund*, as the family says "close the light"** (1 Nov) | to record | L1 (with its noun) |
| close (the curtains, the drawer) | none. *band* (closed) is in engine; **Zafar, to confirm: *bund*** (1 Nov; the same word closes a light) | to record. Mum to say how she says "close it" | L1 (with its noun) |
| sweep (the floor) | none; **Zafar, to confirm: *fugya*** (1 Nov) | to record | L1 (with its noun) |
| turn on, switch on | none | to record | L2 (the verb decides) |
| open | none | to record | L2 (the verb decides) |
| put (the soap) on the tray | *rakh* (put) inside lines; *mathe* (on) inside lines; tray to record | inside lines / to record | L2 |
| wipe (the mirror) | none | to record | L3 |
| wash (the cup, the glass): the kitchen | *dho*; the whole line "wash the glass, wash the cup" (*dhui ginta ja glass dho, cup dho*) | recorded, to re-check (a draft engine entry, take unchecked) | kitchen visit |

**The things (bathroom):**

| English | Kutchi in the repo | Status | Decides from |
|---|---|---|---|
| tap | none ("taps" is an English placeholder in the engine) | to record | L1 |
| light | none. *bar* ✓ means "light (a fire)", a cooking verb. **Zafar, to confirm: *batti*** (1 Nov) | to record | L1 |
| curtains | none | to record | L1 |
| floor | none | to record | L1 ("sweep the floor") |
| broom | none; **Zafar, to confirm: *fugyu*** (1 Nov) | to record | heard L1; decides at L3 (against the cloth) |
| drawer | none | to record | heard L1 (named when first touched); decides L2 |
| soap | none | to record | L2 |
| tray | none ("the tray" is an English placeholder) | to record | L2 |
| shelf | *shelf* (the English word, in engine) | in engine | L3 (tray or shelf) |
| mirror | none | to record | L3 |
| cloth | none | to record | L3 |
| window | none | to record | L3 |
| cupboard (the mirror cabinet: its door is the mirror) | *kabaat* | ✓ | L3 |

**The describing words** (heard in Nani's lines and the reasons; decide only through the verb): on, off, dark, dirty, clean (all to record); closed *band* (in engine); hot *garam* ✓ (the kitchen visit's tap); big *wadho* (inside lines) and small *nindho* ✓ (L4's twin taps).

**Nani's other lines:** well done *shabash* ✓; careful *dhyan rakh* ✓ (the wet floor); "what a mess!" and "tidy up!" (English placeholders in the engine; to record); "it's dark" (to record). *Ad na* ("don't touch", in engine, not recorded) is **not usable** until Mum records it; until then Simba's L4 beat runs without a line (C5).

**Later rooms add** (all to record unless marked):
- **The play room (Ali's room):** toy box, teddy, ball, blocks, toy car (*gadi* is inside lines, for a real car: Mum to say if it's used for a toy), music box, fan; and play (a missing top-40 verb).
- **The bedroom (Nani's):** lamp, fan, wardrobe, window, bed; sleep, night.
- **The kitchen:** cupboard *kabaat* ✓; cup ✓; glass (the English word, inside a line); table (the English word, inside lines); wash *dho* (the recorded line, to re-check); fan; tap; hot *garam* ✓; cold *thundo* (recorded as "cold, gone cold" for food: **Mum to confirm for a tap** before it's used).

### Its verbs

turn off and on, switch off and on, open, close, sweep, wipe, put, wash (kitchen), play (play room). From Part 3's top 40:
- **turn (26), open (36) and put (7)** decide here;
- **push (38)** gets its home on **a toy car in Ali's room** (Zafar, 1 Nov: yes): "push the toy car" and it zooms off round the rug;
- **play (17)** gets a second home (the play room), after the party.

### Frames

**Heard (English meaning; the engine builds them from recorded pieces):**

| When | Frame | Pieces |
|---|---|---|
| The zoom (every round) | "What a mess! Let's tidy the bathroom." | to record; the room's name to record |
| The ask, L1 | "[verb] the [thing]": "turn off the tap", "switch off the light", "close the curtains", "sweep the floor" | to record (Mum's first job) |
| The ask, L2 | the same, both ways: "turn on the tap", "open the drawer", "put the soap on the tray" | to record; *rakh*, *mathe* inside lines |
| The ask, L3 (other ways) | the reason first, then the ask: "it's dark in here, switch on the light"; "Zazu wants to look out, open the curtains"; "the tap's running, turn it off" | to record |
| The ask, L4 | "turn off the big tap" (*wadho*); "switch off all the lights"; "first close the curtains, then switch on the light" | big inside lines; first ... then to record |
| A miss | the ask again, word for word (free); the first time the drawer is touched, "the drawer!" leads the re-ask | |
| The end | *shabash* ✓; "now it's clean!" | ✓ / to record |
| The day's last beat (unscored) | "It's night. Switch off the light." | to record |

**Said (from L3 or the second visit; §3, C4):** the child tells Ali one ask from a closed set of three that sound different: "switch off the light", "close the curtains", "turn off the tap". Zafar checks they sound different once they're recorded. If the family's *bund* covers both "close the light" and "close the curtains" (Zafar, to confirm), those two share a verb and differ by the noun (*batti* against curtains), and the set is checked again then.

### New words per level

The lessons ask for 3-5 new words a round, each heard at least 3 times. At L1 the verb always comes with its noun, so each ask is one chunk.

| Level | New this level | Count |
|---|---|---|
| **L1** | tap, light, curtains, floor (each heard with its verb: turn off, switch off, close, sweep). The broom and the drawer are heard only | 4 chunks |
| **L2** | on, open (the verbs now decide, both ways); drawer; soap, tray | 5, over two rounds |
| **L3** | wipe, cloth, mirror, window, cupboard *kabaat* ✓, shelf; the reasons ("it's dark") | 5-6, over two rounds |
| **L4** | big and small (the twin taps), all, first ... then | 3 |

### Mum first: what she records, in order

The game teaches nothing until these are recorded. Grey English would be a reader's win (lessons §1; the dastarkhwan won 95-100% that way). The engine builds a line only from recorded pieces (non-negotiable 2), so each level's list carries the verbs alone and the frame pieces the next level's lines are built from, not just whole sentences.

**What Mum records for L1 to play (15 new clips; 2 reused):**

| # | Line | Why |
|---|---|---|
| 1-4 | turn off the tap; switch off the light; close the curtains; sweep the floor (whole sentences) | the four L1 asks |
| 5-8 | tap; light; curtains; floor (alone) | the naming at the start, the card's speaker |
| 9-10 | drawer; broom (alone) | the drawer named when first touched; the broom at the tool's showing |
| 11 | bathroom | the zoom line and the doll's house |
| 12 | what a mess! | the zoom |
| 13 | let's tidy (the room's name joined by the engine) | the zoom |
| 14 | now it's clean! | the end |
| 15 | it's night, switch off the light | the day's last beat |
| reused | *shabash* ✓; *dhyan rakh* ✓ | the end; the wet floor |

**For L2 (14 more):** turn on the tap; switch on the light; open the curtains; open the drawer; close the drawer; put the soap on the tray (6 whole sentences); turn off; turn on; switch off; switch on; open; close (6 verbs alone, so the engine can build any thing's ask both ways); soap; tray.

**For L3-L4 (about 16 more):** wipe (alone) and "wipe the mirror"; cloth; mirror; window; shelf (Mum's word, or the English *shelf* in her voice); "put it on the shelf"; the three reasons ("it's dark in here", "Zazu wants to look out", "the tap's running"); "you tell Ali"; big (alone; *wadho* is only inside lines) and "the big tap", "the small tap" (with *nindho* ✓); all ("all the lights"); first ... then; shampoo; *ad na* (for Simba's L4 beat).

**The bathroom's sheet in all: about 45 clips.** The order above is the order of what unblocks play.

**One question for Mum before the lines:** does she use one word for several of these? Many languages "close" a tap and a light. If she does, the noun decides those moves and on or off still does. The design works either way (§10, decision 4).

---

## 2. Where it sits in its day

**A day at home, hosted by Nani, with Simba and Zazu.** Zafar's order: hide and seek, then pick it up and put it back, then the clean-up. Every day is the door, its games, then the evening book. There's no `docs/game-design/days/home.md` yet; this row and hide and seek's §2 are its first lines.

**One house for the whole day (decision 25; Zafar, 1 Nov):** **a two-storey doll's house, drawn as a cross-section,** not rooms in a row. Downstairs: the kitchen and the sitting room (the front door in its wall). Upstairs: the bathroom, Ali's room (the play room; its toy box is already there) and Nani's bedroom (hide and seek's room). The clean-up has all four of his rooms: the bathroom, the play room, the bedroom (all upstairs) and the kitchen (downstairs). Pick it up and hide and seek use the same house; pick it up's first visit plays the kitchen, the sitting room and Nani's bedroom; its shoe rack stands in the sitting room, by the front door.

| Step | What happens | What carries |
|---|---|---|
| **The door** | Nani: today we're at home. The day's weather is the sky. | The sky outside the bathroom window (sun or rain) matches the door's. |
| **1. Hide and seek** | The cats hide in Nani's bedroom; "look in the wardrobe". Each round ends "close the wardrobe". | **Close is met here first.** The cats are known. The torch (its later visit) ends on "switch on the light". |
| **2. Pick it up and put it back** | Nana's glasses and the other mischief things go back to their places, in the doll's-house view. | **The doll's-house view** (one overview background, two storeys, five rooms) and its rooms. The clean-up starts from the same view. |
| **3. The clean-up** | The camera glides from the doll's house into one room. Nani's asks; the toy-like reactions; the room ends tidy and cosy. | **Into the book:** the room before and after, and "what did we switch off?" (heard; past tense later). |
| **The evening book** | The day's last beat: it's night, Nani says "switch off the light". The child's tap darkens the house, and the book opens. | The day ends on this game's verb. |

**Rhythm:** hide and seek is lively (reveals), pick it up is calm (carrying), and the clean-up is a toy-box of reactions. The `do-it` engine never runs two scored games in a row on any day. The day's last beat is one unscored `do-it` tap straight after the clean-up; that's allowed because it's a single heard line and a tap, not a game.

**Carries out to other days:** the home verbs come back in the monsoon (close the window; parked), the clinic's CLN-119 level (open the window, switch the fan on), and the school day's getting ready (wash).

---

## 3. The stages and mini-games

### The round in one diagram

```
the doll's house  ->  zoom into the room  ->  Nani's asks (3-6, mixed kinds)  ->  the cosy end  ->  back out
   (shared view,        (glide, 1 s)          C1 toggle, C2 tool, C3 put away      ("aah", the       (the room's
    2 + 3 rooms)                              C5 Simba once (L3+)                  word card)        window glows)
                                              C4 Tell Ali (L3+ or visit 2)
```

One room per round. Nani's asks are mixed so that two asks in a row never use the same kind of action (lessons §12: no fatigue).

### The engine here, in one paragraph

Each room holds **things**. Each thing has two states, drawn as real art (the tap running and off; the curtains open and closed), and changing state plays a short reaction. **A tap on a thing flips its state.** Cleaning uses a **tool**: tap the tool, then the place (tap, then tap). Nani says an ask; its card pops big and flies into its row.
- **Right:** the reaction, then the row ticks and the next ask comes.
- **Wrong:** the wrong thing does its reaction as a comic miss, then flips back by itself (it's undone). Nani says the ask again, and the child redoes it on the spot. The row ticks when the right thing is done (a done thing can't be refused), but **only a right first pick counts** for the level and the end screen's first-pick stars.
- **The one rule the builder must code:** every ask has **exactly one** right target in the room's current state. The ask maker checks this before each ask (for example, it never asks "switch off the light" when two lights are on, until L4 adds "the big one" or "all").
- **Spent pairs (the honest consequence):** from L2 a kind comes as a pair in opposite states. Once one of the pair is asked and done, both are in the same state, so neither "on" nor "off" has exactly one target: **the pair is spent** and the ask maker treats it as unaskable for the rest of the round, unless Simba puts it back into opposite states (C5, L3+) or an L4 size word ("the big tap") picks one of a same-state pair. So a round's asks come from different kinds, and every level has **at least asks + 2 askable kinds** (§3 ladder).
- **Level-up rests on first picks** (decision 22, part of the shared rulebook proposal, decision 35): up one level after 3 finished rounds in a row where every ask was right first pick (Zafar, 1 Nov: right-first-time rounds only), and the guide's hint came at most once. Showings never count. Proposed as `advance.maxNotFirstPick: 0` in `data/rules.json` (every game; hide and seek's first-open rule is the same rule), or failing that `advance.engines["do-it"].maxNotFirstPick: 0`, read by the engine for statues, getting ready and the clean-up, and by the leak bot. Not added tonight.

Nothing moves by itself, nothing glows on the answer, and there's no timer.

### Taps during a reaction

A tap during a reaction (the duck surfing, the gush, the sock waving) is **taken, never dropped** (non-negotiable 7): the reaction jumps to its end frame and the tap counts. Nothing is said while a reaction plays; the next line starts when it ends or is cut short.

### The three helps (one rule, every level)

- **Listening again is free, always:** a tap on the card's speaker replays the ask.
- **Nani's repeat is the guide's hint:** at 7, 9, 11 or 13 s from the last action (L1 to L4, `data/rules.json` `hintS`), Nani says the ask again, word for word. It counts as the round's hint for level-up (the rules' "only the guide's hint counts"), never as a verdict.
- **The helper card** opens in the guide box on the next rung (the same wait again with no action) with the full answer; it costs the bulb and doesn't count.

There is no other repeat ("every few seconds" is gone).

### The pool, scored

Scores out of 5: fun, does the Kutchi decide, novelty, build cost (5 = cheap).

| Candidate | Fun | Kutchi decides | Novel | Cost | Verdict |
|---|---|---|---|---|---|
| **C1. Flip it** (tap, light, curtains, drawer, window, door, fan; on and off, open and closed) | 5 | 5 from L2 (the twins) | 4 | 4 | **keep: the core** |
| **C2. The right tool** (broom sweeps, cloth wipes; tap the tool, then the place) | 4 | 4 | 4 | 4 | **keep** (Zafar's broom) |
| **C3. Put it away** (the soap on the tray or the shelf; the toys in the box) | 3 | 4 | 2 | 4 | **keep, small**: Zafar named the soap and the toys. The move is pick it up's place piece |
| **C4. Tell Ali** (the shared "say it, Ali acts" moment) | 4 | 4 | 3 | 4 | **keep**, from L3 or visit 2 |
| **C5. Simba's mischief** (under the dim, two things change; Nani asks for one) | 4 | 4 | 4 | 4 | **keep, once a round from L3** |
| The whole house: room plus thing ("switch off the light in the bathroom") | 4 | 5 | 4 | 3 | **later visit** (§5): three words a move |
| Wash up the cup and the glass (kitchen) | 3 | 5 | 2 | 4 | **the kitchen room's C2** (the recorded line, to re-check) |
| Vacuum (the hoover chases Simba) | 5 | 3 | 4 | 2 | maybe later: loud, and one more tool with one job |
| Make the bed, the toy box sorting, the shoe rack | 3 | 3 | 2 | 3 | **not here**: placing boards go to pick it up (R9) |
| Fill the bucket, mop the spill | 3 | 2 | 2 | 3 | cut: one job per tool, so the scene picks the move |
| Clean everything (wipe until it sparkles) | 2 | 1 | 1 | 4 | **cut**: won by waiting and wiping it all (other games §5) |
| Flush the toilet | 3 | 3 | 2 | 4 | **cut**: the bathroom is drawn as basin, window and bath (§10, decision 12) |

---

### C1. Flip it (the core, every level)

**The why:** children love light switches, taps and doors (busy boards; Toca Town's switches). Each one is a toy with two states. Nani gives the toy a goal (lessons §12). With several things in mixed states, "turn off the tap" needs both the verb and the noun (other games §5).

**The things, bathroom (E camera, the room's back wall straight on):**
- the basin tap (running at the start, or off), and from L2 the **bath tap** (its twin);
- the wall light beside the mirror, and from L2 the **pendant ceiling light** (its twin; it hangs on a short cord, so on phones it sits in the upper band, not at the top edge);
- the window curtain, and from L2 the **shower curtain** (its twin);
- the drawer under the basin (L1's decoy; asked from L2; it stays single, so its noun decides it);
- from L3 the window (open, with a breeze in the curtain, or shut; askable only while its curtain is open) and the **mirror cabinet** *kabaat* ✓, whose door is the mirror (open and close it with a bare tap; wipe its smudge with the cloth lifted: one thing, two verbs).

**The five questions:**

| Question | The answer | Score |
|---|---|---|
| What do you do? | Nani asks; tap the thing; it flips state. One gesture: a tap. | 5 |
| Where's the challenge, and does the Kutchi decide? | **L1:** the noun decides (which thing), with the card's picture as support. **From L2,** each of the taps, the lights and the curtains comes as a pair in opposite states (one tap running, one off). The noun picks the pair, and only the verb (off or on, open or close) picks which of the two. Asks go both ways, so "tidy means off" never works. A pair is spent once asked (§3, the engine). | 5 |
| Where's the fun? | Each thing reacts like a toy (the delight list below). Switching off the light dims the room, and two eyes blink from the laundry basket: Zazu, hiding (a nod to hide and seek). | 5 |
| Where's the instruction? | Nani at the door on the right, then the card. The guide box says the step (a speaker). The card's speaker replays the ask for free; Nani's own repeat is the timed hint (the three helps, above). | 4 |
| What's novel? | The only game where the deciding word is a verb done to the house, and the only one whose things keep their state between asks. | 4 |

**The delight, thing by thing (right moves):**

| Thing | Off or closed | On or open |
|---|---|---|
| Tap | a squeak; the stream thins to drips; the last drip goes "plink"; the rubber duck in the basin stops bobbing | a gush; the duck spins and bobs |
| Light | a click; the light pool fades. If the window curtain is also closed and no light is on, the dusk beat (below) | a click; warm light blooms; Zazu squints and ducks down |
| Curtains | a swish; the sun stripe on the floor fades | a swish; the sun stripe falls across the floor; a sparrow on the sill hops |
| Drawer | a soft clunk; a sock caught in it wiggles and slips inside | it slides out; a rubber duck peeks over the edge |
| Window (L3) | the breeze stops; the curtain hangs still | a breeze; the curtain flutters; birdsong |
| Mirror cabinet *kabaat* (L3) | a click | it swings open: toothbrush cups and a comb inside |

**The misses (each different; the thing then flips back by itself):**
- the wrong tap gushes, and the duck surfs off the edge into the sink, then bobs back;
- the wrong light goes off, and a startled "mew" comes from the dark basket;
- the wrong curtain swishes, and the sun hits Simba asleep on the mat: he squints and rolls over;
- the drawer slams shut on a sock, and the sock waves;
- the window opens, and a gust puffs the towel on its rail up like a little ghost.

**Level ladder.** Levels make the Kutchi harder, never the gesture (always one tap). "Asks" counts the asks across all of the round's kinds (C1, C2, C3). "Targets" counts everything a tap can pick: state things, tools, dirt places, loose things and their homes. "Kinds" counts the askable kinds at the round's start (a pair is one kind).

| Level | Adds one thing | The asks | Targets (big screens / phone cap) | Kinds | Asks a round |
|---|---|---|---|---|---|
| **L1** | the core: one thing of each kind; the noun decides; asks only go one way (off, close, sweep); the order card shows its picture (Zafar: L1 only) | turn off the tap, switch off the light, close the curtains, sweep the floor | 6 / 6: the tap, the light, the curtain, the drawer (open, the one clearly different decoy), the broom, the floor spill | 4 (supported: the card's picture) | 3 (the first-ever round: 4, two of them showings) |
| **L2** | **the twins:** the taps, the lights and the curtains each a pair in opposite states; asks go both ways, so the verb decides; the drawer and the soap join; the picture goes, and the English is dotted | L1's, plus turn on, switch on, open; open or close the drawer; put the soap on the tray | 11 / 11: 2 taps, 2 lights, 2 curtains, the drawer, the soap (on the bath mat), the tray, the broom, the floor spill | 6 (taps, lights, curtains, drawer, soap, floor) | 4, at least 3 of them on a pair |
| **L3** | **other ways of saying it:** the reason first ("it's dark in here, switch on the light"; "Zazu wants to look out, open the curtains"; "the tap's running, turn it off"). The window, the mirror cabinet, the cloth, the shelf and the basin ring join. Simba's mischief (C5) | all the above, plus open and close the window and the cabinet; wipe the mirror, wipe the basin; the soap on the tray or the shelf | 17 / 16 (phones leave out the sill dust) | 10 (+1 when Simba resets a pair) | 5 |
| **L4** | **look-alikes, amounts and order:** "turn off the big tap" (the bath) against "the small tap" (the basin), with both taps running; "switch off all the lights"; "first close the curtains, then switch on the light" (two taps in the heard order, the same gesture); the shampoo joins as a second loose thing | all, with these | 18 / 16 (phones leave out the sill dust and the basin ring) | 11 (10 on phones) | 6 (one is first-then) |

**The leak test (C1):**
- **Reading:** the things carry no text. The card shows the Kutchi, and the English only at L1. *Fix:* in place. The game counts as teaching only once Mum's L1 lines exist; the leak bot runs on recorded words only.
- **Matching:** the card's picture shows at L1 only (Zafar). Nobody points: Nani never looks at or reaches for the answer, Zazu and Simba never go near it, and nothing glows on it. "Dirty" and "on" mark many things at once, never only the answer. *Fix:* in the data and the art.
- **Eliminating:** a pair is spent once asked (both now the same), so done kinds do drop out within a round; that's honest, and the numbers carry it: every level starts with at least asks + 2 askable kinds, so the last ask is never forced, and the odds below are worked with kinds dropping out. Re-asks in the same round come only from Simba (C5, L3+), who puts two spent pairs back into opposite states, after which either direction can be asked. L4's size words re-open a pair too ("turn off the big tap" leaves one running, one off). *Fix:* in the ask maker (data: `kindsMin = asks + 2`).
- **Patterns:**
  - **"Tidy means off and closed":** from L2 about half the asks are on or open, chosen at random, each with a reason at L3. Starting states are shuffled every round (Zafar: "states start mixed").
  - **"The odd one out":** the twins are always in opposite states, so each pair offers one of each.
  - **The order:** shuffled; the first ask is random; the kinds alternate but their order is random.
  - **The positions:** the room's things stay where they are (it's a room), but the asked thing changes every time.

  *Fix:* in the data.
- **Waiting:** nothing flips by itself; Simba's mischief happens only between asks and is asked by Nani before it counts. Waiting brings Nani's repeat (the guide's hint, which counts against the level), then the paid helper card. *Fix:* in place.
- **Fishing:** a fast tapper never idles into a hint and every miss undoes itself, so the rows always tick in the end. That's why **the level and the stars rest on first picks** (§3, the engine; decision 22): a fisher plays happily, but doesn't level up. *Fix:* in the engine and `data/rules.json`.

**The odds for a learned save with no Kutchi** (all first picks right, the Sceptic knows every rule, including spent pairs; the leak bot prints the real numbers):
- **L1 (supported):** the Sceptic learns the drawer is never asked and done things drop out: 1/4 × 1/3 × 1/2, about 4% a round. Allowed while supported.
- **L2:** the askable first targets are 9 (two for each of the three pairs, the drawer, the soap, the broom). A spent pair removes two, a single kind one. With at least 3 of 4 asks on pairs: about 1/9 × 1/7 × 1/5 × 1/4, **about 0.1% a round**; three level-up rounds in a row is far under 0.001%. A child who knows the nouns but not the verbs: (1/2)^3, about 12.5% a round, and three rounds in a row about 0.2%. So L2's level really rests on the verbs.
- **L3:** about 12 askable first targets at the start, 5 asks: under 0.01% a round. Simba's ask: a Sceptic who taps "a thing that just changed" is right 1 in 4 (C5).
- **L4:** smaller still.
- **Bot target:** under 10% of rounds at every level once past support.

**The delight moment:** the dusk. When no light is on and the window curtain is closed, the bathroom goes soft blue for a beat (about 2 s): Zazu's eyes shine in the basket and blink, and he pops his head out with a sleepy "mew". Then the room settles to a readable "soft" level (`dusk.settle` in the room's data, checked on film at 915x275, not on a still), so the asks still to come are played on a board you can see. At the round's end Nani switches the light back on herself with a warm bloom. (An "on" ask straight after the dusk isn't possible at L2: the lights pair is spent.)

**Speaking:** none in C1; see C4.

---

### C2. The right tool (sweep and wipe)

**The why:** Zafar's broom: sweep the dirt away and it vanishes. With one tool and one dirty place, the scene picks the move (other games §5). So the dirt is in several places at once from L3, and two tools can clean. The verb picks the tool and the noun picks the place.

**On screen:** the broom leans in the left corner (L1); the cloth is folded on a low stool by the bath (L3). Dirt is real art: a talc spill and footprints on the floor, a steamy smudge on the mirror cabinet's door, a ring of toothpaste in the basin, a dusty sill (big screens only).

**The five questions:**

| Question | The answer | Score |
|---|---|---|
| What do you do? | Tap the tool; it lifts and hovers by its own spot. Tap the place; the tool does the job there (a sweep, a wipe). Tap, then tap; never a free drag. The swipe rule is below. | 4 |
| Where's the challenge, and does the Kutchi decide? | **L1-L2:** the place is the floor (one dirt patch), and it's one ask among the round's others: the noun "floor" decides when. **From L3:** two tools and three dirty places (four on big screens). "Wipe the mirror": the verb picks the cloth, the noun picks the mirror. Dirt stays on the places not asked (no "clean everything"). | 4 |
| Where's the fun? | The swoosh, and the dirt vanishes into a puff of sparkles. The swept dust bunny sneezes as it goes. The wiped mirror squeaks and shows a clear reflection: Simba looks into it and pats his own face. | 4 |
| Where's the instruction? | As C1. The tool's showing comes inside the first "sweep the floor" ask, not as a separate showing (§4). | 4 |
| What's novel? | The only two-tap action in the game, and the only one where the verb picks a tool. | 3 |

**The swipe rule** (`easy-to-play.md`: a drag only along a track or for rubbing): the tool is **always tapped first**. A swipe counts only on a dirt place, and only while a tool is lifted (it's rubbing, so it's allowed). The lifted tool stays hovering by its own spot and never follows the finger, so it never reads as "drag me". A swipe anywhere else does nothing.

**The misses:** the broom on the mirror splays its bristles like a bad hairdo; the cloth on the floor skates away like a little rug, and Simba pounces on it. Then the tool hops back to its spot, and Nani asks again.

**Level ladder:** as C1's table. Sweep at L1 and L2 (the floor), wipe from L3 (the mirror, the basin; the sill on big screens), and at L4 "first sweep the floor, then wipe the mirror".

**The leak test (C2):**
- **Reading:** none on screen.
- **Matching:** dirt is on three places at once from L3 (four on big screens), never only on the answer. The card's picture is L1 only.
- **Eliminating:** places not asked stay dirty to the end, so "the last dirty place" never helps. The tools go back after each use. Each dirt place is its own kind, asked at most once.
- **Patterns:** the dirt's places and which tool is asked are shuffled each round.
- **Waiting:** as C1.
- **The odds at L3:** 1/2 (tool) × 1/3 (place).

---

### C3. Put it away (the soap; the toys in the play room)

**The why:** Zafar's "soap on the shelf or tray". Positions belong to pick it up; here it's a home verb (put away) with the place learned from context (his note on the settings map).

**What you do:** `do-it` asks it and ticks it; **the move itself is pick it up's place piece** (`pick-it-up-put-it-back.md`): tap the thing (the soap, dropped on the bath mat), and every home it could go to shows the same soft dotted ring; tap the home. The soap hops and lands. `do-it` owns state flips and the tool's two taps only; it doesn't get a second copy of placing.

| Level | What decides |
|---|---|
| L1 | not asked |
| L2 | "put the soap on the tray": only the tray is a home, so the noun "soap" decides when (one ask among the round's others) |
| L3 | the shelf joins: "put the soap on the shelf" against "on the tray". Both homes ring alike; the place noun decides |
| L4 | the soap or the shampoo bottle, on the tray or the shelf: two words a move (which thing, where) |

**Delight:** the soap lands on the tray, a bubble rises and pops. A miss: it skids off the shelf with a "bloop" into the basin, then hops back.

**Leak test:** as C2 (two homes from L3, identical rings, shuffled; two loose things at L4, so "the only loose thing" never helps).

**The play room's version (Ali's room):** the toys are the things. "Put the teddy in the box", "put the ball in the basket" (the place piece, two homes), with C1's toys alongside: push the toy car (it zooms off round the rug; Zafar's push, 1 Nov), switch off the toy car (it zooms in circles until you do), switch off the music box, open and close the toy box lid (the teddy peeks out when it opens). The toy box sorting board (Tidy's design) stays with pick it up: here a toy goes to one of two homes, never a board of cells.

---

### C4. Tell Ali (the speaking moment, from L3 or visit 2)

**The why:** the one shared "say it, Ali acts" moment (lessons §8), on the home verbs. Ali is the older cousin who stays at home (the cast doc gives no age; this design doesn't set one).

**How it plays** (`speaking.md`: a picture of the need, a heard frame, a closed set):
1. **Watch** (from the first round of L3): Ali comes to the bathroom door. Twice in the round, Nani asks Ali instead of the child: "Ali, switch off the light". Ali does it. The child sees the exchange modelled.
2. **The handover** (the third time, and every later round): Nani turns front-facing: "you tell Ali" (to record). **A thought bubble over Nani shows the need:** the goal state of one thing (the light off, the curtains closed or the tap off). The shared mic shows it's listening, and a pill row of three shows below it. Each pill is a thing's picture with a speaker: the light, the curtains, the tap.
3. **The child says it** (or taps a pill, always there). Ali does what was heard. If the recogniser hears a different one, Ali does that one, and it's funny ("oops, the tap!"), then Nani models the line again. Never a block, never a score.

**Before the handover, the ask maker checks the set:** each of the three sentences must have exactly one target in the room's current state (for example, exactly one light on). If one doesn't, it swaps in another valid "off or close" sentence from the recorded set, or skips the handover this round.

**Closed set:** switch off the light, close the curtains, turn off the tap. Each starts with a different verb (to check once recorded; with *bund* for both the light and the curtains, the nouns tell them apart).

**The five questions:** what you do: say it, or tap a pill (4); the Kutchi decides: the child must say the verb and the thing to match the bubble, but a pill tap is a picture match (4); the fun: Ali obeys you (4); the instruction: modelled by Nani and Ali first (4); novel: the shared moment, new verbs (3).

---

### C5. Simba's mischief (woven, once a round from L3)

Between two asks, the shared dim falls for a beat (about 1.5 s, like pick it up's Simba stage): in the dark, a patter, a bell, a soft clunk and a gush. The dim clears fully. Simba sits at Nani's feet in the doorway looking pleased, away from every target, and **two things have changed**: he has put two spent pairs back into opposite states (say, the bath tap is running again, and the window curtain is open again). Nani laughs: "Simba!" Then she asks for one of them, in either direction: "turn off the tap" and "turn on the tap" are both valid now. It's an ordinary ask, said and carded as usual.

- **Why:** a natural repeat ask, so a spent kind comes back and "that's done already" fails. It's also the "kind of funny" beat.
- **The leak, closed:** the child doesn't see which thing moved; they see two changed things after the dim. Simba touches only pairs, so the asked direction is random: tapping "a thing that just changed" is right 1 in 4 (which of two, times which way). He never touches the child's own last move, and never sits by the answer.
- **At L4:** as the dim lifts, Simba heads for a third thing and Nani tells him *ad na* ("don't touch"), and he sits down. Heard, not decided; **only once Mum has recorded it** (in engine today). Until then he just sits down when Nani laughs.
- **Never a verdict:** nothing the child did is spoiled. Simba only touches things that are tidy, and Nani is amused.
- **If Zafar wants re-asks at L2,** the honest route is Simba from L2 (one data line); I kept L2 clean for the twins (decision 13).

---

## 4. The first-ever round, screen by screen (the bathroom, L1)

The first choice comes about 10 s in; the dim clears fully after every showing.

1. **The house.** The doll's-house view from pick it up: two storeys (downstairs the kitchen and the sitting room; upstairs the bathroom, Ali's room and Nani's bedroom). Nani's voice: "what a mess! let's tidy the bathroom." Only the bathroom, upstairs on the left, is lit; the rest is dimmed. The camera glides up and in by itself (1 s; the first time, there's nothing to tap).
2. **The room, and quiet.** The bathroom, straight on. The basin tap is running, the duck bobbing. The wall light is on. The window curtain is open with a sun stripe on the floor. A talc spill and footprints are on the floor, with the broom in the corner. The drawer is open. Nani stands in the doorway on the right, three-quarter on. Zazu is curled in the laundry basket. Two seconds of quiet.
3. **Name the four.** Each L1 thing bounces once in a lit box as Nani names it: the tap, the light, the curtains, the floor (about 6 s). No tap is needed. The drawer isn't named yet.
4. **Show the flip once.** Nani: "turn off the tap." The card pops big beside the side panel (the picture of the tap off, the Kutchi when recorded, the English beneath at L1), then flies into its row. The light hugs **only the tap** this one time (the showing; it doesn't count for the level). The child taps: squeak, drips, plink, the duck stops. The row ticks. **The dim clears fully.**
5. **The first real ask.** Nani: "switch off the light." The card flies in; that is the one pointer to where to look next (the rulebook). No box and no dim: the whole room is the choice. The child taps.
   - **Right:** click, the light pool fades. The curtains are still open, so the room just softens.
   - **A miss on the drawer:** it slams on the sock, the sock waves, the drawer slides back open. Then, as the drawer was touched for the first time, Nani: "the drawer! switch off the light." The child redoes it.
6. **The tool, shown inside its first ask.** Nani: "sweep the floor." The card flies in. This first time only, the light hugs the broom: tap it, and it lifts and hovers by its spot. Now the light hugs the spill: tap it (or swipe on it), and swoosh, the dust bunny sneezes and vanishes in sparkles. Tick. **The dim clears fully.** Nani: *dhyan rakh* ✓ (careful) as she steps over the clean floor, smiling. (This ask doesn't count for the level: it was shown.)
7. **The fun moment.** Nani: "close the curtains." Swish: the sun stripe fades, and with the light off the room goes dusky blue for a beat. Two eyes shine in the basket, blink, and Zazu pops up with a sleepy "mew". Nani laughs. The room settles to its readable soft level. The row ticks.
8. **The end.** All four rows are ticked. *Shabash* ✓. Nani switches the light back on herself (shown, not asked), hangs a fresh towel, and Simba curls up on the clean bath mat: "aah". Then the shared two-page end screen (the four words, the card; page 1 shows progress, with a star for each first-pick ask, never a cross).
9. **Back out.** The camera glides back to the doll's house; the bathroom's window glows warm and tidy. It's evening now. Nani: "it's night, switch off the light" (heard). The child taps the house's light, it goes dark, and the evening book opens on "before and after" pages of the bathroom.

---

## 5. Later visits and harder versions

Each visit to the day at home cleans one room. A new room plays one round at L1 (its nouns get the L1 picture), then jumps to the child's level, since the verbs carry over (§10, decision 8).

| Visit | Room | New things and words | Its fun |
|---|---|---|---|
| **1** | **Bathroom** | tap, light, curtains, floor, drawer, soap, tray; later window, cabinet *kabaat* ✓, mirror, cloth, shelf | the plink, the dusk and Zazu's eyes |
| **2** | **Play room (Ali's room)** | toy box (open, close), toy car (push it: Zafar, 1 Nov; switch on, off) and music box (switch on, off), teddy, ball, blocks (put in the box or the basket, by the place piece), fan (switch on, off); sweep the sand spilled from the sand tray; play | the toy car zooming in circles until it's switched off; the music box tinkling; the fan blowing a paper windmill; Tell Ali from the start |
| **3** | **Bedroom (Nani's, hide and seek's room)** | lamp against the ceiling light (L4's look-alike), wardrobe door, window, curtains, fan, bed (the cover pulled straight: "make the bed" stays with pick it up); sleep, night | a night version: the lamp's warm pool, the moon through the curtains; Ali in his pyjamas comes to say goodnight and is told "switch off the lamp"; the round ends with Nani settling down |
| **4** | **Kitchen** (downstairs; after Cook's day; Zafar, 1 Nov: yes, the fourth visit) | cupboard *kabaat* ✓, taps (hot *garam* ✓ and cold, if Mum confirms *thundo* for a tap, at L4), the fan, the window; wash the cup and the glass (the recorded line, to re-check), wipe the table (*table*, the English word, inside lines), sweep the floor | the cups clink clean in the rack; steam from the hot tap |
| **5** | **The whole house** | room plus thing plus verb: "switch off the light in the bathroom", "close the curtains in the bedroom". Tap the room in the two-storey doll's house (the camera glides in), then the thing; how it fits 740x320 is in §7 | three words a move; the house going dark room by room at night |
| **Book** | | "what did we switch off?" (heard now; past tense at A2) | the before and after pages |

---

## 6. What it reuses and what is new

### Reused (nothing restyled per mode; non-negotiable 6)

| Piece | File or design | Used for |
|---|---|---|
| The page grid, the side panel, the play area | `js/shared/frame.js`, `fit.js`, `stage.js` | two layouts by height |
| The host (a pipeline of stages) | `js/shared/host.js` | the clean-up inside the day at home |
| The order card and its rows | `js/shared/order-card.js`, `word-card.js` | each ask pops big and flies into its row |
| The guide, the helper card, the bulb | `js/shared/guide.js`, `bulb.js` | the step, the timed repeat (the guide's hint), the helper card (paid) |
| The light and the dim | `js/shared/onboard.js`, `focus.js` | the showings and Simba's beat (no finger, as `do-it-engine.md` asks of the shared-layer owner) |
| The rules | `js/shared/rules.js`, `data/rules.json` | hint timings, level-up, the word ladder. This game has **no override of its own**: the card picture at L1 only, no "no" asks, the L1 round size and first-pick level-up are all in the one shared rulebook proposal (decision 35) |
| The voice and sounds | `js/shared/family-voice.js`, `sfx.js` | Nani's asks; the plink, squeak, swish, click, swoosh |
| The speaking moment | `js/shared/say.js`, `speech.js` | Tell Ali (C4), with its own mic and pill layout at every size |
| The end screen | `js/shared/results.js` | the two pages; first-pick stars as progress |
| **The `do-it` engine** | `do-it-engine.md` (`js/doit/engine.js`, data `data/doit/clean-up.json`) | actors (here, things), actions (here, states), triggers, the ask queue, the comic misses, the undo, the first-pick count for level-up |
| **The openable piece** | `hide-and-seek.md` (from Find it's designed openables) | the drawer, the cabinet, the wardrobe, the toy box lid |
| **The place piece** | `pick-it-up-put-it-back.md` (Tidy's place engine on the shared kit, `js/shared/rel.js`) | C3's put-away: the soap to the tray or the shelf; the toys to the box or the basket; identical dotted rings on every home |
| **The cat actor** | `hide-and-seek.md` | Zazu in the basket, Simba's mischief |
| **The doll's-house view** | `pick-it-up-put-it-back.md` (the two-storey house, Zafar 1 Nov: downstairs the kitchen and the sitting room, upstairs the bathroom, Ali's room and Nani's bedroom) | the zoom in and out |

### New

- **State things** in the `do-it` data: each thing lists its two states (sprites), its reaction both ways, its misses, and its twin (from L2).
- **The tool, two taps:** tap the tool, then the place; a swipe counts only on dirt with a tool lifted. Small.
- **The ask maker's check:** every ask has exactly one right target in the current states; a same-state pair is spent and unaskable until Simba or an L4 size word re-opens it; a round starts with at least asks + 2 askable kinds; it picks "the big one", "all" or "both" at L4 only; it checks Tell Ali's set before the handover. Small, and the leak bot depends on it. It lives in the engine, so it covers statues and getting ready too.
- **The phone cap** in `data/doit/clean-up.json`: `phoneCap: [6, 11, 16, 16]` targets by level, the three bands, and the drop order (§7).
- **The light layers:** the light pool, the sun stripe and the dusk are real art layers that fade in and out (code moves real art; it draws nothing). The dusk's settle level is a number in the room's data.
- **The leak bot** for the clean-up (a learned save, no Kutchi, first picks only; under 10% of rounds).
- **A lab page first:** the bathroom as placeholder boxes at all five sizes, proving the phone cap and the bands by script before one sprite is drawn (§7), then the L1-L2 art.

---

## 7. Art and layout

### Cameras (art bible §3: one per scene)

| Scene | Camera | In this camera |
|---|---|---|
| The doll's-house view | **E**, wide two-storey cross-section (shared with pick it up and hide and seek; 2 rooms down, 3 up) | the rooms; window glows |
| Each room | **E**, eye level, straight on to the room's main wall; horizon about 55%; the floor a strip at the bottom (it must show the dirt) | the things in both states, Nani in the doorway, the cats, Ali at the door |
| The order card's pictures (L1) | crops of the room's own art (the tap off, the curtains closed) | no new drawing |

### Art list, by run (the bathroom's L1-L2 set first)

**Run 1: the bathroom, L1-L2 (about 16 sprites, 2 layers, about 28 frames), plus the people it needs:**
- the bathroom background, drawn empty of the things that change state, with a plain mirror on the wall (the cabinet comes at L3);
- basin tap (off; running, 3 water frames) and bath tap (the same): 8;
- wall light (off, on) and pendant ceiling light (off, on), plus the light-pool layer: 5;
- window curtain (open, closed) and shower curtain (open, closed), plus the sun-stripe layer: 5;
- drawer (open with a sock, closed): 2;
- the floor spill and the sparkle puff: 2;
- broom, soap, soap tray, the rubber duck: 4;
- the laundry basket (plain; with Zazu's eyes shining): 2;
- the dusk: a layer, not new sprites (the lighting change is checked on film);
- Nani: three-quarter in the doorway and laughing (from her locked sheet); Simba: squint and roll (the curtain miss), curled on the mat (the end); Zazu: eyes, head up.

**Run 2: the bathroom, L3-L4 (about 10 frames), plus the people:**
- window (open, shut); mirror cabinet (shut, open, shut with its smudge): 5;
- basin ring, sill dust: 2; cloth (on its stool), shelf, shampoo: 3;
- Nani front-facing for the handover; Ali at the door (standing, doing it, oops); Simba trotting in, sitting pleased.

**Later runs, one per visit:** the play room (Ali's room), Nani's bedroom (day and night), the kitchen (the Cook kitchen's look, after cooking), each with its things. The play room: the toy box (open, shut), toy car (still; three zoom frames, for film; the push and the zoom off), music box (shut; open with a carved bird, no religious marker), teddy, ball, blocks, basket, fan (still; turning frames for film), paper windmill.

**Rules:**
- no text, letters or numbers anywhere: no labels on the shampoo, no brand on the soap;
- the bathroom is drawn as a basin, a window and a bath filling the back wall, with no space for anything else (§10, 12);
- one cultural nod per room at most: an indigo ajrakh curtain in the bathroom, a brass lamp in the bedroom;
- reds belong to Nani: no big red curtains behind her;
- everything on a surface has a contact shadow; nothing floats;
- motion (water, the spinning car, the fan) is frames in the game and film in review, never marks in a still: no swoosh lines, motion puffs or blur;
- the people and the cats follow the cast doc and the art bible: Nani from her locked sheet (`sources/art/s08/sheet-nani-final-1.png`, `lineup-v4-1.png`: plain cream kameez with a few bold red motifs, a plain red dupatta over her head, thin round gold glasses, no rings); Simba a big, solid charcoal-black Russian Blue with pale mint-green eyes and a dark collar with a small silver bell; Zazu a silver-grey Russian Blue drawn as a kitten, big ears, yellow-green eyes, a plain thin collar; Ali tall and lanky, tousled black hair, an orange T-shirt with a pocket.

### Layout (two layouts, switched by height; checked at 740x320, 915x275, 930x430, 1280x665 and 1920x1080)

The phone layout is used when the screen's short side is under 500 px (`data/layout.json`), so 930x430 is a phone, as in hide and seek.

**Phones (740x320, 915x275, 930x430): the count.**
- **Left:** the side panel with the ask rows, about 22% of the width (about 163 px at 740, 201 at 915).
- **Right:** Nani as a bust cut at the waist, about 110 px wide, her face never covered. Ali slides in over the doorway only for C4.
- **Middle:** the room, cropped to its things: about 467 px wide at 740x320 and 604 at 915x275. The ceiling goes; the pendant light hangs on its cord into the upper band.
- **Three bands of tap boxes, top to bottom,** each box at least 64 px at 320 and 56 px at 275, at least 12 px apart, **at most 6 boxes a band** (6 × 64 + 5 × 12 = 444 px, inside 467):
  - **the upper band (6):** the pendant light, the wall light, the mirror cabinet (L3), the window (L3), the window curtain, the shower curtain;
  - **the lower band (6):** the basin tap, the basin ring (L3), the drawer, the tray, the shelf (L3), the bath tap; at L4 the shampoo takes the basin ring's place;
  - **the floor strip (4):** the broom (in the left corner), the floor spill, the soap on the bath mat, the cloth on its stool (L3).
- **Height at 915x275:** 8 margin + 44 wall strip for bubbles + 56 + 12 + 56 + 12 + 56 + 8 = 252 px of 275. At 740x320: 8 + 48 + 64 + 12 + 64 + 12 + 64 + 8 = 280 of 320.
- **Bubbles on phones:** in the wall strip at the top of the play area, running to Nani's face at the right; never over the panel, a tap box or a face. Nani keeps her bubble at her face; she never moves to the guide box.
- **The cap in data:** `phoneCap: [6, 11, 16, 16]` (L1 to L4). Over the cap, things leave in this order: the sill dust (never on phones), the basin ring, then the shelf (the soap's second home becomes the cabinet: "put the soap in the cupboard"). The cats and Nani are never targets.
- **The lab page's job:** placeholder boxes at all five sizes, by script, proving every number above (the bands, 6 a band, the wall strip, Nani's face clear, no clipped text in the ask rows) **before one sprite is drawn**. If 6 a band doesn't fit at 740x320, the cap drops by one a band (a data change) and the drop order applies.
- The cog is the only button. Nothing is clipped or ellipsised.

**The doll's house at 740x320** (the glide in and out of every round, the day's last beat, and visit 5's room tap; Zafar, 1 Nov). The play area is about 577x320 beside the side panel. The house fills it as a cross-section: a 10 px roof line, two storeys of about 145 px each and a 20 px ground strip. Upstairs, three rooms of about 192 px wide (the bathroom, Ali's room, Nani's bedroom); downstairs, two of about 288 px (the kitchen, the sitting room). Nani's bust stands at the bottom right over the sitting room's outer corner, so its tap box is the part she leaves clear (about 180x145). Each room is one tap box, far above the 64 px minimum; its things are never tapped on the overview: a tap on a room glides the camera in, and the room fills the play area with the bands above. The day's last beat taps the house's light (any room). At 915x275 the storeys are about 122 px; at 930x430 about 195 px. Big screens show the whole house with the garden and sky.

**Big screens (1280x665 and 1920x1080):**
- The side panel is on the left: the guide box and the ask rows.
- The room fills the play area. Its things sit in the same three bands, from the bottom to about two-thirds up, each at least 96 px; the sill dust joins.
- Nani stands in the doorway on the far right, cut at the knee by the frame. Ali appears in the same doorway beside her.
- Bubbles go into the free wall space above the upper band, never over a face or the side panel.

---

## 8. What it borrows from other games

- **Busy boards** (the real toddler toy of switches, latches and doors): the toy is the switch itself. We add a voice that asks for the one switch.
- **Toca Town and Toca Life** (other games §5, read): switching lights on and off is a favourite toy. We keep that, and add the twin, so the verb decides.
- **Toca House** (read): chores with a happy flourish at the end. We take the flourish (Simba on the clean mat), and leave out the grumbling characters and the repeated sweeping (Common Sense's complaints).
- **Toca Tea Party** (read): the mop-up is the favourite bit. That's our sweep's sparkle.
- **Pepi Bath** (summary): soap and bubbles at the sink. That's our soap's bubble and the duck.
- **My PlayHome** (from the other games report's lessons): a doll's house that's a sandbox without a goal. Nani's asks are the goal.
- **"Goodnight Moon"** (the picture book): the room settling for the night, one thing at a time. That's our day's last beat and the bedroom visit.
- **Total Physical Response and the embodiment trials** (mechanics finding 2; Mavilidi 2015): verbs are learned by making something act. Here the child makes the house act.

---

## 9. The lessons checklist

| Group | Verdict | How, or the exception |
|---|---|---|
| **1. The heard word decides** | Pass, once recorded | The leak test is written per mini-game, and the bot target is under 10% (first picks). The deciding words: 4 at L1, about 13 in the bathroom by L4, **none recorded today** (except *kabaat* ✓). Ticks only on the right pick; **the level and the stars rest on first picks** (decision 22), so fishing doesn't climb. The open need the picture can't settle: the twins (one on, one off) and dirt in several places. Spent pairs are honest and the kinds are counted (asks + 2). From L2, two words a move (verb plus thing). It teaches its own words, not numbers. |
| **2. Onboarding and the first round** | Pass | The first round is the tutorial (§4). One live thing in a lit box at each showing, with no finger. The four L1 things are named at the start; the drawer when first touched. The flip is shown once; the tool inside its first ask. The dim clears fully after each showing, and the real asks run with no box. Tap, then tap; 6 targets at L1; the first tap about 10 s in. |
| **3. Instructions** | Pass | Nani is on screen and speaks before each card. The card is what's wanted and never changes; the guide says the step. The helper card holds the full answer. Listening again is free (the card's speaker); Nani's repeat is the timed hint; nothing is said during a reaction. One line per moment. Model, then ask: Nani and Ali play C4's exchange first. |
| **4. Pacing and waiting** | Pass | No Next and no Done. A tap skips speech, and a tap during a reaction is taken. The hint at 7, 9, 11 and 13 s from the last action, then the helper card. Reactions finish (or jump to their end) before the next ask. Nothing leaves. No timer. |
| **5. Feedback and the end** | Pass | A miss gets its own funny reaction, flips back, and is redone on the spot. Rows tick when the step closes. It ends the moment the asks are done, with "aah" (Simba on the clean mat), back out at the doll's house. The shared end screen, with first-pick stars as progress. |
| **6. Layout** | Pass, to prove on the lab page | Two layouts by height; the five sizes in §7. Counted: three bands, at most 6 boxes a band, the phone cap per level in data, a wall strip for bubbles, the drop order. Nothing over a face. The left is for the cards; Nani is on the right. The cog is the only button. |
| **7. Art and camera** | Pass | One camera per room (E). Nothing drawn in code; the light, the water and the dusk are real art frames and layers. Contact shadows. Calm faces. The people and cats from the cast doc. Art in runs, the bathroom's L1-L2 set first; prompts fixed (§11). |
| **8. Speaking** | Pass | Only Tell Ali, inside an exchange watched in the same round, with a picture of the need (the bubble). A closed set of 3, checked valid before the handover, pills always there, never a gate. Reuses the one shared moment. |
| **9. Levels** | Pass, no override of its own | L1 the core and one decoy; L2 the twins (its own level, not just more); L3 other ways of saying it; L4 look-alikes, amounts and order. The card picture at L1 only, no "no" asks, the round sizes and first-pick level-up are one shared rulebook proposal (decision 35), not this game's overrides. The rules are coded (the ask maker's check). |
| **10. Words and recording** | Exception: blocked on Mum | The sheet is counted and ordered: 15 new clips for L1, 14 for L2, about 16 for L3-L4 (§1), with the verbs alone and the frame pieces. *Thundo* waits for Mum for a tap; the wash line is to re-check; *ad na* isn't used until recorded. One natural sentence per ask. 3-5 new words a round. |
| **11. Culture** | Pass | No religious markers; the music box's figure is a carved bird. Modest clothes. No sweets: the reward is the cosy room and Simba's "aah". Nothing unsafe to copy: no plugs or sockets are touched (the switches are on the wall, and the child taps the light, not a socket), and no cleaning sprays. |
| **12. Fun and delight** | Pass | The hands flip something at every step. "Kind of funny": Zazu's eyes, the waving sock, the splayed broom, Simba's mischief. The gestures feel good: the click, the swish, the swoosh. Contrast: light and dusk, the big tap and the small. No two asks in a row use the same kind of action. Carries into the evening book. |
| **13. Mistakes made twice** | Watched | The ask maker's rules (exactly one answer, spent pairs, kinds) and the first-pick level-up live in the shared engine and the rules, so they cover statues and getting ready too. The light's fade, the dusk and the water are judged on film, not stills. Every level and all sizes go to the judge. The house is one house across both designs (decision 25). No question is left for the builder (§10). |

**The ten questions, short:**
1. The verb and the thing decide; 0 of 4 L1 asks are recorded.
2. The Sceptic taps whatever is "on" or "open": fails because asks go both ways from L2. She eliminates spent kinds: it helps a little, but every round starts with asks + 2 kinds, so the odds stay about 0.1% at L2. She fishes: the rows tick, but the level and the stars need first picks. She taps what Simba changed: 1 in 4. She waits: the hint comes, and it counts against the level.
3. The open need: two taps, one on and one off. Which one does Nani mean?
4. The first round lights: the four things once (naming), the tap alone (the flip's showing), the broom then the spill (inside the first sweep), then no box at all for the real asks.
5. Nani, in the doorway, in a recorded sentence per ask.
6. The hands tap a thing at every step.
7. Zazu's shining eyes in the dusk.
8. It ends with Simba curled on the clean mat, "aah", then the house's window glowing.
9. L1 the noun, L2 the verb (the twins), L3 the reasons, L4 the big one, all, and first-then. L4 is its own.
10. Yes, five sizes counted and proved on the lab page, one E camera per room.

---

## 10. Decisions made for Zafar overnight

Each line gives the choice, the reason, and the answer I assumed. Reverse any by number.

1. **The clean-up runs on the shared `do-it` engine,** with things as actors and states as actions. *Why:* his "a new do it to the thing engine, shared with musical statues and getting ready". *Assumed:* yes.
2. **The gesture is one tap to flip a thing; a tool is tap the tool, then the place.** A swipe counts only on dirt, with a tool already lifted by a tap, and the tool never follows the finger. *Why:* tap, then tap (lessons §2); the swipe is rubbing, which `easy-to-play.md` allows; a hovering tool must not read as "drag me". *Assumed:* yes.
3. **From L2, the taps, the lights and the curtains each come as a pair in opposite states;** the drawer stays single. *Why:* with one of each, a tap flips it whatever the verb, so the verb would decide nothing (mechanics: "fails if each thing can only do one action"). The twin makes "off" against "on" the move. The single drawer is one noun-decided kind among the round's asks. *Assumed:* yes.
4. **If Mum uses one word for several verbs** (say, one "close" for the tap, the light and the curtains), the design keeps working: the noun decides the thing, and on or off still decides which twin. *Why:* never invent Kutchi; design for whatever she says. *Assumed:* yes.
5. **Asks go both ways from L2** (on and off, open and close), often with a reason at L3 ("it's dark in here"). *Why:* "tidy means off" would be a pattern win. *Assumed:* yes.
6. **No "clean everything".** Dirt stays on the places not asked, and the round ends when Nani's asks are done. *Why:* his note and the research's leak. *Assumed:* yes.
7. **One room a round; the bathroom first,** then the play room (Ali's room), Nani's bedroom and the kitchen on later visits; the whole house at visit 5. *Why:* his "zoom into a room (the bathroom first)" and his room list. **Zafar, 1 Nov: yes, with the kitchen as the fourth visit.**
8. **A new room opens at L1 for one round,** then jumps to the child's level. *Why:* his "picture at L1 only" would otherwise leave a new room's nouns without any support. *Assumed:* yes.
9. **The order card's picture shows at L1 only.** *Why:* his note. Now part of the one rulebook proposal (decision 35), not this game's override. *Assumed:* yes.
10. **The soap and the toys use put-away with two homes** (the tray or the shelf; the box or the basket), done by pick it up's place piece, never a sorting board and never a second copy inside `do-it`. *Why:* he named the soap and the toys; placing belongs to pick it up (R9). *Assumed:* yes.
11. **The dusk is a beat, then a readable soft level.** When no light is on and the window curtain is closed, the room goes dusky for about 2 s (Zazu's eyes), then settles to a level set in data and checked on film; a light alone off only softens the room. *Why:* the dusk is the reveal, but the asks still to come must be played on a board you can see (dark boards failed before, CHAI-50). *Assumed:* yes.
12. **The bathroom is drawn as a basin, a window and a bath filling the back wall;** there's no toilet. *Why:* a child would tap it, flush jokes aren't the family's tone, and it adds nothing. The prompts describe what fills the wall instead of saying "no toilet". *Assumed:* yes.
13. **Simba's mischief, once a round from L3, under the dim:** two spent pairs change, and Nani asks for one, either way. *Why:* a natural repeat ask that beats eliminating and the funny beat, without showing the answer (a "tap what moved" guess is 1 in 4). It never touches the child's own last move. Simba from L2 is one data line if you want re-asks there. *Assumed:* yes, from L3.
14. **Tell Ali is the speaking moment** (from L3 or visit 2), the closed set "switch off the light, close the curtains, turn off the tap", with a thought bubble showing the need and the set checked valid first. *Why:* reuse the one shared moment (lessons §8); `speaking.md` asks for a picture of the need; Ali is the one who stays home. *Assumed:* yes.
15. **No "no" asks.** *Why:* "don't switch off the light" is a trick in the Simon says family (mechanics: low for language, and being caught is a verdict). Simba's *ad na* is heard, never decided, and only once recorded. Now part of the rulebook proposal (decision 35). *Assumed:* yes.
16. **Round sizes 3, 4, 5, 6 asks.** *Why:* a round of one is too short to play the toy; the first-ever round has 4 (two showings). Part of the rulebook proposal (decision 35). *Assumed:* yes.
17. **The day's last beat is the heard "it's night, switch off the light"**, tapped on the doll's house, which opens the evening book. It's never scored, and it's the one allowed `do-it` tap after a `do-it` game. *Why:* the day ends on this game's verb; unscored, so "the last ask is always the light" can't be learned. *Assumed:* yes.
18. **The light, the water and the dusk are real art frames and layers;** code only fades and swaps them. *Why:* lessons §7 ("draw nothing in code"). *Assumed:* yes.
19. **Push lives on a toy car in Ali's room** (Zafar, 1 Nov: yes): "push the toy car" sends it zooming round the rug. "Push the drawer shut" only if Mum's word for closing a drawer is a push.
20. **The game counts as teaching only once Mum's L1 lines are recorded** (15 new clips; §1). The leak bot runs on recorded words only. *Why:* grey English is a reader's win. **Voices (Zafar, 1 Nov):** for the prototype, the Kutchi takes that exist play, and the device voice says the rest. Who voices what, the recording sessions and the casting are settled before shipping, once the words are locked; nothing in this design waits on a voice.
21. **A lab page of the bathroom comes before any art:** placeholder boxes at the five sizes, by script, proving the bands and the phone cap. *Why:* about 16 targets must read at 275 px. *Assumed:* yes.
22. **Level-up rests on first picks:** up after 3 finished rounds in a row where every ask was right first pick (Zafar, 1 Nov: level up only on right-first-time rounds, in every game) and the guide's hint came at most once; showings don't count. The rows still always tick; the end screen shows first-pick stars as progress, never a verdict. In the engine and `data/rules.json` (decision 35), not this game alone. *Why:* without it a fast tapper never idles into a hint, every miss undoes itself, and they climb to L4 knowing no verb. *Assumed:* yes.
23. **A pair is spent once asked;** the ask maker treats it as unaskable until Simba or an L4 size word re-opens it, and every level starts with at least asks + 2 askable kinds (L2: 6 for 4; L3: 10 for 5; L4: 11 for 6, 10 on phones). *Why:* the exactly-one rule makes this true anyway; writing it down stops a builder choosing, and the odds are worked with it (about 0.1% a round at L2). *Assumed:* yes.
24. **The mirror cabinet's door is the mirror:** a bare tap opens or closes it; with the cloth lifted, a tap wipes its smudge. *Why:* one thing, two verbs (the research's fix for "one action per thing"), and one tap box fewer on phones. *Assumed:* yes.
25. **One house for the three home games, drawn as a two-storey doll's house (Zafar, 1 Nov):** a cross-section, not rooms in a row. Downstairs: the kitchen and the sitting room (with the front door; the shoe rack stands by it). Upstairs: the bathroom, Nani's bedroom and Ali's room (the play room). The 740x320 fit is in §7.
26. **The phone cap is data:** `phoneCap: [6, 11, 16, 16]`, three bands of at most 6 boxes, and a drop order (the sill dust, the basin ring, then the shelf, whose job the cabinet takes). *Why:* the count must hold at 740x320 and 915x275, and a data cap is easy to change after the lab. *Assumed:* yes.
27. **On phones, bubbles go in a 44-48 px wall strip at the top of the play area,** running to Nani's face; she keeps her own bubble. *Why:* "bubbles belong to faces", and a reserved strip is the only free wall the count leaves. *Assumed:* yes.
28. **The soap waits on the bath mat** (the floor strip), not in the bath. *Why:* it keeps the lower band to 6 boxes on phones and is easy to tap. *Assumed:* yes.
29. **Taps during a reaction are taken,** jumping the reaction to its end. *Why:* never make them wait (non-negotiable 7). *Assumed:* yes.
30. **One helps rule:** the card's speaker replays for free; Nani's repeat at 7/9/11/13 s is the guide's hint (counts); the helper card on the next rung costs the bulb. *Why:* three timing rules for one moment were a mistake made twice. *Assumed:* yes.
31. **The first-ever round:** name only the four L1 things; show the flip once; show the tool inside the first "sweep the floor"; clear the dim fully after each showing; no box for the real asks. *Why:* the first choice comes about 10 s in, not 30 s, and a box round everything is no box. *Assumed:* yes.
32. **The first art run is the bathroom's L1-L2 set** (about 28 frames plus the poses it needs); L3-L4 and the other rooms follow as their own runs. *Why:* the honest count is about 38 frames for the bathroom alone; the first visit needs only L1-L2 to play. *Assumed:* yes.
33. **Tell Ali scores 4 for "Kutchi decides", not 5,** since a pill tap is a picture match. *Why:* honest scoring. *Assumed:* yes.
34. **Ali's age isn't set here.** The cast doc gives none ("tall and lanky"); this design and its prompts say no age. Fix it once in `cast.md` when Zafar picks one (the critique notes `do-it-engine.md` says 8). *Assumed:* no age until he says.
35. **One rulebook proposal instead of per-game overrides** (shared with hide and seek, the do-it engine and pick it up): (a) the card's picture at L1 only, everywhere; (b) "no" asks optional per game (`levels.noAsks` per game); (c) the L1 round size set per game; (d) level-up needs first picks (`advance.maxNotFirstPick: 0`, every game; hide and seek's first-open rule is the same). **Zafar settled (d) on 1 Nov: level up only on right-first-time rounds, in every game.** Each design cites this instead of overriding. Not added to the rulebook or `data/rules.json` tonight. *Why:* an everywhere rule fixed in one game only is the first mistake made twice. *Assumed:* yes, to put to you as one change.

**Open questions (genuinely his, or Mum's):**
1. **For Mum:** how does she say turn off and on (a tap), switch off and on (a light), open, close, sweep and wipe? Does one word cover several? Does she use *firai* ✓ for a tap, *bar* ✓ for a lamp, or *thundo* ✓ for a cold tap? Zafar's words to confirm with her: *bund* (close, and "close the light"), *batti* (light), *fugya* (sweep), *fugyu* (broom).
2. **Ali's age** (decision 34), once, in the cast doc.

(Answered 1 Nov and removed: push lives on a toy car in Ali's room; the kitchen stays as visit 4; the house is the two-storey doll's house.)

---

## 11. ChatGPT mock-up prompts

Every prompt now draws Nani from her locked sheet (glasses, a plain red dupatta over her head, no rings), the cats from the cast doc (Simba a big charcoal-black cat, Zazu a silver-grey kitten), no motion marks, no glow on any answer, and a 2.3:1 frame. Each prompt shows one room close up, so the two-storey house (Zafar, 1 Nov) doesn't change their scene text.

**Clothes (Zafar, 1 Nov; as on the prompt sheet):** before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt below describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

### Prompt clean-up-day-1: the bathroom, level 1 (the tap just turned off)

What it should show: the bathroom a moment after the child tapped the running tap. It shows the room's L1 things in mixed states, how big they are, and the toy-like reaction.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The scene: a small, modern, sunny family bathroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about 55% of the frame, one-point perspective, verticals vertical. Limewash cream walls, a strip of pale floor tiles along the bottom. The back wall is filled from side to side by three things standing close together, with no gaps between them: on the left, a white basin on a pale oak vanity unit with one drawer, the drawer pulled open with a striped sock hanging over its edge, a plain mirror above the basin, and a small warm wall light beside the mirror, switched on, casting a soft pool of light on the wall; in the middle, a small window with an indigo block-print (ajrakh-style) curtain, drawn open, so a stripe of warm sunlight falls across the floor; on the right, a bath running along the wall with a plain cream shower curtain drawn open. A broom leans in the left corner. A woven laundry basket stands in the right corner, with a small silver-grey kitten with big ears curled asleep inside. On the floor, a scattered spill of white talc with small footprints.

The moment, a second after the basin tap was turned off: the water has stopped; a single last drop hangs from the spout above the basin, and a small yellow rubber duck sits still in the basin with a few faint ripples around it. No highlight or glow on the tap or on anything else.

On the far right, standing in the open bathroom doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. Three-quarter view, smiling warmly, one hand raised as if she has just asked for something.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, soft global illumination, chunky simplified shapes, believable materials (white ceramic, brushed steel, pale oak, woven cane, cotton), clean surfaces, soft contact shadows under everything that rests on a surface, no outlines, no cel shading, no photorealism, no blur, no motion lines.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere: not on the bottles, the soap, the light switch or the tiles.

Must read at phone size (the image will be shown about 275-320 pixels tall): the tap, the wall light, the curtain, the drawer, the talc spill and the broom must each be big, clear and separate, at least the size of a thumb, with calm empty wall around them. Nothing important overlaps the grandmother's face.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp (how props are rendered)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png (the house)
```

### Prompt clean-up-day-2: the bathroom at level 2 (the twins and the dusk beat)

What it should show: the same bathroom with the taps, the lights and the curtains in pairs, at the dusk beat: the wall light has just gone off, so no light is on and the window curtain is closed; the kitten's eyes shine. It explains why the verb decides (two taps, one on and one off; two curtains, one open and one closed), and the reveal.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The same small modern family bathroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about 55%, one-point perspective, verticals vertical, a strip of floor tiles along the bottom. The back wall is filled from side to side by the basin (left), the window (middle) and the bath (right), standing close together.

The things come in pairs:
- two taps: the basin tap is off and dry; the bath tap on the right is running in a clear, smooth stream into the bath;
- two lights: the small wall light beside the mirror is off, its bulb dark, and a round pendant ceiling light hanging on a short cord near the top of the frame is also off;
- two curtains: the indigo block-print window curtain is drawn closed; the plain cream shower curtain is drawn open;
- one drawer under the basin, shut; a bar of soap lying on the bath mat, and an empty soap tray on the edge of the basin; a broom leaning in the left corner.

The moment: with no light on and the window curtain closed, the room has gone a soft dusky blue, with a little cool light around the edges of the curtain; everything is still clearly visible. In the woven laundry basket in the right corner, two round yellow-green eyes shine in the dusk, and a small silver-grey kitten with big ears is just lifting his head with a sleepy, surprised look. A big, solid charcoal-black cat with pale mint-green eyes and a dark collar with a small silver bell lies curled asleep at the grandmother's feet in the doorway.

On the far right, standing in the open doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. Three-quarter view, a hand to her mouth, laughing gently.

Style: match the attached references: a stylised 3D animated-feature look, a calm dusk with a cool blue fill and soft global illumination, chunky simplified shapes, believable materials, soft contact shadows, no outlines, no photorealism, no blur, no lens effects, no motion lines.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere.

Must read at phone size (the image will be shown about 275-320 pixels tall): each tap, each light, each curtain, the drawer, the soap and the tray must be big and separate, and on or off must be obvious at a glance (water or no water, curtain drawn or open). The kitten's eyes must read clearly even though the room is dim.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp (how props are rendered)
```

### Prompt clean-up-day-3: the play room, Ali's room (the toy car just switched off)

What it should show: Ali's room, which is the play room, on the second visit, a moment after the child switched off the toy car, with the other toys in clear states. It shows how the toys become things with states, and the room's look.

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The scene: a boy's bedroom that is also the play room, in a grandmother's modern bungalow, seen straight on at eye level like a stage set, horizon at about 55%, one-point perspective, verticals vertical. Limewash cream walls; a soft rug on a pale wooden floor along the bottom; a small bed with a plain cover along the left wall.

Things in the room, each one a separate, chunky, toy-like object with plenty of space around it:
- a big wooden toy box with its lid propped open and a soft brown teddy bear peeking over the edge;
- a woven basket beside it, empty;
- in the middle of the rug, a red toy car, standing still, its little headlights off;
- a blue ball and three plain wooden building blocks loose on the rug;
- on a low shelf on the right, a small wooden music box with its lid open and a little carved wooden bird standing on top;
- a ceiling fan near the top edge, still, and a paper windmill on the shelf, still;
- a window with a sage-green curtain drawn open.

A big, solid charcoal-black cat with pale mint-green eyes and a dark collar with a small silver bell crouches on the rug beside the blue ball, about to pat it, tail up.

On the far right, standing in the open doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings; three-quarter view, smiling. Beside her in the doorway, a tall, lanky boy with tousled black hair, in an orange T-shirt with a pocket and long trousers, leaning in to watch.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, soft global illumination, chunky simplified shapes, believable materials (painted wood, felt, woven cane, cotton, paper), soft contact shadows, no outlines, no photorealism, no blur, no motion lines or puffs.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere: the blocks are plain coloured wood with no letters, and nothing has a brand.

Must read at phone size (the image will be shown about 275-320 pixels tall): the toy box, the car, the ball, the blocks, the music box and the fan must each be big, clear and separate on calm floor and wall space. Nothing overlaps a face.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png (the house)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png (the style)
```

### Prompt clean-up-day-4: Nani's bedroom at night (Tell Ali, the lamp and the ceiling light)

What it should show: Nani's bedroom on the third visit at L4, the speaking moment: the child has just told Ali to switch off the lamp, and he has done it, with the ceiling light as the look-alike still on. It shows the night version and how speaking looks (no mic, bubble or pills drawn; those are the game's own pieces).

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The scene: a grandmother's bedroom in her modern bungalow, at night, seen straight on at eye level like a stage set, horizon at about 55%, one-point perspective, verticals vertical. Limewash cream walls, a pale oak floor with a soft rug along the bottom. Left to right: a tall pale-oak wardrobe with both doors shut; a window with a soft indigo block-printed curtain drawn open, showing a big pale moon and a few stars in a deep blue sky; a single bed seen side-on with a plain cream cover and an indigo block-print cushion; a bedside table with a small brass table lamp. Near the top edge, a round pendant ceiling light on a short cord, switched on and glowing warm, and a ceiling fan, still.

The moment: the small brass lamp has just been switched off, its bulb dark; the ceiling light is still on. A tall, lanky boy with tousled black hair, in plain long-sleeved pyjamas, stands by the bedside table with his hand just lifted from the lamp, looking back over his shoulder with a proud grin, as if someone has just told him what to do. A small silver-grey kitten with big ears and yellow-green eyes is curled on the end of the bed, eyes half closed.

On the far right, standing in the open doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. Now facing the viewer, smiling encouragingly, one hand open towards the viewer as if handing over a turn.

Style: match the attached references: a stylised 3D animated-feature look, night lighting with a warm pool from the ceiling light and a cool blue fill from the window, soft global illumination, chunky simplified shapes, believable materials (brass, pale oak, cotton), soft contact shadows, no outlines, no photorealism, no blur, no lens flare, no motion lines.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere.

Must read at phone size (the image will be shown about 275-320 pixels tall): the small lamp and the ceiling light must both be big and clearly different from each other, and on or off must be obvious at a glance; the boy, the lamp, the window, the wardrobe and the fan must each be clear and separate. Nothing overlaps a face.

Wide landscape frame, about 2.3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png (the house)
```

---

## 12. Changes after the critique

The critique (`clean-up-day-critique.md`, 1 Nov) had 6 MUSTs and 10 SHOULDs (findings 7-16). All were applied. Where it clashed with Zafar's recorded word, he won: the house stays at five rooms ("4-5 at most"), the picture stays at L1 only, and Nani's dupatta follows the art bible's locked look (a plain red dupatta over her head) rather than the critique's "wrapped headscarf".

| # | Finding | What I did |
|---|---|---|
| 1 | **MUST.** Fishing levels up: misses undo for free, rows tick eventually, level-up counts only the hint. | Level-up now rests on first picks: 3 rounds in a row with every ask (or all but one) right first pick and at most one hint; showings don't count; rows still tick; the end screen shows first-pick stars as progress. Put in the engine and proposed for `data/rules.json` as `advance.maxNotFirstPick: 1` for every game (fallback: `advance.engines["do-it"]`), not added tonight. §3 engine and leak table ("Fishing" row), §4 step 8, §6, §9 rows 1 and 9, decisions 22 and 35. |
| 2 | **MUST.** The twins are spent after one flip, yet the leak table promised "asked again the other way". | Written honestly: a pair is spent once asked and unaskable until Simba or an L4 size word re-opens it. Every level starts with at least asks + 2 askable kinds (counted in the ladder: L2 6 for 4, counting the floor, which the critique left out; L3 10 for 5; L4 11 for 6, 10 on phones), and at L2 at least 3 of 4 asks are on pairs. Odds re-stated with kinds dropping out: about 0.1% a round at L2; a noun-only child about 12.5%. Simba stays at L3 (L2 kept clean for the twins), with Simba-from-L2 offered as one data line. Decisions 3 and 23. |
| 3 | **MUST.** Simba's undo pointed at the answer. | Both fixes: the mischief happens under the shared dim between asks, and Simba changes two spent pairs; Nani names one, in a random direction, so "tap what changed" is right 1 in 4. Simba sits at Nani's feet, away from every target. Kept "Simba!" and the laugh. C5, decision 13. |
| 4 | **MUST.** The phone layout was never counted. | Counted every target per level (things, tools, dirt, loose things, homes): 6, 11, 17, 18 on big screens. Three bands of at most 6 boxes, with the width and height sums at 740x320 and 915x275; the cap in data, `phoneCap: [6, 11, 16, 16]`, with a drop order; the mirror cabinet's door is the mirror (one box, two verbs) and the soap waits on the bath mat to make it fit. Bubbles go in a reserved wall strip at the top, running to Nani's face. The lab page proves it with placeholder boxes before one sprite. §7, ladder, decisions 24, 26, 27, 28. |
| 5 | **MUST.** The shared doll's house had no bathroom or play room. | One house of five rooms: the kitchen, the sitting room (with the front door), the bathroom (in the hall's place), Nani's bedroom, Ali's room as the play room; the shoe rack moves by the front door. Put to Zafar as a numbered choice (a/b/c, recommending a), with pick it up's §4 to change the same day (no other file edited tonight). §2, §4 step 1, §5, §6, decision 25, open question 4. The bedroom visit is now Nani's bedroom, and Ali comes in to say goodnight rather than being asleep there. |
| 6 | **MUST.** The prompts drew the wrong cat and invited marks. | All four rewritten: Simba is a big charcoal-black cat with pale mint-green eyes and a silver bell (prompts 2 and 3); Zazu a silver-grey kitten with yellow-green eyes, "he" (prompts 1, 2, 4); the car stopped with its headlights off, the fan, windmill and music-box bird still, and "no motion lines" in every style line; "no toilet" replaced by naming the basin, window and bath filling the back wall; no glow in prompt 1 ("a second after", "no highlight"); prompt 3's glow gone too; Nani with thin round gold glasses, a plain red dupatta over her head, no rings, from her locked sheet and lineup (now attached to every prompt, the placeholder sheet dropped); "Wide landscape frame, about 2.3:1" in each. States that were half-way (the curtain "half open", the wardrobe "slightly open", the lamp "just fading") are now clear. |
| 7 | SHOULD. Tell Ali had no picture of the need. | A thought bubble over Nani shows the goal state; the pills are the three things' pictures; the ask maker checks the set is valid before the handover, or swaps or skips; "Kutchi decides" scored 4. Ali's age removed from this doc and its prompts; fixing it in `cast.md` is left as open question 5 (no other file edited). C4, decisions 14, 33, 34. |
| 8 | SHOULD. Mum's list was short, and L2-L4 couldn't be built. | New table "What Mum records for L1 to play": 15 new clips plus 2 reused, in order; L2's 14 with the six verbs alone; L3-L4's about 16 with the frame pieces; about 45 for the bathroom. *Thundo* marked "Mum to confirm for a tap"; the wash line "recorded, to re-check"; *ad na* not used until recorded. §1, decision 20. |
| 9 | SHOULD. The first round was half a minute of watching, and the dim never cleared. | Only the four L1 things are named; the drawer is named when first touched; the flip is shown once; the tool is shown inside the first "sweep the floor"; the dim clears fully after each showing; the real asks run with no box. The first tap comes about 10 s in. §4, decision 31. |
| 10 | SHOULD. The dusk hid the board. | The dusk is a 2 s beat, then a readable soft level set in data and checked on film. The "queue an 'on' ask" route doesn't work at L2 (the lights pair is spent after the dusk), and the doc now says so. C1 delight, decision 11. |
| 11 | SHOULD. The art was understated by about half. | An honest count by run: the bathroom's L1-L2 set (about 16 sprites, 2 layers, 28 frames) first; L3-L4 (about 10 frames) second; the other rooms later. §0 and §7, decision 32. |
| 12 | SHOULD. The toys' put-away rebuilt pick it up's engine. | C3 calls pick it up's place piece with identical dotted rings on every home; `do-it` asks and ticks only. C3, §6, decision 10. |
| 13 | SHOULD. Three timing rules for one moment. | One rule, "The three helps": the card's speaker is free; Nani's repeat at 7/9/11/13 s is the guide's hint (counts, per `data/rules.json`); the helper card on the next rung costs the bulb; nothing is said during a reaction. The critique called the timed repeat "free"; the rules count it as the hint, and the rules win. §3, §9 rows 3-4, decision 30. |
| 14 | SHOULD. Rulebook overrides were piling up. | One rulebook proposal shared with hide and seek, the do-it engine and pick it up: the picture at L1 only, "no" asks per game, the L1 round size per game, first-pick level-up. This game cites it and has no override of its own. §6, §9 row 9, decisions 9, 15, 16, 35. |
| 15 | SHOULD. The swipe needed its rule. | Written: the tool is always tapped first; a swipe counts only on dirt with a tool lifted; the tool hovers by its spot and never follows the finger. C2, decision 2. |
| 16 | SHOULD. Small facts. | Zazu is "he" throughout; *hida* removed from Nani's lines (no moment used it); the day's last beat is said to be the one allowed unscored `do-it` tap (§2, decision 17); taps during a reaction are taken (§3, decision 29); open question 3 kept, recommending keep the kitchen. |

**Consistency pass (1 Nov, `consistency-2026-11-01.md`).** `pick-it-up-put-it-back.md` now assumes decision 25 (a): one house whose rooms run the kitchen, the sitting room, Nani's bedroom, the bathroom (in the hall's place) and Ali's room. The order here was put in that design's order, so its first visit's three left rooms still include the bedroom.

**Zafar's answers (1 Nov): what changed** (`zafar-answers-2026-11-01.md`).
- **The home:** the doll's house is two storeys (downstairs the kitchen and the sitting room; upstairs the bathroom, Ali's room and Nani's bedroom), not five rooms in a row. §2, §3, §4, §5, §6, §7 (with how the 2+3 house fits 740x320) and decision 25 changed; open question 4 is gone.
- **Push on a toy car in Ali's room: yes** (§1, §3 C3, §5, decision 19). **The kitchen as the fourth visit: yes** (decision 7). Both open questions are gone.
- **Level up only on right-first-time rounds:** decision 22 and decision 35 (d), now settled.
- **Voices:** decision 20 says nothing waits on a voice.
- **His Kutchi, "Zafar, to confirm":** *bund* (close, and "close the light"), *batti* (light), *fugya* (sweep), *fugyu* (broom), in the word tables, the speaking set and Mum's question.
- **Clothes:** the prompt sheet's line is added before the prompts.
