# Tidy up: design (mode 3, core verb *arrange*)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar. Nothing built. Follows `docs/modes/MODE-DESIGN-BRIEF.md`; builds on `docs/game-modes-v2.md` (mode 3), `docs/find-it-design.md` (the model and the shared scene relations), `docs/cook-with-nani-phase-a-design.md`, `docs/cook-with-nani-kutchi-audit.md` and Zafar's Wave 5 notes in `docs/cook-with-nani-todo.md`.
**Placeholder rule:** Kutchi here is limited to what is already in `data/content.json` and `data/cook.json` (food nouns, numbers 1–10, *Muke hikdo {x} dine*, *Ne {x}*, *Ne poi {x}*, *Arre re!*, *Hedo!*, *Ghan*, *Aabhar aanjo*, *Achija*). Everything written `[EN: …]` has no Kutchi yet and shows in the game as a grey italic English placeholder. **No Kutchi is invented.** Positions follow the noun (Roadmap syllabus), so rows are written `{item} {anchor} [EN: rel]`.

---

## 1. Pitch and core loop

**Pitch.** Nani's house is always about to receive someone: guests tonight, the Eid box to repack, a wedding photo to take. Tidy up is where the player **makes a place right by following what Nani says**: lay the dastarkhwan, pair and line up the shoe mountain, repack the sweet box, put the shopping away. It exists because syllabus stage **S2 (Do as Nani says)** needs a game where *position phrases, colours and sizes decide where things go*, and later **S6** needs *comparatives* ("the bigger one nearer the door"). Its hits are *A Little to the Left* (rule-based tidying, a cat that messes it up) and *Unpacking* (calm placing, a check at the end, the story told by objects). Where Cook **builds** a dish with gestures and Find it **searches** for one thing that already exists, Tidy up **produces an arrangement**: the answer isn't *which one* or *what next*, it's a *layout* that must satisfy every spoken rule at once.

