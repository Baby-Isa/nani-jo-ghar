# T2: art tools and the faster runner (decisions 43, 44)

No game code, data or assets changed; no art run started. Tools in `build/tools/art/` (`--help` on each; `art-pipeline.md` §15).

- **Cutter** `artcut.py specs/clinic-heal-v3.cut.json [--out D --only ID]`: grid cuts, figure trim, registered states, partial alpha, exit edges, @2x webp, anchors. Proof: 73 files (girl's wide poses, close-ups, O1/O3) with **0.000 % pixels differing** from `cut_clinic_heal_v3.py` and from committed `assets/`, via `artdiff.py`. Old scripts kept.
- **Block generator** `artblock.py [--check] [--redo LIST] [--sync-doc]`: builds the block from the plan's tables and a run spec; `--check` validates every prompt and dependency. Proof: the clinic block regenerates (115 lines), run order differing only in wording.
- **Judge** `artjudge.py [--only ID] [--json F]`: canvas, flat ground, framing, skin ΔE, text on the ground, edits (identical or leaking), W10-style scale, duplicates, glossy discs. Proof, 67 sources: 52 pass, 15 flag, 0 fail. Flags: U1, M1, M2, Y1–Y3, W10, O2, skin on T1/K1/K2/P1, boy E1/M1, S3 margin.

**Runner:** the block now carries a loop: N windows always generating; harvest, judge in one look, refill at once; commits batched while windows generate; kept images attached from the workspace, so edits never wait for GitHub; parts are priorities, not walls. Stalls: reload once, retry once in a fresh chat at 10 min, then skip and log. Knobs are in the run spec; the loop is one template synced into `art-pipeline.md`.

**Redo list:** `art-plans/clinic-heal-redo-list.yaml` (U1, M1, M2, Y1 with Y2/Y3, T1 gaze, W10, O2). The standing send-off pose is NOT READY: the plan has no W11 prompt.

**Gaps:** the judge can't see gaze, fingers, likeness or U1's missing sleeve. SIFT rooms and gauge/chart measures stay in the old script. The generated block replaced the old one (in git).
