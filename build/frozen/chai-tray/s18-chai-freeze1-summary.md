# Sandbox run s18-chai-freeze1

15 flows, 30 pages (flow x size). Time spent in this run: 14 min 56 s of browser time (29 min of page time summed over 2 at a time). Contact sheets: `sheets/`. Raw data: `data/`. Sound: `sound.json`.

## Findings: 146 (unique per check, flow, size and selector)

By check: tap-small 95, covers-play-area 22, canvas-text-small 15, text-small 14

By page: cook.html 118, lab.html 28

## Sound (informational in the test build)

26 different spoken lines heard. **Recording gap list: 21 lines had no family clip** (they played a computer voice or an older file, the device voice, or nothing). 22 files that played were not an approved family clip (computer voice, unchecked, older recordings, device voice).

| line | what played | times | flows |
|---|---|---|---|
| dudh, | device-voice x47 | 47 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +21 |
| Thank you! | device-voice x30 | 30 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +27 |
| Khuda-fis! | device-voice x30 | 30 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +27 |
| hakro khun. | device-voice x29 | 29 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +11 |
| paani | device-voice x24 | 24 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +17 |
| chai | device-voice x21 | 21 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +15 |
| Muke chai khape, | device-voice x16 | 16 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +11 |
| Muke elchi waari chai khape, | device-voice x14 | 14 | cook:chai-tray@L2#mistake@1280x665, cook:chai-tray@L2#mistake@740x320, cook:chai-tray@L3#returning@1280x665 +9 |
| elchi | device-voice x8 | 8 | cook:chai-tray@L2#mistake@1280x665, cook:chai-tray@L2#mistake@740x320, lab:cook/chai-tray@L2#child@1280x665 +2 |
| trae khun. | device-voice x7 | 7 | cook:chai-tray@L2#mistake@1280x665, cook:chai-tray@L2@1280x665, cook:chai-tray@L2@740x320 +4 |
| jeeru | device-voice x5 | 5 | cook:chai-tray@L2#mistake@740x320, lab:cook/chai-tray@L3#child@740x320 |
| Elchi wiji chad! | device-voice x5 | 5 | cook:chai-tray@L2#mistake@740x320, lab:cook/chai-tray@L3#child@740x320 |
| Muke aadu waari chai khape, | device-voice x4 | 4 | cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320, cook:chai-tray@L3@1280x665 +1 |
| aadu | device-voice x4 | 4 | lab:cook/chai-tray@L2#child@1280x665, lab:cook/chai-tray@L2#child@740x320 |
| Muke chai me hakro khun khape. | device-voice x2 | 2 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320 |
| Khun wiji chad! | device-voice x2 | 2 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320 |
| khun | device-voice x2 | 2 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320 |
| Ne dudh. | device-voice x2 | 2 | cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320 |
| Muke chai me trae khun khape. | device-voice x2 | 2 | cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320 |
| Dudh wiji chad! | device-voice x2 | 2 | cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320 |
| Aadu wiji chad! | device-voice x1 | 1 | lab:cook/chai-tray@L2#child@740x320 |

### Played but not an approved family clip

| kind | file or text | times |
|---|---|---|
| device-voice | chai | 59 |
| device-voice | dudh | 51 |
| device-voice | khun | 44 |
| family-unchecked | assets/audio/family/mum/slow.mp3 | 43 |
| family-unchecked | assets/audio/family/mum/kar.mp3 | 43 |
| device-voice | muke | 38 |
| device-voice | khape | 38 |
| device-voice | hakro | 31 |
| device-voice | thank you | 30 |
| device-voice | khuda-fis | 30 |
| device-voice | elchi | 27 |
| device-voice | paani | 24 |
| device-voice | waari | 18 |
| device-voice | wiji | 10 |
| device-voice | chad | 10 |
| device-voice | trae | 9 |
| device-voice | aadu | 9 |
| device-voice | jeeru | 5 |
| device-voice | me | 4 |
| family-unchecked | assets/audio/family/mum/chulo.mp3 | 4 |
| family-unchecked | assets/audio/family/mum/bar.mp3 | 4 |
| device-voice | ne | 2 |

## Flows

