# Sekelo v3 (30 Sept, the sekelo station session)

Zafar's 29 Sept play-test, §9 (K1–K11) and his answer to Q11: the rack and the plate as pictures with the pieces
added in code, the new charcoal grill, big chunky pieces that match the heaps, the plate lined up with the grill
and the rack with the handles off it, the review face over the plate, and a pass through levels 2–4.
Branch `claude/cook-sekelo-v3`. Shots: `build/reports/sekelo-v3/` (contact sheets, one per viewport and level).

## 1. Mechanics changed or removed

- **The rack holds 4 at every level (was 5 at level 4).** The rack is now a picture of 0–4 skewers (K9); there is no
  5-skewer picture. Level 4 orders 3–4 skewers, so with an order of 4 a wrong skewer on the rack leaves no room for
  a fifth: the child serves it, the review says "not quite" and they make it again (the redo is already the rule).
  Before, the 5th slot let them leave the wrong one behind. `data/cook.json` `mechanics.grill.levels[2].rack`,
  noted there. (Open for Zafar: a `rack-5` picture would bring the spare slot back.)
- **Level 3 may have two mixed skewers (was exactly one).** K4 asks for "mostly mixed" from level 3. Level 3 was one
  mixed of two or three; now one or two (`recipes.mishkaki.slots.skewers.max`, level 3: 2), so on most orders half
  or more are mixed. Two mixed at level 3 are the same mix, said once ("ba lakri mixed" and its list). Level 4 stays
  at two (two *different* mixes are graded one of each, so a third mixed one would break that).
- **A rack skewer taken to the grill leaves no gap:** the ones after it slide along (the picture holds the first n).
  Which skewer you pick, and everything after, is unchanged.
- Nothing else. The thread, grill (turns, band, spots), plate grading, serve and taste, redo and the juggle
  (still off) are as they were.

## 2. What was built

- **K9 / Q11: the rack and the plate are pictures; the pieces are added in code.**
  - `build/measure_sekelo_v3.py` measures each drawn skewer's line from the art and writes it into
    `assets/cook/items/v3/sekelo/meta.json` (`sticks`): upright on the rack `[x, tip, handle, end]`, diagonal on the
    plate `[tx, ty, hx, hy, ex, ey]` (the handle's start is where it leaves the plate: K8). It also cuts:
    - `stick.webp`: rack-1's skewer with the rails taken out from behind it. It is the one skewer the code moves
      (the board, the flight, the grill), so every skewer on screen is the same drawn stick;
    - `plate-0.webp`: the empty plate (there's no such cell): plate-1 with its skewer painted out by the same plate
      turned round its rim centre (the rim and well line up).
  - `js/cook/mechanics/grill.js` `SK.V3` holds the same numbers; `SK.lineAt` / `SK.onLine` lay a skewer's pieces
    along any drawn skewer (its tip and its handle's start). `SK.rack3` and `SK.plate3` swap the picture as skewers
    arrive and leave (`rack-n`, `plate-n`) and hide the moving skewer's own stick once the picture draws it. The
    j-th plated skewer keeps its place as more arrive (each plate picture's skewers matched to the last one's).
    The served plate for the table (`plateArt3`) is drawn the same way.
  - K1's "skewers extend past the rails oddly": the art is fine once the pieces are on (they cover the stick from
    just under the tip to the handle); the bare tip above the top rail stays, like a real skewer. No crop needed.
- **K6: the grill** is `grill.webp`, sized from the skewer: its height is set so a skewer lies across both bars
  with its pieces over the coals and its handle off the grill's front edge, by your hands. The skewers cook over
  the measured coal bed (`bed`).
- **K5: big chunky pieces, the same in the heaps and on the skewer.** The shelf holds the v3 heaps (meat, onion,
  tomato; pepper filed) instead of bowls, 140 px wide so a heap's chunk is the size of a piece on a skewer on the
  rack, grill and plate (~58 px). The pieces are the v3 chunks, raw → grilled (→ charred meat; a charred vegetable is
  its grilled chunk darkened); the drawn grill-mark overlay is off for them (they have their own). The decoy potato
  (level 4) borrows samosa v3's potato heap and keeps its old small sprite on the skewer (no sekelo potato chunk).
- **K8: the plate lines up** with the grill and the rack: all three sit on one line, their middles level, every
  skewer the same length (tip to handle, `V3.BAMBOO`); the plate's handles go off it to the right.
- **K10: the review face** sits over the plate (its lower edge on the plate's upper rim, the skewers still in
  sight), 240 px, and `Cook.Kit.review` keeps it inside the view: shots on laptop and phone landscape show it whole.
- **K1 / K4 (the shared session's work), checked:** the headline says *Muke sekelo khape.*; *mishkaki* is only the
  meat chip. No order asks for a bare *boga* skewer: a veg skewer is *lakri dungri* / *lakri tameto* or a mixed list
  in order (levels 1–4 shots). Nothing broken.
- `build/check_vessel_meta.py` checks the rack and plate skewers (art re-measured vs meta vs grill.js), the grill's
  bars and bed, the stick, and every plate's rim (plate-0 included).
- `build/shoot_sekelo_v2.py` (the station's shoot script) shoots the new states: `raw`, `plate-N`, `charred`
  (`--char`), and a full rack of 4 (`--skewers 4`); output `build/screenshots/sekelo-v3/`.

## 3. Tests

RESULTS

## 4. Shots with their flaws

SHOTS

## 5. Levels 2–4 notes

LEVELS

## 6. Open for Zafar

- **The plate's skewers are drawn close together** (about 50 px apart on the 600 px plate), so with chunky pieces two
  or more plated skewers overlap: 3–4 read as a pile of kebabs, not four separate skewers. They are layered back to
  front so it reads as a stack. A plate picture with the skewers fanned further apart (about twice the gap) would
  fix it; the code places pieces on whatever lines are measured.
- **A 5th rack slot at level 4** needs a `rack-5` picture (see §1).
- **The empty plate** (`plate-0`) is patched from plate-1: a faint seam where the skewer was, only seen before the
  first skewer lands. A clean empty plate from the same sheet would replace it.
- **The decoy potato** has no chunky sekelo piece (its heap is samosa's diced potato, its piece the old sprite).
- **The threading board** is still the old board art (not in K1–K11).
- **The end screen's word card says *hakro*** (the counting word's base form) where the order said *hakri lakri*:
  the shared results card, not this station.

## 7. New placeholder words

None. No new Kutchi; no new English words on screen.
