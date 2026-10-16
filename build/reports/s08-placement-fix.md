# s08-placement-fix: Fable's placement spec applied (CLN-155, CLN-156, CLN-157; 16 Oct 2026)

**Done.** The spec's numbers are in `scenes-v2.json`. In both diagnosis rooms the doctor stays 3q-left to her, front only for his lines to the player (the card, a tool's cue, the ailment). Contact shadows come from one shared function (`Kit.contactShadows`, feet measured by `build/tools/art/shoes.py`), used by his and her figure code. On phones at L3 the send-off tray sits at room x 0.50-0.92. His card portrait is reframed. The three unused pain-face files are deleted. Two rule changes went red, then green: the plane check (`plane-red.txt`), and contract-10 (in the exam he must face her).

**Flaws, worst first.**
- At L2 on a phone, the send-off tray still covers both pairs of feet (8.7-14.8 px). This was there before and is outside the spec.
- The shadows are faint, at the spec's 0.18. I read "0.25x its height" as a quarter of the ellipse's width. A quarter of the foot's height would make them about 2 px.
- The portrait's head is 0.56 of the circle (old 0.51). Any smaller and the stretched collar reads as a long neck.
- His edge is 0.011 from the exam door frame (the spec said 0.026).

**Drop machine: left alone.** DM1 has a fixed tube order where the game shuffles (the leak test), buttons where the game has pull levers, and its own funnel and cup where the game has the syringe. It is also a tall unit, not the wide box.

## Proof

Shots: `build/reports/s08-placement-fix/{before,after}-{exam-talk,exam-front,stand,door-L3,waiting,boing}-{800x360,844x390,1366x768}.jpg`, plus `after-stand-front-*` and the zooms `zoom-*-before-over-after.jpg`. Measured with `shoot_plane.mjs` (extended): `before-plane.json` and `after-plane.json`.

| spec | measured after (before) |
|---|---|
| exam: his feet 0.83, height 0.70, crown 0.13 (28 px on a phone) | 0.83, 0.70, 0.13: 28 px at 800, 32 px at 844 (0.80, 0.71, 12 px) |
| exam: shoe 0.02 clear of the bed leg | 0.025 at talk, 0.028 at front (−0.028, on the leg) |
| exam: 3q-left to her, front for the player | lines: card *front*; "Does it hurt here?" and "knee" *3q-left*; the ailment *front*; at the child's turn *3q-left* (all *front*) |
| stand: her feet 0.825, phones 0.865; body 0.535; ratio 1.36 | 0.825 and 0.865, 0.535, 1.364-1.365 (0.80, 0.84, 0.505, 1.446) |
| stand: front for the call, 3q-left while she plays | card read-out *front*, play *3q-left*, ailment *front* |
| send-off L3 on a phone: tray left edge ≥0.50, centre 0.70 | 800: 0.50 / 0.71; 844: 0.504 / 0.70; feet covered 0 px (0.29 / 0.50; her feet 14.8 px) |
| waiting room: his x 0.795 | 0.795; shoe 0.025 clear of the desk (0.015) |
| shadows, both figures, every room | 2 ellipses each in the exam, stand and door rooms; 2 for him in the waiting room (0) |
| her taps (real hit test) | seated 28/30, standing 30/30 at all three sizes; radii unchanged (same) |

| run | result |
|---|---|
| sandbox, all 86 `clinic:` flows × 800x360, 1366x768, `--check --no-sheets` | 172/172 reached the end. 10 "new" findings in heal-taste/fever/foot@L2 and heal-extra-*: the same 10 at 15f3c8ba, flows the baseline lacks at these sizes. One contract-4 in fever@L3 did not come back in 2 reruns. Staged flows rerun on the final code: 22 pages, 0 contract breaks, 0 new |
| `checks.mjs --only unit,static,leak,load,size,docs` | all pass (unit 337) |
| `artcheck.mjs` | 260 known, 0 new |
