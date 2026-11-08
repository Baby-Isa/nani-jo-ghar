// The kitchen kit's heat and boil (Sprint 18, module map pieces 1 and 3: js/cook/mechanics/boil.js, Mech.boil): the knob, too
// early, the green window, boil-over and starting again, the first-time hold, the simmer loop's level, and the proof that a game's
// window and times from its json give the same timings frame for frame as the hand-written loop it replaces (the heat's step:
// rate a second to the green, half that in it; CHAI-10). Runs the real file in Node on a stub scene (no Phaser).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));

// ---- the stub world: the namespace, the scene, the sounds, the notes ----
globalThis.window = globalThis;
const notes = [];
globalThis.Lifecycle = { note: (what, o) => notes.push({ what, ...o }) };
const { Cook } = await import("../../js/cook/ns.js");
const cookData = json("data/cook.json");
const knobs = (id, { level = 1, profile } = {}) => {
  // data.mechanics.<id>: levels 1..n merged in order, then the profile's at each level (as js/cook/zone.js Mech.knobs)
  const L = cookData.mechanics[id].levels;
  const n = Math.max(1, Math.min(L.length, level));
  const out = {};
  for (let i = 0; i < n; i++) for (const [k, v] of Object.entries(L[i])) if (k !== "profiles") out[k] = v;
  if (profile) for (let i = 0; i < n; i++) Object.assign(out, (L[i].profiles || {})[profile] || {});
  out.level = n;
  return out;
};
const sounds = [];
Object.assign(Cook, {
  D: { item: 30, fx: 40 },
  Stations: {},
  Mech: { define() {}, lab() {}, knobs },
  speed: 1,
  wait: () => Promise.resolve(),
  data: { lines: {} },
  sfx: {
    green: () => sounds.push("green"),
    puff: () => sounds.push("puff"),
    simmerLoop: (k) => (sounds.push(`loop ${k.toFixed(3)}`), { stop: () => sounds.push("loop stop"), pitch: (k2) => sounds.push(`pitch ${k2.toFixed(3)}`) }),
  },
  Kit: { heatRing: () => ({ draw() {}, clear() {} }) },
});
await import("../../js/cook/mechanics/boil.js");
const Mech = Cook.Mech;

function scene() {
  let now = 0;
  const S = {
    ticks: [],
    loops: [],
    wiggled: 0,
    taps: new Map(),
    addTick(fn) {
      const t = { fn };
      S.ticks.push(t);
      return () => (t.fn = null);
    },
    wiggle: () => S.wiggled++,
    tappable: (o, fn) => S.taps.set(o, fn),
    bandScore: (v, lo, hi) => (v >= lo && v <= hi ? 100 : Math.max(35, Math.min(99, 100 - (v < lo ? lo - v : v - hi) * 260))),
    clock: () => now,
    // one frame of `ms` (60 fps by default)
    frame(ms = 1000 / 60) {
      now += ms;
      S.ticks.forEach((t) => t.fn && t.fn());
    },
    clearView() {
      S.loops.forEach((l) => l.stop());
      S.loops = [];
      S.ticks = [];
    },
  };
  return S;
}
const burner = () => {
  const b = { knob: { id: "knob" }, knobHit: { id: "hit" }, states: [], set: (st) => b.states.push(st) };
  return b;
};
const pan = () => ({ x: 400, y: 300, r: 100 });
const settle = () => new Promise((r) => setImmediate(r));

// the hand-written loop the kit replaces (the station's heat tick, CHAI-10, at the signed-off chai): frame by frame, the frame on
// which the heat first enters the green, leaves it, and reaches 1
function oldLoop({ band: [lo, hi], rate }, frameMs = 1000 / 60) {
  let heat = 0;
  const at = {};
  let now = 0;
  let last = 0;
  for (let f = 1; f < 100000 && heat < 1; f++) {
    now += frameMs;
    const dt = Math.min(0.1, (now - last) / 1000); // (the station's own clock: performance.now's steps)
    last = now;
    const was = heat >= lo && heat <= hi;
    heat += rate * (heat >= lo ? 0.5 : 1) * dt;
    const inBand = heat >= lo && heat <= hi;
    if (inBand && !was) at.green = f;
    if (!inBand && was && at.past == null) at.past = f;
    if (heat >= 1) at.over = f;
  }
  return at;
}
// each level's window and times as a game reads them: data.mechanics.boil (profile tray) under the game's own `heat` (its json)
const chaiLevels = () => {
  const levels = json("data/stations/chai-tray.json").mechanic.levels;
  const merged = [];
  let acc = {};
  levels.forEach((L) => merged.push((acc = Object.assign({}, acc, L))));
  return merged.map((K, i) => ({ level: i + 1, ...Mech.boil.settings({ level: K.boilLevel || i + 1, profile: "tray", heat: K.heat }) }));
};

