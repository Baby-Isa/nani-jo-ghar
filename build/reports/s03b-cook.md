# S03-B: Cook rows and the review's Cook flaws

Branch `ccr-a7370759-t0lee7`. Not reviewed: builder's notes only. Game code changed: yes. No mechanic removed, no art changed.

## What changed
1. **Per-station code (CK-25, flaw 4, decision 68):** Cook's own files and the pantry load at open (~500 KB of JS, was ~1.07 MB). A station's code loads when it is chosen, or during the greeting for an order (`Cook.Mech.need`; `index.js` PARTS; `zone.js`, `recipes.js`, `flow.js`). Shared helpers moved from `assemble.js` to `station-lib.js`.
2. **Chai take-back (CK-TB-01):** tap the pan you're filling to lift the last spoonful out, until it's lit. A wrong spoonful still counts as the first try.
3. **Pour handle (flaw 2, CHAI-17):** stays on screen.
4. **Samosa L3+ mounds (flaw 7, SAM-16):** twice as big, in a row.
5. **PAN-12:** clips play without their recorded silence (`core.js`).
6. **Rows (decision 73):** 47 open Cook rows checked against the code → 9 open. Answered tags dropped.

## Proof
- `checks.mjs`: unit 229/229, words 0, bump ok, **load 21/21**. `check_onboard` ok. `leak.mjs cook` ok (0%).
- Sandbox `20261008-0227`, 1366x768: chai-tray, samosa@L3, daar, assemble, day1, tidy. All 6 reached their end, 0 page errors, CHECK PASSED. I looked at the shots myself.
- Probes: every lab entry loads only its own files, with no errors. Take-back, pour and grid were seen before and after.
- touched.mjs maps the changes to all of Cook, which is too big for a build session. **About 17 minutes of browser time, over the 15-minute cap.** The full Cook pass is left to `/review`.

## Flaws first
- Daar: a blank marble frame between the order and the chop.
- I didn't see the samosa fold with the bigger mounds.

## Open rows
CHAI-01 (fun pass), CHAI-08 (mock-up side-by-side), DAAR-14 (art), PAN-01 (eye), PAN-02 and PAN-10 (Mum), CK-01, CK-TAB-01 (tablet layouts), CK-26 (pills in `ui.js`, Session A).

## For Zafar
Chop, stir, tadka and daar can't take a move back (a slice, or a spice in hot oil). Their safety net is the redo (decision 51). Recommend accepting that.

QA checklist ⬜, for `/review`.
