# More speaking as the game goes on: a proposal (29 Sept 2026)

**Status:** proposal for Zafar. Nothing built. It extends the Roadmap's "Skill channels" ladder (rung 4 "picture only → say it, role reversal"; rung 6 "a question in context → answer aloud") and the Conversations module.

## The problem (Zafar, 29 Sept)
We need more speaking as the game progresses, and Conversations alone isn't enough. The hard part is **the instruction**. How do you tell a child *what* to say when they don't read English and don't yet understand the Kutchi? Answering is easier, because the question sets it up. **Asking** is harder, because nothing prompts it. The clinic works for asking because the role (the doctor's helper) gives a reason to ask, and the questions come from a small fixed set. Anything unstructured, or anything that could become unstructured, is very hard.

## The principle: a picture says *what*; the frame they've already heard says *how*
The child never gets an English instruction. Two things carry it:
1. **A picture of the need**: a thought bubble over the child's character, or the card showing the thing wanted. For example, a sugar jar in the bubble, or the plaster on the card.
2. **A frame the child has already heard many times** as the listener. Every customer in Cook has said *Muke {x} khape* to them, so by the time they're asked to order, the frame is familiar. Speaking is always **the flip of something they've done as the listener.**

So a speaking moment = picture of the need + a heard frame + a **closed set** (the recogniser only ever checks 3–5 options). It is never open-ended. That's not just a design choice: the on-device recogniser can only do closed sets anyway, so "unstructured" can't happen by construction.

## The whisper ladder: how the instruction fades
Nani is beside the child at every speaking moment. Her help fades by the word's own stage (the Roadmap's `produce_stage`), not by the mode's level:

| Rung | Nani does | Child does |
|---|---|---|
| 1 Echo | whispers the whole line | says it after her |
| 2 Start | whispers the first word or the frame only (*Muke …*) | finishes it, picking the noun from the picture |
| 3 Picture | nothing, only the picture | says the whole line |
| 4 Choice | nothing; the picture shows two needs | picks which to ask for, then says it |

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
The per-child tracker decides, word by word. A frame becomes speakable (rung 1) only once the child has acted on it correctly as the listener several times. It moves up the whisper ladder as they say it successfully. This is the "per-child sentence-pattern stage" (clinic CQ2), shared by every mode. It's already planned for "later"; this proposal makes speaking one of its main uses.

## What it needs
- Every frame recorded in the family voices (as for listening), plus Nani's whispers: the whole line, and the frame's first word alone.
- The tracker's `produce_stage` per word and frame (see the Roadmap's skill channels).
- One shared speaking component (`tell` / `say` already exist) with the whisper ladder, the thought bubble and the pill fallback, so every mode's speaking moment behaves the same.

## Open for Zafar
1. Is the whisper ladder the right way to fade the instruction? In particular, is echo at rung 1 okay (repeat after Nani)?
2. Which mode gets the first asking moment? Claude suggests Cook's role reversal (the child orders from Nani), because the frame is the most-heard one in the game.
3. Should speaking ever be required to progress, or always optional with the voice star as the reward? Claude suggests optional, because of the mic, shy children and noisy rooms.
