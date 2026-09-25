# Snap: build report (phases 0 and 1)

**Branch** `claude/build-snap`. Snap's own files only; nothing in `js/cook`, `js/find`, `js/shared` or the shell was edited. Details are in `docs/snap-build-log.md`.

## What's built
- **Phase 0 (pure logic, Node and browser):** `js/snap/photo.js` (print record, K1–K3 matcher, lens, recasts), `js/snap/requests.js` (level knobs, the orchard dealt per seed, the guaranteed frame), `js/snap/sim.js` (whole rounds and 11 bot strategies), `data/snap.json`, `data/scenes/orchard.json` (Snap-owned sidecar, greybox).
- **Phase 1 (greybox lab):** `snap.html`, `css/snap.css`, the viewfinder (tap-to-centre with aim assist, +/− steps, drag from level 2, shutter and film), prints and tray, Show Nani (new order, recasts from the print record, go back for a frame), **G1 Just so many** and **G2 The big one** at levels 1–3, **G3 Show Nani** on its own, **G4 Ali's camera** at design levels 2–3 through `js/shared/speech.js` with pills and a "Did they say it?" tick. Stars: ear, lens, tick, voice.

## Open it
`snap.html?lab=1` (the Snap lab: mini-game, level, word stage, seed, bot none/leak/oracle, what Ali hears, debug boxes, print records). A direct round: `snap.html?lab=g2&level=2&bot=oracle&debug=1`.

## Numbers
`node build/leak_snap.mjs` (500 rounds per strategy per level): oracle 100% everywhere; blind strategies pooled ≤ 1.5%, worst single strategy 2.8% (gates: <10% and <5%). G1 L1 1.1%, G2 L1 1.1% (D5 estimated <1% and ~2%). G4 voice star: oracle 100%, blind 0%. Unit fixtures and `--fair` (every row achievable, ≥3 kinds) pass. `python3 build/test_snap.py`: lab, six viewports by real taps with the tap-cover check, timing and phone performance all pass (the phone run had 5 of 742 frames over 34 ms). The in-page bots at level 1 match Node: blind pooled 1.0% in both (110 rounds).

## Stubs to swap (one edit each, in `js/snap/adapters.js`)
`js/snap/stubs/stars.js` (ear needs 2 tested rows, voice, lens icon) and `js/snap/stubs/which-one.js` (G2 size picker). `Snap.listen` already calls the real `speech.js`, with lab stubs `?speech=oracle|null`.

## Decisions I took
1. HTML, not Phaser (as Find it); a print is the scene redrawn in a small window.
2. The lens star is tuned for still fruit (biggest ≥8% of frame, middle half, ≥90% showing).
3. G4 rows alternate child and Ali. With Ali-only rows the blind hand-in hit 10.4%; Ali's rows now earn only the voice star.
4. At most two trips back per row, then "Nearly!" and on, so a round always ends.
5. Without drag, tap-only frames need 16 units clear of fruit.

## Known limit
*aamo*, *vadho*, *nindho* and *nar* have no voice file, so by Cook's rule they never fade to dots: they stay readable text. This goes away when recordings arrive.

## Next (phase 2)
Quick shot via Cook's `passme`, Relaxed/Busy daylight bar, the album (G5), Ali rows inside G1/G2 at level 2+, and a real-phone performance check.
