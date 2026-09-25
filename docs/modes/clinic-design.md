# The clinic (the doctor's clinic; formerly "Nani's clinic"): design (mode id `clinic`)

**Date:** 25 Sept 2026
**Status:** a proposal for Zafar. Nothing has been built. It follows `docs/modes/MODE-DESIGN-BRIEF.md` and builds on `docs/game-modes-v2.md` (mode 5), `docs/find-it-design.md` (the model), `docs/cook-with-nani-phase-a-design.md`, `docs/cook-with-nani-kutchi-audit.md`, `docs/cook-with-nani-build-log.md` and `docs/cook-with-nani-todo.md`.
**Placeholder rule:** there is **no Kutchi yet for any body part, feeling, care item, instrument or "it hurts" frame** (checked against `data/content.json` and `data/cook.json`). Anything written like `[EN: knee]` is an English placeholder, shown in grey italic until the family gives the word. The only Kutchi used below is what already exists: *Salamun alaykum / Wa alaikum salaam, Aabhar aanjo, Achija, Arre re!, Hedo!, Ghan, Muke {x} khape, Ne {x}, Muke hikdo {x} dine*, numbers 1–10, and the food words *dudh, paani, chai, khun, hardar, aadu*. **Never invent Kutchi.**
**Safety rule for this mode:** it's pretend care, not medicine. No needles, no blood, no surgery, no pills or doses for the player to give, nobody gets worse, and nothing a child could copy as real medical advice (section 7.4).

---

## Revision, 25 Sept 2026: centred on the doctor's clinic

**Why this revision.** Zafar's feedback on the design below, in his words (roughly): *"The clinic game needs work. It should centre on the actual doctor, Hannah's real-life granddad, and on his clinic. For the first game, maybe you go yourself because you're sick, or you just go and help at the clinic. Different people come in and describe their pain, and sometimes the doctor asks them 'is it this or is it that?'. Then eventually you have to listen to the patient yourself and get the right thing to fix what they said was wrong. I think that's a more fun mode."* This section is the answer: what's adopted, what's kept from the design below, and where I disagree and why. **It supersedes anything below that contradicts it**; sections 1, 3–6, 8, 9, 11 and 12 have been patched to match, and the rest stands.

### R1. The verdict on the idea, in short

