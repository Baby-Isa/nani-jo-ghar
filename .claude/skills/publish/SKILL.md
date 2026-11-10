---
name: publish
description: Publish the branch to main (the live GitHub Pages site) and confirm it is live. Use only after the review passed and Zafar approved publishing.
---
# /publish: bump, push, confirm live

> **Which checks run when, and how deep:** `docs/process/qa-checklist.md` "When we check, and how deep" (Zafar, 9 Nov). Where this file says otherwise, that section wins. Each tier is one tool in `build/tools/tiers/` (settings: `tiers.json`), run at its moment by the step below, never on request (Zafar, 10 Nov).


**For:** the orchestrator, or a session whose brief says it publishes. `check-publish.mjs` (tier 3b) runs the checks; `publish.mjs` refuses unless it passed on this commit, then bumps, pushes once to `main`, waits for Pages, shoots the live page and runs `check-live.mjs` (tier 4).

## Before
- `check-sprint` ran when the sprint's main work was in (`/sprint`) and its fix list is fixed; Zafar said publish.
- No running session is mid-push to the same files.

## Steps
1. Tier 3b, every time (it is the gate; nothing to remember):
   ```
   node build/tools/tiers/check-publish.mjs
   ```
   It plays check-sprint's failed pages again and every changed game at one size to its end, runs `checks.mjs --full`, chai's frozen run and the stamp check, and writes the known-fails list (`build/reports/tiers/known-fails-<commit>.md`: what stays open, the fix list's open rows included; decision 89's "no open row" rule is gone, Zafar 9 Nov). It blocks only on checks red, a stuck page, a page error, a blocking check, or no check-sprint since the last publish. Fix what blocks, commit, run it again.
2. `node build/tools/ops/publish.mjs` (dry run): the branch, a dirty tree, whether `origin/main` has commits this branch lacks (art uploads land on `main`): `git merge origin/main`, on `?v=` conflicts take the real side, then step 1 again.
3. Publish (Zafar's yes):
   ```
   node build/tools/tiers/check-publish.mjs --go --log --trailer "<the Co-Authored-By and Claude-Session lines from your system prompt>"
   ```
   On a pass it runs `publish.mjs --go`: bump → commit (with the known-fails count) → push the branch → push `HEAD:main` → wait for Pages → screenshot `labs.html` → `check-live.mjs` (tier 4: each changed game's first minute at 740x320, a strip).
4. Look at check-live's strips first. A failure prints the one command that puts `main` back to the last good publish: run it, then look. Exit 3 (github.io not reachable from the container): check the `pages-build-deployment` run (GitHub MCP `actions_list`), then open each printed page on a phone.
5. Only then tell Zafar it's live: the link, what to play (`labs.html` links every lab), the known-fails list.
6. Update `docs/status.md` "What is live" (`/handover`).

## Never
Force-push; publish without the bump; say "live" before the Pages build for that commit ran.
