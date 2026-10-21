# A day at Nani's (story mode)

**What it is:** story mode is a run of days. Each day is self-contained: the morning door, one adventure (a kitchen day, a clinic day, a trip day, later sewing), the evening book. Sources, newest wins: Zafar's lines in `docs/sprints/S09-a-day-at-nanis.md` and `docs/game-design/story-and-arcs.md` Part 1 (19-20 Oct); the trip research (`build/reports/research-trips-2026-10-19.md`) only where Zafar hasn't changed it (it proposed Kaka and Kaki and Nana: both replaced).

## 1. Days are built from modules (Zafar, 20 Oct)

"Ensure the days are built modularly, so it's easy to chop and change the sequence ... any of those can be swapped in or out easily or replicated and changed for a new day."

- **A day is data:** an ordered list of stages in `data/day.json`, each a stage id plus its own settings, e.g. `door (sunny) → pack (farm bag) → ride (car, farm road) → meet (Hannah Mami) → feed → eggs → snap → corn stall → animals home → home (Ali) → book`. A new day is a copy of a list with stages swapped, added, removed or reordered; no code change.
- **A stage is a module** with one interface: it takes the day (weather, trip, people, words, level) and the day log, plays, writes what happened to the log (words met, photos, finds, the thing for Ali) and hands on to the next stage. The book reads only the log, so it reviews whatever the day held.
- **Engines are shared, stages are settings:** one engine serves many stages (put it in its place: feed, animals home, the picnic, the shopping; count to a heard number: eggs, cobs, coins; the window belt: every ride; Snap: every trip's photos). A stage = engine + its data (things, lines, art).
- **Not built yet = skipped:** a stage whose module isn't built is passed over with a note in the lab, so a day plays with whatever exists.
- **Levels per stage:** the same stage at a harder level on a later visit (more things, positions, counts), set in the day's list.

## 2. The people

| Who | Where | Notes |
|---|---|---|
| Nani | every day | takes the child on every trip |
| Hannah Mami | the farm, later the safari: anything to do with animals | Zafar's wife; name to confirm; her likeness and voice are Zafar's call |
| Masi | the beach | |
| Ali | stays home | gets the day's thing ("this is for Ali") |
| The doctor | the clinic | Hannah's granddad |

Money is *paisa*. Conversations with these people are a large part of every day (`conversations.md`).

## 3. The stage library

| Stage | Engine | Status |
|---|---|---|
| Door: the weather and the day, Ha!/Na | door | built (Sprint 9; the new art lands in s09b) |
| Pack the bag | Cook pantry fetch, reskinned | Sprint 10 |
| Ride (car, bus) | window belt | built (Sprint 9) |
| Meet (greet, answer with the elder form) | Conversations | Sprint 10 |
| Place games | per trip (§4) | Sprint 10 for the farm |
| Snap: take the photos named | Snap (greybox built) | Sprint 10; its photos feed the book's games |
| Food stall | Cook stations reskinned | Sprint 10: the corn stall |
| Home: give Ali the day's thing | put it in its place | Sprint 10 |
| Evening book | book | built (Sprint 9) |
| Kitchen day, clinic day | Cook, the clinic | built |

## 4. The farm day (Sprint 10)

Hannah Mami's farm. Proposed first visit, in order (each short; trimmed after Zafar's play):

1. **Door:** sunny; Nani: "Today I want to go to the farm."
2. **Pack the bag:** the weather sets the kind (sun: hat), the Kutchi picks which and how many (the big hat, two bottles), with decoys of the same kind.
3. **Ride:** the car on the farm road (built).
4. **Meet Hannah Mami:** Nani greets her first, then she asks the child "how are you?" and the child answers with the elder form.
5. **Feed the animals:** Hannah Mami names the feed and the animal ("two scoops for the hen"); tap the feed, tap the animal; hens and goats both want food, so only the word picks.
6. **Collect the eggs:** lift a hen, "how many?", count the eggs into the basket; a chick under one hen is the joke.
7. **Snap (the photo game):** Hannah Mami or Nani names a shot ("the hen", "two goats", "the big goat", "the chick with its mother"); aim and take it. The photos go into the evening book's stick-in-the-photo and our-day pages.
8. **The corn stall:** roast the cobs (the grill, turned on the beat), then dress each as asked: chilli powder, garlic powder, salt, pepper, a squeeze of lemon; serve with the chutney asked for: coconut, mint (*fudino ji chutney*) or tamarind (*amli ji chutney*). The order decides the dressing, so the word picks.
9. **Animals home:** each animal to its own place (the goat to the shed, the hens to the coop, the chicks with the hen). First visit: one at a time, the place named; a harder visit adds positions (behind, next to) and counts.
10. **Home:** one egg for Ali; the rest go to the pantry for the next kitchen day.
11. **Evening book:** today's photos, words and finds.

**Later farm visits** add: find the chicks (positions, the Find it design), the vegetable patch (fetch with sizes), milking (cut for now: no words).

## 5. The other trips (later sprints)

- **The shops** (a rainy day): a first-person maze of lanes followed by spoken directions; each shop its own game; paying in *paisa*; a goat steals something from the bag and people along the way say which way it went. The road's shops wait for the shops game's art (Zafar, 20 Oct).
- **The beach** (with Masi): shells, the sandcastle, the snack stall, the picnic; the kite only if it earns a game. Needs Mum's beach words first.
- **The safari** (Hannah Mami): spot the animals from the jeep, a photo game.
- **The boat trip:** fishing, a boat ride; its own day.

## 6. Open questions for Zafar

1. The farm day's length: ten stages may be long for one sitting; the list is data, so play it and trim.
2. Hannah Mami: her name in the game, her picture (a real person: a likeness run) and who voices her.
3. The corn dressings and chutneys: Mum's words for chilli powder, garlic powder, salt, pepper and coconut chutney (never invented).
