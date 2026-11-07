# s17-o6-art: the clinic redo's three redos landed (7 Nov)

**What changed.** Zafar's second upload (`sources/art/s17-clinic-redo/inbox2/`, 3 images) matched to the redo block's three lines and
renamed `cn03-diagnostics-v2.png`, `cn04-diagnostics-2-v2.png`, `cn09-casts-comfort-v2.png`. Only the named item was cut from each:
the tongue depressor and the hourglass over their stand-ins, the ear syringe new (`assets/clinic/s17-clinic-redo/`, 138 props). The cut
spec gained three `-v2` jobs and its v1 jobs dropped those names. The redo list is empty (history kept). The landing report carries the
full addendum (`build/reports/s17-clinic-redo-landed-2026-11-07.md`, "Second addendum").

**Flaws first.** CN03's tongue depressor is a warm mid-brown (L* 54), not walnut by the numbers: darker than the honey it replaces, lighter
than the pack's other wood (L* 41-43); passed by eye as the prompt's "mid walnut, not too dark" and flagged; one line puts it back on the
list. CN04's hourglass (frame `#8d5634`) and CN09's cream ear syringe pass cleanly.

## Proof

No browser: the brief names no rows or flows and nothing in the game changed.
- `artjudge.py --only CN03,CN04,CN09` on the v2 sheets: 1 pass, 2 flag (sheet-wide edge and margin, as v1), 0 fail.
- `artcolour.py` the three sheets + CA01 as one batch: 4 pass; the three cuts: 3 pass; the folder as `items-s17`: 138 pictures, 124 pass, 14 flag, 0 fail.
- `artcut.py --only cn03-v2,cn04-v2,cn09-v2`: 3 jobs, 0 flags; `artpixels.py`: 3 PASS; `artcheck.mjs`: 471 known, 0 new.
- `node build/tools/review/checks.mjs`: all ok on the final commit (the lines are in the handback).

**Open.** Nothing wired (a future sprint, section 6 of the landing report). Not this session's files: one overnight-log line (the orchestrator).
