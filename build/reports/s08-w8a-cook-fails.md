# s08 wave 8A: Cook, the pre-publish evidence FAILs

Builder: Opus, worktree branch `worktree-agent-a4d17ff2d400b8b9d` (reset onto `claude/new-session-b5r2am` at 1cf4a05c; it had been cut from `main`). Not pushed.

## What changed

- **Art loads capped in real time.** Seven loads raced `Cook.wait` (a 5 s cap was 1 s at test speed): green boxes, the pan never tipping. All now use `St.loadArt`/`St.capLoad`; new static rule `loadcap`, unit-tested.
- **MAA-14:** not a different woman: the pop-up's face was the half-length badge and the frown a close-up. It now uses her face sheet throughout.
- **Blank faces** (DAAR-04/18, CHT-06): every card redraw made a new face picture; decoded faces are now kept.
- **Sekelo at 800x360:** the shelf measures the go-on button and keeps clear of it; the L3 hint waits the level's pause (contract-24).
- **Triage fixes:** samosa writes its count at L2-L3 (SAM-04); the count badge stays inside the stage (SH-39); the coin jar is fetched before the summary (SH-51); no digit 0 on a chip; the ghost finger holds the knife's handle; bigger sugar heaps (SH-32); maani L3 always asks for both doughs.
- **Stale tests:** the vessel check reads the s08c kadchi and tray; the orders test reads chai's and maani's levels from the data.
- **Chicken:** in the sekelo decoy pool (four in the pool, still 1/2/3/3); on Mum's recording sheet after an `import_all` rebuild (which also caught up the clinic heal sources). The engine writes it as *murgi* (confirmed in the lexicon) and the device speaks it: making it the English "chicken" placeholder needs a lexicon change (not my file).

## Open

SH-57 is Zafar's bulb (ux-principles §139), but CLAUDE.md rule 5 leaves the bulb out: propose adding it. The evidence cmd runs on port+1, so mine (8874) used 8B's server: SEK-05's machine FAIL is stale; locally it is green.

## Proof

Red = the base run ev-20261020-203453-9h9 (its sheets and machine lines) unless named. Green runs (sheets in this worktree's `build/screenshots/evidence/`, not in git; indexes in `build/reports/`): **uz7** = ev-20261021-002422-uz7, **1lu** = ev-20261021-010237-1lu. All need the judge; nothing here is self-passed.

### Task 1: blockers

| Item | Red | Green |
|---|---|---|
| (a) loadcap rule | `static.mjs --only loadcap`: 7 findings (chai-tray 252, assemble 929, flow 903/907/1065, grill 984/1031) | 0 findings; `static.test.mjs` 10 pass |
| (a) CHAI-25, CK-04, CK-13: green boxes | base sheets (boxes by the knob and face badges) | uz7: every face drawn, no box |
| (a) CHAI-08: pan tips, glass fills | base C: pan flat, glasses empty | uz7 C: pan over the glass at 505-911 ms, glass full at 1354 ms |
| (b) MAA-14 | base A 3002/3600 ms: badge to close-up swap | uz7 A: one close-up face, her frown at 2400-3001 ms |
| (c) blank face | base DAAR-18 4-6, CHT-06 B7-8 | 1lu DAAR-18, CHT-06: faces in every frame |
| (d) mishkaki@L3#hint 800x360 | run w8a-sek-red: timed out, "veg-03 covered by #go-btn" | run w8a-sek-green: end reached at 800x360 and 1366x768 |
| (e) SH-57 | English after the bulb | ZAFAR: the bulb's 8 s English is his (D11, SH-41) |

### Task 2: triage

| Row | Class | Proof or reason |
|---|---|---|
| CHAI-06, CK-02, SH-33 | STALE TEST | check_vessel_meta exit 1 (v3 ladle and rack) → exit 0; uz7 machine PASS |
| SEK-05 | STALE TEST + FIXED | test_cook --orders exit 1 (chai L3 three cups; maani sizes only at L4; maani L3 one dough) → exit 0 on 8873. 1lu's FAIL ran on 8B's server (port 8874) |
| CHAI-15 | SPEC | chai L3 is two cups now; probe at L4 (three): uz7 PASS |
| DAAR-08 | SPEC | the L4 order card is folded; probe reads daar's chop card: uz7 PASS |
| DAAR-22 | SPEC | at test speed the halves had gone by frame 2; speed 1, 90 ms: 1lu shows the split and the cut line |
| SH-19 | SPEC | a second "visible" moment after the finger's one pass failed the count; judged by check_onboard: 1lu PASS |
| SAM-04 | FIXED | base B: "chundo", no count → uz7 B: "hakro chundo", "ba chunda" (L2) |
| SH-39 | FIXED | base B 844x390: badge cut at the top → 1lu B: whole |
| SH-51 | FIXED | base A: empty card → 1lu A: jar shown (one fill picture up to 37 coins is the fill rule) |
| SH-32 | FIXED, not re-shot | heaps were drawn but faint; a third bigger (762be095) |
| DAAR-12 | ZAFAR + FIXED part | L3 dial follows Nani's spoken switch (level table); card keeps the first ask (a leak question for him). Digit "0": base D → 1lu D icon only |
| DAAR-13 | FIXED part, rest BIG | finger off the blade (1lu A); throws still cross mid-air |
| LNG-03, SH-13 | ZAFAR + SPEC | L3 dots item words, numbers written; L4 dots uncalled rows (level table, DAAR-34): uz7 PASS |
| SH-12 | ZAFAR | L3 dots; the chip rule (Zafar, 20 Oct) |
| SH-14 | ZAFAR | picture stickers, never word labels (decision 88) |
| PAN-10 | ZAFAR | one face, no folded box (Zafar, 14 Oct) |
| CK-21 | ZAFAR | no shadow needed (Zafar, 14 Oct) |
| DAAR-34 | ZAFAR | the bulb peek writes every word (SH-98) |
| CHT-04 | ZAFAR | the bowl is CHT-14's; the serve probe can't reach a service view in the lab |
| CK-27 | ZAFAR | the shared effect is a ripple since CK-06 (w6M) |
| PAN-07 | SPEC (words) | "side-on" (28 Sept §4) means the items, which are side-on |
| PAN-13 | ZAFAR | day 1: pantry, chai demo, chai's pantry, chai |
| CK-07 | BIG | the faces were shrunk off the glass (CHAI-08 flaw) against CK-07's large face |
| PAN-01 | BIG | stamped card and 800x360 scroll: shared order card / cook-side-v2.css |
| SH-56, SH-63 | BIG | the guide box is empty between calls in base and now (old ui.js too); needs the line table |

Proposed row words: LNG-03 "no English or 'boga' placeholders; dots only as the level table dots"; SH-13 "L1 counted aloud, L2-L3 written, L4 heard"; CK-21 drop "shadows to the right"; PAN-10 drop "the guide box folded at L2"; PAN-07 "the pass-me pop-up's items side-on"; CK-27 "one shared ripple".

Checks: `checks.mjs` all ok (unit 462, words, static, leak, bump, specs, docs, recordings, size, load 29/29); check_onboard ok; lint-specs 0.
