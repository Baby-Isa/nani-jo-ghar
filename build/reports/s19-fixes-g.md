# s19-fixes-g: the kitchen games on the new screen checks (11 Nov)

Opus, high; never pushed.

## Flaws and open
- **Design conflicts, Zafar's call:**

| Game | What the check wants | Why code alone can't |
|---|---|---|
| maani | board 210 → tawa 172 → plate 99 px within 15% | a tawa-sized maani needs a tawa-sized plate: no room on the band |
| corn, sekelo | grill 70% of the room (115: 56%, 54%) | a bigger grill makes the rim-to-rim cob or skewer bigger still against band, tray and plate (114) |
| samosa | folded samosa 330 px on the board → 66 on the plate | the board is a close-up |
| corn, sekelo, samosa, chaat, baking | one decoy at L1 (37) | his six corn bowls, sekelo's every bowl; samosa reads "bataata" (lexicon), baking's order card shows one row |

- **Not my files:**
  - 116 (29): the shared card's lone card and padding (`css/shared/order-card.css`, `js/shared/word-card.js`).
  - `S.fly` (`js/cook/stations.js`) and sekelo's rack move tween a counter or the container, read as no tween (sekelo's 114 snaps): tween the object itself.
  - Screens rebuild in one frame (sekelo's rack, samosa's plate).
- **Mine, next round:**
  - samosa 78: the lift, called at every level now, gets its first light late.
  - baking 36 (4): the oven steps.
  - maani 36: the light waits up to 1.5 s for a still stage, past 36's 1 s window.
- **Recording gaps** (`docs/language/recording-sheet.md`): baking's v.open and naan put-in, corn's v.serve.
- **Check faults:** sekelo 105; chaat 112 (a busy machine).
- **Not done:** CK-81's served skewer (art: the tray's painted slot); CK-85's praise zoom (shared serve).

## Before → after (four sizes, every end reached, 0 page errors)
| check | chai | eggs | chop | corn | daar | maani | sekelo | samosa | chaat | baking |
|---|---|---|---|---|---|---|---|---|---|---|
| 36 |  |  |  | 4→0 |  | 0→1 | 1→0 | 3→0 |  | 11→4 |
| 37 |  |  |  | 4→4 |  |  | 4→4 | 4→4 | 4→4 | 4→4 |
| 70 |  | 4→0 |  |  |  | 3→0 |  | 4→0 |  |  |
| 77 |  | 4→0 |  | 1→0 |  |  |  |  |  |  |
| 78 |  |  |  |  |  | 4→0 |  | 4→6 |  |  |
| 111 |  |  |  |  |  |  |  | 2→0 |  | 6→0 |
| 114 |  |  | 9→0 | 7→6 | 11→2 | 16→16 | 16→16 | 16→16 | 10→0 | 4→0 |
| 115 |  |  |  | 4→4 |  |  | 4→4 | 4→4 | 1→1 | 8→8 |
| 116 |  | 5→5 | 4→4 | 1→1 | 3→2 | 1→1 | 6→6 | 1→1 | 5→5 | 4→4 |
| other |  | 0→1 |  | 3→0 |  | 1→0 | 3→2 | 3→1 | 1→1 | 6→0 |
| **all** | 0→0 | 13→6 | 13→4 | 24→15 | 14→4 | 25→18 | 34→32 | 41→32 | 21→11 | 43→20 |

## What changed
- **Chop's hop and strip** (chop, daar, chaat): a thing grows at most 12% up; a refill fades in.
- **Sizes:** sekelo's piece flies to the skewer's tip; samosa's spoon and plate glide, its fried picture keeps its width; the naan stays within 15% in the oven.
- **Calls:** a staged first light holds its control's call (`Coach.lightWait`). Every timed window is called; eggs and corn hold the first time; baking's oven and corn's serve are called. Chaat lights every layer the first time (CK-85). Nothing removed.
- **Ask:** the card's fallback is the walnut shelf picture.

## Proof
- Contract: before `build/screenshots/sandbox/s19-fixes-g-before/`, after `s19-fixes-g-after/`: `CONTRACT FAILED: 142 breaks` (228 before).
- Rows: before played before any code change (none at launch); after: `build/screenshots/brief/s19-fixes-g/` (br-s19-fixes-g-after-20261111-093054-cv6).
- checks.mjs: ok but 3 art-block tests (sparse sources/).
- check-change (`build/screenshots/tiers/change-55faee73f6/logs/`): my 45 min cap; push fail (those tests), scope fail (an integration file), play 39 of 248 pages, ends reached, 0 errors.
