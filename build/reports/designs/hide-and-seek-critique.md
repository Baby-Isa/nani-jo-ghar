# Critique: Hide and seek, find Simba and Zazu (1 Nov 2026)

Independent read of `build/reports/designs/hide-and-seek.md` against the lessons checklist, the design method, the two 31 Oct research reports, the audit, the two maps, the rulebook and CLAUDE.md. I also checked the word inventory, `data/rules.json`, `data/lang/abstract.json`, `docs/game-design/cast.md`, the art bible and `js/shared/` for the claims the design makes. Flaws first, most serious at the top. **MUST** means it blocks the design going to Zafar as written; **SHOULD** means fix it before the brief.

---

## 1. MUST: a child with no Kutchi levels up by fishing

**Place:** §3 M1 leak table ("Eliminating"), §6 "The rules" (level-up after 3 rounds with at most one hint), §9 row 9, §10 decision 5.

**Problem:** the design closes elimination with two tools: the badge counts only first-open finds, and from L2 the cat slips after two empty opens. Neither stops the round or the level. "A find always ticks (you can't refuse a cat)", the slip gives a fresh ask, and the rulebook's level-up counts only the guide's hint. A child who taps places quickly never idles long enough for the hint, finds every cat eventually, finishes three rounds, and goes up to L3 and L4 having never understood a place word. The badge is "not a verdict", so it costs them nothing.

**Evidence:** rulebook §1 "Moving up a level: up after 3 finished rounds at a level where the guide's hint came at most once a round"; design §6 repeats it unchanged; checklist §1 "Ticks mustn't let a child fish… Tick only the right item, first go" [C1017 P62-63]; checklist §9 "Rules are coded, not just written".

