# Sprint 14, the night of 27-28 Oct: morning report

**What Zafar asked (27 Oct, late):** "Yes to all recommendations and suggestions, go and do these fixes and anything left from the
previous sprint that makes sense to do as well." Done in the orchestrator's chat, no builders.

## Done (each one checked before moving on)

| Row | What changed | How it was checked |
|---|---|---|
| SH-151 | Every mode's fonts and text colours now come from one place, the "type" section of `css/shared/tokens.css` (display, body and drawn-word fonts; the Kutchi, text, English and three drawn-line inks). The CSS of every page and the drawn (Phaser) text of every Cook station read it (`Tokens.font`, `Tokens.cookInk`). Values are today's, so nothing looks different; the roll-out changes two lines there (the serif, the maroon). | The computed font and colour of every piece of text on 11 pages, with and without the change: identical (only the fallback list after "Nunito" differs). The drawn text's values read back equal to the old literals. 32 colour-in-code findings gone (883 -> 851). |
| SH-140 | Every face's speaker badge sits with its centre exactly on the face circle's edge, lower left, in every game. | Measured in Cook and the clinic at 740x320 and 1280x665: 0.0 px off the edge, every face. |
| CHAI-33 | The help's light round a shelf item measured a learned word's speaker-only chip as the screen's corner (Phaser gives an empty box for a container of drawings), so it stretched to the play area's edge. It now measures the chip's drawn card. | A returning-player replay (words learned, help seen): the light was 5.4 times the bottle on the old code, now hugs the bottle and its word pill. |
| CHAI-36 | No dim without its lit thing, in every game (`js/shared/onboard.js`): while a step's target isn't on screen yet, the help's layer stays clear and blocks nothing. | Onboarding tests pass; a new check (below) catches a dim with nothing lit. |
| CK-53 | Cook's ?, home and book sit behind one cog pinned at the sidebar's foot; a small row opens above it, inside the sidebar. The rail never steps into the play area; the ? never glows. | Replays of chai L1 and L3, the pantry and samosa at 740x320 and 1280x665: every cog inside the sidebar; the replay players open the cog before the ?. |
| SH-108 | Chai's wash over the marble 0.5 -> 0.18: the painted marble reads as marble. | Before and after shots. |
| CHAI-31 | The half-full glass at 0.85 of the full one (it was 0.6, paler than the pan); the pour's stream half again thicker. | Code; to see in play. |
| CLN-206 | The girl's "Thank you, I feel better!" bubble after the eye test's zoom-out: the line is still to record, so it ended at once and the results covered it in 0.1 s; now it stays 2.4 s. | Replay timeline: her bubble, then the results 0.5 s later at test speed (2.4 s at a child's pace). |

## The checks that would have caught last sprint's misses (SH-138)

- **Four new contract checks**, run on every replayed page: contract-51 every word inside its card (settled, visible, lasting
  spills only), contract-52 a bubble keeps faces and the side panel clear, contract-53 the help's light holds one thing (and never
  dims with nothing lit), contract-54 the ?, home, book and cog stay in the sidebar. Tests in `build/sandbox/contract-sh138.test.mjs`.
- **Proof they work:** on last night's code they flagged exactly Zafar's screenshots: the light 5.4 times the bottle, the three
  buttons outside the sidebar; on the eye test, the doctor's bubble over the girl's face (43% of her head) and "tameto", "dungri",
  "mirchi" off the eye-chart card.
- **A returning player** in the replays (`#returning`: help seen, words learned) for chai and the chai tray at L1 and L3.
- **The four edge sizes** are every tool's default (740x320, 930x430, 1280x665, 1920x1080).
- **The lab check** (`build/tools/review/labcheck.mjs`): a lab page at the four sizes, screenshots, page errors, every word that
  leaves its card, a contact sheet; a fixture proves it catches a spill.

## Found tonight, left for the day (not changed)

- **The pantry's help light** boxes the whole fridge shelf (4.4 times the milk carton at 740x320): the same "just around the
  picture" rule; it goes with the onboarding roll-out.
- **The eye test:** the doctor's bubble over the girl and the eye-chart words off the card: the bubble placement (SH-145) and the
  new word card (SH-142, SH-147).
- **SH-135, the door's pills:** they are the kit's own pills with no style of their own, so the judge's "translucent cream-green"
  was likely a frame mid-fade or under the help's dim: to re-shoot, not to change. **SH-137's square face tile:** the clinic draws
  the kit's round face (the badge measured on its edge); also to re-shoot.

## The final replay (`s14-night`)

The 37 main flows, plus chai and the chai tray as a returning player (L1, L3) and chai L3's hint player, at all four sizes:
**168 pages, every one reached its end.** Page errors: only first launch's three "view transition aborted", the same three as before
tonight's changes. Contract: 69 breaks, all the new checks finding problems that were already there (none caused tonight):

- contract-52 (27): bubbles over faces: Cook's customers and the eye test's doctor (SH-145, CK-18: the free-space placement).
- contract-53 (17): the help's light too big in daar, samosa, the grill and the pantry (the chai one is fixed): the onboarding
  roll-out ("just around the picture").
- contract-51 (15): long words leaving their card: chop's and the eye test's word cards ("tameto", "dungri", "mirchi"), a headline
  in chaat and samosa (SH-142: the new card).
- contract-35 and 37 (4 each), returning player only: at L3 the chai tray writes item words a returning player has learned, and
  its spice round has 2 decoys where the level table wants 3: two rules gaps the new replay exposed; for the rulebook.
- contract-1 (1): daar's order pop-up missed once; replayed, it does not come back (a timing one-off).

The replay's baseline now holds the four sizes (368 findings added, nothing else touched). The quick checks are green (unit,
static, words, leak, docs, fix list, bump, specs, recordings, size).

## Not published

Tonight's changes are on the branch (`ccr-dfbb763e-fd6lh9`), not on `main`: they change the game itself, and Zafar's yes was to
the fixes, not to publishing them. One word from him publishes them (the publish gate needs `--force`: the sprint's rows are open).

## Proof

- The final replay: `build/screenshots/sandbox/s14-night/` (`summary.md`, `contract.md`); the run log's last line: 168 pages, 0 not
  reaching their end, 69 contract breaks (listed above).
- The font repoint: `fonts-before` and `fonts-after` replays (8 flows at 1280x665 and 740x320), and the computed-style comparison
  of 11 pages with and without the change (identical but the fallback list after "Nunito").
- CHAI-33 and the new checks: `ret-old` (the old chai code: the light 5.4 times the bottle, three buttons outside the sidebar) and
  `ret-new3` (fixed); the cog: `cog2` (10 pages, no button outside the sidebar); the thank-you bubble: `eye`.
- The lab check: `build/screenshots/labcheck/cards/` (12 shots, nothing spills) and `build/screenshots/labcheck/fixture/` (the
  fixture's "tameto" caught 33 px outside its card).
- Tests: `node --test build/sandbox/contract-sh138.test.mjs` (5 pass); `checks.mjs` unit 570 pass with the quick checks green.
