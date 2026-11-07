# Contract run fixture-chai

## Contract checks (decision 75): 2 breaks over 4 pages

| check | breaks | how it measures |
|---|---|---|
| contract-6 no retired art | 0 | Every image drawn |
| contract-11 backgrounds in proportion and sharp | 1 | Every picture covering half the screen |
| contract-24 no help before the idle time | 0 | Nani's help |
| contract-53 the help's light holds one thing | 0 | Every spot sample |
| contract-71 chai: milk, water and tea once each | 0 | Cook flows of the chai tray |
| contract-81 no picture over a gauge | 1 | Every gaugeover event |
| contract-88 no item on the order card before it is said | 0 | Every rows14 event |

| check | flow | level | size | state (shot) | at s | what |
|---|---|---|---|---|---|---|
| contract-11 | cook:chai-tray@L4 | L4 | 1920x1080 | start (01-start.png) | 2.9 | page: background counter-wm-s17.webp (img) low-res: 1.58 screen px per source px |
| contract-81 | cook:daar | L2 | 1280x665 | stir (02-stir.png) | 4.1 | a picture over the heat ring (daar, not chai) |
