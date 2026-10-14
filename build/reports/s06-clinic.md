# S06 Clinic builder

Branch `s06-clinic`, unpushed. Reds on record unless named.

| Row | Cause → fix | Green |
|---|---|---|
| CLN-140 | host.js strip mode → his box keeps face and step line; scene.js speaks from it | ev-20261014-013834-y6h |
| CLN-143 | eye.js:708 throb glow → none (red ev-20261014-004702-abn) | ev-20261014-004524-xbl PASS |
| CLN-45 | ear.js L3 extras → L4; main.js HEAL_L4; fever.json dead rules | ev-20261014-010700-31u |
| CLN-100 | knee.js repeated dot pairs → new bands | ev-20261014-013834-y6h |
| CLN-104 | taste.js liquid outside cup → clipped to its mouth | ev-20261014-021334-3v9 |
| CLN-37 | boing.js L1 one tube → four | same |
| CLN-138 | probe took back the wipe (red ev-20261014-012501-8fp) → taps a drop | same |
| CLN-106 | wipe 450 ms → 1 s rub (art left) | same |
| CLN-116 | grey flagged `.cl-cert` frame | same |
| CLN-149 | common.js S.request doctorFace → none (red s06-route3) | s06c-149, 0 breaks |
| CLN-26 | not reproduced: she's there at L1; no L4 | ev-20261014-021334-3v9 |
| CLN-126 | not reproduced: fever_bubbles.mjs 6/6 | same |
| CLN-144/145 | tool glow beside the card band (taste nudge, host nextUp) → Card.hush; red s06c-final | ev-20261014-031151-81u PASS; s06c-144 |

Needs js/shared:
- **CLN-118**: host.js times every round, Results shows badges. Patch: runStage `info.taught = !!r.taught`; an all-taught round gets no `timeMs` or best; Results.show `opts.taught` skips the badge page. Clinic passes `taught`.
- **CLN-127**: placeBubble centres above the head, so the tail hits her hair. Patch: `o.face`, above-beside, tail to the face; contract-4 to accept it.

s06c-final: contract-16, -19, lab-min breaks not mine. Notes: hic/taste ladders aren't breaks (hic: blind 11% at 1-3; taste L1 3 pops < L2 4). "Aabhar aanjo!" removed. L3 closed waiting card: an empty strip. Knee L2-3: ✓ mid-wrap.
