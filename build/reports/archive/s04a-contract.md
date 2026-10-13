# S04-A: the contract checks

Branch `ccr-a7370759-t0lee7`. Runs `s04a-contract` (route, 1366x768) and `s04a-contract-phone` (844x390). Game code changed: no (build/sandbox, build/tools/review, docs only).

## Flaws first
1. **Z1's corner is not reproduced.** The diagnosis bubbles break (the patient's "I don't feel well." sits at her feet, the doctor's covers his head at a phone, `c03-bubble.png`, `c04-bubble.png`), but no run put one "way up in the right-hand corner". The corner rule is in the check.
2. **The pantry spill (Z5) leans on an estimate.** Cook's pantry lines play nothing in the headless build, so the check bounds a silent line by its words' clip lengths (about 0.45 s a word without one). The real clip spills too ("Atto.", 382 ms), but that run is short.
3. Contract-1 also flags the waiting room and the diagnosis (no pop-up before their first order). Decision 53 implies they need one; Zafar should confirm.
4. 27 rows say "auto: contract check" but lie outside the six items, so no check covers them yet: SH-03, SH-10, SH-16, SH-17, SH-22, SH-23, SH-53, SH-58, SH-70, SH-71, PAN-04, PAN-14, MAA-14, SEK-03, CK-22, CK-23, CK-27, CLN-06, CLN-30, CLN-45, CLN-85, CLN-113, CLN-114, CLN-118, ART-05, ART-18, PRC-08.
5. The laptop run came before the moment-shots (`c<NN>-*.png`), so its breaks cite the nearest state shot.
6. labs.html tiles with no flow (`run.mjs --list`): the old dev pages, the demo test adapters, the reference sheets and clinic free play (locked). The clinic's lab.html tiles map to the clinic.html flows (same plug-in and host).

## What was built
Six checks (`lib/contract.mjs`; how each measures: `contract.md`, testing.md). They run on every `--check` (never ratcheted) and alone as `--contract`. Also: a probe and clip lengths and stops (`contract-hook.mjs`, `sound.mjs`), the retired-art list (`retired.mjs`), `lab:cook/*` and `#speed1` flows, `clinic:morning@L2/@L3`, `--list` tile map, touched/regress wiring, one fixture test per check.

## Zafar's 8 Oct points, reproduced on the pre-fix build
| point | check | flow @ size | shot |
|---|---|---|---|
| Z5 pantry voice spill | 3 | lab:cook/round#speed1, cook:fetch#speed1 @ 1366 | 07-order-start, 09-results-badges |
| Z2 no pop-up, chaat L4 | 1 | cook:chaat@L4 @ 1366 | 09-kind-tap |
| Z6 pantry pop-up | 1 | lab:cook/round @ 1366 (speed 3 run c1) | 03-pantry-kind-tap |
| Z7 waiting-room button | 2 | clinic:waiting, clinic:morning @ 1366 | 03-between-stages |
| Z1 diagnosis bubble | 4 | clinic:diagnosis@L2 @ 844x390 | c03-bubble, c04-bubble |
| Z4 bulb badge early | 5 | cook:fetch#hint @ 844x390 | c08-badges |
| Z8 old knife, Chop tile | 6 | cook:chop, lab:cook/chop @ 1366 | 05-kind-slice |
| Z9 standing Nani | 6 | lab:cook/round#speed1 @ 1366 (cleared once S04-C's redraw landed) | 08-order-view-service |

## Proof
- `node --test build/sandbox/*.test.mjs`: 16 pass. `checks.mjs`: unit 229 pass, words 0, bump ok. `loadcheck.mjs`: 21/21.
- Contract route: 9 pages, all reach their end, 0 new lint findings, 34 breaks (`contract.md`). Phone: 5 breaks.
- Browser time about 14 minutes. `touched.mjs` lists every flow (the sandbox itself changed), so the full pass is left to the orchestrator's `/review`.
- QA: checklist n/a (tooling), shots looked at by the builder: knife, standing Nani, diagnosis bubble, badges. PRC-07 → built, not re-played.
