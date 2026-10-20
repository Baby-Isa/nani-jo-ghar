# s08 wave 5A, the clinic I: boing, ear, tooth, the zooms (builder report; not judged)

Branch `worktree-agent-a17cf64fa2dd1fbf8` from f36ca4ac, not pushed. Filmstrips and x2 crops: `build/reports/s08-w5a-clinic/`.

## Flaws first

| # | Flaw |
|---|---|
| 1 | Eye "a step less zoomed" (CLN-185) is done from the host (`eye.json` `camera.view`). eye.js is wave 5B's. It widens the drops view only; the chart keeps its framing. Drop it if 5B reframes the eye art. |
| 2 | The room-to-close-up hand-over is still a cross-fade of two drawings, now at the same place and size. For about 0.3 s the close-up's cut-out edge shows over the blurred room (`zoom-*-in`). |
| 3 | Tooth: the brushing mouth turns into the wide-open one as the camera starts. They are registered on the front teeth, but there is one double-exposure frame. The decay is hidden while brushing. |
| 4 | `upscale.py` cannot run here (no torch). I ran its network and weights in numpy on the teeth crop only (`mouth-v2-teeth-hd.webp`); the rest of the mouth is the @2x. |
| 5 | Boing: the spot is a fifth up from the elbow's crease (my reading of "a fifth up the bicep"). The levers are small on a phone; each tube is a tap area too. The drop falls in front of the plunger's thumb. |
| 6 | From L2 the drops close with the ✓, so the syringe can move over the arm before the press. The old path where the press closed the drops is gone. |
| 7 | No evidence specs added (evidence.json is not mine), so no red runs. Of the 99 regression rows, only the four flows' shots were rechecked. |

## What changed

| Area | Rows |
|---|---|
| Host | CLN-163: one camera tween over the room and the close-up; `HOST.view` |
| Boing | CLN-164 to 168, 170: the DM1 machine and DM2 levers; the syringe sheets with no needle shown; the drops as liquid bands; one count on the syringe; the cloth in hand; the syringe moves over the arm; a puff of mist (no count-down, no squash) |
| Ear | CLN-135, 173, 174: the spots and their rule are gone; the tweezers in layers; the kidney tray with the wax in sight |
| Tooth | CLN-163, 180 to 184: one picture and one camera; the s08b brush lying level; a dial styled from Cook's dial; overfill smooths back; the first go is scored |
| Tooth fill, after the orchestrator's look | No line at all: the nozzle keeps its plain picture while pressed (the paste picture drew a squiggle). The cavity is a soft, rounded, darker hollow with no drawn rim, and the decay's rim is masked away once drilled. The filling is soft-edged, grows from the middle under the tip, and covers the hollow (`tooth-fill-x2.jpg`). |

## Proof

| Check | Result |
|---|---|
| `checks.mjs` (unit, words, static, leak, bump, specs, size) | all ok |
| loadcheck (clinic morning, tooth, boing, ear, eye) | ok |
| sandbox `w5a-quick`, 4 flows at 1366 | contract passed; 0 new findings |
| shotdiff | 34 changed, all on these screens |
| CLN-182, measured | gauge y = button y = midway: 563.9 @1366x768, 263.7 @800x360, 567.6 @1024x768; nozzle tip 0 px from the cavity |
| Filmstrips | boing L1/L3/800; ear L1/L3 and grab x2; tooth L1, L2 overfill, L3, fill x2; tooth and eye zoom in/out at 1366 and 800x360 |

QA: TXT ✅ · LAY ⚠5 · CMP ✅ · LNG ✅ · INT ⚠6 · ART ⚠2,3 · CUL ✅ (no needle). Every row is open for the judge.
