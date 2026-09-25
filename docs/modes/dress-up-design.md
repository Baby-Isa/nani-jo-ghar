# Dress up: design (mode id `dress-up`)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar. Nothing built. Follows `docs/modes/MODE-DESIGN-BRIEF.md`. Builds on `docs/game-modes-v2.md` (mode 4), `docs/find-it-design.md` (the model), `docs/cook-with-nani-phase-a-design.md`, `docs/cook-with-nani-kutchi-audit.md`, `docs/cook-with-nani-todo.md` (Waves 1–5) and the Art Bible.
**Placeholder rule:** the Kutchi below uses only words and frames already in `data/content.json` or `data/cook.json`. Anything written `[EN: red]` has no Kutchi yet and shows in the game as a grey italic English placeholder until the family gives the word. **Never invent Kutchi.** Right now the repo has **no Kutchi for any clothes, colour, pattern or weather word**, so every decision word in this mode starts as a placeholder (section 6.6 is the ask list).

---

## 1. Pitch and core loop

**Pitch.** Big Ma, the family's seamstress, runs the fittings in her room. Family members and guests come in and say, in Kutchi, how they want to look: *"Muke [EN: red] [EN: kurta] khape. Ne [EN: white] [EN: cap]."* You dress them from Big Ma's rail, shelf and shoe rack, finish the look with her tools (iron out a crease, stitch a border, pin a dupatta), then they turn to the mirror and check it piece by piece. The mode exists because **S2 needs clothes nouns and colours, S3 needs adjectives that bind to nouns, and S4 needs weather and "I'm cold"**, and "dress someone exactly as they ask" is the one game where the player has to hold several adjective + noun pairs together and put each on the right part of the right person. The fun is *Style Savvy*'s customer who wants something particular, *Dress to Impress*'s ticking wardrobe and reveal, and *Crafting Mama*'s tactile sewing, with the language as the only way to know what's wanted.

**The loop (one fitting, 60–120 s).**
1. The client arrives; a greeting choice (as in every mode; *Salamun alaykum*, or the Eid greeting on Eid).
2. **Intro card:** the client's face, then one line per piece (speaker · word or •••). It shrinks into the sidebar. **Three seconds of silence** before anyone speaks again.
3. **Dress:** tap a piece on the rail, shelf or rack; it swishes onto the client. Tap a worn piece to send it back. Every slot starts in the client's plain house clothes, so nothing looks "missing".
4. **Finish:** one short hands-only task at Big Ma's table (iron, stitch, pin, button). Big Ma hums her song here, and only here.
5. **Done → the mirror:** the client turns to the mirror and names each piece as they check it. Right: a sparkle and a nod. Wrong: *Arre re!* + what you put on + what they asked for; **you fix it yourself** (a prompt, not a correction).
6. Stars, pocket money, a snapshot into **Big Ma's lookbook**, and an end-of-round **word review** (Kutchi → English).

**How it differs from Cook and Find it.**

| | Cook with Nani | Find it | **Dress up** |
|---|---|---|---|
| Core verb | **Build**: gestures in sequence over time | **Search**: scan, then tap the one meant | **Style**: compose a whole look on a person, slot by slot, then finish it by hand |
| Camera | T, straight down on a worktop | E, into a cluttered room | **E, full body, front** (fitting corner) + **T** close-up of Big Ma's sewing table |
| What the Kutchi decides | What, how many, what order, for whom | Which one and where in a scene | **Which garment, in which colour or pattern, on which person, for which weather**: several adjective + noun pairs that must each land on the right slot (binding) |
| The satisfaction | Juice, timing, memory | "Found it!" | The transformation and the mirror reveal; making something with Big Ma |
| Syllabus weight | S1, S2 verbs, S5 first/then | S1, S2 positions and colours | **S2 clothes and colours, S3 adjectives, possessives and kinship, S4 weather and feelings** |

