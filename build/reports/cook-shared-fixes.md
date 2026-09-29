# Cook shared fixes (29 Sept play-test, step 2)

Branch `claude/nifty-rubin-c0d431`. Source: `docs/feedback/cook-playtest-2026-09-29.md` (items X, P, S, K, D, T and §10, Zafar's answers). Shots: `build/reports/cook-shared-fixes/` (`iter/` while iterating; the final VISUAL-QA §5 set in the folder itself).

## 1. Mechanics changed, and old art reused (read this first)

**Mechanics changed:**
- **None removed or replaced.** Every station plays as before.
- **Content changes, as asked** (not mechanics, but they change what an order can contain):
  - **S18:** a samosa order always has its base filling (the first kind: chundo, or bataato) at least one spoon (`minFirst` on the tally). "Two samosas, three chillies" can no longer happen.
  - **K4:** a sekelo order no longer asks for a bare *boga* skewer. A vegetable skewer is now one named vegetable (*hakri lakri dungri*, *ba lakri tameto*: new skewer kinds `only:veg-02` / `only:veg-03` in `data/stations/mishkaki-grill.json`, judged by `Cook.Skewer.classify`) or a mixed one with its pieces in order, as before. From level 3 at least one skewer is mixed (two at level 4). The all-vegetable `ph-veg` kind still exists, so an unasked-for vegetable skewer is still recognised (and is wrong).
  - **Q6:** in story mode (`playDay`, not free play or the lab), the first chai, daar, chaat and samosa of each day now starts with a pantry trip for that dish's things. This is the existing pantry round, with a fixed list per dish (`data.recipes.pantry.forDish`).
  - **D9:** daar's chopped rows go back to "to do" at the start of the pot phase and tick again when the katori tips in.
  - **X12 / Q7:** at level 1 the counting is heard as you add in daar's chop and samosa's fill (the word pop says "ba dungri" instead of "dungri"). The shared tally now speaks at level 1 only; chai's sugar keeps level 2 as well.
- **Old art reused:** none by me. (The face crops come from the existing character art; see the helper's section below.)
- **Second session (X4, X10, X11), mechanics changed: none removed or replaced.**
  - The review's *look* changed as Zafar asked (Q1): the half-body person sliding in (chaat, daar, samosa) and sekelo's small face are gone, and with them the dish sliding over to the person and the "lean in and taste". What happens after the verdict is unchanged: right → the end screen; wrong → the card marks the row, they say their order again, the dish goes back and the child redoes it (at most three tries in daar and samosa, as before).
  - Chai and maani gained the review face (they had nothing). It adds no new outcome: chai's wrong glass still gets its person's recast, and maani's end is unchanged.
  - Samosa's first-time coach is no longer switched off (it used to kill the fry script), and daar's tadka and stir have one. The coach only shows moves; it changes no rule.
- **Old art reused (second session):** all the faces are the existing character art re-cropped (`sources/art/characters/char-*-expressions-v1.png`, `char-nani-v2.png`). Happy is the expressions sheet's panel 3 (the old "happy" head); frown is row 3 panel 2 (a gentle worried frown, from the same sheets, used for the first time). **Nani has one face only** (her v2 sheet), so her happy and frown are her neutral until the ChatGPT face sheets come; she's never a customer, so no review shows her.

## 2. Items

| Item | | What was done |
|---|---|---|
| **X1** the spoken order | ✅ | See §3. One sentence per person, in card order. The kind of dish goes in the headline where Mum's pattern exists: chai's *Muke aadu waari chai khape.* (the extra is the top card row), and maani's *Muke ba bajr ji maani khape.* The rest follow as bare words. The join word is an English placeholder, **"with"** (maani's second kind: **"and"**), grey and flagged "to record", with no *Ne* chaining. `Cook.Order.sentence` is the one builder, used by the order, the card's own speaker, the chai tray's person lines, and samosa/daar/chaat's repeats. |
| **P4** read in card order | ✅ | The pantry list keeps its drawn order (no second shuffle), so the card, Nani's list and the fetch run top to bottom alike. |
| **X2** read-along underline | ✅ | Every spoken line shows as its parts, and each part gets the gold underline while it's said: Nani's box (her lines and her replay), the speech card (the chai tray's person lines), the caption, and the pill's own speaker. The pop-up already read along (headline underline, rows gold-edged); unchanged. `UI.speakAlong` / `UI.raHtml`. |
| **X3** speaker tappable | ✅ | The speaker badge now takes taps (`pointer-events: auto`), and a margin (`::after`) extends the face button past the badge: sidebar cards, pop-up, Nani's box (`.face-say`, `.oc-face`). The Phaser faces on the hob aren't replay buttons (tapping them selects the pan), so there was nothing to extend there. |
| **X4 / Q12** face badges | ✅ | See §4. |
| **X10 / Q1** one review, big round face | ✅ | See §4. |
| **X11** coach for every phase, plus a check | ✅ | See §4. |
| **X12 / Q7** counting rule | ✅ (partly) | For the stations the rule covers (`countRule`: daar, chaat, samosa, maani, sekelo), card rows write the Kutchi quantity at levels 1–2 and drop it from level 3 (heard in the order only). Daar's rows now carry their counts (*ba dungri*, T1); chaat's chopped layers say theirs (*ba bataato*). Counting is heard as you add at level 1 (daar chop, samosa fill, the tally). Chai unchanged (its sugar tally stays). **Not done:** at level 3+ maani's headline (*Muke ba bajr ji maani khape.*) and samosa's still show their count, because the headline is the spoken line itself. Zafar to decide. |
| **X6** heat gauge | ✅ | `Cook.Kit.heatRing`: 1.5× thicker (10 → 15 px by default, the stations' own widths scaled too), on a dark brown track with a dark edge. |
| **X7** shelf padding | ✅ (chai, maani) | One rule in `station-lib.js` (`St.shelfFit`, `St.shelfItemTop`): the gap above the tallest item equals the gap below the chips (17 px), with the bounce and a little glow taken off first. Chai's jar groups are scaled to fit (the water bottle no longer pops out). Maani's dough plates moved down to the same line. Other stations weren't commented on, so they're untouched. |
| **P1** one speech queue | ✅ | `UI.queueSpeech`: the counting voice, Nani's lines (`UI.voice`) and the speech card (`UI.say`) wait for each other, the count first. |
| **P2** done outline clipped | ✅ | The gold ring (and the read-along ring) is inset, so the card's clipped body can't cut it. |
| **P3** "Bring me these" clipped | ✅ | The to-record headline uses the same fit-and-wrap as the sidebar headline. |
| **Q6** pantry first | ✅ | Story mode only; see §1. |
| **S18** samosa base | ✅ | See §1. |
| **K1** *sekelo* | ✅ | New word `ph-sekelo` (*sekelo*, a draft: Zafar's word, to confirm with Mum) is the dish's name and its order word. *mishkaki* stays the meat cubes. |
| **K4** veg skewers | ✅ | See §1. |
| **D9** daar untick | ✅ | See §1. |
| **T1** chaat quantities | ✅ | See X12. |

## 3. What the orders say now (examples from the probe)
- **Chai** (at the tray, per person): *Muke aadu waari chai khape, with dudh, trae khun.* / *Muke kari chai khape, dudh na, with hakro khun.* / *Muke chai khape, with dudh, ba khun, adh.*
- **Maani:** *Muke hakri bajr ji maani khape.* / *Muke ba bajr ji maani khape, and hakri maani.*
- **Samosa:** *Muke ba samosa khape, with ba chundo, hakro marcha.* / *Muke trae samosa khape, dungri na, with ba bataato, trae chundo.*
- **Daar:** *Muke daar khape, with ba dungri, hakro tameto.*
- **Sekelo:** *Muke sekelo khape, with hakri lakri gos, hakri lakri mixed. Pela mishkaki. Ne poi dungri. Ne poi mishkaki. Ne poi tameto.*
- **Chaat** (a sequence keeps *Pela … Ne poi …*, the listening mechanic): *Muke chaat khape. Pela ba bataato. Ne poi chana. Ne poi sev.*
- **Pantry** (its headline is still to record): *Muke dudh de. Ne atto. Ne khun.*, in card order.

A "no" row is said in its place on the card in Mum's form (*dudh na*), so its position still says nothing (the leak rule).

## 4. X4, X10, X11 (the second session)

**X4 / Q12, the faces.** `build/cut_characters.py --badges-only` re-crops Nani, Nana, Ma and Ali from the existing sheets, framed by the eyes: the eye line at 45 % of the square, the eyes 25 % of its width apart, and half the head's tilt levelled (Nani's is 18°). Nani's glasses sit wide, so her face read small when matched by the eyes; she's 10 % bigger. Three moods each: `assets/cook/characters/<who>-face.webp` (neutral), `-face-happy`, `-face-frown`. Old v new: `cook-shared-fixes/faces-old-vs-new.png` (left column the old badge, then neutral, happy, frown; the red line is the eye line).
- **The old `<who>-badge.webp` files are untouched**: the other games (dress, snap, find, monsoon, the story) use them, and Zafar didn't comment on those. Only Cook moved to the new faces (`Cook.facePath(who, mood)`; Phaser `Cook.Kit.faceArt(who)` / `Cook.Kit.badge(S, who, mood)`). If he wants them everywhere, it's a one-line change per game.
- **The ChatGPT face sheets drop in** as three `SPEC[who]["badge-<mood>"]` entries (sheet, box, eye centres) in `cut_characters.py`; rerun it and every Cook face and review changes. Nothing in the game code changes.
- Not changed: Cook's cover button (`app.js`, Nani's old badge), because it's the start screen, not a face in the kitchen.

**X10 / Q1, the review.** One shared component, `Cook.Kit.review(S, {who, ok, x, y, size})` in `kitchen-kit.js`: their face on a white disc (the badge look, 256 px), popping up over the dish. Right: the happy face, a hop, sparkles and the praise card (*Shabash!*, the "welldone" line, spoken). Wrong: the frown and a small shake of the head, then the station does what it did before. Where it sits:
- **Daar:** over the bowl of daar, praise to the right (it covered the pot on the left).
- **Samosa:** over the plate of samosas.
- **Chaat:** over the glass, praise to the right.
- **Sekelo:** over the plate (replacing the small face at the top).
- **Chai (new):** at the tick, one face over each person's glass (sized to the tray's spacing); the praise is said once, when every glass is right. A wrong glass's face frowns while its person says their order again (the recast, as before).
- **Maani (new):** at the tick, one face over the finished plates; happy when every count is right.
- **Pantry:** none (no customer).

**X11, the coach.**
- **Samosa:** new script `data.onboard.samosa` (fill: spoon, spoon, the tick; fold: three folds). The fry's script (`data.onboard.fry`) already existed but was switched off by `Coach.stop(true)` straight after the fry began; that's gone. The early stop before the art loads is now `stop(false)` (not "seen"), so the fill's own start shows it.
- **Daar:** new script `data.onboard["daar-cook"]` (the spices, the stir, the tick), started with the new `St.coach(ctx, key)` after the chop (the pot phase runs in the same view, so its `begin` couldn't).
- **The check:** `node build/check_onboard.mjs`. Every station's phases are listed in `data.onboard._phases`; it fails when a phase has no script, a step isn't a move the coach can show, the code starts a phase with no script (`St.begin`/`St.coach` literals in `js/cook`), or a station calls `Coach.stop(true)` without its own demo in its place (chaat's own finger demo is allowed by its comment). Run against the old samosa it fails three times (lines 131, 153, 163); now it passes.

## 5. Sentences for Mum to record (Q5)
Please record each as a whole sentence. The words in brackets are what the game says now as English placeholders.
1. *Muke aadu waari chai khape* **[with]** *dudh, ba khun.* How do you say "with" here? Does it change for a plural (samosas)?
2. *Muke kari chai khape, ba khun.*
3. *Muke hakri bajr ji maani khape.*
4. *Muke ba bajr ji maani khape* **[and]** *hakri maani.* (Or *Muke hakri maani ne ba bajr ji maani khape*?)
5. *Muke ba samosa khape* **[with]** *ba chundo, trae marcha.*
6. *Muke ba samosa khape* **[with]** *ba bataato, dungri na.*
7. *Muke sekelo khape* **[with]** *hakri lakri gos, hakri lakri mixed.* Also *hakri lakri dungri* (an onion skewer): is that how you'd say it?
8. *Muke daar khape* **[with]** *ba dungri, hakro tameto.* / *Muke daar khape, dungri na.*
9. "Bring me these" (Nani's pantry list headline), and "Bring me these for chai".
10. *Muke {x} waari chai khape* as one sentence (the game puts Mum's *aadu waari chai* inside *Muke … khape*; it's marked draft).
11. *sekelo* itself (Zafar's word for the dish, K1).

## 6. Tests (29 Sept, second session, laptop 1366×768)
- `node build/check_onboard.mjs` (new): **ok**, 7 stations, 10 phases, 7 phase starts in the code, every one scripted. Against the old `samosa.js` it fails with 3 problems (its `Coach.stop(true)` lines), as it should.
- `node build/test_shared_order_card.mjs` 7/7, `test_shared_ui.mjs` 8/8, `test_shared_compat.mjs` 5/5: **pass**.
- `build/test_cook.py --lab --viewport laptop`, split with `--stations` (it runs past 20 min in one go):
  - fetch, chai-tray, maani-line, mishkaki-grill, daar: **PASS** (68 shots, 1058 s);
  - chop … flip (11 stations): every station played with no failure, but the run hit its 20-minute `timeout` at the end of `flip` (the shot scripts were running on the other lock, which slowed it), so it has no PASS line. Its last five (fill, fry, thread, grill, roll-tawa) were run again on their own: **PASS** (54 shots, 396 s);
  - after the last layout changes (chai and maani face placement, the view clamp), chai-tray, maani-line, assemble, mishkaki-grill: **PASS** (61 shots, 645 s), and samosa, daar: **PASS** (64 shots, 823 s). These runs went through real wrong dishes (a chaat in the wrong order, one maani too many, a dark samosa, one onion too many), so the frown, the marked row and the redo ran for real, not only in the forced shots.
- `build/test_cook.py --days 1 --canvas --viewport laptop`: **PASS** (41 shots, 121 s).

## 7. Shots and flaws (VISUAL-QA §5)
All in `build/reports/cook-shared-fixes/` (laptop 1366×768 and phone landscape 844×390). `build/shoot_review.py` takes the review and coach shots; `build/shoot_shared_fixes.py` the pop-ups and shelves (`popup/`). **Read this first:** the frown shots of chai, maani, daar, chaat and samosa are *forced* (`Cook.forceReview`, the face only), because the bot plays them right, so in those shots the card still shows every row ticked. In a real wrong dish the card marks the wrong row, as the test runs show. Sekelo's frown is its real wrong path (`Cook.forceTaste`). Flaws first, for each.

**The faces (X4):** `faces-old-vs-new.png`.
- Nani's face is still a touch smaller and higher than the others; her sheet is a lean-on-the-counter pose, and the ChatGPT sheet should fix it.
- Nana's cap is cut by the circle at the top (by design: the face fills the circle, as Zafar asked).
- Ali's frown panel is from a different row of his sheet, and its lighting is a little warmer than his neutral.

**The review face (X10), right and wrong:**
- **Daar** (`daar-happy/frown-*`):
  - The bowl is small next to the hob, and the face stacks on it at the right of the hob, so the left third of the scene is empty.
  - The face covers the bowl's top rim (it's meant to be "over the dish").
  - On phone the praise card sits close to the right edge but isn't clipped.
- **Samosa** (`samosa-*`):
  - The face overlaps the top of the paper, and the paper-lined plate itself looks like a square napkin on a round plate (old art, not changed here).
  - Before the clamp, the phone shot cut the face at the top; it's clamped to the view now (re-shot: see the files with the later timestamps).
- **Chaat** (`assemble-*`):
  - The face sits just above the glass, praise to the right.
  - Before the clamp, the phone view cut off the top of the face (fixed, re-shot).
  - On laptop there's a lot of empty worktop under the glass (the layout is the station's own).
- **Sekelo** (`mishkaki-grill-*`):
  - The plate is at the far right, so the face is ~45 px from the edge.
  - The praise card overlaps the grill's right handle.
  - The face hides the top of the skewer.
- **Chai** (`chai-tray-*`, level 1 and `-l3`):
  - One glass: the face sits above the glass on the tray's top edge.
  - Full tray (level 3): each face sits on its own glass. The faces touch and slightly overlap each other, the left ones spill past the tray edge, and the praise card covers the empty fourth glass.
  - The small hob and tray badges stay on show under the big faces (two faces of the same person at once).
- **Maani** (`maani-line-*`):
  - The face sits between the hob and the finished plates, covering the top of the plates (moved 25 px lower after the first shot, where it covered the tongs).
  - It centres on both finished plates, so it isn't over the one with the maani.

**The coaches (X11):**
- **Samosa:** fill (`samosa-coach-*-fill`: the spotlight on the named filling, the ghost hand taps), fold (`-fold`: the strip lit, the hand swipes), fry (`-fry`).
  - The laptop fry shot was taken after the overlay had already stepped back, so it shows the karahi without the dim. The coach did start there (the shot is only taken when `.njg-onboard` is up). The phone shot, with a shorter wait, shows it.
- **Daar:** tadka (`daar-coach-*-tadka`: the next spice lit).
  - The stir shot on phone (`daar-coach-phone-landscape-stir`) caught the moment after the overlay stepped back (the tick glowing), so the stir step isn't pictured with its dim. The script's stir step ran (it's what the shot waited for).

**The pop-up with the new sentences** (`popup/*-popup.png`: pantry, chai, maani, samosa, sekelo):
- Pantry (lab): the list's face is Nana, not Nani. That comes from the lab's order person, not from today's changes; in story mode it's Nani.
- Maani: the headline repeats the row (*Muke hakri bajr ji maani khape.* / *hakri bajr ji maani*), the X12 point Zafar is to decide (§2).
- Samosa level 1: the headline is *Muke samosa khape.* and the filling is only in the row; the spoken sentence has the "with" part.
- Phone: the pop-up's headline is on one line, and nothing is clipped.

**The chai shelf padding** (`popup/chai-tray-*-t01.png`):
- On laptop the gap above the water bottle (~19 px) is a little larger than the gap under the chips (~11 px), so the X7 rule isn't exact at this size.
- On phone the two gaps match to within a few px.

## 8. Things I noticed but didn't change (for Zafar)
- The pop-up reads each row with a long pause (~3–4 s a row with no voice file in the headless browser), so a five-row pantry list takes ~20 s before it closes. It's worth checking on a real device.
