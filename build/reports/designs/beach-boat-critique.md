# Critique: the beach and the boat day (beach-boat.md)

Independent critic, 1 Nov 2026. Judged against the lessons checklist (1 Nov), the design method, the two research reports and the audit (31 Oct), the master map and settings map (Zafar's answers of 31 Oct and 1 Nov), `days/beach.md` and `boat.md`, and the non-negotiables. Flaws first. Nothing edited but this file.

What I checked and found sound: every Kutchi string in §1 is in `research-word-inventory-2026-10-31.csv` (nothing invented); the five prompts forbid text and name no real person; the family's rules hold (halal, modest, no sweets, the crab is never food); the two speaking moments are closed sets inside exchanges; the crab is a real, repeatable joke; piles and stacks for counts (decision 7) are a genuine fix worth taking to every game.

---

## Findings, most serious first

### 1. MUST: the picnic inverts Zafar's rule on outlined spots
- **Place:** §3.4, "The master map names this stage's leak as 'every spot outlined'. Here no spot is outlined."
- **Problem:** the map's column is *Leak and fix*; "every spot outlined" is the **fix**, not the leak. It is Zafar's own rule from pick it up and put it back (settings map §1: "the spots can be outlined"; §5.1: "outline **all** the spots, never just the right one, or it's won by elimination"), carried to the picnic. The design reads it backwards and removes every outline. Without outlines a 3-year-old has no idea where "next to her plate" or "in the middle" can land (the easy-to-play problem all over again), and the hit zones become invisible code.
- **Evidence:** `games-master-map-2026-10-31.md` Part 1, the beach table, the same wording as the pick-it-up row where it is plainly a fix; `game-settings-map-2026-10-31.md` §1 and §5.1; non-negotiable 1 (his word).
- **Change:** outline every spot on the cloth identically (each plate, each cup place, the middle, Ali's box); the owner or position word picks among identical outlines. Record it as a decision reversed.

### 2. MUST: two stall counts "stop by themselves", which the design itself calls a leak
- **Place:** §3.3a "Tap the cobs onto the grill. The count is Masi's, and the grill stops at it"; §3.3c "The straws pop in (counted along; the count stops by itself)"; the L2 ladder "Two corn with lemon".
- **Problem:** decision 7 says a count must choose something, "which makes 'tap until it stops' win". The cobs and the straws do exactly that, so the L2 claim of two words per move (count and topping) is false for the count: a child who taps until it stops never needs *ba* or *trae*. The stalls' own leak test quietly drops "count" from the deciding list ("stall, topping, size, stack") while the ladder keeps it.
- **Evidence:** lessons 4.1 ("a 'stop at N' challenge needs redesigning", E2P 4); the design's §10 decision 7.
- **Change:** counts pick a group at the stalls as they do at the shells: cobs lie in bundles of one, two and three on the cart and the bundle goes on the grill; straws come in a cup of one, two or three. Or drop counts from the stalls and change the L2 example.

### 3. MUST: "fill it" is tap-until-full
- **Place:** §3.2 step 2, "A full bucket heaps but takes no more"; the leak test, "the light never tells you when to stop".
- **Problem:** the cap tells you when to stop. A child who always taps to the cap gets every "fill it" right (a third of the asks from L2, all of them at L1), and a wrong amount is redone on the spot, so the other two amounts are found by trying. Baking's agreed rule is no fill line and no cap: the amount word says when to stop.
- **Evidence:** master map, baking row ("no fill line on the jug; the amount word says when to stop"); lessons 1.1; the design gives no bot number for the sandcastle at all (the shells and fishing have one).
- **Change:** a fifth and sixth spadeful overflow and the heap takes the bucket back (the slump), so "full" is a window the child stops in; write the sandcastle's blind-bot number (at L1 with two buckets and two towers it is near 12%, which needs the L1 allowance stated).

### 4. MUST: litter fishing's answer is the thing that doesn't move
- **Place:** §3.6 leak test, "The asked thing never drifts out of view, and the unasked ones drift past it."
- **Problem:** that is a tell. Watch for the one thing that stays put and you win by waiting. Same in the first-round script: everything else drifts, the shoe sits still.
- **Evidence:** non-negotiable 4 (waiting); lessons 4.5 "nothing leaves before it's asked for" is met the wrong way.
- **Change:** nothing drifts out of view at all (the bay is a closed pool, as the shells' sand is), or everything drifts the same gentle amount including the asked thing. The things may bob in place.

### 5. MUST: two steps have no end, and the design leaves it to the builder
- **Place:** §3.3a "dress the cob: tap a topping, then rub it along the cob" with "with lemon, no chilli"; §3.3b "a little salt, with the shaker tapped until the child stops".
- **Problem:** there is no Done (rightly), but nothing says what closes a yes-and-no toppings step or a salt amount. The step can't know the child has finished adding lemon and *not* adding chilli; the samosa's fry lift and the chai pour have a closing move, these don't. This is lessons 13.4, a design question left for the builder, on the stall's deciding move.
- **Evidence:** E2P 4; lessons 4.1 and 13.4; §4's first round skips over it ("The cob drops into a paper sleeve", with no cause).
- **Change:** name the closing move in the world for each: tap the paper sleeve to wrap the cob (closes toppings), tap the cone to hand it to Masi (closes salt). A sleeve or cone tapped before the right toppings gets Masi's line again, not a verdict.

### 6. MUST: the size and the order of work are wrong
- **Place:** §0 "Rough size: medium ... the rest are reskins and data"; §6; §7 "About 60 sprites".
- **Problem:** two of the four stages sit on greybox engines that the map says must be rebuilt onto the shared kit first: Find it (`js/find/engine.js`, shells) and Tidy's put it in its place (`js/tidy/engine.js`, the picnic). The design flags Snap's rebuild but calls these two "reskins and data". And the sprite count is understated by half or more: the fishing row alone lists nine things × two sizes × two colours (36), plus clumps, three hats, fish and the net; the shells 12 variants; the stalls three carts, three zooms, four character sheets (Masi, three stallholders) and a boatman. Zafar decides on cost, so the number matters.
- **Evidence:** master map "How to read it" (G: "moving it onto the kit is a rebuild (R7)") and Part 4.2; the camera table in §7.
- **Change:** list the Find it and put-it-in-its-place rebuilds as prerequisites (shared with the farm, the party and the town map, so the cost is shared), or build the shells on Cook's count and fetch, which are on the kit; recount the art honestly (my estimate: 120-150 sprites, five backgrounds, a three-layer road, five character sheets); call the game medium-large.

### 7. MUST: the phone layouts don't add up at 915x275
- **Place:** §7 Layout table.
- **Problem:**
  - **Fishing:** the waterline at 30% leaves about 82 px of sky to hold a boat, three faces "kept at 48 px or more" and Masi's bubble, which "goes above the sea". It can't.
  - **Stalls (wide):** three stalls with awnings and stallholders' faces, Masi and Nani cut at the chest in front of the middle and right stalls, and bubbles "in the sky above the stalls": two rows of faces in 275 px with a 55% horizon; the prompt's "every face clear of the stalls and of each other" is not achievable there.
  - **Sandcastle:** at L3 "on top" stacks three towers; a tall tower three high, a 72 px kit strip and Masi's head on the right third don't fit in 275 px. The table says "towers go up to 3 high only at L3+", which is the problem, not the fix.
  - **Shells:** the table allows 5 at L1 and up to 9 at L4, but L2's generator needs piles of one, two and three in both sizes, which is 12 shells before decoys.
- **Evidence:** lessons 6 (Zafar's Z Fold, SH-90, SH-112, SH-139: items and faces stay big; take the room from the scenery); lessons 13.3 (one size played).
- **Change:** a numbers-that-add-up layout per scene for 275 px: Masi's face in a corner on the stalls and fishing screens (as the shells already do), Nani and Masi out of the wide stalls view on phones; the fishing waterline at 40% with the boat cropped to the rail and faces; stacking capped at two high on phones (heights scaled) and the castle's horizontal layout kept; the shells' L2 counts stated and fitted, or L2 piles limited to one size at a time.

### 8. MUST: the corn stall's deciding frame has no Kutchi listed
- **Place:** §1 frames, "I want two corn, with lemon" built from "*muke* {N} {food} *khape* + {topping}"; §3.3a "with lemon", "with chilli", "no chilli"; §3.3c "with a red straw"; "Careful, it's hot" from *dhyan rakh* + *garam*.
- **Problem:** "with" and "without" are the move at the corn stall and nothing in the words table carries them (no postposition, no recorded frame); "no chilli" is presumed from *laal na* without saying so. "Careful, it's hot" is two clips glued by hand into a sentence nobody recorded, which non-negotiable 2 forbids unless the engine builds it; the hedge ("a gap is reported if it can't") is not a report. The *muke … khape* order lines are TTS placeholders today (speaking.md), not "recorded in Cook's orders".
- **Evidence:** non-negotiable 2; the inventory (`khape` only inside longer lines; no "with" row); lessons 10.1 ("list every line needed").
- **Change:** add "with X / without X / no X" and "careful, it's hot" to the gaps for Mum's beach sheet as frames, and mark the corn stall as not teaching until they land; take "recorded" off the Cook order frame.

### 9. SHOULD: the boat's speaking turn breaks the speaking ladder
- **Place:** §3.5 "the mic bubble shows two pictures ... they say one".
- **Problem:** a choice between two needs is rung 4 of the ladder; the first visit should be rung 1 (say it after the model, words shown). The "watched many times" claim rests on Nani saying *jaldi* and *aste thi* "on every earlier ride", but the ride has no Kutchi at all today (audit: "18 words, 0, and no Kutchi"); that is a change to a shared engine needing its own row and Zafar's yes. The checklist's set is 3-5; this is 2 (the eye test's *haa/na* is the precedent, so say so).
- **Evidence:** `speaking.md` ladder and "watch, handover, alone"; lessons 8; audit §1d.
- **Change:** Nani says "*jaldi!*" first and the child repeats (rung 1), or the boatman asks and the pictures come later visits; add "the ride gains Nani's speed lines in Kutchi" to the shared-engine list in §6.

### 10. SHOULD: the stall picker drops the map's leak fix
- **Place:** §3.3 flow; the queue is scenery ("Two or three beach-goers wait in a queue").
- **Problem:** the map's fix for the stalls was "two or three customers wait at once, and the one who speaks is the order". The design replaces it with Masi ordering everything plus the return ask. At L1 the third stall is a free pick and the second is one of two; each cart visibly shows its one food, so while the word is supported the stall picker is picture matching (allowed) and past support it is elimination until L2.
- **Evidence:** master map, the beach table; research-other-games §11.
- **Change:** keep Masi at L1; from L2 let the queue order too (a beach-goer says "*muke nair khape*", voiced by a family member), which also rotates who wants what (lessons 1.4) and gives the stallholders' voices a reason to exist.

### 11. SHOULD: Zafar's own lines changed without a line in §10
- **Place:** §2 bag ("the bucket, the spade, the sun hat, lemons"), home ("Ali's corn"), the sandcastle ladder.
- **Problem:** his 19 Oct list has the towel and the water bottle in the bag and "the kite from the shops hops in by itself" (a cross-day carry); the thing for Ali was "a lemon drink", now corn in a tiffin box; and his core sandcastle line, "first the big, and then the small, in the order heard", only appears at L3. At L1-L2 asks come one at a time and the lit spot gives the place, so the order is never held in the head.
- **Evidence:** `days/beach.md` rows 2, 6, 12; non-negotiable 1.
- **Change:** restore the bag list and the lemon drink for Ali (the tiffin box can carry it), keep the kite's hop; bring the two-step line to L2 (the castle grows sideways, so it is safe) and say so in §10.

### 12. SHOULD: the purse and the stall-3 say are muddled
- **Place:** §3.3 steps 3 and 6; §3.3 "The speaking moment".
- **Problem:** the child pays from Masi's purse at stalls one and two, then Masi "hands over her purse" at stall three as the handover prop; the prop has already been in the child's hands twice. And at stall three the set is *makai, chips, nair* but the cart sells only coconut: what the stallholder does on a heard "chips" is undefined, and "someone acts" is the whole point of the shared moment.
- **Evidence:** `speaking.md` handover ("a visible prop"); lessons 8.4.
- **Change:** Masi pays at stalls one and two (the child watches the stack picked, which is also the pay's watch step) and hands the purse over at three, where the child orders and pays; on a wrong hearing the stallholder looks round his cart for it, shrugs kindly, and Masi's model plays again.

### 13. SHOULD: the first visit is not tiny
- **Place:** §2 "about 15-20 minutes"; §4.
- **Problem:** the method says the first-ever session is tiny and rounds are 1-3 minutes; the first round here is four games plus door, bag, ride, meet, home and book for a 3-year-old.
- **Evidence:** `mode-design-method.md` §2 and line 255; lessons 2.1.
- **Change:** first visit = shells and the sandcastle (the crab twice, the photo for the book); the stalls and the picnic on the second beach visit, the boat on the third. The runner's list is data, so this costs nothing.

### 14. SHOULD: the recorded-word claims are generous and inconsistent
- **Place:** §1 "one, three and four ✓ in lines", "*mathe* ✓ in lines (6)", "about 20 new words", "13 of about 30".
- **Problem:** the inventory marks all five numbers in-engine-not-recorded (*hakro* and *ba* exist only inside an unlinked "hakro cup, ba cup" take); *mathe* is in-engine-not-recorded; *wadho* has no clip of its own; *chips* is "only a low-confidence take". "About 20 to record" and "13 of about 30 recorded" can't both be true of the same list, and the verbs (bring, put, give, pull) and the stallholders' three lines aren't counted.
- **Evidence:** `research-word-inventory-2026-10-31.csv` rows for one to five, on, big, chips; lessons 1.2 and 10.1.
- **Change:** one table of deciding words × "recorded alone / in a line / none", summed honestly, and Mum's beach sheet drawn from it (big, on, the numbers, chips, the price frame, with/without).

### 15. SHOULD: pay has two designs and a mismatch
- **Place:** §3.3 step 3 "stacks of one to four"; the ladder "prices to 5" at L2; §6 "If the shops build pay first, the beach uses it as is".
- **Problem:** a price of five has no stack. And the shops' pay (`count-to-a-number.md`) is coins onto the counter to a heard number, the very stop-at-N decision 7 calls a leak, yet the design says it would use it as is.
- **Change:** stacks of one to five; one pay design, with the stacks rule proposed as a numbered change to `count-to-a-number.md`, not left as either.

### 16. SHOULD: the chips zoom has nothing for the Kutchi to decide at L1
- **Place:** §3.3b.
- **Problem:** at L1 the steps are tap chips in, tap now, serve; the deciding words are "a big cone and a small one" in one line (both get filled, nothing chosen) and salt from L2. A toy with no move is the "word as a toll" fault.
- **Change:** both cones always out; L1 asks for one ("the small cone"); L2 adds the salt amount with its closing move (finding 5).

### 17. SHOULD: the coconut chop puts a machete under the child's finger
- **Place:** §3.3c "Swipe across its top. The stallholder's knife follows the swipe".
- **Problem:** the checklist's §11 says the child never holds the knife, but the child's swipe drives it; lessons 11.3 (nothing a child could copy and get hurt by) asks for Zafar's eye on this.
- **Change:** tap the coconut and the stallholder chops with a thwack; the child's gesture is the straw's push and the slurp.

### 18. SHOULD: the windbreak adds art for a reveal that can never differ
- **Place:** §3.2, decision 4.
- **Problem:** every step is corrected on the spot, so the two castles always match; the barrier game's point (compare) is gone, and what's left is Masi's duplicate castle, two windbreak states and two kneeling poses on Zafar's stage, changed without his word.
- **Change:** keep it as an option in §10 with its art cost, next to the plain version (Masi builds beside the child and the child sees nothing until the photo).

### 19. SHOULD: onboarding details against the rulebook
- **Place:** §4 shells "the box ... hug the two big shells together"; §4 stalls "The box lights all three stalls"; the scripted crab on the third ask; §3.3b "taps 'now'".
- **Problem:** one box hugs one thing (E2P: several live controls each get their own); the first-round crab under the asked shell needs a rule, not luck; "now" must be a thing (the basket handle), never a word button (non-negotiable 3).
- **Change:** say each.

### 20. SHOULD: L4 collects extras
- **Place:** the ladders: a cup mould, a pink shell, yellow coconuts, a dolphin, three hats, a cup and a mug, change from a bigger coin, owners and colours on straws.
- **Problem:** the rulebook's L4 is "one look-alike"; each extra is art and a word Mum hasn't recorded (pink, yellow, mug), and change belongs to the shops.
- **Change:** one look-alike per stage at L4; park the rest in "later visits".

### 21. SHOULD: prompt faults
- **Place:** §11.
- **Problem:** prompt 2 makes the big bucket red and the small one blue, so size and colour are confounded beside the red shells the child is learning *laal* on; prompt 3 bakes a greyed-out stall and a thumbs-up (code states) into the art and asks for two rows of faces at phone size; prompt 5 asks for three clear faces in the top third of a cutaway; prompt 3 attaches `sources/cook/nani-sheet.webp` where the art bible's locked reference is `sources/art/s08/sheet-nani-final-1.png`.
- **Change:** same-colour buckets; stalls in full colour, the greying left to code; Nani's locked sheet attached; prompt 5 with the waterline at 40%.

---

## Verdict

The design is thorough, honest about recordings, and its two best ideas (the number picks a group; the sea as a strange home for household nouns) are worth keeping. But it isn't ready for Zafar's yes. It misreads his picnic rule and removes the outlines he asked for; two of its stages are built on engines that still need rebuilding, so "medium, reskins and data" understates both cost and order; and the leak test it writes out is contradicted by its own mechanics in four places (counts that stop by themselves, a bucket that fills to a cap, the still thing in the water, steps with no close). The phone layout was reasoned at tablet size. Fix the eight MUSTs, trim L4, shorten the first visit, and the beach becomes a strong day with one new engine; the boat day then rides on it cheaply.
