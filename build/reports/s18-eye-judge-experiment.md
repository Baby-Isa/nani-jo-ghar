# The eye-judge experiment: can a rubric and chai's frame catch what Zafar catches by playing?

**Judge:** Fable (eye judge). **Date:** 8 Nov 2026. **Reference:** chai (game id `chai-tray`), signed off 7 Nov as "clean,
modern, beautiful". **Pictures:** the Sprint 18 wave-3 films (`build/screenshots/sandbox/s18-w3-films/films/cook-<game>@1280x665-sheet.png`,
16 frames of a New player's first round, left to right, top to bottom) and the phone contract sheets
(`build/screenshots/sandbox/s18-w3-full/sheets/cook-<game>__740x320.png`), taken before his play.

**Rules kept:** nothing under `docs/feedback/`, `docs/process/regressions.md`, `docs/archive/`, the s18 review, Fable, feedback or
8 Nov reports was opened. The rubric below was written before any game picture was looked at (chai's included).

---

## 1. The rubric

Written from `docs/design-language/standard/` (every page) and `docs/design-language/art-bible.md`. Each question is answerable from a
frame or a run of frames, and is judged with chai's frame of the same moment beside the game's. Flaws first. The rule each question
comes from is in brackets.

### A. Onboarding and lights

1. Is the first-time light one look: everything dims (0.45), a gold-edged box sits round the one lit thing, no ripples, arrows or
   pulses elsewhere; a finger only for a drag, hold or rub? (STD-D1-02)
2. Does the lit box hug one whole target (a picture, a pill, a face, a knob) by one even margin, corners at most a quarter of its
   height, never crossing a face or the side panel, never framing a whole region or the whole screen? (STD-E2-08, DAAR-39, SEK-22)
3. Is there ever a dim with no lit thing, two lights at once, or a light left on a thing already done? (STD-D1-03)
4. Is the light on the thing the child must touch next (the shelf item, the knob, the pan), and does Nani's call come with it?
   (STD-D1-06, STD-F3-05)
5. After the first items, does the light move to the next item's card on the order card, with that card whole in view? (STD-D1-07)
6. When a next vessel is needed for the first time, is its rim lit once the first is served? (STD-D1-10)
7. Does Nani's box show the step now (one short line, her face, the arrow), never the whole order, and is it one height in every
   state, final from the first frame? (STD-D3-01, STD-D3-05)

### B. The order card, the item cards and Nani's box

8. Does nothing of an order show before it is said: does each item's card pop out big as it is said and fly whole into its row
   card? (STD-B1-03, P8)
9. Is every word on the one word card: Kutchi on top (maroon, serif), English under it (dotted from L2), the picture, the speaker;
   the same card in the pop-out, the row and the helper? (STD-E2-01)
10. Is each item card's picture exactly the shelf item's own picture, same view, same file, with any "no" grey or blur stacked on it?
    (STD-E2-04)
11. Is any word cut, ellipsised, run over its speaker, or outside its card; do headlines shrink and then wrap? (STD-E2-02)
12. Are the panel's cards even: equal padding and gaps, words level, one height across states; does the panel show at least 2.5
    item cards and keep the current card whole in view? (STD-E2-03, STD-E1-02, STD-E1-04)
13. Does a row tick the moment its count or amount is reached, and does a finished order keep its ticks until served, then fold as
    the next opens? (STD-D4-01, STD-D4-02)
14. When the child is stuck, does the helper card open under Nani's box with the item's word card as the item glows: no lit arrow,
    no dim, nothing over the order? (STD-D3-02)
15. Is the only English the child can see the English under a supported Kutchi word, the order card's line at L1, the helper card,
    and grey italic for a line not yet recorded (no "to record" sign)? (STD-01-03, STD-A4-02)

### C. Layout and the scene

16. Does the frame read as chai's: side panel left (Nani's box, then the order cards) on the stone, the play area, the shelf band
    across the bottom third, laid out by height, nothing cut at 740x320 or 1280x665? (STD-E1-01, STD-E3-03, STD-02-04)
