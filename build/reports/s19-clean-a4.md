# s19-clean-a4: SH-268 the shadows (audit, kit helper, check), the stuck card lesson, the shared rows (12 Nov)

Opus, high. Branch `s19-clean-a4` (integration ccr-87413d9b-j48fpk merged), never pushed.

## Flaws and open (first)
- **Most of the brief's 30 shared rows are not touched in this session.** Zafar's SH-268 ask and the coordinator's four urgent items came first. Rows done before the stop: SH-173, SH-228, SH-213, SH-264's face, SH-267's dish card, the lab's "ba khun". Rows done now: SH-268 (shared part), SH-267 (chop's dish card). Already built by earlier builders, waiting on the judge's frame: SH-232 (OC.followFold), SH-234 (`--njg-itpad` max(4 px, 2.6cqi)), SH-235 (the "?" pop-up scrolls), SH-237 (the hop only on shelf things, coach.js:534), SH-252, -253, -254, -258 (s19-fixes-e, s19-wave-e2). Still open, each a session of its own: SH-230, -236, -249's rest, -141/-119 outside samosa and maani, -238, -240, -255, -259, -260, -239, -241, -242, -172, -227, -248, -250, -152, -60, -178, -251.
- **SH-268 is only partly built: the games' own pictures are theirs to shadow** (exact lines below). After my changes, baking still has no shadow anywhere. Chaat's serving bowl, samosa's spoon and its samosas on the plate, and maani's rotis also have none (MAA-09 kept the balls and heaps shadowless: Zafar to say if the rotis follow).
- **check-change was not run** (about 3 h on this machine at load 20). The brief's evidence `--after` has no rows to play (its `rows` is empty: no before folders); SH-268's before was played on the unchanged code (`s19-clean-a4-sh268-before`).
- **SH-267's L1 pages stay red: contract-119 14** (four sizes). Chop's card now flashes (it never did), but most flashes are seen for only 40-220 ms against 250 ms; the cause is not found. Mine for the next session.
- **The panel's big dashed slot for a single card still to come** is the shared SH-154 look (Zafar, 29 Oct). Sekelo stacks several of them, so it looks broken there. Kept; Zafar's call for every game.
- Load average 18-26 the whole session (four builders): the timing checks (36, 106, 117, 119) move with it.

## SH-268: how much is implemented (the audit, `s19-clean-a4-shade-before`, L1 1280x665, contract-120's probe)
| game | with its shadow | without (owner) |
|---|---|---|
| chai | tray, hob, pans, shelf jars | serving tray (mine: done) |
| eggs | bowl, pan, pot, tray, hob, jar | serving tray (done) |
| corn | grill, tray, plate, cobs, shelf | serving tray (done) |
| chop | board, onion | serving tray (done) |
| chaat | board, potato, onion, the bowls | serving bowl ct-serve/ct-layers (assemble.js, e); serving tray (done) |
| pantry | shelf jars, but centred under them, not lower right | (stations.js prop: done) |
| daar | hob, pot, trivets, katori, glass, board, spices | serving tray (done) |
| sekelo | grill, deep tray, bowls, board | serving tray (done) |
| samosa | hob, karahi, board, thali, plate, heaps, cloth | spoon, fried samosas on the thali, the folded samosa (samosa.js, e); serving tray (done) |
| maani | hob, chakla, tawa, thali | raw and cooked rotis (MAA-09: Zafar's call); serving tray (done) |
| baking | nothing | bowl, jars, jug, oven, naan tray (baking.js, e); serving tray (done) |

contract-120 at L1 1280x665: **40 before** (11 games). The after count is in the Proof section.

## What changed
- **SH-268:** `Cook.Kit.shadow(S, obj)` (kitchen-kit.js) is the one shadow: the thing's own outline, soft, down and to the right, scaled to its size, following it and hidden in flight. The same shape works for a round or a square thing. The stations' `flat()` gives it to unpainted things; the pantry's `prop()` contact shadow moves to the right of the foot; the serving trays cast it (CK-21: the dish in them none). **contract-120** (lib/contract-shade.mjs): every worktop thing held 1.2 s has its shadow, lower right, judged from a pan's round body.
- **The stuck card lesson (the coordinator, urgent):** sekelo L2-L4's row-shaped pop-up squeezed its picture to 270x0 px; the lesson lit and asked for it, and the tap fell on the veil. The fix has three parts. The lesson only asks for a part it can tap, and leaves any other as the card had it. A part that stops being tappable for 1 s is shown and the lesson goes on. `WordCard.picRoom14` shrinks the words first (never under 14 px), and if the picture still has no room the card takes its own height. **contract-121** (the part is tappable under the light) and **contract-122** (a big card's picture at least 24 px and a quarter of the card) were red on the old code.
- **Sekelo's piece rows (SEK-25)** wait with their skewer's row (they stood written before Nana said it).
- **The test player:** a rack tap waits for a grill ring due within 1 s; a timing after another step goes straight to it.
- **SH-267:** an order with no dish (chop) flashes the first thing said, with its count.
- a2's finding 4: each line timed from its own log (not looser).

## Lines for the other builders
- **s19-clean-e:** `grill-kit.js:253` and `chop.js:347`: the body becomes `return Cook.Kit.shadow(S, img, { dx, dy, alpha, blur });` (one helper; chop's then links `img.shadow`). Also `Cook.Kit.shadow(S, x)` after: `baking.js:246` (bowl), `:281` (jug, c), `:343` (jars), `:569` (oven), `:589` (naan); `assemble.js:300` (dish); `samosa.js:1382` (`im`, `{k: 0.6}`) and the spoon's picture.
- **s19-clean-chai:** chai L2's milk jar loses its shadow once put back (contract-120, view-service).

## Proof
- **Contract, every kitchen flow L1 plus chai L3 and corn L3, four sizes** (`s19-clean-a4-contract`): **52 of 52 ends, 0 page errors, `CONTRACT FAILED: 217 breaks`** (a3's L1 four sizes: 79, without 120-122). The new contract-120 gives 81: baking 46, maani 16, chaat 8, samosa 8, chai L3 3 (the milk and water jars put back), all in the games' own pictures. contract-121 and contract-122 are 0. The rest: 36 35 (samosa 10, maani 8, chai 5), 106 16, 119 14, 107 13, 114 12 (corn 10), 117 7, 24 5, 111 5, others 1-3.
- **SH-268:** contract-120 at L1 1280x665: **40 → 19** (`s19-clean-a4-shade-before` → the contract run). Chai L1, eggs, corn, chop, pantry, daar and sekelo are now 0. The evidence before and after, chop, baking and samosa at 740x320 and 1280x665: `build/screenshots/evidence/s19-clean-a4-sh268-before/SH-268.png` and `build/screenshots/evidence/s19-clean-a4-after/SH-268.png`.
- **The stuck lesson:** red on the old code: `s19-clean-a4-lesson-before` gives contract-121 'asks for .wc14-pic but it is 270x0 px', and `s19-clean-a4-pic-before` gives contract-122. After (`s19-clean-a4-sek`, with sheets): sekelo L2, L3 and L4 at 740x320 and 1280x665 reach 6 of 6 ends, with 121 and 122 at 0. L4 at 740x320 ends too, through the player's fix; it never ended before. Chai L2 at both sizes ended (`s19-clean-a4-lessonfix2`). The sekelo panel through the order: `build/screenshots/sandbox/s19-clean-a4-sek/sheets/`.
- **Evidence after** (`build/screenshots/evidence/s19-clean-a4-after/`): SH-213 4/4, SH-267 6/6 and SH-268 6/6 probes reached their moment; for the judge.
- `checks: 13 steps in 276 s`. After the two lint fixes, unit (897 pass, 0 fail), words and static are ok; the other 10 steps were ok in the full run. Bad runs, contract-names and audit, and `s19-clean-a4.test.mjs` (7: contract-120, -121, -122): 41 pass, 0 fail. The evidence specs lint clean.

QA: builder only · checks ✅ · bad runs ✅ · contract ❌ (owners named) · check-change not run · LNG ✅ (no Kutchi written; the engine's words only).
