# Feedback 28 Oct 2026: the chai onboarding lab, round 1

**Source:** `build/reports/voice/feedback-2026-10-28-part0.md` (his typed notes in the chat, verbatim, after playing "Play chai"
in `lab/cards.html`). Pictures: `sources/art/refs/2026-10-28-chai/` (a top-down glass reference; his shot of the bubble's small
speaker by "paani,"); the pan reference he means is `sources/art/refs/2026-10-27-cards/pan-top-down-reference.png`.
**Replayed here:** the lab's whole chai, new player, L1, at 740x320, 930x430, 1280x665 and 1920x1080 (a script: the order, the
four items, the heat, off, the pour; the skip tap 1.5 s into the order), then `labcheck.mjs` on its three states.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| The lab's order (`lab/cards.html`) | No way to skip: every word pops out, waits 1.5 s and flies in | A tap on the kitchen lands the whole order at once and goes to the game (the real game already does: `js/cook/ui.js:1444`) | P4 |
| The lab's order row | `scrollIntoView` jumped the row to the next card at once | The row glides to it while the big card is up, like its own scroll | P2 |
| The lab's onboarding | The order card lit for 2.4 s after the first two items | 1.2 s | P1 |
| The lab's pan | A colour disc drawn in code for each item | The real chai's painted states (water, leaves, milk, the milky boil), nothing drawn | P7 |
| The real chai, at the roll-out | Its own heating, heat ring, pan states and pour | Kept: only the new cards, helper card and onboarding go in on top | P6 |

Nothing in the real game is removed or replaced.

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| `assets/cook/items-s08c/chai-pan/pan-water-s08c.webp`, `pan-leaves-s08c.webp`, `pan-boil-milky-s08c.webp`, `assets/cook/items-s08b/chai-pan/pan-top-milk-s08b.webp` | The lab's pan contents (until the new top-down pan lands) | P7 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:01 | "keep the highlight on the recipie card after the first two items shorter, maybe half the time." | chai onboarding (lab) | lab/cards.html:622 (before): `await wait(2400)` | 1200 ms (now line 664); CHAI-37 |
| P2 | 0:02 | "During the ordering, when the cards fly into the recipie card, instead of the recpie card items jumping over, have them smoothly move to the side like the recipie card scrolling animation." | the order row (lab; shared at the roll-out) | lab/cards.html:481 (before): `s.scrollIntoView({ inline: "nearest" })` scrolls at once | `glideTo`: a smooth scroll to the next card while the big one is up (lines 486, 504); 9-13 steps a glide at the four sizes; SH-152 |
| P3 | 0:04, 0:11 | "before we push to main can we redo the chai pan and glasses to be proper top down and try to the new kitchen version as well? we can do a small art run."; "Attached referece top down glass and i previously sent you a top down chai pan if helpful for reference." | chai art, the kitchen | not code: art. Today's pans (`assets/cook/items-s08b/chai-pan/`, `items-s12/chai-pan/`) are drawn a little from the side (the inside wall shows on one side); the glasses (`items-s12/glass/`) show their base off centre; the counter scene still has its clutter (ART-28) | A small art run, his go first: the pan in every state, the glasses, the decluttered kitchen; CHAI-34, CHAI-08 (reopened), ART-28 |
| P4 | 0:05 | "I also need way to click on the kitchen during the order and skip the slow ordering into playing the game." | the order (lab; every Cook station) | lab/cards.html:465 (before): `playOrder` had no skip; the real game has it (`js/cook/ui.js:1444`, CHAI-15) | A tap on the kitchen lands every card and goes on (line 473); 42-46 ms to the station at the four sizes; CK-54 |
| P5 | 0:06 | "Also increase the icon size in the speech bubble." | the bubble (lab; every bubble at the roll-out) | lab/cards.html:165: the bubble's speaker 1.3 em (22-39 px); the game's bubbles use the tap size (`css/shared/conversations.css:178`) | 1.8 em, its icon 66% (31-54 px at the four sizes); SH-153 |
| P6 | 0:07 | "And remeber to use the other elements of the chai game like the actual heating animation and ring etc - just apply the new elements from this stuff to what's there." | the real chai (roll-out) | not code: a rule for the roll-out; the real chai's heat, ring, pan states and pour are `js/cook/stations/chai-tray.js` and `js/cook/kitchen-kit.js` | The roll-out puts only the new cards, helper card and onboarding into it; CHAI-38 |
| P7 | 0:08 | "Also no code drawn anything like chai in various states - at most pouring but that's it. not when it's in the pan and stationary." | the pan's contents (lab; every pot and pan) | lab/cards.html:525 (before): `FILL` colour discs | The real chai's painted states (lines 525-545); CK-06 |
| P8 | 0:09 | "Is there any of my feedback left from the chai game to implement?" | all of chai | not code: a question, answered in the chat (the open chai rows, listed) | (answered) |
| P9 | 0:10 | "Also make a rule that all artworks are given to me a single paste blocks for claude in chrome will all images and things it needs uploaded to github or wherever it can access." | art runs | not code: a rule; `build/tools/art/artblock.py:116` still allows `refs_from: library` (Zafar uploads the references by hand) | ART-29: the rule in the art-run skill and art pipeline, and a check in `artblock.py --check` |

## 3. Rows added to the fix list (`docs/process/regressions.md`, 28 Oct)

New: SH-152, SH-153, CK-54, CHAI-38, ART-29. Amended with his words: CHAI-37, CHAI-34, ART-28, CK-06. Reopened (told before):
CHAI-08. Levels: the lab's chai is one level at a time (option 10); its rows are checked at L1-L4 in the real chai at the roll-out.

## 4. Coverage

| Lines | Point |
|---|---|
| 0:01 | P1 |
| 0:02 | P2 |
| 0:03 | chatter ("otherwise looks good.") |
| 0:04 | P3 |
| 0:05 | P4 |
| 0:06 | P5 |
| 0:07 | P6 |
| 0:08 | P7 |
| 0:09 | P8 |
| 0:10 | P9 |
| 0:11 | P3 |

Lines: 11; in a point 10; chatter 1; unmapped 0.

## 5. Told before, and why it slipped

- **The glasses (CHAI-08, 22 Oct):** "the tea glass is ... not exactly top down". Marked built on a judge's sheet that checked the
  glass sat in its holder, not that the picture was drawn from overhead. Reopened.
- **The pan (CHAI-34, 27 Oct, and 22 Oct):** still waiting on art; no art run since.
- **Drawn contents (CK-06, 29 Sept):** the game uses pictures; the lab, built quickly, drew its own discs. A lab page now reuses the
  game's art, never stand-ins.
- **The skip (CHAI-15):** the game has it; the lab didn't copy it. Not a game regression; CK-54 makes it a check for the roll-out.
