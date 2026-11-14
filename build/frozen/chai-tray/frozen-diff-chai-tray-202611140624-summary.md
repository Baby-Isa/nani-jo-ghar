# Sandbox run frozen-diff-chai-tray-202611140624

15 flows, 30 pages (flow x size). Time spent in this run: 17 min 21 s of browser time (34 min of page time summed over 2 at a time). Contact sheets: `sheets/`. Raw data: `data/`. Sound: `sound.json`.

## Findings: 215 (unique per check, flow, size and selector)

By check: tap-small 84, text-small 72, covers-play-area 22, covered 22, canvas-text-small 15

By page: cook.html 169, lab.html 46

## Sound (informational in the test build)

28 different spoken lines heard. **Recording gap list: 15 lines had no family clip** (they played a computer voice or an older file, the device voice, or nothing). 29 files that played were not an approved family clip (computer voice, unchecked, older recordings, device voice).

| line | what played | times | flows |
|---|---|---|---|
| Iloka je glass me wij. | device-voice x40 | 40 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +27 |
| Thank you! | device-voice x30 | 30 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +27 |
| Khuda-fis! | device-voice x30 | 30 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +27 |
| paani | device-voice x24 | 24 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +17 |
| Muke chai khapeti, | device-voice x16 | 16 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320, cook:chai-tray#mistake@1280x665 +11 |
| Muke elchi waari chai khapeti, | device-voice x14 | 14 | cook:chai-tray@L2#mistake@1280x665, cook:chai-tray@L2#mistake@740x320, cook:chai-tray@L3#returning@1280x665 +9 |
| Akho burichad. | device-voice x7 | 7 | cook:chai-tray@L4@1280x665, cook:chai-tray@L4@740x320, lab:cook/chai-tray@L4#child@1280x665 +1 |
| Paani tapele me wij. | device-voice x4 | 4 | cook:chai-tray#returning@1280x665, cook:chai-tray#returning@740x320, cook:chai-tray@L3#returning@1280x665 +1 |
| Muke aadu waari chai khapeti, | device-voice x4 | 4 | cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320, cook:chai-tray@L3@1280x665 +1 |
| Ne dudh. | device-voice x3 | 3 | cook:chai-tray#hint@740x320, cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320 |
| Munji chai me hakro khun khape. | device-voice x2 | 2 | cook:chai-tray#hint@1280x665, cook:chai-tray#hint@740x320 |
| Munji chai me trae khun khape. | device-voice x2 | 2 | cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320 |
| Aadu wiji chad! | device-voice x2 | 2 | cook:chai-tray@L3#hint@1280x665, cook:chai-tray@L3#hint@740x320 |
| Khun wiji chad! | device-voice x1 | 1 | cook:chai-tray#hint@1280x665 |
| Dudh wiji chad! | device-voice x1 | 1 | cook:chai-tray#hint@740x320 |

### Played but not an approved family clip

| kind | file or text | times |
|---|---|---|
| family-unchecked | assets/audio/family/mum/chai.mp3 | 62 |
| family-unchecked | assets/audio/family/mum/me-word.mp3 | 48 |
| family-unchecked | assets/audio/family/mum/dudh.mp3 | 44 |
| device-voice | wij | 44 |
| family-unchecked | assets/audio/family/mum/slow.mp3 | 42 |
| family-unchecked | assets/audio/family/mum/kar.mp3 | 42 |
| device-voice | iloka | 40 |
| device-voice | je | 40 |
| device-voice | glass | 40 |
| device-voice | muke | 34 |
| family-unchecked | assets/audio/family/mum/khapeti.mp3 | 33 |
| device-voice | thank you | 30 |
| device-voice | khuda-fis | 30 |
| device-voice | paani | 28 |
| family-unchecked | assets/audio/family/mum/khun.mp3 | 25 |
| family-unchecked | assets/audio/family/mum/hakro.mp3 | 20 |
| family-unchecked | assets/audio/family/mum/waari.mp3 | 20 |
| family-unchecked | assets/audio/family/mum/elchi.mp3 | 19 |
| family-unchecked | assets/audio/family/mum/aadu.mp3 | 12 |
| family-unchecked | assets/audio/family/mum/chulo.mp3 | 7 |
| family-unchecked | assets/audio/family/mum/bar.mp3 | 7 |
| device-voice | akho burichad | 7 |
| family-unchecked | assets/audio/family/mum/trae.mp3 | 6 |
| device-voice | munji | 4 |
| device-voice | khape | 4 |
| device-voice | wiji | 4 |
| device-voice | chad | 4 |
| device-voice | tapele | 4 |
| device-voice | ne | 3 |

