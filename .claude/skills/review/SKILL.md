---
name: review
description: Review a finished build session or any change before it goes to Zafar or to main - touched flows, regression rows, sandbox run, screenshot diff, flaws first. Use whenever a session reports done or before a publish.
---
# /review: done means looked at

**For:** whoever did not build it. The checks are the rules (`docs/tools.md`); checklist `docs/process/qa-checklist.md`.

## Steps
**A builder's rows: the one loop first** (`docs/architecture/evidence-loop.md` "The one loop (S13)"). Its before was played at launch (`evidence.mjs --before --check --brief <spec>`); the builder played `--after`. Run `node build/tools/review/evidence.mjs --judge --brief <spec>`, one `judge` call per `judge/brief-NN.md`, then `--collect` and `--apply --run-id <after run>`. A shared element the brief names: `kitsheet.mjs --elem <name> --after` to the judge (the same look in every game). Machine checks before any of it; the steps below are the one broad sweep.
0. The fast checks, docs limits included: `node build/tools/review/checks.mjs` (exit 1 stops the review).
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
4. Only what changed:
   ```
   node build/tools/review/shotdiff.mjs --run <run id>
   ```
   Open `<run>/sheets/changed.png` and look at every shot, zoom ×2.
5. Write flaws first: clipping, spacing, padding, alignment, overlap, English for the child, Kutchi leaks. Then each regression row: still fixed / broken. Then side by side with the mock-up and Zafar's last feedback.
5b. **Every station touched, at L1-L4.** For each station, recipe or clinic game the change reaches, judge its played frames at **L1-L4 for each station touched** (L1, L2, L3, L4, not one level), in the real run's frames, never the code. In every one, look at: the samosa fold (the flap goes over the filling, in the order the card says: SAM-05) and the go-on button (shown, whole, on the bottom of the screen, doing the same in every station). A station with a level not played has not been reviewed (SH-109, SH-111).
5c. **Told-before rows get a shot.** Every row in the fix list that came back from his earlier feedback (**told before**: `/feedback` reopened it, or its status says so) is judged on its own shot or evidence sheet in this review, flaws first, even when the change did not touch its screen (SH-116).
6. Leak and word checks if game logic or words changed: `node build/tools/review/leak.mjs <config>`, `node build/lint/words.mjs`.
7. Start the report: `node build/tools/review/skeleton.mjs <name> --run <run id>`.
8. Approve the shots only after looking (and from two runs where timing wobbles): `shotdiff.mjs --approve --also <run2>`.

9. **The evidence loop, before every publish:** every row the sprint touched is proven by the game and judged on small sheets, not just the changed screens.
   ```
   node build/tools/review/evidence.mjs --plan --sprint      # specs validated; a row with no spec, a spec error or an unreachable moment fails here (fix the spec or the driver first)
   COOK_TEST_PORT=88xx flock -w 3600 /tmp/njg-browser.lock timeout 1200 node build/tools/review/evidence.mjs --run --sprint   # plays, captures, decides the expects; exit 75: --resume <id>
   node build/tools/review/evidence.mjs --judge              # batch files for the rows a reviewer must see (not machine-decided, not cached, not a tool failure)
   #   one `judge` agent call per build/screenshots/evidence/<run>/judge/batch-NN.md (.claude/agents/judge.md; on the orchestrator's model, never the builder)
   node build/tools/review/evidence.mjs --collect            # the verdict files -> the cache
   node build/tools/review/evidence.mjs --apply              # FAIL -> reopened (back to the fix list), PASS -> built (to the archive)
   #   then label every reopened row (to fix: code / check, waiting on Zafar / Mum / art; checks.mjs fixlist) and hand Zafar the lists by label
   ```
   A row is built only on a PASS of its evidence (a machine expect or a reviewer citing a panel); a FAIL reopens it before Zafar plays. Tool failures (moment never reached, blank crop, spec error) go back to the tool owner, never to Zafar. Zafar gets the FAIL list, the audit disagreements and the `human` rows (his ear or feel) before he plays. At sprint close: `--run --all`, then `--judge --audit 10`. (`sprintcheck.mjs` stays for the row → flow mapping of rows with no spec.)

## Then
Before a judge's FAIL goes to a builder, read the row's own quote of Zafar: a FAIL that would reverse his design (or a decision in the mode's doc) is dropped and put to him instead (Zafar, 20 Oct). Between rounds run the evidence on changed rows only (`evidence.mjs --run --changed`). Anything broken goes back to the builder as a numbered list; nothing reaches Zafar that breaks a written rule.
