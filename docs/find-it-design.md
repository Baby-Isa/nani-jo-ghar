# Find it: design (the next mode after Cook with Nani)

**Date:** 24 Sept 2026
**Status:** proposal for Zafar. **25 Sept: first playable slice on its own branch, for Zafar's review** (not live): `find.html` + `js/find/` + `data/find.json`, the engine (rows as data, relations as data, levels as data, the Search lab with the non-speaker bot) and M1 Nani's list with M5 Check the bag, in the bazaar with placeholder art. **Later on 25 Sept it moved onto Cook's calm sidebar (Wave 5A):** Nani's list comes up big as the intro card and flies into the sidebar; one row and one dot per thing; the goal behind "?"; Nani says less (new words are still taught with the twinkle); the result card is the word review; no coin/star counter (pocket money on the title and result card); the combo rises from the basket; Done and the rail (with zoom) are pinned to the sidebar's foot so zoom never falls off a phone. Tests: `build/test_find.py` (play) and `build/test_find.py --leak N` (the bot). It builds on `docs/game-modes-v2.md` (mode 2, *Find it*), `docs/cook-with-nani-phase-a-design.md` (the shared systems and the station library) and `docs/cook-with-nani-kutchi-audit.md` (the leaks).
**Placeholder rule:** Kutchi below is limited to words and frames already in `data/content.json` or `data/cook.json`. Anything written like `[EN: under]` has no Kutchi yet. In the game it is an English placeholder in grey italic until the family gives the word. **Never invent Kutchi.**

---

## 1. The core loop, and how it fits with Cook

