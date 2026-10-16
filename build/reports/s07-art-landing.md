# s07 art landing: dumps 3 and 4 judged (16 Oct 2026)

Both ChatGPT dumps were moved out of `assets/` into `sources/art/s07/` under the run log's save-as names. Files 1–30 of dump 3 were named from the pictures, by eye. Rejects and the duplicate are in `sources/art/s07/extra/`. The latest log is now `sources/art/s07/s07-art-run-log.txt`. **73 pictures kept** (72 landed and 1 mirror), **2 rejected**, **1 duplicate**. Flaws come first in every row.

## Flaws first

| ID | File | Verdict | What's wrong | Usable how |
|---|---|---|---|---|
| GS1 | `extra/girl-w4-front-sore-v2-REJECT-wink.png` | **FAIL** | She shuts one eye and keeps the other open, so it reads as a wink. CLN-136 says she never winks. The plan's GS1 prompt asked for "ONE eye squeezed shut", which clashes with that row. | Not usable. Redo with both eyes open: brows up, mouth "ow". Fix the prompt in the plan first. |
| DA2-QR | `extra/doctor-a2-stand-3q-right-point-left-v1-REJECT-not-turned.png` | **FAIL** | He never turns right. The body is still three-quarter left and the head looks left, like the DA2 base. | Not usable as QR (only as a spare DA2). Redo. |
| K1 | `k1-kitchen-master-v1.png` | FAIL (best of 3) | The island's back edge sits at 66.6% down the frame; it needs about 79%. The trays sit at 28.5%, 50% and 71.6% across, which is right. No text. The Kutch mirror-work hanging is fine. | Only with a recut: crop about 160 px off the island front, then extend the top. Otherwise redo. |
| N1–N5 | `nani-n1…n5-lean-*-v1.png` | FAIL on the measure; N1 approved by Zafar | The counter's back edge is at 72.6% in all five; it needs about 82%. N2, N3 and N5 are true edits of N1 (mean pixel diff 2–3). N4 is a new picture, so its body and arm don't line up with N1. Faces read well. The hijab is modest, she wears glasses, and N5 has both eyes shut. | Cut her above the counter line and seat her on the kitchen island, or move the layer down. N4 is its own pose, not a frame to swap in. |
| B1 | `b1-plaster-level-colours-v1.png` | FAIL (best of 3) | Row 1 is drawn top-down, not from the belt camera. Plasters fill about 89% of the cell width. | Use rows 1 and 2 as tray (top-down) views. For the belt, squash vertically in the cut or redo row 1. |
| B2 | `b2-bandage-colours-v1.png` | FAIL (best of 3) | Row 1 rolls are angled, not level, and fill about 85% of the cell. The yellow roll is near the right edge. | Row 2 (side-on cylinders) can serve as both belt and tray views. Skip row 1. |
| B4 | `b4-reflex-hammer-sheet-v1.png` | FAIL (best of 3) | Oversized. Cell 1's handle runs into cell 2. Cells 3 and 5, and cells 4 and 8, are near-duplicates. Soft shadows (artjudge: edge 9.8%). | Cut by component, not by grid. Cell 1 = belt, cell 4 = tool. |
| B6 | `b6-drill-sheet-v1.png` | FAIL (best of 3) | Cells 1 and 2 show the same view. The close-up (6) is oversized. Soft edges (7.4%). | Cell 1 = belt, cell 4 = tool, cut by component. |
| B7 | `b7-filling-tube-sheet-v1.png` | FAIL (best of 3) | Tubes fill about 90% of the cell. Tube 1 reaches cell 2. Cells 1 and 2 are near-identical. No text. | Cut by component. Cell 1 = belt, cell 4 = tool, cell 7 = fill. |
| B10 | `b10-eye-patch-sheet-v1.png` | FAIL (best of 3) | Straps reach the cell boundaries. Cell 1's strap is about 1% from the left edge. | Cut by component. Cell 1 = belt, cell 4 = in use. |
| DM2 | `dm2-levers-drops-v1.png` | FAIL (best of 3) | The four drops are glossy and could read as sweets (the plan says matte syrup; non-negotiable 16). The levers are good. | Use levers 1–2. Matte the drops in code or redo them. |
| CP1 | `cp1-chai-pan-tilt-v1.png` | FAIL (best of 3) | Slightly oblique, not straight down. Cells 1–4 barely differ in tilt. Soft shadow under each pan (12.9%). Column 3's handles touch the right edge. | Cell 1 = flat, cells 5–6 = pouring (milk / black tea). Tilts 2–4 are weak. |
| PT1 | `pt1-potato-v1.png` | FAIL (best of 3) | The cube and the pile are drawn three-quarter, not straight down. The flesh is matte cream and doesn't read as butter. | Cells 1–2 as top-down. Cells 3–4 only if the chop station can take a three-quarter view. |
| DT3 | (missing) | MISSING | The log lists it as item 20, but it is in neither dump: there are only 5 square waving pictures, and DD2 is a pixel edit of DD1. | Download it again from `/c/6ad15301-…` (option 2). |

## Passed

