// The window ride (js/shared/window-ride.js, s09-ride): the plan's rules, the ride's motion and fairness on the shared model (the
// same rules the screen draws), the Kutchi leak bot (non-negotiable 6), the ride's data and its contract checks 47 and 48.
// Each rule is red on a planted fault and green on the ride. Run: node --test build/test_shared_window_ride.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { leakReport, playRide, VIEWS, seeded } from "./leak_window_ride.mjs";
import { check47, check48, hiddenShare, rideFields } from "./sandbox/lib/contract-day.mjs";

const require = createRequire(import.meta.url);
const W = require("../js/shared/window-ride.js");
const ROOT = new URL("../", import.meta.url);
const day = JSON.parse(readFileSync(new URL("data/day.json", ROOT), "utf8"));
const ride = day.window.rides["farm-road"];
// the engine's gaps today (every thing whose noun the lexicon lacks: the cow, the s09b animals, vehicles, sky things and
// landmarks): never named, they only pass by
const LEX = new Set(JSON.parse(readFileSync(new URL("data/lang/lexicon.json", ROOT), "utf8")).entries.map((e) => e.id));
const GAPS = new Set(Object.entries(ride.things).filter(([, t]) => !LEX.has(typeof t.say === "string" ? t.say : t.say.kind)).map(([id]) => id));
const callable = (id) => !GAPS.has(id);

test("the plan: look-alikes together, one named, no thing named twice running, the first group on the near verge", () => {
  for (let s = 1; s <= 200; s++) {
    const p = W.plan(ride, 1 + (s % 3), seeded(s), { callable });
    assert.ok(p.calls.length >= 3);
    assert.equal(p.calls[0].line, "near", "the first group on the near verge (from a family that may stand there: the doors keep to the field)");
    p.calls.forEach((c) => c.group.forEach((id) => assert.ok(W.linesOf(ride.things[id]).includes(c.line), `${id} on ${c.line}`)));
    p.calls.forEach((c, i) => {
      assert.ok(c.group.length >= 2, "a group is at least two look-alikes");
      assert.ok(c.group.includes(c.named));
      assert.equal(new Set(c.group.map((id) => ride.things[id].family)).size, 1, "one family per group");
      assert.ok(!c.group.some((id) => GAPS.has(id)), "a thing the engine can't say is never in a group");
      if (i) assert.notEqual(c.named, p.calls[i - 1].named);
    });
  }
});

test("every callable thing with a look-alike is named somewhere (no picture is safe to ignore); one without (the car) only passes", () => {
  const named = new Set();
  for (let s = 1; s <= 300; s++) W.plan(ride, 2, seeded(s), { callable }).calls.forEach((c) => named.add(c.named));
  const fam = W.families(ride, callable);
  const askable = new Set(Object.values(fam).flat());
  Object.keys(ride.things).filter((id) => !GAPS.has(id)).forEach((id) => assert.equal(named.has(id), askable.has(id), `${id}: named in some round iff it has a callable look-alike`));
  assert.ok(!askable.has("car"), "the car has no callable look-alike yet: it only passes");
});

test("judge: right first, helped after a wrong tap or the glow, missed when never tapped", () => {
  const c = { group: ["goat", "hen", "dog"], named: "hen" };
  assert.equal(W.judge(c, [{ at: "before", i: 1 }]), "right");
  assert.equal(W.judge(c, [{ at: "before", i: 0 }, { at: "before", i: 1 }]), "helped");
  assert.equal(W.judge(c, [{ at: "glow", i: 1 }]), "helped");
  assert.equal(W.judge(c, []), "missed");
});

test("the plan-level leak bot: fair wins every round, every blind strategy under 10%, at every level", () => {
  const r = leakReport(ride, { rounds: 1000, callable });
  for (const L of Object.keys(r)) {
    assert.equal(r[L].fair, 1, `level ${L}: fair wins`);
    for (const [k, v] of Object.entries(r[L].blind)) assert.ok(v < 0.1, `level ${L}: ${k} wins ${(v * 100).toFixed(1)}%`);
  }
});

