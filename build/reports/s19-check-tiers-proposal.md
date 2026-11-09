# Check tiers: a proposal (Zafar asked, 9 Nov late)

His ask: "3 or 4 levels of checks ... rapid prototyping, where I just want to visually see and mechanically see how a game works ...
and at the other extreme what we do before we publish to the App Store ... number 2 and number 3 in the middle": a small tweak checks
only what it touched ("switching out the counter for the daar ... check the counter maybe at a few levels, check it counts correctly
... does it follow the blur, non-blur rules? But we don't need to be checking clinic or other game modes"); a full review of
everything a sprint changed, after the main body of work, not at the very end ("it's just frustrating ... open up the game, and like
the first 3 things are broken in 10 seconds"). Level and speed, not technique.

## The tiers

| Tier | When | Machines | Eyes | Time |
|---|---|---|---|---|
| 0. Every push | any commit | `checks.mjs` (code tests, words, leak test, docs, fix list), no browser | none | 3-5 min |
| 1. Prototype ("show me") | a new screen or mechanic, before building it properly | the lab page loads with 0 page errors at the four sizes | Zafar, from pictures or a gif in chat, the same hour | minutes |
| 2. Targeted | a tweak or a builder's rows | the touched game only, at the levels touched (L1-L4 if levels change), 740x320 and 930x430 (four sizes wait for tier 3); each row's probe red then green; that game's contract checks | the orchestrator's before/after picture, made by script from the base commit and the candidate (never the builder's own shots), to Zafar before merging | 15-30 min |
| 3. Sprint check | once the sprint's main work is in, BEFORE the fix-up (not at publish) | every game the sprint changed: L1-L4, four sizes, all contract checks, 0 page errors, end reached; every other game: loads and reaches its end at one size (shared code can break it); one fix list from the result | Fable beside chai on the changed screens; a script-made first-minute film of every changed game (first time and returning) | one scripted run (overnight if long); a person reads only the failures; one first-minute film per changed game |
| 3b. Fix-up and publish | after tier 3's fix list is fixed | the failed pages again, plus every changed game at one size to its end (fixes break neighbours), then `checks.mjs --browser`; the publish note lists the known fails left open | none new | 30 min |
| 4. Live smoke | right after the publish, before "it's live" | each changed game's first minute on the live site at 740x320; if it fails, put `main` back to the last good publish first, then look | the orchestrator looks at the strip first | 5 min |
| 5. App store | before the stores | everything at every size, every button, devices, the Kutchi gate, no device voice | to design | days |

## What it replaces or cuts across
- The publish gate over all 1,426 pages at every publish becomes tier 3 (changed games deep, the rest a one-size end-reached run);
  the full gate is tier 5 (his yes, 9 Nov: the gate only on the modes a sprint changed).
- Tier 3 moves the big run earlier: after the main work, before the fix-up; the publish then reruns only failures.
- The contract checks, row probes and evidence loop are the machines of tiers 2 and 3; the eye judge beside chai is tier 3's eyes;
  the light checks of 7 Nov are tier 2; the 9 Nov "Judging, split" is unchanged.
- New: tier 4 (live smoke), and tier 3's first-minute films (what he hits in his first ten seconds).

## Rules the checks keep (his principle: a rule that keeps failing is fixed or retired, never ignored)
- A stuck game (end not reached) or a page error is always fixed before a publish, unless the live site has the same fault and he
  says publish anyway.
- Every contract check that breaks at tier 3 gets one of three outcomes in the sprint: the game fixed, the probe fixed, or the rule
  retired with his yes. A count that only grows is the sign it is being ignored.
- A flaky check (fails, then passes with no code change) is logged and fixed or retired in the sprint; never rerun until green.
- Tier 0 refuses the push when it fails (a pre-push hook), so it never depends on remembering.

Fable (9 Nov, quick review): agrees, with the changes above folded in (3b reruns changed games, not only failures; the before/after
never the builder's own; the flake rule; the rollback line; tier 0 refuses the push; the known-fails list; two sizes at tier 2; one
film per game).

## Proof
Rests on: build/reports/s19-check-rules-review.md (the rules already decided), the gate run s19-publish-gate (build/screenshots/sandbox/s19-publish-gate/contract.md, summary.md), the live-site replay main-stuck, and Fable's review (9 Nov).
