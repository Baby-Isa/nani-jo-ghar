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

## 2. Items

| Item | | What was done |
|---|---|---|
| **X1** the spoken order | ✅ | See §3. One sentence per person, in card order. The kind of dish goes in the headline where Mum's pattern exists: chai's *Muke aadu waari chai khape.* (the extra is the top card row), and maani's *Muke ba bajr ji maani khape.* The rest follow as bare words. The join word is an English placeholder, **"with"** (maani's second kind: **"and"**), grey and flagged "to record", with no *Ne* chaining. `Cook.Order.sentence` is the one builder, used by the order, the card's own speaker, the chai tray's person lines, and samosa/daar/chaat's repeats. |
| **P4** read in card order | ✅ | The pantry list keeps its drawn order (no second shuffle), so the card, Nani's list and the fetch run top to bottom alike. |
| **X2** read-along underline | ✅ | Every spoken line shows as its parts, and each part gets the gold underline while it's said: Nani's box (her lines and her replay), the speech card (the chai tray's person lines), the caption, and the pill's own speaker. The pop-up already read along (headline underline, rows gold-edged); unchanged. `UI.speakAlong` / `UI.raHtml`. |
| **X3** speaker tappable | ✅ | The speaker badge now takes taps (`pointer-events: auto`), and a margin (`::after`) extends the face button past the badge: sidebar cards, pop-up, Nani's box (`.face-say`, `.oc-face`). The Phaser faces on the hob aren't replay buttons (tapping them selects the pan), so there was nothing to extend there. |
| **X4 / Q12** face badges | see §4 | Helper session. |
| **X10 / Q1** one review, big round face | see §4 | Helper session. |
| **X11** coach for every phase, plus a check | see §4 | Helper session. |
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

## 4. Sentences for Mum to record (Q5)
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

## 5. Tests
(filled in at the end)

## 6. Shots and flaws (VISUAL-QA §5)
(filled in at the end)

## 7. Things I noticed but didn't change (for Zafar)
- The pop-up reads each row with a long pause (~3–4 s a row with no voice file in the headless browser), so a five-row pantry list takes ~20 s before it closes. It's worth checking on a real device.
