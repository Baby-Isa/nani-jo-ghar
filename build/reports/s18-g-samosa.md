# s18-g-samosa: samosa on the kits (Sprint 18, wave 2)

Opus, high. Samosa keeps fill, fold and fry (non-negotiable 1, KEEP-03, -04, -13); no mechanic touched, `fry.js` untouched (eggs).

## What changed

- **Its settings file:** `data/stations/samosa.json` gains `art` (the pictures, build/cut_cook_v3.py's measures, each filling's heap,
  the oil's colours) and `grid` (heaps, pills, shelf span, board, plate, strips, fry, oil by count). `samosa.js` reads them
  (`settings()`); its own constants are gone.
- **Copies deleted (STD-F1-02), the lines:** `pop()`'s card drawing (chai's word pop) → `Juice.P.pop`; `backdrop()`'s wash and band
  → `Cook.Kit.worktop` + `St.stoneBand`; `asTally` (also in fill-fold.js) → `Cook.Pastry.tally`; `INK`, `FONT`; the shelf's
  pitch and x arithmetic → `Shelf.slots`; `St.customerSay`/`customerDone` → `UI.personSay`; `cardAgain` and serve's "not quite"
  branch (dead: serve was always called right).
- **Lights and lessons (kit d):** `Cook.Coach.lessons` before the first spoon (STD-D1-08); `Cook.Coach.nextLight` on the next strip
  the first time one is needed (STD-D1-10); `Cook.Coach.wrong` on a wrong tick or lift (STD-D2-04).
- **Gap page:** `docs/design-language/standard/gaps/samosa.md`.

## Proof

- Commits: `8b3b2333` the gap page (alone, first); `393b4814` settings file, copies deleted, lessons, wrong; `14c11911` Shelf.slots,
  the next strip's light; the last commit: the light hugs the strip's pastry (contract-53, found and fixed in the four-size run), its
  note from the gate's scope, the gap page rescored, this report.
- The contract line (`run.mjs --contract --flow cook:samosa --sizes 740x320,930x430,1280x665,1920x1080 --run-id
  s18-g-samosa-contract`): `CONTRACT PASSED: 0 breaks over 4 pages`, every end reached, 0 page errors; the next strip's light lit
  at 740x320 and 1920x1080. L1-L4 at 1280x665 (`s18-g-samosa-b2`): `CONTRACT PASSED: 0 breaks over 4 pages`, contract-98 0, the
  reveal lesson shown at L2-L4.
- The gap page: before 0:11, 1:24, 2:164, 3:4, dbd:2; after 0:11, 1:16, 2:155, 3:21, dbd:2. `audit --standard samosa --run
  s18-g-samosa-b2`: 16 pass (was 2), 22 fail (cached probes of other rows, and the shared panel).
- Checks: `words`, `static` (0 new), `docs`, `load` (29/29) ok; `unit` 744 pass, 3 fail, all art-block tests (no `sources/` here).
- No BEFORE run and no evidence --after (Zafar's decision 5). QA checklist: the checks above; the judge and his play are wave 3's.

## Asks (exact changes)

1. **Kit d (`js/cook/coach.js`):** own the page box of a scene thing, so samosa and chai stop keeping one each:
   `C.pageBox = (a, b) => { const U = Cook.UI; if (!U || !U.worldToScreen) return null; const p = U.worldToScreen(a.x, a.y), q = U.worldToScreen(b.x, b.y); return [p.x, p.y, q.x - p.x, q.y - p.y]; };`
   (corners in world px); samosa's `pageBox` then becomes `Cook.Coach.pageBox(u2w(o, [0, 0]), u2w(o, [LU, 1]))`.
2. **Kit a (`js/cook/kitchen-kit.js` St.stoneBand):** draw the band's top shade (chai's own 3 px line) inside it, after the flat fill:
   `flat.fillStyle(ST.mean, 1)` ... then `flat.fillStyle(0x2a1a0a, 0.08); flat.fillRect(-far, top, W, 3);` and delete chai's
   (lines 402-404); samosa had the line before its switch and now has none.
3. **Orchestrator, `build/lint/static-known.json`:** `node build/lint/static.mjs --write-known` (one known finding fixed: samosa's old literal).
4. **Zafar (a decision, `docs/questions.md`):** STD-B2-05: the fry's green at L3 is 0.12 wide at rate up to 0.26, 0.5 s (data/cook.json
   mechanics.fry); scoring golden runs on to burnAt, 1.8 s. Recommend: the ring's green drawn to burnAt, and L3's top rate 0.22
   (2.1 s); plus an L4 row (STD-C2-06: L4 = L3 now).
5. **Orchestrator, `docs/game-design/families/kitchen.md` samosa:** "Kit: on the five kit pieces (S18); its gap page".

## Open

The card light (STD-D1-07) not taken; the fill and fold art (decision 7, the pastry tile stands in); the brief's ART-38 is
baking's, not samosa's; no SAM-* row is open. `fry.js` and fill-fold.js's Phase A fill and fold untouched (eggs; the lab tile).
