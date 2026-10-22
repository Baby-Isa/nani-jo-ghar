# s11-clinic: the flash-card eye test and toothbrushing

The work is on branch `worktree-agent-a6c732f0cd12d46ef`, built from `ccr-1888a520-dk18y7` at 0406967 with the s11 art (3d63723) merged in. It is not pushed. I used rapid-prototype proof (Zafar, 22 Oct).

## What changed
- **Eye test** (`eye.js`): the chart is gone (ROWS, drawChart, versions A/B).
  - The doctor (s11 art) holds up one big `WordCard.card` in his card's face.
  - She says her guess every 1.5 s. The child taps big ha or na, or uses the mic (`Speech.listen`, with the family's ha/na clips as templates).
  - There is one demo card (she is right, unscored), then 4 judged cards.
  - A wrong answer turns the pill red, shakes the card, and the doctor names the card. A misread still brings the redrop (CLN-62).
  - Cards move on by `NjgButtons.moveOn`.
  - Past support (stage 3 and up), the card's strip (its text, English and speaker) is held back until the card is judged, and her bubble shows dots only (rule 6).
  - The drops are kept. They now close by themselves at the count at every level. The old "to the eye test" button is gone because it auto-pressed. The counts are skill rows.
- **Toothbrushing** (`tooth.js`):
  - A plus-shaped track, channels only, that snaps back at the end.
  - Shine-spot targets with dirt drawn in code.
  - A direction `WordCard` per move: an arrow and the engine's word. It sits in the corner of the cross that fits.
  - A wrong way gives a gentle bump back and the patient says the move again.
  - The order row counts as right only if every move was right on the first try.
  - The new straight brush (s11 art) is used.
  - Drill and fill are unchanged.
- **Onboarding**: both games use `Onboard.stuck` with the real item (the ha pill; the brush touring the cross, never the answer), plus the ghost hand. The rungs count from when the step opens (`NaniGuide.poke`).
- `scene.js`: added `HS.wordCardKit()` (loads the shared card), `HS.stageOf` and `HS.recorded`.

## Decisions for Zafar (recommend yes)
1. Left and right on the cross are the screen's directions, as the arrows point. Before, they were the patient's own, mirrored.
2. Dirt shows only on the order's sides at L1-2 **while those words are supported**. A child who knows the words sees all four sides dirty, so it passes rule 6. The leak bot's new `dirt-reader` stays under 10% on a learned save. On a new save it wins 50% at L1, which counts as study.
3. The brush handle lies at 45° so it never covers a target. CLN-180 said the brush lies level.
4. Ha/na is wrong half the time, so a blind player wins 6.25%. At 9.15% (wrongP 0.45), the checks' 500 rounds would sit too close to the 10% limit.
5. The s11 open mouth is **not used**. It is a cartoon framed wide, so it doesn't match the measured teeth or the registered photo brushing mouth. The old picture and its glint patch stay.

## Word gaps (to record; nothing invented)
- up (mathe), down (niche), right (jamno), brush: these show as grey placeholders.
- Eye cards use only words the family recorded alone: limu, dungri, tameto, mirchi.
- chai, dudh, paani and khun have no single-word family clip (only cook-tts). dudh, paani, bataato, lasan and aadu join by themselves once recorded.
- The family clip is "bateto" but the engine spells it "bataato" (spelling check for Zafar).
- chai's icon reads green to the colour check.

## Proof
- `checks.mjs`: unit 512/0, words, static (0 new), leak (19), bump, specs, docs, fixlist, recordings and size are green. Load: clinic:morning, eye and tooth pass.
- Leak: eye and tooth pass on the learned save, at --rounds 500 and 1000.
- Sandbox, with `--contract`, at 1366x768, 1480x924 and 915x412:
  - `s11-clinic-matrix` (before the art): all 12 pages of the four flows reach their end, with 0 breaks.
  - `s11-clinic-matrix2` (after the art): all 12 pages end. It found 2 contract-11 breaks: the doctor's picture was drawn from its 1x file.
  - Fixed: the picture now always uses its @2x (`art.doctorCard.always2x`). In `s11-clinic-matrix3`, heal-eye and heal-tooth reach their end at all three sizes with 0 breaks.
  - The eye frames below were shot before that fix, so they show the 1x picture. The layout is the same.
- Frames, not judged by me, in `build/screenshots/s11-clinic/`:
  - eye: `eye-{1366x768,1480x924,915x412}-card1.png`, `-wrong.png`, `eye-learned-1366x768-card1.png`, `eye-firsttime-1366x768-demo-0{1..3}.png`
  - tooth: `tooth-filmstrip-{1366x768,1480x924}.png` (cross, wrong way and bump, pull to the end, snap back), `tooth-915x412-0{1,2}-*.png`, `tooth-firsttime-filmstrip-1366x768.png` (the brush tours the cross; the 5 s spotlight)

## Not mine / open
- `build/check_onboard.mjs` should learn `Onboard.stuck`. The card and brush steps keep `S.cue(kind, {watch})` only to name the step.
- `build/test_clinic_r5.mjs` D10 already fails on 0406967 (eye L2 rows say a side). It is not in checks.
- The drops' L2 line "Left akh, chando trae" mixes English and Kutchi (rule 11). That comes from the engine and is not mine to fix.

## Fix round 1 (the judge: BRUSH-01 FAIL, EYE-01 and EASY-09 evidence)
- BRUSH-01: the direction card is placed only in a corner clear of the cross and its targets (measured on the cross's arms after the push-in lands: during it the stage is scaled, which put the "right" card over the left target at 915x412), shrinking to fit or turning into the shared word row; it fades in in place (no slide). `debug.dirClear()` reports any overlap (none in the reshoots). The 915x412 frames are at L2: from L3 the side card is closed by rule (CLN-114, contract-9), which is why it listed no steps.
- EYE-01: the frames are taken 160 ms after a wrong pill (red pill, the card mid-shake, the doctor naming it: the card's speaker stays lit until the next card).
- EASY-09: the demo's ghost hand rides the pill's lower right corner, clear of its word; frames of the 5 s spotlight on both games. (The spotlight's soft ellipse round the pills also reaches the card's bottom edge: the shared hole's shape, js/shared, as EASY-08.)
- Checks: words, static, leak green; unit 1 fail: the art check on `assets/shared/fx-s11/*` (the merged effects sheet, not mine). Sandbox `s11-clinic-fix1`: heal-eye and heal-tooth end at the three sizes, 0 contract breaks.
- Frames: `build/screenshots/s11-clinic/fix1/` (`tooth-915x412-01-cross.png`, `tooth-915x412-02-wrong.png`, `tooth-1366x768-01-cross.png`, `tooth-1366x768-02-wrong.png`, `eye-{1366x768,1480x924,915x412}-wrong.png`, `eye-learned-{1480x924,915x412}-card1.png`, `eye-rungs-1366x768-at-600.png` (demo), `-at-5600.png` (5 s spotlight), `tooth-rungs-1366x768-at-2000.png` (demo), `-at-6900.png` (5 s spotlight)).
