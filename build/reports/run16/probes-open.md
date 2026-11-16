# Run 16: probes-open

Red-on-base checks for the open code rows that had no evidence spec (Cook first). Every row is in `build/reports/run16/probes-open.json`; every spec is in `build/sandbox/data/evidence.json` under its own row key. Runs played on today's head (48003532) on this VM, port 8871. Eye rows have judge batches committed under `build/screenshots/evidence/po-*/judge/`.

## Flaws first

- **Five probes missed their moment the first time** (SH-275, SH-279, SH-286, SH-295, SH-299, SH-303: the judge's EVIDENCE verdicts). They are re-aimed (runs po-o1, po-p1, po-q1, po-r1, po-t1) and waiting for the judge. Until it rules, those rows are not red.
- **SH-291, SH-289 and CHAI-114 are green on head but have no red.** SH-291's contract-99 stays green even with 827f8aa1's order-card and ui parts reverted. SH-289's fault needs a ten-word round, and the 'want' seed did not get one. CHAI-114's fix commit was not found.
- **PAN-23 is not reproduced.** It is green on head and also on the runtime before SH-304's fix.
- **SH-271 is not reproduced either.** The dim holds 1.5 to 3.5 s at every first light, and contract-117 has 0 breaks. docs/status.md (15 Nov) calls the strips' blink a probe artefact.
- **Proving red on an old commit swaps js, css, data and the pages in the main tree for one run, then restores them.** A worktree of this repo is 3.6 GB, and five of them filled the disk once (05:54). That stalled one browser run, which I stopped and re-ran.
- **The judge's audit:** CK-115, SH-288 and LAB-08 PASS. SH-275 FAILed for missing chop, chaat and daar; they are now in.

## Red on head (open, the check fails for the row's reason)

| Row | Game | Check | What it shows |
|---|---|---|---|
| SH-270 | chop | count:#guide .ng-face>=1 | Nani's box text-only in chop at both sizes (chaat fine) |
| SH-277 | eggs | lines:#mission .oc-headline<=1 | eggs' headline on 2 lines at 740x320 (L1, L4) |
| SH-276 | chaat, daar | count:#mission .oc-card .oc-face>=1 | during the chop the headline is Nani's 'Chop these.' with no face |
| SH-288 | chai | noFinding:tap-small | the order card's tappable word 37-50 x 16-21 px, four sizes |
| CK-115 | corn | inside:#mission .oc-card in #side | L3, L4: the second order's card past the panel's bottom |
| SH-224 | kit | build/test_fonts_local.mjs | nine pages and a script load Google Fonts |
| PRC-11 | other | grep on the check-in skill | no plan table |
| LNG-22 | other | build/test_no_religious_set_pieces.mjs | the first launch still plays its Eid scene |
| LNG-20 | other | build/test_family_takes_linked.mjs | 63 usable take ids (76 takes) linked to no word, 'Khuda hafiz!' among them |
| SH-283 | chaat | eye (judge FAIL) | the shelf differs between sizes, same seed |
| SH-284 | samosa | eye (judge FAIL) | Nani's box under the dim while she speaks |
| SH-287 | chai | eye (judge FAIL) | no lift in the order view |
| SH-302 | eggs | eye (judge FAIL) | the held egg small at L4 |
| SH-280 | baking | eye (judge FAIL) | stage start in one step, no glide |
| CK-93 | eggs | eye (judge FAIL) | no 'Shabash!' bubble beside Nana at L4 |
| MAA-25 | maani-line | eye (judge FAIL) | plates on the shelf with the dough piles |
| SH-135 | kit | eye (judge FAIL) | Cook's title buttons not one look |
| SH-275 | chop | eye (po-p1, for the judge) | chop's stopwatch disc beside the board |

## Proven (red before, green after)

- **LAB-08:** red at 934f5fa^, green at 934f5fa.
- **ART-74:** red at e2f548e5^ and b95ad596^, green on head and on main.
- **SH-300:** red with 42de17a1 reverted, green on head.
- **SH-304:** red on the runtime at c00da13^, green on head.
- **SH-273:** red on the runtime at 009c5dd3^, green on head.

## Built (green on head, red not shown)

- **SH-291:** fixed by 827f8aa1; the probe cannot see the refold.
- **SH-289:** fixed by db494cae; the fault needs a ten-word round.
- **CHAI-114:** green L1-L4; fix commit unknown.
- **SH-303:** eggs' delivery and chai's are one scene (po-o1). The judge's audit PASSed the check; the re-aimed strip waits for its verdict.
- **SH-301:** fixed by 642f1efd; proving 1 px needs box numbers.
- **SH-286, SH-295:** re-aimed probes wait for the judge.

## Still open, not red yet

- **CHT-22:** the cog part is green (DAAR-65). The dim flash and the potato on the board and tray are chop's own.
- **CK-97:** the half-full bottle needs art.
- **SH-279:** the judge's batch po-q1.
- **SH-281:** re-aimed at every move (po-t1). Eggs' empty pan is clean; chop and daar are for the judge.
- **SH-299, SH-211:** re-aimed strips, for the judge.
- **SH-136:** needs a one-row Nana card at a 915-like size.
- **SH-229:** green, no fix found.
- **SH-226:** needs his sound picks first.
- **PAN-23:** cannot-probe.

## Questions for Zafar

1. **SH-122 (the zooms):** nothing is designed yet. Which way should a zoom go (the S12 idea: a match-cut into lined-up close-up art), so a check can be written?
2. **SH-287 (chai's order view lifts):** the judge sees no lift under decision 35's cap. Chai is frozen: may the lift go further?
3. **SH-288 (chai's order card):** the tappable Kutchi word is under 48 px tall. Chai is frozen: may its hit area grow (an invisible border, the look unchanged)?
4. **LNG-22 (the first launch):** the birthday needs a recorded Kutchi line in place of 'Saware Eid ai.' Is it on Mum's list?

## Files added

- `build/test_labs_importmap.mjs` (LAB-08)
- `build/test_fonts_local.mjs` (SH-224)
- `build/test_no_upload_folders.mjs` (ART-74)
- `build/test_no_religious_set_pieces.mjs` (LNG-22)
- `build/test_family_takes_linked.mjs` (LNG-20)

None of them is in checks.mjs's unit list, so a red one never blocks a push.
