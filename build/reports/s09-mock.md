# s09-mock: the look in code (19 Oct 2026)

Static mock-ups for Zafar to agree the look of each new screen before any ChatGPT art: the morning door in four weathers, the evening book and the window ride. Open `lab/mock-s09/index.html`; every screen is a live page (resize for the phone layout). The frame, Nani's guide box, the card look and the buttons are the real shared ones (`js/shared`, `css/shared`); the scenes are drawn in code and listed below as "to draw". No Kutchi is written that does not already exist in `data/lang` or `data/family-audio.json`; a line still to record is its English in grey italic (decision 84).

## Open questions for Zafar

1. **The door's sidebar:** under Nani's box there is one small card (the sky → the place). Keep it, or leave the sidebar empty for a story beat? Recommend keep: it is the day's plan with no words.
2. **The answer:** Ha! and Na as the shared pills (Na shakes, as in the first launch), or Ha! alone? Recommend the pair.
3. **Stop the car:** Nani shouts *Gadi ke ubhi rakh!* and the child taps the goat in the road (mocked), or the child taps a pill to shout it? Recommend Nani shouts, the child taps.
4. **The evening book's progress mark:** today's words as gold-edged cards and a shelf where each finished day is a book (decision 4), no stars (CMP-12). OK?
5. **The child in the book:** the player's own character (the flat placeholder today) sits beside Nani; it needs its 3D-style art before this ships.

## The screenshots (`build/reports/s09-mock/`)

| Screen | 1366×768 | 844×390 | What each element does |
|---|---|---|---|
| Door, sunny (beach) | door-beach-1366x768.jpg | door-beach-844x390.jpg | The fixed house; the sky swapped; a warm tint and the sun-shadow layer (tree dapple, frame, poles) only here. Nani at her open door; her line one short sentence at a time in a cream bubble, Kutchi with its English beneath (rule 5); the dots mark which sentence; the thought bubble shows the beach; the card shows sky → place; Ha! pulses, Na shakes |
| Door, raining (cooking day) | door-cook-1366x768.jpg | door-cook-844x390.jpg | The same house; rain drawn in code, puddles, a blue-grey tint; the kitchen in the thought bubble; *Panke randhnu khapdo* / *Tu muke randhan lai madad kar de?* (recorded) |
| Door, the weather word alone | door-cook-s1-1366x768.jpg | | The first sentence: *Warsaad.* (Rain.) |
| Door, cloudy (clinic day) | door-clinic-1366x768.jpg | door-clinic-844x390.jpg | Grey tint, big clouds, no shadows; the waiting room in the thought bubble; *Tu muke help kar de?* (recorded) |
| Door, the sentence with the gesture | door-beach-s2-1366x768.jpg | | The second sentence (her gesture pose is to draw) |
| Door, night (home again) | door-night-1366x768.jpg | door-night-844x390.jpg | Stars and a moon; a deep blue tint; the lantern lit and the window warm; *Shabash!* then "Shall I tell you what we did today?" |
| Book p1–p6 | book-p1…p6-1366x768.jpg | book-p1…p6-844x390.jpg | The sitting room relit for night; Nani leans on the book, the child beside her. p1 today's door and *gadi*; p2 "you spotted a …" with the gap's two picture pills (rung G1); p3 *trae bateta*, *makai*; p4 the two prints from Snap (*bakri sathe*, *laal darwajo*), a gold corner; p5 today's words as gold cards and the shelf of days; p6 goodnight (the lamp, the moon) and tomorrow's door under cloud. → turns the page, ✓ ends |
| Ride, the car | ride-car-1366x768.jpg | ride-car-844x390.jpg | The farm road scrolls past the side window like the clinic belt; Nani names *laal darwajo*; the red door passes with a blue one, the she-goat with the billy goat; the card holds what has been spotted |
| Ride, stop the car | ride-car-stop-1366x768.jpg | ride-car-stop-844x390.jpg | A goat steps into the road, the car stops, *Gadi ke ubhi rakh!*, the goat glows |
| Ride, the bus | ride-bus-1366x768.jpg | ride-bus-844x390.jpg | The same road from a bus seat (the beach day's ride) |
| Ride filmstrip | ride-filmstrip.jpg (0 s, 3 s, 6 s) | | The scroll |

## To draw in ChatGPT (the art plan)

| Piece | What | Notes |
|---|---|---|
| The house front and foreground | One picture, the camera of the courtyard bg: limewash wall with a flat parapet, the blue double door (one leaf open, the inside dark), a window with sage shutters, the terracotta pot, the hen coop, the clothes line, the tree behind the annex, sand ground with a step | No sky in it (the sky is a separate layer from the parapet up); a cut-out alpha above the wall |
| Four skies | Sunny, cloudy, raining (dark cloud, rain drawn in code), night with stars and a round moon | Each the full width, from the horizon up |
| The sun-shadow layer | The tree's dapple, the frame's and poles' shadows, on transparent | Shown only under the sunny sky |
| Nani's door poses | Standing in the doorway (arms down), arms out (rain), fanning herself (hot), pointing to the sky, waving you in | Full standing figure, the s08 lineup style |
| The thought-bubble pictures | The beach (sea, sand, a bucket); the others reuse real backgrounds | |
| The book | The open book's cream pages with a thin gold border and a spine; the shelf of day-books; the lamp | Pages are built from existing art |
| The child | The player's character in the 3D style, seated, upper body | Blocked on the character design |
| The car interior | Side window with pillars, roof lining, door panel with armrest and handle | Window area transparent |
| The bus interior | Window with a rubber seal, a seat back in front, the rail, a stranger's shoulder | |
| The farm road strip | Three views wide, tileable: sky, hills, fields, fence, road; two village houses (a red and a blue door), two trees, a bird | Goats, hens and chicks are the existing sprites |
| The car and the corn on the fire | Book-page pictures | |

## Proof

- Browser checks under 15 min: 32 + 14 + 12 screenshots in three lock sessions, each looked at (flaws below).
- `node build/tools/review/checks.mjs`: see the line at the end.
- Word lint: scans js/cook, js/clinic, js/shared only; no mock file is in it.
- `touched.mjs` maps the whole branch diff (other builders' commits): no mock file is in any flow, so no sandbox pass was run; left to the orchestrator's `/review`.
- No fix-list row is touched; no evidence spec changed.

## QA checklist, flaws first

- The house, car, bus, book shelf and farm strip are code drawings: flat, not the art bible's 3D look (by design: "to draw").
- The child beside Nani is the flat placeholder character.
- Nani's standing figure has one pose at every step (the gesture poses are to draw).
- Book p5 phone: two columns of word cards so no word breaks (checked at 844×390).
- TXT-03/05, LAY-01/02/04/05, CMP-01/02/04/06/15, LNG-01/04: pass by eye at both sizes (fonts Nunito at the token sizes; no clipped text; taps ≥ 48 px; the guide box, card, pills, Next and ✓ from the shared kit; English only under her door lines; every unrecorded line grey italic with `data-rec`).
