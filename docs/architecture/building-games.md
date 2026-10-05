# Building games and arcs from existing parts

Step 3, R3b, 1 Oct 2026; updated 6 Oct 2026 (Cook and the clinic are now real plug-ins). How to add a mini-game, a mode, an arc and a map place by plugging existing parts together, so that new games and arcs are built from the mechanics and modes we already have (decisions 22 to 24). The worked example throughout is the **demo mode** (`js/demo/`), which runs one of Cook's stations and one of the clinic's healing games through the one game host without changing a line of either.

The shapes are written once, in code comments at the top of `js/shared/host.js` (the mini-game and its `ctx`), `js/shared/mode.js` (the mode, the entry, the shell loop), `js/shared/input.js` (gestures) and `build/host/check_arcs.mjs` (the arc file). This guide says how to use them; the rules themselves live in `docs/process/rules.md` and are linked by ID, not repeated. Where this guide and the rulebook disagree, the rulebook wins.

## The parts, in one picture

| Layer | What it is | Where |
|---|---|---|
| Mini-game (stage) | one thing to do: the pantry, the scrape, the pharmacy belt | a `games` entry of a mode |
| Mode | a plan of stages, its labs, its free play | `js/<mode>/main.js` |
| Game host | runs a plan: mounts each stage with a `ctx`, checks it cleaned up, then scores the round and shows the end screen | `js/shared/host.js` |
| Shell | turns "play this" (story, free play, lab) into a plan, records story progress, follows the end screen's buttons | `js/shared/mode.js`, `lab.html` |
| Arc | chapters of errands, beats and Conversation slots; what each chapter opens | `data/arcs/<arc>.json` |
| Map place | where free play starts; locked until a story opens it | `data/map.json`, `data/unlocks.json` |
| Core | badges, pocket money, word progress, the story log, unlocks, the save | `js/core/` (R2) |

The arrows point one way (target-model § 1): a mini-game calls only its `ctx`; a mode never draws its own end screen, badges, bulb or buttons, never touches the save and never opens another mode (target-model § 6.3).

## Add a mini-game

A mini-game is an object with an `id`, the `gestures` it uses, the `levels` it has and a `mount(el, ctx)` that returns a controller:

```js
export default {
  id: "pantry",                 // kebab-case; "<mode>/<id>" is its onboarding id, best-time key and lab address
  gestures: ["tap"],            // declared once, the same at every level (E13); ctx.input refuses others
  levels: [1, 2, 3, 4],         // level 1 the smallest round, each level adds one thing (E6)
  onboard: [{ spotlight: "#shelf", ghost: { gesture: "tap" } }],   // first-time help: shows, never tells (E1, E2, E9)
  mount(el, ctx) {
    // draw into el (the play area); take input from ctx.input; mark rows as they close
    return { start() {}, destroy() {}, expect() {} };   // destroy clears your UI and stops your effects (E17)
  },
  bot(level, rng) {},           // the blind bot for the leak test (C10)
};
```

What the game does with its `ctx` (the full list is in `js/shared/host.js`):

- **Input** through `ctx.input` (`tap`, `drag`, `swipe`, `circle`): one feel everywhere, live while speech plays (E5), and every target answers in a 48 px box even when it's drawn smaller (F2, E23).
- **Rows** with `ctx.mark(row, ok, {word})` when each step closes (E11). Only the first mark of a row counts (E14). For put-it-there games, `ctx.place(slot, item, ok)` and `ctx.takeBack(slot)` give take-back until Done with the first placement scored (E14, E15).
- **Help** with `ctx.hint()` (the bulb, E25) and `ctx.onboard(id, steps)` (the shared kit, once per child).
- **Words** only through `ctx.lang` and `ctx.voice` (G9 to G13); never a Kutchi string in code.
- **Time** through `ctx.wait`, `ctx.after` and `ctx.every`: the host clears them when the stage ends or the child leaves.
- **Pauses**: `ctx.pause("after-serve")` marks a natural pause; the shell decides whether a Conversation goes there (H44).
- **Done**: `ctx.done()`. The host then calls `destroy()` and checks that nothing of yours is left in the play area or the page and that no voice line is still playing; anything left is a finding and is cleared (E17).
- **Tests**: `ctx.test.expect({...})` says what the game wants next and `ctx.test.state(name)` names the state, for `window.njgTest` (target-model § 8.1).

Then:

