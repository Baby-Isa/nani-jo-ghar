# Shared UI build: end-of-round screen and onboarding kit (25 Sept 2026)

## What's built
- **`js/shared/results.js` + `css/shared/results.css`.** Page 1 shows three badges: Time (a stopwatch, per-profile best per mode+game+level, and on a new best a bing, sparkles and "New best!"), Accuracy (slots filling green or red, a jar past 20; all right goes gold with a chime) and Hints (0 gold, 1 mid, 2+ plain). Then a big Next on the right. Page 2 is the word review (tap to hear), then Done and an optional Play again. `Results.toStars`/`fromStars` map the badges to the existing stars.
- **`js/shared/onboard.js` + `css/shared/onboard.css`.**
  - Scripted steps: the spotlight dims everything else and blocks touches there.
  - A ghost hand shows each gesture: tap, drag, hold, swipe, circle-stir.
  - Each step waits for a named signal or a tap.
  - Runs once per profile per station.
  - A grown-up skips by holding the corner button for 1 s, or with Escape.
  - `fadeIn`/`await` handle UI that appears when first needed.
- **Support files.**
  - `js/shared/uistore.js` is the storage adapter. It uses `profile.shared_ui` via `Progress`'s attached profile, and falls back to one marked localStorage key.
  - `js/shared/sfx.js` holds the Web Audio sounds; no files.
- **Docs.** `docs/shared-api.md` §8–10 covers both APIs and how a mode adopts them. `labs.html` has a new card.

## How to open
`lab/shared-ui.html` has five fake rounds (new best, mixed, many hints, jar, first ever) and a fake 3-step chai station (tap the jug, drag it to the pan, stir).

## Tests
- `node --test build/test_shared_ui.mjs` (8 tests: badge tiers, the best-time rule, per-key bests, profile storage, star mapping, the state machine, validation and ghost paths, once-per-profile) passes. All the shared unit tests pass: 67.
- `node build/test_shared-ui-browser.mjs` (port 8811) passes at 915×375, 390×844, 1024×768 and 1440×900, and with reduced motion. Screenshots are in `build/screenshots/shared-ui/`; I reviewed them.

## Decisions
- The first-ever time sets the best quietly (nothing was beaten). "New best!" needs at least one whole shown second faster.
- The Time badge is never plain: gold on a new best, otherwise mid.
- Accuracy is mid at 60% or more.
- A tap on the ghost's target during the demo counts.
- Skipping marks the station as seen.

## Next
Modes adopt these per §10. Cook goes first: its result card and each station's script.
