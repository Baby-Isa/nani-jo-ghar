---
name: review
description: Review a finished build session or any change before it goes to Zafar or to main - touched flows, regression rows, sandbox run, screenshot diff, flaws first. Use whenever a session reports done or before a publish.
---
# /review: done means looked at

> **Which checks run when, and how deep:** `docs/process/qa-checklist.md` "When we check, and how deep" (Zafar, 9 Nov). Where this file says otherwise, that section wins. Each tier is one tool in `build/tools/tiers/` (settings: `tiers.json`), run at its moment by the step below, never on request (Zafar, 10 Nov).


**For:** whoever did not build it. The checks are the rules (`docs/tools.md`); checklist `docs/process/qa-checklist.md`.

## Steps
**A builder's hand-back and every merge: tier 2, one command** (Zafar, 9-10 Nov: run by the process, never requested):
```
node build/tools/tiers/check-change.mjs --brief <its spec.json>      # a builder's branch, before the merge
node build/tools/tiers/check-change.mjs --base <last reviewed commit> # a fast-lane tweak or any other merge
```
It runs check-push, the scope audit (`brief.mjs --audit`), the touched game at the levels touched at 740x320 and 930x430 with its contract rules (0 page errors, end reached, no break the base lacks: contract-100 to -109 among them), the rows' probes red on the base and green here (`--brief`: `evidence.mjs --after` and `--judge`), before|after pictures made by script from the base commit and the candidate, a first-play film of L1 as a new player, and what `tiers.json` places at tier 2 (the mount test when `js/cook/**` or `js/shared/buttons.js` changed, chai's frozen run on a shared change, Cook's leak bot, panelcheck, load time ...). Exit 1 blocks the merge; its result is `build/reports/tiers/change-<commit>.md`.
Then: look at its before|after index and the film yourself (lights, arrows, lessons, nothing obviously wrong); one `judge` call per batch it names, then `evidence.mjs --collect` and `--apply`; before|after to Zafar before merging. Beside chai (`sidebyside.mjs`) waits for a game's new scene and art (check-sprint runs it; the 8 Nov merge rule was not agreed, 9 Nov).
1-3. (In check-change: the checks, the scope, touched.mjs and regress.mjs's rows, the sandbox run, the mount test.)
4. (Retired 8 Nov, s19-checks audit: `shotdiff.mjs` had no approved run since Sprint 8, so it showed every shot as new; the look is judged beside chai by `sidebyside.mjs` instead. Its code stays.)
5. Write flaws first: clipping, spacing, padding, alignment, overlap, English for the child, Kutchi leaks. Then each regression row: still fixed / broken. Then side by side with the mock-up and Zafar's last feedback.
5b. **Every station touched, at L1-L4.** For each station, recipe or clinic game the change reaches, judge its played frames at **L1-L4 for each station touched** (L1, L2, L3, L4, not one level), in the real run's frames, never the code. In every one, look at: the samosa fold (the flap goes over the filling, in the order the card says: SAM-05) and the go-on button (shown, whole, on the bottom of the screen, doing the same in every station). A station with a level not played has not been reviewed (SH-109, SH-111).
5c. **Told-before rows get a shot.** Every row in the fix list that came back from his earlier feedback (**told before**: `/feedback` reopened it, or its status says so) is judged on its own shot or evidence sheet in this review, flaws first, even when the change did not touch its screen (SH-116).
6. Leak and word checks if game logic or words changed: `node build/tools/review/leak.mjs <config>`, `node build/lint/words.mjs`.
7. Start the report: `node build/tools/review/skeleton.mjs <name> --run <run id>`.

9. **The evidence loop, at the sprint check:** `check-sprint.mjs` (`/sprint`, when the main work is in) runs `--run --sprint` and `--judge`; the rest below is the judging. Every row the sprint touched is proven by the game and judged on small sheets, not just the changed screens.
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
