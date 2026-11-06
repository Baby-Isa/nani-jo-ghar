---
name: art-run
description: Plan, run and land a ChatGPT art run through Claude in Chrome - generate the paste block, judge what lands, cut it into game assets, and handle redos. Use when Zafar approves an art run or a redo list.
---
# /art-run: the block, the judge, the cutter

**For:** art packs. Method: `docs/design-language/art-pipeline.md` (§15 the tools and the runner loop), look: `art-bible.md`. Rules: non-negotiables 8 and 9 in CLAUDE.md. Zafar approves only art of real people (Nani, Big Ma, the doctor).

## Before the run
1. Plan first: what each object is for, how it's seen in game, who stands where (D-rules). The pack's plan is `docs/design-language/art-plans/<pack>-art-plan.md`; its run spec `build/tools/art/specs/<pack>.run.yaml`.
2. Validate, then build the one paste block (never hand-written):
   ```
   python3 build/tools/art/artblock.py --spec build/tools/art/specs/<pack>.run.yaml --check
   python3 build/tools/art/artblock.py --spec build/tools/art/specs/<pack>.run.yaml
   ```
   A redo: `--redo docs/design-language/art-plans/<pack>-redo-list.yaml` gives a block of just those lines.
   `--check` reads every line's filled prompt for Wada colour names (ART-58): a colour outside the house family (or the pack's `house: {combination: N}`), or colours no one combination holds, fail unless the line says `colour_exception: <why>` (a colour-coded set: the colours are the game), which the block prints for the runner. It also takes the prompts' section number from the plan's `## N. The prompts` heading.
3. **One paste block and one zip** (ART-29, Zafar, 28 Oct: "all artworks are given to me a single paste blocks for claude in chrome will all images and things it needs uploaded to github or wherever it can access"; ART-42, decision 4, 6 Nov night): a download-mode block writes the run's references to `sources/art/<pack>/refs/` and `refs.zip`, and its first line gives Zafar the zip's raw link: he downloads it, unzips it and drags the files into the Chrome chat with the block; the runner uploads those into ChatGPT and asks once, at the start, if one is missing. Push the zip with the block, then `--check --pushed` must pass. Put it to Zafar: image count, expected redos, time. No art run without his go.

## While it runs
- The runner loop in the block keeps N windows generating. In download mode (every pack since s08c) kept images stay in their ChatGPT chats, go into later prompts by "Add from library", and come down at the end in one go from ChatGPT's Library; Zafar pushes them.
- References are only the files from the zip, attached with the block (ART-42). If a run stops at an upload anyway, fix the tool and its tests (`artcheck.test.mjs`), then reissue the block; `refs_from: library` is retired.
- Count landed images at each check-in: `node build/tools/ops/checkin.mjs --art sources/art/<pack> --art-target <n>`.

## When images land
1. Judge every source, pass/fail, before anyone else sees it (needs `opencv-python-headless`):
   ```
   python3 build/tools/art/artjudge.py [--only ID] [--json out.json]
   ```
   It can't see gaze, fingers or likeness: look at those yourself.
2. Failures go on the pack's redo list; fix them before Zafar sees anything.
3. Cut into game assets and prove the cut:
   ```
   python3 build/tools/art/artcut.py build/tools/art/specs/<pack>.cut.json [--only ID]
   python3 build/tools/art/artdiff.py --help
   ```
4. Wiring is a separate build session (`/brief`), then `/review`.

## Standing lines

Word for word from the retired rulebook and decisions log (`docs/archive/process/rules-2026-10-13.md`, `docs/archive/decisions/decisions-1-to-99.md`); the newest word from Zafar wins.

- **Only make art for items the game will use;** reuse approved art where it fits, but say so.
- **Decision 29 (5 Oct):** Zafar approves art only for characters based on real people; everything else is judged pass/fail by the runner and Claude; art runs need no manual steps.
