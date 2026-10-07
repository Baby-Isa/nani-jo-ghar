# S02-G: the s02-gate blockers

Branch `ccr-a7370759-t0lee7`. Not reviewed. Game code changed: yes.

## Flaws first
- New on reaching further (not mine, left for /review): end-screen tile clips "thermometer" (clinic:patient@L3, 1366/1440, shared results); clinic card scrolls at 800x360 in the cut game (patient@L2).
- At 4:3 the heal tool shelf sits on the sore eye's outer edge (the shelf is every heal game's; not moved).
- Standing girl is small on phones (CLN-94 "bigger standing patient", pending).

## What changed
1. **D3 standing taps:** `heal-art.json` girl.stand gets its own measured `taps` (girl-stand-front@2x); figure.js already reads `spec.taps`, so the game and the driver's expect agree.
2. **Eye drops:** the dropper hanging over the eye is a drop target; the driver taps it; the drops help lights dropper and eye (`eye.js`). Cause: a touch beside the eye snapped to the tool shelf.
3. **Play as new:** `NjgButtons.playAsNew`/`grownUp` (js/shared, `.njg-act-s`, 48 px) in both pop-ups. **Outside my list:** 6 lines in `js/cook/ui.js` to call it.
4. **Pass-me card:** capped at the stage inside the safe area; pictures shrink (`css/cook.css`).

## Proof
- `checks.mjs`: unit 229/229, words 0, bump ok, load 21/21. Leak clinic-heal-eye PASS, clinic no problems; check_onboard ok.
- D3 (diagnosis@L2, @L3#mistake, patient@L2, @L3) at 800x360/1366x768/1440x900: all 12 end; **CHECK FAILED** on the 3 new findings above.
- Eye (L1, @L2, #hint) at 800x360/1024x768 (+#hint 844x390, 1366x768): all end, 0 new.
- cook:fetch L1-L4 at 800x360/1024x768 (+L1, L4 at 844x390, 1366x768): all end; no `#passme` or `#help-pop` findings; CHECK PASSED.
- Help pop-up looked at: Cook 1366x768, clinic 800x360.
- Browser ~14 min. `touched.mjs` maps the shared CSS to every flow (a full pass): left to /review; shotdiff manifest is empty (all NEW).

Regression rows: SH-60, PAN-07, CLN-62, CLN-94, CLN-107 rechecked on the shots; rest untouched. QA checklist ⬜, for /review.
