# Decisions, 10 Nov: one tool per check tier

## Asked
1. One tool per tier, named for the moment: check-push (tier 0), check-prototype (1), check-change (2), check-sprint (3), check-publish (3b, then the publish), check-live (4); thin wrappers over the tools we have, one settings file for what each tier runs, games touched worked out from git (overridable), each writing a result the next tier requires; the publish tool's gate replaced by "check-publish passed on this commit, with the known-fails list"; the skills call them.
2. Build it now with one builder (Opus, high, about $25-35) while the art runs; it shares the browser only for short one-size runs.
3. (open from 9 Nov, docs/decisions/2026-11-09-karahi.md) A better karahi in a small follow-up art batch with the full run's redos.

## Answer
(Zafar, 10 Nov, verbatim) "yes to all three. note I dont want to be requesting the checks they should happen automatically because of the way they're built into the process. which checks have our 100+ build in blood probe checks (that all run)?"

## Outcome
1: yes: and they run by themselves: built into the process (hooks and the skills), never requested by Zafar
2: yes
3: yes
