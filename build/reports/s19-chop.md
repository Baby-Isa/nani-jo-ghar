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

## Follow-up: random-ish starts (Zafar, 9 Nov)

Each gap between hop starts is the beat x (1 +/- `jitter`: L1 0.15, L2-L4 0.4), never under `minGap` (L1 1.5, L2 0.5, L3 0.4, L4
0.3 s), still at most `up` in the air; the round's gaps drawn from one seeded draw. Run `s19-chop-jitter` (L1-L4, 930x430 and 740x320):
8/8 to the end, 0 page errors, `CONTRACT FAILED: 8 breaks (contract-37 2, contract-105 6)` (as above). Round 1 starts, game s (up):
- L2: 0.00(1) 0.98(2) 2.54(2) 3.40(2) 4.80(2) 6.11(2) 7.38(2) 8.75(2) 10.34(2); least gap 0.85
- L4: 0.00(1) 0.61(2) 1.37(3) 1.87(3) 2.33(3) 3.12(3) 3.84(3) 4.71(3) 5.17(3) 5.72(3) 6.32(3) ...; least gap 0.40

## Asks (files I don't own)

1. evidence.json CK-71 probe 1: `"profile": "new"` -> `"fresh"`; ART-37 probe 1's `"at": "now"` on cook:daar has no driver.
2. games.json/contract-37: chop L1 wants 0 decoys (CK-71).
