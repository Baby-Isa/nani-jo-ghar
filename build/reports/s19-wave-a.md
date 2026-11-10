# s19-wave-a: tray, loading, daar, maani (10 Nov)

Opus, high. Flaws first.

## Flaws and open
- **contract-105 (L2-L4, small sizes, every game):** the reveal lesson's box stops 7 px short of the card's top, clear of the face circle (contract-82). The probe should count the face as a neighbour. The other 105 break is the light on the empty glass at chai's serve.
- **Older faults:**
  - contract-84 (daar's knob)
  - chai's own hint glow (contract-102, `chai-tray.js:1971`)
  - the mount test's 21 FAILs and daar's loadtime +22% (both the same on the old code)
- **The disk filled:** check-change's play lost 6 pages to crashes and was cut short, so it wrote no result file.
- **Outside the brief:** `ui.js` (granted), `check_vessel_meta.py`, `stir.json`.
- **Open:** the stir lab's dial (DAAR-45); no before folder.

## What changed
- Tray: `Shelf.P.tray`, used for top-down bands (ART-69, SH-243).
- Loading: a stone cover with one fade; card pictures first (SH-220, contract-104).
- Cards: the light on the card (CK-63); a game's own card wins.
- Daar: bowls, ladle, bigger pot, dial left, card right (DAAR-50).
- Maani: heaps, steel plates, board the tawa's size, handles bottom right (MAA-24).
- Chai re-frozen: cover note, contracts 102-111.

## Proof
- After: `build/screenshots/brief/s19-wave-a/`.
- SH-220 film: `build/screenshots/evidence/ev-20261110-055548-r6v/SH-220.png`.
- Contract: 20/20 end reached, 0 page errors. `CONTRACT FAILED: 5 breaks (contract-37 4, contract-11 1)`, all wave B's. Daar and maani L1-L4: 32/32.
- Checks: checks.mjs, vessel-meta, teachgate and `leak_cook: ok` all pass.
- Frozen diff:
  - The replayed run shows no change except a page that crashed on the full disk.
  - The latest run (`frozen-diff-chai-tray-202611100849`) was not confirmed: its replay hit the time cap. Its changes are load flakes plus chai's own serve 104 (already in the 9 Nov list).
