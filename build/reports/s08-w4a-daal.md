# s08 wave 4A, daal (builder report; not judged)

Branch `worktree-agent-ace978fbf156d6b1d` from 8859a9cc, not pushed. Detail, proof and QA notes: `build/reports/s08-w4a-daal/details.md`.

## Flaws first

| # | Flaw |
|---|---|
| 1 | DP3's tadka, veg and done discs show curry leaves, a dried chilli and coriander no order has (DAAR-16), so they are unused: plain daal with DP1's pieces, the tadka under it. A question for Zafar |
| 2 | DP2's floor sits about 31 px below the rim's centre; DAAR-31 may still read not quite top-down (art) |
| 3 | L4 folds the chop card (level table, 19 Oct, newer than P54): dotted rows show at L3; the L4 strip is a tool failure |
| 4 | Staged rows moved from L2 to L3 after contract-35 broke at L2: not re-run |
| 5 | Stir line is three joined pieces, "Firai! Ba! jaldi"; Mum's sentence still needed (DAAR-26) |
| 6 | New, seed-dependent: the "laal marcha" chip on the L1 shelf at 9.4 px (shared Kit.chip) |
| 7 | Not run: the touched sandbox, the load check, the chop, stir and tadka labs, clinic taste, the kitchen daal, sizes but 1366x768 (about 20 min browser) |

## What changed

- A top-down pot whose contents are a disc turning under a still rim.
- The mat fades after the pour; the pour's splash is a soft ripple, not a white ring.
- A flag at 12 o'clock: a lap counts as the ladle passes it, with the click, the dial's number and the spoken number at once.
- No stir pop-up: Nani says the whole line once, with a speed, at every level.
- The chop's waves follow on with no gap; each item counts for its own wave; from L3, rows she has not called yet are dotted.
- New contract checks 65 (chop waves) and 66 (stir at the flag), with tests and evidence probes.

## Proof

| Check | Red | Green |
|---|---|---|
| contract-65 | 12 breaks (gaps 1-2 s between waves) | 0 |
| contract-66 | no laps logged; old laps 46-117° from 12 o'clock | 0 |
| contract-22, 30, 36 (daal L1-L4) | 0 | 0 |
| checks.mjs | | ok, load not run |

## Filmstrips (`build/screenshots/s08-w4a-daal/`)

| Strip | Files |
|---|---|
| Pot states | pot-states-L1..L4, each with a -red twin |
| Pour | pour-green/red-L1 |
| Stir | stir-green-L1, stir-green-L4, stir-red-L1 |
| Chop card | chop-card-green/red-L3 |
| Chop | chop-green/red-L4 |
| Mat | mat-L1/L4-green-red |