| flow | size | end | states | findings | page errors | seconds |
|---|---|---|---|---|---|---|
| cook:chai-tray#hint | 1280x665 | yes | 13 | 6 | 0 | 41 |
| cook:chai-tray#hint | 740x320 | yes | 13 | 11 | 0 | 40 |
| cook:chai-tray#mistake | 1280x665 | yes | 13 | 5 | 0 | 31 |
| cook:chai-tray#mistake | 740x320 | yes | 13 | 9 | 0 | 32 |
| cook:chai-tray#returning | 1280x665 | yes | 13 | 6 | 0 | 42 |
| cook:chai-tray#returning | 740x320 | yes | 13 | 11 | 0 | 42 |
| cook:chai-tray#takeback | 1280x665 | yes | 14 | 5 | 0 | 31 |
| cook:chai-tray#takeback | 740x320 | yes | 14 | 9 | 0 | 31 |
| cook:chai-tray@L2#mistake | 1280x665 | yes | 13 | 6 | 0 | 43 |
| cook:chai-tray@L2#mistake | 740x320 | yes | 13 | 9 | 0 | 71 |
| cook:chai-tray@L2 | 1280x665 | yes | 12 | 5 | 0 | 38 |
| cook:chai-tray@L2 | 740x320 | yes | 12 | 10 | 0 | 38 |
| cook:chai-tray@L3#hint | 1280x665 | yes | 13 | 7 | 0 | 52 |
| cook:chai-tray@L3#hint | 740x320 | yes | 13 | 11 | 0 | 53 |
| cook:chai-tray@L3#returning | 1280x665 | yes | 13 | 6 | 0 | 56 |
| cook:chai-tray@L3#returning | 740x320 | yes | 13 | 11 | 0 | 56 |
| cook:chai-tray@L3 | 1280x665 | yes | 12 | 7 | 0 | 39 |
| cook:chai-tray@L3 | 740x320 | yes | 12 | 9 | 0 | 40 |
| cook:chai-tray@L4 | 1280x665 | yes | 12 | 8 | 0 | 55 |
| cook:chai-tray@L4 | 740x320 | yes | 12 | 13 | 0 | 56 |
| cook:chai-tray | 1280x665 | yes | 12 | 5 | 0 | 29 |
| cook:chai-tray | 740x320 | yes | 12 | 9 | 0 | 27 |
| lab:cook/chai-tray#child | 1280x665 | yes | 10 | 4 | 0 | 59 |
| lab:cook/chai-tray#child | 740x320 | yes | 10 | 8 | 0 | 59 |
| lab:cook/chai-tray@L2#child | 1280x665 | yes | 10 | 4 | 0 | 94 |
| lab:cook/chai-tray@L2#child | 740x320 | yes | 10 | 9 | 0 | 107 |
| lab:cook/chai-tray@L3#child | 1280x665 | yes | 10 | 5 | 0 | 90 |
| lab:cook/chai-tray@L3#child | 740x320 | yes | 10 | 9 | 0 | 117 |
| lab:cook/chai-tray@L4#child | 1280x665 | yes | 10 | 5 | 0 | 148 |
| lab:cook/chai-tray@L4#child | 740x320 | yes | 10 | 9 | 0 | 149 |

## States

### cook:chai-tray#hint @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `kind-tap` (cook.html): 2 findings
6. `hint-nani-says` (cook.html): 3 findings
7. `hint-glow` (cook.html): 3 findings
8. `kind-timing` (cook.html): 2 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray#hint @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `hint-nani-says` (cook.html): 7 findings
7. `hint-glow` (cook.html): 7 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray#mistake @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `kind-tap` (cook.html): 2 findings
6. `wrong-tap` (cook.html): 2 findings
7. `help-open` (cook.html): 2 findings
8. `kind-timing` (cook.html): 2 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray#mistake @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `wrong-tap` (cook.html): 5 findings
7. `help-open` (cook.html): 5 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray#returning @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `hint-nani-says` (cook.html): 3 findings
6. `hint-glow` (cook.html): 3 findings
7. `kind-tap` (cook.html): 3 findings
8. `kind-timing` (cook.html): 2 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray#returning @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `hint-nani-says` (cook.html): 7 findings
6. `hint-glow` (cook.html): 7 findings
7. `kind-tap` (cook.html): 7 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray#takeback @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `help-open` (cook.html): 2 findings
6. `kind-tap` (cook.html): 2 findings
7. `before-takeback` (cook.html): 2 findings
8. `after-takeback` (cook.html): 2 findings
9. `kind-timing` (cook.html): 2 findings
10. `view-service` (cook.html): 0 findings
11. `kind-click` (cook.html): 0 findings
12. `results-badges` (cook.html): 0 findings
13. `results-words` (cook.html): 0 findings
14. `result` (cook.html): 0 findings

### cook:chai-tray#takeback @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `help-open` (cook.html): 5 findings
6. `kind-tap` (cook.html): 5 findings
7. `before-takeback` (cook.html): 4 findings
8. `after-takeback` (cook.html): 5 findings
9. `kind-timing` (cook.html): 4 findings
10. `view-service` (cook.html): 0 findings
11. `kind-click` (cook.html): 0 findings
12. `results-badges` (cook.html): 0 findings
13. `results-words` (cook.html): 0 findings
14. `result` (cook.html): 0 findings