**Change:** keep the tick (the cat is found) but make the level rest on the finds: up after 3 rounds where every find was first-open (or at most one wasn't) and the hint came at most once. Write it as override 3 in §10, since it departs from the rulebook, and put the number in `data/rules.json` for the leak bot to read.

## 2. MUST: the card's place picture at L2 is a matching leak, and the design says two different things about it

**Place:** §3 M1 leak table ("Matching"), the level ladder (L2 row says only "no glow, English dotted"; L3 row says "picture blurred once a word is past support"), M2 "Instruction" (two rows, each with the cat's face and its place), §4 step 5.

**Problem:** the leak table says the picture shows "only while that word is on its ladder", but the ladder table and M2 show the place picture on the card at L2 with no condition, and the rulebook (Zafar, 29 Oct) shows the card picture at L1-L2 and blurs it from L3 (`data/rules.json` `cardPicture: [true, true, false, false]`). Under the rulebook's rule, every L2 search is picture-to-scene matching among seven places: a 100% win with no Kutchi, and the design's "under 10% at every level" claim fails at L2. The games map already notes this for the clean-up: "the order card's picture at L1 only".

**Evidence:** research-other-games §3 "The 'it glows' support is fine at level 1 only" and lesson 6 ("the hints that guide play are leaks for us"); checklist §1 "Show a need the picture can't settle"; the rulebook's word ladder governs the Kutchi text under an item, not the card's picture, so the design's "picture by the ladder" is a new rule, not the rulebook's.

**Change:** pick one rule and write it once: the place picture on the card at L1 only, speaker and Kutchi from L2 (the faces may stay, as the design argues). Record it in §10 as an override of the rulebook's L2 picture. Make §3, §4 and M2 agree with it.

## 3. MUST: Mum's recording list is undercounted, and the first visit cannot play on Kutchi until it is done

**Place:** §1 ("about 20 new words, inside the template's 15-25"; "Mum's first job: the eight place words, then the frames"), §9 row 10.

**Problem:** the real list for the first visit as designed is closer to 45-50 clips: 8 places (1 recorded), 5 verbs (0), 3 positions (heard inside lines only), "cat", "eyes", the numbers 1-10 (0 of 10 have a clip: audit flaw 4), "close your eyes / open your eyes", "not here!", the door line, "Simba took Nana's glasses" plus four item names, Nana's two lines, "close the ___", "find ___", and about 12 frames the engine must build from pieces it doesn't yet have recorded. Until the places are recorded, the ask is grey-italic English spoken by the device, which is the dastarkhwan leak (95-100% for a reader) and may never be in a store build (non-negotiable 2). The design admits "the game counts as teaching only once its eight place words are recorded", but nowhere gives Zafar the minimum set or the total.

**Evidence:** `research-word-inventory-2026-10-31.csv`: cupboard *kabaat* recorded alone; wardrobe, bed, curtain, box, basket, blanket, cat, find, open, close, hide, think: no Kutchi; numbers 1 and 5 heard only inside lines; checklist §10 "Mum's voice is the budget: build from recorded frames and list every line needed"; audit §1 "the bots treat English placeholders as if they were Kutchi".

**Change:** add a table "What Mum records for L1 to play" with a count, ordered by what unblocks play: the five L1 places, "look" (*nar*), "close your eyes / open your eyes", one to five, "close the ___", and the door line. Reuse what exists to shorten it: *na* ✓ ("No.") with Nani's laugh for the empty spot instead of a new "not here!"; *huda* ✓ and *shabash* ✓ at the find (already used); *kida ai* ✓ for the ask. Defer to a later visit what L1 doesn't need: the mischief items' names (or let the item drop silently and be named in pick it up, where its word decides), "cat", "hide", "think", "know", and the count to ten. State plainly: nothing ships until these are recorded, and the leak bot has nothing to measure until then.

## 4. MUST: Nana leans round the door that is also a hiding place

**Place:** §1 (door: "behind the door", L2 on), §3 level ladder L2 (+ behind the door), M6 ("Nana's head appears round the bedroom door", every round at L2), §7 layout ("Nana: in the doorway at the right of the room"), prompt hide-and-seek-2.

**Problem:** at L2 the door becomes a hiding place in the same level that Nana starts appearing in the doorway every round. Either the door is ajar with Nana in it (so it is visibly not a hiding place, and the closed-places rule "nothing about a closed place may hint at what's inside" breaks) or it must close behind him and reopen as an openable, which is a muddle for a four-year-old and a leak: a cat "behind the door" that Nana was just standing in. Prompt 2 bakes the muddle into the mock-up (door ajar, Nana in it, "seven hiding places").

**Evidence:** the design's own rule (§7, places "nothing about a closed place may hint"); decision 20 already reserves "a chest of drawers' bottom drawer" as a spare place.

**Change:** drop the door as a hiding place for the bedroom and use the drawer (decision 20's spare) at L2, or move Nana to the window (he looks in from the garden, which the pigeon beat already uses). Fix prompt 2 to match.

## 5. MUST: prompt hide-and-seek-2 asks for a muddled screen

**Place:** §11, prompt 2.

**Problem:** it shows two places open at once (the box with the sock *and* the curtain with the pigeon), Nana pointing from the doorway, and Nani laughing: three jokes and two faces in one 2.3:1 frame "shown about 320 pixels tall". The game never shows two surprises at once (empty places close themselves after their joke; one tap at a time). ChatGPT will produce a busy picture that Zafar then approves as the look.

**Evidence:** the design's own M1 rule (one empty spot's joke, then it closes); art bible §1 "never clutter"; checklist §7 "plain scenes, calm faces".

**Change:** one surprise per mock-up. Prompt 2 becomes: the box open with the sock, everything else closed, Nani on the right. Nana gets his own small prompt (head round the window or door frame, pointing) as a character study, not a gameplay frame.

## 6. SHOULD: the first round is about 25 seconds of watching before the first tap

**Place:** §4 steps 1-6.

**Problem:** door line, camera glide, two seconds of calm, a five-place tour with a glow each (about 10 s), the count to five with dim and sounds (about 8 s), then the ask and the card, then the first live tap. For a four-year-old that is a long time to do nothing, and the count's "close your eyes" asks them to look away from the screen they are learning to use.

**Evidence:** checklist §2 "lose them by confusion, not by boredom" [K1001 §8D] and §12 "the hands have something to do at every step"; research-other-games §3: 4-year-olds "often gave up early".

**Change:** first tap within 10 s. Make the tour tappable (Nani names a place, it glows, the child taps it, it bounces: tap-then-tap, hands busy, nothing opens yet), and at the first round only, skip the count (Simba simply walks into the dark and the light returns), with the full count from round two once the open has been seen.

## 7. SHOULD: the count is a wait, its numbers have no clips, and it adds a hold gesture

**Place:** §3 M5, §10 decision 8.

**Problem:** five to ten seconds a round of nothing to do; the numbers Nani counts have no family clip (0 of 10), so today the count is device speech; and "hold a finger on Nani's hands-over-eyes pose" is a hold, a third gesture.

**Evidence:** audit flaw 4 and §5 ("numbers are over-served… no number has a clip"); checklist §2 "Tap, then tap"; checklist §4 "never make them wait".

**Change:** the child taps Nani's covered eyes once per number and she says that number (Cook's count pattern, so the hands drive it and a quick child isn't bored); no hold. Count to five at every level until the numbers are recorded; ten is a later-visit change in data.

## 8. SHOULD: the hint rules are three different stories

**Place:** §3 M1 leak table ("Waiting"), §4 step 6 ("after 5 s Nani says the ask again, after 7 s the bulb throbs"), §9 row 4 ("hints at 7/9/11/13 s"), §6 ("level-up with at most one hint").

**Problem:** the rulebook's 7/9/11/13 s is the guide's hint, which counts for level-up; the bulb tap is the helper card, which costs a bulb; a 5 s repeat is easy-to-play's older rung. The design uses all three without saying which one "the hint" in the level-up rule is, and in M1 the bulb throbs "from the last tap", which a fisher resets every second.

**Evidence:** rulebook §1 "The guide's hint" and "The helper card"; checklist §13 "Help too early".

**Change:** one paragraph: the free repeat of the ask (every 5 s idle, no cost); the guide's hint (the bulb throb at 7/9/11/13 s from the last action, counts for level-up); the helper card (a bulb tap lights the place, costs a bulb). State that "last action" means the last ask, not the last tap, so fishing doesn't reset it.

## 9. SHOULD: phone layout is asserted, not checked, and the panel's rows won't fit

**Place:** §7 layout; M2 instruction; §4 step 5.

**Problem:** at 740x320 the panel is about 163 px wide; a card row with a cat's face, a place picture, the Kutchi and dotted English is already four things wide, and §4's L1 card shows "Kutchi (grey-italic English until Mum records 'wardrobe')" *and* "the English under it": two lines of English in a 163 px row. Five places in one row across about 450 px gives roughly 80 px each; a bed side-on and a tall wardrobe both at 80 px wide look nothing like themselves. At L4, nine places in two rows at 275 px tall, with Nani's bust (30% of height, 83 px) on the right and "bubbles in free space above the places" when the ceiling has been cropped away, has no free space. 930x430 is not placed (`data/layout.json` makes it a phone: short side under 500). The order card today has one face per card (`js/shared/order-card.js`), not a face per row.

**Evidence:** non-negotiable 6 (no clipped or ellipsised text); checklist §6 (five sizes, nothing over a face, bubbles never over the panel); checklist §13 "Playing one level, one round or one size".

**Change:** the lab page before the art run (the fast lane), with placeholder boxes at the five sizes and every level, screenshot by script; the panel row mocked at 740 with its longest Kutchi and dotted English; two layouts by height with the switch height named; the M2 row (face per row) sent to the shared-layer owner as a change to `order-card.js`.

## 10. SHOULD: the first visit is too big for a game the research sized "small"

**Place:** §0 ("small to medium"), §3 (seven mechanics kept in the first visit), §7 (9 places x 2 states, about 24 cat poses, 4 Nani, 2 Nana, 8 surprises, 4 mischief items), §6 (two new shared pieces, a side-panel tray, a lab page, a leak bot), M6 (a speaking moment with a Nana voice still unassigned).

**Problem:** that is a sprint of art, a shared-layer change, a new speaking exchange and a carry into a game that doesn't exist yet, before Zafar has played one round. The audit and research both size it as a reskin of Find it's openables.

**Evidence:** research-other-games §3 "Size: a reskin of Find it's openables. Small"; CLAUDE.md "Keep it small"; checklist §13 "Design questions left open for the builder" (the Nana voice is one).

**Change:** split the first visit into 1a and 1b. 1a: L1-L2, M1, M2, M3 (the "yes" close), M5, M8 with the thing dropping silently; five places plus the L2 pair (7 x 2 states), about 8 cat poses each, 2 Nani poses, 5 surprises, no Nana. 1b (after his play): L3-L4, M4, M6 with Nana, the look-alike pairs, the rest of the poses. Decision 10 (Ask Nana) and open question 1 move to 1b.

## 11. SHOULD: reuse missed

**Place:** §6.

**Problem:** the Nani-Nana exchange and every bubble are Conversations' job (`js/shared/conversations.js`: `Conversations.bubble` is "THE speech bubble for a line in every game", and `run` is for scripted two-person beats); the design routes them through `say.js` and `speech.js` only. `js/shared/whichone.js` already has the decoy rule, `blindOdds` and `estimate` for a leak bot, so a new "leak bot" is a reskin of it, not a new piece. `js/shared/rel.js` is the relations checker for in/under/behind. The clinic's `lift` (lift one named thing) is the nearest built openable.

**Evidence:** audit §5 ("Overlaps: one job done many times… each built it on their own engine"); checklist §13 "An 'everywhere' rule fixed in one game only"; non-negotiable 6.

**Change:** name them in §6: Conversations for the exchange and the bubbles, WhichOne for the bot and the decoy check, rel.js for the positions, `lift` as the openable's starting point.

## 12. SHOULD: the lying clue is cut, not offered

**Place:** §3 M9, §10 decision 11.

**Problem:** Find it 4d's point, and the audit's fold for library L3, is "a clue that can lie" (a bell, paw prints that point to a cat, not always the right one). The design keeps only an after-the-find route replay, citing the research. But the research's fix for a visible clue is "either show nothing, or add decoy 'tails'": a clue that lies *is* the decoy-tails option, and it is leak-proof because it can't be trusted. Zafar agreed the fold list with that mechanic in it (31 Oct, answer 3).

**Evidence:** research-other-games §3 "Where it leaks"; audit §4 rows for 4d and L3; non-negotiable 1.

**Change:** keep decision 11 but offer it as a numbered choice with both options: (a) no clue before the find, or (b) a bell or prints at L3-L4 that are right half the time, so the word still decides. Recommend (a) for 1a and (b) as a 1b test.

## 13. SHOULD: prompt 3 shows a peeking kitten, and the prompts attach the placeholder Nani

**Place:** §11, prompts 1-4.

**Problem:** prompt 3 asks for Zazu peeking "from under the edge of the lifted bed cover, about to be found next": a cat showing before it is found is the exact picture the design forbids, and Zafar will approve what lands. All four prompts attach `sources/cook/nani-sheet.webp`, which the art bible calls "a generated placeholder… not Nani's identity", while §7 says Nani's poses are built from the locked sheet `sources/art/s08/sheet-nani-final-1.png`. The bible's lock also says a plain red dupatta and no rings; the prompts say "deep red headscarf", which is fine, but the locked sheet should be the reference. No prompt names a real person, and all forbid text: good.

**Evidence:** art bible §1 "The real people, locked (Zafar, 16 Oct)"; design §7 "Nothing about a closed place may hint at what's inside".

**Change:** prompt 3: the bed cover closed, Zazu not visible. All prompts: attach `sheet-nani-final-1.png` and the lineup, keep `nani-sheet.webp` only as a render-style reference, as the bible's table says.

## 14. SHOULD: the leak maths is a little generous

**Place:** §3 M1 ("1 in 7 at L2 and 1 in 9 at L4"), M2.

**Problem:** at L2 both cats are hidden, so a random first open hits a cat 2 in 7 (the wrong one makes it bolt, but the child has learned a place); after each find its place stays open and empty, so the third search at L2 is among 5 closed places, and the fourth at L4 among 6. The three-search round still comes out well under 10%, but the numbers in the text are not the ones the bot will print, and Zafar reads these as promises.

**Change:** recompute with both cats and the shrinking pool, or just say "under 2% a round at L2, under 1% at L4, by the bot".

## 15. SHOULD: the words are served twice at the end

**Place:** §4 steps 12 and 13.

**Problem:** step 12 ends with "the word card for the round's words, each with its speaker"; step 13's page 2 is "the words, Kutchi with English for the grown-up and a tap to hear each". Same thing, twice, after the cuddle.

**Evidence:** checklist §5 "Use the shared two-page end screen"; §4 "No Next and no Done".

**Change:** the cuddle, then the shared two-page end screen only.

## 16. SHOULD: Ask Nana's closed set varies only a name

**Place:** M6.

**Problem:** the two pills are "Where's Simba?" and "Where's Zazu?": the Kutchi (*kida ai*) is identical in both, so the recogniser tests a proper noun, and the "speaking bonus" rewards saying a cat's name. It is a fair starter rung, but the design calls it "the only mechanic in the game where the child asks".

**Change:** say so plainly, and at L4 (or 1b) let the ask vary in Kutchi: "Where's the big one? / the small one?" (*wadho*, *nindho* ✓), which also uses L3's names for the cats.

## 17. SHOULD: small things

- §1 marks *andar* "inside lines (7)" and *me* "in engine": the ask uses *me*; say which the engine will say for "in the wardrobe", since Mum's recorded frames use *me* (*e rasore me ai*).
- `docs/game-design/cast.md` gives both cats green eyes in its table (rows 23-24, 147) and Zazu "yellow-green" in the photo notes; the design follows the photo notes. Fine, but the prompts should cite the cast doc so ChatGPT isn't the authority.
- The "for later" tray in the side panel is a new shared element; it belongs to the shared-layer owner, not `js/hide/`.
- The method's output is a section in `docs/game-design/modes/<mode>.md`; this lives in `build/reports/designs/`. Fine for an overnight proposal; say where it goes once Zafar says yes.
- Nothing in the design contradicts Zafar's stated words (5 places at L1, the glow at first, open it and the cats are there or not, the day's order, the fold list, know/think/find in Nani's lines). The two rulebook overrides are recorded; findings 1 and 2 add a third and a fourth that must be.

---

## Verdict

The core is right and it is the strongest fun case in the plan: one tap, a reveal that reacts, cats that move, jokes in the empty spots, and a word that genuinely decides from L2. The leak reasoning is better than most of our designs, and the ten questions are answered. But as written it is not leak-proof in play: a child can fish through every level because the level ladder ignores the finds (1), and L2 is a picture-match under the rulebook's own card rule (2). It also undersells what Mum has to record before a single Kutchi round exists (3), puts Nana in a hiding place (4), and hands Zafar a mock-up prompt that will come back cluttered (5). Fix those five, trim the first visit to L1-L2 without Nana (10), and run the lab page at the five sizes before any art (9); then it is ready for his numbered choices. The rest are polish.
