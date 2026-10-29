// The evidence loop's named drivers (build/sandbox/data/evidence.json `_drivers`, decision 82): which kinds of flow each one
// plays on (flows/index.mjs flowKind adds them as paths) and the moments it records (lib/moments.mjs adds them to what that
// path can reach). Pure data: no browser, no imports, so the moment catalogue and the flow index can both read it.
//
// A driver plays the game through its own test hooks only (Cook's njgTest.cook.expectation(), the clinic's njgTest.clinic.expect() and the
// heal games' debug.next()/slip(), the shared Lifecycle and RequestPopup, njgTest): never a game file changed. Moments a driver
// records are either a player state (rec:<name>, a screenshot and lint like every state) or a bare evidence moment
// (drv:<name>, drivers/index.mjs mark(): nothing recorded, only probes that ask for it capture).
//
// kinds: flowKind's kinds (cook = a Cook station, recipe or part on cook.html; cook-other = a story day; lab-cook = Cook on the
// game host; heal, clinic-stage, patient, morning = the clinic; first; mode).
export const DRIVERS = {
  "wrong-extra-person": { kinds: ["cook"], moments: ["rec:wrong-extra-person", "rec:wrong-redo"] },
  "wrong-count": { kinds: ["cook"], moments: ["rec:wrong-count"] },
  // the first chop lets the vegetables fly by uncut for 3 s, so a count comes up short and the chop comes again with its
  // request pop-up (decision 51; DAAR-25: Nani's face on that pop-up and on her chop card)
  "miss-chop": { kinds: ["cook"], moments: ["rec:chop-missed"] },
  // a dish served wrong: the look-alike (chai's salt for the sugar) put in once and left in, then fair (CK-31, CK-32)
  "serve-wrong": { kinds: ["cook"], moments: ["rec:serve-wrong", "drv:review-face"] },
  // a closed card (level 3) peeked open before every tap, so each tap's moment shows the card's rows (SEK-13)
  "peek-every-tap": { kinds: ["cook"], moments: ["rec:peek-for-tap"] },
  "serve-combined": { kinds: ["cook-other"], moments: ["rec:served-combined"] },
  "tap-during-speech": { kinds: ["cook", "heal"], moments: ["rec:tap-during-speech", "rec:tap-taken-while-speaking", "rec:tap-held-till-quiet"] },
  // the first voiced question's reply pill tapped while the question is being said (CK-43, E5: contract-21 wants its act logged)
  "answer-while-asked": { kinds: ["cook-other"], moments: ["rec:answer-while-asked", "rec:answer-after-asked", "drv:answer-while-asked"] },
  "tap-during-pause": { kinds: ["cook"], moments: ["rec:tap-during-pause", "rec:pause-skipped", "rec:pause-kept"] },
  "mute-across-modes": { kinds: ["lab-cook"], moments: ["rec:muted-in-cook", "rec:after-mute", "rec:after-mute-cook"] },
  "start-over": { kinds: ["cook"], moments: ["rec:started-over", "rec:after-start-over"] },
  "tap-through-popup": { kinds: ["cook", "heal", "clinic-stage"], moments: ["rec:tapped-through", "drv:tapped-through"] },
  // SH-157 (s14-rules): while the order is given, a tap on the bubble, the side panel and the cog (each must not skip), then the play area (it skips)
  "tap-zones": { kinds: ["cook"], moments: ["rec:zone-bubble-kept", "rec:zone-bubble-skipped", "rec:zone-side-kept", "rec:zone-side-skipped", "rec:zone-cog-kept", "rec:zone-cog-skipped", "rec:zone-play"] },
  // CK-48's Check (S13-V): the request pop-up tapped through 1 s after it opens, at a child's pace (then the station must be
  // fully drawn within 1 s of the tap)
  "tap-card-1s": { kinds: ["cook", "heal", "clinic-stage"], moments: ["rec:tapped-through", "drv:tapped-through"] },
  // the mistake player, then the end card's tick badge tapped to open the steps list (SH-44, D14)
  "open-steps": { kinds: ["cook"], moments: ["rec:steps-open", "rec:steps-none", "rec:wrong-choice", "rec:wrong-tap", "rec:wrong-extra", "rec:wrong-slice", "rec:wrong-stir"] },
  // the send-off's E4 (the child asks first, 1 in 4 at L3 by draw): the clinic page with &variant=E4 (CLN-117)
  "variant-e4": { kinds: ["clinic-stage"], moments: [] },
  // the request pop-up is never tapped: the spoken order plays out to its end (SEK-11)
  "listen-through": { kinds: ["cook"], moments: [] },
  "tap-quick": { kinds: ["cook"], moments: ["drv:count-word"] },
  "tawa-empty-then-off": { kinds: ["cook"], moments: ["rec:tawa-empty", "rec:knob-off", "drv:knob-off", "drv:tawa-empty"] },
  "idle-twice": { kinds: ["cook", "heal"], moments: ["rec:idle-hint", "rec:idle-again"] },
  // the stuck player (S13-T, generalising idle-twice): at the first move it waits, taps nothing, through every help rung, then
  // plays fair. rec:stuck-start as it stops, then rec:stuck-5s, rec:stuck-12s, rec:stuck-18s at that much idle time (the kit's
  // rungs at 0, 5 and 15 s, Nani's line at 7-15 s by level, the bulbs' pulse at 17 s: js/shared/onboard.js RUNGS, guide.js PAUSE);
  // each rung the kit logs is life:rung, each help Nani gives life:help. drivers/index.mjs stuckWait plays it on every kind below
  stuck: { kinds: ["cook", "heal", "clinic-stage", "day-door"], moments: ["rec:stuck-start", "rec:stuck-5s", "rec:stuck-12s", "rec:stuck-18s", "drv:stuck", "life:rung", "life:help"] },
  "force-passme": { kinds: ["cook-other"], moments: ["rec:passme-forced"] },
  "wrong-spice-thrice": { kinds: ["cook"], moments: ["rec:wrong-1", "rec:wrong-2", "rec:wrong-3", "rec:shown-right"] },
  "turn-early-late": { kinds: ["cook"], moments: ["rec:wrong-early", "rec:wrong-late", "rec:turned-early", "rec:turned-late"] },
  "wrong-thrice": { kinds: ["cook", "heal"], moments: ["rec:wrong-1", "rec:wrong-2", "rec:wrong-3", "rec:shown-right"] },
  "lab-log-on": { kinds: ["clinic-stage"], moments: ["rec:lab-log-on"] },
  "heal-fast": { kinds: ["morning"], moments: ["drv:heal-fast-done"] },
  "find-scene": { kinds: ["mode"], moments: ["rec:scene-*", "rec:scene-*-*"] },
  // not in _drivers (a path the spec already used): the clinic's take-back, like Cook's #takeback (CLN-112, CK-TB-01)
  takeback: { kinds: ["heal", "clinic-stage"], moments: ["rec:before-takeback", "rec:after-takeback"] },
  // the clinic's replay (SH-102's clinic half, SH-114): once a step is ticked and others are left, the side card's face is tapped (flows/clinic.mjs
  // replayTap); contract-31 judges that it counts no hint and says only the steps left
  "replay-tap": { kinds: ["heal", "clinic-stage"], moments: ["rec:replay-tap", "rec:after-replay-tap"] },
  // the ear's first wax drag held part-way (flows/clinic.mjs healAct), so a zoom crop shows the tweezers closed on the blob (CLN-173)
  "grab-hold": { kinds: ["heal"], moments: ["drv:grab-held"] },
  // the clinic at its real pace (no &fast=1): the zooms take their 1.5 s (CLN-87, CLN-43, CLN-77); a stage's pop-up and read-along their
  // real time (SH-17, CLN-04: in fast mode the pop-up folds within a second)
  "real-pace": { kinds: ["heal", "clinic-stage"], moments: [] },
  // (s08 w6L, CLN-107 at L3, CLN-194) the heal game's mistake player at that real pace: a wrong answer's red, shake and flash last their real
  // 360-600 ms (in fast mode 40-120 ms, between two frames of a filmstrip, and at the eye's L3 the red is gone in the same tick)
  "mistake-real": { kinds: ["heal"], moments: [] },
  // the mistake player on more kinds of flow (CK-07, ART-08 on the game host; CK-26 in a story day)
  mistake: { kinds: ["lab-cook", "cook-other"], moments: ["rec:wrong-choice", "rec:wrong-tap", "rec:wrong-extra", "rec:wrong-slice", "rec:wrong-stir"] },
};
// the paths a kind of flow has beyond its own (fair, mistake, hint, ...): every driver that names the kind
export const driverPaths = (kind) => Object.keys(DRIVERS).filter((d) => DRIVERS[d].kinds.includes(kind));
// moments every flow of a kind reaches on its fair path too (bare evidence moments, drivers/index.mjs mark())
export const FAIR_MOMENTS = {
  cook: ["drv:your-turn-*", "drv:daar-in", "drv:retry", "drv:dish-served", "drv:counter-*"],
  "lab-cook": ["drv:your-turn-*", "drv:retry"],
  "cook-other": ["drv:your-turn-*", "drv:retry", "drv:daar-in", "drv:dish-served", "drv:counter-*"],
  heal: ["rec:taught-*", "drv:your-turn-*"],
  "clinic-stage": ["drv:your-turn-*"],
  patient: ["drv:your-turn-*", "rec:taught-*"],
  morning: ["drv:your-turn-*", "rec:taught-*"],
  house: ["drv:labs"],
  first: ["drv:tap-no", "drv:your-turn-*"],
  mode: [],
  "day-window": ["life:ride-call", "life:ride-pass", "life:ride-found", "life:ride-end", "life:ride-speed"],
  "rotate-card": ["rec:index-upright", "rec:first-upright", "rec:cook-upright", "rec:clinic-upright", "rec:tidy-upright", "rec:who-upright", "rec:dress-upright", "rec:monsoon-upright", "rec:snap-upright", "rec:find-upright"], // flows/extra.mjs: one state per page
};
