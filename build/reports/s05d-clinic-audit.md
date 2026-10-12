# Clinic audit table (S05-D, 13 Oct): one line per game and rule

The check CLN-113, CLN-30, CLN-06, SH-23 and CLN-112 name. Read from the code on `ccr-a7370759-t0lee7` (after S05-D) and the runs below; ✅ holds, ⚠ a gap with its reason.

- **First-time help:** `check_onboard.mjs` ok. 9 heal games, 27 step kinds, each with a ghost-finger demo; no English, no device voice. The taught round forces the ghost finger.
- **Stale UI:** contract-13 has 0 breaks on 14 clinic flows (sandbox 20261012-2317). The doctor's box clears after the send-off pick.
- **Shared Done/Next:** every game's ✓ is the host's shared button (`ctx.button` → `Kit.button` → `NjgButtons`). The end screen is the shared `Results`.
- **Card:** every ordered job is one sequence on the shared card: line, grey band, the rest greyed, each row ticking.

| Game | Card sequence | Take back until ✓ (E14, UX 17) |
|---|---|---|
| Scrape | ✅ wash, cloth, each plaster | ✅ tap a laid plaster to take it off; the first is scored |
| Boing | ✅ wipe, drops, press, plaster (S05-D) | ✅ tap that drop in the syringe, never the barrel (CLN-58) |
| Fever | ✅ temperature row stays ticked (S05-D), exchanges join | ✅ tap a thing again to undo it; the first tap is scored |
| Knee | ✅ kick, wrap | ⚠ none needed: the dots stop at the count (13i), so no extra turn can be laid; a kick is done once it's done |
| Ear | ✅ wax (parts), wipe, drops, hearing | ⚠ wax in the bin and a wipe can't come back (shown in the art); a drop given is given |
| Tooth | ✅ brush moves, drill, fill | ⚠ brushing, drilling and filling are physical, nothing to place; the fill stops in the green |
| Taste | ✅ pop, drink | ⚠ a popped spot stays popped; a wrong drink is redone on the spot (E35, decision 51), not taken back |
| Eye | ✅ drops, chart | ⚠ a yes/no answer is judged at once (the gentle red shake, decision 59); drops as the ear |
| Foot | ✅ soak, splinters, plasters | ⚠ none: a jug poured is on the foot (water can't come back, as Cook's pours); a side touch slides the splinter back (scored) |
| Pharmacy | ✅ request card | ✅ tap a filled tray space to put it back until ✓ (CLN-22, ev-20261012-2313) |
| Waiting L4 | ✅ calls in order | ✅ tap a numbered tick again (ev-20261012-2313) |
