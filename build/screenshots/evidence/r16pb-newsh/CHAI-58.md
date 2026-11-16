# CHAI-58 (open) · Easy to play (Sprint 11)

**Issue:** The new boil (CHAI-57) is tight at L4: at a child's pace the green plus the red lasts about 3 s, and a miss empties the pan and starts it again; a child busy with another pan may boil over often (the builder's note, 1 Nov)

**Check:** auto: the green's length at L4, measured at speed 1, 2 s (±0.1) · eye: chai L4 at 1280x665

**Source:** build/reports/s15-chai-11.md

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (fails in s19-clean-b: contract-70) · built 2 Nov in chai (d23ac70, b45779e), shot at the four sizes by labcheck; the judge, then Zafar's play

## Probes

- CHAI-58-p1-L4-1280x665: cook:chai-tray@L4#speed1 L4 @ 1280x665 [p-seen], at kind-timing: reached 1x (rec:kind-timing 87.4s) · L4 at a child's pace: the boil's green, filmed 4 s from the timed step (about 2 s green)

## Panels (`build/screenshots/evidence/r16pb-newsh/CHAI-58.png`, `build/screenshots/evidence/r16pb-newsh/CHAI-58-2.png`)

- **A**: cook:chai-tray@L4#speed1 L4 1280x665 [p-seen] · strip:#game:16x250 at rec:kind-timing

## Text captures

#### CHAI-58-p1-L4-1280x665 · strip:#game:16x250 at rec:kind-timing

```
a film of 16 frames, every 250 ms (4.0 s), from rec:kind-timing; the sheet shows the 10 frames where the picture changed (*)
the page's own recorder (80 animation frames): the order row's scroll moved at most 0 px between two frames (0 moves over 0 ms); a card of the row moved at most 0 px on screen between two frames; the big card was up in 0 frames, at most 0 cards in flight; most of a card over a face: 0 px2 (80 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0      27   0.00                              0   428      -  10
  1      250     250   1.79                              0   428      -  10
  2*     500     499   4.26                              0   428      -  10
  3*     750     749   4.98                              0   428      -  10
  4*    1000    1006   0.92                              0   428      -  10
  5     1250    1255   0.42                              0   428      -  10
  6     1500    1567   1.33                              0   428      -  10
  7*    1750    1853   3.64                              0   428      -  10
  8*    2000    2161   2.94                              0   428      -  10
  9     2250    2298   0.43                              0   428      -  10
 10*    2500    2501   1.61                              0   428      -  10
 11*    2750    2761   4.50                              0   428      -  10
 12*    3000    3049   2.61                              0   428      -  10
 13     3250    3389   0.56                              0   428      -  10
 14     3500    3570   0.43                              0   428      -  10
 15*    3750    3783   0.23                              0   428      -  10
```
