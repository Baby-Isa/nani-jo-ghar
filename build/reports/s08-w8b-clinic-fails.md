# s08-w8b-clinic-fails

Branch `worktree-agent-ae8f5f408ae173d90`, reset onto `claude/new-session-b5r2am` (1cf4a05c), as the worktree had been made from `main`. Not pushed.

## What changed

Four small code fixes, each in the table below: the foot lights its splinters after the jugs (CLN-82), the card's ticks stop blinking out (SH-10), a placeholder line stops at a tap (SH-64), and the fan row fits beside its tick (CLN-148). A child could always finish the foot: every run reached its end.

The "[ph]" the judges saw is the capture's tag for the hidden to-record placeholder. No screenshot shows it, and Zafar allows the placeholder while testing (21 Oct).

CLN-118 follows Zafar's later words (18 Oct). "Hakro" (one) is still written, against his 19 Oct "one is never written": that is SH-99's open engine work.

Specs: 22 probes now reach their moments, and ten live rows have specs. PRC-06 still fails on nine rows that are not mine.

## Proof

| what | result |
|---|---|
| Code | `js/clinic/heal/games/foot.js` (nextUp: every splinter lit, never the first toe alone (the leak test), the jug put down), `js/clinic/heal/host.js` (the reveal hands a non-tool next thing to the game), `js/clinic/kit.js` (`.tk-seen`; the placeholder's hold ends at a voice stop; a refit 80 ms after a card with a step group is drawn), `css/clinic.css` (`.fo-next`), `css/shared/order-card.css` (`.tk-seen` stops the pop-in; only the clinic card sets it) |
| Matrix `s08-w8b-clinic-fails-matrix` | 88 pages (11 flows x 8 sizes): 88 reach their end, 0 page errors, CONTRACT PASSED (0 breaks), layout lint 0 new findings |
| Shotdiff | 924 changed against an approved manifest from before the s08 art. Flaws first: many end cards sit on a bare grey stage (boing, cut, ear, every size): CLN-69. Nothing from this session shows there (the glow and ticks are mid-game) |
| checks.mjs | unit 461 pass, words, static, bump, specs, docs, recordings, size: ok. The picture-load check fails one page, cook:chop: `assets/cook/characters/nani-face-talk.webp` is 280 px wide and drawn at 56 px. That is Cook's art; this diff touches no Cook file and no face |
| Regression rows | `regress.mjs`: 150 for these flows; the matrix and the evidence runs are tonight's recheck, row by row is `/review` |
| Sound, words | 72 lines with no family clip; word checks unchanged (39 English literals in game code, 0 Kutchi) |

### Rows (red: `ev-20261020-203453-9h9` unless named; green: `build/screenshots/evidence/w8b-green{1,2,3}/`, judge pending)

| row | class | proof or reason; proposed words (ZAFAR) |
|---|---|---|
| CLN-82 | FIXED + SPEC | red `w8b-red1` E/F: the jug's ring stays lit through the pulls, nothing on the foot lit. Green `w8b-green1` CLN-82-3 E4 (13.5 s): ring gone, all three splinters glow, the next row lit. The probe now films the whole close-up, max 20 (it stopped before the plaster) |
| CLN-118 | ZAFAR | SH-99/CLN-161, Zafar 18 Oct. Words: "The first time a child plays any heal game is a taught round: the ghost finger shows each move, nothing scored or timed; every count it needs is written and said (SH-99)" |
| SH-10 | FIXED + SPEC | red `w8b-red1` F7: four rows, no ticks. Green `w8b-green1` F1-F7 keep every tick; the plaster row ticks 0.4 s after it goes on (its step closing), then the card folds to its check: new probe at zoom-out (`w8b-green2` SH-10) |
| SH-64 | FIXED | red: the judge, pharmacy "plaster" 0.34 s past the tap, scrape 0.32 s. Green `w8b-green1` SH-64.md: both end 0.03 s after the tap. The driver still taps near a line's end, not 0.5 s in (`build/sandbox/flows/clinic.mjs`, not mine) |
| CLN-148 | FIXED | red: the judge (the fan row under its tick) and my 800x360 probe; green: the same probe after the fix, the row fits beside its tick; `w8b-green2` CLN-148 A4. A5 is the card mid-fold (by design) |
| ART-18 | BIG | the clinic's talkers now move their mouths (talk faces, ART-19: open, two strikes, waiting on art), not the bob, so `.cl-staged` traces 0 px; which applies is ART-19's call |
| CLN-34 | ZAFAR | CLN-174 (Zafar 18 Oct, "kidney-shaped metal tray"). Words: "...wax is dragged to the kidney dish, not tapped..." |
| CLN-35 | SPEC | the tap-during-speech frames all fell at 5.5 s; added a child's-pace probe with the sidebar (`w8b-green1` CLN-35 B) |
| CLN-37 | SPEC | at test speed the end card was already up; real pace shows the plaster on the arm (`w8b-green1` CLN-37-2 D2) |
| CLN-40 | ZAFAR | one sore foot (CLN-47, D10) and the splinters drawn out by the finger along channels (CLN-193, Zafar 18 Oct): no tweezers. Words: "Foot: the swirly part understood; toes and plaster position clear; each splinter drawn out along its channel, buzz-wire style" |
| CLN-43 | BIG | the push-in swaps to an arm laid flat that is not her seated pose: needs a matched close-up (art redo list) |
| CLN-44 | SPEC | the headline is a to-record placeholder, which textMatches skips; now a count plus its words in the capture: machine PASS `w8b-green2` |
| CLN-52 | BIG | the decay's look is the new tooth art (TH1); tooth rows CLN-181 to 184 are open: art redo list |
| CLN-57 | ZAFAR + SPEC | the "empty" bubble is "barabar" caught mid fade-in (probe: opacity 0.26 to 1); the next thing glows after a pause, the help ladder (SH-60, decision 95). Words: "...always clear what to do next: the doctor's line and the lit row name it; it glows after a pause..." |
| CLN-69 | BIG (real) | the matrix shows the end card on a bare stage at every size (boing, cut, ear: `s08-w8b-clinic-fails-matrix/clinic-heal-boing/1366x768/04-results-badges.png`); a lone page (my probe, the same URL, fast and real pace) keeps the room behind it for 6 s. The cause is not found (keep() runs; something after it clears the stage in the sandbox's run). Probe moved to results-badges at real pace (`w8b-green3`: B and C bare) |
| CLN-87 | BIG | the push-in runs 2.5 s by design (S05-D3, CLN-163: the room handed over at 60%), so zoom-in-end lands at 3.3 s; about 1.5 s on screen means redoing the zoom with CLN-163 |
| CLN-98 | SPEC | my probe: her "I feel happy." bubble sits on her head from 2.0 s at L2; taken as it is made it is still see-through. Now 350 ms later (`w8b-green3` CLN-98) |
| CLN-99, SH-62 | ZAFAR | the pointed tip is SEK-17 (built 13 Oct: the clinic's steps drawn as the sekelo skewer, tip below the last pill). Words: "...the sequence's stick ends in its tip below the last row (SEK-17)..." |
| CLN-101 | ZAFAR | S05-D3 after P32 (Zafar 1 Oct, "You have to drag it"): one move, pressing a blob takes the tweezers. Words: "the ghost finger drags a blob to the kidney dish with the tweezers riding on it" |
| CLN-108 | ZAFAR | the wash is CLN-190 (open, two strikes: Zafar's, "a colored, coded jet") |
| CLN-151, SH-55 | SPEC | noClip tripped on the face circle, which crops its picture by design; now the rows: machine PASS `w8b-green1` |
| CLN-152 | BIG | a flake: the eye's pill tap reached the game 350 ms later (a long task as the chart row closed), not dropped; fever passed |
| CLN-178 | SPEC | at L1 the every-change frame of the last change came after the end card; a strip from the fan shows barabar, the close-in on her well face and the pull back (`w8b-green3` CLN-178-4 D). Flaw: the wall thermometer is cut at the right edge in the close-in |
| PRC-06 | SPEC | SH-18's spec error fixed (machine PASS `w8b-green1`); specs for CLN-154 to 158, SH-86, SH-89, SH-92, SH-93 (reached, `w8b-green2`), SH-90 as Zafar's feel. Still no spec, not mine: CK-45, CK-46, LNG-15, MOD-05 to 09, MOD-11. Decided since: CLN-115 (19 and 20 Oct: the doctor at his open door), CLN-131 (14 Oct: rows stay, fold at the end), CLN-61 (decision 85: layout A), CLN-122 (12 Oct: framing kept), SH-104 (19 Oct: held aside). CLN-137 still waits on art |

### Tool failures

| row | now | cause |
|---|---|---|
| CLN-65, SH-17, SH-69, SH-73, LNG-05, SH-72 | reached (`w8b-green1-3`) | moment or capture moved to where the thing is. SH-72 p1 is a real machine FAIL: Cook's chai-tray L3 pop-up writes 5 rows (the level table: Cook's) |
| CHAI-02, CHAI-07, CHAI-17 | reached (`w8b-green2`) | the pan has left the screen after the pour's done-tap: now at the pour |
| DAAR-06, CHT-03, CHT-11, CK-20, ART-08 | open | the canvas object is on screen neither at results nor at the service view (tried): needs Cook's current texture names (8A) |
| SH-58, CHAI-18 | open | Cook rounds no longer end on a lone ✓ (only:/visible:#done-btn never comes): needs Cook's new end moment |
| CHT-08, SAM-03, SEK-03, SEK-13, CK-38 | open | the Cook drivers never reach retry, order-card-in-sidebar or the L3 hint peeks (8A, flows/cook) |
| SAM-01, SAM-15 | none needed | the run ended before those pages: resume |
| CLN-07 | open | CLN-159 hides the lab log unless `html[data-lab-debug]`, set only by lab/clinic-heal-host.html on ?debug=1: the lab-log-on driver and clinic.html (not mine) need `&debug=1`, or CLN-07 retires |
| CLN-112, CLN-22 | open | the pharmacy take-back strip never changes; driver in flows/clinic.mjs (not mine) |
| CLN-73 | spec only | the probe now waits 600 ms for the word page to slide in; not rerun |
| CLN-102 | open | the ear's mistake player never picks wrong at the hearing test (driver) |
