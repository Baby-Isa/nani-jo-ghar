# How a studio would build this with AI (blank-page view)

Written by an independent advisor who did not read this project's process documents, tools, reports or fix list. I only sized the game code and searched for current practice.

## 1. The short answer

- Studios do not get quality from checking. They get it from **building so that most faults cannot happen**, then checking the little that is left.
- A studio would build the kitchen as **one frame that owns every position, size and light**, and eleven small mini-games that only fill in the middle. Your code is the other way round: the mini-games are big and each places its own things.
- Their main automated visual test is simple: **a picture the owner approved, compared by a machine with today's picture.** Any difference stops the change. No AI opinion is involved.
- AI is good at writing code and at playing the game like a bot. It is **poor at judging fine layout from screenshots and unreliable at judging its own work.** Using AI judges as the main gate is the weak point.
- "Fixed" must mean **a test that failed before and passes now**, not a statement.
- Your time should go to what only a human can do: approving the look once, and watching children play.
- The game is not complicated; the amount of code is (about 126,000 lines, nine prototype modes alongside). Less width, one locked frame and a picture gate matter more than any new check.

## 2. How a professional studio structures a game like this

**Frame and content.** A studio like Toca Boca would treat "eleven cooking games with the same customer, order card, shelf, lights and praise" as *one game with eleven recipes*. The frame is written once and owns:

- where everything sits at every screen size (named slots: order card, play area, shelf, hand, light);
- the guidance lights: a mini-game says "light the kettle" and the frame works out where the kettle is and draws the light. A mini-game never gives a position;
- timing of speech, praise and transitions.

A mini-game is then small: its mechanic inside the play area, plus a data file. It is *not allowed* to place a card or a light itself. That rule is enforced by a machine (a check that fails if mini-game code measures the screen or sets positions).

What I saw in your code: the kitchen folder is about 40,000 lines; individual mini-games run 1,100 to 2,500 lines each; the kitchen and shared code measure positions on screen in roughly 190 places and use about 250 hand-set timers. That is each mini-game solving layout and timing for itself, which produces "lights slightly off", "cards overlap on small phones" and "a shared change broke another game".

**Art and layout pipeline.** Layout is designed before code: an artist draws each screen at the smallest and largest target size, the team agrees it, and those drawings become the reference. Code is built to match the drawing, and the drawing is what tests compare against.

**Small studio versus large.** Rockstar has hundreds of testers and machines running tests all night; its one lesson for you: *nothing joins the main game unless the automatic tests pass.* Toca Boca is the closer model: small teams, very few features, a toy rather than a system, heavy reuse, and constant play-testing with real children from paper prototypes onward. They keep scope tiny on purpose and polish one thing fully before starting the next.

**Locked before code:** the frame's slots at each screen size; the look of shared parts (cards, shelf, buttons, lights); the list of states each mini-game has (start, each step, wrong pick, finished); and the target devices. After that, changing the frame is a deliberate, rare event, not something a builder does while working on samosas.

## 3. How studios test, and what AI changes today

**What is automated**

- **Logic tests.** Small, fast tests of rules ("three right picks moves the word up"). Cheap and reliable.
- **Picture comparison against approved images** (often called golden screenshots or visual regression). The game is opened at a fixed state and size, with animation frozen and randomness fixed, and the picture is compared pixel by pixel with one a human approved. Standard, free tooling exists for browser games. The hard part is making the game stand still: a way to jump straight to "eggs, step 3" with the clock stopped. Build that switch first.
- **Geometry rules.** Because cards and lights are things the code knows about, a machine can measure them: no two cards overlap, nothing is off screen, no text is cut, each light's centre is within a few pixels of its target. These are exact numbers, checked at every size, in every state. This catches most of what currently reaches you.
- **Play bots.** A script plays every mini-game start to finish, at every size, including wrong picks and fast tapping, and fails if it gets stuck or an error appears. Rare famously did this for Sea of Thieves, re-running tests continuously.

**What AI adds in 2025-2026, honestly**

