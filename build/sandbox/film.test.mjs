// S14 tools, B1 and B2 (SH-167): the evidence film and the face-box hook. No browser. node --test build/sandbox/film.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sigOf, sigDiff, cropImg, pickKeys, filmMotion, filmTable, filmSummary, FILM_REC_START } from "./lib/film.mjs";
import { parseCapture, MAX_STRIP, FILM_FROM, FILM_KEEP } from "./lib/evidence.mjs";
import { briefProbes, offSlots, FILM_MIN } from "../tools/review/lib/brief.mjs";

const flat = (w, h, v) => ({ w, h, data: Buffer.alloc(w * h * 4, v) });

test("a film is a long strip: 15 to 60 frames parse, 61 does not, and the brief adds no 1 s and 2 s strips beside it", () => {
  assert.equal(FILM_FROM, FILM_MIN, "the tool and the brief agree on what a film is");
  const c = parseCapture("strip:body:60x200");
  assert.equal(c.kind, "strip");
  assert.equal(c.n, 60);
  assert.ok(c.n <= MAX_STRIP);
  assert.ok(parseCapture(`strip:body:${MAX_STRIP + 1}x200`).error);
  const motion = (cap) => [{ flowId: "cook:chai-tray#order-whole", kind: "motion", capture: [parseCapture(cap)], sizes: [], row: "X-1" }];
  const longOne = briefProbes(motion("strip:body:60x200"), { flows: ["cook:chai-tray"] }, parseCapture)[0];
  assert.equal(longOne.capture.length, 1, "a film gets no extra strips");
  const shortOne = briefProbes(motion("strip:body:8x150"), { flows: ["cook:chai-tray"] }, parseCapture)[0];
  assert.equal(shortOne.capture.length, 3, "a short strip still gets its 4x250 and 4x500");
});

test("why the old strip said 'did not change': a glide before the first frame and a card flying after the last one are not in a 1.2 s window; the film sees both", () => {
  // the moments of chai's order at 930x430 (30 Oct, the s14-tools before run): the row glides 0.1 s after the first big card appears,
  // the card flies into the row 1.3 s after it. The old probe: frames at 0, 150 ... 1050 ms after the card is seen (plus the poll's lag)
  const events = [{ at: 100, what: "row glide" }, { at: 1400, what: "card flight" }];
  const window = (start, n, ms) => ({ from: start, to: start + (n - 1) * ms });
  const sees = (w) => events.filter((e) => e.at >= w.from && e.at <= w.to).map((e) => e.what);
  assert.deepEqual(sees(window(250, 8, 150)), [], "the old strip: the glide is over before the first frame, the flight is after the last");
  assert.deepEqual(sees(window(0, 60, 200)), ["row glide", "card flight"], "the film starts at the request and runs 12 s");
});

