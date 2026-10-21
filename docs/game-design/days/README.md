# Days: how story mode is built

Story mode is **"A day at Nani's"** (Zafar, 19 Oct): a run of self-contained days. Each day is the morning door, one adventure (a kitchen day, a clinic day, a trip, later sewing), and the evening book. This folder holds the principles and an index; each trip has its own file. Structure agreed by Zafar on 21 Oct (`build/reports/days-docs-structure-review.md`).

## 1. Principles

1. **A day is data.** Each day is an ordered list of stages in the days data file (the day runner, Sprint 9), each a stage id plus its own settings (weather, which road, which game, its level). A new day is a copy of a list with stages swapped, added, removed or reordered: no code change (Zafar, 20 Oct: "built modularly, so it's easy to chop and change the sequence").
2. **A stage is a module over a shared engine.** One interface: it takes the day (weather, trip, people, words, level) and the day log, plays, writes what happened to the log (words met, photos, finds, the thing for Ali) and hands on. The book reads only the log, so it reviews whatever the day held.
3. **Engines are shared, stages are settings.** A stage = an engine + its data. The engines are described once, in `docs/game-design/modes/` (the table below).
4. **Not built yet = skipped.** The runner passes over a stage whose module isn't built, with a lab note, so a day plays with whatever exists.
5. **Harder on a later visit.** The same stage at a higher level (more things, positions, counts), set in the day's list. A trip can be visited again with new stages.
6. **Nothing written twice.** True of every day using an engine: its mode doc. True only of one trip: the trip file. The order of stages: the data; the trip file mirrors it and says what the Kutchi decides at each, never how the engine plays.
7. **The weather is the sky.** The sky above the door sets the trip and what you pack; it follows the day into the window and the place.
8. **Every day ends at the book**, and each trip sends something home (for Ali, for the pantry, for Nani's shelf) that a later day uses.

## 2. The people

| Who | Where | Notes |
|---|---|---|
| Nani | every day | takes the child on every trip; a real person (likeness approved, 21 Oct) |
| Hannah Mami | the farm, later the safari: anything with animals | name to confirm; a real person (likeness run before her art) |
| Masi | the beach | |
| Ali | stays home | gets the day's thing ("this is for Ali") |
| The doctor | the clinic | Hannah's granddad |

Money is *paisa*. Conversations with these people are a large part of every day (`modes/conversations.md`).

## 3. The engines (stage library)

| Stage | Engine and its doc | Status |
|---|---|---|
| Door | the door (`days/README.md` §5) | built (Sprint 9) |
| Pack the bag | `modes/pack-the-bag.md` | Sprint 10 |
| Ride (car, bus) | `modes/window-ride.md` | built (Sprint 9) |
| Meet | `modes/conversations.md` | Sprint 10 |
| Put it in its place (feed, animals home, the picnic, the shopping, Ali's thing) | `modes/put-it-in-its-place.md` | Sprint 10 |
| Count to a heard number (eggs, cobs, coins, shells) | `modes/count-to-a-number.md` | Sprint 10 |
| Snap: the photos named | `modes/snap.md` | Sprint 10; its photos feed the book |
| Food stall | `modes/cook.md` stations, reskinned | Sprint 10: the corn stall |
| Find it (stalls, search) | `modes/find-it.md` | built; the shops use it |
| Evening book | `modes/story-by-the-fire.md` | built (Sprint 9) |
| Kitchen day, clinic day | `modes/cook.md`, `modes/clinic.md` | built |

## 4. Index

| Day | Weather | File | Status | Next visit |
|---|---|---|---|---|
| Kitchen | any | `modes/cook.md` | built | |
| Clinic | cloudy | `modes/clinic.md` | built | |
| The farm | sunny | `farm.md` | Sprint 10 | animals home at a harder level; the chicks; the vegetable patch |
| The shops | rainy | `shops.md` | designed | |
| The beach | sunny | `beach.md` | designed; needs Mum's beach words | |
| The safari | sunny | `safari.md` | idea | |
| The boat trip | sunny | `boat.md` | idea | |

**Future day ideas** (from the retired arcs, `docs/archive/game-design/story-arcs-retired.md`): making clothes with Big Ma (sewing, seeded by the shops' cloth), the monsoon (Monsoon rush), Who did it? (a mystery day), Eid. A new idea goes in `docs/ideas.md` until Zafar names it, then it gets a stub here.

## 5. The door

Nani at her door on the day's sky: she says the weather word alone, then in a sentence with a gesture, then the day as short sentences in turn, each its own line with its English beneath (rule 5's one exception), and a thought bubble of the place. Two cards at the side (the weather, the activity), each as its sentence is spoken. The child answers Ha! or Na. Art: the empty house with the sky behind, Nani's pose cut-outs (s09b). Rows DOOR-01 to DOOR-04.

## 6. A trip file's sections

(a) One line: what, weather, host, status, sources (newest wins). (b) **The day's list:** stage, engine, level, what the Kutchi decides. (c) **People, the thing for Ali, what comes home.** (d) **Words it needs** (English; ✓ recorded or to record; never invented). (e) **Art it needs.** (f) **Later visits.** (g) **Zafar's answers and open questions**, dated.
