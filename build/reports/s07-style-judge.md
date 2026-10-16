# s07 style judge: the doctor, Nani and the girl (16 Oct 2026)

Zafar, 16 Oct, on the clinic diagnosis screen at 800×360: "The girl and doctor look like different game artwork styles … he's much too close to the foreground … do any two of the three match up?" Flaws first. Nothing changed in code or art; the prompts are in `docs/design-language/art-plans/s08-style-prompts.md` (not run; he approves first).

## 1. Verdict: no two of the three match; the doctor is the odd one out

| | Render | Head : body | Eye width (of face) | Skin | Edges, texture | Light |
|---|---|---|---|---|---|---|
| **Doctor** (`sources/art/s07/doctor-s1-sheet-v1.png`, every pose) | **semi-photoreal 3D**, a photo-based render | 1 : 6.4 (head 106 px, body 676) | 0.13, real | pores, fine wrinkles, single beard hairs | no outlines; **fabric weave** on the check, refraction in the glasses | hard-ish key, upper left |
| **Nani** (`nani-n1-lean-neutral-v1.png`, the approved sheet, the game's `nani-neutral-v2.webp`) | **stylised 3D film adult** | adult (bust only in game) | 0.17, a little enlarged | smooth, no pores, rosy cheeks | no outlines; quiet knit, soft embroidery | soft key, upper left |
| **Girl** (`clinic-heal-v3/s1-girl-sheet-v2.png`, `girl-w1`, `s07/girl-w13-*`) | **stylised 3D cartoon child** | 1 : 4 (head 150 px, body 615) | 0.28, very big | smooth, flat | no outlines; no texture | soft key, upper left |

| Pair | Match? | Why |
|---|---|---|
| Nani and the girl | **yes, as adult and child of one film** | adults have smaller eyes and longer bodies than children in every animated feature; same smooth skin, soft light, simplified forms. Beside Ma at the counter (`ev-s07/ART-13.png`) the gap is small |
| Nani and the doctor | no | he is one level more real: pores, weave, real eye size, single hairs |
| The girl and the doctor | no | two levels apart: what Zafar sees |

How it happened: the s07 plan (flaw 1) chose "his render is a soft, fairly realistic 3D; every doctor prompt says 'exactly as the attached sheet', not the style anchor", so all 41 doctor pictures faithfully carry his sheet's realism. Nani's N1 asked for "render her face … as the attached Nana … not more photographic than him" and came out half way; Zafar rejected the cartoonier tries ("too cartoony and lose the semblance"). N1 is the proven ceiling of stylising for a real person.

## 2. Which suits the rest of the game: the girl; Nani sets the level for real people

| The rest of the game | Level |
|---|---|
| Family sheets `char-nana/ma/ali/isa-v1`, patients `chatgpt-batch3/char-clinic-*` | the girl's |
| Style anchor, rooms (`assets/clinic/rooms/*`, the kitchen master), items | the bible §1 "stylised 3D animated-feature look … no pores", i.e. the girl's |
| Art bible §1 "Don't" | "no photorealism: no pores … no real-person likeness beyond what survives stylising": the doctor breaks it |

**House style to converge on:** the bible's animated-feature look as it is, with one rule for real people: **Nani's N1 level** (smooth simple skin, eyes slightly enlarged, rounded forms, quiet texture, no more photographic than Nana), because that is where Zafar found the likeness survived. The doctor comes down to it; Nani and the girl stay.

## 3. Scale and placement

Measured on Zafar's shot (`/root/.claude/uploads/e8c41a29-f924-5d5e-910b-747f89d3189b/29276a97-image.jpg`: the room is 400 px tall, 40 px cropped off the top; shares are of the 1024-px room) and the desktop exam shot (`build/screenshots/sandbox/s07-gate/clinic-diagnosis-l3/1366x768/01-stage-diagnosis.png`, room 768 px):

| Shot | Figure | Crown | Feet | Body | Relation |
|---|---|---|---|---|---|
| 800×360 stand | doctor | y 26 → 0.165 | y 348 → **0.97** | 0.80 | his feet 15 px lower than hers: nearer the camera |
| 800×360 stand | girl | y 84 → 0.31 | y 333 → **0.93** | 0.62 | **0.77 of his height**; a 5-year-old (110 cm) beside a 170-cm man is **0.65**, so her size says "nearer", her feet say "farther" |
| 1366×768 exam | doctor | 0.255 | 0.88 | 0.625 | |
| 1366×768 exam | girl, sitting | 0.13 | 0.68 | 0.55 seated | 0.88 of his standing height; her eye line level with his crown |
| send-off (`door`, `ev-s07/CLN-25.png`) | both | | 0.85 / 0.88 | 0.42 / 0.64 | **0.66, feet 0.03 apart: reads right. Copy this** |
| the room itself (CB3b) | a man at the back wall | | 0.664 | about 0.37 (dado at 0.46) | both figures stand "near the camera" by design (CLN-93: tappable parts); fine while they agree with each other |

Correct relation: one feet line (within 0.01 of the room) and him 1.5× her body, her crown at his chest.

| File | Key | Now | Proposed (not done) |
|---|---|---|---|
| `data/clinic/scenes-v2.json` | `stand.fig.bottom` / `stand.doctor.y` | 0.86 / 0.92 | **0.88 / 0.88** |
| | `stand.doctor.h` | 0.66 | **0.84** with her at 0.60 (1.4×; his crown at 0.04, the most the room's top allows), or **0.80 with her at 0.54** (1.5×) once the next row is fixed |
| | `stand.phone.fig.bottom` | 0.90 | **0.95** (= `stand.phone.doctor.y`); his 0.84 stays |
| | `exam.doctor.h` / `.y` | 0.66 / 0.90 | **0.80 / 0.90** (she sits 0.55; his crown at 0.10) |
| `js/clinic/figure.js` `useArt`, line 434 | `hFrac = V.h / roomPx / figH` | `figH` cancels against the layer's height: her standing art is always 632/1024 = 0.617 of the room, so `stand.phone.fig.h` 0.74 **does not** enlarge her on a phone as its note claims; only her feet move | size her as him (`kit.js` `doctorFigure`: `H * V.h / fig_h`) |
| `data/clinic/heal-art.json` | `doctor.fig_h` 676, `patients.girl.stand.h` 632 | the 1× body heights the code scales from | unchanged; a restyled doctor is re-cut (`build/tools/art/specs/s07.cut.json`) and re-measured |
| `js/clinic/stages/diagnosis.js` 44–60, `common.js` `S.doctor` | read these numbers | | no change |

## 4. Prompts

`docs/design-language/art-plans/s08-style-prompts.md`: a new sheet as an edit of his at Nani's level, a one-picture lineup as the gate, then the eight pictures the game uses (the other 33 kept turns are unwired spares), then his card faces. Nani: no line; an optional nudge is listed, not recommended.

## Proof

| Sheet (`/tmp/claude-0/-home-user-nani-jo-ghar/e8c41a29-f924-5d5e-910b-747f89d3189b/scratchpad/style/`) | Shows |
|---|---|
| `A-three-characters.png` | doctor, Nani, girl: sources and cut assets |
| `B-rest-of-game.png` | style anchor, family, patients, three rooms, kitchen master, items, old cook references |
| `C-live-screens.png` | Zafar's shot, sandbox diagnosis 800×360 and 1366×768, send-off, cook day 1, CLN-150, CLN-25, ART-13 |
| `D-heads.png` | fourteen heads at one height: eye size, skin, texture |
| `E-upload-grid.png`, `G-desktop-l3-grid.png`, `F-cb3b-grid.png` | the shots and the room with grids, where the numbers above were read |
| Code read | `js/clinic/kit.js` `doctorFigure`, `js/clinic/figure.js` `useArt`, `js/clinic/stages/diagnosis.js`, `common.js` `S.doctor`, `scenes-v2.json`, `heal-art.json` |
