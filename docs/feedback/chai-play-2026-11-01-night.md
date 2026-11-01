# Feedback 1 Nov 2026, night: Zafar's chai play on his phone (L2-L4) and a laptop window at phone size (L1)

**Source:** his typed notes (one message, 91 sentences; line numbers stand in for times: `0:01` is the first sentence), and eight
screenshots in `docs/feedback/images-2026-11-01-night/`:
- **phone-1.jpg** (L3, 22:32): the hob and tray; Nani's box "Chulo bar!", tall; the order card's head hidden under it; ticked item cards
  with their picture flush to the gold edge on the left; the shelf row wider on the left than the hob, narrower on the right than the tray.
- **phone-2.jpg** (L4): three people; the pop-out card *dudh na* small under the faces at the bottom left, its speaker on the dots;
  the side panel's current card cut at the foot (the *adh* row).
- **phone-3.jpg** (L2): the side panel during the order: the first card's head under Nani's box (the phone's screenshot tool over the foot).
- **phone-4.jpg** (L2): the bubble *trae khun.* by Ali, its tail over the underline; the second card's headline with more room above it than below.
- **phone-5.jpg** (L2): *dudh na* with Nana's bubble (he wasn't sure what it showed: chatter).
- **phone-6.jpg** (L2): Nana's greeting *Salamun alaykum!* in a two-line bubble beside his head, over Ali; its tail into its speaker;
  the order card "Muke elchi waari chai khape." with empty slots already up during the greeting.
- **small-1.png** (L1, about 716x362): the greeting: the bubble at the bottom right, behind the two reply pills, which are stacked and
  overlap; the order card "Muke chai khape." with empty slots already up.
- **small-2.png** (L1, about 716x362): the side panel: Nani's helper card with a speaker too big for it; big words; the order's items barely seen.

