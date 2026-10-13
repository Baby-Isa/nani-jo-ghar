// The evidence loop's named drivers (build/sandbox/data/evidence.json `_drivers`, decision 82): which kinds of flow each one
// plays on (flows/index.mjs flowKind adds them as paths) and the moments it records (lib/moments.mjs adds them to what that
// path can reach). Pure data: no browser, no imports, so the moment catalogue and the flow index can both read it.
//
// A driver plays the game through its own test hooks only (Cook's __cook.expectation(), the clinic's __clinic.expect() and the
// heal games' debug.next()/slip(), the shared Lifecycle and RequestPopup, njgTest): never a game file changed. Moments a driver
// records are either a player state (rec:<name>, a screenshot and lint like every state) or a bare evidence moment
// (drv:<name>, drivers/index.mjs mark(): nothing recorded, only probes that ask for it capture).
//
// kinds: flowKind's kinds (cook = a Cook station, recipe or part on cook.html; cook-other = a story day; lab-cook = Cook on the
// game host; heal, clinic-stage, patient, morning = the clinic; first; mode).
export const DRIVERS = {
  "wrong-extra-person": { kinds: ["cook"], moments: ["rec:wrong-extra-person", "rec:wrong-redo"] },
  "wrong-count": { kinds: ["cook"], moments: ["rec:wrong-count"] },
  "serve-combined": { kinds: ["cook-other"], moments: ["rec:served-combined"] },
  "tap-during-speech": { kinds: ["cook", "heal"], moments: ["rec:tap-during-speech", "rec:tap-taken-while-speaking", "rec:tap-held-till-quiet"] },
  "tap-during-pause": { kinds: ["cook"], moments: ["rec:tap-during-pause", "rec:pause-skipped", "rec:pause-kept"] },
  "mute-across-modes": { kinds: ["lab-cook"], moments: ["rec:muted-in-cook", "rec:after-mute", "rec:after-mute-cook"] },
  "start-over": { kinds: ["cook"], moments: ["rec:started-over", "rec:after-start-over"] },
  "tap-through-popup": { kinds: ["cook", "heal", "clinic-stage"], moments: ["rec:tapped-through", "drv:tapped-through"] },
  // the mistake player, then the end card's tick badge tapped to open the steps list (SH-44, D14)
  "open-steps": { kinds: ["cook"], moments: ["rec:steps-open", "rec:steps-none", "rec:wrong-choice", "rec:wrong-tap", "rec:wrong-extra", "rec:wrong-slice", "rec:wrong-stir"] },
  // the send-off's E4 (the child asks first, 1 in 4 at L3 by draw): the clinic page with &variant=E4 (CLN-117)
  "variant-e4": { kinds: ["clinic-stage"], moments: [] },
  "tap-quick": { kinds: ["cook"], moments: ["drv:count-word"] },
  "tawa-empty-then-off": { kinds: ["cook"], moments: ["rec:tawa-empty", "rec:knob-off", "drv:knob-off", "drv:tawa-empty"] },
  "idle-twice": { kinds: ["cook", "heal"], moments: ["rec:idle-hint", "rec:idle-again"] },
  "force-passme": { kinds: ["cook-other"], moments: ["rec:passme-forced"] },
  "wrong-spice-thrice": { kinds: ["cook"], moments: ["rec:wrong-1", "rec:wrong-2", "rec:wrong-3", "rec:shown-right"] },
  "turn-early-late": { kinds: ["cook"], moments: ["rec:wrong-early", "rec:wrong-late", "rec:turned-early", "rec:turned-late"] },
  "wrong-thrice": { kinds: ["cook", "heal"], moments: ["rec:wrong-1", "rec:wrong-2", "rec:wrong-3", "rec:shown-right"] },
  "lab-log-on": { kinds: ["clinic-stage"], moments: ["rec:lab-log-on"] },
  "heal-fast": { kinds: ["morning"], moments: ["drv:heal-fast-done"] },
  "find-scene": { kinds: ["mode"], moments: ["rec:scene-*", "rec:scene-*-*"] },
  // not in _drivers (a path the spec already used): the clinic's take-back, like Cook's #takeback (CLN-112, CK-TB-01)
  takeback: { kinds: ["heal", "clinic-stage"], moments: ["rec:before-takeback", "rec:after-takeback"] },
  // the clinic at its real pace (no &fast=1): the zooms take their 1.5 s (CLN-87, CLN-43, CLN-77); a stage's pop-up and read-along their
  // real time (SH-17, CLN-04: in fast mode the pop-up folds within a second)
  "real-pace": { kinds: ["heal", "clinic-stage"], moments: [] },
  // the mistake player on more kinds of flow (CK-07, ART-08 on the game host; CK-26 in a story day)
  mistake: { kinds: ["lab-cook", "cook-other"], moments: ["rec:wrong-choice", "rec:wrong-tap", "rec:wrong-extra", "rec:wrong-slice", "rec:wrong-stir"] },
};
// the paths a kind of flow has beyond its own (fair, mistake, hint, ...): every driver that names the kind
export const driverPaths = (kind) => Object.keys(DRIVERS).filter((d) => DRIVERS[d].kinds.includes(kind));
// moments every flow of a kind reaches on its fair path too (bare evidence moments, drivers/index.mjs mark())
export const FAIR_MOMENTS = {
  cook: ["drv:your-turn-*", "drv:daar-in", "drv:retry"],
  "lab-cook": ["drv:your-turn-*", "drv:retry"],
  "cook-other": ["drv:your-turn-*", "drv:retry", "drv:daar-in"],
  heal: ["rec:taught-*", "drv:your-turn-*"],
  "clinic-stage": ["drv:your-turn-*"],
  patient: ["drv:your-turn-*", "rec:taught-*"],
  morning: ["drv:your-turn-*", "rec:taught-*"],
  house: ["drv:labs"],
  first: ["drv:tap-no", "drv:your-turn-*"],
  mode: [],
  "rotate-card": ["rec:index-upright", "rec:first-upright", "rec:cook-upright", "rec:clinic-upright", "rec:tidy-upright", "rec:who-upright", "rec:dress-upright", "rec:monsoon-upright", "rec:snap-upright", "rec:find-upright"], // flows/extra.mjs: one state per page
};
