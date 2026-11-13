# s19-night-shared: the shared pieces' rows, overnight (13 Nov)

Branch `s19-night-shared` (from a9ccaa4fd, 14 commits), not pushed. Browser runs served a frozen copy of the branch (NJG_GAME_ROOT) on
port 8911 under its own lock. The machine's load was 35 to 46 on 4 cores all night, so timed checks suffered (see Proof).

## Done, with evidence

| row | change | proof |
|---|---|---|
| CHAI-113 | `js/shared/sfx.js`: `{under: true}` (a child's own action) plays under a family line, ducked to `Sfx.UNDER` 0.5; the knob and flame ask for it when a pan turns on from off | new contract-124: red on 33 gate pages -> 0 on s19ns-a4's 88; evidence CHAI-113 L1-L4, both sizes: 8 of 8 clean |
| SH-267 replay | `ui.js` flashSaid: an order said again from the card flashes the dish at L1 (the gate's breaks were #hint and #returning players' first order, said from the card) | contract-119: gate red on chai-tray#hint, #returning and 6 games' #hint -> s19ns-a1 clean on chai-tray#hint, #returning, chop#hint, maani#hint |
| SH-274 | `word-card.js` WordCard.flash removes an earlier copy at once | new contract-125: 0 on a4; evidence 4 of 4 clean |
| SH-278 | `ui.js`: no arrow, no open helper while the box shows an exclamation (praise; the engine's exclaim line, also under a station's "react" role) | new contract-126: s19ns-b3 (base) 10 on 12 L1 pages -> 0 on a4; evidence 6 of 6 clean |
| SH-272 | `results.js`: the end card grows from its middle until no head is half behind its top edge, on every page | new contract-127: b3 6 -> 0 on a4's final pages (2 on older pages, re-run clean in s19ns-a6); evidence 6 of 6 clean |
| SH-213 lesson | its wait moves with its light; the veil lets its taps through; a tap while it is due is held for it (contract-74 exempts it) | contract-98 4 -> 0, contract-121 6 -> 3 (gate -> a4) |
| SH-276 grey | `order-card.css`: a to-record headline is grey italic on the s14 card | a4 cook-chop 1280 07-results-words.png |
| SH-273 part | the flash has no English row (no dots), no empty picture box, waits a beat for its picture | new contract-128: 1 (chai L1 1280, before the wait) -> 0 |
| LNG-22 | Cook's day-6 finale is the birthday feast (`flow.js`, `data/cook.json`) | code; "Happy birthday!" is a grey to-record line |
| SH-238, SH-240 | already built | contract-103, -101: 0 on a4 |

Checks: `build/sandbox/lib/contract-night.mjs` (contract-124 to 128), `build/sandbox/contract-night.test.mjs` (9 tests, red then green);
all 325 sandbox tests pass, badruns.test.mjs still red where it should be.

## Left (new label)

- SH-270, rest of SH-276: **needs Zafar**: R4 (decision 55) folds her box while she asks on her own chop card (chop.js, daar.js: night-c);
  her face alone would put two Nanis on screen.
- SH-277: **needs Zafar**: eggs' headline cannot fit one line at the floor at 740x320; shrink under t4, or wrap.
- SH-279: **needs Zafar**: right of the face breaks contract-4. SH-273's English: **needs Zafar** (non-negotiable 3).
- SH-283: **not a fault?**: decoys and their order are random each play, not by size; a fixed order is a pattern (leak test).
- SH-271: never seen in any sample; needs the eye run's speed-1 strip.
- SH-237: the free pick's guided glow now hops; contract-107 still 11 (stations' own glows).
- contract-121, fetch L2-L4 740: the pantry's pop-up card sits under the canvas; the lesson moves on by itself after 1 s.
- SH-275, -280, -281, CHAI-83, -89: stations' files. SH-220, -212: one build with the loading order. SH-224: html and fonts not mine.
  SH-225: store wrapper. ART-*: **waiting on art / Zafar**. LNG-20, -21: **waiting on Mum**. Other [check] rows: by their checks below.

## Requests (files not mine)

1. `build/tools/review/lib/regressions.mjs` CONTRACT_ROWS: `"contract-124 knob-sound": ["CHAI-113"], "contract-125 one-flash": ["SH-274"], "contract-126 exclaim-arrow": ["SH-278"], "contract-127 end-heads": ["SH-272"], "contract-128 flash-whole": ["SH-273"]`.
2. `build/sandbox/data/evidence.json`: merge CHAI-113, SH-274, SH-278, SH-272.
3. `data/story/first-launch.json`: the Eid story becomes the birthday (LNG-22). Recording sheet: "Happy birthday!" for Mum.
4. SH-224: Baloo 2, Nunito, Fraunces into `assets/fonts/`; drop the Google links from nine pages.

## Proof

Evidence `build/screenshots/evidence/s19ns-ev1/` (index `build/reports/evidence-s19ns-ev1.md`), played on the final code.

Contract run, my 44 flows (11 games, L1-L4) at 740x320 and 1280x665: before = the gate (12 Nov) on the same 88 pages; after = s19ns-a4,
rejudged with the final checks. Before -> after by check:

26 4->7 · 36 2->33 · 37 10->14 · 53 3->6 · 65 2->19 · 70 5->14 · 72 3->3 · 74 6->2 · 78 4->2 · 83 2->3 · 92 3->7 · 96 1->1 · 98 4->0 ·
99 1->1 · 104 1->15 · 105 5->4 · 106 2->16 · 107 1->11 · 111 4->5 · 112 4->5 · 113 1->12 · 114 13->46 · 115 1->0 · 117 6->16 ·
119 0->3 · 120 2->8 · 121 6->3; from 0: 18 13, 24 7, 66 3, 79 3, 80 1, 82 1, 84 1, 89 1, 91 12, 102 9, 109 1, 116 11.
Total 96 -> 321. The rise is the night's load: the same night, the 12 L1 pages of eggs, corn, samosa, maani, baking and chop went 64
(s19ns-b3, base code) -> 30 (a4), the night checks 16 -> 0. Left by owner: stations' (36 calls, 37 decoys, 65 chop waves, 70, 114 item
sizes, 120 shadows, 26 chaat's "chano", 104 pictures timing out); shared, timed at 3x speed under load (106, 117, 107, 102, 113, 116,
18, 24, 91); 119: three first orders drawn 1.5 to 3.4 s after the line. None traced to this branch, except fetch's contract-121 now
finding the canvas where it found the veil (the same fault, in Left).
