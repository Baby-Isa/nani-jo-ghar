# s08-w4b-chai: details (builder's account, not judged)

Branch `worktree-agent-a1a00f6d36b562e9a`, commit `3cf3f877`. Sandbox run `w4b-touched`. Game code changed: yes (js/cook/stations/chai-tray.js, data/stations/chai-tray.json, data/cook.json chai-tray files). The sandbox run was deleted for disk; its contract.md, summary.md and shotdiff sheet are in `build/screenshots/w4b/`.

## What was built
| Row | Change |
|---|---|
| CHAI-08 | The hob pan is s08b's top-down pan (empty / milk / black), turned -40 deg so its handle points up-right like the v3 pan's (straight right it ran over the next burner's pan). Registered by each cut's contents circle (measured: centres 180.3 / 169.3 / 143.3, 134.3; rim 128, contents 117 px). The six stages s08b has no picture of (water, leaves, spiced, both boils, foam) are v3's own pictures masked to the s08b contents circle; the handle is redrawn from the empty cut over every state (CHAI-12). |
| CHAI-26 | s07 CP1 tilts do not register (another pan: handle about 19% longer on s08b relative to the rim, darker steel and a black underside on CP1, paler chai): `build/screenshots/w4b/art-registration-s08b-vs-cp1.png`. So the pour moves the hob's own picture: NjgPour.plan (lift, steps, pour, untip, back) with NjgPour.stream; 4 steps of -20 deg (data/stations/chai-tray.json `pour`), 12% narrowing, the chai gathering at the spout then falling (the empty cut shows through a chord mask). Shrinks (floor 0.7) or drops a step only where a short screen has no room for the upturned handle. The CP1 / pour-v2 pictures are no longer loaded. |
| CHAI-19 | The word bubble is centred over the pan just above its rim; if the count badge is there it goes above it (or beside it when the top has no room). The bottle now tips in from the pan's right at rim height. |
| CHAI-22 | Water, milk, leaves once per pan; a second tap wiggles, says nothing. Orders: `dudh` is boolean in data, so none asks for two. |
| CHAI-24 | "Slow kar" and the knob glow at heat >= lo (was lo - 0.14), on the frame the bar enters the green. |
| CHAI-25 | The pan's glow is a ring texture on the rim's centre (`chai-pan-ring`), never the picture's box. |
| CK-TB-01 | Canvas zones over each `#count-badge` chip take one of that thing back, until the pan is poured (lit, speaking or not; waits for a spoon in flight). Pan-tap take-back removed. Spice chips count their spoonfuls. |
| Checks | contract-70 (slow line at the green), contract-71 (once each): `build/sandbox/lib/contract-chai.mjs`, tests `build/sandbox/contract-chai.test.mjs`. The station logs `chai-slow`, `chai-down`, `chai-add` notes; the mistake player now taps a second water and a second milk. |

## Red then green
- Red (old timing and no once-guard patched back in, cook:chai-tray#mistake 1366x768): contract-70 x2 ("Slow kar" at 0.550 and 0.548, green at 0.66), contract-71 x2 (second water, second milk). `build/screenshots/w4b/red-run.log`.
- Green: the same page, contract-70/71 0 breaks; the touched set at 1366 had none either.

## Proof (from the run; do not retype)
- **Pages run:** 22 (flow x size): 22 flows at 1366x768. 22 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 287 of 287 states, in `build/screenshots/sandbox/w4b-touched` (not committed, B19). Contact sheets: `build/screenshots/sandbox/w4b-touched/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (0 known, 6 fixed). Findings in the run: 0 (none).
- **Sound:** 21 lines with no family clip, 20 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/w4b-touched vs build/tools/review/approved-shots.json: 583 shots, 53 changed, 524 new, 1031 gone, 6 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 39 (0 Kutchi, 39 English); 251 single words that may be ids
  - B  English that a child may see: 39 English literals + 33 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (14 places)
  - D  lines with no family recording: 36 distinct words with no clip in 3987 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: cook:chai#hint, cook:chai#mistake, cook:chai#takeback, cook:chai@L2#mistake, cook:chai@L2, cook:chai@L3#hint ... · reviewer: <someone other than the builder> · commit: 3cf3f877
Auto: layout lint ✅ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 25 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| cook:chai | 1366x768 | 13 | 0 | sheets/cook-chai__1366x768.png |
| cook:chai-tray | 1366x768 | 13 | 0 | sheets/cook-chai-tray__1366x768.png |
| cook:chai-tray@L2 | 1366x768 | 13 | 0 | sheets/cook-chai-tray-l2__1366x768.png |
| cook:chai-tray@L2#mistake | 1366x768 | 14 | 0 | sheets/cook-chai-tray-l2-mistake__1366x768.png |
| cook:chai-tray@L3 | 1366x768 | 13 | 0 | sheets/cook-chai-tray-l3__1366x768.png |
| cook:chai-tray@L3#hint | 1366x768 | 14 | 0 | sheets/cook-chai-tray-l3-hint__1366x768.png |
| cook:chai-tray@L4 | 1366x768 | 13 | 0 | sheets/cook-chai-tray-l4__1366x768.png |
| cook:chai-tray#hint | 1366x768 | 14 | 0 | sheets/cook-chai-tray-hint__1366x768.png |
| cook:chai-tray#mistake | 1366x768 | 14 | 0 | sheets/cook-chai-tray-mistake__1366x768.png |
| cook:chai-tray#takeback | 1366x768 | 15 | 0 | sheets/cook-chai-tray-takeback__1366x768.png |
| cook:chai@L2 | 1366x768 | 13 | 0 | sheets/cook-chai-l2__1366x768.png |
| cook:chai@L2#mistake | 1366x768 | 14 | 0 | sheets/cook-chai-l2-mistake__1366x768.png |
| cook:chai@L3 | 1366x768 | 13 | 0 | sheets/cook-chai-l3__1366x768.png |
| cook:chai@L3#hint | 1366x768 | 14 | 0 | sheets/cook-chai-l3-hint__1366x768.png |
| cook:chai@L4 | 1366x768 | 13 | 0 | sheets/cook-chai-l4__1366x768.png |
| cook:chai#hint | 1366x768 | 14 | 0 | sheets/cook-chai-hint__1366x768.png |
| cook:chai#mistake | 1366x768 | 14 | 0 | sheets/cook-chai-mistake__1366x768.png |
| cook:chai#takeback | 1366x768 | 15 | 0 | sheets/cook-chai-takeback__1366x768.png |
| lab:cook/chai-tray | 1366x768 | 10 | 0 | sheets/lab-cook-chai-tray__1366x768.png |
| lab:cook/chai-tray@L2 | 1366x768 | 10 | 0 | sheets/lab-cook-chai-tray-l2__1366x768.png |
| lab:cook/chai-tray@L3 | 1366x768 | 10 | 0 | sheets/lab-cook-chai-tray-l3__1366x768.png |
| lab:cook/chai-tray@L4 | 1366x768 | 11 | 0 | sheets/lab-cook-chai-tray-l4__1366x768.png |

### Regression rows to recheck (25; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CHAI-13 · open · eye: sugar · A real teaspoon for the sugar stir (now drawn in code)
- [ ] CHAI-22 · open · auto: no order asks for more than one · "Milk ... it's not a countable thing ... there's one of milk, water and tea, there's not multipl
- [ ] CHAI-24 · open · auto: "Slow kar" at the green's edge · "The turn-off instruction needs to happen exactly as the progress bar just enters the green" (it
- [ ] CHAI-25 · open · eye: the pan glow · "The highlight of the tea pan doesn't look symmetrical, particularly by the hole in the handle .
- [ ] CHAI-19 · reopened · eye: 844x390, chai-tray L3 · eye: chai · At 844x390 no loose word pill floats over the hob's top rim (an 'elchi' pill sat there; found by
- [ ] CHAI-02 · built · eye: 1366×768, the ingredient strip ×2 · Layout: hob and tray do not overlap; the ingredient strip shows the pantry's front-on (side-on)
- [ ] CHAI-04 · built · eye: 1366×768 · Everything is made in the pan, not partly in the glass; one card per person
- [ ] CHAI-05 · built · eye/ear: orders · LNG-03 · Sentence: Muke aadu waari chai khape, extras first, then dudh, ba khun; ginger phrase not last a
- [ ] CHAI-06 · built · auto: build/check_vessel_meta.py · LAY · Pans centred on burners; no flame on a burner whose pan is away; gauge on the rim; boiling state
- [ ] CHAI-07 · built · eye: black-tea state · Black-tea glass and tipped-pan art still open
- [ ] CHAI-10 · built · eye: chai L1–L3 · Burner reaches the green zone about twice as fast at every level (now ~15 / 21 / 28 s)
- [ ] CHAI-11 · built · eye: 2-person chai, one wrong · A wrong cup is redone: the other cups stay, that cup empties, its card reopens, the tick goes; t
- [ ] CHAI-12 · built · eye: ×2 zoom, right pan · Pan handle fully opaque over the hob rim (the heat ring draws over it)
- [ ] CHAI-14 · built · eye: ×2 zoom · Ginger art reads as ginger, not gummies (shelf-veg-14-jar-f.webp)
- [ ] CHAI-15 · built · auto: contract check (decision 75) eve · Everyone who orders comes in first, in every station and story day (decision 53: every recipe);
- [ ] CHAI-16 · built · eye: chai L1, L2 · CMP-09 · A counted row at L1 turns gold at the count (D5 never built: hidden two sugars not ticked while
- [ ] CHAI-17 · built · eye: chai pour, 1366×768 and 844×390 · The tipped pan's handle touches the top edge while it pours (1366×768)
- [ ] CHAI-18 · built · eye: 2- and 3-person chai, 1366×768 an · The chai tray uses the real art; each glass has the orderer's small round face badge on the tray
- [ ] CHAI-20 · built · eye: 844x390, chai-tray L3, every item · The count badge on the pan is never cut by the stage's edge: with two groups at L3 (sugar dots a
- [ ] SH-78 · built · eye: cook:chai-tray L1, the pour · The chai card keeps its rows and ticks through the pour (it folds to face + headline for the pou
- [ ] CK-06 · open · eye: each cooking state · Things inside pots and pans look real (chai liquid, daar oil, contents), not white dots or swirl
- [ ] CK-45 · open · auto: contract-21 on cook:chai#mistake · In chai and the chai tray, a tap on the worktop while Nani's "Wiji chad!" (after a mistake) is s
- [ ] CK-TB-01 · reopened · sandbox #takeback flows · eye: chai, t · Take it back until Done (E14): 9 of 12 Cook stations offer no take-back (only chaat, assemble an
- [ ] CK-29 · built · auto: contract check (decision 75) eve · Every recipe gives each instruction just before the game that needs it (the chaat flow, CHT-07:
- [ ] CK-27 · built · eye: chai, daar, chaat, samosa, the mo · An ingredient going into a pot, pan, glass or bowl shows a small puff or sprinkle: one shared ef

## Left open
See the report's flaws. Browser time used: about 15 minutes (red, two green evidence runs, the touched set at 1366, the load check, one re-film at 800x360).
