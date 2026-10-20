# Sprint 9: A day at Nani's, the frame

**Status:** open (19 Oct 2026, running beside Sprint 8: Zafar, 19 Oct)
**Opened:** 19 Oct 2026 · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every day in story mode has its frame: the morning door with the weather in the sky, the evening book, and the window ride that every trip uses; the look agreed from coded mock-ups before any ChatGPT art.

## Budget
About $90-120 (a mock-up pass and one engine builder, then the art run and pack the bag), ceiling $150; plus Zafar's ChatGPT time for the house, foreground and skies once the mock-ups are agreed.

## Sessions
1. **s09-mock** (Fable, high): coded mock-ups of the door in four weathers, the evening book and the window ride, at 1366x768 and 844x390, for Zafar to agree the look.
2. **s09-frame** (Opus, high): the engine for the door and weather sky, the evening book and the window ride, with placeholder art swappable for the agreed art.
3. Next, after Sprint 8's Cook waves merge: pack the bag (the pantry fetch reskinned), Conversations at the door and in Cook and the clinic; the art run (house, foreground, skies, Nani's door poses).

## Small decisions
- Zafar, 19 Oct: run two Sprint 9 lanes now beside Sprint 8 (four builders while the sprints overlap); mock the screens in code first, so the look and the mechanics are agreed before ChatGPT.
- The door: the weather word alone, then in a sentence with a gesture, then the day as short sentences in turn, each its own line with its English beneath, a thought bubble of the place (`docs/game-design/story-and-arcs.md` Part 1).

- Zafar, 19 Oct evening (the mock-ups): **the door** keeps the mock's layout, drawn in the style of the clinic's send-off scene (the open door with the street beyond): warm, sunlit, not old-fashioned; textured rendered archways, Nani standing in the porch. **The ride:** only the car or bus window round the edge of the screen, so it reads as looking out. **The evening book:** Nani in an armchair by a small fireplace in a little library; sparse books with one shelf row left empty for the day-books; no player character for now. She greets ("what did we do today?"), the camera moves to her face, turns down to the open storybook on her lap (facing the player, as if reading to them) and zooms in; every review game (pictures, the missing word, dragging words and the story) sits on the book's two open pages, a page-turn between them; zoom back out at the end. **Art:** a short style run first (`docs/design-language/art-plans/s09a-art-plan.md`, block `s09a-chrome-block.txt`, with four book layout tests from `build/reports/research-book-games-2026-10-19.md`), one or two images per scene; the full Sprint 9 run and the Sprint 8 fix run follow once the style is agreed (S09 first).
- Zafar, 19 Oct night (the mock-up questions): **the door's sidebar** has two cards, each appearing as its sentence is spoken: a large picture of today's weather, then the day's activity, each with the speaker icon and the Kutchi beneath, like the pantry's items (idea 55). **The answer:** Ha! and Na pills, Na shakes. **The ride:** the car drives at a steady speed and the child keeps finding the items said; Nani says speed up (the items pass faster) and slow down (slower), always moving, nothing for the child to do but find; no stopping the car. **The book:** today's words as gold cards and a day-book added to the empty shelf each day, no stars; no player character for now.
- Zafar, 19 Oct night (the book's games, from `build/reports/research-book-games-2026-10-19.md`): yes to 1 find it in the picture, 2 which word, 4 our day in order, 6 stick in the photos; not 3 (give it to Ali), 5 or 7. **Most of the book's time:** (a) a picture of one thing from the day (chai, the bus), two or three speaker buttons to pick its name, then Nani uses it in a sentence about the day ("Nana wanted chai", "we went by bus"); (b) Nani's sentence ("then we saw a big cow") and the child drags the right one of three of the day's photos into the frame above it. The s09a layout tests show these.
- Zafar, 20 Oct (the s09a style test): the books and the windows are liked (kept in `sources/art/s09a/`); the house is redone from try 3 (the big arch with flowers), Nani dead centre at 55-60% of the height, a third of empty sky for the weather and the sun, moon and stars, no cast shadows; Nani by the fire matches her sheet and the book is seen from the child's seat (redone in this run); "our day" keeps off the centre fold; yes to all of Fable's review (`build/reports/s09a-fable-review.md`): poses as cut-outs over an empty house, the book scaled to a phone's width with 64 px buttons and the sentence as one pill row, the windows fitted by height, the leak-test rules for the book games, find-it from separate sprites.
- Zafar, 20 Oct (the plan): Sprint 9 plays a full day around the existing activities (the door, Cook or the clinic, the evening book) plus one trip day (the door, the car ride to the farm, the book); the farm's own activity, packing the bag and Conversations move to Sprint 10; the ride is the steady drive with speed up and slow down (no stop-the-car beat); one s09b art run; Mum's recordings in one consolidated sheet by mode, grammar first (the recording sheet, generated by a tool). **The skies are made in ChatGPT** (one picture per weather and time of day); code adds only what moves (falling rain, twinkling stars, drifting clouds). **The road:** looping outdoor scenery made in ChatGPT, items made in ChatGPT and placed by code so they can be switched; the scenery's design is agreed before the art run (proposal in chat, 20 Oct). Sprint 9's work moves to its own chat.

## Outcome
(at close)

## Look back (three lines)
(at close)
