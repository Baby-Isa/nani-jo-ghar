# fix-shared2: shared and clinic rows (21 Oct)

Builder: fix-shared2 (worktree branch `fix-shared2`). Red runs: `shared2-red`, `shared2-red2`; green: `shared2-green2` (evidence), contract replay `shared2`.

## SH-63: who says what (Zafar, 21 Oct: the guide says the step, the card keeps the order)

The rule, in `js/shared/guide.js` (every Cook station's steps go through its stepper): a step's line shows in the guide box (or, where the asker is the guide, the card's top strip: R4) **the moment the step opens, at every level**, and stays until the step closes. Nothing is said or lit at the open: the voice is the step call, and after the pause the help (voice and the glow together). The card keeps the order: its headline is the goal, its rows the items or steps, ticking; it never changes its words. The clinic has no stepper: its stages and heal games set the doctor's strip (`screen.setGuide`), changed to the same rule below.

### Cook (the guide box, or Nani's strip on her own card)

| Station | The guide box, step by step (shown as each step opens) | The card |
|---|---|---|
| Pantry | the next thing: *Muke {item} de.* (from L2 a hidden word dotted, as the card does) | *Muke de* + the items, ticking |
| Chai | [Put water in] → [Put the chai in] → *Chulo bar!* → *Slow kar!* → each pan's extra, *{item} wiji chad!* (hidden: dotted) → [Pour it into their glass] | each person's order |
| Maani | [Take a dough ball] → [Roll it round] → [Put it on the tawa] → *Firai!* → the take-off step (data/cook.json gives it *Firai!* too, said again: MAA-15) | the maani ordered |
| Daar | *Nindha nindha kap!* (chop, her card's strip) → *Chulo bar!* → *Pela jeeru. Ne poi rai.* → [Put the vegetables in] → [Put the daar in] → *Firai!* (laps, speed) | *Muke daar khape.* + the rows |
| Samosa | *Bhar!* + the next filling → *Samosa waar!* → *Chulo bar!* → *Tar!* → L3 *Samosa hane kadh.* | one block per kind |
| Sekelo | [Thread them] → [Grill them] → *Firai!* at each turn | the skewers, piece by piece |
| Chaat | the next layer: *{item} wiji chad!* | the bowl's layers in order |

### Clinic (the doctor's strip on his card: R4)

| Stage | The strip | Changed (Zafar, 21 Oct) |
|---|---|---|
| Waiting room | [Bring them in] | every level (was L1 only; empty from L2) |
| Diagnosis | [Where does it hurt?] (seated) / [Let's have a look] (standing) | unchanged |
| Pharmacy | L1–L2: [Bring me] {the next thing}, at once, updated at every pick or take-back; L3 (order heard, never written): [Bring me...], the thing named only after the 7 s pause; at the end *{x}. Achija.* | was empty until the 7 s pause, empty again after each pick |
| Heal games | the step now (its row's line: *Pela paani* → *Ne poi cloth, trae dabs* → *ne poi laal plaster* …), changing as each step opens | unchanged |
| Send-off | [Pick how she feels] | every level (was L1 only) |

Docs changed with it: `docs/design-language/guide-and-card.md` R2, T23, T27, T28.

## The rows

| Row | Class | Proof |
|---|---|---|
| SH-63 | FIXED | `shared2-red2` → `shared2-green2`, SH-63.md: daar at each step's open (+0.4 s) the box was empty, now holds the step (*Chulo bar!*, *Pela jeeru…*, [Put the vegetables in], *Firai!*; one capture empty after the player's tap closed the step); clinic L2 strip at the waiting room and the send-off was empty, now [Bring them in] / [Pick how she feels] |
| PAN-01 | FIXED | `shared2-red` (800x360 noClip FAIL; stamp over tick and "these") → `shared2-green2` machine PASS at 1366x768, 1024x768, 844x390, 800x360; folded served card: headline whole beside tick and a tick-sized stamp (1366 shrinks to one line, 1024/844/800 wrap at word breaks); contract replay `shared2` (fetch, chai-tray, daar at all 8 sizes) 0 breaks |
| CLN-87 | FIXED (probe noisy) | cause: after the read-out the pop-up held 700 ms, then the card's 480 ms fly, and only then the push-in began. Now a 150 ms beat and the push-in starts as the card flies. In-page trace (heal-knee, real pace): fold start → zoom on 0 ms, room moving after the first frame. Probe gapMs zoom-in→end: red 2058 ms, green 1268 / 1812 ms (the sandbox's software rendering spends 0.5-0.7 s on the push-in's first frame, so this probe swings; on a device it is GPU work) |
| SH-53 (clinic) | FIXED | `shared2-green2` SH-53 panel C: at heal-cut start after 8.5 s idle the jug glows with the shared glow (njgGlow, the tick's beat), beside the first-time help's spotlight; the clinic's own box-shadow ring (hs-pulse) is gone from the tool strip and the ear's picture cards |
| SH-113 | FIXED (for the judge's eye) | her circle zoom 1.3 → 1.5, centre 40 % → 46 %: cheeks across ~0.82 of the circle like Nana's and the doctor's (`shared2-green2` SH-113 D, E vs A-C) |
| CLN-82 | ring FIXED; glow NOT PROVEN | the used jug and cloth keep no picked ring (`shared2-green2` CLN-82 p1: count .used.sel = 0; red sheet ev-20261021-122141-93k frames 3-17). The plaster glow: same host code as the knee's bandage (nextUp after the count, then the row's line, then the glow); the judge's run never paused (the player dragged the plaster 0.8 s after the third dab, while the row's line was still being said), and the evidence player does not wait on a visible: moment, so no sheet shows it yet: needs a pausing probe (tool owner) |
| CLN-155 | FIXED | data/clinic/scenes-v2.json exam.doctor x 0.70 → 0.665, y 0.83 → 0.84 (the 0.84 front edge Zafar set 16 Oct, held by the plane static check), h 0.70 → 0.71: `shared2-green2` CLN-155 at 800x360 and 1366x768, his shoes on clear floor in front of the bed, off its right leg |
| SH-60 (repeat) | FIXED | guide.js due(): no second help without an action. Red then green: build/test_shared_guide.mjs test 3 fails on the old guide.js, passes now; Cook contract replay `shared2-cook` on the final guide.js |
