# From prototype to finished game: by family, not one by one (Zafar, 2 Nov 2026)

**Why:** about 45 designed games, every one in the launch (Zafar, 2 Nov: "for now I want to work towards launching all games in the
launch"; Gujarati and feedback come in the next big phase, after the launch). Chai took about a week and six rounds of his play, and
most of its 60-odd rows were rules for every game. Those rules are now known; the rest of the games inherit them by code, not by
being rebuilt one by one (Sprint 12's lesson), and never by an unattended roll-out checked on stills (Sprint 14's lesson).

## Once, before the first batch (Sprint 17)

1. **The chai standard** (`docs/design-language/chai-standard.md`): one page, every rule chai earned, each one either built into the
   shared kit or checked automatically. Chai is the north star; the page is how a game shows it meets it.
2. **The audit:** one command plays a game at L1-L4 at the four sizes, films it, and reports against the standard (clipped text,
   overlaps, free space, the card's shape, the onboarding light, the blur rule, the leak bot, load time). Mostly existing checks,
   joined up.
3. **One shared game kit** in `js/shared/`: the farm's copy folds in now and the spotlight bug is fixed in every copy (Zafar,
   2 Nov); each other area's copy folds in at its batch's step 6, so a fix lands in every game.
4. **The art queue** (`build/reports/art-queue.md`): always at least two days (about 240 images) of paste blocks ready, next first,
   so ChatGPT's 120 a day never go unused (ART-35).

## Every batch (one family), step by step

1. **List the family:** its games, the example game, and every deciding word. For each word, the earlier game that teaches it (the
   farm is day 2, so the kitchen, the ride and the bag carry its foods and animals). A word no earlier game teaches gets the general
   first meeting (SH-195, SH-196); a word a picture can't show (half, full, measures) gets a word moment (CHAI-67's system).
2. **The art block goes into the queue the same day** (from each game's report art list and the example's needs), before any
   build. Zafar runs it whenever ChatGPT has images free; placeholders already sit at the final art's size and place, so landing it
   changes data, not layout.
3. **Mum's recording list** for the family's words (`/mum-round`), sent at the same time as the art.
4. **The example game, with Zafar:** its design calls as numbered decisions first; then built to the chai standard on the shared
   kit; the audit green; the judge passes it; a short film.
5. **He plays the example** → `/feedback` → fixed; he says "done". Any new rule it teaches goes into the standard, the kit or a
   check, never into one game.
6. **The rest of the family, by Claude:** each game moved onto the kit and the standard, landed art wired, the audit green, the
   judge on each, a short film each. In the chat, or one builder per area (two at most), on his go.
7. **He plays the batch in one sitting** (one play sheet of lab links) → `/feedback` → rows the same day; a second round only for
   what failed.
8. **Publish** (`/review`, `/publish`); his "done" per game.
9. **Meanwhile:** while he plays batch N, batch N+1's art block and recording list are already in the queue.

## The families (draft; each list is refined at its step 1)

| Family | Example | The rest |
|---|---|---|
| Orders (someone asks, you make or fetch) | chai (done) | the pantry, daar, sekelo, maani, chaat, samosa, eggs at breakfast, baking, the corn stall, the café, serve at the fruit stall, the beach stalls, the cloth stall, the cake |
| Instructions on word tiles (who gets what) | feeding time | collect the eggs, home at dusk, plant and pick, pick it up and put it back, the clean-up, the pet hotel's two, pack the bag, the presents |
| Find and snap | the photo shoot | hide and seek, who's hiding?, Snap from the jeep, Snap the guests, shells, who ate the cake?, the town map |
| Clinic care | the scrape | where does it hurt?, the hand splinter, the blocked nose, the drinks, mend |
| "Nani says, do it" | musical statues | getting ready, pass the balloon, the wake-up clock, make, the sandcastle |
| Talk and pay | the café order | how are you?, pay, Nani's picky shopping, the fitting, the picnic |
| Rides | the car ride (live) | the ride on the water, litter fishing, the blackboard (to place) |

**Order of batches (proposed):** word tiles first (the farm is day 2 and its three games are already being made art-ready), then the
rest of the orders (the pantry starts in Sprint 17), then clinic care, find and snap, do it, talk and pay, rides.
