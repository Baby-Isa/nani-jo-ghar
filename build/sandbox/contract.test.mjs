// The contract checks (lib/contract.mjs) on recorded fixtures: real timelines the contract probe recorded on 8 Oct's build
// (build/sandbox/fixtures/contract/), each with a break Zafar caught, and the same timeline with the break mended, which
// must pass. node --test build/sandbox/contract.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse, bubbleOk, inCorner, decided } from "./lib/contract.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const fx = (n) => JSON.parse(readFileSync(join(ROOT, "build", "sandbox", "fixtures", "contract", `${n}.json`), "utf8"));
// fixed clip lengths and a retired list without content hashes, so the tests don't depend on ffprobe or today's art
const clip = () => 0.6;
const retired = [
  { file: "assets/cook/items/tool-knife-t.webp", sha256: null, by: "the new knife", why: "Z8", scope: null },
  { file: "assets/cook/characters/nani-neutral.webp", sha256: null, by: "leaning Nani", why: "Z9", scope: "cook:*:service" },
];
const run = (r) => analyse(r, { root: ROOT, retired, clip });
const of = (out, c) => out.filter((b) => b.check === c);
const clone = (x) => JSON.parse(JSON.stringify(x));

test("contract-1: the waiting room gives its order with no pop-up (8 Oct); with a read-out pop-up that folds, it passes", () => {
  const r = fx("waiting-room");
  const b = of(run(r), "contract-1");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /no request pop-up/);
  assert.equal(b[0].flow, "clinic:waiting");
  assert.ok(b[0].state && b[0].size === "1366x768");
  // mend it: a pop-up opens before the first line, is read out, closes, and an order card shows
  const m = clone(r);
  const first = m.timeline.find((e) => e.type === "line");
  m.timeline.push({ type: "c", k: "popup", open: true, t: first.t - 20 }, { type: "c", k: "popup", open: false, t: first.t + 400 }, { type: "c", k: "side", n: 1, rows: 1, done: 0, t: first.t + 450 });
  const tap = m.timeline.find((e) => e.type === "c" && e.k === "input");
  for (const l of m.timeline.filter((e) => e.type === "line" && e.t < tap.t)) l.t = Math.min(l.t, first.t + 300);
  assert.equal(of(run(m), "contract-1").length, 0);
});

test("contract-1: chaat at level 4, the bowl's step says its order with no pop-up (Z2)", () => {
  const b = of(run(fx("chaat-l4")), "contract-1");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /station2:marble.*no request pop-up/);
  assert.equal(b[0].level, 4);
});

test("contract-2: the waiting room's next button after the greeting (Z7); without it, it passes", () => {
  const r = fx("waiting-room");
  const b = of(run(r), "contract-2");
  assert.ok(b.length >= 1);
  assert.match(b[0].measured, /njg-next/);
  const m = clone(r);
  m.timeline = m.timeline.filter((e) => !(e.type === "c" && (e.k === "buttons" || (e.k === "input" && e.next))));
  assert.equal(of(run(m), "contract-2").length, 0);
  // a count the child ends with Done is not decided; the clinic between stages is
  assert.equal(decided({ cook: { kind: "count" } }, "button#done-btn"), false);
  assert.equal(decided({ clinic: null }, "button.cl-go"), true);
  assert.equal(decided({ heal: { do: "button" } }, "button.cl-go"), true);
});

test("contract-3: a clip still sounding after its station ended (chaat L4's Bas!); stopped at the end, it passes", () => {
  const r = fx("chaat-l4");
  const b = of(run(r), "contract-3");
  assert.ok(b.some((x) => /Bas!.*past the end of cook:station1:wood/.test(x.measured)));
  // mend it: every clip stops 100 ms after the stage it was said in ends
  const m = clone(r);
  const stages = m.timeline.filter((e) => e.type === "c" && e.k === "stage").map((e) => e.t);
  for (const p of m.timeline.filter((e) => e.type === "play")) {
    const end = stages.find((t) => t > p.t);
    if (end) { m.timeline = m.timeline.filter((e) => !(e.type === "play-end" && e.pid === p.pid)); m.timeline.push({ type: "play-end", pid: p.pid, why: "stop", t: Math.min(end + 100, p.t + p.dur * 1000) }); }
  }
  assert.equal(of(run(m), "contract-3").length, 0);
});

test("contract-3: the pantry's last line runs on after the pantry ended (Z5), at a child's pace; a voice stop at the end mends it", () => {
  const r = fx("round-speed1");
  const b = of(run(r), "contract-3");
  assert.ok(b.some((x) => /past the end of host:cook\/pantry\|cook:station1:pantry/.test(x.measured)), JSON.stringify(b.map((x) => x.measured)));
  const m = clone(r);
  for (const e of m.timeline.filter((e) => e.type === "c" && e.k === "stage")) m.timeline.push({ type: "voice-stop", why: "stage end", t: e.t });
  m.timeline.sort((a, z) => a.t - z.t);
  // every clip is cut at its stage's end too
  const stages = m.timeline.filter((e) => e.type === "c" && e.k === "stage").map((e) => e.t);
  for (const p of m.timeline.filter((e) => e.type === "play")) { const end = stages.find((t) => t > p.t); if (end) m.timeline.push({ type: "play-end", pid: p.pid, why: "stop", t: end }); }
  m.timeline.sort((a, z) => a.t - z.t);
  assert.equal(of(run(m), "contract-3").length, 0);
});