## Flows

| flow | size | end | states | findings | page errors | seconds |
|---|---|---|---|---|---|---|
| cook:chai-tray#hint | 1280x665 | yes | 13 | 6 | 0 | 46 |
| cook:chai-tray#hint | 740x320 | yes | 13 | 12 | 0 | 46 |
| cook:chai-tray#mistake | 1280x665 | yes | 13 | 5 | 0 | 33 |
| cook:chai-tray#mistake | 740x320 | yes | 13 | 10 | 0 | 39 |
| cook:chai-tray#returning | 1280x665 | yes | 13 | 6 | 0 | 43 |
| cook:chai-tray#returning | 740x320 | yes | 13 | 12 | 0 | 47 |
| cook:chai-tray#takeback | 1280x665 | yes | 14 | 5 | 0 | 33 |
| cook:chai-tray#takeback | 740x320 | yes | 14 | 10 | 0 | 38 |
| cook:chai-tray@L2#mistake | 1280x665 | yes | 13 | 7 | 0 | 49 |
| cook:chai-tray@L2#mistake | 740x320 | yes | 13 | 14 | 0 | 68 |
| cook:chai-tray@L2 | 1280x665 | yes | 12 | 5 | 0 | 43 |
| cook:chai-tray@L2 | 740x320 | yes | 12 | 15 | 0 | 57 |
| cook:chai-tray@L3#hint | 1280x665 | yes | 13 | 9 | 0 | 58 |
| cook:chai-tray@L3#hint | 740x320 | yes | 13 | 16 | 0 | 78 |
| cook:chai-tray@L3#returning | 1280x665 | yes | 13 | 7 | 0 | 58 |
| cook:chai-tray@L3#returning | 740x320 | yes | 13 | 13 | 0 | 77 |
| cook:chai-tray@L3 | 1280x665 | yes | 12 | 7 | 0 | 45 |
| cook:chai-tray@L3 | 740x320 | yes | 12 | 14 | 0 | 59 |
| cook:chai-tray@L4 | 1280x665 | yes | 12 | 10 | 0 | 61 |
| cook:chai-tray@L4 | 740x320 | yes | 12 | 17 | 0 | 95 |
| cook:chai-tray | 1280x665 | yes | 12 | 5 | 0 | 31 |
| cook:chai-tray | 740x320 | yes | 12 | 10 | 0 | 32 |
| lab:cook/chai-tray#child | 1280x665 | yes | 10 | 4 | 0 | 61 |
| lab:cook/chai-tray#child | 740x320 | yes | 11 | 9 | 0 | 63 |
| lab:cook/chai-tray@L2#child | 1280x665 | yes | 11 | 4 | 0 | 103 |
| lab:cook/chai-tray@L2#child | 740x320 | yes | 11 | 10 | 0 | 125 |
| lab:cook/chai-tray@L3#child | 1280x665 | yes | 11 | 4 | 0 | 102 |
| lab:cook/chai-tray@L3#child | 740x320 | yes | 11 | 10 | 0 | 115 |
| lab:cook/chai-tray@L4#child | 1280x665 | yes | 11 | 5 | 0 | 165 |
| lab:cook/chai-tray@L4#child | 740x320 | yes | 12 | 10 | 0 | 205 |

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
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `hint-nani-says` (cook.html): 7 findings
7. `hint-glow` (cook.html): 7 findings
8. `kind-timing` (cook.html): 5 findings
9. `view-service` (cook.html): 2 findings
10. `kind-click` (cook.html): 2 findings
11. `results-badges` (cook.html): 2 findings
12. `results-words` (cook.html): 2 findings
13. `result` (cook.html): 2 findings

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
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `wrong-tap` (cook.html): 5 findings
7. `help-open` (cook.html): 5 findings
8. `kind-timing` (cook.html): 5 findings
9. `view-service` (cook.html): 2 findings
10. `kind-click` (cook.html): 2 findings
11. `results-badges` (cook.html): 2 findings
12. `results-words` (cook.html): 2 findings
13. `result` (cook.html): 2 findings

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
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `hint-nani-says` (cook.html): 7 findings
6. `hint-glow` (cook.html): 7 findings
7. `kind-tap` (cook.html): 7 findings
8. `kind-timing` (cook.html): 5 findings
9. `view-service` (cook.html): 2 findings
10. `kind-click` (cook.html): 2 findings
11. `results-badges` (cook.html): 2 findings
12. `results-words` (cook.html): 2 findings
13. `result` (cook.html): 2 findings

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
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `help-open` (cook.html): 5 findings
6. `kind-tap` (cook.html): 5 findings
7. `before-takeback` (cook.html): 5 findings
8. `after-takeback` (cook.html): 5 findings
9. `kind-timing` (cook.html): 5 findings
10. `view-service` (cook.html): 2 findings
11. `kind-click` (cook.html): 2 findings
12. `results-badges` (cook.html): 2 findings
13. `results-words` (cook.html): 2 findings
14. `result` (cook.html): 2 findings

