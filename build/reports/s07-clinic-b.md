# s07-clinic-b: the belt items at the belt's angle, the boy and the old people on the bench

Branch `worktree-agent-a2839feb9e2c3fdd0`, not pushed. Game code changed: yes (Kit.icon, the belt dish, the waiting room).

## What changed
| Part | Change |
|---|---|
| Belt cut | `build/reports/s07-clinic-b.beltcut.py`: cut by component, soft shadows removed, base flush, glass kept soft. Output in `assets/clinic/sheets/{drops,thread,bandage,taste,decoys,hammer,drill,paste,patch,plaster-level}/` |
| Used on the belt | B5 drops ×4, B3 thread ×3, B2 row 2 rolls ×4, B8 lemon/milk jug/honey/spoon, B9 apple/tumbler(cup)/blanket/tissue/stethoscope/crutches/torch/hot-water bottle(bottle), B4/B6/B7/B10 cell 1 |
| Spares, not wired | tray views (B5, B3, B8 row 2; B1 rows 1–2 in `plaster-level`), B4/B6/B7/B10 tool and use cells, thread side and loose |
| `kit.js` | `Kit.icon`: `imgs[colour]` draws an own-colour picture, with no CSS tint |
| `data/clinic.json` | 18 items get `img`; drops, thread and bandage also get `imgs` |
| `pipeline.json` | comb removed from decoys; apple uses B9 |
| `sheets.json` | the new views |
| `pharmacy.js` | a long thin item gets a wider dish (≤1.6 items) so it isn't shrunk |
| Waiting room | the boy, old man and old woman are real art (`heal-art.json` `waiting`, cut jobs `*-sit` in `s07.cut.json`), seated like the girl. Heights: child 0.31, grown-up 0.42. Each has a tint band. |
| `data/clinic/assets.json` (not on my list) | `sheets/*/*-belt.webp` added to the shared assets, because the belt draws them on every page |

## Proof
- checks: unit, words, static, leak, bump, size **ok**. specs FAIL: 5 flows missing (FL-02, MOD-02, SH-82, CLN-151, MOD-04); I didn't touch these. load FAIL: `clinic:eye` (see below).
- Sandbox `s07b-laptop` (7 flows at 1366×768) and `s07b-phone` (pharmacy@L3, waiting@L3 at 844×390): every flow reaches its end, 0 page errors, contract and check PASSED.
- Belt preview, every item ×2 (scratchpad `pv/after2`): one camera angle, bases on the surface, nothing clipped.

## Left open
| What | Why |
|---|---|
| `clinic:eye` loadcheck | eye now gets further in its 1.8 s window. It then loads ginger, icon-veg-12 and icon-veg-13, which `heal/eye.json` never declared. Fix: add those 3 paths to its `assets` (not my file). |
| Plaster on the belt | B1 is top-down only, so the plaster keeps its tilted sprite (CLN-97 stays). |
| Uncle, auntie, the woman with the baby, the child beside a grown-up | still rough (time box). The dad-with-baby picture would need the "baby sits with a woman" rule changed (`pipeline.js:234`), so that is a mechanic change. |
| Colour tint | still covers the hands too (as on the girl). Two old women share one picture. |
| Check with Zafar | cup shown as a glass tumbler, bottle as a hot-water bottle (as the plan says). Old woman's skin flag ΔE 26 compares her to the girl's render. |

## Rows (suggestions)
To judge: CLN-23, CLN-97, CLN-19, CLN-01, CLN-11, CLN-12, CLN-90. ART-20: belt done except the plaster.

Log: `16 Oct · s07-clinic-b · belt items from B2–B10 at one angle, comb out; boy/old man/old woman on the bench; eye.json manifest gap`
