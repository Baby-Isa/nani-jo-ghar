# s07 fix: the standing girl's foot never takes the tap

**Cause.** This bug was already there before the sprint. The sprint's new seeded draws only exposed it. Nothing covers her feet: `elementFromPoint` at the ring is her own svg, and the tap is judged. The fault is in `js/clinic/figure.js:254` `partAt`. When tap areas overlap, the smallest one wins, and `prefer` (the asked-for part) only breaks exact ties. In the standing `taps` (`data/clinic/heal-art.json`), `toe.*` (r 0.02) covers the middle of `foot.*` (r 0.04), where the ring is drawn. So from level 3 (where the toe is a part) a foot tap read as "toe", wrong every time.

**Fix.** In `partAt`, a tap inside the asked-for part's own area is that part. Otherwise the old rule still applies. The art, data, mechanics and words are unchanged.

**Proof.** Red: the repro timed out at the foot. A probe of every standing part (L1-L4; 800x360, 844x390, 1366x768; 213 taps) found 12 bad before, all foot-as-toe at L3/L4, and 0 after. Green: `clinic:morning@L3` completes. `clinic:diagnosis,clinic:morning` at 800x360 and 1366x768 complete with 0 findings. Unit, static and leak checks pass.