test("settings: each level's window and times come from the data and the game's json, never the kit", () => {
  const L = chaiLevels();
  assert.equal(L.length, 4);
  assert.deepEqual(L.map((k) => [k.band, k.rate]), [
    [[0.66, 0.86], 0.09],
    [[0.66, 0.86], 0.12],
    [[0.7, 0.84], 0.12],
    [[0.72, 0.85], 0.13],
  ]);
});

test("times: the kit's readout is the hand-written loop's, at every level", () => {
  for (const k of chaiLevels()) {
    const t = Mech.boil.times(k);
    const [lo, hi] = k.band;
    assert.ok(Math.abs(t.toGreen - lo / k.rate) < 1e-9);
    assert.ok(Math.abs(t.green - (hi - lo) / (k.rate * 0.5)) < 1e-9);
    assert.ok(Math.abs(t.toOver - (lo / k.rate + (1 - lo) / (k.rate * 0.5))) < 1e-9);
    assert.equal(t.boilAt, Math.max(0.3, lo - k.rate * 2));
    const old = oldLoop(k);
    // the old loop's frames at 60 fps land within one frame of the readout's seconds
    assert.ok(Math.abs(old.green / 60 - t.toGreen) <= 1 / 60 + 1e-9, `L${k.level} green ${old.green / 60} vs ${t.toGreen}`);
    assert.ok(Math.abs(old.over / 60 - t.toOver) <= 2 / 60 + 1e-9, `L${k.level} over ${old.over / 60} vs ${t.toOver}`);
  }
});

test("Mech.boil reproduces the old loop frame for frame: green, past the green, boil-over (every level, 60 and 24 fps)", async () => {
  for (const fps of [60, 24]) {
    for (const k of chaiLevels()) {
      const S = scene();
      Mech.boil.stove(S, { clock: S.clock, log: "t" });
      const marks = {};
      let f = 0;
      const b = Mech.boil(S, pan(), { band: k.band, rate: k.rate, burner: burner(), on: { green: () => (marks.green = f), over: () => (marks.over = f) } });
      b.tap();
      assert.equal(b.state, "heating");
      for (f = 1; f < 5000 && b.state === "heating"; f++) {
        const was = b.heat <= k.band[1];
        S.frame(1000 / fps);
        if (was && b.heat > k.band[1] && marks.past == null) marks.past = f;
      }
      const old = oldLoop(k, 1000 / fps);
      assert.equal(marks.green, old.green, `L${k.level} ${fps}fps green`);
      assert.equal(marks.past, old.past, `L${k.level} ${fps}fps past`);
      assert.equal(marks.over, old.over, `L${k.level} ${fps}fps over`);
      S.clearView();
    }
  }
});

test("the knob: cold won't light an empty pan; lit; too early shakes and runs on; the green turns it down", () => {
  const S = scene();
  const st = Mech.boil.stove(S, { clock: S.clock, log: "game" });
  const B = burner();
  let full = false;
  const seen = [];
  const b = Mech.boil(S, pan(), { id: "nana", band: [0.66, 0.86], rate: 0.09, burner: B, canLight: () => full, on: { cantLight: () => seen.push("cant"), light: () => seen.push("light"), early: () => seen.push("early"), green: () => seen.push("green"), down: (_, s) => seen.push(`down ${s}`), changed: (_, w) => seen.push(`changed ${w}`) } });
  const tap = S.taps.get(B.knobHit);
  assert.ok(tap, "the kit takes the knob's taps");
  tap();
  assert.equal(b.state, "cold");
  assert.equal(S.wiggled, 1);
  full = true;
  tap();
  assert.equal(b.state, "heating");
  assert.deepEqual(B.states, ["high"]);
  S.frame(1000);
  tap();
  assert.equal(b.state, "heating", "too early: the heat runs on");
  assert.equal(S.wiggled, 2);
  sounds.length = 0;
  while (b.heat < 0.7) S.frame();
  assert.equal(sounds.filter((s) => s === "green").length, 1, "the green's ding, once");
  tap();
  assert.equal(b.state, "ready");
  assert.deepEqual(B.states, ["high", "low"]);
  assert.deepEqual(seen, ["cant", "light", "changed light", "early", "green", "down 100", "changed down"]);
  assert.deepEqual(st.boilLog.map((x) => `${x.who}:${x.what}`), ["nana:early", "nana:green"]);
  assert.ok(notes.some((n) => n.what === "game-down" && n.by === "0.66/0.86/nana"), "the turn-down note carries the game's prefix");
  tap();
  assert.equal(b.state, "ready", "a turned-down pan's knob does nothing");
  S.clearView();
});

