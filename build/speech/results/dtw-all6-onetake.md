Closed set (6): E:i-want-tea, K:moke-chai-kape, E:i-want-milk, K:moke-doodh-kape, E:im-very-tired, K:abo-takiviyo-ai
Templates: 6 (reference takes only); queries: 66; warps: on; accept margin 0.15, max distance 5.5
In-set queries: 66: right 64 (97%), wrong 0, null 2
Time: features 26 ms per clip (3 warps), classify 12 ms per query against 6 templates (Node; a phone is 1–3× slower)

| said \ heard | E:i-want-tea | K:moke-chai-kape | E:i-want-milk | K:moke-doodh-kape | E:im-very-tired | K:abo-takiviyo-ai | (none) |
|---|---|---|---|---|---|---|---|
| E:i-want-tea | 11 | · | · | · | · | · | · |
| K:moke-chai-kape | · | 11 | · | · | · | · | · |
| E:i-want-milk | · | · | 10 | · | · | · | 1 |
| K:moke-doodh-kape | · | · | · | 11 | · | · | · |
| E:im-very-tired | · | · | · | · | 10 | · | 1 |
| K:abo-takiviyo-ai | · | · | · | · | · | 11 | · |

Margins (d2-d1)/d1: right n=64 min 0.16 median 1.18 max 268.41; wrong n=2 min 0.08 median 0.13 max 0.13; out-of-set n=0
Best distance d1: in-set n=66 min 0.02 median 2.47 max 4.80; out-of-set n=0