**The loop (one round, 1–3 minutes).** Someone sets a task in Kutchi: Nani's list, the shopkeeper, or Nani asking where Simba has put the sweets. The task shows up as rows on the mission card (the order ladder). You look around a detailed, eye-level scene (drag to pan, on-screen buttons to zoom). You tap the thing you think was meant. If you're right, it arcs into your carried container (basket, tray, sweet box) and the row ticks. If you're wrong, the item wiggles, Nani says "Arre re!", tells you what you tapped and says the target again, and you try again. The difficulty comes from **which one**: there are look-alikes, duplicates in different places, other colours and other sizes. Only the Kutchi settles which one was meant, so finding things isn't hard in itself. At the end Nani asks for each thing back from the basket (the Game Design doc's recall step), stars fill, pocket money is paid, and the scene comes back later with new rows and a twist (a modifier).

**Why it's a different game from Cook.**

| | Cook with Nani | Find it |
|---|---|---|
| Core verb | **Build**: gestures in a sequence (pour, roll, flip, stir) | **Search**: scan, then tap. The only gesture is a tap (plus pan and open) |
| Camera | Straight down on a worktop, hands in frame | Eye level, looking into a room, stall or courtyard |
| What the Kutchi decides | What goes in, how many, in what order, for whom | **Which one, and where**: noun, count, position, colour, size |
| Where the fun comes from | Tactile juice, timing tension, the Simon-style memory of an order | The "found it!" moment, curiosity (everything reacts to a tap), combos, getting to know a scene |
| Syllabus weight | S1 nouns and numbers, S2 verbs, S5 first/then | S1 nouns and numbers, **S2 positions and colours**, then S4 animals and S5 past-tense clues |

**What it reuses (built once for Cook, used as they are):**

| Shared system | How Find it uses it |
|---|---|
| **Word pill** (full, item label, choice) | Full pill for the task line and list rows. Choice pill for "pass me" and the audio-choice questions. **Item labels are not used in the scene** (see section 5): in a search game they are the answer |
| **Order ladder** | Nani's list: one row per item, `speaker · dots · reveal · translate`. One dot per *item*, never per unit. Rows in random order. "Not the X" rows look the same as the others |
| **Three stars** shown as they happen | Ear = understood; **sharp eye** (this mode's own icon, a magnifier) = spotting skill; lightning (Busy) or tick (Relaxed, no help) |
| **Pocket money receipt** | 5 for helping, +5 ear, +3 sharp eye, +3 lightning or tick, a combo bonus, upgrades. Money is never lost |
| **Pass me** interrupt | Nani calls from the doorway mid-search: *Hedo! Muke hikdo {X} dine.* X is a word you've met that **isn't on the current list**, chosen from a look-alike group. This is spaced review |
| **Hints cost stars** | The same rules as the audit fixes: hearing it again costs tick; being shown costs ear (section 5) |
| **Levels as data** | `data/find.json`: `mechanics.<id>.levels` knobs (decoys, duplicates, clutter, pan width, list length, which kinds of qualifier are allowed). Scenes as data (anchors, hide spots, openables) |
| **Station lab** becomes the **Search lab** | Runs any mechanic on any scene with a random round, level buttons, a "Nani helps" tick and a **non-speaker bot** toggle (section 6) |
| **Free play** | An endless bazaar or sitting room built from due and weakest words, with a best combo; plus *Kasuku's minute*, a daily 60-second round |
| Greetings, recasts, "Arre re!", completion cards, the combo, Relaxed/Busy | As in Cook |

---

## 2. Mechanic library

### 2.1 What the research says (concrete mechanics and why they work)

| Reference | Concrete mechanic | Why it works | What we take |
|---|---|---|---|
| *June's Journey* | A list of 10–15 objects in a detailed scene. **Each object has one fixed position.** Scenes are replayed for up to five stars, and some rounds use Word or **Silhouette** lists | The pleasure of getting to know a place and getting faster in it. Replays make scenes cheap | Replaying the same scene with new rows. **Don't copy fixed positions** (remembering where things are would beat the listening) or **silhouette lists** (a picture of the answer) |
| *Hidden City* | Modes on the same scene: silhouettes, scrambled words, **"find 2 of the same"**, a night version, an upside-down version | Twists keep one piece of art fresh | "Find two", night (torch) and a changed scene as **language** twists, not visual ones |
| Hidden-object genre in general | A combo multiplier for quick finds in a row. A **misclick penalty** (time lost, multiplier reset). A small number of hints that recharge | The combo rewards flow. The misclick penalty stops people tapping everywhere | Combos, and a gentle guard against tapping everywhere: 3 wrong *items* in 2 s means a 2 s "slow down" (taps on scenery never count). **No** recharging free hints |
| *Hidden Folks* | Targets hidden **behind interactions**: unzip a tent, open a garage door. Almost every tap makes a (mouth-made) sound. Each target has a **short text clue**. Low pressure | Searching becomes finding out how the world works. Curiosity pays off. The clue makes it fair | Openable hiding places (curtain, cushion, cupboard, lid). Every scenery tap reacts. **The clue is Nani's Kutchi sentence** |
| *Where's Wally* and visual-search research | Clutter plus many similar distractors. In cluttered scenes, people need **longer descriptions** to pick one thing out. Children's search is **less organised** than adults' and improves with age | The difficulty is visual similarity, not size | Clutter and the length of the description rise together (noun, then noun + colour, then noun + position + colour). **Clutter is capped low for young players** |
| *I Spy* books | Rhyming riddles; the list is the game | Rhythm and rhyme "lure the ear"; for readers, the list is itself satisfying | *Kasuku's riddles* later, once the family can write short rhymes (never invented) |
| *Tiny Lands* | 5 differences per diorama: **position, size, colour**. Rotating reveals things hidden behind others | The categories of difference are exactly S2/S3 language | Spot-the-change, where the answer is chosen in Kutchi (M6) |
| *Pokémon Snap* | Photos scored on size, centring, pose, direction and other subjects in shot | Several goals per shot; a collection (the Photodex) | Held back (it overlaps the Snap mode). We borrow the **album as a collection** |
| Toca Boca | No fail state; everything reacts; open-ended | Safe for a 5-year-old; the player's own stories | Explore mode and free play: tap anything and it reacts. Warm failure everywhere |
| *Gus on the Go*, Lingokids | Hear and see the word, then a simple "tap the object" review; finishing reviews unlocks games | Hearing a word linked to a picture, then retrieving it | Stage-1 words taught in the scene (twinkle plus voice), then tested by listening only |
| Duolingo listening | Replay as often as you like; a **slow (turtle) replay** | Listening support without giving the answer | Replay and slow replay: they cost only the tick star |
| Total Physical Response (TPR) | Learners act on spoken commands and recombine known words into new commands | Understanding before speaking; low anxiety | Every row is a command you act on. Rows recombine known nouns, positions and colours |
| How children learn position words | *in* and *on* come first (age 2–3), then *under*, then *behind* before *in front of*; *between* later | This follows how children's thinking about space develops | Position words are introduced in that order (section 5) |
| Expanding retrieval (Fritz et al. 2007, preschoolers); spaced retrieval for word learning (Leonard et al.) | Retrieval attempts spread out at widening gaps beat massed practice | Recall from memory makes words stick | Rows are words that are due plus new words; "pass me" and the end-of-round recall are spaced retrieval |
| Corrective feedback meta-analyses (Lyster and Saito 2010) | **Prompts beat recasts**, although both help | The learner has to produce or choose the correction themselves | On a miss: a recast, **then the player retries**. The game never auto-shows the answer after a recast |
| Barrier games (referential communication) | One person describes, the other finds; the goal is shared | Both describing and understanding improve | Role reversal (M12), later |
| NN/g: children's touch targets | About **2 cm** targets for young children (4× the adult minimum) | Small hands, developing motor control | Bigger hit areas, zoom buttons, snap to the nearest item (section 4) |

Sources are listed at the end.

### 2.2 The candidates

Scoring: ●●● strong, ●● fair, ● weak.

| # | Mechanic | How it plays | Fun (why, reference) | Forces Kutchi: the decision, the "win without Kutchi?" test, leaks to avoid | Distinct | Plot | Play-again appeal |
|---|---|---|---|---|---|---|---|
| **M1** | **Nani's list** (bazaar hunt) | The spoken list is on the ladder. Tap each item in a busy stall, or across 2–3 stalls; count each unit into the basket; press *Done* (hand over the basket) | ●●● The list, combos and "found it" (*June's Journey*). The first errand is already built | ●●● **Which noun, how many.** Decoys come from look-alike groups (orange, lemon, peach). The count isn't capped: over-collecting costs the ear star. **Leaks:** a digit or per-unit dots on the row (show the digit only while the number is at word stage 1–2); the round ending by itself when the count is reached; item labels on the stall; silhouettes. **Passes** once those are closed | ●● Cook's pantry fetch is the same verb, but here the scene is the challenge (clutter, panning, several stalls) and it's the whole round, not one step | Arc 1 Ch1: fruit from the bazaar (built as `bowl-01`). Arc 2: threads and bangles | ●●● New rows each round, more stalls, longer lists (the bigger-bag upgrade), shopkeeper quirks |
| **M2** | **Where is it?** (position words) | The scene has **3+ copies** of the target in different places (a cup *on* the table, *under* it, *next to* the pot). The row says which: `{noun} [EN: under] {anchor}` | ●●● A twist on *I Spy* / *Where's Wally*: "there are three… which one?" | ●●● **Only the position phrase** separates the copies. **Leaks:** only one copy visible; the right copy is always the most visible one; arrow or position icons on the row; the anchor duplicated so rarely that the anchor word alone is enough. Rule: every row has ≥3 copies across ≥3 relations, and from level 3 the anchors are duplicated too ("under the *red* chair") | ●●● No other mode tests positions by *finding*. Tidy up tests them by *placing* | Arc 1 Ch3 (the sweets), Ch5 (Nana's cap). Arc 3 chicks. Arc 4 the ring | ●●● Hide spots are shuffled every round; seven relations; the anchors change with the scene |
| **M3** | **Which one?** (describe to find: colour, size) | Sets of the same noun that differ in colour or size. The row says `[EN: red] {noun}` or `[EN: the big one]` | ●● Satisfying picking; Simba (big) and Zazu (small) as the running example | ●●● **The adjective alone** decides. **Leaks:** the row tinted in the colour, or showing a swatch; only one red thing in the scene; size shown by the size of the row's text. Rule: ≥3 of the noun in ≥3 colours or 2 sizes, and at least one *other* noun in the target colour | ●● Dress up uses colours for *styling*; this is *picking out* | Arc 1 Ch4: Big Ma's sewing box ("the red thread", "the big scissors"). Ch3: the big sweet or the small one | ●● Colours × nouns give many combinations. Adds "not the red one" (a *no* row) |
| **M4** | **Simba's mischief** (hide, clue, open) | Simba and Zazu have scattered the sweets. Nani says where she saw them go. Things **behind openables** (curtain, cushion, cupboard door, basket lid): tap to open. A tail sticks out, a bell tinkles, paw prints lead somewhere | ●●● *Hidden Folks* interactions, the cats as a running gag, funny reactions (Zazu hiding in the tiffin) | ●●● **Which openable to try** is set by `[EN: behind] {anchor}`. **Leaks:** opening everything (guard: 8–12 openables per scene, and every wrong open is a miss for that row); the tail or bell showing the answer (they're decoration and point to a cat, not always the sweet); the sweet box's empty slots giving away the count (fine: the picture is the meaning; but the *where* must come from the voice). **Passes** | ●●● Openables and a trail make it a different feel from M1 to M3 | **Arc 1 Ch3 "The cat and the sweets"** (flagship). Arc 3 chicks (they peep and move). Arc 4 "following clues" | ●●● Cats choose new spots every round, new openables per scene, the cats' tricks (Zazu moves a sweet once), a collection of the funny finds |
| **M5** | **Check the bag** (the odd one out) | The shopkeeper packs your basket and **gets one thing wrong**. Tap the item that wasn't on the list (or is the wrong count) and hand it back; he says sorry and swaps it | ●● A short "gotcha" and a sense of being in charge. The cast already has this quirk | ●●● You must know **what was asked**. The list rows are dots from stage 3; bag items have no labels. **Leaks:** the wrong item visibly different (another category, or the only one of its kind): use a look-alike from the same group; English on the rows. **Passes** | ●●● Correcting someone. No other mode does it | Arc 1 Ch1 twist; the shopkeeper in every bazaar visit | ●● A cheap twist on any M1 round. Later: wrong colour, wrong size, wrong count |
| **M6** | **Spot the change** | Look at the scene; the lights flicker (or Simba runs past); something has changed. **Tap what changed, then pick, by ear, which of 3 Kutchi sentences says what happened** | ●●● *Tiny Lands* / spot-the-difference: memory tension | ●● **Spotting is visual only (not Kutchi)**; the ear star comes from choosing the sentence (`{noun} [EN: under] {anchor}`, later `[EN: Simba took the {noun}]`). **Leaks:** text or pictures on the choices (audio-only buttons until the reads profile reaches stage 3); two choices that are clearly impossible | ●● The only memory mechanic; it overlaps *Who did it?* on the "what happened" side | Arc 1 Ch3 lead-in to "Who ate one?". **Arc 4 "It's gone"** (past tense, S5) | ●● Changes of position, colour or size; more changes at higher levels |
| **M7** | **Kasuku's minute** (the daily find) | In the hub, Kasuku squawks 3–5 words he has "overheard" (the player's weakest words, in the family's recordings, pitch-shifted). Find each in the kitchen scene before he gets bored | ●● A tiny daily ritual (Wordle-sized) and a funny parrot. For the Farah persona | ●●● Pure listening: the noun, with no list text at all. **Leaks:** Kasuku's hub chatter giving answers away in other tasks (the cast rule stays: he's quiet during *other* tasks) | ●● A presenter skin on M1, but its daily, hub-only, weakest-words shape is its own thing | Hub, every arc | ●●● New every day, always the weakest words; a count of "days with Kasuku" that never resets |
| **M8** | **Torch** (night search) | A power cut or dusk: the scene is dark, and a torch circle follows your finger. The battery is gentle but real. Simba's bell rings from a place | ●●● A strong atmosphere change on the same art (*Hidden City* night mode). Tension without failure | ●●● The position phrase **saves battery**: sweeping the whole scene blind runs it down. **Leaks:** a big torch making the clue unnecessary (the torch upgrade widens the beam a little, never to full-screen); the bell always at the target | ●●● A modifier, not a new engine | **Arc 3 Monsoon** (the leak, a power cut; the chicks at dusk). A free-play modifier on any scene | ●●● Any scene at night; the bigger-torch upgrade |
| **M9** | **Nani's day** (the scene changes with the time of day) | The same courtyard or room in the morning, midday and evening; things move with the routine (Nana's glasses on the charpai in the morning, on the shelf at night). Nani says *when*, and the player turns a sun dial to that time, then finds it | ●● The world feels alive; the same place changes (cosy-game progression) | ●● **The time-of-day word** decides the view, then the noun and position. **Leaks:** only one time having the object in it; lighting giving the time away (fine, since the picture is the meaning, but the *word* must be what picks it) | ●● Unique, but it costs art per time of day | **Arc 3** ("Nani's day" fills the times-of-day gap, S4) | ●● Three versions of each scene cheaply (grade plus lamp layers) |
| **M10** | **Who has it?** (people in the bazaar) | Several sellers and shoppers; the row says who: `[EN: the man with the red cap]`. Tap that person to buy or ask | ●● *Where's Wally* with people | ●●● Describing people (S3). **Leaks:** only one person fitting any single feature. Needs combinations | ● Overlaps *Who did it?* (deduction about people) | Arc 2 (the bazaar with outfits; buying threads) | ●● Many combinations once people are layered sprites |
| **M11** | **Photo** | Frame the described thing with a camera viewfinder; graded on the right subject, centring and size | ●● *Pokémon Snap* scoring and the album | ● The subject comes from Kutchi, but framing is visual skill. It overlaps the **Snap** mode | ● Belongs to Snap | Arc 5 | ●● The album |
| **M12** | **Role reversal** (you describe, the cousin finds) | The older cousin has lost his cap. You can see where it is; you pick audio chunks (`{anchor}` + `[EN: under]`) and he looks there. Grandparent mode: say it aloud instead, and Nani marks it | ●● Being the expert (a barrier game); a funny cousin | ●●● Production: choosing the right chunk needs the meaning. **Leaks:** icons on the chunk buttons (audio only; text only for readers at stage 3) | ●●● The only production-first search | The older cousin from Arc 1 Ch2 onwards; his payoff in later arcs | ●● Any M2 round flipped |