### cook:chai-tray@L2#mistake @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `kind-click` (cook.html): 2 findings
5. `view-marble` (cook.html): 2 findings
6. `kind-tap` (cook.html): 2 findings
7. `wrong-tap` (cook.html): 2 findings
8. `help-open` (cook.html): 2 findings
9. `kind-timing` (cook.html): 4 findings
10. `view-service` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L2#mistake @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `kind-click` (cook.html): 5 findings
5. `view-marble` (cook.html): 5 findings
6. `kind-tap` (cook.html): 5 findings
7. `wrong-tap` (cook.html): 5 findings
8. `help-open` (cook.html): 5 findings
9. `kind-timing` (cook.html): 6 findings
10. `view-service` (cook.html): 2 findings
11. `results-badges` (cook.html): 2 findings
12. `results-words` (cook.html): 2 findings
13. `result` (cook.html): 2 findings

### cook:chai-tray@L2 @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 0 findings
4. `kind-click` (cook.html): 0 findings
5. `view-marble` (cook.html): 2 findings
6. `kind-tap` (cook.html): 2 findings
7. `help-open` (cook.html): 2 findings
8. `kind-timing` (cook.html): 2 findings
9. `view-service` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L2 @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `kind-click` (cook.html): 5 findings
5. `view-marble` (cook.html): 5 findings
6. `kind-tap` (cook.html): 5 findings
7. `help-open` (cook.html): 6 findings
8. `kind-timing` (cook.html): 6 findings
9. `view-service` (cook.html): 2 findings
10. `results-badges` (cook.html): 2 findings
11. `results-words` (cook.html): 2 findings
12. `result` (cook.html): 2 findings

