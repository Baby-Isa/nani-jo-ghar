// js/shared/mode.js: the mode interface, entries (story / free / lab) resolved through Unlocks, arcs feeding the
// unlock rules, and the shell loop end to end on the real core: a demo-shaped mode (two stages and a pause, as
// js/demo/main.js) played as a story errand, which opens its free play, which then pays round after round.
// Run: node --test build/host/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as M from "../../js/shared/mode.js";
import { createHost } from "../../js/shared/host.js";
import { createUnlocks } from "../../js/core/unlocks.js";
import demo from "../../js/demo/main.js";
import { makeCore, fakeGame } from "./helpers.mjs";
import { FakeEl, fakeDoc } from "./fake-dom.mjs";

const json = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), "utf8"));
const map = json("data/map.json");
const baseRules = json("data/unlocks.json");
const arcs = { birthday: json("data/arcs/birthday.json"), demo: json("data/arcs/demo.json") };

// the demo's shape with stand-in games (its adapters need a browser: build/host/demo-browser.mjs plays the real ones)
const demoLike = () => Object.assign({}, demo, { games: { pantry: fakeGame("pantry", { rows: ["chai", "dudh", "khun"] }), scrape: fakeGame("scrape", { rows: ["wash", "dab"], wrong: ["dab"] }) } });

test("the demo mode passes the mode interface; a broken one says what's wrong", () => {
  assert.deepEqual(M.validateMode(demo), []);
  assert.equal(demo.games.pantry.screen, "own");
  assert.deepEqual(demo.games.scrape.needs.styles, ["css/clinic.css"]);
  const bad = M.validateMode({ id: "X", games: { a: { id: "b", mount() {}, gestures: ["tap"], levels: [1] } }, actions: ["dance"] });
  assert.ok(bad.some((p) => /^id/.test(p)));
  assert.ok(bad.some((p) => /key and the id must match/.test(p)));
  assert.ok(bad.some((p) => /plan/.test(p)));
  assert.ok(bad.some((p) => /lab\(\)/.test(p)));
  assert.ok(bad.some((p) => /actions/.test(p)));
  assert.throws(() => M.defineMode({ id: "x" }));
});

test("entries: from and to a query; a lab is the default when a game is named", () => {
  const e = M.entryFromQuery("?mode=demo&play=story&arc=demo&chapter=1&errand=helper&level=2&seed=7");
  assert.deepEqual([e.play, e.arc, e.chapter, e.errand, e.level, e.seed, e.mode], ["story", "demo", 1, "helper", 2, 7, "demo"]);
  assert.equal(M.entryToQuery(e), "mode=demo&play=story&arc=demo&chapter=1&errand=helper&level=2&seed=7");
  assert.equal(M.makeEntry({ game: "pantry" }).play, "lab");
  assert.equal(M.makeEntry({}).play, "free");
  assert.equal(M.makeEntry({ play: "lab", arc: "x" }).arc, null);
  assert.equal(M.makeEntry({ level: "12" }).level, null);
});

test("arcs feed unlocks: a chapter's opens become rules; data/unlocks.json wins where both speak", () => {
  const { rules, notes } = M.arcRules(arcs);
  assert.deepEqual(rules.demo, { after: { arc: "demo", chapter: 1 } });
  assert.deepEqual(rules["arc:birthday"], { after: { arc: "first-launch" } });
  assert.deepEqual(rules["arc:demo"], { open: "always" });
  assert.deepEqual(notes, []);
  const merged = M.withArcRules({ rules: { demo: { open: "always" }, kitchen: { open: "always" } } }, arcs);
  assert.deepEqual(merged.rules.demo, { open: "always" });
  assert.ok(merged.rules.kitchen);
  assert.equal(M.errandsOf(arcs.birthday).length, 5);
  assert.equal(M.findErrand(arcs.birthday, "find-sweets").chapter, 2);
});

function world() {
  const core = makeCore();
  const unlocks = createUnlocks({ save: core.save, rules: M.withArcRules(baseRules, arcs) });
  return { core, unlocks };
}

