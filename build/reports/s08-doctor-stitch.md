# s08-doctor-stitch: the grandad's new look, set back in the room

Zafar, 16 Oct: the old doctor next to the girl "looks copy and pasted"; "him and the girl both need to be a tad further back into the room and smaller".

**The look.** He is the s08 cartoon man in every room (`specs/s08.cut.json`, `assets/clinic/patients/doctor/v2/`). Talk and blink sit on their neutral with 0,0 shift and 0.00% leak. ECC drifted 3 px on the mouth, so the cutter gained `face_align: none`. Each edit's skin is matched to its neutral (ΔE 3.3 → 1.1 or less): no flicker. Point and talking-hands are cut but not staged. The old files are gone.

**Missing.** 3q-left is neutral only, so it bobs while he talks. When DT-QL and DB-QL land, re-cut and add `views["3q-left"].faces`: data only. The card portrait stays the s07 face until `doctor-faces-v3.png` lands; then re-cut it and repoint `doctor.box`.

**The placement.** Both are further back and smaller, on one feet line, him 1.45x her. He is sized as a 1.75 m man by the room's 2 m door (`scenes-v2.json` `horizon`, `door`). Her tap areas are padded back to today's size (`tapBody`, `tapBig`). The `plane` check fails the CLN-154 numbers and passes the new ones.

**Flaws.**
- Seated, she is now her art's 1x size, not 1.3x (D1's "make her bigger"). Her taps are unchanged, but on a phone her face is small. Zafar should look.
- A turn shifts his skin ΔE 2.5-2.7.
- The waiting room is unchanged.

## Proof

| what | where or result |
|---|---|
| shots | `build/reports/s08-doctor-stitch/before-*`, `after-*`: `exam` (clinic:diagnosis), `exam-L3` (clinic:diagnosis@L3), `stand` (the D3 check-up), `door` (clinic:sendoff), `waiting` (his wave at his door), each at 800x360, 844x390, 1366x768; `after-sandbox-morning-L3-*` |
| numbers | `before-plane.json`, `after-plane.json` (`build/tools/review/shoot_plane.mjs`); shares of the room |
| hit test (a tap 0.95 of today's radius out, that part alone) | stand 30/30 before and after; exam 28/30 both (mouth and tooth share a spot); smallest area 5.0-9.7 px, unchanged |
| skin ΔE, edit vs its neutral, after matching | front talk 1.07, blink 1.07; 3q-right talk 1.07, blink 1.00; wave closed 0.39 |
| sandbox: 4 flows (diagnosis, diagnosis@L3, morning@L3, sendoff) x 800x360, 1366x768, `--check --no-sheets` | 8/8 pages reached the end; contract 0 breaks; 0 new findings |
| `checks.mjs --only unit,static,leak,load` | unit 336 pass, static 0 new, leak 17 configs, load 29/29; `artcheck.mjs` (no `art` id in checks.mjs) 0 new |

| room | feet line, hers / his | him | his height ÷ hers | his height ÷ the door | her crown, as a share of his height | hand tap radius, px (800 / 844 / 1366) |
|---|---|---|---|---|---|---|
| stand | 0.91 / 0.91 (phone 0.95) → **0.80 / 0.80 (0.84)** | 0.85 → **0.73** | 1.44 → **1.45** | 1.25 → **1.07** | 0.69 → 0.69 | 12.4 / 13.3 / 23.9 → **same** |
| exam (sitting) | his 0.84 → **0.80** (bed's front legs) | 0.76 → **0.71** | sitting 1.36 → 1.65 (1.41 to her standing size) | 1.11 → **1.03** | — | 9.6 / 10.3 / 17.7 → **same** (pad 1.3) |
| door | 0.822 / 0.88 → **0.77 / 0.77** | 0.64 → **0.60** | 1.52 → **1.45** | 0.99 → **0.92** | 0.75 → 0.69 | — |
