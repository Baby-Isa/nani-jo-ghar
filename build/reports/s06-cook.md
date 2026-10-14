# S06 Cook and shared kit (s06-cook)

Runs ev-20261014-…: c97 (red), 06w, sqj, odn (green). Picture rows are for the judge.

- **SH-10**: right already; none. Green 004527-3br.
- **SH-69**: works; probe missed it. Probe at speed 1. 06w.
- **SH-81**: face tap hung off 800x360 (order-card.css); clamped. c97 → 06w.
- **CK-35**: L1 boil 1.18→1.76 s, tawa 0.92→1.42 s, ~15%/level; test_cook_levels. hyz → y12 PASS.
- **CK-07/31/32**: card folded, no wrong-row style. serve-wrong driver; OrderCard `wrong` red, card open. c97 → odn.
- **CK-21**: trayFront copied scaled bg (flow.js); copies the occluder. sqj.
- **CK-27**: puff matched its food (stations.js); white clouds, warm edge. odn.
- **DAAR-13/22**: ghost on 4 s timer; faint cut (chop.js); ghost at throw, cut along swipe, knife rests. 06w.
- **DAAR-23**: tool gap; probe at speed 1. 06w.
- **DAAR-19, DAAR-20**: not reproduced (c97).
- **SEK-13**: second skewer ticked all at once; tickPiece, peek-every-tap driver. 06w → sqj.
- **CHAI-13**: spoon under its puff; drawn over, two turns. sqj.
- **PAN-10**: L2+ box folds, tap shows fuller line (grey, to record); wording waits on Mum. Zafar: folded box adds a second Nani face (R4).
- **CK-TAB-01**: not started; each station needs a 4:3 layout (two-row shelf band, narrower stage.scenes.cook.safe): a design call.

Also: core.js localStorage fallback removed (run static.mjs --write-known after merge); 800x360 word review fixed (broken words, scroll).

Checks: checks.mjs all pass; clinic + Cook at 800x360/1366x768: CHECK PASSED, 0 contract breaks.
