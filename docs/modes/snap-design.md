# Snap: design (mode id `snap`)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar, deepened on 25 Sept 2026 and **redesigned as a pipeline on 25 Sept 2026 (evening)**. The "Pipeline design" section at the top is current and supersedes the "Deep dive" (D1–D9) and sections 3, 4, 8 and 12 where they conflict; the deep dive's kinds of shot (D1), matcher rules, leak-bot list and speaking rules still stand and are referred to from it. Phases 0–1 are built (`build/reports/snap-build.md`). Follows `docs/modes/MODE-DESIGN-BRIEF.md` and `docs/modes/DEEP-DIVE-BRIEF.md`, and builds on `docs/find-it-design.md` (whose M11 "Photo" idea and "album as a collection" are passed to this mode), `docs/cook-with-nani-phase-a-design.md`, `docs/cook-with-nani-kutchi-audit.md` and `docs/cook-with-nani-todo.md` (Wave 5, calm and clarity).
**Placeholder rule:** the only Kutchi in this doc is what's already in `data/content.json` and `data/cook.json` (fruit, veg, numbers 1–10, and the frames *Muke {x} khape*, *Ne {x}*, *Muke hikdo {x} dine*, *Hedo!*, *Arre re!*, *Ghan*). Everything written `[EN: …]` has no Kutchi yet. In the game it's a grey italic English placeholder until the family gives the word. **Never invent Kutchi.**

---

## Pipeline design, 25 Sept 2026

**Why this section.** Zafar's steer after the clinic (`PIPELINE-BRIEF.md`): every mode is a **pipeline of stages**, each stage a set of **mini-games** that get harder or different, the stages **stitched into one sequence** with a beginning and an end, and mechanics reused across modes. The deep dive below gave Snap a sound core (a still orchard, a viewfinder, prints, the hand-in) and two real Kutchi tests, and phases 0–1 built it. What it lacks is the *process*: a walk with Nani's camera should feel like a day out with a set order, the same every time, so the child always knows what comes next and each stage has one job. This section adds that process around the built core. It follows `docs/UX-PRINCIPLES.md` (request card, sidebar on the left, fixed-shape cards, one light bulb, one job at a time, start tiny, the two-page end-of-round screen) and keeps the deep dive's rules (nothing says at the shutter whether a print is right; no counter, no digit; the hand-in asks in a new order; the Sceptic's win-without-Kutchi test).

**Kutchi in this section.** Only what is already in the game (fruit, numbers, *wadho/nindho*, *nar*, the frames) and what Mum's 25 Sept recordings gave (`docs/kutchi-grammar-notes.md`: *pela … ne poi …* first … and then, *ne* and, *{x} lai* for, *saathe* together, *muke {x} de* give me, *hi* this, *khan* take). Spelling follows Zafar's rules (W not V: *wadho*; "two" is *ba*, "one" is *hakro/hakri*). Everything in `[EN: …]` is a placeholder, grey and English in the game until the family gives it.

### P1 The pipeline

A **photo walk** is the unit: one page of Nani's album, from the charpai to the charpai, about three minutes at level 2 and under a minute at level 1. Six stages, in this order, every time:

| # | Stage | Where | What the child does | What it hands to the next stage |
|---|---|---|---|---|
| **1** | **The shot list** | The charpai. Nani has the old camera and the album open at a page with gaps | Listens to what Nani wants (the request card, read along), and **gets the camera ready**: loads the film she counts out, or packs the bag | The **rows** (the shot list, in the sidebar) and the **film** (frames loaded) |
| **2** | **Set off** | The gate; later the bus window | Goes where Nani says: taps the place, or the way at a fork | The **scene** the camera opens on, and which spots are lit at level 1 |
| **3** | **Spot and frame** | The orchard (later the courtyard, the farm, the road) | The camera: tap-to-centre, zoom, shutter; Ali's rows by voice; a Quick shot interrupt | The **prints tray**, in shot order, each print pale and undeveloped |
| **4** | **Develop the prints** | Under the tree, on the charpai: the tray and the washing line | Brings the prints up: rubs, counts them through the tray, pegs them up in the order Nani says | The **prints, visible** and pegged up (still unjudged) |
| **5** | **Show the family** | Nani on the charpai; from level 3 Nana and Ma beside her | Hands each print to whoever asks for it, in a new order; Nani reacts to what is really in it | The **accepted prints**, the ear and lens results per row |
| **6** | **The album** | The album page | Puts each print in the "?" slot that speaks its caption, says the caption, sticks the corners; Nani shows the page to the family and says where tomorrow's walk goes | The **page state** (slots filled, gold corners), then the shared **end-of-round screen** (time, accuracy, hints; the word review) |

```
        rows + film            scene            pale prints (shot order)
 [1 Shot list] ───────► [2 Set off] ───────► [3 Spot and frame] ───────────┐
                                                                            ▼
 end-of-round ◄─── [6 Album] ◄──────── [5 Show the family] ◄──────── [4 Develop]
   screen      page state    accepted prints, stars per row      prints, visible, pegged up
```

**The little story.** Nani's album has gaps (the "?" slots on today's page speak what is missing). She counts out the film, you set off, you shoot, the prints come up on the washing line, you show them round, they go in the album, and Nani says where you'll go tomorrow. Beginning: an empty page. End: a fuller page, shown to the family. The same six beats at every level; a level only changes what each stage's Kutchi carries and how many things there are (one photo at level 1, four at level 4).

**Carried forward, exactly.** `rows` (the dealt rows; `js/snap/requests.js` unchanged), `film` (now the number loaded in stage 1 rather than a constant), `scene` (stage 2's choice; one scene today), `prints[]` in shot order with `developed: false` until stage 4, `accepted[]` with `firstRight` per row after stage 5, and `page` (slot ids filled, gold corners) after stage 6. `js/snap/round.js` already holds `rows`, `film`, `prints` and the per-row `firstRight`; the pipeline adds `developed`, `accepted` and `page`.

**One job at a time.** No stage combines two jobs. Loading the film and hearing the list are the same stage but sequential (card first, then the camera). Shooting never develops; developing never judges; the hand-in never places prints in the album. Between stages there is one big button on the right (*Set off*, *Develop*, *Show Nani*, *Into the album*), which is where the "Show Nani" button already sits in the build.

### P2 The mini-games, per stage

Each stage has two to four variants. Level 1 of every stage is the smallest possible job (UX principle 7). "Reuses" names the mechanic file: Cook's (`js/cook/mechanics/`), the shared modules (`js/shared/`), another mode's, or Snap's own (`js/snap/mechanics/`). Blind odds are for the Sceptic who cannot hear the words, at level 1 of that variant.

#### Stage 1: The shot list

The request card opens over the charpai: Nani's face, her line (*[EN: Take a photo of] trae aamo. Ne ba kelo.*), each chunk lit as it is spoken, then the card shrinks into the left sidebar as the shot list (Cook's ladder rows, one `•••` per hidden group, no digits). Then one small job with the camera before setting off, so the child has *done* something with the numbers before the shooting starts.

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind odds |
|---|---|---|---|---|---|
| **1a Load the film** | Nani holds out the film pack and says how many frames: *trae* (rows + spares; level 1: *ba*). The child slides frames into the camera one at a time; the camera's window shows the count. Too many or too few: *Arre re! Char.* and she says it again; the child fixes it. Film for the walk = what was loaded | **Numbers 1–5**, as a heard count the child must produce by action (Cook's count, but the number is not on screen) | L1: *ba* (one row + one spare). L2: to *panj*. L3: two packs, *pela trae, ne poi ba* (first three, and then two: colour film and ordinary, or two pack sizes) | **Cook `count`** (tally by taps, the digit hidden as Snap requires) | 1 in 5 |
| **1b Which page?** | The album is open at two or three pages, each with "?" slots. Nani says which page today: *aamo* (the mango page), later *[EN: the farm]* page. The child taps it; that page's "?" slots become the shot list (each slot speaks its caption when tapped, so the child can hear the rows again from the page) | **Nouns for places and things** (fruit today; places when the words land). The rows are then heard twice: from Nani and from the slots | L1: two pages, one fruit each. L2: three pages. L3: the page named by two words (*[EN: the farm], aamo*) | **Find it's tap-the-one** through the shared `whichone.js` (decoys balanced) | 1 in 2 |
| **1c Pack the bag** | The clinic's counter belt: things pass on the charpai's cloth (camera, film, *aamo*, *kelo*, *[EN: hat]*, *[EN: water]*). Nani says what to pack, with counts: *ba aamo* (two mangoes for the road), *[EN: the camera]*, *[EN: the film]*. Grab as they pass. Everything packed is used later: the mangoes are the picnic in stage 6 | **Counts + fruit**, and the camera nouns once recorded (`[EN: camera]`, `[EN: film]`) | L2+: fruit and counts only (the real Kutchi). L4: the camera words | **Clinic's pharmacy belt** (shared once the clinic ships it; Cook `fetch` until then) | 1 in 4 per item |
| **1d Say the list to Ali** (speaking) | Nani says a row; the child repeats it to Ali, who writes it on the shot list (a picture appears on the card as he hears it). A wrong hearing draws the wrong picture, which the child can say again or tap to fix | **Production**: the fruit noun (closed set = the fruit in the orchard, 3–6); L4 number then noun | L3+; alternate rows only, never all | **Shared `say.js` + `speech.js`** (`listen({choices})`, pills and the Grandparent tick as fallback) | Voice 0 (pills credit nothing) |

Level 1 runs **1a only** (*ba*: two frames). 1b arrives at level 2 as the way the list is given; 1c and 1d are level 3–4 alternatives dealt one per walk, never both.

#### Stage 2: Set off

A ten-second stage whose only point is the place nouns and the story's "off we go". It is the walk from the charpai to where the camera opens. Nothing here tests the shot rows.

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind odds |
|---|---|---|---|---|---|
| **2a Where to?** | The gate view: two or three places in the distance (the mango tree, the well, the shed; later the farm and the pond). Nani says one: *aamo* (the mango tree, by its fruit, until tree and place words exist). Tap it; the scene scrolls there and the viewfinder opens on it | **A place noun** (fruit-tree names by fruit today; `[EN: tree]`, `[EN: well]`, `[EN: farm]` later) | L1: one place lit, the others dim (taught: no test). L2: two. L3: three | **Find it's tap-the-one** (`whichone.js` decoys) | 1 in 3 |
| **2b Which way?** | A fork on the path; Nani says *[EN: left]* / *[EN: right]*, later *[EN: straight on]*. Two forks at level 3. A wrong turn reaches a dead end (a goat blocks it) and Nani says it again | **Left and right**, shared with the clinic's "does it hurt here?" thread | L2+ (placeholders until the clinic's left/right words land; taught not tested until then) | **Clinic's left/right** (data; the tap is the same) | 1 in 2 per fork |
| **2c The bus window** | Arc 5: the rail. The lap's rows were given in stage 1; the road passes | As section 8 (the journey) | Phase 5 | `js/snap/rail.js` (new, later) | see 8.4 |

Level 1 runs **2a with one place lit**: a single tap, the ghost finger shows it the first time (UX 8), and the child has "set off".

#### Stage 3: Spot and frame

The built core, unchanged in its rules: a still scene under a fixed frame, tap-to-centre, +/− zoom steps, drag from level 2, film as loaded, nothing said at the shutter. The variants are the kinds of shot (D1) and who holds the camera.

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind odds |
|---|---|---|---|---|---|
| **3a Just so many** (K1, built as G1) | Frame exactly N of the noun | **{n} {fruit}** | L1: one row, *hakro/ba/trae*. L2: to *panj*, kinds interleaved. L3+: as D5 | Snap `viewfinder`, `photo` | 1 in 4 a row (D5) |
| **3b The big one** (K2, built as G2) | The named size is the main subject | **wadho/nindho {fruit}**; colours and comparatives at L4 | L2+ (one size row among count rows at L2; its own walk at L3) | Snap `viewfinder`, `photo`, shared `whichone.js` | 1 in 8 a row |
| **3c No bananas** (K3, built inside G1/G2 L3) | K1 or K2 with a leave-out: *trae aamo, nar kelo*; a photobomber bunch beside every cluster; Kasuku as the photobomber when *parrot* lands | **nar {y}**; *{y} saathe* (with) as the 50/50 twin once recorded | L3+ | as 3a + the photobomber sprite | 1 in 8 |
| **3d Ali's camera** (speaking, built as G4) | A picture card; the child says it; Ali frames what he heard and shoots. His print goes in the tray with the others | **Production**: fruit; L3 number then fruit | L2+, alternate rows | Snap `ali-camera`, shared `speech.js` | Voice 0 |
| **3e Quick shot** | Mid-stage, Nani: *Hedo! {x}!* for a met word not on the list, from a look-alike group with ≥2 members visible; one bonus frame | A met noun, by surprise | L2+ | **Cook `passme`** | 1 in 2 |
| 3f Snap the moment (K4), 3g Right place (K5), 3h Two together (K6) | The moving world and `rel.js` (deep dive G7, G9, G10) | States, positions, pairs | Phase 4+ | `subjects.js` (new), shared `rel.js` | 8.4 |

Level 1: **one row of 3a, one spare frame**, tap-to-centre and one zoom step. The tray shows each print as a pale rectangle with a ghost of the picture (the shot is visible enough to tell fruit from fruit, not enough to count; see decision 1).

#### Stage 4: Develop the prints

