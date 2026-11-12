# s19-clean-b: chai, eggs, baking, corn, chop, chaat and the pantry (11-12 Nov)

Opus, high. Branch `s19-clean-b` (integration merged three times, last 15ba40826+), never pushed. Flaws first.

## Flaws
- **The after runs carry my three shared patches, uncommitted** (flow.js, coach.js, cook.json: the lines below).
- **check-change not run** (its dry run: 235 min, at load 18-33); the runs below cover its play. The before run's raw evidence went
  for disk, so `--before --check --reuse` cannot run; its panels are in the brief folder.
- **CHAI-111 not reproduced** in 5 tries (lab host, New player, 1480x750 to 736x750, Play again, 40 s idle, base, main, branch): the
  hint came at 7 s each time. Nothing fixed.
- 4 before pages were cut short (corn L1, baking L3); baking's last fixes postdate the L1-L4 after run (the four-size run has them).

## Rows built (before | after: `build/screenshots/brief/s19-clean-b/<ROW>/{before,after}`, 740x320 to 1920x1080)
- **CK-72** baking: fixed measures only, in the jug at every level (L1 a cup and a half; L2 +two cups, a quarter; L3 +three quarters,
  one and a half; L4 +two and a half); no "a little / a lot / a little more"; salt is a decoy only. Kutchi from the engine ("Hakro cup
  atto wiji chad!", "Ba cup…", "Adh paani…"); a quarter, one and a half, two and a half: the sentence in grey English (`Lang.toRecord`).
  Three quarters waits for its lexicon entry (its plans skip till then).
- **PAN-19** Nani comes to the counter and says her list, each card appearing as she says it; her box "Bring these from the pantry".
- **PAN-20** every jar its pill by the word ladder, per-row scale, on the shelf's front edge; reveal lessons (SH-60, contract-98 1→0).
- **CK-83** the chop's first light waits for the vegetable and takes in the kit's hand (contract-112 on chaat's chop 1→0 at 740x320).
- **CK-85** chaat's potato, chickpea and sev scatters wired (k3).
- **CK-84 / ART-52** baking's jars by size class on the shelf line; the three walnut-lid jars at three heights (flour L, sugar and salt
  never under their class); the pill fades while its jar is up; the four glass jugs and the word moment's jug are v4.
- **SH-245 / SH-256** chop: band slots to 200 px (ginger, potato at class height); a slow frame never jumps a hop (contract-114 chop
  5→0). The lying chilli stays: a check fault (below). Probes: SH-245/SH-256 folders (their probes play daar, maani, corn, eggs).
- **CK-54** contract-74: 0 before, 0 after, 0 in the four-size run; not reproduced.
- **Eggs** contract-78 4→1: the first call held through the lessons, the fried egg's lift its own first light.
- **CHAI-109** the third card's light 0.5 s longer (needs coach.js's `o.ms`; moot if s19-clean-a's SH-261 drops the card light's timer).
- **CHAI-110 (corrected)** first L4 round: full then half (cook.json); no light before the full glass's first tap; then the glass's light
  until the second. Frames: `sandbox/s19-clean-b-chai-before` | `s19-clean-b-after`, cook-chai-tray-l4.
- **CHAI-112** the pour's light: the kit's rectangle on the glass, no ring on the pan, a returning player's only after the hint wait; the
  pan still pours. Frames: `s19-clean-b-chai-before-ret` | `s19-clean-b-after`, chai #returning (the player pours before any hint).
- **CHAI-108** logged (boil.js `green-window`). Open-to-open gaps between two pans' greens, test speed 3, child's time x3: L2 8 s (24 s),
  L3 12 s (35 s), L4 10-13 s, once 2 s (6 s). **Proposal:** keep L3-L4; at L2 hold the second pan's heat below its green until the
  first is turned down, so a new player never meets two greens at once. Nothing built. Found: at 740x320, L3-L4 and #returning, the
  tester's knob tap misses the green repeatedly (7-9 boil-overs at L4): chai L4 740x320 times out before and after.
- **ART-79** corn's grill-v2, baking's v4 jugs. Old with no v4 piece (next run): baking's oven, cat, milk/water/yoghurt/ghee jars; eggs'
  skies, flames, hob; chop's board; the pantry's bg and jugs; chai's s14 pans and glasses (his reference); the cards' f-* (cook.json).

