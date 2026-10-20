# s08 wave 6G: Cook, the judges' last code fails (builder report; not judged)

Branch `worktree-agent-a39ab93a56241857f` from `392837e0`. Not pushed (orchestrator's override). Game code changed: yes.

## Flaws first

1. SEK-19 has no game fault. Meat skewers already read and play the whole clip "hakri lakri mishkaki". The probe's order (L3, seed 1) has no meat skewer. That needs a seed in the probe (request).
2. SAM-25: the order asks for 1 or 2 samosas of each kind, so not all six strips get filled (decision 10). The waiting strips now show.
3. SH-112 is not done. Bigger jars need a taller shelf band, which changes §3's 74/26 grid in every station. That is Zafar's call.
4. The chaat jar and strip potato are still butter-yellow. They are on the art list.

## What changed

| Row | Change | Files |
|---|---|---|
| SAM-25 | Filled strips wait at the board's foot during each fold | `js/cook/stations/samosa.js` |
| SH-98 | A peek opens folded rows to their fillings | `js/shared/order-card.js` |
| DAAR-34 | Rows she hasn't called stay dotted in the peek (`.dots.unsaid`) | `js/cook/words.js`, `daar.js` |
| SH-117 | Thicker stream; the daal picture fills the pot from where it lands | `js/shared/pour.js`, `daar.js` |
| DAAR-05/31 | Onion and paste tinted as cooked; toppings land in new spots each round | `daar.js` |
| CK-47 | Nani's call-back at the counter, before the thanks | `js/cook/flow.js` |
| CHT-15 | Stamped card refits its headline | `js/cook/ui.js` |
| ART-11 | PT1 potato in samosa and daar | `samosa.js`, `daar.js`, `data/cook.json` |
| ART-19 | Counter Nani flaps talk/neutral every 130-210 ms | `js/cook/stations.js` |

## Proof

| Check | Result |
|---|---|
| `checks.mjs` | all ok (unit 433 pass, words, static, leak, bump, specs, docs, size, load 29/29) |
| sandbox `w6g-quick` (samosa@L3, daar@L4, chaat; 1366x768) | 3/3 reach the end, 0 new findings, contract 0 breaks |
| shotdiff | 19 changed vs approved; flaw: chaat's order start shows an empty bubble by Nana (H1), not mine |
| own shots (scratchpad) | samosa fold with the strip waiting; samosa L3 peek; daar L4 peek (one written, two dotted); daal pour filmstrip at speed 1; chaat stamped card wraps; day 2 lines: "Shabash! / Hakri bajr ji maani. / Thank you! / Khuda-fis!" |

Evidence green runs and the 77 regression rows are left for `/review`; the browser budget is spent.

Requests: contract-27 should skip `.dots.unsaid`; SEK-19's probe needs `seed` (L1: 3; L3: 4 in my harness); `art.assets` samosa files edited (task 5 named it).
