# Values: every number the standard's rules use

A rule cites a value by name and area ("zoom-in (values.md D1)"). "Derived from" lets a family re-derive a number, never copy it.
"Token" is where the number lives (`css/shared/tokens.css`, `data/layout.json`, `data/rules.json`, `data/cook.json`), or **to
tokenise** (still a constant in code). Read from the code on 7 Nov; a design px is one unit of the 1600x900 play area.

## 0.2 Who it is for

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| four sizes | 740x320, 930x430, 1280x665, 1920x1080 | CSS px | Zafar, 27 Oct: the phone and big-screen extremes | not a token (the check sizes) | no |
| phone | the short side under 500 | CSS px | decisions 24, 25 | `data/layout.json` formFactors | no |
| tablet | short side 600 or more, no wider than 3:2; scale 1.15 to 1.4 | CSS px | decisions 24, 25 | `data/layout.json` formFactors | no |

## A1 The words

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| new words a round | 3 to 5 | words | easy-to-play principle 9 (Zafar's yes, 21 Oct) | to tokenise (`data/rules.json`, not yet a key) | with Zafar |
| hearings a round | 3 or more of each new word | hearings | easy-to-play principle 9 (Zafar's yes, 21 Oct) | to tokenise (`data/rules.json`, not yet a key) | with Zafar |

## A2 The word card's support

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| card by level | English at L1; the picture at L1-L2; Kutchi always | levels | `data/rules.json` levels (Zafar, 29 Oct) | `data/rules.json` levels.cardEnglish, cardPicture | with Zafar |
| support by stage | stages 1-2: picture, English and Kutchi text; 3: no English; 4: no picture; 5: the speaker alone | word stage | the fade order (Zafar, 21 Oct: English, then the picture, then the Kutchi text) | `data/progress.json` support | with Zafar |
| pill right in a row | 3 | right picks | SH-159 (Zafar, 29 Oct) | `data/rules.json` words.pill.rightInARow | with Zafar |
| word hold | new 1.5, learning 1.0, known 0.6 | s | SH-159 | `data/rules.json` words.holdMs | with Zafar |
| reveal English shown | 1.6 | s | SH-196 (Zafar, 3 Nov) | to tokenise | no |

## A3 Words a picture can't show

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| pair hold | 2.2 | s | CHAI-81 (Zafar, 4 Nov: "it lingers on the two cards for ... a couple of seconds"); 2.2 s, as played (Zafar, 7 Nov) | to tokenise (`js/cook/ui.js:153`) | yes, per moment |

## B1 The round's steps

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| passMeAfterPlays | 2 plays of the dish before Nani may ask | plays | MAA-14 (6 Oct: "never in a mode's first plays") | `data/cook.json` calm.passMeAfterPlays | yes |
| passMeChance | per order: relaxed 0.4, busy 0.55, L1 0.2; none in a session's first order; at most once an order (twice in busy above L1) | chance | Wave 5, clarity and calm (`js/cook/flow.js:177-189`, `:442-444`) | `data/cook.json` calm.passMeChance | yes |

## B2 The mechanic

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| level speed | each level's timers about 15% quicker (0.13 to 0.17) | share | design system §11 | `data/cook.json` timing.levelSpeed | yes, inside the band |
| heat to the green | about 15, 21, 28 by level | s | CHAI-10 (20 Oct: twice as fast) | `data/cook.json` | yes |
| green at L4 | 2 | s | CHAI-58 (1.7 s was tight at a child's pace) | `data/cook.json` | yes |
| boil lead | the boil picture 2 s before the green, at every level | s | CHAI-63 (1 Nov) | to tokenise | yes |

## B3 Counts and amounts

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| count by level | L1 one, L4 the game's most, even steps (chai 1 to 3) | things | the rulebook (29 Oct) | `data/rules.json` count.games | yes, per game |
| half | 0.42 of the glass's inside | share | Zafar, 5 Nov: "half should be a little lower" (CHAI-84) | to tokenise (`js/cook/ui.js`) | yes (baking's jug) |
| full | to the rim (1.0) | share | CHAI-84 | to tokenise | yes |
| pours to the amount | L4: half 1, full 2; below L4 one | pours | CHAI-54 (1 Nov) | to tokenise | yes |

## C2 Across levels

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| decoys | 1, 2, 3, 4 by level, L4's last a lookalike | things | CK-49; contract-37 | `data/rules.json` levels.decoys, lookalike | with Zafar |
| "no" asks | from L2 | level | the rulebook (29 Oct) | `data/rules.json` levels.noAsks | with Zafar |
| level up | 3 rounds in a row, at most 1 hint; never down; top L4 | rounds | Zafar, 29 Oct | `data/rules.json` advance | with Zafar |
| people at the counter | 1: middle; 2: middle, right; 3: all | spots | Zafar, 29 Oct | `data/rules.json` scene.counterSpots | yes |

## C3 Across the word ladder

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| recalls to move a stage | 0, 4, 5, 6 (stage 1 to 2, 2 to 3, 3 to 4, 4 to 5) | recalls from the Kutchi | easy-to-play principle 7 (Zafar's yes, 21 Oct: "6-10 meetings across days"); rule G23 | `data/progress.json` understand.advanceAfter | with Zafar |

## D1 The first time

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| breath before a light | 1 after the stage is still, never more than 3 | s | CHAI-52 (Zafar: "add a second extra") | to tokenise (chai's CONTROL_PAUSE_MS) | no |
| call after its light | 0: together, within 200 ms | ms | CHAI-40, contract-78 | `data/rules.json` showing.callAfterLightMs | no |
| card light after the last move | 0.5 | s | CHAI-42 | `data/rules.json` showing.pointAfterMoveMs | no |
| still-kitchen wait | up to 8 | s | CHAI-77 (a child's pace) | to tokenise | no |
| light time | 1.2 | s | the rulebook's showing | `data/rules.json` showing.pointMs | no |
| zoom-in | the whole 0.65, then shrink 0.45; the part's pad 4 px | s | SH-213 (Zafar, 5 Nov) | to tokenise (Onboard.ZOOM) | no |
| next-pan light | 0.8 after the pour | s | CHAI-99 (Zafar, 6 Nov: "half a second longer") | to tokenise | yes |
| light after the dots | ends 0.9 after the dots | s | SH-196 (4 Nov) | to tokenise | no |
| light pad | 0.12 of the smaller side, 8 to 16, 2 clear of a neighbour | CSS px | SH-230 (Zafar, 6 Nov) | to tokenise (Onboard.LIGHT) | no |
| light corner | at most a quarter of the box's height | share | SH-196 (Zafar, 3 Nov) | to tokenise | no |
| dim | 0.45 | opacity | the s14 light (28 Oct) | `--njg-card14-dim` | no |
| hop | 0.1 of the thing's height | share | the judge, 23 Oct | to tokenise (Onboard.HOP) | no |
| finger | in 0.22, press 0.2, up 0.28, gap 0.5 | s | the help kit | to tokenise (Onboard.FINGER) | no |

## D2 When stuck

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| hint wait | 7, 9, 11, 13 by level | s | CHAI-56 (Zafar, 1 Nov: "7 or 9 or 11 seconds") | `data/rules.json` levels.hintS | with Zafar |
| hint stages | first time at once; the light at 5 idle; her line at 15 | s | the help ladder (principle 3) | to tokenise (Onboard.RUNGS) | with Zafar |
| help comes | at most the hint wait plus 4 | s | contract-91 (Zafar, 6 Nov) | not a token (the check) | no |

## D3 Nani's box and the helper card

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| Nani's line room | 2 | lines | SH-210 (5 Nov) | to tokenise | no |
| Nani's box fold | opens 0.45, shuts 0.5 | s | SH-215 (Zafar, 5 Nov) | to tokenise (`css/shared/order-card.css`) | no |

## E1 The frame

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| play area | 1600 x 900 | design px | the layout contract (23 Sept) | not a token | no |
| shelf band | the bottom 30% (630 of 900 down) | design px | SH-112 (Zafar, 20 Oct) | to tokenise (St.SHELF) | no |
| shelf line | 818 of 900 | design px | the shelf art's feet | to tokenise (chai's BASE) | no |
| chip line | 860 of 900, the chip 46 high | design px | SH-112 | to tokenise (St.SHELF.chipY) | no |
| chip tap | 142 x 80 | design px | as big as the band allows | to tokenise | no |
| shelf spacing | pitch 172, group gap 44 | design px | CHAI-66 (1 Nov) | to tokenise | yes |
| gap floor | the groups' gaps close to 20, no less | design px | SH-208 (Zafar, 4 Nov) | to tokenise | yes |
| pill word | at least 13, at most 1.5x; pills at least 4 apart | CSS px | SH-219 (Zafar, 6 Nov) | to tokenise | no |
| panel scale | the window's height / 665, from 0.66 to 1 | ratio | SH-185 (1 Nov) | `--njg-p` | no |
| card floor | 2.5 item cards show in a card's row | cards | SH-185 (Zafar, 2 Nov) | not a token (`css/shared/order-card.css`) | no |
| card fit time | a fitting card whole within 400 | ms | SH-191 (panelcheck) | not a token (the check) | no |
| side panel width | laptop clamp(200, 19vw, 360); phone up to 260 | CSS px | the frame (decision 24) | `--njg-side-w` | no |

## E2 Components

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| face sizes | 44, 56, 72 (phone 36, 40, 44); the tap 48 | CSS px | contract-42 (three sizes); SH-139 | `--njg-face`, `--njg-guide-face`, `--njg-big-face` | no |
| item padding floor | 2.6% of the row's width and at least 4 px, equal all round | share | SH-190 (1 Nov); the 4 px floor (Zafar, 7 Nov) | to tokenise (`--njg-itpad`) | no |
| speaker | drawn 32% of its card, up to 60; the tap at least 48 | CSS px | SH-147, SH-185 | `--njg-tap` | no |
| radius | 12 | CSS px | the design system's corner | `--njg-radius` | no |
| bubble words | no bigger than the order card's item words | - | SH-186 (1 Nov) | to tokenise | no |
| pop-out size | at most L1's size, one even scale | ratio | CHAI-43 (2 Nov) | to tokenise | no |

## E3 Art and materials

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| size classes | L 100%, M 91%, S 84% of the slot's height | share | Zafar, 6 Nov ("no true sizes") | `build/tools/art/data/look-rules.json` sizes | no |
| item floor | 40 CSS px at 740x320 (its slot 48) | CSS px | art bible §4 | `build/tools/art/data/look-rules.json` | no |

## E4 Motion

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| card fold | 0.42, cubic-bezier(0.3, 0.7, 0.2, 1) | s | SH-180 (Zafar, 1 Nov) | to tokenise (`css/shared/order-card.css`) | no |
| landing error | within 2 | CSS px | SH-203 (4 Nov) | not a token (the check) | no |
| word moment pace | speed 0.75; look 0.9; frame 0.5; each card 1; both: the pair hold (A3) | s | CHAI-70 (3 Nov), CHAI-81 (4 Nov); was 2.4 s | to tokenise (`js/cook/ui.js`) | yes, per moment |
| word moment room | top margin 4%; the glass at most 42% of the height; the counter at most 65% down | share | CHAI-86 (5 Nov), CHAI-101 (6 Nov) | to tokenise (`js/shared/word-moment.js`) | yes |
| stream gap | the spout 0.4 of a glass above the rim | glass | CHAI-86 (Zafar, 5 Nov) | to tokenise | no |
| glow, pulse | 1.2 each; the pulse to 1.06 | s | the kit's focal glow | `--njg-glow-ms`, `--njg-pulse-ms` | no |
| hop, talk | 0.9; 0.45 | s | the help kit; ART-18 | `--njg-hop-ms`, `--njg-talk-ms` | no |
| fold after done | 0.7 | s | the order card's fold (SH-148) | to tokenise (FOLD_AFTER) | yes |
| tick | 0.3 | s | the order card's tick | to tokenise | no |

## E5 Sound and voice

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| boil loudness | up from the first heat to 75% at the bubbling picture, held in the green, 100% past it | share | CHAI-95 (Zafar, 6 Nov) | to tokenise | yes |
| short pour | the first 0.9 of a real pour | s | Zafar's pick, 6 Nov (CHAI-92) | not a token (the clip) | yes |

## E6 Tokens

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| text floor | 14 | CSS px | the frame's floors (TXT-05) | `data/layout.json` | no |
| tap floor | 48 | CSS px | the frame's floors (LAY-04) | `--njg-tap` | no |
| spacing grid | 0, 4, 8, 12, then multiples of 8 | CSS px | LAY-03 (the CSS lint) | `--njg-s1` to `--njg-s7` | no |
| focus colour | #e0a63a | colour | decision 95, SH-53 | `--njg-focus` | no |
| stone | #dfd5cd | colour | his stone tile's mean (ART-41, 5 Nov) | `--njg-stone` | yes (a family's own panel) |
| Kutchi ink | maroon #7d2234 on cards | colour | SH-147 (27 Oct: maroon Kutchi) | `--njg-card14-kutchi` | no |
| type faces | Kutchi in Lora; English in Nunito Sans | - | SH-224 (6 Nov) | `--njg-font-kutchi`, `--njg-font-english` | no |

## F4 Devices and loading

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| picture retries | 3 tries, 0.3 apart | s | CHAI-91 (6 Nov) | to tokenise | no |
| load time growth | fails past 20% | share | the load-time baseline | `build/tools/review/data/loadtime-baseline.json` | no |
| site size | under 800 | MB | Zafar, 14 Oct | not a token (sitesize.mjs) | no |

## H1 Art

| Name | Value or formula | Unit | Derived from | Token or "to tokenise" | A family may change it |
|---|---|---|---|---|---|
| art queue | two days, about 240 pictures (about 120 a day) | pictures | ART-35 (Zafar, 2 Nov) | not a token | with Zafar |