test("past the green: a tap boils it over; no tap boils it over at the top; then the pan starts again", async () => {
  for (const tapPast of [true, false]) {
    const S = scene();
    const st = Mech.boil.stove(S, { clock: S.clock });
    const B = burner();
    const seen = [];
    const b = Mech.boil(S, pan(), { id: "ma", band: [0.66, 0.86], rate: 0.5, burner: B, on: { over: () => seen.push("over"), again: () => seen.push("again") } });
    b.tap();
    while (b.heat <= 0.9 && b.state === "heating") S.frame();
    if (tapPast) b.tap();
    else while (b.state === "heating") S.frame();
    await settle();
    assert.equal(b.state, "cold", "started again (the wait is immediate here)");
    assert.deepEqual(seen, ["over", "again"]);
    assert.equal(b.heat, 0);
    assert.deepEqual(B.states, ["high", "off"]);
    assert.deepEqual(st.boilLog.map((x) => x.what), ["over", "again"]);
    S.clearView();
  }
});

test("the first-time hold: the heat waits in the middle of the green until the tap, once", () => {
  const S = scene();
  let ended = 0;
  Mech.boil.stove(S, { clock: S.clock, hold: true, onHoldEnd: () => ended++ });
  const b = Mech.boil(S, pan(), { id: "ali", band: [0.66, 0.86], rate: 0.5, burner: burner() });
  const b2 = Mech.boil(S, { x: 0, y: 0, r: 50 }, { id: "ma", band: [0.66, 0.86], rate: 0.5, burner: burner() });
  b.tap();
  for (let i = 0; i < 600; i++) S.frame();
  assert.ok(Math.abs(b.heat - 0.76) < 1e-9, `held at ${b.heat}`);
  assert.ok(notes.some((n) => n.what === "timed-hold" && n.step === "start" && /^ali 0\.760/.test(n.by)));
  b.tap();
  assert.equal(ended, 1);
  assert.ok(notes.some((n) => n.what === "timed-hold" && n.step === "end"));
  b2.tap();
  for (let i = 0; i < 600 && b2.state === "heating"; i++) S.frame();
  assert.equal(b2.state, "over", "the hold is a first time only: the next pan's heat runs on");
  S.clearView();
});

test("the simmer loop: by the hottest pan on the heat, its level even in decibels, off once nothing heats", () => {
  const db = Mech.boil.simmerDb;
  assert.equal(db(0, 0.5, 0.86), -24);
  assert.ok(Math.abs(db(0.5, 0.5, 0.86) - 20 * Math.log10(0.75)) < 1e-9);
  assert.ok(Math.abs(db(0.8, 0.5, 0.86) - 20 * Math.log10(0.75)) < 1e-9);
  assert.equal(db(1, 0.5, 0.86), 0);
  const S = scene();
  const st = Mech.boil.stove(S, { clock: S.clock });
  const b = Mech.boil(S, pan(), { id: "a", band: [0.66, 0.86], rate: 0.09, burner: burner() });
  sounds.length = 0;
  S.frame();
  assert.equal(sounds.length, 0, "no loop while nothing heats");
  b.tap();
  S.frame();
  assert.match(sounds[0], /^loop /);
  while (b.heat < 0.7) S.frame();
  b.tap();
  S.frame();
  assert.equal(sounds[sounds.length - 1], "loop stop");
  assert.ok(st.simmerLog.length > 3 && st.simmerLog.every((r) => r.who === "a"));
  S.clearView();
});

