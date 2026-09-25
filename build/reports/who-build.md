# Who did it?: build report (phases 0–1)

**Branch:** `claude/build-who`. **Open:** `who.html?lab=1` (add `&game=g3|g1|g2|g5&level=1|2&seed=N&debug=1`); the story case is `who.html?case=a1c3-sweets`.

## Built
- **`js/who/case.js`**: the engine, pure and seeded. It generates, solves and grades all four kinds (one each, keep who fits, Nani guesses, Tell Ali), plus the star rules. The data is in `data/who.json` and `data/scenes/sofa.json`.
- **Greybox Case lab, L1–2:** G3 Look closer (drag the magnifier), G1 Who ate this one?, G2 Keep who fits, and G5 Tell Ali (a dealt card; Ali acts on the word; mic, then pills, or a parent's tick). One file per mechanic (`lineup`, `examine`, `accuse`) and per game.
- **Tests:** `node build/leak_who.mjs` and `python3 build/test_who.py --lab --viewport all` (port 8803). Everything passes on all six sizes.

## Leak bot (10,000 rounds; best blind strategy)
- G3 L1: 1.7% (D5 estimate 1.6%)
- G1 L1: 3.4–4.1% (3.7%)
- G2 L1: 2.2% (≈4%)
- Every L2: 1.8% or less
- G5: 0% voice star by pills (random pills solve 12–17%, coins only)
- G4 logic: 6.3% (6.25%)

Tap-all, early accuse and waiting: 0%. Every generator rule holds. UI bot: G1 4.5% and G3 1.0% (200 rounds each), G2 3.3% (60 rounds), within 2 points of the logic bot.

## Stubs to swap
- `js/who/stubs/whichone.js` → the foundation's "which one?" module (one line in `case.js`).
- `js/who/stubs/tell.js` → `js/shared/mechanics/tell.js` (one `<script>` line, same API). It already calls the real `js/shared/speech.js`. Only *limu* has a recording, so the mic falls back to pills for now.
- `star_set` in `data/who.json` is in the foundation's shape.

## Next (phase 2)
- G4 on screen with `yesno`
- Busy mode (the chai ring)
- G2 L3: ask, send away, Prove it
- The paid "tap to hear" help rung
- A bot menu in the lab
- A portrait-tablet layout

## Decisions I took
1. The greybox is plain HTML, like Find it, not Phaser.
2. In G1 one suspect may eat several sweets; otherwise "never the same twice" wins 1 in 6.
3. A word means one thing per line-up. This fixes a bug where *tameto*, both held and on the paws, made Tell Ali loop.
4. G2 L1 has 2 clues, not 2–3: only two Kutchi-real dimensions exist without the magnifier.
5. The magnifier is dragged; tapping always picks.
6. Nani asks any question that splits her cards, not the best one.
7. `tell` is stubbed locally, because `js/shared/` belongs to the foundation.