test("red: a planted leak (the named thing always comes first) is caught by the plan-level bot", () => {
  const leaky = (rd, level, rng, o) => {
    const p = W.plan(rd, level, rng, o);
    p.calls.forEach((c) => (c.group = [c.named, ...c.group.filter((g) => g !== c.named)]));
    return p;
  };
  const r = leakReport(ride, { rounds: 300, plan: leaky, callable });
  assert.ok(Object.values(r).some((x) => x.blind["tap-first"] >= 0.1), "the bot must catch tap-first winning");
});

// ---- the ride played on the model ----
const crossing = (hold, view) => {
  // the first thing of the first group: how long it is in the window, from its first pixel in to its last pixel out
  const p = W.plan(ride, 1, seeded(3), { callable });
  const m = W.model(ride, p, { rng: seeded(3), hold, view });
  let th = null;
  let t0 = null;
  while (m.t < 60000) {
    m.step(20);
    m.drain();
    if (!th) th = m.things.find((o) => o.member === 0) || null;
    if (!th) continue;
    const seen = th.x + th.w > m.view().x0 && th.x < m.view().x1;
    if (seen && t0 == null) t0 = m.t;
    if (!seen && t0 != null) return { ms: m.t - t0, w: th.w };
  }
  return null;
};

test("three speeds (RIDE-03, half as slow again): a thing crosses the window in about 13.5, 9 and 5 s (never under 4.5 s), the same on a phone and a tablet", () => {
  for (const view of Object.values(VIEWS)) {
    const slow = crossing("slow", view);
    const normal = crossing("normal", view);
    const fast = crossing("fast", view);
    assert.ok(slow.ms >= 12000 && slow.ms <= 15500, `slow ${slow.ms} ms`);
    assert.ok(normal.ms >= 8000 && normal.ms <= 10500, `normal ${normal.ms} ms`);
    assert.ok(fast.ms >= 4500 && fast.ms <= 6000, `fast ${fast.ms} ms`);
  }
});

test("nothing jumps: every thing and prop comes on right of the window and moves only with its line, until it leaves (RIDE-01)", () => {
  for (const hold of [null, "fast"])
    for (const [vn, view] of Object.entries(VIEWS))
      for (let s = 1; s <= 30; s++) {
        const p = W.plan(ride, 1 + (s % 3), seeded(s), { callable });
        const m = W.model(ride, p, { rng: seeded(s), hold, view });
        const last = new Map();
        let road = 0;
        while (!m.done && m.t < 120000) {
          m.step(40);
          const d = m.road - road;
          road = m.road;
          // a found thing's tap: the fair player, so the ride goes on
          for (const ev of m.drain()) if (ev.type === "call") m.tap(ev.uid);
          for (const o of [...m.things, ...m.props]) {
            const k = `${o.line || "near"}:${o.uid}`;
            if (!last.has(k)) assert.ok(o.x >= m.view().x1, `${vn} seed ${s}: ${o.id} came on inside the window (x ${Math.round(o.x)} < ${Math.round(m.view().x1)})`);
            else {
              const want = last.get(k) - d * (o.line ? m.speedOf(o) : m.lineSpeed.near);
              assert.ok(Math.abs(o.x - want) < 0.01, `${vn} seed ${s}: ${o.id} jumped ${Math.round(o.x - want)} px`);
            }
            last.set(k, o.x);
          }
        }
      }
});

