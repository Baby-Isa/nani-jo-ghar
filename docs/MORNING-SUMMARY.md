# Morning summary (26 Sept 2026)

## Live now (`labs.html` links everything)
- **Cook with Nani Wave 6**, your grill feedback:
  - a request card with read-along;
  - the sidebar on the left;
  - skewer cards with four dots;
  - the light bulb;
  - thread, then "Go to the barbecue";
  - no chips;
  - level 1 as small as possible, starting on the pantry;
  - ghost-finger onboarding;
  - your mum's words (*daar, ba, hakro/hakri, wadho, waari chai, Nana lai, Muke {x} de, pela… ne poi…*).
- **The old chat's final work:** the new character art and cache-busting.
- **Find it's next build** and the **shared end-of-round screen and onboarding kit**. Demo: `lab/shared-ui.html`.
- **Lab pages for every new mode.** These are grey-box, built before the redesigns below.

## Designs: ready for your review
Every mode now has two new top sections in its design doc:
- **"Pipeline design"**: the stages, and several mini-games per stage.
- **"Mini-game quality pass"**: each mini-game checked against your five questions (what you do, the challenge, the fun, the instruction, what's new), researched against current children's games, cut to the best, made consistent in its gestures, and with a walkthrough of a level-1 round.

| Mode | Pipeline | Kept after the quality pass |
|---|---|---|
| Cook | order → prepare → cook → serve → review | 9 stations; knead cut; pour becomes a tap-measure |
| Find it | errand → get there → counter → find → hand over → home → send-off | each stage's best; library 21 → 10 |
| Tidy up | gather → sort → place → put it right → send-off | 9 (was 19) |
| Who did it? | missing → clues → question → accuse → reveal | 10, plus reveals 18 → 9 |
| Dress up | who's next → measure → fetch → make → put on → mirror | table games 20 → 8 |
| Monsoon rush | forecast → get ready → storm → dry off → chai | 14 (was 24) |
| The clinic | waiting room → diagnosis → pharmacy belt → heal → send-off | healing games 20 → 9 |
| Snap | shot list → set off → frame → develop → show → album | shots 21 → 10; the new self-timer |

**One decision several passes raised: when does a count row tick?** If "3 onions" ticks the moment the third is chopped, a child who didn't understand the number can just chop until it ticks. The suggested default: the row ticks when that step closes (the item is put down or finished), and the count itself is judged in the end review.

## Being built now
- **The clinic, your main focus.** Five Opus sessions:
  - core pipeline;
  - healing games A (knee, ear, tooth);
  - B (taste, fever, injection);
  - C (eye, foot, plus extras);
  - rough placeholder art through the image API (medium quality, ≤ $5).

  The contract they share is `docs/clinic-heal-api.md`.
- **Cook Wave 6b:**
  - the end-of-round screen;
  - the picture tally;
  - auto-tick;
  - pour as a tap;
  - the instruction card as the master, with Nani as a voice;
  - onboarding scripts;
  - the tool sprites plugged in;
  - the skewer-count leak fixed.

  Its brief went out before you clarified the controls rule ("consistent within a mini-game", not "tap only"), so I'll check that it hasn't removed gestures it should have kept.

## Waiting on you
1. **The hands for Cook.** Review sheets sent last night; say yes or what to change. Then they get plugged in, and the 9 failing poses are redone, including the knife grip.
2. **Tonight's art run.** Unzip `nani-art-part1.zip` and `nani-art-part2.zip` into one folder, add `mum-01.jpg` to `private-photos/`, and paste `RUN-ME.md` into Claude in Chrome.
3. **Your mum's recordings.** A4–A8, then Section B (the cooking game's words), then Section C (grammar sentences).
4. **Your review of the designs above.** Then the other modes' builds restart, one agent per mode.

## Next, in order
1. Merge Wave 6b and the clinic build.
2. The shell ("one app, one save").
3. The other modes' builds, from the approved quality passes.
