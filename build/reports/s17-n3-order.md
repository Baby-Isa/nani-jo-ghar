# s17-n3-order: a style tea's item card pops while it is ordered; each person says their own words

Builder report (Opus, 6 Nov night); not judged.

## Flaws and open points

- **CK-59 has no contract check yet.** `review.test.mjs` CONTRACT_ROWS fails on CK-59, SH-230 and SH-231, and did before this session. The check belongs in `build/sandbox/lib/contract.mjs`, which isn't mine. Request: every item card popped during the order has a say-start for its part.
- **CHAI-96's L1 4x250 strips are tool failures.** L1 has no style tea, so nothing moves.
- **The landing isn't logged.** Worked out from the hold and the flight, it is about 0.75 s after the headline starts (test speed 3), or about 2.2 s into a 4.3 s headline at a child's pace.

## What changed

- **CK-59** (`js/cook/words.js`): the said-again rule is per speaker (`line.by`, set by `ui.js` sayPart). One person never says a line twice within 10 s; another person always says their own. A line with no speaker named is judged as before.
- **CHAI-96** (`js/cook/ui.js`, the order read): a headline's own rows (the elchi or aadu row) now pop as item cards. The card opens first; at the headline's first word (`Lang.onSayStart`) the item card pops, is held (hold14) and flies into its slot; then milk as before. The sentence is unchanged.

## Proof

- Checks: unit 652 pass, 1 fail (above); every other check ok.
- After folder: `build/screenshots/brief/s17-n3-order/`.
- CK-59, L2: both people say "Muke chai khape," and "dudh,".
- CHAI-96, L3 1920x1080: headline say-start 13.34, aadu's pop-face 13.35, headline say-end 14.30, dudh's 14.35.
- Contract run: `CONTRACT PASSED: 0 breaks over 4 pages`.