1. Put it in its mode's `games` and its `lab()` list.
2. Test it with a fake root, as `build/host/host.test.mjs` does (`fakeGame` in `build/host/helpers.mjs` is the smallest working game).
3. Run `node build/check_onboard.mjs --mode <mode>`: every gesture you declare must be shown by a ghost finger, with no words.
4. Give it a leak bot (C10) and play it in `lab.html?mode=<mode>&game=<id>&level=1`.

## Add a mode

A mode is one folder, `js/<mode>/`, whose `main.js` default-exports:

```js
export default {
  id: "demo",
  data: [],                                   // data files loaded first (mode.loaded[path])
  games: { pantry, scrape },                  // its mini-games, keyed by their ids
  plan(entry) {                               // entry: {play: "story" | "free" | "lab", arc, chapter, errand, level, game, params}
    if (entry.game) return [{ game: entry.game, level: entry.level }];   // a lab: one stage alone
    return { game: "helper", stages: [{ game: "pantry" }, { pause: "kitchen-to-clinic" }, { game: "scrape" }] };
  },
  lab: () => [{ game: "pantry", label: "Pantry" }, { game: "scrape", label: "Scrape" }, { game: null, label: "The whole round" }],
  free: { endless: true },                    // free play: rounds keep coming until the child stops (H50)
  actions: ["again", "next", "list", "home"], // the end screen's buttons, in the one order (H34)
};
```

