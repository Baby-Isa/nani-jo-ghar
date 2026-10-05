# A1: clinic heal art, part B cut and wired (5 Oct)

No mechanic changed. Redo list: the fails and fixes below.

## Judged (plan §7, zoomed, flaws first)
- **Pass:** S1–S6, W1–W9, K1–K3, F1, F2, F4, P1, E1, Y2, Y3, T2, O1. Skin is ΔE 1.5 from Ali's and Ma's approved renders.
- **Fixed in the cut:** W10 refitted on the legs (head ~25 px higher). T1 mirrored, because she looked away from the chart.
- **Fail, used:** M1, M2 and Y1 are framed too wide; scaled in the games, the edges fall off-screen. M2 also has rosy cheeks.
- **Fail, not used:** U1 is sleeveless, with a bare shoulder, chin and plait in frame (I1).

## Wired (girl only; other kinds keep stand-ins)
- **All nine:** W1/W7 wide shot, faces by mood, the push-in landing on the close-up's part (`camera.target`), her head as the corner face.
- **knee:** K1, with the K2 kick swap.
- **cut:** K1/F1 under the game's own graze; the arm clears the tool column.
- **ear:** E1, with O1's wax and tissue.
- **tooth:** M1. **taste:** M2.
- **eye:** Y2 clearing to Y1 drop by drop; Y3 is the blink; T1 is test A, T2 is test B.
- **foot:** P1 at levels 1–2.
- **fever:** W1, the hot and cold faces, and the W9 blanket and W10 bottle bodies.

## Still stand-ins
- Diagnosis and send-off.
- Boing's arm (U1 failed); foot level 3 (the art's toes slope).
- Not landed: R1–R5, O2, O3, C1, C2, B1, D1, D2, part C.

## Proof
- `check_onboard` and all 10 clinic leak bots pass.
- **Sandbox** (`build/screenshots/sandbox/a1-touched/`, all looked at; `--touched`, nine heal games and `clinic:patient`, 1366×768, 844×390, 800×360, 150 pages): every page ends, 0 page errors. `--check` reports 3 new card-scroll findings at L2 on phones. The same pages show them on the base commit 0af7011, so they are G1's, not mine.
- **Mine, flaws first:**
  - At 800×360 the scrape's fingers sit under the two-wide tool column.
  - Her head jumps on the W10 swap.
  - The eye close-up's ears show at tablet width.

## Next art session
1. Run `git checkout origin/main -- sources/art/clinic-heal-v3`, then `python3 build/cut_clinic_heal_v3.py`. It cuts whatever has landed, skips `FAILED`, and rewrites `data/clinic/heal-art.json`; O2 and part C are already in it.
2. For each part C kind, add `ANCHORS` (front, side, neck) by grid, then add the kind to each heal JSON art block's `kinds`.
3. Wire O2, O3, R1–R5, C1/C2 and B1; their slots are named in the heal JSONs.
4. The limb cloth tint, then diagnosis on the art.
