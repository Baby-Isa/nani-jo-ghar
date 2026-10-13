# Step 2a: target model and gap analysis

1 Oct 2026, revised after Fable's review. Read-only; no code changed.

## Produced

- `docs/architecture/target-model.md`: engine core, shared framework, content as data, modes as plug-ins; sandbox, lint, conventions.
- `docs/architecture/gap-analysis.md`: gaps with counts; 12 sessions, about 2½ weeks at one a day (55–85M tokens); minimum path 5.

## Key findings

- Star code (~480–524 lines) still sits under the badges. A daily wage takes coins away.
- Bulb, buttons, cards, game host, purse and word progress are each built twice.
- The clinic has hard-coded Kutchi.
- Ellipsis is allowed in 7 CSS rules, and the shared kit shrinks text to 8–11 px.
- `test_e2e.py` tests the bowl errand.
- The site is 2.8 GB: 1.8 GB of it is screenshots and report images.

## Decisions for Zafar

1. Approve the target model. *Yes.*
2. ES modules, no bundler, import map from `bump_version`. Needs iOS 16.4+: checked on the oldest iPad, shim as fallback. *Yes.*
3. Phaser for Cook only. *Yes.*
4. One branch, sessions one at a time. Cook goes live (gate G2) only after the doctor's visit. *Yes.*
5. Removals:
   - a. Star code: already decided.
   - b. Clinic phase 1: delete. *Yes.*
   - c. The bowl errand is a playable mechanic: retire it (git keeps it)? *Yes, unless you still use it.*
   - d. Computer voices: keep them for testing on Pages; leave them out of the store app only. *Yes.*
6. The live clinic stays untouched until after the visit. *Yes.*
7. Parked modes move when their turn comes, Find it first. *Yes.*
8. Screenshots and the site:
   - a. Stop committing screenshots and report images; keep them as release files. *Yes.*
   - b. Pages built by an Action (smaller site, extra step before live). *Only if 8a isn't enough.*
9. Pocket money comes from one data file, tuned by simulation, with no wages. *Yes.*
10. Merge the clinic's coins into the one purse. The child sees one total. *Yes, after the visit.*
11. All browser tests in Node. *Yes.*
12. The layout lint is a ratchet from today's baseline. *Yes.*

## Risks

Cook's feel, save migration (old keys kept), old iPads, cost.

## Not checked

Python tests, real devices, in-play states.
