# Monsoon rush: build report (phases 0–1, plus G3)

Branch `claude/build-monsoon`. Details and decisions: `docs/monsoon-build-log.md`.

## Built
- **Engine (Node and browser)**: `js/monsoon/clock.js` (audio clock and a virtual clock), `calls.js` (generator with the §8.1 constraints, `keyAt` timing, grading, retries, stars, the Busy stage rule), `bots.js` (the §8.5 bots and a headless player). G1, G2, G3, G4 and G6 storms run headless.
- **Greybox kitchen**: `monsoon.html` loads Cook's `core.js`/`lang.js`, `js/progress.js` and `js/shared/speech.js` (read only). Mechanics: `cover` (G1), `count` (G2) and `callit` (G3), each at L1–3 in Drizzle and Busy, with the call pill, live stars, word review and intro card.
- **Data**: `data/monsoon.json` and the sidecars `data/monsoon-audio.json` and `data/scenes/kitchen-monsoon.json`.

**Open it**: serve the repo and go to `http://localhost:8805/monsoon.html`, which is the Rush lab. `?clock=virtual` is the test clock.

## Leak-bot numbers
- `node build/leak_monsoon.mjs`: 32/32 unit cases; 0 constraint failures and uniform χ² over 1,000 storms per game and level. **Every bot is under 2%** in Busy and Drizzle (highest: G3 `menu` at 0.20%). The one exception is the within-storm `learner` on G6 L1 (placeholder spots) at 3–4.4%. It learns clip → place from the reveals, which is learning the word, so it's reported per §8.5; 10% still fails. **English bot**: the recogniser returned null for 34/34 English clips.
- `python3 build/test_monsoon.py`: a test player with real taps behind a tap-cover check gets every star in G1–G3 at L1–3, both tempos (laptop), and each game at L3 on the other five sizes plus a 375 px phone. No console errors. The browser bots match Node outcome-for-outcome on 36/36 storms. Every G3 speech path is reachable.

## Stubs to swap
- `js/monsoon/stubs/say.js` → `js/shared/mechanics/say.js`.
- `js/monsoon/stubs/speech-lab.js` → `Speech.listen`, which it already calls in "real" mode.
- Progress uses a temporary in-memory profile until the shell attaches one.
- Star rules sit in `data/monsoon.json`.
- `monsoon-audio.json` is for the manifest merge.

## Next
`passme` between Drizzle waves; G10 echo and G11 caller; the courtyard station (G4, G6) and the real-device latency check.

## Decisions
The sidecar is at the brief's path, `data/scenes/`. G1 uses both look-alike groups (8 pots) and never calls menu words. Sequences grade in order. G2's drops fall slower in Drizzle but never wait. In Busy, Ali shrugs on a null and the pills stay up. Cook's `count` rules are mirrored, not loaded, because it's bound to Phaser.