**Also rejected:** silhouette lists (a picture of the answer); fixed item positions (*June's Journey*); a free hint that recharges (hints must cost stars); bargaining as a gamble (Game Design's rejected "double or nothing"). **Counting coins to a spoken price** is fine for **Arc 2**, once prices exist.

---

## 3. Recommended first set

**Build one search engine where rows are data, then three mechanics on it.** M1 to M3 are one engine: a row is `{noun, count?, colour?, size?, position?, not?}`, so M2 and M3 are just new slot types, the way a Cook recipe is station calls with slots.

| Order | Mechanic | Why first |
|---|---|---|
| 1 | **M1 Nani's list**, with **M5 Check the bag** as its twist | It replaces the built fruit-bowl bazaar, so Arc 1 Ch1 plays in the new engine. It runs on words that already have Kutchi drafts (fruit, veg, spices, 1–10). M5 costs almost nothing and gives the shopkeeper's "wrong thing" quirk a job |
| 2 | **M2 Where is it?** | S2's main job. It's the strongest "only the Kutchi decides" mechanic. The scene-data work (anchors and hide spots) is needed by everything after it |
| 3 | **M3 Which one?** | Colours and big/small; Big Ma's sewing box in Ch4; almost free once M2's duplicate spawning exists |
| 4 | **M4 Simba's mischief** | The Arc 1 Ch3 flagship and the most *Hidden Folks* juice (openables, cats). It's built after 2, because its clues are position rows |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| M7 Kasuku's minute | **Straight after the first set** | Cheap (M1 in the hub with no list text), a daily hook; needs only existing recordings |
| M8 Torch | As a free-play modifier after M2; in the story in Arc 3 | Needs position words known first, otherwise it's just a slow sweep |
| M6 Spot the change | Arc 1 Ch3 lead-in at the earliest; really Arc 4 | Needs recorded sentence choices; past tense is S5 |
| M9 Nani's day | Arc 3 | S4 words; three versions of the art per scene |
| M10 Who has it? | Arc 2 | S3 describing people; people as layered sprites |
| M12 Role reversal | When produce stages exist; Grandparent mode | Production, not listening |
| M11 Photo | Never in Find it | Belongs to the Snap mode |

