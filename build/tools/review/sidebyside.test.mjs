// sidebyside.mjs and the key frames (s19-checks, Sprint 19 parts 2 and 3): the flows it plays, the rubric's questions by moment, the
// judge's batch, and the key-frame recorder's choices. No browser. Run: node --test build/tools/review/sidebyside.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { flowsFor, slug, rubricByMoment, batchText, MOMENTS, GAMES } from "./sidebyside.mjs";
import { stripWhy, stateMoment, pickMid, KEY_MOMENTS, BEFORE_MS, AFTER_MS, FRAME_MS } from "../../sandbox/lib/keyframes.mjs";

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