### cook:chai-tray@L3#hint @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `kind-click` (cook.html): 2 findings
5. `view-marble` (cook.html): 2 findings
6. `kind-tap` (cook.html): 2 findings
7. `hint-nani-says` (cook.html): 2 findings
8. `hint-glow` (cook.html): 4 findings
9. `kind-timing` (cook.html): 4 findings
10. `view-service` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L3#hint @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `kind-click` (cook.html): 5 findings
5. `view-marble` (cook.html): 5 findings
6. `kind-tap` (cook.html): 5 findings
7. `hint-nani-says` (cook.html): 5 findings
8. `hint-glow` (cook.html): 7 findings
9. `kind-timing` (cook.html): 6 findings
10. `view-service` (cook.html): 2 findings
11. `results-badges` (cook.html): 2 findings
12. `results-words` (cook.html): 2 findings
13. `result` (cook.html): 2 findings

### cook:chai-tray@L3#returning @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `view-marble` (cook.html): 2 findings
5. `hint-nani-says` (cook.html): 2 findings
6. `hint-glow` (cook.html): 4 findings
7. `kind-tap` (cook.html): 4 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `kind-click` (cook.html): 0 findings
11. `results-badges` (cook.html): 0 findings
12. `results-words` (cook.html): 0 findings
13. `result` (cook.html): 0 findings

### cook:chai-tray@L3#returning @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `hint-nani-says` (cook.html): 5 findings
6. `hint-glow` (cook.html): 7 findings
7. `kind-tap` (cook.html): 7 findings
8. `kind-timing` (cook.html): 6 findings
9. `view-service` (cook.html): 2 findings
10. `kind-click` (cook.html): 2 findings
11. `results-badges` (cook.html): 2 findings
12. `results-words` (cook.html): 2 findings
13. `result` (cook.html): 2 findings

### cook:chai-tray@L3 @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 2 findings
4. `kind-click` (cook.html): 2 findings
5. `view-marble` (cook.html): 2 findings
6. `kind-tap` (cook.html): 2 findings
7. `help-open` (cook.html): 2 findings
8. `kind-timing` (cook.html): 4 findings
9. `view-service` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L3 @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `kind-click` (cook.html): 5 findings
5. `view-marble` (cook.html): 5 findings
6. `kind-tap` (cook.html): 5 findings
7. `help-open` (cook.html): 5 findings
8. `kind-timing` (cook.html): 6 findings
9. `view-service` (cook.html): 2 findings
10. `results-badges` (cook.html): 2 findings
11. `results-words` (cook.html): 2 findings
12. `result` (cook.html): 2 findings

### cook:chai-tray@L4 @ 1280x665

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 1 findings
3. `order-card-in-sidebar` (cook.html): 3 findings
4. `kind-click` (cook.html): 3 findings
5. `view-marble` (cook.html): 2 findings
6. `kind-tap` (cook.html): 2 findings
7. `help-open` (cook.html): 2 findings
8. `kind-timing` (cook.html): 6 findings
9. `view-service` (cook.html): 0 findings
10. `results-badges` (cook.html): 0 findings
11. `results-words` (cook.html): 0 findings
12. `result` (cook.html): 0 findings

### cook:chai-tray@L4 @ 740x320

