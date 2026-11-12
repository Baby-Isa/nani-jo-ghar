# s19-clean-c2: daar, samosa, maani, sekelo, round two (12 Nov night)

Opus, high. Branch `s19-clean-c2`, never pushed. Flaws first.

## Flaws and open
- **Not zero.** L1-L4 at 740x320 and 1280x665: **78 → 111 breaks**, 31 → 30 of 32 ends. Mine and not fixed: 36 (a light opens a step with no call: maani's roll board and tray light, sekelo's first bowl), 106, 70, 78, 92, 107, and 102 (sekelo: a rack skewer glows after its first-time light has closed; `grill.js` `placeLit` reads `lights["grill-place"].h`, never cleared; the fix is `&& !h.over`, not applied after the proof).
- **The numbers swing with the load** (25-29 on 4 cores): the same code gave 149 (with `checks.mjs` running beside it: void) and 111; three of those pages alone gave 8 (before: 12). The checks that time a child (106, 70, 78, 36 at a stuck help, 112 on a help light) carry most of the rise.
- **Sekelo L3 and L4 at 740x320 time out at the grill** (before: L4). Measured on L4: threading 59 s at 740x320 against 29 s at 1280x665; then 75 taps on the tray's first skewer move nothing (at 1280x665: 46 taps, 45 s, done). Not the piece cards; the cause is not found.
- **No deep tray exists.** The trays are the kit's steel tray (the deepest drawn) cut by its corners and rims to a square (`GrillKit.trayTex`: nothing stretched, the floor repeated and mirrored, the walls' shade in code). A deep square tray belongs in the next art run.
- **Same size everywhere costs the grill.** Four upright skewers at the grill's size need each tray the grill's height and about as wide, so the two trays stand side by side left of the grill (the mock stacks them; stacked, a same-size skewer cannot fit). The grill is about 27% smaller than round one's at 1920x1080; contract-115 measures it alone (the checks').
- **SAM-35 at L3-L4:** the headline writes block 1's count; block 2's ("ne hakro samosa") is spoken only, now its samosa card is gone. A question for Zafar.
- **Findings 1 and 7** are proved by code, not a frame (the sandbox's player lets go at the count, on the canvas).
- **check-change not run:** its dry run sums 195 min of steps at normal load; every run here took twice its time. **Runs: 2.1 GB** (over the 1.5 GB asked; the frames of the evidence runs are deleted, their probes kept).

## What changed
| row | what | where |
|---|---|---|
| SEK-26 | Grill v2; each skewer tip on the far rim, handle on the near rim, the wood off the grill; two deep trays of the grill's height, raw then cooked; the v4 skewer on board, trays and grill at one size; the walnut board stood up at its own shape | `grill.js` (`layout4`, `rackDeep`, `drawStickV4`, loader), `thread.js`, `grill-kit.js` |
| ART-79 | Sekelo loads no old rack, stick, oak board, enamel plate, v3 grill or s08c trays. Every flow's pictures, old and new: `build/reports/s19-clean-c2.art79.md` | loader; prefetch (shared) |
| ART-78 | The stone band recut on its canvas (1593x292): its own ground's key, no specks, a softened rim; pink at the edge 2,691 px → 0; `artcheck` passes it | `s19_k3_cut.py --only ST` |
| SAM-35 | "Muke ba samosa khape." (the engine's); the fillings' cards only | shared |
| finding 1 | A let-go under the count never ends the stir; the stuck help covers a stall | `stir.js` |
| finding 4 | The kit's finger (`Coach.demo`) with the fry's knob, samosas and lift, and maani's flip | `samosa.js`, `maani-line.js` |
| finding 6 | The stir game asks a speed at every level, switches at L3; daar `exact` | `stir.js`, `daar.js` |
| finding 7 | `pointerupoutside` ends a stir | `stir.js` |
| finding 8 | Maani's moment card goes with shutdown, destroy and stage end; seen once played | `maani-line.js` |

## Breaks by owner (L1-L4, two sizes)
| owner | before | after | after, by check |
|---|---|---|---|
| s19-clean-a | 49 | 52 | 114 samosa's heaps 19, 115 grill alone 8, 37 gos and plurals 8, 30 piece cards' count 6 (finding 5), 96 maani's boil 4, 105 3, 72, 73, 112 |
| s19-clean-b (daar's chop) | 14 | 18 | 115 5, 116 3, 36 3, 104 3, 65 2, 114 2 |
| mine, timed | 7 | 27 | 106 8, 70 6, 36 at a stuck help 6, 112 on a help light 3, 78 2, 53, 107 |
| mine | 8 | 14 | 36 11, 102, 112, 116 |

Round one's post-merge rise (29 → 82, four sizes, L1) is gone: 33 today, mine 4 (maani's 36 ×3, sekelo's ×1).

## Lines for files I don't own
`build/reports/s19-clean-c2.shared.patch` (applied, uncommitted, in every run here):
- `data/cook.json:1964` `"blockHeads": false` (SAM-35); sekelo's `prefetch` (`:5634`-`:5710`): the old rack, stick, oak board, enamel plate, v3 grill, racks, pieces and `tray-steel-long` out; `v4/kit/grill-v2`, `v4/kit/tray-steel`, `v3/samosa/board` in.
- `js/cook/ui.js:3209`: a block's head card only when `blockHeads` is true.
- `build/tools/art/artcheck-known.json:495`: drop the stone tray (it passes now).
- `build/test_shared_w1b_card.mjs:55`: the SAM-23 test becomes SAM-35's.
- **s19-clean-b:** `data/stations/corn.json:476` → `assets/cook/items/v4/kit/grill-v2.webp` (finding 9; the load check fails corn without it).
- **Next art run (ART-79):** sekelo's cards still load `mishkaki-*-raw-t`, `skewer-empty-t`, `vessel-katori-t`, `veg-bataato-cubed-v2-t` (shared data); samosa's fill heaps are `v3/samosa/fill-*` though `v4/samosa/{kheemo,dungri,vatana,kothmir}` exist (not swapped: they want an eye); daar's knife (chop); hobs, flames, maani's discs, tawa, turner: no v4 yet.
- **Mum:** none new.

## Proof
- Before, played first, the untouched tree kept as a snapshot: `build/screenshots/brief/s19-clean-c2/<ROW>/before/`; `s19-clean-c2-before`: 31/32 ends (sekelo L4 740x320 timed out), 0 page errors, `CONTRACT FAILED: 78 breaks`.
- After: `build/screenshots/brief/s19-clean-c2/<ROW>/after/` (SEK-26, SAM-35, ART-79, ART-78, DAAR-36); `s19-clean-c2-after2`: 30/32 ends (sekelo L3, L4 740x320), 0 page errors, `CONTRACT FAILED: 111 breaks`.
- Four sizes, five flows, `s19-clean-c2-contract`: 20/20 ends, 0 page errors, `CONTRACT FAILED: 33 breaks`.
- Findings 4 and 6: the fry logs the finger at `fry:ctl-fire`, `ctl-fry`, `ctl-lift` (before: none); the stir game at L3 says "aste thi" and "Hane jaldi!" (before, `s19-clean-c2-review-before`: neither).
- `checks.mjs`: 12 of 13 steps ok; unit 6 fail, 3 with the shared lines: the art-block tests, failing on the base tree too (sparse checkout). LNG-09 passes alone (load).
- `loadcheck`: my four pages ok; corn FAIL (the line above).

QA: builder only · checks ✅ but the base's art-block tests · contract ❌ (owners named) · LNG ✅ engine only · CMP ✅ the kit's tray, shadow and finger.