Good at: writing code and tests; playing a game as an exploring bot (research systems are used in real studio pipelines); spotting gross faults in a screenshot (missing image, blank screen); proposing a fix for a failure.

Poor at:

- **Fine layout from a screenshot.** A light eight pixels off, a card slightly overlapping, two games with slightly different spacing: vision models miss these often, and say "looks good" confidently. Research comparing AI judges with people on interface quality finds they agree on some qualities and diverge on others.
- **Judging its own work.** Studies find AI judges favour output from their own kind, and can be swayed by surface cues. An AI builder and an AI judge share blind spots. A second AI is not an independent picture; a pixel comparison or a measured number is.
- **Knowing when it is done.** An agent will report "fixed" when the code changed, not when the fault is gone.

**What stays human:** whether it is fun; feel and pacing; whether a three-year-old understands what to do; taste and look; the Kutchi. No vendor or paper claims otherwise. Toca Boca's own account is that children simply walk away from what does not work, and you cannot predict it.

## 4. Why an AI-only team with a non-developer owner gets stuck

1. **The owner becomes the test department.** With no machine that knows what "right" looks like, only your eyes hold the standard, so every fault reaches you.
2. **Checks that test the wrong thing.** Hundreds of checks written by the builders mostly test what was easy to test or what the code already does. A large count feels safe and tells you little. The measure of a check is: *did it ever catch a fault you would otherwise have seen?*
3. **Opinion gates instead of fact gates.** An AI judge looking at a screenshot is an opinion. It passes things. Rounds of review multiply opinions, not certainty.
4. **"Fixed" without proof.** No failing test first, so nothing shows the fault went away, or stops it returning.
5. **Shared code with no owner and no safety net.** Any builder can change the frame; nothing shows which of the other ten games moved as a result.
6. **Symptom patching.** Each fault is fixed where it shows (nudge this light in this game) rather than at the cause (lights should not be positioned by games). Fifty patches later the code is bigger and more fragile.
7. **Too much width.** AI makes starting things nearly free, so there are eleven mini-games, three modes and nine prototypes, none fully finished. Every unfinished thing adds to what a shared change can break.
8. **Process growth.** Each failure adds a rule or review step. Process grows; the product does not.

## 5. What I would set up for this game, from scratch

**The few rules**

1. The frame owns all positions, sizes, lights and timing. Mini-games may not. A machine enforces it.
2. Nothing reaches the main game unless the automatic gate is green. No exceptions, no "known failures".
3. Every reported fault first becomes a failing test, then gets fixed. A fault with no test is not closed.
4. Only you approve a reference picture. A builder can propose a new one; it cannot accept its own.
5. One finished thing before the next is started.

**Checks: four kinds, a small number each**

- *Picture gate:* each mini-game, about 6 key states, at 4 screen sizes. Roughly 250-300 pictures for the kitchen, compared automatically in a few minutes.
- *Geometry rules:* about ten rules (no overlap, on screen, no cut text, light on target, minimum touch size, same slot positions in every game), run on every state and size.
- *Play bot:* one play-through per mini-game per size, plus a wrong-pick run.
- *Logic tests:* the language and progress rules.

Retire any check that has never caught a real fault.

**Who approves what.** Machines approve "nothing changed that shouldn't" and "the geometry rules hold". You approve the look, once per screen, by saying yes to a contact sheet of pictures; after that you see a screen again only when it differs from what you approved, shown as before, after and the difference highlighted. AI review is kept for code quality and for gross faults, never as the final word on appearance.

**How work is sized.** One mini-game or one frame change at a time. A frame change is its own piece of work and is done only when all eleven games' pictures are re-checked. Parallel builders only on things that cannot touch each other, which the frame rule makes true.

**Your time.** Ten minutes approving pictures per piece of work. Then play for feel, not for faults. Then watch a child play, which is the test nothing else can replace. If you find a fault a machine could have measured, the response is a new rule in the gate, not just a fix.

## 6. The most important changes, in order