**Levels played:** chai L1 (the small window), L2, L3, L4 (phone). **The live game:** `main` c6cf44a1 (s15-chai-12).
**Causes:** read in the code (file:line); P9, P11 and P14 are best readings, each to confirm by measuring a filmed run before the fix.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| **The order card's arrival, every game** | the whole card (face, headline, empty slots) opens before the greeting (`js/cook/flow.js:1739` in the lab, `:470` in a day; SH-171 only hides the items) | nothing on the panel until the person says the card's sentence; then the card folded (face and headline); it opens with empty slots as they list the items; the next person's folded card comes as the last one folds | P7 |
| **The side panel at a small window, every game** | its sizes are fixed px (`css/shared/tokens.css:118`); only its width clamps (`css/shared/order-card.css:539-540`); the speaker's floor is 48 px | the panel scales with the window as the play area does: words, cards, gaps, Nani's box and speakers together | P1, P9, P11 |
| **The conversation, every game** | the bubble beside the head where the screen's edge and the side panel allow (`js/shared/conversations.js:715-753`); replies wrap into a stack at the right (`css/shared/conversations.css:193-200`) | words no bigger than the order card's item words; the replies side by side in one row at the bottom; the bubble never over a face, the replies, the gear or the panel, placed by one set of rules (SH-145) | P5, P6, P16 |
| A speech bubble's tail, every bubble | a rotated square drawn over the bubble's own contents (`css/shared/conversations.css:47-66`, `:224-236`) | the tail under the contents, never over a speaker or a word's underline | P8 |
| The side panel's scroll, every game | the said card is brought into view at a fold only (`js/cook/ui.js:924-931`, `:1925-1960`) | whenever the current order's card is cut at the foot, the panel scrolls up so it shows whole, earlier cards going up out of view | P14 |
| Chai: the pours | a code-drawn line from the bottle or carton (`js/cook/stations/chai-tray.js:1157-1172`) | no line: the pan's colour shows the milk | P2 |
| Chai: the tray faces | beside each glass, at its height, on the tray's left or right rim (`js/cook/stations/chai-tray.js:637-651`) | each in its glass's own corner of the tray | P3 |
| Chai: the pan pouring | under the faces (faces at `D.badge`, the pan at `D.item`: `js/cook/stations/chai-tray.js:651`, `:1734`) | the pan over the faces while it pours (SH-183's "on top" amended) | P4 |
| Chai: the shelf | centred on the screen less 190 px kept for the tick (`js/cook/stations/chai-tray.js:684`), the hob and tray on the whole width (`:518`) | equal space: the pan's handle to the water bottle on the left, the jeeru to the tray's right edge on the right | P12 |
| The pop-out card under the faces (three people) | the widest card that fits the room's height, its picture 4:3 on top, so a short room makes a narrow card (`js/cook/ui.js:1799-1830`) | sized to the room's width and height: sideways (picture beside the words) where the room is wide and short; the speaker shrinks last | P13 |

### 1b. Old art reused

None. P2 removes a code-drawn line; nothing new is drawn.

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix | Scope and levels | Told before |
|---|---|---|---|---|---|---|---|
| P1 | 0:01–0:06 | "is there no scaling of words, text, and image sizes on the left bar? Feels like the main game scales for the smaller screen, the words are smaller for the individual items, but they're massive on the left-hand side, with no reduction in card size scaling down, the gap between the cards and the Moke Chaiko pair, and the I want T sentence. The speaker button for the water is massive. It's too big to even be contained in the hint card ... it's very difficult to even see one order's worth of items" (small-2) | the side panel: Nani's box, the helper card, the order card, at a small window | css/shared/tokens.css:118: the s14 panel's sizes are fixed px (`--njg-card14-u*`), never scaled; css/shared/order-card.css:539-540: only the panel's width clamps (250-340 px under 500 px tall); css/shared/word-card.css:21,40: every speaker at least 48 px (`--njg-tap`), so in a short helper card it is bigger than the card | one scale for the panel from the window's size, as the play area's (frame.js); every size in it from that scale; the speaker's drawn circle scales with its card, its tap area kept at 48 px | shared: every game's panel; chai L1-L4 at 740x320, 930x430, 1280x665, 1920x1080 and his phone (971x318) | new (SH-138's phone check found no scale rule) |
| P2 | 0:07–0:10 | "when the milk pours, there's a little white rectangle that comes out. I think that's a code drawn animation or effect. We should take that out. I don't think we need to draw milk going in, because the colour of the tea changes" | chai: the milk pour | js/cook/stations/chai-tray.js:1157-1172: an 11 px line drawn from the carton's cap to the pan (graphics `lineStyle`), for milk and water | no drawn line; the carton tips, the pan's colour changes | chai L1-L4 (decision 5: water too) | new |
| P3 | 0:11–0:17 | "the face is next to the tea. I think we should put them at the corners. So for the top left glass, put it in the top left corner. For the top right glass, put it in the top right corner. Bottom right glass, bottom right corner. Bottom left glass, bottom left corner. There's a bit of natural space there" | chai: the tray | js/cook/stations/chai-tray.js:637-651: each face on the tray's left or right rim at its glass's height (`wy`), half past the tray's edge | each face centred in its glass's corner of the tray, the size SH-139 sets, clear of its glass | chai L1-L4, every tray of 1-4 glasses | CHAI-18 (the face beside the glass) is the old rule this replaces |
| P4 | 0:18 | "when the pan of the tea comes across to pour into the glass, it should go on top of the face icons, rather than having them on top of the teapot" | chai: the pour into a glass | js/cook/stations/chai-tray.js:651: the faces at `D.badge`, above everything (SH-183); :1734: the tipped pan at `D.item`, below them | the pan over the faces while it pours; the faces back on top after | chai L1-L4; every game's tray or plate faces (SH-183's rule amended) | SH-183 (1 Nov: faces "sit on top"): his newest word amends it |
| P5 | 0:19–0:26 | "everything's wrong. The speech bubble makes no sense, being in the bottom right hand corner, and the replies are stacked on top, overlapping, so you can't see what's behind. It's a mess. Again, is there no scaling of the text for the conversations in the ordering? ... the text is way bigger in the replies and in the speech bubble than is in the menu card or the item labels. So if we have deemed that size acceptable in terms of smallness for those items, then it can go smaller for the speech bubble, especially if that helps the replies sit side by side, left and right, at the bottom of the screen. Speech bubble shouldn't be there, and they definitely shouldn't overlap. There should be some more stopping that" (small-1) | every conversation: the greeting's bubble and replies | css/shared/conversations.css:72,154,193-200: bubble words 22 and reply words 19-27 scaled px, larger than the order card's item words; under 500 px tall the replies wrap (`wrap-reverse`) into a stack at the right; js/shared/conversations.js:715-753: the bubble beside the head tests only the screen's edge and the side panel, never the replies, so it lands under them | the bubble's and replies' words no bigger than the order card's item words at that size; the replies in one row along the bottom, side by side; the bubble placed clear of the replies, faces, gear and panel (P6, P16: one set of rules) | shared: every conversation in every game; chai L1-L4 at the four sizes and his phone | SH-145 (29 Oct: "We can't place speech bubbles hand by hand"), SH-80 (the reply pills) |
| P6 | 0:27–0:30 | "at one point I saw the speech bubble go behind the gear icon. Ideally, it should just go around the gear icon, or if it has to interact with the gear icon, it should go on top. But yeah, there should be set rules to stop this happening. Rather than us fixing this one instance ... there should be rules that stop this happening" | every bubble, every game | js/cook/dom.js:33: only the side panel is marked `data-njg-keepout`; js/shared/conversations.js:725,766: placement tests only keepouts, so the gear is not avoided, and it sits above the bubble | the gear (and every corner button) marked out of bounds: a bubble goes round it; if ever it must meet it, the bubble on top | shared: every bubble, every game, the four sizes | SH-145 |
| P7 | 0:34–0:44 | "the menu card is already there before the order's even started. He's just saying hello, and the menu card already says that he wants tea ... the collapsed version of it should appear when he says the sentence, like, I want tea. And then as he starts listing out the items, the menu card should expand with the gaps ready to then receive the first item as it fades into it ... And then when the second person comes, their menu card should appear in collapsed form as well as the first person's collapsing. And then as they give their order, their card should open up as well. So you kind of see more strongly whose order is whose. And it's not given away early" (small-1, phone-6) | the order card, every game | js/cook/flow.js:1739 (lab) and :470 (a day): `UI.mission.open` draws the whole card before `introduce` runs the greeting (js/cook/ui.js:1596-1612); js/cook/ui.js:1376-1380: SH-171's fix hides only the items, so the face, headline and empty slots show during the hello | no card until its person says its sentence; then folded; it opens, its slots empty, as the items are listed, each item fading into its slot; the next person's folded card appears as the last folds; one motion (SH-180) | shared: every game with an order; chai L1-L4 (1, 2, 3 people), every Cook station at its turn | **SH-171** (30 Oct: "You shouldn't see the item until he's given the order ... it appears before even he's appeared") |
| P8 | 0:45–0:47; 0:81–0:82 | "look at the speech bubble of Salam ... there's a a square or diamond shaped block for the sticky out part of the speech bubble, but you can see that's infringing on the circle of the speaker button ... I've seen that a few times on smaller screens ... doesn't have enough padding to get lost into"; "where it says 3 sugars ... the diamond used to make the call out even covers the underlining" (phone-6, phone-4) | every bubble's tail | css/shared/conversations.css:47-66: the tail is a rotated square (`::after`, positioned), painted over the bubble's own contents at its edge; :224-236: the order's item bubbles the same (`::before`), over the underline | the tail drawn behind the contents (or a cut triangle outside the edge only), and the bubble's padding at its tail side kept clear | shared: every bubble, every game, the four sizes | new |
| P9 | 0:48–0:50 | "Why does it doesn't look like Nani should have a double spaced header bar? Looks much too big" (phone-1) | Nani's box at the top of the panel | css/shared/order-card.css:541,557: best reading: the box's height is her face (56 px, 40 on a phone) plus padding plus the folded help row's own padding (6 px) and the tools' 48 px arrow (`ng-arrow`, :551), so a one-line "Chulo bar!" box is about two lines tall; to measure | the box as tall as its line and face need at that size; scaled with the panel (P1) | shared: every game's Nani box; chai L1-L4 at the four sizes | new |
| P10 | 0:51; 0:74–0:76 | "I don't know why the menu card is like moved down, so you can't see all of it"; "a nasty overlap between the with the hint card and the menu card ... this is during the ordering, so there shouldn't be that with the ordering" (phone-1, phone-3) | the side panel: the order card's head under Nani's box | js/cook/ui.js:924-931: a card is scrolled to its top minus 4 px of the list; css/shared/order-card.css:541: Nani's box draws with `overflow: visible` and its shadow over the list's top, so a card's head scrolled to the top sits under it | no card ever under Nani's box: the list starts below the box and its shadow; a card scrolled to the top shows whole | shared: every game; chai L1-L4 at the four sizes | **SH-169** (30 Oct: a finished order "left its card half under the side panel's top"); CHAI-35 (27 Oct: Nani's card "covering up other elements") |
| P11 | 0:52–0:58 | "look at the gold outline on the items in the menu card. Like there's some alignment issue ... They're all the way to the left, no padding to the gold outline. Whereas on the right of them, there is padding ... these should be ideally smaller and fitting in nicely on a smaller screen, and there should be equal and better padding" (phone-1) | the order card's item cards | css/shared/order-card.css:569: best reading: a card's padding is 2.6% of the row (`cqi`), about 3 px on a phone, and the picture slot sits to its start; to measure the picture's offset in a filmed run | equal padding round the picture inside the gold edge, at least a set minimum; the cards smaller with the panel (P1) | shared: every game's item cards; chai L1-L4 at the four sizes | new |
| P12 | 0:59–0:62 | "the items at the bottom aren't in line with the tea tray and the tea hobs on the top ... the water bottle is more left than the tea hob ... but the jiru ... is well within the right hand boundary of the tea tray ... There should be the equal amount of space between the juru and the right edge of the tea board as there is the water bottle on the left edge of the teapot" (phone-1) | chai: the shelf under the hob and tray | js/cook/stations/chai-tray.js:684: the shelf is centred on 1600 less 190 px (room for the tick), while the hob and tray are centred on the whole 1600 (:518), so the shelf sits about 95 px left of them | the shelf row centred on the hob-and-tray span, with equal space at each end (the pan's handle to the water bottle, the jeeru to the tray's right edge); never under the tick | chai L1-L4 at the four sizes | new |
| P13 | 0:63–0:71 | "the small card in the bottom left that gets pulled up as he starts speaking ... the one about not having milk, again, that's so much smaller than it needs to be. It could be way bigger than that ... There needs to be some rules, but like dynamic rules around assessing the space that is available and then scaling the card accordingly. You can see the speaker button is encroaching onto the dotted line of the dotted English for the word. It should be much bigger. If it had to be that small, we could probably reduce the speaker button" (phone-2) | the pop-out card under the faces (three people) | js/cook/ui.js:1799-1830: the card is the widest that fits the room's *height*, its picture 4:3 on top, so a short room (a phone) makes a narrow card; the speaker's 48 px floor (css/shared/word-card.css:40) then crowds the dots | sized to the room's width and height: sideways (picture left, the word and speaker right) where the room is wide and short; the speaker shrinks only last, its tap area 48 px | chai L4; every station with three people at L1-L4; the four sizes and his phone | **CHAI-43** (1 Nov: "The card could be bigger ... dynamically size"); CHAI-59 (its speaker under the floor on phones) |
| P14 | 0:72–0:73 | "there needs to be a rule whereby if the current order that's going on gets cut off at the bottom, then it needs to automatically scroll up and push the items above it up. So like the previous order should like scroll up and be hidden until there's enough space for the full menu card that's currently being ordered to be seen" (phone-2) | the side panel during the order | js/cook/ui.js:1925-1960: best reading: the panel follows the speaker's card only at the fold; as the card grows (its rows opening, P7) nothing scrolls, so its foot stays cut (ui.js:930 runs only when called) | whenever the current card is cut at the foot, the panel glides up until it shows whole, earlier cards going up out of view | shared: every game with an order; chai L2-L4 at the four sizes | SH-169 (folds), SH-180 (the glide): this is the foot |
| P15 | 0:77–0:80 | "for the second menu card ... is that the I want T text, is that in the middle of the head icon? And if it is, there's a lot more spacing from the I want T words to the top of the menu card than there is to the top of the item cards below. I feel like that needs slightly readdressing" (phone-4) | the order card's head row | css/shared/order-card.css:74,564: the headline is centred on the face (SH-36), and the face is taller than the line, so above the words is the card's padding plus half the face's extra; below is only `--njg-s2` (8 px) to the item row | the gap above the head row's words equal to the gap below them to the item cards (the face still centred on the line) | shared: every game's order card; chai L1-L4 | SH-36 (centred on the icon) stays |
| P16 | 0:84–0:90 | "the speech bubble just completely covers the boy's head. I don't understand why when we have rules around this. I definitely think that the text could shrink down a little bit if needed to have made it fit. I'm sure it could have fitted in above the kid's head. I'm sure there's space there. Or just horizontally, all on one line above the nana's head. There's some logic here that hasn't been well programmed" (phone-6) | every bubble | js/shared/conversations.js:715-736: with no room above the head (two lines at 22 px), the bubble goes beside it on the right, tested only against the screen's edge and the side panel, never the other people's faces; it never tries smaller words or one line first | the placement order, every bubble: one line above the head, its words shrinking to the order card's item-word size; then wrapped above; then beside, right then left; never over any face, the panel, the gear or the replies | shared: every bubble, every game, the four sizes and his phone | **SH-177** (30 Oct: "The speech bubble blocks the face and body"); SH-145 |

## 3. Regression rows (added to `docs/process/regressions.md` the same day)

New: SH-185 (P1), SH-186 (P5), SH-187 (P6), SH-188 (P8), SH-189 (P9), SH-190 (P11), SH-191 (P14), SH-192 (P15), CHAI-64 (P2),
CHAI-65 (P3), CHAI-66 (P12). Reopened with his new words: SH-171 (P7), SH-169 (P10), CHAI-43 (P13), SH-177 (P16). Amended: SH-183 (P4).
Levels: chai L1, L2, L3 and L4 in every row; the shared rows name every game and are proven in chai first.

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:01 | P1 (which screenshots: the laptop window at phone size) |
| 0:02–0:06 | P1 |
| 0:07–0:10 | P2 |
| 0:11–0:17 | P3 |
| 0:18 | P4 |
| 0:19–0:26 | P5 |
| 0:27–0:30 | P6 |
| 0:31–0:33 | chatter ("Now I'm going back to my first message ... Oh wait, there was something else I forgot to mention.") |
| 0:34–0:44 | P7 |
| 0:45–0:47 | P8 |
| 0:48–0:50 | P9 |
| 0:51 | P10 |
| 0:52–0:58 | P11 |
| 0:59–0:62 | P12 |
| 0:63 | chatter ("Okay, going on to the second image.") |
| 0:64–0:71 | P13 |
| 0:72–0:73 | P14 |
| 0:74–0:76 | P10 |
| 0:77 | chatter ("fourth image, to be honest, I'm not sure what the point of this was") |
| 0:78–0:80 | P15 |
| 0:81–0:82 | P8 |
| 0:83 | chatter ("fifth image of 6, honestly not sure what this is showing") |
| 0:84–0:90 | P16 |
| 0:91 | chatter ("I guess that's everything.") |

Unmapped 0. First reader: the orchestrator. Second reader (a fresh Fable agent on the transcript and the rows only): waiting on
Zafar's go (he asked to be told before anything launches); its misses will be fixed in the rows the same day.

## 5. Told before, and why it slipped

- **SH-171 (P7):** the 30 Oct fix hid the items, the narrowest reading of "you shouldn't see the item"; the card's headline, which
  says the order just as plainly, still showed. The row's check looked only for items.
- **SH-177 and SH-145 (P16, P5, P6):** SH-177 was built as one more case (beside the head, the right first) instead of SH-145's
  free-space rules; nothing tests other faces, the replies or the gear, and the checks ran at sizes where the bubble fits above.
- **CHAI-43 (P13):** built and shot at 1280x665, where the room under the faces is tall; on a phone the room is short and wide, and a
  card sized by height alone goes narrow. CHAI-59 already saw it (the speaker under the floor at 740x320 and 930x430).
- **SH-169 (P10):** checked at 740x320 when a card folds; not while the order is said, when the list scrolls a card to its top.
- **SH-183 (P4):** "sit on top" was built as above everything; the pour was not filmed.

## Decisions for Zafar

1. **The side panel scales with the window**, everything in it together (words, cards, gaps, Nani's box). The speaker's drawn circle
   shrinks with its card; its tap area stays 48 px, so a small finger still hits it. *Recommend yes.*
2. **Conversation words no bigger than the order card's item words** at that size; the replies side by side in one row along the
   bottom. *Recommend yes.*
3. **One set of rules for every bubble** (builds SH-145): one line above the head, shrinking to the item-word size; then two lines
   above; then beside, right then left; never over a face, the side panel, the gear or the replies. The gear and the other corner
   buttons are out of bounds. *Recommend yes.*
4. **The order card's arrival, every game:** nothing until the person says the card's sentence; then folded; it opens with empty slots
   as they list; the next person's folded card comes as the last folds. *Recommend yes.*
5. **No drawn line for chai's pours,** water as well as milk (the pan's own water picture and colour show it). Other games' drawn
   streams stay until you've seen them. *Recommend yes.*
6. **Tray faces in their glass's corner; the pan over the faces while it pours** (amends SH-183). *Recommend yes.*
7. **The shelf with equal space at each end** under the hob and tray. *Recommend yes.*
8. **The L4 pop-out card lies sideways** (picture beside the word) where the room is wide and short, so it can be much bigger. *Recommend yes.*
9. **Sprint 16 grows to take these:** they are shared, so fixed once in shared code, proven in chai at the four sizes and your phone;
   the other games get them at their turn. Budget from about $60-100 to about $110-160, three days. *Recommend yes.*
10. **The second reader** (a fresh Fable agent, about $1-2) checks these rows against your words before any building. *Recommend yes.*
