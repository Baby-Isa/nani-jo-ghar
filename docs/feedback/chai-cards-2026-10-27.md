# Feedback 27 Oct 2026: Sprint 13 play, the new language cards, the helper card

**Source:** four parts in `build/reports/voice/`: part 0 (typed notes in the chat, 13 screenshots), part 1 (the 20-minute voice
note, Whisper), parts 2-3 (typed messages with ChatGPT mock-ups, verbatim). Pictures: `sources/art/refs/2026-10-27-cards/`.
**Played:** chai L1 and L3 on the Z Flip 5, chai L1 on the laptop, the eye test L1 on the phone. **Replayed here:** chai L1, chai
L3 and the eye test L1 at his phone's real game area (971x318, measured from his shots) and 1280x665 (run `fb27-real`).

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Every word card (shared kit) | `js/shared/word-card.js`: four slots, a small eye reveal on each blank, English only on tap | One premium card (his image 1): maroon Kutchi, small English under it, labelled lines, big speaker; hidden = strong blur and round dots, a tap on the dots (taught once) reveals; no small eye buttons; the small version drops the labels | P17-P20 |
| The order card (Cook) | `js/shared/order-card.js` rows of text chips; L3+ dots | Picture cards: on the phone a sideways row that scrolls (shadow, no scroll bar), the next order open below and peeking, a finished order folds to face + sentence; on the laptop a column with a speaker bar along the card's foot | P21-P23 |
| Nani's box and her hints | Nani's line plus a bulb and a speaker; the hint is a word card popped beside the sidebar (`js/cook/stations/chai-tray.js:1830`) | The helper card: her box grows in place (the order card pushed down) with the item's card and an English line; an arrow replaces the bulb; her speaker goes (tap her face); her line sits beside her head | P25-P28 |
| The order's word pop-out | Each word pops into the guide box, then flies into its row (`js/shared/word-card.js:355`) | The big card pops out only while the order is given (place to test: top-right of the panel, by the bubble, the middle), then moves and turns into its sidebar card; never during cooking | P2, P24 |
| The ?, home and book buttons | The rail, moved into the play area when the sidebar runs out of room (`js/cook/ui.js:2454`) | Off this screen for now; later one cog that turns the left panel into the game menu (save and exit, home, restart, Nani's voice) | P7 |
| The onboarding pointer | The kit's finger (`js/shared/onboard.js`) | A gold tap target with a soft ripple (his lean; or the maroon cursor) | P6 |
| Eye test onboarding | Onboarding over more than one round | One round, including a wrong answer (the drop and the whole loop) | P29 |

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| The chai pan (side-tilted) | Chai at every level: to be redrawn exactly top-down from his reference | P3 |
| The kitchen counter background (lamp, shelves, gold pot, wall hanging) | Every Cook order scene: to be decluttered, cooker widened | P11 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 2:0:01-3:49; 3:0:01-0:02; 4:0:12-0:13 | "the immediate priority for the sprint is to rapidly test and prototype ... to land on a finalized design and layout for the language learning elements aka the word cards"; then onboarding (chai, big and small screen); then the bugs; then principles tried on one other game (eye or toothbrush) and locked. "Does it make the game easier to learn the language? And does it make the game easier to play? ... that's the litmus test." | sprint | not code: Zafar's sprint plan | The sprint file (S14) takes his order; before any bug row is fixed it is re-read against the new cards and onboarding ("whether any of them are not redundant", 2:3:58-4:14); nothing is coded or launched before his go (4:0:12) |
| P2 | 2:7:28-8:37; 2:9:23; 2:10:22; 2:13:20; 2:16:04; 2:17:43; 2:18:17; 2:20:03 | "how on earth did this pass quality control ... explain to me how this passed quality control and how it won't pass quality control again"; "I really don't know why I bother with quality control it takes time it slows us down it doesn't seem to catch anything" | the checks | build/sandbox/lib/env.mjs:23 (the phone check is 915x412; his phone's game area in Chrome is about 971x318: every phone bug below shows only there); build/lint/layout.mjs:166 (text is a finding only when clipped or "…": text spilling past its card passes); build/sandbox/lib/contract.mjs:10 (contract-4: a bubble "above its speaker's head" passes while it covers the face); the replay plays a new player, so a learned word's speaker-only chip (P8) is never seen | SH-138: his real screen, L1-L4 at both sizes, a returning player, four new checks |
| P3 | 1:0:06; 2:4:19-4:54; 4:0:13 (picture 5) | "the pan I'm so fed up with the pan ... a reference image of a chai pan which is top down ... I just want the chai to sit nicely in the pan that's exactly top down" | chai | not code: art (told before: "needs re-doing again") | CHAI-34, art run with his reference |
| P4 | 2:4:54-5:50 | "the face icons next to the glass and on the cooker need to be bigger for mobile as does the ... button to ignite the hob ... what's the rule ... do these automatically scale with screen size ... think about the best way of making it dynamic" | chai, every game | js/cook/flow.js:2194 (Phaser EXPAND: the whole play area is one picture scaled to the screen; a face or knob is design px, with no smallest size on screen) | SH-139: a smallest on-screen size for taps and faces, every game, checked |
| P5 | 2:5:50-6:26 | "the image icon should like cut exactly halfway ... through ... to the middle point of the circle of the speaker icon ... it's important to understand why these things just go wrong" | every face | css/shared/face.css:37 (the badge sits on the square box's corner, translate(-34%, 34%), not on the circle's edge) | SH-140 |
| P6 | 2:6:31-6:55; 4:0:11 | "the finger ... works well in terms of its placement ... just looks like the wrong type of hand ... doesn't fit the theme"; ChatGPT's gold tap target: "I'm leaning towards number two ... mobile first, touchscreen first, modern design" | onboarding, every game | not code: design (the kit's finger, js/shared/onboard.js) | SH-141, decision 4 |
| P7 | 2:6:59-8:37; 2:12:55; 2:17:12; 4:0:06-0:07 | "why is the question mark the home button and the book button ... off to the side ... overlapping the bottle ... the question mark is somehow pulsing and highlighted yellow at the same time the water bottle is"; "for now just remove them"; the cog / tab / hamburger idea; "this question mark shouldn't be highlighted"; the cog turns the left card into the game menu (save and exit, home, restart, Nani's extra voice) | Cook | js/cook/ui.js:2454 and css/cook-side-v2.css:166 (S13's rail-out: a sidebar too tall puts the rail fixed in the play area's bottom-left, over the shelf; at 971x318 it trips even at L1); css/shared/buttons.css:104 (the ? glows the first time a station is met, the same moment the onboarding lights the bottle) | CK-53 |
| P8 | 2:8:53-9:37; 2:19:41-20:11 | "why is it so big it covers like three different items ... the box for onboarding is meant to be ... just around the picture that needs to be highlighted"; laptop: "probably two and a half times bigger than it needs to be and yet height-wise it cuts the speaker button" | chai | js/cook/stations/chai-tray.js:1717 (the box takes in the item's word chip; a learned word's chip holds only graphics, so Phaser's Container.getBounds returns an empty rectangle at (0,0) and the box stretches to the play area's left edge, while missing the chip's real bottom) | CHAI-33 |
| P9 | 2:9:37-10:20; 2:11:04; 2:17:55-18:05 | "why does the one sugar not fit in the ... box it's literally out of the box"; "I want to know why this is happening and how we fix it for all these kind of CSS or design elements"; the eye test: "tomato it's not even on the card the t and the o are completely off the card and the rest of it overlaps the speaker icon" | word card (Cook, clinic) | js/shared/word-card.js:149 and css/shared/word-card.css:46 (the word shrinks to fit but never under a fixed floor, --njg-t2; on a small card the floor wins, and with overflow visible and centred it spills both ways, over the speaker and off the edge) | SH-142 |
| P10 | 2:10:29-10:57; 2:18:05 | "the eye isn't aligned with the dotted the dashed grade section ... messy unaligned not even in the same box" | word card | css/shared/word-card.css:63 (the eye's circle is placed by hand-tuned offsets from a larger tap box, not centred in its slot) | SH-143 (the new card drops the small eyes; the rule stays for any reveal) |
| P11 | 2:11:17-12:52 | "we don't need the light hanging from the ceiling we don't need the three shelves ... the gold thing ... the thing hanging from the wall ... keep it plain and clear ... more nice space to see ... the speech bubbles"; widen the cooker to the outer edges of the units either side; the backsplash all the way | Cook counter scene | not code: art | ART-28 |
| P12 | 2:12:55-13:25 | "the little kid ali his language box ... why is there a little gray ghosted dot dot dot na above the black dot dot ... how can this pass quality control" | order card | js/shared/word-card.js:365 (the fold's flying copy of the row, cloned and shrunk into place; caught or left over the row) | SH-144 |
| P13 | 2:13:25-16:04; 2:17:25-17:48; 2:18:47-19:00 | "the speech bubble from Nana ... completely covers Ali's face ... covers most of Nana ... even covers the left panel"; "we can't place speech bubbles hand by hand for every single game mode for every single screen size"; his free-space idea (subtract the people, the counter and the panel; the bubble from the speaker's head into the nearest clear space); the eye test: "the speech bubble does not point to the doctor ... covers the girl's face"; the laptop: "Muke chai khape is miles away from the speaker" | Cook, clinic, every scene | build/sandbox/lib/contract.mjs:10 (contract-4 only asks above/below the head: never faces, the panel or distance) and js/shared/conversations.js:435 (placement by named spot per scene, not by free space); told before: CK-18 "a customer's bubble never covers their own face" | CK-18 reopened; SH-145 (free-space placement, every scene) |
| P14 | 2:16:08-16:31 | "the replies are really good ... the replies with little icons ... speech bubbles are good ... the speaker buttons probably need to be slightly closer to the speech bubbles ... let's keep that element" | Cook replies | not code: a keep, with one spacing tweak (design) | In SH-145 (keep the replies; each speaker against its own bubble) |
| P15 | 2:16:39-16:52 | "there's two chai pans now why okay we're changing this layout anyway" | chai L3 | not code: design (L3 serves two customers, one pan each: data/cook.json chai levels) | Answered; no row |
| P16 | 2:16:52-17:12 | "how has Nani's call-out card gone down in the sidebar covering up other elements what happened to putting in the top right or what happened to telling me ... is that okay" | chai | js/cook/stations/chai-tray.js:1830 (with no room by the hob on a phone, her card falls back to under the list, then over it: "under-guide", silently) | CHAI-35 (replaced by the helper card, SH-149) |
| P17 | 2:19:00-19:33 | "the whole screens gone dark but nothing's highlighted and the tea isn't ready to be turned off ... way too early" | chai | js/cook/stations/chai-tray.js:1751 (the next step's spotlight is the pan's ring or the knob; the dim comes up for the turn-off step before its target exists: to confirm on a frame strip) | CHAI-36 |
| P18 | 1:0:03 | "after the first two chai items are onboarded with the dark screen and highlight, the dark screen and highlight should briefly move to the recipie card before turning off, so the eye is directed to where to look next" | chai onboarding | not code: design (a new onboarding step) | CHAI-37 |
| P19 | 1:0:04 | "chai has the old stand in background, no the modern countertop" | chai | js/cook/stations/chai-tray.js:435 (a 50% page-colour wash over the marble: on a phone it reads as the old plain stand-in); told before: SH-108 | SH-108 reopened |
| P20 | 1:0:05 | "the item cards don't transition nicely and exactly into the recipie card - they shouldn't fade an re-appear, they should move and then transform into the sidebar version" | order card | js/shared/word-card.js:355 (W.fly hides the row and flies a shrinking copy; the pop-out card itself fades out first) | SH-144 |
| P21 | 1:0:07 | "the onboarding for the eye game only needs to run through one round (which includes the wrong answer ...)" | eye test | not code: design (onboarding rounds per heal game) | CLN-205 |
| P22 | 1:0:08 | "we need to include what the onboarding does in priniciple for all games (and then review the specifics ...)" | every game | not code: design (Sprint 14 principle) | SH-146 |
| P23 | 1:0:09 | "There's no speech bubble or anything for the girl saying thank you I feel better ... after the zoom out" | eye test | not code: to confirm in js/clinic (the line exists, silent in the replay's sound list, `Thank you, I feel better!`, but no bubble is shown at the eye test's end) | CLN-206 |
| P24 | 3:0:01-0:04; 3:0:17 | The default card (image 1): likes the maroon Kutchi, bigger and clearer, the font, smaller black English, the labelled lines, the soft shadow and rounded card, the clear speaker ("your default is to listen"); "Remove those flowers everywhere"; no little eye buttons. It "won't pop out during the game itself ... but it will pop out ... as people give the order ... top right of the left panel ... Or ... by the speech bubble or in the middle ... Let's test some options." | word card | not code: design (new card) | SH-147, SH-150 |
| P25 | 3:0:05-0:07 | Hidden (image 2): "the speaker button ... the main thing we want people to click on"; round dots hide both words; no eye buttons, "the first time the words are dotted out, we do an onboarding to show ... click on the dots"; "the blur needs to be stronger"; the picture's eye: "give your own independent suggestion"; "the rule for hiding ... consistency" | word card | not code: design | SH-147 |
| P26 | 3:0:08-0:09 | Small (image 3): no Kutchi/English labels where tight; the Kutchi may wrap to two lines, the English stays on one; less picture height or a taller card | word card | not code: design | SH-147 |
| P27 | 3:0:10-0:14 | The phone order card (image 4): unlabelled Kutchi and English, picture, big speaker, no flowers; "you just scroll along ... show sequence"; the second order's top third showing; a finished order collapses to the face and "Muke chai khape"; "I would like for it to already be expanded"; no scroll bar, "going behind a shadow"; ignore the pop-out in image 4: hints go in Nani's card | order card, phone | not code: design | SH-148 |
| P28 | 3:0:15-0:16 | The laptop order card (image 5, the bottom sugar one): the large speaker bar the obvious button "even if you're a child and you can't read"; at the card's foot to gain width for long Kutchi ("hekronaspati"), Kutchi on two lines, English on one; tidy, less picture height | order card, laptop | not code: design | SH-148 |
| P29 | 4:0:01-0:03; 4:0:09-0:10 | The helper card: Nani's green card expands in place, the order card pushed down; when it expands, an English line under her instruction; "don't use this card ... it should look like the main default card"; picture left, words right only if needed | Nani's box | not code: design (replaces js/cook/stations/chai-tray.js:1830's pop-out) | SH-149 |
| P30 | 4:0:04-0:08 | The arrow "could replace the light bulb"; the first time the game decides on a hint, the onboarding taps the arrow; afterwards hints still come by themselves after the agreed time, and the arrow gets one sooner; remove the bulb and her speaker from her card; her line beside her head, wrapping to two lines; English below it when expanded; her box smaller ("for mobile especially, that's very important"); a later setting to turn off Nani's extra voice | Nani's box | not code: design | SH-149; the voice setting into CK-53's cog |

## 3. Rows added to the fix list (`docs/process/regressions.md`, 27 Oct)

SH-138 to SH-150, CK-53, CHAI-33 to CHAI-37, ART-28, CLN-205, CLN-206; reopened CK-18 and SH-108. Levels for every chai row: L1-L4
at 971x318 and 1280x665; the eye test L1-L4.

## 4. Coverage

| Lines | Point |
|---|---|
| 1:0:01-0:02 | the screenshots (P2-P19 cite them) |
| 1:0:03 | P18 |
| 1:0:04 | P19 |
| 1:0:05 | P20 |
| 1:0:06 | P3 |
| 1:0:07 | P21 |
| 1:0:08 | P22 |
| 1:0:09 | P23 |
| 2:0:01-3:49 | P1 |
| 2:3:53-4:14 | chatter (how he will go through it) |
| 2:4:19-4:54 | P3 |
| 2:4:54-5:50 | P4 |
| 2:5:50-6:26 | P5 |
| 2:6:31-6:55 | P6 |
| 2:6:59-8:37 | P7, P2 |
| 2:8:46-8:51 | chatter |
| 2:8:53-9:37 | P8 |
| 2:9:37-10:20 | P9, P2 |
| 2:10:22-10:29 | P2 |
| 2:10:29-10:57 | P10 |
| 2:11:04-11:09 | P9 |
| 2:11:09-11:17 | chatter (next image) |
| 2:11:17-12:52 | P11 |
| 2:12:55-13:25 | P7, P12, P2 |
| 2:13:25-16:04 | P13 |
| 2:16:04-16:31 | P2, P14 |
| 2:16:39-16:52 | P15 |
| 2:16:52-17:12 | P16 |
| 2:17:12-17:25 | P7 |
| 2:17:25-17:48 | P13, P2 |
| 2:17:48-18:10 | P9, P10 |
| 2:18:10-18:47 | P2 |
| 2:18:47-19:00 | P13 |
| 2:19:00-19:33 | P17 |
| 2:19:33-20:11 | P8, P2 |
| 2:20:14-20:36 | P3; chatter (wait for the cards) |
| 3:0:01-0:02 | P1 |
| 3:0:03-0:04 | P24 |
| 3:0:05-0:07 | P25 |
| 3:0:08-0:09 | P26 |
| 3:0:10-0:14 | P27 |
| 3:0:15-0:16 | P28 |
| 3:0:17 | P24 |
| 3:0:18 | chatter (wait) |
| 4:0:01-0:03 | P29 |
| 4:0:04-0:08 | P30, P7 |
| 4:0:09-0:10 | P29 |
| 4:0:11 | P6 |
| 4:0:12-0:13 | P1 |

Lines: every line mapped; chatter 5 ranges; unmapped 0. Readers: the orchestrator, then a second reader (fresh agent, transcripts and rows only): 5 missing and 8 weakened, all fixed in the rows the same day (bubble timing, the hint time to agree, re-read rows for redundancy, the pour animation, nothing before his go; the menu options, the box around the picture only, tap-her-face marked a proposal, the English line's style, tweaks to him first, the small card's room, one hiding rule, the fold's check on every station). 0 unmapped, 0 weakened.

## 5. Second reader and why things slipped

Why they slipped (P2): the checks ran at a phone size 30% taller than his, played only a new player, and measured clipping and
"above the head" rather than "inside its card" and "clear of faces". The judge saw only those pictures. Told before: CK-18 (a
bubble over the face, judged fixed at 915x412) and SH-108 (the countertop), both judged at sizes and states he doesn't play at.
