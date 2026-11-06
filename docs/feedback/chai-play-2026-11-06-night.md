# Feedback: chai play, 6 Nov 2026 night (phone, live 20261106T200832Z)

**Source:** Zafar's two chat messages of 6 Nov night (typed voice note, 23 lines, numbered 0:01 to 0:23 in order; no audio times),
the phone log `docs/feedback/logs/njg-log-2026-11-06T21-08-22-649Z.json` (chai tray L2, 905x298, dpr 2.8) and his L4 screenshot of the
word moment. Made with `build/tools/ops/feedback.mjs`; every cause checked in code.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Chai: the boil's sound | silent until heat 0.5, then the simmer at 35% rising to 100% at the green (`chai-tray.js:1710-1713`) | heard from the first heat, rising evenly in decibels to its full level as the bubbling picture comes in; held through the green; louder only past the green (boiling over) | P1 |
| Every game's onboarding light | the box hugs the thing; on a shelf its sides follow the pill alone and neighbours trim the margin to 0 (`chai-tray.js:2245-2263`, `onboard.js:223-240`) | one rule: the box goes round everything that belongs to the thing (picture, pill, face icon), with a margin that never drops below a floor | P2 |
| Chai: style teas in the order | the extra (elchi, aadu, saffron) is said inside the headline and gets no pop-up card (`order.js:269-270`, `ui.js:2245`) | its item card pops up as the headline is said, like milk and sugar; every item except water and tea | P3 |
| Chai: after a serve | the next pan's light 0.3 s after the pour (`chai-tray.js:2214`) | 0.8 s | P8 |
| Chai: a poured pan's fire going off | the knob click and flame play (`chai-tray.js:2010`, `kitchen-kit.js:290`) | silent | P9 |
| Word moment framing | the counter low, about 39 px of cabinet on a phone; five narrow doors (`word-moment.js:168-193`) | more cabinet, fewer and wider doors, glasses a little smaller | P10 |

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| `assets/shared/word-moment/counter-wm-s17.webp` | the word moment, drawn larger (a crop) so fewer doors show; a new scene only if the crop is soft | P10 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:01–0:02 | "there's no sound to denote the tea is cooking until it about halfway when the tea bubbling pic kicks in ... it would be better if the tea boiling sound gradually increased until it's max (at the point the image changes to bubbling) and then stay there, and only increased after the green zone is missed and its overboiling - should it increase linearly or logarithmically? I want it to gradually bevome more noticable as the time to stop the cooker gets close." | chai, every level | js/cook/stations/chai-tray.js:1710 (the simmer starts only at heat 0.5); :1711 (35% to 100% by the green's start); :1714 (no change past the green) | the simmer from the first heat, rising evenly in decibels to 75% as the bubbling picture comes in (`boilAt`, :1008), held through the green, rising to 100% past it until it boils over |
| P2 | 0:03–0:04 | "The onboarding for items with no written words in their pills is much too tight - the highlight box need some padding around the item. What was the previous rule around this? There should be a general rule that works in all cases that leaves some padding around the object+pill+face icon, or object+pill, or object or some heircarchy like that can u figure it out and implement." | every game's onboarding light (chai shelf seen) | js/cook/stations/chai-tray.js:2257-2261 (the box's sides follow the pill alone; a speaker-only pill is 62 px, `PILL_SPK_W` :118, narrower than its jar); js/shared/onboard.js:223-240 (`hugShapes` trims the margin to half the gap to a neighbour, down to 0) | one shared rule in `Onboard`: the box is the union of the thing's picture, its pill and its face icon (whichever it has), plus a margin of 12% of its smaller side, 8 to 16 px; on a side where that would touch a neighbouring item it shrinks only as far as keeps 2 px clear of it (Zafar's yes, 6 Nov night); at the screen's edge it stops at the edge |
| P3 | 0:05–0:07 | "if someone orders ginger style tea, then I think ginger should come in the order when they're ordering it as an item card ... It's the same word repeated. I think it's better for their learning ... let's change that rule. So that basically any item that goes in the tea except for water and tea is listed ... saffron style tea and all the other style teas as well." | chai and chai tray, every level | js/cook/order.js:269-270 (the extra's row folds into the headline's part); js/cook/ui.js:2245 (a pop-up card only for a part's own row, so the headline's folded rows never pop) | the headline part pops the item card of every row folded into it (elchi, aadu, saffron), held as milk's is, the person's card open and the item flying into its slot while the headline is said (Zafar's yes, 6 Nov night); the sentence stays as recorded (the word said once, in the headline) |
| P4 | 0:08–0:09 | "the response from Claude in Chrome when I tried to run the clinic artwork ... This occasionally happens. I don't understand why. Can you diagnose and then fix the tool that creates the artwork prompts so it doesn't happen again? And it will also seem to be listing some other issues regarding color combinations. Can you also fix, once you fix the tool, fix the prompt itself, and then reissue it?" | art runs (clinic redo) | build/tools/art/templates/moving-download.txt:4 (the screenshot-upload route, ART-42's fix of 5 Nov); docs/design-language/art-plans/s17-clinic-redo-chrome-block.txt:20 ("this route always works"); build/tools/art/templates/block.txt:4 ("section 5" hard-coded; the plan's prompts are §4); build/tools/art/specs/s17-clinic-redo.run.yaml:50 (Olympic Blue, not a house colour; four colours from different combinations on one sheet; build/tools/art/artblock.py:279, `--check` tests neither) | references by a route Chrome's safety check does not judge (decision 4); the block loses its wording about getting round a refusal; the prompts' section read from the plan; `--check` refuses an off-house colour or a mixed sheet unless the line names its exception; the clinic spec fixed and the block reissued |
| P5 | 0:10 | "for the word focus scene, the full cup of tea has the correct pouring sound, but the smaller half cup of tea has the old incorrect pouring sound." | word moment (chai L4) | js/shared/sfx.js:297-303 (a loop whose file isn't loaded yet plays the old made-up loop); js/cook/stations/chai-tray.js:509 (the only preload, after the word moment) | the word moment loads the pour sound before its first pour and waits for it (never the made-up loop in the game) |
| P6 | 0:11 | "Also, can you make the physical size of the tea drop smaller, the one that falls and splashes in?" | word moment | js/shared/word-moment.js:418 (the drop 11% of the glass, its crown splash three times that) | half (Zafar, 6 Nov night): 5.5% of the glass, the splash with it |
| P7 | 0:12 | "And can you check that the card that pops up is within the new style of cards that we've created and has the same fonts and spacings?" | word moment's card | js/shared/word-moment.js:476 (the shared `WordCard.big14`, the 6 Nov card when `njg-lora` is on, set for chai by js/cook/flow.js:445) | shots at the four sizes beside the order's card: same faces, sizes and gaps; any difference fixed in the shared card |
| P8 | 0:13–0:14 | "We also need just half a second longer for once the tea's been poured, for the person to take in the successful tea pouring animation, with the drop and the twinkle and a sound, before then moving on to the next thing ... The onboarding of the second tea pan starts a little too quickly now that there's an animation to be watched ... literally half a second extra" | chai tray, L1–L4 | js/cook/stations/chai-tray.js:2214 (the next pan's light 0.3 s after the pour, not waiting for the drop and twinkle) | 0.8 s |
| P9 | 0:15–0:16 | "when the tea pan goes back on the stove, it plays a sound like a click, or like the stove lighting click. I think we should remove that ... It just comes at the wrong time every time." | chai and chai tray, L1–L4 | js/cook/stations/chai-tray.js:2010 (`setKnob(pan, "off")` after the last pour) -> js/cook/kitchen-kit.js:290 (`Cook.sfx.knob()`) | that call made quiet; the child's own knob turns keep their click |
| P10 | 0:18–0:19, 0:23 | "during the word focus, the camera is just a little bit too high. So you only see a tiny bit of the kitchen cabinet, and a large space above the tea cups ... the camera should be slightly lower ... Let me know if that's feasible. You can maybe make the tea glasses a tiny bit smaller" · "dont forget above moving the camera down to see more of the kitchen cabinets during the word moment. The cabinets might also be throwing off the scale as there are so many of them tight together, it makes the tea glass look as wide as narrow kitchen cabinet. Can we fix? might need new artwork or maybe you take from somewhere else" | word moment, phone and laptop | js/shared/word-moment.js:190 (the counter pushed down to make room for the kettle above, as far as the picture's slack allows: about 39 px of cabinet at 844x390); assets/shared/word-moment/counter-wm-s17.webp (five doors across, the counter at 71% of the picture) | the counter no lower than 70% of the screen's height, the glasses shrinking to fit; the picture drawn about 1.6 times larger so about three doors span the screen; checked at the four sizes; a new scene on the next art run only if the crop is soft |
| P11 | 0:20 | "when one of the orders played, the second person ordering didn't say milk. Well, didn't audibly say milk, even though they ordered milk in their tea." | every Cook game where two people order (chai tray L2 seen) | js/cook/words.js:548 (the "another person said it" exception looks for the speaking card inside a pop-up; the order cards now sit in the side panel, so it finds none); :571-574 (so the second "dudh," 7.8 s after the first counts as said again and is shown silently; log: the cousin's dudh card popped at 21.4 s, no say-start) | the exception tells people apart by who is speaking, not by a pop-up's card |

Chatter: 0:17 (the log is coming), 0:21 (wait for it), 0:22 ("it looks really good ... maybe today is the day we finally sign off Chai").

## 3. Rows (in `docs/process/regressions.md`)

Levels played: chai tray L2 (the log), L4 (the word moment shot). Every chai row's check covers L1–L4.

| ID | Point | Section |
|---|---|---|
| CHAI-95 | P1 | Cook: chai |
| SH-230 | P2 | Shared: layout and stage |
| CHAI-96 | P3 | Cook: chai |
| ART-42 (reopened) | P4, the refusal | Art |
| ART-58 | P4, the colours and the section | Art |
| CHAI-97 | P5 | Cook: chai |
| CHAI-98 | P6 | Cook: chai |
| SH-231 | P7 | Shared: order cards |
| CHAI-99 | P8 | Cook: chai |
| CHAI-100 | P9 | Cook: chai |
| CHAI-101 | P10 | Cook: chai |
| CK-59 | P11 | Cook: general |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:01–0:02 | P1 |
| 0:03–0:04 | P2 |
| 0:05–0:07 | P3 |
| 0:08–0:09 | P4 |
| 0:10 | P5 |
| 0:11 | P6 |
| 0:12 | P7 |
| 0:13–0:14 | P8 |
| 0:15–0:16 | P9 |
| 0:17 | chatter |
| 0:18–0:19 | P10 |
| 0:20 | P11 |
| 0:21–0:22 | chatter |
| 0:23 | P10 |

Lines: 23; in a point 20; chatter 3; unmapped 0. Second reader (Fable, transcript and rows only): 0 missing; 5 weakened, all fixed: the answers to his three questions (the old light rule, linear or logarithmic, the camera's feasibility) written into SH-230, CHAI-95 and CHAI-101; "take from somewhere else" kept (no other cabinet art exists, so a new scene if the crop is soft); 0:22's "push them through quickly ... sign off Chai" is the sprint's next step (publish, then his sign-off play), not a row.

## 5. Told before

- **P2:** 27 Oct (`chai-cards-2026-10-27.md` P8): "the box for onboarding is meant to be ... just around the picture that needs to be
  highlighted"; CHAI-33 (1 Nov): "the lit box goes just around the thing and its pill, with the same margin below the pill as at its
  sides", retired 3 Nov on his word (the 3 px under the pill at 740x320 stays). It slipped because the margin was tuned for word pills
  and the speaker-only pill is narrower than its jar; nothing checks a minimum margin. SH-230 replaces those with one floor.
- **P4:** ART-42 (5 Nov): the screenshot route was the fix for the same stop; it relies on Chrome's safety check allowing the runner to
  upload its own screenshot to another site, which it allows in some runs and refuses in others. Reopened.