test("contract-4: the diagnosis bubbles at a phone (Z1): not at the speaker's head; above it, they pass", () => {
  const r = fx("diagnosis-phone");
  const b = of(run(r), "contract-4");
  assert.ok(b.length >= 2);
  assert.ok(b.some((x) => /patient's bubble/.test(x.measured)) && b.some((x) => /doctor's bubble/.test(x.measured)));
  // the geometry alone
  const head = { box: { l: 400, t: 200, r: 460, b: 260 } };
  assert.equal(bubbleOk({ box: { l: 380, t: 120, r: 520, b: 190 }, tail: { x: 430, y: 195 } }, head).ok, true, "above, tail in the head's column");
  assert.equal(bubbleOk({ box: { l: 380, t: 270, r: 520, b: 330 }, tail: null }, head).ok, true, "below");
  assert.equal(bubbleOk({ box: { l: 470, t: 200, r: 600, b: 250 }, tail: null }, head).ok, false, "beside");
  assert.equal(bubbleOk({ box: { l: 380, t: 120, r: 520, b: 190 }, tail: { x: 515, y: 195 } }, head).ok, false, "the tail outside the column");
  assert.equal(inCorner({ box: { l: 1200, t: 10, r: 1356, b: 80 } }, { l: 0, t: 0, r: 1366, b: 768 }), "top-right");
  // mend the fixture: every bubble moved just above its nearest head
  const m = clone(r);
  for (const e of m.timeline.filter((e) => e.type === "c" && e.k === "bubble")) for (const bb of e.list) {
    const hs = e.heads.filter((h) => h.who === bb.who && h.src !== "fig-art");
    const h = hs.find((x) => !/cl-doc/.test(x.src)) || hs[0];
    if (!h) continue;
    let { l, t, r: rr } = h.box;
    if (/cl-doc/.test(h.src)) { const w = rr - l; l += w * 0.25; rr -= w * 0.25; }
    const w = 120, cx = (l + rr) / 2;
    bb.box = { l: Math.round(cx - w / 2), t: t - 60, r: Math.round(cx + w / 2), b: t - 4 };
    bb.tail = null;
    e.heads = e.heads.filter((x) => x === h || x.who !== bb.who);
  }
  const left = of(run(m), "contract-4");
  assert.equal(left.length, 0, JSON.stringify(left.map((x) => x.measured)));
});

test("contract-5: the end screen's bulb shows before the second badge (Z4); in order, it passes", () => {
  const r = fx("pantry-hint-phone");
  const b = of(run(r), "contract-5");
  assert.equal(b.length, 1);
  assert.match(b[0].measured, /badge 3 \(hints\) showed before badge 2/);
  const m = clone(r);
  let k = 0;
  for (const e of m.timeline.filter((e) => e.type === "c" && e.k === "badges")) { e.t = m.timeline[0].t + 1e6 + k++ * 400; }
  const bs = m.timeline.filter((e) => e.type === "c" && e.k === "badges" && e.list.some((x) => x.vis > 0));
  bs.forEach((e, i) => e.list.forEach((x, j) => (x.vis = j <= i ? 1 : 0)));
  m.timeline.sort((a, z) => a.t - z.t);
  assert.equal(of(run(m), "contract-5").length, 0);
});

test("contract-6: the old hand-and-knife at the chopping board (Z8) and standing Nani in service (Z9); redrawn art passes", () => {
  const b6 = of(run(fx("chaat-l4")), "contract-6");
  assert.ok(b6.some((x) => /tool-knife-t\.webp/.test(x.measured)));
  const n6 = of(run(fx("round-speed1")), "contract-6");
  assert.ok(n6.some((x) => /cook:between1:service: drew assets\/cook\/characters\/nani-neutral\.webp/.test(x.measured)));
  // the same file with new content (a hash that no longer matches) is not the old picture
  const fresh = analyse(fx("chaat-l4"), { root: ROOT, clip, retired: [{ ...retired[0], sha256: "0000000000000000" }] });
  assert.equal(of(fresh, "contract-6").length, 0);
  // out of its scope (Nani outside service) it is not flagged
  const scoped = analyse(fx("chaat-l4"), { root: ROOT, clip, retired: [{ ...retired[1], file: "assets/cook/items/tool-knife-t.webp" }] });
  assert.equal(of(scoped, "contract-6").length, 0);
});