test("the parallax setting: gentle on the farm road (Zafar, 20 Oct evening), deep and together from data; the field's things move with the middle layer", () => {
  assert.equal(ride.parallax, "gentle");
  const p = W.plan(ride, 1, seeded(2), { callable });
  const of = (parallax) => W.model(ride, p, { rng: seeded(2), view: VIEWS.phone, parallax });
  assert.deepEqual([of(null).layerSpeed("far"), of(null).layerSpeed("middle"), of(null).layerSpeed("near")], [0.5, 0.8, 1]);
  assert.deepEqual([of("deep").layerSpeed("far"), of("deep").layerSpeed("middle")], [0.15, 0.4]);
  assert.deepEqual(of("gentle").lineSpeed, { near: 1, field: 0.8, far: 0.5, sky: 0.5 });
  assert.deepEqual(of("together").lineSpeed, { near: 1, field: 1, far: 1, sky: 1 });
  assert.equal(of("together").layerSpeed("far"), 1);
  assert.equal(of({ far: 0.3, middle: 0.6, near: 1 }).layerSpeed("far"), 0.3);
});

test("even motion (Zafar, 20 Oct evening: 'very jerkily'): over 10 s of uneven frames the road moves exactly by the frames' real time", () => {
  const p = W.plan(ride, 1, seeded(6), { callable });
  for (const speed of [1, 3]) {
    const m = W.model(ride, p, { rng: seeded(6), view: VIEWS.phone, hold: "normal" });
    W.advance(m, 1200, speed); // past the start (a held speed eases in from the start)
    const rng = seeded(9);
    let t = 0;
    let worst = 0;
    while (t < 10000) {
      // 60 Hz with jitter, a dropped frame now and then, one long hitch
      const ms = t > 5000 && t < 5017 ? 150 : rng() < 0.05 ? 33.3 : 16.7 + (rng() - 0.5) * 2;
      const v = m.vel();
      const r0 = m.road;
      W.advance(m, ms, speed);
      const moved = m.road - r0;
      const want = v * ms * speed;
      worst = Math.max(worst, Math.abs(moved - want) / want);
      for (const ev of m.drain()) if (ev.type === "call") m.tap(ev.uid);
      t += ms;
    }
    assert.ok(worst < 0.002, `speed ${speed}: a frame moved ${(worst * 100).toFixed(2)}% off its real time`);
  }
  // a gap over a second (a hidden tab) is one frame, not a leap
  const m = W.model(ride, p, { rng: seeded(6), view: VIEWS.phone, hold: "normal" });
  W.advance(m, 1200);
  const r0 = m.road;
  W.advance(m, 5000);
  assert.ok(m.road - r0 < m.vel() * 20, "a 5 s gap moves the road one frame");
});

test("a speed change eases over about a second: no jump, every thing and layer together", () => {
  const p = W.plan(ride, 1, seeded(4), { callable });
  const m = W.model(ride, p, { rng: seeded(4), view: VIEWS.phone });
  m.step(500);
  const v0 = m.vel();
  m.setSpeed("fast");
  const vs = [];
  for (let i = 0; i < 70; i++) {
    m.step(20);
    vs.push(m.vel());
  }
  const v1 = vs[vs.length - 1];
  assert.ok(v1 > v0 * 1.5, "fast is faster");
  for (let i = 1; i < vs.length; i++) assert.ok(Math.abs(vs[i] - vs[i - 1]) < (v1 - v0) * 0.06, "no jump between two frames");
  const half = vs[24];
  assert.ok(half > v0 + (v1 - v0) * 0.2 && half < v0 + (v1 - v0) * 0.8, "half way through the second it is half way there");
  assert.ok(Math.abs(vs[55] - v1) < 1e-9, "there after a second");
  assert.deepEqual(m.lineSpeed, { near: 1, field: 0.8, far: 0.5, sky: 0.5 }, "the field's things move with the middle layer (gentle)");
});

test("fair at every speed: never asked while more than two thirds hidden or leaving; a missed thing comes round until found", () => {
  for (const hold of ["slow", "normal", "fast"])
    for (const [vn, view] of Object.entries(VIEWS))
      for (let s = 1; s <= 25; s++)
        for (const L of [1, 3]) {
          const p = W.plan(ride, L, seeded(s * 17 + L), { callable });
          const r = playRide(ride, p, "fair", { hold, view, seed: s });
          assert.deepEqual(r.fairness, [], `${hold} ${vn} L${L} seed ${s}`);
          assert.equal(r.found, r.calls, "fair finds everything");
        }
});

