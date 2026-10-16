# s07-cook

Branch `worktree-agent-a6c26c04351921cf0` (from 8380d33f). Only js/cook, data/cook.json and new files in assets/cook changed.

## What changed
- **K1 master (CK-44, SH-91, ART-21).** K1 upscaled ×1.367 (Real-ESRGAN, uniform scale), moved 126 px down so the island's back edge is at core y 608. 177 px of the wooden front are trimmed; the ceiling above is the top row, blurred. Trays re-measured at 350/803/1258, y 662. `fitBg` draws it 1:1. `occluder()` and `trayFront` cut from the same picture at the same place (`Cook.serviceFrame`). Past 2.33:1, the master's edges carry on.
- **Nani N1–N5 (ART-13, ART-10, ART-19).** One canvas, one uniform scale (head 186 px). The marble is cut away and her forearms rest on the counter's back edge (way (a)). N2, N3 and N5 are head layers registered by ECC; N4 is registered whole. N5 is an idle blink.
- **DP1 (DAAR-05, CK-06).** What went in (onion, tomato, chilli, paste) stays on the daar and turns with the stir. The fast-stir layer no longer shows curry leaves.
- **PT1 (ART-11).** Whole potato and cube pile at the chop. The chaat jar is recoloured to PT1's matte cream.

## Proof
- CK-44 crops, before/after, ×2: `/tmp/claude-0/-home-user-nani-jo-ghar/e8c41a29-f924-5d5e-910b-747f89d3189b/scratchpad/cook/ck44-zooms.png`. Before has a seam at 1130×412; after, no seam at any size. Full shots and served trays are in `…/scratchpad/cook/shots/`.
- Evidence `ev-s07-cook`: ART-13 passes by machine. DAAR-05, ART-11 and CK-21 are for the judge.
- Sandbox (daar, day1, title, chai-tray at 1366×768): contract passed, 0 new findings.
- Checks: static, leak and load pass. **One unit test fails:** artcheck's bg rule wants every bg at exactly 1600×900. Fix: in `build/tools/art/artcheck.mjs:42`, add `&& !/-master-v\d+\./.test(p)`.
- shotdiff: there is no approved manifest here. 179 rows are listed; only the rows above and the contract run were rechecked.

## Not done
- **SK2:** skewers sit 0.1 of their length apart against chunks 0.19 wide, so 4 skewers would turn into a pile. Needs a redo.
- **CP1:** the judge failed it; its streams read as syrup and its tilts barely differ.
- The garlic slices in daar stages 3–5 were there before.
- Overnight-log line: `16 Oct s07-cook: K1 master (CK-44 seam gone), Nani N1-N5, DP1, PT1; SK2/CP1 not wired; artcheck needs the master exception.`

## Rows
CK-44 and ART-13/10: built. ART-21: Zafar's eye. SH-91: kitchen done. DAAR-05, CK-06, ART-11: judge. SEK-14, CHAI-08: still waiting on art.
