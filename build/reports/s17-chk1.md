# s17-chk1: chai's contract checks keyed by a per-game data list

Sprint 17, 7 Nov 2026. Builder s17-chk1 (Opus, high). Lighter checks (Zafar, 7 Nov, decision 3): no before/after evidence, no judge.

## What changed

- **New: `build/sandbox/data/games.json`**, the per-game data list. One entry per game: chai (full), the pantry (fetch), daar,
  chaat, samosa, sekelo (mishkaki), and maani, chop, eggs, baking, the corn stall with their stations only (a field left out is
  "not yet"). Its `_about` and `_fields` say its shape; `stages` holds contract-91's stage kinds; `hosts` holds the clinic.
- **What moved into it** (no game name left in these checks):
  - contract-70 (slow-at-green): chai's notes `chai-slow`/`chai-down`, the line "Slow kar", late 0.06.
  - contract-71 (once-each): the `chai-add` note, milk/water/tea.
  - contract-90 (card-light): the `chai-add` note, the tea as the first item, chai-tray on the `cook:` route only.
  - CONTROL_CALLS (contract-78): chai-tray's "chulo bar", "slow kar" (rebuilt in place from the list).
  - CHAI_ROW (contract-35), S14_TAPS (contract-44), DECOY_STATIONS and DECOY_AT_LEAST (contract-37): station sets read
    live from the list (each keeps `.test(station)`).
  - contract-91's help stages: from `stages`, the kinds a listed entry's `help` names (stage keys don't name the game, so
    every Cook station is still judged).
- `lib/contract-chai.mjs` loads the list (`GAMES`, `setGames` for tests, `gamesFor`, `flowParts`, `stationSet`);
  `lib/contract-s14.mjs` re-exports CONTROL_CALLS from it; `lib/contract.mjs` imports the sets. S17_CHECKS and checkS17 untouched.
- One small difference: a made-up flow like `cook:chai-foo` used to match the old chai pattern; now only the listed stations do.

## How a game joins

Add or fill its entry in `games.json`: `stations`, then each check's field (`slowAtGreen`, `onceEach`, `cardLight`,
`controlCalls`, `s14Taps`, `decoys`, `cardWritten`, `help`). A field can carry its own `stations` and `routes` to cover less
than the whole game. It is checked from that run on.

## Proof

- Unit tests: `node --test build/sandbox/*.test.mjs`: 170 pass, 0 fail. New: today's stations match the old patterns
  station by station; a fake game added to the list is judged by 70, 71, 90 (contract-chai.test.mjs) and 78, 37
  (contract-s14.test.mjs), and not before it is listed.
- Contract run (1280x665, cook:chai-tray and @L4, under the shared lock): `CONTRACT PASSED: 0 breaks over 2 pages`.
  The frozen run (frozen-chai-20261107): 1 break over 44 pages, contract-11 at L4 1920x1080 only, so 0 at 1280x665.
  Same.
- Checks (`checks.mjs`, without `load`: the only browser run allowed was the contract run): unit 92 files, 664 pass, 0 fail;
  words, static, bump, specs, docs, fixlist, recordings, art, size ok. **leak FAIL**: `snap: g1 level 1: oracle 100.0%`.
  That's the snap game's leak bot, which reads none of these files (game code, not the sandbox): it was already failing,
  not caused here.

## Unfinished

- `build/sandbox/README.md` isn't mine to edit; the shape is in the file's own header. A README line can point to it later.