test("resolveEntry: a lab is never locked; free play says which story opens it; story mode takes the errand's settings", () => {
  const { core, unlocks } = world();
  const mode = demoLike();
  const ctx = { mode, unlocks, arcs, map, save: core.save };
  assert.equal(M.resolveEntry({ play: "lab", game: "pantry" }, ctx).ok, true);
  assert.equal(M.resolveEntry({ play: "lab", game: "nope" }, ctx).why.kind, "no-game");
  const free = M.resolveEntry({ play: "free" }, ctx);
  assert.equal(free.ok, false);
  assert.deepEqual([free.why.kind, free.why.arc, free.why.chapter], ["locked", "demo", 1]);
  assert.equal(M.whyText(free.why), "Locked until the demo story (chapter 1).");
  const story = M.resolveEntry({ play: "story", arc: "demo" }, ctx); // no errand named: the next one
  assert.equal(story.ok, true);
  assert.deepEqual([story.entry.chapter, story.entry.errand, story.entry.level], [1, "helper", 1]);
  assert.equal(M.resolveEntry({ play: "story", arc: "birthday", errand: "cook-guests" }, ctx).why.kind, "locked"); // until first launch
  assert.equal(M.resolveEntry({ play: "story", arc: "nope" }, ctx).why.kind, "no-arc");
});

test("resolveEntry: the map's places (open, locked until a story, not here); chapters in order; another mode's errand", () => {
  const { core, unlocks } = world();
  const cookish = { id: "cook", games: { x: fakeGame("x") }, plan: () => [{ game: "x" }], lab: () => [], free: { endless: true } };
  const ctx = { mode: cookish, unlocks, arcs, map, save: core.save };
  const r = M.resolveEntry({ play: "free" }, ctx);
  assert.deepEqual([r.ok, r.entry.place], [true, "kitchen"]);
  const beach = M.resolveEntry({ play: "free", place: "beach" }, ctx);
  assert.equal(beach.why.kind, "not-here");
  const beachMap = { places: [{ id: "beach", unlock: "beach", modes: [{ mode: "cook" }] }] };
  const lockedBeach = M.resolveEntry({ play: "free", place: "beach" }, Object.assign({}, ctx, { map: beachMap }));
  assert.deepEqual([lockedBeach.why.kind, lockedBeach.why.arc], ["locked", "beach"]);
  // birthday chapter 2 waits for chapter 1, once the arc itself is open
  unlocks.finishArc("first-launch");
  const ch2 = M.resolveEntry({ play: "story", arc: "birthday", errand: "find-sweets" }, Object.assign({}, ctx, { mode: { id: "hide-and-seek", games: { x: fakeGame("x") } } }));
  assert.deepEqual([ch2.ok, ch2.why.kind, ch2.why.chapter], [false, "locked", 1]);
  const other = M.resolveEntry({ play: "story", arc: "birthday", errand: "set-table" }, ctx);
  assert.deepEqual([other.why.kind, other.why.mode], ["other-mode", "put-it-there"]);
  assert.equal(M.resolveEntry({ play: "story", arc: "birthday", errand: "cook-guests" }, ctx).ok, true);
});

test("the end screen's actions by play: a lab offers the list; free play's Next only when endless", () => {
  assert.deepEqual(M.actionIds(demo, "lab"), ["again", "list"]);
  assert.deepEqual(M.actionIds(demo, "story"), ["again", "next", "home"]);
  assert.deepEqual(M.actionIds(Object.assign({}, demo, { free: { endless: false } }), "free"), ["again", "home"]);
  const a = M.actionsFor(demo, "free");
  assert.equal(a[a.length - 1].primary, true);
  assert.deepEqual(M.actionsFor(demo, "lab", (o) => Object.keys(o)), ["again", "list"]);
});

test("labs: every lab entry of a mode, with its lab.html address", () => {
  const list = M.labList([demo]);
  assert.deepEqual(
    list.map((l) => l.url),
    ["lab.html?mode=demo&game=pantry&level=1", "lab.html?mode=demo&game=scrape&level=1", "lab.html?mode=demo&level=1"]
  );
});

