# Clinic core: the pipeline (26 Sept 2026)

## What's built
- **`js/clinic/pipeline.js`** (pure; runs in Node too). It plans one patient's rows through the five stages, the belt's grab/handover/rows, `days.mix` mornings and the per-stage level-ups. Its data is `data/clinic/pipeline.json`, with the item aliases in `data/clinic.json`.
- **`js/clinic/stages/`**:
  - waiting room W1–W4 (W3 spoken);
  - diagnosis D1 (taught), D1b, D2, D3, with a magnifier for the face close-up;
  - the pharmacy belt: tapped at every level, a fixed-slot tray, counts and order at level 3, the belt stopper as a hint, the doctor's handover check;
  - heal, which mounts the registered game on the host with the diagnosed part and the pharmacy's tray;
  - send-off E1 (taught), E2, E3 and E4 (spoken). Sad gets "one more thing", then the sticker.
- **`js/clinic/run.js`**:
  - a patient runs through the five stages, then the shared end-of-round screen (time, accuracy, hints, then the word review);
  - a morning ends with "Close the clinic" (the receipt and coins);
  - progress (session, levels, album) is saved in `UIStore`.
- **UX**:
  - the request card opens big, is read row by row, then flies into the left sidebar;
  - one light bulb, which stays hidden through the first-ever patient;
  - the tally;
  - rows tick when a step closes, with no mid-round verdicts;
  - level 1 gets one gentle correction;
  - onboarding scripts (the ghost finger) run for each stage in the first session;
  - speaking moments go through `Say.moment`, with pills when there's no mic and a grown-up's tick with `&grandparent=1`.
- **Art**: the rough art is used for the rooms, bench people, the doctor's face and every item (through the manifest's aliases and colour variants), with greybox where a sprite is missing.

## How to play a clinic morning
Open `clinic.html`.
- **Session 1** is tiny: a girl and a boy on the bench, then D1 (three pulsing parts), one plaster on a slow belt, H2 (the scrape) and E1.
- **Session 2** has 2 patients, D2 and two items.
- **Sessions 3 and on** have 3 patients, never the same game twice. Session 3 draws from set 1; session 4 and later add set 2.

## Lab
- **`lab/clinic-core.html`** links every stage × variant × level, every healing game in the pipeline, a patient and the mornings.
- **`clinic.html?lab=1`** is the lab bar. Direct URLs:
  - `?stage=pharmacy&level=3`
  - `?stage=heal&game=ear`
  - `?patient=1&level=2`
  - `?morning=1&session=1&nosave=1`
- The phase-1 lab is now `clinic-phase1.html`.

## Leak numbers (`node build/leak_clinic.mjs`: 500 rounds per stage cell, 2000 per healing-game cell, 5000 patients)
- **Whole patient, blind:** level 1 **0.30%**, levels 2–3 0.00%. Fair play wins 100% everywhere.
- **Healing games at level 1** (worst blind strategy):

  | Game | Worst blind |
  |---|---|
  | cut | taught |
  | knee | 6.5% |
  | ear | 6.3% |
  | tooth | 4.0% |
  | taste | 9.2% |
  | fever | 5.1% |
  | boing | 0.8% |
  | eye | 1.1% |
  | foot | 7.1% |

  Tooth's "reader" wins 16% because it reads the English placeholders.
- **Single stages at level 1** are at the design's own odds: bench 1/3, D2 15%, belt 18%. D1 and E1 are taught. From level 2 they drop: belt 4%, D3 0.4%, W4 6.6%.
- **First-ever session:** 13% blind. It's onboarding, taught.
- Full data: `build/reports/clinic-core-leak.json`.

## Browser test
Run `COOK_TEST_PORT=8820 python3 build/test_clinic.py --sizes phone,ipad,laptop --mistakes`.
- **Coverage:** 29 cases per size: every variant, all nine games mounted, patients at levels 1–3, the first-ever morning; plus a set-2 morning on the laptop.
- **Result:**
  - The last full run passed at all three sizes except one case: D1b on the phone, where two probes overlapped.
  - I fixed that (one probe per body region, and decoys too close together are dropped). Afterwards D1b passed on the phone over 8 seeds, and the other diagnosis variants passed with mistakes. I didn't re-run the full suite after this fix.
- **Screenshots:** reviewed; the selection is in `build/screenshots/clinic-core/`.

## Healing games integrated
All nine kept games register and play through the pipeline:
- **Heal A:** knee, ear, tooth.
- **Heal B:** taste, fever, boing.
- **Heal C:** eye, foot.
- **Core:** cut, the reference game.

Heal C's extras (tummy, hic, hair) stay lab-only, as maybe-later.

Contract fixes on my side, all additive and noted in `docs/clinic-heal-api.md`:
- Node registration for games that only register in the browser.
- A bot's own `fair()` counts as the fair strategy.
- `opts.part` passes the diagnosed part to the game.
- The host hides its sidebar tray or its figure when a game draws its own.
- Item aliases for Cook's ids and the care-/tool- ids.
- `say.js` on the host lab page, and the sidebar dish overflow fixed.

## What's left
- **Family recordings.** Every body, kind, item and feeling word is still an English placeholder, and the read-along lights whole rows until recordings exist.
- **In the browser tests, the heal stage is ended by a test hook** (`finishHeal()`, which returns the game's fair result). The heal agents' own tests play the games.
- **Not built yet:**
  - D2's "say the part first" (S2);
  - D3's level-4 clues;
  - W4's second examination bench;
  - an album screen (the album is saved, but there's no page to view it);
  - free-play entries;
  - the story (Arc 3 Ch4).
- **Progress** uses `UIStore`, not `progress.js` word stages.
- **Version stamps:** I stamped only the clinic pages. Re-stamp every page when publishing.
