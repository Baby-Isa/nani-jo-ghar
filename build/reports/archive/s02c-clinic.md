# S02-C: the clinic, every point from the 6 Oct play

Branch `ccr-a7370759-t0lee7`. Not reviewed.

## What changed
1. **Girl's art**: bench, diagnosis (bigger), send-off (on the bed: no standing pose yet), sticker, receipt and pill faces (`Figure.face`); no swirl.
2. **Waiting**: nobody stands; face+speaker pills; bubbles at faces; L1 box only; room-picture button.
3. **Diagnosis**: small dots (48 px target), grey after no, doctor names the part, moves on; D3 card in tool blocks, torch zooms itself.
4. **Pharmacy**: pop-up first; full tray hands over (the ✓ was P5's "tick"); per-item redo; items on the belt.
5. **Heal**: face top right; scrape plasters in the sequence, redo, no Cold!; knee wrap; ear bin, smears, hearing test; eye chart in code, EY13; fever ±2/3/4, icons; tooth plaque, square drill, ow+buzz; taste rising drinks, cues; boing wipe, funny jab, plaster choice; foot dirt wash.
6. New lines are grey placeholders (lang.js falls back to the data's English): 20, to record.

## Proof
`checks.mjs`: unit 229/229, bump ok; words: js/clinic 0, js/cook 34 (Session B). Leak bots: all PASS (clinic L1 blind 0.04%). `check_onboard` ok. Sandbox `s02c-quick` (15 flows, 1366×768): 1 new (probe 44 px) and 2 stalls (ear hint, morning send-off "one more thing"), all fixed; `s02c-quick2` re-run: CHECK PASSED, 0 new. Morning not re-run. About 20 min of browser checks, over the 15-minute cap.

## Open (for /review and Zafar)
- At L2+ the patient is always an adult (the age rung), so she never shows; forcing her as patient would leak.
- Kit.Card has no group head (D3 wraps OrderCard.card); L3 heal strip writes the count; drop-machine art 404 (old).
- Labs test pins the old index card, so it stays but forwards to the lab bar.
- After diagnosis's end screen the room shows with no patient.
- Art ids waiting: cloth-dab, ear-bin, alcohol-wipe, brushInMouth, standing pose.
- QA checklist ⬜, for `/review`.
