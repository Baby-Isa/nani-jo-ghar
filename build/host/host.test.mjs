// js/shared/host.js: the one game host, with fake mini-games and the real core (memory save).
// Lifecycle, cleanup (E17), take-back (E14), pause slots, the play context (story / free / lab), the test hook.
// Run: node --test build/host/
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHost, createTally, levelFor, validateGame, seeded, HostLeft, stubStage } from "../../js/shared/host.js";
import { FakeEl, fakeDoc, stroke, flush } from "./fake-dom.mjs";
import { makeCore, fakeVoice, fakeGame } from "./helpers.mjs";

const fakeTimersFast = () => ({ now: () => Date.now(), setTimeout: (f) => setTimeout(f, 0), clearTimeout, setInterval: (f) => setInterval(f, 1), clearInterval });

function newHost(over = {}) {
  const doc = fakeDoc();
  const root = doc.body.appendChild(new FakeEl("main", { id: "play", rect: { left: 0, top: 0, width: 1000, height: 600 } }));
  const findings = [];
  const host = createHost(Object.assign({ root, doc, timers: fakeTimersFast(), onFinding: (f) => findings.push(f), quiet: true }, over, { core: over.core || makeCore() }));
  return { host, root, doc, findings, core: over.core };
}

test("the interfaces: validateGame, levelFor, seeded, the tally", () => {
  assert.deepEqual(validateGame(fakeGame("ok")), []);
  assert.ok(validateGame({ id: "Bad Id", mount: 1 }).length >= 3);
  assert.equal(levelFor({ levels: [1, 2, 3] }, 4), 3);
  assert.equal(levelFor({ levels: [2, 3] }, 1), 2);
  assert.equal(levelFor({ levels: [1, 3] }, 2), 1);
  const a = seeded(7);
  const b = seeded(7);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
  const t = createTally();
  t.mark("x", false);
  t.mark("x", true); // a second try: logged, not scored (E14)
  t.mark("y", true, { word: "cook-chai" });
  t.hint();
  const s = t.summary();
  assert.deepEqual([s.right, s.total, s.hints, s.tries], [1, 2, 1, 1]);
  assert.deepEqual(s.marks, [false, true]);
  assert.deepEqual(s.rows, [{ word: "cook-chai", ok: true, cue: "kutchi", firstTry: true }]);
});

test("lifecycle: each stage mounts, starts, finishes and is destroyed before the next mounts; then Score.finish", async () => {
  const log = [];
  const mode = { id: "fake", games: { one: fakeGame("one", { log }), two: fakeGame("two", { log, wrong: ["b"] }) } };
  const { host, root, findings, core } = (() => {
    const c = makeCore();
    return Object.assign(newHost({ core: c }), { core: c });
  })();
  const res = await host.run({ mode, plan: { game: "visit", stages: [{ game: "one" }, { game: "two", level: 2 }] }, play: { play: "free" }, level: 1 });
  assert.deepEqual(log, ["one:mount:L1", "one:start", "one:destroy", "two:mount:L2", "two:start", "two:destroy"]);
  assert.equal(root.children.length, 0);
  assert.deepEqual(findings, []);
  assert.equal(res.round.game, "visit");
  assert.deepEqual([res.round.right, res.round.total], [3, 4]);
  assert.deepEqual(res.round.marks, [true, true, true, false]);
  assert.equal(res.round.rows.length, 4);
  // badges and coins through the core
  assert.equal(res.finish.badges.accuracy.tier, "mid");
  assert.ok(res.finish.pay.coins > 0);
  assert.equal(core.wallet.coins(), res.finish.pay.coins);
  assert.equal(core.progress.get("w-a").seen > 0 || core.progress.get("w-a").right > 0, true);
  assert.equal(res.out.action, "done"); // no end screen in Node
});

test("E17: a stage that leaves its UI or a voice playing is a finding, and the host clears it so the next starts clean", async () => {
  const voice = fakeVoice();
  const core = makeCore({ voice });
  const leaky = {
    id: "leaky",
    gestures: ["tap"],
    levels: [1],
    mount(el, ctx) {
      el.appendChild(new FakeEl("div", { className: "left-behind" }));
      return {
        start() {
          ctx.voice.say({ text: "a long line" }); // never stopped
          ctx.after(10000, () => assert.fail("a ctx.after timer outlived its stage"));
          ctx.done();
        },
        destroy() {},
      };
    },
  };
  const log = [];
  const mode = { id: "fake", games: { leaky, two: fakeGame("two", { log }) } };
  const { host, root, findings } = newHost({ core });
  const res = await host.run({ mode, plan: [{ game: "leaky" }, { game: "two" }], play: { play: "lab" } });
  assert.deepEqual(findings.map((f) => f.kind).sort(), ["effect-left", "ui-left"]);
  assert.match(findings.find((f) => f.kind === "ui-left").what, /left-behind/);
  assert.equal(voice.playing.size, 0, "the host stopped the voice");
  assert.equal(root.children.length, 0);
  assert.deepEqual(log, ["two:mount:L1", "two:start", "two:destroy"]);
  assert.equal(res.stages.length, 2);
});

