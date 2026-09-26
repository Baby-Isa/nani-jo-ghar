# Clinic healing games: the plug-in contract (26 Sept 2026)

The clinic is being built by several agents at once. The **core agent** owns the pipeline (waiting room → diagnosis → pharmacy → heal → send-off) and everything in `js/clinic/` except `js/clinic/heal/games/`. The **healing-game agents** each own a few games and write only their own files. Everyone codes against this contract. The core may **add** to `ctx`, but never renames or removes what's here. Design source: `docs/modes/clinic-design.md`, the "Mini-game quality pass" (Q1–Q7) on top of the "Pipeline design" (P1–P13).

## Files
| Who | Files |
|---|---|
| Core | `js/clinic/heal/registry.js` (the `Clinic.Heal` API below), `js/clinic/heal/host.js` (builds `ctx`), everything else in `js/clinic/`, `clinic.html`, `data/clinic.json`, `css/clinic.css` |
| Each healing game `<id>` | `js/clinic/heal/games/<id>.js`, `data/clinic/heal/<id>.json`, optional `css/clinic-heal-<id>.css`; its dev page `lab/clinic-heal-<agent>.html`; its tests `build/test_clinic_heal_<agent>.py` and bot `build/leak_clinic_heal_<agent>.mjs` |

Game ids (from the quality pass): `knee` (H1 kicking knee + cast), `cut` (H2/H8 wash, stitch, plaster), `ear` (H3), `tooth` (H4), `taste` (H5), `fever` (H6), `boing` (H9), `eye` (H12), `foot` (H13).

## Registering a game
```js
Clinic.Heal.register({
  id: "ear",
  part: "ear",                 // body.js part id the ailment is on (sides via ctx.side)
  ailments: ["seed-in-ear"],   // ids in data/clinic/heal/<id>.json
  items: ["tweezers", "cotton-bud", "drops-blue"],  // what the pharmacy tray must carry in (ids)
  gestures: ["tap", "drag"],   // UX §12: one shared tap + at most one working gesture, fixed at every level
  levels: [1, 2, 3],
  mount(stage, ctx) { /* build the game into `stage` (a DOM element filling the play area); return a controller */
    return { start() {}, destroy() {} };
  },
  bot(level, rng) { /* pure, for Node: returns {rows, solve(strategy)} so the leak bot can play it blind */ }
});
```
Load order: `registry.js` first, then each game's script. A game file must run in Node too (`module.exports` guard) for its bot.

## The context a game receives (`ctx`)
- `ctx.level` (1–3), `ctx.side` ("left" / "right" / null, always the patient's own side), `ctx.rng()` (seeded).
- `ctx.patient`: `{ kind, el, hotspot(partId, side) → {x, y, r}, react(mood) }`, where mood is one of `"ouch"`, `"giggle"`, `"relief"`, `"happy"`, and `pose(name)`. It's built on `js/clinic/body.js` / `patient.js`. Until the core lands, use them read-only in your dev page.
- `ctx.tray`: the items the child brought from the pharmacy, in order: `[{id, colour?, count?}]`. The game uses them. A wrong item stays in the tray, is simply unusable, and shows in the review.
- `ctx.card`: the instruction card, which is the master (UX §13).
  - `setRows([{id, kutchi, english, audio?, count?}])` sets the rows.
  - `tick(rowId)` auto-ticks when a step **closes** (UX §11). Never tick on a count reached mid-step.
  - `pulse(rowId)` is a throbbing hint.
- `ctx.say(lineId)` plays a recorded line (Nani, the doctor or the patient). `ctx.interject("shabash" | "arre")`.
- `ctx.tally(itemId, n)` updates the picture tally, showing what you've done, never the target.
- `ctx.log({type: "right" | "wrong" | "extra" | "hint", rowId, detail})` records mistakes silently: no mid-round negative feedback (UX §11). They surface in the end review.
- `ctx.hint()` is the light bulb (the core handles its cost).
- `ctx.onboard(script)` runs the shared onboarding kit (`js/shared/onboard.js`) the first time only.
- `ctx.done({right, total, hints, words: [{kutchi, english, audio?}]})` ends the game. The core adds time and shows the shared end-of-round screen at the end of the patient.

## Rules every game follows
- The Kutchi decides: every row carries a word or number that changes what's right. Each game ships a blind bot, and level 1 must stay under 10% for a non-speaker (see the design's Sceptic rule).
- Gestures come from `gestures` and never change between levels. A tap pours.
- Comic, never gory. Stitches go on cartoon skin, and the doctor holds the injection.
- Words: English placeholders marked `placeholder: true`, except the family's confirmed or drafted words in `docs/kutchi-grammar-notes.md` and `data/cook.json` (reuse Cook's ids).
- Art: use the rough placeholder sprites in `assets/clinic/rough/` through `data/clinic/rough-art.json` if present, and fall back to greybox shapes. Never block on art.
