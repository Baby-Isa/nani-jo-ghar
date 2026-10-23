# Sprint 12: answers to Zafar's questions (voice notes, 22 Oct)

Every question from the two notes, answered, with the point it came from (`docs/feedback/s12-polish-2026-10-22.md`). Where the answer is already being built, the row says so.

## 1. The code: is it messy, and is that why fixes don't stick? (A8, N2 4:15–5:07)

**Short answer:** partly yes. The code isn't chaos, but it has one bad habit that makes a fix to a shared piece fail to reach every game. That habit makes development slower and more expensive than it should be.

**What's there.**
- About 68,000 lines of game code:
  - the shared kit, 13,400;
  - Cook, 28,500;
  - the clinic, 19,900;
  - the day, 2,700;
  - the language engine, 3,400.
- Cook has several files of 1,500 to 3,300 lines (`js/cook/ui.js` alone is 3,340).

**The habit: shared pieces exist, but games can go around them.**
- **Decisions that only lived in the docs.**
  - You'd said the third end page goes. The shared end screen adds it whenever a game hands it "steps", and there was no switch. So your decision was written in the docs ("held aside") and never in code.
    - Chai happens not to pass steps, so the page didn't show there. The eye test passes one step per card, so it always showed.
  - Level 1 with no "no" items was the same: written down, never coded. Before W1-A's change, 204 of 500 chai orders at L1 had a "no". It's now code with a test.
- **Several copies of one thing.**
  - There were four tapping fingers: Cook's hand image, the clinic's kit hand, the eye card's hand and the conversation's emoji. W1-A is making it one.
  - 62 files draw their own glows or shadows.
- **Games restyling shared pieces.**
  - The style checker knows 52 places where a game's own styles override a shared component. That breaks "the same shared screens and buttons in every mode".
  - It also knows 883 places with raw colours or sizes instead of the shared tokens.
  - All of these are carried as "known", so they never fail a check.
- **Checks that measured numbers instead of looking.**
  - The face circles were passed on the cutting tool's numbers. Nobody looked at the four circles side by side.
  - The chai pan's centring stayed on a row marked "waiting on art", so nobody re-checked it after Sprint 11 changed the pan.

**What it costs.** One fix has to be found in several places. A fix in one game passes its check while the others still differ. Then you see the old behaviour, and you rightly lose confidence that your fix went in.

**The plan to stop it (my recommendation):**
1. **Your decisions become code, every time.** A shared row can't close without a contract check that runs on every game. This is mostly how we already work. What's new: no "held aside" in the docs; a decision is either coded with a check or it's open. *Cost: nothing extra.*
2. **The known list can only shrink.** The style check fails if the 52 restyles or the 883 raw values go up. *Cost: about $5, part of wave 2.*
3. **Everything a builder touches moves onto the shared kit.** This sprint: one finger, one box, one end screen, one bubble placement. *Cost: inside S12's waves.*
4. **A short "one kit" clean-up before the app stores.** One builder routes every game's highlight, finger, end screen and bubble through the kit and clears the 52 restyles. *Cost: about $50–70, a day.*
   - No big rewrite. Splitting the 3,000-line files is risky and only worth doing when we're in them anyway.

## 2. The pour (B10, N1 11:37–12:46)
- **Why it got worse.** Two sprints ago, ChatGPT's frames tipped the pan sideways about its handle. Real pans don't pour that way, as your video shows. Sprint 11 replaced those frames with a coded squash-and-slide of a single top-down pan. A single flat picture can't show a tilt, so it looked fake.
- **The fix.** Your eight frames are the reference in the art block (frames 2, 4 and 7 are attached). It asks for six steps of the pan tipping lip-down, exactly from above, with no drawn stream, then the same steps with tea in.
- **If it doesn't land:** no pour animation. The pan lifts, the glass fills.

## 3. "Can we just revert to the old chai pans?" (B9, N1 11:03–11:32)
- The old pans were the three-quarter view, which clashed with the top-down hob and tray.
- The art run makes true top-down pans and a glass. If they're not plainly better, we put the old pans back.
- Centring the pan on the burner and the glass in its holder is a code fix either way, and the judge now checks it by picture (CHAI-08).

## 4. Zooms (A11, N1 17:16–18:15)
- **Why they jump.** The zoom enlarges the scene picture, then swaps to a separately drawn close-up whose framing and detail don't quite match. The swap is the jump you see.
- **Best practice (a match cut):**
  - the close-up is lined up to the same framing as the zoomed scene;
  - in the last ~300 ms the two crossfade;
  - the close-up is loaded during the zoom, so nothing waits.
