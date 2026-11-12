# s19-clean-a3: the a2 review's findings, the d review's chai leak, the mini-card pop-up (12 Nov)

Opus, high. Branch `s19-clean-a3` (integration 9f6d2b0e7 merged), never pushed.

## Flaws and open
- **Not done, too big for this session:** the later list (`build/reports/s19-fixlist-after-night.md`): chai's 19 rows and the 30 shared kitchen rows, untouched. Of the brief's leftover rows only part of SH-249 (lesson lights, the knife's light) is done; SH-232, -152, -230, -237, -60, -178, -251, -267's L1 pages and contract-36 are not.
- **The pop-up past the 14 px floor at 740x320 scrolls its row of cards sideways** (as the panel's row does), so chai L3's six cards are not all in one view there; each card is scrolled in as it is said. Zafar should see it.
- **At the floor the pop-up's face is 2.2 times the panel's** (was up to 4): the open card's left is mostly white at 1280x665.
- **contract-112 judges a lesson's light as a part of its card** (`data-light="part"`); at 740x320 that box still runs 2-3 px over the word above the dots, now unjudged.
- **check-change not run** (about 3 h); the evidence `--after` has no rows to play (the brief's `rows` is empty: no before folders).
- **contract-104 5** in the last pop-up run (blank cards while loading, the machine shared with s19-clean-e); 0 in the after run.
- **Line for s19-clean-e:** `eggs.js:1111` (the d review's 4): `serveWrong(…, dish, …)` in place of `0`. `lab/wrong-order.html:58` still types "ba khun".
- **contract-44, samosa (5): my reading for s19-clean-e.** STD-D1-02 (Zafar 30 Oct, SH-141): "a finger only for a drag, hold or swipe"; a tap's light has no finger. Samosa's fry finger is a tap (`gesture: "tap"`), so the check is right and the finger is against the standard. Not removed: a question for Zafar ("samosa's fry knob and lift: keep the tapping finger with the light, or the light alone as chai's?").
- Missing Kutchi: eggs' "boiled egg" (grey, on the sheet).

## What changed
- **a2 review 1 (high):** the pop-up ends with Cook's own lifetime (`o.onEnd: Cook.life.onEnd`), not only a stage end; a cut pop-up returns `cut`, and `NjgServe.round` never goes on from it (no redo, reset or `H.end` against the next game). Test: leave mid-pop-up, then a later stage end wakes nothing.
- **2:** contract-115's set is sekelo's grill and its trays only, by key; three small hobs and a tray are red again.
- **3:** a tap ends only the beat in flight; a wrong row's line is never cut. **4:** the open card's words never under 14 px; contract-118 measures them.
- **5-9:** unasked things filed under the card's person, only sayable ones make a card red; maani's unasked kind its card's crossed row (never chaat's bowl); the L1 dish card's word is its picture's; the veil follows a resize; only a drag holds the item row; a tap finger with no light coming waits 0.6 s; the test player's cover read and fast-path count; contract-94's placeholder is the whole slot; the sandbox browser reaches no other host on any page.
- **s19-clean-d's lines:** the pop-up's card in the 6 Nov item cards (contract-100 0); `Onboard.gesture` keeps a tap a tap; `faceKit` measures each token once per sample.
- **Zafar, 12 Nov morning:** the asker's items as the order card's mini vertical cards in one row, ticked or crossed in place; the unasked spice its own crossed card; right orders unchanged.
- **d review 1-2 (chai, non-negotiable 4):** `chaiExtra`: the asked spice is shown when in the cup, scored right (ladder, first-try list, pill) only with nothing unasked beside it; an unasked spice alone costs the asked row (or the first) its first try. Test red on the old code.
- **d review 3:** the grill's 1/30 s cap back to 0.1 s: with faceKit fixed, sekelo L3 and L4 at 740x320 end (twice; L4 at 1280x665 too), 0 breaks.
- **Checks:** contract-105 lets the knife's swipe light off its centring (STD-E2-08a).

## Proof
- After, every kitchen flow L1-L4 at 740x320 and 1280x665 plus chai and eggs serve-wrong (`s19-clean-a3-after`): 92 of 92 ends, 0 page errors, `CONTRACT FAILED: 118 breaks` (before, a2's after: 163). By check: 112 13→6, 72 8→6, 105 5→3, 100 4→0, 44 11→5, 113 6→1, 102 5→0, 106 3→0, 70 8→5, 78 7→4, 115 5→7 (two new shelf items, the games'); 111, 36, 79, 99 unchanged. Left, mine: 112 (chaat 3, chai, chop, daar), 72 (chaat 3, chai, daar, sekelo), 36 (baking 6, chaat 3, chop 2, maani), 79 and 99 (chai). The games': 111, 37, 114, 117, 70, 78, 115, 105 (chaat 2, samosa), 119 (chop 2), 107 (corn), 44 (samosa, above), 83, 53, 65.
- The pop-up as Zafar will see it, chai and eggs L3 (`s19-clean-a3-wo2`): 4 of 4 ends, contract-118 0, contract-100 0: `build/screenshots/sandbox/s19-clean-a3-wo2/cook-{chai-tray,eggs}-l3-serve-wrong/{740x320,1280x665}/c##-s19wo-open.png`.
- Four sizes, L1 (`s19-clean-a3-contract`): 44 of 44 ends, 0 page errors, `CONTRACT FAILED: 79 breaks` (a2's: 44): 36 17, 111 15, 119 9, 106 6, 114 6, 117 6, 104 5, 92 3, others 1-2. The rise is in timing checks (36, 106, 119's flash held 150-220 ms, 104, 117) on a machine at load 11-13 with s19-clean-e's runs; not yet shown to be load: rerun when quiet. Chop's dish card never flashes (119, all four sizes, as before).
- `checks: 13 steps in 199 s`, all ok; bad runs and the a3, a2 and contract-wo tests: 57 pass, 0 fail.
- Tests: `build/sandbox/s19-clean-a3.test.mjs` (9).

QA: builder only · checks ✅ · bad runs ✅ · contract ❌ (owners named) · check-change not run · LNG ✅ (no Kutchi written; the engine's words only).
