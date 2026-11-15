# s20-b2-samosa: samosa joins the kitchen frame (15 Nov)

Files: `samosa.js`, `samosa.json`, `kitchen-frame.md`. No frame option added. BEFORE evidence: not played at launch.

## Round 1 (merged, ca95c57)
Samosa reads only the frame (frame-counts 12 → 0): x positions as shares of `play.w`, board and hob centred in `play`, `bottom`/`view()`/`px` for the screen's sums. The spoon is drawn with the hob (SH-280 part). The frame-waiting rows: SH-239, -241, -53, -238, -236, CK-82, SH-272, -278 at 0 on their checks; SH-245, -248 built; SAM-40, SH-271, -284, -277 wait on the kit; SH-279 on Sprint 21. contract-112's fold fault: fixed in the check (685cae1).

## Round 2: the Fable eye judge's rows (decision 38)
| Row | Now | Proof |
|---|---|---|
| SAM-42 | built | while a light is up on the fold, no arrow; the kit's drag finger (gate data: `ob-finger`, drag, 0.8 s after the fold's light). With no light, the arrow stays (SAM-21) |
| SAM-43 | built | the close-up in the board's upper part; the waiting strips whole at their filled size along its foot, inside the rim, 36 below the close-up |
| SAM-44 | line built; browning already so | the step stays the lift between lifts once all are in the oil ("Tar!" no longer comes back). A probe of the textures: raw → part → cooked over about 9 s, fully cooked at the lift |
| SAM-45 | built | praise card to the face's right (as chai's), over the plate's rim; the empty thalis stay on the tray |
| SAM-46 | 3 of 4 built | word pop kept on the board; heaps centred in the bottom row; the karahi's handles inside the hob. **Not done:** the pastry's own shadow: SH-268 and contract-120 say the board's shadow is its shadow |

**What a child sees (L1-L4, every size):** the fold shows a finger, not an arrow, while lit; the pastry waiting is whole beside the one being folded; "Tar!" no longer returns mid-lift; the tray keeps its thalis; the "Shabash!" card is right of the face; the karahi is a little smaller (its right handle inside the hob); the fillings sit centred on the tray.

## Calls taken while Zafar was away
1. **SAM-43, three or more waiting (L3, L4):** they overlap left to right at their filled size, each one's filling showing. Other option: a row of smaller strips, each whole.
2. **SAM-43, "true size":** the size they were filled at (about half the close-up). Full size cannot fit beside the close-up on the board.
3. **SAM-46, the pastry's shadow:** left as SH-268 has it. Question for Zafar: give the pastry its own shadow on the board, against SH-268? Recommend no.

## Proof
- **frame-counts:** samosa 0, chai-tray 0. **checks.mjs:** 14 steps ok (unit 1014 pass).
- **Samosa gate**, final code (gate-20261115T1217-samosa): `GATE PASS samosa: checks pass 2.9, contract pass 13.6; 16.5 min` (0 blocking over 28 pages; advisory 16). Before the gap change: gate-20261115T1152-samosa, PASS, 16.6 min.
- **Chai gate** on f8eea9d's reference (gate-20261115T1304-chai-tray): `GATE PASS chai-tray: checks pass 2.4, contract pass 22.4, boxes:chai-tray pass 3.4; 28.3 min` (0 blocking over 38 pages; **boxes identical**). The run before it (gate-20261115T1233) failed on the old reference: the kit's SH-307/309 changes, which f8eea9d re-took.
- **Side by side:** `build/screenshots/sidebyside/samosa-L1-20261115-1147/` (L1, 740x320 and 1280x665; contract-78 x2, as before).
