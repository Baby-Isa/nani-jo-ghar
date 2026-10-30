# s14-clinic: the heal games on the s14 kit, Zafar's numbers (30 Oct, Opus)

## What changed
- **Numbers** (CLN-207 to 215): every heal game draws x + y from `data/rules.json` (new readers `Rules.xy / draw / span`,
  `HealScene.count`); the tooth's and scrape's data copies gone. Eye cards 4-7, drops 2-5; fever 2/4/6/8; boing L4 and
  dispensers (other tubes frosted); foot one dirt patch per jug, each pour clears one; spoons counted from L1.
- **Kit:** the s14 light for the whole heal round; the doctor's box is the helper card (arrow, no bulb); s14 order card,
  pop-out and eye card (SH-137, contract-51); bubbles off her face (contract-52); skip zones; level-up via `Rules.advance`.
- **CLN-205:** one taught judged card, a forced misread. **Tooth:** the first fill holds mid-green (timed-hold notes).

## Shared files
`request-popup.js` (narrower wrap, then slide off a face), `word-card.js/.css` (s14 card hush, lit), `rules.js` (readers).
Every heal game has an `@L4` flow; `labs.html` regenerated.

## Proof
After: `build/screenshots/brief/s14-clinic/` (before beside it). Contract `s14-clinic-contract2`, 40 pages, all ended:
**CONTRACT FAILED: 1 breaks (contract-78 1)**: chai at 1920, "Slow kar!" light 261 ms late (chai-tray.js; passed in run 1).
Clinic: 0. Checks green but **leak** (7: L1 first/middle-option 10-35%, Zafar's narrower L1 ranges; fever L1's 2
exchanges). Tests: `counts.test.mjs`, `levelup.test.mjs`.

## Open
Foot L4's 4th splinter (needs a 4th toe channel and word); sore spots L3-L4 pop 2 not 3 (needs a 4th colour's spot); the
word pill and the cog (the clinic has no home or book; the "?" stays); s14 still plays the ghost hand for drags (Zafar?);
order rows clip ("paani garam, hakro ju", also before). Fresh player: cut@L4 stuck at 930/1920 (also before); fever@L4 1280
stuck once (rerun passed); CLN-210's fill strip "did not change" (also before); taste L2 reads two rows at once (contract-8).