1. **Stop widening. Pick one mini-game (tea) and make it the gold standard,** with the frame owning every position and light. Park the prototypes and the other modes until the kitchen is solid.
2. **Build the jump-to-state switch and the picture gate,** and approve the reference pictures yourself. This single change moves the standard out of your head and into a machine.
3. **Add the ten geometry rules and the play bot** at all four sizes, and make the gate blocking.
4. **Move the other ten mini-games onto the frame one at a time,** each finished (pictures approved, gate green) before the next. Expect the code to shrink; that is the sign it is working.
5. **Change what "fixed" means:** failing test first, passing test after, shown to you as before-and-after pictures. Demote AI judges to helpers and delete checks that have never caught anything.

A caution: step 4 is the largest piece, and the only one that removes the cause. The rest catches faults; this stops them being made.

## Proof

**Looked at in the code (sizing only)**

- `js/`: 335 files, about 126,000 lines. `js/cook/` about 40,400 lines; `js/shared/` about 21,500; `js/clinic/` about 20,400; nine `*-proto` folders of 1,400-2,200 lines each.
- Largest files: `js/cook/ui.js` (5,272 lines), `js/shared/onboard.js` (2,779), `js/cook/flow.js` (2,603), `js/cook/mechanics/grill.js` (2,492), `js/cook/stations/chai-tray.js` (2,346), `js/cook/stations/samosa.js` (1,872).
- Counts by text search: on-screen position measuring, 82 places in `js/cook` and 107 in `js/shared`; hand-set timers, 156 in `js/cook` and 93 in `js/shared`; 135 screen-size rules across the style sheets (about 8,300 lines).
- `data/layout.json` (231 lines) and `data/cook.json` (6,722 lines), sized only.
- I did not run the game or any test, and did not read the process documents, so section 4 is reasoned from your description and the code's shape, not from your records.

**Web sources**

- "Leveraging LLM Agents for Automated Video Game Testing" (TITAN), arXiv 2509.22170, Sept 2025: https://arxiv.org/abs/2509.22170
- modl.ai, "Let AI find game bugs before your players do" (vendor; play bots driven by what is on screen): https://modl.ai/
- Bugnet, "How AI is changing game testing and QA" (limits; AI cannot judge fun; Rare's Sea of Thieves example cited in search results): https://bugnet.io/blog/how-ai-is-changing-game-testing-and-qa
- "MLLM as a UI Judge: Benchmarking Multimodal LLMs for Predicting Human Perception of User Interfaces", arXiv 2510.08783: https://arxiv.org/html/2510.08783v1
- "Fooling the LVLM Judges: Visual Biases in LVLM-Based Evaluation", arXiv 2505.15249: https://arxiv.org/html/2505.15249v2
- "MLLM-as-a-Judge Exhibits Model Preference Bias" (Philautia-Eval), arXiv 2604.11589: https://arxiv.org/pdf/2604.11589
- Argos, "Playwright Visual Regression Testing in CI: Complete Guide": https://argos-ci.com/blog/playwright-visual-regression-testing-ci
- QA Wolf, "Visual diffing" (comparing canvas pictures): https://docs.qawolf.com/qawolf/visual-diffing
- TestQuality, "Playwright Visual Regression Testing: A Production Guide to Baselines, Flake, and CI": https://testquality.com/?p=7894
- GamesBeat, "How Toca Boca got 100M mobile downloads by putting kids first": https://gamesbeat.com/how-toca-boca-got-100m-mobile-downloads-by-putting-kids-first/
- Joan Ganz Cooney Center, "First Contact: Playtesting with Preschoolers" and "Playtest with Kids" toolkit: https://joanganzcooneycenter.org/2022/04/28/playtest-with-kids/
- Smashing Magazine, "Designing For Kids Is Not Child's Play": https://www.smashingmagazine.com/2016/01/designing-apps-for-kids-is-not-childs-play/

Limits of the evidence: I read search summaries of these pages, not every page in full. Vendor claims about AI testing gains are marketing and I have not relied on their numbers. I found no public account of Toca Boca's or Rockstar's internal AI workflow; sections 2 and 5 describe standard studio practice applied to this game, not a documented case.