- **Adopt the centre.** It's **the doctor's clinic**, not Nani's. He is the host, the voice of the mode and its warmth; Nani is its first patient in the story (Arc 3) and the owner of the animals in the vet corner. The mode id stays `clinic`; the display name becomes whatever the children call him (Questions for Mum, E102), with **"The clinic"** as the working title. The Cast doc lists him as Zafar's wife's granddad; his reference photos stay private.
- **Adopt "is it this or that?" as the mode's scaffold, not a decoration.** It replaces the abstract "warmer" hint (the doctor pointing at half a body) with a line a real doctor says, and it gives the mode a progression a 5-year-old can feel: *he asks and the patient answers* → *he asks and you answer* → *nobody asks; you listen*. Section R4 has the rules that stop it leaking.
- **Adopt "you're the patient" as the first minute** of the story round and as a one-minute free-play route, **not as the whole first game** (R5 says how it works with no speech recognition; R7 says why it can't be the core).
- **Keep the treat loop** the design below built (*Where does it hurt?* → the care trolley → gentle hands → *Just right* → *Who's next?*). Zafar's last sentence, "listen to the patient yourself and get the right thing to fix what they said was wrong", *is* that loop. His idea changes how the player gets there, and who the game is about; it doesn't change where the player ends up.

### R2. The new pitch

**The clinic.** Down the lane from Nani's house is the doctor's clinic: a bench by the door, a window with the rain on it, Kasuku on a perch (he comes along in the story and stays), and the doctor, bald, white-bearded, clear glasses, a checked blazer, and a laugh you can hear from the gate. He's the family's own doctor (Hannah's granddad), and the children are welcome there. **You're his helper.** Different people come in (Nana, Ma, Ali, the cousin, neighbours, and now and then a cat) and say what's wrong, in Kutchi. The doctor asks the questions a doctor asks (*[EN: Where does it hurt? Is it the knee, or the foot? Are you hot, or cold?]*), and **you do the doing**: find the place, fetch the right thing from the trolley, put it on gently, and check it's just right. At first the doctor asks and the patient answers, so you hear everything twice; then he asks and looks at you; then he's busy with the next patient and it's all yours. Nothing in the clinic can be done without understanding what the patient said. The doctor gives any medicine himself.

**Why it's more fun than the design below.** The design below had the doctor as a task-giver at the edge. Now the game's warmth comes from a real person the children know, the questions a child hears at a real clinic become the game's scaffold, and the child gets to be looked after before they look after anyone.

### R3. The core loop (one patient, 60–90 s; a clinic morning is 3–4 patients, about 4 minutes)

| Step | What happens | The Kutchi that decides it |
|---|---|---|
| 1 **Who's next?** (level 2+) | The doctor calls a name; you tap that person on the bench and greet them (respect language for elders) | Who |
| 2 **The complaint** | The intro card (one line per complaint, ••• or text by word stage) shrinks into the sidebar. The patient says it: *[EN: My knee hurts]*. **3 s of quiet** | Part (or feeling) |
| 3 **The doctor's question** (levels 1–2) | *[EN: Is it the knee, or the foot?]* Level 1: the patient answers, *[EN: The knee]*. Level 2: nobody answers; he looks at you | Which of two |
| 4 **Where does it hurt?** | You tap the part on the patient. Right: the soft sore swirl and *[EN: That's it]*. Wrong: a giggle, Kasuku's *Arre re!*, the line again | Part (and side, level 3) |
| 5 **The right thing** | The doctor: *[EN: A plaster, or a bandage?]* (level 1: the patient answers) or, from level 2, the patient says how they feel (*[EN: I'm cold]*). You pick from the trolley, which always holds every unlocked item, shuffled | Care, from the noun or the feeling |
| 6 **Gentle hands** | Peel and stick, wrap, lay the cool cloth and lift it on green, tuck the blanket | Hands (a count from level 2) |
| 7 **Just right** (level 2+) | The doctor: *[EN: Still cold, or just right?]* The patient: *[EN: Still cold]* → another blanket; *[EN: Too hot]* → one off; *[EN: Just right]* → Done | Add, remove or stop |
| 8 **Thank you** | *Aabhar aanjo!*, the doctor's big laugh, a sticker; at the end of the morning: stars, pocket money, the word review | — |

**One concrete round (level 1, Ali).** Ali sits on the examination bench, both hands in his lap. The card shows his face and one ••• line. Ali: *[EN: My knee hurts]*. Three seconds of quiet. The doctor, hands folded, looking at Ali: *[EN: Is it the knee, or the head?]* Ali: *[EN: The knee]*. You tap his knee: a pink swirl, *[EN: That's it!]* The doctor: *[EN: Plaster, or a blanket?]* Ali: *[EN: A plaster]*. The trolley slides up with five things in a new order; you tap the plaster tin, peel one, and drag it onto the swirl. The doctor laughs his big laugh; Ali: *Aabhar aanjo!*; a sticker of Ali's knee goes in the album. Kutchi heard: *knee* three times (once against *head*), *plaster* twice (once against *blanket*), plus *hurts*, *or*, *is it*, *that's it*, *thank you*. If you'd tapped his foot: Ali giggles (*[EN: That tickles!]*), Kasuku squawks *Arre re!*, and Ali says the line again; the ear star for that row is gone, nothing is shown, you try again.

### R4. "Is it this, or that?": the scaffold and its rules

**Why it's good.** The child hears the target word **three times** in one row (the complaint, the question, the answer) and once **against a wrong word**, which is how listening is taught in a classroom (minimal pairs, but in a story). The child also learns the word *or* (needed from the family, G94) by sheer frequency, and hears the doctor's question forms, which they'll hear at a real clinic one day. It models listening: watch the doctor listen, then listen like the doctor.

**The progression** (levels are data; the level number is the player's, per word stage, not a fixed door):

| Level | Name | What the doctor does | What you do | Bot guess rate per row |
|---|---|---|---|---|
| **1** | *The doctor asks, the patient answers* | Asks *X or Y?* after every complaint; the wrong option is **far** (knee vs head; hot vs a plaster); the patient answers | Act on the answer: tap the part, fetch the care | 1 in 2 (part) × 1 in 5 (care) ≈ **10%** per patient; level-1 rows are stage-1/2 words, which the design already treats as teaching |
| **2** | *The doctor asks, you answer* | Asks *X or Y?*; the wrong option is **near** (knee vs elbow, from the look-alike groups); nobody answers | Act; plus the feeling → care, and Just right | 1 in 2 × 2 valid cares of 7 × the Just right direction and count ≈ **3%** |
| **3** | *On your own* | Doesn't ask. A **"?" button = ask the doctor** gets the *X or Y?* question, and costs the tick (Relaxed) or the comfort ring (Busy) | Everything: sides, "not that one", Busy with two benches | as section 10's stop check (**under 1%**) |
| **4** (Arc 4+) | *What happened?* | Asks *[EN: Did you fall, or did you bump it?]* | + a past-tense row | — |

**Rules that stop it leaking** (the Sceptic's list; the leak bot gets a new **"second option"** and **"echo"** strategy for each):
1. The option order is random; the right answer is first exactly half the time.
2. The wrong option is drawn from the level's pool (far at level 1, a look-alike at level 2), never the previous patient's part and never a part already ruled out this visit.
3. **The answer is always given by acting** (tapping the body, the trolley or the blanket), never by tapping a pill that repeats the sound. Matching *knee* in the complaint to *knee* in the question is possible by ear alone, so the game never rewards that match; it rewards knowing where the knee is.
4. The doctor's gaze stays on the patient's face and his hands stay folded during the question; the sore swirl never shows before the right tap; the patient's answer is a neutral head-shot line, no pointing, no rubbing.
5. He asks only when at least two parts (or two cares) are still possible; a question about the last remaining option is never asked, so elimination earns nothing.
6. The question form is the same for parts, feelings and care, so it's one frame to learn and record: *[EN: Is it {X}, or {Y}?]* with the two slots filled from any word list.
7. From level 3, the question costs a star, so no one can halve the field for free.

**Honest weakness.** Two-way is 50%. At level 1 that's acceptable because (a) the ear star also needs the care right, (b) level 1 is where stage-1 and stage-2 words live, and the design already treats stage 1 as taught, not tested, and (c) the point of level 1 is the three hearings, not the test. Zafar decides whether level 1 counts for the ear star at all (R9, decision 6).

### R5. "You're the patient"

**How it works with no Kutchi speech recognition.** The child can't tell the doctor anything, so the hurt is **shown** to them and their answers are **choices between two heard words**, judged by what they can see:

1. **First person, looking down**: your own lap, hands, knees and feet (a new "lap view" image; hands from the existing set). A soft pink scuff on your knee (drawn in code; no blood). Or, for a cold, the camera judders with two sneezes and a tissue comes up in your hand.
2. The doctor, leaning in: *[EN: Arre! You first. Is it your knee, or your hand?]* Two **audio pills** (no text or picture until the reads stage). You tap the one that names what you can see hurts.
3. His hand reaches to a part: *[EN: Does it hurt here?]* You answer *yes* or *no* (audio pills; *yes* and *no* are placeholders until A8.1 and A4.4 are answered). He presses a wrong part first about half the time, so *no* is a real answer.
4. For a cold: *[EN: Are you hot, or cold?]* (the shiver or the fan-face on your own hands is the prompt).
5. He treats you: you choose the plaster design (free, ungraded; Maryam's collection), he puts it on, *[EN: All better!]*, the big laugh.

Three or four two-way rows: a blind bot earns the ear star about **6–12%** of the time; the same standing as level 1 above (R9, decision 6). Nothing is scary: he's gentle, he explains, the plaster is the prize.

**Say it out loud (optional, never graded by the app).** Before tapping a pill, the child can press the microphone and say the word; the app plays their voice next to the family's recording (Game Design: speaking stage 1, shadowing), and a parent or Nani taps ✓ or "again". This is the only production in the mode until the family's few-shot keyword spotting exists (speaking stage 2), and a two-way answer is exactly the "small known set" that stage 2 could one day judge.

**Where it lives.** The first minute of Arc 3 Ch4's clinic round (you slipped in the Ch2 puddle at the gate on the way; a comic tilt of the view, *Arre re!*, no fall shown), and a free-play route **"You're the patient"** (a random visible hurt each time: hand, finger, arm, elbow, knee, foot, toe; or a cold: hot/cold; or a tummy ache, where he asks *[EN: tummy, or head?]* and you can't see it, so the intro card's ••• line is the only prompt, from level 2).

### R6. Story home (Arc 3 Ch4 "Nani has a cold", revised)

| Beat / errand | What happens | Mechanics |
|---|---|---|
| Ch2 "The leak" (seed) | Ali slips in the courtyard puddle, comically, fine: "later". The puddle by the gate stays | Beat only |
| Ch3 "The animals" (seed) | The hen hurt her foot getting into the shed: "we'll take her to the doctor" | Beat only |
| **Ch4 intro beat** (home) | Nani in bed; she sneezes (her glasses jump), holds her head, points at her throat. **Nothing is said about where it hurts: you see it.** Nana: go and tell the doctor. The clinic appears in the fog on the map | Set-up for Tell the doctor |
| **Ch4 errand "The clinic"** (the mode's first round, about 5 min) | On the lane you slip in the gate puddle (a tilt, *Arre re!*). At the door: the greeting (formal). **You're the patient** (60 s): knee or hand? does it hurt here? a plaster, all better. Then **Tell the doctor about Nani**, scaffolded: *[EN: Is it Nani's head, or her tummy?]* → head; *[EN: Her throat, or her ear?]* → throat (picture → word, two pills each). He'll give you something for her after morning clinic: *[EN: Will you help me?]* **Three patients at level 1:** Ali's knee ("you too!"), the hen (the cousin brings her; the vet row), a wet neighbour who's cold (feeling → blanket, one Just right exchange). He hands you a closed bottle for Nani | You're the patient, Tell the doctor (two-way), Who's next? (called, not chosen), Where does it hurt?, the trolley, Gentle hands, one Just right |
| Ch4 outro beat (home) | Nana: *Muke hikdo [EN: medicine] dine*: the bottle from three look-alikes. Nana gives it to Nani. You tuck her blanket (one Just right exchange) | Pass me, Just right |
| Ch5 "Chai together" | Nani's remedy in Cook; the quilt patch is a stethoscope | Hand-off to Cook |

Later arcs are unchanged (section 5.1): Arc 4 past-tense rows (*[EN: Did you fall, or bump it?]*), Arc 5 the village clinic under the neem tree, Arc 2's sore feet as a side errand.

### R7. Where I agree with Zafar, and where I push back

| Zafar's point | Response |
|---|---|
| Centre it on the real doctor and his clinic | **Agree, fully.** Renamed, re-hosted, and the doctor's warmth (the big laugh) is now the mode's reward sound. The design below already had this as open question 1; the answer is yes |
| "You go yourself because you're sick" as the first game | **Agree as the opening minute and a free-play route; disagree as the core.** As a patient the child can't say anything (no speech recognition), so every answer is a two-way tap, and they never get to touch anyone, so the tactile "gentle hands" and the blanket comedy are lost. It's a lovely first minute; it's a thin game. Also, "sick" becomes "a scuffed knee from the puddle" or "the sniffles": Layla shouldn't play at being ill |
| "Or you just go and help" | **Agree: this is the core.** The design below had it; it stays |
| Different people come in and describe their pain | **Agree, with one edit:** not only pain. Half the visits are feelings (*cold, hot, tired, sneezy*) and the animals, because "it hurts" alone is one frame and the S4 syllabus needs the feeling words. "Pain" is "hurt" in the game's own words |
| "Sometimes the doctor asks 'is it this or that?'" | **Agree, and promote it from "sometimes" to the scaffold.** It's better than the "warmer" hint the design had, and it *is* the level structure: always at level 1, unanswered at level 2, on request at level 3. One rule added: the answer is given by acting, never by tapping a matching sound (R4) |
| "Eventually you listen to the patient yourself and get the right thing" | **Agree; this is level 3 of the design below,** with the "?" button as the only way back to the doctor's question, at a cost |
| Not said, but implied by "his clinic": drop Nani's name and Nani's bedroom | **Half agree.** The name goes. Nani's bedroom stays for the Ch4 beats (she's the reason you go), and the vet corner stays at his clinic for now, because the cats are Layla's biggest hook. Whether a real doctor wants a cat on his table is decision 5 |
| Not said: what about *Just right* and *Who's next?* | **Kept,** and folded into his frame: both are the doctor's *or*-questions now (*[EN: Still cold, or just right?]*; *[EN: Who's next: Nana, or Ali?]* at level 2, where the call names two people and you tap the one he means) |

### R8. What changed in this document, and why

| Section | Change |
|---|---|
| Header, 1 | Name: "Nani's clinic" → **the clinic (the doctor's clinic)**; the doctor is host and voice, not a task-giver at the edge |
| 3 Mechanic library | **M13 The doctor's question** (the *X or Y?* scaffold) and **M14 You're the patient** added; M5 folded into M14 (it's what the doctor does to you); M11 Tell the doctor now uses M13's two-way form at level 1 |
| 4 First set | Now: M14 → M1+M13 → M2+M3 → M4 → M7. M13 is a small building block used by all of them |
| 5 Story | Ch4 as in R6; the doctor's cast row |
| 6 Learning | The *or* frame and the doctor's lines; rung 3 of the hint ladder is now the doctor's question; the level table has a "doctor's question" row; the family word list gains *or*, the question forms, short answers and the doctor's lines |
| 7.4 Safety | **Likeness rules for the doctor** (below) |
| 8, 9 | `ask` and `you` mechanics, the first-person lap view, the doctor's "leaning in" pose |
| 11 | Open questions 1 and 3 answered; new decisions in R9 |
| 12 | Phase 1 includes M13 and M14; the first three tasks updated |

**Likeness rules for the doctor** (added to the safety checklist in 7.4):
- He is always competent, kind and in charge. Mistakes are the player's, never his; the comedy is in the patients and the cats (Nana under four blankets, Zazu's wool), never in him.
- No gags at his expense: no sneezing on him, no hat or hair jokes, no exaggerated features. The art bible's rule: stylised, never caricatured. Zafar and Hannah sign off his character sheet, and the sheet is the only reference after that.
- He speaks to elders formally and they to him; the children are welcome and safe with him.
- Medicine is his and stays closed; he never asks the child to give it.
- His in-game name is the family's decision (E102), and whether he records his own lines is theirs too (R9, decision 2).

### R9. A short persona and Sceptic check, verdict, and decisions

| Persona | On the revised design |
|---|---|
| **Layla, 5** | The doctor talking to *her* first ("is it your knee?") is the best minute in the game; she picks the flowery plaster. Level 1 with Ali answering is right for her: she hears *knee* three times and gets it. She asks "is that really Hannah's grandad?" |
| **Zayn, 8** | Level 1 is "too easy" (50/50): he wants level 3 and won't press "?" because it costs the tick. Right: the level follows the word stage, so he's at level 3 within a morning |
| **Maryam, 11** | Wants the clinic to look like his real one. Careful: the art bible's "modern with hints and nods"; decision 3 |
| **Zafar, 38** | More Kutchi per minute than before at level 1 (three hearings per row plus the doctor's frames), and *or* is a word he'll use every day. Worried level 1 is slow: it's 60–90 s per patient, the same as before |
| **Farah, 34** | "You're the patient" is a 60 s route; one patient is 60–90 s |
| **Nani, 68** | "Our doctor": proud, and she's the patient in the story. Asks if she has to do his voice (decision 2) |
| **The Sceptic** | Tries: (1) always the first option → order is random; (2) matching the sound of the complaint to the sound of the question → the answer is on the body, so she still has to know which word is *knee*; (3) at level 1 she's right half the time on the part → the ear star also needs the care, and level 1 is teaching (decision 6); (4) the wrong option is always last patient's part → it's drawn from the pool; (5) pressing "?" at level 3 → costs the tick; (6) the doctor glances at the part → gaze fixed on the face; (7) in "you're the patient", waiting for his hand to show where → his hand is the *prompt* for yes/no, not the answer to *knee or hand?*, which comes first. **She can't reliably win from level 2** |
| **The Builder** | Cheap: M13 is one line template with two slots on the existing pill and ladder; M14 is one lap-view image, the yes/no pills and the doctor's "leaning in" pose; everything else is unchanged. Net new art: one image and one pose |

**Verdict: Go with changes** stands, and the changes are the same prerequisites (the family's words, the doctor's sheet, the shared engine); the revision makes the mode better without making it bigger.

**Decisions for Zafar:**
1. **The name.** "The clinic" until the family says what the children call him (E102); then his name on the map, or a title?
2. **His voice.** Does the doctor record his own lines (about 25 frames), or does Mum voice him too? If he does, his Kutchi is the family's other Kutchi, which the Game Design counts as a feature ("multiple voices").
3. **His likeness and his room.** The likeness rules above; and does his real clinic's look inform the room, or is it a generic lane clinic with nods?
4. **You're the patient first.** A scuffed knee from the puddle (a pink scuff, no blood) or the sniffles: which opening, and is either too much for Layla?
5. **The vet corner at his clinic**, or at home with his blessing ("you do the cats, helper")?
6. **The ear star at level 1.** Two-way questions make level 1 about 10% for a blind bot. Count it, or treat level 1 (and "you're the patient") as teaching, with the ear star from level 2?

---

## 1. Pitch and core loop

**Why this mode exists.** Syllabus stage **S4 "How I feel"** needs a game where **body words, feelings and "it hurts"** decide what you do. Its core verb is **treat**: act gently on a person (or a cat) who tells you, in Kutchi, what's wrong. The player is **the doctor's helper** at **the doctor's clinic** down the lane (see the revision above: the doctor, Hannah's granddad, is the host and the voice of the mode). He asks the questions a doctor asks (*[EN: Where does it hurt? Is it the knee, or the foot?]*, M13) and does anything "medical"; the player finds where it hurts, chooses the comfort care, puts it on with gentle hands, and keeps the waiting room moving. In the story the first patient is the player (a scuffed knee, M14) and the reason for going is Nani (Arc 3, "Nani has a cold").

**The loop (one patient, 60–90 s; a clinic morning is 3–4 patients, about 4 minutes).**
1. **Who's next?** Patients wait on the bench. The doctor calls a name; you tap that person and they come to the examination bench. You greet them (the greeting choice every mode has; respect language for elders).
2. **The intro card** flashes up with the patient's face and one line per complaint (••• or text by word stage), then shrinks into the sidebar. **Then 3 seconds of quiet.**
3. **Where does it hurt?** The patient has said *[EN: My knee hurts]*. At levels 1–2 the doctor asks *[EN: Is it the knee, or the foot?]* (M13; at level 1 the patient answers, at level 2 nobody does). You tap that part of their body. Right: a small soft "sore" swirl appears there and the patient says "that's it". Wrong: they **giggle** ("that tickles!"), Kasuku squawks *Arre re!* from his perch, and they say it again. You try again.
4. **The care trolley.** They say what they need (*Muke [EN: plaster] khape*), or later how they feel (*[EN: I'm cold]*). You pick from a trolley that always holds the full set of care items, in a new order every visit.
5. **Gentle hands.** You put it on: peel and stick a plaster on the sore spot, wrap a bandage round, lay a cool cloth and take it off when its ring goes green, tuck a blanket.
6. **Just right?** From level 2 the doctor asks how they feel now. *[EN: Still cold]* means another blanket; *[EN: Too hot]* means take one off; *[EN: Just right]* means press **Done**. (Nana, who is always cold, can end up under four blankets.)
7. **Thank you.** *Aabhar aanjo!*, a sticker for the album, a small thank-you gift for the shelf, *Achija!* At the end of the morning: stars, pocket money and a word review (Kutchi → English).

**How it differs from Cook and Find it.**

| | Cook with Nani | Find it | **The clinic** |
|---|---|---|---|
| Core verb | **Build** a dish from an order | **Search** a cluttered scene | **Treat** a person who responds to you |
| What you act on | Ingredients and utensils on a worktop | Objects hidden in a room | **A body**: the patient's own head, hands, knees, tummy; a cat's paw |
| Camera | T, straight down | E, eye level, panning | **E**, one patient seated facing you, plus a close-up of the face |
| What the Kutchi decides | What, how many, what order, for whom | Which one, where | **Where on the body, what they feel, what care, who's next, when it's just right** |
| Where the fun comes from | Tactile cooking, timing, the Simon memory | "Found it!", curiosity, combos | **A person reacting live** (giggles, sighs, sneezes, the "ahh" of a cool cloth), comedy cases, being trusted to help, a waiting room to juggle |
| Syllabus weight | S1 nouns and numbers, S2 verbs, S5 first/then | S1 nouns, S2 positions and colours | **S4 body, health, feelings, hot/cold**; S3 kinship and possessives as review; S4 animals in the vet corner |

**Borders with other modes** (the brief's rule: say so rather than take it):
- **Diagnosing from several clues** is *Who did it?*'s verb (deduce). The clinic never asks you to work out an illness from clues; the patient says what's wrong, and examining (M6) reveals it by acting.
- **Catching a sneeze in time** is a *Monsoon rush* verb (react). It's used only as a 2-second hands beat, never as a mechanic.
- **Finding the medicine on a shelf** is *Find it*'s verb. In the clinic, "fetch the medicine" is a "pass me" choice from three bottles and jars.
- **Making Nani's warm drink** (*dudh* + *hardar*, or *aadu* chai) is *Cook*'s. The clinic hands over to Cook for Arc 3's "Chai together".
- **Putting clothes on someone** is *Dress up*'s. The clinic keeps warm with blankets and a hot-water bottle, never clothing.

---

## 2. Research summary

### 2.1 What the hits do, and what we take

| Reference | Concrete mechanic | Why it works | What we take / leave |
|---|---|---|---|
| *Toca Doctor* (Toca Boca) | One patient, four problems at a time; tap a problem to open its puzzle: pull splinters, pop bugs in hair, clean a knee and apply a plaster, set a bone, bubbles out of the tummy (with a burp). No text, no timers, can't get stuck | Tactile, silly, safe; every problem is its own small toy; the body is the playground | **Take:** problems on a body, each fixed by a tactile gesture; plasters; burps and giggles; no fail state. **Leave:** shots and bone-setting (medical fear; see Teddy Bear Hospital below). Its weakness, "repetitive", we fix with spoken variation |
| *Toca Pet Doctor* | 15 animals with gentle, imaginative problems (gum on a bird's foot, a knot in a worm's tail); fix it, feed a snack, they fall asleep | Empathy; the comedy is in the problem, not the pain; ages 2–6 | **The vet corner** (M9) and **silly cases** (M10): Zazu's tail tangled in Big Ma's wool, Simba's thorn |
| *Dr. Panda's Hospital* | Waiting room → bed → a test or procedure → better; 8 animal patients; stickers | The sequence of a visit is itself satisfying; stickers as collection. Reviewers: fun for a while, then nothing more | The **visit sequence** and a **sticker album**. The "nothing more" warning is why we add a waiting room, levels and a meta loop |
| *Operate Now: Hospital* (Spil) | Surgeries with guide lines on where to cut; about 60% of play is base building, staff stamina and timers | Precision tension; management meta | **Leave almost all of it:** gore, surgery, and stamina timers are wrong for this audience, and base building is padding. We take only "upgrades change how it plays" |
| *My Hospital* (Cherrypick) | 80+ funny diseases ("chilli throat", "frozen hands", "slimy lungs"); grow plants, blend cures; decorate the hospital | Comedy illnesses; decorating makes it yours; cures as a collection | **Comedy cases** and **clinic décor** (Maryam). Leave crafting chains: that's Cook's verb |
| *My Hospital* (Bubadu) | Time management plus mini-games: pop bubbles in a syringe, set up a drip, treat a burn, dress a bandage, blood pressure | Short tactile tasks inside a management loop | **Dress a bandage** (M3). Leave syringes and drips |
| *Heart's Medicine*, *Diner Dash*-style hospitals | Patients seated and treated in turn; hearts drain while they wait; quick mini-games per patient | The juggling rush; visible mood | **Who's next?** (M7) and Busy mode's **comfort ring**. Gentler: nobody leaves, nobody gets worse |
| *Two Point Hospital* / *Theme Hospital* | Visual comedy illnesses (a light bulb for a head, a pan stuck on the head); a GP room triages; diagnosis certainty | Humour carries a management game; "visual vs non-visual" illnesses | **Non-visual complaints** (you must listen), gentle **visual comedy** only as a twist (hiccups, a sneeze that blows off Nana's cap). Leave diagnosis certainty (Who did it's verb) |
| *Good Pizza, Great Pizza* (from `game-modes-fun-analysis.md`) | The spoken order is the puzzle; no timer; characters you come to know | Understanding the request *is* the game | The patient's words are the order; recurring family patients with **tendencies** ("Nana is always cold"), as a bias only |

### 2.2 Language-learning evidence

| Evidence | Finding | What we do with it |
|---|---|---|
| Total Physical Response (Asher; classroom studies with young EFL learners) | Body parts and action verbs are the classic TPR content: learners act on spoken commands, comprehension before production, low anxiety | Every row is something you act on (tap the part, apply the care). Grandparent mode takes it into the room: "touch your nose" on your own body (M11) |
| Body-part word acquisition (Waugh and Brownell 2015; early-vocabulary norms) | Face parts (nose, eyes, mouth), tummy, hands and feet come first; elbows, fingers and eyebrows later | **Level order:** big parts and face first; elbow, finger, toe, shoulder later |
| Left–right (Rigal 1994 and follow-ups) | Children use *left* and *right* on their own bodies reliably from about 6–7; on another person later still | Left/right only from level 3, never in a story-required round, never for a 5-year-old's first plays |
| Emotion words (Widen and Russell 2008; recent preschool studies) | *Happy, sad, angry* are learned early; fear, surprise and disgust later; specific labels help children link causes and faces | Feelings start with the body-state words (**hot, cold, tired**) and *happy/sad*; *scared* is held (question 6) |
| Pretend medical play (Teddy Bear Hospital systematic review, 2021) | Mostly lower anxiety and better health knowledge; **two studies found more fear where real medical equipment was used** | Toy-like instruments only; no needles, no blood; comfort care (plasters, blankets, cool cloths) rather than procedures |
| Sociodramatic "doctor's office" play | Role play is a strong vehicle for oral language; adults use richer vocabulary in pretend talk | Grandparent mode "Doctor Nani" (M11): Nani plays the doctor, the child the patient |
| Joint media engagement (parent–child co-play studies) | Children who play educational apps with a parent engage more and perform better | Layla plays with a parent; Explore mode is built for pointing and naming together |
| Simon Says research | Young children find "only act when Simon says" genuinely hard (inhibitory control) | **Kasuku's echo** (M12), held back: only act when the doctor says, not the parrot |
| Corrective feedback (Lyster and Saito 2010, already in Find it) | Prompts beat recasts | After a recast the player retries; the game never shows the answer |
| Children's touch targets (NN/g, already in Find it) | About 2 cm targets for young children | Big body zones at level 1; small parts only inside the face close-up; tablet as the 5-year-old's device |

Sources are listed at the end. Several review pages (Gamezebo, 148Apps, arXiv, PMC) are blocked from this environment; those rows use the search summaries.

---

## 3. Mechanic library

Scoring 1–5. **Forces Kutchi** names the decision, the leaks and how each is closed. Level numbers refer to section 6.4.

| # | Mechanic | How it plays | Fun | Forces Kutchi | Distinct | Plot | Replay |
|---|---|---|---|---|---|---|---|
| **M1** | **Where does it hurt?** | The patient says *[EN: My {part} hurts]*. Tap that part on their body. Face parts live in a **close-up** you open with a magnifier on the head | **4** The patient reacts to every touch: giggles when you're wrong, "ahh" when you're right (*Toca Doctor*) | **5** **Which part** (and from level 3, which side). **Leaks:** the patient holds or rubs the sore part; the sore mark drawn before the tap; the game zooming in on the face when a face part is asked; the biggest part (tummy) or the most frequent part winning; gaze. **Closed:** neutral, symmetric idle pose; the sore mark appears only after the right tap; the magnifier is always there and only the player opens it; parts drawn evenly (no part over 25% of a day's rows, weakest words first); hit areas padded to one size; the first wrong tap costs that row's ear star | **5** No other mode has a body as the target | Arc 3 Ch4 (Nani's head and throat); every clinic morning | **4** 12–20 parts × many patients; sides from level 3; the vet's animal parts |
| **M2** | **The care trolley** | Pick what the patient needs. Level 1: they name it (*Muke [EN: blanket] khape*). Level 2+: they say how they feel (*[EN: I'm cold]*), and either of two cares is right (blanket or a warm drink) | **3** Quick; the fun is the patient's reaction ("ahh!") | **4** **Which care** from the noun, then from the feeling word. **Leaks:** care fixed by body part (knee = always plaster); the trolley holding only the right items; fixed trolley slots; shivering or sweating showing the feeling. **Closed:** every part accepts at least two kinds of care; the trolley always holds every unlocked item, shuffled per visit; shiver/sweat only while the feeling word is at stage 1; only the first pick counts | **4** Cook's pantry is the same tap, but here the choice comes from a feeling, not a recipe | Arc 3 Ch4 (the blanket for Nani); every visit | **4** New care items unlock with the bigger trolley; feelings × two valid cares |
| **M3** | **Gentle hands** | Put the care on: peel and stick a plaster (drag to the spot), wrap a bandage (circle round the limb), cool cloth (lay it, lift it when its ring is green), tuck a blanket (drag up) | **4** The tactile payoff; plaster designs; a neat wrap | **2** Hands only, by design (the break between listening). From level 2, *[EN: wrap it] {n}* times: a count. **Leaks:** the wrap ending itself at N; counting aloud. **Closed:** never ends by itself, press Done; silent count from number stage 3 | **3** Wrap reuses Stir's circular track, and lifting on green reuses Cook's rings | Every visit | **3** Plaster designs (a collection); gestures stay the same |
| **M4** | **Just right** | After the care: *[EN: How do you feel?]* → *[EN: still cold]* / *[EN: too hot]* / *[EN: just right]*. Add a blanket, take one off, cool cloth on or off, or Done | **5** The Goldilocks comedy (Nana under four blankets, Ali complaining he's boiling); a real back-and-forth | **5** **Add, remove or stop**, set by a feeling word each time. **Leaks:** visible shivering or sweating; always 1 step from right; worn shawls that correlate with the feeling; a colour thermometer. **Closed:** body-state visuals only at stage 1; the start is 1–2 steps from right, in either direction, at random; what a patient arrives wearing is random; no readable thermometer (the doctor says the reading) | **5** No other mode has a feedback loop with a person | Arc 3 Ch4 outro (Nani's blanket); Monsoon arrivals are wet and cold | **4** Start states, tendencies as a bias, two patients at once in Busy |
| **M5** | **Does it hurt here?** *(folded into M14: it's what the doctor does to you)* | Press gently on a part; the patient says *[EN: yes]* or *[EN: no]*. On yes, treat it; on no, try elsewhere | **3** Simple, gentle, turn-taking | **3** **Treat or move on**, from yes/no. **Leaks:** a wince or "ouch" sound on yes; pressing everything. **Closed:** the yes and no recordings are neutral and the face doesn't change; the ear star grades what you do after each answer, so pressing everything doesn't help | **4** | Explore; Layla's first visits | **2** Only two words to learn |
| **M6** | **Have a look** | The doctor asks you to examine: *[EN: look in her ear]*, *[EN: listen to his chest]*. Choose the instrument and the place. The torch finds a lost bead in Ali's ear; the stethoscope plays a heartbeat you can hear speed up; the forehead strip is read aloud by the doctor | **5** Instruments are the best toys in *Toca Doctor*; finding something funny | **4** **Which instrument and where** (instrument noun + part). **Leaks:** instruments that fit only one part, so world knowledge answers. **Closed:** each instrument works on several parts (torch: ear, nose, mouth, eye; stethoscope: chest, back, tummy); what's found afterwards can be visual (the picture is the meaning once the Kutchi chose where) | **4** "Examine" is part of the verb; not a search (the body is small and known) | Arc 3 Ch4 clinic; Arc 5 village clinic | **4** Many finds; the "brighter torch" upgrade |
| **M7** | **Who's next?** | The waiting bench: 2–4 patients. The doctor calls *[EN: {name}, come]*; you tap them. Busy mode: two examination benches and a **comfort ring** on everyone waiting | **4** The juggling of a management game (*Heart's Medicine*), gently | **4** **Who** (names and kinship: Nana, Ma, Ali, the cousin, *[EN: auntie]*). **Leaks:** only one person waiting; the called person stands or waves; their face bobbing as they speak (the Chai tray's old leak); a fixed bench order. **Closed:** at least 2 waiting when a call is made (otherwise no call and no ear credit); nobody reacts until tapped; the doctor says the call, not the patient; seats shuffled | **3** Busy juggling is Cook's too; the kinship call is new | Every clinic morning; Arc 3 Ch4 | **5** Queues, tendencies, Busy, two benches, the open clinic |
| **M8** | **Pass me** (the doctor's bag) | Mid-care, the doctor says *Muke hikdo [EN: thermometer] dine*. Three items from one look-alike group in the sidebar | **3** A known, quick interrupt | **5** Proven in Cook: look-alike groups, no translate for free, never a word already in the current complaint | **2** Shared plumbing | Arc 3 Ch4 "fetch the medicine" (three bottles and jars at home) | **3** Any word the player has met |
| **M9** | **The vet corner** | Simba, Zazu, Kasuku, the hen or a goat on the table. The owner speaks: *[EN: Simba's paw hurts]*. Animal parts: paw, tail, ear, nose, wing, beak | **5** The family's own cats as patients; Zazu's tail knotted in Big Ma's wool; Kasuku saying *Arre re!* after your mistake | **4** **Which animal part**, plus a **possessive** (S3 review). **Leaks:** fewer parts (a higher guess rate); the animal licking the sore paw. **Closed:** at least 6 parts per animal (front paws count as two); no grooming animation on the sore part | **4** | Arc 3 Ch3→4 (the hen from "The animals" chapter at the clinic); Arc 5 farm | **4** Five animals; the cats' tricks |
| **M10** | **Silly cases** | Twists on any visit: hiccups (a glass of *paani*, then count), a sneeze that blows off Nana's cap, a sesame seed in the ear, sore feet from the wedding dancing, wool round Zazu's tail | **5** The *Two Point Hospital* and *My Hospital* laugh, kept gentle | **3** The case is visual; the Kutchi is still where it hurts and what they need | **4** | Any arc as side errands | **5** A case collection in the album |
| **M11** | **Tell the doctor** (role reversal) | You **see** the hurt (Nani holds her head, sneezes) but nobody says it. At the clinic the doctor asks you; pick the right audio chunk from three. **Grandparent mode, "Doctor Nani":** Nani sees the word in big text and asks the child; the child touches their own nose; she marks it | **3** Being trusted with Nani's message; Doctor Nani is lovely in the room | **5** **Production:** picture → word. **Leaks:** matching a sound heard earlier (so nothing is said at home); text or pictures on pills (audio only until the reads stage); the odd one out (pills from one look-alike group) | **4** The only production-first mechanic here | **Arc 3 Ch4: carrying Nani's message to the doctor** | **3** Any M1 visit flipped |
| **M12** | **Kasuku's echo** (Doctor says) | Kasuku, on his perch in the clinic, blurts body words. Act only when **the doctor** says it | **4** A Simon Says trap; funny parrot | **4** Still which part; adds inhibitory control. **Leaks:** Kasuku always wrong (so you can rule his word out); fixed. **Closed:** he echoes the right part a third of the time. **Needs an exception to the cast rule** "Kasuku never speaks during a task" | **4** | Hub and clinic, later | **3** A modifier on any visit |
| **M13** | **The doctor's question** (*Is it this, or that?*; revision R4) | After the complaint, the doctor asks *[EN: Is it the {X}, or the {Y}?]*: for a part, a feeling or a care. Level 1: the patient answers and you act on it. Level 2: nobody answers; you act. Level 3: only on request ("?"), at a cost | **4** A real doctor's line; the child hears the word three times, once against a wrong one; the doctor looking at *you* for the answer | **4** **Which of two**, then the act itself. **Leaks:** a fixed option order; the wrong option predictable (last patient's part); answering by matching the sound of the complaint to the sound of an option; the doctor's glance. **Closed:** random order; the wrong option from the level's pool (far, then look-alike); the answer is always an act on the body or trolley, never a pill that repeats the sound; gaze on the patient's face; never asked when one option is left; costs the tick from level 3 | **4** The scaffold is the level structure, which no other mode has | Every visit at levels 1–2; Tell the doctor at level 1 | **4** Any word list fills the two slots; far and near pairs |
| **M14** | **You're the patient** (revision R5) | First person, looking down at your own knees, feet and hands. The hurt is shown (a pink scuff; a sneeze). The doctor: *[EN: Is it your knee, or your hand?]* → two audio pills. *[EN: Does it hurt here?]* (his hand on a part) → yes/no pills. *[EN: Hot, or cold?]* for a cold. He treats you; you choose the plaster design; *[EN: All better!]* Optional "say it" with a parent's ✓ (speaking stage 1) | **5** Being looked after by a real, kind doctor; the plaster is the prize | **3** **Which of two heard words names what you see**, then yes/no: picture → word, the mode's only production. **Leaks:** the doctor's probe hand before the question; two-way guessing (50% a row). **Closed:** the *knee or hand?* question comes before any probe; the probe hand is the prompt for yes/no only, and it's wrong first half the time; 3–4 rows per visit; treated as teaching at level 1 (decision 6) | **5** No other mode puts the player in the chair | **Arc 3 Ch4, the first minute**; a free-play route | **3** Visible parts (hand, finger, arm, elbow, knee, foot, toe), a cold; plaster designs |

**Also rejected:** injections, drips, surgery and bone-setting (fear; the Teddy Bear Hospital evidence); blood; patients getting worse while they wait, or leaving; triage by "who's most ill" (judging suffering is not a game for 5-year-olds); diagnosing an illness from clues (belongs to *Who did it?*); medicine doses, pills or spoons of syrup given by the player; a body chart or labelled drawers (they'd do the listening); hospital base building (*Operate Now*'s padding); crafting cures (Cook's verb); the red cross or red crescent (protected emblems under the Geneva Conventions; developers have been asked to remove them). The clinic's sign is a stethoscope.

---

## 4. Recommended first set

*(Revised 25 Sept 2026 with the revision at the top of this doc.)* **One visit engine where a visit is data**, the way a Cook recipe is: a patient, slots (part, side, feeling, care, count), what's said, and the steps to run. M1–M4 are steps of one visit, **M13 is the scaffold that sets the level**, M14 is the same visit with you in the chair, and M7 is the day around it.

| Order | Mechanic | Why first |
|---|---|---|
| 1 | **M13 The doctor's question** | The smallest block and the one every other uses: a line with two slots, an answer at level 1, silence at level 2, a cost at level 3. Build it first so every mechanic below is played through it from day one |
| 2 | **M1 Where does it hurt?** (through M13) | The mode's reason to exist: body words as the decision. It needs the hotspot data every later mechanic uses |
| 3 | **M2 The care trolley + M3 Gentle hands** | Without these, M1 is a quiz. Together they're the "treat": choose (*[EN: A plaster, or a bandage?]*), then do. M3 reuses Cook's ring, track and drag code, so it's cheap |
| 4 | **M14 You're the patient** | The story's first minute and Layla's favourite: the lap view, two-way pills, yes/no, the plaster picker. Needs M1's parts and M3's plaster only; needs *yes* and *no* from the family (A8.1, A4.4) |
| 5 | **M4 Just right** | The most fun and most Kutchi-dense part (hot, cold, just right, add, remove) and the mode's distinct feel, now asked as *[EN: Still cold, or just right?]*; the hot/cold words are asked in the Questions for Mum (G10–G14) |
| 6 | **M7 Who's next?** | Turns single visits into a clinic morning with time management (the v2 core verb), Busy mode and kinship review; at level 2 the call is an *or*-question too (*[EN: Nana, or Ali?]*) |
| + | **M8 Pass me**, **M9 the vet corner** and **M11 Tell the doctor** (two-way form) come with the story build (phase 3) | M8 is Cook's, reused. M9 is data (new patients and an owner line) on the same engine, and the cats are the best hook for Layla. M11 at level 1 is M13's question with two audio pills (picture → word), which the story needs once |

**Held back:**

| Mechanic | When | Why wait |
|---|---|---|
| M11 Tell the doctor, open form (three pills, no question) | When produce stages exist | Production beyond two-way |
| M6 Have a look | Straight after the first set | Instrument words, instrument art and a few "finds" |
| M10 Silly cases | After M6 | Twists need the base to be stable, and several need M6 (the seed in the ear) |
| M5 Does it hurt here? (as a helper mechanic) | Folded into M14; as a helper mechanic only if Layla wants it after playtest | Two words; M14 already teaches them |
| M12 Kasuku's echo | After Zafar decides on the cast rule | Needs the exception |

---

## 5. Story integration

### 5.1 Where the mode appears

| Arc | Chapter / beat | What happens | Mechanics |
|---|---|---|---|
| **3 Monsoon** | Ch2 "The leak" (seed) | Ali slips in a puddle, comically. He's fine: "later". Seeds his knee for Ch4 | Beat only |
| 3 | Ch3 "The animals" (seed) | The hen hurt her foot getting into the shed. "We'll take her to the doctor" | Beat only |
| 3 | **Ch4 "Nani has a cold"**, intro beat | Rain on the window. Nani sneezes (her glasses jump), holds her head, points to her throat, and goes to bed. **Nothing is said about where it hurts: you see it.** Nana: "go and tell the doctor" | M11 set-up |
| 3 | **Ch4 errand: "The clinic"** (the mode's first round; revision R6) | On the lane you slip in the Ch2 puddle at the gate (a tilt, *Arre re!*). The clinic opens on the map. Greet the doctor (formal). **You're the patient** first (M14, 60 s): *knee or hand?*, *does it hurt here?*, a plaster. Then **Tell the doctor** what's wrong with Nani (M11 in M13's two-way form: *[EN: her head, or her tummy?]*). He says he'll give you something for her after morning clinic: *[EN: Will you help me?]* Help him with 3 patients at level 1: Ali's knee ("you too!"), the hen (vet), a wet neighbour who's cold. He hands you a closed bottle for Nani | M14, M11, M13, M7, M1–M4, M9 |
| 3 | Ch4 outro beat | Home. Nana: *Muke hikdo [EN: medicine] dine*: pick the bottle from three look-alikes (bottle, honey jar, pickle jar). Nana gives it to Nani. You tuck her blanket (one M4 exchange) | M8, M4 |
| 3 | Ch5 "Chai together" (Cook) | Nani's warm drink (*dudh* + *hardar*, or *aadu* chai) in Cook; Nani feels better; the quilt patch is a stethoscope (Game Design: patch motifs) | Hand-off to Cook |
| 3 | Monsoon side errands | Wet, cold neighbours; Simba soaked; Zazu's tail in the wool basket | M4, M9, M10 |
| **4 Lost ring** (S5) | Side errands | Nana bumped his head searching under the charpai: patients say **what happened** (past tense) before where it hurts. Level 4 content | M1 + S5 rows |
| **5 Village** (S6) | "The farm" side errand; **the village clinic** | The doctor visits Nani's village (he's Nana's old friend, which also works for "Nana's stories"). A clinic under the neem tree in the courtyard: a thorn from the field, sunburn (*hot*), a goat. Rows can be comparatives (*[EN: hotter than yesterday]*) | M6, M9, M10 |
| **2 Wedding** (S3), optional | Side errand | Sore feet after the dancing: kinship review ("Masi's feet") | M1, M10 |

The Roadmap lists Ch4 as two errands, "Where does it hurt (Body/dress)" and "the clinic (Shopping)". This design makes the home part a **beat** and the clinic the **one errand**, so two treat errands never come back to back (Roadmap rule: consecutive errands never repeat the main action). Question 8.

### 5.2 Who drives it

| Cast | Role |
|---|---|
| **The doctor** (Hannah's granddad; real likeness) | **Host, voice and the mode's warmth:** calls names, asks *[EN: Is it this, or that?]* (M13), treats the player first (M14), asks you to examine, gives any medicine himself. Big laugh; praises you. Speaks formally to elders (respect language). Never the butt of a joke (likeness rules, 7.4) |
| **Nani** | First patient (at home, in bed, where her *Arre re!* is the warm-failure voice); the owner of Simba, Zazu and Kasuku in the vet corner, so she speaks their complaints |
| **Nana** | Patient with a tendency ("always cold"); gives Nani the medicine in the outro |
| **Ma, Ali, the older cousin, baby Isa** (on Ma's lap, once designed) | Patients with tendencies (Ali: too hot, always moving; the cousin: lost something in his ear) |
| **Simba, Zazu** | Vet patients: Simba's thorn, Zazu's wool-knotted tail. On the clinic floor as ambient life otherwise |
| **Kasuku** | Vet patient (a sore wing). On his perch, he imitates *Arre re!* just after your mistake (his existing behaviour, not a task voice) |
| **Big Ma** | Visits with her sewing bag; her **song** calms a sad patient (a care item: "Big Ma sings"), and her wool is Zazu's problem |
| Villagers (generic) | Extra patients, so the waiting room isn't only family |

### 5.3 Opening a place on the map

- **The clinic** appears in the fog during Ch4's intro beat (Nana points down the lane) and opens on first visit. Icon: a door with a stethoscope on its sign.
- Its hub dressing after each visit: stickers on the waiting-room wall, the thank-you shelf fills, décor bought with pocket money.
- **Arc 5:** the village courtyard gains the doctor's table under the neem tree (a dressing layer on the Find it courtyard scene).

### 5.4 Free play

| Route | What |
|---|---|
| **Open clinic** | Patients keep arriving (family, villagers, the cats, Kasuku) with complaints drawn from the player's weakest words; **"Close the clinic"** always in the sidebar, leading to the usual summary and pocket money (Cook's open kitchen pattern) |
| **One patient** | A single visit, 60–90 s (Farah) |
| **You're the patient** | One minute in the chair (M14): a random visible hurt or a cold, the doctor's two-way questions, a plaster in the design you choose |
| **Explore** (no rows) | Tap any part of any patient: they name it and react (giggle, sneeze, wiggle toes). Tapping to hear a word is free here. Layla and a parent point and name together |
| **Doctor Nani** (Grandparent mode) | See M11 |
| **Clinic lab** | Every mechanic, patient and level on its own, with the leak bot (section 8.3) |

---

## 6. Learning design

### 6.1 Words and frames it drives

| Stage | Words | Frames (existing Kutchi or placeholder) |
|---|---|---|
| **S4 body** (big parts first) | head, tummy, arm, leg, hand, foot; face close-up: eye, ear, nose, mouth, tooth, throat; later: neck, shoulder, back, chest, elbow, knee, finger, toe | `[EN: My {part} hurts]` · `[EN: Where does it hurt?]` · `[EN: Does it hurt here?]` · **`[EN: Is it the {X}, or the {Y}?]`** (M13, one frame for parts, feelings and care) · `[EN: The {X}.]` (the short answer) · *yes* / *no* |
| **The doctor's lines** | — | `[EN: You first]` · `[EN: Will you help me?]` · `[EN: Let me see]` · `[EN: Bring me the {care}]` · `[EN: All better!]` · `[EN: Well done, helper]` |
| **S4 feelings and body states** | hot, cold, just right, tired, sneezy (*a cold*), better; happy, sad | `[EN: I'm {feeling}]` · `[EN: How do you feel?]` · `[EN: still {feeling}]` · `[EN: too {feeling}]` · `[EN: I feel better]` |
| **S4 health and care** | plaster, bandage, cool cloth, blanket, hot-water bottle, ice pack, pillow, tissue, warm drink (*dudh*, *hardar*, *aadu*, *chai* exist) | *Muke {care} khape.* · *Ne {care}.* · `[EN: Get well soon]` |
| **S4 examining** (M6) | torch, stethoscope, forehead strip, tweezers; look, listen | `[EN: look in {part}]` · `[EN: listen to {part}]` · `[EN: open your mouth]` · `[EN: say aah]` · `[EN: breathe in]` |
| **S4 animals** (M9) | paw, tail, wing, beak; cat, parrot, hen, goat | `[EN: {owner}'s {part} hurts]` (possessive) |
| **S3 review** | Nana, Ma, Nani, Ali, *[EN: auntie]*, *[EN: uncle]* (Round 1, Q10); left, right | `[EN: {name}, come]` · `[EN: Who's next?]` · `[EN: the left {part}]` |
| **S1 review** | numbers 1–10 (wrap count, hiccup count); greetings | *Salamun alaykum / Wa alaikum salaam* · *Aabhar aanjo* · *Achija* · *Arre re!* · *Ghan* · *Muke hikdo {x} dine* |
| **S5 (Arc 4)** | fell, bumped, (past tense) | `[EN: I fell]` · `[EN: I bumped my {part}]` |

**Syllabus coverage.** S4's domains are body, health, feelings, weather, times of day and animals. The clinic carries **body, health, feelings, hot/cold, and animals (vet)**. **Times of day** belong to Find it (M9 "Nani's day") and Monsoon rush; **"it's raining"** to Dress up and Monsoon rush. S4's "present and habitual" appears as *[EN: it hurts]* (present) and tendencies Nani mentions (*[EN: Nana is always cold]*, habitual) once the family gives the frame.

### 6.2 Word-stage fading (one place only)

| Word stage | Intro card and ladder row | On the patient |
|---|---|---|
| 1 New | Text + speaker; the patient says it and **the part twinkles in time** (pulse sync). Feelings: shiver or fan-face shown. Taught, not tested | Tap names it |
| 2 Learning | Text + speaker | Nothing |
| 3 Nearly known | Speaker only, ••• | Nothing |
| 4 Known | Heard once; a replay costs the tick | Nothing |

- **No labels on the body, ever, during a visit.** A label on a body part is the answer. In Explore, tapping names a part.
- Hidden words next to each other share one ••• (the Wave 4 fix), so a two-word part (*[EN: left knee]*) doesn't look longer.
- Counts: a digit only while the number word is at stage 1–2; silent from stage 3.

### 6.3 Hint ladder and costs

| Rung | What happens | Cost |
|---|---|---|
| 1 Replay | The patient says it again (tap the row speaker, or their face) | Free the first time; after that the tick (Relaxed) or comfort drain (Busy) |
| 2 Slow replay | Half speed, a pause before the key word | Tick / comfort |
| 3 Ask the doctor | *[EN: Is it the {X}, or the {Y}?]* (M13). Automatic at levels 1–2 (the level's scaffold, free); from level 3 it's the **"?" button**. Replaces the old "warmer" gesture | Free at levels 1–2; from level 3: tick (Relaxed) / comfort (Busy) + the combo breaks |
| 4 Reveal | The row's Kutchi text (never English) | That row's ear star, from stage 2 |
| 5 Translate | English gist | That row's ear star |
| 6 Shown | The part twinkles (automatic only at stage 1; otherwise after 2 misses on a row) | That row's ear star; the word doesn't advance |

- **Hesitating never shows the answer.** After about 8 s the patient says it again (rung 1, free the first time). Nothing glows.
- **No upgrade makes a hint cheaper.**

### 6.4 Levels (data; level 1 is gentle for the hands, varied for the ear)

| Knob | Level 1 | Level 2 | Level 3 | Level 4 (Arc 4+) |
|---|---|---|---|---|
| Rows per patient | 1 (part) + care named | 2 (part + feeling) | 2–3, one can be a "not" (*[EN: not that knee, the other one]*) | + a past-tense row |
| **The doctor's question (M13)** | Always; a **far** pair; **the patient answers** | Always; a **look-alike** pair; **nobody answers** | Only on "?", costs the tick | *[EN: Did you fall, or bump it?]* |
| Parts in play | Big parts: head, tummy, arm, leg, hand, foot | + face close-up (6) | + neighbours (elbow/knee, finger/toe, shoulder/neck), **left/right** | all |
| Care | Named by the patient; trolley of 5 | Chosen from the feeling (2 valid); trolley of 7 | Trolley of 9; "pass me" mid-care | — |
| Just right (M4) | — | 1–2 steps | 1–3 steps, two patients at once in Busy | — |
| Waiting room (M7) | One patient at a time, no call | 2–3 waiting, called by name | Busy: 2 benches, comfort rings | — |
| Gentle hands | Tap to place, one drag | + wrap *n* times | Tighter green bands | — |

### 6.5 Mistakes: a recast, then try again

| Mistake | Response | Then |
|---|---|---|
| Wrong part | The patient giggles ("that tickles!"), Kasuku squawks *Arre re!*, then the patient: *[EN: {tapped part}? No, my {target} hurts]* | The player finds it; nothing is shown |
| Wrong care | *[EN: No,]* *Muke {target care} khape* (level 1) or *[EN: I'm {feeling}!]* again (level 2+) | The player picks again |
| Wrong adjustment | *[EN: Too hot now!]* with a fan-face | Take one off |
| Wrong patient | They wave shyly: *[EN: It's not my turn]*; the doctor says the name again | Tap again |

A miss costs that row's ear star and marks the word as a miss (two misses in a row drop it a stage). **Spaced retrieval:** patients' rows are due words plus up to 2 new ones, weakest first; "pass me" asks for a met word not in the current complaint; the end-of-morning word review lists every Kutchi word heard.

### 6.6 Role reversal

- **M11 Tell the doctor** (story and free play): you see the hurt; choose the chunk *[EN: Nani's] + [EN: head] + [EN: hurts]* from audio pills of one look-alike group. Readers see text only at the reads stage.
- **You're the patient (M14, revision R5):** the hurt is shown in first person (the lap view); the doctor asks *[EN: Is it your knee, or your hand?]* and you answer with one of two audio pills, then *yes*/*no* to his probe. The optional "say it" step is shadowing with a parent's ✓ (speaking stage 1); no speech is graded by the app.
- **Doctor Nani** (Grandparent mode): the app shows Nani a part in big Kutchi text; she asks the child *[EN: where's your nose?]*; the child touches their own nose; she taps ✓. This is TPR in the room, and it needs no recording.
- **Instructing the patient** (M6, later): pick *[EN: open your mouth]* or *[EN: say aah]* and the patient does it (or does the wrong funny thing if you picked wrong).
- Relations stored as data (platform item 5): a complaint is `{who, part, side, feeling, care}`, so any visit can be flipped.

### 6.7 Needed from the family (English placeholders until then)

This would be **Round 3 (body and health)**. None of it has been asked yet.

| Need | Priority | Notes |
|---|---|---|
| **"Is it the knee, or the foot?"** and the word **"or"** | **1: blocks M13** (every level-1 and level-2 visit) | One question frame with two slots, used for parts, feelings and care. Also *[EN: Is it your knee, or your hand?]* (to the child) and *[EN: Is it Nani's head, or her tummy?]* (about someone else). Questions for Mum G94–G97; the feeling and care forms (*hot or cold?*, *a blanket or a cool cloth?*, *still cold or just right?*) G105–G107 |
| **Short answers:** *The knee.* · *This one.* · **yes** · **no** | **1: blocks M13 and M14** | The patient's answer at level 1 (G98); yes/no are still Cook's placeholders (A8.1, A4.4) |
| **The doctor's lines:** You first · Will you help me? · Let me see · Bring me the blanket · All better! · Well done, helper | 2 | G99–G104; whose voice records them is decision 2 in the revision |
| **"My ___ hurts"** for head, tummy, arm, leg, hand, foot | **1: blocks M1** | Does the verb or the "my" change with the body part's gender or number? Does it need a word before the part (like Gujarati *maru*)? Record whole phrases if so (G41) |
| Body parts: eye, ear, nose, mouth, tooth, throat, neck, shoulder, back, chest, elbow, knee, finger, toe | 1 | With gender and plural (two eyes, two knees) |
| **hot, cold** (asked: Round 1, Q11) + *just right, still, too* | **1: blocks M4** | "I'm cold" vs "it's cold": which form does a person use? |
| Care words: plaster, bandage, cloth, blanket, pillow, tissue, hot-water bottle, ice | 2 | What the family actually uses at home |
| Feelings: tired, better, happy, sad, (scared: question 6); "I have a cold", sneeze, cough | 2 | |
| Frames: "Where does it hurt?", "How do you feel?", "Does it hurt here?", yes, no, "Who's next?", "___, come", "Get well soon", "It's not my turn", "that tickles!" | 2 | *yes/no* also unblocks Cook |
| left, right | 3 | Level 3 |
| Possessive: "Simba's paw", "Nana's knee" | 3 | Links Round 1, Q1 |
| Animal parts: paw, tail, wing, beak; the words for cat, parrot, hen, goat | 3 | |
| Examining: look, listen, open your mouth, say aah, breathe in; torch, stethoscope, tweezers | 4 | M6 |
| **What the children call the doctor** | 1 | His name or a title (E102; revision decision 1) |
| **Nani's own home remedy** for a cold | 2 | For the Cook hand-off (*hardar dudh*? ginger chai?) |
| Past tense: "I fell", "I bumped my ___" | 5 | Arc 4 |
| Recording estimate | — | About 20 parts × one "hurts" phrase each (one long take), 10 feelings, 10 care nouns, about 25 frames (the *or*-question needs recording per pair, or as two halves the engine joins: test which sounds natural): about 70 items, one evening. The doctor's own lines are a separate short session if he records them |

---

## 7. Stars, rewards and upgrades

### 7.1 The three stars (per patient)

| Star | Icon | Earned when |
|---|---|---|
| **Understood** (ear) | Ear | Right patient, right part (and side), right care, right adjustments, right count, all on the first try. Hints that show the answer cost it (6.3) |
| **Gentle hands** (this mode's craft star) | **A sticking plaster with a small star** | Plaster on the sore spot, bandage wrapped neatly, cloth lifted on the green, blanket tucked, the warm drink handed over while it's warm |
| **No help** / **Quick** | Tick (Relaxed) / lightning (Busy) | No hints or reveals / seen before their comfort ring ran out |

Add `star_sets.clinic` to the shared star data (ear / plaster / tick / bolt), next to Cook's chef's hat and Find it's magnifier.

### 7.2 Pocket money and collections

- The receipt as in Cook: **5** for helping, **+5** ear, **+3** gentle hands, **+3** tick or lightning, a **perfect-patient combo**. Money is never lost.
- **Sticker album:** one sticker per patient the first time you help them, and one per silly case (*Pokémon Snap*'s Photodex, Papa's stickers). The album shows empty outlines of cases not met yet (curiosity).
- **Thank-you shelf** in the clinic: each regular patient's small gift (Nana's old coin, Big Ma's button, Ali's marble, a feather from Kasuku). It fills the place (cosy progression).
- **Plaster designs:** bandhani dots, ajrakh, mirror-work, an Eid moon: unlocked by album pages. Cosmetic only; they never touch the listening (Maryam).
- **Quilt patch:** a stethoscope (Arc 3 Ch4).
- **"Helped the doctor on N days"**: a count that never resets (no breakable streak).

### 7.3 Upgrades (the clinic's own shop; they never listen for you)

| Upgrade | Effect | Trade-off |
|---|---|---|
| Plaster dispenser | Plasters come ready-peeled (one step fewer) | Cheap; everyone wants it |
| Warm flask | Drinks stay warm longer (a wider green band) | Only useful once warm drinks are unlocked |
| Second examination bench | Two patients at once | Expensive; pays off in Busy and the open clinic |
| Toy box on a kigoda stool | Comfort rings drain more slowly in the waiting room | Takes a waiting-room slot (the room has 3 décor slots: toys, plants, Big Ma's chair) |
| Bigger trolley | More care items, so more kinds of complaint, more coins and harder listening | The Find it "bigger bag" pattern |
| Brighter torch | Examining is quicker (M6) | Only after M6 |
| Clinic décor (mirror-work cushions, a plant, a fan) | The room looks yours | Uses the same 3 slots as the toy box |

**No upgrade here** (a card in the shop, like Cook's sugar): *"Where it hurts is your ears' job."* Never: a labelled body chart, a helper who says where it hurts, a thermometer with a readable display, a trolley that sorts itself.

### 7.4 Keeping it gentle (the safety rules, as a checklist)

- [ ] No needles, drips, surgery, blood or bone-setting. A hurt is a small soft pink swirl, drawn in code.
- [ ] The player never gives medicine. The doctor gives medicine, and only to adults; its bottle is closed and never shows a dose.
- [ ] Nobody gets worse while waiting, nobody leaves, nobody cries (sad is a droopy face at most); every visit ends with the patient smiling.
- [ ] Remedies are comfort care that a family does at home anyway: a plaster, a blanket, a cool cloth, a warm drink, rest, a song.
- [ ] Nothing in the game says a care *cures* an illness. The doctor says *[EN: get well soon]*, not "this will fix it".
- [ ] Only the body parts listed in 6.1.
- [ ] No red cross or red crescent anywhere.
- [ ] A short parents' note in settings: "pretend play; for real illness, see a doctor".
- [ ] **The doctor's likeness (revision R8):** always competent, kind and in charge; the comedy is in the patients and the cats, never in him; no gags at his expense and no exaggerated features; his sheet is signed off by Zafar and Hannah and is the only reference after that; his name in the game and his voice are the family's decisions.

---

## 8. Engineering spec for the builder

### 8.1 Data model (`data/clinic.json` plus per-patient hotspot files)

```json
{
  "words": {
    "body-head": {"kutchi": null, "english": "head", "group": "big", "src": "placeholder"},
    "body-knee": {"kutchi": null, "english": "knee", "group": "limb-joint", "sided": true},
    "care-blanket": {"kutchi": null, "english": "blanket", "warmth": 1, "gesture": "tuck", "image": "blanket-f"},
    "feel-cold": {"kutchi": null, "english": "cold", "adjust": "+warmth"}
  },
  "lines": {"hurts": {"e": "My {x} hurts."}, "feel": {"e": "I'm {x}."}, "come": {"e": "{x}, come!"},
            "ask": {"e": "Is it the {x}, or the {y}?"}, "answer": {"e": "The {x}."}, "yourAsk": {"e": "Is it your {x}, or your {y}?"},
            "need": "@cook.need", "give": "@cook.give", "oops": "@cook.oops", "thanks": "@cook.thanks"},
  "grammar": {"hurts": {"frame": "hurts", "agree": null}, "side": "{side} {x}", "owner": "{owner}'s {x}"},
  "lookalike_groups": {"groups": [["body-eye", "body-ear", "body-nose"], ["body-hand", "body-foot"],
                                  ["body-knee", "body-elbow", "body-shoulder"], ["body-finger", "body-toe"],
                                  ["care-cloth", "care-ice", "care-tissue"], ["care-blanket", "care-pillow", "care-bottle"]]},
  "patients": {
    "nana": {"kind": "person", "pose": "patients/nana-seated", "hotspots": "data/patients/nana.json",
             "tendencies": {"feel": {"feel-cold": 0.6}}},
    "simba": {"kind": "cat", "owner": "nani", "pose": "patients/simba-table", "hotspots": "data/patients/simba.json"}
  },
  "visits": {
    "hurt": {
      "slots": {"part": {"from": "$partsForLevel", "prefer": "weak", "maxShare": 0.25},
                "side": {"byLevel": [null, null, {"pick": ["left", "right"]}]},
                "care": {"from": "$caresFor.part", "pick": 1},
                "feeling": {"byLevel": [null, {"pick": ["feel-cold", "feel-hot"], "taste": "feel", "tasteChance": 0.5}]},
                "start": {"byLevel": [null, {"int": [1, 2]}, {"int": [1, 3]}]}},
      "say": [{"frame": "hurts", "x": [{"side": "$side", "of": "$part"}]},
              {"if": "!feeling", "frame": "need", "x": ["$care"]},
              {"if": "feeling", "frame": "feel", "x": ["$feeling"]}],
      "run": [{"do": "where", "part": "$part", "side": "$side"},
              {"do": "care", "want": "$care", "feeling": "$feeling"},
              {"do": "apply", "gesture": "@care.gesture", "at": "@where.spot"},
              {"if": "feeling", "do": "warm", "start": "$start", "direction": "$feeling"}]
    }
  },
  "mechanics": {"ask": {"levels": [{"pair": "far", "answered": true}, {"pair": "lookalike", "answered": false}, {"onRequest": true, "cost": "tick"}],
                        "frame": "ask", "order": "random", "never": ["lastPatientPart", "ruledOut", "lastOption"]},
                "you": {"pov": "lap", "parts": "$visibleParts", "rows": ["ask-pills", "probe", "ask-feel?"], "pills": {"text": "readsStageOnly"}, "sayIt": "stage1-shadow"},
                "where": {"levels": [{"parts": "big", "closeup": false, "minHitPx": 160}, {"closeup": true}, {"sided": true, "neighbours": true}]},
                "care": {"levels": [{"trolley": 5}, {"trolley": 7}, {"trolley": 9, "passMe": 0.4}]},
                "warm": {"levels": [{}, {"steps": [1, 2]}, {"steps": [1, 3]}]},
                "queue": {"levels": [{"waiting": 1}, {"waiting": [2, 3]}, {"waiting": [3, 4], "benches": 2, "comfort": true}]},
                "apply": {"levels": [{"band": [0.55, 0.85]}, {"wrapCount": true}, {"band": [0.62, 0.8]}]}},
  "days": [{"id": "arc3-ch4", "patients": [{"who": "cousin", "visit": "hurt", "fix": {"part": "body-knee"}},
                                           {"who": "hen", "visit": "vet"}, {"who": "villager-1", "visit": "hurt", "fix": {"feeling": "feel-cold"}}]}],
  "upgrades": [], "star_sets": {}, "tips": {}
}
```

**Hotspot file** (`data/patients/<id>.json`), authored in the lab's hotspot editor, checked by `build/check_hotspots.py`:

```json
{"pose": "patients/nana-seated.webp", "mirror": true,
 "parts": {"body-head": [[x, y], ...], "body-knee.left": [[...]], "body-tummy": [[...]]},
 "closeup": {"rect": [700, 90, 260, 260], "scale": 2.6, "parts": ["body-eye", "body-ear", "body-nose", "body-mouth", "body-tooth", "body-throat"]},
 "spots": {"body-knee.left": [812, 690]}, "neutral": "idle", "expressions": ["ouch", "giggle", "sneeze", "ahh", "cold", "hot", "happy"]}
```

- `mirror: true` builds right-side polygons from left-side ones (front-facing, symmetric poses).
- **Sides are the patient's own left and right** (they face you): the family decides whether the game uses the patient's or the viewer's side (a playtest item).
- `closeup` reuses the same pose image, stored at 3× so the zoom stays sharp: no new art.

### 8.2 What's reused, and what's new

| Reused (from Cook) | Used for |
|---|---|
| The recipe engine: slots, `say`, `run`, `byLevel`, `taste`/`tasteChance`, `prefer: weak`, the ladder rows (`R.ladder`) | A visit is a recipe; a patient is a customer; tendencies are tastes |
| `Cook.Mech.define`, zones, `z.listen`, `z.skill`, `z.expect`, levels as data | Every clinic mechanic |
| Word pills, the intro card and sidebar (Wave 5), stars shown as they happen, the receipt, the word review, completion cards | As they are |
| Pass me with look-alike groups; help costs; recasts; greetings; Relaxed/Busy; the open kitchen's "close" flow | As they are |
| `S.ring` (lift on green), Stir's circular track (wrap), the pour drag (peel and stick), knead press (dab cream) | M3 gestures |
| `js/progress.js` understand/produce stages | Fading and M11 |
| `build/test_cook.py` harness (real pointer events, tap-cover check, six sizes) | `test_clinic.py` |

| Reused (from Find it, once built) | Used for |
|---|---|
| Hotspot hit-testing with padding and snap-to-nearest | Body parts |
| The non-speaker bot framework (Search lab) | The clinic leak bot |
| Scene JSON with relations; the courtyard and bedroom scenes | The Arc 5 village clinic; Nani's bed at home |

| New building block | What it is | Size |
|---|---|---|
| **Body map** (`body.js`) | Loads a patient's hotspots, mirrors sides, pads hit areas to one size, the face close-up with a player-opened magnifier, the sore swirl | Medium |
| **Patient** (`patient.js`) | Seated pose, head-layer expressions, reactions (giggle, ahh, sneeze, shiver at stage 1 only), a blanket stack drawn in code | Medium |
| **Warmth loop** (`mechanics/warm.js`) | State = steps from "just right"; each action changes it; the patient speaks the new state; Done | Small |
| **Queue** (`queue.js`) | Bench seats shuffled, calls, one or two benches, comfort rings (Busy), no one ever leaves | Medium |
| **Chunk picker** (`mechanics/tell.js`) | M11: audio pills from one look-alike group, text only at the reads stage; at level 1 it's M13's two-way question with two pills | Small (reuses the choice pill) |
| **The doctor's question** (`mechanics/ask.js`) | M13: one line frame with two slots filled from any word list; random order; the pool rules from R4 (far, then look-alike; never the last patient's part, a ruled-out option or the last option left); plays the patient's answer at level 1; bound to the "?" button with a cost at level 3; a `lastAsked` record for the leak bot | Small |
| **You're the patient** (`mechanics/you.js`) | M14: the lap view scene, the doctor leaning into frame, the two-way audio pills, the probe hand and yes/no pills, the plaster-design picker, the optional say-it recorder (Game Design speaking stage 1: record, play back beside the family's file, a parent taps ✓; nothing leaves the device) | Small–medium |
| Hotspot editor (lab only) and `build/check_hotspots.py` | Draw polygons on a pose; check minimum size per screen size, overlap, mirroring | Small |

**Code location.** Cook's engine lives in `js/cook/` under the `Cook.*` namespace. The cheapest honest route is to build the clinic's mechanics on that engine, and move the shared parts into a common folder as part of platform item 1 ("one app, one save"), in step with whatever Find it extracts. Don't copy-paste the engine.

### 8.3 The lab and the tests

**Clinic lab** (title screen, like the Station lab): any mechanic × any patient × level 1–3, a random visit each time; "Nani helps" tick; **hotspot overlay** toggle (dev); **bot** dropdown (below); a "safety view" that lists the patient's current expression and the visible cues, for the Sceptic check.

**The leak bot** (the wife's test as code): a player that sees only the screen and the audio file names' *durations*, never the words. Strategies:

| Strategy | What it tries |
|---|---|
| Random | Any part, any care |
| Salience | The biggest or most central part (tummy, head) |
| Frequency | Remembers which parts and cares were right in earlier rounds and picks the most common |
| Slot memory | The trolley slot that was right most often |
| Repeat | Whatever was right last visit |
| Duration | Maps the row's audio length to parts it has seen before |
| Wait | Taps nothing until something glows (must end with the ear star lost) |
| Visual cue | Reads the patient's pose and expression, the worn blankets, the thermometer |
| Probe | In M5, presses everything |
| Kinship | In M7, taps whoever moved or was last to speak |
| Second option | In M13, always the first (or always the second) option the doctor names |
| Echo | In M13, picks the option whose audio duration matches the complaint's key word (sound matching without meaning) |

**Pass:** every strategy earns the ear star in **fewer than 10%** of visits, over 500 visits per mechanic per level, per strategy. A **fair bot** that knows the answers must earn it in 100%. Placeholder English rows are flagged "not yet a Kutchi test" in the report (they can't fail for the right reason).

**The harness** `build/test_clinic.py` (from `test_cook.py`): plays every mechanic at levels 1–3, a full clinic morning, Arc 3 Ch4, and the open clinic; deliberately makes mistakes (wrong part, wrong care, wrong patient) so every recast runs; six sizes (phone 915×375, 1366×768, 1440×900, 1280×800, iPad landscape and portrait); the tap-cover check before every tap; **a hotspot-size check**: at level 1 every part's hit area is at least about 2 cm on the iPad and opens zoomed on the phone. Claude reviews the screenshots.

### 8.4 File layout (until the one-app shell exists)

```
clinic.html
js/clinic/flow.js          the clinic morning, open clinic, one patient
js/clinic/body.js          hotspots, sides, close-up, sore swirl
js/clinic/patient.js       pose, expressions, reactions, blanket stack
js/clinic/queue.js         bench, calls, benches, comfort
js/clinic/mechanics/       ask.js, where.js, care.js, apply.js, warm.js, call.js, you.js, tell.js (later: look.js, echo.js)
data/clinic.json           words, lines, grammar, patients, visits, levels, upgrades, stars, tips
data/patients/<id>.json    one hotspot file per patient pose
data/scenes/clinic.json    bench, examination bench(es), trolley, door, perch, décor slots
build/test_clinic.py       harness (+ --bot <strategy>, --rounds 500)
build/check_hotspots.py
assets/clinic/             backgrounds, poses, items (WebP)
```

---

## 9. Scene, art and assets

### 9.1 Cameras

| Scene | Camera | Notes | Used in |
|---|---|---|---|
| **Clinic room** | **E**, horizon about 55% | Waiting bench on the left, the examination bench centre-right with the patient **seated, full body, facing you** (feet visible for knee and foot), a window with rain, a shelf, the door. One screen wide | Every clinic round |
| Face close-up | **E**, the same pose at 2.6× | Opened by the magnifier; no new art | Level 2+ |
| Care trolley | **F** items in a row along the bottom edge (the carried-container rule: under 22% of screen height) | Items in front view, like the bazaar and pantry; shared view | Every visit |
| Nani's bedroom (home) | **E** | Nani in bed, upper body above the blanket; reuse Find it's Arc 4 bedroom with a bed variant | Arc 3 Ch4 beats |
| Village clinic | **E** | Find it's courtyard + a table and charpai layer under the neem tree | Arc 5 |
| Vet | **E**, the animal sitting on the examination table | Cats drawn large on the table (tap targets) | M9 |
| **You're the patient (the lap view)** | **First person, looking down** | Your own knees, feet and resting hands (the existing hand set, skinned per character), the bench edge; the doctor leans into the top of the frame. The scuff and the plaster are drawn in code | M14 |

The art bible's line for the clinic ("T for the table; E for the patient") changes to **E for the patient, F for the trolley**. A T table isn't needed, because care is applied on the patient. Please update the art bible (question for the orchestrator, not a file this doc edits).

**Breaking the layout contract on purpose:** characters usually stand behind a counter, upper body only. Clinic patients sit **full body** on the examination bench, so knees and feet can be treated. The bench is the "counter" for the waiting room, whose people are seen from the waist up behind the bench's back rail.

### 9.2 Layers and ambient motion

| Layer | Why |
|---|---|
| Background with **no painted patient, blanket or care item** | Everything changes per visit |
| Patient pose (full body), **head as a separate layer** with expression frames | Reactions without redrawing the body |
| Blanket (one draped sprite), stacked in code with small offsets and tints | The four-blanket joke, with no art per patient |
| Care items on the patient: plaster, bandage (code-drawn stripes along the limb's axis in the hotspot data), cool cloth, ice pack, hot-water bottle | Placed on the `spots` |
| Sore swirl (code) | No blood, no drawn injuries |
| Waiting-room people (upper body behind the bench rail), comfort ring (code) | Queue |
| Trolley: back, items, front rim | Carried-container contract |
| Kasuku on his perch, head layer | Existing pose set |
| Ambient: rain on the window (particles, the asset plan's monsoon drip sprites), a ceiling fan, steam from the warm drink, Simba asleep on a mat, the doctor's desk clock | 2–4 moving things, off with "reduce motion" |
| Arc dressing: monsoon umbrellas by the door, Eid bunting in a later visit, the village courtyard | Reuse across arcs |

### 9.3 Hand poses

| Pose (asset plan) | Camera | Used for | Status |
|---|---|---|---|
| C4 pointing | E | Tap the part (the default) | Exists (T, E) |
| C1 pinch | E | Peel and stick a plaster; tweezers (M6); the stethoscope's chest piece | Exists |
| B2 vertical grip | E | Torch (M6) | Exists |
| D2 C-shape hold | E | Hand over the warm drink | Exists |
| B5 hook grip | E | Hot-water bottle by its loop | Exists |
| A3 palm up | E | Receive the thank-you gift; hand over the medicine bottle | Exists |
| E1 thumbs up, A5 wave | E | End of visit, goodbye | Exist |
| **A1-E flat palm, forward** | E | **New:** press a cool cloth on a forehead; tuck a blanket | New pose (A1 exists in T only) |
| **C2-E tripod** | E | **New:** the forehead strip; dabbing cream | New pose (C2 exists in T only) |
| Bandage roll | — | Drawn without a hand: the roll sprite follows the finger round the limb | No pose |

**Nani's set (N):** A1 (on Nani's own forehead in the intro beat, from her set).

### 9.4 New art, with reuse flagged

| Asset | Count | Reuse | Made with |
|---|---|---|---|
| Clinic room background (E, empty bench, rain window) | 1 | Arc dressings as layers | ChatGPT (free) |
| Nani's bed variant of the Arc 4 bedroom | 1 layer | **Reuses** Find it's bedroom | ChatGPT (free) |
| Village clinic table + charpai layer | 1 layer | **Reuses** Find it's courtyard | ChatGPT (free) |
| **The doctor**: character sheet from photos | 1 | Sheet-first rule | ChatGPT (free), Zafar signs off |
| Doctor poses: neutral, talking (the *or*-question, gaze on the patient, hands folded), big laugh, **leaning in** (M14, from below), a hand reaching to press (the probe), listening with a stethoscope, holding the bottle, waving, thinking | about 9 | From the sheet; the old "pointing up/down" pose is dropped with the warmer hint | **API edit** |
| **The lap view** (first person, seated: knees, feet, the bench edge; boy and girl variants in the game's skin tone; hands composited from the hand set) | 2 | New | ChatGPT (free) |
| Seated full-body patient poses: Nani (in bed), Nana, Ma, Ali, the older cousin, 2 villagers, a village child | 8 | From each sheet; Nana, Ma and Ali are waiting for their sheets anyway | API edit |
| Patient head expressions: ouch (mild), giggle, sneeze (2 frames), ahh, cold (stage 1), hot (stage 1), happy | about 8 per patient, 64 in all | `build/expressions.py` in-place edits | API edit |
| Animals on the table: Simba, Zazu (sitting, from the cat sheets), Kasuku (existing perched pose), the hen (Arc 3 animals sheet) | 3 new poses | **Reuses** the cat, parrot and hen sheets | API edit |
| Items, F view: plaster tin, plasters (4 designs), bandage roll, cool cloth in a bowl, ice pack, blanket, pillow, hot-water bottle (knitted cover), tissue box, warm drink glass (reuse Cook's chai glass), torch, stethoscope, forehead strip, tweezers, the doctor's bag, a medicine bottle, honey jar, pickle jar, sticker sheet, thank-you gifts (4) | about 26 | Chai glass and jars shared with Cook | Two 4×4 grids in ChatGPT (free); glass and steel via the API's native transparency (art bible magenta rule) |
| Hands | 2 poses × 3 reskins = 6 | Asset plan pipeline | API (in the planned hand run) |
| Map icon (the clinic door with a stethoscope sign) | 1 | — | ChatGPT (free) |
| UI icon: the plaster star | 1 | — | CSS or SVG |

**Rough cost:** about 90 images: 30 from free ChatGPT, 60 by API edits (poses, expressions, hands): about **$5–15** at the pipeline's rates. The expensive part is time on the doctor's likeness and on consistent seated poses, not money.

---

## 10. Persona loops

### Loop 0: the draft

The first draft had: patients **holding their sore part** (for charm); care **fixed by body part** (knee = plaster, head = cool cloth); the face close-up **opening by itself** when a face part was asked; **shivering and sweating always visible**; a **colour thermometer**; left/right from level 1; a clinic morning of 5 patients (about 6 minutes); **injections** as an examine mini-game (as in *Toca Doctor*); "who's next" by **choosing whoever looks most unwell**; waiting patients who **got worse**; Kasuku's echo in the first set; and "where does it hurt" at home as a **full errand** before the clinic errand.

### Loop 1

| Persona | Plays, says, struggles |
|---|---|
| **Layla, 5** | Loves the giggle when she taps the wrong place and taps the tummy again on purpose. Can't hit the ear on the phone ("I pressed it!"). The injection makes her pull the tablet away. The sweaty, shivering Nana worries her: "is he poorly?" Can't do left/right |
| **Zayn, 8** | One patient at a time is slow; he wants two at once and a record. Spots that knee means plaster every time: "easy" |
| **Maryam, 11** | Likes the doctor looking like a real grandad. Wants the clinic to be hers: "can I choose the plasters?" |
| **Zafar, 38** | One line per patient is little Kutchi per minute. The care step teaches nothing once he knows part → care |
| **Farah, 34** | Six minutes is too long for a bus stop |
| **Nani, 68** | "That's not how you say *my head hurts*": the frame will change with the part. Wants her own remedy in it |
| **The Sceptic** | Wins the ear star by: (1) tapping where the patient's hand is; (2) the auto-zoom telling her it's a face part, then guessing among 6; (3) knee → plaster; (4) shivering → blanket; (5) the thermometer colour; (6) tapping the tummy (asked most) |
| **The Builder** | Full-body seated poses per patient are the cost. Hotspot polygons by hand in JSON will be wrong. Left and right need drawing twice |

| Finding | Change |
|---|---|
| Hand on the sore part gives it away | Neutral, symmetric idle pose; the sore swirl appears only after the right tap |
| Auto-zoom narrows the answer to the face | The magnifier is always there and only the player opens it; tapping it isn't a wrong answer |
| Care fixed by part | Every part accepts at least two cares; the patient names the care (level 1) or says a feeling (level 2+) |
| Shivering and sweating always visible; colour thermometer | Body-state visuals only while the feeling word is at stage 1; no readable thermometer (the doctor says the reading) |
| Tummy wins by salience and frequency | Hit areas padded to one size; parts drawn evenly (`maxShare` 0.25), weakest words first |
| The injection frightens Layla (and the Teddy Bear Hospital evidence) | No needles or procedures at all; care is comfort care; safety checklist 7.4 |
| "Poorly Nana" worries Layla | Unwell faces are mild; nobody gets worse; every visit ends happy |
| Ears too small on phones | Level 1 = six big parts; small parts only in the close-up; phone opens zoomed |
| Left/right too early | Left/right from level 3 only (children are reliable at about 6–7) |
| Low Kutchi per minute | Level 2 has two rows (part + feeling) and the **just right** loop (M4): three to four more spoken lines per patient |
| Six-minute morning | 3–4 patients (about 4 minutes); **one patient** free play (60–90 s) |
| Zayn: slow, no record | Busy mode with two benches (M7) and a perfect-patient combo; best open-clinic record |
| Maryam: make it hers | Plaster designs, clinic décor slots, the thank-you shelf |
| Nani: the frame may change | Record whole "my ___ hurts" phrases per part until the grammar is known (6.7, priority 1) |
| Builder: hand-typed polygons | A hotspot editor in the lab and `check_hotspots.py`; `mirror: true` for symmetric poses; the close-up reuses the pose at 3× |
| Triage by "who looks most ill" | Replaced by the doctor calling a name (kinship review) |

### Loop 2

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Explore mode with her dad: "where's Nana's nose?" She taps, Nana sneezes, she shrieks with laughter. Loves Simba on the table. The blanket pile is her favourite joke |
| **Zayn** | Busy two-bench play is fun, but he learns that the comfort ring doesn't really matter: "nothing happens" |
| **Maryam** | The album's empty outlines pull her to find every silly case |
| **Zafar** | Enjoys the just-right loop; wants the doctor to speak more formally to Nana (respect language) |
| **Farah** | One patient is right. Wants to stop mid-morning without losing coins |
| **Nani** | Proud of "Doctor Nani" in Grandparent mode: "I can play the doctor with Layla" |
| **The Sceptic** | (1) In M7 the called patient's face bobs as the doctor speaks, and when only one person waits there's no choice. (2) In M4 she just adds one blanket and presses Done: it's always one step. (3) She notices Nana arrives in two shawls when he'll say "hot". (4) The trolley's warm things sit together on the left. (5) In the story's "tell the doctor", she matches Nani's words from home to the pills |
| **The Builder** | M3's four gestures look like four new mechanics |

| Finding | Change |
|---|---|
| Called patient bobs; one-person queues | The doctor says the call and nobody reacts until tapped; a call only happens with 2+ waiting (otherwise no ear credit) |
| Just right is always one step | Start 1–2 steps away (1–3 at level 3), in either direction, at random |
| Worn shawls predict the feeling | What a patient arrives wearing is random and independent of the feeling |
| Warm items grouped on the trolley | Every slot shuffled per visit; items never grouped by kind |
| "Tell the doctor" is sound matching | **Nani says nothing at home**: you *see* where it hurts (she holds her head, points to her throat); at the clinic you choose the word. Picture → word is real production |
| Comfort ring feels meaningless | In Busy the lightning star for that patient depends on it, and patients left long enough say *[EN: I'm bored]* and fidget (funny, not sad) |
| Respect language | The doctor and the player greet elders with the formal choice (the v2 greeting rule; words from Round 1, Q10–11) |
| Farah stops mid-morning | "Close the clinic" pays for the patients already finished |
| M3 looks like four new mechanics | Each gesture maps onto existing Cook code: lift on green = `S.ring`, wrap = Stir's track, stick = the pour drag, dab = knead press. New art, little new code |
| Doctor Nani is a hit | Promote it to a named Grandparent-mode entry (M11), with no recording needed |

### Loop 3

| Persona | Plays, says, struggles |
|---|---|
| **Layla** | Plays a full level-1 morning with a parent; needs the parent for the trolley at first ("which is the blanket?"), then does it herself by the third patient. No tears, lots of giggles |
| **Zayn** | Level 3: two benches, left/right, the "not that knee" row. "OK, that's hard." Comes back for the combo record and the album |
| **Maryam** | Has a bandhani plaster set and mirror-work cushions in the waiting room; collects Kasuku's feather |
| **Zafar** | Counts about 8–10 Kutchi lines per patient at level 2 (complaint, feeling, recasts, just-right exchanges, thanks, pass me). Asks when the body words will be recorded |
| **Farah** | One patient before work, a clinic morning at the weekend |
| **Nani** | Recognises her remedy in the Cook hand-off; "that's our doctor" |
| **The Sceptic** | Tries: (1) the warmer hint to halve the body, then guesses (still 1 in 3 or worse, and the hint costs her the tick); (2) audio durations: *[EN: left knee]* is longer than *[EN: nose]*; (3) vet animals have fewer parts; (4) the last row of a patient by elimination ("not asked yet"); (5) waiting for help (only a replay comes). **She can't reliably win the ear star** |
| **The Builder** | The seated full-body poses are the long pole; animals reuse sheets; the close-up is free. Asks what to build if the family's words are late |

| Finding | Change |
|---|---|
| Durations separate one-word and two-word rows | Sides only at level 3, where every row can have a side, so durations don't cluster; the bot's "duration" strategy checks it |
| Vet guess rate | At least 6 parts per animal (front paws count as two; ear, nose, tail, tummy) |
| Elimination across rows | Rows within a patient can repeat a part (both knees) and never come from a fixed set |
| Words may be late | Build and tune with placeholders, but the leak report marks those rows "not yet a Kutchi test"; the first family round is **six "my ___ hurts" phrases + hot and cold**, enough to make level 1 real |
| Parents need to know it's gentle | The parents' note (7.4) and no medical claims anywhere |

**Stop check (after loop 3).**

| Question | Answer |
|---|---|
| Can the Sceptic win the ear star? | **No.** Rough bot rates per patient: level 1, one part from 6 (17%) × a care from 5 (20%) = **3%**; level 2, two rows plus just right (a direction guess, 50%, × a step count, about 50%) = **under 1%**; M7 calls with 2–4 waiting multiply further; vet with 6 parts × care = **3%**. Every hint that shows the answer costs the star. Remaining weak spot: at level 1, a patient who names a care with the stage-1 word can be read by a reader (intended: stage 1 is teaching and doesn't count) |
| Does every persona have a reason to come back? | Layla: the patients' reactions, the cats, Explore with a parent. Zayn: Busy, level 3, the combo record, the album. Maryam: plaster designs, décor, the shelf, the album. Zafar: 8–10 lines per patient, the just-right loop, weakest-word patients. Farah: one patient, 60–90 s. Nani: Doctor Nani, her remedy, "our doctor". **Yes** |

---

## 11. Scorecard and verdict

| Criterion | Score | Why |
|---|---|---|
| **Fun** | **4** | Live reactions (giggle, ahh, sneeze), the just-right comedy, the family's cats as patients, a juggling morning in Busy. Weakest: the trolley pick by itself |
| **Forces Kutchi** | **4** (5 once words exist) | Part, feeling, care, adjustment and who's next all come only from what's said; the bot plan targets under 10%. **Today every decision word is an English placeholder**, so nothing is a real Kutchi test until Round 3 |
| **Distinct** | **4** | The body as the target and a person who answers back are new. Busy juggling and the trolley echo Cook; the borders with Who did it?, Find it, Dress up and Monsoon rush are drawn in section 1 |
| **Plot** | **4** | Carries Arc 3 Ch4 (M11 turns "say what hurts" into a real task) and returns in Arcs 4 and 5; Arc 2 only as a side errand |
| **Replay** | **4** | Generated patients from weakest words, tendencies, levels, silly cases, the album, the open clinic, one patient |

**Is it good?** Yes: the verb is proven (*Toca Doctor*, *Dr. Panda*, *Heart's Medicine*) and the language is the input, not decoration.
**Is it complete?** For its share of S4, yes: body, health, feelings, hot/cold and animals. Times of day and "it's raining" belong to Find it, Monsoon rush and Dress up. Its story uses (Nani has a cold, the clinic, fetching the medicine, a village clinic) are all placed.

### Verdict: **Go with changes**

The changes are prerequisites, not redesigns:
1. **Family words first:** send a Round 3 (body and health) list; the six "my ___ hurts" phrases and hot/cold unblock level 1.
2. **The doctor's photos → character sheet** before any clinic art.
3. **Build after platform item 1** (one app, one save), on Cook's engine moved to a shared folder, not in a copy.
4. Decide question 8 (Ch4 as one errand) before the story build.

### Top risks

| Risk | Mitigation |
|---|---|
| **No Kutchi for any decision word yet** (and "my ___ hurts" may change with the part) | Whole phrases recorded per part; placeholders flagged in the leak report; ask early |
| **Art:** seated full-body poses and a real-likeness doctor, kept consistent | Sheet-first; the close-up reuses the pose; animals reuse sheets; greybox silhouettes until then |
| **Tone:** a "doctor" game could frighten or look like medical advice | Comfort care only; the safety checklist (7.4); the doctor handles medicine; the parents' note |
| **Small parts on phones** for 5-year-olds | Big parts only at level 1; the close-up; tablet as the target device |
| **Feels like "Cook with bodies"** because it shares the engine | The patient's reactions, the body target and the just-right loop carry the feel; playtest Explore and level 1 before building more |

### Open questions for Zafar

1. ~~Keep the name "Nani's clinic", or call it the doctor's clinic?~~ **Answered by the revision (R1): the doctor's clinic; "The clinic" until the family names him.**
2. What do the children call the doctor: his name, or a title? (E102; and does he record his own lines: revision decision 2)
3. ~~Is the player the doctor's helper right?~~ **Answered (R1, R5): the helper, after one minute as his patient.**
4. The vet corner: cats, Kasuku and the hen **at the clinic**, or a separate corner at home?
5. Allow **Kasuku's echo** later (a decoy voice during a task, as an exception to the cast rule)?
6. Feelings: include **sad** and **scared**, or keep to hot, cold, tired and sneezy?
7. Ear star: lost at the first miss, or a half star after one (the same answer as Find it's question 3)?
8. Arc 3 Ch4: the home part as a **beat**, and the clinic as its **one errand**?
9. Nani's remedy for the Cook hand-off: *hardar* in *dudh*, *aadu* chai, or something else?

---

## 12. Build brief for a future agent

### 12.1 Phases

| Phase | What's playable | Acceptance |
|---|---|---|
| **0 Prerequisites** (not code) | — | The Questions for Mum Section G (body, health, the *or*-question, yes/no) answered; doctor photos in `sources/private/`; platform item 1 (one app, one save) done or scheduled; question 8 and the revision's decisions 1, 4 and 6 answered |
| **1 Greybox visit** | Clinic lab: **M13 The doctor's question**, M1 Where, M2 Care, M3 Gentle hands on a **grey silhouette patient** (one hotspot file) at levels 1–3 (level 1: the question answered; level 2: unanswered; level 3: "?" at a cost); the hotspot editor | Fair bot 100% ear stars; leak bot under 10% for every strategy over 500 visits per level **from level 2** (level 1 reported separately, with the two-way rate, for decision 6; placeholder rows flagged); the new "second option" and "echo" strategies included; `check_hotspots.py` passes (level-1 parts ≥ 2 cm on iPad; phone opens zoomed); tap-cover check at all six sizes; no console errors; screenshots reviewed |
| **2 Clinic morning and the chair** | **M14 You're the patient** (greybox lap view, two-way pills, yes/no, the plaster picker), M4 Just right (*[EN: Still cold, or just right?]*), M7 Who's next, the intro card, 3 s quiet start, sidebar with "?" = ask the doctor, pass me, stars as they happen, the receipt, the word review, Relaxed/Busy with comfort rings, **one patient**, **You're the patient** and **open clinic** with "Close the clinic" | `test_clinic.py` plays a full morning, a patient visit and the open clinic at six sizes; every recast path exercised; leak bot under 10% on M4 and M7; a level-1 morning under 5 minutes; a single patient under 90 s; the patient visit under 60 s |
| **3 Story and vet** | Arc 3 Ch4 (the home beat, the puddle on the lane, **you're the patient first**, M11 Tell the doctor in its two-way form, the clinic errand with Ali, the hen and a neighbour, the medicine "pass me" at home, the blanket, the hand-off to Cook's Ch5), M9 vet patients (Simba, Zazu, Kasuku, hen), the map place, the quilt patch, the album, the thank-you shelf, the shop and upgrades | Ch4 runs end to end in the harness; the vet passes the leak bot with 6+ parts per animal; the shop has no item that touches the listening (a test lists upgrade knobs and fails on any hint or labelling knob); **Zafar plays it with a child** |
| **4 Art and more** | The doctor's sheet and poses, seated patient poses, expressions, items, the two new hand poses; then M6 Have a look, M10 Silly cases, M5 (when yes/no exist), Doctor Nani entry | Visual QA checklist on every screenshot; family recordings replace placeholders file for file; the leak report shows real Kutchi rows passing |

### 12.2 The first three tasks

**Task 1: `data/clinic.json`, one patient's hotspots, and the hotspot tooling.**
- Create `data/clinic.json` following section 8.1: `words` for the 6 level-1 parts, the 6 face parts and 8 care items (all `"kutchi": null`, `"src": "placeholder"`); `lines` (`hurts`, `feel`, `come`, and references to Cook's `need`, `give`, `oops`, `thanks`, `bye`); `grammar`; `lookalike_groups`; `mechanics.where/care/apply.levels`; `star_sets.clinic` (ear, plaster, tick, bolt).
- Draw a grey silhouette patient (1600×900 placement, seated, front-facing) in code or as a flat PNG, and write `data/patients/grey-adult.json` with `mirror: true`, a `closeup` rectangle and `spots`.
- Build a lab-only hotspot editor: click to add polygon points per part id, show mirrored sides, save JSON to the console.
- Write `build/check_hotspots.py`: at each of the six screen sizes, report each part's hit area in px and approximate cm (use 132 px/inch for iPad and 160 for a phone as defaults, configurable), overlaps between parts, and any part below the level's `minHitPx`.
- **Done when:** the editor round-trips the file, and the checker passes at level-1 settings on iPad and flags the face parts as "close-up only" on the phone.

**Task 2: the `ask` block (M13) and the `where` mechanic (M1) with their leak bot.**
- Implement `js/clinic/mechanics/ask.js`: given a target word and a pool, pick the wrong option by the level's rule (far group at level 1, the target's look-alike group at level 2; never the last patient's part, an option already ruled out this visit, or the only option left), shuffle the order, play the `ask` line with the two slots (two recorded halves joined, or one file per pair: try both and keep what sounds natural), then at level 1 play the `answer` line; at level 3 expose it as the "?" button, charging the tick / comfort. Record `lastAsked` so the harness and the bot can see it.
- Implement `js/clinic/mechanics/where.js` on Cook's mechanic framework (`Cook.Mech.define("where", …)`, read every number from `k`), using `body.js` for hit-testing (padded, snap to the nearest part within the level's radius) and the close-up magnifier (player-opened only). The doctor's pose during the question: gaze on the patient's face, hands folded; the patient's answer is a head-shot line with no pointing.
- Behaviour: the patient's line plays; 3 s quiet; the doctor's question by level; right tap → the sore swirl at the part's `spot`, `z.listen(true)`; wrong tap → the giggle reaction, the recast line, `z.listen(false, "part")`, retry; the stage-1 twinkle in time with the word; hesitation → replay only; the hint ladder as in 6.3 with its costs.
- Add a clinic lab entry, and the bot modes random, salience, frequency, repeat, duration, wait, **second option** (always the first, or always the second, option) and **echo** (picks the option whose audio duration matches the complaint's key word) to `build/test_clinic.py --lab where --bot <s> --rounds 500`.
- **Done when:** the fair bot gets 100%; every leak strategy is under 10% at levels 2–3, and level 1 reports its rate (expected about 50% on the part alone and about 10% with the care) for decision 6; the tap-cover check passes at six sizes.

**Task 3: `care` and `apply` (M2 + M3).**
- `care.js`: a trolley from `scenes/clinic.json` slots, filled with **every** unlocked care item, shuffled per visit; the first pick is graded against the named care (level 1) or the feeling's valid set (level 2+); recast and retry; "pass me" at level 3.
- `apply.js`: four gestures, each wrapping existing Cook code: **stick** (the pour drag to the spot; score = distance from the spot), **wrap** (Stir's track around the limb axis from the hotspot data; the count graded at level 2; never ends by itself; Done), **lift on green** (`S.ring` on the cloth; score by band), **tuck** (a vertical drag). The plaster star (gentle hands) comes from `z.skill`.
- The care choice goes through `ask.js` too: level 1 *[EN: A plaster, or a bandage?]* answered by the patient; level 2 the feeling word instead.
- Chain `ask → where → ask → care → apply` as the `hurt` visit through the recipe engine (a visit is a recipe), so one lab button runs a whole level-1 visit.
- **Done when:** a level-1 visit plays end to end in the lab at six sizes; the slot-memory and visual-cue bots stay under 10%; the harness runs the wrong-care recast path; screenshots reviewed.

**Task 4 (first of phase 2): `you.js` (M14).** A greybox lap view (a flat image with hotspot `spots` for hand, finger, arm, elbow, knee, foot, toe), the doctor leaning in, the `yourAsk` line with two audio pills (text only at the reads stage), the probe (his hand at a random part, wrong first half the time) with yes/no pills, the plaster picker, `[EN: All better!]`; then the say-it recorder (record, play back beside the family's file, a parent's ✓; on-device only). **Done when** the visit runs under 60 s at six sizes and the two-way bot rate is reported for decision 6.

---

## Sources

- Toca Doctor: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/toca-doctor) (no text, no timers, splinters, bugs, shots); [LearningWorks for Kids](https://learningworksforkids.com/apps/toca-doctor/) (puzzles per ailment); [148Apps review](https://www.148apps.com/toca-doctor/toca-doctor/) (blocked here; search summary: ear puzzle, tummy bubbles with a burp)
- Toca Pet Doctor: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/toca-pet-doctor); [Good Play Guide](https://www.goodplayguide.com/reviews/toca-pet-doctor/) (gentle, imaginative animal problems, ages 2–6)
- Dr. Panda's Hospital: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/dr-pandas-hospital) (the visit sequence, empathy); [148Apps](https://www.148apps.com/dr-panda-hospital/dr-pandas-hospital-doctor-game-for-kids-review/) (blocked; summary: fun for a while, then repetitive)
- Operate Now: Hospital: [Common Sense Media](https://www.commonsensemedia.org/app-reviews/operate-now-hospital); [SCMP review](https://www.scmp.com/culture/arts-entertainment/article/2099132/game-review-operate-now-hospital-hardly-cutting-edge-fare) (surgery with guide lines, about 60% base building)
- My Hospital (Cherrypick): [Google Play](https://play.google.com/store/apps/details?id=com.cherrypickgames.myhospital&hl=en_US) (80+ funny diseases, crafted cures, decorating)
- My Hospital (Bubadu): [Google Play](https://play.google.com/store/apps/details?id=com.bubadu.myhospital&hl=en_US) (bandage, burn and syringe mini-games in a time-management loop)
- Heart's Medicine: [Indie Game Reviewer](https://indiegamereviewer.com/hearts-medicine-time-to-heal-review/) (Diner Dash in a hospital; hearts drain while waiting)
- Two Point Hospital: [Fandom, Illnesses](https://two-point-hospital.fandom.com/wiki/Illnesses) (visual and non-visual illnesses); [Fanatical blog](https://www.fanatical.com/en/blog/two-point-hospitals-bizarre-yet-hilarious-illnesses) (comedy illnesses)
- TPR and body parts: [BYU Methods of Language Teaching](https://methodsoflanguageteaching.byu.edu/total-physical-response); [Astutik, IJLTER](https://www.ijlter.org/index.php/ijlter/article/view/1335) (TPR with young EFL learners)
- Body-part vocabulary: [Waugh and Brownell 2015, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4505369/) (blocked; search summary: face, tummy, hands and feet first)
- Left and right: [Rigal 1994, PubMed](https://pubmed.ncbi.nlm.nih.gov/7899010/) (correct use on own body from about 7)
- Emotion words: [Widen and Russell 2008](https://cepa.stanford.edu/sites/default/files/widen&russell%202008-Children%20acquire%20emotion%20categories%20gradually.pdf) (happy, sad, angry first); [Scientific Reports 2025](https://www.nature.com/articles/s41598-025-90613-z) (1,285 preschoolers' emotion comprehension)
- Pretend medical play: [Systematic review, PubMed](https://pubmed.ncbi.nlm.nih.gov/33472781/) (Teddy Bear Hospital: mostly lower anxiety; more fear with real equipment in two studies)
- Sociodramatic play: [Victoria State Government literacy toolkit](https://www.vic.gov.au/literacy-teaching-toolkit-early-childhood/teaching-practices-interacting-others/sociodramatic-play) (doctor's-office role play and pretend talk)
- Joint media engagement: [Journal of Children and Media 2019](https://www.tandfonline.com/doi/abs/10.1080/17482798.2018.1489866) (parent–child joint play with educational apps)
- Simon Says: [What makes Simon Says so difficult for young children? (PubMed)](https://pubmed.ncbi.nlm.nih.gov/24907632/)
- The red cross emblem in games: [Kotaku](https://kotaku.com/video-games-arent-allowed-to-use-the-red-cross-symbol-1791265328); [Digital Trends](https://www.digitaltrends.com/gaming/video-game-red-cross-health-pack-emblem/)
- Also used from `docs/find-it-design.md`: Lyster and Saito 2010 (prompts vs recasts), NN/g touch targets for children
