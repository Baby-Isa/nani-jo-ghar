# Feedback: chai-play-2026-11-01 (draft skeleton)

**Source:** /tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md. 125 transcript lines, 38 draft points, 22 lines of chatter. Made by `build/tools/ops/feedback.mjs`; every cause is to be checked in code before this goes to Zafar.

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
| P1 | 0:00 | feedback on the Chai game after your recent fixes. | chai | | |
| P2 | 0:01 | I don't think we need the speaker button in the speech bubbles, because when the speech bubbles pop up, they're already being played out loud. And as soon as they've been read out loud, they disappear. So you don't … | shared components | | |
| P3 | 0:05 | For level one, the only feedback I had was the, at least I'm playing on laptop at the moment, the face icons next to the chai trays probably should be a little bit bigger. | chai | | |
| P4 | 0:07 | Level two, after the first order is read, it needs a nicer animation to close the first order card and open the second order card. Like it should like scroll up, whatever, you know what I mean? It should like smoothly … | shared components | | |
| P5 | 0:13 | Like, however we tested that, we should implement it. But on level two, it highlighted the whole order card, not the next item in the order card. That needs fixing to be like level one. I'm also not sure how clear it is … | shared components | | |
| P6 | 0:20 | Otherwise, that might be the only bit of onboarding you actually need at level two, which is if it seems like you're stuck or you're struggling, it just kind of shows you have to select the next teapot. see attached at … | shared components | | |
| P7 | 0:26 | Also, in level 3, after the first order was given by the first person, Nana, when it switched to Ali for the second order, the whole kitchen screen kind of like jumped up and down as if it were resizing or something. | Cook (general) | | |
| P8 | 0:27 | Almost reloading because of the second order, speaker order. So see if you can fix that. | shared components | | |
| P9 | 0:29 | Also, I think I've decided, and I've gone back and forth, but I think just to make it consistent, when you've put in the right number of sugars or other items, it just ticks it there and then. I know that means that … | chai | | |
| P10 | 0:33 | Eventually, you're just going to learn it, and it'll be easier for you to learn it rather than like tapping and waiting each time. So yeah, I think that's just my decision. | clinic | | |
| P11 | 0:36 | Also, you don't really need onboarding on a second, well, on a third level now. | shared components | | |
| P12 | 0:37 | I'm playing the third level, but anyway, for the point of consistency and applying logic elsewhere, the chulo bar, the turn on the stove, onboarding already happens on the first pot of tea, so it doesn't need to repeat … | chai | | |
| P13 | 0:38 | Onboarding should only be actions that occur for the first time. | shared components | | |
| P14 | 0:39 | Also, what's the decision around the items that go into the tea? I thought we had like proper visuals for elchi in the tea and ginger in the tea and things like that. | chai | | |
| P15 | 0:41 | I remember they seem to be drawn on, but I do seem to remember that we had ChatGPT images for that. Are we going to go back to that? And what's the deal with the juiciness, like the splash and the pop, well, the visual? … | art | | |
| P16 | 0:48 | But maybe it doesn't need to hold us back in terms of locking down the T rules. Okay, now I'll play level 4 and then I'll try make the browser phone size. On level 4, see second attached image. | art | | |
| P17 | 0:52 | There's 3 people, so the card now comes in the bottom left corner, which is good, but 2 things. The card could be bigger, right? There's plenty of space for it to be bigger, so I feel like it probably should dynamically … | shared components | | |
| P18 | 0:56 | So I think, I don't know, some people say to be very prescriptive with AI to get better results. Some people say just give it the gist and don't be too prescriptive and it will find the best solution. So look, you … | language and audio | | |
| P19 | 0:59 | Don't be restricted by what I'm suggesting, but I would suggest that you dynamically reduce the size of the card up until the point where the speaker button then is too big to fit in the card, and then you start also … | shared components | | |
| P20 | 1:03 | I didn't do any action for quite a while, so I was prompted, which is good, but I was prompted to put in sugar next. Well, it prompted me to put in sugar, but the next item on the menu card is actually elchi. | chai | | |
| P21 | 1:05 | So something to fix is that the prompt, the hint prompt from Nani should always be the next item to put in sequentially, i.e. | Cook (general) | | |
| P22 | 1:06 | just the next item on the menu card. | shared components | | |
| P23 | 1:07 | Even though strictly you can put sugar in next, it should go in the order of what's on the menu card. The half mechanism for level 4 kind of works well, actually. In terms of the pouring, it works quite well. | chai | | |
| P24 | 1:12 | One, when it's being spoken, I guess you could add this to the language card before confirming it from what I'm saying. | shared components | | |
| P25 | 1:13 | But when it's spoken, you say the quantity right after saying my or saying me. | language and audio | | |
| P26 | 1:14 | So you'd say muke ag chai kape muke ako chai kape. Like I half tea want, I full tea want. | chai | | |
| P27 | 1:17 | And then the other piece of feedback is that it ticked the half item card when I actually put in the full amount. So I clicked the pad once or the glass once, it filled it up to half, but the half word card didn't tick. … | shared components | | |
| P28 | 1:21 | So same as the sugars, if half is achieved, then it should just tick after half. | chai | | |
| P29 | 1:22 | I know that means they can just put half, and it will tick, but they'll learn, because then we should be strategic about when we introduce half, one person should say half, or one person should say full. Maybe the first … | language and audio | | |
| P30 | 1:26 | And again, maybe if they get stuck on that for a while, the fact that you need to press the... the fact you need to press the pan again to make it a full cup, we could onboard that. | language and audio | | |
| P31 | 1:29 | Use the onboarding style, but give it as a hint after a while. I don't know, it felt explanatory to me. I'm still getting in the onboarding for Chulobara, turn on the stove, even though I haven't got new player selected. … | shared components | | |
| P32 | 1:38 | If you're not a new player, Nani should just give you the instruction, and then, like how we have the rule of like 7 or 9 or 11 seconds of no activity, you get extra help. | Cook (general) | | |
| P33 | 1:39 | After that time has elapsed, then you should get the onboarding visual of turning on the stove. Otherwise, you should just get the verbal instruction. I had a quick look on a smaller screen. It seemed to be fine as well. | shared components | | |
| P34 | 1:43 | The only other thing is there's no consequence, seemingly, for undercooking or overcooking the chai. | chai | | |
| P35 | 1:45 | I think if I overcook this, it just like bubble over and empties, and you just have to start that pot again. And if you underdo it, I don't know. I would like the feedback to be instant though, like before you pour it. … | Cook (general) | | |
| P36 | 1:52 | It just shakes and says no, basically. And the timer keeps going until it hits the green. Well, yeah, it keeps going until you click it when it's in the green. And if you click it in the red after the green, then it … | language and audio | | |
| P37 | 1:57 | You might need an image for overboiling from chat, which I can get for you. At least for now, implement that as code. Not as code, I just as in like the mechanic of it, not the visuals of it. And then, I think we're very … | art | | |
| P38 | 2:03 | Recording aside, like, it looks good. | language and audio | | |

