# Zafar's feedback, 13 Oct 2026 (mid Sprint 5), from a phone screenshot

Source: a screenshot of the branch build at 09:34 UK (sekelo, level 2, the order card on a portrait phone, about 390 wide) and his message. Two points, both about the shared order card, plus a question asked back.

## §1 Mechanics changed, old art reused
None.

## §2 Points
| # | His words | Screen | Cause (checked) | Fix | Row |
|---|---|---|---|---|---|
| Z1 | "those words are never going to fit nicely side by side I think they need to stack vertically" | sekelo L2, the mixed skewer's group box: four pills in a row, each word broken over three lines ("mis/hka/ki", "du/ngr/i", "ta/me/to") | The shared order card's group box (S05-S, `group: true`, the little skewer) lays pills in one row whatever the width; pills shrink and the words break inside them | Stack a group's pills vertically when they don't fit on one line; never break a word (shared order card, every game) | SH-73 (new, shared) |
| Z2 | "there's two highlighted items, both in different colours, which I've reported before as a bug - only one thing should be highlighted at once and all highlighted items should be the same colour" | the same card: the first pill of the mixed skewer is lit grey and the "hakri lakri dungri" row below is lit beige, at the same time | Two highlights from two sources: the group box's current-piece tint and the next-row tint, each with its own colour; contract-8 checks only the stage's glows | One highlight at a time on the card and the stage together, one colour token (the shared focal glow) | SH-53 (reopened) |
| Q | "Let me see these end screen steps to decide if they need a tap or not" | the results card | — | Screenshots sent (SH-44 probe ev-20261013-084122-im3) | SH-44, his call |

## §4 Coverage
Every line of the message maps to Z1, Z2 or Q. Two points, quoted verbatim in the rows.

## §5 Why Z2 came back
SH-53 was marked built from contract-8, which measures glows drawn on the stage only; the card's row tint and the group box's pill tint are not glows to it, so two lit things in two colours passed. The fix adds the card to the check.
