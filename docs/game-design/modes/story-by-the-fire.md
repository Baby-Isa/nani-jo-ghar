# Story by the Fire: design (module id `storyfire`)

> **Stale points (what `docs/process/rules.md` now overrides).** Text below is left as written.
> - Nothing found stale by the harvest; it is consistent with H40. The gap ladder (G4) uses pocket money, which decision 10 may change.

**Date:** 28 Sept 2026
**Status:** a proposal for Zafar. Nothing is built. Grows out of Zafar's 28 Sept decision (`docs/archive/design-v1/ideas-2026-09-28-arcs-and-focus.md` §4) that every arc ends this way, and out of `docs/archive/design-v1/Roadmap and Story Structure.md`'s "Story arcs" section.
**Reads:** the Roadmap (layout contract, story beats, containers, skill channels), `docs/design-language/ux-principles.md` §14 (get it right before you move on) and §11 (no negatives mid-play), `docs/game-design/modes/conversations.md` (the reply-pill component and rung ladder, reused here), `docs/game-design/modes/first-launch.md` (the panel-story precedent this extends).

**The Kutchi rule.** Nothing here invents Kutchi. Every line Nani speaks in a book page is either an existing recorded line (reused) or a new one that goes on the next Questions for Mum list; until recorded it shows as grey italic English and isn't tested, exactly as elsewhere in the game.

---

## 1. What it is

At the end of every arc — and, for a multi-chapter arc, at the end of each chapter — Nani tells the child the story of what they just did. It has two parts:

1. **The fireside scene.** A short (10–15 second), fixed scene in the sitting room: Nani by the fire, the child beside her. She turns to the child: *"Should I tell you what we did today?"* (to record). This is the emotional beat — she's telling **you** the story — not a menu or a summary screen.
2. **The picture book.** It opens in her lap. Each page is built from a **record of what the child actually did that day**, shown with the game's own art (never a screenshot), and Nani voices it. The child taps to fill in a word she leaves out. As the child progresses, she leaves more gaps, so the child tells more of the story themselves.

It replaces a plain "chapter end" or "arc end" beat wherever one would otherwise sit (Roadmap: "Story beats"). It is not a test: there's no score, no time pressure, and — per UX §11 — never a red cross.

### The five quality questions

| Question | Answer |
|---|---|
| **What do you do?** | Listen to Nani tell today's story from a book of pictures made from what you did. Tap to turn the page. Tap a picture to fill in the word she's left out. |
| **Where is the challenge?** | Picking the right word for the gap, from pictures at first, then from sound alone, then saying it. |
| **Where is the fun?** | It's about **you**: your fruit bowl, the sweets you found, the person you cooked for. Nani's warmth carries it; the book is proof you did something that mattered. |
| **Where is the instruction?** | Spaced review of the day's own words, in the order you met them, each shown with its own picture. |
| **What's new?** | It's the only place the story is built from data instead of hand-written, and the only place a child re-tells their own day rather than watching one happen to a character. |

---

## 2. The day-log API

Every mode logs what actually happened, in plain, small facts, as it happens. Nothing here is a mode's own concern beyond one call at the moment something completes; the book is assembled entirely afterwards from the log.

```js
Story.log({
  arc:     "birthday",       // the arc or trip id
  chapter: "guests-coming",  // chapter id, optional
  errand:  "cook-order-1",   // the round/errand id this came from
  type:    "made",           // see the type list below
  who:     "kin-nana",       // a word id for the person involved, optional
  what:    "cook-chai",      // the word id this entry is about (existing Word ids)
  count:   2,                // optional
  colour:  "green",          // optional, a word id when it's a colour word
  place:   "table",          // optional, for placing/travel entries
});
```

