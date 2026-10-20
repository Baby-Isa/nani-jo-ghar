# s08 wave 6I, the gate's stuck clinic runs (builder report; not judged)

Branch `worktree-agent-a0c73c15c4b00f0bd` from 8dd4c030, not pushed. Game code changed: yes (js/clinic).

## Flaws first

| # | Flaw |
|---|---|
| 1 | contract-30 still breaks on clinic:morning@L2: the hook leaves the send-off's how-to card (data-howto) out of its card sample, so "One more thing", now its headline, is not seen. Hook change requested. |
| 2 | CLN-179: the probe's seed 7 draws 5 wraps at L3; seeds 2, 6, 9 draw 8. Game unchanged; the spec needs `"seed": 2`. |
| 3 | CLN-106: the probe's `every:step` max 4 only reaches the wipes; the jab and plaster are past it. |
| 4 | ART-12: neck, back and hair need art (a back view, a hair anchor). Not built. |
| 5 | The foot's water is still a drawn stream (art). |

## What changed

| Rows | Change |
|---|---|
| gate | Boing: tools laid first, the machine moved left of the column (4:3: 2-wide column over its levers). Foot: the pour aims only at dirt on the sole, a finger's width clear of the tiles (it pressed the picked tile). |
| contract-16 | Hook tags a player's typed name in its name element (`playerName`); new `contract-names.test.mjs`. |
| CLN-106, 168 | The wipe is one slow cloth rub across and back; the jab plays at its own pace in fast mode. |
| CLN-190 | Dirt runs off at its own pace; the first sweep starts on dirt. |
| CLN-178 | Fever's ending reads `normal` and keeps most of its pace in fast mode. |
| CLN-163 | The one-camera zoom eases with a sine, not a cubic. |
| contract-30 | "One more thing" is the doctor's card headline while said. |

## Proof

| Check | Result |
|---|---|
| Stuck runs | w6i-green-a/b: the 6 runs reach their end (red: w6i-red-a, w6i-red-b) |
| Matrix | boing and foot, L1 and L3, at 7 sizes: 28/28 end (probe) |
| contract-16 | house@1024x768: contract passed; unit test red then green |
| Evidence | w6i-ev-a, w6i-ev-b (CLN-106, 163, 168, 178, 190) |
| 800x360 + 1366x768 | wipe, jab, plaster, wash, fever well: scratchpad strips |
| checks.mjs | unit, words, static, leak 19, bump, specs, size ok |

Regression rows: left to /review (the hook touches every flow).
