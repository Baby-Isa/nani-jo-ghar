# Overnight prototypes, 2 Nov 2026: what's built and what's waiting on Zafar

Zafar, 2 Nov: "go make all prototypes ... rapid prototyping, minimal checks". Eleven areas built by builders (Opus), each merged and
pushed to `claude/nice-lovelace-0vfjcj` with the full checks green at every merge (dd58bd5). **Not on the live site** (main has chai
only, 33762921). Every game is laptop size (1280x665) only; none judged; the phone strips (eggs-C) not built yet. Each area's report
(`build/reports/proto-<area>-2026-11-02.md`) has every missing word, the art list and what wasn't built.

## Play them: `labs.html` (from the branch, or after a publish), one section per area

| Area | Games (lab mode) | Report |
|---|---|---|
| Farm v2 (Hannah Mami) | feeding time, collect the eggs, home at dusk, grow-pick on the word tiles; photo and corn unchanged (`mode=farm`) | proto-farm-v2 |
| Clinic | where does it hurt, the hand splinter, the blocked nose, the drinks (`mode=clinic&game=where|hand|nose|drinks`) | proto-clinic |
| Home (Nani, Simba, Zazu) | hide and seek, pick it up and put it back, the clean-up (`mode=home-proto`) | proto-home |
| Town and shops (Nani) | the town map, the fruit stall, Nani's picky shopping, pay (`mode=town-proto`) | proto-town |
| Birthday (Zara's family) | pass the balloon, how are you?, musical statues, the cake, the presents (`mode=party-proto`) | proto-party |
| School day | the wake-up clock, getting ready, pack the bag, the blackboard (`mode=school-proto`) | proto-school |
| Sewing (Big Ma) | the cloth stall, make, mend, the fitting (`mode=sewing-proto`) | proto-sewing |
| Pet hotel (Hannah Mami) | look after the animals, going home (`mode=pets-proto`) | proto-pets |
| Safari (Hannah Mami) | snap from the jeep, who's hiding? (`mode=safari-proto`) | proto-safari |
| Beach and boat (Masi) | shells, the sandcastle, the stalls, the picnic, the ride, litter fishing (`mode=beach-proto`) | proto-beach |

Not built (left for later, as the designs say): Snap the guests, Who ate the cake?, Big Ma's cloth (third market trip), the
second-visit farm games beyond grow-pick.

## Decisions for Zafar (from the builders' reports)
1. **The cousins' names** (school day): placeholders "Cousin Zahra" and "Cousin Hasan".
2. **Musical statues without music:** Nani claps; the design's drum became a toy car (*gadi*).
3. **The pet hotel's level 1 pairs the dog with an ant**; the feelings tiles were dropped (a third group shrank every picture).
4. **One instruction at a time** (farm v2): the child can no longer do the orders in any order, and a wrong pick is a miss on the current one.
5. **Group labels on the tiles:** Kutchi where the engine has the word, else grey English to record (no written English for the child).
6. **Town:** in serve and pay the row ticks at the give, not the count; the map at L2-L4 crowds the panel with 9-10 tiles.
7. **Sewing's fitting leaks at L3-L4:** the big kurtas are always Nana's.

## The same in every area
- **Kutchi:** most deciding words are still grey English to record, so a reading child can win until Mum records them. The
  recording sheet (`docs/language/recording-sheet.md`) now lists every placeholder (320 "other" lines).
- **Kits:** each area copied the farm kit; fold them into one shared kit before any becomes a real game. A kit bug (the first-time
  spotlight can block every tap) is in the farm, clinic and others' copies.
- **Art:** placeholders throughout; each report lists its art needs for an art run.
- **Leak bots:** a knownFail stub per area.