- **`Story.log` is append-only**, fire-and-forget, and never blocks play. A mode calls it once per meaningful action (a dish handed over, a sweet found, an item placed), not per tap.
- Stored under the existing save, a new namespace: `Save.get("story")` / `Save.set("story", …)` (shared-api pattern, as Conversations §5.1 does). Shape:
  ```js
  { days: [ { date, arc, entries: [ {..the fields above, ts} ] } ] }
  ```
  A **day** is a session's worth of entries for one arc; it closes when the arc's last errand ends (or the session ends, whichever first — an unfinished day still gets a book, just a shorter one).
- **Entry types**, open-ended, one word each: `made` (cooked something for someone), `found` (hide and seek), `placed` (put it there), `counted` (packed/sorted a quantity), `saw` (spot it, on a trip), `said` (a conversation moment worth remembering), `chose` (picked an option, e.g. a colour or a reply).
- **Retention:** the log keeps entries for the current and the previous arc only; older days are summarised to just the totals a container already tracks (word masteries), then dropped. The book is a recap, not a permanent diary.
- **Privacy:** entirely on-device, like every other save (Roadmap: "Storage rules"). Nothing here changes that.

### Who calls it, for Arc 1 (the MVP)

| Mode moment | Call |
|---|---|
| Cook: a dish is handed to a guest | `Story.log({type: "made", who: <guest>, what: <dishWordId>})` |
| Put it there: the table is set | `Story.log({type: "placed", what: "place-mat", count: <guests>})` per guest, or one summary call |
| Hide and seek: a sweet is found | `Story.log({type: "found", what: "ph-mitai"})` per sweet |
| Put it there: the sweet box is packed | `Story.log({type: "counted", what: "ph-mitai", count: <n>})` |
| The candles | `Story.log({type: "made", what: "cake"})` (or folded into the finale beat directly, since it's a single fixed moment) |

Later arcs add their own calls at their own hand-over/found/placed moments; the day-out template's "spot it" game logs a `saw` entry per thing tapped, and the food stall's three mini-games each log a `made`.

---

## 3. Page templates

A page is generated from one or a small group of same-type entries, never written by hand. Each template is a fixed layout (per the layout contract's discipline: same canvas, same slots, art changes) so new pages need no new code, only new art for new words — most of which already exists, because every word already has game art (Roadmap: item zones, `data/cook.json`'s `image` field, and so on).

| Template | Used for `type` | Layout | Example line (Kutchi where recorded, else PH) |
|---|---|---|---|
| **Made-for** | `made` | The dish's existing icon, the person's face, both large | "You made ___ for Nana." (gap: the dish) |
| **Found** | `found` | The item's icon on a plain background, small motion lines | "You found the ___!" (gap: the item) |
| **Counted** | `counted` | The item's icon repeated `count` times in a row, a box or bowl underneath | "You packed ___ sweets." (gap: the number word) |
| **Placed** | `placed` | A simple top-down mat/table graphic with the item's icon sitting on it | "You put the ___ on the table." (gap: the item, or the place word) |
| **Spotted** (day-out trips) | `saw` | The trip's background thumbnail with the item's icon overlaid where it was tapped | "You spotted a ___!" (gap: the thing) |
| **Said** | `said` | The speaker's face with a small speech-bubble icon (not the actual recorded audio waveform, just a bubble glyph) | "You told ___ you were fine." (gap: who, or the reply) |
| **Group cover** | one per errand, generated first | A collage of that errand's items, no gap | "First, we made the fruit ready." (a chapter-opening line, always heard in full, never gapped: it's scene-setting, not review) |

**Assembly rule.** Group the day's entries by `errand`, in the order they happened; each errand becomes one group cover page plus one page per **distinct word** in that errand (repeats of the same word within an errand collapse into one page with the highest `count`). A five-errand Birthday produces roughly 10–15 pages — long enough to feel like a book, short enough for a five-year-old's evening.

**Nani's line for each page** is built the same way Cook already assembles sentences from chunks (Technical Plan's chunked-recording model): a fixed frame plus the word's own recorded chunk (e.g. *"Tu {person} lai {dish} banai"* + the dish's chunk). No page needs a bespoke recording; only the frames do, and there are only as many frames as templates above (seven).

