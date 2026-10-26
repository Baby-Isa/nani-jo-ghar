// SH-131 (S13-A2): the light bulb on a page without js/shared/tokens.js (the parked games: Find it, Dress up, Snap) still shows its
// English for the ONE ladder table's time (data/shared.json bulbMs), never 0 s. js/shared/bulb.js is run as a page script in a bare
// window (no Tokens, no module), its fetch answered from the repo's data/shared.json.
//   node --test build/test_shared_bulb.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = readFileSync(join(ROOT, "js/shared/bulb.js"), "utf8");
const TABLE = JSON.parse(readFileSync(join(ROOT, "data/shared.json"), "utf8")).bulbMs;

// a parked page: a window with no Tokens; the bulb's script tag at <base>/js/shared/bulb.js
function parkedPage(base = "http://localhost:8000/") {
  const asked = [];
  const w = {
    document: { currentScript: { src: `${base}js/shared/bulb.js?v=20261026T131724Z` } },
    fetch: async (url) => {
      asked.push(String(url));
      return { ok: true, json: async () => JSON.parse(readFileSync(join(ROOT, "data/shared.json"), "utf8")) };
    },
    setTimeout,
    clearTimeout,
  };
  w.globalThis = w;
  w.self = w;
  w.window = w;
  vm.runInNewContext(SRC, w, { filename: "bulb.js" });
  return { w, asked };
}

test("a page without tokens.js: the bulb reads data/shared.json's bulbMs itself (SH-131)", async () => {
  const { w, asked } = parkedPage();
  assert.equal(w.Tokens, undefined);
  assert.ok(w.Bulb, "window.Bulb defined");
  await w.Bulb.ready;
  assert.deepEqual(Array.from(w.Bulb.MS), TABLE);
  assert.ok(asked.some((u) => u.startsWith("http://localhost:8000/data/shared.json")), `asked ${asked.join(", ")}`);
});

test("its English shows for the table's time at every level, never 0 s", async () => {
  const { w } = parkedPage();
  await w.Bulb.ready;
  for (let lv = 1; lv <= 5; lv++) {
    const b = w.Bulb.create(null, { level: lv, click: false });
    const ms = b.duration();
    assert.equal(ms, TABLE[Math.min(TABLE.length, lv) - 1], `level ${lv}`);
    assert.ok(ms >= 7500, `level ${lv}: ${ms} ms`);
  }
});

test("a page that has tokens.js keeps reading Tokens.ladder (no second fetch)", async () => {
  const asked = [];
  const w = { document: null, fetch: async (u) => (asked.push(u), { ok: false }), setTimeout, clearTimeout, Tokens: { ladder: { bulbMs: [9000, 9000, 9000, 9000, 9000] } } };
  w.globalThis = w;
  w.self = w;
  vm.runInNewContext(SRC, w, { filename: "bulb.js" });
  await w.Bulb.ready;
  assert.deepEqual(Array.from(w.Bulb.MS), [9000, 9000, 9000, 9000, 9000]);
  assert.equal(asked.length, 0);
});
