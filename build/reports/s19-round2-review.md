# s19 round two review: the merges of s19-clean-c2 (4effffdce, with 6f032bc35) and s19-clean-b2 (2acf13262)

Reviewer, not a builder. No code edited, nothing committed, no browser run. Read at HEAD 818f857a4 (`js` and `data` are the same as at
2acf13262). 10 findings: 1 high, 3 medium, 6 low. Of the 22 earlier findings: 17 fixed, 3 partly fixed, 1 not fixed, 1 overtaken.
Flaws first, most severe first. Each says whether it is read from the code or taken from the builder's own run.

## Findings

### 1. Sekelo still does not finish at phone size at L3 and L4 (high; the builder's own run, cause not found)
- `js/cook/mechanics/grill.js:1570-1616` (`layout4`), `:1800` (the tray skewer's tap area), `:1888` (the grill skewer's).
- What goes wrong: the builder's after-run ends 30 of 32 rounds; sekelo L3 and L4 at 740x320 hit the cap at the grill. On L4 "75 taps on
  the tray's first skewer move nothing" (at 1280x665: 46 taps, done). The report rules out the piece cards and names no cause. It is
  merged as it stands.
- Failure: a child on a phone, sekelo L3: the skewers are threaded, the grill opens, and the round is never finished.
- What the code shows, not proven: `toGrill` (`:1820-1828`) only wiggles the skewer when no grill spot is free, so taps that "move
  nothing" mean the grill stayed full, that is, the skewers on it were not turned or lifted. The new tap areas are sized from `M`
  (`LAY.bamboo`), which `layout4` floors at 120 design px on a short view. This needs one look in a browser at 740x320 before the row
  is called done. The earlier review's finding 3 is therefore only partly fixed (L2 ends now).

### 2. Samosa L3 and L4: the card says fewer samosas than are ordered, and the second kind's count is written nowhere (medium)
- `js/cook/ui.js:3216-3222` with `data/cook.json:1964` (`blockHeads: false`); the count is judged at `js/cook/stations/samosa.js:1160`.
- What goes wrong: every L3 and L4 samosa order has two kinds (200 of 200 made in node). The headline writes the first kind's count
  only, and the second kind's head card ("ne ba samosa") is no longer drawn.
