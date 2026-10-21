# Story arcs and trip plans, retired (from story-and-arcs.md, 21 Oct 2026)

Retired by Zafar on 19 Oct (story mode is "A day at Nani's"); kept for history. The live design is `docs/game-design/days/`.

## The 19 Oct paragraph (now in days/README.md)

**Replaced (Zafar, 19 Oct): story mode is "A day at Nani's".** Each day is self-contained: a morning ritual at Nani's door (she names the day and the weather, which sets what you pack; the child says *Ha!*), one adventure (a kitchen day of 4-5 customers, a clinic day of 3-4 patients, a trip day, later a sewing day), then the evening with Nani and the book. Days get harder as they go; new trips arrive as new days. Arc 1 and the weekly thread are retired; set the table and find-it move into the trips. Days 1-2 are free (a kitchen day, then the first trip: the farm or the beach). Conversations with recurring characters become a much larger part of every day. The days, their stages and the trips are designed in `docs/game-design/modes/a-day-at-nanis.md` (20 Oct), which supersedes the trip map's Kaka, Kaki and Nana. **Trips (Zafar, 19 Oct):** the farm first, then the beach, then the shops. Nani takes you on every trip and you meet family there: the farm (and later the safari) is run by Hannah Mami (name to confirm); at the beach you meet Masi. You pack what you need and will use on the trip. Money is *paisa*. Ali (not Nana) stays home and gets the day's thing. The recording sheet waits. **The weather** is the sky: one fixed house and foreground, the sky from the horizon up swapped (sunny, cloudy and raining, dark with stars), the scene's light and shadows following it (a per-weather light tint and a sun-shadow layer that only the sunny sky shows; rain drawn in code). At the door Nani isolates the new word and repeats it with a gesture ("Rain. Today it is raining. Lots of rain", arms out), then names the day ("let's cook today"). **The door, 19 Oct:** Nani says the weather word alone, then in a sentence with a gesture, then the day as short sentences in turn, each its own line with its English written beneath ("Come. Today I want to go to the beach. Do you want to go to the beach with me?"; "Come. I want to cook today. Will you help me cook?"), with a thought bubble of the place or of cooking. **The beach:** shells, the sandcastle, the snack stall, the picnic; the kite only if it earns its place as a game. Fishing and a boat ride are their own day (the boat trip). **The shops:** a first-person maze of lanes followed by spoken directions; each shop its own game; paying in paisa; a goat steals something from the bag and people along the way say which way it went. Rain and umbrella beats left out for now. **Next sprint:** the door and weather sky, the evening book, Conversations wired in, pack the bag, the window ride.

#### Arc 1's beat script: TBC

The Birthday's own beat-by-beat script (what you see, what Nani says, the gist caption, for each errand) is written the same way as the worked example that used to sit here for the old Eid chapter — see "Replaced 28 Sept" below for that example's shape. It's written once the guest dialogue for Cook's ordering round is confirmed with the family, so it isn't duplicated here yet.

**Every arc's last beat is the Story by the Fire** (decided 28 Sept 2026): a short scene of Nani by the fire in the living room, then a picture book built from what the child actually did that day, which she voices while the child fills in gaps. It replaces a plain "chapter end" beat wherever an arc or chapter finishes. Full design: `docs/game-design/modes/story-by-the-fire.md`.


> from: docs/archive/design-v1/Roadmap and Story Structure.md § Story arcs

### Story arcs