test("the miss player: every first pass goes by, each thing comes round and the ride still ends with everything found", () => {
  for (const hold of ["slow", "fast", null])
    for (let s = 1; s <= 20; s++) {
      const p = W.plan(ride, 1, seeded(s), { callable });
      const m = W.model(ride, p, { rng: seeded(s), hold, view: VIEWS.tablet });
      const passes = {};
      while (!m.done && m.t < 10 * 60000) {
        m.step(50);
        for (const ev of m.drain()) {
          if (ev.type === "call") {
            passes[ev.i] = ev.pass;
            if (ev.pass > 1) m.tap(ev.uid);
          }
        }
      }
      assert.ok(m.done, `seed ${s}: the ride ends`);
      assert.equal(m.found, p.calls.length);
      p.calls.forEach((c, i) => assert.ok(passes[i] >= 2, `call ${i} came round`));
    }
});

test("the timed leak bot at every speed: blind players win under 10%", async () => {
  const { rideReport } = await import("./leak_window_ride.mjs");
  const r = rideReport(ride, { sims: 60, callable });
  for (const [sp, lv] of Object.entries(r))
    for (const [L, x] of Object.entries(lv)) {
      assert.equal(x.fair.found, 1, `${sp} L${L}: fair finds everything`);
      for (const [k, v] of Object.entries(x.blind)) assert.ok(v < 0.12, `${sp} L${L}: ${k} wins ${(v * 100).toFixed(1)}%`);
    }
});

test("red: a planted timing leak (the named thing always leads its group) is caught by the timed bot", () => {
  let wins = 0;
  for (let s = 1; s <= 60; s++) {
    const p = W.plan(ride, 1, seeded(s), { callable });
    p.calls.forEach((c) => (c.group = [c.named, ...c.group.filter((g) => g !== c.named)]));
    const m = W.model(ride, p, { rng: seeded(s), view: VIEWS.phone });
    // a blind player that taps the first of the newest look-alikes in view when Nani asks
    let right = 0;
    while (!m.done && m.t < 5 * 60000) {
      m.step(50);
      for (const ev of m.drain()) {
        if (ev.type !== "call") continue;
        const c = m.open();
        const lead = c.members.slice().sort((a, b) => a.x - b.x)[0];
        if (m.tap(lead.uid).ok) right += ev.pass === 1 ? 1 : 0;
        else m.tap(ev.uid);
      }
    }
    if (right === p.calls.length) wins++;
  }
  assert.ok(wins / 60 >= 0.5, `the leak shows: ${wins} of 60 won`);
});

// ---- the data ----
test("the farm road's data: three layers with their speeds, the keyed frame, three groups of things, no stop-the-car", () => {
  const v = ride.view;
  assert.deepEqual(v.layers.map((l) => [l.id, l.speed]), [["far", 0.15], ["middle", 0.4], ["near", 1]]);
  for (const l of v.layers) assert.ok(l.tile && l.h && Array.isArray(l.shapes), `${l.id}: a tile, a height and placeholder shapes`);
  // the wide window (s09b W1, RIDE-07): its opening from the cut's report, a show box with both pillars round the opening
  assert.equal(v.frame.art, "assets/day/s09b/car-window-wide.webp");
  assert.ok(existsSync(new URL(v.frame.art, ROOT)));
  const cutWin = JSON.parse(readFileSync(new URL("assets/day/s09b/cut-report.json", ROOT), "utf8"))["car-window-wide"].opening;
  assert.deepEqual(v.frame.opening, [cutWin[0], cutWin[1], cutWin[0] + cutWin[2], cutWin[1] + cutWin[3]]);
  assert.ok(v.frame.show[0] < v.frame.opening[0] && v.frame.show[2] > v.frame.opening[2], "both pillars inside the show box");
  assert.ok(!("stopCar" in ride), "no stop-the-car beat (Zafar, 20 Oct)");
  assert.deepEqual(Object.keys(ride.groups).filter((k) => !k.startsWith("_")), ["review", "animals", "passing"]);
  for (const [g, ids] of Object.entries(ride.groups)) if (!g.startsWith("_")) for (const id of ids) assert.equal(ride.things[id].group, g, id);
  for (const [id, t] of Object.entries(ride.things)) {
    assert.ok(t.en && t.say && t.family, `${id}: an English name, an engine id and a family`);
    // where its cut is (s09r: the road style test's things; s09b: the farm road's things, RIDE-07)
    if (t.cut !== null) assert.ok(/^assets\/day\/(ride\/s09r|s09b)\/[\w-]+\.webp$/.test(t.cut), `${id}: where its cut lands`);
    else assert.equal(t.art, null, `${id}: no cut, so the placeholder`);
  }
  assert.equal(ride.things.cow.say, "n.cow", "the cow's engine id (the engine reports the gap; its Kutchi is never written here)");
  assert.ok(Object.keys(v.props).every((k) => ["bush", "haystack", "wall", "tree"].includes(k)));
});

