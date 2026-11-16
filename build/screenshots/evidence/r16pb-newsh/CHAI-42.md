# CHAI-42 (open) · Cook: chai

**Issue:** "The highlight on the menu card needs to start it's timer after the last animation action (so when the tea has finished going in ...)": the order card's light waits until nothing moves

**Check:** auto: a timeline check, chai L1 new player: the card's light after the last move ends

**Source:** docs/feedback/chai-rules-2026-10-29.md P4

**Status now:** to fix: check · built 29 Oct in the fast lane, verified 30 Oct by the orchestrator's films (build/reports/s14-rollout.md phase A); 30 Oct (the orchestrator's film: it lit while the tea spoon was still in the pan, and over the milk's pour for a quick child): it waits for a spoon in flight too, skips once the child has moved on to the next thing, and goes if a pour starts while it is lit (filmed: a child pausing 2.5 s gets it 2 s after the tea tap, a quick child none); the sprint's judge, then Zafar's play

## Probes

- CHAI-42-p1-L1-930x430: cook:chai-tray L1 @ 930x430 [p-fresh], at exp:cook-chai: reached 1x (exp:cook-chai 19.0s) · a new player: the order card's light waits until the tea has gone in and nothing moves (12 s from the tea step)

## Panels (`build/screenshots/evidence/r16pb-newsh/CHAI-42.png`, `build/screenshots/evidence/r16pb-newsh/CHAI-42-2.png`)

- **A**: cook:chai-tray L1 930x430 [p-fresh] · strip:body:40x300 at exp:cook-chai

## Text captures

#### CHAI-42-p1-L1-930x430 · strip:body:40x300 at exp:cook-chai

```
a film of 40 frames, every 300 ms (12.0 s), from exp:cook-chai; the sheet shows the 11 frames where the picture changed (*)
the page's own recorder (401 animation frames): the order row's scroll moved at most 40 px between two frames (14 moves over 7394 ms); a card of the row moved at most 40 px on screen between two frames (k2: -84.5 to -44.5 in 29 ms); the big card was up in 0 frames, at most 0 cards in flight; most of a card over a face: 0 px2 (401 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0      69   0.00                              0     0      -  4
  1*     300     300  60.58                              0    36      -  4
  2*     600     600  23.19                              0    81      -  4
  3      900     900   1.83                              0    81      -  4
  4     1200    1205   4.12                              0   118      -  4
  5     1500    1499   1.29                              0   118      -  4
  6*    1800    1801   1.22                              0   118      -  4
  7     2100    2099   0.15                              0   118      -  4
  8     2400    2400   1.47                              0   118      -  4
  9     2700    2700   0.67                              0   118      -  4
 10     3000    3021   0.93                              0   118      -  4
 11     3300    3300   0.10                              0   118      -  4
 12     3600    3599   0.09                              0   118      -  4
 13     3900    3900   0.08                              0   118      -  4
 14     4200    4199   0.10                              0   118      -  4
 15     4500    4501   0.13                              0   118      -  4
 16     4800    4801   0.34                              0   118      -  4
 17     5100    5104   0.49                              0   118      -  4
 18*    5400    5401  60.80                              0   118      -  4
 19     5700    5702   3.59                              0   118      -  4
 20*    6000    6001  53.57                              0   118      -  4
 21     6300    6300   8.65                              0   118      -  4
 22     6600    6600   1.97                              0   118      -  4
 23     6900    6926   5.21                              0   118      -  4
 24     7200    7200   3.34                              0   118      -  4
 25     7500    7500   4.62                              0   115      -  4
 26     7800    7801   0.15                              0     0      -  4
 27     8100    8100   0.00                              0     0      -  4
 28     8400    8401   0.55                              0     0      -  4
 29     8700    8700   0.86                              0     0      -  4
 30     9000    9000   0.00                              0     0      -  4
 31*    9300    9300  38.32                              0     0      -  4
 32*    9600    9600  36.47                              0     0      -  5
 33     9900    9899   0.54                              0     0      -  5
 34    10200   10199   1.11                              0     0      -  5
 35*   10500   10501  20.56                              0     0      -  5
 36*   10800   10799  60.12                              0     0      -  4
 37    11100   11100   0.41                              0     0      -  4
 38    11400   11400   0.10                              0     0      -  4
 39*   11700   11700   0.06                              0     0      -  4
```
