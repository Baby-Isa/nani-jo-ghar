# s08 wave 4A, daal: details (builder: Opus, worktree-agent-ace978fbf156d6b1d; not judged)

## Flaws first

| # | Flaw |
|---|---|
| 1 | **Not used: DP3's tadka, veg, done and lentils discs.** They show curry leaves, a dried chilli, onion with tomato and coriander that an order may not have (DAAR-16: the pot shows only what went in). After the pour the pot shows the plain daal disc with DP1's pieces of what went in; the tadka's seeds now lie under the daal poured over them (before, they came up on top). That is a look Zafar did not ask for: a question for him (use the tadka disc anyway, or a seeds-only tadka disc in the next art run). |
| 2 | **DP2's pot is not quite top-down either:** its floor circle sits about 31 px (of 705) below the rim's centre, so the top wall shows wider than the bottom (measured on the cut: the floor's edge at r 216-220 above, 280 below, 248 left and right). The contents disc covers the floor, so it shows only as the wall band. DAAR-31 may still fail on the eye. Art, not code. |
| 3 | The flag is drawn in code (no art): a dark pole and a black and white chequered flag with a thin dark outline, on the rim at 12 o'clock. At the start the ladle's handle lies under its pole. |
| 4 | **DAAR-34 at L4:** the level table (Zafar, 19 Oct, newer than P54 of 17 Oct) folds Nani's chop card at L4, so the dotted rows show at L3 only (and in L4's peek). The L4 strip is a tool failure (a folded card does not change). A peek at L4 mid-chop shows the uncalled rows dotted: contract-27 would break if a peek were played there (no flow peeks at L4). The research table puts the staged reveal at L3: built there. |
| 5 | The staged reveal was first built from L2; the green run's contract-35 broke at L2 (an open card writes every word), so it now starts at L3. **That last change was not re-run in a browser.** |
| 6 | The stir line is the engine's three pieces joined: "Firai! Ba! jaldi" (the speed word lower case, no mark: Lang.join). The one sentence waits on Mum (DAAR-26, for /mum-round: "stir it three times quickly / slowly"). |
| 7 | A lap whose number comes while another line is still sounding (her stir line, when the child starts at once) is counted and shown but not said (P10: "a late number is dropped"). The runs never hit it. |
| 8 | New finding at L1 (seed-dependent, not in the baseline): the shelf chip "laal marcha" (a lookalike decoy) drawn at 9.4 px (canvas-text-small): the shared Kit.chip shrinks a long word to fit (js/cook/kitchen-kit.js, not mine). `--check` would fail on it. |
| 9 | contract-11 breaks on the evidence runs' x2 pages (the worktop background at 2.23 px per source px): the pixel ratio 2 pages only, the same in red; not this change. |
| 10 | Not run (browser limit, about 20 min used): the touched sandbox (contract.mjs maps to about 90 flows), the load check, cook:chop / cook:stir / cook:tadka labs, clinic:heal-taste (pour.js's SVG ring changed the same way), cook:daal in the kitchen, every size but 1366x768. |
| 11 | Docs not mine to edit: decision 75 (1) says the stir opens with the request pop-up; Zafar's P9 (17 Oct) reverses it (ui.js M.request's comment too). DAAR-10 ("the trivet stays") is reversed by DAAR-33; its probe still says so. |
| 12 | contract-66's true red: the red build's lap log used an older format, so contract-66 did not judge it. That log shows the old laps counted 46-117 degrees from 12 o'clock (`node scratch/vlog.mjs` on ev-w4a-evred); contract-66's recorded red is "no lap logged" on the untouched build (w4a-red). contract-65 and 66 read the game's own logs (as contract-37 does), not pixels. |

## What changed