## 3. Draft regression rows (check, then add to `docs/process/regressions.md` the same day)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHAI-53 | feedback on the Chai game after your recent fixes. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:00 (P1) |
| SH-180 | I don't think we need the speaker button in the speech bubbles, because when the speech bubbles pop up, they're already … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:01 (P2) |
| CHAI-54 | For level one, the only feedback I had was the, at least I'm playing on laptop at the moment, the face icons next to the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:05 (P3) |
| SH-181 | Level two, after the first order is read, it needs a nicer animation to close the first order card and open the second … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:07 (P4) |
| SH-182 | Like, however we tested that, we should implement it. But on level two, it highlighted the whole order card, not the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:13 (P5) |
| SH-183 | Otherwise, that might be the only bit of onboarding you actually need at level two, which is if it seems like you're … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:20 (P6) |
| CK-57 | Also, in level 3, after the first order was given by the first person, Nana, when it switched to Ali for the second … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:26 (P7) |
| SH-184 | Almost reloading because of the second order, speaker order. So see if you can fix that. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:27 (P8) |
| CHAI-55 | Also, I think I've decided, and I've gone back and forth, but I think just to make it consistent, when you've put in the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:29 (P9) |
| CLN-217 | Eventually, you're just going to learn it, and it'll be easier for you to learn it rather than like tapping and waiting … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:33 (P10) |
| SH-185 | Also, you don't really need onboarding on a second, well, on a third level now. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:36 (P11) |
| CHAI-56 | I'm playing the third level, but anyway, for the point of consistency and applying logic elsewhere, the chulo bar, the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:37 (P12) |
| SH-186 | Onboarding should only be actions that occur for the first time. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:38 (P13) |
| CHAI-57 | Also, what's the decision around the items that go into the tea? I thought we had like proper visuals for elchi in the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:39 (P14) |
| ART-31 | I remember they seem to be drawn on, but I do seem to remember that we had ChatGPT images for that. Are we going to go … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:41 (P15) |
| ART-32 | But maybe it doesn't need to hold us back in terms of locking down the T rules. Okay, now I'll play level 4 and then … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:48 (P16) |
| SH-187 | There's 3 people, so the card now comes in the bottom left corner, which is good, but 2 things. The card could be … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:52 (P17) |
| LNG-23 | So I think, I don't know, some people say to be very prescriptive with AI to get better results. Some people say just … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:56 (P18) |
| SH-188 | Don't be restricted by what I'm suggesting, but I would suggest that you dynamically reduce the size of the card up … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 0:59 (P19) |
| CHAI-58 | I didn't do any action for quite a while, so I was prompted, which is good, but I was prompted to put in sugar next. … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:03 (P20) |
| CK-58 | So something to fix is that the prompt, the hint prompt from Nani should always be the next item to put in sequentially, … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:05 (P21) |
| SH-189 | just the next item on the menu card. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:06 (P22) |
| CHAI-59 | Even though strictly you can put sugar in next, it should go in the order of what's on the menu card. The half mechanism … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:07 (P23) |
| SH-190 | One, when it's being spoken, I guess you could add this to the language card before confirming it from what I'm saying. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:12 (P24) |
| LNG-24 | But when it's spoken, you say the quantity right after saying my or saying me. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:13 (P25) |
| CHAI-60 | So you'd say muke ag chai kape muke ako chai kape. Like I half tea want, I full tea want. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:14 (P26) |
| SH-191 | And then the other piece of feedback is that it ticked the half item card when I actually put in the full amount. So I … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:17 (P27) |
| CHAI-61 | So same as the sugars, if half is achieved, then it should just tick after half. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:21 (P28) |
| LNG-25 | I know that means they can just put half, and it will tick, but they'll learn, because then we should be strategic about … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:22 (P29) |
| LNG-26 | And again, maybe if they get stuck on that for a while, the fact that you need to press the... the fact you need to … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:26 (P30) |
| SH-192 | Use the onboarding style, but give it as a hint after a while. I don't know, it felt explanatory to me. I'm still … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:29 (P31) |
| CK-59 | If you're not a new player, Nani should just give you the instruction, and then, like how we have the rule of like 7 or … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:38 (P32) |
| SH-193 | After that time has elapsed, then you should get the onboarding visual of turning on the stove. Otherwise, you should … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:39 (P33) |
| CHAI-62 | The only other thing is there's no consequence, seemingly, for undercooking or overcooking the chai. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:43 (P34) |
| CK-60 | I think if I overcook this, it just like bubble over and empties, and you just have to start that pot again. And if you … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:45 (P35) |
| LNG-27 | It just shakes and says no, basically. And the timer keeps going until it hits the green. Well, yeah, it keeps going … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:52 (P36) |
| ART-33 | You might need an image for overboiling from chat, which I can get for you. At least for now, implement that as code. … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 1:57 (P37) |
| LNG-28 | Recording aside, like, it looks good. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/20745828-dc94-5c75-b374-bf95cf4b0716/scratchpad/fb/transcript.md` 2:03 (P38) |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:00 | P1 |
| 0:01–0:04 | P2 |
| 0:05 | P3 |
| 0:06 | chatter |
| 0:07–0:12 | P4 |
| 0:13–0:14 | P5 |
| 0:15 | chatter |
| 0:16–0:19 | P5 |
| 0:20 | P6 |
| 0:21–0:22 | chatter |
| 0:23–0:25 | P6 |
| 0:26 | P7 |
| 0:27–0:28 | P8 |
| 0:29–0:32 | P9 |
| 0:33–0:34 | P10 |
| 0:35 | chatter |
| 0:36 | P11 |
| 0:37 | P12 |
| 0:38 | P13 |
| 0:39–0:40 | P14 |
| 0:41–0:42 | P15 |
| 0:43 | chatter |
| 0:44–0:47 | P15 |
| 0:48–0:49 | P16 |
| 0:50 | chatter |
| 0:51 | P16 |
| 0:52–0:55 | P17 |
| 0:56–0:58 | P18 |
| 0:59 | P19 |
| 1:00 | chatter |
| 1:01 | P19 |
| 1:02 | chatter |
| 1:03–1:04 | P20 |
| 1:05 | P21 |
| 1:06 | P22 |
| 1:07–1:09 | P23 |
| 1:10–1:11 | chatter |
| 1:12 | P24 |
| 1:13 | P25 |
| 1:14–1:15 | P26 |
| 1:16 | chatter |
| 1:17–1:20 | P27 |
| 1:21 | P28 |
| 1:22–1:24 | P29 |
| 1:25 | chatter |
| 1:26–1:27 | P30 |
| 1:28 | chatter |
| 1:29 | P31 |
| 1:30 | chatter |
| 1:31–1:32 | P31 |
| 1:33–1:34 | chatter |
| 1:35–1:37 | P31 |
| 1:38 | P32 |
| 1:39–1:42 | P33 |
| 1:43 | P34 |
| 1:44 | chatter |
| 1:45–1:47 | P35 |
| 1:48 | chatter |
| 1:49–1:50 | P35 |
| 1:51 | chatter |
| 1:52–1:55 | P36 |
| 1:56 | chatter |
| 1:57–2:02 | P37 |
| 2:03 | P38 |
| 2:04 | chatter |

Lines: 125; in a point 103; chatter 22; unmapped 0.
