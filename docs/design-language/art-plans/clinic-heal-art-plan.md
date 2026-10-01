# Clinic heal games: the art plan and the ChatGPT run (pack `clinic-heal-v3`)

**Written:** 1 Oct 2026, for the doctor's visit (~9 Oct). **Status:** draft for Zafar; nothing runs until he says go.
**Built from:** `CLAUDE.md` (Art; non-negotiables 13, 16), `docs/process/rules.md` §7 (D1–D31) and §9 (I1, I12), `docs/design-language/art-bible.md`, `docs/design-language/art-pipeline.md`, `docs/process/art-how-to.md` (the runner method), `docs/feedback/clinic-playtest-2026-10-01.md` §1b, §8A, §8B, §8H, §12, `docs/decisions.md` 1 Oct (decision 27), `data/clinic/rough-art.json`, `data/clinic/scenes-v2.json`, `data/layout.json` (`stage`), `build/reports/step3-r3a.md` ("Art for tablets"), and the earlier prompt packs in `docs/archive/art-prompts/` (their tested wording is reused: the batch 3 patient sheets and "where it hurts", the CI item sheets).

**How to use this page:** sections 1–4 are the thinking (D4, D5). Section 5 holds the prompt texts the runner pastes. Section 6 is the one block Zafar pastes into Claude in Chrome. Section 7 is the pass/fail list. Section 8 says where every image goes once it's back. Section 9 is the estimate; section 10 the questions for Zafar.

---

## 0. In short