## Check breaks, before → after (L1-L4, 740x320 and 1280x665, same checks)
| check | chai | eggs | baking | corn | chop | chaat | pantry | all |
|---|---|---|---|---|---|---|---|---|
| 18 |  |  |  |  |  | 0→2 |  | 0→2 |
| 24 | 4→0 | 0→1 |  |  |  |  |  | 4→1 |
| 36 | 4→2 | 7→1 | 14→14 |  | 16→5 | 19→22 | 14→12 | 74→56 |
| 37 | 1→0 | 1→2 | 6→8 | 5→6 |  | 3→3 | 1→3 | 17→22 |
| 53 |  |  | 2→2 |  |  |  | 0→1 | 2→3 |
| 65 |  |  |  |  | 10→3 | 1→0 |  | 11→3 |
| 70 | 3→1 | 6→5 |  | 4→7 |  |  |  | 13→13 |
| 72 | 1→1 |  |  |  |  | 3→4 | 2→1 | 6→6 |
| 73 | 1→2 |  |  | 1→1 |  | 1→0 |  | 3→3 |
| 78 | 0→1 | 4→1 |  | 0→2 |  |  |  | 4→4 |
| 79 | 1→0 |  |  |  |  |  |  | 1→0 |
| 82 |  |  |  |  |  |  | 1→0 | 1→0 |
| 83 | 1→0 |  |  |  | 0→1 |  | 1→0 | 2→1 |
| 92 |  |  |  |  |  | 4→2 | 2→1 | 6→3 |
| 98 |  |  |  |  |  |  | 1→0 | 1→0 |
| 99 | 2→3 |  |  | 0→1 |  |  |  | 2→4 |
| 102 | 2→1 |  |  | 2→0 |  |  |  | 4→1 |
| 104 | 13→0 |  | 0→2 |  | 1→1 |  | 1→0 | 15→3 |
| 105 |  |  | 1→2 |  |  | 1→2 | 2→1 | 4→5 |
| 106 | 4→3 | 5→7 | 2→2 | 5→6 |  | 1→1 |  | 17→19 |
| 107 |  | 0→1 |  | 0→1 |  | 1→0 | 2→0 | 3→2 |
| 109 |  |  |  | 1→0 |  |  | 16→16 | 17→16 |
| 111 | 58→0 |  | 0→22 | 27→0 |  | 27→1 | 0→1 | 112→24 |
| 112 |  |  |  |  |  | 0→1 | 0→1 | 0→2 |
| 113 | 6→7 | 13→12 |  |  | 0→2 |  | 0→2 | 19→23 |
| 114 |  |  |  | 9→6 | 5→0 | 1→0 |  | 15→6 |
| 115 | 3→3 |  | 8→16 |  | 10→3 | 3→4 | 0→1 | 24→27 |
| 116 | 1→0 | 1→0 | 1→0 | 1→2 | 2→2 | 2→1 | 0→1 | 8→6 |
| all | 105→24 | 37→30 | 34→68 | 55→32 | 44→17 | 67→43 | 43→41 | 385→255 |

Pages: before 56 (51 ends: 4 cut by me, chai L4 740x320 timed out), after 58 (57 ends: the same chai page), 0 page errors either way.

Left, by owner. **s19-clean-a (shared or check):** 36 (an order line that reveals its card, baking's and the pantry's, is not a call:
contract-89 forbids one; the skip window is 1 s), 37 (reads baking's card before its rows reveal; a "no" topping counts as a decoy,
CK-49; the pantry's upper shelves), 115 (a LONG thing, the chilli, is judged on its height, `contract-s19b.mjs:261`; baking's jug is a
work tool like the bowl, add `bk-jug` to `NOT_MAIN` :239; chai's hob with its tray), 111 (judges a jar lifted over the jug, and things
before their step takes taps), 113, 106, 72, 99, 116 (shared card, menu and light-goes), 104 (`f-*` card pictures, cook.json), 53
(a short jar with its pill), 105 (the swipe and the card lights), 70 and 78 (a call skipped behind the helper), 109 (painted shelves).
**Zafar:** corn's 114 (the cob on the plate). **Machine:** 65 (frames over 250 ms at speed 3).

