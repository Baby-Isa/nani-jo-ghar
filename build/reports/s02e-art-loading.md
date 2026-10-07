# S02-E: cut and wire the s02 art, modular loading

Branch `ccr-a7370759-t0lee7`. Not reviewed: builder's notes. Game code changed: yes (art hookups, loading).

## Flaws first
- Held, on `s02-redo-list.yaml`: C10 daar bowl (beads read as sweets; trivet wired), E2 two-colour plasters (split across), B1 sekelo dish (pepper; drawn skewer stays).
- The pour pan's handle reaches the top edge at 1366×768; C1/C8 are not strictly top-down/side-on (runner's FAIL, used).
- Not wired: U1-v2 upper arm (boing has no hook); E7 desk fan only as the belt picture.
- Cook still loads every station's code at open (Phaser + ~1.3 MB JS, `js/cook/index.js`): next step.

## What changed
1. **Cut** (`s02.cut.json`, 42 jobs, 0 flags): `artcut.py` gains cells/boxes (jugs by box), per-piece sizes, glass keying, background and pose jobs; clinic pack re-cut: 73 files, 0 differ.
2. **Cook**: kitchen with trays (customers behind their tray), served dishes, pour pans, black glasses, teaspoon, C5 jars, knife, trivet, chaat bowl (measured), fold frames, plain sekelo plate with straight skewers, slot-lid coin jar.
3. **Clinic**: `data/clinic/sheets.json` maps old pictures to sheet views; cloth dab, bin, wipe, plasters, nozzle-down bottle, tweezers, fever items, ear wax; brushing on M3 with M4 plaque wiped by the brush; D3 standing; send-off wave; v2 close-ups re-placed.
4. **Loading** (decision 68): Cook preloads only shared art; stations load and prefetch their own; clinic games load when chosen. Outside list: `clinic.html`, `ui.js`, `flow.js`, games, stages.
5. **`loadcheck.mjs`** in `checks.mjs`.

## Proof
- `checks.mjs`: unit 229/229, words 0, bump ok, load 21/21; `--stray` FAILs. Leak (clinic) PASS; `check_onboard` ok.
- Times (20 Mbit/s): Cook open 2.53→2.15 s cold, 0.58→0.48 s warm (62→20 pictures); chai +2.2 s (106→73); morning 1.45→1.37 s; tooth 1.47→1.33 s (no other games' code).
- Quick run `s02e-quick` (10 flows): all end, 0 errors, 2 new (shared "Play as new").
- About 60 min of browser checks, **over the 15-min cap**; touched sandbox, shotdiff baseline and regression rows left to `/review`.

QA checklist ⬜, for `/review`.