**Arc 1 with Find it:**

| Chapter | Find it errand |
|---|---|
| The guests are coming | Fruit from the bazaar (M1 + M5) |
| Knock knock | Optional: the cousin's lost cap (M2, a first taste) |
| The cat and the sweets | **Find the sweets** (M4 using M2 rows) → *Who did it?* → Tidy up |
| The spill | **Big Ma's sewing box**: the red thread, the big scissors (M3). Replaces v2's "fabric by colour", now that Big Ma mends the kurta |
| Eid morning | Nana's prayer cap and the Eidi envelope (M2 + clothes nouns) before getting dressed |

---

## 4. Scenes and art

### 4.1 Camera per scene (art bible section 3: one camera per scene)

| Scene | Camera | Width | Anchors (objects that positions are relative to) | Used in |
|---|---|---|---|---|
| Bazaar lane | **E**, customer's side, horizon about 55% | 2 screens (3200×900), pan | 3 stalls, crates, baskets, the scale, an awning | Arc 1 Ch1, Arc 2, free play |
| Nani's sitting room | **E** | 1.5 screens | Sofa/bolster, low table, curtain, cupboard, rug, window sill | Arc 1 Ch3 and Ch5, Arc 4 |
| Big Ma's room / sewing box | **E** for the room; **T** close-up of the open box (like the spice cupboard close-up) | 1 screen each | Box trays, pincushion, spools, the machine | Arc 1 Ch4, Arc 2 gift |
| Courtyard | **E** | 2 screens | Charpai, hen coop, water pot, tree, steps, doorway | Arc 3 chicks, Nani's day; Arc 5 |
| Nani's bedroom / dressing table | **E** | 1 screen | Dressing table, drawers, jewellery box, bed, trunk | Arc 4 the ring |
| Kitchen (hub) | **E** (as the hub) | 1 screen | Island, shelves, window sill, stove | Kasuku's minute |

