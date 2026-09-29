# More speaking as the game goes on: a proposal (29 Sept 2026)

**Status:** proposal for Zafar. Nothing built. It extends the Roadmap's "Skill channels" ladder (rung 4 "picture only → say it, role reversal"; rung 6 "a question in context → answer aloud") and the Conversations module.

## The problem (Zafar, 29 Sept)
We need more speaking as the game progresses, and Conversations alone isn't enough. The hard part is **the instruction**. How do you tell a child *what* to say when they don't read English and don't yet understand the Kutchi? Answering is easier, because the question sets it up. **Asking** is harder, because nothing prompts it. The clinic works for asking because the role (the doctor's helper) gives a reason to ask, and the questions come from a small fixed set. Anything unstructured, or anything that could become unstructured, is very hard.

## The principle: a picture says *what*; the frame they've already heard says *how*
The child never gets an English instruction. Two things carry it:
1. **A picture of the need**: a thought bubble over the child's character, or the card showing the thing wanted. For example, a sugar jar in the bubble, or the plaster on the card.
2. **A frame the child has already heard many times** as the listener. Every customer in Cook has said *Muke {x} khape* to them, so by the time they're asked to order, the frame is familiar. Speaking is always **the flip of something they've done as the listener.**

So a speaking moment = picture of the need + a heard frame + a **closed set** (the recogniser only ever checks 3–5 options). It is never open-ended. That's not just a design choice: the on-device recogniser can only do closed sets anyway, so "unstructured" can't happen by construction.

## Setting up the premise: watch it, do it together, do it alone
A child who can't read English and doesn't yet know the Kutchi works out the situation by **watching it happen first**. Nobody explains it. Every speaking moment is introduced in three steps, the first time only:

1. **Watch.** The exchange plays out between two characters while the child watches. The line shows in the speaker's bubble with the **read-along underline** as it's said (X2, the standard everywhere). The thing asked for is a picture on the card.
2. **The handover.** The character who spoke turns to the child and hands over the role with a visible prop: the doctor hands over his clipboard, or Nani hands over her purse at the stall. The child's avatar moves into that spot. A **"your turn" bubble with a mic** appears over the child's avatar. It's the same sign in every mode, so the child learns it once.
3. **Do it together, then alone.** See the "Say it after" ladder below.

**Examples:**
- **Clinic, calling a patient (W3).** For the first few patients, the doctor calls them himself (W1). The child has watched and heard "[the boy], come" many times and tapped the right person. Then the doctor hands over his clipboard, which shows the next patient's **face**, and the "your turn" bubble appears over the child.
- **Cook, ordering.** The child has served dozens of customers who said *Muke chai khape*. In the role-reversal round, the family sits the child down at the table, Nani stands at the stove, and the child's thought bubble shows a cup of chai. First, Ali orders before the child (watch), then it's the child's turn.

## "Say it after": how the help fades
Zafar, 29 Sept: yes to repeating after a model; **no separate whisper recordings** (too much recording). So the model line is **a clip that's already recorded**: the doctor's own call, a customer's order, Nani's own line. No new recordings are needed for speaking.

| Rung | The child sees and hears | The child does |
|---|---|---|
| 1 Say it after | the recorded line plays, with **the words written** in the bubble and underlined as they're said; the same words then show in the child's "your turn" bubble | says it after the model, with the words in front of them |
| 2 Words, no model | no model; the words are in the child's bubble, beside the picture | says it (the words are the support) |
| 3 Picture | only the picture; the words are one tap away (the peek) | says the whole line |
| 4 Choice | the picture shows two needs | picks which to ask for, then says it |

The start is fully supported: every line is written and underlined as it's spoken, the first time and every time at rung 1. The words fade by the child's own record for that sentence pattern, not by the mode's level. Rung 1 is practice: it earns coins and a cheer, and the voice star starts at rung 2.

If there's no mic, or a null result twice, the fallback is the pills: coins, never the voice star. A parent can tick ✓ (Grandparent mode).

## Where asking happens (role reversal in every mode)
Each mode gets a moment where the child takes the asking role, using the frames it has taught:
- **Cook:** the child **orders** from Nani's stall, or from a trip's food stall (*Muke be samosa khape*). The trips' stall is the natural home: the child buys lunch.
- **Clinic:** the child is the doctor's voice. The patient card shows a picture, and the child asks *[Where does it hurt?]* or *[How do you feel?]* (E4 already does this), then asks the pharmacist for the item (*[Bring me] the plaster*, the flip of the pharmacy).
- **Find it / Hide and seek:** a thought bubble shows the lost thing, and the child asks a family member *[Have you seen the {x}?]*. The answer is spoken, and the child searches where they said (an information gap: only the character knows).
- **Put it there:** the child tells Ali where to put things (*[on the table]*). Ali acts on what the recogniser heard, and a wrong hearing is a comic mistake.
- **Snap (at the destinations):** the child tells Ali what to photograph.
- **Conversations:** greetings, thanks and how-are-you, started by the child from rung 3.

## When can we assume they understand?
The per-child tracker decides, word by word. A frame becomes speakable (rung 1) only once the child has acted on it correctly as the listener several times. It moves up the "Say it after" ladder as they say it successfully. This is the "per-child sentence-pattern stage" (clinic CQ2), shared by every mode. It's already planned for "later"; this proposal makes speaking one of its main uses.

## What it needs
- Nothing new to record for speaking: the models are clips already recorded for listening.
- The tracker's `produce_stage` per word and frame (see the Roadmap's skill channels).
- One shared speaking component (`tell` / `say` already exist) with the "Say it after" ladder, the "your turn" bubble, the thought bubble and the pill fallback, so every mode's speaking moment behaves the same.

## Open for Zafar
1. ~~Echo at rung 1?~~ **Yes (Zafar, 29 Sept), with no whisper recordings; the text is written and underlined at the start.**
2. Which mode gets the first asking moment? Claude suggests Cook's role reversal (the child orders from Nani), because the frame is the most-heard one in the game.
3. Should speaking ever be required to progress, or always optional with the voice star as the reward? Claude suggests optional, because of the mic, shy children and noisy rooms.
