# Cook UI, 28 Sept feedback: report

**Done** (every station):
- **Pop-up and card:**
  - No English instructions, no name, no badge icons, no scroll bar.
  - The headline is short at level 1 and polite from level 2 (*Tu muke … banai dinda?*).
  - Rows: word left, gold tick right. Ordered jobs get a grey "next" band and one sequence line.
  - Two skewers show as two mini cards.
- **Pantry:** everything fetched is a row. The next item glows round its own outline and bounces.
- **Nani's box** (`js/shared/guide.js`): holds the bulb and speaker. Tap it to mute her (saved).
- **Tally:** says the count and the thing (*ba dungri*). It's silent when she's muted or from level 3.
- **Word review:** centred on the page. Wrong words have a red outline and go left; right words have a gold outline and go right. Each side's width follows its word count.
- **Backgrounds:** re-encoded at q94 from the full sources. **`service.jpg` and `pantry.jpg` are only ~830 px**, so they need redrawing or upscaling.
- **Badges:** the new art shows.

**To record:**
- the pantry headline, "Bring me these for {dish}";
- Nani's 29 instructions (`cook.json` → `guide`);
- the tally's count phrases: Round 3's clips play where the phrase matches (*trae dungri*, *hakri lakri*). *hakri maani, ba maani* and the like are paired in one clip, so they need splitting; the rest are missing;
- *Tu muke {dish} banai dinda?* for dishes other than chai;
- noun genders (the tally defaults to *hakro*).

**Best screenshots** (`cook-ui-28sept/`):
- `laptop-skewers-sidebar.jpg`
- `laptop-chaat-sidebar.jpg`
- `laptop-pantry-muted-sidebar.jpg`
- `laptop-word-review-mixed.jpg`

**Tests:**
- Cook labs: laptop and flip5-landscape PASS.
- Shared: node 106/106, and both browser tests pass.
