# S19 tray and pot run (Claude in Chrome, pasted by Zafar, 10 Nov ~22:30)

Run 21:35 to 22:20, three chats (T1-T2, P1-P2, E1-E3), 15 images, pushed by Zafar to main as `assets/ChatGPT 261110 3/`; copied
here to raw/ as s19-tp-<line>-<try>.png and the picks to best/<line>.png.

| Line | Pick | Runner's open points | Orchestrator's judgement |
|---|---|---|---|
| T1 stone tray | T1-1 | 29% high, not 22% (chunkier) | pass: the game cuts it in three and tiles the middle from T2, so its height is set in code |
| T2 stone tile | T2-1 | seamless not verified | pass: edge jumps 3.7 against 2.9 inside, the four corners the same brightness (no falloff) |
| P1 pot, water | P1-2 | wall band wider at the top-left; too many bubbles; handle near the edge | FAIL on the must point: the wall is visibly uneven. Redo with Zafar's stubborn-picture method (s19-tp-redo-chrome-block.txt) |
| P2 pot, empty | P2-3 | same wall as P1 (an edit of it) | follows P1's redo; same box as P1, so they swap |
| E1 plate | E1-2 | 66% wide; camera higher than the counter (ellipse 0.40 against 0.2) | pass for wiring; its height set in code against the table; redo only if it looks tilted in the game |
| E2 fried egg | E2-2 | 51% wide (consistent with E1) | pass |
| E3 egg halves | E3-2 | 52% wide; halves nearly touch | pass (one piece) |

Pattern the runner saw: asked to "check it, then generate one corrected version" in one message, ChatGPT mostly drew without a
written check, or wrote a check without drawing. Zafar's two-message review (runner-loop.txt, 10 Nov) is in the redo block.

Cut by build/tools/art/s19_tp_cut.py into assets/cook/items/v4/kit/ (tray-stone, tray-stone-tile, pot-water, pot-empty) and
assets/cook/items/v4/eggs/ (plate-table, fried-table, boiled-halves-table); contact sheet: ../contact-sheet.jpg.