### cook:chai-tray@L2#mistake @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 3 findings
4. `view-marble` (cook.html): 2 findings
5. `kind-tap` (cook.html): 2 findings
6. `wrong-tap` (cook.html): 2 findings
7. `help-open` (cook.html): 2 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L2#mistake @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 4 findings
4. `view-marble` (cook.html): 4 findings
5. `kind-tap` (cook.html): 5 findings
6. `wrong-tap` (cook.html): 5 findings
7. `help-open` (cook.html): 5 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L2 @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `kind-tap` (cook.html): 2 findings
6. `help-open` (cook.html): 4 findings
7. `kind-timing` (cook.html): 2 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L2 @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 4 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `help-open` (cook.html): 5 findings
7. `kind-timing` (cook.html): 4 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L3#hint @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 3 findings
4. `view-marble` (cook.html): 2 findings
5. `kind-tap` (cook.html): 2 findings
6. `hint-nani-says` (cook.html): 2 findings
7. `hint-glow` (cook.html): 3 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L3#hint @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 4 findings
4. `view-marble` (cook.html): 4 findings
5. `kind-tap` (cook.html): 5 findings
6. `hint-nani-says` (cook.html): 5 findings
7. `hint-glow` (cook.html): 7 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L3#returning @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `hint-nani-says` (cook.html): 2 findings
6. `hint-glow` (cook.html): 3 findings
7. `kind-tap` (cook.html): 3 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L3#returning @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `hint-nani-says` (cook.html): 5 findings
6. `hint-glow` (cook.html): 7 findings
7. `kind-tap` (cook.html): 7 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L3 @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 3 findings
4. `view-marble` (cook.html): 3 findings
5. `kind-tap` (cook.html): 2 findings
6. `help-open` (cook.html): 2 findings
7. `kind-timing` (cook.html): 2 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L3 @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 4 findings
4. `view-marble` (cook.html): 4 findings
5. `kind-tap` (cook.html): 5 findings
6. `help-open` (cook.html): 5 findings
7. `kind-timing` (cook.html): 4 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L4 @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 3 findings
4. `view-marble` (cook.html): 2 findings
5. `kind-tap` (cook.html): 2 findings
6. `help-open` (cook.html): 2 findings
7. `kind-timing` (cook.html): 6 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L4 @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 4 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `help-open` (cook.html): 5 findings
7. `kind-timing` (cook.html): 7 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `kind-tap` (cook.html): 2 findings
6. `help-open` (cook.html): 2 findings
7. `kind-timing` (cook.html): 2 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `help-open` (cook.html): 5 findings
7. `kind-timing` (cook.html): 4 findings
8. `view-service` (cook.html): 0 findings
9. `kind-click` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### lab:cook/chai-tray#child @ 1280x665

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 2 findings
4. `chai-tray-view-marble` (lab.html): 2 findings
5. `chai-tray-kind-tap` (lab.html): 2 findings
6. `chai-tray-kind-timing` (lab.html): 2 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

### lab:cook/chai-tray#child @ 740x320

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 5 findings
4. `chai-tray-view-marble` (lab.html): 5 findings
5. `chai-tray-kind-tap` (lab.html): 5 findings
6. `chai-tray-kind-timing` (lab.html): 4 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L2#child @ 1280x665

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 2 findings
4. `chai-tray-view-marble` (lab.html): 2 findings
5. `chai-tray-kind-tap` (lab.html): 2 findings
6. `chai-tray-kind-timing` (lab.html): 4 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L2#child @ 740x320

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 4 findings
4. `chai-tray-view-marble` (lab.html): 5 findings
5. `chai-tray-kind-tap` (lab.html): 5 findings
6. `chai-tray-kind-timing` (lab.html): 4 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L3#child @ 1280x665

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 2 findings
4. `chai-tray-view-marble` (lab.html): 3 findings
5. `chai-tray-kind-tap` (lab.html): 2 findings
6. `chai-tray-kind-timing` (lab.html): 4 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L3#child @ 740x320

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 4 findings
4. `chai-tray-view-marble` (lab.html): 5 findings
5. `chai-tray-kind-tap` (lab.html): 5 findings
6. `chai-tray-kind-timing` (lab.html): 4 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L4#child @ 1280x665

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 2 findings
4. `chai-tray-view-marble` (lab.html): 3 findings
5. `chai-tray-kind-tap` (lab.html): 2 findings
6. `chai-tray-kind-timing` (lab.html): 4 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L4#child @ 740x320

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 4 findings
4. `chai-tray-view-marble` (lab.html): 5 findings
5. `chai-tray-kind-tap` (lab.html): 5 findings
6. `chai-tray-kind-timing` (lab.html): 4 findings
7. `chai-tray-view-service` (lab.html): 0 findings
8. `results-badges` (lab.html): 0 findings
9. `results-words` (lab.html): 0 findings
10. `end` (lab.html): 0 findings