**Reworked 28 Sept 2026.** The sequence is now: the first launch, then **Arc 1: The Birthday**, then a run of **day-out trips** (a repeatable template, new places each time), with two **standalone, repeatable arcs** — Volunteering at the clinic and Making clothes with Big Ma — slotted in once the day-out template is established. Eid moves to a later arc (there's more to explain about it, so it suits a more prepared player). See "Replaced 28 Sept" at the end of this section for what the old five-arc plan looked like and what became of its content.

#### Arc 1: The Birthday (the MVP, syllabus stages S1 + S2)

A birthday party at Nani's house. Every errand still has a different main action, in the order a real party goes, so a new player's first impression is several different things to do, not one thing twice.

| Chapter | Goal → complication → payoff | Errands (mode) |
| --- | --- | --- |
| The guests are coming | Guests are due → nothing's ready → each guest fed, the table set | Cook each guest's order (Cook: each guest asks for their own dish by name, like Cook's existing customer flow). Set the table (Put it there: place words for plates, cups, a spot for each guest) |
| The cat and the sweets | The mithai's out → the cat scatters it | Find the sweets (Hide and seek). Pack the sweet box (Put it there, with counting: the right number in each layer) |
| The party | Everyone's fed and seated | Blow out the candles (a short finale beat), then the Story by the Fire |

**Explicitly dropped from Arc 1** (decided 28 Sept 2026): clothes-making (it's now its own standalone arc, Making clothes with Big Ma), greeting guests at the door (folds into the Conversations module's Knock-knock chain instead, later), and the shoe mountain.

Arc 1 needs Cook (already built) and Put it there and Hide and seek (both still to build), the same mode set the old Chapter 1–3 needed, so the build cost doesn't change.

#### Arc 2 onward: "A day out with Nani" (a repeatable template)

Each arc from here is a trip, built mostly from existing modes, with new words each time. The template, in order:

1. **Pack your bag** — a small fetch-style round (shaped like the pantry round), different items each trip.
2. **Cook your packed lunch** — Cook, reusing its stations.
3. **Travel** — by bus, car or motorbike. One new game: **spot it out of the window**. The only new art is the view out of the window; Nani says "spot the …", and the child taps things as they pass. **Decided 29 Sept (Zafar):** keep it simple, like the clinic's pharmacy belt (the window is the belt): no camera and no aiming here.
   - **Snap at every destination (decided 29 Sept, Zafar).** At each place, the child is first shown a few items with their words (the shot list), then finds and snaps them in the scene with Snap's viewfinder (`docs/game-design/modes/snap.md`, engine and greybox built). The photos feed the album and the Story by the Fire. This is Snap's home now, replacing the old village arc.
4. **A food stall at the place** — three Cook-style mini-games (for example, at the beach: corn on the cob, sekelo, fried doughnuts).
5. **One or two place-specific games** — for example the beach's sandcastle and kite.
6. **The Story by the Fire** — every arc's ending (see below and `docs/game-design/modes/story-by-the-fire.md`).

**First trips to sketch**, in the order Zafar gave them:

| Trip | The stall (3 Cook-style games) | Place games | Vocabulary (English; all Kutchi to record) | Art needed |
| --- | --- | --- | --- | --- |
| **The beach** | Corn on the cob, sekelo (already in the game), fried doughnuts | Build a sandcastle; fly a kite; collect shells | sand, sea, wave, shell, bucket, spade, kite, sun hat, towel, swim | New background(s); sandcastle and kite art; the beach stall's three dishes |
| **The garden / farm** | Fresh vegetables from the patch; a farm lunch; fresh milk | Feed the hens and goats; find the chicks | hen, goat, chick, egg, feed, fence, vegetable patch, watering can, dig, plant | Reuses the existing hen/goat/chick character art; new background(s) |
| **The safari** | Local food-stall snacks (TBC with the family) | Spot the animals from the jeep (the trip's own "spot it" moment, doubled up with travel); a photo game | jeep, binoculars, lion, elephant, giraffe, zebra, watering hole, camera | New animal art, a safari background, a jeep |
| **The boat** | Fresh fish, coconut water, a stall snack (TBC) | Fishing; spot things in the water | boat, oar, life jacket, fish, net, jetty, wave | A boat, a jetty/harbour background, fish art |

These are a first sketch, not locked: exact stall dishes and games are confirmed with the family and against what art already exists before each trip is built.

**The cross-arc vocabulary spine.** Some words appear on every trip regardless of destination, and are taught once, then reinforced everywhere: the bag's contents, travel verbs (go, arrive, look, point), numbers and colours (carried over from Arc 1), and the Conversations module's thanks/greetings/well-being exchanges, which every new person met on a trip can use.

#### Standalone, repeatable arcs

Two arcs that aren't day-out trips, placed into the sequence rather than tied to one story spine:

- **Volunteering at the clinic.** Nani introduces it after the child's first or second day out. Across the arc's run the child helps 4–5 patients; it teaches body parts and uses all of the clinic's existing mini-game designs (`docs/archive/clinic/clinic-design-v1.md`).
- **Making clothes with Big Ma.** The Dress up mode's home (`docs/game-design/modes/dress-up.md`), placed later in the sequence once a story reason for new clothes comes up (a trip, an occasion). Exact placement is TBC.

Both are repeatable: like the day-out template, they're built once and replayed with new patients or new garments.

**Two more, proposed 29 Sept (Zafar: "Monsoon and Who did it sound like arcs in their own right").** Both modes already have a full design with many mini-games, like Cook and the clinic, and an engine plus a greybox lab (about 17% each). Placement and story TBC; not scheduled before the first trip.
- **The monsoon** (Monsoon rush, `docs/game-design/modes/monsoon-rush.md`): the rains arrive at Nani's in Kutch. Nani's forecast, bring everything in, the animals into the shed, the kitchen leak, dry off, chai for everyone.
- **Who did it?** (`docs/game-design/modes/who-did-it.md`): a mystery arc. Something's missing, gather clues (look closer, follow the prints), the sofa line-up (keep who fits, ask, tell Ali, Nani guesses), accuse and prove it, the comic reveal, sorry and goodbye. Its sweets case (`who.html?case=a1c3-sweets`) could still be a small culprit round after Arc 1's Find the sweets, but only once its describing words and past-tense frames are recorded (almost all are placeholders today).

#### Eid: moved later

Eid is no longer Arc 1. It becomes its own arc later in the sequence, once the day-out trips and the two standalone arcs have built up enough vocabulary and story weight to carry it properly. Not yet designed.

**Known follow-up:** the first launch's own story hook (`docs/game-design/modes/first-launch.md`) currently ends with Nani saying "Tomorrow is Eid, guests are coming" to lead into cooking. That line now needs to lead into the Birthday instead. Not changed in this pass — flagged for whoever next touches the first launch.

#### Replaced 28 Sept: the earlier five-arc plan

The previous plan (23 Sept) was five arcs as a grammar ladder — Arc 1 *Eid at Nani's* (S1–S2), Arc 2 *The Wedding* (S3), Arc 3 *The Monsoon* (S4), Arc 4 *Nani's Lost Ring* (S5), Arc 5 *Nani's Village* (S6) — about five chapters each, roughly 50 errands in total. The full chapter-by-chapter detail is in git history (this file, before 28 Sept 2026); the shape of it, for reference:

| Old arc | Was about | Its content's new home |
| --- | --- | --- |
| Arc 1: Eid at Nani's | Guests coming, cooking, the table, a spill, Eid morning | Split: the cooking/table/sweets beats became the Birthday; Eid itself moves later; the spill and Big Ma's mending became the Making clothes arc's kind of story |
| Arc 2: The Wedding | Kinship, colours, outfits, a gift quest, the feast | Kinship and the gift-asking pattern fit the cross-arc vocabulary spine; outfits fit Making clothes; the feast's serving-in-order pattern fits any trip's food stall |
| Arc 3: The Monsoon | Weather, illness, farm animals sheltering, chai | The clinic content becomes the standalone clinic arc; the farm-animal content fits the garden/farm trip; weather could become a future trip variant |
| Arc 4: Nani's Lost Ring | Past tense, a search, asking around | Not carried forward yet; a mystery chapter could return inside a future trip |
| Arc 5: Nani's Village | The farm, the journey, family photos, Nana's stories | The farm and journey became the garden/farm and travel template; family photos and Nana's stories fit any trip's Story by the Fire |

The syllabus's S1–S6 grammar stages (below) still hold as a ladder; which trip or arc carries which stage is TBC and gets settled as each trip is actually built, rather than fixed in advance the way the old plan fixed it.


> from: docs/archive/design-v1/Roadmap and Story Structure.md § Syllabus


## Part 4. Chapter 1 Eid dressing: the story mapping (Chapter 1 Art Prompts)

The Eid dressing is re-homed: the hub is dressed for the Birthday (H36) and the Eid decorations wait for the Eid arc (decision 39). The mapping below is kept as the model for dressing a hub as an arc progresses; "patch" means "chapter".


> from: docs/archive/art-prompts/Chapter 1 Art Prompts.md § 7 Eid decorations sheet (the story-mapping part)

**Why this sheet:** the hub gets dressed a little more after each errand (see "How the story is told" in the Roadmap). In kitchen v3 these hang from or run along the top shelf, the Eid shelf. The bunting must carry no letters: text never lives in an image.

**Review of the kept image (23 Sep 2026), and how it's used.** Passes every reject check: no text or letters anywhere, including on the bunting.

| Area | Decision |
| --- | --- |
| **Anchor points** | Lantern and the crescent/star both hang from visible chains, giving a natural point to anchor them from the eid_shelf in scene JSON |
| **Legibility** | All six read clearly at small size, checked against the hub's actual scale |
| **Fairy-light glow** | The bulb glow has blended into the magenta key colour at the slicing step. Needs a clean cut plus a code-added glow effect (same class of fix as the known `item-vermicelli.png` magenta-fringe defect in the Asset Naming Convention doc), not a regeneration |
| **Bunting length** | Only 3 flags, too short to span a shelf edge on its own. Tiled/repeated in code along the shelf edge with varied flag colours, rather than regenerated wider |
| **Story mapping** | Lantern → Errand 1 intro beat. Bunting → after Errand 1 (patch 1). Fairy lights → after Errand 2 (patch 2). Crescent and star → end of Chapter 1. Dates → Chapter 2. Prayer mat → held back for Chapter 5, Eid morning itself, rather than used as kitchen dressing now |

