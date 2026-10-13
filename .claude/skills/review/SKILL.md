---
name: review
description: Review a finished build session or any change before it goes to Zafar or to main - touched flows, regression rows, sandbox run, screenshot diff, flaws first. Use whenever a session reports done or before a publish.
---
# /review: done means looked at

**For:** whoever did not build it (C4, C17). Rules: `docs/process/rules.md` §3; checklist `docs/process/qa-checklist.md`.

## Steps
0. The fast checks, docs limits included: `node build/tools/review/checks.mjs` (exit 1 stops the review).
1. What the change reaches:
   ```
   node build/tools/review/touched.mjs --base <last reviewed commit>
   ```
   It lists the sandbox flows and prints the sandbox command.
2. The rows to recheck (C6):
   ```
   node build/tools/review/touched.mjs --base <ref> --json | node build/tools/review/regress.mjs --stdin
   ```
3. Run the sandbox command it printed (one browser at a time: `flock -w 1800 ... timeout`, B16). While iterating: laptop size, changed screens only (C8). Before a publish: the full matrix (C2, C11, C16).
4. Only what changed:
   ```
   node build/tools/review/shotdiff.mjs --run <run id>
   ```
   Open `<run>/sheets/changed.png` and look at every shot, zoom ×2.
5. Write flaws first (C3): clipping, spacing, padding, alignment, overlap, English for the child, Kutchi leaks (C10). Then each regression row: still fixed / broken. Then side by side with the mock-up and Zafar's last feedback (C5).
6. Leak and word checks if game logic or words changed: `node build/tools/review/leak.mjs <config>`, `node build/lint/words.mjs`.
7. Start the report: `node build/tools/review/skeleton.mjs <name> --run <run id>`.
8. Approve the shots only after looking (and from two runs where timing wobbles): `shotdiff.mjs --approve --also <run2>`.

9. **The evidence loop (decisions 78, 82), before every publish:** every row the sprint touched is proven by the game and judged on small sheets, not just the changed screens.
   ```
   node build/tools/review/evidence.mjs --plan --sprint      # specs validated; a row with no spec, a spec error or an unreachable moment fails here (fix the spec or the driver first)
   COOK_TEST_PORT=88xx flock -w 3600 /tmp/njg-browser.lock timeout 1200 node build/tools/review/evidence.mjs --run --sprint   # plays, captures, decides the expects; exit 75: --resume <id>
   node build/tools/review/evidence.mjs --judge              # batch files for the rows a reviewer must see (not machine-decided, not cached, not a tool failure)
   #   one `judge` agent call per build/screenshots/evidence/<run>/judge/batch-NN.md (.claude/agents/judge.md; on the orchestrator's model, never the builder)
   node build/tools/review/evidence.mjs --collect            # the verdict files -> the cache
   node build/tools/review/evidence.mjs --apply              # FAIL -> reopened (back to the fix list), PASS -> built (to the archive)
   ```
   A row is built only on a PASS of its evidence (a machine expect or a reviewer citing a panel); a FAIL reopens it before Zafar plays. Tool failures (moment never reached, blank crop, spec error) go back to the tool owner, never to Zafar. Zafar gets the FAIL list, the audit disagreements and the `human` rows (his ear or feel) before he plays (C20). At sprint close: `--run --all`, then `--judge --audit 10`. (`sprintcheck.mjs` stays for the row → flow mapping of rows with no spec.)

## Then
Anything broken goes back to the builder as a numbered list; nothing reaches Zafar that breaks a written rule.