- **115 images** in four parts, uploaded by Chrome to `sources/art/clinic-heal-v3/` on `main`:
  - **A, with Zafar watching (6):** the first character sheet of each new patient: the girl, the boy, the old man, the old woman, the man, the woman.
  - **B, the girl and her games (37):** her wide shots front and side, six states, the blanket and the hot-water bottle; every close-up her nine games need; and the props those games need (the overlays, the fever-room things, the exam room's tablet version and open window, the eye chart, the filling button).
  - **C, the other five patients (70):** their wide shots and states, the adult limb close-ups, and only the head close-ups their ailments need.
  - **D, the drop machine (2).**
- **One change to the order I was given:** the fever-room things, the eye chart and the filling button sit in part B, straight after the girl, not after the other patients. Her fever, eye and tooth games can't be played without them, so this is what makes the visit safe if the run stops early (question 1).
- **Zafar's time:** about 5 minutes to start, then 30–40 minutes watching the six sheets; the rest runs on its own. The girl's sheet (S1) waits for him however long it takes; if he goes quiet for 15 minutes on any later sheet, the runner moves on to part B and comes back to the skipped sheets on "resume".
- **When:** as soon as this page is pushed (the block reads it from the branch `ccr-fcd9dddd-wnywzc` until it reaches `main`). Part B is likely done in 2–3 hours, part C and D overnight.

---

## 1. Reused on purpose, retired, and not in this batch

**Reused on purpose (D23).** None of this is redrawn:

| Art | Where it is | Used for |
|---|---|---|
| The exam room CB2b | `assets/clinic/rooms/bg-clinic-exam-cb2b-v1.webp` (source `sources/art/clinic-v2/cb2b-exam-bed-close-v1.png`) | The wide shot (diagnosis and zoom), and, zoomed and blurred in code, the background behind every close-up. Only extended (R3) and edited (R4, the open window) |
| Every heal tool already cut | `assets/clinic/items-v2/` (thermometer, desk fan, red blanket, syringe, reflex hammer, bandage roll, tweezers, cotton-bud pot, eye drops, dentist drill, filling paste, toothbrush, honey, lemon, turmeric, milk jug, ginger, teaspoon, tumbler, the plasters, hot/cold/lukewarm jugs, basin, apple, pen torch, stethoscope, blue cloth) | The shelf and the scenes, as they are. New props below are drawn to match them (CI1 and CI2 are attached) |
| Nana, Ma and Ali as patients | `assets/clinic/patients/{nana,ma,ali}/*-sit*.webp`; feelings `assets/characters/{nana,ma,ali}/*-feeling-*.png` (`data/clinic/rough-art.json` → `final`) | Family patients keep their front sitting poses and their twelve feelings each (hot, cold, ouch, sad, happy …) for the corner face and the send-off. No new art for them in this batch (question 6) |
| The patient sheets and line-up from batch 3 | `sources/art/chatgpt-batch3/char-clinic-{girl,boy,oldman,oldwoman,dad-baby,lineup}-v1.png` | Identity references for part A. They were filed "waiting for approval" and never signed off, which is why part A makes each person's first signed sheet |
| Ali's "where it hurts" sheet | `sources/art/chatgpt-batch3/char-ali-hurts-v1.png` | How a seated patient is posed and rendered (a reference only, never copied) |
| Cook's item icons | `assets/cook/items/icon-<id>.webp` | The pictures on the eye chart's rows (placed by code), so the chart uses words the child already knows |
| The kitchen kit's pour | Cook | The drink pour in the sore-spots game |

**Retired:** CB6b (`cb6b-closeup-bed*.webp`) as the heal background (kept as a fallback, not deleted); **the lollipop**, which `data/clinic/pipeline.json` still lists in six places: `ailments.jab.items` and `ailments.jab.ask` (the jab's ask), `stages.sendoff.helps.sad` (the sad patient's help at the send-off), `stages.sendoff.helpCards`, `extras.list` and `stages.pharmacy.decoys`. It gets no art; the data swaps it for the apple (I2, CLN-27, CLN-37) in the finishing session, not here; every emoji tool and every code-drawn stand-in limb, head, ear, mouth, tongue, eye and foot; the rough girl, boy, old man, old woman, uncle and auntie sprites (`assets/clinic/rough/patients/`), once the new ones are wired.

**Not in this batch:**
- **The doctor.** He stands in every wide shot, but his art is made from his own photos with Zafar watching, and that isn't in this brief (question 5).
- **The player.** The heal games are first person with no hands, so the player isn't drawn. The player's own range of skin tones (I12) belongs to the character maker and is untouched here.
- **Evening and night versions.** The clinic is daytime only, so no relights (D31).

---

## 2. The staging this art serves, and the canvas rules

### 2.1 The staging (decision 27, D1–D3; `clinic-playtest-2026-10-01.md` §8A)

1. **The wide shot** is CB2b at eye level (art-bible camera E). There are two, chosen by the angle the close-up needs (D2):
   - **Front-on:** the patient sits centred on the bed's long edge, facing us, feet on the step stool. This is also the diagnosis scene, and the shot for the forearm, the upper arm, the mouth, the tongue, the eyes, the eye test A, the foot sole and the fever room.
   - **Side-on:** the patient sits on the right-hand end of the bed in profile, facing right towards the doctor, legs hanging over the end. This is the shot for the knee, the ear and the eye test B.
   - Moving from the front-on diagnosis to a side-on zoom is a cross-fade: the patient turns.
2. **The zoom** (code). The room layer scales about the sore part's anchor until the part fills about 60% of the play area's height. At the peak, the HD close-up cross-fades in. For the knee and ear (from W7) and the mouth, tongue, eyes and eye test A (from W1) it's registered so the part sits at the same place and size (a match cut); the forearm, upper arm, sole and eye test B change pose or angle, so they hard-cut at the peak (section 7.6). The room behind stays CB2b, zoomed and blurred. After the game, it cross-fades back to the wide pose in its happy state, zooms out, and the patient says "thank you, I feel better".
3. **States** (D3, Zafar): neutral, happy, sad, pain, hot and cold, as face swaps on one body. The whole body changes for two extras only: **the blanket over the shoulders** and **hugging the hot-water bottle**. The body alternates as the room gets too hot or too cold, using the existing shake (E22); not every item is acted out.

### 2.2 Canvases, resolution, bleed and safe areas

The clinic's scenes are laid out in the rooms' own pixels, 1536×1024, filled "cover" (`data/layout.json` → `stage.scenes.clinic`). R3a's tablet note asks for **@2x and a 4:3 bleed** on backgrounds and close-ups. ChatGPT can't make more than 1536 px on a side, so this is how each kind of image gets there:

| Kind | Made at | 1× export | @2x export | Bleed and safe area |
|---|---|---|---|---|
| **Wide poses** (W) | 1024×1536 portrait, one figure about 1,300 px tall | The figure at its largest drawn height on the room: about 410 px for a child, 575 px for an adult (scene data, measured by overlay) | 2× that, downscaled from the source (real pixels, no upscaling) | None needed: a sprite on the room |
| **Head layers and corner faces** | Edits of the wide pose | On the wide pose's own canvas; corner-face crops square, 512 px | Head layers 2×, as the wide pose | Corner faces: the eye line at the same height and the face at the same width for everyone (D18) |
| **Close-ups** (K, F, U, P, E, M, Y, T) | 1536×1024 or 1024×1536; the limb or head **runs off the image edges** | The source size | **2× with a free upscaler** (Real-ESRGAN, run locally in the cut step), then sharpened (question 3) | **Exit edges are the bleed:** the code scales each close-up so every edge the limb leaves by sits past the screen edge on any shape from square (a tablet's play area once the 25% sidebar is taken) to 1.75:1 (a phone). **The safe area** (the part and every tap target) is the middle 60% of the width and 70% of the height |
| **The exam room** (R3) | 1024×1024: the whole of CB2b across the middle, with new ceiling and floor bands | 1536×1536: the original 1536×1024 kept pixel for pixel in the middle (y 256–1280), with only the new bands taken from R3 (made at 0.67 scale, so they go through Real-ESRGAN to reach 1536 wide), registered and feathered | 3072×3072 (upscaled) | A tablet's square play area now sees the whole room, window and door included; a phone's 1.75:1 sees the full width and loses only bands top and bottom. **Safe area: x 0–1 and y about 0.07–0.93 of the original picture;** zoom anchors and tappable room things stay inside y 0.10–0.90 |
| **Props and overlays** (O, R1, R2, B1, D2) | Grid sheets, cells about 350–500 px | Trimmed, 16 px pad, at most 512 px | Not needed (drawn at 480 px or less, per R3a) | — |
| **The eye chart and the drop machine** (C1, C2, D1) | 1024×1536 portrait | The source size | 2×, upscaled | Inside the safe area of their scene |

**Ground:** every sprite is drawn on flat mid-grey `#808080` with no shadows (D22: grey for characters, steel, glass, wood and tools; nothing in this batch is food). Every sprite has **a flat base where it touches something**: the seat line under the thighs, feet flat on one level, items standing on their feet or lying flat. The **contact shadow is drawn in code** (art bible §2), never in the art. **No text anywhere** (D13): the eye chart has no letters or numbers, and the heater, fan, button and machine have no dials, labels or logos.

**Light:** warm, from the upper left. CB2b's window is on the left, so the close-ups and sprites agree with the room (D14).

---

## 3. Thinking before prompting, image by image (D4, D5)

### 3.1 The patients: sheets, wide poses, states

**Skin (I12):** every generic patient is **Zafar's warm light tan**: midtone about `#C49A78`, highlights `#D8B894`, shadows `#A07A60`, never orange, never pink. Every prompt says so, and every cut is sampled against it and colour-corrected if it drifts. Age, hair and clothes give the variety.

**Modesty (I1):** long sleeves, loose clothes. The old woman's and the woman's headscarves cover the hair, ears and neck in every panel. Rolled-up sleeves and trouser legs appear only in the limb close-ups, on children and the men (question 2).

| Image | What it's for | How it's seen in the game | Camera | Who stands where, at what size | What stays clear | Registration |
|---|---|---|---|---|---|---|
| **S1–S6 first sheets** | The one reference for every later image of that person (D12); Zafar signs each off | Never seen in the game | Front, side, head views, sole | Eight panels: sitting front, sitting side-on, head front, head side-on (ear), head happy, hands, sole, swatches | Nothing touching | — |
| **W1 front, neutral** | The diagnosis and the front-on zoom; the body every state sits on | On CB2b, sitting on the bed's front edge | E, front | Patient centred at x 0.50; seat line at y 0.535 (the mattress top); feet on the step stool's top at y 0.66; child about 0.40 of the room's height, adult about 0.56 (`scenes-v2.json` `exam.fig`, then measured by overlay). Doctor at x 0.735, feet at y 0.90 | Above the head up to the cabinet, for the thought bubble; the window (x < 0.08) and the thermometer gauge's wall spot (x 0.76–0.84, y 0.12–0.40); the mattress's free right end (x 0.62–0.72) for the small comfort things | The base canvas for W2–W6, W9, W10 |
| **W2–W6 happy, sad, pain, hot, cold** | The face reacts (D3); the corner face; the send-off bubble | Swapped over W1's face; cropped for the corner circle | Edits of W1 | As W1 | — | Each is an edit of W1, registered to W1 by ECC on the head band. **Only the head region** is kept, as a layer on W1's canvas, so any state's face can sit on any body (the blanket one included) |
| **W7 side, neutral** | The side-on zoom (knee, ear, eye test B) | On CB2b, at the bed's right-hand end, in profile, facing right | E, side | Seat at x about 0.70, y 0.535; the legs hang over the bed's end (x 0.74–0.77): a child's feet hang free, an adult's rest on the floor at y 0.80; doctor at x about 0.86, feet at y 0.92, turned three-quarter to the patient. On the square room (R3), all of this is on screen on a tablet too | The legs over the end, so the zoom to the knee reads | Base canvas for W8 |
| **W8 side, happy** | The zoom-out and "thank you" after a side-on game | As W7 | Edit of W7 | As W7 | — | Head layer on W7's canvas |
| **W9 blanket** | Fever: too cold → the blanket (small warm step); the send-off | Swapped for the whole of W1 | A fresh prompt (the arms change, so not an edit, D9) with the kept W1 and the sheet attached | As W1; the blanket matches `items-v2/blanket-red` (a plain deep-red fleece) | Legs and feet unchanged, so the seat and feet don't jump | Registered to W1 by ECC on the legs and feet band; exported on W1's canvas |
| **W10 hugging the hot-water bottle** | Fever: the medium warm step | As W9 | A fresh prompt, as W9 | The bottle: a plain teal knitted cover with a cream rubber neck and stopper. It must contrast with every patient's clothes (it does: yellow, red, blue, cream and green, white, purple), and R1's loose bottle is drawn from this one | As W9 | As W9 |

**Fanning when hot** (my 8B idea) is left out: Zafar listed only the blanket and the bottle. The hot face (flushed, puffing) carries "too hot".

### 3.2 The close-ups

A close-up is **a cut-out picture over the zoomed, blurred room**, never a lone limb on a table (CLN-43). Each limb or head runs off the image edges, so it always reads as part of the person off screen. **Sides are only in the diagnosis** (D10): each close-up shows the one sore part, and the code mirrors it for the other side (the generic patients have no one-sided features to break).

**Fabric is drawn plain white** in the limb close-ups (the rolled sleeve, the rolled trouser leg) and **tinted in code** to the patient's own colour (multiply, through a fabric mask the cut exports). So one set of child limbs serves the girl and the boy, and one set of adult limbs serves the old man and the man (§8A, "limb close-ups per age group").

| Image | Game | Camera and framing | Size of the part | Exit edges | States, one registered canvas (D8) |
|---|---|---|---|---|---|
| **K knee** (child K1–K3; adult AK1–AK3) | Knee (the hammer tap, the wrap); scrape on the knee (wash reveal, plasters) | Three-quarter side, sitting, the lower leg hanging (the kick reads) | The knee about half the image height, a little right of centre | Thigh in from the left, shin out of the bottom | 1 plain; 2 kicked (a fresh prompt with K1 and the sheet attached, since the pose changes, D9); 3 grazed (an edit of 1). **The dirt is an overlay** (O1's dirt patch) placed over the graze on 3, which the wash wipes away in code; no edit of an edit |
| **F forearm** (F1, F2, F4; AF1, AF2, AF4) | Scrape on the arm; the cut (stitches drawn in code) | Held out to us, palm down, from above and a little in front | The forearm about a third of the height, across the middle | Sleeve at the left edge | 1 plain; 2 grazed (an edit of 1; the dirt is O1's overlay, as for the knee); 4 a short neat cut, a thin pink line with no blood (H26), an edit of 1 |
| **U upper arm** (U1; AU1) | Boing (the jab) | Side and a little in front, the arm hanging | The bare upper arm about half the height | Arm out of the bottom; chest at the left | 1 plain (the plaster is the existing sprite) |
| **P sole** (P1; AP1) | Foot (the square-turn splinter paths, drawn in code) | Straight on to the sole, toes up | The sole about three-quarters of the height | Ankle and leg out of the bottom | 1 plain, smooth, with clearly separate toes (named at L3) |
| **E ear** | Ear (wax wiping, more wax spawning, the seed, drops) | Exactly side-on, facing right | The ear about 40% of the height, drawn a little bigger than real (Zafar: "a bigger ear") | Head off the top and right, neck off the bottom | 1 plain (wax, the seed and the tissue are overlays) |
| **M1 mouth** | Tooth (brush, drill in the mouth, the fill) | Front, from just above the nose to below the chin | The open mouth about half the height | Cheeks off the left and right | 1 open "aah", clean teeth (decay and the filling are overlays) |
| **M2 tongue** | Sore spots (pop the colours said, then the drink) | As M1 | The tongue about half the height | As M1 | 1 plain tongue (the spots are overlays) |
| **Y eyes** | Eye drops | Front, from the forehead to below the nose | Both eyes across the middle | Sides of the head off the left and right | 1 clear; 2 the eye on the viewer's right sore (pink); 3 both closed (the blink after a drop) |
| **T1 eye test A** | The split screen (D15h A) | Head and shoulders, front, one hand over an eye, looking just past us to our right | Head centred in the left panel | Shoulders off the bottom | 1 |
| **T2 eye test B** | Side-on beside the chart (D15h B) | From the waist up, profile, facing right, looking at the chart | Patient at the left, chart (C2) at the right | Body off the bottom | 1 |

**Who gets which close-up** (§8A: "head close-ups only for the kinds the data gives that ailment"; the allocation is my recommendation, question 2):

| Patient | Limbs (shared sets) | Own head close-ups | Wide shots |
|---|---|---|---|
| **Girl** (the doctor's visit patient) | Child K, F, U, P | E, M1, M2, Y1–Y3, T1, T2: all nine games | Front and side |
| **Boy** | Child K, F, U, P | E, M1 | Front and side |
| **Old man** | Adult K, F, U, P | Y1–Y3, T1, T2 | Front and side |
| **Old woman** | Adult P only | Y1–Y3, T1, T2 (headscarf on) | Front and side |
| **Man** (the young father from the line-up) | Adult K, F, U, P (drawn from his sheet) | M1 | Front and side |
| **Woman** | Adult P only | M2 | Front only (none of her games is side-on) |
| **Nana, Ma, Ali** | Child or adult limbs, tinted | None this batch: their games use the shared limbs; head games stay off for them until question 6 | Their existing front sits |

### 3.3 Overlays and small things (sprites placed by code)

| Image | What and why | Seen as | Notes |
|---|---|---|---|
| **O1** ear, foot and scrape bits | Ear wax big, medium and small (big and small are said from L2); a seed (the seed-in-ear ailment); two splinters; one clear drop (eye drops); a folded tissue (where the wax goes); **a dirt patch** (soft dust and grit, the scrape's wash reveal over K3 and F2) | On E, P, Y, K3 and F2 | Wax is friendly: glossy, honey-coloured, never gross. The colour change Zafar liked is a code tint. The dirt patch is scaled and rotated per scrape in code, and the wash wipes it away through a mask |
| **O2** mouth bits | Sore spots in red, yellow, blue and green (`pipeline.json` `colours`); three jagged decay patches (scattered by level); a white filling patch | On M1 and M2 | All spots the same size and shape, so only the colour word decides |
| **O3** cotton bud and ointment | One bud clean, the same bud with ointment (*malam*, D15e: never a pin), the same bud with wax (the ear wipe); a small pot of ointment | Held over M2 and E | The three buds registered; matched to CI1's bud pot |

### 3.4 The fever room (D15f)

Cooling: **window big, ceiling fan medium, hand fan small**. Warming: **blanket small, hot-water bottle medium, heater big**. The ice pack is drawn as a spare cooler (question 7). The sizes are data. The patient is the wide front pose with W5, W6, W9 and W10.

| Image | Seen as | Placement on CB2b (fractions of the original 1536×1024; measured by overlay at cut time, D5) | States |
|---|---|---|---|
| **R3 the room, square** | The exam room for every exam scene, tablets included | The original kept in the middle; ceiling and floor bands added | — |
| **R4 the window, open** | An overlay cut from the diff with CB2b (art-pipeline 9d) | x 0–0.10, y 0–0.45 | Closed = CB2b as it is; open = the overlay |
| **R2 the ceiling fan** | A body (downrod and motor) and a blade disc drawn from directly below; the code tilts the disc into the room's view (CSS `rotateX`) and spins it (`rotateZ`) | Downrod from the new ceiling at x about 0.34; blades at about y 0.12, clear of the patient's head and inside the phone crop | Off = still; on = spinning (code) |
| **R1 the comfort things and the heater** | Ice pack, hot-water bottle, hand fan on the mattress's free right end; the heater on the floor | Small things at x 0.62–0.72 on the mattress top (y about 0.45); heater on the floor at x about 0.24, base at y 0.84 (left of the bed, clear of the toys) | Heater off and on (registered) |
| **R5 the live thermometer gauge** | Big on the wall: the reading the doctor's green zone is judged on | x 0.76–0.84, y 0.12–0.40 | One empty gauge, its own 1024×1536 prompt so it's sharp at the size it's drawn; its level and green zone are code |

The **thermometer gauge** is new because the reading must be big and live (the doctor's green zone). The small glass thermometer from CI1 stays as the tool.

### 3.5 The eye chart, the filling button, the drop machine

| Image | Seen as | Notes |
|---|---|---|
| **C1 chart, front-on** | Version A: the right half of the split screen, over the blurred room | A blank white board in a light-wood frame, one small eye picture at the top and six empty rows, getting less tall from top to bottom. The pictures (Cook's icons) are placed by code at each row's size; the current row is lit and judged rows tick gold like the card (CLN-61). **No letters, no numbers** |
| **C2 chart, quarter-turned on a stand** | Version B: at the right, close to the side-on patient (T2), facing between the patient and us | The same chart, turned about 30°. The cut records its four corners, so the code can lay the row pictures on it in perspective (a CSS `matrix3d` from the corners) |
| **B1 filling button and nozzle** | Tooth fill: press the big button while the gauge (code: green zone, red either side) is in the green | Button up and down, registered; the nozzle idle and squeezing paste, registered; matched to CI1's drill and paste tube. Blue, so it reads as neither "stop" nor "yes" |
| **D1 drop machine** | Boing: four tall dispensers, each with a lever; a pulled lever lets one drop fall into the syringe below; then the syringe's glowing end starts the jab (D15g) | White and pale steel; four clear tubes of **coloured liquid medicine** (red, yellow, blue, green), each with a **drip spout** at the bottom. **Clinical, never a sweet machine** (I2, decision 27): no balls, beads or jelly beans in the tubes, no glass dome, coin slot, turning handle, stripes or wrapped sweets. The lever sockets are empty; the levers are D2 |
| **D2 levers, drops, upright syringe** | The four levers (up and down), the falling drops, and CI2's syringe standing upright with its barrel open | Each drop is **teardrop-shaped and matte-translucent** like a drop of liquid medicine, **never a glossy ball** (no gumball or jelly-bean look; question 9). The syringe is cut in two layers (the back of the barrel, and the clear front at partial alpha), so drops sit inside it |

---

## 4. The run order (what makes the visit safe)

| Part | Who's there | Prompts | Images | Why this order |
|---|---|---|---|---|
| **A** | **Zafar watches** | S1 girl, S2 boy, S3 old man, S4 old woman, S5 man, S6 woman | 6 | Each person's first sheet needs him (D12, decision 9). The girl's goes first and never times out. If he must leave, he types **go** (or is silent for 15 minutes on S2–S6): the runner starts part B and part D, and reruns the skipped sheets (and their people) on "resume" |
| **B** | Unattended | Girl: W1–W10; child limbs K1–K3, F1, F2, F4, U1, P1; her head close-ups E1, M1, M2, Y1–Y3, T1, T2; then O1–O3, R3, R4, R1, R5, R2, C1, C2, B1 | 37 | The girl is the visit's patient: with part B done, every heal game can be played with real art |
| **C** | Unattended | Boy, old man, old woman, man, woman (their W prompts and head close-ups); the adult limbs AK1–AK3, AF1, AF2, AF4, AU1, AP1 (from the man's sheet) | 70 | The rest of the cast, in the order of how many games they play |
| **D** | Unattended | D1, D2 | 2 | Zafar wants it before the visit (D19), but boing works with the stand-in beads until it lands |

**Dependencies:** an edit waits for the image it edits, and is only ever made from a fresh picture (no edits of edits); W9, W10 and K2 wait for the kept W1 or K1. Every W and every head close-up waits for its person's sheet. The child limbs need S1; the adult limbs need S5. R1 attaches the kept W10 (if W10 was skipped, R1 goes without it and draws the bottle from its words). C2 needs C1, and D2 needs D1. The runner keeps up to three going at once (D26), so within a part the order is a queue, not a strict line.

---

## 5. The prompts

**For the runner:** paste each code box exactly as written. A code box with `{NAME}`, `{KEEP}`, `{LEGS}` or `{LIMB_WHO}` is a template: replace each slot with that prompt's person's text from the PEOPLE table below, exactly, and change nothing else. These substitutions (and, in part A only, one sentence Zafar dictates) are the only changes ever allowed.

**The edit tail.** Every edit prompt (W2–W6, W8, K3, F2, F4, Y2, Y3, R4) ends with the same tail, already written into each code box: the same size and shape as the attached picture, the flat `#808080` background (R4 keeps its room), the style line and the negatives. An edit is only ever made from a fresh, non-edited picture (never an edit of an edit), and only for a small change in the same pose (D9). Where the pose changes (W9, W10, K2), it's a fresh prompt with the kept picture and the sheet attached.

### PEOPLE table (the slot texts)

| Person (run-list prefix) | {NAME} | {KEEP} | {LEGS} |
|---|---|---|---|
| girl | the girl | the round face, the two short plaits with small white ribbons, the yellow long-sleeved kurti dress, the white leggings and the white sandals | the lower legs hang down freely over the edge, the feet not touching anything. |
| boy | the boy | the short neat black hair, the gap-toothed grin, the plain red long-sleeved T-shirt, the dark blue trousers and the trainers | the lower legs hang down freely over the edge, the feet not touching anything. |
| oldman | the old man | the neatly combed-back grey hair, the grey moustache, the clean-shaven chin, the plain blue long kurta, the white trousers and the brown sandals; no cap, no glasses, no walking stick | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |
| oldwoman | the old woman | the plain white headscarf covering the hair, ears and neck, the pale cream kurta and trousers, the plain green shawl over the shoulders and the flat sandals; no glasses | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |
| man | the man | the short black hair, the short neat black beard, the plain white long-sleeved shirt, the dark navy trousers and the white trainers | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |
| woman | the woman | the plain dusty-blue headscarf covering the hair, ears and neck, the plain purple long-sleeved knee-length tunic, the loose white trousers and the flat sandals | the lower legs hang straight down over the edge and both feet rest flat on an invisible floor. |

| Limb set (run-list prefix) | {LIMB_WHO} |
|---|---|
| child | the girl on the attached character sheet, a child of about five |
| adult | the man on the attached character sheet, an adult of about thirty |

---

### Part A: the first sheets (Zafar watches each one)

#### S1. The girl (Zafar watches this one)
```
Generate an image, 1536×1024, landscape.

Using the attached girl character sheet as the only reference for who she is, make a new character sheet for her as a patient at a friendly children's doctor's, in exactly the same style. She is about five: small and round-cheeked, black hair in two short plaits tied with small white ribbons; a long-sleeved, knee-length kurti dress in plain solid yellow over white leggings; white sandals. Keep her face, hair, ribbons, clothes and colours exactly as on the sheet. Her skin is a warm light tan (about hex #C49A78): a little more brown than beige, warm and unsaturated, never orange, never pink.

Layout: eight separate panels in two rows of four, with clear space between them; nothing touches or crosses into a neighbouring panel. Do not draw panel borders, grid lines or labels.
Top row, left to right:
1. Sitting, full body, front view, facing us, on an invisible ledge (draw no bed, bench or chair): the backs of her thighs flat and level as if resting on a flat surface, knees bent, both feet resting flat on an invisible step lower down, hands resting on her lap, a gentle neutral face.
2. Sitting the same way but seen exactly side-on, in profile, facing right, her lower legs hanging down freely from the ledge, hands on her lap.
3. Head and shoulders, front view, a gentle neutral face.
4. Head and shoulders, exactly side-on, facing right, her plait behind her shoulder so her whole ear shows.
Bottom row, left to right:
5. Head and shoulders, front view, a big happy smile.
6. Her two hands, open, palms down, side by side, the yellow sleeve cuffs showing.
7. One bare foot seen straight on from below: the sole facing us, toes at the top, heel at the bottom.
8. A row of flat colour swatches: skin, hair, eyes, dress, leggings.
The same girl at the same size in every panel. The attached seated boy is only a reference for how a seated patient is posed and rendered; do not copy his looks.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### S2. The boy (Zafar watches this one)
```
Generate an image, 1536×1024, landscape.

Using the attached boy character sheet as the only reference for who he is, make a new character sheet for him as a patient at a friendly children's doctor's, in exactly the same style. He is about six: short, neat black hair and a gap-toothed grin; a plain solid red T-shirt with long sleeves; dark blue trousers; trainers. Keep his face, hair, clothes and colours exactly as on the sheet. His skin is a warm light tan (about hex #C49A78): a little more brown than beige, warm and unsaturated, never orange, never pink.

Layout: eight separate panels in two rows of four, with clear space between them; nothing touches or crosses into a neighbouring panel. Do not draw panel borders, grid lines or labels.
Top row, left to right:
1. Sitting, full body, front view, facing us, on an invisible ledge (draw no bed, bench or chair): the backs of his thighs flat and level as if resting on a flat surface, knees bent, both feet resting flat on an invisible step lower down, hands resting on his thighs, a gentle neutral face.
2. Sitting the same way but seen exactly side-on, in profile, facing right, his lower legs hanging down freely from the ledge, hands on his thighs.
3. Head and shoulders, front view, a gentle neutral face.
4. Head and shoulders, exactly side-on, facing right, his whole ear showing.
Bottom row, left to right:
5. Head and shoulders, front view, a big happy grin.
6. His two hands, open, palms down, side by side, the red sleeve cuffs showing.
7. One bare foot seen straight on from below: the sole facing us, toes at the top, heel at the bottom.
8. A row of flat colour swatches: skin, hair, eyes, T-shirt, trousers.
The same boy at the same size in every panel. The attached seated boy in orange is a different boy, only a reference for how a seated patient is posed and rendered; do not copy his looks.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### S3. The old man (Zafar watches this one)
```
Generate an image, 1536×1024, landscape.

Using the attached old man character sheet as the only reference for who he is, make a new character sheet for him as a patient at a friendly children's doctor's, in exactly the same style. He is in his seventies, slim and slightly stooped: grey hair neatly combed back, a grey moustache, a clean-shaven chin, no cap; a long kurta in plain solid blue; white trousers; brown sandals. Remove the glasses and the walking stick seen on the sheet: no glasses and no stick in any panel. Keep his face, hair, clothes and colours exactly as on the sheet. His skin is a warm light tan (about hex #C49A78): a little more brown than beige, warm and unsaturated, never orange, never pink.

Layout: eight separate panels in two rows of four, with clear space between them; nothing touches or crosses into a neighbouring panel. Do not draw panel borders, grid lines or labels.
Top row, left to right:
1. Sitting, full body, front view, facing us, on an invisible ledge (draw no bed, bench or chair): the backs of his thighs flat and level as if resting on a flat surface, knees bent, both feet resting flat on an invisible step lower down, hands resting on his thighs, a kind neutral face.
2. Sitting the same way but seen exactly side-on, in profile, facing right, his lower legs hanging straight down from the ledge and both feet flat on an invisible floor, hands on his thighs.
3. Head and shoulders, front view, a kind neutral face.
4. Head and shoulders, exactly side-on, facing right, his whole ear showing.
Bottom row, left to right:
5. Head and shoulders, front view, a warm happy smile.
6. His two hands, open, palms down, side by side, the blue sleeve cuffs showing.
7. One bare foot seen straight on from below: the sole facing us, toes at the top, heel at the bottom.
8. A row of flat colour swatches: skin, hair, eyes, kurta, trousers.
The same man at the same size in every panel. The attached seated boy is only a reference for how a seated patient is posed and rendered; do not copy his looks.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### S4. The old woman (Zafar watches this one)
```
Generate an image, 1536×1024, landscape.

Using the attached old woman character sheet as the only reference for who she is, make a new character sheet for her as a patient at a friendly children's doctor's, in exactly the same style. She is in her seventies, small and round, with a kind smile: a plain white cotton headscarf covering her hair, ears and neck in every panel, the side view included; no glasses; a pale cream kurta and trousers, with a shawl in plain solid green over her shoulders; flat sandals. Keep her face, headscarf, clothes and colours exactly as on the sheet. Her skin is a warm light tan (about hex #C49A78): a little more brown than beige, warm and unsaturated, never orange, never pink.

Layout: eight separate panels in two rows of four, with clear space between them; nothing touches or crosses into a neighbouring panel. Do not draw panel borders, grid lines or labels.
Top row, left to right:
1. Sitting, full body, front view, facing us, on an invisible ledge (draw no bed, bench or chair): the backs of her thighs flat and level as if resting on a flat surface, knees bent, both feet resting flat on an invisible step lower down, hands resting on her lap, a kind neutral face.
2. Sitting the same way but seen exactly side-on, in profile, facing right, her lower legs hanging straight down from the ledge and both feet flat on an invisible floor, hands on her lap.
3. Head and shoulders, front view, a kind neutral face.
4. Head and shoulders, exactly side-on, facing right, the headscarf covering her ear.
Bottom row, left to right:
5. Head and shoulders, front view, a warm happy smile.
6. Her two hands, open, palms down, side by side, the cream sleeve cuffs showing.
7. One bare foot seen straight on from below: the sole facing us, toes at the top, heel at the bottom.
8. A row of flat colour swatches: skin, eyes, headscarf, shawl, kurta.
The same woman at the same size in every panel. The attached seated boy is only a reference for how a seated patient is posed and rendered; do not copy his looks.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### S5. The man (Zafar watches this one)
```
Generate an image, 1536×1024, landscape.

Using the attached sheet of the young father as the only reference for who he is (leave the baby out completely), make a new character sheet for him on his own as a patient at a friendly children's doctor's, in exactly the same style. The attached line-up shows him among his neighbours; keep him exactly as there. He is about thirty: short black hair and a short, neat black beard; a plain white long-sleeved shirt; dark navy trousers; white trainers. Keep his face, hair, beard, clothes and colours exactly as on the sheet. His skin is a warm light tan (about hex #C49A78): a little more brown than beige, warm and unsaturated, never orange, never pink.

Layout: eight separate panels in two rows of four, with clear space between them; nothing touches or crosses into a neighbouring panel. Do not draw panel borders, grid lines or labels.
Top row, left to right:
1. Sitting, full body, front view, facing us, on an invisible ledge (draw no bed, bench or chair): the backs of his thighs flat and level as if resting on a flat surface, knees bent, both feet resting flat on an invisible step lower down, hands resting on his thighs, a friendly neutral face.
2. Sitting the same way but seen exactly side-on, in profile, facing right, his lower legs hanging straight down from the ledge and both feet flat on an invisible floor, hands on his thighs.
3. Head and shoulders, front view, a friendly neutral face.
4. Head and shoulders, exactly side-on, facing right, his whole ear showing.
Bottom row, left to right:
5. Head and shoulders, front view, a warm happy smile.
6. His right forearm and hand held out towards us, palm down, the white sleeve rolled up neatly to just below the elbow.
7. One bare foot seen straight on from below: the sole facing us, toes at the top, heel at the bottom.
8. A row of flat colour swatches: skin, hair, eyes, shirt, trousers.
The same man at the same size in every panel. No baby, no child, no objects.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheets and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

#### S6. The woman (Zafar watches this one)
```
Generate an image, 1536×1024, landscape.

A character sheet for a new character in a children's game, in exactly the style of the attached line-up of neighbours (a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines). She is a new neighbour, not anyone in the line-up, coming to a friendly children's doctor's as a patient: a young woman of about thirty, slim, with a warm smile; a plain dusty-blue headscarf wrapped neatly to cover her hair, ears and neck in every panel, the side view included; a long-sleeved, knee-length tunic in plain solid purple over loose white trousers; flat sandals; no jewellery. Modest and modern, never a caricature. Stylised face: large expressive eyes, soft rounded forms, a simple mouth, smooth skin. Her skin is a warm light tan (about hex #C49A78): a little more brown than beige, warm and unsaturated, never orange, never pink.

Layout: eight separate panels in two rows of four, with clear space between them; nothing touches or crosses into a neighbouring panel. Do not draw panel borders, grid lines or labels.
Top row, left to right:
1. Sitting, full body, front view, facing us, on an invisible ledge (draw no bed, bench or chair): the backs of her thighs flat and level as if resting on a flat surface, knees bent, both feet resting flat on an invisible step lower down, hands resting on her lap, a friendly neutral face.
2. Sitting the same way but seen exactly side-on, in profile, facing right, her lower legs hanging straight down from the ledge and both feet flat on an invisible floor, hands on her lap.
3. Head and shoulders, front view, a friendly neutral face.
4. Head and shoulders, exactly side-on, facing right, the headscarf covering her ear.
Bottom row, left to right:
5. Head and shoulders, front view, a warm happy smile.
6. Her two hands, open, palms down, side by side, the purple sleeve cuffs showing.
7. One bare foot seen straight on from below: the sole facing us, toes at the top, heel at the bottom.
8. A row of flat colour swatches: skin, eyes, headscarf, tunic, trousers.
The same woman at the same size in every panel.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

---

### The wide poses and states (every person; templates)

#### W1. Front, neutral (template)
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

#### W7. Side-on, neutral (template)
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

#### W10. Hugging the hot-water bottle (template; attach the kept W1 and the sheet)
```
Generate an image, 1024×1536, portrait.

Using the attached character sheet as the only reference for who this is, and the attached front picture of {NAME} for the exact pose, size and framing, draw {NAME} again exactly as in that front picture, at the same size and the same position in the frame, sitting on an invisible ledge with the same legs and the same feet in exactly the same place, but now hugging a hot-water bottle close against the tummy with both arms: the bottle is in a plain teal knitted cover, with its cream rubber neck and stopper showing at the top. A warm, comforted face: the eyes half closed, a small contented smile. Draw no bed, stool or step.

Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange, never pink.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached pictures and style: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers. Five fingers on each hand.
```

---

### The limb close-ups (child set and adult set; templates)

#### K1. Knee (template)
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

#### F1. Forearm (template)
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

#### U1. Upper arm (template)
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the left upper arm and shoulder of {LIMB_WHO}, sitting up, the arm hanging relaxed down by the side, seen from the side and a little in front, ready for a friendly doctor's jab.
- The top is plain white cotton with no print; its sleeve is pushed up neatly to the top of the shoulder, so the whole upper arm is bare.
- The shoulder is at the upper left; the arm runs down and off the bottom edge of the image; a little of the side of the chest, in the white top, shows at the left edge.
- The bare upper arm is the main thing, a little left of centre, filling about half the image height.
- Smooth, clean, healthy skin, the same warm light tan as the sheet (about hex #C49A78), never orange; no mark.
The body touches only the left and bottom edges of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### P1. Sole of the foot (template)
```
Generate an image, 1024×1536, portrait.

A close-up for a children's doctor game: the bare right foot of {LIMB_WHO}, held up towards us so that we see the sole straight on: the toes at the top, the heel at the bottom. The ankle and a little of the leg, in a plain white cotton trouser leg rolled up, go back and down out of the bottom edge of the image.
- The sole is the main thing, centred, filling about three quarters of the image height.
- The five toes are clearly separate and easy to count.
- The sole is smooth and clean, a little paler and pinker than the top of the foot; no lines drawn on it, no marks, no splinters.
- The skin is the same warm light tan as the sheet (about hex #C49A78), never orange.
The leg touches only the bottom edge of the image.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no surface, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five toes.
```

---

### The head close-ups (templates)

#### E1. Ear
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the side of {NAME}'s head, exactly side-on, in profile, facing right, as in the side-on head panel of the attached sheet, so the ear nearest us is the main thing in the picture.
- The ear sits a little left of the centre and fills about 40% of the image height, drawn a little bigger than real. Its opening is clearly visible, clean and healthy. The hair is kept back behind the ear.
- The head is so big in the picture that its top runs off the top edge, the face runs off the right edge just past the eye, and the neck runs off the bottom edge.
Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. No bindi, tilak or other Hindu religious markers.
```

#### M1. Mouth open
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the lower half of {NAME}'s face, front view, from just above the nose down to just below the chin, with the cheeks running off the left and right edges of the image. The mouth is open wide, as when saying "aah" for the dentist, so the teeth show clearly, the top row and the bottom row, white, clean and healthy, as they would be at this age; the tongue resting low. The open mouth is the main thing, centred, about half the image height.
Keep {NAME} exactly as on the attached sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### M2. Tongue out
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the lower half of {NAME}'s face, front view, from just above the nose down to below the chin, with the cheeks running off the left and right edges of the image. The mouth is wide open and the tongue is stuck out and down as far as it goes, as at the doctor's. The tongue is a plain, healthy pink, smooth and clean, with no spots: it is the main thing, centred, about half the image height.
Keep {NAME} exactly as on the attached sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

Style: exactly as the attached sheet and style anchor: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### Y1. Eyes, clear
```
Generate an image, 1536×1024, landscape.

A close-up for a children's doctor game: the upper half of {NAME}'s face, front view, from the top of the forehead down to just below the nose, with the sides of the head running off the left and right edges of the image. Both eyes are wide open, looking straight at us, clear and healthy. The eyes are the main thing, across the middle of the image.
Keep {NAME} exactly as on the attached sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

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

#### T1. Eye test A (the split screen)
```
Generate an image, 1024×1536, portrait.

For a children's doctor game, the eye test: {NAME}, head and shoulders down to mid-chest, front view, close, as in the head-and-shoulders panel of the attached sheet. One hand is cupped over the eye on the viewer's right, covering it. The other eye is open, looking a little to our right and just past us, as if reading a chart behind us: concentrating, with a small curious smile. The shoulders run off the bottom edge of the image; the head is centred, with clear background above it.
Keep {NAME} exactly as on the sheet: {KEEP}. Skin a warm light tan (about hex #C49A78), never orange.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No gradient, no texture. NO shadows of any kind.

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

---

### The props

#### O1. Ear, foot and scrape bits
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: nine small things in an invisible grid of 3 columns and 3 rows of equal cells, one thing per cell, centred, each filling about half of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: (1) a big blob of ear wax: a soft, rounded, glossy golden-yellow blob, like a little dab of honey-coloured clay, friendly and never gross; (2) the same kind of blob, medium-sized; (3) the same kind of blob, small.
Row 2, left to right: (4) one small, round, smooth, shiny brown seed; (5) one thin, straight wooden splinter; (6) one short, slightly thicker wooden splinter.
Row 3, left to right: (7) one single clear water drop, glossy, with a highlight; (8) a soft white paper tissue, loosely folded; (9) a thin, roughly round patch of dirt as after a fall in a playground: soft brown dust with a few tiny specks of grit, its edges soft and patchy, lying flat as if on skin, with nothing under it.
Each seen from the front, lit from the upper left.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### O2. Mouth bits
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: eight small things in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, each filling about half of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1, left to right: four small, soft, slightly raised round spots, like little glossy bumps, all exactly the same size and shape: (1) bright red, (2) bright yellow, (3) bright blue, (4) bright green.
Row 2, left to right: (5), (6) and (7): three small, jagged patches of tooth decay, dull brown-grey with uneven edges, each a different shape, each as if lying flat on a tooth; (8) a small, smooth, shiny white patch of tooth filling, rounded.
Each seen from the front, lit from the upper left. Friendly and clean, never gross.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### O3. The cotton bud and the ointment
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: four things in an invisible grid of 4 columns and 1 row of equal cells, one thing per cell, centred, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
(1) one single cotton bud lying flat and level, with plain white cotton tips and a pale wooden stick, like the buds in the attached care kit's pot, filling about 80% of its cell's width;
(2) the SAME cotton bud, at exactly the same size and position in its cell, with a dab of pale green soothing ointment on its right-hand tip;
(3) the SAME cotton bud, at exactly the same size and position in its cell, with a little golden-yellow ear wax on its right-hand tip;
(4) a small round open pot of pale green ointment, with no label, seen from the front and slightly above, standing on a flat base.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and care kit: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### R1. The comfort things and the heater
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: five things in an invisible grid of 3 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary; the last cell is left empty. Do not draw grid lines, borders or labels. Each is seen from the front and slightly above (a three-quarter view), lying flat or standing on a flat base, like the attached clinic things.
Row 1, left to right: (1) a soft blue gel ice pack, rectangular with rounded corners, a light frost on it, lying flat; (2) a hot-water bottle on its own, lying flat: a plain teal knitted cover with its cream rubber neck and stopper showing at the top (if a picture of a patient hugging one is attached, make it exactly that bottle; if not, draw it from these words); (3) a round hand fan of woven palm leaf with a short plain wooden handle, lying flat.
Row 2, left to right: (4) a small free-standing electric heater: a plain cream metal body with two horizontal heating bars across the front, standing on two small feet, switched OFF, the bars grey; (5) the SAME heater, at exactly the same size and position in its cell, switched ON, the bars glowing warm orange with a soft warm glow just around them; (6) empty.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and clinic things: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos, dials or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### R5. The live thermometer gauge
```
Generate an image, 1024×1536, portrait.

A big, friendly wall thermometer for a children's doctor game, on its own, seen exactly straight on: a tall clear glass tube with a round glass bulb at the bottom, completely EMPTY with no liquid inside, mounted on a plain white backing board with softly rounded corners. No markings, no scale lines, no numbers, no letters and no colours on the board. Centred, filling about 85% of the image height; the tube runs almost the full height of the board.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No wall, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and clinic things: a stylised 3D animated-feature-film look, semi-photoreal glass, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos, dials or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### R2. The ceiling fan, in two parts
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: a ceiling fan in two separate parts, in an invisible grid of 2 columns and 1 row of equal cells, one part per cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
(1) Left cell: the body of a ceiling fan, seen from the side at eye level and a little below: a long plain white downrod coming straight down from near the top of the cell, and a plain cream motor housing at its bottom. NO blades.
(2) Right cell: the fan's four blades with their round cream hub, seen from DIRECTLY BELOW, looking straight up, so the four blades form a perfect cross that fits exactly within an imaginary circle (draw no circle); plain pale wooden blades, all the same size, filling about 85% of the cell's height.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No ceiling, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and clinic things: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur, no motion blur.
```

#### R3. The exam room, with ceiling and floor (for tablets)
```
Generate an image, 1024×1024, square.

The attached picture is a room in a children's game. Draw EXACTLY the same room, from exactly the same camera and with the same light, but show more of it above and below. The whole attached picture fits across the full width of the square, in the middle, unchanged. Above it, the same plain cream wall continues up to a plain white ceiling with a simple narrow cornice and nothing on the ceiling. Below it, the same speckled terrazzo floor continues towards us, empty and clear, with speckles the same size as in the attached picture (not bigger as the floor comes nearer).
Nothing in the room moves, changes size, or is added or removed: the window, the medicine cabinet, the desk and everything on it, the plant, the bed and its paper roll, the step stool, the toys and the rug, and the door all stay exactly where they are. No people, no animals.

Do not add any text, letters, numbers, logos or watermarks. No outlines, no cel shading, no photorealism, no blur, no vignette.
```

#### R4. The exam room, the window open
```
Edit the attached picture. Change ONLY the window on the left: open it, so that its tall glass casement is swung inwards into the room at an angle and the sunny garden outside shows more clearly through the gap.
Everything else stays exactly the same: the walls, the medicine cabinet, the desk and everything on it, the plant, the bed and its paper roll, the step stool, the toys, the rug, the door, the light and the colours. Do not move, resize or crop anything. Do not add any people, animals, text, letters, numbers or logos.
Keep the picture exactly the same size and shape (aspect ratio) as the attached one.
Style: exactly as the attached picture: a stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C1. The eye chart, front-on
```
Generate an image, 1024×1536, portrait.

A blank picture board like an eye chart, for a children's doctor's room, on its own: a tall white board with softly rounded corners in a plain light-wood frame, seen exactly straight on, perfectly rectangular, centred, filling about 85% of the image height. At the very top of the board, one small friendly picture of an open eye. Below it, six EMPTY horizontal rows, each marked only by a thin pale-grey line along its bottom; the rows get a little less tall from the top row to the bottom row, like the rows of an eye chart. The rows are completely empty: no pictures, no letters, no numbers and no symbols in them. NO letters anywhere on the board.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No wall, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### C2. The eye chart, quarter-turned on a stand
```
Generate an image, 1024×1536, portrait.

Using the attached eye chart as the exact design, draw the same chart standing on a simple light-wood easel stand with three legs, turned about 30 degrees towards the left, so that it faces between us and someone sitting to its left: its left edge is a little further away, and so a little shorter, than its right edge. The same white board, the same frame, the same small eye picture at the top and the same six EMPTY rows, with no letters, numbers or pictures in them. Centred, filling about 85% of the image height, the stand's feet at the bottom.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no wall, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached chart and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### B1. The filling button and the filling nozzle
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's dentist game: four things in an invisible grid of 2 columns and 2 rows of equal cells, one thing per cell, centred, each filling about 60% of its cell, with clear background all round; nothing touches or crosses a cell boundary. Do not draw grid lines, borders or labels.
Row 1: (1) a big, round, friendly press button, bright blue, on a chunky white rounded base, seen from the front and a little above, UP; (2) the SAME button and base, at exactly the same size and position in its cell, pressed DOWN: the blue top sunk into the base and a little darker.
Row 2: (3) a dentist's filling nozzle: a slim white-and-steel pen shape like the attached dentist's drill handpiece, but with a short, thin steel tip instead of a drill, pointing down and to the left; (4) the SAME nozzle, at exactly the same size and position in its cell, squeezing a short, soft ribbon of white filling paste from its tip.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and care kit: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, symbols, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### D1. The drop machine
```
Generate an image, 1024×1536, portrait.

A friendly medicine drop machine for a children's doctor's clinic, on its own, seen from the front and slightly above, standing on a flat base: a white and pale-steel cabinet with FOUR tall clear glass tubes standing side by side on top. Each tube is filled with coloured liquid medicine, one colour per tube: red, yellow, blue and green, from left to right; the liquid is smooth and clear-coloured, with no balls, beads or sweets in it. At the bottom of each tube is a small steel drip spout, like a medicine dropper's tip, over a shared chute that funnels down to one small round opening at the bottom centre, where a drop can fall out. On the front, under each tube, is an empty round steel socket where a lever will go; draw NO levers. Centred, filling about 85% of the image height.
Clean, clinical and friendly: it must look like a medicine dispenser, not a sweet, gumball or jelly-bean machine. No balls, no glass dome, no coin slot, no turning handle, no stripes, no wrapped sweets.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached style anchor and clinic things: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

#### D2. The levers, the drops and the upright syringe
```
Generate an image, 1536×1024, landscape.

A sprite sheet for a children's doctor game: seven things in an invisible grid of 4 columns and 2 rows of equal cells, one thing per cell, centred, with clear background all round; nothing touches or crosses a cell boundary; the last cell is left empty. Do not draw grid lines, borders or labels. Each seen from the front and slightly above, matching the attached drop machine.
Row 1: (1) a short steel lever with a round white knob, pointing UP, on a small round steel mount; (2) the SAME lever and mount, at exactly the same size and position in its cell, pulled DOWN; (3) one single drop of liquid medicine in red, falling: a teardrop shape (round at the bottom, pointed at the top), matte and softly translucent like coloured syrup, never a glossy ball, bead or sweet; (4) the same drop in yellow.
Row 2: (5) the same drop in blue; (6) the same drop in green (all four drops exactly the same teardrop size and shape); (7) the attached syringe, standing upright, tip down, in a small white holder, its plunger taken out so that the clear barrel is open at the top and empty; (8) empty.

Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. No floor, no gradient, no texture. NO shadows of any kind.

Style: exactly as the attached machine and style anchor: a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.

Do not add any text, letters, numbers, labels, logos or watermarks. No needle. No outlines, no cel shading, no photorealism, no blur.
```

---

## 6. The paste block for Claude in Chrome

**Zafar:** open ChatGPT in Chrome, signed in, and open a new Claude in Chrome chat. Paste the block below and stay for part A (about 30–40 minutes: six character sheets to say ok to). Then you can leave it running. **Model:** Claude in Chrome's default. **Cost:** nothing beyond your ChatGPT plan. Expect image-limit waits; it picks up again on its own.

```
You're making 115 images in ChatGPT for a children's game called Nani jo Ghar, and uploading them to GitHub yourself. Zafar is here for part A only; after that you work on your own and he reads your log later.

THE PAGE
Open https://github.com/Baby-Isa/nani-jo-ghar/blob/ccr-fcd9dddd-wnywzc/docs/design-language/art-plans/clinic-heal-art-plan.md and read section 5, "The prompts", and its PEOPLE table. Every prompt there has an ID (S1, W1, K1, ...) and a grey code box with the words to paste. This message gives the run order and, for every prompt: what to attach, the name to log it under ("save as") and what to check.

REFERENCE IMAGES (download these first)
Open each link and click "Download raw file" (the download-arrow icon at the top right of the picture):
 1. style-anchor-v1.png        https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png
 2. char-clinic-girl-v1.png    https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/char-clinic-girl-v1.png
 3. char-clinic-boy-v1.png     https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/char-clinic-boy-v1.png
 4. char-clinic-oldman-v1.png  https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/char-clinic-oldman-v1.png
 5. char-clinic-oldwoman-v1.png https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/char-clinic-oldwoman-v1.png
 6. char-clinic-dad-baby-v1.png https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/char-clinic-dad-baby-v1.png
 7. char-clinic-lineup-v1.png  https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/char-clinic-lineup-v1.png
 8. char-ali-hurts-v1.png      https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/char-ali-hurts-v1.png
 9. cb2b-exam-bed-close-v1.png https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/clinic-v2/cb2b-exam-bed-close-v1.png
10. ci1-care-kit-v1.png        https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/clinic-v2/items/ci1-care-kit-v1.png
11. ci2-tools-comfort-v1.png   https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/clinic-v2/items/ci2-tools-comfort-v1.png

SAFETY RULES (always)
- Change no settings anywhere: no ChatGPT settings, model picker, memory, custom instructions, plan or upgrade offers; no Chrome settings or download folder; no GitHub settings.
- Sign nothing in or out. Delete no chats.
- Upload only the images this run makes and your log file, only to the folder below. Attach to ChatGPT only the files each prompt's line names.
- Never write a prompt of your own, and never reword, shorten or add to one. The only changes allowed: filling the {NAME}, {KEEP}, {LEGS} and {LIMB_WHO} slots from the PEOPLE table, and in part A one extra sentence Zafar dictates.
- If anything needs a decision from Zafar (a refusal, a login prompt, a payment or settings screen, a missing file, a question you can't answer from this message), log it, skip that prompt and anything that needs it, and carry on.
- Pace yourself: at most 3 images generating at once (3 ChatGPT chats); start the next one only when one of those has finished, and leave at least a minute between sends. A prompt that attaches "kept:X" waits until X has been downloaded.

HOW TO RUN EACH PROMPT
1. Start a fresh ChatGPT chat (never continue another prompt's chat).
2. Attach exactly the files on its line. "kept:X" means the image you kept and downloaded for prompt X (your log says which file that is). For an edit (a line that says "edit"), attach ONLY that one kept image, nothing else; an edit is always of a fresh picture, never of another edit.
3. Paste the text of its code box from the page, with the slots filled for that line's person, and send.
4. Judge the image against its check (the CHECKS list below) and then the PASS/FAIL LIST below, point by point. For an edit, compare it with the image you attached: if it looks identical, it fails; if anything other than what the prompt asks has moved, changed size or changed colour, it fails.
5. If it fails, redo it once: the same prompt in a fresh chat with the same attachments. If that fails too, you may try once more (at most 2 redos). Never send corrections like "make it smaller". Keep the best one, even if all fail, and note what's wrong.
6. Download the kept image with ChatGPT's own download button (never a screenshot), straight away. Make sure it's the NEW image, not one you attached.
7. Write its log line straight away (see THE LOG), then move on.

PART A: WITH ZAFAR (6 images; Zafar watches each one)
Before S1, say in this chat: "Starting the six character sheets. I'll stop after each one for your ok." For each sheet: when the image passes your own check, post "<ID> ready: <one line on how it looks>. Please look at the ChatGPT tab and reply ok, redo (and what to change), or skip." Then wait.
- ok: download it, log it, go to the next sheet.
- redo + his words: send the same prompt in a fresh chat with his words added as one last sentence; at most 2 redos per sheet.
- skip: log it; skip that sheet and every later prompt that attaches it.
- go: skip the remaining sheets now (and everything that attaches them), start part B, and log them as "waiting for Zafar".
- S1 (the girl) never times out: if Zafar hasn't replied, post a reminder in this chat every 10 minutes and keep waiting. Part B can't start without her sheet.
- S2 to S6: if Zafar hasn't replied within 15 minutes, treat it as "go": log that sheet and the ones after it as "waiting for Zafar" and start part B. On "resume", run those sheets first (with Zafar watching), then their people's lines.
Once part A is over, tell Zafar: "Part A done. I'll carry on alone; you can leave."

RUN ORDER. Line format: ID (person) | attach | save as | check
PART A (6)
S1 | style-anchor-v1.png, char-clinic-girl-v1.png, char-ali-hurts-v1.png | s1-girl-sheet-v2.png | SHEET + the girl as v1: two short plaits, white ribbons, yellow dress, white leggings, white sandals; about five
S2 | style-anchor-v1.png, char-clinic-boy-v1.png, char-ali-hurts-v1.png | s2-boy-sheet-v2.png | SHEET + the boy as v1: gap-toothed grin, red long-sleeved T-shirt, dark blue trousers; about six; not like the boy in orange
S3 | style-anchor-v1.png, char-clinic-oldman-v1.png, char-ali-hurts-v1.png | s3-oldman-sheet-v2.png | SHEET + the old man as v1: grey moustache, no beard, no cap, no glasses, blue kurta; no stick anywhere
S4 | style-anchor-v1.png, char-clinic-oldwoman-v1.png, char-ali-hurts-v1.png | s4-oldwoman-sheet-v2.png | SHEET + the old woman as v1: white headscarf covering hair, ears and neck in every panel, green shawl, cream kurta; no glasses; no red
S5 | style-anchor-v1.png, char-clinic-dad-baby-v1.png, char-clinic-lineup-v1.png | s5-man-sheet-v1.png | SHEET + the young father as in the line-up: short beard, white shirt, navy trousers; no baby anywhere; panel 6 is a forearm with the sleeve rolled to the elbow
S6 | style-anchor-v1.png, char-clinic-lineup-v1.png | s6-woman-sheet-v1.png | SHEET + a new woman, not like anyone in the line-up and not like a woman in a green dupatta and maroon kurta; dusty-blue headscarf covering hair, ears and neck in every panel; purple tunic; no jewellery

PART B: THE GIRL AND HER GAMES (37). Person: girl. Limb set: child.
girl-W1 | style-anchor-v1.png, kept:S1 | girl-w1-front-neutral-v1.png | W1
girl-W2 | edit: kept:girl-W1 | girl-w2-front-happy-v1.png | FACE
girl-W3 | edit: kept:girl-W1 | girl-w3-front-sad-v1.png | FACE
girl-W4 | edit: kept:girl-W1 | girl-w4-front-pain-v1.png | FACE
girl-W5 | edit: kept:girl-W1 | girl-w5-front-hot-v1.png | FACE
girl-W6 | edit: kept:girl-W1 | girl-w6-front-cold-v1.png | FACE
girl-W7 | style-anchor-v1.png, kept:S1 | girl-w7-side-neutral-v1.png | W7
girl-W8 | edit: kept:girl-W7 | girl-w8-side-happy-v1.png | FACE (compare with girl-W7)
girl-W9 | kept:girl-W1, kept:S1 | girl-w9-blanket-v1.png | W9
girl-W10 | kept:girl-W1, kept:S1 | girl-w10-bottle-v1.png | W10
child-K1 | style-anchor-v1.png, kept:S1 | child-k1-knee-v1.png | K1
child-K2 | kept:child-K1, kept:S1 | child-k2-knee-kick-v1.png | K2
child-K3 | edit: kept:child-K1 | child-k3-knee-graze-v1.png | K3
child-F1 | style-anchor-v1.png, kept:S1 | child-f1-forearm-v1.png | F1
child-F2 | edit: kept:child-F1 | child-f2-forearm-graze-v1.png | F2
child-F4 | edit: kept:child-F1 | child-f4-forearm-cut-v1.png | F4
child-U1 | style-anchor-v1.png, kept:S1 | child-u1-upperarm-v1.png | U1
child-P1 | style-anchor-v1.png, kept:S1 | child-p1-sole-v1.png | P1
girl-E1 | style-anchor-v1.png, kept:S1 | girl-e1-ear-v1.png | E1
girl-M1 | style-anchor-v1.png, kept:S1 | girl-m1-mouth-v1.png | M1
girl-M2 | style-anchor-v1.png, kept:S1 | girl-m2-tongue-v1.png | M2
girl-Y1 | style-anchor-v1.png, kept:S1 | girl-y1-eyes-v1.png | Y1
girl-Y2 | edit: kept:girl-Y1 | girl-y2-eye-sore-v1.png | Y2
girl-Y3 | edit: kept:girl-Y1 | girl-y3-eyes-closed-v1.png | Y3
girl-T1 | style-anchor-v1.png, kept:S1 | girl-t1-eyetest-a-v1.png | T1
girl-T2 | style-anchor-v1.png, kept:S1 | girl-t2-eyetest-b-v1.png | T2
O1 | style-anchor-v1.png | o1-ear-foot-bits-v1.png | O1
O2 | style-anchor-v1.png | o2-mouth-bits-v1.png | O2
O3 | style-anchor-v1.png, ci1-care-kit-v1.png | o3-bud-ointment-v1.png | O3
R3 | cb2b-exam-bed-close-v1.png | r3-exam-room-square-v1.png | R3
R4 | edit: cb2b-exam-bed-close-v1.png | r4-exam-window-open-v1.png | R4
R1 | style-anchor-v1.png, ci2-tools-comfort-v1.png, kept:girl-W10 (leave it out if girl-W10 was skipped) | r1-fever-things-v1.png | R1
R5 | style-anchor-v1.png, ci2-tools-comfort-v1.png | r5-thermo-gauge-v1.png | R5
R2 | style-anchor-v1.png, ci2-tools-comfort-v1.png | r2-ceiling-fan-v1.png | R2
C1 | style-anchor-v1.png | c1-eye-chart-front-v1.png | C1
C2 | style-anchor-v1.png, kept:C1 | c2-eye-chart-turned-v1.png | C2
B1 | style-anchor-v1.png, ci1-care-kit-v1.png | b1-filling-button-v1.png | B1
Then upload part B (see UPLOADING).

PART C: THE OTHER PATIENTS (70). For each person, run these lines with that person's prefix and sheet:
 <p>-W1 | style-anchor-v1.png, kept:<sheet> | <p>-w1-front-neutral-v1.png | W1
 <p>-W2 to <p>-W6 | edit: kept:<p>-W1 | <p>-w2-front-happy-v1.png, <p>-w3-front-sad-v1.png, <p>-w4-front-pain-v1.png, <p>-w5-front-hot-v1.png, <p>-w6-front-cold-v1.png | FACE
 <p>-W7 | style-anchor-v1.png, kept:<sheet> | <p>-w7-side-neutral-v1.png | W7
 <p>-W8 | edit: kept:<p>-W7 | <p>-w8-side-happy-v1.png | FACE (compare with <p>-W7)
 <p>-W9 | kept:<p>-W1, kept:<sheet> | <p>-w9-blanket-v1.png | W9
 <p>-W10 | kept:<p>-W1, kept:<sheet> | <p>-w10-bottle-v1.png | W10
 <p>-<head prompt> | style-anchor-v1.png, kept:<sheet> | <p>-<id>-<name>-v1.png, named like the girl's (e1-ear, m1-mouth, m2-tongue, y1-eyes, t1-eyetest-a, t2-eyetest-b) | the same check ID
 <p>-Y2, <p>-Y3 | edit: kept:<p>-Y1 | <p>-y2-eye-sore-v1.png, <p>-y3-eyes-closed-v1.png | Y2, Y3
People, in this order:
 boy (sheet S2): W1 to W10, then E1, M1 (12 images)
 oldman (sheet S3): W1 to W10, then Y1, Y2, Y3, T1, T2 (15)
 oldwoman (sheet S4): W1 to W10, then Y1, Y2, Y3, T1, T2 (15)
 man (sheet S5): W1 to W10, then M1 (11)
 woman (sheet S6): W1 to W6, W9, W10 (no W7, no W8), then M2 (9)
Then the adult limbs. Limb set: adult; sheet S5:
 adult-K1 | style-anchor-v1.png, kept:S5 | adult-k1-knee-v1.png | K1
 adult-K2 | kept:adult-K1, kept:S5 | adult-k2-knee-kick-v1.png | K2
 adult-K3 | edit: kept:adult-K1 | adult-k3-knee-graze-v1.png | K3
 adult-F1 | style-anchor-v1.png, kept:S5 | adult-f1-forearm-v1.png | F1
 adult-F2 | edit: kept:adult-F1 | adult-f2-forearm-graze-v1.png | F2
 adult-F4 | edit: kept:adult-F1 | adult-f4-forearm-cut-v1.png | F4
 adult-U1 | style-anchor-v1.png, kept:S5 | adult-u1-upperarm-v1.png | U1
 adult-P1 | style-anchor-v1.png, kept:S5 | adult-p1-sole-v1.png | P1
If a person's sheet was skipped in part A, skip all of that person's lines (and the adult limbs if S5 was skipped), and log it.
Then upload part C.

PART D: THE DROP MACHINE (2)
D1 | style-anchor-v1.png, ci2-tools-comfort-v1.png | d1-drop-machine-v1.png | D1
D2 | style-anchor-v1.png, ci2-tools-comfort-v1.png, kept:D1 | d2-levers-drops-v1.png | D2
Then upload part D.

CHECKS (by check ID)
SHEET: eight panels in two rows of four, nothing touching, no borders or labels · the same person in every panel · panel 1 sitting front-on, thighs level, feet flat on one level · panel 2 exactly side-on facing right · panel 4 side-on head (the whole ear shows, unless a headscarf covers it) · panel 5 happy · panel 7 the sole of a bare foot, toes up · skin a warm light tan, not orange, pink or grey · no bed, bench or chair drawn
W1: the same person as their sheet · front-on, facing us · thighs level, both feet flat at one level · hands on the lap, neutral face, mouth closed · fills about 85% of the height, touches no edge · no bed or stool drawn
FACE: only the face changed (body, hands, clothes, hair, size and position identical to the original) · the expression asked for, readable at thumbnail size · nothing upsetting, no tears, sweat drops or symbols
W7: exactly side-on, facing right · legs as the prompt says (child: hanging free; adult: feet flat on an invisible floor) · the same person · touches no edge
W9: the same person, size and framing as the attached front picture · a plain deep-red blanket round the shoulders, held at the chest · legs and feet in the same place as in the front picture · a cosy, relieved face · touches no edge
W10: the same person, size and framing as the attached front picture · a teal knitted hot-water bottle hugged against the tummy · legs and feet in the same place as in the front picture · a comforted face · touches no edge
K1: three-quarter side view of a knee · plain white cloth rolled just above the knee · the thigh enters from the left edge, the shin leaves the bottom edge, no foot · the knee about half the height · clean skin, no marks
K2: the same framing as the attached K1: thigh in from the left, the knee at the same size and place · the shin kicked forward to the right · no foot, no motion lines
K3: one gentle pink graze on the kneecap, no blood · nothing else changed
F1: the forearm held out palm down, in from the left edge · white sleeve rolled below the elbow · the whole hand inside the image, five fingers · clean skin
F2: one gentle pink graze mid-forearm, no blood · nothing else changed
F4: one short, thin pink line, no blood, nothing open · nothing else changed
U1: a bare upper arm, sleeve pushed up to the shoulder · the arm leaves the bottom edge · clean skin
P1: the sole straight on, toes at the top · five separate toes · smooth and clean, no lines or marks · the leg leaves the bottom edge
E1: exactly side-on, facing right · a big, clean ear a little left of centre, its opening visible · head off the top and right edges, neck off the bottom
M1: mouth wide open, top and bottom teeth clear, white and healthy · the cheeks run off the left and right edges
M2: tongue out and down, plain pink, no spots · the cheeks run off the left and right edges
Y1: both eyes open, clear, looking at us · the head runs off the left and right edges
Y2: only the eye on the viewer's right is sore (pink) · the other eye unchanged · no tears
Y3: both eyes gently closed · nothing else changed
T1: head and shoulders front-on, the shoulders running off the bottom edge · one hand covering the eye on the viewer's right · the other eye looking a little to our right, past us · five fingers
T2: waist up, exactly side-on facing right, the body running off the bottom edge · looking ahead and slightly up · hands on the lap
O1: nine things in a 3 by 3 grid, in order: three wax blobs (big, medium, small; friendly, not gross), a seed, two splinters, one clear drop, a tissue, a soft patch of dust and grit (no blood)
O2: four round spots, the same size, in red, yellow, blue and green; three jagged decay patches; one white filling patch
O3: the same bud three times at the same size and place (plain, green ointment, wax), then a pot of green ointment with no label
R3: the original room unchanged across the middle (window, cabinet, desk, bed, stool, toys, door all in place) · a plain ceiling above with nothing on it · empty terrazzo floor below, its speckles the same size as the original's · no visible seams
R4: only the window changed and it reads as open · everything else identical
R1: five things in order: ice pack, the teal hot-water bottle, a woven hand fan, the heater off, the same heater on (glowing bars); the last cell empty · no dials or numbers anywhere
R5: one tall empty glass thermometer on a plain white board, straight on · no markings, scale, numbers or liquid
R2: left, the fan body (downrod and motor) with no blades · right, four blades seen from directly below, a perfect cross fitting an imaginary circle, no circle drawn
C1: a straight-on blank white picture board like an eye chart, one small eye picture at the top, six EMPTY rows getting less tall · NO letters, numbers or pictures in the rows
C2: the same chart on a three-legged stand, turned about 30 degrees to the left (left edge further away) · rows still empty, no letters
B1: blue button up and the same button down, same place · nozzle idle and the same nozzle squeezing white paste, same place · no symbols
D1: a white and steel machine, four tall tubes of red, yellow, blue and green LIQUID (no balls or beads), a drip spout under each, a chute to one opening at the bottom, empty lever sockets, no levers · looks like a medicine dispenser, not a sweet, gumball or jelly-bean machine
D2: lever up and the same lever down · four identical TEARDROP-shaped drops, matte and softly see-through, in red, yellow, blue and green, never glossy balls · the syringe upright, open at the top, empty, no needle · last cell empty

PASS/FAIL LIST (every image; any one of these is a fail)
- Any text, letters, numbers, labels or logos, even fake or blurry ones (tick marks with no digits are fine).
- Outlines, cel shading, a flat vector look, painterly brushwork or photorealism; blur, a vignette or lens flare.
- The background isn't one flat mid-grey (R3 and R4 excepted); there's a floor, a surface or a shadow on the grey; grid lines, panel borders or labels.
- Things touching or crossing into a neighbour's cell, or touching an image edge, unless the check says a limb, head or body runs off that edge (R3 and R4 fill the whole image).
- The wrong number of things, things in the wrong order, or extra objects, people or animals.
- Hands: not five fingers on each visible hand, fused or extra fingers. Feet: not five toes where a sole shows.
- A person who doesn't match their sheet (face, hair, headscarf, beard, clothes, colours), or looks older or younger than the sheet.
- Skin that is orange, pink, grey or very pale instead of a warm light tan.
- Immodest clothes (bare shoulders on a woman, short or tight clothes), or any religious marker (bindi, tilak, sindoor, deities, temple items).
- Anything scary, bloody, gory or gross, or a face a small child would find upsetting; real distress instead of a mild, comic wince.
- Anything that looks like sweets, lollies, jelly beans, gumballs or a sweet machine; medicine drops drawn as glossy balls.
- An edit that looks identical to the original, or where something other than what was asked moved, changed size or changed colour.
- Light from anywhere but the upper left; a second light; "seen exactly side-on" or "from directly below" drawn at an angle; circles drawn as ovals where "straight on" or "from directly below" was asked.

THE LOG
Keep one running log. If you can, save it as art-run-log.txt in Downloads and add each line as you go; if not, post each line in this chat as you write it, and after every 5 images (and before every image-limit wait) post the whole log so far as one block.
One line per downloaded image:
 <ID> | <time> | <the downloaded file's name exactly as saved> | save as <the save-as name> | PASS or FAIL (<which points failed>) | redos: 0/1/2 | Zafar: ok / redo / skipped / not asked | <notes>
Also log every skipped prompt (and why), every image-limit message with its time, and anything odd (a refusal, an error, a duplicate download, a missing attachment).

IMAGE LIMITS
If ChatGPT says you've hit the image limit, log the time and its exact words. Wait until the time it gives (or check about every 30 minutes), then carry on from the same prompt. Don't stop the run and don't switch to another tool.

UPLOADING (after each part)
Open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/clinic-heal-v3 and drag in that part's downloaded images (only the ones you kept) and your log file so far, saved as art-run-log-partA.txt, -partB.txt, -partC.txt or -partD.txt (if you kept the log in this chat, save it to a text file first; if you can't, paste it into the commit description instead). Rename nothing. Choose "Commit directly to the main branch", commit message "Clinic heal v3 art, part <A/B/C/D> (ChatGPT, <n> images)", click "Commit changes", then check the folder page lists the new files. Part A's sheets go up with part B's upload.

RESUMING
If this message is pasted again later with the word "resume", open the folder above, read the art-run-log-part*.txt files there, download any kept image a later prompt needs from that folder, and carry on from the first prompt that isn't logged as kept. Sheets logged "waiting for Zafar" come first, run the part A way (he watches each one).

AT THE END
Post the full log, then a short list per part: passed, failed (and why) and skipped (and why).
```

**What happens next (Claude):** the uploads are matched to the prompts through the log (then the picture), renamed to the save-as names in `sources/art/clinic-heal-v3/`, cut, and reviewed by someone other than the builder (D25, C4) before Zafar sees anything (section 8).

---

## 7. Judging (D25)

**At generation:** the runner judges each image against its check and the pass/fail list in the block, with at most 2 redos (section 6).

**After upload, Claude judges again, more strictly, before anything is wired or shown to Zafar:**
1. **Contact sheets** on a black and a white backing, and on the game's cream, at ×2 zoom: clean alpha, no grey fringe or holes (glass, the eye drop, the medicine drops and liquid, the gauge's tube and the syringe barrel keep partial alpha, never a hard key), and a 16 px pad (art-pipeline §3 rows 1–13).
2. **Skin:** sample the cheek and forearm midtone of every person and limb against `#C49A78`. More than ΔE 6 away is colour-corrected (a hue and lightness shift on the skin mask only); more than ΔE 12 is a fail and a redo.
3. **Registration** (D8): every edit is ECC-registered to its original; after a 7×7 open, the diff outside the allowed region (the head for FACE, the lower leg for K2, the graze for K3, F2 and F4, the eye for Y2 and Y3; W9, W10 and K2 are fresh prompts, registered on the legs or the thigh instead) must stay under 1.5% (the `build/expressions.py` method, art-pipeline §10). Over that, it's a redo.
4. **Character consistency** (art-pipeline §3 row 10): every W and every head close-up side by side with its sheet.
5. **The overlay test** (D5): the girl's W1 and W7 placed on CB2b and on R3 at the scene-data positions, with the doctor stand-in, at laptop 1366×768, phone 844×390 and tablet 1180×820. Check the size against the bed and stool, nothing hidden behind the sidebar, and the fan, heater, gauge and window inside every crop.
6. **The match-cut test:** only the close-ups that match-cut: **K (knee) and E (ear) from W7; M1, M2, Y and T1 from W1.** Each is laid over its wide pose zoomed to the part's anchor, and the part's place and size must agree within about 5%. **F, U, P and T2 hard-cut at the zoom's peak** (the pose or angle changes, so a match isn't possible), and they aren't tested for a match: only that the cut lands at the peak with the part centred.
7. **Culture and tone** (I1, I2, H26): modest clothes, no markers, nothing gory, the drop machine reads as medicine.

Failures go back into a short follow-up block, never to Zafar.

---

## 8. Cut and wire

**The cut script:** a new `build/cut_clinic_heal_v3.py` on `build/cut_tick_v2.py`'s method (D7):
- the background is measured from the image edges (the median of the outer 6 px);
- the object is everything not connected to that flat background, with holes filled;
- edges use colour-to-alpha against the measured grey, with a solid eroded core;
- the largest piece is kept, except multi-part things (hair ribbons, the stethoscope-style parts), where every piece over 400 px is kept;
- no key ever touches glass or glow (D22).

Registered states share one canvas (the union of their boxes, D8). Sprites are trimmed with a 16 px pad, except on **exit edges**, which stay flush at the image edge and are recorded in the data. Exports are WebP at q90 (q92 for heads and faces), with `@2x` beside each where section 2.2 asks for it (`Stage.art()` picks it up through `njgV`, B7; list each path in `Stage.has2x`). Every URL in code goes through `njgV()`. The sources stay in `sources/art/clinic-heal-v3/`.

**New data:** `data/clinic/heal-art.json` (owned by the cut session):
- per patient kind: the wide poses, face layers, head crops and extras;
- each wide pose's **zoom anchors** (knee, forearm, upper arm, ear, mouth, eyes, forehead, foot) and part boxes, in its own canvas fractions;
- per close-up: the file, states, the part's box (for the match cut), its exit edges and its fabric mask;
- the overlays and room things with their positions.

The game code reads it in the finishing sessions (F2/F3); the cut session only writes art and this data file.

| Images | Cut | Output (in `assets/clinic/`) | Used by |
|---|---|---|---|
| S1–S6 | Not cut (references) | Stay in `sources/art/clinic-heal-v3/` | Every later prompt |
| W1 | Figure cut; trimmed to the canvas shared with W2–W6, W9, W10; the seat line and feet line recorded | `patients/<kind>/<kind>-front.webp` + `@2x` | Diagnosis (`scenes-v2.json` `exam.fig`); every front-on zoom; fever room |
| W2–W6 | ECC to W1 (head band); head-region mask, feathered at the collar | `patients/<kind>/<kind>-face-{happy,sad,pain,hot,cold}.webp` + `@2x` (on W1's canvas) | Wide-shot reactions; fever hot/cold alternation; the zoom-out "thank you" (happy) |
| W1–W6 | Square head-and-shoulders crop, eye line at 42% from the top, face width fixed across all kinds (D18) | `patients/<kind>/<kind>-head-{neutral,happy,sad,pain,hot,cold}.webp` (512 px) | The corner face in every close-up; the send-off thought bubble (H33) |
| W7, W8 | W7 as W1; W8 a head layer on W7's canvas | `patients/<kind>/<kind>-side.webp`, `<kind>-side-face-happy.webp` + `@2x` | Side-on zooms: knee, ear, eye test B (`scenes-v2.json` new `exam.side`: seat x 0.70, y 0.535; doctor x 0.86) |
| W9, W10 | Fresh prompts; ECC to W1 on the legs and feet band; whole figure on W1's canvas (more than about 2% drift at the seat or feet is a redo) | `patients/<kind>/<kind>-front-blanket.webp`, `<kind>-front-bottle.webp` + `@2x` | Fever (warm steps); the send-off |
| K1–K3 (child, adult) | One registered canvas; exit edges left and bottom; fabric mask from the white cloth | `closeups/<set>/knee{,-kick,-graze}.webp` + `@2x`; `knee-fabric.webp` | `heal/knee.json` (hammer kick K2, registered to K1 on the thigh; wrap on K1); `heal/cut.json` scrape on the knee (O1's dirt over K3, wiped away by the wash; plasters on K3) |
| F1, F2, F4 | As K; exit edge left | `closeups/<set>/forearm{,-graze,-cut}.webp` + `@2x`; `forearm-fabric.webp` | `heal/cut.json`: scrape on the arm (O1's dirt over F2, washed away), the cut (F4, stitches in code) |
| U1 | Exit edges left and bottom | `closeups/<set>/upperarm.webp` + `@2x`; `upperarm-fabric.webp` | `heal/boing.json` (the jab; the existing plaster sprite) |
| P1 | Exit edge bottom | `closeups/<set>/sole.webp` + `@2x`; `sole-fabric.webp` | `heal/foot.json` (channels and splinters in code; the toes' positions recorded for L3) |
| E1 | Exit edges top, right and bottom | `closeups/<kind>/ear.webp` + `@2x`; the canal point recorded | `heal/ear.json` |
| M1, M2 | Exit edges left and right (and top or bottom where they touch) | `closeups/<kind>/mouth.webp`, `tongue.webp` + `@2x`; tooth boxes and the tongue area recorded | `heal/tooth.json`; `heal/taste.json` (the sore spots) |
| Y1–Y3 | One registered canvas; exit edges left and right | `closeups/<kind>/eyes{,-sore,-closed}.webp` + `@2x`; eye centres recorded | `heal/eye.json` (drops) |
| T1, T2 | Exit edge bottom | `closeups/<kind>/eyetest-a.webp`, `eyetest-b.webp` + `@2x` | `heal/eye.json` (versions A and B, both prototyped per D15h) |
| O1 | Grid cut by gutters (the pantry method); the drop keeps partial alpha | `heal-v3/wax-{big,mid,small}.webp`, `seed.webp`, `splinter-{thin,thick}.webp`, `drop.webp`, `tissue.webp`, `dirt.webp` (partial alpha at its edges) | `ear.json`, `foot.json`, `eye.json`, `cut.json` (the dirt over K3 and F2) |
| O2 | As O1 | `heal-v3/spot-{red,yellow,blue,green}.webp`, `decay-{1,2,3}.webp`, `filling-patch.webp` | `taste.json`, `tooth.json` |
| O3 | Buds on one registered canvas | `heal-v3/bud{,-ointment,-wax}.webp`, `ointment-pot.webp` | `taste.json` (*malam*), `ear.json` (the wipe) |
| R3 | Register R3's middle to CB2b (ECC); keep CB2b's pixels; take only the bands, upscaled by Real-ESRGAN to the original's scale; feather the seam over 24 px | `rooms/bg-clinic-exam-cb2b-sq-v1.webp` (1536×1536) + `@2x` | Every exam scene (`scenes-v2.json` `rooms.exam.src`, its `need` and `ay` remeasured; a per-room size in `layout.json` `stage.scenes`, which is a code change for F2) |
| R4 | Diff against CB2b (art-pipeline 9d); keep the changed blob; offset +256 px on the square room | `room-items/window-open.webp` + `@2x` | `heal/fever.json` (the window, big cool step) |
| R1 | Grid cut; heater off and on registered | `room-items/{ice-pack,hot-water-bottle,hand-fan,heater-off,heater-on}.webp` | `heal/fever.json` (positions in section 3.4) |
| R5 | Cut; the glass at partial alpha; the tube's inner box recorded for the code's level and green zone | `room-items/thermo-gauge.webp` + `@2x` | `heal/fever.json` (the live reading) |
| R2 | Two cuts; the blades' hub centre recorded (the pivot) | `room-items/fan-body.webp`, `fan-blades.webp` | `heal/fever.json` (ceiling fan, medium cool step; spin and tilt in code) |
| C1, C2 | Cut; C2's four board corners and both charts' row boxes recorded | `heal-v3/eye-chart-front.webp`, `eye-chart-turned.webp` + `@2x` | `heal/eye.json` (row pictures are Cook's `icon-<id>.webp`, placed by code) |
| B1 | Pairs registered | `heal-v3/filling-button-{up,down}.webp`, `filling-nozzle{,-paste}.webp` | `heal/tooth.json` (the fill; the gauge is code) |
| D1 | Cut; tube, socket and chute-opening positions recorded | `heal-v3/drop-machine.webp` + `@2x` | `heal/boing.json` |
| D2 | Levers registered; the syringe split into the barrel's back and its clear front (partial alpha) | `heal-v3/lever-{up,down}.webp`, `drop-{red,yellow,blue,green}.webp`, `syringe-upright-{back,front}.webp` | `heal/boing.json` |

**Regression rows the cut-and-wire and finishing sessions recheck:**
- clinic art: CLN-01, CLN-08, CLN-17, CLN-23, CLN-37, CLN-40, CLN-43, CLN-47, CLN-50, CLN-58, CLN-61;
- art: ART-01 to ART-12 (`docs/process/regressions.md`);
- the QA checklist's ART-01 to ART-11 (ART-12 and ART-13 don't apply).

---

## 9. Estimate

| | |
|---|---|
| **Images** | **115** (6 + 37 + 70 + 2). With redos at roughly a quarter, expect about 140 generations |
| **Zafar's time** | About 5 minutes to set up and paste; 30–40 minutes watching part A (six sheets, about 3 minutes each with his look, plus any redos); then nothing until he plays the result. If he can only stay for S1, he types **go** and the other five sheets wait for a second short sitting |
| **Run time** | At about 1 image a minute and 3 at once: part B 1–1.5 hours and part C 2–3 hours of generation. Image-limit waits probably stretch the whole run across an evening and a night. Part B is first, so the girl's art is in by the morning even if part C runs on |
| **When** | As soon as this page is pushed (the block reads it from the branch `ccr-fcd9dddd-wnywzc`; once it's merged, the link can point at `main`) and Zafar has 40 minutes, ideally the evening of 2 Oct. Part B cut and reviewed on 3 Oct, so F2/F3 can wire the girl's games 4–6 Oct; parts C and D cut by 5 Oct; leaving 3–4 days before the ~9 Oct visit |
| **Claude's cut-and-review session** | One session after each upload. **Top model, high effort** (judging art is visual work, rule 15): about 2–3M tokens for part B (the cut script, the girl's cuts, the overlay and match-cut tests) and 2M for parts C and D. The script could be written by a mid-tier model, but one owner is simpler, and the review must be someone other than the builder (D25) |
| **Paid API** | None. This doesn't qualify as a rapid prototype (non-negotiable 13) |

---

## 10. Questions for Zafar (answer "yes to all except …")

1. **Order:** the fever-room things, the eye chart and the filling button go straight after the girl (part B), before the other patients, because her games need them for the visit. *Recommend yes.*
2. **Who gets which close-up** (the table in section 3.2): the girl gets all nine games; the boy adds the ear and the mouth; the old man and the old woman get the eyes and the eye tests; the man gets the mouth; the woman gets the tongue. Child and adult limbs are shared and tinted to each patient's clothes. **For modesty, the old woman and the woman get no knee, arm or jab games, and no ear game (their headscarves cover their ears):** they get the eyes or tongue, the foot and the fever. This is a data change in `pipeline.json`. *Recommend yes.*
3. **Sharpness on tablets:** ChatGPT stops at 1536 px, so the close-ups' @2x versions come from a free upscaler (Real-ESRGAN) in the cut step. The wide poses don't need it. *Recommend yes.*
4. **The exam room gets a taller, square version** (R3: more ceiling and floor, the original kept pixel for pixel in the middle). On a tablet the whole room then shows, the window and door included, and the ceiling fan has a ceiling. Every exam scene uses it, the diagnosis too. *Recommend yes.*
5. **The doctor** stands in every wide shot but isn't in this batch: his sheet comes from his photos, with you watching. *Recommend: add his first sheet to part A when you have the photos; I'll write that prompt then.*
6. **Nana, Ma and Ali as patients** keep their existing sitting poses and feelings this time; no side-on poses or face swaps on the body, and the data gives them only limb, foot and fever games until they have head close-ups. Adding those later is about 24 images. *Recommend yes, for now.*
7. **The ice pack:** your sizes are window big, ceiling fan medium and hand fan small, so the ice pack is drawn as a spare (one cell) and the game decides later whether it's in. *Recommend yes.*
8. **The woman's look** (new): a dusty-blue headscarf and a purple tunic, so she can't be confused with Ma, the old woman or the older cousin. You'll see her sheet in part A. *Recommend yes.*
9. **The drop machine's drops:** each tube holds coloured liquid medicine with a drip spout, and a pulled lever lets fall one **teardrop-shaped, matte, see-through drop**, never a glossy ball, so it can't read as a gumball or jelly-bean machine (I2, decision 27). Shapes (your "maybe shapes") stay out until Mum has the words. *Recommend yes.*
