# Context pack: S05-P, the last probe fixes and the row paperwork (Sprint 5)

Pasted, not linked: the facts a launch used to re-read the whole rulebook for. The full rulebook only where this names a section.

## The last 15 decisions (docs/decisions.md; the newest wins)
- **81** (12 Oct): 'Thank you!' is the family's own Kutchi response (said in Kutchi speech as 'thank you'), not English: it stays as a greeting answer and as the pass-me reply, in the Kutchi style. Reviewers and the word lint must not flag it.
- **82** (12 Oct): The evidence loop (docs/architecture/evidence-loop.md): every row gets an evidence spec (the flow, level, size and moment that show it, captured as crops, filmstrips, voice timelines or element text, with machine assertions where possible); the sandbox reaches every moment; reviewers judge small cropped sheets in batches ...
- **83** (12 Oct): The waiting room's call comes from the doctor leaning out of his half-open door (built when his s05 art lands); the eye test's layout A (split screen) is built as a prototype beside layout B for Zafar to choose; the knee close-up framing stays as ...
- **84** (12 Oct): A line or word still to record shows as its English in grey italic only; the visible 'TO RECORD' flag goes (it threw off the spacing, so a screen can't be judged as it will look live). The tag stays in the markup (hidden) so ...
- **85** (12 Oct): The eye test keeps layout A (the close-up of her covering one eye, the chart beside it) as the default; B stays only behind ?eyeLayout=B.
- **86** (12 Oct): Red, then green, per row: every fix starts by running that row's evidence probe and seeing it fail, and ends with the same probe passing (machine) or Fable passing its sheet; nothing is reported done from reading code. Briefs carry each row's probe command.
- **87** (12 Oct): (1) Chaat: the dish is asked for first, the prep games come next, and the layer order is said just before the bowl. (2) Served dishes sit in their tray with the tray's front edge redrawn over them, as in the pantry tray. (3) English ...
- **88** (12 Oct): Sprint 5: (1) from level 2 up every pantry shelf slot holds a decoy, so the shelves read full (PAN-06); (2) the pantry jars get picture stickers (no words) in the next art run, so flour, sugar and salt aren't three identical white jars; (3) ...
- **89** (13 Oct): No publish until every fixable row in the sprint is fixed and proven; only rows that wait on Mum, art or Zafar stay open. No play-time deadline cuts a fix short. Also: SH-16's eye on the closed clinic card follows decision 57 (on spoken cards ...
- **90** (13 Oct): Sprint 5's ceiling rises to about $270 so every fixable row is done (decision 89). Daar's chopped onion, tomato and chilli go in a side-on bowl, not loose piles on the counter (DAAR-07): one image, added to the s05 art block's part G.
- **91** (13 Oct): Fever (CLN-120): at level 3 the doctor still names the effect to use; 'fix it' alone starts at level 4, or when a sound or word clue tells the child which effect, because at L3 the thermometer alone gives the answer (leak bot 100%, non-negotiable ...
- **92** (13 Oct): In the clinic the patient's face circle appears only where she is off screen (the heal-game close-ups and the pharmacy), where it carries her reaction bubbles and is the replay button; where she is on screen in full (waiting room, diagnosis, send-off) there is no ...
- **93** (13 Oct): The end screen's steps (SH-44, D14) become their own page after the word review, shown by itself (no tap) every round of a game that has steps: Kutchi with English under, right gold, wrong red. Only games whose round asks for an order or separate ...
- **94** (13 Oct): Daar's ladle has no hand: as its bowl goes round just inside the pot's rim, the ladle turns so its handle always points outward and rests on the rim (radial), never one fixed direction (DAAR-11). The old Fill practice tile re-lays its fold on the ...
- **95** (13 Oct): One thing lit at a time across the order card and the stage, in one colour (the focal glow's): the 'next' grey fill and the alternating group/row tints go; group boxes alone keep several skewers or recipes distinct. Amends F9 ('next in grey'), ui-design-system §12 ...

## Rules this task names
- **Word review:** Kutchi with English under; right on the right (gold outline), wrong on the left (red outline, allowed only here and on the steps page). (F14)

## Rulebook sections this task reads
### rules.md §2. Sessions, agents and git
- **At most ~4 build sessions at once,** and one at a time when the plan says so. (A13, B1)
- **Parallel sessions only on disjoint files.** Shared files (kitchen kit, order card, `ui.js`) have one owner; others import, with small additive edits after `git pull --rebase`. (B2)
- **Build sessions never spawn helper sessions.** (B3)
- **A mode session edits only its own mode's files;** missing shared pieces become marked stubs with the same API; persistence only through the progress/storage API. (B17)
- **Launch with `create_session`, `source_revision` and `outcome_branch` = the integration branch** (top model for visual work); follow-ups go to the same session while it's open. (B5, B10)
- **Re-arm a `send_later` check-in every 30–40 minutes** and look at finished screenshots yourself each time. (B13)
- **"Idle" isn't dead:** read `updated_at` and `status_detail`, wait 20–30 minutes, and never relaunch a session that's still running. (B12)
- **After a usage limit or restart, carry on without re-asking:** check every session and relaunch stopped ones as continuations. (B11)
- **Big refactors live on their own branch** until they're ready. (B18)
- **Use the tools by default:** the project skills (`.claude/skills/`) and scripts (`build/tools/`, `build/lang/`, `build/lint/`) are used whenever a task matches, without Zafar asking; a missing or broken tool is fixed, not worked round. (B21, decision 46)
- **Work in sprints:** one goal and a budget per sprint; small decisions in the sprint file (`docs/sprints/`), lasting ones as rules with a why; each sprint ends with one `/review`, a publish, Zafar's play and a short look back. The orchestrator steers new work into a sprint. (A29, decision 49)
(+10 more bullets: read rules.md §2)
### rules.md §3. Quality and review
- **Tests passing isn't done for visual work.** Done is when someone has looked at every state and judged it the way Zafar will, and played every station through. (C1)
- **Compare side by side with the approved mock-up, with Cook's shared screens, and item by item with Zafar's last feedback** (each ✅ or a note). (C5, C14)
- **A rule Zafar gives for every game is code in the shared host plus a contract check, never a row against one screen.** The shared host runs every game's lifecycle (request pop-up → play → moves on by itself when the outcome is obvious → all voice stops → end screen); a game supplies only its play. One voice layer, one bubble placement, one talk animation for every mode. The contract checks run every game at every level and fail the build on a break (decision 75, 8 Oct). (C19)
- **Feedback lands at his full strength and the game checks it (decision 78):** `/feedback` writes shared or "everywhere" points as Shared rows with a contract check, in his words; a second Fable reader checks for missing or weakened points before the rows land; before every publish the sprint check plays every row the sprint touched and Fable judges each one's evidence sheet. (C21)
- **Red, then green, per row (decision 86):** before a fix, the fixer runs that row's evidence probe (`node build/tools/review/evidence.mjs --run --rows <ID>`) and sees it fail; after the fix the same probe passes (machine) or Fable passes its sheet. Only then is the row built. No fix is reported done from reading code. (C22)
(+12 more bullets: read rules.md §3)
### rules.md §4. Game design: every mode
- **Every mode is a pipeline of stages of mini-games,** one little story with a start and an end; mechanics modular, levels as data, Cook's reused where they fit; each mode has a lab and free play. (H1, H7)
- **Start from the syllabus,** find a proven fun game for each need, and fit the story around the games. (H3)
- **Test every mini-game against five questions:** what you do, where the challenge is (the Kutchi decides it), the fun, the instruction, the novelty; end in a builder brief. (H2)
- **Cut what isn't the lesson:** if it neither teaches a word nor is fun on its own, cut it. Not every station needs to be elaborate. (E8, H48)
- **Upgrades automate physical steps, never the listening;** consecutive errands never repeat the same main action. (H6, H9)
- **Nothing may make a child feel bad:** warm failure, a warm tone (never sarcastic or babyish), no nagging, no notifications. (E30)
- **Pressure is always the upside version:** nothing floods, breaks or punishes; customers never leave angry; you never lose what you earned. (E29)
- **Grown-ups can always skip,** via the "?" menu, not a visible button. (E31)
- **No written English for the child, and no English at all in games or help:** the ghost finger plus the Kutchi line with read-along; written English for grown-ups only in the "?" pop. (E1)
- **Show, don't tell, on the shared `js/shared/onboard.js`:** dim all but one thing, the ghost finger does it once, the child does it; UI fades in only when first needed. (E2, E9)
- **Babysit at the start:** every spoken line is also written and underlined as it's said. (E3, E4)
(+35 more bullets: read rules.md §4)
### rules.md §6 (UI): not found