| file | truth | heard | d1 | margin | conf |
|---|---|---|---|---|---|
| 1-english-i-want-tea__child1.wav | E:i-want-tea | E:i-want-tea | 2.47 | 1.14 | 1 |
| 1-english-i-want-tea__child1noise.wav | E:i-want-tea | E:i-want-tea | 3.90 | 0.24 | 0.28 |
| 1-english-i-want-tea__child2.wav | E:i-want-tea | E:i-want-tea | 4.72 | 0.16 | 0.03 |
| 1-english-i-want-tea__clean.wav | E:i-want-tea | E:i-want-tea | 0.06 | 89.85 | 1 |
| 1-english-i-want-tea__fast.wav | E:i-want-tea | E:i-want-tea | 2.07 | 1.54 | 1 |
| 1-english-i-want-tea__noise10.wav | E:i-want-tea | E:i-want-tea | 4.09 | 0.24 | 0.31 |
| 1-english-i-want-tea__noise20.wav | E:i-want-tea | E:i-want-tea | 3.16 | 0.59 | 1 |
| 1-english-i-want-tea__room.wav | E:i-want-tea | E:i-want-tea | 3.00 | 0.72 | 1 |
| 1-english-i-want-tea__shift.wav | E:i-want-tea | E:i-want-tea | 1.03 | 3.89 | 1 |
| 1-english-i-want-tea__slow.wav | E:i-want-tea | E:i-want-tea | 1.57 | 2.33 | 1 |
| 1-english-i-want-tea__tablet.wav | E:i-want-tea | E:i-want-tea | 1.64 | 2.20 | 1 |
| 1-kutchi-moke-chai-kape__child1.wav | K:moke-chai-kape | K:moke-chai-kape | 2.42 | 1.14 | 1 |
| 1-kutchi-moke-chai-kape__child1noise.wav | K:moke-chai-kape | K:moke-chai-kape | 4.00 | 0.32 | 0.55 |
| 1-kutchi-moke-chai-kape__child2.wav | K:moke-chai-kape | K:moke-chai-kape | 4.63 | 0.18 | 0.06 |
| 1-kutchi-moke-chai-kape__clean.wav | K:moke-chai-kape | K:moke-chai-kape | 0.04 | 111.47 | 1 |
| 1-kutchi-moke-chai-kape__fast.wav | K:moke-chai-kape | K:moke-chai-kape | 1.95 | 1.57 | 1 |
| 1-kutchi-moke-chai-kape__noise10.wav | K:moke-chai-kape | K:moke-chai-kape | 4.19 | 0.26 | 0.36 |
| 1-kutchi-moke-chai-kape__noise20.wav | K:moke-chai-kape | K:moke-chai-kape | 3.17 | 0.67 | 1 |
| 1-kutchi-moke-chai-kape__room.wav | K:moke-chai-kape | K:moke-chai-kape | 2.88 | 0.72 | 1 |
| 1-kutchi-moke-chai-kape__shift.wav | K:moke-chai-kape | K:moke-chai-kape | 0.91 | 4.69 | 1 |
| 1-kutchi-moke-chai-kape__slow.wav | K:moke-chai-kape | K:moke-chai-kape | 1.43 | 2.53 | 1 |
| 1-kutchi-moke-chai-kape__tablet.wav | K:moke-chai-kape | K:moke-chai-kape | 1.30 | 2.96 | 1 |
| 2-english-i-want-milk__child1.wav | E:i-want-milk | E:i-want-milk | 2.49 | 1.05 | 1 |
| 2-english-i-want-milk__child1noise.wav | E:i-want-milk | E:i-want-milk | 4.21 | 0.24 | 0.29 |
| 2-english-i-want-milk__child2.wav | E:i-want-milk | (none) ✗ | 4.56 | 0.13 | 0 |
| 2-english-i-want-milk__clean.wav | E:i-want-milk | E:i-want-milk | 0.14 | 36.24 | 1 |
| 2-english-i-want-milk__fast.wav | E:i-want-milk | E:i-want-milk | 1.80 | 1.79 | 1 |
| 2-english-i-want-milk__noise10.wav | E:i-want-milk | E:i-want-milk | 4.28 | 0.24 | 0.29 |
| 2-english-i-want-milk__noise20.wav | E:i-want-milk | E:i-want-milk | 3.57 | 0.46 | 1 |
| 2-english-i-want-milk__room.wav | E:i-want-milk | E:i-want-milk | 3.11 | 0.68 | 1 |
| 2-english-i-want-milk__shift.wav | E:i-want-milk | E:i-want-milk | 0.76 | 5.80 | 1 |
| 2-english-i-want-milk__slow.wav | E:i-want-milk | E:i-want-milk | 1.60 | 2.23 | 1 |
| 2-english-i-want-milk__tablet.wav | E:i-want-milk | E:i-want-milk | 2.03 | 1.53 | 1 |
| 2-kutchi-moke-doodh-kape__child1.wav | K:moke-doodh-kape | K:moke-doodh-kape | 2.38 | 1.14 | 1 |
| 2-kutchi-moke-doodh-kape__child1noise.wav | K:moke-doodh-kape | K:moke-doodh-kape | 4.10 | 0.24 | 0.32 |
| 2-kutchi-moke-doodh-kape__child2.wav | K:moke-doodh-kape | K:moke-doodh-kape | 4.56 | 0.21 | 0.15 |
| 2-kutchi-moke-doodh-kape__clean.wav | K:moke-doodh-kape | K:moke-doodh-kape | 0.04 | 128.59 | 1 |
| 2-kutchi-moke-doodh-kape__fast.wav | K:moke-doodh-kape | K:moke-doodh-kape | 1.92 | 1.64 | 1 |
| 2-kutchi-moke-doodh-kape__noise10.wav | K:moke-doodh-kape | K:moke-doodh-kape | 4.38 | 0.21 | 0.18 |
| 2-kutchi-moke-doodh-kape__noise20.wav | K:moke-doodh-kape | K:moke-doodh-kape | 3.20 | 0.58 | 1 |
| 2-kutchi-moke-doodh-kape__room.wav | K:moke-doodh-kape | K:moke-doodh-kape | 2.67 | 0.85 | 1 |
| 2-kutchi-moke-doodh-kape__shift.wav | K:moke-doodh-kape | K:moke-doodh-kape | 1.12 | 3.43 | 1 |
| 2-kutchi-moke-doodh-kape__slow.wav | K:moke-doodh-kape | K:moke-doodh-kape | 1.52 | 2.19 | 1 |
| 2-kutchi-moke-doodh-kape__tablet.wav | K:moke-doodh-kape | K:moke-doodh-kape | 1.28 | 2.96 | 1 |
| 3-english-im-very-tired__child1.wav | E:im-very-tired | E:im-very-tired | 2.49 | 1.18 | 1 |
| 3-english-im-very-tired__child1noise.wav | E:im-very-tired | E:im-very-tired | 3.72 | 0.51 | 1 |
| 3-english-im-very-tired__child2.wav | E:im-very-tired | (none) ✗ | 4.80 | 0.08 | 0 |
| 3-english-im-very-tired__clean.wav | E:im-very-tired | E:im-very-tired | 0.02 | 268.41 | 1 |
| 3-english-im-very-tired__fast.wav | E:im-very-tired | E:im-very-tired | 1.90 | 1.76 | 1 |
| 3-english-im-very-tired__noise10.wav | E:im-very-tired | E:im-very-tired | 3.99 | 0.35 | 0.66 |
| 3-english-im-very-tired__noise20.wav | E:im-very-tired | E:im-very-tired | 2.59 | 1.14 | 1 |
| 3-english-im-very-tired__room.wav | E:im-very-tired | E:im-very-tired | 3.01 | 0.85 | 1 |
| 3-english-im-very-tired__shift.wav | E:im-very-tired | E:im-very-tired | 0.29 | 17.71 | 1 |
| 3-english-im-very-tired__slow.wav | E:im-very-tired | E:im-very-tired | 1.01 | 4.35 | 1 |
| 3-english-im-very-tired__tablet.wav | E:im-very-tired | E:im-very-tired | 1.48 | 2.64 | 1 |
| 3-kutchi-abo-takiviyo-ai__child1.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 2.41 | 1.18 | 1 |
| 3-kutchi-abo-takiviyo-ai__child1noise.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 4.01 | 0.32 | 0.58 |
| 3-kutchi-abo-takiviyo-ai__child2.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 4.51 | 0.17 | 0.05 |
| 3-kutchi-abo-takiviyo-ai__clean.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 0.13 | 40.10 | 1 |
| 3-kutchi-abo-takiviyo-ai__fast.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 1.77 | 2.00 | 1 |
| 3-kutchi-abo-takiviyo-ai__noise10.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 4.44 | 0.23 | 0.22 |
| 3-kutchi-abo-takiviyo-ai__noise20.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 3.38 | 0.58 | 1 |
| 3-kutchi-abo-takiviyo-ai__room.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 2.73 | 0.87 | 1 |
| 3-kutchi-abo-takiviyo-ai__shift.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 0.75 | 5.82 | 1 |
| 3-kutchi-abo-takiviyo-ai__slow.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 1.58 | 2.29 | 1 |
| 3-kutchi-abo-takiviyo-ai__tablet.wav | K:abo-takiviyo-ai | K:abo-takiviyo-ai | 1.53 | 2.41 | 1 |
