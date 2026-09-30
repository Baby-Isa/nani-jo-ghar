# Clinic v2, prototype A: the rooms (W, D, P, E) and the shared clinic fixes

**Built on:** `docs/game-design/modes/clinic.md` part A, Zafar's answers in `docs/feedback/clinic-playtest-2026-09-29.md`, and the Cook design system. Branch `claude/clinic-v2`, shared with session B (the heal games, on separate files).

**What it is:** a prototype. The mechanics sit on the new approved backgrounds with stand-in pieces: the rough people, the grey patient figure, and flat shapes for the doctor, the apple, the tube, the torch and the four feeling faces. No new art.

**Where to play it:** `lab/clinic-core.html` lists every stage and level, for example:
- `clinic.html?lab=1&stage=waiting&level=4`;
- `…&stage=diagnosis&variant=D3&level=1&onboard=1`;
- `…&stage=pharmacy&level=3`;
- `…&stage=sendoff&level=3&variant=E4&onboard=1`.

---

## 1. Mechanics changed or removed

**Changed (all asked for in the sheet):**
- **Waiting room.**
  - The child taps the **tick under a person**, not the person. It shakes if wrong and locks in if right. Nobody moves until chosen; then the chosen person walks to the doctor's door.
  - The level is now the **five-rung language ladder**:
    - L1: man / woman / boy / girl;
    - L2: + old / young;
    - L3: + tall / short;
    - L4: + a colour;
    - L5: + with the baby / with the child.
  - The waiting room's level goes up to **5**; every other stage still stops at 3.
  - How many people: 4, 6, 7, 8 and 8. At level 5 the babies and children sitting with the grown-ups make 9 to 11 in the room.
  - The call names the kind plus the level's word, and adds an earlier word only when needed to pick out one person (at most two words beside the kind). The room always holds a near miss for each word said.
- **W2 is gone as a separate variant.** Its colour call and its *wadho / nindho* call are now covered by the ladder's rungs. See "Removed" below.
- **D1b is folded into D1** as its level 2 (graded: Found it on *haa*, Next on *na*). "D1b" in old links still works: it means D1 at level 2.
- **D3 changes:**
  - It is now drawn at level 1 too, with one call and **only the right tool plus one other**.
  - The doctor's calls are 1, 2 and 3 by level.
  - Each tool's first time comes with a spoken cue ("[Look in: the torch]"…) and the ghost finger on that tool.
- **Pharmacy:**
  - The items ride the **painted belt** edge to edge and slide in from off-screen. The code-drawn belt at the top is gone.
  - The tray sits on the counter strip, pantry style.
  - Level 3 is faster, with the items closer together: one enters every 1.0 s and crosses in 4.6 s (was 1.5 s and 5.0 s).
  - There is no timer. The ✋ belt stopper stays as the hint it was.
- **Send-off:**
  - **Four feeling cards** (happy, sad, hot, cold), pictures only. They replace the emoji faces (okay, better, scared).
  - **Level 1:** the patient's round face circle shows the feeling.
  - **Level 2:** the patient only says it.
  - **Level 3:** the face shows, and the child picks **what helps** (blanket, fan, apple).
  - **E3 is merged into E2:** from level 2 the goodbye happens in the scene. "E3" in old links means E2.
  - The "one more thing" appears in the doctor's hand in the scene, not in the left panel, and it's the feeling's help (the apple for sad).
