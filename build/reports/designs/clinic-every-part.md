# The clinic: every body part treatable, and the body chart

Design for Zafar, written overnight on 1 Nov 2026 while he slept, and revised the same night after an independent critique (`build/reports/designs/clinic-every-part-critique.md`; what changed is in §12). Every choice he hadn't made is in §10 as a numbered decision he can reverse. Design only: nothing is built yet.

**Sources (newest wins):**
- Zafar's 1 Nov answers at the foot of `build/reports/games-master-map-2026-10-31.md`, and his scope for this game
- Zafar, 30 Oct (`docs/sprints/S15-cook-game-by-game.md` "How" 3): Sprint 16 is the clinic, game by game, with the "Bring me these" card (CLN-216)
- Zafar, 14 Oct (`docs/game-design/cast.md`): the doctor voices his own lines
- `docs/game-design/modes/clinic.md` (the base)
- `docs/game-design/rulebook.md` §1 and §3; `docs/game-design/speaking.md`
- `build/reports/research-existing-games-2026-10-31.md` §1b and §3 (the clinic part by part)
- `build/reports/research-other-games-2026-10-31.md` §16
- `build/reports/designs/lessons-checklist-2026-11-01.md`
- `data/clinic/pipeline.json`, `data/patients/grey-adult.json`, `js/clinic/stages/diagnosis.js`
- `js/clinic/heal/games/*.js`

---

## 0. In one line

