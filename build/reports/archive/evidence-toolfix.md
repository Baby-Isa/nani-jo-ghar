# Evidence tool fixes (s04-tf, 12 Oct): the 168 tool failures of ev-s04-ev1

Goal: drive the evidence loop's tool failures to (near) zero without touching game code. Only `build/sandbox/**`, `build/tools/review/**`, `build/sandbox/data/evidence.json` and the format note in `docs/architecture/evidence-loop.md` changed.

## Counts

| | rows |
|---|---|
| ev-s04-ev1 tool failures | **168** |
| after ev-s04-ev2 (the 168, plus 7 rows whose blank `start` shots passed by mistake: 175 rows, 237 pages) | 34 |
| after ev-s04-ev3 (those 34) | 3 |
| after ev-s04-ev4 (those 3) | **1** |
| now obsolete (the game no longer has the state; listed for the row owner, no page) | 3 rows, plus 5 single probes dropped |

Latest outcome of the 175 rows (each row's newest run): 119 for a reviewer, 34 machine PASS, 18 machine FAIL, 3 obsolete, 1 tool failure. Rows' newest runs: ev-s04-ev2 141, ev-s04-ev3 31, ev-s04-ev4 3.

Run output (this machine only; `build/screenshots/evidence` and `build/screenshots/sandbox` in the worktree are symlinks to it): sheets and `.md` under `/dev/shm/njg-tf/evidence/ev-s04-ev{2,3,4}/`, page data and crops under `/dev/shm/njg-tf/sandbox/ev-s04-ev{2,3,4}/`; the indexes are `build/reports/evidence-ev-s04-ev{2,3,4}.md`. Not judged yet: `--judge` runs per run id.

## The 168 by class (each row counted once, by its main cause)

| class | rows | what was wrong | fixed by |
|---|---|---|---|
| (a) page not played | 5 | PAN-01, MAA-03: the page crashed (load timeout, a closed page) under load; SH-46, MAA-13, CLN-101: pages kept from an older spec by a resumed run | a rerun (PAN-01 844x390 crashed again in ev2, passed in ev3) |
| (b) a moment that never came | 92 | see "Moments" below | spec moments and tool rules |
| (c) a want no seed gave | 24 | `want` was English ("two potatoes", "three skewers", `{people: 2}` read as the text "2"), and it was read once at `life:request`, before the card was up | wants in the order's own words, decided once shown and said; dropped where the level fixes it |
| (d) wrong selector or texture key | 44 | texture keys and classes the game no longer has; elements that show only at some moments of an `every:` probe | spec selectors, two tool rules |
| (e) obsolete | 3 | CLN-16, CLN-92, CLN-41 (below) | `{obsolete: why}` entries |

## What was wrong, and the fixes

**Tool (lib/evidence-probe.mjs, lib/evidence.mjs, lib/moments.mjs, run.mjs, review/evidence.mjs).**
- `page:start` is logged before the flow opens its page: every `at: "start"` captured a blank tab (25 rows crashed on "execution context destroyed"; 7 more, CLN-10, CLN-17, CLN-25, CHAI-08, ART-13, FL-02, CLN-110, "passed" with blank screens the reviewer flagged). `page:start` now answers only itself, and a whole-screen shot of one flat colour is refused like a blank crop.
- An `every:` probe's capture that worked at some moments is evidence there and a note at the others (a count badge only while counting, a bubble only while someone speaks); its expects decide on the moments their thing was on screen.
- A `dom:` capture of a visible element with no words says so instead of failing (picture cards, icon buttons, an empty guide box). `lexicon` on no words is undecided, not a vacuous PASS.
- `after` and `at` may be the same moment: `after: "bulb", at: "bulb-english"` never fired because rec:bulb-english armed the probe and was then skipped (SH-52, SH-57, SH-41, SEK-12, CLN-106).
- Each probe captures in its own queue: a bubble's crop no longer waits seconds behind another probe's filmstrip (CLN-86, CLN-99, LNG-05). Bubbles are captured 250 ms after they are logged (they fade in).
- A probe of filmstrips or traces lets the player go on: at `heal:<step>` / `cook:<kind>` it films the move itself (the heal drags, pours and the samosa fold were stills after the move: CLN-34, CLN-46, CLN-54, CLN-104, CLN-106, CLN-108, ART-15).
- Wanted orders: `people:N` (person cards), `said:<item>` (speech only: the card is closed from L3), `/regex/`, words; read while the pop-up is up and decided at the fold or the station's start (with the spoken lines), up to 40 seeds.
- New moments: `line:<who>`, `heal:` (every heal move), aliases `pouring`, `eye-test`. `{obsolete: why, was: [...]}` entries and an `_obsolete` list; the index lists obsolete rows apart.

**Drivers (flows/, lib/cook-player.mjs, drivers/catalog.mjs).** The heal game's middle (`heal-*-mid`) came only after seven moves; the scrape, tooth and fever have four to six, so it is now also the side card's open row past half. The stir's mistake slosh is recorded even on a slow page (DAAR-12). The diagnosis mistake player at L1 plays D1 (dots), like the fair L1 flow: the point variant offers no wrong pick, so it never made one (CLN-93). `real-pace` also plays the clinic stages (their pop-up folds within a second in fast mode: SH-17, CLN-04). `cook:book`, an evidence-only flow (never in the gate), opens Nani's recipe book on a full save: the in-play step chips are gone and the title flow's book is empty (SH-28).

**Moments (specs).** The clinic logs no `life:stage-start` (only Cook's stations do): `every:rec:stage` (12 rows). Its request pop-up folds within a second: read at `popup-open`. Chai-tray's phases are not on its expectation: `exp:pour`, `kind-timing`, `cook:timing` (with `after: exp:pour` for the tipped pan). Station first screens: `view`; the lab has no service view after cooking: the station's end, or the counter's bubbles in `lab:cook/order`. Heal steps: the eye chart is `eye-test` (at L1 it opens by itself; `step:eyetest` exists only from L2). `every:step` (order-card rows) where a station has none: `every:placed` / `every:kind`.

**Selectors and texture keys (specs).** Maani `mv-pile-*`, `mv-thali`, `mv-cooked-*`; the roll part's `pin`; skewers `mk:stick`; samosa `sv3-fold-*`, `sv3-karahi`, `sv2-fry-*`; the fry part's `spr:kadai.oil`, `spr@hand:spoon`; chai `v3-pan-*`; roll-tawa's dish `chaat-bowl`; the grill plate `sk3-plate-*`; potato `veg-01`; the review face `*-v2round-256`; talkers `nani-*`; eye pills `.hs-judge .njg-pill`; the fever figure `.cl-fig`; CLN-79 is the end card's tick badge (`.rs-badges`), not the pharmacy tally; ART-16 the tick badge `.rs-disc`.

**Wants.** Chai cups are fixed by level (1, 2, 3, 3 people) and only chai has people: PAN-02, CHAI-04, CHAI-15, CHAI-18 need no want; CK-04's four people cannot come (L4 has three cups). Mishkaki: L2 two skewers, L3 one or two mixed, L4 three or four with two mixed: SEK-03, SEK-07, SEK-11, SEK-13 by level. Black tea is `dudh na|kari chai`; two potatoes `(ba|trae) bataat` (the chop's own count); two samosa kinds `said:` samosa twice; SAM-01's three chillies cannot come at L1 (two kinds share two or three spoons): any chillies. All seeds found within 1..13.

## Obsolete (the row asks about a state the game no longer has)

- **CLN-16**: decision 52: the diagnosis has no Found it and no Next at any level.
- **CLN-92**: the waiting room has no "to the doctor's room" button: it moves on by itself after the pick.
- **CLN-41**: the parked tummy, hic and hair games run on the heal host lab page with their help marked seen (else the scripted taps miss), so the old help never shows.
- Probes dropped (in `evidence.json` `_obsolete`): SH-61 p2 and SH-23 p1 (the clinic shows no ✓ or `.njg-btn` now: the heal ✓ stays hidden at every step, checked L1 to L3 and in a morning); MAA-08 p1 (the maani station shows no count badge at L1 or L2); CHAI-15 p2, p3 (maani and sekelo orders have one person).

## Remaining tool failure (1)

- **CLN-22 p3 L2** (pharmacy, the tray's outline fading as an item lands): at L2 the tray stays still for 1.8 s after the belt pick; L1 and L3 film the landing. Either the L2 item lands later or not on the counter tray; a longer strip or a later moment is the next try.

## Weak spots seen on the sheets (for the next judge, not failures)

- A bubble fading out still counts as on screen (opacity above 5%): CLN-85's first eye-game frame is the skin where a bubble was.
- CHAI-07's `canvas:pan` box is the tipped-pan sprite's whole frame, mostly marble.
- `textMatches` falls back to the spoken words when its moment never came (SAM-11 p1 L1 in ev2 "passed" so); a tool failure still wins the row.

## For the orchestrator

- Gate impact: the diagnosis mistake flow at L1 now plays D1, the stir mistake records `wrong-stir` earlier on slow pages, and the heal games' `heal-*-mid` state can come earlier: their contact sheets and states change (findings may move; check the baseline at the next gate).
- `node build/tools/review/evidence.mjs --plan --all` exits 0 (373 rows, no spec errors); `node --test build/tools/review/evidence.test.mjs` passes (12, one new for these rules).
