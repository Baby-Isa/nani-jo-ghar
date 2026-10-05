---
name: publish
description: Publish the branch to main (the live GitHub Pages site) and confirm it is live. Use only after the review passed and Zafar approved publishing.
---
# /publish: bump, push, confirm live

**For:** the orchestrator, or a session whose brief says it publishes. Rules: B6, B7, B8, B9, B20, C9 (`docs/process/rules.md` §2-3).

## Before
- `/review` passed at the full matrix; Zafar said publish (B20, decisions 33, 34, 37).
- No running session is mid-push to the same files.

## Steps
1. Dry run (the default; changes nothing):
   ```
   node build/tools/ops/publish.mjs
   ```
   It reports the branch, a dirty tree, whether `origin/main` has commits this branch lacks (art uploads land on `main`), and what the bump will touch.
2. Clear the blockers it names. `origin/main` ahead: `git merge origin/main`; on `?v=` conflicts take the real side (the bump rewrites them anyway).
3. Publish:
   ```
   node build/tools/ops/publish.mjs --go --log --trailer "<the Co-Authored-By and Claude-Session lines from your system prompt>"
   ```
   Bump → commit → push the branch → push `HEAD:main` → poll the site's `js/version.js` until it serves the new stamp → screenshot `labs.html`.
4. If github.io isn't reachable from the container, it says so: check the `pages-build-deployment` run for the commit (GitHub MCP `actions_list`), then open the site.
5. Look at the screenshot. Only then tell Zafar it's live (C9): the link, what to play (`labs.html` links every lab), the screenshot.
6. Update `docs/status.md` "Live today" (`/handover`).

## Never
Force-push; publish without the bump; say "live" before the Pages build for that commit ran.
