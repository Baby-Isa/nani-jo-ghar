# s19-clean-a6: the shared consistency rows and the checks (12 Nov)

Opus, high. Branch `s19-clean-a6`, with c437318b9 and Mum's session (3fe6c7d09) merged in. Never pushed (the push hook asked; the brief forbids it).

## Flaws and open, first
- **check-change not run:** 38 steps, about 352 min unloaded, at load 26-34. The contract runs are the proof.
- **No before folders** (`rows` is empty). The before is the after play judged with the base commit's checks. My only game change is a log line.
- **After run, before the merge: 2 timeouts.** Chai L4 740x320 (it timed out in chai's own runs too) and sekelo L4 740x320. After the merge, 44 of 44 four-size pages ended.
- **Bad runs: 4 reds let go**, each with its reason in `expect.json` ("loosened"). Maani's 36: its skip comes 1.8 s before the chakla light, with no step between them. Corn 740x320's 115: the grill is 65%, over Zafar's 60% floor; its 56% at 1280x665 stays red. The test now refuses a loosening with no reason. Veto if you disagree.
- **Corn (your item 3), in `data/stations/corn.json`.** That file holds the live order; cook.json's corn recipe is the old one, now changed the same way. The asks are now L1 1, L2 2, L3 and L4 one per cob, with no "no". That is the only way six bowls give the table's 1-4 decoys. L4 loses its 2-3 asks and its "no": **Zafar to confirm.**
- SH-255's pantry: its painted shelves wait on PAN-06 (art), so contract-109 still leaves it out.
- SH-251: the pantry at 1920x1080 never reached its `light` key frame. Not traced.

## What changed (tests: `build/sandbox/s19-clean-a6.test.mjs`)
- **contract-36 (SH-172):** a game's skip counts from CALL_BEFORE (2 s), one skip per step. A step's light is timed by the frame-timed `lit` sample. The idle help's step line counts as the call for the light it brings (baking).
- **102 and 107:** a glow or hop that starts with its rung belongs to that light, even when the light box is painted up to 2 s late. 107 also counts a hop sampled late when the game logged its glow on that thing with the light. Rungs are timed by their own note time.
- **73:** the tap includes the speaker's `::before`. **113:** no canvas pairs judged while `.njg-wo-open` is up. **115:** 60% floor, "flagged for a look". **106:** reads the frame-timed light too. **65 and 66:** timed by each note's own time.
- **SH-240:** contract-101 holds Nani's line to Lora 500 (the probe reads its type). **SH-248:** new **contract-123**: each game draws the band its settings name (`St.stoneBand` logs it). **SH-251:** `sidebyside.mjs --reach <run>`; the order key frame falls back to the station's start (chop has no order state).
- Evidence: CK-89 at `life:baking-salt`; a probe for CHT-13.
- **Mum's code changes 2 and 5** (after the runs): the engine's English keeps "with"/"without" and says "once" (`enOf`); `ph-cups-34` is the lexicon's `n.three-quarter-cup`, *pono cup* (Mum, 12 Nov 56:08), so baking's three-quarter plans play. `data/stations/baking.json`'s gap note on it is now stale (e's). Checks 14/14 ok.

## Your item 4
- **121, pantry L2-L4 at 740x320: real.** About 3 s into the card lesson, the pop-up's veil (`njg-rq-veil.njg-rq-along.njg-rq-open`) covers the picture, and the lesson skips it as untappable (a5).
- **119 (19, every game): mostly real.** The card flashes on the `dish-flash` call, about 0.9 s before the voice starts, and is seen for 55-244 ms or not at all. Part of it is the probe's lag at load 30. It is a5's row, so I left the check. It could time the flash from the `dish-flash` note.
- **113:** only chop L4 740x320 (Nani's face over the half chilli; real). I saw no eggs or pantry 113 in my sizes and levels, so yours must come from other paths.

## Lines for others
- `build/core/band.test.mjs:22` (baking passes now): `baking: ["data/stations/baking.json", "js/cook/stations/baking.js"],`.
- e: samosa has no call when the keema's light comes (36); the keema glows outside the light (102); chaat's ph-chana is lit with no hop (107).

## Proof
- **After** (`s19-clean-a6-after`, L1-L4 at 740x320 and 1280x665): 86 of 88 ends, 0 page errors. Base checks → new checks: **421 → 354** (36 51→16, 106 26→7, 102 9→3, 107 6→2, 115 2→0, 73 1→0; 123, 101 and 109 at 0).
- **Four sizes** (`s19-clean-a6-contract`, L1, `--keyframes`, merged): **44/44 ends, 0 page errors, `CONTRACT FAILED: 101 breaks`.** 119 19, 36 14 (samosa 7, maani 4), 114 9, 107 6, 104 6, 117 6, 106 5, 111 5, 70 4, 116 4, 109 3 (baking 1920x1080, samosa); 120, 123, 101, 115 and 73 at 0.
- **SH-251:** `--reach` gave 38 of 44. After the order fix, `s19-clean-a6-sbs` (chop and pantry at 740x320 and 930x430) reaches all seven moments on 4 of 4 pages.
- `checks.mjs`: 14 ok (915 unit). Bad runs: 30 pass. Specs: lint clean.

## Breaks left, by owner
- **e:** samosa's 36, 102, 107, 117; corn's 114; the daal's 65; baking's 109; 111 in daar and chaat; 37.
- **a5:** 119, 121, 116, 18, the light timing in 106 and 117; chop's and daar's card steps (36: the call comes with the wave, more than 6 s after the card turns current).
- **Load:** 36's 2 s edge (maani 2.08 s).

QA: builder only · checks ✅ · bad runs ✅ · contract ❌ (owners named) · check-change not run · LNG ✅.
