# Feedback: cook-s14-play-2026-10-30 (draft skeleton)

**Source:** build/reports/fb-1030/part1.md, build/reports/fb-1030/part2.md. 131 transcript lines, 38 draft points, 20 lines of chatter. Made by `build/tools/ops/feedback.mjs`; every cause is to be checked in code before this goes to Zafar.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| | | | |

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| | | |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 1:0:01 | 2 no ripples - the same light focus box with darker outside and gold glow and jump if item logic as chai, no ripple we tried that and failed it. Yes hand for drag is fine. | chai | | |
| P2 | 1:0:03 | Daar I meant 4 types of things to chop in the chop game - the number of total chops per play per level can go: 2, 4, 6, 8 (min 1 and max 3 chops per single item). And dont forget to end the game once all chops have been … | daar | | |
| P3 | 1:0:05 | level 4 chaat, do speaker buttons alone as it's level 4 so they should be used to using the sounds to figure it out, and they alwyas have the help card if needed. | chaat | | |
| P4 | 1:0:06 | Plus a few will be speaker anyway as by level 4 they would have progressed with a lot of words. what you do mean by q9? Can you check screenshots to confirm nothing hasnt been missed out. then answer my Qs and … | shared components | | |
| P5 | 2:0:01 | for chaat L4, only show "speaker buttons only" if space is an issue, otherwise follow usual rules. | chaat | | |
| P6 | 2:0:03 | When I load up chop, before the guy even comes to give the order for chopping, it says, it gives the order card for Haiku Dungri for one onion. And then when he comes and he says, Salaam Alaikum, the item card for the … | shared components | | |
| P7 | 2:0:08 | And then when you say question 9, is this what you mean by the... | language and audio | | |
| P8 | 2:0:09 | you said the patient card list. | clinic | | |
| P9 | 2:0:10 | Do you mean the image 2? | art | | |
| P10 | 2:0:11 | Basically the version of this, but for the clinic, where for the clinic it would say whatever, water and then plaster and then something else. | clinic heal games | | |
| P11 | 2:0:12 | Because if that's the case, then yeah, that we need that for clinic as well. | clinic | | |
| P12 | 2:0:13 | The same how we have it for chai, how it shows the items you need it the same for clinic across all the different game modes. It should show you the things that you need. | chai | | |
| P13 | 2:0:16 | And you should have the artwork for it, right? | art | | |
| P14 | 2:0:17 | You should have artwork for plasters and for jugs. And I mean, if they're in the game, then you should have them already. So where we have them, just put them in the box. The current chop game doesn't end after the last … | clinic heal games | | |
| P15 | 2:0:22 | And And at the beginning of the pantry game, there's no one in the kitchen giving you the order. The items just appear on the sidebar. So I really just opened 3 pages and found like 4 bugs. So I'm not really feeling that … | pantry | | |
| P16 | 2:0:27 | But the onboarding for the chop game definitely went awry. Like, it kept like going up and down jerkily, like it was kind of struggling to resize or struggling to fit or something. | shared components | | |
| P17 | 2:0:29 | Also, do we have a handy list of artwork we need? But now might be a good time for me just to supervise an art run, if there is anything. Like the additional ingredients that you said we don't have. I will leave it for … | art | | |
| P18 | 2:0:40 | I'm playing level one of the pantry. I see no words under the items in the pantry. | pantry | | |
| P19 | 2:0:42 | I don't even see any speaker buttons. | shared components | | |
| P20 | 2:0:43 | There's no speaker buttons or words under the items in the pantry. So I don't know how anybody's meant to know what's going on. | pantry | | |
| P21 | 2:0:46 | I said that the speaker button on the helper card should have the same padding to the right edge of the helper card as the item card, like the card below, the speaker button on the item below has to the bottom of its … | shared components | | |
| P22 | 2:0:49 | So for the sugar, on the sugar card, wherever the gap is between the speaker button and the edge of the card, replicate that gap on the big sugar card to the right. | chai | | |
| P23 | 2:0:50 | Oh, hopefully you understand what I'm saying. But I was saying that's what you should do. | language and audio | | |
| P24 | 2:0:53 | So the speaker's always on the right-hand side. And then I just said if you didn't have to squeeze that padding a little bit just to try get an item on one line, then you can do so. But if you don't need to, then keep it … | shared components | | |
| P25 | 2:0:58 | Why are the counting items from the pantry appearing where they are? On top of a shelf covering items. Should they not be in the bottom right hand corner? Why is everything just completely gone haywire? Also in the … | pantry | | |
| P26 | 2:1:03 | It highlights the item, but it doesn't expand the helper card. I also had new player turned on, so I don't know why I didn't get any onboarding in terms of, you know, the darker outside screen, the lighter focus box. … | shared components | | |
| P27 | 2:1:09 | So how items bounce to say, oh, pick me, the whole entire chop game is bouncing up and down, which is stupid, obviously. Just the knife should be highlighted. I mean, I don't know if this is too complex, but ideally to … | language and audio | | |
| P28 | 2:1:17 | So it chops it in half. And then it adds it to the chopped list. So maybe, you know, the first order, there's or in fact, it doesn't, no, don't add it to the chopped list. It'll be obvious that it chops it. And if, and … | language and audio | | |
| P29 | 2:1:25 | Wait for the, make them wait for the onboarding. Also, the transition still doesn't work well. When there's a big card highlighted from, as it's been spoken in the order, from the big card then moving down into the small … | shared components | | |
| P30 | 2:1:30 | One, it shrinks from the bigger card to the small card, which shouldn't, like, yeah, which just needs is like, which needs like a nice frame by frame shrinking down where everything's still nicely visible and not … | shared components | | |
| P31 | 2:1:34 | The highlight on the skewer in the second part of secular is also bad. You know, the highlight should include the whole skewer. Right now it cuts off the top and bottom of it, the handle and the pin. And currently it's … | sekelo | | |
| P32 | 2:1:41 | It paused in the green zone and I was told to turn it, but it didn't like highlight how it did for chai. Do you think you're just not capable of doing this many changes at once, even though we specified the rules and … | chai | | |
| P33 | 2:1:49 | When we did the rapid prototyping in the sandbox mode, you implemented everything flawlessly, pretty much first time, or with minimal feedback. So then I thought there wouldn't be an issue. On Cook, there's still, sorry, … | chai | | |
| P34 | 2:1:54 | So when she expands her card to help you, and shows you the card for the next item, that's when she should call out the item as well in Kachi. So that's a rule for all the games always. I think that makes a lot of sense. … | shared components | | |
| P35 | 2:1:58 | There's still an issue with the onboarding of turning on the cooker for the chai. | chai | | |
| P36 | 2:1:59 | There seems to be a black tint which is applied during that onboarding that never goes away, although it gets even more darker. | shared components | | |
| P37 | 2:2:00 | And then the gold square box doesn't go away either, even when it's time to select the chai or the tea glass to put the tea in. | chai | | |
| P38 | 2:2:01 | There's still a gold box highlighting in the cooker, even though it's been turned off at that point. | Cook (general) | | |