test("an s09r cut that has landed is the art (the placeholder is drawn only while the cut is missing)", () => {
  const defs = [...ride.view.layers, ...Object.values(ride.view.props), ...Object.values(ride.things), ...(day.window.previewLayers.town || [])];
  for (const d of defs) {
    if (d.art) assert.ok(existsSync(new URL(d.art, ROOT)), `${d.art} exists`);
    if (d.cut && existsSync(new URL(d.cut, ROOT))) assert.equal(d.art, d.cut, `${d.cut} has landed: point art at it`);
  }
});

test("the ride starts by leaving town: the middle layer's first stretch is the shops (a placeholder), then the fields", () => {
  const mid = ride.view.layers.find((l) => l.id === "middle");
  assert.ok(mid.lead && /placeholder|replaces/.test(mid.lead.placeholder), "marked as a placeholder (Zafar, 20 Oct)");
  assert.equal(mid.lead.art, "assets/day/ride/s09r/town-shops.webp");
  assert.ok(existsSync(new URL(mid.lead.art, ROOT)));
  const fake = () => ({ style: {} });
  const L = { period: 1440, last: mid.lead.last, tiles: [0, 1, 2, 3, 4].map(() => ({ main: fake(), lead: fake(), isLead: false })) };
  W.leadTiles(L, 0);
  assert.deepEqual(L.tiles.map((t) => t.isLead), [true, true, false, false, false], "at the start: the copies over the window are the town");
  W.leadTiles(L, 1500);
  assert.deepEqual(L.tiles.map((t) => t.isLead), [true, false, false, false, false], "the town scrolls off to the left");
  W.leadTiles(L, 3000);
  assert.ok(L.tiles.every((t) => !t.isLead) && L.tiles[0].lead.style.display === "none", "then only fields, for good");
});

test("the cross-fade join: each copy fades in over the outer tenth of the one before", () => {
  assert.equal(W.FADE, 0.1);
});

// ---- contracts 47 and 48 on fixtures ----
const T = 1e6;
const life = (t, what, step, by) => ({ type: "c", k: "life", what, t, step: String(step), by });
const page = (tl) => ({ flow: "day:window", size: "1366x768", t0: T, timeline: [{ type: "c", k: "life", what: "stage-start", t: T }, ...tl] });
const runC = (fn, r) => {
  const out = [];
  fn(r, r.timeline, (check, t, measured) => out.push({ check, measured }));
  return out;
};
const OPEN = "open:100,40,1000,600";

