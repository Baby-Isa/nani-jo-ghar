# S06 round 2: shared kit and clinic

Branch `s06-r2-shared`, unpushed (the brief). The pictures are for the judge.

| Row | Cause → fix | Red · green |
|---|---|---|
| CLN-118 | host.js timed every round, results.js always drew badges → a taught round: no time, best or badge page | on record · ev-20261014-033140-49j |
| CLN-127 | request-popup.js placeBubble centred above the head → bubble beside a painted or greybox head, tail at her cheek | on record · ev-20261014-052855-o2a; contract-4 clean (s06r2-127e) |
| SH-87 (new; my commits call it SH-86) | narrow 1024x768 tiles broke the English beside its speaker → it goes under | ev-20261014-045428-3bz · ev-20261014-050352-q9c, machine PASS |
| SH-86 (bulb) | Bulb.MS, BULB_MS 5/3/2/1 s → 8 s | static bulb check 2 → 0 |
| Boing card | Kit.rowHtml left a part-Kutchi row's bulb English untagged → grey, tagged | — |
| Checks 6, 20 | contract-18, contract-21; logged through Lifecycle.note | tests red then green |

Tools fixed: evidence crops now come from the whole screen (before, they could come back as the sidebar). The contract-15 regex had lost its backslash, so the check never fired. Contracts 8, 12 and 15 now measure to the page's real end.

Open: CLN-138 has no red, because its pre-fix code is older than the git history. CLN-144 and CLN-145 do not reproduce with the fix reversed. The boing contract-19 break is the jab count-down, not counting along: Zafar decides. Six contract-21 breaks are all Cook taps that log no act (Cook's code). The send-off has no level 4. The taught knee still says counts.

## Proof

ev-20261014-033140-49j, ev-20261014-052855-o2a, ev-20261014-045428-3bz, ev-20261014-050352-q9c, ev-20261014-051022-jv0, ev-20261014-051949-fho, ev-20261014-052119-vgy, ev-20261014-053034-587, s06r2-127e, s06r2-boing19, s06r2-route.