- **Apple, not lolly.**
  - The item id `lollipop` stays, because it is the boing game's tray contract (session B's file).
  - Its word is now "apple", and every clinic picture of it is a flat apple (`Kit.icon`'s `standin`), so the belt, the tray and the send-off show an apple.
  - The boing game draws its own lolly (`boing.js`): that's session B's H-boing step.
- **G6:** at level 1, a heal game's count now shows on the card row as it happens, as the Kutchi number word (*hakro, ba, trae…*), and is said aloud. Levels 2 and 3 are unchanged.
- **G7 / CQ15:** the grown-ups' skip is no longer a button in the corner.
  - It is a "Skip the help (grown-ups: hold)" row inside the **?** menu, shown only while first-time help runs; you hold it for a second. Escape still skips.
  - This applies to Cook too: its ? pop now carries the row.
  - The clinic gains a **?** button at the bottom of its sidebar, with the stage's goal for grown-ups.
- **G9:** "no" is ***na***. That covers the diagnosis answer (line id `na`) and the eye chart's "not" word (`data/clinic/heal/eye.json`).

**Removed:**
- **W2's *wadho / nindho* call** ("the big uncle"). The ladder has no big/small rung, and tall/short are English placeholders. *wadho / nindho* are still used in the heal games.
- **The waiting room's `baby` kind** as a person to call. The baby now sits on a woman's lap as the level-5 "with the baby".
- **The send-off's emoji faces** "okay", "better" and "scared", and the E3 variant as its own draw.
- **The X-ray** as a belt decoy (it only reads as English). It stays in the leg-break tray.
- **Nothing else.** W3 (the child calls them, a speaking moment), W4 (two calls in order, with the comfort rings), D1–D3, the handover check, counts and order at pharmacy level 3, the stopper, E4, the goodbye and the sticker are all kept.

## 2. What was built

| Part | Where | Notes |
|---|---|---|
| The backgrounds | `assets/clinic/rooms/bg-clinic-{waiting-cb1b,exam-cb2b,stand-cb3b,pharmacy-cb4c,door-cb5}-v1.webp` | Cut from `sources/art/clinic-v2/` at WebP quality 90, like the current rooms, and shown at **full strength** |
| The scene box | `js/clinic/stages/common.js` (`S.room`, `S.fitScene`, `S.place`), `data/clinic/scenes-v2.json` | Keeps the picture's aspect, so everything placed in shares of the picture stays on the painted bench, bed, belt or mat. It covers the play area when the room's `need` range fits; otherwise it fits that range's width, sits on the bottom, and carries the top rows of the wall up |
| Waiting room | `js/clinic/stages/waiting.js`, `P.waiting` in `js/clinic/pipeline.js` | Six bench seats, standing spots by the door and the desk, the doctor (rough sprite) in the doorway. People are recoloured for the colour rung (a stand-in tint on the clothes band) |
| Diagnosis | `js/clinic/stages/diagnosis.js` | Sitting on the bed's edge (the knees are measured onto the mattress line, so a child's feet dangle higher) or standing on CB3b for the check-up. A flat doctor silhouette to the right, turned ¾ |
| Pharmacy | `js/clinic/stages/pharmacy.js` | The belt band is fitted to the painted belt; items without plates, with a drop shadow; the outlined tray on the counter |
| Send-off | `js/clinic/stages/sendoff.js` | On CB5: the doctor, the patient by the mat, the face circle, the cards, what helps, the question card with the patient's face and "?" (E4, first time), Nani's whisper |
| Cook's shared UI (G3) | `js/clinic/screen.js`, `js/clinic/kit.js`, `clinic.html` | **Nani's box** (the shared guide: face = replay, her line flagged "to record", the bulb and mute) at the top of the sidebar. **The card now looks like the order card** (the shared CSS classes on the clinic card, with the gold check on done rows), keeping the clinic card's API so the heal games work unchanged. The **round face circle** over the patient at the send-off |
| G8 | `data/clinic/pipeline.json` | Fever's tray is `thermometer`, not `strip` |
| Why beats (G5) | the stages | The doctor's "[Who's next?]" at the waiting room and "[Bring me…]" at the pharmacy; the patient's "[I don't feel well]" before the check-up; "[Is everything okay now?]" at the door |

**New words, all English placeholders to record (Round 4 Section G), and none invented:**
- man, woman, old, young, tall, short, "in red / blue / green / yellow", "with the baby", "with the child";
- "Who's next?", "Bring me…", "What will help?", "Say bye.", "Ask them how they feel" (Nani);
- the four feeling lines ("I feel happy / sad / hot / cold"), apple, and the tool cues.
- Kutchi used as it already was: *haa, na, Muke … khape, pela … ne poi, hakro … panj, Achija, Aabhar aanjo, Salamun alaykum*.

## 3. Tests

- `python3 build/test_clinic.py --canvas`: **PASS**. The run covers:
  - the waiting room L1–L5 plus W3 and W4;
  - D1 L1/L2, D2 L1/L3, D3 L1/L2/L3;
  - pharmacy L1–L3;
  - send-off E1, E2 L2, level 3's what helps, E4;
  - the nine heal games, a patient at L1–L3, and the first-ever morning;
  - **`heal-fever-help`**, new: fever played with first-time help ON, in the pipeline (the tray the pharmacy hands over).
    - It checks that the tray holds the thermometer, plays the game to the end through its own debug driver (session B's `build/heal_play.py`) and needs every answer right. First-time cues must come (4 in the run), with no blocking overlay and no errors.
    - With `strip` put back, it fails: "the fever's tray has no thermometer".
    - Session B's fever rewrite landed mid-session; its help is now spoken cues. My first version of this test waited for the old overlay and was rewritten for the new game.
  - `--canvas` is new to this test (Cook's flag: Chromium without WebGL). The clinic is DOM, so the run is the same.
- `node build/leak_clinic.mjs`: **no problems**.
  - "Fair" wins 100% of rounds everywhere.
  - The whole patient played blind wins 0.00% at L1–L3; the first-ever session 1.0%.
  - Blind-bot win rates for each waiting-room level are in its output. Level 1 is ~27% (1 in 4 kinds, as before); L4–L5 are ~10%.
- The other clinic Node tests: `build/leak_clinic_heal_a/b/c.mjs` and `leak_clinic_phase1.mjs` (see the end of the run log below).
- `node build/test_shared-ui-browser.mjs`: **all passed**, updated for the skip in the ? menu (no corner button; a quick tap does nothing; a one-second hold skips). Also passing: `test_shared_order_card.mjs` (7/7), `test_shared_ui.mjs` (8/8), `test_shared_say.mjs` (10/10) and `test_voice_wiring.mjs`.

## 4. Laptop shots, looked at (VISUAL-QA §5: flaws first)

The shots are in `build/reports/clinic-v2-a/laptop-*.png` (1366×768, the lab bar hidden). The script is `build/shoot_clinic_v2a.py`, and its header lists the states.

**Waiting room** (`W-L1`…`W-L5`, `W-L1-right`, `W-L3-wrong`):
- **Flaws:**
  - The rough people sit on their drawn stools on the bench (a stand-in).
  - The colour rung's tint is a hard band across the clothes, and on some sprites it catches the hands.
  - At L4–L5 the right side is crowded: the door and desk spots overlap, and a child beside the desk person is partly off the frame's right edge.
  - Laptop crops the room's far left, so bench seat 1 sits near the window's edge.
  - The doctor in the doorway is the rough sitting sprite, small.
- Two things were fixed during the review:
  - a mirrored strip above the room showed ghosts of the cross and the heart;
  - the window and front spots hid the bench's ticks, so they were dropped.
- **Right:**
  - The ticks sit on the floor under each person and read as empty checkboxes; the right one locks green, and the chosen person walks to the door with "Salamun alaykum".
  - The heads stay under the heart poster.

**Diagnosis** (`D1-L1`, `D1-L1-haa`, `D1-L2`, `D2-L1`, `D2-L3`, `D3-L1`…`D3-L3`):
- **Flaws:**
  - Standing on CB3b, the grey figure still looks squat: its "stand" pose keeps the sitting legs.
  - An adult on the bed nearly reaches the top of the frame.
  - The 🔍 (face close-up) sits over the room's top-left corner.
- **Right:**
  - The knees sit on the bed's edge and the feet dangle onto the step stool, for a child and an adult.
  - The doctor silhouette stands to the right.
  - D3 L1 shows two tools; the first-time cue dims the room and points at the right tool with the doctor's line.
  - The torch reads as a torch.

**Pharmacy** (`P-L1`…`P-L3`, `P-L3-tray`):
- **Flaws:**
  - The rough items vary a lot in size (the salt pot is big, the tweezers thin).
  - The counted tally chip sits over the shelves, top right.
  - At level 1 there are long gaps between items.
- **Right:**
  - The items stand on the painted belt and slide in from off-screen.
  - The outlined tray on the counter fills in order.
  - Level 3's belt is visibly denser.

**Send-off** (`E-L1`, `E-L2`, `E-L1-extra`, `E-L3`, `E-L2-bye`, `E-E4`):
- **Flaws:**
  - The patient is the grey figure, small beside the doctor.
  - The face circle overlaps the wall's green cross sign.
  - The E4 question card shows the rough sprite's face, not the grey figure's.
- Fixed during the review: the cards overlapped the doctor's legs, and "one more thing" landed on the patient's arm.
- **Right:**
  - The four flat faces read without words.
  - Level 2 shows "…" in the circle (said only); level 3's help cards: blanket, apple, fan.
  - The goodbye pills sit in the scene.

**? menu** (`help-skip`):
- **Flaw:** under the first-time dimming the ? itself is dimmed. It still works.
- **Right:** the pop shows the goal and the grown-ups' hold-to-skip row.

**The phone check** (915×412, landscape; `test_clinic.py --sizes laptop,phone`):
- The first run failed one case, D3 L3: the check-up's tool bar sat over the standing patient's feet, so "look at the left foot" couldn't be tapped.
- The tools now stand in a column on the room's left side (free wall or counter in both rooms). The rerun passes on both sizes (every case).
- **Flaw left:** on the phone the sidebar is narrow, so Nani's line wraps to four short lines and the card's rows wrap too.

## 5. Open, for Zafar or the next round

- The standing pose of the grey figure (squat legs) and the recolour tint are stand-in limits. Both go away with the real character art.
- **Zoom into the close-up (CB6b) when a heal game starts:** the heal stage is session B's (`js/clinic/heal/scene.js`). Not done here.
- **The boing game's own lolly → apple:** session B's H-boing (`boing.js`).
- The ladder at level 5 fills the room with companions: tune `people` / `with` in the data if it feels too busy.
- The laptop view crops the rooms' edges. A phone check comes with the full VISUAL-QA pass at the end of the art round.
