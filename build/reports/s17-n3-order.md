# s17-n3-order: a style tea's item card pops while it is ordered; each person says their own words

Builder report (Opus, 6 Nov night). Not judged: the orchestrator sends the before|after batch to the judge.

## Flaws and open points first

- **CK-59 has no contract check yet.** `review.test.mjs` (CONTRACT_ROWS) fails on CK-59, SH-230 and SH-231. They are the 6 Nov rows saying "contract check", and that failure was there before this session. The check would live in `build/sandbox/lib/contract.mjs`, which this session doesn't own. Request: every item card popped while the order is given has a say-start for its part.
- **CHAI-96's L1 4x250 strip is a tool failure, not a fault.** It ran at L1, where no tea has an extra, so `#mission` doesn't change over 4 frames.
- **The landing isn't logged.** It is worked out from the hold and the flight: at test speed 3 the card lands about 0.75 s after the headline starts; at a child's pace, about 2.2 s into a 4.3 s headline.

## What changed

- **CK-59** (`js/cook/words.js`): the said-again rule is kept per speaker. Each line can name who says it (`line.by`), and `ui.js` sayPart names the person at the counter. One person never says a line twice within 10 s; another person always says their own. A line with no speaker named is judged against everyone, as before.
- **CHAI-96** (`js/cook/ui.js`, the order read): the rows a headline says for itself pop as their item cards, for example the elchi or aadu row in "Muke elchi waari chai khape". The person's card opens first. At the headline's first word (`Lang.onSayStart`) the card pops, is held (hold14) and flies into its slot while the headline goes on; then milk follows as before. The sentence is unchanged. Water and tea leaves never pop.

## Proof

- Checks: unit 652 pass, 1 fail (CONTRACT_ROWS, above); words, static, leak, bump, specs, docs, fixlist, recordings, art, size and load all ok.
- After folder: `build/screenshots/brief/s17-n3-order/` (run br-s17-n3-order-after-20261106-220427-ia8).
- After timings (test speed 3):
  - CK-59 at L2: both people say "Muke chai khape," and "dudh," (for example at 740x320, dudh at 10.01 and 12.76).
  - CHAI-96 at L3, 1920x1080: the aadu headline's say-start at 13.34, aadu's pop-face at 13.35, the headline's say-end at 14.30, dudh's pop-face and say-start at 14.35.
- Contract run (cook:chai-tray, four sizes): `CONTRACT PASSED: 0 breaks over 4 pages`.