test("bind: the game's pan.state and pan.heat are the kit's; a game's reset reaches it", () => {
  const S = scene();
  Mech.boil.stove(S, { clock: S.clock });
  const p = Object.assign(pan(), { state: "cold", heat: 0, who: "nani" });
  const b = Mech.boil(S, p, { band: [0.66, 0.86], rate: 0.09, burner: burner(), bind: true });
  b.tap();
  S.frame(500);
  assert.equal(p.state, "heating");
  assert.equal(p.heat, b.heat);
  Object.assign(p, { heat: 0, state: "cold" });
  assert.equal(b.state, "cold");
  assert.equal(b.heat, 0);
  S.clearView();
});

test("a view cleared mid-boil: the loop stops, nothing ticks on, and the next station gets its own stove", () => {
  const S = scene();
  const st = Mech.boil.stove(S, { clock: S.clock });
  const b = Mech.boil(S, pan(), { band: [0.66, 0.86], rate: 0.09, burner: burner() });
  b.tap();
  S.frame();
  sounds.length = 0;
  S.clearView();
  assert.ok(st.dead);
  assert.deepEqual(sounds, ["loop stop"]);
  const h = b.heat;
  S.frame();
  assert.equal(b.heat, h);
  assert.notEqual(Mech.boil.stove(S, { clock: S.clock }), st);
});

test("no game named in the kit's stove files (STD-F1-02); asset folders aside", () => {
  for (const f of ["js/cook/mechanics/boil.js", "js/cook/kitchen-kit.js"]) {
    const text = read(f).replace(/assets\/[\w/.-]+/g, "").replace(/\b[A-Z]+-\d+\b/g, "").replace(/build\/[\w/.-]+/g, "");
    const hit = text.split("\n").findIndex((l) => /\b(chai|daar|daal|maani|samosa|chaat|sekelo|mishkaki|eggs|baking|corn)\b/i.test(l));
    assert.equal(hit, -1, `${f}:${hit + 1} names a game`);
  }
});

// ---- module map piece 4: the worktop wash and the stone band, moved into the kitchen kit (names kept) ----
test("the worktop wash and the stone band live in the kitchen kit, moved unchanged, and draw the band in the stone's colour", async () => {
  globalThis.Tokens = { int: (k) => ({ "worktop-wash": 0x111111, stone: 0x222222 })[k] };
  await import("../../js/cook/kitchen-kit.js");
  const St = Cook.Stations;
  assert.equal(St.worktopWash(), 0x111111);
  assert.equal(St.STONE.mean, 0x222222);
  assert.equal(Cook.Kit.stoneBand, St.stoneBand);
  // the same code as station-lib's (S$ there, St here) while that copy waits to be deleted by its owner
  const body = (text, start) => {
    const i = text.indexOf(start);
    if (i < 0) return null;
    const j = text.indexOf("\n  };\n", i);
    return text.slice(i, j).replace(/\bS\$/g, "St").replace(/\s+/g, " ");
  };
  const lib = read("js/cook/station-lib.js");
  const kk = read("js/cook/kitchen-kit.js");
  const libBand = body(lib, "S$.stoneBand = function");
  if (libBand) assert.equal(body(kk, "St.stoneBand = function"), libBand);
  const fills = [];
  const drawn = [];
  const S = {
    track: (o) => (drawn.push(o), o),
    add: {
      graphics: () => ({ setDepth() { return this; }, fillStyle: (c, a) => fills.push([c, a]), fillRect: (...r) => fills.push(r) }),
      rectangle: (...a) => ({ args: a, setOrigin() { return this; }, setDepth(d) { this.depth = d; return this; } }),
    },
  };
  St.stoneBand(S, { top: 630, base: 818, far: 100, depth: 1.2 });
  assert.deepEqual(fills, [[0x222222, 1], [-100, 630, 1800, 370], [0x2a1a0a, 0.08], [-100, 630, 1800, 3]]); // (SAM-29: the band's top shade)
  const w = Cook.Kit.worktop(S, { top: 630, far: 100, depth: 1 });
  assert.deepEqual(w.args, [-100, -100, 1800, 730, 0x111111, 0.18]);
  assert.equal(w.depth, 1);
});
