# s18-g-chaat: chaat at chai's standard on the kits (Sprint 18, wave 2)

Opus, high. Chaat keeps its bowl; everything else moved onto its settings file and the kits. Gap page first
(`docs/design-language/standard/gaps/chaat.md`), committed alone.

## What changed

- **Settings file** `data/stations/chaat.json` (new): the bowl's place, size and layers (thin, drizzle, band scale, pot food), the
  shelf (base, pitch, pot width, span, pill line), each topping's pot and strip, the motions' times, flyMs by level (420, 360, 305,
  260: about 15% a level, STD-C2-06). `assemble.js` reads it once (prefetched as the code loads). BOWL, BOWL_INSIDE and POT stay in
  code: `build/check_vessel_meta.py` reads them there (green).
- **Kit pieces taken** (copied code deleted, `js/cook/mechanics/assemble.js`):
  (a) `Cook.Kit.worktop` + `St.stoneBand` for chaat's own page-colour fill, parchment band, shade line and grey plank;
  (c) `Shelf.P.chip`, `Shelf.slots`, `Shelf.pillWant`, `.pillGap`, `.pillRoom`, `.pillScale` for its own chip (bg, speaker, hit
  area), `chipLabel` (the 14 px wrap) and the pitch arithmetic; `Shelf.P.speaker` for its `speaker()` (chai v2's copy); `Juice.P.pop`
  + `Cook.Kit.textFloor` for its own pop card and `floorK`; INK and FONT gone;
  (d) `Cook.Coach.firsts("assemble")` for its own save key (`coached["assemble-v2"]`), `Cook.Coach.lessons` (the reveal lessons, new
  to chaat), `Cook.Coach.cardLight` after the child's first layer (new), `Cook.Coach.wrong` on a wrong drop (new);
  (b) `NjgServe.round` for its own serve-redo loop (the review, the recast, the third try shown);
  (e) `UI.personSay` for `UI.mission.sayPerson` + `St.customerSay`/`St.customerDone` (the recast; L4 still said from memory).
  The ghost demo's own finger SVG and literal colours gone (the kit's `Onboard.HAND`, the tokens' gold and shade).
- **CHT-17** (L4 at 740x320): a pill whose word would have to narrow shows its speaker alone and the row is measured again
  (Zafar, 30 Oct). CHT-13, CHT-04: the s08b strips stay the placeholders (waiting on art).
- Kept (non-negotiable 1): the bowl, the checker, the spoon in and out, the wobble, the take-back, the auto-serve, the demo.

## Proof

PROOF-PLACEHOLDER

## Asks (files I don't own; exact changes)

ASKS-PLACEHOLDER
