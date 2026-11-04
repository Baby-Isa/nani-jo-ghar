# Sprint 17: Zafar's chai play of 3 Nov evening, built and checked for his replay (3-4 Nov, night)

Branch `claude/admiring-ptolemy-77fuv5`. All in the chat (Opus, high), the judge on Fable. His notes and the rows:
`docs/feedback/chai-play-2026-11-03.md` (17 points: 12 new rows, 5 reopened; a second reader's 13 points applied).

## What was built
- **The word moment (CHAI-67, -70 to -74):** only before the first round that asks both half and full (chai L4's first; was every
  first round, L1 included, because it read the order card's fixed slots); half the speed, each card held twice as long, the pair 2.4 s;
  its cards' English shown; the iris gone (the corners, the frame's own flash, a shutter's sound: `js/shared/sfx.js` shutter); on the
  kitchen counter from pack s17-wm (his run): one glass in twelve stages in one place, half the 6th, full the 11th, also adh and
  aako's item cards; baking's jug cut the same way for Sprint 18.
- **The order card, every game:** the next card always whole after a tick (SH-199); the cards' pictures the shelf's own (SH-200: the
  ginger, garlic, cardamom and salt jars were older pictures); every person's clips fetched as the order starts (SH-201: the silent
  first word, best reading); a "no" card's blur kept (SH-202); the big card's flight the least bowed curve clear of faces and bubbles,
  never a corner (SH-203); the pop-up in its row card's shape so one even scale lands it (SH-163), its own shape where that fits nowhere
  clear of a face.
- **Chai:** Nani's face the cards' size in the side panel, her box shorter (SH-189); the reveal lesson's box a thin strip and the tap
  shown once with a click (SH-196); the next pan lit 0.3 s after the pour (CHAI-68) and as the stuck hint after the level's wait, at
  once after a wrong jar (CHAI-75); the reveal dots' tap area above the speaker on phones.

## The checks
- **The sandbox contract run on chai** (every level and path, the four sizes): found 15 breaks from these changes on the first run; all
  fixed over six rounds (contract-39 given his new rule for the word moment's English; the pop-up's fallback; the order card's light:
  one waiter, a 3 s limit, items only, a coming row glide counted; picking a pan its own step; Nani's card cleared before a control's
  call; lightpix measuring inside a round light). See the final run's line below.
- **The screen check** learned a designed scroller (the s14 order row and the order list: their bar hidden): no scroll-container
  finding, and a word scrolled past the row's edge is out of view, not clipped; the 402 "new findings" were all that.
- `checks.mjs` green; the side panel 36/36; the art check clean; labcheck chai L1-L4 clean.

## The full checks, 4 Nov early morning (everything found was fixed)
- **The final chai run `s17-final2`:** 0 contract breaks over 44 pages; the route `s17-route2`: 0 over 9. The 3 + 7 screen
  findings: chai's were known (the order row's small English, a state class in its name: the baseline now loads its keys
  through the same key); chaat's were the old card's (CHT-17) and two strict ones that were real:
  - **SH-204 (new, on `main` too):** chaat L4's big card at the bowl cut "ba dungri" at its edge: the shared order card's
    fit test counted a pill's word and tick, not its speaker (five speakers, about 200 px short), so the row never stood
    upright; then the request pop-up fitted its card once as it opened, before the row stood up (it scrolled at 740x320).
    Both fixed for every game (`js/shared/order-card.js` groupFits, `js/shared/request-popup.js` fitCard).
  - **The cog under the pop-up's veil:** by design (the game under it is inert until a tap folds the card); the screen
    check now treats the tinted veil as the play area's modal (its see-through "along" form stays checked).
- **CLN-218 (new, on `main` too):** the clinic's side card scrolled 6 px at 740x320 for the face's badge; room at its foot.
- **contract-24 on samosa** (a glow 23 ms after a pick): the glow was switched on in the tap's own handler (the answer to
  the pick); the check now knows that. **contract-65 on chaat's chop** at 1920x1080 (26 ms over): timing, passed twice
  when rerun.
- **The judge** (Fable, 4 batches, `ev-20261104-042426-e9c`, 17 rows): built SH-163, SH-199, SH-200, SH-203, CHAI-70,
  CHAI-72, CHAI-73; reopened CHAI-68 (the builder's reading on the row: pan 2 was in use in the shot, the probe must reach
  a player who waits) and SH-196; 6 EVIDENCE (the shots did not reach the moment: SH-201, SH-202, CHAI-67, -71, -74, -75);
  SH-189 refused (no red run first). **Its off-row flaw fixed:** the reveal lesson's box and glow, round the dots' 24 px
  tap area, lay over the word above; the box now hugs the four dots (`js/shared/onboard.js` o.box) and the dots glow.
- **Cook's mount test:** 33 fails, down to 21: an unmount mid-step left the onboarding kit's rung clock, its layer on
  `<body>` and its listeners (Onboard.stopAll, from Cook's UI.reset; the page error went with them). The 21 left are the
  same in every mount (not leaks): the voice's safety timers, the sound's audio context, the shared listeners added once
  per page, and the test browser's `window.Cook` (3 Nov, for the evidence probes; never on a visitor's page).
- **The reveal lesson** waited for the row to stop but lit 7 ms after its scroll ended (contract-79): a beat of real time.
- Final: `s17-final3` and `s17-route3`, then `checks.mjs` (see the end).

## Art
- Art block 3 landed (38 of 39; BK, NF best tries; MZ refused): filed, judged, run log; the redo block for BK, NF and MZ (MZ reworded)
  is `docs/design-language/art-plans/s17-art3-redo-block.txt`.
- Pack s17-wm landed and wired (CHAI-73).

## For Zafar
`docs/feedback/chai-play-2026-11-03.md` §6: the snap, the pop-up's shape, the reveal lesson, the plain wall, Nani's hint for an asked
thing, each built on the recommendation.
