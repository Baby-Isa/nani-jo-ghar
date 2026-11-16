# SEK-25 (open) · Cook: sekelo

**Issue:** Four item cards per skewer, one per piece (Zafar, 8 Nov: "in the order card we have to have four items ... the items that go on each skewer even if it's four of the same thing and they get ticked off as you put them on ... firstly it makes you know that you've done something correct when you've put something on because otherwise you have to put four on before you even know if you're doing the right thing ... secondly it's ... consistent ... you always have four for a skewer and ... separate the names of the items that go on the skewer from the overall order ... the item you put on isn't Mishkaki the item you put on is gos like meat or it would be chicken ... the item card just say gos gos gos gos or chicken chicken chicken chicken"; "for now ... ensure that each order of a skewer just has the four individual items ... four individual ... item cards within one order")

**Check:** auto: sekelo at L1, L2, L3 and L4: four cards per skewer, each ticked within 500 ms of its piece going on

**Source:** docs/feedback/kitchen-play-2026-11-08.md P18

**Status now:** to fix: check (built: s19-clean-c, s19-round2-review 2, 5, four piece cards per skewer ticked as each goes on, stale cards on a redo fixed; contract-30 still 6 in the run; to judge) · cause: the order is one row per skewer kind (data/cook.json:2245, "ba lakri mishkaki"), a mixed skewer's pieces ticked on its row (ui.js:3713-3730); fix: four item cards per skewer named for the piece, each ticked as it goes on; the headline names the dish (its words LNG-24)

## Probes

- SEK-25-p1-L3-1280x665: cook:mishkaki-grill@L3 L3 @ 1280x665 [p-seen], at kind-timing: reached 1x (rec:kind-timing 51.1s) · sekelo's card today: a row of piece cards per mixed skewer (s19-cards), one card per plain skewer kind | waits: Sekelo's order: four item cards per skewer, one per piece, ticking as each goes on, and the headline naming the dish (its words wait on Mum, LNG-24): the counting rule and one card per thing wait on Zafar and Mum (s19-cards: out of scope)

## Panels (`build/screenshots/evidence/r16pb-cook/SEK-25.png`)

- **A**: cook:mishkaki-grill@L3 L3 1280x665 [p-seen] · kind-timing: the screen, #side outlined
- **B**: cook:mishkaki-grill@L3 L3 1280x665 [p-seen] · crop:#side at rec:kind-timing

