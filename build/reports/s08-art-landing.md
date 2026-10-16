# s08 art landing: ChatGPT dump 5 (the first lines of the s08 run)

16 Oct 2026, judge subagent. All 28 dump PNGs identified by eye against `s08.run.yaml` and `git mv`'d to `sources/art/s08/<save-as>`; the dump folder is gone from `assets/`. **28 kept, 0 duplicates, none to `extra/`.** Skin ΔE is the median face skin (`artjudge.py`) against the swatch, FAIL over 6 as briefed; the second number is against the approved sheet's own rendered face.

## Skin calibration

| reference | measured | ΔE to swatch |
|---|---|---|
| sheet-doctor-final-1 close-up | #CF8263 (L\* 62, b\* 29) | 8.7 |
| lineup-v4-1 doctor | #CD8164 | 7.5 |
| sheet-nani-final-1 close-up | #D78966 | 4.4 |
| lineup-v4-1 Nani | #D08B68 | 1.9 |

The doctor's swatch #C88A6F fails his own approved sheet. His 14 full-body pictures are really oranger and lighter (L\* 63.5-68.2, b\* 33-37), 6.4-10.4 even from the sheet render. Nani's marginal fails sit within 2.3-5.1 of hers.

## The table

| ID | file (`sources/art/s08/`) | verdict | why (flaws first) | skin ΔE swatch / render |
|---|---|---|---|---|
| DW-F | doctor-front-neutral-v2.png | FAIL | skin lighter and oranger than the sheet. Otherwise right: glasses, beard and hairline match; eyes a little larger with darker brows (the plan allows slightly larger eyes); hands smooth, five fingers; watch on his left; fill 0.91, feet at y 1455 | 13.7 / 6.4 |
| DX | doctor-faces-v2.png | FAIL (skin, by the rule only) | by the swatch rule only, since it sits within 2.0 of the approved render. Otherwise a pass: 12 cells in the asked order, clean grey gutters (4x3 separable), eyes level per row, no text | 10.0 / 2.0 |
| DW-QL | doctor-3q-left-neutral-v2.png | FAIL | skin. 1.4% taller than DW-F, feet line 18 px lower (y 1473 vs 1455). Drawn, not flipped (watch on his left) | 16.6 / 10.4 |
| DW-QR | doctor-3q-right-neutral-v2.png | FAIL | skin. Turn, scale and feet line otherwise right | 16.3 / 8.2 |
| D-WAV-QR | doctor-3q-right-wave-v2.png | FAIL | skin (face and hand). Pose right: arm on the viewer's right, five fingers, big open smile | 17.3 / 9.6 |
| D-WAV-F | doctor-front-wave-call-v2.png | FAIL | skin. Pose right: open calling mouth with teeth, five fingers | 14.4 / 7.0 |
| D-WAVC-F | doctor-front-wave-v2.png | FAIL | skin. The edit itself is clean: only the mouth closed (0.3% changed, 0 leak) | 13.7 / 6.4 |
| DT-F (C0) | doctor-front-talk-v2.png | FAIL | skin. Talking mouth, nothing else moved | 15.1 / 7.8 |
| DB-F (C0) | doctor-front-blink-v2.png | FAIL | skin. Clean blink | 15.6 / 7.7 |
| DT-QR (C0) | doctor-3q-right-talk-v2.png | FAIL | skin. Clean talk edit of DW-QR | 17.0 / 8.7 |
| DB-QR (C0) | doctor-3q-right-blink-v2.png | FAIL | skin. Clean blink edit of DW-QR | 18.4 / 10.2 |
| D-TLK-F (C1) | doctor-front-talk-gesture-v2.png | FAIL | skin (the oranger hands are the most visible). Palms point inwards more than "a little" | 17.6 / 10.4 |
| D-TLK-QR (C1) | doctor-3q-right-talk-gesture-v2.png | FAIL | skin. Pose right, mouth closed | 17.0 / 8.9 |
| D-PNT-F (C1) | doctor-front-point-v2.png | FAIL | skin. Right hand up, finger and thumb apart, as asked | 16.7 / 9.3 |
| D-PNT-QR (C1) | doctor-3q-right-point-v2.png | FAIL | skin. Pose right | 17.8 / 9.9 |
| NL | nani-lean-neutral-v2.png | FAIL (skin, marginal) | skin just over. The counter edge is at 76% (the plan says about 72%; the same in all five leaning pictures). Otherwise right: forearms folded on the marble, no rings, pearl bracelet on her left wrist, likeness very close to the sheet, modest | 6.4 / 2.3 |
| NX | nani-faces-v1.png | PASS-with-note | the "laughing" cell reads as a wink (one eye shut). 12 cells in order, clean gutters, dupatta in every cell, eyes level per row | 5.2 / 1.5 |
| NL-HAP | nani-lean-happy-v2.png | FAIL (skin, marginal) | skin. The happy change is subtle (softer eyes, a slightly wider smile); clean edit | 7.3 / 3.0 |
| NL-TLK | nani-lean-talk-v2.png | FAIL (skin, marginal) | skin. Clean talk edit | 7.7 / 3.7 |
| NL-BLK | nani-lean-blink-v2.png | FAIL (skin, marginal) | skin. Clean blink | 7.2 / 3.0 |
| NL-PNT | nani-lean-point-v2.png | **FAIL (pose)** | **wrong pose: the finger points at her own dupatta and chest, not down and across at the counter top, so it reads as "me".** Skin 9.0. Right hand, elbow on the counter, no rings | 9.0 / 5.1 |
| NW-F (C0) | nani-front-neutral-v2.png | PASS-with-note | bracelet on her right wrist (as on the sheet; the plan says left). Kameez motifs as on the sheet: neck, cuffs, hem band | 4.5 / 1.5 |
| NT-F (C0) | nani-front-talk-v2.png | PASS-with-note | the same bracelet note. Clean talk edit | 4.5 / 1.5 |
| NB-F (C0) | nani-front-blink-v2.png | PASS-with-note | the same bracelet note. Clean blink | 3.1 / 1.6 |
| NW-QL (C0) | nani-3q-left-neutral-v2.png | FAIL (skin, marginal) | skin. Turn, scale and feet line match NW-F | 7.1 / 4.6 |
| NT-QL (C0) | nani-3q-left-talk-v2.png | FAIL (skin, marginal) | skin. Clean talk edit; she looks youngest in this one | 6.4 / 3.5 |
| NW-QR (C0) | nani-3q-right-neutral-v2.png | FAIL (skin, marginal) | skin. Turn, scale and feet line match NW-F | 6.5 / 4.2 |
| NT-QR (C0) | nani-3q-right-talk-v2.png | PASS-with-note | bracelet note. Clean talk edit | 4.5 / 1.9 |

