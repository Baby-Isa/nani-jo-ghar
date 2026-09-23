# Nani jo Ghar — Project Brief

*Working title. A Kutchi language game for children and adult heritage learners.*

Sep 22, 2026 · @Someone

## What we are building

A Kutchi language game, played on a phone or tablet, in which you walk around a small Kutchi world and complete tasks for the people in it.

The hub is Nani's house. From there you go to the bazaar, the kitchen, the clinic and the beach road, each holding one area of vocabulary. Tasks are given in spoken Kutchi and completed by acting on them: fetch these things, find out who is ill, bring back the right colour threads. Every voice in the game belongs to a real family member.

It is built once as a web app and wrapped for the App Store and Google Play, so the same work produces a website, an iPhone app and an Android app.

## Why it exists

Kutchi is a spoken home language with no standard written form, and the generation that speaks it well is the grandparents. The pattern repeats across the diaspora: grandparents fluent, parents partial, children almost none.

Four reasons this gets built:

1. Zafar would use it himself. Duolingo streaks past a thousand days did not produce speech, and apps like Praktika start too advanced for a partial speaker.
2. Isa will use it, and so will his cousins.
3. It gives Zafar's mother a structure for teaching the grandchildren, rather than having to invent lessons.
4. It is a project Zafar and his mother build together.

Nothing adequate exists. A Freelang wordlist, a paid uTalk course, an iOS phrasebook and a flashcard app, none of them playable by a six-year-old and none built around one family's own Kutchi.

There is no Kutchi speech recognition and no Kutchi voice synthesis, from any vendor. That is a constraint on the design and, later, an opportunity: an app used by enough families becomes the first real corpus of spoken Kutchi.

## Who it is for

Three audiences share one app. They are served by the same screens, not by separate modes.

| Audience | Who | What they need | What breaks it for them |
| --- | --- | --- | --- |
| Children 4 to 11 | Isa, his cousins, community children | Play, repetition, warmth, visible progress | Timers everywhere, losing things, reading-heavy screens |
| Adult heritage learners | Zafar, his generation | To reach useful speech fast, without counting to ten again | Childish padding, slow pacing, no way to skip ahead |
| The teaching adult | Zafar's mother, aunts, grandparents | A structure to teach from, and a reason to be in the room | Being replaced by the app rather than used by it |

The third audience is the one most language apps ignore. Here it is central: the adult who speaks Kutchi is a participant, not a bystander.

## What success looks like

In order. Each one only matters if the one above it held.

1. **Zafar's mother enjoys recording.** If the first session is fun, the project finishes. If it is a chore, it does not.
2. **A child asks to play it again, unprompted.** One child, twice in a week, is the real signal.
3. **Zafar speaks Kutchi he did not speak before.** Measured by using it with family, not by a score in the app.
4. **Kutchi is spoken aloud in the house more than it was.** Including by the adults, prompted by the game.
5. **Another family asks for a copy.**

Explicitly not success: downloads, streaks, daily active users, time in app. Time in app is a cost the family pays, not a benefit. A child who learns forty words in ten short sessions has done better than one who learned forty in fifty.

## Design principles

These settle arguments later, so they are worth disagreeing with now.

1. **Difficulty is per word, not per level.** How much help a word gets depends on how many times that player has met that word. There is no beginner mode and no expert mode. This is how one app serves a four-year-old and an adult on the same screen, and it is where spaced repetition lives.
2. **The task is the test.** Assessment happens by acting on an instruction, never by a quiz screen. If Nani asks for two lemons and you bring two lemons, you have been assessed.
3. **No cutscenes.** Teaching happens inside the interaction. Anything that plays at you is skippable.
4. **English is available, but never spoken.** Nani's voice is Kutchi only, always. English exists as a gist caption, and as text one tap away on any word or sentence, but it never arrives in the audio channel unasked. The tap is where the effort happens, and the effort is where the learning is.
5. **Every voice is a real person.** No synthesis, no text-to-speech, no AI-generated Kutchi in the product.
6. **Nothing is ever lost.** No punishment mechanics, no losing items or money for being slow. Pressure creates bonuses, never penalties.
7. **Calm places and busy places.** Nani's house has no timers, ever. Urgency belongs outside the house and is always optional.
8. **Progress is an object, not a number.** A quilt that fills in, not points, stars or XP.
9. **Nothing leaves the device.** No accounts, no uploads, no analytics. Recordings made in the app stay on the phone.
10. **Text is never in an image.** All words are drawn over the art, so any word can change without regenerating anything.
11. **The content model comes first.** The app is a content pipeline with a renderer on top. Adding the fifth scene should mean filling in a spreadsheet.

