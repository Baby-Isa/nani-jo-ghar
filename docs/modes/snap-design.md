# Snap: design (mode id `snap`)

**Date:** 25 Sept 2026
**Status:** proposal for Zafar, deepened on 25 Sept 2026 (the "Deep dive" section at the top is current and supersedes sections 3, 4, 8 and 12 where they conflict). Nothing built. Follows `docs/modes/MODE-DESIGN-BRIEF.md` and `docs/modes/DEEP-DIVE-BRIEF.md`, and builds on `docs/find-it-design.md` (whose M11 "Photo" idea and "album as a collection" are passed to this mode), `docs/cook-with-nani-phase-a-design.md`, `docs/cook-with-nani-kutchi-audit.md` and `docs/cook-with-nani-todo.md` (Wave 5, calm and clarity).
**Placeholder rule:** the only Kutchi in this doc is what's already in `data/content.json` and `data/cook.json` (fruit, veg, numbers 1–10, and the frames *Muke {x} khape*, *Ne {x}*, *Muke hikdo {x} dine*, *Hedo!*, *Arre re!*, *Ghan*). Everything written `[EN: …]` has no Kutchi yet. In the game it's a grey italic English placeholder until the family gives the word. **Never invent Kutchi.**

---

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
