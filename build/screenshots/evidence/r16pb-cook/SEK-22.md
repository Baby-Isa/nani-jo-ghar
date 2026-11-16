# SEK-22 (reopened) · Cook: sekelo

**Issue:** The sekelo grill on the s14 kit as chai has it (word card, sideways order row, pop-out turning into its row card, Nani's helper card, the lit-box light, skip zones, bubbles off the side panel, the word pill ladder, the level-up rule, the central rules file); skewers 1, 2, 3, 4 by level; the turn's first-time hold in the green; the help light hugs its item (contract-53); 30 Oct: "The highlight on the skewer ... should include the whole skewer. Right now it cuts off the top and bottom of it, the handle and the pin. And currently it's much too wide as well. If there are multiple skewer items on there, it would cover them as well. It should be fairly tight to include the whole skewer and all the items on the skewer, but not that much else"

**Check:** auto: sekelo threading at L1-L4: the box contains the skewer (handle to tip) and its threaded items, at most 12 px beyond, and overlaps no other skewer or item · was: auto: the grill L1-L4 at the four sizes, new and returning, a filmed order, a replay; contract run 0 new breaks

**Source:** docs/archive/sprints/S14-rollout-plan.md

**Status now:** to fix: check (built, the sweep's FIXED-IN-CODE and s19-clean-c passes contract-105 and -112; to judge) · reopened 30 Oct (Zafar's play, docs/feedback/cook-s14-play-2026-10-30.md)

## Probes

- SEK-22-p1-L2-930x430: cook:mishkaki-grill@L2#order-whole L2 @ 930x430 [p-seen], at life:request: reached 1x (life:request 19.1s) · the sekelo grill's order filmed whole at L2 on the s14 kit as chai has it: each word's big card pops beside the side panel (never over a face), then turns into its row card in the sideways order row; 'no' items said last; the bubble off faces and the side panel
- SEK-22-p2-L1-1920x1080: cook:mishkaki-grill L1 @ 1920x1080 [p-fresh], at view-marble: reached 1x (rec:view-marble 17.3s) · the sekelo grill for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; skewers 1, 2, 3, 4 by level; the turn's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)
- SEK-22-p2-L1-740x320: cook:mishkaki-grill L1 @ 740x320 [p-fresh], at view-marble: reached 1x (rec:view-marble 13.0s) · the sekelo grill for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; skewers 1, 2, 3, 4 by level; the turn's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)
- SEK-22-p2-L4-1920x1080: cook:mishkaki-grill@L4 L4 @ 1920x1080 [p-fresh], at view-marble: reached 1x (rec:view-marble 26.9s) · the sekelo grill for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; skewers 1, 2, 3, 4 by level; the turn's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)
- SEK-22-p2-L4-740x320: cook:mishkaki-grill@L4 L4 @ 740x320 [p-fresh], at view-marble: reached 1x (rec:view-marble 23.3s) · the sekelo grill for a new player at L1 and L4: the lit-box light (warm fill, gold glow) hugging one thing, no finger; skewers 1, 2, 3, 4 by level; the turn's first-time hold; the help light hugs its item (contract-53) (L4: the station at play; no first-time help from L3, the rulebook)

## Panels (`build/screenshots/evidence/r16pb-cook/SEK-22.png`, `build/screenshots/evidence/r16pb-cook/SEK-22-2.png`, `build/screenshots/evidence/r16pb-cook/SEK-22-3.png`)

- **A**: cook:mishkaki-grill@L2#order-whole L2 930x430 [p-seen] · strip:body:60x200 at life:request
- **B**: cook:mishkaki-grill L1 1920x1080 [p-fresh] · shot at rec:view-marble
- **C**: cook:mishkaki-grill L1 740x320 [p-fresh] · shot at rec:view-marble
- **D**: cook:mishkaki-grill@L4 L4 1920x1080 [p-fresh] · shot at rec:view-marble
- **E**: cook:mishkaki-grill@L4 L4 740x320 [p-fresh] · shot at rec:view-marble

## Text captures

#### SEK-22-p1-L2-930x430 · strip:body:60x200 at life:request

```
a film of 60 frames, every 200 ms (12.0 s), from life:request; the sheet shows the 10 frames where the picture changed (*)
the page's own recorder (282 animation frames): the order row's scroll moved at most 321 px between two frames (9 moves over 5559 ms); a card of the row moved at most 321 px on screen between two frames (k9: 335.7 to 656.7 in 164 ms); the big card was up in 196 frames, at most 1 cards in flight; most of a card over a face: 0 px2 (282 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0     552   0.00  [238.6,9.6,463.3,418.1]     0     0      -  3
  1      200     679   7.51  [238.6,9.6,463.3,418.1]     0     0      -  3
  2      400     767   2.88  [238.6,9.6,463.3,418.1]     0     0      -  3
  3      600     988   0.05  [238.6,9.6,463.3,418.1]     0     0      -  3
  4      800    1174   0.37  [238.6,9.6,463.3,418.1]     0     0      -  3
  5     1000    1231   0.12  [238.6,9.6,463.3,418.1]     0     0      -  3
  6     1200    1338   0.07  [238.6,9.6,463.3,418.1]     0     0      -  3
  7     1400    1491   0.27  [238.6,9.6,463.3,418.1]     0     0      -  3
  8     1600    2343   0.26  [238.6,9.6,463.3,418.1]     0     0      -  3
  9     1800    2754   0.46  [238.6,9.6,463.3,418.1]     0     0      -  3
 10     2000    2826   0.02  [238.6,9.6,463.3,418.1]     0     0      -  3
 11     2200    2986   0.32  [238.6,9.6,463.3,418.1]     0     0      -  3
 12     2400    3308   0.09  [238.6,9.6,463.3,418.1]     0     0      -  3
 13     2600    3579   0.29  [238.6,9.6,463.3,418.1]     0     0      -  3
 14     2800    3648   0.18  [238.6,9.6,463.3,418.1]     0     0      -  3
 15     3000    3805   0.23  [238.6,9.6,463.3,418.1]     0     0      -  3
 16     3200    3858   0.14  [238.6,9.6,463.3,418.1]     0     0      -  3
 17     3400    3921   0.07  [238.6,9.6,463.3,418.1]     0     0      -  3
 18     3600    4094   0.24  [238.6,9.6,463.3,418.1]     0     0      -  3
 19     3800    4207   0.31  [238.6,9.6,463.3,418.1]     0     0      -  3
 20*    4000    4395  19.59  [238.6,9.6,463.3,418.1]     0     0      -  3
 21     4200    4568   0.99                              0     0      -  3
 22     4400    4668   5.12                              0     0      -  3
 23*    4600    5136  17.38  [238.6,9.6,463.3,418.1]     0   155      -  3
 24     4800    5356   0.78  [238.6,9.6,463.3,418.1]     0   312      -  3
 25     5000    6045   0.29  [238.6,9.6,463.3,418.1]     0   321      -  3
 26     5200    6742   0.18  [238.6,9.6,463.3,418.1]     0   321      -  3
 27*    5400    6901   0.35  [238.6,9.6,463.3,418.1]     0   321      -  3
 28     5600    7123   0.12  [238.6,9.6,463.3,418.1]     0   321      -  3
 29     5800    7274   0.17  [238.6,9.6,463.3,418.1]     0   321      -  3
 30     6000    7331   0.15  [238.6,9.6,463.3,418.1]     0   321      -  3
 31     6200    7379   0.13  [238.6,9.6,463.3,418.1]     0   321      -  3
 32     6400    7664   0.36  [238.6,9.6,463.3,418.1]     0   321      -  3
 33     6600    7742   0.13  [238.6,9.6,463.3,418.1]     0   321      -  3
 34     6800    7800   0.07  [238.6,9.6,463.3,418.1]     0   321      -  3
 35     7000    7884   0.08  [238.6,9.6,463.3,418.1]     0   321      -  3
 36*    7200    8413  19.35  [205.6,32.3,396.3,379]      1   321      -  3
 37     7400    8560   2.17  [106.7,100.6,195.5,261.9]    1   321      -  3
 38     7600    8637   0.60  [103.5,102.8,188.9,258.1]    1   321      -  3
 39     7800    8827   1.34  [93.8,109.6,169.1,246.5]    1   321      -  3
 40     8000    8934   1.19                              0   321      -  3
 41     8200    9511   0.05                              0   321      -  3
 42*    8400    9766  43.65                              0   321      -  3
 43     8600   10467   0.10                              0     0      -  2
 44     8800   10853   0.00                              0     0      -  2
 45     9000   11332   0.00                              0     0      -  2
 46     9200   11659   0.00                              0     0      -  2
 47     9400   11985   0.00                              0     0      -  2
 48     9600   12243   0.00                              0     0      -  2
 49*    9800   12599  11.43                              0     0      -  2
 50*   10000   12776  12.14                              0     0      -  2
 51*   10200   13348  37.70                              0     0      -  2
 52    10400   13862   0.03                              0     0      -  3
 53    10600   14153   0.00                              0     0      -  3
 54    10800   14366   0.00                              0     0      -  3
 55    11000   14769   0.00                              0     0      -  3
 56    11200   14948   0.00                              0     0      -  3
 57    11400   15238   0.00                              0     0      -  3
 58    11600   15407   0.00                              0     0      -  3
 59*   11800   15548   0.00                              0     0      -  3
```

#### SEK-22-p1-L2-930x430 · contract-52 (contract)

```
contract-52: 0 breaks on this page
```

#### SEK-22-p1-L2-930x430 · contract-83 (contract)

```
contract-83: 0 breaks on this page
```

#### SEK-22-p2-L1-1920x1080 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### SEK-22-p2-L1-1920x1080 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```

#### SEK-22-p2-L1-740x320 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### SEK-22-p2-L1-740x320 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```

#### SEK-22-p2-L4-1920x1080 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### SEK-22-p2-L4-1920x1080 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```

#### SEK-22-p2-L4-740x320 · contract-53 (contract)

```
contract-53: 0 breaks on this page
```

#### SEK-22-p2-L4-740x320 · contract-84 (contract)

```
contract-84: 0 breaks on this page
```
