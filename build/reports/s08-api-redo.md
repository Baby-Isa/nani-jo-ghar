# s08 API redo: Nani's jaw, the doctor's gaps, the failed s07 items (16 Oct 2026)

Zafar's go (16 Oct): fix Nani and the failed items through the API. Script `build/gen_s08_redo.py` (chatgpt-image-latest, edits, quality and input fidelity high); every try in `sources/art/s08/extra/`. Round 1 stopped when the credit ran out; round 2 ran after the top-up.

Nani's flaw: small lumps either side of the chin, pale patchy spots on the chin and lower cheeks, skin a little orange-red. A full-frame edit changed nothing, so each face was edited as an enlarged close-up, pasted back feathered (outside the face pixel-identical) and its skin median shifted onto #D5906C. The doctor's DT-QL and DB-QL were registered the same way.

## Proof (flaws first; skin ΔE: Nani to #D5906C, before → after; doctor to doctor-front-neutral-v2's face #E08963)

| line | file (`sources/art/s08/`) | verdict | flaw found | skin ΔE |
|---|---|---|---|---|
| 1 | nani-lean-neutral-v3.png | PASS-with-note | 4 tries (2 plain, 2 close-up: working out the method). Jaw one smooth curve, the spots gone; a soft round cheek is left (her face shape kept) | 7.4 → 3.2 |
| 1 | nani-lean-happy-v3.png | PASS-with-note | the faintest bulge is left at her left jaw; light even | 7.2 → 3.2 |
| 1 | nani-lean-talk-v3.png | PASS | smooth jaw and chin, mouth unchanged | 8.3 → 4.2 |
| 1 | nani-lean-blink-v3.png | PASS | both eyes still shut | 7.2 → 3.9 |
| 1 | nani-front-neutral-v3.png | PASS | | 4.5 → 3.4 |
| 1 | nani-front-talk-v3.png | PASS | | 5.4 → 3.7 |
| 1 | nani-front-blink-v3.png | PASS | | 3.2 → 2.8 |
| 1 | nani-3q-left-neutral-v3.png | PASS | | 7.1 → 2.1 |
| 1 | nani-3q-left-talk-v3.png | PASS | | 6.4 → 4.2 |
| 1 | nani-3q-right-neutral-v3.png | PASS | the lumpy chin edge is now smooth | 6.5 → 2.3 |
| 1 | nani-3q-right-talk-v3.png | PASS | | 5.2 → 2.3 |
| — | likeness (all 11) | PASS | hijab framing, round gold glasses, eyes and expressions identical to v2; no seams at 3×; no rings; hands as v2 (soft) | |
| 1 | nani-faces-v2.png | PASS-with-note | round 2: one close-up per cell (`N-FACES-C1..12`, merged with `--merge-faces`). Outside the 12 faces the sheet is v1 pixel for pixel, so the cells stay registered and the gutters clean. Light even, the spots gone; the jaw is smoother, with a faint bulge left at the left jaw in cells 1–2. Cell 5 (laughing) still reads as a wink, as in v1 (left as it was) | per cell 4.6–5.7 → 1.5–3.9 |
| 2 | nani-lean-point-v3.png | PASS-with-note | try 3 of 3. The right index finger points straight down at the counter in front of her; the pearl bracelet is on that wrist; the face is v3's (skin 3.0). Tries 1–2 lost the bracelet. Notes: the forearms now lie side by side, not folded; the pointing hand has slight knuckle creases | 3.0 |
| 3 | doctor-3q-left-talk-v2.png | PASS | mouth open mid-word, teeth showing, brows up; only the face changed | 4.2 |
| 3 | doctor-3q-left-blink-v2.png | PASS | both eyes closed behind the glasses | 4.1 |
| 4 | doctor-faces-v3.png | PASS-with-note | try 1 shifted the cells and had two winks. Try 2 follows v2 cell for cell (cells 6 and 11 have both eyes shut). His new look, 4 clean cells a row. Notes: the column-4 gutter wanders (x 1116–1161) and cell 12 touches the right edge | 2.2 |
| 5 GS1 | items/girl-w4-front-sore-v2.png | PASS | both eyes open and equal, brows up in the middle, open "ow" with the top teeth showing, no wink. Try 1 was a pucker that read as a kiss | – |
| 5 DM2 | items/dm2-levers-drops-v2.png | PASS-with-note | try 1 had three levers and no red drop. Try 2 has the right 3×2; the drops are matte, with no specular shine, and don't look like sweets, but they read a little opaque rather than translucent. Try 1 was overwritten by try 2 (a numbering slip); its preview is in the scratchpad | – |
| 5 CP1 | items/cp1-chai-pan-tilt-v2.png (try 4) | PASS-with-note (the coordinator overrides the builder's FAIL: cut by shape) | round 2, 3 fresh tries. Tries 4–5 (text only, no attachment) finally get the geometry right: a true top view, the handle straight to the right, flat, three plainly different tilts (a growing crescent of bare steel), milk pour, black-tea pour. But the ground is a warm grey-brown gradient with glowing halos round each pan, not flat #808080, even when told outright, so it won't key. Try 3 copied the attached draft's diagonal handle and brown ground. Round 1: oblique, then portrait (my size bug). Not copied to items/. Fix: cut the pans out by shape (circle plus handle) or re-ground in code | – |
| 5 B1 | items/b1-plaster-level-colours-v2.png | PASS-with-note | the coordinator's verdict overrides mine: row 1 reads from the belt angle, and the cut narrows it from about 87% of the cell | – |
| 5 SK2 | (extra/sk2-sekelo-plate-skewers-v2-try3.png) | **FAIL** | try 3 edited try 2: cell 1's skewer now lies inside the rim, but cells 2–4 still stick out past the right rim, and cell 2 now holds three skewers instead of two. Fix: lay the skewers in code on the plain plate | – |

## Calls (27 billed; cost estimated at gpt-image-1 list rates, an upper bound, from each response's `usage`)

| line | tries | size | $ est |
|---|---|---|---|
| NL (pilot + method) | 4 | 2× 1024x1536, 2× 1024² | 1.39 |
| the other 10 Nani lines | 1 each | 1024² close-up | 3.02 |
| DT-QL, DB-QL | 1 each | 1024x1536 | 0.70 |
| DX3 | 2 | 1536x1024 | 0.95 |
| GS1 | 2 | 1024x1536 | 0.71 |
| DM2, CP1, SK2 | 2 each | 1536x1024 (CP1 try 2 1024x1536) | 2.30 |
| B1 | 1 | 1536x1024 | 0.41 |
| **round 1 total** | **27** | | **$9.47** (budget $15) |
| round 2: 12 face cells | 1 each | 1024² close-up | 3.62 |
| round 2: NL-PNT | 3 | 1024x1536 | 1.28 |
| round 2: CP1 (tries 3–5) | 3 | 1536x1024 | 0.85 |
| round 2: SK2 (try 3) | 1 | 1536x1024 | 0.34 |
| **round 2 total** | **19** | | **$6.09** (budget $10); both rounds $15.56 |

Prompts: each line's text is in `lines()` in `build/gen_s08_redo.py`; the Nani close-ups use `CLOSE`. The per-call log (prompt, usage, crop box) is in the session scratchpad at `s08redo/calls.jsonl`.

## Still open
SK2: the API won't keep the skewers inside the rim; the s07 plate stays. Two try files were overwritten by numbering slips (previews in the scratchpad).

Contact sheets, in the session scratchpad:
- `s08redo/nani-jaw-before-after.jpg`: row 1 v2, row 2 v3, rows 3–4 contrast-boosted.
- `s08redo/nani-faces-jaw-before-after.jpg`: per cell, before over after.
- `s08redo/items-before-after.jpg`
- `s08redo/round2-contact.jpg`
