# DAAR-36 (open) · Cook: daar

**Issue:** Daar on the s14 kit as chai has it (word card, sideways order row, pop-out turning into its row card, Nani's helper card, the lit-box light, skip zones, bubbles off the side panel, the word pill ladder, the level-up rule, the central rules file); chopped items + the things that go in before them, written X+Y: 1+2, 2+2, 3+3, 4+4 (Zafar, 29 Oct); decoys 1, 2, 3, 4; the tadka's first-time hold; the help light hugs its item (contract-53)

**Check:** auto: daar L1-L4 (chop, tadka, stir) at the four sizes, new and returning, a filmed order, a replay; contract run 0 new breaks

**Source:** docs/archive/sprints/S14-rollout-plan.md

**Status now:** to fix: check · built (s20-b1-daar, decision 35: contract-116 and -22 at zero; gate-20261115T0535-daar+chop pass, 0 blocking over 56 pages)

## Probes

- DAAR-36-p1-L2-930x430: cook:daar@L2#order-whole L2 @ 930x430 [p-seen], at life:request: reached 1x (life:request 17.0s) · daar's order filmed whole at L2 on the s14 kit as chai has it: each word's big card pops beside the side panel (never over a face), then turns into its row card in the sideways order row; 'no' items said last; the bubble off faces and the side panel
- DAAR-36-p2-L1-1920x1080: cook:daar L1 @ 1920x1080 [p-fresh], at life:stage-start: reached 1x (life:stage-start 14.1s) · daar for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; chopped + added first written X+Y on its card (1+2, 2+2, 3+3, 4+4); decoys 1, 2, 3, 4; the tadka's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)
- DAAR-36-p2-L1-740x320: cook:daar L1 @ 740x320 [p-fresh], at life:stage-start: reached 1x (life:stage-start 15.4s) · daar for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; chopped + added first written X+Y on its card (1+2, 2+2, 3+3, 4+4); decoys 1, 2, 3, 4; the tadka's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)
- DAAR-36-p2-L4-1920x1080: cook:daar@L4 L4 @ 1920x1080 [p-fresh], at life:stage-start: reached 1x (life:stage-start 19.1s) · daar for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; chopped + added first written X+Y on its card (1+2, 2+2, 3+3, 4+4); decoys 1, 2, 3, 4; the tadka's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)
- DAAR-36-p2-L4-740x320: cook:daar@L4 L4 @ 740x320 [p-fresh], at life:stage-start: reached 1x (life:stage-start 22.0s) · daar for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; chopped + added first written X+Y on its card (1+2, 2+2, 3+3, 4+4); decoys 1, 2, 3, 4; the tadka's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)

## Panels (`build/screenshots/evidence/r16pb-cook/DAAR-36.png`, `build/screenshots/evidence/r16pb-cook/DAAR-36-2.png`, `build/screenshots/evidence/r16pb-cook/DAAR-36-3.png`)

- **A**: cook:daar@L2#order-whole L2 930x430 [p-seen] · strip:body:60x200 at life:request
- **B**: cook:daar L1 1920x1080 [p-fresh] · shot at life:stage-start
- **C**: cook:daar L1 740x320 [p-fresh] · shot at life:stage-start
- **D**: cook:daar@L4 L4 1920x1080 [p-fresh] · shot at life:stage-start
- **E**: cook:daar@L4 L4 740x320 [p-fresh] · shot at life:stage-start

## Text captures

#### DAAR-36-p1-L2-930x430 · strip:body:60x200 at life:request

```
a film of 60 frames, every 200 ms (12.0 s), from life:request; the sheet shows the 11 frames where the picture changed (*)
the page's own recorder (568 animation frames): the order row's scroll moved at most 38 px between two frames (6 moves over 2891 ms); a card of the row moved at most 172.8 px on screen between two frames (k3: 0 to 172.8 in 42 ms); the big card was up in 362 frames, at most 1 cards in flight; most of a card over a face: 0 px2 (568 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0      75   0.00                              0     0      -  3
  1      200     200   0.25                              0     0      -  3
  2      400     400   0.07                              0     0      -  3
  3      600     600   0.12                              0     0      -  3
  4      800     801   1.21                              0     0      -  3
  5     1000    1000   2.63                              0     0      -  3
  6     1200    1200  10.32  [238.5,10,454.5,420.2]      0     0      -  3
  7*    1400    1400   3.16  [238.5,10,454.5,420.2]      0     0      -  3
  8     1600    1600   0.26  [238.5,10,454.5,420.2]      0     0      -  3
  9     1800    1800   0.35  [238.5,10,454.5,420.2]      0     0      -  3
 10     2000    2001   0.10  [238.5,10,454.5,420.2]      0     0      -  3
 11     2200    2200   0.36  [238.5,10,454.5,420.2]      0     0      -  3
 12     2400    2400   0.17  [238.5,10,454.5,420.2]      0     0      -  3
 13     2600    2600   0.36  [238.5,10,454.5,420.2]      0     0      -  3
 14     2800    2799   0.22  [238.5,10,454.5,420.2]      0     0      -  3
 15     3000    2999  12.63                              0     0      -  3
 16*    3200    3201  14.84  [238.5,10,454.5,420.2]      0     0      -  3
 17     3400    3401   2.03  [238.5,10,454.5,420.2]      0     0      -  3
 18*    3600    3602   0.31  [238.5,10,454.5,420.2]      0     0      -  3
 19     3800    3800   0.36  [238.5,10,454.5,420.2]      0     0      -  3
 20     4000    3999   0.30  [238.5,10,454.5,420.2]      0     0      -  3
 21     4200    4200   0.26  [238.5,10,454.5,420.2]      0     0      -  3
 22     4400    4400   0.31  [238.5,10,454.5,420.2]      0     0      -  3
 23     4600    4600   0.29  [238.5,10,454.5,420.2]      0     0      -  3
 24     4800    4801   0.35  [238.5,10,454.5,420.2]      0     0      -  3
 25     5000    4999   0.21  [238.5,10,454.5,420.2]      0     0      -  3
 26     5200    5200   8.99  [233.5,13.5,444.6,414.4]    1     0      -  3
 27*    5400    5401  17.01  [159.9,63.5,300.3,330.2]    1     0      -  3
 28*    5600    5600   5.57  [95.6,107.3,174.2,256.6]    1     0      -  3
 29     5800    5801   1.30                              0     0      -  3
 30*    6000    5999  14.15  [238.5,10,454.5,420.2]      0    37      -  3
 31     6200    6200   2.04  [238.5,10,454.5,420.2]      0    38      -  3
 32     6400    6401   0.27  [238.5,10,454.5,420.2]      0    38      -  3
 33     6600    6599   0.37  [238.5,10,454.5,420.2]      0    38      -  3
 34     6800    6799   0.24  [238.5,10,454.5,420.2]      0    38      -  3
 35     7000    7003   0.30  [238.5,10,454.5,420.2]      0    38      -  3
 36     7200    7200   0.30  [238.5,10,454.5,420.2]      0    38      -  3
 37     7400    7399   0.36  [238.5,10,454.5,420.2]      0    38      -  3
 38     7600    7599   7.76  [237,11.5,450.9,417.7]      1    38      -  3
 39*    7800    7801  12.03  [169.2,76.6,291.1,308.3]    1    38      -  3
 40     8000    8000   2.92  [136.3,108.2,213.7,255.2]    1    38      -  3
 41     8200    8200   1.24                              0    38      -  3
 42     8400    8399   0.74                              0    38      -  3
 43*    8600    8601  64.02                              0    38      -  3
 44*    8800    8986   6.69                              0     0      -  1
 45     9000    9145   1.17                              0     0      -  1
 46     9200    9226   1.53                              0     0      -  1
 47     9400    9400   0.34                              0     0      -  1
 48     9600    9600   0.10                              0     0      -  1
 49     9800    9800   0.11                              0     0      -  1
 50    10000   10000   1.52                              0     0      -  1
 51    10200   10200   1.59                              0     0      -  1
 52    10400   10400   0.22                              0     0      -  1
 53    10600   10600   0.18                              0     0      -  1
 54    10800   10800   0.22                              0     0      -  1
 55    11000   10999   2.29                              0     0      -  1
 56    11200   11235   1.44                              0     0      -  1
 57    11400   11401   1.46                              0     0      -  1
 58    11600   11600   1.95                              0     0      -  1
 59*   11800   11834   1.06                              0     0      -  1
```

#### DAAR-36-p1-L2-930x430 · contract-52 (contract)

```
contract-52: 0 breaks on this page
```

#### DAAR-36-p1-L2-930x430 · contract-83 (contract)

```
contract-83: 0 breaks on this page
```

#### DAAR-36-p2-L1-1920x1080 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### DAAR-36-p2-L1-1920x1080 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```

#### DAAR-36-p2-L1-740x320 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### DAAR-36-p2-L1-740x320 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```

#### DAAR-36-p2-L4-1920x1080 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### DAAR-36-p2-L4-1920x1080 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```

#### DAAR-36-p2-L4-740x320 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### DAAR-36-p2-L4-740x320 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```
