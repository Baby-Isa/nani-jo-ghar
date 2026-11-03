# Feedback: chai-play-2026-11-03 (draft skeleton)

**Source:** /tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md. 175 transcript lines, 48 draft points, 17 lines of chatter. Made by `build/tools/ops/feedback.mjs`; every cause is to be checked in code before this goes to Zafar.

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
| P1 | 0:01 | So I've just played level 1 on laptop as a new player. Feedback is, when I first loaded the game, it went straight into the, what do you call it, the half hole T focus screen, which is the wrong place for it to show. It … | ? | | |
| P2 | 0:04 | So for example, say it arrives at level 4, I can't remember, but say it arrives at level 4, and the first time you're playing level 4, it does half and whole, right? If that is the first time you interact with it, then … | language and audio | | |
| P3 | 0:09 | Well, the time needs to be between, kind of the extra time needs to be once it's poured halfway, then you can snap it and it can turn into a card, but it needs to settle on that card for about twice the time. And then … | shared components | | |
| P4 | 0:12 | Also, as I see on the screenshot now, I'm realizing the English word is blurred, but it shouldn't be blurred because it's the first time you're seeing these words. I mean, I selected new player, so something's wrong … | art | | |
| P5 | 0:15 | And if the word has gotten to the right place in this ladder, which it can't have because I selected new player. I think the shutter doesn't really work, so remove that. I think just put the four corners, blink the … | language and audio | | |
| P6 | 0:23 | Then when the tea gets poured in, the glass moves a few pixels left or right, turns to have a dark grey background as it fills with tea. So it's just a bit messy. | chai | | |
| P7 | 0:25 | I think let's change it to the two glasses being on the kitchen countertop, but without the tray, seen exactly from side on. I think that's a good idea. Or you could maybe do it slightly like 10 to 15 degrees higher, so … | Cook (general) | | |
| P8 | 0:29 | But I just wonder if that would be harder to replicate in the artwork. | art | | |
| P9 | 0:30 | I'm thinking it should be the same type of scene as the flower, sorry, as the cake measurements to focus words. Because it's like it's pouring in its measurements, right? So I don't know whether the cake one would work … | language and audio | | |
| P10 | 0:37 | And yeah, just use the kitchen counter and kitchen setting. And then, because the glasses are transparent, but, you know, not perfect, there'll be some, I guess, reflections, or partly you can see through the glasses. | Cook (general) | | |
| P11 | 0:39 | So I wonder if that was the cause of why initially there was see-through, but then as the tea was pouring, there became less see-through, because you can't model that. | chai | | |
| P12 | 0:40 | I'm not sure, but maybe when you do the art run, it's just a suggestion, have an independent think about what's best. | art | | |
| P13 | 0:41 | But maybe during the art run, you just get the tea poured at, like, you know, 10 different stages of being full, have all the teas in a row on the... countertop. | chai | | |
| P14 | 0:42 | Because if it's got the same tiled background behind it, then... or maybe that wouldn't work, because if you superimpose them, if the background's slightly different or has a slightly different angle, then the partial … | art | | |
| P15 | 0:44 | Or maybe you make a tile, use the kitchen tile, you turn that into the background, and then you make a sprite, or you make a sheet with just tiled background, and then you ask it to make the tea being transparent with … | chai | | |
| P16 | 0:45 | So it's one sprite sheet with a tiled background with the glass being filled, different levels. | art | | |
| P17 | 0:46 | That way, it makes sense when you put the cut out of the glass and put it on the countertop, because there's a tile see-through as is in the kitchen, and it's consistent across the glasses. I'm sure there's ways of … | Cook (general) | | |
| P18 | 0:51 | And then the second image, you can see that it's not scrolling after milk for some reason. So the first item, like, was water, and that ticked, and there was no scrolling, which I think is correct, as is specified. | art | | |
| P19 | 0:53 | Then the next one was tea. And when T ticked, there was a scrolling such that T went to the left, and the next item to fill, milk, went into the middle. Then after milk ticked, it didn't scroll over. So I think this is … | chai | | |
| P20 | 1:03 | And it should move into view before you take it off. And T, the third last item, can be in half. I think that's the only feedback from level one. I'm going to turn off new player. And I'm going to play level 2 now on … | chai | | |
| P21 | 1:11 | Firstly, the images in the item cards and the actual items on the tray have are different. | art | | |
| P22 | 1:12 | So I think for ginger, the bottle of ginger on the item card is different from the bottle of ginger on the shelf. | shared components | | |
| P23 | 1:13 | So can we just do a sweep to make sure all images are using the latest one? I think for that specific case, the one on the shelf is the correct one. Also, I didn't get a hint. I played as if I was stuck. | art | | |
| P24 | 1:18 | I did the first tea tray, having played it for the first time. I had new player turned off, but I filled the first tea tray, poured the first tea, and then I did nothing for like 30 seconds, and there was no hint to … | chai | | |
| P25 | 1:21 | And there should have been an onboarding hint to click that. There should be like a stuck hint, right? Not an onboarding hint, a stuck hint, but it uses the onboarding artwork, the onboarding methodology of highlighting. | shared components | | |
| P26 | 1:24 | And then I pressed water bottle on the first tea tray, even though I'd already been served tea, and it correctly didn't let me pour the tea. Sorry, it correctly didn't put the water into the first tray, but again, that's … | chai | | |
| P27 | 1:28 | That's what the nanny help hint says, which is correct. But for others, it doesn't say that sentence, like for milk or ginger. At least some of them I didn't follow that. Is it pulling from the language engine? And the … | language and audio | | |
| P28 | 1:38 | And then what I've noticed is when the pop-up card minimizes and goes into the left sidebar, I think because of the proportions, when it scales down to the right and correct width, the pop-up card, when it scales down to … | shared components | | |
| P29 | 1:41 | So the item shrinks down and then suddenly, jerkily, jumps up and increases in height to fill the box, right? Because it's reduced its height too much in order to, I believe, reduce its width to fit the width of the item … | shared components | | |
| P30 | 1:46 | Only concerns for that might be around space. You know, I think that means making it slightly narrower. Or you could make it slightly taller, which would be fine as well, maybe easier. The other option is just have it … | shared components | | |
| P31 | 1:52 | You assess the different options, the ones I suggested, and think of your own ones as well based off of how this is normally done and let me know. That's important because that would affect the transition of all games, … | shared components | | |
| P32 | 1:58 | When the second person gave the order, first time it was Ali, second time it was, I don't know who it was, the wife, the woman. | shared components | | |
| P33 | 1:59 | The first item they ordered, no sound played for it, right? | language and audio | | |
| P34 | 2:00 | Even though Nana, as the first person, ordered the whole lot of chai, everything was said correctly, sound was working. | chai | | |
| P35 | 2:01 | When the second person ordered their order, the first item in their order didn't have a sound to it. But then the second item and subsequent items did. And I think both times it was a different item. So I don't think it … | language and audio | | |
| P36 | 2:06 | Also, this time round, because I put new player, I got onboarded for the blur, the dotting of the English in the item card. The box needs to be a different style because it's such a small space and it's such a small box. … | shared components | | |
| P37 | 2:13 | Or just do it by eye. The point being, it needs to be a lot more like a long, thin rectangle with slightly rounded corners. And it should go yeah, it's fine, it should just go over the dotted lines. But then maybe we do … | clinic heal games | | |
| P38 | 2:19 | So I do wonder if in this instance, we do a click icon to a finger pointer to click and show it turns to English, or it highlights it as dotted, plays a clicking sound, and it changes to English. I wonder if that's an … | language and audio | | |
| P39 | 2:22 | I'm going to continue to play level 2 as a new onboarded player, as a new player. the onboarding for selecting the second tea pan needs to happen quicker after the tea's been poured, like, I don't know, 0.3 seconds. … | chai | | |
| P40 | 2:25 | Once it's returned to the stove, literally give it 0.3 seconds and then start the onboarding to show that they need to click on the second pan. | shared components | | |
| P41 | 2:26 | See third image, I'm seeing that the nanny's helper head size icon looks bigger than the ordering person's head size, and her text box still looks much taller to my eyes. Double check, but I thought we made the decision … | art | | |
| P42 | 2:29 | For some reason, the order of no sugar doesn't, on level 3, sorry, I'm not playing on level 3, the order of no sugar doesn't blur the sugar as well as it's meant to. | chai | | |
| P43 | 2:30 | But the point about Nani's card being taller than the menu card, that's consistent across. I've seen that at all levels, FYI. On level 4, which I'm now playing as a new player, the placement of the cards is much better. … | shared components | | |
| P44 | 2:39 | So if you imagine a circle centered on Nana's head, then it can move in along the perimeter of the circle from the bottom to the left side in an arc, but it can't turn a corner. Yeah, so maybe change it to an arc, but … | shared components | | |
| P45 | 2:47 | Also, the item cards for full and half cup need to be the side on views, like the item cards we snapped in the half measurement, full measurement explanation cutscene. | shared components | | |
| P46 | 2:48 | It camera shattered and it took the pictures for those item cards, so that's obviously the pictures that we have to use. Okay, that's the full playthrough on laptop. I've given you enough feedback already, so I'm gonna … | art | | |
| P47 | 2:51 | The first thing you can do is give me the new artwork for the new artwork prompt for the T half and full, because the kind of artwork prompt you gave me is just finishing up now, it's downloading, so I'll run that and … | art | | |
| P48 | 2:55 | Use the feedback skill to log all of this and action it. | art | | |

