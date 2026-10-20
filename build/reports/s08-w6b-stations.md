# s08 wave 6B: the Cook stations' look

Builder: Opus, worktree branch `worktree-agent-ae752ec13b4835899` (base 47458dc2). Not judged by the builder.

## What changed
- **Daal** (daar.js): the rim is cut on an even ellipse (DP2's lip is 12 px thick at the top and 25 px at the bottom), and the disc reaches under it. The pouring bowl is named `daar-pour-pot`, so the pot crop takes it in whole (DAAR-29, DAAR-31).
- **Chop** (chop.js): the next wave's first throw lands on its beat; the card and line follow it (DAAR-35). A chop with no card of its own (chaat) now gets Nani's chop card, written as she says it (contract-30), with one face (contract-20).
- **Chai** (chai-tray.js, count.js): the word bubble and tally sit clear of the hob's frame, or wholly above it. One teaspoon at a time (CHAI-19, CHAI-13).
- **Samosa and the Chop tile** (samosa.js, chop.js): their art loads while the order's card is read, and samosa no longer begins twice. Both now go straight from the kitchen to the drawn game (CK-48).
- **Home** (cook.css): the days are calendar leaves with their numbers; locked days are pale and have no padlock (CK-24).
- **Tadka** (tadka.js): the card follows the level table. The order is shown quietly once the pop-up has read it (contract-35, contract-22).
- **ui.js**: an order-level marker for the checks. Step calls are logged as skipped when their step closes, and a line already said inside a longer one is skipped. Replaying a finished card says only its headline (contract-36, contract-31).

## Proof
- evidence w6b-1: DAAR-35 machine PASS. Sheets for the judge: DAAR-29, DAAR-31, CHAI-13, CK-24, SH-60.
- Evidence w6b-4 (CK-48) and w6b-2 (CHAI-19): fresh sheets for the judge.
- Sandbox runs w6b-s1 to s7, contract: samosa, daar@L3, chai, title, tadka L1 and L2, chai-tray@L3 at 844x390 and 1366x768, and chaat at 844x390. All reached the end and the contract checks are green.
- `checks.mjs`: everything passes except the known CLN-198 row test.

## Open
CHAI-08 and the real stirring teaspoon (art), SEK-20 and contract-37 (art), CK-31 (probe), SH-113 (circle size), contract-1, contract-21 (onboarding), and the contract-35 rows below. See the hand-back.
