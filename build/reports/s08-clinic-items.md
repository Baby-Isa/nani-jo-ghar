# s08-clinic-items: five judged s08 pieces stitched into the clinic (16 Oct 2026)

**Done.** The doctor turned to her (3q-left) now talks and blinks (DT-QL, DB-QL), and his card face is the new face sheet (doctor-faces-v3, cut by component). The old s07 faces are gone. Her sore face is GS1, both eyes open: it replaces the winking W4 sitting and standing, and the diagnosis shows it again (HURT is `ouch`, not `sad`). The drops falling into the syringe are DM2's matte drops. The belt plaster is B1 v2 (row 1, and cell 5 for skin), level and about one belt item wide. A two-colour plaster keeps its flat sprite.

**Not used.** DM2's levers: their cream knobs drop the tube colour that today's drawn knobs carry, and the colour levels need it. B1 row 2: the tray views stay as they were.

**Flaws, worst first.**
- The drop machine is still drawn in code. Shaded drops in a flat syringe look like two styles; DM1 (kept) is not wired.
- GS1 reads more "ow, surprised" than sore. The sad face read more unwell.
- The doctor's card portrait is a closer crop than before: his bald crown touches the circle.
- The far lens of his 3q-left glasses has a grey edge. This is in the neutral already.
- Old `girl-face-pain*` and `girl-head-pain` files are kept but no longer used.
- The skin is 1.3 to 1.6 ΔE off on the swapped faces, the same as the live front faces.

## Proof

All shots are in `build/reports/s08-clinic-items/`: `before-*` (9914c9f5) and `after-*`, each at 800x360 and 1366x768. The zooms are paired, before over after.

| piece | what was measured | shots |
|---|---|---|
| 1 DT-QL, DB-QL | Cut with `artcut.py specs/s08.cut.json --only doctor2-3q-left`. Neutral byte-identical. Shift 0,0 (phase correlation on the head band: talk +0.02,−0.25 px, blink −0.04,+0.05); leak 0.00%. Skin matched: on unchanged skin, talk ΔE 1.41→1.00, blink 1.07→0.39 (live front talk 1.62). The game's own `__talk` on 3q-left shows the talk layer. | `*-doctor-talk-*`, `*-doctor-blink-*`, `*-stand-doctor-talk-*`, `zooms-before-over-after-*` |
| 2 faces v3 | Spec job `doctor3-faces` (cells by component), 144 px as before. `doctor.box` and Kit's fallback repointed; `patients/doctor/faces/` deleted (nothing used it). | `zooms-*` (3rd) |
| 3 GS1 | Spec job `girl-wide-sore` (the girl-wide job again: girl-front 0 px differ). Shift 0,0 (body band +0.01,−0.03), skin 3.26→1.00. Standing: `s08-clinic-items.tostand.py` (scale 1.220; check: sitting sad moved onto standing sad, IoU 0.997). | `*-girl-sore-exam-*`, `*-girl-sore-stand-*` |
| 4 DM2 | `s07-clinic-b.beltcut.py` (now with s08 sources and `--out`); `boing.json art.drops`, drawn in the old teardrop's box | `*-drop-machine-*` |
| 5 B1 | The same cutter, 0.6 width; `clinic.json` plaster `img`/`imgs` | `*-belt-*`, `belt-before-over-after-*` |

Sandbox `--flow clinic:diagnosis,clinic:diagnosis@L3,clinic:pharmacy,clinic:pharmacy@L2,clinic:heal-boing,clinic:sendoff,clinic:patient --sizes 800x360,1366x768 --check --no-sheets`: 14/14 pages reached the end, contract 0 breaks, 0 new findings. `checks.mjs --only unit,static,leak,load,size,docs` all pass: unit 336, static 0 new, leak 17 configs, load 29/29, size 347 MB, docs within limits; `artcheck.mjs` 260 known, 0 new.
