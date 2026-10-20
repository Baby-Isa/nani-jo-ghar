# s08 wave 6H, the clinic (builder report; not judged)

Branch `worktree-agent-ac0708f3ad92cc41f` from 392837e0, not pushed. Game code changed: yes (js/clinic, data/clinic, css/clinic.css).

## Flaws first

| # | Flaw |
|---|---|
| 1 | The scrape and boing rows still mix Kutchi and grey English ("ne poi [yellow plaster]", "ne poi ba [yellow]"): rule 11 was fixed for the tooth only (the brief's row). |
| 2 | 800x360 eye test: the yes/no pills overlap the board's bottom frame (height unchanged this wave). |
| 3 | 800x360 boing: the tiles take two columns (clear of the machine and the ✓). |
| 4 | 800x360 taste: the drink tiles cover her lips (not this wave's change). |

## What changed

| Rows | Change |
|---|---|
| CLN-119 | The wrong colour was a late line: "ne poi laal plaster" waited in the voice queue and sounded after its step closed, under the yellow row. A card row whose step closes before its turn is now skipped (`kit.js`). New test `js/clinic/heal/colour-clips.test.mjs`: every heal game's line plays only its own words' clips. Tooth and taste list their taught words (data `words`). |
| CLN-184 | Tooth moves with a word still to record are a whole grey line ("First down"), never "Pela [down]" (`HS.whole`). |
| CLN-178 | Fever end: the camera closes on her well face, then zooms back out, and she thanks him in the room. The kept room is laid before the game's room goes. |
| CLN-107 | L1: both pills stay live under the help, so a wrong tap shakes red. |
| CLN-188 | The board is widened as a nine-slice of the real wall picture (no seams): about 52% of the play width. |
| CLN-181 | The tip and the filling use the hollow's own centre. |
| CLN-190 | The wash covers its whole path between finger samples and leaves a wet sheen. |
| CLN-195 | The bud's tile keeps the spot's colour. |
| CLN-189, 165 | Ear's lemon is the whole lemon. Boing: machine 0.8, syringe 150 tall, 1.8:1 tiles, column stops above the ✓. |

## Proof

- Red: evidence ev-20261020-021100-2og (CLN-119 L2: laal.mp3 under "yellow"), ev-20261020-022619-wuv and ev-20261020-023142-5ug. Green: CLN-119 run ev-20261020-021434-2z2 shows nothing played under "yellow". Filmstrips at 1366x768 and 800x360 are in sandbox runs w6h-a, w6h-b, w6h-c and w6h-d.
- Sandbox w6h-touched (9 heal flows, 1366x768): 9/9 reach their end, 0 page errors, 0 new findings, contract passed.
- `checks.mjs`: unit 433 pass, leak 19 configs, load 29/29, docs ok. The words lint is clean on js/cook and js/clinic. check_onboard ok.
- Not rechecked row by row: the 139 regression rows (orchestrator's /review).
