# Sprint 5 art audit: everything Cook, the clinic and the shared screens still need drawn, and the one paste block (pack `s05`)

**Written:** 9 Oct 2026, by Fable (the art audit Zafar asked for on 9 Oct; decision 77: art is made in ChatGPT runs he supervises, no image API without his say-so). **Status:** a proposal; nothing runs until he says go. **Built from:** `CLAUDE.md` (13, 16), `docs/process/rules.md` §7, `art-bible.md`, `art-pipeline.md`, the clinic, s02 and s03 art plans and redo lists, every open, reopened and built row of `docs/process/regressions.md` that names art, `build/reports/s04-coverage-cook.md` and `s04-coverage-clinic.md`, `build/reports/s04c-art.md`, the mode docs, and the code and data as they stand on `ccr-a7370759-t0lee7` (the code is the truth for what is drawn today).

**The run spec** is `build/tools/art/specs/s05.run.yaml`; **the paste block** is `docs/design-language/art-plans/s05-paste-block.txt` (generated, never hand-edited: `python3 build/tools/art/artblock.py --spec build/tools/art/specs/s05.run.yaml --check`, then the same with `--out docs/design-language/art-plans/s05-paste-block.txt`); **the prompts** are section 5 of this file.

## 0. Totals

| Priority | Meaning | Items | Images in the block |
|---|---|---|---|
| **P1** | blocks a game being playable as designed, or Zafar's named ask | 6 | 15 |
| **P2** | looks wrong (a stand-in, a rough sprite, a judged flaw) | 12 | 46 |
| **P3** | polish; listed, not in the block | 13 | 0 |
| **Built** | done in an earlier pack, waiting on his play | 3 | 0 |
| **Not art** | code, a cut, a wiring job or a photo from Zafar; listed so nothing is lost | 14 | 0 |

| Area | P1 | P2 | P3 | Built | Not art |
|---|---|---|---|---|---|
| Shared screens | 0 | 1 | 1 | 0 | 2 |
| Cook: service (the counter) | 1 | 1 | 1 | 0 | 2 |
| Cook: stations | 0 | 1 | 4 | 0 | 5 |
| Clinic: people | 3 | 6 | 4 | 0 | 0 |
| Clinic: rooms | 0 | 0 | 0 | 0 | 1 |
| Clinic: pharmacy belt | 0 | 1 | 1 | 0 | 2 |
| Clinic: heal games | 2 | 2 | 2 | 3 | 2 |
| **Total** | **6** | **12** | **13** | **3** | **14** |

**The block: 61 images** in six parts, in priority order (A Nani 5 · B the doctor 7 · C the gaps 6 · D the man and the woman 18 · E head close-ups and adult limbs 20 · F belt sheets 5). Parts are priorities: he can stop at any part boundary and the earlier parts are whole.