## 3. Draft regression rows (check, then add to `docs/process/regressions.md` the same day)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHAI-50 | 2 no ripples - the same light focus box with darker outside and gold glow and jump if item logic as chai, no ripple we … | **open** | eye: | `build/reports/fb-1030/part1.md` 1:0:01 (P1) |
| DAAR-37 | Daar I meant 4 types of things to chop in the chop game - the number of total chops per play per level can go: 2, 4, 6, … | **open** | eye: | `build/reports/fb-1030/part1.md` 1:0:03 (P2) |
| CHT-18 | level 4 chaat, do speaker buttons alone as it's level 4 so they should be used to using the sounds to figure it out, and … | **open** | eye: | `build/reports/fb-1030/part1.md` 1:0:05 (P3) |
| SH-171 | Plus a few will be speaker anyway as by level 4 they would have progressed with a lot of words. what you do mean by q9? … | **open** | eye: | `build/reports/fb-1030/part1.md` 1:0:06 (P4) |
| CHT-19 | for chaat L4, only show "speaker buttons only" if space is an issue, otherwise follow usual rules. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:01 (P5) |
| SH-172 | When I load up chop, before the guy even comes to give the order for chopping, it says, it gives the order card for … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:03 (P6) |
| LNG-20 | And then when you say question 9, is this what you mean by the... | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:08 (P7) |
| CLN-216 | you said the patient card list. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:09 (P8) |
| ART-30 | Do you mean the image 2? | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:10 (P9) |
| CLN-217 | Basically the version of this, but for the clinic, where for the clinic it would say whatever, water and then plaster … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:11 (P10) |
| CLN-218 | Because if that's the case, then yeah, that we need that for clinic as well. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:12 (P11) |
| CHAI-51 | The same how we have it for chai, how it shows the items you need it the same for clinic across all the different game … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:13 (P12) |
| ART-31 | And you should have the artwork for it, right? | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:16 (P13) |
| CLN-219 | You should have artwork for plasters and for jugs. And I mean, if they're in the game, then you should have them … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:17 (P14) |
| PAN-19 | And And at the beginning of the pantry game, there's no one in the kitchen giving you the order. The items just appear … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:22 (P15) |
| SH-173 | But the onboarding for the chop game definitely went awry. Like, it kept like going up and down jerkily, like it was … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:27 (P16) |
| ART-32 | Also, do we have a handy list of artwork we need? But now might be a good time for me just to supervise an art run, if … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:29 (P17) |
| PAN-20 | I'm playing level one of the pantry. I see no words under the items in the pantry. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:40 (P18) |
| SH-174 | I don't even see any speaker buttons. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:42 (P19) |
| PAN-21 | There's no speaker buttons or words under the items in the pantry. So I don't know how anybody's meant to know what's … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:43 (P20) |
| SH-175 | I said that the speaker button on the helper card should have the same padding to the right edge of the helper card as … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:46 (P21) |
| CHAI-52 | So for the sugar, on the sugar card, wherever the gap is between the speaker button and the edge of the card, replicate … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:49 (P22) |
| LNG-21 | Oh, hopefully you understand what I'm saying. But I was saying that's what you should do. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:50 (P23) |
| SH-176 | So the speaker's always on the right-hand side. And then I just said if you didn't have to squeeze that padding a little … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:53 (P24) |
| PAN-22 | Why are the counting items from the pantry appearing where they are? On top of a shelf covering items. Should they not … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:0:58 (P25) |
| SH-177 | It highlights the item, but it doesn't expand the helper card. I also had new player turned on, so I don't know why I … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:03 (P26) |
| LNG-22 | So how items bounce to say, oh, pick me, the whole entire chop game is bouncing up and down, which is stupid, obviously. … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:09 (P27) |
| LNG-23 | So it chops it in half. And then it adds it to the chopped list. So maybe, you know, the first order, there's or in … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:17 (P28) |
| SH-178 | Wait for the, make them wait for the onboarding. Also, the transition still doesn't work well. When there's a big card … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:25 (P29) |
| SH-179 | One, it shrinks from the bigger card to the small card, which shouldn't, like, yeah, which just needs is like, which … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:30 (P30) |
| SEK-24 | The highlight on the skewer in the second part of secular is also bad. You know, the highlight should include the whole … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:34 (P31) |
| CHAI-53 | It paused in the green zone and I was told to turn it, but it didn't like highlight how it did for chai. Do you think … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:41 (P32) |
| CHAI-54 | When we did the rapid prototyping in the sandbox mode, you implemented everything flawlessly, pretty much first time, or … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:49 (P33) |
| SH-180 | So when she expands her card to help you, and shows you the card for the next item, that's when she should call out the … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:54 (P34) |
| CHAI-55 | There's still an issue with the onboarding of turning on the cooker for the chai. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:58 (P35) |
| SH-181 | There seems to be a black tint which is applied during that onboarding that never goes away, although it gets even more … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:1:59 (P36) |
| CHAI-56 | And then the gold square box doesn't go away either, even when it's time to select the chai or the tea glass to put the … | **open** | eye: | `build/reports/fb-1030/part2.md` 2:2:00 (P37) |
| CK-55 | There's still a gold box highlighting in the cooker, even though it's been turned off at that point. | **open** | eye: | `build/reports/fb-1030/part2.md` 2:2:01 (P38) |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 1:0:01–1:0:02 | P1 |
| 1:0:03–1:0:04 | P2 |
| 1:0:05 | P3 |
| 1:0:06–1:0:09 | P4 |
| 2:0:01 | P5 |
| 2:0:02 | chatter |
| 2:0:03–2:0:07 | P6 |
| 2:0:08 | P7 |
| 2:0:09 | P8 |
| 2:0:10 | P9 |
| 2:0:11 | P10 |
| 2:0:12 | P11 |
| 2:0:13–2:0:14 | P12 |
| 2:0:15 | chatter |
| 2:0:16 | P13 |
| 2:0:17–2:0:19 | P14 |
| 2:0:20 | chatter |
| 2:0:21 | P14 |
| 2:0:22–2:0:26 | P15 |
| 2:0:27–2:0:28 | P16 |
| 2:0:29 | P17 |
| 2:0:30–2:0:31 | chatter |
| 2:0:32–2:0:33 | P17 |
| 2:0:34 | chatter |
| 2:0:35 | P17 |
| 2:0:36 | chatter |
| 2:0:37 | P17 |
| 2:0:38 | chatter |
| 2:0:39 | P17 |
| 2:0:40–2:0:41 | P18 |
| 2:0:42 | P19 |
| 2:0:43–2:0:44 | P20 |
| 2:0:45 | chatter |
| 2:0:46–2:0:47 | P21 |
| 2:0:48 | chatter |
| 2:0:49 | P22 |
| 2:0:50 | P23 |
| 2:0:51 | chatter |
| 2:0:52 | P23 |
| 2:0:53 | P24 |
| 2:0:54 | chatter |
| 2:0:55–2:0:57 | P24 |
| 2:0:58–2:1:02 | P25 |
| 2:1:03–2:1:04 | P26 |
| 2:1:05 | chatter |
| 2:1:06–2:1:08 | P26 |
| 2:1:09–2:1:10 | P27 |
| 2:1:11 | chatter |
| 2:1:12 | P27 |
| 2:1:13 | chatter |
| 2:1:14–2:1:16 | P27 |
| 2:1:17–2:1:19 | P28 |
| 2:1:20–2:1:21 | chatter |
| 2:1:22–2:1:24 | P28 |
| 2:1:25–2:1:29 | P29 |
| 2:1:30–2:1:33 | P30 |
| 2:1:34–2:1:40 | P31 |
| 2:1:41–2:1:42 | P32 |
| 2:1:43 | chatter |
| 2:1:44–2:1:46 | P32 |
| 2:1:47 | chatter |
| 2:1:48 | P32 |
| 2:1:49–2:1:53 | P33 |
| 2:1:54–2:1:57 | P34 |
| 2:1:58 | P35 |
| 2:1:59 | P36 |
| 2:2:00 | P37 |
| 2:2:01 | P38 |
| 2:2:02 | chatter |

Lines: 131; in a point 111; chatter 20; unmapped 0.
