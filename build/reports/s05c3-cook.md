# S05-C3: Cook and shared fixes, judged independently (13 Oct; decision 97 push to ~20:15)

Branch `ccr-a7370759-t0lee7`. Every verdict is a Fable subagent's on the standard batch file (`judge: Fable, independent subagent`) or a machine expect; `NJG_BUILDER=S05-C3` on every run. No row reached two strikes.

## What changed
- **Shared:** the end card sits over the play area and takes its page's width; the word tile's gloss shrinks, then wraps; no tint class (decision 95); ordered steps draw as the little skewer in a box, samosa kinds are boxed, and the stick sits only between pills.
- **Cook:** a chai person's card stays open until their pour (decision 97 (3)); the read-along holds the next row's mark (one lit thing); the count badge sits on the pan's left rim and stays on screen; the word pop sits inside the pan; tray badges inset; the grill screen without the bowls; the sekelo word over its bowl; no travelling light on the samosa fold; chop halves part, then fall; day dots on the grid; the house ribbon at 14 px (`css/home.css`: outside the two house files I was given; one line).
- **Tools:** `--collect` takes a text-only row's PASS that cites its text capture (unit test; CK-33 used it); fast strip frames; the Cook player names the end card's page; the lab player steps through the steps page; force-passme lets her first ask run out; `shoot_ref.mjs`; CONTRACT_ROWS (checks.mjs unit green); about 20 probes fixed.

## Built (red → green → verdict; ids `ev-20261013-…`)
SH-74 (92h→2i4, PASS), SH-75 (2i4 FAIL→m74 PASS), SH-76 (c3-labdaal-1→-2, machine), SH-77 (92h→2i4, machine), SH-39 (d91→y9n FAIL→m74 PASS), SH-53 (d91→qsn, machine), SH-61 (y9n PASS, reworded to Zafar's words), SH-78 (oez→nd9 PASS), SH-79 (gate→nd9, machine), SH-83 (gate→1hw, machine), DAAR-18 (→q5n PASS), SEK-03, SEK-17 (d91→ng0 PASS), SEK-08 (d91→y9n PASS), SEK-16 (y9n FAIL→m74 PASS), SAM-05, SAM-18, SAM-19 (d91→y9n PASS), CK-30 (d91→y9n PASS), CHAI-19 (y9n→m74 PASS), CHAI-20 (m74→geu, machine), CK-33 (gate→nd9, text PASS), PAN-05 (y9n PASS). Task 2's re-probed rows: MAA-14, CHAI-18, MAA-08 PASS; SH-17, SH-44, DAAR-21 machine. SEK-15 retired (decision 97 (4)).

## Open, with why
- CK-21: strike 1 (my crop fix cut the wrong part of the picture, reverted); at 2× the chai glasses stand on the tray rim (drawServed's people path).
- CHAI-08, DAAR-05: waiting on art (side-on filled glass; the stirred pot's finished picture).
- CK-27: the shared puff exists everywhere but is too small and quick for the strips: a size/time call.
- DAAR-19: the "ba" is the stir row (laps); it needs the stir word from Mum.
- DAAR-20: not reproduced. CK-31, CK-32: no driver serves a wrong cup. DAAR-22 (fix in, not judged), DAAR-23: the chop player misses under capture load. SH-69: heard is proven; the 1.1 s name bubble falls between captures (bubble captures lag ~1.5 s).
- SH-80, SH-81, SH-82, CK-34 (the full gate's findings): rows and probes in, not started (time).
- Decision 97 (7) bubble tails at the mouth: not started. The shared `placeBubble` (conversations.js, request-popup.js) gets only a head anchor; each host must hand a mouth point (the clinic's is D3's: CLN-127).
- D3's items for me (CLN-118, CLN-138, CLN-141, speaker ids, every:bubble lag): not started.

## Checks
Final Cook pass `c3-final2` (before decision 97): 228 of 325 pages reached their end, none stopped (3 killed by me to start the push). End check `c3-end97` (Cook, Cook labs and the house, 1366x768): see below. Unit, spec lint and loadcheck clean. Tool note: `--apply` of an older run overrides a newer verdict (SH-53 had to be re-applied). The evidence.json conflict commit (210fe97) was repaired a minute later (eb5984e).
