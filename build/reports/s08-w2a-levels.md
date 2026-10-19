# s08-w2a-levels

Branch `worktree-agent-a3ac499adc0b87799`, commit `0d20cc13`. Sandbox run `w2a-green`. Game code changed: yes (Cook). Builder's report (Opus); the orchestrator judges, not me. Not pushed.

## Flaws and what is not done (first)

1. **Sekelo L4 stuck once** in the green run: the player kept tapping a 4th (onion) skewer on the rack (`10-stuck.png`); red L4 ended. Cause not pinned; rerun it.
2. **Sekelo decoys 1, not 3** at L3-L4 (contract-37 red): only the potato has sekelo piece art. Waits on the art run.
3. **Leaks left:** bajri maani has no voice, so it stays written at L3 (contract-35, maani L3); a person's headline writes their extra ("Muke elchi waari chai khape"); chai's spice row caps at five jars (two extras asked: two decoys, not three).
4. Not done: the pantry's pop-up still reads the whole list (asked one at a time after); MAA-17's +0.75 s flip; the throttled CK-48 run (no throttle in the sandbox; begin now waits for art, marble 20 s cap: eye it); samosa unchanged (L3+ already goes to the fryer).
5. contract-36 counts any call in 6 s after an opening (a late call can stand for the next step); 35/37 read the game's own logs and DOM, not pixels. Browser time about 19 min: L2 only for maani, no 800x360; checks.mjs result below.
6. Lines waiting on Mum: none new; calls reuse the engine's step lines.