## 3. Draft regression rows (check, then add to `docs/process/regressions.md` the same day)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CK-58 | So I've just played level 1 on laptop as a new player. Feedback is, when I first loaded the game, it went straight into … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:01 (P1) |
| LNG-24 | So for example, say it arrives at level 4, I can't remember, but say it arrives at level 4, and the first time you're … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:04 (P2) |
| SH-199 | Well, the time needs to be between, kind of the extra time needs to be once it's poured halfway, then you can snap it … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:09 (P3) |
| ART-39 | Also, as I see on the screenshot now, I'm realizing the English word is blurred, but it shouldn't be blurred because … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:12 (P4) |
| LNG-25 | And if the word has gotten to the right place in this ladder, which it can't have because I selected new player. I think … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:15 (P5) |
| CHAI-70 | Then when the tea gets poured in, the glass moves a few pixels left or right, turns to have a dark grey background as it … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:23 (P6) |
| CK-59 | I think let's change it to the two glasses being on the kitchen countertop, but without the tray, seen exactly from side … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:25 (P7) |
| ART-40 | But I just wonder if that would be harder to replicate in the artwork. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:29 (P8) |
| LNG-26 | I'm thinking it should be the same type of scene as the flower, sorry, as the cake measurements to focus words. Because … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:30 (P9) |
| CK-60 | And yeah, just use the kitchen counter and kitchen setting. And then, because the glasses are transparent, but, you … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:37 (P10) |
| CHAI-71 | So I wonder if that was the cause of why initially there was see-through, but then as the tea was pouring, there became … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:39 (P11) |
| ART-41 | I'm not sure, but maybe when you do the art run, it's just a suggestion, have an independent think about what's best. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:40 (P12) |
| CHAI-72 | But maybe during the art run, you just get the tea poured at, like, you know, 10 different stages of being full, have … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:41 (P13) |
| ART-42 | Because if it's got the same tiled background behind it, then... or maybe that wouldn't work, because if you superimpose … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:42 (P14) |
| CHAI-73 | Or maybe you make a tile, use the kitchen tile, you turn that into the background, and then you make a sprite, or you … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:44 (P15) |
| ART-43 | So it's one sprite sheet with a tiled background with the glass being filled, different levels. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:45 (P16) |
| CK-61 | That way, it makes sense when you put the cut out of the glass and put it on the countertop, because there's a tile … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:46 (P17) |
| ART-44 | And then the second image, you can see that it's not scrolling after milk for some reason. So the first item, like, was … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:51 (P18) |
| CHAI-74 | Then the next one was tea. And when T ticked, there was a scrolling such that T went to the left, and the next item to … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 0:53 (P19) |
| CHAI-75 | And it should move into view before you take it off. And T, the third last item, can be in half. I think that's the only … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:03 (P20) |
| ART-45 | Firstly, the images in the item cards and the actual items on the tray have are different. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:11 (P21) |
| SH-200 | So I think for ginger, the bottle of ginger on the item card is different from the bottle of ginger on the shelf. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:12 (P22) |
| ART-46 | So can we just do a sweep to make sure all images are using the latest one? I think for that specific case, the one on … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:13 (P23) |
| CHAI-76 | I did the first tea tray, having played it for the first time. I had new player turned off, but I filled the first tea … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:18 (P24) |
| SH-201 | And there should have been an onboarding hint to click that. There should be like a stuck hint, right? Not an onboarding … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:21 (P25) |
| CHAI-77 | And then I pressed water bottle on the first tea tray, even though I'd already been served tea, and it correctly didn't … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:24 (P26) |
| LNG-27 | That's what the nanny help hint says, which is correct. But for others, it doesn't say that sentence, like for milk or … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:28 (P27) |
| SH-202 | And then what I've noticed is when the pop-up card minimizes and goes into the left sidebar, I think because of the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:38 (P28) |
| SH-203 | So the item shrinks down and then suddenly, jerkily, jumps up and increases in height to fill the box, right? Because … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:41 (P29) |
| SH-204 | Only concerns for that might be around space. You know, I think that means making it slightly narrower. Or you could … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:46 (P30) |
| SH-205 | You assess the different options, the ones I suggested, and think of your own ones as well based off of how this is … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:52 (P31) |
| SH-206 | When the second person gave the order, first time it was Ali, second time it was, I don't know who it was, the wife, the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:58 (P32) |
| LNG-28 | The first item they ordered, no sound played for it, right? | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 1:59 (P33) |
| CHAI-78 | Even though Nana, as the first person, ordered the whole lot of chai, everything was said correctly, sound was working. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:00 (P34) |
| LNG-29 | When the second person ordered their order, the first item in their order didn't have a sound to it. But then the second … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:01 (P35) |
| SH-207 | Also, this time round, because I put new player, I got onboarded for the blur, the dotting of the English in the item … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:06 (P36) |
| CLN-218 | Or just do it by eye. The point being, it needs to be a lot more like a long, thin rectangle with slightly rounded … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:13 (P37) |
| LNG-30 | So I do wonder if in this instance, we do a click icon to a finger pointer to click and show it turns to English, or it … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:19 (P38) |
| CHAI-79 | I'm going to continue to play level 2 as a new onboarded player, as a new player. the onboarding for selecting the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:22 (P39) |
| SH-208 | Once it's returned to the stove, literally give it 0.3 seconds and then start the onboarding to show that they need to … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:25 (P40) |
| ART-47 | See third image, I'm seeing that the nanny's helper head size icon looks bigger than the ordering person's head size, … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:26 (P41) |
| CHAI-80 | For some reason, the order of no sugar doesn't, on level 3, sorry, I'm not playing on level 3, the order of no sugar … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:29 (P42) |
| SH-209 | But the point about Nani's card being taller than the menu card, that's consistent across. I've seen that at all levels, … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:30 (P43) |
| SH-210 | So if you imagine a circle centered on Nana's head, then it can move in along the perimeter of the circle from the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:39 (P44) |
| SH-211 | Also, the item cards for full and half cup need to be the side on views, like the item cards we snapped in the half … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:47 (P45) |
| ART-48 | It camera shattered and it took the pictures for those item cards, so that's obviously the pictures that we have to use. … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:48 (P46) |
| ART-49 | The first thing you can do is give me the new artwork for the new artwork prompt for the T half and full, because the … | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:51 (P47) |
| ART-50 | Use the feedback skill to log all of this and action it. | **open** | eye: | `/tmp/claude-0/-home-user-nani-jo-ghar/b7217822-c121-50b5-9d7b-54bb23878ded/scratchpad/note-t.md` 2:55 (P48) |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:01–0:03 | P1 |
| 0:04–0:06 | P2 |
| 0:07 | chatter |
| 0:08 | P2 |
| 0:09–0:11 | P3 |
| 0:12–0:14 | P4 |
| 0:15–0:17 | P5 |
| 0:18 | chatter |
| 0:19–0:22 | P5 |
| 0:23–0:24 | P6 |
| 0:25–0:26 | P7 |
| 0:27 | chatter |
| 0:28 | P7 |
| 0:29 | P8 |
| 0:30–0:35 | P9 |
| 0:36 | chatter |
| 0:37–0:38 | P10 |
| 0:39 | P11 |
| 0:40 | P12 |
| 0:41 | P13 |
| 0:42–0:43 | P14 |
| 0:44 | P15 |
| 0:45 | P16 |
| 0:46 | P17 |
| 0:47 | chatter |
| 0:48–0:50 | P17 |
| 0:51–0:52 | P18 |
| 0:53–0:54 | P19 |
| 0:55 | chatter |
| 0:56 | P19 |
| 0:57 | chatter |
| 0:58–1:02 | P19 |
| 1:03–1:08 | P20 |
| 1:09 | chatter |
| 1:10 | P20 |
| 1:11 | P21 |
| 1:12 | P22 |
| 1:13–1:15 | P23 |
| 1:16 | chatter |
| 1:17 | P23 |
| 1:18 | P24 |
| 1:19 | chatter |
| 1:20 | P24 |
| 1:21–1:23 | P25 |
| 1:24–1:25 | P26 |
| 1:26 | chatter |
| 1:27 | P26 |
| 1:28–1:30 | P27 |
| 1:31 | chatter |
| 1:32–1:34 | P27 |
| 1:35 | chatter |
| 1:36–1:37 | P27 |
| 1:38–1:40 | P28 |
| 1:41–1:45 | P29 |
| 1:46–1:51 | P30 |
| 1:52 | P31 |
| 1:53 | chatter |
| 1:54–1:57 | P31 |
| 1:58 | P32 |
| 1:59 | P33 |
| 2:00 | P34 |
| 2:01–2:05 | P35 |
| 2:06–2:11 | P36 |
| 2:12 | chatter |
| 2:13–2:18 | P37 |
| 2:19–2:21 | P38 |
| 2:22–2:24 | P39 |
| 2:25 | P40 |
| 2:26–2:28 | P41 |
| 2:29 | P42 |
| 2:30–2:35 | P43 |
| 2:36 | chatter |
| 2:37–2:38 | P43 |
| 2:39–2:44 | P44 |
| 2:45 | chatter |
| 2:46 | P44 |
| 2:47 | P45 |
| 2:48–2:50 | P46 |
| 2:51–2:54 | P47 |
| 2:55 | P48 |

Lines: 175; in a point 158; chatter 17; unmapped 0.
