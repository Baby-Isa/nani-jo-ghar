# A2: the clinic on the girl's finished art (5 Oct)

**Mechanics changed: none.** Staging changes: the D3 check-up sits her on the bed, because her art has no standing pose. The square exam room (R3) shows tablets the whole room. **Old art reused:** CB2b, items-v2 blanket and thermometer, Cook's chart icons.

## Images judged (plan §7, flaws first)
- **Fail:** O2's four spots read as sweets (I2). They are not cut, and taste keeps its drawn spots. Needs a redo.
- **Notes:** R3 is slightly redrawn, so CB2b is kept in its middle; R4 is registered by SIFT.
- **Pass:** O3, R1, R3, R4, R5, C1, C2, B1, and O2's decay and filling. Cuts are clean on cream and black.

## Wired (girl)
- **fever:** window, fan, gauge, R1's things.
- **tooth:** decay and filling in the drilled outline; B1 button and nozzle.
- **taste and ear:** O3 bud.
- **eye:** C1 rows on its ruled lines; C2 by its corners.
- **diagnosis:** her W1 on the bed, taps and magnifier on the art. **Send-off:** her own face per feeling.
- **G26:** grep finds no `HS.ph("…")` and no `kutchi: "…"`. Uses Mum's *kan*, *garam*, *thundo*; lukewarm, bandage and "To the counter" are to record.

## Stand-ins left
- Boing's arm (U1 failed).
- Foot L3 (the art's toes slope).
- Taste's spots (O2 failed).
- Her send-off body (no standing pose in part B).
- Other kinds (part C).

## Found and fixed
- On tablets the cut game couldn't end: the arm's slide pushed the graze off screen.
- The fever fan and window tap boxes left phone screens.
- A *leg* asked in diagnosis was hinted on the knee.

## Proof
- `check_onboard` and 13 clinic leak scripts pass.
- Sandbox `--touched` (nine games, patient, diagnosis, send-off; L1–L3, `#mistake`, `#hint`, all 8 sizes): every page ends, 0 page errors.
- `--check`: after the fixes, cut ends everywhere and fever passes; the waiting room's `tap-small` is known.
- Rotate card passes.

## Flaws for the reviewer
- On 4:3 tablets the cut game's fingertips reach under the tool column.
- At 800×360, "too cold" covers the bottle, and the chart icons are small.
- Mouth and tooth share one spot (her mouth is closed).

**Screenshots:** `build/screenshots/sandbox/a2-touched/`, `a2-touched-fix/`, `a2-fever-fix/`, `a2-rotate/`, `a2-midgame/`.

**QA:** TXT ✅ · LAY ⚠ (above) · CMP ✅ · LNG ✅ · INT ✅ · ART ✅ (O2 fail) · CUL ✅. Rechecked: CLN-17, 43, 50, 61, 67, 74 (⚠ tablet).

## Left for part C/D
- O2 spots and U1 redo.
- A standing pose for the send-off.
- Toes for foot L3.
- Part C anchors and taps.
- D1/D2.
- Baseline update (913 fixed).
