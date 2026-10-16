# s08-placement-judge: him and her in the clinic rooms (CLN-154..157)

Judge: Fable, independent of the s08 builders; every stage at 800x360, 844x390 and 1366x768, zoomed, flaws first. No game code touched: the spec was proved by serving a judge's copy of `scenes-v2.json` to the browser.

**Flaws, by stage** (details in the tables):

| stage | flaw |
|---|---|
| seated exam | his left shoe sits on the bed's right front leg (both on the 0.80 line); he turns to her for 1.2 s, then faces the player for the whole examination; phones: his crown 11 px under the top |
| standing check-up | measured, one feet line; perceived, he is nearer: his shoes span 1.57x hers on screen, dark with a drawn sole shadow, hers white on a pale floor, so his feet ground and hers float; phones: her hand and elbow are 17 px apart, under a fingertip |
| send-off | right; but on phones at level 3 the help tray covers her feet (14-20 px) and his shoe (21 px) |
| waiting room | his right shoe touches the desk's corner (5 px) |
| every room | no contact shadows under either figure, while every painted thing has one: the "pasted on" cause |
| heal, pharmacy | no figures in the room |

**The seated 1.3x stays out.** At 1.3x her seated crown meets his standing crown: a sitting child as tall as a standing man. At 1x her head is at his chin, right for a five-year-old on a 75 cm bed. Her taps keep the 1.3 pad (28/30 hits at every size). The phone's limit is spacing, not size: if Zafar wants bigger parts there, that is a body zoom like the face's magnifier (a question for him).

**Orientation rule (CLN-157):** he faces whoever he speaks to; between lines he faces the patient. In the diagnosis the "your turn" cue is the card and the pulsing parts, not his turn to the player.

## The spec

Shares of the room picture (1536 x 1024). Flip: never. Contact shadow, both figures, every room: a soft ellipse under each foot, black at 0.18, 1.2x the foot's width, 0.25x its height.

### Seated exam, clinic:diagnosis D1 and D2 (every level)

| character | view | feet x, y | height | why |
|---|---|---|---|---|
| doctor | 3q-left while he examines or speaks to her (D1, D2); front only while a line is for the player (the ailment at the end), then back | 0.845, 0.83 (was 0.79, 0.80) | 0.70 (the 1.75 m rule: 0.737; 0.95 of it) | 0.83 is the stool's front legs (Zafar: "the middle or the front of the stool"); his shoe's edge is 0.02 clear of the bed's leg and 0.03 in front of it, 0.026 clear of the door frame; his crown drops to 0.13 (28 px under a phone's top). Proved at 0.85/0.72 (`proposed-exam-*`): 0.845/0.70 is that with 2 px more margin each side |
| girl | sitting, front, big 1.0, tapBig 1.3 | unchanged | unchanged | the ruling above |

Check: `exam.doctor.y` leaves `floor` (her bed line): the plane rule becomes `doctor.y - floor` in 0.02-0.04 and `PLANE_BACK.exam` 0.84. Red before, green after.

### Standing check-up, clinic:diagnosis D3 (level 3, the morning)

| character | view | feet x, y | height | why |
|---|---|---|---|---|
| girl | stand front | 0.5, 0.825 (was 0.80); phones 0.865 (was 0.84) | body 0.535 (was 0.505); tapBody 0.59 kept | a touch forward and bigger (Zafar): 0.025 nearer is 1.06x taller by the room's perspective, the same child one step nearer; her hands stay 0.025 clear of his |
| doctor | front while he calls the tool (to the helper); 3q-left while the child applies it | 0.72, 0.80; phones 0.84 | 0.73 | unchanged: half a step behind her shoulder, as an examiner stands |

Check: "one feet line within 0.01" becomes "hers 0.02-0.03 in front of his"; 0.73/0.535 = 1.36 passes 1.35-1.6.

### Send-off, clinic:sendoff (CB5): leave the placement alone

| character | view | feet x, y | height | why |
|---|---|---|---|---|
| doctor | 3q-right while they talk, front on the child's turn, wave-3q-right as she goes | 0.205, 0.77 | 0.60 | one line reads true here: a wide floor strip, the two close together |
| girl | front; 3q-left to him while they talk; wave | 0.39, 0.77 | body 0.415 | as built |

Phones, level 3: the help tray's left edge at room x 0.50 or more (its centre 0.70), clear of both; laptops keep it centred.

### Waiting room, clinic:waiting

| character | view | feet x, y | height | why |
|---|---|---|---|---|
| doctor | wave-front (the call), facing the room | 0.795, 0.755 (was 0.805) | 0.57 | 0.01 left clears the desk's corner; still in his doorway |

### Heal games, pharmacy: nothing to place.

## Proof

| what | where (build/reports/s08-placement-judge/) |
|---|---|
| today, measured (shoot_plane.mjs, 5 rooms x 3 sizes) | `plane.json`; `today-exam-*`, `today-exam-L3-*`, `today-stand-*`, `today-door-*`, `today-waiting-*` |
| the 3q-left moment, the DOM rects (figures, panels, crop, overlaps) | `moments.json`; `today-exam-talk-*`, `today-door-L3-*` |
| zooms | `zoom-exam-shoe-bedleg-1366.jpg`, `zoom-exam-shoe-bedleg-800.jpg`, `zoom-stand-feet-1366.jpg`, `zoom-stand-feet-800.jpg` |
| the spec in the browser (a judge's scenes-v2.json served in place of the repo's) | `proposed-exam-talk-*`, `proposed-stand-*`, `proposed-waiting-*`, `proposed.json`, `scenes-proposed.json` |
| the send-off's say moment (both front: right), the morning's D2 and D3 at level 3, a heal close-up (no figures) | `sandbox-sendoff-L3-say-1366x768.jpg`, `sandbox-sendoff-tap-800x360.jpg`, `sandbox-morning-L3-D2-800x360.jpg`, `sandbox-morning-L3-D3-*`, `sandbox-heal-knee-1366x768.jpg` |
| art measurements | `lineup.jpg`: his shoes 0.295 of his body height, luminance 57; hers 0.273, luminance 196-205 |
