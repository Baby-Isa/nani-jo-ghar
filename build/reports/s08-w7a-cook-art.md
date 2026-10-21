# s08 wave 7A: Cook art (s08c), cut and wired

**All three tasks are built. contract-11 and contract-37 pass. The rows still need the judge.**

- **Cut:** the cook-* jobs (`s08c.cut.json`), then `s08c-cook-post.py`: KD1, TP1, GL1, SK4 (tray-0..3 painted out), SK5, DS1 v2, CP4 v2, CP3 v2 cells 1-4 (shadows out, black-tea copies), WT1 and the hob plate x2.
- **Wired:** the kadchi (daar, stir); DS1's scatters; the three teaspoons; glasses from above; CP4's brews (no bubble rings); the pour in CP3's four frames with a thin `pour.js` stream; SK4's trays; decoys potato, mirchi, makai; tiled marble with the hob plate; the wood at screen resolution.
- **Also applied:** 7B's Cook patch, written in by hand (running it was refused). Nana, Ma and Ali now talk and blink, and AL3 is used.
- **Open, flaws first:**
  - The chicken is cut but stays out of the pool: *murgi* has no clip.
  - The tray's chunks nearly touch.
  - The tip frames' undersides are slightly lumpy.
  - cook:daal's v3 oil still shows glossy bubbles (CK-06).
  - The red runs are the earlier FAILs (ev-20261020-073941-0e9). CHAI-26 had no probe before.
- **Outside my files:**
  - `build/tools/art/specs/s08c-cook-post.py` and `assets/cook/worktop-s08c/` are new; artcheck rejects both other folders.
  - artcut's key cannot cut a full-bleed texture.
  - `build/check_vessel_meta.py` still measures the old rack.

## Proof

| Check | Result |
|---|---|
| 8-size replay `s08-w7a-cook-art-matrix-b` (10 flows x 8 sizes, after merging 7B) | 80/80 reach their end, 0 page errors, **0 contract breaks** (contract-11 at 1024x768, 1180x820, 1366x1024, 1440x900; contract-14 talk; contract-20 one face) |
| Lint vs baseline | 8 "new": the count badge's "trae" clipped at 800x360/844x390 (cook:chai, cook:chai-tray); already in s08-gate-final2, before this wave (not mine: the tally) |
| contract-37, `w7a-sek`, `w7a-sek2` | sekelo decoys 1, 2, 3, 3 at L1-L4, lookalike at L4; 0 breaks |
| Evidence sheets `ev-w7a-green1..3` (for the judge) | DAAR-02, DAAR-05, CHAI-13, CHAI-08, CHAI-26 (the pour filmstrip), SEK-14 (the trays as skewers land), SEK-20, CK-06: probes reach their states |
| `artpixels` on every cut, x2 on cream | all PASS; `artcheck` 0 new; `artdiff` re-cut identical (CP3: 4 frames changed by the shadow step, as intended) |
| `checks.mjs` (after the merge) | all ok but `load`: cook:chop flags `nani-face-talk.webp` oversize (280 px drawn at 56), in 3 of 4 runs; not a file this wave touches |
| shotdiff | changes are the stations re-drawn (glasses, marble, trays, kadchi); looked at, no broken frame |

| QA | ART-02 ✅, ART-03 ✅, ART-12 ✅ (chai; ⚠ daal's v3 oil), TXT ⚠ (the tally, pre-existing) |