## What was built
- `data/cook.json levelTable` (replaces `calm.closedFrom`); `station-lib.js` `Cook.levelRow`, `dotItem`, `St.tableDecoys`, `decoyNote`.
- Card open, open, dotted, hidden (`ui.js`, `flow.js`, `zone.js`, daar's chop card: numbers written, dotted L3, folded L4).
- Step call: the stepper's `call` (`ui.js`), role `call`; the pantry and chaat go through it every level.
- Decoys by table: chai, samosa, chaat, daar, sekelo; the pantry reports its shelf.
- Chai 1/2/2/3 cups; samosa filling, second filling, two kinds, the "no"; maani sizes from L2.
- Moves on: chai after the last pour, chaat when right. One ending in the kitchen (lab and story; no recap).
- `setView` waits for the marble; `begin` loads art behind the pop-up.
- contract-30: counting along tagged `count`; a said one with its bare item written passes (Zafar, 19 Oct; fixture red then green).

## Red then green (1366x768)
| check | red `w2a-red` (28 pages, 19 Oct files) | green `w2a-green` (19 pages) |
|---|---|---|
| 35 card | 19 (L3 every station, daar L4) | 2 (maani bajri; sekelo before its fix) |
| 36 call | 231 | 0 |
| 37 decoys | 24 | 2 (sekelo art) |
| 30 written | 3 (samosa, fetch L1; sekelo L3) | 0 |
| 2, 22, 24 | 0, 4, 1 | 0, 0, 0 |

Shots: `build/reports/s08-w2a-levels/stations-L3-L4-1.png`, `-2.png` (play state; most show the bulb's English).

## Proof (from the run; do not retype)
- **Pages run:** 19 (flow x size): 19 flows at 1366x768. 18 reach their end, 1 stop short: cook:mishkaki-grill@L4 @ 1366x768.
- **Page errors:** 0.
- **Screenshots:** 253 of 253 states, in `build/screenshots/sandbox/w2a-green` (not committed, B19). Contact sheets: `build/screenshots/sandbox/w2a-green/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **FAILED**: 0 new findings, 1 flows that do not reach their end, 0 new page errors. Findings in the run: 1 (canvas-text-small 1).
- **Sound:** 113 lines with no family clip, 46 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/w2a-green vs build/tools/review/approved-shots.json: 579 shots, 76 changed, 473 new, 1366 gone, 10 identical, 12 within threshold (largest cell 6/255, mean 0.26), 4 brightness-only (a fade or dim scrim), 4 same picture under another state name
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 249 single words that may be ids
  - B  English that a child may see: 38 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (14 places)
  - D  lines with no family recording: 36 distinct words with no clip in 3987 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: cook:assemble@L3, cook:assemble@L4, cook:chai-tray@L3, cook:chai-tray@L4, cook:chai-tray, cook:daar@L3 ... · reviewer: <someone other than the builder> · commit: 0d20cc13
Auto: layout lint ❌ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 146 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| cook:assemble@L3 | 1366x768 | 12 | 0 | sheets/cook-assemble-l3__1366x768.png |
| cook:assemble@L4 | 1366x768 | 12 | 0 | sheets/cook-assemble-l4__1366x768.png |
| cook:chai-tray | 1366x768 | 13 | 0 | sheets/cook-chai-tray__1366x768.png |
| cook:chai-tray@L3 | 1366x768 | 13 | 0 | sheets/cook-chai-tray-l3__1366x768.png |
| cook:chai-tray@L4 | 1366x768 | 13 | 0 | sheets/cook-chai-tray-l4__1366x768.png |
| cook:daar | 1366x768 | 14 | 1 | sheets/cook-daar__1366x768.png |
| cook:daar@L3 | 1366x768 | 16 | 0 | sheets/cook-daar-l3__1366x768.png |
| cook:daar@L4 | 1366x768 | 15 | 0 | sheets/cook-daar-l4__1366x768.png |
| cook:fetch | 1366x768 | 12 | 0 | sheets/cook-fetch__1366x768.png |
| cook:fetch@L3 | 1366x768 | 12 | 0 | sheets/cook-fetch-l3__1366x768.png |
| cook:fetch@L4 | 1366x768 | 12 | 0 | sheets/cook-fetch-l4__1366x768.png |
| cook:maani-line@L2 | 1366x768 | 15 | 0 | sheets/cook-maani-line-l2__1366x768.png |
| cook:maani-line@L3 | 1366x768 | 15 | 0 | sheets/cook-maani-line-l3__1366x768.png |
| cook:maani-line@L4 | 1366x768 | 15 | 0 | sheets/cook-maani-line-l4__1366x768.png |
| cook:mishkaki-grill@L3 | 1366x768 | 13 | 0 | sheets/cook-mishkaki-grill-l3__1366x768.png |
| cook:mishkaki-grill@L4 | 1366x768 | 11 | 0 | sheets/cook-mishkaki-grill-l4__1366x768.png |
| cook:samosa | 1366x768 | 12 | 0 | sheets/cook-samosa__1366x768.png |
| cook:samosa@L3 | 1366x768 | 14 | 0 | sheets/cook-samosa-l3__1366x768.png |
| cook:samosa@L4 | 1366x768 | 14 | 0 | sheets/cook-samosa-l4__1366x768.png |

### Regression rows to recheck (146; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CHT-12 · open · eye: chaat bowl · "The bowl has a drop shadow which doesn't make sense ... let's remove the drop shadow"
- [ ] CHT-14 · open · auto: leak test, chaat (no tick tells · Leak: "you can basically pass the level without knowing any Kutchi because the ticks give it awa
- [ ] CHT-15 · open · auto: chaat ticks per item · "You get a tick if you put the right item in the right sequence on the first go ... thrown out .
- [ ] CHT-01 · built · eye: L1 · INT-10 · Quantities are not only heard: card says ba dungri at L1 (counting rule)
- [ ] CHT-02 · built · eye: 1366×768 · Ingredient bowls side-on, not three-quarter
- [ ] CHT-03 · built · auto: build/check_vessel_meta.py check · Glass bowl: a thin, plain side-on profile with layer strips, no thick base, no reflections, flat
- [ ] CHT-04 · built · eye: serve and build states · Layers read as food, not liquid or flat rectangles; chilli layer not too thick; tidy ingredient
- [ ] CHT-05 · built · eye: chop phase · CMP-04 · Chop timer ring in the shared colours, not the old ones (verify)
- [ ] CHT-06 · built · eye: chaat L1–L3 · Potato row ticks only at the second of two; the checker counts quantities (one potato passed for
- [ ] CHT-07 · built · eye: story chaat · Chaat flow (Zafar, 12 Oct): the person first says they want chaat (the dish, not the layer order
- [ ] CHT-08 · built · eye: chaat retry · On a retry the order is re-said on his own card with rows lit as spoken; no extra card
- [ ] CHT-09 · built · ear: chaat L1 · arre re (never confirmed, not a family word) removed; find why it plays on correct layers
- [ ] CHT-10 · built · auto: contract check (pop-up before ev · L4 chaat: the order comes up in the shared pop-up and is read out before it folds into the close
- [ ] CHT-11 · built · eye: Cook service, chaat served · Served chaat drawn at the tray's angle (side-on art if side-on), no baked drop shadow
- [ ] CK-TB-01 · reopened · sandbox #takeback flows · eye: chai, t · Take it back until Done (E14): 9 of 12 Cook stations offer no take-back (only chaat, assemble an
- [ ] CK-39 · built · auto: zero-tolerance lint, text-clippe · A card row's words are clipped on cook:chaat (view-marble) and cook:assemble (order card in the
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
- [ ] CK-45 · open · auto: contract-21 on cook:chai#mistake · In chai and the chai tray, a tap on the worktop while Nani's "Wiji chad!" (after a mistake) is s
- [ ] DAAR-02 · reopened · eye: ×2 zoom, stir · Ladle: a real kadchi seen top-down, its handle rising toward the viewer (foreshortened, "stickin
- [ ] DAAR-05 · open · eye: each stage · Ginger and added things are not white dots; stir turns the pictured contents (review bowl still
- [ ] DAAR-20 · open · eye: cook:daar L1, the chop · The chop board never dims dark brown for a frame between cuts (DAAR-13 B, 1696 ms)
- [ ] DAAR-23 · open · eye: cook:daar L1, the chop · The chop card's row highlights at the right count: a row lights once its count has been cut, not
- [ ] DAAR-26 · open · ear: daal stir L1-L4 · The stir line: "I don't think the recipe card should come up and tell you ... we should just kee
- [ ] DAAR-27 · open · auto: a lap's number starts within 3/4 · "The counting doesn't keep up with the turns ... say it within like three quarters of one revolu
- [ ] DAAR-30 · open · eye: daal stir + auto: laps counted at · "A little racing flag to mark the start and end of one revolution ... at the 12 o'clock position
- [ ] DAAR-32 · open · ear: daal stir L1 · "She says stir three times but I think she should say the speed as well, so either jaldi or aste
- [ ] DAAR-33 · open · eye: daal after the pour and at serve · "The top of the mat just peeks above the indicator"; "the two mats overlap ... just remove the m
- [ ] DAAR-34 · open · eye: daal chop L4, each round · Chop L4: "those other items should be dotted, so you can see there's three items to be chopped i
- [ ] DAAR-35 · open · auto: no gap between waves · Chop: "the items should just come continuously, because if you miss something the first time you
- [ ] DAAR-01 · built · auto: build/test_cook.py; eye: chop · Swipe chop stays ("there's no game now" when it became tap crate, tap knife)
- [ ] DAAR-03 · built · eye: stir · Stir shows speed and laps (speed dial, laps as Kutchi word)
- [ ] DAAR-04 · built · auto: order-card state; eye · CMP-09 · Chopped rows reset at the pan and tick as each goes in
- [ ] DAAR-06 · built · eye: serve · Finished daar is photoreal on a small wooden trivet
- [ ] DAAR-08 · built · eye: L1–L4 · INT-10 · Chop card writes quantities at every level (open question: should L1 say ba dungri only?)
- [ ] DAAR-09 · built · eye: daar wrong spice · A mistake redoes only the wrong step; after three wrong tries the game shows the right way (whol
- [ ] DAAR-10 · built · eye: daar in · Trivet stays on the counter; only the bowl tips into the pot (one image now)
- [ ] DAAR-11 · built · eye: stir · Ladle turns as it goes round so its handle stays on the rim
- [ ] DAAR-12 · built · eye: stir L1–L3 · Laps and speed on the card; asked speed green, the other yellow, spill red
- [ ] DAAR-14 · built · eye: ×2 zoom · Silver saucepan top edge not cut flat (which pot to find at review)
- [ ] DAAR-15 · built · eye: labs.html · Old Tadka station retired from the labs
- [ ] DAAR-16 · built · eye: a daar order with dungri na, each · The daar pot's contents picture matches the order (the extra pot pictures, R4): no onion when no
- ... 86 more (`node build/tools/review/regress.mjs cook:assemble,cook:chai-tray,cook:daar`)

## Left open
<!-- fill in -->
