# Find it leak bot (node build/leak_find.mjs --n 1000 --seed 1)

The ear-star rate of a player who knows no Kutchi, per game, level and word stage (2: words as text; 3: dots). Pass: under 10% (target 5%) for the mean over strategies at levels 1-3; the worst single strategy is shown too.

## Generator checks

3200 rounds built. Problems: none
Digit rule: shown at stage 1 yes; shown at stage 2 or 3 no.

## F1 Nani's list + Check the bag

| Level | Stage | Rounds | Ear (mean) | Worst strategy | Pass |
|---|---|---|---|---|---|
| 1 | 2 | 2500 | 1.7% | copies/bigger 3.2% | yes |
| 1 | 3 | 2500 | 1.8% | copies/any 4.0% | yes |
| 2 | 2 | 2500 | 0.3% | copies/any 1.2% | yes |
| 2 | 3 | 2500 | 0.2% | copies/bigger 0.8% | yes |
| 3 | 2 | 2500 | 0.3% | copies/bigger 1.2% | yes |
| 3 | 3 | 2500 | 0.2% | copies/bigger 1.2% | yes |
| 4 | 2 | 2500 | 0.1% | copies/any 0.8% | (L4: reported) |
| 4 | 3 | 2500 | 0.0% | salient/bigger 0.4% | (L4: reported) |

## F2 Which one? (+ the bag)

| Level | Stage | Rounds | Ear (mean) | Worst strategy | Pass |
|---|---|---|---|---|---|
| 1 | 2 | 5000 | 0.1% | copies/any 2.0% | yes |
| 1 | 3 | 5000 | 0.2% | salient/any 1.2% | yes |
| 2 | 2 | 5000 | 0.2% | copies/any 2.4% | yes |
| 2 | 3 | 5000 | 0.2% | copies/any 1.2% | yes |
| 3 | 2 | 5000 | 0.0% | copies/any 0.8% | yes |
| 3 | 3 | 5000 | 0.0% | salient/bigger 0.0% | yes |
| 4 | 2 | 5000 | 0.0% | copies/any 0.4% | (L4: reported) |
| 4 | 3 | 5000 | 0.0% | salient/bigger 0.0% | (L4: reported) |

## F3 Where is it? (calls; positions hidden, as if Kutchi)

| Level | Stage | Rounds | Ear (mean) | Worst strategy | Pass |
|---|---|---|---|---|---|
| 1 | 2 | 3750 | 0.7% | copies/nearest 3.6% | yes |
| 1 | 3 | 3750 | 0.5% | copies/visible 3.6% | yes |
| 2 | 2 | 3750 | 0.4% | copies/visible 2.4% | yes |
| 2 | 3 | 3750 | 0.3% | copies/nearest 2.0% | yes |
| 3 | 2 | 3750 | 0.1% | copies/first 0.8% | yes |
| 3 | 3 | 3750 | 0.1% | copies/first 0.8% | yes |
| 4 | 2 | 3750 | 0.0% | salient/visible 0.0% | (L4: reported) |
| 4 | 3 | 3750 | 0.0% | salient/visible 0.0% | (L4: reported) |

## F3 today: the positions are readable English placeholders (reader)

The bot reads the placeholder ("in the crate") and only has to guess the thing. Those calls are not tested for the ear star until the family's position words are in (stars rule placeholdersTested: false), so this is reported, not a pass mark.

| Level | Stage | Rounds | Ear if it counted |
|---|---|---|---|
| 1 | 2 | 1000 | 25.0% |
| 1 | 3 | 1000 | 22.0% |
| 2 | 2 | 1000 | 16.9% |
| 2 | 3 | 1000 | 18.1% |
| 3 | 2 | 1000 | 18.1% |
| 3 | 3 | 1000 | 17.3% |
| 4 | 2 | 1000 | 1.1% |
| 4 | 3 | 1000 | 1.3% |

## F4 Ali's turn, pills only (no voice)

A random pill for each thing (and, from level 2, each number). The voice star is Stars.voice over the moments: pills leave it open, never earned.

| Level | Rounds | All pills right first time | Voice star earned |
|---|---|---|---|
| 1 | 1000 | 24.0% | 0 (never) |
| 2 | 1000 | 0.0% | 0 (never) |
| 3 | 1000 | 0.0% | 0 (never) |
| 4 | 1000 | 0.0% | 0 (never) |

PASS
