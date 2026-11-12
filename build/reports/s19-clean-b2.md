# s19-clean-b2: chai, eggs, baking, corn, chop, chaat, the pantry, round two (12 Nov)

Opus, high. Branch `s19-clean-b2` (integration 19f793256 merged), never pushed. Flaws first.

## Flaws
- **The test player misses chai's green under load.** After a move it is away 3 s or more (load 15-44); the next pan's green lasts 0.7-1.1 s.
  The pan boils over, empties and is refilled right. So chai L3 and L4 at 740x320 time out, and chai's wrong-order pop-up shows only when
  the wrong pan is a new player's first (its first-time hold). Tapping earlier (tried locally, reverted) did not help. **Owner s19-clean-a**
  (`cook-player.mjs`: the timing branch, the serve-wrong driver's wait after its wrong move).
- **Finding 2 for a coached child is not proven by a picture:** the returning-seed run poured the second half 0.6 s after the pan came back,
  before any light could show. New player: shown (below). CHAI-110 had **no before folder**.
- **An unasked seasoning or spice has no row to cross:** eggs (as chai) cross the person's first said row, so the pop-up can show pepper
  crossed when salt was the extra. For the shared pop-up (s19-clean-a): a row for the unasked thing.
- **Salt not put back** (finding 9): it was only ever "a little" salt; Zafar's 11 Nov line keeps cup measures only, and a cup of salt is no
  recipe. **For Zafar:** salt back as a baking step? I recommend no (it stays a decoy).
- **contract-94 (new, baking L3-L4, 4):** the quarter-cup moment's grey English card is set in Nunito, the shared card's rule; the check wants
  Lora. Owner s19-clean-a.
- **check-change not run** (about 6 h here).

## Findings (the review of s19-clean-b)
1. **Fixed.** `chai-tray.js`: "no light before a full glass's first tap" only at L4 (`halves`); below it every pour has its first-time light.
2. **Fixed (station part).** The full glass's second-tap light comes the first time a player pours a full glass's second half (the save's key
   `chai-tray:s14-ctl-pour-again`), coached or not; later rounds the stuck hint. Seats: s19-clean-a's line, merged.
6. **Fixed.** `fetch.js`: pass-me never picks a jar whose pill shows its word (the pill's ladder, `Cook.chipWord`).
7. **Fixed.** `fetch.js`: rows by zone, pitch per zone; the fridge no longer caps the shelves' pills.
8. **Fixed.** `baking.json`: every fill's lines at water's height above the jug's base.
9. **Fixed:** three quarters' word moment, and one for a quarter, one and a half and two and a half (nothing read `wordMoment.ids`; CK-72:
   "each a word moment"); one a round. Salt: above.
10. **Fixed.** `chop.js`: one clock for the hops and the round.
11. **Fixed.** `eggs.js`: the eggs' hold let go and settled before the first control's own; the first step named inside the try.
12. **Fixed.** `baking.js`: "it's ready" always said and shown.

## The orchestrator's lines (12 Nov)
- `chai-tray.js`: `leave` as given, and a left person's burner face kept gone (`refresh` brought it back: contract-118).
- `eggs.js`: plates through `Cook.Kit.serve().round`; `check` marks a wrong plate's rows (`UI.mission.serveWrong`). No redo (the pans are
  gone): the pop-up, then the end.
- **Pop-up frames** (`build/screenshots/sandbox/`): eggs L3 `ev-s19-clean-b2-wo/evidence/cook-eggs-l3-serve-wrong-{740x320,1280x665}-p-seen/`
  (contract-118 clean); chai L3 `s19-clean-b2-wo-chai3f/evidence/cook-chai-tray-l3-serve-wrong-{740x320,1280x665}-p-fresh/`; the redo, the
  right person gone: `s19-clean-b2-wo-chai3g/evidence/...-1280x665-p-fresh/`. Left: at 740x320 the pop-up face is 67 px (shared).

## Proof
- `checks.mjs` after the merge: all 13 ok (`checks: 13 steps in 565 s`).
- Contract, seven flows L1-L4, 740x320 and 1280x665, before the merge (`s19-clean-b2-after`): `CONTRACT FAILED: 267 breaks` (round one 255).
  54 of 56 ends (chai L3, L4 740x320: the player), 0 page errors. chai 24→23, eggs 30→35, baking 68→62, corn 32→30, chop 17→23, chaat
  43→49, pantry 41→45; 78 4→0, 115 27→16; up: 36 (check changed since), 111, 113 (s19-clean-a), 94 (above), 65 (machine).
- Four sizes, L1, after the merge (`s19-clean-b2-contract`): 28 of 28 ends, 0 page errors, `CONTRACT FAILED: 46 breaks (contract-83 1,
  contract-106 2, contract-119 8, contract-36 5, contract-114 5, contract-111 13, contract-11 1, contract-109 1, contract-53 1, contract-104 1,
  contract-117 2, contract-112 3, contract-92 2, contract-107 1)` (round one 68). 119 (the new L1 dish card), 111, 36, 106, 117, 112, 92, 107,
  109, 53, 104: s19-clean-a; 114 corn's cob: Zafar; 11, 83: one each, not looked into.
- Evidence after: `build/screenshots/brief/s19-clean-b2/CHAI-110/after/`.
- Child's pace, lab New player (`s19-clean-b2-child`): L4 nana full: no light at the first tap, the glass's light (`s14-control`) 0.9 s after
  the pan came back; ma half: the pour's first-time light; cousin full: none. L1: the child poured 2.2 s in, before the light (the shared
  stillness wait reaches 3 s): finding 1 rests on the code and L4's half.
