# s19-stuck: the publish gate's stuck pages

Each page was replayed on this branch at its size, then in three rounds of three pages at a time (the gate's load). Two causes sit in files I don't own. Their exact change is in `/tmp/claude-0/-home-user-nani-jo-ghar/7c47c641-13d6-536e-84ac-3ab292df89d4/scratchpad/s19-stuck-shared-asks.patch`. I applied it for the proof below, then reverted it.

| page | cause (file:line) | game or driver | fix |
|---|---|---|---|
| cook:title 740x320 | the shop panel is full height, so its "?" sits under the cog (css/cook.css:818, :100) | game | **ask**: css/cook.css, on a phone the overlay keeps clear of the cog's column |
| cook:fetch@L2 740, 930 | the player left the cog menu open over the milk (build/sandbox/lib/cook-player.mjs:511) | driver | closes the menu |
| cook:fetch@L2#mistake 740, 930, 1280; cook:fetch#mistake 1280; cook:fetch#returning 740 | the game moved on: Nani took a quiet L2 wrong pick (js/cook/ui.js:1453) or her 3 s ring ran out (:1418). The player kept waiting on the card that had gone (cook-player.mjs:529, :541, :553) | driver | reads the next expectation |
| mode:snap 1280 | the hook said "#hi-back" while Nani answered, so the tap reached the next row; it then said "Show" while Show was hidden (js/snap/flow.js:365, :336) | driver (hook) | waits; asks for one more frame |
| lab:cook/assemble@L4 740 | the pill's tap zone is offset by half a zone up and left (Phaser container displayOrigin). With some shelf orders it covers the pot's centre, and the tap said "chana" (js/shared/shelf.js:418) | game | **ask**: js/shared/shelf.js, the zone measured from its top-left |
| lab:cook/samosa@L2 1280 | the disk filled | neither | none |

## What broke the six that ended on live

- cook:fetch@L2#mistake 740, 930: 2267ee0db (s19-lights phase 1). The pantry's light no longer sits on the pass-me card, so the L2 wrong pick is taken, as designed.
- cook:fetch#mistake 1280, #returning 740, mode:snap 1280, assemble@L4 740: no commit. Each ends on this branch played one page at a time, as the live replay was. They stuck only under the gate's load, or with a random shelf order (assemble).

## Proof

- Red first: cook:fetch@L2 740 on the old player timed out after 281 s, as it did in the gate.
- s19-stuck-p1, -p2, -p3: all ten pages ended each time.
- With the patch: cook:title and assemble@L4 at 740x320 ended 3 of 3 (s19-stuck-asks1..3).
- No before or after folder: the brief names no row.
- Checks (unit, words, static, specs): ok, 767 tests pass.
- Contract run (s19-stuck-contract): 19 of 20 pages end. cook:title 740x320 waits on the CSS ask. "CONTRACT FAILED: 17 breaks (contract-109 4, contract-41 12, contract-89 1)". All 17 are on the gate's contract.md for the same pages, before this work.

Open: the two asks. Until they land, cook:title stays stuck at 740x320 and the assemble pill fault stays.
