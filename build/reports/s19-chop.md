# s19-chop: chop's hop (CK-71)

Opus, high. The chop game (cook:chop) no longer throws arcs: the round's whole things sit in their slots on chai's stone band with
their pills (Shelf.slots, St.classFit, Kit.chip), hop straight up onto the board, hang, and drop back at different times. A swipe
(or at L1 a tap) through an item that is up, its whole picture plus `catchPad`, cuts it: slice, sound, the halves land on the board
and stay, the slot fills again. A decoy swiped shakes and drops back uncut (the wrong feedback, no verdict). Each kind hops once per
bag cycle, so decoys hop as often as the wanted thing. Ring, order card, redo and end unchanged. Daar and chaat never pass `hop`:
their throws are as before (the arc code stays only on that path).

| Level | Up at once | Shelf per round | Hang | Spacing | Catch pad | Tap cuts |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 wanted, 0 decoys | 1.8 s | 2.9 s | 40 | yes |
| 2 | 2 | 1 + 2 decoys | 1.5 s | 1.2 s | 36 | no |
| 3 | 3 | 1 + 3 | 1.3 s | 0.9 s | 32 | no |
| 4 | 3 | 1 + 4 (a lookalike) | 1.1 s | 0.6 s | 28 | no |

Knobs: `data/stations/chop.json` levels[].knobs.hop (up, rise, hang, fall, every, peak, catchPad, tapCuts, decoys, size, phoneSize, refill).

## Proof

- Contract, chop L1-L4, L2#mistake, L3#hint at 740x320, 930x430, 1280x665, 1920x1080 (`s19-chop-contract3`): 24/24 pages to their
  end, 0 page errors; `CONTRACT FAILED: 18 breaks (contract-37 4, contract-105 11, contract-65 3)`. Explained: 37 is L1's no decoys
  (Zafar, 9 Nov); 105 is on base too (the reveal lesson's light on the order card); 65's three are one page's slow frame at the wave
  switch (run 2: other pages, 0 on L3#hint).
- Frames (script-made): `build/screenshots/sandbox/s19-chop-contract3/cook-chop/{930x430,740x320}/03-kind-slice.png` (up), `c06-stage.png`
  (halves after a tap then a swipe); L4: `cook-chop-l4/*/c06-stage.png`.
- `checks.mjs --only unit,static,words,specs`: all ok. `loadcheck --only cook:chop`: 1/1.
- No after folder: `evidence.mjs --after` refused the brief (spec errors). No before folder either.

## Asks (files I don't own)

1. evidence.json CK-71 probe 1: `"profile": "new"` -> `"fresh"`; ART-37 probe 1's `"at": "now"` on cook:daar has no driver.
2. games.json/contract-37: chop L1 wants 0 decoys (CK-71).
