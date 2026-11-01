# Feedback 2 Nov 2026: Zafar on the farm prototypes, feed and eggs (lab, L1-L4)

**Source:** his typed message, 2 Nov (the farm part; the chai answers in it are in `chai-play-2026-11-01-night.md`). Line numbers
stand in for times. **Levels:** he played the two lab games; the point is about every level. **Mock-ups:**
`build/reports/designs/chatgpt-farm-sentence-mockups-2026-11-02.md` (6 prompts: A order cards, B Hannah Mami's sentence and word
tiles, C the tiles in two strips; for both games).

## 1. What it would change (read this first)

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Feed and eggs: how the order is shown | one order-card row per animal or hen, its picture the animal with its food or the hen with her eggs (`js/farm/feed.js:7-10`, `js/farm/eggs.js:94`) | to choose from the mock-ups: Hannah Mami's sentence one instruction at a time, with word tiles below (one word each, every animal and food in the scene, on the word ladder) | P1 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix | Scope and levels | Told before |
|---|---|---|---|---|---|---|---|
| P1 | 0:01–0:05 | "these games are good examples for more complex sentences to be learned, such as give the carrots to the horse, and take 2 of the little chicken's eggs ... But as it stands, I'm not sure you are learning them. Because you could just match up the items pictorially ... menu cards ... skips the whole kind of having to listen and process these slightly more complex sentences" | farm feed, farm eggs | js/farm/feed.js:7-10 and js/farm/eggs.js:94: each animal's or hen's row carries the picture of who and what together, so the answer is matched from pictures | mock up three layouts (A, B, C) and choose | feed and eggs, L1-L4; any game whose order is a relation (who gets what) | new |
| P2 | 0:06–0:12 | "more emphasis given to the helper ... Hanamami, her sentence ... she gives you instructions one by one ... underneath her ... a two wide and six vertical grid, up to two by six ... little definition cards ... one for egg and one for chicken ... for the animal feeding one ... one for each of the animals and one for each food type. So it might have to be 2x8 ... on a small screen, like a phone, you might have to scroll ... 2 lots that you can scroll. One's labeled food and one's labeled animals. Maybe we do that anyway for the big screen ... I think it's cleaner just to have it as tiles. Also makes it distinct that it's not order cards" | farm feed, farm eggs: the side panel | not code: design (a new layout for the sentence games) | mock-ups B and C | feed and eggs, L1-L4, the four sizes | new |
| P3 | 0:13–0:17 | "the words that are defined below are like a different color, or they're underlined ... you try the big chicken and it doesn't work, and then you try the little chicken and it does work ... you begin to understand what the word for small is ... at the beginning you could have one for like small chicken and big chicken next to each other ... as the levels go on you just no longer get ones for small chicken or big chicken, and then eventually they start to blur out as well ... they should blur according to how many times you've seen it and got the word correct ... follow that ladder" | farm eggs (and feed): the word tiles | not code: design (the tiles' ladder and the pair tile) | the tiles follow each word's ladder; a pair tile (small beside big) at the low levels, gone later; the said words underlined in the tile's colour | feed and eggs, L1-L4 | new |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:01–0:05 | P1 |
| 0:06–0:12 | P2 |
| 0:13–0:17 | P3 |
| 0:18 | chatter ("Give me your opinion ... some different versions to help decide": the mock-up sheet's recommendation) |

Unmapped 0.
