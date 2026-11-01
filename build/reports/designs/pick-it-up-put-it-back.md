# Pick it up and put it back: the doll's house (design, 1 Nov 2026)

Written overnight while Zafar slept, on his instruction to design every game alone and record each choice (§10). Revised the same night after an independent critique (`pick-it-up-put-it-back-critique.md`); every change is listed in §12. Design only: no code, no data, no other doc changed. Sources, newest first: his scope for this game (`game-settings-map-2026-10-31.md` "Home and rooms, new game 1", rows 19 and 62, his answers of 31 Oct and 1 Nov), hide and seek's design of the same night (`designs/hide-and-seek.md`, the game before this one), the games map (`games-master-map-2026-10-31.md` Part 1 "A day at home", the fold list, Parts 2, 3 and 7), the audit's fold table (`research-existing-games-2026-10-31.md` §4), the outside research (`research-other-games-2026-10-31.md` §4, `research-mechanics-2026-10-31.md`), the lessons checklist (`designs/lessons-checklist-2026-11-01.md`), the rulebook (`docs/game-design/rulebook.md`, `data/rules.json`), the art bible, and Tidy up's archived design (`docs/archive/modes/tidy-up.md`) for the mini-games folded in.

Kutchi here is only what is in the repo (`research-word-inventory-2026-10-31.csv`, `data/lang/lexicon.json`, `docs/language/grammar-notes.md` §15-18). **✓** means a family clip of the word or the whole line. "Inside lines" means Mum says it only inside longer recorded lines. "In engine" means the engine has it but nobody has recorded it. "To record" means the repo has no Kutchi for it. No new Kutchi sentence is written in this doc: frames are given in English, with the repo pieces the engine builds them from. Where the engine has no frame, the gap is reported, never spliced.

**Nothing ships, and the leak bot has nothing to measure, until Mum's L1 list (§1, "What Mum records") is in.**

---

## 0. One line

**What:** a doll's-house cross-section of Nani's house. Nani says where Nana's things are ("Nana's glasses are under the table"); the child goes to the room, picks the right one of two identical copies, and it flies to Nana, who uses it and keeps it. Then the child puts back what Simba knocked down during hide and seek, on or under the furniture, as Nani says. Later visits add the room as a second word, the family's own voices, Simba's paw, Tell Ali where, this side and that side, and the rooms' own boards (the spice box, the bed, the shoe rack, the drawers).

**Day:** a day at home, the second game (hide and seek, then this, then clean-up day).

**Status:** new (designed tonight). Folds in nine parked or designed mini-games from Tidy up and Find it (Zafar: yes, 31 Oct). Built in two parts: **1a** (stages 1 and 2, L1-L2, three rooms, Nani the only voice) and **1b** after Zafar has played 1a (decision 28).

**Engines:**
- Tidy up's place engine and the shared relations layer (`js/tidy/`, `js/shared/rel.js`, `data/relations.json`): greybox, moved onto the shared kit (a rebuild, not a reskin).
- The copies and the bot's odds: `js/shared/whichone.js` (the decoy rule, `blindOdds`, `estimate`); Find it's "where is it?" (4c, `js/find/games/where.js`) is the greybox it reskins.
- Levels, hints and level-up: `js/shared/rules.js` reading `data/rules.json` (four overrides, §10).
- Lines and bubbles: `js/shared/conversations.js` (`bubble`, `run`); the speaking moment: `say.js`, `speech.js` (built).
- **New:** the doll's-house view (an overview of the rooms, a gentle zoom into one, a thing that travels between rooms). In 1b, a speaker-relative relation ("this side" = the side nearer the speaker), only once Mum has confirmed the meaning (decision 6).

**Size:** small to medium, as the research sized it. 1a is one builder sprint (fetch, put away, the house view and travel). 1b is a second (the askers' voices, Simba's paw, Tell Ali where, L3-L4, the boards). 1a's art is about twelve pieces in one paste block (§7).

---

## 1. The language goal

