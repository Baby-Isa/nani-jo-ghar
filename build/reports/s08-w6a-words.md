# s08-w6a-words

Branch `worktree-agent-a8841525b5c8945e5` (from 47458dc2).

## What changed
- **LNG-17** `js/cook/order.js`: an English join ("with", "and": WithFood/AndKind, Mum's Q5) is left out, the row said bare; a dish's second block says the engine's confirmed `ne`. `data/cook.json`: one tomato in daal and chaat until n.tomato's plural (Q14) is in the lexicon. Test: `build/core/cook-orders-kutchi.test.mjs`.
- **contract-22** `js/cook/words.js`: one rule in the speech queue: a line is not voiced again within 10 s of the child's time (Lang.hasVoice false, so callers show it silently), unless the child asked, another person reads it in the same pop-up, it is a step's call, or it never began. `js/shared/request-popup.js`: `Lifecycle.serial()`.
- **contract-23**: fixed exclamations tagged `exclaim`.
- **contract-27**: a dot group carries its words (`data-said`); the shared card shows them while it peeks.
- **contract-33** `css/shared/order-card.css`: the pop-up headline's line box holds the font (1.4), so it wraps at 42 px instead of shrinking.
- **SH-37 / CHT-15**: the stamped card keeps the stamp's room.
- **CLN-198**: BringInKind's English placeholder "Bring in the {kind}." (abstract and concrete; English only).

## Proof
- Red: s08-gate-close (82 / 14 / 6 / 2 breaks). Green, runs `w6a-g1` (1366x1024: daar, samosa, maani-line, mishkaki), `w6a-g2` (800x360 L3#hint), `w6a-g3` (1024x768): contract-22, 23, 27, 33 have no breaks; none of their sound logs has "with", "and", "tomatoes".
- `checks.mjs`: everything passes except the known CLN-198 row test.

## Open
- contract-22 lines with the role count (samosa, day6, take-back): the check should skip them, as contract-30 does (6D). Also two identical cups in the lab pop-up.
- contract-30 chaat: the chop has no card (6B). clinic:morning: 6C.
- contract-26 parked find/dress: a tap-through and English placeholders (6D).
- contract-35 against contract-27: a peeking card (6D).
- SEK-19: the code is right; the seed-1 probe orders a tomato skewer (6D).