New. The instant camera's prints come out pale; this stage brings them up. It is the pipeline's "make" stage, the way healing is the clinic's: short, tactile, funny, and the place where Cook's hands mechanics are reused wholesale. **Rule:** developing never says whether a print is right. It only makes it visible.

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind odds |
|---|---|---|---|---|---|
| **4a Rub it up** | A print on the charpai. Rub in circles; the picture comes up under the finger. Nani says when: *[EN: more!]* … *Ghan!* (enough). Stop on *Ghan*, or it goes dark (over-developed, comic: a black print with two eyes; it still counts at the hand-in, rated on its content) | **The stop word** (*Ghan* is in the game); *[EN: more]*, *[EN: slowly]* placeholders. The instruction only | L1: one print, stop on *Ghan*. L2: all prints, one after another. L3: *pela … ne poi …*: rub the mango one first, then the banana one (the child must recognise the pale ghost) | **Cook `stir`** (circular rub with a progress fill) | Stop word: 1 in 2 |
| **4b Count them through the tray** (speaking) | The prints go into a tray of developer. Nani counts them in: *hakro, ba, trae* … and the child counts aloud with her, one print per number; then lifts them out. The listener checks each count word against the closed set {1…5}; a miss just gets Nani's count again. From level 2 the child counts *alone* and Nani echoes | **Numbers 1–5 said aloud** (the first speaking moment, before Ali's camera: the set is tiny and the family's number recordings exist) | L1: count along with Nani (no star). L2: count alone; earns the voice star from here. L3: count in the order of the tray, and *Nani says a wrong number on purpose*: the child says the right one | **Cook `count`** for the taps; **shared `say.js`** for the listens; Cook `boil`'s timer bar as the tray | Voice 0 (pills) |
| **4c Peg them up** | A washing line with as many pegs as prints (a fixed-shape card: four pegs even for two prints). Nani says the order: *pela aamo, ne poi kelo*. The child drags prints to pegs. Wrong order: she says it again. From level 3 with three prints; from level 4 by size: *pela wadho aamo* | **First … and then …** (from Mum's recording) with the nouns, and *nar* for "not that one" | L2: two prints. L3: three. L4: with a size word | **Cook `assemble`** (slots in order) and its sequence check; the pegs are Cook's fixed dots | 1 in 2 (two prints), 1 in 6 (three) |
| **4d The spoilt one** | One print came out wrong (dark, or the lens cap: a fixed comic sprite, never one of the child's real prints). Nani: *[EN: throw away the dark one]*; from level 4 by colour. The good ones stay | **Adjectives** (dark, light; colours) | L4+, when colours land | **Find it's tap-the-one** | 1 in 3 |

Level 1: **4a on one print**, stop on *Ghan*. Level 2 runs 4a on all prints then 4b; level 3 adds 4c. Only ever two variants in one walk (one job at a time; the stage stays under 40 s).

#### Stage 5: Show the family

The built hand-in (G3), with the family joining from level 3 so the rows are asked by more than one voice and the print goes to a *person*, which is the clinic's waiting-room lesson in reverse.

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind odds |
|---|---|---|---|---|---|
| **5a Show Nani** (built) | Nani asks each row again in a new order (*[EN: Show me] trae aamo*, later *muke trae aamo jo [EN: photo] de*). Tap a print. Right: *Ghan!*, she keeps it. Wrong: a recast from the print record (*Arre re! Char aamo*), the row again, choose again. None fits: back to stage 3 for one frame, then straight to stage 5 (the print develops in the tray, no repeat of stage 4). At most two trips a row, then *Nearly!* | **The rows, a second listening pass** (the ear star's home); *muke … de* when recorded | L1: one row. L2: two to three | Snap `handin` | as D5 |
| **5b Who wants which?** | Nana and Ma sit beside Nani. Each print has an owner: *hi Nana lai ai* (this one is for Nana), *Ma lai ba kelo* (for Ma, the two bananas). The child taps the print, then the person. Wrong person: Nana looks puzzled and Nani says it again | **{person} lai** (for), from Mum's recording; kinship nouns (Nana, Ma; Ali; *[EN: baby]*); the row itself | L3: Nani + Nana, one "for Nana" row. L4: three people, every print owned | **Clinic's waiting-room tap** (who's who), Cook's *{person} lai* frame from the chai tray | 1 in 2 (two people) |
| **5c What's this?** (speaking) | Nani holds up one of the child's own prints: *[EN: What's this?]* The child says it (closed set: the nouns in the print + 2 look-alikes from the scene; level 3 the count too). Nani repeats it back. Then the normal hand-in for the rest | **Production from a print** (the deep dive's Caption it, moved from the album to the hand-in so it is inside the round) | L2+: one print a walk. L3: number + noun | **Shared `say.js` + `speech.js`** | Voice 0 |
| **5d Nana's guess** | Nana, half asleep, guesses what a print is (*Panj kelo?*); the child says yes or no (*Haa* / *[EN: no]*), and if no, hands it to Nani who says it right. A comic listening check | **Yes/no and the counts**, *Haa* (from the recording) | L3+, one print a walk | the clinic's "does it hurt here?" yes/no pattern | 1 in 2 |

Level 1: **5a with one row.** Nana joins at level 3.

#### Stage 6: The album

The send-off. The prints go into the page's "?" slots, the page is shown, and Nani says where tomorrow's walk goes (the future line, S6, heard not tested). Then the shared two-page end-of-round screen.

| Variant | Mechanic | The Kutchi it carries | Levels | Reuses | Blind odds |
|---|---|---|---|---|---|
| **6a Fill the gap** | The page has slots; each "?" speaks its caption when tapped (*trae aamo*). Drag the accepted print onto the slot it belongs to. Wrong slot: the slot says its caption again and the print slides back. A slot filled by a print handed in right first time gets a **gold corner** | **The row, a third listening pass**, this time from the page | L1: one slot (the only "?"). L2: two slots. L3+: all the page's slots, including ones from earlier walks (so the child must match, not just fill) | Snap `album` (HTML; new), the slot audio through Cook's `Lang` | 1 in 2 at L2, 1 in 6 at L3 |
| **6b Stick the corners** | Photo corners in three colours in a tin; Nani says which: *[EN: red]*; later *char* corners (count) or *[EN: the small ones]* | **Colours** (E60–E71), counts, sizes | L3+ (counts and sizes now; colours when recorded) | **Tidy up's place-the-thing**; Cook `count` | 1 in 3 |
| **6c Caption it** (speaking) | Before a print is placed, Nani asks the child to say the caption; a spoken caption gives the slot a small speaker mark (the gold corner still needs the ear) | **Production** | L3+ | shared `say.js` | Voice 0 |
| **6d Show the family** | Nani turns the page to Nana, Ma, Ali, Kasuku; each reacts to one print (*Wah!*-style lines when recorded, laughs, Kasuku echoing *Arre re!* at a photobombed print); then Nani's send-off: *[EN: tomorrow we'll go to the farm]*. **A finished page** (all slots) unlocks a decoration (an ajrakh border) and the family all cheer. No input except one tap to turn the page | **Listening only: reactions, the future line** | Every level (a page turn) | the request-card component (a card per family member), `Album.add()` | — |

Level 1: **6a with one slot, then 6d** with Nani alone and one line. Together stages 4–6 at level 1 are three taps and one rub: the first ever walk, all six stages, is under a minute.

### P3 The big library: the shots, and the darkroom crafts

Snap's equivalent of the clinic's 15–20 healing games is **the shot library**: the shots a page can ask for, across the kinds of shot (D1) and the places. Each is one row on the shot list; a page is 2–4 of them; stage 3 is the same viewfinder for all. Below them, the **darkroom crafts** (stage 4's pool), which is where the mode's "make" fun lives. Scores 1–5; build 5 = cheap on what is built now, 1 = needs the moving world or new art. Age fit is where it lands best.

| # | Shot | One-line pitch | Kutchi it teaches | Mechanic (kind) | Age | Fun | Kutchi | Build |
|---|---|---|---|---|---|---|---|---|
| S1 | **Three mangoes** | Zoom until exactly three hang in the frame; the fourth is off the edge | Numbers 1–5 + fruit | 3a (K1) | 5 | 4 | 5 | **5** (built) |
| S2 | **The big mango** | The big one fills the middle; the middle-sized one beside it is the trap | *wadho / nindho* + fruit | 3b (K2) | 5–8 | 3 | 5 | **5** (built) |
| S3 | **Mangoes, no bananas** | Get the count, keep the bananas out | *nar {y}* | 3c (K3) | 8 | 4 | 5 | **5** (built at L3) |
| S4 | **Kasuku's in it!** | The parrot photobombs: keep him out, or, half the time, get him in (*Kasuku saathe*) | *saathe* / *nar*; *parrot* | 3c with a still Kasuku sprite | 5–11 | 5 | 4 | 4 |
| S5 | **Ali shoots on your word** | Say the picture card; Ali swings and shoots, wrongly if he misheard | Production: fruit, numbers | 3d | 8 | 4 | 5 | **5** (built) |
| S6 | **Hedo! A lemon!** | Nani's surprise mid-walk: one bonus frame for a word not on the list | A met noun by surprise | 3e | 8–11 | 4 | 4 | 4 (Cook `passme`) |
| S7 | **Six lemons** | Big counts (6–10) on a laden tree; the frame must hold exactly six | Numbers 6–10 | 3a at L4 | 8–11 | 3 | 5 | 5 (data) |
| S8 | **Two big, one small** | Two rows in one line for the same kind: *ba wadha aamo, ne hakro nindho* | Count + size, plural agreement | 3a + 3b in one frame | 11 | 3 | 5 | 4 |
| S9 | **The little goat** | Kid beside its mother: the small one is the main subject | *nindho* + animal | 3b with animals | 5–8 | 4 | 4 | 3 (animal sprites) |
| S10 | **The goat that's eating** | Three goats cycle through eating, lying, walking; shoot the right one at the right moment | *{animal} [EN: eating]* (states) | 3f (K4) | 8–11 | 5 | 5 | 1 (moving world) |
| S11 | **Cat on the charpai** | Zazu wanders between spots; wait for the charpai | Positions (*on, under, next to*) | 3g (K5) | 8 | 4 | 5 | 2 (`rel.js` + paths) |
| S12 | **Nana asleep** | Nana dozes on the bus seat, then wakes; the shot is while he sleeps (comic) | *[EN: Nana] [EN: sleeping]* | 3f | 5–8 | 5 | 4 | 2 |
| S13 | **Camel in front of the windmill** | Line up near and far layers from the bus window | *[EN: in front of]*, nature and travel nouns | 3h (K6) on the rail | 11 | 5 | 4 | 1 |
| S14 | **The tallest tree** | Three trees in clear steps; the tallest is the main subject | Comparatives (H2–H5) | 3b via `whichone.js` | 11 | 3 | 5 | 3 (words) |
| S15 | **The red bus** | Three vehicles, three colours | Colours (E60–E71), travel nouns | 3b | 5–8 | 3 | 5 | 3 (words + sprites) |
| S16 | **How many flamingos?** | A flock at the lake; frame exactly N of a moving, mixed flock | Numbers, *flamingo* | 3a on the rail | 11 | 4 | 4 | 1 |
| S17 | **Hens, not the rooster** | The rooster struts through every cluster of hens | *nar*, *hen/rooster* | 3c with animals | 8 | 4 | 5 | 2 |
| S18 | **The doctor on his bicycle** | A jobs noun rides past in the village lane once a lap | Jobs (S6) | 3f | 8–11 | 3 | 4 | 2 |
| S19 | **Then and now** | Nani describes an old photo in the past tense; compose it today; the old print is revealed after hand-in | Past tense (H23–H25) | 3a/3g with a reveal | 11 | 4 | 4 | 2 |
| S20 | **All of us** | The finale: Tidy up arranged everyone; shoot *all of us* with Kasuku in, Ali photobombing | *all of us*, *saathe*, kinship | 3a + 3c | 5–11 | 5 | 4 | 2 |
| S21 | **Say cheese** (speaking) | Say *[EN: Smile!]* (H20) and the subjects turn to the camera; then shoot | Production of one word | 3d-style listen | 5 | 5 | 3 | 3 |
| ~~S22~~ | Sky watch | — | — | — | — | — | — | Cut (Monsoon owns the sky) |

**The darkroom crafts** (stage 4's pool, plus the album's crafts). These are Snap's comic "make" games; every one carries Kutchi only through its instruction, as the clinic's healing games do.

| # | Craft | Pitch | Kutchi | Mechanic | Age | Fun | Kutchi | Build |
|---|---|---|---|---|---|---|---|---|
| C1 | **Rub it up** | Rub till the picture comes; stop on *Ghan* or it goes black | Stop word, *more / slowly* | Cook `stir` | 5 | 4 | 2 | **5** |
| C2 | **Count them through the tray** | Count the prints into the developer aloud, lift them out | Numbers said aloud | Cook `count` + `say.js` | 5–8 | 3 | 5 | 4 |
| C3 | **Peg them up** | Hang the prints in the order Nani says | *pela … ne poi …* + nouns | Cook `assemble` | 8 | 3 | 5 | 4 |
| C4 | **Shake it** (Layla's) | Shake the print (drag it up and down N times) and it comes up; a count to shake to | Numbers (counted by Nani; the child stops at N) | Cook `knead`-style repeat count | 5 | 4 | 4 | 4 |
| C5 | **The spoilt one** | Throw away the dark one, keep the light ones | Adjectives, colours | Find it tap-the-one | 8 | 3 | 4 | 3 (words) |
| C6 | **Wash and dry** | Dip in the water, then hold to the sun until dry (a two-step *pela … ne poi*) | First/then, *water*, *sun* | Cook `pour` + a timer | 5–8 | 3 | 3 | 3 |
| C7 | **Stick the corners** | Corners from the tin: which colour, how many | Colours, counts | Cook `count` + Tidy up place | 8 | 3 | 4 | 3 |
| C8 | **Cut it straight** | Trim the white edge along a dotted line (a swipe) | *[EN: cut]*, sides (left/right) | Cook `chop` | 5–8 | 4 | 3 | 4 |
| C9 | **Write the date** | Nani says the day's number; the child taps it on a stamp (1–10) | Numbers 1–10 | Find it tap-the-one | 8–11 | 2 | 4 | 5 |
| C10 | **The photobomb fix** | Kasuku got in: a sticker over him, or keep him ("with Kasuku") | *saathe / nar* | drag a sticker | 5–11 | 5 | 3 | 4 |

The first set of crafts is **C1, C2, C3** (stages 4a–4c), then C4 as the level-1 alternative to C1 for variety, then C7 and C10 with the album.

### P4 Research: what the genre does, and what to borrow

The deep dive's section 2.1 already took the rail, the craft score, requests-as-rows, the "?" slot and the hand-in from Pokémon Snap, Alba, Umurangi, TOEM and the collection-design literature. This pass looked again with the pipeline in mind: what do the popular games do *between* shots, and what shape is the session?

| Game | What it does | Borrowed into the pipeline |
|---|---|---|
| **New Pokémon Snap** (Nintendo, 2021) | A set process: pick a course, ride the rail, then *submit* the photos to Professor Mirror for evaluation, one per species, then edit and share. Requests come from named characters and are tracked in a list. Fluffruit thrown at a Pokémon triggers reactions (eating, chasing) | The **submit step as its own stage** (our stage 5), the **request list from named people** (stage 1, and 5b's owners), and treats that trigger *collectible* behaviours only (deep dive 7). Not borrowed: the game choosing your best photo |
| **TOEM** (Something We Made, 2021) | An old camera from grandmother; each town's residents ask for a photo of something they miss; you *show them* the picture and they react; stamps on a community card pay for the bus onward; a free personal album | The **hand-in to a person who reacts** was already ours; new is **stamps for the bus**: a finished page (6d) is what unlocks the next place, so the album drives the map, not the other way round |
| **Alba: A Wildlife Adventure** (ustwo, 2020) | Grandmother's phone camera; a wildlife guide split by area with a "?" until identified; one calm week; no fail | The **guide split by place** (a page per place, 6a) and **no fail**: a spoilt print is comic, never a lost round |
| **Beasts of Maravilla Island** (Banana Bird, 2021) | Grandfather's journal lists what to photograph and hints how to coax a pose; progress *is* filling the journal | **The album's "?" slots as the shot list** (1b): the page tells you what today's walk is for |
| **Afrika** (Rhino Studios, 2008) | About 120 small assignments delivered as client emails; photos graded on distance, angle and centring, paying more for an A | The **many-small-assignments** shape (our shot library), and grading on framing only, never on which subject (the lens star) |
| **Snapimals** (BebopBee, 2016) | On-rails safari for children; "Captain's Pics" of animals in named poses go on display in his museum; the museum upgrades unlock new safaris | **Displayed prints as the reward** (6d shows the page to the family) and *the display unlocking the next trip*. Not borrowed: the freemium timers |
| **Toca Nature** (Toca Boca, 2014) | Build the landscape, then explore with a magnifier and a camera; feed animals; photos saved to the camera roll; no goals | Its **calm, no-goal explore** is our free-play Explore (5.4). It also shows why Snap needs a test: reviewers loved it and children put it down after a week |
| **Seek by iNaturalist** and **Huntly** (children's nature apps) | Themed checklists ("Wildlife Watch"), badges for completing a list, the camera identifies the thing | **Themed lists with a badge per finished list**: a finished page's decoration (6d) |
| **Real instant cameras for children** (Instax mini activities, kids' Polaroids) | Children love the *waiting*: the print comes out blank and develops in their hand; shaking it is a ritual | The whole of **stage 4**: pale prints, rubbing or shaking them up, a stop word, the washing line. It also gives a reason the tray does not show a finished print at the shutter, which the design already needed for the Sceptic |

**Two cautions from the research.** Pupperazzi and Beasts of Maravilla Island were both called flat once the novelty faded because nothing tests you; the shot list and the hand-in are that test, so no stage may weaken them (stage 4 never judges; 6a's slots only speak captions). And the pose-coaxing mechanics (Fluffruit, Maravilla's hints) are fun but must never make the *requested* state happen, or a non-speaker throws fruit and shoots whatever moves.

### P5 Stitching: how a session runs

**A walk** is the six stages once, for one page. **A session** ("a day out with Nani") is 1–3 walks: at the end of a walk Nani turns the page and the child chooses *Another walk* or *Home*. Each walk in a session is a new deal (new fruit layout, new rows) at the player's level, and a session ends with the end-of-round screen for the last walk and a small "the album today" card (pages touched, gold corners won). Personal bests (UX 9) are per stage-3 mini-game and level, timed over the whole walk.

**The very first walk** (UX 7 and 8: tiny, shown not told):
1. Stage 1: the request card, one row (*trae aamo*), read along. Nani holds out the film: *ba*. The ghost finger slides one frame; the child slides the second. No sidebar yet: the row sits on the card until the child sets off, then the card shrinks into the sidebar and the sidebar fades in.
2. Stage 2: one place lit. The ghost finger taps it once; the child taps it.
3. Stage 3: the viewfinder, dimmed except the shutter and one mango cluster. The ghost finger taps the cluster (the view swings), presses **+**, presses the shutter. The child does the same on their own cluster. One spare frame, unused or used; either is fine. The light bulb and the stars do not exist yet.
4. Stage 4: one pale print on the charpai. Rub; *Ghan!*
5. Stage 5: Nani: *trae aamo*. Two prints at most; tap one. (With one tested row the ear star is not offered, so nothing is lost either way.)
6. Stage 6: one "?" slot; drag the print in; Nani shows it to nobody but says *[EN: tomorrow, more]*; the end-of-round screen shows the time and one accuracy slot, no hint badge yet (it appears with the light bulb at walk 3).
Under a minute. Walk 2 is the same with two rows and the sidebar; walk 3 adds the light bulb and the hints badge; level 2 unlocks after three walks with the accuracy badge gold.

**The level ladder across the pipeline** (levels are data; each level adds one thing to a stage, never a new control):

| Level | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 | Stage 6 |
|---|---|---|---|---|---|---|
| **1** | 1a: *ba* frames | 2a: one place lit | one 3a row, tap-to-centre, one zoom step | 4a: one print | 5a: one row | 6a: one slot; 6d Nani only |
| **2** | 1a to *panj*; 1b gives the list | 2a: two places | 2–3 rows: 3a and one 3b; 3d alternate rows; 3e; drag | 4a then 4b (count alone) | 5a; one 5c print | 6a: two slots; 6d with Nana |
| **3** | 1c or 1d dealt | 2b: one fork | 3 rows; 3c leave-outs; 3d number then noun | 4a, 4c (*pela … ne poi*) with three prints | 5a + 5b (Nana), or 5d | 6a: the whole page; 6b; 6c |
| **4** (words arrive) | 1a two packs; 1c camera words | 2b: two forks | 3–4 rows; colours and comparatives via `whichone.js`; photobomber Kasuku | 4d; 4c by size | 5b with three people | 6b colours |
| **5+** (phase 4–5) | as 4 | 2c the bus | 3f–3h; the moving world; the rail | as 4 | as 4 | pages per place; Then and now |

**Free play dips into single stages.** From the hub shelf: **Photo walk** (the whole pipeline at the player's level, due and weakest words, "Ali's turn" as a toggle); **Just the camera** (stage 3 then 5, the current build's round, for a child who wants to shoot); **The darkroom** (stage 4's crafts on prints from the album, no stars: a toy); **The album** (stage 6 alone: browse, hear the "?" captions, fill any slot from the print box, caption it aloud). Kasuku's snapshot (deep dive G12) stays the mode's 60-second entry for the one hub daily once the moving world exists: stages 3 and 5 only.

**Story home.** Unchanged from D6: Arc 5 Ch3 (the farm) is the first story walk; the arc-closing beat photos of Arcs 1–4 seed the album through `Album.add()`; the free-play orchard is on the shelf from day one. The pipeline gives the arc its chapter shape for free: Ch1 the trunk = stages 1 and 6 (the album with gaps, the camera found), Ch2 the bus = stage 2 grown into 2c, Ch3 the farm = a full walk, Ch4 Nana's stories = S19 as stage 3 with stage 5 the reveal, Ch5 = S20 with 6d as the finale (the last page shown to everyone).

**The Sceptic, per stage.** Every stage's decision is made by the words alone: which number of frames (1a), which page or place (1b, 2a), what is in the frame (3), when to stop and in what order (4a, 4c), which print and to whom (5a, 5b), which slot (6a). The odds in P2 multiply along the walk, so a blind level-2 walk (1a 1/5 × 2a 1/2 × two rows ≈ 1/16 × 4c 1/2 × 6a 1/2) earns the ear star well under 1% of the time; the built leak bot (`build/leak_snap.mjs`) gates stage 3 and 5 now and gains one strategy per new stage (random frames, random place, random peg order, random slot). No stage reveals another's answer: the pale print in the tray shows *kinds* faintly but not counts (decision 1), the pegs never mark right or wrong, and a slot's caption is the row itself, said again.

### P6 What survives from the current build

Phases 0–1 are on `claude/build-snap`, merged; `build/reports/snap-build.md` and `docs/snap-build-log.md` describe them. The pipeline keeps the core and wraps it. Concretely, for the next build agent:

| File | Verdict | What changes |
|---|---|---|
| `js/snap/photo.js` (print record, matcher K1–K3, lens, recast) | **Keep, unchanged** | Nothing. Stage 4 and 6 never call the matcher; only stage 5 does, as now |
| `js/snap/requests.js` (knobs, layout, guaranteed frame, `makeRound`) | **Keep** | `film` is no longer `rows + filmSpare` but `loaded` from stage 1 (1a's target number is `rows + filmSpare`, so the guaranteed-frame maths is unchanged); rows gain a `owner` field (5b) and a `slot` id (6a) |
| `js/snap/sim.js`, `js/snap/bot.js`, `build/leak_snap.mjs` | **Keep** | Add the per-stage blind strategies (random film count, random place, random peg order, random slot) and an oracle for each; the ear star's gate is unchanged |
| `js/snap/mechanics/viewfinder.js` | **Keep, unchanged** | Nothing; the shutter's `onShot` now creates a print with `developed: false` |
| `js/snap/prints.js` (`drawScene`, `Prints.thumb`) | **Keep** | `thumb()` gains a `developed` share (0–1) that renders the pale ghost (a CSS filter: low contrast, washed, no detail below a threshold) so a tray print can be told fruit from fruit but not counted |
| `js/snap/mechanics/handin.js` (Show Nani) | **Keep** | Becomes stage 5's variant 5a; the "go back" path returns to stage 3 for one frame and back to 5 (as now), skipping stage 4 for that print (it develops in the tray). 5b–5d are new files beside it |
| `js/snap/mechanics/ali-camera.js` | **Keep** | Becomes 3d, dealt as alternate rows inside a walk from level 2 (as D4 said), no longer its own game `g4`; the `listen()` path moves to the shared `say.js` when it is adopted (one edit in `adapters.js`) |
| `js/snap/round.js` | **Changes: becomes the stage runner** | `play()` currently runs intro → shoot → handin → finish. It becomes `for (stage of walk.stages) await stage.run(walk)`, with the walk object carrying `rows, film, scene, prints, accepted, page`. `intro()` becomes stage 1's request card; `shoot()` stage 3; `finish()` feeds the shared end-of-round screen. Help (`onHelp`) changes from per-line reveal/translate to the light bulb (UX 4): one `flip(ms)` that shows English on every card for the level's seconds and costs the hint badge |
| `js/snap/flow.js` | **Changes** | The title, lab and result card stay; `GAMES` (g1/g2/g3/g4) becomes a list of **walks** (level 1–4) plus **single-stage lab entries** (each stage variant at each level, with a fixture walk state so a stage can be played alone); `showResult` is replaced by the shared end-of-round component, with the print records under a lab toggle as now |
| `js/snap/core.js`, `js/snap/adapters.js` | **Keep** | `adapters.js` gains `Snap.Say` (shared `say.js`), `Snap.EndScreen`, `Snap.Bulb`, `Snap.Onboard` (the shared kit) and swaps `Snap.Stars`/`Snap.WhichOne` to `js/shared/stars.js` and `whichone.js`, which now exist (`build/reports/foundation-build.md`); then `js/snap/stubs/` goes |
| `js/snap/stubs/stars.js`, `stubs/which-one.js` | **Go** at integration | Replaced by the shared modules (the foundation report says `Stars` already takes Snap's rows) |
| `data/snap.json` | **Keep, extended** | `games.g1/g2/g4` become `stages` (per stage: the variants, each with `levels`), `walks` (the level ladder in P5: which variants a level deals), `film.loadTarget: "rows+spare"`, `develop` (rub time, the stop window, the tray count set), `album` (slots per page, gold rule), `lines` gains the placeholders in P7. The star set gains nothing: ear, lens, tick/bolt, voice as now; the end screen maps them to time, accuracy and hints (UX 9) |
| `data/scenes/orchard.json` | **Keep** | Adds `home` (the charpai view for stages 1, 4, 5, 6: a fixed camera on the left end of the scene) and `places` (2a's two or three tappable places with their scroll targets). Still a sidecar; Find it's files untouched |
| `snap.html`, `css/snap.css` | **Keep** | The sidebar moves to the **left** (UX 2); the big stage button and the shutter stay right; a `#line` (washing line) and `#album` layer are added; the per-line eye and translate buttons go, replaced by the bulb |
| `build/test_snap.py` | **Keep** | `--lab` plays every stage variant alone and a full walk at levels 1–3; `--viewport` adds the washing line and album to the tap-cover check |
| G3 "Show Nani on its own" (`autoShoot`) | **Keep as a lab entry** | It is exactly "stage 5 alone with a fixture"; the same trick gives every stage a solo lab entry |

Nothing built is thrown away; the only real rewrite is `round.js`'s `play()` and `flow.js`'s menu, and both are small.

### P7 Words needed

In priority order for the first pipeline set (levels 1–3). "Doc" = already in `docs/Nani jo Ghar — Questions for Mum (Combined, for the visit).md` (not edited here); "Rec" = in Mum's 25 Sept recordings; "New" = not yet asked anywhere.

| Priority | Words or lines | Where used | Status |
|---|---|---|---|
| 1 | Fruit nouns and their plural after a number (*ambo → amba*: does the game's *aamo* follow the same rule, and is it *aamo* or *ambo*?) | Every stage | **In the game**; plural rule **Rec** (§4); the *aamo/ambo* spelling to confirm with Zafar |
| 2 | Numbers 1–10; *hakro/hakri* (one, by gender), *ba* (two) | 1a, 3a, 4b, C9 | **In the game**; one and two **Rec** (§2–3): content.json change owned by Cook/foundation |
| 3 | *wadho / nindho* (and *wadhi / nindhi* for she-words) | 3b, 4c, 6b | **In the game** (drafts); she-word forms **Doc** C22–C36 |
| 4 | *nar* (no X); *saathe* (together, with) | 3c, C10 | *nar* **in the game** (A4); *saathe* **Rec** (§7); *with · without · together · all of us* **Doc** H26 |
| 5 | *pela … ne poi …* (first … and then …); *ne* (and) | 4c, C6, the intro card's list | **Rec** (§7, §6) |
| 6 | *{person} lai* (for), *hi … ai* (this is …); *muke {x} de* (give me); *khan* (take) | 5b, 5a's ask line, 1c | **Rec** (§8–9) |
| 7 | *Ghan* (enough), *Hedo!*, *Arre re!*, *Haa* (yes) | 4a, 3e, 5a, 5d | **In the game**; *Haa* **Rec** |
| 8 | *Take a photo of…* (H19), *Smile!* (H20), *Show me* (H21), *Here's the photo* (H22), *Look!* (E79), *Nearly!* (E80), *What's this?* (A8.4), *Which one?* (A8.6), *How many?* (A8.7) | 1, 3, 5, S21 | **Doc** |
| 9 | Kinship for 5b: Nana, Ma, Ali, *baby*; and *no* (the answer, not *nar*) | 5b, 5d | Nana/Ma/Ali in the game as names; *baby* and *no* **Doc** (cast and A-section) |
| 10 | Colours (E60–E71); comparatives (H2–H5); left/right (the clinic's) | 6b, S14, 2b | **Doc** |
| 11 | **Camera and darkroom words**: *photo* (the noun), *camera*, *film*, *album*, *page*, *more!*, *slowly*, *stop*, *rub it*, *shake it*, *hang it up*, *stick it*, *dark / light* (of a print), *the next page*, *tomorrow we'll go to…* | 1a, 1c, 4a–4d, 6a–6d | **New**: add to the questions doc as a "Photos" block after H22 (the doc's H19–H26 block has a *Take a photo* line but none of the camera nouns or darkroom verbs) |
| 12 | *Your turn, Ali · Tell Ali · Say it · Count with me* (role-reversal lines) | 1d, 3d, 4b | **New** (D8 listed the first three) |
| 13 | Animals, states, positions, nature, travel, jobs, past tense | S9–S19 | **Doc** (G27–G34, H6–H11, A5, E1–E13, H23–H25); phases 4–5 |

Until priority 11 lands, stage 4's instructions are English placeholders except the stop word *Ghan* and the numbers, which is why 4a (stop on *Ghan*) and 4b (count aloud) are the first two crafts: they are real Kutchi today.

### P8 Build brief (rewritten for the pipeline; phased, own files first)

**Before you start.** Read P1–P7, then D1 (the kinds of shot and the cross-cutting rules), D4 (speaking rules), 6.2–6.4 (fading, hints, recasts), 8.4 (the leak-bot list) and `build/reports/snap-build.md`. Phases 0–1 are done: do not rebuild the viewfinder, the matcher or the hand-in. Never invent Kutchi: new lines go in as `"kutchi": null` placeholders in `data/snap.json`; every word a row carries is borrowed from `data/content.json` or `data/cook.json`, and the recorded words in P7 (priority 5–7) are used only once they are in those files (until then, the English placeholder).

**Own files** (phases 2–3 touch only these): `snap.html`, `css/snap.css`, `js/snap/**`, `data/snap.json`, `data/scenes/orchard.json`, `build/test_snap.py`, `build/leak_snap.mjs`, `build/reports/snap-*.md`, `docs/snap-build-log.md`. Cook's mechanics are read through their frozen API (`docs/shared-api.md`), never copied or edited. `js/shared/*` is used, never edited.

**Shared pieces Snap needs** (assume they arrive; stub each behind `js/snap/adapters.js` until it does):

| Piece | Used by | Status |
|---|---|---|
| `js/shared/stars.js`, `whichone.js`, `speech.js`, `say.js` | stages 3, 5, 6; 1d, 3d, 4b, 5c, 6c | **Built** (foundation phase A): swap the stubs in phase 2 |
| The **request card with read-along** (UX 1), the **light bulb** (UX 4), the **end-of-round screen** (UX 9), the **onboarding kit** (UX 10) | every stage | Foundation phase B / Cook Wave 6; stub locally with Cook's `UI.mission` and a plain flip |
| The **clinic's belt** (1c) and **waiting-room tap** (5b) | stages 1, 5 | From the clinic build; Cook `fetch` and `whichone.js` until then |
| The shell, the hub shelf, `Album.add()` from the arc beats | stage 6, free play | Phase 3 |
| `data/relations.json` + `rel.js`, scene `spots` | 3g | Built (foundation); used in phase 4 |

**Phases**

| Phase | What's playable | Own files only? | Acceptance |
|---|---|---|---|
| **2 The pipeline, level 1–2** | `js/snap/walk.js` (the stage runner and the walk object; `round.js`'s `play()` rewritten to call it); stage mechanics as one file each: `mechanics/load-film.js` (1a, on Cook `count`), `mechanics/where-to.js` (2a), `mechanics/develop.js` (4a rub on Cook `stir`; 4b count-through on `say.js`), `mechanics/album.js` (6a slots, 6d the page shown, gold corners, Snap-local save key); `handin.js` unchanged as 5a; `ali-camera.js` as 3d alternate rows; pale prints in `prints.js`; `data/snap.json` `stages` + `walks`; the sidebar on the left; the bulb (local stub); the level-1 first walk with the onboarding script (dim, ghost finger) once the kit exists, a plain version until then; the lab plays any stage alone and any walk | Yes | `node build/leak_snap.mjs`: oracle ≥95% ear on walks at levels 1–2; blind strategies (old plus random-film, random-place, random-slot) each <10%, pooled <5%; `--lab` plays every stage variant alone and a full walk at levels 1–2 headless; `--viewport` six sizes with the tap-cover check including the line and album; a level-1 walk by the oracle in under 60 s of play, a level-2 walk under 3 min; the "no speech" run finishes every walk by tapping; a pale print's pixel contrast is below a set threshold (a test, so the tray can never show a countable print) |
| **3 Level 3 and the family** | 1c (Cook `fetch` until the belt), 1d; 2b (placeholder left/right, taught); 3c leave-outs in walks; 4c peg-up (`mechanics/peg-up.js` on Cook `assemble`); 5b (`mechanics/who-wants.js`), 5c, 5d; 6b, 6c; Quick shot through `passme`; sessions of 1–3 walks; the shared end-of-round screen, bulb and stars swapped in; personal bests per mini-game and level | Yes (the swap is one edit each in `adapters.js`) | Leak bot <10% per strategy at level 3 with random-peg-order and random-person added; every stage variant has a solo lab entry and an onboarding script written *after* its mechanics settle (UX 10); **Zafar plays a full walk with a child** |
| **4 Integration** | The shell hosts `snap`: the hub shelf camera, Photo walk, Just the camera, The darkroom, The album; `Album.add()` seeds from the arc beats; family recordings replace placeholders file for file; Arc 5 Ch3's walk when the arc exists | No (a one-day merge with the shell agent) | `--story` runs Ch3 end to end; no Snap-local save key remains; the leak report shows real-Kutchi rows passing after the swap |
| **5 The moving world** | `subjects.js` on the same `photo.js`; 3f–3h; S4 Kasuku as a still then moving photobomber; S9–S12, S17; Kasuku's snapshot as the hub daily's entry; the courtyard scene | Courtyard sidecar | Leak bot <10% on K4–K5 rows; phone frame rate with 12 moving sprites |
| **6 The journey, Then and now, art** | `rail.js`, 2c, S13, S16, S18, S19, S20; painted orchard, farm, village; Arc 5 Ch1–2, 4–5 | — | 8.4's rail strategies <10%; Arc 5 end to end |

**The first three tasks (phase 2)**
1. **`walk.js` and the data.** The walk object and stage runner; `data/snap.json` `stages` (each variant's `levels`, level 1 in full and later levels as deltas, Cook's convention) and `walks` (P5's ladder). Move `games.g1/g2/g4` under `stages.frame` as variants 3a/3b/3d. `film` comes from stage 1. Done when the oracle plays a data-only walk in Node (`sim.js` learns the stages) and the leak numbers for stages 3 and 5 are unchanged from phase 1.
2. **Stages 1, 2 and 4 on the charpai.** `orchard.json` gains `home` and `places`; `load-film.js`, `where-to.js`, `develop.js` (4a, 4b); pale prints; the sidebar moves left; one big stage button on the right. Done when a level-1 walk runs end to end by real taps at six sizes.
3. **Stage 6 and the end screen.** `album.js` (slots that speak, drag-in, gold corners, the page shown, the send-off line), the end-of-round screen (shared or a local stub with the same three badges), the word review as page 2, the lab's solo entries for every stage. Done when phase 2's acceptance holds.

### P9 Decisions for Zafar (blocking; each with the default)

1. **How much does an undeveloped print show?** Blank (nothing until stage 4), or a pale ghost (kinds tellable, counts not). Default: **a pale ghost**, so a five-year-old can see they took something, and stage 4's rub is a reveal rather than a reveal from nothing; a test keeps its contrast under a threshold so it can never leak a count.
2. **Is stage 4 in every walk, including level 1?** It adds twenty seconds and a rub to the first ever walk. Default: **yes, from level 1, one print only**: the pipeline should feel the same from the first walk, and the rub is the walk's one bit of hands-on fun before the hand-in.
3. **Stage 2 in the still build:** keep "where to?" as a ten-second tap, or cut it until the bus (Arc 5). Default: **keep it**: it is where the place nouns live, and the pipeline needs its "off we go"; at level 1 it is one tap on the one lit place.
4. **Counting aloud in the darkroom (4b) as the first speaking moment**, before Ali's camera, and earning the voice star from level 2. Default: **yes**: the closed set is the five number words the family has already recorded, and counting with Nani is the most natural thing a five-year-old says.
5. **Who else takes prints at the hand-in (5b), and from when.** Default: **Nana joins at level 3** with one *hi Nana lai ai* row (the *lai* frame is recorded); Ma and Ali at level 4; the baby never (no word yet).
6. **Where Caption it lives:** at the hand-in (5c, inside the round, counts for the voice star) or in the album (6c, outside). Default: **5c in the round from level 2; 6c stays as the album's free-play version** with no star.
7. **The album drives the map (TOEM's stamps):** a finished page unlocks the next place, or places open by story only. Default: **story opens places; a finished page only unlocks decoration**, until there is more than one scene to unlock.

---

## Deep dive, 25 Sept 2026: mini-games and mechanics



## Deep dive, 25 Sept 2026: mini-games and mechanics

**Why this section.** The review (`REVIEW-2026-09-25.md`) said Snap's design was sound but its *timing* was wrong: the heaviest engine of the six (moving subjects on path graphs, herds, occlusion, parallax, a rail) for a mode that lives in Arc 5, with only the fruit counts real Kutchi today. Zafar now wants every mode built at once, one agent each. So this section keeps the design and **cuts the engine down to what a still scene can carry**: a viewfinder over a still picture, a rectangle evaluator, prints, the hand-in and the album. That is enough for two real Kutchi tests today (numbers + fruit; *vadho/nindho* + fruit), a speaking mini-game, and the collection. The moving world comes back in phase 4 as data and sprites on the same evaluator, not as a rewrite. This section supersedes sections 3, 4, 8 and 12 below where they conflict; 1, 2, 5, 6, 7, 9, 10 and 11 stand.

### D1 Pitch and the kinds of round

**Pitch.** Nani's old camera comes out, and someone says in Kutchi what they want a photo of: *trae aamo* (three mangoes), *vadho aamo* (the big mango), later *aamo, nar kelo* (mangoes, no banana). The player pans and zooms a still, busy picture under a fixed viewfinder until exactly that is in the frame, shoots, and later hands the prints to Nani, who asks for each again in a new order. Find it asks *which thing*; Snap asks *what's in the frame*: how many, which one, what's left out.

**The backbone: kinds of shot.** Every round is 2–4 rows, each row one kind of shot; the mini-games are which kinds a scene offers and who's asking. One engine underneath: `viewfinder → photo (print record + matcher) → handin`.

| Kind of shot | The row (real Kutchi in bold) | What the print must hold | Real today? |
|---|---|---|---|
| **K1 The count shot** | **`trae aamo`** (`{n} {fruit}`, Cook's `grammar.count`) | Exactly N of that noun ≥50% visible; other nouns don't matter | **Yes** (fruit, numbers 1–10) |
| **K2 The pick shot** | **`vadho aamo`** / **`nindho aamo`**; later `[EN: red] {x}`, `[EN: the bigger] {x}` | The named one is the **main subject**: the biggest of its noun in frame, ≥8% of the frame, centre in the middle third, and no other instance of that noun over half its area | **Yes with drafts** (*vadho/nindho*); colours and comparatives are placeholders |
| **K3 The leave-out shot** | **`trae aamo, nar kelo`** (Cook's `grammar.no`); its twin `[EN: with]` | K1 or K2 satisfied *and* the excluded noun under 10% visible (or, for *with*, over 60%) | **As real as Cook's "no X"** (*nar*, A4 pending); *with/together* is H26 |
| K4 The moment shot | `{animal} [EN: eating]` | The main subject is in that state at the shutter | No; needs the moving engine (phase 4) |
| K5 The place shot | `{x} {anchor} [EN: on]` | The main subject's spot has that relation to the anchor | No; needs `rel.js` and position words |
| K6 The together shot | `{x} [EN: in front of] {y}` | Both ≥60% visible, relation holds in frame | No; phase 4+ |

Rules that hold across every kind (from the loops in section 10, unchanged): **nothing says at the shutter whether a print is right**; film = rows + 2; **no counter in the viewfinder and no digit on a count row** (Snap drops Cook's stage-1/2 digit: the number *is* the test, and "?" reveals it at the ear cost); the hand-in asks rows in a new random order; the lens rating is computed on the biggest thing in frame, never the wanted one.

### D2 The mini-game library

Scored 1–5. **Build** is 5 = cheap on the still-scene engine, 1 = needs the moving engine or a new scene type.

| # | Mini-game | How it plays | Fun 5 | Fun 11 | Kutchi | Distinct | Build | Mechanics | Decision |
|---|---|---|---|---|---|---|---|---|---|
| **G1** | **Just so many** (K1) | Nani's fruit trees: mangoes, bananas, lemons, oranges hang in mixed clusters on a branch layer. *trae aamo*: zoom and pan until exactly three mangoes are in the frame, shoot. Level 3 adds *nar {y}* | 4 | 3 | **5** (real) | 4 (no other mode grades what's included and left out) | **5** | viewfinder, photo, handin, passme (Quick shot) | **First set** |
| **G2** | **The big one** (K2) | The same trees, every kind in three clear sizes. *vadho aamo*: frame the big mango so it's the main subject; the middle-sized one is a decoy. Later colours (*[EN: red] {x}* when E60–71 land) and comparatives (H2–H4) with no new code | 3 | 3 | **5** (drafts) | 3 (Find it M3-size with framing instead of a tap; the framing is the difference) | **5** | viewfinder, photo, handin, which-one (shared) | **First set** |
| **G3** | **Show Nani** (the hand-in) | Nani asks each row again in a new order; tap a print; she reacts to what's really in it (a recast built from the print record), then you choose again; none fits → back for one frame | 4 | 4 | **5** (the second listening pass; the ear star lives here) | 4 | **5** (HTML) | handin | **First set** (the system every round ends with) |
| **G4** | **Ali's camera** (speaking, role reversal) | Ali has the camera. The card shows a **picture** of the shot wanted (no text): three mangoes. The child **says it**; Ali swings to what he heard and shoots. Wrong hearing = a funny wrong print. Voice star | 4 | 3 | **5** (production from a picture) | **5** (the only mode where the child directs a photographer) | 4 | ali-camera, speech (shared), viewfinder, handin | **First set** (level 2+) |
| **G5** | **Nani's album** | Pages per place, 8–10 slots; 2 per page pre-filled by story beat photos from Arcs 1–4; empty slots are **"?" cards that speak their caption**; gold corners for prints won with the ear star; decoration won by finishing pages. **Caption it**: say the caption before placing a print | 3 | **5** | 3 (listening outside rounds; the spoken caption) | 4 | **5** (HTML, in the shell) | album (shared with the shell), speech | **First set** |
| G6 | **No bananas!** (K3 with a photobomber) | Kasuku sits still by the fruit; *aamo, nar Kasuku*; *with* rows 50/50 | **5** | 4 | 4 | 5 | 4 | as G1 + a still photobomber sprite | Level-3 rows of G1 now; its own mini-game when *with/without* (H26) and *parrot* (G32) arrive |
| G7 | Snap the moment (K4) | Section 3's M1: subjects that graze, sleep, wander; shoot the right one doing the right thing | 5 | 5 | 5 | 5 | **1** | subjects (new), moment | Phase 4, as data on the same evaluator |
| G8 | The journey (K1–K4 on rails) | Section 3's M7: the bus window, biome strips, laps | 5 | 5 | 4 | 5 | **1** | rail (new) | Phase 5; Arc 5 Ch2 |
| G9 | Right place (K5) | Section 3's M3: the cat on the charpai | 4 | 3 | 5 | 3 | 3 | rel (shared) | After `rel.js` and position words |
| G10 | Two together (K6) | Section 3's M5 | 4 | 4 | 4 | 5 | 2 | as G7 | Phase 4+ |
| G11 | Then and now | Section 3's M8: compose Nani's old photo at the village | 3 | 5 | 4 | 5 | 2 | photo, handin | Arc 5 Ch1 and Ch4 |
| G12 | Kasuku's snapshot | Section 3's M10 | 4 | 3 | 4 | 3 | 2 | as G7 | Becomes the **60-second entry** for the one hub daily (review, cross-mode), not a daily of its own |
| G13 | Say cheese (the family photo) | Tidy up arranges; Snap shoots *[EN: Nana] [EN: next to] Nani* and *all of us* | 4 | 4 | 4 | 3 | 2 | photo, rel | Arc 5 finale; kinship and position words first |
| ~~G14~~ | Sky watch | — | — | — | — | 2 | — | — | **Cut**: Monsoon owns the sky (review, decision 9) |

Also rejected, as in section 3: the game picking your best photo; silhouettes; rare behaviours as requests; photographing people to identify them (Who did it's); arranging the family photo (Tidy up's); Footprints (Who did it's).

**One concrete level-1 round of G1.** The intro card: Nani's face, two ••• rows; she says *trae aamo. Ne bo kelo.* Three seconds of quiet. The orchard is a still picture one and a half screens wide: a mango branch with six mangoes in two clusters, bananas in a bunch and singly, lemons, oranges. The child taps a mango cluster (the view swings to it), presses **+** once, nudges until three mangoes fill the frame and the fourth is off the edge, presses the shutter: a print slides into the tray, silently. Two bananas: another print. Two spare frames, unused. **Show Nani**: she asks *bo kelo* first (new order); the child taps the banana print; *Ghan!*, a laugh. *Trae aamo*: the mango print. Ear star, lens star (the mangoes filled the frame), tick. Word review: *aamo, kelo, bo, trae*. If the mango print had four in it, Nani says *Arre re! Char aamo*, then *trae aamo* again; the child picks again or goes back for one frame; the ear star for that row is gone.

### D3 The mechanics list

| Id | File | One line | Tag |
|---|---|---|---|
| `viewfinder` | `js/snap/mechanics/viewfinder.js` | A still scene (1–2 screens) under a fixed frame: drag to pan, **+/−** zoom steps, **tap-to-centre**, the shutter; emits the frame rectangle and zoom. Levels as data (`zoom`, `aimAssist`, `sceneWidth`) | **New** |
| `photo` | `js/snap/mechanics/photo.js` | The shutter: builds the **print record** (each sprite's kind, size class, visible fraction, area, centre) as a pure function of scene spots and the frame; `matches(print, row)` for K1–K3 (K4–K6 are added fields, same function); the thumbnail via `snapshotArea`; the prints tray (film = rows + 2) | **New** |
| `handin` | `js/snap/mechanics/handin.js` | Show Nani: rows re-asked in a new order; tap a print; recasts built from the print record; go back (+1 frame); the ear, lens and tick stars; receipt and word review through Cook's UI | **New** |
| `ali-camera` | `js/snap/mechanics/ali-camera.js` | Role reversal: a picture card, `listen({choices, timeoutMs})`, Ali frames what he heard through `viewfinder` in auto mode; pills and parent-judge fallbacks; the voice star | **New** |
| `album` | `js/snap/album.js` (HTML) | Pages, "?" audio slots, gold corners, decoration; `Album.add({mode, beat, image, caption})` is the hook every mode's story beats call | **New, shared with the shell** (all modes drop beat photos in) |
| `passme` | `js/cook/mechanics/passme.js` | **Quick shot**: mid-round Nani says *Hedo! {x}!* for a met word not on the card, from a look-alike group with ≥2 members visible; one bonus frame, one chance. Cook's interrupt timing, sidebar line and one-chance rule; the act is a shot | **Reused from Cook** |
| `which-one` | `js/shared/which-one.js` | Builds K2 rows and their decoys (asked noun in ≥3 sizes or colours, asked attribute on ≥2 nouns, balanced) and the blind-odds budget | **Shared** (foundation; Find it M3, Dress up D1, Who did it, Tidy up) |
| `scene spots` + `lookalike_groups` | `data/scenes/*.json`, `data/find.json` | Snap's orchard is a Find it scene file with `spots` carrying `{kind, size}`; candidate kinds come from Find it's look-alike groups | **Shared with Find it** (read only; Snap's scene is a sidecar file) |
| `speech` | `js/shared/speech.js` | `listen({choices, timeoutMs}) → {choice, confidence} \| null` | **Shared** (foundation) |
| `rel` | `js/shared/rel.js` | K5 rows, phase 4 | **Shared** (Find it, Tidy up, Monsoon), later |
| `subjects`, `rail` | `js/snap/subjects.js`, `js/snap/rail.js` | Section 8.2's moving world and the bus window | **New, phase 4–5** |

Counts for the first set: **5 new** (viewfinder, photo, handin, ali-camera, album), **1 reused from Cook** (passme), **3 shared** (which-one, speech, Find it's scene spots and look-alike groups). Cook's `count` mechanic is deliberately *not* reused: its tally badge is the thing a viewfinder must never show.

### D4 Speaking moments

| Moment | Where and when | The closed set | What the character does | Fallback | Star |
|---|---|---|---|---|---|
| **Ali's camera** (G4) | Level 2+ of G1 and G2; its own free-play entry "Ali's turn". Alternate rows: Nani asks the child to *tell Ali* | **Level 2:** the fruit nouns in the scene, 3–6 (e.g. *aamo, kelo, limu, santra*). **Level 3:** two listens, number then noun: `{hikdo…panj}` (5) then the nouns (3–6). Passed to `listen()` as word ids with the family's clips | Ali repeats what he heard (*Aamo? Ghan!*), swings the viewfinder to that kind and shoots the picture-card's count of it (level 2: the count is his, not tested). The print goes in the tray and is handed in like any other; a wrong hearing makes a wrong print and *Arre re, Ali!* The ear star is never touched by his mistakes | `null` or two low-confidence results → the word pills (speaker + text by stage) slide up; a parent-judge toggle ("Did they say it?" ✓ / again) in the sidebar; after 8 s Ali just asks *[EN: Which one?]* again, once, then shows the pills | **Voice star**: every said row recognised or parent-ticked; ≥2 said rows. A pill tap moves the round on and credits nothing |
| **Caption it** (G5) | The album, every level; and after a round Nani holds up one print: *[EN: What's this?]* (A8.4) | The nouns in that print plus 2 look-alikes from the same scene (3–6); for a "?" slot, the captions on that page (≤8) | Nani repeats it and the slot takes the print (a spoken caption earns the slot a small speaker mark; gold corners still need the ear) | The pills; or place the print without saying it | No star (outside rounds); the post-round caption adds one row to the voice star |

Never blocked: a round can always be finished by tapping. The oracle bot drives `listen()` with a stub that returns the chosen id; the leak bot returns `null` (it can't speak), so the voice star's blind rate is 0 and its ear rate is unchanged.

### D5 The first set and the level ladder

**First set: G1 Just so many → G3 Show Nani → G2 The big one → G4 Ali's camera → G5 the album.** Why: G1 and G2 are the two kinds of shot that are real Kutchi now and share one still-scene engine; G3 is where the ear star is earned and what stops the Sceptic spraying film; G4 is the mode's speaking moment and needs only the same viewfinder driven by code; G5 is the piece the review wanted early anyway and it is HTML. Nothing in the set moves. **Held back:** G6 as a mini-game (words), G7–G10 (the moving engine and `rel.js`), G11–G13 (Arc 5 art and words). The one scene is **the orchard** (`data/scenes/orchard.json`, greybox first), with the fruit sprites the game already has.

**The level ladder** (what the Kutchi instruction carries; levels are data in `data/snap.json`):

| Level | Name | What a row carries | Rows | The scene | Hands |
|---|---|---|---|---|---|
| **1** | *One thing* | **A noun and a number 1–3** (`trae aamo`), or **a noun and a size** (`vadho aamo`) | 2 | 4 kinds, each 4–6 fruit (G1) or in 3 sizes (G2), clusters of one kind | Tap-to-centre and one zoom step; a 1.5-screen scene |
| **2** | *Ne {x}* | Numbers to 5; big and small asked equally with a mid decoy; **Ali's camera** rows (a picture → say it); **Quick shot** interrupts | 3 | Kinds interleaved in clusters, so isolating N needs the third zoom step; 5 kinds | Drag to pan; 3 zoom steps |
| **3** | *No bananas* | **Two slots in one line**: `trae aamo, nar kelo` (count + exclusion); level-3 Ali rows are number then noun | 3–4 | A photobomber fruit bunch beside every cluster; 6 kinds; 2 screens | Busy pace: the daylight bar |
| **4** (words arrive) | *Which one?* | Colours (`[EN: red] {x}`), comparatives (`[EN: the bigger] {x}`, `[EN: smaller than] {y}`) through the shared which-one module; position rows (K5) once `rel.js` lands; the moment shot (K4) once subjects move | 3–4 | The courtyard and the farm | As level 3 |

A child feels it as: *how many → which one → how many, and leave that out → which one, by colour and by comparing*. Every step adds one thing the instruction carries, never a new control.

**Blind-bot estimates, level 1** (film = 4, rows asked in a new order, the bot can't hear): G1: the best blind play is one print per kind; the right kind is then in the tray with the right count 1 in 4 of the time and must still be picked first at hand-in (1 in 4): about 1/16 a row, **under 1% for two rows**. G2: one print per kind of the big one; size right half the time, picked 1 in 4: 1/8 a row, **about 2% for two rows**. G3 is the multiplier in those numbers, not a game of its own. G4: the blind bot can't speak; its pill taps earn nothing, so **0% voice**, and the ear rate is unchanged. G5: no stars. New leak-bot strategies added to section 8.4's list: **one per kind** (as above), **fill the frame** (one print of a whole cluster: fails exactly-N and main-subject), **the middle size** (never asked), and **everything alone** (for K3: a single-kind print; it fails the *with* half and the count).

### D6 Story home and free play

| Mini-game | Story home | Notes |
|---|---|---|
| G1 Just so many | **Arc 5 Ch3 The farm** ("mangoes up"): Nani wants prints of the harvest for the album; the mango tree is the orchard scene with farm dressing | The Roadmap's "mangoes up" is this |
| G2 The big one | **Arc 5 Ch3**, the same morning: the biggest mango for Nana, the small one for baby Isa | A second card on the same tree |
| G3 Show Nani | Every round | On the charpai under the tree |
| G4 Ali's camera | **Arc 5 Ch3**, the outro: Ali wants a turn; you tell him what to shoot; then **Ch5 the family photo**, where Ali shoots on your word before Kasuku photobombs | Ali's lines are a child cousin's voice if the family will record one |
| G5 Nani's album | **Arcs 1–4** (a beat photo at each arc's close, seeded by the shell) and **Arc 5 Ch1 The old trunk** (the album with gaps) | The shell owns the beat-photo hook; Snap owns the screen |

**Free play:** **Photo walk** at the orchard, from the camera icon on the hub shelf as soon as the mode ships (the camera is a toy before it is a story beat: the album is already on the shelf from Arc 1). It runs G1 and G2 rows from due and weakest words, at the player's level, with "Ali's turn" as a toggle. Kasuku's snapshot becomes the mode's 60-second entry for the one hub daily, after G7.

### D7 The review's critiques

| Critique | What I did |
|---|---|
| Rethink the timing; don't spawn an agent now | Zafar overruled the timing, so the *engine* is rethought instead: the first set has no subjects, paths, herds, occlusion, parallax or rail. A still scene, a rectangle evaluator, HTML prints. Sections 8.1–8.2's moving world is phase 4 |
| Only M2 counts is real today, and it's a third count mechanic | Accepted, and answered two ways: G2 uses *vadho/nindho* (the same drafts the review recommended Find it use next), so two kinds of shot are real; and Snap's count is a *framing* count (include exactly N, from level 3 exclude Y), which is not Cook's tally or Find it's tap-N. No digit on the row, unlike Cook |
| Heaviest engine; performance on iPad and phone unmeasured | Deferred with the engine; `snapshotArea` prints and a 2-screen still scene are measured on a phone in phase 1 before anything moves |
| Album screen early, via the shell | Adopted: G5 is in the first set; the beat-photo hook is a shared piece the shell agent provides |
| M1 and M3 are Find it with motion | Both deferred (G7, G9); the first set's identity is framing, not finding |
| Sits in Arc 5, may never be reached | The orchard is free play from the hub on day one; Arc 5 remains the story home |
| Three controls for a five-year-old | Level 1 is tap-to-centre plus one zoom step; drag arrives at level 2 |
| "Which one?" should be one shared module | G2 builds on it; Snap's only local decoy code is the fruit size classes |
| Six dailies → one hub daily | Kasuku's snapshot demoted to a 60-second entry |
| Arc 3 Ch1 and the sky | M12 cut |

### D8 Words needed (first set, in priority order)

| Priority | Words or lines | Status |
|---|---|---|
| 1 | Fruit nouns (*aamo, kelo, limu, santra, naariyel, daadam, papaiyo…*) and their plural after a number | **In the game** (drafts); checked by **E103–E118**, **C1–C11** |
| 2 | Numbers 1–10 | **In the game**; six to ten checked by **E119–E123** |
| 3 | *vadho / nindho*; "the big one / the small one" | **In the game** (drafts); **C22–C36, C49** |
| 4 | *nar* as "no X" in a request | **In the game** (draft); **A4** |
| 5 | *Take a photo of…* (H19), *Show me* (H21), *Here's the photo* (H22), *Look!* (E79), *What's this?* (A8.4), *How many?* (A8.7), *Which one?* (A8.6), *Nearly!* (E80) | **In the Questions doc** |
| 6 | *with · without · together · all of us* (H26) | In the doc; unlocks G6 |
| 7 | Colours (E60–E71); *bigger, smaller, taller, the biggest, the same* (H2–H5) | In the doc; unlocks level 4 |
| 8 | *Your turn, Ali* · *Tell Ali* · *Say it* (the role-reversal lines) | **Not in the doc: new** |
| 9 | Animals (G27–G34, H7–H11), *the goat is eating* (H6), positions (A5, E1–E13), then and now (H23–H25) | In the doc; phases 4–5 |

### D9 Decisions for Zafar (blocking only)

1. **No digit on Snap's count rows, at any word stage** (Cook shows one at stages 1–2). Default: **none**; "?" reveals it at the ear cost; stage-1 rows are taught, not tested, as everywhere.
2. **The level-1 scene**: a new orchard sidecar (`data/scenes/orchard.json`, Snap-owned, greybox first) or Find it's bazaar stall. Default: **the orchard**; the stall's piles can't be framed for "exactly N".
3. **Who holds the camera in role reversal**: Ali, Kasuku or Nana. Default: **Ali** (a child's mistakes are funny and safe; Kasuku can't hold a camera; Nana is the sleeping subject). Blocks G4's lines and voice.

---

## 1. Pitch and core loop

**Pitch.** Nani finds her old instant camera in the trunk, and the family set off for her village. Snap is the mode for **S6 (describing, nature, travel)**. Its core verb is **aim and capture**. Someone describes a *moment* in Kutchi: "the goat that's eating", "three mangoes", "the camel in front of the windmill". The player pans a wide, living scene, waits for that moment, frames it and takes the shot. Later they hand the print to Nani, and she's either delighted or says "Arre re!". Find it asks **which thing, and where**. Snap asks **which moment**: its subjects move, change what they're doing and wander in and out of places. The photo is judged by what's **inside the frame**: exactly how many, who's with whom, what's left out. Prints go into **Nani's album**, which is the collection that brings players back.

**One round (2–3 minutes; a journey lap is 60–90 s).**
1. **Intro card.** The requester's face (Nani, Ma, Ali) and one row per shot wanted, shown as a sequence, e.g. 3 rows. Nani says each row once. The card shrinks into the sidebar, then **3 s of silence**.
2. **Shoot.** The player drags to pan a panorama 2–4 screens wide, uses **+ / −** to zoom and presses a big shutter. Tapping a subject swings the camera to centre it (aim assist; it centres whatever you tap). Subjects live on loops: the goats graze, lie down and wander, Zazu pounces, Kasuku flaps. Each shot drops a developing print into the **prints tray** (bottom left, like the basket). The film left shows on the camera. **Nothing says at the time of shooting whether a print is right.**
3. **Show Nani** (the Game Design recall step). Nani asks for each row again, **in a new random order**. The player taps a print; she reacts to what's actually in it. If it's wrong, she recasts, then the player picks again. If no print fits, it's back to the scene with one extra frame.
4. **Stars** fill (ear, lens, tick or lightning). Then the receipt, a **word review** (Kutchi → English) and the album stamp.

**How it differs from Cook and Find it.**

| | Cook | Find it | **Snap** |
|---|---|---|---|
| Core verb | Build | Search (tap the one meant) | **Aim and capture** (pan, zoom, wait, frame, shoot, hand in later) |
| Camera | T, worktop | E, one still room or stall | **E wide panorama with parallax; subjects move; one scene rolls past on rails** |
| What the Kutchi decides | What goes in, how many, what order, for whom | Which noun, where, what colour and size | **Which moment** (the state), **what's in the frame** (exactly N, together, without), **which by comparison** (bigger, taller) |
| Time | Cooking timers | None (a hesitation replay) | **The world's own clock**: a state comes and goes; the road passes. Generous and repeating, never a reflex test |
| When you're judged | At once | At once (the tap) | **Later, at hand-in**: a second listening pass, and the print is the memory aid |
| Syllabus weight | S1, S2 verbs, S5 first/then | S1, S2 positions and colours | **S6 comparatives, nature, travel, the future; S4 animals; S5 actions and past tense (Then and now)**; S1 counts |

---

## 2. Research summary

### 2.1 Games: what we borrow and why

| Reference | Concrete mechanic | Why it works | What we take / don't take |
|---|---|---|---|
| **Pokémon Snap / New Pokémon Snap** | An on-rails course; photos scored on **pose, size, direction, placement, other subjects in shot, background**; the Photodex wants **4 photos per species (1★ ordinary to 4★ rare behaviour)**; **research levels** and **day/night** change behaviour on replay; alternate paths; **requests** from characters reward frames and stickers | Several goals per shot; the thrill of a moment passing; replaying one course keeps revealing things | **Take:** the rail (M7), the craft score (our lens star), research levels per place, time-of-day versions, requests as the round's rows, rare behaviours as collectibles. **Don't take:** "the game picks your best photo" (it would let you shoot everything; see Loop 1), and rare poses as request targets (a non-speaker would just shoot the weird thing) |
| **Alba: A Wildlife Adventure** | A phone camera identifies 62 species; unknown animals show a **"?"**; a wildlife guide per area; calm, no fail | Low pressure; a guide by place gives a "what lives here" goal | **Take:** album pages per place, and a "?" slot. **Change:** our "?" slot is an **audio riddle** (its caption spoken in Kutchi, no silhouette), so filling the album needs the Kutchi |
| **Umurangi Generation** | Each level is a **checklist of photo bounties** plus bonus bounties; **finishing a level unlocks lenses** (telephoto, fisheye), so old levels are worth replaying with new kit | Many ways to complete one bounty; new lenses make old places new | **Take:** the request card as a bounty list with an optional bonus row; lenses as upgrades that change how you play (zoom for "exactly N", wide for "together"). **Don't take:** open creative bounties ("anything goes"), since the Kutchi has to decide |
| **TOEM** | You **hand photos to characters** to solve their requests and see their reaction; a compendium of creatures, some appearing only under conditions | Handing a picture to someone who reacts is warmer than a score screen | **Take:** "Show Nani" (hand-in with reactions) as the end of every round |
| **Pupperazzi, Beasts of Maravilla Island** (the warning) | Photograph cute animals; reviewers: "doesn't test you in any meaningful way"; "interaction and creativity… limited" | Without a real test, photo games go flat fast | Our test is the Kutchi request plus framing rules (exactly N, main subject). Without them Snap would be Pupperazzi |
| **Find it M11 "Photo"** (passed on) | Frame the described thing; graded on right subject, centring and size; the album as a collection | Handed over to avoid overlap | Built in as M1 plus the lens star, with the album as the replay hook |
| **Collection design** (Yu-kai Chou; the endowed-progress effect) | Sets of **7–12** items feel achievable; motivation jumps once about half a set is owned; a head start raises completion (car-wash card study: 34% vs 19%) | Nearly finished pulls you back | Album pages of **8–10 slots**. Each page starts with 2 slots filled by story beat photos (the head start) |

### 2.2 Learning evidence

| Finding | Source | Design consequence |
|---|---|---|
| Preschoolers combine adjective + noun to pick one of several objects ("the tall glass"), and make **contrastive inferences when speech is slowed and size contrasts are visually clear** (visual-world eye-tracking) | Ju et al. 2023; Stanford ALPS 2018 | Snap is a visual-world task: listen, then look to the right one. The **slow replay** rung, and **big, clear size steps** in comparison sets |
| Children get *bigger* before *smaller*, *more* before *less*; words for the size dimension (*taller*) sharpen with age; new comparison words are learnt more easily used **comparatively** than categorically | Ferry et al. 2025 (Child Development); Barner & Snedeker 2008 | M4 teaches bigger → smaller → taller → biggest, in that order, always within a set on screen (comparatively, never "the big one" in isolation) |
| Referential communication (barrier) tasks: tell a target from **similar alternatives**; children's own descriptions tend to be **redundant, not contrastive**, until later | ScienceDirect 2017; academia.edu (redundant messages) | Every request has look-alike alternatives on screen. Role reversal (M11) comes later and is scored on *enough to tell them apart* |
| **Photo-taking impairment**: photographing whole objects weakens memory for them; **zooming in on a detail removes the effect** | Henkel 2014, Psychological Science | The **hand-in recall step** (Nani asks again, you choose from memory) and **zoom-to-frame** requests (exactly N, a detail) make you attend, rather than offloading memory to the camera |
| Ages 4–6: **37% could tap an object moving across the screen vs 57% a stationary place**; touch accuracy improves with age | Vatavu et al. 2015 (IJHCS); PMC 2020 gestures study | **Pan the world under a fixed frame** (no chasing a moving target with a finger); tap-to-centre; subjects slow and **hold states for 5–8 s at level 1** |
| Interactivity helps when it's **specific to the named target**, and can distract when tapping is general | Kirkorian et al. 2016; Russo-Johnson et al. 2017 ("All Tapped Out") | Shutter spam gains nothing (limited film, a gentle "slow down"); taps on scenery do nothing mid-round |
| Grandparent storytelling and family media support heritage language, identity and enthusiasm | T&F 2026 (Polish grandparents, digital stories); MDPI 2025 (storytelling in the heritage language) | **Then and now** (M8): Nani's memories, told in Kutchi, rebuilt as photos; Grandparent mode |
| Retrieval practice and **prompts beat recasts** (as in Find it) | Fritz 2007; Lyster & Saito 2010 | After a wrong print: a recast, then **the player chooses again**. Nothing auto-shown |
| Photo scavenger hunts are an established classroom vocabulary task (themes, then photograph and share) | Outschool, A World of Language Learners (practice write-ups, not trials) | Weak evidence, but a ready-made teaching shape; our version makes the listening the brief |

Sources are listed at the end. Blocked pages (Game Developer's TOEM Q&A, NCBI full texts) were summarised from search results.

---

## 3. Mechanic library

Scores are 1–5. **Every row is one engine**: a request is `{noun, state?, place?, count?, compare?, with?, without?}` checked against a print's contents, just as Find it's rows are slots.

| # | Mechanic | How it plays | Fun | Forces Kutchi: the decision, the leaks and their fixes | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **M1** | **Snap the moment** (subject + what it's doing) | Row: `{noun} [EN: eating]`. The scene holds **≥3 of the noun plus a look-alike** (goats and sheep; hens and a rooster), all cycling through the **same** states at random phases. Shoot the right one while it's doing it | **5** Pokémon Snap's "now!" with funny animals; click, flash, reactions at hand-in | **5** *Which subject, which moment.* Leaks: the requested state is the rare or animated one → states are asked uniformly, and rare behaviours are **never** requests; one instance → ≥3; a wide shot of everything → **main-subject rule** (the target must be the biggest of its noun in frame and in the middle third); fixed loops → random phase and spot each round; told at shutter → judged only at hand-in | **4** Find it also finds a described thing, but a still one. Here the target is a passing state | **5** Arc 5 Ch1 camera test (cats, Kasuku), Ch2 journey, Ch3 farm | **5** Random phases, research levels add states, day/dusk, album slots per subject × state |
| **M2** | **Just so many** (exactly N in the frame) | Row: `trae aamo` (three mangoes) or `[EN: two] [EN: goats]`. A branch or a herd won't hold still. Zoom and pan until **exactly N** of that noun are in frame, ≥50% visible | **4** A framing puzzle; the parakeet that eats a mango just as you shoot | **5** *N and the noun.* **Works today with real Kutchi** (fruit + numbers 1–10 at the farm). Leaks: an in-frame counter (none, ever); the digit on the row (only while the number word is at stage 1–2); N always the middle value → N uniform in 1…herd−1, herd sizes vary; mixed herds (goats + sheep) so the noun matters | **5** No other mode grades what's included and what's left out | **4** Farm (mangoes, goats), journey (camels, flamingos), Ch5 family photo ("all seven of us") | **4** Herd sizes, mixed herds, fruit eaten over time |
| **M3** | **Right place, right time** (subject + position, timed) | Row: `{noun} {anchor} [EN: on]`. The cats and hens wander between spots (charpai, cart, well, wall). Wait for the right one at the right place | **4** Anticipation: watch Zazu's path, wait by the charpai | **5** *The position phrase.* Leaks: only one subject ever visits that spot → every subject visits ≥3 spots; walking *towards* the spot gives it away → paths are shuffled and every subject passes several spots; relation icons on rows → none | **3** Positions are Find it's M2 ground; Snap's twist is the waiting. Shares Find it's anchors and relation data | **4** Courtyard (Ch1), farm (Ch3) | **4** Spots shuffled, anchors per scene |
| **M4** | **Which one?** (comparing) | Row: `{noun} [EN: bigger]`, `[EN: the tallest] {noun}`, `{noun} [EN: smaller than] {noun2}`. Sets of 3+ in clear size steps | **3** A thinking shot; less juicy alone, good as a slot inside M1/M7 | **5** *The comparative.* Leaks: the biggest is always the adult or the nearest → ≥3 size steps at mixed depths (parallax scale is corrected for); *bigger* and *smaller* asked equally once both are taught; the reference object in "smaller than X" varies | **4** Tidy up compares by *arranging*; here it's between moving things in depth | **4** S6's core grammar: the journey (camels, trees, windmills), farm | **3** Many sets, but the idea is the same |
| **M5** | **Two together** (composition) | Row: `{noun} [EN: in front of] {noun2}` or `{noun} [EN: with] {noun2}`. On rails, **parallax** makes "the camel in front of the windmill" a lining-up moment | **4** Lining up near and far layers is the most photographer-like act here | **4** *Which pair and which relation.* Leaks: only one pair ever meets → each subject meets ≥2 others; the relation is always *in front of* → mixed | **5** The parallax alignment is unique to Snap | **4** Journey; Ch5 family photo ("Nana next to Nani") | **4** Pairs × relations × routes |
| **M6** | **Not in my photo!** (without X; photobombs) | Row: `{noun} [EN: without] {noun2}`. Kasuku flaps through, Zazu leaps onto the charpai, Ali pulls faces. Keep them out, or, in "with" rows, get them in | **5** The running gag of the game's pets; funny failed prints for the album | **4** *"Without" versus "with".* Leaks: "without" always names the cat → "with the cat" rows too, 50/50; the excluded one is always there and moving (the Cook audit's "no X item always on the shelf") | **5** Only mode that grades exclusion | **3** Courtyard, farm, Ch5 (Ali photobombs the family photo) | **4** Photobomber changes per round |
| **M7** | **The journey** (on rails) | The bus window rolls through Kutch: grassland, salt pans, windmills, a lake of flamingos, the village gate. The lap's rows are given **at the start** (3–4). You pan up and down the window and zoom; the road does the sideways motion. **Missed? The road loops** ("we'll see more on the way back") | **5** Pokémon Snap's rail: "there it is!", one pass, a new view each lap | **4** Any slot (M1–M5). Leaks: a request said just before its stretch → rows given up front in random order; each stretch holds look-alikes for several rows; the bus never slows near targets (slowing is a *hint*, which costs the tick) | **5** The only auto-scrolling scene in the game; it's also Monsoon rush's opposite (calm, predictable, repeating) | **5** Arc 5 Ch2, the chapter's whole point; the road home | **5** Route segments, time of day, alternate turnings, research level |
| **M8** | **Then and now** (Nani's memory) | Nani (or Nana) describes an old photo from the trunk in Kutchi ("I stood by the well with two goats…", past tense). You compose it at the village today. **The old photo is shown only after you hand yours in**, side by side | **4** The reveal; the most moving moment in the mode | **4** *The composition, from a past-tense description.* Leaks: showing the old photo first (visual matching) → revealed after; one well, one tree → two wells, several trees | **5** Unique, and it's heritage made playable | **5** Arc 5 Ch1 (the trunk) and Ch4 (Nana's stories) | **2** A fixed story set of 8–10 pairs; a collection, not endless |
| **M9** | **Show Nani and the album** (the system) | Hand-in as above. Prints can go into **Nani's album**: pages per place of 8–10 slots. An empty slot is a **"?" card that speaks its caption in Kutchi** (e.g. `[EN: goat] [EN: sleeping]`). Put the right print in to fill it; a slot won through a request with the ear star gets a **gold corner** | **4** TOEM's warm hand-in; an album filling up | **5** Second listening pass (rows asked in a new order); the "?" slots are audio riddles. Leaks: prints in row order → rows asked in random order; album captions show Kutchi text (that's learning, outside rounds); brute-forcing slots in Explore → a wrong placement rests that slot until the next visit, and brute force never earns gold | **4** The album is Snap's own; Find it keeps only a finds collection | **5** Seeded from Arc 1 by story beat photos; the finale's last page | **5** Pages per place, gold corners, best shots, rare behaviours |
| **M10** | **Kasuku's snapshot** (daily pets) | Hub courtyard, 60 s: Simba, Zazu, Kasuku; 3 rows from the player's weakest words; rare poses to collect (Zazu asleep in Nana's cap) | **4** The pets; Wordle-sized | **4** Same slots as M1/M3. Leaks: cat *names* aren't Kutchi, so rows never tell the cats apart by name alone (size or colour words, or a state); Kasuku stays silent in the round, apart from echoing "Arre re!" after a miss (allowed by the cast rule) | **3** A skin on M1, but a daily, hub-only shape | **3** Hub, every day after the camera is found | **5** Daily, weakest words, rare poses, "days with Kasuku" |
| **M11** | **Caption it** (role reversal) | After a shot, build its caption from audio chunks (`[EN: goat]` + `[EN: sleeping]`) for Ali, who's away; he replies with a sticker. Grandparent mode: say it aloud, Nani marks it | **3** Being the expert | **5** Production; scored on *enough to tell it apart from the others in the scene* (contrastive, not redundant) | **4** | **3** Ali at the village, Nana's stories | **3** Any print |
| **M12** | **Sky watch** (weather) | The monsoon's coming: shoot `[EN: the dark cloud]`, `[EN: birds flying home]` | **3** Pretty but slow | **4** Weather words (S4). Leaks: only one dark cloud → several shades | **2** Overlaps Monsoon rush (weather) and Find it M9 (times of day) | **3** Arc 3 Ch1 "Clouds coming", *if* Monsoon rush doesn't take it | **2** |

**Rejected or handed to other modes:**
- **"The game picks your best photo"** (Pokémon Snap): lets you shoot everything.
- **Silhouettes** in the album or on rows: a picture of the answer.
- **Rare behaviours as requests**: shoot the oddest thing.
- **Photographing people to identify them** ("match the face", "the man with the red cap"): that's Who did it's deduction and Find it's M10. Snap uses people only as *subjects* by job noun (`[EN: farmer]`).
- **Arranging the family photo**: Tidy up's. Snap takes the shot once they're arranged.
- **"Photograph the clues"** in Arc 4 Footprints: Who did it's.
- **Reflex rounds with fast subjects**: Monsoon rush's.

---

## 4. Recommended first set

One engine: a panorama camera, subjects with state machines, a photo evaluator, and requests as data. Then these on top of it:

| Order | Mechanic | Why first |
|---|---|---|
| 1 | **M1 Snap the moment**, with **M3's place slot** | The core fun, and it proves the engine: subjects, states, capture, evaluation. Cats and Kasuku in the courtyard use existing character sheets and Find it's courtyard background |
| 2 | **M9 Show Nani and the album** | The recall step and the ear star live here, and it's the replay hook. Without the hand-in, the Sceptic wins (Loop 1) |
| 3 | **M2 Just so many** | The only mechanic that **forces real Kutchi today**: fruit + numbers at the farm (`trae aamo`). So the leak bot can gate on genuine words from day one |
| 4 | **M7 The journey** | Arc 5 Ch2's whole chapter, and the most distinct thing in the mode. Parallax strips are cheap to draw |
| 5 | **M4 Which one?** (as a slot) | S6's comparatives. Engine cost is tiny (a rank check), but it **can't pass the leak test until the family's comparative words arrive** |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| M10 Kasuku's snapshot | Straight after the first set | Cheap (M1 in the hub courtyard); the daily hook for Farah |
| M5 Two together, M6 Not in my photo | Phase 4, as twists | Need `with / without / in front of` from the family; cheap once M1 exists |
| M8 Then and now | Arc 5 Ch1 and Ch4 build | Needs past-tense recordings (S5) and old-photo art (possibly young Nani) |
| M11 Caption it | When produce stages are live | Production, and the phrase builder is a platform piece (Cook to-do, item 5) |
| M12 Sky watch | Only if Zafar wants it in Arc 3 | Distinctness is weak; Monsoon rush may own the sky |

---

## 5. Story integration

### 5.1 Where Snap appears

| Arc · chapter | Beat | Snap's part | Other modes in the chapter |
|---|---|---|---|
| **Arcs 1–4 (no mechanic)** | Each arc's closing beat is a **family photo that drops into Nani's album** automatically: Eid morning, the wedding, chai in the rain, the ring back on Nani's finger | Seeds the album with 2 filled slots per page (the endowed head start) and shows it on the hub shelf long before Snap exists. **Zero build cost beyond the album screen** | — |
| Arc 3 · Clouds coming (optional) | Washing out, the sky changes | M12 Sky watch, *if Zafar wants it* | Tidy up (bring it in) |
| **Arc 5 · The old trunk** | Nani opens the trunk: her **old instant camera**, a film pack, and an album with gaps where photos faded | **"Does it still work?"**: M1 + M3 in the courtyard (Simba, Zazu, Kasuku). M6 comes as a surprise when Kasuku photobombs. First Then and now pair (M8) as the outro | Who did it: *match the face* (young and old) |
| **Arc 5 · The journey** | The bus to Nani's village | **M7** with M1/M2/M4 rows. Nana dozes against the window (a subject: `[EN: Nana] [EN: sleeping]`); Ma and Nani give the requests. The road opens on the world map as you travel | — |
| **Arc 5 · The farm** | Mangoes up, groundnuts down, lunch | **M2** (mangoes on branches while the parakeets eat them; goats), M1 (cow, buffalo, hens), M6 (hens without the rooster) | Tidy up (pick and dig), Cook (farm lunch) |
| **Arc 5 · Nana's stories** | Listen, then put the pictures in order | **M8 Then and now**: Nana's story of the well and the old tree, rebuilt as today's photos, with the old prints revealed | Ask around / Who did it (order the story) |
| **Arc 5 · The family photo** (finale) | Arrange everyone | Tidy up arranges. **Snap takes the last photo**: M2 "all of us" + M5 "Kasuku too", with Ali photobombing (M6). It's the album's last page and the final quilt patch | Tidy up |
| Road home (optional epilogue) | The bus back at dusk | M7 at the dusk grade (buffalo returning, flamingos flying) | — |

### 5.2 Cast who drive it

| Who | Role in Snap |
|---|---|
| **Nani** | The main requester; the album's keeper; her memories drive Then and now; she reacts to every print (laughs at photobombs) |
| **Nana** | A comic subject (asleep on the bus); the storyteller for Then and now in Ch4 |
| **Ma** | Journey requests (a second voice; the Game Design doc's "multiple voices are a feature") |
| **Ali** | Photobomber (M6); later the one you caption photos for (M11) |
| **Simba and Zazu** | Subjects at home: states (asleep, washing, pouncing, stretching) and places (on the charpai, under the cart). *Big/small* and *dark/light* separate them, never their names. Rare poses for the album |
| **Kasuku** | Subject and photobomber (flies through, sits on shoulders). He echoes *"Arre re!"* after a miss, which the cast rule allows; otherwise he's silent in rounds. In the hub he may repeat a word from the last round's rows, idle only |
| **Big Ma** | She's in the trunk's old photos; she sings on the bus (her recorded song as the journey's ambient track: an existing planned asset) |
| **The doctor** | Cameo subject in the village (`[EN: doctor]` on his bicycle), a jobs noun (S6) |
| **Villagers** (generic farmer, shepherd, bus driver) | S6 jobs as subjects, by noun only |

### 5.3 The world map

- The camera comes from the trunk (Ch1). **The journey draws the road** on the map: each stretch you pass clears its fog and drops a pin (grassland, salt pans, windmills, lake, village gate). The rail *is* the map reveal.
- **New places:** the Road (rail), the Village, the Farm; later the Lake at dawn as a research-level unlock.
- From then on, **every Snap place and Find it's courtyard** show a camera icon on the map for free play.

### 5.4 Free-play route

| Entry | What it is |
|---|---|
| **Photo walk** (any Snap place) | Endless rounds from due and weakest words, a best roll score per place, research level per place |
| **Road trip** | Random route segments on the rail; best lap |
| **Kasuku's snapshot** (hub, daily) | 60 s, 3 rows; "days with Kasuku" count that never resets |
| **Explore** (any place, no rows) | Film is free, prints go to the album's "?" slots by ear. Tapping a subject names it (stage-1 teaching). No stars |

---

## 6. Learning design

### 6.1 Words and frames it drives

| Syllabus | Words | Frames (existing Kutchi, or a placeholder) |
|---|---|---|
| S1 | Fruit on the trees (*aamo, naariyel, papaiyo, daadam, kelo*), numbers 1–10 (*hikdo … do*) | Row = `{n} {x}` (Cook's `grammar.count`), e.g. `trae aamo`; *Ne {x}* between rows; *Hedo!*; *Arre re!*; *Ghan* (at hand-in); `[EN: Take a photo of…]` said once per round |
| S2 | Positions (in, on → under → behind → next to → in front of, in that order, shared with Find it); household anchors (charpai, cart, well, wall, door); colours (the red bus) | `{x} {anchor} [EN: on]`: one recorded phrase per (anchor, relation), as in Find it |
| S4 | **Farm animals and birds** (goat, sheep, cow, buffalo, camel, donkey, dog, hen, chick, rooster, peacock, parrot, crow, flamingo); weather, times of day (dusk grade) | `{x} [EN: is eating]`: state words |
| S5 | **Action verbs** as states (eating, sleeping, drinking, running, flying, sitting, jumping); past tense in Then and now | `[EN: I stood by the {x}]`, `[EN: when I was small]` (heard, not produced) |
| **S6** | **Comparatives** (bigger, smaller, taller, the biggest, smaller than); **nature** (tree, well, pond, lake, field, sky, cloud, sun, moon, hill, sand, salt); **travel** (bus, truck, bicycle, motorbike, camel cart, tractor, road, village, farm, mosque); **jobs** (farmer, shepherd, driver, doctor); **future** | `{x} [EN: bigger]`; `[EN: soon we'll see {x}]` (future, heard at the start of a lap); `[EN: because…]` heard in Nani's reactions (not tested) |

**Rows grow like Find it's.** Level 1: noun (+count). Then noun + state, or noun + place. Then noun + comparative. Then two subjects + relation. Then with/without.

### 6.2 Word-stage fading (text in one place)

| Word stage | Request row | In the scene | Album "?" slot |
|---|---|---|---|
| 1 New | Text + speaker; as Nani says it, **the target twinkles once**. **Taught, not tested**: doesn't count for the ear star | Tapping a subject names it only in Explore | Caption: text + speaker |
| 2 Learning | Text + speaker | No twinkle, no labels | Speaker + text |
| 3 Nearly known | Speaker only, `•••` (side-by-side hidden words share one `•••`, as fixed in Cook Wave 4) | Nothing | Speaker only |
| 4 Known | Heard once at the intro; replay costs the tick | Nothing | Speaker only |

- **No labels in the scene, ever, in a round.** A label is the answer.
- **Counts:** a digit on the row only while that number word is at stage 1–2. No counter in the viewfinder at any stage.
- **The ear star needs ≥2 tested rows** (stage ≥2) in the round. Otherwise it shows as "new words" and pays nothing. This closes the "fresh profile every time" trick (Loop 3).

### 6.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | Tap the row's speaker | Free the first time, then the tick (Relaxed) or patience (Busy) |
| 2 Slow replay | Half speed, a pause before the key word (supported by the adjective research) | Tick / patience |
| 3 Warmer | Static scenes: Nani gestures to **a third of the panorama**, which must still hold ≥3 candidates. Rail: **the bus slows** for the next stretch | Tick + the combo breaks; the ear star stays |
| 4 Reveal (eye) | Shows the row's Kutchi text | Ear star for that row, from stage 2 |
| 5 Translate | English gist | Ear star for that row |
| 6 Shown | Stage 1 automatically; otherwise after 2 wrong prints for the row, the target twinkles | Ear star for that row; the word doesn't advance |

- Hesitation never shows the answer: after about 8 s with no shot, Nani replays the line (rung 1, free the first time).
- **No upgrade makes a hint cheaper.**

### 6.4 Mistakes: recast, then the player tries again

At hand-in, the evaluator knows what's in each print, so Nani can say what the player *actually* shot: *Arre re!* `{noun in print} {its state/place/count}` … then the row again. The **player then picks another print**. If none fits: "let's go back" (+1 frame, same scene, the ear star for that row already lost). On the rail, the road loops. Kasuku echoes *"Arre re!"* (idle mimicry, allowed). Two misses on a word drop it a stage (the existing rule).

**Spaced retrieval:** rows are due words plus up to 3 new ones, weakest first. **Quick shot** is Snap's version of "pass me": mid-round, Nani says *Hedo!* `{X}!`, naming a met word **not on the card**, chosen from a look-alike group with **≥2 group members visible**. One bonus frame, one chance. The hand-in is a second retrieval, and the album's "?" slots are a third, spread across days.

### 6.5 Role reversal

- **M11 Caption it:** pick audio chunks for a print; scored as *enough to tell it apart* in that scene.
- **Ali shoots for you:** you give Ali the request by chunks; he shoots exactly what you said, which is funny when it's wrong.
- **Grandparent mode:** Nani reads a row aloud from big type, the child shoots, and Nani marks the print. Or the child describes a print aloud and Nani marks it. It needs Cook to-do item 5(b) (frames with slots marked) and Find it's relations-as-data.

### 6.6 Needed from the family (English placeholders until then)

| Need | Status |
|---|---|
| "Take a photo of…", "Look!", "Smile!", "Here's the photo", "Show me" | New |
| Can *Muke {x} khape* be used for "I want [a photo of] X", or is there a better frame? | New (links to Round 1, Q6) |
| Animals: goat, kid (baby goat), sheep, cow, buffalo, camel, donkey, dog, hen, chick, rooster, peacock, parrot, crow, flamingo | New (S4 list) |
| States as verbs: eating, sleeping, drinking, running, flying, sitting, jumping, "is on…". **Does the verb change with the animal's gender?** (It decides whether to record per animal or build from chunks) | New (links to Round 1, Q1) |
| **Comparatives:** bigger, smaller, taller, the biggest, "smaller than X". How is the comparative formed? | New |
| Nature: tree, well, pond, lake, field, sky, cloud, sun, moon, hill, sand, salt | New (weather part asked in Round 1, Q11) |
| Travel: bus, truck, bicycle, motorbike, camel cart, tractor, road, village, farm, mosque | New |
| Jobs: farmer, shepherd, driver, doctor | New |
| with, without, together, all of us | New (*no/without* already top of Cook's Round 2 list) |
| Future: "soon we'll see…", "we're going to the village" | New (S6) |
| Past tense for Then and now: "I stood by…", "when I was small", "there were two goats" | Asked in part (Round 1, Q4) |
| Positions and colours | Asked (Round 1, Q3, Q11); shared with Find it |
| Plural of fruit nouns ("trae aamo"?) | Asked (Round 1, Q2) |
| Recording shape: about 15 animals × about 6 states. If verbs are chunkable, about 30 short clips; if not, up to about 90 | For the recording session |

---

## 7. Stars, rewards and upgrades

| Star | Earned when |
|---|---|
| **Ear: understood** | Every tested row handed in right first time (Find it's Q3 on half-star leniency applies here too); ≥2 tested rows needed |
| **Lens: good shot** (this mode's own icon: a camera lens iris) | Every handed-in print frames well: main subject 15–70% of the frame, within the middle third, ≥90% visible, sharp (panning slowly enough at the shutter), and facing the camera gives a bonus. Rated at the shutter **on whatever the biggest subject in frame is**, so the rating never says which subject was wanted |
| **Tick** (Relaxed, no help) / **Lightning** (Busy) | No help used / done before the visible **daylight bar** (static scenes) or the **road bar** (rail) runs out |

- **Zayn's numbers:** each print shows points (size, placement, sharpness, facing, background) *after* hand-in, Pokémon-Snap style, with a **best shot per album slot** and a **best roll per place**.
- **Pocket money:** 5 for helping, +5 ear, +3 lens, +3 tick or lightning, +2 per new album slot, +5 for a rare behaviour; combo for consecutive rows right first time. Money is never lost.
- **Collectibles:**
  - album pages of 8–10 slots per place;
  - gold corners (won by request with the ear star);
  - **rare behaviours** (a 4★ equivalent: the peacock dancing, Zazu asleep in Nana's cap, the camel yawning, Kasuku riding Simba), never requested;
  - Then and now pairs (8–10).
- **Album decoration** (for Maryam): Kutch-style photo corners, ajrakh page borders and stickers are **won by finishing pages**, not bought, in line with the Game Design rule "money that buys hats is grinding".

**Upgrades** (physical only; none does the listening):

| Upgrade | Effect | Why it's fair |
|---|---|---|
| Zoom lens (2× → 3×) | Tighter framing for "exactly N" and far subjects | Framing only |
| Wide lens | Fits groups: "together", the family photo | Framing only. The main-subject rule still applies, so wide isn't "shoot everything" |
| Steady strap | Wider sharpness window | Hand skill |
| Quick winder | Shutter recovery 1.2 s → 0.6 s | Hand skill |
| Extra film (+1, max +2) | Spare frames | Guarded by hand-in choice; leak-bot tested at max |
| Flash | Dusk and night scenes, some rare behaviours | Light only |
| Treats bag (grain, wool ball, mango slice) | Triggers **rare collectible behaviours only**, never a requested state | So it can't make the answer happen |
| Front seat (rail) | A taller window, so more sky and road in view | View only |

**Deliberately none:** a subject finder, focus that locks onto "the right one", a beep on a match, cheaper hints.

---

## 8. Engineering spec

### 8.1 Data model (`data/snap.json`, plus scene files shared with Find it)

```json
{
  "subjects": {
    "goat": {"word": "ph-goat", "group": "hoofed", "size_cm": 70, "facing": true,
      "states": {
        "graze": {"word": "ph-eating",   "art": ["goat-e-graze"], "hold": [5, 8]},
        "lie":   {"word": "ph-sleeping", "art": ["goat-e-lie"],   "hold": [5, 8]},
        "walk":  {"word": "ph-walking",  "art": ["goat-e-walk-1", "goat-e-walk-2"], "moves": true}
      },
      "rare": {"jump-wall": {"art": ["goat-e-jump"], "trigger": "treat"}}}
  },
  "lookalike_groups": {"hoofed": ["goat", "sheep", "kid"], "birds": ["hen", "rooster", "crow"]},
  "mechanics": {"moment": {"levels": [
    {"rows": [2, 3], "candidates_min": 3, "hold_scale": 1.6, "speed": 0.6, "aim_assist": 1.0,
     "zoom": [1, 2], "film_spare": 2, "twinkle_new": true},
    {"rows": 3, "hold_scale": 1.2, "speed": 0.8, "zoom": [1, 3]},
    {"rows": [3, 4], "hold_scale": 1.0, "speed": 1.0, "aim_assist": 0.4, "slots": ["state", "place", "compare"]}
  ]}},
  "requests": {"slots": {
    "noun":    {"from": "$scene.subjects", "prefer": "weak"},
    "state":   {"pick": "$noun.states", "uniform": true},
    "place":   {"relation": ["on", "under", "next-to"], "anchor": "$scene.anchors"},
    "count":   {"int": [1, "$herd-1"]},
    "compare": {"pick": ["bigger", "smaller", "tallest"], "set_min": 3},
    "with":    {"chance": 0.5}, "without": {"chance": 0.5}
  }},
  "places": {"courtyard": {"scene": "courtyard", "research": [{"add": ["kasuku"]}, {"add": ["dusk"]}]},
             "road": {"scene": "road", "rail": {"speed": 90, "loop_s": 75, "segments": ["banni", "salt", "wind", "lake", "gate"]}}}
}
```

**Scene files** (`data/scenes/<scene>.json`) extend Find it's schema:
- **Existing:** `anchors`, `spots` (anchor + relation + depth), `occluders`, pan width, `safe` zones.
- **New:** `paths` (waypoint graph between spots), `herds` (spawn region, count range, kinds), `parallax` (layers with scroll factors and scale-by-depth), `segments` (rail biomes and the subjects each can hold), `tray_safe` (no path in the bottom 22%).

**Print record** (what the evaluator produces at the shutter, and all the hand-in uses):

```json
{"t": 41.2, "frame": {"x": 2210, "y": 310, "w": 800, "h": 450, "zoom": 2}, "sharp": 0.92,
 "subjects": [{"uid": "goat#2", "kind": "goat", "state": "graze", "place": {"anchor": "well", "rel": "next-to"},
               "visible": 0.95, "area": 0.21, "centre": [0.04, -0.1], "facing": "camera", "sizeRank": 1}]}
```

**Matcher** (a pure function): `matches(print, row, sceneAtShutter) → {ok, why}`.

| Row type | Rule |
|---|---|
| Moment / place / compare | The target is the **main subject**: the biggest instance of its noun in frame (≥8% of frame area, ≥60% visible, centre in the middle third). No other instance of the same noun is more than half its area. The state, place or rank holds *at the shutter time* |
| Exactly N | Count instances of the noun ≥50% visible = N exactly |
| Together | Both subjects ≥60% visible, and the relation holds in screen space (parallax-corrected) |
| Without | The noun is satisfied, and the excluded subject is <10% visible |

### 8.2 Reuse and new building blocks

| From | Reused as is |
|---|---|
| Cook | Word pill; order ladder rows (`Cook.Order.ladder` logic: shuffling, one `•••` per hidden group); `lang.js` frames and `grammar.count`; stars shown as they happen; receipt; word review card; Relaxed/Busy; `levels` knobs and `byLevel` slots; help costs; the ghost-finger demo; "Arre re!" recasts |
| Find it | Scene schema (anchors, spots, occluders, safe zones); look-alike groups; hint ladder rungs 1–6; the "slow down" guard; the non-speaker bot framework; the courtyard and bazaar backgrounds (E, 1.5–2 screens) as Snap places; `place_preview.py` |
| Shell | `js/progress.js` word stages, `js/storage.js`, `js/audio.js`, pocket money wallet, quilt, world map places as data |

| New building block | Size |
|---|---|
| `camera.js`: a panorama camera (drag pan, ± zoom, tap-to-centre with aim assist, a fixed viewfinder, the shutter with a blur check) | M |
| `subjects.js`: behaviour state machines (states with hold ranges, random phase, walking along path graphs, herds, rare triggers) | M |
| `photo.js`: the evaluator (visibility against occluders and the frame; area; centre; facing; sharpness) + thumbnails via `renderer.snapshotArea` | M |
| `requests.js`: the slot generator (candidates guaranteed) + the matcher | S |
| `rail.js`: auto-scrolling parallax, segment spawning, loop | S |
| `handin.js`: prints tray, "Show Nani", recasts, reshoot | S |
| `album.js` (HTML): pages, "?" audio slots, gold corners, decoration | S–M |

### 8.3 The lab (Snap lab)

Pick a place, mechanic, level and seed. Toggles:
- **debug boxes** (grey subject rectangles with state names; lab only);
- **freeze time**, **force state**, **spawn herd**;
- **Nani helps**;
- **bot** (none / non-speaker / oracle);
- **show print records** (JSON).

It also plays any single row type on a greybox (the Find it process: greybox before art).

### 8.4 Test harness and leak bot (`build/test_snap.py`)

| Run | Pass condition |
|---|---|
| `--unit` | Evaluator and matcher on fixed print fixtures (main subject, exactly N, occlusion, parallax relation, without) |
| `--fair` | For 500 seeds per mechanic × level × place: every row is satisfiable within the round (the target reaches its state ≥2 times in reachable view) and has ≥3 candidates |
| `--oracle` | A bot that knows the answers earns the ear star in **≥95%** of rounds (rounds are winnable, and aim assist and holds are generous enough) |
| **`--leakbot`** | The non-speaker bot sees only the screen and runs every strategy below. **Ear star in <10% of rounds per strategy and combined (target <5%)**, on **Kutchi-only content** (rows whose deciding words have Kutchi). Placeholder rows are reported separately as "not yet a Kutchi test" |
| `--lab`, `--story` | Every mechanic at levels 1–3; Arc 5 Ch1–5 end to end |
| `--viewport` all six sizes (phone 915×375, 1366×768, 1440×900, 1280×800, iPad, iPad portrait) | The tap-cover check before every tap (sidebar, prints tray and hands never cover the shutter, zoom or a reachable subject); screenshots that Claude looks at |

| Leak-bot strategy | Why it now fails | Expected ear rate |
|---|---|---|
| Shoot the most salient subject (biggest, nearest, centre of the start view, moving) | ≥3 candidates; start view and phases random; target chosen uniformly | ≈ (1/3)^rows ≈ 4% |
| Shoot the rarest or most animated state | Rare behaviours are never requested; states uniform | ≈ chance |
| One wide shot of everything | Main-subject and exactly-N rules | 0% |
| Shoot one of each candidate, hand in at random or in shot order | Film = rows + 2 (+2 upgrade) can't cover them; rows asked in a new random order | ≤5% |
| Wait for a glow | Only stage-1 rows twinkle, and they aren't tested; ≥2 tested rows needed | 0% extra |
| Rail: shoot what appears just after a row is spoken | Rows all given up front; stretches hold look-alikes | ≈ chance |
| Row shape: length, dots, digits | One `•••` per hidden group; digits only at number stage 1–2, and the noun still decides between mixed herds | ≈ 1/2 per count row |
| "Without" = avoid the cat | Half such rows are "with" | ≈ 1/2 per row |
| A fresh profile every round | Ear star not offered with <2 tested rows | 0% |
| Scene memory across rounds | Spots, paths and phases reshuffled per seed | ≈ chance |

### 8.5 File layout (until the one-app shell exists)

`snap.html` · `js/snap/{core,camera,subjects,photo,requests,rail,handin,album,lab}.js` · `js/snap/mechanics/{moment,count,compare,together,without,journey,thennow}.js` · `data/snap.json` · `data/scenes/{courtyard,farm,road,village}.json` · `assets/snap/{bg,strips,subjects,props}/` · `build/test_snap.py`. Mechanics register like Cook's (`Snap.Mech.define`, `Snap.Mech.lab`) so the shell can host them later.

---

## 9. Scenes, art and assets

### 9.1 Camera per scene (all E, per Art Bible section 3: "Snap: E, wide panorama, parallax, horizon constant")

| Scene | Width | Layers | Subjects | Anchors | Reuse |
|---|---|---|---|---|---|
| **Courtyard** (home) | 2 screens | Find it's background + occluders | Simba, Zazu, Kasuku, hens, chicks, sparrows | Charpai, cart, well/water pot, wall, doorway, washing line | **Find it's courtyard** (and Arc 3 hens) |
| **The road** (rail) | Endless loop | 4 strips per biome: sky, far (hills, the white Rann, windmills), mid (grassland, salt pans, lake, village edge), near (bushes, posts); the bus window frame at the edges only | Camels, cattle, buffalo, goats, sheep, donkey, dog, flamingos, peacock, crows, bus, truck, bicycle, camel cart, tractor, farmer, shepherd | Windmill, tree, well, lake edge, milestone | New strips |
| **Farm** | 3 screens | Background, occluders (shed front, wall, trough), **branch layers holding fruit sprites** | Goats, kid, cow, buffalo, hens, rooster, dog, peacock, wild parakeets | Mango trees, papaya, coconut palm, pomegranate bushes, well, trough, shed, charpai | Fruit sprites (F view) from Cook and Find it |
| **Village lane and pond** | 2 screens | Background, pond water layer, occluders | Buffalo in the pond, cows, goats, the doctor on his bicycle, villagers | Houses (a bhunga round hut as the Kutch nod), a distant minaret, the pond, a tree, the gate | New |
| **Old photos** | Card-size | Sepia/fade in code over normal renders of the same scenes | Young Nani (optional), goats, the well | — | Renders of the new scenes |
| **Hand-in** | 1 screen | Nani behind the charpai or the bus seat (island framing) | Nani | — | Nani's sheet poses |

**Set dressing:** 1–2 nods per scene (Art Bible restraint rule): bhunga hut and mirror-work at the village; windmills (modern Kutch) and salt pans on the road; a kanga cloth on the washing line at home.

### 9.2 Layers and ambient motion

- **Separate layers:** every subject (per state pose; head and tail layers for the cats and Kasuku, as the existing plan says); occluders; parallax strips; the fruit on branches; the pond water; the bus window frame (edges only, never over the play area).
- **Ambient (code):** grass sway, windmill blades turning, clouds drifting, dust in the road's wake, water shimmer, flamingo flocks as particles. 2–4 per scene; off under "reduce motion".
- **Motion by code, not frames:** walking = pose swap + bob; flying = 2 frames + a path; grazing = head-layer dip. That keeps animals at about 3–5 poses each.

### 9.3 Hand poses

| Pose | Source | Use |
|---|---|---|
| **F4** holding a camera, two hands, E | Existing list | Bottom right: the camera body carries the shutter and film count; hands stay below the frame |
| F4b thumb pressing the shutter | **New** (a variant of F4), or a code offset on F4 | Shutter press feel |
| C3 side pinch (a photo) | Existing | Handing a print to Nani |
| C4 pointing | Existing | Tap-to-centre demo (the see-through fingertip) |
| A3 palm up | Existing | Receiving the camera from Nani (Ch1 beat) |
| D5 throw release | Existing | Treats for rare behaviours |
| E1 thumbs up, E5 arms up | Existing | Reactions |

### 9.4 New art and rough counts

| Group | Count | Notes | Where made |
|---|---|---|---|
| Animals × poses | About 15 species × 3–5 poses ≈ **60** | Cats and Kasuku mostly **reuse their sheets** (+ grooming, stretching, flying across ≈ 8 new) | Sheet per species in **ChatGPT (free)** for design; final transparent poses as **API edits** of each sheet |
| Vehicles | 6 × 1–2 ≈ 9 | Bus, truck, bicycle, motorbike, camel cart, tractor | API (transparent) |
| People | Farmer, shepherd, driver × 2 poses ≈ 6; the doctor on a bicycle (1, from his sheet); **young Nani** (optional, 3 poses from Nani's sheet) | Generic, from the family style reference | API edits |
| Parallax strips | 5 biomes × 4 strips ≈ 20 | Opaque, tile horizontally (code cross-fades the seams) | **ChatGPT (free)** |
| Backgrounds | Farm, village (2 new) + dusk grades (code) | Courtyard reused | **ChatGPT (free)**, then cut the occluders |
| Props | Nani's instant camera (held view), film pack, 8–10 old-photo renders | Prints and album are HTML/CSS | Camera: API; old photos: renders + code sepia |
| **Total new images** | ≈ **120–140** | At the hand run's rates (about 130 images for $10–25), roughly **$15–40** with rejects | |

---

## 10. Persona loops

### Loop 0: the draft

A panorama; a viewfinder the player drags over the scene; unlimited film; photos auto-scored Pokémon-Snap style; **the game picks the best photo for each request**; the album fills automatically; requests are "photo of {noun}" or "{noun} {state}"; one scene (the farm).

### Loop 1

| Persona | Plays and says | Struggles |
|---|---|---|
| **Layla, 5** | Loves the click and the goats. "The cat moved!" | Dragging a frame onto a moving goat (the 37% moving-target finding); can't read "photo of" |
| **Zayn, 8** | Chases the points. "Can I get a diamond?" | Scores feel random without a breakdown; nothing to beat |
| **Maryam, 11** | "The album's cute, but it just fills up by itself" | Nothing is hers |
| **Zafar, 38** | "One request a minute: not much Kutchi per minute" | Every request is a noun; no S6 grammar at all |
| **Farah, 34** | A round took 4 minutes | Too long |
| **Nani, 68** | "Where are my old photos? I want the grandchildren to see my village" | No heritage |
| **The Sceptic** | **Won the ear star every time.** She shot everything (unlimited film); the game found the right one for her. Her wide shots of the whole herd counted for "the goat that's eating". The requested state was the animated one (the goat *jumping*), so she shot whatever did something odd | — |
| **The Builder** | "Scoring needs subject geometry per frame; animated animals will multiply art" | A draggable frame and zoom together is fiddly on phones |

| Finding → | Change |
|---|---|
| Unlimited film + the game picks = a free ear star | **Film = rows + 2. The player hands in each print at "Show Nani"** (the recall step), rows asked in a new random order |
| Wide shot counts | **Main-subject rule; "exactly N" rows** (which became M2) |
| Requested state is the salient one | **All candidates share the same states at random phases; states requested uniformly; rare behaviours are collectibles only** |
| Layla can't track moving targets | **Pan the world under a fixed viewfinder; tap-to-centre (aim assist); level-1 holds of 5–8 s; slow subjects** |
| Zayn: random scores | **Lens star + a points breakdown shown after hand-in; best shot per slot; best roll per place** |
| Low Kutchi per minute | 3–4 rows per round; **Quick shot** interrupt; hand-in says every row again; recasts name what's in the print |
| No S6 grammar | **Comparatives (M4), together (M5), without (M6), future on the rail (M7)** |
| Nani: heritage | **Then and now (M8)** from the trunk |
| Farah: too long | Rounds of 2–3 min; rail laps of 60–90 s |
| Builder: geometry, art | **Per-state hit rectangles as data; motion by code over 3–5 poses; parallax strips instead of painted panoramas** |

### Loop 2

| Persona | Plays and says | Struggles |
|---|---|---|
| **Layla** | Tap the goat, it swings to the middle, click. Choosing prints for Nani is easy: they're pictures | On the rail, the stretch passes before she's ready |
| **Zayn** | Lens points, best roll. "I've done the farm three times, same goats" | Replay sameness |
| **Maryam** | Then and now made her go "aww". Wants to arrange her own album page | — |
| **Zafar** | Much denser. Notices *bigger*, *with*, *eating* are grey English: "the systems are right, it needs words" (same as Cook's audit) | Placeholder words |
| **Farah** | 2 minutes is right. Wants a daily thing | — |
| **Nani** | Proud of the old-photos moment. "Let me say the request myself" | — |
| **The Sceptic** | Hand-in stopped her spraying, but: **(1)** the row ticked the moment she took the right shot, so she kept that one and re-shot the others; **(2)** on the rail, each request was said just before its stretch, so she shot the first thing that appeared; **(3)** the "Quick shot" bird flew in exactly when Nani called, the only new thing on screen; **(4)** "without" rows always said the cat, so she always kept the cat out | — |
| **The Builder** | Hand-in and album are HTML; the rail is a small parallax scroller. The evaluator must be deterministic for tests | Panoramas as one painting are hard to generate |

| Finding → | Change |
|---|---|
| Tick at shutter tells her which print is right | **No judging until hand-in.** Shutter juice is craft only (lens sparkle rated on the biggest subject in frame, not the wanted one) |
| Rail: request said just before its stretch | **All lap rows given at the start, in random order; stretches hold look-alikes for several rows** |
| Quick shot target arrives on cue | **Quick shot only names something already present among ≥2 look-alikes** |
| "Without" always the cat | **"With" and "without" 50/50, over several subjects** |
| Layla: rail too fast | Relaxed = slower road; missed stretches **loop** ("on the way back"); Warmer hint slows the bus (costs tick) |
| Zayn: same goats | **Research levels per place** (new subjects, behaviours, dusk grade, alternate turnings on the road), as in Pokémon Snap |
| Maryam: make it hers | **Album decoration won by finishing pages**; she chooses which print goes on each page |
| Farah: daily | **Kasuku's snapshot** (M10) |
| Nani: say it herself | **Grandparent mode** (6.5) |
| Zafar: placeholders | Family word list (6.6); **leak bot gates only on Kutchi-only rows** (fruit + numbers at the farm work today) |
| Builder: panoramas | **Parallax strips per biome, tiled**; evaluator is a pure function over print records |

### Loop 3

| Persona | Plays and says | Reason to come back |
|---|---|---|
| **Layla** | With Mum: taps, clicks, hands prints to Nani, laughs at Kasuku's photobomb. Never reads | The pets; Kasuku's snapshot; stage-1 twinkles |
| **Zayn** | Lens points, best roll, research levels, rare behaviours | 4★-style rare shots, best per slot, a new route at dusk |
| **Maryam** | Decorates pages, fills Then and now pairs, the finale photo | The album as her heritage book |
| **Zafar** | Comparatives, with/without, future lines; three listening passes per word (row, hand-in, album) | Weak-word free play; the rail at level 3 |
| **Farah** | 60 s Kasuku's snapshot; a 90 s lap | Daily, days-with-Kasuku count |
| **Nani** | Grandparent mode on the sofa; her village on screen | Her memories, her voice |
| **The Sceptic** | Tried: **(1)** a new profile every round, so every row is stage 1 and twinkles; **(2)** learning where the goats graze from last round; **(3)** "the tallest" is always the adult camel, the nearest one; **(4)** memorising album captions (Kutchi text) and matching text on the rows; **(5)** the lens sparkle marking the main subject | — |
| **The Builder** | Estimates in 12; phase 1 reuses Find it's courtyard and scene schema; the evaluator unit-testable | — |

| Finding → | Change |
|---|---|
| New profile each round | **Ear star needs ≥2 tested rows**; otherwise "new words" |
| Last round's grazing spot | Spots, paths and phases reshuffled per seed (already in data); the bot's "scene memory" strategy is added to the gate |
| Tallest = nearest adult | **≥3 size steps at mixed depths**; rank computed on true size; smaller and taller asked as often |
| Album captions → text matching | Fine: that's reading Kutchi (it's learning, and reading is the intended stage-2/3 channel). In rounds, row text fades by stage as everywhere |
| Lens sparkle | It marks nothing: it's a score on the print, rated on the biggest subject regardless of the request |

**Stop condition met:** on Kutchi-only rows, the Sceptic can't beat chance (≈4% with 3 rows), and every persona has a reason to come back. **Left open (content, not code):** placeholder decision words (states, comparatives, with/without), as in Cook's final audit.

---

## 11. Scorecard and verdict

| Criterion | Score | Why |
|---|---|---|
| Fun | **4.5** | Pokémon Snap's moment + TOEM's hand-in + funny pets and photobombs; the rail is the standout |
| Forces Kutchi | **4.5** | Every row is a moment only the words pick; the hand-in is a second pass. Today only the counts and fruit are real Kutchi |
| Distinct | **4** | Moment, framing (exactly N, together, without) and the rail are unique; M1/M3 sit close to Find it |
| Plot | **5** | The camera from the trunk, the journey, the farm, Nana's stories, the family photo; the album spans all arcs |
| Replay | **4.5** | Album pages, gold corners, rare behaviours, research levels, daily Kasuku, the rail |

**Is it good?** Yes, if the subjects really move and change. That's what separates it from Find it.
**Is it complete?**
- **Story:** it covers every Snap use named (the journey, the farm, old photos) and gives the finale its last photo.
- **Syllabus:** S6 is covered structurally (comparatives, nature, travel, future heard, describing by state), but **not in content**: almost none of S6 exists in Kutchi yet. "Because" and describing people are only heard here; Who did it owns people.

**Verdict: Go with changes.**
1. Get the family's S4/S6 words (6.6) before building M4–M6.
2. Seed the album from Arc 1 with story beat photos.
3. Build after Find it and reuse its scene schema, courtyard and bot.
4. Confirm the chapter splits with Who did it and Tidy up.

**Top risks**
1. **Vocabulary gap:** animals, verbs, comparatives, nature and travel are all placeholders. Until the words arrive, only M2 (fruit + numbers) is a real Kutchi test.
2. **Art volume:** animated animals, strips and vehicles (about 130 images). Mitigation: 3–5 poses each, motion by code, strips not paintings.
3. **Hands for 5-year-olds:** moving subjects and a camera could feel like a reflex game (Monsoon rush's ground). Mitigation: pan under a fixed frame, tap-to-centre, long holds, looping road.
4. **Last in the build order:** Arc 5 is the finale, so the mode may never get reached. Mitigation: the album and beat photos from Arc 1; phase 1 reuses Find it's courtyard, so a pets-only Snap could ship early as free play.
5. **Young Nani** in old photos is a new character sheet (likeness work) and a family decision.

**Open questions for Zafar**
1. Camera found in Arc 5 only (album seeded by beat photos from Arc 1), or give it earlier as a free-play toy?
2. Arc 5 Ch1: Who did it takes "match the face"; Snap takes the camera and Then and now. OK?
3. Ch5: Tidy up arranges, Snap takes the final photo. OK?
4. Old photos: include **young Nani** (from her sheet), or places and animals only?
5. An **instant camera** (prints develop) or a phone?
6. The journey vehicle: bus, jeep, chhakdo (the Kutch three-wheeler) or camel cart? Does Kasuku come along?
7. Lens iris as the craft star icon?
8. Should Snap take Arc 3's "watch the sky", or Monsoon rush?

---

## 12. Build brief (rewritten 25 Sept 2026 to match the deep dive)

**Before you start:**
- Read the deep-dive section (D1–D9), then sections 6.2–6.4, 7 and 8.4 (the leak-bot list). Sections 8.1–8.3's moving world (`paths`, `herds`, `parallax`, `subjects.js`, `rail.js`) is **phase 4–5**; don't build it first.
- Phases 0–2 touch **only Snap's own files**: `snap.html`, `css/snap.css`, `js/snap/**`, `data/snap.json`, `data/scenes/orchard.json` (a sidecar; never edit Find it's scene files), `build/test_snap.py`, `build/leak_snap.mjs`, `build/reports/snap-*.md`. Read Cook's `lang.js`, `ui.js`, `order.js` through the frozen API (`docs/shared-api.md` once Wave 5A merges); never copy or edit them.
- Never invent Kutchi: new words go in as `"kutchi": null` placeholders in `data/snap.json`; every word used by the first set is borrowed from `data/content.json` or `data/cook.json` and listed under `words.from_content`.

**Shared pieces Snap needs from the foundation agent** (assume they arrive; stub them locally until then, behind one adapter file `js/snap/adapters.js` so the swap is one edit):

| Piece | Used by | Needed from phase |
|---|---|---|
| The shell ("one app, one save"), the hub shelf entry and the **`Album.add()` beat-photo hook** called from every mode's story beats | G5, free play | 3 |
| `js/shared/speech.js` `listen({choices, timeoutMs}) → {choice, confidence} \| null` | G4, Caption it | 2 (the lab stub returns a chosen id or `null`) |
| The shared **which-one** attribute-and-decoy module (asked noun in ≥3 sizes or colours, asked attribute on ≥2 nouns, balanced, blind-odds budget) | G2 | 3 (phase 1 uses a local size-class picker with the same rules, deleted at integration) |
| **Star sets and ear rules as data** (`star_sets.snap`: ear, lens, tick or lightning, **voice**; `minTested: 2`; taught rows excluded) | G3, G4 | 3 (phase 1 hard-codes the same rule in `handin.js`) |
| `data/relations.json` + `js/shared/rel.js` + scene `spots` schema | K5 (G9) | 4 |
| Find it's `lookalike_groups` (read from `data/find.json`) and scene schema | G1, G2 | 1 (read only) |

### 12.1 Phases

| Phase | What's playable | Own files only? | Acceptance |
|---|---|---|---|
| **0 Pure logic** | `photo.js`'s `printRecord(spots, frame)` and `matches(print, row)` for K1–K3; `requests.js` generating rows from a scene's spots with a **guaranteed frame** (an achievable rectangle at some allowed zoom) and ≥3 candidate kinds; a **Node leak bot** `build/leak_snap.mjs` (no browser) with the strategies in 8.4 plus D5's four new ones, and an oracle | Yes | `--unit` fixtures pass (main subject vs a bigger same-noun decoy; exactly N with one at 49% visible; the mid size never matching; `nar` at 9% vs 11%); `--fair` 500 seeds per level: every row achievable; oracle ≥95%; **every leak strategy <10% at levels 1–3, combined <5%**, on G1 and G2 rows (all real Kutchi); report to `build/reports/snap-leakbot.md` |
| **1 Greybox lab** | `snap.html` + `js/snap/core.js`, `mechanics/viewfinder.js`, `photo.js` (shutter, `snapshotArea` prints, tray), `mechanics/handin.js`; `data/scenes/orchard.json` greybox (1.5–2 screens, branch spots with `{kind, size}`, existing fruit sprites); **G1 and G2 at levels 1–3** with the intro card, 3 s quiet, the sidebar "?", hesitation replay, recasts from the print record, go back (+1 frame), ear/lens/tick, receipt, word review; the Snap lab (place, mini-game, level, seed, bot none/leak/oracle, show print records) | Yes | `build/test_snap.py` plays G1 and G2 headless at six sizes with the tap-cover check (sidebar, tray and hands never cover the shutter, zoom or a reachable fruit); the browser bot reproduces phase 0's rates within 2 points; **a phone (915×375) takes 4 prints in a 2-screen scene without dropped frames**; a level-1 round is 2 rows in under 2 min; screenshots reviewed |
| **2 Speaking, Quick shot, album** | `mechanics/ali-camera.js` (G4) against the `speech` adapter (lab stub), picture cards, pills and parent-judge fallbacks, the voice star; **Quick shot** through Cook's `passme`; Relaxed/Busy with the daylight bar; `js/snap/album.js` (G5: pages, "?" audio slots, gold corners, Caption it, decoration won by pages) saved under Snap's own key until the shell | Yes | The oracle (stub returns the choice) earns the voice star ≥95%; the leak bot (stub returns `null`) earns it 0% and its ear rate is unchanged; a round always finishes by tapping (a "no speech" test run); Quick shot only names a word from a look-alike group with ≥2 members visible; album persists across reloads |
| **3 Integration** | The shell hosts `snap` (one save, the hub shelf camera icon, Photo walk, "Ali's turn"), `Album.add()` seeds from the four arc-closing beats, the shared which-one and star-set data replace the local stubs, real `speech.js`, family recordings replace placeholders file for file; **Arc 5 Ch3** rows when the arc is built | No (a one-day merge with the shell agent) | `--story` runs Ch3 end to end once the arc exists; no Snap-local save key remains; the leak report shows real-Kutchi rows passing after the swap; **Zafar plays it with a child** |
| **4 The moving world** | `subjects.js` (states, holds, random phase, path graphs, herds) as data on the **same** `photo.js`; G7 Snap the moment in the courtyard (cats, Kasuku, hens), G6 No bananas! with a photobomber, G9 with `rel.js`, G12 as the hub-daily entry | Courtyard sidecar until the schema owner merges it | Leak bot <10% on K4 and K5 rows (placeholders flagged); iPad and phone frame rate measured with 12 moving sprites; the "?" ladder's Warmer rung |
| **5 The journey, Then and now, art** | `rail.js`, biome strips, laps, the map road; G11; G13 with Tidy up; painted orchard, farm, village; Arc 5 Ch1–2, Ch4–5 | — | Section 8.4's rail strategies <10%; Arc 5 end to end; visual QA checklist |

### 12.2 The first three tasks

**Task 1: `data/snap.json`, the orchard, and the pure evaluator (phase 0).**
- `data/snap.json`: `words.from_content` (fruit ids, `num-01…10`, `ph-big`, `ph-small`, `ph-no`), `lines` (`take` = `[EN: Take a photo of {x}]`, `show` = `[EN: Show me]`, `here` = `[EN: Here's the photo]`, `what` = `[EN: What's this?]`, `ali` = `[EN: Your turn, Ali]`, all `"kutchi": null`), `grammar` references to Cook's `count` and `no`, `kinds` (K1–K3 with their frame rules), `mechanics.viewfinder.levels`, `mechanics.photo.levels` (`film: "rows+2"`, `mainSubject: {minArea: 0.08, minVisible: 0.6, middleThird: true, rivalMax: 0.5}`, `countVisible: 0.5`, `excludeMax: 0.1`), `mechanics.handin.levels`, `star_sets.snap`, the level ladder from D5 (`rows`, `kinds`, `counts`, `sizes`, `zoom`, `aimAssist`, `sceneWidth`, `interleave`, `photobomber`).
- `data/scenes/orchard.json`: Find it's schema plus `spots: [{id, x, y, w, h, layer: "branch", kind: "fru-05", size: "big" | "mid" | "small"}]`, 40–60 spots over 1.5–2 screens, clusters as data. Greybox: coloured rectangles until the sprites are placed.
- `js/snap/photo.js` (pure, no Phaser import): `printRecord(scene, frame) → {frame, sprites: [{id, kind, size, visible, area, centre}]}` by rectangle intersection; `matches(print, row) → {ok, why}` for K1–K3; `lensScore(print)` on the biggest sprite. `js/snap/requests.js`: rows from a level, with the achievable-frame search and ≥3 kinds; Cook's ladder shape (shuffle, one `•••` per hidden group, **no digits**).
- `build/leak_snap.mjs`: oracle, random, one-per-kind, fill-the-frame, middle-size, everything-alone, salience (biggest cluster), shot-order hand-in, fresh-profile; 500 rounds per level per strategy.
- **Done when:** the fixtures and `--fair` pass and the report shows the D5 rates (G1 level 1 under 1%, G2 about 2%, all strategies <10% at levels 1–3).

**Task 2: the viewfinder, the shutter, and Show Nani in the lab (phase 1).**
- `js/snap/mechanics/viewfinder.js` (`Snap.Mech.define("viewfinder", …)` on Cook's `Mech` pattern; every number from `k`): a still scene at 1600×900 design coordinates, drag pan (level 2+), **+/−** zoom steps (no pinch), tap-to-centre with `aimAssist`, a fixed frame in the middle, the shutter on the camera body (hand pose F4, bottom right), film count on the body, `z.expect({kind: "shot", …})` for the harness.
- `photo.js`'s Phaser half: on shutter, `printRecord` from the live spots, a thumbnail via `renderer.snapshotArea`, the print sliding into the tray (bottom left, ≤22% height). **No tick, sound or mark at the shutter beyond the click.**
- `js/snap/mechanics/handin.js`: Nani's hand-in view; rows re-asked in a new order; tap a print; right → *Ghan!*; wrong → a recast built from the print record (`Arre re! char aamo`), the row again, choose again; none fits → back for one frame; ear (≥2 tested rows), lens, tick; receipt and word review through Cook's UI.
- Lab entries for G1 and G2 at levels 1–3 with the seed, bot and "show print records" toggles; `build/test_snap.py --lab`, `--viewport` at six sizes, `--leakbot` driving the browser with the same strategies.
- **Done when:** phase 1's acceptance holds, and a phone plays a 2-screen scene without dropped frames.

**Task 3: Ali's camera and the album (phase 2).**
- `js/snap/adapters.js`: `listen()` bound to `js/shared/speech.js` when present, else the lab stub (`?speech=oracle|null`).
- `js/snap/mechanics/ali-camera.js`: the picture card (a small render of the wanted shot from the scene's own sprites, no text), the microphone button, `listen({choices, timeoutMs: 4000})` with level 2's noun set and level 3's number-then-noun sets; Ali's echo line; `viewfinder` in auto mode frames the heard kind at the card's count; the pills after `null` or two low-confidence results; the parent-judge toggle; the voice star; the print into the tray for the normal hand-in.
- Quick shot: Cook's `passme` interrupt with the act being a shot; the look-alike rule from D3.
- `js/snap/album.js` (HTML): pages per place of 8–10 slots, `Album.add()`, "?" slots that speak their caption, Caption it through `listen()`, gold corners, decoration on finished pages; Snap-local save key with a migration note for the shell.
- **Done when:** phase 2's acceptance holds and the "no speech" run finishes every round by tapping.

---

## Sources

- Pokémon Snap scoring: [Game8 scoring guide](https://game8.co/games/New-Pokemon-Snap/archives/328684) (six criteria, star tiers); [PokéJungle star guide](https://pokejungle.net/new-pokemon-snap/rating-star-guide/) (4 photos per species, rarity of behaviour)
- Replay design: [Pokémon.com beginner tips](https://www.pokemon.com/us/strategy/top-tips-to-begin-your-new-pokemon-snap-journey) (research levels, day/night, alternate paths); [Grindosaur requests](https://www.grindosaur.com/en/games/new-pokemon-snap/requests) and [TheGamer requests guide](https://www.thegamer.com/new-pokemon-snap-all-requests-guide/) (character requests, sticker and frame rewards)
- Alba: [KeenGamer beginner's guide](https://www.keengamer.com/articles/guides/alba-a-wildlife-adventure-beginners-guide/) ("?" for unidentified species, identification on lock); [Wikipedia](https://en.wikipedia.org/wiki/Alba:_A_Wildlife_Adventure)
- Umurangi Generation: [Steam achievement guide](https://steamcommunity.com/sharedfiles/filedetails/?id=2341905480) (two unlocks per level, bonus objectives); [Wikipedia](https://en.wikipedia.org/wiki/Umurangi_Generation) (bounties, lenses unlocked per level); [Unwinnable](https://unwinnable.com/2021/10/29/urgency-and-mastery-in-umurangi-generation/) (mastery needs knowing the level)
- TOEM: [Wikipedia](https://en.wikipedia.org/wiki/Toem) and [Pocket Gamer](https://www.pocketgamer.com/ahead-of-the-game/toem-a-photo-adventure/) (hand photos to characters for requests; compendium). Game Developer's design Q&A was blocked; summary from search results
- The warning cases: [Game Informer on Pupperazzi](https://gameinformer.com/review/pupperazzi/pupperazzi-review-a-short-but-sweet-photography-treat); [OpenCritic, Beasts of Maravilla Island](https://opencritic.com/game/11549/beasts-of-maravilla-island/reviews) (no real test, limited photography)
- Collections: [Yu-kai Chou, collection sets](https://yukaichou.com/advanced-gamification/game-design-technique-collection-sets/) (7–12 items; half-way tipping point); [Game Developer, endowed progress](https://www.gamedeveloper.com/game-platforms/the-psychology-of-games-the-endowed-progress-effect-and-game-quests) (head-start effect)
- Adjectives in the visual world: [Ju et al. 2023, Child Development](https://doi.org/10.1111/cdev.13925) (preschoolers' contrastive inferences, helped by slower speech and clear size contrast); [Qing, Lassiter et al. 2018](https://alpslab.stanford.edu/papers/2018QingLassiterEtAl.pdf) ("touch the tall glass" paradigm)
- Comparatives: [Ferry et al. 2025, Child Development](https://onlinelibrary.wiley.com/doi/10.1111/cdev.14182) (bigger before smaller; taller sharpens with age); [Barner & Snedeker 2008](https://www.harvardlds.org/wp-content/uploads/2017/01/Barner_Snedeker_2008-1.pdf) (gradable adjectives in context)
- Referential communication: [ScienceDirect 2017](https://www.sciencedirect.com/science/article/abs/pii/S0022096517306598) (adult models; redundant vs contrastive messages)
- Photo-taking impairment: [Henkel 2014, Psychological Science](https://journals.sagepub.com/doi/abs/10.1177/0956797613504438) (photographing weakens memory; zooming in removes the effect)
- Children's touch: [Vatavu et al. 2015, IJHCS](https://www.sciencedirect.com/science/article/abs/pii/S1071581914001426) (touch accuracy ages 3–6); [PMC 2020, gestures and prompts](https://pmc.ncbi.nlm.nih.gov/articles/PMC7303424/) (37% moving vs 57% static targets, ages 4–6)
- Touch interactivity and word learning: [Russo-Johnson et al. 2017, "All Tapped Out"](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00578/full); [Kirkorian et al. 2016](https://srcd.onlinelibrary.wiley.com/doi/abs/10.1111/cdev.12508) (specific vs general tapping)
- Heritage storytelling: [Innovation in Language Learning and Teaching 2026](https://www.tandfonline.com/doi/abs/10.1080/17501229.2026.2614753) (grandparents, digital stories); [Education Sciences 2025](https://doi.org/10.3390/educsci15091221) (storytelling in the heritage language)
- Photo scavenger hunts (practice write-ups, weak evidence): [A World of Language Learners](https://www.aworldoflanguagelearners.com/using-scavenger-hunts-with-english-language-learners/)
- Retrieval, recasts, position-word order: see the Sources in `docs/find-it-design.md`
