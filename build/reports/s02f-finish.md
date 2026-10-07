# S02-F: finish B and C's open items

Branch `ccr-a7370759-t0lee7`. Not reviewed: builder's notes only. Game code changed: yes.

## What changed
1. **Maani** (`maani-line.js`): a wrong maani lifts off at Done; a missing one's row reopens, its pile glows; third try, made for you.
2. **Pantry** (`fetch.js`): wrong things go back to the shelf one by one at the end; third wrong try, the right one flies onto the tray.
3. **Samosa L3+** (`samosa.js`): every strip plus one spare on the board at once; tap one, fill it (its base filling sets the kind); ✓, then each is folded in the middle. Wrong strip emptied; too few: the order again.
4. **Grill** (`grill.js`): *Firai!* at each turn.
5. **Clinic**: she stays behind the diagnosis end screen (`diagnosis.js`); L3 heal strip without the count (`host.js`).
6. **Waiting room L2+**: only children are called, and the girl is the patient (`pipeline.js`, `pipeline.json` `kidsOnly`).

## Proof
- `checks.mjs`: unit 229/229, word lint 0 literals. `check_onboard`: ok.
- Leak (clinic, 150 rounds): waiting room, the blind bots at L2–L5 win 0–24%.
- Probes 1366×768: maani L2 one wrong kind; pantry L2 mistakes; samosa L3 one and two kinds (5 strips); sekelo L2 forced wrong skewer (only it is rethreaded); sekelo L1 says "Firai!" per turn.
- Sandbox `s02f-quick` (8 flows): 0 page errors. 2 new tap-small (shared help pop-up "Play as new"). `fetch@L2#mistake` stopped once at pass-me's 3 s ring; re-run reaches the end.
- No `loadcheck.mjs`; shotdiff has no manifest. ~25 min browser, over cap.

## Open
- Samosa grid mounds are small (strips at about ⅓ size).
- Waiting room: "tap a girl" wins ~half; L1 calls any kind; no "with the baby" for her.
- Diagnosis: she keeps her "ouch" face behind the end screen.
- QA checklist ⬜, for `/review`.