test("contract-47: a call for a thing more than two thirds hidden or off screen is a break; a half-hidden one passes", () => {
  const hidden = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:700,300,100,100 ${OPEN} occ:690,280,90,140 edge:`)]);
  assert.match(runC(check47, hidden)[0].measured, /hidden/);
  const off = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:1010,300,100,100 ${OPEN} occ: edge:`)]);
  assert.match(runC(check47, off)[0].measured, /off screen/);
  const half = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:700,300,100,100 ${OPEN} occ:650,300,100,100 edge:`)]);
  assert.equal(runC(check47, half).length, 0);
  assert.ok(Math.abs(hiddenShare(rideFields(`box:700,300,100,100 ${OPEN} occ:650,300,100,100`)) - 0.5) < 0.01);
  const none = page([]);
  assert.match(runC(check47, none)[0].measured, /logged no call/);
});

test("contract-48: a call as the thing leaves, a missed thing that never comes round, a ride ending short are breaks", () => {
  const leaving = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:300,300,100,100 ${OPEN} occ: edge:`)]);
  assert.match(runC(check48, leaving)[0].measured, /leaving/);
  const never = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:800,300,100,100 ${OPEN} occ: edge:`), life(T + 20, "ride-pass", 0, "thing:goat pass:1 how:missed"), life(T + 30, "ride-end", "", "found:0 calls:1")]);
  const b = runC(check48, never);
  assert.ok(b.some((x) => /never came round/.test(x.measured)) && b.some((x) => /0 of 1/.test(x.measured)));
  const round = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:800,300,100,100 ${OPEN} occ: edge:`), life(T + 20, "ride-pass", 0, "thing:goat pass:1 how:missed"), life(T + 30, "ride-call", 0, `thing:goat pass:2 box:820,300,100,100 ${OPEN} occ: edge:`), life(T + 40, "ride-end", "", "found:1 calls:1")]);
  assert.equal(runC(check48, round).length, 0);
});

// ---- the farm road's s09b things (RIDE-07) ----
test("RIDE-07: things keep their real height ratios, sky things fly only in the sky band, landmarks pass only on the far hills or the field, big things keep to the field", () => {
  const p = W.plan(ride, 1, seeded(5), { callable });
  const m = W.model(ride, p, { rng: seeded(5), view: { x0: 157, x1: 1443, minPx: 10 } });
  m.begin();
  const seen = new Map();
  while (m.t < 240000 && !m.done) {
    m.step(40);
    for (const ev of m.drain()) if (ev.type === "call") m.tap(ev.uid);
    for (const o of m.things) seen.set(o.uid, o);
  }
  const all = [...seen.values()];
  const lines = new Map();
  for (const o of all) (lines.get(o.id) || lines.set(o.id, new Set()).get(o.id)).add(o.line);
  for (const [id, ls] of lines) for (const l of ls) assert.ok(W.linesOf(ride.things[id]).includes(l), `${id} stood on ${l}`);
  for (const id of ["kite", "aeroplane", "butterfly"]) assert.deepEqual(W.linesOf(ride.things[id]), ["sky"], id);
  for (const id of ["windmill", "well", "rainbow"]) assert.ok(W.linesOf(ride.things[id]).every((l) => l === "far" || l === "field"), id);
  assert.ok(["sky", "far"].every((l) => all.some((o) => o.line === l)), "sky things and landmarks pass");
  // the same line, real ratios: art height / metres is one number for every thing with a real height
  const per = all.filter((o) => ride.things[o.id].m != null && o.line === "field").map((o) => o.artH / ride.things[o.id].m);
  assert.ok(per.length > 3 && Math.max(...per) - Math.min(...per) < 1e-6, "one scale per line");
  const fieldOnly = ["bus", "tractor", "milk-van", "camel", "horse", "buffalo"];
  assert.ok(all.filter((o) => fieldOnly.includes(o.id)).every((o) => o.line === "field"), "the big things keep to the field");
});

