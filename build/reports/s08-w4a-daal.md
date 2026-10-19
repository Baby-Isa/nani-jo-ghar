# s08 wave 4A, daal (builder report; not judged)

Branch `worktree-agent-ace978fbf156d6b1d` from 8859a9cc, not pushed. Detail, proof tables and the QA notes: `build/reports/s08-w4a-daal/details.md`.

## Flaws first

1. DP3's tadka, veg and done discs show curry leaves, a dried chilli and coriander no order has (DAAR-16), so they are left out. The pot shows plain daal with DP1's pieces, and the tadka lies under it. A question for Zafar.
2. DP2's floor sits about 31 px below the rim's centre. The pot may still read as not quite top-down (DAAR-31, an art matter).
3. L4 folds the chop card (the level table, 19 Oct, newer than P54), so the dotted rows show at L3 only. The L4 strip is a tool failure.
4. The staged rows' move from L2 to L3 (after contract-35 broke at L2) was not re-run in a browser.
5. The stir line is three joined pieces, "Firai! Ba! jaldi". Mum's sentence is still needed (DAAR-26).
6. New, depending on the seed: the "laal marcha" chip on the L1 shelf shows at 9.4 px (shared Kit.chip).
7. Not run: the touched sandbox, the load check, the chop, stir and tadka labs, clinic taste, the kitchen daal, and every size except 1366x768. About 20 min of browser time.

## What changed

- A top-down pot whose contents are a disc turning under a still rim.
- The mat fades after the pour.
- The pour's splash is a soft ripple, not a white ring.
- A flag at 12 o'clock: a lap counts as the ladle passes it, with the click, the dial's number and the spoken number at once.
- No stir pop-up. Nani says the whole line once, with a speed, at every level.
- The chop's waves follow on with no gap, and each item counts for its own wave. From L3, rows she has not called yet are dotted.
- New contract checks 65 (chop waves) and 66 (stir at the flag), with tests and evidence probes.

## Proof

- contract-65: red 12 breaks (gaps of 1-2 s between waves), green 0.
- contract-66: red found no laps logged and old laps 46-117° from 12 o'clock; green 0.
- contract-22, 30 and 36: 0 breaks on daal L1-L4.
- checks.mjs passes, apart from the load check, which was not run.

## Filmstrips

`build/screenshots/s08-w4a-daal/`:
- pot-states-L1..L4 (each with a -red twin)
- pour-green/red-L1
- stir-green-L1, stir-green-L4, stir-red-L1
- chop-card-green/red-L3
- chop-green/red-L4
- mat-L1/L4-green-red
