# s08-rejudge: the new cast stitched in, rejudged (CLN-154..157; 16 Oct 2026)

Fable, independent; three sizes, measured (`shoot_plane.mjs`), zoomed, flaws first; no game code touched.

**A. Clinic: PASS with two fixes.** Every spec row landed to the number (the table); every orientation is as specced; nobody reads nearer the camera now. His size against each door is 0.95-1.03 of the 1.75 m rule; her taps 28/30 seated, 30/30 standing; the portrait at 0.56 is a normal avatar crop. The door-frame gap (0.011) is accepted (table, row 8). Two things fail the eye: the contact shadows are too faint to ground anyone (the builder read "0.25x" as I meant it; my numbers were timid), and the level-2 send-off tray still covers both pairs of feet on phones. Her sore face reads startled, not sore.

**B. Cast: PASS with one art gap.** Doctor, girl, boy, the cut old couple, Ma, Nana and the cousin: one render style, one soft key from the upper left, clean edges. Nani is a softer likeness, not the cartoon: visible beside Ma, but Zafar's call. Still pasted in: the waiting room's auntie, uncle and the woman with the baby (rough, toy-glossy).

**C. Cook: PASS with fixes.** Nani at the counter is too tall, not too big: her crown sits 102 design px above Ma's, her head 1.07x Ma's, though she leans and Ma stands; the lineup's 1.18x makes her the biggest of four. The counter point's finger stops at the counter's edge. The hob pan and the pouring pan do not read as one pan.

## Flaws

| # | severity | what | cause | fix |
|---|---|---|---|---|
| 1 | fix now | contact shadows invisible on phones; a faint smudge on laptops (`shadow-on-over-off-*`) | 0.18 black, ellipse 0.25x its width tall, soft-blurred: the peak is well under the painted furniture's shadows | `css/shared/tokens.css:44` `--njg-contact` 0.18 -> 0.30; `js/clinic/kit.js` `Kit.contactShadows`: `eh = 0.35 * ew`, centre `cx + 0.06 * ew` (the window light is on the left, shadows fall right); blur unchanged |
| 2 | fix now | L2 send-off tray over their feet on phones: 14.8 px at 800x360, 8.7 px at 844x390; laptops clear (`door-L2-800x360`) | four 64 px cards centred; only L3 got the phone rule | phones (room under 480 px): every tray with four cards draws them at 48 px (LAY-04's minimum), gap 8, padding 8/12 (240 px = 0.40 of the room) and takes L3's rule, left edge at room x 0.50, centre 0.70 (`css/clinic.css:488-489`, the L3 placement in `js/clinic/stages/sendoff.js`) |
| 3 | fix now | Nani too tall at the counter; biggest of the lineup (`cook-moods-*`, `cook-finale-*`) | her lean canvas is drawn 1:1 (crown at 120, Ma's at 222); the finale adds 1.18x | `js/cook/stations.js` CHARS `nani: { x: 330, top: 205, scale: 0.82 }` (forearms stay on the back edge: 613 - 497 x 0.82); `css/cook.css:276` `.fin-nani` scale 1.18 -> 1.0 |
| 4 | should fix (next art run) | waiting-room auntie, uncle, woman with baby in the old rough style (`waiting-1366x768`) | their seated fronts were never drawn (waiting.js keeps the rough sprites) | one art-run frame per person, seated front, the s08 look, cut like old-man/old-woman (`s07.cut.json`) |
| 5 | later (art run) | hob pan and pouring pan read as two pans (`first-chai-timing-1366x768`) | `pan-top.webp` is steel-handled up-right and empty; CP1's pans are black-handled, right | CP1b: the same pan straight down, empty, black handle to the right -> `assets/cook/items/chai-v2/pan-top-v2.webp`, repoint `data/cook.json` |
| 6 | later (art run) | the girl's sore face reads startled, not sore (`exam-L3-844x390`, `stand-1366x768`) | GS1: brows raised, eyes wide, mouth open | GS2: brows pinched up in the middle, eyes narrowed, mouth a small grimace, both eyes open (CLN-136); replaces `girl-face-sore` and `girl-stand-face-sore` |
| 7 | later | counter point frame: the finger stops at the canvas bottom, behind the counter's edge (`zoom-cook-point-1366x768`) | cut at 501 rows | before any station calls talk with mood "point": re-cut `nani-point-v3` on a taller canvas, or point sideways |
| 8 | accepted | his drawn edge 0.011 from the exam door frame | 0.19 of room between bed leg and frame, his 3q-left picture 0.179 wide | none: clear of the bed leg wins (Zafar's row) |

## Proof

Shots: `build/reports/s08-rejudge/`.

| spec row | measured (800 / 844 / 1366) |
|---|---|
| exam: his feet 0.83, h 0.70, crown 0.13; shoe 0.02 clear of the bed leg | 0.83, 0.70, 0.13 (28 / 32 / 111 px under the top); 0.025 talk, 0.028 front |
| exam: 3q-left to her, front for the player | card *front*; "Does it hurt here?", "knee" *3q-left*; "A scrape." *front* |
| stand: her feet 0.825 (phones 0.865), body 0.535, his 0.80 / 0.84, ratio 1.36 | 0.825 / 0.865, 0.535, 1.364-1.365; feet gap 0.025 |
| stand: front for the card, 3q-left while she plays, front for the ailment | card read-outs *front*, play *3q-left*, "The jab before the trip." *front* |
| send-off: 3q-right to her, front on the child's turn, wave-3q-right | "Is everything okay now?" *3q-right*; tray moment *front*; wave *wave-3q-right* (sendoff.js:396) |
| send-off L3 phones: tray left edge >= 0.50, centre 0.70 | 0.50 / 0.71 (800), 0.504 / 0.70 (844); feet covered 0 |
| send-off L2 phones | tray 0.227-0.773 top 0.733: 14.8 px over both (800); 0.245-0.755: 8.7 px (844); 1366 clear |
| waiting: his x 0.795, shoe clear of the desk | 0.795, 0.025; *wave-front* |
| his height / the door | exam 1.017, stand 1.072, send-off 0.923 (rule: 1.07, 1.04, 0.97) |
| shadows drawn (px, w x h) | 800: his 29-35 x 7-9, hers 18-24 x 4-6; 1366: his 54-67 x 14-17, hers 34-45 x 9-11 |
| her taps | seated 28/30 (mouth/tooth share), standing 30/30; hand 9.6 / 10.3 / 17.7 px seated, 12.4 / 13.3 / 23.9 standing |

Rooms (three sizes each): `exam-talk`, `exam-front`, `exam-L3`, `stand`, `stand-front`, `door`, `door-L2`, `door-L3`, `waiting`; zooms `zoom-*`; `shadow-on-over-off-{exam,stand,door}-*`; `morning-L3-*`, `sendoff-L2-*`; Cook `cook-moods-*` (under the lab's intro scrim), `zoom-cook-point-*`, `cook-counter-*`, `cook-finale-*`, `first-*`, `find-title-*`, `snap-title-*`. Sandbox (clinic:morning@L3, sendoff, sendoff@L2, cook:day1, day6, chai, first, mode:find, mode:snap): every page reached its end, 0 errors; run folders deleted.