test("RIDE-07: never asked once half behind the window's left pillar (the call ends; the thing comes round)", () => {
  for (let s = 1; s <= 20; s++) {
    const p = W.plan(ride, 1, seeded(s), { callable });
    const m = W.model(ride, p, { rng: seeded(s), view: VIEWS.tablet });
    while (m.t < 120000 && !m.done) {
      m.step(40);
      m.drain();
      const c = m.open();
      if (c && c.namedTh) {
        const th = c.namedTh;
        const inWin = Math.max(0, Math.min(th.x + th.w, m.view().x1) - Math.max(th.x, m.view().x0)) / th.w;
        assert.ok(!(th.x < m.view().x0 && inWin < 0.5), `seed ${s}: ${th.id} still asked at ${(inWin * 100).toFixed(0)}% in the window`);
        if (m.share(th) > 0.3 && m.t - c.saidAt > 1500) m.tap(th.uid);
      }
    }
    assert.ok(m.done, `seed ${s}: the ride ends`);
  }
});

// ---- Sprint 12 (s12-w1b) ----
test("RIDE-09: any thing on the card, tapped wherever it shows, is found in any order; the groups go on for the rest; wrong taps still help", () => {
  let tried = 0;
  for (let s = 1; s <= 400 && tried < 12; s++) {
    const p = W.plan(ride, 1, seeded(s), { callable });
    // a round whose first group holds the second call's thing as a look-alike
    if (!p.calls[0].group.includes(p.calls[1].named)) continue;
    tried++;
    const m = W.model(ride, p, { rng: seeded(s), view: VIEWS.tablet });
    while (!m.open() && m.t < 60000) m.step(20);
    const c0 = m.open();
    assert.ok(c0 && c0.i === 0, `seed ${s}: the first call is asked`);
    m.drain();
    const other = c0.members.find((o) => o.id === p.calls[1].named);
    assert.ok(m.tap(other.uid).ok, `seed ${s}: the second thing, out of turn, is found`);
    const ev = m.drain().find((e) => e.type === "found");
    assert.equal(ev.i, 1);
    assert.equal(ev.res, "right", "found first time, unhelped");
    assert.equal(m.open(), c0, "the first call is still asked");
    m.tap(c0.namedTh.uid);
    // the next group is the third call's: the second is passed over
    assert.equal(m.current().i, 2, `seed ${s}: the found one is skipped`);
    while (!m.done && m.t < 5 * 60000) {
      m.step(20);
      const c = m.open();
      if (c) m.tap(c.namedTh.uid);
      m.drain();
    }
    assert.ok(m.done, `seed ${s}: the ride ends`);
    const r = m.result();
    assert.equal(r.found, 3);
    assert.equal(r.right, 3);
  }
  assert.ok(tried >= 5, "rounds with a card thing among the first group's look-alikes");
});

test("RIDE-03: the first groups of a level are things that look nothing alike (no hen beside a bird)", () => {
  const look = W.lookOf(ride);
  for (let s = 1; s <= 300; s++)
    for (const L of [1, 2, 3]) {
      const p = W.plan(ride, L, seeded(s), { callable });
      for (let i = 0; i < p.distinct; i++) {
        const g = p.calls[i].group;
        assert.equal(new Set(g.map(look)).size, g.length, `L${L} seed ${s} call ${i + 1}: ${g.join(", ")}`);
      }
    }
  assert.ok(W.levelOf(ride, 1).distinct >= 2, "level 1's first two groups");
});

test("RIDE-08: the car is shown mirrored, its opening and show box mirrored with it (the road still goes by right to left)", () => {
  const fr = ride.view.frame;
  assert.equal(fr.flip, true);
  const v = W.frameView(fr);
  assert.deepEqual(v.opening, [fr.w - fr.opening[2], fr.opening[1], fr.w - fr.opening[0], fr.opening[3]]);
  assert.deepEqual(v.show, [fr.w - fr.show[2], fr.show[1], fr.w - fr.show[0], fr.show[3]]);
  assert.deepEqual(v.mirrorAt, [fr.w - fr.mirrorAt[1], fr.w - fr.mirrorAt[0]]);
  assert.ok(!/to right/.test(v.edges.top) && /to left/.test(v.edges.top));
  assert.deepEqual(W.frameView(Object.assign({}, fr, { flip: false })).opening, fr.opening, "unflipped: as drawn");
});
