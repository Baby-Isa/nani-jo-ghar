judge: claude-fable-5-2, eye-judge subagent, session_014xb3kQPhiJXAHjeT4WMdGS (not the builder; pictures and rubric only)

## Flaws, most serious first

1. An arrow flashes on the pastry just before the fold's light. `740x320/strip-cook-samosa-speed1-02-rung.png` (+50 ms), `740x320/strip-cook-samosa-speed1-03-light.png` (+43 ms) and `1280x665/strip-cook-samosa-speed1-02-light.png` (+75 ms) each show a white arrow across the mince for one frame, then the dim and gold box, then a finger from about +890 ms. Chai's lights are the dim and the gold box only (`1280x665/strip-chai-02-light.png`, `strip-chai-06-light.png`); the rubric allows a finger for a drag, never an arrow.
2. No thank-you at the serve. `1280x665/pair-5-serve.png` and `740x320/pair-5-serve.png`: chai has Nana's "Thank you!" bubble over him; samosa at the same moment has the samosas on the tray and no bubble, at both sizes. (If the bubble comes later, the capture landed off it; as pictured it is missing.)
3. The count label sits on top of the board and pastry. `1280x665/pair-3-kind.png`: the "hakro chundo" pill covers the board's top-left corner and the first pastry strip. The "samosa" pill does the same on the board's top edge (`740x320/strip-cook-samosa-speed1-04-rung.png`, -500 ms). Chai's label ("paani", "hakro") floats in clear marble above the hob (`1280x665/pair-4-mid.png`).
4. Nana's big praise face covers the skimmer. `1280x665/pair-6-praise.png` and `740x320/pair-6-praise.png`: the face circle sits over the slotted spoon's head; at 740 the "Shabash!" bubble also ends a few pixels from the gear button. Chai's face sits on the corner of its own tray, touching nothing else.
5. The folded pastry reads as a flat cut-out, not a picture. `740x320/strip-cook-samosa-speed1-02-rung.png` (+1401 to +1939 ms) and `1280x665/strip-cook-samosa-speed1-02-light.png` (+1917 ms): after the fold the sheet is a hard-edged trapezoid with a small flap, the mince half off its edge (`1280x665/pair-4-mid.png`). Chai's pot at the same stage is a full picture for each state (water, tea, milk, boil).
6. The fry-stage tray has things with no pills, and leaves unexplained empties. `1280x665/strip-cook-samosa-speed1-03-light.png` and `740x320/strip-cook-samosa-speed1-06-light.png`: the two raw samosas on copper dishes carry no pill; once fried, two empty copper dishes stay on the tray through "well done" (`1280x665/pair-6-praise.png`). Chai's shelf keeps every item with its pill to the end.
7. The order card is one stretched card. `1280x665/close-1-order.png`, `740x320/close-1-order.png`: "ba chunda" is a wide banner filling the panel, where chai shows upright cards, two and a half in view. It is the same card type, but not the same shape as chai's or as the 2.5-card rule.
8. The samosas change vessel between the cook and the serve. `1280x665/pair-6-praise.png` (on the plate with the napkin) against `1280x665/pair-5-serve.png` (bare on the wooden tray). Chai's glass is on the same tray in both.
9. Nani's line is two colours and reads stitched. `740x320/close-2-light.png`: "Bhar, chunde" in maroon, "sathe." in black, with a comma mid-line; chai's "Paani tapele me wij." is one colour and one sentence. Whether it is natural Kutchi is Mum's call, not mine.
10. At 740 the timing rings on the samosas in the oil are very small (`740x320/strip-cook-samosa-speed1-07-light.png`, +832 ms on); chai's ring runs round the whole pot (`740x320/pair-4-mid.png`). Present and on the thing, but hard to read on a phone.

Seen, not judged (code's): the order card's "ba chunda" shows no tick in `1280x665/pair-4-mid.png` with both minces placed (Q13 is contract-18/-108); the take-out call with no light is Part 1's contract-78.

EVIDENCE notes for the tool (not flaws of the game): no picture of the take-out or plating step, a flip, the helper card, or a card's pop-out; no mistake was played; `740x320/pair-3-kind.png` is the same frame as `pair-2-light.png` for both games (the first move was not caught at 740).

## Rubric

Q1 | FAIL: 740x320/strip-cook-samosa-speed1-02-rung.png (+50 ms) and 1280x665/strip-cook-samosa-speed1-02-light.png (+75 ms), a white arrow on the pastry before the box and finger; chai has box and dim only
Q2 | pass
Q4 | pass
Q5 | can't tell
Q6 | can't tell
Q7 | pass
Q8 | can't tell
Q9 | pass
Q10 | pass
Q12 | FAIL: 1280x665/close-1-order.png, one stretched banner card where chai shows 2.5 upright cards
Q14 | can't tell
Q16 | pass
Q17 | FAIL: 1280x665/pair-3-kind.png, "hakro chundo" pill over the board and pastry; 1280x665/pair-6-praise.png, the praise face over the skimmer
Q18 | pass
Q19 | pass
Q20 | pass
Q22 | pass
Q23 | can't tell
Q24 | pass
Q25 | pass
Q26 | pass
Q27 | FAIL: 740x320/strip-cook-samosa-speed1-02-rung.png (+1401 to +1939 ms), the folded pastry is a hard-edged flat cut-out
Q28 | pass
Q29 | pass
Q30 | can't tell
Q31 | pass
Q32 | FAIL: 1280x665/pair-5-serve.png and 740x320/pair-5-serve.png, no thank-you bubble where chai has one
Q33 | pass
Q34 | pass
Q35 | can't tell
Q36 | pass
Q37 | can't tell
Q39 | pass
Q40 | pass
Q41 | pass
Q42 | can't tell
Q38 | FAIL: 1280x665/pair-3-kind.png and 1280x665/pair-4-mid.png, the fill-and-fold stage (label over the board, arrow flash, cut-out pastry) is below chai's finish

SHIP? | no: the arrow flashing before the fold's light, no thank-you at the serve, the count label over the board and pastry, the praise face over the skimmer, the cut-out look of the folded pastry (plus Part 1's take-out call with no light)
WORSE THAN CHAI? | the first move (label over the board); mid-cook (arrow before the fold's light, cut-out pastry, tiny rings at 740); the serve (no thank-you, samosas off their plate); well done (face over the skimmer, empty unlabelled dishes on the tray); the order (one stretched card)
