# s19-taps: the light stays until the right move; the item wins its taps (11 Nov)

Opus, high. Branch `s19-taps`, never pushed. Flaws first.

## Flaws and open
- Not finished: chai's frozen diff (stopped, a busy machine); check-change hit its 150 min limit in its rows step, the rest run by hand.
- Nani's stuck-help light still goes on any tap (CHAI-32, SH-60); only first-time lights stay.
- Games' breaks, red before and after: 36, 37, 109, 114, 115. New in check-change's play, load timing: 78 in eggs#hint (the light waits the order's landing, 912 ms not 432), 79 once in maani.
- Docs not mine: rows SH-261, SH-244; contract-117 and the new 111 in `checks-to-build.md`.

## What changed
- **SH-261** (`onboard.js`, `coach.js`, `stations.js`): no light hides or closes on a tap in its box; it steps aside only during the move (a drag or hold begun in it, a tap that reached a thing, a game's `began` in it), back 2 s later if its step is open and the kitchen still. The stuck box stays on any tap; a script's tap step counts only its thing; the coach's light steps back under pass-me.
- **SH-244** (`shelf.js`): the pill's tap area is its speaker alone; the item takes picture, slot, the pill's upper part and word.

## Proof
- Checks: driver `miss-light`, contract-117, contract-111 (edges, upper, word, speaker); `s19-taps.test.mjs`.
- 740x320: before (`s19-taps-before`) 117 red in chai, maani, pantry; 111 red in chai, eggs, maani, corn (pantry no pills). After (`s19-taps-after`) both green.
- Contract, four sizes (`s19-taps-contract`): 20 pages to their end, 0 page errors; `CONTRACT FAILED: 35 breaks (contract-37 8, contract-36 8, contract-114 7, contract-115 4, contract-109 8)`.
- `checks.mjs` all ok; leak cook ok; mount 21 fails, same on base files; loadcheck 27/32 as before.
- check-change (`build/screenshots/tiers/change-88aa118666/`): push, scope pass; play 116 breaks against base's 123; SH-244 rows 31/32 probes, `build/screenshots/brief/s19-taps/`.