- **Where the art doesn't match:** one higher-resolution master that both views come from.
- In the plan as SH-122.

## 5. The mic (C7, C8, N2 2:07–3:40)
- **Why "na" failed.** It doesn't use the browser's speech recognition. It compares your sound with the family's own recordings of *haa* and *na* and only accepts a clear winner (a 0.15 margin) within 3.5 s. With few recordings and different voices, it often finds no clear winner, so it shakes.
- **The fix (W2-B):**
  - Pick the nearer of the two with a smaller margin; with only two words, that's much more reliable.
  - Add more family takes of each word.
- **The look (your decision 2, approved):**
  - Tap once and everything dims.
  - A pop-up shows a live sound wave that grows as it hears you.
  - It stops by itself after a second of silence, or tap again to send.
- Children's apps generally use tap-to-talk with a clear listening animation and automatic stop. Hold-to-talk is hard for small hands.

## 6. Nani at the door: size and simple animations (D2, D9, N2 5:38, 8:21–9:12)
- **Size:** about 20% bigger, the camera a little closer, the door still in view. Built by W1-B; being judged.
- **Simple animations that look good with the art we have:**
  - the come-here wave (in the art run);
  - a small nod when the child says yes;
  - a slow blink and breath while she waits;
  - the door opening behind her as she says *ach* ("come", from Mum's grammar notes; to record).
- **Not recommended:** her turning and walking in. That needs a walk cycle (many frames), and done cheaply it would look like the bad animation you want to avoid.

## 7. The farm picture (D7, N2 7:25–8:04)
- Picture books make "farm" readable at a glance with a few things: a red-roofed farmhouse or barn, a fence, hay, a farmer with a hat and pitchfork, and two or three animals children know (here the goat, hen and dog from the earlier farm art).
- That's the art-run prompt. The sun picture is a big sun filling two-thirds of the frame, so it can't be read as "sky".

## 8. The car (E2, N2 9:37–10:23)
- I chose to mirror the car's art in code. The scroll stays left to right, and the car now faces the way it travels.
- Built by W1-B (RIDE-08); being judged. If the mirrored interior looks wrong, we redraw it.

## 9. The ride: how do you know what bakri, murgi and kutro are? (E4, E5, N2 10:59–14:14)
Built to your design (W1-B):
- no order screen;
- a list of the three on the left, in any order;
- the current one open as a full word card while Nani says it;
- found, it collapses to its ticked word and the next opens;
- the first find is shown to a new player;
- ~50% slower.

## 10. The book (F2, F8, F12, F5, N2 15:23–22:25)
- **"Has any thought gone into the book?"** Honestly, not enough. It was built in Sprint 9 as the day's quick ending, and Sprint 11's easy-to-play pass covered chai, the clinic and the door, not the book. Wave 3 gives it that pass.
- **"How is the sound-icon game meant to work?"**
  - It shows a picture and three speakers, each saying a word; you pick the one that names the picture.
  - It failed three ways: the speakers queued behind the line being said; a second tap within a second was dropped; and a word the engine can't build waited in silence.
  - It also had no words and no onboarding.
- **What each game teaches (your decision 3, approved):**
  - **Find it:** hear the word, pick the picture (listening).
  - **Name it, rebuilt:** see the picture, hear three Kutchi words that really play, pick one (recall by sound).
  - **Stick in the photo:** read and hear a sentence, drag the picture in (words in a sentence). "Then we use" folds into it, since it taught the same thing.
- **English in the book:** the same rule as everywhere. A word card shows English only while the word is supported, and only when tapped (your 21 Oct rule). The intro card is a word card, so it follows that; once the word is learned, just the picture.

## 11. The day builder opened by itself (A15, N2 22:39)
- The day page resumes a builder day saved earlier and never finished.
- Fixed by W1-B: it now resumes only when asked (LAB-07).

## 12. Slow loading (A1, N1 0:16, 13:46)
- The same big files are loaded twice: the family-audio list (330 KB) twice for chai, and the language files twice in the clinic.
- Everything loads one file after another.
- Wave 3 loads each file once, in parallel (CK-48).

## 13. The face circles: why they kept failing (A9)
- Three circles came from three different pictures under three crop rules, centred on the eyes, not the head. A slightly turned head kept one ear and lost the other. The page then cropped again.
- The fix is one sheet, one model, one crop (in the art block). The judge then compares all four circles side by side.

## 14. The lemon (C9)
- It was cut with its shadow. Why it overlaps the doctor's hand when the other fruit don't isn't confirmed yet: the picture's size or position on the card differs. I'll check that when it's re-cut.
- The art run makes a new lemon. A cut check for shadows and overlaps comes with it, so the next one is caught.
