# s19-night-c: the chop screen (chop, chaat, daar), samosa, maani, sekelo: rows, overnight 13 Nov

Branch `s19-night-c`, never pushed. The machine ran at load 30-50 all night (four builders' browsers), so pages took 2-5 minutes and
every timing check (36, 78, 91, 104, 106, 117) fired more than on a quiet machine. I spent the browser time on the rows a child sees.

## Flaws first
- **Contract, L1 at 740x320 and 1280x665: 19 before (`s19-night-c-base`, quiet start) -> 67 after (`s19-night-c-contract`, under load).**
  Most of the rise is timing under load (contract-91 x9, 36 x13, 117 x5, 104 "picture did not load" x5, 78 x4).
  Mine, and still open:
  - **samosa contract-36/107/92/117 on ph-keema:** SAM-38 makes the first light the named filling's heap. The kit's light on a shelf
    heap came ~2.5 s after the call under load (36), before its hop (107), and at 740x320 covers its neighbour (92, as the gate's
    help light already did). The strip had none of these because it is not a shelf thing.
  - **samosa contract-108 ("trae chunda" open at Shabash):** my SAM-40 change caused it; reverted (`samosa.js:233`). The L2-L4 run
    played some samosa pages before the revert.
  - **stir:** my first-light change did not move contract-78 and added 36/117 on the ladle: reverted.
- **Four sizes, L1, all eight flows: 32 of 32 pages reached their end, 0 page errors, 139 breaks** (`s19-night-c-contract/contract.md`).
- **Tier 2 (`check-change.mjs`) not run:** it plans 30 steps, about 269 min (88 + 88 for play and before). Reduced (`--base a9ccaa4fd
  --levels 1 --sizes 740x320 --no-before --no-film`) it is 48 min; no lock time was left.
- **`checks.mjs`:** 12 of 13 steps ok (load not run: my lock was busy). unit: 2 fails, both fixed or not mine:
  `build/host/onboard.test.mjs` (my samosa `Coach.stop(true)`: fixed, the fold's own demo named, now 3/3 pass);
  `build/tools/ops/briefpack.test.mjs` "the live specs give no overlap" (the overnight specs share evidence.json: the orchestrator's).
- **No before folder for this brief** (its spec has `rows: []`). The before is `build/screenshots/sandbox/s19-night-c-base/` (the
  contract run at launch) and the gate's 12 Nov run.

## Rows
DONE (code + script-made frames, for the judge):
- **SAM-38:** the first light is the bataato/chundo heap as Nani says it (ev1 SAM-38, ev3 SAM-38; before: base `cook-samosa/740x320/05-kind-tap.png`, the strip lit).
- **SAM-37:** the fold's light is the dough alone (ev3 SAM-37 frames 4-5; before: base `06-kind-swipe.png`, the order card boxed).
  The kit's one end-of-showing card point now comes during the fill, on its own.
- **DAAR-52:** one Nana face, 150 design px, at the bowl's upper left; the katori's face stands down (ev1 DAAR-52).
- **CK-108:** the strip's box ends ~60 px inside the right edge at 740x320, the hand inside it (ev1 CK-108).
- **CK-109:** "Nindha nindha kap!" from the light's first frame, the finger 0.3 s after the dim (ev1 CK-109).
- **CK-110:** the halves are clamped inside the board (ev1 CK-110). The hop still crosses the board's edge on its way up (the mechanic).
- **CK-111:** what waits beside the hob and the spice shelf at full strength (ev1 CK-111, DAAR-52 frames 3-5); the finger draws the knife.
- **SEK-28:** the served tray carries the child's own skewers (`grill.js SK.servedSkewers`, `mishkaki-grill.js serveAs`); its probe
  (ev3, L1-L2) was cut by the lock.

PARTLY: **SEK-29** browning over the cook's time (ev1 SEK-29) and the cog moved off the tray (code, not yet in a frame); the lights'
hold, the steady order row, the headline picture and "gos" in the review are the kit's. **CK-112** the maani label above the board
and the plates full strength; the dish card's place is the shared card (SH-273).

LEFT:
- **SAM-40** (kit): the card folds when the dish is closed whole (`ui.js` closeItem `madeNow`, decision 97 (3)); keeping the item
  cards to the praise needs the fold to wait for the well done. New label: shared (s19-night-shared).
- **CK-106** (needs Zafar): the dish does land on Nani's tray (`serve-trays nani:chop`, +3 s after "Shabash!"); nobody thanks because
  Nani is the asker (`flow.js kitchenEnd`, guests excludes Nani). Who receives Nani's chopping is his call.
- **CK-107** (to judge): chop's end buttons are the same retry and grid as daar's (base `cook-chop/740x320/10-result.png` vs
  `cook-daar/740x320/15-result.png`).
- **MAA-25** (needs a layout): no room for two plates on the worktop beside the hob at 740x320 without shrinking the board or tawa.
- **[check] rows not run tonight** (their probes exist; 88 pages did not fit): DAAR-12, -36, -37, -38, -40, -41, -43, -44, -45, -03,
  -46, -47, -49, -51, -39; SEK-14, -20, -22, -25, -26, -27; SAM-30, -31, -34, -35, -36; MAA-19, -20, -21, -22, -23; CHT-13, -18, -19.
  CHT-13's L1 probe never reaches `view-marble` (0/1 twice). MAA-20's pick and MAA-23's lesson wait on Zafar; the roll's call
  (contract-36, maani) is skipped for no voice: waiting on Mum.

## Proof
- Evidence: `build/screenshots/evidence/s19-night-c-ev1/` (index `build/reports/evidence-s19-night-c-ev1.md`, 9 rows), ev3 (below).
- Contract before: `build/screenshots/sandbox/s19-night-c-base/contract.md` (L1, 2 sizes: 19).
- Four sizes after: `build/screenshots/sandbox/s19-night-c-contract/contract.md` ("CONTRACT FAILED: 139 breaks", 32/32 ends).
- L2-L4 after: (below).
- Recording gaps heard (device voice): "Samosa waar!", "Samosa hane kadh.", "Tar!", "trae chunda", "Nindha nindha kap!", "Pela jeeru.".