**The loop (one board, 1–3 minutes).**
1. **Intro card** (Wave 5): Nani's face and her rows, one line per rule, then it shrinks into the sidebar. 3 s of silence while the player looks.
2. **The mess.** Items sit on a carried tray, in a heap, or scattered by Simba. The surface has more free spots than items, and they all look alike.
3. **Arrange.** Tap an item (it lifts and follows the finger), tap a spot (or drag; both work). Anything can go anywhere; nothing is refused or snapped to the answer.
4. **Done.** The player presses *Done* (the broom button). Nani checks **rule by rule** (the *Unpacking* end check, Cook's chaat-bowl check): each item named hops and ticks as she says its row. At the first wrong one it wiggles, she recasts (*Arre re!* what it is now … what she asked), and **the player moves it** (a prompt, never an auto-move). She then carries on.
5. **Reward.** Stars fill, pocket money, the **word review** (Kutchi → English), and the arranged place appears in the hub (the laid cloth, the shoe rack, the box on the island).

**How it differs from the other modes.**

| | Cook | Find it | **Tidy up** |
|---|---|---|---|
| Verb | Build (gestures in sequence) | Search (scan, tap one) | **Arrange** (place many things into one layout) |
| What the Kutchi decides | What goes in, how many, order, for whom | Which one exists, where it is | **Where each thing goes, relative to people, anchors and each other; which class goes where; how many per place** |
| Graded | During, per step | Per tap | **At *Done*, per rule, on the whole layout** (several layouts can be right) |
| Feel | Tactile juice, timing | "Found it!" | **Calm order out of chaos**: the click of a thing put right, the finished table |
| Syllabus | S1, S2 verbs, S5 first/then | S1, S2 positions and colours (recognising) | **S2 positions, colours; S3 sizes, kinship; S6 comparatives** (applying them) |

---

## 2. Research summary

### 2.1 What we borrow from which game

| Reference | Concrete mechanic | Why it works | What we take | What we refuse |
|---|---|---|---|---|
| *A Little to the Left* (Max Inferno, 2022; 92% positive of 10k+ Steam reviews) | 100+ short tidying puzzles: sort by height, pair, stack, align. **Many puzzles accept several solutions** (sort books by height *or* width) | The player reasons, rather than guessing the designer's single answer | **Grade rules, not slots.** A layout passes if every spoken rule holds; anything unsaid is free | — |
| *A Little to the Left*: the cat | A paw sweeps in and knocks things; you can tap it away in time | Tension and comedy inside a calm game; mirrors real life | **Simba's paw** (a twist, M11); Zazu steals one item | The cat never targets correct items only (that would mark them right) |
| *A Little to the Left*: hints | A **scratch-off** hint: rub away as much of the solution sketch as you want. "Let it be" skips a puzzle | Help is graded by how much you take | A hint ladder where each rung costs more (section 6.2); *Let it be* = leave the board, keep coins for helping | Its placement feedback: **a tone that rises as you near the target, and the item straightening when hovered over a valid spot** (added in its v1.1). For us that is "the target zone tells you the answer": banned |
| *A Little to the Left*: Daily Tidy | One new puzzle a day; the devs hoped it would join players' morning routine | A tiny ritual (Wordle-sized) | **Nani's daily tidy** (60–90 s, the weakest words) for Farah |
| *Unpacking* (Witch Beam, 2021) | No timer, no score. Items go anywhere while unpacking; **only at the end** do misplaced items pulse with a red outline, and you fix them before the star | Freedom while playing, a clear check at the end; no "right decision" anxiety mid-level | **Check at *Done*** (from level 2), items flagged one at a time with Nani's recast, the player fixes them | Colour-only flags (accessibility: we also wiggle and speak) |
| *Unpacking*: sound | **14,000 foley files**: every item recorded being placed on every surface; shared sounds "broke immersion" | The tactile pleasure is mostly audio | A placement sound per **item material × surface material** (cloth, wood, steel, enamel, cardboard): ~6×5 recorded sets, not 14,000 | — |
| *Unpacking*: stickers and story | Hidden achievements for odd interactions; a whole life told through belongings | Curiosity; objects carry story without text | **Nani's little secrets** (hidden playful interactions per scene, an album); the family's story in the objects (Nana's cap, Big Ma's reels, Simba's bell) | — |
| *Goods Sort*, *Match Factory* (triple-match sorting) | Drag goods onto shelves; three alike clear with a pop | Chaos into order; the "click" | The clear-and-pop **juice** when a rule's group is complete (e.g. a pair of shoes sets down together) | **The match rule itself**: you can win it by matching shapes without a word (fun analysis 3.4; v2 "avoid physics piles") |
| *Cats Organized Neatly* | Fit odd-shaped cats into a grid | Spatial constraint satisfaction | The sweet box as a small packing grid where Kutchi sets *which, how many, where* | Pure shape puzzles (no language) |
| *Good Pizza, Great Pizza* | Orders become riddles ("no red", "half and half") | Interpreting the request **is** the puzzle | **Nani's rules** (M10): class rules and negatives ("all the red ones on the rack", "nothing next to the door") at higher levels | — |
| Toca House (Toca Boca) | 19 chore mini-games as a digital toy; no fail state | Safe for a 5-year-old; chores are fun when tactile | Explore mode: in free play, placing anything reacts (cushions puff, plates clink); warm failure everywhere | — |

### 2.2 Language-learning evidence

| Finding | Source (one line) | Design consequence |
|---|---|---|
| **TPR** suits prepositions and spatial concepts: learners understand "on, under, behind, next to" by physically placing objects; commands progress from simple to prepositions and adjectives | [BYU Methods of Language Teaching, TPR](https://methodsoflanguageteaching.byu.edu/total-physical-response); [TPR for young learners (ResearchGate)](https://www.researchgate.net/publication/349697520_The_Effectiveness_of_Total_Physical_Response_TPR_on_Teaching_English_to_Young_Learners) | Every row is a command you carry out by placing; rows recombine known nouns with new relations |
| **Enactment helps memory for instructions:** children 7–9 recall instruction sequences better when they carry them out at presentation and at recall | [Jaroslawska, Gathercole et al., PMC5085979](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5085979/) | Multi-row boards are a good fit; the Done check has the player *fix* (enact) rather than watch |
| **Acquisition order of spatial terms is stable across languages:** in, on, under, beside first (about 2); then between, in front of, behind; left/right last | [Johnston and Slobin 1979 (J Child Lang)](https://www.cambridge.org/core/journals/journal-of-child-language/article/abs/development-of-locative-expressions-in-english-italian-serbocroatian-and-turkish/245C34A6486D190318BD08BF9D49EF1B); [Cox 1981](https://dx.doi.org/10.1177/016502548100400304) | Relations unlock in that order by level (section 6.1) |
| **Left/right** labels come at 6–7, first on one's own body; on people facing you only at 8–9; half of 11-year-olds still slip | [Boone and Prescott 1968](https://doi.org/10.2466/pms.1968.26.1.267); [PubMed 7899010](https://pubmed.ncbi.nlm.nih.gov/7899010/) | Left/right only from level 2, always **the player's own left/right** (never Nani's, never a guest's); landmarks ("next to the door") at level 1 |
| **Comparatives:** children (3–9) are best with "bigger/longer", worse with "smaller/shorter" (they build bigger); "taller" emerges gradually | [Ferry et al. 2025, Child Development](https://pmc.ncbi.nlm.nih.gov/articles/PMC11868677/) | S6 comparatives come in pairs (bigger **and** smaller asked equally), so a child who defaults to "bigger" is caught and recast |
| **Gesture reduces mapping difficulties** in learning spatial language, depending on the complexity of the relation | [PMC11849910](https://pmc.ncbi.nlm.nih.gov/articles/PMC11849910/) | Stage-1 teaching: Nani's hand demonstrates the relation with a *different* item (never the target), section 6.3 |
| **Picture dictation / listen-and-arrange** is a standard young-learner listening task for prepositions | [British Council, Picture dictation](https://www.teachingenglish.org.uk/teaching-resources/teaching-primary/activities/level-2/picture-dictation) | The board *is* a picture dictation; the recast is the teacher's check |
| **Barrier games** (one describes, one arranges) train referential communication; gains held 7 months later | [ASHA, barrier game format](https://pubs.asha.org/doi/10.1044/jshd.5401.33) | Role reversal (M12): the player instructs Ali |
| Prompts beat recasts; spaced retrieval beats massed | Already cited in `find-it-design.md` (Lyster and Saito 2010; Fritz et al. 2007) | Recast, then the player fixes; rows lean on due words |

**Blocked pages.** gamedeveloper.com, mcvuk.com, shacknews.com, witchbeam.com.au and Wikipedia were blocked by the proxy; their points above come from search summaries. Other sources: [Unpacking red outlines (Checkpoint Gaming)](https://checkpointgaming.net/reviews/2021/11/unpacking-review-home-sweet-home/); [14,000 foley files (A Sound Effect)](https://www.asoundeffect.com/unpacking-game-audio/); [ALttL v1.1 placement feedback devlog](https://maxinferno.itch.io/a-little-to-the-left/devlog/179241/update-v11-more-guidance-for-placement-puzzles); [ALttL cat paw (TheSixthAxis)](https://www.thesixthaxis.com/2022/06/09/a-little-to-the-left-is-a-game-about-home-organisation-with-a-cat/); [ALttL Daily Tidy (GoNintendo)](https://gonintendo.com/contents/12096-a-little-to-the-left-devs-hope-the-game-s-daily-tidy-feature-becomes-part-of-players); [Unpacking stickers (Switchblade Gaming)](https://www.switchbladegaming.com/cozy-games/unpacking-guide/); [Toca House (Common Sense Media)](https://www.commonsensemedia.org/app-reviews/toca-house); [Cats Organized Neatly (TechRaptor)](https://techraptor.net/gaming/reviews/cats-organized-neatly).

---

## 3. Mechanic library

**One engine.** Every mechanic is a **board** (a surface with anchors and spots) plus **rules** (rows). A rule is data: `{item, rel, anchor}`, or a class, count, order or negative rule (section 8.1). Mechanics differ by board, rule types and hand skill, the way Cook's recipes differ by stations.

**Universal leak guards (apply to every row below; the rows only list what's specific).**
- **G1 Spots all look the same:** uniform faint dots shown only while an item is held; no shaped gaps, no outlines per item. At least *items + 3* free spots.
- **G2 No hover feedback:** nothing straightens, glows, snaps or chimes differently over a right spot (the *ALttL* v1.1 leak).
- **G3 Rows shuffled; tray shuffled;** the tray order never matches the row order. "No X" rows look like the others and sit at random.
- **G4 Convention fails:** the generator rejects any board where the conventional layout (cups by plates, shoes paired by the door, box filled top-left first, tallest at the back) satisfies every row.
- **G5 ≥3 options per row** under all the other rows (no row forced by elimination); ≥3 people or anchors of the named kind.
- **G6 Extra items:** the tray holds items that aren't in any row (free to place or leave) and, from level 2, "leave it" items.
- **G7 No picture, swatch, tint, face or digit on a row** (a digit only while that number word is at stage 1–2, as in Find it).
- **G8 Check costs:** at level 1 (live check) a wrong placement costs that row's ear star; from level 2 nothing is checked until *Done*.

Scores 1–5.

| # | Mechanic | How it plays | Fun | Forces Kutchi: the decision · leak risks → design-out | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **M1** | **Lay the dastarkhwan** | Guests sit on cushions behind the cloth (plus empty cushions). A tray of tableware. Rows: `{cup} {Nana} [EN: in front of]`, `[EN: red] {plate} [EN: in the middle]`, `{jug} {plate} [EN: next to]` | **5** The finished table is the Arc 1 set piece; clinks, a wobbling stack, guests react | **5** *Which item goes to which person or anchor, which colour, which side.* Risks: faces on rows (Cook's chai-tray "who" leak); cup colours matching guests' clothes; conventional layout; exactly one cushion per item. Out: no faces on rows (intro card shows only Nani); colours and clothes decorrelated; ≥1 empty cushion; G4 | **5** No other mode arranges a whole layout for people | **Arc 1 Ch1 errand 3** (the Roadmap's planned "Put it there"); Eid breakfast (Ch5); Arc 2 feast seating | **4** Guests, seats, colours and rules re-rolled every time; Busy "guests at the door" clock; Simba |
| **M2** | **Put the shopping away** | After the bazaar (or free play), the basket's contents go into the pantry, fridge, fruit bowl and spice cupboard. Rows: `santra [EN: top shelf] [EN: on]`, `{bowl} bo limu`, from level 3 class rules `[EN: all the fruit] [EN: in the basket]` | **3** Calm, satisfying; the pantry visibly fills | **5** *Which noun goes where.* Nouns are **real Kutchi today** (fruit, veg, spices). Risks: pantry gaps shaped like items; categories obvious by convention (fruit in the fruit bowl). Out: G1; conventions broken by Nani's reason of the day ("the bowl is for the guests: only santra and kelo in it"); look-alike groups on the same shelf | **3** It's the Game Design doc's "put the shopping away" recall step, turned into a placement game; overlaps Find it's end recall (Find it *asks back*; Tidy up *files away*) | Arc 1 Ch1 after the bazaar; Arc 3 "bring it inside"; Arc 5 the farm ("mangoes up, groundnuts down") | **4** Any Find it basket feeds it; the pantry is the long-running food container (Roadmap) |
| **M3** | **Shoe mountain** | A heap of guests' shoes by the door. Pair them (hand skill), then place pairs by rule: `[EN: black] {sandals} {rack} [EN: on]`, `[EN: small] {shoes} [EN: next to the door]`, level 2+ `[EN: on the left]` | **4** Pairing a heap is instantly satisfying; the tidy rack in the hub | **4** *Which pair goes where, by colour, size, kind, side.* Risks: left/right 50/50; "pairs by the door" convention; the one small pair is obvious. Out: 3+ destinations (mat, rack top, rack bottom, slipper basket, next to the door); ≥2 pairs share each colour and each size; left/right only from level 2 with a middle option | **4** Pairing plus sorting is its own feel | **Arc 1 Ch2 "Knock knock"** (the complication "shoes everywhere") | **4** Guest count, shoe kinds, colours; Zazu runs off with one shoe (bring it back) |
| **M4** | **Repack the sweet box** | The open box (a grid of 9–16 cells), a plate of mixed mithai. Rows: `trae {jalebi} [EN: top row]`, `[EN: in the corners] {ladoo}`, `{barfi} [EN: in the middle]`, `[EN: no] {peda}` | **4** A gift box made perfect; *Cats Organized Neatly* fitting; the lid closes with a ribbon | **5** *Which sweet, how many, which cells.* Risks: cells = sweets needed; the round ending at the count; the one leftover sweet type = "no X". Out: cells > sweets needed; plate holds more of every kind than any count; *Done* only; "no X" drawn from any kind on the plate; digits per G7 | **4** Counting *into positions* is unique (Cook counts into a pot; Find it counts into a basket) | **Arc 1 Ch3 "The cat and the sweets"** (repack after Find it and Who did it?); Arc 2 wedding sweets | **4** Box sizes, patterns, Eid and wedding boxes (collectible box designs) |
| **M5** | **Place the pattern** (mehndi, quilt, bunting) | A canvas: a palm (the A3 hand as the canvas), the quilt grid, or a bunting string. Pieces (flower, dot, leaf; coloured patches; flags) go where said: `[EN: flower] [EN: on the left hand]`, `[EN: red] [EN: then] [EN: blue]` along the string | **4** Making something beautiful; Maryam's favourite | **4** *Which piece, where, in what colour order.* Risks: symmetry conventions (both hands alike); the pattern completing itself. Out: rows break symmetry on purpose; every piece placed by hand; spare pieces | **3** Borders on Dress up ("style"): we keep it because it's **placing parts to relations**, not choosing an outfit. Flagged for the orchestrator | **Arc 2 Ch3 "Mehndi night"** (the Roadmap's "flower on the left hand, dots on the right"); Arc 2 Ch4 the gift quilt (the blanket quest's patches); Arc 1 hub beats (hang the Eid bunting) | **4** Canvases × pieces × colours; each finished quilt patch is kept |
| **M6** | **Line up** (seriation and comparatives) | Pots, glasses, cushions or animals in a row: `[EN: biggest first] {door} [EN: from]`; `{pot} {jug} [EN: bigger than] … [EN: next to]` | **3** *ALttL*'s most common puzzle type; tidy rows | **3** *Direction and attribute.* Risk: seriation is visually obvious, so only direction (2) and start end (2) are decisions = 25% guess. Out: never alone; always with 2+ other rows; both "bigger" and "smaller" frames (Ferry 2025) | **4** Only mechanic about *ordering by degree* | Arc 3 (sort the pots before the rain); **S6 Arc 5** | **2** Few variations on its own; best as a row type inside other boards |
| **M7** | **The family photo** | People (existing character sprites, E view) onto a bench and the row behind it: `{Nana} [EN: in the middle]`, `{Ali} {Nani} [EN: behind]`, `[EN: the tallest] [EN: on the right]` | **5** The finale; everyone's in it; the photo is kept | **5** *Who stands where, by kinship and comparatives.* Risks: "tall at the back" is photo convention; kinship shown by the faces (fine: the face is the meaning) but the *word* must pick the person. Out: comparative rows flip ("the youngest at the back so he can stand on the bench"); ≥4 people; spare places | **5** Arranging people, not things | **Arc 5 finale "The family photo"**; Arc 2 wedding photo (early, kinship only) | **3** Different people and rules; the photo album |
| **M8** | **Into the shed** (evening pens) | The calm version: goats, hens and chicks to their places for the night: `bo {goats} [EN: left pen]`, `{chicks} [EN: in the basket]`, `[EN: the big hen] [EN: on the perch]` | **3** Cute animals, bedtime calm | **4** *Which animal, how many, which pen.* Out: pens > animals' groups; counts not capped | **3** The **rush** (animals fleeing the rain) belongs to **Monsoon rush**; this is the calm sorting after it. Scene and animal data shared | Arc 3 Ch3 "The animals" | **3** Animal counts and pens; the chicks hide (a Find it hand-off) |
| **M9** | **Put it back** (past tense) | After a search or Simba's chaos, Nani says where things *were*: `{cup} {shelf} [EN: was on]`. Put everything back | **3** Restoring a room you saw | **4** *S5 past tense decides*, plus position. Risk: the player remembers where it was visually (memory, not Kutchi). Out: the "before" is never shown in this round (it's a room from Nani's memory, not the player's) | **3** Overlaps Who did it? on the "what happened" side | **Arc 4** "Following clues": the ring search leaves the room in a mess | **3** Any scene after any Find it round |
| **M10** | **Nani's rules** (riddle rows) | A row type, not a board: class rules and negatives: `[EN: all the red ones] {rack} [EN: on]`, `[EN: nothing] {door} [EN: next to]`, later `[EN: because]` | **4** The *Good Pizza* riddle "aha" | **5** *Rules over sets* need the colour/size/kind word and the negative. Risk: "nothing next to X" is satisfied by doing nothing. Out: always paired with placement rows that need that area | **4** Grammar-heavy, higher levels | S3–S6 across arcs | **5** Rules combine endlessly |
| **M11** | **Simba's paw** (twist) | Mid-board, a paw sweeps a random strip and knocks 2–3 things, or Zazu carries one off (tap in time to stop it: hand skill) | **4** Comedy and a little tension (*ALttL*) | **3** Adds no new decision; **re-tests** rows after a delay. Risk: the paw hitting only correct items marks them right; Nani replaying the row for a knocked item maps row → item. Out: the paw strip is random; nothing is auto-replayed | **4** The house cats' running gag | Arc 1 Ch3 (the cat and the sweets), free play | **4** Any board, any level from 2 |
| **M12** | **You tell Ali** (role reversal) | You can see where things must go; Ali can't. Build each instruction from pills (`{item}` + `{anchor}` + `[rel]`); Ali places it. An ambiguous instruction and he picks the *wrong* matching spot (hilariously) | **4** Being the expert; Ali's slapstick | **5** *Production:* choosing the relation and anchor needs the meaning. Out: pills are audio-only until the reads profile reaches stage 3 | **5** The only production-first arrange | The older cousin (Arc 1 Ch2 onwards); Grandparent mode | **4** Any board flipped |

**Handed to other modes (not taken):**
- **Buckets under the drips** (listed for both Tidy up and Monsoon rush in v2): the timed catching is **Monsoon rush** (react). Tidy up has no mechanic for it.
- **Animals into the shed** in the rain: **Monsoon rush**. M8 is only the calm evening sorting, sharing its scene and data.
- **Dress the guest**, Eid clothes: **Dress up**. Mehndi (M5) is flagged as a boundary case (question 7).
- **Check what someone else laid** as an odd-one-out: close to Find it's M5 *Check the bag*; here it only exists as the Done check.

**Rejected:** triple-match clearing (win by shape); slots shaped like the item; hover snap/straighten; auto-ending when the last item is placed; rows with item pictures; fixed seating ("Nana always sits by the window").

---

## 4. Recommended first set

**Build the board + rules engine once, then four mechanics on it.** All four are Arc 1, so Chapter 1–3's Tidy up errands exist for the family playtest (Roadmap phase 3).

| Order | Mechanic | Why first | Fun · Kutchi · Plot · Replay (one line) |
|---|---|---|---|
| 1 | **M2 Put the shopping away** | Its nouns are **real Kutchi now**; it uses the existing pantry scene and item art; it's the smallest board. It proves the engine before new art exists | Calm filling of the pantry · noun + place, the noun half already Kutchi · Arc 1 Ch1, straight after the bazaar · any Find it basket feeds it |
| 2 | **M1 Lay the dastarkhwan** (+ **M11 Simba's paw** from level 2) | The Roadmap's third Chapter 1 errand; the richest S2 board (people, colours, relations) | The finished table · who/where/which colour · Arc 1 Ch1, Eid breakfast · re-seated guests, Busy clock, Simba |
| 3 | **M4 Repack the sweet box** | Counting into positions; closes the Ch3 chain (Find it → Who did it? → Tidy up) | Gift box with a ribbon · which sweet, how many, which cells · Arc 1 Ch3 · box patterns and designs |
| 4 | **M3 Shoe mountain** | Ch2's complication; adds pairing (hand skill) and left/right at level 2 | Pair the heap · colour, size, kind, side · Arc 1 Ch2 · guests' shoes vary, Zazu steals one |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| M10 Nani's rules | As a row type at level 3 once the first set is stable | Needs colours and "all / nothing / not" from the family |
| M5 Place the pattern | Arc 2 (mehndi, quilt); an optional Arc 1 hub beat (bunting) after the first set | Colours first; a palm canvas and piece art |
| M7 Family photo | Arc 2 wedding photo (kinship only), Arc 5 finale (comparatives) | Kinship (S3) and comparatives (S6) |
| M6 Line up | As a row type inside M7 and M8 | Weak alone (25% guess) |
| M8 Into the shed | Arc 3 | S4 animals; built alongside Monsoon rush |
| M9 Put it back | Arc 4 | S5 past tense |
| M12 You tell Ali | When produce stages exist (the platform plan, item 5) | Production, not listening; the rule data makes it cheap later |

---

## 5. Story integration

### 5.1 Where it appears

| Arc · chapter | Beat | Tidy up errand | Mechanic | Cast who drive it |
|---|---|---|---|---|
| **Arc 1 · The guests are coming** | Fruit bought | Put the shopping away (fruit for the bowl, the rest to the pantry) | M2 | Nani |
| | Daal cooked | **Set the dastarkhwan** (the chapter's payoff; lights on, knock at the door) | M1 | Nani; guests on cushions; Simba asleep on a cushion (a spare place he won't leave: hand skill to shoo) |
| **Arc 1 · Knock knock** | Shoes everywhere | **Shoe mountain** | M3 | Guests; the older cousin loses one shoe (Zazu has it) |
| **Arc 1 · The cat and the sweets** | After Find it and Who did it? | **Repack the sweet box**, with counting | M4 + M11 | Simba (knocks the box), Zazu; Nani |
| **Arc 1 · The spill** | Big Ma mends the kurta | Optional: put Big Ma's reels back (colours, top/bottom row) | M2 on her thread tin | Big Ma (sings while you tidy) |
| **Arc 1 · Eid morning** | Breakfast | Eid breakfast table, Busy (guests arriving clock) | M1 | Nani, Big Ma among the elders, Nana |
| **Arc 1 · hub beats** | The hub fills with Eid | Hang the lantern and bunting where Nani says (one row each; optional) | M5 (bunting) | Nani |
| **Arc 2 · Outfits** | Everyone together | The wedding photo (kinship only) | M7 | The families |
| **Arc 2 · Mehndi night** | A flower on the left hand, dots on the right | **Place the pattern** | M5 (mehndi) | Big Ma, Ma, the bride |
| **Arc 2 · The gift** | The blanket quest | Arrange the patches in each relative's colour | M5 (quilt) | Relatives, Nani |
| **Arc 2 · The feast** | Serve guests in the order they arrived | Seat the guests (order + kinship) | M1 seating + M6 rows | Guests |
| **Arc 3 · Clouds coming** | Bring the washing in | Sort the washing into baskets | M2 | Nani, Ma |
| **Arc 3 · The animals** | After the rain rush (Monsoon rush) | Into the shed for the night | M8 | Goats, hens, chicks |
| **Arc 4 · Following clues** | The search left a mess | **Put it back** where it *was* | M9 | Nani, Simba |
| **Arc 5 · The farm** | Mangoes up, groundnuts down | Sort the harvest into baskets | M2 | Villagers |
| **Arc 5 · The family photo** | The finale | **The family photo**: next to, behind, in front, tallest | M7 + M6 + M10 | Everyone (the recap of kinship and position) |

**Cast roles.** Nani gives every rule and does the check. Guests and family are *anchors* (who things are for) and, in M7, the things arranged. **Simba and Zazu** are the mess and the twist. **Big Ma** hosts the quilt and the reels. **The older cousin / Ali** is the role-reversal partner (M12). **Kasuku** never speaks during a board (cast rule); in the hub he repeats a position phrase from the last board. **The doctor** has no Tidy up role.

### 5.2 Places on the world map

Tidy up **opens rooms of Nani's house**, one per first errand: the **sitting room** (the dastarkhwan: first errand opens it, and the laid cloth appears in the hub), the **doorway** (shoe rack), the **pantry and spice cupboard** (already in the kitchen), then Big Ma's room, the courtyard shed (Arc 3), the village farm (Arc 5). Each arranged place is shown as the player left it (their free choices included).

### 5.3 Free-play route

- **"Tidy the house"** (the world is the menu): tap any unlocked room; each board is generated from the player's weakest words; a *Finish tidying* button leads into the usual summary and pocket money (Cook's open-kitchen pattern).
- **Nani's daily tidy** (the *ALttL* Daily Tidy): one 60–90 s board a day, built from the weakest words; "tidied with Nani on N days" (never resets).
- **Explore** (Toca-style): no rows; place anything, it reacts; tapping an item names it (stage-1 teaching only happens here and in rounds on stage-1 words).

---

## 6. Learning design

### 6.1 Words and frames it drives

| Stage | Words | Frames (existing Kutchi, or placeholder) | Unlock level |
|---|---|---|---|
| S1 (review) | Fruit, veg, spices (Kutchi drafts); numbers 1–10 | `{n} {X}`, *Ne {x}*, *Ne poi {x}*, *Muke hikdo {x} dine* (pass me), *Arre re!*, *Ghan* | All |
| S2 positions | in, on → under → next to, in the middle → behind, in front of, between → corner, top/bottom row → left/right | `{X} {anchor} [EN: rel]` (position after the noun). Each `(anchor, rel)` recorded as one phrase until the family answers the anchor-changes question | L1: in, on, next to, in the middle · L2: + in front of, behind, between, top/bottom, **left/right** · L3: + corner, first/last |
| S2 nouns | Tableware (plate, cup, glass, bowl, jug, spoon, thali, katori, flask), cushion, cloth, shoes, sandals, slippers, rack, mat, door, box, sweets, shelf, cupboard, basket | `[EN: X]` | By errand |
| S2 colours | 10 colours | `[EN: red] {X}` (agreement unknown) | L2 |
| S2 imperatives | put, leave, tidy up, give | `[EN: Put …]`, `[EN: leave the X]`; *Muke hikdo {x} dine* for pass me | L1 (put), L2 (leave) |
| S3 | big/small, tall/short, kinship (Nana, Nani, Ma, Ali, Big Ma, guests' titles), "for {person}" | `[EN: big] {X}`, `{X} {person} [EN: for]`; possessive: does *jo* (as in *Nani jo Ghar*, *bajr jo maani*) work for "Nana's cup"? Ask; never assume agreement | L2 |
| S5 (Arc 4) | was, yesterday | `{X} {anchor} [EN: was on]` | Arc 4 |
| S6 | bigger/smaller, taller/shorter, the biggest, older/younger, "because" | `{X} {Y} [EN: bigger than]`, `[EN: the biggest]` | Arc 5 (and Arc 3 pots) |

**Row length grows with the board** (as Find it): level 1 is noun + one relation, 2–3 rows; level 2 adds colour or size, left/right, a "leave it" row, 3–4 rows; level 3 adds class rules (M10), counts over cells, comparatives, 4–6 rows. **Level 1 is simple in hand, varied in ask** (Wave 5): few items, big spots, but the rows differ every time.

### 6.2 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | Tap a row's speaker: Nani says it again | Free the first time; then the tick (Relaxed) or patience (Busy) |
| 2 Slow replay | Half speed, a pause before the relation word | Tick / patience |
| 3 Warmer | Nani's hand sweeps across **half the board**; the other half dims. It must still hold **≥3 legal spots and ≥2 anchors** | Tick + the combo breaks; the ear star stays |
| 4 Reveal | The row's Kutchi text (never English) | Ear star for that row (from stage 2) |
| 5 Translate | English gist | Ear star for that row |
| 6 Shown | A ghost of the item appears at one valid spot. Automatic only for stage-1 rows; otherwise after 2 misses at the check | Ear star for that row; the words don't advance |

- The hint is a **"?" button** that opens this ladder (Wave 5). Hesitation never shows anything: after about 10 s of no touch, Nani replays one row (rung 1, free the first time).
- **Nothing is refused while arranging** and **nothing is checked until Done** from level 2. At level 1 each placement of a *named* item is checked when set down: right = the soft place sound only; wrong = a gentle wiggle, the row's ear star is lost, and the item stays where it was put (no hint of where it should go).
- **No upgrade makes a hint cheaper** (section 7).

### 6.3 Word-stage fading (one place for text)

| Word stage | The row (instruction) | On the board (help) |
|---|---|---|
| 1 New | Text + speaker. As Nani says the relation, **her hand demonstrates it with a neutral token** (a pebble set *next to* a cushion that isn't the target anchor), a gesture, never the answer. Stage-1 rows are taught, not tested (no ear effect either way) | Item names are spoken when an item is picked up |
| 2 Learning | Text + speaker | Nothing spoken on pick-up |
| 3 Nearly known | Speaker + ••• (adjacent hidden words share one •••, Cook's Wave 4 fix) | Nothing |
| 4 Known | Heard once; replay costs the tick | Nothing |

- **No item labels on the board at any stage** (Find it's rule: the label is the answer to the noun half).
- **Counts:** a digit on the row only while the number word is at stage 1–2; placed sweets are counted aloud only at stage 1–2; nothing ends by itself.
- A board where fewer than **2 rows** are tested (stage ≥2) is a *teaching board*: the ear star shows as "learning" and pays helping money only. This stops an all-new-words board from being a free ear star.

### 6.4 Recasts on mistakes

At the Done check, Nani goes row by row in a **fresh random order** (never the ladder order):
- Right: the item hops, the row ticks, Nani says the row (a second hearing, in context).
- Wrong: the item wiggles; *Arre re!* then **what it is** (`{cup} {plate} [EN: next to]`), then **what she asked** (`{cup} {Nana} [EN: in front of]`). The player moves it; she re-checks only that row, then carries on. The row's ear star is already lost; the word is marked as a miss (two misses drop it a stage).
- A "leave it" item that was placed: *Arre re!* + `[EN: leave the] {X}`; the player puts it back on the tray.
- Simba's paw never reveals: knocked items fall into a heap; no row lights up.

**Spaced retrieval:** rows are due words plus up to 3 new; *pass me* (sidebar) asks for a known word **not on this board** from a look-alike group (Cook's rule); the word review at the end lists each Kutchi word used, with its English.

### 6.5 Role reversal

Rules are data (`{item, rel, anchor}`), so the same board can run backwards:
- **M12 You tell Ali:** the player sees the target layout (a picture card Nani holds); builds each instruction from audio pills; Ali (code) applies the rule with the same checker, choosing **uniformly among the spots that satisfy it**. Ambiguous instructions (≥2 spots) often go wrong, which teaches precision (the barrier-game lesson).
- **Grandparent mode:** Nani (the real one) reads the rows aloud from large type; the child arranges; the Done check still grades.
- **Kasuku's echo:** in the hub, he repeats a position phrase the player got right.

### 6.6 Words and frames needed from the family (English placeholders until then)

| Need | Placeholder id | Status |
|---|---|---|
| Position phrases: in, on, under, behind, next to, in front of, between, on top of | `ph-rel-in` … `ph-rel-ontop` | Asked (Round 1 Q3, not "in"); **shared with Find it** |
| Left, right, in the middle, in the corner, top row/shelf, bottom row/shelf, first, last | `ph-rel-left` … `ph-rel-last` | **New.** Also: is left/right used at home, or "this side / that side"? |
| Does the anchor noun change before a position (like Gujarati *table-**ni** niche*)? | — | New (shared with Find it); decides chunk vs whole-phrase recording |
| "Put", "leave it", "tidy up", "give", "everything", "all the …", "nothing", "not" | `ph-put`, `ph-leave`, `ph-tidy`, `ph-all`, `ph-nothing`, `ph-not` | New |
| Colours (10) | `ph-col-*` | Asked (Round 1 Q11) |
| big, small, tall, short; bigger, smaller, taller; the biggest; older, younger | `ph-big` … `ph-oldest` | Partly new (Cook needs big/small too) |
| Do describing words agree with the noun's gender/number? | — | Asked (Round 1 Q1) |
| Possessive: "Nana's cup" (is it *Nana jo …*, and does *jo* change?) | `ph-poss` | New |
| "for {person}" | existing placeholder `forwho` | New (Cook needs it too) |
| Tableware: plate, cup, glass, bowl, jug, spoon, thali, katori, flask, cloth, cushion | `ph-plate` … | Partly asked (Q8); send this list |
| Doorway: shoes, sandals, slippers, pair, rack, mat, door, bench | `ph-shoe` … | Q8 mentions shoes; send the list |
| Sweets for the box (5–6 mithai) | `ph-sw-*` | New (shared with Find it Q7) |
| Kinship titles for the guests | — | Asked (Q10) |
| Mehndi: flower, leaf, dot, hand, finger, palm, wrist (Arc 2) | later | Arc 2 |
| "It was on …" (Arc 4), "because" (Arc 5) | later | S5, S6 |
| Frames: "Where does it go?", "Well done!", "Put it back", "Look, a mess!", "Nearly!" | `ph-where` … | New (`snt-13` "Well done" exists with no Kutchi) |
| **Recording:** per scene about 6 anchors × 6 relations = ~36 short phrases, one long take | — | For the recording session |

---

## 7. Stars, rewards and upgrades

| Star | Icon | Earned when |
|---|---|---|
| **Ear: understood** | ear | Every tested rule holds at the first check (per row: a wrong live placement at level 1, a wrong row at the check, reveal/translate/shown on that row all lose it). Needs ≥2 tested rows |
| **Neat** (this mode's craft star) | **the ufagio**, the short straw broom (the family's own set-dressing pick) | Hand skill only: stacks straight (a plate dropped off-centre wobbles), pairs placed together toe-to-toe, sweets inside cells (not on the dividers), nothing hanging off the cloth, Simba's paw stopped or its mess cleared, Zazu caught. Never measures *where* things are relative to rules |
| **No help** (Relaxed) / **Quick** (Busy) | tick / lightning | No hint rungs used / done before the visible **doorbell clock** runs out (guests arriving). Busy help drains the clock |

**Pocket money:** 5 for helping, +5 ear, +3 neat, +3 tick or lightning, plus the **perfect-tidy combo** (consecutive 3-star boards). Never lost.

**Collectibles:**
- **Nani's little secrets** (*Unpacking* stickers): 3 per scene, from playful interactions that aren't rules (stack every cup into a tower, put Simba's bell on the mat, fold the cloth corner). An album page per room.
- **Box and cloth designs:** each finished sweet box and quilt patch design is kept; the hub's dastarkhwan pattern can be changed to one earned (décor that changes the hub is allowed; it buys nothing that plays).
- **The photo album:** the laid table, the family photo, the mehndi hand.

**Upgrades (physical only; one per board type; money is the choice):**

| Upgrade | Effect | Why it never listens |
|---|---|---|
| Big serving tray | Carry 2 items per trip (tap two, then one spot each) | Fewer taps; the spots are still yours |
| Steady hands (a brass thali stand) | Wider tolerance before a stack wobbles | Neat star only |
| Shoe horn | A pair moves as one after pairing | Hands only |
| Sweet tongs | Sweets drop into the centre of the cell you tap | Neat star only |
| Step stool | Top shelf reached without the reach animation | Speed only |
| Doorbell delay (a cup of chai for the guests) | +20% Busy clock | Time only |
| **Deliberately none** | No "checker", no "outline mode", no "undo to last right", no auto-sort | These would do the listening |

---

## 8. Engineering spec for the builder

### 8.1 Data model

**Shared with Find it: `data/relations.json`** (one list of relation ids and their word ids and cameras), so Find it's hide spots and Tidy up's spots speak the same vocabulary and role reversal works in both (platform plan 5a).

```json
{"relations": {
  "in":        {"word": "ph-rel-in",     "cams": ["T","H","E"]},
  "on":        {"word": "ph-rel-on",     "cams": ["H","E"]},
  "next-to":   {"word": "ph-rel-nextto", "cams": ["T","H","E"], "derived": "adjacent"},
  "left-of":   {"word": "ph-rel-left",   "cams": ["T","H","E"], "frame": "player"},
  "in-front":  {"word": "ph-rel-front",  "cams": ["H","E"]},
  "middle":    {"word": "ph-rel-middle", "cams": ["T","H","E"], "unary": true},
  "top-row":   {"word": "ph-rel-top",    "cams": ["T","E"], "unary": true}
}}
```

**Scene (`data/scenes/<scene>.json`, extended; the same file Find it extends).**

```json
{"id": "sitting-room", "camera": "H",
 "surfaces": [{"id": "cloth", "rect": [180, 420, 1240, 330], "material": "cloth"}],
 "anchors": [
   {"id": "seat-1", "kind": "person-seat", "word": null, "rect": [...]},
   {"id": "door", "kind": "object", "word": "ph-door", "rect": [...]}],
 "spots": [
   {"id": "s12", "x": 610, "y": 540, "surface": "cloth", "cap": 1,
    "tags": [{"rel": "in-front", "anchor": "seat-2"}, {"rel": "middle"}],
    "nbr": {"left": "s11", "right": "s13", "front": "s22", "back": null}}],
 "stacks": [{"spot": "s30", "max": 4}]}
```

- Spots carry **precomputed relation tags** to fixed anchors, plus a **neighbour graph**, so "next to the plate" (a placed item) is derived at check time from neighbours. No free-form geometry grading.
- People anchors (`person-seat`) get a person per board (`"who": "nana"`); the kinship word comes from the person.

**Board (a level of a mechanic) and rules, `data/tidy.json`.**

```json
{"words": {"ph-plate": {"kutchi": null, "english": "plate", "art": "plate-h", "tint": true, "material": "enamel"}},
 "lines": {"place": {"e": "{x} {anchor} {rel}"}, "leave": {"e": "Leave the {x}."}},
 "grammar": {"place": "{x} {anchor} {rel}", "count": "{n} {x}", "then_word": "lnk-nepoi"},
 "mechanics": {"table": {"levels": [
   {"rows": [2, 3], "rels": ["in", "on", "next-to", "middle"], "people": 3, "spareSeats": 1,
    "extraItems": 2, "leaveItems": 0, "liveCheck": true, "paw": false, "colours": false},
   {"rows": [3, 4], "rels": "+in-front,+left-of,+right-of,+between", "leaveItems": 1,
    "liveCheck": false, "paw": 0.4, "colours": true},
   {"rows": [4, 6], "ruleTypes": ["place", "class", "not", "count"], "people": 4}]}},
 "boards": {"dastarkhwan-guests": {"mechanic": "table", "scene": "sitting-room",
   "slots": {"who": {"type": "people", "from": ["nana","ma","ali","guest-1","guest-2"], "count": {"byLevel": [3, 3, 4]}},
             "rows": {"type": "rules", "prefer": "weak"}}}},
 "star_sets": {"tidy": {"ear": {"icon": "ear"}, "hand": {"icon": "broom", "name": "Neat"}, "relaxed": {"icon": "tick"}, "busy": {"icon": "bolt"}}}}
```

**Rule types (one row each):**

| Type | Shape | Example |
|---|---|---|
| place | `{item, attrs?, rel, anchor}` | `{"item": "ph-cup", "attrs": {"colour": "red"}, "rel": "in-front", "anchor": "@nana"}` |
| unary | `{item, rel}` | `{"item": "ph-jug", "rel": "middle"}` |
| class | `{all: {attrs}, rel, anchor}` | `{"all": {"kind": "shoe", "colour": "black"}, "rel": "on", "anchor": "rack-top"}` |
| count | `{n, item, rel, anchor}` | `{"n": 3, "item": "sw-jalebi", "rel": "in", "anchor": "row-top"}` |
| leave | `{item, rel: "stay"}` | `{"item": "ph-spoon", "rel": "stay"}` (said "leave the spoons") |
| not | `{not: rule}` | `{"not": {"all": {}, "rel": "next-to", "anchor": "door"}}` |
| order | `{items, by, dir, along, from}` | `{"items": "@pots", "by": "size", "dir": "desc", "along": "shelf-2", "from": "door"}` |
| compare | `{item, rel, anchor: {superlative}}` | `{"item": "@ali", "rel": "behind", "anchor": {"most": "tall"}}` |

**Round state:** `{placements: {itemInstance: spotId | "tray"}, moves: n, neat: {...}}`. **Check:** `Tidy.Rel.holds(state, rule, scene)` → true/false per row; the Done check walks rows in random order.

**Generator (`Tidy.Rules.make(board, level, profile)`)** returns items on the tray (targets + extras + leave-items), people seated, and rows; it then runs the **solver checks** and re-rolls on failure:
1. **Solvable:** a backtracking search (≤10 items × ≤40 spots, trivial) finds ≥1 layout satisfying all rows.
2. **≥3 options per row** given the others (G5).
3. **Convention fails:** the board's `convention` layout (data) breaks ≥1 row (G4).
4. **No forced row:** removing any one row, its target isn't pinned to a single spot by the rest.
5. **Priors flat:** over 1,000 generated boards, no `(item, spot)` pair is chosen by the solution more than 1.5× its fair share (checked in the test harness, not per round).

### 8.2 Reuse and new building blocks

| From | Reused as is | Adapted |
|---|---|---|
| **Cook** | Word pills and `Cook.Lang`; the **order ladder** rows (speaker · dots · reveal · translate; one dot per row; shared •••); stars shown as they happen; the receipt; completion cards; **pass me** in the sidebar with look-alike groups; help costs; `progress.js` word stages; levels as data (`mechanics.<id>.levels`, `byLevel`); the TTS placeholder pipeline; Relaxed/Busy; `St.freePick` (nothing refused, graded after); the chaat bowl's layer-by-layer check and recast | Ladder rows built from rules instead of recipe `say` lines; the result card's word review (Wave 5) |
| **Find it** | Scene JSON (anchors, occluders, safe zones), relation ids, the stage-fading table, the hint ladder shape, the **non-speaker bot** idea, the search lab pattern, `place_preview.py` checks | Spots gain `tags` + `nbr` + `cap`; the bot learns arranging strategies |
| **Shell** (when it exists) | One profile, one wallet, the world map, story beats as data | Tidy's rooms as places |

**New building blocks (each one file):**

| File | What |
|---|---|
| `js/shared/rel.js` | Relation checker + spot graph (shared with Find it; whoever builds first owns it) |
| `js/tidy/board.js` | Surfaces, spots, the tray, tap-tap and drag placement, stacks, pairs, uniform spot dots while holding |
| `js/tidy/rules.js` | Generator, solver checks, ladder rows from rules, speech from `grammar` |
| `js/tidy/check.js` | The Done check (random row order, hop/wiggle, recast, the player fixes, re-check), live check at level 1 |
| `js/tidy/mechanics/{pantry,table,box,shoes}.js` | One per mechanic: its board setup and hand skill (stack wobble, pairing, cell fit) |
| `js/tidy/twists/paw.js` | Simba's paw and Zazu's steal |
| `js/tidy/bot.js` | The leak bot (8.4) |
| `js/tidy/lab.js` | The Tidy lab |

### 8.3 The Tidy lab

On `tidy.html`'s title: run any mechanic × scene × level with a random board; buttons: *Level 1/2/3*, *New board*, *Nani helps* (stage-1 teaching on), *Busy*, *Paw*, **Non-speaker bot** (plays the board with a chosen strategy and reports the ear result), **Show spots** (debug: draws spots, tags and neighbours), **Rule inspector** (each row's option count and the convention result), *Word stage* override (1–4) to see fading.

### 8.4 Test harness and the leak bot

`python3 build/test_tidy.py` (Playwright, as `test_cook.py`):
- `--lab [--level N]`: every mechanic at levels 1–3, real pointer events (tap-tap and drag), the tap-cover check before every tap, deliberate wrong placements to exercise recasts.
- `--gen 1000`: generator property tests (8.1 checks 1–5).
- `--rel`: relation-checker unit tests (in the page, reported to Python).
- `--sizes`: phone 915×375, 1366×768, 1440×900, 1280×800, iPad landscape and portrait; screenshots for Claude to look at.
- **`--bot 500`: the leak bot.** It sees only the screen (row count, row shapes, the tray, the spots, the people), never the rule data. Strategies, each run 500 boards per mechanic per level:

| Strategy | What it tries |
|---|---|
| Convention | The board's everyday layout (cups by plates, pairs by the door, box filled top-left, tall at the back) |
| Tray order | Row *i* → tray item *i*; nearest free spot to the row's anchor slot |
| Elimination | Places obvious items first, the rest into what's left |
| Live-check probing (level 1) | Tries spots until one doesn't wiggle |
| Prior learner | Learns the most frequent spot per item kind over 200 boards, then plays it |
| Copy last | Replays the previous board's layout |
| Waiter | Does nothing for 30 s, then follows any hint shown |
| Reader | Reads English placeholders (reported **separately**: this measures the placeholder hole, not a code leak) |

**Pass:** with placeholders treated as unknown, **every strategy earns the ear star in <10% of boards** (the bot must *fail* in >90%). Arithmetic check: with ≥3 options per row and ≥3 tested rows, a blind guess wins ≤(1/3)³ ≈ 3.7%.

### 8.5 File layout (until the one-app shell)

`tidy.html` · `js/tidy/…` (above) · `js/shared/rel.js` · `data/tidy.json` · `data/relations.json` · `data/scenes/{sitting-room,doorway,sweet-box,kitchen}.json` · `assets/tidy/{items,scene}/` · `assets/audio/word/<id>.mp3` · `build/test_tidy.py` · `docs/tidy-up-build-log.md` (the builder's own log). When the shell lands, `tidy.html` becomes a mode launched from the map, as planned for Cook.

---

## 9. Scene, art and asset list

### 9.1 Cameras

| Scene | Camera | Notes | Reuse |
|---|---|---|---|
| Pantry (M2) | **E**, straight on to the shelves | Existing kitchen shelf coordinates (`data/scenes/kitchen.json`); items in F view | **Existing** background and items |
| Sitting room / dastarkhwan (M1) | **H** (the kept high angle, looking steeply down at the cloth); guests sit on the far cushions behind the bolster, as Nani does in the Chapter 1 art notes | A deviation from the art bible's "T for dastarkhwan": it reuses `bg-sitting-room-v1.png` and shows the guests (needed for "in front of Nana"). **Question 1** | **Existing** background |
| Doorway (M3) | **T**, the floor inside the door: mat, a two-row low rack, a slipper basket, the threshold at the top edge | Left and right shoes read by shape from above; the left shoe is the right one mirrored in code | New background |
| Sweet box (M4) | **T**, the box on the island top | The box grid and lid as sprites | New (a table-top T surface; Cook's marble or wood T worktop may serve) |
| Mehndi, quilt (M5) | **T** | The palm is the existing A3 palm-up hand pose | Later |
| Family photo (M7) | **E**, courtyard with a bench | Characters' existing upper-body sprites plus a standing row | Find it's courtyard (later) |

### 9.2 Layers and ambient motion

| Layer | Why |
|---|---|
| Background with **no painted placeable items** (playtest lesson) | Everything is placed by data |
| Every placeable item (instances; colour by code tint) | Tinting gives 10 colours from one image |
| Occluders: the bolster front (guests), the rack's front rail, the box's front wall | Items sit *in* things |
| The tray (back, items, front rim; layout contract v2: ≤22% height, bottom centre) | The carried container |
| Guests and Nani (upper body, existing poses) | People anchors |
| Simba's paw, Simba and Zazu (existing cat sheets) | The twist |
| Spot dots (code-drawn, uniform) | G1 |
| Ambient (2–4 per scene, never near spots): curtain sway, lantern glow, steam from the flask, Simba's tail on a spare cushion | Alive but calm |

### 9.3 Hand poses (from the existing set)

| Pose | Use |
|---|---|
| C4 pointing | Tap to pick and to place (the default) |
| D1 grab (open/closed) | Lifting plates, shoes, fruit; carrying to the spot |
| C1 pinch (open/closed) | Sweets, spoons, mehndi dots, reels |
| D3 two hands cupping | Carrying the tray in; closing the sweet box |
| C3 side pinch | Photos, quilt patches, the cloth corner |
| C2 tripod | Mehndi cone (Arc 2) |
| A2 heel-of-palm push | Nudging an item straight (neat star) |
| A3 palm up | The mehndi canvas (another person's hand, Arc 2); Nani receiving |
| E1 thumbs up, E3 counting fingers | Nani's check (E3 for counts at stage 1–2) |

**No new pose is needed** for the first set. Nani's N set covers her demonstrations (C1, C4, A3).

### 9.4 New assets and rough counts

| Asset | Count | Camera | Made in | Reuse |
|---|---|---|---|---|
| Tableware: plate, enamel mug, chai glass, katori, thali, jug, spoon, serving dish, flask | ~10 images (tinted in code) | H | **API edit-in-place** onto the sitting-room cloth (angle and light must match) | Blue-rim enamel from the set-dressing list |
| Shoes: sandal, chappal, school shoe, big black shoe, slipper, baby shoe, jutti | ~7 (mirrored for the pair; tinted) | T | ChatGPT 4×4 grid (free) | — |
| Mithai: jalebi, ladoo, barfi, peda, gulab jamun, kaju katli | ~6 | T | ChatGPT grid (free) | Find it's sweets (F view) are a different view |
| Sweet box (open, lid, ribbon) | 3 | T | ChatGPT (free) | — |
| Doorway floor background | 1 (+ evening grade in code) | T | ChatGPT (free), then cut the rack rail occluder | — |
| Box table-top background | 0–1 | T | Reuse a Cook worktop if it reads | Cook |
| Simba's paw | 1 | T and H | From the cat sheet (API edit) | Cat sheets |
| Guests on cushions | 2–4 generic upper-body sets | H | From character sheets (API edit) | Shared with "Knock knock" |
| Placement sounds (item material × surface) | ~6 × 5 sets of 3 | — | Recorded at home (enamel, steel, wood, cloth, cardboard, shoe) | — |
| **First set total** | **~30 images + ~90 short sounds** | | ~$5–$10 of API for the edit-in-place items and characters; the rest free | |

---

## 10. Persona loops

### Loop 0: draft

The M1–M12 library above, before guards G1–G8; slots were item-shaped gaps (like the pantry gaps); each placement ticked live at every level; unmentioned items stayed on the tray; the dastarkhwan was drawn top-down with face tokens for guests.

### Loop 1

| Persona | Plays · says · struggles |
|---|---|
| Layla, 5 | Drags a plate and drops it halfway (drag is hard). "Which one is left?" Loves the stack wobble. Her parent reads the rows |
| Zayn, 8 | Finishes M2 fast, bored: "It's just putting away." Wants records |
| Maryam, 11 | Wants the table to look *hers*: "Can I put the flowers where I like?" |
| Zafar, 38 | Three short rows a board is too little Kutchi per minute |
| Farah, 34 | A full errand is 5–8 min; wants one board |
| Nani, 68 | "We don't say 'to the right of the plate'." Wants to see the table in the hub |
| **Sceptic** | Wins: (1) the item-shaped gaps show where each thing goes; (2) laying the table the normal way satisfied every row twice; (3) live ticks: tried spots until one ticked; (4) the sweet box had exactly the cells needed; (5) row order matched the tray order; (6) the red cup went to the guest in red |
| Builder | Free-form geometry grading ("is it next to?") is fuzzy and slow to tune; a top-down dastarkhwan needs new art and faces from above look odd |

| Finding | Change |
|---|---|
| Item-shaped gaps give the answer | **G1** uniform spots, ≥ items + 3 |
| Convention wins | **G4** generator rejects boards the convention satisfies |
| Live ticks allow probing | **G8** live check only at level 1 and it costs the row's ear star; check at Done from level 2 |
| Cells = sweets | Cells > sweets; plate over-supplied; *Done* only |
| Tray order = row order | **G3** shuffle both |
| Colour matches clothes | Colours and clothes decorrelated in the generator |
| Drag is hard for Layla | **Tap-tap** primary (drag also works); the held item follows the finger |
| Left/right too early | Left/right from level 2, player's own side; landmarks at level 1 |
| Zayn bored | Busy doorbell clock, the combo, records (fastest perfect, fewest moves) per board |
| Maryam wants it hers | **Unmentioned items are free** to place or leave (not graded); her layout shows in the hub |
| Too little Kutchi | 4–6 rows at level 3; the Done check says every row again (right or wrong) |
| Farah | **Nani's daily tidy** (one board) |
| Nani's phrasing | Record whole `(anchor, rel)` phrases until the anchor question is answered; the family word list |
| Builder: geometry | **Spots with precomputed tags + a neighbour graph**; no free-form grading |
| Builder: camera | Reuse the kept high-angle sitting room with guests behind the bolster |

### Loop 2

| Persona | Plays · says · struggles |
|---|---|
| Layla | Tap-tap works; she can't tell which spots are possible. Stage-1 rows with Nani's gesture help ("she put the stone next to it!") |
| Zayn | Busy clock is fun; wants harder rules |
| Maryam | Free items make it hers; wants patterns and the mehndi *now* |
| Zafar | The check reading every row is good listening; the check animation is slow on replays |
| Farah | Daily tidy is right |
| Nani | Proud of the laid table in the hub; still worried about left/right phrasing |
| **Sceptic** | Wins: (1) only the spots in front of guests matter, and one board had only 2 guests (50%); (2) a board of all-new words gave a free ear star; (3) Simba knocked only correct items, so what he didn't touch was wrong; (4) when Simba knocked an item Nani replayed a row, linking row → item; (5) the stage-1 gesture used the target anchor; (6) "unmentioned items are free" + "leave it" rows: she left everything optional on the tray |
| Builder | Solver is cheap; "priors" might still leak via generator bias |

| Finding | Change |
|---|---|
| 2 guests = 50% | **G5** ≥3 people/anchors of the named kind; ≥1 spare seat |
| All-new board = free ear | Ear needs ≥2 tested rows; otherwise a teaching board |
| Paw targets correct items | Paw sweeps a **random strip**, correctness ignored |
| Replay after the paw maps rows | Nothing auto-replayed after the paw |
| Gesture used the real anchor | Nani demonstrates with a **neutral token and a non-target anchor** |
| Leaving everything on the tray | Harmless: placement rows fail. "Leave it" is only a real test because items of that kind are *also* needed elsewhere in some boards (e.g. "leave the spoons" vs. "a spoon next to Nana's plate" on another board) |
| Layla can't see possible spots | Uniform dots appear while an item is held (all identical) |
| Zayn wants harder | **M10 rule rows** at level 3; paw from level 2 |
| Zafar: slow check | Tap to skip each check animation; replays use the quick check (all rows at once, tap a row to hear its recast) |
| Maryam: patterns | Hang the Eid bunting (M5 lite) as an optional Arc 1 hub beat after the first set |
| Generator bias | **Priors-flat** property test (check 5) and the prior-learner bot |

### Loop 3

| Persona | Plays · says · struggles |
|---|---|
| Layla | Plays level 1 with a parent: 2–3 rows, big spots, live check. Gets the dastarkhwan done; the stack wobble makes her laugh. Returns for Simba |
| Zayn | Level 3 dastarkhwan with class rules and the doorbell clock; chases the combo and "fewest moves". Returns for records |
| Maryam | Her own free placements and cloth designs; the box designs album. Returns for the collection and Arc 2's mehndi |
| Zafar | ~12–18 Kutchi phrases per 2-minute board (rows, check, recasts, pass me); the rules riddles are his Puzzle Pirates itch. Returns for the depth |
| Farah | Daily tidy on the train, 90 s. Returns daily |
| Nani | Reads rows aloud in Grandparent mode; her table in the hub; her words list is short and concrete. Proud |
| **Sceptic** | Tries every trick: convention fails a row; tray order is random; no hover feedback; live probing at level 1 loses the star; spots all alike; the paw is random; the prior learner finds nothing (flat). **She still wins where rows are English placeholders** (she reads "under", "red"). She also notes: at stage 3, rows with a count still look different (a digit) while the number is stage 1–2 |
| Builder | First set ≈ engine + 4 mechanics + lab + bot; art ~30 images; the riskiest art is edit-in-place tableware on the high-angle cloth |

| Finding | Change |
|---|---|
| Placeholders readable | Content, not code: chase the family's position/colour/size words **before** M1's audit counts; the bot reports "Reader" separately |
| Digit shows a count row | Accepted: knowing a row is a count doesn't say which sweet or cell (≥3 options still). Digits fade with the number word as in Cook |
| High-angle tableware is the art risk | Greybox first; one sign-off item before the batch |
| Everyone has a reason to return | Stop here (the brief's stop rule holds) |

### Loop 4 (residual check)

The Sceptic cannot win the ear star by reading (no labels, Kutchi rows), matching shapes (uniform spots), elimination (≥3 options, spares), convention (generator check), fixed patterns (re-rolled, flat priors) or waiting (hesitation replays audio only; being shown costs the star). **The one route left is English placeholder words**, the same content hole Cook and Find it have. No further design change.

---

## 11. Scorecard and verdict

| Criterion | Score | Why |
|---|---|---|
| Fun | **4** | Calm order-making with juice (sounds, wobble, the finished place), Simba's comedy, a finale photo; the risk is sameness on M2 alone |
| Forces Kutchi | **5** | Every placement decision comes from a row; graded as rules so conventions and elimination fail; the bot target is explicit. (Placeholders aside) |
| Distinct | **4** | *Arrange* is clearly not *search* or *build*; the boundary cases (mehndi, buckets, animals) are named and handed off |
| Plot | **5** | Every Arc 1 chapter has a Tidy up beat; Arc 2 mehndi and quilt; the Arc 5 finale; the hub fills with what you arranged |
| Replay | **4** | Re-rolled guests, rules, colours; paw; Busy; rules at level 3; the daily tidy; collections |

**Is it good?** Yes: the rule-graded layout is the right answer to v2's risk ("puzzles with rules that are interesting, not just 'put X there'"). **Is it complete?** It covers S2 positions, colours and imperatives; S3 sizes and kinship; S6 comparatives (M6/M7); and every listed story use (dastarkhwan, shoe mountain, sweet box, mehndi, family photo), with buckets and the shed rush handed to Monsoon rush by agreement of verbs.

**Verdict: Go with changes.** The changes: (1) the shared relation file and checker are built once for Find it and Tidy up; (2) the family's position, left/right, colour and tableware words are chased before M1 is audited; (3) Zafar confirms the dastarkhwan camera.

**Top risks**
1. **English placeholders** make positions and colours untestable (the Sceptic reads them). Only the family fixes it.
2. **M2 could feel like a chore** for Zayn. Mitigation: it's short, it's first only as an engine proof; Busy, rules and the paw arrive with M1.
3. **Edit-in-place tableware on the high-angle cloth** may drift in angle and scale. Greybox and one signed-off item first.
4. **Left/right phrasing**: families may say "this side / that side"; the frame of reference must be the player's own.

**Open questions for Zafar**
1. Dastarkhwan: reuse the kept high-angle sitting room with guests behind the bolster (proposed), or a new top-down cloth?
2. Unmentioned items: free for the player to place (proposed, for Maryam), or must they stay on the tray?
3. Check timing: live at level 1, only at *Done* from level 2. OK?
4. Craft star: "Neat" with the ufagio broom icon?
5. Buckets under the drips and the animal rush go to Monsoon rush; Tidy up keeps only the calm evening pens. Agree?
6. Mehndi: Tidy up (placing a pattern) or Dress up?
7. Which 5–6 sweets go in the box (shared with Find it's Q7)?

---

## 12. Build brief for a future agent

**Read first:** this doc; `docs/cook-with-nani-recipes-guide.md`; `docs/find-it-design.md` sections 4–6; `docs/cook-with-nani-kutchi-audit.md` ("After Wave 3"); Wave 5 in `docs/cook-with-nani-todo.md`. **Never invent Kutchi.** Placeholders are `kutchi: null` with English.

### Phases

| Phase | What's playable | Acceptance |
|---|---|---|
| **1 Engine + M2 in the Tidy lab** (greybox) | `tidy.html` → Tidy lab → *Put the shopping away* on the existing kitchen shelves, levels 1–3; intro card; ladder rows; tap-tap and drag; Done check with recasts; stars; word review | `test_tidy.py --lab` passes levels 1–3 at all six sizes with the tap-cover check; `--gen 1000` all five solver checks; `--rel` passes; **`--bot 500` <10% ear star for every strategy except Reader**; no console errors; Claude has looked at the screenshots |
| **2 M1 dastarkhwan + paw + story errand** | Arc 1 Ch1 errand 3 end to end (intro beat → board → outro beat, the knock), Relaxed and Busy with a visible doorbell clock; Simba's paw from level 2; pass me in the sidebar | As phase 1 for M1; the story errand runs from the title; bot <10%; the laid cloth is saved for the hub |
| **3 M4 sweet box + M3 shoe mountain + meta** | Both boards at levels 1–3; the upgrades shop; free play "Tidy the house"; Nani's daily tidy; the secrets album | As phase 1 per mechanic; pocket money and upgrades never change a rule; daily tidy repeats only after 24 h |
| **4 Art and words** | Edit-in-place tableware, doorway and box art, shoes, mithai, placement sounds; family words dropped in as data | Visual QA checklist on every screenshot; the Kutchi audit repeated per mechanic; persona review round with Zafar's playtest notes |
| Later | M10 rule rows; M5 (Arc 2); M7 photo; M8 pens (with Monsoon rush); M9 put it back (Arc 4); M12 You tell Ali | Each: its own audit and bot run |

### The first 3 tasks

**Task 1: the shared relation checker (`data/relations.json`, `js/shared/rel.js`).**
- Write `data/relations.json` with the ids in 8.1 (in, on, under, behind, next-to, in-front, between, left-of, right-of, middle, corner, top-row, bottom-row, first, last), each with a placeholder word id (`ph-rel-*`, `kutchi: null`) and allowed cameras. Check `docs/find-it-design.md` 4.4 first; if Find it's builder has started a relations file, extend theirs instead.
- `Rel.load(scene)` builds the spot graph from `spots[].tags` and `spots[].nbr`. `Rel.holds(state, rule, scene)` implements every rule type in 8.1 (place, unary, class, count, leave, not, order, compare); "next to X" for a placed item uses neighbours; left/right are always the player's.
- `Rel.options(state, rule, scene)` returns the legal spots for a row (used by the solver, the Warmer hint and Ali in M12).
- Tests: `build/test_tidy.py --rel` opens `tidy.html?test=rel`, which runs ~40 table-driven cases in the page (a hand-made 3×4 spot grid with two anchors) and reports pass/fail to Python.

**Task 2: the generator, solver checks and leak bot (`js/tidy/rules.js`, `js/tidy/bot.js`, `data/tidy.json`).**
- `data/tidy.json`: the `pantry` mechanic's three levels (8.1 knobs), words for the placeholders in 6.6 needed by M2, and the board `shopping-away` using the existing fruit/veg/spice ids (real Kutchi drafts) as items and the kitchen's four shelves plus the fruit bowl and spice cupboard as anchors. Add `spots` with tags and neighbours to `data/scenes/kitchen.json` (only new keys; keep the existing ones intact), checked with `build/place_preview.py`.
- `Rules.make(board, level, profile)`: picks due words (weakest first) plus up to 3 new, look-alike extras, rows by the level's rule types; runs the five checks in 8.1 and re-rolls (cap 50 tries; log a failure).
- `Rules.ladder(rows)` → ladder rows (speaker · text or ••• · reveal · translate) and `Rules.speech(rows)` from `grammar`, shuffled per G3.
- `bot.js`: the eight strategies in 8.4, seeing only a screen model (`{rowCount, rowShapes, tray, spots, people}`), never the rows.
- Tests: `--gen 1000` and `--bot 500` (prints a table: strategy × level → ear-star rate).

**Task 3: `tidy.html`, the board and the Done check with M2 in the Tidy lab.**
- `tidy.html` loads Phaser, the Cook shared modules it needs (lang, pills, ladder UI, stars, receipt, passme, progress) and `js/tidy/*`. Layout contract v2: sidebar column (order card on top, "?" help, no English step pills), the tray bottom centre ≤22% height.
- `board.js`: tap an item → it lifts and follows; tap a spot → it lands (sound by material × surface); drag works too; uniform dots shown only while holding; nothing snaps or reacts differently over a right spot (G2).
- `check.js`: level 1 live check (wrong = wiggle, row ear lost, item stays); level 2+ check at *Done* in random row order with hop/wiggle and the recast (*Arre re!* + what it is + what was asked); the player fixes; re-check that row only; stars; word review.
- `lab.js`: the controls in 8.3.
- Acceptance: `python3 build/test_tidy.py --lab --sizes` passes with screenshots at all six sizes; a manual run shows no text on items, no hover feedback, and a recast on every deliberate mistake.