**His time:** about 3.5 minutes an image (attach, paste, wait 1–2 minutes, judge, save) is 3.5 hours straight through; with about a quarter redone (the clinic pack's rate), **about 4.5 hours**. Recommended as two sittings: **parts A–C (18 images, about 1 hour 10 minutes: every P1 except the man's and the woman's W1)**, then parts D–F (43 images, about 3 hours 20 minutes). ChatGPT's image limit may interrupt the second sitting; the block's RESUMING section covers that.

## 1. Flaws and uncertainties first

1. **Nani's lean cannot be drawn only in the art: the island's top is painted over everything below y 611 of the 1600×900 kitchen** (`js/cook/stations.js` `occluder()`: `bg-service` cropped from y 611, drawn above the characters). Her forearms must therefore sit in the sprite *above* its bottom edge, and the sprite's bottom edge must land on the island's back edge (y 608 in `service-v2`). Two ways, both need a decision at the wiring session (section 6): **(a) no code change:** cut her at the counter's back edge, place her bottom at y 611; her forearms read as resting on the back edge and nothing of them lies on the marble (what S04-C did; Fable read it as leaning, Zafar did not); **(b) a small code change (recommended):** keep her forearms and hands that lie on the counter top in the cut, draw her sprite *above* the occluder with the counter's back edge in her picture registered to y 608, so the forearms really lie on the marble, and crop the first tray's box (`art.s02.kitchen-trays.meta.trays[0]`) as a second occluder above her so the tray and the served dish stay in front of her arms. The prompt N1 draws the counter so either cut is possible.
2. **The scale, which is what he rejected, is set in the cut, not in the prompt.** Measured today (`js/cook/stations.js` CHARS at 1×): Nana's head about 171 px wide, Ma's 195, the cousin's 182; Nani's current picture 198 (and S04-C's API Nani bigger still). The cut must scale her so her head is about 180 px wide at 1× and her scarf top sits at about y 150, the same as today. N1 asks for the sheet's proportions and attaches Nana for scale and render so the picture starts right; the check fails a big head.
3. **Nani's render is more photographic than Nana's, Ma's and the cousin's** (compare `nani-neutral.webp` with `nana-neutral.webp`): her approved sheet is rendered that way, so this is not a redo of the sheet, but N1 asks for her face in the family's chunky render. If Zafar prefers the sheet's render as it is, strike that sentence from N1 before pasting (the only edit allowed).
4. **All four of Nani's mood files are today the same picture** (`nani-neutral`, `-happy`, `-talk`, `-point` are byte-identical after the 9 Oct revert), so ART-10's "four cooking moods" is open again as well as ART-13: the talk animation swaps a texture that does not change. Part A fixes both.
5. **The doctor is a real person (Hannah's granddad): his photos are in the git-ignored `sources/private/` on Zafar's machine, never in the repo.** DS1's line says so; Zafar attaches them himself. The block's APPROVALS line is set to real people (`real_people: true`), so every Nani and doctor image waits for his yes. If the photos are not to hand tomorrow, part B is skipped whole (every doctor line attaches DS1) and the doctor stays the flat stand-in.
6. **Three patients' art landed but was never judged or cut:** the clinic pack's part C ran for the boy, the old man and the old woman (W1–W10 each, the boy's E1 and M1, the old woman's Y1: 31 files in `sources/art/clinic-heal-v3/`, `artjudge.py` flags unknown), and the run was paused after part B (decision 43). They need a cut session (`s05.cut.json`, the same `figure` jobs as the girl's), not prompts. The block draws only what is missing: the man and the woman (never run), the old man's and old woman's eye close-ups, the man's mouth, the woman's tongue, the adult limbs.
7. **The pharmacy belt's per-item pictures could not be settled from data alone.** `Kit.icon` draws an item's own `img` (set only for the apple and the lollipop alias) or its rough sprite; the s02 sheets' belt views are wired by a path remap of the `items-v2` pictures (`data/clinic/sheets.json` `remap`), which my data trace could not follow for the belt's asks (bandage, thread, filling tube, hammer, eye patch and the drinks resolve to `assets/clinic/rough/items/` in the data). CLN-97's note says every item stands on the belt after S03. **Part F (five sheets) runs only if the pharmacy shot at `/review` shows the rough sprite for that item**; the honey, lemon, milk, water jug, spoon and drill have `items-v2` single views and stay P3.
8. **CLN-121 (realistic cuts and scrapes) may need no new image:** the clinic pack's F2 (forearm grazed), K3 (knee grazed) and F4 (the cut) landed and passed, but `data/clinic/heal/cut.json` wires the plain F1 and K1 because the game draws its own graze and dirt ("K3's graze would show twice"). The fix is wiring (draw the landed graze under the code's dirt, the code's plasters on it), then a look; new art only if Zafar fails them. Not in the block.
9. **SEK-14 is his idea (K9, Q11 yes) and the row is open**, but the rack half already exists (`assets/cook/items/v3/sekelo/rack-0…4.webp`) and the plate half exists only fanned (`plate-0…4-v2`, retired by SEK-07). SK2 draws the straight plate set. If the code-laid plain plate is kept instead, that needs his OK recorded as a decision and SK2 is skipped.
10. **The other patients' standing poses (D3's standing check-up, the send-off's wave) are left out on purpose (P3):** the code falls back to the sitting pose for a kind with no standing art (`diagnosis.js`, `sendoff.js`), which plays. Ten images saved; add them when he asks.
11. **CLN-65's "sad" and "neutral" states exist for the girl** (`girl-face-sad`, `girl-head-neutral`): the row's note is stale, not the art.
12. **Life frames (ART-19) are kept minimal:** one blink and one talking mouth each for Nani, the doctor and the girl (edits of the kept base, so the body never moves). Nana, Ma and Ali are P3 until their own art is redone; the bob (ART-18) is code.

## 2. How Zafar runs the block himself (tomorrow, supervised)

The block (`s05-paste-block.txt`) is generated for the Claude-in-Chrome runner (decision 43) and still reads that way: its MOVING IMAGES, RUNNER LOOP and GitHub-commit sections are the runner's, and he ignores them. What he uses from it:

1. **The prompts** are section 5 of this file (open it on GitHub: the block's PAGE_URL). Each has an ID and a grey code box.
2. **The RUN ORDER** in the block: one line per image, `ID | attach | save as | check`, in the order to run. `kept:X` means the image he saved for line X earlier in the run; everything else is a repo file, listed under "Reference images" with its path (download it from the repo once; a `.webp` attaches to ChatGPT like a PNG). The sheets in parts D and E are repo files, so the block's line "if a person's sheet was skipped in part A" never applies.
3. **For each line:** a fresh ChatGPT chat; attach exactly the files the line names (DS1 also his doctor photos; an edit line attaches only the one kept image); paste the prompt with the slots filled from the PEOPLE table for parts D and E; send. Judge it against its CHECK and the PASS/FAIL LIST; a real person (Nani, the doctor) is his call. A fail is the same prompt again in a fresh chat, at most two redos; keep the best and note what is wrong.
4. **Save** the PNG with ChatGPT's download button (allowed for him; the "never download" rule is the runner's) as `sources/art/s05/<save as>` (the name on the line, e.g. `sources/art/s05/nani-n1-lean-neutral-v1.png`). A redo of a kept line is `-v2`, `-v3`. Never a screenshot (it shrinks and blurs the edge).
5. **At the end** (or at a part boundary): either commit the folder to `main` (`git add sources/art/s05 && git commit -m "s05: <the IDs>"`, or GitHub's upload page for `sources/art/s05/`), or drag the files into the Claude chat; add a `sources/art/s05/art-run-log.txt` with one line per image (`ID | PASS or FAIL (why) | redos`). The doctor's photos never go in.
6. Then Claude runs `artjudge.py` over the folder, cuts with a new `s05.cut.json`, and wires in a build session (`/brief`), then `/review`.

If he hits ChatGPT's image limit, he stops and carries on later from the first line whose file is not saved; nothing is lost.

## 3. The audit table

Columns: **today** is what the code draws now (missing · rough · stand-in · rejected · landed, not cut · code); **size** is the drawn size on the 1600×900 stage at 1×; **block** names the run lines.

### 3.1 Shared screens

| ID | What | Where it's seen | Why | Today | Views / states needed | Size | Priority | Block |
|---|---|---|---|---|---|---|---|---|
| S5-SH-01 | Life frames for every speaking character: a blink (eyes closed) and a talking mouth, as edits of the registered base so the body never moves | Cook service, the clinic diagnosis, send-off, the eye test ("even with the speech bubble") | ART-19, EY8; coverage-clinic #26 | missing (the talk texture swap is the only "life"; for Nani it swaps to the same file) | Nani: blink + talk (N5, N3); the doctor: blink + talk (DW5, DW2); the girl: blink + mouth (GB1, GM1) | on the base canvases (Nani 443×578, the girl 275×472) | P2 | N3, N5, DW2, DW5, GB1, GM1 |
| S5-SH-02 | Nana, Ma and Ali life frames (blink, mouth) | Cook service | ART-19 | missing | 2 edits each | 370×389, 341×405, 255×379 | P3 | – |
| S5-SH-03 | One shared talk animation, a third of today's bob | every speaking character | ART-18 | code | – | – | not art | – |
| S5-SH-04 | End-screen badges in order; the review tick's fringe | end screens | SH-67, ART-16 | code (the tick re-cut in S03) | – | – | not art | – |

### 3.2 Cook: service (the counter)

| ID | What | Where it's seen | Why | Today | Views / states needed | Size | Priority | Block |
|---|---|---|---|---|---|---|---|---|
| S5-CK-01 | **Nani leaning on the counter, at the family's scale, forearms and elbows ON the counter top, four moods** | Cook service: every greeting, order and serve; the kitchen with three trays | ART-13 reopened (9 Oct: the API Nani "far too big next to the others, elbows not on the counter"), ART-10 open, ART-07, decision 77 | rejected (S04-C reverted); the four mood files are one identical picture | neutral (base), happy, talk, point; drawn on one canvas, the counter's back edge in the picture registered to y 608; head about 180 px wide at 1×, scarf top at y 150 | about 440×460 at 1× above the counter line | **P1** | N1, N2, N3, N4 |
| S5-CK-02 | Nani's blink | as above | ART-19 | missing | eyes closed (an edit of N1) | as N1 | P2 | N5 |
| S5-CK-03 | Nana, Ma and Ali "impatient" faces that do not smile smugly | Cook service, the "pass me" and patience moments | ART-10 | the current `-impatient` sprites: Nana's reads as a grumpy frown (looked at), Ma's and the cousin's unjudged | – | – | P3 (judge Ma and the cousin at `/review`; redo only on his word) | – |
| S5-CK-04 | The served dish's contact shadow to the right | every serve | CK-21 reopened | code (`flow.js` servedPic ellipse) | – | – | not art | – |
| S5-CK-05 | Each cup's orderer badge on the chai tray's rim | chai tray | CHAI-18 | code (the badges exist, `*-badge.webp`) | – | – | not art | – |

### 3.3 Cook: stations

| ID | What | Where it's seen | Why | Today | Views / states needed | Size | Priority | Block |
|---|---|---|---|---|---|---|---|---|
| S5-CK-06 | **The sekelo plate holding 1, 2, 3 and 4 straight, parallel skewers** (the rack half exists: `v3/sekelo/rack-0…4`) | sekelo: the plate state, L1–L4 | SEK-14 open (his K9 idea, Q11 yes), SEK-07 reopened ("never fanned or bending") | the fanned `plate-0…4-v2` retired; a plain plate with code-laid skewers (unjudged for straightness) | top-down, 2×2 registered sheet: the same plate with 1–4 bare skewers, handles off the right rim; the pieces stay code | plate about 420 px wide | P2 | SK2 |
| S5-CK-07 | The velan (rolling pin): the chakla's dark walnut, not blown up or low-res | maani, samosa | CK-09 reopened (the velan was never judged) | art exists (`v3/maani/velan.webp`), unjudged | – | – | P3 (judge at `/review` ×2 zoom; redo only if it fails) | – |
| S5-CK-08 | The chaat glass: thin, plain, side-on, no thick base, no reflections | chaat | CHT-03 reopened | the s02 C8 glass (looked at: thin walls, flat base, no highlights: it meets his words) | – | – | P3 (confirm in play) | – |
| S5-CK-09 | The small jars drawn bigger, contents visible | pantry shelf, chai strip | PAN-09 reopened | the s02 C5 jars (distinct lids) exist; "bigger" is the slot size | – | – | not art (code: slot scale) | – |
| S5-CK-10 | The silver saucepan's top edge cut flat | daar | DAAR-14 | a cut flaw on an existing source | re-cut, not redrawn | – | P3 (a re-cut) | – |
| S5-CK-11 | A puff or sprinkle when an ingredient goes in | chai, daar, chaat, samosa | CK-27 | code (effects are code, art bible §8) | – | – | not art | – |
| S5-CK-12 | The daar pot's contents matching the order (no onion when none) | daar | coverage-cook #21 | the extra pot pictures exist (R4); wiring | – | – | not art (wiring) | – |
| S5-CK-13 | The Chop tile's old hand-and-knife | Labs, chop | ART-17, DAAR-13 reopened | code (the new knife is passed in by daar only) | – | – | not art | – |
| S5-CK-14 | The chaat layers "flat and simple like the end screen" (T4) | chaat | s02 plan "not in this run" | a design question for Zafar first | – | – | P3 (design) | – |
| S5-CK-15 | The pantry stretched at 16:10 | pantry | coverage-cook #23 | code | – | – | not art | – |

### 3.4 Clinic: people

| ID | What | Where it's seen | Why | Today | Views / states needed | Size | Priority | Block |
|---|---|---|---|---|---|---|---|---|
| S5-CL-01 | **The doctor** (Hannah's granddad; a real person, his photos on Zafar's machine) | the diagnosis beside the bed, the send-off at the door, his box's face, and the waiting-room call from his half-open door | CLN-01 reopened ("so overwhelmed by how terrible the visuals were"), CLN-17, CLN-25, CLN-115 open, D19 (his visit), art bible §6 | stand-in: a flat-colour SVG figure (`Kit.doctorFigure`) and an SVG face (`Kit.DOCTOR_FACE`) | the sheet; standing three-quarter neutral (base), talking, happy, pointing; leaning out of the door; head crops from the base for his box | standing 0.66 of the exam room's height (about 590 px); the door 0.2 of the waiting room | **P1** | DS1, DW1, DW2, DW3, DW4, DD1 |
| S5-CL-02 | The doctor's blink | as above | ART-19 | missing | eyes closed (an edit of DW1) | as DW1 | P2 | DW5 |
| S5-CL-03 | **The man and the woman: front sitting pose** | the waiting-room bench (six seats), the diagnosis on the bed, every front-on zoom | CLN-01, CLN-14 reopened (decision 74: "until the other patients' art exists"), CLN-81, decision 71 ("the other characters follow once the girl's run is right": it is) | rough: the gpt-image-1 stool people (`assets/clinic/rough/patients/uncle, auntie`) | W1 front neutral, registered as the girl's (seat line, feet line) | child about 410 px, adult about 575 px tall on the room | **P1** | man-W1, woman-W1 |
| S5-CL-04 | The man's and the woman's states and extras | the send-off's four feelings, fever's hot and cold, the blanket, the hot-water bottle, the corner face; the man's side-on zoom | CLN-65 reopened, CLN-26, CLN-56 | missing | happy, sad, pain, hot, cold (edits of W1), blanket, bottle; the man also side neutral and side happy | as W1 | P2 | man-W2…W10, woman-W2…W6, W9, W10 |
| S5-CL-05 | **The boy, the old man and the old woman: wide poses and the boy's ear and mouth, the old woman's eyes** | as S5-CL-03 and S5-CL-04 | the same rows | landed, not cut: 31 files in `sources/art/clinic-heal-v3/` (the clinic run's part C), never judged | none to draw: judge, then cut with the girl's `figure` jobs (seat and feet lines, head layers, 512 px heads) | as W1 | **P1** (a cut session, no prompts) | – |
| S5-CL-06 | The old man's and the old woman's eye close-ups (eye drops, eye test A and B) | eye game when they are the patient | clinic plan 3.2 (the games each kind plays); CLN-01 | stand-in drawing for any kind but the girl (`eye.json` kinds: girl) | Y1 clear, Y2 sore, Y3 closed, T1, T2 at the tight framing (the s02 redo's) | the eyes across the close-up's 800×500 | P2 | oldman-Y1…T2, oldwoman-Y1…T2 |
| S5-CL-07 | The man's open mouth (tooth) and the woman's tongue (sore spots) | tooth and taste when they are the patient | as above | stand-in drawing | M1; M2 | as above | P2 | man-M1, woman-M2 |
| S5-CL-08 | The adult limbs (knee, kicked, grazed; forearm, grazed, cut; upper arm; sole), drawn from the man's sheet, shared by every adult patient | knee, scrape, cut, boing, foot for any adult | clinic plan 3.2 (`closeups/adult/` is empty) | stand-in drawing (`kinds: ["girl"]` on every close-up) | K1, K2, K3, F1, F2, F4, U1, P1 | the part about half the close-up's height | P2 | adult-K1…P1 |
| S5-CL-09 | The girl's blink and talking mouth | the eye test and every bubble of hers | EY8, ART-19 | missing | edits of her seated W1 | 275×472 canvas | P2 | GB1, GM1 |
| S5-CL-10 | The other patients' standing poses (D3's check-up, the send-off wave) | diagnosis D3, send-off | CLN-87 reopened, CLN-94 | the code sits them instead (a working fallback) | W11 palms, W12 wave × 5 | 358×632 | P3 | – |
| S5-CL-11 | The woman with the baby (L5 "with the baby") | waiting room L5 | CLN-04 | rough | one front sitting pose | adult | P3 | – |
| S5-CL-12 | Nana, Ma and Ali as patients in the 3D look (today the old `-sit` pictures and twelve feelings each, marked final) | waiting room, diagnosis | clinic plan question 6 | old-style art | the W set each | adult / child | P3 | – |
| S5-CL-13 | The baby and the toddler kinds' own art (L5 fills the room with children) | waiting room L5 | CLN-13 | rough | – | – | P3 | – |

### 3.5 Clinic: rooms

| ID | What | Where it's seen | Why | Today | Views / states needed | Size | Priority | Block |
|---|---|---|---|---|---|---|---|---|
| S5-CL-14 | The real doctor's certificate photo in the exam room's frame | diagnosis, every heal game's wide shot, the send-off | CLN-116 open | a grey frame, flagged | a photo from Zafar, placed in code; not a prompt | the frame on CB2b's right wall | not art (his photo) | – |

The six rooms, the close-up bed, the open window, the ceiling fan, the gauge, the heater, the comfort things and both eye charts are done (the clinic pack's R and C lines, the s02 sheets).

### 3.6 Clinic: pharmacy belt

| ID | What | Where it's seen | Why | Today | Views / states needed | Size | Priority | Block |
|---|---|---|---|---|---|---|---|---|
| S5-CL-15 | One sprite sheet each for the belt items still without one: the bandage roll, the thread reel (no needle), the filling tube, the reflex hammer, the eye patch | the belt (every ailment's first asks: plaster, thread, bandage, tweezers, toothbrush, filling, cotton bud, drops, hot jug), the tray, the tool column | ART-20 open (decision 65: every item one sheet), CLN-97 | rough for these five in the data trace (see flaw 7); `items-v2` single views exist for the roll, the hammer and the drops | belt (front-above), tray (top-down), tool (front), in use, spares: 8 views | belt items about 90–130 px | P2 (run only if the `/review` shot shows the rough sprite) | E18, E19, E20, E21, E22 |
| S5-CL-16 | Sheets for the drinks and the rest: honey jar, lemon, milk jug, water jug, teaspoon, dentist drill, stethoscope, pen torch, apple, blanket, ice pack, tumbler, ointment pot | the belt as decoys, the taste game, the diagnosis tools | ART-20 | `items-v2` single views (one angle) | 8 views each | – | P3 | – |
| S5-CL-17 | The comb decoy on the belt (the hair game is parked, H32) | the belt | CLN-97 ("the rough tilted plaster and comb") | rough | – | – | not art (drop it from `pipeline.json` decoys) | – |
| S5-CL-18 | The tilted plaster on the belt | the belt | CLN-97, CLN-23 | the E3 belt view exists (`sheets/plaster/plaster-belt.webp`): a wiring check | – | – | not art (wiring) | – |

The 17 s02 sheets (cloth, plasters flat, plaster views, drop bottle, toothbrush, hand fan, desk fan, hot-water bottle, heater, wipe, syringe, tweezers, cotton bud, bin, ear bits, jugs, thermometer) and the s03 two-colour plasters are cut and wired (`data/clinic/sheets.json`).

### 3.7 Clinic: heal games, by ailment

| ID | Ailment / game | What is still needed | Why | Today | Views / states | Priority | Block |
|---|---|---|---|---|---|---|---|
| S5-CL-19 | **Boing: the drop machine** (four tubes of coloured medicine with drip spouts) and its levers and drops | boing, every level | CLN-37 reopened, CLN-106 reopened ("it needs all new artwork"), D15g | stand-in: the machine, levers and drops are drawn in code (`boing.json` names `heal-v3/drop-machine.webp`, which does not exist) | the machine front-above (1024×1536); a lever up and down, four teardrop drops (3×2 sheet); the upright syringe is the s02 E11 sheet's | **P1** | DM1, DM2 |
| S5-CL-20 | **Foot level 3: the sole with level toes** (channels run from the named toes) | foot L3 | CLN-87 reopened (`clinic.md` "foot level 3" stand-in), CLN-40 | the clinic pack's P1 has toes sloping to the little toe, so L3 keeps the drawn stand-in (`foot.json` levels 1–2 only) | the same sole, the toes in a level row | **P1** | RP1 (the adult sole in part E has the same wording) |
| S5-CL-21 | Boing: the arm | boing | CLN-106 | done: the s02 RU1 v2 is wired (`boing.json` upperarm on) | – | built, to re-play | – |
| S5-CL-22 | Scrape and cut: realistic (comical, not gory) graze and cut art | scrape, cut | CLN-121 open, H2 | landed (F2, K3, F4 passed), not wired: the game draws its own graze and dirt | wire the landed graze under the code's dirt; judge; new art only if he fails it | P2 (wiring first) | – |
| S5-CL-23 | Knee: the bump and the leg break | knee | CLN-33, CLN-100 | nothing drawn for a bump today (the kick and the wrap are the game); the hammer is `items-v2`; the wrap is code | none asked for | P3 | – |
| S5-CL-24 | Bandages and plasters in every state | scrape, knee, foot, boing | CLN-32, CLN-97 | done: 11 flat plasters, the 6 two-colour ones (s03), 8 views of a plaster (E3, recoloured in code), the wrap in code | – | built | – |
| S5-CL-25 | Ear, tooth, taste, eye (the girl), fever (the girl), foot L1–L2, splinters, dirt, wax, decay, filling, charts | the nine games | the clinic, s02 and s03 packs | done and wired | – | built, to re-play | – |
| S5-CL-26 | Fever: the other patients' hot, cold, blanket and bottle bodies | fever for any patient but the girl | CLN-65 | stand-in drawing | in S5-CL-04 and S5-CL-05 | P2 | (part D) |
| S5-CL-27 | The eye test's two layouts side by side (A split, B side-on) | eye | CLN-61 reopened | T1 and T2 exist for the girl; a code prototype of (A) | – | not art (code) | – |
| S5-CL-28 | Tummy, hic, hair | parked (H32, CLN-41) | – | old help, old art | – | P3 (parked) | – |
| S5-CL-29 | The taste spots, the chai glass end-screen look, the eye chart's items | taste, chaat, eye | s03, CLN-38 | done / code | – | not art | – |

## 4. The run order and the estimate

| Part | Lines | Images | Priority | Why this order |
|---|---|---|---|---|
| **A** | N1, N2, N3, N4, N5 | 5 | P1 (+N5 P2) | His named ask; N1 first, the moods edit it; he approves each |
| **B** | DS1, DW1, DW2, DW3, DW4, DW5, DD1 | 7 | P1 (+DW5 P2) | The doctor before his visit (D19); needs his photos; he approves each |
| **C** | DM1, DM2, RP1, SK2, GB1, GM1 | 6 | P1, P2 | Boing's machine and foot L3 make two games as designed; the plate and the girl's life ride along |
| **D** | man W1–W10; woman W1–W6, W9, W10 | 18 | W1 P1, the rest P2 | The two patients with no art at all; W1 first for each (the bench and the bed), the states edit it |
| **E** | oldman Y1–Y3, T1, T2; oldwoman Y1–Y3, T1, T2; man M1; woman M2; adult K1–K3, F1, F2, F4, U1, P1 | 20 | P2 | The games the other patients play with real close-ups |
| **F** | E18, E19, E20, E21, E22 | 5 | P2, conditional | Only the belt items the `/review` shot shows rough |
| | **Total** | **61** | | expected redos about 15; about 4.5 hours in two sittings (section 0) |

**Dependencies:** N2, N3, N5 edit N1 and N4 attaches it; every doctor line attaches DS1, and DW2, DW3, DW5 edit DW1, DW4 attaches it; DM2 attaches DM1; each person's W2–W6, W9, W10 attach their W1, W8 edits W7, Y2 and Y3 edit Y1; K2 attaches K1, K3 edits K1; F2 and F4 edit F1. Everything else attaches repo files only.

**Not in this block (and why):** the boy's, old man's and old woman's cut (a cut session); CLN-121's graze (wiring first); the certificate (his photo); the standing poses of the other patients (the sitting fallback plays); Nana, Ma and Ali's life frames and impatient faces (judge first); the velan and the chaat glass (judge first); every code row above.

## 5. The prompts

Every prompt is pasted as is into a fresh ChatGPT chat with exactly the files its run-order line names attached. The only change allowed is filling the `{NAME}`, `{KEEP}`, `{LEGS}` and `{LIMB_WHO}` slots from the PEOPLE table (parts D and E). Grounds: flat mid-grey `#808080`, no shadows on the grey (art-pipeline §1); the cutter keys it out.

### PEOPLE table (the slot texts; copied from the clinic plan)

| Person (run-list prefix) | {NAME} | {KEEP} | {LEGS} |
|---|---|---|---|
| man | the man | the short black hair, the short neat black beard, the plain white long-sleeved shirt, the dark navy trousers and the white trainers | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |
| woman | the woman | the plain dusty-blue headscarf covering the hair, ears and neck, the plain purple long-sleeved knee-length tunic, the loose white trousers and the flat sandals | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |
| oldman | the old man | the neatly combed-back grey hair, the grey moustache, the clean-shaven chin, the plain blue long kurta, the white trousers and the brown sandals; no cap, no glasses, no walking stick | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |
| oldwoman | the old woman | the plain white headscarf covering the hair, ears and neck, the pale cream kurta and trousers, the plain green shawl over the shoulders and the flat sandals; no glasses | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |

| Limb set (run-list prefix) | {LIMB_WHO} |
|---|---|
| child | the girl on the attached character sheet, a child of about five |
| adult | the man on the attached character sheet, an adult of about thirty |

### Part A: Nani at the counter (real person: Zafar approves each one)

#### N1. Nani leaning on the counter, neutral (the base every mood is cut from)
```
Generate an image, 1024×1536, portrait.

Using the attached Nani character sheet as the only reference for who she is (the top-right panel of the sheet, Nani leaning on a counter, is the pose to follow), draw Nani once, large, LEANING on a kitchen counter, relaxed and friendly, as a grandmother leans on her counter to chat with a child: the camera at eye level, straight on, a little above the counter top (the same camera as the attached kitchen). Her upper body tilts a little forward over the counter; BOTH FOREARMS lie flat along the counter top, folded loosely one over the other in front of her, her hands resting on her forearms, both ELBOWS out to the sides and resting ON the counter top. The undersides of her forearms and elbows touch the marble, with a soft contact shadow under each. Her head is a little forward, held straight, a gentle neutral face, mouth closed, looking straight at us.

The counter: a plain warm-white marble slab with faint veins, seen from a little above, its BACK EDGE a perfectly straight horizontal line across the whole image at about 82% down from the top; the marble top shows in front of her forearms down to the bottom edge of the image. Nothing of her shows below the counter's back edge except her forearms, elbows and hands, which rest on top of it. Nothing else on the counter.

Scale and proportions: exactly the proportions of the sheet, a small woman with a normal-sized head; do NOT enlarge the head or the face. Her figure, from the top of her scarf to the counter's back edge, fills about 65% of the image height; her whole head, both shoulders, both elbows and both hands are inside the image with clear background on the left and right.

Keep her exactly as on the sheet: the round thin gold glasses, the deep-red Kutch dupatta over her head covering her hair, the cream long-sleeved kurta with red and gold embroidery at the cuffs and front, small gold drop earrings, the thin diamond tennis bracelet and the red aqiq ring on her right hand, the gold solitaire ring on her left hand, no bangles. Skin a warm light tan (about hex #C49A78), never orange, never pink. Render her face in exactly the same chunky, simplified, stylised way as the attached Nana picture (big soft eyes, smooth simple skin, a readable mouth), not more photographic than him: she and Nana must look like two characters from one film.

Background above and beside the counter: one perfectly flat, uniform neutral mid-grey, hex #808080. No wall, no kitchen, no gradient, no texture. No shadow on the grey.

Style: exactly as the attached sheet, the attached Nana and the style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N2. Nani, happy (an edit of N1)
```
Edit the attached picture. Change ONLY her face, to this expression: a big, warm, happy smile with the eyes crinkled, delighted, as when the child has done well. Her glasses, dupatta, arms, hands and the counter stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N3. Nani, talking (an edit of N1)
```
Edit the attached picture. Change ONLY her face, to this expression: talking, the mouth open mid-word (the teeth just showing), the brows lifted a little, friendly and attentive. Her glasses, dupatta, arms, hands and the counter stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N4. Nani, pointing (attach the kept N1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached picture of Nani leaning on her counter for the exact pose, size, framing and counter, and the attached character sheet for who she is, draw her again exactly as in that picture, at the same size and the same position in the frame, the counter's back edge on exactly the same line, her left forearm (on the viewer's right) still lying flat on the counter exactly as before. The only change: her right arm (on the viewer's left) lifts: the elbow stays resting on the counter, the forearm rises, and her hand comes up to about shoulder height beside her face with the index finger pointing down and to the viewer's right, as if pointing at something on the counter in front of her; a bright, encouraging face, a small smile, mouth closed, looking at us.

Keep her exactly as on the sheet: the round thin gold glasses, the deep-red Kutch dupatta covering her hair, the cream embroidered kurta, the small gold earrings, the tennis bracelet and red aqiq ring on her right hand, the gold solitaire on her left hand, no bangles. Skin a warm light tan (about hex #C49A78), never orange, never pink. Same counter: a plain warm-white marble slab, its back edge a straight horizontal line, the marble top showing in front of her down to the bottom edge.

Background above and beside the counter: one perfectly flat, uniform neutral mid-grey, hex #808080. No wall, no gradient, no texture. No shadow on the grey.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### N5. Nani, eyes closed (the blink; an edit of N1)
```
Edit the attached picture. Change ONLY her eyes: both gently closed, as in a calm blink, the lids relaxed behind her glasses; the rest of the face unchanged, mouth closed. Her glasses, dupatta, arms, hands and the counter stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

### Part B: the doctor (real person: Zafar approves each one; he attaches the photos himself)

#### DS1. The doctor's character sheet (from his photos; Zafar attaches them himself)
```
Generate an image, 1536×1024, landscape.

Create a character sheet for a game character, a friendly grandfatherly family doctor, based on the person in the attached photos, in exactly the style of the attached style anchor and the attached family sheet (a stylised 3D animated-feature-film look: large expressive eyes, soft rounded forms, a simple readable mouth, smooth skin; no photorealism). Keep the likeness in the features that survive stylising: his bald head, the neatly trimmed white beard, the clear-framed glasses, his face shape and build, and his big, open, laughing smile. He is about eighty, warm and reassuring, never stern. He wears a white shirt under a checked blazer, dark trousers and dark shoes, a steel watch on his left wrist, and a stethoscope round his neck. No white coat.

Layout: eight separate panels in two rows of four, with clear space between them; nothing touches or crosses into a neighbouring panel. Do not draw panel borders, grid lines or labels.
Top row, left to right:
1. Standing, full body, front view, facing us, arms relaxed at his sides, a gentle neutral face with a small smile.
2. Standing, full body, turned three-quarters towards the viewer's LEFT (as if talking to someone sitting on his right), one hand lightly on his chest.
3. Head and shoulders, front view, a gentle neutral face, mouth closed.
4. Head and shoulders, front view, talking: the mouth open mid-word, the brows lifted.
Bottom row, left to right:
5. Head and shoulders, front view, his big open laughing smile.
6. His two hands, open, palms down, side by side, the white shirt cuffs and the steel watch showing.
7. Close-ups of his glasses and the stethoscope on their own.
8. A row of flat colour swatches: skin, beard, blazer, shirt, trousers.
The same man at the same size in every panel. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and family sheet: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No religious markers of any kind. Five fingers on each hand.
```

#### DW1. The doctor standing, three-quarter, neutral (the diagnosis, the send-off)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is, draw the doctor once, large: standing, full body, turned three-quarters towards the viewer's LEFT, as if standing beside a patient who sits on his right, his weight on both feet, both feet flat on one invisible level, his near hand relaxed at his side and the other lightly on his chest, a gentle neutral face with a small kind smile, mouth closed, looking towards the viewer's left and a little down, as at a child sitting on a bed. Draw no floor. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep him exactly as on the sheet: the bald head, the neatly trimmed white beard, the clear-framed glasses, the white shirt under the checked blazer, the dark trousers and shoes, the steel watch, the stethoscope round his neck. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DW2. The doctor talking (an edit of DW1)
```
Edit the attached picture. Change ONLY his face, to this expression: talking, the mouth open mid-word, the brows lifted a little, kind and attentive. His glasses, beard, clothes, hands and the stethoscope stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DW3. The doctor happy (an edit of DW1)
```
Edit the attached picture. Change ONLY his face, to this expression: his big, open, laughing smile, the eyes crinkled, delighted. His glasses, beard, clothes, hands and the stethoscope stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DW4. The doctor pointing (attach the kept DW1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for the exact pose, size and framing, and the attached character sheet for who he is, draw him again exactly as in that picture, at the same size and the same position in the frame, the same three-quarter turn towards the viewer's left, both feet in exactly the same place. The only change: his near arm (on the viewer's left) is raised, bent at the elbow, the hand at chest height with the index finger pointing to the viewer's left and a little down, as a doctor naming the part that hurts; a kind, attentive face, a small smile, mouth closed. Draw no floor; nothing touches the edges of the image.

Keep him exactly as on the sheet: the bald head, the neatly trimmed white beard, the clear-framed glasses, the white shirt under the checked blazer, the dark trousers and shoes, the steel watch, the stethoscope round his neck. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DW5. The doctor, eyes closed (the blink; an edit of DW1)
```
Edit the attached picture. Change ONLY his eyes: both gently closed, as in a calm blink, the lids relaxed behind his glasses; the rest of the face unchanged, mouth closed. His glasses, beard, clothes, hands and the stethoscope stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### DD1. The doctor leaning out of his door, calling the next patient (the waiting room)
```
Generate an image, 1024×1024, square.

Using the attached character sheet as the only reference for who this is, draw the doctor leaning out of a half-open doorway to call the next patient: his head, shoulders and upper chest lean in from the RIGHT edge of the image, his body turned towards us, his head tilted a little, one hand raised beside his face in a small friendly beckoning wave with the palm towards us; a big open smile, the mouth open as if calling a name. His shoulder, upper arm and the side of his body run off the RIGHT edge of the image (as if the rest of him is behind the door); draw NO door, door frame or wall: only him, against the plain background. His head is a little left of centre and fills about 40% of the image height, with clear background above, below and to the left.

Keep him exactly as on the sheet: the bald head, the neatly trimmed white beard, the clear-framed glasses, the white shirt under the checked blazer, the stethoscope round his neck. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

### Part C: the gaps (the drop machine, the sole, the sekelo plate, the girl's life)

#### DM1. The drop machine (boing)
```
Generate an image, 1024×1536, portrait.

A friendly medicine drop machine for a children's doctor's clinic, on its own, seen from the front and slightly above, standing on a flat base: a white and pale-steel cabinet with FOUR tall clear glass tubes standing side by side on top. Each tube is filled with coloured liquid medicine, one colour per tube: red, yellow, blue and green, from left to right; the liquid is smooth and clear-coloured, with no balls, beads or sweets in it. At the bottom of each tube is a small steel drip spout, like a medicine dropper's tip, over a shared chute that funnels down to one small round opening at the bottom centre, where a drop can fall out. On the front, under each tube, is an empty round steel socket where a lever will go; draw NO levers. Centred, filling about 85% of the image height.
Clean, clinical and friendly: it must look like a medicine dispenser, not a sweet, gumball or jelly-bean machine. No balls, no glass dome, no coin slot, no turning handle, no stripes, no wrapped sweets.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and clinic things: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### DM2. The levers and the drops (boing; attach the kept DM1 and the anchor)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: six things in an invisible grid of 3 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. Each seen from the front and slightly above, matching the attached drop machine.
Row 1: (1) a short steel lever with a round white knob, pointing UP, on a small round steel mount; (2) the SAME lever and mount, at exactly the same size and position in its cell, pulled DOWN; (3) one single drop of liquid medicine in red, falling: a teardrop shape (round at the bottom, pointed at the top), matte and softly translucent like coloured syrup, never a glossy ball, bead or sweet.
Row 2: (4) the same drop in yellow; (5) the same drop in blue; (6) the same drop in green. All four drops exactly the same teardrop size and shape.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached machine and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### RP1. The girl's sole with level toes (redo of the clinic pack's child-P1, for foot level 3)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is (the girl on the sheet, a child of about five), and the attached sole picture for the exact framing, size and look, draw the same close-up again for a children's doctor game: her bare right foot held up towards us so that we see the sole straight on, the toes at the top, the heel at the bottom, the ankle and a little of the leg in a plain white cotton trouser leg going back and down out of the bottom edge of the image. The one change from the attached picture: the five toes sit in a LEVEL row across the top of the foot, their tips all at about the same height (the big toe only a little higher than the little toe), clearly separate and easy to count, with a small gap between each. The sole is the main thing, centred, filling about three quarters of the image height; smooth and clean, a little paler and pinker than the top of the foot; no lines drawn on it, no marks, no splinters. Skin the same warm light tan as the sheet (about hex #C49A78), never orange. The leg touches only the bottom edge of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five toes.
```

#### SK2. The sekelo plate holding one, two, three and four straight skewers (top-down)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a cooking game: the SAME plain oval brushed-steel plate as the attached plate, seen from directly above, straight down, four times in an invisible grid of 2 columns and 2 rows of equal cells, the plate at exactly the same size and position in every cell (its long axis left to right, filling about 80% of the cell's width), with clear background all round; nothing touches a cell boundary or an image edge. Do not draw grid lines, borders or labels.
On the plates, bare skewers exactly like the attached one (a plain thin bamboo stick with a short rounded wooden handle at one end), with NO food on them, lying STRAIGHT and PARALLEL, left to right across the plate, never fanned, never bending, all pointing the same way with the handles to the RIGHT and each handle sticking out past the plate's right rim: cell 1 (top left) ONE skewer across the middle of the plate; cell 2 (top right) TWO skewers, close together and evenly spaced about the middle; cell 3 (bottom left) THREE; cell 4 (bottom right) FOUR, still close together and evenly spaced, all well inside the plate's long edges. The skewers rest flat on the plate with a soft contact shadow on the steel.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No table, no gradient, no texture. NO shadows on the grey.

Style: exactly as the attached plate, skewer and style anchor: a stylised 3D animated-feature-film look, semi-photoreal brushed steel and wood, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### GB1. The girl, eyes closed (the blink; an edit of her seated front picture)
```
Edit the attached picture. Change ONLY her eyes: both gently closed, as in a calm blink, the lids relaxed; the rest of the face unchanged, mouth closed. Her plaits, ribbons, dress, hands and legs stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### GM1. The girl, mouth open mid-word (the talking frame; an edit of her seated front picture)
```
Edit the attached picture. Change ONLY her mouth: open a little, mid-word, the teeth just showing, as when talking; the eyes and the rest of the face unchanged. Her plaits, ribbons, dress, hands and legs stay exactly as they are.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same background. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

### Parts D and E: the other patients (templates; fill {NAME}, {KEEP}, {LEGS} and {LIMB_WHO} from the PEOPLE table)

#### W1. Front, neutral
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is, draw {NAME} once, large: sitting on the edge of a doctor's examination bed, full body, front view, facing us, exactly as in the first panel of the sheet. Draw no bed, stool or step: the backs of the thighs are flat and level as if resting on a flat surface, the knees bent, both feet resting flat on an invisible step lower down, both hands resting on the lap, a gentle neutral face, looking at us, mouth closed. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W2. Happy (an edit)
```
Edit the attached picture. Change ONLY the face, to this expression: a big, happy, open smile and bright eyes, feeling much better.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W3. Sad (an edit)
```
Edit the attached picture. Change ONLY the face, to this expression: sad, the brows raised in the middle, the mouth turned down, the eyes a little glassy, no tears.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W4. Pain (an edit)
```
Edit the attached picture. Change ONLY the face, to this expression: a small comic wince of pain, one eye squeezed shut, the teeth together, the brows pulled together; mild and a little funny, never real distress.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W5. Hot (an edit)
```
Edit the attached picture. Change ONLY the face, to this expression: much too hot, flushed pink cheeks, droopy half-closed eyes, the mouth open, puffing out air.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W6. Cold (an edit)
```
Edit the attached picture. Change ONLY the face, to this expression: much too cold, the teeth chattering, a pink nose and pink cheeks, the eyes scrunched.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, frost, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W7. Side-on, neutral
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is, draw {NAME} once, large, exactly as in the side-on sitting panel of the sheet: full body, seen exactly side-on, in profile, facing right, sitting upright on the end of a doctor's examination bed. Draw no bed: the backs of the thighs are flat and level as if resting on a flat surface, and {LEGS} Both hands rest on the lap; a gentle neutral face, looking straight ahead to the right, mouth closed. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W8. Side-on, happy (an edit of W7)
```
Edit the attached picture. Change ONLY the face, to this expression: a big, happy, open smile and bright eyes, feeling much better.
Everything else stays exactly the same: the same person, pose, body, hands, clothes, hair, colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey background with no shadows. Do not move, resize, crop or add anything. Do not add any text, letters, numbers, symbols, tears, sweat drops, stars or motion lines.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W9. The blanket (template; attach the kept W1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is, and the attached front picture of {NAME} for the exact pose, size and framing, draw {NAME} again exactly as in that front picture, at the same size and the same position in the frame, sitting on an invisible ledge with the same legs and the same feet in exactly the same place, but now: a soft, thick, plain deep-red fleece blanket is wrapped around the shoulders and back like a cape, its two front edges held together at the chest by both hands; the blanket falls over the lap, but the lower legs and feet still show. A cosy, relieved face: a small warm smile, the eyes a little sleepy. Draw no bed, stool or step.

Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures and style: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### W10. Hugging the hot-water bottle (attach the kept W1 and the sheet; W1's exact size and feet)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet and the attached seated front picture as the only references for who this is, draw {NAME} once, large, at EXACTLY the same size and in EXACTLY the same place as in the attached seated front picture: sitting on the edge of a doctor's examination bed, full body, front view, facing us, the backs of the thighs flat and level, the knees bent, both feet in exactly the same place and at the same height as in the seated picture, the head at the same height. Draw no bed, stool or step. The only change: with both arms {NAME} hugs a hot-water bottle against the tummy, a plain teal knitted cover with a cream rubber neck and stopper showing at the top, the hands wrapped round it, with a comforted, cosy face, the eyes half closed. Centred, the figure filling about 85% of the image height, with clear background all round; nothing touches the edges of the image.

Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### M1. Mouth open (tight framing: the cheeks run off both edges)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is, draw an extreme close-up of {NAME}'s face from just above the tip of the nose to just below the chin, front view, facing us, so close that the cheeks run off the LEFT and RIGHT edges of the image: no ears, no hair, no headscarf edge, no collar and no clothing in the picture, only the lower face. The mouth is WIDE OPEN as if saying "aah" for the dentist: the top and bottom rows of clean, white teeth clear and separate, the tongue low, the inside of the mouth soft pink. Clean, healthy teeth and gums. Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), smooth and plain, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the face does not cover, above and below. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### M2. Tongue out (tight framing, plain skin)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is, draw an extreme close-up of {NAME}'s face from just above the tip of the nose to just below the chin, front view, facing us, so close that the cheeks run off the LEFT and RIGHT edges of the image: no ears, no hair, no headscarf edge, no collar and no clothing in the picture, only the lower face. The mouth is open and the TONGUE is out and down over the lower lip, plain smooth pink with no spots, filling about half of the image height. Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), smooth and PLAIN with NO rosy cheeks and no blush: the tongue is the only pink in the picture. Never orange, never pink skin.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the face does not cover, above and below. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### Y1. Eyes, clear (tight framing: the head's sides run off both edges)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is, draw an extreme close-up of {NAME}'s eyes: front view, facing us, from the middle of the forehead to just below the tip of the nose, so close that the SIDES of the head run off the LEFT and RIGHT edges of the image: no ears in the picture, and only a little of the hair or headscarf at the very top where it meets the forehead. Both eyes open, clear and bright, looking straight at us, across the middle of the image; soft brows. Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), smooth and plain, never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the face does not cover, above and below. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### Y2. One eye sore (an edit of Y1)
```
Edit the attached picture. Make ONLY the eye on the viewer's right look sore: the white of that eye pink, its lids a little puffy and pink, the upper lid slightly droopy. No tears, nothing in the eye.
The other eye and everything else stay exactly the same, at the same size and position; the same lighting; the same flat mid-grey background with no shadows. Do not add text, letters, numbers or symbols.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### Y3. Eyes closed (an edit of Y1)
```
Edit the attached picture. Change ONLY the eyes: both closed gently, as in a blink, the lashes together, the face relaxed.
Everything else stays exactly the same, at the same size and position; the same lighting; the same flat mid-grey background with no shadows. Do not add text, letters, numbers or symbols.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### T1. Eye test A (the split screen; looking past us at the chart)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is, draw {NAME} from the head to the shoulders, front view, facing us, large, the shoulders running off the BOTTOM edge of the image. {NAME} is doing an eye test: one hand is lifted flat over the eye on the VIEWER'S RIGHT, the palm towards the face, five fingers together; the other eye is open and LOOKING A LITTLE TO OUR RIGHT, past us, at an eye chart just outside the picture, with a small concentrating smile. The head is centred and fills about 60% of the image width, with clear background at the left, right and top; only the shoulders touch the bottom edge.

Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No wall, no chart, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on the hand.
```

#### T2. Eye test B (side-on)
```
Generate an image, 1024×1536, portrait.

For a children's doctor game, the eye test: {NAME}, from the waist up, seen exactly side-on, in profile, facing right, sitting upright, both hands on the lap, looking straight ahead to the right and slightly up, as if reading a chart just in front: concentrating, with a small curious smile. The body runs off the bottom edge of the image; clear background above the head and in front of the face.
Keep {NAME} exactly as on the attached sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### K1. Knee
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the right knee of {LIMB_WHO}, sitting on the edge of a bed with the lower leg hanging down, seen from the side and a little in front (a three-quarter side view), so the knee is the main thing in the picture.
- The trouser leg is plain white cotton with no print, rolled up neatly to just above the knee, so the whole knee and the top of the shin are bare skin.
- The thigh comes in from the left edge of the image and runs level to the knee. The knee sits a little right of the centre, about 40% down from the top. The shin hangs straight down and runs off the bottom edge of the image; no foot in the picture.
- The bare knee fills about half the image height.
- Smooth, clean, healthy skin, the same warm light tan as the sheet (about hex #C49A78), never orange; no bruise, no mark, no plaster.
Draw no bed: under the thigh there is only background. The leg touches only the left and bottom edges of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### K2. Knee, kicked (template; attach the kept K1 and the sheet)
```
Generate an image, 1536×1024, landscape.

Using the attached knee close-up for the exact framing, size and look, and the attached character sheet for who this is, draw the same close-up of the right knee of {LIMB_WHO} again: the same three-quarter side view, the same plain white trouser leg rolled up to just above the knee, and the thigh coming in from the left edge, with the thigh and the knee at exactly the same size and position as in the attached close-up. But now the lower leg has just kicked forward, as when a doctor taps the knee with a little rubber hammer: the shin swings out to the right, pointing down and to the right at about 45 degrees, and runs off the bottom or right edge of the image; no foot in the picture. Smooth, clean skin, the same warm light tan (about hex #C49A78), never orange; no mark. Draw no bed. The leg touches only the left, bottom or right edges of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached close-up and sheet: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No motion lines. No outlines, no cel shading, no photorealism, no blur.
```

#### K3. Knee, grazed (an edit of K1)
```
Edit the attached picture. Add one small graze on the front of the kneecap: a rough patch of pink, scuffed skin about the size of a large coin, gentle, like a playground graze. No blood, no drops, no open wound.
Change nothing else: everything else exactly the same, at the same size and position; the same lighting; the same flat mid-grey background with no shadows. Do not add text, letters, numbers or symbols.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### F1. Forearm
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the right forearm and hand of {LIMB_WHO}, held out towards us, palm down, as when showing a doctor a sore arm, seen from above and a little in front.
- The sleeve is plain white cotton with no print, rolled up neatly to just below the elbow.
- The arm comes in from the left edge of the image, with the rolled sleeve at the edge, and runs across the picture to the hand on the right. The hand is relaxed and open, fingers together, fully inside the image.
- The bare forearm, between the sleeve and the wrist, is the main thing: it fills about a third of the image height, across the middle.
- Smooth, clean, healthy skin, the same warm light tan as the sheet (about hex #C49A78), never orange; no mark, no plaster.
The arm touches only the left edge of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on the hand.
```

#### F2. Forearm, grazed (an edit of F1)
```
Edit the attached picture. Add one small graze in the middle of the top of the forearm: a rough patch of pink, scuffed skin about the size of a large coin, gentle, like a playground graze. No blood, no drops, no open wound.
Change nothing else: everything else exactly the same, at the same size and position; the same lighting; the same flat mid-grey background with no shadows. Do not add text, letters, numbers or symbols.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### F4. Forearm, a small cut (an edit of F1)
```
Edit the attached picture. Add one short, neat, straight cut across the middle of the top of the forearm, about as long as a finger: a thin pink line with slightly pink edges, gentle. No blood, nothing open.
Change nothing else: everything else exactly the same, at the same size and position; the same lighting; the same flat mid-grey background with no shadows. Do not add text, letters, numbers or symbols.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### U1. Upper arm (the sleeve pushed up to the shoulder; nothing of the head)
```
Generate an image, 1536×1024, landscape.

Using the attached character sheet as the only reference for who this is ({LIMB_WHO}), draw a close-up of the bare left upper arm for a children's doctor game: seen from the side and a little in front, the arm hanging relaxed, the bare upper arm from the shoulder to just above the elbow filling about half of the image height, a little right of centre. The sleeve of the top is PUSHED UP to the shoulder and clearly visible, bunched above the bare upper arm. The arm leaves the image at the BOTTOM edge (the elbow and forearm are off the picture) and the side of the top is at the LEFT edge. NOTHING of the head, neck, chin, hair or headscarf is in the picture: the image stops below the shoulder. Clean skin with no marks. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling whatever the arm and top do not cover. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bare shoulder beyond the pushed-up sleeve.
```

#### P1. Sole of the foot (toes in a level row)
```
Generate an image, 1024×1536, portrait.

A close-up for a children's doctor game: the bare right foot of {LIMB_WHO}, held up towards us so that we see the sole straight on: the toes at the top, the heel at the bottom. The ankle and a little of the leg, in a plain white cotton trouser leg rolled up, go back and down out of the bottom edge of the image.
- The sole is the main thing, centred, filling about three quarters of the image height.
- The five toes sit in a LEVEL row across the top of the foot, their tips all at about the same height (the big toe only a little higher than the little toe), clearly separate and easy to count, with a small gap between each.
- The sole is smooth and clean, a little paler and pinker than the top of the foot; no lines drawn on it, no marks, no splinters.
- The skin is the same warm light tan as the sheet (about hex #C49A78), never orange.
The leg touches only the bottom edge of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five toes.
```

### Part F: the belt sheets (one sheet per item; only if the pharmacy shot shows the rough sprite)

#### E18. The bandage roll
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a rolled white crepe bandage, like the attached bandage roll: a neat cylinder of soft white fabric with its loose end tucked: the same object, colours and materials in every cell.
Row 1, left to right: (1) the roll lying on its side, seen from the front and a little above; (2) lying on its side, seen from directly above; (3) standing on its end, seen straight on from the front; (4) in use: the roll partly unrolled, a short length of bandage trailing out flat to the left.
Row 2, left to right: (5) the roll seen end-on, the spiral of the rolled fabric showing; (6) lying, seen exactly side-on; (7) two turns of bandage wrapped round an invisible cylinder, seen from the front (only the fabric, nothing inside it); (8) a short length of bandage lying flat and open, seen from directly above.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached bandage roll and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E19. The thread reel (the cut's stitches; no needle)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a small wooden reel of plain blue cotton thread with a short loose end of thread; NO needle anywhere: the same object, colours and materials in every cell.
Row 1, left to right: (1) the reel standing upright, seen from the front and a little above; (2) seen from directly above (a circle); (3) standing, seen straight on from the front; (4) in use: the reel lying on its side with a length of thread pulled out to the right.
Row 2, left to right: (5) the reel seen exactly side-on; (6) the reel three-quarter from above; (7) a short loose length of blue thread lying in a loose curve, on its own; (8) the reel with a little less thread on it (nearly used up).
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E20. The filling tube (the dentist's filling)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a small white squeezable plastic tube with a rounded blue cap and a plain blue band near the cap, like a small toothpaste tube, with NO writing or label: the same object, colours and materials in every cell.
Row 1, left to right: (1) lying on its side, cap to the left, seen from the front and a little above; (2) lying, seen from directly above; (3) standing on its cap, seen straight on from the front; (4) in use: held tilted 45 degrees, cap off, the open nozzle to the lower left with a small bead of off-white paste at it.
Row 2, left to right: (5) lying, seen exactly side-on; (6) the cap off, lying beside the tube; (7) the tube squeezed in the middle, nozzle down, a short worm of off-white paste coming out; (8) the tube three-quarter from above.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached care kit and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E21. The reflex hammer
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is the reflex hammer from the attached clinic things: a red rubber triangular head on a slim steel handle: the same object, colours and materials in every cell.
Row 1, left to right: (1) lying flat, head to the left, seen from the front and a little above; (2) lying flat, seen from directly above; (3) lying flat, seen straight on from the side; (4) in use: held tilted 45 degrees, the head to the lower left as if about to tap a knee.
Row 2, left to right: (5) held vertically, head down; (6) held vertically, head up; (7) seen exactly end-on from the head; (8) three-quarter from above.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### E22. The eye patch (soft, plain, with an elastic band)
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: the SAME object in eight views, in an invisible grid of 4 columns and 2 rows of equal cells, one view per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels. The object is a child's soft eye patch: a plain pale-blue cotton oval pad with a thin white elastic band attached at both sides; no print, no picture, no skull: the same object, colours and materials in every cell.
Row 1, left to right: (1) the pad face-on, the band looping out to the sides, seen from the front and a little above; (2) lying flat, seen from directly above; (3) the pad straight on from the front, the band hanging below; (4) in use: the pad curved as it would sit over an eye, seen three-quarter from the front, the band running off to the sides.
Row 2, left to right: (5) seen exactly side-on, the pad's gentle curve showing; (6) the pad from behind (the soft inside); (7) the pad with its band folded neatly under it; (8) three-quarter from above.
Light from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached clinic things and the style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

## 6. Cut and wire notes (for the sessions after the run)

- **Nani (N1–N5):** key out the grey; measure the counter's back edge line in N1; cut everything above it, plus (for way (b) in flaw 1) the forearms and hands lying on the marble, with the marble itself removed by colour-to-alpha against its measured colour; scale so the head (the scarf's outline at eye height) is about 180 px wide at 1×, place the counter line at y 608 and the scarf top near y 150 (`CHARS.nani` top and scale change accordingly); the moods N2, N3, N5 are registered to N1 by ECC on the head band and pasted back as head layers on N1's canvas (`build/cut_s04c.py` did this); N4 is a whole figure registered on the head and the counter line. Export `nani-{neutral,happy,talk,point,blink}.webp` + `@2x`; the blink is a new key for the talk animation (ART-19). Way (b) also needs the first tray's box cropped as an occluder above her (`stations.js occluder()`, a second `setCrop`).
- **The doctor (DS1–DD1):** DW1 as a `figure` job (feet line, 1× height 0.66 of the exam room, about 590 px; `scenes-v2.json` exam.doctor, stand.doctor, door.doctor), DW2/DW3/DW5 head layers on its canvas, DW4 a registered whole figure; DD1 trimmed with the right edge kept flush (exit: right), placed at the waiting room's door (`waiting.doctor`, h 0.2); 512 px head crops (neutral, talk, happy) replace `Kit.DOCTOR_FACE` and `Kit.doctorFigure`. The photos are never committed.
- **The patients (part D, E, and the landed boy, old man, old woman):** the clinic pack's `figure` and `closeup` jobs in a new `s05.cut.json` (`artcut.py`), one canvas per person, seat and feet lines, head layers, 512 px heads with the eye line at 42%; the adult limbs into `closeups/adult/`; `heal-art.json` gains the kinds and every close-up's `kinds` list grows. The waiting room (`waiting.js` `artFor`) and the stages read `heal-art.json` by kind, so no new placement code for a kind that has the girl's keys.
- **The drop machine (DM1, DM2):** cut DM1 whole (1024×1536, trimmed), record the four spouts and the chute's mouth; DM2 by its gutters; `boing.json` `machine`, levers and drops with their measured sockets; the upright syringe from `sheets/syringe/syringe-upright-open`.
- **The sole (RP1):** on P1's canvas, the toes re-measured for `foot.json` `place` so levels 1–3 use it.
- **The plate (SK2):** four registered cells into `v3/sekelo/plate-straight-{1..4}.webp`; `grill.js` `sk3-plate-n` keys (the fanned v2 retired).
- **The belt sheets (E18–E22):** `grid` jobs as the s02 sheets; `sheets.json` views and remaps.

