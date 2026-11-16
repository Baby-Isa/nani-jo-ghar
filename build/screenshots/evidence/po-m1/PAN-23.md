# PAN-23 (open) · Cook: pantry

**Issue:** Pantry at 740x320: Nani's bubble sits clear of the big card, never its left edge under it (the r2 evidence judge, 13 Nov: "the left edge of Nani's bubble sits under the big card")

**Check:** auto: pantry at L1, L2, L3 and L4, 740x320

**Source:** the r2 evidence judge, 13 Nov

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins)

## Machine verdict: PASS

machine: noOverlap:.cv-bubble,.wc14-pop (no overlap (3 moments)); contract-129 (0 breaks on this page); noOverlap:.cv-bubble,.wc14-pop (no overlap (4 moments))

## Probes

- PAN-23-p1-L1-740x320: cook:fetch L1 @ 740x320 [p-seen], at every bubble: reached 5x (bubble 2.5s, bubble 2.9s, bubble 3.5s, bubble 4.3s, bubble 16.1s) · pantry at 740x320: at each of Nani's bubbles her bubble is clear of the big card, never its left edge under it (and contract-129 over the play: the pop-up card never over a speech bubble)
  - expect noOverlap:.cv-bubble,.wc14-pop: PASS (no overlap (3 moments))
  - expect contract-129: PASS (0 breaks on this page)
- PAN-23-p1-L2-740x320: cook:fetch@L2 L2 @ 740x320 [p-seen], at every bubble: reached 6x (bubble 2.4s, bubble 2.8s, bubble 3.4s, bubble 4.4s, bubble 5.3s, bubble 16.7s) · pantry at 740x320: at each of Nani's bubbles her bubble is clear of the big card, never its left edge under it (and contract-129 over the play: the pop-up card never over a speech bubble)
  - expect noOverlap:.cv-bubble,.wc14-pop: PASS (no overlap (4 moments))
  - expect contract-129: PASS (0 breaks on this page)
- PAN-23-p1-L3-740x320: cook:fetch@L3 L3 @ 740x320 [p-seen], at every bubble: reached 6x (bubble 2.6s, bubble 3.1s, bubble 3.7s, bubble 4.6s, bubble 5.6s, bubble 18.1s) · pantry at 740x320: at each of Nani's bubbles her bubble is clear of the big card, never its left edge under it (and contract-129 over the play: the pop-up card never over a speech bubble)
  - expect noOverlap:.cv-bubble,.wc14-pop: PASS (no overlap (3 moments))
  - expect contract-129: PASS (0 breaks on this page)
- PAN-23-p1-L4-740x320: cook:fetch@L4 L4 @ 740x320 [p-seen], at every bubble: reached 6x (bubble 2.5s, bubble 2.9s, bubble 3.4s, bubble 4.5s, bubble 5.3s, bubble 18.0s) · pantry at 740x320: at each of Nani's bubbles her bubble is clear of the big card, never its left edge under it (and contract-129 over the play: the pop-up card never over a speech bubble)
  - expect noOverlap:.cv-bubble,.wc14-pop: PASS (no overlap (3 moments))
  - expect contract-129: PASS (0 breaks on this page)

## Panels (`build/screenshots/evidence/po-m1/PAN-23.png`, `build/screenshots/evidence/po-m1/PAN-23-2.png`, `build/screenshots/evidence/po-m1/PAN-23-3.png`, `build/screenshots/evidence/po-m1/PAN-23-4.png`)

- **A**: cook:fetch L1 740x320 [p-seen] · shot at every bubble (5)
- **B**: cook:fetch@L2 L2 740x320 [p-seen] · shot at every bubble (6)
- **C**: cook:fetch@L3 L3 740x320 [p-seen] · shot at every bubble (6)
- **D**: cook:fetch@L4 L4 740x320 [p-seen] · shot at every bubble (6)

## Text captures

#### PAN-23-p1-L1-740x320 · contract-129 (contract)

```
contract-129: 0 breaks on this page
```

#### PAN-23-p1-L2-740x320 · contract-129 (contract)

```
contract-129: 0 breaks on this page
```

#### PAN-23-p1-L3-740x320 · contract-129 (contract)

```
contract-129: 0 breaks on this page
```

#### PAN-23-p1-L4-740x320 · contract-129 (contract)

```
contract-129: 0 breaks on this page
```
