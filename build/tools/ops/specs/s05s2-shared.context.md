# Context pack: S05-S2, the shared layer round 2: every shared row still failing in the game (Sprint 5)

Pasted, not linked: the facts a launch used to re-read the whole rulebook for. The full rulebook only where this names a section.

## The last 15 decisions (docs/decisions.md; the newest wins)
- **76** (8 Oct): Sprint 4 is "your feedback sticks": no new features or art beyond his named items until it's done. A route run plays what Zafar plays (every Labs tile and the clinic morning, L1–L4, voice log and a shot of every state); Fable audits every open, ...
- **77** (9 Oct): Art is made in ChatGPT runs Zafar supervises: Claude audits what's needed and writes one paste block; no image-API art without his say-so (replaces decision 71's API default). S04-C's leaning Nani is reverted to her previous art.
- **78** (9 Oct): Feedback is captured at his full strength and checked by the game: /feedback writes every shared or 'everywhere' point as a Shared row with a contract check, quotes his words, and a second Fable reader checks the rows for missing or weakened points before they ...
- **79** (9 Oct): The s05 art run: Nani's forearms really lie on the counter (a small code change draws her above the counter, the first tray kept in front); her face in the family's chunkier render, not the sheet's photographic one; the doctor's part runs only with his ...
- **80** (12 Oct): Samosa's second kind starts with the 'next kind' button (not when the first count is made, which gives the count away). Nani's how-to line at a station's start and her 'pass me' card stay outside the request pop-up (they are not orders); the contract check ...
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

## Rules this task names
- **The light bulb is the help:** it flips the text to English for 5/3/2/1 s by level and **costs a lightbulb on the hints badge**; the face is the one replay; no per-line translate buttons. (E25, decision 1)
- **The bulb is for language, the eye is for reading:** the bulb translates (one bulb per use); opening a closed card is a look, counted on its own eye badge at closed-card levels. (E25, F9, decision 27)
- **The bulb translates the guide line too, and always shows the full order with numbers;** on spoken cards the closed card's eye is a small bulb with no counter. (E25, decision 57)
- **From level 3, cards are closed;** peeking costs a hint. (F9, H22, H34)
- **The counting rule:** at every level Nani says the order at the start and the speaker replays it on demand. L1: the card writes the quantity in Kutchi words and Nani counts along aloud as the child works; L2: the card still writes it, no counting along; L3+: nothing written and no counting along, only the spoken order (replayable). ...
- **The order model everywhere:** person → items → parts, max three tiers, Kutchi number words, lower case, no full stop; rows and the spoken sentence share one data source and order. (F9, F10)
- **"Don't" rows are dashed with a no-sign;** finished items fold to a gold line; sequences look the same everywhere with "next" in grey, never numbered. (F9)

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
(+11 more bullets: read rules.md §2)
### rules.md §3. Quality and review
- **Tests passing isn't done for visual work.** Done is when someone has looked at every state and judged it the way Zafar will, and played every station through. (C1)
- **Compare side by side with the approved mock-up, with Cook's shared screens, and item by item with Zafar's last feedback** (each ✅ or a note). (C5, C14)
- **A rule Zafar gives for every game is code in the shared host plus a contract check, never a row against one screen.** The shared host runs every game's lifecycle (request pop-up → play → moves on by itself when the outcome is obvious → all voice stops → end screen); a game supplies only its play. One voice layer, one bubble placement, one talk animation for every mode. The contract checks run every game at every level and fail the build on a break (decision 75, 8 Oct). (C19)
- **Feedback lands at his full strength and the game checks it (decision 78):** `/feedback` writes shared or "everywhere" points as Shared rows with a contract check, in his words; a second Fable reader checks for missing or weakened points before the rows land; before every publish the sprint check plays every row the sprint touched and Fable judges each one's evidence sheet. (C21)
(+13 more bullets: read rules.md §3)
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
(+36 more bullets: read rules.md §4)
### rules.md §6 (UI): not found
