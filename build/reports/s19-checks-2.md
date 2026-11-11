# s19-checks-2: snaps, sizes, padding and no opt-ins, from the screen (11 Nov)

Opus, high. Branch `s19-checks-2`, never pushed. Flaws first.

## Flaws and open
- **HEAD faults for s19-fixes-f** (the table's last column): sizes jump (maani, corn, eggs), corn's small grill, one-item cards two
  thirds blank, no first-time hold or green call in eggs and corn, 5 corn decoys at L1, "Firai!" missing on maani's second bread.
- **Chai at speed 1:** "Slow kar!" queued at the green, never said in 2.3 s (the old check read the queued note).
- **Art debt:** 8 cuts keep a pink rim (known list).
- 72, 73, 74 have no real bad run left in this clone: red on fixtures of the old faults, green on chai.
- Not my files, so retired in the audit only: `build/test_*.py`, `build/check_onboard.mjs`; `tiers.json` still names lightfollow.

## What each check now measures

| Check | Measures (from) | Its bad runs (fixtures, tag s19c2) | Catches on HEAD |
|---|---|---|---|
| 114 no-snap (new) | each picture's drawn size frame by frame (s19it): a jump over 15% with no 150 ms tween; a swap in one frame; rests at two places within 15% | HEAD maani, corn, eggs; 3c48 corn (cob -60% on the tray, +131% on the plate) | maani, corn, eggs |
| 115 item-size (new) | the main thing 70% of the room above the band; each shelf item at chai's height for its size class, 10% | 3c48 eggs bowl 84% of chai's M (CK-77); corn's grill | corn |
| 116 card-pad (new) | the side card's paddings and gaps (scaled 2 px), the current card whole, cards filling 2/3 of the row | HEAD corn, eggs, maani one-item cards | corn, eggs, maani |
| 72 row-glide | the row's scroll frame by frame: more than a card in one frame, or 2.5 cards a glide | old shapes (unit) | none |
| 73 bubble-speaker | the speaker's own box: a line's speaker in a bubble (SH-153 as replaced 1 Nov), a conversation speaker under 48 px | old shapes (unit) | none |
| 74 order-skip | after a tap mid-order: big card, flyers, waiting cards on screen at 1 s; the station starting | old shapes (unit) | none |
| 80 no-jump | every Cook page and view, cook.html too | CHAI-45's own (unit) | none |
| 36 step-call | steps from the screen: each new lit thing, each new current card | 3c48 eggs | corn, maani |
| 37 decoys | the shelf's things the order card does not ask for | HEAD corn | corn (5 at L1) |
| 70 slow-at-green | every heat ring entering its green and a voiced call | HEAD eggs, corn | chai, eggs, corn |
| 71 once-each | Cook's tick path: an add no row wants, a row past its need | unit | none |
| 77 timed-hold | a new player's first ring holds mid-green until the tap | HEAD eggs | eggs |
| 96 boil-reopen | a ring past its green that empties by itself; the card reopens | unit | none |
| 109 shelf-line | one or two items too: chai's lines, a lone item over its pill | unit | none |
| art rim | a cut's soft edge over 15% magenta where the piece is not | `bataato` at 02b28a678 | 8 known |

`games.json` holds no check field. 90 keeps chai's design (G6 takes the rest).

## G0: retired, and why

| What | Why |
|---|---|
| contract-34's go-on arrow half | quiet since SH-238; contract-103 judges Cook (code kept) |
| contract-52's side-panel half | contract-86 judges it with its room rule |
| lightfollow (the audit) | contract-87 and -112 judge the light (reads judge, never "no step") |
| shotdiff (the skeleton) | no approved run since Sprint 8 |
| test_cook.py, test_clinic.py | run once: cook fails at its first click, clinic times out at waiting-W1-L1; the sandbox players are their ports |
| check_onboard.mjs | runs nowhere, 39 prototype phases fail; contract-112 replaces it |

contract-95's test existed; the contract-11 line is corrected.

## Proof
- `s19-checks-2-contract`: 16 pages ended; `chai 95/98, eggs 93/98, maani 93/98, corn 93/98`; `CONTRACT FAILED: 81 breaks` (72 with the final code; chai 0), the HEAD faults, plus eggs' two contract-112 lights.
- `badruns.test.mjs`: 30 pass; fixtures 15 MB.
- Eggs' unjudged five lack samples, not fields.
- Rim: red on `build/tools/art/data/rim-fixtures/bataato-02b28a678.webp`, green on HEAD's.
- `checks.mjs`: ok but 3 art-block unit tests, failing at the base too (sparse sources/art).
- check-change: CHANGE_LINE
- Evidence: no rows in the brief, so no before or after folder.
- check-change: stopped by me after 25 min, before any result file; its steps had failed already: push (the 3 art-block tests), scope (a `sources/art` file the integration branch differs from main by). Its play would add breaks the base lacks: the HEAD faults these checks exist to catch.
