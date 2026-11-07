# From prototype to finished game: one reference a sprint, then its family (Zafar, 2 Nov 2026)

**Why:** about 45 designed games, every one in the launch (Zafar, 2 Nov: "for now I want to work towards launching all games in the
launch"; Gujarati and feedback come in the next big phase, after the launch). Chai took about a week and six rounds of his play, and
most of its 60-odd rows were rules for every game. Those rules are now known; the rest of the games inherit them by code, not by
being rebuilt one by one (Sprint 12's lesson), and never by an unattended roll-out checked on stills (Sprint 14's lesson).
Fable reviewed the plan on 2 Nov (approve with changes: art first, a judge per strand, a Kutchi gate, Orders split in two).

## The rhythm (Zafar, 2 Nov): every sprint polishes one reference and rolls out the last one

Each sprint does two things:
- **Polish one reference game** with Zafar, until he calls it done: a nearly-done game (Cook or the clinic first), in a **different
  family** from the one being rolled out, so it is ready for the next sprint.
- **Roll out last sprint's reference to its whole family:** every game in that family, prototype or nearly done, brought to the
  reference's standard on the shared kit.

So the reference polished in sprint N is the family rolled out in sprint N+1. A family's art and words are planned while its
reference is being polished, one sprint ahead of its roll-out.

**Mum's recording sheet** (`docs/language/recording-sheet.md`): every new word goes onto it as the games are made, grouped by
family; Zafar asks for the latest version whenever he has time with her. Recording is not in step with the building (Zafar, 2 Nov).

**Art:** a first draft from ChatGPT beats a code-drawn placeholder to give feedback on, even when it changes later (Zafar, 2 Nov).
The art queue (`build/reports/art-queue.md`) always holds at least two days (about 240 images) of paste blocks (ART-35).

## The sprint chain

In `docs/sprints/plan.md` (Zafar, 2 Nov: "we'll try stick to it this time").

## The families (draft; each list is refined while its reference is polished)

| Family | Reference | The rest |
|---|---|---|
| Make in the kitchen (a recipe) (Zafar, 7 Nov; "make at the stove" until then) | chai | daar, sekelo, maani (and the rolling), chaat, chop (its own game, used by daar and chaat), samosa, eggs at breakfast, baking, the corn stall |
| Fetch and serve (someone asks, you find and give) | the pantry | serve at the fruit stall, the beach stalls, the cloth stall, Nani's picky shopping, the pharmacy belt |
| Clinic care (find the hurt, heal it) | the scrape | the knee, ear, tooth, fever, boing, eye, foot, tummy, hiccups, hair, taste; where does it hurt?, the hand splinter, the blocked nose, the drinks, mend |
| Instructions on word tiles (who gets what) | feeding time | collect the eggs, home at dusk, plant and pick, pick it up and put it back, the clean-up, the pet hotel's two, pack the bag, the presents, the birthday cake (3 Nov) |
| Find and snap | Find it or Snap (parked, nearly done) | the photo shoot, hide and seek, who's hiding?, Snap from the jeep, Snap the guests, shells, who ate the cake?, the town map |
| "Nani says, do it" | Dress up (parked, nearly done) | getting ready, musical statues (once its music is decided), pass the balloon, the wake-up clock, make, the sandcastle, Tidy up |
| Talk and pay | the conversations (live) | the café order, how are you?, pay, the fitting, the picnic |
| Rides | the car ride (live) | the ride on the water, litter fishing, the blackboard (to place) |

**The farm spans three families:** feeding, eggs, home at dusk and plant and pick are word tiles; the photo shoot is find and snap;
the corn stall is make in the kitchen.

**Make in the kitchen is every Cook game except the pantry** (Zafar, 7 Nov): the pantry stays fetch and serve's reference (its
family includes stalls outside the kitchen). Story mode and free play are ways of playing the Cook games, not games; "count to a
heard number" is its own mode outside Cook. The family's page: `docs/game-design/families/kitchen.md`.

## Once, in Sprint 17

1. **The audit:** one command plays a game at L1-L4 at the four sizes, films it, and reports against the standard (clipped text,
   overlaps, free space, the card's shape, the onboarding light, the blur rule, the leak bot, load time). Mostly existing checks,
   joined up. It closes "to fix: check" rows by script where it can; the judge looks at what it can't.
2. **The shared kit:** the spotlight bug fixed in every area's copy now; each area's copy folds into `js/shared/` in its family's
   roll-out sprint.
3. **The chai standard** (`docs/design-language/chai-standard.md`): written from chai's rows once chai is done; every rule either
   built into the kit or checked by the audit. From 7 Nov: the folder docs/design-language/standard/, in the structure Zafar
   locked on 5 Nov (`build/reports/s17-standards-structure-v2.md`), each game's gap rule by rule in `gaps/<game>.md`.

## Every family, step by step

**While its reference is polished (sprint N):**
1. **List the family:** its games, every deciding word and the earlier game that teaches it (the farm is day 2, so the kitchen, the
   ride and the bag carry its foods and animals), its art list. A word no earlier game teaches gets the general first meeting
   (SH-195, SH-196); a word a picture can't show (half, full, measures) gets a word moment (CHAI-67's system).
2. **Before any build:** the family's art block into the queue, with target sizes stated (placeholders are fitted to it, so landing
   the art changes data, not layout); its words onto Mum's sheet; the reference's design calls to Zafar as numbered decisions.
3. **The reference game:** to the standard on the kit; the audit green; the judge passes it on film before he plays.
4. **He plays the reference** → `/feedback` → fixed; he says "done". A new rule it teaches goes into the standard, the kit or a
   check, never into one game.

**The next sprint (N+1), its roll-out:**
5. **The rest of the family, by Claude:** each game moved onto the kit and the reference's standard, landed art wired, the audit
   green, the judge on each, a short film each. In the chat, or one builder per area (two at most), on his go.
6. **He plays the family in one sitting** (one play sheet of lab links) → `/feedback` → rows the same day; a second round only for
   what failed.
7. **Publish** (`/review`, `/publish`); his "done" per game.
8. **The Kutchi gate, before the stores:** a game is store-ready only when its deciding words are recorded by the family and the
   leak bot is green on them.
