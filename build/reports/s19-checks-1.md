# s19-checks-1: checks that read the screen (10 Nov)

Opus, high. Branch `s19-checks-1`, never pushed. Flaws first.

## Flaws and open
- **Caught on HEAD, for s19-fixes-e** (game code, not mine): chop's and chaat's first light runs over the side panel and to the
  frame's edge, lit while the garlic flies in (STD-E2-08a, SH-253); chop's tally chip sits under the cog (CK-78); Nana's well-done
  face covers the dish or the plates' faces in corn, maani, samosa and sekelo (SH-254); daar's badge sits on its katori at 740x320.
- **Named known breaks of the lint:** baking's own counter (SH-255), chai still passes `round: true` (dead option), daar gives
  chop's game its own zone and knife (SH-259). `Onboard.VARIANTS` is not on HEAD yet: the lint and the judge use `{swipe: ["chop"]}`
  and say so.
- contract-53/82/92/105 still run as quick first checks; contract-112 does their light parts better (it measures the drawn box,
  any face, any dim). Retire them when you agree (the check sort's G1).
- The builder stopped before its last full run (10 Nov ~22:35); the orchestrator merged it as it stood and ran the checks after the merge.

## What each check now measures
- **contract-112, the light** (`lib/lightshot.mjs`, `lib/lightjudge.py`): every light caught as pictures of the screen (with it,
  the same moment with every painted layer over the play area hidden, the frame just before for the eye). Fails: not one region,
  not a rounded rectangle, cut by the frame, thing or pill or face short of its pad, a region not a hug, over the side panel or
  another face, a dim off chai's 0.45 by 0.08, a thing moving into it. Chop's swipe: knife, item and path inside.
- **contract-113, covers**: a face, a pill or a card's words covered, or a face over a dish, from each picture's drawn pixels and
  the browser's top element; held a second.
- **Judged N of M**: `contract.md` lists, per game, every check not judged and why.
- **Shared-pieces lint** (`build/lint/static.mjs` shared): dims, gold edges, light holes, bottom bars, light variants, SH-259.
- **Six probe faults fixed:** 89 (watched, not sampled), 102 (a glow's fade), 106 (from the act), 107 (a hop window), 109
  (held, unturned), 111 (held). Also contract-95's commented-out fallback, and the leak step's false fail (a 300 s timeout on a busy
  machine reported by an ACCEPTED line).
- **Side-by-side:** the light frame keeps its box, order before light, mid-cook and the serve from the frames.

## Proof
- Bad runs: `build/sandbox/fixtures/bad-runs/` (11 MB; 3c4882609 played with today's sandbox; README). `badruns.test.mjs`: 14
  pass; loosening the dim margin turns 4 red.
- Lint: red on 3c4882609's overlay and on `round: true`; HEAD 0 new.
- Probe faults rerun (`s19c1-faults`): none of 89, 102, 106, 107, 109, 111.
- Side-by-side: `build/screenshots/sidebyside/eggs-L1-20261110-2222/`, `chop-L1-20261110-2227/`: 14 pairs, 0 not reached.
- The orchestrator's run after merging both branches: see the merge commit.
- `checks.mjs`: all ok.
