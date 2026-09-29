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
- **On the plate** the drawn skewers lie close together (~50 px apart on the 600 px plate), so there the chunks sit
  at 0.74 of their size, every other skewer's chunks half a chunk nearer its tip, and the skewers layer back to front:
  3–4 plated skewers read one by one instead of as a pile (`V3.PLATE_PIECE`, `V3.PLATE_STAGGER`). Each chunk is also
  turned a few degrees or flipped, so a skewer of one kind isn't one picture repeated.
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

- `python3 build/test_cook.py --lab --stations mishkaki-grill,thread,grill --viewport laptop`: **PASS** (40 shots).
- `… --viewport phone-landscape`: **PASS** (39 shots). `test_cook.py` had no `phone-landscape` viewport, so `--viewport
  phone-landscape` ran nothing; it now exists **only when named** (844x390; not added to the `--days` list). Also
  `httpd.shutdown()` is skipped when another script already serves the port (it crashed at the end). Both small,
  additive, in a shared file.
- `python3 build/test_cook.py --days 1 --canvas`: see the end of this section (run after merging `origin/main`).
- `node --test build/test_shared_*.mjs`: 113/113 pass. `node build/check_onboard.mjs`: ok.
- `python3 build/check_vessel_meta.py`: ok, including the new sekelo checks (rack-0..4 and plate-1..4 skewer lines: art
  vs meta 0.0000, meta vs grill.js 0.0000; grill bars 0.0006, bed 0.0000; stick; plate-0's rim 0.0002).


## 4. Shots with their flaws

Shot with `build/shoot_sekelo_v2.py` at levels 1, 2 (the wrong serve and a charred skewer), 3 and 4 (a full rack of
4) on laptop (1366x768) and phone landscape (844x390). Contact sheets: `build/reports/sekelo-v3/<viewport>-l<n>.jpg`.
Flaws first, then what's right.

- **start / thread** (all levels). Flaws: the threading board is the old art and big next to the thin rack; pieces
  on the board are a close-up, ~1.4x their size on the rack (the heaps match the rack); the thread-phase rack sits a
  little higher than in the grill phase (each phase centres its own scene). On phone the order card clips mixed pills
  ("mish…", "tame…"): the shared card. Right: heaps of the same chunks as the skewer; the word pop by the board.
- **full rack of 1 and of 4** (`go`). Flaws: the bare tip above the top piece is ~25 px (reads as a skewer point, fine);
  the rails are mostly hidden under the pieces on a full rack. Right: four skewers in the drawn slots, pieces on the
  sticks exactly (zoomed ×2: each chunk centred on its stick, no gaps, handles clear below), no v2 frame.
- **grilling** (`raw`, `grill`, `turned`, `charred`). Flaws: the ring's left edge runs over the chunks' left edges; at
  level 4 (4 spots) neighbouring rings nearly touch; the turn icon sits on the grill's back rim; the first skewer
  goes to the leftmost spot, not the middle; a charred vegetable is its grilled chunk darkened, so charred tomato
  and charred meat look alike. Right: each skewer lies across both bars with its handle off the front edge; raw →
  grilled chunks swap on the first turn (no drawn marks over them); a skewer left too long goes onto the plate
  dark (charred).
- **plating 1–4** (`plate-N`). Flaws: 3–4 skewers still make a busy plate (the drawn skewers are close); plate chunks are
  smaller than on the grill; `plate-0` (before the first skewer) has a faint seam; the phone l4 run shot plate-4 ✓
  but the earlier phone run skipped it (a timing gap in the shooter, not the game). Right: each skewer lands on its
  drawn line with the handle off the plate to the right; the j-th skewer keeps its place as more arrive.
- **right serve** (`taste`, `praise`). Flaws: the face hides the plated skewers' tips; "Shabash!" sits between the grill
  and the face. Right: the face over the plate, whole, on laptop and phone (phone: ~18 px from the top edge).
- **wrong serve** (`not-quite`, `redo`). Flaws: none new; the plate flashes back to empty as the skewers fade. Right:
  a gentle frown, then the redo starts at threading with an empty rack and plate.
- **end screen**. Flaws: on phone the words card overflows its box at level 4 (the 10th card is cut, over "Again");
  the card says *hakro* where the order said *hakri*: both the shared results screen. Right: the words heard.


## 5. Levels 2–4 notes

- **Level 2** (two skewers, grill level 1): *ba lakri tameto* / *hakri lakri dungri, hakri lakri gos*. Works. Some chips
  are already speaker-only at levels 1–2 (onion in one run, tomato in another): that's `Cook.labelMode`, the shared
  per-word label state, not a level rule, and it reads as inconsistent when two chips differ.
- **Level 3** (two or three, one or two mixed, grill level 2, 3 spots): every chip is speaker-only (by design), the
  card rows hide the count (Q7). Works; with two mixed of one mix the card shows one list, which is right.
- **Level 4** (three or four, two mixed, often two different mixes; thread level 2 with the decoy potato; grill level
  3, 4 spots): works. Flaws: the potato heap is small diced potato beside chunky heaps; the order card gets long (on
  phone it fills the sidebar); with an order of 4, one wrong skewer fills the rack and forces a redo (§1).
- The juggle (both jobs at once) stays off at every level; not tried.


## 6. Open for Zafar

- **The plate's skewers are drawn close together** (about 50 px apart on the 600 px plate), so chunky pieces overlap
  there. The code shrinks them to 0.74 and staggers alternate skewers; a plate picture with the skewers fanned about
  twice as far apart would let them stay full size (the code places pieces on whatever lines are measured).
- **A 5th rack slot at level 4** needs a `rack-5` picture (see §1).
- **The empty plate** (`plate-0`) is patched from plate-1: a faint seam where the skewer was, only seen before the
  first skewer lands. A clean empty plate from the same sheet would replace it.
- **The decoy potato** has no chunky sekelo piece (its heap is samosa's diced potato, its piece the old sprite).
- **The threading board** is still the old board art (not in K1–K11).
- **Phone end screen:** the words card overflows at level 4 (shared results screen).
- **The end screen's word card says *hakro*** (the counting word's base form) where the order said *hakri lakri*:
  the shared results card, not this station.

## 7. New placeholder words

None. No new Kutchi; no new English words on screen.