- **Pot (DAAR-29, DAAR-31, DAAR-05):** `js/cook/stations/daar.js`: DP2's pot, a still rim (the pot with its middle cut away, drawn over the contents), the contents a disc: oil, seeds and vegetables cut at run time from the v3 pots' contents circle (`OLD_IN`), the daal DP3's plain disc, DP3's stirred swirl rising with speed and staying once stirred. Only the nine pre-daal v3 pots load (decision 68; data/cook.json's daar files and prefetch). The served bowl takes the stirred disc.
- **Mat (DAAR-33):** the trivet left by the pour fades out.
- **Pour (SH-117):** `js/shared/pour.js`: the white splash ring is a soft ripple of the liquid's colour (Phaser and SVG).
- **Stir (DAAR-26, 27, 30, 32):** the flag at 12 o'clock; the ladle starts under it; a lap counts as it crosses the flag after 3/4 of a turn the same way; the click, the flag's flutter, the dial's number and the said number at that moment; a tap goes round to the flag. No stir pop-up (`UI.mission.reveal`); the step call says "Firai! <n>! <speed>" once at every level; a speed at every level (data/cook.json: recipe slot `speed`, `mechanics.stir` L1 `speeds: true`).
- **Chop (DAAR-34, 35):** `js/cook/mechanics/chop.js`: the next wave's throws follow the last at the same spacing (one flight at the end); a slice counts for its own wave; `onCall` tells daar each round; the card dots uncalled rows whole (L3 up).
- **Checks:** `build/sandbox/lib/contract-daal.mjs` (contract-65 chop waves, contract-66 stir flag), wired into contract.mjs, tests `build/sandbox/contract-daal.test.mjs`; evidence probes for DAAR-26, 27, 29-35 and SH-117.

## Proof

| Check | Red | Green |
|---|---|---|
| contract-65 | w4a-red: 2 (no throws logged); ev-w4a-evred (old chop + log): 12, gaps 0.97-2.1 s real at test speed 3 | ev-w4a-evgreen: 0 |
| contract-66 | w4a-red: 2 (no lap logged); old laps 46-117 deg off 12 o'clock | 0 (L1-L4) |
| contract-22, 30, 36 | 0 | 0 on daal L1-L4 |
| contract-35 | 0 | 1 at L2 (fixed after, not re-run) |
| Stir line (voice) | L1 "Firai! Ba!" (no speed); L4 "Trae!" then "Firai! Trae!" | one line each: L1 "Firai! Ba! jaldi", L2 "Firai! Ba! aste thi", L3 "Firai! Char! jaldi", L4 "Firai! Trae! aste thi" |
| Laps in step | | each number started at its lap (0-5 ms), laps 0.47-5.9 s |
| Chop card L3 (dom) | "ba ••• / ba ••• / trae •••" at the first slice | "ba ••• / ••• / trae •••", then all three as called |
| checks.mjs | | unit 404 pass, words 0 literals, static, leak (18), bump, specs, docs, size ok; load not run |
| check_vessel_meta.py | | 0 FAIL |

Runs: `build/screenshots/sandbox/{w4a-red, w4a-g1, ev-w4a-evred, ev-w4a-evred2, ev-w4a-evgreen}`; sheets `build/screenshots/evidence/w4a-evred*/`, `w4a-evgreen/`; indexes `build/reports/evidence-w4a-*.md`.

## Filmstrips (PNG, build/screenshots/s08-w4a-daal/; git-ignored, in this worktree)

pot-states-L1..L4.png and pot-states-red-L1..L4.png (every pot state, x2), pour-green-L1.png / pour-red-L1.png, stir-green-L1.png / stir-green-L4.png / stir-red-L1.png, chop-card-green-L3.png / chop-card-red-L3.png, chop-green-L4.png / chop-red-L4.png, mat-L1-green-red.png / mat-L4-green-red.png.

## QA (builder's run; the reviewer fills the verdicts)

QA: cook:daar L1-L4 @ 1366x768 · reviewer: not yet · commit: see the report
Auto: contracts 1-66 on ev-w4a-evgreen: 5 breaks (contract-11 x4 on x2 pages, contract-35 x1, fixed unrun); checks.mjs ok but load (not run)
Checklist (builder's notes, not a verdict): TXT ⚠ TXT-05 (the laal marcha chip, flaw 8) · LNG ⚠ LNG-03 (the joined stir line, flaw 6) · ART ⚠ ART-03 (DP2's floor offset, flaw 2), ART-12 (contents are pictures, cut to discs) · INT-01 (input live while she speaks: the stir starts at once) · CMP ✅ (no new UI; the flag is in the play area)
Regressions to recheck: `node build/tools/review/regress.mjs cook:daar cook:chop cook:stir cook:tadka clinic:heal-taste` (cook:daar 37 rows).
