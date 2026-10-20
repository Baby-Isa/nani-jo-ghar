# Sprint 7: Art, clinic first

**Status:** closed (16 Oct 2026)
**Opened:** 15 Oct 2026 · **Closes at:** the publish to `main`, Zafar's play and `/feedback` (his full play-through is Sprint 8)

## Goal
A short ChatGPT art run, clinic first, landed and stitched into the game: the grandad doctor is the real one everywhere with extra poses (arms up, down, folded, waving, pointing ...), the conveyor-belt items are drawn at the belt's angle and sit on it, every bump and scrape is final art; then Cook (the kitchen as the first master background, SH-91, ART-21) as far as the run gets (Zafar, 15 Oct).

## Budget
About $120–180, ceiling $200, 2–3 days, plus Zafar's time running the block in ChatGPT.

## Sessions
None; all in the orchestrator's chat (Opus) with in-chat subagents:
- Plan and paste block: Fable (art planning is Fable's kind), about $15–25: `docs/design-language/art-plans/s07-art-plan.md`, `build/tools/art/specs/s07.run.yaml`, `docs/design-language/art-plans/s07-paste-block.txt`.
- Judge, cut and wire what lands: the orchestrator (Opus), the `judge` agent for pictures.

## Small decisions
- Order in the block (Zafar, 15 Oct): the doctor first, then the belt items, then the injuries, then Cook; if the run is cut short, the clinic is ready.
- Zafar, 15 Oct ("yes to everything"): the interim counter-seam fix (CK-44) this sprint; upscaling with Real-ESRGAN on our side; the kitchen master method; send-off back at the front door (CLN-25); the ladle (KD1) left as it is; N1 kept; adult limbs, other patients, CLN-107, PAN-06, CK-24, SH-37 and the station masters wait for next sprint.
- The girl first (Zafar, 15 Oct): every clinic game must play start to finish with the little girl in final art before other patients' art is made. His doctor sheets are the reference (`sources/art/s07/doctor-s1-sheet-v1.png`).
- Ready characters already in the repo (clinic boy, old man and woman, guests, cousin, dad with baby): wired only if easy.

## Outcome
Published 16 Oct 22:17 UK (38d0591a, 20261016T211414Z), past the publish gate on Zafar's word (no fresh full contract run; the 574-page chunked gate `build/reports/s08-gate.md` found no new break; two judge agents found no regression). Shipped: the s08 cartoony grandad everywhere in the clinic with his turns, talk and blink and portrait; him and the girl set back on one floor (Fable's spec, `s08-placement-judge.md`, `s08-placement-fix.md`, `s08-rejudge.md`); Nani's jaw-fixed new look everywhere outside the clinic, the family seated behind the counter (CK-46); the s07 belt, injuries, kitchen master and Cook art; the clinic items (sore face, matte drops, level plaster) and the top-view chai pan. Moved on: the bench's chibi stand-ins (ART-23), the hob pan, a truer sore face, the sekelo plate; CLN-17, CLN-25 and the rows the judges failed (all already open). Open rows: 51 (statuscounts). Money: image API $15.56 today (`s08-api-redo.md`) on top of the s08 style-lock and sheet runs; the rest Opus/Fable subagent time.

## Look back (three lines)
1. Worked: an independent Fable judge writing a numbered placement spec, then a builder applying it, then Fable rejudging; and the API for small art redos when Zafar said so.
2. Cost more: two builders lost to a restart and a full disk (scratch copies, 8 GB of gate PNGs); the browser lock shared by a gate and a builder made both slow.
3. Change: delete gate PNGs as each chunk is judged, and never run a gate and a builder's browser work at the same time.
