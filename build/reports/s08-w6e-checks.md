# s08 wave 6E: the contract checks' last mismatches and two card fixes

Builder: Sonnet, branch `worktree-agent-a2b425447e67be2df` (base ef9598eb). Not self-judged.

## What changed
- **CK-31**: the serve-wrong driver put in the first "wrong" it met, the tea leaves' second water (the game only wiggles), so the cup was right. It now waits for the sugar's step and puts in the salt, and its log says so (`cook-player.mjs`).
- **contract-35 / 36**: read the order's own level (order-level note, else `#side[data-level]`) and report it (`contract.mjs`, hook).
- **contract-21** skips taps the first-time help blocked (hook logs `input-blocked`). **contract-1** counts a request logged up to 1 s before its pop-up sample, and a pop-up the first tap closed.
- **SH-60 strip**: the frame where the help is logged gets a red frame (`strip-mark.mjs`).
- **SH-113**: clinic card's face circle is 44 px like Cook's (`order-card.css`). **Mishkaki L4**: two different mixes are said "hakri lakri mixed" each, the words the card writes (`order.js`).

## Proof
- Unit tests: 433 pass (new `contract-w6e.test.mjs`, 11 tests, red on the old code). `checks.mjs` unit, static, words, specs, docs: pass.
- CK-31 evidence run ev-20261020-015108-04q: wrong cup frowns, redo smiles; the log names the salt.
- Faces measured at 1366x768: Cook 44 in 48, clinic 44 in 48.
- Run w6e-green (1366x768): contract-30 mishkaki L4 gone; stir@L3 clean; no contract-1, 21 or 36 breaks.

## Open
- day3 contract-35 at L3: rows with maani, tameto, mirchi written (the game dots only words with a family voice; the check should skip the rest).
- day6 station 11 contract-35 at L1: cards folded after their rows ticked, rows sample missing.
- contract-3 (day6 pantry voice past stage end), contract-37 (mishkaki decoys) not mine.
- Not run: loadcheck, touched/regress (508 rows), shotdiff, full matrix: left to `/review`.