- A plan is a pipeline of stages (H1), with `{pause: name}` steps where a Conversation may go. Consecutive errands never repeat the same main action (H9); within a plan, keep one job at a time (E7).
- The host turns the whole plan into **one round**: `Score.finish` gives the three badges, the personal best, pocket money and the word evidence (H5, decisions 1 to 3, 10), then the shared end screen. A lab offers Again and the list; story mode Again, Next and Home; free play adds Next only when `free.endless`.
- Every mode gets `lab.html?mode=<id>` for free, and `labs.html` lists it after `node build/gen_labs.mjs` (never hand-edit `labs.html`; `--check` fails when it's stale).
- `dev: true` marks a test-site mode that never goes on the child's map (the demo).

### Real plug-ins to copy

Cook (`js/cook/main.js`) and the clinic (`js/clinic/main.js`) are the two real examples. The clinic draws into the play area the host gives it; Cook has its own sidebar and play area, so its stages say `screen: "own"` and mount Cook directly in the element the host provides (`js/cook/mount.js`; `needs` lists the scripts and styles Cook wants on the host's page; the host scores the whole plan once and Cook scores nothing itself when mounted with `hosted: true`). Both take their words from the language engine through a small glue file (`js/cook/words.js`, `js/clinic/lang.js`) and hold no word text in code (G26, the word lint).

### Wrapping code that isn't a plug-in yet: adapters

A thin layer that makes old code look like the new interface. Cook and the clinic no longer need one; the parked modes will move onto the host properly when their turn comes (decision 38). The demo keeps one of each as the worked example (C4 note: the demo's Cook adapter still frames `cook.html` and waits for a `#panel h1` that no longer exists, so treat it as a pattern to rebuild on `js/cook/mount.js`, not a working path) (`js/demo/`, not Cook's or the clinic's own code):

- `cookLab(key)` (`js/demo/cook-adapter.js`) runs a Cook Station-lab key ("fetch", "chai-tray", "recipe:chai") in `cook.html` inside a frame, through Cook's test hook, and catches Cook's end-of-round pop-up so the host shows the one end screen for the whole plan.
- `healGame(id)` (`js/demo/heal-adapter.js`) mounts any registered healing game ("cut", "knee", "ear") on the clinic's own screen through the clinic's heal host, after the host has loaded the clinic's scripts and stylesheet (`needs`).

Both say `screen: "own"` and carry `adapter: {of}`, so `check_onboard` checks them with Cook's and the clinic's own onboarding checks. An adapter's game scores itself, so it ends with `ctx.done({right, total, hints, timeMs, words, evidence})` and the host turns that into marks and word progress. Use an adapter to try a new combination quickly; build a real mini-game when it earns its place.

## Add an arc

An arc is `data/arcs/<arc>.json`, listed in `data/arcs/index.json`. The Birthday (`data/arcs/birthday.json`) is the skeleton of rule H36, and the demo arc (`data/arcs/demo.json`) is the smallest playable one.

```json
{
  "version": 1,
  "id": "birthday",
  "open": { "after": { "arc": "first-launch" } },
  "chapters": [
    {
      "id": "guests-coming",
      "flow": [
        { "beat": "guests-coming-start", "status": "to-write" },
        { "errand": { "id": "cook-guests", "mode": "cook", "status": "waiting", "entry": {}, "settings": {} } },
        { "conversation": { "id": "after-cook-guests" } },
        { "errand": { "id": "set-table", "mode": "put-it-there", "status": "to-build", "entry": {}, "settings": {} } }
      ],
      "opens": []
    }
  ]
}
```

- **flow** is the order a chapter plays in: a **beat** (an id; its picture and lines are made elsewhere, carried by picture and sound, I13), an **errand** (a mode, its `entry` and its `settings`: `level`, `params`), or a **conversation** slot (H44).
- **status** of an errand: `playable` (its mode runs on the host: `js/<mode>/main.js` exists), `waiting` (the mode exists but hasn't moved onto the host yet: the parked modes), `to-build` (no mode yet). A beat is `to-write`, `written` or `recorded`.
- **open** is when the arc itself is available, in the unlock rules' grammar (`js/core/unlocks.js`). **opens** lists what finishing the chapter opens: map places or modes. The shell adds these to `data/unlocks.json`'s rules (`withArcRules`), so a locked place says which story opens it (H57, decision 22); where both say something, `data/unlocks.json` wins and the validator notes it.
- An arc holds **no words for the child**: no `kutchi`, `text`, `line` or `en` keys. Lines are meanings in the language engine's data (G13), and the child never reads English (E1). `note` fields are for grown-ups and sessions.
- Every story arc ends with the Story by the Fire (H40): its last errand's mode is `fire`. Test arcs (`"test": true`) are exempt and never reach the child's map or bookshelf.
- Story progress is in the save: each errand done, then the chapter when its last errand is done (which opens what it opens), then the arc. Chapters play in order.

Check it with `node build/host/check_arcs.mjs`.

## Add a map place

Free play starts from the map (decision 22). A place is an entry in `data/map.json`:

```json
{ "id": "beach", "unlock": "beach", "modes": [{ "mode": "beach-games", "page": "lab.html" }], "art": { "open": "map/beach", "locked": "map/beach-locked" } }
```

- **modes** are what can be played there; free play of a mode starts at the first place that lists it.
- **unlock** is the rule id: a rule in `data/unlocks.json`, or an arc chapter's `opens` (`{"after": {"arc": "beach", "chapter": 1}}`). With no rule at all the place stays locked and says so.
- **art** names the open and locked pictures; they are made in ChatGPT from one ready-to-paste block (D1).
- A mode on no place (the demo) is opened by the chapter that names it in `opens`.

## Worked example: the demo

1. **Two mini-games from existing parts**: `pantry = cookLab("fetch")` and `scrape = healGame("cut")`, in `js/demo/main.js`, through the two adapters above. Neither Cook's nor the clinic's files changed.
2. **One mode**: a plan of pantry, a pause slot, scrape; a lab for each and for the whole round; endless free play.
3. **One arc**: `data/arcs/demo.json`, one chapter whose one errand is the demo's whole plan, and `"opens": ["demo"]`.
4. **Play it**:
   - `lab.html?mode=demo&game=scrape&level=1`: the scrape alone, the end screen, back to the list;
   - `lab.html?mode=demo&play=free`: locked, "until the demo story";
   - `lab.html?mode=demo&play=story&arc=demo&chapter=1&errand=helper`: the pantry, then the scrape, then one end screen with the three badges and pocket money; the chapter and the arc are done;
   - `lab.html?mode=demo&play=free` again: open; each round pays, Next brings the next.
5. **Proof**: `build/host/mode.test.mjs` plays the same loop in Node with stand-in games; `build/host/demo-browser.mjs` plays the real adapters in Chromium, screenshots and lints each state.

## Before you call it done

- `node --test build/host/` (the host, the mode interface, input, arcs, labs, onboarding) and `node --test build/core/`.
- `node build/host/check_arcs.mjs`, `node build/check_onboard.mjs`, `node build/gen_labs.mjs --check`.
- The browser proof and the sandbox on the screens you touched (one browser at a time: `flock -w 1800 /tmp/njg-browser.lock timeout …`, your own `COOK_TEST_PORT`).
- Then the rest of the definition of done (C1 to C4): every state screenshotted and looked at by someone else, flaws first, and the regression rows for the screens you touched.
