# A1: clinic heal art, part B cut and wired (5 Oct)

No mechanic removed or changed: only pictures, their placement and the data that places them.

## Judged (art plan §7, zoomed, flaws first)
- **Pass:** S1–S6, W1–W9, W8, K1, K2, K3, F1, F2, F4, P1, E1, Y2, Y3, T2, O1. Skin matches Ali's and Ma's approved renders (ΔE 1.5). The plan's #C49A78 is a midtone, and this sampler reads lit skin.
- **Pass after fixing in the cut:** W10 drifted 2% and was refitted on the legs, so her head sits about 25 px higher. T1 looked away from the chart, so it is mirrored in the cut.
- **Fail, used anyway:** M1, M2 and Y1 are framed too wide (ears and plaits show). In the games those edges fall off-screen. M2 also has rosy cheeks.
- **Fail, not used:** U1 is a sleeveless vest with a bare shoulder, chin and plait (modesty rule I1).
- **Redo list:** U1, M1, M2, Y1/Y2/Y3 (framing), T1 (gaze), W10 (scale).

## Wired, girl only (other kinds keep stand-ins)
- **Every heal game:** the wide shot shows W1 front-on or W7 side-on, with faces by mood. The push-in lands on the close-up's part (match cut, `camera.target`). Her head crop is the corner face.
- **knee:** K1, with the K2 kick picture swapped in.
- **cut:** K1 or F1 under the game's own graze and plasters. The arm clears the tool column.
- **ear:** E1, with O1's wax and tissue.
- **tooth:** M1. The drill view stays drawn.
- **taste:** M2.
- **eye:** Y2, clearing to Y1 drop by drop. Y3 is the blink. T1 is test A, T2 is test B.
- **foot:** P1 at levels 1–2. Level 3 keeps the stand-in, because the art's toes slope where the stand-in's are level.
- **fever:** W1, the hot and cold faces, and the W9 blanket and W10 bottle as whole bodies.
- **boing:** the wide shot only. Its arm is still the stand-in.

## Still stand-ins
- Diagnosis and send-off (need part taps and the magnifier on the art).
- Boing's arm (U1 failed), the foot at level 3.
- Not landed yet: the room (R1–R5), the props O2, O3, C1, C2, B1, D1, D2, and all of part C.

## Proof
- `check_onboard` passes, and all 10 clinic leak bots pass.
- **Sandbox:** SANDBOX_RESULT
- **Shots I looked at:** `build/screenshots/sandbox/a1-touched/`, plus quick looks at 1366, 844, 800 and 1180 for every game.

## Left for the next art session
1. Fetch main and run `git checkout origin/main -- sources/art/clinic-heal-v3`, then `python3 build/cut_clinic_heal_v3.py`. It cuts whatever has landed, skips `FAILED`, writes `data/clinic/heal-art.json`, and already handles part C kinds and O2.
2. For part C, add each kind's `ANCHORS` (front and side, `neck`) by grid. Then add the kind to `kinds` in each heal JSON's art block.
3. Wire O2 (spots and decay), O3 (buds), R1–R5 (fever room), C1/C2 (charts) and B1. Each JSON already names its slot.
4. Limb cloth tint for the boy and the men (the fabric mask).
5. Diagnosis on the art.