## FIXED-IN-CODE rows, by their check in the final runs
Pass: CHAI-35, -36, -37, -42, -48, -66, -77, -91, -102, CK-45, -53, -57, -59, -61, -62, -63, -64, -77, -80, -86, CHT-18, PAN-04, PAN-22.
Fail: CHAI-49, -56, -60, -83 (78 x1, L2 "Slow kar!"), CHAI-58 and CK-65 (70), CHAI-89 (115, the hob), CHAI-19, -65 (113: the side
menu), CHAI-104 (73: the bubble's speaker 47 px), CK-76 (36 x3), CK-78 (113 x2), CHT-19 (36). Not run: the evidence-probe rows.

## Proof
- Before (base 3c80c8aa4 served from a snapshot, `NJG_GAME_ROOT`): `build/screenshots/sandbox/s19-clean-b-before/`: CONTRACT FAILED:
  385 breaks. After: `s19-clean-b-after/`: CONTRACT FAILED: 255 breaks.
- Four sizes, L1 (`s19-clean-b-contract`): 28/28 ends, 0 page errors, `CONTRACT FAILED: 68 breaks (contract-102 1, contract-70 2,
  contract-36 19, contract-106 2, contract-112 1, contract-37 8, contract-104 1, contract-111 10, contract-115 3, contract-11 1,
  contract-109 9, contract-53 3, contract-114 5, contract-80 1, contract-92 1, contract-107 1)`: each kind named above.
- Evidence: before and after in `build/screenshots/brief/s19-clean-b/` (11 rows, every probe reached its moment). Next:
  `evidence.mjs --judge --brief build/tools/ops/specs/s19-clean-b.json`.
- checks.mjs: every step ok but `words` (my seven baking literals, since moved to the settings: 0 left) and `load` (not run here).
- Chai rows: `s19-clean-b-chai-before` (L1, L4, #hint), `-chai-before-ret` (#returning) on the base | `s19-clean-b-after`.
- QA checklist: 0 page errors and every end but chai L4 740x320 (as before); the contract kinds above; leak bots ok; check-change not run.

## Exact lines for files I don't own
```diff
# js/cook/flow.js (PAN-19): runOrder, after `await serviceView(null);` in the `who === "nani"` branch
+      if (UI.guideFor) UI.guideFor("fetch");
# js/cook/flow.js openCard (~:1838)
-      const people = asker === "nani" ? [] : [...new Set(...)];
+      const people = asker === "nani" ? ["nani"] : [...new Set(...)];
       if (asker !== "nani" && !people.length) people.push(asker);
+      if (asker === "nani" && UI.guideFor) UI.guideFor("fetch");
-      const came = people.filter((w) => w !== "nani" && Cook.CHARS[w] && ...
+      const came = people.filter((w) => Cook.CHARS[w] && ...
# js/cook/coach.js cardLight (~:957) (CHAI-109)
-        ms: (R ? R.pointMs() : 0) / speed(),
+        ms: (o.ms != null ? o.ms : R ? R.pointMs() : 0) / speed(),
# data/cook.json recipes.chai slots amount byLevel[3].teach.seats (~:1095) (CHAI-110 corrected)
-          "seats": ["ph-half", "ph-full"]
+          "seats": ["ph-full", "ph-half"]
# data/cook.json recipes.baking.how (:826) (CK-72)
+ "how": "Nani says one amount at a time: a cup, half a cup, two cups, a quarter. Tap it to tip it into the jug. Then bake the naan."
# js/cook/index.js:83 (CK-72)
+  ["baking", "Baking (prototype)", "Nani's amounts by the jug; then the oven"],
```
- data/lang/lexicon.json (CK-72), a new entry: `{"id": "n.three-quarters-of-a-cup", "pos": "N", "gender": null, "gloss": "three quarters
  of a cup", "glossPl": "three quarters of a cup", "status": "to-record", "src": ["CK-72 (Zafar, 11 Nov): baking's fixed measures"],
  "aliases": ["ph-cups-34"], "ask": {"word": ["new"]}}`; then the recording sheet (`node build/tools/ops/recordings.mjs`) lists it.
- Recording sheet lines (grey English now): "Put in a quarter cup / three quarters of a cup / one and a half cups / two and a half cups
  of <flour, water, milk, yoghurt, sugar>." Mum may also prefer "aako cup" to the engine's "hakro cup" for a whole cup.
- Docs: the baking design doc's "a little / a lot" lines follow Zafar's 11 Nov answer (CK-72).
- CHAI-111, for a check: a lab-host path that plays L1 as a New player, resizes to 736x750, Play again, idles 30 s at the water and
  expects a `help` note within the level's wait; and the play log could note what bumps Nani's idle clock (`js/shared/guide.js:127`:
  wheel, key, pointer), so his next log shows why a hint did not come.
