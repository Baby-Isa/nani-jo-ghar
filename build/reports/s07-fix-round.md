# s07 fix round: DAAR-05, CK-06, CLN-19, CLN-23, ART-10

Branch `worktree-agent-a7a2111ec7a1329ed` (from a0f2bd8a). No new art.

## What changed
- **DAAR-05, CK-06.** The white discs were the shared "it went in" puff: hard white ellipses with coloured centres. It is now soft rising wisps, with the same timing, still one shared effect (CK-27). The served bowl is now the plain bowl holding the pot's stirred daar and the DP1 pieces where the stir left them. The old tadka bowl with dry chilli and curry leaves is no longer used.
- **CLN-19, CLN-23.** The cotton bud is one flat bud (`bud-flat`) instead of the rough fanned swabs. The crutch lies on its side: B9's crutch turned 90° (`crutches-flat-belt.webp`).
- **ART-10.** Nani's guide face is her N1/N2/N3/N5 head, cut from the counter sprites. It shows talk while she speaks, happy for 1.6 s when an order row ticks, a blink at rest, and it follows `setMood`. "Roll it round." was never cut in the game (room shots show the whole box): zoom2 measured the box before it grew. zoom2 now measures again and shoots again.
- **Evidence:** a DAAR-05 probe at `hidden:#done-btn` for the served bowl.

## Proof
Red: `ev-s07` (same code as a0f2bd8a). Green: `ev-s07-fix3`, same probes plus DAAR-05 D. Flaws first: small soft wisps still show at the pot's rim just after a drop (DAAR A2/A5, CK-06 A3/A5). The judge may still call them white. Most ART-10 moments land on her resting face; one is happy. B shows no impatient face. The served bowl overlaps the empty trivet (older layout). unit, static, leak: ok; load: see final message.

## Suggestions
Rows: DAAR-05, CK-06, CLN-19, CLN-23 and ART-10 (Nani half) to the judge. The impatient faces stay open.

Log: `16 Oct · s07-fix-round · soft puff, served bowl shows what went in, belt bud and crutch lie flat, Nani's box face has moods, zoom2 re-measures`
