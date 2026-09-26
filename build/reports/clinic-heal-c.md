# Clinic heal agent C: report (26 Sept 2026)

**Built** (all on the contract, `docs/clinic-heal-api.md`; levels 1–3 as data in `data/clinic/heal/<id>.json`):
- `eye` (H12): drops on the named side and count, the pirate patch on *the other* eye (L3), the picture chart of Cook's fruit and veg nouns, *wadho/nindho* and *nar* (L3). Tap only.
- `foot` (H13): hot or cold paani (a tap pours), *ba chamcha loon*, feet in; *wadho/nindho* toe × the patient's own side (L3); pluck the thorn (drag), plaster.
- Maybe-later extras: `tummy` (H10), `hic` (H15) and `hair` (H16), all using Kutchi numbers plus *paani, dudh, chai, adh, pela, ne poi*.

**The host.** I merged `claude/clinic-core` and rewired both games onto it: the host's tray, Done button and card, `ctx.after`/`ctx.on`, and the patient's own colours from `Clinic.Figure.KINDS`. I also merged `claude/clinic-rough-art`; its sprites (drops, pointer, pirate patch, jug, salt pot, tweezers, thorn, plaster, sore swirl) are used, with greybox fallbacks. No core file was edited.

**Blind leak bot** (`node build/leak_clinic_heal_c.mjs`, 2000 rounds). Level 1, the best blind strategy's win rate (a fair player wins 100%): eye 0.85%, foot 6.9%, tummy 8.8%, hic 8.0%, hair 4.2%. Foot's toe calls were made independent: they had always alternated big/little, which a pattern-guesser could exploit.

**Browser test** (`COOK_TEST_PORT=8823 python3 build/test_clinic_heal_c.py`): real mouse events at phone (915×412), iPad, iPad portrait and laptop. Fair plays score every row; a one-slip play loses exactly one row; the laptop level-1 run plays through the onboarding. Screenshots are in `build/screenshots/clinic-heal-c/`.

**Decisions taken.** The close-up art replaces the figure during these games. The patch and loon dishes ride the tray at every level (ungraded fun where there is no row). Hic's "Boo!" is an ungraded ending. Hair adds `shampoo`/`bug-jar` to `Kit.ITEMS` at runtime; the core should add `shampoo` to `data/clinic.json`.

**Dev page:** `lab/clinic-heal-c.html`.