## Proof

| what | how |
|---|---|
| identity of each file | contact sheets and face, hand and edit zooms (scratchpad `s08land/`), against the spec's lines |
| numbers | `python3 build/tools/art/artjudge.py --only <the 28 IDs> --json` (4 pass, 10 flag, 14 fail on its 12/6 thresholds) |
| face sheets | gutter scan: 4x3 clean grey gutters on both |
| counter line | marble edge at y 1173 of 1536 (76%) in all five leaning pictures |
| all | no text (glyph rows 0), flat grey (#74-7B), no rings, modest, no veins |

## Missing

| part | missing | landed |
|---|---|---|
| A | DT-QL, DB-QL (3q-left talk, blink) | 7 of 9 |
| B | none (NL-PNT needs a redo) | 6 of 6 |
| C0 | none | 11 of 11 |
| C1 | 21 lines from D-TLK-QL, D-PNT-QL, D-PL-F on | D-TLK-F, D-TLK-QR, D-PNT-F, D-PNT-QR |

## For Zafar

1. Doctor skin: one skin-only colour-correct of the 14 towards the sheet render (about L\* −3, a\* −3, b\* −6), re-measure; if it fails, redo DW-F and everything after it.
2. Recalibrate the doctor swatch to #CF8263.
3. Nani: the same correct on the seven marginal ones; redo NL-PNT, same prompt and attachments.
4. Next run: DT-QL, DB-QL, then the rest of C1.