**Word groups:** positions (main), household things (main), owners (supporting), home and rooms (this game teaches the room names first; hide and seek's later "whole house" visit reuses them). Verbs: bring, put, take, leave.

### The words it teaches

**Positions (the deciding words).**

| English | Kutchi in the repo | Status | Where it decides |
|---|---|---|---|
| on, on top of | *mathe* | inside 6 lines | fetch and put away from L1 (1a) |
| under, underneath | *niche* | inside 1 line (hide and seek's L1 list records it alone) | fetch and put away from L1 (1a) |
| behind | *puthiya* | inside 4 lines (hide and seek's list records it alone) | Tell Ali where's speaking set (1b); placing at the second visit |
| this side | *hi baju* (grammar-notes §17; *hi* ✓, *baju* "side" in engine, draft) | the whole phrase to record, **after Mum confirms its meaning** | put away L3 (1b), the spice box (1b) |
| that side | *hu baju* (*hu* ✓) | as above | as above |
| next to | *bajume* | in engine | second visit |
| in, inside | *me* (as hide and seek; *andar* not used here) | in engine (hide and seek's list records it alone) | Tell Ali where L3 (1b); the toy box, the drawers |
| in front of | *agiya* | in engine | second visit |
| in the middle | *wich me* | in engine | the spice box (1b) |
| left, right | *dabo*; *jamni baju* | in engine; draft | a later visit only |
| here, there | *hida* ✓, *huda* ✓ | ✓ | Nani's glue lines |

**Household things (the carried things).** Each sits happily in several spots (the "natural place" leak, research §4).

| English | Kutchi in the repo | Status | Used from |
|---|---|---|---|
| glasses (Nana's) | none | to record | 1a, L1 (stage 1) |
| cup (Nana's in stage 1; Nani's in stage 2) | *cup* ✓ | ✓ (comes back from Cook) | 1a, L1 |
| ball | none | to record | 1a, L1 (both stages) |
| bag (Nani's; hide and seek calls it her purse, decision 31) | none | to record | 1a, L1 (stage 2) |
| teddy (Ali's) | none | to record | 1b |
| key | *chawi* | in engine | 1b |
| book | none | to record | 1b |
| sock (Ali's), thread (Big Ma's) | none | to record (hide and seek's carry) | 1b, stage 2 |
| slippers | none | to record | second visit (the shoe rack) |

**The furniture anchors and the rooms.**

| English | Kutchi in the repo | Status | Where |
|---|---|---|---|
| table | *table* | inside 2 lines | 1a, L1: the only anchor word at L1 (the kitchen table, the bedroom's bedside table) |
| chair | *kursi* | inside 7 lines | 1a, L2 |
| bed | none | to record (hide and seek's L1 list records it first: "under the bed") | 1a, L2 |
| sofa, armchair | none | to record | 1b (scenery in 1a) |
| box (the toy box) | none | to record (hide and seek's list) | 1b (Ali's room) |
| cupboard | *kabaat* ✓ | ✓ | scenery here (decision 27) |
| kitchen | *rasoro*; "he's in the kitchen" *e rasore me ai* ✓ | inside lines; the whole line ✓ | heard at L1, deciding at L2 (1a) |
| sitting room, bedroom | none | to record | heard at L1, deciding at L2 (1a) |
| the hall, Ali's room | none | to record | 1b |

**Owners.**

| English | Kutchi in the repo | Status |
|---|---|---|
| Nana's | *Nana* ✓ + *jo / ji / ja* (agreeing with the thing) | *Nana* ✓; the possessive in engine; *nana jo ai* ✓ ("it's Nana's") |
| my, your, his, her | *munjo / munji*, *tojo / toji*, *injo / inji* | in engine; 1b, in the askers' own lines |

### Its verbs

| Verb | Kutchi in the repo | Status | Where |
|---|---|---|---|
| put (down), place | *rakh*; "put it on the table" *table mathe rakhi chad* | inside 2 lines; the frame in engine (draft) | every put-away line (1a) |
| bring | *khanech*; "will you bring me the chai things?" ✓ (*muke chai ji chiju khanechi dinde*) | in engine; the frame ✓ | "bring Nana his glasses" (1b, L3) |
| take | *khan* | in engine | Tell Ali where (1b) |
| leave it be | *inke chadi de* ✓ | ✓ | Simba's paw: said at the stage's close, and from L3 as a row (1b) |
| put it back | none | to record | Simba's paw card title (1b) |
| Simba took it | *simba khani vyo* | in engine | Simba's paw opener (1b; hide and seek needs it later too) |

### Frames heard (English meaning; built by the engine from recorded phrases)

| When | Frame | Pieces | Part |
|---|---|---|---|
| The fetch ask, L1 | "Nana's glasses are under the table." | the "where" frame **{thing} {place-thing} *je* {where} *ai*** (grammar-notes §15, Mum's "the cup is on the table"); *Nana* ✓ + possessive (in engine); *mathe* / *niche*; *table* | 1a |
| The fetch ask, L2 | "Nana's cup is under the chair in the kitchen." | **A gap.** The engine has no frame with a room and an anchor in one line, and splicing "it was on the table" onto "he's in the kitchen" would be a hand-made fragment (non-negotiable 2). Reported to the language engine's owner; Mum records one model line (row 9 below) and the engine takes the frame from it. L2 waits for it. | 1a |
| The room, on arrival at L1 | "The kitchen." (Nani names the room as the camera eases in) | the room word alone; silent until recorded | 1a |
| Put away | "Put the ball under the table." | **{thing} {place-thing} *je* {where} *rakh*** (grammar-notes §16, rule 14; draft in engine; Mum's model line confirms it) | 1a |
| L3, the two-person exchange | Nana: "Where are my glasses?" (*kida ai* ✓). Nani: "They're under the chair in the bedroom." | Nana's own voice (open question 1); the L2 frame | 1b |
| Simba's paw | "Simba took it!" Rows: "The bag goes on the bed." At the close: "and the ball: leave it be" (*inke chadi de* ✓). | "Simba took it" (in engine); the put frame; *inke chadi de* ✓ | 1b |
| Glue that comes back | *shabash* ✓ well done, *hane* ✓ now, *ne poi* ✓ and then, *ha* ✓, *na* ✓, *hida* ✓ here | ✓ | 1a |
| The evening book | "It was on the table" (*table je mathe wo*), "where was it?" (*kida wo*) | both in engine | 1a (the book page) |

### Frames said

Tell Ali where (1b, from L2, after watching): the child says the position from a closed set of three that start differently: on, under, behind (*mathe*, *niche*, *puthiya*) at L2; under, behind, in (*niche*, *puthiya*, *me*) at L3. At L4 two turns: the position, then the anchor (bed, table, chair), each from a set of three. This side and that side are never in one speaking set (*hi* and *hu* differ by one sound).

### What Mum records for L1 to play

Ordered by what unblocks play. Each is one short clip. Nani (Mum) says every ask in 1a (decision 29), so 1a needs no other voice.

| # | Clip | Count | Why |
|---|---|---|---|
| 1 | glasses, ball, bag, each alone | 3 | the things (cup ✓ exists) |
| 2 | *mathe* (on) alone | 1 | a deciding word (*niche* alone is on hide and seek's list) |
| 3 | table alone | 1 | L1's only anchor |
| 4 | one model line of the "where" frame: "Nana's cup is on the table" | 1 | the engine's {thing} {place-thing} *je* {where} *ai*, heard whole once, with the possessive |
| 5 | "Nana's glasses" | 1 | the possessive's agreement with glasses may differ from the cup's; Mum settles it |
| 6 | one model line of the put frame: "Put the cup under the table" | 1 | every stage-2 line (the frame is a draft) |
| | **L1 total** | **8** | plus *niche* and bed from hide and seek's list (2 more if this game is ever played before it is recorded) |

**For L2 (still 1a):**

| # | Clip | Count | Why |
|---|---|---|---|
| 7 | kitchen alone; sitting room; bedroom | 3 | the room words (decision 30); heard on arrival at L1, deciding at L2 |
| 8 | chair alone | 1 | L2's second anchor (bed comes from hide and seek) |
| 9 | one model line with a room and an anchor: "Nana's cup is on the table in the kitchen" | 1 | **the frame gap**: asked of her as a frame, not spliced |
| | **1a total** | **13** | (+2 shared with hide and seek) |

**For 1b, from Mum:** this side and that side (2, once she has answered what they mean); next to, in front of (2; behind and in come from hide and seek); teddy, key, book (3); the hall, Ali's room (2); "Simba took it" (1, shared with hide and seek's later list); "put it back" (1); a model line "bring Nana his glasses" (1); sock and thread (2, hide and seek's carry): **about 14.** *wadho* (big) alone is shared with hide and seek's 1b.

**For 1b, in the askers' own voices** (only if Zafar chooses family voices for Nana, Ma and Ali, open question 1): about 10 (each asker's "my X is …" model line and "where are my …?").

**The boards (1b and the second visit):** in the middle (1) and six spices (in engine; Cook needs the same clips); pillow and Simba's mouse (2; blanket is hide and seek's); slippers, shoes, top, bottom (4); drawer, knife, fork (3; teaspoon, tablespoon ✓): **about 16.**

**The whole design, every visit counted:** about 43 from Mum, plus about 6 shared with hide and seek, plus about 10 in the askers' voices if he chooses them. 1a needs 13.

### New words per level (3-5 a round, each heard at least three times)

| Part, level | New this level | Comes back |
|---|---|---|
| 1a, L1 | glasses, ball, bag; on; table (5) | under, bed (hide and seek), cup (Cook); the three room names heard, not deciding |
| 1a, L2 | the room names now decide; chair (4) | everything from L1 |
| 1b, L2 (stages 3, 4) | "Simba took it", "put it back"; behind as a said word | "leave it be" ✓, on, under |
| 1b, L3 | this side, that side (after Mum's answer), or next to and in front of; teddy, key; Nana's own "where are my …?" | "and then" ✓ |
| 1b, L4 | big (*wadho*), small (*nindho* ✓) as the look-alike; my against your | the rest |

Each L1 word is heard at least three times a round: in Nani's ask, in the free repeat, and at the tick (Nani says the thing's name as it lands).

**Speaking turns:** none in 1a. Two a round from L2 in 1b.

---

## 2. Where it sits in its day

**The day at home** (games map Part 7): the door, hide and seek, **pick it up and put it back**, clean-up day, the evening book. Hosts: Nani, with Simba and Zazu.

### The day's carry (one list for both home designs)

This section is the one place both designs cite for what passes between them (decision 31). Hide and seek's file should point here once Zafar says yes; tonight I edit no other file.

| From hide and seek | Into this game |
|---|---|
| **The house:** one bedroom drawing, hide and seek's (wardrobe, curtain, bed with its cover to the floor, cupboard, chest of drawers, toy box, basket, the open door to the hall), plus **one small pale-oak bedside table**, which is an anchor here and scenery there (decision 3). | The doll's-house view is drawn to match that bedroom and locked after it. In this game everything in the bedroom except the bed and the bedside table is scenery, never ringed. |
| **The mischief things** (one a round, dropped silently on the bedroom floor; the "for later" tray holds their pictures): Nana's glasses, Nani's bag (hide and seek's "purse", one word for both), Ali's sock, Big Ma's thread. | **Nana's glasses** in the tray become one of stage 1's two copies (Nana gets them back). **Nani's bag** is put away in stage 2. **The sock and the thread** stay in the tray until 1b, when their words are recorded, and are then put away in stage 2. A thing in the tray is never a stage-1 thing for someone else. |
| **The place words:** under, behind, in, bed, box. | under and bed come back at L1-L2; behind and in in Tell Ali where (1b). |
| **The room words:** none. Hide and seek's first visits are one bedroom; its visit 5 ("the whole house") needs room names. | **This game teaches them first:** kitchen, sitting room, bedroom (1a), the hall and Ali's room (1b). Hide and seek's visit 5 reuses the same five words and the same clips (decision 30). |
| **The cats,** found and awake. | Zazu chases the ball and sniffs what goes under; Simba's paw is theirs (1b). |

### What it hands on

- **To clean-up day:** the tidy house is the start of clean-up's mess (the bathroom and the play room). Clean-up's verbs ("put the soap on the shelf") reuse on, under and in.
- **To the evening book:** a page of "where it was": Nana's glasses under the table, the ball under the bedside table, with "it was on the table" (*table je mathe wo*) and "where was it?" (*kida wo*). The child taps the room in a small copy of the house.
- **The thing for Ali** (the day template's "home" beat) joins in 1b with Ali: his ball, found under something, which he bounces in the end scene.

**Free play:** the house is a lab-style toy from the day map. A free round opens on the house view and dips into one stage: three fetches, or one room to put away (with three things from the carry list placed on the floor).

---

## 3. The stages and mini-games

### The pipeline

```
 From hide and seek         1. Where is it?        2. Put it away          3. Simba!              4. Tell Ali where      The end
 (the camera pulls back --> Bring it to Nana  -->  (what Simba knocked --> (fix what's wrong;  --> (the child says it) -> (everyone has theirs,
 from the bedroom to the    (3 errands; Nana       down; Nani says          1b, L2+; the swap      (1b, L2+; two turns)   the cats curled up;
 doll's house)              keeps his things)      where)                   at L3)                                        "aah")
```

**What carries:** stage 1's things are Nana's and he keeps them (his glasses, his cup; the ball he rolls for Zazu, who chases it into the bedroom). Stage 2 puts away what is on the bedroom floor: the ball Zazu left there and what Simba knocked down during hide and seek (the carry list). Stage 3 is played in a room the child did not arrange this round (the leak fix below). Stage 4's positions are the ones heard in stages 1 and 2 and in hide and seek.

**The first-ever round** is stages 1 and 2 only: three errands and three put-aways, about 3 minutes. Stages 3 and 4 are 1b.

### The five questions, scored

Scores are 1-5 for: **Do** (one clear gesture), **Kutchi** (the word decides), **Fun**, **Instruction** (card and line in family Kutchi), **Novel**. Kept: the best eight. "Fold" names where it came from.

| # | Mini-game | Fold | Do | Kutchi | Fun | Instr. | Novel | Total | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| A | Where is it? Bring it here | Find it 4c, Tidy "bring me the X" | 5 | 5 | 4 | 5 | 4 | 23 | **core, stage 1 (1a)** |
| B | Put it away | Tidy "put it there" | 5 | 5 | 3 | 5 | 3 | 21 | **core, stage 2 (1a)** |
| C | Simba's paw (the paw-tap, the knock, the swap, Zazu's theft) | Tidy "Simba's paw", "the swap", 4b | 5 | 5 | 5 | 4 | 5 | 24 | **keep, stage 3 (1b)** |
| D | Tell Ali where | Find it L20, Tidy "Ali's turn" | 4 | 5 | 5 | 4 | 3 | 21 | **keep, stage 4, speaking (1b)** |
| E | The spice box (the kitchen's board) | Tidy masala dabba | 4 | 5 | 4 | 4 | 4 | 21 | **keep, stage 2 variant (1b, after Mum's answer)** |
| F | Make the bed (the bedroom's board) | Tidy "make the bed" | 4 | 4 | 4 | 4 | 4 | 20 | **keep, stage 2 variant (1b)** |
| G | The shoe rack (the hall's board) | Tidy "shoe rack" | 4 | 4 | 4 | 4 | 4 | 20 | **keep, second visit** |
| H | The drawers (cutlery) | Zafar's "later: drawers" | 4 | 5 | 3 | 4 | 4 | 20 | **keep, second visit** |
| I | The toy box (Ali's room) | Tidy toy-box skin | 5 | 4 | 3 | 4 | 2 | 18 | **a skin of B** (the box is one more anchor, adding "in") |
| J | The wardrobe | Zafar's "later: wardrobe" | 4 | 4 | 3 | 4 | 3 | 18 | **third visit** (needs clothes words, which the sewing day records) |
| K | Cupboards | Zafar's "later: cupboards" | 4 | 3 | 3 | 4 | 2 | 16 | **a choice for Zafar** (decision 27): maybe later, or with the drawers at the second visit |

Nothing is removed: the toy box becomes an anchor in Ali's room; Tidy's paw-tap and Zazu's theft stay inside C (decisions 25, 26); cupboards are his choice.

### The three helps (one meaning each, every stage)

- **The free repeat:** Nani's line again every 8 s, no extra words. Free; counts for nothing.
- **The guide's hint:** at 7 / 9 / 11 / 13 s (L1-L4) **from the last ask**, not the last tap, Nani says the deciding word again and the right room, copy or ring glows once. A child who taps fast can't reset it. This is the hint the level-up rule counts. A new ask starts the wait again.
- **The helper card:** opens only when the child taps the bulb, shows the full answer, and costs a bulb. It never opens by itself.

### Rulebook overrides (each also in §10)

1. **Level-up rests on first go** (decision 21): up after 3 finished rounds in a row in which at most one errand or placement wasn't right first go and the guide's hint came at most once. Proposed `data/rules.json` entry, read by the game and the leak bot: `advance.games["pick-it-up"].maxNotFirstGo: 1` (not added tonight: no other file edited).
2. **The guide's hint counts from the last ask** (decision 22), reading `hintS`'s "from the last action" so that a tap never resets it.
3. **The card's pictures at L1 only** (decision 23): the rulebook shows the card picture at L1-L2 (`cardPicture: [true, true, false, false]`). Here, at L1 the row shows the thing with a small position badge; from L2 the row is the thing (which can't choose among identical copies), the Kutchi and a speaker. Room and position pictures never show from L2.
4. **"No" asks at L3, not L2** (decision 9b): L2's one new thing is the room as a second word.

### The leak numbers (one table; the bot prints them)

**A won round** is one in which every errand and every placement was right first go. The level-up rule (override 1) allows one miss a round, so the table also gives that.

| Stage, level | Choices per move | Blind odds per move | A won round by chance | A level-up round (at most one miss) | Three in a row by chance |
|---|---|---|---|---|---|
| 1 and 2, L1 (1a) | 2 copies (on, under one table); 2 rings | 1 in 2; 1 in 2 | 1.6% (6 moves) | about 11% | about 0.13% |
| 1 and 2, L2 (1a) | 3 copies across rooms; 4 rings (2 anchors x on, under) | 1 in 3; 1 in 4 | about 0.06% | about 0.9% | under 0.0001% |
| 2, L3 (1b) | 8 rings (2 anchors x on, under, this side, that side) | 1 in 8 | | | |
| 3, L2 (1b) | n = 2 dots of 3 rows: which two (1 in 3), then 4 rings each | about 2% a round | | | |
| 3, L3, the swap (1b) | 6 things, which two swapped | 1 in 15 (about 7%) a round | | | |

**L1 is the supported level:** the position badge on the card lets anyone match their way through it, as the rulebook intends for L1. The odds above for L1 are with the badge ignored. The leak bar (under 10% a round, under 1% for three level-up rounds) applies from L2, where nothing on the card or the scene points at a copy or a ring.

---

### A. Where is it? Bring it here (stage 1)

**Why:** Zafar's core: "my bag is on the table in the kitchen: go to the room, pick it up". Copies make the place decide (his leak fix).

**What you do (tap, then tap):**
1. Nani, beside Nana, says where his thing is. The card pops up big and flies to its row.
2. The camera pulls back to the whole house. Tap a room: the camera eases into it.
3. Tap the thing. It hops up with a small lift sound.
4. The camera pulls back. The thing travels along the house to Nana in the sitting room; each room it passes glows softly (the shared lit-box glow, code, no light states). Nana takes it and uses it. The row ticks.

Inside a room, slivers of the rooms either side show at the edges. A tap on a sliver slides to that room. That is the only navigation; no buttons.

**The challenge, decided by the Kutchi:** two or three identical copies of the asked thing (Zafar: "two of the same thing in different places, so the place decides"). The card's thing picture fits all of them.

**The fun:**
- **Nana uses it:** he puts his glasses on and his eyes go huge behind the lenses, then he shakes out his newspaper. He sips his cup: "aah". He rolls the ball across the floor and Zazu pounces after it, chasing it out of the room.
- **The wrong copy is funny, never a frown:** a different small joke each time. A paw pats the wrong one from under the table ("mrrp"). The wrong ball squeaks and rolls a little way. The wrong cup has Zazu's nose in it. The thing shakes, and Nani's line repeats.
- **The journey:** the thing glides through the house and the rooms glow as it passes (Toca Town's carry-it-home).

**The instruction:** Nani is on screen beside Nana and speaks first: one natural sentence. At L1 the card row shows the thing's picture with a small "on" or "under" badge, the Kutchi, the English (L1 only) and a speaker; from L2, the thing's picture, the Kutchi and a speaker. The guide box names the current step ("the room", "the glasses").

**What's novel:** the only game where you travel between rooms carrying something, and the only one where a copy of one thing in several places is the whole puzzle (4c was a greybox).

**Level ladder** (each level adds one thing; the gestures never change):

| Level | What it adds | Example |
|---|---|---|
| L1 (1a) | One thing per errand. **The room is guided:** the asked room sits in the lit box (the room word is heard as the camera eases in, once recorded). **The position decides:** two copies in that room, one on and one under the same table. One clearly different decoy in the room (another of the round's things, on the counter or floor, never on or under the table). Rooms with copies: the kitchen and the bedroom; Nana sits in the sitting room. | "Nana's glasses are under the table." In the kitchen: glasses on the table, glasses under it, the ball on the counter. |
| L2 (1a) | **Two words per move: the room joins.** No lit box. Three copies, at least two in one room, on or under the table, the chair or the bed. Three rooms. Waits for Mum's model line (the frame gap, §1). | "Nana's cup is under the chair in the kitchen." The others: on the chair in the kitchen; under the table in the bedroom. |
| L3 (1b) | **Other ways of saying it:** the two-person exchange (Nana: "Where are my glasses?" Nani: "They're under the chair in the bedroom"); "Bring Nana his glasses"; a "no" ask ("not in the kitchen, in the bedroom"). Ma and Ali ask too; the hall and Ali's room join. | the asker is the one who receives; "his" is heard |
| L4 (1b) | **A look-alike:** the copies differ by size, and the size word joins the place. And "my" against "your": "Bring my small bag" or the child's own trip bag. | "Bring my small bag. It's on the table in the kitchen." |

**The leak test, written out:**
- **Reading:** the card's Kutchi is romanised, and the words fade (text, then speaker only) after three right first go in a row. English shows at L1 only. An unrecorded word is grey-italic English and a reader wins, so nothing ships until Mum's L1 list is in (§1).
- **Matching:** the copies are identical and the card's thing picture fits all of them. The position badge shows at L1 only (override 3); the room picture never shows (at L1 the lit box guides the room; from L2 nothing does). From L2 nothing on the card points at a copy.
- **Eliminating:** after one copy is fetched, the next errand for that thing would be obvious. Fix: copies are never removed. A fetched thing is replaced by a fresh copy in a new spot before the next ask, copies are reshuffled every errand, and errands in a row never ask for the same thing.
- **Patterns:** the asked copy's room and position are random per errand, with no fixed order and no "the asked one is always on". Copies never sit in a natural home (no glasses in a case). The decoy is never on or under an anchor. Odds in the table above: 1 in 3 per errand at L2.
- **Waiting:** nothing glows by itself. The guide's hint (7-13 s from the last ask) glows the right copy once and counts against level-up; the helper card opens only on a bulb tap. A wrong tap shakes and the line repeats; only a right first go ticks the word's ladder, the accuracy badge and the level (override 1), so fishing through the copies finishes the step but never climbs a level.

**Delight moment:** Nana's huge eyes behind his glasses.

**Speaking moment:** none here (the child listens).

---

### B. Put it away (stage 2)

**Why:** Zafar: "then put things back on top of, underneath, this side and that side, using the words just heard. Every spot is outlined; a wrong spot shakes, the line repeats, try again." In 1a: on and under. This side and that side come next, once Mum has said what they mean (decision 6), and before left and right (her advice).

**What you do:**
1. The bedroom: three things on the rug: the ball (Zazu chased it here), Nani's bag and Nani's cup (Simba knocked them down during hide and seek). Nani stands on the right of the room.
2. Nani says where one thing goes. Its row pops up big and flies in.
3. Tap the thing. Every spot around every anchor in the room shows the same soft dotted ring (never only the right one).
4. Tap a spot. The thing moves there and settles with its own little reaction. The row ticks.

**Spots are never used up:** a spot can hold more than one thing. A second thing "under the table" settles beside the first, and the ring stays live. Every placement has the full set of rings.

**The challenge, decided by the Kutchi:** the rings are identical, and each anchor has the same set (on, under). Only the heard position and, from L2, the heard anchor choose.

**The fun:** each thing settles in its own way. The ball rolls into place and wobbles still. The bag flops over. The cup lands with a tiny clink. When a thing goes under the table or the bed, Zazu comes to sniff it, then curls up beside it. A wrong spot: the thing boings back to the rug with a shake, and Nani's line repeats; a different comic boing each time.

**The instruction:** Nani, on screen, one line: "Put the ball under the table." Card rows as in A: at L1 the thing with its position badge, the Kutchi, the English; from L2 the thing, the Kutchi, a speaker. The guide box says the step ("the ball", then "where").

**What's novel:** placing by heard positions in a room you have just travelled through; from 1b, by a position relative to a speaker. The research found nothing else that teaches this side and that side.

**Level ladder:**

| Level | What it adds | Rings shown |
|---|---|---|
| L1 (1a) | One thing at a time, one anchor (the bedside table): **on** or **under**. Three things. | 2 |
| L2 (1a) | **Two words per move:** two anchors (the bed and the bedside table; or, in the kitchen, the table and the chair), on and under. | 4 |
| L3 (1b) | **Other ways of saying it:** **this side** and **that side**, Nani's standing place deciding, once Mum has confirmed the meaning (otherwise next to and in front of). Two things in one line with "and then" (*ne poi* ✓): both rows show, done in order. | 8 |
| L4 (1b) | **A look-alike:** two chairs, big and small: "under the small chair". | 8 |

**"This side" and "that side" (1b, if Mum confirms):** "this side" is the side nearer Nani. She stands middle-left in some rounds and on the right in others, so the screen side of "this side" changes. She never points. If Mum says *hi baju* means the side pointed at, this level is redesigned with her pointing, and decision 6 changes.

**The leak test:**
- **Reading:** as A.
- **Matching:** the rings are identical dotted circles, never outlines of the thing (an outline shaped like a ball would match). The badge shows at L1 only.
- **Eliminating:** spots are never used up and rings never drop away, so every placement has the full 2 (L1), 4 (L2) or 8 (L3) choices.
- **Patterns:** the asked spot is random; things that look natural in one spot are left out at L1-L2. From L3, "this side" moves with Nani.
- **Waiting:** as A. No ring glows by itself; the guide's hint glows the right ring once and counts; the helper card only on a bulb tap.

**Delight moment:** Zazu sniffing whatever went under the table, then curling up next to it.

**Speaking moment:** none here (stage 4).

---

### C. Simba's paw, the swap and Zazu's theft (stage 3, 1b, from L2)

**Why:** the cat that undoes your tidying (A Little to the Left's cat; Tidy up's Simba's paw, 23/25 in its own scoring). It re-tests the positions a second time in one session (spaced retrieval) and ties to hide and seek's cats. Tidy's three forms are all kept: the paw-tap (decision 25), the knock, the swap, and Zazu's theft with the past tense (decision 26).

**What you do:**
1. **The paw-tap (Tidy's opener, kept):** a room the child **didn't** arrange this round (the sitting room, if stage 2 was the bedroom). Simba's paw comes in from the edge along a random strip and throbs; the child has 2 s to tap it and shoo him, saving one thing. Otherwise a crash, and Nani: "Simba took it!"
2. **The knock:** two things are moved. They always land on a real spot (on or under another anchor), never loose on the floor, so a moved thing looks placed.
3. **The card is n dots** (n = things moved), never the rows, under the title "put it back". This is Tidy's rule (archived design Q.1, rule 2): a card that listed the rows and ticked the ones that hold would name the rows to leave.
4. **Nani's rows by voice**, every row of the room, the ones that hold as well as the moved ones, all in the same form ("The bag goes on the bed. The teddy goes under the chair. The ball goes on the chair."), in a random order. A tap during her rows is kept; she plays on.
5. **The child fixes what's wrong:** tap a thing, tap the right ring. Any thing can be lifted (it lifts like any other; no wiggle, no sign whether it held). A dot ticks when a moved thing is back where its row says. **No row ever ticks on a wait.**
6. **The close:** when all n dots have ticked and every row holds, Nani goes through the rows once more, and for each that held she says "and the ball: leave it be" (*inke chadi de* ✓): the phrase is taught after the judgement, never before it. If the child moved a thing that held and broke its row, Nani says that row again before the close and the child fixes it; no verdict.

**The challenge:** which rows no longer hold, by ear. Nothing on the screen or the card says which.

**The fun:** Simba's face. He's shooed off by the last dot and stalks out with his tail up, then peeks back round the door, wearing Nana's glasses.

**What's novel:** judging rows against a scene, and "leave it": the only place a child learns that not every row is a job.

**Level ladder:**

| Level | What it adds |
|---|---|
| L2 | The paw-tap, then two things moved among three rows (four rings: two anchors, on and under). |
| L3 | **The swap (Zazu's):** the shared dim falls on a room the child hasn't seen this round; two "mrrp"s; the light comes back. Six things, two have swapped places, both look placed. **The ask:** Nani says every row of the room once, in a new order; the card is two dots. Tap one, tap the other: they swap. A wrong pair swaps and breaks two rows; Nani says those two rows again and the child can swap back. From L3, one held row may be said as "leave the ball" (*inke chadi de* ✓), as in Tidy's L3: the phrase decides. |
| L4 | **Zazu's theft (Tidy's Arc 4 form, kept):** Zazu carries one thing off and drops it elsewhere. Nani: "It was on the table" (*table je mathe wo*, in engine): the past tense decides where it goes back. Rows use the L3 positions and the size words. |

**The leak test:**
- **Reading:** as A.
- **Matching:** there's no earlier picture of the room to compare (it's a room the child didn't arrange this round, and no "before" shot is ever shown). The stage is never played in stage 2's room.
- **Eliminating:** n dots tell how many moved, not which. The moved things look placed.
- **Patterns:** which things move is random; Nani's rows come in a random order and all in one form.
- **Waiting:** nothing ticks on a wait; waiting never fixes or names a row. Odds: about 2% a round at L2, about 7% at the swap.

**Delight moment:** Simba peeking back round the door, Nana's glasses on his nose.

---

### D. Tell Ali where (stage 4, 1b, from L2, speaking)

**Why:** the only place the child says a position. It is the one shared "say it, Ali acts" moment (lessons §8), with the position as what's said. Ali's turn and Tell Ali where were two copies of it; they merge.

**What you do (watch, then the handover):**
1. **Watch (twice, first visits):** Ali stands in his room holding the ball. A thought bubble from Nani's face (a Conversations bubble) shows the goal: the ball under the chair. Nani tells Ali; Ali puts it there. Then again with another thing.
2. **Handover:** the next bubble shows the teddy on the bed. Ali turns to the child, front-facing, and waits. The mic shows it's listening and what it heard. The pills (three, each with a speaker) are always there.
3. The child says (or taps) the position. Ali puts the thing where the child said, whatever it was.

**The challenge:** the child must produce the right word. If they say "on" when the bubble showed "under", Ali puts it on the chair, looks at the bubble, scratches his head and grins; Nani says the model once; the child tries again. No verdict.

**The fun:** Ali does exactly what he's told. At L3, when the set includes "in", Ali can end up putting the teddy in the toy box head first, legs waving (only when the child said "in").

**The instruction:** Nani models the exchange first (model, then ask).

**Level ladder:**

| Level | What it adds |
|---|---|
| L2 | Say it after the model: Nani's line plays first, then the child says the position. Set of three: on, under, behind (*mathe*, *niche*, *puthiya*: three different first sounds; behind comes from hide and seek). |
| L3 | Words only: no model line. Set of three: under, behind, in (*niche*, *puthiya*, *me*). |
| L4 | Picture only, in **two turns:** the child says the position (a set of three), then the anchor (bed, table, chair: a set of three). The pills show one set at a time. |

**The leak test:** this is speaking, so the leak is the pills. Each pill has a speaker and Kutchi text; a no-Kutchi player picks 1 in 3. The speech path can't be won blind. The audit measured this mechanic at voice 0%, pills at most 6.6% (Tidy's Ali's turn). Never blocks: a pill always works, and two misses bring the model line back.

**Delight moment:** the teddy head first in the toy box.

---

### E. The spice box (the kitchen's board; a stage 2 variant, 1b)

**Why:** Tidy's masala dabba board, folded here. Its positions are "in the middle", "this side" and "that side", Mum's order. It waits, with stage 2's L3, for Mum's answer on what this side and that side mean.

**What you do:** a top-down close-up of the round steel spice box (its own scene and camera, T). Seven empty katoris; seven spices in a row beside it. Nani: "Turmeric in the middle." Tap a spice, tap a katori.

**How the board shows Nani's side:** before the zoom, the kitchen at eye level (E) shows Nani standing at one end of the worktop, left or right, changing by round. The camera eases down to the top view keeping that orientation, and her bust stays at that edge of the board in the frame Cook's stations use for her (from the locked sheet; no hands, no sleeve). "This side" is the half of the box nearer her bust; because her edge changes between rounds, the screen side does too.

**The challenge:** the katoris are identical. "In the middle" is one; "this side" and "that side" are three each, so at L3 a second word is needed ("next to the turmeric", *bajume*).

**The fun:** each spice pours with its own colour puff; the lid closes with a soft clap when it's full.

**Levels:** L2 the middle, this side, that side. L3 next to (a placed spice as the anchor). L4 two spices in one line.

**Leak test:** reading, as A; matching, the katoris are identical and the spices look different, but the place is what's asked; eliminating, the last spice has one place left, so the last one never counts (it drops in by itself with Nani's "and the last one"); patterns, the spice order and Nani's edge are random each visit.

**Words:** turmeric *hardar*, cumin *jeeru*, mustard seeds *rai*, salt *loon*, red chilli powder *laal marcha*, coriander *dhania* ✓, garam masala *garam masalo*. Only coriander is a family clip; the rest are in engine. Cook needs the same clips, so they are shared.

### F. Make the bed (the bedroom's board; a stage 2 variant, 1b)

The bedroom (hide and seek's), eye level. The pillow, the blanket, Simba's toy mouse and Ali's teddy are on the floor. Nani: "The pillow goes on the bed. Simba's mouse goes under the bed." The only board where "under" and "on" share one anchor at the size of a bed; from L3 the pillow can go "this side" or "that side" of the bed's head (after Mum's answer). **Fun:** the blanket floats down and settles; Zazu immediately climbs in. **Levels:** L2 on, under; L3 this side, that side; L4 two things in one line. **Leak:** as B (every spot ringed; things that look natural on the bed, the pillow, also have a ringed "under" at all levels).

### G. The shoe rack (the hall; second visit)

The hall by the front door. A two-shelf rack; slippers and shoes in a heap. Tap a shoe, tap its mate (they set down as a pair), then tap a place: "Nana's slippers on the top shelf." **Words:** slippers, shoes (to record), top, bottom (to record), the owners ✓. **Leak:** pairs are matched by eye (the hand-and-eye part, not scored); the scored move is the place.

### H. The drawers (the kitchen; second visit)

Zafar's "drawers (cutlery)". Three drawers stacked, opened by a tap. Nani: "The teaspoons in the top drawer, the big spoons in the bottom one." Teaspoon *chamchi* ✓, tablespoon *chamcho* ✓; drawer, top, bottom, knife, fork to record. **Fun:** each drawer opens with a wooden slide and the cutlery clinks in. **Leak:** all drawers identical; spoons of two sizes (the look-alike).

---

## 4. The child's first-ever round, screen by screen (1a, L1)

1. **The house.** Hide and seek has just ended in the bedroom, the cats cuddled. Nani's bag and her cup lie on the bedroom rug where Simba knocked them. The camera pulls gently back out through the missing front wall, and the bedroom becomes one box of a doll's-house cross-section: the kitchen, the sitting room and the bedroom side by side. Simba and Zazu trot across. Before anything is asked, the camera drifts slowly along the rooms (showing what isn't on the card: two pairs of glasses on and under the kitchen table, two cups on and under the bedroom's bedside table).
2. **The ask.** The camera eases into the sitting room. Nana sits in his armchair, squinting at his newspaper held at arm's length. Nani stands beside him, on the right, and says one line: "Nana's glasses are under the table." The card pops up big (the glasses with an "under" badge, the Kutchi, the English), then flies into its row on the left. (If hide and seek dropped Nana's glasses, that pair is one of the two copies.)
3. **The room.** The camera pulls back to the house. Everything dims except the kitchen, which sits in a lit box with a gold glow. No finger, no ripple. The child taps it; the camera eases in, and Nani names the room ("the kitchen", once recorded).
4. **The thing (the one showing).** In the kitchen: glasses on the table, identical glasses under it, the ball on the counter. Because this is the first errand ever, the glasses under the table glow once (the rulebook's first-time showing). Tap: they hop up.
5. **The journey.** The camera pulls back. The glasses glide into the sitting room, each room glowing softly as they pass. Nana puts them on and his eyes go huge. "Aah." He shakes out his newspaper. Nani: "glasses" as the row ticks. (The showing ends here: from now on, the lit room guides the room, and nothing glows the copy.)
6. **The second ask.** Nani: "Nana's cup is on the table." The bedroom is lit. In it: a cup on the bedside table, a cup under it, Nani's bag on the rug. The child may tap the cup under the table first: it shakes, Zazu's nose pops into it, "mrrp", and Nani's line repeats. Then the cup on the table: it flies to Nana, who sips. "Aah." Tick.
7. **The third ask.** Nani: "The ball is under the table." The kitchen is lit; a ball on the table, a ball under it. The ball flies to Nana; he rolls it across the floor and Zazu pounces after it, chasing it out of the sitting room and all the way into the bedroom. Tick.
8. **Put it away.** The camera follows Zazu into the bedroom. On the rug: the ball, Nani's bag, Nani's cup. Nani stands on the right. "Put the ball under the table." The ball glows once (the first-time showing of a new action); tap it. Two identical dotted rings appear: on the bedside table, under it. Tap under: the ball rolls under and wobbles still; Zazu comes to sniff it. Tick. Then "Put the bag under the table": the bag settles beside the ball (the spot is never used up; the child still has two rings). Then "Put the cup on the table": a tiny clink. Tick.
9. **The end.** The camera pulls back to the house: Nana reading with his glasses on and his cup at his elbow; in the bedroom, the cup on the bedside table, the ball and the bag under it, Zazu curled up between them; Simba asleep on the bed. Nothing the child put away is back in anyone's hands. Nani: *shabash* ✓. "Aah."
10. **The shared two-page end screen.** Progress per word (glasses, ball, bag, on, table, each with its speaker), never a score that judges. It is the only word list.

About 3 minutes. No stage 3 or 4 in 1a.

---

## 5. Later visits and harder versions

- **1a, L2:** the room word joins as the second word (after Mum's model line, the frame gap); two anchors in stage 2. Level up by the first-go rule (override 1); never level down.
- **1b (after Zafar plays 1a):** Ma and Ali join, in their own voices if he chooses (open question 1); the hall and Ali's room; Simba's paw with the paw-tap, the swap and Zazu's theft; Tell Ali where; L3-L4 of stages 1 and 2; this side and that side once Mum has answered; the spice box and make the bed; the sock and the thread from hide and seek's tray; the thing for Ali.
- **Second visit (harder, new items):** the hall's shoe rack and the kitchen drawers; the teddy, the key and the book as things; next to, behind, in front of as placing words; left and right (*dabo*, *jamni baju*) after this side and that side, with Nani's place moving between ends to keep this side and that side alive alongside them.
- **Third visit:** the wardrobe (clothes words come from the sewing day: top shelf, hanging, bottom), "between" (*wich me*), and the past in the book ("it was under the bed").
- **Role reversal:** at the third visit, Tell Ali where becomes the whole put-away: Ali holds each thing and the child tells him where, from the bubble.
- **Waiting on decisions:** cupboards (decision 27); baby Isa, when the cast doc designs her; "behind the screen" (research-mechanics' barrier game: Ali arranges his room behind a curtain as the child describes theirs, then the curtain opens).

---

## 6. What it reuses and what is new

**Reuses:**
- `js/shared/rules.js` and `data/rules.json`: the one reader for levels, hint waits, the first-time showing, the word ladder and level-up. This game's four overrides (§3) go in that file as data, never as numbers in game code.
- `js/shared/whichone.js`: the decoy rule, `blindOdds` and `estimate`. The copies rule and the bot are a reskin of it (the copies are decoys of one noun, decided by place), not an extension of Find it's greybox bot.
- `js/shared/conversations.js`: `bubble` for every line (THE speech bubble in every game) and `run` for the L3 two-person exchange and Tell Ali where's watched model.
- `js/shared/rel.js` and `data/relations.json`: the relations checker, spots with relation tags, the board form (`Rel.check`, `Rel.options`). The 17 relations include in, on, under, behind, next-to, left-of, right-of, in-front, middle.
- Tidy's n-dots card rule (`docs/archive/modes/tidy-up.md` Q.1 rule 2) and its paw, swap and 4b forms; `js/tidy/mechanics/place.js`, `check.js`, `paw.js`, `tell.js`; `js/tidy/games/putaway.js`, `ali.js`, `box.js`; `js/tidy/bot.js`. Greybox: rebuilt onto the shared kit.
- `js/find/games/where.js`, `js/find/mechanics/where.js` (copies of one thing in several places); `js/find/blind.js`.
- Shared: `order-card.js`, `request-popup.js`, `guide.js`, `bulb.js` (the helper card), `onboard.js` and `focus.js` (the lit box, also the travel's glow), `word-card.js`, `results.js` (the end screen), `say.js` and `speech.js` (the speaking moment), `character.js` and `face.js` (the poses), `sfx.js`, `frame.js`, `fit.js` and `stage.js` (the layouts).
- Hide and seek's "for later" tray (a new shared element there, owned by the shared layer) is the carry's input.

**New to build:**
1. **The doll's-house view:** an overview of the rooms (three in 1a, five in 1b, from one drawing); a gentle eased zoom into one room (a cross-fade to that room's own background, same camera); slivers of the neighbours as the only navigation; the pull-back from hide and seek's bedroom.
2. **The travel:** a thing glides between rooms along the house's floor line, each room glowing as it passes (the shared lit-box glow; no light states).
3. **Copies across rooms:** WhichOne's copies across three to five rooms, with the reshuffle-after-fetch rule and spots that are never used up.
4. **The owner's use reaction:** Nana's "glasses on" pose (art); the cup and ball reactions are code moves of existing pieces.
5. **The order card's position badge** (L1 only): a small on/under badge on the thing's picture, so a row keeps one picture. A change to `js/shared/order-card.js`, sent to the shared-layer owner, not built in this game.
6. **Wire the positions to the lexicon:** `relations.json` says no relation has Kutchi; the lexicon has *mathe*, *niche*, *bajume*, *puthiya*, *andar*, *agiya*, *same* as confirmed postpositions. One data change, to the shared layer's owner.
7. **(1b) A speaker-relative relation:** "this side" and "that side" of an anchor, from the speaker's standing place; new ids in `relations.json`, the speaker's side an input to the bot. Only after Mum's answer.

**Where this design goes once Zafar says yes:** `docs/game-design/modes/pick-it-up.md`, with a row in the home day's file (which hide and seek's design starts).

---

## 7. Art and layout

### Camera (art bible §3)

- **The house and every room: E**, eye level, front on, a side-on cross-section with the front wall removed (as Monsoon rush's room cross-section). Horizon at about 55%. One-point perspective; verticals vertical. The floor shows a little depth, so "under the table" reads as a thing on the floor between the legs. Table and bed tops just visible, so things can stand on them.
- **The bedroom is hide and seek's drawing** (plus the bedside table), so the overview is made to match it, after it is locked.
- **Things in rooms: F**, front view about 10° down (shared with the pantry). Every thing that rests on a surface has a contact shadow drawn by code; nothing floats.
- **The spice box and the drawers: T**, straight down, their own scenes (as Cook's stations), with Nani's bust at the edge she stood at.
- **People: E**, three-quarter, cut at the hip in a room.
- **Light: day only.** No lights-on or lights-off states anywhere: the travel's highlight is the shared lit-box glow, and the swap's dark is the shared dim (code).

### The art list, 1a (one paste block, the overview locked first)

| Asset | Count | Notes |
|---|---|---|
| The house overview, front open | 1 | five rooms in a row (kitchen, sitting room, bedroom, hall, Ali's room), the bungalow of `h3-house-empty-wide-v1.png`, matched to hide and seek's bedroom; 1a shows the left three |
| The kitchen and the sitting room, full resolution, empty of loose things | 2 | crops and upscales of the overview, so camera and light match; the bedroom is hide and seek's |
| Anchors as separate layers | 3 | the kitchen table, the kitchen chair, the bedroom's bedside table (the bed is hide and seek's) |
| Things, F view | 4 | glasses, cup (reuse Cook's if it fits), ball, bag |
| Nana | 2 poses | seated three-quarter squinting at his newspaper; seated with his glasses on, eyes huge. The art bible's standing placeholder look (white knitted cap, round glasses, white beard, cream kurta, brown waistcoat) |
| Nani | existing | the locked sheet; hide and seek's standing three-quarter pose in a room |
| Simba and Zazu | existing | hide and seek's poses; plus Zazu pouncing and Zazu curled up |

**1b adds:** the hall and Ali's room in full; the sitting room's anchors (sofa, armchair, low table); Ma and Ali (asking, front-facing, using it); the teddy, key, book, sock, thread, pillow, blanket, mouse; Simba with a paw out and in glasses; the spice box (T) and the drawers (T) as scenes; the shoe rack.

**Restraint:** at most 1-2 cultural nods per room (an ajrakh cushion in the sitting room; a mirror-work frame in the bedroom, as hide and seek draws it), rotated between visits. The kitchen's cabinets and worktop are scenery, never ringed (decision 20).

### Layout

**Checked first in a lab page, before any art** (Zafar, 27 Oct: a lab page, the size check, then his choices): placeholder boxes for the rooms, the copies, the anchors, the rings, Nani and the card, at every level, shot by script at **740x320, 930x430, 1280x665 and 1920x1080** (his four sizes) plus **915x275** (the shortest phone). The card row is mocked at 740 with its longest Kutchi line, never clipped or ellipsised. Nothing below is "passed" until those shots are looked at.

**The switch:** `data/layout.json`: a short side under 500 px is a phone (740x320, 930x430, 915x275); a short side from 600 with an aspect up to 1.5 is a tablet; everything else, including heights 500-599, is the laptop layout (1280x665, 1920x1080).

**Phones:**
- The card column on the left, about 20% of the width (about 148 px at 740); nothing else on the left. At L1 a row is the thing's picture with its position badge, the Kutchi beneath it (wrapping, never ellipsised) and the English under that; from L2, the picture, the Kutchi and a speaker. One picture a row, not three.
- **The overview (1a, three rooms):** the house fills the play width: about 190 px a room at 740x320, about 245 px at 930x430. Rooms are the tap targets. Sky and lawn are trimmed to thin strips.
- **A room:** fills the play area; neighbour slivers 8% each side. The anchors sit in the middle third; rings at least 48 px. At L2 four rings round two anchors in about 590 px of play width. Nani or Nana stands on the right of the play area, cut at the hip, face fully inside the frame; no bubble crosses a face or the card column. From L3 (1b), Nani's two places are middle-left and right of the play area, never against the card column.
- The cog is the only button.

**Big screens:** the overview keeps the garden and sky; a room view zooms less (neighbours show at 15%), and things are drawn larger. The card column keeps its share of the width.

---

## 8. What it borrows from other games

- **My PlayHome:** the cutaway doll's house with rooms side by side, where every thing can be picked up. We add the goal its reviewers miss (Nani's asks).
- **Pepi House:** exploring rooms as the pleasure in itself (the slivers and the camera drifting through the house).
- **Toca Town:** carrying a thing from one place to another as the core joy; the thing turns up later (in the book).
- **Toca Life (City, World):** tap, then tap to carry.
- **A Little to the Left:** the cat that undoes your tidying (Simba's paw), and rules rather than one fixed answer.
- **Bluey: Let's Play!:** every thing picked up has its own small reaction.
- **House of Learning** (a preschool app made with a speech therapist): placing things in, on, under, next to and behind as the activity. Its maker says the learning comes when an adult models the words, which is Nani's job here.
- **Monki Detective** (via the research's lesson 6): moving the hiding places after every find (our reshuffle after every fetch).
- **The research on in, on and under** (Grieve and others, Lancaster): young children answer from context ("a cup goes in"), so our things sit happily in several places; and on is understood before under.

---

## 9. The lessons checklist

| Group | Verdict |
|---|---|
| 1. The heard word decides | **Pass, with four overrides.** One leak table (§3) with a won round defined (every move right first go): L2 under 0.1% a round, three level-up rounds under 0.0001%; the bot prints the real numbers. Level-up rests on first go and the hint counts from the last ask, so fishing can't climb (overrides 1, 2). The card's position badge at L1 only; the room picture never (override 3). Simba's card is n dots; nothing ticks on a wait. Identical copies, identical rings, spots never used up. **It doesn't teach until Mum's L1 list (8 clips) is in.** |
| 2. Onboarding and the first round | **Pass.** The first round is the tutorial (§4). The lit box guides the room at L1; one first-time showing each for the copy and the ring; no finger, no ripple. The opening drift shows the copies before the first ask. Tap, then tap; no drags. 3 rooms, 2 copies at L1. |
| 3. Instructions | **Pass.** Nani is on screen and speaks before the card. The card is what's wanted and never changes; the guide says the step. Three helps, one meaning each (§3). Bubbles belong to faces (Conversations). Model then ask: L3's exchange and stage 4's watch (1b). One line per moment. |
| 4. Pacing and waiting | **Pass.** No Next or Done: each errand moves on when Nana takes the thing. A tap during speech is kept (Simba's rows included). The guide's hint at 7-13 s from the last ask; the repeat every 8 s. No timers. Nobody waits for Nani's rows: no row ticks on a wait. **Watch:** the travel must be skippable by a tap (a tap lands it). |
| 5. Feedback and the end | **Pass.** A wrong spot: a shake, the line again, redone on the spot. Every miss has a different funny reaction. Rows tick when the step closes. It ends at the house with Nana's things in use and the put-away things where the child put them; the shared two-page end screen is the only word list. |
| 6. Layout | **Not yet.** The lab page at the five sizes and every level comes before any art (§7). The card row's badge goes to the shared-layer owner. |
| 7. Art and camera | **Pass on paper.** One camera per scene (E rooms, T boards). Nothing drawn in code but glows, dims and contact shadows. The bedroom is hide and seek's; Nani from the locked sheet; Nana as the bible's placeholder. 1a is about twelve pieces in one paste block, the overview locked first. |
| 8. Speaking | **Pass (1b).** Only stage 4, inside an exchange watched first. Closed sets of three, different first sounds; L4 is two turns of three. Pills always there, never a gate. The one shared moment. |
| 9. Levels | **Pass.** L1 one thing, one guided room, the position deciding, a clearly different decoy; L2 two words per move (room and position); L3 other ways of saying it; L4 a look-alike. Gestures never change. Level-up by the first-go rule, the number in `data/rules.json` (proposed). |
| 10. Words and recording | **Pass, with a counted list.** 8 clips for L1, 13 for 1a, about 43 for every visit plus 6 shared and the askers' voices (§1). The room-and-anchor frame is reported as a gap, not spliced. 5 new words in the first round. |
| 11. Culture | **Pass.** Halal; modest clothes; no religious markers; no sweets anywhere. Nothing a child could copy and get hurt by (no climbing; only cats go under things). |
| 12. Fun and delight | **Pass.** Something to do at every step. "Kind of funny": Nana's eyes, Zazu chasing the ball, Zazu's nose in the wrong cup, Simba in glasses (1b), the teddy head first (1b). Contrast: the whole house, then one room. Carries to the book. |
| 13. Mistakes made twice | **Watched.** Every level designed. The rules are written to be coded and the numbers sit in data. Tidy's n-dots rule reused, not re-broken. Nothing of Tidy's dropped without Zafar (decisions 25-27). One bedroom and one carry list for both home designs. The travel and zooms judged on film, not stills. |

**Ten questions:** (1) positions and things, 8 clips before L1 plays (§1); (2) the Sceptic picks copies and rings at 1 in 3 and 1 in 4 at L2, with no fewer choices as the round goes; (3) identical copies and rings; (4) the kitchen, then the glasses (§4); (5) Nani in 1a, the family in 1b, each in a built sentence; (6) tap a room, a thing, a spot at every step; (7) Nana's eyes, Zazu's chase; (8) back at the house, everyone with their thing, "aah", the end screen; (9) §3 ladders, L4 its own; (10) §7, the lab page at five sizes, one E camera.

---

## 10. Decisions made for Zafar overnight

Each line: the choice, the reason, the answer I assumed. Changed or new after the critique: marked *(revised)* or *(new)*.

1. **Two halves, fetch then put away, with different things** *(revised)*. Stage 1 fetches what Nana wants and he keeps it; stage 2 puts away what Simba knocked down in hide and seek and the ball Zazu chased into the bedroom. *Reason:* the old story had tidied things back in people's hands. *Likely yes.*
2. **One storey, five rooms in a row** (kitchen, sitting room, bedroom, hall, Ali's room), drawn once; 1a plays the left three *(revised)*. The bedroom's open door leads to the hall, as hide and seek draws it. That is your "4-5 rooms at most". *Likely yes.*
3. **Hide and seek and this game share one house and one bedroom drawing** *(revised)*: hide and seek's bedroom plus one small bedside table, which is an anchor here and scenery there; the overview is drawn to match. *Reason:* one drawing for both, so the claim that it halves the art is true. *Likely yes.*
4. **The thing flies to its owner,** who uses it, rather than a doll figure carrying it. Nothing drawn in code; no hands. *Likely yes.*
5. **L1: the room is guided and the position decides; L2: the room joins as the second word** *(revised)*. Copies at L1 are on and under one table in the lit room. *Reason:* the room names are new to the child and not yet recorded; on and under are inside Mum's lines and heard in hide and seek. *Likely yes.*
6. **"This side" is the side nearer Nani, but nothing is built on it until Mum confirms** *(revised)*. Grammar-notes §17 says the family point when they say *hi baju* and *hu baju*. Stage 2's L3 and the spice box wait for her answer; if she confirms, as designed; if not, they are redesigned with Nani pointing. *Likely yes.*
7. **On and under first, then this side and that side (after Mum), then next to, behind, in front, in; left and right only on a later visit.** Your own list was "on top of, underneath, left of, right of"; this side and that side before left and right follows Mum's advice you approved (idea 11, 26 Sept) and your scope of 1 Nov, so the swap was yours. *Likely yes.*
8. **Every spot gets an identical dotted ring, and spots are never used up** *(revised)*: things can share a spot, so every placement has every ring. *Likely yes.*
9. **A wrong spot: shake, the line again, try again; only a first-go right ticks the word's ladder, the badge and the level** (decision 21). *Likely yes.*
9b. **"No" asks at L3, not L2** *(new; rulebook override 4)*. L2's one new thing is the room. *Likely yes.*
10. **Simba's paw always happens in a room the child didn't arrange this round,** and the swap is its L3, with an ask: Nani says every row once; the card is two dots *(revised)*. *Likely yes.*
11. **The fold:** where is it?, bring me the X → stage 1; put it there → stage 2; Simba's paw, the paw-tap, the swap and Zazu's theft → stage 3; Ali's turn and Tell Ali where merge → stage 4; the masala dabba, make the bed, the shoe rack → room boards; the toy box → an anchor in Ali's room; cupboards → your choice (27). Nothing removed. *Likely yes (your 31 Oct "fold them in").*
12. **The sorting boards live here, not in clean-up day,** following the games map's R9 over the audit's earlier table. Clean-up keeps its single job, verbs. *Likely yes.*
13. **No speaking in 1a;** Tell Ali where in 1b from L2, after Nani models it twice, with sets of three *(revised)*. *Likely yes.*
14. **Nothing ships until Mum's L1 list (8 clips) is in** *(revised)*; L2 waits for the room words and the frame's model line. *Likely yes.*
15. **The things** *(revised)*: 1a: glasses, cup, ball (stage 1), ball, bag, cup (stage 2); 1b: Ali's teddy, the key, the book, the sock and thread; slippers later. Baby Isa waits for the cast doc. *Likely yes.*
16. **The first-ever round is stages 1 and 2 only, about 3 minutes.** *Likely yes.*
17. **Day light only, with no light states at all** *(revised)*: the travel uses the shared lit-box glow and the swap the shared dim. *Reason:* ten light states for a weak beat in daylight. *Likely yes.*
18. **The book gets a "where it was" page in 1a; the thing for Ali (his ball) joins in 1b with Ali** *(revised)*. *Likely yes.*
19. **The spice box and drawers use the top-down camera as their own scenes; Nani's side is shown by the eye-level kitchen before the zoom and her bust at that edge** *(revised)*. No sleeve (a sleeve at the bottom of a top view reads as the child's own arm). *Likely yes.*
20. **The kitchen has no fridge, sink or hob as anchors; its cabinets and worktop are scenery, never ringed** *(revised)*. Clean-up day and Cook own them. *Likely yes.*
21. **Level-up rests on first go** *(new; rulebook override 1)*: up after 3 rounds in a row with at most one move not right first go and the guide's hint at most once. Proposed `advance.games["pick-it-up"].maxNotFirstGo: 1`. *Reason:* otherwise a fast tapper never idles into a hint and climbs to L4 with no Kutchi. *Likely yes.*
22. **The guide's hint counts from the last ask, not the last tap** *(new; override 2)*. *Likely yes.*
23. **The card's position badge shows at L1 only; the room picture never shows** *(new; override 3, against the rulebook's L1-L2)*. *Reason:* at L2 a picture would be a picture match, a 100% win with no Kutchi. Hide and seek made the same choice. *Likely yes.*
24. **Simba's paw: the card is n dots, every row said in one form, nothing ticks on a wait, and a tapped thing lifts like any other** *(new)*. Tidy's rule, reused. *Reason:* the old auto-tick named the rows to leave. I did not add the critique's "happy wiggle" on a thing that holds: it tells a child who taps everything which rows hold, the same leak by probing. "Leave it be" is said at the close instead. *Likely yes.*
25. **Tidy's paw-tap is kept** as stage 3's opener in 1b (2 s to tap Simba's paw and save one thing) *(new)*. *Reason:* you never commented on it, so it stays. *Assumed: keep, 1b.* (Other answers: park it.)
26. **Tidy's Zazu's theft is kept** as stage 3's L4 in 1b, the past tense ("it was on the table") deciding *(new)*. *Assumed: keep, 1b.* (Other answers: a later visit, or park it.)
27. **Cupboards** *(new, a choice)*: (a) maybe later, as now (opening a cupboard is hide and seek's reveal); (b) with the drawers at the second visit, as shelves. *Assumed: (a).*
28. **1a and 1b** *(new)*: 1a is stages 1-2 at L1-L2, three rooms, four things, Nani the only voice, Nana the one receiver with two poses, no boards, no light states. 1b after you've played it. *Reason:* the research sized it small to medium; the old first visit was about fifty assets. *Likely yes.*
29. **Nani says every ask in 1a** *(new)*: "Nana's glasses are under the table." The askers' own voices and "my" wait for 1b (open question 1). *Likely yes.*
30. **The room words, one list for both home designs** *(new)*: kitchen, sitting room, bedroom (1a), the hall and Ali's room (1b). This game teaches them first (heard at L1, deciding at L2); hide and seek's whole-house visit reuses the same clips. *Likely yes.*
31. **The day's carry, one list** *(new)*: §2. Nana's glasses become a stage-1 copy; Nani's bag (hide and seek's purse, one word) is put away in stage 2; the sock and thread wait in the tray for 1b. Hide and seek's file should cite §2 once you say yes. *Likely yes.*
32. **The room-and-anchor frame is a gap, reported, not spliced** *(new)*. Mum records a model line ("Nana's cup is on the table in the kitchen"); L2 waits for it. *Likely yes.*
33. **A won round is every move right first go; one odds table, printed by the bot** *(new)*. *Likely yes.*
34. **Three helps, one meaning each** *(new)*: the free repeat every 8 s; the guide's hint at 7-13 s from the last ask (counts); the helper card only on a bulb tap (costs a bulb). *Likely yes.*
35. **The lab page before any art, at your four sizes plus 915x275; one picture a card row with a position badge (to the shared-layer owner); Nani on the right, and from L3 middle-left or right** *(new)*. *Likely yes.*
36. **The teddy is Ali's** *(new)*; baby Isa waits for the cast doc's design. *Likely yes.*

### Rulebook overrides (this game)

1. Level-up on first go (decision 21; proposed `advance.games["pick-it-up"].maxNotFirstGo: 1`).
2. The guide's hint from the last ask (decision 22).
3. The card's pictures at L1 only, and the room picture never (decision 23; the rulebook shows them at L1-L2).
4. "No" asks from L3, not L2 (decision 9b).

### Open questions (genuinely his; none blocks 1a)

1. **Who voices Nana, Ma and Ali in 1b?** "My glasses ..." needs the owner's voice. Cook's customers use Mum and you. *Recommended:* you for Nana and Ali (as in Cook), Mum or Masi for Ma; until then Nani says each ask, as in 1a.
2. **Mum's this side and that side:** does *hi baju* mean the side nearer the speaker, as stage 2's L3 assumes, or the side she points at? Ask her with a picture on the next sheet. Nothing is built on it before her answer.
3. **The room names** for the sitting room, the bedroom, the hall and Ali's room: which words does the family use (English loans are fine, like *table*)? Asked once for both home designs.

---

## 11. ChatGPT mock-up prompts

Attach the listed references to each prompt. Nani comes from the locked sheet and lineup; `nani-sheet.webp` is attached only for the render style, never her face. Nana is the art bible's standing placeholder; the customers sheet shows how generic family members are drawn. The cats follow the cast doc (Simba a big black Russian Blue, Zazu a grey Russian Blue drawn as a kitten, both with green eyes). One moment per frame.

### Prompt pick-it-up-put-it-back-1: the guided room and the two copies (stage 1, L1)

The image should show the house open like a doll's house, Nana squinting in the sitting room, and the kitchen lit with two identical pairs of glasses, one on the table and one under it. It explains L1: the room is shown, the heard position picks the copy. No L2 elements.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: a single-storey family bungalow in warm limewash cream with a flat roof, shown as a doll's house: the whole front wall has been removed so we see straight into three rooms side by side, like a cross-section, at eye level, front on, one-point perspective, verticals perfectly vertical. A thin strip of pale blue sky above the roof and a thin strip of green lawn below. From left to right: a calm modern kitchen with plain sage cabinets and a worktop along the back wall, and a small wooden table with one wooden chair standing clear in the middle of the floor; a sitting room with a cream sofa, a low wooden table and a wooden armchair; a bedroom with a pale-oak wardrobe, a window with an indigo block-printed curtain, a single bed with a patterned cover hanging to the floor, a low sage-green cupboard and a small pale-oak bedside table standing clear on the floor. Each room has a little floor depth so things can sit under the furniture. Each room is calm and uncluttered, with at most one cultural accent (an ajrakh-print cushion on the sofa, a small mirror-work frame in the bedroom).

The moment: in the sitting room, a grandfather sits in the armchair, turned three-quarters towards us, holding a newspaper at arm's length and squinting at it because his glasses are missing. He is a generic character drawn like the attached customers sheet: a white knitted cap, a white beard, a cream kurta and a brown waistcoat; he must not look like the older man in any real-family reference. In the kitchen, two identical pairs of round reading glasses: one pair lies on the small table, the other pair lies on the floor directly under the same table. A red-and-blue rubber ball sits on the worktop at the back. The kitchen glows: a soft breathing gold light outlines the kitchen's room box, and the other two rooms are very slightly dimmed. A big black cat with green eyes and a small grey kitten with green eyes trot across the sitting-room floor.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (limewash, pale oak, brass, cotton), soft contact shadows under every object. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere: none on the newspaper (show only soft grey blocks), the walls or any object.

Must read at phone size (about 740x320 pixels): each of the three rooms as its own box, the two identical pairs of glasses and which is on the table and which is under it, the grandfather's squint, and the gold glow on the kitchen.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png (the bungalow)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp (how generic family members are drawn)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp (how things are drawn)
```

### Prompt pick-it-up-put-it-back-2: put it away, every spot ringed (stage 2, L2)

The image should show the bedroom close up, Nani on the right, two pieces of furniture each with two identical rings, and a ball rolling into the spot the child tapped. It explains "every spot is ringed; the heard words pick one".

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: one room of a doll's-house cross-section, close up: a calm, modern bedroom in a grandmother's house, seen at eye level, front on, the front wall removed, a little floor depth visible. Limewash cream walls, a pale oak floor, a soft rug. Along the back wall, as quiet scenery: a pale-oak wardrobe, a window with an indigo block-printed curtain drawn closed, a low sage-green cupboard. In the room, well apart: a single bed seen side-on with a patterned cover hanging to the floor, left of centre, and a small pale-oak bedside table standing clear on the floor, right of centre. One small mirror-work frame on the wall, nothing else. Thin slivers of the neighbouring rooms show at the left and right edges. On the rug in the foreground lie a tan handbag and a plain white cup. On the right of the room, in front of an open door to the hall, stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. She is cut at the hip, turned three-quarters towards the room, smiling, hands relaxed at her sides (she is not pointing).

The moment: four identical soft white dotted rings: on top of the bed, on the floor under the bed at the hem of its cover, on top of the bedside table, and on the floor under the bedside table. The rings are all exactly the same size and shape. A red-and-blue rubber ball is rolling into the ring under the bed, and the cover's hem lifts a little as it goes. A small grey kitten with green eyes pads up to sniff the ball.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (pale oak, cotton, leather, rubber), soft contact shadows. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320, and as short as 915x275): the four identical rings, the ball going under the bed, the grandmother's face, the bag and the cup on the rug.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png (the grandmother: her identity)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png (her likeness and skin tone)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (the house's palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp (render style only, not her face)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
```

### Prompt pick-it-up-put-it-back-3: Simba's paw (stage 3, 1b, L2)

The image should show the cat caught in the act in the sitting room, with two things moved onto other real spots and the rest untouched, so Zafar can see that nothing on screen says which things moved.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: a sitting room in a doll's-house cross-section, eye level, front on, the front wall removed, a little floor depth visible. A cream sofa on the left with one ajrakh-print cushion, a low wooden table in the middle, an empty wooden armchair on the right. Limewash cream walls, pale oak floor, calm and uncluttered. Slivers of the neighbouring rooms at the edges.

The moment: a big black cat with bright green eyes and a small silver bell on his collar stands on the sofa with one front paw still raised mid-swipe and a cheeky, guilty face, a pair of round reading glasses sitting crooked on his nose. Around the room, four things, each sitting neatly in a real place as if placed there: a tan handbag on the low table, a small teddy bear under the low table, a red-and-blue rubber ball on the armchair seat, a plain white cup on the floor under the armchair. Nothing is on the floor loose, nothing is tipped over, nothing is broken.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (cotton, leather, oak), soft contact shadows. The cat is funny and charming, never naughty in a mean way. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320): the cat's face and raised paw, the glasses on his nose, and each of the four things and where it is.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg (palette and light)
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png (how animals are drawn)
```

### Prompt pick-it-up-put-it-back-4: the spice box (the kitchen's board, 1b)

The image should show the boards' different camera: straight down on the round spice box, the middle bowl just filled. No person and no hands: the game places Nani's bust at one edge in code, so the bottom strip stays plain.

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: seen exactly from straight above (90 degrees, no horizon, no back wall), a warm white marble worktop with faint veins fills the frame edge to edge. In the centre sits a round polished steel spice box with its lid off to one side: seven small identical steel bowls inside, one in the middle and six in a ring around it. Above the box, a neat row of seven small heaps of whole and ground spices on little steel saucers: golden turmeric, brown cumin seeds, black mustard seeds, white salt, red chilli powder, green-brown coriander seeds, dark brown garam masala. The bottom fifth of the frame and both side edges are plain worktop with nothing on them. No people, no hands, no sleeves anywhere in the picture.

The moment: the middle bowl has just been filled with turmeric, and a small soft golden puff of powder rises from it. The other six bowls are empty and identical. Nothing glows.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (brushed steel, marble, matte powders, glossy seeds), soft contact shadows. Near-orthographic: the bowl rims read as circles, not ovals. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere, including on the spice box.

Must read at phone size (about 740x320): the seven bowls and which one is the middle, the seven spices as seven different colours, the turmeric in the middle bowl.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg
```

---

## 12. Changes after the critique

The critique (`pick-it-up-put-it-back-critique.md`, 1 Nov) had 6 MUSTs and 9 SHOULDs. All MUSTs were applied, and all SHOULDs, with one detail of MUST 4 changed (row 4). One constraint of tonight's task beat the critique: I edit no other file, so the `data/rules.json` number (MUST 1) and hide and seek's citation of the carry list (MUST 3) are written here as proposals, not made. Nothing in the critique clashed with Zafar's recorded word: his copies, his "every spot outlined", his "this side and that side" (kept, ordered after Mum's answer), his fold and his rooms all stand.

| # | Finding | What I did |
|---|---|---|
| 1 | **MUST.** A child levels up by fishing: the level ignored first go and a tap reset the hint timer. | Level-up rests on first go: at most one move a round not right first go, the guide's hint at most once, 3 rounds in a row (decision 21, override 1). The hint counts from the last ask (decision 22, override 2). The number is proposed as `advance.games["pick-it-up"].maxNotFirstGo: 1` for the game and the bot (§3, §6); not added tonight. §3 A's leak test, §5 and §9 rows 1 and 9 match. |
| 2 | **MUST.** The card's room and position pictures at L2 were a picture match; the design and the rulebook disagreed. | One rule: the position as a badge on the thing's picture at L1 only; the room picture never (at L1 the lit box guides the room); from L2 the thing, the Kutchi and a speaker (decision 23, override 3). §3 A, §3 B, §4 step 2 and §9 now say the same. |
| 3 | **MUST.** The first round was unplayable (one anchor, spots used up) and its story contradicted itself; it ignored hide and seek's handover. | Spots are never used up: a second thing settles beside the first, so every L1 placement has two rings and every L2 placement four (decision 8). The halves now have different things: Nana keeps what is fetched; stage 2 puts away what Simba knocked down in hide and seek and the ball Zazu chased into the bedroom (decision 1). The end scene shows nothing back in anyone's hands. A new §2 "The day's carry" is the one list both designs cite (decision 31); hide and seek's file should point to it once Zafar says yes. |
| 4 | **MUST.** Simba's paw leaked by waiting: the card listed every row and a holding row ticked after 3 s. | Tidy's rule reused: the card is n dots, never the rows; nothing ticks on a wait; Nani says every row in one form, in a random order, and a tap during her rows is kept. **Changed one detail:** the critique's "happy wiggle" on a thing that already holds is not added, because a child who taps every thing would learn which rows hold, the same leak by probing. A thing lifts like any other, and "leave it be" is said at the close, after the judgement (decision 24). Moved things always land on a real spot, so the scene doesn't say which moved either. |
| 5 | **MUST.** L1's deciding word (the room) was untaught and unrecorded; 8 new words in round one; the recording list was undercounted; the fetch frame was a splice. | (a) At L1 the room is guided (the lit box; Nani names it on arrival once recorded) and the position decides between copies on and under one table; the room joins at L2 (decision 5). (b) Nani says every ask in 1a (decision 29). (c) A counted table "What Mum records for L1 to play": 8 for L1, 13 for 1a, about 43 for the whole design plus 6 shared with hide and seek and about 10 in the askers' voices (§1). The first round teaches 5 new words. (d) The splice is gone: L1 uses the grammar notes' own "where" frame; the room-and-anchor frame is reported as a gap and asked of Mum as one model line (decision 32). (e) One list of room words for both home designs, this game recording them first (decision 30). |
| 6 | **MUST.** The prompts attached the placeholder Nani, invented a second Nana, mixed L1 and L2, and prompt 4's sleeve would read as the child's arm. | Prompt 2 attaches `sheet-nani-final-1.png` and `lineup-v4-1.png`, keeps `nani-sheet.webp` for render style only, and describes her as the bible does (plain red dupatta, no rings). Nana is the bible's placeholder (white knitted cap, white beard, cream kurta, brown waistcoat) with the customers sheet attached. Prompt 1 is one L1 moment (the lit kitchen, two glasses on and under one table, no bags). Prompt 4 has no person, no hands, no sleeve and no glow; §3 E says how the board shows Nani's side (the eye-level kitchen before the zoom, then her bust at that edge). Prompts 2 and 3 also follow the new design (the shared bedroom; moved things on real spots) and the cast doc's cats. |
| 7 | SHOULD. The first visit was far too big. | Split into 1a (stages 1-2, L1-L2, three rooms, four things, Nani the only voice, Nana the one receiver with two poses, no boards, no light states, about twelve art pieces) and 1b after Zafar plays it (Ma, Ali, voices, Simba's paw, Tell Ali where, L3-L4, the boards). Isa waits for the cast decision. Open question 1 and decisions 4, 17 and 19 apply to 1b where they concern it (decision 28). |
| 8 | SHOULD. "This side" and "that side" were built on a meaning Mum hasn't confirmed. | Nothing is built on it before her answer: stage 2's L2 is on and under with two anchors; this side and that side move to its L3 in 1b, with next to and in front of as the fallback; the spice box waits too (decision 6, open question 2). |
| 9 | SHOULD. The leak numbers didn't say what they claimed; "win" was undefined. | A won round is every move right first go. One table in §3 with the odds per level, a won round, a level-up round and three in a row; L1 is stated as the supported level; the bot prints the real numbers (decision 33). |
| 10 | SHOULD. Simba's paw dropped Tidy's paw-tap and Zazu's theft unasked; the swap had no ask. | Both kept, in 1b, as decisions with other answers listed (25, 26). The swap now has its ask: Nani says every row once in a new order, the card is two dots, a wrong pair can be swapped back. |
| 11 | SHOULD. Three hint stories were one again. | One paragraph, "The three helps" (§3): the free repeat every 8 s, the guide's hint at 7-13 s from the last ask (counts), the helper card only on a bulb tap (decision 34). Every stage's "Waiting" line points to it. |
| 12 | SHOULD. The phone layout was asserted, not checked; the card row wouldn't fit. | A lab page with placeholder boxes before any art, shot by script at Zafar's four sizes (27 Oct) plus 915x275, every level; the card row mocked at 740 with its longest Kutchi; one picture a row with a position badge, sent to the shared-layer owner as a change to `order-card.js`; Nani on the right, and from L3 middle-left or right; the switch named as the data's 500, with heights 500-599 in the laptop layout (§7, decision 35). §9 row 6 now says "not yet". |
| 13 | SHOULD. The speaking set was too small at L2 and too big at L4. | L2's set is three (on, under, behind: different first sounds; behind comes from hide and seek); L3's is under, behind, in; L4 is two turns, the position then the anchor, each from three (§1, §3 D). |
| 14 | SHOULD. Reuse missed; one-house claim untrue; overrides not recorded. | §6 names Rules, WhichOne (the copies and the bot are its reskin), Conversations (bubbles and the exchange) and Tidy's n-dots rule. One bedroom drawing for both designs: hide and seek's, plus a bedside table (decision 3, §2). A "Rulebook overrides" list ends §10. |
| 15 | SHOULD. Small things. | Cupboards are a numbered choice (decision 27). The ten light states are gone; the travel uses the lit-box glow (decision 17). The teddy is Ali's; Isa waits (decision 36). The kitchen's cabinets are scenery, never ringed, in decision 20 and prompt 1. The end screen lists the round's five words and is the only word list. Decision 7 says the this-side-first order was Zafar's. §6 says where the design goes once he says yes. |

---

Sources from the web search (1 Nov): [House of Learning, App Store](https://apps.apple.com/app/id452080937); [Constructing favourable conditions for measuring the young child's understanding of in, on and under (Lancaster)](https://eprints.lancs.ac.uk/id/eprint/54063); [Spatial prepositions in toddlers' online processing (NSF PAR)](https://par.nsf.gov//servlets/purl/10534393); [Teaching spatial concepts to preschoolers (freeslp)](https://freeslp.com/?p=179399).
