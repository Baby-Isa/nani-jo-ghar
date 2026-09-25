# Pipeline brief: every mode as a sequence of stages, each stage a set of mini-games (25 Sept 2026, evening)

Zafar's feedback on the clinic, which he wants applied to **every** mode:

> "What's missing is the structure and the process. It should be almost factory-like, a set process." Each mode is a **pipeline of stages**; **each stage has several mini-games** (variants that get harder or different); the stages are **stitched into one sequence** that tells a little story with a beginning and an end. Mini-games reuse mechanics from other modes wherever they fit (e.g. making turmeric milk is the tadka station from Cook).

## The worked example: the clinic
1. **Waiting room → clinic.** The doctor says "bring in the little girl", "bring in the old man"; the child taps the right person (learning who's who: girl, boy, old man, old woman, baby, Nana…). Later: several old men in different colours, and the doctor says which colour.
2. **Diagnosis** (three variants):
   - "Does it hurt here?": the possible parts pulse; the child taps one, the patient says yes or no; a yes goes "ding". The very first, easiest level.
   - "It's my knee": the patient names the part; the child taps it. **The bulk of diagnosis.**
   - A guessing/deduction variant for later levels.
3. **Gather the treatment: the pharmacy counter.** A conveyor or sushi-style belt carries items past; the child grabs the ones asked for (hot water, lemon, *hardar*, blankets, bandages, the green bottle…). Everything gathered is used in the next stage.
4. **Heal.** The most fun part: one comical mini-game per body part, **15–20 of them** (see below). Some reuse Cook (making a cup of chai with lemon; turmeric milk = the tadka station).
5. **Send-off.** "Is everything okay now?" "Yes, now I'm happy!": feelings words (*okay, happy, better, sad, scared*) and goodbye.

**Healing mini-games: Zafar's steer.** Comical, never gory, but **stitches and injections are fine** (reversing the earlier "no needles, no stitches" call). Look at popular children's doctor apps (e.g. Toca Life: Hospital, Dr. Panda Hospital, My Town: Hospital, Baby Panda's Hospital, Bimi Boo Doctor, Dentist games) for mechanics that already work. Ideas so far: ear (pull out the earwax, then clean), cut (suturing, following a sequence), teeth (brush in an order: up, up, left, right…; tap the tooth; cover a crack), eyes (drops), tongue (something!), elbows, knees, stomach. Every one must carry Kutchi, even if only through the instructions and the counts/colours/sides in them.

## What each mode's redesign must produce
Add a new top section to the mode's design doc, **"Pipeline design, 25 Sept 2026"**, superseding older sections where they conflict:
1. **The pipeline**: the stages in order, what the child does in each, and how one stage hands over to the next (what's carried forward), from arrival to a send-off/ending. A diagram in text.
2. **Per stage: the mini-game variants** (at least two, usually three or more), each with: the mechanic(s), what the Kutchi instruction carries, how it gets harder (levels), and which existing mechanic it reuses (Cook's, another mode's, or new).
3. **The big library** where the mode has one (the clinic's 15–20 healing games; a mode's equivalent pool of "fun" mini-games): each with a one-line pitch, the Kutchi it teaches, the mechanic, age fit (5 / 8 / 11), and a score 1–5 for fun, Kutchi, and build cost.
4. **Research**: what popular children's apps in this genre do (name them, and the mechanics worth borrowing). Use web search.
5. **Stitching**: how a session runs (e.g. a clinic morning = 3 patients through the whole pipeline), how the first ever session is tiny (UX principle 7), and how free play dips into single stages.
6. **What survives from the current build** (`js/<mode>/`, `data/<mode>.json`, the build report in `build/reports/<mode>-build.md`): which files and mechanics carry over, which change, which go. Be concrete: this tells the next build agent what to keep.
7. **Words needed**, marking what's already in the Questions for Mum doc.
8. A rewritten **build brief**, phased, own files first.

Follow `docs/UX-PRINCIPLES.md` (request card, left sidebar, fixed-shape cards, light bulb, one job at a time, start tiny, the end-of-round screen) and `docs/modes/DEEP-DIVE-BRIEF.md`'s principles (modular mechanics, speaking moments with a closed set and a fallback, the Sceptic's win-without-Kutchi test).