---

## 4. The gap ladder

Reuses Conversations' rung idea (§3.1 of that design) and UX §14's rule (a wrong pill shakes, the character looks briefly put out, and asks again — never a cross, never a buzz, and play only continues once the child picks right).

| Rung | How many gaps per page | What the gap offers | Unlocked when |
|---|---|---|---|
| **G0** | None. Nani reads the whole page | — | The first time any arc's book is opened |
| **G1** | One gap: the page's own word | 2 picture pills (the right one, one distractor from the same errand) | That word is at `understand_stage` 2+ (it's been met and half-learned already; the book never teaches a brand-new word first) |
| **G2** | One gap, pills are sound-only (no picture) | 2–3 pills, speaker glyphs only | `understand_stage` 3+ |
| **G3** | Every page in the errand group gets a gap | 3 pills | The whole errand's words are past `understand_stage` 3 |
| **G4** | The gap is said aloud, not tapped (mic, closed-set) | The G2 pills sit faint behind the mic as a fallback | `produce_stage` 3+, same rule as Conversations' R4 |

The rung is **per word**, exactly as the Roadmap's skill-channel table already works ("the word's stage decides the channel and support"); a single book page's gap can be at a different rung from the next. There is no separate "book difficulty" setting — the book is only ever as hard as the words already are, which is what makes it review rather than a new lesson.

**A wrong pick never loses progress.** Per UX §14, the wrong pill shakes and Nani says the line again, gently, then the same gap comes back; the page doesn't turn until it's right. The attempt is logged for the word's own stage (a miss counts as a miss, same as everywhere else), but the child never feels wrong in the story itself.

---

## 5. Art needed

Kept deliberately small for a one-session build:

- **The fireside scene**: one new background (Nani by a fire in the sitting room, warm low light), matching the existing layout contract (character upper body behind a low table or cushions, same camera height as every other background).
- **The book itself**: a simple page frame (a soft cream card with a decorative border, matching the request-card style already in the shared UI kit) — one asset, reused for every page and every arc.
- **Page art**: none new. Every template above reuses art that already exists for the word or person in question (Cook's dish icons, the Cast's faces, item sprites). This is the point of building it from records rather than screenshots: the art bill doesn't grow with the story.
- **The pill component**: reused as-is from Conversations' reply bubbles (§6.3 of that design); no new art.

---

## 6. Build plan (one session)

1. **`js/shared/story-log.js`**: `Story.log(entry)`, `Story.today()`, `Story.closeDay(arc)`, backed by `Save.get/set("story", …)`. Unit tests for append, grouping by errand, and the retention rule.
2. **Wire the MVP's five call sites** (§2 above) into Cook's serve step and the two new Put it there / Hide and seek modes as they're built for Arc 1 — or, if those modes aren't built yet, stub the calls behind a feature flag so the book can be demoed against a scripted fake day first.
3. **`js/shared/storybook.js`**: the seven page templates (§3) as small render functions taking a log entry (or group) and returning a page's DOM/Phaser nodes from existing assets; the assembly rule that turns a day's entries into an ordered page list.
4. **The gap-fill UI**: lift the pill component from Conversations (or, if Conversations isn't wired yet, build the same small piece once and have both modules use it) and the rung table (§4), reading `understand_stage`/`produce_stage` from the existing per-word progress store.
5. **The fireside scene**: a fixed intro (Nani's line, placeholder audio until recorded) that opens into the book.
6. **Hook it to Arc 1's end**: call `Story.closeDay("birthday")` and open the fireside scene after the Birthday's last errand (the candles).
7. **Test**: a scripted day of 6–8 `Story.log` calls covering every template, confirm the book renders, gaps resolve per UX §14's retry rule, and replaying the book (from the hub, later) works without re-logging anything.

Steps 1–4 are the reusable engine; step 6 is the only piece specific to Arc 1, so the same build carries forward to every later arc and trip untouched.
