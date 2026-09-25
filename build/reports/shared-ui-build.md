# Shared UI build: end-of-round screen and onboarding kit (25 Sept 2026)

## Built
- **`js/shared/results.js`, `css/shared/results.css`.** Page 1 has three badges.
  - **Time:** a stopwatch with a per-profile best per mode+game+level. A new best gets a bing, sparkles and "New best!".
  - **Accuracy:** slots filling green or red (a jar past 20). All right turns gold with a chime.
  - **Hints:** 0 is gold, 1 mid, 2+ plain.

  Then a big Next. Page 2 is the word review (tap to hear), then Done, with Play again if the mode offers it. `toStars`/`fromStars` map the badges to the existing stars.
- **`js/shared/onboard.js`, `css/shared/onboard.css`.** Script steps: a spotlight (touches outside it are blocked), a ghost hand (tap, drag, hold, swipe, circle-stir), then a wait for a signal or tap. Once per profile per station. A grown-up skips by holding the corner button for 1 s, or with Escape. Also `fadeIn`/`await`.
- **Support.** `js/shared/uistore.js` stores data on `profile.shared_ui` through Progress's attached profile, with a marked fallback key when no profile is attached. `js/shared/sfx.js` has the Web Audio sounds; no files.
- **Docs.** `docs/shared-api.md` §8–10 covers both APIs and adoption. `labs.html` has a new card.

## Open
`lab/shared-ui.html`: five fake rounds, plus a 3-step fake chai station (tap, drag to pour, stir).

## Tests
- `node --test build/test_shared_ui.mjs`: 8 pass (all shared unit tests: 67).
- `node build/test_shared-ui-browser.mjs` (port 8811): passes at 915×375, 390×844, 1024×768 and 1440×900, and with reduced motion. Screenshots are in `build/screenshots/shared-ui/` (reviewed).

## Decisions
- A first-ever time sets the best quietly.
- "New best!" needs a whole shown second faster.
- The Time badge is never plain.
- Accuracy is mid from 60%.
- Skipping counts as seen.

## Next
Modes adopt these per §10. Cook goes first: its result card, then its station scripts.
