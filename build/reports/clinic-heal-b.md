# Clinic heal B: taste, fever, boing (26 Sept 2026)

**Built** (own files only, on the merged core and art): `js/clinic/heal/games/{taste,fever,boing}.js`, `data/clinic/heal/*.json` (words through Cook's ids), `lab/clinic-heal-b.html`, `build/leak_clinic_heal_b.mjs`, `build/test_clinic_heal_b.py`, screenshots in `build/screenshots/clinic-heal-b/`.

- **taste (H5):** its own rack of 4 look-alike droppers and 3 cups (*limu, khun, loon, marcha; paani, dudh, chai*) in the called order; drop counts at level 3.
- **fever (H6):** the reading, then the patient's answers, decide every step and when to stop. The face never shows hot or cold. Counts at level 2; *jaldi/aastethi* judged by the rhythm of the fan taps at level 3.
- **boing (H9):** a wipe count, then a spoken count-down through `Say.moment` (pills as the fallback). The doctor's striped syringe goes BOING and the hair stands on end. Then the plaster and the lollipop in the called order.

**Leak bot (blind, level 1):** taste 8.0–8.8% (1/12), fever ≤5.0%, boing ≤0.9%. Fair play wins 100% at every level; levels 2–3 are ≤0.8%.

**Browser:** 27/27 fair rounds pass (3 games × 3 levels × phone, iPad and laptop). The `--mistakes` run counts each deliberate mistake in the review.

**Decisions:**
- taste hides the sidebar tray, because the pharmacy's order would give the order row away.
- A throbbed dish counts as a hint.
- fever's level 1 has 3–4 exchanges, not one (one exchange is 50% blind).
- boing draws its own syringe, because the rough sprite shows a needle.

**Still English:** hot, cold, just right, plaster, lollipop, the arms, the colours. Every fever row at level 1 is English.

**For the core:**
- `Kit.sprite` ignores the rough-art aliases, so my games swap the dish pictures themselves.
- The sidebar dish pictures overflow their slots at 915×375.
- The lab's log covers the say panel.
- The host page doesn't load `say.js`.