test("E14: take it back until Done; only the first placement is scored; a row marked twice counts once", async () => {
  const game = {
    id: "tray",
    gestures: ["tap"],
    levels: [1],
    mount(el, ctx) {
      return {
        start() {
          ctx.place("cup-1", { word: "cook-khun" }, false); // wrong first
          assert.deepEqual(ctx.takeBack("cup-1"), { word: "cook-khun" });
          ctx.place("cup-1", { word: "cook-dudh" }, true); // right second: not scored
          ctx.place("cup-2", { word: "cook-dudh" }, true);
          ctx.mark("row", true);
          ctx.mark("row", false);
          ctx.done();
          assert.equal(ctx.takeBack("cup-2"), null, "nothing moves after Done");
        },
      };
    },
  };
  const { host, findings } = newHost();
  const res = await host.run({ mode: { id: "fake", games: { tray: game } }, plan: [{ game: "tray" }] });
  assert.deepEqual(findings, []);
  assert.deepEqual(res.round.marks, [false, true, true]);
  assert.deepEqual([res.round.right, res.round.total], [2, 3]);
});

test("pause slots: the shell is asked between stages and at ctx.pause in story and free play, never in a lab", async () => {
  const asked = [];
  const slots = async (name, info) => asked.push(`${name}:${info.play.play}`);
  const game = (id) => ({
    id,
    gestures: ["tap"],
    levels: [1],
    mount: (el, ctx) => ({
      async start() {
        await ctx.pause("after-serve");
        ctx.done();
      },
    }),
  });
  const mode = { id: "fake", games: { a: game("a"), b: game("b") } };
  const plan = [{ game: "a" }, { pause: "between" }, { game: "b" }];
  for (const play of [{ play: "story", arc: "demo", chapter: 1, errand: "helper" }, { play: "free" }, { play: "lab" }]) {
    const { host } = newHost({ slots });
    await host.run({ mode, plan, play });
  }
  assert.deepEqual(asked, ["after-serve:story", "between:story", "after-serve:story", "after-serve:free", "between:free", "after-serve:free"]);
});

test("the play context: story logs the round and the game's lines; free play pays without a story; a lab round has no play", async () => {
  const say = (core) => ({
    id: "s",
    gestures: ["tap"],
    levels: [1],
    mount: (el, ctx) => ({
      start() {
        ctx.log({ type: "made", what: "chai" });
        ctx.mark("r", true, { word: "cook-chai" });
        ctx.done();
      },
    }),
  });
  const runWith = async (play) => {
    const core = makeCore();
    const { host } = newHost({ core });
    const res = await host.run({ mode: { id: "fake", games: { s: say() } }, plan: [{ game: "s" }], play });
    const days = core.log.days();
    return { res, entries: days.flatMap((d) => d.entries), core };
  };
  const story = await runWith({ play: "story", arc: "demo", chapter: 1, errand: "helper" });
  assert.deepEqual(story.entries.map((e) => e.type), ["made", "round"]);
  assert.equal(story.entries[0].arc, "demo");
  assert.equal(story.res.round.play.play, "story");
  const free = await runWith({ play: "free" });
  assert.equal(free.entries.length, 0);
  assert.ok(free.res.finish.pay.coins > 0);
  const lab = await runWith({ play: "lab" });
  assert.equal(lab.res.round.play, null);
  assert.equal(lab.entries.length, 0);
});

test("an adapter's own score becomes marks; its evidence feeds word progress; its time is its own", async () => {
  const adapter = {
    id: "wrapped",
    gestures: ["tap"],
    levels: [1, 2],
    screen: "own",
    mount: (el, ctx) => ({ start: () => ctx.done({ right: 2, total: 3, hints: 1, timeMs: 42000, words: [{ id: "cook-chai", kutchi: "chai", english: "tea", right: true }], evidence: [{ word: "cook-chai", ok: true }] }) }),
  };
  const core = makeCore();
  const { host } = newHost({ core });
  const res = await host.run({ mode: { id: "fake", games: { wrapped: adapter } }, plan: [{ game: "wrapped" }], play: { play: "free" } });
  assert.deepEqual(res.round.marks, [true, true, false]);
  assert.equal(res.round.hints, 1);
  assert.equal(res.round.timeMs, 42000);
  assert.deepEqual(res.round.rows, [{ word: "cook-chai", ok: true, cue: "kutchi", firstTry: true }]);
  assert.equal(res.finish.badges.hints.tier, "mid");
  assert.ok(core.progress.get("cook-chai").right >= 1);
});

