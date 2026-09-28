# End-of-station pop-up and collapsing person cards: report (28 Sept)

**Done** (design system §10):
- **One pop-up card** over the dimmed game, for every Cook station and every `Results.show` caller: badges → Next → the word review in the same card (same size, surface and padding), with Again / All stations at its foot. The old "{Station}: done" card is gone. The last step is the word review with the buttons, so there are two screens, not three.
- **Speakers:** neutral charcoal on cream; gold/red only on the outlines.
- **Person cards** fold into one line (face, headline, gold check) 0.7 s after the last pill ticks. A tap re-opens one. Reduced motion is respected. Faces now stay on served cards.

**Screenshots** (`end-popup/`): `laptop-popup-1-badges.jpg`, `laptop-popup-3-actions.jpg`, `phone-popup-3-actions.jpg`, `laptop-sidebar-fold.jpg`.

**Tests:** Cook lab (laptop) PASS on all 20 stations; shared 106/106; both browser suites pass. `build/shoot_chai_station.py` still waits for the old card (left alone: it is the chai session's).
