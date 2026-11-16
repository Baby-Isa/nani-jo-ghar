# Run 16: prove

Rounds every 20 minutes: `node build/reports/run16/prove-round.mjs` (fetches the run16 branches, proves each new `<name>-ready.txt`).

## Warm-up (05:24-05:35 UTC)
check-change on the base 48003532, chop only: PASSED in 11.5 min (push 4.6, play 3.2, before 3.2, film 0.4). contract-119 already red on the base (10 breaks in chop), so it does not count as a new break. Each extra game adds about 7 min (play + before). Report: prove/warmup-base-chop-change.md.

## Rounds
- 06:00: no ready list on any branch (fix-kit, fix-daar, fix-chai, fix-stove exist; fix-samosa not yet). Nothing to prove.
- 06:21-07:32: fix-kit at 3332fbe (stale by 07:30). Its checks twice: DAAR-57 PASS/PASS, CK-121 PASS/PASS, SH-292 unit pass/pass, SH-267 0 contract-119 breaks on all 14 pages both runs (eye panels to the judge). SH-232's "test" contract-s17.mjs is a library: node --test passes it trivially, so it proves nothing. check-change (chop, chaat, eggs at L1-L4) was stopped in its "before" step at 07:32 when fix-kit moved to 5d05688 (SH-314: mount.js, word-card.js). Log: prove/fix-kit-3332fbe.log.
- 07:12: no-browser unit tests twice on fresh worktrees: CHAI-99 (fix-chai 6be737a) pass/pass; DAAR-55's framebuf-hide.test.mjs (fix-daar 8924847) pass/pass (fix-daar now belongs to prove-2).
- 07:11 (orchestrator): prove-2 takes fix-daar and fix-stove; a builder's own check-change report at a commit after the base stands in for mine.
- 07:18: fix-chai 6be737a and fix-samosa 6228a48 started (check-change --no-film). maa28 run 1: exit 0 (13 min).
- 07:33: fix-kit 5d05688 restarted at its head: SH-267, DAAR-57, SH-270, SH-314, SH-292, CK-121; check-change --games chop,eggs,corn,baking --levels 1 (the builder's own args) --no-film. The builder's own report (change-0725e61000, before SH-314) FAILED (frozen chai, the mount test, contract-113 in baking, contract-37 in eggs), so it does not stand in.