1. `start` (cook.html): 0 findings
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `kind-click` (cook.html): 5 findings
5. `view-marble` (cook.html): 5 findings
6. `kind-tap` (cook.html): 5 findings
7. `help-open` (cook.html): 6 findings
8. `kind-timing` (cook.html): 8 findings
9. `view-service` (cook.html): 2 findings
10. `results-badges` (cook.html): 2 findings
11. `results-words` (cook.html): 2 findings
12. `result` (cook.html): 2 findings

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
2. `order-card-big` (cook.html): 3 findings
3. `order-card-in-sidebar` (cook.html): 5 findings
4. `view-marble` (cook.html): 5 findings
5. `kind-tap` (cook.html): 5 findings
6. `help-open` (cook.html): 5 findings
7. `kind-timing` (cook.html): 5 findings
8. `view-service` (cook.html): 2 findings
9. `kind-click` (cook.html): 2 findings
10. `results-badges` (cook.html): 2 findings
11. `results-words` (cook.html): 2 findings
12. `result` (cook.html): 2 findings

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
2. `chai-tray-order-card-big` (lab.html): 2 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 5 findings
4. `chai-tray-view-marble` (lab.html): 5 findings
5. `chai-tray-kind-tap` (lab.html): 5 findings
6. `chai-tray-kind-timing` (lab.html): 5 findings
7. `chai-tray-view-service` (lab.html): 2 findings
8. `chai-tray-view-null` (lab.html): 0 findings
9. `results-badges` (lab.html): 0 findings
10. `results-words` (lab.html): 0 findings
11. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L2#child @ 1280x665

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 2 findings
4. `chai-tray-kind-click` (lab.html): 2 findings
5. `chai-tray-view-marble` (lab.html): 1 findings
6. `chai-tray-kind-tap` (lab.html): 1 findings
7. `chai-tray-kind-timing` (lab.html): 2 findings
8. `chai-tray-view-service` (lab.html): 0 findings
9. `results-badges` (lab.html): 0 findings
10. `results-words` (lab.html): 0 findings
11. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L2#child @ 740x320

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 2 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 5 findings
4. `chai-tray-kind-click` (lab.html): 5 findings
5. `chai-tray-view-marble` (lab.html): 4 findings
6. `chai-tray-kind-tap` (lab.html): 4 findings
7. `chai-tray-kind-timing` (lab.html): 4 findings
8. `chai-tray-view-service` (lab.html): 2 findings
9. `results-badges` (lab.html): 0 findings
10. `results-words` (lab.html): 0 findings
11. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L3#child @ 1280x665

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 2 findings
4. `chai-tray-kind-click` (lab.html): 2 findings
5. `chai-tray-view-marble` (lab.html): 1 findings
6. `chai-tray-kind-tap` (lab.html): 1 findings
7. `chai-tray-kind-timing` (lab.html): 2 findings
8. `chai-tray-view-service` (lab.html): 0 findings
9. `results-badges` (lab.html): 0 findings
10. `results-words` (lab.html): 0 findings
11. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L3#child @ 740x320

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 2 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 5 findings
4. `chai-tray-kind-click` (lab.html): 5 findings
5. `chai-tray-view-marble` (lab.html): 4 findings
6. `chai-tray-kind-tap` (lab.html): 4 findings
7. `chai-tray-kind-timing` (lab.html): 4 findings
8. `chai-tray-view-service` (lab.html): 2 findings
9. `results-badges` (lab.html): 0 findings
10. `results-words` (lab.html): 0 findings
11. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L4#child @ 1280x665

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 0 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 3 findings
4. `chai-tray-kind-click` (lab.html): 3 findings
5. `chai-tray-view-marble` (lab.html): 1 findings
6. `chai-tray-kind-tap` (lab.html): 1 findings
7. `chai-tray-kind-timing` (lab.html): 2 findings
8. `chai-tray-view-service` (lab.html): 0 findings
9. `results-badges` (lab.html): 0 findings
10. `results-words` (lab.html): 0 findings
11. `end` (lab.html): 0 findings

### lab:cook/chai-tray@L4#child @ 740x320

1. `chai-tray-start` (lab.html): 0 findings
2. `chai-tray-order-card-big` (lab.html): 2 findings
3. `chai-tray-order-card-in-sidebar` (lab.html): 5 findings
4. `chai-tray-kind-click` (lab.html): 5 findings
5. `chai-tray-view-marble` (lab.html): 4 findings
6. `chai-tray-kind-tap` (lab.html): 4 findings
7. `chai-tray-kind-timing` (lab.html): 4 findings
8. `chai-tray-view-service` (lab.html): 2 findings
9. `chai-tray-view-null` (lab.html): 0 findings
10. `results-badges` (lab.html): 0 findings
11. `results-words` (lab.html): 0 findings
12. `end` (lab.html): 0 findings

