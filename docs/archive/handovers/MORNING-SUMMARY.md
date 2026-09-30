# Morning summary (26 Sept 2026)

## Live now (`labs.html` links everything)
- **The clinic: full build, rough placeholder art** (merged 26 Sept ~09:50 UTC). A clinic morning plays all five stages: waiting room → diagnosis (face magnifier) → pharmacy belt with the doctor's handover → a healing game → send-off, then the end-of-round screen; "Close the clinic" ends the morning. Session 1 is one tiny patient, session 2 two, then three. Nine healing games in the pipeline (cut, knee, ear, tooth, taste, fever, boing, eye, foot); tummy, hic and hair are lab-only extras. Words are English placeholders; art is throwaway. Play: `clinic.html`. Labs: `lab/clinic-core.html` (every stage × variant × level and every game), `clinic.html?lab=1` (the lab bar), `lab/clinic-heal-host.html?game=knee&level=1` (one healing game).
- **Cook Wave 6b** (merged 26 Sept ~09:50 UTC): the end-of-round screen after every order, the picture tally, auto-tick, no mid-round verdicts from level 2, pour as a tap-measure, Nani as a voice with the card as the master, onboarding scripts for the nine kept stations, painted tools, the skewer-count leak fixed (0%). Gestures kept per station (chop swipe, stir drag, roll, fold, tap-on-green). Play: `cook.html`; Station lab from its title screen.
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
- **Hands v3** (`claude/art-hands-v3`): QA of every hand, 3D jewellery, the failed masters. Wired into Cook once it lands.

## Decided (26 Sept, morning)
- Zafar agreed all the suggestions put to him, including: count rows tick when the step closes, and the count is judged in the end review.
- **Hands:** approach approved, output not good enough (flat sticker rings, a dotted-line bracelet). A hands v3 session (`claude/art-hands-v3`) is QA-ing every image pass/fail, redoing the jewellery in the hands' 3D style, fixing the failed masters (knife grip first), ≤ $8. It gets wired into Cook after Wave 6b.

## Waiting on you
1. **Tonight's art run.** Unzip `nani-art-part1.zip` and `nani-art-part2.zip` into one folder, add `mum-01.jpg` to `private-photos/`, and paste `RUN-ME.md` into Claude in Chrome.
2. **Your mum's recordings.** A4–A8, then Section B (the cooking game's words), then Section C (grammar sentences).
3. **Your review of the designs above.** Then the other modes' builds restart, one agent per mode.

## Next, in order
1. The shell ("one app, one save").
2. The other modes' builds, from the approved quality passes.
3. Wire the hands (v3) into Cook.
