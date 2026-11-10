# s19-stuck: the publish gate's stuck pages

Each page replayed on this branch at its size, then three rounds three pages at a time (the gate's load). Two causes are in files I don't own: their exact change is `/tmp/claude-0/-home-user-nani-jo-ghar/7c47c641-13d6-536e-84ac-3ab292df89d4/scratchpad/s19-stuck-shared-asks.patch` (a dozen lines; applied for the proof below, then reverted).

| page | cause (file:line) | game or driver | fix |
|---|---|---|---|
| cook:title 740x320 | the shop panel fills the height, so its "?" sits under the play area's cog (css/cook.css:818 `.gu-btn`, :100 the cog) | game | **ask**: css/cook.css, on a phone the overlay keeps clear of the cog's column (patch) |
| cook:fetch@L2 740, 930 | the player opened the cog menu for the "?" and left it open over the milk (build/sandbox/lib/cook-player.mjs:511) | driver | closes the menu again |
| cook:fetch@L2#mistake 740, 930, 1280; cook:fetch#mistake 1280; cook:fetch#returning 740 | a pass-me click after the game moved on: a quiet L2 wrong pick taken (js/cook/ui.js:1453, UX 11) or her 3 s ring run out (ui.js:1418) while screenshots slowed the player; it waited 10-30 s on a card that had gone (cook-player.mjs:529, :541, :553) | driver | re-reads the expectation when a click's moment has passed |
| mode:snap 1280 | the test hook said "#hi-back" while Nani answered a kept print, so the tap landed on the next row and sent the player back; then "Show" while Show was hidden (js/snap/flow.js:365, :336) | driver (hook) | waits while she answers; asks for one more frame |
| lab:cook/assemble@L4 740 | the shelf pill's tap zone sits half a zone up and left (Phaser adds a container's displayOrigin): its top is 4 px under the pot's centre, over it with some shelf orders, so the tap said "chana" (js/shared/shelf.js:418) | game | **ask**: js/shared/shelf.js, the zone from its top-left (patch) |
| lab:cook/samosa@L2 1280 | the disk filled | neither | none needed |

## What broke the six that ended on the live site

- cook:fetch@L2#mistake 740, 930: 2267ee0db (s19-lights phase 1): the pantry's first-time light no longer sits on Nani's pass-me card, so the wrong pick is taken at L2, as designed.
- cook:fetch#mistake 1280, cook:fetch#returning 740, mode:snap 1280, lab:cook/assemble@L4 740: no commit. Each ends on this branch played one at a time (as the live replay was); they stuck only under the gate's three-at-once load (snap, the pass-me) or a random shelf order (assemble).

## Proof

- Red first: cook:fetch@L2 740 on the old player: timed out after 281 s, as the gate.
- Runs s19-stuck-p1, -p2, -p3: all ten pages reached their end each time.
- With the patch applied: cook:title and assemble@L4 at 740x320 ended 3 of 3 (s19-stuck-asks1..3); reverted.
- No before or after folder: the brief names no row.
- checks (unit, words, static, specs): all ok; 767 unit tests pass.
- Contract (`s19-stuck-contract`, 4 sizes): 19 of 20 pages end; cook:title 740x320 stops on the shop's covered "?" (needs the CSS ask). Last line: "CONTRACT FAILED: 17 breaks (contract-109 4, contract-41 12, contract-89 1)". All 17 are in the gate's contract.md on the same pages before this work (the milk carton off the shelf line, Snap's own #intro pop-up, samosa's "Tar!" at 1920x1080): none from these changes.
- Folders: build/screenshots/sandbox/s19-stuck-{p1,p2,p3,asks1..3,contract}-*.

Open: the two asks above (cook:title stays stuck at 740x320 until the CSS lands; assemble@L4 ends 3 of 3 here but its fault stays until shelf.js changes).
