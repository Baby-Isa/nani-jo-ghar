# Order model (§12): report (29 Sept)

**Done:**
- **Shared component:** `js/shared/order-card.js` + `css/shared/order-card.css`, drawing person → items → parts. API in `docs/shared-api.md` §14, ready for the clinic and Find it. Lab: `lab/order-card.html`.
- **Cook uses it everywhere:** the sidebar and the request pop-up, at every station.
  - A single chai puts its parts straight under the headline.
  - The same mix twice is one row (*ba lakri mixed*); different items are separate, tinted rows.
  - No pips or digits.
  - A finished item folds to a gold line; a finished person folds to face + headline + ✓.
  - The pop-up is flat: no yellow box and no grey boxes.
- **Two different mixed skewers** (level 4, new). Mixes are now 4 pieces: the old generator made 3, which a 4-piece skewer could never match.
- **Phone:** long part lists take two columns, so the order fits.

**Screenshots** (`order-model/`): `laptop-mishkaki-popup.jpg`, `phone-mishkaki-sidebar.jpg`, `laptop-fold-sidebar.jpg`, `laptop-chai-popup-tray.jpg`.

**Tests:**
- Cook lab (laptop): PASS.
- Shared: 112/112 pass. Both browser suites pass.
- `--orders`: count-leak checks are 0%. Its 3 pantry-headline assertions also fail on the base commit.