Items use the **F view**, shared with the pantry and stalls. The ingredient library is already shared with Cook (Cook to-do, "Then").

### 4.2 What must be separate layers

| Layer | Why |
|---|---|
| Background: walls, floor, fixed furniture, **with no painted findable things** (playtest lesson 15) | Items are placed by data every round |
| **Every findable item and every copy or decoy** | Shuffled into hide spots per round; states: normal, found |
| **Occluders cut from the background**: sofa front, table apron, curtain edge, counter front, crate rims | So "behind" and "under" show part of the item, drawn in the right depth |
| **Openables** with closed and open frames: curtain, cushion, cupboard door, basket lid, tiffin, drawer | M4; each also reacts to a tap when empty |
| Cats (Simba, Zazu): peeking, tail out, asleep, running | Mischief and clues; shared with the hub |
| Carried container (back, items, front rim) | Layout contract v2 |
| Ambient motion (awning, bunting, lantern, steam) and scenery that reacts to taps | *Hidden Folks* curiosity |
| Darkness mask (code), time-of-day colour grade (code) plus a few swap layers (lamps lit, shadows) | M8, M9 without repainting |
| Arc dressing (Eid bunting, monsoon buckets, wedding marigolds) | The same scene reused across arcs |

### 4.3 Hide-spot rules (fair, never a pixel hunt)

**Principle: hard to decide, easy to see.** The challenge is the language (which one, where), not spotting a speck.

- **Visibility:** at least 40% of an item shows unless it's behind an openable, and an openable with something in it looks the same as an empty one (no glint).
- **Size:** 90 px is the minimum drawn size on the 1600×900 stage (art bible). The **hit area is padded to about 130 px**, and a tap snaps to the nearest findable item within that radius. On a phone, 90 px is about 0.6 cm, far below the roughly 2 cm recommended for young children, so **on phones the round opens zoomed 1.5×** with pan (buttons plus drag, no pinch). For 5-year-olds, a tablet is the target device.
- **Safe zones:** nothing findable in the outer 5% of the scene, under the carried container's rectangle, or where the sidebar or drawer could cover it (the tap-cover test before every tap stays).
- **Contrast:** an item never sits on a background of nearly the same hue (a minimum luminance difference, checked by `place_preview.py`).
- **Scale and surfaces:** art bible scale order; contact shadow; sunk about 4 px; every item touches a surface.
- **A density knob per level:** decoys, copies and clutter. Level 1 (and any stage-1 word): fewer than 8 findable things on screen, no openables. The clutter cap is tied to the *player's* level, not the scene.
- **Anchors are tappable scenery**, never findable targets in the same round, so "under the table" never makes the table itself a wrong answer.
- **No two copies of a target in the same relation to the same anchor.** Each hide spot is a unique `(anchor, relation)`.

