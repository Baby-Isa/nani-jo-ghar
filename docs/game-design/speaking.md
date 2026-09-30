# More speaking as the game goes on: a proposal (29 Sept 2026)

> **Stale points (what `docs/process/rules.md` now overrides).** Text below is left as written.
> - "The voice star starts at rung 2", "coins, never the voice star", Open question 3 "voice star as the reward" → no voice star; scoring is three badges (H5, decisions 1–3)
> - Spoken-English lines and "Achija" / "Aabhar aanjo" as defaults → goodbye is *khuda-fis*, thank you is in English (Zafar, 26 Sept; G24)
> - Coins as the reward for speaking → decision 10 (upgrades)
> - Any English written on screen as the instruction to speak → none for the child (E1, F23); a picture says what, the heard frame says how

**Status:** approved by Zafar (29 Sept); nothing built yet. It extends the Roadmap's "Skill channels" ladder (rung 4 "picture only → say it, role reversal"; rung 6 "a question in context → answer aloud") and the Conversations module.

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
   - **The turn (UX-PRINCIPLES §16):** during the watch step the two characters face each other three-quarter on, like actors on a stage; for the handover they **turn to face the player**. That's the "your turn" cue, alongside the mic bubble.
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

## The rule: speak only inside a real two-person exchange (Zafar, 29 Sept)
Speaking goes where people **naturally talk to each other**: ordering food (the customer and the cook), or the doctor and the patient. It does **not** go where nobody would really say the line; you don't call "little boy, next" in a waiting room. **The child always sees a regular exchange between two people first** (the watch step, many times as the listener), then takes one side of it.

So the clinic's speaking moves from the waiting room (W3) into the conversation with the patient. **W3 "Call them in" is dropped** in the clinic fix session unless Zafar says otherwise, and the waiting room goes back to listening only.

**Approved (Zafar, 29 Sept):** all of this proposal, and the Cook ordering pilot. **The emphasis goes on Cook and, above all, Conversations**: they're the most natural two-person exchanges and should carry most of the speaking. The other rows are lighter touches.

## Every point where it works (the inventory)
Each row is a natural exchange the child has watched from one side before taking the other. "Recorded" means clips that already exist in `data/family-audio.json` (Mum's or Zafar's voice), usable as the model and as the other side's line.

| Where | The exchange (the child's side in bold) | Watched first as | Recorded today |
|---|---|---|---|
| **Cook, role reversal** (pilot) | Nani: *Toke kuro khapeto?* (what do you want?) → **child: *Muke chai khape.*** | every customer's order, served by the child | *toke kuro khapeto?* (Mum, Zafar); *muke na khape*; the order lines are TTS placeholders |
| Trips' food stall | stallholder asks → **child orders lunch** | the Cook customers | – |
| Pantry | **child: [bring me] the milk** → Ali fetches it | Nani asking the child to fetch | – |
| Clinic, the patient | **child (the doctor's helper): [where does it hurt?] / [how do you feel?]** → the patient answers | the doctor asking the first patients | E4's lines are placeholders (Section G, the doctor's recording) |
| Clinic, "you're the patient" visit | the doctor asks → **child: [my knee hurts]** | the other patients answering | Section G |
| Clinic, pharmacy | **child: [bring me] the plaster** → the pharmacist puts it on the belt | the doctor asking the pharmacist | Section G |
| Clinic, send-off | **child: [get well soon] / goodbye** → the patient thanks | the doctor saying it | *Achija* (exists) |
| Birthday: guests | **child (the host): [do you want chai?]** → the guest: *haa* / *na* | Nani offering | *haa*, *na* exist |
| Put it there | **child: [where does this go?]** → Nani says where; the child places it | Ali asking Nani | – |
| Hide and seek | **child: [have you seen the sweets?]** → a family member says where | Nani asking around | – |
| Who did it? | **child: [did you eat it?]** → the suspect: *na!* / … | Nani questioning the line-up | – |
| Making clothes | **child (the customer): [I want a red kurta]** → Big Ma sews it | other customers | – |
| Conversations | greetings, thanks, how-are-you, either side | the family greeting each other | several exist |

## The pilot: small, and soon after Cook and the clinic are locked
**Cook role reversal, chai only.** The family sit the child at the table, Nani at the stove. Ali orders first (watch). Then Nani turns to the child: *Toke kuro khapeto?* A thought bubble shows the chai, and the "your turn" bubble appears. Rung 1: the order line plays, written and underlined, and the child says it after. Nani makes exactly what the recogniser heard (a wrong hearing gets a funny wrong cup), and the child drinks it.
- It uses the existing chai station, the existing `js/shared/say.js` and `speech.js`, and the recorded *toke kuro khapeto?*.
- It needs Mum's *Muke chai khape* (and 2–3 variants) recorded in her voice, and the recogniser enrolled with them.
- **What to learn from it:** do children get the handover without English; does repeating after the model feel good; does the recogniser cope with a child's voice.
- Then the shared speaking component is built from what the pilot teaches, and the other rows follow, mode by mode, as each mode is built.

## Planning for it now (cheap)
- **Every mode's design sheet gets a "speaking points" line** listing its natural exchanges from the inventory, so each mode is built with the watch step in place (the other side is seen and heard many times first).
- **The family recording list** gets the order lines for the pilot.
- **Nothing else is built yet:** no mode waits on this.

## When can we assume they understand?
The per-child tracker decides, word by word. A frame becomes speakable (rung 1) only once the child has acted on it correctly as the listener several times. It moves up the "Say it after" ladder as they say it successfully. This is the "per-child sentence-pattern stage" (clinic CQ2), shared by every mode. It's already planned for "later"; this proposal makes speaking one of its main uses.

## What it needs
- Nothing new to record for speaking: the models are clips already recorded for listening.
- The tracker's `produce_stage` per word and frame (see the Roadmap's skill channels).
- One shared speaking component (`tell` / `say` already exist) with the "Say it after" ladder, the "your turn" bubble, the thought bubble and the pill fallback, so every mode's speaking moment behaves the same.

## Open for Zafar
1. ~~Echo at rung 1?~~ **Yes (Zafar, 29 Sept), with no whisper recordings; the text is written and underlined at the start.**
2. ~~Which mode first?~~ **Cook's ordering, as the pilot (Zafar agrees it fits; the clinic's patient conversations next).**
3. Should speaking ever be required to progress, or always optional with the voice star as the reward? Claude suggests optional, because of the mic, shy children and noisy rooms.
