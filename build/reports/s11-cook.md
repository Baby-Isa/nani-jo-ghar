# s11-cook: chai, easy to play and easy to learn (Sprint 11, B-cook)

Branch `worktree-agent-aaeebedd6450b84d6` (from `ccr-1888a520-dk18y7` at 0406967, the painted effects merged in), not pushed. Rapid-prototype proof (Zafar, 22 Oct). Not judged by me.

## What changed
1. **Kitchen conversation** before the order (`js/cook/ui.js` `kitchenTalk`, in `M.introduce`): `Conversations.maybe` CK1, else CK2, bubbles at the speaker's head. The module's own caps apply, and it models the answer when nobody answers. It doesn't play after the flow's own small talk, and not in a save's first story order. `conversations.js`, `word-card.js` and `speech.js` are loaded on demand (`UI.needShared`), because `cook.html` isn't mine.
2. **The order, item by item** (`introduceAlong`): no veil, and the face stays in view. The asker says each part in their bubble, and that item's word card shows big top left, then flies into its row (`WordCard.pop`). It still runs through `Lifecycle.request`: a tap lands everything at once. `OrderCard.rowEl` draws the `WordCard.row` when a node carries `word`; that row's styles live in `order-card.js`. Chai L1 now uses four item words: no extra, no kari/mori, one sugar or none (`data/cook.json`). Words are heard at the order, at the shelf (as before), and again at the pour (L1-L2; never twice within 10 s).
3. **Pans and pour:** the pans sit with `TOP.turn 0`, sized so handles clear. The tip frames are gone. The pour is coded: lift, turn the spout to the glass, squash along the tilt, chai slides to the spout, `NjgPour.stream` from the spout.
4. **No Done and no Next:** chai's ✓ is gone. At L4 a half cup moves on after a 2.6 s beat with no pour. `UI.go` uses `NjgButtons.moveOn`. At L1 the sugar stops at the asked number; such a capped count never credits the number word.
5. **Onboarding:** `Coach.rungs` uses `Onboard.stuck` and the chai script's `step`/`demo` entries. The real bottle, jar, knob or pan demonstrates the first time; the 5 s and 15 s rungs follow Nani's own step ids. The live target, the bulbs and the "?" stay tappable.
6. **Speaking:** a microphone by the ready pan's glass (`Speech.listen`); hearing "chai" pours it. **It never shows today:** there are no family single-word recordings of chai, paani or dudh to use as templates. The speech path is not unit-tested (I own no test file).
7. **Effects:** items settle with a squash and bounce. The painted splash, steam and sparkle are wired as asked; the shine is not used. Sounds are the shared synth `pop`/`right` plus Cook's pour loop. There are no CC0 files: the proxy refused kenney.nl and opengameart.org.

## Proof
- **Checks:** `checks.mjs` is green except one unit test. `artcheck.test` flags the coordinator's merged `assets/shared/fx-s11/*` ("faint alpha that shows dark on cream"); that is the art, not my code. Words, static, leak, bump, specs, docs, fixlist, recordings, size and load (29/29) are ok. Leak bot `leak.mjs cook`: ok.
- **Sandbox** `s11-cook-matrix` (9 Cook flows × 1366x768, 1480x924, 915x412): 27/27 reach their end, 0 contract breaks.
  - These findings remain: `canvas-text-small` on phone stations (these were already there), and 3 `word-broken` at 915x412 (the big card and the row in flight), fixed after the run in 74f05cb, not re-run at that size.
  - `tap-small`: the step-0 word card's 18 px English eye.
- **Shots** are in `build/screenshots/s11-cook/`:
  - `{1366x768,1480x924,915x412}-conversation`, `-order-word`, `-order-flying`, `-card-after-order`, `-pour-1..6` (strips: `pour-filmstrip-1366x768.png`, `pour-filmstrip-1480x924.png`), `-fx-splash`, `-fx-steam`, `-fx-sparkle`
  - `onboard/water-demo-filmstrip.png` and `onboard/pour-demo-filmstrip.png` (the demo, then the 5 s spotlight)
  - `onboard/land-filmstrip.png` (the squash is subtle)
  - `l4/1366x768-served-no-done.png`

## Open / for the orchestrator
- Mum needs to record chai, paani and dudh as single words for the microphone.
- The fx art fails `artcheck` (above).
- Old rows to recheck: CHAI-26 (the pour), CHAI-08, CHAI-19, CK-27 (the splash is back, painted).
