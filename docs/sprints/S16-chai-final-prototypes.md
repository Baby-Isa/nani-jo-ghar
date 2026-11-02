# Sprint 16: chai finished, the prototypes refined

**Status:** closed (2 Nov 2026)
**Opened:** 1 Nov 2026 · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Chai is finished (Zafar plays it and says so), and the 8 lab prototypes play better on his notes, so he can choose which become proper first.

## How (Zafar, 1 Nov: "1 yes")
1. **His play of the live chai and the 8 prototypes** → `/feedback` → fix-list rows the same day.
2. **Chai's final pass:** his notes, CHAI-58 (below), CHAI-59 (the L4 card's speaker under 48 px on phones). Full proof: filmed at the four sizes, the judge.
3. **The prototypes refined on his notes:** rapid, laptop only (1280x665), each handed back when it plays.
4. **He chooses** which prototypes become proper games first (the next sprint's proposal).

## Budget
About $110-160 and three days (Zafar, 2 Nov: decision 9 of his chai notes; was $60-100, two days). Mostly in this chat (fast lane, Opus, high effort). At most two builders (Opus, high effort, about $10-20 each), only for a prototype change too big for the chat, each launched on his go. The judge on chai's changed screens at the end, about $5.

## Sessions
None yet. Each launch is proposed to Zafar first, with its model, effort and cost.

## Decisions at the opening (Zafar, 1 Nov)
- **CHAI-58:** "extend to two seconds": L4's green lasts 2 s at a child's pace (s15-chai-12 measured about 1.7 s). Measured before and after.
- **Word-adds to the existing games** (`build/reports/research-existing-games-2026-10-31.md` §2-3): "we can add them when we get to each of those games to get them to chai's level". Not this sprint: each game's word-adds join that game's pass to chai's level.

## Small decisions
- 1 Nov night: his chai notes (phone L2-L4, a small window L1) taken: `docs/feedback/chai-play-2026-11-01-night.md`, 16 points; 11 new rows, 4 reopened, 1 amended; answered 2 Nov: yes to all, 1 and 8 amended (the rows SH-185, CHAI-43). The sprint grows to about $110-160 and three days (decision 9).

- 2 Nov, 01:30 (Zafar): the farm layout agreed: the helper's speaker in the corner of her face (feed-B-yard); word tiles with a big
  speaker under the word ("I want to encourage listening"); eggs-B-grid on the laptop, eggs-C-strips on the phone; no glow on the asked
  tiles, neutral pair and plain tiles, items repeat. "go make all prototypes": overnight, rapid, minimal checks; two builders now and
  four at once from 7am UK (his word over CLAUDE.md's two at most, for tonight); brief `build/reports/proto-brief-2026-11-02.md`, queue
  `build/reports/proto-queue-2026-11-02.md`.

## Outcome
- **On `main`** (33762921): chai with all of Zafar's 1-2 Nov notes built (`docs/feedback/chai-play-2026-11-01-night.md`: SH-171, -177,
  -183, -185 to -188, -193, -194; CHAI-43, -58, -64 to -66), farm v2 on the word tiles, the four clinic prototypes. Published with the
  gate overridden on his word (no contract or evidence run, no judge).
- **On the branch** (b8f0a23 and after): every remaining designed game as a lab prototype (home, town, birthday, school, sewing, pet
  hotel, safari, beach): `build/reports/overnight-prototypes-2026-11-02.md`.
- **Moved to Sprint 17:** SH-169, SH-189, SH-190, SH-191, SH-192 (the panel's scroll and spacing); chai's judge and Zafar's final play;
  the phone strips for the tiles; the prototypes' seven decisions.

## Look back (three lines)
1. What worked: his screenshots straight into rows and fixes the same night; one shared rule (free space, one bubble rule) beat case-by-case patches.
2. What cost more: the pop-out took four rounds before it measured the real free space; the first fixes sized by width alone.
3. One change: draw the screen's free space first, then size into it, for every placed element (cards, bubbles, tiles).
