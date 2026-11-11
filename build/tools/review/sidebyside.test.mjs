// sidebyside.mjs and the key frames (s19-checks, Sprint 19 parts 2 and 3): the flows it plays, the rubric's questions by moment, the
// judge's batch, and the key-frame recorder's choices. No browser. Run: node --test build/tools/review/sidebyside.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { flowsFor, slug, rubricByMoment, batchText, MOMENTS, GAMES } from "./sidebyside.mjs";
import { stripWhy, stateMoment, pickMid, pickMidFrame, KEY_MOMENTS, BEFORE_MS, AFTER_MS, FRAME_MS } from "../../sandbox/lib/keyframes.mjs";

test("it plays chai and the game at a child's pace, at the level asked", () => {
  assert.deepEqual(flowsFor("maani-line"), ["cook:chai-tray#speed1", "cook:maani-line#speed1"]);
  assert.deepEqual(flowsFor("daar", 3), ["cook:chai-tray@L3#speed1", "cook:daar@L3#speed1"]);
  assert.equal(slug("cook:maani-line@L2#speed1"), "cook-maani-line@L2-speed1");
  assert.ok(GAMES.includes("eggs") && !GAMES.includes("chai-tray"));
  assert.deepEqual(MOMENTS.map((m) => m[0]), KEY_MOMENTS);
});

test("the rubric asks its questions by moment; the code-checked ones are not asked", () => {
  const r = rubricByMoment(readFileSync(new URL("../../../docs/process/eye-judge-rubric.md", import.meta.url), "utf8"));
  for (const m of [...KEY_MOMENTS, "strip"]) assert.ok((r[m] || []).length, `questions at ${m}`);
  assert.ok(r.light.includes(1) && r.strip.includes(39) && r.end.includes(38));
  for (const gone of [3, 11, 13, 15, 21]) assert.ok(!Object.values(r).some((qs) => qs.includes(gone)), `Q${gone} is code now`);
});