test("plug and play, end to end: story errand -> badges, coins, story log, chapter and arc done -> free play opens and pays every round", async () => {
  const { core, unlocks } = world();
  const mode = demoLike();
  const doc = fakeDoc();
  const root = doc.body.appendChild(new FakeEl("main"));
  const actions = [];
  const plays = [];
  const host = createHost({ root, doc, core, quiet: true, slots: async (n) => actions.push(`slot:${n}`), autoAction: (round) => (plays.push(round.play && round.play.play), plays.length === 1 ? "next" : plays.length < 4 ? "next" : "home") });
  const nav = [];
  const rounds = [];
  // 1. free play is locked
  const locked = await M.playMode({ mode, entry: { play: "free" }, host, core, unlocks, arcs, map, nav: { locked: (w) => nav.push(`locked:${w.arc}`) } });
  assert.equal(locked.locked, true);
  // 2. the story errand (Next after it: the arc has no more errands, so home)
  const s = await M.playMode({ mode, entry: { play: "story", arc: "demo", chapter: 1, errand: "helper" }, host, core, unlocks, arcs, map, nav: { home: () => nav.push("home") }, onRound: (r) => rounds.push(r) });
  assert.equal(s.round.game, "helper");
  assert.deepEqual([s.round.right, s.round.total], [4, 5]);
  assert.ok(s.finish.badges.accuracy && s.finish.badges.hints);
  assert.ok(s.finish.pay.coins > 0);
  assert.deepEqual(s.story, { chapterDone: true, arcDone: true });
  assert.deepEqual(unlocks.arc("demo"), { chapter: 1, done: true });
  assert.equal(unlocks.why("demo"), null);
  assert.ok(M.errandsDone(core.save, "demo").helper);
  assert.ok(actions.includes("slot:kitchen-to-clinic"));
  const storyLog = core.log.days().flatMap((d) => d.entries);
  assert.deepEqual(storyLog.map((e) => [e.type, e.arc, e.errand]), [["round", "demo", "helper"]]);
  const coinsAfterStory = core.wallet.coins();
  // 3. free play now opens; Next brings another round, then Home
  const f = await M.playMode({ mode, entry: { play: "free" }, host, core, unlocks, arcs, map, nav: { home: () => nav.push("home") }, onRound: (r) => rounds.push(r) });
  assert.equal(f.round.play.play, "free");
  assert.equal(rounds.length, 4); // the story round + three free rounds (next, next, home)
  assert.ok(core.wallet.coins() > coinsAfterStory);
  rounds.slice(1).forEach((r) => assert.ok(r.finish.pay.coins > 0));
  assert.deepEqual(nav, ["locked:demo", "home", "home"]);
  assert.deepEqual(plays, ["story", "free", "free", "free"]);
});

test("a lab round of one stage: the stage alone, the list at the end, nothing locked, no story progress", async () => {
  const { core, unlocks } = world();
  const mode = demoLike();
  const doc = fakeDoc();
  const host = createHost({ root: doc.body.appendChild(new FakeEl("main")), doc, core, quiet: true, autoAction: () => "list" });
  const nav = [];
  const r = await M.playMode({ mode, entry: { play: "lab", game: "scrape", level: 3 }, host, core, unlocks, arcs, map, nav: { list: () => nav.push("list") } });
  assert.equal(r.round.game, "scrape");
  assert.equal(r.round.level, 3);
  assert.equal(r.stages.length, 1);
  assert.deepEqual(nav, ["list"]);
  assert.deepEqual(unlocks.arc("demo"), { chapter: 0, done: false });
});

test("loadMode: a mode by id, checked, with its data loaded; gamesOf lists what a plan needs", async () => {
  const base = new URL("../../", import.meta.url).href;
  const m = await M.loadMode("demo", { base, fetchJSON: async () => ({}) });
  assert.equal(m.id, "demo");
  assert.deepEqual(m.loaded, {});
  const needs = M.gamesOf(m, m.plan({ play: "story" })).map((g) => g.id);
  assert.deepEqual(needs, ["pantry", "scrape"]);
  await assert.rejects(M.loadMode("../etc"), /no such mode/);
});
