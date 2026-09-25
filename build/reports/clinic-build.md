# The clinic: build report (phases 0–1)

Branch `claude/build-clinic`. Details and numbers: `docs/clinic-build-log.md`.

**Built.** `data/clinic.json` (every word an English placeholder; only Cook's number words are Kutchi), a grey silhouette patient (`data/patients/grey-adult.json`, `mirror: true`), `data/scenes/clinic.json`. The pure visit engine `js/clinic/visit.js` (check-up, mystery, named ailment, you're the patient, bring someone in as a lab stub, the treatment round, `days.mix`) and `js/clinic/body.js` both run in Node. One file per mechanic in `js/clinic/mechanics/`: check (the kit from level 2), where (with S2), care, stick, wrap (turns, colour, figure-of-eight), lift, tuck, drops, handover, ask, tell, you (S1 "It's my knee"). `tell` calls `js/shared/speech.js` through a stub, with the pills and a grown-up toggle as fallbacks. The dispensary loads Cook's fetch, count, stir and pass me unchanged and ends in `handover`. Also a hotspot editor.

**Open it.** Serve the repo and open `clinic.html` (the lab: level 1–3, the "say" dropdown, grown-up toggle, hotspot overlay).

**Leak bot** (`node build/leak_clinic.mjs`, 500 visits per strategy per type per level, 13 tap and 5 speaking strategies): fair bot 100%, and every strategy stays under 10%. Level 1 worst cases: check-up 0.4%, mystery 1.2%, named ailment 6.6% (repeat), treatment round 3.2%, V0 voice 3.8% (mumble). Every row is a placeholder, so this is not yet a Kutchi test. `check_hotspots.py` passes: level-1 parts are 2.1–3.3 cm on the iPad, and the phone opens zoomed ×1.36. `test_clinic.py` (port 8806) passes every lab entry at levels 1–3, and the six sizes with deliberate mistakes.

**Stubs to swap.** `js/clinic/stubs/speech.js` → call `Speech.listen` directly. `stubs/which.js` → the shared which-one module. `stubs/overlay.js` → overlay-at-anchor sprites. The star sets and ear/voice rules are still held in `data/clinic.json`. `tell.js` is offered as `js/shared/mechanics/tell.js`.

**Decisions I took.** The "?" rung's rows don't count toward `minTested`; otherwise echo and second-option beat 10%. The voice star needs two speaking rows, so from level 2 the hand-over asks "What's this?" (S4). V4 has no ear slot, because he examines what you said and its star is the voice. Side misses count only after the recast is ignored (R3.2). Level-2 tools are drawn tool-first. Duration is heard, not measured (Weber 0.12). Nothing is saved yet.

**Next (phase 2).** `call` and the queue, `warm` (Just right), word stages and the intro card, stars and receipt, Relaxed/Busy, drops' sides at level 3 in a morning, bigger trolley targets on the phone, the tooth in the close-up.
