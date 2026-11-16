judge: claude-fable-5-2 (Fable 5.2), session_014xb3kQPhiJXAHjeT4WMdGS, eye judge standing in for Zafar; pictures only

## Flaws, most serious first

1. Two chapatis ordered, one shown served. `1280x665/pair-5-serve.png` and `740x320/pair-5-serve.png`: the tray holds one plate with one maani under "Thank you!", though the card says "ba maani / two chapatis". `1280x665/pair-6-praise.png` and `740x320/pair-6-praise.png`: "Shabash!" over one filled plate while the second plate, also Nana's, is empty. Chai serves exactly what its card asked (one glass for "hakri chai") and its tray has no empty slot owned by the asker. If the second maani is stacked under the first, the picture does not show it.
2. The first-time light flickers. `1280x665/strip-cook-maani-line-speed1-01-light.png`: dim and gold box on from +296 ms, the dim and the box gone at +1219 to +1439 ms (only a glow left on the pile), then back at +1524 ms. Same at `740x320/strip-cook-maani-line-speed1-01-light.png` (+1429 to +1539 ms). Chai holds one steady dim from +177 to +1869 ms and lifts it once (`1280x665/strip-chai-02-light.png`).
3. Nani's box does not show the step now while the maani cooks. `1280x665/strip-cook-maani-line-speed1-03-rung.png` (-500 to +122 ms): her box still says "Take a dough ball." while a maani is on the tawa with its ring running; at +1229 ms it changes to "Roll it round." while the ring runs again. Chai's box always names the one thing in hand ("Chulo bar!" at `1280x665/pair-4-mid.png`).
4. Two things move at once after the flip light. `1280x665/strip-cook-maani-line-speed1-03-rung.png` +836 to +1042 ms: the spatula flips the maani while a new dough ball flies from the pile to the board and a "maani" pill pops in above the board in one frame (absent at +736, whole at +836). Chai moves one thing at a time and nothing pops in.
5. An empty white box sits in the order card while the item pops out. `1280x665/pair-1-order.png` and `1280x665/close-1-order.png`: a blank dashed-edge placeholder the size of the card row under "Muke maani khapeti.". Chai's order card is only its one line until the cards fly in (same pictures, left).
6. The order line differs between the bubble and the panel. `1280x665/pair-1-order.png`: the bubble reads "Muke ba maani khapeti." and the panel "Muke maani khapeti."; the amount is only on the card. Chai's bubble and panel carry the same sentence.
7. No progress shows on the order card. `1280x665/pair-4-mid.png` and `1280x665/close-4-mid.png`: one maani is already on a plate and the card "ba maani" looks as it did at the start; chai's cards tick as each is reached (same picture, left). (The tick's timing is code's; the look of an unchanged card mid-round is what I flag.)
8. The single item card is stretched across the panel with a small picture in a wide band (`1280x665/close-4-mid.png`, `740x320/close-2-light.png`); chai's cards are the narrow kit card. Minor.
9. The two shelf pills are uneven: "maani" is a wide white pill, "bajr ji maani" a smaller one with visibly smaller words at 740 (`740x320/pair-2-light.png`). Chai's pills are one size. Minor; sizes are code's.

Not flaws: every one of Nani's lines in maani is grey-italic English ("Take a dough ball.", "Roll it round.") : allowed until recorded (decision 84), but only "Firai!" and "Shabash!" are Kutchi, so Q35 cannot be judged on Kutchi. The stone tray as bottom row is allowed (Zafar, 9 Nov).

EVIDENCE notes for the tool: `pair-3-kind.png` is the same frame as `pair-2-light.png` at both sizes (for chai too), so "the first move" was not captured. `strip-cook-maani-line-speed1-02-light.png` (both sizes) shows no dim, box or finger at any frame: the roll's light is not in the strip (the pin is already moving at -500 ms). `strip-...-03-rung.png` and `strip-...-04-light.png` are the same moment 5 ms apart. The helper card (Q14), the second plate's light (Q6) and a mistake (Q30) were never reached.

## Rubric

Q1 | FAIL: 1280x665/strip-cook-maani-line-speed1-01-light.png, the dim and gold box drop out at +1219 to +1439 ms and come back; chai's stays on
Q2 | pass
Q4 | pass
Q5 | can't tell
Q6 | can't tell
Q7 | FAIL: 1280x665/strip-cook-maani-line-speed1-03-rung.png, "Take a dough ball." stays up while the maani cooks on the tawa
Q8 | pass
Q9 | FAIL: 1280x665/pair-1-order.png, bubble "Muke ba maani khapeti." against panel "Muke maani khapeti."
Q10 | pass
Q12 | FAIL: 1280x665/close-1-order.png, an empty placeholder box in the order card; the lone card is stretched wide
Q14 | can't tell
Q16 | pass
Q17 | pass
Q18 | FAIL: 740x320/pair-2-light.png, the two pills differ in size and word size
Q19 | pass
Q20 | pass
Q22 | pass
Q23 | pass
Q24 | pass
Q25 | pass
Q26 | pass
Q27 | pass
Q28 | pass
Q29 | pass
Q30 | can't tell
Q31 | FAIL: 1280x665/pair-5-serve.png, one maani on the tray for an order of two
Q32 | FAIL: 1280x665/pair-6-praise.png, "Shabash!" with Nana's second plate empty
Q33 | can't tell
Q34 | pass
Q35 | can't tell
Q36 | pass
Q37 | FAIL: 1280x665/pair-1-order.png, "ba" (two) gets no word moment of its own; it shows only inside "ba maani" with one chapati pictured
Q39 | pass
Q40 | FAIL: 1280x665/strip-cook-maani-line-speed1-03-rung.png, a dough ball flies and a pill pops in while the flip plays (+836 ms)
Q41 | FAIL: 1280x665/strip-cook-maani-line-speed1-03-rung.png, the "maani" pill above the board appears in one step at +836 ms
Q42 | can't tell
Q38 | FAIL: 1280x665/pair-5-serve.png, one chapati served for two, and a flickering first light
SHIP? | no: one maani shown served and praised for an order of two; the first-time light flickers off and on; Nani's box is stale while the tawa cooks; a ball flies and a pill pops in during the flip; an empty box in the order card; bubble and panel order lines differ
WORSE THAN CHAI? | the order (empty box, mismatched line), the first light (flicker), mid-cook (stale Nani line, no progress on the card, two things moving at once), the serve and well done (one of two shown, an empty plate)
