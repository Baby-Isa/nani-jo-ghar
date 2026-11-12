# s19-clean-a: the wrong-order pop-up, help lights that stay, the shared checks (12 Nov)

Opus, high. Branch `s19-clean-a`, never pushed (a hook asked for a push; the brief forbids it). Flaws first.

## Flaws and open
- **Chai and eggs need lines from s19-clean-b2** for SH-266 (below). Until then contract-118 is red on chai (a right cup's face stays) and eggs (no pop-up: eggs serves without the shared round).
- **SH-264's own evidence probe never reached the pop-up** in `s19-clean-a-wo-ev-after` (chai L3: the driver's spice did not make a wrong cup that run; eggs: the driver took a shaker's shadow, fixed after). The contract run did reach it (chai L3 1280x665: card in the middle, all five items in view, face 144 px against 48, the cross).
- **Runs are mixed:** the after run's last ~40 pages and the proof run picked up the s19-clean-b/c merges and later commits as they landed. SH-267 (contract-119) came after both and its last fix (the card on the page's layer) after the proof run: 12 L1 pages red there, not re-played.
- **SH-175 fails:** chai L3 930x430 at 4000/60 loads in 32.9 s against 26.7 s (+23%, 412 requests); not fixed.
- **Not done:** SH-232, SH-152 (99 3, 72 12), SH-230 (105, 92, 53), SH-237 (107 14), SH-249 (112 8), contract-104 (17; cause not found), SH-60, SH-178, SH-251, CHAI-111's lab-host path, the full `evidence.mjs --after --brief` (no before folders exist for this brief's rows).
- **CHAI-109:** the card light has no timer now (SH-261), so it stays until the child moves on: longer than any `o.ms`; s19-clean-b's `o.ms` line not applied.
- **Mine to say:** the asker's face in the pop-up is the kit's big circle scaled 2x (contract-42 measures the laid-out size); `cook.html` still loads Google fonts (not mine; SH-224).
- **Zafar's choices I made:** the pop-up runs only when a round has a wrong order; an all-right round ends as before. The reveal lesson's light keeps its timer (a showing, not a move).

## What changed
- **SH-264-266** `js/shared/wrong-order.js` (lab: `lab/wrong-order.html`), styles in `css/shared/order-card.css`; `NjgServe.round` (`js/shared/serve.js`) opens it in place of the recast through the kitchen's hook (`kitchen-kit.js`), the right orders leave (`o.leave`), the panel keeps the wrong orders' cards, the current one first (`ui.js` `M.showWrong`, `M.redoStart`, `M.redoEnd`). His 11 Nov night answers: red border and wrong item, a soft note (Mum's "oho" to come), the asker says their own line, shorter beats.
- **SH-261 full strength:** Nani's help lights stay through any tap (`onboard.js` stuck rungs, `coach.js` `C.stuck`); no timer on the pan-switch or card lights. contract-117 now judges every light against the step still wanted.
- **SH-267** (L1 only): `WordCard.flash` + `UI.dishFlash`; contract-119.
- **Checks:** contract-118, -119 (new); 36 waits for Nani's card (SH-172); 37 full-kit shelves; 109 skips the pantry's painted shelves; 113 the cog's open menu; 114 samosa's heaps (SH-256); the serve-wrong driver reaches L3. Sandbox media cached as Pages does (SH-242).
- CK-79/SH-148 sekelo's piece rows whole and folded at 740x320; the current card glides whole (116). The Fable review of s19-clean-c, 2, 3, 5 (`ui.js`).
- SH-224 fonts; CK-56 voice test green and listed, host test retired; CHAI-67 second-play probe; cook.json: the k3 prefetch lines.
- s19-clean-b's lines: PAN-19 (`flow.js`), CHAI-110 seats, CK-72's how (`cook.json`); 115 (a lying thing by its length, `bk-jug` not main), 36 (the order line that brings a card is its call; the skip window stays 1 s, the bad runs hold it); CHAI-111's idle-bump note (`guide.js`).

## Lines for s19-clean-b2
- `chai-tray.js`, in `serve.round({...})` after `reset: emptyPan,`:
  `leave: (pan) => Cook.tween(S, { targets: [pan.face, pan.well.face, pan.well.glass.empty, pan.well.glass.half, pan.well.glass.full].filter((o) => o && o.active), alpha: 0, duration: 300 }),`
- `eggs.js`: serve the plates through `Cook.Kit.serve().round({ items: P0, done, check, review, recast, reset, again, leave, redo: St.redo(ctx), key: (pl) => \`eggs:${pl.q.who}\`, showRight })` as chai does, `check` calling `UI.mission.serveWrong(ids, 0, { for: pl.q.who })` for a wrong plate; the pop-up and the panel come with it. Without a redo: mark the rows, then `await Cook.Kit.wrongOrder()`.

## Proof
- Contract, every kitchen flow L1-L4 at 740x320 and 1280x665, judged by today's checks (`--from-run`): before (`s19-clean-a-before`, the code at launch frozen in a copy) `CONTRACT FAILED: 330 breaks`; after (`s19-clean-a-after`) `CONTRACT FAILED: 341 breaks`. Ends: before 86 of 92 (6 timed out: maani L2 x2 cut by me, sekelo L3-L4 740, chai L3-L4 740), after 89 of 92 (sekelo L3-L4 740, chai L4 740). 0 page errors either way.
- By check, before to after: 118 4→5, 109 16→1, 111 29→14, 106 28→18, 114 29→17, 36 44→57, 104 8→17, 107 7→14, 72 8→12, 112 3→8, 37 16→19, 115 31→33, 99 4→3, 116 6→4. 117's full-strength rule and 119 are not comparable (their samples are new). Left by owner: chai and eggs 118, 113 and 107 (s19-clean-b2); 36, 111, 117 in samosa, maani, sekelo, daar, baking and the pantry (their builders: missing calls, taps on jars, lights a drag hides); 104, 72, 99, 112, 116 (mine, open).
- Proof run, four sizes, L1 (`s19-clean-a-contract`): 44 of 44 ends, 0 page errors, `CONTRACT FAILED: 123 breaks` (re-judged; 36 31, 111 20, 119 12, 106 10, 117 10, 114 6, the rest 1-4).
- contract-118 red before (chai and eggs L3 `#serve-wrong`), green on chai's pop-up after, red on its leave and on eggs (s19-clean-b2). Evidence sheets: `build/screenshots/evidence/s19-clean-a-wo-ev-before/` and `-after/` (SH-265, SH-266; SH-264 never reached, above).
- Unit: sandbox tests 275 pass; `checks.mjs` all ok (above).
- check-change: its push tier PASSED, `checks.mjs` all 13 steps ok (`build/reports/tiers/push-0d7553f207.md`); its play step (276 pages, one at a time: about 6 h on this machine) I stopped after 2 pages, both ended (`build/screenshots/tiers/change-79f2eda3b1/logs/`). Not passed as a whole.
