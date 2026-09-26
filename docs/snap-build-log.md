# Snap: build log

## 25 Sept 2026, phases 0 and 1 (branch `claude/build-snap`)

Built to `docs/modes/BUILD-COMMON.md` and `docs/modes/snap-design.md` (D1–D9, build brief s12), with every default taken: no digit on count rows; a Snap-owned orchard sidecar; Ali holds the camera.

### Files (Snap's own only)
- `data/snap.json`: words borrowed from content (fruit, numbers 1–10), placeholder lines (`snap-*`, `kutchi: null`), K1–K3, mechanic levels, the four mini-games' level ladders, star set, pay, tips, leak gates.
- `data/scenes/orchard.json`: the greybox orchard (bands, cluster patterns, size classes). Which fruit hangs where is dealt per seed.
- Pure (Node and browser): `js/snap/photo.js` (print record, matcher K1–K3, lens, recast), `js/snap/requests.js` (knobs, dealer, reachability, guaranteed frame), `js/snap/sim.js` (a whole round, 11 bot strategies, Ali), `js/snap/stubs/stars.js`, `js/snap/stubs/which-one.js`.
- Browser: `snap.html`, `css/snap.css`, `js/snap/core.js`, `adapters.js`, `prints.js`, `mechanics/viewfinder.js`, `mechanics/handin.js`, `mechanics/ali-camera.js`, `round.js`, `bot.js`, `flow.js`.
- Tests: `build/leak_snap.mjs`, `build/test_snap.py`; reports in `build/reports/`.

### Leak-bot numbers (Node, 500 rounds per strategy per level; `build/reports/snap-leakbot.md`)
| | Oracle ear | Blind pooled | Worst blind |
|---|---|---|---|
| G1 L1 / L2 / L3 | 100 / 100 / 100% | 1.1 / 0.1 / 0.0% | onePerKind 2.8% |
| G2 L1 / L2 / L3 | 100 / 100 / 100% | 1.1 / 0.1 / 0.0% | rowShape 2.8% |
| G4 L1 / L2 | 100 / 100% (voice 100%) | 1.5 / 0.4% (voice 0%) | random 2.2% |

D5 estimated G1 L1 under 1% and G2 L1 about 2%: measured 1.1% and 1.1% pooled.

### Decisions taken on the way
1. **HTML, not Phaser**, as Find it does: the orchard is plain HTML under a CSS transform; a print is the same scene drawn in a small window (the HTML version of `snapshotArea`).
2. **The orchard is dealt per seed** from cluster patterns in the sidecar (scene memory can't leak). Count clusters use two bands, size clusters three.
3. **Lens star tuned for still fruit**: biggest fruit ≥ 8% of the frame, centre in the middle half, ≥ 90% showing (s7's 15–70% and middle third were for one animal; a count shot of 2–3 could never earn it).
4. **G4 rows alternate** child / Ali (D4). Ali's rows are handed in but excluded from the ear star; the voice star is theirs. A G4 round of Ali-only rows failed the gate (10.4%): the hand-in was a coin flip between prints the child had directed from pictures.
5. **Hand-in never sticks**: at most two trips back per row, then "Nearly!" and the next row.
6. **Tap slop**: without drag, the dealer only counts a free point as reachable if it's 16 units clear of every fruit (else a real tap snaps onto the fruit).
7. **Numbers 6–10** are borrowed too, only for recasts ("Arre re! Chh aamo").
8. The lens icon is added to Cook's icon table at runtime by the star stub (no Cook file edited).

### Browser checks (`build/test_snap.py`, port 8807)
- `--lab`: every mini-game and level played by the oracle bot earns the ear star (G4 the voice star too); a fresh profile gets no ear star offered; G4 with no speech finishes by tapping, no voice star.
- `--viewport`: G1, G2, G4 level 1 by real taps at six sizes, tap-cover check clean. 1–2 "rounding aims" a round (an exact aim after a tap lands a pixel off three times) are counted, not hidden.
- `--leakbot 5`: the in-page bots (same strategies, real viewfinder and hand-in), 110 rounds of G1 and G2 level 1: oracle 100%, blind pooled 1.0%; Node on the same levels 1.0% (brief: within 2 points). Small sample; the Node run is the gate.
- `--timing`: a level-1 round, 2 rows, in 4.4 s of oracle play (limit 120 s).
- `--perf`: phone 915×375 with CPU slowed ×4, a 4-row level-3 round in the 2-screen orchard: 4 prints, mean 17.3 ms a frame, 5 of 742 frames over 34 ms (worst 200 ms, around building prints and the hand-in). Not "no dropped frames"; headless Chromium is not a phone.
