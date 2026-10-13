# Clinic audit table (S05-D3, 13 Oct): one line per game, one column per rule

The check CLN-113 names (and CLN-30, CLN-06, SH-23, CLN-112). Read from the code on `ccr-a7370759-t0lee7` after S05-D3 and from these runs: `node build/check_onboard.mjs` (ok: 9 heal games, 27 kinds of step, each with a ghost-finger demo, no child-facing English, no device voice); contract-13 (stale UI) 0 breaks over every clinic page of evidence run ev-20261013-170427-3le; the take-back flows of ev-20261013-163120-jp1. ✅ holds; ⚠ a gap, with its reason.

| Game | First-time help (ghost finger, per step kind) | Take back until ✓ | Card sequence | Stale UI (contract-13) | Shared Done/Next |
|---|---|---|---|---|---|
| Scrape | ✅ wash, dab, plaster; waits for the close-up (CLN-133) | ✅ tap a laid plaster to take it off; the first is scored | ✅ one sequence: L1 grows a row per step, L2+ whole, ticking | ✅ 0 breaks | ✅ the shared ✓ (ctx.button → NjgButtons); shared end screen |
| Knee | ✅ kick, wrap | ⚠ none needed: the dots stop at the count (13i); a kick done is done | ✅ kick, wrap rows ticking | ✅ 0 breaks | ✅ shared ✓ from L2; L1 closes itself at the count (D5); shared end screen |
| Ear | ✅ wax (one drag, tweezers riding), wipe, drops, hear | ⚠ wax in the bin and a wipe can't come back; a drop given is given | ✅ wax (parts), wipe, drops, hearing | ✅ 0 breaks | ✅ shared ✓ for the drops' count; shared end screen |
| Tooth | ✅ brush, drill, fill | ⚠ brushing, drilling, filling are physical, nothing to place | ✅ brush moves, drill, fill ticking one by one | ✅ 0 breaks | ✅ no ✓: each step closes itself (decision 52); shared end screen |
| Taste | ✅ pop, drink, pour, give | ⚠ a popped spot stays popped; a wrong drink is redone on the spot (E35) | ✅ pop, drink | ✅ 0 breaks | ✅ no ✓: closes itself; shared end screen |
| Fever | ✅ temp, named, fix | ✅ tap a thing again to undo it; the first tap is scored | ✅ temperature row stays ticked, exchanges join | ✅ 0 breaks | ✅ no ✓: "just right" closes each swing; shared end screen |
| Boing | ✅ wipe, drops, press, boing, plaster | ✅ tap that drop in the syringe (never the barrel, CLN-58) | ✅ L1 grows a row per step (SH-45), L2+ whole | ✅ 0 breaks | ✅ no ✓: the glowing end is the next action (D7); shared end screen |
| Eye | ✅ drops, chart, read, redrop | ⚠ a yes/no is judged at once (decision 59); drops as the ear | ✅ drops, chart | ✅ 0 breaks | ✅ the shared button to the eye test; shared end screen |
| Foot | ✅ soak, pull, plaster | ⚠ a poured jug is on the foot; a side touch slides the splinter back (scored) | ✅ soak, splinters, plasters | ✅ 0 breaks | ✅ no ✓: closes itself; shared end screen |
| Pharmacy | ✅ belt tap (first session) | ✅ tap a filled tray space to put it back until the handover | ✅ the request card, rows ticking at the handover | ✅ 0 breaks | ✅ no ✓: the doctor takes a full tray (decision 52); shared end screen |
| Waiting room | ✅ tick tap (first session) | ✅ L4: tap a numbered tick again | ✅ calls in order | ✅ 0 breaks | ✅ shared → Next picture (CL3); shared end screen |
| Diagnosis | ✅ the sore spot (D1, first session); each tool's first time (D3) | ⚠ a tap on a part is an answer (D1 taught, D2/D3 judged at once) | ✅ D3: tool blocks with parts ticking | ✅ 0 breaks | ✅ no button: moves on when the outcome is clear (decision 52) |
| Send-off | ✅ the right feeling card tapped (first session) | ⚠ a picked card is an answer (the gentle shake when wrong) | ✅ the feeling, then the goodbye | ✅ 0 breaks | ✅ shared end screen |