**Every body part a child needs (24, up from 17) on the diagnosis's "where does it hurt?" chart, each with a cure.**
- **The day:** the clinic.
- **Status:** designed. It extends built code (the diagnosis D2 and its face close-up, the heal host) and un-parks the scrape.
- **Built from:**
  - the diagnosis D2, and its built face zoom (`closeup` in `grey-adult.json`; the zoom in `diagnosis.js` lines 112-128)
  - the heal-game host (`js/clinic/heal/host.js`)
  - `cut.js` (the scrape), `foot.js` (the hand splinter), `ear.js` (the nose's twin), `taste.js` (the drinks), `knee.js` (the wrap)
- **Size: three pieces, not one sprint** (§6 has the split and the budget):
  - **Sprint 16, one playable goal:** every part the chart says at L1-L2 can be found (the face by zoom) and cured: the cut game un-parked on the arm and the knee, and the hand splinter. Built game by game, as your 30 Oct plan for Sprint 16 says.
  - **Sprint 17:** the chart's L3 (the why) and L4 (the small parts by zoom), the nose, the drinks, the head bandage, and the L3 body or side word in the live heal games.
  - **Only on your yes** (they add to your scope): the ankle, the teddy's speaking moment, the parent who speaks for a child.
- **Recording:** about 68 clips in all, 34 of them for Sprint 16 (§1, "Every line"). Nothing here teaches until they're in.

---

## 1. The language goal

**Word groups:**
- **Main:** body (target 32 A2 words; this takes the clinic from 17 parts to 24, plus side words).
- **Supporting:** the health half of feelings (a cold, a cough, a fever for certain; a headache, a toothache, an earache, a tummy ache as the family says them; medicine, better), and "careful".
- **Woven in:** numbers (counts), colours (plasters), sides (left, right), first and then, hot and cold.

**Key:**
- ✓ means a family take exists: a clip of the word alone, or a whole recorded line.
- (in repo) means the Kutchi is in the engine with no clip of its own.
- "to record" means there's no Kutchi yet; it's never invented.

### The parts on the chart (24), with their cures

| Part | Kutchi | On the chart from | The cure (game) | Built? | Sprint |
|---|---|---|---|---|---|
| head | to record | L1 (tapped in the face zoom: the forehead) | fever (built); a bump: the cut game's head bandage (new data plus the knee's wrap) | partly | 16 (fever); 17 (bandage) |
| ear | *kan* ✓ | L1 (in the face zoom) | ear | yes | 16 |
| hand | *hath* (in repo, no clip) | L1 | the hand splinter (foot.js on a palm), or the cut game | new reskins | 16 |
| arm | to record | L1 | boing; the cut game | yes / un-park | 16 |
| leg | to record | L1 | knee (the leg break) | yes | 16 |
| knee | *gutan* (in repo, in one line) | L1 | knee; the cut game (a grazed knee) | yes / un-park | 16 |
| foot | *pag* (in repo, no clip) | L1 | foot | yes | 16 |
| eye | *akh* (in repo, in one line) | L2 (in the face zoom) | eye | yes | 16 |
| nose | to record | L2 (in the face zoom) | **the nose game** (new: drops, then a tissue to wipe) | new | 16 on the chart (the cure: §3D) |
| mouth | to record | L2 (in the face zoom) | tooth, sore spots (taste) | yes | 16 |
| tooth | to record | L2 (in the face zoom; shares the mouth's spot, as built) | tooth | yes | 16 |
| tummy | to record | L2 | **the drinks** (taste's counter, the tummy) | reskin | 16 on the chart (the cure: §3E) |
| chest | to record | L2 | **the drinks** for a cough | reskin | 16 on the chart (the cure: §3E) |
| elbow | to record | L2 (was L3) | the cut game | un-park | 16 |
| shoulder | to record | L2 (was L3) | the cut game | un-park | 16 |
| neck | to record | L2 (was L3) | the cut game (a scratch, on the side-on head) | un-park | 17 |
| finger | to record | L4 (was L3), in the hand zoom | the cut game; the hand splinter | un-park | 17 |
| thumb | to record | L4, in the hand zoom | the cut game; the hand splinter | un-park | 17 |
| toe | to record | L4 (was L3), in the foot zoom | foot (the toes) | yes | 17 |
| ankle | to record | L4, in the foot zoom | the knee's wrap on a twisted ankle | reskin | on your yes (decision 3) |
| cheek | to record | L4, in the face zoom | the cut game (a scratch, on the nose game's face) | un-park | 17 |
| chin | to record | L4, in the face zoom | the cut game (the same face) | un-park | 17 |
| tongue | to record | L4 (lands on the mouth) | sore spots (taste) | yes | 17 |
| throat | to record | L4 (lands on the neck) | sore spots, turmeric milk | yes | 17 |

**The no-cure rule holds sprint by sprint.** A part is on the chart only once its cure is built. Until the nose game and the drinks land in Sprint 17, the nose, tummy and chest are drawn only by ailments that already treat them (the tummy's and chest's checks in D3, sore spots for the mouth); the check in §6 makes this code. If that leaves the nose with no cure in Sprint 16, the nose waits for Sprint 17 and L2 has 15 parts (decision 1).

**Kept off the chart until each has a cure** (the rule: no part named without a cure; §10, decision 2):
- **hair:** stays parked (Zafar: yes). Its hotspots stay in `js/clinic/figure.js`, so the check must cover D3's calls too.
- **back:** a later visit, with the fever's hot-water bottle
- **lips:** a later visit, with the sore spots' ointment bud
- **bottom and belly button:** left to the family

### The health half (the "why")

- **Certain why-only words:** a cold, a cough, a fever. Each is its own word in English, and almost certainly in Kutchi.
- **As Mum says them:** a headache, a toothache, an earache, a tummy ache. If the family says "my tooth hurts" (not a separate word), the why line is the L1 line again, and these three stay out of the L3 why rung. Mum's sheet asks (open question C).
- **Medicine** (*dawa*, in repo, in one line); **better** (planned, G63-G65).
- They are heard in the patient's line from L2, and they decide the tap from L3 (§3A).

### Helpers already in the repo

| English | Kutchi | Status |
|---|---|---|
| cold | *thundo* | ✓ recorded |
| hot | *garam* | ✓ recorded (two family takes; `clinic.md` H-fever asks whether the family says *koso*, and *garam* may be Gujarati: still open, question D) |
| careful | *dhyan rakh* | ✓ recorded |
| red | *laal* | ✓ recorded |
| teaspoon | *chamchi* | ✓ recorded |
| lemon | *limu* | ✓ recorded |
| small | *nindho* | ✓ recorded |
| yes / no | *haa* / *na* | ✓ recorded (the repo's spelling, `pipeline.json`; Zafar confirms spellings) |
| well done | *shabash* | ✓ recorded |
| just right | *barabar* | ✓ recorded |
| big | *wadho* | in repo, in lines |
| water | *paani* | in repo, in lines |
| milk | *dudh* | in repo, in one line |
| ginger | *aadu* | in repo |
| turmeric | *hardar* | in repo |
| drops | *chando* | in repo |
| green | *lilo* | in repo |
| first, then | *pela*, *poi* | in repo; *poi* in lines |
| left, right | *dabo*, *jamni* | in repo. *Jamni* exists only as a she-form ("jamni baju", `lexicon.json`); `clinic.md` writes *jamno*. Mum gives the form for each sentence before "on the right side" is built (question D). |
| one to five | *hakro, ba, trae, char, panj* | in repo; none has its own clip |

### Verbs

| Verb | Where it decides | Status |
|---|---|---|
| hurt | every line | to record |
| show ("show me where it hurts") | §3A | not in the engine; Part 3's #32 |
| fall ("I fell over") | the cut game's why line | not in the engine; #35 |
| wash or clean | the cut game | to record |
| wipe | the nose | in the engine, no Kutchi |
| put on | the plaster | to record |
| make | the drinks | *banai* in lines |
| drink | the drinks | not in the engine |
| blow (the nose) | the nose | to record |

### Every line, who says it, and what's missing

Non-negotiable 2: every line is a full sentence the engine builds from recorded phrases and words. **The doctor voices his own lines** (Zafar, 14 Oct, `cast.md`): his asks are his recording session, not Mum's round. Mum records the patients' lines and the words.

**Status:**
- **✓** recorded.
- **Engine** the frame is in the engine today (a bracketed placeholder in `pipeline.json` lines 135-137, or Kutchi written in), waiting for its take.
- **Missing** the engine has no such frame. **These are gaps, reported to Zafar here:** the frame must be added (as a placeholder, grey "to record") and recorded before that level teaches.

**The doctor (his recording):**

| # | Line | Used at | Status | Sprint |
|---|---|---|---|---|
| D-1 | "Where does it hurt?" | the chart, every level | Engine (`where`) | 16 |
| D-2 | "First {a}, then {b}." (*Pela … ne poi …*) | every heal game's order; the nose's "first drops, then the tissue" | Engine, Kutchi written (`bring2`); check a take exists | 16 |
| D-3 | "{n} dabs." / "{n} jugs of {hot / cold} water." | the cut game, the hand | Engine (the heal games' count rows, as built) | 16 |
| D-4 | "Careful!" (*dhyan rakh*) | the hand, the foot, the ear | ✓ (a family take; his own when he records) | 16 |
| D-5 | "The {colour} one." (the plaster) | the cut game L2+ | Engine (the cut game's colour rows, as built); check | 16 |
| D-6 | "Let's clean it and put a plaster on." | the cut game's start | **Missing** | 16 |
| D-7 | "Let's take the splinters out." | the hand's start | **Missing** | 16 |
| D-8 | "Clean the one on the {part} first, then the {part}." | the cut game L3 | **Missing** | 16 (placeholder until recorded) |
| D-9 | "First the {big / small} one, in the {finger}." | the hand L3 | **Missing** | 16 (placeholder until recorded) |
| D-10 | "{n} drops on the {side} side." / "{n} on the left, {n} on the right." | the nose L3-L4 | **Missing** (two frames) | 17 |
| D-11 | "Make the drink for {his / her} {cough / tummy / throat}." | the drinks L3 | **Missing** | 17 |
| D-12 | "The {top / bottom} tooth." | the tooth L3 | **Missing** | 17 |
| D-13 | "Put it {on the forehead / under the arm / in the mouth}." | the fever L3 | **Missing** | 17 |
| D-14 | "{Above / below} the knee." | the knee L3 (§3F) | **Missing** | 17 |

**The patients (Mum):**

| # | Line | Used at | Status | Sprint |
|---|---|---|---|---|
| P-1 | "My {part} hurts." | the chart L1+ | Engine (`hurts`) | 16 |
| P-2 | "My {part} and my {part} hurt." | the chart L2 | **Missing** | 16 |
| P-3 | "I fell over." (in Nani's garden) | the cut game's why | **Missing** | 16 |
| P-4 | "I was picking up sticks." | the hand's why | **Missing** | 16 |
| P-5 | "Thank you, I feel better." | every cure's end | "Thank you" in the engine (`thanks`); "I feel better" **Missing** | 16 |
| P-6 | "My {side} {part}." | the chart L3 | Engine (`hurts-side`) | 17 |
| P-7 | "I've got a {cold / cough / fever / …}." | the chart L3 | **Missing** | 17 |
| P-8 | "My nose is blocked." | the nose's why | **Missing** | 17 |
| P-9 | "I ate too much at the birthday party." | the drinks' tummy why | **Missing** | 17 |
| P-10 | "I danced all afternoon at the birthday party." | the foot's why | **Missing** | 17 |
| — | *haa*, *na*, *thundo!* | the chart's misses, the cut game's gasp | ✓ | 16 |

Reactions with no words (a giggle, "ow!", "aah… choo", the honk, the tiny burp) are sounds, not lines; no line is written for them. "That tickles" and "excuse me" are dropped as lines: a giggle says it.

**The words (Mum):**

| Group | Words | Clips | Sprint |
|---|---|---|---|
| Parts, L1-L2 | knee, hand, arm, leg, foot, head, eye, nose, mouth, tooth, tummy, chest, elbow, shoulder, neck (*kan* ✓; *hath*, *gutan*, *pag*, *akh* need their own clips) | 15 | 16 |
| Parts, L4 | finger, thumb, toe, cheek, chin, tongue, throat (+ ankle on your yes) | 7-8 | 17 |
| The cut game and the hand | plaster, cream (`clinic.md`: *malam*; Mum confirms), tissue, blue, yellow, splinter | 6 | 16 |
| Finger names | the middle finger, the little finger, the pointing finger | 3 | 16 |
| The health half | a cold, a cough, a fever, a headache, a toothache, an earache, a tummy ache (as Mum gives them), better | up to 8 | 17 |
| Places and the rest | top, bottom, the forehead, above, below; bandage, honey | 7 | 17 |

**The count:**
- **Sprint 16:** 5 of the doctor's (D-1, D-6 to D-9) and 29 of Mum's (P-1 to P-5, and 24 words): **about 34 clips.** Of the new frames, D-6, D-7, P-2, P-3, P-4 and P-5's "I feel better" are gaps the engine must gain first; D-8 and D-9 can ship as grey placeholders for the L3 rows.
- **Sprint 17:** 5 frames of the doctor's (D-10 to D-14, six with D-10's pair), 5 of Mum's lines and about 23 words: **about 34 more.**
- **All in:** about 68 clips (11 the doctor's, 57 Mum's), not the 33 first counted.

**What plays in Kutchi with today's recordings:** none of the chart or the cures, beyond *kan*, *haa*/*na*, *thundo*, *dhyan rakh*, *garam*, *nindho* and *pela … poi*. "Where does it hurt?" and "My {part} hurts" are in the engine but unrecorded. So: **the chart and the cut game at L1-L2 need only the 34 Sprint 16 clips; every L3 "other way of saying it" also needs a new frame.** Until the clips are in, a reader wins on the grey English (lessons §1), so this game counts as teaching only once they're recorded.

### New words per level

At most **two new parts a round**, each heard at least three times that morning. The chart's level sets the pool; the word ladder feeds new words in.

| Level | New words |
|---|---|
| L1 | 7 parts |
| L2 | +9 parts (+8 if the nose waits; decision 1) |
| L3 | +2 sides, +3 to 7 health words (no new parts) |
| L4 | +7 small or inside parts (+ the ankle on your yes) |

The cures add 2-4 each (cream, plaster, tissue, honey, the finger names).

---

## 2. Where it sits in its day

A clinic day runs: the door, then the clinic morning (waiting room → diagnosis → pharmacy belt → heal game → send-off, once per patient, 1-3 patients), then the evening book.

**Coming in:**
- **The door:** Nani says the doctor needs his helper today. On a later visit, the town map's "I feel poorly" sends the child there.
- **The waiting room:** who is called carries in. The patient brings their own ailment.

**Inside the morning:**
- **The chart decides what follows.** The part the child finds picks the heal game, and the pharmacy's ask (the plaster, the tissue, the honey).
  - The morning draws ailments from the parts the child is learning, so each new word comes with its cure.
  - A morning never repeats a heal game (`days.mix` rule).
- **The pharmacy belt** brings the cure's tray items, so a new item (the tissue, the cream) is met twice: on the belt, then on the tray.
- **The send-off** carries the health half out: "how do you feel?" "Better." The apple, never a lolly.

**Where the new games enter the mornings** (`days.mix`, decision 33):
- Sessions 1 and 2 stay as they are: the knee bump, then the knee and the ear. Nothing is taken out (non-negotiable 1).
- **Session 3** gains the cut game in its game set, and its third patient is the first-ever scrape once (§4).
- **Session 4 onwards** draws the cut game and the hand splinter (an ailment of `foot`) with the others.

**Going out:**
- **The evening book** shows the patient waving the plastered elbow: "we fixed his elbow". A body word heard a fourth time.
- **Later days reuse the parts:**
  - musical statues at the birthday ("touch your nose")
  - getting ready on the school day (wash your face, brush your teeth)
  - the adoption centre's care verbs

---

## 3. The stages

Each part below is a stage or a mini-game in the clinic morning:
- **A:** the chart (the diagnosis)
- **B to E:** the four new or un-parked cures
- **F:** the L3 body or side word across the live heal games
- **G:** the speaking moment (on your yes)

**Scores** are 1-5 for: Do (the gesture is clear), Kutchi (the word decides), Fun, Instruction (clear, family Kutchi only), Novel.

**One builder rule for every game here** (lessons §4 and §5): a counted row closes only when the child picks the next item, as the cut game's rows do (`cut.js` line 14). Nothing that follows (a sneeze, a fizz, a light, a next step) starts on the count being reached, only on that next tap. Otherwise the picture says when to stop, and the count leaks by waiting (the fever's "just right" bug, CLN-176).

### 3A. The body chart: "where does it hurt?" (the diagnosis D2, extended)

**The zooms** (decisions 6 and 29):
- **The face is a zoom region at every level,** on the built close-up (`grey-adult.json`'s `closeup`, the zoom in `diagnosis.js`). The ear is already a face part at L1, so the face zoom is there from the first round.
  - **A tap anywhere on the head opens it:** the head glides up to fill the play area's height (about 4x on a 275 px phone; the built 2.4x on big screens).
  - **Inside it,** the targets are the forehead (= the head), the ears, the eyes, the nose, the mouth and tooth (one spot, as built: the one asked for wins), and from L4 the cheeks and chin.
  - **A tap outside the face** (the shoulders, the wall) glides back out. No button: the built magnifier button goes (lessons §6: the cog is the only button on the play screen).
- **The hand and the foot are zoom regions from L4 only.** At L1-L3 a tap on the hand or the foot is the answer, as today. From L4 a tap on either always opens it (the palm, or the foot from the side); inside, the whole hand (the palm) or foot is a target, with the fingers and thumb, or the toes (and the ankle on your yes).
- **A zoom always opens, right or wrong.** It isn't a verdict and tells the child nothing, so it can't be used to eliminate regions. A zoom tap is not a try; the first tap on a part (in or out of a zoom) is.
- **Two different zooms:** this one is inside the diagnosis, to find the part. The glide into the heal game's close-up comes later, after the pharmacy, as built.

**The five questions:**

1. **What do you do?** Tap the part on the patient sitting on the bed. The face (and from L4 the hand and foot) opens first, then tap the part. Tap, then tap. No drag.
2. **Where's the challenge, and does the Kutchi decide it?** The patient's line is the only clue.
   - The body shows nothing until it's tapped: no red mark, no bandage, hands resting in the lap.
   - **The patient looks at the doctor, never at the sore part.** Gaze is a leak.
   - Every part is a live target.
3. **The fun:** each wrong tap gets a different small reaction, never a frown:
   - a giggle, the toes wriggle, a shrug, a playful *na* with a head shake.
   - **The right tap on the first try:** an "ow!", a soft red glow and the gold **Found it**.
   - **The right tap after misses:** the soft glow and a plain tick (progress, not a verdict), as the heal games do it (gold only for a first try). The review and the end screen read the same way.
4. **The instruction:** the doctor asks, the patient answers, and the part's card pops big and flies into the doctor's card. Family Kutchi only. Listening again is free.
5. **What's novel:** the zoom-to-find. It teaches that the eye is part of the face, and from L4 that the thumb is part of the hand and the toe part of the foot.

**Scores:** Do 5, Kutchi 5, Fun 3, Instruction 5, Novel 3.

**Levels** (each adds one thing; the gesture never changes):
- **L1:** 7 big parts, one per line ("my knee hurts"), two calls a patient. The head and the ear are found in the face zoom. A supported word's card shows its picture (allowed while supported).
- **L2:** more of it.
  - 16 parts (adds the eye, nose, mouth, tooth, tummy, chest, elbow, shoulder, neck; the face parts in the face zoom).
  - **Two parts in one line** ("my elbow and my hand hurt"), for one patient a morning (decision 5). Tap both, in any order; each is its own first try.
  - **Which cure follows:** a two-part line is drawn only from pairs that one close-up treats, so one heal game follows and the pharmacy asks for its items as usual. In Sprint 16 that's the cut game on the arm (any two of hand, arm, elbow, shoulder); the cut game's L2 already has two scrapes, which are exactly those two parts. Two cures in a row stay at L4 (§5).
- **L3:** other ways of saying it. The patient says the side ("my left knee", the patient's own left, as built) **or only the why**:
  - "I've got a cough" → the chest; "a cold" → the nose; "a fever" → the head
  - and, if Mum gives each as its own word: "a headache" → the head, "a tummy ache" → the tummy, "a toothache" → the tooth, "an earache" → the ear
  - This is where the health half decides a move.
- **L4:** the small and inside parts, 23 in all (24 with the ankle).
  - Finger, thumb, toe (and ankle) in the hand or foot zoom; cheek and chin in the face zoom.
  - Tongue lands on the mouth, throat on the neck.
  - The look-alikes sit side by side once zoomed (finger and thumb, cheek and chin).
  - The diagnosis's level cap goes from 3 to 4 (`days._about`: "max 3"), and `parts` gains a "4" tier (decision 31).

**The leak test:**

| Way to win without Kutchi | Can it? | The fix |
|---|---|---|
| **Reading** | Only on grey placeholders. | No English on the body or the card past support. The game isn't shipped until the parts are recorded. |
| **Matching** | Only while supported. | The card's picture shows only until the word is right three times in a row, then speaker only. No wound or pose shows on the body. |
| **Eliminating** | No. | All parts stay live. A zoom opens for any tap on its region, so it says nothing. Only a first-try tap moves a word's ladder and earns gold. Blind first-try odds at L1: six body targets, then two in the face zoom: 1/6 to 1/12 a call, about 2% for a patient's two calls; well under 0.5% from L2. |
| **Patterns** | No. | The part is drawn from the word tracker's pool, never the last patient's. Sides random. The why words map to several parts across a morning. A two-part line says "the arm" region (one patient a morning), but each part still needs its own first try. |
| **Waiting** | No. | No glow ever shows the answer. The 7 s hint is the patient saying it again (free). The bulb opens the helper card (it costs). |

**The delight moment:** the face zoom. Tap the head, the camera glides in, and the face fills the screen; a right tap gets "ow!", then a relieved "*haa*, there".

**Speaking:** none here; see 3G.

### 3B. The cut game (the scrape, un-parked and made busy)

**What it treats:**
- **On the arm close-up (Sprint 16):** hand, arm, elbow, shoulder; finger and thumb from L4 (Sprint 17)
- **On the existing knee close-up (Sprint 16):** the knee
- **On the side-on head (Sprint 17):** the neck
- **On the nose game's face (Sprint 17):** cheek, chin
- **The head (Sprint 17):** a bump gets a head bandage

**The why:** "I fell over. My elbow hurts." (P-3, P-1) / "Let's clean it and put a plaster on." (D-6)

**One tray for every cure** (the research's fix: a tool must not give the action away): a water bowl, a cream tube, plasters (2-4 colours) and a tissue box. All are shown at the start.

**Steps** (the hands have something to do at every step):
1. **Clean:** tap the water bowl, then tap the scrape.
   - A splash, and little bits of garden grit fizz away.
   - The patient gasps "*thundo!*" ✓ with a comic shiver. One tap per scrape; it isn't counted.
2. **Cream:** "{n} dabs" (*pela paani, ne poi* cream). **The gesture, as `cut.js` does it today:** tap the tube once (it stays picked), then tap the scrape N times. Picking the next item closes the row.
   - Each dab gives a cool sparkle and a "sss-aah" face.
   - The redness fades to half on the first dab and then stays, so the picture never says when to stop. The heard count does.
   - The doctor counts aloud at L1 only.
3. **The plaster:** tap the plaster of the colour said, and its backing peels off with a zip. Tap the scrape, and it smooths on.
4. **Head bump only (Sprint 17):** instead of the plaster, the knee's flash-and-tap wrap round the head (Zafar's own idea).

The row ticks when the step closes (the next item is picked), never at a count.

**The five questions:**
1. **What do you do?** Tap, then tap, three times over. The wrap is the knee's.
2. **Does the Kutchi decide?** Yes:
   - the item and the order (first, then)
   - the dab count
   - the plaster's colour
   - from L3, **which scrape first, by its body word**
3. **The fun:**
   - the cold-water gasp
   - the peel-and-stick zip
   - the patient waving the plastered elbow proudly at the end
   - a giggle if you dab near the palm
4. **The instruction:** the doctor's card and line, one step at a time. The guide box names the step.
5. **What's novel:** two or three scrapes on one limb, picked by a body word. This turns the "incredibly boring" scrape (CLN-172) into a body game.

**Scores:** Do 5, Kutchi 4, Fun 3 (was 1), Instruction 5, Novel 3.

**Levels** (dabs + scrapes: 1-2+1, 1-3+2, 2-4+2, 2-4+3; decision 11):
- **L1:** one scrape, dabs 1-2 (counted aloud), one plaster in one colour (shown). The decoy is the tissue (clearly different).
- **L2:** two scrapes on the close-up, dabs 1-3, the plaster's colour said ("the blue one"). Two words per move: how many and which colour.
- **L3:** the body word decides the order: "clean the one on the elbow first, then the hand" (D-8, a placeholder until recorded).
  - The scrapes look alike (one art piece, rotated), so only the word picks.
- **L4:** three scrapes, two-colour plasters ("red and blue", the rule as today), and a look-alike pair side by side (the finger and the thumb, or the cheek and the chin).

**The leak test:**

| Way to win without Kutchi | Can it? | The fix |
|---|---|---|
| **Reading** | Only on placeholders. | The same rule as 3A: no English past support; not shipped until recorded. |
| **Matching** | No. | No colour swatch or part picture on the card past support. Every scrape is the same picture. |
| **Eliminating** | No. | Picking the wrong scrape first, or over-dabbing, isn't stopped. It shows in the review (no verdict mid-round). Blind L3 odds: order 1/2 × count 1/3 × colour 1/3 ≈ 6%, and two scrapes per round push it lower. |
| **Patterns** | No. | Scrape places, colours and counts are random per round, and which scrape is first rotates. |
| **Waiting** | No. | No glow on the scrape to do first. The hint repeats the line. The half-fade means the picture never says the count is done. |

**The delight moment:** the plaster's peel and stick, then the patient flexes the arm and admires it.

**Speaking:** none.

**Kept, not removed:** the stitched "cut" stays in `cut.js` as its own ailment, unchanged. It isn't drawn into mornings until Zafar plays it (decision 9).

### 3C. The hand splinter (foot.js on a palm)

**The why:** "I was picking up sticks. My hand hurts." (P-4, P-1) / "Let's take the splinters out." (D-7)

**Steps** (as the foot):
1. **Soak:** "*garam* ✓ or *thundo* ✓ water, {n} jugs". Tap the jug, then pour. One dirt per jug, as the foot (Zafar, 29-30 Oct).
2. **Pull each splinter along its channel** with the finger, no tool. Touching the edge makes an "ow" and the splinter slides back. The doctor says "*dhyan rakh!*" ✓.
3. **A plaster** on each spot.

**The five questions:**
1. **What do you do?** Tap, pour, then drag along a track (the one allowed drag).
2. **Does the Kutchi decide?** Yes: hot or cold, the jug count, and from L2 which finger first.
3. **The fun:** the channel paths ("I love to see the different pathways", KEEP-17), and the "ow … careful … phew".
4. **The instruction:** as the foot.
5. **What's novel:** the finger names. It's the same game on a new part, but it carries "careful" and the hand words.

**Scores:** Do 5, Kutchi 4, Fun 4, Instruction 5, Novel 2.

**Levels** (jugs + splinters as the foot: 1-3+1, 2-4+2, 2-5+3, 3-6+4):
- **L1:** one straight splinter.
- **L2:** splinters in named fingers, in order (the thumb, the middle finger, the little finger; to record).
- **L3:** big or small is said too ("first the big one, in the thumb"; D-9, *wadho*, *nindho* ✓). Two words per move.
- **L4:** narrower channels and a fourth splinter (the pointing finger).

**The leak test:**
- **Reading:** placeholders only, as before.
- **Matching:** every splinter is the same picture.
- **Eliminating:** the order isn't blocked; it's scored in the review. Blind L2 odds: 1/6 for a three-splinter order × 1/2 for hot or cold, about 8%.
- **Patterns:** the fingers and temperatures are random.
- **Waiting:** no glow on the first splinter. The jug row closes on the next tap, not on the last dirt.

**The delight moment:** the splinter pops out with a tiny "plink" into the kidney tray, and the patient wiggles the fingers.

**Speaking:** none.

### 3D. The nose (the ear's twin: drops, then a tissue to wipe) — Sprint 17

**The why:** "I've got a cold. My nose is blocked." (P-7, P-8) / "First drops, then the tissue." (D-2, the built frame: *pela chando, ne poi* tissue)

**The close-up:** the face, front on, sitting up in the upper half against the plain wall (the head close-up rule). It's the eye game's s08c face with new states, not a new face (§7). The same face serves the cheek and chin scrapes.

**Safety (Zafar, 1 Nov; decision 15):**
- The dropper stays above the nose, and each drop falls from the tip.
- Nothing ever goes inside the nose.
- The tissue only wipes the outside, and the patient does the blowing.

**Steps** (Zafar, 1 Nov: "drops to dissolve it, then a tissue to wipe"):
1. **Drops:** "{n} drops" (*chando*). Tap the dropper on the tray, then tap the nose. A drop falls.
   - The patient's breathing changes from snuffly to clear, little by little.
   - The blocked look stays until the tissue, so the picture never says when to stop.
2. **The wipe:** tap the tissue box (a tissue pops up), then tap the nose.
   - **Builder rule:** the drops row closes only on the tissue-box tap. The twitch ("aah… aah…") starts on that tap, never when the count is reached.
   - When the tissue reaches the nose, the sneeze comes into it: "choo!", a big comic honk, and the patient giggles. Always caught: the build-up waits for the tap, however long it takes. No timer.
3. **The bin:** tap the tissue, then the bin. It drops with a soft pat.

**The five questions:**
1. **What do you do?** Tap, then tap, every step.
2. **Does the Kutchi decide?** Yes:
   - the item and the order (*pela chando, ne poi* tissue)
   - the drop count
   - from L3, which side
   - from L4, a count per side
3. **The fun:** the sneeze into the tissue. A tickle, a build-up, then the honk; every family laughs at it (the research's best delight, as a reaction).
4. **The instruction:** the doctor's card and line, one at a time.
5. **What's novel:** the only cure with a sneeze; the face close-up shared with the cheek and chin.

**Scores:** Do 5, Kutchi 4, Fun 4, Instruction 5, Novel 4.

**Levels** (drops + wipes: 1-2+1, 2-3+1, 2-4+1, 3-5+2):
- **L1:** drops 1-2, counted aloud; one wipe.
- **L2:** drops 2-3, and the order said with the cream on the tray as a second decoy.
- **L3:** the side: "two drops on the left side" (D-10; *dabo*, *jamni* in the form Mum gives).
- **L4:** both sides with different counts ("two on the left, one on the right"); a wipe for each side.

**The leak test:**

| Way to win without Kutchi | Can it? | The fix |
|---|---|---|
| **Reading** | Only on placeholders. | As 3A. |
| **Matching** | No. | No count or side shown past support. |
| **Eliminating** | No. | Extra drops aren't stopped, and nothing ends by itself. Blind L3 odds: side 1/2 × count 1/3 ≈ 17% for the drops row alone; with the order row (the first item from three) about 6%. |
| **Patterns** | No. | Side and counts are random. |
| **Waiting** | No. | No glow on the side. The blocked look holds; the twitch starts only on the tissue-box tap (the builder rule above), so the picture never says the count is done. |

**The delight moment:** the honk into the tissue.

**Speaking:** none.

### 3E. The drinks for the tummy and a cough (taste.js's counter) — Sprint 17

**The why:**
- "I ate too much at the birthday party. My tummy hurts." (re-pointed from the wedding; decision 27)
- "I've got a cough. My chest hurts." The cough patient is the boy (decision 37).

**The close-up:** the patient sits up, clothed, a cup ready, hands in the lap, looking at the doctor. Clothes are never lifted (non-negotiable 9, modest).

**The drinks: taste.js's four, kept** (`taste.js` line 36: four, so a blind guess stays under 10%). Mum confirms which is the family's remedy for what (decision 17):

| Drink (built) | For | Kutchi |
|---|---|---|
| ginger and water | the tummy | *aadu*, *paani* |
| honey in milk | a cough | honey to record, *dudh* |
| turmeric milk | the throat | *hardar*, *dudh* |
| lemon and water | none at L3 (the fourth drink, always on the counter) | *limu* ✓, *paani* |

If Mum says the cough's remedy is honey and lemon, that's a drink with two things added: new code in `taste.js`, said in the open question A.

**Steps:**
1. **Listen:** tap the stethoscope, then the tummy or chest. A comic grumble or cough. (At L3 this step moves to the end; see the leak test.)
2. **Make the drink named:** the counter holds all six ingredients. Add each (tap, then tap the cup), then stir (Cook's stir).
3. **Give it:** tap the cup, then the patient. Sips follow; each sip quietens the rumble or the cough. A tiny polite burp after the ginger (a sound, no text), or a clear "aah" after the honey.

**The five questions:**
1. **What do you do?** Tap, then tap, and the stir.
2. **Does the Kutchi decide?** Yes:
   - the ingredients from six
   - from L2, the counts (*ba chamchi* ✓)
   - from L3, what it's for (the body or health word)
3. **The fun:** the burp and the giggle, the cough fading, the stir.
4. **The instruction:** the doctor's line.
5. **What's novel:** it ties the health words to a family remedy. It's the only cure the child makes.

**Scores:** Do 5, Kutchi 4, Fun 3, Instruction 5, Novel 3.

**Levels:**
- **L1:** one drink named by its things ("ginger and water"), two ingredients.
- **L2:** counts ("two spoons of honey").
- **L3:** the drinks named by what they're for, three remedies in play (tummy, cough, throat), with all four drinks possible.
  - The patient has two of the three complaints, and the doctor asks for both in order (D-11 with D-2: "first make the drink for his cough, then the one for his tummy").
  - The mapping was heard at L1-L2 every time ("ginger and water, for the tummy").
- **L4:** amounts and halves ("half a cup of milk", the rulebook's L4), and a look-alike (lemon beside a lime).

**The leak test:**

| Way to win without Kutchi | Can it? | The fix |
|---|---|---|
| **Reading** | Only on placeholders. | As 3A. |
| **Matching** | No. | No ingredient pictures on the card past support. |
| **Eliminating** | No. | All six ingredients stay out; a wrong one is redone on the spot. **Blind L3 odds:** the first drink from four (1/4) × the second from the three left (1/3) = 1/12 ≈ 8%; with the L2 spoon count (1/3) about 3%. The second drink is never forced: the fourth drink is always possible. |
| **Patterns** | No. | Which two complaints, and their order, are random. |
| **Waiting, and the sound clue** | No. | At L3 the listen step moves to after the drinks, as a check, so the grumble or cough can't say which drink. The pose stays neutral: no hand on the chest, no cough puff. |

The leak bot (`build/leak_clinic.mjs`) gets the L3 row with this number.

**The delight moment:** the tiny burp, then a giggle (no line).

**Speaking:** none.

### 3F. A body or side word at L3 in every live heal game, and "careful" — Sprint 17

Zafar, 1 Nov: so numbers don't decide everything.

| Game | Its L3 body or side word | Notes |
|---|---|---|
| Knee | **where the bandage goes: "above the knee" or "below the knee"** (D-14; to record) | The knee has no side word today: the side is tested in the diagnosis only, and the close-up's rows never name it (`knee.js` lines 12, 83-84). This is the word it gets (decision 20). When the ankle joins (on your yes): "the knee, then the ankle". |
| Ear | the side ("the left ear first"): the patient turns her head when tapped (the side-on head, mirrored) | Moves the ear's side from L4 to L3. **This reverses your 14 Oct ear decision** (decision 97 (8): the side at L4), on your 1 Nov word (decision 19). The extra blobs stay at L4. |
| Tooth | top or bottom ("the top tooth"; D-12, to record) | Two teeth with decay, one top and one bottom. |
| Sore spots (taste) | the drink named by what it heals ("for the throat") | As 3E. |
| Fever | where the thermometer goes: the forehead, the mouth or under the arm (D-13; to record) | |
| Boing | the side: "the left arm" (in the engine, to record) | Both arms held out. |
| Eye | the side, already at L2 | Passes. |
| Foot | the toes named, already at L2 | Passes. |
| Cut, hand, nose, drinks | as 3B-3E | |

**"Careful" (*dhyan rakh* ✓):**
- the doctor says it on the foot's and the hand's wince
- the doctor says it as the tweezers reach the ear's deep blob, which then moves at half speed
- It's said, not tested: it's the natural line, heard often.

### 3G. The speaking moment: the teddy (on your yes; not in any sprint yet)

This adds to your scope (decision 23). `speaking.md` puts the speaking weight on Cook and Conversations, the clinic's rows are "lighter touches", and its pilot (chai) hasn't run. So this waits for the pilot and your yes.

**Who:** a younger patient brings a teddy: Isa's teddy, carried in by Ma, once Isa's art exists. (Ali, the tall, lanky cousin, didn't fit a teddy.)

**When:** from L3, once every third morning, as the last patient. Never a gate.

**How it plays:**
1. Ma comes in with Isa and his teddy. The child has heard "my {part} hurts" from dozens of patients.
2. **The handover:** the doctor hands the child his clipboard, and the "your turn" mic bubble shows over the child.
3. The teddy has a soft glow on one part. That's fine: here the child is the one telling, not finding.
4. The child speaks for the teddy, as children do in pretend play: "My tummy hurts."
5. **Closed set:** three pills, each with a part picture and a speaker, always there.
6. The mic shows it's listening and what it heard. A pill tap moves the story on but earns no speaking bonus (`speaking.md`: "the fallback is the pills: they earn no speaking bonus").
7. The doctor then checks the teddy's tummy with the stethoscope, Isa giggles, and a plaster goes on the teddy.

**Why this way:** no new recording (P-1 is already heard), and it reuses the shared speaking pattern ("say it, someone acts").

---

## 4. The child's first-ever round

The first morning that shows this game's new pieces: **session 3, its third patient, the first time.** Sessions 1 and 2 are unchanged (the knee bump; the knee and the ear). The chart is at whatever level the child has reached; this walk-through is L1.

1. **The waiting room (built):** the doctor calls; the child taps the tick under a boy in a green T-shirt; he rises.
2. **The diagnosis, the bed:** the boy sits on the bed's edge, legs dangling, hands in his lap, looking at the doctor. The doctor stands to the right, turned three-quarters.
   - The doctor: "Where does it hurt?"
   - The boy: "My hand hurts." (*hath*)
   - The hand's card pops big beside the side panel (a hand picture and *hath*), then flies into the doctor's card.
3. **The light:**
   - **First time only:** the lit box hugs the boy's whole body with a gold glow. The rest dims. No finger.
   - **After 7 s:** the boy says it again.
4. **A miss, then the right tap:**
   - The child taps the knee. The boy giggles and wriggles, and "*hath*" is heard again (a shake and the word, never a cross).
   - The child taps the hand. "Ow!" A soft red glow shows, and a plain tick (it took two tries; a first try gets the gold **Found it**).
5. **The pharmacy (built):** "Bring the plaster." The plaster rides in on the belt; the child taps it into the tray.
6. **The zoom into the heal game:** the camera glides into the arm close-up, lying on the bed's paper strip, a scrape on the back of the hand.
   - The boy: "I fell over."
   - The doctor: "Let's clean it and put a plaster on." His card: three rows (water, cream, plaster).
   - **Shown at the start:** the tray's four things (bowl, cream, plasters, tissue), each lit once in turn.
7. **Row 1, *pela paani*:** the lit box hugs the tray. Tap the bowl (it bounces), then the scrape. A splash, the grit fizzes off, the boy shivers: "*thundo!*".
8. **Row 2, cream, two dabs:** tap the tube (row 1 ticks: the next item was picked), then the scrape. "One" (sparkle, "sss-aah"), "two". The doctor counts aloud, and the count sits on the scrape.
9. **Row 3, the plaster:** tap the plaster (row 2 ticks). The zip peel. Tap the scrape: it smooths on, and row 3 ticks. The boy lifts his hand and wiggles his fingers at it.
10. **The end:** zoom out to the bed.
    - The boy: "Thank you, I feel better."
    - **The send-off (built):** his face circle beams; the child picks the happy card; an apple; bye.
    - **The shared two-page end screen:** the ticks, the bulb, and the review showing *hath* with its picture (English under it only for the grown-up).

The face zoom's first time (a later patient's "my ear hurts"): the lit box hugs the head, a tap glides it in, and the lit box then hugs the face. Shown once, never again.

---

## 5. Later visits and harder versions

- **The chart's levels follow the word tracker,** so returning children meet two new parts a round until all are in.
- **Third visit:**
  - the back joins, with the fever's hot-water bottle
  - the lips join, with the sore spots' ointment bud
  - the stitched cut, if Zafar likes it in play
- **Hard mornings (L4):**
  - two-part patients across two close-ups: "my elbow and my knee", two cures in a row, the child picks the order heard
  - "the drink for the cough, then the one for the tummy"
- **On your yes (each adds to your scope):**
  - **"His knee":** a parent brings a child in and speaks for them (owners: my and his; the master map's pronoun rung). The parent's line decides.
  - **The teddy** comes back with a new sore part each time; a teddy plaster in the evening book.

---

## 6. What it reuses and what's new

**Reused:**

| What | Where |
|---|---|
| The diagnosis D2, its parts data, its face close-up and zoom | `js/clinic/stages/diagnosis.js` (lines 112-128), `data/patients/grey-adult.json` (`closeup`), `data/clinic/pipeline.json` (`parts`, `part_words`, `sided`, `ailments`) |
| The heal host, the zoom, the face circle | `js/clinic/heal/host.js`, `scene.js`, `registry.js` |
| The scrape (wash, dab, plaster; its `plan()`, its dab gesture and bot) | `js/clinic/heal/games/cut.js` |
| The splinter channels, the wince, the soak | `js/clinic/heal/games/foot.js` |
| The drops, the tweezers' deep blob | `js/clinic/heal/games/ear.js` |
| The counter, the four drinks | `js/clinic/heal/games/taste.js` |
| The flash-and-tap wrap | `js/clinic/heal/games/knee.js` |
| The eye game's front-on face (s08c) | `js/clinic/heal/games/eye.js`, `assets/clinic/closeups/girl/` |
| Close-ups already drawn, not yet used | `sources/art/clinic-heal-v3/` (`child-f1-forearm`, `child-f2-forearm-graze`, `child-u1-upperarm`, `child-k3-knee-graze`, `girl-e1-ear`, `boy-e1-ear`) |
| The count rules | `data/rules.json` (`heal-cut`, `heal-foot`) |
| Words through the engine (no Kutchi in code) | `js/clinic/lang.js` |
| The speaking pills, the mic, the handover | `js/shared/` speech and onboarding |
| The two-page end screen, the order card ("Bring me these", CLN-216), the guide box | shared |

**Sprint 16: new to build** (the one playable goal: every part the chart says at L1-L2 can be found and cured):
1. **Chart data:** `parts` tiers "1" (7) and "2" (16, or 15 if the nose waits); the L2 two-part line from one close-up's pairs; D-6, D-7, P-2 to P-5 added to the engine as placeholders (grey "to record").
2. **The face zoom on a head tap,** on the built `closeup`: the head fills the play area's height; a tap outside zooms back; the magnifier button goes; a zoom tap isn't a try. Tap zones checked at 44 px or more inside the zoom at 915x275 on the lab page before any art.
3. **The no-clue rule as code:** the patient's pose and gaze are fixed until a tap.
4. **Gold Found it on a first try only;** a find after misses gets the plain tick.
5. **D1 and D3:** D1 (taught) keeps drawing from tier "1", unchanged. D3 draws each tool's `finds` only where they meet the level's parts (the builder confirms `diagnosis.js` does this, and adds it if not), so finger and toe leave D3 below L4 by themselves. The torch's `finds` gains the nose.
6. **The cut game's rework, on the arm and the knee:** 1-3 scrapes per close-up from a part list; the body-word order at L3 (placeholder D-8); the grit fizz; the peel; the half-fade cream; `rules.json`'s `heal-cut` scrape row; the parked `scrape` ailment back in `ailments`, the stitched `cut` left parked.
7. **The hand variant of foot.js:** the palm art, the finger words, big and small at L3 (placeholder D-9).
8. **`days.mix`:** sessions 1 and 2 unchanged; session 3's game set gains `cut`, and its third patient is the first-ever scrape once; session 4's set gains `cut` (the hand splinter comes in through `foot`).
9. **A check** (`docs/process/checks-to-build.md`): every part the chart (D2) or the check-up (D3) can call at a level has an ailment whose `parts` include it at that level, and no hair hotspot can be called. "No part named without a cure" becomes code.
10. **Leak bot rows** for the chart at L1-L2, the cut game and the hand (`build/leak_clinic.mjs`).
11. **Art for Sprint 16:** the arm close-up and the palm (pictures 1 and 2, after checking the drawn forearm and upper-arm close-ups first), the scrape and its states, the cream tube, plasters, the tissue box (§7).

**Sprint 17: new to build:**
1. The chart's L3 (P-6, P-7: the side or the why) and L4 (the hand and foot zooms; the "4" tier; the diagnosis's level cap from 3 to 4).
2. **The nose game** (about the ear's size): drops, the wipe with the sneeze as a reaction, the bin; the builder rule on the drops row.
3. **The drinks variant of taste.js:** a tummy or chest close-up, no spots step, three remedies in order at L3, the listen step that moves at L3; its L3 leak-bot row.
4. **The cut game on the face, the side-on head and the head bandage** (calls the knee's wrap); the finger and thumb scrapes at L4.
5. **The L3 body or side word in the knee (above or below), the ear, the tooth, the fever and boing.** Small code per game.
6. Leak bot rows for the chart at L3-L4, the nose and the drinks.

**On your yes, then a sprint:** the ankle (decision 3), the teddy (decision 23), "his knee" (§5).

**The budget for Sprint 16's slice** (estimate; the `/brief` for each launch carries the exact one):

| Work | Who | Model, effort | Cost |
|---|---|---|---|
| The chart (items 1-5, 9) | builder 1, the diagnosis | Opus, high (layout and the zoom are visual) | about $35-50 |
| The cut game (item 6), then the hand (item 7), then `days.mix` (8) | builder 2, the heal games, one after the other | Opus, high for the cut game; Sonnet, medium for the hand and the data | about $45-65 |
| Leak bot rows (10) | this chat, fast lane | Sonnet, medium | about $5-10 |
| The judge and `/review` on each game | the `judge` agent | Opus, high | about $15-20 |
| The art (11) | your ChatGPT run; Claude judges and cuts | Opus, medium for the cuts | about $5-10, plus your time |
| **In all** | | | **about $105-155, two to three days** |

This sits beside Sprint 16's agreed work (the clinic game by game, with the "Bring me these" card in each heal game, CLN-216), which isn't in this figure. If both don't fit three days, the scope is cut, never the budget (S08's rule): the slice above goes first, and the other heal games' pass moves on (decision 28, open question E).

---

## 7. The art, and the layout

**Cameras (art bible §3):** one camera per picture.
- **Limbs:** the arm, the hand, the foot lie on the bed's white paper strip, seen straight down (T).
- **Heads:** the face front-on, the side-on head and the drinks' upper body sit up in the upper half against the plain wall, at eye level (E).
- **Tray items:** top-down (T).
- **The diagnosis:** eye level (E), the patient front-on, the doctor three-quarter.

**Reuse first.** Before drawing:
- the forearm, upper-arm and knee-graze close-ups already in `sources/art/clinic-heal-v3/` (`child-f1`, `child-f2`, `child-u1`, `child-k3`): if the forearm and upper arm cover hand to shoulder at the strip's camera, picture 1 isn't needed;
- the ear close-ups there (`girl-e1-ear`, `boy-e1-ear`) for the side-on head. The built ear game draws its head in code (`ear.js` lines 3 and 132-143), which the lessons forbid (§7), so this replaces it, for the ear and the neck alike;
- the eye game's s08c front-on face (`assets/clinic/closeups/girl/eyes-s08c*.webp`, `face-aah-s08c.webp`): the nose and the cheek and chin get new states of this face, not a new face.

**New pictures** (one ChatGPT paste block, against the locked clinic backgrounds and the approved patients; lessons §7):

| # | Picture | Serves | Sprint |
|---|---|---|---|
| 1 | The arm close-up, shoulder to fingertips, palm down, short sleeve (a boy), only if the drawn ones don't cover it | cut game: shoulder, elbow, arm, hand. Shared with boing's redo (its arm failed the judge). | 16 |
| 2 | The palm close-up, fingers spread | the hand splinter; from L4 the finger and thumb scrapes and the chart's hand zoom | 16 |
| 3 | The s08c face, new states: a pink, blocked nose; the "aah… aah…" build-up; the honk into a tissue; clear and happy | the nose; the cheek and chin scrapes | 17 |
| 4 | The upper body, sitting, clothed, neutral pose, a cup in reach (the boy for the cough; either for the tummy) | the drinks | 17 |
| 5 | The side-on head (the girl, then the boy), if the drawn ear close-ups don't serve | the ear's L3 side; the neck scratch | 17 |
| 6 | The foot and ankle from the side | the chart's foot zoom (the toe); the ankle on your yes | 17 |
| 7 | The teddy (front, sitting) | the speaking moment | on your yes |

**Items and effects** (nothing drawn in code: each effect is a sprite state or a short frame set):
- **Sprint 16:** the scrape (one piece, rotated) and its half-faded state; grit specks (3-4 frames of the fizz); the water splash (3 frames); the cream tube; the cream sparkle (3 frames); plasters in four colours (the "photorealistic" plaster style, K1018 P12), each with its backing and a peeled-backing state, and laid flat on skin; the tissue box; a single tissue; the palm's splinter (the foot's, recut).
- **Sprint 17:** a small bin; nose drops (or the ear drops recoloured) and a falling drop (2 frames); the head bandage, wrapped (the knee's bandage recut); the tissue held to the nose.
- **Existing:** the kidney tray, the jugs, the counter pieces, the stethoscope.

**Rules for all of it:** nothing drawn in code (code only moves real art); no drop shadow on things resting on the strip; calm faces; gentle zooms.

**Layout** (two layouts by height), checked on the lab page at **740x320, 930x430, 1280x665 and 1920x1080** (Zafar, 27 Oct), and at **915x275** (the Z Fold) as the hardest phone:

**Phones (740x320, 930x430 and 915x275):**
- The side panel on the left, holding the doctor's card. The play area to the right.
- **The diagnosis:** the patient fills the play area's height; the doctor is cropped at the waist at the right edge. Tap zones are invisibly bigger than the part (at least 44 px). The face's parts only inside the face zoom (the head fills the play area's height), and from L4 the fingers, thumb and toes only inside their zooms.
- **Close-ups:** fill the play area. The tray is a column on the play area's right edge, items at least 64 px at 320 tall and 56 px at 275. The face circle sits in the heal host's corner, clear of the cog.
- **At 915x275 (the Z Fold):** the arm lies along the long axis, which fits naturally. The face close-up crops at the forehead and chin, not at the nose.

**Big screens (1280x665, 1920x1080):**
- The same composition. The tray becomes a strip along the bottom counter.
- More of the blurred room shows around the close-up, taken from the scenery, never from the items or faces.

**Bubbles** go into free space, never over a face or the panel.

---

## 8. What it borrows

| Source | What we take | How we keep the word deciding |
|---|---|---|
| **Toca Doctor** | pull the splinter ("ow!"), clean and plaster, simple reactions | Toca has no words; we make the said scrape and finger decide, and answer its "unclear what to tap" with the lit box. |
| **Dr. Panda's Hospital** | the tap-a-patient start, a small reward at the end | The apple, never a sticker shop. |
| **Toca Pet Doctor** | the ending: the patient content and well | The send-off's "better". |
| **Little Kids Foot Doctor, Hand Doctor for Kid** | a whole game on one limb, colourful plasters | The colour is heard, not chosen freely. |
| **Education.com's "Let's Play Doctor"** (offline) | a grown-up acts out where it hurts, the child finds the word | The patient's heard line does it, with no acting (no clue on the body). |
| **The research's "sneeze" note** (other-games report §16) | the tickle, the build-up, "atchoo!" | A reaction to the tissue, always caught, no timer (the research warns speed and listening fight; Studycat removed timers). |
| **Our own games** | the knee's wrap and kick, the ear's "wax that keeps coming", the foot's channels, Cook's stir, the D2 face close-up | |

Sources (web, 1 Nov): [Toca Doctor (GeekDad)](https://geekdad.com/2011/05/practice-treating-ailments-with-toca-doctor/); [Toca Doctor (BridgingApps)](https://bridgingapps.org/bridgingapps-reviewed-app-toca-doctor/); [Little Kids Foot Doctor](https://apps.apple.com/us/app/id1081388171); [Hand Doctor For Kid](https://toucharcade.com/games/hand-doctor-for-kid); [Let's Play Doctor (Education.com)](https://www.education.com/activity/article/Lets_Play_Doctor); [Lingokids: at the doctor's](https://lingokids.com/english-for-kids/at-the-doctors).

---

## 9. The lessons checklist

### 1. The heard word decides: passed, with one exception
- Every leak test is written out (§3), with odds for every level that has a new rule, the drinks' L3 included.
- The deciding words are named; only *kan* is a clip among the parts.
- Gold ticks only on a right first try; a find after misses gets the plain tick.
- The need isn't settled by the picture: no clue on the body, look-alike scrapes and splinters, a neutral pose in the drinks.
- Two words per move from L2.
- Body words, not only numbers, decide in every heal game from L3.
- **The exception:** it doesn't teach until the family records about 34 clips for Sprint 16 (68 in all), and the missing frames are gaps (§1). The reader leak stands until then.

### 2. Onboarding and the first round: passed
- The first round is the tutorial (§4), in session 3; sessions 1 and 2 are untouched.
- One lit box; no finger.
- The tray's items are shown at the start.
- The face zoom has its first-time showing; so does every new screen (the nose, the drinks, the hand).
- Tap, then tap; the only drags are the splinter's track and the stir.

### 3. Instructions: passed
- The asker (patient or doctor) speaks before the card.
- The card never changes; the guide box names the step.
- Bubbles come from faces; the exchange is modelled by the doctor and patient.
- Replays are free and say only what's left.
- One line per moment.

### 4. Pacing: passed
- No Next and no Done; steps close by themselves.
- A tap skips speech.
- Hints at 7, 9, 11, 13 s.
- A counted row closes on the next item's tap; nothing starts on a count being reached (the builder rule, §3).
- The ask repeats for non-readers.
- No timers: the sneeze waits for the tissue.

### 5. Feedback and the end: passed
- A shake and the word; a funny reaction per miss.
- Rows tick at the close; the count sits on the scrape.
- It ends when the job's done, back on the bed: "aah", then "better".
- The shared end screen.

### 6. Layout: designed for the four sizes and the Z Fold (§7); to be checked on the lab page
- Faces stay clear.
- Items stay big on phones.
- The face's parts are tapped only in the zoom, at 44 px or more.
- The left is kept for cards; the cog is the only button.

### 7. Art and camera: passed
- One camera per picture; one moment per prompt.
- Nothing drawn in code: every effect is listed as art (§7), and the ear's code-drawn head is replaced.
- Plasters in the real style.
- Reuse first; one paste block per sprint.

### 8. Speaking: on your yes
- If built: inside an exchange watched many times; three pills always there (no bonus); never a gate; the shared pattern.

### 9. Levels: passed
- Each level adds one thing; L4 is its own (zoom and look-alikes, two-colour plasters, both sides).
- The gestures never get harder.
- Level up after three rounds with at most one hint each.

### 10. Words: passed, with the gaps reported
- Every line is listed with its speaker and status (§1).
- Built from recorded frames where they exist; the missing frames are named.
- One natural sentence per person.
- Whatever is said is written (counts, colours, sides on the card).
- At most two new parts a round, each heard at least three times.

### 11. Culture: passed
- No sweets as a reward or a cause shown: the tummy's story is "too much at the birthday party", no sweets named.
- Modest close-ups (sleeves, a clothed body); the boy is the chest patient.
- Nothing a child could copy and get hurt by (nothing in the nose, the bud not a pin).

### 12. Fun: passed
- The hands are busy at every step.
- "Kind of funny": the gasp, the sneeze into the tissue, the burp.
- The splinter's path.
- Errands never repeat a game in a morning.

### 13. Mistakes made twice: guarded
- The L3 rule is applied to all eight live games, not one (§3F), and the knee gets a real word.
- Every level is designed.
- Film the face zoom and the sneeze rather than judge stills.
- No design questions are left for the builder: the zooms, the two-part line, the dab gesture, D1 and D3, and `days.mix` are decided (§10, decisions 29-34).
- No mechanic is removed: the stitches are kept, sessions 1 and 2 are kept, and so are hair and the tummy's code. The magnifier button goes, but its zoom stays (decision 29).

### The ten questions
1. **The heard words:** the parts, sides, why words, counts, colours, items. Recorded: *kan*, plus the helpers in §1.
2. **The Sceptic at L2 and above:**
   - She can't win by the body (no clue), the zoom (it opens for any tap), the scrapes (all alike), the side (no glow), the drinks' sound (moved at L3) or a count (rows close on the next tap).
   - Elimination isn't blocked but is scored in the review; first-try blind odds are under 10% everywhere.
3. **The open need:** which part, which scrape first, which side, which drinks.
4. **The first round:** §4.
5. **Who asks:** the patient ("my ___ hurts") and the doctor ("first …, then …"), both on screen.
6. **The hands:** a tap at every step.
7. **The funny moments:** the "*thundo!*" gasp, the sneeze into the tissue, the burp, the giggle on a miss.
8. **The end:** "Thank you, I feel better", then the apple at the send-off.
9. **Each level:** §3; L4 is its own.
10. **Fit:** the four sizes and the Z Fold, real art, one camera per scene (§7).

---

## 10. Decisions made for Zafar overnight

Each line: the choice, the reason, my assumed answer. "Yes to all except …" works. Decisions marked **adds to your scope** go beyond your 1 Nov word and aren't built until you say yes.

1. **The chart holds its parts in three tiers:**
   - L1: as built, 7 parts
   - L2: adds the eye, nose, mouth, tooth, tummy, chest, elbow, shoulder, neck (16)
   - L4: adds the finger, thumb, toe, cheek, chin, tongue, throat (23; 24 with the ankle)

   Elbow, shoulder and neck move from L3 to L2; finger and toe from L3 to L4 (they're too small without the zoom). A part joins only once its cure is built: if the nose game isn't in Sprint 16, the nose waits for Sprint 17 (L2 then has 15). *Why:* big parts first; small parts with the zoom; one new thing per level; your no-cure rule. *Likely:* yes.
2. **Hair, back and lips stay off the chart** until each has a cure. *Why:* your rule, any part said must be treatable; hair stays parked. *Likely:* yes.
3. **Adds to your scope. The ankle joins at L4, with the knee's wrap on a twisted ankle.** *Why:* the most natural reskin; it's an A2 word. Not in any sprint until you say yes.
4. **The chart's L3 is "other ways of saying it":** the side (as built) or only the why ("I've got a cough" → the chest). *Why:* it makes the health half decide a move, as you asked, and matches the rulebook's L3. *Likely:* yes.
5. **The chart's L2 names two parts in one line, once a morning, from parts one close-up treats** (in Sprint 16, two of hand, arm, elbow, shoulder, then the cut game with those two scrapes). *Why:* the rulebook's two words per move from L2; one close-up keeps one cure. It's new, so flagged. *Likely:* yes.
6. **The face is found by zooming at every level; the hand and foot from L4.** Tap the head, the face fills the screen, tap the part. *Why:* on a 275 px phone the head is about 60 px, too small for five parts; the code already has this zoom. *Likely:* yes.
7. **No clue on the body:** hands in the lap, eyes on the doctor, no mark until tapped. *Why:* the leak (the research: a visible wound picks the part). *Likely:* yes.
8. **Each miss on the chart gets a different playful reaction** (a giggle, a toe wriggle, a shrug, a playful *na*). *Why:* nothing makes a child feel bad, and misses become fun. *Likely:* yes.
9. **The scrape is the default cut game; the stitched "cut" stays in the code unchanged** but isn't drawn into mornings until you play it. *Why:* your "simple cut game (clean, dab, plaster)", and non-negotiable 1. *Likely:* yes.
10. **The scrape's boredom fix:**
    - the grit fizz
    - the "*thundo!*" gasp
    - the peel and stick
    - 2-3 look-alike scrapes from L2, with the body word picking which first at L3

    *Why:* CLN-172, "nothing really to do". *Likely:* yes.
11. **The scrape's numbers are dabs + scrapes: 1-2+1, 1-3+2, 2-4+2, 2-4+3,** with two-colour plasters at L4. `rules.json`'s `heal-cut` gets a scrape row; the stitches keep theirs. *Why:* the rulebook's one-thing-repeats rule; the scrape has no stitches. *Likely:* yes.
12. **The head bump:** clean, then the knee's flash-and-tap wrap round the head (Sprint 17). *Why:* your own idea, and cheap. *Likely:* yes.
13. **The neck scratch comes from a rose bush in Nani's garden,** not the cats. *Why:* Simba and Zazu stay loved. *Likely:* yes.
14. **The hand splinter:**
    - the soak in hot or cold (*garam*, *thundo*, both recorded)
    - the fingers named from L2
    - big or small at L3
    - the narrow channels at L4

    *Why:* it mirrors the foot, and uses recorded words. *Likely:* yes.
15. **Nose safety:** drops fall from above, nothing goes inside, the tissue wipes outside, and the patient blows. Mum sees the mock-up first. *Why:* your 1 Nov answer, and copy safety. *Likely:* yes.
16. **The nose keeps your wipe: drops, then a tissue to wipe; the sneeze is the reaction when the tissue arrives,** always caught, no timer. The drops row closes only on the tissue tap. *Why:* your 1 Nov words; the research warns timers fight listening. *Likely:* yes. If you'd like a catch-in-time instead, say so: it adds a timer to the clinic (timing in `rules.json`).
17. **The drinks: taste.js's four, kept:** ginger and water for the tummy, honey in milk for a cough, turmeric milk for the throat, lemon and water always on the counter. Mum confirms these are the family's. *Why:* the built four keep a blind guess under 10%. *Likely:* yes, pending Mum.
18. **The drinks' L3:** two of three complaints (tummy, cough, throat), asked in order, from the four drinks; the listen step moves after the drinks, the pose stays neutral. Blind odds about 8% (3% with the count). *Why:* the coin-toss leak. *Likely:* yes.
19. **Your 1 Nov "body or side word at L3" applies to every live heal game** (§3F). *Why:* newest word wins. **This reverses your 14 Oct ear decision** (decision 97 (8): the ear's side at L4) and supersedes the 13 Oct "L3 = heard only" ladder. The card follows the rulebook (picture blurred at L3, each word fading by its own ladder). *Likely:* yes.
20. **The knee has no side word today** (the side is tested in the diagnosis only; its close-up shows one knee). **Its L3 word: where the bandage goes, "above the knee" or "below the knee".** *Why:* your 1 Nov rule needs a word in the knee's own rows. *Likely:* yes.
21. **"Careful" (*dhyan rakh*, recorded):** on the foot's and the hand's wince, and before the ear's deep blob (which then moves at half speed). *Why:* your 1 Nov placement. *Likely:* yes.
22. **The headache and the fever land on the head and lead to the fever game.** *Why:* it already treats the head; no new game. *Likely:* yes. The alternative is a cool cloth of its own on a later visit.
23. **Adds to your scope. A speaking moment: Isa's teddy,** carried in by Ma; from L3, once every third morning; the child speaks for the teddy ("my tummy hurts"); three pills (no bonus); never a gate. Not built until the speaking pilot (chai) has run and you say yes. *Why:* no new recording; it's pretend play; it fits `speaking.md`'s "you're the patient" row.
24. **"No part named without a cure" becomes a check in code,** covering D2 and D3 and the hair hotspots. *Why:* keep it small; a rule that can be code is a check. *Likely:* yes.
25. **Recording: about 68 clips in all, 34 for Sprint 16** (§1's table). The doctor records his own asks (your 14 Oct word); Mum the patients' lines and the words. No store build with placeholders. *Why:* the reader leak and non-negotiable 2. *Likely:* yes.
26. **Reuse the drawn close-ups first;** then up to six new pictures across two sprints (arm if needed, palm in 16; the face's new states, the upper body, the side-on head if needed, the foot in 17), the teddy on your yes. Every effect is art, not code. *Why:* reuse first; nothing drawn in code. *Likely:* yes.
27. **The parked tummy and foot stories move to the birthday:**
    - the tummy: "I ate too much at the birthday party" (no sweets named)
    - the foot: "I danced all afternoon at the birthday party" (a nod to musical statues)

    *Why:* your 1 Nov yes. *Likely:* yes.
28. **Sprint 16's one playable goal for this game: every part the chart says at L1-L2 can be found (the face by zoom) and cured; the cut game un-parked on the arm and knee; the hand splinter.** About $105-155, two to three days, two builders (the diagnosis; the heal games), Opus high for the visual work, Sonnet medium for the mechanical. Sprint 17 takes the chart's L3-L4, the nose, the drinks, the head bandage and the L3 words in the live games. *Why:* ten build items, six pictures and 68 clips are two or three sprints, not one. *Likely:* yes.
29. **The face zoom opens on any tap on the head,** at every level; the head fills the play area; a tap outside glides back; the magnifier button goes (its zoom stays). The forehead counts as the head. *Why:* the cog is the only button on the play screen; a zoom that opens for any tap tells the child nothing. *Likely:* yes.
30. **At L1-L3 a tap on the hand or the foot is the answer; from L4 it always opens the zoom,** and the whole hand or foot is a target inside it. A zoom tap is never a try; a tap on a wrong part, in or out of a zoom, is a miss with its playful reaction. *Why:* one rule for every zoom, and no feedback from the zoom itself. *Likely:* yes.
31. **The diagnosis's level cap rises from 3 to 4** (for the L4 tier); D1 keeps tier 1; D3 draws its tools' `finds` only within the level's parts, and the torch finds the nose. *Why:* the parts data is shared by D1, D2 and D3. *Likely:* yes.
32. **The cream's gesture is the built one:** tap the tube once, then the scrape N times; picking the next item closes the row. *Why:* it's how `cut.js` works today. *Likely:* yes.
33. **Sessions 1 and 2 stay as they are** (the knee; the knee and the ear). The first-ever scrape is session 3's third patient; the cut game joins sessions 3 and 4, the hand splinter through `foot`. *Why:* moving the hand into session 2 would drop the ear (non-negotiable 1). *Likely:* yes.
34. **Counted rows close on the next item's tap, and nothing (a sneeze, a light, a next step) starts when a count is reached.** A rule written into each builder's brief. *Why:* the fever's "just right" leak (CLN-176). *Likely:* yes.
35. **Gold Found it on a first try only;** a find after misses gets the soft glow and a plain tick. *Why:* ticks mustn't let a child fish. *Likely:* yes.
36. **"That tickles" and "excuse me" are giggles, not lines.** *Why:* fewer clips, and a giggle needs no Kutchi. *Likely:* yes.
37. **The cough patient is the boy; the tummy patient either.** *Why:* the stethoscope on a girl's chest costs nothing to avoid. *Likely:* yes.
38. **Spellings follow the repo:** *haa* (not *ha*). *Why:* one spelling everywhere until you confirm. *Likely:* yes.

**Open questions that are genuinely his (or Mum's):**
- **A. The remedies (decision 17):** ginger for the tummy, honey in milk for a cough (or honey and lemon, which needs a two-thing drink in code), turmeric milk for the throat. Mum's call, and the Kutchi for honey, cream, tissue and plaster.
- **B. The sides:** the chart uses the patient's own left (as built), the mirror of the child's. It was never questioned in play. Should the L3 side words get a first-time showing (the doctor lifts the patient's left hand), or stay as they are?
- **C. For Mum's sheet:** how does the family say a headache, a toothache, an earache and a tummy ache: a word of its own, or "my ___ hurts"? A cold, a cough and a fever are the certain why words; the other four are whatever she gives.
- **D. Two word forms:** *jamni* (she-form, the lexicon) or *jamno* (`clinic.md`) for "right" in "on the right side"; and *garam* or *koso* for hot (the two *garam* takes are whose?).
- **E. Sprint 16:** this slice and your 30 Oct "clinic, game by game, with the 'Bring me these' card" may not both fit three days. Recommended: this slice first, each game played by you before the next, then the other heal games' pass; if it runs long, the pass moves to Sprint 17.

---

## 11. ChatGPT mock-up prompts

Five versions that look different, one moment each:
1. the chart (Sprint 16)
2. the scrape (Sprint 16)
3. the nose (Sprint 17)
4. the drinks (Sprint 17)
5. the hand splinter (Sprint 16)

Every prompt asks for 16:9 with everything that matters inside the middle band, so it crops to about 2.3:1 (740x320), 2.2:1 (930x430) and 3:1 (915x275). The references are the clinic's own locked backgrounds and approved patients, not Cook's. They run after the backgrounds are locked (lessons §7).

### Prompt clinic-every-part-1: the body chart ("where does it hurt?")

The image should show the diagnosis with no clue on the body: the patient on the bed, looking at the doctor, a soft glow on the one part just tapped. That's what makes the chart a listening game.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene, at eye level, matching the attached examination-room background: a calm, modern doctor's examination room with limewash cream walls, a pale oak floor and a plain wall behind the patient. A boy of about seven, as in the attached boy reference, in a green short-sleeved T-shirt and knee-length navy shorts, sits on the edge of a padded examination bed covered by a white paper strip, legs dangling, both hands resting in his lap, looking at the doctor, not at his hands. He has no mark, bandage or redness anywhere. To the right stands the doctor from the attached doctor reference, turned three-quarters towards the boy, holding a clipboard, friendly.

The moment: the child has just tapped the boy's right hand. A soft, warm red glow surrounds that hand only. The boy's face shows a small "ow" wince that is comic, not upset. Nothing else glows or changes.

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, clean surfaces, big expressive eyes, no outlines, no photorealism, no blur or vignette.

Absolutely no text, letters or numbers anywhere: not on the clipboard, the walls, the clothes or any sign. No inset, bubble, frame or interface element.

Must read at phone size (740x320 and 915x275): the boy's whole body, his hands and the glow, large and uncluttered. Keep the left quarter of the frame plain wall.

Wide landscape, 16:9, with the boy and the doctor inside the middle band so it crops to 3:1 without losing a face.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-v2/cb2b-exam-bed-close-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/boy-w1-front-neutral-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08c/dw2-doctor-3q-left-v1.png
```

### Prompt clinic-every-part-2: the cut game (the scrape)

The image should show the arm close-up with two look-alike scrapes and the cold-water splash. That's the reworked scrape: the body word picks which one, and the patient gasps.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene, seen straight down from above, matching the attached close-up bed: a boy's arm, from the shoulder to the fingertips, lies along a white paper strip on an examination bed, palm down, with a green short sleeve at the shoulder, drawn like the attached forearm close-up. There are two small, identical, pinkish grazes: one on the elbow and one on the back of the hand. They are comic and clean, never bloody or gory. The blurred, warm room shows around the edges.

On the right edge stands a neat column tray, also seen straight down, holding:
- a small steel bowl of clear water
- a white cream tube
- a fan of fabric plasters in red, blue, green and yellow
- a tissue box

The moment: the water bowl has just been tapped, and a bright, splashy wash of clear water lands on the elbow graze. Tiny specks of garden grit lift off it in little sparkles. In a round face circle in the top corner, the boy shivers with a funny wide-eyed "cold!" face.

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (steel, cotton, paper), soft contact shadows, no outlines, no photorealism.

Absolutely no text, letters or numbers anywhere: not on the tube, the plasters or the tissue box.

Must read at phone size (915x275 and 740x320): the two grazes clearly separate and the same size, each tray item big and distinct, and the face circle.

Wide landscape, 16:9, with the arm and the tray inside the middle band so it crops to 3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-v2/cb6-closeup-bed-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/child-f2-forearm-graze-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/boy-w1-front-neutral-v1.png
```

### Prompt clinic-every-part-3: the nose (the tissue arrives)

The image should show the moment the tissue reaches the blocked nose and the sneeze builds, with the dropper already back on the tray. It shows the safe care: nothing goes inside the nose, and the tissue only wipes the outside.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene, at eye level: the head and shoulders of the girl in the attached face reference, about six, front-on, sitting up against a plain limewash cream wall. She wears a plain cream kameez with a few bold red motifs at the neck, and her dark hair is in a neat plait. Her nose is a little pink at the tip. Her eyes are squeezed half shut and her mouth is open in a comic "aah… aah…" build-up just before a sneeze, with her shoulders lifted.

The moment: a soft white tissue, just pulled from its box, has arrived in front of her nose, touching only the outside of it. The small glass dropper with a rubber bulb lies back on the tray, finished with.

A small steel tray at the bottom edge, seen from above, holds:
- the tissue box
- the glass dropper
- a white cream tube

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, big expressive eyes, rosy cheeks, no outlines, no photorealism. Funny and gentle: nothing messy or gross.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (740x320 and 915x275): her face and the tissue big and clear, with the tray items still recognisable.

Wide landscape, 16:9, her face inside the middle band so it crops to 3:1 at the forehead and chin, not at the nose.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08c/gz2-girl-face-eyes-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08c/gz1-girl-face-aah-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-v2/cb6-closeup-bed-v1.png
```

### Prompt clinic-every-part-4: the drinks for a cough or a tummy ache

The image should show the small counter with all six ingredients, an empty cup, and the patient waiting with no clue about what's wrong. It shows that the child makes the remedy, and that the heard words pick from many things.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene: on the left, the boy from the attached reference, about seven, sits up on an examination bed, front-on, fully clothed in a green T-shirt, both hands resting in his lap, looking hopefully towards a cup. His face is calm and friendly, with no sign of what is wrong: no hand on his chest or tummy, no cough, no wince.

On the right, a small marble counter is seen from slightly above, with six clearly different ingredients in a row:
- a jar of golden honey with a wooden dipper
- two halved yellow lemons
- a knob of fresh ginger
- a small brass bowl of turmeric powder
- a steel jug of milk
- a steel jug of water

In the middle sits an empty steel cup with a teaspoon resting beside it. Nothing is moving: no steam, no drips, no pouring.

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (steel, brass, glass, marble), soft contact shadows, no outlines, no photorealism. Modest, warm and calm.

Absolutely no text, letters or numbers anywhere: not on the jars, jugs or bowls.

Must read at phone size (915x275 and 740x320): each of the six ingredients distinct and big enough to tap, plus the cup and the boy's face.

Wide landscape, 16:9, with the boy, the counter and the cup inside the middle band so it crops to 3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/boy-w1-front-neutral-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-v2/cb2b-exam-bed-close-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/clinic/items-v2/honey-jar.webp
```

### Prompt clinic-every-part-5: the hand splinter

The image should show the palm close-up with splinters in named fingers, each on its own winding path, and one partway along it. That's the hand's version of the foot game, and the place where "careful" is said.

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene, seen straight down from above, matching the attached close-up bed: a child's open hand lies palm up on a white paper strip, fingers gently spread, with a green short sleeve at the wrist. There are three tiny wooden splinters:
- one in the thumb
- one in the middle finger
- one in the little finger

Each sits in its own faintly lighter, winding channel that runs with soft right-angle turns to the edge of the hand. The splinter in the thumb is halfway along its channel, sliding along it by itself: no tweezers, no tool and no other hand anywhere in the picture. A small sparkle marks its progress. The skin is clean, never bloody.

In a round face circle in the top corner, the child's face shows a brave, scrunched "careful…" expression.

At the right edge, a steel kidney tray seen from above holds:
- a fan of coloured fabric plasters
- two small jugs, one with gentle steam (hot) and one beaded with cold drops (cold)

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, soft contact shadows, no outlines, no photorealism.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (740x320 and 915x275): the three channels clearly separate, the splinters visible, the jugs' hot and cold easy to tell apart, and the face circle.

Wide landscape, 16:9, with the hand and the tray inside the middle band so it crops to 3:1.

References to attach:
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-v2/cb6-closeup-bed-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/child-p1-sole-v1.png
https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/boy-w1-front-neutral-v1.png
```

---

## 12. Changes after the critique

The critique (`build/reports/designs/clinic-every-part-critique.md`, 1 Nov): 6 MUST, 9 SHOULD. Every MUST applied; every SHOULD applied. Where it met Zafar's recorded word, his word won (finding 6, below).

1. **MUST, the recording budget and the frames.** Done. §1 now has "Every line, who says it, and what's missing": the doctor's 14 asks (his recording, Zafar 14 Oct) and Mum's 10 lines and words, each marked recorded, in the engine, or missing, with the sprint. Eighteen missing frames (ten of the doctor's, eight of the patients') are reported as gaps. The count is about 68 clips, 34 for Sprint 16; "Where does it hurt?" moved off Mum's list. It says what plays in Kutchi today (almost nothing) and that every L3 line needs a new frame. Decision 25 rewritten.
2. **MUST, the face at L2 on a 275 px body.** Done. The face is a zoom region at every level (the ear is already a face part at L1), on the built `closeup` and `diagnosis.js` zoom; any tap on the head opens it, the head fills the play area (about 4x on a 275 px phone), a tap outside closes it, the magnifier button goes. Tap zones checked at 44 px on the lab page before any art. §3A, §6 item 2, §7, decisions 6 and 29.
3. **MUST, the drinks' L3 leak.** Done. Three remedies in play (tummy, cough, throat), two asked in order, taste.js's four drinks kept (lemon and water always on the counter, so the second is never forced). Blind odds 1/12 ≈ 8%, about 3% with the count, written in the table, with a leak-bot row. The cough's remedy follows the built "honey in milk" unless Mum says honey and lemon (open question A). §3E, decisions 17 and 18.
4. **MUST, the nose's count leaking by waiting.** Done. The builder rule: the drops row closes only on the tissue-box tap, and the twitch starts on that tap, never on the count. Written once as a rule for every game here (§3 intro, decision 34) and in §3D's steps and leak table.
5. **MUST, builder questions left open.** Done, each decided:
   1. The zooms: the face at every level; the hand and foot only from L4 (a direct answer before); a zoom opens for any tap on its region and is never a try, so it says nothing; a wrong part is a miss with its reaction; the diagnosis's zoom is told apart from the heal game's glide (decisions 29, 30).
   2. The L2 two-part line: only pairs that one close-up treats, so one heal game follows and the pharmacy asks as usual; in Sprint 16, the arm's pairs into the cut game's two scrapes (decision 5).
   3. The dab gesture: as `cut.js` does it, tube once then the scrape N times (decision 32).
   4. D1 and D3: D1 keeps tier 1; D3 draws `finds` only within the level's parts; the torch finds the nose; the diagnosis's level cap rises to 4 for L4 (§6 item 5, decision 31).
   5. `days.mix`: sessions 1 and 2 unchanged, so the ear stays; the first scrape is session 3's third patient; the change is on the build list (§2, §4, §6 item 8, decision 33).
6. **MUST, the sprint size.** Done, with Zafar's word kept: Sprint 16 was already "the clinic, game by game, with the 'Bring me these' card" (30 Oct), so this game's slice joins it with one playable goal: every part the chart says at L1-L2 found (the face by zoom) and cured, the cut game on the arm and knee, the hand splinter. Sprint 17 takes the rest; the ankle, the teddy and "his knee" wait for his yes. Budget written per launch (model, effort, cost; about $105-155). §0, §6, decision 28, open question E.
7. **SHOULD, scope beyond his word.** Done. Decisions 3 (the ankle) and 23 (the teddy) say "adds to your scope" and are out of every sprint's build list; the timed catch is gone (finding 11); "his knee" moved under "on your yes" in §5; the two-part L2 line is flagged as new (decision 5). The teddy moved from Ali (tall and lanky) to Isa's teddy, carried in by Ma.
8. **SHOULD, the knee's L3 word.** Done. Decision 20 rewritten: the knee has no side word today (`knee.js` lines 12, 83-84); its L3 word is where the bandage goes, "above or below the knee" (D-14), or "the knee, then the ankle" if the ankle joins. §3F.
9. **SHOULD, the code-drawn head and effects.** Done. The side-on head is art (the drawn `girl-e1-ear` and `boy-e1-ear` first, else picture 5), shared by the ear and the neck; every effect is listed as sprite states or frames (splash, grit fizz, cream sparkle, half-faded scrape, peeled backing, plaster on, head bandage, falling drop); the nose's face is new states of the eye game's s08c face, not a new face. §7.
10. **SHOULD, Found it after fishing.** Done. Gold Found it and the "ow" on a first try only; after misses, the soft glow and a plain tick. §3A, §4 step 4, decision 35.
11. **SHOULD, the timed catch replacing the wipe.** Done. Zafar's "drops, then a tissue to wipe" is the step; the sneeze is the reaction when the tissue arrives, always caught, no timer; the cotton-ball flurry and its art are gone. Decision 16 offers the catch only if he wants it, saying it adds a timer.
12. **SHOULD, the why rung collapsing.** Done. A cold, a cough and a fever are the certain why words; headache, toothache, earache and tummy ache are whatever Mum gives, and leave the L3 why rung if they're "my ___ hurts". Open question C for her sheet.
13. **SHOULD, the prompts.** Done. One moment per picture. 1: the inset dropped, the glow alone, no clue on the body. 3: the tissue arrives with the dropper back on the tray, no falling drop, no cotton flurry. 4: the boy, neutral pose, an empty cup, nothing falling or steaming. 5: "no tweezers, no tool and no other hand: the splinter slides along its channel". All five: the clinic's own backgrounds and approved patients and doctor as references instead of Cook's, 16:9 with a middle band that crops to 740x320, 930x430 and 915x275; §7's layout now names all four check sizes.
14. **SHOULD, the small corrections.** Done. *ha* → *haa*, as the repo spells it (decision 38); *jamni* (she-form) vs *jamno* and *garam* vs *koso* are open question D, with *garam*'s two takes to be named; the check covers D3's calls and the hair hotspots (§6 item 9, decision 24); the teddy's pills earn no speaking bonus, as `speaking.md` says; decision 19 now says "this reverses your 14 Oct ear decision".
15. **SHOULD, the chest patient.** Done. The cough patient is the boy, the tummy patient either (§3E, prompt 4, decision 37).
