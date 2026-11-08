---
name: review
description: Review a finished build session or any change before it goes to Zafar or to main - touched flows, regression rows, sandbox run, screenshot diff, flaws first. Use whenever a session reports done or before a publish.
---
# /review: done means looked at

**For:** whoever did not build it. The checks are the rules (`docs/tools.md`); checklist `docs/process/qa-checklist.md`.

## Steps
**A game's merge (Sprint 19; the three-part gate):** (1) part 1 green: its flows' contract run at L1-L4 has no break of contract-100 to
-109 (the shared pieces present: the 6 Nov card and type, Nani's box with its drop-down, the kit's light only, no tick/next/X, the
card's picture, the light whole and centred and gone on the move, only shelf items hop, praise last, the shelf's line) nor any other; and **0 page errors** on every page (run with `--check`; 8 Nov: s19-cards merged with a page error on every Cook page that its contract run reported but nothing gated);
(2) `node build/tools/review/sidebyside.mjs <game>` (it takes the browser lock itself: never wrap it), then one `judge` call on its
`judge-batch.md` with `docs/process/eye-judge-rubric.md`, flaws first; (3) the judge's strips (motion and timing) are in the same batch.
**The merge rule (principle 10, proposed 8 Nov, not yet agreed by Zafar):** nothing merges that the side-by-side shows worse than chai
at the same moment unless a look sheet he accepted says it may differ; until he agrees it, a WORSE THAN CHAI line goes to him with the
batch, it does not block alone.
**A builder's rows: the one loop first** (`docs/architecture/evidence-loop.md` "The one loop (S13)"). Its before was played at launch (`evidence.mjs --before --check --brief <spec>`); the builder played `--after`. Run `node build/tools/review/evidence.mjs --judge --brief <spec>`, one `judge` call per `judge/brief-NN.md`, then `--collect` and `--apply --run-id <after run>`. A shared element the brief names: `kitsheet.mjs --elem <name> --after` to the judge (the same look in every game). Machine checks before any of it; the steps below are the one broad sweep.
0. The checks, docs limits and the browser's load check included: `node build/tools/review/checks.mjs --browser` (exit 1 stops the review; `--full` before a publish adds the parked modes' leak bots).
0b. A build session's scope: `node build/tools/ops/brief.mjs --audit <its spec.json> <base>..<head>` (exit 1: a file outside its owns; the review fails until it is undone or agreed).
1. What the change reaches:
   ```
   node build/tools/review/touched.mjs --base <last reviewed commit>
   ```
   It lists the sandbox flows and prints the sandbox command.
2. The rows to recheck:
   ```
   node build/tools/review/touched.mjs --base <ref> --json | node build/tools/review/regress.mjs --stdin
   ```
3. Run the sandbox command it printed (one browser at a time: `flock -w 1800 ... timeout`). Between fix rounds: only the changed flows, at every size with `--contract`. The full gate (`run.mjs --gate`) runs once, just before a publish (Zafar, 20 Oct).
3b. **Cook's mount test** whenever the change touches `js/cook/**` or `js/shared/buttons.js` (COOK-16): `COOK_TEST_PORT=8818 flock -w 1800 /tmp/njg-browser-all.lock timeout 600 node build/test_cook_mount.mjs`. Its result goes in the review report. Until the shared sweep handles the shared kits' own leftovers (one sfx AudioContext, the conversations / voice safety timers, the kits' one-time page listeners), those lines are known: watch only that the counts stop growing from mount to mount.
4. (Retired 8 Nov, s19-checks audit: `shotdiff.mjs` had no approved run since Sprint 8, so it showed every shot as new; the look is judged beside chai by `sidebyside.mjs` instead. Its code stays.)
5. Write flaws first: clipping, spacing, padding, alignment, overlap, English for the child, Kutchi leaks. Then each regression row: still fixed / broken. Then side by side with the mock-up and Zafar's last feedback.
5b. **Every station touched, at L1-L4.** For each station, recipe or clinic game the change reaches, judge its played frames at **L1-L4 for each station touched** (L1, L2, L3, L4, not one level), in the real run's frames, never the code. In every one, look at: the samosa fold (the flap goes over the filling, in the order the card says: SAM-05) and the go-on button (shown, whole, on the bottom of the screen, doing the same in every station). A station with a level not played has not been reviewed (SH-109, SH-111).
5c. **Told-before rows get a shot.** Every row in the fix list that came back from his earlier feedback (**told before**: `/feedback` reopened it, or its status says so) is judged on its own shot or evidence sheet in this review, flaws first, even when the change did not touch its screen (SH-116).
6. Leak and word checks if game logic or words changed: `node build/tools/review/leak.mjs <config>`, `node build/lint/words.mjs`.
7. Start the report: `node build/tools/review/skeleton.mjs <name> --run <run id>`.

9. **The evidence loop, before every publish:** every row the sprint touched is proven by the game and judged on small sheets, not just the changed screens.
   ```
   node build/tools/review/evidence.mjs --plan --sprint      # specs validated; a row with no spec, a spec error or an unreachable moment fails here (fix the spec or the driver first)
   COOK_TEST_PORT=88xx flock -w 3600 /tmp/njg-browser-all.lock timeout 1200 node build/tools/review/evidence.mjs --run --sprint   # plays, captures, decides the expects; exit 75: --resume <id>
   node build/tools/review/evidence.mjs --judge              # batch files for the rows a reviewer must see (not machine-decided, not cached, not a tool failure)
   #   one `judge` agent call per build/screenshots/evidence/<run>/judge/batch-NN.md (.claude/agents/judge.md; on the orchestrator's model, never the builder)
   node build/tools/review/evidence.mjs --collect            # the verdict files -> the cache
   node build/tools/review/evidence.mjs --apply              # FAIL -> reopened (back to the fix list), PASS -> built (to the archive)
   #   then label every reopened row (to fix: code / check, waiting on Zafar / Mum / art; checks.mjs fixlist) and hand Zafar the lists by label
   ```
   A row is built only on a PASS of its evidence (a machine expect or a reviewer citing a panel); a FAIL reopens it before Zafar plays. Tool failures (moment never reached, blank crop, spec error) go back to the tool owner, never to Zafar. Zafar gets the FAIL list, the audit disagreements and the `human` rows (his ear or feel) before he plays. At sprint close: `--run --all`, then `--judge --audit 10`. (`sprintcheck.mjs` stays for the row → flow mapping of rows with no spec.)

## Then
Before a judge's FAIL goes to a builder, read the row's own quote of Zafar: a FAIL that would reverse his design (or a decision in the mode's doc) is dropped and put to him instead (Zafar, 20 Oct). Between rounds run the evidence on changed rows only (`evidence.mjs --run --changed`). Anything broken goes back to the builder as a numbered list; nothing reaches Zafar that breaks a written rule.