## Non-goals

- **Not a CEFR course.** CEFR assumes a standardised written language with formal registers. Kutchi has neither. We borrow its sequencing logic and claim none of its levels.
- **Not a script-teaching app.** Kutchi is written informally in Gujarati or Perso-Arabic script and there is no agreed standard. Romanised spelling only, matched generously.
- **Not a dictionary or a preservation archive.** Those are worthy and they are different projects.
- **Not a business.** No ads, no subscriptions, no growth targets. If it is ever released widely, it is free.
- **Not a replacement for speaking to your grandmother.** The app exists to get more Kutchi spoken between people, not less.
- **Not multi-dialect.** One family's Kutchi, done properly, beats a neutral version nobody recognises. Other varieties can come later as alternate audio.

## Language authority and rights

**Zafar's mother and aunt are the authority on correct Kutchi.** Not Claude, not ChatGPT, not Gemini, not the Freelang dictionary, and not the class handouts. Two AI models agreeing on a Kutchi word is not evidence. Every word ships only after a family member has confirmed or corrected it.

Each word in the content master carries its source and a confidence flag, so review effort goes where it is needed rather than over everything equally.

**Differences from the class handouts are not all one-off.** Some are structural and run across many words, for example a systematic r where the family says d, or the reverse. Once a few corrections from Zafar's mother and aunt show a pattern like this, the same pattern can be proposed against the rest of the draft list in one pass, rather than checked word by word. They still confirm the result; the pattern only speeds getting there.

**On the class materials.** The handouts from the Zoom lessons carry a "Copyright GTP Course" notice on most pages, so they are a third-party course the teacher taught from rather than her own work. Her permission covers her own material, not theirs.

| Use | Position |
| --- | --- |
| Private family use of the handouts | Fine |
| Vocabulary itself (the Kutchi word for banana) | Not ownable, fine to use |
| Their rhymes, lesson text, images, page layouts | Not ours to ship |
| Unit sequence as inspiration for scene order | Fine, and sensible |

Everything in the released app is recorded, written and drawn for this project. The handouts are a map of what to cover, not a source to copy.

**Recording consent.** Every contributor is told where their voice will be used and can have it removed. Children's voices are not recorded for the shipped app.

## Scope of the first release

One room and one stall, finished properly, in the family's own voices.

**In scope**

- Nani's kitchen as the hub, with the pantry that shows what is missing
- One bazaar stall: fruit, vegetables and spices
- Roughly 60 words: the produce, numbers one to ten, and the handful of phrases the shopkeeper and Nani need
- The per-word difficulty model, running from the first session
- The quilt, with patches earned
- Recordings by Zafar's mother, with Zafar as a second voice
- Runs in a browser and installs to a phone home screen

**Out of scope for now**

- Other stalls, the clinic, the beach, the wider map
- The notebook, colours and the blanket quest
- Speaking assessment of any kind
- App Store and Google Play submission
- Any second dialect or second family's audio

The test at the end of the first release is narrow and honest: does a child in the family ask to play it twice, and did the recording session with Zafar's mother feel like a good evening. Everything after that is conditional on both.

## How we work

**Roles**

| Who | Owns |
| --- | --- |
| Zafar | Direction, scope, image generation, recording sessions, final say |
| Zafar's mother | Correct Kutchi, the voice, what a Kutchi home actually contains |
| Zafar's aunt | Second opinion where the family varies |
| Claude | Design, code, asset processing, content structure |

**Rules for working with Claude on this project**

1. **Discuss unless told to act.** When the conversation is exploratory, stay in discussion. Do not create files, write code or generate assets until asked directly.
2. **Always recommend a model and an effort level** alongside any suggested action, so cost is a visible choice.
3. **Cheapest route that reaches the quality bar.** Opus for judgement, Sonnet for anything mechanical.
4. **Never author Kutchi.** Draft it flagged as a draft, and mark clearly where it came from.
5. **Assets follow the word list**, never the other way round. No image is generated for a word that is not going into the app.

**Documents**

| Document | Holds |
| --- | --- |
| This brief | Why, who, principles, scope |
| Game design | Mechanics, scenes, progression, art direction |
| Content master (spreadsheet) | Every word: syllabus area, game mode, assets, recording status |
| Technical plan | Architecture, data model, screen sizes, release |
