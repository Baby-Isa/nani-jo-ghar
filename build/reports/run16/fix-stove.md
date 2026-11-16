# Run 16: fix-stove (eggs, corn, baking, sekelo)

Branch `run16/fix-stove`, cut from 48003532. Results: `build/reports/run16/fix-stove.json`. Ready for prove: `build/reports/run16/fix-stove-ready.txt`.

## Flaws first

- **CK-100's fix changes a judged look on phones.** At 740x320 baking's tray is small, and the face's 30 CSS px floor is over a quarter of its width, so the face can't sit in the tray's corner without covering the first naan (contract-113). It now sits just outside the tray's upper corner on a phone, and the tray's light takes it in. On a laptop it stays in the corner as before. Round 3's judge asked for "the light frames the thing alone"; on a phone that light is now a face wider. The judge should look at it (judge batch from check-change).
- **CK-132's drop-down part could not be shown red.** The arrow is there over the whole grill screen, both on base and on the commit before corn's round 2. It steps aside only while a control's call is said, which is the kit's rule (SH-172) in every game. The judge's frame was probably such a moment. The faces and pills parts are for the eye.
- **A tool fault makes the stove games' contract runs look worse than they are.** Evidence pages played with profile "seen" reach the contracts with no profile (`build/sandbox/run.mjs:275`), so the new-player checks judge a returning player as new. Most contract-98 breaks and some contract-78 breaks on seen pages are this. It's a one-line fix for the orchestrator; no builder owns build/sandbox.
- **Eggs' served plate shows one egg for a two-egg order** (L2-L4, the serving kitchen). This is new and needs fix-kit (`js/cook/serve.js:156`), probably with art too. Not fixed.
- **check-change's chai frozen step did not pass: it ran out of time.** It played 19 flows, saw 24 pages differ, and hit its 35-minute limit while replaying them to confirm, with my proof runs sharing the browser. So no chai difference is confirmed. My diff from base is only `js/cook/stations/baking.js`, which chai never runs. Prove should run `frozen.mjs --diff` alone, with nothing else on the browser.
- **contract-70 still breaks in eggs L2-L4 on base** (no take-out call by 0.90 of the ring). That's CK-126, which is built and so belongs to probes-built. Left alone.

## Proven (a check red before the fix, green after)

| Row | Red | Green |
|---|---|---|
| SH-308 (stove games) | 49369e3^ (7ff346a): sekelo L2 740x320 leaves a card open at well done | base: 32 of 32 pages (sekelo, eggs, corn, baking; L1-L4; 740x320 and 1280x665) |
| CK-93 | 677d1a0^ (cfc2469): the table room's cat and table plates at all 8 pages | base: 8 of 8 |
| SH-303 (eggs' share) | the same probe as CK-93 | the same |

All three were fixed before the run (49369e3 and 5b5d0b5; 677d1a0). Their statuses were never updated.

## Built this run (red on base, green after; prove to confirm)

- **CK-100** (`js/cook/stations/baking.js`): Dada's face no longer covers the raw naan at 740x320.
  - Red on base: contract-113 at L2-L4 740x320, "nana's face sits over bk-naan-golden (19%)". Run `stove-base-ck100b`; the L1 break is in run `ev-stove-sh308-base`.
  - Green after: 8 of 8, first on the face move alone (run `stove-ck100-after`), then with the light change and contract-82 added (run `stove-ck100-after2`).
- **Baking contract-36 at L4** (no row, a new finding): an amount still to record ("dedh cup paani") opened its step with no call and no skip logged. The step now logs its call skipped, as the oven's call does. check-change's contract run is its before and after.
- **check-change** (`--base 48003532 --games baking --rows CK-100`, commit 1cac7a8), baking's 9 flows at 740x320 and 930x430:
  - Before (base): 11 contract breaks: contract-113 x4 (the face over the naan), contract-111, contract-53 x2, contract-78 x2, contract-119 x2.
  - After: 4 breaks, contract-53 x2 (the atto jar's hint light) and contract-119 x2 (the dish card's flash, SH-267, fix-kit's). Both were on base too, so nothing is new.
  - The "120 new findings" against the lint baseline are the same on base and after.
  - CK-100's probe: red on base, green after.
  - Pictures: `build/screenshots/tiers/change-1cac7a8962/before-after`. The judge's batch: `build/screenshots/evidence/tiers-green-1cac7a8962/judge/batch-01.md`.

## Built before the run, machine parts proven, eye parts to the judge

- **CK-137 (open, see the questions below):** red on d56dac1^: the steel tray under the settings cog at L1-L4 740x320, and contract-78 at L4 1280x665. Green on base. Still for the eye: the served cob as cooked on both trays, 'Shabash!' clear, the plated cob the same drawing, the cob's foot clear of the face, the card names.
- **CK-132:** see the flaws above; the faces and pills are for the eye. The judge couldn't see Nani's box in the grill frames, so the eye probe now captures the whole screen ("shot") in place of crop:#game. It needs a rerun for the judge.
- **CK-137 stays open** because of the judge's FAIL: "hakro makai" wraps at 740x320.
  - The cause is in the shared word card (`css/shared/word-card.css:115`): `.wc14-k` uses `text-wrap: balance` and never shrinks before it wraps.
  - The fix reaches chai's frozen item cards, so it's Zafar's call. The orchestrator agreed: no kit change in this run.
  - Its red check is CK-137 p4, `lines:#side .oc-it14 .wc14-k<=1` on corn L1-L4 at 740x320 (run `stove-ck137-wrap-base`).
- **CK-81, CK-102, CK-103:** eye sheets only. Their code says built (sekelo's well done, baking's shelf, corn's dressing picture).
- **Judge batches** (committed with their sheets):
  - CK-137 and CK-132: `build/screenshots/evidence/stove-corn-eggs-final/judge/batch-01.md` and `batch-02.md`.
  - CK-102, CK-81 and CK-103: `build/screenshots/evidence/stove-eye-final/judge/batch-01.md` and `batch-02.md`.
  - CK-100: from check-change, `build/screenshots/evidence/tiers-green-1cac7a8962/judge/batch-01.md`.

## Open and questions

- **Question for Zafar:** corn's six bowls give only one or two decoys at L3-L4, under the rules' 3 and 4. Exempt corn, or add bowls? Recommended: exempt it.
- **Eggs' decoy count against contract-37:** they disagree at L3-L4. It needs a look before any fix.
- **Rows that need files I don't own:**
  - CK-115 (corn's second card cut at 740x320): the side panel, fix-kit. Its check is written and red on base: at L3 and L4 the girl's card is cut at the panel's foot while Nana's open card fills the panel (run `stove-ck115-base`). It may be Zafar's call whether a scrolling panel may cut it.
  - CK-96 (baking's card row): `js/cook/ui.js`, fix-kit.
  - CK-97 ('adh paani' as a half-full bottle): needs art and fix-kit.
  - SEK-24 (the item card should show a skewer): needs art and fix-kit.
- **SEK-29 and CK-92** were not reached.
