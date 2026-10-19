# s09-mock: the look in code (19 Oct 2026)

Static mock-ups so Zafar can agree each new screen before any ChatGPT art. Open `lab/mock-s09/index.html`; every screen is a live page. The frame, Nani's box, cards and buttons are the real shared ones; the scenes are drawn in code ("to draw" below). Only Kutchi already in `data/lang` or `data/family-audio.json` is written; an unrecorded line is grey-italic English (decision 84).

## Open questions for Zafar

1. The door's sidebar: one small card (sky → place) under Nani's box, or empty? Recommend keep.
2. The answer: Ha! and Na pills (Na shakes), or Ha! alone? Recommend the pair.
3. Stop the car: Nani shouts *Gadi ke ubhi rakh!* and the child taps the goat (mocked), or the child taps a pill to shout it? Recommend Nani shouts.
4. The book's progress mark: today's words as gold cards and a shelf of day-books (decision 4), no stars. OK?
5. The child in the book is the flat placeholder character; it needs its 3D art.

## Screenshots (`build/reports/s09-mock/`, each at 1366×768 and 844×390)

| Screen | File | What each element does |
|---|---|---|
| Door, sunny (beach) | door-beach-* | Fixed house; sky swapped; warm tint and the sun-shadow layer only here. Nani at her open door; one short sentence at a time, Kutchi with English beneath (rule 5); dots mark the sentence; thought bubble = the place; card = sky → place; Ha! pulses, Na shakes |
| Door, raining (cooking) | door-cook-*, door-cook-s1 (the weather word alone) | Rain and puddles in code, blue-grey tint; the kitchen in the bubble; recorded lines |
| Door, cloudy (clinic) | door-clinic-* | Grey tint, big clouds, no shadows; the waiting room in the bubble; *Tu muke help kar de?* |
| Door, the gesture sentence | door-beach-s2 | Her gesture pose is to draw |
| Door, night | door-night-* | Stars, moon, deep tint; lantern lit, window warm; *Shabash!* then the book's question |
| Book p1–p6 | book-p1…p6-* | Night sitting room; Nani leans on the book, the child beside. p1 today's door, *gadi*; p2 the gap with two picture pills (rung G1); p3 *trae bateta*, *makai*; p4 Snap prints, a gold corner; p5 today's words, the shelf of days; p6 goodnight and tomorrow's door under cloud. → turns, ✓ ends |
| Ride, car / stop / bus | ride-car-*, ride-car-stop-*, ride-bus-*, ride-filmstrip.jpg | The road scrolls like the clinic belt; *laal darwajo*: the red door passes with a blue one, she-goat with billy goat; the card holds what was spotted; a goat in the road stops the car |

## To draw in ChatGPT

| Piece | What |
|---|---|
| House front and foreground | Courtyard camera: limewash wall, flat parapet, blue double door (one leaf open), sage-shuttered window, pot, hen coop, clothes line, tree behind the annex, sand and step; alpha above the parapet |
| Four skies | Sunny, cloudy, raining (rain stays in code), night with stars and a round moon; full width from the horizon up |
| Sun-shadow layer | Tree dapple, frame and pole shadows, on transparent; sunny only |
| Nani's door poses | Standing, arms out (rain), fanning (hot), pointing at the sky, waving you in; full figure, s08 lineup style |
| Thought-bubble beach | Sea, sand, a bucket (others reuse real backgrounds) |
| The book | Cream pages, thin gold border, spine; the shelf of day-books; the lamp |
| The child | The player's character in the 3D style, seated, upper body |
| Car interior | Side window, pillars, roof lining, door panel with armrest and handle; window transparent |
| Bus interior | Window with seal, seat back in front, rail, a stranger's shoulder |
| Farm road strip | Three views wide, tileable: sky, hills, fields, fence, road; two houses (red and blue door), trees, a bird; animals are the existing sprites |
| Page pictures | The car, the corn on the fire |

## Proof

- Browser: 60 screenshots in five lock sessions, all looked at.
- `checks.mjs`: unit 386 pass, words 0, static 0 new, leak, bump, specs, size ok; docs now passes; the loads check hit the 900 s lock timeout (shared browser), left to `/review`.
- `touched.mjs` maps the whole branch diff; no mock file is in a flow, so no sandbox pass (`/review`). No fix-list row or evidence spec touched.

## QA, flaws first

- House, car, bus, shelf and strip are flat code drawings (by design); the child is the flat placeholder; Nani has one pose at every step.
- Pass by eye at both sizes: TXT-03/05, LAY-01/02/04/05, CMP-01/02/04/06/15, LNG-01/04 (token sizes, no clipped text, taps ≥ 48 px, shared kit, English only under her door lines, unrecorded lines grey italic with `data-rec`).
