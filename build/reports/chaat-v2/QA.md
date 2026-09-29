# Chaat v2: the VISUAL-QA matrix, looked at (29 Sept)

`python3 build/shoot_chaat_v2.py --matrix`: laptop 1366×768 and phone landscape 844×390, levels 1–4 (level 2 with one deliberate wrong layer); phone portrait 390×844. Every run finished, with no console errors.

| State | Laptop | Phone landscape |
|---|---|---|
| **l1 demo-card / demo** | The ghost finger taps card row 1 (the shot catches it gliding to the bowl), taps the bowl, and the layer drops in with its word. Right. | The same. The finger ends on the ticked row, which sits in the card's second column. |
| **l1 start** | Row 1 is ticked, row 2 is grey "next", and its bowl glows (guided). There are three identical bowls, with word chips. Right. | Right. The chips are small at this size (the same as chai v2). |
| **l1 mid** | The layer settles; the word pops (e.g. *amli ji chutney*) by the rim. The drizzle reads as chutney. Right. | Right. |
| **l1 built** | Three thick layers fill about four-fifths of the glass. The tick sits bottom right. Right. | Right. |
| **l1 taste-right** | The glass slides to Nana, he leans in, then a happy face and *Shabash!* over his head. Right. | Right. |
| **l2 start** | Decoys stand on the shelf. The words still show. Right. | Right. |
| **l2 built** (wrong) | The wrong layer (e.g. *marcha*) shows in the glass, so the child can see it. Right. | Right. |
| **l2 taste-wrong** | A gentle "not quite" (arms folded, no red), and he says the order again in the sidebar bubble. Right. | Right. The bubble wraps to six lines, which is readable. |
| **l2 rebuild** | The glass is back in the middle, empty. The card starts again (its miss is kept for the review), and he waits. Right. | Right. |
| **l2 rebuilt / taste-right** | The second try is right, then *Shabash!*. The hand score is 80% and the ear is lost (first try logged). Right. | Right. |
| **l2 end** | The review shows the missed word in red and the rest in gold. | Right. |
| **l3 start / mid / built** | The chips are speaker-only, the "don't" row (*Marcha na.*) is on the card, and its item is on the shelf as a trap. Eight slots fit. Right. | Nine or ten slots fit. The chips are narrow but they don't overlap. |
| **l4 start** | The card is folded to face and headline only. Right. | Right. |
| **l4 peek** | A tap on the card opens it with a gold outline for about 3.5 s, and it costs a hint (the round's help count is 1). Right. | Right. |
| **l4 built / taste-right** | Right. | Right. |
| **portrait** | "Turn your phone sideways" (Cook is landscape only). As designed. | – |

**Not mine, seen:** in the end pop-up's word review, *amli ji chutney* spills past its card edge (js/shared/results.js).