- Failure: L3, the order said is "Muke ba samosa khape, ba bataata, dungri na. Ne ba samosa, ba chunda." Four samosas. The card reads
  "Muke ba samosa khape." and two rows of fillings. The child makes what the card says, and `countWrong` marks the round wrong ("made 2
  and 0, they asked for 2 and 2"). Zafar's own words for SAM-35 were "if there's two samosas being ordered, the sentence should say two".
- `build/test_shared_w1b_card.mjs` (SH-99, every number said is written) still passes, but only because it reads the ladder's rows, the
  head rows too, not the card as drawn. The builder lists this as a question for Zafar; it is live at L3-L4 now.

### 3. Chai: the people who left come back as review faces at the second serve (medium)
- `js/cook/stations/chai-tray.js:2038-2045` (`review`) against `:2204` (`leave`) and `js/shared/serve.js:186`.
- What goes wrong: `leave` fades a right person's glass, face and badge before the redo. At the redo's serve the round calls
  `o.review(wrong, 1)`, and chai's `review` builds a face for every pan (`pans.map`), the gone ones too.
- Failure: three people, one glass wrong. The pop-up plays, two people leave with their glasses. The child remakes the third and serves:
  three big faces appear over the tray, two of them happy over empty places, and when the redo is right the praise card is laid out
  beside the last of all three. SH-266 ("the orders done right leave with their people") is undone for that moment.
- Fix shape: `review` over the pans not `gone`. Read from the code.

### 4. Chai CHAI-110: the second-tap light is spent before it is drawn (medium)
- `js/cook/stations/chai-tray.js:1788-1789`.
- What goes wrong: `seen14[POUR_AGAIN14] = true` is set when the step opens, not when the light shows. The light then waits for the
  stage to be still (`js/cook/coach.js:806-813`, up to 3 s) and is dropped if the step changes meanwhile.
- Failure: L4, two pans on. The child pours a full glass's first half; the pan comes back; before the light is up the other pan reaches
  its green and "Slow kar" takes the step (`hotNow`, `:1982`). When the pour step returns the key is already on the save, so the glass
  gets no light, now or ever: only the stuck hint after 13 s. This is the moment Zafar asked the light for. SH-178 fixed the same
  pattern for the order card's light (`:1703-1704`, "the showing is used only when the light is up").
- The builder's own child-pace run saw the related case: the second half poured 0.6 s after the pan came back, no light shown, key spent.

### 5. Eggs: the pop-up can cross a row the child got right, and the red marks stay to the end (low to medium)
- `js/cook/stations/eggs.js:1104-1107`.
- An unasked salt or pepper has no row, so the fallback crosses the person's first said row. Failure: Nana asked fried eggs with pepper,
  the child added salt too: the pop-up crosses a row that was made right (the builder says the same).
- `UI.mission.serveWrong` sets `r.wrong` and nothing clears it (eggs has no redo; `M.showWrong` only unmarks what it marked itself,
  `js/cook/ui.js:4023`, `:4036`). `closeItem(…, {all})` then ticks the same rows, so the card goes into the served moment and the thank-you
  scene with rows both red and done. To check by eye against non-negotiable 7.
- The round itself ends rightly: one pass, the pop-up, `H.end()`, no praise line, the end. No state is left for the next round.

### 6. The first-time "tap" finger is played as a drag, and can come before its light (low)
- `js/shared/onboard.js:1805` with `js/cook/stations/samosa.js:1327`, `js/cook/stations/maani-line.js:441`.
- `Onboard.gesture` turns `gesture: "tap"` into `"drag"`; with `from` equal to `to` the finger presses and holds in place for 900 ms. The
  comment in both games says "Onboard.gesture's tap". It is logged as a drag ghost on a tap step.
- The finger starts 300 ms after the step opens; the light waits for a still stage (up to 3 s), so on the fry's knob the finger can show
  on an undimmed screen first. Every path that closes the light also stops the finger (both go through `lead` and `flipLead`).

### 7. Sekelo: a tray skewer can glow after its first-time light has closed (low; the builder's own, not applied)
- `js/cook/mechanics/grill.js:2132`: `placeLit` reads `lights["grill-place"].h`, which stays set after the light's own close. The
  builder names the fix (`&& !h.over`) and did not apply it (contract-102).

### 8. Sekelo: if the kit's tray fails to load, the old rack is asked for and is no longer loaded (low)
- `js/cook/mechanics/grill.js:165`, `:1298-1299`, `:1325`. `SK.v3` is now true on the v4 stick alone. With `gk-tray` missing,
  `SK.rack` falls to `SK.rack3`, which draws `sk3-rack-0`: a texture the loader dropped. A slow or failed load only (the loader's 15 s cap).

### 9. The plain stir line is still not on Mum's sheet (low, outside `js` and `data`)
- `docs/language/recording-sheet.md:177` holds only "Stir it three times, slowly."; daar L1-L3 shows `stirAskPlain`
  (`data/stations/daar.json:10`) in grey. The builder's report says "Mum: none new".

### 10. Baking: salt is still out of every plan (low; a question for Zafar)
- `data/stations/baking.json` plans. The builder recommends it stays a decoy. Non-negotiable 1 wants his word either way.

## The earlier findings

### s19-clean-b review
| # | finding | now | where |
|---|---|---|---|
| 1 | Chai's first-time pour light gone below L4 | fixed | `chai-tray.js:1787`: `fullFirst` only with `halves`; below L4 `gate14.first("ctl-pour")` |
| 2 | CHAI-110 for a child who reaches L4 by play | fixed, with finding 4 above | seats `data/cook.json:1095-1098` full then half; `chai-tray.js:1788` off the fresh gate, on the save key `chai-tray:s14-ctl-pour-again` |
| 3 | PAN-19 not in the game | fixed (not these builders) | `js/cook/flow.js:474`, `:1840` |
| 4 | CHAI-109 does nothing | overtaken (not these builders) | the card light has no timer now (`coach.js:958`, SH-261); not checked further |
| 5 | "A little, a lot" in baking's how-to | fixed (not these builders) | no match in `data/cook.json` |
| 6 | Pass-me won by reading the pill | fixed | `fetch.js:298-300`: never a jar whose pill shows its word |
| 7 | Shelf pills take the fridge's slot | fixed | `fetch.js:182`, `:201`: rows and pitch by zone |
| 8 | A cup of water higher than a cup of milk | fixed | `baking.json` `lineAtFor`: recomputed here, all five keys agree to 0.001 |
| 9 | Salt gone; three quarters has no word moment | partly fixed | four new moments, one a round (`baking.js:717-722`); salt: finding 10 |
| 10 | Chop's hop clock behind its schedule | fixed | `chop.js:1062-1063`: one capped beat for both |
| 11 | Eggs' hold wipes the first control's | fixed | `eggs.js:939-941`: let go and settled before `refresh()`; the first step inside the `try` |
| 12 | "It's ready" dropped with no voice | fixed | `baking.js:628`, `:686` (`always`) |

### s19-clean-c review
| # | finding | now | where |
|---|---|---|---|
| 1 | The stir ends short on a let-go | fixed | `stir.js:698`: `count < laps` never ends it; the stuck help runs until the count (`:722`) |
| 2 | Stale ticked piece cards on a redo | fixed (s19-clean-a) | `ui.js` `M.reopen` clears `unitGot` |
| 3 | Sekelo at 740x320 does not finish | partly fixed | L2 ends; L3 and L4 do not: finding 1 |
| 4 | The finger gone from the fry and the flip | fixed, with finding 6 above | `samosa.js:1319-1345`, `maani-line.js:423-442` |
| 5 | Sekelo's card lost the number and kind | fixed (s19-clean-a) | `ui.js:3250-3252`; the builder's run still counts 6 contract-30 breaks, not looked into |
| 6 | The stir game lost its speed and its L3 switch | fixed | `stir.js:500`, `:571`, `:937-938`; daar passes `exact` (`daar.js:1251`), so no speed before L4 there |
| 7 | A release off the canvas hangs the stir | fixed | `stir.js:750-752` |
| 8 | Maani's moment card left behind; spent early | fixed | `maani-line.js:851-857`, `:907-909` |
| 9 | Corn lists the old grill | fixed | `data/stations/corn.json:476` |
| 10 | The plain stir line not on the sheet | not fixed | finding 9 |

## Checked and found sound
- Every `assets/` path added by the three diffs exists; sekelo's and the kit's paths in `data/cook.json` exist (49 of 49);
  `grill-v2.webp` is 1621x813 and `tray-steel.webp` 1000x422, as `GrillKit.ART` says; `skewer-empty.webp` is 1000x61, as `STICK4` assumes.
- No hand-written Kutchi on any added line. The grey English lines (`stirAskPlain`, the moments' cards) go through `Lang.toRecord` or
  the card's `rec`.
- Corn: `grill-kit.js` only gains `TRAY_SLICE`, `TRAY_RIM` and `trayTex`; `GK.ART`, `GK.art`, `GK.layout` are untouched.
- Daar: `stir.js`'s changes reach it only through the count rule (meant) and `exact: true`; it passes no `turnSwitch`, so no switch.
- Nothing else reads the textures sekelo stopped loading (`sk2-*`, `sk3-rack-*`, `sk3-stick`, `sk3-grill`, `sk3-tray-long`) outside
  the fallbacks in `grill.js` and `thread.js`. The tray holds four; the thread's and the grill's racks are four (`mishkaki-grill.js:89`).
- Eggs: one section per person on the ladder, so `rowsOf` finds all of a person's rows; `kindIds` exists; without the kit the old loop runs.
- Baking: the base moment and the four new ones each have their own save key; the first due wins; each measure's `fill` matches
  `(0.90 - lineAt) / 0.78`.
- Chai below L4: `againFirst` and `fullFirst` are both false, so the path is the old one.

## Proof
Read:
- `CLAUDE.md`; the two accounts and the two earlier reviews.
- `git diff 4effffdce^1 4effffdce -- js data` (8 files), `git show 6f032bc35` (`data/cook.json`, `js/cook/ui.js`),
  `git diff 2acf13262^1 2acf13262 -- js data` (6 files), each whole.
- Around them: `js/shared/serve.js` `round`; `js/cook/kitchen-kit.js` `serve` and the hook; `js/cook/ui.js` `M.serveWrong`, `M.reopen`,
  `M.showWrong`, `M.redoStart`, `M.redoEnd`, `UI.holdCalls`, `UI.wordMoment`, `UI.wordMomentDue`, the order cards (3199-3299);
  `js/cook/coach.js` `C.firsts`, `C.control`, `C.demo`; `js/shared/onboard.js` `firsts`, `gesture`; `js/cook/order.js` `ladder`;
  `js/cook/zone.js` `on`; chai's `coachStep`, `review`, `emptyPan` and its serve; the grill's `placeOnRack`, `toGrill`, `lightUp`.

Ran:
- An existence check of every `assets/` path on the three diffs' added lines: none missing.
- `node --check` on the twelve changed JS files: ok.
- `node --test build/test_shared_w1b_card.mjs`: 9 of 9 pass (SAM-35's test among them; see finding 2 for what it does not read).
- A node script over `build/test_cook_harness.mjs`: 200 samosa orders a level; two kinds in 0 at L1-L2 and 200 at L3-L4, with the
  speech and headline quoted in finding 2.
- A node script over `data/stations/baking.json`: water's lines turned into the new jugs' fractions (271x249 and 323x301, 260 wide)
  equal the file's values; the plans' asked amounts by level.
- PIL for the four pictures' sizes.

Not run: the browser suite, the contract, any play. Finding 1 rests on the builder's run; findings 2 to 8 are read from the code
(finding 2 also from the engine in node).
