# T2: art tools and the faster runner (decisions 43, 44)

No game code, data or assets changed; no art run started. Tools in `build/tools/art/`, all `--help`; documented in `art-pipeline.md` §15.

| Tool | Command | Saves | Proof |
|---|---|---|---|
| Cutter | `artcut.py specs/clinic-heal-v3.cut.json [--out D --only ID --list]` | grid cuts, single-figure trim, ECC-registered states, partial alpha, exit edges, @2x webp, anchors | Girl's wide poses, child and girl close-ups, O1/O3: 73 files, **0.000 % pixels differ** from `cut_clinic_heal_v3.py` and from committed `assets/` (`artdiff.py`). Old scripts kept |
| Block generator | `artblock.py [--check] [--redo LIST] [--sync-doc]` | the paste block from the plan's tables and a run spec; `--check` validates every prompt and dependency | Regenerated the clinic block (115 lines): run order differs only in wording; redo block built from the new redo list |
| Judge | `artjudge.py [--only ID] [--json F]` | canvas, flat ground and shadows, framing, skin ΔE, text on the ground, edit identical or leaking, W10-style scale, near-duplicates, glossy discs | Part B and C sources, 67 images: 52 pass, 15 flag, 0 fail. Flags: U1, M1, M2, Y1–Y3, W10, O2, T1/K1/K2/P1 skin, boy E1/M1, S3 margin |

**Runner (decision 43):** the block now has a loop. N windows always generating; harvest, judge in one look, refill at once; commits batched while windows generate; kept images attached from the workspace, so edits never wait for GitHub; parts are priorities, not walls. Stall rule: reload once, retry once in a fresh chat after 10 min, then skip and log. Knobs live in the run spec. The loop is one template, synced into `art-pipeline.md`.

**Redo list:** `art-plans/clinic-heal-redo-list.yaml` (U1, M1, M2, Y1 + Y2/Y3, T1 gaze, W10, O2). The standing send-off pose is NOT READY: the plan has no W11 prompt to paste.

**Gaps:** the judge cannot see gaze, fingers, likeness or a sleeveless U1; text is found on the ground only. SIFT rooms (R3, R4) and gauge/chart measures stay in the old script. The old paste block was overwritten by the generated one (git has it).
