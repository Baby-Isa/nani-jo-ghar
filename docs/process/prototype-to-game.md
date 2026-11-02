# From prototype to finished game: by family, not one by one (Zafar, 2 Nov 2026)

**Why:** about 45 designed games, every one in the launch (Zafar, 2 Nov: "for now I want to work towards launching all games in the
launch"; Gujarati and feedback come in the next big phase, after the launch). Chai took about a week and six rounds of his play, and
most of its 60-odd rows were rules for every game. Those rules are now known; the rest of the games inherit them by code, not by
being rebuilt one by one (Sprint 12's lesson), and never by an unattended roll-out checked on stills (Sprint 14's lesson).
Fable reviewed this plan on 2 Nov (approve with changes: art first, a judge per strand, a Kutchi gate, Orders split in two).

## Once, before the first batch (Sprint 17)

1. **The art queue** (`build/reports/art-queue.md`): always at least two days (about 240 images) of paste blocks ready, next first,
   so ChatGPT's 120 a day never go unused (ART-35). The first block goes out before anything else.
2. **The audit:** one command plays a game at L1-L4 at the four sizes, films it, and reports against the standard (clipped text,
   overlaps, free space, the card's shape, the onboarding light, the blur rule, the leak bot, load time). Mostly existing checks,
   joined up. It closes "to fix: check" rows by script where it can; the judge looks at what it can't.
3. **One shared game kit** in `js/shared/`: the farm's copy folds in now and the spotlight bug is fixed in every copy (Zafar,
   2 Nov); each other area's copy folds in at its batch's step 5, so a fix lands in every game.
4. **The chai standard** (`docs/design-language/chai-standard.md`): one page, written from chai's rows once chai is done; every
   rule either built into the kit or checked by the audit.

## Every batch (one family), step by step

1. **List the family:** its games, the example game, every deciding word and the earlier game that teaches it (the farm is day 2,
   so the kitchen, the ride and the bag carry its foods and animals), its art list and its recording list. A word no earlier game
   teaches gets the general first meeting (SH-195, SH-196); a word a picture can't show (half, full, measures) gets a word moment
   (CHAI-67's system).
2. **The same day, before any build:** the art block into the queue, with the target sizes stated (placeholders are fitted to it,
   so landing the art changes data, not layout); the recording list to Mum (`/mum-round`); the example's design calls to Zafar as
   numbered decisions, settled before anything is built.
3. **The example game:** on the kit, to the chai standard; the audit green; the judge passes it on film.
4. **He plays the example** → `/feedback` → fixed; he says "done". A new rule it teaches goes into the standard, the kit or a check,
   never into one game.
5. **The rest of the family, by Claude:** each game moved onto the kit and the standard, landed art and recordings wired, the audit
   green, the judge on each, a short film each. In the chat, or one builder per area (two at most), on his go.
6. **He plays the batch in one sitting** (one play sheet of lab links) → `/feedback` → rows the same day; a second round only for
   what failed.
7. **The Kutchi gate:** a game is "done" only when its deciding words are recorded by the family and the leak bot is green on them;
   until then it stays in the labs.
8. **Publish** (`/review`, `/publish`); his "done" per game.
9. **Overlap:** batch N+1's steps 1 and 2 are done before batch N's step 4, so the art and Mum's list are always ahead.

## The families (draft; each list is refined at its step 1)

| Family | Example | The rest |
|---|---|---|
| Make at the stove (a recipe, cooked) | chai (done) | daar, sekelo, maani, chaat, samosa, eggs at breakfast, baking, the cake, the corn stall |
| Fetch and serve (someone asks, you find and give) | the pantry | serve at the fruit stall, the beach stalls, the cloth stall, Nani's picky shopping |
| Instructions on word tiles (who gets what) | feeding time | collect the eggs, home at dusk, plant and pick, pick it up and put it back, the clean-up, the pet hotel's two, pack the bag, the presents |
| Find and snap | the photo shoot | hide and seek, who's hiding?, Snap from the jeep, Snap the guests, shells, who ate the cake?, the town map |
| Clinic care | the scrape | where does it hurt?, the hand splinter, the blocked nose, the drinks, mend |
| "Nani says, do it" | getting ready | musical statues (once its music is decided), pass the balloon, the wake-up clock, make, the sandcastle |
| Talk and pay | the café order | how are you?, pay, the fitting, the picnic |
| Rides | the car ride (live) | the ride on the water, litter fishing, the blackboard (to place) |

**Order of batches (proposed):** word tiles first (the farm is day 2 and its art block goes out first), then fetch and serve (the
pantry), make at the stove, clinic care, find and snap, do it, talk and pay, rides.