### 4.4 Layout spec before art (the process)

1. **Scene spec as data first:** `data/scenes/<scene>.json` gains `anchors` (id, word id, rectangle), `spots` (anchor, relation: in, on, under, behind, next-left, next-right, in-front, between, with x, baseline, depth and how much is hidden), `openables`, `occluders`, pan width and safe zones.
2. **Greybox in the Search lab:** grey boxes for anchors, placeholder items. Play M1 to M4 on it, then run the non-speaker bot (section 6).
3. **The "can you win without Kutchi?" audit** of that scene (enough copies per relation? any dominant spot?).
4. **Write the art brief from the spec:** the list of anchors, empty surfaces where spots are, no painted items, occluder edges to be cut out.
5. **Generate the empty background**, then items by **edit in place** (the Cook pipeline) for angle, scale and light; cut out the occluders.
6. **`place_preview.py` plus the visual QA checklist** (angle, surface contact, shadow, scale, nothing covering a tap, contrast).

### 4.5 Reusing scenes

| Scene | Arc 1 | Arc 2 | Arc 3 | Arc 4 | Arc 5 |
|---|---|---|---|---|---|
| Bazaar lane | Fruit list (day) | Threads, bangles, prices | Rain awnings (grade) | The crow trade | — |
| Sitting room | Sweets, Eid cap | Wedding gifts piled up | Power cut (torch) | Following clues | — |
| Courtyard | — | Mehndi night (evening grade) | Chicks, Nani's day ×3 | Footprints | The farm |

Each scene has 3 time grades × arc dressings × modifiers (torch, "find two"), so one background makes about 10 different-feeling rounds.

---

## 5. Learning design

### 5.1 What it teaches