**What it does *not* do** (other modes' verbs): finding a lost cap in a room is Find it; folding clothes into the wardrobe and mehndi patterns are Tidy up; "who's the man in the red cap?" is Who did it?; photographing is Snap.

---

## 2. Research summary

### 2.1 Proven hits: what we borrow and why

| Reference | Concrete mechanic | Why it works | What we take / leave |
|---|---|---|---|
| ***Dress to Impress*** (Roblox, 6bn+ visits) | One theme for the whole server, shown in a **banner for the whole round**, with a visible timer (about 6 minutes) in a dressing room; then a **runway** walk; others rate 1–5 stars; stars and cash for placing. Items take **colour wheels, patterns and toggles**; guides say "read the theme, commit to a small palette, one fitting prop" | A clear brief + time pressure + a public reveal. Customising a piece (colour, pattern) makes it yours. Fast rounds, huge wardrobe | **Take:** the brief that stays on screen (our order card), the visible timer in Busy, the reveal (the mirror), tintable garments with pattern options. **Leave:** player voting (multiplayer, subjective, a privacy problem for children) and the paid VIP room |
| ***Project Makeover*** | A client with a problem; a fixed plan (hair, outfit, room); **three options per item**; a before/after **reveal**; the client writes a thank-you letter later | Low decision load (3 choices), an emotional payoff, a character you helped | **Take:** the reveal and the grateful client (they wear it in the hub later, section 7.4). **Leave:** match-3 to earn the clothes (the language would be bolted on), and 3 options (too easy to guess; we use 8+ per slot) |
| ***Style Savvy*** (Nintendo) | Customers ask for **something specific** ("a plaid skirt", "a cardigan to keep warm", "an outfit to go with this hat"); you pick from your own stock and present it; they buy if they like it, and some come back with more | The request *is* the puzzle; you learn customers; the stock is your toolbox | **The closest fit.** Our client's spoken request is the brief; the rail is the stock; "to keep warm" becomes our weather rounds. Budgets and prices wait for Arc 2's money (and belong to shopping) |
| ***Covet Fashion*** | Themed challenges with **hard requirements** ("wear red lipstick, two pieces of silver jewellery") plus free styling; community votes | Requirements give a fair, checkable core; free choices give ownership | **Must-haves + free choices** (D8): the spoken must-haves are graded; everything unspoken is the player's own, never graded |
| ***Love Nikki / Shining Nikki*** | Each stage asks for **attributes and tags** (lively, warm, "pyjamas"); items carry tags; scoring weights them; some tags are essential | Styling becomes a readable, scoreable puzzle | Our grader scores **tags said in Kutchi** (colour, pattern, length, warm/cool for weather), never taste |
| ***Toca Hair Salon 4*** | No fail state; you can regrow hair you cut too far; everything reacts | Safe for a 5-year-old to experiment | Warm failure; everything can be undone; Explore mode (tap to hear, no grading) |
| ***Crafting Mama*** (DS, Metacritic 75) | A project split into stylus mini-games: **sew, cut, pin, fold, paint**; a practice mode per step | Each craft step is a small tactile verb, like Cooking Mama | Big Ma's **finishing tasks** and the sewing table (D2, D3). This is where the craft star comes from |
| *ABCya Dress for the Weather* and preschool weather games | Look at the weather, choose clothes | Weather → clothing is a classic early-years pairing | **Leave the "look at the weather" part:** the picture would answer it. Our weather is *heard*, and the window stays curtained until the reveal (D4) |

### 2.2 Language-learning evidence

| Evidence | Finding | Design consequence |
|---|---|---|
| Total Physical Response (Asher; Liu et al. 2024) and clothes TPR classroom games ("race to dress a team member in what the teacher calls") | Acting on commands builds comprehension before speech; clothes are the classic TPR set | Every row is a command you act on; rows recombine known nouns and colours into new looks each round |
| **Colour words are "slow-mapped"** (Wagner, Dobkins and Barner 2013; Frontiers 2025, Japanese children) | Children produce colour words around 2–3 but take years to settle the **boundaries** between them | Level 1 uses well-separated focal colours (red, blue, yellow, green, white, black); neighbours (red/pink/orange, blue/purple) come later as a difficulty knob |
| **Adjectives are learned against a contrast within one kind** (Klibanoff and Waxman 2000); "adjectives really do modify nouns" (Mintz and Gleitman 2002); review: Syrett 2024 | 3-year-olds extend a new adjective only within the same basic-level kind; naming the noun with the adjective helps | The rack always shows **the asked garment in 3+ colours** (contrast within a kind), and a row always says the noun with its adjective |
| Retrieval practice (Fritz et al. 2007; Leonard et al. 2024), as in Find it | Spaced retrieval beats massed practice | Rows = due words + up to 3 new ones; Big Ma's "pass me"; the mirror check re-hears every word |
| Corrective feedback (Lyster and Saito 2010) | Prompts beat recasts | Recast at the mirror, then the player fixes it; the game never swaps the piece for you |
| Barrier games (ASHA) | Describer and doer share a goal | Role reversal: you tell Ali what to wear (D10) |
| NN/g touch targets for children | About 2 cm targets | Garments are big targets (a kurta on a hanger is about 180 px); caps and bangles sit in trays with padded hit areas |

**Blocked pages:** `stylesavvy.fandom.com` and `bluestacks.com` were blocked by the network proxy; those rows use the search summaries.

---

## 3. Mechanic library

Scores 1–5. Reasons are one line. "Forces Kutchi" names the decision, the leak risks and the fix.

| # | Mechanic | How it plays | Fun | Forces Kutchi | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **D1** | **The fitting** (dress them as they ask) | The core loop in section 1. Rows are `{slot, garment, colour?, pattern?, length?}` | **4** Transformation, swish, mirror reveal, a grateful client (*Style Savvy*, DTI) | **5** *Which garment in which colour on which slot.* Leaks: base clothes already matching; rack holding only the asked colours; the client's "signature" colour; the Eid default (cap for Nana); fixed head-to-toe row order; reacting to each piece before Done. Fixes: base never matches a request; colours balanced across the rack; no colour tastes in graded rows; the asked garment always in 3+ colours and the asked colour on 2+ garment types; rows shuffled; blind-odds budget of 5% per round (section 8.4) | **4** No other mode composes a person; binding colours to garments is unique | **5** Arc 1 Ch4 (dress the guest), **Ch5 Eid morning**, Arc 2 Outfits and Mehndi night, Arc 3 | **4** Endless combinations; new clients and occasions; wardrobe sets; twists D5 and D7 |
| **D2** | **Big Ma's sewing table** (make it to order) | T close-up. A client orders a piece to be made: *"[EN: green] [EN: kurta], [EN: gold] [EN: border]"*. Pick the fabric bolt, pick the trim spool, stitch the border along the dashed line, press Done; the new piece joins the rail for the next fitting | **5** Making, not just choosing; tactile stitch; Big Ma sings; the piece you made gets worn (*Crafting Mama*, Covet) | **4** *Fabric colour vs trim colour* (binding: the fabric colour is the trim colour of a decoy). Leaks: the thread already on the table in the answer colour; only one bolt of the colour. Fixes: 5–6 bolts and 5–6 spools, colours balanced; nothing preselected | **5** The only mode where you make a thing to a spoken spec | **4** Arc 2 Outfits (wedding clothes), The gift (quilt patch). Arc 1 Ch4 as "mend" (D3) | **4** Patterns (dots, stripes, flowers) and lengths at higher levels; offcuts collect into the quilt patch (section 7) |
| **D3** | **Mend and decorate** | The guest's stained kurta is laid flat on the table. They ask for a motif on a named part: *"[EN: yellow] [EN: flower], [EN: pocket]"*; *"[EN: green] [EN: leaf], [EN: sleeve]"*. Tap the motif tray, tap the part; stitch round it | **4** Rescuing a ruined kurta; Kutch embroidery as a nod, not a costume | **4** *Which motif, which colour, which garment part* (sleeve, pocket, collar, hem). Leaks: the stain shows one spot (fine: only one of 2–3 rows sits there); motifs in exactly the asked colours. Fixes: 2–3 rows, tray of 6+ motifs balanced; left/right only from level 3 | **3** Placement is close to Tidy up's verb; kept to *garment-part nouns*, never relational positions (on, under, next to stay with Tidy up and Find it) | **5** **Arc 1 Ch4 "The spill"**: Big Ma fixes the kurta | **3** Few story uses; a free-play variant ("decorate a dupatta") |
| **D4** | **Dress for the weather** | Someone is going out. **Nani calls the weather through the doorway** (*"Hedo! [EN: it's raining]"*); the window is curtained. Dress them; carry items (umbrella, shawl) are graded both ways. The reveal: they step into the courtyard and the weather happens (rain on the umbrella, or a comic soaking) | **4** The funny soaking and the rain reveal; a reason behind each choice | **4** *Which weather set*: rain → umbrella, chappals, no shawl; cold → shawl or cardigan, socks; hot → no shawl, a cap. Leaks: a window or rain sound; someone arriving wet; always adding every carry item. Fixes: curtain drawn, no weather sound before Done, nobody comes in from outside; unasked-for carry items cost the ear star; weather from 4 states; plus 1–2 colour rows to meet the 5% budget | **4** Weather → clothing reasoning belongs only here | **4** **Arc 3**: Clouds coming, Nani has a cold (*"[EN: I'm cold]"*), the doctor says "keep warm" | **4** Weather × client × occasion; "it stopped raining" (S5) later |
| **D5** | **Change of mind** (twist) | Mid-fitting, the client says *"[EN: not the red one], [EN: the blue one]"* or *"Ne [EN: shawl]"* | **4** Surprise and a little comedy (Cook's "now dungri!") | **4** *Re-listening:* which piece to swap. Leaks: always targeting the last piece placed; always a real change. Fixes: targets any row; one in four is a false alarm (*"[EN: the red one]"*, keep it) | **3** A twist on D1, not a mechanic of its own | **3** Ali can't decide (a running gag) | **4** Cheap variety on every fitting from level 2 |
| **D6** | **Family set** (who wears what) | Nani asks for 2–3 people at once: *"[EN: Nana]: [EN: white] [EN: kurta]; [EN: Ali]: [EN: green] [EN: kofia]"*. They stand in a line; you dress each | **3** More to juggle; a satisfying group reveal | **5** *Kinship word → person, then colour → garment* (S3). Leaks: faces on the rows (as the Chai tray showed); line order = row order. Fixes: rows carry no faces; the line and the rows are shuffled separately | **3** Kinship is also Who did it?'s, but here it's dressing, not identifying | **4** Arc 2 Mehndi night, Arc 5 The family photo (dress first, then Tidy up arranges) | **3** People × colours; the family photo finale |
| **D7** | **Bangles** (count + colour) | A wrist close-up; a tray of bangles. *"[EN: red] [EN: bangles], trae; [EN: gold], bo"*. Tap onto the wrist; Done | **3** Tinkling sound, stacking | **4** *Count per colour.* Leaks: tray holding exactly the count; ending by itself; counting aloud. Fixes: tray holds count + 1–3 of each; Done only; silent counting from number stage 3 | **2** Counting is Cook's too; kept as a slot type inside D1 from Arc 2 | **3** Arc 2 Outfits (after buying bangles in Find it) | **3** Counts × colours |
| **D8** | **Theme challenge** (must-haves + free choices) | Big Ma's brief: an occasion and 2–3 spoken must-haves; every other slot is free. The look goes into the lookbook. Also the **daily challenge** | **5** Ownership (Maryam), a daily ritual (Farah), Covet's structure | **3** *Only the must-haves* are graded. Leaks: none new (same rules as D1), but less Kutchi per minute | **3** D1 with freedom; its own purpose is expression | **2** Free play; the Eid party lookbook page | **5** Daily; collection; free choices make every look different |
| **D9** | **The old photo** | From Nani's trunk, a faded black-and-white photo of young Nani. She says what she wore: *"[EN: my dupatta was red]"*. Recreate it from the trunk; the photo **colourises** as the reveal | **4** Heritage and emotion; a lovely reveal | **5** *Colours only from Nani's words:* shapes are in the photo, colours aren't. Leak: grey tones giving away light vs dark colours. Fix: the photo shader flattens each garment's tone to one grey; trunk colours offered in equal-luminance sets | **5** Unique: memory, past tense, the family's history | **5** **Arc 5 Ch1 "The old trunk"**; Arc 2 (Big Ma's own wedding photo) | **2** A handful of photos; each one a keepsake |
| **D10** | **Tell Ali** (role reversal) | You see the target look as a picture card (the goal); you build the instruction from audio chunks (colour + garment); Ali puts on exactly what you said, comically wrong if you're wrong | **4** Being the expert; Ali's silly outfits | **5** *Production:* choosing the chunks needs the meaning. Leak: icons on chunks. Fix: audio-only chunks; text only for readers at stage 3+ | **4** The only production-first styling | **3** Ali from Arc 1 onwards; Grandparent mode (Nani says it aloud and marks it) | **3** Any D1 round flipped |
| **D11** | **Simba and Zazu's Eid bows** (toy) | Nani asks for a bow on each cat: *"[EN: Simba]: [EN: red] [EN: bow]"* | **4** Cats in bows: Layla's favourite | **2** Only colour decides; the names are proper nouns. Size ("the big bow") is dropped: it would look wrong when worn, so the picture answers it | **2** A D1 skin | **2** Eid morning, a 20-second breather | **3** A free-play toy |

**Rejected, or belongs to another mode:**
- **Runway voting** (DTI) and any taste judging: subjective, multiplayer, and can't be graded by Kutchi.
- **Make-up and hairstyles** (Project Makeover): not this family's register for children; women's headscarves stay on.
- **Sizes that show when worn** ("the big cap"): the body shows the answer. Size words are used only where both sizes look right when worn: a long or short dupatta, big or small dots.
- **Folding clothes away** belongs to Tidy up. **Finding the cousin's cap** belongs to Find it. **"Who is wearing red?"** belongs to Who did it?. **The lookbook snapshot** is a reward, not the Snap mechanic.
- **Budgets and prices** (*Style Savvy*): money belongs to the Arc 2 bazaar.

---

## 4. Recommended first set

**One engine: a look is data.** A row is `{who?, slot, garment, colour?, pattern?, length?, count?, no?}`, like a Cook recipe slot or a Find it row. D1, D4, D5, D6, D7 and D8 are all row types or knobs on the same fitting station. D2 and D3 share the sewing-table station.

| Order | Mechanic | Why first |
|---|---|---|
| 1 | **D1 The fitting** with **D5 Change of mind** as its level-2 twist | The core, and Arc 1 Ch5 "Eid morning". It builds the paper-doll renderer, the rack builder, the grader and the leak bot that everything else needs. D5 is a few lines on top |
| 2 | **D3 Mend and decorate**, then **D2 Make to order** | "The spill" (Arc 1 Ch4) opens Big Ma's room, so the sewing table is needed in Arc 1. It also gives the mode its craft star (stitching), and Big Ma her song moment. D2 reuses the same table in Arc 2 |
| 3 | **D4 Dress for the weather** | The mode's S4 job and the "monsoon day" story use. It's D1 plus weather rows, the doorway line and a rain layer |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| D8 Theme challenge and daily | Straight after the first set, in free play | Cheap once D1 exists; needs the lookbook |
| D6 Family set | Arc 2 | Needs kinship words (Round 1 Q10) and more full-body characters |
| D7 Bangles | Arc 2, as a D1 slot type | Arc 2 content; a wrist close-up |
| D10 Tell Ali | When produce stages exist; Grandparent mode | Production, not listening |
| D9 The old photo | Arc 5 | Past tense (S5) and the trunk art |
| D11 Cat bows | As a free-play toy, any time after D1 | Weak Kutchi; nice for Layla |

---

## 5. Story integration

### 5.1 Where the mode appears

| Arc · chapter | Beat | Dress up errand | Language |
|---|---|---|---|
| **Arc 1 Ch4 "The spill"** | Sharbat spills on a guest's kurta → Big Ma's room opens → she mends it and sings | After Find it's sewing box (the red thread): **D3** decorate the stain (a flower on the pocket), then **D1 level 1**: dress the guest in the mended kurta and a dupatta she names | Clothes nouns, garment parts, colours (S2) |
| **Arc 1 Ch5 "Eid morning"** | You wake up (hand pose E6, stretch); the family must be ready for the mosque | **D1 "Get ready"**: Nana, Ma, Ali, then you in the mirror. Busy option: the mosque clock on the wall. D11 cat bows as a breather. Then the Eid greetings with Big Ma among the elders, and **Eidi** as pocket money | Clothes, colours, the Eid greeting; respect language |
| Arc 2 Ch2 "Outfits" | Everyone needs something | **D2** Big Ma makes wedding clothes to order; **D7** bangles in D1 | Colours, patterns, counts (S3) |
| Arc 2 Ch3 "Mehndi night" | Evening grade | **D6** "the girls in yellow, the boys in green" (colours per the family's own custom, to confirm) | Kinship, possessives (S3) |
| Arc 2 Ch4 "The gift" | The thread quest | **D2** finale: Big Ma and you stitch the patch from the relatives' colours | Colours, kinship |
| **Arc 3 Ch1 "Clouds coming"** | The washing is out; Nani calls from the doorway | **D4**: dress Ali to bring the washing in | Weather (S4) |
| **Arc 3 Ch4 "Nani has a cold"** | The doctor says to keep her warm | **D4 variant**: Nani says *"[EN: I'm cold]"*; wrap her up (shawl, socks) | Feelings, "I'm cold" (S4) |
| Arc 4 | — | No story errand (the ring mystery is Find it and Who did it?). Free play continues | — |
| **Arc 5 Ch1 "The old trunk"** | Old photos | **D9** recreate young Nani's outfit; the photo colourises | Past tense "was" (S5), describing (S6) |
| Arc 5 Ch5 "The family photo" | Arrange everyone | **D6** dress everyone first, then Tidy up arranges them | Kinship recap |

The Roadmap rule "consecutive errands never repeat the main action" holds: in each chapter above, the errand before is a different mode (Find it, Ask around or Tidy up).

### 5.2 Cast

| Who | Job in Dress up |
|---|---|
| **Big Ma** | The host. Her room is the place; she gives the finishing task, her "pass me" (*Muke hikdo [EN: scissors] dine*) and the lookbook. She **sings only during the finishing task and at the reveal**, never over a spoken order. Her hands demonstrate a gesture the first time |
| **Nani** | Gives family-wide orders (D6), calls the weather through the doorway (D4), is the client in "Nani has a cold", and tells the old-photo story (D9) |
| **Family: Nana, Ma, Ali, the older cousin, guests** | Clients. Ali changes his mind (D5) and is the role-reversal model (D10). The older cousin turns up without his cap (a cameo that points to Find it) |
| **Simba and Zazu** | Ambient: Zazu asleep in the fabric basket, Simba batting a thread end. Bows in D11. Never over a tap target |
| **Kasuku** | On the doorway perch when you arrive: repeats a colour word you met (spaced review). **Silent during fittings** (the cast rule) |
| **The doctor** | Arc 3: his "keep her warm" line sets up Nani's D4 round |

### 5.3 The world map

- **Big Ma's room** appears on the map at the "The spill" beat (the fog clears over a thread-reel icon). Place data: `{id: "bigma-room", unlock: "arc1-ch4-intro", modes: ["dress-up", "find-it"]}`. Find it's sewing box and Dress up's fitting share the room.
- Story mode: the highlighted "Big Ma needs you" beat. Free play: go any time.

### 5.4 Free play ("the world is the menu")

| Entry in Big Ma's room | What it is |
|---|---|
| **Fittings** | Clients keep coming (a gentle queue; overlapping in Busy); orders lean towards the weakest words. **"Close the room"** ends it and goes to the summary and pocket money (Cook's open kitchen pattern) |
| **Big Ma's challenge** | D8: one themed brief a day, 2–3 must-haves, the rest yours. Goes into the lookbook |
| **The lookbook** | Every finished look as a snapshot, per person and occasion. Tap a photo to hear its words again |
| **Explore** | Tap any garment to hear its name and colour; nothing is graded (the only place garments "speak") |
| **Fitting lab** | Any mechanic, any level, random round, "Big Ma helps" tick, the leak-bot toggle |

---

## 6. Learning design

### 6.1 Words and frames it drives

| Stage | Words | Frames (existing Kutchi, or a placeholder) |
|---|---|---|
| S1 (recycled) | Numbers 1–5 (bangles, buttons) | *Salamun alaykum* · *Muke {x} khape.* (the client's request) · *Ne {x}.* · *Muke hikdo {x} dine.* (Big Ma's pass me) · *Ghan.* (handing over) · *Aabhar aanjo!* · *Achija!* · *Arre re!* · *Hedo!* |
| **S2** clothes nouns and colours | kurta, kurti, trousers (salwar/pyjama), waistcoat, cap (topi), kofia, headscarf, dupatta, shawl, cardigan, sandals/chappals, shoes, umbrella, raincoat; 10 colours | `[EN: red] [EN: kurta]` inside *Muke … khape* · `[EN: put on the {x}]` · `[EN: take off the {x}]` · `[EN: not this one, that one]` |
| **S3** adjectives, possessives, kinship | plain, dotted (bandhani), striped, with flowers; long, short; big dots, small dots; new; gold, silver | `[EN: {person}'s {x}]` · adjective agreement (does "[EN: red]" change with the garment?) · `[EN: How do I look?]` · `[EN: beautiful!]` |
| **S4** weather and feelings | it's raining, it's cold, it's hot, it's windy; I'm cold, I'm hot | `[EN: it's raining]` · `[EN: I'm cold]` · `[EN: keep warm]` |
| S5–S6 (Arc 5) | was, wore; describing | `[EN: my dupatta was red]` |
| Sewing (pass me, finishing) | needle, thread, scissors, pin, button, iron, border, pocket, sleeve, collar, hem | `[EN: pass me the {x}]` uses the existing *Muke hikdo {x} dine* |

**Row growth, easy to hard** (like Find it's clutter rule): L1 two rows of garment + focal colour → L2 three rows, binding (two colours on two garments that swap between rounds), a "no" row, D5 → L3 four rows, patterns, lengths, neighbouring colours, and the order card hides after the intro (from memory, like the tadka).

### 6.2 Word-stage fading (text in one place only)

| Word stage | Order card row | Rack and body | Mirror check |
|---|---|---|---|
| 1 New | Text + speaker; the client says it; the garment **twinkles** as it's said. Taught, not tested | Nothing | Named aloud |
| 2 Learning | Text + speaker | Nothing | Named aloud |
| 3 Nearly known | Speaker only (•••). Hidden neighbours share one ••• | Nothing | Named aloud |
| 4 Known | Heard once; replay costs the tick | Nothing | Named only on a miss |

- **No labels on garments, ever, during a round.** A label on a hanger is the answer. Explore mode is the only place a garment says its name.
- **No colour swatches or tinted text** on rows; no pictures of garments on the card or the intro card.
- Counts (bangles) show a digit only while the number word is at stage 1–2, counted aloud only then; Done ends the count, nothing ends by itself.

### 6.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | The client says the row again (tap the row's speaker) | Free the first time, then the tick (Relaxed) or patience (Busy) |
| 2 Slow replay | Half speed with a pause between adjective and noun | Tick / patience |
| 3 Piece by piece | The row is said as separate chunks ("[EN: red]" … "[EN: kurta]") | Tick; breaks the combo |
| 4 Reveal (eye) | Shows the row's Kutchi text (never English) | Ear star for that row, from stage 2 |
| 5 Translate | English gist | Ear star for that row |
| 6 Shown | Stage 1: automatic twinkle. Otherwise after 2 misses on a row, the right piece glows | Ear star for that row; the word doesn't advance |

- **No "warmer" rung** (Find it has one): pointing at a rail gives away the noun, and holding up a thread gives away the colour. Anything that narrows by meaning costs the ear.
- Hesitating never shows the answer: after about 8 s the client just repeats the row once (rung 1, free).
- Help is a **"?"** button in the sidebar; the goal line shows in full the first time only.

### 6.4 Mistakes and recasts

- **Level 1 (and Relaxed with a stage-1–2 word): piece-by-piece.** Each piece is checked as it goes on. Wrong: the client's face drops a little, *Arre re!* + "[EN: blue] [EN: kurta]" … "[EN: red] [EN: kurta]". The row's ear is lost at the first miss, so trying pieces until one is accepted never wins it.
- **Level 2+: the mirror.** Nothing reacts until Done; then the client checks each piece in turn and recasts from the first wrong one. The player fixes it and presses Done again.
- A miss marks the word; two misses in a row drop it a stage (existing rule).
- **Spaced retrieval in every round:** due words plus up to 3 new; Big Ma's pass me asks for a met word that isn't in the current order; the mirror check re-hears every word; the word review closes the round.

### 6.5 Role reversal

Relations are stored as data from day one: `wears(person, slot, garment, {colour, pattern, length})`. Frames are written with slots, so each can be **built from pills** as well as spoken (platform to-do 5b). D10 "Tell Ali" is then a pill builder over the same data: you pick `[colour] + [garment]` audio chunks, and Ali acts on whatever you built. **Grandparent mode:** Nani sees the look card and says the order aloud; the child dresses; she marks it.

### 6.6 What's needed from the family (English placeholders until then)

| Need | Status |
|---|---|
| **Colours (10)** | Asked (Round 1, Q11). Chase: every graded row needs one |
| **Weather** (sun, rain, cloud, wind, hot, cold, "it's cloudy", "it's raining") | Asked (Round 1, Q11) |
| **Eid clothes**: what each person actually wears (kurta, cap or kofia, headscarf or dupatta, sandals, shawl) | Asked (Round 1, Q9). **Also ask:** is it *topi* or *kofia* in this family? Are English loanwords normal (T-shirt, jeans, sweater)? |
| Everyday and monsoon clothes: trousers, cardigan or sweater, raincoat, umbrella, chappals, shoes, socks | New |
| Wedding clothes the family wears (men and women), bangles; which colours for mehndi | New (Arc 2) |
| **Do colour words change with the garment's gender or number?** ("a red kurta" vs "a red dupatta") and **does the colour come before the noun?** | New; links to Round 1 Q1. Decides whether we record whole phrases or chunks |
| Patterns and lengths: plain, dotted/bandhani, striped, with flowers; long, short; big and small dots | New |
| Garment parts: sleeve, pocket, collar, hem; left, right | New |
| Sewing things: needle, thread, scissors, pin, button, iron, border | New (some overlap with Find it's sewing box list) |
| Feelings: "I'm cold", "I'm hot" | New (S4) |
| Frames: "Put on the…", "Take it off", "Not this one, that one", "How do I look?", "Beautiful!", "{person}'s…", "It's raining, take the umbrella", "My dupatta was red" | New |
| The Eid greeting; the Eidi phrase | Asked (Q9, Q11) |
| **Big Ma's song** (Zafar's wife records it) | Agreed (Cast doc) |

**Recording load:** about 10 colours × 15 garments. If colours agree with gender, record colour + noun as whole phrases per gender class (about 20 short takes); if not, one take per colour and per noun (about 25). Either way it's one long take.

---

## 7. Stars, rewards and upgrades

### 7.1 Three stars

| Star | Icon | Earned when |
|---|---|---|
| **Ear: understood** | Ear (shared) | Every spoken piece right: garment, colour, pattern, length, count, person, weather set; no "no X" piece worn; no ear-costing help |
| **Neat** (this mode's craft star) | **A needle and thread** (Big Ma's) | The finishing task done well: creases gone, stitches on the line, the pin in the mark, the button centred. Hands only |
| Lightning (Busy) / tick (Relaxed) | Shared | Busy: within the client's patience. Relaxed: no replays or help beyond the first replay |

A round with fewer than 2 testable rows (stage-1 teaching) shows a dashed ear ("learning") and pays the helping money; it's not an ear star.

### 7.2 Pocket money

Cook's receipt: **5** for helping, **+5** ear, **+3** neat, **+3** lightning/tick, a perfect-fitting combo. **Eid morning:** each elder gives **Eidi** (a one-off story bonus). Money is never lost.

### 7.3 Collectibles

- **Big Ma's lookbook:** a snapshot of every finished look, by person and occasion (Eid, wedding, monsoon, everyday). Maryam's collection.
- **Offcuts into the quilt:** each piece made at the sewing table leaves an offcut; the chapter's quilt patch is sewn from the colours the player actually used. It ties the mode to the story's progress object.
- **Wardrobe sets** (below) fill a visible rail.

### 7.4 Later: outfits that persist

The family keeps what you dressed them in: after Eid morning, Ma wears the dupatta colour you chose in the hub and in Cook. That needs the upper-body sprites' garments as tintable layers. Worth it, but after the first set (open question 6).

### 7.5 Upgrades (never the listening)

| Upgrade | Effect | Trade-off |
|---|---|---|
| Steam iron | Creases go in one sweep instead of three | Cheap; everyone wants it |
| Electric sewing machine | Stitching follows the line within a wider tolerance | Mid-price; the neat star gets easier, never the ear |
| Wheeled second rail | Two clients can wait at once in Fittings (more coins per session) | Pays off only in Busy |
| **Wardrobe sets** (Monsoon, Wedding, Everyday modern) | New garments and colours on the rail | More coins per fitting, **harder** listening (more decoys) |
| Ali as helper | Irons for you, for a daily wage | Tycoon choice; costs every day |

**Banned upgrades:** labelled hangers, rails sorted to match the order, Big Ma "suggesting", auto-dress, a hint discount.

---

## 8. Engineering spec

### 8.1 Data model (`data/dress.json`)

```json
{
  "words": {
    "ph-kurta":  {"kutchi": null, "english": "kurta", "kind": "garment", "slot": "top", "bases": ["man", "child"], "tint": true, "trim": "kurta-trim", "occasions": ["eid", "wedding", "everyday"], "gender": null},
    "ph-red":    {"kutchi": null, "english": "red", "kind": "colour", "hex": "#B72424", "family": "red", "lum": 0.31, "focal": true},
    "ph-dotted": {"kutchi": null, "english": "dotted", "kind": "pattern", "mask": "bandhani"},
    "ph-raining":{"kutchi": null, "english": "it's raining", "kind": "weather", "needs": ["ph-umbrella"], "forbids": ["ph-shawl"]}
  },
  "lines": {}, "grammar": {"look": "{colour} {garment}", "agree": null},
  "slots": ["head", "top", "layer", "bottom", "feet", "wrap", "wrist", "carry"],
  "people": {"nana": {"base": "man", "head": "nana", "house": {"top": "house-top", "bottom": "house-pyjama"}, "kin": "ph-nana"}},
  "occasions": {"eid": {"garments": ["ph-kurta", "ph-topi", "ph-dupatta"], "palette": ["ph-white", "ph-green", "ph-red", "ph-blue", "ph-yellow"]}},
  "lookalike_groups": {"garment": [["ph-kurta", "ph-kurti", "ph-shirt"], ["ph-topi", "ph-kofia"]], "colour": [["ph-red", "ph-pink", "ph-orange"], ["ph-blue", "ph-purple"]]},
  "mechanics": {
    "fitting": {"levels": [
      {"rows": 2, "types": 3, "colours": 4, "palette": "focal", "check": "piece", "binding": false, "no": 0, "blindOdds": 0.05},
      {"rows": 3, "colours": 5, "check": "mirror", "binding": true, "no": [0, 1], "changeOfMind": 0.35},
      {"rows": 4, "colours": 6, "palette": "neighbours", "patterns": true, "lengths": true, "hideCard": true}
    ]},
    "iron": {"levels": [{"creases": 2, "sweeps": 3}]}, "stitch": {"levels": [{"lines": 1, "tolerance": 28}]}
  },
  "days": [], "upgrades": [], "star_sets": {"dress-up": ["ear", "needle", "bolt|tick"]}
}
```

- **A round (request):** `{who, occasion, weather?, rows: [{who?, slot, garment, colour?, pattern?, length?, count?, no?}], change?: {at, row, to}, finish: "iron" | "stitch" | "pin" | "button"}`.
- **Scene data:** `data/scenes/bigma-fitting.json` (client stand point and body scale, rail hanger spots, shelf spots, shoe-rack spots, accessory tray, mirror rectangle, doorway, curtain, safe zones) and `data/scenes/bigma-table.json` (bolt spots, spool spots, work area, motif tray).
- **Relations as data:** the worn state is `wears[]`, used by the grader, the lookbook, persistent outfits and D10.

### 8.2 Reused vs new

| Reused as is (Cook; Find it where built) | New building blocks |
|---|---|
| Word pills, the order ladder model (`Cook.Order.ladder` rows, shuffling, shared •••), stars shown as they happen, the receipt, completion cards, the word review (Wave 5), pass me in the sidebar, greetings and recasts, help costs, Busy patience ring, levels as data, grammar frames in data, the Station lab pattern, the open-kitchen free-play pattern | **Paper-doll renderer** (`doll.js`): body base + head + slot layers, each garment a neutral sprite **tinted in code**, a trim layer untinted, pattern masks (dots, stripes, flowers) as code overlays, the mirror reflection as a flipped copy in a mask |
| `Cook.Mech.define` and zones (`js/cook/zone.js`): the finishing tasks are mechanics that run inside a zone | **Rack builder** (`rack.js`): fills hanger and shelf spots obeying the decoy rules (section 8.4) |
| Fold's "swipe along a dashed line" → **stitch**; knead's rub → **iron**; count → **bangles** | **Look generator** (`look.js`): rows from due/weak words, occasion and level; computes the round's blind odds and adds a row or decoy until ≤ 5% |
| Find it's symmetric look-alike groups and the non-speaker bot harness | **Grader** (`grade.js`): per-row compare with binding, "no" rows, weather needs/forbids, counts; returns recast lines |
| `place_preview.py`, the visual QA checklist, the six-size test pattern | **Weather reveal** (`weather.js`): curtain, doorway walk-out, rain/wind particles, the comic soaking |

### 8.3 The Fitting lab

On the Dress up title (until the shell's map exists): run D1–D4 and each finishing task at levels 1–3 with a random round, a "Big Ma helps" tick, a **leak-bot toggle** (the bot plays the round on screen), a "blind odds" readout for the current round, and buttons to force a weather, occasion or client.

### 8.4 Leak rules (built into the rack builder and generator)

1. The base (house) clothes never satisfy a request; house clothes never appear on the rail.
2. The asked garment appears in **≥ 3 colours**; the asked colour appears on **≥ 2 garment types**.
3. **Colours balanced:** across the rack every colour in the level's palette appears the same number of times ±1, so asked colours aren't over-represented.
4. Positions on the rail and shelf are shuffled every round; nothing sits in a fixed spot.
5. Rows are shuffled; "no" rows look like other rows and are placed at random; hidden neighbours share one •••.
6. **No colour tastes in graded rows** (tastes may only set the default of free slots in D8).
7. Occasion defaults never decide a row alone: if the occasion implies a garment (Eid → cap), that row must also carry a colour or pattern.
8. Weather: curtain drawn, no weather sounds or wet clients before Done; carry items graded both ways; 4 weather states.
9. D2 and D3: nothing preselected on the table; bolts, spools and motifs balanced.
10. D9: garment tones flattened to one grey in the photo shader; trunk options in equal-luminance sets.
11. **Blind-odds budget:** each generated round's chance of a full ear star by the best blind strategy (the strongest prior per row) is ≤ 5%, computed by the generator.

### 8.5 Test harness

`build/test_dress.py` (Playwright, like `build/test_cook.py`):
- `--lab --level N`: plays every mechanic by pointer events at levels 1–3, deliberately wrong sometimes (so the recast paths run); the tap-cover check before every tap; screenshots per step.
- `--viewport` at **six sizes**: phone 915×375, 1366×768, 1440×900, 1280×800, iPad landscape, iPad portrait.
- `--days`: the story errands; `--fittings N`: free play, then "Close the room".
- **`--bot`: the leak bot.** It runs the real generator and grader in the page (`page.evaluate`, no rendering needed) for **2,000 rounds per mechanic per level**, as a player who sees only the screen: random; most salient colour; most frequent colour; the person's usual colour; the occasion default; change nothing; hedge every carry item; row-order-as-slot-order; try-and-see (level 1); press Done to hear the recast, then fix. **Pass: each strategy earns the ear star in fewer than 10% of rounds (the design budget is 5%).** English placeholder rows are treated as hidden Kutchi for this run, and the report separately lists which decisions are still English (as the Cook audit did).
- A UI pass of the bot also plays a few rounds on screen, to catch leaks the logic can't see (a label, a tinted row, a glow).

### 8.6 File layout (until the one-app shell exists)

```
dress.html                      loads js/cook shared files (core, lang, ui, order, zone), never forks them
js/dress/core.js                Dress namespace, data load, star set
js/dress/doll.js                paper-doll renderer, tint, patterns, mirror
js/dress/rack.js  look.js  grade.js  weather.js
js/dress/stations/fitting.js    D1, D4, D5, D6, D7, D8 (row types and knobs)
js/dress/stations/table.js      D2, D3 (sewing table, T)
js/dress/mechanics/iron.js  stitch.js  pin.js  button.js  bangles.js
js/dress/flow.js                days, Fittings free play, receipt, lookbook
data/dress.json   data/scenes/bigma-fitting.json   data/scenes/bigma-table.json
assets/dress/{bg,doll,garments,props}/
build/test_dress.py
```

When the shell lands, `dress.html` becomes a place (`bigma-room`) and its save moves into the shared profile; nothing else changes.

---

## 9. Scene, art and assets

### 9.1 Cameras

| Scene | Camera | Framing |
|---|---|---|
| **Big Ma's room, fitting corner** | **E, full body, front** (Art Bible: horizon at hip height) | Client centre-right on a low round rug, full body about 620 px tall; full-length mirror right; rail across the upper left, a shelf below it, a shoe rack bottom left, an accessory tray; curtain on the window. A second composition of the same room as Find it's (shared walls, window and chest) |
| **Big Ma's sewing table** | **T** | Table top fills the frame; bolts and spools along the top; the work area centre; the bottom 20% clear for hands. Shared with Find it's sewing-box close-up |
| Doorway reveal (D4) | E | **Reuse** Find it's courtyard, a short walk-out strip; weather in code |
| Wrist close-up (D7) | E | The client's hand and a bangle tray (Arc 2) |
| Nani's trunk and photo (D9) | T | Arc 5; later |

### 9.2 Layers and ambient motion

- **Separate:** every garment on the rack and on the body (per slot), the hanger, the body base, the head (with talking and blink frames), the mirror frame and its reflection mask, the curtain, the rug, bolts, spools, motifs, the iron, needle and pins, the finished-piece flight.
- **Baked:** walls, floor, window frame, fixed shelves, the fixed sewing machine body, the chest.
- **Ambient (2–4 per scene):** the sewing-machine wheel turning while Big Ma sews, a thread end swaying, Zazu breathing in the fabric basket, dust motes in the window light. Off with "reduce motion"; never near a tap target.
- **Lighting states:** day (Eid morning, everyday), golden evening (the wedding evening), night (mehndi), storm grade (Arc 3). Relights in the same chat.

### 9.3 Hand poses

| Pose (existing set) | Where |
|---|---|
| C4 pointing (E) | The default tap; the ghost-finger demo |
| B5 hook grip (E) | Carrying a hanger across to the client |
| D1 grab (E, 2 frames) | Taking a folded cap or scarf from the shelf |
| C1 pinch (T, 2 frames) | The needle (stitch), a bead or motif |
| B1 handle grip (T) | The iron |
| A1 flat palm (T) | Smoothing cloth before stitching |
| C3 side pinch (T) | Pinning, holding fabric |
| C5 two-hand fold (T) | Folding a dupatta edge |
| E6 stretch (E) | The Eid morning wake-up beat |

**New:** Big Ma's demo hands: a reskin of Nani's set for C1, A1, B1, C5 (older hands, thin gold bangles, her maroon paisley sleeve), about 4 images. Optional: a **scissor grip** (T, 2 frames) if cutting fabric becomes a step (not in the first set).

### 9.4 Characters, garments, props (with reuse flagged)

**Characters (full body, new in this mode; the Art Bible's characters were upper body behind counters).**
- **Body bases:** man, woman, child (boy and girl share it), and Ali as the child base scaled taller. All garments are drawn per base.
- **Clients:** the Eid guest, Nana, Ma, Ali, the player (boy, girl; seen in the mirror), Nani (Arc 3), the older cousin. Each is a full-body version made from their approved sheet: house clothes, neutral stand, and a happy turn; the head carries talk, blink and "Arre re" frames (in-place edits). About 4 images each.
- **Big Ma:** **reuse** her sheet (seated, upper body, at the table edge in the fitting view), plus 2 new poses (holding up a garment, clapping).
- **Cultural rules:** a Khoja home in Kutch with East African roots; modest cuts; **women's and girls' headscarves or dupattas stay on**, and a new scarf replaces the old one in one swish, with no bare-head frame; caps on men and boys as the family confirms; no Hindu religious markers. **Restraint:** the rail is mostly modern everyday clothes; heritage pieces (kurta, waistcoat with a mirror-work trim, kofia, kanga, bandhani dupatta) are 1–2 nods per rack view, rotated by occasion; never costume.

**Garments** (neutral, tintable, one drawing per base used): kurta, kurti, long kameez, trousers (salwar/pyjama), waistcoat, topi, kofia, headscarf, dupatta, shawl, cardigan, T-shirt, jeans, raincoat, sandals, shoes, wellies, socks, plus the umbrella and bangles as props. About 20 types × about 2 bases.

**Props:** clothes rail, hanger, wall shelf, shoe rack, accessory tray, mirror frame, round rug, curtain, fabric bolts (tintable), thread spools (tintable), motifs (flower, leaf, star, moon), iron, needle, pins, buttons, pattern tiles (bandhani dots, stripes, flowers), cat bows.

### 9.5 Rough counts and where they're made

| Group | Count | ChatGPT (free) or API |
|---|---|---|
| Backgrounds: fitting corner (day) + 3 relights; sewing table T | 5 | **ChatGPT**, relights in the same chat |
| Full-body clients and bases | about 32 | **ChatGPT** as edits of the approved sheets, then in-place edits for frames |
| Garments aligned to the bases | about 45 + about 15 trim layers | **API**: edit in place on the base body ("add a kurta, change nothing else"), then diff-cut, so garments line up with the body. About $10–20 |
| Props and pattern tiles | about 25 | **ChatGPT** grids for cloth and wood props; **API or grey background** for steel (iron, needle, pins: never magenta) |
| Hands | about 4 Big Ma reskins (+2 optional scissors) | **API** edit mode (the outline drift check) |
| Audio | Big Ma's song; swish, sewing machine, rain, bangle tinkle | Family (the song); free sound libraries |
| **Total** | **about 125 images** | About 60% free, about 40% API |

**Process (Find it's rule):** scene spec as data → greybox in the Fitting lab → the leak bot → the art brief from the spec → backgrounds → bases → garments by edit in place → `place_preview.py` and the visual QA checklist. **Before any garment art:** a two-garment alignment test on one base (the biggest art risk).

---

## 10. Persona loops

### Loop 0: the draft

The fitting (D1) as the whole mode: the client says 2–4 pieces; you dress them; the mirror checks at Done; the craft star comes from tapping pieces quickly. Library of 11 candidates (section 3 before revisions). Weather through a visible window. Sizes (big/small cap). Rails sorted by type and colour.

### Loop 1

| Persona | Plays, says, struggles |
|---|---|
| **Layla, 5** | Loves the swish and the client's twirl. Can't read the rows; the parent plays them. At the mirror she learns she was wrong about a piece she put on a minute ago: "Why is she sad?" |
| **Zayn, 8** | "It's just dragging clothes." Nothing to get better at; the "quick" craft star isn't a skill |
| **Maryam, 11** | Loves the modern-with-a-nod clothes. Wants to choose things herself and keep her looks. "Every look is theirs, not mine" |
| **Zafar, 38** | Two rows in 90 s is thin Kutchi. Wants the words to matter in combination, not one at a time |
| **Farah, 34** | One fitting fits a stop on the train. The story beats are too long |
| **Nani, 68** | "Ma never takes her scarf off in front of people." Worried the clothes look like fancy dress |
| **The Sceptic** | Wins by: (1) leaving Nana in his house kurta when he asks for a cream kurta; (2) Ma always wants green; (3) Eid → cap, every time; (4) rows go head to toe; (5) the rail only has the colours that were asked; (6) the window shows the rain; (7) "the big cap" looks huge on Zazu, so she swaps it; (8) she hedges with umbrella and shawl every time |
| **The Builder** | Full-body characters are a new art class. One drawing per garment per colour is impossible; tint in code |

| Finding | Change |
|---|---|
| Layla's late feedback | Piece-by-piece checking at level 1 and for stage 1–2 words; first miss still costs the row's ear |
| Zayn: no skill | The **neat** star from Big Ma's finishing tasks (iron, stitch, pin, button) with *Crafting Mama*-style gestures; D5 change of mind; Busy with the mosque clock |
| Maryam: no ownership | D2 make to order; D8 must-haves + free choices; the lookbook |
| Zafar: thin Kutchi | Binding rows from level 2 (colours swap between garments); pass me; the mirror check names every piece |
| Farah | Beats capped at 3–5 s and skipped on replay; Fittings can stop at any client |
| Nani: modesty, costume | Headscarves stay on (one-swish swap); restraint rule on the rack; modern everyday clothes first |
| Sceptic 1 | Base clothes never satisfy a request and never appear on the rail |
| Sceptic 2 | No colour tastes in graded rows |
| Sceptic 3 | An occasion default never decides a row alone |
| Sceptic 4 | Rows shuffled |
| Sceptic 5 | Colours balanced across the rack; asked garment in ≥3 colours; asked colour on ≥2 types |
| Sceptic 6 | Weather heard, not seen: Nani calls it from the doorway, the curtain is drawn, no weather sound until the reveal |
| Sceptic 7 | Size words only where both sizes look right when worn (long/short dupatta, big/small dots) |
| Sceptic 8 | Carry items graded both ways; 4 weather states |
| Builder | Paper doll: 3 bases + a scaled Ali; neutral garments tinted in code; patterns as masks |

### Loop 2

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Piece-by-piece works; the ironing is her favourite ("the creases are gone!"). Two colours in one sentence (binding) loses her. The stitch line is too fiddly at 5 |
| **Zayn** | Stitching and the mosque clock give him something to beat. Wants a record and harder rounds |
| **Maryam** | Loves D2. In D8 her free choices "don't matter to anyone" |
| **Zafar** | Better. Wants the words he's learnt to *do* something outside the mode |
| **Farah** | Fine. A daily thing would bring her back |
| **Nani** | Approves; wants the Eid greeting and the family's real clothes, not a catalogue |
| **The Sceptic** | Now wins by: (1) in D6 the line of people is in the same order as the rows; (2) in D2 the thread on the table is already the answer colour; (3) at level 2+, Done with nothing changed, then fix from the recast; (4) the client glances at the right rail (idle animation); (5) the stage-1 twinkle; (6) Ali always changes his *last* piece; (7) the old photo: a pale grey dupatta can't be the dark red one |
| **The Builder** | Stitch = Cook's fold, iron = knead's rub: cheap. The garment alignment on bases is the risk. Persistent outfits in other modes need tintable upper-body layers: expensive |

| Finding | Change |
|---|---|
| Layla: binding | Binding only from level 2 |
| Layla: fiddly stitch | Level 1 stitch = one short straight line with a wide tolerance; Relaxed never times it |
| Zayn: records | Best Eid rush (clients dressed before the clock); level 3 hides the card after the intro |
| Maryam: free choices ignored | The lookbook snapshot; the family comments on the look (never graded); **later**: outfits persist into the hub and Cook (section 7.4) |
| Zafar: words outside the mode | The lookbook replays words; Kasuku repeats colour words at the door; persistent outfits later |
| Farah | **Big Ma's daily challenge** (D8), 60–90 s |
| Nani | The Eid greeting opens Eid clients; the garment list comes from Round 1 Q9 |
| Sceptic 1 | D6: the line and the rows are shuffled separately; no faces on rows |
| Sceptic 2 | Nothing preselected on the table; bolts and spools balanced |
| Sceptic 3 | Done-to-hear costs the row's ear (it's a miss); nothing lost otherwise |
| Sceptic 4 | Clients never look at, point to or lean towards anything during dressing |
| Sceptic 5 | Stage-1 rows don't count for the ear either way; a round needs ≥2 testable rows for an ear star |
| Sceptic 6 | D5 targets any row; one in four changes are false alarms |
| Sceptic 7 | Photo shader flattens garment tones; equal-luminance colour sets in the trunk |
| Builder | Two-garment alignment test before any garment art; persistent outfits held back |

### Loop 3

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Dresses Nana for Eid with her dad playing the rows; laughs at Simba's bow. Comes back for the cats and the ironing |
| **Zayn** | Level 3: four rows from memory, a change of mind, the clock. Chases his best Eid rush. Comes back for the record |
| **Maryam** | Designs a wedding kurta at the table, sees it on the rail, puts it on Ma, and it's in her lookbook. Comes back for the lookbook and the daily challenge; the old photo (Arc 5) is her favourite idea |
| **Zafar** | A fitting has about 8–12 Kutchi utterances in 90 s (greeting, order, pass me, mirror check, thanks). Binding and weather make combinations matter. Comes back for Fittings on his weakest words, and Tell Ali |
| **Farah** | Daily challenge on the train; a Fittings session ends when she closes it |
| **Nani** | Plays Grandparent mode: reads the order aloud and marks it. Proud that it's the family's own clothes and that her story is in the old photo |
| **The Sceptic** | Runs every trick in the leak-bot list (8.5). Best: occasion default + a guessed colour, 1 in 16 at level 1, which the blind-odds budget pushes under 5%. Still wins everything while the words are **English placeholders**, which she reports |
| **The Builder** | About 125 images; the logic is small (generator, grader, rack); the finishing tasks reuse Cook's mechanics |

| Finding | Change |
|---|---|
| Level 1 blind odds sit near 6% | The generator computes each round's blind odds and adds a row or a decoy colour until ≤5% |
| English placeholders defeat every test | Chase Round 1 Q9 and Q11 first; the leak bot reports placeholder decisions separately; don't judge the ear star until the words arrive |
| Kutchi per minute | Level 2+ fittings average 3 rows; pass me once per fitting after level 1 |
| Every persona has a reason to return | Stop at loop 3 |

---

## 11. Scorecard and verdict

| Criterion | Score | Why |
|---|---|---|
| Fun | **4** | The transformation, the reveal, making things with Big Ma; the Busy clock and binding for Zayn. Dressing alone would be a 3; the finishing tasks and twists lift it |
| Forces Kutchi | **4** (5 once the words exist) | Every graded choice comes from a spoken word; binding, weather and the blind-odds budget close the known leaks. Today every decision word is English |
| Distinct | **4** | The only mode that composes a person and makes things to order; the overlap with Find it's "which one?" is only the colour words |
| Plot | **4** | Arc 1 Ch4 and Ch5, Arc 2 Outfits, Mehndi night and The gift, Arc 3 weather and Nani's cold, Arc 5 old photo. Nothing in Arc 4 |
| Replay | **4** | Combinations, occasions, wardrobe sets, the daily challenge, the lookbook, offcuts into the quilt |

- **Is it good?** Yes: each mechanic in the first set passes "fun without caring about learning" and "can't win the ear star without the Kutchi", given the family's words.
- **Is it complete?** It covers S2 clothes and colours, S3 adjectives, possessives and kinship, and S4 weather and feelings, and all three story uses (Eid morning, wedding outfits, a monsoon day), plus The spill and Arc 5.
- **Verdict: Go with changes.** The changes: get the family's colour, clothes and weather words before judging the ear star; run the two-garment alignment test before the art run; build the first set only (D1 + D5, D3 → D2, D4).

**Top risks**
1. **No Kutchi yet for clothes, colours or weather:** every decision is English, so the mode teaches nothing until Round 1 Q9 and Q11 come back.
2. **Full-body paper-doll art:** a new character class; garments must line up on each base. The alignment test comes first; tinting keeps the count down.
3. **Cultural accuracy and restraint:** Eid and wedding clothes can tip into costume, and modesty rules shape the animation. The family checks the garment list.
4. **Pace:** dressing is calmer than Cook; if children find it slow, the finishing tasks, D5 and Busy are the levers.

**Open questions for Zafar**
1. Is **"neat" (a needle and thread)** right as the craft star, earned from the finishing tasks?
2. Piece-by-piece checking at level 1, then the mirror check from level 2: agreed?
3. Are free, ungraded choices (D8) OK, or should every slot be spoken?
4. Weather is only heard (curtain drawn until the reveal): OK?
5. Dress the player too (in the mirror), or family and guests only?
6. Outfits that persist into the hub and Cook: worth the extra art, later?
7. *Topi* or *kofia*, and which clothes does the family really wear at Eid, weddings and in the rain? (Can go in the Round 3 questions.)

---

## 12. Build brief for a future agent

**Rules that apply throughout:** never invent Kutchi (placeholders are `"kutchi": null` + English); levels are data; mechanics are reusable blocks; no labels on garments; nothing covers the play area; the leak rules in 8.4; UK English in UI text; look at every screenshot yourself.

### Phases

| Phase | What's playable | Acceptance |
|---|---|---|
| **1. Logic + greybox fitting** | `dress.html` with the Fitting lab: D1 at levels 1–3 on grey silhouettes and tinted rectangles; intro card, order card, piece-by-piece and mirror checks, recasts, help costs, stars, receipt, word review | `test_dress.py --lab --level 1..3` passes at all six sizes; the tap-cover check never fails; leak bot: every strategy **< 10%** ear-star rate over 2,000 rounds per level (target ≤ 5%); no text on the rack in any screenshot |
| **2. Big Ma's table + finishing** | Iron, stitch, pin, button mechanics (as `Cook.Mech` mechanics); D3 mend, D2 make-to-order; D5 change of mind; pass me | Each finishing task in the lab at levels 1–3; the neat star grades them; the D2/D3 leak bot < 10%; phone 915×375 stitch line usable (hit tolerance ≥ 28 px at level 1) |
| **3. Weather + story + free play** | D4 with the doorway line, curtain and reveal; Arc 1 Ch4 and Ch5 as data days; Fittings with "Close the room"; Busy with the mosque clock; the lookbook; upgrades | `--days` plays Ch4 and Ch5 end to end; `--fittings 5` closes into the summary; the D4 hedge strategy < 10%; no weather sound before Done (checked in the audio log) |
| **4. Art** | Alignment test (two garments on one base), then bases, clients, garments, backgrounds | Visual QA checklist on every contact sheet; garments line up within 4 px on each base; restraint and cultural checks signed off by Zafar |
| **5. Held back** | D8 daily, D6, D7, D10, D11, D9 by arc | Each: its own leak-bot run < 10% and a persona pass |

### First three tasks

**Task 1: data, generator, grader and the leak bot (pure logic, no art).**
- Create `data/dress.json` from section 8.1: placeholder words for 10 colours, about 12 garments across 6 slots, 4 weather states, 4 people (guest, Nana, Ma, Ali) with bases and house clothes, the Eid and everyday occasions, look-alike groups, and three `fitting` levels.
- Write `js/dress/look.js`: `Dress.Look.generate(level, profile, opts)` → a round (section 8.1), from due and weak words (reuse `js/cook/core.js` progress helpers), obeying the leak rules 2, 5, 6, 7 and the blind-odds budget (compute the best blind strategy's success as the product over testable rows of 1/candidates, given the strongest prior; add a row or decoy until ≤ 0.05).
- Write `js/dress/rack.js`: `Dress.Rack.build(round, scene)` → items in spots, rules 1–4.
- Write `js/dress/grade.js`: `Dress.Grade.check(round, wears)` → per row `{ok, why, recast}` and the ear verdict (binding, "no" rows, weather needs/forbids, counts).
- Add `build/test_dress.py --bot`: loads `dress.html`, runs the generator + rack + grader via `page.evaluate` for 2,000 rounds per level and every strategy in 8.5, and prints a table of ear-star rates. **Done when** every rate is < 10% and the report lists the placeholder decisions.

**Task 2: the greybox fitting station.**
- `dress.html` loading the Cook shared files (core, lang, ui, order, zone) and `js/dress/*`; do not copy them.
- `js/dress/doll.js`: a grey body silhouette per base, slot rectangles tinted from the word's `hex`, a pattern overlay, the mirror as a flipped copy in a mask.
- `js/dress/stations/fitting.js`: the rail, shelf and rack spots from `data/scenes/bigma-fitting.json` (greybox coordinates on 1600×900); tap to wear, tap to return; the intro card (face + one line per row, then it shrinks into the sidebar); 3 s silence; piece-by-piece checks at level 1, the mirror check from level 2; the recast lines; Done always present; the ear, needle and tick cut-outs filling as it happens; the receipt and word review from Cook's UI.
- The Fitting lab on the title: mechanic × level buttons, "Big Ma helps", the blind-odds readout, the bot toggle. **Done when** a human can play 10 different level-1 rounds in a row without a repeated look, and no screenshot shows a label, swatch or tinted row.

**Task 3: the test harness and the first finishing task.**
- `build/test_dress.py --lab --level N --viewport <size>`: plays D1 through pointer events from `z.expect(...)` hints (Cook's pattern), with a deliberate wrong piece in one round in three; the tap-cover check before every tap; screenshots to `build/screenshots/dress/`.
- `js/dress/mechanics/iron.js` with `Cook.Mech.define("iron", …)`: 2–3 creases on a garment in a zone; rub across each until it's gone (reuse knead's rub input); knobs `creases`, `sweeps`, `special` in `data.mechanics.iron.levels`; scores the neat star with `z.skill`.
- Wire iron as the fitting's finishing step (before Done). **Done when** the harness passes at all six sizes for levels 1–3, and Claude has looked at the phone and iPad-portrait screenshots and confirmed the rail items are at least 90 px and nothing overlaps the client.

---

## Sources

- Dress to Impress: [Inclusive Teach, parents' guide](https://inclusiveteach.com/2025/12/27/parents-guide-what-is-dress-to-impress-on-roblox/) (theme, timer, runway, 1–5 ratings); [The Mycenaean review](https://www.themycenaean.org/2026/02/dress-to-impress-review/); [Fossbytes, how to play](https://fossbytes.com/how-to-play-dress-to-impress-2025-guide/) (colour wheel, toggles); [BlueStacks theme guide](https://www.bluestacks.com/blog/game-guides/roblox/rl-dress-to-impress-theme-guide-outfit-ideas-en.html) (blocked; search summary: small palette, one prop)
- Project Makeover: [GameRefinery, match-3 part 4](https://www.gamerefinery.com/how-to-crack-the-match-3-code-part-4-project-makeover/) (fashion meta as the real game); [Walkthroughs.net](https://walkthroughs.net/project-makeover-walkthrough/) (three options per item, the reveal, the letter)
- Style Savvy: [Style Savvy Wiki, gameplay](https://stylesavvy.fandom.com/wiki/Style_Savvy) (blocked; search summary: specific requests, pick from stock, budgets); [Gamecritics review](https://gamecritics.com/trent-fingland/style-savvy-review/)
- Covet Fashion: [Trend Hunter](https://www.trendhunter.com/trends/fashion-game-app) (requirements such as "red lipstick, two silver pieces", then votes); [Game Thinking case study](https://gamethinking.io/case-studies/covet-fashion-2/)
- Love Nikki: [Stylist's Arena (Fandom)](https://lovenikki.fandom.com/wiki/Stylist's_Arena); [attributes guide](https://queen-of-stylist.tumblr.com/post/162547582311/beginners-guide-to-attributes-and-scoring-high-in) (weighted attributes and essential tags)
- Toca Hair Salon 4: [Google Play](https://play.google.com/store/apps/details?id=com.tocaboca.tocahairsalon4&hl=en_US) (regrow hair: no fear of mistakes)
- Crafting Mama: [Wikipedia](https://en.wikipedia.org/wiki/Crafting_Mama); [Common Sense Media](https://www.commonsensemedia.org/game-reviews/crafting-mama) (sew, cut, pin, fold as stylus mini-games)
- Weather dressing: [ABCya, Dress for the Weather](https://www.abcya.com/games/dress_for_the_weather)
- TPR: [Liu et al. 2024, SAGE Open](https://journals.sagepub.com/doi/full/10.1177/21582440241288924); [EnglishClub, teaching clothes to young learners](https://www.englishclub.com/efl/tefl/young-learners/how-to-teach-clothes-vocabulary-to-yl/) (race to dress a team member)
- Colour words: [Wagner, Dobkins and Barner 2013, "Slow mapping"](https://www.sciencedirect.com/science/article/abs/pii/S0010027713000243); [Frontiers 2025, Japanese children](https://www.frontiersin.org/journals/developmental-psychology/articles/10.3389/fdpys.2025.1641593/full)
- Adjectives: [Klibanoff and Waxman 2000, Child Development](https://srcd.onlinelibrary.wiley.com/doi/abs/10.1111/1467-8624.00173) (same-kind contrast first); [Mintz and Gleitman 2002, "Adjectives really do modify nouns"](https://sciencedirect.com/science/article/abs/pii/S0010027702000471); [Syrett 2024 review](https://compass.onlinelibrary.wiley.com/doi/full/10.1111/lnc3.70000)
- Retrieval, feedback, barrier games, touch targets: as in `docs/find-it-design.md` (Fritz et al. 2007; Leonard et al. 2024; Lyster and Saito 2010; ASHA; NN/g)
