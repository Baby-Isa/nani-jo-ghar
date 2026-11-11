# s19-shared-checks: the shared code's check breaks and the checks' own faults (11 Nov)

Opus, high. Branch `s19-shared-checks`, never pushed. Flaws first.

## Flaws and open
- **Left, not shared** (games' code, with owners): 114 sekelo (thread's pieces jump to the skewer's tip; sizes on the tray), samosa
  (the filling heap -33%; the fry sizes its callers ask of `S.fly`; the fold's leave from the close-up, untweened), maani (the dough
  ball +28% onto the board): s19-games-1. 115 sekelo's grill (Zafar's choice), samosa's heap: s19-games-1. 37 eggs at L1, no decoy:
  s19-games-2; sekelo 3-4 at L1: s19-games-1.
- **The egg browning (112)** was caught by no run of mine (only a page's first lights keep pictures): proven on chai's real light, its
  record changed so the lit thing had another picture at the same place; at another place it still fails.
- **116 after a tick or as the order lands** (chai 1280x665, chaat 1920x1080: the row moves on 1.3-1.6 s later; the check waited 1 s):
  judged a check fault. If Zafar wants it sooner, it is `OC.settle14`'s.
- **A doc I don't own**, `docs/design-language/guide-and-card.md` line 10, after "pictures 21% taller at 1280 and 1920.": "A row with
  one card gives it the whole row: chai's card inside, the picture's frame the row's width at chai's height, its foot its padding
  (s19-shared-checks, contract-116)."

## What changed
- **Order card** (`css/shared/order-card.css`): a lone item card fills its row with chai's card inside (picture at chai's height in
  a frame the row's width; words, divider, speaker and gaps at chai's sizes; foot = padding). Chai's card unchanged.
- **`S.fly`** (`js/cook/stations.js`): tweens the thing itself, not a counter; a killed tween still lands and resolves.
- **Checks:** 105 judges a light round a group of pictures (sekelo's skewer on the rack) by the group. 112 passes the knife moving along
  chop's swipe path, and a thing changing its picture in place. 37 counts by `data/rules.json` levels per station (a station's own row
  first; chop L1 none; chaat's chop is chop's), matching the engine's forms (ba bataata), words of parts (fudino ji chutney), a grey
  English word, the card's word id. 114 names Zafar's accepted sizes with his words (passing only when the change is tweened on the
  picture), lets a flight land where its speed takes it, reads the camera's fade. 115 names them as 114's. 116 takes the card's foot as
  its padding or the 6 Nov gap g, judges the row once the order is in and once it has moved on after a tick.

## Before and after (six flows, 740x320 and 1280x665)
Before: the base game and checks (`s19-shared-checks-before`; its last eight pages replayed on the base tree). After: this branch.

| check | before | after | what moved |
|---|---|---|---|
| 116 | 9 | 0 | lone cards (code); foot, tick, ordering (check) |
| 105 | 2 | 0 | sekelo's skewer group |
| 114 | 22 | 17 | shared part 0: no `S.fly` snap (maani's board to tawa, samosa's fry); samosa's plate through the camera's fade |
| 37 | 6 | 4 | chaat's chutney, samosa's bataata, chaat's chop right; eggs, sekelo real |
| 115 | 4 | 4 | the games' |

## Proof
- Contract, four sizes: `build/screenshots/sandbox/s19-shared-checks-contract/`, 24 pages to their end, 0 page errors;
  `CONTRACT FAILED: 148 breaks (contract-36 34, contract-70 7, contract-106 13, contract-24 4, contract-102 9, contract-37 8,
  contract-107 9, contract-112 4, contract-91 4, contract-114 35, contract-115 7, contract-79 1, contract-109 1, contract-53 2,
  contract-78 2, contract-111 6, contract-104 1, contract-18 1)`: no 116 or 105; no 114 snap; the rest the games'.
- Each fault red before and green after: `build/sandbox/shared-checks.test.mjs` (8, from the before run's numbers; chaat's real swipe
  light in `build/sandbox/fixtures/false-breaks/`); `badruns.test.mjs` 30 pass: every check still red on its bad runs.
- Evidence: the brief names no row, so no before or after folder.
- `checks.mjs`: ok but unit (3 art-block tests needing `sources/art`, failing at the base too) and leak (clinic timed out, busy machine).
- check-change (`build/screenshots/tiers/change-afd38f08e6/logs/`): stopped by me after 50 min of a 158-page play (shared files reach
  every game): push fail (the 3 art-block tests), scope fail (an integration-branch `sources/art` file), play 16 pages to their end,
  0 page errors.
- loadcheck: 27/32; the 5 fails are served dishes and pantry pictures outside the manifests (`data/cook.json`, s19-serve2's), no file
  of mine.