test("the batch lists part 1's breaks first, every moment's pictures, a moment not reached as evidence, and the verdict file", () => {
  const man = { pairs: ["740x320/pair-1-order.png", "740x320/pair-2-light.png"], closes: ["740x320/close-1-order.png"], strips: ["740x320/strip-maani-line-01-light.png"], missing: ["maani-line@740x320: praise"] };
  const t = batchText({ game: "maani-line", level: 1, sizes: ["740x320"], man, breaks: ["contract-103 cook:maani-line#speed1 @ 740x320 28.5s: a tick button"], rubric: { order: [8, 9], strip: [39, 40] }, verdicts: "build/screenshots/sidebyside/x/judge-batch.verdicts.md" });
  assert.ok(t.indexOf("contract-103") < t.indexOf("## The pictures"));
  assert.match(t, /\*\*the order in the side panel\*\*: `740x320\/pair-1-order\.png`; close-ups `740x320\/close-1-order\.png`\. Ask: Q8, Q9/);
  assert.match(t, /\*\*well done\*\*: \(no pair\); NOT REACHED: maani-line \(an EVIDENCE note/);
  assert.match(t, /strip-maani-line-01-light\.png`\. Ask: Q39, Q40/);
  assert.match(t, /SHIP\? \| yes/);
  assert.match(t, /WORSE THAN CHAI\?/);
  assert.match(t, /judge-batch\.verdicts\.md/);
});

test("the key frames: a strip starts as a light comes up, a lesson or a rung; the states name the moments; mid is the middle move", () => {
  const st = { lit: false };
  assert.equal(stripWhy({ type: "c", k: "s19lit", holes: [[1, 2, 3, 4]] }, st), "light");
  assert.equal(stripWhy({ type: "c", k: "s19lit", holes: [[1, 2, 3, 5]] }, st), null, "the same light moving is not a new one");
  assert.equal(stripWhy({ type: "c", k: "s19lit", holes: [] }, st), null);
  assert.equal(stripWhy({ type: "c", k: "s19lit", holes: [[1, 2, 3, 4]] }, st), "light");
  assert.equal(stripWhy({ type: "c", k: "life", what: "reveal-lesson" }, st), "lesson");
  assert.equal(stripWhy({ type: "c", k: "life", what: "rung" }, st), "rung");
  assert.equal(stateMoment("order-card-in-sidebar"), "order");
  assert.equal(stateMoment("kind-roll"), "kind");
  assert.equal(stateMoment("view-service"), "serve");
  assert.equal(stateMoment("results-words"), "end");
  assert.equal(stateMoment("start"), null);
  assert.equal(pickMid([{ f: 1 }]), null);
  assert.deepEqual(pickMid([{ f: 1 }, { f: 2 }, { f: 3 }]), { f: 2 });
  assert.ok(BEFORE_MS === 500 && AFTER_MS === 2000 && FRAME_MS >= 100 && FRAME_MS <= 150);
});

test("a strip holds 0.5 s before to 2 s after its moment at even steps: a still screen's slots repeat the last frame, marked", async () => {
  const { KeyFrames, FRAME_MS } = await import("../../sandbox/lib/keyframes.mjs");
  const { mkdtempSync, readFileSync, readdirSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const kf = Object.create(KeyFrames.prototype);
  Object.assign(kf, { dir: mkdtempSync(join(tmpdir(), "kf-")), fb: { buf: [] }, strips: [], cook: [], serving: [], st: { lit: false, lastStrip: -Infinity, station: true }, on: true });
  const T = 100000;
  const push = (f) => { kf.fb.buf.push(f); kf.frame(f); };
  for (let t = T - 1000; t <= T - 200; t += 100) push({ t, jpg: Buffer.from("a" + t) });
  // the light comes at T (a strip starts), the screen is still until T+600, then moves every 100 ms to T+2100
  kf.strips.push({ n: 1, why: "light", t: T, frames: kf.buf.filter((f) => f.t >= T - 500), done: false });
  for (let t = T; t <= T + 600; t += 110) kf.tick(t);
  for (let t = T + 600; t <= T + 2300; t += 100) push({ t, jpg: Buffer.from("b" + t) });
  const d = join(kf.dir, "strip-01-light");
  const meta = JSON.parse(readFileSync(join(d, "strip.json"), "utf8"));
  assert.ok(meta.frames[0].ms <= -400 && meta.frames[meta.frames.length - 1].ms >= 1900, JSON.stringify(meta.frames.map((f) => f.ms)));
  const gaps = meta.frames.slice(1).map((f, i) => f.ms - meta.frames[i].ms);
  assert.ok(Math.max(...gaps) <= 2 * FRAME_MS, `gaps ${gaps}`);
  assert.ok(meta.frames.some((f) => f.held), "the still stretch is filled with marked repeats");
  assert.equal(readdirSync(d).filter((f) => f.endsWith(".jpg")).length, meta.frames.length);
});

test("s19-checks-1: mid-cook is a station frame halfway from the first move to the serve, never the first move's or the end card's", () => {
  const fr = [1000, 2000, 3000, 4000, 5000, 6000].map((t) => ({ t }));
  assert.equal(pickMidFrame(fr, 1000, 6500).t, 4000, "halfway from 1000 to 6500, at least 1.2 s after the move");
  assert.equal(pickMidFrame(fr, 5500, 6200), null, "no frame between the move and the serve: none (never the end card)");
  const st = { lit: false };
  assert.equal(stripWhy({ type: "c", k: "lit", holes: [[1, 2, 3, 4]] }, st), "light", "the kit's frame-timed light starts a strip");
});

test("s19-checks-1: the order frame is the one drawn as the order landed, never one with the first light; the serve is the last frame before the end card", async () => {
  const { KeyFrames } = await import("../../sandbox/lib/keyframes.mjs");
  const { mkdtempSync, readFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const T = Date.now();
  const buf = [{ t: T - 3000, jpg: Buffer.from("order") }, { t: T - 1000, jpg: Buffer.from("lit") }];
  const fb = { buf, before: (t) => buf.filter((f) => f.t < t).pop() || null, subscribe() {}, onTick() {} };
  const page = { evaluate: async () => null, screenshot: async () => {} };
  const kf = new KeyFrames(page, { dir: mkdtempSync(join(tmpdir(), "kf-")), flow: "cook:x", size: "740x320", fb });
  kf.st.station = true;
  kf.onEvent({ type: "c", k: "lit", t: T - 1500, holes: [[1, 2, 3, 4]] }); // (the first light came before the order's state was recorded)
  kf.onState("order-card-in-sidebar");
  kf.onEvent({ type: "c", k: "stage", key: "cook:between1:service", t: T - 900 });
  buf.push({ t: T - 500, jpg: Buffer.from("serve") });
  kf.onEvent({ type: "c", k: "stage", key: "end", t: T - 100 });
  await kf.chain;
  assert.equal(readFileSync(join(kf.dir, kf.keys.order.file), "utf8"), "order");
  assert.equal(readFileSync(join(kf.dir, kf.keys.serve.file), "utf8"), "serve");
});
