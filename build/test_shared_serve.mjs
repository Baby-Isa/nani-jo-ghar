// Serving to a customer (Sprint 18, piece 8; js/shared/serve.js): the faces' layout against the reference game's own lines
// (js/cook/stations/chai-tray.js at 34641d3, review()), and the tick-and-recast loop (decision 51, CK-23) against the reference's
// rules: a right dish stays done, a wrong one is said again and redone, its third wrong try is shown, "oops" only on a first try.
//   node --test build/test_shared_serve.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { NjgServe as V } from "../js/shared/serve.js";

// the reference, copied as it is (wells: {x, y, w}; trayX: the tray's left; vr: the view's right)
function refLayout(ws, trayX, vr) {
  let gap = 400;
  ws.forEach((a, i) => ws.forEach((b, j) => j > i && (gap = Math.min(gap, Math.hypot(a.x - b.x, a.y - b.y)))));
  const size = ws.length > 1 ? Math.max(96, Math.min(130, gap * 0.62)) : 150;
  const off = (q) => (((q.w || 120) / 2 + size / 2) * 0.74);
  const CARD_W = 230;
  let praise = ws.length - 1;
  let side = "right";
  if (ws[praise].x - off(ws[praise]) + size / 2 + 18 + CARD_W > vr - 16) {
    praise = ws.reduce((b, q, j) => (q.x < ws[b].x ? j : b), 0);
    side = "left";
  }
  return ws.map((q, i) => ({ x: Math.max(trayX + size / 2 + 6, q.x - off(q)), y: q.y - off(q), size, side: i === praise ? side : "right", praise: i === praise }));
}

test("layout: the reference's faces (place, size, praise side) for one to four glasses on trays across the row", () => {
  const offs = [[0.283, 0.29], [0.717, 0.29], [0.283, 0.708], [0.717, 0.708]];
  let tried = 0;
  for (const n of [1, 2, 3, 4])
    for (const trayX of [700, 1000, 1180])
      for (const trayD of [280, 340, 392])
        for (const vr of [1500, 1600, 1800]) {
          const ws = offs.slice(0, n).map(([fx, fy]) => ({ x: trayX + fx * trayD, y: 200 + fy * trayD, w: trayD * 0.33 }));
          assert.deepEqual(V.layout(ws, { left: trayX, right: vr }), refLayout(ws, trayX, vr), `${n} ${trayX} ${trayD} ${vr}`);
          tried++;
        }
  assert.equal(tried, 108);
});

// a game in miniature: dishes with a right answer, a child who gets some wrong until told
function game({ wrongTries }) {
  const log = [];
  const tries = {};
  const items = Object.keys(wrongTries).map((who) => ({ who }));
  const tracker = { n: {}, wrong(k) { this.n[k] = (this.n[k] || 0) + 1; return { tries: this.n[k], action: this.n[k] >= 3 ? "show" : "redo" }; } };
  const o = {
    items,
    done: async (r) => log.push(`done ${r}`),
    check: (it, r) => {
      tries[it.who] = (tries[it.who] || 0) + 1;
      const ok = tries[it.who] > wrongTries[it.who];
      log.push(`check ${it.who} ${r} ${ok ? "ok" : "wrong"}`);
      return { ok, rows: ok ? null : ["row"] };
    },
    onRight: (it) => log.push(`right ${it.who}`),
    review: async (wrong, r) => (log.push(`faces ${r} ${wrong.map((w) => w.who).join(",") || "-"}`), [{ close: async () => log.push("close") }]),
    oops: async () => log.push("oops"),
    recast: async (it) => log.push(`recast ${it.who}`),
    afterReview: () => log.push("after"),
    redo: tracker,
    key: (it) => `dish:${it.who}`,
    showRight: async (it) => log.push(`show ${it.who}`),
    reset: (it) => log.push(`reset ${it.who}`),
    again: (its, r) => log.push(`again ${r} ${its.map((i) => i.who).join(",")}`),
  };
  return { o, log };
}

test("round: all right first time: one tick, the faces, no recast", async () => {
  const { o, log } = game({ wrongTries: { a: 0, b: 0 } });
  const r = await V.round(o);
  assert.equal(r.rounds, 1);
  assert.deepEqual(log, ["done 0", "check a 0 ok", "right a", "check b 0 ok", "right b", "faces 0 -", "close", "after"]);
});

test("round: a wrong dish is said again and redone; the right one stays done; oops only on the first try", async () => {
  const { o, log } = game({ wrongTries: { a: 0, b: 1 } });
  await V.round(o);
  assert.deepEqual(log, ["done 0", "check a 0 ok", "right a", "check b 0 wrong", "faces 0 b", "oops", "recast b", "close", "after", "reset b", "again 1 b", "done 1", "check b 1 ok", "right b", "faces 1 -", "close", "after"]);
});

test("round: the third wrong try is shown the right way and the round ends", async () => {
  const { o, log } = game({ wrongTries: { a: 5 } });
  await V.round(o);
  assert.equal(log.filter((l) => l === "oops").length, 1, "oops once");
  assert.equal(log.filter((l) => l.startsWith("recast")).length, 3);
  assert.deepEqual(log.slice(-2), ["after", "show a"]);
});

test("round: without a redo tracker it ends after the first review", async () => {
  const { o, log } = game({ wrongTries: { a: 2 } });
  delete o.redo;
  await V.round(o);
  assert.deepEqual(log, ["done 0", "check a 0 wrong", "faces 0 a", "oops", "recast a", "close", "after"]);
});