test("pickKeys: a still stretch costs no frame, a flight gets several, the first and the last always stay", () => {
  const diffs = [0, 8, 0.5, 0, 0, 0, 0, 0, 5, 6, 7, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const keys = pickKeys(diffs, 8);
  assert.ok(keys.length <= 8);
  assert.ok(keys.includes(0) && keys.includes(diffs.length - 1));
  assert.ok(keys.filter((k) => k >= 8 && k <= 12).length >= 2, "the flight gets frames");
  assert.ok(!keys.some((k) => k > 14 && k < diffs.length - 1), "the still end gets none");
  assert.deepEqual(pickKeys([0, 1, 2], 8), [0, 1, 2], "a short strip keeps every frame");
  assert.deepEqual(pickKeys(Array(30).fill(0), 8), [0, 29], "nothing moved: the first and the last");
});

test("filmMotion judges neighbouring frames, not the first against the rest", () => {
  // the picture moves early and then stops: the old measure (each frame against the first) would still see it; one that moves in
  // the middle and returns to the first frame's picture is seen by neighbours only
  assert.equal(filmMotion([0, 9, 9, 0, 0]).moving, true);
  assert.equal(filmMotion([0, 0.01, 0, 0.02]).moving, false);
  assert.equal(filmMotion([0, 0, 0]).max, 0);
});

test("signatures: equal pictures differ by 0, a changed corner shows, different sizes are 255", () => {
  const a = flat(40, 30, 200), b = flat(40, 30, 200);
  assert.equal(sigDiff(sigOf(a), sigOf(b)), 0);
  for (let i = 0; i < 10; i++) b.data[i * 4] = 0;
  assert.ok(sigDiff(sigOf(a, 1), sigOf(b, 1)) > 0);
  assert.equal(sigDiff(sigOf(a), sigOf(flat(20, 20, 200))), 255);
  const c = cropImg(a, 10, 5, 20, 10);
  assert.deepEqual([c.w, c.h, c.data.length], [20, 10, 800]);
});

test("the strip's slots follow the kept frames", () => {
  assert.deepEqual(offSlots([0, 200, 405], 200), [false, false, false]);
  assert.deepEqual(offSlots([0, 600, 1210], 200, 60, [0, 600, 1200]), [false, false, false], "a film's kept frames carry their own slots");
  assert.deepEqual(offSlots([0, 600, 1210], 200), [false, true, true], "without them the slots would be read as frame x ms");
});

test("filmSummary: a card that jumps 110 px in one frame is a break; a smooth slide and a big card clear of every face are not", () => {
  const row = (t, cards, pop = [], faces = [[0, 0, 50, 50]], scroll = 0) => ({ t, cards, row: scroll, pop, fly: [], faces });
  const smooth = [0, 1, 2, 3, 4, 5].map((k) => row(k * 16, { a: 100 - k * 8 }, [[300, 100, 400, 200]], [[0, 0, 50, 50]], k * 8));
  const s1 = filmSummary(smooth);
  assert.equal(s1.maxCardStep, 8);
  assert.equal(s1.maxOnFace, 0);
  const jump = [row(0, { a: 100 }), row(16, { a: 100 }), row(32, { a: -10 })];
  assert.equal(filmSummary(jump).maxCardStep, 110);
  const over = [row(0, {}, [[10, 10, 60, 60]], [[0, 0, 50, 50]])];
  assert.equal(filmSummary(over).maxOnFace, 1600, "a card over a face: the overlap in px squared");
  assert.match(FILM_REC_START, /njgTest/, "the recorder reads the page's face hook");
});

test("the face-box hook exists in Cook's and the clinic's test hooks (B2) and has the shape the checks read", () => {
  const flow = readFileSync(new URL("../../js/cook/flow.js", import.meta.url), "utf8");
  assert.match(flow, /faces\(\) \{[\s\S]*?kind[\s\S]*?"head"[\s\S]*?"circle"/, "Cook: njgTest.cook.faces()");
  assert.match(flow, /njgTest\.faces = \(\) => Cook\.testHook\.faces\(\)/, "Cook: njgTest.faces()");
  const clinic = readFileSync(new URL("../../js/clinic/main.js", import.meta.url), "utf8");
  assert.match(clinic, /njgTest\.clinic\.faces = clinicFaces/, "the clinic: njgTest.clinic.faces()");
  for (const k of ["left", "top", "right", "bottom", "width", "height"]) assert.ok(flow.includes(`${k}:`) || flow.includes(`${k}: `) || /left: a\.x/.test(flow), k);
});

test("the table lists every frame and stars the ones on the sheet", () => {
  const t = filmTable({ times: [0, 210, 400], ms: 200, diffs: [0, 5, 0], facts: [{}, { pop: [[1, 2, 3, 4]], fly: [], row: 12, bub: 1, faces: [1, 2] }, {}], keys: [0, 1] });
  const lines = t.split("\n");
  assert.equal(lines.length, 4);
  assert.match(lines[1], /^\s+0\*/);
  assert.match(lines[2], /1\*.*\[1,2,3,4\]/);
  assert.match(lines[3], /2 /);
  assert.ok(FILM_KEEP >= 8);
});
