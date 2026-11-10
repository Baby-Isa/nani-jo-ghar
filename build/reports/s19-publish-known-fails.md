# Sprint 19 publish: what is in it, and the known faults left open

Zafar's go (9 Nov): "Publish the behavioural work plus the three chai fixes plus the light builder work (basically all work done
since last publish) - do this all together after lights builder is done"; and (9 Nov late) "fix the maybe stuck games as well".

## In this publish
The shared cards, Nani's box and the ticking order card in every kitchen game; no tick, next or X buttons; one shared first-time
light and finger with the stuck help; Fable's flaws in sekelo, daar, eggs and corn; chai's three fixes; the stuck games fixed (the
title's "?" under the cog on phones; the shelf word pill's tap zone that sat over the item above it); the checks audit.

## Not in it (waiting for the new art, his word 9 Nov)
Chop's hop and the stoves round (knobs, tap areas, daar's count card) stay on their branches and go in with the art.

## Known faults left open
- The re-check (run s19-publish-3b, every changed game at 740x320, played to its end): all 16 end, 0 page errors, 6 rule breaks:
  contract-109 (shelf items off one line) 2, contract-41 (snap's own intro pop-up) 3, contract-105 (the first-time light not whole
  round its thing) 1.
- The full gate before the fixes (s19-publish-gate): 958 rule breaks over every game, about 590 from this sprint's new rules; each
  kitchen game's go into its chai-standard work this sprint (his word, 9 Nov); clinic and the other modes later.
- The layout findings (5,530, mostly "tap too small"): read inside each game's chai-standard work.

## Proof
Runs s19-publish-gate (build/screenshots/sandbox/s19-publish-gate/summary.md, contract.md), s19-publish-3b
(/tmp scratchpad 3b.log; build/screenshots/sandbox/s19-publish-3b/), the live-site replay main-stuck, build/reports/s19-stuck.md
(on branch s19-stuck, merged).
