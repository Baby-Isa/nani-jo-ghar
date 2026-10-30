# s14-clinic: the heal games on the s14 kit and Zafar's numbers (30 Oct, Opus)

## What changed
- **Numbers** (CLN-207 to 215): every heal game draws x + y from `data/rules.json` through new readers `Rules.xy / draw / span`
  (`HealScene.count`); the tooth's and scrape's data copies removed. Eye cards 4-7 and drops 2-5; fever 2/4/6/8; boing L4,
  dispensers (tubes not in play frosted); foot one dirt patch per jug, each pour clears one; spoons counted from L1.
- **Kit:** the light's s14 look for the whole heal round; the doctor's box is the helper card (arrow, no bulb); s14 order card,
  pop-out and eye card (SH-137, contract-51); bubbles off her face (contract-52); skip zones; level-up via `Rules.advance`.
- **CLN-205:** one taught judged card, a forced misread. **Tooth:** first fill holds mid-green (timed-hold notes).

## Shared files
`request-popup.js` (narrower wrap, then slide off a face), `word-card.js` + `word-card.css` (s14 card hush/lit), `rules.js`
(readers). Flows: every heal game `@L4`; `labs.html` regenerated.

## Proof
After: `build/screenshots/brief/s14-clinic/` (before beside it). Contract `s14-clinic-contract`: CONTRACT_LINE.
Checks: all green but **leak** (7: L1 first/middle-option 10-35%: Zafar's narrower L1 ranges; fever L1's 2 exchanges).
Tests: `counts.test.mjs` (nine games, every level), `levelup.test.mjs`.

## Open / gaps
Foot L4's 4th splinter (a 4th toe channel and word); sore spots L3-L4 pop 2 not 3 (a 4th colour's spot); the word pill and the
cog (the clinic has no home/book; the "?" stays); s14 still plays the ghost hand for drags (Zafar?); order rows clip
("paani garam, hakro ju", also before). Fresh: cut@L4 stuck at 930/1920 (also before); fever@L4 1280 stuck once (rerun passed).
CLN-210's fill strip "did not change" (also before).
