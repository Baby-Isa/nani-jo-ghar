---
name: review
description: Review a finished build session or any change before it goes to Zafar or to main - touched flows, regression rows, sandbox run, screenshot diff, flaws first. Use whenever a session reports done or before a publish.
---
# /review: done means looked at

**For:** whoever did not build it (C4, C17). Rules: `docs/process/rules.md` §3; checklist `docs/process/qa-checklist.md`.

## Steps
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

## Then
Anything broken goes back to the builder as a numbered list; nothing reaches Zafar that breaks a written rule.
