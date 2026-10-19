# s08-w5b-clinic

Branch `worktree-agent-a2338681d97f9f59b`, commit `d915b4c5`. Sandbox run `s08-w5b-quick`. Game code changed: fever, eye, foot, taste, knee, kit.js (shadows), pipeline.js (one fallback), main.js (a lab page's parked game).

## After the orchestrator's look (19 Oct)

| Point | Change | Shot |
|---|---|---|
| Foot seams | each segment is the straight block alone, under its own soft round-ended mask; no elbow or end pieces; one block stretched over the longest segment (no repeat seam); the welts masked by the photo sole's own alpha, so the open ends stop at the foot's edge | foot-L3-welts-x2.png, foot-L2-welts-x2.png, foot-L2/L3-filmstrip.png |
| Load check | `-sm` copies (300, 300, 280, 250 px wide) of the bud, flat thermometer, paper fan and bottle, downscaled from the s08b cuts, in the manifests; `main.js` plays a lab page's parked game on its parked ailments (clinic:cut); 29/29 | |
| Eye 800x360 | the wall box 406, -36, 350 x 525: the board's frame ends above the pills | eye-L2-800x360-pills-clear.png |
| Fever sweat | the W5 hot face has its own clear sweat; the code's blue drops (stand-in) are drawn only without the art | |

## What was built

Mechanics changed (each on Zafar's word, 18-19 Oct): fever's "just right" waits 2 s with no tap and the round has an ending; the eye has one chart for every level (the level picks the rows read: L1-L3 three, L4 four) and from L2 a count for each eye; the foot's wash clears only the dirt the water passes (each press is one jug); the scrape is parked.

| Row | Change | Files |
|---|---|---|
| CLN-175 | TH1 flat in the strip; TH1 mouth view on her art's own canvas, its tip on her mouth's middle as measured on each face, talk and blink picture and the blanket and bottle bodies (`art.mouth.at`), placed again by a watch on her pictures | fever.js, fever.json |
| CLN-105 | FN1 fan seen from in front and below (still / spin) hung from the picture's top; the FV1 things on the bed (left the red fleece; right the bottle and the paper fan), each at its own shape, with a soft contact shadow; the paper fan in her hand is the same picture | fever.js, fever.json |
| CLN-176 | in the green, "just right" only after `settleMs` 2000 with no tap; any tap restarts it | fever.js |
| CLN-177 | the hot icon is a red drop; the snowflake stays | fever.js |
| CLN-178 | the last "just right": the reading settles mid-green, the thermometer's screen lights green, she smiles and says the clinic's "Thank you, I feel better!" (to record), then the results with their go-on | fever.js |
| CLN-186 | the re-cut bottle (sheets-v3 use-down, clipped at its nozzle; tool-v3 in the strip); DP3's photo drop hangs, falls and splashes | eye.js, eye.json |
| CLN-187 | from L2 two card rows (right eye, left eye: the engine's side + eye + drops + count), taps on either eye, a count badge beside each, the card's light on the eye still short; both rows judged at the eye-test button | eye.js |
| CLN-188 | EC1 wall from x 406 (the board clears her corner face), rows 1-2-3-4 on the research fractions, no eye, no lines, no outlines; "now" a pale amber band, judged a gold tick in the margin; the eye-test button's icon lost its eye | eye.js, eye.json |
| CLN-189 | limu = `lemon-whole-s08b`; colour classes in `eye.json chart_colours`, measured by `build/heal_colour.py`, tested by `build/test_shared_heal_chart.mjs` (the half lemon is its red case) | eye.js, eye.json, 2 new build files |
| CLN-190 | the scrape's wash: the jug picked tilts over the finger, clear water, only the dirt within 44 units washes off; a press on a splinter already washed clean takes hold (L2+) | foot.js |
| CLN-191 | the strip's photo plaster on each spot | foot.js |
| CLN-192 | `sole-v3-s08b` (leg off the bottom edge), same registration | foot.json |
| CLN-193 | SP1 straight block repeated, elbow at each turn, closed end at the spot, each turned (and flipped) so its light stays upper left; a feathered mask shows the red core (`welt` 0.48); splinter picture under the see-through welt; it flies off as itself | foot.js, foot.json |
| CLN-194 | a touch on the edge: the foot group shakes 360 ms (not with reduced motion), a soft red radial glow, "ow" | foot.js |
| CLN-195 | the clean bud; its right swab tinted (multiply) with the colour of the spot it touched; the bud stays 700 ms after a dab | taste.js, taste.json |
| CLN-196 | TS1 clear glass, no shadow ellipse; the drink's body drawn behind the glass from the measured inside, its surface on top; the shared pour lands on the surface | taste.js, taste.json |
| CLN-179 | BD1 tile as a base pattern, one slice per curve step turned to the curve and as wide as the band there; each turn runs 16% past both dots, the leg's mask trims it | knee.js, knee.json |
| CLN-172 | `scrape` and `cut` moved to `parked`; sessions 1-2 now knee-bump / knee-bump + seed-in-ear; `cut` out of the games lists; `build/test_shared_clinic_parked.mjs` | pipeline.json, pipeline.js (fallback) |
| CLN-162 | `Kit.contactShadows`: a seated patient's pictures (patients.<kind>.front / blanket / bottle) cast none under her feet; standing ones keep theirs | kit.js |

Art registrations went in each game's own json (`art`, `assets`), as the other games do, not in heal-art.json.

## Evidence (build/screenshots/s08-w5b/, PNG)

fever-L1/L2/L3-filmstrip.png, fever-mouth-every-face-x3.png, eye-chart-L1-L3.png (1366 and 800x360), eye-L1-L3-filmstrips.png, foot-L1/L2/L3-filmstrip.png, foot-L3-welts-x2.png, taste-L3-blue-spot.png, taste-L3-blue-bud-x2.png, taste-L3-filmstrip.png, taste-glass-x2.png, knee-L3-eight-wraps.png, knee-L3-eight-wraps-x2.png, cln162-fever-feet-x2.png, cln162-diagnosis.png, cln162-diagnosis-feet.png, s08b-art-used.png. The raw frames: build/screenshots/s08-w5b/run/.

## Words the engine can't say yet (grey, to record)

"left" (`a.left`: the card shows *Left akh*, while right is *Jamni akh*), "drops", "Thank you, I feel better!" (now said at fever's end too).

## Proof (from the run; do not retype)
- **Pages run:** 7 (flow x size): 7 flows at 1366x768. 7 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 63 of 63 states, in `build/screenshots/sandbox/s08-w5b-quick` (not committed, B19). Contact sheets: `build/screenshots/sandbox/s08-w5b-quick/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (0 known, 0 fixed). Findings in the run: 0 (none).
- **Sound:** 47 lines with no family clip, 2 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/s08-w5b-quick vs build/tools/review/approved-shots.json: 161 shots, 68 changed, 26 new, 1145 gone, 13 identical, 39 within threshold (largest cell 11/255, mean 0.47), 5 brightness-only (a fade or dim scrim), 10 same picture under another state name
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 251 single words that may be ids
  - B  English that a child may see: 38 English literals + 33 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (14 places)
  - D  lines with no family recording: 36 distinct words with no clip in 3987 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: clinic:diagnosis, clinic:heal-eye, clinic:heal-fever, clinic:heal-foot, clinic:heal-knee, clinic:heal-taste ... · reviewer: <someone other than the builder> · commit: d915b4c5
Auto: layout lint ✅ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 119 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| clinic:diagnosis | 1366x768 | 5 | 0 | sheets/clinic-diagnosis__1366x768.png |
| clinic:heal-eye | 1366x768 | 8 | 0 | sheets/clinic-heal-eye__1366x768.png |
| clinic:heal-fever | 1366x768 | 13 | 0 | sheets/clinic-heal-fever__1366x768.png |
| clinic:heal-foot | 1366x768 | 6 | 0 | sheets/clinic-heal-foot__1366x768.png |
| clinic:heal-knee | 1366x768 | 10 | 0 | sheets/clinic-heal-knee__1366x768.png |
| clinic:heal-taste | 1366x768 | 6 | 0 | sheets/clinic-heal-taste__1366x768.png |
| clinic:patient | 1366x768 | 15 | 0 | sheets/clinic-patient__1366x768.png |

### Regression rows to recheck (119; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CLN-17 · open · eye: 1366×768 · Scene: patient sits on the bed edge, doctor beside them three-quarter turned; no anatomy poster
- [ ] CLN-162 · open · eye: fever (her feet on the stool), di · "Her feet have a drop shadow underneath them ... not resting on the wooden stool"; "the doctor h
- [ ] CLN-16 · built · eye: L2 · "Found it" and "Next" variant is explained (folded into D1 as level 2)
- [ ] CLN-18 · built · eye: ×2 zoom · D3 tools are clear: torch looks like a torch (not a pill), thermometer looks like one, one cue p
- [ ] CLN-93 · built · eye: D1 L1, L2 · D1: bigger patient, smaller dots centred on the parts; a tried dot goes grey after "no", never g
- [ ] CLN-94 · built · eye: D3 L1, L2 · D3: card like sekelo (tool head, parts under it, ticking); the torch zooms on the face by itself
- [ ] CLN-95 · built · eye: D1 · No swirl icon over the sore part
- [ ] CLN-116 · built · eye: diagnosis, heal-game wide shot, s · The real doctor's certificate photo sits in the exam room's frame on the right wall (CB2b/CB6b)
- [ ] CLN-81 · open · eye: clinic morning end to end · The girl's finished art in the whole story: waiting room, diagnosis, send-off, sticker and card
- [ ] CLN-159 · open · eye: the heal lab without ?debug=1 and · "In the left-hand panel, on the bottom left, there's what looks like code ... mounted Boing L1 s
- [ ] CLN-02 · built · eye: 1366×768 · ART-03 · Backgrounds locked first: six new rooms, heal games have a background, nothing faded; pharmacy s
- [ ] CLN-03 · built · eye: 1366×768 · CMP-01 · Clinic uses what Cook learned: the review face (her big round face over the tray at the pharmacy
- [ ] CLN-04 · built · eye/ear: waiting room ladder · Language builds up simply (man, woman, boy, girl; old, young; tall, short; colours; "with the ba
- [ ] CLN-05 · built · eye: sidebar · CMP-06 · No Nani box in the clinic; the doctor fills her role
- [ ] CLN-06 · built · auto: contract-13 stale-ui (no reply p · Each stage clears its own UI: no reply pills from an earlier round left on screen until refresh
- [ ] CLN-07 · built · eye: lab pages · Lab debug log (bottom left) does not overlap the pills or counter
- [ ] CLN-08 · built · eye: heal games · Heal-game close-up background blurred more in code so the room never competes; certificate frame
- [ ] CLN-09 · built · auto: build/check_hotspots.py · LAY-11 · Clinic tooth at least 1 cm even zoomed (0.50 cm on iPad); trolley objects about 60 design px on
- [ ] CLN-82 · built · eye: every heal game L2, L3 · L2+: once a count is reached, the next step's row appears and its tool glows after a pause (stuc
- [ ] CLN-83 · built · eye: diagnosis, pharmacy, scrape, ear · No extra click when the outcome is clear ("Found it", end ✓, stage buttons): it moves on after a
- [ ] CLN-84 · built · eye/ear: pharmacy L3 and all nine heal · The request first in a pop-up, then a quiet game (pharmacy and every heal game; decision 53). Re
- [ ] CLN-85 · built · eye: diagnosis, pharmacy, each heal ga · In the eye test her bubble comes from under her mouth as she reads (decision 92 closed the face-
- [ ] CLN-86 · built · eye/ear: waiting, fever · Waiting room: she says salaam and he replies, each line in a bubble from the speaker's face (her
- [ ] CLN-87 · built · eye: zoom in and out in every heal gam · Zoom in and out about 1.5 s; zoom-out from full zoom on the healed part; her poses during the zo
- [ ] CLN-88 · built · auto: timing · Clinic lab pages load fast (no serial JSON chain, games loaded on demand)
- [ ] CLN-89 · built · eye: labs.html · Labs point at the current clinic lab only (old clinic lab index still reachable)
- [ ] CLN-109 · built · ear: scrape L1 finished fast, then sen · No voice carries over into the next stage: finishing a heal game quickly left the doctor still r
- [ ] CLN-111 · built · eye: the clinic end screen at L1 and a · The clinic's end screen also offers Again (the same patient) and All patients, like Cook, from t
- [ ] CLN-112 · built · sandbox #takeback flows, every heal ga · Take it back until Done in every clinic game (UX §17, like CK-TB-01): every heal game and stage
- [ ] CLN-113 · built · eye: the audit table, one line per gam · Every ordered instruction in every clinic game is a sequence on the shared card (line, grey band
- [ ] CLN-114 · built · auto: contract-9 closed-card (L3+: wai · From L3 the card is closed in the pharmacy and every heal game (and the waiting room), with the
- [ ] CLN-152 · built · auto: contract-21 on clinic:heal-fever · A tap during a line in the fever and eye games logs no act: the child's tap is not handed to the
- [ ] CLN-153 · built · auto: contract-15 on clinic:patient · The patient flow's end breaks "thermometer" across two lines (contract-15)
- [ ] CLN-151 · built · auto: zero-tolerance lint on clinic:he · A heal card scrolls inside its box: heal-foot's request pop-up card by 2 px at 800x360, 1180x820
- [ ] CLN-01 · built · eye: each room · Rough stand-in art made judging hard ("so overwhelmed by how terrible the visuals were"); real a
- [ ] CLN-38 · open · auto: list the chart's item pool at ea · Eye: the chart draws its items from household and everyday nouns the child has met (bed, table:
- [ ] CLN-107 · open · eye: eye L1–L3 · Eye: a wrong yes/no shakes red, the doctor names the row with pictures; a misread gets a drop an
- [ ] CLN-119 · reopened · auto: the words each game marks in ctx · Each heal game teaches its own language strand beyond numbers, from its scene (D18): scrape colo
- [ ] CLN-137 · open · needs-decision · Send-off L2: her face shows no feeling while she says it (her art's resting face smiles)
- [ ] CLN-141 · open · eye: scrape L1, ×2 on the card · The heal card's sequence line runs beside its rows, never through their text ("cloth, ba", "laal
- [ ] CLN-154 · open · eye: clinic:diagnosis, clinic:sendoff · "He's much too close to the foreground than she is": in the exam room the doctor's feet sit lowe
- [ ] CLN-155 · open · eye: clinic:diagnosis 800x360 and 1366 · Seated exam: the doctor's shoe butts against the bed's leg and reads awkward; he should stand a
- [ ] CLN-156 · open · eye: clinic:diagnosis@L3, clinic:morni · Standing check-up: he reads further forward than her (his dark shoes spread wider than her small
- [ ] CLN-157 · open · eye: every clinic stage at 1366x768: F · Use the views we now have: the doctor faces the way each moment needs (e.g. a quarter turn towar
- [ ] CLN-158 · open · eye: heal-extra-hic at 800x360 and 136 · The hiccups heal game writes English sound words to the child ("hic!", "glug!", "BOO!", "pfff!";
- [ ] CLN-163 · open · eye: every close-up's zoom as frames; · "The zoom in animation on the teeth needs to be much better ... two big jumps"; "nicely smoothly
- [ ] CLN-187 · open · auto: L2+ cards ask a count per eye · Eye: "by level 2, start picking drops. A certain number of drops in the left eye and a certain n
- [ ] CLN-188 · open · eye: the chart, every level · Eye chart: "a background on the right-hand side ... up on the wall"; "an eye test board sitting
- [ ] CLN-189 · open · auto: each chart picture's colour clas · Eye: "she's saying tomato, limu, which is lemon ... I'm pressing no, because an orange, not a le
- [ ] CLN-30 · built · auto: build/check_onboard.mjs; eye: ev · Each heal game explains itself with one "why" beat ("why am I clicking on the things?"), no Engl
- [ ] CLN-39 · built · eye: eye game · INT-02 · Eye cover cannot be taken back
- [ ] CLN-42 · built · eye: every heal game · No unexplained icons: no 🩺 badge bottom left, no gold half-circle on tools, no glove on the syr
- [ ] CLN-43 · built · eye: each heal game's opening, 1366×76 · A heal game opens by zooming from the patient on the bed to the sore part; never a lone limb on
- [ ] CLN-44 · built · eye: each heal game · CMP-07 · Every heal card has a headline (the goal) and folds to it with the check
- [ ] CLN-47 · built · eye: knee, foot, eye L3 · Sides are said and tested only in the diagnosis; the close-up shows the one sore knee, foot or e
- [ ] CLN-59 · built · eye: eye L1 · Eye: the sore eye is clear
- [ ] CLN-60 · built · auto: help path; eye: first play · LNG · Eye: the first-time help never presses haa on a row read wrong
- [ ] CLN-61 · built · eye: eye test, both layouts side by si · Eye: obviously an eye chart; the patient seen looking at it; chart rows highlight and tick like
- [ ] CLN-62 · built · eye: eye, a wrong read, and the end · Eye: after na the dropper over the eye shows what to do; after the last chart row she looks up h
- [ ] CLN-63 · built · eye: eye L3 · Eye L3: no hidden first step without a row or a line
- ... 59 more (`node build/tools/review/regress.mjs clinic:diagnosis,clinic:heal-eye,clinic:heal-fever`)

## Left open
<!-- fill in -->