test("leave(): the current stage is destroyed, its waits reject, and run() resolves as left", async () => {
  const log = [];
  const game = {
    id: "slow",
    gestures: ["tap"],
    levels: [1],
    mount: (el, ctx) => ({
      async start() {
        try {
          await ctx.wait(60000);
          log.push("woke");
        } catch (e) {
          log.push(e instanceof HostLeft ? "left" : "error");
          throw e;
        }
      },
      destroy: () => log.push("destroy"),
    }),
  };
  const doc = fakeDoc();
  const root = doc.body.appendChild(new FakeEl("main"));
  const host = createHost({ root, doc, core: makeCore(), quiet: true });
  const p = host.run({ mode: { id: "fake", games: { slow: game } }, plan: [{ game: "slow" }] });
  await flush();
  host.leave();
  const res = await p;
  await flush();
  assert.equal(res.left, true);
  assert.deepEqual(log, ["destroy", "left"]);
});

test("the test hook: state, expect, hitAreas from ctx.input, states, and finish() ends a stage with its bot's fair result", async () => {
  const game = {
    id: "botty",
    gestures: ["tap"],
    levels: [1],
    bot: () => ({ rows: [1, 2], solve: (s) => (s === "fair" ? { right: 2, total: 2 } : { right: 0, total: 2 }) }),
    mount(el, ctx) {
      const b = el.appendChild(new FakeEl("button", { id: "go", rect: { left: 10, top: 10, width: 30, height: 30 } }));
      ctx.input.tap(b, () => {});
      ctx.test.state("waiting");
      ctx.test.expect({ kind: "tap", x: 25, y: 25 });
      return { start() {}, destroy: () => b.remove() };
    },
  };
  const { host } = newHost();
  const p = host.run({ mode: { id: "fake", games: { botty: game } }, plan: [{ game: "botty" }] });
  await flush();
  const T = host.test;
  assert.equal(T.state(), "fake/botty/waiting");
  assert.deepEqual(T.expect(), { kind: "tap", x: 25, y: 25 });
  const [h] = T.hitAreas();
  assert.equal(h.small, true);
  assert.equal(h.hit.width, 48);
  assert.deepEqual(T.states(), ["fake/botty"]);
  T.finish();
  const res = await p;
  assert.deepEqual([res.round.right, res.round.total], [2, 2]);
  assert.equal(T.state(), "done");
});

test("E5 through the host: a tap while a line plays acts at once and tells the shell (onActDuringSpeech)", async () => {
  const voice = fakeVoice();
  const told = [];
  const game = {
    id: "talky",
    gestures: ["tap"],
    levels: [1],
    mount(el, ctx) {
      const b = el.appendChild(new FakeEl("button", { rect: { left: 100, top: 100, width: 80, height: 80 } }));
      ctx.input.tap(b, () => {
        ctx.mark("r", true);
        ctx.done();
      });
      return {
        start: () => ctx.voice.say({ text: "Pela chai." }),
        destroy() {
          ctx.voice.stop();
          b.remove();
        },
      };
    },
  };
  const { host, root } = newHost({ core: makeCore({ voice }), onActDuringSpeech: (id) => told.push(id) });
  const p = host.run({ mode: { id: "fake", games: { talky: game } }, plan: [{ game: "talky" }] });
  await flush();
  assert.equal(voice.busy(), true);
  stroke(root, [[140, 140, 0], [140, 140, 60]]);
  const res = await p;
  assert.deepEqual(told, ["fake/talky"]);
  assert.equal(res.round.right, 1);
});

test("the stage stub: scene pixels to the screen, covering the play area (until R3a's stage.js)", () => {
  const el = new FakeEl("div", { rect: { left: 0, top: 0, width: 800, height: 600 } });
  const s = stubStage(el, { width: 1600, height: 900 });
  assert.equal(s.stub, true);
  const k = 600 / 900; // covers: the taller side wins
  assert.ok(Math.abs(s.scale() - k) < 1e-9);
  const c = s.toScreen(800, 450);
  assert.ok(Math.abs(c.x - 400) < 1e-9 && Math.abs(c.y - 300) < 1e-9);
  const back = s.toScene(c.x, c.y);
  assert.ok(Math.abs(back.x - 800) < 1e-9);
});
