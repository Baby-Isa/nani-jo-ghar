# Context pack: s15-chai-11: chai, Zafar's 1 Nov play (the rows from docs/feedback/chai-play-2026-11-01.md, his seven decisions as recommended)

Pasted, not linked: the latest decisions, the rules this task names and the checks it must pass. The design facts are in the area docs the brief lists.

## The last 15 decisions (logged to 13 Oct; later ones live in the design docs; the newest wins)
- **85** (12 Oct): The eye test keeps layout A (the close-up of her covering one eye, the chart beside it) as the default; B stays only behind ?eyeLayout=B.
- **86** (12 Oct): Red, then green, per row: every fix starts by running that row's evidence probe and seeing it fail, and ends with the same probe passing (machine) or Fable passing its sheet; nothing is reported done from reading code. Briefs carry each row's probe command.
- **87** (12 Oct): (1) Chaat: the dish is asked for first, the prep games come next, and the layer order is said just before the bowl. (2) Served dishes sit in their tray with the tray's front edge redrawn over them, as in the pantry tray. (3) English ...
- **88** (12 Oct): Sprint 5: (1) from level 2 up every pantry shelf slot holds a decoy, so the shelves read full (PAN-06); (2) the pantry jars carry picture stickers, never word labels (art: the next run); (3) chips, glass, shelf, table, time, help, mix and slow are ...
- **89** (13 Oct): No publish until every fixable row in the sprint is fixed and proven; only rows that wait on Mum, art or Zafar stay open. No play-time deadline cuts a fix short. Also: SH-16's eye on the closed clinic card follows decision 57 (on spoken cards ...
- **90** (13 Oct): Daar's chopped onion, tomato and chilli go in a side-on bowl, not loose piles on the counter (DAAR-07): one image, added to the s05 art block's part G.
- **91** (13 Oct): Fever (CLN-120): at level 3 the doctor still names the effect to use; 'fix it' alone starts at level 4, or when a sound or word clue tells the child which effect, because at L3 the thermometer alone gives the answer (leak bot 100%, non-negotiable ...
- **92** (13 Oct): In the clinic the patient's face circle appears only where she is off screen (the heal-game close-ups and the pharmacy), where it carries her reaction bubbles and is the replay button; where she is on screen in full (waiting room, diagnosis, send-off) there is no ...
- **93** (13 Oct): The end screen's steps (SH-44, D14) become their own page after the word review, shown by itself (no tap) every round of a game that has steps: Kutchi with English under, right gold, wrong red. Only games whose round asks for an order or separate ...
- **94** (13 Oct): Daar's ladle has no hand: as its bowl goes round just inside the pot's rim, the ladle turns so its handle always points outward and rests on the rim (radial), never one fixed direction (DAAR-11). The old Fill practice tile re-lays its fold on the ...
- **95** (13 Oct): One thing lit at a time across the order card and the stage, in one colour (the focal glow's): the 'next' grey fill and the alternating group/row tints go; group boxes alone keep several skewers or recipes distinct. Amends F9 ('next in grey'), ui-design-system §12 ...
- **96** (13 Oct): Done means an independent picture, nothing else. A row is built only on an independent judge's PASS on its new evidence: a Fable subagent given only the standard batch file (the row's words and the sheet), never the builder's account; a FAIL goes straight back ...
- **97** (13 Oct): Sprint 5 fix round answers: (1) one last bounded push for C3 and D3 in their own sessions (about 1.5 h, about $35; ceiling about $480): the full check's 12 findings, the four Cook rows now judged on reached states, the order-card unit test and ...
- **98** (13 Oct): The structure review: (1) Fable (high) reviews the docs against the structure it set out (the 1 Oct map, the 5 Oct audit) as a helper from the orchestrator chat, one report `build/reports/structure-review.md`; then one Opus session makes the edits; (2) it is Sprint 6's ...
- **99** (13 Oct): The reset (supersedes 98's split and word-for-word clauses): the structure review's eight answers stand (history out of the rows, budgets fail `/review`, the judge agent on the orchestrator's model, find-it/ideas/art-plans later). A severe chop, done by the orchestrator in its own chat with Fable sorting ...

## The checks this session must pass (they are the rules; docs/tools.md)
- `node build/tools/review/checks.mjs` before every push (unit tests, words, bump, specs, docs limits, picture loads).
- The one loop (S13): the brief's rows were played BEFORE at launch; you play them AFTER with `node build/tools/review/evidence.mjs --after --brief <this spec>`; the judge, never you, gets the script-made before|after batch.
- Your flows' contract run at 740x320, 930x430, 1280x665 and 1920x1080 (the PROOF line); `node build/tools/review/touched.mjs` maps what else you touched.

## Archived rulebook sections this spec asks for
### rules.md §3. Quality and review
- **Tests passing isn't done for visual work.** Done is when someone has looked at every state and judged it the way Zafar will, and played every station through. (C1)
- **Compare side by side with the approved mock-up, with Cook's shared screens, and item by item with Zafar's last feedback** (each ✅ or a note). (C5, C14)
- **A rule Zafar gives for every game is code in the shared host plus a contract check, never a row against one screen.** The shared host runs every game's lifecycle (request pop-up → play → moves on by itself when the outcome is obvious → all voice stops → end screen); a game supplies only its play. One voice layer, one bubble placement, one talk animation for every mode. The contract checks run every game at every level and fail the build on a break (decision 75, 8 Oct). (C19)
- **Feedback lands at his full strength and the game checks it (decision 78):** `/feedback` writes shared or "everywhere" points as Shared rows with a contract check, in his words; a second Fable reader checks for missing or weakened points before the rows land; before every publish the sprint check plays every row the sprint touched and Fable judges each one's evidence sheet. (C21)
- **Red, then green, per row (decision 86):** before a fix, the fixer runs that row's evidence probe (`node build/tools/review/evidence.mjs --run --rows <ID>`) and sees it fail; after the fix the same probe passes (machine) or Fable passes its sheet. Only then is the row built. No fix is reported done from reading code. (C22)
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
- **Show, don't tell, on the shared `js/shared/onboard.js`:** dim all but one thing, the ghost finger does it once, the child does it; UI fades in only when first needed. (E2, E9)
(+36 more bullets: read rules.md §4)
### rules.md §6. UI and visual design
- **Speech bubbles:** a character on screen speaks from a bubble next to their face (above or below, where there's room), its tail ending at the speaker's mouth (decision 97); an off-screen guide (Nani, the doctor in heal games) speaks by the green box at the top left. (F26, decision 55)
- **Use only the design tokens** (CDS §2): the colour set, Nunito L1–L4, 8-pt spacing, radii 12 or full circle, one soft shadow, tap targets ≥48 px. (F2)
- **The UI is flat material against the 3D art:** white pills, flat gold done outline, no gradients or 3D text; no step counters, internal numbers or English support text. (F3, F23)
- **Left sidebar ~22%** (guide box, cards, ? · ⌂ · book dock); **play area ~78%** with the shelf band; big buttons bottom right under the thumb. (F4, F5)
- **Fill the whole stage:** no letterbox or cream strip. (F18)
- **Built to scale, phones to tablets:** every size comes from tokens that scale with the screen, art has the resolution and safe area to fill any screen shape, and nothing is sized for one screen and patched later; tablets use their extra space for bigger play items, not empty margins. (F18, decision 24)
- **Characters are hidden by the scene,** never the screen edge; no floating heads; one text line beside an icon is centred on it. (F19, F21)
- **The same screens and buttons in every mode** (end screen, badges, Again/Next/Home, Done, "?", guide box, order card, bulb): one `js/shared/` component each. (F1)
(+17 more bullets: read rules.md §6)
### rules.md §7. Art and assets
- **Art is made in ChatGPT runs that Zafar supervises** (decision 77, 9 Oct; replaces decision 71's image API): Claude audits what's needed, writes one paste block from the run spec (`/art-run`), he runs it and approves what lands; Claude judges every image against the plan and the art bible, cuts and wires it. No image-API art without his say-so. Characters stay at the same scale as each other in every scene they share. (D1, D2)
- **One long paste block per run, needing no manual steps from Zafar:** generous batches, every attachment, a save-as name and check line per prompt. The runner works only inside Chrome: it fetches references from `raw.githubusercontent.com` into its cloud workspace and attaches them with its file-upload tool, and saves each kept image the same way (the image's address into the workspace, then the file-upload tool on GitHub's upload page) as one commit to `sources/art/<pack>/` on `main`; never Chrome downloads, file pickers, page `fetch()` or the clipboard (blocked on ChatGPT and GitHub); it reports pass/fail. (D3, decision 29)
- **The Chrome runner** changes no settings, signs nothing in or out, uploads only listed files, logs-and-skips anything needing Zafar, and paces ~1 image a minute, 3 at once. (D24, D26)
- **Judge every generated asset pass/fail and fix failures** before Zafar sees anything. (D25)
- **Art Zafar uploads is named, moved and processed** with a report; approved art replaces live art, with old versions kept. (D28, D29)
- **Think before prompting:** what the object is for and how it's seen in game. (D4)
(+15 more bullets: read rules.md §7)
