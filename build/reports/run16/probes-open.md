# Run 16: probes-open

Red-on-base checks for the open code rows that had no evidence spec (Cook first). There are 42 rows, each in `build/reports/run16/probes-open.json` with its spec in `build/sandbox/data/evidence.json` under its own key.

- **Where the runs played:** on today's head (48003532) on this VM, port 8871.
- **Eye rows:** their judge batches are committed under `build/screenshots/evidence/po-*/judge/`, and the judge session has ruled on most of them.
- **Counts:** 26 open (21 red on head), 6 proven, 6 built, 3 cannot-probe, 1 question.

## Flaws first

- **SH-291, SH-289 and CHAI-114 are green on head but have no red.**
  - SH-291: contract-99 stays green even with 827f8aa1's order-card and ui parts reverted, so it cannot see the refold.
  - SH-289: the fault needs a ten-word chai round. A seeded three-person round (want) found no match in two 13-minute chunks.
  - CHAI-114: the fix commit is not found.
- **PAN-23, SH-299 and SH-211 are cannot-probe.**
  - PAN-23: not reproduced on head or before SH-304's fix.
  - SH-299 and SH-211: they need a card's last landing frame or a per-frame scroll log, and no capture reads either yet.
- **SH-271 and SH-229 are not reproduced on head (machine green), and no fix was found for either.**
  - SH-271: docs/status.md (15 Nov) calls the strips' blink a probe artefact.
- **Several probes missed their moment at first** (the judge's EVIDENCE verdicts): SH-275, SH-279, SH-281, SH-286, SH-295, SH-299, SH-303, SH-211, SH-136. Most are re-aimed and since ruled; SH-281's re-aim (po-t1) still waits for the judge.
- **How an old commit was made red:** its runtime (js, css, data, the pages) was checked out into the main tree for one run, then restored. A worktree is 3.6 GB, and five of them filled the disk once at 05:54 (cleared at once). One stopped run killed its own restore. I restored by hand and checked that the tree matches head.
- **Machine checks that are rough proxies:**
  - SH-288 flags the order card's tappable word (16-21 px tall), not the speakers the row lists, which now have 48 px hit areas.
  - SH-276 counts Nana's face on the card during the chop.

## Red on head (open)

| Row | Game | Check | What it shows |
|---|---|---|---|
| SH-270 | chop | count:#guide .ng-face>=1 | Nani's box text only in chop, both sizes |
| SH-277 | eggs | lines:#mission .oc-headline<=1 | the headline on 2 lines at 740x320 (L1, L4) |
| SH-276 | chaat, daar | count:#mission .oc-card .oc-face>=1 | during the chop the headline is Nani's 'Chop these.', no face |
| SH-288 | chai | noFinding:tap-small | the order card's tappable word 37-50 x 16-21 px, four sizes |
| CK-115 | corn | inside:#mission .oc-card in #side | L3, L4: the second order's card past the panel's foot |
| SH-224 | kit | build/test_fonts_local.mjs | 9 pages and a script load Google Fonts |
| LNG-20 | other | build/test_family_takes_linked.mjs | 63 usable take ids linked to no word ('Khuda hafiz!' among them) |
| LNG-22 | other | build/test_no_religious_set_pieces.mjs | the first launch still plays its Eid scene |
| PRC-11 | other | grep on the check-in skill | no plan table |
| SH-275 | chop | eye, judge FAIL | a stopwatch disc beside the board (chop, chaat, daar) |
| SH-279 | samosa | eye, judge FAIL | the praise face on the spoon's head, the chip on the plate's edge |
| SH-283 | chaat | eye, judge FAIL | the shelf differs between sizes, same seed |
| SH-284 | samosa | eye, judge FAIL | Nani's box under the dim while she speaks |
| SH-287 | chai | eye, judge FAIL | no lift in the order view |
| SH-302 | eggs | eye, judge FAIL | the held egg small at L4 |
| SH-280 | baking | eye, judge FAIL | stage start in one step, no glide |
| CK-93 | eggs | eye, judge FAIL | no 'Shabash!' bubble beside Nana at L4 |
| MAA-25 | maani-line | eye, judge FAIL | plates in the shelf tray with the dough piles |
| SH-135 | kit | eye, judge FAIL | Cook's three title buttons not one look |

## Proven (red before, green after)

- **LAB-08:** red at 934f5fa^, green at 934f5fa.
- **ART-74:** red at e2f548e5^ and b95ad596^, green on head and on main.
- **SH-300:** red with 42de17a1 reverted, green on head.
- **SH-304:** red on the runtime at c00da13^ (contract-129), green on head.
- **SH-273:** red on the runtime at 009c5dd3^ (contract-128), green on head.
- **SH-301:** red on the runtime at 642f1efd^ (Nani's face 4.3-5.6 px off the cards' face line at 740x320 and 930x430), green on head (0.0 px). The check reads alignment only, not the 1 px size match.

## Built (green on head, red not shown)

- **SH-291:** fixed by 827f8aa1.
- **SH-289:** fixed by db494cae.
- **CHAI-114:** green at L1-L4.
- **SH-303:** fixed by 677d1a0; the delivery is chai's scene.
- **SH-286:** the judge sees place, size and look match.
- **SH-295:** the judge sees no early wrap.

## Open, not yet red

- **CHT-22:** the cog part is green (DAAR-65). Left: the dim flash, the potato on the board and tray at once, the flying piece; these are chop's own.
- **CK-97:** the half-full bottle needs art.
- **SH-281:** po-t1, for the judge.
- **SH-271:** machine green, not reproduced.
- **SH-229:** machine green, no fix found.
- **SH-136:** needs a one-row Nana card at a 915-like size.
- **SH-226:** needs his sound picks first.

## Questions for Zafar

1. **SH-122 (the zooms):** nothing is designed yet. Which way should a zoom go (the S12 idea: a match-cut into lined-up close-up art), so a check can be written?
2. **SH-287 (chai's order view):** the judge sees no lift under decision 35's cap. Chai is frozen: may the lift go further?
3. **SH-288 (chai's order card):** the tappable Kutchi word is under 48 px tall. Chai is frozen: may its hit area grow (an invisible border, the look unchanged)?
4. **LNG-22 (the first launch):** the birthday needs a recorded Kutchi line in place of 'Saware Eid ai.' Is it on Mum's list?

## Files added

- `build/test_labs_importmap.mjs` (LAB-08)
- `build/test_fonts_local.mjs` (SH-224)
- `build/test_no_upload_folders.mjs` (ART-74)
- `build/test_no_religious_set_pieces.mjs` (LNG-22)
- `build/test_family_takes_linked.mjs` (LNG-20)

None of them is in checks.mjs's unit list (only `build/test_shared_*.mjs` is), so a red one never blocks a push.
