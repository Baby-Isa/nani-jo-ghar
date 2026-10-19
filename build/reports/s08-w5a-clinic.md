# s08 wave 5A, the clinic I: boing, ear, tooth, the zooms (builder report; not judged)

Branch `worktree-agent-a17cf64fa2dd1fbf8` from f36ca4ac, not pushed. Filmstrips and x2 crops: `build/reports/s08-w5a-clinic/`.

## Flaws first

1. **Eye, a step less zoomed (CLN-185)** is done from the host (`camera.view` in `eye.json`; eye.js is wave 5B's). It widens the drops view only; the chart keeps its framing. If 5B reframes the eye art, drop `camera.view`.
2. **The room-to-close-up hand-over** (`zoom-*-in`) still cross-fades two drawings, now at the same place and size. For about 0.3 s the close-up's cut-out edge shows over the blurred room (the face's bottom edge, the cheeks' arc).
3. **Tooth:** the brushing mouth turns into the wide-open mouth as the camera starts. The two are registered on the front teeth, but one frame is a double exposure (the lower teeth show faintly under the lips). The decay is not shown during the brushing.
4. **Tooth hi-res:** `upscale.py` cannot run here (no torch). I ran its network and weights (Real-ESRGAN x2plus) in numpy on the teeth crop only (`mouth-v2-teeth-hd.webp`). The rest is the @2x.
5. **Boing:** "a fifth up the bicep" is read as a fifth from the elbow's crease (the old spot was in it). The levers are small on a phone (35 svg units apart; the tube is the tap area too). The drop falls in front of the plunger's thumb.
6. **Drops at L2+ now close with the ✓.** The "the syringe places itself, then the press" order needs a done moment, so the old "press closes the drops" path is gone.
7. **No evidence specs were added** (evidence.json is not mine), so there was no red run. Of the 99 regression rows, I rechecked only the ones in the four flows' shots.

## What changed

- Host: one camera tween over the room and the close-up; `HOST.view`.
- Boing: CLN-164 to 168 and 170. That covers the DM1 machine, the DM2 levers and the syringe sheets. The drops show as liquid bands. There is one count on the syringe and the cloth is in hand. No count-down or squash; a puff of mist instead.
- Ear: CLN-135, 173, 174. The spots and their rule are gone; the tweezers are in layers; the kidney tray shows the wax in sight.
- Tooth: CLN-163, 180 to 184. One picture and one camera; the s08b brush lies level with no turn. The fill has no line, the tip sits on the cavity and each cavity fills from its middle. The dial is styled from Cook's dial; overfill smooths back; the first go is scored.

## Proof

- `checks.mjs`: unit, words, static, leak, bump, specs and size all pass. Load check on clinic morning/tooth/boing/ear/eye: ok.
- Sandbox `w5a-quick` (4 flows, 1366): CONTRACT PASSED, CHECK PASSED with 0 new findings. `shotdiff`: 34 changed, all on these screens.
- CLN-182, measured: gauge and button centre y are equal and exactly midway at 1366x768 (563.9), 800x360 (263.7) and 1024x768 (567.6). The nozzle tip is 0 px from the cavity centre.
- Filmstrips: boing L1/L3/800; ear L1/L3 and the grab x2; tooth L1/L2 overfill/L3 and the fill x2; zoom in and out for the tooth and the eye at 1366 and 800x360 (the real clinic page).

QA: TXT ✅ · LAY ⚠ (flaw 5) · CMP ✅ · LNG ✅ · INT ⚠ (flaw 6) · AUD n/a · ART ⚠ (flaws 2, 3) · CUL ✅ (no needle ever shown).

Open for the judge: every row above.
