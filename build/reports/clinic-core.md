# Clinic core: the pipeline (26 Sept 2026)

## Built
- `js/clinic/pipeline.js` (pure, Node too) plans a patient's rows, the belt's handover, `days.mix` mornings and per-stage level-ups, from `data/clinic/pipeline.json`.
- `js/clinic/stages/`: waiting W1–W4 (W3 spoken); diagnosis D1 (taught), D1b, D2, D3, with a face magnifier; the belt (tapped at every level, fixed-slot tray, the doctor's handover); heal (mounts the registered game); send-off E1–E4 (E3/E4 spoken).
- `js/clinic/run.js`: each patient ends on the shared end-of-round screen; a morning ends with "Close the clinic".
- UX: the request card flies into the sidebar; auto-ticks, no verdicts; one level-1 correction; first-session onboarding; `Say` pills (`&grandparent=1` for the tick); the rough art throughout.

## Play
`clinic.html`. Session 1 is one patient (bench of two, D1, one plaster, the scrape, E1). Session 2 has two patients. Sessions 3+ have three: set 1, then set 2 from session 4.

## Lab
- `lab/clinic-core.html` links every stage × variant × level and every game in the pipeline.
- `clinic.html?lab=1` is the lab bar; direct URLs like `?stage=heal&game=ear` and `?morning=1&session=1&nosave=1`.
- The phase-1 lab is `clinic-phase1.html`.

## Leak (`node build/leak_clinic.mjs`)
- Whole patient, blind: L1 **0.30%** over 5000 patients; L2–L3 0%. Fair play: 100%.
- L1 healing games, worst blind over 2000 rounds: cut taught, knee 6.5%, ear 6.3%, tooth 4.0%, taste 9.2%, fever 5.1%, boing 0.8%, eye 1.1%, foot 7.1%. Tooth's placeholder reader wins 16%.
- Single stages at L1 sit at the design's odds (bench 33%, D2 15%, belt 18%), then drop from L2.
- First-ever session: 13% blind (taught).
- Data: `build/reports/clinic-core-leak.json`.

## Browser
`COOK_TEST_PORT=8820 python3 build/test_clinic.py --sizes phone,ipad,laptop --mistakes`: 29 cases per size. The last full run passed except D1b on the phone (two probes overlapped). After the fix, D1b passed over 8 seeds; I didn't re-run the full suite. Screenshots: `build/screenshots/clinic-core/`.

## Games integrated
All nine: knee, ear, tooth (A); taste, fever, boing (B); eye, foot (C); cut (core). C's extras stay lab-only.

My additive fixes (listed in `docs/clinic-heal-api.md`):
- Node registration.
- A bot's own `fair()`.
- `opts.part`.
- The host hides its tray or figure when a game draws its own.
- Item aliases, `say.js` on the host page, the dish overflow.

## Left
- Family recordings (all words are English placeholders).
- Heal is test-ended by `finishHeal()`.
- Not built: S2, D3 clues, W4's second bench, the album screen, free play, the story.
- Progress is saved in `UIStore`, not `progress.js`.
- Only the clinic pages are version-stamped.
