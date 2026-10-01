# Step 2a: target model and gap analysis

1 Oct 2026. Read-only; no code changed.

## Produced

- `docs/architecture/target-model.md` describes four layers:
  - the **engine core**: language, voice, word progress, save, score and pocket money, story log;
  - the **shared framework**: tokens, frame, UI kit, one mini-game host;
  - **content as data**;
  - **modes as plug-ins**, with one interface.

  Also the sandbox, layout lint and conventions; the engine sits in `js/core/lang/`.
- `docs/architecture/gap-analysis.md`: gaps with counts; an 11-session plan (59–77 h, ~53–82M tokens; minimum path 25–33 h).

## Key findings

- **Stars:** star code still runs under the badges (524 lines, 50 files). A daily wage takes coins away (`js/cook/flow.js:574`).
- **Built twice:** bulb, buttons, cards, game host, purse, word progress. Six voice players. The clinic records no word progress.
- **Kutchi in clinic code:** four number tables, 50 joins and 79 literals.
- **Clipping:** six ellipsis rules; `fit.js` shrinks to 12 px; guide buttons 26 px; 391 CSS colours.
- **Dead code:** 4,873 legacy lines; 231 computer-voice files ship; `test_e2e.py` tests the bowl errand.
- **Size:** Pages publishes 2.7 GB; GitHub's limit is 1 GB.

## Decisions for Zafar

1. Approve the target model. *Yes.*
2. ES modules, no bundler, converted page by page; `bump_version` writes an import map. *Yes.*
3. Phaser for Cook only. *Yes.*
4. One branch, sessions one at a time (R0–R7), three merge gates you play. *Yes.*
5. Delete the bowl errand, clinic phase 1, the stars, Cook's hands and knead, and the shipped computer voices. Git keeps them under a tag. *Yes.*
6. The clinic stays untouched on `main` until after the doctor's visit. *Yes.*
7. Parked modes move "when their turn comes" (Find it first) and stay frozen until then. *Yes.*
8. Stop committing screenshots; Pages publishes only the game files. *Yes.*
9. Pocket money comes from one data file tuned by simulated play, with no wages. *Yes.*
10. All browser tests in Node. *Yes.*
11. The layout lint works as a ratchet from today's baseline. *Yes.*

## Risks

- Cook may feel different; bots play every station before and after, and you play it at the gate.
- A save migration could lose progress; the old keys are kept.
- Import maps need iOS 16.4 or later.
- Token cost.

## Not checked

Python tests (no Python Playwright here), real devices, whether hands still show, in-play states.
