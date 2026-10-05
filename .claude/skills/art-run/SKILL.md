---
name: art-run
description: Plan, run and land a ChatGPT art run through Claude in Chrome - generate the paste block, judge what lands, cut it into game assets, and handle redos. Use when Zafar approves an art run or a redo list.
---
# /art-run: the block, the judge, the cutter

**For:** art packs. Method: `docs/design-language/art-pipeline.md` (§15 the tools and the runner loop), look: `art-bible.md`. Rules: D3, D12, decisions 29, 43; non-negotiables 13, 16. Zafar approves only art of real people (Nani, Big Ma, the doctor).

## Before the run
1. Plan first: what each object is for, how it's seen in game, who stands where (D-rules). The pack's plan is `docs/design-language/art-plans/<pack>-art-plan.md`; its run spec `build/tools/art/specs/<pack>.run.yaml`.
2. Validate, then build the one paste block (never hand-written):
   ```
   python3 build/tools/art/artblock.py --spec build/tools/art/specs/<pack>.run.yaml --check
   python3 build/tools/art/artblock.py --spec build/tools/art/specs/<pack>.run.yaml
   ```
   A redo: `--redo docs/design-language/art-plans/<pack>-redo-list.yaml` gives a block of just those lines.
3. Put it to Zafar: image count, expected redos, time; the block is pasted into Chrome by him, ready as is (A10). No art run without his go (decision 43).

## While it runs
- The runner loop in the block keeps N windows generating and commits kept images straight to `sources/art/<pack>/` on `main` (no downloads, no manual steps).
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
