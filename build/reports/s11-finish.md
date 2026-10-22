# s11-finish: the 5 s spotlight's shape, EASY-11's tap boxes, CHAI-31's frames

Branch `worktree-agent-afe716897a69a4e25` (from `ccr-1888a520-dk18y7` at adc9580), not pushed. Rapid-prototype proof (Zafar, 22 Oct). Pictures not judged by me.

## What changed

1. **Spotlight shape** (Zafar, 22 Oct: "Rounded box + soft round glow from the item itself").
   - `js/shared/onboard.js`: `Onboard.spot` keeps one rounded-rect hole per live control (hugging it, thin gold ring) and now adds a soft warm round glow from each control itself: `Onboard.glowShapes` grows the control's own box with the roundest corners (circle round a square thing, pill round a wide one), blurred in the page (`Onboard.GLOW` 26 px reach, `GLOW_SD` 6.5), drawn outside the holes only (the same mask), warm gold.
   - The glow is limited side by side: where another lit control or a neighbour to keep dark (`avoid`) lies within reach, that side's reach is half the gap less the hug pad (so 0 between two pills 4 px apart); the open sides keep the full glow. It never lights a neighbour, nor the gap between two lit controls. It stays at the resting spot while the item demonstrates (as the light does).
   - `js/clinic/heal/games/eye.js`: the live set is `[haaBtn, naBtn, mic]` (was `[judgeBox]` when the mic showed: one box round the group, the judge's fail). Each gets its own hole and glow.
   - Chai is untouched (one live control: it lights as before, plus the glow).
   - Docs: the rule is written, "the 5 s spotlight: a rounded box hugging each live control plus a soft round glow from the item itself (Zafar, 22 Oct)", in `docs/archive/regressions-done.md` (CLN-72, marked superseded for the 5 s rung), `docs/game-design/easy-to-play.md` (the rungs; `docs/design-language/ux-principles.md` is at its word limit and held no spotlight-shape wording, so it is unchanged). No "F17" wording sat in `docs/design-language/` (grep: none); the F17 in `docs/process/qa-checklist.md` (CMP-10) and `docs/architecture/target-model.md` is the focus pulse, a different rule, left alone.
   - Unit test: `build/test_shared_word_card.mjs` (glow: full on open sides, 0 facing sides, never reaches a neighbour or an avoid box).
2. **EASY-11** `build/check_word_card_taps.mjs` (browser check, stand-alone under the lock; not in checks.mjs's unit list because it needs the browser): measures every `.wc-reveal` on `lab/word-card.html` at 1366x768 and 915x412, asserts each box is at least 44 x 44 and its centre takes its own tap, and notes (does not fail) an edge probe covered by a neighbour. **No CSS change was needed** (see Proof for sizes).
3. **CHAI-31 frames** `build/tools/review/shoot_chai_frames.mjs` plays `cook chai-tray` L1 with the sandbox's fair player and a watcher that freezes Phaser's tweens inside the first pour (the pour phase's middle, and 94% of it) and shoots the kitchen conversation bubble and the all-served frame. **Nothing in Cook was changed.**

## Proof
- `checks.mjs`: unit 514/0 (docs limit test fixed: ux-principles is at its limit, my line removed from it), words, static (0 new), leak 19, bump, specs, docs, fixlist, recordings, size, load 29/29: green.
- Sandbox `clinic:heal-eye` at 1366x768 with `--contract`: end reached, 0 breaks, 0 findings, 0 page errors (run `s11-finish-eye`).
- Unit `build/test_shared_word_card.mjs`: 10 pass (the glow test is new).
- Shots, `build/screenshots/s11-finish/` (not in git):
  - spotlight: `spot-chai-1366x768.png`, `spot-chai-915x412.png`, `spot-eye-1366x768.png`, `spot-eye-915x412.png` (eye: ha, na and mic, each its own hole; glow outward at the top, bottom and ends, none in the 4 px gaps).
  - chai: `chai-pour-mid-1366x768.png`, `chai-pour-near-end-1366x768.png`, `chai-pour-mid-915x412.png`, `chai-pour-near-end-915x412.png`, `chai-bubble-915x412.png`, `chai-bubble-1366x768.png`, `chai-all-served-1366x768.png`, `chai-all-served-915x412.png`.
- EASY-11 measured (`node build/check_word_card_taps.mjs`, 24 buttons, 0 under 44): text-slot eyes (English slot) 44 x 44 (drawn circle 18.1), the Kutchi slot's 44 x 44 (drawn 24 / 20.4), picture slot 48 x 48 on the card and 44 x 44 on a row (drawn 48 / 36), at both sizes. Note: the Kutchi slot's 44 px eye overlaps the English slot's by a few px (a 44 px button on a line shorter than that); the look is kept, a tap in that strip goes to the upper-most one (both are free reveals).
- Pour colour (pixel read at 1366x768, near the end): pan tea (135,40,2) and stream (127,40,3) match; the glass reads (203,56,1)/(173,42,1) lit through glass, same hue (about 16 degrees). Not a mismatch I can see; the judge decides.
- Bubble at 915x412 (settled): box top 3.5, bottom 92.7, left 380.7, right 736.9 in a 915x412 window: wholly on screen, not clipped; the top margin is under the 8 px the fit meant (3.5, not 8). Left alone (the brief: fix only if clipped).
- All-served: in two early runs the guide box still read "Cook it the way they said." for up to about 2.7 s after the last pour before it emptied; in the later runs it was empty at once. Shot is of the emptied box. Worth a look by the judge (a short lag, not stuck).

## Open
- Glow strength is a taste call (opacity 0.9 of a warm gold, 26 px reach, blurred): one number each (`Onboard.GLOW`, the fill in `Onboard.spot`) if Zafar wants it stronger or softer.
