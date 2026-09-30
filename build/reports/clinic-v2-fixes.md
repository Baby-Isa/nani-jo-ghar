# Clinic v2 fixes: Zafar's play of prototypes A and B (feedback §13–13k)

**Branch** `claude/clinic-v2`, then `main`. **Brief** `docs/feedback/clinic-playtest-2026-09-29.md` §13 to §13k, with UX-PRINCIPLES §8, §11–13 and §15–17. **Art**: stand-ins only. The new item art (CI1–CI5) was not cut or wired.

---

## 1. §13–13k, item by item

### §13: after the v2 prototypes
| Item | Status |
|---|---|
| **The pharmacy tray feeds the heal game** | **Done.** The ailments now ask for what each v2 heal game uses (`data/clinic/pipeline.json`): the ear asks for tweezers, cotton bud and drops; the drinks for milk, lemon, honey and the spoon; the eye for drops and the patch; the foot for the hot and cold jugs and the plaster; the leg-break (which plays the knee) for the hammer and bandage. Nothing in a heal game is greyed out. A wrong or missing pick costs the pharmacy's rows (the accuracy badge), and the doctor's handover check still swaps it, so the heal game always plays. **The heal shelf marks what came from the pharmacy** with a small gold dish badge on those tools (`S.fromTray`, `js/clinic/heal/scene.js`). |
| **Both feet at L3** (splinters) | **Done.** Two smaller feet side by side, with splinters in both. The patient says "[My left/right foot]". Pulling from the other foot makes them wince, and the new `foot-side` row is scored on the first try. |
| Level-1 counts | Unchanged, as Zafar asked (he'll judge them in play). |
| **The picked person rises off the seat** (no walk, no slide) | **Done.** `.risen` lifts the figure 9% and it stays raised. The old walk to the door is gone. |
| The doctor is based on Hannah's granddad | Noted. His stand-in face in the sidebar box is a flat face with glasses and a grey beard until his art exists. |

### §13a: waiting room
| Item | Status |
|---|---|
| W3 leaks, and W3 starts at L2 | **Superseded by the speaking note: W3 is dropped** from every level's mix. The code is kept behind `&variant=W3` for the record. |
| **Closed card from L3** (the call is heard; a tap on it is the paid peek) | **Done.** `Kit.Card.close()` uses the shared OrderCard's `closed`/`onPeek`. The peek counts as a hint (`screen.peek`). L1–2 show the words. |
| **L4 (W4): pick everyone, then judge the set** | **Done.** Each tick shows its number (1, 2) as it's tapped, and tapping a numbered tick takes it back (UX §17). When the last one is tapped the set is judged. All right: they lock in and rise. Any wrong: the ticks shake and clear and everyone sits down again. The first set is what's scored. On the card, W4 is a sequence ("Pela …" / "ne poi …"). |
| The lab's debug log overlaps the pills | **Done.** It now sits over the sidebar, clear of the play area (lab only). |
| **At most 6 people**, counting babies and children on laps | **Done** (`maxInRoom: 6`). People per level: 4, 5, 6, 6, 5, and companions at L5 count towards the 6. Checked over 2,000 rooms per level: the maximum is 6. |
| **Never two identical** | **Done.** No two people share kind, age, height, colour and companion (0 duplicates in 10,000 rooms). L1 is four different kinds. |
| Speaking moves out of the waiting room | Done (W3 dropped). |

### §13b: pharmacy
| Item | Status |
|---|---|
| **"[Bring me] …"**, not "Muke … khape" | **Done.** The card's headline is "[Bring me]" (an English placeholder, **to record**, and still to confirm with Mum). The rows are the items. The handover's "I need …" is now "[Bring me] …" too. |
| **A filled slot loses its outline** | **Done** (the pantry look). |
| **Tap a placed item to put it back**; the first pick is scored | **Done.** `P.beltTakeBack` empties the dish, and the belt brings the item round again. Scoring reads each dish's **first** placement (`st.firstIn`), so taking a wrong item back still counts. The tray now waits for **✓ Done**; it no longer hands over the moment it's full. |
| Items don't sit on the belt | **Not done: art.** This needs the real item art with a flat base and a contact shadow (CI1–CI5, not wired tonight, as asked). |
| **The cut-off button** | **Fixed.** Every button comes from the shared kit and sits in the play area's bottom-right corner, inside its edges on laptop and phone. |

### §13c: the clinic's card becomes Cook's order card
**Done.** `Kit.Card` (`js/clinic/kit.js`) is now drawn by the shared `OrderCard`. Its API didn't change, so every stage and all nine heal games moved over at once. It gives:
- **sequences**: the pharmacy's *pela … ne poi …* at L3, the waiting room's two in order, and every heal game's steps (an ordered job by default). Ordered parts inside a step are their own sequence: the scrape's plasters, the ear's wax order, the foot's toe order, boing's L3 bead colours and the tooth's brush moves. Each has the sequence line and the next part in the grey band;
- rows that tick when their step closes; a wrong pick marks the row for the review only (`card.miss`);
- **the read-along** (each row lit as it's said; the headline too);
- **the closed card and paid peek**: the waiting room from L3, as decided. The counts rule (heard only from L3) also closes the heal games' and the pharmacy's cards at L3;
- the counting rule: L1 counts up on the row (written and heard); L2 is written; L3 is heard only;
- one card per person, with the doctor's box above it (13f).

### §13d: send-off layout
| Item | Status |
|---|---|
| **Doctor and patient on the left**, in the free wall space | **Done** (`data/clinic/scenes-v2.json` door). |
| **Feeling cards in a thought bubble** from the patient's head, opening to the right | **Done.** It replaces the tray along the bottom. |
| The L1 hint sits on the patient's own face | **Done with the stand-in.** The feeling circle now sits over the head, never beside the bubble. It becomes the expression when the art exists. |

### §13e: send-off flow and staging
| Item | Status |
|---|---|
| **No script card** | **Done.** No card at the send-off; the doctor's box says the one line for now. |
| The flow follows on from L1; **the item tray from L3** along the bottom | **Done.** |
| **Staging** (three-quarter while talking, face the player on the child's turn) | **The hook is built** (`S.pose(el, "talk"/"front", {facing})`, `S.stage(a, b, "talk"/"player")`). It's used at the send-off, in the diagnosis and in the waiting room. With the stand-ins it's a small turn (a mirror) and a quick crossfade. **The three-quarter and front poses don't exist yet.** When they land, `Kit.art.poses[kind] = {talk, front}` swaps the picture. |

### §13f: end of the play
| Item | Status |
|---|---|
| L5 needs the earlier fixes | Done (all of 13 and 13a above). |
| **L3: help items and reply pills on top of each other** | **Fixed.** The reply pills only come when a reply is needed (the goodbye, E4's ask), after the tray has gone. |
| **Stale UI between rounds** | **Fixed.** `screen.clearStage()` removes pills, Say panels, bubbles, thought bubbles and fly-overs from the play area. The send-off also removes its pills as soon as the reply is in. |
| **No Nani box: the doctor's box** | **Done.** It's the shared guide box (`NaniGuide.mount(..., {name: "The doctor"})`), with his face as the replay, his line now, the bulb and mute, in the clinic's teal. His lines are in-world ones ("Who's next?", "Where does it hurt?", "Let's have a look", "Bring me…", "Is everything okay now?", and each heal game's goal), never an instruction to the child. The E4 "ask them" whisper comes from his box now. |
| "Fix the rest based on the feedback" | This whole report. |

### §13g: first-time help (UX §8)
**Done.** `S.cue` (`js/clinic/heal/scene.js`) now runs the **shared onboarding kit**. Everything is dimmed except the one thing. The **ghost finger** does the move once (tap, drag, hold or swipe) on the tool, then on the spot on the close-up (a second lit step), and the kit waits for the child. There are **no words and no device voice** in the help. The English cue texts are gone from all nine games (`def.cues` now holds gestures only). What the child hears is the doctor's line with the card's read-along. The why beat is **shown**: the pained face, then the doctor's line, with no caption. The grown-up's English goal stays in the "?" pop. The help runs once per profile per game and step; `&cues=1` forces it and `&cues=0` turns it off.

**`build/check_onboard.mjs` is flipped.** A heal game fails when:
- a cue is text;
- code passes text to `S.cue`;
- `S.cue` itself shows words or uses the voice;
- the game uses the device voice;
- a step kind has no ghost-finger demo in a move the kit can show;
- the why beat plays in a full run;
- the game doesn't start with input live (`S.begin`).

It also fails any room's first-time script without a ghost demo. I checked that it bites: a text cue on the knee and a why beat in a full run each fail it.

### §13h: scrape again and the audit
| Item | Status |
|---|---|
| **Take a plaster off before finishing** | **Done.** Tap a laid plaster and it comes off, until **✓**, which now commits the plasters. The **first** plaster put on each spot is what's scored. |
| **The plaster sequence on the card** | **Done.** One part per plaster (*pela* [red and yellow plaster], *ne poi* …), with the sequence line and the grey next band, each ticking as it goes on. |
| The audit of every game | §2 below. |

### §13i: knee, and never waiting on speech
| Item | Status |
|---|---|
| **The why beat only in the lab** | **Done.** The pipeline mounts heal games with `inRun: true`, and `S.why` returns at once there. |
| **The flashing stops when done** | **Done:** once the last turn is wrapped, no dot flashes. *Consequence:* the stopped flash tells the turns, so the turns are now a hand-skill row, and the knee's blind rate at L1 is about 25%, not 8%. See Open for Zafar. The leak bots print this exception on every run; it's never silent. |
| **Every right tap draws its turn** (a bug) | **Fixed.** The tap was matched to the *first* dot within reach, not the *nearest*. The dots are 34 apart with a 30 reach, so a right tap often hit a neighbour, which was logged as "not the flashing dot". |
| **No glow on the named leg at the top level** | **Done.** At L3 the word alone says which knee. |
| **Input never waits for the talking** (the whole clinic) | **Done:** `S.begin` in every heal game; `S.request` no longer opens the big card that waited to be read (it reads along in the sidebar); the why lines and patient lines are not awaited in the waiting room, diagnosis, pharmacy and send-off; the eye test's haa/na come up as the reading starts. Replay stays on the card's face. **Kept on purpose:** D1's Found it/Next only light after the patient's *haa/na*, because that answer is the thing being judged (§2). |

### §13j: ear
| Item | Status |
|---|---|
| **No big/small at L1** | **Done.** Two alike blobs; "[The wax out]". Size words start at L2. |
| **Drag the wax to a set place** | **Done.** A tissue beside the ear; drag each blob there and let go (let go anywhere else and it goes back). The same gesture at every level. |
| **Pop-ups stay until dragged out** | **Done.** They keep coming for the level's time, up to a count (5 at L2, 7 at L3), and the round ends when the ear is clear. |

### §13k: tooth and the first pass
- **Tooth**: the usual fixes (ghost-finger help, input live, the doctor's box and the shared card). The brush moves are now a sequence.
- **First pass on drinks, fever, boing, eye and foot**:
  - ghost-finger help and no English everywhere;
  - input live everywhere;
  - take-back: the drinks (tap a thing in the cup to take it out, until the cup is given; a wrong thing taken back still counts) and boing (tap the syringe to take the last bead out, until ✓; going past the count still counts);
  - sequences: boing's L3 colours and the foot's toe order;
  - L1 without harder describing words: the eye already says its sides from L2 only and the foot its side at L3 only; nothing else front-loads them;
  - no highlight at the top level: nothing else highlights what the words tell;
  - effects stop when done: checked, none run on;
  - each game clears its own UI (`S.destroy` now also ends its help);
  - the doctor's box and the shared answer pills (the eye's haa/na).
- Tummy, hic and hair are unchanged (CQ14).

### UX §15: the shared button kit
**Done:** `js/shared/buttons.js` and `css/shared/buttons.css`, documented in `docs/architecture/shared-api.md` §16, with a Node test.
- ✓ Done is Cook's round gold tick; → Next is Cook's flat design-system pill; the answer pills share one style; `endActions()` gives the end screen's actions in one order (Again, Next, the list, Home).
- The clinic uses the kit for every button, D1's Found it/Next, the eye's haa/na, and the end screen's actions.
- **Cook is unchanged** (it adopts the kit later).
- `results.js` needed no change for the clinic, so its phone overflow and the *hakro/hakri* fix are left for Cook's own pass.

---

## 2. The audit (13h)

- **Yes** = done.
- **n/a** = the rule doesn't apply (why given).
- **no** = not done (why given).

"Take-back" is for things *placed, picked or added*. A single choice that *is* the answer (a tick, a card, a pill) commits by itself, and counted actions (taps, drops, dabs) can't be undone, as UX §17 allows.

| Game | 1. Ghost finger, no English, no device voice | 2. Take back until Done | 3. Sequences on the card | 4. Clears its UI | 5. Shared buttons | 6. Input never waits for speech |
|---|---|---|---|---|---|---|
| Waiting room | yes (ghost on the tick, first-ever session) | yes at W4 (a numbered tick taken back before the set is judged); n/a at W1 (the one tick is the answer) | yes (W4) | yes | yes (→ Next) | yes |
| Diagnosis D1–D3 | yes (D1 probe; D3's tool demos) | n/a (answers); D3's tool can be re-picked | n/a (one call per row, ticked in order) | yes | yes (Found it/Next as answer pills; → Next) | yes, except D1's pills light after *haa/na*, which is the thing judged |
| Pharmacy | yes (the belt) | **yes** (tap a dish; first pick scored; ✓ Done commits) | yes (L3 *pela … ne poi …*) | yes | yes (✓ Done in frame; → Next) | yes (the belt runs while the card reads) |
| Scrape | yes | **yes** (plasters; ✓ commits) | **yes** (steps + plasters) | yes | yes | yes |
| Knee | yes | n/a (counted taps and wraps) | yes | yes (flash stops, no glow at L3) | yes | yes |
| Ear | yes (tool, then the drag to the tissue) | n/a (wax taken *out*) | yes (wax order at L2–3) | yes | yes | yes |
| Tooth | yes (swipe, swipe, hold) | n/a (brush, drill, fill are actions) | yes (brush moves) | yes | yes | yes |
| Drinks | yes | **yes** (the cup's things, until given) | yes (drinks in order) | yes | yes | yes |
| Fever | yes | n/a (counted uses) | yes (the exchanges) | yes | yes | yes |
| Boing | yes (the countdown is watched, nothing to demo) | **yes** (beads, until ✓) | yes (L3 colours) | yes | yes | yes |
| Eye | yes | **no**: the eye cover (L3) can't be moved once placed. It's a single right/wrong choice the game re-asks, so left for Zafar's review | yes | yes | yes (haa/na pills) | yes (the pills come up as the reading starts) |
| Foot | yes | n/a (splinters come *out*; plasters go on fixed spots that can't be wrong) | yes (toe order at L3) | yes | yes | yes |
| Tummy, hic, hair | **no**: unchanged (CQ14); their old help isn't checked yet | no (CQ14) | no (CQ14) | yes (the host clears) | yes (the host's buttons come from the kit) | no (CQ14) |
| Send-off | yes (first-ever: ghost on the right card) | n/a (the card or item is the answer) | n/a (no card: 13e) | **yes** (pills, bubble and tray removed) | yes | yes |

---

## 3. What changed (files)

**Shared** (Cook loads the first two; both changes are backwards compatible):
- `js/shared/onboard.js`: **a real bug fixed.** When a script was skipped during its between-steps pause, the pause's timer ran `end()` a second time. That cleared `active` for the *next* script, whose overlay was left on screen blocking taps (the in-pipeline fever timed out on it). `end()` now runs once, and only clears `active` if it's its own.
- `js/shared/guide.js`: an optional `name` (the doctor); Nani's defaults and labels are unchanged.
- New: `js/shared/buttons.js`, `css/shared/buttons.css`, `build/test_shared_buttons.mjs`.
- Docs: `docs/architecture/shared-api.md` §16.

**Clinic**:
- `js/clinic/kit.js`: the card on OrderCard (sequences, read-along, closed card, miss, the headline read), `Kit.button` on the shared kit, `Kit.DOCTOR_FACE`.
- `js/clinic/screen.js`: the doctor's box, the actions in the play area's corner, `peek`, and `clearStage` clearing stale UI.
- `js/clinic/stages/common.js`: `S.request` reads along without blocking; `S.pose`/`S.stage`; the doctor's lines per room.
- `js/clinic/stages/waiting.js`, `diagnosis.js`, `pharmacy.js`, `sendoff.js`, `heal.js`: as in §1.
- `js/clinic/pipeline.js`: 6 max and no twins; the W4 sequence; the "[Bring me]" rows; take-back scoring.
- `js/clinic/heal/scene.js`: `S.cue` on the kit, `S.begin`, the standalone-only why, `fromTray`.
- `js/clinic/heal/host.js`: `inRun`, `onboardOn`, the doctor's face, the closed card from L3, the doctor's line.
- `js/clinic/heal/games/{cut,knee,ear,tooth,taste,fever,boing,eye,foot}.js`: as in §1.
- `js/clinic/run.js`: the end screen's actions from the kit.
- `data/clinic/pipeline.json`: the waiting room, ailments, lines. `data/clinic/scenes-v2.json`: the door.
- `css/clinic.css`, `clinic.html`, `lab/clinic-heal-host.html` (loads fit, guide, order card, buttons), `lab/clinic-core.html` (W3 link → W4 L4).

**Tests and tools**:
- `build/check_onboard.mjs`: flipped.
- `build/heal_play.py`: a slip clears any help first.
- `build/test_clinic.py`: the W4 cases; the fever-help case now expects the ghost finger with no words; the end screen's primary action.
- `build/leak_clinic.mjs`, `build/leak_clinic_heal_a.mjs`: the knee exception, printed.
- `build/shoot_clinic_fixes.py`: the shots.

---

## 4. Tests (30 Sept, ~00:35–01:05 UTC, on the final code; main hadn't moved, re-checked at the end)
| Check | Result |
|---|---|
| `python3 build/test_clinic.py --canvas --sizes laptop,phone` | **PASS**, 70 cases (the waiting room L1–5 and W4, D1–D3, the pharmacy L1–3, the send-off, the nine heal games, patients at L1–3, the first-ever morning, and `heal-fever-help`, which now requires the ghost finger with no words in it) |
| `python3 build/test_clinic_heal_a.py` (phone, iPad, laptop) | **PASS** 108/108 |
| `python3 build/test_clinic_heal_b.py` | **PASS** 81/81 |
| `python3 build/test_clinic_heal_c.py` | **PASS** 54/54, plus the foot edge check and tummy/hic/hair |
| `node build/leak_clinic.mjs` | No problems (knee L1 printed as ACCEPTED, 13i) |
| `node build/leak_clinic_heal_a/b/c.mjs` | PASS. Every blind strategy is under 10% at L1 **except the knee, at ~25%**: named, printed, and open for Zafar |
| `node build/check_onboard.mjs` (flipped) | ok: 9 heal games, every kind of step has a ghost-finger demo with no English and no device voice. A text cue and a why beat in a full run were each tried and fail it |
| Shared Node tests (`node --test build/test_shared_*.mjs`, with the new `test_shared_buttons.mjs`) | all pass (13 files, 117 tests) |
| `python3 build/test_cook.py --days 1 --canvas` (onboard.js and guide.js are shared) | **PASS** on every viewport it runs |

---

## 5. Shots and their flaws (VISUAL-QA §5)

- **Where:** `build/reports/clinic-v2-fixes/` (`laptop-*`, `phone-*`), made by `python3 build/shoot_clinic_fixes.py`.
- **What:**
  - waiting L1–5, L1-right, L4-set, L3-wrong;
  - D1-L2, D2-L1, D3-L1;
  - P-L1..3, P-L2-tray, P-L2-full;
  - E-L1..3, E-L2-bye;
  - every heal game at L1 and L3, at the start (with the ghost) and mid-way, including foot L3 with both feet;
  - `sidebyside-end-*` and `sidebyside-btn-*` (the clinic next to Cook).

Flaws found and fixed during the review:
- **The shared → Next and ✓ Done picked up the clinic's old teal `.cl-go` look.** Fixed, and re-shot.
- **A pharmacy/heal overlay was left blocking taps** (the onboarding bug above). Fixed.
- **The send-off's feeling hint had gone at L3** (it should show). Fixed.
- The send-off's pose crossfade dipped to 55% opacity, so a shot caught both figures washed out. Softened to 85%.
- The feeling circle floated above the head instead of on the face. Now anchored to the head.
- The card's rows were cut off with "…": `fit.js` wasn't loaded. Now loaded.
- Locked W4 ticks kept their numbers. Fixed.
- The knee's wrap help asked for a bandage tap the child had already made, which hung the game. Fixed.

Flaws left:
- **Waiting room:**
  - At L3 two girls can differ only by height. That's the rung's word, but the stand-in has one girl sprite, so they look like twins at two sizes.
  - At L4–5 the → Next pill appears over the standing person by the desk. It comes after the pick, so nothing needs tapping there, but it covers a person.
  - Stand-in problems: tint bands; the rise is subtle (9%).
  - A finished closed card shows only the face for a moment before it folds.
- **Pharmacy:**
  - The stand-in items still vary in size, and the drops bottle pokes out below its dish.
  - Items float on the belt (13b: art).
- **Heal games:**
  - In the heal *lab*, the tray is data/clinic.json's (older ids), so some shelf tools lack the pharmacy badge there. In the pipeline the badges follow the pharmacy.
  - The kit's 450 ms "breath" between help steps blocks taps briefly.
  - The ear's tissue sits close to the tool shelf.
- **End screen and buttons:**
  - They match Cook's component; the actions differ by flow. The clinic offers **Next** only (a patient can't be replayed); Cook offers **Again** and **All stations**.
  - The clinic's Next arrow is the kit's gold icon, where Cook's is a black glyph.
  - The clinic's sidebar foot has only "?", where Cook's also has home and the book.
- **Phone**: the pharmacy tray is now lifted to stay inside the play area, but the stand-in drops bottle still pokes below its dish. The doctor's box line wraps to three or four short lines in the narrow phone sidebar.
- All 80 states were re-shot after the fixes (both sizes, no page errors); the D1 pills, ✓ Done and → Next now match Cook.

---

## 6. What Zafar should play first tomorrow
1. **A patient at L3**: `clinic.html?lab=1&patient=1&level=3`. It shows the closed card and peek, the pharmacy's "[Bring me]" sequence, ✓ Done and take-back, a heal game straight in (no why beat), and the send-off with the help tray.
2. **Waiting room**: `lab/clinic-core.html` → waiting L5 (6 max), then **W4 L4** (pick both, then judged; tap a number to take it back).
3. **Pharmacy L2**: fill the tray, tap a dish to put it back, then ✓.
4. **Send-off L1 and L2**: the thought bubble, people on the left, the goodbye pills only at the end.
5. **Heal labs** (first-time help on): `lab/clinic-heal-a.html` (scrape: plasters as a sequence, tap one off; knee: flashing stops, no glow at L3; ear: drag to the tissue, pop-ups stay), then `-b` (drinks: tap a thing in the cup to take it out; fever; boing), then `-c` (eye: haa/na pills; foot **L3 with both feet**).
6. The drinks, fever, boing, eye and foot are the first pass for his review.

---

## 7. Open for Zafar
- **The knee's flash stop (13i) gives the turns away.** Blind play wins ~25% at L1 (the rule is under 10%). The leak bots name this exception on every run. Options:
  - keep it (his "not very educational" call);
  - stop the flash only at L1;
  - add a counted word elsewhere in the knee.
- **Closed cards at L3 for the heal games and the pharmacy.** I read "counts heard only from L3" (13c) as a closed card with the paid peek, like the waiting room. It's easy to switch off in `host.js` and `pharmacy.js`.
- **The pharmacy's handover check still swaps a wrong item** before the heal game, so the heal game always has everything. The wrong pick costs the pharmacy's row. If he'd rather the wrong item came through to the heal shelf, that's a change.
- **Staging**: the hook is ready. It needs a **three-quarter** pose (mirrored) and a **front** pose for the doctor and each patient kind in the art round.
- **The eye cover can't be taken back** (audit row).
- **Tummy, hic and hair** are still on their old help (CQ14): decide later.
- The end screen in a clinic morning offers **Next** only: should it also offer "Again" (the same patient) or "All patients"?

## 8. New placeholder words (for the doctor's Section G recording; English, **to record**)
- **Bring me** (also to confirm with Mum: Cook Q5 item 8): "[Bring me]", "[Bring me] {item}", and the handover's "[This is {x}.] [Bring me] {y}".
- **The doctor's box lines**:
  - "[Let's have a look]" (the check-up);
  - each heal game's goal, now said by his box:
    - "Let's clean it and put plasters on."
    - "Let's check it and bandage it."
    - "Let's clean it."
    - "Let's brush, fix it and fill it."
    - "Let's make drinks to soothe it."
    - "Let's get you just right."
    - "I'll do it. You count!"
    - "Drops first, then let's test your eyes."
    - "Let's take the splinters out."
- **The waiting room**: "Pela {a}" / "ne poi {b}" reuse real Kutchi; the descriptions stay as before.
- **Ear**: "[The wax out]", "[wax]".
- **Scrape**: "[{colour} plaster]", "[{colour} and {colour} plaster]".
- **Foot**: "[my left foot]" / "[my right foot]", "[My {side} foot!]".
- **Tooth**: the moves as parts, "pela [up]", "ne poi [left]" (the words were already placeholders).
- **Boing**: "{n} [{colour}]" parts at L3.