| Stage | Words | Frames (existing Kutchi, or a placeholder) |
|---|---|---|
| S1 | Fruit, veg, spices, staples (drafts in `content.json` and `cook.json`); numbers 1–10 | *Muke {n} {X} khape.* · *Ne {X}.* · *Muke hikdo {X} dine.* · *Ghan.* · *Arre re!* · *Hedo!* · `[EN: How many?]` (snt-09, no Kutchi yet) · `[EN: Well done!]` (snt-13, no Kutchi yet) |
| S2 positions | in, on → under → behind → next to → in front of → between (the acquisition order) | `{X} {anchor} [EN: under]`: Kutchi positions come **after** the noun (Roadmap syllabus); each `(anchor, relation)` is one recorded phrase |
| S2 colours, household, sweets, clothes | 10 colours (Round 1, Q11); household objects (Q8); **sweets (mithai names: not asked yet)**; Eid clothes (Q9) | `[EN: the red one]` · `[EN: not the red one]` · `[EN: this / that]` |
| S3 (borrowed early) | big and small (Cook's roll already needs them) | `[EN: the big one]` · `[EN: the small one]`: agreement is needed (see 5.5) |
| Later | S4 animals and times of day; S5 `[EN: Simba took it]`, `[EN: where did it go?]` | Arc 3 and Arc 4 |

**Rows grow in step with clutter** (the *Where's Wally* finding): level 1 is the noun only; then noun + count; then noun + position; then noun + colour/size; then noun + position + colour, with anchors duplicated.

### 5.2 Word-stage fading (the one-place-text rule)

| Word stage | List row (the instruction) | In the scene (the help) |
|---|---|---|
| 1 New | Text + speaker; Nani says it; the target **twinkles** as she says it (pulse sync). Taught, not tested: doesn't count for the ear star either way | Tapping it names it |
| 2 Learning | Text + speaker | No twinkle, no labels |
| 3 Nearly known | Speaker only (dots) | Nothing |
| 4 Known | Heard once; replay costs tick | Nothing |

- **No item labels in the scene at any stage.** In Cook, labels help with the *next* step; here, a label *is* the answer. Stage-1 teaching happens through the twinkle and the voice.
- **Tapping an item to hear its name** is allowed in **Explore** (free play with no rows) and for stage-1 words only. During a round, a tap on a findable item is an answer.
- **Counts:** **no digit for the count asked for, at any stage** (25 Sept, calm sidebar: a digit beside the row answered "how many?" without the Kutchi number word, and the non-speaker bot read it off the row). The row shows only the running tally ("×2": how many are in the basket so far, never what's left). Tallies count aloud at stage 1–2 and silently from stage 3; no ending by itself; press *Done*.

### 5.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | Nani says the row again (tap the row speaker) | Free the first time; after that, the tick (Relaxed) or patience drain (Busy) |
| 2 Slow replay | Half speed, a pause before the key word (Duolingo's turtle) | Tick / patience |
| 3 Warmer | Nani looks and gestures towards **a third of the scene**; the rest dims. It must still hold **at least 3 candidates** (copies or look-alikes) | Tick + the combo breaks; the ear star stays (you still have to understand) |
| 4 Reveal (eye) | Shows the row's Kutchi text (never English) | Ear star for that row, from stage 2 |
| 5 Translate | English gist | Ear star for that row |
| 6 Shown | Stage 1 only automatically; otherwise after 2 misses on a row, the target glows | Ear star for that row; the word doesn't advance |

- Hesitating never auto-shows the answer. After about 8 s, Nani just replays the line (rung 1, free the first time). This closes the audit's "wait for the glow" leak.
- **No upgrade may make a hint cheaper** (v2's "faster hint recharge" is dropped). Upgrades only help the physical side: the torch's beam, the zoom lens, the bigger bag, faster panning.

### 5.4 Mistakes: a recast, then the player tries again

On a wrong tap: the item wiggles, then *Arre re!* {the name of what you tapped} … {the row said again}. For a wrong copy: `{X} {anchor} [EN: on]`, then the target phrase said again. **The player then finds it themselves** (a prompt beats a recast); nothing is shown. The miss counts against the ear star for that row (see Q3) and marks the word as a miss. Two misses in a row drop the word a stage (existing rule).

**Spaced retrieval in every round:** rows are due words plus up to 3 new ones, weakest first. "Pass me" asks for a met word that isn't on the list. At the end, Nani asks for each item back from the basket (it counts towards the ear star). *Kasuku's minute* covers the weakest words daily.

### 5.5 What's needed from the family (English placeholders until then)

| Need | Status |
|---|---|
| Six position phrases (under, behind, next to, in front of, between, on top of) **and "in"** | Asked (Round 1, Q3), awaiting answers. Add "in" |
| **Does the anchor noun change before a position word** (like Gujarati "table-**ni** niche")? This decides whether we record per anchor or build from chunks | New question |
| Colours (10) | Asked (Round 1, Q11) |
| "The red one", "the big one", "the small one", "not the red one": do they change with the noun's gender or number? | New (links to Round 1, Q1) |
| Household anchors for each scene (sofa, table, curtain, cupboard, cushion, shelf, charpai…) | Partly asked (Q8); send the anchor list per scene |
| Sweet names (the Ch3 mithai box) | New |
| Eid clothes (prayer cap and others), the Eidi envelope | Asked (Q9) |
| Frames: "Where is it?", "Find the…", "Here it is!", "Look!", "Not that one", "How many?", "Well done!", "Simba took it" | New (two are in `content.json` with no Kutchi) |
| Whole phrases recorded per scene: about 6 anchors × 7 relations = 42 short phrases, one long take | For the recording session |

---

## 6. Lessons from Cook, applied from day one

- [ ] **The audit comes first.** This doc audits every mechanic (section 2.2). The audit is repeated after each build step, per mechanic *and* per scene.
- [ ] **The non-speaker bot (the wife's test as code).** A Search lab test player that sees only what's on screen: it taps the most visible, the biggest, whatever matches row length or order, and tries every openable. It must earn the ear star in **fewer than 10%** of rounds. Cook found its leaks by reading the code; here a test finds them.
- [ ] **Every decision comes from Kutchi and changes every round.** Hide spots are shuffled; no fixed positions, no fixed first row, no customer habits that decide the answer. Anchors vary.
- [ ] **Help that shows the answer costs the ear star** (glow, reveal, translate, "shown"); hearing it again costs only tick; Busy help drains patience. Hesitation never auto-shows the answer.
- [ ] **The screen never gives the answer away:** no pictures, silhouettes, colour swatches, arrows or tinted text on rows; one dot per item; "not" rows styled like the others and placed at random; any-order rows in random order; no "2 of 3" style English.
- [ ] **Decoys come from look-alike groups** (symmetric), so the trio looks the same whichever member is asked for.
- [ ] **"Not" and counts are real decisions:** a "not the red one" item is always on screen; counts never end by themselves; *Done* is always there; over- and under-collecting are both graded.
- [ ] **The one-place-text rule:** the word is written on the row *or* nowhere; no item labels in the scene; label-speaker matching is impossible in rounds.
- [ ] **Shared systems from the start:** word pills, ladder rows built from the round's data, stars shown as they happen, the receipt, completion cards, pass me, greeting the shopkeeper, Relaxed/Busy, levels as data, the Search lab, a free-play entry.
- [ ] **Visuals:** one camera per scene; the layout spec and greybox before any art; contact shadows; no painted findables; the visual QA checklist on every screenshot.
- [ ] **Clear actions:** a see-through fingertip demo the first time for pan, zoom and open; one goal line in the sidebar; cues on the object, never over the scene; the sidebar never covers the play area.
- [ ] **Tests:** six screen sizes including 16:10 and a 375 px phone; the tap-cover check before every tap; Claude looks at the screenshots.
- [ ] **Upgrades automate the physical, never the listening.**
- [ ] **Placeholder English is flagged** in the audit as "not yet a Kutchi test". The position and colour rows can't pass until the family's words arrive, so **chase Round 1 Q3 and Q11 before building M2 and M3**.

---

## 7. Risks and open questions for Zafar

**Risks**
- **Small screens:** dense scenes on a 375 px-tall phone. Mitigation: open zoomed in, snap to the nearest item, low clutter at low levels. Tablet as the target device for 5-year-olds.
- **English placeholders make M2 and M3 untestable** for language (anyone who speaks English understands "under"). The family's words come first.
- **Recording load:** positions × anchors per scene. It depends on the grammar question in 5.5.
- **Art:** separated layers (occluders, openables) are harder than one pretty cluttered picture. Edit in place plus the greybox spec keep it under control.

**Questions**
1. Does the built fruit-bowl errand (Shopping) move onto the Find it engine (M1 + M5), as v2 implies ("Shopping dropped as a mode")?
2. **The second star:** is "sharp eye" (a combo: each find within a generous par time, measured from the end of Nani's line) the right non-language skill star, or would you prefer a collectible find per scene (Zazu peeking, a hidden Eid star)?
3. **Ear star leniency:** lost at the first miss (as in Cook), or a half star after one miss (the audit's suggestion), so it's worth staying careful?
4. **Kasuku as a task-giver** in *Kasuku's minute*: is that OK alongside the cast rule "never speaks during a task" (the rule would then cover *other* tasks)?
5. **Scene width:** are panning scenes (1.5–2 screens) acceptable, or should every scene fit one screen with zoom only?
6. Arc 1 Ch2: add the cousin's lost cap (M2 taste), or keep Ch2 as greetings and Tidy up only?
7. Which sweets go in Nani's mithai box (for the Round 3 questions)?

---

## Sources

- Hidden Folks: [Behind the Game, Stefan Lesser](https://medium.com/@stefanlesser/behind-the-game-hidden-folks-e6198dfa885a); [SCMP review](https://www.scmp.com/culture/arts-entertainment/article/2077086/game-review-hidden-folks-searching-game-surreal-animation); [AppUnwrapper guide (clues)](https://www.appunwrapper.com/2017/02/15/hidden-folks-walkthrough-guide-hints-and-tips/)
- June's Journey: [Naavik deep dive](https://naavik.co/deep-dives/junes-journey-hidden-object-game/); [Fandom: Hidden Object Scene](https://junes-journey.fandom.com/wiki/Hidden_Object_Scene)
- Hidden City: [Exploration Modes (Fandom)](https://hidden-city-mystery-of-shadows.fandom.com/wiki/Exploration_Modes)
- Hidden-object combos and misclick penalties: [Gamezebo, Hidden Express walkthrough](https://www.gamezebo.com/walkthroughs/hidden-express-walkthrough/)
- Tiny Lands: [Indie Hive review](https://indie-hive.com/tiny-lands/); [TheSixthAxis review](https://www.thesixthaxis.com/2021/03/09/tiny-lands-review/)
- Pokémon Snap scoring: [Game8 photo scoring guide](https://game8.co/games/New-Pokemon-Snap/archives/328684)
- I Spy: [Walter Wick Studio](https://www.walterwick.com/books/i-spy)
- Where's Wally and visual search: [Clarke et al., Frontiers 2013 (salience and referring expressions)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00329/full); [The development of organized visual search (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3651801/)
- Toca Boca: [Grokipedia overview](https://grokipedia.com/page/Toca_Boca)
- Gus on the Go: [gusonthego.com](https://www.gusonthego.com/); Lingokids: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/lingokids-play-and-learn)
- Duolingo slow replay: [Duolingo blog](https://blog.duolingo.com/learning-with-hearing-aids/)
- TPR: [Liu et al. 2024, SAGE Open](https://journals.sagepub.com/doi/full/10.1177/21582440241288924)
- Position-word acquisition: [Speechie Trish summary](https://www.speechietrish.com/blog/preposition-and-spatial-concept-acquisition); [Cox 1981, "in front of" and "behind"](https://dx.doi.org/10.1177/016502548100400304)
- Retrieval practice: [Fritz et al. 2007, expanding retrieval in preschoolers](https://journals.sagepub.com/doi/10.1080/17470210600823595); [Leonard et al. 2024, spaced retrieval and word learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC11365034/)
- Recasts vs prompts: [Lyster and Saito 2010, SSLA](https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/oral-feedback-in-classroom-sla/4999EE1C8379B2BF026B148EAF373CA1)
- Barrier games: [ASHA, barrier game format](https://pubs.asha.org/doi/10.1044/jshd.5401.33)
- Touch targets for children: [NN/g, children's physical development](https://www.nngroup.com/articles/children-ux-physical-development/)
