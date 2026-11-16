# CHAI-42 (open) · Cook: chai

**Issue:** "The highlight on the menu card needs to start it's timer after the last animation action (so when the tea has finished going in ...)": the order card's light waits until nothing moves

**Check:** auto: a timeline check, chai L1 new player: the card's light after the last move ends

**Source:** docs/feedback/chai-rules-2026-10-29.md P4

**Status now:** to fix: check · built 29 Oct in the fast lane, verified 30 Oct by the orchestrator's films (build/reports/s14-rollout.md phase A); 30 Oct (the orchestrator's film: it lit while the tea spoon was still in the pan, and over the milk's pour for a quick child): it waits for a spoon in flight too, skips once the child has moved on to the next thing, and goes if a pour starts while it is lit (filmed: a child pausing 2.5 s gets it 2 s after the tea tap, a quick child none); the sprint's judge, then Zafar's play

## Probes

- CHAI-42-p1-L1-1920x1080: cook:chai-tray#speed1 L1 @ 1920x1080 [p-fresh], at exp:cook-chai: reached 1x (exp:cook-chai 28.9s) · a new player, filmed from the tea's step: the tea goes in, its spoon lands, the order row glides; only then, after a quiet spell, the order card is lit once (1.2 s); a child who has already picked the next thing gets no light
- CHAI-42-p1-L1-930x430: cook:chai-tray#speed1 L1 @ 930x430 [p-fresh], at exp:cook-chai: reached 1x (exp:cook-chai 30.0s) · a new player, filmed from the tea's step: the tea goes in, its spoon lands, the order row glides; only then, after a quiet spell, the order card is lit once (1.2 s); a child who has already picked the next thing gets no light

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-42.png`, `build/screenshots/evidence/r16pb-cook/CHAI-42-2.png`)

- **A**: cook:chai-tray#speed1 L1 1920x1080 [p-fresh] · strip:body:30x200 at exp:cook-chai
- **B**: cook:chai-tray#speed1 L1 930x430 [p-fresh] · strip:body:30x200 at exp:cook-chai

## Text captures

#### CHAI-42-p1-L1-1920x1080 · strip:body:30x200 at exp:cook-chai

```
a film of 30 frames, every 200 ms (6.0 s), from exp:cook-chai; the sheet shows the 6 frames where the picture changed (*)
the page's own recorder (200 animation frames): the order row's scroll moved at most 0 px between two frames (0 moves over 0 ms); a card of the row moved at most 0 px on screen between two frames; the big card was up in 0 frames, at most 0 cards in flight; most of a card over a face: 0 px2 (200 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0      29   0.00                              0     0      -  4
  1      200     306   1.71                              0     0      -  4
  2      400     504   0.22                              0     0      -  4
  3      600     756   0.02                              0     0      -  4
  4      800     996   0.21                              0     0      -  4
  5     1000    1221   0.21                              0     0      -  4
  6     1200    1613   0.31                              0     0      -  4
  7*    1400    1806  81.66                              0     0      -  4
  8     1600    1999   0.17                              0     0      -  4
  9     1800    2189   0.30                              0     0      -  4
 10*    2000    2326  81.66                              0     0      -  4
 11     2200    2550   0.29                              0     0      -  4
 12*    2400    2991  81.65                              0     0      -  4
 13     2600    3191   0.31                              0     0      -  4
 14     2800    3639   0.28                              0     0      -  4
 15*    3000    3767  81.66                              0     0      -  4
 16     3200    3929   0.01                              0     0      -  4
 17     3400    4094   0.01                              0     0      -  4
 18     3600    4351   0.29                              0     0      -  4
 19     3800    4545   0.13                              0     0      -  4
 20     4000    4802   0.24                              0     0      -  4
 21     4200    6988   0.02                              0     0      -  4
 22     4400    7293   0.01                              0     0      -  4
 23     4600    7474   0.01                              0     0      -  4
 24     4800    7730   0.31                              0     0      -  4
 25     5000    8087   0.31                              0     0      -  4
 26     5200    8266   0.01                              0     0      -  4
 27     5400    8472   0.03                              0     0      -  4
 28     5600    8680   0.26                              0     0      -  4
 29*    5800    8862   0.14                              0     0      -  4
```

#### CHAI-42-p1-L1-1920x1080 · contract-79 (contract)

```
contract-79: 0 breaks on this page
```

#### CHAI-42-p1-L1-930x430 · strip:body:30x200 at exp:cook-chai

```
a film of 30 frames, every 200 ms (6.0 s), from exp:cook-chai; the sheet shows the 6 frames where the picture changed (*)
the page's own recorder (170 animation frames): the order row's scroll moved at most 0 px between two frames (0 moves over 0 ms); a card of the row moved at most 0 px on screen between two frames; the big card was up in 0 frames, at most 0 cards in flight; most of a card over a face: 0 px2 (170 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0      20   0.00                              0     0      -  4
  1      200     201   0.06                              0     0      -  4
  2      400     399   0.03                              0     0      -  4
  3      600     600   0.27                              0     0      -  4
  4*     800     800  79.79                              0     0      -  4
  5     1000    1000   0.24                              0     0      -  4
  6*    1200    1200  79.87                              0     0      -  4
  7     1400    1490   0.03                              0     0      -  4
  8     1600    1668   0.28                              0     0      -  4
  9*    1800    1800  79.79                              0     0      -  4
 10     2000    2000   0.25                              0     0      -  4
 11     2200    2202   0.37                              0     0      -  4
 12*    2400    2400  79.69                              0     0      -  4
 13     2600    2601   0.01                              0     0      -  4
 14     2800    2799   0.36                              0     0      -  4
 15     3000    3001   0.07                              0     0      -  4
 16     3200    3200   0.37                              0     0      -  4
 17     3400    3494   0.01                              0     0      -  4
 18     3600    3600   0.01                              0     0      -  4
 19     3800    3801   0.26                              0     0      -  4
 20     4000    4000   0.11                              0     0      -  4
 21     4200    4242   0.21                              0     0      -  4
 22     4400    4400   0.17                              0     0      -  4
 23     4600    4620   0.02                              0     0      -  4
 24     4800    4801   0.17                              0     0      -  4
 25     5000    5000   0.30                              0     0      -  4
 26     5200    5200   0.13                              0     0      -  4
 27     5400    5399   0.34                              0     0      -  4
 28     5600    5601   0.03                              0     0      -  4
 29*    5800    5800   0.00                              0     0      -  4
```

#### CHAI-42-p1-L1-930x430 · contract-79 (contract)

```
contract-79: 0 breaks on this page
```
