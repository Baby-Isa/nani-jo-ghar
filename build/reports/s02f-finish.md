# S02-F: finish B and C's open items

Branch `ccr-a7370759-t0lee7`. Not reviewed: builder's notes only. Game code changed: yes.

## What changed
1. **Maani** (`maani-line.js`): at Done a wrong maani lifts off its plate. The right ones stay, and a missing one's row reopens with its pile glowing. On the third wrong try it is made for you.
2. **Pantry** (`fetch.js`): at the end, wrong things on the tray go back to their shelf one by one. On the third wrong try for an item, it glows and goes onto the tray by itself.
3. **Samosa L3+** (`samosa.js`): every strip, plus one spare, lies on the board at once. Tap a strip and fill it; its base filling sets the kind. Press ✓, then fold each strip in the middle. A wrong strip is emptied, too many of a kind empties the extra, and too few gets the order said again.
4. **Grill** (`grill.js`): *Firai!* at each turn.
5. **Clinic**: after the diagnosis end screen she stays in the room (`diagnosis.js`). From L3 the heal strip leaves out the count (`host.js`).
6. **Waiting room L2+**: only children are called, and the girl is the patient (`pipeline.js`, `pipeline.json` `kidsOnly`).

## Proof
- `checks.mjs`: unit 229/229, word lint 0 literals. `check_onboard`: ok.
- Leak (clinic, 150 rounds): waiting room, the blind bots at L2–L5 win 0–24%.
- Probes at 1366×768: maani L2 with one wrong kind, pantry L2 with mistakes, samosa L3 with one kind and with two (5 strips), sekelo L2 with one forced wrong skewer (only that one is threaded again), sekelo L1 steps "Firai! Firai!".
- Sandbox `s02f-quick` (8 flows): 0 page errors. 2 new "Play as new" tap-small findings, in the shared help pop-up. `fetch@L2#mistake` stopped once at pass-me (its 3 s ring); it ran to the end on a re-run, with old and new code.
- `loadcheck.mjs` does not exist. `shotdiff` has no approved manifest. About 25 min of browser checks, over the cap.

## Open
- Samosa grid mounds are small (strips at about ⅓ size).
- Waiting room: "tap a girl" wins about half the time. L1 still calls any kind, and L5 has no "with the baby" for the girl.
- Diagnosis: she keeps her "ouch" face behind the end screen.
- QA checklist ⬜, for `/review`.