17. Does anything overlap a thing it should not touch: shelf items against the hob or pans, pills against each other, a bubble over
    a face or the panel, a corner button over play? (STD-E1-05, STD-E2-06)
18. Is the shelf one row of items standing on one line, evenly pitched, each with its word pill under it, pills at least 4 px
    apart, text never under 14 px, every tap at least 48 px? (values E1, STD-E6-02)
19. Is the worktop the white marble (never yellowed) and the panel and shelf band the stone, with one highlight colour for whatever
    is lit? (STD-E3-03, STD-E6-01)
20. Are the face circles the kit's, one of three sizes, beside what they own (the glass, the plate, the skewer), on top of all but a
    pouring thing? (STD-E2-07)
21. Is the cog alone at top right and the play area otherwise free of buttons? (STD-D5-02)

### D. Art and perspective

22. One camera: is every item in a cooking scene drawn straight down (round things as circles, no splashback or horizon in frame),
    with no three-quarter or eye-level prop mixed in? (STD-E3-01, art bible §3)
23. Is everything a real, steady picture: no code-drawn circle, disc, bar or rectangle standing in for a thing (a pan, a pod, a
    rack, a liquid, a flame)? (STD-E3-02, STD-H1-05, P10)
24. Are items drawn at one height and scaled by size class (L 100, M 91, S 84), so nothing is a true-size speck beside a true-size
    pan, and the smallest piece is at least 40 CSS px high on the phone? (STD-E3-01, art bible §4)
25. Does the art read in the house style: the 3D-film look with no outlines, soft light from the upper left, a contact shadow under
    everything (nothing floats), walnut for wood, white marble, no text or logos on anything? (art bible §1-2)
26. Does each pan or vessel show its own picture for its state, centred on its burner, with the heat ring over its handle and the
    burner never showing through? (STD-E3-04)
27. Are any cuts rough: a visible background strip, halo, hard edge, upscaled blur or a stand-in placeholder not named as such?
    (STD-H1-06)
28. Is anyone at a counter in a behind-the-counter pose, drawn in the house style, dressed modestly, with no religious markers?
    (STD-E3-05, STD-01-09)

### E. Play and feedback

29. Is every timed action's window shown on the thing itself (the ring filling to its green), and is the window called as it opens?
    (STD-B2-03, STD-D2-06)
30. Does a mistake show only in the thing (a shake, a boil-over that restarts its dish), never as a cross, a frown, a mark or a
    verdict before the end review? (STD-B2-04, STD-B4-05)
31. Does a finished dish have a visible payoff (the pan over its glass, the serve) that plays out before the next thing asks for the
    eye? (STD-B2-11, STD-B4-04)
32. Does the round close as chai's does: each dish to its asker, everyone back, thank-yous, then the two-page end screen (badges,
    then the word review), with no sweets, lollies or biscuits as rewards? (STD-B1-02, STD-D5-04, STD-B4-06)
33. Is every action a tap, or a drag along a fixed track or a rub that starts on its target, and does a count show on count pills
    that tick as reached? (STD-02-03, STD-B3-02)

### F. Language on screen

34. Is every Kutchi spelling the same on the pill, the card, the pop-out and the helper, and the settled form? (STD-A4-04)
35. Is each order headline a full natural sentence built by the engine, in Kutchi, with its English under it only where the level
    allows? (STD-A4-01, STD-C2-05)
36. Is a word met for the first time shown plainly (picture, Kutchi, English), nothing dotted or blurred? (STD-A2-04, STD-A2-03)
37. Does a word that a picture can't show (an amount) get its word moment before it decides, and never at a level that doesn't ask
    for it? (STD-A3-01, STD-A3-02)

### The overall question

38. Would a premium, Toca Boca-level children's game ship this screen? If not, why not?

---

(Sections 2 to 11 follow: chai as the reference, then the nine games, what stills cannot show, and the proof.)