| ID | File | Verdict | Note |
|---|---|---|---|
| DW1, DF1, DF3 | `doctor-w1-stand-3q-neutral`, `-f1-stand-3q-talk`, `-f3-stand-3q-blink` | PASS | Looks like his sheet: bald, white side hair, solid white beard, clear rectangular glasses, navy check blazer, white open shirt, charcoal trousers, brown shoes, watch on his left wrist. No bag or stethoscope. DF1/DF3 are clean edits. |
| DW1-F/HL/QR/HR | `doctor-w1-stand-{front,side-left,3q-right,side-right}-neutral` | PASS | Hands natural, watch on the correct wrist. |
| DA1 + F/HL/QR/HR | `doctor-a1-stand-*-folded` | PASS | Watch shows in every view. |
| DA2, DA2-F, DA2-HL | `doctor-a2-stand-{3q,front,side-left}-point-left` | PASS | Pointing hand is good. |
| DA2-HR | `doctor-a2-stand-side-right-point-left` | PASS-with-note | He points right, the way he faces, not left. |
| DA3 + F/HL/HR | `doctor-a3-stand-*-finger-up` | PASS | |
| DA3-QR | `doctor-a3-stand-3q-right-finger-up` | PASS-with-note | Only his head turns right; the body stays three-quarter left. |
| DA4 + F/HL/QR/HR | `doctor-a4-stand-*-arms-up` | PASS | Five fingers on each open hand. Skin is a little lighter than his sheet (ΔE 5–7). |
| DA5 + F/HL/QR/HR | `doctor-a5-stand-*-torch` | PASS-with-note | The torch is held at face height and reads more like a silver pen (no lens glow). In QR only the head turns. |
| DA6 + F/QL/HL/HR | `doctor-a6-stand-*-wave` | PASS-with-note | DA6 waves with his far arm (logged). QL has a 3 px speck above the raised hand: paint it out in the cut. |
| DD1, DD2 | `doctor-d1-door-call`, `doctor-d2-door-look` | PASS-with-note | Zafar's new brief: standing and waving, so artjudge's "runs off the right" framing check no longer applies. Square 1254 px canvas, so register it to DW1 in the cut. DD2 = DD1 with a closed smile. |
| DT1, DT2, DT4 | `doctor-d1-wave-{3q-left,side-left,side-right}` | PASS | Beards are solid; no skin-coloured blobs at zoom. DT4's cheek is a little thinner. |
| GB1, GM1 | `girl-b1-front-blink`, `girl-m5-front-mouth-open` | PASS | Both eyes shut; mouth open with teeth showing. Clean edits of her seated front picture. |
| GN1-HL/QR/HR | `girl-w13-standing-{side-left,3q-right,side-right}-neutral` | PASS-with-note | Modest: long sleeves, leggings. The mouth keeps a slight closed smile rather than the neutral the plan asked for. QR is a mild turn. |
| GN1-QL | `girl-w13-standing-3q-left-neutral-v1.png` | PASS-with-note | **A horizontal mirror of QR, made here.** Her design is symmetrical (centre parting, matching plaits and bows, plain dress, paired sandals), so it reads correctly. Only the key light flips to the upper right. |
| RP1 | `child-p1-sole-v2.png` | PASS-with-note | Toes nearly level. Skin ΔE 7.4 from the family render, so colour-correct it. |
| I1 | `i1-dirt-bits-v1.png` | PASS-with-note | Eight cells are there. artjudge counts 7 pieces because the soft clouds (cells 1, 8) and grain scatters (4, 7) key out poorly. Cut by grid cell. Colour is orange-sandy. |
| I2, TD1, DM1 | `child-k4-knee-bump`, `td1-tooth-drill-view`, `dm1-drop-machine` | PASS | |
| B3 | `b3-thread-colours-v1.png` | PASS-with-note | Cell 4's thread tail is 1.5% from the right edge. |
| B5 | `b5-drops-colours-v1.png` | PASS | Correct belt camera; caps in row 2. |
| B8 | `b8-taste-things-v1.png` | PASS-with-note | The spoons sit at their cell's right edge. |
| B9 | `b9-decoys-belt-v1.png` | PASS-with-note | The tissue and tumbler have soft edges (11.4%). The stethoscope sits near its cell edge. The torch is off. |
| SK2 | `sk2-sekelo-plate-skewers-v1.png` | PASS-with-note | Took the "Bamboo" option. Handles overhang the plate rim, and the right column is 1.5% from the edge. |
| DP1 | `dp1-daar-pieces-v1.png` | PASS-with-note | The tomato looks a little wet. |

Every doctor picture's skin is within ΔE 1.6–8.1 of `doctor-ref-faces-v1.png`. artjudge's skin FAILs on DD1, DD2, DF1 and DF3 (ΔE 12–13) compare him to the cartoon family render (#F39861), and his own sheet is itself ΔE 15.6 from that render. They are not real flaws.

## Duplicates

`extra/sk2-sekelo-plate-skewers-v1-dup-option2.png` ("Four Trays of Wooden Skewers"). The plates are less even; it was ChatGPT's second option. No other duplicates: the five "Celebrating" files are five different views. The DA3-F and DA4-F "(1)" copies the log warned about were not in the dump.

## Missing vs the plan

- GN1 base (`girl-w13-standing-neutral-v1.png`, front) was never downloaded.
- DT3 (`doctor-d1-wave-3q-right-v1.png`) is missing.
- GS1 needs a redo, with the prompt fixed for CLN-136.
- DF2 and DF4, his box and card faces, are cut from `doctor-ref-faces-v1.png` and need no prompt.
- artjudge doesn't cover the 33 turn pictures or GN1-QL (they aren't in `build/tools/art/specs/s07.run.yaml`), so they were judged by eye only.

## Proof

- `python3 build/tools/art/artjudge.py --spec build/tools/art/specs/s07.run.yaml --dir sources/art/s07`: 39 images, 24 PASS, 10 FLAG, 5 FAIL. The FAILs are the four skin results above and I1's piece count.
- Edge rows were measured from the luminance step in a column band: K1 at 66.6%; N1, N2 and N4 at 72.6–72.7%.
- Edits were checked by pixel diff: DD1→DD2 mean 1.8, N1→N2 3.3, N1→N5 2.1, N1→N4 17.4.
- The contact sheets and zooms used to judge are in the session scratchpad (`sheets/`).
