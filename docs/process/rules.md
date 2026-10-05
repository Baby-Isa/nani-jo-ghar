# Nani jo Ghar: the rulebook

Every standing rule Zafar has given for building Nani jo Ghar, de-duplicated and grouped by who or what it's for. **The newest word from Zafar wins:** if a newer message from him clashes with this file, follow him and update it.

The full harvest with sources, superseded rules and the conflicts table is `docs/process/rules-harvest.md`; the IDs in brackets point there (A1 = R-A1), and "decision n" points to the decisions log at the end.

Compiled 30 Sept 2026, with Zafar's answers of 30 Sept (19:30 UTC) applied.

## Contents

- [Top rules](#top-rules)
- [1. Working with Zafar](#1-working-with-zafar)
- [2. Sessions, agents and git](#2-sessions-agents-and-git)
- [3. Quality and review](#3-quality-and-review)
- [4. Game design: every mode](#4-game-design-every-mode)
- [5. Game design: modes, story and progression](#5-game-design-modes-story-and-progression)
- [6. UI and visual design](#6-ui-and-visual-design)
- [7. Art and assets](#7-art-and-assets)
- [8. Language, Kutchi and voice](#8-language-kutchi-and-voice)
- [9. Characters, family and culture](#9-characters-family-and-culture)
- [10. Platform, privacy and release](#10-platform-privacy-and-release)
- [Open questions](#open-questions)
- [Decisions log, 30 Sept](#decisions-log-30-sept)

## Top rules

> **The non-negotiables. Every session follows these.**
>
> 1. **Discuss first; act only when told.** No builds, agents or assets while Zafar is talking it through or while any question to him is open. (A1, A2)
> 2. **If Zafar didn't comment on it, leave it**, and never remove or replace a mechanic without his explicit OK. (A4, A5)
> 3. **Fix it properly, once.** A fixed issue stays fixed: every past feedback item is on the regression list and rechecked at every review. (A8, C6)
> 4. **Never invent Kutchi.** Mum (with Masi as second opinion) is the only authority; two AIs agreeing is not evidence. (G1)
> 5. **No written English for the child, ever.** Spoken English only in story mode, then the Kutchi, kept rare; none in games or help. (E1, G15, decision 12)
> 6. **Pass the Kutchi leak test:** someone who knows no Kutchi can't win by reading, matching, eliminating or waiting. (C10)
> 7. **Done means looked at, not tests passed.** Every state is screenshotted and judged, flaws listed first, by someone other than the builder. (C1, C3, C4)
> 8. **The same shared screens and buttons in every mode**, from `js/shared/`, never restyled. (F1)
> 9. **No clipped or ellipsised text, anywhere.** (F7)
> 10. **Only real family voices ship;** no TTS or AI Kutchi. (G14)
> 11. **Every line is a full, natural sentence built by the engine; every word heard is a real family voice**: frequent phrases recorded whole, the rest assembled from recorded words; never hand fixes. (G9, G10, G12, decision 13)
> 12. **Nothing makes a child feel bad:** progress not verdicts, never wait for speech, take it back until Done. (E5, E10, E14, E30)
> 13. **Art is made in ChatGPT via Claude in Chrome** from one ready-to-paste block; a paid API only for a rapid prototype under $2. (D1, D3)
> 14. **Sessions:** at most ~4 at once, no helper sessions, complete briefs, `bump_version` and one push to `main` at the end. (B1, B3, B4, B6, B7)
> 15. **Be cost-conscious** and recommend a model and effort level with every suggested action. (A11, A12)
> 16. **The family is Khoja Shia Ithna'asheri Muslim** (internal only, never named in the game or public material): halal only, no Hindu religious markers; never sweets, lollies or biscuits as rewards. (I1, I2)

---

## 1. Working with Zafar

### Discussing and acting
- **Discuss first, act only when told.** While Zafar is thinking aloud or asking, talk it through and write the plan for his review; queue a build only when he says "queue it". (A1)
- **Never launch a build or agents while a question to him is open.** An overnight run on an agreed plan still goes ahead. (A2)
- **When he says more is coming, collect, don't act.** Transcribe and list, but plan nothing until he's done; "wait for my next message" means do nothing. (A7)
- **Improve on his ideas.** Zafar states the aim; Claude proposes the how, researches best practice and pushes back where it should. (A9)

### Decisions and scope
- **Put decisions as a numbered Q list, each with a recommendation**, answerable "yes to all except …"; write his answers into the doc. (A3)
- **Change only what he commented on,** and never remove or replace a mechanic or mini-game without his explicit OK. (A4, A5)
- **Fix things properly the first time** (new art if that's what it takes), and apply one game's lessons to its sibling games before he plays them. (A8, A16)
- **Before calling a mode finished, go through its open ideas in `docs/ideas.md` with him;** ideas there are marked done when built, never deleted. (A14)
- **New mode work runs audit (screenshots of every screen) → Claude's feedback draft → Zafar approves → build.** (A22)

### Reports and handing things over
- **Voice-note feedback becomes a full report:** every point with its timestamp, cause checked in code, fix, plan, and a coverage check mapping every transcript line. It opens with every mechanic changed and old art reused. (A5, A6, D10)
- **Hand Zafar exactly what to do, ready to paste:** one block for Chrome, one message for a running session, the link and what to play (`labs.html` links every lab). (A10)
- **Keep replies short and plain;** explain when asked and don't assume he remembers ids. (A26, A27)
- **Be cost-conscious:** recommend a model and effort level with every action; top model for judgement and visual work, mid-tier for mechanical; no fan-outs or full re-shoots while iterating. (A11, A12)
- **When he's short on tokens, do only what was asked**, on the cheapest model that can. (A12)

### Plans, trackers and continuity
- **`docs/status.md` is the master tracker:** update it at every milestone, structured by story arc, artwork as its own section (basic → initial → full → final), user testing left out. (A15)
- **The orchestrator owns the regression list:** new feedback becomes a row the same day, every brief lists the rows for its screens, every step end reports open rows by mode in `docs/status.md`; Zafar never has to track it. During runs, a one-line update to Zafar at every check-in. (decision 16)
- **One rulebook, one place for reviews.** Don't scatter rules; check old handovers for rules before archiving them. (A18, A19)
- **The orchestrator chat plans, reviews and delegates:** tight briefs or a clean instruction file per executing chat, lean context, agent reports under ~250 words without cutting findings. (A20, A23)
- **Copy decisions Zafar made directly in a child session** (see `docs/process/overnight-log.md`) into the design doc. (A21)
- **A new chat opens with a plan update** after reading `docs/status.md` (its "Next chat" section first), `docs/design-language/ux-principles.md`, `docs/language/grammar-notes.md` and `docs/ideas.md`. (A15, A28)
- **Hand over at every step boundary, not when the chat is full:** rewrite the "Next chat" section of `docs/status.md` with a ready-to-paste starting prompt and push it; recommend a fresh chat per step or at ~70% context, rather than compacting mid-task. (A25, decision 14)
- **Overnight runs:** regular check-ins and a written report by 08:00 UK, then update the tracker and handovers so a new chat can start. (A17)

---

## 2. Sessions, agents and git

### Running sessions
- **At most ~4 build sessions at once,** and one at a time when the plan says so. (A13, B1)
- **Parallel sessions only on disjoint files.** Shared files (kitchen kit, order card, `ui.js`) have one owner; others import, with small additive edits after `git pull --rebase`. (B2)
- **Build sessions never spawn helper sessions.** (B3)
- **A mode session edits only its own mode's files;** missing shared pieces become marked stubs with the same API; persistence only through the progress/storage API. (B17)
- **Launch with `create_session`, `source_revision` and `outcome_branch` = the integration branch** (top model for visual work); follow-ups go to the same session while it's open. (B5, B10)
- **Re-arm a `send_later` check-in every 30–40 minutes** and look at finished screenshots yourself each time. (B13)
- **"Idle" isn't dead:** read `updated_at` and `status_detail`, wait 20–30 minutes, and never relaunch a session that's still running. (B12)
- **After a usage limit or restart, carry on without re-asking:** check every session and relaunch stopped ones as continuations. (B11)
- **Big refactors live on their own branch** until they're ready. (B18)

### Briefs
- **Every brief is complete:** owned files, a hard stop time, links to `CLAUDE.md`, the rulebook, `docs/design-language/ux-principles.md` and `docs/process/qa-checklist.md`, "don't remove mechanics", "no helpers", and the permissions it needs asked for up front. To redirect, interrupt and relaunch. (A24, B3, B4)

### Git and publishing
- **The release cycle runs in this order:** art finished in ChatGPT → wired in → full checks on everything (the full QA matrix) → publish to `main` → Zafar plays and gives feedback → new art, art fixes and gameplay fixes from that feedback, then round again. Zafar plays only what is live on `main`, never a half-wired branch preview. The full checks cover only what changed since the last gate (plus screens reached by any shared-file change), never a repeat of unchanged screens. (B20, decisions 33–34)
- **Check `git log origin/main` before redoing work;** during a run, log a timestamped line in `docs/process/overnight-log.md` and push the branch every 20–30 minutes. (B6, B14)
- **End every session with** a report in `build/reports/<name>.md`, the QA checklist results (`docs/process/qa-checklist.md`), `bump_version` and ONE push to `main`. (B6)
- **Run `python3 build/bump_version.py` before every push to `main`;** every asset URL built in code goes through `Cook.v()` / `njgV()`. (B7)
- **`main` is the live Pages site:** publish = bump, commit, push the branch and `HEAD:main`; if an upload races you, merge `origin/main` and push again; on `?v=` conflicts, take the real side and re-bump. (B8, B9)
- **Commit small and often, never force-push,** with the Co-Authored-By and Claude-Session lines. Big audio files go up as a GitHub release. (B15, J11)
- **Screenshots and report images are not committed;** they're kept as release or artifact files so the published site stays under GitHub's 1 GB. (B19, decision 20)
- **Browser tests run one at a time** (`flock -w 1800 … timeout`, own `COOK_TEST_PORT`, `--canvas` for `--days`, split by `--stations`); discard rewritten screenshots unless intended. (B16)

---

## 3. Quality and review

### Definition of done
- **Tests passing isn't done for visual work.** Done is when someone has looked at every state and judged it the way Zafar will, and played every station through. (C1)
- **Compare side by side with the approved mock-up, with Cook's shared screens, and item by item with Zafar's last feedback** (each ✅ or a note). (C5, C14)
- **Only tell Zafar it's live after** the Pages build ran for that commit and the fix shows after a hard refresh; send a screenshot. (C9)

### How to review
- **The builder doesn't mark its own homework:** a fresh session or the orchestrator reviews (Fable for docs and designs); never pass on a "done" unseen. (C4, C17)
- **List flaws before saying anything is right:** zoom ×2 and check clipping, spacing, padding, alignment, overlap, crowding, unused lit things, labels, mock-up differences. (C3)
- **Screenshot every visually distinct state, uncropped, at phone landscape 844×390 (plus 800×360, the tightest common phone, in the full matrix), 1366×768 and 16:10 laptops (1440×900, 1280×800),** across levels 1–4, one written line per state; one upright phone shot checks the rotate card. (C2, C11, C16, decision 15)
- **Tablets are in the matrix too:** 1024×768, 1180×820 and 1366×1024 landscape. (decision 24)
- **While iterating: laptop only, changed screens only, one shot each.** The full matrix and tests only before the final push. (C8)

### Standing checks
- **The regression list:** every past feedback item is rechecked at every review. (C6)
- **The Kutchi leak test:** a non-speaker must not win by reading, matching, eliminating, patterns or waiting for hints; every mini-game gets a leak bot for level 1. (C10)
- **Audit each game against the rule table:** first-time help in every phase (`build/check_onboard.mjs`, no English, no device voice), take-back, shared card and buttons, clears its own UI. (C12, C13)
- **Measure what can be measured** (`build/check_vessel_meta.py`); tests check nothing covers an item before each tap. (C7, C11)
- **Check family voices play in every mode and lab;** search `data/family-audio.json` before calling a word English. (C15, C18)

---

## 4. Game design: every mode

### Designing a mode
- **Every mode is a pipeline of stages of mini-games,** one little story with a start and an end; mechanics modular, levels as data, Cook's reused where they fit; each mode has a lab and free play. (H1, H7)
- **Start from the syllabus,** find a proven fun game for each need, and fit the story around the games. (H3)
- **Test every mini-game against five questions:** what you do, where the challenge is (the Kutchi decides it), the fun, the instruction, the novelty; end in a builder brief. (H2)
- **Cut what isn't the lesson:** if it neither teaches a word nor is fun on its own, cut it. Not every station needs to be elaborate. (E8, H48)
- **Upgrades automate physical steps, never the listening;** consecutive errands never repeat the same main action. (H6, H9)

### Tone
- **Nothing may make a child feel bad:** warm failure, a warm tone (never sarcastic or babyish), no nagging, no notifications. (E30)
- **Pressure is always the upside version:** nothing floods, breaks or punishes; customers never leave angry; you never lose what you earned. (E29)
- **Grown-ups can always skip,** via the "?" menu, not a visible button. (E31)

### Instructions and onboarding
- **No written English for the child, and no English at all in games or help:** the ghost finger plus the Kutchi line with read-along; written English for grown-ups only in the "?" pop. (E1)
- **Show, don't tell, on the shared `js/shared/onboard.js`:** dim all but one thing, the ghost finger does it once, the child does it; UI fades in only when first needed. (E2, E9)
- **Babysit at the start:** every spoken line is also written and underlined as it's said. (E3, E4)
- **The instruction card is the master;** Nani is a voice plus hints and short interjections, with a moment of silence at the start. (E27)
- **Never make the child wait for speech:** input is live, a tap goes ahead, the line can be replayed. (E5)

### Help and hints
- **The light bulb is the help:** it flips the text to English for 5/3/2/1 s by level and **costs a lightbulb on the hints badge**; the face is the one replay; no per-line translate buttons. (E25, decision 1)
- **The bulb is for language, the eye is for reading:** the bulb translates (one bulb per use); opening a closed card is a look, counted on its own eye badge at closed-card levels. (E25, F9, decision 27)
- **A glow is a hint, not a giveaway:** only after a wrong tap or ~5 s of hesitation, and never at the top level for what the words should tell. (E16, E28)
- **From level 3, cards are closed;** peeking costs a hint. (F9, H22, H34)

### Levels and difficulty
- **Start super simple:** level 1 is the smallest round, each level adds one thing, no harder describing words at level 1. (E6)
- **One job at a time:** two jobs become phases with a button between; juggling only as a hard level. (E7)
- **Levels make the Kutchi harder, not the gestures:** the same kind of action always uses the same gesture; if ingredients are tapped, a tap pours too. (E13)
- **Timers get ~15% quicker per level, set in data,** and show visibly wherever there's time pressure. (H8, H47)
- **Difficulty is per word:** up a stage on correct recall from the Kutchi, down after two misses. (G23)

### Counting
- **The counting rule:** L1 the quantity is written in Kutchi words and counted aloud; L2 written only; L3+ heard only; say the number with the item; no tallies except chai's sugar. (E12)
- **Rows tick when that step closes** (put down, finished, served), never when a number is reached; the count is judged at the end. (E11)

### Interaction
- **You can take it back until Done:** tap to undo; the first placement is scored; a filled slot loses its dashed outline; impossible undo shows in the art. (E14, E15)
- **Each stage clears its own UI and stops its effects when done;** reply pills appear only when needed and never overlap (the knee's done-flash is the one exception). (E17, E18, E19)
- **Give clear feedback while an action is under way** (e.g. too-fast/too-slow zones on the stir dial). (E34)
- **Nothing covers a tappable item or the play area;** anything collected is visible where it goes. (E23, E24)
- **Colour never carries meaning alone:** colours are also named aloud. (E33)
- **No new character animations unless they can be done well;** prefer the simple version. (E22)

### Feedback, scoring and rewards
- **Show progress, not verdicts:** no red crosses or buzzes mid-round; mistakes show in the end review. Gentle exceptions: the conversation reply, the serve frown, the waiting-room shake. (E10)
- **Scoring is the three end-of-round badges: time, accuracy, hints,** with a personal best per mode and level. No ear star, no voice star; remove the legacy star code. (H5, J7, decisions 1–2)
- **The accuracy tick fills gold for right and grey for wrong.** (F13, decision 3)
- **Pocket money rewards doing well:** one simple internal model pays by **volume** (tasks completed) × **quality** (fewer hints, more ticks, quicker time; correct speaking pays more) × **difficulty**. Never explain the mechanism to the child: the better they do, the more they earn. (decisions 2, 10)
- **Calibrate upgrade prices to a pace:** a few cheap upgrades are affordable after the first few games; nicer ones cost more, while harder and better play earns more. Aim for an upgrade roughly **every 2–3 games at first, stretching to every 4–5 games** once each game's easy upgrades are bought. (decision 10)

### Speaking
- **Speaking is core and grows through the game,** mostly in Cook and Conversations; every mode's design sheet lists its natural speaking points. (H4)
- **Speak only inside a real two-person exchange the child has watched many times;** never where nobody would say it. (E32)
- **The speaking ramp:** watch → handover → say it after the recorded model → words only → picture only; a closed set with pills or a parent as fallback; never block on recognition. (E32)

---

## 5. Game design: modes, story and progression

### Cook
- **Cook's design has two homes:** the shared look and components in `docs/design-language/ui-design-system.md`, and Cook's stations in `docs/game-design/modes/cook.md` (split from the Cook design system v1 on 1 Oct). Together they are Cook's single source of truth. (H10)
- **Story mode is one recipe across a few stations;** free play is the kitchen with people arriving, stopping when you choose. (H50)
- **Pantry first, story mode only:** the first time each dish is made that day starts with a pantry trip ("bring me these for {dish}"); Nani's "pass me" goes in the pantry and slower modes. (H15, H49)
- **Everything cooks in the pan or pot, never the glass:** one pan per person, one burner per pan, no empty or lit-but-unused burners. Maani keeps one tawa. (H11)
- **One shared kitchen kit** (hob, knobs, glowing-ring "on", pour, boards) in chai v2's best version, and **no hands anywhere in Cook**. (H12, H13)
- **Ingredient cameras are consistent within each station** (chai/daar side-on jars, chaat side-on, samosa and sekelo top-down, pantry straight-on). (H14)
- **Pour is a tap-measure;** "don't" rows are sub-rows (*dudh na*), not *{x} wagar ji {dish}*. (H17, H23)
- **Chai:** about half the cups ordered by name (*kari*, *mori*) with rows saying what that means; a plain wooden tray with four cut-outs and faces beside the hob. (H16, H51)
- **Daar:** swipe chop from Nani's chopping card (with decoys), a speed dial and lap count, no oil ring, numbers hidden from level 3. (H18)
- **Samosa:** the swipe fold stays, a base filling first, two different samosas per order allowed; chips belong here with the fry, not the grill. (H19, H24)
- **Sekelo** is the grill and dish name (*mishkaki* = the meat cubes): vertical skewers, no bare "boga" skewers, headline like "one mixed, two meat". (H20)
- **Maani:** a dough pile, one ball per tap, flat cooked maani with spots, a flat wooden turner, at most three things on screen. (H21)
- **Chaat:** a bigger bowl, ingredients on two rows, built in order, no tally. (H22)
- **Pantry art:** straight-on shelves, labelled clear jars, a fridge on the right, a tray with spaces instead of a basket. (H52)

### Clinic
- **The clinic is Hannah's granddad's; the child is his helper.** The doctor's box replaces Nani's unless a story brings her. (H25)
- **Pretend care only:** comical, never gory; the child hands things to the doctor, who gives any medicine. (H26)
- **Pipeline: waiting room → diagnosis → pharmacy belt → heal game → send-off;** a wrong pick costs score, nothing is greyed out. (H27)
- **Waiting room:** at most 6 people, a picked person rises, a describing-word ladder, the call heard not read from level 3, no speaking. (H28)
- **Diagnosis and pharmacy stay calm:** no countdowns (the belt gets faster from level 3); a straight-on painted belt with no hatches. (H29, H30)
- **Heal games:** scrape, knee, ear, tooth, drinks, fever, boing, eye, foot (details in the harvest); tummy, hic and hair wait; the "why" explainer only standalone or in the lab. (H31, H32)
- **Send-off:** feelings in a thought bubble, fixes by level, goodbye in the scene, and **an apple, never a lolly**. (H33, decision 8)
- **The end screen offers Again (same patient) and All patients.** (H34)
- **Backgrounds:** a bench of six, an exam room with the real certificate frame and toys, pharmacy straight on, the close-up bed. (H35)

### Conversations
- **Conversations are their own module,** woven around modes and story beats: one per mode plus one every ~2 minutes; get it right to move on; difficulty ramps written + sound → sound → speaking → asking. (H44)
- **A wrong reply pill shakes, the person looks embarrassed and asks again;** the first try is logged for the review. (E26)

### First launch
- **Make your character → Nani's → a three-item pantry round → the chai station → Nani drinks it → a short story → Yes (only Yes works) → home,** hooked to the Birthday. Chai gets a fun pass first. (H42, H43)

### Story, arcs and progression
- **Arc 1 is the Birthday:** cook each guest's order, set the table, find the sweets, pack the sweet box, candles, then the Story by the Fire. Eid is a later arc. (H36)
- **Then repeatable day-out trips** (beach first): pack → packed lunch → simple travel spot-it → a three-game food stall → place games (Snap at every stop) → the Story by the Fire. (H37, H38)
- **Standalone arcs:** Volunteering at the clinic (4–5 patients a visit), **two Big Ma arcs, quilt-making and making outfits**, and the proposed Monsoon and Who did it?. (H39, decision 4)
- **Every arc ends with the Story by the Fire:** a picture book of what the child actually did, voiced by Nani, with gaps to fill. (H40)
- **The progress marker is a bookshelf, not the quilt:** at the "book end" review with Nani, the arc's book goes on the shelf, name on the spine, and the hub fills up. (I14, decision 4)
- **The story is carried by picture and sound,** never text the child must read; short, skippable story beats are fine. (I13)
- **Order of work:** Cook → the clinic → Arc 1's modes → Arc 1's story layer → one trip arc; the end point is the store launch with Arcs 1–5. **The clinic is built now, ideally finished before the doctor's ~9 Oct visit.** (H41, H54, decision 19)

### Parked, dropped and future
- **Parked modes** (Tidy up, Who did it?, Dress up, Monsoon rush, Snap) are rebuilt on shared components; dropped ideas (fry "take them out?", *munje same we*, pill organiser, tooth bug) stay dropped. (H45, H46)
- **Ideas approved 26 Sept** (#10, 11, 13–16, 18, 19; #12 only as *munje same rakh*) are tracked in `docs/ideas.md`. (H55)
- **Two ways to play: story mode and free play.** Free play is a map that always shows every place; places not yet open show as locked, saying which story opens them; story mode unlocks them. Role reversal stays a future idea. (H56, H57, decision 22)

---

## 6. UI and visual design

### Look and layout
- **Use only the design tokens** (CDS §2): the colour set, Nunito L1–L4, 8-pt spacing, radii 12 or full circle, one soft shadow, tap targets ≥48 px. (F2)
- **The UI is flat material against the 3D art:** white pills, flat gold done outline, no gradients or 3D text; no step counters, internal numbers or English support text. (F3, F23)
- **Left sidebar ~22%** (guide box, cards, ? · ⌂ · book dock); **play area ~78%** with the shelf band; big buttons bottom right under the thumb. (F4, F5)
- **Fill the whole stage:** no letterbox or cream strip. (F18)
- **Built to scale, phones to tablets:** every size comes from tokens that scale with the screen, art has the resolution and safe area to fill any screen shape, and nothing is sized for one screen and patched later; tablets use their extra space for bigger play items, not empty margins. (F18, decision 24)
- **Characters are hidden by the scene,** never the screen edge; no floating heads; one text line beside an icon is centred on it. (F19, F21)

### Shared components
- **The same screens and buttons in every mode** (end screen, badges, Again/Next/Home, Done, "?", guide box, order card, bulb): one `js/shared/` component each. (F1)
- **Done is the round gold tick bottom right, Next the labelled arrow;** buttons stay hidden until usable, never greyed out. (F6, F22)
- **The guide box is sage,** top of the sidebar in every mode (the doctor's in the clinic); speech bubbles are solid cream with dark text. (F11, F24)

### Cards and the order model
- **One white card per person:** face (the replay) + headline + stacked rows; no name label, no cards in cards, no scroll bar, no script: only the current need. (E21, F8)
- **The order model everywhere:** person → items → parts, max three tiers, Kutchi number words, lower case, no full stop; rows and the spoken sentence share one data source and order. (F9, F10)
- **"Don't" rows are dashed with a no-sign;** finished items fold to a gold line; sequences look the same everywhere with "next" in grey, never numbered. (F9)
- **The request card appears over the play area, read aloud, then shrinks into the sidebar;** read-along underline wherever a line is spoken. (E4)
- **Flat tallies only where kept:** show what you did, never the target, never take a tap. (F25)

### Text
- **Text is never clipped, cut or ellipsised:** headlines shrink, then wrap; outlines and glows have room; guide box up to 2 lines, card rows 1. (F7)

### The shelf band
- **Identical slots; items at true relative heights, grouped by kind;** tap the object to use it, the 🔊 chip to hear it (speaker-only at higher levels, none for wordless items). (F15)
- **Equal padding top and bottom;** bounces and glows stay inside the band. (F16)

### Focus, motion and staging
- **The focal rule:** the next thing pulses gently (a centred glow and bounce, never an off-centre ring); inactive things dim ~10%. (F17)
- **Stage it like a play:** talkers stand three-quarter to each other and face the player on the child's turn (a pose swap); gentle ambient motion keeps scenes alive. (E20, F26)

### The end screen
- **One card that steps through:** three badges → Next → the word review → actions (Again / All … / Next …), over the game scene only. (F12)
- **Badges read without reading or counting:** gold = perfect; stopwatch with seconds and a crowned best; chunky gold/grey tick with "7/10"; the bulb dims and cracks per hint. (F13, decision 3)
- **Word review:** Kutchi with English under; right on the right (gold outline), wrong on the left (red outline, allowed only here). (F14)
- **The serve review:** a large face circle over the dish; happy with praise when right, a gentle frown and redo when wrong. (F20)

---

## 7. Art and assets

### Pipeline and cost
- **Art is made in ChatGPT via Claude in Chrome.** A paid API only to prototype fast when Zafar won't respond, under $2: medium quality, estimate and draft first, spend reported. (D1, D2)
- **One long paste block per run, needing no manual steps from Zafar:** generous batches, every attachment, a save-as name and check line per prompt. The runner works only inside Chrome: it fetches references from `raw.githubusercontent.com` into its cloud workspace and attaches them with its file-upload tool, and saves each kept image the same way (the image's address into the workspace, then the file-upload tool on GitHub's upload page) as one commit to `sources/art/<pack>/` on `main`; never Chrome downloads, file pickers, page `fetch()` or the clipboard (blocked on ChatGPT and GitHub); it reports pass/fail. (D3, decision 29)
- **The Chrome runner** changes no settings, signs nothing in or out, uploads only listed files, logs-and-skips anything needing Zafar, and paces ~1 image a minute, 3 at once. (D24, D26)
- **Judge every generated asset pass/fail and fix failures** before Zafar sees anything. (D25)
- **Art Zafar uploads is named, moved and processed** with a report; approved art replaces live art, with old versions kept. (D28, D29)

### Planning art
- **Think before prompting:** what the object is for and how it's seen in game. (D4)
- **Plan backgrounds before prompting:** who stands where, at what size, what stays clear, numbers in the prompt; overlay real character art before approving. (D5)
- **Lock backgrounds first;** prototype with stand-ins, judge in play, then commission final art for approved games only. (D6)
- **Only make art for items the game will use;** reuse approved art where it fits, but say so. (D10, D23)
- **Plan two poses per talking character** (three-quarter mirrored, and front) and evening/night versions of scenes. (D17, D31)

### Style
- **A stylised 3D animated-feature look:** soft GI, warm light upper left, no outlines, cel shading or photorealism, **no text in art**, a flat base and contact shadow wherever things touch. (D13, D16)
- **One camera per scene;** same light, shadow and scale conventions. (D14)
- **Backgrounds are 1600×900 at full resolution,** calm and lighter than tappable items, reds kept for Nani, clear surfaces, a counter to stand behind. (D15, D20, D30)
- **Sizes never invert;** small items up to 1.5× true size; anything under ~90 px comes in a container or heap. (D21)
- **Set-dressing restraint:** 1–2 cultural nods per scene, modern with hints of Kutch and East Africa, never clutter or caricature. (D19)

### Cutting and export
- **Cut with `build/cut_tick_v2.py`'s method,** check every cut zoomed on cream, export trimmed WebP with a 16 px pad; never key magenta out of metal, glass or glow. (D7, D22)
- **All states of an object share one registered canvas,** each generated fresh with a full prompt (edit mode only for small tweaks). (D8, D9)
- **Pot and pan contents are pre-rendered pictures, cross-faded;** never drawn dots or discs. (D11)

### Characters and likeness
- **Character sheet first.** Zafar approves art only for characters based on real people (Nani, Big Ma, the doctor, any real family member): their first sheet and any new look, because only he can judge the likeness. Everything else (generic characters, props, rooms, items) the runner and Claude judge pass/fail themselves, with no approval from Zafar. After a sheet passes, unattended runs make that person's art from it. (D12, decisions 9 and 29)
- **Family photos may be attached to prompts for likeness;** all consent is given. (D12, decision 9)
- **Faces:** head-and-shoulders filling the circle, same eye line and size for everyone, three expressions (neutral, happy, frown). (D18)

---

## 8. Language, Kutchi and voice

### Authority
- **Never invent Kutchi.** Mum is the authority, Masi the dialect tie-break, Zafar confirms spellings; handout vocabulary is fine but their text is never shipped. (G1, G21)
- **Missing Kutchi gets a grey-italic English placeholder flagged "to record",** listed for Mum; drafts carry `draft: true`; never English inside item pills. (G2, G3)
- **An unconfirmed noun gender takes the Kutchi he-form** (Mum's rule of thumb), tops Mum's list, shows the grown-ups' "to check" flag on the test site, is never recorded as a whole phrase and never ships in the store app. (G2, decision 21)

### Spelling and settled words
- **Romanised only, matched generously:** W not V at a word's start, no English articles, long vowels doubled where heard long (*waari*, *daar*, *maani*). (G4)
- **Settled:** no = ***na*** (never *nar*); sugar = ***khun***; two = ***ba*** (voiced "ber"); *hakro*/*hakri* by gender; -o plurals to -a; cooking "now" = ***hane***. (G5)
- **Greetings:** *salaam*; goodbye ***khuda-fis***; thank you in English; ***aai*** for anyone older, ***tu*** for same age or younger. (G6)
- **Refuse politely** (*na khape*), never a bare *na*; the frame *Muke {x} khape* never changes, with the long polite form in Conversations only. (G7, G8)
- **Sides are the patient's own** (*dabo*/*jamno*); the doctor says "bring me", never "I want". (G19, G20)
- **Use the family's listed spellings as written** (harvest G24); provisional words stay unconfirmed until Mum says; *mirchi* only, no plural, for now. (G24, G25, decision 5)

### The language engine
- **Every spoken line is a proper, natural, full sentence** built by the engine from its rules, never hand-written fragments or hand fixes. Every word heard is a human recording. (G9)
- **Build the engine the standard, researched way:** lexicon, morphology and syntax, with a rulebook on filling and using it. It is a **Kutchi** engine: Grammatical Framework's design run by our own small JavaScript engine; Sindhi grammars are a structural reference only (`docs/language/engine-design.md`). (G10, decision 17)
- **Fill it from Mum's natural example sentences,** not grammar tables; the engine outputs the prioritised list of what to record. (G11)
- **Record the most frequent phrases whole** after a simulated run; assembling from words is the fallback; recordings never change the engine. **Until the pre-publish quality pass, every line is stitched from recorded words** (whole-phrase clips switched off), so the engine is tested everywhere. (G12, decision 26)
- **No Kutchi grammar in game code:** frames live in data; nouns carry gender, singular and plural. (G13, G18)

### Voices and recordings
- **Every voice in the product is a real family member;** TTS is test-only, replaced file for file. The child's model reply is Zafar's (boy) or Mum's (girl) for now. (G14, G17)
- **Recording practice:** Mum records long takes saying section IDs, split by silence; Zafar marks every clip OK/?? in `lab/family-audio.html`; only OK clips ship. (G16)
- **Consent:** contributors know where their voice is used and can have it removed; children's voices never ship and stay on the device. (I15)

### English
- **The only spoken English is in story mode:** English first, then the Kutchi where needed, mainly at the start to carry longer exposition; avoided where simple lines and visuals will do. Never written. (G15, decision 12)
- **Never show English or pictures where the task is understanding Kutchi;** one place for a word's text at a time; pictures are fine for speaking prompts. (G22)

---

## 9. Characters, family and culture

- **The family is Khoja Shia Ithna'asheri Muslim, with Kutch and East African roots** (internal note only: never named in anything players or the public read): no bindi, tilak, sindoor, deities or temple items; halal only; modest clothing. (I1)
- **Never sweets, lollies or biscuits as rewards to the child** (an apple instead); **mithai at a celebration** (birthday, party, sweet box) is fine. (I2, decision 8)
- **Nani, based on Zafar's mum, is the guide everywhere** and calls every child *beta*; sheet v2 is canonical (mole on her right, the bracelet, two gold rings, no bangles). (I3, I4)
- **Nani's house is in Kutch:** modern, with culture as a hint. (I5)
- **The doctor is Hannah's granddad:** always competent, kind and in charge; the comedy is never at his expense. (I6)
- **Big Ma** (the wife's great-grandma) is the family seamstress who sings as she sews, always in a headscarf; called **"Big Ma"** in the game; relationship never explained. (I7, decision 11)
- **Simba and Zazu,** Zafar's cats, bring mischief, never peril, and never block play. (I8)
- **Kasuku the parrot repeats words in family voices in idle moments only;** Isa the baby is talked about, never to. (I9, I10)
- **Ali, Layla, Nana, Ma and the guests are generic,** not real family; each orders for themselves. (I11)
- **Generic characters use Zafar's warm light tan;** real-likeness characters follow their photos; the player gets a real range of warm tones. (I12)
- **Sprinkle cultural nods over time,** never all at once (a three-legged stool, a straw broom, kanga, Swahili door; a tandoor, not a charcoal stove). (I16)

---

## 10. Platform, privacy and release

- **Nothing leaves the device:** no accounts, uploads or analytics; speech recognition on-device only. (J1)
- **A web app on GitHub Pages for testing, wrapped with Capacitor for the stores;** landscape; Kids-category rules. (J2)
- **One app, one save:** every mode plugs into the shell and `js/shared/save.js`; progress is per word. (J3)
- **Content model first:** positions are measured per background and stored as scene data, never nudged in CSS; swapping art never changes code. (J4)
- **A clean, modular, scalable codebase to modern best practice;** remove legacy code and concepts when the design moves on. The target is `docs/architecture/target-model.md`: a core, the shared kit, content as data, modes as plug-ins, ES modules with no bundler. (J6, J7, decision 18)
- **Everything stays public (repo, recordings)** until the game or landing page is published and people start looking; then revisit. (decision 6)
- **A landing page (with a sign-up list) and a code-built trailer from in-game footage** are in the plan. (J5)
- **Success is Mum enjoying the recording and a child asking to play again,** not downloads or streaks. (J9)
- **If Kutchi works, reuse the game for other diaspora languages** (Gujarati next). (J10)
- **The agreed sequence from 30 Sept:** this rulebook → the docs "brain" and archiving → language-engine research with the target operating model → refactor → populate the engine. (J8)

---

## Open questions

- **Commercial model: TBC.** Zafar's £2/month idea (first arc free) and "free to the community" both stay open; no rule yet. (J5, decision 7)
- **The *mirchi* plural:** *mirchi* only for now; Zafar to confirm with Mum. (decision 5)
- **Words still to ask Mum:** *kere karein* ("who did it?"), which Zafar doesn't recognise; green pepper (no Kutchi word: drop it from skewers?); the maani turner *moikyo*; *Muke sekelo khape*. (G25, H20, H21)
- **A skip for spoken replies in Conversations** is TBC. (E26)

## Decisions log, 30 Sept

Zafar's answers to the NEEDS ZAFAR conflicts, 30 Sept, 19:30 UTC (harvest Conflicts table numbers in brackets):

1. **Hints cost lightbulbs** (the hints badge); nothing costs the ear star any more. (#5)
2. **The voice star goes;** correct speaking earns more pocket money. The child isn't told the mechanism: simply, the better they do, the more pocket money. (#58)
3. **The accuracy tick fills gold / grey,** not green/red. (#59)
4. **The quilt becomes Big Ma's quilt-making story arc** (separate from her making-outfits arc); the progress marker is a bookshelf that fills with one named book per finished arc at the "book end" review with Nani. (#6)
5. **Use *mirchi* only for now** (no *marcha* plural); Zafar will confirm with Mum. (#25)
6. **Everything stays public** (repo, recordings) until the game or landing page is published and people start looking; then revisit. (#41)
7. **Commercial model: TBC;** both ideas stay open, no rule. (#42)
8. **Mithai at a celebration is fine;** never lollies, biscuits or sweets as rewards to the child (the clinic lolly goes). (#43)
9. **Unattended runs may make art of family members;** all consent is given; Zafar supervises only each person's first character sheet. Supersedes "real people's art only with Zafar present". (#66)
10. **Pocket money model:** pay by volume × quality (hints, ticks, time) × difficulty; upgrade prices calibrated so an upgrade comes every 2–3 games at first, stretching to 4–5. (Zafar, 30 Sept)
11. **Big Ma is called "Big Ma"** in the game. Quilt-making and making outfits are two separate Big Ma arcs. (Zafar, 30 Sept)
12. **English:** no written English for the child, ever. Story mode may speak English and then repeat in Kutchi where needed, especially at the start for longer exposition, avoided where simple lines and visuals will do. (Zafar, 30 Sept, reviewing CLAUDE.md)
13. **Engine and voices:** every word must be a human recording, but the sentence can be built by the engine; statistical analysis of simulated play identifies the most-used phrases, which are recorded whole. (Zafar, 30 Sept)
14. **Handover timing:** don't wait for a full chat; hand over at step boundaries and around 70% context rather than compacting. (Zafar, 30 Sept)
15. **Phone screenshots are landscape:** 844×390 (iPhone 12–14, one of the three most-used phone sizes) as the main phone size, 800×360 (the most-used Android size and the tightest height) in the full matrix, plus one upright shot for the rotate card. (Zafar, 30 Sept)
16. **The orchestrator owns the regression list** and reports open rows at every step end; a one-line update to Zafar at every check-in during runs. (Zafar, 1 Oct)
17. **The language engine is a Kutchi engine:** GF's design, our own small JavaScript engine; Sindhi only as a structural reference. The Excel is retired as a source. (Zafar, 1 Oct)
18. **The code target model is approved** (`docs/architecture/target-model.md`); star code and the clinic's phase-1 prototype go; computer voices stay on the test site, out of the store app. (Zafar, 1 Oct)
19. **Keep building the clinic, ideally to completion before the doctor's ~9 Oct visit,** so he can play his section. Supersedes "no clinic build before the visit". (Zafar, 1 Oct)
20. **Screenshots and report images are not committed** (site under 1 GB); **the clinic's coins join the one purse now**; no wages; browser tests in Node; the layout lint only gets stricter. (Zafar, 1 Oct)
21. **Unconfirmed gender → the he-form, flagged and never shipped;** the bowl errand retired; step 3 as the lean plan with R4 and R5 side by side; Mum's 1 Oct session uses Round 4. (Zafar, 1 Oct)
22. **Story mode and free play;** the free-play map shows every place, locked ones labelled with the story that opens them; the core holds the play context, unlocks, the map as data, the language setting, per-child settings, a paid-content check and content versions. (Zafar, 1 Oct)
23. **Word books** (a picture dictionary by topic) on the shelf beside the story books; R3b (one game host, mode and arc formats, a build guide) is back in step 3. (Zafar, 1 Oct)
24. **No gaps in the checks** (every live flow and level, mistakes and hints, canvas text, sound, overlap, tablets, parked-mode smoke flows); **tablets first-class and layout built to scale**, the scaling rules set later in data. (Zafar, 1 Oct)
25. **Flexible, not locked:** the sidebar and its text scale with the screen; the order card can lay short rows out as pills sharing a line, chosen per screen size in data (default stacked until Zafar chooses). (Zafar, 1 Oct)
26. **Stitched speech everywhere** until the pre-publish pass (whole-phrase clips off); a dictionary mode later; device support set by the market (iOS 15+ with a shim, Android 7+, a cheap-phone performance budget); model reply voice follows the character; five word stages; labs pay like real play. (Zafar, 1 Oct)
27. **The clinic's heal games** per the 1 Oct report §10 with Zafar's changes (`docs/decisions.md`): zoom in and out, two wide shots, body states, the bulb/eye split, the guided first round, the review shows what went wrong; everything lands before the doctor's visit and must look better than Cook today. (Zafar, 1 Oct)
